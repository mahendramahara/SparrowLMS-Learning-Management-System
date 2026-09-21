const express = require('express');
const { getAnalytics } = require('./analytics.controller');
const { protect, authorize } = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize('instructor', 'admin'), getAnalytics);

module.exports = router;
