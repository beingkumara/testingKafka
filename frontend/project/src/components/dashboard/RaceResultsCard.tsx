import React from 'react';
import { motion } from 'framer-motion';
import { Flag, Timer, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RaceResult } from '../../types/f1.types';

interface RaceResultsCardProps {
    results: RaceResult[];
}

const RaceResultsCard: React.FC<RaceResultsCardProps> = ({ results }) => {
    // Show top 5 results
    const topResults = results.slice(0, 5);
    const raceName = results.length > 0 ? results[0].raceName : "Recent Race";
    const raceDate = results.length > 0 ? new Date(results[0].date).toLocaleDateString() : "";

    return (
        <div className="telemetry-card group h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Flag className="h-5 w-5 text-primary-500" />
                    <div className="flex flex-col">
                        <h2 className="font-heading text-lg tracking-widest uppercase text-white">Last Race Results</h2>
                        <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{raceName} • {raceDate}</span>
                    </div>
                </div>
            </div>

            {results.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-500 font-mono text-sm">
                    No race data available
                </div>
            ) : (
                <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-12 gap-2 text-xs font-mono text-gray-500 uppercase tracking-wider mb-2 px-3">
                        <div className="col-span-1">Pos</div>
                        <div className="col-span-6">Driver</div>
                        <div className="col-span-3 text-right">Time</div>
                        <div className="col-span-2 text-center">Pts</div>
                    </div>

                    {topResults.map((result, index) => (
                        <motion.div
                            key={`${result.driver}-${index}`}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`
                                grid grid-cols-12 gap-2 items-center p-3 rounded border transition-all duration-300 relative overflow-hidden
                                ${index < 3
                                    ? 'bg-white/5 border-white/10 hover:border-primary-500/50'
                                    : 'bg-transparent border-white/5 hover:bg-white/5'
                                }
                            `}
                        >
                            {/* Position */}
                            <div className={`col-span-1 font-heading text-lg ${index === 0 ? 'text-primary-500' : 'text-white'}`}>
                                {result.position}
                            </div>

                            {/* Driver Info */}
                            <div className="col-span-6">
                                <span className="block font-bold text-sm text-white truncate">{result.driver}</span>
                                <span className="text-xs text-gray-400 truncate">{result.team}</span>
                            </div>

                            {/* Time */}
                            <div className="col-span-3 text-right">
                                <div className="flex items-center justify-end gap-1 text-xs text-gray-300 font-mono">
                                    {index === 0 ? <Timer className="w-3 h-3 text-primary-500" /> : null}
                                    {result.time || result.status}
                                </div>
                            </div>

                            {/* Points */}
                            <div className="col-span-2 text-center">
                                <span className={`font-mono font-bold ${result.points > 0 ? 'text-white' : 'text-gray-600'}`}>
                                    {result.points}
                                </span>
                            </div>

                            {/* Podium Indicator */}
                            {index === 0 && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                <Link
                    to="/results"
                    className="flex items-center gap-2 text-xs font-heading uppercase tracking-widest text-gray-400 hover:text-white transition-colors group/link"
                >
                    Full Results
                    <ChevronRight className="w-4 h-4 text-primary-500 transition-transform group-hover/link:translate-x-1" />
                </Link>
            </div>
        </div>
    );
};

export default RaceResultsCard;
