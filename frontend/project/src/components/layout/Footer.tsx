import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, ExternalLink, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-dark-700 to-dark-900 text-white py-12 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-tertiary-500"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary-500/10 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-secondary-500/10 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-0"
          >
            <Logo className="h-10 w-auto mb-4" />
            <p className="text-dark-300 max-w-md">
              The ultimate F1 analytics platform for fans and enthusiasts.
              Track races, drivers, and team performance in one place.
            </p>
            <div className="mt-6 flex items-center">
              <span className="text-dark-300 text-sm mr-2">Made with</span>
              <Heart className="h-4 w-4 text-primary-500 animate-pulse" />
              <span className="text-dark-300 text-sm ml-2">for F1 fans</span>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-lg font-medium mb-4 gradient-text">Navigation</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-dark-300 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      Home
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-dark-300 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      Dashboard
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary-500 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/drivers" className="text-dark-300 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      Drivers
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-tertiary-500 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/races" className="text-dark-300 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      Races
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-500 transition-all duration-300 group-hover:w-full"></span>
                    </span>
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
              <h4 className="text-lg font-medium mb-4 gradient-text">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-dark-300 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      API Docs
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                    <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-dark-300 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      F1 News
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary-500 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                    <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-dark-300 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      Tutorials
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-tertiary-500 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                    <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-dark-300 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      Blog
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-500 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                    <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
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
              <h4 className="text-lg font-medium mb-4 gradient-text">Connect</h4>
              <div className="flex space-x-4">
                <motion.a 
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href="#" 
                  className="h-10 w-10 rounded-full bg-dark-600 flex items-center justify-center hover:bg-primary-500 transition-all duration-300 shadow-md"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href="#" 
                  className="h-10 w-10 rounded-full bg-dark-600 flex items-center justify-center hover:bg-secondary-500 transition-all duration-300 shadow-md"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href="#" 
                  className="h-10 w-10 rounded-full bg-dark-600 flex items-center justify-center hover:bg-accent-500 transition-all duration-300 shadow-md"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </motion.a>
              </div>
              
              <div className="mt-6">
                <h5 className="text-sm font-medium mb-2 text-dark-300">Subscribe to our newsletter</h5>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="bg-dark-600 border border-dark-500 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
                  />
                  <button className="bg-primary-500 hover:bg-primary-600 text-white rounded-r-md px-3 py-2 text-sm transition-colors duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8 border-t border-dark-600 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-dark-400 text-sm">
            &copy; {currentYear} F1nity. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0">
            <ul className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <li><a href="#" className="text-dark-400 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="text-dark-400 hover:text-white transition-colors duration-300">Terms of Service</a></li>
              <li><a href="#" className="text-dark-400 hover:text-white transition-colors duration-300">Cookie Policy</a></li>
            </ul>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;