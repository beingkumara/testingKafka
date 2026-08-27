import React from 'react';
import { TripEstimates } from '../../hooks/useRealTimeEstimates';
import { motion } from 'framer-motion';

interface CostBreakdownChartProps {
  estimates: TripEstimates;
  currencySymbol: string;
}

export const CostBreakdownChart: React.FC<CostBreakdownChartProps> = ({
  estimates,
  currencySymbol,
}) => {
  const { travel, hotel, food, tickets, other, total } = estimates;

  if (total === 0) return null;

  // Rich, vibrant tailwind colors for dark mode
  const categories = [
    { label: 'Travel', value: travel, color: 'bg-blue-500' },
    { label: 'Hotel', value: hotel, color: 'bg-emerald-400' },
    { label: 'Food', value: food, color: 'bg-amber-400' },
    { label: 'Tickets', value: tickets, color: 'bg-red-500' },
    { label: 'Other', value: other, color: 'bg-purple-400' },
  ];

  return (
    <div className="mt-8 pt-6 border-t border-white/10">
      <div className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-bold flex justify-between">
        <span>Cost Breakdown</span>
        <span className="text-gray-500 italic lowercase normal-case text-[10px]">*estimates only</span>
      </div>
      
      {/* Horizontal Stacked Bar Chart */}
      <div className="flex w-full h-4 rounded-full overflow-hidden bg-white/5 mb-6 shadow-inner">
        {categories.map((cat, idx) => {
          const widthPercent = (cat.value / total) * 100;
          if (widthPercent === 0) return null;
          return (
            <motion.div
              key={cat.label}
              initial={{ width: 0 }}
              animate={{ width: `${widthPercent}%` }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
              className={`h-full ${cat.color} hover:brightness-110 transition-all cursor-crosshair`}
              title={`${cat.label}: ${currencySymbol}${cat.value.toFixed(0)}`}
            />
          );
        })}
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {categories.map((cat) => (
          <div key={cat.label} className="flex flex-col items-start bg-black/20 p-2 rounded border border-white/5 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${cat.color}`} />
              <span className="text-xs text-gray-400">{cat.label}</span>
            </div>
            <span className="font-mono text-sm font-bold text-white pl-4">
              {currencySymbol}{cat.value.toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
