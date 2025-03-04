'use client';

import React from 'react';
import { Fuel } from 'lucide-react';

interface FuelTanksProps {
  tanks: {
    diesel: number;
    petrol: {
      '93': number;
      '95': number;
    };
  };
  tier: string;
}

export const FuelTanksStatus: React.FC<FuelTanksProps> = ({ tanks, tier }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/40 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50 shadow-inner shadow-black/10">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
          <Fuel className="h-3 w-3 text-amber-400" />
          Fuel Tanks Status
        </h3>
        <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-medium">{tier}</span>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-gray-400">Diesel</span>
            <span className="text-amber-400">{tanks.diesel}L</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((tanks.diesel / 100) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-gray-400">Petrol 93</span>
            <span className="text-amber-400">{tanks.petrol['93']}L</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((tanks.petrol['93'] / 100) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-gray-400">Petrol 95</span>
            <span className="text-amber-400">{tanks.petrol['95']}L</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((tanks.petrol['95'] / 100) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}; 