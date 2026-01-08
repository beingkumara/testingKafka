import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 text-white py-12 relative overflow-hidden border-t border-white/5">
      {/* Carbon fiber overlay */}
      <div className="absolute inset-0 bg-[url('/images/carbon-fiber.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>

      <div className="container-f1 mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1"
          >
            <div className="flex items-center mb-4">
              <Logo className="h-8 w-auto text-2xl mr-2 drop-shadow-[0_0_5px_rgba(225,6,0,0.8)]" />
              <span className="font-heading text-lg tracking-widest uppercase">F1NITY</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The ultimate telemetry dashboard for Formula 1 enthusiasts. Real-time data, comprehensive stats, and predictive analytics.
            </p>
            <div className="flex space-x-4">
              <motion.a whileHover={{ scale: 1.1, color: '#E10600' }} href="#" className="text-gray-400 transition-colors"><Github className="h-5 w-5" /></motion.a>
              <motion.a whileHover={{ scale: 1.1, color: '#1DA1F2' }} href="#" className="text-gray-400 transition-colors"><Twitter className="h-5 w-5" /></motion.a>
              <motion.a whileHover={{ scale: 1.1, color: '#C13584' }} href="#" className="text-gray-400 transition-colors"><Instagram className="h-5 w-5" /></motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-1 flex flex-col md:items-center"
          >
            <div>
              <h4 className="font-heading text-sm text-white uppercase tracking-widest mb-6 border-l-2 border-primary-500 pl-3">Paddock</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="text-gray-400 hover:text-primary-500 transition-colors flex items-center"><ChevronRightIcon /> Home</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-primary-500 transition-colors flex items-center"><ChevronRightIcon /> Telemetry Dashboard</Link></li>
                <li><Link to="/standings" className="text-gray-400 hover:text-primary-500 transition-colors flex items-center"><ChevronRightIcon /> Driver Standings</Link></li>
                <li><Link to="/races" className="text-gray-400 hover:text-primary-500 transition-colors flex items-center"><ChevronRightIcon /> Race Calendar</Link></li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-1 flex flex-col md:items-center"
          >
            <div>
              <h4 className="font-heading text-sm text-white uppercase tracking-widest mb-6 border-l-2 border-secondary-500 pl-3">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="https://api.jolpi.ca/ergast/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary-500 transition-colors flex items-center"><ChevronRightIcon /> Jolpica Ergast API</a></li>
                <li><a href="https://openf1.org/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary-500 transition-colors flex items-center"><ChevronRightIcon /> OpenF1</a></li>
                <li><a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary-500 transition-colors flex items-center"><ChevronRightIcon /> OpenMeteo</a></li>
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-mono">
          <p>&copy; {currentYear} F1NITY Telemetry. Unofficial Application.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Start Icon helper
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-2 opacity-50"><path d="m9 18 6-6-6-6" /></svg>
);

export default Footer;
