import React, { useState } from 'react';
import { Users, MapPin, Camera, Send, Heart, MessageCircle, Share2, Award, Plus } from 'lucide-react';

interface CommunityReport {
  id: string;
  type: 'issue' | 'advisory' | 'success';
  title: string;
  description: string;
  location: string;
  author: string;
  timestamp: string;
  likes: number;
  comments: number;
  verified: boolean;
  images?: string[];
  tags: string[];
}

export default function CommunityReports() {
  const [activeTab, setActiveTab] = useState<'reports' | 'advisories' | 'challenges'>('reports');
  const [showReportForm, setShowReportForm] = useState(false);
  const [newReport, setNewReport] = useState({
    type: 'issue' as const,
    title: '',
    description: '',
    location: ''
  });

  const mockReports: CommunityReport[] = [
    {
      id: '1',
      type: 'issue',
      title: 'Hand pump dried up in Sector 12',
      description: 'The community hand pump that serves 50+ families has been dry for the past week. Water level seems to have dropped significantly.',
      location: 'Sector 12, Gurgaon, Haryana',
      author: 'Priya Sharma',
      timestamp: '2 hours ago',
      likes: 12,
      comments: 5,
      verified: true,
      tags: ['drought', 'handpump', 'urgent']
    },
    {
      id: '2',
      type: 'advisory',
      title: 'Water Conservation Workshop - This Weekend',
      description: 'Join us for a community workshop on rainwater harvesting and water conservation techniques. Free for all residents.',
      location: 'Community Center, Whitefield, Bangalore',
      author: 'Green Earth NGO',
      timestamp: '5 hours ago',
      likes: 28,
      comments: 12,
      verified: true,
      tags: ['workshop', 'conservation', 'education']
    },
    {
      id: '3',
      type: 'success',
      title: 'Successful Borewell Recharge Project',
      description: 'Our community successfully implemented a recharge pit system. Water levels have improved by 2 meters in just 3 months!',
      location: 'Jayanagar, Bangalore',
      author: 'Residents Welfare Association',
      timestamp: '1 day ago',
      likes: 45,
      comments: 18,
      verified: true,
      tags: ['success', 'recharge', 'community']
    }
  ];

  const challenges = [
    {
      id: '1',
      title: 'Water Warrior Challenge',
      description: 'Reduce household water usage by 20% this month',
      participants: 234,
      reward: 'Digital Badge + Tree Planting Certificate',
      progress: 65
    },
    {
      id: '2',
      title: 'Rainwater Harvesting Hero',
      description: 'Install and document a rainwater harvesting system',
      participants: 89,
      reward: 'Community Recognition + NGO Partnership',
      progress: 30
    }
  ];

  const handleSubmitReport = () => {
    // Mock submission
    console.log('Submitting report:', newReport);
    setShowReportForm(false);
    setNewReport({ type: 'issue', title: '', description: '', location: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#014d86]">Community Engagement</h2>
            <p className="text-gray-600 mt-1">Connect, report, and collaborate for better water management</p>
          </div>
          
          <button
            onClick={() => setShowReportForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#014d86] to-[#00FFC2] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            <Plus size={16} />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-xl p-1 border border-[#014d86]/10">
        {[
          { id: 'reports', label: 'Community Reports', icon: <Users size={16} /> },
          { id: 'advisories', label: 'NGO Advisories', icon: <MessageCircle size={16} /> },
          { id: 'challenges', label: 'Water Challenges', icon: <Award size={16} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#014d86] text-white shadow-lg'
                : 'text-[#014d86] hover:bg-[#014d86]/5'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockReports.map((report) => (
            <div key={report.id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    report.type === 'issue' ? 'bg-red-100 text-red-600' :
                    report.type === 'advisory' ? 'bg-blue-100 text-blue-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {report.type === 'issue' ? '⚠️' : report.type === 'advisory' ? '📢' : '✅'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#014d86]">{report.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{report.author}</span>
                      {report.verified && <span className="text-[#00FFC2]">✓</span>}
                      <span>•</span>
                      <span>{report.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{report.description}</p>

              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <MapPin size={14} />
                <span>{report.location}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {report.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-[#00FFC2]/10 text-[#014d86] rounded text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors">
                    <Heart size={16} />
                    <span>{report.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-[#014d86] transition-colors">
                    <MessageCircle size={16} />
                    <span>{report.comments}</span>
                  </button>
                </div>
                <button className="text-gray-600 hover:text-[#014d86] transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6 hover:shadow-lg transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-[#014d86] to-[#00FFC2] rounded-lg">
                  <Award size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#014d86]">{challenge.title}</h3>
                  <p className="text-sm text-gray-600">{challenge.participants} participants</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{challenge.description}</p>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-[#014d86]">{challenge.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#014d86] to-[#00FFC2] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#00FFC2]/10 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-[#014d86]">Reward: {challenge.reward}</p>
              </div>

              <button className="w-full bg-gradient-to-r from-[#014d86] to-[#00FFC2] text-white py-2 rounded-lg hover:shadow-lg transition-all">
                Join Challenge
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[#014d86] mb-4">Submit Community Report</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  value={newReport.type}
                  onChange={(e) => setNewReport(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00FFC2] focus:border-transparent"
                >
                  <option value="issue">Issue/Problem</option>
                  <option value="advisory">Community Advisory</option>
                  <option value="success">Success Story</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newReport.title}
                  onChange={(e) => setNewReport(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00FFC2] focus:border-transparent"
                  placeholder="Brief title for your report"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newReport.description}
                  onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00FFC2] focus:border-transparent"
                  placeholder="Detailed description of the situation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={newReport.location}
                  onChange={(e) => setNewReport(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00FFC2] focus:border-transparent"
                  placeholder="Area, City, State"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowReportForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                className="flex-1 bg-gradient-to-r from-[#014d86] to-[#00FFC2] text-white py-2 rounded-lg hover:shadow-lg transition-all"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}