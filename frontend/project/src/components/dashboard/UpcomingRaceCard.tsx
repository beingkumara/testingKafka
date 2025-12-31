import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Race } from '../../types/f1.types';

interface UpcomingRaceCardProps {
    races: Race[];
}

const UpcomingRaceCard: React.FC<UpcomingRaceCardProps> = ({ races }) => {
    // Filter for upcoming races only
    const upcomingRaces = races.filter(race => !race.completed);
    const nextRace = upcomingRaces.length > 0 ? upcomingRaces[0] : null;
    const subsequentRaces = upcomingRaces.slice(0, 3); // Top 3 including next race (but we might split them visually)

    return (
        <div className="space-y-6">
            {/* Next Race Card */}
            {nextRace && (
                <div className="card overflow-visible">
                    <div className="h-40 relative flex items-center justify-center bg-white">
                        <img
                            src={nextRace.image}
                            alt={`${nextRace.name} layout`}
                            className="object-contain h-full w-full"
                            style={{ background: 'white' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/60 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 p-4 text-white">
                            <span className="inline-block bg-primary-500 text-white text-xs px-2 py-1 rounded-md font-medium mb-2">NEXT RACE</span>
                            <h3 className="text-xl font-bold">{nextRace.name}</h3>
                            <p className="text-secondary-200">{nextRace.circuit}</p>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center py-2 border-b dark:border-secondary-700">
                            <Calendar className="h-5 w-5 text-primary-500 mr-3" />
                            <div>
                                <p className="text-sm text-secondary-500 dark:text-secondary-400">Date</p>
                                <p className="font-medium">
                                    {new Date(nextRace.date).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center py-2 border-b dark:border-secondary-700">
                            <Clock className="h-5 w-5 text-primary-500 mr-3" />
                            <div>
                                <p className="text-sm text-secondary-500 dark:text-secondary-400">Time</p>
                                <p className="font-medium">{nextRace.time ? nextRace.time : '--'} GMT</p>
                            </div>
                        </div>
                        <div className="flex items-center py-2">
                            <MapPin className="h-5 w-5 text-primary-500 mr-3" />
                            <div>
                                <p className="text-sm text-secondary-500 dark:text-secondary-400">Location</p>
                                <p className="font-medium">{nextRace.country}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link to={`/races/${nextRace.id}`} className="btn btn-primary w-full">
                                View Race Details
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Upcoming Races List */}
            <div className="card overflow-visible">
                <div className="p-6 border-b dark:border-secondary-600">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Upcoming Races</h2>
                    </div>
                </div>

                <div className="divide-y dark:divide-secondary-700">
                    {subsequentRaces.map((race, index) => (
                        <motion.div
                            key={race.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="p-4 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors"
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0 mr-4">
                                    <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-700 rounded-lg flex items-center justify-center text-xl font-mono font-bold">
                                        {new Date(race.date).getDate()}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold">{race.name}</h3>
                                    <p className="text-secondary-600 dark:text-secondary-400 text-sm">{race.circuit}</p>
                                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                                        {new Date(race.date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="p-4 text-center">
                    <Link to="/races" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                        View full race calendar
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UpcomingRaceCard;
