// server/models/Favorite.js
const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  listing: {
    type: mongoose.Schema.ObjectId,
    ref: 'Listing',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from favoriting a listing more than once
FavoriteSchema.index({ user: 1, listing: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);