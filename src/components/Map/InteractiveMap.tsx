import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ZoomIn, ZoomOut, Layers, Navigation } from 'lucide-react';
import { Station } from '../../types/api';

interface InteractiveMapProps {
  stations: Station[];
  onStationSelect: (station: Station) => void;
}

export default function InteractiveMap({ stations, onStationSelect }: InteractiveMapProps) {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showLayers, setShowLayers] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'stations' | 'rainfall' | 'recharge'>('stations');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
  };

  const handleViewDetails = () => {
    if (selectedStation) {
      onStationSelect(selectedStation);
      setSelectedStation(null);
    }
  };

  const getStationColor = (status: string) => {
    switch (status) {
      case 'normal': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Mock India map outline (simplified)
  const indiaPath = "M300,100 L400,120 L450,200 L420,300 L380,350 L320,380 L250,360 L200,320 L180,250 L220,180 L280,120 Z";

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#014d86]">Interactive Groundwater Map</h2>
            <p className="text-gray-600 mt-1">Real-time monitoring stations across India</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowLayers(!showLayers)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#014d86] text-white rounded-lg hover:bg-[#014d86]/90 transition-colors"
              >
                <Layers size={16} />
                <span>Layers</span>
              </button>
              
              {showLayers && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48 z-10">
                  {[
                    { id: 'stations', label: 'Monitoring Stations', color: '#014d86' },
                    { id: 'rainfall', label: 'Rainfall Data', color: '#3B82F6' },
                    { id: 'recharge', label: 'Recharge Zones', color: '#10B981' }
                  ].map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => {
                        setActiveLayer(layer.id as any);
                        setShowLayers(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 ${
                        activeLayer === layer.id ? 'bg-[#00FFC2]/10 text-[#014d86] font-medium' : 'text-gray-700'
                      }`}
                    >
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: layer.color }}
                      />
                      <span>{layer.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
                className="p-2 hover:bg-white rounded transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
                className="p-2 hover:bg-white rounded transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-[600px] overflow-hidden">
        <div
          ref={mapRef}
          className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transition: 'transform 0.3s ease'
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 600 400">
            {/* India Map Outline */}
            <path
              d={indiaPath}
              fill="rgba(1, 77, 134, 0.1)"
              stroke="#014d86"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            
            {/* State Boundaries (simplified) */}
            <g stroke="#014d86" strokeWidth="1" fill="none" opacity="0.3">
              <path d="M250,150 L350,160 L340,220 L280,210 Z" />
              <path d="M280,210 L340,220 L320,280 L260,270 Z" />
              <path d="M320,280 L380,290 L370,340 L310,330 Z" />
            </g>

            {/* Stations */}
            {stations.map((station, index) => {
              // Mock positioning based on station data
              const x = 200 + (index % 8) * 40 + Math.random() * 20;
              const y = 120 + Math.floor(index / 8) * 35 + Math.random() * 15;
              
              return (
                <g key={station.id}>
                  {/* Glow effect */}
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill={getStationColor(station.status)}
                    opacity="0.3"
                    className="animate-pulse"
                  />
                  
                  {/* Station marker */}
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={getStationColor(station.status)}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-8 transition-all"
                    onClick={() => handleStationClick(station)}
                  />
                  
                  {/* Station label */}
                  <text
                    x={x}
                    y={y - 15}
                    textAnchor="middle"
                    className="text-xs fill-[#014d86] font-medium pointer-events-none"
                    style={{ fontSize: '10px' }}
                  >
                    {station.currentLevel}m
                  </text>
                </g>
              );
            })}

            {/* Rainfall overlay (when active) */}
            {activeLayer === 'rainfall' && (
              <g opacity="0.6">
                <circle cx="280" cy="180" r="30" fill="#3B82F6" opacity="0.3" />
                <circle cx="320" cy="220" r="25" fill="#3B82F6" opacity="0.4" />
                <circle cx="360" cy="260" r="35" fill="#3B82F6" opacity="0.2" />
              </g>
            )}

            {/* Recharge zones overlay (when active) */}
            {activeLayer === 'recharge' && (
              <g opacity="0.5">
                <ellipse cx="300" cy="200" rx="40" ry="20" fill="#10B981" opacity="0.3" />
                <ellipse cx="340" cy="240" rx="30" ry="15" fill="#10B981" opacity="0.4" />
              </g>
            )}
          </svg>
        </div>

        {/* Station Popup */}
        {selectedStation && (
          <div className="absolute top-4 right-4 bg-white rounded-xl shadow-xl border border-gray-200 p-4 max-w-sm z-10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-[#014d86]">{selectedStation.name}</h3>
                <p className="text-sm text-gray-600">{selectedStation.location.district}, {selectedStation.location.state}</p>
              </div>
              <button
                onClick={() => setSelectedStation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Water Level:</span>
                <span className="font-semibold text-[#014d86]">{selectedStation.currentLevel}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium capitalize ${
                  selectedStation.status === 'normal' ? 'text-green-600' :
                  selectedStation.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {selectedStation.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">24h Change:</span>
                <span className={`text-sm font-medium ${
                  selectedStation.change24h > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedStation.change24h > 0 ? '+' : ''}{selectedStation.change24h}m
                </span>
              </div>
            </div>
            
            <button
              onClick={handleViewDetails}
              className="w-full bg-gradient-to-r from-[#014d86] to-[#00FFC2] text-white py-2 rounded-lg hover:shadow-lg transition-all"
            >
              View Details
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
          <h4 className="font-medium text-[#014d86] mb-2">Station Status</h4>
          <div className="space-y-2">
            {[
              { status: 'normal', color: '#10B981', label: 'Normal' },
              { status: 'warning', color: '#F59E0B', label: 'Warning' },
              { status: 'critical', color: '#EF4444', label: 'Critical' },
              { status: 'offline', color: '#6B7280', label: 'Offline' }
            ].map((item) => (
              <div key={item.status} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation hint */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Navigation size={16} />
            <span>Click stations for details • Use zoom controls</span>
          </div>
        </div>
      </div>
    </div>
  );
}