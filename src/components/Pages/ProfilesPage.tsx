import React from 'react';
import { Station } from '../../types/api';
import PersonalDashboard from '../Dashboard/PersonalDashboard';

interface ProfilesPageProps {
  stations: Station[];
  userType: 'citizen' | 'farmer' | 'ngo' | 'policy';
  onStationSelect: (station: Station) => void;
  user: any;
}

export default function ProfilesPage({ stations, userType, onStationSelect, user }: ProfilesPageProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
        <h2 className="text-2xl font-bold text-[#014d86] mb-2">Personal Dashboard</h2>
        <p className="text-gray-600">Your personalized groundwater monitoring experience</p>
      </div>
      
      <PersonalDashboard 
        stations={stations}
        userType={userType}
        onStationSelect={onStationSelect}
      />
    </div>
  );
}