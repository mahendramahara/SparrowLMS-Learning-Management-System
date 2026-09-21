const asyncHandler = require('express-async-handler');

const createPayment = asyncHandler(async (req, res) => {
  const { amount, courseId } = req.body;

  res.status(201).json({
    success: true,
    message: 'Payment initiated successfully',
    data: {
      amount,
      courseId,
    },
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
  });
});

module.exports = { createPayment, verifyPayment };
