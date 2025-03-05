'use client';

import React from 'react';
import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  onSignOut: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onSignOut }) => {
  return (
    <header className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-500">Account Dashboard</h1>
        <p className="text-xs text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>
      
      <button
        onClick={onSignOut}
        className="md:hidden p-2 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors duration-150"
        aria-label="Sign out"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </header>
  );
}; 