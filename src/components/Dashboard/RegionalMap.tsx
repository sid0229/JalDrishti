import React from 'react';
import { RegionalStats } from '../../utils/mockApi';

interface RegionalMapProps {
  stats: RegionalStats[];
}

export default function RegionalMap({ stats }: RegionalMapProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[#003F7F] mb-6">Regional Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((region, index) => (
          <div key={index} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-[#003F7F]">{region.region}</h4>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                region.trend > 0 ? 'bg-green-100 text-green-800' :
                region.trend < -3 ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {region.trend > 0 ? '+' : ''}{region.trend}%
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Wells:</span>
                <span className="font-semibold text-[#003F7F]">{region.totalWells.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Level:</span>
                <span className="font-semibold text-[#003F7F]">{region.averageLevel}m</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Critical:</span>
                <span className="font-semibold text-red-600">{region.criticalWells}</span>
              </div>
            </div>
            
            {/* Simple visual indicator */}
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
              <div 
                className={`h-1 rounded-full ${
                  region.averageLevel > 15 ? 'bg-green-500' :
                  region.averageLevel > 10 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min((region.averageLevel / 20) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-[#003F7F]/5 to-[#00FFC2]/5 rounded-lg border border-[#00FFC2]/20">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-[#00FFC2] rounded-full animate-pulse"></div>
          <h4 className="font-medium text-[#003F7F]">Real-time Monitoring Active</h4>
        </div>
        <p className="text-sm text-gray-600">
          All wells are being monitored continuously. Alerts are sent immediately for critical changes.
        </p>
      </div>
    </div>
  );
}