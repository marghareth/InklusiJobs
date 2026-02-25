"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const logoutCurrentDevice = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("inklusijobs_employer");
        localStorage.removeItem("inklusijobs_a11y_prefs");
        sessionStorage.clear();
      }
      router.replace("/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }, [router]);

  const logoutAllDevices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
      router.replace("/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }, [router]);

  return { logoutCurrentDevice, logoutAllDevices, loading, error };
}