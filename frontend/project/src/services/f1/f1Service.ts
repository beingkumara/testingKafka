/**
 * Formula 1 Data Service
 * 
 * This service handles all F1-related API calls and data transformations.
 */
import { f1Api } from '../api';
import { 
  Driver, 
  DriverFromAPI, 
  DriverStanding, 
  ConstructorStanding,
  Race,
  RaceResult,
  RaceResultFromAPI,
  RaceFromAPI
} from '../../types/f1.types';

/**
 * Utility for simulating network delay in development
 * @param ms - Milliseconds to delay
 */
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches current driver standings
 * @returns Promise with driver standings data
 */
export const getDriverStandings = async (): Promise<DriverStanding[]> => {
  try {
    const data = await f1Api.get<any[]>('/driver-standings');
    
    return data.map((standing: any) => ({
      id: standing.driverId,
      position: standing.position,
      name: standing.fullName,
      team: standing.teamName,
      points: standing.points,
      wins: standing.wins,
      podiums: standing.podiums,
    }));
  } catch (error) {
    console.error('Error fetching driver standings:', error);
    return [];
  }
};

/**
 * Fetches current constructor standings
 * @returns Promise with constructor standings data
 */
export const getConstructorStandings = async (): Promise<ConstructorStanding[]> => {
  try {
    const data = await f1Api.get<any[]>('/constructor-standings');
    
    return data.map((standing: any) => ({
      id: standing.constructorId,
      position: standing.position,
      name: standing.name,
      points: standing.points,
      wins: standing.wins,
      podiums: standing.podiums,
      color: standing.color,
    }));
  } catch (error) {
    console.error('Error fetching constructor standings:', error);
    return [];
  }
};

/**
 * Fetches results from the most recent race
 * @returns Promise with race results data
 */
export const getLastRaceResults = async (): Promise<RaceResult[]> => {
  try {
    await delay(800); // Simulated network delay
    const data = await f1Api.get<RaceResultFromAPI[]>('/latest-race-results');
    
    return data.map((result: RaceResultFromAPI) => ({
      position: parseInt(result.position, 10),
      driver: result.Driver.givenName,
      team: result.Constructor.name,
      time: result.Time ? result.Time.time : 'N/A',
      points: parseInt(result.points, 10)
    }));
  } catch (error) {
    console.error('Error fetching last race results:', error);
    throw error;
  }
};

/**
 * Fetches all current F1 drivers
 * @returns Promise with drivers data
 */
export const getDrivers = async (): Promise<Driver[]> => {
  try {
    const data = await f1Api.get<DriverFromAPI[]>('/currentDrivers');
    
    return data.map((driver: DriverFromAPI) => {
      // Use driverId if available, otherwise fallback to _id
      const driverId = driver.driverId || driver._id;
      
      return {
        id: driverId,
        name: driver.fullName,
        number: parseInt(driver.driverNumber),
        team: driver.teamName,
        nationality: driver.nationality,
        points: driver.points,
        wins: driver.wins,
        podiums: driver.podiums,
        image: driver.headshot_url
      };
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }
};

/**
 * Fetches detailed information about a specific driver
 * @param id - Driver ID
 * @returns Promise with driver details
 */
export const getDriverById = async (id: string): Promise<any> => {
  try {
    return await f1Api.get<any>(`/drivers/${id}`);
  } catch (error) {
    console.error('Error fetching driver details:', error);
    throw error;
  }
};

/**
 * Fetches all races for the current season
 * @returns Promise with races data
 */
export const getRaces = async (): Promise<Race[]> => {
  try {
    const data = await f1Api.get<RaceFromAPI[]>('/races');
    
    return data.map((race: RaceFromAPI) => { 
      const raceDateTime = new Date(`${race.date}T${race.time}`);
      const now = new Date();
      
      return {
        id: race.id,
        name: race.raceName,
        date: race.date,
        time: race.time,
        country: race.Circuit.Location.country,
        circuit: race.Circuit.circuitName,
        completed: now > raceDateTime,
        image: race.Circuit.url,
      };
    });
  } catch (error) {
    console.error('Error fetching races:', error);
    return [];
  }
};

/**
 * Fetches race results for a specific year and round
 * @param year - Season year (1951-2025)
 * @param round - Race round number (1-24)
 * @returns Promise with race results data
 */
export const getRaceResultsByYearAndRound = async (year: number, round: number): Promise<RaceResult[]> => {
  try {
    await delay(600); // Simulated network delay
    const data = await f1Api.get<{driver: string, constructor: string, position: string, points: string, time?: string}[]>(`/results/${year}/${round}`);
    
    return data.map(result => ({
      position: parseInt(result.position, 10),
      driver: result.driver,
      team: result.constructor,
      time: result.time || 'N/A',
      points: parseInt(result.points, 10),
      status: 'Finished',
      circuit: result.circuit || 'Unknown Circuit',
    }));
  } catch (error) {
    console.error(`Error fetching race results for ${year} round ${round}:`, error);
    return [];
  }
};