const express = require('express');
const router = express.Router();

/**
 * @desc    Homepage/root route
 * @route   GET /
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to TradeSphere Marketplace API',
    version: '1.0.0',
    docs: '/api/docs', // If you have API documentation
    status: 'online'
  });
});

module.exports = router;
