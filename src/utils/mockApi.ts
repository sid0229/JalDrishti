export interface WellData {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    state: string;
    district: string;
  };
  currentLevel: number;
  maxLevel: number;
  status: 'good' | 'warning' | 'critical';
  lastUpdated: string;
  trend: 'rising' | 'stable' | 'falling';
}

export interface WaterLevelReading {
  timestamp: string;
  level: number;
  temperature: number;
  ph: number;
  turbidity: number;
}

export interface RegionalStats {
  region: string;
  totalWells: number;
  averageLevel: number;
  criticalWells: number;
  trend: number;
}

// Mock data
export const mockWells: WellData[] = [
  {
    id: '1',
    name: 'Delhi Monitoring Well #1',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Connaught Place',
      state: 'Delhi',
      district: 'Central Delhi'
    },
    currentLevel: 15.6,
    maxLevel: 25.0,
    status: 'good',
    lastUpdated: '2025-01-27T10:30:00Z',
    trend: 'stable'
  },
  {
    id: '2',
    name: 'Mumbai Coastal Well #3',
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Marine Drive',
      state: 'Maharashtra',
      district: 'Mumbai'
    },
    currentLevel: 8.2,
    maxLevel: 20.0,
    status: 'warning',
    lastUpdated: '2025-01-27T10:25:00Z',
    trend: 'falling'
  },
  {
    id: '3',
    name: 'Chennai Industrial Well #7',
    location: {
      lat: 13.0827,
      lng: 80.2707,
      address: 'Anna Nagar',
      state: 'Tamil Nadu',
      district: 'Chennai'
    },
    currentLevel: 4.1,
    maxLevel: 18.0,
    status: 'critical',
    lastUpdated: '2025-01-27T10:20:00Z',
    trend: 'falling'
  },
  {
    id: '4',
    name: 'Bangalore Tech Hub Well #12',
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Electronic City',
      state: 'Karnataka',
      district: 'Bangalore Urban'
    },
    currentLevel: 12.8,
    maxLevel: 22.0,
    status: 'good',
    lastUpdated: '2025-01-27T10:35:00Z',
    trend: 'rising'
  }
];

export const mockRegionalStats: RegionalStats[] = [
  {
    region: 'North India',
    totalWells: 1247,
    averageLevel: 13.2,
    criticalWells: 89,
    trend: -2.1
  },
  {
    region: 'South India',
    totalWells: 2156,
    averageLevel: 9.8,
    criticalWells: 312,
    trend: -4.5
  },
  {
    region: 'West India',
    totalWells: 1834,
    averageLevel: 11.6,
    criticalWells: 156,
    trend: -1.8
  },
  {
    region: 'East India',
    totalWells: 987,
    averageLevel: 16.4,
    criticalWells: 45,
    trend: 0.8
  }
];

// Generate mock historical data
export const generateMockReadings = (wellId: string, days: number = 7): WaterLevelReading[] => {
  const readings: WaterLevelReading[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const baseLevel = mockWells.find(w => w.id === wellId)?.currentLevel || 10;
    
    readings.push({
      timestamp: timestamp.toISOString(),
      level: baseLevel + (Math.random() - 0.5) * 2,
      temperature: 22 + Math.random() * 8,
      ph: 6.5 + Math.random() * 2,
      turbidity: Math.random() * 5
    });
  }
  
  return readings;
};

// Mock API functions
export const getWells = (): Promise<WellData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockWells), 500);
  });
};

export const getWellById = (id: string): Promise<WellData | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const well = mockWells.find(w => w.id === id) || null;
      resolve(well);
    }, 300);
  });
};

export const getWellReadings = (wellId: string, days: number = 7): Promise<WaterLevelReading[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockReadings(wellId, days));
    }, 400);
  });
};

export const getRegionalStats = (): Promise<RegionalStats[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRegionalStats), 300);
  });
};