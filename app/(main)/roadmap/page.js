"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getResourcesForJob } from "@/lib/learn-content";

// ─── localStorage helpers ────────────────────────────────────────────────────
const LS = {
  get:    (key)      => { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; } },
  set:    (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

const KEYS = {
  JOB_SELECTION:     "inklusijobs_job_selection",
  ROADMAP:           "inklusijobs_roadmap",
  COMPLETED_SKILLS:  "inklusijobs_completed_skills",   // string[]  - resource/skill IDs
  ROADMAP_PROGRESS:  "inklusijobs_roadmap_progress",   // { phase1: 0-100, phase2: 0-100, phase3: 0-100, overall: 0-100 }
  SCORING:           "inklusijobs_scoring",
  COMPLETED_CHALLENGES: "inklusijobs_completed_challenges",
};

// ─── Fallback roadmap (if API hasn't been called yet) ─────────────────────────
function buildFallbackRoadmap(jobId) {
  return {
    title: "Your Personalised Learning Roadmap",
    summary: "A step-by-step path to build the skills you need to land your target role.",
    totalWeeks: 12,
    encouragementMessage: "Every resource you complete adds to your verified portfolio. You're building something real.",
    nextStep: "Start with the Beginner resources and check them off as you go.",
    phases: [
      {
        phaseNumber: 1,
        title: "Beginner: Core Foundations",
        milestone: "You can confidently describe what this career path involves and explain key concepts.",
      },
      {
        phaseNumber: 2,
        title: "Intermediate: Applied Skills",
        milestone: "You can apply your skills to real-world scenarios with some guidance.",
      },
      {
        phaseNumber: 3,
        title: "Advanced: Job-Ready Mastery",
        milestone: "You can work independently and handle complex challenges.",
      },
    ],
  };
}

// ─── Fallback resources (if lib/learn-content is empty) ──────────────────────
function buildFallbackResources(jobId) {
  return [
    { id: `${jobId}_r1`, phaseNumber: 1, title: "Introduction to Digital Marketing", platform: "Google Skillshop", type: "course", url: "https://skillshop.withgoogle.com", estimatedHours: 3, isFree: true, language: "English" },
    { id: `${jobId}_r2`, phaseNumber: 1, title: "Content Strategy Fundamentals", platform: "HubSpot Academy", type: "course", url: "https://academy.hubspot.com", estimatedHours: 2, isFree: true, language: "English" },
    { id: `${jobId}_r3`, phaseNumber: 1, title: "Social Media 101", platform: "Coursera", type: "article", url: "https://coursera.org", estimatedHours: 1, isFree: true, language: "English" },
    { id: `${jobId}_r4`, phaseNumber: 2, title: "SEO for Beginners", platform: "Moz", type: "article", url: "https://moz.com/beginners-guide-to-seo", estimatedHours: 2, isFree: true, language: "English" },
    { id: `${jobId}_r5`, phaseNumber: 2, title: "Email Marketing Mastery", platform: "Mailchimp Academy", type: "course", url: "https://mailchimp.com/resources", estimatedHours: 4, isFree: true, language: "English" },
    { id: `${jobId}_r6`, phaseNumber: 3, title: "Advanced Analytics with GA4", platform: "Google Analytics", type: "course", url: "https://analytics.google.com/analytics/academy", estimatedHours: 5, isFree: true, language: "English" },
    { id: `${jobId}_r7`, phaseNumber: 3, title: "Campaign Strategy & Planning", platform: "LinkedIn Learning", type: "course", url: "https://linkedin.com/learning", estimatedHours: 3, isFree: false, language: "English" },
  ];
}

const RESOURCE_ICONS = { video: "▶️", article: "📄", course: "🎓", tool: "🛠️", community: "👥" };

// ─── Save & recalculate progress ──────────────────────────────────────────────
function saveProgress(completedSkills, allResources) {
  const doneSet = new Set(completedSkills);
  const byPhase = {};
  for (const r of allResources) {
    if (!byPhase[r.phaseNumber]) byPhase[r.phaseNumber] = { total: 0, done: 0 };
    byPhase[r.phaseNumber].total++;
    if (doneSet.has(r.id)) byPhase[r.phaseNumber].done++;
  }

  const progress = {};
  let totalR = 0; let doneR = 0;
  for (const [phase, { total, done }] of Object.entries(byPhase)) {
    progress[`phase${phase}`] = total > 0 ? Math.round((done / total) * 100) : 0;
    totalR += total; doneR += done;
  }
  progress.overall = totalR > 0 ? Math.round((doneR / totalR) * 100) : 0;
  LS.set(KEYS.ROADMAP_PROGRESS, progress);
  return progress;
}

// ─── Single resource row ──────────────────────────────────────────────────────
function ResourceRow({ resource, isComplete, onToggle, locked }) {
  return (
    <div className={`rm-resource ${isComplete ? "done" : ""} ${locked ? "locked" : ""}`}>
      <button
        className={`rm-check ${isComplete ? "checked" : ""}`}
        onClick={() => !locked && onToggle(resource.id)}
        disabled={locked}
        aria-label={isComplete ? "Mark incomplete" : "Mark complete"}
      >
        {isComplete && "✓"}
      </button>
      <div className="rm-res-info">
        <div className="rm-res-title-row">
          <a
            href={locked ? undefined : resource.url}
            target={locked ? undefined : "_blank"}
            rel="noopener noreferrer"
            className={`rm-res-title ${locked ? "locked-link" : ""}`}
            onClick={e => locked && e.preventDefault()}
          >
            {RESOURCE_ICONS[resource.type] || "📎"} {resource.title}
          </a>
          {resource.isFree !== false && <span className="rm-badge free">Free</span>}
          {resource.language && resource.language !== "English" && (
            <span className="rm-badge lang">{resource.language}</span>
          )}
        </div>
        <div className="rm-res-meta">
          {resource.platform} · ~{resource.estimatedHours}h
          {resource.accessibilityNotes && <span className="rm-a11y"> · ♿ {resource.accessibilityNotes}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Phase section ────────────────────────────────────────────────────────────
function PhaseSection({ phase, resources, completedSkills, onToggle, isLocked, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const total    = resources.length;
  const done     = resources.filter(r => completedSkills.has(r.id)).length;
  const pct      = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone  = total > 0 && done === total;

  return (
    <div className={`rm-phase ${isLocked ? "rm-phase-locked" : ""} ${allDone ? "rm-phase-done" : ""}`}>
      <button
        className="rm-phase-header"
        onClick={() => !isLocked && setOpen(o => !o)}
        disabled={isLocked}
        aria-expanded={open && !isLocked}
      >
        <div className="rm-phase-num">
          {isLocked ? "🔒" : allDone ? "✓" : phase.phaseNumber}
        </div>
        <div className="rm-phase-meta">
          <div className="rm-phase-top-row">
            <span className="rm-phase-title">{phase.title || `Phase ${phase.phaseNumber}`}</span>
            {!isLocked && <span className="rm-chevron">{open ? "▲" : "▼"}</span>}
          </div>
          <div className="rm-phase-sub">
            {isLocked
              ? <span style={{ color: "#b0bebb" }}>Complete Phase {phase.phaseNumber - 1} to unlock</span>
              : <span>{done}/{total} resources · {pct}%</span>
            }
          </div>
          {!isLocked && (
            <div className="rm-phase-bar-track">
              <div className="rm-phase-bar-fill" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>
      </button>

      {open && !isLocked && (
        <div className="rm-phase-body">
          {/* Resources */}
          <div className="rm-section-label">📚 Learning Resources</div>
          <div className="rm-resources-list">
            {resources.length > 0
              ? resources.map(r => (
                <ResourceRow
                  key={r.id} resource={r}
                  isComplete={completedSkills.has(r.id)}
                  onToggle={onToggle} locked={false}
                />
              ))
              : <p className="rm-empty">Resources for this phase will appear here once your roadmap is generated.</p>
            }
          </div>


        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RoadmapPage() {
  const router = useRouter();

  const [roadmap,         setRoadmap]         = useState(null);
  const [jobId,           setJobId]           = useState(null);
  const [allResources,    setAllResources]     = useState([]);
  const [completedSkills, setCompletedSkills] = useState(new Set());
  const [progress,        setProgress]        = useState({});
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [revealed,        setRevealed]        = useState(false);
  const [unlockedPhases,  setUnlockedPhases]  = useState(new Set([1]));


  // ── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const sel = LS.get(KEYS.JOB_SELECTION);
    if (!sel?.jobId) { router.replace("/job-select"); return; }
    setJobId(sel.jobId);

    // Load roadmap
    const saved = LS.get(KEYS.ROADMAP);
    if (saved) {
      setRoadmap(saved);
    } else {
      fetchRoadmap(sel.jobId);
      return;
    }

    // Load resources
    let resources = [];
    try { resources = getResourcesForJob?.(sel.jobId) || []; } catch {}
    if (!resources.length) resources = buildFallbackResources(sel.jobId);
    setAllResources(resources);

    // Load completed skills
    const completedArr = LS.get(KEYS.COMPLETED_SKILLS) || [];
    const completedSet = new Set(completedArr);
    setCompletedSkills(completedSet);

    // Load progress
    const prog = LS.get(KEYS.ROADMAP_PROGRESS) || saveProgress(completedArr, resources);
    setProgress(prog);

    // Compute unlocked phases (phase N+1 unlocks when all challenges in phase N are done)
    const completedChallenges = new Set(LS.get(KEYS.COMPLETED_CHALLENGES) || []);
    computeUnlocked(completedChallenges, sel.jobId);

    setLoading(false);
    setTimeout(() => setRevealed(true), 100);
  }, [router]);

  async function fetchRoadmap(jId) {
    setLoading(true);
    try {
      const scoring = LS.get(KEYS.SCORING);
      const job     = LS.get("inklusijobs_job_for_roadmap");

      let roadmapData;
      if (scoring && job) {
        const res = await fetch("/api/roadmap/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scoring, job }),
        });
        if (res.ok) {
          const data = await res.json();
          roadmapData = data?.roadmap;
        }
      }

      if (!roadmapData) roadmapData = buildFallbackRoadmap(jId);
      LS.set(KEYS.ROADMAP, roadmapData);
      setRoadmap(roadmapData);

      let resources = [];
      try { resources = getResourcesForJob?.(jId) || []; } catch {}
      if (!resources.length) resources = buildFallbackResources(jId);
      setAllResources(resources);

      const completedArr = LS.get(KEYS.COMPLETED_SKILLS) || [];
      setCompletedSkills(new Set(completedArr));
      setProgress(saveProgress(completedArr, resources));

      setLoading(false);
      setTimeout(() => setRevealed(true), 100);
    } catch (e) {
      setError("Something went wrong building your roadmap. Please try again.");
      setLoading(false);
    }
  }

  function computeUnlocked(completedChallenges, jId) {
    const unlocked = new Set([1]);
    [1, 2, 3].forEach(phase => {
      const anyPhaseDone = Array.from(completedChallenges).some(id => id.includes(`_c${phase}`));
      if (anyPhaseDone) unlocked.add(phase + 1);
    });
    setUnlockedPhases(unlocked);
  }

  const handleToggle = useCallback((resourceId) => {
    setCompletedSkills(prev => {
      const next = new Set(prev);
      if (next.has(resourceId)) next.delete(resourceId); else next.add(resourceId);
      const arr = Array.from(next);
      LS.set(KEYS.COMPLETED_SKILLS, arr);
      const p = saveProgress(arr, allResources);
      setProgress(p);
      return next;
    });
  }, [allResources]);

  // ── Computed stats ──────────────────────────────────────────────────────────
  const totalResources = allResources.length;
  const doneResources  = completedSkills.size;
  const overallPct     = progress.overall || 0;

  if (loading) {
    return (
      <div className="rm-loading-screen">
        <RoadmapStyles />
        <div className="rm-loading-card">
          <div className="rm-spinner" />
          <h2>Building your personalised roadmap…</h2>
          <p>This takes about 15 seconds. 🌟</p>
          <div className="rm-loading-steps">
            <div className="rm-lstep done">✅ Assessment complete</div>
            <div className="rm-lstep done">✅ Skills scored</div>
            <div className="rm-lstep active">⚙️ Generating roadmap…</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rm-loading-screen">
        <RoadmapStyles />
        <div className="rm-loading-card">
          <p style={{ fontSize: "2.5rem" }}>😔</p>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="rm-btn-primary" onClick={() => { setError(null); setLoading(true); fetchRoadmap(jobId); }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!roadmap) return null;

  return (
    <>
      <RoadmapStyles />
      <div className={`rm-root ${revealed ? "revealed" : ""}`}>

        {/* Top bar */}
        <div className="rm-topbar">
          <button className="rm-back-btn" onClick={() => router.push("/results")}>← Results</button>
          <span className="rm-logo">Inklusi<span>Jobs</span></span>
          <div className="rm-topbar-right">
            <button className="rm-dash-btn" onClick={() => router.push("/dashboard/worker")}>
              Dashboard →
            </button>
          </div>
        </div>

        <div className="rm-shell">
          {/* Header */}
          <div className="rm-header">
            <div className="rm-header-badge">Your Personalised Roadmap</div>
            <h1 className="rm-header-title">{roadmap.title}</h1>
            <p className="rm-header-summary">{roadmap.summary}</p>

            {/* Stats */}
            <div className="rm-stats-row">
              <div className="rm-stat"><span className="rm-stat-v">{roadmap.totalWeeks || "—"}</span><span className="rm-stat-l">Weeks</span></div>
              <div className="rm-stat-div" />
              <div className="rm-stat"><span className="rm-stat-v">{doneResources}/{totalResources}</span><span className="rm-stat-l">Resources</span></div>
              <div className="rm-stat-div" />
              <div className="rm-stat"><span className="rm-stat-v">{overallPct}%</span><span className="rm-stat-l">Progress</span></div>
            </div>

            {/* Overall bar */}
            <div className="rm-overall-wrap">
              <div className="rm-overall-row">
                <span>Overall Progress</span>
                <span>{overallPct}%</span>
              </div>
              <div className="rm-overall-track">
                <div className="rm-overall-fill" style={{ width: `${overallPct}%` }} />
              </div>
            </div>
          </div>

          {/* Encouragement */}
          {roadmap.encouragementMessage && (
            <div className="rm-encourage">
              <span>💬</span>
              <p>{roadmap.encouragementMessage}</p>
            </div>
          )}

          {/* Next step */}
          {roadmap.nextStep && (
            <div className="rm-nextstep">
              <span className="rm-nextstep-label">Start Today</span>
              <p className="rm-nextstep-text">{roadmap.nextStep}</p>
            </div>
          )}

          {/* Phases */}
          <div className="rm-phases-label">Your Learning Phases</div>
          <div className="rm-phases-list">
            {roadmap.phases?.map((phase, i) => {
              const phaseResources = allResources.filter(r => r.phaseNumber === phase.phaseNumber);
              const isLocked = !unlockedPhases.has(phase.phaseNumber);
              return (
                <PhaseSection
                  key={phase.phaseNumber}
                  phase={phase}
                  resources={phaseResources}
                  completedSkills={completedSkills}
                  onToggle={handleToggle}
                  isLocked={isLocked}
                  defaultOpen={i === 0}
                />
              );
            })}
          </div>

          {/* Bottom CTAs */}
          <div className="rm-cta-row">
            <button className="rm-btn-secondary" onClick={() => router.push("/results")}>← Back to Results</button>
            <button className="rm-btn-secondary" onClick={() => {
              LS.set(KEYS.ROADMAP, null);
              setRoadmap(null);
              setLoading(true);
              fetchRoadmap(jobId);
            }}>
              Regenerate ↺
            </button>
            <button className="rm-btn-primary" onClick={() => router.push("/dashboard/worker")}>
              Go to Dashboard →
            </button>
          </div>

          <p className="rm-footer">🔒 Your progress is saved automatically as you check off skills.</p>
        </div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
function RoadmapStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --teal: #479880; --blue: #4B959E; --bg: #f4f9f8;
        --white: #ffffff; --text: #0f2421; --muted: #6b8a87;
        --border: #e4ecea;
        --font-d: 'Plus Jakarta Sans', sans-serif; --font-b: 'Plus Jakarta Sans', sans-serif;
      }
      body { background: var(--bg); }

      @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

      .rm-root { min-height: 100vh; background: var(--bg); font-family: var(--font-b); opacity:0; transition: opacity 0.4s ease; }
      .rm-root.revealed { opacity: 1; }

      /* Topbar */
      .rm-topbar {
        position: sticky; top: 0; z-index: 50;
        background: rgba(244,249,248,0.92); backdrop-filter: blur(14px);
        border-bottom: 1px solid var(--border);
        padding: 14px 24px; display: flex; align-items: center; gap: 16px;
      }
      .rm-back-btn {
        background: none; border: 1.5px solid var(--border); border-radius: 8px;
        padding: 6px 14px; font-family: var(--font-b); font-size: 13px; font-weight: 600;
        color: var(--muted); cursor: pointer; transition: all 0.15s;
      }
      .rm-back-btn:hover { border-color: var(--teal); color: var(--teal); }
      .rm-logo { font-family: var(--font-d); font-size: 16px; font-weight: 800; color: var(--text); letter-spacing: -0.3px; }
      .rm-logo span { color: var(--teal); }
      .rm-topbar-right { margin-left: auto; }
      .rm-dash-btn {
        background: linear-gradient(135deg, var(--teal), var(--blue));
        border: none; border-radius: 8px; padding: 7px 16px;
        font-family: var(--font-b); font-size: 12px; font-weight: 700;
        color: #fff; cursor: pointer; transition: all 0.15s;
        box-shadow: 0 2px 8px rgba(71,152,128,0.3);
      }
      .rm-dash-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(71,152,128,0.35); }

      /* Shell */
      .rm-shell { max-width: 680px; margin: 0 auto; padding: 28px 24px 60px; }

      /* Header */
      .rm-header {
        background: var(--white); border-radius: 20px; padding: 24px;
        margin-bottom: 16px; border: 1px solid rgba(71,152,128,0.12);
        box-shadow: 0 2px 16px rgba(71,152,128,0.07);
        animation: fadeUp 0.4s both;
      }
      .rm-header-badge {
        display: inline-block; padding: 3px 12px;
        background: linear-gradient(135deg, #e8f6f2, #e4f2f5);
        color: var(--blue); border-radius: 99px; font-size: 11px; font-weight: 700;
        text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 10px;
      }
      .rm-header-title { font-family: var(--font-d); font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.3px; margin-bottom: 8px; line-height: 1.25; }
      .rm-header-summary { font-size: 13px; color: var(--muted); line-height: 1.65; margin-bottom: 16px; }

      .rm-stats-row { display: flex; align-items: center; background: #f8fffe; border-radius: 10px; padding: 12px 16px; border: 1px solid var(--border); margin-bottom: 14px; }
      .rm-stat { flex: 1; text-align: center; }
      .rm-stat-v { display: block; font-size: 18px; font-weight: 800; color: var(--text); font-family: var(--font-d); }
      .rm-stat-l { display: block; font-size: 10px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
      .rm-stat-div { width: 1px; height: 30px; background: var(--border); flex-shrink: 0; }

      .rm-overall-wrap { }
      .rm-overall-row { display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; color: var(--muted); margin-bottom: 5px; }
      .rm-overall-row span:last-child { color: var(--teal); font-weight: 700; }
      .rm-overall-track { height: 7px; background: rgba(71,152,128,0.10); border-radius: 99px; overflow: hidden; }
      .rm-overall-fill { height: 100%; background: linear-gradient(90deg, var(--teal), var(--blue)); border-radius: 99px; transition: width 1s cubic-bezier(0.22,1,0.36,1); }

      /* Encouragement */
      .rm-encourage {
        display: flex; gap: 10px; align-items: flex-start;
        background: linear-gradient(135deg, #f0faf7, #ebf7f8);
        border-radius: 12px; padding: 14px 16px; margin-bottom: 12px;
        border: 1px solid #c8e8df;
        animation: fadeUp 0.4s both 0.08s;
      }
      .rm-encourage span { font-size: 18px; flex-shrink: 0; }
      .rm-encourage p { font-size: 13px; color: #2d5f55; line-height: 1.6; font-style: italic; }

      /* Next step */
      .rm-nextstep {
        background: linear-gradient(135deg, #0f2421, #1a3d35);
        border-radius: 12px; padding: 14px 18px; margin-bottom: 20px;
        animation: fadeUp 0.4s both 0.12s;
      }
      .rm-nextstep-label { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #479880; margin-bottom: 4px; }
      .rm-nextstep-text { font-size: 13px; color: #e8f6f2; line-height: 1.6; font-weight: 500; }

      /* Phases label */
      .rm-phases-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); margin-bottom: 10px; }
      .rm-phases-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }

      /* Phase */
      .rm-phase { background: var(--white); border-radius: 16px; border: 1.5px solid var(--border); overflow: hidden; transition: border-color 0.2s; animation: fadeUp 0.5s both; }
      .rm-phase:hover:not(.rm-phase-locked) { border-color: rgba(71,152,128,0.3); }
      .rm-phase-done { border-color: rgba(71,152,128,0.25); }
      .rm-phase-locked { background: #fafafa; opacity: 0.75; }

      .rm-phase-header {
        display: flex; align-items: center; gap: 14px;
        padding: 16px 18px; background: none; border: none;
        cursor: pointer; width: 100%; text-align: left; font-family: var(--font-b);
      }
      .rm-phase-header:disabled { cursor: not-allowed; }
      .rm-phase-num {
        width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, var(--teal), var(--blue));
        color: #fff; font-weight: 800; font-size: 14px;
      }
      .rm-phase-locked .rm-phase-num { background: #e4ecea; color: #7a9b97; }
      .rm-phase-done .rm-phase-num { background: rgba(71,152,128,0.15); color: var(--teal); border: 2px solid rgba(71,152,128,0.3); }

      .rm-phase-meta { flex: 1; }
      .rm-phase-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
      .rm-phase-title { font-family: var(--font-d); font-size: 14px; font-weight: 700; color: var(--text); }
      .rm-phase-sub { font-size: 11px; color: var(--muted); margin-bottom: 5px; }
      .rm-chevron { font-size: 10px; color: var(--muted); }
      .rm-phase-bar-track { height: 4px; background: rgba(71,152,128,0.10); border-radius: 99px; overflow: hidden; }
      .rm-phase-bar-fill { height: 100%; background: linear-gradient(90deg, var(--teal), var(--blue)); border-radius: 99px; transition: width 0.7s ease; }

      /* Phase body */
      .rm-phase-body { padding: 0 18px 18px; border-top: 1px solid var(--border); padding-top: 16px; }
      .rm-section-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); margin-bottom: 8px; }

      /* Resource rows */
      .rm-resources-list { display: flex; flex-direction: column; gap: 6px; }
      .rm-resource {
        display: flex; align-items: center; gap: 10px;
        padding: 10px 12px; background: #f8fffe; border: 1px solid var(--border);
        border-radius: 10px; transition: all 0.15s;
      }
      .rm-resource.done { background: rgba(71,152,128,0.06); border-color: rgba(71,152,128,0.2); }
      .rm-resource.locked { opacity: 0.5; }

      .rm-check {
        width: 22px; height: 22px; border-radius: 6px;
        border: 2px solid #c5d9d6; background: var(--white);
        display: flex; align-items: center; justify-content: center;
        font-size: 12px; font-weight: 800; color: #fff;
        cursor: pointer; flex-shrink: 0; transition: all 0.15s;
      }
      .rm-check.checked { background: var(--teal); border-color: var(--teal); }
      .rm-check:disabled { opacity: 0.4; cursor: not-allowed; }

      .rm-res-info { flex: 1; min-width: 0; }
      .rm-res-title-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 3px; }
      .rm-res-title { font-size: 13px; font-weight: 600; color: var(--text); text-decoration: none; transition: color 0.15s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 280px; }
      .rm-res-title:hover { color: var(--teal); }
      .rm-res-title.locked-link { color: #b0bebb; cursor: not-allowed; }
      .rm-res-meta { font-size: 11px; color: var(--muted); }
      .rm-a11y { color: #8891C9; }
      .rm-badge { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px; }
      .rm-badge.free { background: rgba(71,152,128,0.1); color: var(--teal); border: 1px solid rgba(71,152,128,0.2); }
      .rm-badge.lang { background: rgba(100,143,191,0.1); color: #648FBF; }
      .rm-empty { font-size: 12px; color: var(--muted); padding: 8px 0; font-style: italic; }


      /* CTAs */
      .rm-cta-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
      .rm-btn-primary {
        background: linear-gradient(135deg, var(--teal), var(--blue));
        border: none; border-radius: 10px; padding: 11px 22px;
        font-family: var(--font-b); font-size: 13px; font-weight: 700; color: #fff;
        cursor: pointer; transition: all 0.2s; box-shadow: 0 3px 12px rgba(71,152,128,0.3);
      }
      .rm-btn-primary:hover { transform: translateY(-1px); }
      .rm-btn-secondary {
        background: none; border: 1.5px solid var(--border); border-radius: 10px;
        padding: 11px 18px; font-family: var(--font-b); font-size: 13px; font-weight: 600;
        color: var(--muted); cursor: pointer; transition: all 0.15s;
      }
      .rm-btn-secondary:hover { border-color: var(--teal); color: var(--teal); }

      .rm-footer { text-align: center; font-size: 12px; color: var(--muted); }

      /* Loading */
      .rm-loading-screen { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; font-family: var(--font-b); padding: 2rem; }
      .rm-loading-card { background: var(--white); border-radius: 20px; padding: 40px 32px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 12px 48px rgba(71,152,128,0.12); }
      .rm-loading-card h2 { font-family: var(--font-d); font-size: 20px; font-weight: 800; color: var(--text); margin: 20px 0 8px; }
      .rm-loading-card p { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 20px; }
      .rm-spinner { width: 48px; height: 48px; border: 4px solid #e8f0ef; border-top-color: var(--teal); border-radius: 50%; animation: spin 0.9s linear infinite; margin: 0 auto; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .rm-loading-steps { display: flex; flex-direction: column; gap: 8px; text-align: left; background: #f8fffe; border-radius: 10px; padding: 12px 16px; }
      .rm-lstep { font-size: 13px; font-weight: 500; color: var(--muted); }
      .rm-lstep.active { color: var(--teal); font-weight: 700; }
      .rm-lstep.done { color: #4a6360; }

      @media (max-width: 480px) {
        .rm-cta-row { flex-direction: column; }
        .rm-btn-primary, .rm-btn-secondary { width: 100%; text-align: center; }
      }
    `}</style>
  );
}