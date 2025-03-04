'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MoreVertical, Search, X, AlertTriangle, User, CreditCard, Mail, Lock, MapPin, Car, ChevronRight, CheckCircle2, Bell, Settings, Menu, ArrowRight, Shield, Calendar, Clock } from 'lucide-react';
import Script from 'next/script';

// Google Maps types
declare global {
  interface Window {
    google: typeof google;
  }
}

export default function DashPage() {
  // State variables
  const [selectedPlace, setSelectedPlace] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

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
    
    autocompleteRef.current = autoComplete;
  };

  // Handle save changes
  const handleSave = () => {
    setSuccessMessage('Changes saved successfully!');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
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
      <div className="flex min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100">
        {/* Sidebar */}
        <div className="hidden md:block w-64 border-r border-gray-800/70 py-6 px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 rounded-md bg-amber-500 flex items-center justify-center">
              <span className="font-bold text-gray-900">NTF</span>
            </div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
          </div>
          
          <nav className="space-y-1">
            <div 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${activeTab === 'profile' ? 'bg-gray-800/50 text-amber-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'} transition-colors duration-150`}
            >
              <User className={`h-4 w-4 ${activeTab === 'profile' ? 'text-amber-400' : 'text-gray-500'}`} />
              <span>Profile & Billing</span>
            </div>
            <div 
              onClick={() => setActiveTab('account')}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${activeTab === 'account' ? 'bg-gray-800/50 text-amber-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'} transition-colors duration-150`}
            >
              <Lock className={`h-4 w-4 ${activeTab === 'account' ? 'text-amber-400' : 'text-gray-500'}`} />
              <span>Security</span>
            </div>
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-800/50">
            <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-300">Current Plan</span>
                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-medium">Premium</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  <Clock className="h-3 w-3 inline mr-1 text-gray-500" />
                  30 days left
                </span>
                <span className="text-[10px] text-gray-500">Renews on Jul 15</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="fixed top-4 left-4 z-40 md:hidden">
          <div className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-md border border-gray-700/30 shadow-lg">
            <Menu className="h-5 w-5 text-gray-300" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
            {/* Header with better styling */}
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-500">Account Dashboard</h1>
                <p className="text-xs text-gray-400 mt-1">Manage your account settings and preferences</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-amber-400 rounded-full"></div>
                  <div className="p-2 rounded-full hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer">
                    <Bell className="text-gray-400 h-4 w-4" />
                  </div>
                </div>
                <div className="p-2 rounded-full hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer">
                  <Settings className="text-gray-400 h-4 w-4" />
                </div>
              </div>
            </header>
            
            {/* Success Toast */}
            {showSuccessToast && (
              <div className="fixed top-4 right-4 bg-green-900/80 backdrop-blur-sm border border-green-500/20 rounded-lg px-4 py-3 shadow-lg shadow-green-900/20 transition-all duration-300 flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-5">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <p className="text-sm text-green-200">{successMessage}</p>
              </div>
            )}
            
            {/* Status Bar */}
            <div className="mb-6 flex items-center p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
              <div className="flex-1 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                <span className="text-xs text-gray-300">Account Status:</span>
                <span className="text-xs font-medium text-white">Active</span>
              </div>
              <div className="text-xs text-gray-400">
                <Clock className="h-3 w-3 inline mr-1" />
                Last updated: Today
              </div>
            </div>
            
            {/* Tab navigation for mobile */}
            <div className="flex mb-6 md:hidden">
              <div 
                onClick={() => setActiveTab('profile')}
                className={`flex-1 text-center py-2 text-xs font-medium border-b-2 ${activeTab === 'profile' ? 'border-amber-400 text-amber-400' : 'border-gray-800 text-gray-400'}`}
              >
                Profile & Billing
              </div>
              <div 
                onClick={() => setActiveTab('account')}
                className={`flex-1 text-center py-2 text-xs font-medium border-b-2 ${activeTab === 'account' ? 'border-amber-400 text-amber-400' : 'border-gray-800 text-gray-400'}`}
              >
                Security
              </div>
            </div>
            
            {/* All sections in a column with dividers */}
            <div className="space-y-8">
              {/* Profile & Billing Section */}
              {(activeTab === 'profile' || activeTab === 'all') && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-amber-400/10">
                      <User className="h-4 w-4 text-amber-400" />
                    </div>
                    <h2 className="text-sm font-semibold text-white border-b border-gray-800/70 pb-2 flex-1">Profile & Billing</h2>
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
                            Name
                          </label>
                          <input
                            type="text"
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors"
                            placeholder="Your Name"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-300 flex items-center gap-1">
                            <Car className="h-3 w-3 text-gray-400" />
                            Vehicles
                          </label>
                          <select className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors">
                            <option>Select Vehicle</option>
                            <option>Vehicle 1</option>
                            <option>Vehicle 2</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-300 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            Location
                          </label>
                          <div className="relative">
                            <input
                              id="location-input"
                              type="text"
                              className="w-full bg-gray-800/50 border border-gray-700 rounded-md pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-400 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors"
                              placeholder="Enter your address"
                              value={selectedPlace}
                              onChange={(e) => setSelectedPlace(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/40 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50 shadow-inner shadow-black/10">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
                              <CreditCard className="h-3 w-3 text-amber-400" />
                              Current Tier
                            </h3>
                            <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-medium">Premium</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-amber-400">Premium Plan</p>
                              <p className="text-xs text-gray-400 mt-1">Expires in <span className="text-amber-400 font-medium">30 days</span></p>
                            </div>
                            <div className="rounded-full bg-amber-400/10 p-1">
                              <CheckCircle2 className="h-4 w-4 text-amber-400" />
                            </div>
                          </div>
                          <div className="mt-3 border-t border-gray-800/50 pt-3">
                            <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                              <Calendar className="h-3 w-3" />
                              <span>Next billing: July 15, 2023</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 rounded-md transition-colors duration-150 text-xs font-medium cursor-pointer inline-flex items-center gap-1 border border-amber-500/10">
                                Upgrade Tier
                                <ChevronRight className="h-3 w-3" />
                              </div>
                              <a href="#" className="text-xs text-amber-400/80 hover:text-amber-400 transition-colors">View plans</a>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/40 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50 shadow-inner shadow-black/10">
                          <h3 className="text-xs font-semibold text-gray-200 mb-3 flex items-center gap-1.5">
                            <CreditCard className="h-3 w-3 text-gray-400" />
                            Payment Methods
                          </h3>
                          <div className="flex items-center gap-3 py-2 border-b border-gray-800/30">
                            <div className="p-1 bg-gray-800 rounded">
                              <CreditCard className="h-3 w-3 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-300">•••• 4242</div>
                              <div className="text-[10px] text-gray-500">Expires 12/25</div>
                            </div>
                            <div className="text-[10px] px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded">Default</div>
                          </div>
                          <div className="mt-3 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 rounded-md transition-colors duration-150 text-xs font-medium cursor-pointer inline-flex items-center gap-1 border border-amber-500/10">
                            Manage Payment Methods
                            <ChevronRight className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Divider with improved spacing */}
              {(activeTab === 'all') && (
                <div className="border-t border-gray-800/70 pt-2"></div>
              )}

              {/* Account Section */}
              {(activeTab === 'account' || activeTab === 'all') && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-amber-400/10">
                      <Lock className="h-4 w-4 text-amber-400" />
                    </div>
                    <h2 className="text-sm font-semibold text-white border-b border-gray-800/70 pb-2 flex-1">Account Security</h2>
                  </div>
                  
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-5 border border-gray-800 shadow-lg shadow-black/5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                        <div className="p-1 rounded-full bg-gray-800/50">
                          <Lock className="h-3.5 w-3.5 text-amber-400" />
                        </div>
                        Details & Security
                      </h3>
                      <span className="text-xs px-2 py-1 bg-green-900/30 border border-green-500/20 rounded-full text-green-400 flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Secured
                      </span>
                    </div>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-300 flex items-center gap-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            Email
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              className="w-full bg-gray-800/30 border border-gray-700/50 rounded-md px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                              value="qgwe@kjhd.com"
                              disabled
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded-full">Verified</div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1.5 italic flex items-center gap-1">
                            <Mail className="h-3 w-3 inline" />
                            Contact support to change your email address
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-300 flex items-center gap-1">
                            <Lock className="h-3 w-3 text-gray-400" />
                            Password
                          </label>
                          <input
                            type="password"
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors"
                            placeholder="••••••••"
                          />
                          <div className="w-full h-1.5 mt-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-gradient-to-r from-amber-500 to-amber-400"></div>
                          </div>
                          <p className="text-[10px] text-gray-500">Password strength: Good</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-300 flex items-center gap-1">
                          <Lock className="h-3 w-3 text-gray-400" />
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors"
                          placeholder="••••••••"
                        />
                      </div>
                      
                      <div className="pt-3 mt-1 border-t border-gray-800/50">
                        <h4 className="text-xs font-medium text-gray-300 mb-2">Account Protection</h4>
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-800/30 rounded-md border border-gray-700/30">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-amber-400" />
                            <span className="text-xs text-gray-300">Two-factor authentication</span>
                          </div>
                          <div className="px-2 py-1 bg-amber-600/20 text-amber-400 text-xs font-medium rounded cursor-pointer hover:bg-amber-600/30 transition-colors">Enable</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-5 border border-gray-800 shadow-lg shadow-black/5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2">
                        <div className="p-1 rounded-full bg-red-600/10">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                        </div>
                        Delete Data & Account
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 bg-red-900/30 text-red-400 rounded-full border border-red-500/20">Danger Zone</span>
                    </div>
                    <div className="p-3 bg-red-900/10 rounded-md border border-red-500/10 mb-4">
                      <p className="text-xs text-gray-300 mb-1">
                        This action cannot be undone. Please be certain.
                      </p>
                      <p className="text-xs text-red-300/70">
                        All your data will be permanently removed, including billing information and usage history.
                      </p>
                    </div>
                    <div 
                      onClick={() => setShowDeleteModal(true)}
                      className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md transition-colors duration-150 text-xs font-medium cursor-pointer inline-flex items-center gap-1 border border-red-500/20"
                    >
                      Delete Account
                      <AlertTriangle className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div 
                  className="absolute inset-0 bg-gray-950/90 backdrop-blur-sm transition-all duration-300"
                  onClick={() => setShowDeleteModal(false)}
                />
                <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800 w-full max-w-md mx-4 shadow-2xl shadow-black/40 transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-10">
                  <div
                    onClick={() => setShowDeleteModal(false)}
                    className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 rounded-full bg-red-600/10">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-200">Delete Account</h3>
                    </div>
                    <p className="text-xs text-gray-400">
                      Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                      <p className="text-xs text-red-400 mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        To confirm, please type &quot;delete&quot; in the field below.
                      </p>
                      <input
                        type="text"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-200 placeholder-gray-400 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors duration-150"
                        placeholder='Type "delete" to confirm'
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <div
                        onClick={() => setShowDeleteModal(false)}
                        className="px-3 py-1.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-md text-xs font-medium text-gray-300 transition-colors duration-150 cursor-pointer"
                      >
                        Cancel
                      </div>
                      <div
                        className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer border border-red-500/20"
                      >
                        Delete Account
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer with actions */}
            <div className="flex justify-end items-center space-x-3 mt-8 pt-4 border-t border-gray-800/70">
              <div className="text-xs text-gray-500 mr-auto hidden md:block">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 inline" />
                  <span>Last saved: Just now</span>
                </div>
              </div>
              <div
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-md text-xs font-medium text-gray-300 transition-colors duration-150 cursor-pointer"
              >
                Cancel
              </div>
              <div
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-gray-900 rounded-md transition-colors duration-150 text-xs font-bold cursor-pointer shadow-lg shadow-amber-900/20 flex items-center gap-1.5"
              >
                <span>Save changes</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 