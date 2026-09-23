const express = require('express');
const {
  getInstructorDashboard,
  getMyCourses,
  getMyStudents,
  publishCourse,
  unpublishCourse,
  getCourseAnalytics,
} = require('./instructor.controller');
const { protect, authorize, restrictDemo } = require('../../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('instructor', 'admin'));
router.use(restrictDemo);

router.get('/dashboard', getInstructorDashboard);
router.get('/courses', getMyCourses);
router.get('/students', getMyStudents);
router.put('/courses/:id/publish', publishCourse);
router.put('/courses/:id/unpublish', unpublishCourse);
router.get('/courses/:id/analytics', getCourseAnalytics);
router.get('/earnings', require('../payment/payment.controller').getInstructorEarnings);

module.exports = router;
