import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBru08cSrrQKzThYVMN82Pn5l5sXMEGA6w",
  authDomain: "inklusijobs-227f5.firebaseapp.com",
  projectId: "inklusijobs-227f5",
  storageBucket: "inklusijobs-227f5.firebasestorage.app",
  messagingSenderId: "414675326365",
  appId: "1:414675326365:web:cb424d76333da318f2cb74",
  measurementId: "G-V88ZRECRX6",
};

// Prevent re-initializing on hot reload in dev
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };