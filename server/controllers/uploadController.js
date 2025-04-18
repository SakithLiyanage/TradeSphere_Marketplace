// server/controllers/uploadController.js
const cloudinary = require('../utils/cloudinary');
const asyncHandler = require('express-async-handler');

// @desc    Upload images to Cloudinary
// @route   POST /api/uploads
// @access  Private
const uploadImages = asyncHandler(async (req, res) => {
  // Check if files exist
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  // Check if too many files
  if (req.files.length > 10) {
    res.status(400);
    throw new Error('Maximum 10 images allowed');
  }

  // Upload to Cloudinary and get URLs
  const uploadPromises = req.files.map(file => 
    cloudinary.uploader.upload(file.path, {
      folder: 'tradesphere',
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 1200, height: 800, crop: 'limit', quality: 'auto:good' }
      ]
    })
  );

  try {
    const results = await Promise.all(uploadPromises);
    const urls = results.map(result => result.secure_url);

    res.json({
      success: true,
      count: urls.length,
      urls
    });
  } catch (error) {
    res.status(400);
    throw new Error(`Image upload failed: ${error.message}`);
  }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/uploads
// @access  Private
const deleteImage = asyncHandler(async (req, res) => {
  const { url } = req.body;

  if (!url) {
    res.status(400);
    throw new Error('Image URL is required');
  }

  // Extract public_id from URL
  const splitUrl = url.split('/');
  const folderWithFilename = splitUrl[splitUrl.length - 2] + '/' + 
    splitUrl[splitUrl.length - 1].split('.')[0];

  try {
    await cloudinary.uploader.destroy(folderWithFilename);
    
    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    res.status(400);
    throw new Error(`Image deletion failed: ${error.message}`);
  }
});

module.exports = {
  uploadImages,
  deleteImage
};