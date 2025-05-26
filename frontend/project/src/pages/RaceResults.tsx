import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getRaceResultsByYearAndRound } from '../services/f1/f1Service';
import { RaceResult } from '../types/f1.types';
import LoadingScreen from '../components/ui/LoadingScreen';
import { Activity, TrendingUp } from 'lucide-react';

const RaceResultsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [round, setRound] = useState<number>(1);
  const [results, setResults] = useState<RaceResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [raceName, setRaceName] = useState<string>('');
  const [circuit, setCircuit] = useState<string>('');

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
      } catch (err) {
        setError('Failed to load race results. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [year, round]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Race Results</h1>
        <p className="text-secondary-600 dark:text-secondary-300">
          {year} Season - Round {round}
        </p>
      </div>

      <div className="card mb-8 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium mb-1 text-secondary-600 dark:text-secondary-300">
              Season
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="input py-2 px-3"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium mb-1 text-secondary-600 dark:text-secondary-300">
              Round
            </label>
            <select
              value={round}
              onChange={(e) => setRound(Number(e.target.value))}
              className="input py-2 px-3"
            >
              {rounds.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div className="card p-4 text-center text-red-500">
          {error}
        </div>
      ) : (
        <div className="card overflow-visible">
          <div className="p-6 border-b dark:border-secondary-600">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{raceName}</h2>
              <Activity className="h-5 w-5 text-primary-500" />
            </div>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
              {circuit}
            </p>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-secondary-500 dark:text-secondary-400">
                    <th className="pb-3 font-medium">Pos</th>
                    <th className="pb-3 font-medium">Driver</th>
                    <th className="pb-3 font-medium">Team</th>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium text-right">Pts</th>
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
                        className="border-b dark:border-secondary-700 last:border-0"
                      >
                        <td className="py-3 text-center">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium ${
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
                        <td className="py-3 font-medium">{result.driver}</td>
                        <td className="py-3">{result.team}</td>
                        <td className="py-3 font-mono text-sm">{result.time || 'DNF'}</td>
                        <td className="py-3 text-right font-mono font-medium">{result.points}</td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-3 text-center text-secondary-500">
                        No results found for this race.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RaceResultsPage;