import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Flag, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';
import { RaceResult } from '../../types/f1.types';

interface RaceResultsCardProps {
    results: RaceResult[];
}

const RaceResultsCard: React.FC<RaceResultsCardProps> = ({ results }) => {
    // Take top 10 results
    const topResults = results.slice(0, 10);
    // Meta data
    const raceMeta = results.length > 0 ? results[0] : null;

    return (
        <div className="telemetry-card group h-full flex flex-col relative overflow-hidden">
            {/* Faint grid background */}
            <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-5 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-secondary-500" />
                    <h2 className="font-heading text-lg tracking-widest uppercase text-white">Race Classification</h2>
                </div>
                {raceMeta && (
                    <div className="flex flex-col items-end">
                        <span className="font-bold text-xs text-white uppercase">{raceMeta.raceName}</span>
                        <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {raceMeta.circuit}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[10px] font-mono uppercase text-gray-500 border-b border-white/10">
                            <th className="py-2 pl-2 font-normal">Pos</th>
                            <th className="py-2 font-normal">No</th>
                            <th className="py-2 font-normal">Driver</th>
                            <th className="py-2 font-normal">Team</th>
                            <th className="py-2 font-normal text-right">Time/Gap</th>
                            <th className="py-2 pr-2 font-normal text-right">Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topResults.map((result, index) => (
                            <motion.tr
                                key={index}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className={`
                                    border-b border-white/5 text-sm hover:bg-white/5 transition-colors group/row
                                    ${index === 0 ? 'bg-primary-900/10' : ''}
                                `}
                            >
                                <td className="py-2 pl-2">
                                    <span className={`font-mono font-bold w-6 inline-block ${index === 0 ? 'text-primary-500' : 'text-white'}`}>
                                        {result.position}
                                    </span>
                                </td>
                                <td className="py-2">
                                    <span className="font-mono text-xs text-gray-500">{result.number || '-'}</span>
                                </td>
                                <td className="py-2">
                                    <span className={`font-bold block ${index === 0 ? 'text-white' : 'text-gray-300 group-hover/row:text-white'}`}>
                                        {getDriverCode(result.driver)}
                                    </span>
                                </td>
                                <td className="py-2">
                                    <span className="text-xs text-secondary-400 truncate max-w-[100px] block">
                                        {result.team}
                                    </span>
                                </td>
                                <td className="py-2 text-right">
                                    <span className={`font-mono text-xs ${result.status === 'Finished' || result.time ? 'text-accent-400' : 'text-gray-500'}`}>
                                        {result.time || result.status}
                                    </span>
                                </td>
                                <td className="py-2 pr-2 text-right">
                                    <span className="font-mono font-bold text-white">{result.points}</span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
                {raceMeta && (
                    <div className="text-[10px] text-gray-500 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(raceMeta.date).toLocaleDateString()}
                    </div>
                )}
                <Link
                    to={`/race-results?season=${new Date().getFullYear()}&round=last`}
                    className="flex items-center gap-2 text-xs font-heading uppercase tracking-widest text-gray-400 hover:text-white transition-colors group/link"
                >
                    Full Analysis
                    <ChevronRight className="w-4 h-4 text-secondary-500 transition-transform group-hover/link:translate-x-1" />
                </Link>
            </div>
        </div>
    );
};

// Helper to extract driver code (e.g. Lewis Hamilton -> HAM)
const getDriverCode = (name: string) => {
    if (!name) return 'UNK';
    const parts = name.split(' ');
    if (parts.length > 1) {
        return parts[parts.length - 1].substring(0, 3).toUpperCase();
    }
    return name.substring(0, 3).toUpperCase();
};

export default RaceResultsCard;
