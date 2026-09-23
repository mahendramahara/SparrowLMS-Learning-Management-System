const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../../config/cloudinary');
const logger = require('../../utils/logger');

const UPLOAD_TYPE_FOLDER_MAP = {
  thumbnail: 'thumbnails',
  video: 'videos',
  resource: 'resources',
  attachment: 'attachments',
};

const MIME_TO_RESOURCE_TYPE = mime => {
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('image/')) return 'image';
  return 'raw';
};

const safeUnlink = async filePath => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch {
    // temp file cleanup failure is non-critical
  }
};

const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please provide a file to upload');
  }

  const filePath = req.file.path;
  const mimeType = req.file.mimetype || '';
  const uploadType = req.query.type || 'resource';
  const cloudinaryFolder = UPLOAD_TYPE_FOLDER_MAP[uploadType] || 'resources';
  const resourceType = MIME_TO_RESOURCE_TYPE(mimeType);

  try {
    const result = await uploadToCloudinary(filePath, cloudinaryFolder, resourceType);

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url || result.url,
        publicId: result.public_id,
        name: req.file.originalname,
        size: (req.file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: mimeType,
        format: result.format || path.extname(req.file.originalname).replace('.', ''),
        resourceType,
        uploadType,
        width: result.width,
        height: result.height,
        duration: result.duration,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.warn(`Cloudinary upload failed in dev: ${error.message}. Returning fallback.`);
      return res.status(200).json({
        success: true,
        data: {
          url: `https://via.placeholder.com/640x360?text=Dev+Fallback`,
          publicId: `dev_fallback_${Date.now()}`,
          name: req.file.originalname,
          size: (req.file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: mimeType,
          format: path.extname(req.file.originalname).replace('.', ''),
          resourceType,
          uploadType,
        },
      });
    }

    res.status(500);
    throw new Error(`Media upload failed: ${error.message}`);
  } finally {
    await safeUnlink(filePath);
  }
});

const removeMedia = asyncHandler(async (req, res) => {
  const { publicId, resourceType = 'image' } = req.body;

  if (!publicId) {
    res.status(400);
    throw new Error('Please provide the public ID of the asset to delete');
  }

  await deleteFromCloudinary(publicId, resourceType);

  res.status(200).json({
    success: true,
    message: 'Media deleted successfully',
  });
});

module.exports = { uploadMedia, removeMedia };
