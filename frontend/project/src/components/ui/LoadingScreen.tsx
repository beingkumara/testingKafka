import { motion, useReducedMotion } from 'framer-motion';
import { createPortal } from 'react-dom';

/**
 * F1 "Lights Out" Loading Screen
 * Mimics the iconic race-start light sequence: 5 lights illuminate one by one,
 * then go dark together ("lights out — and away we go!")
 */
const LoadingScreen: React.FC = () => {
  const reduce = useReducedMotion();

  const lightVariants = {
    off: { backgroundColor: '#1a0000', boxShadow: '0 0 4px rgba(225,6,0,0.15)' },
    on:  { backgroundColor: '#E10600', boxShadow: '0 0 24px rgba(225,6,0,0.9), 0 0 48px rgba(225,6,0,0.4)' },
    dark: { backgroundColor: '#0a0000', boxShadow: '0 0 2px rgba(225,6,0,0.05)' },
  };

  // If reduced motion, just show a simple text loader
  if (reduce) {
    return createPortal(
      <div className="fixed inset-0 flex items-center justify-center bg-dark-800 z-[9999]">
        <div className="text-center">
          <div className="text-3xl font-heading font-bold text-white mb-4 tracking-widest">
            FAN<span className="text-primary-500">F1</span>X
          </div>
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest animate-pulse">
            Loading...
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050505] z-[9999]">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* App title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 text-center"
      >
        <div className="text-5xl font-heading font-black text-white tracking-widest">
          FAN<span className="text-primary-500">F1</span>X
        </div>
        <div className="text-xs font-mono text-gray-600 uppercase tracking-[0.4em] mt-2">
          The Apex of Analytics
        </div>
      </motion.div>

      {/* Start lights */}
      <div className="flex gap-5 mb-12">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="relative"
            initial="off"
            animate={['off', 'on', 'dark']}
            variants={lightVariants}
            transition={{
              duration: 0.18,
              times: [0, 0.3, 1],
              delay: i * 0.22 + 0.6,
              ease: 'easeOut',
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '2px solid rgba(225,6,0,0.4)',
            }}
          />
        ))}
      </div>

      {/* Loading bar */}
      <div className="relative w-56 h-px bg-white/10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-primary-500"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{
            duration: 2.5,
            ease: 'easeInOut',
            delay: 0.3,
          }}
        />
      </div>

      <motion.p
        className="mt-4 text-xs font-mono text-gray-600 uppercase tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Preparing the grid...
      </motion.p>
    </div>,
    document.body
  );
};

export default LoadingScreen;