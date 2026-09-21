const asyncHandler = require('express-async-handler');

const uploadVideo = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a video file');
  }

  res.status(200).json({
    success: true,
    message: 'Video uploaded successfully',
    data: {
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
    },
  });
});

const getVideoById = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Video retrieved successfully',
    data: {
      id: req.params.id,
    },
  });
});

module.exports = { uploadVideo, getVideoById };
