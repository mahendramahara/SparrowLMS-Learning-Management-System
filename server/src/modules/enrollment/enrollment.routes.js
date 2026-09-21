const express = require('express');
const { enrollInCourse, getMyEnrollments } = require('./enrollment.controller');
const { protect } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, enrollInCourse);
router.get('/my-enrollments', protect, getMyEnrollments);

module.exports = router;
