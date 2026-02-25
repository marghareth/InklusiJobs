// components/assessment/ProgressBar.jsx
"use client";

import { PHASES } from "@/lib/assessment-questions";

export default function ProgressBar({ currentPhase, currentQuestionIndex, totalQuestions }) {
  const overallPercent = Math.round((currentQuestionIndex / totalQuestions) * 100);

  return (
    <div className="ij-progress-wrapper" role="progressbar" aria-valuenow={overallPercent} aria-valuemin={0} aria-valuemax={100}>
      {/* Phase labels */}
      <div className="ij-phase-labels">
        {PHASES.map((phase) => {
          const isComplete = phase.id < currentPhase;
          const isActive   = phase.id === currentPhase;
          return (
            <div
              key={phase.id}
              className={`ij-phase-label ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`}
              aria-current={isActive ? "step" : undefined}
            >
              <div className="ij-phase-dot">
                {isComplete ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span>{phase.id}</span>
                )}
              </div>
              <span className="ij-phase-text">{phase.label}</span>
            </div>
          );
        })}
      </div>

      {/* Progress bar track */}
      <div className="ij-track">
        <div className="ij-fill" style={{ width: `${overallPercent}%` }} />
      </div>

      {/* Question counter */}
      <div className="ij-counter" aria-live="polite">
        Question {currentQuestionIndex} of {totalQuestions}
      </div>

      <style jsx>{`
        .ij-progress-wrapper {
          width: 100%;
          margin-bottom: 2rem;
        }

        .ij-phase-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          gap: 0.25rem;
        }

        .ij-phase-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          flex: 1;
          opacity: 0.4;
          transition: opacity 0.3s ease;
        }

        .ij-phase-label.active,
        .ij-phase-label.complete {
          opacity: 1;
        }

        .ij-phase-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #e8f0ef;
          border: 2px solid #c5d9d6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: #7a9b97;
          transition: all 0.3s ease;
        }

        .ij-phase-label.active .ij-phase-dot {
          background: #479880;
          border-color: #479880;
          color: white;
          box-shadow: 0 0 0 4px rgba(71, 152, 128, 0.15);
        }

        .ij-phase-label.complete .ij-phase-dot {
          background: #479880;
          border-color: #479880;
        }

        .ij-phase-text {
          font-size: 0.65rem;
          font-weight: 600;
          color: #4a6360;
          text-align: center;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .ij-track {
          height: 6px;
          background: #e8f0ef;
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .ij-fill {
          height: 100%;
          background: linear-gradient(90deg, #479880, #4B959E);
          border-radius: 999px;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .ij-counter {
          text-align: right;
          font-size: 0.75rem;
          color: #7a9b97;
          font-weight: 500;
        }

        @media (max-width: 480px) {
          .ij-phase-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}