// src/context/ListingContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getUserListings,
  getHomePageListings,
  getCategories,
} from '../utils/api';

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
      const { data } = await getCategories();
      setCategories(data || []);
      return data;
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load home page listings
  const loadHomePageListings = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getHomePageListings();
      setFeaturedListings(data.featured || []);
      setRecentListings(data.recent || []);
      return data;
    } catch (error) {
      console.error('Error loading homepage listings:', error);
      setError('Failed to load featured listings');
      return { featured: [], recent: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  // Load listings with filters
  const loadListings = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const { data } = await getListings(params);
      setListings(data.data || []);
      setPagination({
        page: data.page || 1,
        pages: data.pages || 1,
        total: data.total || 0
      });
      return data;
    } catch (error) {
      console.error('Error loading listings:', error);
      setError('Failed to load listings');
      return { data: [], page: 1, pages: 1, total: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user's listings
  const loadUserListings = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getUserListings();
      setUserListings(data.data || []);
      return data.data;
    } catch (error) {
      console.error('Error loading user listings:', error);
      setError('Failed to load your listings');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load single listing
  const loadListing = useCallback(async (id) => {
    try {
      setLoading(true);
      const { data } = await getListing(id);
      setCurrentListing(data.data);
      return data.data;
    } catch (error) {
      console.error('Error loading listing details:', error);
      setError('Failed to load listing details');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new listing
  const addListing = useCallback(async (listingData) => {
    try {
      setLoading(true);
      const { data } = await createListing(listingData);
      toast.success('Listing created successfully!');
      return data.data;
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error(error.response?.data?.message || 'Failed to create listing');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing listing
  const editListing = useCallback(async (id, listingData) => {
    try {
      setLoading(true);
      const { data } = await updateListing(id, listingData);
      toast.success('Listing updated successfully!');
      return data.data;
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error(error.response?.data?.message || 'Failed to update listing');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete listing
  const removeListing = useCallback(async (id) => {
    try {
      setLoading(true);
      await deleteListing(id);
      toast.success('Listing deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error(error.response?.data?.message || 'Failed to delete listing');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCurrentListing = () => {
    setCurrentListing(null);
  };

  return (
    <ListingContext.Provider
      value={{
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
        loadUserListings,
        loadListing,
        addListing,
        editListing,
        removeListing,
        clearCurrentListing
      }}
    >
      {children}
    </ListingContext.Provider>
  );
};