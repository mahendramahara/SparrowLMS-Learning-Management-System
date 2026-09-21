const express = require('express');
const { createPayment, verifyPayment } = require('./payment.controller');
const { protect } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createPayment);
router.post('/verify', protect, verifyPayment);

module.exports = router;
