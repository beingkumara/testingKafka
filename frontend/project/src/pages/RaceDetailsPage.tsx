import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Trophy, 
  Flag, 
  ChevronLeft, 
  AlertCircle,
  Timer,
  Layers
} from 'lucide-react';
import { getRaceById } from '../services';
import LoadingScreen from '../components/ui/LoadingScreen';

interface RaceDetails {
  _id: string;
  season: string;
  round: string;
  url: string;
  raceName: string;
  date: string;
  time: string;
  circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    location: {
      lat: string;
      _long: string;
      locality: string;
      country: string;
    }
  };
  firstPractice: { date: string; time: string };
  secondPractice: { date: string; time: string };
  thirdPractice: { date: string; time: string };
  qualifying: { date: string; time: string };
  standingsUpdated: boolean;
}

const RaceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [raceDetails, setRaceDetails] = useState<RaceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRaceDetails = async () => {
      try {
        if (!id) {
          throw new Error('Race ID is required');
        }
        
        setIsLoading(true);
        setError(null);
        
        const data = await getRaceById(id);
        
        // Validate that we have the minimum required data
        if (!data || !data.raceName) {
          throw new Error('Incomplete race data received from server');
        }
        
        setRaceDetails(data);
      } catch (error) {
        console.error('Error fetching race details:', error);
        
        // Provide more specific error messages based on the error type
        if (error instanceof Error) {
          if (error.message.includes('Unexpected end of JSON input')) {
            setError('The server returned an invalid response. This could be due to server maintenance or an issue with the race data.');
          } else if (error.message.includes('Failed to fetch')) {
            setError('Unable to connect to the server. Please check your internet connection and try again.');
          } else {
            setError(`Failed to load race details: ${error.message}`);
          }
        } else {
          setError('Failed to load race details. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRaceDetails();
  }, [id]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !raceDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Race Details</h2>
        <p className="text-secondary-600 dark:text-secondary-300 mb-6">{error}</p>
        <Link to="/races" className="btn btn-primary">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Races
        </Link>
      </div>
    );
  }

  // Format dates for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr; // Return the original string if there's an error
    }
  };

  // Format times for display
  const formatTime = (timeStr: string) => {
    if (!timeStr) return 'N/A';
    
    try {
      // Convert UTC time string to local time
      const [hours, minutes] = timeStr.slice(0, -1).split(':');
      const date = new Date();
      date.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10));
      
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeStr; // Return the original string if there's an error
    }
  };

  // Check if race is in the future
  const isUpcoming = new Date(`${raceDetails.date}T${raceDetails.time}`) > new Date();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-12"
    >
      {/* Hero Section */}
      <div className="relative mb-12 bg-gradient-to-r from-secondary-800 to-secondary-900 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-opacity-50 bg-black"></div>
        <div className="relative z-10 px-6 py-12 md:py-16 text-white">
          <div className="flex items-center mb-6">
            <Link to="/races" className="text-secondary-200 hover:text-white transition-colors flex items-center">
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Races
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{raceDetails.raceName}</h1>
              <p className="text-xl text-secondary-200">
                Round {raceDetails.round} of the {raceDetails.season} Formula 1 Season
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              {isUpcoming ? (
                <span className="inline-block bg-primary-500 text-white px-4 py-2 rounded-md font-medium">
                  Upcoming Race
                </span>
              ) : (
                <span className="inline-block bg-secondary-700 text-white px-4 py-2 rounded-md font-medium">
                  Completed Race
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500"></div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Race Information */}
        <div className="lg:col-span-2">
          <div className="card mb-8">
            <div className="p-6 border-b dark:border-secondary-700">
              <h2 className="text-2xl font-bold flex items-center">
                <Flag className="w-6 h-6 text-primary-500 mr-2" />
                Race Information
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Circuit Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-secondary-100 dark:bg-secondary-800 p-2 rounded-lg mr-4">
                        <MapPin className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">Circuit</p>
                        <p className="font-medium">{raceDetails.circuit.circuitName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-secondary-100 dark:bg-secondary-800 p-2 rounded-lg mr-4">
                        <MapPin className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">Location</p>
                        <p className="font-medium">
                          {raceDetails.circuit.location.locality || 'Unknown'}, {raceDetails.circuit.location.country || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-secondary-100 dark:bg-secondary-800 p-2 rounded-lg mr-4">
                        <Calendar className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">Race Date</p>
                        <p className="font-medium">{formatDate(raceDetails.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-secondary-100 dark:bg-secondary-800 p-2 rounded-lg mr-4">
                        <Clock className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">Race Time</p>
                        <p className="font-medium">{formatTime(raceDetails.time)} (Local) / {raceDetails.time.slice(0, -1)} UTC</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-secondary-100 dark:bg-secondary-800 p-2 rounded-lg mr-4">
                        <Layers className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">Season</p>
                        <p className="font-medium">{raceDetails.season} Formula 1 World Championship</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-secondary-100 dark:bg-secondary-800 p-2 rounded-lg mr-4">
                        <Trophy className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">Round</p>
                        <p className="font-medium">Round {raceDetails.round}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-secondary-100 dark:bg-secondary-800 p-2 rounded-lg mr-4">
                        <Timer className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">Standings Updated</p>
                        <p className="font-medium">{raceDetails.standingsUpdated ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                    
                    {raceDetails.url && (
                      <div className="mt-6">
                        <a 
                          href={raceDetails.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          More information on Wikipedia →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Race Schedule */}
          <div className="card">
            <div className="p-6 border-b dark:border-secondary-700">
              <h2 className="text-2xl font-bold flex items-center">
                <Calendar className="w-6 h-6 text-primary-500 mr-2" />
                Race Weekend Schedule
              </h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-secondary-50 dark:bg-secondary-800/30 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Practice 1</h3>
                    <div className="flex items-center text-secondary-600 dark:text-secondary-300 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(raceDetails.firstPractice.date)}</span>
                    </div>
                    <div className="flex items-center text-secondary-600 dark:text-secondary-300">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{formatTime(raceDetails.firstPractice.time)} (Local) / {raceDetails.firstPractice.time ? raceDetails.firstPractice.time.slice(0, -1) : 'N/A'} UTC</span>
                    </div>
                  </div>
                  
                  <div className="bg-secondary-50 dark:bg-secondary-800/30 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Practice 2</h3>
                    <div className="flex items-center text-secondary-600 dark:text-secondary-300 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(raceDetails.secondPractice.date)}</span>
                    </div>
                    <div className="flex items-center text-secondary-600 dark:text-secondary-300">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{formatTime(raceDetails.secondPractice.time)} (Local) / {raceDetails.secondPractice.time ? raceDetails.secondPractice.time.slice(0, -1) : 'N/A'} UTC</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-secondary-50 dark:bg-secondary-800/30 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Practice 3</h3>
                    <div className="flex items-center text-secondary-600 dark:text-secondary-300 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(raceDetails.thirdPractice.date)}</span>
                    </div>
                    <div className="flex items-center text-secondary-600 dark:text-secondary-300">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{formatTime(raceDetails.thirdPractice.time)} (Local) / {raceDetails.thirdPractice.time ? raceDetails.thirdPractice.time.slice(0, -1) : 'N/A'} UTC</span>
                    </div>
                  </div>
                  
                  <div className="bg-secondary-50 dark:bg-secondary-800/30 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Qualifying</h3>
                    <div className="flex items-center text-secondary-600 dark:text-secondary-300 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(raceDetails.qualifying.date)}</span>
                    </div>
                    <div className="flex items-center text-secondary-600 dark:text-secondary-300">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{formatTime(raceDetails.qualifying.time)} (Local) / {raceDetails.qualifying.time ? raceDetails.qualifying.time.slice(0, -1) : 'N/A'} UTC</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border-l-4 border-primary-500">
                  <h3 className="font-semibold mb-2 text-primary-700 dark:text-primary-300">Race Day</h3>
                  <div className="flex items-center text-secondary-600 dark:text-secondary-300 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(raceDetails.date)}</span>
                  </div>
                  <div className="flex items-center text-secondary-600 dark:text-secondary-300">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{formatTime(raceDetails.time)} (Local) / {raceDetails.time ? raceDetails.time.slice(0, -1) : 'N/A'} UTC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Circuit Map and Actions */}
        <div>
          <div className="card mb-8 overflow-hidden">
            <div className="p-6 border-b dark:border-secondary-700">
              <h2 className="text-xl font-bold flex items-center">
                <MapPin className="w-5 h-5 text-primary-500 mr-2" />
                Circuit Layout
              </h2>
            </div>
            
            <div className="aspect-w-16 aspect-h-9 bg-white dark:bg-secondary-900 relative flex items-center justify-center rounded-2xl shadow-xl overflow-hidden">
  <img
    src={raceDetails.circuit.url}
    alt={`${raceDetails.circuit.circuitName} layout`}
    className="object-contain h-full w-full rounded-2xl"
    style={{ background: 'white' }}
  />
</div>
          </div>
          
          <div className="card">
            <div className="p-6 border-b dark:border-secondary-700">
              <h2 className="text-xl font-bold">Actions</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {!isUpcoming && (
                <Link 
                  to={`/race-results?season=${raceDetails.season}&round=${raceDetails.round}`} 
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  View Race Results
                </Link>
              )}
              
              <Link 
                to="/standings" 
                className="btn btn-secondary w-full flex items-center justify-center"
              >
                <Layers className="w-4 h-4 mr-2" />
                Championship Standings
              </Link>
              
              {raceDetails.url && (
                <a 
                  href={raceDetails.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline w-full flex items-center justify-center"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  More on Wikipedia
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RaceDetailsPage;