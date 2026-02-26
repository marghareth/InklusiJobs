"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
export const QUESTIONS = ABOUT_YOU_QUESTIONS;
export const QUESTION_ORDER = ABOUT_YOU_QUESTIONS.map((q) => q.id);
import {
  QUESTIONS,
  PHASES,
  PHASE_COMPLETE_MESSAGES,
  QUESTION_ORDER,
} from "@/lib/assessment-questions";
import ProgressBar from "./ProgressBar";
import AssessmentQuestion from "./AssessmentQuestion";

// ─── Phase Complete Interstitial ──────────────────────────────────────────────
function PhaseComplete({ phaseId, onContinue }) {
  const msg = PHASE_COMPLETE_MESSAGES[phaseId];
  return (
    <div className="ij-phase-complete">
      <div className="ij-phase-complete-emoji">{msg.emoji}</div>
      <p className="ij-phase-complete-msg">{msg.message}</p>
      {phaseId < PHASES.length && (
        <button className="ij-continue-btn" onClick={onContinue}>
          Continue →
        </button>
      )}
      <style jsx>{`
        .ij-phase-complete {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          text-align: center;
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .ij-phase-complete-emoji {
          font-size: 3.5rem;
          margin-bottom: 1rem;
        }
        .ij-phase-complete-msg {
          font-size: 1.15rem;
          font-weight: 600;
          color: #0f2421;
          margin: 0 0 2rem;
          max-width: 340px;
          line-height: 1.5;
        }
        .ij-continue-btn {
          padding: 0.85rem 2.2rem;
          background: linear-gradient(135deg, #479880, #4b959e);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition:
            opacity 0.2s,
            transform 0.15s;
        }
        .ij-continue-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .ij-continue-btn:focus-visible {
          outline: 3px solid #479880;
          outline-offset: 3px;
        }
      `}</style>
    </div>
  );
}

