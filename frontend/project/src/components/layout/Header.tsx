import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, User, LogOut, ChevronDown, Flag, Trophy, BarChart3, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../ui/Logo';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isHomePage = location.pathname === '/';
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
        sticky top-0 z-50 transition-all duration-300
        ${isScrolled || !isHomePage 
          ? 'glass shadow-lg backdrop-blur-lg border-b border-primary-500/30' 
          : 'bg-transparent'
        }
      `}
    >
      {/* Racing line at top */}
      <div className="racing-line h-1 w-full"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center">
              <Logo className="h-10 w-auto" />
            </Link>
          </motion.div>
          
          {/* Desktop navigation */}
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center space-x-4"
          >
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <span className="relative z-10 flex items-center">
                <Flag className="w-4 h-4 mr-1" />
                Home
              </span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/races" 
                  className={`nav-link ${location.pathname.includes('/races') ? 'active' : ''}`}
                >
                  <span className="relative z-10 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Races
                  </span>
                </Link>
                
                <Link 
                  to="/drivers" 
                  className={`nav-link ${location.pathname.includes('/drivers') ? 'active' : ''}`}
                >
                  <span className="relative z-10 flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Drivers
                  </span>
                </Link>
                
                <Link 
                  to="/standings" 
                  className={`nav-link ${location.pathname.includes('/standings') ? 'active' : ''}`}
                >
                  <span className="relative z-10 flex items-center">
                    <Trophy className="w-4 h-4 mr-1" />
                    Standings
                  </span>
                </Link>
                
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  <span className="relative z-10 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Dashboard
                  </span>
                </Link>
                
                <div className="relative group ml-2">
                  <button className="f1-button flex items-center space-x-1 bg-dark-500 text-white px-3 py-1.5 rounded-md group">
                    <span className="relative z-10 font-medium">{user?.name}</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 glass rounded-md shadow-f1-card overflow-hidden z-50 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 origin-top-right transition-all duration-200 border-l-2 border-primary-500">
                    <div className="py-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-primary-500/10 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2 text-primary-500" /> 
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="f1-button bg-dark-500 hover:bg-dark-600 text-white px-6 py-1.5 rounded-md transition-all duration-300 ml-2"
                >
                  Log in
                </Link>
                <Link 
                  to="/signup" 
                  className="f1-button bg-primary-500 hover:bg-primary-600 text-white px-6 py-1.5 rounded-md transition-all duration-300 shadow-glow-red"
                >
                  Sign up
                </Link>
              </>
            )}
            
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-dark-100/50 dark:hover:bg-dark-600/50 transition-all duration-300 ml-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-primary-500" />
              ) : (
                <Moon className="h-5 w-5 text-primary-500" />
              )}
            </motion.button>
          </motion.nav>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-md hover:bg-dark-100/50 dark:hover:bg-dark-600/50"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-primary-500" />
              ) : (
                <Moon className="h-5 w-5 text-primary-500" />
              )}
            </motion.button>
            
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu} 
              className="p-2 rounded-md hover:bg-dark-100/50 dark:hover:bg-dark-600/50 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-primary-500" />
              ) : (
                <Menu className="h-6 w-6 text-primary-500" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass backdrop-blur-lg shadow-lg border-b-2 border-primary-500"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-500/10 transition-all duration-300 flex items-center"
              >
                <Flag className="w-5 h-5 mr-2 text-primary-500" />
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/races"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-500/10 transition-all duration-300 flex items-center"
                  >
                    <Calendar className="w-5 h-5 mr-2 text-primary-500" />
                    Races
                  </Link>
                  
                  <Link 
                    to="/drivers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-500/10 transition-all duration-300 flex items-center"
                  >
                    <User className="w-5 h-5 mr-2 text-primary-500" />
                    Drivers
                  </Link>
                  
                  <Link 
                    to="/standings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-500/10 transition-all duration-300 flex items-center"
                  >
                    <Trophy className="w-5 h-5 mr-2 text-primary-500" />
                    Standings
                  </Link>
                  
                  <Link 
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-500/10 transition-all duration-300 flex items-center"
                  >
                    <BarChart3 className="w-5 h-5 mr-2 text-primary-500" />
                    Dashboard
                  </Link>
                  
                  <div className="border-t border-dark-200/30 dark:border-dark-600/30 my-2 pt-2">
                    <div className="px-3 py-2 flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-dark-500 text-white mr-2">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-base font-medium hover:bg-primary-500/10 transition-all duration-300 flex items-center rounded-md"
                    >
                      <LogOut className="h-5 w-5 mr-2 text-primary-500" /> 
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-500/10 transition-all duration-300 flex items-center"
                  >
                    <span className="w-5 h-5 mr-2 flex items-center justify-center text-primary-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                      </svg>
                    </span>
                    Log in
                  </Link>
                  <div className="px-3 py-2">
                    <Link 
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full block text-center py-2 rounded-md text-base font-medium bg-primary-500 text-white hover:bg-primary-600 transition-all duration-300 shadow-glow-red"
                    >
                      Sign up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Racing line at bottom */}
      <div className="racing-line h-1 w-full"></div>
    </header>
  );
};

export default Header;