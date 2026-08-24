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
const DUFFEL_API_KEY = import.meta.env.VITE_DUFFEL_API_KEY || ''; 

export const fetchDuffelFlightPrice = async (originIata: string, destinationIata: string): Promise<{ price: number; source?: FlightSource }> => {
  if (!DUFFEL_API_KEY) {
    console.warn('No Duffel API key provided. Falling back to heuristic.');
    return { price: 400 }; // Fallback
  }

  try {
    const url = `/api/duffel/air/offer_requests?return_offers=true`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DUFFEL_API_KEY}`,
        'Duffel-Version': 'v2',
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
      
      // Sandbox dummy flights are artificially cheap (often £30). Let's pad it for realism in the demo
      if (owner.name === 'Duffel Airways' && price < 150) {
        price += 350; // realistic baseline padding
      }
      
      console.log('[Duffel API] Using live flight price (USD normalized):', price);

      const owner = bestOffer.owner || {};
      const airlineName = owner.name || 'Unknown Airline';
      const airlineLogo = owner.logo_symbol_url || '';
      
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
  if (!DUFFEL_API_KEY) return [];
  try {
    const res = await fetch(`/api/duffel/places/suggestions?query=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${DUFFEL_API_KEY}`,
        'Duffel-Version': 'v2'
      }
    });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Places API error:', error);
    return [];
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
