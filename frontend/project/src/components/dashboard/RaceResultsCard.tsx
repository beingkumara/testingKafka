import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Flag, MapPin, Trophy, Medal, Calendar } from 'lucide-react';
import { RaceResult } from '../../types/f1.types';

interface RaceResultsCardProps {
    results: RaceResult[];
}

const RaceResultsCard: React.FC<RaceResultsCardProps> = ({ results }) => {
    // Take top 10 results
    const topResults = results.slice(0, 10);
    // Assuming all results are from the same race for now, or use the first one to get metadata
    const raceMeta = results.length > 0 ? results[0] : null;

    return (
        <div className="card overflow-visible shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6 border-b dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-800/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary-500" />
                            <span>Last Race Results</span>
                        </h2>
                        {raceMeta && (
                            <div className="flex items-center gap-4 mt-1 text-secondary-600 dark:text-secondary-300">
                                <div className="flex items-center gap-1">
                                    <Flag className="h-4 w-4 text-primary-500" />
                                    <span>{raceMeta.raceName || 'Latest Race'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-secondary-500" />
                                    <span>{raceMeta.circuit}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    {raceMeta && (
                        <div className="bg-secondary-100 dark:bg-secondary-700 rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-primary-500" />
                            <span>{new Date(raceMeta.date).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm border-b dark:border-secondary-700 bg-secondary-100 dark:bg-secondary-800/30">
                                <th className="p-3 font-medium">Pos</th>
                                <th className="p-3 font-medium">Driver</th>
                                <th className="p-3 font-medium">Team</th>
                                <th className="p-3 font-medium">Time</th>
                                <th className="p-3 font-medium text-right">Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topResults.map((result, index) => (
                                <motion.tr
                                    key={index}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className={`border-b dark:border-secondary-700 last:border-0 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors ${index < 3 ? 'bg-secondary-50/50 dark:bg-secondary-800/20' : ''
                                        }`}
                                >
                                    <td className="p-3">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${result.position === 1
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
                                    <td className="p-3 font-mono text-sm">
                                        {result.time || result.status || 'DNF'}
                                    </td>
                                    <td className="p-3 text-right">
                                        <span className={`font-mono font-bold text-lg ${result.points > 0 ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-400'
                                            }`}>
                                            {result.points}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-center">
                    <Link
                        to={`/race-results?season=${new Date().getFullYear()}&round=1`}
                        className="btn btn-primary btn-sm flex items-center gap-2 px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                        <Flag className="h-4 w-4" />
                        View Complete Race Results
                    </Link>
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
    );
};

export default RaceResultsCard;
