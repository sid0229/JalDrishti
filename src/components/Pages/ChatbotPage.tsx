import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock groundwater data
const mockGroundwaterData = {
  stations: [
    {
      id: 'UP_001',
      name: 'Bundelkhand Station 1',
      state: 'Uttar Pradesh',
      region: 'Bundelkhand',
      lat: 25.4484,
      lng: 81.8467,
      currentLevel: 12.5,
      previousLevel: 10.8,
      rainfall: 850,
      recharge: 15.2,
      status: 'improving'
    },
    {
      id: 'RAJ_001',
      name: 'Rajasthan Central',
      state: 'Rajasthan',
      region: 'Central Rajasthan',
      lat: 26.9124,
      lng: 75.7873,
      currentLevel: 8.2,
      previousLevel: 9.1,
      rainfall: 320,
      recharge: -8.5,
      status: 'declining'
    },
    {
      id: 'GUJ_001',
      name: 'Gujarat Coastal',
      state: 'Gujarat',
      region: 'Coastal Gujarat',
      lat: 21.1702,
      lng: 72.8311,
      currentLevel: 18.3,
      previousLevel: 16.7,
      rainfall: 1200,
      recharge: 22.1,
      status: 'excellent'
    },
    {
      id: 'TN_001',
      name: 'Tamil Nadu Delta',
      state: 'Tamil Nadu',
      region: 'Cauvery Delta',
      lat: 10.7905,
      lng: 79.1378,
      currentLevel: 6.8,
      previousLevel: 8.2,
      rainfall: 450,
      recharge: -12.3,
      status: 'critical'
    },
    {
      id: 'MH_001',
      name: 'Maharashtra Plateau',
      state: 'Maharashtra',
      region: 'Deccan Plateau',
      lat: 19.7515,
      lng: 75.7139,
      currentLevel: 14.6,
      previousLevel: 13.2,
      rainfall: 980,
      recharge: 18.7,
      status: 'stable'
    }
  ],
  alerts: [
    {
      id: 1,
      type: 'critical',
      station: 'Tamil Nadu Delta',
      message: 'Groundwater level dropped below critical threshold (7m)',
      timestamp: '2025-09-23T10:30:00Z'
    },
    {
      id: 2,
      type: 'warning',
      station: 'Rajasthan Central',
      message: 'Continuous decline in water level for 3 months',
      timestamp: '2025-09-23T09:15:00Z'
    },
    {
      id: 3,
      type: 'positive',
      station: 'Bundelkhand Station 1',
      message: 'Recharge improved by 15% post-monsoon',
      timestamp: '2025-09-23T08:45:00Z'
    }
  ],
  nationalSummary: {
    totalStations: 1247,
    criticalStations: 89,
    improvingStations: 156,
    averageRecharge: 8.2,
    seasonalTrend: 'improving'
  }
};

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  charts?: ChartData[];
  insights?: string[];
}

interface ChartData {
  type: 'line' | 'bar' | 'heatmap';
  title: string;
  data: any[];
  config?: any;
}

const JalInsightChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'query' | 'dashboards' | 'alerts'>('query');
  const [selectedDashboard, setSelectedDashboard] = useState<'national' | 'state' | 'station'>('national');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI('AIzaSyCiknT27VA2Io1YdKZht4FEUhTAZJHJg18'); // Hardcoded API key
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const generateChart = (query: string, data: any): ChartData[] => {
    const charts: ChartData[] = [];

    if (query.toLowerCase().includes('trend') || query.toLowerCase().includes('level')) {
      charts.push({
        type: 'line',
        title: 'Groundwater Level Trends',
        data: mockGroundwaterData.stations.map(station => ({
          station: station.name,
          current: station.currentLevel,
          previous: station.previousLevel,
          change: station.currentLevel - station.previousLevel
        }))
      });
    }

    if (query.toLowerCase().includes('rainfall') || query.toLowerCase().includes('recharge')) {
      charts.push({
        type: 'bar',
        title: 'Rainfall vs Recharge Correlation',
        data: mockGroundwaterData.stations.map(station => ({
          station: station.name,
          rainfall: station.rainfall,
          recharge: station.recharge
        }))
      });
    }

    if (query.toLowerCase().includes('state') || query.toLowerCase().includes('region')) {
      charts.push({
        type: 'heatmap',
        title: 'Regional Status Overview',
        data: mockGroundwaterData.stations.map(station => ({
          state: station.state,
          level: station.currentLevel,
          status: station.status,
          recharge: station.recharge
        }))
      });
    }

    return charts;
  };

  const generateInsights = (query: string): string[] => {
    const insights: string[] = [];

    // Analyze query and provide relevant insights
    if (query.toLowerCase().includes('bundelkhand')) {
      insights.push('✅ Bundelkhand region shows 15% improvement in recharge post-monsoon season');
      insights.push('📊 Current groundwater level: 12.5m (up from 10.8m)');
    }

    if (query.toLowerCase().includes('rajasthan')) {
      insights.push('⚠️ Alert: Rajasthan Central station showing continuous decline');
      insights.push('📉 Drawdown rate: -8.5% exceeding safe threshold');
    }

    if (query.toLowerCase().includes('critical') || query.toLowerCase().includes('alert')) {
      insights.push('🚨 89 stations currently below critical threshold nationwide');
      insights.push('🔄 156 stations showing improvement trends');
    }

    if (query.toLowerCase().includes('national') || query.toLowerCase().includes('overall')) {
      insights.push('📈 National average recharge rate: 8.2% (seasonal improvement)');
      insights.push('🎯 1247 monitoring stations active across India');
    }

    return insights.length > 0 ? insights : [
      '📊 Analysis complete for your query',
      '💧 Groundwater data processed from active monitoring stations',
      '🔍 Use specific terms like "Bundelkhand", "rainfall", or "critical" for detailed insights'
    ];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Generate AI response using Gemini
      const prompt = `You are JalInsight, an AI analyst for groundwater monitoring in India. 
      Query: "${inputText}"

      Context: Groundwater monitoring system with data from stations across India.

      Provide a professional analysis response focusing on:
      - Data insights related to the query
      - Actionable recommendations
      - Technical observations

      Keep response concise, professional, and data-driven. Avoid generic responses.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      // Generate charts and insights
      const charts = generateChart(inputText, mockGroundwaterData);
      const insights = generateInsights(inputText);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: aiResponse,
        timestamp: new Date(),
        charts,
        insights
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const renderChart = (chart: ChartData) => {
    switch (chart.type) {
      case 'line':
        return (
          <div className="chart-container">
            <h4>{chart.title}</h4>
            <div className="line-chart">
              {chart.data.map((item, index) => (
                <div key={index} className="chart-item">
                  <div className="station-name">{item.station}</div>
                  <div className="chart-bar-container">
                    <div 
                      className="chart-bar"
                      style={{ 
                        width: `${Math.max(5, (item.current / 20) * 100)}%`,
                        backgroundColor: item.change > 0 ? '#10b981' : '#ef4444'
                      }}
                    />
                    <span className="chart-value">{item.current}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'bar':
        return (
          <div className="chart-container">
            <h4>{chart.title}</h4>
            <div className="bar-chart">
              {chart.data.map((item, index) => (
                <div key={index} className="chart-item">
                  <div className="station-name">{item.station}</div>
                  <div className="dual-bar">
                    <div className="bar-group">
                      <div 
                        className="chart-bar rainfall"
                        style={{ height: `${(item.rainfall / 1500) * 100}px` }}
                      />
                      <span className="bar-label">Rainfall</span>
                    </div>
                    <div className="bar-group">
                      <div 
                        className="chart-bar recharge"
                        style={{ 
                          height: `${Math.abs(item.recharge) * 3}px`,
                          backgroundColor: item.recharge > 0 ? '#10b981' : '#ef4444'
                        }}
                      />
                      <span className="bar-label">Recharge</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'heatmap':
        return (
          <div className="chart-container">
            <h4>{chart.title}</h4>
            <div className="heatmap">
              {chart.data.map((item, index) => (
                <div 
                  key={index} 
                  className={`heatmap-cell ${item.status}`}
                  title={`${item.state}: ${item.level}m`}
                >
                  <div className="state-name">{item.state}</div>
                  <div className="level-value">{item.level}m</div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPresetDashboard = () => {
    switch (selectedDashboard) {
      case 'national':
        return (
          <div className="dashboard-content">
            <div className="dashboard-header">
              <h3>National Groundwater Overview</h3>
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="card-value">{mockGroundwaterData.nationalSummary.totalStations}</div>
                  <div className="card-label">Active Stations</div>
                </div>
                <div className="summary-card critical">
                  <div className="card-value">{mockGroundwaterData.nationalSummary.criticalStations}</div>
                  <div className="card-label">Critical Stations</div>
                </div>
                <div className="summary-card positive">
                  <div className="card-value">{mockGroundwaterData.nationalSummary.improvingStations}</div>
                  <div className="card-label">Improving</div>
                </div>
              </div>
            </div>
            <div className="dashboard-charts">
              {renderChart({
                type: 'heatmap',
                title: 'National Status Map',
                data: mockGroundwaterData.stations.map(station => ({
                  state: station.state,
                  level: station.currentLevel,
                  status: station.status,
                  recharge: station.recharge
                }))
              })}
            </div>
          </div>
        );
      case 'state':
        return (
          <div className="dashboard-content">
            <h3>State-wise Analysis</h3>
            {renderChart({
              type: 'bar',
              title: 'State Comparison',
              data: mockGroundwaterData.stations.map(station => ({
                station: station.state,
                rainfall: station.rainfall,
                recharge: station.recharge
              }))
            })}
          </div>
        );
      case 'station':
        return (
          <div className="dashboard-content">
            <h3>Station-level Details</h3>
            {renderChart({
              type: 'line',
              title: 'Station Performance',
              data: mockGroundwaterData.stations.map(station => ({
                station: station.name,
                current: station.currentLevel,
                previous: station.previousLevel,
                change: station.currentLevel - station.previousLevel
              }))
            })}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="jalinsight-container">
      <div className="jalinsight-header">
        <h2>🌊 JalInsight</h2>
        <p>Groundwater Analytics & Decision Support</p>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'query' ? 'active' : ''}`}
          onClick={() => setActiveTab('query')}
        >
          Query Mode
        </button>
        <button 
          className={`tab-btn ${activeTab === 'dashboards' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboards')}
        >
          Dashboards
        </button>
        <button 
          className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          Alerts
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'query' && (
          <div className="query-mode">
            <div className="messages-container">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.type}`}>
                  <div className="message-content">
                    <p>{message.content}</p>
                    {message.insights && (
                      <div className="insights-card">
                        <h4>📊 Key Insights</h4>
                        <ul>
                          {message.insights.map((insight, index) => (
                            <li key={index}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {message.charts && message.charts.map((chart, index) => (
                      <div key={index} className="chart-wrapper">
                        {renderChart(chart)}
                      </div>
                    ))}
                  </div>
                  <div className="message-timestamp">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message bot loading">
                  <div className="loading-indicator">
                    <div className="loading-dots">
                      <span></span><span></span><span></span>
                    </div>
                    <p>Analyzing groundwater data...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-container">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about groundwater trends, station data, or regional analysis..."
                disabled={isLoading}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputText.trim()}
              >
                <span>💬</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'dashboards' && (
          <div className="dashboards-mode">
            <div className="dashboard-selector">
              <button 
                className={`dashboard-btn ${selectedDashboard === 'national' ? 'active' : ''}`}
                onClick={() => setSelectedDashboard('national')}
              >
                National
              </button>
              <button 
                className={`dashboard-btn ${selectedDashboard === 'state' ? 'active' : ''}`}
                onClick={() => setSelectedDashboard('state')}
              >
                State-wise
              </button>
              <button 
                className={`dashboard-btn ${selectedDashboard === 'station' ? 'active' : ''}`}
                onClick={() => setSelectedDashboard('station')}
              >
                Station-level
              </button>
            </div>
            {renderPresetDashboard()}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="alerts-mode">
            <h3>🚨 Real-time Alerts</h3>
            <div className="alerts-container">
              {mockGroundwaterData.alerts.map((alert) => (
                <div key={alert.id} className={`alert-card ${alert.type}`}>
                  <div className="alert-header">
                    <span className="alert-icon">
                      {alert.type === 'critical' ? '🔴' : 
                       alert.type === 'warning' ? '🟡' : '🟢'}
                    </span>
                    <span className="alert-station">{alert.station}</span>
                    <span className="alert-time">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="alert-message">{alert.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .jalinsight-container {
          max-width: 1200px;
          margin: 0 auto;
          background: #faf9f6;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(1, 77, 134, 0.1);
          overflow: hidden;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .jalinsight-header {
          background: linear-gradient(135deg, #014d86 0%, #0066a7 100%);
          color: white;
          padding: 20px;
          text-align: center;
        }

        .jalinsight-header h2 {
          margin: 0 0 8px 0;
          font-size: 1.8rem;
          font-weight: 600;
        }

        .jalinsight-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.95rem;
        }

        .tab-navigation {
          display: flex;
          background: #e8e6e1;
          border-bottom: 1px solid #d0cdc7;
        }

        .tab-btn {
          flex: 1;
          padding: 15px 20px;
          background: transparent;
          border: none;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.95rem;
        }

        .tab-btn:hover {
          background: #ddd9d2;
          color: #014d86;
        }

        .tab-btn.active {
          background: #faf9f6;
          color: #014d86;
          font-weight: 600;
          border-bottom: 3px solid #014d86;
        }

        .tab-content {
          height: 600px;
          overflow-y: auto;
        }

        .query-mode {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .messages-container {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: #faf9f6;
        }

        .message {
          margin-bottom: 20px;
          max-width: 85%;
        }

        .message.user {
          margin-left: auto;
        }

        .message.bot {
          margin-right: auto;
        }

        .message-content {
          background: white;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-left: 4px solid #014d86;
        }

        .message.user .message-content {
          background: #014d86;
          color: white;
          border-left: 4px solid #0066a7;
        }

        .message-timestamp {
          font-size: 0.8rem;
          color: #666;
          margin-top: 5px;
          text-align: right;
        }

        .message.user .message-timestamp {
          text-align: left;
        }

        .insights-card {
          margin-top: 15px;
          background: #f0f8ff;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #10b981;
        }

        .insights-card h4 {
          margin: 0 0 10px 0;
          color: #014d86;
          font-size: 1rem;
        }

        .insights-card ul {
          margin: 0;
          padding-left: 20px;
        }

        .insights-card li {
          margin-bottom: 5px;
          color: #333;
          line-height: 1.4;
        }

        .chart-wrapper {
          margin-top: 20px;
        }

        .chart-container {
          background: white;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e0ddd6;
        }

        .chart-container h4 {
          margin: 0 0 15px 0;
          color: #014d86;
          font-size: 1.1rem;
          border-bottom: 2px solid #014d86;
          padding-bottom: 5px;
        }

        .line-chart, .bar-chart {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chart-item {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .station-name {
          font-weight: 500;
          min-width: 140px;
          font-size: 0.9rem;
          color: #333;
        }

        .chart-bar-container {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .chart-bar {
          height: 24px;
          border-radius: 4px;
          transition: all 0.3s ease;
          min-width: 20px;
        }

        .chart-value {
          font-weight: 600;
          color: #014d86;
          font-size: 0.9rem;
        }

        .dual-bar {
          display: flex;
          gap: 20px;
          flex: 1;
        }

        .bar-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .chart-bar.rainfall {
          background: #3b82f6;
          width: 30px;
        }

        .chart-bar.recharge {
          width: 30px;
        }

        .bar-label {
          font-size: 0.8rem;
          color: #666;
        }

        .heatmap {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .heatmap-cell {
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          transition: transform 0.2s ease;
          cursor: pointer;
        }

        .heatmap-cell:hover {
          transform: translateY(-2px);
        }

        .heatmap-cell.excellent {
          background: #d1fae5;
          border: 2px solid #10b981;
        }

        .heatmap-cell.improving {
          background: #dbeafe;
          border: 2px solid #3b82f6;
        }

        .heatmap-cell.stable {
          background: #fef3c7;
          border: 2px solid #f59e0b;
        }

        .heatmap-cell.declining {
          background: #fed7d7;
          border: 2px solid #ef4444;
        }

        .heatmap-cell.critical {
          background: #fecaca;
          border: 2px solid #dc2626;
        }

        .state-name {
          font-weight: 600;
          margin-bottom: 5px;
          color: #333;
        }

        .level-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #014d86;
        }

        .input-container {
          display: flex;
          gap: 12px;
          padding: 20px;
          background: white;
          border-top: 1px solid #e0ddd6;
        }

        .input-container input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e0ddd6;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .input-container input:focus {
          border-color: #014d86;
        }

        .input-container button {
          padding: 12px 20px;
          background: #014d86;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.2rem;
          transition: background-color 0.2s ease;
        }

        .input-container button:hover:not(:disabled) {
          background: #0066a7;
        }

        .input-container button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-indicator {
          text-align: center;
          padding: 20px;
        }

        .loading-dots {
          display: inline-flex;
          gap: 4px;
          margin-bottom: 10px;
        }

        .loading-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #014d86;
          animation: loading 1.4s infinite ease-in-out;
        }

        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes loading {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .dashboards-mode {
          padding: 20px;
        }

        .dashboard-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
        }

        .dashboard-btn {
          padding: 10px 20px;
          background: #e8e6e1;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          color: #666;
          transition: all 0.2s ease;
        }

        .dashboard-btn:hover {
          background: #ddd9d2;
          color: #014d86;
        }

        .dashboard-btn.active {
          background: #014d86;
          color: white;
        }

        .dashboard-content {
          background: white;
          border-radius: 8px;
          padding: 25px;
          border: 1px solid #e0ddd6;
        }

        .dashboard-header h3 {
          margin: 0 0 20px 0;
          color: #014d86;
          font-size: 1.4rem;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }

        .summary-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 2px solid #e9ecef;
        }

        .summary-card.critical {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .summary-card.positive {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }

        .card-value {
          font-size: 2rem;
          font-weight: 700;
          color: #014d86;
          margin-bottom: 5px;
        }

        .card-label {
          color: #666;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .alerts-mode {
          padding: 20px;
        }

        .alerts-mode h3 {
          margin: 0 0 20px 0;
          color: #014d86;
          font-size: 1.4rem;
        }

        .alerts-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .alert-card {
          background: white;
          border-radius: 8px;
          padding: 16px 20px;
          border-left: 4px solid #666;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .alert-card.critical {
          border-left-color: #dc2626;
          background: #fef2f2;
        }

        .alert-card.warning {
          border-left-color: #f59e0b;
          background: #fffbeb;
        }

        .alert-card.positive {
          border-left-color: #10b981;
          background: #f0fdf4;
        }

        .alert-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .alert-icon {
          font-size: 1.1rem;
        }

        .alert-station {
          font-weight: 600;
          color: #333;
          flex: 1;
        }

        .alert-time {
          font-size: 0.8rem;
          color: #666;
        }

        .alert-message {
          color: #555;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .jalinsight-container {
            margin: 10px;
            border-radius: 8px;
          }

          .tab-content {
            height: 500px;
          }

          .heatmap {
            grid-template-columns: 1fr;
          }

          .summary-cards {
            grid-template-columns: 1fr 1fr;
          }

          .chart-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .station-name {
            min-width: unset;
          }
        }
      `}</style>
    </div>
  );
};

export default JalInsightChatBot;