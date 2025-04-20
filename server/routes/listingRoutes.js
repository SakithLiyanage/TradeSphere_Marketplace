const express = require('express');
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getUserListings,
  getCategories
} = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getListings);
router.get('/categories', getCategories);

// Protected routes - require authentication
router.post('/', protect, createListing);
router.get('/user/me', protect, getUserListings); // This specific route must come before /:id

// Parameterized routes should come last
router.get('/:id', getListingById);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;