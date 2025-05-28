import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Trophy, Users, Clock, BarChart3 } from 'lucide-react';
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
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-30"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/12746357/pexels-photo-12746357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-900/70 to-secondary-800 z-0"></div>
        
        <div className="racing-line absolute bottom-0 left-0 right-0 h-4 z-10"></div>
        
        <div className="container mx-auto px-4 pt-24 lg:pt-0 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-bold mb-6">
                Your Ultimate <span className="text-primary-500">Formula 1</span> Analytics Platform
              </h1>
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <p className="text-xl md:text-2xl text-secondary-200 mb-10">
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
                  <Link to="/signup" className="btn btn-primary text-lg px-8 py-3 rounded-lg">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline text-lg px-8 py-3 rounded-lg">
                    Log In
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="btn btn-primary text-lg px-8 py-3 rounded-lg">
                  Go to Dashboard
                </Link>
              )}
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
      <section className="py-20 bg-white dark:bg-secondary-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Why Choose <span className="text-primary-500">F1nity</span>
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">
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
                icon: <Clock className="w-10 h-10 text-primary-500" />,
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
                className="card p-6 hover:shadow-lg dark:hover:shadow-secondary-900/30 transition-all duration-300"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-secondary-600 dark:text-secondary-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Statistics section */}
      <section className="py-20 bg-secondary-50 dark:bg-secondary-700 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Powered by Comprehensive Data
                </h2>
                <p className="text-lg mb-8 text-secondary-600 dark:text-secondary-300">
                  F1nity provides access to the most extensive Formula 1 database, 
                  with race data going back to the beginning of the championship.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: 73, label: 'Championship Seasons' },
                  { value: 1079, label: 'Grand Prix Races' },
                  { value: 770, label: 'Drivers' },
                  { value: 170, label: 'Constructors' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="bg-white dark:bg-secondary-800 p-4 rounded-lg shadow-md"
                  >
                    <div className="text-3xl font-bold text-primary-500">
                      <CountUp end={stat.value} duration={2.5} />+
                    </div>
                    <p className="text-secondary-600 dark:text-secondary-300">
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
                className="aspect-video rounded-lg overflow-hidden shadow-xl bg-cover bg-center"
                style={{ 
                  backgroundImage: "url('https://images.pexels.com/photos/12041877/pexels-photo-12041877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
                }}
              />
              
              <div className="absolute -bottom-5 -right-5 bg-primary-500 text-white p-4 rounded-lg shadow-lg">
                <p className="text-sm font-medium">NEXT RACE</p>
                <p className="text-2xl font-bold">Singapore Grand Prix</p>
                <p className="text-sm">September 22, 2025</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-20 bg-secondary-800 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="racing-line absolute top-0 left-0 right-0 h-4"></div>
            <div className="racing-line absolute bottom-0 left-0 right-0 h-4"></div>
            
            <div className="max-w-4xl mx-auto text-center py-16">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Ready to Experience Formula 1 Like Never Before?
                </h2>
                <p className="text-xl text-secondary-300 mb-10">
                  Join thousands of fans who've enhanced their Formula 1 experience with F1nity.
                </p>
                {!isAuthenticated ? (
                  <Link 
                    to="/signup" 
                    className="btn btn-primary text-lg px-10 py-3 rounded-lg"
                  >
                    Get Started For Free
                  </Link>
                ) : (
                  <Link 
                    to="/dashboard" 
                    className="btn btn-primary text-lg px-10 py-3 rounded-lg"
                  >
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