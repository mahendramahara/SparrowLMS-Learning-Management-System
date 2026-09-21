const express = require('express');
const {
  getUsers,
  getUserById,
  getMyInterests,
  trackInteraction,
  setInitialInterests,
} = require('./user.controller');
const { protect, authorize } = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/interests', protect, getMyInterests);
router.post('/interests/initial', protect, setInitialInterests);
router.post('/interactions', protect, trackInteraction);

router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, getUserById);

module.exports = router;
