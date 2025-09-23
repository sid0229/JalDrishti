import React, { useState } from 'react';
import { BarChart3, TrendingDown, AlertTriangle, Users, Target, Brain, Download, Filter } from 'lucide-react';
import { Station, GlobalKPI } from '../../types/api';

interface StakeholderDashboardProps {
  stations: Station[];
  globalKPI: GlobalKPI | null;
  userType: 'citizen' | 'farmer' | 'ngo' | 'policy';
  onUserTypeChange: (type: 'citizen' | 'farmer' | 'ngo' | 'policy') => void;
}

export default function StakeholderDashboard({ stations, globalKPI, userType, onUserTypeChange }: StakeholderDashboardProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const getStakeholderContent = () => {
    switch (userType) {
      case 'policy':
        return {
          title: 'Policy Maker Dashboard',
          subtitle: 'Strategic insights for water resource management',
          metrics: [
            { label: 'Critical Districts', value: '45', trend: '+12%', color: 'red' },
            { label: 'Budget Utilization', value: '78%', trend: '+5%', color: 'blue' },
            { label: 'Intervention Success', value: '67%', trend: '+15%', color: 'green' },
            { label: 'Monitoring Coverage', value: '85%', trend: '+8%', color: 'purple' }
          ],
          insights: [
            'Immediate intervention required in 12 districts showing >30% depletion',
            'Monsoon dependency reduced by 15% through artificial recharge programs',
            'ROI on groundwater monitoring: ₹4.2 saved per ₹1 invested',
            'Recommended: Expand DWLR network by 200 stations in critical zones'
          ]
        };
      case 'farmer':
        return {
          title: 'Farmer Dashboard',
          subtitle: 'Agricultural water management insights',
          metrics: [
            { label: 'Irrigation Readiness', value: '72%', trend: '-8%', color: 'blue' },
            { label: 'Crop Risk Level', value: 'Medium', trend: 'Stable', color: 'yellow' },
            { label: 'Water Availability', value: '65%', trend: '-12%', color: 'red' },
            { label: 'Seasonal Forecast', value: 'Normal', trend: 'Improving', color: 'green' }
          ],
          insights: [
            'Current groundwater levels support irrigation for 45-60 days',
            'Switch to drip irrigation to reduce water usage by 40%',
            'Optimal sowing window: June 15-30 based on monsoon forecast',
            'Consider drought-resistant varieties for Kharif season'
          ]
        };
      case 'ngo':
        return {
          title: 'NGO Dashboard',
          subtitle: 'Community impact and outreach metrics',
          metrics: [
            { label: 'Communities Served', value: '156', trend: '+23%', color: 'green' },
            { label: 'Active Volunteers', value: '89', trend: '+15%', color: 'blue' },
            { label: 'Conservation Projects', value: '34', trend: '+8%', color: 'purple' },
            { label: 'Impact Score', value: '8.4/10', trend: '+0.6', color: 'green' }
          ],
          insights: [
            '12 communities achieved 25% water conservation targets',
            'Rainwater harvesting projects increased recharge by 30%',
            'Community engagement up 40% through gamification',
            'Partnership opportunities with 8 local organizations identified'
          ]
        };
      default:
        return {
          title: 'Citizen Dashboard',
          subtitle: 'Your local water insights and conservation impact',
          metrics: [
            { label: 'Local Water Health', value: '7.2/10', trend: '+0.3', color: 'green' },
            { label: 'Conservation Score', value: '85%', trend: '+12%', color: 'blue' },
            { label: 'Community Rank', value: '#23', trend: '+5', color: 'purple' },
            { label: 'Monthly Savings', value: '₹340', trend: '+₹45', color: 'green' }
          ],
          insights: [
            'Your area\'s groundwater is 8% above district average',
            'You\'ve saved 2,400L water this month through conservation',
            'Recharge season starts in 45 days - prepare rainwater harvesting',
            'Join 3 active conservation challenges in your neighborhood'
          ]
        };
    }
  };

  const content = getStakeholderContent();

  const predictiveInsights = [
    {
      title: 'AI Forecast: Next 30 Days',
      prediction: 'Groundwater levels expected to decline by 0.8m',
      confidence: '87%',
      factors: ['Delayed monsoon', 'Increased agricultural demand', 'Rising temperatures']
    },
    {
      title: 'Risk Assessment',
      prediction: '15 stations likely to reach critical levels',
      confidence: '92%',
      factors: ['Historical patterns', 'Current depletion rate', 'Weather forecast']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with User Type Selector */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#014d86]">{content.title}</h2>
            <p className="text-gray-600">{content.subtitle}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={userType}
              onChange={(e) => onUserTypeChange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00FFC2] focus:border-transparent"
            >
              <option value="citizen">Citizen View</option>
              <option value="farmer">Farmer View</option>
              <option value="ngo">NGO View</option>
              <option value="policy">Policy Maker View</option>
            </select>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-[#014d86] text-white rounded-lg hover:bg-[#014d86]/90 transition-colors">
              <Download size={16} />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-600" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#00FFC2] focus:border-transparent"
            >
              <option value="all">All Regions</option>
              <option value="north">North India</option>
              <option value="south">South India</option>
              <option value="west">West India</option>
              <option value="east">East India</option>
            </select>
          </div>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-[#014d86] text-white'
                    : 'text-gray-600 hover:text-[#014d86]'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {content.metrics.map((metric, index) => (
          <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{metric.label}</span>
              <div className={`p-2 rounded-lg ${
                metric.color === 'red' ? 'bg-red-100 text-red-600' :
                metric.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                metric.color === 'green' ? 'bg-green-100 text-green-600' :
                metric.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                <BarChart3 size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#014d86] mb-1">{metric.value}</div>
            <div className={`text-sm font-medium ${
              metric.trend.startsWith('+') ? 'text-green-600' :
              metric.trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'
            }`}>
              {metric.trend} from last period
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Predictions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Brain size={20} className="text-[#014d86]" />
              <h3 className="text-xl font-bold text-[#014d86]">AI-Powered Predictions</h3>
            </div>
            
            <div className="space-y-4">
              {predictiveInsights.map((insight, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-[#014d86]/5 to-[#00FFC2]/5 rounded-lg border border-[#014d86]/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-[#014d86]">{insight.title}</h4>
                    <span className="text-sm bg-[#00FFC2]/20 text-[#014d86] px-2 py-1 rounded">
                      {insight.confidence} confidence
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{insight.prediction}</p>
                  <div className="flex flex-wrap gap-2">
                    {insight.factors.map((factor, i) => (
                      <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-[#014d86]/20">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
            <h3 className="text-xl font-bold text-[#014d86] mb-4">Key Insights & Recommendations</h3>
            <div className="space-y-3">
              {content.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-[#00FFC2]/5 rounded-lg">
                  <div className="w-2 h-2 bg-[#00FFC2] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Critical Alerts & Actions */}
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle size={20} className="text-red-600" />
              <h3 className="font-bold text-[#014d86]">Critical Alerts</h3>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-medium text-red-800 text-sm">Severe Depletion</div>
                <p className="text-red-700 text-sm">Chennai region: 15 stations critical</p>
                <button className="text-xs text-red-600 hover:text-red-800 mt-1">View Details →</button>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="font-medium text-yellow-800 text-sm">Rapid Decline</div>
                <p className="text-yellow-700 text-sm">Mumbai coastal: -2.3m in 7 days</p>
                <button className="text-xs text-yellow-600 hover:text-yellow-800 mt-1">View Details →</button>
              </div>
              
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="font-medium text-orange-800 text-sm">Sensor Issues</div>
                <p className="text-orange-700 text-sm">5 stations offline for more than 24h</p>
                <button className="text-xs text-orange-600 hover:text-orange-800 mt-1">View Details →</button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target size={20} className="text-[#014d86]" />
              <h3 className="font-bold text-[#014d86]">Quick Actions</h3>
            </div>
            
            <div className="space-y-2">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="font-medium text-[#014d86] text-sm">Generate Report</div>
                <div className="text-gray-600 text-xs">Create stakeholder summary</div>
              </button>
              
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="font-medium text-[#014d86] text-sm">Schedule Alert</div>
                <div className="text-gray-600 text-xs">Set up monitoring alerts</div>
              </button>
              
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="font-medium text-[#014d86] text-sm">Export Data</div>
                <div className="text-gray-600 text-xs">Download CSV/PDF reports</div>
              </button>
              
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="font-medium text-[#014d86] text-sm">Contact Support</div>
                <div className="text-gray-600 text-xs">Technical assistance</div>
              </button>
            </div>
          </div>

          {/* Performance Score */}
          {userType !== 'citizen' && (
            <div className="bg-gradient-to-r from-[#014d86] to-[#00FFC2] rounded-xl p-6 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <Users size={20} />
                <h3 className="font-bold">Impact Score</h3>
              </div>
              <div className="text-3xl font-bold mb-1">8.4/10</div>
              <div className="text-white/80 text-sm">
                {userType === 'policy' ? 'Policy effectiveness rating' :
                 userType === 'farmer' ? 'Water management efficiency' :
                 'Community impact score'}
              </div>
              <div className="mt-3 text-white/80 text-xs">
                +0.6 improvement this month
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}