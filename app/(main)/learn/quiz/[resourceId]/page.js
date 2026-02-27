"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getResource } from "@/lib/learn-content";

// ─── localStorage helpers ─────────────────────────────────────────────────────
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem("ij_current_user") || "null"); } catch { return null; }
}

function getProgress() {
  try { return JSON.parse(localStorage.getItem("ij_progress") || "{}"); } catch { return {}; }
}

function saveProgress(data) {
  localStorage.setItem("ij_progress", JSON.stringify(data));
}

function markResourceComplete(userId, jobId, resourceId, phaseNumber, quizResult) {
  const progress = getProgress();
  if (!progress[userId]) progress[userId] = {};
  if (!progress[userId][jobId]) progress[userId][jobId] = { completedResources: [], phases: {} };

  // Add to completed resources if not already there
  if (!progress[userId][jobId].completedResources.includes(resourceId)) {
    progress[userId][jobId].completedResources.push(resourceId);
  }

  // Save quiz result
  if (!progress[userId][jobId].quizResults) progress[userId][jobId].quizResults = {};
  progress[userId][jobId].quizResults[resourceId] = quizResult;

  // Mark phase progress
  if (phaseNumber) {
    if (!progress[userId][jobId].phases[phaseNumber]) {
      progress[userId][jobId].phases[phaseNumber] = { completedResources: [] };
    }
    if (!progress[userId][jobId].phases[phaseNumber].completedResources.includes(resourceId)) {
      progress[userId][jobId].phases[phaseNumber].completedResources.push(resourceId);
    }
  }

  saveProgress(progress);
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function QuizPage() {
  const router            = useRouter();
  const params            = useParams();
  const { resourceId }    = params;

  const [resource, setResource]   = useState(null);
  const [jobId, setJobId]         = useState(null);
  const [currentQ, setCurrentQ]   = useState(0);
  const [answers, setAnswers]     = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [revealed, setRevealed]   = useState(false);
  const [userId, setUserId]       = useState(null);

  useEffect(() => {
    const selection = JSON.parse(localStorage.getItem("inklusijobs_job_selection") || "null");
    if (!selection?.jobId) { router.replace("/job-select"); return; }
    setJobId(selection.jobId);

    const res = getResource(selection.jobId, resourceId);
    if (!res) { router.replace("/roadmap"); return; }
    setResource(res);
    setTimeout(() => setRevealed(true), 100);

    // Get user from localStorage instead of Supabase
    const user = getCurrentUser();
    if (user?.id) setUserId(user.id);
  }, [resourceId, router]);

  const question    = resource?.questions?.[currentQ];
  const totalQ      = resource?.questions?.length || 0;
  const currentAns  = answers[currentQ];
  const canContinue = question?.type === "single"
    ? !!currentAns
    : typeof currentAns === "string" && currentAns.trim().length > 0;

  const handleAnswer = (val) => setAnswers(prev => ({ ...prev, [currentQ]: val }));
  const goNext = () => { if (currentQ + 1 < totalQ) setCurrentQ(i => i + 1); };
  const goBack = () => { if (currentQ > 0) setCurrentQ(i => i - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Try the API route first; fall back to mock scoring if it fails
      let data;
      try {
        const res = await fetch("/api/quiz/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resourceId,
            jobId,
            questions: resource.questions,
            answers,
            userId,
          }),
        });
        data = await res.json();
      } catch {
        // ── Mock scoring fallback for demo ──────────────────────────────────
        const total   = resource.questions?.length || 1;
        const correct = Object.values(answers).filter(Boolean).length;
        const score   = Math.round((correct / total) * 100);
        data = {
          score,
          passed: score >= 70,
          encouragement: score >= 70
            ? "Great job! You've demonstrated solid understanding of this topic."
            : "Keep going! Review the material and try again — you've got this.",
          questionFeedback: resource.questions?.map((q, i) => ({
            correct: !!answers[i],
            score:   answers[i] ? q.points || 1 : 0,
            maxScore: q.points || 1,
            explanation: q.explanation || "",
            feedback: "",
          })) || [],
        };
      }

      setResult(data);
      setSubmitted(true);

      // Save progress to localStorage if passed
      if (data.passed && userId) {
        markResourceComplete(userId, jobId, resourceId, resource.phaseNumber, data);
      }
    } catch (e) {
      console.error("[Quiz] Submit error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!resource) {
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

        {/* Resource info */}
        <div className="ij-resource-banner">
          <span className="ij-resource-icon">📝</span>
          <div>
            <div className="ij-resource-label">Quiz — {resource.skillMapped}</div>
            <div className="ij-resource-name">{resource.title}</div>
          </div>
        </div>

        {!submitted ? (
          <div className="ij-card">
            {/* Progress dots */}
            <div className="ij-dots-row">
              {Array.from({ length: totalQ }).map((_, i) => (
                <div key={i} className={`ij-dot ${i === currentQ ? "active" : i < currentQ ? "done" : ""}`} />
              ))}
            </div>
            <div className="ij-q-counter">Question {currentQ + 1} of {totalQ}</div>

            <div className="ij-question-text">{question?.question}</div>

            {/* Single choice */}
            {question?.type === "single" && (
              <div className="ij-options">
                {question.options.map(opt => (
                  <button
                    key={opt.value}
                    className={`ij-option ${currentAns === opt.value ? "selected" : ""}`}
                    onClick={() => handleAnswer(opt.value)}
                  >
                    <div className="ij-option-radio">
                      {currentAns === opt.value && <div className="ij-option-radio-dot" />}
                    </div>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Text answer */}
            {question?.type === "text" && (
              <div className="ij-text-area-wrap">
                <textarea
                  className="ij-textarea"
                  placeholder={question.placeholder || "Write your answer here..."}
                  value={currentAns || ""}
                  onChange={e => handleAnswer(e.target.value)}
                  rows={6}
                />
                <div className="ij-char-count">{(currentAns || "").length} characters</div>
              </div>
            )}

            {/* Nav */}
            <div className="ij-nav-row">
              <button className="ij-btn-back" onClick={goBack} disabled={currentQ === 0}>← Back</button>
              {currentQ + 1 < totalQ ? (
                <button className={`ij-btn-primary ${!canContinue ? "disabled" : ""}`} onClick={goNext} disabled={!canContinue}>
                  Next →
                </button>
              ) : (
                <button
                  className={`ij-btn-primary ${!canContinue || loading ? "disabled" : ""}`}
                  onClick={handleSubmit}
                  disabled={!canContinue || loading}
                >
                  {loading ? "Scoring…" : "Submit Quiz 🚀"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <ResultsView result={result} resource={resource} onBack={() => router.push("/roadmap")} />
        )}
      </div>
    </div>
  );
}

// ─── Results View ─────────────────────────────────────────────────────────────
function ResultsView({ result, resource, onBack }) {
  const scoreColor = result.score >= 80 ? "#479880" : result.score >= 60 ? "#648FBF" : "#c47a7a";
  return (
    <div className="ij-results-card">
      <div className="ij-score-circle" style={{ borderColor: scoreColor }}>
        <div className="ij-score-number" style={{ color: scoreColor }}>{result.score}%</div>
        <div className="ij-score-label">Score</div>
      </div>

      <div className={`ij-pass-badge ${result.passed ? "passed" : "failed"}`}>
        {result.passed ? "✅ Passed!" : "📚 Not yet — review and retry"}
      </div>

      {result.encouragement && (
        <div className="ij-encourage">{result.encouragement}</div>
      )}

      {result.questionFeedback?.length > 0 && (
        <div className="ij-q-feedback-list">
          <h3 className="ij-feedback-title">Question Breakdown</h3>
          {result.questionFeedback.map((qf, i) => (
            <div key={i} className={`ij-q-feedback-item ${qf.correct ? "correct" : "incorrect"}`}>
              <div className="ij-q-feedback-header">
                <span className="ij-q-feedback-icon">{qf.correct ? "✅" : "❌"}</span>
                <span className="ij-q-feedback-q">Q{i + 1}</span>
                <span className="ij-q-feedback-score">{qf.score}/{qf.maxScore}</span>
              </div>
              {qf.explanation && <p className="ij-q-feedback-explanation">{qf.explanation}</p>}
              {qf.feedback    && <p className="ij-q-feedback-ai">{qf.feedback}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="ij-results-cta">
        {result.passed ? (
          <button className="ij-btn-primary" onClick={onBack}>Back to Roadmap ✓</button>
        ) : (
          <button className="ij-btn-secondary" onClick={() => window.location.reload()}>Retry Quiz ↺</button>
        )}
      </div>

      <style jsx>{`
        .ij-results-card{background:white;border-radius:24px;padding:2rem;text-align:center;box-shadow:0 4px 24px rgba(71,152,128,0.10);border:1px solid #eef4f2;}
        .ij-score-circle{width:120px;height:120px;border-radius:50%;border:6px solid;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 1.25rem;}
        .ij-score-number{font-size:2rem;font-weight:800;}
        .ij-score-label{font-size:0.72rem;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#7a9b97;}
        .ij-pass-badge{display:inline-block;padding:0.35rem 1rem;border-radius:999px;font-size:0.82rem;font-weight:700;margin-bottom:1rem;}
        .ij-pass-badge.passed{background:#f0faf7;color:#479880;border:1.5px solid #c8e8df;}
        .ij-pass-badge.failed{background:#fdf5eb;color:#c47a3a;border:1.5px solid #f0d5b0;}
        .ij-encourage{font-size:0.88rem;color:#4a6360;font-style:italic;line-height:1.6;margin-bottom:1.5rem;padding:0.85rem 1rem;background:#f8fffe;border-radius:12px;}
        .ij-feedback-title{font-size:0.85rem;font-weight:700;color:#0f2421;text-align:left;margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.04em;}
        .ij-q-feedback-list{text-align:left;margin-bottom:1.5rem;display:flex;flex-direction:column;gap:0.6rem;}
        .ij-q-feedback-item{padding:0.85rem;border-radius:12px;border:1px solid #eef4f2;}
        .ij-q-feedback-item.correct{background:#f8fffd;border-color:#c8e8df;}
        .ij-q-feedback-item.incorrect{background:#fff8f5;border-color:#f0d5b0;}
        .ij-q-feedback-header{display:flex;align-items:center;gap:0.5rem;margin-bottom:0.35rem;}
        .ij-q-feedback-icon{font-size:0.9rem;}
        .ij-q-feedback-q{font-weight:700;font-size:0.82rem;color:#0f2421;flex:1;}
        .ij-q-feedback-score{font-size:0.78rem;font-weight:600;color:#7a9b97;}
        .ij-q-feedback-explanation{font-size:0.8rem;color:#4a6360;line-height:1.5;margin-bottom:0.2rem;}
        .ij-q-feedback-ai{font-size:0.8rem;color:#8891C9;font-style:italic;line-height:1.5;}
        .ij-results-cta{margin-top:1.5rem;}
      `}</style>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      :root{--teal:#479880;--blue:#4B959E;--bg:#f4f9f8;}
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      body{background:var(--bg);}
      .ij-page{min-height:100vh;background:var(--bg);font-family:'Plus Jakarta Sans',sans-serif;padding:2rem 1.5rem 4rem;display:flex;justify-content:center;opacity:0;transform:translateY(10px);transition:opacity 0.5s ease,transform 0.5s ease;}
      .ij-page.revealed{opacity:1;transform:translateY(0);}
      .ij-shell{width:100%;max-width:600px;}
      .ij-logo-row{display:flex;align-items:center;gap:0.6rem;justify-content:center;margin-bottom:1.5rem;}
      .ij-logo-mark{width:36px;height:36px;background:linear-gradient(135deg,var(--teal),var(--blue));border-radius:10px;display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:0.85rem;}
      .ij-logo-text{font-weight:700;font-size:1.1rem;color:#0f2421;letter-spacing:-0.02em;}
      .ij-resource-banner{display:flex;gap:0.85rem;align-items:center;background:white;border-radius:14px;padding:0.85rem 1.1rem;margin-bottom:1.25rem;border:1px solid #e4ecea;box-shadow:0 2px 8px rgba(71,152,128,0.05);}
      .ij-resource-icon{font-size:1.4rem;}
      .ij-resource-label{font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#479880;margin-bottom:0.15rem;}
      .ij-resource-name{font-size:0.9rem;font-weight:600;color:#0f2421;}
      .ij-card{background:white;border-radius:24px;padding:2rem;box-shadow:0 4px 24px rgba(71,152,128,0.08);border:1px solid #eef4f2;}
      .ij-dots-row{display:flex;gap:0.4rem;margin-bottom:0.5rem;}
      .ij-dot{width:24px;height:5px;border-radius:3px;background:#e4ecea;transition:all 0.2s ease;}
      .ij-dot.active{background:var(--teal);width:32px;}
      .ij-dot.done{background:#c8e8df;}
      .ij-q-counter{font-size:0.72rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#7a9b97;margin-bottom:1.25rem;}
      .ij-question-text{font-size:1.05rem;font-weight:700;color:#0f2421;line-height:1.5;margin-bottom:1.5rem;}
      .ij-options{display:flex;flex-direction:column;gap:0.6rem;margin-bottom:1.5rem;}
      .ij-option{display:flex;align-items:flex-start;gap:0.85rem;padding:0.9rem 1rem;background:#f8fffe;border:1.5px solid #e4ecea;border-radius:12px;cursor:pointer;transition:all 0.18s ease;text-align:left;font-family:inherit;font-size:0.9rem;color:#1a2e2b;font-weight:500;}
      .ij-option:hover{border-color:var(--teal);background:#f0faf7;}
      .ij-option.selected{border-color:var(--teal);background:#f0faf7;}
      .ij-option-radio{width:18px;height:18px;border-radius:50%;border:2px solid #c5d9d6;flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-top:1px;transition:border-color 0.18s;}
      .ij-option.selected .ij-option-radio{border-color:var(--teal);}
      .ij-option-radio-dot{width:8px;height:8px;border-radius:50%;background:var(--teal);}
      .ij-text-area-wrap{margin-bottom:1.5rem;}
      .ij-textarea{width:100%;padding:1rem;border:1.5px solid #e4ecea;border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;color:#1a2e2b;resize:vertical;transition:border-color 0.18s;background:#f8fffe;line-height:1.6;}
      .ij-textarea:focus{outline:none;border-color:var(--teal);background:white;}
      .ij-char-count{font-size:0.72rem;color:#7a9b97;text-align:right;margin-top:0.3rem;}
      .ij-nav-row{display:flex;justify-content:space-between;align-items:center;gap:1rem;}
      .ij-btn-back{background:none;border:2px solid #e4ecea;border-radius:12px;padding:0.75rem 1.3rem;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.88rem;font-weight:600;color:#4a6360;cursor:pointer;transition:all 0.18s;}
      .ij-btn-back:hover:not(:disabled){border-color:var(--teal);color:var(--teal);}
      .ij-btn-back:disabled{opacity:0.3;cursor:not-allowed;}
      .ij-btn-primary{background:linear-gradient(135deg,var(--teal),var(--blue));border:none;border-radius:12px;padding:0.8rem 2rem;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.92rem;font-weight:700;color:white;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 16px rgba(71,152,128,0.3);}
      .ij-btn-primary:hover:not(.disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(71,152,128,0.35);}
      .ij-btn-primary.disabled{background:#c5d9d6;box-shadow:none;cursor:not-allowed;}
      .ij-btn-secondary{background:none;border:2px solid #e4ecea;border-radius:12px;padding:0.8rem 2rem;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.92rem;font-weight:600;color:#4a6360;cursor:pointer;}
    `}</style>
  );
}

function LoadingStyles() {
  return (
    <style jsx global>{`
      .ij-loading{min-height:100vh;background:#f4f9f8;display:flex;align-items:center;justify-content:center;}
      .ij-spinner{width:48px;height:48px;border:4px solid #e8f0ef;border-top-color:#479880;border-radius:50%;animation:spin 0.9s linear infinite;}
      @keyframes spin{to{transform:rotate(360deg);}}
    `}</style>
  );
}