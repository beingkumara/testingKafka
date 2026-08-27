import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, Flag, Trophy, BarChart3, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

import Logo from '../ui/Logo';
import UserSearch from './UserSearch';
import { DEFAULT_PROFILE_PICTURE } from '../../utils/imageUtils';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={`
        ${isHomePage ? 'fixed' : 'sticky'} top-0 z-50 w-full border-b border-transparent
        transition-[background-color,backdrop-filter,border-color] duration-300
        ${isScrolled || !isHomePage
          ? 'bg-dark-800/85 backdrop-blur-xl shadow-glass border-white/5'
          : 'bg-transparent'
        }
      `}
    >
      {/* Dynamic Racing Line — animated speed line at top */}
      <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden z-50">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-primary-500 to-transparent animate-speed-line opacity-75" />
      </div>

      <div className="container-f1 mx-auto px-4 h-20">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center group">
              <Logo className="h-12 w-auto md:h-20 text-6xl transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_20px_rgba(225,6,0,0.7)]" />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center space-x-1"
          >
            {/* Search Bar */}
            <UserSearch />

            {/* User Profile / Auth */}
            <div className="flex items-center ml-6 pl-6 border-l border-white/10 space-x-4">
              {/* LIVE indicator — always shown to create "broadcast" feel */}
              <span className="live-indicator hidden lg:inline-flex">Live</span>

              {isAuthenticated ? (
                <div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                    className="flex items-center space-x-3 text-sm font-medium text-white hover:text-primary-500"
                    style={{ transition: 'color 200ms ease-out' }}
                  >
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-600 to-primary-800 p-0.5 clip-path-slant-left shadow-glow-red">
                      <img
                        src={user?.profilePicture || DEFAULT_PROFILE_PICTURE}
                        alt={user?.username || 'User'}
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_PROFILE_PICTURE;
                        }}
                        className="w-full h-full object-cover clip-path-slant-left bg-dark-900"
                      />
                    </div>
                    <span className="hidden lg:block font-heading text-xs tracking-wider uppercase">{user?.username}</span>
                    <ChevronDown className="h-3 w-3" style={{ transition: 'transform 200ms ease-out' }} />
                  </motion.button>

                  {/* Dropdown */}
                  <div
                    className="absolute right-0 top-full pt-2 w-56 invisible group-hover:visible opacity-0 group-hover:opacity-100 origin-top-right transition-all duration-200 translate-y-2 group-hover:translate-y-0"
                    // Removed inline transform to prevent physical gap, using tailwind translate-y
                  >
                    <div className="glass-panel rounded-none border-t-2 border-primary-500">
                      <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                        style={{ transition: 'background-color 150ms ease-out, color 150ms ease-out' }}
                      >
                        <User className="h-4 w-4 mr-3 text-primary-500" />
                        <span className="font-mono text-xs uppercase tracking-wider">Driver Profile</span>
                      </Link>
                      <div className="h-px bg-white/5 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                        style={{ transition: 'background-color 150ms ease-out, color 150ms ease-out' }}
                      >
                        <LogOut className="h-4 w-4 mr-3 text-red-400" />
                        <span className="font-mono text-xs uppercase tracking-wider">Log Out</span>
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-sm font-heading uppercase tracking-wider text-gray-300 hover:text-white"
                    style={{ transition: 'color 200ms ease-out' }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </motion.nav>

          {/* Mobile Menu Button — 44×44px hit area */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2.5 text-white hover:text-primary-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
              style={{ transition: 'color 200ms ease-out' }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden glass-panel border-b border-primary-500/30 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-white/5">
                    <div className="w-10 h-10 rounded bg-primary-600 p-0.5 clip-path-slant-left shadow-glow-red">
                      <img
                        src={user?.profilePicture || DEFAULT_PROFILE_PICTURE}
                        alt={user?.username || 'User'}
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_PROFILE_PICTURE;
                        }}
                        className="w-full h-full object-cover clip-path-slant-left bg-dark-900"
                      />
                    </div>
                    <div>
                      <div className="font-heading text-sm uppercase tracking-wider text-white">{user?.username}</div>
                      <div className="text-xs text-primary-500 font-mono">ID: {user?.id?.substring(0, 8) || 'Unknown'}</div>
                    </div>
                  </div>

                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center py-2 text-gray-300 hover:text-primary-500" style={{ transition: 'color 200ms ease-out' }}>
                    <Flag className="w-4 h-4 mr-3" /> Home
                  </Link>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center py-2 text-gray-300 hover:text-primary-500" style={{ transition: 'color 200ms ease-out' }}>
                    <BarChart3 className="w-4 h-4 mr-3" /> Dashboard
                  </Link>
                  <Link to="/races" onClick={() => setMobileMenuOpen(false)} className="flex items-center py-2 text-gray-300 hover:text-primary-500" style={{ transition: 'color 200ms ease-out' }}>
                    <Calendar className="w-4 h-4 mr-3" /> Races
                  </Link>
                  <Link to="/drivers" onClick={() => setMobileMenuOpen(false)} className="flex items-center py-2 text-gray-300 hover:text-primary-500" style={{ transition: 'color 200ms ease-out' }}>
                    <User className="w-4 h-4 mr-3" /> Drivers
                  </Link>
                  <Link to="/standings" onClick={() => setMobileMenuOpen(false)} className="flex items-center py-2 text-gray-300 hover:text-primary-500" style={{ transition: 'color 200ms ease-out' }}>
                    <Trophy className="w-4 h-4 mr-3" /> Standings
                  </Link>

                  <div className="pt-4 mt-4 border-t border-white/5">
                    <button onClick={handleLogout} className="flex items-center py-2 text-red-400 hover:text-white" style={{ transition: 'color 200ms ease-out' }}>
                      <LogOut className="w-4 h-4 mr-3" /> Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 text-center text-gray-300 border border-white/20 rounded hover:border-primary-500 hover:text-primary-500 uppercase font-heading text-sm tracking-wider" style={{ transition: 'border-color 200ms ease-out, color 200ms ease-out' }}>
                    Log In
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 text-center bg-primary-600 text-white rounded shadow-glow-red hover:bg-primary-500 uppercase font-heading text-sm tracking-wider clip-path-slant" style={{ transition: 'background-color 200ms ease-out' }}>
                    Register Now
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;