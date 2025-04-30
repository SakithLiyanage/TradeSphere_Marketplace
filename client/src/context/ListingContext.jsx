import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const ListingContext = createContext();

export const useListing = () => useContext(ListingContext);

export const ListingProvider = ({ children }) => {
  const [listings, setListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [userListings, setUserListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentListing, setCurrentListing] = useState(null);
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
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/categories`
      );
      
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Load listings with optional filters
  const loadListings = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/listings?${queryParams.toString()}`
      );
      
      if (response.data.success) {
        setListings(response.data.listings);
        setPagination(response.data.pagination);
      }
      
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Error loading listings:', error);
      setError('Failed to load listings');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch listings by category
  const fetchListingsByCategory = useCallback(async (categorySlug, params = {}) => {
    try {
      setLoading(true);
      
      // Add the category to the params
      const queryParams = new URLSearchParams();
      
      // Ensure category is included
      queryParams.append('category', categorySlug);
      
      // Add other filters
      Object.entries(params).forEach(([key, value]) => {
        if (value && key !== 'category') queryParams.append(key, value);
      });
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/listings?${queryParams.toString()}`
      );
      
      if (response.data.success) {
        setListings(response.data.listings);
        setPagination(response.data.pagination);
      }
      
      setError(null);
      return {
        listings: response.data.listings,
        total: response.data.pagination.total,
        limit: params.limit || 16
      };
    } catch (error) {
      console.error(`Error fetching listings for category ${categorySlug}:`, error);
      setError(`Failed to load ${categorySlug} listings`);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load home page listings (featured and recent)
  const loadHomePageListings = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch featured listings
      const featuredResponse = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/listings?featured=true&limit=8`
      );
      
      if (featuredResponse.data.success) {
        setFeaturedListings(featuredResponse.data.listings);
      }
      
      // Fetch recent listings
      const recentResponse = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/listings?limit=8&sort=createdAt-desc`
      );
      
      if (recentResponse.data.success) {
        setRecentListings(recentResponse.data.listings);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error loading homepage listings:', error);
      setError('Failed to load homepage listings');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user listings
  const loadUserListings = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/listings/user/me?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setUserListings(response.data.listings);
      }
      
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Error loading user listings:', error);
      setError('Failed to load your listings');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single listing
  const getListing = useCallback(async (id) => {
    try {
      setLoading(true);
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/listings/${id}`
      );
      
      if (response.data.success) {
        setCurrentListing(response.data.listing);
      } else {
        throw new Error('Listing not found');
      }
      
      setError(null);
      return response.data.listing;
    } catch (error) {
      console.error(`Error fetching listing ${id}:`, error);
      setError('Failed to load listing');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new listing
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success && response.data.listing) {
        // Update user listings if they exist
        if (userListings.length > 0) {
          setUserListings(prevListings => [response.data.listing, ...prevListings]);
        }
        
        setError(null);
        return response.data.listing;
      } else {
        throw new Error(response.data.message || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      const errorMsg = error.response?.data?.message || error.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [userListings]);

  // Update listing
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

      // If successful, update the current listing in state
      if (response.data.success && response.data.listing) {
        setCurrentListing(response.data.listing);
        
        // Update listing in userListings array if it exists
        if (userListings.length > 0) {
          setUserListings(userListings.map(listing => 
            listing._id === id ? response.data.listing : listing
          ));
        }
      }

      setError(null);
      return response.data.listing;
    } catch (error) {
      console.error(`Error updating listing ${id}:`, error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update listing';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [userListings]);

  // Delete listing
  const deleteListing = useCallback(async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You must be logged in to delete a listing');
      }

      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/listings/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Update user listings if they exist
        if (userListings.length > 0) {
          setUserListings(userListings.filter(listing => listing._id !== id));
        }

        setError(null);
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to delete listing');
      }
    } catch (error) {
      console.error(`Error deleting listing ${id}:`, error);
      const errorMessage = error.response?.data?.message || error.message;
      setError(`Failed to delete listing: ${errorMessage}`);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userListings]);
  
  // Clear current listing
  const clearCurrentListing = () => {
    setCurrentListing(null);
  };

  // Value object to be provided
  const value = {
    listings,
    featuredListings,
    recentListings,
    userListings,
    categories,
    currentListing,
    loading,
    error,
    pagination,
    loadCategories,
    loadListings,
    loadHomePageListings,
    loadUserListings,
    getListing,
    createListing,
    updateListing,
    deleteListing,
    clearCurrentListing,
    fetchListingsByCategory
  };

  return (
    <ListingContext.Provider value={value}>
      {children}
    </ListingContext.Provider>
  );
};

export default ListingContext;