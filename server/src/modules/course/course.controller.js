const asyncHandler = require('express-async-handler');
const Course = require('./course.model');

const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isPublished: true }).populate('instructor', 'name email');

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'name email bio');

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

const createCourse = asyncHandler(async (req, res) => {
  req.body.instructor = req.user.id;

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course,
  });
});

const updateCourse = asyncHandler(async (req, res) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this course');
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this course');
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully',
  });
});

module.exports = { getCourses, getCourseById, createCourse, updateCourse, deleteCourse };
