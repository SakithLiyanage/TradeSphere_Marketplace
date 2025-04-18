import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUpload, FaTrash, FaSpinner } from 'react-icons/fa';
import { useListing } from '../../context/ListingContext';
import { compressImage } from '../../utils/helpers';

const ListingForm = ({ initialData = null, isEditing = false }) => {
  const navigate = useNavigate();
  const { createListing, updateListing, uploadImage, categories, loadCategories } = useListing();
  
  // Basic form state
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [condition, setCondition] = useState(initialData?.condition || '');
  const [location, setLocation] = useState(initialData?.location || '');
  
  // Image handling
  const [images, setImages] = useState(initialData?.images || []);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Dynamic specifications based on category
  const [specifications, setSpecifications] = useState(initialData?.specifications || {});
  
  // Form submission state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Load categories if needed
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);
  
  // Get category specific fields
  const getCategoryFields = useCallback((categorySlug) => {
    const fieldMap = {
      vehicles: [
        { name: 'brand', label: 'Brand', type: 'text', required: true },
        { name: 'model', label: 'Model', type: 'text', required: true },
        { name: 'year', label: 'Year', type: 'number', required: true },
        { name: 'mileage', label: 'Mileage', type: 'text' },
        { name: 'fuelType', label: 'Fuel Type', type: 'select', 
          options: ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Other'] },
        { name: 'transmission', label: 'Transmission', type: 'select',
          options: ['Manual', 'Automatic', 'CVT', 'Other'] }
      ],
      properties: [
        { name: 'propertyType', label: 'Property Type', type: 'select',
          options: ['House', 'Apartment', 'Land', 'Commercial', 'Other'], required: true },
        { name: 'bedrooms', label: 'Bedrooms', type: 'number' },
        { name: 'bathrooms', label: 'Bathrooms', type: 'number' },
        { name: 'size', label: 'Size (sqft/perch)', type: 'text' },
        { name: 'furnished', label: 'Furnished', type: 'select',
          options: ['Yes', 'No', 'Partially'] }
      ],
      electronics: [
        { name: 'brand', label: 'Brand', type: 'text', required: true },
        { name: 'model', label: 'Model', type: 'text' },
        { name: 'warranty', label: 'Warranty', type: 'text' }
      ],
      furniture: [
        { name: 'material', label: 'Material', type: 'text' },
        { name: 'dimensions', label: 'Dimensions', type: 'text' }
      ],
      jobs: [
        { name: 'jobType', label: 'Job Type', type: 'select',
          options: ['Full Time', 'Part Time', 'Contract', 'Freelance', 'Internship'], required: true },
        { name: 'salary', label: 'Salary Range', type: 'text' },
        { name: 'company', label: 'Company', type: 'text' }
      ],
      services: [
        { name: 'serviceType', label: 'Service Type', type: 'text', required: true },
        { name: 'availability', label: 'Availability', type: 'text' }
      ]
    };
    
    return fieldMap[categorySlug] || [];
  }, []);
  
  // Update spec fields when category changes
  useEffect(() => {
    if (category && !isEditing) {
      // Reset specifications when category changes in create mode
      setSpecifications({});
    }
  }, [category, isEditing]);
  
  // Handle category specific field changes
  const handleSpecChange = (field, value) => {
    setSpecifications(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Check max image limit
    if (images.length + files.length > 8) {
      toast.error('Maximum 8 images allowed');
      return;
    }
    
    setUploadingImage(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        // Check file type
        if (!file.type.match(/image\/(jpeg|jpg|png|webp|gif)/i)) {
          throw new Error(`${file.name} is not a supported image type`);
        }
        
        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds the 5MB size limit`);
        }
        
        // Compress image
        const compressedFile = await compressImage(file);
        
        // Upload to server
        const imageUrl = await uploadImage(compressedFile);
        return imageUrl;
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
      toast.success(`${files.length} ${files.length === 1 ? 'image' : 'images'} uploaded`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploadingImage(false);
      // Clear file input
      e.target.value = '';
    }
  };
  
  // Remove image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (title.length > 100) newErrors.title = 'Title must be less than 100 characters';
    
    if (!description.trim()) newErrors.description = 'Description is required';
    if (description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    
    if (!price) newErrors.price = 'Price is required';
    if (isNaN(price) || Number(price) < 0) newErrors.price = 'Price must be a positive number';
    
    if (!category) newErrors.category = 'Category is required';
    if (!condition) newErrors.condition = 'Condition is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    
    if (images.length === 0) newErrors.images = 'At least one image is required';
    
    // Validate required category-specific fields
    const categoryFields = getCategoryFields(category);
    categoryFields.forEach(field => {
      if (field.required && !specifications[field.name]) {
        newErrors[`spec_${field.name}`] = `${field.label} is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    const listingData = {
      title,
      description,
      price: Number(price),
      category,
      condition,
      location,
      images,
      specifications
    };
    
    try {
      if (isEditing) {
        await updateListing(initialData._id, listingData);
        toast.success('Listing updated successfully');
      } else {
        const newListing = await createListing(listingData);
        toast.success('Listing created successfully');
        navigate(`/listings/${newListing._id}`);
      }
    } catch (error) {
      console.error('Error saving listing:', error);
      toast.error(error?.response?.data?.message || 'Failed to save listing');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500`}
            placeholder="e.g. Toyota Corolla 2019"
            maxLength={100}
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500`}
            rows={6}
            placeholder="Provide details about your item's features, condition, and any other important information."
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          <p className="mt-1 text-xs text-gray-500">{description.length} characters (minimum 10)</p>
        </div>
        
        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (LKR) <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">LKR</span>
            </div>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`w-full pl-12 pr-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500`}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
        </div>
      </div>
      
      {/* Category and Condition */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Category & Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500`}
            >
              <option value="">Select a Category</option>
              {categories.map((cat) => (
                <option key={cat.slug || cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
          </div>
          
          {/* Condition */}
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
              Condition <span className="text-red-500">*</span>
            </label>
            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className={`w-full px-3 py-2 border ${errors.condition ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500`}
            >
              <option value="">Select Condition</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Used">Used</option>
            </select>
            {errors.condition && <p className="mt-1 text-sm text-red-500">{errors.condition}</p>}
          </div>
          
          {/* Location */}
          <div className="md:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500`}
              placeholder="e.g. Colombo, Sri Lanka"
            />
            {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
          </div>
        </div>
        
        {/* Category-specific fields */}
        {category && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-800 mb-3">Specifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getCategoryFields(category).map((field) => (
                <div key={field.name}>
                  <label 
                    htmlFor={field.name} 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      id={field.name}
                      value={specifications[field.name] || ''}
                      onChange={(e) => handleSpecChange(field.name, e.target.value)}
                      className={`w-full px-3 py-2 border ${
                        errors[`spec_${field.name}`] ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500`}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      id={field.name}
                      value={specifications[field.name] || ''}
                      onChange={(e) => handleSpecChange(field.name, e.target.value)}
                      className={`w-full px-3 py-2 border ${
                        errors[`spec_${field.name}`] ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500`}
                      placeholder={field.label}
                    />
                  )}
                  
                  {errors[`spec_${field.name}`] && (
                    <p className="mt-1 text-sm text-red-500">{errors[`spec_${field.name}`]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Images */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Photos <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Add up to 8 photos. Clear, well-lit photos attract more buyers!
        </p>
        
        {/* Image upload */}
        <div className="mb-4">
          <label
            htmlFor="images"
            className={`flex justify-center items-center w-full h-32 px-4 border-2 ${
              errors.images ? 'border-red-300 bg-red-50' : 'border-dashed border-gray-300 hover:bg-gray-50'
            } rounded-lg cursor-pointer transition-colors`}
          >
            <div className="text-center">
              {uploadingImage ? (
                <FaSpinner className="animate-spin text-primary-500 mx-auto text-2xl" />
              ) : (
                <>
                  <FaUpload className="mx-auto text-2xl text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Click to upload images</p>
                </>
              )}
            </div>
            <input
              id="images"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploadingImage || images.length >= 8}
            />
          </label>
          {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
        </div>
        
        {/* Image preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={image}
                    alt={`Listing image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-80 hover:opacity-100"
                  title="Remove image"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 ${
            loading ? 'bg-gray-400' : 'bg-primary-500 hover:bg-primary-600'
          } text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 min-w-[150px]`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" /> 
              {isEditing ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            <span>{isEditing ? 'Update Listing' : 'Create Listing'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ListingForm;