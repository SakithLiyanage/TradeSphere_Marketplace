import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaSort, FaTimes } from 'react-icons/fa';
import { useListing } from '../context/ListingContext';
import ListingCard from '../components/listings/ListingCard';
import Loader from '../components/common/Loader';
import ChatBot from '../components/common/ChatBot'; // Add this import

const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const ListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { loadListings, listings, categories, loading, pagination, loadCategories } = useListing();
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    condition: searchParams.get('condition') || '',
    location: searchParams.get('location') || '',
    sort: searchParams.get('sort') || 'newest'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  
  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Fetch listings on mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Convert filters to API expected parameters
        const apiParams = { ...filters, page, limit: 12 };
        
        // Convert sort values to API expected format
        if (apiParams.sort === 'price_low') apiParams.sort = 'price-asc';
        if (apiParams.sort === 'price_high') apiParams.sort = 'price-desc';
        if (apiParams.sort === 'newest') apiParams.sort = 'createdAt-desc';
        if (apiParams.sort === 'oldest') apiParams.sort = 'createdAt-asc';
        if (apiParams.sort === 'popular') apiParams.sort = 'viewCount-desc';
        
        await loadListings(apiParams);
      } catch (error) {
        console.error('Failed to fetch listings', error);
      }
    };
    
    fetchData();
  }, [loadListings, filters, page]);
  
  // Update search params when filters change
  useEffect(() => {
    const params = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params[key] = value;
      }
    });
    
    // Add page to params if not on first page
    if (page > 1) {
      params.page = page.toString();
    }
    
    setSearchParams(params, { replace: true });
  }, [filters, page, setSearchParams]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page on filter change
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      location: '',
      sort: 'newest'
    });
    setPage(1);
  };
  
  // Conditions for dropdown
  const conditions = ['new', 'like-new', 'excellent', 'good', 'fair', 'poor'];
  
  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' }
  ];
  
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        <br></br><br></br>
          {filters.search 
            ? `Search results for "${filters.search}"`
            : filters.category
              ? `${toTitleCase(filters.category)} Listings`
              : 'All Listings'
          }
        </h1>
      </div>
    
      {/* Search and Filter Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search listings..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FaFilter className="mr-2" /> 
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <div className="relative">
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 appearance-none"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FaSort className="text-gray-400" />
            </div>
          </div>
        </form>
      </div>
      
      {/* Expanded filters */}
      {showFilters && (
        <div className="mb-8 bg-white p-4 rounded-md shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <FaTimes className="mr-1" /> Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Categories</option>
                {categories?.map((category) => (
                  <option 
                    key={category._id || category.id || category.slug} 
                    value={category.slug || category.name?.toLowerCase()}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Any Condition</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {toTitleCase(condition)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="City, District..."
                value={filters.location}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Min Price (LKR)
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                placeholder="0"
                min="0"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Max Price (LKR)
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                placeholder="Any"
                min="0"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Applied filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(filters).map(([key, value]) => {
          if (!value || key === 'sort') return null;
          
          let label = '';
          if (key === 'search') label = `Search: ${value}`;
          else if (key === 'category') label = `Category: ${toTitleCase(value)}`;
          else if (key === 'minPrice') label = `Min: LKR ${value}`;
          else if (key === 'maxPrice') label = `Max: LKR ${value}`;
          else if (key === 'condition') label = `Condition: ${toTitleCase(value)}`;
          else if (key === 'location') label = `Location: ${value}`;
          
          return (
            <div 
              key={key}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
            >
              <span>{label}</span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={12} />
              </button>
            </div>
          );
        })}
        
        {Object.values(filters).some(val => val) && filters.sort !== 'newest' && (
          <button
            onClick={clearFilters}
            className="text-primary-500 hover:text-primary-700 text-sm"
          >
            Clear All
          </button>
        )}
      </div>
      
      {/* Listings Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size="large" />
        </div>
      ) : !listings || listings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-500 mb-4">No listings found matching your criteria.</div>
          <button
            onClick={clearFilters}
            className="text-primary-500 hover:text-primary-700 font-medium"
          >
            Clear filters and try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard 
              key={listing._id} 
              listing={listing} 
              featured={listing.featured}
            />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 bg-white text-gray-500 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            
            <div className="flex">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => {
                // Show current page, first, last, and 1 page before/after current
                if (
                  pageNum === 1 || 
                  pageNum === pagination.pages || 
                  Math.abs(page - pageNum) <= 1
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 border border-gray-300 ${
                        page === pageNum 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === 2 && page > 3) || 
                  (pageNum === pagination.pages - 1 && page < pagination.pages - 2)
                ) {
                  return <span key={pageNum} className="px-3 py-1 border border-gray-300 bg-white">...</span>;
                }
                return null;
              })}
            </div>
            
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, pagination.pages))}
              disabled={page === pagination.pages}
              className="px-3 py-1 border border-gray-300 bg-white text-gray-500 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
      
      {/* Add ChatBot component */}
      <ChatBot />
    </div>
  );
};

export default ListingsPage;