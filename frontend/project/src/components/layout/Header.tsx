import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, User, LogOut, ChevronDown } from 'lucide-react';
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
          ? 'glass shadow-lg backdrop-blur-lg' 
          : 'bg-transparent'
        }
      `}
    >
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
            className="hidden md:flex items-center space-x-6"
          >
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <span className="relative z-10">Home</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  <span className="relative z-10">Dashboard</span>
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-1 nav-link group">
                    <span className="relative z-10">{user?.name}</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-card overflow-hidden z-50 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 origin-top-right transition-all duration-200">
                    <div className="py-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-dark-100/50 dark:hover:bg-dark-600/50 flex items-center"
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
                  className="btn btn-outline-secondary px-6"
                >
                  Log in
                </Link>
                <Link 
                  to="/signup" 
                  className="btn btn-primary px-6 glow-red"
                >
                  Sign up
                </Link>
              </>
            )}
            
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-dark-100/50 dark:hover:bg-dark-600/50 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-secondary-500" />
              ) : (
                <Moon className="h-5 w-5 text-secondary-500" />
              )}
            </motion.button>
          </motion.nav>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-full hover:bg-dark-100/50 dark:hover:bg-dark-600/50"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-secondary-500" />
              ) : (
                <Moon className="h-5 w-5 text-secondary-500" />
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
            className="md:hidden glass backdrop-blur-lg shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-dark-100/50 dark:hover:bg-dark-600/50 transition-all duration-300"
              >
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-dark-100/50 dark:hover:bg-dark-600/50 transition-all duration-300"
                  >
                    Dashboard
                  </Link>
                  
                  <div className="border-t border-dark-200/30 dark:border-dark-600/30 my-2 pt-2">
                    <div className="px-3 py-2 flex items-center">
                      <User className="h-5 w-5 mr-2 text-secondary-500" />
                      <span>{user?.name}</span>
                    </div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-base font-medium hover:bg-dark-100/50 dark:hover:bg-dark-600/50 transition-all duration-300 flex items-center"
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
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-dark-100/50 dark:hover:bg-dark-600/50 transition-all duration-300"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-primary-500 hover:bg-dark-100/50 dark:hover:bg-dark-600/50 transition-all duration-300"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;