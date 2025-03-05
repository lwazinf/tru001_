"use client";

import React, { useEffect, useState, useRef } from "react";
import { Clock, Menu, ArrowRight } from "lucide-react";
import Script from "next/script";
import { useAuth } from "@/lib/firebase/AuthContext";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import {
  updatePassword,
  sendPasswordResetEmail,
  deleteUser,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { AddVehicleModal } from "@/components/dashboard/AddVehicleModal";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DeleteAccountModal } from "@/components/dashboard/DeleteAccountModal";
import { FuelTanksStatus } from "@/components/dashboard/FuelTanksStatus";
import { LoadingOverlay } from "@/components/dashboard/LoadingOverlay";
import { ProfileSection } from "@/components/dashboard/ProfileSection";
import { SecuritySection } from "@/components/dashboard/SecuritySection";
import { SuccessToast } from "@/components/dashboard/SuccessToast";
import { VehicleGrid } from "@/components/dashboard/VehicleGrid";
import { auth } from "@/lib/firebase/config";
import { processPayment } from "../utils/payment";

export default function DashPage() {
  // State variables
  const [address, setAddress] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ name: "", type: "" });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for save button
  const [isDataLoading, setIsDataLoading] = useState(true); // Loading state for initial data fetch
  const [isAuthChecking, setIsAuthChecking] = useState(true); // State to track if we're checking auth
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [mapPosition, setMapPosition] = useState<[number, number]>([
    -26.2041, 28.0473,
  ]); // Johannesburg coordinates
  const [mapZoom, setMapZoom] = useState(10);
  const [isBrowser, setIsBrowser] = useState(false); // Add this to track if we're running in browser
  const { currentUser } = useAuth();
  const router = useRouter();

  // User data state with proper type definition for Firestore timestamp
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    tier: "basic",
    tierDate: null as Timestamp | null,
    address: "",
    vehicles: [] as Array<{ name: string; type: string }>,
    tanks: {
      diesel: 0,
      petrol: { "93": 0, "95": 0 },
    },
    documents: [],
    history: { orders: [], reserves: [] },
  });

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      setIsAuthChecking(true);

      // Wait a moment to ensure auth state is properly loaded
      setTimeout(() => {
        if (!currentUser) {
          // User is not authenticated, redirect to auth page
          router.push("/auth");
        } else {
          // User is authenticated, allow access to dashboard
          setIsAuthChecking(false);
        }
      }, 1000);
    };

    checkAuth();
  }, [currentUser, router]);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser && currentUser.uid) {
        setIsDataLoading(true);
        try {
          const db = getFirestore();
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();

            // Use the Firestore Timestamp directly or set a default if missing
            const tierDateValue = data.tierDate || Timestamp.now();

            // Check if subscription has expired (more than 30 days since tierDate)
            let currentTier = data.tier || "basic";

            try {
              // If tierDate is a Firestore Timestamp, convert to JS Date for calculations
              let tierDateJS: Date;

              if (tierDateValue instanceof Timestamp) {
                tierDateJS = tierDateValue.toDate();
              } else {
                // Fallback for non-Timestamp values
                console.warn(
                  "tierDate is not a Firestore Timestamp:",
                  tierDateValue
                );
                tierDateJS = new Date(tierDateValue);
              }

              // Only proceed if we got a valid date
              if (!isNaN(tierDateJS.getTime())) {
                const now = new Date();
                const subscriptionEndDate = new Date(
                  tierDateJS.getTime() + 30 * 24 * 60 * 60 * 1000
                );

                // If subscription has expired, set tier to "Paused" and update in Firestore
                if (now > subscriptionEndDate && currentTier !== "Paused") {
                  console.log("Subscription expired, setting tier to Paused");
                  currentTier = "Paused";

                  // Update the tier in Firestore
                  try {
                    await updateDoc(userDocRef, {
                      tier: "Paused",
                    });
                    console.log("User tier updated to Paused in Firestore");
                  } catch (error) {
                    console.error("Error updating tier status:", error);
                  }
                }
              } else {
                console.warn("Invalid date from tierDate:", tierDateValue);
              }
            } catch (error) {
              console.error("Error processing tierDate:", error);
            }

            setUserData({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || "",
              phone: data.phone || "",
              tier: currentTier,
              tierDate: tierDateValue,
              address: data.address || "",
              vehicles: data.vehicles || [],
              tanks: data.tanks || {
                diesel: 0,
                petrol: { "93": 0, "95": 0 },
              },
              documents: data.documents || [],
              history: data.history || { orders: [], reserves: [] },
            });

            // Update address state to match user data
            setAddress(data.address || "");

            // If user has address with coordinates, update map
            if (data.address && window.google && window.google.maps) {
              const geocoder = new window.google.maps.Geocoder();
              geocoder.geocode({ address: data.address }, (results: any, status: any) => {
                if (
                  status === "OK" &&
                  results &&
                  results[0] &&
                  results[0].geometry
                ) {
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
            console.log("No user document found!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsDataLoading(false);
        }
      } else {
        setIsDataLoading(false);
      }
    };

    // Only fetch data if user is authenticated and auth check is complete
    if (currentUser && !isAuthChecking) {
      fetchUserData();
    }
  }, [currentUser, isAuthChecking]);

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

      // Update user's tier
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
          tier: tierSelected,
        });
      }

      console.log("Payment saved to Firestore successfully");
    } catch (error) {
      console.error("Error saving payment to Firestore:", error);
    }
  };

  // Update Firestore when user data changes
  const saveUserDataToFirestore = async () => {
    if (currentUser && currentUser.uid) {
      try {
        setLoading(true);
        const db = getFirestore();
        const userDocRef = doc(db, "users", currentUser.uid);

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
          vehicles: userData.vehicles,
        };

        // Update the document
        await updateDoc(userDocRef, updateData);

        // Handle password update if password was changed
        if (password && password.length >= 6) {
          if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
          }

          try {
            // Try to update the password directly
            await updatePassword(currentUser, password);
            console.log("Password updated successfully");

            // Clear password fields after successful save
            setPassword("");
            setConfirmPassword("");
            setPasswordStrength(0);

            // Show success toast
            setSuccessMessage("Profile and password updated successfully!");
          } catch (passwordError: any) {
            console.error("Error updating password:", passwordError);

            // If the error is due to requiring recent authentication
            if (passwordError.code === "auth/requires-recent-login") {
              // Send a password reset email instead
              await sendPasswordResetEmail(auth, userData.email);
              setSuccessMessage(
                "Profile updated. A password reset link has been sent to your email."
              );
            } else {
              throw new Error(
                `Failed to update password: ${passwordError.message}`
              );
            }
          }
        } else {
          // Only show profile update message if no password was changed
          setSuccessMessage("Profile updated successfully!");
        }

        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } catch (error) {
        console.error("Error updating user data:", error);
        setSuccessMessage(
          error instanceof Error ? error.message : "Failed to save changes"
        );
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } finally {
        setLoading(false);
      }
    } else {
      setSuccessMessage("Please log in to save changes");
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  // Initialize Google Places Autocomplete
  const initAutocomplete = () => {
    if (!window.google) {
      console.error("Google Maps not loaded");
      return;
    }

    const input = document.getElementById("location-input") as HTMLInputElement;
    if (!input) {
      console.error("Location input not found");
      return;
    }

    try {
      const options: google.maps.places.AutocompleteOptions = {
        componentRestrictions: { country: "za" }, // South Africa
        types: ["address"],
        fields: ["formatted_address", "geometry"],
      };

      const autoComplete = new window.google.maps.places.Autocomplete(
        input,
        options
      );

      autoComplete.addListener("place_changed", () => {
        setIsAddressLoading(true);
        const place = autoComplete.getPlace();

        if (place.formatted_address) {
          setAddress(place.formatted_address);
          setUserData((prev) => ({
            ...prev,
            address: place.formatted_address || "",
          }));

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
      console.log("Google Places Autocomplete initialized successfully");
    } catch (error) {
      console.error("Error initializing Google Places:", error);
    }
  };

  // Handle address change - don't geocode on every keystroke
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setUserData((prev) => ({ ...prev, address: e.target.value }));
    // Explicitly NOT geocoding here - that will happen only when autocomplete selection is made
  };

  // Handle confirm password
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  // Handle save changes
  const handleSave = () => {
    saveUserDataToFirestore();
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== "delete") {
      setSuccessMessage('Please type "delete" to confirm');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      return;
    }

    try {
      setLoading(true);

      if (currentUser && currentUser.uid) {
        const db = getFirestore();

        // First delete the user document from Firestore
        await deleteDoc(doc(db, "users", currentUser.uid));

        // Log the deletion for debugging
        console.log(
          `Deleting user data for UID: ${currentUser.uid}, Email: ${currentUser.email}`
        );

        // Then delete the user authentication account
        // This removes email, password, and all authentication data
        await deleteUser(currentUser);

        // Log the user out
        await signOut(auth);

        // Close the modal
        setShowDeleteModal(false);

        // Show success message
        setSuccessMessage("Account deleted successfully");
        setShowSuccessToast(true);

        // Redirect immediately to home page
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to delete account:", error);

      // If error is due to auth session timeout, try to sign out anyway
      if ((error as any).code === "auth/requires-recent-login") {
        try {
          // Still sign out the user even if deletion fails
          await signOut(auth);
          router.push("/");
        } catch (signOutError) {
          console.error("Error signing out:", signOutError);
        }
      }

      // Show error message
      setSuccessMessage(
        "Failed to delete account. You may need to re-authenticate first."
      );
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handler for input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for new vehicle input changes
  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({ ...prev, [name]: value }));
  };

  // Add new vehicle to user data
  const handleAddVehicle = () => {
    // Prevent paused users from adding vehicles
    if (userData.tier === "Paused") {
      setSuccessMessage(
        "This feature is for Gold & Black Members. Upgrade now."
      );
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      setShowAddVehicleModal(false);
      return;
    }

    if (!newVehicle.name.trim()) {
      setSuccessMessage("Please enter a vehicle name");
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      return;
    }

    const updatedVehicles = [...userData.vehicles, newVehicle];
    setUserData((prev) => ({ ...prev, vehicles: updatedVehicles }));

    // Close modal and reset form
    setShowAddVehicleModal(false);
    setNewVehicle({ name: "", type: "" });

    // Show success message
    setSuccessMessage("Vehicle added. Don't forget to save your changes!");
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // Add custom styles for the autocomplete dropdown
  useEffect(() => {
    // Initialize after Google Maps script is loaded
    if (window.google) {
      initAutocomplete();
    }

    const style = document.createElement("style");
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

  // Update map when address changes from outside autocomplete
  useEffect(() => {
    if (!address || !window.google || !window.google.maps) {
      // Default to Johannesburg if no address
      if (
        !address &&
        mapPosition[0] !== -26.2041 &&
        mapPosition[1] !== 28.0473
      ) {
        setMapPosition([-26.2041, 28.0473]);
        setMapZoom(10);
      }
      return;
    }
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

  // Replace the separate loading states with a more specific state
  // that tracks which tier is being processed
  const [processingTier, setProcessingTier] = useState<string | null>(null);

  // Set up the initMap callback that Google Maps will call when loaded
  useEffect(() => {
    (window as any).initMap = () => {
      initAutocomplete();
      console.log("Google Maps API loaded and initialized");
    };
    return () => {
      (window as any).initMap = () => {};
    };
  }, []);

  // Handle payment processing for membership tiers
  const handleProcessPayment = (tier: string, amount: string) => {
    // Set which tier is being processed (for UI feedback)
    setProcessingTier(tier);
    
    // Show processing message
    setSuccessMessage(`Processing ${tier} membership payment...`);
    setShowSuccessToast(true);
    
    // Create transaction reference
    const transactionRef = `${userData.email || "guest"}-${tier}-${Date.now()}`.substring(0, 50);
    
    // Process the payment
    processPayment({
      amount: amount,
      transactionReference: transactionRef,
      bankReference: `NTF ${tier} Membership`,
    })
    .then((paymentResponse) => {
      console.log("Payment processed:", paymentResponse);
      
      // Save payment data to Firestore
      if (paymentResponse) {
        savePaymentToFirestore(
          paymentResponse,
          transactionRef,
          tier.toLowerCase()
        );
      }
      
      // Redirect to the payment URL if available
      if (paymentResponse && paymentResponse.url) {
        // Set timeout to allow user to see the loading state briefly
        setTimeout(() => {
          // Open the payment URL in a new tab/window
          window.location.href = paymentResponse.url;
        }, 500);
      } else {
        setProcessingTier(null);
        setSuccessMessage("Payment processing failed: No payment URL received.");
        setShowSuccessToast(true);
      }
    })
    .catch((error) => {
      console.error("Payment failed:", error);
      // Reset loading state
      setProcessingTier(null);
      setSuccessMessage("Payment processing failed. Please try again.");
      setShowSuccessToast(true);
    });
  };

  // Add handleSignOut function after other handler functions
  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      setSuccessMessage("Failed to sign out. Please try again.");
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle vehicle deletion
  const handleDeleteVehicle = (index: number) => {
    // Create a copy of the vehicles array
    const updatedVehicles = [...userData.vehicles];
    
    // Remove the vehicle at the specified index
    updatedVehicles.splice(index, 1);
    
    // Update the state
    setUserData(prev => ({
      ...prev,
      vehicles: updatedVehicles
    }));
    
    // Show success message
    setSuccessMessage("Vehicle removed. Don't forget to save your changes!");
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // If still checking auth or loading data, show loading overlay
  if (isAuthChecking) {
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent"></div>
        <p className="ml-4 text-lg font-medium text-amber-400">
          Checking authentication...
        </p>
      </div>
    );
  }

  // If user is not authenticated, don't render anything (redirect will happen)
  if (!currentUser) {
    return null;
  }

  return (
    <>
      {/* Google Maps API Script */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&libraries=places&callback=initMap`}
        strategy="lazyOnload"
        onError={(e) => {
          console.error("Error loading Google Maps script:", e);
        }}
      />

      <div className="flex min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100">
        {/* Buffer for top navigation */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-gray-950/80 backdrop-blur-sm z-30 border-b border-gray-800/30"></div>

        {/* Loading overlay */}
        {isDataLoading && <LoadingOverlay />}

        {/* Sidebar */}
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userData={userData}
          onSignOut={handleSignOut}
        />

        {/* Mobile menu button */}
        <div className="fixed top-4 right-4 z-40 md:hidden">
          <div
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-md border border-gray-700/30 shadow-lg"
          >
            <Menu className="h-5 w-5 text-gray-300" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 mt-20 md:mt-20">
            {/* Dashboard Header */}
            <DashboardHeader onSignOut={handleSignOut} />

            {/* Success Toast */}
            {showSuccessToast && <SuccessToast message={successMessage} />}

            {/* Status Bar */}
            <div className="mb-6 flex items-center p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
              <div className="flex-1 flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${userData.tier === "Paused" ? "bg-gray-500" : "bg-amber-400"}`}></div>
                <span className="text-xs text-gray-300">Account Status:</span>
                <span className={`text-xs font-medium ${userData.tier === "Paused" ? "text-gray-400" : "text-white"}`}>
                  {userData.tier === "Paused" ? "Paused" : "Active"}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                <Clock className="h-3 w-3 inline mr-1" />
                Last updated: Today
              </div>
            </div>

            {/* Tab navigation for mobile */}
            <div className="flex mb-6 md:hidden">
              <div
                onClick={() => setActiveTab("profile")}
                className={`flex-1 text-center py-2 text-xs font-medium border-b-2 ${
                  activeTab === "profile"
                    ? "border-amber-400 text-amber-400"
                    : "border-gray-800 text-gray-400"
                }`}
              >
                Profile & Fuel Management
              </div>
              <div
                onClick={() => setActiveTab("account")}
                className={`flex-1 text-center py-2 text-xs font-medium border-b-2 ${
                  activeTab === "account"
                    ? "border-amber-400 text-amber-400"
                    : "border-gray-800 text-gray-400"
                }`}
              >
                Security
              </div>
            </div>

            {/* All sections in a column with dividers */}
            <div className="space-y-8">
              {/* Profile Section */}
              {(activeTab === "profile" || activeTab === "all") && (
                <ProfileSection
                  userData={userData}
                  handleNameChange={handleNameChange}
                  address={address}
                  handleAddressChange={handleAddressChange}
                  isAddressLoading={isAddressLoading}
                  isBrowser={isBrowser}
                  mapPosition={mapPosition}
                  mapZoom={mapZoom}
                >
                  {userData.tier === "Paused" ? (
                    // Compact membership reactivation message
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-300">
                          Vehicle Management
                        </h3>
                      </div>

                      <div className="border border-gray-800/70 rounded-lg overflow-hidden bg-gradient-to-b from-gray-900/80 to-gray-900/50 relative">
                        {/* Subtle background effect */}
                        <div className="absolute inset-0 bg-amber-500/3 bg-gradient-to-r from-amber-600/0 via-amber-500/5 to-amber-600/0 opacity-70"></div>

                        <div className="p-3.5 relative">
                          <div className="flex items-center mb-2.5">
                            <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center mr-3 border border-amber-400/20">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-amber-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-white text-sm font-medium">
                                Resume Your Membership
                              </h4>
                              <p className="text-gray-400 text-xs">
                                Reactivate to manage your vehicles again
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2.5 mt-3">
                            {/* Gold option */}
                            <div
                              onClick={() => processingTier ? null : handleProcessPayment("Gold", "2999.00")}
                              className={`flex-1 bg-gradient-to-b from-amber-500/20 to-amber-700/10 border border-amber-500/20 rounded-md p-2.5 
                                ${processingTier ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/30 transition-all duration-200'}`}
                            >
                              <div className="flex items-center">
                                <div className="flex-shrink-0 bg-amber-500 w-6 h-6 rounded-full flex items-center justify-center shadow-inner shadow-amber-700/30">
                                  {processingTier === "Gold" ? (
                                    <div className="h-3.5 w-3.5 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
                                  ) : (
                                    <span className="text-black font-bold text-xs">
                                      G
                                    </span>
                                  )}
                                </div>
                                <div className="ml-2 flex-1 min-w-0">
                                  <p className="text-amber-400 text-xs font-medium truncate">
                                    Gold
                                  </p>
                                  <p className="text-white text-xs font-bold truncate">
                                    R2,999
                                    <span className="text-gray-500 text-[9px] font-normal">
                                      /mo
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Black option */}
                            <div 
                              onClick={() => processingTier ? null : handleProcessPayment("Black", "4999.00")}
                              className={`flex-1 bg-gradient-to-b from-gray-800/80 to-gray-900/80 border border-white/10 rounded-md p-2.5 
                                relative ${processingTier ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-800/60 hover:border-white/20 transition-all duration-200'}`}
                            >
                              <div className="absolute -top-1 -right-1 bg-white px-1 py-0.5 rounded-sm shadow-sm">
                                <span className="text-black text-[7px] font-bold">
                                  BEST
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="flex-shrink-0 bg-black w-6 h-6 rounded-full flex items-center justify-center shadow-inner shadow-white/5 border border-white/20">
                                  {processingTier === "Black" ? (
                                    <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                                  ) : (
                                    <span className="text-white font-bold text-xs">
                                      B
                                    </span>
                                  )}
                                </div>
                                <div className="ml-2 flex-1 min-w-0">
                                  <p className="text-white text-xs font-medium truncate">
                                    Black
                                  </p>
                                  <p className="text-white text-xs font-bold truncate">
                                    R4,999
                                    <span className="text-gray-500 text-[9px] font-normal">
                                      /mo
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div
                              onClick={() => processingTier ? null : router.push('/auth?action=reactivate')}
                              className={`w-full py-2 ${processingTier !== null
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                                : "bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-gray-900 cursor-pointer"
                              } text-xs font-medium rounded transition-all duration-300 flex items-center justify-center`}
                            >
                              {processingTier !== null ? (
                                <span className="flex items-center">
                                  <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-500 border-t-transparent animate-spin mr-2"></div>
                                  Processing {processingTier}...
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  Welcome Back
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Normal vehicle grid for active users
                    <VehicleGrid
                      vehicles={userData.vehicles}
                      onAddVehicle={() => setShowAddVehicleModal(true)}
                      tier={userData.tier}
                      onDeleteVehicle={handleDeleteVehicle}
                    />
                  )}
                  <FuelTanksStatus
                    tanks={userData.tanks}
                    tier={userData.tier}
                  />
                </ProfileSection>
              )}

              {/* Divider with improved spacing */}
              {activeTab === "all" && (
                <div className="border-t border-gray-800/70 pt-2"></div>
              )}

              {/* Account Section */}
              {(activeTab === "account" || activeTab === "all") && (
                <SecuritySection
                  userData={userData}
                  password={password}
                  confirmPassword={confirmPassword}
                  passwordStrength={passwordStrength}
                  setPassword={setPassword}
                  setPasswordStrength={setPasswordStrength}
                  handleConfirmPasswordChange={handleConfirmPasswordChange}
                  onDeleteAccount={() => setShowDeleteModal(true)}
                />
              )}
            </div>

            {/* Modals */}
            {showDeleteModal && (
              <DeleteAccountModal
                deleteConfirmation={deleteConfirmation}
                setDeleteConfirmation={setDeleteConfirmation}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
              />
            )}

            {showAddVehicleModal && (
              <AddVehicleModal
                newVehicle={newVehicle}
                handleVehicleChange={handleVehicleChange}
                onClose={() => setShowAddVehicleModal(false)}
                onAdd={handleAddVehicle}
              />
            )}

            {/* Footer with actions */}
            <div className="flex justify-end items-center space-x-3 mt-8 pt-4 border-t border-gray-800/70">
              <div className="text-xs text-gray-500 mr-auto hidden md:block">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 inline" />
                  <span>Last saved: Just now</span>
                </div>
              </div>
              <div className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-md text-xs font-medium text-gray-300 transition-colors duration-150 cursor-pointer">
                Cancel
              </div>
              <div
                onClick={loading ? undefined : handleSave}
                className={`px-4 py-2 ${
                  loading
                    ? "bg-amber-600/50"
                    : "bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500"
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
