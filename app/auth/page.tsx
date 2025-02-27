'use client';

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle2, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/firebase/AuthContext";
import { useRouter } from "next/navigation";

const AuthForm = () => {
  const router = useRouter();
  
  // Safely access auth context with error handling
  const [authContextLoaded, setAuthContextLoaded] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  let authContext;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    authContext = useAuth();
    if (!authContextLoaded) setAuthContextLoaded(true);
  } catch (error) {
    if (!authError) {
      console.error("Auth context error:", error);
      setAuthError("Authentication system is initializing");
    }
  }
  
  const { signup, login, currentUser } = authContext || { 
    signup: async () => { throw new Error("Auth not initialized"); },
    login: async () => { throw new Error("Auth not initialized"); },
    currentUser: null
  };

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

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
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (authError) {
      setError(authError);
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      if (isLoginForm) {
        // Login with Firebase
        await login(formData.email, formData.password);
        router.push('/');
      } else {
        // Signup with Firebase
        await signup(formData.firstName, formData.lastName, formData.email, formData.password);
        router.push('/');
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
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
    setError('');
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { duration: 0.3 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Display auth context error for debugging if needed
  if (authError) {
    console.log("Auth context error detected in render:", authError);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black md:p-4">
      <Card className="w-full h-full md:h-auto md:max-w-4xl rounded-none md:rounded-3xl overflow-hidden bg-gray-900 shadow-2xl flex flex-col md:flex-row border-0">
        {/* Left section with form - full width on mobile, half width on desktop */}
        <motion.div 
          className="w-full md:w-1/2 p-6 pt-8 md:pt-6 md:p-12 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header for mobile */}
          <motion.div 
            className="md:hidden flex items-center justify-between mb-6 px-1"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center">
              <div className="w-[40px] h-[40px] overflow-visible flex relative items-center justify-center mr-2">
                <img src="/assets/images/main_logo.png" alt="Logo" className="w-[170px] absolute" />
              </div>
              <span className="text-white font-medium">Need To Fuel</span>
            </div>
            <Button 
              variant="ghost" 
              className="text-white bg-black/20 hover:bg-black/40 rounded-full px-4 py-2 text-sm"
            >
              Get app
            </Button>
          </motion.div>
          
          {/* Header for desktop */}
          <motion.div 
            className="hidden md:flex items-center mb-6 md:mb-6 relative right-[50px] mt-[-50px]"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-[150px] h-[150px] overflow-visible flex relative items-center justify-center mr-[-20px]">
              <img src="/assets/images/main_logo.png" alt="Logo" className="w-[650px] absolute" />
            </div>
            <span className="text-white font-medium">Need To Fuel</span>
          </motion.div>

          {/* Debug info for empty page troubleshooting */}
          {authError && (
            <div className="mb-4 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-500 text-xs">
              Auth status: {authError}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.form 
              key={isLoginForm ? "login" : "signup"}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleSubmit}
            >
              <motion.p 
                variants={itemVariants}
                className="text-gray-400 text-sm tracking-wide mb-2"
              >
                {isLoginForm ? "WELCOME BACK" : "START FOR FREE"}
              </motion.p>
              
              <motion.h1 
                variants={itemVariants}
                className="text-white text-3xl md:text-4xl font-bold mb-2"
              >
                {isLoginForm ? "Log in to account" : "Create new account"}
                <span className="text-amber-500">.</span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-gray-400 text-sm mb-6 md:mb-8"
              >
                {isLoginForm ? "Don't have an account? " : "Already A Member? "}
                <motion.span
                  className="text-amber-500 cursor-pointer hover:underline"
                  onClick={toggleFormType}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoginForm ? "Sign Up" : "Log In"}
                </motion.span>
              </motion.p>

              {/* Display error if any */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-500 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div 
                variants={itemVariants}
                className="space-y-4"
              >
                {/* Signup-only fields */}
                <AnimatePresence>
                  {!isLoginForm && (
                    <motion.div 
                      className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative w-full sm:w-1/2">
                        <Label className="text-xs text-gray-400 absolute top-2 left-3 z-10">
                          First name
                        </Label>
                        <div className="relative group">
                          <Input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full bg-black rounded-md py-3 pl-3 pt-6 pb-2 text-white border-gray-800 transition-all duration-300
                            focus:border-amber-500 focus:ring-amber-500 group-hover:border-gray-600"
                            required
                          />
                          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></div>
                          {formData.firstName && (
                            <motion.div 
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <CheckCircle2 size={16} className="text-amber-500" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                      <div className="relative w-full sm:w-1/2">
                        <Label className="text-xs text-gray-400 absolute top-2 left-3 z-10">
                          Last name
                        </Label>
                        <div className="relative group">
                          <Input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full bg-black rounded-md py-3 pl-3 pt-6 pb-2 text-white border-gray-800 transition-all duration-300
                            focus:border-amber-500 focus:ring-amber-500 group-hover:border-gray-600"
                            required
                          />
                          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></div>
                          {formData.lastName && (
                            <motion.div 
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <CheckCircle2 size={16} className="text-amber-500" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email field for both forms */}
                <motion.div variants={itemVariants} className="relative">
                  <Label className="text-xs text-gray-400 absolute top-2 left-3 z-10">
                    Email
                  </Label>
                  <div className="relative group">
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-black rounded-md py-3 pl-3 pt-6 pb-2 text-white border-gray-800 transition-all duration-300 
                      focus:border-amber-500 focus:ring-amber-500 group-hover:border-gray-600"
                      required
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></div>
                    {formData.email && (
                      <motion.div 
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <Mail size={16} className="text-amber-500" />
                      </motion.div>
                    )}
                  </div>
                  {formData.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-amber-500/70 mt-1 ml-1"
                    >
                      We&apos;ll never share your email
                    </motion.p>
                  )}
                </motion.div>

                {/* Password field for both forms */}
                <motion.div variants={itemVariants} className="relative">
                  <Label className="text-xs text-gray-400 absolute top-2 left-3 z-10">
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-black rounded-md py-3 pl-3 pt-6 pb-2 text-white border border-amber-500 transition-all duration-300
                      focus:border-amber-500 focus:ring-amber-500 group-hover:border-amber-400"
                      required
                    />
                    {formData.password && (
                      <motion.div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={togglePasswordVisibility}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? (
                          <EyeOff size={16} className="text-amber-500" />
                        ) : (
                          <Eye size={16} className="text-amber-500" />
                        )}
                      </motion.div>
                    )}
                  </div>
                  {formData.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="mt-1 overflow-hidden"
                    >
                      <div className="flex gap-1 ml-1">
                        <div className={`h-1 w-full rounded-full ${formData.password.length > 3 ? 'bg-amber-500' : 'bg-gray-600'}`}></div>
                        <div className={`h-1 w-full rounded-full ${formData.password.length > 5 ? 'bg-amber-500' : 'bg-gray-600'}`}></div>
                        <div className={`h-1 w-full rounded-full ${formData.password.length > 7 ? 'bg-amber-500' : 'bg-gray-600'}`}></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 ml-1">
                        {formData.password.length < 4 ? 'Weak password' : 
                         formData.password.length < 6 ? 'Fair password' : 
                         formData.password.length < 8 ? 'Good password' : 'Strong password'}
                      </p>
                    </motion.div>
                  )}
                </motion.div>

                {/* Forgot password link (login only) */}
                <AnimatePresence>
                  {isLoginForm && (
                    <motion.div 
                      className="text-right"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <motion.span 
                        className="text-amber-500 text-sm cursor-pointer hover:underline"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (formData.email) {
                            // Implement password reset
                            alert("Password reset functionality will be implemented!");
                          } else {
                            setError("Please enter your email address first");
                          }
                        }}
                      >
                        Forgot password?
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium py-6 md:rounded-md rounded-lg shadow-md transition-all duration-300 ease-in-out"
                    disabled={loading}
                  >
                    {loading ? 
                      "Loading..." : 
                      isLoginForm ? "Log in" : "Create account"
                    }
                  </Button>
                </motion.div>
                
                {/* Mobile-only fixed button at bottom */}
                <AnimatePresence>
                  {!isLoginForm && (
                    <motion.div 
                      className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent z-30 md:hidden"
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 100, opacity: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.div
                        className="relative h-1 w-32 bg-amber-500/20 mx-auto mb-3 rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <motion.div 
                          className="absolute top-0 left-0 h-full bg-amber-500 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 1, duration: 1.5 }}
                        />
                      </motion.div>
                      <motion.div
                        className="flex items-center justify-between"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <div className="flex items-center text-xs text-white/60">
                          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          2 min setup
                        </div>
                        <a href="#" className="text-amber-500 text-xs font-medium">Need help?</a>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.form>
          </AnimatePresence>
        </motion.div>

        {/* Right section with rotating images - hidden on mobile, shown on medium screens and up */}
        <div className="hidden md:block w-full md:w-1/2 relative">
          <AnimatePresence mode="wait">
            {backgroundImages.map((image, index) => (
              index === currentImageIndex && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${image}')`,
                  }}
                />
              )
            ))}
          </AnimatePresence>

          {/* Image indicators */}
          <div className="absolute top-6 right-6 z-20 flex space-x-2">
            {backgroundImages.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? "bg-amber-500" : "bg-gray-500"
                }`}
                animate={{
                  scale: index === currentImageIndex ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
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
          <motion.div 
            className="absolute bottom-6 right-6 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="w-[150px] h-[150px] overflow-visible flex relative items-center justify-center mr-[-20px]">
              <img src="/assets/images/white_logo.png" alt="Logo" className="w-[650px] absolute" />
            </div>
          </motion.div>
        </div>

        {/* Mobile background image - only visible on small screens, now at bottom of page */}
        <div className="relative h-48 md:hidden mt-auto">
          <AnimatePresence mode="wait">
            {backgroundImages.map((image, index) => (
              index === currentImageIndex && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${image}')`,
                  }}
                />
              )
            ))}
          </AnimatePresence>

          {/* Image indicators for mobile */}
          <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
            {backgroundImages.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? "bg-amber-500" : "bg-gray-500"
                }`}
                animate={{
                  scale: index === currentImageIndex ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          {/* Dark gradient overlay for mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-transparent z-10"></div>

          {/* Logo in the bottom right for mobile */}
          <motion.div 
            className="absolute bottom-4 left-4 z-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="w-[50px] h-[50px] overflow-visible flex relative items-center justify-center">
              <img src="/assets/images/white_logo.png" alt="Logo" className="w-[200px] absolute"/>
            </div>
          </motion.div>
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;