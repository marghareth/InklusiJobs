//app/(main)/challenges/[challengeId]/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getChallengeById } from "@/lib/learn-content";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ChallengePage() {
  const router = useRouter();
  const params = useParams();
  const { challengeId } = params;

  const [challenge, setChallenge]   = useState(null);
  const [jobId, setJobId]           = useState(null);
  const [userId, setUserId]         = useState(null);
  const [view, setView]             = useState("brief"); // brief | submit | scoring | result
  const [submission, setSubmission] = useState("");
  const [result, setResult]         = useState(null);
  const [revealed, setRevealed]     = useState(false);

  useEffect(() => {
    const selection = JSON.parse(localStorage.getItem("inklusijobs_job_selection") || "null");
    if (!selection?.jobId) { router.replace("/job-select"); return; }
    setJobId(selection.jobId);

    const ch = getChallengeById(selection.jobId, challengeId);
    if (!ch) { router.replace("/roadmap"); return; }
    setChallenge(ch);
    setTimeout(() => setRevealed(true), 100);

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id);
    });
  }, [challengeId, router]);

  const handleSubmit = async () => {
    if (!submission.trim()) return;
    setView("scoring");

    try {
      const res = await fetch("/api/challenge/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId,
          jobId,
          challenge,
          submission,
          userId,
        }),
      });
      const data = await res.json();
      setResult(data);
      setView("result");
    } catch (e) {
      console.error("[Challenge] Submit error:", e);
      setView("submit");
    }
  };

  if (!challenge) {
    return (
      <div className="ij-loading">
        <div className="ij-spinner" />
        <LoadingStyles />
      </div>
    );
  }

  return (
    <div className={`ij-page ${revealed ? "revealed" : ""}`}>
      <GlobalStyles />

      <div className="ij-shell">
        {/* Logo */}
        <div className="ij-logo-row">
          <div className="ij-logo-mark">IJ</div>
          <span className="ij-logo-text">InklusiJobs</span>
        </div>

        {/* Challenge header */}
        <div className="ij-challenge-header">
          <div className="ij-challenge-badge">
            ⚡ Phase {challenge.phaseNumber} Challenge
          </div>
          <h1 className="ij-challenge-title">{challenge.title}</h1>
          <div className="ij-challenge-meta-row">
            <span className="ij-meta-tag">⏱ ~{challenge.estimatedHours}h</span>
            <span className="ij-meta-tag">📁 Portfolio worthy</span>
            {challenge.skills?.map(s => (
              <span key={s} className="ij-meta-tag skill">{s}</span>
            ))}
          </div>
        </div>

        {/* ── BRIEF VIEW ──────────────────────────────────────────────────── */}
        {view === "brief" && (
          <div className="ij-card">
            <div className="ij-brief-label">📋 Your Brief</div>
            <div className="ij-brief-text">
              {challenge.brief.split("\n").map((line, i) => (
                line.trim() === ""
                  ? <div key={i} className="ij-brief-spacer" />
                  : <p key={i} className={line.endsWith(":") || line.match(/^[A-Z\s]+:$/) ? "ij-brief-heading" : "ij-brief-para"}>{line}</p>
              ))}
            </div>

            {/* Rubric */}
            {challenge.rubric && (
              <div className="ij-rubric">
                <div className="ij-rubric-title">📊 How You'll Be Scored</div>
                <div className="ij-rubric-list">
                  {challenge.rubric.map((r, i) => (
                    <div key={i} className="ij-rubric-item">
                      <div className="ij-rubric-criterion">{r.criterion}</div>
                      <div className="ij-rubric-points">{r.maxScore} pts</div>
                      <div className="ij-rubric-desc">{r.description}</div>
                    </div>
                  ))}
                </div>
                <div className="ij-rubric-passing">
                  Passing score: <strong>{challenge.passingScore}%</strong>
                </div>
              </div>
            )}

            <div className="ij-brief-cta">
              <button className="ij-btn-secondary" onClick={() => router.push("/roadmap")}>
                ← Back to Roadmap
              </button>
              <button className="ij-btn-primary" onClick={() => setView("submit")}>
                Start Challenge →
              </button>
            </div>
          </div>
        )}

        {/* ── SUBMIT VIEW ──────────────────────────────────────────────────── */}
        {view === "submit" && (
          <div className="ij-card">
            <div className="ij-submit-header">
              <button className="ij-back-link" onClick={() => setView("brief")}>← Re-read Brief</button>
              <div className="ij-submit-title">Your Submission</div>
            </div>

            <div className="ij-submit-hint">
              Write your full response below. Take your time — this is a portfolio piece.
            </div>

            <textarea
              className="ij-submit-textarea"
              placeholder="Start writing your submission here..."
              value={submission}
              onChange={e => setSubmission(e.target.value)}
              rows={16}
            />

            <div className="ij-submit-footer">
              <div className="ij-char-count">{submission.length} characters · ~{Math.ceil(submission.split(" ").length / 200)} min read</div>
              <button
                className={`ij-btn-primary ${submission.trim().length < 50 ? "disabled" : ""}`}
                onClick={handleSubmit}
                disabled={submission.trim().length < 50}
              >
                Submit for Review 🚀
              </button>
            </div>
          </div>
        )}

        {/* ── SCORING VIEW ────────────────────────────────────────────────── */}
        {view === "scoring" && (
          <div className="ij-scoring-screen">
            <div className="ij-spinner large" />
            <h2>Reviewing your submission…</h2>
            <p>Our AI evaluator is checking your work against the rubric.<br />This takes about 15 seconds. ☕</p>
            <div className="ij-scoring-steps">
              <div className="ij-scoring-step done">✅ Submission received</div>
              <div className="ij-scoring-step active">⚙️ Evaluating against rubric…</div>
              <div className="ij-scoring-step">⏳ Generating feedback…</div>
            </div>
          </div>
        )}

        {/* ── RESULT VIEW ─────────────────────────────────────────────────── */}
        {view === "result" && result && (
          <ChallengeResult result={result} challenge={challenge} onBack={() => router.push("/roadmap")} onRetry={() => setView("submit")} />
        )}
      </div>
    </div>
  );
}

