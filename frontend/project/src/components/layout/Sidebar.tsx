import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Flag, Trophy, BarChart } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

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
                <span className="font-mono">14/23</span>
              </div>
              <div className="flex justify-between">
                <span>Next race:</span>
                <span className="font-mono">Singapore</span>
              </div>
              <div className="flex justify-between">
                <span>Top team:</span>
                <span className="font-mono">Red Bull</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;