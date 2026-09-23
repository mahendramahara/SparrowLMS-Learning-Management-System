const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Enrollment = require('./enrollment.model');
const Course = require('../course/course.model');
const Chapter = require('../course/chapter.model');
const Lesson = require('../course/lesson.model');
const { createNotification } = require('../../utils/notificationDispatcher');

const enrollInCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId || req.body.courseId;

  if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
    res.status(400);
    throw new Error('Valid Course ID is required');
  }

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const existing = await Enrollment.findOne({
    student: req.user._id,
    course: courseId,
  }).populate({
    path: 'course',
    select: 'title subtitle thumbnail category level instructor price',
    populate: [
      { path: 'instructor', select: 'name email avatar' },
      { path: 'category', select: 'name slug' },
    ],
  });

  if (existing) {
    return res.status(200).json({
      success: true,
      message: 'Already enrolled in this course',
      data: existing,
    });
  }

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
  } catch (err) {
    if (err.code === 11000) {
      const existingEnrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
      }).populate({
        path: 'course',
        select: 'title subtitle thumbnail category level instructor price',
        populate: [
          { path: 'instructor', select: 'name email avatar' },
          { path: 'category', select: 'name slug' },
        ],
      });

      return res.status(200).json({
        success: true,
        message: 'Already enrolled in this course',
        data: existingEnrollment,
      });
    }
    throw err;
  }

  await createNotification({
    recipient: req.user._id,
    recipientRole: 'student',
    category: 'Courses',
    type: 'course',
    title: 'Course Enrollment Confirmed',
    message: `You have successfully enrolled in "${course.title}".`,
    priority: 'normal',
    actionUrl: '/student/courses',
    metadata: { courseId: course._id },
  });

  if (course.instructor) {
    await createNotification({
      recipient: course.instructor,
      recipientRole: 'instructor',
      category: 'Courses',
      type: 'course',
      title: 'New Student Enrolled',
      message: `${req.user.name || 'A student'} enrolled in your course "${course.title}".`,
      priority: 'normal',
      actionUrl: '/instructor/courses',
      metadata: { courseId: course._id, studentId: req.user._id },
    });
  }

  await createNotification({
    recipientRole: 'admin',
    category: 'Courses',
    type: 'course',
    title: 'Student Course Enrollment',
    message: `${req.user.name || 'A student'} enrolled in course "${course.title}".`,
    priority: 'low',
    actionUrl: '/admin/courses',
    metadata: { courseId: course._id, studentId: req.user._id },
  });

  const populated = await Enrollment.findById(enrollment._id).populate({
    path: 'course',
    select: 'title subtitle thumbnail category level instructor price',
    populate: [
      { path: 'instructor', select: 'name email avatar' },
      { path: 'category', select: 'name slug' },
    ],
  });

  res.status(201).json({
    success: true,
    message: 'Enrolled in course successfully',
    data: populated,
  });
});

const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({
      path: 'course',
      select: 'title subtitle description thumbnail category level instructor price duration rating reviewCount isPublished',
      populate: [
        { path: 'instructor', select: 'name email avatar' },
        { path: 'category', select: 'name slug' },
      ],
    })
    .sort({ lastAccessedAt: -1 });

  const validEnrollments = enrollments.filter(e => e.course != null);

  res.status(200).json({
    success: true,
    count: validEnrollments.length,
    data: validEnrollments,
  });
});

const checkEnrollmentStatus = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(200).json({ success: true, isEnrolled: false });
  }

  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId,
  });

  res.status(200).json({
    success: true,
    isEnrolled: Boolean(enrollment),
    data: enrollment || null,
  });
});

const updateLessonProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { lessonId } = req.body;

  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId,
  });

  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment record not found');
  }

  if (lessonId && !enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
  }

  const chapters = await Chapter.find({ courseId }).select('_id');
  const chapterIds = chapters.map(c => c._id);
  const totalLessons = await Lesson.countDocuments({ chapterId: { $in: chapterIds } });

  if (totalLessons > 0) {
    enrollment.progress = Math.min(
      100,
      Math.round((enrollment.completedLessons.length / totalLessons) * 100)
    );
  }

  if (enrollment.progress >= 100) {
    enrollment.status = 'completed';
  }

  enrollment.lastAccessedAt = new Date();
  await enrollment.save();

  res.status(200).json({
    success: true,
    data: enrollment,
  });
});

