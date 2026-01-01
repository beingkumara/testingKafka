import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, Flag, Trophy, BarChart3, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

import Logo from '../ui/Logo';

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
        sticky top-0 z-50 transition-all duration-300 border-b border-transparent
        ${isScrolled || !isHomePage
          ? 'bg-dark-900/80 backdrop-blur-md shadow-glass border-white/5'
          : 'bg-transparent'
        }
      `}
    >
      {/* Dynamic Racing Line */}
      <div className="absolute top-0 left-0 w-full h-1 overflow-hidden z-50">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-primary-500 to-transparent animate-speed-line opacity-75"></div>
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
              <Logo className="h-8 w-auto md:h-10 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_10px_rgba(225,6,0,0.5)]" />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center space-x-1"
          >
            <Link
              to="/"
              className={`relative px-4 py-2 font-heading text-sm uppercase tracking-wider transition-all duration-300 hover:text-primary-500 overflow-hidden group ${location.pathname === '/' ? 'text-primary-500' : 'text-gray-300'}`}
            >
              <span className="relative z-10 flex items-center">
                <Flag className="w-3 h-3 mr-2" />
                Home
              </span>
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform origin-left transition-transform duration-300 ${location.pathname === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/races"
                  className={`relative px-4 py-2 font-heading text-sm uppercase tracking-wider transition-all duration-300 hover:text-primary-500 overflow-hidden group ${location.pathname.includes('/races') ? 'text-primary-500' : 'text-gray-300'}`}
                >
                  <span className="relative z-10 flex items-center">
                    <Calendar className="w-3 h-3 mr-2" />
                    Races
                  </span>
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform origin-left transition-transform duration-300 ${location.pathname.includes('/races') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </Link>

                <Link
                  to="/drivers"
                  className={`relative px-4 py-2 font-heading text-sm uppercase tracking-wider transition-all duration-300 hover:text-primary-500 overflow-hidden group ${location.pathname.includes('/drivers') ? 'text-primary-500' : 'text-gray-300'}`}
                >
                  <span className="relative z-10 flex items-center">
                    <User className="w-3 h-3 mr-2" />
                    Drivers
                  </span>
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform origin-left transition-transform duration-300 ${location.pathname.includes('/drivers') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </Link>

                <Link
                  to="/standings"
                  className={`relative px-4 py-2 font-heading text-sm uppercase tracking-wider transition-all duration-300 hover:text-primary-500 overflow-hidden group ${location.pathname.includes('/standings') ? 'text-primary-500' : 'text-gray-300'}`}
                >
                  <span className="relative z-10 flex items-center">
                    <Trophy className="w-3 h-3 mr-2" />
                    Standings
                  </span>
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform origin-left transition-transform duration-300 ${location.pathname.includes('/standings') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </Link>

                <Link
                  to="/dashboard"
                  className={`relative px-4 py-2 font-heading text-sm uppercase tracking-wider transition-all duration-300 hover:text-primary-500 overflow-hidden group ${location.pathname === '/dashboard' ? 'text-primary-500' : 'text-gray-300'}`}
                >
                  <span className="relative z-10 flex items-center">
                    <BarChart3 className="w-3 h-3 mr-2" />
                    Dashboard
                  </span>
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform origin-left transition-transform duration-300 ${location.pathname === '/dashboard' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </Link>
              </>
            )}

            {/* User Profile / Auth */}
            <div className="flex items-center ml-6 pl-6 border-l border-white/10 space-x-4">
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-3 text-sm font-medium text-white hover:text-primary-500 transition-colors">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-600 to-primary-800 p-0.5 clip-path-slant-left shadow-glow-red">
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className="w-full h-full object-cover clip-path-slant-left bg-dark-900"
                        />
                      ) : (
                        <div className="w-full h-full bg-dark-800 flex items-center justify-center text-white text-xs font-bold clip-path-slant-left">
                          {user?.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="hidden lg:block font-heading text-xs tracking-wider uppercase">{user?.username}</span>
                    <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-4 w-56 glass-panel rounded-none border-t-2 border-primary-500 invisible group-hover:visible opacity-0 group-hover:opacity-100 transform origin-top-right transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="h-4 w-4 mr-3 text-primary-500" />
                        <span className="font-mono text-xs uppercase tracking-wider">Driver Profile</span>
                      </Link>
                      <div className="h-px bg-white/5 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3 text-accent-500" />
                        <span className="font-mono text-xs uppercase tracking-wider">Log Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-sm font-heading uppercase tracking-wider text-gray-300 hover:text-white transition-colors"
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

              {/* Theme Toggle */}

            </div>
          </motion.nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">

            <button
              onClick={toggleMobileMenu}
              className="p-2 text-white hover:text-primary-500 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-b border-primary-500/30 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-white/5">
                    <div className="w-10 h-10 rounded bg-primary-600 p-0.5 clip-path-slant-left shadow-glow-red">
                      {user?.profilePicture ? (
                        <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover clip-path-slant-left bg-dark-900" />
                      ) : (
                        <div className="w-full h-full bg-dark-800 flex items-center justify-center text-white text-sm font-bold clip-path-slant-left">{user?.username?.charAt(0).toUpperCase()}</div>
                      )}
                    </div>
                    <div>
                      <div className="font-heading text-sm uppercase tracking-wider text-white">{user?.username}</div>
                      <div className="text-xs text-primary-500 font-mono">ID: {user?.id?.substring(0, 8) || 'Unknown'}</div>
                    </div>
                  </div>

                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center py-2 text-gray-300 hover:text-primary-500">
                    <Flag className="w-4 h-4 mr-3" /> Home
                  </Link>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center py-2 text-gray-300 hover:text-primary-500">
                    <BarChart3 className="w-4 h-4 mr-3" /> Dashboard
                  </Link>
                  <Link to="/races" onClick={() => setMobileMenuOpen(false)} className="flex items-center py-2 text-gray-300 hover:text-primary-500">
                    <Calendar className="w-4 h-4 mr-3" /> Races
                  </Link>
                  <Link to="/drivers" onClick={() => setMobileMenuOpen(false)} className="flex items-center py-2 text-gray-300 hover:text-primary-500">
                    <User className="w-4 h-4 mr-3" /> Drivers
                  </Link>
                  <Link to="/standings" onClick={() => setMobileMenuOpen(false)} className="flex items-center py-2 text-gray-300 hover:text-primary-500">
                    <Trophy className="w-4 h-4 mr-3" /> Standings
                  </Link>

                  <div className="pt-4 mt-4 border-t border-white/5">
                    <button onClick={handleLogout} className="flex items-center py-2 text-accent-500 hover:text-white">
                      <LogOut className="w-4 h-4 mr-3" /> Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 text-center text-gray-300 border border-white/20 rounded hover:border-primary-500 hover:text-primary-500 transition-colors uppercase font-heading text-sm tracking-wider">
                    Log In
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 text-center bg-primary-600 text-white rounded shadow-glow-red hover:bg-primary-500 transition-colors uppercase font-heading text-sm tracking-wider clip-path-slant">
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