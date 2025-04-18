import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useListing } from '../../context/ListingContext';
import { getCategoryIcon } from '../../utils/helpers';

const Navbar = () => {
  const { categories } = useListing();
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [displayedCategories, setDisplayedCategories] = useState([]);
  const [hiddenCategories, setHiddenCategories] = useState([]);
  
  const checkOverflow = () => {
    const navElement = document.getElementById('category-nav');
    if (navElement) {
      const isOverflow = navElement.scrollWidth > navElement.clientWidth;
      setIsOverflowing(isOverflow);
    }
  };
  
  // Split categories based on screen size
  useEffect(() => {
    const handleResize = () => {
      let visibleCount;
      if (window.innerWidth < 640) {
        visibleCount = 4;
      } else if (window.innerWidth < 768) {
        visibleCount = 6;
      } else {
        visibleCount = 8;
      }
      
      setDisplayedCategories(categories.slice(0, visibleCount));
      setHiddenCategories(categories.slice(visibleCount));
      checkOverflow();
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [categories]);
  
  return (
    <nav className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center">
          <div 
            id="category-nav"
            className="py-3 flex space-x-6 overflow-x-auto scrollbar-hide flex-grow"
          >
            {displayedCategories.map((category) => (
              <Link
                key={category._id || category.name}
                to={`/category/${category.slug}`}
                className="flex items-center text-gray-700 whitespace-nowrap hover:text-primary-500 transition-colors"
              >
                <i className={`${getCategoryIcon(category.slug)} mr-2`}></i>
                <span>{category.name}</span>
              </Link>
            ))}
            
            {hiddenCategories.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="flex items-center text-gray-700 hover:text-primary-500 whitespace-nowrap"
                >
                  <span>More</span>
                  <i className={`fas fa-chevron-${showMoreMenu ? 'up' : 'down'} ml-1`}></i>
                </button>
                
                {showMoreMenu && (
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-md mt-1 py-2 z-10 w-48">
                    {hiddenCategories.map((category) => (
                      <Link
                        key={category._id || category.name}
                        to={`/category/${category.slug}`}
                        onClick={() => setShowMoreMenu(false)}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50"
                      >
                        <i className={`${getCategoryIcon(category.slug)} mr-2`}></i>
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <Link
            to="/listings"
            className="ml-4 text-primary-500 font-medium whitespace-nowrap"
          >
            All Categories
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;