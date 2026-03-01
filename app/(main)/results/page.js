"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function loadResults() {
  try {
    const r = localStorage.getItem("inklusijobs_results");
    return r ? JSON.parse(r) : null;
  } catch { return null; }
}

function getScoreColor(score) {
  if (score >= 80) return { bar: "#479880", text: "#2d6b5e", bg: "#f0faf7" };
  if (score >= 65) return { bar: "#648FBF", text: "#2d4f7a", bg: "#f0f5fb" };
  if (score >= 50) return { bar: "#e09c50", text: "#7a4f1a", bg: "#fdf5eb" };
  return { bar: "#c47a7a", text: "#7a2d2d", bg: "#fdf0f0" };
}

function getQualificationConfig(scoring) {
  if (scoring.qualified) {
    return {
      emoji: "🎉", badge: "Qualified", badgeColor: "#479880", badgeBg: "#f0faf7", badgeBorder: "#c8e8df",
      headline: "You're ready for this role!",
      subtext: `Your score of ${scoring.overallScore}% meets the requirement for ${scoring.jobTitle}.`,
      ctaLabel: "Go to Dashboard →", ctaRoute: "/dashboard/worker", needsRoadmap: false,
    };
  }
  if (scoring.qualificationLevel === "nearly_ready") {
    return {
      emoji: "💪", badge: "Almost There", badgeColor: "#648FBF", badgeBg: "#f0f5fb", badgeBorder: "#c5d9f0",
      headline: "You're very close!",
      subtext: `Your score of ${scoring.overallScore}% is just below the ${scoring.passingThreshold}% threshold. A focused roadmap will get you there fast.`,
      ctaLabel: "Build My Roadmap →", ctaRoute: "/roadmap", needsRoadmap: true,
    };
  }
  return {
    emoji: "🌱", badge: "Keep Growing", badgeColor: "#8891C9", badgeBg: "#f0f0fb", badgeBorder: "#c5c8e8",
    headline: "Let's build your skills first.",
    subtext: `Your score of ${scoring.overallScore}% shows you have real potential. Your personalised roadmap will close these gaps step by step.`,
    ctaLabel: "Build My Roadmap →", ctaRoute: "/roadmap", needsRoadmap: true,
  };
}

function ScoreRing({ score, qualified, size = 140 }) {
  const [animated, setAnimated] = useState(false);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = animated ? (score / 100) * circumference : 0;
  const color = qualified ? "#479880" : score >= 65 ? "#648FBF" : "#8891C9";
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 300); return () => clearTimeout(t); }, []);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e8f0ef" strokeWidth="10" />
        <circle cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          transform="rotate(-90 60 60)" style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
        <text x="60" y="55" textAnchor="middle" fill="#0f2421" fontSize="22" fontWeight="800" fontFamily="'Plus Jakarta Sans', sans-serif">{animated ? score : 0}%</text>
        <text x="60" y="72" textAnchor="middle" fill="#7a9b97" fontSize="9.5" fontWeight="600" fontFamily="'Plus Jakarta Sans', sans-serif" letterSpacing="0.04em">OVERALL</text>
      </svg>
    </div>
  );
}

