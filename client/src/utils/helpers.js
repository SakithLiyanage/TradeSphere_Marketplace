/**
 * Format price with currency symbol
 * @param {Number} price - Price to format
 * @param {String} currency - Currency code (default: LKR)
 * @returns {String} Formatted price
 */
export const formatPrice = (price, currency = 'LKR') => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  /**
   * Format date to relative time (e.g., "2 days ago")
   * @param {String|Date} dateString - Date to format
   * @returns {String} Formatted relative time
   */
  export const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 60) {
      return diffMinutes === 0 ? 'Just now' : `${diffMinutes} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };
  
  /**
   * Truncate text with ellipsis
   * @param {String} text - Text to truncate
   * @param {Number} maxLength - Maximum length
   * @returns {String} Truncated text
   */
  export const truncateText = (text, maxLength = 100) => {
    if (text?.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  };
  
  /**
   * Convert kebab-case to title case
   * @param {String} text - Text to convert
   * @returns {String} Title case text
   */
  export const toTitleCase = (text) => {
    if (!text) return '';
    return text
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  /**
   * Check if image URL is valid
   * @param {String} url - Image URL to check
   * @returns {Boolean} Whether URL is valid
   */
  export const isValidImageUrl = (url) => {
    if (!url) return false;
    return url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
  };
  
  /**
   * Generate category icon based on category name
   * @param {String} category - Category name
   * @returns {String} Icon class name
   */
  export const getCategoryIcon = (category) => {
    const icons = {
      'vehicles': 'fas fa-car',
      'properties': 'fas fa-home',
      'electronics': 'fas fa-laptop',
      'furniture': 'fas fa-couch',
      'fashion': 'fas fa-tshirt',
      'jobs': 'fas fa-briefcase',
      'services': 'fas fa-concierge-bell',
      'pets': 'fas fa-paw'
    };
    
    return icons[category.toLowerCase()] || 'fas fa-tag';
  };
  
  /**
   * Filter listings by search term
   * @param {Array} listings - Listings to filter
   * @param {String} searchTerm - Search term
   * @returns {Array} Filtered listings
   */
  export const filterListingsBySearch = (listings, searchTerm) => {
    if (!searchTerm) return listings;
    
    const term = searchTerm.toLowerCase();
    return listings.filter(listing => 
      listing.title.toLowerCase().includes(term) || 
      listing.description.toLowerCase().includes(term)
    );
  };