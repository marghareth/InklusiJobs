import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";

// SIGN UP
export const signUpUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// LOGIN
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// LOGOUT
export const logoutUser = async () => {
  await signOut(auth);
};

// OBSERVE AUTH STATE (use in useEffect)
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};