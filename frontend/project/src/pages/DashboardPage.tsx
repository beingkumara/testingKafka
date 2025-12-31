import React from 'react';
import { motion } from 'framer-motion';
import LoadingScreen from '../components/ui/LoadingScreen';
import DriverStandingsCard from '../components/dashboard/DriverStandingsCard';
import RaceResultsCard from '../components/dashboard/RaceResultsCard';
import UpcomingRaceCard from '../components/dashboard/UpcomingRaceCard';
import { useDriverStandings, useRaces, useLastRaceResults } from '../hooks/useF1Data';
import { ShieldCheck, Zap } from 'lucide-react';

const DashboardPage: React.FC = () => {
  // Use React Query hooks
  const { data: drivers = [], isLoading: isLoadingDrivers } = useDriverStandings();
  const { data: races = [], isLoading: isLoadingRaces } = useRaces();
  const { data: results = [], isLoading: isLoadingResults } = useLastRaceResults();

  const isLoading = isLoadingDrivers || isLoadingRaces || isLoadingResults;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden min-h-[250px] flex items-center shadow-2xl group border border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541845157-a6d2d100d931?auto=format&fit=crop&q=80')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-dark-900/80 to-transparent"></div>

        <div className="relative z-10 p-8 md:p-12 max-w-2xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-primary-500 font-mono text-xs font-bold tracking-widest uppercase mb-2"
          >
            <Zap className="w-4 h-4 fill-current" /> Live Telemetry Feed
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 uppercase italic"
          >
            Race Control <span className="text-white/20">Dashboard</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-lg max-w-lg"
          >
            Comprehensive real-time analysis, driver statistics, and championship standings for the current Formula 1 season.
          </motion.p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Standings & Results (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="h-full"
            >
              <DriverStandingsCard drivers={drivers} />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="h-full"
            >
              <RaceResultsCard results={results} />
            </motion.div>
          </div>
        </div>

        {/* Right Column: Next Race (4 cols) */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <UpcomingRaceCard races={races} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;