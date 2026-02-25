"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifiedPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");

    // Signal the original tab via localStorage
    localStorage.setItem("inklusijobs:verified", status || "true");

    // Small delay so the storage event fires before we close
    setTimeout(() => {
      window.close();

      // Fallback: if window.close() is blocked (e.g. not opened by script),
      // redirect to home with the verified flag instead
      window.location.replace("/?verified=" + (status || "true"));
    }, 300);
  }, [searchParams]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0F2942 0%, #1a5f7a 45%, #6dbfb8 80%)",
        fontFamily: "sans-serif",
        color: "white",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Email Verified!
      </h1>
      <p style={{ opacity: 0.8, fontSize: 15 }}>
        This tab will close automatically. Please return to the InklusiJobs tab.
      </p>
    </div>
  );
}
