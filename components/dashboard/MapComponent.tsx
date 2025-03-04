'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { Map as LeafletMap } from 'leaflet';

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

interface MapComponentProps {
  position: [number, number];
  zoom: number;
  address: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({ position, zoom, address }) => {
  const mapRef = useRef<LeafletMap | null>(null);
  
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
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
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
    </>
  );
} 