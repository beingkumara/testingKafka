import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Flag, Trophy, BarChart, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
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
          // Truncate race name if too long
          const raceName = upcoming[0].name;
          setNextRace(raceName);
        } else {
          setNextRace('Season complete');
        }
        
        // Get constructor standings
        const constructors = await getConstructorStandings();
        if (constructors.length > 0) {
          setTopTeam(constructors[0].name.toUpperCase());
        }
        
        // Get driver standings
        const drivers = await getDriverStandings();
        if (drivers.length > 0) {
          setTopDriver(drivers[0].name);
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
    },
    {
      name: 'Drivers',
      path: '/drivers',
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: 'Races',
      path: '/races',
      icon: <Flag className="h-5 w-5" />,
    },
    {
      name: 'Standings',
      path: '/standings',
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      name: 'Race Results',
      path: '/race-results',
      icon: <Search className="h-5 w-5" />,
    },
  ];

  return (
    <div className="h-full bg-white dark:bg-secondary-700 shadow-lg">
      <div className="px-4 py-6">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-4 py-3 rounded-lg transition-all duration-200
                ${location.pathname === item.path 
                  ? 'bg-primary-500 text-white' 
                  : 'hover:bg-secondary-100 dark:hover:bg-secondary-600 text-secondary-800 dark:text-white'
                }
              `}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
              
              {location.pathname === item.path && (
                <span className="ml-auto h-2 w-2 rounded-full bg-white" />
              )}
            </Link>
          ))}
        </nav>
        
        <div className="mt-10 pt-6 border-t dark:border-secondary-600">
          <div className="rounded-lg bg-secondary-50 dark:bg-secondary-800 p-4">
            <div className="flex items-center mb-3">
              <BarChart className="h-5 w-5 text-primary-500 mr-2" />
              <h4 className="font-medium">Season Stats</h4>
            </div>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Races completed:</span>
                <span className="font-mono">{completedRaces}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="whitespace-nowrap">Next race:</span>
                <span className="font-mono text-right ml-2">{nextRace}</span>
              </div>
              <div className="flex justify-between">
                <span>Top driver:</span>
                <span className="font-mono">{topDriver}</span>
              </div>
              <div className="flex justify-between">
                <span>Top team:</span>
                <span className="font-mono">{topTeam}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;