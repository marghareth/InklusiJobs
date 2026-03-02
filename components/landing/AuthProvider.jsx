"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getProgress } from "@/lib/progressHelpers";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const router                = useRouter();

  useEffect(() => {
    // Handle Google redirect result (when popup was blocked)
    // ✅ Uses Firestore to decide where to redirect — not localStorage
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
        const token = await result.user.getIdToken();
        setCookie("firebase_token", token, 7);

        const savedRole = localStorage.getItem("ij_role") || "worker";
        setCookie("ij_role", savedRole, 30);

        try {
          const progress = await getProgress(result.user.uid);
          const role = progress.role || savedRole;

          if (role === "employer") {
            router.push(progress.onboarding_complete ? "/employer/dashboard" : "/employer/onboarding");
          } else {
            if (progress.onboarding_complete) {
              setCookie("ij_onboarded", "true", 30);
              router.push("/dashboard/worker");
            } else {
              router.push("/onboarding");
            }
          }
        } catch {
          router.push("/onboarding");
        }
      }
    }).catch(() => {});

    // ✅ Only keeps the token cookie fresh — NO redirects here
    // Redirects are handled by AuthModal.jsx after successful login
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setCookie("firebase_token", token, 7);
        setUser(firebaseUser);
      } else {
        deleteCookie("firebase_token");
        deleteCookie("ij_role");
        deleteCookie("ij_onboarded");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);