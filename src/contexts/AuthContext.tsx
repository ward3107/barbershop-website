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
  sendPasswordResetEmail,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';

// Helper function to get user-friendly error messages
export function getAuthErrorMessage(error: any, language: string = 'en'): string {
  const errorCode = error?.code || '';

  const errorMessages: Record<string, Record<string, string>> = {
    'auth/email-already-in-use': {
      en: 'This email is already registered. Please login or use a different email.',
      ar: 'هذا البريد الإلكتروني مسجل بالفعل. الرجاء تسجيل الدخول أو استخدام بريد إلكتروني مختلف.',
      he: 'אימייל זה כבר רשום. אנא התחבר או השתמש באימייל אחר.'
    },
    'auth/weak-password': {
      en: 'Password is too weak. Please use at least 6 characters.',
      ar: 'كلمة المرور ضعيفة جداً. الرجاء استخدام 6 أحرف على الأقل.',
      he: 'הסיסמה חלשה מדי. אנא השתמש לפחות ב-6 תווים.'
    },
    'auth/invalid-email': {
      en: 'Invalid email address. Please check and try again.',
      ar: 'عنوان البريد الإلكتروني غير صالح. الرجاء التحقق والمحاولة مرة أخرى.',
      he: 'כתובת אימייל לא חוקית. אנא בדוק ונסה שוב.'
    },
    'auth/user-not-found': {
      en: 'No account found with this email. Please sign up first.',
      ar: 'لم يتم العثور على حساب بهذا البريد الإلكتروني. الرجاء التسجيل أولاً.',
      he: 'לא נמצא חשבון עם אימייל זה. אנא הירשם תחילה.'
    },
    'auth/wrong-password': {
      en: 'Incorrect password. Please try again.',
      ar: 'كلمة المرور غير صحيحة. الرجاء المحاولة مرة أخرى.',
      he: 'סיסמה שגויה. אנא נסה שוב.'
    },
    'auth/invalid-credential': {
      en: 'Invalid email or password. Please check your credentials.',
      ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة. الرجاء التحقق من بياناتك.',
      he: 'אימייל או סיסמה שגויים. אנא בדוק את פרטי ההתחברות שלך.'
    },
    'auth/too-many-requests': {
      en: 'Too many failed attempts. Please try again later.',
      ar: 'محاولات فاشلة كثيرة جداً. الرجاء المحاولة لاحقاً.',
      he: 'יותר מדי ניסיונות כושלים. אנא נסה שוב מאוחר יותר.'
    },
    'auth/network-request-failed': {
      en: 'Network error. Please check your connection and try again.',
      ar: 'خطأ في الشبكة. الرجاء التحقق من الاتصال والمحاولة مرة أخرى.',
      he: 'שגיאת רשת. אנא בדוק את החיבור שלך ונסה שוב.'
    },
    'auth/popup-closed-by-user': {
      en: 'Sign-in popup was closed. Please try again.',
      ar: 'تم إغلاق نافذة تسجيل الدخول. الرجاء المحاولة مرة أخرى.',
      he: 'חלון ההתחברות נסגר. אנא נסה שוב.'
    },
    'auth/user-disabled': {
      en: 'This account has been disabled. Please contact support.',
      ar: 'تم تعطيل هذا الحساب. الرجاء الاتصال بالدعم.',
      he: 'חשבון זה הושבת. אנא צור קשר עם התמיכה.'
    },
    'auth/requires-recent-login': {
      en: 'Please log in again to complete this action.',
      ar: 'الرجاء تسجيل الدخول مرة أخرى لإكمال هذا الإجراء.',
      he: 'אנא התחבר שוב כדי להשלים פעולה זו.'
    }
  };

  // Get the error message for the specific error code and language
  const message = errorMessages[errorCode]?.[language];

  // If no specific message found, return a generic error
  if (!message) {
    const genericMessages: Record<string, string> = {
      en: 'An error occurred. Please try again.',
      ar: 'حدث خطأ. الرجاء المحاولة مرة أخرى.',
      he: 'אירעה שגיאה. אנא נסה שוב.'
    };
    return genericMessages[language] || genericMessages.en;
  }

  return message;
}

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  isAdmin: boolean;
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
      isAdmin: false, // By default, users are not admins
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
        isAdmin: false, // By default, OAuth users are not admins
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

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
