import { useQuery } from '@tanstack/react-query';
import { fetchLatestExchangeRates } from '../services/api/currency.service';

export const useExchangeRates = () => {
  return useQuery({
    queryKey: ['exchangeRates'],
    queryFn: () => fetchLatestExchangeRates('USD'),
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2, // Retry twice on failure
  });
};
