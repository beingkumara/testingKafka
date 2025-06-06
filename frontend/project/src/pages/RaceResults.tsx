import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getRaceResultsByYearAndRound } from '../services/f1/f1Service';
import { RaceResult } from '../types/f1.types';
import LoadingScreen from '../components/ui/LoadingScreen';
import { 
  Activity, 
  TrendingUp, 
  Flag, 
  Trophy, 
  Clock, 
  Calendar, 
  MapPin, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Medal
} from 'lucide-react';

const RaceResultsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [round, setRound] = useState<number>(1);
  const [results, setResults] = useState<RaceResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [raceName, setRaceName] = useState<string>('');
  const [circuit, setCircuit] = useState<string>('');
  const [raceDate, setRaceDate] = useState<string>('');
  const [fastestLap, setFastestLap] = useState<{driver: string, time: string} | null>(null);

  // Generate year options from 2025 down to 1951
  const years = Array.from({ length: 2025 - 1951 + 1 }, (_, i) => 2025 - i);
  
  // Generate round options from 1 to 24
  const rounds = Array.from({ length: 24 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRaceResultsByYearAndRound(year, round);
        setResults(data);
        
        // Assuming the API returns race name or we can set it based on round
        setRaceName(data.length > 0 && data[0].raceName ? data[0].raceName : `Round ${round}`);
        setCircuit(data.length > 0 && data[0].circuit ? data[0].circuit : 'Unknown Circuit');
        
        // Set mock race date for UI demonstration
        setRaceDate(data[0].date);     
        if (data.length > 0) {
          for(let i = 0; i < data.length; i++) {
            if(data[i].fastestLap && data[i].fastestLap !== 'N/A') {
              setFastestLap({
                driver: data[i].driver,
                time: data[i].fastestLap,
              });
              break;
            }
          }
        } else {
          setFastestLap(null);
        }
      } catch (err) {
        setError('Failed to load race results. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [year, round]);

  const navigateRound = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && round > 1) {
      setRound(round - 1);
    } else if (direction === 'next' && round < 24) {
      setRound(round + 1);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-12"
    >
      <div className="relative mb-12 bg-gradient-to-r from-secondary-800 to-secondary-900 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-opacity-50 bg-black"></div>
        <div className="relative z-10 px-6 py-12 md:py-16 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Race Results</h1>
          <p className="text-xl text-secondary-200 max-w-2xl">
            Detailed race results from every Formula 1 Grand Prix.
          </p>
          
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary-400" />
              <span className="text-secondary-200">Season:</span>
            </div>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-secondary-700 border border-secondary-600 text-white rounded-md px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            
            <div className="flex items-center space-x-2 ml-4">
              <Flag className="h-5 w-5 text-primary-400" />
              <span className="text-secondary-200">Round:</span>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => navigateRound('prev')}
                disabled={round === 1}
                className="bg-secondary-700 border border-secondary-600 text-white rounded-l-md px-2 py-1.5 hover:bg-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <select
                value={round}
                onChange={(e) => setRound(Number(e.target.value))}
                className="bg-secondary-700 border-y border-secondary-600 text-white px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500"
              >
                {rounds.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <button 
                onClick={() => navigateRound('next')}
                disabled={round === 24}
                className="bg-secondary-700 border border-secondary-600 text-white rounded-r-md px-2 py-1.5 hover:bg-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500"></div>
      </div>

      {error ? (
        <div className="card p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-red-500 mb-2">Error Loading Results</h3>
            <p className="text-secondary-600 dark:text-secondary-300 mb-6">
              {error}
            </p>
            <button 
              onClick={() => fetchResults()}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="card overflow-visible shadow-lg mb-8">
            <div className="p-6 border-b dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-800/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Flag className="h-6 w-6 text-primary-500" />
                    {raceName}
                  </h2>
                  <div className="flex items-center gap-4 mt-2 text-secondary-600 dark:text-secondary-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{circuit}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{raceDate}</span>
                    </div>
                  </div>
                </div>
                
                {fastestLap && (
                  <div className="bg-secondary-100 dark:bg-secondary-700 rounded-lg p-3 flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400">Fastest Lap</div>
                      <div className="font-medium">{fastestLap.driver}</div>
                      <div className="text-sm font-mono text-purple-500">{fastestLap.time}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b dark:border-secondary-700 bg-secondary-100 dark:bg-secondary-800/30">
                      <th className="p-3 font-medium">Pos</th>
                      <th className="p-3 font-medium">Driver</th>
                      <th className="p-3 font-medium">Team</th>
                      <th className="p-3 font-medium">Time / Status</th>
                      <th className="p-3 font-medium text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.length > 0 ? (
                      results.map((result, index) => (
                        <motion.tr 
                          key={index}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`border-b dark:border-secondary-700 last:border-0 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors ${
                            index < 3 ? 'bg-secondary-50/50 dark:bg-secondary-800/20' : ''
                          }`}
                        >
                          <td className="p-3">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                              result.position === 1 
                                ? 'bg-primary-500 text-white' 
                                : result.position === 2
                                ? 'bg-secondary-300 dark:bg-secondary-600 text-secondary-800 dark:text-white'
                                : result.position === 3
                                ? 'bg-accent-400 dark:bg-accent-600 text-secondary-800 dark:text-white'
                                : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-white'
                            }`}>
                              {result.position}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {result.position === 1 && <Trophy className="h-4 w-4 text-primary-500" />}
                              {result.position === 2 && <Medal className="h-4 w-4 text-secondary-400" />}
                              {result.position === 3 && <Medal className="h-4 w-4 text-accent-500" />}
                              <span className="font-medium">{result.driver}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-700">
                              {result.team}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`font-mono text-sm ${!result.time || result.time === 'DNF' ? 'text-red-500' : ''}`}>
                              {result.time || result.status || 'DNF'}
                            </span>
                            {result.status && result.status !== 'Finished' && (
                              <span className="ml-2 px-2 py-0.5 rounded text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                {result.status}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <span className={`font-mono font-bold text-lg ${
                              result.points > 0 ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-400'
                            }`}>
                              {result.points}
                            </span>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Activity className="h-10 w-10 text-secondary-400 mb-3" />
                            <p className="text-secondary-500 dark:text-secondary-400 text-lg mb-1">
                              No results found for this race
                            </p>
                            <p className="text-secondary-400 text-sm">
                              Try selecting a different round or season
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-4 border-t dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50">
              <div className="flex flex-wrap gap-4 justify-center text-sm text-secondary-500 dark:text-secondary-400">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                  <span>1st Place</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-secondary-300 dark:bg-secondary-600"></div>
                  <span>2nd Place</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-accent-400 dark:bg-accent-600"></div>
                  <span>3rd Place</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Link 
              to="/standings" 
              className="btn btn-outline flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              View Standings
            </Link>
            
            <div className="flex gap-2">
              <button 
                onClick={() => navigateRound('prev')}
                disabled={round === 1}
                className="btn btn-outline flex items-center gap-1 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Race
              </button>
              <button 
                onClick={() => navigateRound('next')}
                disabled={round === 24}
                className="btn btn-outline flex items-center gap-1 disabled:opacity-50"
              >
                Next Race
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default RaceResultsPage;