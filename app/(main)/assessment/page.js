// app/(main)/assessment/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/assessment/ProgressBar";
import AssessmentQuestion from "@/components/assessment/AssessmentQuestion";
import { QuestionStyles } from "@/components/assessment/QuestionTypes";
import {
  QUESTIONS,
  PHASES,
  PHASE_COMPLETE_MESSAGES,
} from "@/lib/assessment-questions";

// ─── localStorage helpers ─────────────────────────────────────────────────────
const STORAGE_KEY = "inklusijobs_assessment_v2";

function saveProgress(index, answers) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ index, answers })); } catch {}
}
function loadProgress() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

// ─── Section labels ───────────────────────────────────────────────────────────
const SECTION_LABELS = {
  A: "Section A — Your Skills Right Now",
  B: "Section B — Your Work Goals & Style",
  C: "Section C — Your Preferences & Needs",
};

const SECTION_INTROS = {
  A: { emoji: "🧠", subtitle: "Questions 1–5  •  Required  •  ~3 minutes" },
  B: { emoji: "🎯", subtitle: "Questions 6–10  •  Required  •  ~3 minutes" },
  C: { emoji: "💙", subtitle: "Questions 11–15  •  Optional but encouraged  •  ~2 minutes" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex]     = useState(0);
  const [answers, setAnswers]               = useState({});
  const [currentAnswer, setCurrentAnswer]   = useState(undefined);
  const [phaseMessage, setPhaseMessage]     = useState(null);
  const [sectionIntro, setSectionIntro]     = useState(null);
  const [isLoading, setIsLoading]           = useState(false);
  const [error, setError]                   = useState(null);
  const [showWelcome, setShowWelcome]       = useState(true);

  const totalQuestions = QUESTIONS.length;
  const currentQ       = QUESTIONS[currentIndex];
  const currentPhase   = currentQ?.phase;
  const currentSection = currentQ?.section;

  // ── Load saved progress ──────────────────────────────────────────────────
  useEffect(() => {
    const saved = loadProgress();
    if (saved && saved.index > 0) {
      setCurrentIndex(saved.index);
      setAnswers(saved.answers || {});
      setShowWelcome(false);
    }
  }, []);

  // ── Sync current answer ──────────────────────────────────────────────────
  useEffect(() => {
    setCurrentAnswer(answers[currentQ?.id] ?? undefined);
  }, [currentIndex, currentQ?.id, answers]);

  // ── Auto-save ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!showWelcome) saveProgress(currentIndex, answers);
  }, [currentIndex, answers, showWelcome]);

  // ── Go Next ──────────────────────────────────────────────────────────────
  const goNext = useCallback(async (skipped = false) => {
    const updatedAnswers = skipped
      ? answers
      : { ...answers, [currentQ.id]: currentAnswer };

    if (!skipped) setAnswers(updatedAnswers);

    const nextIndex = currentIndex + 1;

    // Last question → run AI
    if (nextIndex >= totalQuestions) {
      await runAnalysis(updatedAnswers);
      return;
    }

    const nextQ = QUESTIONS[nextIndex];

    // Phase changed → show phase complete message
    if (nextQ.phase !== currentPhase) {
      const msg = PHASE_COMPLETE_MESSAGES[currentPhase];
      setPhaseMessage(msg);
      setTimeout(() => {
        setPhaseMessage(null);
        // Show section intro for new section
        const intro = SECTION_INTROS[nextQ.section];
        if (intro && nextQ.section !== currentSection) {
          setSectionIntro({ section: nextQ.section, ...intro });
          setTimeout(() => {
            setSectionIntro(null);
            setCurrentIndex(nextIndex);
          }, 2500);
        } else {
          setCurrentIndex(nextIndex);
        }
      }, 2000);
      return;
    }

    setCurrentIndex(nextIndex);
  }, [currentIndex, currentAnswer, currentQ, currentPhase, currentSection, totalQuestions, answers]);

  // ── Go Back ──────────────────────────────────────────────────────────────
  const goBack = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  }, [currentIndex]);

  // ── Handle answer change ─────────────────────────────────────────────────
  const handleAnswerChange = useCallback((val) => {
    setCurrentAnswer(val);
    setAnswers(prev => ({ ...prev, [currentQ.id]: val }));
  }, [currentQ?.id]);

  // ── Run AI Analysis ──────────────────────────────────────────────────────
  async function runAnalysis(finalAnswers) {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Skill gap analysis
      const gapRes = await fetch("/api/skill-gap-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      if (!gapRes.ok) throw new Error("Skill gap analysis failed");
      const gapData = await gapRes.json();

      // Step 2: Roadmap generation
      const roadmapRes = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: gapData.payload, analysis: gapData.analysis }),
      });
      if (!roadmapRes.ok) throw new Error("Roadmap generation failed");

      clearProgress();

      // TODO: Save roadmapData to Supabase before redirecting
      router.push("/roadmap");

    } catch (err) {
      console.error("[Assessment] Error:", err);
      setError("Something went wrong building your roadmap. Please try again.");
      setIsLoading(false);
    }
  }

  // ── Can continue? ────────────────────────────────────────────────────────
  const canContinue = (() => {
    if (!currentQ) return false;
    if (!currentQ.required) return true;
    if (currentQ.type === "single") return !!currentAnswer;
    if (currentQ.type === "multi")  return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    return true;
  })();

  // ── Welcome screen ───────────────────────────────────────────────────────
  if (showWelcome) {
    return (
      <div className="ij-page">
        <PageStyles />
        <div className="ij-shell">
          <LogoRow />
          <div className="ij-card ij-welcome-card">
            <div className="ij-welcome-emoji">👋</div>
            <h1 className="ij-welcome-title">Welcome to InklusiJobs!</h1>
            <p className="ij-welcome-body">
              Before we build your personalized learning roadmap, we have a few quick questions.
              This should take about <strong>7–10 minutes</strong>.
            </p>
            <div className="ij-welcome-points">
              <div className="ij-point">✅ There are no right or wrong answers</div>
              <div className="ij-point">✅ You can skip any question you're not comfortable with</div>
              <div className="ij-point">✅ Your progress saves automatically</div>
              <div className="ij-point">🔒 Your disability information is private by default</div>
            </div>
            <div className="ij-section-previews">
              <div className="ij-preview-item">
                <span className="ij-preview-emoji">🧠</span>
                <div>
                  <strong>Section A</strong> — Your Skills Right Now
                  <span className="ij-preview-sub">5 questions · required</span>
                </div>
              </div>
              <div className="ij-preview-item">
                <span className="ij-preview-emoji">🎯</span>
                <div>
                  <strong>Section B</strong> — Your Work Goals & Style
                  <span className="ij-preview-sub">5 questions · required</span>
                </div>
              </div>
              <div className="ij-preview-item">
                <span className="ij-preview-emoji">💙</span>
                <div>
                  <strong>Section C</strong> — Your Preferences & Needs
                  <span className="ij-preview-sub">5 questions · optional but encouraged</span>
                </div>
              </div>
            </div>
            <button
              className="ij-btn-primary ij-start-btn"
              onClick={() => setShowWelcome(false)}
            >
              Ready? Let's get started →
            </button>
          </div>
          <p className="ij-footer-note">🔒 Your answers are private. You can update them anytime in your settings.</p>
        </div>
        <WelcomeStyles />
      </div>
    );
  }

  // ── Loading screen ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="ij-overlay-screen">
        <div className="ij-overlay-card">
          <div className="ij-spinner" aria-hidden="true" />
          <h2>Building your personalized roadmap…</h2>
          <p>Analyzing your answers and mapping your skills. This takes about 10–15 seconds. 🌟</p>
        </div>
        <OverlayStyles />
      </div>
    );
  }

  // ── Error screen ─────────────────────────────────────────────────────────
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
        <div className="ij-overlay-card ij-phase-card">
          <div className="ij-big-emoji">{phaseMessage.emoji}</div>
          <h2>{phaseMessage.message}</h2>
          <p>Moving to the next section…</p>
        </div>
        <OverlayStyles />
      </div>
    );
  }

  // ── Section intro overlay ────────────────────────────────────────────────
  if (sectionIntro) {
    return (
      <div className="ij-overlay-screen">
        <div className="ij-overlay-card ij-section-card">
          <div className="ij-big-emoji">{sectionIntro.emoji}</div>
          <div className="ij-section-label">{SECTION_LABELS[sectionIntro.section]}</div>
          <p>{sectionIntro.subtitle}</p>
        </div>
        <OverlayStyles />
      </div>
    );
  }

  // ── Main assessment ──────────────────────────────────────────────────────
  return (
    <div className="ij-page">
      <PageStyles />
      <QuestionStyles />

      <div className="ij-shell">
        <LogoRow />

        <div className="ij-card">
          {/* Section label */}
          <div className="ij-section-tag">
            {SECTION_INTROS[currentSection]?.emoji} {SECTION_LABELS[currentSection]}
          </div>

          {/* Progress bar */}
          <ProgressBar
            currentPhase={currentPhase}
            currentQuestionIndex={currentIndex + 1}
            totalQuestions={totalQuestions}
            phases={PHASES}
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
              aria-label="Go back to previous question"
            >
              ← Back
            </button>
            <button
              className={`ij-btn-primary ${!canContinue ? "disabled" : ""}`}
              onClick={() => goNext(false)}
              disabled={!canContinue}
              aria-label={currentIndex + 1 >= totalQuestions ? "Finish and build roadmap" : "Next question"}
            >
              {currentIndex + 1 >= totalQuestions ? "Build My Roadmap 🚀" : "Next →"}
            </button>
          </div>
        </div>

        <p className="ij-footer-note">
          🔒 Your answers are private and saved automatically.
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function LogoRow() {
  return (
    <div className="ij-logo-row">
      <div className="ij-logo-mark">IJ</div>
      <span className="ij-logo-text">InklusiJobs</span>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
function PageStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      :root {
        --teal:   #479880;
        --blue:   #4B959E;
        --mid:    #648FBF;
        --purple: #8891C9;
        --soft:   #9A89C6;
        --bg:     #f4f9f8;
      }

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      .ij-page {
        min-height: 100vh;
        background: var(--bg);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        font-family: 'Plus Jakarta Sans', sans-serif;
        padding: 2rem 1.5rem;
      }

      .ij-shell {
        width: 100%;
        max-width: 600px;
      }

      .ij-logo-row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        justify-content: center;
        margin-bottom: 1.5rem;
      }

      .ij-logo-mark {
        width: 36px; height: 36px;
        background: linear-gradient(135deg, var(--teal), var(--blue));
        border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        color: white; font-weight: 800; font-size: 0.85rem;
      }

      .ij-logo-text {
        font-weight: 700; font-size: 1.1rem; color: #0f2421; letter-spacing: -0.02em;
      }

      .ij-card {
        background: white;
        border-radius: 24px;
        padding: 2rem 2.4rem;
        box-shadow: 0 4px 6px rgba(71,152,128,0.04), 0 20px 60px rgba(71,152,128,0.10);
        border: 1px solid rgba(71,152,128,0.08);
      }

      .ij-section-tag {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #648FBF;
        margin-bottom: 1rem;
      }

      .ij-nav-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 2rem;
        gap: 1rem;
      }

      .ij-btn-back {
        background: none;
        border: 2px solid #e4ecea;
        border-radius: 12px;
        padding: 0.75rem 1.3rem;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 0.9rem;
        font-weight: 600;
        color: #4a6360;
        cursor: pointer;
        transition: all 0.18s ease;
      }

      .ij-btn-back:hover:not(:disabled) { border-color: var(--teal); color: var(--teal); }
      .ij-btn-back:disabled { opacity: 0.3; cursor: not-allowed; }
      .ij-btn-back:focus-visible { outline: 3px solid var(--teal); outline-offset: 3px; }

      .ij-btn-primary {
        background: linear-gradient(135deg, var(--teal), var(--blue));
        border: none;
        border-radius: 12px;
        padding: 0.8rem 2rem;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 0.95rem;
        font-weight: 700;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 16px rgba(71,152,128,0.3);
        letter-spacing: -0.01em;
      }

      .ij-btn-primary:hover:not(.disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(71,152,128,0.35); }
      .ij-btn-primary.disabled { background: #c5d9d6; box-shadow: none; cursor: not-allowed; }
      .ij-btn-primary:focus-visible { outline: 3px solid var(--teal); outline-offset: 3px; }

      .ij-footer-note {
        text-align: center;
        font-size: 0.78rem;
        color: #7a9b97;
        margin-top: 1.25rem;
      }

      @media (max-width: 480px) {
        .ij-card { padding: 1.5rem 1.25rem; border-radius: 20px; }
        .ij-btn-primary { font-size: 0.88rem; padding: 0.75rem 1.4rem; }
      }
    `}</style>
  );
}

function WelcomeStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      .ij-page { min-height: 100vh; background: #f4f9f8; display: flex; align-items: flex-start; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; padding: 2rem 1.5rem; }
      .ij-shell { width: 100%; max-width: 600px; }
      .ij-logo-row { display: flex; align-items: center; gap: 0.6rem; justify-content: center; margin-bottom: 1.5rem; }
      .ij-logo-mark { width: 36px; height: 36px; background: linear-gradient(135deg, #479880, #4B959E); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 0.85rem; }
      .ij-logo-text { font-weight: 700; font-size: 1.1rem; color: #0f2421; letter-spacing: -0.02em; }

      .ij-welcome-card {
        background: white;
        border-radius: 24px;
        padding: 2.5rem;
        box-shadow: 0 20px 60px rgba(71,152,128,0.10);
        border: 1px solid rgba(71,152,128,0.08);
        text-align: center;
      }

      .ij-welcome-emoji { font-size: 3rem; margin-bottom: 1rem; }

      .ij-welcome-title {
        font-size: 1.6rem;
        font-weight: 800;
        color: #0f2421;
        margin-bottom: 0.75rem;
        letter-spacing: -0.02em;
      }

      .ij-welcome-body {
        font-size: 0.97rem;
        color: #4a6360;
        line-height: 1.65;
        margin-bottom: 1.5rem;
      }

      .ij-welcome-points {
        text-align: left;
        background: #f5fbf9;
        border-radius: 14px;
        padding: 1.2rem 1.4rem;
        margin-bottom: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .ij-point {
        font-size: 0.9rem;
        color: #2d5050;
        font-weight: 500;
        line-height: 1.4;
      }

      .ij-section-previews {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 2rem;
        text-align: left;
      }

      .ij-preview-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.85rem 1rem;
        border: 2px solid #e4ecea;
        border-radius: 12px;
        background: white;
      }

      .ij-preview-emoji { font-size: 1.4rem; flex-shrink: 0; }

      .ij-preview-item div {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        font-size: 0.92rem;
        color: #1a2e2b;
        font-weight: 600;
      }

      .ij-preview-sub {
        font-size: 0.78rem;
        color: #7a9b97;
        font-weight: 400;
      }

      .ij-start-btn { width: 100%; font-size: 1rem; padding: 1rem; }
      .ij-btn-primary { background: linear-gradient(135deg, #479880, #4B959E); border: none; border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; color: white; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 16px rgba(71,152,128,0.3); }
      .ij-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(71,152,128,0.35); }

      .ij-footer-note { text-align: center; font-size: 0.78rem; color: #7a9b97; margin-top: 1.25rem; }
    `}</style>
  );
}

function OverlayStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      .ij-overlay-screen { min-height: 100vh; background: #f4f9f8; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; padding: 2rem; }
      .ij-overlay-card { background: white; border-radius: 24px; padding: 3rem 2.5rem; max-width: 420px; width: 100%; text-align: center; box-shadow: 0 20px 60px rgba(71,152,128,0.12); }
      .ij-overlay-card h2 { font-size: 1.35rem; font-weight: 700; color: #0f2421; margin: 1.2rem 0 0.6rem; }
      .ij-overlay-card p { font-size: 0.92rem; color: #6b8a87; line-height: 1.6; }
      .ij-big-emoji { font-size: 3.5rem; margin-bottom: 0.5rem; }
      .ij-section-label { font-size: 1.1rem; font-weight: 700; color: #479880; margin-bottom: 0.4rem; }
      .ij-phase-card h2 { font-size: 1.4rem; }
      .ij-spinner { width: 52px; height: 52px; border: 4px solid #e8f0ef; border-top-color: #479880; border-radius: 50%; animation: spin 0.9s linear infinite; margin: 0 auto; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .ij-btn-primary { background: linear-gradient(135deg, #479880, #4B959E); border: none; border-radius: 12px; padding: 0.8rem 2rem; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.95rem; font-weight: 700; color: white; cursor: pointer; margin-top: 1.5rem; }
    `}</style>
  );
}