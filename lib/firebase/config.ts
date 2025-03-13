// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcqXTRMPDzTfTZ1P88bAvXHt-RBeCNQvE",
  authDomain: "tru001-c96b3.firebaseapp.com",
  projectId: "tru001-c96b3",
  storageBucket: "tru001-c96b3.firebasestorage.app",
  messagingSenderId: "330023364100",
  appId: "1:330023364100:web:148f3f505efd7b889c3751"
};

// Export the Firebase config
export { firebaseConfig };

// Initialize Firebase only if it hasn't been initialized already
let firebaseApp;
let firebaseAuth;
let firestoreDb;

try {
  // Check if Firebase has already been initialized
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }
  
  firebaseAuth = getAuth(firebaseApp);
  firestoreDb = getFirestore(firebaseApp);
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Initialize with empty app in case of error to prevent crashes
  firebaseApp = {} as any;
  firebaseAuth = {} as any;
  firestoreDb = {} as any;
}

export const app = firebaseApp;
export const auth = firebaseAuth;
export const db = firestoreDb;
