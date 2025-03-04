'use client';

import React from 'react';

export const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-950/70 backdrop-blur-sm">
      <div className="bg-gray-900/70 rounded-lg p-8 border border-gray-800 shadow-2xl flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent mb-4"></div>
        <h3 className="text-lg font-medium text-amber-400">Loading your data...</h3>
        <p className="text-sm text-gray-400 mt-2">Please wait while we retrieve your information</p>
      </div>
    </div>
  );
}; 