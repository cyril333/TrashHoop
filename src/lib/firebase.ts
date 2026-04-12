// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDLyGXblgWcBAzwtPVIguKRNErkURm3qMg",
    authDomain: "trashhoop-726ea.firebaseapp.com",
    projectId: "trashhoop-726ea",
    storageBucket: "trashhoop-726ea.firebasestorage.app",
    messagingSenderId: "49942446403",
    appId: "1:49942446403:web:f7ff0ababccbf71e6feff6",
    measurementId: "G-BN6H244B9P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();

export default app;