// server/controllers/listingController.js
const Listing = require('../models/Listing');
const Category = require('../models/Category');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
const getListings = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Filtering
  const filter = {};
  
  // Status - default to active listings only
  filter.status = req.query.status || 'active';
  
  // Category
  if (req.query.category) {
    const category = await Category.findOne({ slug: req.query.category });
    if (category) {
      filter.category = category._id;
    }
  }
  
  // Subcategory
  if (req.query.subcategory) {
    const subcategory = await Category.findOne({ slug: req.query.subcategory });
    if (subcategory) {
      filter.subcategory = subcategory._id;
    }
  }
  
  // User
  if (req.query.user) {
    filter.user = req.query.user;
  }
  
  // Featured
  if (req.query.featured === 'true') {
    filter.featured = true;
  }
  
  // Price range
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) {
      filter.price.$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      filter.price.$lte = Number(req.query.maxPrice);
    }
  }
  
  // Condition
  if (req.query.condition) {
    filter.condition = req.query.condition;
  }
  
  // Location
  if (req.query.location) {
    filter.location = { $regex: req.query.location, $options: 'i' };
  }
  
  // Search term
  if (req.query.search) {
    const searchRegex = { $regex: req.query.search, $options: 'i' };
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
    ];
  }
  
  // Sorting
  let sort = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'views':
        sort = { views: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
  } else {
    // Default sort is newest first
    sort = { createdAt: -1 };
  }
  
  // Execute query
  const total = await Listing.countDocuments(filter);
  const listings = await Listing.find(filter)
    .sort(sort)
    .limit(limit)
    .skip(startIndex)
    .populate({
      path: 'user',
      select: 'name avatar location'
    })
    .populate({
      path: 'category',
      select: 'name slug'
    })
    .populate({
      path: 'subcategory',
      select: 'name slug'
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
    count: listings.length,
    pagination,
    listings
  });
});

// @desc    Get featured listings
// @route   GET /api/listings/featured
// @access  Public
const getFeaturedListings = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  
  const listings = await Listing.find({ 
    featured: true,
    status: 'active'
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate({
      path: 'user',
      select: 'name avatar'
    })
    .populate({
      path: 'category',
      select: 'name slug'
    });
  
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
  const limit = parseInt(req.query.limit, 10) || 8;
  
  const listings = await Listing.find({ status: 'active' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate({
      path: 'user',
      select: 'name avatar'
    })
    .populate({
      path: 'category',
      select: 'name slug'
    });
  
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
    .populate({
      path: 'user',
      select: 'name avatar location createdAt'
    })
    .populate({
      path: 'category',
      select: 'name slug icon'
    })
    .populate({
      path: 'subcategory',
      select: 'name slug'
    });
  
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  
  // Increment view count if not the owner viewing
  const viewerIsOwner = req.user && req.user.id === listing.user._id.toString();
  if (!viewerIsOwner) {
    await listing.incrementViews();
  }
  
  // Get related listings (same category, exclude current)
  const relatedListings = await Listing.find({
    category: listing.category._id,
    _id: { $ne: listing._id },
    status: 'active'
  })
    .sort({ createdAt: -1 })
    .limit(4)
    .select('title price images slug condition location')
    .populate({
      path: 'user',
      select: 'name'
    });

  // Get user's other active listings
  const userListings = await Listing.find({
    user: listing.user._id,
    _id: { $ne: listing._id },
    status: 'active'
  })
    .sort({ createdAt: -1 })
    .limit(3)
    .select('title price images slug');
  
  res.json({
    success: true,
    listing,
    relatedListings,
    userListings
  });
});

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
const createListing = asyncHandler(async (req, res) => {
  // Check if category exists
  const category = await Category.findById(req.body.category);
  if (!category) {
    res.status(400);
    throw new Error('Category not found');
  }
  
  // Check if subcategory exists and belongs to category
  if (req.body.subcategory) {
    const subcategory = await Category.findOne({
      _id: req.body.subcategory,
      parent: category._id
    });
    if (!subcategory) {
      res.status(400);
      throw new Error('Invalid subcategory');
    }
  }
  
  // Create listing
  const listing = await Listing.create({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    priceType: req.body.priceType || 'fixed',
    condition: req.body.condition || 'good',
    images: req.body.images,
    category: req.body.category,
    subcategory: req.body.subcategory || null,
    location: req.body.location,
    user: req.user.id
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
  let listing = await Listing.findById(req.params.id);
  
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  
  // Check if user owns the listing
  if (listing.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  // Check if category exists if being updated
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    if (!category) {
      res.status(400);
      throw new Error('Category not found');
    }
    
    // Check if subcategory exists and belongs to category
    if (req.body.subcategory) {
      const subcategory = await Category.findOne({
        _id: req.body.subcategory,
        parent: category._id
      });
      if (!subcategory) {
        res.status(400);
        throw new Error('Invalid subcategory');
      }
    }
  }
  
  // Update listing
  listing = await Listing.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate({
    path: 'user',
    select: 'name avatar'
  }).populate({
    path: 'category',
    select: 'name slug'
  }).populate({
    path: 'subcategory',
    select: 'name slug'
  });
  
  res.json({
    success: true,
    listing
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
  
  // Check if user owns the listing
  if (listing.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  await listing.remove();
  
  res.json({
    success: true,
    message: 'Listing removed'
  });
});

// @desc    Get user listings
// @route   GET /api/listings/user/:userId
// @access  Public for active listings, Private for all user listings
const getUserListings = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  
  // Check if user exists
  const userExists = await User.findById(userId);
  if (!userExists) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Filtering
  const filter = { user: userId };
  
  // If not the owner or admin, only show active listings
  const isOwner = req.user && (req.user.id === userId || req.user.isAdmin);
  if (!isOwner) {
    filter.status = 'active';
  } else if (req.query.status) {
    filter.status = req.query.status;
  }
  
  // Execute query
  const total = await Listing.countDocuments(filter);
  const listings = await Listing.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(startIndex)
    .populate({
      path: 'category',
      select: 'name slug'
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
    count: listings.length,
    pagination,
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
  
  // Check if user owns the listing
  if (listing.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  listing.status = 'sold';
  await listing.save();
  
  res.json({
    success: true,
    listing
  });
});

// @desc    Feature or unfeature a listing (admin only)
// @route   PUT /api/listings/:id/feature
// @access  Private/Admin
const featureListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  
  listing.featured = !listing.featured;
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