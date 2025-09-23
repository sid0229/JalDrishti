import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Header from './components/Layout/Header';
import AuthModal from './components/Auth/AuthModal';
import OfflineBanner from './components/Layout/OfflineBanner';
import StationDetail from './components/Station/StationDetail';
import ChatWidget from './components/Chat/ChatWidget';
import HomePage from './components/Pages/HomePage';
import StationsPage from './components/Pages/StationsPage';
import ProfilesPage from './components/Pages/ProfilesPage';
import NGOPage from './components/Pages/NGOPage';
import DecisionToolsPage from './components/Pages/DecisionToolsPage';
import ChatbotPage from './components/Pages/ChatbotPage';
import { Station, GlobalKPI, getStations, getGlobalKPI } from './services/api';

function App() {
  const [stations, setStations] = useState<Station[]>([]);
  const [globalKPI, setGlobalKPI] = useState<GlobalKPI | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [chatStationId, setChatStationId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'home' | 'stations' | 'profiles' | 'ngo' | 'decision' | 'chatbot'>('home');
  const [userType, setUserType] = useState<'citizen' | 'farmer' | 'ngo' | 'policy'>('citizen');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [stationsData, kpiData] = await Promise.all([
          getStations({ limit: 50 }),
          getGlobalKPI()
        ]);
        
        setStations(stationsData.stations);
        setGlobalKPI(kpiData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
  };

  const handleChatOpen = (stationId: string) => {
    setChatStationId(stationId);
  };

  const handleAuthenticate = (userData: any) => {
    setUser(userData);
    if (userData.isAuthenticated) {
      setActiveView('profiles');
    }
  };

  const handleAuthToggle = () => {
    if (user?.isAuthenticated) {
      // Logout
      setUser(null);
      setActiveView('home');
    } else {
      // Show login modal
      setShowAuthModal(true);
    }
  };

  const handleViewChange = (view: string) => {
    if (view === 'profiles' && !user?.isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setActiveView(view as any);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#014d86] border-t-transparent rounded-full mb-4"></div>
          <p className="text-[#014d86] font-medium">Loading JalDrishti Dashboard...</p>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage stations={stations} globalKPI={globalKPI} onStationSelect={handleStationSelect} />;
      case 'stations':
        return <StationsPage stations={stations} onStationSelect={handleStationSelect} />;
      case 'profiles':
        return user?.isAuthenticated ? (
          <ProfilesPage 
            stations={stations} 
            userType={userType} 
            onStationSelect={handleStationSelect}
            user={user}
          />
        ) : null;
      case 'ngo':
        return <NGOPage />;
      case 'decision':
        return (
          <DecisionToolsPage 
            stations={stations}
            globalKPI={globalKPI}
            userType={userType}
            onUserTypeChange={setUserType}
          />
        );
      case 'chatbot':
        return <ChatbotPage />;
      default:
        return <HomePage stations={stations} globalKPI={globalKPI} onStationSelect={handleStationSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <Header 
        globalKPI={globalKPI || undefined}
        activeView={activeView}
        onViewChange={handleViewChange}
        isAuthenticated={user?.isAuthenticated || false}
        onAuthToggle={handleAuthToggle}
      />
      <OfflineBanner />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderActiveView()}

        {/* Footer */}
        <footer className="mt-12 py-8 border-t border-[#003F7F]/10">
          <div className="text-center text-sm text-[#014d86]/70">
            <p>JalDrishti (जलदृष्टि) - Real-time Groundwater Monitoring Platform</p>
            <p className="mt-1">Built with precision for India's water security</p>
          </div>
        </footer>
      </main>
      
      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticate={handleAuthenticate}
      />
      
      {/* Station Detail Modal */}
      {selectedStation && (
        <StationDetail
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          onChatOpen={handleChatOpen}
        />
      )}
      
      {/* Chat Widget */}
      {activeView !== 'chatbot' && (
        <ChatWidget contextStationId={chatStationId} />
      )}
      
      {/* Community Feedback Sticky Tab */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-30">
        <button className="bg-[#2ca58d] text-white p-3 rounded-l-lg shadow-lg hover:bg-[#2ca58d]/90 transition-all writing-mode-vertical">
          <MessageCircle size={20} />
          <span className="text-xs mt-2 block">Feedback</span>
        </button>
      </div>
    </div>
  );
}

export default App;