import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaUpload, FaTimes, FaMoneyBillWave, FaMapMarkerAlt, FaTag, FaClipboardList } from 'react-icons/fa';
import { BsImageAlt } from 'react-icons/bs';
import { HiOutlineDocumentText, HiChevronRight } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { useListing } from '../../context/ListingContext';
import Loader from '../common/Loader';
import axios from 'axios';

const CreateListing = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      category: '',
      condition: 'New',
      location: '',
    }
  });
  
  const { categories, loadCategories, createListing, loading } = useListing();
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const selectedCategory = watch('category');
  
  useEffect(() => {
    loadCategories();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [loadCategories]);
  
  const categoryFields = {
    'vehicles': [
      { name: 'brand', label: 'Brand' },
      { name: 'model', label: 'Model' },
      { name: 'year', label: 'Year', type: 'number' },
      { name: 'mileage', label: 'Mileage (km)', type: 'number' },
      { name: 'fuelType', label: 'Fuel Type' },
      { name: 'transmission', label: 'Transmission' }
    ],
    'property': [
      { name: 'size', label: 'Size (sqft)', type: 'number' },
      { name: 'bedrooms', label: 'Bedrooms', type: 'number' },
      { name: 'bathrooms', label: 'Bathrooms', type: 'number' },
      { name: 'propertyType', label: 'Property Type' }
    ],
    'electronics': [
      { name: 'brand', label: 'Brand' },
      { name: 'model', label: 'Model' },
      { name: 'age', label: 'Age (years)', type: 'number' }
    ],
    'furniture': [
      { name: 'material', label: 'Material' },
      { name: 'dimensions', label: 'Dimensions' }
    ]
  };
  
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    if (uploadedImages.length + files.length > 8) {
      toast.error('Maximum 8 images allowed');
      return;
    }
    
    try {
      setUploading(true);
      
      for (const file of files) {
        if (!file.type.match('image.*')) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }
        
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/uploads`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data.success) {
          setUploadedImages(prev => [...prev, response.data.imageUrl]);
          toast.success('Image uploaded successfully');
        } else {
          toast.error('Failed to upload image');
        }
      }
    } catch (error) {
      toast.error('Failed to upload images: ' + (error.response?.data?.message || error.message));
      console.error(error);
    } finally {
      setUploading(false);
    }
  };
  
  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    toast.success('Image removed');
  };
  
  const onSubmit = async (data) => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one image');
      setActiveStep(2);
      return;
    }
    
    const specifications = {};
    if (selectedCategory && categoryFields[selectedCategory]) {
      categoryFields[selectedCategory].forEach(field => {
        if (data[field.name]) {
          specifications[field.label] = data[field.name];
          delete data[field.name];
        }
      });
    }
    
    try {
      const listingData = {
        ...data,
        images: uploadedImages,
        specifications: Object.keys(specifications).length > 0 ? specifications : undefined
      };
      
      const newListing = await createListing(listingData);
      
      // Show success message with loader animation
      toast.success('Listing created successfully!', { 
        duration: 4000,
        icon: '🎉'
      });
      
      // Navigate to the new listing
      navigate(`/listings/${newListing._id}`);
    } catch (error) {
      toast.error('Failed to create listing: ' + (error.response?.data?.message || error.message));
      console.error(error);
    }
  };
  
  const nextStep = () => {
    setActiveStep(activeStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const prevStep = () => {
    setActiveStep(activeStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <br></br><br></br>
        <div className="max-w-4xl mx-auto">
          
          <motion.div 
            className="mb-8 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            
            <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
            <p className="mt-2 text-lg text-gray-600">
              Share your item with thousands of potential buyers
            </p>
          </motion.div>
          
          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <div className={`flex-1 h-1 ${activeStep >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              <div className={`flex-1 h-1 ${activeStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'} mx-2`}></div>
              <div className={`flex-1 h-1 ${activeStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            </div>
            
            <div className="flex justify-between">
              <div className="text-center">
                <div className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full border-2 ${activeStep >= 1 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
                  <HiOutlineDocumentText size={20} />
                </div>
                <p className={`mt-2 text-sm ${activeStep >= 1 ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>Basic Info</p>
              </div>
              
              <div className="text-center">
                <div className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full border-2 ${activeStep >= 2 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
                  <BsImageAlt size={20} />
                </div>
                <p className={`mt-2 text-sm ${activeStep >= 2 ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>Photos</p>
              </div>
              
              <div className="text-center">
                <div className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full border-2 ${activeStep >= 3 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
                  <FaClipboardList size={20} />
                </div>
                <p className={`mt-2 text-sm ${activeStep >= 3 ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>Details</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Basic Information */}
              {activeStep === 1 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                        <HiOutlineDocumentText size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Title */}
                      <div>
                        <label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center">
                          Title <span className="text-red-500 ml-1">*</span>
                          <span className="ml-2 text-xs text-gray-400 font-normal">(5-100 characters)</span>
                        </label>
                        <input
                          id="title"
                          type="text"
                          placeholder="What are you selling?"
                          {...register("title", { 
                            required: "Title is required",
                            minLength: {
                              value: 5,
                              message: "Title must be at least 5 characters"
                            },
                            maxLength: {
                              value: 100,
                              message: "Title cannot exceed 100 characters"
                            }
                          })}
                          className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        />
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                        )}
                      </div>
                      
                      {/* Category */}
                      <div>
                        <label htmlFor="category" className="text-sm font-medium text-gray-700 flex items-center">
                          Category <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="mt-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaTag className="text-gray-400" />
                          </div>
                          <select
                            id="category"
                            {...register("category", { required: "Please select a category" })}
                            className={`block w-full pl-10 pr-10 py-3 rounded-lg border ${errors.category ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors`}
                          >
                            <option value="">Select a category</option>
                            {categories && categories.map((category) => (
                              <option key={category._id || category.id} value={category.slug || category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <HiChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        {errors.category && (
                          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                        )}
                        {categories?.length === 0 && (
                          <p className="mt-1 text-sm text-yellow-600 flex items-center">
                            <Loader size="tiny" /> 
                            <span className="ml-2">Loading categories...</span>
                          </p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Price */}
                        <div>
                          <label htmlFor="price" className="text-sm font-medium text-gray-700 flex items-center">
                            Price (LKR) <span className="text-red-500 ml-1">*</span>
                          </label>
                          <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaMoneyBillWave className="text-gray-400" />
                            </div>
                            <input
                              id="price"
                              type="number"
                              placeholder="0.00"
                              min="0"
                              step="1"
                              {...register("price", { 
                                required: "Price is required",
                                min: {
                                  value: 0,
                                  message: "Price cannot be negative"
                                }
                              })}
                              className={`block w-full pl-10 pr-4 py-3 rounded-lg border ${errors.price ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                            />
                          </div>
                          {errors.price && (
                            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                          )}
                        </div>
                        
                        {/* Condition */}
                        <div>
                          <label htmlFor="condition" className="text-sm font-medium text-gray-700 flex items-center">
                            Condition <span className="text-red-500 ml-1">*</span>
                          </label>
                          <select
                            id="condition"
                            {...register("condition", { required: "Please select a condition" })}
                            className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.condition ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                          >
                            <option value="new">Brand New</option>
                            <option value="like-new">Like New</option>
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="poor">For Parts or Not Working</option>
                          </select>
                          {errors.condition && (
                            <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Location */}
                      <div>
                        <label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center">
                          Location <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="mt-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaMapMarkerAlt className="text-gray-400" />
                          </div>
                          <input
                            id="location"
                            type="text"
                            placeholder="City, District"
                            {...register("location", { required: "Location is required" })}
                            className={`block w-full pl-10 pr-4 py-3 rounded-lg border ${errors.location ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                          />
                        </div>
                        {errors.location && (
                          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                        )}
                      </div>
                      
                      {/* Description */}
                      <div>
                        <label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center">
                          Description <span className="text-red-500 ml-1">*</span>
                          <span className="ml-2 text-xs text-gray-400 font-normal">(min 20 characters)</span>
                        </label>
                        <textarea
                          id="description"
                          rows={5}
                          placeholder="Describe your item in detail. Include features, condition, reason for selling, etc."
                          {...register("description", { 
                            required: "Description is required",
                            minLength: {
                              value: 20,
                              message: "Description must be at least 20 characters"
                            }
                          })}
                          className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        ></textarea>
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-30 transition-colors"
                    >
                      Next: Add Photos
                      <HiChevronRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Image Upload */}
              {activeStep === 2 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                        <BsImageAlt size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">Add Photos</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        A picture is worth a thousand words! Add up to 8 photos to showcase your item.
                      </p>
                      
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
                        <strong>Tip:</strong> The first image will be your listing's main photo. Clear, well-lit photos from multiple angles help your item sell faster!
                      </div>
                      
                      <div className="mt-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {/* Uploaded images */}
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden">
                              <img
                                src={image}
                                alt={`Listing preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                                >
                                  <FaTimes className="text-red-500" />
                                </button>
                              </div>
                              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                {index === 0 ? 'Main' : `#${index + 1}`}
                              </div>
                            </div>
                          ))}
                          
                          {/* Upload button */}
                          {uploadedImages.length < 8 && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg aspect-square relative flex flex-col items-center justify-center p-4 transition-colors hover:border-blue-400 bg-gray-50 hover:bg-blue-50">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={uploading}
                              />
                              {uploading ? (
                                <div className="flex flex-col items-center">
                                  <Loader size="medium" />
                                  <span className="mt-2 text-sm text-gray-500">Uploading...</span>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-2">
                                    <FaUpload className="text-blue-500" />
                                  </div>
                                  <span className="text-sm font-medium text-blue-600 block">Upload Photos</span>
                                  <span className="text-xs text-gray-500 block mt-1">
                                    {uploadedImages.length === 0 ? 'Add at least one image' : `${8 - uploadedImages.length} remaining`}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {uploadedImages.length === 0 && !uploading && (
                          <p className="mt-3 text-sm text-red-500">At least one image is required</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 text-gray-600 font-medium hover:text-gray-800 focus:outline-none transition-colors"
                    >
                      ← Back
                    </button>
                    
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-30 transition-colors"
                      disabled={uploadedImages.length === 0}
                    >
                      Next: Additional Details
                      <HiChevronRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Additional Information */}
              {activeStep === 3 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                        <FaClipboardList size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">Additional Details</h2>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Category-specific fields */}
                      {selectedCategory && categoryFields[selectedCategory] && (
                        <div className="space-y-5">
                          <p className="text-gray-600">
                            Adding these details will help buyers find your {selectedCategory.replace(/-/g, ' ')}.
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {categoryFields[selectedCategory].map((field) => (
                              <div key={field.name}>
                                <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                                  {field.label}
                                </label>
                                <input
                                  id={field.name}
                                  type={field.type || 'text'}
                                  placeholder={`Enter ${field.label.toLowerCase()}`}
                                  {...register(field.name)}
                                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-100 pt-6 mt-8">
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm leading-5 font-medium text-green-800">
                                Ready to list your item
                              </h3>
                              <div className="mt-1 text-sm leading-5 text-green-700">
                                Click the button below to publish your listing and connect with potential buyers!
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 text-gray-600 font-medium hover:text-gray-800 focus:outline-none transition-colors"
                    >
                      ← Back
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading || uploading}
                      className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading || uploading ? (
                        <div className="flex items-center">
                          <Loader size="small" />
                          <span className="ml-2">Publishing...</span>
                        </div>
                      ) : (
                        'Publish Listing'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-500">
            By listing an item, you agree to TradeSphere's <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Community Guidelines</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;