import React, { useState } from 'react';
import { User, Bookmark, Bell, TrendingDown, TrendingUp, Award, MapPin, Calendar } from 'lucide-react';
import { Station } from '../../types/api';
import StationCard from '../Station/StationCard';

interface PersonalDashboardProps {
  stations: Station[];
  userType: 'citizen' | 'farmer' | 'ngo' | 'policy';
  onStationSelect: (station: Station) => void;
}

export default function PersonalDashboard({ stations, userType, onStationSelect }: PersonalDashboardProps) {
  const [watchlistedStations] = useState<string[]>(['DWLR-1234', 'DWLR-5678']);
  const [userProfile] = useState({
    name: 'Rajesh Kumar',
    location: 'Bangalore, Karnataka',
    joinedDate: '2024-01-15',
    badges: ['Water Aware', 'Community Helper', 'Data Explorer'],
    conservationScore: 85
  });

  const watchlistedStationData = stations.filter(s => watchlistedStations.includes(s.id));
  const nearbyStations = stations.slice(0, 3); // Mock nearby stations

  const getPersonalizedInsights = () => {
    switch (userType) {
      case 'farmer':
        return {
          title: 'Farming Insights',
          insights: [
            'Groundwater levels in your area are 15% below seasonal average',
            'Consider drought-resistant crops for the upcoming season',
            'Optimal irrigation timing: Early morning (5-7 AM)',
            'Monsoon prediction: Normal rainfall expected in July-August'
          ]
        };
      case 'ngo':
        return {
          title: 'Community Impact',
          insights: [
            '12 critical stations need immediate attention in your region',
            'Community engagement up 25% this month',
            'Water conservation workshops reaching 500+ families',
            'Partnership opportunities with 3 local organizations'
          ]
        };
      case 'policy':
        return {
          title: 'Policy Insights',
          insights: [
            'State-wide groundwater depletion rate: -2.3% annually',
            '45 districts require immediate intervention',
            'Budget allocation efficiency: 78% utilization',
            'Recommended: Expand monitoring network by 200 stations'
          ]
        };
      default:
        return {
          title: 'Your Water Insights',
          insights: [
            'Your area\'s groundwater is 8% above state average',
            'Recharge season typically starts in June',
            'Conservation tip: Fix leaky taps to save 20L/day',
            'Join the Water Warrior challenge to earn badges!'
          ]
        };
    }
  };

  const personalizedContent = getPersonalizedInsights();

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#014d86] to-[#00FFC2] rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{userProfile.name}</h2>
            <div className="flex items-center space-x-2 text-white/80">
              <MapPin size={16} />
              <span>{userProfile.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80 mt-1">
              <Calendar size={16} />
              <span>Member since {new Date(userProfile.joinedDate).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{userProfile.conservationScore}</div>
            <div className="text-white/80 text-sm">Conservation Score</div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {userProfile.badges.map((badge) => (
            <div key={badge} className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full text-sm">
              <Award size={14} />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personalized Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
            <h3 className="text-xl font-bold text-[#014d86] mb-4">{personalizedContent.title}</h3>
            <div className="space-y-3">
              {personalizedContent.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-[#00FFC2]/5 rounded-lg">
                  <div className="w-2 h-2 bg-[#00FFC2] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Watchlisted Stations */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bookmark size={20} className="text-[#014d86]" />
              <h3 className="text-xl font-bold text-[#014d86]">Your Watchlist</h3>
            </div>
            
            {watchlistedStationData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {watchlistedStationData.map((station) => (
                  <StationCard
                    key={station.id}
                    station={station}
                    onClick={onStationSelect}
                    showSparkline={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
                <p>No stations in your watchlist yet</p>
                <p className="text-sm mt-1">Add stations to track their water levels</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
            <h3 className="font-bold text-[#014d86] mb-4">Your Activity</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Stations Watched</span>
                <span className="font-semibold text-[#014d86]">{watchlistedStations.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Reports Submitted</span>
                <span className="font-semibold text-[#014d86]">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Challenges Completed</span>
                <span className="font-semibold text-[#014d86]">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Community Points</span>
                <span className="font-semibold text-[#00FFC2]">1,250</span>
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bell size={20} className="text-[#014d86]" />
              <h3 className="font-bold text-[#014d86]">Recent Alerts</h3>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingDown size={14} className="text-red-600" />
                  <span className="text-sm font-medium text-red-800">Critical Level</span>
                </div>
                <p className="text-sm text-red-700">Chennai station dropped below 4m</p>
                <p className="text-xs text-red-600 mt-1">2 hours ago</p>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingDown size={14} className="text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Declining Trend</span>
                </div>
                <p className="text-sm text-yellow-700">Mumbai station showing rapid decline</p>
                <p className="text-xs text-yellow-600 mt-1">5 hours ago</p>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp size={14} className="text-green-600" />
                  <span className="text-sm font-medium text-green-800">Recharge Event</span>
                </div>
                <p className="text-sm text-green-700">Bangalore station levels rising</p>
                <p className="text-xs text-green-600 mt-1">1 day ago</p>
              </div>
            </div>
          </div>

          {/* Nearby Stations */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
            <h3 className="font-bold text-[#014d86] mb-4">Nearby Stations</h3>
            <div className="space-y-3">
              {nearbyStations.map((station) => (
                <div key={station.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-medium text-[#014d86] text-sm">{station.name}</p>
                    <p className="text-xs text-gray-600">{station.location.district}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#014d86] text-sm">{station.currentLevel}m</p>
                    <p className={`text-xs ${
                      station.status === 'normal' ? 'text-green-600' :
                      station.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {station.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}