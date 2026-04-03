import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            || "AIzaSyBru08cSrrQKzThYVMN82Pn5l5sXMEGA6w",
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        || "inklusijobs-227f5.firebaseapp.com",
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         || "inklusijobs-227f5",
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     || "inklusijobs-227f5.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "414675326365",
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             || "1:414675326365:web:cb424d76333da318f2cb74",
  measurementId:     "G-V88ZRECRX6",
};

// Prevent re-initializing on hot reload in dev
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app); // ← Firestore added

export { app, auth, db };