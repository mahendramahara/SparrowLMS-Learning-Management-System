const express = require('express');
const { uploadVideo, getVideoById } = require('./video.controller');
const { protect, authorize } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');

const router = express.Router();

router.post('/', protect, authorize('instructor', 'admin'), upload.single('video'), uploadVideo);
router.get('/:id', protect, getVideoById);

module.exports = router;
