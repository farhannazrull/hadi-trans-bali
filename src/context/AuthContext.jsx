'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, googleProvider, storage } from '../config/firebase';

const AuthContext = createContext();

// Guest data expiration time (7 days in milliseconds)
const GUEST_DATA_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [guestId, setGuestId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear guest data
  const clearGuestData = () => {
    localStorage.removeItem('guestSession');
    localStorage.removeItem('guestProfile');
    localStorage.removeItem('guestBookings');
    setGuestId(null);
    setIsGuest(false);
  };

  // Generate or retrieve guest ID (called only from effects/callbacks)
  const getOrCreateGuestId = () => {
    const stored = localStorage.getItem('guestSession');
    if (stored) {
      const session = JSON.parse(stored);
      // Check if guest session is still valid
      if (Date.now() - session.createdAt < GUEST_DATA_EXPIRY) {
        return session.guestId;
      } else {
        // Session expired, clean up
        clearGuestData();
      }
    }
    
    // Create new guest session
    const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guestSession', JSON.stringify({
      guestId: newGuestId,
      createdAt: Date.now()
    }));
    return newGuestId;
  };

  // Get guest session expiry info
  const getGuestExpiryInfo = () => {
    const stored = localStorage.getItem('guestSession');
    if (stored) {
      const session = JSON.parse(stored);
      const now = Date.now();
      const expiresAt = session.createdAt + GUEST_DATA_EXPIRY;
      const remainingTime = expiresAt - now;
      const remainingDays = Math.ceil(remainingTime / (24 * 60 * 60 * 1000));
      return {
        expiresAt: new Date(expiresAt),
        remainingDays: Math.max(0, remainingDays),
        isExpired: remainingTime <= 0
      };
    }
    return null;
  };

  // Continue as guest
  const continueAsGuest = () => {
    const gId = getOrCreateGuestId();
    setGuestId(gId);
    setIsGuest(true);
    setUser(null);
    return gId;
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in Firestore, if not create profile
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Create new user profile
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          phone: '',
          whatsapp: '',
          preferredLanguage: 'id'
        });
      } else {
        // Update last login
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
      }

      // If was guest, migrate data
      if (isGuest) {
        await migrateGuestDataToUser(user.uid, user.email);
      }

      setIsGuest(false);
      setGuestId(null);
      // Don't clear session yet until migration finishes inside function
      
      return user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError(error.message);
      throw error;
    }
  };

  // Migrate guest data to logged in user
  const migrateGuestDataToUser = async (uid, email) => {
    try {
      console.log("Migration: Starting for user", uid);
      // Migrate guest profile data
      const guestProfile = localStorage.getItem('guestProfile');
      if (guestProfile) {
        const profileData = JSON.parse(guestProfile);
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, {
          phone: profileData.phone || '',
          whatsapp: profileData.whatsapp || '',
          preferredLanguage: profileData.preferredLanguage || 'id'
        }, { merge: true });
      }

      // Migrate guest bookings FROM LOCALSTORAGE
      const guestBookings = localStorage.getItem('guestBookings');
      if (guestBookings) {
        const localBookings = JSON.parse(guestBookings);
        for (const booking of localBookings) {
          const bookingRef = doc(db, 'bookings', booking.reference);
          await setDoc(bookingRef, {
            userId: uid,
            userEmail: email,
            migratedFromGuest: true,
            updatedAt: serverTimestamp()
          }, { merge: true });
        }
      }
      
      console.log("Migration: Completed.");
      clearGuestData();
    } catch (error) {
      console.error('Error migrating guest data:', error);
    }
  };

  // Sign out
  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
      setIsGuest(false);
      setGuestId(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error.message);
      throw error;
    }
  };

  // Get current user profile from Firestore
  const getUserProfile = useCallback(async () => {
    if (!user) return null;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }, [user]);

  // Update user profile
  const updateUserProfile = useCallback(async (data) => {
    if (!user) return false;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }, [user]);

  // Upload and change profile picture
  const uploadProfilePicture = useCallback(async (file) => {
    if (!user) return null;

    try {
      const fileRef = ref(storage, `users/${user.uid}/profile_${Date.now()}`);
      
      // 1. Upload to Storage
      await uploadBytes(fileRef, file);
      
      // 2. Get Download URL
      const photoURL = await getDownloadURL(fileRef);
      
      // 3. Update Firebase Auth Profile
      await updateProfile(auth.currentUser, { photoURL });
      
      // 4. Update Firestore Profile
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { photoURL, updatedAt: serverTimestamp() }, { merge: true });
      
      // Update local state to reflect change immediately
      setUser({ ...auth.currentUser });
      
      return photoURL;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }, [user]);

  // Listen to auth state changes
  useEffect(() => {
    let authResolved = false;
    
    // Timeout fallback: if auth doesn't resolve in 5 seconds, stop loading
    const timeout = setTimeout(() => {
      if (!authResolved) {
        console.warn('Auth state check timed out, proceeding without auth');
        setLoading(false);
      }
    }, 5000);
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      authResolved = true;
      clearTimeout(timeout);
      
      if (currentUser) {
        setUser(currentUser);
        setIsGuest(false);
        setGuestId(null);
      } else {
        setUser(null);
        // Check for existing guest session
        const stored = localStorage.getItem('guestSession');
        if (stored) {
          const session = JSON.parse(stored);
          if (Date.now() - session.createdAt < GUEST_DATA_EXPIRY) {
            setGuestId(session.guestId);
            setIsGuest(true);
          } else {
            clearGuestData();
          }
        }
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    isGuest,
    guestId,
    loading,
    error,
    isAuthenticated: !!user,
    isLoggedIn: !!user,
    signInWithGoogle,
    logout,
    continueAsGuest,
    clearGuestData,
    getGuestExpiryInfo,
    getUserProfile,
    updateUserProfile,
    uploadProfilePicture,
    migrateGuestDataToUser,
    GUEST_DATA_EXPIRY_DAYS: 7
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
