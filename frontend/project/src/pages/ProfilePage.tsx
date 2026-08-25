import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile } from '../services/auth/profileService';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import EditProfileModal from '../components/profile/EditProfileModal';
import FollowListModal from '../components/profile/FollowListModal';
import LoadingScreen from '../components/ui/LoadingScreen';
import { useParams } from 'react-router-dom';
import { followUser, unfollowUser, getFollowStatus, FollowStatus } from '../services/auth/profileService';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('authToken') || '';
  const { username: routeUsername } = useParams<{ username?: string }>();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [followStatus, setFollowStatus] = useState<FollowStatus | undefined>(undefined);


  // Local user state to handle updates immediately before context refreshes
  const [profileData, setProfileData] = useState(user);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Sync with context
  useEffect(() => {
    if (user && !routeUsername) {
      setProfileData(user);
    }
  }, [user, routeUsername]);

  // Load fresh profile data on mount
  useEffect(() => {
    async function loadProfile() {
      // For now we only fetch current user since we need email for fetchUserProfile
      if (user?.email && !routeUsername) {
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
  }, [token, user?.email, routeUsername]);

  const displayUsername = routeUsername || user?.username;
  const isCurrentUser = !routeUsername || routeUsername === user?.username;

  useEffect(() => {
    if (displayUsername) {
      getFollowStatus(displayUsername)
        .then(setFollowStatus)
        .catch(console.error);
    }
  }, [displayUsername]);

  const handleFollowToggle = async () => {
    if (!displayUsername) return;
    try {
      if (followStatus?.isFollowing) {
        await unfollowUser(displayUsername);
        setFollowStatus(prev => prev ? { ...prev, isFollowing: false, followers: prev.followers - 1 } : undefined);
      } else {
        await followUser(displayUsername);
        setFollowStatus(prev => prev ? { ...prev, isFollowing: true, followers: prev.followers + 1 } : undefined);
      }
    } catch (e) {
      console.error('Failed to toggle follow status', e);
    }
  };

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
            isCurrentUser={isCurrentUser}
            followStatus={followStatus}
            onFollowToggle={handleFollowToggle}
            onShowFollowers={() => setIsFollowersModalOpen(true)}
            onShowFollowing={() => setIsFollowingModalOpen(true)}
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
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass p-6 rounded-xl border border-white/5 bg-gradient-to-b from-dark-800/80 to-transparent hover:border-white/10 transition-colors"
                >
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    About
                  </h3>
                  <div className="space-y-4">
                    <div className="group">
                      <p className="text-sm text-gray-500 group-hover:text-primary-400 transition-colors">Email</p>
                      <p className="text-white font-mono text-sm mt-1">{profileData?.email}</p>
                    </div>
                    <div className="group">
                      <p className="text-sm text-gray-500 group-hover:text-primary-400 transition-colors">Member Since</p>
                      <p className="text-white font-mono text-sm mt-1">{profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Favorites Card (Redundant with stats but good for layout balance) */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass p-6 rounded-xl border border-white/5 bg-gradient-to-br from-primary-900/20 to-dark-900/80 hover:border-primary-500/30 transition-all shadow-[inset_0_0_20px_rgba(255,0,0,0.05)]"
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    My Favorites
                  </h3>
                  <div className="space-y-3">
                    <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-white/5 hover:border-white/10 cursor-pointer">
                      <span className="text-gray-400 text-sm">Driver</span>
                      <span className="text-primary-400 font-semibold truncate max-w-[120px]">{profileData?.favoriteDriver || 'None'}</span>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-white/5 hover:border-white/10 cursor-pointer">
                      <span className="text-gray-400 text-sm">Team</span>
                      <span className="text-primary-400 font-semibold truncate max-w-[120px]">{profileData?.favoriteTeam || 'None'}</span>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Activity Feed (Placeholder) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-2"
              >
                <div className="glass p-8 rounded-xl border border-white/5 flex flex-col items-center justify-center min-h-[100%] text-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-800/40 via-transparent to-transparent relative overflow-hidden group">
                  {/* Subtle animated background element */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500"></div>
                  
                  <div className="w-20 h-20 bg-dark-900/80 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] relative z-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2"></path>
                      </svg>
                    </motion.div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Activity Timeline</h3>
                  <p className="text-gray-400 max-w-md relative z-10 mb-8 leading-relaxed">
                    This space is waiting for your racing journey. Start predicting race outcomes, saving your favorite moments, or joining the fan discussions!
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all font-medium border border-white/10 hover:border-primary-500/50 hover:text-primary-400 relative z-10 backdrop-blur-sm"
                  >
                    Explore Community
                  </motion.button>
                </div>
              </motion.div>
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

          {/* Follow Lists Modals */}
          {displayUsername && (
            <>
              <FollowListModal
                isOpen={isFollowersModalOpen}
                onClose={() => setIsFollowersModalOpen(false)}
                title="Followers"
                username={displayUsername}
              />
              <FollowListModal
                isOpen={isFollowingModalOpen}
                onClose={() => setIsFollowingModalOpen(false)}
                title="Following"
                username={displayUsername}
              />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;