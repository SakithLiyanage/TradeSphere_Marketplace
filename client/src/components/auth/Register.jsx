import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaFacebookF, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';
import { toast } from 'react-hot-toast';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser, currentUser, loading, socialLogin } = useAuth();
  const [authError, setAuthError] = useState(null);
  const [socialLoading, setSocialLoading] = useState({ facebook: false, google: false });
  const password = watch("password", "");
  const navigate = useNavigate(); // Initialize navigate hook
  
  // Redirect if already logged in
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const onSubmit = async (data) => {
    try {
      setAuthError(null);
      await registerUser(data);
      
      // Show success message
      toast.success('Account created successfully!');
      
      // Navigate to home page after successful registration
      navigate('/');
    } catch (error) {
      console.error("Registration error:", error);
      if (error.message === 'Network Error') {
        setAuthError('Unable to connect to the server. Please check your connection or try again later.');
      } else {
        setAuthError(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    }
  };
  
  // Social authentication handler
  const handleSocialAuth = async (provider) => {
    try {
      setAuthError(null);
      setSocialLoading({ ...socialLoading, [provider.toLowerCase()]: true });
      
      if (typeof socialLogin === 'function') {
        await socialLogin(provider.toLowerCase());
        // On success, will navigate via the currentUser check
      } else {
        // Fallback if socialLogin isn't implemented
        toast.info(`${provider} login will be available soon!`);
      }
    } catch (error) {
      console.error(`${provider} authentication error:`, error);
      setAuthError(`Failed to authenticate with ${provider}. Please try again.`);
    } finally {
      setSocialLoading({ ...socialLoading, [provider.toLowerCase()]: false });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
      <br></br><br></br>
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Join TradeSphere marketplace today
              </p>
            </div>

            {authError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start">
                <svg className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-red-600 font-medium">{authError}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    {...register("name", { 
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters"
                      }
                    })}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.name ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200'} rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200'} rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+94 XXX XXX XXX"
                    {...register("phone", { 
                      pattern: {
                        value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                        message: "Invalid phone number format"
                      }
                    })}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.phone ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200'} rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <span className="text-xs text-gray-500">Min. 6 characters</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.password ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200'} rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    {...register("confirmPassword", { 
                      required: "Please confirm your password",
                      validate: value => value === password || "Passwords do not match"
                    })}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.confirmPassword ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200'} rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    {...register("terms", { 
                      required: "You must agree to the terms and conditions"
                    })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition-all duration-150 disabled:opacity-60"
                >
                  {loading ? <Loader size="small" /> : 'Create Account'}
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Facebook')}
                  disabled={socialLoading.facebook}
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-60"
                >
                  {socialLoading.facebook ? <Loader size="small" /> : <FaFacebookF className="text-blue-600 mr-2" />}
                  <span className="text-sm font-medium text-gray-700">Facebook</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Google')}
                  disabled={socialLoading.google}
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-60"
                >
                  {socialLoading.google ? <Loader size="small" /> : <FaGoogle className="text-red-500 mr-2" />}
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;