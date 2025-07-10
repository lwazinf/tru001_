'use client';

import React, { useEffect, useMemo } from 'react';
import { User, Lock, Clock, LogOut } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (newTab: string) => void;
  userTier: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onTabChange,
  userTier,
}) => {
  const calculateRenewalInfo = useMemo(() => {
    try {
      if (!userData?.tierDate) {
        return {
          daysRemaining: 0,
          renewalDate: new Date(),
          isExpiringSoon: false,
          isExpired: true
        };
      }

      let tierDate: Date;

      // Handle Firestore Timestamp
      if (userData.tierDate && typeof userData.tierDate.toDate === 'function') {
        tierDate = userData.tierDate.toDate();
      } else if (userData.tierDate instanceof Date) {
        tierDate = userData.tierDate;
      } else {
        // Fallback for other date formats
        tierDate = new Date(userData.tierDate);
      }

      // Validate the date
      if (isNaN(tierDate.getTime())) {
        return {
          daysRemaining: 0,
          renewalDate: new Date(),
          isExpiringSoon: false,
          isExpired: true
        };
      }

      const now = new Date();
      const renewalDate = new Date(tierDate.getTime() + (30 * 24 * 60 * 60 * 1000));
      const timeDiff = renewalDate.getTime() - now.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

      const isExpired = daysRemaining <= 0;
      const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;

      const formatDate = (date: Date) => {
        try {
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        } catch {
          return 'Invalid Date';
        }
      };

      const result = {
        daysRemaining: Math.max(0, daysRemaining),
        renewalDate,
        renewalDateFormatted: formatDate(renewalDate),
        isExpiringSoon,
        isExpired
      };

      return result;
    } catch {
      return {
        daysRemaining: 0,
        renewalDate: new Date(),
        isExpiringSoon: false,
        isExpired: true
      };
    }
  }, [userData?.tierDate]);

  useEffect(() => {
    // Component rendered successfully
  }, [userData, calculateRenewalInfo]);
  
  return (
    <div className="hidden md:block w-64 border-r border-gray-800/70">
      {/* Sidebar buffer */}
      <div className="h-16 border-b border-gray-800/30"></div>
      
      <div className="px-4 py-6">
        <nav className="space-y-1">
          <div 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${activeTab === 'profile' ? 'bg-gray-800/50 text-amber-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'} transition-colors duration-150`}
          >
            <User className={`h-4 w-4 ${activeTab === 'profile' ? 'text-amber-400' : 'text-gray-500'}`} />
            <span>Profile & Fuel Management</span>
          </div>
          <div 
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${activeTab === 'account' ? 'bg-gray-800/50 text-amber-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'} transition-colors duration-150`}
          >
            <Lock className={`h-4 w-4 ${activeTab === 'account' ? 'text-amber-400' : 'text-gray-500'}`} />
            <span>Security</span>
          </div>
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-800/50">
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-300">Current Plan</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                userData.tier === 'Paused' || calculateRenewalInfo.isExpired
                  ? 'bg-red-500/20 text-red-400' 
                  : 'bg-amber-500/20 text-amber-400'
              }`}>{userData.tier}</span>
            </div>
            <div className="flex items-center justify-between">
              {userData.tier === 'Paused' || calculateRenewalInfo.isExpired ? (
                <span className="text-xs text-red-400">
                  <Clock className="h-3 w-3 inline mr-1 text-red-500" />
                  Subscription expired
                </span>
              ) : (
                <span className="text-xs text-gray-400">
                  <Clock className="h-3 w-3 inline mr-1 text-gray-500" />
                  {typeof calculateRenewalInfo.daysRemaining === 'number' ? `${calculateRenewalInfo.daysRemaining} days left` : calculateRenewalInfo.daysRemaining}
                </span>
              )}
              {userData.tier === 'Paused' || calculateRenewalInfo.isExpired ? (
                <span className="text-[10px] text-red-500">Renew now</span>
              ) : (
                <span className="text-[10px] text-gray-500">
                  {calculateRenewalInfo.renewalDateFormatted !== 'Invalid Date' ? `Renews on ${calculateRenewalInfo.renewalDateFormatted}` : calculateRenewalInfo.renewalDateFormatted}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div
          onClick={onSignOut}
          className="flex w-full items-center gap-2 mt-4 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors duration-150"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </div>
      </div>
    </div>
  );
}; 