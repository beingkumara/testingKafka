import { useQuery } from '@tanstack/react-query';
import {
    getDriverStandings,
    getConstructorStandings,
    getRaces,
    getLastRaceResults,
    getRaceResultsByYearAndRound
} from '../services';
import {
    Driver,
    DriverStanding,
    ConstructorStanding,
    Race,
    RaceResult
} from '../types/f1.types';

// Query Keys
export const QUERY_KEYS = {
    DRIVER_STANDINGS: 'driverStandings',
    CONSTRUCTOR_STANDINGS: 'constructorStandings',
    RACES: 'races',
    LAST_RACE_RESULTS: 'lastRaceResults',
};

/**
 * Hook to fetch driver standings
 */
export const useDriverStandings = () => {
    return useQuery<DriverStanding[], Error>({
        queryKey: [QUERY_KEYS.DRIVER_STANDINGS],
        queryFn: getDriverStandings,
        staleTime: 3600000, // 1 hour
        gcTime: 3600000, // 1 hour
    });
};

/**
 * Hook to fetch constructor standings
 */
export const useConstructorStandings = () => {
    return useQuery<ConstructorStanding[], Error>({
        queryKey: [QUERY_KEYS.CONSTRUCTOR_STANDINGS],
        queryFn: getConstructorStandings,
        staleTime: 3600000, // 1 hour
        gcTime: 3600000, // 1 hour
    });
};

/**
 * Hook to fetch races
 */
export const useRaces = () => {
    return useQuery<Race[], Error>({
        queryKey: [QUERY_KEYS.RACES],
        queryFn: getRaces,
        staleTime: 3600000, // 1 hour
        gcTime: 3600000, // 1 hour
    });
};

/**
 * Hook to fetch last race results
 */
export const useLastRaceResults = (year?: number, round?: number) => {
    return useQuery<RaceResult[], Error>({
        queryKey: [QUERY_KEYS.LAST_RACE_RESULTS, year, round],
        queryFn: () => {
            if (year && round) {
                return getRaceResultsByYearAndRound(year, round);
            }
            return getLastRaceResults();
        },
        staleTime: 300000, // 5 minutes
        gcTime: 300000, // 5 minutes
    });
};
