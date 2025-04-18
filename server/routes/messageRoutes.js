// server/routes/messageRoutes.js
const express = require('express');
const {
  getConversations,
  getOrCreateConversation,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.get('/conversations', protect, getConversations);
router.get('/conversation/:userId/:listingId', protect, getOrCreateConversation);
router.post('/', protect, sendMessage);
router.put('/read/:conversationId', protect, markMessagesAsRead);
router.get('/unread', protect, getUnreadCount);

module.exports = router;