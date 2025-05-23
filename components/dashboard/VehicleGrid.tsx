'use client';

import React, { useState } from 'react';
import { Car, AlertTriangle, Crown, Trash2, Droplets, Gauge, Save } from 'lucide-react';

// Enhanced Vehicle Type interface to match API data
export interface VehicleType {
  name: string;
  type: string; // Number plate
  make_name?: string;
  model_name?: string;
  year?: number | string;
  fuel_tank_capacity?: Array<{value: string, unit: string}>;
  image?: string;
  // Add slot details properties
  slot?: {
    id: string;
    name: string;
    status: string;
    lastUpdated?: string;
  };
  // Flag for unsaved vehicles
  isUnsaved?: boolean;
}

interface VehicleGridProps {
  vehicles: VehicleType[];
  onAddVehicle: () => void;
  tier?: string;  // Add tier as an optional prop
  onDeleteVehicle?: (index: number) => void;
  onVehicleSelect?: (index: number) => void; // Add callback for vehicle selection
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({ vehicles, onAddVehicle, tier, onDeleteVehicle, onVehicleSelect }) => {
  // State to track selected vehicle
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState<number | null>(null);
  
  // Set max slots based on tier
  let maxSlots = 1; // Basic tier
  if (tier === 'Gold' || tier === 'gold') {
    maxSlots = 2;
  } else if (tier === 'Black' || tier === 'black') {
    maxSlots = 4;
  }

  // Calculate empty slots
  const emptySlots = Math.max(0, maxSlots - vehicles.length);
  
  // Should we show the add button?
  const showAddButton = emptySlots > 0;
  
  // Create an array for empty slots
  const emptySlotArray = Array(emptySlots).fill(null);

  // Extract just the numeric value of fuel capacity for display
  const getFuelCapacityValue = (vehicle: VehicleType): string => {
    if (vehicle.fuel_tank_capacity && vehicle.fuel_tank_capacity.length > 0) {
      const capacity = vehicle.fuel_tank_capacity[0];
      return `${capacity.value} ${capacity.unit}`;
    }
    return 'N/A';
  };

  // Helper function to extract make name
  const getMakeName = (vehicle: VehicleType): string => {
    if (vehicle.make_name) return vehicle.make_name;
    
    // Fall back to first part of name
    const parts = vehicle.name.split(' ');
    return parts[0] || 'Unknown';
  };

  // Helper function to extract model name
  const getModelName = (vehicle: VehicleType): string => {
    if (vehicle.model_name) return vehicle.model_name;
    
    // Fall back to remaining parts of name
    const parts = vehicle.name.split(' ');
    return parts.slice(1).join(' ') || 'Unknown';
  };

  // Helper function to handle vehicle selection
  const handleVehicleSelect = (index: number) => {
    const newSelectedIndex = index === selectedVehicleIndex ? null : index;
    setSelectedVehicleIndex(newSelectedIndex);
    
    // Call the parent component's callback if provided
    if (onVehicleSelect) {
      if (newSelectedIndex !== null) {
        onVehicleSelect(newSelectedIndex);
      }
    }
  };

  // Check if we have any unsaved vehicles
  const hasUnsavedVehicles = vehicles.some(vehicle => vehicle.isUnsaved);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs text-gray-300 flex items-center gap-1">
          <Car className="h-3 w-3 text-gray-400" />
          Vehicles
        </label>
        <div className="flex items-center gap-2">
          {hasUnsavedVehicles && (
            <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Save className="h-3 w-3" /> Unsaved changes
            </span>
          )}
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
            {vehicles.length}/{maxSlots} slots used
          </span>
        </div>
      </div>
      
      {/* Always use a 2-column grid for layout consistency */}
      <div className="grid grid-cols-2 gap-3">
        {/* Show existing vehicles */}
        {vehicles.slice(0, maxSlots).map((vehicle, index) => (
          <div 
            key={`vehicle-${index}`}
            className={`bg-gray-900 rounded-md border ${
              vehicle.isUnsaved 
                ? 'border-amber-500 bg-gradient-to-r from-amber-500/10 to-amber-400/5' 
                : selectedVehicleIndex === index 
                  ? 'border-amber-500' 
                  : 'border-gray-800'
            } relative transition-all duration-200 hover:bg-gray-800/80 cursor-pointer`}
            onClick={() => handleVehicleSelect(index)}
          >
            {/* Unsaved badge */}
            {vehicle.isUnsaved && (
              <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-medium py-0.5 px-1.5 rounded-bl-md">
                Unsaved
              </div>
            )}
            
            {/* Delete button */}
            <div 
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering vehicle selection
                if (onDeleteVehicle) {
                  onDeleteVehicle(index);
                }
              }}
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
                <span className="text-gray-300">{getFuelCapacityValue(vehicle)}</span>
              </div>
              
              {/* Slot Details - shown when vehicle is selected and has slot data */}
              {selectedVehicleIndex === index && vehicle.slot && (
                <div className="mt-3 pt-2 border-t border-gray-800">
                  <h4 className="text-xs font-medium text-amber-400 mb-1">Slot Details</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-xs">
                      <Gauge className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-400">ID:</span>
                      <span className="text-gray-300">{vehicle.slot.id}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-gray-300">{vehicle.slot.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-gray-400">Status:</span>
                      <span className={`${vehicle.slot.status === 'Active' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {vehicle.slot.status}
                      </span>
                    </div>
                    {vehicle.slot.lastUpdated && (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-gray-400">Last Updated:</span>
                        <span className="text-gray-300">{vehicle.slot.lastUpdated}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Unsaved indicator if needed */}
              {vehicle.isUnsaved && (
                <div className="mt-3 pt-2 border-t border-gray-800">
                  <div className="text-xs text-amber-400 flex items-center gap-1.5">
                    <Save className="h-3 w-3" />
                    <span>Click &quot;Save changes&quot; when done</span>
                  </div>
                </div>
              )}
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