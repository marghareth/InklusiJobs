//app/(main)/roadmap/page.js

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getResourcesForJob, getChallengeForPhase } from "@/lib/learn-content";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function loadRoadmap()   { try { return JSON.parse(localStorage.getItem("inklusijobs_roadmap") || "null"); } catch { return null; } }
function loadJobSel()    { try { return JSON.parse(localStorage.getItem("inklusijobs_job_selection") || "null"); } catch { return null; } }
function loadScoring()   { try { return JSON.parse(localStorage.getItem("inklusijobs_scoring") || "null"); } catch { return null; } }
function loadJobResult() { try { return JSON.parse(localStorage.getItem("inklusijobs_job_for_roadmap") || "null"); } catch { return null; } }

function getPhaseNumbers(phases) { return phases?.map(p => p.phaseNumber) || []; }

// ─── Resource Row ─────────────────────────────────────────────────────────────
function ResourceRow({ resource, isComplete, quizScore, onToggleComplete, jobId, locked }) {
  const router = useRouter();
  const quizPassed = quizScore?.passed;

  return (
    <div className={`resource-row ${isComplete ? "done" : ""} ${locked ? "locked-item" : ""}`}>
      {/* Checkbox */}
      <button
        className={`resource-check ${isComplete ? "checked" : ""}`}
        onClick={() => !locked && onToggleComplete(resource)}
        disabled={locked}
        aria-label={isComplete ? "Mark as incomplete" : "Mark as complete"}
      >
        {isComplete && <span>✓</span>}
      </button>

      {/* Resource info */}
      <div className="resource-info">
        <div className="resource-title-row">
          <a
            href={locked ? undefined : resource.url}
            target={locked ? undefined : "_blank"}
            rel="noopener noreferrer"
            className={`resource-title ${locked ? "locked-link" : ""}`}
            onClick={e => locked && e.preventDefault()}
          >
            {RESOURCE_ICONS[resource.type] || "📎"} {resource.title}
          </a>
          <div className="resource-badges">
            {resource.isFree !== false && <span className="badge free">Free</span>}
            {resource.language !== "English" && <span className="badge lang">{resource.language}</span>}
          </div>
        </div>
        <div className="resource-meta">
          {resource.platform} · ~{resource.estimatedHours}h
          {resource.accessibilityNotes && <span className="resource-a11y"> · ♿ {resource.accessibilityNotes}</span>}
        </div>
      </div>

      {/* Quiz button */}
      {!locked && (
        <div className="resource-quiz-col">
          {quizPassed ? (
            <div className="quiz-passed-badge">✅ {quizScore?.score}%</div>
          ) : (
            <button
              className={`quiz-btn ${isComplete ? "active" : "dim"}`}
              onClick={() => router.push(`/learn/quiz/${resource.id}`)}
            >
              {quizScore ? "Retry Quiz" : "Take Quiz"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Phase Card ───────────────────────────────────────────────────────────────
function PhaseCard({ phase, resources, challenge, progress, locked, index }) {
  const router = useRouter();
  const [open, setOpen] = useState(index === 0);

  const totalResources  = resources.length;
  const doneResources   = resources.filter(r => progress.resourceProgress?.[r.id]?.completed).length;
  const allDone         = totalResources > 0 && doneResources === totalResources;
  const quizAttempts    = progress.quizAttempts || {};
  const challengeResult = progress.challengeAttempts?.[challenge?.id];
  const phasePercent    = totalResources > 0 ? Math.round((doneResources / totalResources) * 100) : 0;

  return (
    <div className={`phase-card ${locked ? "locked" : ""} ${open && !locked ? "open" : ""}`}>
      {/* Phase header */}
      <button className="phase-header" onClick={() => !locked && setOpen(o => !o)} disabled={locked}>
        <div className="phase-num-col">
          <div className={`phase-num ${locked ? "locked-num" : allDone ? "done-num" : ""}`}>
            {locked ? "🔒" : allDone ? "✓" : phase.phaseNumber}
          </div>
        </div>
        <div className="phase-meta">
          <div className="phase-top">
            <span className="phase-title">{phase.title || `Phase ${phase.phaseNumber}`}</span>
            {!locked && <span className="phase-chevron">{open ? "▲" : "▼"}</span>}
          </div>
          <div className="phase-sub">
            {locked
              ? <span className="locked-msg">Complete Phase {phase.phaseNumber - 1} challenge to unlock</span>
              : <span className="phase-progress-text">{doneResources}/{totalResources} resources · {phasePercent}% done</span>
            }
          </div>
          {!locked && (
            <div className="phase-progress-bar-track">
              <div className="phase-progress-bar-fill" style={{ width: `${phasePercent}%` }} />
            </div>
          )}
        </div>
      </button>

      {/* Phase body */}
      {open && !locked && (
        <div className="phase-body">
          {/* Resources */}
          {resources.length > 0 && (
            <div className="phase-section">
              <div className="phase-section-label">📚 Learning Resources</div>
              <div className="resources-list">
                {resources.map(r => (
                  <ResourceRow
                    key={r.id}
                    resource={r}
                    isComplete={!!progress.resourceProgress?.[r.id]?.completed}
                    quizScore={quizAttempts?.[r.id]}
                    onToggleComplete={progress.onToggleResource}
                    jobId={phase.jobId}
                    locked={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Challenge */}
          {challenge && (
            <div className="phase-section">
              <div className="phase-section-label">⚡ Practical Challenge</div>
              <div
                className={`challenge-card ${challengeResult?.passed ? "challenge-done" : ""}`}
                onClick={() => router.push(`/challenges/${challenge.id}`)}
              >
                <div className="challenge-card-left">
                  <div className="challenge-card-title">{challenge.title}</div>
                  <div className="challenge-card-brief">{challenge.briefSummary}</div>
                  <div className="challenge-card-meta">
                    ⏱ ~{challenge.estimatedHours}h · 📁 Portfolio worthy
                    {challenge.skills?.map(s => <span key={s} className="challenge-skill-tag">{s}</span>)}
                  </div>
                </div>
                <div className="challenge-card-right">
                  {challengeResult ? (
                    <div className={`challenge-score-badge ${challengeResult.passed ? "passed" : "failed"}`}>
                      {challengeResult.passed ? "✅" : "❌"} {challengeResult.score}%
                    </div>
                  ) : (
                    <div className="challenge-cta-arrow">View →</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Milestone */}
          {phase.milestone && (
            <div className="phase-milestone">
              <span>🏆</span>
              <div>
                <div className="milestone-label">Phase Milestone</div>
                <div className="milestone-text">{phase.milestone}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RoadmapPage() {
  const router = useRouter();

  const [roadmap, setRoadmap]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [revealed, setRevealed]       = useState(false);
  const [userId, setUserId]           = useState(null);
  const [jobId, setJobId]             = useState(null);
  const [progress, setProgress]       = useState({
    resourceProgress:   {},
    quizAttempts:       {},
    challengeAttempts:  {},
    unlockedPhases:     new Set([1]),
  });

  // ── Load roadmap ────────────────────────────────────────────────────────────
  useEffect(() => {
    const selection = loadJobSel();
    if (!selection?.jobId) { router.replace("/job-select"); return; }
    setJobId(selection.jobId);

    const existing = loadRoadmap();
    if (existing) {
      setRoadmap(existing);
      setLoading(false);
      setTimeout(() => setRevealed(true), 100);
    } else {
      fetchRoadmap(selection.jobId);
    }

    // Get user + load progress
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUserId(data.user.id);
        loadProgress(data.user.id, selection.jobId);
      }
    });
  }, [router]);

  async function fetchRoadmap(jId) {
    setLoading(true);
    try {
      const scoring = loadScoring();
      const job     = loadJobResult();
      if (!scoring || !job) { router.replace("/job-select"); return; }

      const res  = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scoring, job }),
      });
      if (!res.ok) throw new Error("Roadmap generation failed");
      const data = await res.json();
      if (!data?.roadmap) throw new Error("Invalid roadmap response");

      localStorage.setItem("inklusijobs_roadmap", JSON.stringify(data.roadmap));
      setRoadmap(data.roadmap);
      setTimeout(() => setRevealed(true), 100);
    } catch (err) {
      setError("Something went wrong building your roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function loadProgress(uid, jid) {
    try {
      const [resourceRes, quizRes, challengeRes] = await Promise.all([
        supabase.from("user_resource_progress").select("*").eq("user_id", uid).eq("job_id", jid),
        supabase.from("user_quiz_attempts").select("*").eq("user_id", uid).eq("job_id", jid),
        supabase.from("user_challenge_attempts").select("*").eq("user_id", uid).eq("job_id", jid),
      ]);

      const resourceProgress = Object.fromEntries(
        (resourceRes.data || []).map(r => [r.resource_id, { completed: r.completed, completedAt: r.completed_at }])
      );
      const quizAttempts = Object.fromEntries(
        (quizRes.data || []).map(q => [q.resource_id, { score: q.score, passed: q.passed }])
      );
      const challengeAttempts = Object.fromEntries(
        (challengeRes.data || []).map(c => [c.challenge_id, { score: c.score, passed: c.passed }])
      );

      // Compute unlocked phases
      const unlocked = new Set([1]);
      [1, 2, 3, 4].forEach(phase => {
        const cId = `${jid}_challenge_${phase}`;
        if (challengeAttempts[cId]?.passed) unlocked.add(phase + 1);
      });

      setProgress(prev => ({
        ...prev,
        resourceProgress,
        quizAttempts,
        challengeAttempts,
        unlockedPhases: unlocked,
      }));
    } catch (e) {
      console.error("[Roadmap] Progress load error:", e);
    }
  }

  const handleToggleResource = async (resource) => {
    if (!userId) return;
    const isCurrentlyDone = !!progress.resourceProgress?.[resource.id]?.completed;

    // Optimistic update
    setProgress(prev => ({
      ...prev,
      resourceProgress: {
        ...prev.resourceProgress,
        [resource.id]: { completed: !isCurrentlyDone, completedAt: isCurrentlyDone ? null : new Date().toISOString() },
      },
    }));

    try {
      await fetch("/api/progress/resource-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          jobId,
          resourceId:   resource.id,
          phaseNumber:  resource.phaseNumber,
          completed:    !isCurrentlyDone,
        }),
      });
    } catch (e) {
      // Revert on failure
      setProgress(prev => ({
        ...prev,
        resourceProgress: {
          ...prev.resourceProgress,
          [resource.id]: { completed: isCurrentlyDone },
        },
      }));
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="ij-loading-screen">
        <div className="ij-loading-card">
          <div className="ij-spinner" />
          <h2>Building your personalised roadmap…</h2>
          <p>This takes about 15 seconds. 🌟</p>
          <div className="ij-loading-steps">
            <div className="ij-step done">✅ Assessment complete</div>
            <div className="ij-step done">✅ Skills scored</div>
            <div className="ij-step active">⚙️ Generating roadmap…</div>
          </div>
        </div>
        <BaseStyles />
      </div>
    );
  }

  if (error) {
    return (
      <div className="ij-loading-screen">
        <div className="ij-loading-card">
          <p style={{ fontSize: "2.5rem" }}>😔</p>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="ij-btn-primary" onClick={() => { setError(null); setLoading(true); fetchRoadmap(jobId); }}>Try Again</button>
        </div>
        <BaseStyles />
      </div>
    );
  }

  if (!roadmap) return null;

  // ── Compute stats ────────────────────────────────────────────────────────────
  const allResources    = jobId ? getResourcesForJob(jobId) : [];
  const totalResources  = allResources.length;
  const doneResources   = Object.values(progress.resourceProgress).filter(r => r.completed).length;
  const passedQuizzes   = Object.values(progress.quizAttempts).filter(q => q.passed).length;
  const passedChallenges= Object.values(progress.challengeAttempts).filter(c => c.passed).length;
  const overallPercent  = totalResources > 0 ? Math.round((doneResources / totalResources) * 100) : 0;

  const progressWithToggle = { ...progress, onToggleResource: handleToggleResource };

  return (
    <div className={`ij-page ${revealed ? "revealed" : ""}`}>
      <BaseStyles />
      <GlobalStyles />

      <div className="ij-shell">
        {/* Logo */}
        <div className="ij-logo-row">
          <div className="ij-logo-mark">IJ</div>
          <span className="ij-logo-text">InklusiJobs</span>
        </div>

        {/* Header */}
        <div className="ij-roadmap-header">
          <div className="ij-roadmap-badge">Your Personalised Roadmap</div>
          <h1 className="ij-roadmap-title">{roadmap.title}</h1>
          <p className="ij-roadmap-summary">{roadmap.summary}</p>

          {/* Stats */}
          <div className="ij-stats-row">
            <div className="ij-stat">
              <span className="ij-stat-value">{roadmap.totalWeeks}</span>
              <span className="ij-stat-label">Weeks</span>
            </div>
            <div className="ij-stat-div" />
            <div className="ij-stat">
              <span className="ij-stat-value">{doneResources}/{totalResources}</span>
              <span className="ij-stat-label">Resources</span>
            </div>
            <div className="ij-stat-div" />
            <div className="ij-stat">
              <span className="ij-stat-value">{passedQuizzes}</span>
              <span className="ij-stat-label">Quizzes Passed</span>
            </div>
            <div className="ij-stat-div" />
            <div className="ij-stat">
              <span className="ij-stat-value">{passedChallenges}</span>
              <span className="ij-stat-label">Challenges Done</span>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="ij-overall-progress">
            <div className="ij-overall-progress-label">
              <span>Overall Progress</span>
              <span>{overallPercent}%</span>
            </div>
            <div className="ij-overall-bar-track">
              <div className="ij-overall-bar-fill" style={{ width: `${overallPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Encouragement */}
        {roadmap.encouragementMessage && (
          <div className="ij-encouragement">
            <span>💬</span>
            <p>{roadmap.encouragementMessage}</p>
          </div>
        )}

        {/* Start today */}
        {roadmap.nextStep && (
          <div className="ij-next-step">
            <span className="ij-next-step-label">Start Today</span>
            <p className="ij-next-step-text">{roadmap.nextStep}</p>
          </div>
        )}

        {/* Phases */}
        <div className="ij-phases-label">Your Learning Phases</div>
        <div className="ij-phases-list">
          {roadmap.phases?.map((phase, i) => {
            const phaseResources = jobId ? getResourcesForJob(jobId).filter(r => r.phaseNumber === phase.phaseNumber) : [];
            const phaseChallenge = jobId ? getChallengeForPhase(jobId, phase.phaseNumber) : null;
            const isLocked       = !progress.unlockedPhases.has(phase.phaseNumber);

            return (
              <PhaseCard
                key={phase.phaseNumber}
                phase={phase}
                resources={phaseResources}
                challenge={phaseChallenge}
                progress={progressWithToggle}
                locked={isLocked}
                index={i}
              />
            );
          })}
        </div>

        {/* Bottom CTAs */}
        <div className="ij-cta-row">
          <button className="ij-btn-secondary" onClick={() => router.push("/results")}>
            ← Back to Results
          </button>
          <button className="ij-btn-primary" onClick={() => {
            localStorage.removeItem("inklusijobs_roadmap");
            setRoadmap(null);
            fetchRoadmap(jobId);
          }}>
            Regenerate ↺
          </button>
        </div>

        {/* Dashboard Button - ADDED HERE */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              // Get user role from localStorage or default to "worker"
              const role = localStorage.getItem("userRole") || "worker";
              window.location.href = role === "employer" ? "/employer/dashboard" : "/worker/dashboard";
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>

        <p className="ij-footer-note">🔒 Your progress is saved automatically.</p>
      </div>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const RESOURCE_ICONS = {
  video:     "▶️",
  article:   "📄",
  course:    "🎓",
  tool:      "🛠️",
  community: "👥",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
function BaseStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      :root { --teal:#479880; --blue:#4B959E; --bg:#f4f9f8; }
      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      body { background:var(--bg); }
      .ij-loading-screen { min-height:100vh; background:var(--bg); display:flex; align-items:center; justify-content:center; font-family:'Plus Jakarta Sans',sans-serif; padding:2rem; }
      .ij-loading-card { background:white; border-radius:24px; padding:3rem 2.5rem; max-width:440px; width:100%; text-align:center; box-shadow:0 20px 60px rgba(71,152,128,0.12); }
      .ij-loading-card h2 { font-size:1.35rem; font-weight:700; color:#0f2421; margin:1.25rem 0 0.5rem; }
      .ij-loading-card p { font-size:0.9rem; color:#6b8a87; line-height:1.6; margin-bottom:1.5rem; }
      .ij-spinner { width:52px; height:52px; border:4px solid #e8f0ef; border-top-color:#479880; border-radius:50%; animation:spin 0.9s linear infinite; margin:0 auto; }
      @keyframes spin { to { transform:rotate(360deg); } }
      .ij-loading-steps { display:flex; flex-direction:column; gap:0.5rem; text-align:left; background:#f8fffe; border-radius:12px; padding:1rem 1.25rem; }
      .ij-step { font-size:0.85rem; font-weight:500; color:#7a9b97; }
      .ij-step.active { color:#479880; font-weight:700; }
      .ij-step.done { color:#4a6360; }
      .ij-btn-primary { background:linear-gradient(135deg,var(--teal),var(--blue)); border:none; border-radius:12px; padding:0.85rem 2rem; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.92rem; font-weight:700; color:white; cursor:pointer; margin-top:1rem; }
    `}</style>
  );
}

function GlobalStyles() {
  return (
    <style jsx global>{`
      .ij-page { min-height:100vh; background:var(--bg); font-family:'Plus Jakarta Sans',sans-serif; padding:2rem 1.5rem 4rem; display:flex; justify-content:center; opacity:0; transform:translateY(10px); transition:opacity 0.5s ease,transform 0.5s ease; }
      .ij-page.revealed { opacity:1; transform:translateY(0); }
      .ij-shell { width:100%; max-width:680px; }

      .ij-logo-row { display:flex; align-items:center; gap:0.6rem; justify-content:center; margin-bottom:1.75rem; }
      .ij-logo-mark { width:36px; height:36px; background:linear-gradient(135deg,var(--teal),var(--blue)); border-radius:10px; display:flex; align-items:center; justify-content:center; color:white; font-weight:800; font-size:0.85rem; }
      .ij-logo-text { font-weight:700; font-size:1.1rem; color:#0f2421; letter-spacing:-0.02em; }

      /* Header */
      .ij-roadmap-header { background:white; border-radius:24px; padding:1.75rem 2rem; margin-bottom:1rem; box-shadow:0 4px 24px rgba(71,152,128,0.08); border:1px solid rgba(71,152,128,0.1); }
      .ij-roadmap-badge { display:inline-block; padding:0.25rem 0.8rem; background:linear-gradient(135deg,#e8f6f2,#e4f2f5); color:#4B959E; border-radius:999px; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.75rem; }
      .ij-roadmap-title { font-size:1.45rem; font-weight:800; color:#0f2421; letter-spacing:-0.02em; line-height:1.25; margin-bottom:0.6rem; }
      .ij-roadmap-summary { font-size:0.88rem; color:#4a6360; line-height:1.65; margin-bottom:1.25rem; }

      .ij-stats-row { display:flex; align-items:center; background:#f8fffe; border-radius:12px; padding:0.75rem 1rem; border:1px solid #e4ecea; margin-bottom:1rem; }
      .ij-stat { flex:1; text-align:center; }
      .ij-stat-value { display:block; font-size:1rem; font-weight:800; color:#0f2421; }
      .ij-stat-label { display:block; font-size:0.62rem; color:#7a9b97; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; margin-top:0.1rem; }
      .ij-stat-div { width:1px; height:32px; background:#e4ecea; flex-shrink:0; }

      .ij-overall-progress { }
      .ij-overall-progress-label { display:flex; justify-content:space-between; font-size:0.75rem; font-weight:600; color:#7a9b97; margin-bottom:0.4rem; }
      .ij-overall-bar-track { height:8px; background:#eef4f2; border-radius:999px; overflow:hidden; }
      .ij-overall-bar-fill { height:100%; background:linear-gradient(90deg,var(--teal),var(--blue)); border-radius:999px; transition:width 0.8s ease; }

      /* Encouragement */
      .ij-encouragement { display:flex; gap:0.75rem; align-items:flex-start; background:linear-gradient(135deg,#f0faf7,#ebf7f8); border-radius:14px; padding:1rem 1.25rem; margin-bottom:1rem; border:1px solid #c8e8df; }
      .ij-encouragement span { font-size:1.2rem; flex-shrink:0; }
      .ij-encouragement p { font-size:0.88rem; color:#2d5f55; line-height:1.6; font-style:italic; }

      /* Next step */
      .ij-next-step { background:linear-gradient(135deg,#0f2421,#1a3d35); border-radius:14px; padding:1rem 1.4rem; margin-bottom:1.5rem; }
      .ij-next-step-label { display:block; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#479880; margin-bottom:0.3rem; }
      .ij-next-step-text { font-size:0.9rem; color:#e8f6f2; line-height:1.6; font-weight:500; }

      /* Phases */
      .ij-phases-label { font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:#7a9b97; margin-bottom:0.75rem; }
      .ij-phases-list { display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem; }

      /* Phase card */
      .phase-card { background:white; border-radius:18px; border:1.5px solid #e4ecea; overflow:hidden; transition:border-color 0.2s,box-shadow 0.2s; }
      .phase-card.open { border-color:var(--teal); box-shadow:0 4px 20px rgba(71,152,128,0.10); }
      .phase-card.locked { background:#fafafa; border-color:#e8e8e8; opacity:0.8; }
      .phase-header { display:flex; gap:1rem; padding:1.1rem 1.25rem; width:100%; background:none; border:none; cursor:pointer; text-align:left; font-family:inherit; align-items:center; }
      .phase-header:disabled { cursor:not-allowed; }
      .phase-num-col { flex-shrink:0; }
      .phase-num { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,#479880,#4B959E); color:white; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.85rem; }
      .phase-num.locked-num { background:#e4ecea; color:#7a9b97; }
      .phase-num.done-num { background:#f0faf7; color:#479880; border:2px solid #c8e8df; }
      .phase-meta { flex:1; }
      .phase-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem; }
      .phase-title { font-size:0.95rem; font-weight:700; color:#0f2421; }
      .phase-chevron { font-size:0.65rem; color:#7a9b97; }
      .phase-sub { font-size:0.75rem; color:#7a9b97; margin-bottom:0.4rem; }
      .locked-msg { color:#b0b8b6; }
      .phase-progress-bar-track { height:4px; background:#eef4f2; border-radius:999px; overflow:hidden; }
      .phase-progress-bar-fill { height:100%; background:linear-gradient(90deg,var(--teal),var(--blue)); border-radius:999px; transition:width 0.6s ease; }

      /* Phase body */
      .phase-body { padding:0 1.25rem 1.25rem; border-top:1px solid #eef4f2; padding-top:1rem; }
      .phase-section { margin-bottom:1.1rem; }
      .phase-section-label { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#7a9b97; margin-bottom:0.6rem; }

      /* Resources */
      .resources-list { display:flex; flex-direction:column; gap:0.5rem; }
      .resource-row { display:flex; align-items:center; gap:0.75rem; padding:0.75rem; background:#f8fffe; border:1px solid #e4ecea; border-radius:10px; transition:all 0.18s; }
      .resource-row.done { background:#f0faf7; border-color:#c8e8df; }
      .resource-check { width:22px; height:22px; border-radius:6px; border:2px solid #c5d9d6; background:white; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:0.75rem; color:#479880; font-weight:700; transition:all 0.18s; }
      .resource-check.checked { background:#479880; border-color:#479880; color:white; }
      .resource-check:disabled { opacity:0.4; cursor:not-allowed; }
      .resource-info { flex:1; min-width:0; }
      .resource-title-row { display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap; margin-bottom:0.2rem; }
      .resource-title { font-size:0.85rem; font-weight:600; color:#1a2e2b; text-decoration:none; transition:color 0.18s; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:280px; }
      .resource-title:hover { color:var(--teal); }
      .resource-title.locked-link { color:#b0b8b6; cursor:not-allowed; }
      .badge { font-size:0.62rem; font-weight:700; padding:0.1rem 0.45rem; border-radius:4px; white-space:nowrap; }
      .badge.free { background:#f0faf7; color:#479880; border:1px solid #c8e8df; }
      .badge.lang { background:#f0f5fb; color:#648FBF; }
      .resource-meta { font-size:0.73rem; color:#7a9b97; }
      .resource-a11y { color:#8891C9; }
      .resource-quiz-col { flex-shrink:0; }
      .quiz-btn { padding:0.35rem 0.8rem; border-radius:8px; border:none; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.75rem; font-weight:700; cursor:pointer; transition:all 0.18s; }
      .quiz-btn.active { background:linear-gradient(135deg,var(--teal),var(--blue)); color:white; }
      .quiz-btn.dim { background:#eef4f2; color:#7a9b97; }
      .quiz-passed-badge { font-size:0.75rem; font-weight:700; color:#479880; }

      /* Challenge card */
      .challenge-card { display:flex; align-items:center; gap:1rem; padding:1rem; background:#fffbf5; border:1.5px solid #f0d5b0; border-radius:12px; cursor:pointer; transition:all 0.18s; }
      .challenge-card:hover { border-color:#c47a3a; transform:translateX(2px); }
      .challenge-card.challenge-done { background:#f0faf7; border-color:#c8e8df; }
      .challenge-card-left { flex:1; }
      .challenge-card-title { font-size:0.9rem; font-weight:700; color:#1a2e2b; margin-bottom:0.25rem; }
      .challenge-card-brief { font-size:0.8rem; color:#6b8a87; line-height:1.5; margin-bottom:0.4rem; }
      .challenge-card-meta { font-size:0.72rem; color:#7a9b97; display:flex; flex-wrap:wrap; gap:0.4rem; align-items:center; }
      .challenge-skill-tag { background:#fff8f0; color:#c47a3a; border-radius:4px; padding:0.1rem 0.4rem; font-weight:600; }
      .challenge-card-right { flex-shrink:0; }
      .challenge-score-badge { font-size:0.82rem; font-weight:700; }
      .challenge-score-badge.passed { color:#479880; }
      .challenge-score-badge.failed { color:#c47a7a; }
      .challenge-cta-arrow { font-size:0.9rem; color:#c47a3a; font-weight:700; }

      /* Phase milestone */
      .phase-milestone { display:flex; gap:0.6rem; align-items:flex-start; padding:0.75rem; background:linear-gradient(135deg,#f0faf7,#ebf7f8); border-radius:10px; border:1px solid #c8e8df; }
      .milestone-label { font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#479880; margin-bottom:0.15rem; }
      .milestone-text { font-size:0.82rem; font-weight:600; color:#1a3d35; }

      /* CTAs */
      .ij-cta-row { display:flex; gap:0.85rem; justify-content:space-between; margin-bottom:1.25rem; }
      .ij-btn-secondary { background:none; border:2px solid #e4ecea; border-radius:12px; padding:0.75rem 1.2rem; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.85rem; font-weight:600; color:#4a6360; cursor:pointer; transition:all 0.18s; }
      .ij-btn-secondary:hover { border-color:var(--teal); color:var(--teal); }
      .ij-btn-primary { background:linear-gradient(135deg,var(--teal),var(--blue)); border:none; border-radius:12px; padding:0.85rem 1.5rem; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.88rem; font-weight:700; color:white; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 16px rgba(71,152,128,0.3); }
      .ij-btn-primary:hover { transform:translateY(-2px); }
      .ij-footer-note { text-align:center; font-size:0.78rem; color:#7a9b97; }

      /* Dashboard button styles - ADDED HERE */
      .mt-8 { margin-top: 2rem; }
      .text-center { text-align: center; }
      .px-8 { padding-left: 2rem; padding-right: 2rem; }
      .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
      .bg-blue-600 { background-color: #2563eb; }
      .text-white { color: white; }
      .rounded-lg { border-radius: 0.5rem; }
      .font-semibold { font-weight: 600; }
      .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
      .transition-colors { transition-property: background-color, border-color, color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }

      @media(max-width:480px) {
        .ij-stats-row { flex-wrap:wrap; }
        .ij-cta-row { flex-direction:column; }
        .ij-btn-primary,.ij-btn-secondary { width:100%; text-align:center; }
        .resource-title { max-width:160px; }
      }
    `}</style>
  );
}