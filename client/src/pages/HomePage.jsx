// src/pages/HomePage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaChevronRight, FaStar, FaArrowRight, FaShieldAlt, 
  FaUserFriends, FaTags, FaRegClock, FaMapMarkerAlt
} from 'react-icons/fa';
import { HiOutlineSparkles, HiTrendingUp } from 'react-icons/hi';
import { useListing } from '../context/ListingContext';
import Loader from '../components/common/Loader';
import ListingCard from '../components/listings/ListingCard';
import ChatBot from '../components/common/ChatBot';

// Enhanced ScrollReveal Component for more professional animations
const ScrollReveal = ({ children, threshold = 0.1 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Animation variants with more sophisticated effects
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const slideInLeft = {
  hidden: { x: -60, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 80,
      damping: 12
    }
  }
};

const scaleUp = {
  hidden: { scale: 0.85, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 80,
      delay: 0.1
    }
  }
};

const HomePage = () => {
  const { 
    featuredListings, 
    recentListings, 
    loading, 
    loadHomePageListings 
  } = useListing();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  
  // Refs for scroll animations
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

  useEffect(() => {
    window.scrollTo(0, 0);
    loadHomePageListings();
  }, [loadHomePageListings]);

  // Array of categories with more detailed icons and UX
  const categories = [
    { 
      slug: 'vehicles', 
      name: 'Vehicles', 
      icon: '🚗',
      description: 'Cars, bikes, and boats',
      color: 'from-blue-500 to-blue-600',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-700'
    },
    { 
      slug: 'electronics', 
      name: 'Electronics', 
      icon: '📱',
      description: 'Phones, laptops, gadgets',
      color: 'from-purple-500 to-purple-600',
      gradient: 'bg-gradient-to-br from-purple-500 to-indigo-700'
    },
    { 
      slug: 'furniture', 
      name: 'Furniture', 
      icon: '🛋️',
      description: 'Home and office furniture',
      color: 'from-amber-500 to-amber-600',
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-700'
    },
    { 
      slug: 'properties', 
      name: 'Properties', 
      icon: '🏠',
      description: 'Homes, apartments, land',
      color: 'from-green-500 to-green-600',
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-700'
    },
    { 
      slug: 'jobs', 
      name: 'Jobs', 
      icon: '💼',
      description: 'Career opportunities',
      color: 'from-red-500 to-red-600',
      gradient: 'bg-gradient-to-br from-red-500 to-rose-700'
    },
    { 
      slug: 'services', 
      name: 'Services', 
      icon: '🔧',
      description: 'Professional services',
      color: 'from-cyan-500 to-cyan-600',
      gradient: 'bg-gradient-to-br from-cyan-500 to-sky-700'
    },
    { 
      slug: 'fashion', 
      name: 'Fashion', 
      icon: '👕',
      description: 'Clothing and accessories',
      color: 'from-pink-500 to-pink-600',
      gradient: 'bg-gradient-to-br from-pink-500 to-fuchsia-700'
    },
    { 
      slug: 'hobbies', 
      name: 'Hobbies', 
      icon: '🎨',
      description: 'Sports, art collections',
      color: 'from-yellow-500 to-yellow-600',
      gradient: 'bg-gradient-to-br from-yellow-500 to-amber-700'
    }
  ];

  // Features section data
  const features = [
    {
      icon: <FaShieldAlt className="text-3xl text-primary-500" />,
      title: "Secure Transactions",
      description: "Our advanced security measures ensure your transactions are always protected."
    },
    {
      icon: <FaUserFriends className="text-3xl text-primary-500" />,
      title: "Verified Users",
      description: "Every seller and buyer on our platform goes through verification for your safety."
    },
    {
      icon: <FaTags className="text-3xl text-primary-500" />,
      title: "Best Deals",
      description: "Find competitive prices on thousands of items from local and global sellers."
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Ultra Modern Hero Section with 3D effect and Parallax */}
      <div 
        ref={targetRef} 
        className="relative min-h-[120vh] flex items-center justify-center overflow-hidden"
      >
        {/* Dynamic background - multi-layered */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-indigo-900" />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        </div>
        
        {/* Animated mesh grid - professional touch */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div 
            className="absolute w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20.83l2.83-2.83 1.41 1.41L1.41 22H0v-1.17zM0 3.07l2.83-2.83 1.41 1.41L1.41 4.24H0V3.07zm20.76-1.41l2.83-2.83 1.41 1.41L22.17 2.83h-1.41V0zm0 17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm0 17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zM22.17 40H40v-1.41L22.17 20.76 20.76 22.17 38.59 40zm17.76-22.17L40 0h-1.41L20.76 17.83l1.41 1.41 17.83-17.83z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px',
              transform: 'translateZ(0)',
            }}
          />
        </div>

        {/* Floating 3D objects */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10"
              style={{
                width: `${Math.random() * 300 + 80}px`,
                height: `${Math.random() * 300 + 80}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.2)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.8, 0.4],
                scale: [0, 1, 0.8],
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                rotateZ: [0, Math.random() * 180],
              }}
              transition={{
                duration: 15 + Math.random() * 15,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
        
        <motion.div 
          className="container mx-auto px-6 relative z-10 mt-20"
          style={{ 
            y: springY,
            scale: springScale,
            opacity: springOpacity,
          }}
        >
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="bg-white/10 backdrop-blur-xl text-white px-5 py-2 rounded-full flex items-center gap-2 font-medium border border-white/20 shadow-xl">
                <HiOutlineSparkles className="text-yellow-300" /> Welcome to TradeSphere
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Modern</span> Marketplace
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-cyan-500">For Everything Local</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Join millions of people buying and selling in your community. Find amazing deals or turn your unused items into cash today.
            </motion.p>
            
            {/* Enhanced Search Bar with 3D effect */}
            <motion.div
              className="relative max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div 
                className="flex rounded-full overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl bg-white/10 border border-white/20 p-1.5"
                whileHover={{ boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="flex-1 py-5 px-8 bg-transparent text-white placeholder-white/60 focus:outline-none text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Link 
                  to={`/listings?search=${searchQuery}`}
                  className="bg-white hover:bg-gray-100 text-primary-600 px-10 flex items-center justify-center transition-all duration-300 ease-in-out rounded-full font-medium text-lg"
                >
                  <FaSearch className="mr-2" /> Search
                </Link>
              </motion.div>

              <motion.div 
                className="absolute -bottom-14 left-0 right-0 text-center text-white/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <p className="text-md">
                  <span className="text-white/50 mr-2">Popular:</span>
                  {["iPhone", "Furniture", "Apartment", "Mountain Bike"].map((term, i) => (
                    <button 
                      key={i}
                      className="inline-block mx-2 text-white/90 hover:text-white transition-colors"
                      onClick={() => setSearchQuery(term)}
                    >
                      {term}
                    </button>
                  ))}
                </p>
              </motion.div>
            </motion.div>
            
            {/* Post Ad Button for Mobile with 3D effect */}
            <motion.div 
              className="mt-24 block md:hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Link 
                to="/create-listing" 
                className="inline-flex items-center py-4 px-8 bg-white text-primary-600 rounded-full font-medium shadow-2xl hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] transition-all duration-300 transform hover:-translate-y-1"
              >
                <span>Post Your Ad</span>
                <FaArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Scroll prompt */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-sm flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <p className="mb-2 text-white/70">Scroll to explore</p>
          <motion.div 
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
          >
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-white"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
            />
          </motion.div>
        </motion.div>
        
        {/* Modern wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-32">
          <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 74" xmlns="http://www.w3.org/2000/svg">
            <path d="M456.464 0.0433865C277.158 -1.70575 0 50.0141 0 50.0141V74H1440V50.0141C1440 50.0141 1320.4 31.1925 1243.09 27.0276C1099.33 19.2816 1019.08 53.1981 875.138 50.0141C710.527 46.3727 621.108 1.64949 456.464 0.0433865Z" className="fill-white"></path>
          </svg>
        </div>
      </div>
      
      {/* Category section with horizontal scroll and 3D cards */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center mb-12">
              <span className="bg-primary-50 text-primary-600 px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">Categories</span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Find What You Need
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl">
                Browse through our diverse range of categories and discover exactly what you're looking for.
              </p>
              <div className="mt-6 w-20 h-1.5 bg-primary-600 rounded-full"></div>
            </div>
          </ScrollReveal>

          {/* Desktop Categories View */}
          <div className="hidden lg:block">
            <motion.div 
              className="grid grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {categories.map((category) => (
                <motion.div key={category.slug} variants={scaleUp}>
                   <Link 
                      to={`/categories/${category.slug}`}
                      className="group block"
                      onMouseEnter={() => setActiveCategory(category.slug)}
                      onMouseLeave={() => setActiveCategory(null)}
                    >
                    <motion.div 
                      className="bg-white rounded-2xl overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 h-full"
                      whileHover={{ scale: 1.02 }}
                      style={{ 
                        boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                      }}
                    >
                      <div className={`h-36 flex items-center justify-center ${category.gradient} relative overflow-hidden`}>
                        <span className="text-5xl relative z-10">{category.icon}</span>
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-20" 
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-xl text-gray-800 group-hover:text-primary-600 transition-colors">
                            {category.name}
                          </h3>
                          <span className="text-xs bg-gray-100 text-gray-600 py-1 px-2 rounded-full font-medium">
                            {category.count}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {category.description}
                        </p>
                        <div className={`mt-4 flex items-center text-sm font-medium ${activeCategory === category.slug ? 'text-primary-600' : 'text-primary-500'} transition-colors`}>
                          <span>Browse category</span>
                          <motion.div
                            animate={{ x: activeCategory === category.slug ? 5 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FaChevronRight className="ml-1" size={12} />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Mobile Categories - Horizontal Scroll */}
          <div className="lg:hidden -mx-6 px-6 pb-4">
            <ScrollReveal>
              <div className="flex overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
                <div className="flex space-x-4">
                  {categories.map((category) => (
                    <div 
                      key={category.slug} 
                      className="snap-start flex-shrink-0 w-72 group"
                    >
                      <Link to={`/categories/${category.slug}`} className="block">
                        <motion.div 
                          className="bg-white rounded-2xl overflow-hidden transform transition-all duration-300 hover:-translate-y-1 h-full"
                          whileTap={{ scale: 0.98 }}
                          style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
                        >
                          <div className={`h-28 flex items-center justify-center ${category.gradient} relative overflow-hidden`}>
                            <span className="text-5xl">{category.icon}</span>
                            <div className="absolute inset-0 opacity-20" 
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                              }}
                            />
                          </div>
                          <div className="p-5">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-lg text-gray-800">
                                {category.name}
                              </h3>
                              <span className="text-xs bg-gray-100 text-gray-600 py-1 px-2 rounded-full">
                                {category.count}
                              </span>
                            </div>
                            <p className="text-gray-500 text-sm line-clamp-2">
                              {category.description}
                            </p>
                          </div>
                        </motion.div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
      
     
      
      {/* Recent Listings with 3D Cards */}
      <div className="bg-white py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50 rounded-full translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="flex flex-col items-center md:flex-row md:justify-between md:items-end mb-12">
              <div className="text-center md:text-left mb-8 md:mb-0">
                <div className="inline-flex items-center bg-primary-50 text-primary-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  <HiTrendingUp className="mr-2 text-primary-500" /> New on Market
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                  Just Listed
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl">
                  Be the first to discover and purchase the newest items on our platform
                </p>
              </div>
              <Link 
                to="/listings" 
                className="flex items-center gap-2 px-6 py-3 bg-gray-50 shadow-lg rounded-full text-primary-600 hover:text-primary-700 font-medium transition-all hover:shadow-xl transform hover:-translate-y-1"
              >
                View All Listings <FaChevronRight size={14} />
              </Link>
            </div>
          </ScrollReveal>
          
          {loading ? (
            <Loader />
          ) : (
            <div>
              {/* Desktop view with grid layout */}
              <motion.div 
                className="hidden lg:grid grid-cols-4 gap-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {recentListings && recentListings.length > 0 ? (
                  recentListings.slice(0, 8).map((listing) => (
                    <motion.div key={listing._id} variants={scaleUp}>
                      <ListingCard listing={listing} style="modern" />
                    </motion.div>
                  ))
                ) : (
                  <motion.p 
                    className="col-span-full text-center text-gray-500 py-16 bg-gray-50 rounded-2xl shadow-sm"
                    variants={fadeIn}
                  >
                    No listings available at the moment.
                  </motion.p>
                )}
              </motion.div>
              
              {/* Mobile view with horizontal scroll */}
              <div className="lg:hidden -mx-6 px-6">
                <ScrollReveal>
                  <div className="flex overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory">
                    <div className="flex space-x-4">
                      {recentListings && recentListings.length > 0 ? (
                        recentListings.map((listing) => (
                          <div 
                            key={listing._id}
                            className="snap-start flex-shrink-0 w-80"
                          >
                            <ListingCard listing={listing} style="modern" />
                          </div>
                        ))
                      ) : (
                        <p className="flex-shrink-0 w-full text-center text-gray-500 py-12">
                          No listings available at the moment.
                        </p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Benefits Section with Animated Icons */}
      <div className="py-24 bg-gray-900 text-white relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute right-0 top-0 h-48 w-48 text-white/5" viewBox="0 0 100 100" preserveAspectRatio="none" fill="currentColor">
            <polygon points="0,0 100,0 100,100" />
          </svg>
          <svg className="absolute left-0 bottom-0 h-48 w-48 text-white/5" viewBox="0 0 100 100" preserveAspectRatio="none" fill="currentColor">
            <polygon points="0,0 0,100 100,100" />
          </svg>
          <div className="absolute top-20 left-40 w-64 h-64 rounded-full bg-gradient-to-br from-primary-700/20 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-primary-400 uppercase tracking-wider text-sm font-semibold">Why Choose TradeSphere</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                The Benefits of Our Platform
              </h2>
              <p className="text-xl text-gray-300">
                Experience a secure, convenient, and efficient marketplace designed with both buyers and sellers in mind.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <ScrollReveal key={i} threshold={0.2}>
                <motion.div 
                  className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 hover:border-primary-500/50 transition-all duration-300"
                  whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6 bg-primary-900/50 w-16 h-16 rounded-xl flex items-center justify-center border-b border-primary-700/40">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal threshold={0.1}>
            <div className="mt-20 pt-12 border-t border-gray-800">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                {[].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 * i, duration: 0.5 }}
                  >
                    <div className="counter text-5xl font-black text-white mb-2">{stat.value}</div>
                    <div className="text-gray-400 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
      
      {/* User Testimonials - Add credibility */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-primary-600 uppercase tracking-wider text-sm font-semibold">Testimonials</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600">
                Don't just take our word for it. Here's what our community has to say about TradeSphere.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[].map((testimonial, i) => (
              <ScrollReveal key={i} threshold={0.1}>
                <motion.div 
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-primary-100 transition-all duration-300"
                  whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                >
                  <svg width="45" height="36" className="text-primary-200 mb-6" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3 36C11.5 36 9.9 35.3 8.5 33.9C7.1 32.5 6.39999 30.9 6.39999 29.1C6.39999 27.5 6.79999 25.8 7.59999 24C8.39999 22.2 9.5 20.4 10.9 18.6C12.3 16.8 13.9 15.2 15.7 13.8C17.5 12.4 19.5 11.3 21.7 10.5L23.8 12.9C22.2 13.7 20.7 14.8 19.3 16.2C17.9 17.6 16.8 19 16 20.4C15.2 21.8 14.8 23 14.8 24C14.8 24.4 15 24.9 15.4 25.5C15.8 26.1 16.2 26.6 16.6 27C17 27.4 17.2 27.6 17.2 27.6C18 28.2 18.6 29 19 30C19.4 31 19.6 31.9 19.6 32.7C19.6 33.5 19.3 34.3 18.7 35.1C18.1 35.7 17.3 36 16.3 36H13.3ZM34.3 36C32.5 36 30.9 35.3 29.5 33.9C28.1 32.5 27.4 30.9 27.4 29.1C27.4 27.5 27.8 25.8 28.6 24C29.4 22.2 30.5 20.4 31.9 18.6C33.3 16.8 34.9 15.2 36.7 13.8C38.5 12.4 40.5 11.3 42.7 10.5L44.8 12.9C43.2 13.7 41.7 14.8 40.3 16.2C38.9 17.6 37.8 19 37 20.4C36.2 21.8 35.8 23 35.8 24C35.8 24.4 36 24.9 36.4 25.5C36.8 26.1 37.2 26.6 37.6 27C38 27.4 38.2 27.6 38.2 27.6C39 28.2 39.6 29 40 30C40.4 31 40.6 31.9 40.6 32.7C40.6 33.5 40.3 34.3 39.7 35.1C39.1 35.7 38.3 36 37.3 36H34.3Z" fill="currentColor"/>
                  </svg>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-primary-600">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
      
      {/* Ultra Modern CTA */}
      <div className="relative py-20 md:py-32 overflow-hidden">
        {/* Background - 3D gradient with animated pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '24px 24px',
            }}
          />
        </div>
        
        {/* Animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${Math.random() * 400 + 200}px`,
                height: `${Math.random() * 400 + 200}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 60 - 30],
                y: [0, Math.random() * 60 - 30],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 10,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <motion.div 
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl"
                whileHover={{ boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="md:flex-1 mb-8 md:mb-0 md:pr-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                      Start Selling Today
                    </h2>
                    <p className="text-xl text-white/80 mb-6">
                      Turn your unused items into cash in minutes. Create your listing and reach thousands of local buyers.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {[
                        { icon: <FaRegClock className="text-primary-300" />, text: "Quick listing creation" },
                        { icon: <FaUserFriends className="text-primary-300" />, text: "Access to thousands of buyers" },
                        { icon: <FaMapMarkerAlt className="text-primary-300" />, text: "Convenient local transactions" },
                      ].map((item, i) => (
                        <li key={i} className="flex items-center text-white/80">
                          <span className="mr-3">{item.icon}</span>
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:w-72">
                    <motion.div
                      className="rounded-xl overflow-hidden shadow-2xl bg-white p-6"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-gray-800 font-bold text-xl mb-4">Create Your Listing</h3>
                      <Link 
                        to="/create-listing" 
                        className="block w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-center font-medium transition-colors mb-3"
                      >
                        Get Started Now
                      </Link>
                      <p className="text-gray-500 text-sm text-center">
                        Free to list, no hidden fees
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Add ChatBot component at the end */}
      <ChatBot />

      {/* Add custom styling for hiding scrollbars while allowing scrolling */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default HomePage;