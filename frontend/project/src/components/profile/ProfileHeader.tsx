import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Edit3 } from 'lucide-react';
import { User as UserType } from '../../types/auth.types';

interface ProfileHeaderProps {
    user: UserType | null;
    onEditClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditClick }) => {
    const defaultProfilePicture = 'https://via.placeholder.com/150?text=User';
    const displayImage = user?.profilePicture || defaultProfilePicture;
    const defaultCoverPhoto = 'https://images.unsplash.com/photo-1541348263662-e068662d82af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80';
    const displayCover = user?.coverPhoto || defaultCoverPhoto;

    return (
        <div className="relative mb-20">
            {/* Cover Image */}
            <div className="h-48 md:h-64 w-full rounded-b-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-dark-900 opacity-90"></div>
                <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: `url(${displayCover})` }}></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
            </div>

            {/* Profile Info Container */}
            <div className="absolute -bottom-16 left-0 right-0 px-6 md:px-10 flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
                <div className="flex items-end gap-6">
                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-dark-900 overflow-hidden shadow-2xl bg-dark-800">
                            <img
                                src={displayImage}
                                alt={user?.username || 'User'}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-dark-900" title="Online"></div>
                    </motion.div>

                    {/* User Details */}
                    <div className="mb-2 md:mb-4">
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2"
                        >
                            {user?.username || 'Guest User'}
                            {user?.favoriteTeam && (
                                <span className="text-xs px-2 py-1 rounded-full bg-primary-600/30 border border-primary-500/50 text-white font-mono uppercase tracking-wider">
                                    {user.favoriteTeam} Fan
                                </span>
                            )}
                        </motion.h1>
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-gray-400 flex flex-wrap gap-4 mt-1 text-sm md:text-base"
                        >
                            <span className="flex items-center gap-1">
                                <User size={16} /> @{user?.username?.toLowerCase().replace(/\s+/g, '') || 'guest'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={16} /> Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                            </span>
                        </motion.div>
                    </div>
                </div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-4 md:mb-8"
                >
                    <button
                        onClick={onEditClick}
                        className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-all shadow-lg shadow-primary-900/40"
                    >
                        <Edit3 size={18} />
                        Edit Profile
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfileHeader;
