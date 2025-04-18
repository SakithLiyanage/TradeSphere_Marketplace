// server/controllers/userController.js
const User = require('../models/User');
const Listing = require('../models/Listing');
const asyncHandler = require('express-async-handler');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-email');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get user's active listings count
  const listingsCount = await Listing.countDocuments({ 
    user: user._id, 
    status: 'active' 
  });

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      location: user.location,
      bio: user.bio,
      createdAt: user.createdAt,
      listingsCount
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Fields to update
  const { name, email, avatar, phone, location, bio } = req.body;

  // Check if email already exists for another user
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already in use');
    }
  }

  // Update fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (avatar) user.avatar = avatar;
  if (phone) user.phone = phone;
  if (location) user.location = location;
  if (bio) user.bio = bio;

  const updatedUser = await user.save();

  res.json({
    success: true,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
      location: updatedUser.location,
      bio: updatedUser.bio,
      isAdmin: updatedUser.isAdmin,
      createdAt: updatedUser.createdAt
    }
  });
});

// @desc    Update password
// @route   PUT /api/users/password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password field
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  // Validate new password
  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  // Set new password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  
  res.json({
    success: true,
    count: users.length,
    users
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Remove user's listings
  await Listing.deleteMany({ user: user._id });

  // Delete user
  await user.remove();

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  updatePassword,
  getUsers,
  deleteUser
};