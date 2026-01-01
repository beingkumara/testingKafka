import React from 'react';
import { motion } from 'framer-motion';
// @ts-ignore
// import logoImg from '../../assets/fanf1x_logo.png';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-auto' }) => {
  // Extract height related classes to adapt text size if possible, or just default
  // For text logo, we probably want to ignore the "h-8" part essentially for the container and just size the text
  // But to be safe, let's wrap it.

  return (
    <div className={`relative flex items-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="font-heading italic tracking-tighter text-2xl"
      >
        <span className="text-white">Fan</span>
        <span className="text-primary-500">F1x</span>
      </motion.div>
    </div>
  );
};

export default Logo;