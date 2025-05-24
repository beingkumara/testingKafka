import { motion } from 'framer-motion';
import Logo from './Logo';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-secondary-800 z-50">
      <div className="text-center">
        <div className="mb-6">
          <Logo className="h-16 w-auto mx-auto" />
        </div>
        
        <div className="relative w-48 h-2 bg-secondary-700 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ 
              duration: 1.5, 
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />
        </div>
        
        <motion.p 
          className="mt-4 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Preparing the grid...
        </motion.p>
      </div>
      
      {/* Pit stop animation inspired elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-primary-500"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.2, 1.5, 0.2],
            }}
            transition={{
              duration: 2,
              delay: i * 0.5,
              repeat: Infinity,
              repeatDelay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;