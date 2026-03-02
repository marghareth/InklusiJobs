// lib/authHelpers.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// ── Cookie helper ─────────────────────────────────────────────────────────────
const setCookie = (name, value, days = 365) => {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
};

const clearCookie = (name) => {
  document.cookie = `${name}=; path=/; max-age=0`;
};

// ── SIGN UP ───────────────────────────────────────────────────────────────────
// role should be "worker" or "employer"
export const signUpUser = async (email, password, role = "worker") => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Save initial user document to Firestore
  await setDoc(doc(db, "users", user.uid), {
    email,
    role,
    onboardingComplete: false,
    createdAt: new Date().toISOString(),
  });

  // Set cookies so middleware can read role + onboarding status
  setCookie("ij_role", role);
  setCookie("ij_onboarded", "false");

  return user;
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Read role + onboarding status from Firestore to restore cookies
  const snap = await getDoc(doc(db, "users", user.uid));
  if (snap.exists()) {
    const data = snap.data();
    setCookie("ij_role", data.role || "worker");
    setCookie("ij_onboarded", data.onboardingComplete ? "true" : "false");
  }

  return user;
};

// ── LOGOUT ────────────────────────────────────────────────────────────────────
export const logoutUser = async () => {
  await signOut(auth);
  clearCookie("ij_role");
  clearCookie("ij_onboarded");
  clearCookie("firebase_token");
};

// ── OBSERVE AUTH STATE (use in useEffect) ────────────────────────────────────
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};