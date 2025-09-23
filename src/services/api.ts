// API Service Layer with Mock Data and Offline Support
import { 
  Station, 
  WaterLevelReading, 
  Alert, 
  GlobalKPI, 
  ChatMessage, 
  SearchResult,
  StationsResponse,
  StationHistoryResponse,
  AlertsResponse,
  ChatResponse
} from '../types/api';

// Mock Data
const mockStations: Station[] = [
  {
    id: 'DWLR-1234',
    name: 'Delhi Central Monitoring Well',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Connaught Place, Central Delhi',
      state: 'Delhi',
      district: 'Central Delhi',
      pincode: '110001'
    },
    currentLevel: 15.6,
    maxLevel: 25.0,
    minLevel: 8.0,
    status: 'normal',
    lastUpdated: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    sensorHealth: 'good',
    trend: 'stable',
    change24h: -0.2,
    alertLevel: 'none'
  },
  {
    id: 'DWLR-5678',
    name: 'Mumbai Coastal Monitoring Station',
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Marine Drive, Mumbai',
      state: 'Maharashtra',
      district: 'Mumbai',
      pincode: '400020'
    },
    currentLevel: 8.2,
    maxLevel: 20.0,
    minLevel: 5.0,
    status: 'warning',
    lastUpdated: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    sensorHealth: 'good',
    trend: 'falling',
    change24h: -1.8,
    alertLevel: 'drawdown'
  },
  {
    id: 'DWLR-9012',
    name: 'Chennai Industrial Zone Well',
    location: {
      lat: 13.0827,
      lng: 80.2707,
      address: 'Anna Nagar, Chennai',
      state: 'Tamil Nadu',
      district: 'Chennai',
      pincode: '600040'
    },
    currentLevel: 4.1,
    maxLevel: 18.0,
    minLevel: 3.0,
    status: 'critical',
    lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    sensorHealth: 'degraded',
    trend: 'falling',
    change24h: -2.3,
    alertLevel: 'drought'
  },
  {
    id: 'DWLR-3456',
    name: 'Bangalore Tech Hub Station',
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Electronic City, Bangalore',
      state: 'Karnataka',
      district: 'Bangalore Urban',
      pincode: '560100'
    },
    currentLevel: 12.8,
    maxLevel: 22.0,
    minLevel: 6.0,
    status: 'normal',
    lastUpdated: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    sensorHealth: 'good',
    trend: 'rising',
    change24h: 0.5,
    alertLevel: 'recharge'
  }
];

const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    stationId: 'DWLR-9012',
    stationName: 'Chennai Industrial Zone Well',
    type: 'drought',
    severity: 'critical',
    message: 'Water level critically low at 4.1m',
    advisory: 'Immediate water conservation measures recommended',
    cta: 'Contact local water authority',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isActive: true,
    region: 'South India'
  },
  {
    id: 'alert-002',
    stationId: 'DWLR-5678',
    stationName: 'Mumbai Coastal Monitoring Station',
    type: 'drawdown',
    severity: 'medium',
    message: 'Rapid water level decline detected',
    advisory: 'Monitor usage patterns and implement conservation',
    cta: 'View mitigation steps',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    region: 'West India'
  }
];

// Utility functions
const isOffline = (): boolean => !navigator.onLine;

