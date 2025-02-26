'use client'

import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const SignupForm = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  // State for background image rotation
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Array of background images to rotate
  const backgroundImages = [
    'https://images.pexels.com/photos/394377/pexels-photo-394377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/9796/car-refill-transportation-transport.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ];
  
  // Set up image rotation interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle login click
  const handleLoginClick = () => {
    console.log('Redirecting to login page');
  };
  
  // Handle change method click
  const handleChangeMethod = () => {
    console.log('Changing authentication method');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      
      <div className="w-full max-w-4xl rounded-3xl overflow-hidden bg-gray-900 shadow-2xl flex">
        {/* Left section with form */}
        <div className="w-1/2 p-12">
          <div className="flex items-center mb-12">
            <div className="bg-amber-500 rounded-full w-8 h-8 flex items-center justify-center mr-2">
              <span className="text-black font-bold">A</span>
            </div>
            <span className="text-white font-medium">Need To Fuel</span>
            
            <div className="ml-12 text-gray-400 space-x-6">
             
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <p className="text-gray-400 text-sm tracking-wide mb-2">START FOR FREE</p>
            <h1 className="text-white text-4xl font-bold mb-2">
              Create new account<span className="text-amber-500">.</span>
            </h1>
            <p className="text-gray-400 text-sm mb-8">
              Already A Member? <span className="text-amber-500 cursor-pointer hover:underline" onClick={handleLoginClick}>Log In</span>
            </p>
            
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="relative w-1/2">
                  <p className="text-xs text-gray-400 absolute top-2 left-3">First name</p>
                  <input 
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-black rounded-md py-3 pl-3 pt-6 pb-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                  {formData.firstName && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="amber" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="relative w-1/2">
                  <p className="text-xs text-gray-400 absolute top-2 left-3">Last name</p>
                  <input 
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-black rounded-md py-3 pl-3 pt-6 pb-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                  {formData.lastName && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="amber" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <p className="text-xs text-gray-400 absolute top-2 left-3">Email</p>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black rounded-md py-3 pl-3 pt-6 pb-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
                {formData.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="amber" strokeWidth="2">
                      <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"></path>
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <p className="text-xs text-gray-400 absolute top-2 left-3">Password</p>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-black rounded-md py-3 pl-3 pt-6 pb-2 text-white border border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
                {formData.password && (
                  <div 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    <Eye size={16} color="#F59E0B" />
                  </div>
                )}
              </div>
              
              <div className="flex space-x-4 mt-8">
                <button 
                  type="button"
                  onClick={handleChangeMethod}
                  className="w-1/2 bg-gray-800 text-white py-3 rounded-full hover:bg-gray-700 transition-colors"
                >
                  Change method
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-amber-500 text-black font-medium py-3 rounded-full hover:bg-amber-600 transition-colors"
                >
                  Create account
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Right section with rotating images */}
        <div className="w-1/2 relative">
          {/* Background Image with CSS fade effect and animation */}
          {backgroundImages.map((image, index) => (
            <div 
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`} 
              style={{
                backgroundImage: `url('${image}')`,
              }}
            />
          ))}
          
          {/* Image indicators */}
          <div className="absolute top-6 right-6 z-20 flex space-x-2">
            {backgroundImages.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-amber-500' : 'bg-gray-500'
                }`}
              />
            ))}
          </div>
          
          {/* Dotted line overlay */}
          <div className="absolute left-0 inset-y-0 w-8 z-10">
            <svg width="100%" height="100%" className="text-amber-500/20">
              <defs>
                <pattern id="dottedPattern" width="10" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="10" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="2" height="100%" fill="url(#dottedPattern)" />
            </svg>
          </div>
          
          {/* Dark gradient overlay - now with gold tint */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black/80 to-transparent z-10"></div>
          
          {/* Logo in the bottom right - now gold */}
          <div className="absolute bottom-6 right-6 z-20">
            <svg className="text-amber-500" width="40" height="30" viewBox="0 0 40 30">
              <g fill="#F59E0B">
                <path d="M2 0L14 28L26 0" stroke="#F59E0B" strokeWidth="4" fill="none" />
                <circle cx="32" cy="6" r="4" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;