const express = require('express');
const {
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
router.put('/users/:id/status', toggleUserStatus);
router.get('/courses', getAllCourses);
router.put('/courses/:id/approve', approveCourse);
router.get('/enrollments', getAllEnrollments);
router.get('/reports', getFinancialReports);
router.get('/logs', getSystemLogs);
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);

module.exports = router;

