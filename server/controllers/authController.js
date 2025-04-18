// server/controllers/authController.js
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  if (user) {
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
        token: user.getSignedJwtToken()
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide an email and password');
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Create token
  const token = user.getSignedJwtToken();

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      token
    }
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt
    }
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe
};