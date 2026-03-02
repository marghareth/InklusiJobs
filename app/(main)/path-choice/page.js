"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PathChoicePage() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    try {
      const sel = JSON.parse(localStorage.getItem("inklusijobs_job_selection") || "{}");
      if (sel?.jobId) setJobTitle(sel.jobId.replace(/_/g, " "));
    } catch {}
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f4f9f8", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ width: "100%", maxWidth: 520, animation: "fadeUp 0.4s both" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", justifyContent: "center", marginBottom: "2rem" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #479880, #4B959E)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "0.85rem" }}>IJ</div>
          <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0f2421", letterSpacing: "-0.02em" }}>InklusiJobs</span>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "inline-block", padding: "0.3rem 0.9rem", background: "linear-gradient(135deg, #e8f6f2, #e4f2f5)", color: "#4B959E", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.9rem" }}>
            What's next?
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f2421", letterSpacing: "-0.02em", lineHeight: 1.25, marginBottom: "0.6rem" }}>
            How would you like to continue?
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#6b8a87", lineHeight: 1.6 }}>
            You've selected your target role{jobTitle ? ` — ` : "."}{jobTitle && <strong style={{ color: "#0f2421" }}>{jobTitle}</strong>}{jobTitle && "."}
            {" "}Choose your next step below.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>

          {/* Option A — Verify */}
          <button
            onClick={() => router.push("/verification")}
            style={{ display: "flex", alignItems: "flex-start", gap: "1.1rem", padding: "1.4rem 1.5rem", background: "white", border: "2px solid #e4ecea", borderRadius: 20, cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.2s", boxShadow: "0 2px 12px rgba(71,152,128,0.06)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#479880"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(71,152,128,0.14)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e4ecea"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(71,152,128,0.06)"; }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #e8f6f2, #e4f2f5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", flexShrink: 0 }}>🛡️</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <span style={{ fontSize: "1rem", fontWeight: 800, color: "#0f2421" }}>Get PWD Verified First</span>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(71,152,128,0.1)", color: "#479880", border: "1px solid rgba(71,152,128,0.2)" }}>Recommended</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#6b8a87", lineHeight: 1.6, marginBottom: 10 }}>
                Get a PWD Verified badge employers trust. After verification, you'll go straight to your dashboard.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {["✓ Trusted by 120+ inclusive employers", "✓ Takes 3–5 minutes", "✓ Badge visible on your profile"].map(t => (
                  <span key={t} style={{ fontSize: "0.78rem", color: "#479880", fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ color: "#479880", fontSize: "1.2rem", alignSelf: "center" }}>→</div>
          </button>

          {/* Option B — Skip to Roadmap */}
          <button
            onClick={() => router.push("/assessment")}
            style={{ display: "flex", alignItems: "flex-start", gap: "1.1rem", padding: "1.4rem 1.5rem", background: "white", border: "2px solid #e4ecea", borderRadius: 20, cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.2s", boxShadow: "0 2px 12px rgba(71,152,128,0.06)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#4B959E"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(75,149,158,0.14)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e4ecea"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(71,152,128,0.06)"; }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #e4f2f5, #eef0f8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", flexShrink: 0 }}>🗺️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f2421", marginBottom: 5 }}>Skip & Build My Roadmap</div>
              <p style={{ fontSize: "0.85rem", color: "#6b8a87", lineHeight: 1.6, marginBottom: 10 }}>
                Take a quick skills assessment, then get an AI-generated learning roadmap tailored to your target job.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {["→ Skills Assessment", "→ AI Roadmap", "→ Challenges", "→ Full Dashboard"].map(t => (
                  <span key={t} style={{ fontSize: "0.78rem", color: "#4B959E", fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ color: "#4B959E", fontSize: "1.2rem", alignSelf: "center" }}>→</div>
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.78rem", color: "#7a9b97" }}>
          You can always verify later from your dashboard.
        </p>
      </div>
    </div>
  );
}