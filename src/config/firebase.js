// Firebase configuration
// Replace these with your actual Firebase project credentials
// You can get these from Firebase Console > Project Settings > Your apps

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAUxwocMgTpUGkKQb398TUYLwtKy_w2l9Y",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hadi-trans-bali.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hadi-trans-bali",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hadi-trans-bali.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "100473246059",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:100473246059:web:9dba1e87a440d11d19fc2e",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-6CZGHKVKZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with settings for better stability
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false
});

// Initialize other services
export const auth = getAuth(app);
export const storage = getStorage(app);

// Persistence disabled temporarily to fix potential sync hang
/*
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).then(() => {
    console.log("Firestore persistence enabled");
  }).catch((err) => {
    // ...
  });
}
*/

export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
