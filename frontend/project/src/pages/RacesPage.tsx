import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';
import { getRaces } from '../services';
import LoadingScreen from '../components/ui/LoadingScreen';
import { Link } from 'react-router-dom';

interface Race {
  id: number;
  name: string;
  circuit: string;
  date: string;
  time: string;
  country: string;
  completed: boolean;
  image: string;
}

const RacesPage: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const data = await getRaces();
        setRaces(data);
      } catch (error) {
        console.error('Error fetching races:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRaces();
  }, []);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  const upcomingRaces = races.filter(race => !race.completed);
  const completedRaces = races.filter(race => race.completed);
  
  const displayedRaces = activeTab === 'upcoming' ? upcomingRaces : completedRaces;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Race Calendar</h1>
        <p className="text-secondary-600 dark:text-secondary-300">
          Schedule and results for the 2025 Formula 1 season
        </p>
      </div>
      
      <div className="card mb-8">
        <div className="flex border-b dark:border-secondary-700">
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'upcoming' 
                ? 'border-b-2 border-primary-500 text-primary-500' 
                : 'text-secondary-600 dark:text-secondary-300 hover:text-secondary-800 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Races
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'completed' 
                ? 'border-b-2 border-primary-500 text-primary-500' 
                : 'text-secondary-600 dark:text-secondary-300 hover:text-secondary-800 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Completed Races
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {displayedRaces.map((race, index) => (
          <motion.div
            key={race.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="card overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="h-48 md:h-auto bg-white flex items-center justify-center relative">
                <img
                  src={race.image}
                  alt={`${race.circuit} layout`}
                  className="object-contain h-full w-full"
                  style={{ background: 'white' }}
                />
                {!race.completed && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-primary-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                      ROUND {index + 1}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6 md:col-span-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{race.name}</h2>
                    <p className="text-secondary-600 dark:text-secondary-300">
                      {race.circuit}
                    </p>
                  </div>
                  
                  {race.completed ? (
                    <div className="mt-2 md:mt-0">
                      <span className="inline-block bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-200 text-sm px-3 py-1 rounded-md font-medium">
                        Completed
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2 md:mt-0">
                      <span className="inline-block bg-secondary-100 dark:bg-secondary-700 text-primary-500 text-sm px-3 py-1 rounded-md font-medium">
                        {new Date(race.date) > new Date() ? 'Upcoming' : 'This Weekend'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary-500 mr-2" />
                    <div>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">Date</p>
                      <p className="font-medium">
                        {new Date(race.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-primary-500 mr-2" />
                    <div>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">Time</p>
                      <p className="font-medium">{race.time} GMT</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary-500 mr-2" />
                    <div>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">Location</p>
                      <p className="font-medium">{race.country}</p>
                    </div>
                  </div>
                </div>
                
                <Link to={`/races/${race.id}`} className="btn btn-primary flex items-center">
                  {race.completed ? 'View Results' : 'Race Details'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {displayedRaces.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-secondary-500 dark:text-secondary-400">
            {activeTab === 'upcoming' 
              ? 'No upcoming races for this season' 
              : 'No completed races yet'}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default RacesPage;