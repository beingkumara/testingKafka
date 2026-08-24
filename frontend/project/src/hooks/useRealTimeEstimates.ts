import { useQuery } from '@tanstack/react-query';
import { BudgetTier } from './useEstimatorPreferences';
import { fetchTripEstimates, FlightSource } from '../services/api/travel.service';

export interface TripEstimates {
  travel: number;
  hotel: number;
  food: number;
  tickets: number;
  other: number;
  total: number;
  flightSource?: FlightSource;
}

export const useRealTimeEstimates = (
  raceId: string,
  originIata: string,
  budgetTier: BudgetTier
) => {
  return useQuery({
    queryKey: ['tripEstimates', raceId, originIata, budgetTier],
    queryFn: async () => {
      // Use the newly built connector service
      const estimates = await fetchTripEstimates(raceId, originIata, budgetTier);
      
      const total = 
        estimates.travel + 
        estimates.hotel + 
        estimates.food + 
        estimates.tickets + 
        estimates.other;

      return {
        ...estimates,
        total,
      };
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: 1, // Minimize aggressive retries to save RapidAPI quota
  });
};
