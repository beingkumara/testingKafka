import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Flag, Trophy, BarChart, Search, Sparkles } from 'lucide-react';
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
    <div className="h-full glass rounded-r-xl shadow-card">
      <div className="px-4 py-6">
        <motion.nav 
          className="space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {navItems.map((item) => (
            <motion.div key={item.path} variants={itemVariants}>
              <Link
                to={item.path}
                className={`
                  flex items-center px-4 py-3 rounded-xl transition-all duration-300
                  ${location.pathname === item.path 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg' 
                    : 'hover:bg-dark-100/50 dark:hover:bg-dark-600/50 text-dark-800 dark:text-white'
                  }
                `}
              >
                <span className={`mr-3 ${location.pathname === item.path ? 'text-white' : item.color}`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
                
                {location.pathname === item.path && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="ml-auto h-2 w-2 rounded-full bg-white" 
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </motion.nav>
        
        <div className="mt-10 pt-6 border-t border-dark-200/30 dark:border-dark-600/30">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl card-gradient p-4 shadow-card"
          >
            <div className="flex items-center mb-3">
              <Sparkles className="h-5 w-5 text-primary-500 mr-2" />
              <h4 className="font-medium gradient-text">Season Stats</h4>
            </div>
            <div className="text-sm space-y-3">
              <div className="grid grid-cols-[auto,1fr] gap-2 items-center">
                <span className="text-dark-600 dark:text-dark-300 whitespace-nowrap font-medium">Races:</span>
                <div className="text-right">
                  <span className="font-mono bg-dark-100/30 dark:bg-dark-700/30 px-2 py-1 rounded-md inline-block min-w-[60px] text-center shadow-sm border border-dark-200/20 dark:border-dark-600/20">{completedRaces}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-[auto,1fr] gap-2 items-center">
                <span className="text-dark-600 dark:text-dark-300 whitespace-nowrap font-medium">Next race:</span>
                <div className="text-right">
                  <span className="font-mono bg-dark-100/30 dark:bg-dark-700/30 px-2 py-1 rounded-md inline-block min-w-[60px] text-center shadow-sm border border-dark-200/20 dark:border-dark-600/20 text-secondary-500 dark:text-secondary-400">{nextRace}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-[auto,1fr] gap-2 items-center">
                <span className="text-dark-600 dark:text-dark-300 whitespace-nowrap font-medium">Top driver:</span>
                <div className="text-right">
                  <span className="font-mono bg-dark-100/30 dark:bg-dark-700/30 px-2 py-1 rounded-md inline-block min-w-[60px] text-center shadow-sm border border-dark-200/20 dark:border-dark-600/20 text-primary-500 dark:text-primary-400">{topDriver}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-[auto,1fr] gap-2 items-center">
                <span className="text-dark-600 dark:text-dark-300 whitespace-nowrap font-medium">Top team:</span>
                <div className="text-right">
                  <span className="font-mono bg-dark-100/30 dark:bg-dark-700/30 px-2 py-1 rounded-md inline-block min-w-[60px] text-center shadow-sm border border-dark-200/20 dark:border-dark-600/20 text-tertiary-500 dark:text-tertiary-400">{topTeam}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;