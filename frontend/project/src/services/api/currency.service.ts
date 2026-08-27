// API Connector for Frankfurter Currency Exchange
// No API Key required for Frankfurter (https://api.frankfurter.app)

export interface ExchangeRates {
  [currencyCode: string]: number;
}

export interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: ExchangeRates;
}

export const fetchLatestExchangeRates = async (baseCurrency: string = 'USD'): Promise<ExchangeRates> => {
  try {
    const response = await fetch(`https://api.frankfurter.dev/v2/rates?base=${baseCurrency}`);
    
    if (!response.ok) {
      throw new Error(`Frankfurter API error: ${response.status}`);
    }

    const data = await response.json();
    const rates: ExchangeRates = {};
    
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        if (item.quote && item.rate) rates[item.quote] = item.rate;
      });
    } else if (data.rates) {
      Object.assign(rates, data.rates);
    }
    
    return {
      [baseCurrency]: 1.0,
      ...rates,
    };
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    throw error;
  }
};
