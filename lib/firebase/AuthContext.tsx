"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential
} from "firebase/auth";
import { auth } from "./config";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { setCookie, deleteCookie } from "cookies-next";

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  userTier: string | null;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkTierAccess: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState<string | null>(null);
  
  // List of tiers that have dashboard access
  const ALLOWED_TIERS = ['Gold', 'Black', 'CEO', 'Paused'];

  // Check if the user's tier gives them access to the dashboard
  async function checkTierAccess(): Promise<boolean> {
    if (!currentUser) return false;
    
    try {
      const db = getFirestore();
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const tier = data.tier || "new";
        
        // Update the userTier state
        setUserTier(tier);
        
        // Store the tier in a cookie for the middleware
        if (tier) {
          setCookie('userTier', tier, { maxAge: 60 * 60 * 24 }); // 24 hours
        }
        
        return ALLOWED_TIERS.includes(tier);
      }
      
      return false;
    } catch {
      return false;
    }
  }

  // Function to sign up with email and password
  async function signup(firstName: string, lastName: string, email: string, password: string): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with displayName (combining first and last name)
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Store session token in cookie for middleware
      const token = await userCredential.user.getIdToken();
      setCookie('session', token, { maxAge: 60 * 60 * 24 }); // 24 hours
    }
    
    return userCredential;
  }

  // Function to log in with email and password
  async function login(email: string, password: string): Promise<UserCredential> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Store session token in cookie for middleware
    if (userCredential.user) {
      const token = await userCredential.user.getIdToken();
      setCookie('session', token, { maxAge: 60 * 60 * 24 }); // 24 hours
      
      // Also check and store the user's tier
      await checkTierAccess();
    }
    
    return userCredential;
  }

  // Function to log out
  async function logout(): Promise<void> {
    // Clear cookies when logging out
    deleteCookie('session');
    deleteCookie('userTier');
    
    return signOut(auth);
  }

  // Function to reset password
  function resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email);
  }

  // Effect to listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // When auth state changes and user is logged in, update the token cookie
        const token = await user.getIdToken();
        setCookie('session', token, { maxAge: 60 * 60 * 24 }); // 24 hours
        
        // Also check and set the user's tier
        await checkTierAccess();
      } else {
        // Clear cookies when no user is detected
        deleteCookie('session');
        deleteCookie('userTier');
        setUserTier(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    userTier,
    signup,
    login,
    logout,
    resetPassword,
    checkTierAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
