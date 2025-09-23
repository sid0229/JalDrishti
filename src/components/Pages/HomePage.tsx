import React from 'react';
import { AlertTriangle, Droplets, Activity, TrendingDown, TrendingUp, MapPin, Clock } from 'lucide-react';
import { Station, GlobalKPI } from '../../types/api';

interface HomePageProps {
  stations: Station[];
  globalKPI: GlobalKPI | null;
  onStationSelect: (station: Station) => void;
}

export default function HomePage({ stations, globalKPI, onStationSelect }: HomePageProps) {
  const criticalStations = stations.filter(s => s.status === 'critical');
  const warningStations = stations.filter(s => s.status === 'warning');
  const recentAlerts = stations
    .filter(s => s.alertLevel !== 'none')
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* National Status Overview */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-[#014d86] to-[#2ca58d] rounded-lg">
            <Droplets size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#014d86]">National Groundwater Status</h2>
            <p className="text-gray-600">Real-time monitoring across India</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <Activity size={20} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Total Stations</span>
            </div>
            <div className="text-3xl font-bold text-blue-900">{globalKPI?.totalStations || 0}</div>
            <div className="text-sm text-blue-700 mt-1">Monitoring nationwide</div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="flex items-center space-x-3 mb-3">
              <AlertTriangle size={20} className="text-red-600" />
              <span className="text-sm font-medium text-red-800">Critical Alerts</span>
            </div>
            <div className="text-3xl font-bold text-red-900">{criticalStations.length}</div>
            <div className="text-sm text-red-700 mt-1">Immediate attention needed</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingDown size={20} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Warning Stations</span>
            </div>
            <div className="text-3xl font-bold text-yellow-900">{warningStations.length}</div>
            <div className="text-sm text-yellow-700 mt-1">Monitoring closely</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp size={20} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">Avg Change (30d)</span>
            </div>
            <div className={`text-3xl font-bold ${
              (globalKPI?.avgWaterLevelChange30d || 0) < 0 ? 'text-red-900' : 'text-green-900'
            }`}>
              {globalKPI?.avgWaterLevelChange30d || 0}%
            </div>
            <div className="text-sm text-green-700 mt-1">National average</div>
          </div>
        </div>
      </div>

      {/* Early Warnings Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#014d86]">Early Warning Alerts</h3>
              <p className="text-gray-600">Critical situations requiring immediate attention</p>
            </div>
          </div>
          {globalKPI && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <Clock size={16} />
              <span>Last Updated: {globalKPI.lastUpdateMinutesAgo} minutes ago</span>
            </div>
          )}
        </div>

        {recentAlerts.length > 0 ? (
          <div className="space-y-4">
            {recentAlerts.map((station) => (
              <div
                key={station.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                  station.status === 'critical'
                    ? 'bg-red-50 border-red-200 hover:bg-red-100'
                    : station.status === 'warning'
                    ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                }`}
                onClick={() => onStationSelect(station)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${
                        station.status === 'critical'
                          ? 'bg-red-200 text-red-700'
                          : station.status === 'warning'
                          ? 'bg-yellow-200 text-yellow-700'
                          : 'bg-blue-200 text-blue-700'
                      }`}>
                        <AlertTriangle size={16} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#014d86]">{station.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin size={14} />
                          <span>{station.location.district}, {station.location.state}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Current Level:</span>
                        <div className="font-semibold text-[#014d86]">{station.currentLevel}m</div>
                      </div>
                      <div>
                        <span className="text-gray-600">24h Change:</span>
                        <div className={`font-semibold ${
                          station.change24h < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {station.change24h > 0 ? '+' : ''}{station.change24h}m
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <div className={`font-semibold capitalize ${
                          station.status === 'critical' ? 'text-red-600' :
                          station.status === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                        }`}>
                          {station.status}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Alert Type:</span>
                        <div className="font-semibold text-[#014d86] capitalize">
                          {station.alertLevel.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    station.status === 'critical'
                      ? 'bg-red-200 text-red-800'
                      : station.status === 'warning'
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-blue-200 text-blue-800'
                  }`}>
                    {station.status === 'critical' ? 'URGENT' : 
                     station.status === 'warning' ? 'MONITOR' : 'INFO'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity size={32} className="text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-[#014d86] mb-2">All Systems Normal</h4>
            <p className="text-gray-600">No critical alerts at this time. All stations are operating within normal parameters.</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#014d86] to-[#2ca58d] rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Explore Stations</h3>
          <p className="text-white/80 mb-4">Search and monitor groundwater levels across India</p>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all">
            View All Stations →
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
          <h3 className="text-xl font-bold text-[#014d86] mb-2">Community Reports</h3>
          <p className="text-gray-600 mb-4">Share local water issues and success stories</p>
          <button className="bg-[#014d86] text-white px-4 py-2 rounded-lg hover:bg-[#014d86]/90 transition-all">
            Report Issue →
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
          <h3 className="text-xl font-bold text-[#014d86] mb-2">Get Insights</h3>
          <p className="text-gray-600 mb-4">AI-powered analysis and recommendations</p>
          <button className="bg-[#2ca58d] text-white px-4 py-2 rounded-lg hover:bg-[#2ca58d]/90 transition-all">
            Ask AI Assistant →
          </button>
        </div>
      </div>
    </div>
  );
}