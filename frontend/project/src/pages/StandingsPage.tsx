import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDriverStandings, getConstructorStandings } from '../services/f1Service';
import LoadingScreen from '../components/ui/LoadingScreen';

interface Driver {
  id: number;
  position: number;
  name: string;
  team: string;
  points: number;
  wins: number;
  podiums: number;
}

interface Constructor {
  id: number;
  position: number;
  name: string;
  points: number;
  wins: number;
  color: string;
}

const StandingsPage: React.FC = () => {
  const [driverStandings, setDriverStandings] = useState<Driver[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<Constructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'drivers' | 'constructors'>('drivers');
  
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
        <h1 className="text-3xl font-bold mb-2">Standings</h1>
        <p className="text-secondary-600 dark:text-secondary-300">
          Current Formula 1 championship standings
        </p>
      </div>
      
      <div className="card mb-8">
        <div className="flex border-b dark:border-secondary-700">
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'drivers' 
                ? 'border-b-2 border-primary-500 text-primary-500' 
                : 'text-secondary-600 dark:text-secondary-300 hover:text-secondary-800 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('drivers')}
          >
            Driver Standings
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'constructors' 
                ? 'border-b-2 border-primary-500 text-primary-500' 
                : 'text-secondary-600 dark:text-secondary-300 hover:text-secondary-800 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('constructors')}
          >
            Constructor Standings
          </button>
        </div>
      </div>
      
      {activeTab === 'drivers' ? (
        <div className="card overflow-visible">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b dark:border-secondary-700">
                  <th className="p-4 font-medium">Pos</th>
                  <th className="p-4 font-medium">Driver</th>
                  <th className="p-4 font-medium">Team</th>
                  <th className="p-4 font-medium text-right">Points</th>
                  <th className="p-4 font-medium text-right">Wins</th>
                  <th className="p-4 font-medium text-right">Podiums</th>
                </tr>
              </thead>
              <tbody>
                {driverStandings.map((driver, index) => (
                  <motion.tr 
                    key={driver.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors"
                  >
                    <td className="p-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
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
                    <td className="p-4 font-medium">{driver.name}</td>
                    <td className="p-4">{driver.team}</td>
                    <td className="p-4 text-right font-mono font-medium">{driver.points}</td>
                    <td className="p-4 text-right font-mono">{driver.wins}</td>
                    <td className="p-4 text-right font-mono">{driver.podiums}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card overflow-visible">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b dark:border-secondary-700">
                  <th className="p-4 font-medium">Pos</th>
                  <th className="p-4 font-medium">Team</th>
                  <th className="p-4 font-medium text-right">Points</th>
                  <th className="p-4 font-medium text-right">Wins</th>
                </tr>
              </thead>
              <tbody>
                {constructorStandings.map((constructor, index) => (
                  <motion.tr 
                    key={constructor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors"
                  >
                    <td className="p-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
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
                    <td className="p-4">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-16 mr-3 rounded-sm" 
                          style={{ backgroundColor: constructor.color }}
                        ></div>
                        <span className="font-medium">{constructor.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono font-medium">{constructor.points}</td>
                    <td className="p-4 text-right font-mono">{constructor.wins}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-center text-sm text-secondary-500 dark:text-secondary-400">
        Last updated: June 15, 2025
      </div>
    </motion.div>
  );
};

export default StandingsPage;