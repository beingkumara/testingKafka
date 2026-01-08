import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, User } from 'lucide-react';
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
        (driver.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (teamFilter) {
      filtered = filtered.filter(driver =>
        (driver.team || '').includes(teamFilter)
      );
    }

    setFilteredDrivers(filtered);
  }, [searchTerm, teamFilter, drivers]);

  const teams = [...new Set(drivers.map(driver => driver.team).filter(Boolean))];

  // Helper to map team names to colors (simplified)
  const getTeamColor = (team: string) => {
    const t = team.toLowerCase();
    if (t.includes('red bull')) return 'border-blue-700 shadow-blue-900/50';
    if (t.includes('ferrari')) return 'border-red-600 shadow-red-900/50';
    if (t.includes('mercedes')) return 'border-teal-500 shadow-teal-900/50';
    if (t.includes('mclaren')) return 'border-orange-500 shadow-orange-900/50';
    if (t.includes('aston')) return 'border-green-700 shadow-green-900/50';
    if (t.includes('alpine')) return 'border-blue-500 shadow-blue-900/50';
    if (t.includes('williams')) return 'border-blue-400 shadow-blue-900/50';
    if (t.includes('racing bulls') || t.includes('rb')) return 'border-blue-600 shadow-blue-900/50';
    if (t.includes('audi')) return 'border-gray-400 shadow-gray-900/50';
    if (t.includes('cadillac')) return 'border-yellow-600 shadow-yellow-900/50';
    if (t.includes('haas')) return 'border-red-500 shadow-red-900/50';
    return 'border-gray-500 shadow-gray-900/50';
  };

  const getTeamGradient = (team: string) => {
    const t = team.toLowerCase();
    if (t.includes('red bull')) return 'from-blue-900 to-blue-950';
    if (t.includes('ferrari')) return 'from-red-900 to-red-950';
    if (t.includes('mercedes')) return 'from-teal-900 to-teal-950';
    if (t.includes('mclaren')) return 'from-orange-900 to-orange-950';
    if (t.includes('aston')) return 'from-green-900 to-green-950';
    if (t.includes('racing bulls') || t.includes('rb')) return 'from-blue-800 to-blue-900';
    if (t.includes('audi')) return 'from-gray-700 to-gray-900';
    if (t.includes('cadillac')) return 'from-yellow-900 to-yellow-950';
    if (t.includes('haas')) return 'from-red-800 to-red-950';
    return 'from-gray-800 to-gray-900';
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header Section with Search */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-heading font-bold text-white uppercase italic mb-2">Driver <span className="text-primary-500">Grid</span></h1>
          <p className="text-gray-400 max-w-xl">
            Official driver profiles, statistics, and career path analysis for the current Formula 1 season.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative group w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search drivers..."
              className="f1-input pl-10 w-full bg-dark-800/50 border-white/10 focus:border-primary-500 focus:bg-dark-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative w-full md:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-500" />
            </div>
            <select
              className="f1-input pl-10 w-full appearance-none bg-dark-800/50 border-white/10 focus:border-primary-500 focus:bg-dark-800"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
            >
              <option value="">All Teams</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredDrivers.map((driver, index) => {
            const safeTeam = driver.team || 'Unknown Team';
            const safeName = driver.name || 'Unknown Driver';

            return (
              <motion.div
                layout
                key={driver.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => navigate(`/drivers/${driver.id || safeName.toLowerCase().replace(/\s+/g, '-')}`)}
                className={`
                 relative group cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br ${getTeamGradient(safeTeam)} border-t-4
                 ${getTeamColor(safeTeam)} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2
              `}
              >
                {/* Card Content */}
                <div className="relative z-10 p-5 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-heading text-4xl font-bold text-white/10 group-hover:text-white/20 transition-colors">
                      {driver.number || '#'}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/60 bg-white/5 px-2 py-1 rounded">
                      {safeTeam.split(' ')[0]}
                    </span>
                  </div>

                  <div className="mt-auto relative z-20">
                    <h3 className="font-heading text-xl text-white uppercase leading-none mb-1">{safeName.split(' ')[0]}</h3>
                    <h2 className="font-heading text-2xl text-white font-bold uppercase leading-none mb-2 text-primary-500">
                      {safeName.split(' ').length > 1 ? safeName.split(' ').slice(1).join(' ') : safeName}
                    </h2>
                    <div className="h-0.5 w-12 bg-white/20 mb-4 group-hover:w-full group-hover:bg-primary-500 transition-all duration-500"></div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-black/20 rounded p-2 backdrop-blur-sm">
                        <div className="text-[10px] text-gray-400 uppercase">PTS</div>
                        <div className="font-mono font-bold text-white">{driver.points || 0}</div>
                      </div>
                      <div className="bg-black/20 rounded p-2 backdrop-blur-sm">
                        <div className="text-[10px] text-gray-400 uppercase">WINS</div>
                        <div className="font-mono font-bold text-white">{driver.wins || 0}</div>
                      </div>
                      <div className="bg-black/20 rounded p-2 backdrop-blur-sm">
                        <div className="text-[10px] text-gray-400 uppercase">POD</div>
                        <div className="font-mono font-bold text-white">{driver.podiums || 0}</div>
                      </div>
                    </div>
                  </div>

                  {/* Driver Image Overlay */}
                  <div className={`absolute right-[-20px] top-10 w-2/3 h-full z-0 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ${driver.id === 'lindblad' ? 'mix-blend-multiply' : 'mix-blend-overlay group-hover:mix-blend-normal'}`}>
                    <img
                      src={driver.image}
                      alt={safeName}
                      className="w-full h-full object-cover object-top mask-image-gradient"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredDrivers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <User className="w-16 h-16 text-white/10 mb-4" />
          <h3 className="text-xl font-heading text-gray-400 uppercase">No drivers found</h3>
          <p className="text-gray-600">Try adjusting your search filters.</p>
        </div>
      )}
    </motion.div>
  );
};

export default DriversPage;
