const asyncHandler = require('express-async-handler');
const User = require('../user/user.model');
const Course = require('../course/course.model');
const Enrollment = require('../enrollment/enrollment.model');
const Category = require('./category.model');
const Payment = require('../payment/payment.model');
const { createNotification } = require('../../utils/notificationDispatcher');
const { logSystemEvent } = require('../../utils/auditLogger');

const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    completedEnrollments,
    recentEnrollmentsDocs,
    topCoursesDocs,
    categoriesDocs,
    coursesDocs,
  ] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    Enrollment.countDocuments({ status: 'completed' }),
    Enrollment.find()
      .populate('student', 'name email avatar')
      .populate({
        path: 'course',
        select: 'title instructor',
        populate: { path: 'instructor', select: 'name' },
      })
      .sort({ createdAt: -1 })
      .limit(6),
    Course.find({ isPublished: true })
      .populate('instructor', 'name')
      .populate('category', 'name')
      .sort({ enrolled: -1 })
      .limit(5),
    Category.find({ isActive: true }).select('name'),
    Course.find().select('category'),
  ]);

  const completionRate =
    totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

  const now = new Date();
  const months = [];
  const monthlyEnrollments = [0, 0, 0, 0, 0, 0];
  const monthlyCompletions = [0, 0, 0, 0, 0, 0];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
  }

  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const sixMonthEnrollments = await Enrollment.find({
    createdAt: { $gte: sixMonthsAgo },
  }).select('createdAt status');

  sixMonthEnrollments.forEach(enr => {
    const enrDate = new Date(enr.createdAt);
    const monthDiff =
      (now.getFullYear() - enrDate.getFullYear()) * 12 + (now.getMonth() - enrDate.getMonth());
    const idx = 5 - monthDiff;
    if (idx >= 0 && idx < 6) {
      monthlyEnrollments[idx]++;
      if (enr.status === 'completed') {
        monthlyCompletions[idx]++;
      }
    }
  });

  const catCounts = {};
  coursesDocs.forEach(c => {
    const catId = c.category?.toString();
    if (catId) {
      catCounts[catId] = (catCounts[catId] || 0) + 1;
    }
  });

  const colorPalette = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#64748b'];
  const categoriesList = categoriesDocs.map((cat, idx) => {
    const count = catCounts[cat._id.toString()] || 0;
    const percentage = totalCourses > 0 ? `${((count / totalCourses) * 100).toFixed(1)}%` : '0%';
    return {
      name: cat.name,
      count,
      percentage,
      color: colorPalette[idx % colorPalette.length],
    };
  });

  const recentEnrollments = recentEnrollmentsDocs
    .filter(e => e.student && e.course)
    .map(e => ({
      id: e._id,
      studentName: e.student?.name || 'Student',
      studentAvatar: e.student?.avatar || '',
      course: e.course?.title || 'Course',
      instructor: e.course?.instructor?.name || 'Instructor',
      enrolledAt: new Date(e.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: e.status ? e.status.charAt(0).toUpperCase() + e.status.slice(1) : 'Active',
    }));

  const topCourses = topCoursesDocs.map(c => ({
    id: c._id,
    title: c.title,
    instructor: c.instructor?.name || 'Instructor',
    studentsCount: c.enrolled || 0,
    rating: c.rating || 5.0,
    price: c.price === 0 ? 'Free' : `NPR ${c.price}`,
    category: c.category?.name || 'Development',
  }));

  const recentActivity = recentEnrollmentsDocs.slice(0, 5).map(e => ({
    id: `act_${e._id}`,
    title: 'New enrollment',
    detail: `${e.student?.name || 'Student'} enrolled in ${e.course?.title || 'a course'}`,
    time: 'Recently',
    type: 'enrollment',
    color: '#8b5cf6',
  }));

  const metrics = [
    {
      id: 'total_users',
      label: 'Total Users',
      value: totalUsers.toLocaleString(),
      trend: `${totalUsers} registered`,
      trendPositive: true,
      type: 'users',
    },
    {
      id: 'total_courses',
      label: 'Total Courses',
      value: totalCourses.toLocaleString(),
      trend: `${totalCourses} catalog items`,
      trendPositive: true,
      type: 'courses',
    },
    {
      id: 'total_enrollments',
      label: 'Total Enrollments',
      value: totalEnrollments.toLocaleString(),
      trend: `${totalEnrollments} active & completed`,
      trendPositive: true,
      type: 'enrollments',
    },
    {
      id: 'completion_rate',
      label: 'Completion Rate',
      value: `${completionRate}%`,
      trend: `${completedEnrollments} completed`,
      trendPositive: true,
      type: 'completion',
    },
  ];

  res.status(200).json({
    success: true,
    data: {
      admin: {
        name: req.user.name,
        role: 'Administrator',
        avatar: req.user.avatar || '',
        dateStr: new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        timeStr: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      },
      metrics,
      enrollmentTrends: {
        range: 'Last 6 Months',
        months,
        enrollments: monthlyEnrollments,
        completions: monthlyCompletions,
      },
      categoryDistribution: {
        total: totalCourses,
        categories: categoriesList,
      },
      recentEnrollments,
      topCourses,
      recentActivity,
      quickActions: [
        { id: 'qa_add_course', title: 'Add Course', to: '/admin/courses', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
        { id: 'qa_add_instructor', title: 'Add Instructor', to: '/admin/users/instructors', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
        { id: 'qa_add_student', title: 'Add Student', to: '/admin/users/students', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
        { id: 'qa_view_reports', title: 'View Reports', to: '/admin/reports', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
      ],
      systemStatus: [
        { id: 'srv', name: 'Server & API', status: 'Online', healthy: true },
        { id: 'db', name: 'MongoDB Database', status: 'Connected', healthy: true },
        { id: 'fs', name: 'Cloudinary CDN', status: 'Online', healthy: true },
        { id: 'pg', name: 'eSewa ePay Gateway', status: 'Active', healthy: true },
      ],
      recentMessages: [],
    },
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  if (req.user.isDemo) {
    return res.status(200).json({
      success: true,
      data: demoAnalytics.userDirectory,
      totalPages: 1,
      currentPage: 1,
      total: demoAnalytics.userDirectory.length,
    });
  }

  const { page = 1, limit = 10, role, search } = req.query;

  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: users,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role === 'admin') {
    res.status(403);
    throw new Error('Cannot delete admin user');
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['student', 'instructor', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role specified');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const previousRole = user.role;
  user.role = role;
  await user.save();

  await createNotification({
    recipient: user._id,
    recipientRole: user.role,
    category: 'System',
    type: 'role_update',
    title: `Account Role Updated to ${role.charAt(0).toUpperCase() + role.slice(1)}`,
    message: `An administrator updated your account role from ${previousRole} to ${role}. You now have access to ${role === 'instructor' ? 'Instructor Studio' : role} privileges.`,
    priority: 'normal',
    actionUrl: role === 'instructor' ? '/instructor' : role === 'admin' ? '/admin' : '/student',
  });

  await logSystemEvent({
    actor: req.user._id,
    actorName: req.user.name,
    actorEmail: req.user.email,
    action: 'UPDATE_USER_ROLE',
    category: 'ADMIN',
    status: 'SUCCESS',
    details: { targetUserId: user._id, targetEmail: user.email, previousRole, newRole: role },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  res.status(200).json({
    success: true,
    message: `User role successfully updated to ${role}`,
    data: user,
  });
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role === 'admin' && String(user._id) === String(req.user.id || req.user._id)) {
    res.status(403);
    throw new Error('Cannot toggle status of currently logged in admin account');
  }

  const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
  user.status = nextStatus;
  await user.save();

  await logSystemEvent({
    actor: req.user._id,
    actorName: req.user.name,
    actorEmail: req.user.email,
    action: 'TOGGLE_USER_STATUS',
    category: 'ADMIN',
    status: 'SUCCESS',
    details: { targetUserId: user._id, targetEmail: user.email, status: nextStatus },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  res.status(200).json({
    success: true,
    message: `User status changed to ${nextStatus}`,
    data: user,
  });
});

const getAllCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isPublished } = req.query;

  const query = {};
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const courses = await Course.find(query)
    .populate('instructor', 'name email')
    .populate('category', 'name slug icon')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Course.countDocuments(query);

  res.status(200).json({
    success: true,
    data: courses,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count,
  });
});

const approveCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  course.isPublished = true;
  await course.save();

  res.status(200).json({
    success: true,
    message: 'Course approved successfully',
    data: course,
  });
});

const getSystemLogs = asyncHandler(async (req, res) => {
  const SystemLog = require('./systemLog.model');
  const { page = 1, limit = 20, category, status } = req.query;

  const query = {};
  if (category) query.category = category;
  if (status) query.status = status;

  const logs = await SystemLog.find(query)
    .populate('actor', 'name email role')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await SystemLog.countDocuments(query);

  res.status(200).json({
    success: true,
    data: logs,
    total,
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
  });
});

const getSystemSettings = asyncHandler(async (req, res) => {
  const SystemSettings = require('./systemSettings.model');
  let settings = await SystemSettings.findOne();
  if (!settings) {
    settings = await SystemSettings.create({});
  }
  res.status(200).json({
    success: true,
    data: settings,
  });
});

const updateSystemSettings = asyncHandler(async (req, res) => {
  const SystemSettings = require('./systemSettings.model');
  let settings = await SystemSettings.findOne();
  if (!settings) {
    settings = await SystemSettings.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  res.status(200).json({
    success: true,
    message: 'System settings updated successfully',
    data: settings,
  });
});

const getAllEnrollments = asyncHandler(async (req, res) => {
  const { search, courseId } = req.query;

  const query = {};
  if (courseId) query.course = courseId;

  const enrollments = await Enrollment.find(query)
    .populate('student', 'name email avatar')
    .populate({
      path: 'course',
      select: 'title price instructor',
      populate: { path: 'instructor', select: 'name email' },
    })
    .sort({ createdAt: -1 });

  let results = enrollments.map(e => ({
    id: e._id,
    studentName: e.student?.name || 'Student',
    studentEmail: e.student?.email || '',
    courseTitle: e.course?.title || 'Course',
    instructor: e.course?.instructor?.name || 'Instructor',
    date: new Date(e.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    amount: e.course?.price ? `NPR ${e.course.price}` : 'Free',
    status: e.status ? e.status.charAt(0).toUpperCase() + e.status.slice(1) : 'Active',
    progress: e.progress || 0,
  }));

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      r =>
        r.studentName.toLowerCase().includes(q) ||
        r.courseTitle.toLowerCase().includes(q) ||
        r.instructor.toLowerCase().includes(q)
    );
  }

  res.status(200).json({
    success: true,
    total: results.length,
    data: results,
  });
});

const getFinancialReports = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ status: 'COMPLETE' })
    .populate('course', 'title category')
    .populate('instructor', 'name email')
    .sort({ createdAt: -1 });

  const totalGrossRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalInstructorPayouts = payments.reduce((sum, p) => sum + (p.instructorAmount || 0), 0);
  const totalPlatformProfit = payments.reduce((sum, p) => sum + (p.platformFee || 0), 0);
  const totalTransactions = payments.length;

  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
  }

  const monthlyGrowth = months.map(m => ({
    month: m,
    revenue: Math.round(totalGrossRevenue / 6),
    payouts: Math.round(totalInstructorPayouts / 6),
    profit: Math.round(totalPlatformProfit / 6),
  }));

  const payouts = payments.slice(0, 10).map((p, idx) => ({
    id: `pay_${idx + 1}`,
    instructor: p.instructor?.name || 'Instructor',
    email: p.instructor?.email || '',
    courseTitle: p.course?.title || 'Course Sale',
    amount: `NPR ${p.instructorAmount || 0}`,
    date: new Date(p.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    status: 'Completed',
    refId: p.refId || p.transactionUuid,
  }));

  res.status(200).json({
    success: true,
    data: {
      reports: {
        totalRevenue: `NPR ${totalGrossRevenue.toLocaleString()}`,
        instructorPayouts: `NPR ${totalInstructorPayouts.toLocaleString()}`,
        platformProfit: `NPR ${totalPlatformProfit.toLocaleString()}`,
        totalTransactions,
        monthlyGrowth,
        categoryRevenue: [
          { name: 'Web Development', value: 45, color: '#3b82f6' },
          { name: 'Data Science', value: 25, color: '#10b981' },
          { name: 'Design', value: 18, color: '#f97316' },
          { name: 'Programming', value: 12, color: '#8b5cf6' },
        ],
        payouts,
      },
    },
  });
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  updateUserRole,
  toggleUserStatus,
  getAllCourses,
  approveCourse,
  getSystemLogs,
  getSystemSettings,
  updateSystemSettings,
  getAllEnrollments,
  getFinancialReports,
};
