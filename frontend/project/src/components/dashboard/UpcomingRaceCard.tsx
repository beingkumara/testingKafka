import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ChevronRight, Timer } from 'lucide-react';
import { Race } from '../../types/f1.types';

interface UpcomingRaceCardProps {
    races: Race[];
}

const UpcomingRaceCard: React.FC<UpcomingRaceCardProps> = ({ races }) => {
    const upcomingRaces = races.filter(race => !race.completed);
    const nextRace = upcomingRaces.length > 0 ? upcomingRaces[0] : null;
    const subsequentRaces = upcomingRaces.slice(1, 4);

    if (!nextRace) return (
        <div className="telemetry-card flex items-center justify-center p-8">
            <span className="text-gray-500 font-mono">SEASON COMPLETE</span>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* NEXT GP HERO CARD */}
            <div className="telemetry-card relative overflow-hidden group">
                {/* Background Image / Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900/20 z-0"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10 p-1">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="inline-block px-2 py-0.5 rounded bg-primary-600 text-white text-[10px] font-bold tracking-widest uppercase mb-2 shadow-glow-red animate-pulse-slow">
                                NEXT GRAND PRIX
                            </span>
                            <h2 className="font-heading text-2xl text-white uppercase leading-tight max-w-[200px] drop-shadow-lg">
                                {nextRace.name.replace('Grand Prix', '')} <span className="text-primary-500">GP</span>
                            </h2>
                        </div>
                        <div className="text-right">
                            <div className="font-mono text-3xl font-bold text-white tracking-tighter">
                                {new Date(nextRace.date).getDate()}
                            </div>
                            <div className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                                {new Date(nextRace.date).toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                        </div>
                    </div>

                    {/* Circuit Map Placeholder */}
                    <div className="h-48 relative flex items-center justify-center my-4 group-hover:scale-105 transition-transform duration-700">
                        {/* We would ideally use the circuit image here if available, otherwise a placeholder */}
                        <img
                            src={nextRace.image || '/images/circuits/placeholder.png'}
                            alt={nextRace.circuit}
                            className="max-h-full max-w-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] invert opacity-80"
                            onError={(e) => {
                                // Fallback if image fails
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                        {!nextRace.image && (
                            <div className="text-gray-600 font-mono text-xs border border-gray-700 p-4 rounded bg-dark-800/50 backdrop-blur-sm">
                                [CIRCUIT MAP DATA UNAVAILABLE]
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 border-t border-white/10 pt-4">
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-primary-500" />
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Qualifying</div>
                                <div className="font-mono text-sm text-white">SAT 14:00</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Flag className="w-4 h-4 text-accent-500" />
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Race</div>
                                <div className="font-mono text-sm text-white">SUN {nextRace.time || '15:00'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Countdown / CTA */}
                    <div className="mt-6">
                        <Link
                            to={`/races/${nextRace.id}`}
                            className="w-full btn-primary text-center block"
                        >
                            Race Hub
                        </Link>
                    </div>
                </div>
            </div>

            {/* UPCOMING LIST */}
            <div className="telemetry-card">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                    <h3 className="font-heading text-sm text-white uppercase tracking-widest">Calendar</h3>
                    <Link to="/races" className="text-primary-500 hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></Link>
                </div>

                <div className="space-y-4">
                    {subsequentRaces.map((race) => (
                        <div key={race.id} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-center justify-center w-10 h-10 rounded bg-dark-800 border border-white/10 group-hover:border-primary-500 transition-colors">
                                    <span className="font-mono text-xs text-gray-400 uppercase">{new Date(race.date).toLocaleDateString('en-US', { month: 'short' }).substring(0, 3)}</span>
                                    <span className="font-mono text-sm font-bold text-white">{new Date(race.date).getDate()}</span>
                                </div>
                                <div>
                                    <div className="font-bold text-xs text-white uppercase group-hover:text-primary-500 transition-colors">{race.country}</div>
                                    <div className="text-[10px] text-gray-500 truncate max-w-[120px]">{race.circuit}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-mono text-xs text-gray-500 block">R{race.round}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UpcomingRaceCard;
