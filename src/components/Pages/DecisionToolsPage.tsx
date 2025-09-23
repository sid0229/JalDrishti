import React from 'react';
import { Station, GlobalKPI } from '../../types/api';
import StakeholderDashboard from '../Dashboard/StakeholderDashboard';

interface DecisionToolsPageProps {
  stations: Station[];
  globalKPI: GlobalKPI | null;
  userType: 'citizen' | 'farmer' | 'ngo' | 'policy';
  onUserTypeChange: (type: 'citizen' | 'farmer' | 'ngo' | 'policy') => void;
}

export default function DecisionToolsPage({ stations, globalKPI, userType, onUserTypeChange }: DecisionToolsPageProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
        <h2 className="text-2xl font-bold text-[#014d86] mb-2">Decision Support Tools</h2>
        <p className="text-gray-600">AI-powered insights and analytics for informed decision making</p>
      </div>
      
      <StakeholderDashboard 
        stations={stations}
        globalKPI={globalKPI}
        userType={userType}
        onUserTypeChange={onUserTypeChange}
      />
    </div>
  );
}