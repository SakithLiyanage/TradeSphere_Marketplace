// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationCircle, FaArrowLeft } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <FaExclamationCircle className="text-primary-500 text-6xl mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="inline-flex items-center text-primary-500 hover:text-primary-600">
          <FaArrowLeft className="mr-2" /> Go back to home page
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;