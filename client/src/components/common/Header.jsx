import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaBars, FaTimes, FaSun, FaMoon, 
  FaUser, FaPlus, FaSignOutAlt, FaHeart, FaBell,
  FaChevronDown, FaShoppingBag, FaRegCompass, FaHome
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import tradeLogo from '../../images/tradelogo.png';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef(null);
  
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Focus search input when expanded
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [showSearch]);
  
  // Handle dark mode toggle
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };
  
  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${searchQuery}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };
  
  // Variants for animations
  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    hover: { 
      scale: 1.05, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    }
  };
  
  const dropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24 
      } 
    }
  };
  
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { 
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { 
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const searchExpandVariants = {
    hidden: { width: "40px", opacity: 0.7 },
    visible: { 
      width: "300px", 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24 
      }
    },
    exit: {
      width: "40px",
      opacity: 0.7,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const isHomepage = location.pathname === '/';
  const headerBg = scrolled
    ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md"
    : isHomepage
      ? "bg-transparent"
      : "bg-white dark:bg-gray-900";
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* TradeSphere Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="h-14"
            >
              <img 
                src={tradeLogo} 
                alt="TradeSphere Logo" 
                className="h-14 w-14"
              />
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.1,
                  }
                }
              }}
              className="flex items-center space-x-1"
            >
              {/* Home Link - Added */}
              <motion.div variants={navItemVariants} whileHover="hover">
                <Link 
                  to="/" 
                  className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    scrolled || !isHomepage
                      ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FaHome size={16} />
                  <span>Home</span>
                </Link>
              </motion.div>
              
              <motion.div variants={navItemVariants} whileHover="hover">
                <Link 
                  to="/listings" 
                  className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    scrolled || !isHomepage
                      ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FaRegCompass size={16} />
                  <span>Browse</span>
                </Link>
              </motion.div>
              
              {/* Expanded Search Input (Desktop) */}
              <motion.div variants={navItemVariants} className="relative">
                <AnimatePresence mode="wait">
                  {!showSearch ? (
                    <motion.button
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={navItemVariants}
                      onClick={() => setShowSearch(true)}
                      className={`p-2.5 rounded-full transition-colors ${
                        scrolled || !isHomepage
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      aria-label="Search"
                    >
                      <FaSearch size={16} />
                    </motion.button>
                  ) : (
                    <motion.form
                      onSubmit={handleSearch}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={searchExpandVariants}
                      className={`flex items-center overflow-hidden ${
                        scrolled || !isHomepage
                          ? 'bg-gray-100 dark:bg-gray-800' 
                          : 'bg-white/20'
                      } rounded-full`}
                    >
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search listings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-4 pr-2 py-2 text-sm ${
                          scrolled || !isHomepage
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200' 
                            : 'bg-transparent text-white placeholder:text-white/70'
                        } focus:outline-none border-none`}
                        onBlur={() => {
                          if (!searchQuery) setShowSearch(false);
                        }}
                      />
                      <button
                        type="submit"
                        className={`p-2.5 ${
                          scrolled || !isHomepage
                            ? 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200' 
                            : 'hover:bg-white/30 text-white'
                        } rounded-full`}
                        aria-label="Submit search"
                      >
                        <FaSearch size={16} />
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Dark mode toggle */}
              <motion.button 
                variants={navItemVariants}
                whileHover="hover"
                onClick={toggleDarkMode}
                className={`p-2.5 rounded-full transition-colors ${
                  scrolled || !isHomepage
                    ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200' 
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
              </motion.button>
              
              {/* Sell Button - Show for all users */}
              <motion.div variants={navItemVariants} whileHover="hover">
                <Link
                  to="/create-listing"
                  className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <FaPlus size={14} />
                  <span>Sell Item</span>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* User Menu - Only show profile/login based on auth state */}
            <motion.div 
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              className="relative ml-2"
            >
              {currentUser ? (
                /* Show user profile dropdown for logged in users */
                <>
                  <motion.button 
                    className={`flex items-center space-x-2 p-1.5 rounded-full transition-colors ${
                      scrolled || !isHomepage
                        ? 'hover:bg-gray-100 dark:hover:bg-gray-800' 
                        : 'hover:bg-white/10'
                    }`}
                    onClick={toggleUserDropdown}
                    whileHover="hover"
                  >
                    <div className="relative">
                      {/* Notification indicator */}
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500"></span>
                      </span>
                      
                      {currentUser.avatar ? (
                        <img 
                          src={currentUser.avatar} 
                          alt={currentUser.name} 
                          className="h-9 w-9 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                        />
                      ) : (
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white font-medium shadow-sm ${
                          scrolled || !isHomepage
                            ? 'bg-primary-500' 
                            : 'bg-white/20'
                        }`}>
                          {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <FaChevronDown 
                      size={12} 
                      className={`transform transition-transform ${userDropdownOpen ? 'rotate-180' : ''} ${
                        scrolled || !isHomepage
                          ? 'text-gray-700 dark:text-gray-200' 
                          : 'text-white'
                      }`}
                    />
                  </motion.button>
                  
                  {/* User dropdown menu */}
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div 
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                        className="absolute right-0 mt-2 w-64 rounded-2xl shadow-xl bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 focus:outline-none origin-top-right overflow-hidden"
                      >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{currentUser.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
                        </div>
                        <div className="py-2">
                          <Link 
                            to="/dashboard" 
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <FaUser className="mr-3 text-gray-500 dark:text-gray-400" size={16} />
                            Dashboard
                          </Link>
                          <Link 
                            to="/favorites" 
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <FaHeart className="mr-3 text-gray-500 dark:text-gray-400" size={16} />
                            Favorites
                          </Link>
                          
                          <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <FaSignOutAlt className="mr-3" size={16} />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                /* Show Sign in and Register buttons for non-logged in users */
                <div className="flex items-center space-x-3">
                  <motion.div whileHover="hover" variants={navItemVariants}>
                    <Link 
                      to="/login" 
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        scrolled || !isHomepage
                          ? 'text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800' 
                          : 'text-white border border-white/30 hover:bg-white/10'
                      }`}
                    >
                      Sign in
                    </Link>
                  </motion.div>
                  <motion.div whileHover="hover" variants={navItemVariants}>
                    <Link 
                      to="/register" 
                      className="px-4 py-2 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Register
                    </Link>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3">
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                scrolled || !isHomepage
                  ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800' 
                  : 'text-white hover:bg-white/10'
              } transition-colors`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-full ${
                scrolled || !isHomepage
                  ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800' 
                  : 'text-white hover:bg-white/10'
              } transition-colors`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-3">
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search listings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button 
                    type="submit" 
                    className="absolute left-0 top-0 h-full px-3 flex items-center text-gray-500 dark:text-gray-400"
                  >
                    <FaSearch size={16} />
                  </button>
                </div>
              </form>
              
              {/* Home Link - Added to mobile menu */}
              <Link 
                to="/" 
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaHome size={18} />
                <span className="font-medium">Home</span>
              </Link>
              
              <Link 
                to="/listings" 
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaRegCompass size={18} />
                <span className="font-medium">Browse Listings</span>
              </Link>
              
              <Link 
                to="/create-listing" 
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaPlus size={18} />
                <span className="font-medium">Sell an Item</span>
              </Link>
              
              {currentUser ? (
                /* Show user profile info for logged in users on mobile */
                <>
                  <div className="my-2 border-t border-gray-200 dark:border-gray-800"></div>
                  
                  <div className="flex items-center px-4 py-3">
                    {currentUser.avatar ? (
                      <img 
                        src={currentUser.avatar} 
                        alt={currentUser.name} 
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold mr-3">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{currentUser.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                    </div>
                  </div>
                  
                  <Link 
                    to="/dashboard" 
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUser size={18} />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  
                  <Link 
                    to="/favorites" 
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaHeart size={18} />
                    <span className="font-medium">Favorites</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <FaSignOutAlt size={18} />
                    <span className="font-medium">Sign out</span>
                  </button>
                </>
              ) : (
                /* Show login options for non-logged in users on mobile */
                <div className="mt-6 grid grid-cols-1 gap-3">
                  <Link 
                    to="/login" 
                    className="w-full py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-xl text-center font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link 
                    to="/register" 
                    className="w-full py-3 px-4 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl text-center font-medium shadow-md transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;