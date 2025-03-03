'use client';

import React from 'react';
import { MoreVertical } from 'lucide-react';

export default function DashPage() {
  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      {/* Left Sidebar - Compact */}
      <div className="w-60 border-r border-gray-800/50 bg-gray-900/70 backdrop-blur-sm">
        <div className="flex flex-col h-full">
          <div className="p-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/20">
                <span className="sr-only">Logo</span>
              </div>
              <span className="font-medium text-base text-white tracking-tight">Untitled UI</span>
            </div>
            
            <nav className="mt-2 space-y-0.5">
              <button className="w-full group flex items-center py-2 px-3 rounded-md text-gray-300 hover:bg-gray-800/70 hover:text-white transition-colors duration-150">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400 group-hover:text-amber-400 transition-colors duration-150">
                  <path d="M10.0001 2.29199L2.91675 8.12533V17.5003H7.50008V11.6667H12.5001V17.5003H17.0834V8.12533L10.0001 2.29199Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Overview
              </button>
              <button className="w-full group flex items-center py-2 px-3 rounded-md text-gray-300 hover:bg-gray-800/70 hover:text-white transition-colors duration-150">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400 group-hover:text-amber-400 transition-colors duration-150">
                  <rect x="3.33325" y="3.33331" width="5.83333" height="5.83333" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3.33325" y="12.5" width="5.83333" height="4.16667" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="12.5" y="3.33331" width="4.16667" height="5.83333" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="12.5" y="12.5" width="4.16667" height="4.16667" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Dashboards
              </button>
              <button className="w-full group flex items-center py-2 px-3 rounded-md text-gray-300 hover:bg-gray-800/70 hover:text-white transition-colors duration-150">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400 group-hover:text-amber-400 transition-colors duration-150">
                  <path d="M15.8333 4.16669H4.16667C3.24619 4.16669 2.5 4.91288 2.5 5.83335V14.1667C2.5 15.0872 3.24619 15.8334 4.16667 15.8334H15.8333C16.7538 15.8334 17.5 15.0872 17.5 14.1667V5.83335C17.5 4.91288 16.7538 4.16669 15.8333 4.16669Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.66675 10H13.3334M10.0001 6.66669V13.3334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                All projects
              </button>
              <button className="w-full group flex items-center py-2 px-3 rounded-md text-gray-300 hover:bg-gray-800/70 hover:text-white transition-colors duration-150">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400 group-hover:text-amber-400 transition-colors duration-150">
                  <path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 5.83331V10L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Analyze
              </button>
              <button className="w-full group flex items-center py-2 px-3 rounded-md text-gray-300 hover:bg-gray-800/70 hover:text-white transition-colors duration-150">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400 group-hover:text-amber-400 transition-colors duration-150">
                  <path d="M7.49992 9.99996C8.8806 9.99996 9.99992 8.88064 9.99992 7.49996C9.99992 6.11929 8.8806 4.99996 7.49992 4.99996C6.11925 4.99996 4.99992 6.11929 4.99992 7.49996C4.99992 8.88064 6.11925 9.99996 7.49992 9.99996Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.8334 4.16675C16.2754 4.16675 16.6667 4.55804 16.6667 5.00008V7.50008C16.6667 8.88075 15.5474 10.0001 14.1667 10.0001C12.7861 10.0001 11.6667 8.88075 11.6667 7.50008C11.6667 6.11941 12.7861 5.00008 14.1667 5.00008H15.8334V4.16675Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.49992 10.0001C6.11925 10.0001 4.99992 11.1194 4.99992 12.5001V15.0001C4.99992 15.4421 4.60863 15.8334 4.16659 15.8334H2.49992C2.05788 15.8334 1.66659 15.4421 1.66659 15.0001V14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.6667 12.5001C11.6667 11.1194 12.7861 10.0001 14.1667 10.0001C15.5474 10.0001 16.6667 11.1194 16.6667 12.5001V15.0001C16.6667 15.4421 16.2754 15.8334 15.8334 15.8334H14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Manage access
              </button>
            </nav>
            
            <div className="mt-8">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider py-2 ml-3">Data management</div>
              <nav className="mt-1 space-y-0.5">
                <button className="w-full group flex items-center py-2 px-3 rounded-md text-gray-300 hover:bg-gray-800/70 hover:text-white transition-colors duration-150">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400 group-hover:text-amber-400 transition-colors duration-150">
                    <path d="M18.3334 3.33331H1.66675V16.6666H18.3334V3.33331Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1.66675 7.5H18.3334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1.66675 11.6667H18.3334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.5 7.5V16.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  All charts
                </button>
                <button className="w-full group flex items-center py-2 px-3 rounded-md text-gray-300 hover:bg-gray-800/70 hover:text-white transition-colors duration-150">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400 group-hover:text-amber-400 transition-colors duration-150">
                    <path d="M17.5 3.33331H2.5C2.04 3.33331 1.66675 3.70665 1.66675 4.16665V5.83331C1.66675 6.29331 2.04 6.66665 2.5 6.66665H17.5C17.96 6.66665 18.3334 6.29331 18.3334 5.83331V4.16665C18.3334 3.70665 17.96 3.33331 17.5 3.33331Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 8.33331H2.5C2.04 8.33331 1.66675 8.70665 1.66675 9.16665V10.8333C1.66675 11.2933 2.04 11.6666 2.5 11.6666H17.5C17.96 11.6666 18.3334 11.2933 18.3334 10.8333V9.16665C18.3334 8.70665 17.96 8.33331 17.5 8.33331Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 13.3333H2.5C2.04 13.3333 1.66675 13.7067 1.66675 14.1667V15.8333C1.66675 16.2933 2.04 16.6667 2.5 16.6667H17.5C17.96 16.6667 18.3334 16.2933 18.3334 15.8333V14.1667C18.3334 13.7067 17.96 13.3333 17.5 13.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Explore events
                </button>
                <button className="w-full group flex items-center py-2 px-3 rounded-md text-gray-300 hover:bg-gray-800/70 hover:text-white transition-colors duration-150">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400 group-hover:text-amber-400 transition-colors duration-150">
                    <path d="M7.5 15.8333L2.5 10.8333L7.5 5.83334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5001 15.8333L12.5001 10.8333L17.5001 5.83334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Visual labels
                </button>
                <button className="w-full group flex items-center py-2 px-3 rounded-md text-gray-300 hover:bg-gray-800/70 hover:text-white transition-colors duration-150">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400 group-hover:text-amber-400 transition-colors duration-150">
                    <path d="M1.66675 2.5H6.66675C7.55121 2.5 8.39984 2.85119 9.02496 3.47631C9.65008 4.10143 10.0001 4.95 10.0001 5.83333V17.5C10.0001 16.837 9.73669 16.2011 9.26785 15.7322C8.79901 15.2634 8.16312 15 7.50008 15H1.66675V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.3333 2.5H13.3333C12.4489 2.5 11.6002 2.85119 10.9751 3.47631C10.35 4.10143 10 4.95 10 5.83333V17.5C10 16.837 10.2634 16.2011 10.7322 15.7322C11.2011 15.2634 11.837 15 12.5 15H18.3333V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Live data feed
                </button>
              </nav>
            </div>
          </div>
          
          {/* User Profile - Fixed at bottom */}
          <div className="mt-auto border-t border-gray-800/50 p-4">
            <div className="flex items-center p-2">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profile" className="w-9 h-9 rounded-full mr-3 ring-2 ring-amber-500/20" />
              <div>
                <div className="text-sm font-medium text-white">Caitlyn Kline</div>
                <div className="text-xs text-gray-400">caitlyn@untitledui.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content - Smaller resolution, all sections in column */}
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
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-200"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300">Password</label>
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
                <div className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded-md transition text-xs cursor-pointer inline-block">
                  Delete Account
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800/70"></div>

            {/* Profile Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-amber-400 border-b border-gray-800/70 pb-2">Profile</h2>
              
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
                      <input
                        type="text"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-200"
                        placeholder="Your Location"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800/70"></div>

            {/* History Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-amber-400 border-b border-gray-800/70 pb-2">History</h2>
              
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                <h3 className="text-sm font-semibold text-gray-200 mb-3">Locations & Amounts</h3>
                <div className="bg-gray-800/50 rounded-md p-2 h-32">
                  <div className="h-full bg-gradient-to-r from-amber-600/20 to-amber-600/5 rounded-md"></div>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                <h3 className="text-sm font-semibold text-gray-200 mb-2">Interactions with Drivers</h3>
                <div className="bg-gray-800/50 rounded-md p-2 h-32">
                  <div className="h-full bg-gradient-to-r from-amber-600/20 to-amber-600/5 rounded-md"></div>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                <h3 className="text-sm font-semibold text-gray-200 mb-2">Trend by Day</h3>
                <div className="bg-gray-800/50 rounded-md p-2">
                  <div className="h-24 bg-gradient-to-r from-amber-600/20 to-amber-600/5 rounded-md"></div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800/70"></div>

            {/* Billing Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-amber-400 border-b border-gray-800/70 pb-2">Billing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                  <h3 className="text-xs text-gray-200 mb-2">Current Tier</h3>
                  <p className="text-xs text-gray-300">Premium Plan</p>
                  <div className="mt-2 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 rounded-md transition text-xs cursor-pointer inline-block">
                    Upgrade Tier
                  </div>
                </div>
                
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                  <h3 className="text-xs text-gray-200 mb-2">Payment for Next Months</h3>
                  <p className="text-xs text-gray-300">Next payment: <span className="text-amber-400">30 days</span></p>
                  <div className="mt-2 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 rounded-md transition text-xs cursor-pointer inline-block">
                    Manage Payment
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                <h3 className="text-xs text-gray-200 mb-2">Billing History</h3>
                <div className="bg-gray-800/50 rounded-md p-3">
                  <div className="space-y-1">
                    {[1,2,3].map((item) => (
                      <div key={item} className="flex justify-between items-center py-1.5 border-b border-gray-700/50 last:border-0">
                        <div className="text-xs text-gray-300">Payment #{item}</div>
                        <div className="text-xs text-amber-400">$99.00</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
  );
} 