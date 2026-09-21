const asyncHandler = require('express-async-handler');

const getAnalytics = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      totalCourses: 0,
      totalStudents: 0,
      totalRevenue: 0,
    },
  });
});

module.exports = { getAnalytics };
