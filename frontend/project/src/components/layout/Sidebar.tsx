import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Flag, Trophy, BarChart, Search, Sparkles, Newspaper, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getRaces, getConstructorStandings, getDriverStandings } from '../../services';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [nextRace, setNextRace] = useState<string>('Loading...');
  const [topTeam, setTopTeam] = useState<string>('Loading...');
  const [topDriver, setTopDriver] = useState<string>('Loading...');
  const [completedRaces, setCompletedRaces] = useState<string>('0/0');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get races data
        const races = await getRaces();
        const completed = races.filter(race => race.completed).length;
        const total = races.length;
        setCompletedRaces(`${completed}/${total}`);

        // Find next race
        const upcoming = races.filter(race => !race.completed);
        if (upcoming.length > 0) {
          // Truncate race name if too long (max 15 chars)
          const raceName = upcoming[0].name;
          setNextRace(raceName.length > 15 ? raceName.substring(0, 15) + '...' : raceName);
        } else {
          setNextRace('Season complete');
        }

        // Get constructor standings
        const constructors = await getConstructorStandings();
        if (constructors.length > 0) {
          const teamName = constructors[0].name.toUpperCase();
          setTopTeam(teamName.length > 15 ? teamName.substring(0, 15) + '...' : teamName);
        }

        // Get driver standings
        const drivers = await getDriverStandings();
        if (drivers.length > 0) {
          const driverName = drivers[0].name;
          setTopDriver(driverName.length > 15 ? driverName.substring(0, 15) + '...' : driverName);
        }
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      }
    };

    fetchData();
  }, []);

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      color: 'text-primary-500',
    },
    {
      name: 'Drivers',
      path: '/drivers',
      icon: <Users className="h-5 w-5" />,
      color: 'text-secondary-500',
    },
    {
      name: 'Races',
      path: '/races',
      icon: <Flag className="h-5 w-5" />,
      color: 'text-tertiary-500',
    },
    {
      name: 'Standings',
      path: '/standings',
      icon: <Trophy className="h-5 w-5" />,
      color: 'text-accent-500',
    },
    {
      name: 'Race Results',
      path: '/race-results',
      icon: <Search className="h-5 w-5" />,
      color: 'text-secondary-500',
    },
    {
      name: 'News',
      path: '/news',
      icon: <Newspaper className="h-5 w-5" />,
      color: 'text-tertiary-500',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="h-full glass-panel border-r border-white/5 flex flex-col pt-6 pb-4 shadow-2xl relative overflow-hidden">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 bg-[url('/images/carbon-fiber.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>

      <div className="px-4 mb-6">
        <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest pl-2 mb-4 border-b border-white/5 pb-2">Main Menu</h3>
        <motion.nav
          className="space-y-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div key={item.path} variants={itemVariants}>
                <Link
                  to={item.path}
                  className={`
                    group flex items-center px-4 py-3 rounded-md transition-all duration-300 relative overflow-hidden
                    ${isActive
                      ? 'bg-primary-600/10 text-white border-l-2 border-primary-500 shadow-[inset_0_0_20px_rgba(225,6,0,0.1)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                    }
                  `}
                >
                  {/* Hover Glint Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out`}></div>

                  <span className={`mr-3 transition-colors duration-300 ${isActive ? 'text-primary-500 drop-shadow-[0_0_8px_rgba(225,6,0,0.5)]' : 'text-gray-500 group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  <span className="font-heading text-sm uppercase tracking-wide">{item.name}</span>

                  {isActive && (
                    <ChevronRight className="ml-auto w-4 h-4 text-primary-500" />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>
      </div>

      <div className="mt-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="telemetry-card bg-black/40 backdrop-blur-sm border border-white/10"
        >
          <div className="flex items-center mb-3 pb-2 border-b border-white/10">
            <Sparkles className="h-4 w-4 text-primary-500 mr-2 animate-pulse-slow" />
            <h4 className="font-heading text-xs text-gray-300 tracking-widest uppercase">Live Telemetry</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center group">
              <span className="text-xs text-gray-500 font-mono group-hover:text-primary-500 transition-colors">Progress</span>
              <span className="font-mono text-xs text-white bg-white/10 px-1.5 py-0.5 rounded border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]">{completedRaces}</span>
            </div>

            <div className="flex justify-between items-center group">
              <span className="text-xs text-gray-500 font-mono group-hover:text-secondary-500 transition-colors">Next GP</span>
              <span className="font-mono text-xs text-secondary-400 text-right truncate max-w-[100px]">{nextRace}</span>
            </div>

            <div className="flex justify-between items-center group">
              <span className="text-xs text-gray-500 font-mono group-hover:text-accent-500 transition-colors">P1 Driver</span>
              <span className="font-mono text-xs text-accent-400 text-right truncate max-w-[100px]">{topDriver}</span>
            </div>

            <div className="flex justify-between items-center group">
              <span className="text-xs text-gray-500 font-mono group-hover:text-tertiary-500 transition-colors">P1 Team</span>
              <span className="font-mono text-xs text-tertiary-400 text-right truncate max-w-[100px]">{topTeam}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sidebar;
