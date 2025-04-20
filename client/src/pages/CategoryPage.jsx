import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaFilter, FaSort, FaTimes } from 'react-icons/fa';
import { useListing } from '../context/ListingContext';
import ListingCard from '../components/listings/ListingCard';
import Loader from '../components/common/Loader';

const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const CategoryPage = () => {
  
  const { category } = useParams();
  const { fetchListingsByCategory, listings, loading, pagination } = useListing();
  
  const [filters, setFilters] = useState({
    condition: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Fetch listings for this category
  useEffect(() => {
    
    const loadCategoryListings = async () => {
      try {
        // Convert sort values to API expected format
        const apiParams = { ...filters, page, limit: 16 };
        
        if (apiParams.sort === 'price_low') apiParams.sort = 'price-asc';
        if (apiParams.sort === 'price_high') apiParams.sort = 'price-desc';
        if (apiParams.sort === 'newest') apiParams.sort = 'createdAt-desc';
        if (apiParams.sort === 'oldest') apiParams.sort = 'createdAt-asc';
        
        const data = await fetchListingsByCategory(category, apiParams);
        setTotalPages(Math.ceil(data.total / data.limit));
      } catch (error) {
        console.error('Error fetching category listings', error);
      }
    };
    
    loadCategoryListings();
  }, [category, fetchListingsByCategory, filters, page]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilters({
      condition: '',
      minPrice: '',
      maxPrice: '',
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
  ];
  
  
  // Category specific metadata
  
  const categoryMeta = {
    
    'vehicles': {
      title: 'Vehicles for Sale',
      description: 'Find the perfect vehicle. Browse cars, motorcycles, vans, trucks, boats and more.',
      icon: 'fa-car',
      popularSearches: ['Toyota', 'Honda', 'Suzuki', 'Car', 'Van']
    },
    'properties': {
      title: 'Properties',
      description: 'Find houses, apartments, land and commercial properties for sale and rent.',
      icon: 'fa-home',
      popularSearches: ['House', 'Apartment', 'Land', 'Rent', 'Sale']
    },
    'electronics': {
      title: 'Electronics',
      description: 'Shop the latest electronics including phones, laptops, TVs, cameras and more.',
      icon: 'fa-laptop',
      popularSearches: ['iPhone', 'Samsung', 'TV', 'Laptop', 'Camera']
    },
    'furniture': {
      title: 'Furniture',
      description: 'Discover quality furniture for your home, office or garden at great prices.',
      icon: 'fa-couch',
      popularSearches: ['Sofa', 'Bed', 'Table', 'Chair', 'Wardrobe']
    },
    'jobs': {
      title: 'Jobs',
      description: 'Find your next career opportunity. Browse latest job vacancies across Sri Lanka.',
      icon: 'fa-briefcase',
      popularSearches: ['Part Time', 'IT', 'Driver', 'Sales', 'Manager']
    },
    'services': {
      title: 'Services',
      description: 'Find local services from trusted providers across Sri Lanka.',
      icon: 'fa-concierge-bell',
      popularSearches: ['Cleaning', 'Plumbing', 'Electrician', 'Delivery', 'Education']
    }
  };
  
  const meta = categoryMeta[category] || {
    title: toTitleCase(category),
    description: `Browse all ${toTitleCase(category)} listings`,
    icon: 'fa-tag',
    popularSearches: []
  };

  // Track applied filters for UI
  const getAppliedFilters = () => {
    const applied = [];
    
    if (filters.condition) applied.push({
      key: 'condition',
      label: `Condition: ${toTitleCase(filters.condition)}`
    });
    
    if (filters.minPrice) applied.push({
      key: 'minPrice',
      label: `Min Price: Rs.${filters.minPrice}`
    });
    
    if (filters.maxPrice) applied.push({
      key: 'maxPrice',
      label: `Max Price: Rs.${filters.maxPrice}`
    });
    
    return applied;
  };
  
  const appliedFilters = getAppliedFilters();
  
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
            <i className={`fas ${meta.icon}`}></i>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {meta.title}
          </h1>
        </div>
        <p className="text-gray-600">{meta.description}</p>
        
        {/* Popular searches */}
        {meta.popularSearches.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Popular:</span>
            {meta.popularSearches.map((term) => (
              <Link 
                key={term}
                to={`/listings?category=${category}&search=${term}`}
                className="text-sm text-primary-600 hover:underline"
              >
                {term}
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
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
        </div>
      </div>
      
      {/* Expanded filters */}
      
      {showFilters && (
        <div className="mb-8 bg-white p-4 rounded-md shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      
      {/* Applied Filters */}
      {appliedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {appliedFilters.map((filter) => (
            <div 
              key={filter.key}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
            >
              <span>{filter.label}</span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, [filter.key]: '' }))}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={12} />
              </button>
            </div>
          ))}
          
          {appliedFilters.length > 0 && (
            <button
              onClick={clearFilters}
              className="text-primary-500 hover:text-primary-700 text-sm"
            >
              Clear All
            </button>
          )}
        </div>
      )}
      
      {/* Listings Grid */}
      
      {loading ? (
        <Loader />
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No listings found in this category.</div>
          {(filters.condition || filters.minPrice || filters.maxPrice) && (
            <button
              onClick={clearFilters}
              className="text-primary-500 hover:text-primary-700"
            >
              Clear filters
            </button>
          )}
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
      {totalPages > 1 && (
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
              {[...Array(totalPages).keys()].map((num) => {
                const pageNum = num + 1;
                // Show current page, first, last, and 1 page before/after current
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
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
                  (pageNum === totalPages - 1 && page < totalPages - 2)
                ) {
                  return <span key={pageNum} className="px-3 py-1 border border-gray-300 bg-white">...</span>;
                }
                return null;
              })}
            </div>
            
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 border border-gray-300 bg-white text-gray-500 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;