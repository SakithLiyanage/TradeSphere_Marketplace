// server/models/Conversation.js
const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  listing: {
    type: mongoose.Schema.ObjectId,
    ref: 'Listing'
  },
  lastMessage: {
    type: mongoose.Schema.ObjectId,
    ref: 'Message'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a conversation is unique between two users about a specific listing
ConversationSchema.index({ participants: 1, listing: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', ConversationSchema);