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
      return <div className="flex items-center"><Minus className="h-4 w-4 text-secondary-400" /></div>;
    }
    
    const Icon = standing.positionsMoved > 0 ? ArrowUp : ArrowDown;
    const color = standing.positionsMoved > 0 ? 'text-green-500' : 'text-red-500';
    const absMoved = Math.abs(standing.positionsMoved);
    
    return (
      <div className="flex items-center gap-1">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className={`text-sm ${color}`}>{absMoved}</span>
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
      <div className="relative mb-12 bg-gradient-to-r from-secondary-800 to-secondary-900 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-opacity-50 bg-black"></div>
        <div className="relative z-10 px-6 py-12 md:py-16 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Championship Standings</h1>
          <p className="text-xl text-secondary-200 max-w-2xl">
            Follow the battle for the Formula 1 World Championship with live standings updated after each race.
          </p>
          
          <div className="mt-8 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-primary-400" />
              <span className="text-secondary-200">Season:</span>
            </div>
            <select
              value={season}
              onChange={(e) => setSeason(Number(e.target.value))}
              className="bg-secondary-700 border border-secondary-600 text-white rounded-md px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500"></div>
      </div>
      
      <div className="card mb-8 overflow-hidden">
        <div className="flex border-b dark:border-secondary-700">
          <button
            className={`flex-1 py-5 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'drivers' 
                ? 'border-b-2 border-primary-500 text-primary-500 bg-secondary-50 dark:bg-secondary-800/50' 
                : 'text-secondary-600 dark:text-secondary-300 hover:text-secondary-800 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-secondary-800/30'
            }`}
            onClick={() => setActiveTab('drivers')}
          >
            <Flag className={`h-5 w-5 ${activeTab === 'drivers' ? 'text-primary-500' : 'text-secondary-400'}`} />
            <span>Driver Standings</span>
          </button>
          <button
            className={`flex-1 py-5 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'constructors' 
                ? 'border-b-2 border-primary-500 text-primary-500 bg-secondary-50 dark:bg-secondary-800/50' 
                : 'text-secondary-600 dark:text-secondary-300 hover:text-secondary-800 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-secondary-800/30'
            }`}
            onClick={() => setActiveTab('constructors')}
          >
            <TrendingUp className={`h-5 w-5 ${activeTab === 'constructors' ? 'text-primary-500' : 'text-secondary-400'}`} />
            <span>Constructor Standings</span>
          </button>
        </div>
      </div>
      
      {activeTab === 'drivers' ? (
        <div className="card overflow-visible shadow-lg">
          <div className="p-4 bg-secondary-50 dark:bg-secondary-800/50 border-b dark:border-secondary-700 flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary-500" />
              <span>Driver Championship</span>
            </h3>
            <div className="text-sm text-secondary-500 dark:text-secondary-400">
              {season} Season
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b dark:border-secondary-700 bg-secondary-100 dark:bg-secondary-800/30">
                  <th className="p-4 font-medium">Position</th>
                  <th className="p-4 font-medium">Change</th>
                  <th className="p-4 font-medium">Driver</th>
                  <th className="p-4 font-medium">Team</th>
                  <th className="p-4 font-medium text-right">Points</th>
                  <th className="p-4 font-medium text-center">Wins</th>
                  <th className="p-4 font-medium text-center">Podiums</th>
                </tr>
              </thead>
              <tbody>
                {driverStandings.map((driver, index) => (
                  <motion.tr 
                    key={driver.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`border-b dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors ${
                      index < 3 ? 'bg-secondary-50/50 dark:bg-secondary-800/20' : ''
                    }`}
                  >
                    <td className="p-4">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                        driver.position === 1 
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
                    <td className="p-4 text-center">
                      {getPositionChange(driver)}
                    </td>
                    <td className="p-4">
                      <Link to={`/drivers/${driver.id}`} className="font-medium hover:text-primary-500 transition-colors flex items-center gap-2">
                        {driver.position === 1 && <Trophy className="h-4 w-4 text-primary-500" />}
                        {driver.name}
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-700">
                        {driver.team}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-lg">{driver.points}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Trophy className="h-4 w-4 text-primary-500" />
                        <span className="font-mono">{driver.wins}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Medal className="h-4 w-4 text-accent-500" />
                        <span className="font-mono">{driver.podiums}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
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
              <div className="flex items-center gap-1">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span>Position Gained</span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowDown className="h-4 w-4 text-red-500" />
                <span>Position Lost</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card overflow-visible shadow-lg">
          <div className="p-4 bg-secondary-50 dark:bg-secondary-800/50 border-b dark:border-secondary-700 flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-primary-500" />
              <span>Constructor Championship</span>
            </h3>
            <div className="text-sm text-secondary-500 dark:text-secondary-400">
              {season} Season
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b dark:border-secondary-700 bg-secondary-100 dark:bg-secondary-800/30">
                  <th className="p-4 font-medium">Position</th>
                  <th className="p-4 font-medium">Change</th>
                  <th className="p-4 font-medium">Team</th>
                  <th className="p-4 font-medium text-right">Points</th>
                  <th className="p-4 font-medium text-center">Wins</th>
                </tr>
              </thead>
              <tbody>
                {constructorStandings.map((constructor, index) => (
                  <motion.tr 
                    key={constructor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`border-b dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors ${
                      index < 3 ? 'bg-secondary-50/50 dark:bg-secondary-800/20' : ''
                    }`}
                  >
                    <td className="p-4">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                        constructor.position === 1 
                          ? 'bg-primary-500 text-white' 
                          : constructor.position === 2
                          ? 'bg-secondary-300 dark:bg-secondary-600 text-secondary-800 dark:text-white'
                          : constructor.position === 3
                          ? 'bg-accent-400 dark:bg-accent-600 text-secondary-800 dark:text-white'
                          : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-white'
                      }`}>
                        {constructor.position}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {getPositionChange(constructor)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-16 mr-3 rounded-sm shadow-md" 
                          style={{ backgroundColor: constructor.color }}
                        ></div>
                        <div className="flex flex-col justify-center">
                          <div className="font-medium flex items-center">
                            {constructor.position === 1 && <Trophy className="h-4 w-4 text-primary-500 mr-1" />}
                            <span>{constructor.name}</span>
                          </div>
                          <span className="text-xs text-secondary-500 dark:text-secondary-400">
                            {constructor.position <= 3 ? 'Championship contender' : 'Midfield team'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-lg">{constructor.points}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Trophy className="h-4 w-4 text-primary-500" />
                        <span className="font-mono">{constructor.wins}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
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
              <div className="flex items-center gap-1">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span>Position Gained</span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowDown className="h-4 w-4 text-red-500" />
                <span>Position Lost</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center text-sm text-secondary-500 dark:text-secondary-400 flex items-center justify-center gap-2">
        <TrendingUp className="h-4 w-4" />
        <span>Last updated: June 15, 2025</span>
      </div>
    </motion.div>
  );
};

export default StandingsPage;