function SkillBar({ skillScore, index }) {
  const [animated, setAnimated] = useState(false);
  const colors = getScoreColor(skillScore.score);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 400 + index * 120); return () => clearTimeout(t); }, [index]);
  return (
    <div style={{ opacity: 0, animation: `fadeSlideUp 0.4s ease ${0.1 + index * 0.08}s forwards` }}>
      <style>{`@keyframes fadeSlideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
        <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1a2e2b" }}>{skillScore.skill}</span>
        <span style={{ fontSize: "0.88rem", fontWeight: 700, color: colors.text }}>{skillScore.score}%</span>
      </div>
      <div style={{ height: 8, background: "#eef4f2", borderRadius: 999, overflow: "visible", position: "relative", marginBottom: "0.45rem" }}>
        <div style={{ height: "100%", borderRadius: 999, background: colors.bar, width: animated ? `${skillScore.score}%` : "0%", transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
        <div style={{ position: "absolute", top: -3, left: "65%", width: 2, height: 14, background: "#c5d9d6", borderRadius: 1 }} />
      </div>
      <p style={{ fontSize: "0.78rem", color: "#6b8a87", lineHeight: 1.5, fontStyle: "italic" }}>{skillScore.feedback}</p>
    </div>
  );
}

// ── Verification Choice Screen ─────────────────────────────────────────────────
// This appears AFTER results, BEFORE going to roadmap or dashboard
function VerificationChoice({ firstName, nextRoute, onSkip, onVerify }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f4f9f8", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🛡️</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f2421", marginBottom: 8, lineHeight: 1.3 }}>
            Want to get your PWD badge, {firstName || "there"}?
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#4a6360", lineHeight: 1.7, margin: 0 }}>
            Verified PWD professionals get more trust from employers and stand out in job applications. It only takes 3–5 minutes.
          </p>
        </div>

        {/* Perks of verifying */}
        <div style={{ background: "white", borderRadius: 20, border: "1px solid #eef4f2", padding: "1.5rem", marginBottom: "1rem", boxShadow: "0 4px 20px rgba(71,152,128,0.08)" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#479880", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>✨ With the PWD Verified Badge</div>
          {[
            { icon: "✅", text: "Employers see a Verified PWD badge on your profile" },
            { icon: "📈", text: "Up to 3x more profile views from inclusive employers" },
            { icon: "🤝", text: "Access to exclusive PWD-friendly job opportunities" },
            { icon: "🏅", text: "Stand out in a competitive job market" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: "0.88rem", color: "#2d5f55", lineHeight: 1.5 }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Without badge */}
        <div style={{ background: "#fdf5eb", borderRadius: 14, border: "1px solid #fde68a", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.82rem", color: "#92400E", lineHeight: 1.6 }}>
            ⚠️ <strong>Without verification:</strong> You can still use InklusiJobs and apply to jobs, but employers won't see the verified badge on your profile.
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={onVerify}
            style={{ width: "100%", padding: "15px", borderRadius: 14, fontSize: "1rem", fontWeight: 700, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #0F5C6E, #0A3D4A)", color: "white", boxShadow: "0 4px 20px rgba(15,92,110,0.35)", letterSpacing: "0.02em" }}
          >
            Get Verified Now → (3–5 mins)
          </button>
          <button
            onClick={onSkip}
            style={{ width: "100%", padding: "13px", borderRadius: 14, fontSize: "0.9rem", fontWeight: 600, border: "1.5px solid #e4ecea", cursor: "pointer", background: "white", color: "#4a6360" }}
          >
            Skip for now, {nextRoute === "/roadmap" ? "go to my roadmap →" : "go to my dashboard →"}
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#94A3B8", marginTop: "1rem", lineHeight: 1.6 }}>
          You can always get verified later from your dashboard settings.
        </p>
      </div>
    </div>
  );
}

// ── Main Results Page ──────────────────────────────────────────────────────────
export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults]               = useState(null);
  const [revealed, setRevealed]             = useState(false);
  // "results" | "verification-choice" 
  const [screen, setScreen]                 = useState("results");

  const firstName = typeof window !== "undefined" ? localStorage.getItem("worker_first_name") || "" : "";

  useEffect(() => {
    const data = loadResults();
    if (!data?.scoring) { router.replace("/job-select"); return; }
    setResults(data);
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, [router]);

  if (!results) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f9f8" }}>
        <div style={{ width: 48, height: 48, border: "4px solid #e8f0ef", borderTopColor: "#479880", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const { scoring, job } = results;
  const config = getQualificationConfig(scoring);

  // ── Show verification choice screen ──
  if (screen === "verification-choice") {
    return (
      <VerificationChoice
        firstName={firstName}
        nextRoute={config.ctaRoute}
        onVerify={() => {
          // Save where to go after verification
          localStorage.setItem("post_verification_route", config.ctaRoute);
          router.push("/verification");
        }}
        onSkip={() => {
          // Skip verification, go directly to their next step
          if (config.needsRoadmap) {
            localStorage.setItem("inklusijobs_scoring", JSON.stringify(scoring));
            localStorage.setItem("inklusijobs_job_for_roadmap", JSON.stringify(job));
            router.push("/roadmap");
          } else {
            router.push("/dashboard/worker");
          }
        }}
      />
    );
  }

  // ── Show results screen ──
  const handleCTA = () => {
    if (config.needsRoadmap) {
      localStorage.setItem("inklusijobs_scoring", JSON.stringify(scoring));
      localStorage.setItem("inklusijobs_job_for_roadmap", JSON.stringify(job));
    }
    // Always show verification choice before moving on
    setScreen("verification-choice");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f9f8", fontFamily: "'Plus Jakarta Sans', sans-serif", padding: "2rem 1.5rem 4rem", display: "flex", justifyContent: "center", opacity: revealed ? 1 : 0, transform: revealed ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap");
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 620 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", justifyContent: "center", marginBottom: "1.75rem" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #479880, #4b959e)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "0.85rem" }}>IJ</div>
          <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0f2421", letterSpacing: "-0.02em" }}>InklusiJobs</span>
        </div>

        {/* Hero card */}
        <div style={{ background: "white", borderRadius: 24, padding: "2rem", border: `2px solid ${config.badgeColor}33`, boxShadow: "0 8px 40px rgba(71,152,128,0.1)", marginBottom: "1rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.9rem", borderRadius: 999, fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1.25rem", color: config.badgeColor, background: config.badgeBg, border: `1.5px solid ${config.badgeBorder}` }}>
            {config.emoji} {config.badge}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.25rem" }}>
            <ScoreRing score={scoring.overallScore} qualified={scoring.qualified} />
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f2421", letterSpacing: "-0.02em", lineHeight: 1.25, marginBottom: "0.5rem" }}>{config.headline}</h1>
              <p style={{ fontSize: "0.9rem", color: "#4a6360", lineHeight: 1.6, marginBottom: "0.5rem" }}>{config.subtext}</p>
              <div style={{ fontSize: "0.75rem", color: "#7a9b97", fontWeight: 500 }}>Passing score for this role: <strong>{scoring.passingThreshold}%</strong></div>
            </div>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#6b8a87", paddingTop: "1rem", borderTop: "1px solid #eef4f2" }}>
            Assessed for: <strong>{job?.title}</strong>{job?.company && <span style={{ color: "#94b0ac" }}> · {job.company}</span>}
          </div>
        </div>

        {/* Encouragement */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", background: "linear-gradient(135deg, #f0faf7, #ebf7f8)", borderRadius: 14, padding: "1rem 1.25rem", marginBottom: "1.5rem", border: "1px solid #c8e8df" }}>
          <span style={{ fontSize: "1.2rem", flexShrink: 0, marginTop: 1 }}>💬</span>
          <p style={{ fontSize: "0.9rem", color: "#2d5f55", lineHeight: 1.6, fontStyle: "italic" }}>{scoring.encouragementMessage}</p>
        </div>

        {/* Skill breakdown */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f2421" }}>Your Skill Breakdown</h2>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.72rem", color: "#7a9b97", fontWeight: 500 }}>
              <span style={{ width: 12, height: 2, background: "#c5d9d6", borderRadius: 1, display: "inline-block" }} /> Min. threshold (65%)
            </span>
          </div>
          <div style={{ background: "white", borderRadius: 18, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", boxShadow: "0 2px 16px rgba(71,152,128,0.06)", border: "1px solid #eef4f2" }}>
            {scoring.skillScores?.map((s, i) => <SkillBar key={s.skill} skillScore={s} index={i} />)}
          </div>
        </div>

        {/* Strengths & Areas */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "1rem" }}>
          <div style={{ background: "white", borderRadius: 16, padding: "1.1rem", border: "1px solid #c8e8df" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
              <span>✨</span><h3 style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f2421", textTransform: "uppercase", letterSpacing: "0.04em" }}>Your Strengths</h3>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {scoring.strengths?.map((s, i) => <li key={i} style={{ fontSize: "0.82rem", color: "#4a6360", lineHeight: 1.45, paddingLeft: "0.75rem", position: "relative" }}><span style={{ position: "absolute", left: 0, color: "#479880", fontWeight: 700 }}>·</span>{s}</li>)}
            </ul>
          </div>
          <div style={{ background: "white", borderRadius: 16, padding: "1.1rem", border: "1px solid #c8d5e8" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
              <span>🎯</span><h3 style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f2421", textTransform: "uppercase", letterSpacing: "0.04em" }}>Areas to Grow</h3>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {scoring.areasToGrow?.map((a, i) => <li key={i} style={{ fontSize: "0.82rem", color: "#4a6360", lineHeight: 1.45, paddingLeft: "0.75rem", position: "relative" }}><span style={{ position: "absolute", left: 0, color: "#479880", fontWeight: 700 }}>·</span>{a}</li>)}
            </ul>
          </div>
        </div>

        {/* Feedback */}
        <div style={{ background: "white", borderRadius: 16, padding: "1.25rem", marginBottom: "1rem", border: "1px solid #eef4f2" }}>
          <p style={{ fontSize: "0.9rem", color: "#3d5e59", lineHeight: 1.7 }}>{scoring.overallFeedback}</p>
        </div>

        {/* Next step */}
        <div style={{ background: "linear-gradient(135deg, #0f2421, #1a3d35)", borderRadius: 16, padding: "1.25rem 1.4rem", marginBottom: "1.5rem" }}>
          <span style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#479880", marginBottom: "0.4rem" }}>Your next step</span>
          <p style={{ fontSize: "0.92rem", color: "#e8f6f2", lineHeight: 1.6, fontWeight: 500 }}>{scoring.nextStep}</p>
        </div>

        {/* CTA row */}
        <div style={{ display: "flex", gap: "0.85rem", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <button onClick={() => router.push("/job-select")} style={{ background: "none", border: "2px solid #e4ecea", borderRadius: 12, padding: "0.75rem 1.2rem", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.88rem", fontWeight: 600, color: "#4a6360", cursor: "pointer", whiteSpace: "nowrap" }}>
            ← Try a Different Job
          </button>
          <button onClick={handleCTA} style={{ background: "linear-gradient(135deg, #479880, #4b959e)", border: "none", borderRadius: 12, padding: "0.85rem 2rem", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "white", cursor: "pointer", boxShadow: "0 4px 16px rgba(71,152,128,0.3)", flex: 1 }}>
            {config.ctaLabel}
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.78rem", color: "#7a9b97" }}>
          🔒 Your results are saved privately on this device.
        </p>
      </div>
    </div>
  );
}