'use client';

import React from 'react';
import { Car } from 'lucide-react';

interface VehicleType {
  name: string;
  type: string;
}

interface VehicleGridProps {
  vehicles: VehicleType[];
  onAddVehicle: () => void;
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({ vehicles, onAddVehicle }) => {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-gray-300 flex items-center gap-1">
        <Car className="h-3 w-3 text-gray-400" />
        Vehicles
      </label>
      {vehicles.length === 0 ? (
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={onAddVehicle}
            className="rounded-md border-2 border-dashed border-gray-700 p-4 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 transition-colors"
          >
            <Car className="h-6 w-6 text-gray-400 mb-2" />
            <span className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
              + Add Vehicle
            </span>
          </div>
          <div 
            onClick={onAddVehicle}
            className="rounded-md border-2 border-dashed border-gray-700 p-4 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 transition-colors"
          >
            <Car className="h-6 w-6 text-gray-400 mb-2" />
            <span className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
              + Add Vehicle
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {vehicles.map((vehicle, index) => (
            <div key={index} className="bg-gray-800/30 rounded-md p-3 border border-gray-700/50">
              <p className="text-xs text-gray-200">{vehicle.name || "Unnamed Vehicle"}</p>
              <p className="text-[10px] text-gray-400">{vehicle.type || "Unknown"}</p>
            </div>
          ))}
          <div 
            onClick={onAddVehicle}
            className="rounded-md border-2 border-dashed border-gray-700 p-4 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 transition-colors"
          >
            <Car className="h-6 w-6 text-gray-400 mb-2" />
            <span className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
              + Add Vehicle
            </span>
          </div>
        </div>
      )}
    </div>
  );
}; 