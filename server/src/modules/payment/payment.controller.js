const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Payment = require('./payment.model');
const Course = require('../course/course.model');
const Enrollment = require('../enrollment/enrollment.model');
const SystemSettings = require('../admin/systemSettings.model');
const { initiateEsewaPayment, verifyEsewaSignature, checkEsewaStatus, ESEWA_PRODUCT_CODE } = require('../../utils/esewa');
const { createNotification } = require('../../utils/notificationDispatcher');

const createPayment = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
    res.status(400);
    throw new Error('Valid Course ID is required');
  }

  const course = await Course.findById(courseId).populate('instructor', 'name email');
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const existingEnrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId,
  });

  if (existingEnrollment) {
    return res.status(200).json({
      success: true,
      message: 'Already enrolled in this course',
      alreadyEnrolled: true,
      data: { enrollmentId: existingEnrollment._id },
    });
  }

  const settings = await SystemSettings.findOne();
  const payoutPct = settings?.payoutPercentage ?? 80;
  const coursePrice = Number(course.price) || 0;

  if (coursePrice === 0) {
    let enrollment;
    try {
      enrollment = await Enrollment.create({
        student: req.user._id,
        course: courseId,
        status: 'active',
        progress: 0,
        enrolledAt: new Date(),
        lastAccessedAt: new Date(),
      });
      await Course.findByIdAndUpdate(courseId, { $inc: { enrolled: 1 } });
    } catch (createErr) {
      if (createErr.code === 11000) {
        enrollment = await Enrollment.findOne({
          student: req.user._id,
          course: courseId,
        });
      } else {
        throw createErr;
      }
    }

    const payment = await Payment.create({
      student: req.user._id,
      course: courseId,
      instructor: course.instructor?._id || course.instructor,
      amount: 0,
      instructorAmount: 0,
      platformFee: 0,
      paymentGateway: 'free',
      transactionUuid: `FREE-${Date.now()}-${req.user._id.toString().slice(-4)}`,
      transactionCode: 'FREE_ENROLL',
      status: 'COMPLETE',
    });

    await createNotification({
      recipient: req.user._id,
      recipientRole: 'student',
      category: 'Courses',
      type: 'course',
      title: 'Free Enrollment Confirmed',
      message: `You have successfully enrolled in "${course.title}".`,
      actionUrl: '/student/courses',
      metadata: { courseId: course._id },
    });

    return res.status(200).json({
      success: true,
      isFree: true,
      message: 'Enrolled in free course successfully',
      data: { enrollment, payment },
    });
  }

  const transactionUuid = `${Date.now()}-${req.user._id.toString().slice(-4)}-${course._id.toString().slice(-4)}`;
  const instructorShare = Math.round((coursePrice * payoutPct) / 100);
  const platformShare = coursePrice - instructorShare;

  await Payment.create({
    student: req.user._id,
    course: course._id,
    instructor: course.instructor?._id || course.instructor,
    amount: coursePrice,
    instructorAmount: instructorShare,
    platformFee: platformShare,
    paymentGateway: 'esewa',
    transactionUuid,
    status: 'PENDING',
  });

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const successUrl = `${frontendUrl}/payment/success`;
  const failureUrl = `${frontendUrl}/payment/failure`;

  const esewaData = initiateEsewaPayment({
    amount: coursePrice,
    transactionUuid,
    successUrl,
    failureUrl,
  });

  res.status(200).json({
    success: true,
    isFree: false,
    message: 'Payment initiated with eSewa',
    data: {
      ...esewaData,
      course: {
        id: course._id,
        title: course.title,
        price: coursePrice,
      },
    },
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { encodedData, transactionUuid, totalAmount } = req.body;

  let decoded = null;
  if (encodedData) {
    try {
      const decodedStr = Buffer.from(encodedData, 'base64').toString('utf-8');
      decoded = JSON.parse(decodedStr);
    } catch (e) {
      void e;
    }
  }

  const uuid = decoded?.transaction_uuid || transactionUuid;
  if (!uuid) {
    res.status(400);
    throw new Error('Transaction identifier is required for verification');
  }

  const payment = await Payment.findOne({ transactionUuid: uuid })
    .populate('course')
    .populate('instructor', 'name email');

  if (!payment) {
    res.status(404);
    throw new Error('Payment record not found');
  }

  if (payment.status === 'COMPLETE') {
    const existingEnrollment = await Enrollment.findOne({
      student: payment.student,
      course: payment.course?._id || payment.course,
    });
    return res.status(200).json({
      success: true,
      message: 'Payment already verified and completed',
      data: {
        payment,
        enrollment: existingEnrollment,
      },
    });
  }

  let isVerified = false;
  if (decoded) {
    const signatureValid = verifyEsewaSignature(decoded);
    if (signatureValid && decoded.status === 'COMPLETE') {
      isVerified = true;
      payment.transactionCode = decoded.transaction_code || '';
      payment.rawResponse = decoded;
    }
  }

  if (!isVerified) {
    const statusResult = await checkEsewaStatus({
      productCode: ESEWA_PRODUCT_CODE,
      totalAmount: decoded?.total_amount || totalAmount || payment.amount,
      transactionUuid: uuid,
    });

    if (statusResult?.status === 'COMPLETE') {
      isVerified = true;
      payment.refId = statusResult.ref_id || '';
      payment.transactionCode = statusResult.ref_id || payment.transactionCode;
      payment.rawResponse = statusResult;
    }
  }

  if (!isVerified) {
    payment.status = 'FAILED';
    await payment.save();
    res.status(400);
    throw new Error('Payment verification failed with eSewa');
  }

  payment.status = 'COMPLETE';
  await payment.save();

  let enrollment = await Enrollment.findOne({
    student: payment.student,
    course: payment.course._id,
  });

  if (!enrollment) {
    try {
      enrollment = await Enrollment.create({
        student: payment.student,
        course: payment.course._id,
        status: 'active',
        progress: 0,
        enrolledAt: new Date(),
        lastAccessedAt: new Date(),
      });

      await Course.findByIdAndUpdate(payment.course._id, { $inc: { enrolled: 1 } });
    } catch (createErr) {
      if (createErr.code === 11000) {
        enrollment = await Enrollment.findOne({
          student: payment.student,
          course: payment.course._id,
        });
      } else {
        throw createErr;
      }
    }
  }

  await createNotification({
    recipient: payment.student,
    recipientRole: 'student',
    category: 'Billing',
    type: 'payment',
    title: 'Payment Successful',
    message: `Your payment of NPR ${payment.amount} for "${payment.course?.title}" was successful.`,
    priority: 'high',
    actionUrl: '/student/courses',
    metadata: { courseId: payment.course._id, paymentId: payment._id },
  });

  if (payment.instructor) {
    await createNotification({
      recipient: payment.instructor._id,
      recipientRole: 'instructor',
      category: 'Billing',
      type: 'course',
      title: 'Course Sale & Earning Received',
      message: `A student purchased "${payment.course?.title}". You earned NPR ${payment.instructorAmount}.`,
      priority: 'high',
      actionUrl: '/instructor/earnings',
      metadata: { courseId: payment.course._id, paymentId: payment._id },
    });
  }

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully and course enrolled',
    data: {
      payment,
      enrollment,
    },
  });
});

const getMyPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ student: req.user._id })
    .populate('course', 'title thumbnail category level price duration')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments,
  });
});

const getInstructorEarnings = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;

  const payments = await Payment.find({
    instructor: instructorId,
    status: 'COMPLETE',
  })
    .populate('course', 'title category thumbnail')
    .populate('student', 'name email avatar')
    .sort({ createdAt: -1 });

  const totalEarnings = payments.reduce((sum, p) => sum + (p.instructorAmount || 0), 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthPayments = payments.filter(p => new Date(p.createdAt) >= startOfMonth);
  const thisMonthEarnings = thisMonthPayments.reduce((sum, p) => sum + (p.instructorAmount || 0), 0);

  const pendingPayout = Math.round(thisMonthEarnings);

  const transactions = payments.map(p => ({
    id: p._id,
    desc: `Course Sale: ${p.course?.title || 'Course'}`,
    studentName: p.student?.name || 'Student',
    courseTitle: p.course?.title || 'Course',
    amount: `NPR ${p.instructorAmount}`,
    originalPrice: `NPR ${p.amount}`,
    date: new Date(p.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    status: p.status,
    refId: p.refId || p.transactionCode || p.transactionUuid,
  }));

  res.status(200).json({
    success: true,
    data: {
      totalEarnings: `NPR ${totalEarnings.toLocaleString()}`,
      thisMonth: `NPR ${thisMonthEarnings.toLocaleString()}`,
      pendingPayout: `NPR ${pendingPayout.toLocaleString()}`,
      totalSalesCount: payments.length,
      transactions,
    },
  });
});

module.exports = {
  createPayment,
  verifyPayment,
  getMyPaymentHistory,
  getInstructorEarnings,
};
