// server/controllers/favoriteController.js
const Favorite = require('../models/Favorite');
const Listing = require('../models/Listing');
const asyncHandler = require('express-async-handler');

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
const getUserFavorites = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Get favorites with populated listings
  const total = await Favorite.countDocuments({ user: req.user.id });
  const favorites = await Favorite.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate({
      path: 'listing',
      select: 'title price images slug condition location status',
      populate: {
        path: 'user',
        select: 'name avatar'
      }
    });
  
  // Pagination result
  const pagination = {
    total,
    pages: Math.ceil(total / limit),
    page,
    limit
  };
  
  res.json({
    success: true,
    count: favorites.length,
    pagination,
    favorites
  });
});

// @desc    Add listing to favorites
// @route   POST /api/favorites
// @access  Private
const addFavorite = asyncHandler(async (req, res) => {
  const { listingId } = req.body;
  
  // Check if listing exists
  const listing = await Listing.findById(listingId);
  
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  
  // Check if already favorited
  const existingFavorite = await Favorite.findOne({
    user: req.user.id,
    listing: listingId
  });
  
  if (existingFavorite) {
    res.status(400);
    throw new Error('Listing already in favorites');
  }
  
  // Add to favorites
  const favorite = await Favorite.create({
    user: req.user.id,
    listing: listingId
  });
  
  res.status(201).json({
    success: true,
    favorite
  });
});

// @desc    Remove listing from favorites
// @route   DELETE /api/favorites/:listingId
// @access  Private
const removeFavorite = asyncHandler(async (req, res) => {
  // Find favorite
  const favorite = await Favorite.findOne({
    user: req.user.id,
    listing: req.params.listingId
  });
  
  if (!favorite) {
    res.status(404);
    throw new Error('Favorite not found');
  }
  
  await Favorite.deleteOne({ _id: favorite._id });
  
  res.json({
    success: true,
    message: 'Removed from favorites'
  });
});

// @desc    Check if listing is favorited
// @route   GET /api/favorites/:listingId/check
// @access  Private
const checkFavorite = asyncHandler(async (req, res) => {
  const favorite = await Favorite.findOne({
    user: req.user.id,
    listing: req.params.listingId
  });
  
  res.json({
    success: true,
    isFavorite: !!favorite
  });
});

module.exports = {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite
};