const asyncHandler = require('express-async-handler');

const createAssessment = asyncHandler(async (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Assessment created successfully',
    data: req.body,
  });
});

const getAssessments = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
  });
});

module.exports = { createAssessment, getAssessments };
