import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        {showSidebar && (
          <aside className="w-64 hidden md:block">
            <Sidebar />
          </aside>
        )}
        
        <main className={`flex-1 ${showSidebar ? 'sm:ml' : ''}`}>
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;