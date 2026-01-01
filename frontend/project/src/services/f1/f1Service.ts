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
  RaceFromAPI,
  RaceResultForYearAndRound,
  NewsArticle
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
      positionsMoved: standing.positionsMoved,
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
      positionsMoved: standing.positionsMoved,
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
    console.log('[getLastRaceResults] API response:', data);

    return data.map((result: RaceResultFromAPI) => ({
      position: parseInt(result.position, 10),
      driver: result.Driver.givenName,
      team: result.Constructor.name,
      time: result.Time ? result.Time.time : 'N/A',
      points: parseInt(result.points, 10),
      // Added new fields
      raceName: result.raceName,
      date: result.date,
      circuit: '', // Default or fetch if needed
      fastestLap: '' // Default or fetch if needed
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
      const driverId = (driver as any).driverId || driver._id;

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
    console.error('Error in getDrivers function:', error);
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
    return await f1Api.get<any>(`/drivers/${id}`, true);
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
        round: parseInt(race.round),
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
    await delay(600);
    const data = await f1Api.get<Array<{
      [key: string]: string;
    }>>(`/results/${year}/${round}`);

    if (data.length <= 1) { // First item is race details, so we need at least 2 items
      return [];
    }

    const raceDetails = data[0]; // First item contains race details
    const results = data.slice(1); // Remaining items are race results

    return results.map((result, index) => {
      const position = result.position && !isNaN(parseInt(result.position, 10))
        ? parseInt(result.position, 10)
        : index + 1;

      return {
        position,
        driver: result.driver || 'Unknown Driver',
        team: result['constructor'] || 'Unknown Team',
        time: result.time || 'N/A',
        fastestLap: result.fastestLap || 'N/A',
        points: parseInt(result.points, 10) || 0,
        status: result.time ? 'Finished' : (result.time || 'DNF'), // Using time to determine status
        circuit: raceDetails.circuit || 'Unknown Circuit',
        date: raceDetails.date || 'Unknown Date',
        raceName: `Round ${round}` // We can add this if needed
      };
    });
  } catch (error) {
    console.error(`Error fetching race results for ${year} round ${round}:`, error);
    return [];
  }
};

/**
 * Fetches detailed information about a specific race
 * @param id - Race ID
 * @returns Promise with race details
 */
export const getRaceById = async (id: string): Promise<any> => {
  try {
    // Get race data from the backend
    const data = await f1Api.get<any>(`/races/${id}`);

    // Check if we received valid data
    if (!data || Object.keys(data).length === 0) {
      throw new Error(`No data received for race ID: ${id}`);
    }

    // Transform the data to match the expected structure in the frontend
    return {
      _id: data.id || id,
      season: data.season || '',
      round: data.round || '',
      url: data.url || '',
      raceName: data.raceName || `Race ${id}`,
      date: data.date || '',
      time: data.time || '',
      circuit: {
        circuitId: data.Circuit?.circuitId || '',
        url: data.Circuit?.url || '',
        circuitName: data.Circuit?.circuitName || 'Unknown Circuit',
        location: {
          lat: data.Circuit?.Location?.lat || '',
          _long: data.Circuit?.Location?.long || '', // Note: backend uses 'long', frontend expects '_long'
          locality: data.Circuit?.Location?.locality || '',
          country: data.Circuit?.Location?.country || ''
        }
      },
      // Map the practice sessions (backend uses capitalized names)
      firstPractice: data.FirstPractice || { date: '', time: '' },
      secondPractice: data.SecondPractice || { date: '', time: '' },
      thirdPractice: data.ThirdPractice || { date: '', time: '' },
      qualifying: data.Qualifying || { date: '', time: '' },
      standingsUpdated: data.standingsUpdated || false
    };
  } catch (error) {
    console.error('Error fetching race details:', error);
    // Provide more context in the error
    if (error instanceof Error) {
      throw new Error(`Failed to fetch race details for ID ${id}: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch race details for ID ${id}`);
    }
  }
};

/**
 * Fetches F1 news articles with optional filters
 * @param params - Optional filter parameters
 * @returns Promise with news articles and total count
 */
interface NewsParams {
  constructorName?: string;  // Changed from 'constructor' to avoid reserved keyword
  driver?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export interface NewsResponse {
  articles: NewsArticle[];
  totalCount: number;
  hasMore: boolean;
}

export const getF1News = async (params: NewsParams = {}): Promise<NewsResponse> => {
  try {
    await delay(800); // Simulated network delay

    // Build query parameters
    const queryParams = new URLSearchParams();
    // Combine constructor and driver into ticket parameter
    const ticketParts = [];
    if (params.constructorName) ticketParts.push(`constructor:${params.constructorName}`);
    if (params.driver) ticketParts.push(`driver:${params.driver}`);
    if (ticketParts.length > 0) {
      queryParams.append('ticket', ticketParts.join(','));
    }
    if (params.fromDate) queryParams.append('from', params.fromDate);
    if (params.toDate) queryParams.append('to', params.toDate);

    // Add pagination parameters
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());

    // Construct the URL with query parameters
    const url = `/news/latest${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    try {
      // Fetch news data
      const response = await f1Api.get<any[]>(url);

      // Transform the API response to match NewsArticle type
      const data: NewsArticle[] = response.map(item => ({
        title: item.title,
        description: item.description,
        url: item.url,
        urlToImage: item.urlToImage,
        publishedAt: item.publishedAt,
        content: item.content || item.description,
        source: {
          id: item.source?.id || null,
          name: item.source?.name || 'Unknown Source'
        }
      }));

      // Determine if there are more articles
      const hasMore = data.length === pageSize;

      return {
        articles: data,
        totalCount: data.length + (hasMore ? (page * pageSize) : 0),
        hasMore
      };
    } catch (apiError) {
      console.error('Error fetching F1 news:', apiError);

      // Return mock data when API fails
      return {
        articles: [
          {
            title: 'F1 News Sample - API Currently Unavailable',
            description: 'This is a placeholder while the API connection is being established.',
            content: 'The F1 news API is currently unavailable. This is sample content to allow the application to function.',
            publishedAt: new Date().toISOString(),
            url: '#',
            urlToImage: 'https://via.placeholder.com/800x400?text=F1+News',
            source: {
              id: null,
              name: 'System'
            }
          }
        ],
        totalCount: 1,
        hasMore: false
      };
    }
  } catch (error) {
    console.error('Error in getF1News function:', error);
    return {
      articles: [],
      totalCount: 0,
      hasMore: false
    };
  }
};