// server/routes/userRoutes.js
const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  updatePassword,
  getUsers,
  deleteUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/:id', getUserProfile);

// Protected routes
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, updatePassword);

// Admin routes
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;