import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Droplets } from 'lucide-react';
import { searchStations } from '../../services/api';
import { SearchResult } from '../../types/api';

interface SearchInputProps {
  onStationSelect: (stationId: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({ onStationSelect, placeholder = "Search stations, districts, PIN codes...", className = "" }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchDebounced = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const searchResults = await searchStations(query);
          setResults(searchResults);
          setShowResults(true);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(searchDebounced);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    if (result.type === 'station') {
      onStationSelect(result.id);
      setQuery(result.name);
      setShowResults(false);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (resultsRef.current && !resultsRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00FFC2] focus:border-transparent outline-none transition-all"
          aria-label="Search for monitoring stations"
          aria-expanded={showResults}
          aria-haspopup="listbox"
          role="combobox"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin w-5 h-5 border-2 border-[#003F7F] border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50"
          role="listbox"
        >
          {results.map((result, index) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleResultSelect(result)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? 'bg-[#00FFC2]/10 border-[#00FFC2]/20' : ''
              }`}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <div className="flex-shrink-0">
                {result.type === 'station' ? (
                  <Droplets size={18} className="text-[#00FFC2]" />
                ) : (
                  <MapPin size={18} className="text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#003F7F] truncate">{result.name}</div>
                <div className="text-sm text-gray-500 truncate">{result.subtitle}</div>
              </div>
              
              {result.distance && (
                <div className="flex-shrink-0 text-xs text-gray-400">
                  {result.distance.toFixed(1)} km
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && !isLoading && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="text-center text-gray-500">
            <Search size={24} className="mx-auto mb-2 opacity-50" />
            <p>No stations found for "{query}"</p>
            <p className="text-sm mt-1">Try searching by station name, district, or PIN code</p>
          </div>
        </div>
      )}
    </div>
  );
}