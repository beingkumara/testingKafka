import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Don't show sidebar on login, signup, and homepage
  const showSidebar = isAuthenticated &&
    !['/login', '/signup', '/'].includes(location.pathname);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col relative text-white selection:bg-primary-500 selection:text-white">
      {/* Global Background Elements */}
      <div className="fixed inset-0 bg-dark-950 pointer-events-none z-[-2]"></div>
      <div className="fixed inset-0 bg-[url('/images/asphalt-grain.png')] opacity-20 pointer-events-none z-[-1] mix-blend-overlay"></div>

      <Header />

      <div className={`flex flex-1 relative w-full ${location.pathname === '/' ? '' : 'container-f1 mx-auto pt-6 pb-12 max-w-[1920px]'}`}>
        {showSidebar && (
          <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-72 hidden md:block sticky top-24 h-[calc(100vh-8rem)] z-30"
          >
            <Sidebar />
          </motion.aside>
        )}

        <main className={`flex-1 min-w-0 ${showSidebar ? 'md:ml-8' : ''} relative z-10`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Footer />

      {/* Dynamic Background Gradients */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-secondary-900/40 to-transparent -z-10 blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-primary-900/20 to-transparent -z-10 blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default Layout;