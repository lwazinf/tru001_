'use client';

import React from 'react';
import { Car, AlertTriangle, Crown, Trash2, Droplets } from 'lucide-react';

// Enhanced Vehicle Type interface to match API data
interface VehicleType {
  name: string;
  type: string; // Number plate
  make_name?: string;
  model_name?: string;
  year?: number | string;
  fuel_tank_capacity?: Array<{value: string, unit: string}>;
}

interface VehicleGridProps {
  vehicles: VehicleType[];
  onAddVehicle: () => void;
  tier?: string;  // Add tier as an optional prop
  onDeleteVehicle?: (index: number) => void;
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({ vehicles, onAddVehicle, tier, onDeleteVehicle }) => {
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

  // Helper function to format fuel tank capacity
  // const formatFuelTankCapacity = (vehicle: VehicleType): string => {
  //   if (vehicle.fuel_tank_capacity && vehicle.fuel_tank_capacity.length > 0) {
  //     const capacity = vehicle.fuel_tank_capacity[0];
  //     return `${capacity.value} ${capacity.unit}`;
  //   }
  //   return 'N/A';
  // };

  // Extract just the numeric value of fuel capacity for display
  const getFuelCapacityValue = (vehicle: VehicleType): string => {
    if (vehicle.fuel_tank_capacity && vehicle.fuel_tank_capacity.length > 0) {
      return vehicle.fuel_tank_capacity[0].value;
    }
    return 'N/A';
  };

  // Extract just the unit of fuel capacity for display
  const getFuelCapacityUnit = (vehicle: VehicleType): string => {
    if (vehicle.fuel_tank_capacity && vehicle.fuel_tank_capacity.length > 0) {
      return vehicle.fuel_tank_capacity[0].unit;
    }
    return '';
  };

  // Helper function to extract make name
  const getMakeName = (vehicle: VehicleType): string => {
    if (vehicle.make_name) return vehicle.make_name;
    // Fallback: try to extract make from name
    return vehicle.name.split(' ')[0] || 'Unknown';
  };

  // Helper function to extract model name
  const getModelName = (vehicle: VehicleType): string => {
    if (vehicle.model_name) return vehicle.model_name;
    // Fallback: try to extract model from name
    const nameParts = vehicle.name.split(' ');
    return nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  };

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
            key={`vehicle-${index}`}
            className="bg-gray-900 rounded-md border border-gray-800 relative transition-all duration-200 hover:bg-gray-800/80"
          >
            {/* Delete button */}
            <div 
              onClick={() => onDeleteVehicle && onDeleteVehicle(index)}
              className="absolute top-2 right-2 bg-red-500/10 px-2 py-0.5 rounded text-red-400 cursor-pointer transition-colors duration-200 flex items-center gap-1 hover:bg-red-500/20"
              role="button"
              aria-label="Free vehicle slot"
            >
              <Trash2 className="h-3 w-3" />
              <span className="text-xs font-medium">Free slot</span>
            </div>
            
            <div className="p-3"> 
              {/* Make and Model */}
              <p className="text-sm text-gray-200 font-medium pt-6 mb-1">
                {getMakeName(vehicle)} {getModelName(vehicle)}
              </p>
              
              {/* Number Plate */}
              <p className="text-xs text-amber-400 font-medium uppercase mb-2">
                {vehicle.type || "Unknown"}
              </p>
              
              {/* Fuel Tank Capacity */}
              <div className="flex items-center gap-1 mt-1 text-xs">
                <Droplets className="h-3 w-3 text-blue-400" />
                <span className="text-blue-400">Tank:</span>
                <span className="text-gray-300">{getFuelCapacityValue(vehicle)}{getFuelCapacityUnit(vehicle)}</span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Show empty slots if any left */}
        {emptySlotArray.map((_, index) => (
          <div 
            key={`empty-${index}`}
            onClick={onAddVehicle}
            className="rounded-md border-2 border-dashed border-gray-700 p-4 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 transition-colors duration-200"
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