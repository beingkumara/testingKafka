import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Flag, Trophy, Award, Star, Activity } from 'lucide-react';
import { API_BASE_URL } from '../config/constants';
import LoadingScreen from '../components/ui/LoadingScreen';

interface DriverDetails {
  _id: string;
  driverNumber: string;
  firstName: string;
  lastName: string;
  teamName: string;
  fullName: string;
  driverImageUrl: string;
  nationality: string;
  dateOfBirth: string;
  isActive: boolean;
  wins: number;
  podiums: number;
  points: number;
  poles: number;
  fastestLaps: number;
  totalRaces: number;
  sprintWins: number;
  sprintPodiums: number;
  sprintRaces: number;
}

const DriverDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<DriverDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching driver with ID:', id);
        
        const response = await fetch(`${API_BASE_URL}/drivers/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch driver details: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Driver data:', data);
        
        // Map API response to our component's expected format
        setDriver({
          _id: data.driverId,
          driverNumber: data.driverNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          teamName: data.teamName,
          fullName: data.fullName,
          driverImageUrl: data.headshot_url,
          nationality: data.nationality,
          dateOfBirth: data.dateOfBirth,
          isActive: data.active,
          wins: data.wins,
          podiums: data.podiums,
          points: data.points,
          poles: data.poles,
          fastestLaps: data.fastestLaps || 0,
          totalRaces: data.totalRaces,
          sprintWins: data.sprintWins || 0,
          sprintPodiums: data.sprintPodiums || 0,
          sprintRaces: data.sprintRaces || 0
        });
      } catch (err) {
        console.error('Error fetching driver details:', err);
        setError('Failed to load driver details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDriverDetails();
    }
  }, [id]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !driver) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-secondary-600 dark:text-secondary-300 mb-6">
          {error || 'Driver not found'}
        </p>
        <button 
          onClick={() => navigate('/drivers')}
          className="btn btn-primary"
        >
          Back to Drivers
        </button>
      </div>
    );
  }

  // Format date of birth
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate age
  const calculateAge = (dateString: string) => {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-12"
    >
      <div className="mb-6">
        <button 
          onClick={() => navigate('/drivers')}
          className="flex items-center text-secondary-600 hover:text-primary-600 dark:text-secondary-300 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Drivers
        </button>
      </div>

      {/* Hero Section */}
      <div className="card overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900 h-48 relative">
          <div className="absolute bottom-0 left-0 right-0 h-1 racing-line"></div>
          <div className="absolute inset-0 flex items-center justify-between px-8">
            <div className="text-white">
              <h1 className="text-4xl font-bold">{driver.fullName}</h1>
              <p className="text-xl opacity-90">{driver.teamName}</p>
            </div>
            <div className="h-24 w-24 bg-white dark:bg-secondary-800 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg">
              {driver.driverNumber}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="aspect-[2/3] overflow-hidden rounded-lg mb-6">
              <img
                src={driver.driverImageUrl}
                alt={driver.fullName}
                className="w-full h-full object-cover object-[center_top]"
                onError={(e) => {
                  e.currentTarget.src = '/default-driver.jpg';
                }}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <Flag className="text-secondary-500 mr-3" size={20} />
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">Nationality</p>
                  <p className="font-medium">{driver.nationality}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="text-secondary-500 mr-3" size={20} />
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">Date of Birth</p>
                  <p className="font-medium">{formatDate(driver.dateOfBirth)} ({calculateAge(driver.dateOfBirth)} years)</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Activity className="text-secondary-500 mr-3" size={20} />
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">Status</p>
                  <p className="font-medium">
                    {driver.isActive ? (
                      <span className="text-green-600 dark:text-green-400">Active</span>
                    ) : (
                      <span className="text-secondary-500">Inactive</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Career Statistics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="card p-4 bg-secondary-50 dark:bg-secondary-800">
                <div className="flex items-center mb-2">
                  <Trophy className="text-yellow-500 mr-2" size={20} />
                  <h3 className="font-semibold">Wins</h3>
                </div>
                <p className="text-3xl font-bold font-mono">{driver.wins}</p>
              </div>
              
              <div className="card p-4 bg-secondary-50 dark:bg-secondary-800">
                <div className="flex items-center mb-2">
                  <Award className="text-primary-500 mr-2" size={20} />
                  <h3 className="font-semibold">Podiums</h3>
                </div>
                <p className="text-3xl font-bold font-mono">{driver.podiums}</p>
              </div>
              
              <div className="card p-4 bg-secondary-50 dark:bg-secondary-800">
                <div className="flex items-center mb-2">
                  <Star className="text-purple-500 mr-2" size={20} />
                  <h3 className="font-semibold">Poles</h3>
                </div>
                <p className="text-3xl font-bold font-mono">{driver.poles}</p>
              </div>
              
              <div className="card p-4 bg-secondary-50 dark:bg-secondary-800">
                <div className="flex items-center mb-2">
                  <Activity className="text-blue-500 mr-2" size={20} />
                  <h3 className="font-semibold">Fastest Laps</h3>
                </div>
                <p className="text-3xl font-bold font-mono">{driver.fastestLaps}</p>
              </div>
              
              <div className="card p-4 bg-secondary-50 dark:bg-secondary-800">
                <div className="flex items-center mb-2">
                  <Flag className="text-green-500 mr-2" size={20} />
                  <h3 className="font-semibold">Races</h3>
                </div>
                <p className="text-3xl font-bold font-mono">{driver.totalRaces}</p>
              </div>
              
              <div className="card p-4 bg-secondary-50 dark:bg-secondary-800">
                <div className="flex items-center mb-2">
                  <Award className="text-orange-500 mr-2" size={20} />
                  <h3 className="font-semibold">Points</h3>
                </div>
                <p className="text-3xl font-bold font-mono">{driver.points}</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-6">Sprint Race Statistics</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="card p-4 bg-secondary-50 dark:bg-secondary-800">
                <div className="flex items-center mb-2">
                  <Trophy className="text-yellow-500 mr-2" size={20} />
                  <h3 className="font-semibold">Sprint Wins</h3>
                </div>
                <p className="text-3xl font-bold font-mono">{driver.sprintWins}</p>
              </div>
              
              <div className="card p-4 bg-secondary-50 dark:bg-secondary-800">
                <div className="flex items-center mb-2">
                  <Award className="text-primary-500 mr-2" size={20} />
                  <h3 className="font-semibold">Sprint Podiums</h3>
                </div>
                <p className="text-3xl font-bold font-mono">{driver.sprintPodiums}</p>
              </div>
              
              <div className="card p-4 bg-secondary-50 dark:bg-secondary-800">
                <div className="flex items-center mb-2">
                  <Flag className="text-green-500 mr-2" size={20} />
                  <h3 className="font-semibold">Sprint Races</h3>
                </div>
                <p className="text-3xl font-bold font-mono">{driver.sprintRaces}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DriverDetailsPage;