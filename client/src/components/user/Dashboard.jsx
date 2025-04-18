import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useListing } from '../../context/ListingContext';
import { formatPrice, formatRelativeTime } from '../../utils/helpers';
import Loader from '../common/Loader';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { fetchUserListings, deleteListing } = useListing();
  
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  
  useEffect(() => {
    const loadUserListings = async () => {
      try {
        setLoading(true);
        const data = await fetchUserListings(currentUser._id);
        setMyListings(data.listings);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load your listings');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserListings();
  }, [currentUser._id, fetchUserListings]);
  
  const handleDeleteClick = (listing) => {
    setListingToDelete(listing);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (!listingToDelete) return;
    
    try {
      await deleteListing(listingToDelete._id);
      setMyListings(prev => prev.filter(item => item._id !== listingToDelete._id));
      toast.success('Listing deleted successfully');
    } catch (error) {
      toast.error('Failed to delete listing');
    } finally {
      setShowDeleteConfirm(false);
      setListingToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setListingToDelete(null);
  };
  
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with welcome message */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentUser?.name?.split(' ')[0]}!</p>
          </div>
          <Link
            to="/create-listing"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md"
          >
            <FaPlus className="mr-2" /> Create New Listing
          </Link>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl font-bold text-primary-500">{myListings.length}</div>
            <div className="text-gray-500">Active Listings</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl font-bold text-accent-500">{myListings.filter(l => l.views > 0).length}</div>
            <div className="text-gray-500">Viewed Listings</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl font-bold text-green-500">{myListings.filter(l => l.featured).length}</div>
            <div className="text-gray-500">Featured Listings</div>
          </div>
        </div>
        
        {/* Your listings */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Listings</h2>
          </div>
          
          {loading ? (
            <Loader />
          ) : myListings.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-4">You don't have any listings yet.</p>
              <Link
                to="/create-listing"
                className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md"
              >
                <FaPlus className="mr-2" /> Create Your First Listing
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listing
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {myListings.map((listing) => (
                    <tr key={listing._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={listing.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
                              alt={listing.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {listing.title.length > 30 ? `${listing.title.substring(0, 30)}...` : listing.title}
                            </div>
                            <div className="text-sm text-gray-500">{listing.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatPrice(listing.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatRelativeTime(listing.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${listing.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {listing.active ? 'Active' : 'Inactive'}
                        </span>
                        {listing.featured && (
                          <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-accent-100 text-accent-800">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/listings/${listing._id}`}
                            className="text-gray-600 hover:text-gray-900"
                            title="View"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            to={`/edit-listing/${listing._id}`}
                            className="text-primary-600 hover:text-primary-900"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(listing)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Delete Listing</h3>
            <p className="mb-6">Are you sure you want to delete "{listingToDelete?.title}"? This action cannot be undone.</p>
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

export default Dashboard;