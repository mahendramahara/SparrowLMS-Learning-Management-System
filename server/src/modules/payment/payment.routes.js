const express = require('express');
const {
  createPayment,
  verifyPayment,
  getMyPaymentHistory,
  getInstructorEarnings,
} = require('./payment.controller');
const { protect, authorize } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createPayment);
router.post('/verify', protect, verifyPayment);
router.get('/my-history', protect, getMyPaymentHistory);
router.get('/instructor-earnings', protect, authorize('instructor', 'admin'), getInstructorEarnings);

module.exports = router;
