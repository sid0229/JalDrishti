import React from 'react';
import { MapPin, Droplets, Clock, AlertTriangle, CheckCircle, AlertCircle, Activity, Wifi, WifiOff } from 'lucide-react';
import { Station } from '../../types/api';
import { useAccessibility } from '../../hooks/useAccessibility';

interface StationCardProps {
  station: Station;
  onClick?: (station: Station) => void;
  showSparkline?: boolean;
}

export default function StationCard({ station, onClick, showSparkline = true }: StationCardProps) {
  const { speak } = useAccessibility();

  const statusConfig = {
    normal: {
      icon: <CheckCircle size={16} className="text-green-600" />,
      color: 'border-green-200 bg-green-50',
      textColor: 'text-green-800',
      label: 'Normal'
    },
    warning: {
      icon: <AlertTriangle size={16} className="text-yellow-600" />,
      color: 'border-yellow-200 bg-yellow-50',
      textColor: 'text-yellow-800',
      label: 'Warning'
    },
    critical: {
      icon: <AlertCircle size={16} className="text-red-600" />,
      color: 'border-red-200 bg-red-50',
      textColor: 'text-red-800',
      label: 'Critical'
    },
    offline: {
      icon: <WifiOff size={16} className="text-gray-600" />,
      color: 'border-gray-200 bg-gray-50',
      textColor: 'text-gray-800',
      label: 'Offline'
    }
  };

  const alertConfig = {
    none: null,
    drought: { label: 'Drought Alert', color: 'bg-red-100 text-red-800' },
    drawdown: { label: 'Drawdown Alert', color: 'bg-orange-100 text-orange-800' },
    recharge: { label: 'Recharge Event', color: 'bg-blue-100 text-blue-800' }
  };

  const status = statusConfig[station.status];
  const alert = alertConfig[station.alertLevel];
  const levelPercentage = ((station.currentLevel - station.minLevel) / (station.maxLevel - station.minLevel)) * 100;
  const minutesAgo = Math.floor((Date.now() - new Date(station.lastUpdated).getTime()) / (1000 * 60));

  const handleClick = () => {
    onClick?.(station);
    speak(`Selected ${station.name}. Current water level ${station.currentLevel} meters. Status: ${status.label}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Generate simple sparkline data (mock)
  const sparklineData = showSparkline ? Array.from({ length: 7 }, (_, i) => 
    station.currentLevel + (Math.random() - 0.5) * 2
  ) : [];

  return (
    <div 
      className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-[#00FFC2]/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00FFC2] focus:border-transparent"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Station ${station.name}, water level ${station.currentLevel} meters, status ${status.label}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[#014d86] truncate mb-1">{station.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin size={14} />
            <span className="truncate">{station.location.district}, {station.location.state}</span>
            {station.distance && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {station.distance.toFixed(1)} km
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${status.color} ${status.textColor}`}>
            {status.icon}
            <span>{status.label}</span>
          </div>
          
          {alert && (
            <div className={`px-2 py-1 rounded text-xs font-medium ${alert.color}`}>
              {alert.label}
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <Droplets size={14} className="text-[#00FFC2]" />
            <span className="text-gray-600">Water Level:</span>
            <span className="font-semibold text-[#014d86]">{station.currentLevel}m</span>
            <span className="text-gray-400">/ {station.maxLevel}m</span>
          </div>
          
          <div className="flex items-center space-x-1 text-xs">
            <span className={`font-medium ${
              station.change24h > 0 ? 'text-green-600' :
              station.change24h < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {station.change24h > 0 ? '+' : ''}{station.change24h}m (24h)
            </span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              station.status === 'normal' ? 'bg-green-500' :
              station.status === 'warning' ? 'bg-yellow-500' : 
              station.status === 'critical' ? 'bg-red-500' : 'bg-gray-400'
            }`}
            style={{ width: `${Math.min(Math.max(levelPercentage, 0), 100)}%` }}
            role="progressbar"
            aria-valuenow={levelPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Water level at ${levelPercentage.toFixed(1)}% of capacity`}
          ></div>
        </div>
        
        {showSparkline && sparklineData.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <svg className="w-full h-8" viewBox="0 0 140 32">
                <polyline
                  points={sparklineData.map((value, index) => 
                    `${index * 20},${32 - ((value - Math.min(...sparklineData)) / (Math.max(...sparklineData) - Math.min(...sparklineData))) * 24}`
                  ).join(' ')}
                  fill="none"
                  stroke="#00FFC2"
                  strokeWidth="2"
                  className="opacity-70"
                />
              </svg>
            </div>
            <div className="text-xs text-gray-500 ml-2">7d trend</div>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock size={12} />
            <span>Updated {minutesAgo} min ago</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {station.sensorHealth === 'good' ? (
                <Wifi size={12} className="text-green-600" />
              ) : station.sensorHealth === 'degraded' ? (
                <Activity size={12} className="text-yellow-600" />
              ) : (
                <WifiOff size={12} className="text-red-600" />
              )}
              <span className="capitalize">{station.sensorHealth}</span>
            </div>
            
            <span className={`font-medium ${
              station.trend === 'rising' ? 'text-green-600' :
              station.trend === 'falling' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {station.trend === 'rising' ? '↗' : station.trend === 'falling' ? '↘' : '→'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}