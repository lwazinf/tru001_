'use client';

import { useEffect, useState, CSSProperties, JSX } from 'react';
import { motion } from 'framer-motion';

// Device information interface
interface DeviceInfoState {
  os: string | null;
  browser: string | null;
  screenWidth: number | null;
  screenHeight: number | null;
  availWidth: number | null;
  availHeight: number | null;
  innerWidth: number | null;
  innerHeight: number | null;
  colorDepth: number | null;
  devicePixelRatio: number | null;
  orientation: string | null;
  touchScreen: boolean | null;
  pixelScale: number | null;
}

type OrientationType = 'Portrait' | 'Landscape' | 'Unknown';
type OSType = 'Windows' | 'macOS' | 'Linux' | 'Android' | 'iOS' | 'Unknown';
type BrowserType = 'Chrome' | 'Firefox' | 'Safari' | 'Edge' | 'Opera' | 'Unknown';

export default function DeviceInfo(): JSX.Element {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfoState>({
    os: null,
    browser: null,
    screenWidth: null,
    screenHeight: null,
    availWidth: null,
    availHeight: null,
    innerWidth: null,
    innerHeight: null,
    colorDepth: null,
    devicePixelRatio: null,
    orientation: null,
    touchScreen: null,
    pixelScale: null,
  });

  useEffect(() => {
    // Function to update device info
    const updateDeviceInfo = (): void => {
      // OS detection
      const userAgent: string = window.navigator.userAgent;
      let os: OSType = 'Unknown';
      
      if (userAgent.indexOf('Win') !== -1) os = 'Windows';
      if (userAgent.indexOf('Mac') !== -1) os = 'macOS';
      if (userAgent.indexOf('Linux') !== -1) os = 'Linux';
      if (userAgent.indexOf('Android') !== -1) os = 'Android';
      if (userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) os = 'iOS';
      
      // Browser detection
      let browser: BrowserType = 'Unknown';
      if (userAgent.indexOf('Chrome') !== -1) browser = 'Chrome';
      if (userAgent.indexOf('Firefox') !== -1) browser = 'Firefox';
      if (userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1) browser = 'Safari';
      if (userAgent.indexOf('Edge') !== -1 || userAgent.indexOf('Edg/') !== -1) browser = 'Edge';
      if (userAgent.indexOf('Opera') !== -1 || userAgent.indexOf('OPR') !== -1) browser = 'Opera';
      
      // Screen metrics
      const screenWidth: number = window.screen.width;
      const screenHeight: number = window.screen.height;
      const availWidth: number = window.screen.availWidth;
      const availHeight: number = window.screen.availHeight;
      const innerWidth: number = window.innerWidth;
      const innerHeight: number = window.innerHeight;
      const colorDepth: number = window.screen.colorDepth;
      const devicePixelRatio: number = window.devicePixelRatio;
      
      // Touchscreen detection
      const touchScreen: boolean = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Orientation
      let orientation: OrientationType = 'Unknown';
      if (typeof (window as any).orientation !== 'undefined') {
        orientation = (window as any).orientation === 0 || (window as any).orientation === 180 ? 'Portrait' : 'Landscape';
      } else if (window.matchMedia) {
        orientation = window.matchMedia('(orientation: portrait)').matches ? 'Portrait' : 'Landscape';
      }
      
      // Calculate physical pixel scale (how many physical pixels per CSS pixel)
      const pixelScale: number = Math.round((screenWidth * devicePixelRatio) / screenWidth * 100) / 100;
      
      setDeviceInfo({
        os,
        browser,
        screenWidth,
        screenHeight,
        availWidth,
        availHeight,
        innerWidth,
        innerHeight,
        colorDepth,
        devicePixelRatio,
        orientation,
        touchScreen,
        pixelScale,
      });
    };

    // Initial update
    updateDeviceInfo();
    
    // Update on resize
    window.addEventListener('resize', updateDeviceInfo);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateDeviceInfo);
  }, []);

  // Define animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const titleAnimation = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  // Calculate view box dimensions
  const calculateViewBoxStyle = (): CSSProperties => {
    if (!deviceInfo.innerWidth || !deviceInfo.screenWidth || !deviceInfo.innerHeight || !deviceInfo.screenHeight) {
      return {};
    }

    return {
      width: `${(deviceInfo.innerWidth / deviceInfo.screenWidth) * 100}%`,
      height: `${(deviceInfo.innerHeight / deviceInfo.screenHeight) * 100}%`,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <motion.h1 
          initial="hidden"
          animate="visible"
          variants={titleAnimation}
          className="text-3xl font-bold text-amber-500 mb-8 text-center"
        >
          Device Information
        </motion.h1>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-amber-400 mb-4">Device Details</h2>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-400">Operating System:</span>
                <span className="font-medium">{deviceInfo.os}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Browser:</span>
                <span className="font-medium">{deviceInfo.browser}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Touch Screen:</span>
                <span className="font-medium">{deviceInfo.touchScreen ? 'Yes' : 'No'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Orientation:</span>
                <span className="font-medium">{deviceInfo.orientation}</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-amber-400 mb-4">Screen Metrics</h2>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-400">Screen Resolution:</span>
                <span className="font-medium">{deviceInfo.screenWidth} × {deviceInfo.screenHeight}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Available Resolution:</span>
                <span className="font-medium">{deviceInfo.availWidth} × {deviceInfo.availHeight}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Browser Window:</span>
                <span className="font-medium">{deviceInfo.innerWidth} × {deviceInfo.innerHeight}</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-amber-400 mb-4">Display Quality</h2>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-400">Color Depth:</span>
                <span className="font-medium">{deviceInfo.colorDepth} bits</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Device Pixel Ratio:</span>
                <span className="font-medium">{deviceInfo.devicePixelRatio}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Physical Pixel Scale:</span>
                <span className="font-medium">{deviceInfo.pixelScale}x</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-amber-400 mb-4">Visual Representation</h2>
            <div className="relative h-40 border border-gray-600 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                Browser Window
              </div>
              <div 
                className="absolute bg-amber-500/20 border border-amber-500/40 rounded flex items-center justify-center text-xs"
                style={calculateViewBoxStyle()}
              >
                <div>Current View</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-400 text-center">
              Showing relative size of browser window to screen
            </div>
          </div>
        </motion.div>
        
        <motion.p 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-gray-400 text-sm"
        >
          Note: All information is collected and displayed client-side only. No data is sent to any server.
        </motion.p>
      </div>
    </div>
  );
}