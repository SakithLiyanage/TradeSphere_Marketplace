import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaEye, FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const ListingCard = ({ listing, featured = false }) => {
  const {
    _id,
    title,
    price,
    images,
    location,
    createdAt,
    condition,
    viewCount
  } = listing;

  const { currentUser } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check favorite status when component mounts
  useEffect(() => {
    if (currentUser) {
      checkFavoriteStatus();
    }
  }, [currentUser, _id]);

  // Function to check if listing is favorited
  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/favorites/${_id}/check`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setIsFavorited(response.data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  // Function to toggle favorite status
  const toggleFavorite = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    
    if (!currentUser) {
      toast.error('Please log in to save favorites');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (isFavorited) {
        // Remove from favorites
        await axios.delete(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/favorites/${_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Removed from favorites');
        setIsFavorited(false);
      } else {
        // Add to favorites
        await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/favorites`,
          { listingId: _id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Added to favorites');
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Could not update favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format price with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <div className={`bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl ${featured ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}>
        {/* Image container with fixed aspect ratio */}
        <div className="relative w-full pt-[56.25%]"> {/* 16:9 aspect ratio */}
          <Link to={`/listings/${_id}`} className="absolute inset-0">
            {images && images.length > 0 ? (
              <img
                src={images[0]}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                No Image
              </div>
            )}
          </Link>
          
          {/* Condition badge */}
          {condition && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-xs rounded-full text-gray-700 font-medium shadow-sm">
              {condition}
            </span>
          )}
          
          {/* Featured badge */}
          {featured && (
            <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full flex items-center gap-1 text-white font-medium shadow-md">
              <FaStar /> Featured
            </div>
          )}
          
          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            className={`absolute top-3 ${featured ? 'right-16' : 'right-3'} w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isFavorited 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-500'
            } shadow-md`}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            {loading ? (
              <Loader size="small" light={isFavorited} />
            ) : (
              isFavorited ? <FaHeart size={14} /> : <FaRegHeart size={14} />
            )}
          </button>
        </div>
        
        {/* Content */}
        <Link to={`/listings/${_id}`} className="flex-grow flex flex-col p-4">
          <div className="flex-grow">
            <h3 className="text-lg font-medium text-gray-900 mb-1.5 line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <FaMapMarkerAlt className="mr-1 text-gray-400" />
              <span className="truncate">{location}</span>
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-primary-600">
                LKR {formatPrice(price)}
              </p>
              <div className="flex items-center text-gray-400 text-xs">
                <FaEye className="mr-1" /> 
                <span>{viewCount || 0}</span>
              </div>
            </div>
            
            <div className="text-gray-400 text-xs mt-2 flex justify-between items-center">
              <span>Listed {formatDate(createdAt)}</span>
              
              {/* View details link */}
              <span className="text-primary-500 font-medium">View Details</span>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ListingCard;