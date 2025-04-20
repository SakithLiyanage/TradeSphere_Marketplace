import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { 
  getCurrentUser, 
  loginUser, 
  registerUser, 
  updateUserProfile
} from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in
  const checkLoggedIn = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }
      
      const userData = await getCurrentUser();
      if (userData && userData.user) {
        setCurrentUser(userData.user);
      } else {
        // If we get a response but no user data, clear the token
        localStorage.removeItem('token');
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // If token is invalid, remove it
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setCurrentUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Run on mount and when dependencies change
  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await loginUser(credentials);
      
      if (data && data.user && data.user.token) {
        localStorage.setItem('token', data.user.token);
        setCurrentUser(data.user);
        return data.user;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await registerUser(userData);
      
      if (data && data.user && data.user.token) {
        localStorage.setItem('token', data.user.token);
        setCurrentUser(data.user);
        return data.user;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Failed to register');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await updateUserProfile(userData);
      if (data && data.user) {
        setCurrentUser(prev => ({...prev, ...data.user}));
        return data.user;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    updateProfile,
    logout,
    checkLoggedIn
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;