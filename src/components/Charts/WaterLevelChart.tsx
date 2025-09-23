import React from 'react';
import { WaterLevelReading } from '../../utils/mockApi';

interface WaterLevelChartProps {
  data: WaterLevelReading[];
  title?: string;
}

export default function WaterLevelChart({ data, title = "Water Level Trend" }: WaterLevelChartProps) {
  if (!data.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#003F7F] mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              📊
            </div>
            <p>No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const maxLevel = Math.max(...data.map(d => d.level));
  const minLevel = Math.min(...data.map(d => d.level));
  const range = maxLevel - minLevel;
  const padding = range * 0.1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[#003F7F] mb-4">{title}</h3>
      
      <div className="relative h-64 mb-4">
        <svg className="w-full h-full" viewBox="0 0 800 240">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00FFC2" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00FFC2" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[...Array(6)].map((_, i) => (
            <line
              key={i}
              x1="40"
              y1={40 + (i * 32)}
              x2="760"
              y2={40 + (i * 32)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Chart line and area */}
          {data.length > 1 && (
            <>
              <path
                d={`M ${data.map((d, i) => {
                  const x = 40 + (i / (data.length - 1)) * 720;
                  const y = 200 - ((d.level - minLevel + padding) / (range + 2 * padding)) * 160;
                  return `${x},${y}`;
                }).join(' L ')}`}
                fill="none"
                stroke="#00FFC2"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              <path
                d={`M ${data.map((d, i) => {
                  const x = 40 + (i / (data.length - 1)) * 720;
                  const y = 200 - ((d.level - minLevel + padding) / (range + 2 * padding)) * 160;
                  return `${x},${y}`;
                }).join(' L ')} L 760,200 L 40,200 Z`}
                fill="url(#chartGradient)"
              />
            </>
          )}
          
          {/* Data points */}
          {data.map((d, i) => {
            const x = 40 + (i / (data.length - 1)) * 720;
            const y = 200 - ((d.level - minLevel + padding) / (range + 2 * padding)) * 160;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#003F7F"
                stroke="#00FFC2"
                strokeWidth="2"
              />
            );
          })}
          
          {/* Y-axis labels */}
          {[...Array(6)].map((_, i) => {
            const value = (maxLevel + padding - (i / 5) * (range + 2 * padding)).toFixed(1);
            return (
              <text
                key={i}
                x="35"
                y={44 + (i * 32)}
                textAnchor="end"
                className="text-xs fill-gray-600"
              >
                {value}m
              </text>
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 px-10 text-xs text-gray-600">
          {data.slice(0, 7).map((d, i) => (
            <span key={i}>
              {new Date(d.timestamp).toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
          ))}
        </div>
      </div>
      
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-sm text-gray-600">Current</div>
          <div className="text-lg font-semibold text-[#003F7F]">
            {data[data.length - 1]?.level.toFixed(1)}m
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Maximum</div>
          <div className="text-lg font-semibold text-green-600">{maxLevel.toFixed(1)}m</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Minimum</div>
          <div className="text-lg font-semibold text-red-600">{minLevel.toFixed(1)}m</div>
        </div>
      </div>
    </div>
  );
}