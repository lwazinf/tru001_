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

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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

  // Function to sign up with email and password
  async function signup(firstName: string, lastName: string, email: string, password: string): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with displayName (combining first and last name)
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });
    }
    
    return userCredential;
  }

  // Function to log in with email and password
  function login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Function to log out
  function logout(): Promise<void> {
    return signOut(auth);
  }

  // Function to reset password
  function resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email);
  }

  // Effect to listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
