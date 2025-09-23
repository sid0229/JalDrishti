import React, { useState, useRef, useEffect } from 'react';
import { WaterLevelReading } from '../../types/api';

interface TrendChartProps {
  data: WaterLevelReading[];
  range: 'week' | 'month' | 'year';
  stationName: string;
}

export default function TrendChart({ data, range, stationName }: TrendChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: WaterLevelReading } | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const svgRef = useRef<SVGSVGElement>(null);

  if (!data.length) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <div className="text-gray-500">No data available for the selected period</div>
      </div>
    );
  }

  const width = 800;
  const height = 300;
  const padding = { top: 20, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minLevel = Math.min(...data.map(d => d.level));
  const maxLevel = Math.max(...data.map(d => d.level));
  const levelRange = maxLevel - minLevel;
  const paddedMin = minLevel - levelRange * 0.1;
  const paddedMax = maxLevel + levelRange * 0.1;
  const paddedRange = paddedMax - paddedMin;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (level: number) => padding.top + ((paddedMax - level) / paddedRange) * chartHeight;

  const pathData = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.level)}`).join(' ');
  
  const areaData = `${pathData} L ${getX(data.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const chartX = x - padding.left;
    
    if (chartX >= 0 && chartX <= chartWidth) {
      const index = Math.round((chartX / chartWidth) * (data.length - 1));
      const dataPoint = data[index];
      
      if (dataPoint) {
        setHoveredPoint({
          x: getX(index),
          y: getY(dataPoint.level),
          data: dataPoint
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(0, prev - 1));
        break;
      case 'ArrowRight':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(data.length - 1, prev + 1));
        break;
      case 'Escape':
        setFocusedIndex(-1);
        setHoveredPoint(null);
        break;
    }
  };

  useEffect(() => {
    if (focusedIndex >= 0 && focusedIndex < data.length) {
      const dataPoint = data[focusedIndex];
      setHoveredPoint({
        x: getX(focusedIndex),
        y: getY(dataPoint.level),
        data: dataPoint
      });
    }
  }, [focusedIndex]);

  // Generate grid lines
  const yGridLines = Array.from({ length: 6 }, (_, i) => {
    const value = paddedMin + (i / 5) * paddedRange;
    return {
      y: getY(value),
      value: value.toFixed(1)
    };
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    if (range === 'week') {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } else if (range === 'month') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
  };

  // Calculate summary statistics
  const currentLevel = data[data.length - 1]?.level || 0;
  const previousLevel = data[0]?.level || 0;
  const change = currentLevel - previousLevel;
  const changePercent = previousLevel !== 0 ? (change / previousLevel) * 100 : 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 shadow-sm hover:shadow-lg transition-all">
      <div className="p-4 border-b border-gray-100">
        <h4 className="font-medium text-[#014d86]">{stationName} - Water Level Trend</h4>
        <p className="text-sm text-gray-600 mt-1">
          {range === 'week' ? 'Past 7 days' : range === 'month' ? 'Past 30 days' : 'Past year'} • 
          Change: <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)}m ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%)
          </span>
        </p>
      </div>

      <div className="p-4">
        <div className="relative">
          <svg
            ref={svgRef}
            width={width}
            height={height}
            className="w-full h-auto"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="img"
            aria-label={`Water level trend chart for ${stationName} showing ${data.length} data points over ${range}`}
          >
            {/* Grid lines */}
            {yGridLines.map((line, i) => (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={line.y}
                  x2={width - padding.right}
                  y2={line.y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={line.y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-600"
                >
                  {line.value}m
                </text>
              </g>
            ))}

            {/* Area fill */}
            <path
              d={areaData}
              fill="url(#chartGradient)"
              className="opacity-20"
            />

            {/* Main line */}
            <path
              d={pathData}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />

            {/* Data points */}
            {data.map((d, i) => (
              <circle
                key={i}
                cx={getX(i)}
                cy={getY(d.level)}
                r="3"
                fill="#014d86"
                stroke="#00FFC2"
                strokeWidth="1.5"
                className={`transition-all hover:r-5 ${focusedIndex === i ? 'r-5' : ''}`}
              />
            ))}

            {/* Hover crosshair and tooltip */}
            {hoveredPoint && (
              <g>
                <line
                  x1={hoveredPoint.x}
                  y1={padding.top}
                  x2={hoveredPoint.x}
                  y2={height - padding.bottom}
                  stroke="#014d86"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  className="opacity-50"
                />
                <circle
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  r="5"
                  fill="#014d86"
                  stroke="#00FFC2"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              </g>
            )}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00FFC2" />
                <stop offset="100%" stopColor="#014d86" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#014d86" />
                <stop offset="50%" stopColor="#00FFC2" />
                <stop offset="100%" stopColor="#014d86" />
              </linearGradient>
            </defs>

            {/* X-axis labels */}
            {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map((d, i, filtered) => {
              const originalIndex = data.indexOf(d);
              return (
                <text
                  key={originalIndex}
                  x={getX(originalIndex)}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {formatDate(d.timestamp)}
                </text>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute bg-white/95 backdrop-blur-sm border border-[#014d86]/20 rounded-xl shadow-xl p-4 pointer-events-none z-10"
              style={{
                left: Math.min(hoveredPoint.x + 10, width - 200),
                top: Math.max(hoveredPoint.y - 80, 10)
              }}
            >
              <div className="text-sm font-medium text-[#014d86]">
                {formatDate(hoveredPoint.data.timestamp)}
              </div>
              <div className="text-xl font-bold text-[#014d86] mt-1">
                {hoveredPoint.data.level.toFixed(2)}m
              </div>
              <div className="text-xs text-gray-600 mt-1 space-y-1">
                <div>Temperature: {hoveredPoint.data.temperature.toFixed(1)}°C</div>
                <div>pH: {hoveredPoint.data.ph.toFixed(1)}</div>
                <div>Turbidity: {hoveredPoint.data.turbidity.toFixed(1)} NTU</div>
              </div>
            </div>
          )}
        </div>

        {/* Chart controls help text */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <span className="inline-flex items-center space-x-4">
            <span>🖱️ Hover for details</span>
            <span>⌨️ Arrow keys to navigate</span>
            <span>⎋ Escape to clear</span>
          </span>
        </div>
      </div>
    </div>
  );
}