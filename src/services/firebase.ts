import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration
// IMPORTANT: Replace these with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps > Web app
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey &&
                              firebaseConfig.apiKey !== "" &&
                              firebaseConfig.projectId &&
                              firebaseConfig.projectId !== "";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Initialize Firebase only if configured
if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    if (import.meta.env.DEV) {
      console.log('✅ Firebase initialized successfully');
    }
  } catch (error) {
    console.warn('⚠️ Firebase initialization failed:', error);
  }
} else {
  if (import.meta.env.DEV) {
    console.warn('⚠️ Firebase not configured - Authentication features will be disabled');
    console.warn('To enable Firebase, create a .env file with your Firebase credentials');
  }
}

// Helper function to get db with type assertion
export function getDb(): Firestore {
  if (!db) {
    throw new Error('Firestore is not initialized. Please configure Firebase.');
  }
  return db;
}

// Helper function to get auth with type assertion
export function getAuthInstance(): Auth {
  if (!auth) {
    throw new Error('Auth is not initialized. Please configure Firebase.');
  }
  return auth;
}

export { auth, db };
export default app;