const getFromCache = (key: string): any => {
  try {
    const cached = localStorage.getItem(`jaldrishti_${key}`);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const setCache = (key: string, data: any): void => {
  try {
    localStorage.setItem(`jaldrishti_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch {
    // Handle storage quota exceeded
  }
};

const generateMockReadings = (stationId: string, range: 'week' | 'month' | 'year'): WaterLevelReading[] => {
  const station = mockStations.find(s => s.id === stationId);
  if (!station) return [];

  const days = range === 'week' ? 7 : range === 'month' ? 30 : 365;
  const readings: WaterLevelReading[] = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const baseLevel = station.currentLevel;
    const variation = (Math.random() - 0.5) * 2;
    
    readings.push({
      timestamp: timestamp.toISOString(),
      level: Math.max(0, baseLevel + variation),
      temperature: 22 + Math.random() * 8,
      ph: 6.5 + Math.random() * 2,
      turbidity: Math.random() * 5,
      sourceId: stationId
    });
  }

  return readings;
};

// API Functions
export const getGlobalKPI = async (): Promise<GlobalKPI> => {
  if (isOffline()) {
    const cached = getFromCache('globalKPI');
    if (cached) return cached.data;
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const kpi: GlobalKPI = {
    totalStations: mockStations.length,
    activeAlerts: mockAlerts.filter(a => a.isActive).length,
    avgWaterLevelChange30d: -2.1,
    lastUpdateMinutesAgo: Math.floor(Math.random() * 15) + 1,
    lastUpdateTimestamp: new Date().toISOString()
  };

  setCache('globalKPI', kpi);
  return kpi;
};

export const getStations = async (params?: {
  q?: string;
  page?: number;
  limit?: number;
  lat?: number;
  lng?: number;
}): Promise<StationsResponse> => {
  if (isOffline()) {
    const cached = getFromCache('stations');
    if (cached) return cached.data;
  }

  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredStations = [...mockStations];

  // Apply search filter
  if (params?.q) {
    const query = params.q.toLowerCase();
    filteredStations = filteredStations.filter(station =>
      station.name.toLowerCase().includes(query) ||
      station.location.address.toLowerCase().includes(query) ||
      station.location.district.toLowerCase().includes(query) ||
      station.location.state.toLowerCase().includes(query) ||
      station.location.pincode.includes(query)
    );
  }

  // Calculate distance if user location provided
  if (params?.lat && params?.lng) {
    filteredStations = filteredStations.map(station => ({
      ...station,
      distance: calculateDistance(
        params.lat!,
        params.lng!,
        station.location.lat,
        station.location.lng
      )
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const start = (page - 1) * limit;
  const paginatedStations = filteredStations.slice(start, start + limit);

  const response: StationsResponse = {
    stations: paginatedStations,
    total: filteredStations.length,
    page,
    limit
  };

  setCache('stations', response);
  return response;
};

export const getStationById = async (id: string): Promise<Station | null> => {
  if (isOffline()) {
    const cached = getFromCache(`station_${id}`);
    if (cached) return cached.data;
  }

  await new Promise(resolve => setTimeout(resolve, 200));

  const station = mockStations.find(s => s.id === id) || null;
  if (station) {
    setCache(`station_${id}`, station);
  }
  return station;
};

export const getStationHistory = async (
  stationId: string,
  range: 'week' | 'month' | 'year' = 'week'
): Promise<StationHistoryResponse> => {
  if (isOffline()) {
    const cached = getFromCache(`history_${stationId}_${range}`);
    if (cached) return cached.data;
  }

  await new Promise(resolve => setTimeout(resolve, 400));

  const readings = generateMockReadings(stationId, range);
  const firstReading = readings[0];
  const lastReading = readings[readings.length - 1];
  const change = lastReading.level - firstReading.level;
  const changePercent = (change / firstReading.level) * 100;

  const response: StationHistoryResponse = {
    stationId,
    range,
    readings,
    summary: {
      change,
      changePercent,
      trend: change > 0.5 ? 'rising' : change < -0.5 ? 'falling' : 'stable',
      description: `${range === 'week' ? 'This week' : range === 'month' ? 'This month' : 'This year'}: ${change > 0 ? '+' : ''}${change.toFixed(2)}m (${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%)`
    }
  };

  setCache(`history_${stationId}_${range}`, response);
  return response;
};

export const getAlerts = async (params?: {
  severity?: string;
  region?: string;
  stationId?: string;
}): Promise<AlertsResponse> => {
  if (isOffline()) {
    const cached = getFromCache('alerts');
    if (cached) return cached.data;
  }

  await new Promise(resolve => setTimeout(resolve, 300));

  let filteredAlerts = [...mockAlerts];

  if (params?.severity) {
    filteredAlerts = filteredAlerts.filter(alert => alert.severity === params.severity);
  }

  if (params?.region) {
    filteredAlerts = filteredAlerts.filter(alert => alert.region === params.region);
  }

  if (params?.stationId) {
    filteredAlerts = filteredAlerts.filter(alert => alert.stationId === params.stationId);
  }

  const response: AlertsResponse = {
    alerts: filteredAlerts,
    total: filteredAlerts.length,
    unreadCount: filteredAlerts.filter(a => a.isActive).length
  };

  setCache('alerts', response);
  return response;
};

export const searchStations = async (query: string, userLat?: number, userLng?: number): Promise<SearchResult[]> => {
  if (isOffline()) {
    const cached = getFromCache(`search_${query}`);
    if (cached) return cached.data;
  }

  await new Promise(resolve => setTimeout(resolve, 200));

  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase();

  // Search stations
  mockStations.forEach(station => {
    let relevanceScore = 0;
    
    if (station.name.toLowerCase().includes(queryLower)) relevanceScore += 10;
    if (station.location.district.toLowerCase().includes(queryLower)) relevanceScore += 8;
    if (station.location.state.toLowerCase().includes(queryLower)) relevanceScore += 6;
    if (station.location.address.toLowerCase().includes(queryLower)) relevanceScore += 5;
    if (station.location.pincode.includes(query)) relevanceScore += 7;

    if (relevanceScore > 0) {
      const distance = userLat && userLng ? 
        calculateDistance(userLat, userLng, station.location.lat, station.location.lng) : 
        undefined;

      results.push({
        type: 'station',
        id: station.id,
        name: station.name,
        subtitle: `${station.location.district}, ${station.location.state}`,
        distance,
        relevanceScore
      });
    }
  });

  // Sort by relevance and distance
  results.sort((a, b) => {
    if (a.relevanceScore !== b.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    if (a.distance && b.distance) {
      return a.distance - b.distance;
    }
    return 0;
  });

  const limitedResults = results.slice(0, 10);
  setCache(`search_${query}`, limitedResults);
  return limitedResults;
};

export const chatWithBot = async (
  userInput: string,
  stationId?: string,
  context?: any
): Promise<ChatResponse> => {
  if (isOffline()) {
    return {
      message: "I'm currently offline. Please check your connection and try again.",
      citations: [],
      suggestedActions: ["Check internet connection", "Try again later"]
    };
  }

  await new Promise(resolve => setTimeout(resolve, 800));

  // Mock chatbot responses based on context
  let message = "I can help you understand groundwater data and provide insights.";
  const citations: string[] = [];
  const suggestedActions: string[] = [];

  if (stationId) {
    const station = mockStations.find(s => s.id === stationId);
    if (station) {
      message = `Based on ${station.name}, the current water level is ${station.currentLevel}m with a ${station.trend} trend. `;
      
      if (station.status === 'critical') {
        message += "This station shows critical water levels requiring immediate attention.";
        suggestedActions.push("Contact local water authority", "Implement water conservation");
      } else if (station.status === 'warning') {
        message += "Water levels are showing concerning trends that should be monitored closely.";
        suggestedActions.push("Monitor daily readings", "Review usage patterns");
      } else {
        message += "Water levels are within normal parameters.";
        suggestedActions.push("Continue regular monitoring");
      }

      citations.push(`Latest reading ${station.currentLevel}m at ${new Date(station.lastUpdated).toLocaleString()} — source: ${station.id}`);
    }
  }

  return {
    message,
    citations,
    suggestedActions
  };
};

// Utility function to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}