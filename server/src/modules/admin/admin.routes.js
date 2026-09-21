const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllCourses,
  approveCourse,
} = require('./admin.controller');
const { protect, authorize, restrictDemo } = require('../../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));
router.use(restrictDemo);

router.get('/dashboard/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);
router.get('/courses', getAllCourses);
router.put('/courses/:id/approve', approveCourse);

module.exports = router;
