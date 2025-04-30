import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://tradesphere-backend.vercel.app';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API calls
export const loginUser = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await api.put('/api/users/profile', userData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/api/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post(`/api/auth/reset-password/${token}`, { password });
  return response.data;
};

// Category API calls
export const getCategories = async () => {
  const response = await api.get('/api/categories');
  return response.data;
};

// Listings API calls
export const getListings = async (params = {}) => {
  const response = await api.get('/api/listings', { params });
  return response.data;
};

export const getListing = async (id) => {
  const response = await api.get(`/api/listings/${id}`);
  return response.data;
};

export const createListing = async (listingData) => {
  const response = await api.post('/api/listings', listingData);
  return response.data;
};

export const updateListing = async (id, listingData) => {
  const response = await api.put(`/api/listings/${id}`, listingData);
  return response.data;
};

export const deleteListing = async (id) => {
  const response = await api.delete(`/api/listings/${id}`);
  return response.data;
};

export const getUserListings = async (userId) => {
  const response = await api.get(`/api/listings/user/${userId}`);
  return response.data;
};

export const getHomePageListings = async () => {
  const featured = await api.get('/api/listings/featured');
  const recent = await api.get('/api/listings/recent');
  return {
    featured: featured.data.listings,
    recent: recent.data.listings
  };
};

// Image upload
export const uploadImage = async (formData) => {
  const response = await api.post('/api/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export default api;