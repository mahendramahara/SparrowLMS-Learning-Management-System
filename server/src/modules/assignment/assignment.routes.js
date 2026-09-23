const express = require('express');
const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissions,
  getMySubmission,
  gradeSubmission,
} = require('./assignment.controller');
const { protect, authorize } = require('../../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getAssignments)
  .post(authorize('instructor', 'admin'), createAssignment);

router
  .route('/:id')
  .get(getAssignmentById)
  .put(authorize('instructor', 'admin'), updateAssignment)
  .delete(authorize('instructor', 'admin'), deleteAssignment);

router.post('/:id/submit', authorize('student'), submitAssignment);
router.get('/:id/my-submission', authorize('student'), getMySubmission);
router.get('/:id/submissions', authorize('instructor', 'admin'), getSubmissions);

router.put('/submissions/:id/grade', authorize('instructor', 'admin'), gradeSubmission);

module.exports = router;