// ─── Main AssessmentPage ──────────────────────────────────────────────────────
export default function AssessmentPage() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0); // index into QUESTION_ORDER
  const [answers, setAnswers] = useState({}); // { [questionId]: value }
  const [phaseComplete, setPhaseComplete] = useState(null); // phaseId | null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalQuestions = QUESTION_ORDER.length; // 15
  const currentId = QUESTION_ORDER[currentIndex];
  const currentQuestion = QUESTIONS.find((q) => q.id === currentId);
  const currentPhase = currentQuestion?.phase ?? 1;
  const currentValue =
    answers[currentId] ?? (currentQuestion?.type === "multi" ? [] : "");

  // ── Save assessment to database ─────────────────────────────────────────────
  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const { error } = await supabase.from("assessments").insert([
        {
          user_id: user.id,
          answers: answers,
          completed: true,
          created_at: new Date(),
        },
      ]);

      if (error) throw error;

      // Redirect to results page
      window.location.href = "/results";
    } catch (error) {
      console.error("Error saving assessment:", error);
      setError("Failed to save assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Navigation ─────────────────────────────────────────────────────────────
  const advance = useCallback(() => {
    const nextIndex = currentIndex + 1;

    // Check if we just finished a phase
    const nextQuestion = QUESTIONS.find(
      (q) => q.id === QUESTION_ORDER[nextIndex],
    );
    const isLastQuestion = nextIndex >= totalQuestions;
    const phaseChanged =
      !isLastQuestion && nextQuestion?.phase !== currentPhase;

    if (isLastQuestion) {
      // Final phase complete → show message then redirect
      setPhaseComplete(currentPhase);
      return;
    }

    if (phaseChanged) {
      setPhaseComplete(currentPhase);
      return;
    }

    setCurrentIndex(nextIndex);
  }, [currentIndex, currentPhase, totalQuestions]);

  const handleContinueAfterPhase = useCallback(() => {
    setPhaseComplete(null);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalQuestions) {
      // All done → save assessment and go to results
      handleComplete();
      return;
    }
    setCurrentIndex(nextIndex);
  }, [currentIndex, totalQuestions, answers]);

  const handleAnswer = useCallback(
    (value) => {
      setAnswers((prev) => ({ ...prev, [currentId]: value }));
    },
    [currentId],
  );

  const handleNext = useCallback(() => {
    const isEmpty =
      !currentValue ||
      (Array.isArray(currentValue) && currentValue.length === 0) ||
      currentValue === "";

    if (currentQuestion?.required && isEmpty) return; // block if required + empty
    advance();
  }, [currentValue, currentQuestion, advance]);

  const handleSkip = useCallback(() => {
    if (currentQuestion?.required) return;
    advance();
  }, [currentQuestion, advance]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  const isEmpty =
    !currentValue ||
    (Array.isArray(currentValue) && currentValue.length === 0) ||
    currentValue === "";
  const canAdvance = !currentQuestion?.required || !isEmpty;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="ij-assessment-page">
      <div className="ij-assessment-shell">
        {/* Header */}
        <div className="ij-assessment-header">
          <span className="ij-logo">
            Inklusi<span>Jobs</span>
          </span>
          <span className="ij-header-label">Skills Assessment</span>
        </div>

        {/* Progress */}
        <ProgressBar
          currentPhase={currentPhase}
          currentQuestionIndex={currentIndex + 1}
          totalQuestions={totalQuestions}
        />

        {/* Phase complete interstitial OR question */}
        {phaseComplete ? (
          <PhaseComplete
            phaseId={phaseComplete}
            onContinue={handleContinueAfterPhase}
          />
        ) : (
          <>
            {/* Error message */}
            {error && <div className="ij-error-message">{error}</div>}

            {/* Question or loading state */}
            {loading ? (
              <div className="ij-loading">Saving your assessment...</div>
            ) : (
              <AssessmentQuestion
                question={currentQuestion}
                value={currentValue}
                onChange={handleAnswer}
                onSkip={handleSkip}
                onBack={handleBack}
              />
            )}

            {/* Navigation row */}
            <div className="ij-nav-row">
              {currentIndex > 0 && !loading && (
                <button
                  className="ij-back-btn"
                  onClick={handleBack}
                  type="button"
                >
                  ← Back
                </button>
              )}
              <button
                className={`ij-next-btn ${!canAdvance || loading ? "disabled" : ""}`}
                onClick={handleNext}
                disabled={!canAdvance || loading}
                type="button"
              >
                {loading
                  ? "Saving..."
                  : currentIndex === totalQuestions - 1
                    ? "Finish →"
                    : "Next →"}
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .ij-assessment-page {
          min-height: 100vh;
          background: linear-gradient(
            160deg,
            #f0faf7 0%,
            #e8f4f8 50%,
            #f5f0fa 100%
          );
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 2rem 1rem 4rem;
          font-family: "DM Sans", sans-serif;
        }

        .ij-assessment-shell {
          width: 100%;
          max-width: 680px;
          background: white;
          border-radius: 24px;
          padding: 2.5rem 2.5rem 2rem;
          box-shadow: 0 8px 48px rgba(15, 36, 33, 0.1);
          margin-top: 2rem;
        }

        /* Header */
        .ij-assessment-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }
        .ij-logo {
          font-family: "DM Serif Display", serif;
          font-size: 1.2rem;
          color: #1e293b;
          font-weight: 400;
        }
        .ij-logo span {
          color: #15803d;
        }
        .ij-header-label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #7a9b97;
        }

        /* Error message */
        .ij-error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          border: 1px solid #fecaca;
        }

        /* Loading state */
        .ij-loading {
          text-align: center;
          padding: 2rem;
          color: #479880;
          font-weight: 600;
        }

        /* Navigation */
        .ij-nav-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f0f5f4;
        }

        .ij-back-btn {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: 1.5px solid #d1dedd;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #7a9b97;
          cursor: pointer;
          font-family: inherit;
          transition:
            border-color 0.2s,
            color 0.2s;
        }
        .ij-back-btn:hover {
          border-color: #479880;
          color: #479880;
        }
        .ij-back-btn:focus-visible {
          outline: 3px solid #479880;
          outline-offset: 3px;
        }

        .ij-next-btn {
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, #479880, #4b959e);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition:
            opacity 0.2s,
            transform 0.15s;
          box-shadow: 0 4px 14px rgba(71, 152, 128, 0.25);
        }
        .ij-next-btn:hover:not(.disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .ij-next-btn:focus-visible {
          outline: 3px solid #479880;
          outline-offset: 3px;
        }
        .ij-next-btn.disabled {
          background: #d1dedd;
          box-shadow: none;
          cursor: not-allowed;
          opacity: 0.7;
        }

        @media (max-width: 600px) {
          .ij-assessment-shell {
            padding: 1.5rem 1.2rem;
            border-radius: 16px;
          }
          .ij-nav-row {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
