import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ChevronRight } from 'lucide-react';
import { DriverStanding } from '../../types/f1.types';

interface DriverStandingsCardProps {
    drivers: DriverStanding[];
}

const DriverStandingsCard: React.FC<DriverStandingsCardProps> = ({ drivers }) => {
    // Take top 5
    const topDrivers = drivers.slice(0, 5);

    return (
        <div className="telemetry-card group flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary-500" />
                    <h2 className="font-heading text-lg tracking-widest uppercase text-white">Driver Championships</h2>
                </div>
                <span className="font-mono text-xs text-primary-500 border border-primary-500/30 px-2 py-0.5 rounded bg-primary-900/20">
                    SEASON {new Date().getFullYear()}
                </span>
            </div>

            <div className="flex-1 space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs font-mono text-gray-500 uppercase tracking-wider mb-2 px-3">
                    <div className="col-span-1">Pos</div>
                    <div className="col-span-6">Driver / Team</div>
                    <div className="col-span-3 text-right">Points</div>
                    <div className="col-span-2 text-center">Wins</div>
                </div>

                {topDrivers.map((driver, index) => (
                    <motion.div
                        key={driver.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`
                            grid grid-cols-12 gap-2 items-center p-3 rounded border transition-all duration-300 relative overflow-hidden
                            ${index === 0
                                ? 'bg-gradient-to-r from-primary-900/40 to-transparent border-primary-500/50 hover:border-primary-500'
                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                            }
                        `}
                    >
                        {/* Position */}
                        <div className="col-span-1 font-heading text-lg text-white">
                            {driver.position}
                        </div>

                        {/* Driver Info */}
                        <div className="col-span-6">
                            <Link to={`/drivers/${driver.id}`} className="block group-hover:text-primary-500 transition-colors">
                                <div className="font-bold text-sm text-white truncate">{driver.name}</div>
                                <div className="text-xs text-gray-400 truncate">{driver.team}</div>
                            </Link>
                        </div>

                        {/* Points */}
                        <div className="col-span-3 text-right">
                            <span className="font-mono text-lg font-bold text-white tracking-tight">{driver.points}</span>
                            <span className="text-[10px] text-gray-500 ml-1">PTS</span>
                        </div>

                        {/* Wins */}
                        <div className="col-span-2 flex justify-center">
                            {driver.wins > 0 ? (
                                <span className={`flex items-center gap-1 font-bold ${index === 0 ? 'text-primary-500' : 'text-gray-300'}`}>
                                    <Trophy className="w-3 h-3" />
                                    {driver.wins}
                                </span>
                            ) : (
                                <span className="text-gray-600">-</span>
                            )}
                        </div>

                        {/* Active Indicator Line */}
                        {index === 0 && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                <Link
                    to="/standings"
                    className="flex items-center gap-2 text-xs font-heading uppercase tracking-widest text-gray-400 hover:text-white transition-colors group/link"
                >
                    Full Standings
                    <ChevronRight className="w-4 h-4 text-primary-500 transition-transform group-hover/link:translate-x-1" />
                </Link>
            </div>
        </div>
    );
};

export default DriverStandingsCard;
