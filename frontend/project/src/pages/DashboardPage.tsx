import React from 'react';
import { motion } from 'framer-motion';
import LoadingScreen from '../components/ui/LoadingScreen';
import DriverStandingsCard from '../components/dashboard/DriverStandingsCard';
import RaceResultsCard from '../components/dashboard/RaceResultsCard';
import UpcomingRaceCard from '../components/dashboard/UpcomingRaceCard';
import { useDriverStandings, useRaces, useLastRaceResults } from '../hooks/useF1Data';

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
          <DriverStandingsCard drivers={drivers} />
          <RaceResultsCard results={results} />
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          <UpcomingRaceCard races={races} />
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;