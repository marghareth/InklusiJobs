// components/assessment/AssessmentQuestion.jsx
"use client";

import { SingleSelect, MultiSelect, OpenText } from "./QuestionTypes";

export default function AssessmentQuestion({ question, value, onChange, onSkip, onBack }) {
  const isEmpty = !value || (Array.isArray(value) && value.length === 0) || value === "";

  return (
    <div className="ij-question-card">
      {/* Phase badge */}
      <div className="ij-phase-badge">Phase {question.phase}</div>

      {/* Question */}
      <h2 id={`q${question.id}-label`} className="ij-question-text">
        {question.question}
      </h2>

      {/* Hint / optional label */}
      {question.hint && (
        <p className="ij-hint" id={`q${question.id}-hint`}>
          {question.hint}
        </p>
      )}

      {/* Answer input */}
      <div className="ij-answer-area">
        {question.type === "single" && (
          <SingleSelect question={question} value={value} onChange={onChange} />
        )}
        {question.type === "multi" && (
          <MultiSelect question={question} value={value} onChange={onChange} />
        )}
        {question.type === "text" && (
          <OpenText question={question} value={value} onChange={onChange} />
        )}
      </div>

      {/* Skip button */}
      {!question.required ? (
        <button
          className="ij-skip-btn"
          onClick={onSkip}
          type="button"
          aria-label={`Skip question: ${question.question}`}
        >
          Skip this question →
        </button>
      ) : (
        isEmpty && (
          <p className="ij-required-notice" role="alert" aria-live="polite">
            This question helps us build your roadmap — please select an answer to continue.
          </p>
        )
      )}

      <style jsx>{`
        .ij-question-card {
          width: 100%;
          animation: slideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ij-phase-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: linear-gradient(135deg, #e8f6f2, #e4f2f5);
          color: #4B959E;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.9rem;
        }

        .ij-question-text {
          font-size: 1.35rem;
          font-weight: 700;
          color: #0f2421;
          line-height: 1.35;
          margin: 0 0 0.6rem 0;
          letter-spacing: -0.01em;
        }

        .ij-hint {
          font-size: 0.85rem;
          color: #6b8a87;
          margin: 0 0 1.2rem 0;
          font-style: italic;
        }

        .ij-answer-area {
          margin-top: 1.2rem;
        }

        .ij-skip-btn {
          margin-top: 1.25rem;
          background: none;
          border: none;
          color: #7a9b97;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0.25rem 0;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.2s;
          font-family: inherit;
        }

        .ij-skip-btn:hover {
          color: #479880;
        }

        .ij-skip-btn:focus-visible {
          outline: 2px solid #479880;
          outline-offset: 3px;
          border-radius: 4px;
        }

        .ij-required-notice {
          margin-top: 0.9rem;
          font-size: 0.82rem;
          color: #7a9b97;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}