import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon } from 'lucide-react';
import { getFollowers, getFollowing } from '../../services/auth/profileService';

interface FollowListModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: 'Followers' | 'Following';
    username: string;
}

const FollowListModal: React.FC<FollowListModalProps> = ({ isOpen, onClose, title, username }) => {
    const [users, setUsers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && username) {
            setIsLoading(true);
            const fetchList = title === 'Followers' ? getFollowers : getFollowing;
            fetchList(username)
                .then(data => setUsers(data))
                .catch(err => console.error(`Failed to fetch ${title}:`, err))
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, username, title]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />
                
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative bg-dark-800 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl z-10"
                >
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-4 max-h-[60vh] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center text-gray-400 p-8">
                                No {title.toLowerCase()} found.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {users.map(u => (
                                    <div key={u} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 cursor-pointer">
                                        <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-gray-400">
                                            <UserIcon size={20} />
                                        </div>
                                        <span className="font-medium text-white">@{u}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default FollowListModal;
