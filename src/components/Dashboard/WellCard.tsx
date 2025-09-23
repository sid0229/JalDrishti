import React from 'react';
import { MapPin, Droplets, Clock, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { WellData } from '../../utils/mockApi';

interface WellCardProps {
  well: WellData;
  onClick?: (well: WellData) => void;
}

export default function WellCard({ well, onClick }: WellCardProps) {
  const statusConfig = {
    good: {
      icon: <CheckCircle size={16} className="text-green-600" />,
      color: 'border-green-200 bg-green-50',
      textColor: 'text-green-800',
      label: 'Good'
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
    }
  };

  const status = statusConfig[well.status];
  const levelPercentage = (well.currentLevel / well.maxLevel) * 100;

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-[#00FFC2]/30"
      onClick={() => onClick?.(well)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#003F7F] truncate">{well.name}</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${status.color} ${status.textColor}`}>
          {status.icon}
          <span>{status.label}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin size={14} />
          <span className="truncate">{well.location.address}, {well.location.district}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Droplets size={14} className="text-[#00FFC2]" />
          <span className="text-gray-600">Water Level:</span>
          <span className="font-semibold text-[#003F7F]">{well.currentLevel}m</span>
          <span className="text-gray-400">/ {well.maxLevel}m</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              well.status === 'good' ? 'bg-green-500' :
              well.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(levelPercentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock size={12} />
            <span>Updated {new Date(well.lastUpdated).toLocaleTimeString()}</span>
          </div>
          <span className={`font-medium ${
            well.trend === 'rising' ? 'text-green-600' :
            well.trend === 'falling' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {well.trend === 'rising' ? '↗' : well.trend === 'falling' ? '↘' : '→'} {well.trend}
          </span>
        </div>
      </div>
    </div>
  );
}