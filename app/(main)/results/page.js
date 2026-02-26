"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function loadResults() {
  try {
    const r = localStorage.getItem("inklusijobs_results");
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
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
      emoji: "🎉",
      badge: "Qualified",
      badgeColor: "#479880",
      badgeBg: "#f0faf7",
      badgeBorder: "#c8e8df",
      headline: "You're ready for this role!",
      subtext: `Your score of ${scoring.overallScore}% meets the requirement for ${scoring.jobTitle}.`,
      ctaLabel: "View Matching Jobs →",
      ctaRoute: "/dashboard",
      ctaStyle: "primary",
    };
  }
  if (scoring.qualificationLevel === "nearly_ready") {
    return {
      emoji: "💪",
      badge: "Almost There",
      badgeColor: "#648FBF",
      badgeBg: "#f0f5fb",
      badgeBorder: "#c5d9f0",
      headline: "You're very close!",
      subtext: `Your score of ${scoring.overallScore}% is just below the ${scoring.passingThreshold}% threshold. A focused roadmap will get you there fast.`,
      ctaLabel: "Build My Roadmap →",
      ctaRoute: "/roadmap",
      ctaStyle: "primary",
    };
  }
  return {
    emoji: "🌱",
    badge: "Keep Growing",
    badgeColor: "#8891C9",
    badgeBg: "#f0f0fb",
    badgeBorder: "#c5c8e8",
    headline: "Let's build your skills first.",
    subtext: `Your score of ${scoring.overallScore}% shows you have real potential. Your personalised roadmap will close these gaps step by step.`,
    ctaLabel: "Build My Roadmap →",
    ctaRoute: "/roadmap",
    ctaStyle: "primary",
  };
}

