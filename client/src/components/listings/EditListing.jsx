import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaUpload, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useListing } from '../../context/ListingContext';
import { uploadImage } from '../../utils/api';
import Loader from '../common/Loader';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  
  const { 
    fetchListingById, 
    updateListing, 
    currentListing, 
    loading 
  } = useListing();
  
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const selectedCategory = watch('category');
  
  // Various specs fields based on category
  const categoryFields = {
    'vehicles': [
      { name: 'brand', label: 'Brand' },
      { name: 'model', label: 'Model' },
      { name: 'year', label: 'Year', type: 'number' },
      { name: 'mileage', label: 'Mileage (km)', type: 'number' },
      { name: 'fuelType', label: 'Fuel Type' },
      { name: 'transmission', label: 'Transmission' }
    ],
    'properties': [
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
  
  // Fetch current listing data
  useEffect(() => {
    const loadListing = async () => {
      try {
        const listing = await fetchListingById(id);
        
        // Set form values
        setValue('title', listing.title);
        setValue('description', listing.description);
        setValue('price', listing.price);
        setValue('category', listing.category);
        setValue('condition', listing.condition);
        setValue('location', listing.location);
        
        // Set uploaded images
        setUploadedImages(listing.images || []);
        
        // Set specifications if available
        if (listing.specifications) {
          Object.entries(listing.specifications).forEach(([key, value]) => {
            // Find the corresponding field name from categoryFields
            const categoryField = categoryFields[listing.category]?.find(
              field => field.label === key
            );
            
            if (categoryField) {
              setValue(categoryField.name, value);
            }
          });
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load listing');
        navigate('/dashboard');
      }
    };
    
    loadListing();
  }, [fetchListingById, id, navigate, setValue]);
  
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
        
        const response = await uploadImage(formData);
        setUploadedImages(prev => [...prev, response.imageUrl]);
      }
    } catch (error) {
      toast.error('Failed to upload images');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };
  
  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const onSubmit = async (data) => {
    // Validate if at least one image is uploaded
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    
    // Extract dynamic specifications
    const specifications = {};
    if (selectedCategory && categoryFields[selectedCategory]) {
      categoryFields[selectedCategory].forEach(field => {
        if (data[field.name]) {
          specifications[field.label] = data[field.name];
          delete data[field.name]; // Remove from main data object
        }
      });
    }
    
    try {
      const listingData = {
        ...data,
        images: uploadedImages,
        specifications: Object.keys(specifications).length > 0 ? specifications : undefined
      };
      
      await updateListing(id, listingData);
      toast.success('Listing updated successfully!');
      navigate(`/listings/${id}`);
    } catch (error) {
      toast.error('Failed to update listing');
      console.error(error);
    }
  };
  
  if (loading && !currentListing) {
    return <Loader fullScreen />;
  }
  
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Listing</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Brief, descriptive title"
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
                  className={`input ${errors.title ? 'border-red-300' : ''}`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  {...register("category", { required: "Please select a category" })}
                  className={`input ${errors.category ? 'border-red-300' : ''}`}
                >
                  <option value="">Select a category</option>
                  {Object.keys(categoryFields).map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
              
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price (LKR) <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">Rs.</span>
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
                    className={`input pl-10 ${errors.price ? 'border-red-300' : ''}`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>
              
              {/* Condition */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  id="condition"
                  {...register("condition", { required: "Please select a condition" })}
                  className={`input ${errors.condition ? 'border-red-300' : ''}`}
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Used">Used</option>
                </select>
                {errors.condition && (
                  <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
                )}
              </div>
              
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder="City, District"
                  {...register("location", { required: "Location is required" })}
                  className={`input ${errors.location ? 'border-red-300' : ''}`}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={5}
                  placeholder="Detailed description of your item..."
                  {...register("description", { 
                    required: "Description is required",
                    minLength: {
                      value: 20,
                      message: "Description must be at least 20 characters"
                    }
                  })}
                  className={`input ${errors.description ? 'border-red-300' : ''}`}
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>
            
            {/* Category-specific fields */}
            {selectedCategory && categoryFields[selectedCategory] && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
                {categoryFields[selectedCategory].map((field) => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      type={field.type || 'text'}
                      {...register(field.name)}
                      className="input"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Image Upload */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Images</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Upload up to 8 images. First image will be used as cover image.
                </p>
                
                <div className="flex flex-wrap gap-4 mt-2">
                  {/* Uploaded images */}
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img
                        src={image}
                        alt={`Listing preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      >
                        <FaTimes className="text-red-500 text-sm" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Upload button */}
                  {uploadedImages.length < 8 && (
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                      {uploading ? (
                        <Loader size="small" />
                      ) : (
                        <div className="text-center">
                          <FaUpload className="mx-auto text-gray-400" />
                          <span className="text-xs text-gray-500 mt-1 block">Upload</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {uploadedImages.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">At least one image is required</p>
                )}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || uploading}
                className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? <Loader size="small" /> : 'Update Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditListing; 