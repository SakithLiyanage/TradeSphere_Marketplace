// server/routes/listingRoutes.js
const express = require('express');
const {
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
} = require('../controllers/listingController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getListings);
router.get('/featured', getFeaturedListings);
router.get('/recent', getRecentListings);
router.get('/user/:userId', getUserListings);
router.get('/:id', getListing);

// Protected routes
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.put('/:id/sold', protect, markListingAsSold);

// Admin routes
router.put('/:id/feature', protect, admin, featureListing);

module.exports = router;