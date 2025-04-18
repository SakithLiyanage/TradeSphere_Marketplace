// src/components/listings/ListingCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaHeart, FaRegHeart, FaEye } from 'react-icons/fa';

const ListingCard = ({ listing, featured = false }) => {
  const {
    _id,
    title,
    price,
    images,
    location,
    createdAt,
    condition,
    views
  } = listing;

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
    >
      <Link to={`/listings/${_id}`} className="block h-full">
        <div className={`bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl ${featured ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}>
          {/* Image container with relative positioning for badges */}
          <div className="relative">
            {/* Image */}
            <div className="aspect-w-16 aspect-h-10 bg-gray-200">
              {images && images.length > 0 ? (
                <img
                  src={images[0]}
                  alt={title}
                  className="object-cover w-full h-48"
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center h-48 bg-gray-100 text-gray-400">
                  No Image
                </div>
              )}
            </div>
            
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
            
            {/* Save button */}
            <button className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-md text-gray-600 hover:text-red-500">
              <FaRegHeart />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-5 flex-grow flex flex-col">
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
                  ${formatPrice(price)}
                </p>
                <div className="flex items-center text-gray-400 text-xs">
                  <FaEye className="mr-1" /> 
                  <span>{views || 0}</span>
                </div>
              </div>
              
              <div className="text-gray-400 text-xs mt-2 flex justify-between">
                <span>Listed {formatDate(createdAt)}</span>
                
                {/* View details link */}
                <span className="text-primary-500 font-medium">View Details</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ListingCard;