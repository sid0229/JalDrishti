import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow';
}

export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  trend = 'stable', 
  trendValue, 
  icon,
  color = 'blue' 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  const trendIcons = {
    up: <TrendingUp size={16} className="text-green-600" />,
    down: <TrendingDown size={16} className="text-red-600" />,
    stable: <Minus size={16} className="text-gray-600" />
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    stable: 'text-gray-600'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold text-[#003F7F]">{value}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>
      
      {trendValue && (
        <div className="flex items-center space-x-1">
          {trendIcons[trend]}
          <span className={`text-sm font-medium ${trendColors[trend]}`}>
            {trendValue}
          </span>
          <span className="text-xs text-gray-400">from last week</span>
        </div>
      )}
    </div>
  );
}