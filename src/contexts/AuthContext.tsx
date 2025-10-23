import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';
import type { UserRole } from '@/types';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  role?: UserRole;
  isAdmin: boolean; // Deprecated: use role instead
  isOwner?: boolean; // New field for owner role
  loyaltyPoints: number;
  totalBookings: number;
  createdAt: any;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string, phone?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  // Role checking helpers
  isAdmin: () => boolean;
  isOwner: () => boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if Firebase is available
  const isFirebaseAvailable = auth !== null && db !== null;

  // Signup function
  async function signup(email: string, password: string, displayName: string, phone?: string) {
    if (!isFirebaseAvailable || !auth || !db) {
      throw new Error('Firebase is not configured. Please set up Firebase credentials.');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName });

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      phone: phone || '',
      role: 'user' as UserRole, // Default role
      isAdmin: false, // Legacy field
      isOwner: false,
      loyaltyPoints: 0,
      totalBookings: 0,
      createdAt: serverTimestamp()
    });

    // Load profile
    await loadUserProfile(user.uid);
  }

  // Login function
  async function login(email: string, password: string) {
    if (!isFirebaseAvailable || !auth) {
      throw new Error('Firebase is not configured. Please set up Firebase credentials.');
    }
    await signInWithEmailAndPassword(auth, email, password);
  }

  // Google Login
  async function loginWithGoogle() {
    if (!isFirebaseAvailable || !auth || !db) {
      throw new Error('Firebase is not configured. Please set up Firebase credentials.');
    }
    const provider = new GoogleAuthProvider();

    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user profile exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      // Create new profile for OAuth user
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        phone: '',
        role: 'user' as UserRole, // Default role
        isAdmin: false, // Legacy field
        isOwner: false,
        loyaltyPoints: 0,
        totalBookings: 0,
        createdAt: serverTimestamp()
      });
    }

    await loadUserProfile(user.uid);
  }

  // Logout function
  async function logout() {
    if (!isFirebaseAvailable || !auth) {
      throw new Error('Firebase is not configured. Please set up Firebase credentials.');
    }
    await signOut(auth);
    setUserProfile(null);
  }

  // Reset password function
  async function resetPassword(email: string) {
    if (!isFirebaseAvailable || !auth) {
      throw new Error('Firebase is not configured. Please set up Firebase credentials.');
    }
    await sendPasswordResetEmail(auth, email);
  }

  // Load user profile from Firestore
  async function loadUserProfile(uid: string) {
    if (!isFirebaseAvailable || !db) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  // Update user profile
  async function updateUserProfile(data: Partial<UserProfile>) {
    if (!isFirebaseAvailable || !db || !currentUser) return;

    await setDoc(doc(db, 'users', currentUser.uid), data, { merge: true });
    await loadUserProfile(currentUser.uid);
  }

  // Listen for auth state changes
  useEffect(() => {
    if (!isFirebaseAvailable || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Role checking helpers
  const isAdmin = (): boolean => {
    if (!userProfile) return false;
    return userProfile.role === 'admin' || userProfile.isAdmin === true;
  };

  const isOwner = (): boolean => {
    if (!userProfile) return false;
    return userProfile.role === 'owner' || userProfile.isOwner === true;
  };

  const hasRole = (role: UserRole): boolean => {
    if (!userProfile) return false;
    return userProfile.role === role;
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    isAdmin,
    isOwner,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
