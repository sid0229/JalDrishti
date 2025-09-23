import React from 'react';
import { Bell, User, Settings } from 'lucide-react';
import LogoFull from '../Logo/LogoFull';

export default function Header() {
  return (
    <header className="bg-[#FFF8E6] border-b border-[#003F7F]/10 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <LogoFull size="md" />
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6 text-[#003F7F]">
            <span className="text-sm font-medium">Real-time Monitoring</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-[#00FFC2] rounded-full animate-pulse"></div>
              <span className="text-sm">Live</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="relative p-2 text-[#003F7F] hover:bg-[#003F7F]/5 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00FFC2] rounded-full text-xs"></span>
            </button>
            
            <button className="p-2 text-[#003F7F] hover:bg-[#003F7F]/5 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
            
            <button className="flex items-center space-x-2 p-2 text-[#003F7F] hover:bg-[#003F7F]/5 rounded-lg transition-colors">
              <User size={20} />
              <span className="hidden md:inline text-sm font-medium">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}