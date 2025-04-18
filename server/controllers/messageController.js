// server/controllers/messageController.js
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Listing = require('../models/Listing');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all conversations for a user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  // Get conversations where user is a participant
  const conversations = await Conversation.find({
    participants: req.user.id
  })
    .sort({ updatedAt: -1 })
    .populate({
      path: 'participants',
      select: 'name avatar',
      match: { _id: { $ne: req.user.id } }
    })
    .populate({
      path: 'listing',
      select: 'title images status'
    })
    .populate({
      path: 'lastMessage',
      select: 'content isRead createdAt sender'
    });
  
  res.json({
    success: true,
    count: conversations.length,
    conversations
  });
});

// @desc    Get or create conversation
// @route   GET /api/messages/conversation/:userId/:listingId
// @access  Private
const getOrCreateConversation = asyncHandler(async (req, res) => {
  const { userId, listingId } = req.params;

  // Check if listing exists
  const listing = await Listing.findById(listingId);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }

  // Check if other user exists
  const otherUser = await User.findById(userId);
  if (!otherUser) {
    res.status(404);
    throw new Error('User not found');
  }

  // Find existing conversation or create new one
  let conversation = await Conversation.findOne({
    participants: { $all: [req.user.id, userId] },
    listing: listingId
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user.id, userId],
      listing: listingId
    });
  }

  // Populate conversation
  conversation = await Conversation.findById(conversation._id)
    .populate({
      path: 'participants',
      select: 'name avatar'
    })
    .populate({
      path: 'listing',
      select: 'title images status price'
    });

  // Get messages in conversation
  const messages = await Message.find({ conversation: conversation._id })
    .sort({ createdAt: 1 });

  res.json({
    success: true,
    conversation,
    messages
  });
});

// @desc    Send message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, content } = req.body;

  // Validate content
  if (!content || content.trim() === '') {
    res.status(400);
    throw new Error('Message content is required');
  }

  // Check if conversation exists
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Check if user is part of conversation
  if (!conversation.participants.includes(req.user.id)) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Get the other participant
  const receiver = conversation.participants.find(
    p => p.toString() !== req.user.id
  );

  // Create message
  const message = await Message.create({
    conversation: conversationId,
    sender: req.user.id,
    receiver,
    listing: conversation.listing,
    content
  });

  // Update conversation with last message and timestamp
  conversation.lastMessage = message._id;
  conversation.updatedAt = Date.now();
  await conversation.save();

  // Populate message
  const populatedMessage = await Message.findById(message._id)
    .populate({
      path: 'sender',
      select: 'name avatar'
    });

  res.status(201).json({
    success: true,
    message: populatedMessage
  });
});

// @desc    Mark messages as read
// @route   PUT /api/messages/read/:conversationId
// @access  Private
const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  // Check if conversation exists
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Check if user is part of conversation
  if (!conversation.participants.includes(req.user.id)) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Mark unread messages as read
  await Message.updateMany(
    {
      conversation: conversationId,
      receiver: req.user.id,
      isRead: false
    },
    {
      isRead: true
    }
  );

  res.json({
    success: true,
    message: 'Messages marked as read'
  });
});

// @desc    Get unread messages count
// @route   GET /api/messages/unread
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Message.countDocuments({
    receiver: req.user.id,
    isRead: false
  });

  res.json({
    success: true,
    count
  });
});

module.exports = {
  getConversations,
  getOrCreateConversation,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount
};