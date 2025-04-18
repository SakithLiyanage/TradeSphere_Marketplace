// server/routes/favoriteRoutes.js
const express = require('express');
const {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.get('/', protect, getUserFavorites);
router.post('/', protect, addFavorite);
router.delete('/:listingId', protect, removeFavorite);
router.get('/:listingId/check', protect, checkFavorite);

module.exports = router;