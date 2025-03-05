'use client';

import React from 'react';
import { User, Lock, Clock, LogOut } from 'lucide-react';

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userData: {
    tier: string;
    tierDate: number | null;
  };
  onSignOut: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  setActiveTab,
  userData,
  onSignOut
}) => {
  // Calculate days left and renewal date
  const calculateRenewalInfo = () => {
    if (!userData.tierDate) return { daysLeft: 30, renewalDate: 'Not set' };
    
    const tierDate = new Date(userData.tierDate);
    const renewalDate = new Date(tierDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // Add 30 days
    const now = new Date();
    
    // Calculate days left
    const daysLeft = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Format renewal date
    const formattedDate = renewalDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    return {
      daysLeft: Math.max(0, daysLeft), // Ensure we don't show negative days
      renewalDate: formattedDate
    };
  };

  const { daysLeft, renewalDate } = calculateRenewalInfo();

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
                {daysLeft} days left
              </span>
              <span className="text-[10px] text-gray-500">Renews on {renewalDate}</span>
            </div>
          </div>
        </div>
        
        <div
          onClick={onSignOut}
          className="flex cursor-pointer items-center gap-2 w-full mt-4 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors duration-150"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </div>
      </div>
    </div>
  );
}; 