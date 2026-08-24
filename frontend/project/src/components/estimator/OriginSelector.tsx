import React, { useState, useEffect, useRef } from 'react';
import { searchOriginPlaces } from '../../services/api/travel.service';

interface OriginSelectorProps {
  name: string;
  iata: string;
  onChange: (name: string, iata: string) => void;
}

export const OriginSelector: React.FC<OriginSelectorProps> = ({ name, iata, onChange }) => {
  const [query, setQuery] = useState(name);
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(name);
  }, [name]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery(name); // Revert to selected on blur
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [name]);

  useEffect(() => {
    if (!isOpen || query.length < 2) {
      setResults([]);
      return;
    }
    
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      const places = await searchOriginPlaces(query);
      // Filter out non-airports/cities or things without iata
      setResults(places.filter((p: any) => p.iata_code));
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, isOpen]);

  const handleSelect = (place: any) => {
    onChange(place.name, place.iata_code);
    setQuery(place.name);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2" ref={wrapperRef}>
      <label className="text-xs text-gray-400 uppercase tracking-widest font-mono">
        Flying From
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
          placeholder="Search any city or airport..."
        />
        
        {isOpen && (query.length >= 2) && (
          <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-white/10 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">
            {isSearching ? (
              <div className="px-4 py-3 text-sm text-gray-400">Searching...</div>
            ) : results.length > 0 ? (
              results.map((place) => (
                <button
                  key={place.id}
                  onClick={() => handleSelect(place)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                >
                  <div className="text-sm text-white">{place.name}</div>
                  <div className="text-xs text-gray-400">{place.iata_code} • {place.type}</div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400">No airports found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
