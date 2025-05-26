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

export interface ConstructorStanding {
  id: string;
  position: number;
  name: string;
  points: number;
  wins: number;
  podiums: number;
}

export interface Race {
  id: string;
  name: string;
  date: string;
  time: string;
  country: string;
  circuit: string;
  completed: boolean;
  image: string;
}

export interface RaceFromAPI {
  id: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time: string;
  country: string;
  completed: boolean;
  image: string;
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
}