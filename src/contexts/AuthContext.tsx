"use client";

import * as React from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, Timestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/firebase";

// User data interface
export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  provider: "email" | "google";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Stats
  totalDonations: number;
  totalAmount: number;
  
  // Preferences
  language: "vi" | "en";
  theme: "light" | "dark" | "system";
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerification: () => Promise<void>;
  
  // User methods
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  // Create or update user document in Firestore
  const syncUserDocument = async (user: User, isNewUser: boolean = false) => {
    try {
      const userRef = doc(db, "users", user.uid);
      
      if (isNewUser) {
        // Create new user document
        const newUserData: UserData = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || user.email!.split("@")[0],
          photoURL: user.photoURL || undefined,
          emailVerified: user.emailVerified,
          provider: user.providerData[0]?.providerId === "google.com" ? "google" : "email",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          totalDonations: 0,
          totalAmount: 0,
          language: "vi",
          theme: "system",
        };
        
        await setDoc(userRef, newUserData);
        setUserData(newUserData);
      } else {
        // Update existing user
        await updateDoc(userRef, {
          emailVerified: user.emailVerified,
          photoURL: user.photoURL || null,
          displayName: user.displayName,
          updatedAt: Timestamp.now(),
        });
        await fetchUserData(user.uid);
      }
    } catch (error) {
      console.error("Failed to sync user document:", error);
    }
  };

  // Listen to auth state changes (this handles both normal login and redirect)
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        await fetchUserData(user.uid);
        
        // Auto-match donations from localStorage when user logs in
        try {
          const { getUserTransactionIds } = await import("@/lib/donation-tracker");
          const { autoMatchDonations } = await import("@/lib/donation-matcher");
          const transactionIds = getUserTransactionIds();
          
          if (transactionIds.length > 0) {
            const matched = await autoMatchDonations(user.uid, transactionIds);
            if (matched > 0) {
              console.log(`Auto-matched ${matched} donations for user ${user.uid}`);
            }
          }
        } catch (error) {
          console.error("Failed to auto-match donations:", error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle redirect result from Google sign in (for syncing user document)
  React.useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          // Check if new user and sync document
          const userDoc = await getDoc(doc(db, "users", result.user.uid));
          const isNewUser = !userDoc.exists();
          
          await syncUserDocument(result.user, isNewUser);
          // User state is already updated by onAuthStateChanged above
        }
      } catch (error: any) {
        console.error("Redirect result error:", error);
      }
    };
    
    // Small delay to ensure onAuthStateChanged fires first
    const timer = setTimeout(() => {
      handleRedirectResult();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  // Sign up with email/password
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(result.user, { displayName });
      
      // Send verification email
      await sendEmailVerification(result.user);
      
      // Create user document
      await syncUserDocument(result.user, true);
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      // Use popup for desktop (small window), redirect for mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Mobile: use redirect (better UX on mobile)
        await signInWithRedirect(auth, googleProvider);
      } else {
        // Desktop: use popup (small window)
        const result = await signInWithPopup(auth, googleProvider);
        
        // Check if new user
        const userDoc = await getDoc(doc(db, "users", result.user.uid));
        const isNewUser = !userDoc.exists();
        
        await syncUserDocument(result.user, isNewUser);
      }
    } catch (error: any) {
      console.error("Google sign in error:", error);
      
      // If popup fails on desktop, try redirect as fallback
      if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: any) {
          throw new Error(getErrorMessage(error.code || redirectError.code));
        }
      } else {
        throw new Error(getErrorMessage(error.code));
      }
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error("Failed to logout");
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Reset password error:", error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  // Send email verification
  const sendVerification = async () => {
    try {
      if (user) {
        await sendEmailVerification(user);
      }
    } catch (error: any) {
      console.error("Send verification error:", error);
      throw new Error("Failed to send verification email");
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<UserData>) => {
    try {
      if (!user) return;
      
      // Update Firebase Auth profile if displayName changed
      if (data.displayName && data.displayName !== user.displayName) {
        await updateProfile(user, {
          displayName: data.displayName,
        });
      }
      
      // Update Firestore user document
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
      
      // Refresh user data
      await fetchUserData(user.uid);
      
      // Refresh auth user to get updated displayName
      setUser({ ...user, displayName: data.displayName || user.displayName });
    } catch (error: any) {
      console.error("Update profile error:", error);
      throw new Error("Failed to update profile");
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    sendVerification,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Error message helper
function getErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "Email đã được sử dụng";
    case "auth/invalid-email":
      return "Email không hợp lệ";
    case "auth/operation-not-allowed":
      return "Không được phép";
    case "auth/weak-password":
      return "Mật khẩu quá yếu (tối thiểu 6 ký tự)";
    case "auth/user-disabled":
      return "Tài khoản đã bị vô hiệu hóa";
    case "auth/user-not-found":
      return "Không tìm thấy tài khoản";
    case "auth/wrong-password":
      return "Mật khẩu không đúng";
    case "auth/too-many-requests":
      return "Quá nhiều yêu cầu. Vui lòng thử lại sau";
    case "auth/network-request-failed":
      return "Lỗi kết nối mạng";
    case "auth/popup-closed-by-user":
      return "Popup đã bị đóng";
    default:
      return "Đã có lỗi xảy ra. Vui lòng thử lại";
  }
}

