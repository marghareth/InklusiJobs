"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getChallengeForPhase } from "@/lib/learn-content";

// ─── localStorage helpers ────────────────────────────────────────────────────
const LS = {
  get: (key) => { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

const KEYS = {
  JOB_SELECTION:      "inklusijobs_job_selection",
  COMPLETED_CHALLENGES: "inklusijobs_completed_challenges", // string[] of challengeIds
  CURRENT_CHALLENGE:  "inklusijobs_current_challenge",
  ROADMAP_PROGRESS:   "inklusijobs_roadmap_progress",
  SCORING:            "inklusijobs_scoring",
};

// ─── Static fallback challenges (if lib/learn-content doesn't return any) ────
function buildFallbackChallenges(jobId) {
  return [
    {
      id: `${jobId}_c1`, phaseNumber: 1, phaseLabel: "Phase 1: Foundation",
      title: "Build a Content Calendar", briefSummary: "Create a 30-day social media content calendar for a fictional brand, including post topics, content types, and scheduling logic.",
      estimatedHours: 3, difficulty: "Beginner", points: 150, portfolioWorthy: true,
      skills: ["Planning", "Content Strategy"],
    },
    {
      id: `${jobId}_c2`, phaseNumber: 1, phaseLabel: "Phase 1: Foundation",
      title: "Write Social Media Captions", briefSummary: "Write 10 engaging captions for different platforms (Instagram, LinkedIn, Twitter) for a brand of your choice.",
      estimatedHours: 2, difficulty: "Beginner", points: 100, portfolioWorthy: true,
      skills: ["Copywriting", "Tone of Voice"],
    },
    {
      id: `${jobId}_c3`, phaseNumber: 1, phaseLabel: "Phase 1: Foundation",
      title: "Create Brand Guidelines", briefSummary: "Develop a simple brand guideline document including logo usage rules, color palette, typography, and voice guidelines.",
      estimatedHours: 4, difficulty: "Beginner", points: 200, portfolioWorthy: true,
      skills: ["Branding", "Design Thinking"],
    },
    {
      id: `${jobId}_c4`, phaseNumber: 2, phaseLabel: "Phase 2: Intermediate",
      title: "Strategic Campaign Plan", briefSummary: "Plan a full 3-month marketing campaign including goals, channels, budget allocation, and KPIs.",
      estimatedHours: 5, difficulty: "Intermediate", points: 250, portfolioWorthy: true,
      skills: ["Strategy", "Analytics"],
    },
    {
      id: `${jobId}_c5`, phaseNumber: 2, phaseLabel: "Phase 2: Intermediate",
      title: "Audience Analysis Report", briefSummary: "Research and document a target audience persona with demographics, pain points, and content preferences.",
      estimatedHours: 3, difficulty: "Intermediate", points: 200, portfolioWorthy: false,
      skills: ["Research", "Data Analysis"],
    },
    {
      id: `${jobId}_c6`, phaseNumber: 3, phaseLabel: "Phase 3: Advanced",
      title: "End-to-End Campaign Execution", briefSummary: "Design and document a full go-to-market launch campaign with creative briefs, timelines, and measurement frameworks.",
      estimatedHours: 8, difficulty: "Advanced", points: 400, portfolioWorthy: true,
      skills: ["Campaign Management", "Leadership"],
    },
  ];
}

// ─── Group challenges by phase ────────────────────────────────────────────────
function groupByPhase(challenges) {
  const map = new Map();
  for (const c of challenges) {
    if (!map.has(c.phaseNumber)) {
      map.set(c.phaseNumber, { phaseNumber: c.phaseNumber, label: c.phaseLabel || `Phase ${c.phaseNumber}`, challenges: [] });
    }
    map.get(c.phaseNumber).challenges.push(c);
  }
  return Array.from(map.values()).sort((a, b) => a.phaseNumber - b.phaseNumber);
}

// ─── Derive locked/unlocked state ─────────────────────────────────────────────
// Rule: each challenge in a phase locks the NEXT challenge in the same phase.
//       The first challenge of a new phase is locked until the last challenge
//       of the previous phase is completed.
function computeStatuses(phases, completed) {
  const done = new Set(completed || []);
  const result = [];

  for (let pi = 0; pi < phases.length; pi++) {
    const phase = phases[pi];
    const prevPhase = phases[pi - 1];
    // Phase unlocked if it's the first phase OR the last challenge of prev phase is done
    const phaseUnlocked = pi === 0 || (prevPhase && done.has(prevPhase.challenges[prevPhase.challenges.length - 1]?.id));

    const phaseChallenges = [];
    for (let ci = 0; ci < phase.challenges.length; ci++) {
      const c = phase.challenges[ci];
      let status;
      if (done.has(c.id)) {
        status = "completed";
      } else if (!phaseUnlocked) {
        status = "locked";
      } else if (ci === 0) {
        status = "available"; // first of an unlocked phase
      } else {
        // Unlocked only if previous challenge in same phase is done
        status = done.has(phase.challenges[ci - 1]?.id) ? "available" : "locked";
      }
      phaseChallenges.push({ ...c, status });
    }
    result.push({ ...phase, challenges: phaseChallenges, phaseUnlocked });
  }
  return result;
}

// ─── Difficulty config ────────────────────────────────────────────────────────
const DIFFICULTY_CONFIG = {
  Beginner:     { color: "#34d399", bg: "rgba(52,211,153,0.10)", label: "Beginner" },
  Intermediate: { color: "#f59e0b", bg: "rgba(245,158,11,0.10)", label: "Intermediate" },
  Advanced:     { color: "#f87171", bg: "rgba(248,113,113,0.10)", label: "Advanced" },
};

// ─── Single challenge step ────────────────────────────────────────────────────
function ChallengeStep({ challenge, index, isLastInPhase, onClick }) {
  const diff = DIFFICULTY_CONFIG[challenge.difficulty] || DIFFICULTY_CONFIG.Beginner;
  const isAvailable  = challenge.status === "available";
  const isCompleted  = challenge.status === "completed";
  const isLocked     = challenge.status === "locked";

  return (
    <div className={`cs-step ${challenge.status}`} style={{ animationDelay: `${index * 60}ms` }}>
      {/* Connector line */}
      {!isLastInPhase && <div className="cs-connector" />}

      {/* Node */}
      <div className="cs-node-col">
        <div className={`cs-node ${challenge.status}`}>
          {isCompleted ? "✓" : isLocked ? "🔒" : index + 1}
        </div>
      </div>

      {/* Card */}
      <div
        className={`cs-card ${challenge.status}`}
        onClick={() => isAvailable && onClick(challenge)}
        role={isAvailable ? "button" : undefined}
        tabIndex={isAvailable ? 0 : undefined}
        onKeyDown={e => e.key === "Enter" && isAvailable && onClick(challenge)}
      >
        <div className="cs-card-top">
          <div className="cs-card-left">
            <div className="cs-card-title">{challenge.title}</div>
            <div className="cs-card-desc">{challenge.briefSummary}</div>
          </div>
          {isAvailable && (
            <div className="cs-arrow">→</div>
          )}
          {isCompleted && (
            <div className="cs-done-badge">✅ Done</div>
          )}
        </div>

        <div className="cs-card-meta">
          <span className="cs-meta-tag">⏱ ~{challenge.estimatedHours}h</span>
          <span className="cs-meta-tag points">🏆 {challenge.points} pts</span>
          <span className="cs-meta-tag" style={{ color: diff.color, background: diff.bg }}>
            {diff.label}
          </span>
          {challenge.portfolioWorthy && (
            <span className="cs-meta-tag portfolio">📁 Portfolio</span>
          )}
          {challenge.skills?.map(s => (
            <span key={s} className="cs-meta-tag skill">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Phase group (collapsible) ───────────────────────────────────────────────
function PhaseGroup({ phase, onChallengeClick, phaseIndex }) {
  const total     = phase.challenges.length;
  const done      = phase.challenges.filter(c => c.status === "completed").length;
  const pct       = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone   = done === total;
  const hasActive = phase.challenges.some(c => c.status === "available");
  const isLocked  = !phase.phaseUnlocked;

  // Default open if phase has an active challenge, or it's the first phase
  const [open, setOpen] = useState(hasActive || phaseIndex === 0);

  return (
    <div className={`pg-group ${isLocked ? "pg-locked" : ""}`} style={{ animationDelay: `${phaseIndex * 100}ms` }}>
      {/* Phase header — clickable toggle */}
      <button
        className={`pg-header pg-toggle ${isLocked ? "pg-toggle-disabled" : ""}`}
        onClick={() => !isLocked && setOpen(o => !o)}
        disabled={isLocked}
        aria-expanded={open && !isLocked}
      >
        <div className="pg-header-left">
          <div className={`pg-phase-badge ${allDone ? "done" : hasActive ? "active" : isLocked ? "locked" : "inactive"}`}>
            {allDone ? "✓ Complete" : isLocked ? "🔒 Locked" : `Phase ${phase.phaseNumber}`}
          </div>
          <h2 className="pg-phase-title">{phase.label}</h2>
        </div>
        <div className="pg-header-right">
          {!isLocked && (
            <div className="pg-progress-wrap">
              <span className="pg-pct">{done}/{total}</span>
              <div className="pg-bar-track">
                <div className="pg-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}
          {!isLocked && (
            <span className="pg-chevron" aria-hidden="true">{open ? "▲" : "▼"}</span>
          )}
        </div>
      </button>

      {/* Steps — only shown when open and not locked */}
      {open && !isLocked && (
        <div className="pg-steps">
          {phase.challenges.map((c, i) => (
            <ChallengeStep
              key={c.id}
              challenge={c}
              index={i}
              isLastInPhase={i === phase.challenges.length - 1}
              onClick={onChallengeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ChallengesPage() {
  const router = useRouter();
  const [jobId,      setJobId]      = useState(null);
  const [phases,     setPhases]     = useState([]);
  const [completed,  setCompleted]  = useState([]);
  const [totalPts,   setTotalPts]   = useState(0);
  const [revealed,   setRevealed]   = useState(false);
  const [toast,      setToast]      = useState(null);

  // Load job + challenges
  useEffect(() => {
    const sel = LS.get(KEYS.JOB_SELECTION);
    if (!sel?.jobId) { router.replace("/job-select"); return; }
    setJobId(sel.jobId);

    const completedIds = LS.get(KEYS.COMPLETED_CHALLENGES) || [];
    setCompleted(completedIds);

    // Build challenges from getChallengeForPhase (phases 1-3), fall back to static
    let rawChallenges = [];
    try {
      [1, 2, 3].forEach(phase => {
        const ch = getChallengeForPhase(sel.jobId, phase);
        if (ch) rawChallenges.push({ ...ch, phaseNumber: phase, phaseLabel: `Phase ${phase}` });
      });
    } catch {}
    if (!rawChallenges.length) rawChallenges = buildFallbackChallenges(sel.jobId);

    const grouped  = groupByPhase(rawChallenges);
    const computed = computeStatuses(grouped, completedIds);
    setPhases(computed);

    // Compute total points
    const pts = completedIds.reduce((sum, id) => {
      const ch = rawChallenges.find(c => c.id === id);
      return sum + (ch?.points || 0);
    }, 0);
    setTotalPts(pts);

    setTimeout(() => setRevealed(true), 80);
  }, [router]);

  const handleChallengeClick = (challenge) => {
    // Save current challenge to localStorage
    LS.set(KEYS.CURRENT_CHALLENGE, {
      id:             challenge.id,
      title:          challenge.title,
      description:    challenge.briefSummary,
      estimatedHours: challenge.estimatedHours,
      portfolioWorthy: challenge.portfolioWorthy,
      points:         challenge.points,
      phase:          challenge.phaseNumber,
      startedAt:      new Date().toISOString(),
    });
    router.push(`/challenges/${challenge.id}`);
  };

  const allChallenges = phases.flatMap(p => p.challenges);
  const totalDone     = allChallenges.filter(c => c.status === "completed").length;
  const totalCount    = allChallenges.length;
  const overallPct    = totalCount > 0 ? Math.round((totalDone / totalCount) * 100) : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --teal:   #479880;
          --blue:   #4B959E;
          --bg:     #f4f9f8;
          --white:  #ffffff;
          --text:   #0f2421;
          --muted:  #6b8a87;
          --border: #e4ecea;
          --font-d: 'Plus Jakarta Sans', sans-serif;
          --font-b: 'Plus Jakarta Sans', sans-serif;
        }

        body { background: var(--bg); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Shell ── */
        .ch-root {
          min-height: 100vh; background: var(--bg);
          font-family: var(--font-b);
          padding: 0 0 60px;
          opacity: 0; transition: opacity 0.4s ease;
        }
        .ch-root.revealed { opacity: 1; }

        /* ── Top bar ── */
        .ch-topbar {
          position: sticky; top: 0; z-index: 50;
          background: rgba(244,249,248,0.92);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
          padding: 14px 24px;
          display: flex; align-items: center; gap: 16px;
        }
        .ch-back-btn {
          background: none; border: 1.5px solid var(--border);
          border-radius: 8px; padding: 6px 14px;
          font-family: var(--font-b); font-size: 13px; font-weight: 600;
          color: var(--muted); cursor: pointer; transition: all 0.15s;
        }
        .ch-back-btn:hover { border-color: var(--teal); color: var(--teal); }
        .ch-topbar-logo {
          font-family: var(--font-d); font-size: 16px; font-weight: 800;
          color: var(--text); letter-spacing: -0.3px;
        }
        .ch-topbar-logo span { color: var(--teal); }
        .ch-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
        .ch-pts-badge {
          background: linear-gradient(135deg, #fff8eb, #fff3e0);
          border: 1.5px solid #f0d5b0; border-radius: 99px;
          padding: 5px 14px; font-size: 12px; font-weight: 700;
          color: #c47a3a;
        }

        /* ── Header ── */
        .ch-header {
          max-width: 700px; margin: 0 auto;
          padding: 32px 24px 20px;
          animation: fadeUp 0.4s both;
        }
        .ch-page-badge {
          display: inline-block; padding: 4px 12px;
          background: linear-gradient(135deg, #e8f6f2, #e4f2f5);
          color: var(--blue); border-radius: 99px;
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.07em; margin-bottom: 12px;
        }
        .ch-page-title {
          font-family: var(--font-d); font-size: 28px; font-weight: 800;
          color: var(--text); letter-spacing: -0.5px; line-height: 1.2;
          margin-bottom: 8px;
        }
        .ch-page-sub { font-size: 14px; color: var(--muted); line-height: 1.65; margin-bottom: 20px; }

        /* Progress bar */
        .ch-overall-wrap { margin-bottom: 8px; }
        .ch-overall-row {
          display: flex; justify-content: space-between;
          font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 6px;
        }
        .ch-overall-row span:last-child { color: var(--teal); font-weight: 700; }
        .ch-overall-track { height: 7px; background: rgba(71,152,128,0.12); border-radius: 99px; overflow: hidden; }
        .ch-overall-fill {
          height: 100%; border-radius: 99px;
          background: linear-gradient(90deg, var(--teal), var(--blue));
          transition: width 1s cubic-bezier(0.22,1,0.36,1);
        }

        /* ── Content ── */
        .ch-content { max-width: 700px; margin: 0 auto; padding: 0 24px; }

        /* ── Phase group ── */
        .pg-group {
          margin-bottom: 32px;
          animation: fadeUp 0.5s both;
        }
        .pg-group.pg-locked { opacity: 0.65; }

        .pg-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 0; gap: 12px;
        }
        .pg-toggle {
          width: 100%; background: var(--white); border: 1.5px solid var(--border);
          border-radius: 14px; padding: 14px 16px;
          cursor: pointer; font-family: var(--font-b);
          text-align: left; transition: border-color 0.18s, box-shadow 0.18s;
          margin-bottom: 2px;
        }
        .pg-toggle:hover:not(.pg-toggle-disabled) {
          border-color: rgba(71,152,128,0.4);
          box-shadow: 0 2px 10px rgba(71,152,128,0.08);
        }
        .pg-toggle-disabled { cursor: not-allowed; background: #fafafa; opacity: 0.7; }
        .pg-header-left { display: flex; align-items: center; gap: 10px; }
        .pg-header-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .pg-chevron { font-size: 9px; color: var(--muted); flex-shrink: 0; }
        .pg-phase-badge {
          font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em;
          padding: 4px 12px; border-radius: 99px;
        }
        .pg-phase-badge.active { background: rgba(71,152,128,0.12); color: var(--teal); border: 1px solid rgba(71,152,128,0.25); }
        .pg-phase-badge.done   { background: rgba(71,152,128,0.08); color: var(--teal); border: 1px solid rgba(71,152,128,0.2); }
        .pg-phase-badge.locked   { background: rgba(0,0,0,0.06); color: #9aa8a6; border: 1px solid rgba(0,0,0,0.08); }
        .pg-phase-badge.inactive { background: rgba(71,152,128,0.06); color: var(--muted); border: 1px solid rgba(71,152,128,0.15); }
        .pg-phase-title { font-family: var(--font-d); font-size: 15px; font-weight: 700; color: var(--text); }

        .pg-progress-wrap { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .pg-pct { font-size: 12px; font-weight: 700; color: var(--muted); white-space: nowrap; }
        .pg-bar-track { width: 80px; height: 5px; background: rgba(71,152,128,0.10); border-radius: 99px; overflow: hidden; }
        .pg-bar-fill { height: 100%; background: linear-gradient(90deg, var(--teal), var(--blue)); border-radius: 99px; transition: width 0.8s ease; }

        .pg-steps { display: flex; flex-direction: column; gap: 0; margin-top: 8px; }

        /* ── Challenge Step ── */
        .cs-step {
          display: flex; gap: 0; align-items: flex-start;
          position: relative;
          animation: fadeUp 0.4s both;
        }

        .cs-connector {
          position: absolute; left: 15px; top: 38px;
          width: 2px; height: calc(100% - 16px);
          background: var(--border); z-index: 0;
        }
        .cs-step.completed .cs-connector { background: rgba(71,152,128,0.4); }

        /* Node column */
        .cs-node-col { width: 32px; flex-shrink: 0; display: flex; justify-content: center; padding-top: 12px; z-index: 1; }
        .cs-node {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800;
          flex-shrink: 0; transition: all 0.2s;
        }
        .cs-node.completed { background: var(--teal); color: #fff; box-shadow: 0 0 0 4px rgba(71,152,128,0.15); }
        .cs-node.available { background: linear-gradient(135deg, var(--teal), var(--blue)); color: #fff; box-shadow: 0 4px 14px rgba(71,152,128,0.35); }
        .cs-node.locked    { background: #eef4f2; color: #a0b5b2; border: 2px solid var(--border); font-size: 14px; }

        /* Card */
        .cs-card {
          flex: 1; margin: 6px 0 6px 14px;
          background: var(--white); border: 1.5px solid var(--border);
          border-radius: 14px; padding: 16px 18px;
          transition: all 0.18s;
        }
        .cs-card.available {
          cursor: pointer; border-color: rgba(71,152,128,0.3);
          box-shadow: 0 2px 12px rgba(71,152,128,0.08);
        }
        .cs-card.available:hover {
          border-color: var(--teal);
          transform: translateX(3px);
          box-shadow: 0 4px 20px rgba(71,152,128,0.14);
        }
        .cs-card.available:focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }
        .cs-card.completed {
          background: #f0faf7; border-color: rgba(71,152,128,0.25);
          opacity: 0.85;
        }
        .cs-card.locked { background: #fafafa; opacity: 0.6; }

        .cs-card-top { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
        .cs-card-left { flex: 1; min-width: 0; }
        .cs-card-title {
          font-family: var(--font-d); font-size: 14px; font-weight: 700;
          color: var(--text); margin-bottom: 5px; line-height: 1.3;
        }
        .cs-card.locked .cs-card-title { color: #9aa8a6; }
        .cs-card-desc { font-size: 12.5px; color: var(--muted); line-height: 1.6; }
        .cs-card.locked .cs-card-desc { color: #b0bebb; }

        .cs-arrow { font-size: 18px; color: var(--teal); font-weight: 700; flex-shrink: 0; padding-top: 2px; }
        .cs-done-badge {
          font-size: 11px; font-weight: 700; color: var(--teal);
          background: rgba(71,152,128,0.1); padding: 4px 10px; border-radius: 99px;
          flex-shrink: 0; white-space: nowrap;
        }

        .cs-card-meta { display: flex; flex-wrap: wrap; gap: 6px; }
        .cs-meta-tag {
          font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 6px;
          background: #f0f4f3; color: var(--muted); white-space: nowrap;
        }
        .cs-meta-tag.points   { background: rgba(251,191,36,0.1); color: #b07d20; }
        .cs-meta-tag.portfolio { background: rgba(100,143,191,0.1); color: #4a7aad; }
        .cs-meta-tag.skill    { background: rgba(71,152,128,0.08); color: var(--teal); }

        /* ── Toast ── */
        .ch-toast {
          position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
          background: #0f2421; color: #e8f6f2; padding: 12px 24px;
          border-radius: 12px; font-size: 13px; font-weight: 600;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2); z-index: 1000;
          animation: toastIn 0.3s both;
          white-space: nowrap;
        }

        @media (max-width: 480px) {
          .ch-page-title { font-size: 22px; }
          .pg-progress-wrap { display: none; }
        }
      `}</style>

      <div className={`ch-root ${revealed ? "revealed" : ""}`}>
        {/* Toast */}
        {toast && <div className="ch-toast">{toast}</div>}

        {/* Top bar */}
        <div className="ch-topbar">
          <button className="ch-back-btn" onClick={() => router.push("/roadmap")}>← Roadmap</button>
          <span className="ch-topbar-logo">Inklusi<span>Jobs</span></span>
          <div className="ch-topbar-right">
            {totalPts > 0 && (
              <span className="ch-pts-badge">🏆 {totalPts} pts earned</span>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="ch-header">
          <div className="ch-page-badge">⚡ Your Challenges</div>
          <h1 className="ch-page-title">Practical Challenges</h1>
          <p className="ch-page-sub">
            Complete each challenge to unlock the next. Every submission is AI-reviewed and added to your verified portfolio.
          </p>
          <div className="ch-overall-wrap">
            <div className="ch-overall-row">
              <span>Overall Progress — {totalDone} of {totalCount} completed</span>
              <span>{overallPct}%</span>
            </div>
            <div className="ch-overall-track">
              <div className="ch-overall-fill" style={{ width: `${overallPct}%` }} />
            </div>
          </div>
        </div>

        {/* Phase groups */}
        <div className="ch-content">
          {phases.map((phase, i) => (
            <PhaseGroup
              key={phase.phaseNumber}
              phase={phase}
              phaseIndex={i}
              onChallengeClick={handleChallengeClick}
            />
          ))}
        </div>
      </div>
    </>
  );
}