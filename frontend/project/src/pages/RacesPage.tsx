import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Flag, CheckCircle } from 'lucide-react';
import { getRaces } from '../services';
import LoadingScreen from '../components/ui/LoadingScreen';
import { Link } from 'react-router-dom';
import { Race } from '../types/f1.types';

const RacesPage: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [filteredRaces, setFilteredRaces] = useState<Race[]>([]);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const data = await getRaces();
        setRaces(data);
      } catch (error) {
        console.error('Error fetching races:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRaces();
  }, []);

  useEffect(() => {
    const upcoming = races.filter(race => !race.completed);
    const completed = races.filter(race => race.completed).reverse(); // Most recent completed first
    setFilteredRaces(activeTab === 'upcoming' ? upcoming : completed);
  }, [races, activeTab]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-12"
    >
      <div className="mb-8 container-f1 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-heading font-bold text-white uppercase italic mb-2">Race <span className="text-primary-500">Calendar</span></h1>
          <p className="text-gray-400">
            Official schedule and results for the {new Date().getFullYear()} Formula 1 World Championship.
          </p>
        </div>

        <div className="flex bg-dark-800 p-1 rounded border border-white/5">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'upcoming' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'completed' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="container-f1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRaces.map((race, index) => (
          <motion.div
            key={race.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`
                group relative overflow-hidden rounded-lg border transition-all duration-300
                ${race.completed
                ? 'bg-dark-900 border-white/5 hover:border-white/10 opacity-80 hover:opacity-100'
                : 'bg-dark-800 border-white/10 hover:border-primary-500 hover:shadow-2xl hover:shadow-primary-900/20'
              }
            `}
          >
            {/* Header Image Area */}
            <div className="h-40 relative bg-white flex items-center justify-center p-4 overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-10"></div>
              <img
                src={race.image}
                alt={`${race.circuit} layout`}
                className="object-contain h-full w-full relative z-10 transition-transform duration-500 group-hover:scale-105"
                onError={(e) => e.currentTarget.style.display = 'none'}
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-0 right-0 p-3">
                <span className="font-mono text-4xl font-bold text-black/20 select-none">{String(race.round).padStart(2, '0')}</span>
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                {race.completed ? (
                  <span className="flex items-center gap-1 bg-gray-900/10 backdrop-blur-sm text-gray-600 border border-gray-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">
                    <CheckCircle className="w-3 h-3" /> Finished
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-primary-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    <Calendar className="w-3 h-3" /> Upcoming
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 relative">
              <div className="mb-4">
                <div className="text-xs text-primary-500 font-bold uppercase tracking-widest mb-1">{race.country}</div>
                <h3 className="text-xl font-heading font-bold text-white uppercase leading-tight group-hover:text-primary-500 transition-colors">
                  {race.name.replace('Grand Prix', '')} <span className="text-white/40">GP</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1 truncate">{race.circuit}</p>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-t border-white/5 pt-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-mono text-gray-300">{new Date(race.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-mono text-gray-300">{race.time || 'TBA'}</span>
                </div>
              </div>

              <Link
                to={`/races/${race.id}`}
                className={`
                        w-full flex items-center justify-center gap-2 py-2 rounded text-xs font-bold uppercase tracking-widest border transition-all
                        ${race.completed
                    ? 'border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                    : 'bg-primary-600 border-transparent text-white hover:bg-primary-700'
                  }
                    `}
              >
                {race.completed ? 'Results' : 'Race Hub'} <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRaces.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <Flag className="w-12 h-12 text-gray-500 mb-4" />
          <p className="text-gray-400 uppercase tracking-widest">No races found</p>
        </div>
      )}
    </motion.div>
  );
};

export default RacesPage;