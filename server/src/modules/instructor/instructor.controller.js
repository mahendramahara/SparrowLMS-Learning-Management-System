const asyncHandler = require('express-async-handler');
const Course = require('../course/course.model');
const demoCourses = require('../../demo/courses.json');
const demoAnalytics = require('../../demo/analytics.json');

const getInstructorDashboard = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;

  if (req.user.isDemo) {
    return res.status(200).json({
      success: true,
      data: {
        ...demoAnalytics.instructorStats,
        isDemo: true,
        instructorName: req.user.name,
      },
    });
  }

  const totalCourses = await Course.countDocuments({ instructor: instructorId });
  const publishedCourses = await Course.countDocuments({
    instructor: instructorId,
    isPublished: true,
  });
  const draftCourses = await Course.countDocuments({
    instructor: instructorId,
    isPublished: false,
  });

  const courses = await Course.find({ instructor: instructorId });
  const totalEnrollments = courses.reduce((sum, course) => sum + course.enrolled, 0);
  const averageRating =
    courses.length > 0
      ? courses.reduce((sum, course) => sum + course.rating, 0) / courses.length
      : 0;

  res.status(200).json({
    success: true,
    data: {
      totalCourses,
      publishedCourses,
      draftCourses,
      totalEnrollments,
      averageRating: averageRating.toFixed(2),
    },
  });
});

const getMyCourses = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;

  if (req.user.isDemo) {
    return res.status(200).json({
      success: true,
      data: demoCourses,
      totalPages: 1,
      currentPage: 1,
      total: demoCourses.length,
    });
  }

  const { page = 1, limit = 10, isPublished } = req.query;

  const query = { instructor: instructorId };
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const courses = await Course.find(query)
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

const getMyStudents = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;

  if (req.user.isDemo) {
    return res.status(200).json({
      success: true,
      data: [
        {
          _id: 'std_01',
          name: 'Aarav Gurung',
          course: 'Distributed Video Processing',
          progress: 65,
          joined: '2026-08-15',
        },
        {
          _id: 'std_02',
          name: 'Pooja Thapa',
          course: 'Scalable Full-Stack Web Development',
          progress: 90,
          joined: '2026-08-20',
        },
        {
          _id: 'std_03',
          name: 'Rohan Shrestha',
          course: 'Distributed Video Processing',
          progress: 40,
          joined: '2026-09-01',
        },
      ],
    });
  }

  const courses = await Course.find({ instructor: instructorId }).select('_id title enrolled');

  res.status(200).json({
    success: true,
    data: courses,
  });
});

const publishCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to publish this course');
  }

  course.isPublished = true;
  await course.save();

  res.status(200).json({
    success: true,
    message: 'Course published successfully',
    data: course,
  });
});

const unpublishCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to unpublish this course');
  }

  course.isPublished = false;
  await course.save();

  res.status(200).json({
    success: true,
    message: 'Course unpublished successfully',
    data: course,
  });
});

const getCourseAnalytics = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to view this course analytics');
  }

  res.status(200).json({
    success: true,
    data: {
      courseId: course._id,
      title: course.title,
      enrolled: course.enrolled,
      rating: course.rating,
      reviewCount: course.reviewCount,
      revenue: course.price * course.enrolled,
    },
  });
});

module.exports = {
  getInstructorDashboard,
  getMyCourses,
  getMyStudents,
  publishCourse,
  unpublishCourse,
  getCourseAnalytics,
};
