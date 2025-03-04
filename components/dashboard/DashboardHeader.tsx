'use client';

import React from 'react';
import { Bell, Settings } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  return (
    <header className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-500">Account Dashboard</h1>
        <p className="text-xs text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute -top-1 -right-1 h-2 w-2 bg-amber-400 rounded-full"></div>
          <div className="p-2 rounded-full hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer">
            <Bell className="text-gray-400 h-4 w-4" />
          </div>
        </div>
        <div className="p-2 rounded-full hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer">
          <Settings className="text-gray-400 h-4 w-4" />
        </div>
      </div>
    </header>
  );
}; 