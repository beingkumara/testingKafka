import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Don't show sidebar on login, signup, and homepage
  const showSidebar = isAuthenticated && 
    !['/login', '/signup', '/'].includes(location.pathname);
  
  // Animation variants
  const mainVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-dark-50 to-dark-100 dark:from-dark-800 dark:to-dark-900">
      <Header />
      
      <div className="flex flex-1 relative">
        {showSidebar && (
          <motion.aside 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-64 hidden md:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <Sidebar />
          </motion.aside>
        )}
        
        <motion.main 
          variants={mainVariants}
          initial="hidden"
          animate="visible"
          className={`flex-1 ${showSidebar ? 'md:ml-4' : ''}`}
        >
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </motion.main>
      </div>
      
      <Footer />
      
      {/* Background decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-secondary-500/10 to-transparent -z-10"></div>
      <div className="fixed bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-primary-500/10 to-transparent -z-10"></div>
      <div className="fixed top-1/3 left-1/4 w-1/4 h-1/4 bg-gradient-radial from-tertiary-500/10 to-transparent -z-10"></div>
    </div>
  );
};

export default Layout;