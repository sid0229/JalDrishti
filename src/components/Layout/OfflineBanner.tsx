import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useOffline } from '../../hooks/useOffline';

export default function OfflineBanner() {
  const { isOffline, lastOnlineTime, syncData } = useOffline();

  if (!isOffline) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <WifiOff size={20} className="text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              You're offline — viewing cached data
              {lastOnlineTime && (
                <span className="ml-1">
                  from {lastOnlineTime.toLocaleString()}
                </span>
              )}
            </p>
          </div>
        </div>
        
        <button
          onClick={syncData}
          className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md text-sm font-medium transition-colors"
          aria-label="Sync data when online"
        >
          <RefreshCw size={16} />
          <span>Sync Now</span>
        </button>
      </div>
    </div>
  );
}