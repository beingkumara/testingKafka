// Mock F1 data service

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Driver standings data
export const getDriverStandings = async (): Promise<DriverStanding[]> => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/driver-standings');

    if (!response.ok) {
      throw new Error(`Failed to fetch driver standings: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // Map backend fields to frontend structure
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

// Constructor standings data
export const getConstructorStandings = async (): Promise<ConstructorStanding[]> => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/constructor-standings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch constructor standings: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // Map backend fields to frontend structure
    return data.map((standing: any) => ({
      id: standing.constructorId,
      position: standing.position,
      name: standing.name,
      points: standing.points,
      wins: standing.wins,
      podiums: standing.podiums,
    }));
  } catch (error) {
    console.error('Error fetching constructor standings:', error);
    return [];
  }
};

// Races data


// Last race results
export const getLastRaceResults = async () => {
  await delay(800);
  const response = await fetch('http://localhost:8080/api/v1/latest-race-results');
  if (!response.ok) {
    throw new Error(`Failed to fetch last race results`);
  }
  const data: RaceResultFromAPI[] = await response.json();
  return data.map((result: RaceResultFromAPI) => ({
    position: parseInt(result.position, 10),
    driver: result.Driver.givenName,
    team: result.Constructor.name,
    time: result.Time
      ? result.Time.time + (result.Time.millis ? ` (${result.Time.millis} ms)` : '')
      : 'N/A',
    points: parseInt(result.points, 10)
  }));
};


// Drivers data
export const getDrivers = async (): Promise<Driver[]> => {
  const response = await fetch('http://localhost:8080/api/v1/currentDrivers');
  const data: DriverFromAPI[] = await response.json();
  console.log(data);
  return data.map((driver: DriverFromAPI) => ({
    id: driver._id,
    name: driver.fullName,
    number: parseInt(driver.driverNumber),
    team: driver.teamName,
    nationality: driver.nationality,
    points: driver.points,
    wins: driver.wins,
    podiums: driver.podiums,
    image: driver.headshot_url
  }));
};

export const getRaces = async () => {
  await delay(800);
  const response = await fetch("http://localhost:8080/api/v1/races");
  const data: Race[]  = await response.json();
  return data.map((race: Race) => { 
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
  
};


interface DriverFromAPI {
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

interface Driver {
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


interface DriverStanding {
  id: string; // Maps to driverId
  position: number;
  name: string; // Maps to fullName
  team: string; // Maps to teamName
  points: number;
  wins: number;
  podiums: number;
}

interface ConstructorStanding {
  id: string; // Maps to constructorId
  position: number;
  name: string;
  points: number;
  wins: number;
  podiums: number;
}

interface Race{
  id: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time: string;
  country: string;
  completed: boolean;
  image: string;
}

interface Circuit{
  circuitId: string;
  url : string;
  circuitName: string;
  Location: Location;
  image: string;
}

interface Location{
  lat: string;
  long: string;
  locality: string;
  country: string;
}



interface RaceResultFromAPI {
  position:  string;
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