import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Droplets, 
  Clock, 
  Share2, 
  Heart, 
  Volume2, 
  Download,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Station, WaterLevelReading } from '../../types/api';
import { getStationHistory } from '../../services/api';
import { useAccessibility } from '../../hooks/useAccessibility';
import TrendChart from '../Charts/TrendChart';

interface StationDetailProps {
  station: Station;
  onClose: () => void;
  onChatOpen: (stationId: string) => void;
}

export default function StationDetail({ station, onClose, onChatOpen }: StationDetailProps) {
  const [historyData, setHistoryData] = useState<WaterLevelReading[]>([]);
  const [selectedRange, setSelectedRange] = useState<'week' | 'month' | 'year'>('week');
  const [isLoading, setIsLoading] = useState(true);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const { speak } = useAccessibility();

  useEffect(() => {
    loadHistoryData();
  }, [station.id, selectedRange]);

  const loadHistoryData = async () => {
    setIsLoading(true);
    try {
      const response = await getStationHistory(station.id, selectedRange);
      setHistoryData(response.readings);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusConfig = {
    normal: {
      icon: <CheckCircle size={20} className="text-green-600" />,
      color: 'border-green-200 bg-green-50',
      textColor: 'text-green-800',
      label: 'Normal'
    },
    warning: {
      icon: <AlertTriangle size={20} className="text-yellow-600" />,
      color: 'border-yellow-200 bg-yellow-50',
      textColor: 'text-yellow-800',
      label: 'Warning'
    },
    critical: {
      icon: <AlertCircle size={20} className="text-red-600" />,
      color: 'border-red-200 bg-red-50',
      textColor: 'text-red-800',
      label: 'Critical'
    },
    offline: {
      icon: <WifiOff size={20} className="text-gray-600" />,
      color: 'border-gray-200 bg-gray-50',
      textColor: 'text-gray-800',
      label: 'Offline'
    }
  };

  const alertConfig = {
    none: null,
    drought: { 
      label: 'Drought Alert', 
      color: 'bg-red-100 text-red-800 border-red-200',
      advisory: 'Water levels are critically low. Implement immediate conservation measures.',
      cta: 'Contact local water authority'
    },
    drawdown: { 
      label: 'Drawdown Alert', 
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      advisory: 'Rapid water level decline detected. Monitor usage patterns closely.',
      cta: 'View mitigation steps'
    },
    recharge: { 
      label: 'Recharge Event', 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      advisory: 'Water levels are rising due to recent rainfall or recharge activities.',
      cta: 'Monitor progress'
    }
  };

  const status = statusConfig[station.status];
  const alert = alertConfig[station.alertLevel];
  const minutesAgo = Math.floor((Date.now() - new Date(station.lastUpdated).getTime()) / (1000 * 60));

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `JalDrishti - ${station.name}`,
          text: `Water level: ${station.currentLevel}m - ${status.label}`,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleVoiceReadout = () => {
    const text = `Station ${station.name} located in ${station.location.district}, ${station.location.state}. 
                  Current water level is ${station.currentLevel} meters out of maximum ${station.maxLevel} meters. 
                  Status is ${status.label}. 
                  24 hour change is ${station.change24h > 0 ? 'positive' : 'negative'} ${Math.abs(station.change24h)} meters. 
                  Sensor health is ${station.sensorHealth}. 
                  Last updated ${minutesAgo} minutes ago.`;
    speak(text);
  };

  const exportData = () => {
    const csvContent = [
      ['Timestamp', 'Water Level (m)', 'Temperature (°C)', 'pH', 'Turbidity'],
      ...historyData.map(reading => [
        new Date(reading.timestamp).toLocaleString(),
        reading.level.toString(),
        reading.temperature.toString(),
        reading.ph.toString(),
        reading.turbidity.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${station.id}_${selectedRange}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-[#003F7F] truncate">{station.name}</h2>
            <div className="flex items-center space-x-2 text-gray-600 mt-1">
              <MapPin size={16} />
              <span>{station.location.address}</span>
              {station.distance && (
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {station.distance.toFixed(1)} km away
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleVoiceReadout}
              className="p-2 text-[#003F7F] hover:bg-[#003F7F]/5 rounded-lg transition-colors"
              aria-label="Read station details aloud"
            >
              <Volume2 size={20} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 text-[#003F7F] hover:bg-[#003F7F]/5 rounded-lg transition-colors"
              aria-label="Share station"
            >
              <Share2 size={20} />
            </button>
            
            <button
              onClick={() => setIsWatchlisted(!isWatchlisted)}
              className={`p-2 rounded-lg transition-colors ${
                isWatchlisted 
                  ? 'text-red-600 hover:bg-red-50' 
                  : 'text-[#003F7F] hover:bg-[#003F7F]/5'
              }`}
              aria-label={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              <Heart size={20} fill={isWatchlisted ? 'currentColor' : 'none'} />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close station details"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Live Status */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-[#003F7F]/5 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Droplets size={18} className="text-[#00FFC2]" />
                  <span className="text-sm text-gray-600">Latest Level</span>
                </div>
                <div className="text-2xl font-bold text-[#003F7F]">{station.currentLevel}m</div>
                <div className="text-sm text-gray-500">Max: {station.maxLevel}m</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity size={18} className="text-gray-600" />
                  <span className="text-sm text-gray-600">24h Change</span>
                </div>
                <div className={`text-2xl font-bold ${
                  station.change24h > 0 ? 'text-green-600' :
                  station.change24h < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {station.change24h > 0 ? '+' : ''}{station.change24h}m
                </div>
                <div className="text-sm text-gray-500 capitalize">{station.trend}</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  {station.sensorHealth === 'good' ? (
                    <Wifi size={18} className="text-green-600" />
                  ) : station.sensorHealth === 'degraded' ? (
                    <Activity size={18} className="text-yellow-600" />
                  ) : (
                    <WifiOff size={18} className="text-red-600" />
                  )}
                  <span className="text-sm text-gray-600">Sensor Health</span>
                </div>
                <div className="text-lg font-semibold text-[#003F7F] capitalize">
                  {station.sensorHealth}
                </div>
                <div className="text-sm text-gray-500">Real-time monitoring</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock size={18} className="text-gray-600" />
                  <span className="text-sm text-gray-600">Last Updated</span>
                </div>
                <div className="text-lg font-semibold text-[#003F7F]">{minutesAgo} min ago</div>
                <div className="text-sm text-gray-500">
                  {new Date(station.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Status and Alerts */}
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg border flex items-center space-x-2 ${status.color} ${status.textColor}`}>
                {status.icon}
                <span className="font-medium">{status.label}</span>
              </div>
              
              {alert && (
                <div className={`px-4 py-2 rounded-lg border flex items-center space-x-2 ${alert.color}`}>
                  <AlertTriangle size={16} />
                  <span className="font-medium">{alert.label}</span>
                </div>
              )}
            </div>
          </div>

          {/* Early Warning Alerts */}
          {alert && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#003F7F] mb-3">Early Warning Alert</h3>
              <div className={`p-4 rounded-lg border ${alert.color}`}>
                <div className="flex items-start space-x-3">
                  <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium mb-2">{alert.advisory}</p>
                    <button className="bg-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                      {alert.cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trend Charts */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#003F7F]">Water Level Trend</h3>
              
              <div className="flex items-center space-x-2">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {(['week', 'month', 'year'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedRange(range)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        selectedRange === range
                          ? 'bg-[#00FFC2] text-[#003F7F]'
                          : 'text-gray-600 hover:text-[#003F7F]'
                      }`}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={exportData}
                  className="flex items-center space-x-1 px-3 py-2 bg-[#003F7F] text-white rounded-lg hover:bg-[#003F7F]/90 transition-colors text-sm"
                >
                  <Download size={16} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-[#003F7F] border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <TrendChart 
                data={historyData} 
                range={selectedRange}
                stationName={station.name}
              />
            )}
          </div>

          {/* Ask about this station */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={() => onChatOpen(station.id)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-[#003F7F] to-[#0066CC] text-white rounded-lg hover:from-[#003F7F]/90 hover:to-[#0066CC]/90 transition-all"
            >
              <MessageCircle size={20} />
              <span className="font-medium">Ask about this station</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}