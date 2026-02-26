"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import BasicInformation from "@/components/landing/BasicInformation";
import WelcomeWorker from "@/components/landing/WelcomeWorker";
import WelcomeEmployer from "@/components/landing/WelcomeEmployer";

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("basic-info"); // "basic-info" | "welcome"
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        // Not logged in — back to home
        router.replace("/");
        return;
      }
      setUser(user);
      setUserData({
        first_name: user.user_metadata?.first_name || "there",
        role: user.user_metadata?.role || "worker",
      });
      setLoading(false);
    });
  }, [router]);

  const handleBasicInfoComplete = (savedData) => {
    setUserData((prev) => ({ ...prev, ...savedData }));
    setStep("welcome");
  };

  const handleWelcomeClose = () => {
    const destination =
      userData?.role === "employer" ? "/employer/dashboard" : "/dashboard/worker";
    router.push(destination);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F2942 0%, #1a5f7a 45%, #6dbfb8 80%)",
        }}
      >
        <div style={{ color: "white", fontSize: 18, fontFamily: "sans-serif" }}>
          Loading…
        </div>
      </div>
    );
  }

  if (step === "welcome") {
    return userData?.role === "employer" ? (
      <WelcomeEmployer name={userData.first_name} onClose={handleWelcomeClose} />
    ) : (
      <WelcomeWorker name={userData.first_name} onClose={handleWelcomeClose} />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "linear-gradient(135deg, #0F2942 0%, #1a5f7a 45%, #6dbfb8 80%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(15,28,27,0.40)",
        }}
      >
        <BasicInformation
          initialData={{ firstName: userData?.first_name || "" }}
          onSubmit={handleBasicInfoComplete}
        />
      </div>
    </div>
  );
}