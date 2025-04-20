import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import tradeLogo from '../../images/tradelogo.png';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaChevronRight,
  FaArrowUp
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer content */}
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div>
            <Link to="/" className="flex items-center mb-5">
              <img 
                src={tradeLogo} 
                alt="TradeSphere Logo" 
                className="h-16 w-auto" 
              />
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              Your trusted marketplace for buying and selling locally.
              Connect with buyers and sellers in your area today.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <FaFacebookF size={15} />, href: '#', label: 'Facebook' },
                { icon: <FaTwitter size={15} />, href: '#', label: 'Twitter' },
                { icon: <FaInstagram size={15} />, href: '#', label: 'Instagram' },
                { icon: <FaLinkedinIn size={15} />, href: '#', label: 'LinkedIn' }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { text: 'Browse All', link: '/listings' },
                { text: 'Sell an Item', link: '/create-listing' },
                { text: 'Dashboard', link: '/dashboard' },
                { text: 'About Us', link: '/about' },
                { text: 'Contact', link: '/contact' }
              ].map((item, i) => (
                <li key={i}>
                  <Link 
                    to={item.link} 
                    className="text-gray-400 hover:text-primary-400 text-sm flex items-center group"
                  >
                    <FaChevronRight className="mr-2 text-primary-500 h-2 w-2 transition-transform group-hover:translate-x-1" />
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Categories</h3>
            <ul className="space-y-2">
              {[
                { text: 'Vehicles', link: '/categories/vehicles' },
                { text: 'Electronics', link: '/categories/electronics' },
                { text: 'Furniture', link: '/categories/furniture' },
                { text: 'Properties', link: '/categories/properties' },
                { text: 'Jobs', link: '/categories/jobs' }
              ].map((item, i) => (
                <li key={i}>
                  <Link 
                    to={item.link} 
                    className="text-gray-400 hover:text-primary-400 text-sm flex items-center group"
                  >
                    <FaChevronRight className="mr-2 text-primary-500 h-2 w-2 transition-transform group-hover:translate-x-1" />
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>Sri Lanka</li>
              <li>Email: <a href="mailto:sakithchanlaka2004@gmail.com" className="hover:text-primary-400">sakithchanlaka2004@gmail.com</a></li>
              <li>Phone: <a href="tel:+94769092755" className="hover:text-primary-400">+94 76 909 2755</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} TradeSphere. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-300">Terms</Link>
            <span className="text-gray-700">•</span>
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-300">Privacy</Link>
            <span className="text-gray-700">•</span>
            <Link to="/cookies" className="text-xs text-gray-500 hover:text-gray-300">Cookies</Link>
          </div>
        </div>
      </div>
      
      {/* Back to top button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-primary-500 hover:bg-primary-600 text-white h-10 w-10 rounded-full flex items-center justify-center shadow-md z-30 transition-all duration-200"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Back to top"
      >
        <FaArrowUp size={12} />
      </motion.button>
    </footer>
  );
};

export default Footer;