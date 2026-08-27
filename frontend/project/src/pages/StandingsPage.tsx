import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDriverStandings, getConstructorStandings } from '../services';
import LoadingScreen from '../components/ui/LoadingScreen';
import { Trophy, Flag, TrendingUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';
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

// Team color mapping for the left bar accent
const getTeamColor = (team: string): string => {
  const t = (team || '').toLowerCase();
  if (t.includes('red bull')) return '#0600EF';
  if (t.includes('ferrari')) return '#E80020';
  if (t.includes('mercedes')) return '#00D2BE';
  if (t.includes('mclaren')) return '#FF8000';
  if (t.includes('aston')) return '#229971';
  if (t.includes('alpine')) return '#0090FF';
  if (t.includes('williams')) return '#64C4FF';
  if (t.includes('racing bulls') || t.includes('rb ')) return '#1634CB';
  if (t.includes('audi') || t.includes('sauber') || t.includes('kick')) return '#52E252';
  if (t.includes('haas') || t.includes('cadillac')) return '#B6BABD';
  return '#E10600';
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const StandingsPage: React.FC = () => {
  const [driverStandings, setDriverStandings] = useState<Driver[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<Constructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'drivers' | 'constructors'>('drivers');
  const [season, setSeason] = useState<number>(new Date().getFullYear());

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
      return (
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center justify-center w-7 h-5 rounded text-gray-700 bg-white/3 text-xs font-mono">
            <Minus className="h-3 w-3" />
          </span>
        </div>
      );
    }
    const gained = standing.positionsMoved > 0;
    const Icon = gained ? ArrowUp : ArrowDown;
    const absMoved = Math.abs(standing.positionsMoved);
    const pillClass = gained
      ? 'bg-green-500/10 text-green-400 border border-green-500/25'
      : 'bg-red-500/10 text-red-400 border border-red-500/25';
    return (
      <div className="flex items-center justify-center">
        <span className={`tabular-nums inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${pillClass}`}>
          <Icon className="h-2.5 w-2.5 shrink-0" />
          {absMoved}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const displayData = activeTab === 'drivers' ? driverStandings : constructorStandings;
  const maxPoints = displayData[0]?.points || 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pb-12"
    >
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 container-f1">
        <div>
          <div className="flex items-center gap-2 text-primary-500 font-mono text-xs font-bold tracking-widest uppercase mb-1">
            <Trophy className="w-4 h-4" /> Championship Battle
          </div>
          <h1 className="text-4xl font-heading font-bold text-white uppercase italic">
            Standings <span className="tabular-nums text-white/20">{season}</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={season}
              onChange={(e) => setSeason(Number(e.target.value))}
              className="f1-input appearance-none pl-4 pr-10 py-2 bg-dark-800 border-white/10 text-white font-mono"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-white/50"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="container-f1 mb-8">
        <div className="flex p-1 bg-black/40 backdrop-blur rounded-lg border border-white/5 lg:w-fit">
          {(['drivers', 'constructors'] as const).map((tab) => (
            <button
              key={tab}
              className="flex-1 lg:flex-none px-5 py-2 rounded-md text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              style={{
                background: activeTab === tab ? '#E10600' : 'transparent',
                color: activeTab === tab ? '#fff' : '#6b7280',
                boxShadow: activeTab === tab ? '0 2px 12px rgba(225,6,0,0.25)' : 'none',
                transition: 'background-color 200ms ease-out, color 200ms ease-out, box-shadow 200ms ease-out',
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'drivers' ? <Flag className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              {tab === 'drivers' ? 'Drivers' : 'Constructors'}
            </button>
          ))}
        </div>
      </div>

      {/* Standings Table */}
      <div className="container-f1">
        <div className="telemetry-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/8 text-[10px] font-mono text-gray-600 uppercase tracking-wider">
                  <th className="p-4 w-14 text-center">Pos</th>
                  <th className="p-4 w-12 text-center">Δ</th>
                  <th className="p-4">{activeTab === 'drivers' ? 'Driver' : 'Constructor'}</th>
                  {activeTab === 'drivers' && <th className="p-4 hidden md:table-cell">Team</th>}
                  <th className="p-4 text-right min-w-[120px]">Points</th>
                  <th className="p-4 text-center hidden sm:table-cell">Wins</th>
                  {activeTab === 'drivers' && <th className="p-4 text-center hidden sm:table-cell">Podiums</th>}
                </tr>
              </thead>
              <tbody>
                {displayData.map((item, index) => {
                  const isDriver = activeTab === 'drivers';
                  const driver = item as Driver;
                  const constructor = item as Constructor;
                  const teamColor = isDriver ? getTeamColor(driver.team) : getTeamColor(constructor.name);
                  const ptsPct = maxPoints > 0 ? (item.points / maxPoints) * 100 : 0;

                  return (
                    <motion.tr
                      key={item.id}
                      custom={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className="border-b border-white/5 relative group"
                      style={{ transition: 'background-color 150ms ease-out' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLTableRowElement).style.background = `linear-gradient(to right, ${teamColor}12, transparent)`;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLTableRowElement).style.background = index === 0 ? 'rgba(225,6,0,0.04)' : 'transparent';
                      }}
                    >
                      {/* Team color left bar */}
                      <td className="p-4 text-center relative">
                        <div
                          className="absolute left-0 top-0 bottom-0 w-[3px]"
                          style={{ backgroundColor: teamColor }}
                        />
                        <span
                          className="tabular-nums font-heading text-xl font-bold"
                          style={{ color: index === 0 ? '#E10600' : '#fff' }}
                        >
                          {item.position}
                        </span>
                      </td>

                      {/* Position change */}
                      <td className="p-4">{getPositionChange(item)}</td>

                      {/* Name */}
                      <td className="p-4">
                        {isDriver ? (
                          <Link
                            to={`/drivers/${driver.id}`}
                            className="flex items-center gap-2"
                            style={{ transition: 'color 200ms ease-out' }}
                          >
                            <span className="font-heading text-base font-bold text-white group-hover:text-primary-400" style={{ transition: 'color 200ms ease-out' }}>
                              {driver.name}
                            </span>
                            <span className="md:hidden text-[10px] text-gray-600 font-mono uppercase bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                              {driver.team}
                            </span>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: teamColor, boxShadow: `0 0 6px ${teamColor}` }}
                            />
                            <span className="font-heading text-base font-bold text-white uppercase">{constructor.name}</span>
                          </div>
                        )}
                      </td>

                      {/* Team (driver tab only) */}
                      {isDriver && (
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: teamColor }}
                            />
                            <span className="font-mono text-xs text-gray-500 uppercase tracking-wide">{driver.team}</span>
                          </div>
                        </td>
                      )}

                      {/* Points — with mini bar */}
                      <td className="p-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <div className="tabular-nums font-mono font-bold text-white text-base">{item.points}</div>
                          {/* Mini points bar */}
                          <div className="w-16 h-[2px] bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${ptsPct}%`, backgroundColor: teamColor, opacity: 0.6 }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Wins */}
                      <td className="p-4 text-center hidden sm:table-cell">
                        {item.wins > 0 ? (
                          <span className="tabular-nums bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded text-xs font-mono font-bold">
                            {item.wins}
                          </span>
                        ) : <span className="text-gray-700 text-sm">–</span>}
                      </td>

                      {/* Podiums (driver only) */}
                      {isDriver && (
                        <td className="p-4 text-center hidden sm:table-cell">
                          {driver.podiums > 0 ? (
                            <span className="tabular-nums bg-white/8 text-gray-300 border border-white/10 px-2 py-0.5 rounded text-xs font-mono font-bold">
                              {driver.podiums}
                            </span>
                          ) : <span className="text-gray-700 text-sm">–</span>}
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