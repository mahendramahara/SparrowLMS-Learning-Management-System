const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const logger = require('./logger');

const CHUNK_DIR = process.env.UPLOAD_PATH || './uploads/chunks';

const initializeUpload = async (uploadId, metadata) => {
  const uploadDir = path.join(CHUNK_DIR, uploadId);
  await fs.mkdir(uploadDir, { recursive: true });

  const metadataPath = path.join(uploadDir, 'metadata.json');
  await fs.writeFile(metadataPath, JSON.stringify(metadata));

  logger.info(`Upload initialized: ${uploadId}`);
  return { uploadId, uploadDir };
};

const saveChunk = async (uploadId, chunkIndex, chunkBuffer) => {
  const uploadDir = path.join(CHUNK_DIR, uploadId);
  const chunkPath = path.join(uploadDir, `chunk-${chunkIndex}`);

  await fs.writeFile(chunkPath, chunkBuffer);

  const hash = crypto.createHash('md5').update(chunkBuffer).digest('hex');

  logger.info(`Chunk saved: ${uploadId} - chunk ${chunkIndex}`);
  return { chunkPath, hash };
};

const getUploadedChunks = async uploadId => {
  const uploadDir = path.join(CHUNK_DIR, uploadId);

  try {
    const files = await fs.readdir(uploadDir);
    const chunks = files
      .filter(file => file.startsWith('chunk-'))
      .map(file => parseInt(file.split('-')[1]))
      .sort((a, b) => a - b);

    return chunks;
  } catch (error) {
    logger.error(`Error reading chunks: ${error.message}`);
    return [];
  }
};

const verifyChunk = async (uploadId, chunkIndex, expectedHash) => {
  const chunkPath = path.join(CHUNK_DIR, uploadId, `chunk-${chunkIndex}`);

  try {
    const chunkBuffer = await fs.readFile(chunkPath);
    const actualHash = crypto.createHash('md5').update(chunkBuffer).digest('hex');

    return actualHash === expectedHash;
  } catch (error) {
    logger.error(`Chunk verification failed: ${error.message}`);
    return false;
  }
};

const assembleChunks = async (uploadId, totalChunks, outputPath) => {
  const uploadDir = path.join(CHUNK_DIR, uploadId);
  const writeStream = require('fs').createWriteStream(outputPath);

  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(uploadDir, `chunk-${i}`);

    try {
      const chunkBuffer = await fs.readFile(chunkPath);
      writeStream.write(chunkBuffer);
    } catch (error) {
      writeStream.destroy();
      throw new Error(`Failed to read chunk ${i}: ${error.message}`);
    }
  }

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      logger.info(`File assembled: ${outputPath}`);
      resolve(outputPath);
    });
    writeStream.on('error', reject);
    writeStream.end();
  });
};

const cleanupChunks = async uploadId => {
  const uploadDir = path.join(CHUNK_DIR, uploadId);

  try {
    await fs.rm(uploadDir, { recursive: true, force: true });
    logger.info(`Cleanup completed: ${uploadId}`);
  } catch (error) {
    logger.error(`Cleanup failed: ${error.message}`);
  }
};

const getUploadMetadata = async uploadId => {
  const metadataPath = path.join(CHUNK_DIR, uploadId, 'metadata.json');

  try {
    const data = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    logger.error(`Failed to read metadata: ${error.message}`);
    return null;
  }
};

const updateUploadProgress = async (uploadId, progress) => {
  const uploadDir = path.join(CHUNK_DIR, uploadId);
  const progressPath = path.join(uploadDir, 'progress.json');

  await fs.writeFile(progressPath, JSON.stringify(progress));
};

const getUploadProgress = async uploadId => {
  const progressPath = path.join(CHUNK_DIR, uploadId, 'progress.json');

  try {
    const data = await fs.readFile(progressPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

const cancelUpload = async uploadId => {
  await cleanupChunks(uploadId);
  logger.info(`Upload cancelled: ${uploadId}`);
};

module.exports = {
  initializeUpload,
  saveChunk,
  getUploadedChunks,
  verifyChunk,
  assembleChunks,
  cleanupChunks,
  getUploadMetadata,
  updateUploadProgress,
  getUploadProgress,
  cancelUpload,
};
