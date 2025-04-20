import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUpload } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';
import { toast } from 'react-hot-toast';
import { updateUserProfile, uploadImage } from '../../utils/api';

const Profile = () => {
  const { currentUser, updateProfile, loading } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      location: '',
      bio: ''
    }
  });
  
  useEffect(() => {
    if (currentUser) {
      setValue('name', currentUser.name || '');
      setValue('email', currentUser.email || '');
      setValue('phone', currentUser.phone || '');
      setValue('location', currentUser.location || '');
      setValue('bio', currentUser.bio || '');
      
      if (currentUser.avatar) {
        setAvatarPreview(currentUser.avatar);
      }
    }
  }, [currentUser, setValue]);
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (data) => {
    try {
      setUpdating(true);
      
      // Upload avatar if changed
      let avatarUrl = currentUser.avatar;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('image', avatarFile);
        
        const response = await uploadImage(formData);
        if (response.success) {
          avatarUrl = response.imageUrl;
        } else {
          toast.error('Failed to upload avatar');
        }
      }
      
      // Update profile
      await updateProfile({
        ...data,
        avatar: avatarUrl
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };
  
  if (!currentUser && !loading) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Profile</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-10 flex justify-center">
              <Loader size="large" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt={currentUser.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600">
                        <FaUser size={48} />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full">
                    <label htmlFor="avatar" className="cursor-pointer p-2 rounded-full bg-white text-primary-600 hover:bg-gray-100">
                      <FaUpload size={20} />
                      <input 
                        type="file" 
                        id="avatar" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Click on the image to change your profile picture
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      disabled // Email cannot be changed
                      {...register("email")}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>
                
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      type="text"
                      {...register("phone")}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      id="location"
                      type="text"
                      {...register("location")}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    rows={4}
                    {...register("bio")}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Tell others about yourself..."
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Brief description for your profile. This will be displayed on your public profile.
                </p>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md shadow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? (
                    <div className="flex items-center">
                      <Loader size="small" light />
                      <span className="ml-2">Updating...</span>
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;