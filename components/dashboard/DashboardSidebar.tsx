'use client';

import React from 'react';
import { User, Lock, Clock } from 'lucide-react';

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userData: {
    tier: string;
  };
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  setActiveTab,
  userData
}) => {
  return (
    <div className="hidden md:block w-64 border-r border-gray-800/70">
      {/* Sidebar buffer */}
      <div className="h-16 border-b border-gray-800/30"></div>
      
      <div className="px-4 py-6">
        <nav className="space-y-1">
          <div 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${activeTab === 'profile' ? 'bg-gray-800/50 text-amber-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'} transition-colors duration-150`}
          >
            <User className={`h-4 w-4 ${activeTab === 'profile' ? 'text-amber-400' : 'text-gray-500'}`} />
            <span>Profile & Fuel Management</span>
          </div>
          <div 
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${activeTab === 'account' ? 'bg-gray-800/50 text-amber-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'} transition-colors duration-150`}
          >
            <Lock className={`h-4 w-4 ${activeTab === 'account' ? 'text-amber-400' : 'text-gray-500'}`} />
            <span>Security</span>
          </div>
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-800/50">
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-300">Current Plan</span>
              <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-medium">{userData.tier}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                <Clock className="h-3 w-3 inline mr-1 text-gray-500" />
                30 days left
              </span>
              <span className="text-[10px] text-gray-500">Renews on Jul 15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 