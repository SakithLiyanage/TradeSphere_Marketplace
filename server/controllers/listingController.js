const Listing = require('../models/Listing');
const Category = require('../models/Category');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
const getListings = asyncHandler(async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    // Create filter object
    const filter = {};
    
    // Add category filter if provided
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Add search filters if provided
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Add price range filters
    if (req.query.minPrice) {
      filter.price = { ...filter.price, $gte: Number(req.query.minPrice) };
    }
    
    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };
    }
    
    // Add condition filter
    if (req.query.condition) {
      filter.condition = req.query.condition;
    }
    
    // Add location filter
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }
    
    // Add featured filter
    if (req.query.featured === 'true') {
      filter.featured = true;
    }

    // Determine sort order
    let sortOptions = { createdAt: -1 }; // Default sort by newest
    
    if (req.query.sort) {
      const [field, direction] = req.query.sort.split('-');
      sortOptions = { [field]: direction === 'desc' ? -1 : 1 };
    }

    // Get total count
    const count = await Listing.countDocuments(filter);
    
    // Get listings with pagination
    const listings = await Listing.find(filter)
      .populate('user', 'name avatar')
      .sort(sortOptions)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Send response
    res.json({
      success: true,
      listings,
      pagination: {
        page,
        pages: Math.ceil(count / pageSize),
        total: count
      }
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching listings'
    });
  }
});

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
const getListingById = asyncHandler(async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('user', 'name email phone avatar createdAt');

    if (listing) {
      // Increment view count
      listing.viewCount = (listing.viewCount || 0) + 1;
      await listing.save();
      
      res.json({
        success: true,
        listing
      });
    } else {
      res.status(404);
      throw new Error('Listing not found');
    }
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error while fetching listing'
    });
  }
});

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
const createListing = asyncHandler(async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price,
      category,
      condition,
      location,
      images,
      specifications = {}
    } = req.body;

    // Validation
    if (!title || !description || !price || !category || !condition || !location) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    // Create listing
    const listing = await Listing.create({
      user: req.user._id,
      title,
      description,
      price,
      category,
      condition,
      location,
      images: images || [],
      specifications
    });

    res.status(201).json({
      success: true,
      listing
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(error.status || 500).json({
      success: false, 
      message: error.message || 'Server error while creating listing'
    });
  }
});

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = asyncHandler(async (req, res) => {
  try {
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
    ).populate('user', 'name email phone avatar createdAt');
    
    res.json({
      success: true,
      listing: updatedListing
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error while updating listing'
    });
  }
});

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = asyncHandler(async (req, res) => {
  try {
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
    
    // First, delete any favorites referencing this listing
    const Favorite = require('../models/Favorite');
    await Favorite.deleteMany({ listing: req.params.id });
    
    // Now delete the listing using findByIdAndDelete
    await Listing.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Listing removed'
    });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({
      success: false,
      message: `Error deleting listing: ${error.message}`
    });
  }
});

// @desc    Get user listings
// @route   GET /api/listings/user/me
// @access  Private
const getUserListings = asyncHandler(async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    // Get count
    const count = await Listing.countDocuments({ user: req.user._id });
    
    // Get listings
    const listings = await Listing.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      success: true,
      listings,
      pagination: {
        page,
        pages: Math.ceil(count / pageSize),
        total: count
      }
    });
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user listings'
    });
  }
});

// @desc    Get all categories
// @route   GET /api/listings/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getUserListings,
  getCategories
};