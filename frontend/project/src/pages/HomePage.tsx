import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Trophy, Users, Clock, BarChart3, Flag, Calendar, Activity, Zap } from 'lucide-react';
import CountUp from 'react-countup';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  
  useEffect(() => {
    // Generate tire smoke effect at random intervals
    const interval = setInterval(() => {
      if (ref.current) {
        const smoke = document.createElement('div');
        smoke.classList.add('tire-smoke');
        
        // Random position within the hero section
        smoke.style.left = `${Math.random() * 100}%`;
        smoke.style.bottom = `${Math.random() * 20}%`;
        
        ref.current.appendChild(smoke);
        
        // Remove smoke element after animation completes
        setTimeout(() => {
          smoke.remove();
        }, 1000);
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <motion.div
        ref={ref}
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-40"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/12746357/pexels-photo-12746357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-dark-500/90 to-dark-600/90 z-0"></div>
        
        {/* Speed lines effect */}
        <div className="speed-lines"></div>
        
        {/* Racing line at bottom */}
        <div className="racing-line absolute bottom-0 left-0 right-0 h-4 z-10"></div>
        
        <div className="container mx-auto px-4 pt-24 lg:pt-0 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-bold mb-6 f1-title">
                Your Ultimate <span className="text-primary-500">Formula 1</span> Analytics Platform
              </h1>
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <p className="text-xl md:text-2xl text-white/80 mb-10">
                Track races, analyze driver performance, and discover insights from the world's most thrilling motorsport.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {!isAuthenticated ? (
                <>
                  <Link to="/signup" className="f1-button bg-primary-500 hover:bg-primary-600 text-white text-lg px-8 py-3 rounded-md shadow-glow-red">
                    Get Started
                  </Link>
                  <Link to="/login" className="f1-button bg-dark-500 hover:bg-dark-600 text-white text-lg px-8 py-3 rounded-md border-2 border-primary-500">
                    Log In
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="f1-button bg-primary-500 hover:bg-primary-600 text-white text-lg px-8 py-3 rounded-md shadow-glow-red">
                  Go to Dashboard
                </Link>
              )}
            </motion.div>
            
            {/* Rev counter animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-16 flex justify-center"
            >
              <div className="rev-counter">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className="rev-counter-bar" 
                    style={{ animationDelay: `${i * 0.05}s` }}
                  ></div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
          >
            <ChevronDown className="w-10 h-10 text-white opacity-70" />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Features section */}
      <section className="py-20 bg-white dark:bg-dark-600 relative overflow-hidden">
        {/* F1 grid pattern background */}
        <div className="absolute inset-0 f1-grid opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 f1-title">
              Why Choose <span className="text-primary-500">F1nity</span>
            </h2>
            <div className="f1-divider max-w-xs mx-auto"></div>
            <p className="text-lg text-dark-600 dark:text-dark-200 max-w-3xl mx-auto mt-6">
              Experience Formula 1 data like never before with our comprehensive analytics platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Trophy className="w-10 h-10 text-primary-500" />,
                title: 'Live Standings',
                description: 'Real-time driver and constructor standings updated as races unfold.',
              },
              {
                icon: <Users className="w-10 h-10 text-primary-500" />,
                title: 'Driver Profiles',
                description: 'Detailed statistics and history for every driver on the grid.',
              },
              {
                icon: <Calendar className="w-10 h-10 text-primary-500" />,
                title: 'Race Calendar',
                description: 'Never miss a race with our comprehensive F1 calendar and countdowns.',
              },
              {
                icon: <BarChart3 className="w-10 h-10 text-primary-500" />,
                title: 'Performance Analysis',
                description: 'Advanced metrics and visualizations to understand race performance.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="f1-card p-6 hover:translate-y-[-5px] transition-all duration-300"
              >
                <div className="mb-4 bg-primary-500/10 w-16 h-16 rounded-md flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 f1-title">{feature.title}</h3>
                <p className="text-dark-600 dark:text-dark-200">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team colors section */}
      <section className="py-16 bg-dark-500 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 f1-title">F1 Teams</h2>
            <div className="f1-divider max-w-xs mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Mercedes', color: 'bg-team-mercedes' },
              { name: 'Red Bull', color: 'bg-team-redbull' },
              { name: 'Ferrari', color: 'bg-team-ferrari' },
              { name: 'McLaren', color: 'bg-team-mclaren' },
              { name: 'Alpine', color: 'bg-team-alpine' },
              { name: 'Aston Martin', color: 'bg-team-astonmartin' },
              { name: 'Williams', color: 'bg-team-williams' },
              { name: 'AlphaTauri', color: 'bg-team-alphatauri' },
              { name: 'Alfa Romeo', color: 'bg-team-alfaromeo' },
              { name: 'Haas', color: 'bg-team-haas text-dark-500' },
            ].map((team, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className={`${team.color} p-4 rounded-md text-center font-bold shadow-md`}
              >
                {team.name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Statistics section */}
      <section className="py-20 bg-white dark:bg-dark-700 overflow-hidden relative">
        {/* Racing line vertical */}
        <div className="absolute top-0 bottom-0 left-10 w-1 racing-line-vertical"></div>
        <div className="absolute top-0 bottom-0 right-10 w-1 racing-line-vertical"></div>
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 f1-title">
                  Powered by Comprehensive Data
                </h2>
                <div className="f1-divider max-w-xs"></div>
                <p className="text-lg mb-8 text-dark-600 dark:text-dark-200 mt-6">
                  F1nity provides access to the most extensive Formula 1 database, 
                  with race data going back to the beginning of the championship.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: 73, label: 'Championship Seasons', icon: <Trophy className="w-6 h-6" /> },
                  { value: 1079, label: 'Grand Prix Races', icon: <Flag className="w-6 h-6" /> },
                  { value: 770, label: 'Drivers', icon: <Users className="w-6 h-6" /> },
                  { value: 170, label: 'Constructors', icon: <Activity className="w-6 h-6" /> },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="f1-card p-4 flex flex-col items-center text-center"
                  >
                    <div className="mb-2 text-primary-500">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-primary-500">
                      <CountUp end={stat.value} duration={2.5} />+
                    </div>
                    <p className="text-dark-600 dark:text-dark-200 text-sm">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div 
                className="aspect-video rounded-md overflow-hidden shadow-f1-card bg-cover bg-center"
                style={{ 
                  backgroundImage: "url('https://images.pexels.com/photos/12041877/pexels-photo-12041877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
                }}
              />
              
              <div className="absolute -bottom-5 -right-5 bg-primary-500 text-white p-4 rounded-md shadow-glow-red">
                <div className="flex items-center mb-1">
                  <div className="pit-light mr-2"></div>
                  <p className="text-sm font-medium">NEXT RACE</p>
                </div>
                <p className="text-2xl font-bold f1-title">Singapore Grand Prix</p>
                <p className="text-sm">September 22, 2025</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Tire compounds section */}
      <section className="py-12 bg-dark-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold f1-title">F1 Tire Compounds</h3>
            <div className="f1-divider max-w-xs mx-auto"></div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { name: 'Soft', class: 'tire-soft' },
              { name: 'Medium', class: 'tire-medium' },
              { name: 'Hard', class: 'tire-hard' },
              { name: 'Intermediate', class: 'tire-intermediate' },
              { name: 'Wet', class: 'tire-wet' },
            ].map((tire, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className={`${tire.class} w-16 h-16 rounded-full mb-2 flex items-center justify-center animate-tire-spin`}>
                  <div className="w-6 h-6 rounded-full bg-dark-900"></div>
                </div>
                <p className="text-sm font-medium">{tire.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-20 bg-dark-500 text-white overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="racing-line absolute top-0 left-0 right-0 h-4"></div>
            <div className="racing-line absolute bottom-0 left-0 right-0 h-4"></div>
            
            {/* Checkered flag background */}
            <div className="absolute top-1/2 right-10 transform -translate-y-1/2 w-20 h-20 checkered-flag opacity-50 rounded-full"></div>
            <div className="absolute top-1/3 left-10 transform -translate-y-1/2 w-16 h-16 checkered-flag opacity-50 rounded-full"></div>
            
            <div className="max-w-4xl mx-auto text-center py-16">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-6 f1-title">
                  Ready to Experience Formula 1 Like Never Before?
                </h2>
                <div className="f1-divider max-w-xs mx-auto"></div>
                <p className="text-xl text-white/80 my-10">
                  Join thousands of fans who've enhanced their Formula 1 experience with F1nity.
                </p>
                {!isAuthenticated ? (
                  <Link 
                    to="/signup" 
                    className="f1-button bg-primary-500 hover:bg-primary-600 text-white text-lg px-10 py-3 rounded-md shadow-glow-red"
                  >
                    <Zap className="w-5 h-5 mr-2 inline-block" />
                    Get Started For Free
                  </Link>
                ) : (
                  <Link 
                    to="/dashboard" 
                    className="f1-button bg-primary-500 hover:bg-primary-600 text-white text-lg px-10 py-3 rounded-md shadow-glow-red"
                  >
                    <Zap className="w-5 h-5 mr-2 inline-block" />
                    Go to Dashboard
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;