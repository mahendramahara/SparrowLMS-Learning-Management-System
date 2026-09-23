const express = require('express');
const {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollmentStatus,
  updateLessonProgress,
  getStudentDashboard,
} = require('./enrollment.controller');
const { protect } = require('../../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/dashboard', getStudentDashboard);
router.post('/', enrollInCourse);
router.post('/course/:courseId', enrollInCourse);
router.get('/my-enrollments', getMyEnrollments);
router.get('/check/:courseId', checkEnrollmentStatus);
router.patch('/course/:courseId/progress', updateLessonProgress);

module.exports = router;
