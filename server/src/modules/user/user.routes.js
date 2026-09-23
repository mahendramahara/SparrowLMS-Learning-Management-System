const express = require('express');
const {
  getUsers,
  getUserById,
  getMyProfile,
  updateMyProfile,
  updateUser,
  getMyInterests,
  trackInteraction,
  setInitialInterests,
} = require('./user.controller');
const { protect, authorize } = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateMyProfile);

router.get('/interests', protect, getMyInterests);
router.post('/interests/initial', protect, setInitialInterests);
router.post('/interactions', protect, trackInteraction);

router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);

module.exports = router;

