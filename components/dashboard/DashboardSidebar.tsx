'use client';

import React, { useEffect } from 'react';
import { User, Lock, Clock, LogOut } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userData: {
    tier: string;
    tierDate: Timestamp | null;
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
    // Handle case when tierDate is missing or null
    if (!userData.tierDate) {
      console.log('Missing tierDate:', userData.tierDate);
      return { 
        daysLeft: '–', // Em dash instead of a number
        renewalDate: 'Not available',
        isExpired: false 
      };
    }
    
    try {
      // Convert Firestore Timestamp to JavaScript Date
      let tierDate: Date;
      
      // Check if tierDate is a Firestore Timestamp
      if (userData.tierDate instanceof Timestamp) {
        // Convert to JavaScript Date
        tierDate = userData.tierDate.toDate();
        console.log('Converted Firestore Timestamp to Date:', tierDate.toString());
      } else {
        // Fallback for other formats
        console.log('tierDate is not a Firestore Timestamp:', userData.tierDate);
        try {
          // Try to handle it as a number or string
          tierDate = new Date(userData.tierDate as any);
        } catch (error) {
          console.error('Error converting tierDate to Date:', error);
          return { 
            daysLeft: '–', 
            renewalDate: 'Not available',
            isExpired: false 
          };
        }
      }
      
      // Validate that tierDate is a valid date
      if (isNaN(tierDate.getTime())) {
        console.log('Invalid date object created from tierDate:', userData.tierDate);
        return { 
          daysLeft: '–', 
          renewalDate: 'Not available',
          isExpired: false 
        };
      }
      
      const renewalDate = new Date(tierDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // Add 30 days
      const now = new Date();
      
      // Calculate days left
      const daysLeft = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const isExpired = daysLeft <= 0;
      
      // Format renewal date with error handling
      let formattedDate;
      try {
        formattedDate = renewalDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      } catch (error) {
        console.error('Error formatting date:', error);
        formattedDate = 'Not available';
      }
      
      // Log success for debugging
      console.log('Successfully calculated renewal info:', { 
        tierDate: tierDate.toString(),
        renewalDate: renewalDate.toString(),
        daysLeft,
        formattedDate,
        isExpired
      });
      
      return {
        daysLeft: Math.max(0, daysLeft), // Ensure we don't show negative days
        renewalDate: formattedDate,
        isExpired
      };
    } catch (error) {
      console.error('Error in calculateRenewalInfo:', error);
      return { 
        daysLeft: '–', 
        renewalDate: 'Not available',
        isExpired: false 
      };
    }
  };

  const { daysLeft, renewalDate, isExpired } = calculateRenewalInfo();
  
  // Log for debugging
  useEffect(() => {
    console.log('Sidebar rendered with:', { 
      activeTab, 
      tier: userData.tier, 
      daysLeft, 
      renewalDate, 
      isExpired 
    });
  }, [activeTab, userData.tier, daysLeft, renewalDate, isExpired]);

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
                userData.tier === 'Paused' || isExpired
                  ? 'bg-red-500/20 text-red-400' 
                  : 'bg-amber-500/20 text-amber-400'
              }`}>{userData.tier}</span>
            </div>
            <div className="flex items-center justify-between">
              {userData.tier === 'Paused' || isExpired ? (
                <span className="text-xs text-red-400">
                  <Clock className="h-3 w-3 inline mr-1 text-red-500" />
                  Subscription expired
                </span>
              ) : (
                <span className="text-xs text-gray-400">
                  <Clock className="h-3 w-3 inline mr-1 text-gray-500" />
                  {typeof daysLeft === 'number' ? `${daysLeft} days left` : daysLeft}
                </span>
              )}
              {userData.tier === 'Paused' || isExpired ? (
                <span className="text-[10px] text-red-500">Renew now</span>
              ) : (
                <span className="text-[10px] text-gray-500">
                  {renewalDate !== 'Not available' ? `Renews on ${renewalDate}` : renewalDate}
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