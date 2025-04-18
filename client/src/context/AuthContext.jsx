// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { loginUser, registerUser, getCurrentUser, updateUserProfile } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await getCurrentUser();
          setCurrentUser(data);
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await loginUser(credentials);
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);
      toast.success('Login successful!');
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const { data } = await registerUser(userData);
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);
      toast.success('Registration successful!');
      return data.user;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const { data } = await updateUserProfile(userData);
      setCurrentUser(data);
      toast.success('Profile updated successfully!');
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};