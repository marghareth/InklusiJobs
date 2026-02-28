// app/dashboard/worker/page.js
"use client";

import { useState, useEffect } from "react";
import DashboardLayout from '@/components/dashboard/worker/DashboardLayout';
import DashboardHome from '@/components/dashboard/worker/DashboardHome';
import WelcomeWorker from '@/components/landing/WelcomeWorker';

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState("there");

  useEffect(() => {
    // Check if first visit
    const hasSeenWelcome = localStorage.getItem('worker_welcome_seen');
    
    // Get user name from localStorage (set during signup/onboarding)
    const storedName = localStorage.getItem('worker_first_name');
    if (storedName) {
      setUserName(storedName);
    }
    
    // Show welcome on first visit only
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem('worker_welcome_seen', 'true');
    }
  }, []);

  return (
    <>
      <DashboardLayout>
        <DashboardHome />
      </DashboardLayout>
      {showWelcome && (
        <WelcomeWorker 
          name={userName} 
          onClose={() => setShowWelcome(false)} 
        />
      )}
    </>
  );
}