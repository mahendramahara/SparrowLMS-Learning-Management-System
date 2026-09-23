const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath, folder, resourceType = 'auto') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `sparrowlms/${folder}`,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });
    return result;
  } catch (error) {
    logger.error(`Cloudinary upload error: ${error.message}`);
    throw error;
  }
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    logger.error(`Cloudinary delete error: ${error.message}`);
    throw error;
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
