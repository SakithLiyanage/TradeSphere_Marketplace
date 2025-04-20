import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaUser, 
  FaPhone, 
  FaEnvelope,
  FaWhatsapp,
  FaHeart,
  FaShare,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useListing } from '../../context/ListingContext';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

// Helper functions for formatting
const formatPrice = (price) => {
  return price ? `Rs. ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : 'Price not specified';
};

const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffTime = Math.abs(now - past);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 1) {
    const hours = Math.floor(diffTime / (1000 * 60 * 60));
    if (hours < 1) {
      const minutes = Math.floor(diffTime / (1000 * 60));
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getListing, currentListing, loading, deleteListing } = useListing();
  const { currentUser } = useAuth();
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const loadListing = async () => {
      try {
        await getListing(id);
      } catch (error) {
        console.error("Error loading listing:", error);
        toast.error('Failed to load listing');
        navigate('/listings');
      }
    };
    
    loadListing();
  }, [getListing, id, navigate]);
  
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    try {
      await deleteListing(id);
      toast.success('Listing deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };
  
  if (loading || !currentListing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }
  
  const { 
    title, 
    price, 
    description, 
    images, 
    condition, 
    location, 
    category,
    specifications,
    createdAt,
    user,
    viewCount
  } = currentListing;
  
  const isOwner = currentUser && user && currentUser._id === user._id;
  
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
      <br></br><br></br><br></br><br></br>
        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm">
          <Link to="/" className="text-gray-500 hover:text-primary-600">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/listings" className="text-gray-500 hover:text-primary-600">Listings</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link 
            to={`/listings?category=${category}`} 
            className="text-gray-500 hover:text-primary-600"
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-medium">
            {truncateText(title, 30)}
          </span>
        </nav>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Images and details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="space-y-4">
              <div className="relative pb-[70%] bg-gray-100 rounded-lg overflow-hidden">
                {images && images.length > 0 ? (
                  <img
                    src={images[activeImageIndex]}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    No images available
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {images && images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <div 
                      key={index}
                      className={`w-20 h-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 ${
                        activeImageIndex === index ? 'border-primary-500' : 'border-transparent'
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Listing details */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-1 text-primary-500" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1 text-primary-500" />
                  <span>{formatRelativeTime(createdAt)}</span>
                </div>
                <div className="px-2 py-1 bg-gray-100 rounded-full">
                  {condition}
                </div>
                
                {viewCount > 0 && (
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400">
                      {viewCount} view{viewCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-3xl font-bold text-primary-600">
                {formatPrice(price)}
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{description}</p>
              </div>
              
              {/* Specifications */}
              {specifications && Object.keys(specifications).length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-lg font-semibold mb-4">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(specifications).map(([key, value]) => (
                      <div key={key} className="flex">
                        <span className="font-medium w-1/3 text-gray-700">{key}:</span>
                        <span className="text-gray-900 w-2/3">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Actions for listing owner */}
              {isOwner && (
                <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-4">
                  <Link 
                    to={`/edit-listing/${id}`}
                    className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                  >
                    <FaEdit className="mr-2" /> Edit Listing
                  </Link>
                  <button
                    onClick={handleDeleteClick}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    <FaTrash className="mr-2" /> Delete Listing
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Right column: Seller info and actions */}
          <div className="space-y-6">
            {/* Seller info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser size={20} />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{user?.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
              </div>
              
              {showContactInfo ? (
                <div className="space-y-3">
                  {user?.phone && (
                    <div>
                      <div className="text-sm text-gray-500">Phone:</div>
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{user.phone}</div>
                        <div className="flex space-x-2">
                          <a 
                            href={`tel:${user.phone}`}
                            className="p-2 bg-primary-50 text-primary-600 rounded-full hover:bg-primary-100"
                          >
                            <FaPhone size={14} />
                          </a>
                          <a 
                            href={`https://wa.me/${user.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100"
                          >
                            <FaWhatsapp size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {user?.email && (
                    <div>
                      <div className="text-sm text-gray-500">Email:</div>
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{user.email}</div>
                        <a 
                          href={`mailto:${user.email}`}
                          className="p-2 bg-primary-50 text-primary-600 rounded-full hover:bg-primary-100"
                        >
                          <FaEnvelope size={14} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowContactInfo(true)}
                  className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md"
                >
                  Show Contact Information
                </button>
              )}
            </div>
            
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Actions</h2>
              
              <div className="space-y-3">
                <button 
                  className="w-full py-2 flex justify-center items-center bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => toast.success('Added to favorites!')}
                >
                  <FaHeart className="mr-2 text-red-500" />
                  <span>Save to Favorites</span>
                </button>
                
                <button 
                  className="w-full py-2 flex justify-center items-center bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard!');
                  }}
                >
                  <FaShare className="mr-2 text-primary-500" />
                  <span>Share Listing</span>
                </button>
              </div>
            </div>
            
            {/* Safety tips */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-md p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Safety Tips</h3>
              <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-1">
                <li>Meet in public places</li>
                <li>Check the item before paying</li>
                <li>Pay only after inspecting the item</li>
                <li>Don't send money in advance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Delete Listing</h3>
            <p className="mb-6">Are you sure you want to delete this listing? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function for truncating text
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export default ListingDetails;