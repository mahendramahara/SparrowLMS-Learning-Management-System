const express = require('express');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('./course.controller');
const { protect, authorize } = require('../../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getCourses).post(protect, authorize('instructor', 'admin'), createCourse);

router
  .route('/:id')
  .get(getCourseById)
  .put(protect, authorize('instructor', 'admin'), updateCourse)
  .delete(protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;
