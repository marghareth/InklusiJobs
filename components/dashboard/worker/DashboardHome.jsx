"use client";

// ─── DashboardHome.jsx ────────────────────────────────────────────────────────
// Reads ALL user progress from localStorage — zero static/hardcoded data.
//
// DATA KEYS consumed:
//   inklusijobs_profile              → { name, firstName }
//   inklusijobs_assessment_results   → raw assessment answers
//   inklusijobs_scoring              → { overallScore, skills[] }
//   inklusijobs_completed_challenges → string[] of challengeIds
//   inklusijobs_completed_skills     → string[] of resourceIds
//   inklusijobs_roadmap_progress     → { phase1, phase2, phase3, overall }
//   inklusijobs_current_challenge    → { id, title, description, estimatedHours, portfolioWorthy, startedAt }
//   inklusijobs_job_selection        → { jobId, jobTitle }
//   inklusijobs_recent_activity      → { icon, title, sub, time, color, bg }[]

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";

// ─── localStorage helper ──────────────────────────────────────────────────────
const LS = {
  get: (key) => { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; } },
};

const KEYS = {
  PROFILE:              "inklusijobs_profile",
  SCORING:              "inklusijobs_scoring",
  ASSESSMENT_RESULTS:   "inklusijobs_assessment_results",
  COMPLETED_CHALLENGES: "inklusijobs_completed_challenges",
  COMPLETED_SKILLS:     "inklusijobs_completed_skills",
  ROADMAP_PROGRESS:     "inklusijobs_roadmap_progress",
  CURRENT_CHALLENGE:    "inklusijobs_current_challenge",
  JOB_SELECTION:        "inklusijobs_job_selection",
  RECENT_ACTIVITY:      "inklusijobs_recent_activity",
  ROADMAP:              "inklusijobs_roadmap",
};

// ─── Greeting logic ───────────────────────────────────────────────────────────
function getGreeting(firstName) {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { line: `Good morning, ${firstName}. ☀️`, sub: "Ready to keep going?" };
  return { line: `Welcome back, ${firstName}.`, sub: "You've got challenges waiting. Let's do this." };
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function CountUp({ to, duration = 900 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!to) return;
    const start = Date.now();
    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * to));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to, duration]);
  return <>{val}</>;
}

