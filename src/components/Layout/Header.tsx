import React, { useState } from 'react';
import { Bell, Settings, Globe, Accessibility, Volume2, VolumeX, User, LogIn } from 'lucide-react';
import LogoFull from '../Logo/LogoFull';
import { useAccessibility } from '../../hooks/useAccessibility';

interface HeaderProps {
  globalKPI?: {
    totalStations: number;
    activeAlerts: number;
    avgWaterLevelChange30d: number;
    lastUpdateMinutesAgo: number;
  };
  activeView: string;
  onViewChange: (view: string) => void;
  isAuthenticated: boolean;
  onAuthToggle: () => void;
}

export default function Header({ globalKPI, activeView, onViewChange, isAuthenticated, onAuthToggle }: HeaderProps) {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const { settings, updateSettings, speak } = useAccessibility();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' }
  ];

  const navigationTabs = [
    { id: 'home', label: 'Home' },
    { id: 'stations', label: 'Stations / Maps' },
    { id: 'profiles', label: 'Profiles', requiresAuth: true },
    { id: 'ngo', label: 'NGO / Partners' },
    { id: 'decision', label: 'Decision Tools' },
    { id: 'chatbot', label: 'Jalinsight' }
  ];

  const handleVoiceToggle = () => {
    const newVoiceAssist = !settings.voiceAssist;
    updateSettings({ voiceAssist: newVoiceAssist });
    
    if (newVoiceAssist) {
      speak('Voice assistance enabled');
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-[#014d86]/10 px-4 sm:px-6 py-3 sticky top-0 z-50 shadow-sm">
  <div className="flex items-center justify-between max-w-7xl mx-auto">
    <img 
      src="src/logo_jd.png"       // replace with your PNG path
      alt="JalDrishti Logo" 
      className="w-auto h-16 flex-shrink-0" 
    />
  


        
        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 bg-white/50 backdrop-blur-sm rounded-xl p-1 border border-[#014d86]/10">
          {navigationTabs.map((tab) => {
            const isDisabled = tab.requiresAuth && !isAuthenticated;
            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && onViewChange(tab.id)}
                disabled={isDisabled}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === tab.id
                    ? 'bg-[#014d86] text-white shadow-lg'
                    : isDisabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-[#014d86] hover:bg-[#014d86]/5 hover:scale-105'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
        
        <div className="flex items-center space-x-3">
          {/* Last Updated Indicator */}
          {globalKPI && (
            <div className="hidden md:flex items-center space-x-2 text-sm text-[#014d86]/70 bg-white/50 px-3 py-1 rounded-lg border border-[#014d86]/10">
              <div className="w-2 h-2 bg-[#2ca58d] rounded-full animate-pulse"></div>
              <span>Last Updated: {globalKPI.lastUpdateMinutesAgo} min ago</span>
            </div>
          )}

          {/* Language Picker */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="p-2 text-[#014d86] hover:bg-[#014d86]/5 rounded-lg transition-all hover:scale-105 flex items-center space-x-1"
              aria-label="Select language"
            >
              <Globe size={18} />
              <span className="hidden sm:inline text-sm font-medium">
                {languages.find(l => l.code === settings.language)?.native}
              </span>
            </button>
            
            {showLanguageMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-[#014d86]/20 py-2 min-w-48 z-50">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      updateSettings({ language: lang.code as any });
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                      settings.language === lang.code ? 'bg-[#2ca58d]/10 text-[#014d86] font-medium' : 'text-gray-700'
                    }`}
                  >
                    <span>{lang.name}</span>
                    <span className="text-sm opacity-70">{lang.native}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accessibility Menu */}
          <div className="relative">
            <button
              onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
              className="p-2 text-[#014d86] hover:bg-[#014d86]/5 rounded-lg transition-all hover:scale-105"
              aria-label="Accessibility options"
            >
              <Accessibility size={18} />
            </button>
            
            {showAccessibilityMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-[#014d86]/20 py-2 min-w-64 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-medium text-[#014d86]">Accessibility Options</h3>
                </div>
                
                <button
                  onClick={handleVoiceToggle}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    {settings.voiceAssist ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    <span>Voice Assist</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors ${settings.voiceAssist ? 'bg-[#2ca58d]' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform mt-0.5 ${settings.voiceAssist ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </button>
                
                <button
                  onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>High Contrast</span>
                  <div className={`w-10 h-5 rounded-full transition-colors ${settings.highContrast ? 'bg-[#2ca58d]' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform mt-0.5 ${settings.highContrast ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </button>
                
                <button
                  onClick={() => updateSettings({ dyslexicFont: !settings.dyslexicFont })}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>Dyslexic Font</span>
                  <div className={`w-10 h-5 rounded-full transition-colors ${settings.dyslexicFont ? 'bg-[#2ca58d]' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform mt-0.5 ${settings.dyslexicFont ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </button>
                
                <button
                  onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>Reduced Motion</span>
                  <div className={`w-10 h-5 rounded-full transition-colors ${settings.reducedMotion ? 'bg-[#2ca58d]' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform mt-0.5 ${settings.reducedMotion ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Authentication */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <button className="relative p-2 text-[#014d86] hover:bg-[#014d86]/5 rounded-lg transition-all hover:scale-105">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </button>
              <button 
                onClick={onAuthToggle}
                className="flex items-center space-x-2 p-2 text-[#014d86] hover:bg-[#014d86]/5 rounded-lg transition-all hover:scale-105"
              >
                <User size={18} />
                <span className="hidden sm:inline text-sm font-medium">Profile</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthToggle}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#014d86] to-[#2ca58d] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all hover:scale-105"
            >
              <LogIn size={16} />
              <span className="font-medium">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}