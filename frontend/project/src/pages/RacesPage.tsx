import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Flag, CheckCircle } from 'lucide-react';
import { getRaces } from '../services';
import LoadingScreen from '../components/ui/LoadingScreen';
import { getRaceTrackImage } from '../utils/imageUtils';
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

  // The very first upcoming race (for highlighting)
  const nextRaceId = races.filter(r => !r.completed)[0]?.id;

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
        {filteredRaces.map((race, index) => {
          const isNextRace = race.id === nextRaceId;
          return (
          <motion.div
            key={race.id}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-xl"
            style={{
              background: race.completed ? '#0c0c10' : '#111116',
              border: isNextRace ? '1px solid rgba(225,6,0,0.5)' : race.completed ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: isNextRace ? '0 0 20px rgba(225,6,0,0.15)' : 'none',
              opacity: race.completed ? 0.85 : 1,
              transition: 'border-color 200ms ease-out, box-shadow 200ms ease-out, opacity 200ms ease-out',
            }}
          >
              {/* Header Image Area */}
              <div className="h-40 relative bg-white/5 flex items-center justify-center overflow-hidden">
                {/* Completed: checkered flag stripe */}
                {race.completed && (
                  <div className="absolute top-0 left-0 right-0 h-[3px] z-20" style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 8px, transparent 8px, transparent 16px)' }} />
                )}
                {/* Next Race: glowing top red stripe */}
                {isNextRace && (
                  <div className="absolute top-0 left-0 right-0 h-[3px] z-20 bg-gradient-to-r from-primary-600 via-primary-500 to-transparent" />
                )}

                {/* NEXT RACE badge */}
                {isNextRace && (
                  <div className="absolute top-3 right-3 z-20">
                    <span className="live-indicator text-[9px] tracking-[0.3em]">Next Race</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-10 pointer-events-none"></div>
                <img
                  src={getRaceTrackImage(race.round) || race.image}
                  alt={`${race.circuit} layout`}
                  className="object-contain h-full w-full relative z-0 opacity-80 invert mix-blend-screen group-hover:scale-105"
                  style={{ transition: 'transform 500ms ease-out' }}
                  onError={(e) => e.currentTarget.style.display = 'none'}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-0 right-0 p-3 z-10">
                  <span className="tabular-nums font-display text-5xl font-black text-white/[0.07] select-none">{String(race.round).padStart(2, '0')}</span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-10">
                  {race.completed ? (
                    <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-gray-500 border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">
                      <CheckCircle className="w-3 h-3" /> Finished
                    </span>
                  ) : !isNextRace && (
                    <span className="flex items-center gap-1 bg-primary-600/90 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest shadow-lg">
                      <Calendar className="w-3 h-3" /> Upcoming
                    </span>
                  )}
                </div>
              </div>

            {/* Content */}
            <div className="p-5 relative">
              <div className="mb-4">
                <div className="text-xs text-primary-500 font-bold uppercase tracking-widest mb-1">{race.country}</div>
                <h3
                  className="text-xl font-heading font-bold text-white uppercase leading-tight"
                  style={{ transition: 'color 200ms ease-out' }}
                >
                  {race.name.replace('Grand Prix', '')} <span className="text-white/30">GP</span>
                </h3>
                <p className="text-xs text-gray-600 mt-1 truncate font-mono">{race.circuit}</p>
              </div>

              <div className="grid grid-cols-2 gap-y-2 gap-x-2 border-t border-white/5 pt-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-gray-600" />
                  <span className="tabular-nums text-[11px] font-mono text-gray-400">{new Date(race.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                  <Clock className="w-3 h-3 text-gray-600" />
                  <span className="tabular-nums text-[11px] font-mono text-gray-400">{race.time || 'TBA'}</span>
                </div>
              </div>

              <Link
                to={`/races/${race.id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest border"
                style={{
                  background: race.completed ? 'transparent' : '#C10500',
                  borderColor: race.completed ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: race.completed ? '#9ca3af' : '#fff',
                  transition: 'background-color 200ms ease-out, color 200ms ease-out, border-color 200ms ease-out',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  if (race.completed) { el.style.color = '#fff'; el.style.borderColor = 'rgba(255,255,255,0.3)'; }
                  else { el.style.backgroundColor = '#A10400'; }
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  if (race.completed) { el.style.color = '#9ca3af'; el.style.borderColor = 'rgba(255,255,255,0.12)'; }
                  else { el.style.backgroundColor = '#C10500'; }
                }}
              >
                {race.completed ? 'Race Results' : 'Race Hub'} <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
          );
        })}
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