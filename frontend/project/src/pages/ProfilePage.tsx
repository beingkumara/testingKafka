import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile } from '../services/auth/profileService';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import EditProfileModal from '../components/profile/EditProfileModal';
import LoadingScreen from '../components/ui/LoadingScreen';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('authToken') || '';
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Local user state to handle updates immediately before context refreshes
  const [profileData, setProfileData] = useState(user);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Sync with context
  useEffect(() => {
    if (user) {
      setProfileData(user);
    }
  }, [user]);

  // Load fresh profile data on mount
  useEffect(() => {
    async function loadProfile() {
      if (user?.email) {
        setIsLoadingProfile(true);
        try {
          const profile = await fetchUserProfile(token, user.email);
          setProfileData(profile);
        } catch (e) {
          console.error('Error loading profile:', e);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    }

    loadProfile();
  }, [token, user?.email]);

  if (!user && !isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Please Log In</h2>
          <p className="text-gray-400">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (isLoadingProfile && !profileData) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-dark-900 pb-20">
      <div className="container mx-auto px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <ProfileHeader
            user={profileData}
            onEditClick={() => setIsEditModalOpen(true)}
          />

          {/* Main Content */}
          <div className="container mx-auto px-4">
            {/* Stats Grid */}
            <ProfileStats user={profileData} />

            {/* Additional Content (Feed/Activity Placeholder) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Bio / Details */}
              <div className="lg:col-span-1 space-y-6">
                <div className="glass p-6 rounded-xl border border-white/5">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">About</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-white">{profileData?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="text-white">{profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                {/* Favorites Card (Redundant with stats but good for layout balance) */}
                <div className="glass p-6 rounded-xl border border-white/5 bg-gradient-to-b from-primary-900/20 to-transparent">
                  <h3 className="text-lg font-bold text-white mb-4">My Favorites</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                      <span className="text-gray-400">Driver</span>
                      <span className="text-primary-400 font-semibold">{profileData?.favoriteDriver || 'None'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                      <span className="text-gray-400">Team</span>
                      <span className="text-primary-400 font-semibold">{profileData?.favoriteTeam || 'None'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Activity Feed (Placeholder) */}
              <div className="lg:col-span-2">
                <div className="glass p-8 rounded-xl border border-white/5 flex flex-col items-center justify-center min-h-[300px] text-center">
                  <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="6" x2="12" y2="12"></line>
                        <line x1="16" y1="12" x2="12" y2="12"></line>
                      </svg>
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Recent Activity</h3>
                  <p className="text-gray-400 max-w-md">
                    You haven't posted anything yet. Join the discussion on race results or share your predictions!
                  </p>
                  <button className="mt-6 px-6 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-full transition-colors font-medium">
                    Start a Discussion
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          {profileData && (
            <EditProfileModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              currentUser={profileData}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;