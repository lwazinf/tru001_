'use client';

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle2, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/firebase/AuthContext";
import { useRouter } from "next/navigation";
import { processPayment } from '../utils/payment';
import { doc, setDoc, getFirestore } from "firebase/firestore";

const AuthForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  
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
    title: "",
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

  // Show thank you message when user is logged in
  const [showThankYou, setShowThankYou] = useState(false);
  
  useEffect(() => {
    if (currentUser) {
      setShowThankYou(true);
    }
  }, [currentUser]);

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

  // Function to save payment response to Firestore
  const savePaymentToFirestore = async (paymentResponse: any, transactionRef: string) => {
    try {
      const db = getFirestore();
      const now = new Date();
      
      // Create the payment document
      await setDoc(doc(db, "Payments", paymentResponse.paymentRequestId), {
        paymentRequestId: paymentResponse.paymentRequestId,
        transactionReference: transactionRef,
        timestamp: now,
        userId: currentUser ? currentUser.uid : null, // Add user ID if available
      });
      
      console.log("Payment saved to Firestore successfully");
    } catch (error) {
      console.error("Error saving payment to Firestore:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
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
        // router.push('/');
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
      title: "",
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

  // Title dropdown menu
  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);
  
  const selectTitle = (title: string) => {
    // Update form data directly without using selectedTitle
    setFormData({
      ...formData,
      title: title,
    });
    setTitleDropdownOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black md:p-4">
      <Card className="w-full h-full md:h-auto md:max-w-4xl rounded-none md:rounded-3xl overflow-hidden bg-gray-900 shadow-2xl flex flex-col md:flex-row border-0 relative">
          {/* Thank you message */}
          <AnimatePresence>
            {showThankYou && (
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute left-0 top-0 bottom-0 w-full md:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8 z-10"
              >
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="w-24 h-24 mx-auto mb-8 bg-amber-500 rounded-full p-4 shadow-lg shadow-amber-500/20"
                  >
                    <img src="/assets/images/main_logo.png" alt="NTF Logo" className="w-full h-full object-contain" />
                  </motion.div>
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl font-bold text-amber-500 mt-12 text-center"
                  >
                    Thanks for choosing NTF
                  </motion.h2>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-gray-300 mb-8 text-center"
                  >
                    We&apos;re excited to have you on board!
                  </motion.p>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-2xl font-semibold text-amber-500 mb-6 text-center"
                  >
                    SELECT YOUR MEMBERSHIP
                  </motion.h3>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col sm:flex-row gap-6 mx-auto max-w-2xl px-4 mb-12"
                  >                    
                    {/* Gold Tier Option */}
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 0 25px 5px rgba(245, 158, 11, 0.3)"
                      }}
                      transition={{
                        boxShadow: {
                          duration: 0.8,
                          repeat: Infinity,
                          repeatType: "reverse" 
                        }
                      }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        // Handle Gold tier selection
                        console.log("Gold tier selected");
                        setSelectedTier("gold");
                        setIsLoading(true);
                        // Process payment before navigating
                        const transactionRef = `${formData.email || 'guest'}-Gold-${Date.now()}`.substring(0, 50);
                        processPayment({ 
                          amount: "2999.00",
                          transactionReference: transactionRef,
                          bankReference: "NTF Gold Membership"
                        })
                          .then((paymentResponse) => {
                            console.log("Payment processed:", paymentResponse);
                            // Save payment data to Firestore
                            if (paymentResponse) {
                              savePaymentToFirestore(paymentResponse, transactionRef);
                            }
                            // Redirect to the payment URL if available
                            if (paymentResponse && paymentResponse.url) {
                              // Set timeout to allow user to see the loading state briefly
                              setTimeout(() => {
                                // Open the payment URL in a new tab/window
                                window.open(paymentResponse.url, '_blank');
                                setIsLoading(false);
                              }, 500);
                            } else {
                              setIsLoading(false);
                              alert("Payment processing failed: No payment URL received.");
                            }
                          })
                          .catch((error) => {
                            console.error("Payment failed:", error);
                            // Handle payment error - reset loading state
                            setIsLoading(false);
                            setSelectedTier(null);
                          });
                      }}
                      className="bg-gradient-to-b from-amber-500/30 to-amber-600/20 border border-amber-500/40 rounded-xl p-6 cursor-pointer flex-1 min-w-[120px] flex flex-col items-center shadow-lg transition-all duration-500 relative h-full"
                    >
                      <motion.div 
                        className="absolute inset-0 rounded-xl bg-amber-500/0"
                        animate={{
                          boxShadow: ["0 0 0px 0px rgba(245, 158, 11, 0)", "0 0 15px 2px rgba(245, 158, 11, 0.3)", "0 0 0px 0px rgba(245, 158, 11, 0)"]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      />
                      <div className="bg-amber-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 shadow-amber-500/40 shadow-inner">
                        {selectedTier === "gold" && isLoading ? (
                          <motion.span 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                          />
                        ) : (
                          <span className="text-black font-bold text-base sm:text-lg">G</span>
                        )}
                      </div>
                      <span className="text-amber-500 font-semibold text-xl mt-2 mb-1">Gold</span>
                      <span className="text-gray-400 text-sm mb-4">R2,999/mo</span>
                    </motion.div>
                    
                    {/* Black Tier Option */}
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ 
                        scale: 0.97,
                        boxShadow: "0 0 30px 8px rgba(245, 158, 11, 0.4)"
                      }}
                      transition={{
                        boxShadow: {
                          duration: 0.8,
                          repeat: Infinity,
                          repeatType: "reverse" 
                        }
                      }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        // Handle Black tier selection
                        console.log("Black tier selected");
                        setSelectedTier("black");
                        setIsLoading(true);
                        // Process payment before navigating
                        const transactionRef = `${formData.email || 'guest'}-Black-${Date.now()}`.substring(0, 50);
                        processPayment({ 
                          amount: "4999.00",
                          transactionReference: transactionRef,
                          bankReference: "NTF Black Membership"
                        })
                          .then((paymentResponse) => {
                            console.log("Payment processed:", paymentResponse);
                            // Save payment data to Firestore
                            if (paymentResponse) {
                              savePaymentToFirestore(paymentResponse, transactionRef);
                            }
                            // Redirect to the payment URL if available
                            if (paymentResponse && paymentResponse.url) {
                              // Set timeout to allow user to see the loading state briefly
                              setTimeout(() => {
                                // Open the payment URL in a new tab/window
                                window.open(paymentResponse.url, '_blank');
                                setIsLoading(false);
                              }, 500);
                            } else {
                              setIsLoading(false);
                              alert("Payment processing failed: No payment URL received.");
                            }
                          })
                          .catch((error) => {
                            console.error("Payment failed:", error);
                            // Handle payment error - reset loading state
                            setIsLoading(false);
                            setSelectedTier(null);
                          });
                      }}
                      className="bg-gradient-to-b from-gray-700/50 to-gray-900/50 border border-white/20 rounded-xl p-6 cursor-pointer flex-1 min-w-[120px] flex flex-col items-center shadow-lg transition-all duration-500 relative overflow-hidden h-full"
                    >
                      <motion.div 
                        className="absolute inset-0 rounded-xl bg-white/0"
                        animate={{
                          boxShadow: ["0 0 0px 0px rgba(255, 255, 255, 0)", "0 0 15px 2px rgba(255, 255, 255, 0.1)", "0 0 0px 0px rgba(255, 255, 255, 0)"]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      />
                      <div className="absolute top-0 right-0 bg-white text-[9px] sm:text-[10px] text-black font-bold py-0.5 px-2 rotate-[45deg] translate-x-[8px] translate-y-[-2px] shadow-sm">
                        POPULAR
                      </div>
                      <div className="bg-black border border-white/40 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 shadow-white/20 shadow-inner">
                        {selectedTier === "black" && isLoading ? (
                          <motion.span 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <span className="text-white font-bold text-base sm:text-lg">B</span>
                        )}
                      </div>
                      <span className="text-white font-semibold text-xl mt-2 mb-1">Black</span>
                      <span className="text-gray-400 text-sm mb-4">R4,999/mo</span>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
              className="text-amber-500 hover:text-amber-400 bg-black/20 hover:bg-black/40 rounded-full px-4 py-2 text-sm font-medium"
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
              <img src="/assets/images/white_logo.png" alt="Logo" className="w-[650px] absolute" />
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
              onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            >
              <motion.p 
                variants={itemVariants}
                className="text-amber-500 text-sm tracking-wider font-medium mb-2"
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
                className="text-gray-300 text-sm mb-6 md:mb-8"
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
              <div 
                    className="bg-amber-500 text-white text-xs font-black ml-[-12px] px-3 py-1 rounded-sm absolute z-10 mt-[-8px] cursor-pointer"
                    onClick={() => setTitleDropdownOpen(!titleDropdownOpen)}
                  >
                    <span>{formData.title || "Title"}</span>

                    {/* Title dropdown menu */}
        {titleDropdownOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute z-10 overflow-hidden shadow-lg bg-amber-500/95 rounded-sm  mt-2 ml-[-12px] border border-amber-600/40"
            style={{ width: 'fit-content', minWidth: '45px' }}
          >
            <div className="py-0.5">
              {[
                "Mr.", 
                "Mrs.", 
                "Ms.", 
                "Dr.", 
                "Prof.", 
                "Adv."
              ].map((title, index) => (
                <div
                  key={title}
                  onClick={() => selectTitle(title)}
                  className={`px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-600 cursor-pointer transition-colors ${
                    index !== 0 ? 'border-t border-amber-400/20' : ''
                  }`}
                >
                  {title}
                </div>
              ))}
            </div>
          </motion.div>
        )}
                  </div>
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
                      <div className="relative w-full sm:w-1/2 mb-4 sm:mb-0">
                        <div className="relative group h-16">
                          <Input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First name"
                            className="w-full h-full bg-black/60 backdrop-blur-sm rounded-md px-4 text-white border-0 ring-1 ring-gray-700 transition-all duration-300
                            focus:ring-2 focus:ring-amber-500 group-hover:ring-gray-600 text-base"
                            required
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/10 to-amber-500/80 opacity-0 transition-all duration-300 group-hover:opacity-100"></div>
                          {formData.firstName && (
                            <motion.div 
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <CheckCircle2 size={18} className="text-amber-500" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                      <div className="relative w-full sm:w-1/2">
                        <div className="relative group h-16">
                          <Input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last name"
                            className="w-full h-full bg-black/60 backdrop-blur-sm rounded-md px-4 text-white border-0 ring-1 ring-gray-700 transition-all duration-300
                            focus:ring-2 focus:ring-amber-500 group-hover:ring-gray-600 text-base"
                            required
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/10 to-amber-500/80 opacity-0 transition-all duration-300 group-hover:opacity-100"></div>
                          {formData.lastName && (
                            <motion.div 
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <CheckCircle2 size={18} className="text-amber-500" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email field for both forms */}
                <motion.div 
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="relative group h-16 mb-4">
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      className="w-full h-full bg-black/60 backdrop-blur-sm rounded-md px-4 text-white border-0 ring-1 ring-gray-700 transition-all duration-300
                      focus:ring-2 focus:ring-amber-500 group-hover:ring-gray-600 text-base"
                      required
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/10 to-amber-500/80 opacity-0 transition-all duration-300 group-hover:opacity-100"></div>
                    {formData.email && (
                      <motion.div 
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <Mail size={18} className="text-amber-500" />
                      </motion.div>
                    )}
                  </div>
                  {formData.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-amber-500/70 -mt-2 mb-4 ml-1"
                    >
                      We&apos;ll never share your email
                    </motion.p>
                  )}
                </motion.div>

                {/* Password field for both forms */}
                <motion.div 
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="relative group h-16">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      className="w-full h-full bg-black/60 backdrop-blur-sm rounded-md px-4 text-white border-0 ring-1 ring-amber-500/60 transition-all duration-300
                      focus:ring-2 focus:ring-amber-500 group-hover:ring-amber-400 text-base"
                      required
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/10 to-amber-500/80 opacity-0 transition-all duration-300 group-hover:opacity-100"></div>
                    {formData.password && (
                      <motion.div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={togglePasswordVisibility}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? (
                          <EyeOff size={18} className="text-amber-500" />
                        ) : (
                          <Eye size={18} className="text-amber-500" />
                        )}
                      </motion.div>
                    )}
                  </div>
                  {!isLoginForm && formData.password && (
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
                <AnimatePresence>
                  {!showThankYou && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => !loading && handleSubmit()}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-6 md:rounded-md rounded-lg shadow-md transition-all duration-300 ease-in-out cursor-pointer select-none text-center text-lg tracking-wide relative z-20"
                      style={{ opacity: loading ? 0.7 : 1 }}
                    >
                  
                  {loading ? 
                    "Loading..." : 
                    isLoginForm ? "Log in" : "Create account"
                  }
                    </motion.div>
                  )}
                </AnimatePresence>
                
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