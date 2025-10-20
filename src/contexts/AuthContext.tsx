import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
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
  loginWithFacebook: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
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

  // Signup function
  async function signup(email: string, password: string, displayName: string, phone?: string) {
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
      loyaltyPoints: 0,
      totalBookings: 0,
      createdAt: serverTimestamp()
    });

    // Load profile
    await loadUserProfile(user.uid);
  }

  // Login function
  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  // Google Login
  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    await loginWithProvider(provider);
  }

  // Facebook Login
  async function loginWithFacebook() {
    const provider = new FacebookAuthProvider();
    await loginWithProvider(provider);
  }

  // Apple Login
  async function loginWithApple() {
    const provider = new OAuthProvider('apple.com');
    await loginWithProvider(provider);
  }

  // Microsoft Login
  async function loginWithMicrosoft() {
    const provider = new OAuthProvider('microsoft.com');
    await loginWithProvider(provider);
  }

  // Generic OAuth provider login
  async function loginWithProvider(provider: GoogleAuthProvider | FacebookAuthProvider | OAuthProvider) {
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
        loyaltyPoints: 0,
        totalBookings: 0,
        createdAt: serverTimestamp()
      });
    }

    await loadUserProfile(user.uid);
  }

  // Logout function
  async function logout() {
    await signOut(auth);
    setUserProfile(null);
  }

  // Load user profile from Firestore
  async function loadUserProfile(uid: string) {
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
    if (!currentUser) return;

    await setDoc(doc(db, 'users', currentUser.uid), data, { merge: true });
    await loadUserProfile(currentUser.uid);
  }

  // Listen for auth state changes
  useEffect(() => {
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

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    loginWithGoogle,
    loginWithFacebook,
    loginWithApple,
    loginWithMicrosoft,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
