/**
 * Formula 1 related types
 */

export interface Driver {
  id: string;
  name: string;
  number: number;
  team: string;
  nationality: string;
  points: number;
  wins: number;
  podiums: number;
  image: string;
}

export interface DriverFromAPI {
  _id: string;
  driverNumber: string;
  fullName: string;
  teamName: string;
  nationality: string;
  points: number;
  wins: number;
  podiums: number;
  headshot_url: string;
}

export interface DriverStanding {
  id: string;
  position: number;
  name: string;
  team: string;
  points: number;
  wins: number;
  podiums: number;
}

export interface CircuitGuide {
  id: string;
  circuitId: string;
  circuitName: string;
  country: string;
  summary: string;
  bestGrandstands: string[];
  transportTips: string[];
  localAttractions: string[];
  hiddenGems: string[];
  currency: string;
  timezone: string;
  firstGrandPrix?: number;
  numberOfLaps?: number;
}

export interface ConstructorStanding {
  id: string;
  position: number;
  name: string;
  points: number;
  wins: number;
  podiums: number;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
  source: {
    id: string | null;
    name: string;
  };
}

export interface Race {
  id: string;
  name: string;
  date: string;
  time: string;
  country: string;
  circuit: string;
  round: number;
  completed: boolean;
  image: string;
  latitude: number;
  longitude: number;
}

export interface RaceFromAPI {
  id: string;
  round: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time: string;
  country: string;
  completed: boolean;
  image: string;
  circuitImageUrl?: string;
}

export interface Circuit {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: Location;
  image: string;
}

export interface Location {
  lat: string;
  long: string;
  locality: string;
  country: string;
}

export interface RaceResult {
  position: number;
  driver: string;
  team: string;
  time: string;
  points: number;
  status?: string;
  circuit: string;
  fastestLap: string;
  date: string;
  raceName: string;
}

export interface RaceResultFromAPI {
  position: string;
  number: string;
  positionText: string;
  points: string;
  grid: string;
  laps: string;
  status: string;
  Time: {
    millis: string;
    time: string;
  };
  Driver: {
    driverId: string;
    permanentNumber: string;
    code: string;
    url: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
  };
  Constructor: {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
  };
  raceName: string;
  date: string;

}


export interface RaceDetails {
  circuit: string;
  date: string;
}

export interface RaceResultForYearAndRound {
  raceDetails: RaceDetails;
  results: RaceResult[];
}