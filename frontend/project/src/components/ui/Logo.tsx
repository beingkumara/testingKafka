import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-auto' }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.svg
        viewBox="0 0 120 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Infinity shape */}
        <motion.path
          d="M65 13C61.5 9.5 56 9.5 52.5 13L50 15.5C49.5 16 49.5 16.5 50 17C50.5 17.5 51 17.5 51.5 17L54 14.5C56.5 12 61 12 63.5 14.5C66 17 66 21.5 63.5 24L61 26.5C58.5 29 54 29 51.5 26.5L49 24C48.5 23.5 48 23.5 47.5 24C47 24.5 47 25 47.5 25.5L50 28C53.5 31.5 59 31.5 62.5 28L65 25.5C68.5 22 68.5 16.5 65 13Z"
          fill="#E10600"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        
        {/* F1 Car */}
        <motion.path
          d="M33 24H28L32 20H22V22H26L22 26H33V24Z"
          fill="white"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
        
        {/* 1 */}
        <motion.path
          d="M39 20V30H41V20H39Z"
          fill="white"
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        />
        
        {/* nity */}
        <motion.path
          d="M72 20V30H74V22H75L80 30H82V20H80V28H79L74 20H72Z"
          fill="white"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        />
        
        <motion.path
          d="M85 20V30H87V20H85Z"
          fill="white"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        />
        
        <motion.path
          d="M93 25V20H91V30H93V28L95 25L98 30H100L96 24L100 20H98L93 25Z"
          fill="white"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        />
        
        <motion.path
          d="M101 20V30H103V20H101Z"
          fill="white"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        />
      </motion.svg>
      
      {/* Motion blur effect behind logo */}
      <motion.div 
        className="absolute inset-0 -z-10 opacity-40 blur-md"
        style={{ 
          background: 'linear-gradient(90deg, transparent, #E10600, transparent)',
          width: '150%',
          left: '-25%'
        }}
        animate={{
          x: ['0%', '100%', '0%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default Logo;