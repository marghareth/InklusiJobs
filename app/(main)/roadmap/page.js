"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function loadScoring() {
  try { return JSON.parse(localStorage.getItem("inklusijobs_scoring") || "null"); } catch { return null; }
}
function loadJobForRoadmap() {
  try { return JSON.parse(localStorage.getItem("inklusijobs_job_for_roadmap") || "null"); } catch { return null; }
}
function loadRoadmap() {
  try { return JSON.parse(localStorage.getItem("inklusijobs_roadmap") || "null"); } catch { return null; }
}
function saveRoadmap(data) {
  try { localStorage.setItem("inklusijobs_roadmap", JSON.stringify(data)); } catch {}
}

const SCAFFOLD_LABELS = {
  guided:      { label: "Guided",      color: "#479880", bg: "#f0faf7" },
  independent: { label: "Independent", color: "#648FBF", bg: "#f0f5fb" },
  open_ended:  { label: "Open-ended",  color: "#8891C9", bg: "#f0f0fb" },
  beginner:    { label: "Beginner",    color: "#479880", bg: "#f0faf7" },
  intermediate:{ label: "Intermediate",color: "#648FBF", bg: "#f0f5fb" },
  advanced:    { label: "Advanced",    color: "#8891C9", bg: "#f0f0fb" },
};

const RESOURCE_ICONS = {
  video:     "▶️",
  article:   "📄",
  course:    "🎓",
  tool:      "🛠️",
  community: "👥",
};

