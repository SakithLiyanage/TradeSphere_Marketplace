import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const MessageContext = createContext();

export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Get unread messages count
  const getUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return 0;
    }

    try {
      const { data } = await api.get('/api/messages/unread');
      setUnreadCount(data.unreadCount);
      return data.unreadCount;
    } catch (error) {
      console.error('Error getting unread count', error);
      return 0;
    }
  }, [isAuthenticated]);

  // Load unread count when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      getUnreadCount();
    } else {
      setUnreadCount(0);
    }
  }, [isAuthenticated, getUnreadCount]);

  // Get user conversations
  const getConversations = useCallback(async () => {
    if (!isAuthenticated) return [];

    try {
      setLoading(true);
      const { data } = await api.get('/api/messages/conversations');
      setConversations(data);
      return data;
    } catch (error) {
      console.error('Error getting conversations', error);
      toast.error('Failed to load conversations');
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Get conversation with a specific user about a listing
  const getConversation = useCallback(async (listingId, userId) => {
    if (!isAuthenticated) return [];
    
    try {
      setLoading(true);
      const { data } = await api.get(`/api/messages/listing/${listingId}/user/${userId}`);
      setCurrentConversation(data);
      
      // Update unread count after fetching conversation
      getUnreadCount();
      
      return data;
    } catch (error) {
      console.error('Error getting conversation', error);
      toast.error('Failed to load messages');
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getUnreadCount]);

  // Send a message
  const sendMessage = useCallback(async (messageData) => {
    if (!isAuthenticated) {
      toast.error('Please login to send messages');
      return null;
    }
    
    try {
      setLoading(true);
      const { data } = await api.post('/api/messages', messageData);
      
      // Update current conversation
      setCurrentConversation(prev => [...prev, data]);
      
      return data;
    } catch (error) {
      console.error('Error sending message', error);
      toast.error('Failed to send message');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Value to provide in context
  const value = {
    conversations,
    currentConversation,
    loading,
    unreadCount,
    getUnreadCount,
    getConversations,
    getConversation,
    sendMessage,
    clearConversation: () => setCurrentConversation([])
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};