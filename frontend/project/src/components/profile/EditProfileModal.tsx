import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Save, User as UserIcon, Image as ImageIcon, AlignLeft, MapPin } from 'lucide-react';
import { User } from '../../types/auth.types';
import { useAuth } from '../../context/AuthContext';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: User;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, currentUser }) => {
    const { updateProfile, isLoading } = useAuth();

    const [activeTab, setActiveTab] = useState<'profile' | 'images'>('profile');

    const [username, setUsername] = useState(currentUser.username || '');
    const [email, setEmail] = useState(currentUser.email || '');
    const [favoriteDriver, setFavoriteDriver] = useState(currentUser.favoriteDriver || '');
    const [favoriteTeam, setFavoriteTeam] = useState(currentUser.favoriteTeam || '');

    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [previewCover, setPreviewCover] = useState<string | null>(null);
    const [selectedCover, setSelectedCover] = useState<File | null>(null);

    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setUsername(currentUser.username || '');
            setEmail(currentUser.email || '');
            setFavoriteDriver(currentUser.favoriteDriver || '');
            setFavoriteTeam(currentUser.favoriteTeam || '');
            setPreviewImage(null);
            setSelectedFile(null);
            setPreviewCover(null);
            setSelectedCover(null);
            setError(null);
            setActiveTab('profile'); // Reset tab
        }
    }, [isOpen, currentUser]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Invalid file type');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('File too large (>5MB)');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'profile') {
                setSelectedFile(file);
                setPreviewImage(reader.result as string);
            } else {
                setSelectedCover(file);
                setPreviewCover(reader.result as string);
            }
        };
        reader.readAsDataURL(file);
        setError(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!username.trim() || !email.trim()) {
            setError('Username and Email are required');
            return;
        }

        try {
            // Prepare update data
            const updateData: any = {
                username: username.trim(),
                email: email.trim(),
                favoriteDriver: favoriteDriver.trim(),
                favoriteTeam: favoriteTeam.trim(),
                profilePicture: selectedFile || undefined,
                bio: bio.trim(),
                location: location.trim(),
                coverPhoto: selectedCover || undefined
            };

            await updateProfile(updateData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        }
    };

    const displayImage = previewImage || currentUser.profilePicture || 'https://via.placeholder.com/150?text=User';
    const displayCover = previewCover || currentUser.coverPhoto || 'https://images.unsplash.com/photo-1541348263662-e068662d82af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-2xl bg-dark-800 rounded-2xl shadow-2xl border border-dark-700 overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-dark-700">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <UserIcon size={20} className="text-primary-500" />
                                Edit Profile
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-dark-700 px-6">
                            <button
                                type="button"
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center gap-2 py-4 px-4 border-b-2 transition-colors ${activeTab === 'profile'
                                    ? 'border-primary-500 text-white'
                                    : 'border-transparent text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                <UserIcon size={16} />
                                Public Profile
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('images')}
                                className={`flex items-center gap-2 py-4 px-4 border-b-2 transition-colors ${activeTab === 'images'
                                    ? 'border-primary-500 text-white'
                                    : 'border-transparent text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                <ImageIcon size={16} />
                                Images
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="flex flex-col flex-1">
                            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-dark-600">
                                {error && (
                                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                {activeTab === 'profile' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                                                <input
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                                            <div className="relative">
                                                <textarea
                                                    value={bio}
                                                    onChange={(e) => setBio(e.target.value)}
                                                    rows={3}
                                                    placeholder="Tell the world about your F1 passion..."
                                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
                                                />
                                                <AlignLeft className="absolute right-3 top-3 text-gray-600" size={16} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1">Favorite Driver</label>
                                                <input
                                                    type="text"
                                                    value={favoriteDriver}
                                                    onChange={(e) => setFavoriteDriver(e.target.value)}
                                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1">Favorite Team</label>
                                                <input
                                                    type="text"
                                                    value={favoriteTeam}
                                                    onChange={(e) => setFavoriteTeam(e.target.value)}
                                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                    placeholder="e.g. Silverstone, UK"
                                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                                />
                                                <MapPin className="absolute right-3 top-2.5 text-gray-600" size={16} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'images' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-6"
                                    >
                                        {/* Profile Picture */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-400">Profile Picture</label>
                                            <div className="flex items-center gap-6">
                                                <div className="relative group cursor-pointer w-24 h-24" onClick={() => fileInputRef.current?.click()}>
                                                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-dark-600 group-hover:border-primary-500 transition-colors">
                                                        <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Upload className="text-white" size={20} />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                                                    >
                                                        Upload new picture
                                                    </button>
                                                    <p className="text-xs text-gray-500 mt-1">Recommended: Square JPG, PNG. Max 5MB.</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={(e) => handleFileChange(e, 'profile')}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </div>
                                        </div>

                                        <div className="h-px bg-dark-700"></div>

                                        {/* Cover Photo */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-400">Cover Photo</label>
                                            <div
                                                className="relative group cursor-pointer w-full h-32 rounded-xl overflow-hidden border-2 border-dark-600 group-hover:border-primary-500 transition-all"
                                                onClick={() => coverInputRef.current?.click()}
                                            >
                                                <img src={displayCover} alt="Cover" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="flex flex-col items-center">
                                                        <Upload className="text-white mb-2" size={24} />
                                                        <span className="text-white text-sm font-medium">Change Cover Photo</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500">Recommended: 1500x500px JPG, PNG.</p>
                                            <input
                                                type="file"
                                                ref={coverInputRef}
                                                onChange={(e) => handleFileChange(e, 'cover')}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <div className="p-6 border-t border-dark-700 flex justify-end gap-3 bg-dark-800">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2 rounded-lg bg-dark-700 text-white hover:bg-dark-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Saving...' : (
                                        <>
                                            <Save size={18} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditProfileModal;
