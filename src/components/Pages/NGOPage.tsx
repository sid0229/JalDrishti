import React, { useState } from 'react';
import { Users, Phone, Mail, MapPin, ExternalLink, Plus, MessageCircle } from 'lucide-react';

interface NGO {
  id: string;
  name: string;
  description: string;
  location: string;
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  specialization: string[];
  verified: boolean;
  rating: number;
  projects: number;
}

export default function NGOPage() {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportData, setReportData] = useState({
    title: '',
    description: '',
    location: '',
    urgency: 'medium'
  });

  const mockNGOs: NGO[] = [
    {
      id: '1',
      name: 'Water Conservation Foundation',
      description: 'Dedicated to groundwater conservation and community awareness programs across rural India.',
      location: 'Delhi, India',
      contact: {
        phone: '+91-11-2345-6789',
        email: 'contact@waterconservation.org',
        website: 'https://waterconservation.org'
      },
      specialization: ['Groundwater Management', 'Community Training', 'Policy Advocacy'],
      verified: true,
      rating: 4.8,
      projects: 156
    },
    {
      id: '2',
      name: 'Jal Shakti Seva Trust',
      description: 'Working with farmers and communities to implement sustainable water management practices.',
      location: 'Maharashtra, India',
      contact: {
        phone: '+91-22-9876-5432',
        email: 'info@jalshakti.org'
      },
      specialization: ['Farmer Support', 'Rainwater Harvesting', 'Drought Mitigation'],
      verified: true,
      rating: 4.6,
      projects: 89
    },
    {
      id: '3',
      name: 'Bhumi Water Initiative',
      description: 'Technology-driven solutions for water crisis management and community empowerment.',
      location: 'Bangalore, India',
      contact: {
        phone: '+91-80-1234-5678',
        email: 'hello@bhumiwater.org',
        website: 'https://bhumiwater.org'
      },
      specialization: ['Technology Solutions', 'Data Analytics', 'Community Engagement'],
      verified: true,
      rating: 4.9,
      projects: 234
    }
  ];

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    console.log('Report submitted:', reportData);
    setShowReportForm(false);
    setReportData({ title: '', description: '', location: '', urgency: 'medium' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#014d86]">NGO Partners & Community</h2>
            <p className="text-gray-600 mt-1">Connect with organizations working on groundwater conservation</p>
          </div>
          
          <button
            onClick={() => setShowReportForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#014d86] to-[#2ca58d] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            <Plus size={16} />
            <span>Report Issue</span>
          </button>
        </div>
      </div>

      {/* NGO Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockNGOs.map((ngo) => (
          <div key={ngo.id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#014d86]/10 p-6 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-bold text-[#014d86]">{ngo.name}</h3>
                  {ngo.verified && (
                    <span className="bg-[#2ca58d] text-white text-xs px-2 py-1 rounded-full">Verified</span>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{ngo.description}</p>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <MapPin size={14} />
                  <span>{ngo.location}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {ngo.specialization.map((spec) => (
                    <span key={spec} className="bg-[#014d86]/10 text-[#014d86] px-2 py-1 rounded text-xs font-medium">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold text-[#014d86]">{ngo.rating}</span>
                </div>
                <div className="text-sm text-gray-600">{ngo.projects} projects</div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <Phone size={14} className="text-gray-400" />
                <a href={`tel:${ngo.contact.phone}`} className="text-[#014d86] hover:text-[#2ca58d]">
                  {ngo.contact.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail size={14} className="text-gray-400" />
                <a href={`mailto:${ngo.contact.email}`} className="text-[#014d86] hover:text-[#2ca58d]">
                  {ngo.contact.email}
                </a>
              </div>
              {ngo.contact.website && (
                <div className="flex items-center space-x-2 text-sm">
                  <ExternalLink size={14} className="text-gray-400" />
                  <a 
                    href={ngo.contact.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#014d86] hover:text-[#2ca58d]"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button className="flex-1 bg-[#014d86] text-white py-2 rounded-lg hover:bg-[#014d86]/90 transition-all text-sm font-medium">
                Contact NGO
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-[#014d86] text-[#014d86] rounded-lg hover:bg-[#014d86]/5 transition-all">
                <MessageCircle size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Community Impact Stats */}
      <div className="bg-gradient-to-r from-[#014d86] to-[#2ca58d] rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Community Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">156</div>
            <div className="text-white/80 text-sm">Communities Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">2.3M</div>
            <div className="text-white/80 text-sm">People Reached</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">479</div>
            <div className="text-white/80 text-sm">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">₹45Cr</div>
            <div className="text-white/80 text-sm">Funds Deployed</div>
          </div>
        </div>
      </div>

      {/* Report Issue Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[#014d86] mb-4">Report Water Issue</h3>
            
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Title</label>
                <input
                  type="text"
                  value={reportData.title}
                  onChange={(e) => setReportData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ca58d] focus:border-transparent"
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={reportData.description}
                  onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ca58d] focus:border-transparent"
                  placeholder="Detailed description of the water issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={reportData.location}
                  onChange={(e) => setReportData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ca58d] focus:border-transparent"
                  placeholder="Village, District, State"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                <select
                  value={reportData.urgency}
                  onChange={(e) => setReportData(prev => ({ ...prev, urgency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ca58d] focus:border-transparent"
                >
                  <option value="low">Low - Can wait</option>
                  <option value="medium">Medium - Needs attention</option>
                  <option value="high">High - Urgent</option>
                  <option value="critical">Critical - Emergency</option>
                </select>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#014d86] to-[#2ca58d] text-white py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}