// ─── Challenge Result ─────────────────────────────────────────────────────────
function ChallengeResult({ result, challenge, onBack, onRetry }) {
  const scoreColor = result.score >= 80 ? "#479880" : result.score >= challenge.passingScore ? "#648FBF" : "#c47a7a";

  return (
    <div className="ij-result-card">
      {/* Score hero */}
      <div className="ij-result-hero">
        <div className="ij-result-ring" style={{ borderColor: scoreColor }}>
          <div className="ij-result-score" style={{ color: scoreColor }}>{result.score}%</div>
          <div className="ij-result-max">out of 100</div>
        </div>
        <div className="ij-result-info">
          <div className={`ij-result-badge ${result.passed ? "passed" : "failed"}`}>
            {result.passed ? "🏆 Challenge Passed!" : "📚 Keep Practising"}
          </div>
          {result.passed && (
            <div className="ij-result-unlock">🔓 Next phase unlocked!</div>
          )}
        </div>
      </div>

      {/* Encouragement */}
      {result.encouragement && (
        <div className="ij-result-encourage">💬 {result.encouragement}</div>
      )}

      {/* Rubric scores */}
      {result.rubricScores?.length > 0 && (
        <div className="ij-rubric-results">
          <div className="ij-rubric-results-title">Rubric Breakdown</div>
          {result.rubricScores.map((r, i) => {
            const pct = Math.round((r.score / r.maxScore) * 100);
            const col = pct >= 70 ? "#479880" : pct >= 50 ? "#e09c50" : "#c47a7a";
            return (
              <div key={i} className="ij-rubric-result-item">
                <div className="ij-rubric-result-header">
                  <span className="ij-rubric-result-name">{r.criterion}</span>
                  <span className="ij-rubric-result-score" style={{ color: col }}>{r.score}/{r.maxScore}</span>
                </div>
                <div className="ij-rubric-result-bar-track">
                  <div className="ij-rubric-result-bar-fill" style={{ width: `${pct}%`, background: col }} />
                </div>
                {r.feedback && <p className="ij-rubric-result-feedback">{r.feedback}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* Overall feedback */}
      {result.overallFeedback && (
        <div className="ij-result-overall">
          <div className="ij-result-overall-label">Overall Feedback</div>
          <p>{result.overallFeedback}</p>
        </div>
      )}

      {/* Next step */}
      {result.nextStep && (
        <div className="ij-result-nextstep">
          <span className="ij-nextstep-label">Your Next Step</span>
          <p>{result.nextStep}</p>
        </div>
      )}

      {/* CTAs */}
      <div className="ij-result-cta-row">
        {result.passed ? (
          <button className="ij-btn-primary" onClick={onBack}>Back to Roadmap →</button>
        ) : (
          <>
            <button className="ij-btn-secondary" onClick={onRetry}>Revise & Resubmit ↺</button>
            <button className="ij-btn-primary" onClick={onBack}>Back to Roadmap</button>
          </>
        )}
      </div>

      <style jsx>{`
        .ij-result-card { background:white; border-radius:24px; padding:2rem; box-shadow:0 4px 24px rgba(71,152,128,0.10); border:1px solid #eef4f2; }
        .ij-result-hero { display:flex; gap:1.5rem; align-items:center; margin-bottom:1.25rem; }
        .ij-result-ring { width:100px; height:100px; border-radius:50%; border:6px solid; display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0; }
        .ij-result-score { font-size:1.75rem; font-weight:800; line-height:1; }
        .ij-result-max { font-size:0.68rem; color:#7a9b97; font-weight:600; }
        .ij-result-badge { display:inline-block; padding:0.3rem 0.85rem; border-radius:999px; font-size:0.82rem; font-weight:700; margin-bottom:0.5rem; }
        .ij-result-badge.passed { background:#f0faf7; color:#479880; border:1.5px solid #c8e8df; }
        .ij-result-badge.failed { background:#fdf5eb; color:#c47a3a; border:1.5px solid #f0d5b0; }
        .ij-result-unlock { font-size:0.82rem; color:#479880; font-weight:600; }
        .ij-result-encourage { font-size:0.88rem; color:#2d5f55; font-style:italic; line-height:1.6; background:#f0faf7; border-radius:12px; padding:0.85rem 1rem; margin-bottom:1.25rem; border:1px solid #c8e8df; }
        .ij-rubric-results { margin-bottom:1.25rem; }
        .ij-rubric-results-title { font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#7a9b97; margin-bottom:0.75rem; }
        .ij-rubric-result-item { margin-bottom:0.85rem; }
        .ij-rubric-result-header { display:flex; justify-content:space-between; margin-bottom:0.3rem; }
        .ij-rubric-result-name { font-size:0.85rem; font-weight:600; color:#1a2e2b; }
        .ij-rubric-result-score { font-size:0.85rem; font-weight:700; }
        .ij-rubric-result-bar-track { height:6px; background:#eef4f2; border-radius:999px; overflow:hidden; margin-bottom:0.35rem; }
        .ij-rubric-result-bar-fill { height:100%; border-radius:999px; transition:width 0.8s ease; }
        .ij-rubric-result-feedback { font-size:0.78rem; color:#6b8a87; font-style:italic; line-height:1.5; }
        .ij-result-overall { background:#f8fffe; border-radius:12px; padding:1rem; margin-bottom:1rem; border:1px solid #e4ecea; }
        .ij-result-overall-label { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#479880; margin-bottom:0.4rem; }
        .ij-result-overall p { font-size:0.88rem; color:#3d5e59; line-height:1.65; }
        .ij-result-nextstep { background:linear-gradient(135deg,#0f2421,#1a3d35); border-radius:12px; padding:1rem 1.25rem; margin-bottom:1.5rem; }
        .ij-nextstep-label { display:block; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#479880; margin-bottom:0.3rem; }
        .ij-result-nextstep p { font-size:0.88rem; color:#e8f6f2; line-height:1.6; font-weight:500; }
        .ij-result-cta-row { display:flex; gap:0.85rem; }
      `}</style>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      :root { --teal:#479880; --blue:#4B959E; --bg:#f4f9f8; }
      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      body { background:var(--bg); }
      .ij-page { min-height:100vh; background:var(--bg); font-family:'Plus Jakarta Sans',sans-serif; padding:2rem 1.5rem 4rem; display:flex; justify-content:center; opacity:0; transform:translateY(10px); transition:opacity 0.5s ease,transform 0.5s ease; }
      .ij-page.revealed { opacity:1; transform:translateY(0); }
      .ij-shell { width:100%; max-width:680px; }
      .ij-logo-row { display:flex; align-items:center; gap:0.6rem; justify-content:center; margin-bottom:1.5rem; }
      .ij-logo-mark { width:36px; height:36px; background:linear-gradient(135deg,var(--teal),var(--blue)); border-radius:10px; display:flex; align-items:center; justify-content:center; color:white; font-weight:800; font-size:0.85rem; }
      .ij-logo-text { font-weight:700; font-size:1.1rem; color:#0f2421; letter-spacing:-0.02em; }

      .ij-challenge-header { margin-bottom:1.25rem; }
      .ij-challenge-badge { display:inline-block; padding:0.25rem 0.8rem; background:linear-gradient(135deg,#fff8eb,#fff3e0); color:#c47a3a; border:1.5px solid #f0d5b0; border-radius:999px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.75rem; }
      .ij-challenge-title { font-size:1.5rem; font-weight:800; color:#0f2421; letter-spacing:-0.02em; line-height:1.25; margin-bottom:0.75rem; }
      .ij-challenge-meta-row { display:flex; flex-wrap:wrap; gap:0.4rem; }
      .ij-meta-tag { font-size:0.72rem; font-weight:600; padding:0.2rem 0.65rem; background:white; border:1px solid #e4ecea; border-radius:999px; color:#4a6360; }
      .ij-meta-tag.skill { background:#f0faf7; border-color:#c8e8df; color:#479880; }

      .ij-card { background:white; border-radius:24px; padding:2rem; box-shadow:0 4px 24px rgba(71,152,128,0.08); border:1px solid #eef4f2; }

      /* Brief */
      .ij-brief-label { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:#479880; margin-bottom:1rem; }
      .ij-brief-text { font-size:0.9rem; color:#2d4a47; line-height:1.75; margin-bottom:1.5rem; }
      .ij-brief-heading { font-weight:700; color:#0f2421; margin-top:0.75rem; }
      .ij-brief-para { margin-bottom:0.1rem; }
      .ij-brief-spacer { height:0.6rem; }
      .ij-brief-cta { display:flex; gap:0.85rem; justify-content:space-between; align-items:center; margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid #eef4f2; }

      /* Rubric */
      .ij-rubric { background:#f8fffe; border-radius:14px; padding:1.1rem; margin-bottom:1.25rem; border:1px solid #e4ecea; }
      .ij-rubric-title { font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#7a9b97; margin-bottom:0.75rem; }
      .ij-rubric-list { display:flex; flex-direction:column; gap:0.6rem; margin-bottom:0.75rem; }
      .ij-rubric-item { display:grid; grid-template-columns:1fr auto; grid-template-rows:auto auto; gap:0.1rem 0.5rem; }
      .ij-rubric-criterion { font-size:0.85rem; font-weight:600; color:#1a2e2b; }
      .ij-rubric-points { font-size:0.82rem; font-weight:700; color:#479880; text-align:right; }
      .ij-rubric-desc { font-size:0.76rem; color:#6b8a87; grid-column:1/-1; }
      .ij-rubric-passing { font-size:0.78rem; color:#7a9b97; font-weight:500; border-top:1px solid #e4ecea; padding-top:0.6rem; }

      /* Submit */
      .ij-submit-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem; }
      .ij-back-link { background:none; border:none; color:#479880; font-size:0.82rem; font-weight:600; cursor:pointer; font-family:inherit; }
      .ij-submit-title { font-size:1rem; font-weight:700; color:#0f2421; }
      .ij-submit-hint { font-size:0.82rem; color:#6b8a87; margin-bottom:0.85rem; }
      .ij-submit-textarea { width:100%; padding:1rem; border:1.5px solid #e4ecea; border-radius:14px; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.9rem; color:#1a2e2b; resize:vertical; line-height:1.7; background:#f8fffe; transition:border-color 0.18s; }
      .ij-submit-textarea:focus { outline:none; border-color:var(--teal); background:white; }
      .ij-submit-footer { display:flex; justify-content:space-between; align-items:center; margin-top:0.85rem; }
      .ij-char-count { font-size:0.72rem; color:#7a9b97; }

      /* Scoring */
      .ij-scoring-screen { background:white; border-radius:24px; padding:3rem 2rem; text-align:center; box-shadow:0 4px 24px rgba(71,152,128,0.10); }
      .ij-scoring-screen h2 { font-size:1.25rem; font-weight:700; color:#0f2421; margin:1.25rem 0 0.5rem; }
      .ij-scoring-screen p { font-size:0.88rem; color:#6b8a87; line-height:1.65; margin-bottom:1.5rem; }
      .ij-scoring-steps { display:flex; flex-direction:column; gap:0.5rem; text-align:left; background:#f8fffe; border-radius:12px; padding:1rem 1.25rem; max-width:300px; margin:0 auto; }
      .ij-scoring-step { font-size:0.83rem; font-weight:500; color:#7a9b97; }
      .ij-scoring-step.active { color:#479880; font-weight:700; }
      .ij-scoring-step.done { color:#4a6360; }

      .ij-spinner { width:52px; height:52px; border:4px solid #e8f0ef; border-top-color:#479880; border-radius:50%; animation:spin 0.9s linear infinite; margin:0 auto; }
      .ij-spinner.large { width:64px; height:64px; }
      @keyframes spin { to { transform:rotate(360deg); } }

      .ij-btn-primary { background:linear-gradient(135deg,var(--teal),var(--blue)); border:none; border-radius:12px; padding:0.85rem 2rem; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.92rem; font-weight:700; color:white; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 16px rgba(71,152,128,0.3); }
      .ij-btn-primary:hover:not(.disabled) { transform:translateY(-2px); }
      .ij-btn-primary.disabled { background:#c5d9d6; box-shadow:none; cursor:not-allowed; }
      .ij-btn-secondary { background:none; border:2px solid #e4ecea; border-radius:12px; padding:0.85rem 1.5rem; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.88rem; font-weight:600; color:#4a6360; cursor:pointer; transition:all 0.18s; }
      .ij-btn-secondary:hover { border-color:var(--teal); color:var(--teal); }

      @media(max-width:480px) {
        .ij-brief-cta,.ij-result-cta-row { flex-direction:column; }
        .ij-btn-primary,.ij-btn-secondary { width:100%; text-align:center; }
        .ij-result-hero { flex-direction:column; text-align:center; }
      }
    `}</style>
  );
}
function LoadingStyles() {
  return (
    <style jsx global>{`
      .ij-loading { min-height:100vh; background:#f4f9f8; display:flex; align-items:center; justify-content:center; }
      .ij-spinner { width:48px; height:48px; border:4px solid #e8f0ef; border-top-color:#479880; border-radius:50%; animation:spin 0.9s linear infinite; }
      @keyframes spin { to { transform:rotate(360deg); } }
    `}</style>
  );
}