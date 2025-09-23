// API Types and Schemas for JalDrishti Platform

export interface Station {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    state: string;
    district: string;
    pincode: string;
  };
  currentLevel: number;
  maxLevel: number;
  minLevel: number;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  lastUpdated: string; // ISO 8601
  sensorHealth: 'good' | 'degraded' | 'poor';
  trend: 'rising' | 'stable' | 'falling';
  change24h: number;
  alertLevel: 'none' | 'drought' | 'drawdown' | 'recharge';
  distance?: number; // from user location
}

export interface WaterLevelReading {
  timestamp: string; // ISO 8601
  level: number;
  temperature: number;
  ph: number;
  turbidity: number;
  sourceId: string;
}

export interface Alert {
  id: string;
  stationId: string;
  stationName: string;
  type: 'drought' | 'drawdown' | 'recharge' | 'sensor_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  advisory: string;
  cta: string;
  timestamp: string;
  isActive: boolean;
  region: string;
}

export interface GlobalKPI {
  totalStations: number;
  activeAlerts: number;
  avgWaterLevelChange30d: number;
  lastUpdateMinutesAgo: number;
  lastUpdateTimestamp: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  citations?: string[];
  stationContext?: string;
}

export interface SearchResult {
  type: 'station' | 'place';
  id: string;
  name: string;
  subtitle: string;
  distance?: number;
  relevanceScore: number;
}

export interface UserSettings {
  language: 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'gu';
  voiceAssist: boolean;
  highContrast: boolean;
  dyslexicFont: boolean;
  reducedMotion: boolean;
  textToSpeechVoice: string;
  region: string;
  notifications: {
    sms: boolean;
    whatsapp: boolean;
    email: boolean;
  };
}

// API Response Types
export interface StationsResponse {
  stations: Station[];
  total: number;
  page: number;
  limit: number;
}

export interface StationHistoryResponse {
  stationId: string;
  range: 'week' | 'month' | 'year';
  readings: WaterLevelReading[];
  summary: {
    change: number;
    changePercent: number;
    trend: string;
    description: string;
  };
}

export interface AlertsResponse {
  alerts: Alert[];
  total: number;
  unreadCount: number;
}

export interface ChatResponse {
  message: string;
  citations: string[];
  suggestedActions: string[];
  relatedStations?: string[];
}