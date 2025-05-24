import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flag, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary-500/10 mb-8">
            <Flag className="h-12 w-12 text-primary-500" />
          </div>
          
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          
          <p className="text-secondary-600 dark:text-secondary-300 mb-8">
            Oops! Looks like you've gone off track. This page doesn't exist or has been moved.
          </p>
          
          <Link to="/" className="btn btn-primary inline-flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </motion.div>
        
        {/* Racing line effect */}
        <div className="mt-12">
          <div className="racing-line h-4 w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;