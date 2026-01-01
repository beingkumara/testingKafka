import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Trophy,
  Flag,
  ChevronLeft,
  AlertCircle,
  Timer,
  Layers,
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
    image?: string;
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
        if (!id) throw new Error('Race ID is required');
        setIsLoading(true);
        const data = await getRaceById(id);
        if (!data || !data.raceName) throw new Error('Incomplete race data');
        setRaceDetails(data);
      } catch (error) {
        console.error('Error fetching race details:', error);
        setError('Failed to load race details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRaceDetails();
  }, [id]);

  if (isLoading) return <LoadingScreen />;

  if (error || !raceDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Race Data Unavailable</h2>
        <Link to="/races" className="btn-primary flex items-center gap-2 mt-4">
          <ChevronLeft className="w-4 h-4" /> Return to Calendar
        </Link>
      </div>
    );
  }

  const isUpcoming = new Date(`${raceDetails.date}T${raceDetails.time}`) > new Date();

  // Helper for Session Rows
  const SessionRow = ({ name, date, time }: { name: string, date: string, time: string }) => (
    <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 transition-colors rounded">
      <div className="flex items-center gap-3">
        <div className={`w-1 h-8 rounded-full ${name.includes('Race') ? 'bg-primary-500' : name.includes('Qualifying') ? 'bg-accent-500' : 'bg-gray-600'}`}></div>
        <div>
          <div className="font-bold text-sm text-white uppercase tracking-wide">{name}</div>
          <div className="text-[10px] text-gray-500 font-mono">{new Date(date).toLocaleDateString()}</div>
        </div>
      </div>
      <div className="font-mono text-sm text-white bg-dark-800 px-2 py-1 rounded border border-white/10">
        {time ? time.slice(0, 5) : 'TBA'}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-12"
    >
      <div className="container-f1 mb-6">
        <Link to="/races" className="text-gray-400 hover:text-white transition-colors flex items-center text-xs font-heading uppercase tracking-widest">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Calendar
        </Link>
      </div>

      {/* Hero Header */}
      <div className="relative min-h-[300px] flex items-end overflow-hidden mb-8 border-y border-white/5 bg-dark-900">
        <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent z-10"></div>

        <div className="container-f1 relative z-20 w-full flex flex-col md:flex-row items-end justify-between pb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 text-primary-500 font-bold uppercase tracking-widest text-xs mb-2">
              <span className="border border-primary-500/50 px-2 py-0.5 rounded bg-primary-900/20">Round {raceDetails.round}</span>
              <span>{raceDetails.season} Season</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white uppercase italic leading-none mb-2">
              {raceDetails.raceName.replace('Grand Prix', '')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Grand Prix</span>
            </h1>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-primary-500" /> {raceDetails.circuit.circuitName}</div>
              <div className="flex items-center gap-1"><Flag className="w-4 h-4 text-white" /> {raceDetails.circuit.location.country}</div>
            </div>
          </div>

          <div className="text-right">
            {isUpcoming ? (
              <div className="bg-primary-600/20 border border-primary-500/50 p-4 rounded backdrop-blur-sm">
                <div className="text-xs text-primary-400 uppercase tracking-widest mb-1">Race Start</div>
                <div className="font-mono text-3xl font-bold text-white">{new Date(raceDetails.date).toLocaleDateString()}</div>
                <div className="font-mono text-xl text-white">{raceDetails.time?.slice(0, 5)} <span className="text-xs text-gray-400">LOCAL</span></div>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 p-4 rounded backdrop-blur-sm">
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Status</div>
                <div className="font-heading text-2xl font-bold text-white uppercase flex items-center gap-2">
                  <Flag className="w-5 h-5 text-green-500" /> Completed
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-f1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Circuit & Actions */}
        <div className="space-y-6">
          <div className="telemetry-card">
            <h3 className="text-sm font-heading font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Track Layout</h3>
            <div className="bg-white/5 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
              {/* Placeholder for circuit map - in real app would rely on raceDetails.circuit.url or local asset */}
              <img
                src={raceDetails.circuit.image || raceDetails.circuit.url}
                alt="Circuit Map"
                className="w-full h-full object-contain invert opacity-80"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 p-2 rounded">
                <div className="text-gray-500">First GP</div>
                <div className="text-white font-mono">1970</div>
              </div>
              <div className="bg-white/5 p-2 rounded">
                <div className="text-gray-500">Laps</div>
                <div className="text-white font-mono">71</div>
              </div>
            </div>
          </div>

          <div className="telemetry-card space-y-3">
            <h3 className="text-sm font-heading font-bold text-white uppercase tracking-widest mb-2">Race Hub</h3>
            {!isUpcoming && (
              <Link to={`/race-results?season=${raceDetails.season}&round=${raceDetails.round}`} className="btn-primary w-full flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4" /> Full Results
              </Link>
            )}
            <a href={raceDetails.url} target="_blank" rel="noreferrer" className="btn-secondary w-full flex items-center justify-center gap-2 bg-dark-800 hover:bg-dark-700">
              <Layers className="w-4 h-4" /> Wiki Article
            </a>
          </div>
        </div>

        {/* Right Column: Schedule */}
        <div className="lg:col-span-2">
          <div className="telemetry-card">
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <Timer className="w-5 h-5 text-accent-500" />
              <h2 className="font-heading text-lg text-white uppercase tracking-widest">Weekend Schedule</h2>
            </div>

            <div className="space-y-1">
              <SessionRow name="Practice 1" date={raceDetails.firstPractice?.date} time={raceDetails.firstPractice?.time} />
              <SessionRow name="Practice 2" date={raceDetails.secondPractice?.date} time={raceDetails.secondPractice?.time} />
              <SessionRow name="Practice 3" date={raceDetails.thirdPractice?.date} time={raceDetails.thirdPractice?.time} />
              <SessionRow name="Qualifying" date={raceDetails.qualifying?.date} time={raceDetails.qualifying?.time} />
              <div className="mt-4 pt-2">
                <SessionRow name="Grand Prix" date={raceDetails.date} time={raceDetails.time} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RaceDetailsPage;