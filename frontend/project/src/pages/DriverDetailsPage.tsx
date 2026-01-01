import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Flag, Trophy, Award, Star, Activity, Monitor } from 'lucide-react';
import { f1Api } from '../services/api';
import LoadingScreen from '../components/ui/LoadingScreen';

interface DriverDetails {
  _id: string;
  driverNumber: string;
  firstName: string;
  lastName: string;
  teamName: string;
  fullName: string;
  headshot_url: string;
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
        const data = await f1Api.get<DriverDetails>(`/drivers/${id}`);
        setDriver(data);
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-heading mb-4 text-white uppercase">Driver Not Found</h2>
        <p className="text-gray-400 mb-6">{error || 'Driver profile unavailable.'}</p>
        <button onClick={() => navigate('/drivers')} className="btn-primary">
          Return to Grid
        </button>
      </div>
    );
  }

  const getTeamColor = (team: string) => {
    const t = team.toLowerCase();
    if (t.includes('red bull')) return 'bg-blue-900';
    if (t.includes('ferrari')) return 'bg-red-700';
    if (t.includes('mercedes')) return 'bg-teal-600';
    if (t.includes('mclaren')) return 'bg-orange-500';
    if (t.includes('aston')) return 'bg-green-700';
    return 'bg-dark-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-12"
    >
      <div className="mb-6 container-f1">
        <button
          onClick={() => navigate('/drivers')}
          className="flex items-center text-gray-400 hover:text-white transition-colors uppercase font-heading text-xs tracking-widest"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Grid
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-[400px] flex items-end overflow-hidden mb-12 border-y border-white/5">
        <div className={`absolute inset-0 ${getTeamColor(driver.teamName)} opacity-20`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/images/carbon-fiber.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

        <div className="container-f1 relative z-10 w-full flex flex-col md:flex-row items-end justify-between pb-12 gap-8">
          <div className="flex items-end gap-6">
            {/* Driver Number */}
            <div className="relative">
              <span className="text-9xl font-heading font-bold text-white/5 absolute -bottom-8 -left-8 select-none z-0">
                {driver.driverNumber}
              </span>
              <div className="relative z-10 flex items-end">
                <div className="w-32 h-40 overflow-hidden rounded-lg border-2 border-white/10 shadow-2xl bg-dark-800 relative group">
                  <img src={driver.headshot_url} alt={driver.fullName} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = '/default-driver.jpg'} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 font-heading text-4xl text-white font-bold italic">{driver.driverNumber}</div>
                </div>
                <div className="ml-6 mb-2">
                  <h1 className="text-5xl md:text-6xl font-heading font-bold text-white uppercase italic leading-none mb-1">
                    {driver.firstName} <span className={`text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400`}>{driver.lastName}</span>
                  </h1>
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-primary-500 font-mono uppercase tracking-widest">{driver.teamName}</span>
                    {driver.isActive && <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-500 text-[10px] uppercase font-bold tracking-widest border border-green-500/30">Active Status</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="flex gap-8 border-l border-white/10 pl-8 mb-2">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Nationality</div>
              <div className="flex items-center gap-2 text-white font-medium">
                <Flag className="w-4 h-4 text-gray-400" /> {driver.nationality}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Age</div>
              <div className="flex items-center gap-2 text-white font-medium">
                <Calendar className="w-4 h-4 text-gray-400" /> {new Date().getFullYear() - new Date(driver.dateOfBirth).getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-f1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats Panel */}
        <div className="lg:col-span-2 space-y-8">
          <div className="telemetry-card bg-dark-800/20">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <Activity className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-heading uppercase tracking-widest text-white">Career Performance</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatBox label="Types.Wins" value={driver.wins} icon={<Trophy className="text-yellow-500" />} />
              <StatBox label="Podiums" value={driver.podiums} icon={<Award className="text-primary-500" />} />
              <StatBox label="Pole Positions" value={driver.poles} icon={<Star className="text-purple-500" />} />
              <StatBox label="Fastest Laps" value={driver.fastestLaps} icon={<Activity className="text-blue-500" />} />
              <StatBox label="Points" value={driver.points} highlight />
              <StatBox label="Races" value={driver.totalRaces} icon={<Flag className="text-green-500" />} />
            </div>
          </div>

          {/* Sprint Stats */}
          <div className="telemetry-card bg-dark-800/20">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <Monitor className="w-5 h-5 text-accent-500" />
              <h2 className="text-lg font-heading uppercase tracking-widest text-white">Sprint Format</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatBox label="Sprint Wins" value={driver.sprintWins} />
              <StatBox label="Sprint Podiums" value={driver.sprintPodiums} />
              <StatBox label="Sprint Quali" value={driver.sprintRaces} />
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="telemetry-card p-6 bg-gradient-to-br from-dark-800 to-dark-900/50 border border-white/10">
            <h3 className="font-heading text-sm text-gray-400 uppercase tracking-widest mb-4">Driver Profile</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Full Name</span>
                <span className="text-white font-medium">{driver.firstName} {driver.lastName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Date of Birth</span>
                <span className="text-white font-medium">{new Date(driver.dateOfBirth).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Place of Birth</span>
                <span className="text-white font-medium">{driver.nationality}</span> {/* Assuming place of birth similar to nationality for now */}
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Car Number</span>
                <span className="text-white font-heading text-lg italic">{driver.driverNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper Component for Stats
const StatBox = ({ label, value, icon, highlight = false }: { label: string, value: number, icon?: React.ReactNode, highlight?: boolean }) => (
  <div className={`p-4 rounded border ${highlight ? 'bg-primary-900/20 border-primary-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'} transition-colors relative group`}>
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{label}</span>
      {icon && <span className="opacity-80 group-hover:opacity-100 transition-opacity">{icon}</span>}
    </div>
    <div className="font-heading text-2xl text-white font-bold">{value}</div>
    {highlight && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 animate-pulse"></div>}
  </div>
);

export default DriverDetailsPage;