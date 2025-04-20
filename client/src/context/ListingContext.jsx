import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ListingContext = createContext();

export const useListing = () => useContext(ListingContext);

export const ListingProvider = ({ children }) => {
  const [listings, setListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [currentListing, setCurrentListing] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/categories`);
      setCategories(response.data.data || []);
      setError(null);
    } catch (error) {
      console.error("Error loading categories:", error);
      setError('Failed to load categories. Please try again.');
      toast.error('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load home page listings
  const loadHomePageListings = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch featured listings
      const featuredResponse = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/listings/featured`);
      setFeaturedListings(featuredResponse.data.listings || []);
      
      // Fetch recent listings
      const recentResponse = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/listings/recent`);
      setRecentListings(recentResponse.data.listings || []);
      
      setError(null);
    } catch (error) {
      console.error("Error loading home page listings:", error);
      setError('Failed to load listings. Please try again.');
      toast.error('Failed to load listings.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load listings with filters
  const loadListings = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/listings`, { params });
      setListings(response.data.listings || []);
      setPagination({
        page: response.data.page || 1,
        pages: response.data.pages || 1,
        total: response.data.total || 0
      });
      setError(null);
    } catch (error) {
      console.error("Error loading listings:", error);
      setError('Failed to load listings. Please try again.');
      toast.error('Failed to load listings.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a specific listing
  const getListing = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/listings/${id}`);
      setCurrentListing(response.data.listing || null);
      setError(null);
      return response.data.listing;
    } catch (error) {
      console.error(`Error loading listing ${id}:`, error);
      setError('Failed to load listing details. Please try again.');
      toast.error('Failed to load listing details.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new listing
  const createListing = useCallback(async (listingData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You must be logged in to create a listing');
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/listings`,
        listingData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setError(null);
      return response.data.listing;
    } catch (error) {
      console.error("Error creating listing:", error);
      setError('Failed to create listing. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user listings
  const getUserListings = useCallback(async (userId) => {
    try {
      setLoading(true);
      
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/listings/user/${userId}`,
        token ? {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        } : {}
      );
      
      const listings = response.data.listings || [];
      setUserListings(listings);
      setError(null);
      return listings;
    } catch (error) {
      console.error("Error loading user listings:", error);
      setError('Failed to load your listings. Please try again.');
      toast.error('Failed to load your listings.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a listing
  const updateListing = useCallback(async (id, listingData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You must be logged in to update a listing');
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/listings/${id}`,
        listingData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setError(null);
      return response.data.listing;
    } catch (error) {
      console.error(`Error updating listing ${id}:`, error);
      setError('Failed to update listing. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a listing
  const deleteListing = useCallback(async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You must be logged in to delete a listing');
      }

      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/listings/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update user listings if they exist
      if (userListings.length > 0) {
        setUserListings(userListings.filter(listing => listing._id !== id));
      }

      setError(null);
      return true;
    } catch (error) {
      console.error(`Error deleting listing ${id}:`, error);
      setError('Failed to delete listing. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userListings]);

  const value = {
    listings,
    featuredListings,
    recentListings,
    currentListing,
    userListings,
    categories,
    loading,
    error,
    pagination,
    loadCategories,
    loadHomePageListings,
    loadListings,
    getListing,
    createListing,
    getUserListings,
    updateListing,
    deleteListing
  };

  return (
    <ListingContext.Provider value={value}>
      {children}
    </ListingContext.Provider>
  );
};

export default ListingContext;