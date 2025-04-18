const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for authentication
 * @param {string} id - User ID to encode in the token
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = generateToken;