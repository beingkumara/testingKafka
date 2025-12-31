import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, TrendingUp } from 'lucide-react';
import { DriverStanding } from '../../types/f1.types';

interface DriverStandingsCardProps {
    drivers: DriverStanding[];
}

const DriverStandingsCard: React.FC<DriverStandingsCardProps> = ({ drivers }) => {
    // Take top 5
    const topDrivers = drivers.slice(0, 5);

    return (
        <div className="card overflow-visible shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6 border-b dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-800/50">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary-500" />
                        <span>Driver Standings</span>
                    </h2>
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium rounded-full">
                        {new Date().getFullYear()} Season
                    </span>
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
                                <th className="p-3 font-medium text-right">Points</th>
                                <th className="p-3 font-medium text-center">Wins</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topDrivers.map((driver, index) => (
                                <motion.tr
                                    key={driver.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className={`border-b dark:border-secondary-700 last:border-0 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors ${index < 3 ? 'bg-secondary-50/50 dark:bg-secondary-800/20' : ''
                                        }`}
                                >
                                    <td className="p-3">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${driver.position === 1
                                                ? 'bg-primary-500 text-white'
                                                : driver.position === 2
                                                    ? 'bg-secondary-300 dark:bg-secondary-600 text-secondary-800 dark:text-white'
                                                    : driver.position === 3
                                                        ? 'bg-accent-400 dark:bg-accent-600 text-secondary-800 dark:text-white'
                                                        : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-white'
                                            }`}>
                                            {driver.position}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <Link to={`/drivers/${driver.id}`} className="font-medium hover:text-primary-500 transition-colors flex items-center gap-2">
                                            {driver.position === 1 && <Award className="h-4 w-4 text-primary-500" />}
                                            {driver.name}
                                        </Link>
                                    </td>
                                    <td className="p-3">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-700">
                                            {driver.team}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right font-mono font-bold text-lg">{driver.points}</td>
                                    <td className="p-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Award className="h-4 w-4 text-primary-500" />
                                            <span className="font-mono">{driver.wins}</span>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-center">
                    <Link
                        to="/standings"
                        className="btn btn-primary btn-sm flex items-center gap-2 px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                        <TrendingUp className="h-4 w-4" />
                        View Complete Standings
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DriverStandingsCard;
