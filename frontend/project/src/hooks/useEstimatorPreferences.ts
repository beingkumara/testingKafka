import { useState } from 'react';

export type BudgetTier = 'budget' | 'standard' | 'luxury';

export interface EstimatorPreferences {
  originName: string;
  originIata: string;
  budgetTier: BudgetTier;
  currency: string;
}

const DEFAULT_PREFERENCES: EstimatorPreferences = {
  originName: 'London Heathrow',
  originIata: 'LHR',
  budgetTier: 'standard',
  currency: 'USD',
};

export const useEstimatorPreferences = () => {
  const [preferences, setPreferencesState] = useState<EstimatorPreferences>(() => {
    try {

      const item = window.localStorage.getItem('f1_estimator_preferences');
      if (item) {
        const parsed = JSON.parse(item);
        if (parsed.originCity) {
           parsed.originName = parsed.originCity;
           parsed.originIata = 'LHR';
           delete parsed.originCity;
        }
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
      return DEFAULT_PREFERENCES;

    } catch (error) {
      console.warn('Error reading localStorage', error);
      return DEFAULT_PREFERENCES;
    }
  });

  const setPreferences = (newPrefs: Partial<EstimatorPreferences>) => {
    setPreferencesState((prev) => {
      const updated = { ...prev, ...newPrefs };
      try {
        window.localStorage.setItem('f1_estimator_preferences', JSON.stringify(updated));
      } catch (error) {
        console.warn('Error setting localStorage', error);
      }
      return updated;
    });
  };

  return { preferences, setPreferences };
};
