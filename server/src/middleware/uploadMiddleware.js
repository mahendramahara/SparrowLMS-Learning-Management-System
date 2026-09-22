const multer = require('multer');
const path = require('path');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';

const buildStorage = () => {
  if (isProduction) {
    return multer.memoryStorage();
  }

  const uploadDir = process.env.UPLOAD_PATH || path.join(process.cwd(), 'uploads');

  try {
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  } catch {
    return multer.memoryStorage();
  }

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + unique + path.extname(file.originalname));
    },
  });
};

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|pdf|mp4|avi|mov|mkv|webm|doc|docx|ppt|pptx/;
  const validExt = allowed.test(path.extname(file.originalname).toLowerCase());
  const validMime = allowed.test(file.mimetype);

  if (validExt && validMime) return cb(null, true);
  cb(new Error('Invalid file type. Only images, videos, and documents are allowed.'));
};

const upload = multer({
  storage: buildStorage(),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;
