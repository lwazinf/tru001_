import {
  faArrowRight,
  faCheckCircle,
  faStar,
  faGem,
  faShieldAlt,
  faCrown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Eye, EyeOff, CheckCircle2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { processPayment } from "@/app/utils/payment";
import { useAuth } from "@/lib/firebase/AuthContext";
import { doc, setDoc, getFirestore, Timestamp, updateDoc, getDoc } from "firebase/firestore";

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

const cardBounceTransition = {
  type: "spring",
  stiffness: 400,
  damping: 25
};

const staggerChildren = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: {
      type: "tween",
      duration: 0.2
    }
  }
};

const Pricing_ = () => {
  const y = useMotionValue(0);
  const yRange = useTransform(y, [0, 2.5], [0, 100]);
  const [focusedCard, setFocusedCard] = useState<"gold" | "black" | null>(null);
  const pricingSectionRef = useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  
  // Auth context with error handling
  const [authContextLoaded, setAuthContextLoaded] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  let authContext;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    authContext = useAuth();
    if (!authContextLoaded) setAuthContextLoaded(true);
  } catch {
    if (!authError) {
      setAuthError("Authentication system is initializing");
    }
  }

  const { currentUser } = authContext || {
    currentUser: null,
  };
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    title: "",
  });
  
  // State for field-specific validation errors
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    title: "",
  });
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Clear field-specific error when user types
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: "",
      });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGetStarted = (cardType: "gold" | "black") => {
    setFocusedCard(cardType);
  };

  const handleResetFocus = () => {
    setIsExiting(true);
    setTimeout(() => {
      setFocusedCard(null);
      setIsExiting(false);
      
      // Scroll back to the pricing section when exiting focus mode
      setTimeout(() => {
        pricingSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }, 400); // Match the exit animation duration
  };
  
  // Function to save payment response to Firestore
  const savePaymentToFirestore = async (
    paymentResponse: any,
    transactionRef: string,
    tierSelected: string
  ) => {
    try {
      const db = getFirestore();
      const now = new Date();

      // Create the payment document
      await setDoc(doc(db, "Payments", paymentResponse.paymentRequestId), {
        paymentRequestId: paymentResponse.paymentRequestId,
        transactionReference: transactionRef,
        timestamp: now,
        userId: currentUser ? currentUser.uid : null, // Add user ID if available
        tier: tierSelected,
      });

      // Update user's tier if logged in
      if (currentUser && !authError) {
        const userDocRef = doc(db, "users", currentUser.uid);
        // Check if the user document exists first
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          // Update existing user document
          await updateDoc(userDocRef, {
            tier: tierSelected === "gold" ? "Gold" : "Black",
          });
        } else {
          // Create new user document if it doesn't exist
          await setDoc(userDocRef, {
            tier: tierSelected === "gold" ? "Gold" : "Black",
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            title: formData.title,
            since: Timestamp.now(),
          });
        }
      } else {
        // Save tier choice in localStorage for non-logged in users
        localStorage.setItem('selectedTier', tierSelected);
        localStorage.setItem('userFormData', JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          title: formData.title,
        }));
      }

    } catch {
    }
  };
  
  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    const errors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      title: "",
    };

    // Basic validation for firstName
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
      isValid = false;
    }

    // Basic validation for lastName
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
      isValid = false;
    }
    
    // Basic validation for title
    if (!formData.title) {
      errors.title = "Please select a title";
      isValid = false;
    }

    // Basic validation for email
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
      isValid = false;
    }

    // Basic validation for password
    if (!formData.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };
  
  // Handle form submission with payment processing
  const handleSubmit = (tier: "gold" | "black") => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      // If user is not logged in or there's an auth error, store the selection and redirect to auth
      if (!currentUser || authError) {
        // Store tier choice and form data in localStorage
        localStorage.setItem('selectedTier', tier);
        localStorage.setItem('pricingFormData', JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          title: formData.title
        }));
        
        // Redirect to auth page with tier parameter
        window.location.href = `/auth?tier=${tier}`;
        return;
      }
      
      // Process payment
      const transactionRef = `${formData.email || "guest"}-${tier.charAt(0).toUpperCase() + tier.slice(1)}-${Date.now()}`.substring(0, 50);
      const amount = tier === "gold" ? "2999.00" : "4999.00";
      const bankReference = `NTF ${tier.charAt(0).toUpperCase() + tier.slice(1)} Membership`;
      
      processPayment({
        amount,
        transactionReference: transactionRef,
        bankReference
      })
        .then((paymentResponse) => {
          
          // Save payment data to Firestore
          if (paymentResponse) {
            savePaymentToFirestore(paymentResponse, transactionRef, tier);
          }
          
          // Redirect to payment URL
          if (paymentResponse && paymentResponse.url) {
            // Set timeout to allow user to see the loading state briefly
            setTimeout(() => {
              window.location.href = paymentResponse.url;
              setIsSubmitting(false);
            }, 500);
          } else {
            setIsSubmitting(false);
            alert("Payment processing failed: No payment URL received.");
          }
        })
        .catch((error) => {
          // Handle payment error - reset loading state
          setIsSubmitting(false);
          alert(`Payment processing failed: ${error.message || "Unknown error"}`);
        });
    }
  };

  return (
    <div
      className={`w-full xl:h-[90vh] min-h-screen flex flex-col justify-center items-center top_fade py-20 relative overflow-hidden`}
      ref={pricingSectionRef}
    >
      {/* Overlay for when a card is focused */}
      <AnimatePresence>
        {focusedCard && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center"
            onClick={handleResetFocus}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div 
              className="absolute top-6 right-6 text-white/80 hover:text-white cursor-pointer z-50"
              onClick={handleResetFocus}
              initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
              transition={springTransition}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
            </motion.div>
            
            {/* Centered card container */}
            <motion.div 
              className="relative z-50 w-[350px] h-auto max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1.1, y: 0 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ 
                ...springTransition,
                exit: { duration: 0.3 } 
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {focusedCard === "gold" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full rounded-2xl flex flex-col justify-between items-center relative overflow-hidden border border-amber-500/50 backdrop-blur-none bg-gradient-to-b from-black to-black/95`}
                  style={{ 
                    boxShadow: "0 10px 50px -10px rgba(245, 158, 11, 0.5), 0 0 30px 0px rgba(245, 158, 11, 0.2) inset"
                  }}
                >
                  <motion.div 
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0"
                    animate={{ 
                      scaleX: [1, 1.2, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Gold header */}
                  <motion.div 
                    className="w-full pt-10 pb-6 px-8 relative"
                    variants={staggerChildren}
                    initial="hidden"
                    animate={isExiting ? "exit" : "show"}
                  >
                    <motion.div 
                      className="absolute top-5 right-8"
                      variants={itemVariant}
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <FontAwesomeIcon
                        icon={faGem}
                        className="text-amber-500 h-5 w-5"
                      />
                    </motion.div>
                    <motion.span 
                      variants={itemVariant}
                      className="bg-amber-500/20 text-amber-500 text-[10px] tracking-wider font-bold px-3 py-1 rounded-full inline-block"
                    >
                      GOLD TIER
                    </motion.span>
                    <motion.h3 
                      variants={itemVariant}
                      className="text-white text-2xl font-bold mt-3"
                    >
                      Premium
                    </motion.h3>
                    <motion.div 
                      variants={itemVariant}
                      className="flex items-baseline mt-2"
                    >
                      <span className="text-white text-3xl font-bold">R2,999</span>
                      <span className="text-white/60 ml-1 text-sm">/month</span>
                    </motion.div>
                    <motion.p 
                      variants={itemVariant}
                      className="text-white/60 text-xs mt-3 leading-relaxed"
                    >
                      For businesses that need quality service and dedicated support
                    </motion.p>
                  </motion.div>
                  
                  {/* Divider */}
                  <motion.div 
                    className="w-full h-px mb-4 bg-gradient-to-r from-amber-500/0 via-amber-500/40 to-amber-500/0"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  />
                  
                  {/* Auth Form Section */}
                  <motion.div
                    className="w-full px-8 mb-4"
                    variants={staggerChildren}
                    initial="hidden"
                    animate={isExiting ? "exit" : "show"}
                  >
                    <motion.div variants={itemVariant} className="space-y-4">
                      {/* First name and Last name */}
                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                        <div className="relative w-full sm:w-1/2">
                          <div className={`relative group ${fieldErrors.firstName ? "mb-5" : ""}`}>
                            <Input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="First name"
                              className={`w-full bg-black/60 backdrop-blur-sm rounded-md px-4 py-3 text-white border-0 ring-1 ${
                                fieldErrors.firstName ? "ring-red-500" : "ring-gray-700"
                              } transition-all duration-300 focus:ring-2 focus:ring-amber-500 text-sm`}
                              required
                            />
                            {fieldErrors.firstName && (
                              <motion.div
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -bottom-5 left-0 flex items-center text-red-400 text-xs"
                              >
                                <AlertTriangle size={12} className="mr-1" />
                                <span>{fieldErrors.firstName}</span>
                              </motion.div>
                            )}
                            {formData.firstName && !fieldErrors.firstName && (
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
                          <div className={`relative group ${fieldErrors.lastName ? "mb-5" : ""}`}>
                            <Input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Last name"
                              className={`w-full bg-black/60 backdrop-blur-sm rounded-md px-4 py-3 text-white border-0 ring-1 ${
                                fieldErrors.lastName ? "ring-red-500" : "ring-gray-700"
                              } transition-all duration-300 focus:ring-2 focus:ring-amber-500 text-sm`}
                              required
                            />
                            {fieldErrors.lastName && (
                              <motion.div
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -bottom-5 left-0 flex items-center text-red-400 text-xs"
                              >
                                <AlertTriangle size={12} className="mr-1" />
                                <span>{fieldErrors.lastName}</span>
                              </motion.div>
                            )}
                            {formData.lastName && !fieldErrors.lastName && (
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
                      </div>
                      
                      {/* Title dropdown */}
                      <div className="relative mb-4">
                        <div className={`relative group ${fieldErrors.title ? "mb-5" : ""}`}>
                          <select
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={`w-full bg-black/60 backdrop-blur-sm rounded-md px-4 py-3 text-white border-0 ring-1 ${
                              fieldErrors.title ? "ring-red-500" : "ring-gray-700"
                            } transition-all duration-300 focus:ring-2 focus:ring-amber-500 text-sm appearance-none`}
                            required
                          >
                            <option value="" disabled>Select title</option>
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                            <option value="Dr">Dr</option>
                            <option value="Prof">Prof</option>
                            <option value="Other">Other</option>
                          </select>
                          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="12" 
                              height="12" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              className="text-amber-500"
                            >
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                          {fieldErrors.title && (
                            <motion.div
                              initial={{ opacity: 0, y: 3 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute -bottom-5 left-0 flex items-center text-red-400 text-xs"
                            >
                              <AlertTriangle size={12} className="mr-1" />
                              <span>{fieldErrors.title}</span>
                            </motion.div>
                          )}
                          {formData.title && !fieldErrors.title && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                              className="absolute right-10 top-1/2 transform -translate-y-1/2"
                            >
                              <CheckCircle2 size={16} className="text-amber-500" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                      
                      {/* Email field */}
                      <div className="relative mb-4">
                        <div className={`relative group ${fieldErrors.email ? "mb-5" : ""}`}>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email address"
                            className={`w-full bg-black/60 backdrop-blur-sm rounded-md px-4 py-3 text-white border-0 ring-1 ${
                              fieldErrors.email ? "ring-red-500" : "ring-gray-700"
                            } transition-all duration-300 focus:ring-2 focus:ring-amber-500 text-sm`}
                            required
                          />
                          {fieldErrors.email && (
                            <motion.div
                              initial={{ opacity: 0, y: 3 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute -bottom-5 left-0 flex items-center text-red-400 text-xs"
                            >
                              <AlertTriangle size={12} className="mr-1" />
                              <span>{fieldErrors.email}</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                      
                      {/* Password field */}
                      <div className="relative mb-4">
                        <div className={`relative group ${fieldErrors.password ? "mb-5" : ""}`}>
                          <Input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Password"
                            className={`w-full bg-black/60 backdrop-blur-sm rounded-md px-4 py-3 text-white border-0 ring-1 ${
                              fieldErrors.password ? "ring-red-500" : "ring-amber-500/60"
                            } transition-all duration-300 focus:ring-2 focus:ring-amber-500 text-sm`}
                            required
                          />
                          {fieldErrors.password && (
                            <motion.div
                              initial={{ opacity: 0, y: 3 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute -bottom-5 left-0 flex items-center text-red-400 text-xs"
                            >
                              <AlertTriangle size={12} className="mr-1" />
                              <span>{fieldErrors.password}</span>
                            </motion.div>
                          )}
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
                            <div className="flex gap-1">
                              <div
                                className={`h-1 w-full rounded-full ${
                                  formData.password.length > 3 ? "bg-amber-500" : "bg-gray-600"
                                }`}
                              ></div>
                              <div
                                className={`h-1 w-full rounded-full ${
                                  formData.password.length > 5 ? "bg-amber-500" : "bg-gray-600"
                                }`}
                              ></div>
                              <div
                                className={`h-1 w-full rounded-full ${
                                  formData.password.length > 7 ? "bg-amber-500" : "bg-gray-600"
                                }`}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {formData.password.length < 4
                                ? "Weak password"
                                : formData.password.length < 6
                                ? "Fair password"
                                : formData.password.length < 8
                                ? "Good password"
                                : "Strong password"}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                  
                  {/* CTA */}
                  <motion.div 
                    className="w-full px-8 pb-10 mt-auto"
                    variants={staggerChildren}
                    initial="hidden"
                    animate={isExiting ? "exit" : "show"}
                  >
                    <motion.div 
                      variants={itemVariant}
                      className="flex items-center justify-between mb-5"
                    >
                      <span className="text-amber-500/80 text-[10px] italic">Limited to 50 members</span>
                    </motion.div>
                    <motion.div
                      variants={itemVariant}
                      onClick={() => !isSubmitting && handleSubmit("gold")}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs flex items-center justify-center cursor-pointer group hover:brightness-110 transition-all"
                      whileHover={{ y: -3 }}
                      whileTap={{ y: 1 }}
                    >
                      {isSubmitting ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          Buy Now
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity,
                              repeatType: "loop",
                              ease: "easeInOut",
                              times: [0, 0.6, 1]
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faArrowRight}
                              className="ml-2 h-2.5 w-2.5 group-hover:translate-x-1 transition-transform"
                            />
                          </motion.div>
                        </>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
              
              {focusedCard === "black" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full rounded-2xl flex flex-col justify-between items-center relative overflow-hidden border border-white/30 backdrop-blur-none bg-gradient-to-b from-black to-black/95`}
                  style={{ 
                    boxShadow: "0 10px 50px -10px rgba(255, 255, 255, 0.3), 0 0 30px 0px rgba(255, 255, 255, 0.1) inset"
                  }}
                >
                  {/* Popular badge removed from focused view */}
                  
                  <motion.div 
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/0 via-white/80 to-white/0"
                    animate={{ 
                      scaleX: [1, 1.2, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Black header */}
                  <motion.div 
                    className="w-full pt-10 pb-6 px-8 relative"
                    variants={staggerChildren}
                    initial="hidden"
                    animate={isExiting ? "exit" : "show"}
                  >
                    <motion.div 
                      className="absolute top-5 right-8"
                      variants={itemVariant}
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <FontAwesomeIcon
                        icon={faCrown}
                        className="text-white h-5 w-5"
                      />
                    </motion.div>
                    <motion.span 
                      variants={itemVariant}
                      className="bg-white/20 text-white text-[10px] tracking-wider font-bold px-3 py-1 rounded-full inline-block"
                    >
                      BLACK TIER
                    </motion.span>
                    <motion.h3 
                      variants={itemVariant}
                      className="text-white text-2xl font-bold mt-3"
                    >
                      Executive
                    </motion.h3>
                    <motion.div 
                      variants={itemVariant}
                      className="flex items-baseline mt-2"
                    >
                      <span className="text-white text-3xl font-bold">R4,999</span>
                      <span className="text-white/60 ml-1 text-sm">/month</span>
                    </motion.div>
                    <motion.p 
                      variants={itemVariant}
                      className="text-white/60 text-xs mt-3 leading-relaxed"
                    >
                      For demanding executives who need premium service and priority
                    </motion.p>
                  </motion.div>
                  
                  {/* Divider */}
                  <motion.div 
                    className="w-full h-px mb-4 bg-gradient-to-r from-white/0 via-white/40 to-white/0"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  />
                  
                  {/* Auth Form Section */}
                  <motion.div
                    className="w-full px-8 mb-4"
                    variants={staggerChildren}
                    initial="hidden"
                    animate={isExiting ? "exit" : "show"}
                  >
                    <motion.div variants={itemVariant} className="space-y-4">
                      {/* First name and Last name */}
                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                        <div className="relative w-full sm:w-1/2">
                          <div className={`relative group ${fieldErrors.firstName ? "mb-5" : ""}`}>
                            <Input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="First name"
                              className={`w-full bg-black/60 backdrop-blur-sm rounded-md px-4 py-3 text-white border-0 ring-1 ${
                                fieldErrors.firstName ? "ring-red-500" : "ring-gray-700"
                              } transition-all duration-300 focus:ring-2 focus:ring-white text-sm`}
                              required
                            />
                            {fieldErrors.firstName && (
                              <motion.div
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -bottom-5 left-0 flex items-center text-red-400 text-xs"
                              >
                                <AlertTriangle size={12} className="mr-1" />
                                <span>{fieldErrors.firstName}</span>
                              </motion.div>
                            )}
                            {formData.firstName && !fieldErrors.firstName && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              >
                                <CheckCircle2 size={16} className="text-white" />
                              </motion.div>
                            )}
                          </div>
                        </div>
                        <div className="relative w-full sm:w-1/2">
                          <div className={`relative group ${fieldErrors.lastName ? "mb-5" : ""}`}>
                            <Input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Last name"
                              className={`w-full bg-black/60 backdrop-blur-sm rounded-md px-4 py-3 text-white border-0 ring-1 ${
                                fieldErrors.lastName ? "ring-red-500" : "ring-gray-700"
                              } transition-all duration-300 focus:ring-2 focus:ring-white text-sm`}
                              required
                            />
                            {fieldErrors.lastName && (
                              <motion.div
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -bottom-5 left-0 flex items-center text-red-400 text-xs"
                              >
                                <AlertTriangle size={12} className="mr-1" />
                                <span>{fieldErrors.lastName}</span>
                              </motion.div>
                            )}
                            {formData.lastName && !fieldErrors.lastName && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              >
                                <CheckCircle2 size={16} className="text-white" />
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Title dropdown */}
                      <div className="relative mb-4">
                        <div className={`relative group ${fieldErrors.title ? "mb-5" : ""}`}>
                          <select
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={`w-full bg-black/60 backdrop-blur-sm rounded-md px-4 py-3 text-white border-0 ring-1 ${
                              fieldErrors.title ? "ring-red-500" : "ring-gray-700"
                            } transition-all duration-300 focus:ring-2 focus:ring-white text-sm appearance-none`}
                            required
                          >
                            <option value="" disabled>Select title</option>
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                            <option value="Dr">Dr</option>
                            <option value="Prof">Prof</option>
                            <option value="Other">Other</option>
                          </select>
                          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="12" 
                              height="12" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              className="text-white"
                            >
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                          {fieldErrors.title && (
                            <motion.div
                              initial={{ opacity: 0, y: 3 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute -bottom-5 left-0 flex items-center text-red-400 text-xs"
                            >
                              <AlertTriangle size={12} className="mr-1" />
                              <span>{fieldErrors.title}</span>
                            </motion.div>
                          )}
                          {formData.title && !fieldErrors.title && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                              className="absolute right-10 top-1/2 transform -translate-y-1/2"
                            >
                              <CheckCircle2 size={16} className="text-white" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                      
                      {/* Email field */}
                      <div className="relative mb-4">
                        <div className={`relative group ${fieldErrors.email ? "mb-5" : ""}`}>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email address"
                            className={`w-full bg-black/60 backdrop-blur-sm rounded-md px-4 py-3 text-white border-0 ring-1 ${
                              fieldErrors.email ? "ring-red-500" : "ring-gray-700"
                            } transition-all duration-300 focus:ring-2 focus:ring-white text-sm`}
                            required
                          />
                          {fieldErrors.email && (
                            <motion.div
                              initial={{ opacity: 0, y: 3 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute -bottom-5 left-0 flex items-center text-red-400 text-xs"
                            >
                              <AlertTriangle size={12} className="mr-1" />
                              <span>{fieldErrors.email}</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                      
                      {/* Password field */}
                      <div className="relative mb-4">
                        <div className={`relative group ${fieldErrors.password ? "mb-5" : ""}`}>
                          <Input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Password"
                            className={`w-full bg-black/60 backdrop-blur-sm rounded-md px-4 py-3 text-white border-0 ring-1 ${
                              fieldErrors.password ? "ring-red-500" : "ring-white/60"
                            } transition-all duration-300 focus:ring-2 focus:ring-white text-sm`}
                            required
                          />
                          {fieldErrors.password && (
                            <motion.div
                              initial={{ opacity: 0, y: 3 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute -bottom-5 left-0 flex items-center text-red-400 text-xs"
                            >
                              <AlertTriangle size={12} className="mr-1" />
                              <span>{fieldErrors.password}</span>
                            </motion.div>
                          )}
                          {formData.password && (
                            <motion.div
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                              onClick={togglePasswordVisibility}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {showPassword ? (
                                <EyeOff size={16} className="text-white" />
                              ) : (
                                <Eye size={16} className="text-white" />
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
                            <div className="flex gap-1">
                              <div
                                className={`h-1 w-full rounded-full ${
                                  formData.password.length > 3 ? "bg-white" : "bg-gray-600"
                                }`}
                              ></div>
                              <div
                                className={`h-1 w-full rounded-full ${
                                  formData.password.length > 5 ? "bg-white" : "bg-gray-600"
                                }`}
                              ></div>
                              <div
                                className={`h-1 w-full rounded-full ${
                                  formData.password.length > 7 ? "bg-white" : "bg-gray-600"
                                }`}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {formData.password.length < 4
                                ? "Weak password"
                                : formData.password.length < 6
                                ? "Fair password"
                                : formData.password.length < 8
                                ? "Good password"
                                : "Strong password"}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                  
                  {/* CTA */}
                  <motion.div 
                    className="w-full px-8 pb-10 mt-auto"
                    variants={staggerChildren}
                    initial="hidden"
                    animate={isExiting ? "exit" : "show"}
                  >
                    <motion.div 
                      variants={itemVariant}
                      className="flex items-center justify-between mb-5"
                    >
                      <span className="text-white/80 text-[10px] italic">Limited to 50 members</span>
                    </motion.div>
                    <motion.div
                      variants={itemVariant}
                      onClick={() => !isSubmitting && handleSubmit("black")}
                      className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center group cursor-pointer hover:brightness-110 transition-all"
                      whileHover={{ y: -3 }}
                      whileTap={{ y: 1 }}
                    >
                      {isSubmitting ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          Buy Now
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity,
                              repeatType: "loop",
                              ease: "easeInOut",
                              times: [0, 0.6, 1]
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faArrowRight}
                              className="ml-2 h-2.5 w-2.5 group-hover:translate-x-1 transition-transform"
                            />
                          </motion.div>
                        </>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`w-full min-h-2 flex flex-col mt-[30px] mb-[60px] justify-center items-center transition-opacity duration-500 ${focusedCard ? 'opacity-0' : 'opacity-100'}`}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`text-amber-400 text-[16px] uppercase tracking-widest font-bold mb-2`}
        >
          Choose Your Experience
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`text-white text-[50px] tinos-regular-italic text-center font-black`}
        >
          Exclusive Memberships
        </motion.h2>
      </div>
      <motion.div
        className={`flex xl:flex-row flex-col justify-center items-center w-full min-h-2 mb-2 gap-8 transition-opacity duration-500 ${focusedCard ? 'opacity-0' : 'opacity-100'}`}
        style={{ y: yRange }}
      >
        {/* Gold Tier */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={!focusedCard ? { 
            y: -10, 
            rotateY: 5,
            rotateX: -5,
            scale: 1.02,
            transition: { duration: 0.3, type: "spring" } 
          } : {}}
          className={`min-h-[500px] w-[350px] m-2 rounded-2xl flex flex-col justify-start items-center relative overflow-hidden border border-amber-500/20 backdrop-blur-sm bg-gradient-to-b from-amber-500/10 to-black/40 transition-all duration-500`}
          style={{ 
            boxShadow: "0 10px 40px -10px rgba(245, 158, 11, 0.3), 0 0 20px 0px rgba(245, 158, 11, 0.1) inset"
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0"></div>
          
          {/* Gold header */}
          <div className="w-full pt-8 pb-4 px-6 relative">
            <div className="absolute top-4 right-4">
              <FontAwesomeIcon
                icon={faGem}
                className="text-amber-500 h-6 w-6"
              />
            </div>
            <span className="bg-amber-500/10 text-amber-500 text-xs font-bold px-3 py-1 rounded-full">GOLD TIER</span>
            <h3 className="text-white text-3xl font-bold mt-2">Premium</h3>
            <div className="flex items-baseline mt-1">
              <span className="text-white text-4xl font-bold">R2,999</span>
              <span className="text-white/60 ml-1">/month</span>
            </div>
            <p className="text-white/60 text-sm mt-2">For businesses that need quality service and dedicated support</p>
          </div>
          
          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-amber-500/0 via-amber-500/30 to-amber-500/0"></div>
          
          {/* Features */}
          <div className="w-full px-6 py-6 flex-1">
            <ul className="space-y-3">
              {[
                "2 vehicles allocated for fuel delivery",
                "On-demand & scheduled fuel delivery",
                "Purchase fuel at fuel station prices",
              ].map((feature, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="flex items-start"
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-amber-500 h-4 w-4 mt-0.5 mr-3 flex-shrink-0"
                  />
                  <span className="text-white/80 text-sm">{feature}</span>
                </motion.li>
              ))}
            </ul>
            
            {/* Bonus section */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/10">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon
                  icon={faShieldAlt}
                  className="text-amber-500 h-4 w-4 mr-2"
                />
                <h4 className="text-amber-400 font-bold text-sm">FREE PACKAGE BONUS</h4>
              </div>
              <ul className="space-y-2">
                {[
                  "4 Royal Valet washes (Valued at R2,600)",
                  "Save 50% on all additional washes",
                ].map((bonus, idx) => (
                  <li key={idx} className="flex items-start">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-amber-500 h-3 w-3 mt-1 mr-2 flex-shrink-0"
                    />
                    <span className="text-amber-100/80 text-xs">{bonus}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* CTA */}
          <div className="w-full px-6 pb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-amber-500/80 text-xs italic">Limited to 50 members</span>
            </div>
            <motion.div
              onClick={() => handleGetStarted("gold")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm flex items-center justify-center cursor-pointer group"
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ y: 1, scale: 0.98 }}
              transition={cardBounceTransition}
            >
              Get Started
              <FontAwesomeIcon
                icon={faArrowRight}
                className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform"
              />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Black Tier */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={!focusedCard ? { 
            y: -10, 
            rotateY: 5,
            rotateX: -5,
            scale: 1.02,
            transition: { duration: 0.3, type: "spring" } 
          } : {}}
          className={`min-h-[520px] w-[350px] m-2 rounded-2xl flex flex-col justify-start items-center relative overflow-hidden border border-white/10 backdrop-blur-sm bg-gradient-to-b from-white/10 to-black/60 z-10 transition-all duration-500`}
          style={{ 
            boxShadow: "0 10px 50px -10px rgba(0, 0, 0, 0.8), 0 0 30px 0px rgba(255, 255, 255, 0.05) inset"
          }}
        >
          {/* Popular badge */}
          <div className="absolute -right-12 top-8 bg-white text-black text-xs font-bold py-1 px-10 transform rotate-45 z-20">
            MOST POPULAR
          </div>
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/0 via-white/80 to-white/0"></div>
          
          {/* Black header */}
          <div className="w-full pt-8 pb-4 px-6 relative">
            <div className="absolute top-4 right-4">
              <FontAwesomeIcon
                icon={faCrown}
                className="text-white h-6 w-6"
              />
            </div>
            <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full">BLACK TIER</span>
            <h3 className="text-white text-3xl font-bold mt-2">Executive</h3>
            <div className="flex items-baseline mt-1">
              <span className="text-white text-4xl font-bold">R4,999</span>
              <span className="text-white/60 ml-1">/month</span>
            </div>
            <p className="text-white/60 text-sm mt-2">For demanding executives who need premium service and priority</p>
          </div>
          
          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-white/0 via-white/30 to-white/0"></div>
          
          {/* Features */}
          <div className="w-full px-6 py-6 flex-1">
            <ul className="space-y-3">
              {[
                "4 vehicles allocated for fuel delivery",
                "On-demand & scheduled fuel delivery",
                "Purchase fuel at fuel station prices",
                "Priority servicing & dedicated support"
              ].map((feature, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="flex items-start"
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-white h-4 w-4 mt-0.5 mr-3 flex-shrink-0"
                  />
                  <span className="text-white/80 text-sm">{feature}</span>
                </motion.li>
              ))}
            </ul>
            
            {/* Bonus section */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-white/20 to-white/5 border border-white/10">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon
                  icon={faShieldAlt}
                  className="text-white h-4 w-4 mr-2"
                />
                <h4 className="text-white font-bold text-sm">FREE PACKAGE BONUS</h4>
              </div>
              <ul className="space-y-2">
                {[
                  "8 Royal Valet washes (Valued at R5,200)",
                  "Save 50% on all additional washes",
                  "Exclusive event invitations"
                ].map((bonus, idx) => (
                  <li key={idx} className="flex items-start">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-white h-3 w-3 mt-1 mr-2 flex-shrink-0"
                    />
                    <span className="text-white/80 text-xs">{bonus}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* CTA */}
          <div className="w-full px-6 pb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/80 text-xs italic">Limited to 50 members</span>
            </div>
            <motion.div
              onClick={() => handleGetStarted("black")}
              className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm flex items-center justify-center group cursor-pointer"
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ y: 1, scale: 0.98 }}
              transition={cardBounceTransition}
            >
              Get Started
              <FontAwesomeIcon
                icon={faArrowRight}
                className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform"
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Pricing_;

// // // // // // //
// // // // // // //
// ElegantTicketGuarantee Component (for future implementation)

// const ElegantTicketGuarantee = () => {
//   return (
//     <div className="max-w-md mx-auto rounded-xl overflow-hidden shadow-lg bg-gradient-to-r from-amber-500/10 to-amber-600/10 p-6 border border-amber-500/20">
//       <div className="flex items-center mb-4">
//         <FontAwesomeIcon icon={faShieldAlt} className="text-amber-500 h-5 w-5 mr-3" />
//         <h3 className="text-xl font-bold text-white">Our Guarantee</h3>
//       </div>
//       <p className="text-white/70 mb-4 text-sm">
//         We stand behind our service with a 100% satisfaction guarantee. If you're not completely satisfied, we'll make it right.
//       </p>
//     </div>
//   );
// };
