// server/middleware/uploadMiddleware.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');
const path = require('path');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tradesphere/temp',
    format: async (req, file) => {
      // Support jpg, jpeg, png, webp formats
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg') return 'jpg';
      if (ext === '.png') return 'png';
      if (ext === '.webp') return 'webp';
      return 'jpg'; // Default format
    },
    public_id: (req, file) => {
      // Generate a unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = file.fieldname + '-' + uniqueSuffix;
      return filename;
    }
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept image files only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 10 // Max 10 files
  }
});

module.exports = upload;