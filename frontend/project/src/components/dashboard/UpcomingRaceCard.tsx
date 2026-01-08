import React from 'react';

import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Race } from '../../types/f1.types';
import WeatherCard from '../WeatherCard';
import { getRaceTrackImage } from '../../utils/imageUtils';

interface UpcomingRaceCardProps {
    races: Race[];
}

const UpcomingRaceCard: React.FC<UpcomingRaceCardProps> = ({ races }) => {
    // Filter for future races and take the next few
    // Assuming 'races' passed in are already sorted or filtered by the hook, but let's be safe if we had full list
    // Ideally the hook provides upcoming races. Let's assume the passed 'races' list starts with the next upcoming race.
    const upcomingRaces = races
        .filter((r) => new Date(r.date) >= new Date())
        .slice(0, 4);
    const nextRace = upcomingRaces[0];
    const laterRaces = upcomingRaces.slice(1);

    const [timeLeft, setTimeLeft] = React.useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
    });

    React.useEffect(() => {
        if (!nextRace) return;

        const calculateTimeLeft = () => {
            // Combine date and time for accurate countdown, assuming UTC or handling offset if provided
            // nextRace.date is YYYY-MM-DD, nextRace.time is HH:MM:SSZ
            const raceDateTime = new Date(`${nextRace.date}T${nextRace.time}`);
            const now = new Date();
            const difference = raceDateTime.getTime() - now.getTime();

            if (difference > 0) {
                return {
                    days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
                    hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
                    minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
                    seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0')
                };
            }
            return { days: '00', hours: '00', minutes: '00', seconds: '00' };
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [nextRace]);

    if (!nextRace) {
        return (
            <div className="telemetry-card h-full flex flex-col justify-center items-center text-gray-500 font-mono text-sm p-8">
                No upcoming races scheduled
            </div>
        );
    }

    return (
        <div className="telemetry-card group h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary-500" />
                    <h2 className="font-heading text-lg tracking-widest uppercase text-white">Next Grand Prix</h2>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-6">
                {/* Main Featured Next Race */}
                <div className="relative rounded-lg overflow-hidden group/race cursor-pointer border border-white/10 hover:border-primary-500/50 transition-colors bg-white/5">

                    {/* Header Section */}
                    <div className="p-5 pb-2">
                        <div className="flex items-center gap-2 text-primary-500 text-xs font-mono font-bold uppercase tracking-widest">
                            Round {nextRace.round}
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-white leading-tight mt-1">
                            {nextRace.name}
                        </h3>
                    </div>

                    {/* Image Section - Stacked - Smoother Merge */}
                    <div className="relative w-full h-48 my-2 flex items-center justify-center">
                        <img
                            src={getRaceTrackImage(nextRace.round) || nextRace.image}
                            alt={nextRace.name}
                            className="w-full h-full object-contain p-4 opacity-80 group-hover/race:opacity-100 transition-opacity duration-500 invert drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                        />
                        {/* Stronger gradient for smoother merge into dark background */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Details Section */}
                    <div className="p-5 pt-2 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded bg-white/5 text-primary-500 shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Circuit</div>
                                    <div className="text-sm text-gray-200 font-medium leading-snug break-words">{nextRace.circuit}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{nextRace.country}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded bg-white/5 text-primary-500 shrink-0">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Race Day</div>
                                    <div className="text-sm text-gray-200 font-medium leading-snug">{new Date(nextRace.date).toLocaleDateString()}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{nextRace.time}</div>
                                </div>
                            </div>
                        </div>

                        {/* Weather Information */}
                        <div className="pt-2">
                            <WeatherCard lat={nextRace.latitude} lon={nextRace.longitude} />
                        </div>

                        {/* Countdown Timer */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Race Start In</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                <div className="bg-dark-800/50 rounded p-2 border border-white/5">
                                    <div className="text-lg font-mono font-bold text-white">{timeLeft.days}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Days</div>
                                </div>
                                <div className="bg-dark-800/50 rounded p-2 border border-white/5">
                                    <div className="text-lg font-mono font-bold text-white">{timeLeft.hours}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Hrs</div>
                                </div>
                                <div className="bg-dark-800/50 rounded p-2 border border-white/5">
                                    <div className="text-lg font-mono font-bold text-primary-500">{timeLeft.minutes}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Mins</div>
                                </div>
                                <div className="bg-dark-800/50 rounded p-2 border border-white/5">
                                    <div className="text-lg font-mono font-bold text-primary-500">{timeLeft.seconds}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Secs</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* List of following races */}
                {laterRaces.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest pl-1">Following Events</h4>
                        {laterRaces.map((race) => (
                            <Link
                                to={`/races/${race.id}`}
                                key={race.id}
                                className="flex items-center justify-between p-3 rounded bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group/item"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-center w-8">
                                        <div className="text-[10px] text-gray-500 font-bold uppercase">{new Date(race.date).toLocaleString('default', { month: 'short' })}</div>
                                        <div className="text-lg font-bold text-white leading-none">{new Date(race.date).getDate()}</div>
                                    </div>
                                    <div className="w-px h-8 bg-white/10"></div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-200 group-hover/item:text-white transition-colors">{race.name}</div>
                                        <div className="text-xs text-gray-500">{race.country}</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-600 group-hover/item:text-primary-500 transition-colors" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                <Link
                    to="/races"
                    className="flex items-center gap-2 text-xs font-heading uppercase tracking-widest text-gray-400 hover:text-white transition-colors group/link"
                >
                    Full Schedule
                    <ChevronRight className="w-4 h-4 text-primary-500 transition-transform group-hover/link:translate-x-1" />
                </Link>
            </div>
        </div>
    );
};

export default UpcomingRaceCard;
