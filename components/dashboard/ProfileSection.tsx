'use client';

import React, { ReactNode } from 'react';
import { User, Phone, MapPin, Search } from 'lucide-react';
import { MapComponent } from './MapComponent';

interface ProfileSectionProps {
  userData: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
  };
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  address: string;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAddressLoading: boolean;
  isBrowser: boolean;
  mapPosition: [number, number];
  mapZoom: number;
  children: ReactNode;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  userData,
  handleNameChange,
  address,
  handleAddressChange,
  isAddressLoading,
  isBrowser,
  mapPosition,
  mapZoom,
  children
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-amber-400/10">
          <User className="h-4 w-4 text-amber-400" />
        </div>
        <h2 className="text-sm font-semibold text-white border-b border-gray-800/70 pb-2 flex-1">Profile & Fuel Management</h2>
      </div>
      
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-5 border border-gray-800 shadow-lg shadow-black/5">
        <h3 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
          <div className="p-1 rounded-full bg-gray-800/50">
            <User className="h-3.5 w-3.5 text-amber-400" />
          </div>
          Profile Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 flex items-center gap-1">
                <User className="h-3 w-3 text-gray-400" />
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors"
                placeholder="Your First Name"
                value={userData.firstName}
                onChange={handleNameChange}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 flex items-center gap-1">
                <User className="h-3 w-3 text-gray-400" />
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors"
                placeholder="Your Last Name"
                value={userData.lastName}
                onChange={handleNameChange}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 flex items-center gap-1">
                <Phone className="h-3 w-3 text-gray-400" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors"
                placeholder="Your Phone Number"
                value={userData.phone}
                onChange={handleNameChange}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-gray-400" />
                Delivery Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="location-input"
                  name="address"
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors"
                  placeholder="Your Address"
                  value={address}
                  onChange={handleAddressChange}
                  disabled={isAddressLoading}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                {isAddressLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-400 border-t-transparent"></div>
                  </div>
                )}
              </div>
              
              {/* Map */}
              <div className="mt-3 h-48 relative rounded-md overflow-hidden border border-gray-700 shadow-inner shadow-black/20">
                
                <div className={`w-full h-full flex flex-col justify-center items-center absolute z-[5]`}>
                {isBrowser && (
                  <MapComponent position={mapPosition} zoom={mapZoom} address={address} />
                  
                )}
                </div>
                <div className={`w-full h-full flex flex-col justify-center items-center absolute z-[10]`}>
                <img className={`w-full h-full object-cover`} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXah6EUKSD7zSWdEPlQoHKsjwbgBTDJ752vg&s'/>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {/* Children components will be rendered here - Vehicles and Fuel Tanks */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}; 