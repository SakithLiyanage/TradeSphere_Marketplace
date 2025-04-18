// src/utils/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Interceptor to add token to requests
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

// Upload image with form data
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.imageUrl;
  } catch (error) {
    throw error;
  }
};

// User API functions
export const registerUser = (userData) => api.post('/api/auth/register', userData);
export const loginUser = (credentials) => api.post('/api/auth/login', credentials);
export const getCurrentUser = () => api.get('/api/users/me');
export const updateUserProfile = (userData) => api.put('/api/users/profile', userData);

// Listing API functions
export const getListings = (params) => api.get('/api/listings', { params });
export const getListing = (id) => api.get(`/api/listings/${id}`);
export const createListing = (listingData) => api.post('/api/listings', listingData);
export const updateListing = (id, listingData) => api.put(`/api/listings/${id}`, listingData);
export const deleteListing = (id) => api.delete(`/api/listings/${id}`);
export const getUserListings = () => api.get('/api/listings/user');
export const getHomePageListings = () => api.get('/api/listings/home');

// Category API functions
export const getCategories = () => api.get('/api/categories');

export default api;