const getStudentDashboard = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const enrollments = await Enrollment.find({ student: studentId })
    .populate({
      path: 'course',
      select: 'title subtitle thumbnail category level instructor price duration rating reviewCount chapters',
      populate: [
        { path: 'instructor', select: 'name email avatar' },
        { path: 'category', select: 'name slug' },
      ],
    })
    .sort({ lastAccessedAt: -1 });

  const validEnrollments = enrollments.filter(e => e.course != null);
  const total = validEnrollments.length;
  const completed = validEnrollments.filter(e => (e.progress || 0) >= 100 || e.status === 'completed').length;
  const inProgress = total - completed;

  const totalStudyHours = Math.round(validEnrollments.reduce((sum, e) => sum + (e.progress * 0.15 || 0), 0) * 10) / 10;
  const avgProgress = total > 0 ? Math.round(validEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / total) : 0;

  const courses = validEnrollments.map(e => {
    const c = e.course;
    const catName = c.category?.name || 'General';
    return {
      id: c._id,
      courseId: c._id,
      title: c.title,
      category: catName,
      status: (e.progress >= 100 || e.status === 'completed') ? 'Completed' : 'In Progress',
      progress: e.progress || 0,
      completedLessons: e.completedLessons?.length || Math.round((e.progress || 0) / 10),
      totalLessons: 10,
      icon: 'code',
      iconBg: 'rgba(37, 99, 235, 0.1)',
      iconColor: '#2563eb',
      thumbnail: c.thumbnail || '',
      instructor: c.instructor?.name || 'Instructor',
    };
  });

  const featured = validEnrollments[0] || null;

  const stats = [
    {
      id: 'enrolled',
      title: 'Enrolled Courses',
      value: String(total),
      trend: `${total} total enrolled`,
      icon: 'book',
      iconBg: 'rgba(37, 99, 235, 0.12)',
      iconColor: '#2563eb',
    },
    {
      id: 'completed',
      title: 'Completed Courses',
      value: String(completed),
      trend: `${completed} finished`,
      icon: 'check',
      iconBg: 'rgba(16, 185, 129, 0.12)',
      iconColor: '#059669',
    },
    {
      id: 'hours',
      title: 'Total Study Hours',
      value: String(totalStudyHours || 0),
      trend: `${inProgress} courses in progress`,
      icon: 'clock',
      iconBg: 'rgba(147, 51, 234, 0.12)',
      iconColor: '#9333ea',
    },
    {
      id: 'progress',
      title: 'Average Progress',
      value: `${avgProgress}%`,
      trend: 'Overall completion',
      icon: 'award',
      iconBg: 'rgba(245, 158, 11, 0.12)',
      iconColor: '#d97706',
    },
  ];

  const recentActivity = validEnrollments.slice(0, 4).map(e => ({
    id: `act_${e._id}`,
    title: e.progress >= 100 ? 'Course completed' : 'Lesson studied',
    detail: `${e.course?.title} (${e.progress || 0}%)`,
    time: new Date(e.lastAccessedAt || e.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    icon: 'book',
  }));

  res.status(200).json({
    success: true,
    data: {
      stats,
      courses,
      featuredCourse: featured ? {
        tag: 'CONTINUE LEARNING',
        title: featured.course.title,
        description: featured.course.subtitle || 'Pick up where you left off in your learning journey.',
        lessonsCount: '10 Lessons',
        duration: `${featured.course.duration || 4} hours`,
        level: featured.course.level || 'All Levels',
        courseId: featured.course._id,
        progress: featured.progress || 0,
      } : null,
      continueLearning: featured ? {
        title: featured.course.title,
        courseId: featured.course._id,
        progress: featured.progress || 0,
        lesson: 'Current Lesson',
      } : null,
      recentActivity,
    },
  });
});

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollmentStatus,
  updateLessonProgress,
  getStudentDashboard,
};
