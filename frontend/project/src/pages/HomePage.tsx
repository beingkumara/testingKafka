import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import F1CarCanvas from '../components/F1CarCanvas';
import { Zap, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  // Create a long scroll container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Smooth scroll progress for "telemetry" readouts
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // --- TRANSFORMATION LOGIC ---

  // 1. INTRO SEQUENCE (0 - 15%)
  // Dramatic fade out of big title, slide up
  const introOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const introScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const introY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);
  const introBlur = useTransform(scrollYProgress, [0, 0.08], ["blur(0px)", "blur(10px)"]);

  // 2. AERO DYNAMICS (15% - 40%)
  // Slide in from left, sharp and technical
  const aeroOpacity = useTransform(scrollYProgress, [0.15, 0.2, 0.35, 0.4], [0, 1, 1, 0]);
  const aeroX = useTransform(scrollYProgress, [0.15, 0.2, 0.35, 0.4], [-50, 0, 0, -50]);
  const aeroBlur = useTransform(scrollYProgress, [0.15, 0.2, 0.35, 0.4], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]);

  // 3. HYBRID POWER (45% - 70%)
  // Slide in from right, intense
  const powerOpacity = useTransform(scrollYProgress, [0.45, 0.5, 0.65, 0.7], [0, 1, 1, 0]);
  const powerX = useTransform(scrollYProgress, [0.45, 0.5, 0.65, 0.7], [50, 0, 0, 50]);
  const powerBlur = useTransform(scrollYProgress, [0.45, 0.5, 0.65, 0.7], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]);

  // 4. CTA / VICTORY (75% - 100%)
  // Scale up from center
  const ctaOpacity = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1]);
  const ctaScale = useTransform(scrollYProgress, [0.75, 1], [0.8, 1]);
  const ctaBlur = useTransform(scrollYProgress, [0.75, 0.85], ["blur(10px)", "blur(0px)"]);

  // Parallax Background Elements
  const bgGridY = useTransform(scrollYProgress, [0, 1], [0, 500]); // Moves slower than scroll
  const speedLinesOpacity = useTransform(scrollYProgress, [0.1, 0.9], [0, 0.3]);

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-[#050505] selection:bg-[#e10600] selection:text-white">

      {/* Sticky Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Dynamic Background Grid */}
        <motion.div
          style={{ y: bgGridY }}
          className="absolute inset-0 opacity-10 pointer-events-none"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
        </motion.div>

        {/* Speed Lines Effect */}
        <motion.div
          style={{ opacity: speedLinesOpacity }}
          className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-100 mix-blend-overlay"
        />

        {/* Cinematic Spotlight */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)] blur-[100px] opacity-30" />
        </div>

        {/* The 3D Car Model */}
        <div className="absolute inset-0 z-0">
          <F1CarCanvas scrollProgress={scrollYProgress} />
        </div>

        {/* Vignette & Color Grading */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none bg-gradient-to-t from-[#050505] to-transparent h-48 z-10" />
        <div className="absolute inset-x-0 top-0 pointer-events-none bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent h-96 z-10" />

        {/* --- DYNAMIC TEXT LAYERS --- */}
        <div className="relative z-10 h-full w-full pointer-events-none">

          {/* SECTION 1: INTRO */}
          <motion.div
            style={{ opacity: introOpacity, scale: introScale, y: introY, filter: introBlur }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6"
          >
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-7xl md:text-[10rem] font-black text-white leading-none tracking-tighter"
              >
                FAN<span className="text-[#e10600]">F1</span>X
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
              className="text-xl md:text-2xl text-gray-400 tracking-[0.5em] font-light mt-4 uppercase"
            >
              The Apex of Analytics
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-12 flex flex-col items-center gap-2 text-white/40"
            >

              <div className="w-px h-12 bg-gradient-to-b from-[#e10600] to-transparent"></div>
            </motion.div>
          </motion.div>

          {/* SECTION 2: AERODYNAMICS */}
          <motion.div
            style={{ opacity: aeroOpacity, x: aeroX, filter: aeroBlur }}
            className="absolute inset-0 flex items-center justify-start px-8 md:px-24"
          >
            <div className="max-w-xl border-l-2 border-[#e10600] pl-8 py-4 backdrop-blur-sm bg-black/10">
              <div className="flex items-center gap-3 mb-4 text-[#e10600]">
                <div className="w-2 h-2 bg-[#e10600] rounded-full animate-pulse"></div>
                <span className="text-xs font-mono tracking-[0.3em]">AERODYNAMICS_MODULE</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-white mb-6 leading-[0.85] tracking-tighter">
                PRECISION<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">ENGINEERING</span>
              </h2>
              <p className="text-lg text-gray-300 font-light leading-relaxed max-w-md border-t border-white/10 pt-6">
                Experience data visualization refined to the millisecond. Every curve, every lap, captured with aerodynamic efficiency.
              </p>
            </div>
          </motion.div>

          {/* SECTION 3: HYBRID POWER */}
          <motion.div
            style={{ opacity: powerOpacity, x: powerX, filter: powerBlur }}
            className="absolute inset-0 flex items-center justify-end px-8 md:px-24"
          >
            <div className="max-w-xl border-r-2 border-[#e10600] pr-8 py-4 text-right backdrop-blur-sm bg-black/10">
              <div className="flex items-center justify-end gap-3 mb-4 text-[#e10600]">
                <span className="text-xs font-mono tracking-[0.3em]">POWER_UNIT_TELEMETRY</span>
                <div className="w-2 h-2 bg-[#e10600] rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-white mb-6 leading-[0.85] tracking-tighter">
                HYBRID<br /><span className="text-transparent bg-clip-text bg-gradient-to-l from-gray-200 to-gray-600">PERFORMANCE</span>
              </h2>
              <p className="text-lg text-gray-300 font-light leading-relaxed max-w-md ml-auto border-t border-white/10 pt-6">
                Unleash the full potential of F1 analytics. Real-time processing meets historical depth.
              </p>
            </div>
          </motion.div>

          {/* SECTION 4: CTA / VICTORY */}
          <motion.div
            style={{ opacity: ctaOpacity, scale: ctaScale, filter: ctaBlur }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
          >
            <div className="text-center">
              <h2 className="text-6xl md:text-9xl font-black text-white mb-12 tracking-tighter">
                RACE <span className="text-[#e10600]">READY</span>
              </h2>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="group relative px-12 py-6 bg-[#e10600] text-white overflow-hidden skew-x-[-10deg] hover:shadow-[0_0_40px_rgba(225,6,0,0.5)] transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                    <div className="flex items-center gap-4 skew-x-[10deg]">
                      <span className="font-bold text-xl tracking-widest">ENTER PADDOCK</span>
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="group relative px-12 py-6 bg-[#e10600] text-white overflow-hidden skew-x-[-10deg] hover:shadow-[0_0_40px_rgba(225,6,0,0.5)] transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                      <div className="flex items-center gap-4 skew-x-[10deg]">
                        <span className="font-bold text-xl tracking-widest">JOIN TEAM</span>
                        <Zap className="w-6 h-6" />
                      </div>
                    </Link>
                    <Link
                      to="/login"
                      className="group px-12 py-6 border border-white/20 text-white skew-x-[-10deg] hover:bg-white/5 transition-all duration-300"
                    >
                      <span className="block font-bold text-xl tracking-widest skew-x-[10deg]">LOGIN</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- TELEMETRY SIDEBAR (Fixed) --- */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-8 pointer-events-none z-20">
          <div className="flex flex-col items-center gap-2">

            <div className="w-px h-32 bg-gray-800 relative overflow-hidden">
              <motion.div
                style={{ height: smoothProgress }}
                className="absolute top-0 w-full bg-[#e10600]"
              />
            </div>
            <span className="text-[10px] text-[#e10600] font-mono">01</span>
          </div>

          <div className="flex flex-col gap-2">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="w-1 h-1 bg-gray-700 rounded-full" />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;