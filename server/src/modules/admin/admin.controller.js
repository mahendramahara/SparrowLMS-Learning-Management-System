const asyncHandler = require('express-async-handler');
const User = require('../user/user.model');
const Course = require('../course/course.model');
const demoAnalytics = require('../../demo/analytics.json');

const getDashboardStats = asyncHandler(async (req, res) => {
  if (req.user.isDemo) {
    return res.status(200).json({
      success: true,
      data: {
        ...demoAnalytics.systemHealth,
        isDemo: true,
      },
    });
  }

  const totalUsers = await User.countDocuments();
  const totalCourses = await Course.countDocuments();
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalInstructors = await User.countDocuments({ role: 'instructor' });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalCourses,
      totalStudents,
      totalInstructors,
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
    throw new Error('Invalid role');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

const getAllCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isPublished } = req.query;

  const query = {};
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const courses = await Course.find(query)
    .populate('instructor', 'name email')
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

module.exports = {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllCourses,
  approveCourse,
};
