import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, ExternalLink, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-dark-700 to-dark-900 text-white py-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-tertiary-500"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 md:mb-0"
          >
            <Logo className="h-8 w-auto mb-2" />
            <p className="text-dark-300 max-w-md text-sm">
              The ultimate F1 analytics platform for fans and enthusiasts.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-sm font-medium mb-2 gradient-text">Navigation</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link to="/" className="text-dark-300 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">Home</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-dark-300 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link to="/drivers" className="text-dark-300 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">Drivers</span>
                  </Link>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-sm font-medium mb-2 gradient-text">Resources</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="#" className="text-dark-300 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">API Docs</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-dark-300 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">F1 News</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-dark-300 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">Blog</span>
                  </a>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="col-span-2 md:col-span-1"
            >
              <h4 className="text-sm font-medium mb-2 gradient-text">Connect</h4>
              <div className="flex space-x-3">
                <motion.a 
                  whileTap={{ scale: 0.95 }}
                  href="#" 
                  className="h-8 w-8 rounded-full bg-dark-600 flex items-center justify-center hover:bg-primary-500 transition-all duration-300"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </motion.a>
                <motion.a 
                  whileTap={{ scale: 0.95 }}
                  href="#" 
                  className="h-8 w-8 rounded-full bg-dark-600 flex items-center justify-center hover:bg-secondary-500 transition-all duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </motion.a>
                <motion.a 
                  whileTap={{ scale: 0.95 }}
                  href="#" 
                  className="h-8 w-8 rounded-full bg-dark-600 flex items-center justify-center hover:bg-accent-500 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-4 border-t border-dark-600 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-dark-400 text-xs">
            &copy; {currentYear} F1nity. All rights reserved.
          </p>
          
          <div className="mt-2 md:mt-0">
            <ul className="flex flex-wrap justify-center md:justify-end space-x-4 text-xs">
              <li><a href="#" className="text-dark-400 hover:text-white transition-colors duration-300">Privacy</a></li>
              <li><a href="#" className="text-dark-400 hover:text-white transition-colors duration-300">Terms</a></li>
              <li><a href="#" className="text-dark-400 hover:text-white transition-colors duration-300">Cookies</a></li>
            </ul>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
