'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Search, X, AlertTriangle, User, Mail, Lock, MapPin, Car, CheckCircle2, Bell, Settings, Menu, ArrowRight, Shield, Clock, Fuel, FileText, Phone } from 'lucide-react';
import Script from 'next/script';
import zxcvbn from 'zxcvbn';
import dynamic from 'next/dynamic';
import type { Map as LeafletMap } from 'leaflet';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Google Maps types
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

// Create a separate Map component to handle Leaflet initialization better
const Map = ({ position, zoom, address }: { position: [number, number]; zoom: number; address: string }) => {
  const mapRef = useRef<LeafletMap | null>(null);
  
  // Use effect to fly to new position when it changes
  useEffect(() => {
    if (mapRef.current) {
      // Use flyTo for a smooth animation to the new location
      mapRef.current.flyTo(position, zoom, {
        duration: 1.8, // Animation duration in seconds
        easeLinearity: 0.25,
        animate: true,
      });
    }
  }, [position, zoom]);
  
  return (
    <MapContainer 
      center={position} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%' }}
      ref={mapRef as any} // Type casting to avoid type issues with dynamic imports
      zoomAnimation={true}
      fadeAnimation={true}
      markerZoomAnimation={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} 
        // Use autoPan to make marker move into view if needed
        autoPan={true}
      >
        <Popup>
          {address || 'Johannesburg, South Africa'}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default function DashPage() {
  // State variables
  const [address, setAddress] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for save button
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [mapPosition, setMapPosition] = useState<[number, number]>([-26.2041, 28.0473]); // Johannesburg coordinates
  const [mapZoom, setMapZoom] = useState(10);
  const [isBrowser, setIsBrowser] = useState(false); // Add this to track if we're running in browser
  const { currentUser } = useAuth();
  const router = useRouter();
  
  // User data state with proper type definition
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tier: 'basic',
    address: '',
    vehicles: [],
    tanks: {
      diesel: 0,
      petrol: { '93': 0, '95': 0 }
    },
    documents: [],
    history: { orders: [], reserves: [] }
  });

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const db = getFirestore();
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              email: data.email || '',
              phone: data.phone || '',
              tier: data.tier || 'basic',
              address: data.address || '',
              vehicles: data.vehicles || [],
              tanks: data.tanks || {
                diesel: 0,
                petrol: { '93': 0, '95': 0 }
              },
              documents: data.documents || [],
              history: data.history || { orders: [], reserves: [] }
            });
            
            // Update address state to match user data
            setAddress(data.address || '');
            
            // If user has address with coordinates, update map
            if (data.address && window.google && window.google.maps) {
              const geocoder = new window.google.maps.Geocoder();
              geocoder.geocode({ address: data.address }, (results, status) => {
                if (status === 'OK' && results && results[0] && results[0].geometry) {
                  const location = results[0].geometry.location;
                  setMapPosition([location.lat(), location.lng()]);
                  setMapZoom(15);
                }
              });
            } else {
              // Default to Johannesburg if no address
              setMapPosition([-26.2041, 28.0473]);
              setMapZoom(10);
            }
          } else {
            console.log('No user document found!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  // Update Firestore when user data changes
  const saveUserDataToFirestore = async () => {
    if (currentUser && currentUser.uid) {
      try {
        setLoading(true);
        const db = getFirestore();
        const userDocRef = doc(db, 'users', currentUser.uid);
        
        // First get the current document to avoid overwriting fields we're not updating
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          throw new Error("User document not found");
        }
        
        // Create the update object with all the fields from the form
        const updateData = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          address: userData.address,
          // Preserve the existing data structure for other fields
          tanks: userData.tanks,
          vehicles: userData.vehicles
        };
        
        // Update the document
        await updateDoc(userDocRef, updateData);
        
        // Show success message
        setSuccessMessage('Changes saved successfully!');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } catch (error) {
        console.error('Error updating user data:', error);
        setSuccessMessage('Failed to save changes');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } finally {
        setLoading(false);
      }
    } else {
      setSuccessMessage('Please log in to save changes');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  // Initialize Google Places Autocomplete
  const initAutocomplete = () => {
    if (!window.google) {
      console.error('Google Maps not loaded');
      return;
    }
    
    const input = document.getElementById('location-input') as HTMLInputElement;
    if (!input) {
      console.error('Location input not found');
      return;
    }

    try {
      const options: google.maps.places.AutocompleteOptions = {
        componentRestrictions: { country: 'za' }, // South Africa
        types: ['address'],
        fields: ['formatted_address', 'geometry']
      };
      
      const autoComplete = new window.google.maps.places.Autocomplete(input, options);
      
      autoComplete.addListener('place_changed', () => {
        setIsAddressLoading(true);
        const place = autoComplete.getPlace();
        
        if (place.formatted_address) {
          setAddress(place.formatted_address);
          setUserData(prev => ({ ...prev, address: place.formatted_address || '' }));
          
          // Update map position when a place is selected from autocomplete
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            // Animate the map transition
            setMapZoom(11); // First zoom out a bit
            
            // Then after a small delay, set the final position and zoom
            setTimeout(() => {
              setMapPosition([lat, lng]);
              setMapZoom(16); // Zoom in closer to the selected location
            }, 300);
          }
        }
        
        setTimeout(() => {
          setIsAddressLoading(false);
        }, 600); // Longer delay to match animation
      });
      
      autocompleteRef.current = autoComplete;
      console.log('Google Places Autocomplete initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Places:', error);
    }
  };

  // Handle address change - don't geocode on every keystroke
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setUserData(prev => ({ ...prev, address: e.target.value }));
    // Explicitly NOT geocoding here - that will happen only when autocomplete selection is made
  };

  // Handle password strength
  const checkPasswordStrength = (pass: string) => {
    const result = zxcvbn(pass);
    setPasswordStrength(result.score);
    setPassword(pass);
  };

  // Handle save changes
  const handleSave = () => {
    saveUserDataToFirestore();
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== 'delete') {
      setSuccessMessage('Please type "delete" to confirm');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      return;
    }

    try {
      if (currentUser && currentUser.uid) {
        const db = getFirestore();
        // Delete the user document
        await deleteDoc(doc(db, 'users', currentUser.uid));
        
        // Then delete the user authentication account
        await currentUser.delete();
        
        setShowDeleteModal(false);
        setSuccessMessage('Account deleted successfully');
        setShowSuccessToast(true);
        setTimeout(() => {
          setShowSuccessToast(false);
          router.push('/');
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      setSuccessMessage('Failed to delete account');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  // Handler for input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
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
        z-index: 100;
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

  // Load Leaflet CSS
  useEffect(() => {
    // Add Leaflet CSS
    const leafletStyles = document.createElement('link');
    leafletStyles.rel = 'stylesheet';
    leafletStyles.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    leafletStyles.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    leafletStyles.crossOrigin = '';
    document.head.appendChild(leafletStyles);
    
    return () => {
      document.head.removeChild(leafletStyles);
    };
  }, []);

  // Update map when address changes from outside autocomplete
  useEffect(() => {
    if (!address || !window.google || !window.google.maps) {
      // Default to Johannesburg if no address
      if (!address && mapPosition[0] !== -26.2041 && mapPosition[1] !== 28.0473) {
        setMapPosition([-26.2041, 28.0473]);
        setMapZoom(10);
      }
      return;
    }
    
    // Only geocode if address is selected through the autocomplete
    // This code is now handled in the autocomplete place_changed event
  }, [address, mapPosition]);

  // Set isBrowser to true when component mounts (client-side only)
  useEffect(() => {
    setIsBrowser(true);
    
    // Default to Johannesburg if no address is set
    if (!address) {
      setMapPosition([-26.2041, 28.0473]); // Johannesburg coordinates
      setMapZoom(10);
    }
  }, []);
  
  // Set up the initMap callback that Google Maps will call when loaded
  useEffect(() => {
    window.initMap = () => {
      initAutocomplete();
      console.log("Google Maps API loaded and initialized");
    };
    
    return () => {
      window.initMap = () => {};
    };
  }, []);

  return (
    <>
      {/* Add Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      
      {/* Google Maps API Script */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`}
        strategy="lazyOnload"
        onError={(e) => {
          console.error("Error loading Google Maps script:", e);
        }}
      />
      <div className="flex min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100">
        {/* Buffer for top navigation */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-gray-950/80 backdrop-blur-sm z-30 border-b border-gray-800/30"></div>
        
        {/* Sidebar */}
        <div className="hidden md:block w-64 border-r border-gray-800/70">
          {/* Sidebar buffer */}
          <div className="h-16 border-b border-gray-800/30"></div>
          
          <div className="px-4 py-6">
            <nav className="space-y-1">
              <div 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${activeTab === 'profile' ? 'bg-gray-800/50 text-amber-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'} transition-colors duration-150`}
              >
                <User className={`h-4 w-4 ${activeTab === 'profile' ? 'text-amber-400' : 'text-gray-500'}`} />
                <span>Profile & Fuel Management</span>
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
                  <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-medium">{userData.tier}</span>
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
        </div>

        {/* Mobile menu button */}
        <div className="fixed top-4 right-4 z-40 md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-md border border-gray-700/30 shadow-lg"
          >
            <Menu className="h-5 w-5 text-gray-300" />
          </button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 mt-20 md:mt-20">
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
                Profile & Fuel Management
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
                            <Car className="h-3 w-3 text-gray-400" />
                            Vehicles
                          </label>
                          <div className="bg-gray-800/30 rounded-md p-3 border border-gray-700/50">
                            <p className="text-xs text-gray-400">No vehicles added yet</p>
                            <button className="mt-2 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                              + Add Vehicle
                            </button>
                          </div>
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
                          <div className="mt-3 h-48 rounded-md overflow-hidden border border-gray-700 shadow-inner shadow-black/20">
                            {isBrowser && (
                              <Map position={mapPosition} zoom={mapZoom} address={address} />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/40 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50 shadow-inner shadow-black/10">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
                              <Fuel className="h-3 w-3 text-amber-400" />
                              Fuel Tanks Status
                            </h3>
                            <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-medium">{userData.tier}</span>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between items-center text-xs mb-1">
                                <span className="text-gray-400">Diesel</span>
                                <span className="text-amber-400">{userData.tanks.diesel}L</span>
                              </div>
                              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full w-0 bg-amber-400 rounded-full"></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between items-center text-xs mb-1">
                                <span className="text-gray-400">Petrol 93</span>
                                <span className="text-amber-400">{userData.tanks.petrol['93']}L</span>
                              </div>
                              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full w-0 bg-amber-400 rounded-full"></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between items-center text-xs mb-1">
                                <span className="text-gray-400">Petrol 95</span>
                                <span className="text-amber-400">{userData.tanks.petrol['95']}L</span>
                              </div>
                              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full w-0 bg-amber-400 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/40 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50 shadow-inner shadow-black/10">
                          <h3 className="text-xs font-semibold text-gray-200 mb-3 flex items-center gap-1.5">
                            <FileText className="h-3 w-3 text-gray-400" />
                            Documents & History
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between py-2 px-3 bg-gray-800/30 rounded-md border border-gray-700/30">
                              <div className="text-xs text-gray-400">Documents</div>
                              <span className="text-[10px] px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded">{userData.documents.length}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 bg-gray-800/30 rounded-md border border-gray-700/30">
                              <div className="text-xs text-gray-400">Order History</div>
                              <span className="text-[10px] px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded">{userData.history.orders.length}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 bg-gray-800/30 rounded-md border border-gray-700/30">
                              <div className="text-xs text-gray-400">Reservations</div>
                              <span className="text-[10px] px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded">{userData.history.reserves.length}</span>
                            </div>
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
                              name="email"
                              className="w-full bg-gray-800/30 border border-gray-700/50 rounded-md px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                              value={userData.email}
                              disabled
                              readOnly
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
                            value={password}
                            onChange={(e) => checkPasswordStrength(e.target.value)}
                          />
                          <div className="w-full h-1.5 mt-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                passwordStrength === 0 ? 'w-0 bg-red-500' :
                                passwordStrength === 1 ? 'w-1/4 bg-red-500' :
                                passwordStrength === 2 ? 'w-2/4 bg-yellow-500' :
                                passwordStrength === 3 ? 'w-3/4 bg-green-500' :
                                'w-full bg-green-400'
                              }`}
                            />
                          </div>
                          <p className="text-[10px] text-gray-500">
                            Password strength: {
                              passwordStrength === 0 ? 'Very Weak' :
                              passwordStrength === 1 ? 'Weak' :
                              passwordStrength === 2 ? 'Fair' :
                              passwordStrength === 3 ? 'Good' :
                              'Strong'
                            }
                          </p>
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
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
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
                      onClick={handleDeleteAccount}
                      className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer border border-red-500/20"
                    >
                      Delete Account
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
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
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
                onClick={loading ? undefined : handleSave}
                className={`px-4 py-2 ${loading 
                  ? 'bg-amber-600/50' 
                  : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500'
                } text-gray-900 rounded-md transition-colors duration-150 text-xs font-bold cursor-pointer shadow-lg shadow-amber-900/20 flex items-center gap-1.5`}
              >
                {loading ? (
                  <>
                    <span>Saving...</span>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-gray-900 border-t-transparent"></div>
                  </>
                ) : (
                  <>
                    <span>Save changes</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div 
            className="absolute inset-0 bg-gray-950/90 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-64 h-full bg-gray-900 p-4">
            {/* Copy sidebar content here */}
          </div>
        </div>
      )}
    </>
  );
} 