import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { getDrivers } from '../services';
import LoadingScreen from '../components/ui/LoadingScreen';

interface Driver {
  id: string;
  name: string;
  number: number;
  team: string;
  nationality: string;
  points: number;
  wins: number;
  podiums: number;
  image: string;
}

const DriversPage: React.FC = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState('');

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await getDrivers();
        setDrivers(data);
        setFilteredDrivers(data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    let filtered = drivers;

    if (searchTerm) {
      filtered = filtered.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (teamFilter) {
      filtered = filtered.filter(driver =>
        driver.team === teamFilter
      );
    }

    setFilteredDrivers(filtered);
  }, [searchTerm, teamFilter, drivers]);

  const teams = [...new Set(drivers.map(driver => driver.team))];

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Drivers</h1>
        <p className="text-secondary-600 dark:text-secondary-300">
          Explore detailed profiles of all Formula 1 drivers
        </p>
      </div>

      <div className="card mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Search drivers..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
              <select
                className="input pl-10 appearance-none pr-8"
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
              >
                <option value="">All teams</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 14l-5-5h10l-5 5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver, index) => (
          <motion.div
            key={driver.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="card overflow-hidden group hover:shadow-lg dark:hover:shadow-secondary-900/30 transition-all duration-300"
          >
            <div className="h-48 relative overflow-hidden">
              <img
                src={driver.image}
                srcSet={
                  driver.image
                    ? `${driver.image} 0.9x, ${driver.image.replace('.png', '@2x.png')} 2x`
                    : '/default-driver.jpg 1x'
                }
                alt={driver.name}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.currentTarget.src = '/default-driver.jpg'; // Use your local fallback image path
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/90 to-transparent"></div>

              <div className="absolute bottom-0 left-0 p-4 w-full">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-white text-xl font-bold">{driver.name}</h3>
                    <p className="text-secondary-200">{driver.team}</p>
                  </div>
                  <div className="h-12 w-12 bg-white dark:bg-secondary-700 rounded-full flex items-center justify-center text-2xl font-bold">
                    {driver.number}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 racing-line opacity-70"></div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary-50 dark:bg-secondary-800 p-3 rounded">
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">Nationality</p>
                  <p className="font-medium">{driver.nationality}</p>
                </div>
                <div className="bg-secondary-50 dark:bg-secondary-800 p-3 rounded">
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">Points</p>
                  <p className="font-medium font-mono">{driver.points}</p>
                </div>
                <div className="bg-secondary-50 dark:bg-secondary-800 p-3 rounded">
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">Wins</p>
                  <p className="font-medium font-mono">{driver.wins}</p>
                </div>
                <div className="bg-secondary-50 dark:bg-secondary-800 p-3 rounded">
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">Podiums</p>
                  <p className="font-medium font-mono">{driver.podiums}</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  // For debugging
                  console.log('Driver data:', driver);
                  
                  // Use driver name as fallback if id is undefined
                  const driverId = driver.id || driver.name.toLowerCase().replace(' ', '-');
                  console.log('Navigating to driver profile:', driverId);
                  
                  navigate(`/drivers/${driverId}`);
                }}
                className="btn btn-outline w-full mt-4"
              >
                View Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-secondary-500 dark:text-secondary-400">No drivers found matching your criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setTeamFilter('');
            }}
            className="btn btn-outline mt-4"
          >
            Reset Filters
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default DriversPage;
