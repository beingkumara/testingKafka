import React from 'react';
import { BudgetTier } from '../../hooks/useEstimatorPreferences';

interface BudgetTierSelectorProps {
  value: BudgetTier;
  onChange: (tier: BudgetTier) => void;
}

export const BudgetTierSelector: React.FC<BudgetTierSelectorProps> = ({ value, onChange }) => {
  const tiers: { id: BudgetTier; label: string }[] = [
    { id: 'budget', label: 'Budget' },
    { id: 'standard', label: 'Standard' },
    { id: 'luxury', label: 'Luxury' },
  ];

  return (
    <div>
      <div className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold">Travel Style</div>
      <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
        {tiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => onChange(tier.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
              value === tier.id
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tier.label}
          </button>
        ))}
      </div>
    </div>
  );
};
