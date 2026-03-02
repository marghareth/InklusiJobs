// app/dashboard/worker/page.js
"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { getProgress } from "@/lib/progressHelpers";
import { onAuthStateChanged } from "firebase/auth";
import DashboardLayout from '@/components/dashboard/worker/DashboardLayout';
import WelcomeWorker from '@/components/landing/WelcomeWorker';

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName]       = useState("");

  useEffect(() => {
    // Wait for Firebase auth to be ready
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        // ✅ Pull profile from Firestore
        const progress = await getProgress(user.uid);

        const firstName =
          progress?.basicInfo?.firstName ||   // saved during onboarding
          user.displayName?.split(" ")[0] ||  // saved during Google sign-up
          "there";

        // ✅ Sync to localStorage so DashboardHome.jsx can read it instantly
        localStorage.setItem("worker_first_name", firstName);
        if (progress?.basicInfo?.lastName) {
          localStorage.setItem("worker_last_name", progress.basicInfo.lastName);
        }
        if (progress?.basicInfo) {
          localStorage.setItem("worker_profile", JSON.stringify(progress.basicInfo));
        }

        setUserName(firstName);

      } catch (err) {
        console.warn("Could not load profile from Firestore:", err);
        // Fall back to whatever is in localStorage
        const fallback = localStorage.getItem("worker_first_name");
        setUserName(fallback || user.displayName?.split(" ")[0] || "there");
      }

      // Show welcome screen on first visit
      const hasSeenWelcome = localStorage.getItem("worker_welcome_seen");
      if (!hasSeenWelcome) {
        setShowWelcome(true);
        localStorage.setItem("worker_welcome_seen", "true");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <DashboardLayout />
      {showWelcome && (
        <WelcomeWorker
          name={userName}
          onClose={() => setShowWelcome(false)}
        />
      )}
    </>
  );
}