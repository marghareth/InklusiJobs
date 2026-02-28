"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const router                = useRouter();

  useEffect(() => {
    // Handle Google redirect result (when popup was blocked)
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        // User just came back from Google redirect — route them
        const savedRole = localStorage.getItem("ij_role") || "worker";
        if (savedRole === "employer") {
          router.push("/employer/dashboard");
        } else {
          router.push("/dashboard/worker");
        }
      }
    }).catch(() => {});

    // Always listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
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

// Custom hook — use this anywhere to get current user
export const useAuth = () => useContext(AuthContext);