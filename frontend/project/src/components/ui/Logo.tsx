import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-auto' }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.svg
        viewBox="0 0 180 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* F1 Racing Flag Background */}
        <motion.rect
          x="0" 
          y="5" 
          width="180" 
          height="30" 
          rx="4"
          fill="#15151E"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ transformOrigin: 'left center' }}
        />
        
        {/* Red accent bar */}
        <motion.rect
          x="0" 
          y="5" 
          width="8" 
          height="30" 
          fill="#E10600"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ transformOrigin: 'center bottom' }}
        />
        
        {/* F1 */}
        <motion.path
          d="M20 10H40V16H28V19H38V25H28V30H20V10Z"
          fill="#E10600"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        
        <motion.path
          d="M45 10H53V30H45V10Z"
          fill="#E10600"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ transformOrigin: 'center top' }}
        />
        
        {/* Checkered flag pattern */}
        <motion.path
          d="M60 15H64V19H60V15ZM64 19H68V23H64V19ZM68 15H72V19H68V15ZM72 19H76V23H72V19ZM76 15H80V19H76V15ZM60 23H64V27H60V23ZM68 23H72V27H68V23ZM76 23H80V27H76V23Z"
          fill="#FFFFFF"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        
        {/* nity */}
        <motion.path
          d="M85 15V30H90V18H91L98 30H103V15H98V27H97L90 15H85Z"
          fill="#FFFFFF"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        />
        
        <motion.path
          d="M108 15V30H113V15H108Z"
          fill="#FFFFFF"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        />
        
        <motion.path
          d="M118 22.5V15H113V30H118V25L122 22L128 30H134L125 19L134 15H128L118 22.5Z"
          fill="#FFFFFF"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        />
        
        <motion.path
          d="M138 15V30H143V15H138Z"
          fill="#FFFFFF"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        />
        
        {/* Racing line accent */}
        <motion.rect
          x="0" 
          y="35" 
          width="180" 
          height="2" 
          fill="#E10600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          style={{ transformOrigin: 'left center' }}
        />
      </motion.svg>
      
      {/* Motion blur effect behind logo */}
      <motion.div 
        className="absolute inset-0 -z-10 opacity-60 blur-md"
        style={{ 
          background: 'linear-gradient(90deg, transparent, #E10600, transparent)',
          width: '150%',
          left: '-25%'
        }}
        animate={{
          x: ['0%', '100%', '0%'],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: 'loop',
          ease: "easeInOut",
        }}
      />
      
      {/* Racing speed lines */}
      <motion.div 
        className="absolute inset-0 -z-20 opacity-30"
        style={{ 
          background: 'linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.1) 60%, transparent 70%)',
          backgroundSize: '200% 100%',
          width: '200%',
          left: '-50%'
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatType: 'loop',
          ease: "linear",
        }}
      />
    </div>
  );
};

export default Logo;