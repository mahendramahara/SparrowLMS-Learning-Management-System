const os = require('os');
const path = require('path');
const express = require('express');
const multer = require('multer');
const { protect } = require('../../middleware/authMiddleware');
const { uploadMedia, removeMedia } = require('./upload.controller');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `sparrowlms-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 524288000,
    files: 1,
  },
});

const router = express.Router();

router.post('/media', protect, upload.single('file'), uploadMedia);
router.delete('/media', protect, removeMedia);

module.exports = router;
