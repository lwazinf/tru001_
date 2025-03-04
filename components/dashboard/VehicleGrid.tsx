'use client';

import React from 'react';
import { Car, AlertTriangle, Crown } from 'lucide-react';

interface VehicleType {
  name: string;
  type: string;
}

interface VehicleGridProps {
  vehicles: VehicleType[];
  onAddVehicle: () => void;
  tier?: string;  // Add tier as an optional prop
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({ vehicles, onAddVehicle, tier }) => {
  // Determine max slots based on tier
  const getMaxSlots = () => {
    if (tier === 'Black' || tier === 'black') {
      return 4; // Black tier gets 4 slots (2×2 grid)
    } else if (tier === 'Gold' || tier === 'gold') {
      return 2; // Gold tier gets 2 slots (2×1 grid)
    } else {
      return 1; // Default/new tier gets 1 slot
    }
  };

  const maxSlots = getMaxSlots();
  
  // Calculate how many empty slots to show
  const filledSlots = vehicles.length;
  const emptySlots = Math.max(0, maxSlots - filledSlots);
  const showAddButton = emptySlots > 0;
  
  // Create array of empty slots
  const emptySlotArray = Array(emptySlots).fill(null);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs text-gray-300 flex items-center gap-1">
          <Car className="h-3 w-3 text-gray-400" />
          Vehicles
        </label>
        <div className="flex items-center gap-2">
          {tier === 'Black' || tier === 'black' ? (
            <span className="text-xs bg-gray-800 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="h-3 w-3 text-amber-500" /> Black
            </span>
          ) : tier === 'Gold' || tier === 'gold' ? (
            <span className="text-xs bg-gray-800 text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="h-3 w-3 text-amber-500" /> Gold
            </span>
          ) : null}
          <span className="text-xs text-amber-400/80">
            {filledSlots}/{maxSlots} slots
          </span>
        </div>
      </div>
      
      {/* Always use a 2-column grid for layout consistency */}
      <div className="grid grid-cols-2 gap-3">
        {/* Show existing vehicles */}
        {vehicles.slice(0, maxSlots).map((vehicle, index) => (
          <div 
            key={index} 
            className="bg-gray-800/30 rounded-md p-3 border border-gray-700/50"
          >
            <p className="text-xs text-gray-200">{vehicle.name || "Unnamed Vehicle"}</p>
            <p className="text-[10px] text-gray-400">{vehicle.type || "Unknown"}</p>
          </div>
        ))}
        
        {/* Show empty slots if any left */}
        {emptySlotArray.map((_, index) => (
          <div 
            key={`empty-${index}`}
            onClick={onAddVehicle}
            className="rounded-md border-2 border-dashed border-gray-700 p-4 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 transition-colors"
          >
            <Car className="h-6 w-6 text-gray-400 mb-2" />
            <span className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
              + Add Vehicle
            </span>
          </div>
        ))}
      </div>
      
      {/* Tier information */}
      {!showAddButton && tier !== 'Black' && tier !== 'black' && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400/80 bg-amber-400/10 p-2 rounded-md border border-amber-400/20">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>
            {tier === 'Gold' || tier === 'gold' 
              ? "You've reached the maximum of 2 vehicles for Gold tier. Upgrade to Black tier for 4 vehicle slots."
              : "You've reached the maximum vehicles for your tier. Upgrade to Gold for 2 slots or Black for 4 slots."}
          </span>
        </div>
      )}
    </div>
  );
}; 