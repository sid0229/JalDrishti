import React, { useState } from 'react';
import { Map, List, Download, Filter } from 'lucide-react';
import { Station } from '../../types/api';
import SearchInput from '../Search/SearchInput';
import StationCard from '../Station/StationCard';
import InteractiveMap from '../Map/InteractiveMap';

interface StationsPageProps {
  stations: Station[];
  onStationSelect: (station: Station) => void;
}

export default function StationsPage({ stations, onStationSelect }: StationsPageProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filteredStations, setFilteredStations] = useState(stations);
  const [filters, setFilters] = useState({
    status: 'all',
    state: 'all',
    alertLevel: 'all'
  });

  const handleStationSearch = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    if (station) {
      onStationSelect(station);
    }
  };

  const handleExport = () => {
    // Mock export functionality
    const csvContent = [
      ['Station ID', 'Name', 'State', 'District', 'Current Level', 'Status', 'Last Updated'],
      ...filteredStations.map(station => [
        station.id,
        station.name,
        station.location.state,
        station.location.district,
        station.currentLevel,
        station.status,
        new Date(station.lastUpdated).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jaldrishti_stations_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const applyFilters = () => {
    let filtered = stations;

    if (filters.status !== 'all') {
      filtered = filtered.filter(s => s.status === filters.status);
    }

    if (filters.state !== 'all') {
      filtered = filtered.filter(s => s.location.state === filters.state);
    }

    if (filters.alertLevel !== 'all') {
      filtered = filtered.filter(s => s.alertLevel === filters.alertLevel);
    }

    setFilteredStations(filtered);
  };

  const uniqueStates = [...new Set(stations.map(s => s.location.state))].sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#014d86]">Monitoring Stations</h2>
            <p className="text-gray-600">Search, filter, and explore groundwater monitoring stations</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#014d86] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#014d86]'
                }`}
              >
                <List size={16} />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'map'
                    ? 'bg-[#014d86] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#014d86]'
                }`}
              >
                <Map size={16} />
                <span>Map</span>
              </button>
            </div>
            
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 bg-[#2ca58d] text-white px-4 py-2 rounded-lg hover:bg-[#2ca58d]/90 transition-all"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
        <div className="space-y-4">
          <SearchInput
            onStationSelect={handleStationSearch}
            placeholder="Search by station name, district, PIN code, or coordinates..."
            className="w-full"
          />
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2ca58d] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="normal">Normal</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
              <option value="offline">Offline</option>
            </select>
            
            <select
              value={filters.state}
              onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2ca58d] focus:border-transparent"
            >
              <option value="all">All States</option>
              {uniqueStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            
            <select
              value={filters.alertLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, alertLevel: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2ca58d] focus:border-transparent"
            >
              <option value="all">All Alerts</option>
              <option value="none">No Alerts</option>
              <option value="drought">Drought</option>
              <option value="drawdown">Drawdown</option>
              <option value="recharge">Recharge</option>
            </select>
            
            <button
              onClick={applyFilters}
              className="bg-[#014d86] text-white px-4 py-2 rounded-lg hover:bg-[#014d86]/90 transition-all text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              onClick={onStationSelect}
            />
          ))}
          
          {filteredStations.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Map size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No stations found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      ) : (
        <InteractiveMap 
          stations={filteredStations} 
          onStationSelect={onStationSelect}
        />
      )}
    </div>
  );
}