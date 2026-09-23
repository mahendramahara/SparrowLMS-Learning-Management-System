const express = require('express');
const {
  getCourses,
  getCourseById,
  getMyCourses,
  createCourse,
  updateCourse,
  togglePublish,
  deleteCourse,
} = require('./course.controller');
const { protect, authorize } = require('../../middleware/authMiddleware');
const assignmentRoutes = require('../assignment/assignment.routes');

const router = express.Router();

router.use('/:courseId/assignments', assignmentRoutes);

router.route('/').get(getCourses).post(protect, authorize('instructor', 'admin'), createCourse);

router.get('/my-courses', protect, authorize('instructor', 'admin'), getMyCourses);

router
  .route('/:id')
  .get(getCourseById)
  .put(protect, authorize('instructor', 'admin'), updateCourse)
  .delete(protect, authorize('instructor', 'admin'), deleteCourse);

router.patch('/:id/publish', protect, authorize('instructor', 'admin'), togglePublish);

module.exports = router;