// ─── SVG ring ─────────────────────────────────────────────────────────────────
function RingChart({ pct, size = 80, stroke = 7, color = "#479880" }) {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  useEffect(() => {
    const t = setTimeout(() => setOffset(circ - (pct / 100) * circ), 200);
    return () => clearTimeout(t);
  }, [pct, circ]);
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(71,152,128,0.12)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition:"stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)", transform:"rotate(-90deg)", transformOrigin:"center" }}
      />
      <text x="50%" y="55%" textAnchor="middle" fill="#0f2421" fontSize="14" fontWeight="800" fontFamily="'Syne',sans-serif">
        {pct}%
      </text>
    </svg>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, rawValue, displayValue, label, color, delay }) {
  return (
    <div className="dh-stat-card" style={{ "--accent": color, animationDelay: `${delay}ms` }}>
      <div className="dh-stat-icon" style={{ background: `${color}14` }}>{icon}</div>
      <div className="dh-stat-body">
        <div className="dh-stat-value" style={{ color }}>
          {typeof rawValue === "number"
            ? <><CountUp to={rawValue} />{displayValue?.replace(/^\d+/, "") || ""}</>
            : (displayValue ?? "—")
          }
        </div>
        <div className="dh-stat-label">{label}</div>
      </div>
      <div className="dh-stat-glow" style={{ background: color }} />
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ pct, color, delay }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 300 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div className="dh-pb-track">
      <div className="dh-pb-fill" style={{ width: `${width}%`, background: color, transitionDelay: `${delay}ms` }} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [revealed, setRevealed] = useState(false);

  // Read everything from localStorage on mount
  useEffect(() => {
    const profile            = LS.get(KEYS.PROFILE) || {};
    const scoring            = LS.get(KEYS.SCORING) || {};
    const assessmentResults  = LS.get(KEYS.ASSESSMENT_RESULTS) || {};
    const completedChallenges = LS.get(KEYS.COMPLETED_CHALLENGES) || [];
    const completedSkills    = LS.get(KEYS.COMPLETED_SKILLS) || [];
    const roadmapProgress    = LS.get(KEYS.ROADMAP_PROGRESS) || {};
    const currentChallenge   = LS.get(KEYS.CURRENT_CHALLENGE) || null;
    const jobSelection       = LS.get(KEYS.JOB_SELECTION) || {};
    const recentActivity     = LS.get(KEYS.RECENT_ACTIVITY) || [];
    const roadmap            = LS.get(KEYS.ROADMAP) || null;

    // ── Skills Mastered: unique skills from scoring + completed skills ──────────
    const scoringSkills = scoring?.skills?.filter(s => s.level >= 3)?.length || 0;
    const skillsMastered = Math.max(scoringSkills, completedSkills.length);

    // ── Challenges completed ────────────────────────────────────────────────────
    const challengesDone = completedChallenges.length;

    // ── Overall progress: weighted average of roadmap + challenges ───────────────
    const roadmapPct     = roadmapProgress.overall || 0;
    const challengeTotal = roadmap?.phases?.reduce((sum, p) => sum + (p.challengeCount || 1), 0) || 3;
    const challengePct   = challengeTotal > 0 ? Math.round((challengesDone / challengeTotal) * 100) : 0;
    const assessmentScore = scoring?.overallScore || 0;
    const overallProgress = Math.round((roadmapPct + challengePct + (assessmentScore > 0 ? assessmentScore : 0)) / (assessmentScore > 0 ? 3 : 2));

    // ── Portfolio items: completed challenges that are portfolioWorthy ──────────
    // We track this from currentChallenge history if available
    const portfolioItems = completedChallenges.filter(id => {
      // We can't know portfolioWorthy from just the ID, so default to challengesDone
      return true;
    }).length;

    // ── Learning path phases ────────────────────────────────────────────────────
    const learningPath = [
      { label: roadmap?.phases?.[0]?.title || "Beginner",     pct: roadmapProgress.phase1 || 0, color: "#479880", locked: false },
      { label: roadmap?.phases?.[1]?.title || "Intermediate",  pct: roadmapProgress.phase2 || 0, color: "#4B959E", locked: (roadmapProgress.phase1 || 0) < 50 },
      { label: roadmap?.phases?.[2]?.title || "Advanced",      pct: roadmapProgress.phase3 || 0, color: "#6B6B8F", locked: (roadmapProgress.phase2 || 0) < 50 },
    ];

    // ── Name — check every key the onboarding flow might have used ─────────────
    // Supabase profile table uses: full_name, first_name, name
    // Basic-info form saves to: inklusijobs_profile → { name, firstName, fullName }
    // Onboarding may also save directly as: inklusijobs_basic_info → { firstName, lastName }
    const basicInfo   = LS.get("inklusijobs_basic_info") || {};
    const onboarding  = LS.get("inklusijobs_onboarding") || {};
    const name =
      profile?.full_name   ||   // Supabase profiles.full_name
      profile?.first_name  ||   // Supabase profiles.first_name
      profile?.firstName   ||   // camelCase variant
      profile?.name        ||   // generic
      basicInfo?.firstName ||   // BasicInformation form
      basicInfo?.first_name||
      basicInfo?.name      ||
      onboarding?.name     ||
      onboarding?.firstName||
      "";
    const firstName = name.split(" ")[0] || "there";

    // ── Recent activity: from localStorage + derive from completedChallenges ─────
    let activity = recentActivity;
    if (!activity.length && completedChallenges.length > 0) {
      activity = completedChallenges.slice(-4).reverse().map((id, i) => ({
        icon: "✅", title: "Completed challenge",
        sub: `Challenge ${id}`, time: i === 0 ? "Recently" : `${i + 1} challenges ago`,
        color: "#479880", bg: "rgba(71,152,128,0.10)",
      }));
    }
    if (!activity.length) {
      activity = [{ icon: "👋", title: "Welcome to InklusiJobs", sub: "Complete your first challenge to see activity", time: "Now", color: "#4B959E", bg: "rgba(75,149,158,0.10)" }];
    }

    // ── Job match ────────────────────────────────────────────────────────────────
    const jobMatchPct = scoring?.overallScore || 0;
    const jobTitle    = jobSelection?.jobTitle || scoring?.jobTitle || "your target role";

    // ── Has data flag ─────────────────────────────────────────────────────────────
    const hasData = challengesDone > 0 || completedSkills.length > 0 || assessmentScore > 0;

    setData({
      firstName, hasData,
      stats: {
        skillsMastered, challengesDone,
        overallProgress, portfolioItems,
      },
      currentChallenge,
      learningPath,
      jobMatchPct, jobTitle,
      activity,
      encouragement: {
        challengesThisWeek: challengesDone,
        roadmapPct,
        employerViews: 0, // will come from Supabase later
      },
    });

    setTimeout(() => setRevealed(true), 80);
  }, []);

  if (!data) return null;

  const { firstName, hasData, stats, currentChallenge, learningPath, jobMatchPct, jobTitle, activity, encouragement } = data;
  const greeting = getGreeting(firstName || "there");

  // Challenge progress heuristic
  const challengeProgress = currentChallenge
    ? (currentChallenge.progress || (currentChallenge.startedAt ? 30 : 0))
    : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --teal:   #479880;
          --blue:   #4B959E;
          --dark:   #0f2421;
          --bg:     #f4f9f8;
          --white:  #ffffff;
          --text:   #0f2421;
          --muted:  #6b8a87;
          --border: #e4ecea;
          --font-d: 'Playfair Display', serif;
          --font-b: 'Instrument Sans', sans-serif;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }

        .dh-root {
          min-height: 100%; font-family: var(--font-b);
          color: var(--text); padding: 28px 32px 60px;
          display: flex; flex-direction: column; gap: 22px;
          opacity: 0; transition: opacity 0.4s;
        }
        .dh-root.revealed { opacity: 1; }

        /* ── Panel ── */
        .dh-panel {
          background: var(--white); border: 1px solid var(--border);
          border-radius: 18px;
          box-shadow: 0 2px 12px rgba(15,36,33,0.06);
          transition: box-shadow 0.2s;
          animation: fadeUp 0.5s both;
        }
        .dh-panel:hover { box-shadow: 0 4px 24px rgba(15,36,33,0.09); }

        /* ── Header ── */
        .dh-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
        .dh-headline { font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 700; color: var(--text); letter-spacing: -0.3px; line-height: 1.2; margin-bottom: 5px; }
        .dh-sub { font-size: 14px; color: var(--muted); }
        .dh-header-actions { display: flex; gap: 8px; flex-shrink: 0; }

        .dh-btn-outline {
          padding: 9px 18px; border-radius: 9px; border: 1.5px solid var(--border);
          font-family: var(--font-b); font-size: 12px; font-weight: 600;
          color: var(--muted); cursor: pointer; background: var(--white);
          transition: all 0.15s; text-decoration: none; display: inline-flex; align-items: center;
        }
        .dh-btn-outline:hover { border-color: var(--teal); color: var(--teal); }
        .dh-btn-primary {
          padding: 9px 18px; border-radius: 9px; border: none;
          background: linear-gradient(135deg, var(--teal), var(--blue));
          font-family: var(--font-b); font-size: 12px; font-weight: 700;
          color: #fff; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 3px 12px rgba(71,152,128,0.3); text-decoration: none;
          display: inline-flex; align-items: center;
        }
        .dh-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 5px 18px rgba(71,152,128,0.4); }

        /* ── Encouragement pills ── */
        .dh-encourage {
          display: flex; flex-wrap: wrap; gap: 10px; animation: fadeUp 0.5s both 0.05s;
        }
        .dh-enc-pill {
          background: rgba(71,152,128,0.08); border: 1px solid rgba(71,152,128,0.2);
          border-radius: 10px; padding: 10px 16px;
          font-size: 13px; font-weight: 600; color: #2d5f55; line-height: 1.5;
          flex: 1; min-width: 200px;
        }

        /* ── Stats ── */
        .dh-stats {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
          animation: fadeUp 0.5s both 0.08s;
        }
        @media (max-width: 1000px) { .dh-stats { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 560px)  { .dh-stats { grid-template-columns: 1fr; } }

        .dh-stat-card {
          background: var(--white); border: 1px solid var(--border);
          border-radius: 15px; padding: 18px 20px;
          display: flex; align-items: center; gap: 14px;
          position: relative; overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
          animation: fadeUp 0.5s both;
        }
        .dh-stat-card:hover { border-color: var(--accent); transform: translateY(-2px); }
        .dh-stat-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;
        }
        .dh-stat-value {
          font-family: var(--font-d); font-size: 26px; font-weight: 800; line-height: 1; letter-spacing: -0.5px;
        }
        .dh-stat-label { font-size: 11px; color: var(--muted); margin-top: 4px; font-weight: 500; }
        .dh-stat-glow {
          position: absolute; bottom: -16px; right: -16px;
          width: 60px; height: 60px; border-radius: 50%;
          opacity: 0.08; filter: blur(12px); pointer-events: none;
        }

        /* ── Mid row ── */
        .dh-mid {
          display: grid; grid-template-columns: 1fr 300px; gap: 20px;
          animation: fadeUp 0.5s both 0.12s;
        }
        @media (max-width: 860px) { .dh-mid { grid-template-columns: 1fr; } }
        .dh-panel-body { padding: 24px; }
        .dh-panel-title {
          font-family: var(--font-d); font-size: 15px; font-weight: 800; color: var(--text);
          margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center;
        }
        .dh-panel-badge {
          font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 99px;
        }
        .dh-badge-active { background: rgba(71,152,128,0.1); color: var(--teal); border: 1px solid rgba(71,152,128,0.2); }
        .dh-badge-none   { background: rgba(15,36,33,0.06); color: var(--muted); border: 1px solid var(--border); }

        /* Challenge card */
        .dh-challenge-inner {
          display: flex; gap: 14px; align-items: flex-start;
          background: #f8fffe; border: 1px solid var(--border);
          border-radius: 12px; padding: 16px;
        }
        .dh-ch-icon {
          width: 44px; height: 44px; border-radius: 11px; flex-shrink: 0;
          background: linear-gradient(135deg, var(--teal), var(--blue));
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; box-shadow: 0 3px 12px rgba(71,152,128,0.3);
        }
        .dh-ch-title { font-family: var(--font-d); font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 5px; line-height: 1.3; }
        .dh-ch-desc { font-size: 12px; color: var(--muted); line-height: 1.6; margin-bottom: 12px; }
        .dh-ch-meta { display: flex; gap: 14px; font-size: 12px; color: var(--muted); margin-bottom: 12px; }
        .dh-prog-label { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin-bottom: 5px; }
        .dh-prog-label span:last-child { color: var(--teal); font-weight: 700; }
        .dh-prog-track { height: 5px; background: rgba(71,152,128,0.10); border-radius: 99px; overflow: hidden; }
        .dh-prog-fill {
          height: 100%; border-radius: 99px;
          background: linear-gradient(90deg, var(--teal), var(--blue));
          transition: width 1s cubic-bezier(0.22,1,0.36,1);
          position: relative;
        }
        .dh-prog-fill::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s infinite;
        }
        .dh-ch-continue {
          margin-top: 16px; width: 100%; padding: 12px;
          background: linear-gradient(135deg, var(--teal), var(--blue));
          border: none; border-radius: 11px; color: #fff;
          font-family: var(--font-b); font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 3px 12px rgba(71,152,128,0.3);
          text-decoration: none; display: block; text-align: center;
        }
        .dh-ch-continue:hover { transform: translateY(-1px); }
        .dh-no-challenge {
          text-align: center; padding: 28px 16px;
          font-size: 13px; color: var(--muted); line-height: 1.6;
        }
        .dh-no-ch-emoji { font-size: 28px; display: block; margin-bottom: 8px; }

        /* Learning path */
        .dh-lp-item { margin-bottom: 16px; }
        .dh-lp-row { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
        .dh-lp-dot {
          width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 13px;
        }
        .dh-lp-name { font-size: 13px; font-weight: 600; color: var(--text); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dh-lp-name.locked { color: rgba(15,36,33,0.3); }
        .dh-lp-status { font-size: 10px; color: var(--muted); margin-top: 1px; }
        .dh-lp-pct { font-size: 13px; font-weight: 700; flex-shrink: 0; }
        .dh-pb-track { height: 5px; background: rgba(15,36,33,0.08); border-radius: 99px; overflow: hidden; margin-left: 42px; }
        .dh-pb-fill { height: 100%; border-radius: 99px; transition: width 0.9s cubic-bezier(0.22,1,0.36,1); }
        .dh-lp-viewall {
          display: block; margin-top: 18px; width: 100%; padding: 11px;
          background: none; border: 1.5px solid var(--border); border-radius: 10px;
          font-family: var(--font-b); font-size: 12px; font-weight: 600; color: var(--muted);
          cursor: pointer; transition: all 0.15s; text-align: center; text-decoration: none;
        }
        .dh-lp-viewall:hover { border-color: var(--teal); color: var(--teal); }

        /* ── Job match ── */
        .dh-jobmatch {
          display: flex; align-items: center; gap: 20px; padding: 22px 24px;
          background: var(--white); border: 1px solid var(--border);
          border-radius: 18px; box-shadow: 0 2px 12px rgba(15,36,33,0.06);
          animation: fadeUp 0.5s both 0.18s;
          position: relative; overflow: hidden;
        }
        .dh-jobmatch::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(135deg, rgba(71,152,128,0.04), rgba(75,149,158,0.02));
        }
        .dh-jm-text { flex: 1; }
        .dh-jm-title { font-family: var(--font-d); font-size: 15px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
        .dh-jm-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }
        .dh-jm-cta {
          flex-shrink: 0; padding: 9px 18px; border: 1.5px solid rgba(71,152,128,0.3);
          border-radius: 9px; color: var(--teal); font-size: 12px; font-weight: 700;
          font-family: var(--font-b); cursor: pointer; background: rgba(71,152,128,0.06);
          transition: all 0.15s; text-decoration: none; white-space: nowrap;
        }
        .dh-jm-cta:hover { background: rgba(71,152,128,0.12); border-color: var(--teal); }

        /* ── Activity ── */
        .dh-activity { animation: fadeUp 0.5s both 0.22s; }
        .dh-activity-list { display: flex; flex-direction: column; gap: 2px; margin-top: 4px; }
        .dh-act-item {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 14px; border-radius: 10px;
          transition: background 0.15s; cursor: default;
        }
        .dh-act-item:hover { background: rgba(15,36,33,0.04); }
        .dh-act-icon {
          width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 14px;
        }
        .dh-act-title { font-size: 13px; font-weight: 600; color: var(--text); }
        .dh-act-sub   { font-size: 11px; color: var(--muted); margin-top: 2px; }
        .dh-act-time  { margin-left: auto; font-size: 11px; color: rgba(15,36,33,0.3); white-space: nowrap; flex-shrink: 0; }

        /* Empty state */
        .dh-empty-state {
          text-align: center; padding: 32px 20px;
          background: rgba(71,152,128,0.04); border-radius: 14px;
          border: 1px dashed rgba(71,152,128,0.2);
        }
        .dh-empty-state p { font-size: 13px; color: var(--muted); line-height: 1.6; margin: 8px 0 16px; }
        .dh-empty-cta {
          display: inline-block; padding: 10px 22px; border-radius: 10px;
          background: linear-gradient(135deg, var(--teal), var(--blue));
          color: #fff; font-size: 13px; font-weight: 700; text-decoration: none;
          transition: all 0.2s;
        }
        .dh-empty-cta:hover { transform: translateY(-1px); }

        @media (max-width: 600px) {
          .dh-root { padding: 20px 16px 40px; }
          .dh-header { flex-direction: column; }
          .dh-header-actions { width: 100%; }
          .dh-jobmatch { flex-direction: column; text-align: center; }
        }
      `}</style>

      <div className={`dh-root ${revealed ? "revealed" : ""}`}>

        {/* ── Header ── */}
        <div className="dh-header">
          <div>
            <h1 className="dh-headline">{greeting.line}</h1>
            <p className="dh-sub">{greeting.sub}</p>
          </div>
          <div className="dh-header-actions">
            <Link href={`/portfolio`} className="dh-btn-outline">View My Portfolio</Link>
            <Link href="/challenges" className="dh-btn-primary">Take a Challenge →</Link>
          </div>
        </div>

        {/* ── Encouragement pills (only show if real data) ── */}
        {hasData && (
          <div className="dh-encourage">
            {stats.overallProgress > 0 && (
              <div className="dh-enc-pill">
                📈 You're <strong>{stats.overallProgress}%</strong> through your roadmap. Keep going — you're building something real.
              </div>
            )}
            {encouragement.challengesThisWeek > 0 && (
              <div className="dh-enc-pill">
                🏆 You completed <strong>{encouragement.challengesThisWeek}</strong> challenge{encouragement.challengesThisWeek !== 1 ? "s" : ""}. That's {encouragement.challengesThisWeek} more proof{encouragement.challengesThisWeek !== 1 ? "s" : ""} of skill in your portfolio.
              </div>
            )}
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="dh-stats">
          <StatCard icon="🏅" rawValue={stats.skillsMastered} displayValue={String(stats.skillsMastered)} label="Skills Mastered" color="#479880" delay={0} />
          <StatCard icon="⚡" rawValue={stats.challengesDone} displayValue={String(stats.challengesDone)} label="Challenges Completed" color="#4B959E" delay={60} />
          <StatCard icon="📈" rawValue={stats.overallProgress} displayValue={`${stats.overallProgress}%`} label="Overall Progress" color="#479880" delay={120} />
          <StatCard icon="🗂️" rawValue={stats.portfolioItems} displayValue={String(stats.portfolioItems)} label="Portfolio Items" color="#4B959E" delay={180} />
        </div>

        {/* ── Middle: Current Challenge + Learning Path ── */}
        <div className="dh-mid">
          {/* Current Challenge */}
          <div className="dh-panel dh-panel-body">
            <div className="dh-panel-title">
              <span>Current Challenge</span>
              {currentChallenge
                ? <span className="dh-panel-badge dh-badge-active">{challengeProgress > 0 ? "In Progress" : "Not Started"}</span>
                : <span className="dh-panel-badge dh-badge-none">None Active</span>
              }
            </div>

            {currentChallenge ? (
              <>
                <div className="dh-challenge-inner">
                  <div className="dh-ch-icon">⚡</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="dh-ch-title">{currentChallenge.title}</div>
                    <div className="dh-ch-desc">{currentChallenge.description || "Complete this challenge to advance your roadmap."}</div>
                    <div className="dh-ch-meta">
                      {currentChallenge.estimatedHours > 0 && <span>⏱️ ~{currentChallenge.estimatedHours}h</span>}
                      {currentChallenge.portfolioWorthy && <span>🗂️ Portfolio item</span>}
                    </div>
                    <div className="dh-prog-label">
                      <span>Challenge Progress</span>
                      <span>{challengeProgress}%</span>
                    </div>
                    <div className="dh-prog-track">
                      <div className="dh-prog-fill" style={{ width: `${challengeProgress}%` }} />
                    </div>
                  </div>
                </div>
                <Link href={`/challenges/${currentChallenge.id}`} className="dh-ch-continue">
                  {challengeProgress > 0 ? "Continue Challenge →" : "Start Challenge →"}
                </Link>
              </>
            ) : (
              hasData ? (
                <div className="dh-no-challenge">
                  <span className="dh-no-ch-emoji">🎯</span>
                  All caught up! Check your roadmap for next challenges.
                </div>
              ) : (
                <div className="dh-empty-state">
                  <span style={{ fontSize: 28, display: "block", marginBottom: 8 }}>🚀</span>
                  <p>Complete your assessment to unlock personalised challenges.</p>
                  <Link href="/assessment" className="dh-empty-cta">Start Assessment →</Link>
                </div>
              )
            )}
          </div>

          {/* Learning Path */}
          <div className="dh-panel dh-panel-body">
            <div className="dh-panel-title">Learning Path</div>
            {learningPath.map((step, i) => (
              <div key={i} className="dh-lp-item">
                <div className="dh-lp-row">
                  <div className="dh-lp-dot" style={{ background: `${step.color}14`, border: `1px solid ${step.color}28` }}>
                    {step.pct === 100 ? "✅" : step.locked ? "🔒" : "🕐"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={`dh-lp-name ${step.locked ? "locked" : ""}`}>{step.label}</div>
                    <div className="dh-lp-status">{step.pct === 100 ? "Completed" : step.locked ? "Locked" : step.pct > 0 ? "In Progress" : "Not Started"}</div>
                  </div>
                  <div className="dh-lp-pct" style={{ color: step.locked ? "rgba(15,36,33,0.2)" : step.color }}>{step.pct}%</div>
                </div>
                <ProgressBar pct={step.pct} color={step.color} delay={i * 100} />
              </div>
            ))}
            <Link href="/roadmap" className="dh-lp-viewall">View Full Roadmap →</Link>
          </div>
        </div>

        {/* ── Job Match ── */}
        <div className="dh-jobmatch">
          <RingChart pct={jobMatchPct} />
          <div className="dh-jm-text">
            <div className="dh-jm-title">Job Match Preview</div>
            <div className="dh-jm-desc">
              {jobMatchPct > 0
                ? <>You match <strong style={{ color: "#0f2421" }}>{jobMatchPct}%</strong> of requirements for <strong style={{ color: "#0f2421" }}>{jobTitle}</strong>. Keep completing challenges to improve your score.</>
                : <>Complete your assessment to see how well you match open roles.</>
              }
            </div>
          </div>
          <Link href="/dashboard/find-work" className="dh-jm-cta">Explore Jobs →</Link>
        </div>

        {/* ── Recent Activity ── */}
        <div className="dh-panel dh-panel-body dh-activity">
          <div className="dh-panel-title">Recent Activity</div>
          <div className="dh-activity-list">
            {activity.map((a, i) => (
              <div key={i} className="dh-act-item">
                <div className="dh-act-icon" style={{ background: a.bg }}>{a.icon}</div>
                <div>
                  <div className="dh-act-title">{a.title}</div>
                  <div className="dh-act-sub">{a.sub}</div>
                </div>
                <div className="dh-act-time">{a.time}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
