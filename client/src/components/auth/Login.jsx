import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaFacebookF, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';
import { toast } from 'react-hot-toast';
import tradeLogo from '../../images/tradelogo.png';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, currentUser, loading } = useAuth();
  const [authError, setAuthError] = useState(null);
  const [socialLoading, setSocialLoading] = useState({ facebook: false, google: false });
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or use dashboard as default
  const from = location.state?.from?.pathname || "/";
  
  // Effect to redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from]);
  
  const onSubmit = async (data) => {
    try {
      setAuthError(null);
      await login(data);
      
      // Show success message
      toast.success('Login successful!');
      
      // The redirection will happen via the useEffect above
    } catch (error) {
      console.error("Login error:", error);
      if (error.message === 'Network Error') {
        setAuthError('Unable to connect to the server. Please check your connection or try again later.');
      } else {
        setAuthError(error.response?.data?.message || 'Login failed. Please check your credentials and try again.');
      }
    }
  };
  
  // Social authentication handler
  const handleSocialAuth = async (provider) => {
    try {
      setAuthError(null);
      setSocialLoading({ ...socialLoading, [provider.toLowerCase()]: true });
      
      // This should be implemented in your AuthContext
      toast.info(`${provider} login will be available soon!`);
    } catch (error) {
      console.error(`${provider} authentication error:`, error);
      setAuthError(`Failed to authenticate with ${provider}. Please try again.`);
    } finally {
      setSocialLoading({ ...socialLoading, [provider.toLowerCase()]: false });
    }
  };
  
  // If already logged in, don't render the form
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <br></br><br></br><br></br>
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 p-8">
          <div className="mb-8 text-center">
            <img 
              src={tradeLogo}
              alt="TradeSphere Logo" 
              className="h-14 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to continue to TradeSphere
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
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password", { 
                    required: "Password is required"
                  })}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.password ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200'} rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                {...register("remember")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition-all duration-150 disabled:opacity-60"
              >
                {loading ? <Loader size="small" /> : 'Sign in'}
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
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
  );
};

export default Login;