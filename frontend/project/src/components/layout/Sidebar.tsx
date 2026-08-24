import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Flag, Trophy, Search, Newspaper, ChevronRight, Radio } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getRaces, getConstructorStandings, getDriverStandings } from '../../services';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [nextRace, setNextRace] = useState<string>('Loading...');
  const [topTeam, setTopTeam] = useState<string>('Loading...');
  const [topDriver, setTopDriver] = useState<string>('Loading...');
  const [completedRaces, setCompletedRaces] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const races = await getRaces();
        const completed = races.filter(race => race.completed).length;
        const total = races.length;
        setCompletedRaces([completed, total]);

        const upcoming = races.filter(race => !race.completed);
        if (upcoming.length > 0) {
          const raceName = upcoming[0].name;
          setNextRace(raceName.length > 16 ? raceName.substring(0, 16) + '…' : raceName);
        } else {
          setNextRace('Season complete');
        }

        const constructors = await getConstructorStandings();
        if (constructors.length > 0) {
          const teamName = constructors[0].name.toUpperCase();
          setTopTeam(teamName.length > 16 ? teamName.substring(0, 16) + '…' : teamName);
        }

        const drivers = await getDriverStandings();
        if (drivers.length > 0) {
          const driverName = drivers[0].name;
          setTopDriver(driverName.length > 16 ? driverName.substring(0, 16) + '…' : driverName);
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
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      name: 'Drivers',
      path: '/drivers',
      icon: <Users className="h-4 w-4" />,
    },
    {
      name: 'Races',
      path: '/races',
      icon: <Flag className="h-4 w-4" />,
    },
    {
      name: 'Standings',
      path: '/standings',
      icon: <Trophy className="h-4 w-4" />,
    },
    {
      name: 'Race Results',
      path: '/race-results',
      icon: <Search className="h-4 w-4" />,
    },
    {
      name: 'News',
      path: '/news',
      icon: <Newspaper className="h-4 w-4" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 },
    },
  };

  const itemVariants = {
    hidden: { x: -16, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // Progress fraction for the season bar
  const [completed, total] = completedRaces;
  const progressPct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="h-full glass-panel border-r border-white/5 flex flex-col pt-6 pb-4 shadow-2xl relative overflow-hidden">
      {/* Subtle dot grid texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="px-4 mb-6 relative z-10">
        <h3 className="text-[10px] font-mono text-gray-600 uppercase tracking-widest pl-2 mb-4 border-b border-white/5 pb-2">
          Navigation
        </h3>
        <motion.nav
          className="space-y-0.5"
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
                    group flex items-center px-3 py-2.5 rounded-md relative overflow-hidden
                    ${isActive
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-200'
                    }
                  `}
                  style={{
                    backgroundColor: isActive ? 'rgba(225,6,0,0.08)' : 'transparent',
                    boxShadow: isActive ? 'inset 3px 0 0 #E10600' : 'none',
                    transition: 'background-color 200ms ease-out, color 200ms ease-out, box-shadow 200ms ease-out',
                  }}
                >
                  {/* Hover glint */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] pointer-events-none" style={{ transition: 'transform 800ms ease-in-out' }} />

                  <span className={`mr-3 flex-shrink-0 ${isActive ? 'text-primary-500' : 'text-gray-600 group-hover:text-gray-400'}`} style={{ transition: 'color 200ms ease-out' }}>
                    {item.icon}
                  </span>
                  <span className="font-heading text-xs uppercase tracking-wider">{item.name}</span>

                  {isActive && (
                    <ChevronRight className="ml-auto w-3 h-3 text-primary-500 flex-shrink-0" />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>
      </div>

      {/* Season Telemetry Widget */}
      <div className="mt-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="bg-black/40 backdrop-blur-sm border border-white/8 rounded-lg p-4 relative overflow-hidden"
        >
          {/* Card accent border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-600 via-primary-500 to-transparent" />

          <div className="flex items-center mb-4 pb-3 border-b border-white/8">
            <Radio className="h-3.5 w-3.5 text-primary-500 mr-2 animate-pulse-slow" />
            <h4 className="font-heading text-[10px] text-gray-400 tracking-widest uppercase">Season Telemetry</h4>
          </div>

          <div className="space-y-3">
            {/* Season Progress */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] text-gray-600 font-mono uppercase">Season Progress</span>
                <span className="tabular-nums font-mono text-[10px] text-white bg-white/8 px-1.5 py-0.5 rounded border border-white/10">
                  {completed}/{total}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{
                    width: `${progressPct}%`,
                    transition: 'width 1s ease-out',
                    boxShadow: '0 0 6px rgba(225,6,0,0.6)',
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-600 font-mono uppercase">Next GP</span>
              <span className="tabular-nums font-mono text-[10px] text-secondary-400 text-right truncate max-w-[110px]">{nextRace}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-600 font-mono uppercase">P1 Driver</span>
              <span className="tabular-nums font-mono text-[10px] text-tertiary-400 text-right truncate max-w-[110px]">{topDriver}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-600 font-mono uppercase">P1 Team</span>
              <span className="tabular-nums font-mono text-[10px] text-accent-400 text-right truncate max-w-[110px]">{topTeam}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sidebar;
