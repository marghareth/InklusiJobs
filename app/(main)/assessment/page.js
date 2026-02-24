"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/assessment/ProgressBar";
import AssessmentQuestion from "@/components/assessment/AssessmentQuestion";
import { QuestionStyles } from "@/components/assessment/QuestionTypes";
import {
  getQuestionsForJob,
  PHASES,
  PHASE_COMPLETE_MESSAGES,
} from "@/lib/assessment-questions";
import { getJob, getTrack } from "@/lib/jobs";

// ─── localStorage helpers ─────────────────────────────────────────────────────
const STORAGE_KEY = "inklusijobs_assessment_v3";

function saveProgress(index, answers) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ index, answers })); } catch {}
}
function loadProgress() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}
function loadJobSelection() {
  try {
    const r = localStorage.getItem("inklusijobs_job_selection");
    return r ? JSON.parse(r) : null;
  } catch { return null; }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const router = useRouter();

  const [jobSelection, setJobSelection]   = useState(null);
  const [questions, setQuestions]         = useState([]);
  const [currentIndex, setCurrentIndex]   = useState(0);
  const [answers, setAnswers]             = useState({});
  const [currentAnswer, setCurrentAnswer] = useState(undefined);
  const [phaseMessage, setPhaseMessage]   = useState(null);
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState(null);
  const [timeouts, setTimeouts]           = useState([]);

  // ── Load job selection & questions ───────────────────────────────────────
  useEffect(() => {
    const selection = loadJobSelection();
    if (!selection?.trackId || !selection?.jobId) {
      router.replace("/job-select");
      return;
    }
    setJobSelection(selection);
    const qs = getQuestionsForJob(selection.jobId);
    setQuestions(qs);

    // Restore saved progress if any
    const saved = loadProgress();
    if (saved && saved.index > 0 && saved.index < qs.length) {
      setCurrentIndex(saved.index);
      setAnswers(saved.answers || {});
    }
  }, [router]);

  // ── Cleanup timeouts on unmount ───────────────────────────────────────────
  useEffect(() => {
    return () => timeouts.forEach(clearTimeout);
  }, [timeouts]);

  const addTimeout = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    setTimeouts(prev => [...prev, id]);
    return id;
  }, []);

  const currentQ     = questions[currentIndex];
  const currentPhase = currentQ?.phase;
  const totalQ       = questions.length;

  // ── Sync current answer ──────────────────────────────────────────────────
  useEffect(() => {
    if (currentQ) setCurrentAnswer(answers[currentQ.id] ?? undefined);
  }, [currentIndex, currentQ, answers]);

  // ── Auto-save ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (questions.length > 0) saveProgress(currentIndex, answers);
  }, [currentIndex, answers, questions.length]);

  // ── Handle answer change ─────────────────────────────────────────────────
  const handleAnswerChange = useCallback((val) => {
    setCurrentAnswer(val);
    setAnswers(prev => ({ ...prev, [currentQ.id]: val }));
  }, [currentQ?.id]);

  // ── Go Back ──────────────────────────────────────────────────────────────
  const goBack = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  }, [currentIndex]);

  // ── Go Next ──────────────────────────────────────────────────────────────
  const goNext = useCallback(async (skipped = false) => {
    const updatedAnswers = skipped
      ? answers
      : { ...answers, [currentQ.id]: currentAnswer };

    if (!skipped) setAnswers(updatedAnswers);

    const nextIndex = currentIndex + 1;

    if (nextIndex >= totalQ) {
      await runAnalysis(updatedAnswers);
      return;
    }

    const nextQ = questions[nextIndex];

    // Phase transition
    if (nextQ.phase !== currentPhase) {
      const msg = PHASE_COMPLETE_MESSAGES[currentPhase];
      setPhaseMessage(msg);
      addTimeout(() => {
        setPhaseMessage(null);
        setCurrentIndex(nextIndex);
      }, 2200);
      return;
    }

    setCurrentIndex(nextIndex);
  }, [currentIndex, currentAnswer, currentQ, currentPhase, totalQ, answers, questions, addTimeout]);

  // ── Run Analysis ─────────────────────────────────────────────────────────
  const runAnalysis = useCallback(async (finalAnswers) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: finalAnswers,
          jobSelection,
        }),
      });

      if (!res.ok) throw new Error("Scoring failed");
      const data = await res.json();

      // Save results to localStorage for results page to read
      localStorage.setItem("inklusijobs_results", JSON.stringify(data));
      clearProgress();
      router.push("/results");

    } catch (err) {
      console.error("[Assessment] Error:", err);
      setError("Something went wrong analysing your answers. Please try again.");
      setIsLoading(false);
    }
  }, [jobSelection, router]);

  // ── Can continue? ─────────────────────────────────────────────────────────
  const canContinue = (() => {
    if (!currentQ) return false;
    if (!currentQ.required) return true;
    if (currentQ.type === "single") return !!currentAnswer;
    if (currentQ.type === "multi")  return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    if (currentQ.type === "text")   return typeof currentAnswer === "string" && currentAnswer.trim().length > 0;
    return true;
  })();

  // ── Guard: no questions loaded yet ───────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="ij-overlay-screen">
        <div className="ij-overlay-card">
          <div className="ij-spinner" aria-hidden="true" />
          <h2>Loading your assessment…</h2>
        </div>
        <OverlayStyles />
      </div>
    );
  }

  // ── Loading screen ────────────────────────────────────────────────────────
  if (isLoading) {
    const job   = getJob(jobSelection?.trackId, jobSelection?.jobId);
    return (
      <div className="ij-overlay-screen">
        <div className="ij-overlay-card">
          <div className="ij-spinner" aria-hidden="true" />
          <h2>Analysing your answers…</h2>
          <p>Checking your fit for <strong>{job?.title}</strong>. This takes about 10–15 seconds. 🌟</p>
        </div>
        <OverlayStyles />
      </div>
    );
  }

  // ── Error screen ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="ij-overlay-screen">
        <div className="ij-overlay-card">
          <p style={{ fontSize: "2.5rem" }}>😔</p>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="ij-btn-primary" onClick={() => setError(null)}>Try Again</button>
        </div>
        <OverlayStyles />
      </div>
    );
  }

  // ── Phase complete overlay ────────────────────────────────────────────────
  if (phaseMessage) {
    return (
      <div className="ij-overlay-screen">
        <div className="ij-overlay-card">
          <div className="ij-big-emoji">{phaseMessage.emoji}</div>
          <h2>{phaseMessage.message}</h2>
          <p>Moving to the next section…</p>
        </div>
        <OverlayStyles />
      </div>
    );
  }

  // ── Job context banner ────────────────────────────────────────────────────
  const job   = getJob(jobSelection?.trackId, jobSelection?.jobId);
  const track = getTrack(jobSelection?.trackId);

  // ── Main assessment ───────────────────────────────────────────────────────
  return (
    <div className="ij-page">
      <PageStyles />
      <QuestionStyles />

      <div className="ij-shell">
        {/* Logo */}
        <div className="ij-logo-row">
          <div className="ij-logo-mark">IJ</div>
          <span className="ij-logo-text">InklusiJobs</span>
        </div>

        {/* Job context banner */}
        <div className="ij-job-banner">
          <span className="ij-job-banner-track">{track?.emoji} {track?.label}</span>
          <span className="ij-job-banner-divider">→</span>
          <span className="ij-job-banner-role">{job?.title}</span>
        </div>

        <div className="ij-card">
          {/* Progress */}
          <ProgressBar
            currentPhase={currentPhase}
            currentQuestionIndex={currentIndex + 1}
            totalQuestions={totalQ}
          />

          {/* Question */}
          <AssessmentQuestion
            key={currentQ.id}
            question={currentQ}
            value={currentAnswer}
            onChange={handleAnswerChange}
            onSkip={() => goNext(true)}
          />

          {/* Navigation */}
          <div className="ij-nav-row">
            <button
              className="ij-btn-back"
              onClick={goBack}
              disabled={currentIndex === 0}
            >
              ← Back
            </button>
            <button
              className={`ij-btn-primary ${!canContinue ? "disabled" : ""}`}
              onClick={() => goNext(false)}
              disabled={!canContinue}
            >
              {currentIndex + 1 >= totalQ ? "Submit & See Results 🚀" : "Next →"}
            </button>
          </div>
        </div>

        <p className="ij-footer-note">🔒 Your answers are private and saved automatically.</p>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
function PageStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      :root { --teal:#479880; --blue:#4B959E; --bg:#f4f9f8; }
      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      body { background:var(--bg); }
      .ij-page { min-height:100vh; background:var(--bg); display:flex; align-items:flex-start; justify-content:center; font-family:'Plus Jakarta Sans',sans-serif; padding:2rem 1.5rem; }
      .ij-shell { width:100%; max-width:600px; }
      .ij-logo-row { display:flex; align-items:center; gap:0.6rem; justify-content:center; margin-bottom:1.25rem; }
      .ij-logo-mark { width:36px; height:36px; background:linear-gradient(135deg,var(--teal),var(--blue)); border-radius:10px; display:flex; align-items:center; justify-content:center; color:white; font-weight:800; font-size:0.85rem; }
      .ij-logo-text { font-weight:700; font-size:1.1rem; color:#0f2421; letter-spacing:-0.02em; }

      .ij-job-banner {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        justify-content: center;
        margin-bottom: 1.25rem;
        padding: 0.5rem 1rem;
        background: white;
        border-radius: 999px;
        border: 1px solid #e4ecea;
        font-size: 0.82rem;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(71,152,128,0.06);
      }
      .ij-job-banner-track { color: #479880; }
      .ij-job-banner-divider { color: #c5d9d6; }
      .ij-job-banner-role { color: #0f2421; }

      .ij-card { background:white; border-radius:24px; padding:2rem 2.4rem; box-shadow:0 4px 6px rgba(71,152,128,0.04),0 20px 60px rgba(71,152,128,0.10); border:1px solid rgba(71,152,128,0.08); }
      .ij-nav-row { display:flex; justify-content:space-between; align-items:center; margin-top:2rem; gap:1rem; }
      .ij-btn-back { background:none; border:2px solid #e4ecea; border-radius:12px; padding:0.75rem 1.3rem; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.9rem; font-weight:600; color:#4a6360; cursor:pointer; transition:all 0.18s ease; }
      .ij-btn-back:hover:not(:disabled) { border-color:var(--teal); color:var(--teal); }
      .ij-btn-back:disabled { opacity:0.3; cursor:not-allowed; }
      .ij-btn-primary { background:linear-gradient(135deg,var(--teal),var(--blue)); border:none; border-radius:12px; padding:0.8rem 2rem; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.95rem; font-weight:700; color:white; cursor:pointer; transition:all 0.2s ease; box-shadow:0 4px 16px rgba(71,152,128,0.3); }
      .ij-btn-primary:hover:not(.disabled) { transform:translateY(-2px); box-shadow:0 8px 24px rgba(71,152,128,0.35); }
      .ij-btn-primary.disabled { background:#c5d9d6; box-shadow:none; cursor:not-allowed; }
      .ij-footer-note { text-align:center; font-size:0.78rem; color:#7a9b97; margin-top:1.25rem; }
      @media(max-width:480px){ .ij-card { padding:1.5rem 1.25rem; } }
    `}</style>
  );
}

function OverlayStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      .ij-overlay-screen { min-height:100vh; background:#f4f9f8; display:flex; align-items:center; justify-content:center; font-family:'Plus Jakarta Sans',sans-serif; padding:2rem; }
      .ij-overlay-card { background:white; border-radius:24px; padding:3rem 2.5rem; max-width:420px; width:100%; text-align:center; box-shadow:0 20px 60px rgba(71,152,128,0.12); }
      .ij-overlay-card h2 { font-size:1.35rem; font-weight:700; color:#0f2421; margin:1.2rem 0 0.6rem; }
      .ij-overlay-card p { font-size:0.92rem; color:#6b8a87; line-height:1.6; }
      .ij-big-emoji { font-size:3.5rem; margin-bottom:0.5rem; }
      .ij-spinner { width:52px; height:52px; border:4px solid #e8f0ef; border-top-color:#479880; border-radius:50%; animation:spin 0.9s linear infinite; margin:0 auto; }
      @keyframes spin { to { transform:rotate(360deg); } }
      .ij-btn-primary { background:linear-gradient(135deg,#479880,#4B959E); border:none; border-radius:12px; padding:0.8rem 2rem; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.95rem; font-weight:700; color:white; cursor:pointer; margin-top:1.5rem; }
    `}</style>
  );
}