const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// @desc    Upload image
// @route   POST /api/uploads
// @access  Private
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file uploaded');
  }

  // Get the server URL
  const protocol = req.protocol;
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}`;
  
  // Create the full URL for the uploaded image
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

  res.json({
    success: true,
    imageUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

module.exports = {
  uploadImage
};