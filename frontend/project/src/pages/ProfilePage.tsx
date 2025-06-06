import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Camera, 
  Save, 
  Edit3, 
  Trophy, 
  Flag, 
  Calendar,
  Mail,
  UserCheck,
  Heart,
  Star,
  Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDrivers, getConstructorStandings } from '../services';
import LoadingScreen from '../components/ui/LoadingScreen';
import { Driver, ConstructorStanding } from '../types/f1.types';
import { ProfileUpdateData } from '../types/auth.types';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, isLoading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [constructors, setConstructors] = useState<ConstructorStanding[]>([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    favoriteDriver: user?.favoriteDriver || '',
    favoriteConstructor: user?.favoriteConstructor || '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversData, constructorsData] = await Promise.all([
          getDrivers(),
          getConstructorStandings()
        ]);
        setDrivers(driversData);
        setConstructors(constructorsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        favoriteDriver: user.favoriteDriver || '',
        favoriteConstructor: user.favoriteConstructor || '',
      });
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      const updateData: ProfileUpdateData = {
        name: formData.name,
        bio: formData.bio,
        favoriteDriver: formData.favoriteDriver,
        favoriteConstructor: formData.favoriteConstructor,
      };

      // Handle image upload
      if (selectedImage) {
        // Convert image to base64 for backend storage
        const base64Image = await convertImageToBase64(selectedImage);
        updateData.avatar = base64Image;
      }

      await updateProfile(updateData);
      setIsEditing(false);
      setSelectedImage(null);
      setPreviewUrl(null);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      favoriteDriver: user?.favoriteDriver || '',
      favoriteConstructor: user?.favoriteConstructor || '',
    });
    setSelectedImage(null);
    setPreviewUrl(null);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const getFavoriteDriverName = () => {
    const driver = drivers.find(d => d.id === user?.favoriteDriver);
    return driver?.name || 'Not selected';
  };

  const getFavoriteConstructorName = () => {
    const constructor = constructors.find(c => c.id === user?.favoriteConstructor);
    return constructor?.name || 'Not selected';
  };

  const getJoinedDate = () => {
    if (user?.joinedDate) {
      return new Date(user.joinedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Recently joined';
  };

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-800 dark:text-white mb-4">
            Please log in to view your profile
          </h2>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-12"
    >
      {/* Header */}
      <div className="relative mb-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-opacity-50 bg-black"></div>
        <div className="relative z-10 px-6 py-12 md:py-16 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">My Profile</h1>
              <p className="text-xl text-primary-200 max-w-2xl">
                Manage your account settings and F1 preferences
              </p>
            </div>
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </motion.button>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-400"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {previewUrl || user.avatar ? (
                    <img
                      src={previewUrl || user.avatar}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Name */}
              <h2 className="text-2xl font-bold text-secondary-800 dark:text-white mb-2">
                {user.name}
              </h2>

              {/* Email */}
              <div className="flex items-center justify-center gap-2 text-secondary-600 dark:text-secondary-300 mb-4">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>

              {/* Join Date */}
              <div className="flex items-center justify-center gap-2 text-secondary-500 dark:text-secondary-400 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Joined {getJoinedDate()}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 pt-6 border-t dark:border-secondary-700">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-primary-500 mb-1">
                    <Trophy className="h-4 w-4" />
                    <span className="text-xs font-medium">Favorite Driver</span>
                  </div>
                  <div className="text-sm font-semibold text-secondary-800 dark:text-white">
                    {getFavoriteDriverName()}
                  </div>
                </div>
                <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-accent-500 mb-1">
                    <Flag className="h-4 w-4" />
                    <span className="text-xs font-medium">Favorite Team</span>
                  </div>
                  <div className="text-sm font-semibold text-secondary-800 dark:text-white">
                    {getFavoriteConstructorName()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-secondary-800 dark:text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary-500" />
                Profile Information
              </h3>
              {isEditing && (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="btn btn-outline-secondary"
                    disabled={isLoading}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="btn btn-primary flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </motion.button>
                </div>
              )}
            </div>

            {/* Success/Error Messages */}
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <UserCheck className="h-5 w-5" />
                  <span className="font-medium">Profile updated successfully!</span>
                </div>
              </motion.div>
            )}

            {saveError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                  <span className="font-medium">Error: {saveError}</span>
                </div>
              </motion.div>
            )}

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Display Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                    placeholder="Enter your display name"
                  />
                ) : (
                  <div className="px-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg text-secondary-800 dark:text-white">
                    {user.name}
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white resize-none"
                    placeholder="Tell us about yourself and your F1 passion..."
                  />
                ) : (
                  <div className="px-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg text-secondary-800 dark:text-white min-h-[100px]">
                    {user.bio || 'No bio added yet. Share your F1 story!'}
                  </div>
                )}
              </div>

              {/* Favorite Driver */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary-500" />
                  Favorite Driver
                </label>
                {isEditing ? (
                  <select
                    name="favoriteDriver"
                    value={formData.favoriteDriver}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                  >
                    <option value="">Select a driver</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} ({driver.team})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="px-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg text-secondary-800 dark:text-white">
                    {getFavoriteDriverName()}
                  </div>
                )}
              </div>

              {/* Favorite Constructor */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent-500" />
                  Favorite Constructor
                </label>
                {isEditing ? (
                  <select
                    name="favoriteConstructor"
                    value={formData.favoriteConstructor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                  >
                    <option value="">Select a constructor</option>
                    {constructors.map((constructor) => (
                      <option key={constructor.id} value={constructor.id}>
                        {constructor.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="px-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg text-secondary-800 dark:text-white">
                    {getFavoriteConstructorName()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;