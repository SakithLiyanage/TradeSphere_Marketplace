const Listing = require('../models/Listing');
const Category = require('../models/Category');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
const getListings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Build query
  const query = { sold: false }; // Only show unsold listings by default
  
  // Search
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  
  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }
  
  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = parseInt(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = parseInt(req.query.maxPrice);
  }
  
  // Filter by location
  if (req.query.location) {
    query.location = { $regex: req.query.location, $options: 'i' };
  }
  
  // Filter by condition
  if (req.query.condition) {
    query.condition = req.query.condition;
  }
  
  // Count total listings
  const total = await Listing.countDocuments(query);
  
  // Sort
  let sortBy = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price-asc':
        sortBy.price = 1;
        break;
      case 'price-desc':
        sortBy.price = -1;
        break;
      case 'newest':
        sortBy.createdAt = -1;
        break;
      case 'oldest':
        sortBy.createdAt = 1;
        break;
      case 'popular':
        sortBy.viewCount = -1;
        break;
      default:
        sortBy.createdAt = -1;
    }
  } else {
    sortBy.createdAt = -1; // Default sort by newest
  }
  
  const listings = await Listing.find(query)
    .populate('user', 'name avatar')
    .sort(sortBy)
    .skip(startIndex)
    .limit(limit);
  
  res.json({
    success: true,
    page,
    pages: Math.ceil(total / limit),
    total,
    listings
  });
});

// @desc    Get featured listings
// @route   GET /api/listings/featured
// @access  Public
const getFeaturedListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({ featured: true, sold: false })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(6);
  
  res.json({
    success: true,
    count: listings.length,
    listings
  });
});

// @desc    Get recent listings
// @route   GET /api/listings/recent
// @access  Public
const getRecentListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({ sold: false })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(8);
  
  res.json({
    success: true,
    count: listings.length,
    listings
  });
});

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
const getListing = asyncHandler(async (req, res) => {
  // Find listing by ID or slug
  const query = req.params.id.match(/^[0-9a-fA-F]{24}$/) 
    ? { _id: req.params.id }
    : { slug: req.params.id };
  
  const listing = await Listing.findOne(query)
    .populate('user', 'name email phone avatar createdAt');
  
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  
  // Increment view count
  listing.viewCount += 1;
  await listing.save();
  
  res.json({
    success: true,
    listing
  });
});

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
const createListing = asyncHandler(async (req, res) => {
  const { 
    title, 
    description, 
    price, 
    category, 
    condition, 
    images, 
    location,
    specifications
  } = req.body;
  
  if (!title || !description || !price || !category || !condition || !images || !location) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }
  
  if (!images || !images.length) {
    res.status(400);
    throw new Error('Please upload at least one image');
  }
  
  const listing = await Listing.create({
    title,
    description,
    price,
    category,
    condition,
    images,
    location,
    specifications: specifications || {},
    user: req.user._id
  });
  
  res.status(201).json({
    success: true,
    listing
  });
});

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  
  // Check if user is listing owner
  if (listing.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this listing');
  }
  
  // Don't allow changing user
  delete req.body.user;
  
  // Update listing
  const updatedListing = await Listing.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.json({
    success: true,
    listing: updatedListing
  });
});

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  
  // Check if user is listing owner
  if (listing.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete this listing');
  }
  
  await listing.remove();
  
  res.json({
    success: true,
    message: 'Listing removed'
  });
});

// @desc    Get user listings
// @route   GET /api/listings/user/:userId
// @access  Public
const getUserListings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  const user = await User.findById(req.params.userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Count total listings
  const total = await Listing.countDocuments({ user: req.params.userId });
  
  const listings = await Listing.find({ user: req.params.userId })
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);
  
  res.json({
    success: true,
    page,
    pages: Math.ceil(total / limit),
    total,
    listings
  });
});

// @desc    Mark listing as sold
// @route   PUT /api/listings/:id/sold
// @access  Private
const markListingAsSold = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  
  // Check if user is listing owner
  if (listing.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this listing');
  }
  
  listing.sold = !listing.sold; // Toggle sold status
  await listing.save();
  
  res.json({
    success: true,
    sold: listing.sold
  });
});

// @desc    Feature/unfeature listing
// @route   PUT /api/listings/:id/feature
// @access  Private/Admin
const featureListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  
  listing.featured = !listing.featured; // Toggle featured status
  await listing.save();
  
  res.json({
    success: true,
    featured: listing.featured
  });
});

module.exports = {
  getListings,
  getFeaturedListings,
  getRecentListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getUserListings,
  markListingAsSold,
  featureListing
};