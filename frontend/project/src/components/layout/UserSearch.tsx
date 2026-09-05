import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Loader2, UserPlus, UserMinus } from 'lucide-react';
import { searchUsers, followUser, unfollowUser, UserSearchResult } from '../../services/auth/profileService';
import { DEFAULT_PROFILE_PICTURE } from '../../utils/imageUtils';
import { useAuth } from '../../context/AuthContext';

const UserSearch: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    setQuery('');
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length === 0) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      setIsSearching(true);
      try {
        const users = await searchUsers(query);
        setResults(users);
        setIsOpen(true);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleFollowToggle = async (username: string, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        await unfollowUser(username);
      } else {
        await followUser(username);
      }
      const newIsFollowing = !isFollowing;
      // Update local state
      setResults(prev => prev.map(u =>
        u.username === username ? { ...u, isFollowing: newIsFollowing } : u
      ));
      // Notify ProfilePage (and any other listener) so counts update in real time
      window.dispatchEvent(new CustomEvent('followStatusChanged', {
        detail: { username, isFollowing: newIsFollowing }
      }));
    } catch (error) {
      console.error('Error toggling follow status:', error);

    }
  };

  return (
    <div className="relative ml-4" ref={wrapperRef}>
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search fans..."
          className={`bg-dark-900/50 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all ${isOpen ? 'w-64' : 'w-48 focus:w-64'}`}
          style={{ transition: 'width 0.3s ease, border-color 0.2s ease' }}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 animate-spin" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-72 bg-dark-800 border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
          <ul className="max-h-64 overflow-y-auto custom-scrollbar">
            {results.map((user) => (
              <li key={user.username} className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <img
                    src={user.profilePicture || DEFAULT_PROFILE_PICTURE}
                    alt={user.username}
                    onError={(e) => { e.currentTarget.src = DEFAULT_PROFILE_PICTURE; }}
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                  />
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-medium text-gray-200 truncate">{user.username}</span>
                    {(user.favoriteTeam || user.favoriteDriver) && (
                      <span className="text-xs text-gray-500 truncate">
                        {user.favoriteTeam || user.favoriteDriver} fan
                      </span>
                    )}
                  </div>
                </div>
                {currentUser?.username !== user.username && (
                  <button
                    onClick={() => handleFollowToggle(user.username, user.isFollowing)}
                    className={`ml-2 p-1.5 rounded transition-colors ${
                      user.isFollowing 
                        ? 'bg-white/10 text-gray-300 hover:bg-red-500/20 hover:text-red-400'
                        : 'bg-primary-600/20 text-primary-500 hover:bg-primary-600 hover:text-white'
                    }`}
                    title={user.isFollowing ? "Unfollow" : "Follow"}
                  >
                    {user.isFollowing ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {isOpen && query && !isSearching && results.length === 0 && (
         <div className="absolute top-full mt-2 w-72 bg-dark-800 border border-white/10 rounded-lg shadow-xl p-4 text-center text-sm text-gray-400 z-50">
            No fans found matching "{query}"
         </div>
      )}
    </div>
  );
};

export default UserSearch;
