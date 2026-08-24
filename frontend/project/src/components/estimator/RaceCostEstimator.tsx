import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useEstimatorPreferences } from '../../hooks/useEstimatorPreferences';
import { useRealTimeEstimates } from '../../hooks/useRealTimeEstimates';
import { useExchangeRates } from '../../hooks/useExchangeRates';

import { BudgetTierSelector } from './BudgetTierSelector';
import { OriginSelector } from './OriginSelector';
import { CurrencySelector } from './CurrencySelector';
import { CostBreakdownChart } from './CostBreakdownChart';

interface RaceCostEstimatorProps {
  raceId: string;
}

export const RaceCostEstimator: React.FC<RaceCostEstimatorProps> = ({ raceId }) => {
  const { preferences, setPreferences } = useEstimatorPreferences();
  const { data: estimates, isLoading: isEstimatesLoading, isError: isEstimatesError } = useRealTimeEstimates(
    raceId,
    preferences.originIata,
    preferences.budgetTier
  );
  
  const { data: exchangeRates, isLoading: isRatesLoading, isError: isRatesError } = useExchangeRates();

  const isLoading = isEstimatesLoading || isRatesLoading;
  const isError = isEstimatesError || isRatesError;

  // Perform currency conversion
  const rate = exchangeRates?.[preferences.currency] || 1.0;
  
  const convertedEstimates = estimates ? {
    travel: estimates.travel * rate,
    hotel: estimates.hotel * rate,
    food: estimates.food * rate,
    tickets: estimates.tickets * rate,
    other: estimates.other * rate,
    total: estimates.total * rate,
  } : null;

  const getSymbol = (currency: string) => {
    try {
      const parts = new Intl.NumberFormat('en-US', { style: 'currency', currency }).formatToParts(0);
      return parts.find(p => p.type === 'currency')?.value || currency + ' ';
    } catch (e) {
      return currency + ' ';
    }
  };

  const currencySymbol = getSymbol(preferences.currency);
  const availableCurrencies = exchangeRates ? Object.keys(exchangeRates) : ['USD']; // Cap at 30 for UI

  return (
    <div className="telemetry-card relative overflow-hidden group">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-all duration-700 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="font-heading text-xl font-bold text-white uppercase tracking-widest leading-none">
            Trip Cost Estimator
          </h2>
        </div>

        <p className="text-sm text-gray-400 mb-6 max-w-xl">
          Get real-time estimates for attending this Grand Prix. We fetch live flight data and combine it with average hotel and lifestyle costs to build your weekend budget.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <OriginSelector 
              name={preferences.originName}
              iata={preferences.originIata}
              onChange={(name, iata) => setPreferences({ originName: name, originIata: iata })}
            />
          </div>
          <div className="md:col-span-1">
            <BudgetTierSelector 
              value={preferences.budgetTier}
              onChange={(tier) => setPreferences({ budgetTier: tier })}
            />
          </div>
          <div className="md:col-span-1">
            <CurrencySelector 
              value={preferences.currency}
              availableCurrencies={availableCurrencies}
              onChange={(curr) => setPreferences({ currency: curr })}
            />
          </div>
        </div>

        <div className="min-h-[200px] flex flex-col justify-center bg-black/20 rounded-xl p-6 border border-white/5 relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-3" />
                <span className="text-xs text-red-500 uppercase tracking-widest animate-pulse font-mono">Fetching Live Data...</span>
              </motion.div>
            ) : isError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
              >
                <span className="text-red-400 mb-2">⚠️ Unable to fetch live data right now.</span>
                <span className="text-xs text-gray-500">Please try again later.</span>
              </motion.div>
            ) : convertedEstimates ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full"
              >
                <div className="text-center mb-2">
                  <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Estimated Total</div>
                  <div className="text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
                    {currencySymbol}{convertedEstimates.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                </div>

                <CostBreakdownChart 
                  estimates={convertedEstimates} 
                  currencySymbol={currencySymbol} 
                />

                {estimates.flightSource && (
                  <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {estimates.flightSource.airlineLogo && (
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1 overflow-hidden">
                          <img src={estimates.flightSource.airlineLogo} alt={estimates.flightSource.airlineName} className="object-contain w-full h-full" />
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-xs text-gray-400">Flight Data Provided By</p>
                        <p className="text-sm text-white font-medium">{estimates.flightSource.airlineName} <span className="text-gray-500 text-xs">(via {estimates.flightSource.provider})</span></p>
                      </div>
                    </div>
                    <a 
                      href={estimates.flightSource.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2 group/btn"
                    >
                      Verify Data
                      <svg className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                  </div>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
