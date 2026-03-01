"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function VerificationSuccessPage() {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const results = JSON.parse(localStorage.getItem("inklusijobs_results") || "{}");
      if (results?.job) setJob(results.job);
    } catch {}
  }, []);

  const handleCreateRoadmap = async () => {
    setGenerating(true);
    try {
      const results = JSON.parse(localStorage.getItem("inklusijobs_results") || "{}");
      const jobSelection = JSON.parse(localStorage.getItem("inklusijobs_job_selection") || "{}");

      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results, jobSelection }),
      });

      if (!res.ok) throw new Error("Roadmap generation failed");
      const roadmap = await res.json();

      // Store roadmap so the roadmap page can read it
      localStorage.setItem("inklusijobs_roadmap", JSON.stringify(roadmap));
      router.push("/dashboard/roadmap");
    } catch (err) {
      console.error("[VerificationSuccess] Roadmap error:", err);
      // Still navigate — roadmap page will show error state
      router.push("/dashboard/roadmap");
    }
  };

  const handleDashboard = () => router.push("/dashboard");

  if (!mounted) return null;

  if (generating) {
    return (
      <div className="vs-overlay">
        <VSStyles />
        <div className="vs-card">
          <div className="vs-spinner" aria-hidden="true" />
          <h2>Building your roadmap…</h2>
          <p>Creating a personalised plan{job?.title ? ` for ${job.title}` : ""}. This takes about 10 seconds. 🌟</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vs-page">
      <VSStyles />

      <div className="vs-shell">
        {/* Logo */}
        <div className="vs-logo-row">
          <div className="vs-logo-mark">IJ</div>
          <span className="vs-logo-text">InklusiJobs</span>
        </div>

        <div className="vs-card vs-card--centered">
          {/* Success animation */}
          <div className="vs-check-circle">
            <svg viewBox="0 0 52 52" className="vs-check-svg">
              <circle cx="26" cy="26" r="25" fill="none" stroke="#479880" strokeWidth="2" className="vs-check-circle-ring"/>
              <path fill="none" stroke="#479880" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 27l8 8 16-16" className="vs-check-path"/>
            </svg>
          </div>

          <h1 className="vs-title">You're Verified! 🎉</h1>
          <p className="vs-subtitle">
            Your profile now carries the InklusiJobs Verified badge.
            {job?.title && <> Employers looking for <strong>{job.title}</strong> will see you first.</>}
          </p>

          <div className="vs-divider" />

          <p className="vs-choice-label">What would you like to do next?</p>

          <div className="vs-actions">
            <button className="vs-btn-primary" onClick={handleCreateRoadmap}>
              <span className="vs-btn-icon">🗺️</span>
              <span>
                <strong>Create My Roadmap</strong>
                <small>Get a personalised step-by-step plan</small>
              </span>
            </button>
            <button className="vs-btn-secondary" onClick={handleDashboard}>
              <span className="vs-btn-icon">🏠</span>
              <span>
                <strong>Go to Dashboard</strong>
                <small>Explore your results & profile</small>
              </span>
            </button>
          </div>
        </div>

        <p className="vs-footer">You can always create your roadmap later from the dashboard.</p>
      </div>
    </div>
  );
}

function VSStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      :root { --teal:#479880; --blue:#4B959E; --bg:#f4f9f8; }
      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      body { background: var(--bg); }

      /* ── Overlay (loading) ── */
      .vs-overlay {
        min-height: 100vh; background: var(--bg);
        display: flex; align-items: center; justify-content: center;
        font-family: 'Plus Jakarta Sans', sans-serif; padding: 2rem;
      }
      .vs-overlay .vs-card {
        background: white; border-radius: 24px; padding: 3rem 2.5rem;
        max-width: 420px; width: 100%; text-align: center;
        box-shadow: 0 20px 60px rgba(71,152,128,0.12);
      }
      .vs-overlay .vs-card h2 { font-size:1.35rem; font-weight:700; color:#0f2421; margin:1.2rem 0 0.6rem; }
      .vs-overlay .vs-card p  { font-size:0.92rem; color:#6b8a87; line-height:1.6; }
      .vs-spinner {
        width: 52px; height: 52px;
        border: 4px solid #e8f0ef; border-top-color: #479880;
        border-radius: 50%; animation: spin 0.9s linear infinite;
        margin: 0 auto;
      }
      @keyframes spin { to { transform: rotate(360deg); } }

      /* ── Page ── */
      .vs-page {
        min-height: 100vh; background: var(--bg);
        display: flex; align-items: center; justify-content: center;
        font-family: 'Plus Jakarta Sans', sans-serif; padding: 2rem 1.5rem;
      }
      .vs-shell { width: 100%; max-width: 480px; }

      .vs-logo-row {
        display: flex; align-items: center; gap: 0.6rem;
        justify-content: center; margin-bottom: 1.5rem;
      }
      .vs-logo-mark {
        width: 36px; height: 36px;
        background: linear-gradient(135deg, var(--teal), var(--blue));
        border-radius: 10px; display: flex; align-items: center;
        justify-content: center; color: white; font-weight: 800; font-size: 0.85rem;
      }
      .vs-logo-text { font-weight: 700; font-size: 1.1rem; color: #0f2421; letter-spacing: -0.02em; }

      .vs-card {
        background: white; border-radius: 24px; padding: 2.4rem;
        box-shadow: 0 4px 6px rgba(71,152,128,0.04), 0 20px 60px rgba(71,152,128,0.10);
        border: 1px solid rgba(71,152,128,0.08);
      }
      .vs-card--centered { text-align: center; }

      /* ── Check animation ── */
      .vs-check-circle { width: 72px; height: 72px; margin: 0 auto 1.4rem; }
      .vs-check-svg { width: 100%; height: 100%; }
      .vs-check-circle-ring {
        stroke-dasharray: 160; stroke-dashoffset: 160;
        animation: drawCircle 0.5s ease forwards;
      }
      .vs-check-path {
        stroke-dasharray: 50; stroke-dashoffset: 50;
        animation: drawCheck 0.4s ease 0.45s forwards;
      }
      @keyframes drawCircle { to { stroke-dashoffset: 0; } }
      @keyframes drawCheck  { to { stroke-dashoffset: 0; } }

      .vs-title {
        font-size: 1.65rem; font-weight: 800; color: #0f2421;
        letter-spacing: -0.03em; margin-bottom: 0.7rem;
      }
      .vs-subtitle {
        font-size: 0.92rem; color: #4a6360; line-height: 1.65; margin-bottom: 1.4rem;
      }
      .vs-subtitle strong { color: #0f2421; }

      .vs-divider { height: 1px; background: #e4ecea; margin-bottom: 1.2rem; }
      .vs-choice-label {
        font-size: 0.82rem; font-weight: 600; color: #7a9b97;
        text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 1rem;
      }

      .vs-actions { display: flex; flex-direction: column; gap: 0.75rem; }

      .vs-btn-primary,
      .vs-btn-secondary {
        display: flex; align-items: center; gap: 1rem;
        border-radius: 14px; padding: 1rem 1.4rem;
        font-family: 'Plus Jakarta Sans', sans-serif;
        cursor: pointer; transition: all 0.2s ease; text-align: left;
        width: 100%;
      }
      .vs-btn-primary {
        background: linear-gradient(135deg, var(--teal), var(--blue));
        border: none; color: white;
        box-shadow: 0 4px 16px rgba(71,152,128,0.3);
      }
      .vs-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(71,152,128,0.35); }
      .vs-btn-secondary {
        background: #f8fcfb; border: 1.5px solid #e4ecea; color: #0f2421;
      }
      .vs-btn-secondary:hover { border-color: var(--teal); background: #f0faf7; }

      .vs-btn-icon { font-size: 1.5rem; flex-shrink: 0; }
      .vs-btn-primary span:last-child,
      .vs-btn-secondary span:last-child {
        display: flex; flex-direction: column; gap: 0.15rem;
      }
      .vs-btn-primary strong,
      .vs-btn-secondary strong { font-size: 0.95rem; font-weight: 700; }
      .vs-btn-primary small  { font-size: 0.78rem; opacity: 0.8; font-weight: 400; }
      .vs-btn-secondary small { font-size: 0.78rem; color: #7a9b97; font-weight: 400; }

      .vs-footer {
        text-align: center; font-size: 0.78rem; color: #7a9b97; margin-top: 1.25rem;
      }
    `}</style>
  );
}