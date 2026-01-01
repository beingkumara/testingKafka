import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { getRaceResultsByYearAndRound } from '../services/f1/f1Service';
import { RaceResult } from '../types/f1.types';
import LoadingScreen from '../components/ui/LoadingScreen';
import {
  Flag,
  Trophy,
  Calendar,
  MapPin,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const RaceResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [year, setYear] = useState<number>(
    searchParams.get('season')
      ? parseInt(searchParams.get('season') as string, 10)
      : 2025
  );
  const [round, setRound] = useState<number>(
    searchParams.get('round')
      ? parseInt(searchParams.get('round') as string, 10)
      : 1
  );
  const [results, setResults] = useState<RaceResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [raceName, setRaceName] = useState<string>('');
  const [circuit, setCircuit] = useState<string>('');

  const [fastestLap, setFastestLap] = useState<{ driver: string, time: string } | null>(null);
  const [apiCalled, setApiCalled] = useState<boolean>(false);

  // Generate year options from 2025 down to 1951
  const years = Array.from({ length: 2025 - 1951 + 1 }, (_, i) => 2025 - i);

  // Update URL when year or round changes
  useEffect(() => {
    if (apiCalled) {
      setSearchParams({ season: year.toString(), round: round.toString() }, { replace: true });
    }
  }, [year, round, apiCalled, setSearchParams]);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRaceResultsByYearAndRound(year, round);
      setResults(data);

      // Assuming the API returns race name or we can set it based on round
      setRaceName(data.length > 0 && data[0].raceName ? data[0].raceName : `Round ${round}`);
      setCircuit(data.length > 0 && data[0].circuit ? data[0].circuit : 'Unknown Circuit');



      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].fastestLap && data[i].fastestLap !== 'N/A') {
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
  }, [year, round]);

  // Fetch results when the component mounts
  useEffect(() => {
    const hasSeason = searchParams.has('season');
    const hasRound = searchParams.has('round');

    if (hasSeason && hasRound) {
      setApiCalled(true);
      fetchResults();
    } else {
      setApiCalled(true);
      setSearchParams({ season: '2025', round: '1' }, { replace: true });
    }
  }, [fetchResults, searchParams, setSearchParams]);

  // Handle changes to search params
  useEffect(() => {
    if (searchParams.has('season') && searchParams.has('round') && apiCalled) {
      fetchResults();
    }
  }, [searchParams, apiCalled, fetchResults]);

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
      {/* Filters Header */}
      <div className="mb-8 container-f1 flex flex-col lg:flex-row justify-between items-end gap-6 bg-dark-800/50 p-6 rounded-lg border border-white/5">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white uppercase italic mb-2">Race <span className="text-primary-500">Results</span></h1>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-transparent text-white font-mono border-b border-white/20 focus:border-primary-500 outline-none pb-1"
              >
                {years.map(y => <option key={y} value={y} className="bg-dark-900">{y}</option>)}
              </select>
            </div>
            <div className="h-4 w-[1px] bg-white/10"></div>
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-gray-500" />
              <div className="flex items-center gap-2">
                <button onClick={() => navigateRound('prev')} disabled={round === 1} className="hover:text-primary-500 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-white">Round {round}</span>
                <button onClick={() => navigateRound('next')} disabled={round === 24} className="hover:text-primary-500 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="font-heading text-xl text-white font-bold uppercase">{raceName}</div>
          <div className="text-xs text-gray-500 flex items-center justify-end gap-2 mt-1">
            <MapPin className="w-3 h-3" /> {circuit}
          </div>
        </div>
      </div>

      {error ? (
        <div className="container-f1 flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="h-12 w-12 text-primary-500 mb-4" />
          <h3 className="text-xl font-heading text-white uppercase mb-2">Data Unavailable</h3>
          <p className="text-gray-500 mb-6 max-w-md">{error}</p>
          <button onClick={() => fetchResults()} className="btn-primary">Retry Telemetry</button>
        </div>
      ) : (
        <div className="container-f1">
          {/* Summary Stats */}
          {fastestLap && (
            <div className="mb-6 flex justify-end">
              <div className="inline-flex items-center gap-3 bg-purple-900/20 border border-purple-500/30 px-4 py-2 rounded-full">
                <span className="text-[10px] uppercase font-bold text-purple-400 tracking-widest">Fastest Lap</span>
                <span className="w-[1px] h-3 bg-purple-500/30"></span>
                <div className="text-sm text-white font-bold">{fastestLap.driver} <span className="font-mono text-purple-300 ml-1">{fastestLap.time}</span></div>
              </div>
            </div>
          )}

          <div className="telemetry-card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                    <th className="p-4 w-16 text-center">Pos</th>
                    <th className="p-4">Driver</th>
                    <th className="p-4">Team</th>
                    <th className="p-4 text-right">Time/Gap</th>
                    <th className="p-4 text-right">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {results.map((result, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={`hover:bg-white/5 transition-colors ${index < 3 ? 'bg-primary-900/5' : ''}`}
                    >
                      <td className="p-4 text-center">
                        <span className={`font-mono font-bold ${index === 0 ? 'text-primary-500 text-lg' : 'text-white'}`}>
                          {result.position}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Trophy className="w-4 h-4 text-primary-500" />}
                          <span className={`font-bold ${index === 0 ? 'text-white' : 'text-gray-300'}`}>{result.driver}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">{result.team}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-mono text-sm ${!result.time || result.time === 'DNF' ? 'text-primary-500' : 'text-gray-300'}`}>
                          {result.time || result.status || 'DNF'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-mono font-bold text-white">{result.points}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {results.length === 0 && !loading && (
              <div className="p-12 text-center text-gray-500">
                <Flag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="uppercase tracking-widest text-sm">No timing data available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RaceResultsPage;