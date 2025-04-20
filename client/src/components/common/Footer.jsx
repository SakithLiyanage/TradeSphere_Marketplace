// src/components/common/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import tradeLogo from '../../images/tradelogo.png';

import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
  FaArrowUp,
  FaShieldAlt,
  FaTruck,
  FaHeadset,
  FaCheck
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would normally send the email to your API
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const socialHover = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.1,
      y: -2,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };
  
  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Trust badges section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <FaShieldAlt size={24} />, title: 'Secure Trading', text: 'Protected by encryption' },
              { icon: <FaTruck size={24} />, title: 'Local Delivery', text: 'Meet in safe locations' },
              { icon: <FaHeadset size={24} />, title: '24/7 Support', text: 'Here to help anytime' },
              { icon: <FaCheck size={24} />, title: 'Verified Users', text: 'Trusted community' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                className="flex flex-col items-center text-center"
              >
                <div className="bg-primary-500/10 p-3 rounded-full text-primary-400 mb-3">
                  {item.icon}
                </div>
                <h4 className="text-white font-medium text-lg">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-white">
              <img 
                  src={tradeLogo} 
                  alt="TradeSphere Logo" 
                  className="h-40 w-auto" 
                />
              </Link>
              <p className="text-gray-400 mt-4 max-w-md">
                Your trusted marketplace for buying and selling locally. 
                Find great deals on new & used items, or sell something you no longer need.
              </p>
              
              <motion.div 
                className="flex space-x-4 mt-6"
                variants={staggerChildren}
              >
                {[
                  { icon: <FaFacebookF size={16} />, href: 'https://facebook.com', label: 'Facebook' },
                  { icon: <FaTwitter size={16} />, href: 'https://twitter.com', label: 'Twitter' },
                  { icon: <FaInstagram size={16} />, href: 'https://instagram.com', label: 'Instagram' },
                  { icon: <FaLinkedinIn size={16} />, href: 'https://linkedin.com', label: 'LinkedIn' },
                  { icon: <FaYoutube size={16} />, href: 'https://youtube.com', label: 'YouTube' }
                ].map((social, i) => (
                  <motion.a 
                    key={i}
                    href={social.href}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors duration-300"
                    aria-label={social.label}
                    variants={fadeInUp}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </div>
          
          {/* Quick Links */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { text: 'Browse All', link: '/listings' },
                { text: 'Sell an Item', link: '/create-listing' },
                { text: 'Dashboard', link: '/dashboard' },
                { text: 'About Us', link: '/about' },
                { text: 'Contact', link: '/contact' }
              ].map((item, i) => (
                <motion.li
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: {
                        delay: i * 0.1,
                        duration: 0.5,
                        ease: "easeOut"
                      }
                    }
                  }}
                >
                  <Link 
                    to={item.link} 
                    className="inline-block text-gray-400 hover:text-primary-400 transition-colors duration-300 transform hover:translate-x-1"
                  >
                    {item.text}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Categories */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Categories</h3>
            <ul className="space-y-3">
              {[
                { text: 'Vehicles', link: '/category/vehicles' },
                { text: 'Electronics', link: '/category/electronics' },
                { text: 'Furniture', link: '/category/furniture' },
                { text: 'Properties', link: '/category/properties' },
                { text: 'Jobs', link: '/category/jobs' }
              ].map((item, i) => (
                <motion.li
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: {
                        delay: i * 0.1,
                        duration: 0.5,
                        ease: "easeOut"
                      }
                    }
                  }}
                >
                  <Link 
                    to={item.link} 
                    className="inline-block text-gray-400 hover:text-primary-400 transition-colors duration-300 transform hover:translate-x-1"
                  >
                    {item.text}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Contact Information */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="lg:col-span-2"
          >
            <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Get in Touch</h3>
            
            {/* Newsletter Subscription */}
            <div className="mb-6">
              <p className="text-gray-400 mb-3">
                Subscribe to our newsletter for the latest updates
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <div className="flex-grow">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500 text-gray-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-medium rounded-lg shadow-lg hover:shadow-primary-600/30 transition-all duration-300 whitespace-nowrap"
                >
                  Subscribe <FaArrowRight className="inline ml-1" size={12} />
                </button>
              </form>
              
              {subscribed && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 mt-2 text-sm"
                >
                  Thanks for subscribing!
                </motion.p>
              )}
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-400 mt-1 flex-shrink-0" />
                <span>123 Market Street, San Francisco, CA 94105, USA</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhoneAlt className="text-primary-400 flex-shrink-0" />
                <a 
                  href="tel:+14155552671" 
                  className="hover:text-primary-400 transition-colors"
                >
                  +1 (415) 555-2671
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-400 flex-shrink-0" />
                <a 
                  href="mailto:info@tradesphere.com" 
                  className="hover:text-primary-400 transition-colors"
                >
                  info@tradesphere.com
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} TradeSphere. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-sm text-gray-500 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
      
      {/* Back to top button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-primary-500 hover:bg-primary-600 text-white h-12 w-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl z-30 transition-all duration-300"
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Back to top"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FaArrowUp />
      </motion.button>
    </footer>
  );
};

export default Footer;