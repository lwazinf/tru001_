'use client';

import React from 'react';
import { Car, X } from 'lucide-react';

interface AddVehicleModalProps {
  newVehicle: {
    name: string;
    type: string;
  };
  handleVehicleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onAdd: () => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  newVehicle,
  handleVehicleChange,
  onClose,
  onAdd
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="absolute inset-0 bg-gray-950/90 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800 w-full max-w-md mx-4 shadow-2xl shadow-black/40 transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-10">
        <div
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer"
        >
          <X className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded-full bg-amber-600/10">
              <Car className="h-4 w-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-200">Add New Vehicle</h3>
          </div>
          <p className="text-xs text-gray-400">
            Add details about your vehicle to help us provide better fuel management services.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 flex items-center gap-1">
              <Car className="h-3 w-3 text-gray-400" />
              Vehicle Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors"
              placeholder="e.g., My BMW, Family Car"
              value={newVehicle.name}
              onChange={handleVehicleChange}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 flex items-center gap-1">
              <Car className="h-3 w-3 text-gray-400" />
              Vehicle Type
            </label>
            <input
              type="text"
              name="type"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors"
              placeholder="e.g., Sedan, SUV, Truck"
              value={newVehicle.type}
              onChange={handleVehicleChange}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <div
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-md text-xs font-medium text-gray-300 transition-colors duration-150 cursor-pointer"
            >
              Cancel
            </div>
            <div
              onClick={onAdd}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-gray-900 rounded-md text-xs font-bold transition-colors duration-150 cursor-pointer shadow-lg shadow-amber-900/20"
            >
              Add Vehicle
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 