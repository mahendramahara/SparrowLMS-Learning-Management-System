const express = require('express');
const { createAssessment, getAssessments } = require('./assessment.controller');
const { protect, authorize } = require('../../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('instructor', 'admin'), createAssessment)
  .get(protect, getAssessments);

module.exports = router;
