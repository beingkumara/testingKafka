import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Award, Activity, TrendingUp, Trophy, Medal, Flag } from 'lucide-react';
import { getDriverStandings, getRaces, getLastRaceResults } from '../services';
import LoadingScreen from '../components/ui/LoadingScreen';
import { Link } from 'react-router-dom';

interface Driver {
  id: number;
  name: string;
  team: string;
  points: number;
  wins: number;
  position: number;
}

interface Race{
  id: number;
  name: string;
  circuit: string;
  date: string;
  time: string;
  country: string;
  completed: boolean;
  image: string;
}



interface RaceResult {
  position: number;
  driver: string;
  team: string;
  time: string;
  points: number;
}

const DashboardPage: React.FC = () => {
  const [topDrivers, setTopDrivers] = useState<Driver[]>([]);
  const [upcomingRaces, setUpcomingRaces] = useState<Race[]>([]);
  const [lastRaceResults, setLastRaceResults] = useState<RaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversData, racesData, resultsData] = await Promise.all([
          getDriverStandings(),
          getRaces(),
          getLastRaceResults()
        ]);
        
        setTopDrivers(driversData.slice(0, 5));
        setUpcomingRaces(racesData.filter(race => !race.completed).slice(0, 3));
        setLastRaceResults(resultsData.slice(0, 10));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-secondary-600 dark:text-secondary-300">
          Your Formula 1 hub for stats, standings, and upcoming races
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Drivers Card */}
          <div className="card overflow-visible shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6 border-b dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-800/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary-500" />
                  <span>Driver Standings</span>
                </h2>
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium rounded-full">
                  2025 Season
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
                        className={`border-b dark:border-secondary-700 last:border-0 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors ${
                          index < 3 ? 'bg-secondary-50/50 dark:bg-secondary-800/20' : ''
                        }`}
                      >
                        <td className="p-3">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
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
          
          {/* Last Race Results */}
          <div className="card overflow-visible shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6 border-b dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-800/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary-500" />
                    <span>Last Race Results</span>
                  </h2>
                  <div className="flex items-center gap-4 mt-1 text-secondary-600 dark:text-secondary-300">
                    <div className="flex items-center gap-1">
                      <Flag className="h-4 w-4 text-primary-500" />
                      <span>Monaco Grand Prix</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-secondary-500" />
                      <span>Monte Carlo</span>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary-100 dark:bg-secondary-700 rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary-500" />
                  <span>June 12, 2025</span>
                </div>
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
                      <th className="p-3 font-medium">Time</th>
                      <th className="p-3 font-medium text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastRaceResults.map((result, index) => (
                      <motion.tr 
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`border-b dark:border-secondary-700 last:border-0 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors ${
                          index < 3 ? 'bg-secondary-50/50 dark:bg-secondary-800/20' : ''
                        }`}
                      >
                        <td className="p-3">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            result.position === 1 
                              ? 'bg-primary-500 text-white' 
                              : result.position === 2
                              ? 'bg-secondary-300 dark:bg-secondary-600 text-secondary-800 dark:text-white'
                              : result.position === 3
                              ? 'bg-accent-400 dark:bg-accent-600 text-secondary-800 dark:text-white'
                              : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-white'
                          }`}>
                            {result.position}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {result.position === 1 && <Trophy className="h-4 w-4 text-primary-500" />}
                            {result.position === 2 && <Medal className="h-4 w-4 text-secondary-400" />}
                            {result.position === 3 && <Medal className="h-4 w-4 text-accent-500" />}
                            <span className="font-medium">{result.driver}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-700">
                            {result.team}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-sm">
                          {result.time || 'DNF'}
                        </td>
                        <td className="p-3 text-right">
                          <span className={`font-mono font-bold text-lg ${
                            result.points > 0 ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-400'
                          }`}>
                            {result.points}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-center">
                <Link 
                  to="/race-results" 
                  className="btn btn-primary btn-sm flex items-center gap-2 px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <Flag className="h-4 w-4" />
                  View Complete Race Results
                </Link>
              </div>
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
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Next Race Card */}
          {upcomingRaces.length > 0 && (
            <div className="card overflow-visible">
              <div className="h-40 relative flex items-center justify-center bg-white">
                <img
                  src={upcomingRaces[0].image}
                  alt={`${upcomingRaces[0].name} layout`}
                  className="object-contain h-full w-full"
                  style={{ background: 'white' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/60 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <span className="inline-block bg-primary-500 text-white text-xs px-2 py-1 rounded-md font-medium mb-2">NEXT RACE</span>
                  <h3 className="text-xl font-bold">{upcomingRaces[0].name}</h3>
                  <p className="text-secondary-200">{upcomingRaces[0].circuit}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center py-2 border-b dark:border-secondary-700">
                  <Calendar className="h-5 w-5 text-primary-500 mr-3" />
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Date</p>
                    <p className="font-medium">
                      {new Date(upcomingRaces[0].date).toLocaleDateString('en-US', {
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
                    <p className="font-medium">{upcomingRaces[0].time ? upcomingRaces[0].time : '--'} GMT</p>
                  </div>
                </div>
                <div className="flex items-center py-2">
                  <MapPin className="h-5 w-5 text-primary-500 mr-3" />
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Location</p>
                    <p className="font-medium">{upcomingRaces[0].country}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/races" className="btn btn-primary w-full">
                    View Race Details
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {/* Upcoming Races */}
          <div className="card overflow-visible">
            <div className="p-6 border-b dark:border-secondary-600">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Upcoming Races</h2>
              </div>
            </div>
            
            <div className="divide-y dark:divide-secondary-700">
              {upcomingRaces.map((race, index) => (
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
      </div>
    </motion.div>
  );
};

export default DashboardPage;