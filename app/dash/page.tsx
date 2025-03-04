'use client';

import React, { useEffect, useState } from 'react';
import { MoreVertical, Search, X } from 'lucide-react';
import Script from 'next/script';

// Google Maps types
declare global {
  interface Window {
    google: typeof google;
  }
}

export default function DashPage() {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Initialize Google Places Autocomplete
  const initAutocomplete = () => {
    if (!window.google) return;
    
    const input = document.getElementById('location-input') as HTMLInputElement;
    const options: google.maps.places.AutocompleteOptions = {
      componentRestrictions: { country: 'za' }, // Restrict to South Africa
      types: ['address']
    };
    
    const autoComplete = new window.google.maps.places.Autocomplete(input, options);
    
    autoComplete.addListener('place_changed', () => {
      const place = autoComplete.getPlace();
      if (place.formatted_address) {
        setSelectedPlace(place.formatted_address);
      }
    });
    
    setAutocomplete(autoComplete);
  };

  useEffect(() => {
    // Initialize after Google Maps script is loaded
    if (window.google) {
      initAutocomplete();
    }

    // Add custom styles for the autocomplete dropdown
    const style = document.createElement('style');
    style.textContent = `
      .pac-container {
        background-color: rgba(17, 24, 39, 0.95);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(55, 65, 81, 0.5);
        border-radius: 0.375rem;
        margin-top: 4px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        padding: 0.5rem;
        font-family: inherit;
      }
      .pac-container:after {
        display: none !important;
        content: none !important;
      }
      .pac-item {
        padding: 0.5rem;
        color: rgb(209, 213, 219);
        font-size: 0.875rem;
        border-top: 1px solid rgba(55, 65, 81, 0.2);
        cursor: pointer;
        margin: 0;
      }
      .pac-item:first-child {
        border-top: none;
      }
      .pac-item:hover {
        background-color: rgba(55, 65, 81, 0.5);
        color: white;
      }
      .pac-item-query {
        color: rgb(251, 191, 36);
        font-size: 0.875rem;
      }
      .pac-matched {
        color: rgb(251, 191, 36);
      }
      .pac-icon {
        display: none;
      }
      .hdpi.pac-logo:after {
        display: none !important;
        content: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={initAutocomplete}
      />
      <div className="flex min-h-screen bg-gray-950 text-gray-100">
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto py-4 px-4">
            <header className="mb-4 flex justify-between items-center">
              <h1 className="text-xl font-semibold text-white">Account Dashboard</h1>
              <div className="p-1.5 rounded-full hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer">
                <MoreVertical className="text-gray-400 h-4 w-4" />
              </div>
            </header>
            
            {/* All sections in a column with dividers */}
            <div className="space-y-6">
              {/* Profile & Billing Section */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-amber-400 border-b border-gray-800/70 pb-2">Profile & Billing</h2>
                
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-200 mb-3">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300">Name</label>
                        <input
                          type="text"
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-200"
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300">Vehicles</label>
                        <select className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-200">
                          <option>Select Vehicle</option>
                          <option>Vehicle 1</option>
                          <option>Vehicle 2</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300">Location</label>
                        <div className="relative">
                          <input
                            id="location-input"
                            type="text"
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-md pl-9 pr-3 py-1.5 text-sm text-gray-200 placeholder-gray-400 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors duration-150"
                            placeholder="Enter your address"
                            value={selectedPlace}
                            onChange={(e) => setSelectedPlace(e.target.value)}
                          />
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                        <h3 className="text-xs text-gray-200 mb-2">Current Tier</h3>
                        <p className="text-xs text-gray-300">Premium Plan</p>
                        <p className="text-xs text-gray-300 mt-1">Days until expiration: <span className="text-amber-400">30 days</span></p>
                        <div className="mt-2 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 rounded-md transition text-xs cursor-pointer inline-block">
                          Upgrade Tier
                        </div>
                      </div>
                      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                        <h3 className="text-xs text-gray-200 mb-2">Payment for Next Month</h3>
                        <div className="mt-2 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 rounded-md transition text-xs cursor-pointer inline-block">
                          Manage Payment
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-800/70"></div>

              {/* Account Section */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-amber-400 border-b border-gray-800/70 pb-2">Account</h2>
                
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-200 mb-3">Details & Security</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300">Email</label>
                        <input
                          type="email"
                          className="w-full bg-gray-800/30 border border-gray-700/50 rounded-md px-3 py-1.5 text-sm text-gray-400 cursor-not-allowed"
                          value="qgwe@kjhd.com"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Contact support to change your email address</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300">Password</label>
                        <input
                          type="password"
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-200"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300">Confirm Password</label>
                        <input
                          type="password"
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-200"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                  <h3 className="text-sm font-semibold text-red-400 mb-2">Delete Data & Account</h3>
                  <p className="text-xs text-gray-400 mb-3">This action cannot be undone. All your data will be permanently removed.</p>
                  <div 
                    onClick={() => setShowDeleteModal(true)}
                    className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded-md transition text-xs cursor-pointer inline-block">
                    Delete Account
                  </div>
                </div>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div 
                  className="absolute inset-0 bg-gray-950/90 backdrop-blur-sm transition-opacity duration-200"
                  onClick={() => setShowDeleteModal(false)}
                />
                <div className="relative bg-gray-900/90 backdrop-blur-md rounded-lg border border-gray-800/50 p-6 w-full max-w-md mx-4 shadow-2xl shadow-red-900/20 transform transition-all duration-200">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-800/50 transition-colors duration-150 group"
                  >
                    <X className="h-4 w-4 text-gray-400 group-hover:text-gray-200" />
                  </button>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-2">Delete Account</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently removed from our servers.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-red-800/30 rounded-md p-4 border border-red-500/10">
                      <input
                        type="text"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors duration-150"
                        placeholder="Type 'delete' to confirm"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Please type <span className="text-red-400 font-mono">'delete'</span> to confirm the action
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3 pt-2">
                      <div
                        onClick={() => setShowDeleteModal(false)}
                        className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-all duration-150"
                      >
                        Cancel
                      </div>
                      <div
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-md transition-all duration-150 text-sm font-medium border border-red-500/20 hover:border-red-500/30"
                      >
                        Delete Account
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer with actions */}
            <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-800/70">
              <div className="px-3 py-1.5 border border-gray-700 rounded-md text-xs font-medium text-gray-300 hover:bg-gray-800/70 transition-all duration-150 cursor-pointer">
                Cancel
              </div>
              <div className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 rounded-md text-xs font-medium text-black hover:from-amber-400 hover:to-amber-500 transition-all duration-200 shadow-lg shadow-amber-900/10 cursor-pointer">
                Save changes
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 