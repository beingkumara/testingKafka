import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { User, Save, Upload, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProfileUpdateRequest } from '../types/auth.types';
import { fetchUserProfile } from '../services/auth/profileService';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const token = localStorage.getItem('authToken') || '';
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [favoriteDriver, setFavoriteDriver] = useState(user?.favoriteDriver || '');
  const [favoriteTeam, setFavoriteTeam] = useState(user?.favoriteTeam || '');
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null);
  
  // Sync local state with user context when it changes
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setFavoriteDriver(user.favoriteDriver || '');
      setFavoriteTeam(user.favoriteTeam || '');
      setProfilePicture(user.profilePicture || null);
    }
  }, [user]);

  // Initial load of profile data
  useEffect(() => {
    async function loadProfile() {
      if (user?.email) {
        try {
          const profile = await fetchUserProfile(token,user.email);
          setUsername(profile.username || '');
          setEmail(profile.email || '');
          setFavoriteDriver(profile.favoriteDriver || '');
          setFavoriteTeam(profile.favoriteTeam || '');
          setProfilePicture(profile.profilePicture || null);
        } catch (e) {
          console.error('Error loading profile:', e);
        }
      }
    }
    
    // Always load profile when component mounts or user email changes
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default profile picture if none is set
  const defaultProfilePicture = 'https://via.placeholder.com/150?text=User';

  const handleEditToggle = () => {
    if (isEditing) {
      // If canceling edit, reload fields from backend
      if (user?.email) {
        fetchUserProfile(token, user.email).then(profile => {
          setUsername(profile.username || '');
          setEmail(profile.email || '');
          setFavoriteDriver(profile.favoriteDriver || '');
          setFavoriteTeam(profile.favoriteTeam || '');
          setProfilePicture(profile.profilePicture || null);
        }).catch(err => {
          console.error('Error fetching profile on cancel:', err);
          // Fallback to user context data if fetch fails
          if (user) {
            setUsername(user.username || '');
            setEmail(user.email || '');
            setFavoriteDriver(user.favoriteDriver || '');
            setFavoriteTeam(user.favoriteTeam || '');
            setProfilePicture(user.profilePicture || null);
          }
        });
      } else if (user) {
        // If no email but we have user data, use that
        setUsername(user.username || '');
        setEmail(user.email || '');
        setFavoriteDriver(user.favoriteDriver || '');
        setFavoriteTeam(user.favoriteTeam || '');
        setProfilePicture(user.profilePicture || null);
      }
      setPreviewImage(null);
      setSelectedFile(null);
    }
    setIsEditing(!isEditing);
    setError(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setError(null);
      setSuccessMessage(null);

      // Validate inputs
      if (!username.trim()) {
        setError('Username is required');
        return;
      }
      
      // Update profile through AuthContext which will update the user context
      await updateProfile({
        username: username.trim(),
        favoriteDriver: favoriteDriver.trim(),
        favoriteTeam: favoriteTeam.trim(),
        // Include profile picture update if there's a selected file
        ...(selectedFile && { profilePicture: URL.createObjectURL(selectedFile) })
      });
      
      // Show success message
      setSuccessMessage('Profile updated successfully!');
      
      // Reset file selection and preview
      setSelectedFile(null);
      setPreviewImage(null);
      
      // Exit edit mode after a short delay
      setTimeout(() => {
        setIsEditing(false);
      }, 1500);

      if (!email.trim()) {
        setError('Email is required');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }
      const updateData: ProfileUpdateRequest = {
        username,
        email,
        favoriteDriver,
        favoriteTeam,
        profilePicture: selectedFile || profilePicture || undefined,
      };
      await updateProfile(updateData);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      // After update, reload from backend
      if (user?.email) {
        const profile = await fetchUserProfile(token,user.email);
        setUsername(profile.username || '');
        setEmail(profile.email || '');
        setFavoriteDriver(profile.favoriteDriver || '');
        setFavoriteTeam(profile.favoriteTeam || '');
        setProfilePicture(profile.profilePicture || null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removePreviewImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Display image based on priority: preview > user profile picture > default
  const displayImage = previewImage || profilePicture || defaultProfilePicture;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="glass p-6 rounded-lg shadow-f1-card">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <User className="mr-2 text-primary-500" />
              User Profile
            </h1>
            {!isEditing ? (
              <button
                onClick={handleEditToggle}
                className="f1-button bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-all duration-300"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleEditToggle}
                className="f1-button bg-dark-500 hover:bg-dark-600 text-white px-4 py-2 rounded-md transition-all duration-300"
              >
                Cancel
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md text-red-500">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500 rounded-md text-green-500">
              {successMessage}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={displayImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-primary-500"
                />
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={triggerFileInput}
                      className="bg-dark-800/70 hover:bg-dark-800/90 text-white p-2 rounded-full transition-all duration-300"
                    >
                      <Upload size={20} />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                )}
                {isEditing && previewImage && (
                  <button
                    onClick={removePreviewImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all duration-300"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {isEditing && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Click to upload a new profile picture
                </p>
              )}
            </div>

            {/* Profile Details Section */}
            <div className="flex-1">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-700"
                  />
                ) : (
                  <p className="p-2 bg-dark-100/30 dark:bg-dark-700/30 rounded-md">
                    {username || 'Not set'}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-700"
                  />
                ) : (
                  <p className="p-2 bg-dark-100/30 dark:bg-dark-700/30 rounded-md">
                    {email || 'Not set'}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Favorite Driver</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={favoriteDriver}
                    onChange={(e) => setFavoriteDriver(e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-700"
                  />
                ) : (
                  <p className="p-2 bg-dark-100/30 dark:bg-dark-700/30 rounded-md">
                    {favoriteDriver || 'Not set'}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Favorite Team</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={favoriteTeam}
                    onChange={(e) => setFavoriteTeam(e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-700"
                  />
                ) : (
                  <p className="p-2 bg-dark-100/30 dark:bg-dark-700/30 rounded-md">
                    {favoriteTeam || 'Not set'}
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="mt-6">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="f1-button bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md transition-all duration-300 flex items-center"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="mr-2" size={18} />
                        Save Changes
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;