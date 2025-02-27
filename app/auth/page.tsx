"use client";

import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";

const AuthForm = () => {
  // State for form type (signup or login)
  const [isLoginForm, setIsLoginForm] = useState(false);

  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State for background image rotation
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of background images to rotate
  const backgroundImages = [
    "https://images.pexels.com/photos/394377/pexels-photo-394377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/9796/car-refill-transportation-transport.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ];

  // Set up image rotation interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Change image every 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginForm) {
      console.log("Login submitted with data:", {
        email: formData.email,
        password: formData.password,
      });
    } else {
      console.log("Signup submitted with data:", formData);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle between signup and login forms
  const toggleFormType = () => {
    setIsLoginForm(!isLoginForm);
    // Reset form data when switching between forms
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-4xl rounded-3xl overflow-hidden bg-gray-900 shadow-2xl flex flex-col md:flex-row">
        {/* Left section with form - full width on mobile, half width on desktop */}
        <div className="w-full md:w-1/2 p-6 md:p-12">
          <div className="flex items-center mb-6 md:mb-6 relative right-[50px] mt-[-50px]">
            <div className="w-[150px] h-[150px] overflow-visible flex relative items-center justify-center mr-[-20px]">
              <img src="/assets/images/main_logo.png" alt="Logo" className="w-[650px] absolute" />
            </div>
            <span className="text-white font-medium">Need To Fuel</span>
          </div>

          <form onSubmit={handleSubmit}>
            <p className="text-gray-400 text-sm tracking-wide mb-2">
              {isLoginForm ? "WELCOME BACK" : "START FOR FREE"}
            </p>
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
              {isLoginForm ? "Log in to account" : "Create new account"}
              <span className="text-amber-500">.</span>
            </h1>
            <p className="text-gray-400 text-sm mb-6 md:mb-8">
              {isLoginForm ? "Don't have an account? " : "Already A Member? "}
              <span
                className="text-amber-500 cursor-pointer hover:underline"
                onClick={toggleFormType}
              >
                {isLoginForm ? "Sign Up" : "Log In"}
              </span>
            </p>

            <div className="space-y-4">
              {/* Signup-only fields */}
              {!isLoginForm && (
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative w-full sm:w-1/2">
                    <p className="text-xs text-gray-400 absolute top-2 left-3">
                      First name
                    </p>
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
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="amber"
                          strokeWidth="2"
                        >
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="relative w-full sm:w-1/2">
                    <p className="text-xs text-gray-400 absolute top-2 left-3">
                      Last name
                    </p>
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
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="amber"
                          strokeWidth="2"
                        >
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Email field for both forms */}
              <div className="relative">
                <p className="text-xs text-gray-400 absolute top-2 left-3">
                  Email
                </p>
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
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="amber"
                      strokeWidth="2"
                    >
                      <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"></path>
                    </svg>
                  </div>
                )}
              </div>

              {/* Password field for both forms */}
              <div className="relative">
                <p className="text-xs text-gray-400 absolute top-2 left-3">
                  Password
                </p>
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

              {/* Forgot password link (login only) */}
              {isLoginForm && (
                <div className="text-right">
                  <span className="text-amber-500 text-sm cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-amber-500 text-black font-medium py-3 rounded-md hover:bg-amber-600 active:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-sm cursor-pointer transition-colors"
              >
                {isLoginForm ? "Log in" : "Create account"}
              </button>
            </div>
          </form>
        </div>

        {/* Right section with rotating images - hidden on mobile, shown on medium screens and up */}
        <div className="hidden md:block w-full md:w-1/2 relative">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
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
                  index === currentImageIndex ? "bg-amber-500" : "bg-gray-500"
                }`}
              />
            ))}
          </div>

          {/* Dotted line overlay */}
          <div className="absolute left-0 inset-y-0 w-8 z-10">
            <svg width="100%" height="100%" className="text-amber-500/20">
              <defs>
                <pattern
                  id="dottedPattern"
                  width="10"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="5" cy="10" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="2" height="100%" fill="url(#dottedPattern)" />
            </svg>
          </div>

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black/80 to-transparent z-10"></div>

          {/* Logo in the bottom right */}
          <div className="absolute bottom-6 right-6 z-20">
            <div className="w-[150px] h-[150px] overflow-visible flex relative items-center justify-center mr-[-20px]">
              <img src="/assets/images/white_logo.png" alt="Logo" className="w-[650px] absolute" />
            </div>
          </div>
        </div>

        {/* Mobile background image - only visible on small screens */}
        <div className="relative h-48 md:hidden">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url('${image}')`,
              }}
            />
          ))}

          {/* Image indicators for mobile */}
          <div className="absolute top-4 right-4 z-20 flex space-x-2">
            {backgroundImages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? "bg-amber-500" : "bg-gray-500"
                }`}
              />
            ))}
          </div>

          {/* Dark gradient overlay for mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>

          {/* Logo in the bottom right for mobile */}
          <div className="absolute bottom-4 right-4 z-20">
            <svg
              className="text-amber-500"
              width="30"
              height="22"
              viewBox="0 0 40 30"
            >
              <g fill="#F59E0B">
                <path
                  d="M2 0L14 28L26 0"
                  stroke="#F59E0B"
                  strokeWidth="4"
                  fill="none"
                />
                <circle cx="32" cy="6" r="4" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;