// app/dashboard/worker/page.js
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardLayout from '@/components/dashboard/worker/DashboardLayout';
import WelcomeWorker from '@/components/landing/WelcomeWorker';

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function checkFirstVisit() {
      // Check if first visit using localStorage
      const hasSeenWelcome = localStorage.getItem('worker_welcome_seen');
      
      // Get user's name from Supabase
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .single();
        
        setUserName(profile?.first_name || "there");
      }
      
      // Show welcome on first visit
      if (!hasSeenWelcome) {
        setShowWelcome(true);
        localStorage.setItem('worker_welcome_seen', 'true');
      }
    }
    
    checkFirstVisit();
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