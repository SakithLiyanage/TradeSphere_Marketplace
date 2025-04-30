import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegSadTear, FaArrowLeft, FaArrowRight, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const Favorites = () => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 8
  });

  useEffect(() => {
    fetchUserFavorites();
  }, [pagination.page]);

  const fetchUserFavorites = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'https://tradesphere-backend.vercel.app'}/api/favorites`, 
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { 
            page: pagination.page,
            limit: pagination.limit
          }
        }
      );

      if (response.data.success) {
        setFavorites(response.data.favorites);
        setPagination(response.data.pagination);
      } else {
        throw new Error('Failed to fetch favorites');
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Failed to load your favorite listings');
      toast.error('Could not load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (listingId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL || 'https://tradesphere-backend.vercel.app'}/api/favorites/${listingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update UI by removing the listing from favorites array
        setFavorites(favorites.filter(fav => fav.listing._id !== listingId));
        
        // Update pagination total
        setPagination(prev => ({
          ...prev,
          total: prev.total - 1,
          pages: Math.ceil((prev.total - 1) / prev.limit)
        }));
        
        toast.success('Removed from favorites');
      } else {
        throw new Error('Failed to remove favorite');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Could not remove from favorites. Please try again.');
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Format price with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <br></br><br></br>
            <h1 className="text-2xl font-bold text-gray-900">Your Favorites</h1>
            <p className="text-gray-600 mt-1">
              {pagination.total} {pagination.total === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <Link
            to="/listings"
            className="mt-4 md:mt-0 flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <FaArrowLeft className="mr-2" /> Browse more listings
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size="large" />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchUserFavorites}
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
            >
              Try Again
            </button>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-10 text-center">
            <div className="flex justify-center">
              <FaRegSadTear className="text-gray-400 text-5xl" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-700">No favorites yet</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              You haven't saved any listings to your favorites yet. 
              Browse listings and click the heart icon to add them here.
            </p>
            <Link
              to="/listings"
              className="mt-6 inline-flex items-center px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600"
            >
              Find Something to Love
            </Link>
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence>
                {favorites.map((favorite) => {
                  const listing = favorite.listing;
                  if (!listing) return null; // Skip if listing was deleted

                  return (
                    <motion.div
                      key={favorite._id}
                      className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                      variants={item}
                      layout
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Link to={`/listings/${listing._id}`} className="block relative">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                          <img
                            src={listing.images?.[0] || '/placeholder-image.png'}
                            alt={listing.title}
                            className="object-cover w-full h-48"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-image.png';
                            }}
                          />
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFavorite(listing._id);
                          }}
                          className="absolute top-3 right-3 bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full text-red-500 hover:text-red-600 shadow-md transition-all"
                          title="Remove from favorites"
                        >
                          <FaTrash size={14} />
                        </button>
                        <div className="absolute top-3 left-3">
                          <span className="bg-gray-900/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                            {listing.condition}
                          </span>
                        </div>
                      </Link>

                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                          {listing.title}
                        </h3>
                        <p className="text-primary-600 font-bold mb-2">
                          Rs. {formatPrice(listing.price)}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="truncate">{listing.location}</span>
                          <span className="flex items-center">
                            <FaHeart className="text-red-500 mr-1" /> Saved
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-10">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <FaArrowLeft className="h-3 w-3" />
                  </button>
                  
                  {/* Page numbers */}
                  {[...Array(pagination.pages)].map((_, i) => {
                    const pageNumber = i + 1;
                    // Show current page, first and last pages, and 1 page around current
                    const show = 
                      pageNumber === 1 || 
                      pageNumber === pagination.pages || 
                      Math.abs(pageNumber - pagination.page) <= 1;
                    
                    if (show) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            pageNumber === pagination.page
                              ? 'bg-primary-50 border-primary-500 text-primary-600 z-10'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          } text-sm font-medium`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      (pageNumber === 2 && pagination.page > 3) || 
                      (pageNumber === pagination.pages - 1 && pagination.page < pagination.pages - 2)
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                    disabled={pagination.page === pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <FaArrowRight className="h-3 w-3" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;