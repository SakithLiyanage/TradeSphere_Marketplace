// server/routes/uploadRoutes.js
const express = require('express');
const { uploadImages, deleteImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Upload multiple images
router.post('/', protect, upload.array('images', 10), uploadImages);

// Delete an image
router.delete('/', protect, deleteImage);

module.exports = router;