// ─── Animated Score Ring ──────────────────────────────────────────────────────
function ScoreRing({ score, qualified, size = 140 }) {
  const [animated, setAnimated] = useState(false);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = animated ? (score / 100) * circumference : 0;
  const color = qualified ? "#479880" : score >= 65 ? "#648FBF" : "#8891C9";

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="score-ring-wrapper">
      <svg width={size} height={size} viewBox="0 0 120 120">
        {/* Background track */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e8f0ef"
          strokeWidth="10"
        />
        {/* Progress arc */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform="rotate(-90 60 60)"
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        {/* Score text */}
        <text
          x="60"
          y="55"
          textAnchor="middle"
          fill="#0f2421"
          fontSize="22"
          fontWeight="800"
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          {animated ? score : 0}%
        </text>
        <text
          x="60"
          y="72"
          textAnchor="middle"
          fill="#7a9b97"
          fontSize="9.5"
          fontWeight="600"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          letterSpacing="0.04em"
        >
          OVERALL
        </text>
      </svg>
      <style jsx>{`
        .score-ring-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

// ─── Skill Score Bar ──────────────────────────────────────────────────────────
function SkillBar({ skillScore, index }) {
  const [animated, setAnimated] = useState(false);
  const colors = getScoreColor(skillScore.score);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400 + index * 120);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className="skill-bar-item"
      style={{ animationDelay: `${0.1 + index * 0.08}s` }}
    >
      <div className="skill-bar-header">
        <span className="skill-name">{skillScore.skill}</span>
        <span className="skill-score" style={{ color: colors.text }}>
          {skillScore.score}%
        </span>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{
            width: animated ? `${skillScore.score}%` : "0%",
            background: colors.bar,
          }}
        />
        {/* Threshold marker */}
        <div className="skill-threshold-marker" style={{ left: "65%" }} />
      </div>
      <p className="skill-evidence">{skillScore.feedback}</p>

      <style jsx>{`
        .skill-bar-item {
          opacity: 0;
          animation: fadeSlideUp 0.4s ease forwards;
        }
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .skill-bar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.4rem;
        }
        .skill-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: #1a2e2b;
        }
        .skill-score {
          font-size: 0.88rem;
          font-weight: 700;
        }
        .skill-bar-track {
          height: 8px;
          background: #eef4f2;
          border-radius: 999px;
          overflow: visible;
          position: relative;
          margin-bottom: 0.45rem;
        }
        .skill-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .skill-threshold-marker {
          position: absolute;
          top: -3px;
          width: 2px;
          height: 14px;
          background: #c5d9d6;
          border-radius: 1px;
        }
        .skill-evidence {
          font-size: 0.78rem;
          color: #6b8a87;
          line-height: 1.5;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const data = loadResults();
    if (!data?.scoring) {
      router.replace("/job-select");
      return;
    }
    setResults(data);
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, [router]);

  if (!results) {
    return (
      <div className="ij-loading">
        <div className="ij-spinner" />
        <style jsx>{`
          .ij-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f4f9f8;
          }
          .ij-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #e8f0ef;
            border-top-color: #479880;
            border-radius: 50%;
            animation: spin 0.9s linear infinite;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  const { scoring, job } = results;
  const config = getQualificationConfig(scoring);
  const needsRoadmap = !scoring.qualified;

  const handleCTA = () => {
    if (needsRoadmap) {
      // Trigger roadmap generation
      generateRoadmap();
    } else {
      router.push(config.ctaRoute);
    }
  };

  const generateRoadmap = async () => {
    try {
      // Store scoring in localStorage for roadmap page
      localStorage.setItem("inklusijobs_scoring", JSON.stringify(scoring));
      localStorage.setItem("inklusijobs_job_for_roadmap", JSON.stringify(job));
      router.push("/roadmap");
    } catch (e) {
      router.push("/roadmap");
    }
  };

  return (
    <div className={`ij-page ${revealed ? "revealed" : ""}`}>
      <GlobalStyles />

      <div className="ij-shell">
        {/* Logo */}
        <div className="ij-logo-row">
          <div className="ij-logo-mark">IJ</div>
          <span className="ij-logo-text">InklusiJobs</span>
        </div>

        {/* Hero result card */}
        <div
          className="ij-hero-card"
          style={{ borderColor: config.badgeColor + "33" }}
        >
          {/* Qualification badge */}
          <div
            className="ij-qual-badge"
            style={{
              color: config.badgeColor,
              background: config.badgeBg,
              border: `1.5px solid ${config.badgeBorder}`,
            }}
          >
            {config.emoji} {config.badge}
          </div>

          {/* Score ring + headline */}
          <div className="ij-hero-content">
            <ScoreRing
              score={scoring.overallScore}
              qualified={scoring.qualified}
            />
            <div className="ij-hero-text">
              <h1 className="ij-headline">{config.headline}</h1>
              <p className="ij-subtext">{config.subtext}</p>
              <div className="ij-threshold-note">
                Passing score for this role:{" "}
                <strong>{scoring.passingThreshold}%</strong>
              </div>
            </div>
          </div>

          {/* Job tag */}
          <div className="ij-job-tag">
            Assessed for: <strong>{job?.title}</strong>
            {job?.company && (
              <span className="ij-job-company"> · {job.company}</span>
            )}
          </div>
        </div>

        {/* Encouragement message */}
        <div className="ij-encouragement">
          <span className="ij-encouragement-icon">💬</span>
          <p>{scoring.encouragementMessage}</p>
        </div>

        {/* Skill scores */}
        <div className="ij-section">
          <div className="ij-section-header">
            <h2 className="ij-section-title">Your Skill Breakdown</h2>
            <span className="ij-legend">
              <span className="ij-legend-mark" /> Min. threshold (65%)
            </span>
          </div>
          <div className="ij-skill-list">
            {scoring.skillScores?.map((s, i) => (
              <SkillBar key={s.skill} skillScore={s} index={i} />
            ))}
          </div>
        </div>

        {/* Strengths & Areas to grow */}
        <div className="ij-two-col">
          <div className="ij-insight-card strengths">
            <div className="ij-insight-header">
              <span>✨</span>
              <h3>Your Strengths</h3>
            </div>
            <ul className="ij-insight-list">
              {scoring.strengths?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="ij-insight-card grow">
            <div className="ij-insight-header">
              <span>🎯</span>
              <h3>Areas to Grow</h3>
            </div>
            <ul className="ij-insight-list">
              {scoring.areasToGrow?.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Overall feedback */}
        <div className="ij-feedback-card">
          <p className="ij-feedback-text">{scoring.overallFeedback}</p>
        </div>

        {/* Next step */}
        <div className="ij-next-step">
          <span className="ij-next-step-label">Your next step</span>
          <p className="ij-next-step-text">{scoring.nextStep}</p>
        </div>

        {/* CTA - THIS BUTTON ALREADY LINKS TO ROADMAP WHEN NEEDED */}
        <div className="ij-cta-row">
          <button
            className="ij-btn-secondary"
            onClick={() => router.push("/job-select")}
          >
            ← Try a Different Job
          </button>
          <button className="ij-btn-primary" onClick={handleCTA}>
            {config.ctaLabel}
          </button>
        </div>

        <p className="ij-footer-note">
          🔒 Your results are saved privately on this device.
        </p>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap");

      :root {
        --teal: #479880;
        --blue: #4b959e;
        --mid: #648fbf;
        --purple: #8891c9;
        --bg: #f4f9f8;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        background: var(--bg);
      }

      .ij-page {
        min-height: 100vh;
        background: var(--bg);
        font-family: "Plus Jakarta Sans", sans-serif;
        padding: 2rem 1.5rem 4rem;
        display: flex;
        justify-content: center;
        opacity: 0;
        transform: translateY(10px);
        transition:
          opacity 0.5s ease,
          transform 0.5s ease;
      }
      .ij-page.revealed {
        opacity: 1;
        transform: translateY(0);
      }

      .ij-shell {
        width: 100%;
        max-width: 620px;
      }

      /* Logo */
      .ij-logo-row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        justify-content: center;
        margin-bottom: 1.75rem;
      }
      .ij-logo-mark {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, var(--teal), var(--blue));
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 800;
        font-size: 0.85rem;
      }
      .ij-logo-text {
        font-weight: 700;
        font-size: 1.1rem;
        color: #0f2421;
        letter-spacing: -0.02em;
      }

      /* Hero card */
      .ij-hero-card {
        background: white;
        border-radius: 24px;
        padding: 2rem;
        border: 2px solid;
        box-shadow: 0 8px 40px rgba(71, 152, 128, 0.1);
        margin-bottom: 1rem;
      }
      .ij-qual-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.3rem 0.9rem;
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 1.25rem;
      }
      .ij-hero-content {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 1.25rem;
      }
      .ij-hero-text {
        flex: 1;
      }
      .ij-headline {
        font-size: 1.45rem;
        font-weight: 800;
        color: #0f2421;
        letter-spacing: -0.02em;
        line-height: 1.25;
        margin-bottom: 0.5rem;
      }
      .ij-subtext {
        font-size: 0.9rem;
        color: #4a6360;
        line-height: 1.6;
        margin-bottom: 0.5rem;
      }
      .ij-threshold-note {
        font-size: 0.75rem;
        color: #7a9b97;
        font-weight: 500;
      }
      .ij-job-tag {
        font-size: 0.8rem;
        color: #6b8a87;
        padding-top: 1rem;
        border-top: 1px solid #eef4f2;
      }
      .ij-job-company {
        color: #94b0ac;
      }

      /* Encouragement */
      .ij-encouragement {
        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
        background: linear-gradient(135deg, #f0faf7, #ebf7f8);
        border-radius: 14px;
        padding: 1rem 1.25rem;
        margin-bottom: 1.5rem;
        border: 1px solid #c8e8df;
      }
      .ij-encouragement-icon {
        font-size: 1.2rem;
        flex-shrink: 0;
        margin-top: 1px;
      }
      .ij-encouragement p {
        font-size: 0.9rem;
        color: #2d5f55;
        line-height: 1.6;
        font-style: italic;
      }

      /* Section */
      .ij-section {
        margin-bottom: 1.5rem;
      }
      .ij-section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
      }
      .ij-section-title {
        font-size: 1rem;
        font-weight: 700;
        color: #0f2421;
      }
      .ij-legend {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.72rem;
        color: #7a9b97;
        font-weight: 500;
      }
      .ij-legend-mark {
        width: 12px;
        height: 2px;
        background: #c5d9d6;
        border-radius: 1px;
        display: inline-block;
      }
      .ij-skill-list {
        background: white;
        border-radius: 18px;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        box-shadow: 0 2px 16px rgba(71, 152, 128, 0.06);
        border: 1px solid #eef4f2;
      }

      /* Two-col insights */
      .ij-two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.85rem;
        margin-bottom: 1rem;
      }
      .ij-insight-card {
        background: white;
        border-radius: 16px;
        padding: 1.1rem;
        border: 1px solid #eef4f2;
      }
      .ij-insight-card.strengths {
        border-color: #c8e8df;
      }
      .ij-insight-card.grow {
        border-color: #c8d5e8;
      }
      .ij-insight-header {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        margin-bottom: 0.75rem;
      }
      .ij-insight-header h3 {
        font-size: 0.82rem;
        font-weight: 700;
        color: #0f2421;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .ij-insight-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }
      .ij-insight-list li {
        font-size: 0.82rem;
        color: #4a6360;
        line-height: 1.45;
        padding-left: 0.75rem;
        position: relative;
      }
      .ij-insight-list li::before {
        content: "·";
        position: absolute;
        left: 0;
        color: #479880;
        font-weight: 700;
      }

      /* Overall feedback */
      .ij-feedback-card {
        background: white;
        border-radius: 16px;
        padding: 1.25rem;
        margin-bottom: 1rem;
        border: 1px solid #eef4f2;
      }
      .ij-feedback-text {
        font-size: 0.9rem;
        color: #3d5e59;
        line-height: 1.7;
      }

      /* Next step */
      .ij-next-step {
        background: linear-gradient(135deg, #0f2421, #1a3d35);
        border-radius: 16px;
        padding: 1.25rem 1.4rem;
        margin-bottom: 1.5rem;
      }
      .ij-next-step-label {
        display: block;
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #479880;
        margin-bottom: 0.4rem;
      }
      .ij-next-step-text {
        font-size: 0.92rem;
        color: #e8f6f2;
        line-height: 1.6;
        font-weight: 500;
      }

      /* CTA row - THIS BUTTON ALREADY WORKS */
      .ij-cta-row {
        display: flex;
        gap: 0.85rem;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.25rem;
      }
      .ij-btn-secondary {
        background: none;
        border: 2px solid #e4ecea;
        border-radius: 12px;
        padding: 0.75rem 1.2rem;
        font-family: "Plus Jakarta Sans", sans-serif;
        font-size: 0.88rem;
        font-weight: 600;
        color: #4a6360;
        cursor: pointer;
        transition: all 0.18s ease;
        white-space: nowrap;
      }
      .ij-btn-secondary:hover {
        border-color: var(--teal);
        color: var(--teal);
      }

      .ij-btn-primary {
        background: linear-gradient(135deg, var(--teal), var(--blue));
        border: none;
        border-radius: 12px;
        padding: 0.85rem 2rem;
        font-family: "Plus Jakarta Sans", sans-serif;
        font-size: 0.95rem;
        font-weight: 700;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 16px rgba(71, 152, 128, 0.3);
        flex: 1;
      }
      .ij-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(71, 152, 128, 0.35);
      }

      .ij-footer-note {
        text-align: center;
        font-size: 0.78rem;
        color: #7a9b97;
      }

      @media (max-width: 480px) {
        .ij-hero-content {
          flex-direction: column;
          text-align: center;
        }
        .ij-two-col {
          grid-template-columns: 1fr;
        }
        .ij-cta-row {
          flex-direction: column;
        }
        .ij-btn-primary,
        .ij-btn-secondary {
          width: 100%;
          text-align: center;
        }
      }
    `}</style>
  );
}