// ─── Phase Card ───────────────────────────────────────────────────────────────
function PhaseCard({ phase, index, isOpen, onToggle }) {
  const scaffold = SCAFFOLD_LABELS[phase.scaffoldLevel] || SCAFFOLD_LABELS.beginner;

  return (
    <div className={`phase-card ${isOpen ? "open" : ""}`} style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Phase header */}
      <button className="phase-header" onClick={onToggle}>
        <div className="phase-number-col">
          <div className="phase-number">{phase.phaseNumber}</div>
          <div className="phase-connector" />
        </div>
        <div className="phase-meta">
          <div className="phase-top-row">
            <span className="phase-title">{phase.title}</span>
            <span className="phase-chevron">{isOpen ? "▲" : "▼"}</span>
          </div>
          <div className="phase-tags">
            <span className="phase-tag weeks">⏱ {phase.durationWeeks} week{phase.durationWeeks > 1 ? "s" : ""}</span>
            <span className="phase-tag scaffold" style={{ color: scaffold.color, background: scaffold.bg }}>
              {scaffold.label}
            </span>
          </div>
          <p className="phase-focus">{phase.focus}</p>
        </div>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="phase-body">
          {/* Resources */}
          {phase.resources?.length > 0 && (
            <div className="phase-section">
              <h4 className="phase-section-title">📚 Resources</h4>
              <div className="resources-list">
                {phase.resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-item"
                  >
                    <span className="resource-icon">{RESOURCE_ICONS[r.type] || "📎"}</span>
                    <div className="resource-info">
                      <div className="resource-title">{r.title}</div>
                      <div className="resource-meta">
                        {r.platform} · {r.language}
                        {r.isFree && <span className="free-badge">Free</span>}
                        {r.estimatedHours && <span className="hours-badge">~{r.estimatedHours}h</span>}
                      </div>
                      {r.accessibilityNotes && (
                        <div className="resource-a11y">♿ {r.accessibilityNotes}</div>
                      )}
                    </div>
                    <span className="resource-arrow">↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Challenges */}
          {phase.challenges?.length > 0 && (
            <div className="phase-section">
              <h4 className="phase-section-title">⚡ Challenges</h4>
              <div className="challenges-list">
                {phase.challenges.map((c, i) => {
                  const cs = SCAFFOLD_LABELS[c.scaffoldLevel] || SCAFFOLD_LABELS.guided;
                  return (
                    <div key={i} className="challenge-item">
                      <div className="challenge-header">
                        <span className="challenge-title">{c.title}</span>
                        <div className="challenge-badges">
                          <span className="challenge-badge scaffold" style={{ color: cs.color, background: cs.bg }}>{cs.label}</span>
                          {c.portfolioWorthy && <span className="challenge-badge portfolio">📁 Portfolio</span>}
                        </div>
                      </div>
                      <p className="challenge-desc">{c.description}</p>
                      <div className="challenge-meta">
                        {c.estimatedHours && <span>⏱ ~{c.estimatedHours}h</span>}
                        {c.tesda_alignment && <span>🏅 {c.tesda_alignment}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Milestone */}
          {phase.milestone && (
            <div className="phase-milestone">
              <span className="milestone-icon">🏆</span>
              <div>
                <div className="milestone-label">Phase Milestone</div>
                <div className="milestone-text">{phase.milestone}</div>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .phase-card {
          background: white;
          border-radius: 18px;
          border: 1.5px solid #e4ecea;
          overflow: hidden;
          opacity: 0;
          animation: fadeUp 0.4s ease forwards;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .phase-card.open {
          border-color: #479880;
          box-shadow: 0 4px 20px rgba(71,152,128,0.10);
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .phase-header {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
        }
        .phase-number-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          flex-shrink: 0;
        }
        .phase-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #479880, #4B959E);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .phase-connector {
          width: 2px;
          flex: 1;
          background: #e4ecea;
          min-height: 12px;
          margin-top: 4px;
        }
        .phase-meta { flex: 1; }
        .phase-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.4rem;
        }
        .phase-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f2421;
          line-height: 1.3;
        }
        .phase-chevron {
          font-size: 0.65rem;
          color: #7a9b97;
          margin-top: 3px;
          flex-shrink: 0;
        }
        .phase-tags {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-bottom: 0.4rem;
        }
        .phase-tag {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.15rem 0.55rem;
          border-radius: 999px;
        }
        .phase-tag.weeks { background: #eef4f2; color: #479880; }
        .phase-tag.scaffold { border-radius: 6px; }
        .phase-focus { font-size: 0.82rem; color: #6b8a87; line-height: 1.5; }

        /* Body */
        .phase-body { padding: 0 1.25rem 1.25rem 1.25rem; border-top: 1px solid #eef4f2; padding-top: 1rem; }
        .phase-section { margin-bottom: 1.25rem; }
        .phase-section-title {
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #7a9b97;
          margin-bottom: 0.6rem;
        }

        /* Resources */
        .resources-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .resource-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f8fffe;
          border: 1px solid #e4ecea;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.18s ease;
        }
        .resource-item:hover { border-color: #479880; background: #f0faf7; transform: translateX(2px); }
        .resource-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }
        .resource-info { flex: 1; }
        .resource-title { font-size: 0.87rem; font-weight: 600; color: #1a2e2b; margin-bottom: 0.2rem; }
        .resource-meta { font-size: 0.75rem; color: #7a9b97; display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap; }
        .free-badge { background: #f0faf7; color: #479880; border: 1px solid #c8e8df; border-radius: 4px; padding: 0.1rem 0.4rem; font-size: 0.68rem; font-weight: 700; }
        .hours-badge { background: #f0f5fb; color: #648FBF; border-radius: 4px; padding: 0.1rem 0.4rem; font-size: 0.68rem; font-weight: 600; }
        .resource-a11y { font-size: 0.72rem; color: #8891C9; margin-top: 0.2rem; }
        .resource-arrow { color: #c5d9d6; font-size: 0.9rem; flex-shrink: 0; margin-top: 2px; }

        /* Challenges */
        .challenges-list { display: flex; flex-direction: column; gap: 0.6rem; }
        .challenge-item {
          padding: 0.85rem;
          background: #fafcff;
          border: 1px solid #e4ecea;
          border-radius: 10px;
        }
        .challenge-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.4rem; }
        .challenge-title { font-size: 0.87rem; font-weight: 600; color: #1a2e2b; }
        .challenge-badges { display: flex; gap: 0.35rem; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }
        .challenge-badge { font-size: 0.68rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 5px; white-space: nowrap; }
        .challenge-badge.portfolio { background: #fff8f0; color: #c47a3a; }
        .challenge-desc { font-size: 0.82rem; color: #4a6360; line-height: 1.55; margin-bottom: 0.4rem; }
        .challenge-meta { display: flex; gap: 0.75rem; font-size: 0.72rem; color: #7a9b97; font-weight: 500; flex-wrap: wrap; }

        /* Milestone */
        .phase-milestone {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          padding: 0.9rem;
          background: linear-gradient(135deg, #f0faf7, #ebf7f8);
          border-radius: 10px;
          border: 1px solid #c8e8df;
        }
        .milestone-icon { font-size: 1.2rem; flex-shrink: 0; }
        .milestone-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #479880; margin-bottom: 0.2rem; }
        .milestone-text { font-size: 0.85rem; font-weight: 600; color: #1a3d35; line-height: 1.45; }
      `}</style>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RoadmapPage() {
  const router = useRouter();
  const [roadmap, setRoadmap]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [openPhase, setOpenPhase] = useState(0); // first phase open by default
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const existing = loadRoadmap();
    if (existing) {
      setRoadmap(existing);
      setLoading(false);
      setTimeout(() => setRevealed(true), 100);
      return;
    }
    fetchRoadmap();
  }, []);

  async function fetchRoadmap() {
    setLoading(true);
    setError(null);

    try {
      const scoring = loadScoring();
      const job     = loadJobForRoadmap();

      if (!scoring || !job) {
        router.replace("/job-select");
        return;
      }

      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scoring, job }),
      });

      if (!res.ok) throw new Error("Roadmap generation failed");
      const data = await res.json();

      if (!data?.roadmap) throw new Error("Invalid roadmap response");

      saveRoadmap(data.roadmap);
      setRoadmap(data.roadmap);
      setTimeout(() => setRevealed(true), 100);

    } catch (err) {
      console.error("[Roadmap]", err);
      setError("Something went wrong building your roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="ij-loading-screen">
        <div className="ij-loading-card">
          <div className="ij-spinner" />
          <h2>Building your personalised roadmap…</h2>
          <p>Mapping your skill gaps to real learning resources. This takes about 15 seconds. 🌟</p>
          <div className="ij-loading-steps">
            <div className="ij-step">✅ Assessment complete</div>
            <div className="ij-step">✅ Skills scored</div>
            <div className="ij-step ij-step-active">⚙️ Generating roadmap…</div>
          </div>
        </div>
        <LoadingStyles />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="ij-loading-screen">
        <div className="ij-loading-card">
          <p style={{ fontSize: "2.5rem" }}>😔</p>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="ij-btn-primary" onClick={fetchRoadmap}>Try Again</button>
        </div>
        <LoadingStyles />
      </div>
    );
  }

  if (!roadmap) return null;

  return (
    <div className={`ij-page ${revealed ? "revealed" : ""}`}>
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

          {/* Stats row */}
          <div className="ij-stats-row">
            <div className="ij-stat">
              <span className="ij-stat-value">{roadmap.totalWeeks}</span>
              <span className="ij-stat-label">Weeks</span>
            </div>
            <div className="ij-stat-divider" />
            <div className="ij-stat">
              <span className="ij-stat-value">{roadmap.phases?.length}</span>
              <span className="ij-stat-label">Phases</span>
            </div>
            <div className="ij-stat-divider" />
            <div className="ij-stat">
              <span className="ij-stat-value">{roadmap.estimatedJobReadyDate}</span>
              <span className="ij-stat-label">Job-Ready By</span>
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

        {/* Next step callout */}
        {roadmap.nextStep && (
          <div className="ij-next-step">
            <span className="ij-next-step-label">Start Today</span>
            <p className="ij-next-step-text">{roadmap.nextStep}</p>
          </div>
        )}

        {/* Phases */}
        <div className="ij-phases-label">Your Learning Phases</div>
        <div className="ij-phases-list">
          {roadmap.phases?.map((phase, i) => (
            <PhaseCard
              key={phase.phaseNumber}
              phase={phase}
              index={i}
              isOpen={openPhase === i}
              onToggle={() => setOpenPhase(openPhase === i ? -1 : i)}
            />
          ))}
        </div>

        {/* Bottom CTAs */}
        <div className="ij-cta-row">
          <button className="ij-btn-secondary" onClick={() => router.push("/results")}>
            ← Back to Results
          </button>
          <button className="ij-btn-primary" onClick={() => {
            localStorage.removeItem("inklusijobs_roadmap");
            fetchRoadmap();
          }}>
            Regenerate Roadmap ↺
          </button>
        </div>

        <p className="ij-footer-note">🔒 Your roadmap is saved on this device.</p>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
function LoadingStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      .ij-loading-screen { min-height:100vh; background:#f4f9f8; display:flex; align-items:center; justify-content:center; font-family:'Plus Jakarta Sans',sans-serif; padding:2rem; }
      .ij-loading-card { background:white; border-radius:24px; padding:3rem 2.5rem; max-width:440px; width:100%; text-align:center; box-shadow:0 20px 60px rgba(71,152,128,0.12); }
      .ij-loading-card h2 { font-size:1.35rem; font-weight:700; color:#0f2421; margin:1.25rem 0 0.6rem; }
      .ij-loading-card p { font-size:0.9rem; color:#6b8a87; line-height:1.6; margin-bottom:1.5rem; }
      .ij-spinner { width:52px; height:52px; border:4px solid #e8f0ef; border-top-color:#479880; border-radius:50%; animation:spin 0.9s linear infinite; margin:0 auto; }
      @keyframes spin { to { transform:rotate(360deg); } }
      .ij-loading-steps { display:flex; flex-direction:column; gap:0.5rem; text-align:left; background:#f8fffe; border-radius:12px; padding:1rem 1.25rem; }
      .ij-step { font-size:0.85rem; color:#4a6360; font-weight:500; }
      .ij-step-active { color:#479880; font-weight:700; }
      .ij-btn-primary { background:linear-gradient(135deg,#479880,#4B959E); border:none; border-radius:12px; padding:0.85rem 2rem; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.95rem; font-weight:700; color:white; cursor:pointer; margin-top:1rem; }
    `}</style>
  );
}

function GlobalStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
      :root { --teal:#479880; --blue:#4B959E; --bg:#f4f9f8; }
      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      body { background:var(--bg); }

      .ij-page {
        min-height:100vh; background:var(--bg); font-family:'Plus Jakarta Sans',sans-serif;
        padding:2rem 1.5rem 4rem; display:flex; justify-content:center;
        opacity:0; transform:translateY(10px);
        transition:opacity 0.5s ease, transform 0.5s ease;
      }
      .ij-page.revealed { opacity:1; transform:translateY(0); }
      .ij-shell { width:100%; max-width:620px; }

      .ij-logo-row { display:flex; align-items:center; gap:0.6rem; justify-content:center; margin-bottom:1.75rem; }
      .ij-logo-mark { width:36px; height:36px; background:linear-gradient(135deg,var(--teal),var(--blue)); border-radius:10px; display:flex; align-items:center; justify-content:center; color:white; font-weight:800; font-size:0.85rem; }
      .ij-logo-text { font-weight:700; font-size:1.1rem; color:#0f2421; letter-spacing:-0.02em; }

      /* Header */
      .ij-roadmap-header {
        background: white;
        border-radius: 24px;
        padding: 2rem;
        margin-bottom: 1rem;
        box-shadow: 0 4px 24px rgba(71,152,128,0.08);
        border: 1px solid rgba(71,152,128,0.1);
      }
      .ij-roadmap-badge {
        display: inline-block;
        padding: 0.25rem 0.8rem;
        background: linear-gradient(135deg, #e8f6f2, #e4f2f5);
        color: #4B959E;
        border-radius: 999px;
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 0.75rem;
      }
      .ij-roadmap-title {
        font-size: 1.5rem;
        font-weight: 800;
        color: #0f2421;
        letter-spacing: -0.02em;
        line-height: 1.25;
        margin-bottom: 0.6rem;
      }
      .ij-roadmap-summary {
        font-size: 0.9rem;
        color: #4a6360;
        line-height: 1.65;
        margin-bottom: 1.25rem;
      }
      .ij-stats-row {
        display: flex;
        align-items: center;
        gap: 0;
        background: #f8fffe;
        border-radius: 12px;
        padding: 0.85rem 1.25rem;
        border: 1px solid #e4ecea;
      }
      .ij-stat { flex: 1; text-align: center; }
      .ij-stat-value { display: block; font-size: 1.1rem; font-weight: 800; color: #0f2421; }
      .ij-stat-label { display: block; font-size: 0.68rem; color: #7a9b97; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 0.15rem; }
      .ij-stat-divider { width: 1px; height: 36px; background: #e4ecea; flex-shrink: 0; }

      /* Encouragement */
      .ij-encouragement {
        display: flex; gap: 0.75rem; align-items: flex-start;
        background: linear-gradient(135deg, #f0faf7, #ebf7f8);
        border-radius: 14px; padding: 1rem 1.25rem;
        margin-bottom: 1rem; border: 1px solid #c8e8df;
      }
      .ij-encouragement span { font-size: 1.2rem; flex-shrink: 0; margin-top: 1px; }
      .ij-encouragement p { font-size: 0.88rem; color: #2d5f55; line-height: 1.6; font-style: italic; }

      /* Next step */
      .ij-next-step {
        background: linear-gradient(135deg, #0f2421, #1a3d35);
        border-radius: 14px; padding: 1.1rem 1.4rem;
        margin-bottom: 1.5rem;
      }
      .ij-next-step-label { display:block; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#479880; margin-bottom:0.3rem; }
      .ij-next-step-text { font-size:0.9rem; color:#e8f6f2; line-height:1.6; font-weight:500; }

      /* Phases */
      .ij-phases-label {
        font-size: 0.78rem; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.06em; color: #7a9b97; margin-bottom: 0.75rem;
      }
      .ij-phases-list { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }

      /* CTAs */
      .ij-cta-row { display:flex; gap:0.85rem; justify-content:space-between; align-items:center; margin-bottom:1.25rem; }
      .ij-btn-secondary { background:none; border:2px solid #e4ecea; border-radius:12px; padding:0.75rem 1.2rem; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.85rem; font-weight:600; color:#4a6360; cursor:pointer; transition:all 0.18s; white-space:nowrap; }
      .ij-btn-secondary:hover { border-color:var(--teal); color:var(--teal); }
      .ij-btn-primary { background:linear-gradient(135deg,var(--teal),var(--blue)); border:none; border-radius:12px; padding:0.85rem 1.5rem; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.88rem; font-weight:700; color:white; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 16px rgba(71,152,128,0.3); }
      .ij-btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(71,152,128,0.35); }

      .ij-footer-note { text-align:center; font-size:0.78rem; color:#7a9b97; }

      @media(max-width:480px) {
        .ij-stats-row { flex-direction:column; gap:0.5rem; }
        .ij-stat-divider { width:100%; height:1px; }
        .ij-cta-row { flex-direction:column; }
        .ij-btn-primary, .ij-btn-secondary { width:100%; text-align:center; }
      }
    `}</style>
  );
}