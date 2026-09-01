// API Connectors for Travel and Cost of Living Data
// Integration: Duffel API (Flights) & WhereNext (Cost of living fallback)

export interface FlightSource {
  airlineName: string;
  airlineLogo: string;
  verifyUrl: string;
  provider: string;
}

export interface RealTimeTripEstimates {
  travel: number;
  hotel: number;
  food: number;
  tickets: number;
  other: number;
  flightSource?: FlightSource;
}

// -------------------------------------------------------------
// Duffel API - Requires API Key
// https://duffel.com/docs/api
// -------------------------------------------------------------
export const fetchDuffelFlightPrice = async (originIata: string, destinationIata: string): Promise<{ price: number; source?: FlightSource }> => {
  try {
    const url = `/api/duffel/air/offer_requests?return_offers=true`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          slices: [{ origin: originIata, destination: destinationIata, departure_date: '2026-10-15' }, { origin: destinationIata, destination: originIata, departure_date: '2026-10-18' }],
          passengers: [{ type: 'adult' }],
          cabin_class: 'economy'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Duffel API failed with status: ${response.status}`);
    }

    const json = await response.json();
    console.log('[Duffel API] Raw Response:', json);
    
    const offers = json.data?.offers || [];
    console.log('[Duffel API] Number of offers returned:', offers.length);
    
    if (offers.length > 0) {
      const bestOffer = offers[0];
      let price = parseFloat(bestOffer.total_amount);
      const currency = bestOffer.total_currency;
      
      // Sandbox dummy flights often return in GBP. Convert to USD baseline for our frontend.
      if (currency === 'GBP') price *= 1.25;
      else if (currency === 'EUR') price *= 1.10;
      
      const owner = bestOffer.owner || {};
      const airlineName = owner.name || 'Unknown Airline';
      const airlineLogo = owner.logo_symbol_url || '';
      
      // Sandbox dummy flights are artificially cheap (often £30). Let's pad it for realism in the demo
      if (airlineName === 'Duffel Airways' && price < 150) {
        price += 350; // realistic baseline padding
      }
      
      console.log('[Duffel API] Using live flight price (USD normalized):', price);

      const verifyUrl = owner.conditions_of_carriage_url && !owner.conditions_of_carriage_url.includes('dummy') ? owner.conditions_of_carriage_url : `https://www.google.com/search?q=${encodeURIComponent(airlineName + ' Official Website')}`;

      return { 
        price, 
        source: {
          airlineName,
          airlineLogo,
          verifyUrl,
          provider: 'Duffel API'
        } 
      };
    }
    
    console.warn('[Duffel API] No offers found, falling back to 400');
    return { price: 400 }; 
  } catch (error) {
    console.error('Flight API error:', error);
    return { price: 400 }; 
  }
};

// -------------------------------------------------------------

export const searchOriginPlaces = async (query: string) => {
  try {
    const res = await fetch(`/api/duffel/places/suggestions?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('API failed or API key not set');
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn('No Duffel API key provided on server or fetch failed. Using fallback airports.');
    const q = query.toLowerCase();
    const fallbackAirports = [
      { id: '1', name: 'Dubai International Airport', iata_code: 'DXB', type: 'airport' },
      { id: '2', name: 'London Heathrow Airport', iata_code: 'LHR', type: 'airport' },
      { id: '3', name: 'John F. Kennedy International Airport', iata_code: 'JFK', type: 'airport' },
      { id: '4', name: 'Singapore Changi Airport', iata_code: 'SIN', type: 'airport' },
      { id: '5', name: 'Tokyo Haneda Airport', iata_code: 'HND', type: 'airport' },
      { id: '6', name: 'Abu Dhabi International Airport', iata_code: 'AUH', type: 'airport' },
      { id: '7', name: 'Doha Hamad International Airport', iata_code: 'DOH', type: 'airport' },
      { id: '8', name: 'Mumbai Chhatrapati Shivaji Airport', iata_code: 'BOM', type: 'airport' },
      { id: '9', name: 'Delhi Indira Gandhi Airport', iata_code: 'DEL', type: 'airport' },
      { id: '10', name: 'Los Angeles International Airport', iata_code: 'LAX', type: 'airport' },
      { id: '11', name: 'Paris Charles de Gaulle Airport', iata_code: 'CDG', type: 'airport' },
      { id: '12', name: 'Amsterdam Airport Schiphol', iata_code: 'AMS', type: 'airport' }
    ];
    return fallbackAirports.filter(a => a.name.toLowerCase().includes(q) || a.iata_code.toLowerCase().includes(q));
  }
};

// Main Estimator Orchestrator
// -------------------------------------------------------------
export const fetchTripEstimates = async (
  raceId: string, 
  originIata: string,
  budgetTier: 'budget' | 'standard' | 'luxury'
): Promise<RealTimeTripEstimates> => {

  const raceDestinations: Record<string, string> = {
    'silverstone': 'LHR',
    'qatar': 'DOH',
    'abudhabi': 'AUH'
  };
  const destIata = raceDestinations[raceId.toLowerCase()] || 'AUH';
  const { price: flightPrice, source: flightSource } = await fetchDuffelFlightPrice(originIata, destIata);

  let baseHotel = 600;
  let baseFood = 250;
  let baseTickets = 300;
  let baseOther = 100;

  try {
    const res = await fetch('/api/live-costs');
    if (res.ok) {
      const liveData = await res.json();
      baseHotel = liveData.hotel || 600;
      baseFood = liveData.food || 250;
      baseTickets = liveData.tickets || 300;
      console.log('[Live Data Scraper] Fetched real values:', liveData);
    }
  } catch (err) {
    console.error('Failed to fetch live costs:', err);
  }

  const tierMultipliers = { budget: 0.6, standard: 1.0, luxury: 2.5 };
  const multiplier = tierMultipliers[budgetTier] || 1.0;

  return {
    travel: flightPrice * (budgetTier === 'luxury' ? 2.5 : 1.0), // Don't discount flights for budget, they are fixed costs
    hotel: baseHotel * multiplier,
    food: baseFood * multiplier,
    tickets: baseTickets * (budgetTier === 'luxury' ? 3 : 1),
    other: baseOther * multiplier,
    flightSource
  };
};
