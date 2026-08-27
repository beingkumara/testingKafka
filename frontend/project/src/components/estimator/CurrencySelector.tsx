import React from 'react';

interface CurrencySelectorProps {
  value: string;
  availableCurrencies: string[];
  onChange: (currency: string) => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  value,
  availableCurrencies,
  onChange,
}) => {
  return (
    <div>
      <div className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold">Currency</div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-black/40 border border-white/10 rounded-lg py-2 pl-4 pr-10 text-white font-mono text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors cursor-pointer hover:bg-white/5"
        >
          {availableCurrencies.map((curr) => (
            <option key={curr} value={curr} className="bg-gray-900 text-white">
              {curr}
            </option>
          ))}
        </select>
        {/* Custom Chevron for select */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
