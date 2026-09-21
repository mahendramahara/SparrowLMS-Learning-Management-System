const asyncHandler = require('express-async-handler');

const enrollInCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  res.status(201).json({
    success: true,
    message: 'Enrolled in course successfully',
    data: {
      courseId,
      userId: req.user.id,
    },
  });
});

const getMyEnrollments = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
  });
});

module.exports = { enrollInCourse, getMyEnrollments };
