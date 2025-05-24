import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <Logo className="h-8 w-auto mb-4" />
            <p className="text-secondary-300 max-w-md">
              The ultimate F1 analytics platform for fans and enthusiasts.
              Track races, drivers, and team performance in one place.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-medium mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-secondary-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/dashboard" className="text-secondary-300 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/drivers" className="text-secondary-300 hover:text-white transition-colors">Drivers</Link></li>
                <li><Link to="/races" className="text-secondary-300 hover:text-white transition-colors">Races</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-secondary-300 hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="text-secondary-300 hover:text-white transition-colors">F1 News</a></li>
                <li><a href="#" className="text-secondary-300 hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-secondary-300 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-lg font-medium mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="h-10 w-10 rounded-full bg-secondary-700 flex items-center justify-center hover:bg-primary-500 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="h-10 w-10 rounded-full bg-secondary-700 flex items-center justify-center hover:bg-primary-500 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="h-10 w-10 rounded-full bg-secondary-700 flex items-center justify-center hover:bg-primary-500 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-secondary-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary-300 text-sm">
            &copy; {currentYear} F1nity. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm">
              <li><a href="#" className="text-secondary-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-secondary-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-secondary-300 hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;