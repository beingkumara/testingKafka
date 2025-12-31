import React from 'react';
import { motion } from 'framer-motion';
// @ts-ignore
import logoImg from '../../assets/fanf1x_logo.png';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-auto' }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.img
        src={logoImg}
        alt="FanF1x Logo"
        className="h-full w-auto object-contain"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

export default Logo;