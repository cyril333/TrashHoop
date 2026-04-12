// src/app/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { User, UserRole } from '../../types';
import toast from 'react-hot-toast';

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
  barangay: string;
  role: 'resident' | 'collector';
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  isEmailVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const demoUsers: Record<string, User> = {
  "juan@example.com": {
    uid: "juan-mock-uid",
    email: "juan@example.com",
    fullName: "Juan Dela Cruz",
    phone: "09123456789",
    address: "123 Main St",
    barangay: "Lahug",
    role: "resident",
    creditScore: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  "pedro@example.com": {
    uid: "pedro-mock-uid",
    email: "pedro@example.com",
    fullName: "Pedro Santos",
    phone: "09123456789",
    address: "456 Collection St",
    barangay: "Apas",
    role: "collector",
    creditScore: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  "ramon@example.com": {
    uid: "ramon-mock-uid",
    email: "ramon@example.com",
    fullName: "Ramon Dela Cruz",
    phone: "09123456790",
    address: "North District",
    barangay: "Lahug",
    role: "collector",
    creditScore: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  "jose@example.com": {
    uid: "jose-mock-uid",
    email: "jose@example.com",
    fullName: "Jose Reyes",
    phone: "09123456791",
    address: "East District",
    barangay: "Capitol Site",
    role: "collector",
    creditScore: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  "miguel@example.com": {
    uid: "miguel-mock-uid",
    email: "miguel@example.com",
    fullName: "Miguel Garcia",
    phone: "09123456792",
    address: "West District",
    barangay: "Kamputhaw",
    role: "collector",
    creditScore: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  "admin@trashhoop.com": {
    uid: "admin-mock-uid",
    email: "admin@trashhoop.com",
    fullName: "Admin User",
    phone: "09123456789",
    address: "Barangay Hall",
    barangay: "Capitol Site",
    role: "admin",
    creditScore: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (uid: string): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { uid, ...userDoc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userData = await fetchUserData(fbUser.uid);
        setUser(userData);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    // Demo login bypass
    if (demoUsers[email] && password === "password123") {
      const mockUser = demoUsers[email];
      setUser(mockUser);
      localStorage.setItem('trashhoop_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        toast.error('Please verify your email before logging in. Check your inbox.');
        await signOut(auth);
        throw new Error('Email not verified');
      }

      const userData = await fetchUserData(userCredential.user.uid);
      if (!userData) throw new Error('User data not found');

      if (userData.status === 'suspended') {
        await signOut(auth);
        throw new Error('Your account has been suspended. Please contact the barangay office.');
      }

      setUser(userData);
      localStorage.setItem('trashhoop_user', JSON.stringify(userData));
      toast.success('Welcome back!');
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const { user: fbUser } = userCredential;

      await updateProfile(fbUser, { displayName: data.fullName });

      // Send verification email
      await sendEmailVerification(fbUser);
      toast.success('Verification email sent! Please check your inbox.');

      const userData: Omit<User, 'uid'> = {
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        barangay: data.barangay,
        role: data.role,
        creditScore: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
      };

      await setDoc(doc(db, 'users', fbUser.uid), userData);

      // Don't auto-login - require email verification
      await signOut(auth);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    if (!firebaseUser) throw new Error('No authenticated user');
    try {
      await sendEmailVerification(firebaseUser);
      toast.success('Verification email sent! Check your inbox.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Failed to send reset email');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('trashhoop_user');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!firebaseUser) throw new Error('No authenticated user');
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, { ...data, updatedAt: new Date() });
      setUser(prev => prev ? { ...prev, ...data } : null);
      toast.success('Profile updated!');
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        login,
        register,
        logout,
        updateUserProfile,
        sendVerificationEmail,
        resetPassword,
        isLoading,
        isAuthenticated: !!user,
        userRole: user?.role || null,
        isEmailVerified: firebaseUser?.emailVerified || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};