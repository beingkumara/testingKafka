import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDriverStandings, getConstructorStandings } from '../services';
import LoadingScreen from '../components/ui/LoadingScreen';
import { Trophy, Medal, Award, Flag, TrendingUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Driver {
    id: string;
    position: number;
    name: string;
    team: string;
    points: number;
    wins: number;
    podiums: number;
    positionsMoved?: number;
}

interface Constructor {
    id: string;
    position: number;
    name: string;
    points: number;
    wins: number;
    positionsMoved?: number;
}

const StandingsPage: React.FC = () => {
    const [driverStandings, setDriverStandings] = useState<Driver[]>([]);
    const [constructorStandings, setConstructorStandings] = useState<Constructor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'drivers' | 'constructors'>('drivers');
    const [season, setSeason] = useState<number>(new Date().getFullYear());

    // Generate year options from current year down to 1951
    const years = Array.from(
        { length: new Date().getFullYear() - 1950 },
        (_, i) => new Date().getFullYear() - i
    );

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const [driversData, constructorsData] = await Promise.all([
                    getDriverStandings(),
                    getConstructorStandings()
                ]);

                setDriverStandings(driversData);
                setConstructorStandings(constructorsData);
            } catch (error) {
                console.error('Error fetching standings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStandings();
    }, [season]);

    const getPositionChange = (standing: Driver | Constructor) => {
        if (!standing.positionsMoved || standing.positionsMoved === 0) {
            return <div className="flex items-center justify-center"><Minus className="h-3 w-3 text-gray-600" /></div>;
        }

        const Icon = standing.positionsMoved > 0 ? ArrowUp : ArrowDown;
        const color = standing.positionsMoved > 0 ? 'text-green-500' : 'text-red-500';
        const absMoved = Math.abs(standing.positionsMoved);

        return (
            <div className="flex items-center justify-center gap-1">
                <Icon className={`h-3 w-3 ${color}`} />
                <span className={`text-xs font-mono ${color}`}>{absMoved}</span>
            </div>
        );
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="pb-12"
        >
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 container-f1">
                <div>
                    <div className="flex items-center gap-2 text-primary-500 font-mono text-xs font-bold tracking-widest uppercase mb-1">
                        <Trophy className="w-4 h-4" /> Championship Battle
                    </div>
                    <h1 className="text-4xl font-heading font-bold text-white uppercase italic">Standings <span className="text-white/20">{season}</span></h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select
                            value={season}
                            onChange={(e) => setSeason(Number(e.target.value))}
                            className="f1-input appearance-none pl-4 pr-10 py-2 bg-dark-800 border-white/10 text-white font-mono hover:border-primary-500 transition-colors"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-white"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-f1 mb-8">
                <div className="flex p-1 bg-white/5 backdrop-blur rounded lg:w-fit">
                    <button
                        className={`flex-1 lg:flex-none px-6 py-2 rounded text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'drivers'
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        onClick={() => setActiveTab('drivers')}
                    >
                        <Flag className="w-4 h-4" /> Driver Championship
                    </button>
                    <button
                        className={`flex-1 lg:flex-none px-6 py-2 rounded text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'constructors'
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        onClick={() => setActiveTab('constructors')}
                    >
                        <TrendingUp className="w-4 h-4" /> Constructor Championship
                    </button>
                </div>
            </div>

            <div className="container-f1">
                <div className="telemetry-card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                                    <th className="p-4 w-16 text-center">Pos</th>
                                    <th className="p-4 w-16 text-center">+/-</th>
                                    <th className="p-4">Driver / Team</th>
                                    <th className="p-4 hidden md:table-cell">Team / Car</th>
                                    <th className="p-4 text-right">Points</th>
                                    <th className="p-4 text-center hidden sm:table-cell">Wins</th>
                                    {activeTab === 'drivers' && <th className="p-4 text-center hidden sm:table-cell">Podiums</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {(activeTab === 'drivers' ? driverStandings : constructorStandings).map((item, index) => {
                                    const isDriver = activeTab === 'drivers';
                                    const driver = item as Driver;
                                    const constructor = item as Constructor;

                                    return (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                            className={`
                            hover:bg-white/5 transition-colors group
                            ${index === 0 ? 'bg-gradient-to-r from-primary-900/20 to-transparent' : ''}
                        `}
                                        >
                                            <td className="p-4 text-center relative">
                                                {index === 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>}
                                                <span className={`font-heading text-xl font-bold ${index === 0 ? 'text-primary-500' : 'text-white'}`}>
                                                    {item.position}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {getPositionChange(item)}
                                            </td>
                                            <td className="p-4">
                                                {isDriver ? (
                                                    <Link to={`/drivers/${driver.id}`} className="flex items-center gap-3 group-hover:text-primary-500 transition-colors">
                                                        <span className="font-heading text-lg font-bold text-white group-hover:text-primary-500">{driver.name}</span>
                                                        <span className="md:hidden text-xs text-gray-500 font-mono uppercase bg-white/5 px-1 rounded">{driver.team}</span>
                                                    </Link>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-heading text-lg font-bold text-white uppercase">{constructor.name}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                {isDriver && (
                                                    <span className="font-mono text-sm text-gray-400 uppercase tracking-wide">{driver.team}</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="font-mono font-bold text-white text-lg">{item.points}</div>
                                            </td>
                                            <td className="p-4 text-center hidden sm:table-cell">
                                                {item.wins > 0 ? (
                                                    <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded text-xs font-mono font-bold">
                                                        {item.wins}
                                                    </span>
                                                ) : <span className="text-gray-600">-</span>}
                                            </td>
                                            {isDriver && (
                                                <td className="p-4 text-center hidden sm:table-cell">
                                                    {driver.podiums > 0 ? (
                                                        <span className="bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded text-xs font-mono font-bold">
                                                            {driver.podiums}
                                                        </span>
                                                    ) : <span className="text-gray-600">-</span>}
                                                </td>
                                            )}
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default StandingsPage;