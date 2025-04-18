import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUpload } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, uploadImage } from '../../utils/api';
import Loader from '../common/Loader';

const Profile = () => {
  const { currentUser, updateUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      location: currentUser?.location || '',
      bio: currentUser?.bio || '',
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file');
      return;
    }
    
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await uploadImage(formData);
      setAvatar(response.imageUrl);
      toast.success('Profile picture uploaded');
    } catch (error) {
      toast.error('Failed to upload profile picture');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };
  
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const userData = { ...data, avatar };
      const updatedUser = await updateUserProfile(userData);
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Profile</h1>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Avatar section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full bg-white p-1">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={currentUser?.name}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=User';
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <FaUser size={50} className="text-gray-400" />
                  </div>
                )}
                <label 
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 cursor-pointer"
                >
                  {uploading ? (
                    <div className="w-6 h-6 flex items-center justify-center">
                      <Loader size="small" />
                    </div>
                  ) : (
                    <FaUpload className="text-primary-500" />
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">{currentUser?.name}</h2>
            <p className="text-primary-100">Member since {new Date(currentUser?.createdAt).toLocaleDateString()}</p>
          </div>
          
          {/* Profile form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        {...register("name", { 
                          required: "Name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters"
                          }
                        })}
                        className={`input pl-10 ${errors.name ? 'border-red-300' : ''}`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        disabled
                        {...register("email")}
                        className="input pl-10 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+94 XXX XXX XXX"
                        {...register("phone", { 
                          pattern: {
                            value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                            message: "Invalid phone number format"
                          }
                        })}
                        className={`input pl-10 ${errors.phone ? 'border-red-300' : ''}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-gray-400" />
                      </div>
                      <input
                        id="location"
                        type="text"
                        placeholder="City, District"
                        {...register("location")}
                        className="input pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  About me
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell others a bit about yourself..."
                  {...register("bio", {
                    maxLength: {
                      value: 500,
                      message: "Bio cannot exceed 500 characters"
                    }
                  })}
                  className={`input ${errors.bio ? 'border-red-300' : ''}`}
                ></textarea>
                {errors.bio ? (
                  <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Maximum 500 characters</p>
                )}
              </div>
              
              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader size="small" /> : 'Update Profile'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;