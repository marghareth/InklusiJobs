"use client";

/**
 * components/verification/GeminiAnalysis.jsx
 *
 * Reusable component that displays the Gemini AI document analysis
 * results in a structured, readable format.
 *
 * Usage:
 *   import GeminiAnalysis from "@/components/verification/GeminiAnalysis";
 *
 *   <GeminiAnalysis result={analysisResult} />
 *
 * Props:
 *   result       — the full object returned by /api/verification/analyze-document
 *   showRaw      — boolean, show raw JSON toggle (default: false, useful for debugging)
 *   compact      — boolean, show condensed single-card view (default: false)
 */

import { useState } from "react";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, icon, children, borderColor = "border-gray-100" }) {
  return (
    <div className={`bg-white border ${borderColor} rounded-2xl p-5 space-y-3`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-bold text-gray-700">{title}</span>
      </div>
      {children}
    </div>
  );
}

function DataRow({ label, value, highlight }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-gray-400 font-medium shrink-0">{label}</span>
      <span className={`text-xs font-semibold text-right ${highlight ? "text-[#1a6b5c]" : "text-gray-700"}`}>
        {value}
      </span>
    </div>
  );
}

function StatusPill({ value }) {
  const map = {
    CONSISTENT:    { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  label: "Consistent"    },
    MINOR_ISSUES:  { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  label: "Minor Issues"  },
    INCONSISTENT:  { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    label: "Inconsistent"  },
    LOW:           { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  label: "Low Risk"      },
    MEDIUM:        { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  label: "Medium Risk"   },
    HIGH:          { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    label: "High Risk"     },
    AUTO_APPROVE:  { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  label: "Auto Approved" },
    HUMAN_REVIEW:  { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  label: "Human Review"  },
    REJECT:        { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    label: "Rejected"      },
  };
  const style = map[value] || { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600", label: value };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${style.bg} ${style.border} ${style.text}`}>
      {style.label}
    </span>
  );
}

function ScoreBar({ score, maxScore = 100 }) {
  const pct   = Math.min((score / maxScore) * 100, 100);
  const color = pct >= 80 ? "#1a6b5c" : pct >= 50 ? "#f4a728" : "#dc2626";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">Verification Score</span>
        <span className="text-lg font-extrabold" style={{ color }}>{score}/{maxScore}</span>
      </div>
      <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-300">
        <span>Reject</span><span>Review</span><span>Approve</span>
      </div>
    </div>
  );
}

// ─── Compact view ─────────────────────────────────────────────────────────────
function CompactView({ result }) {
  const decision = result?.decision || "HUMAN_REVIEW";
  const score    = result?.score    || 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-700">AI Analysis</span>
        <StatusPill value={decision} />
      </div>
      <ScoreBar score={score} />
      {result?.flags?.length > 0 && (
        <div className="text-xs text-amber-600 space-y-1">
          {result.flags.slice(0, 2).map((f, i) => (
            <div key={i} className="flex gap-1.5"><span>⚠️</span><span>{f}</span></div>
          ))}
          {result.flags.length > 2 && (
            <div className="text-gray-400">+{result.flags.length - 2} more issues</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Full view ────────────────────────────────────────────────────────────────
function FullView({ result, showRaw }) {
  const [rawOpen, setRawOpen] = useState(false);

  const decision  = result?.decision || "HUMAN_REVIEW";
  const score     = result?.score    || 0;
  const flags     = result?.flags    || [];
  const idDoc     = result?.analysis?.idDocument;
  const suppDoc   = result?.analysis?.supportingDocument;
  const crossDoc  = result?.analysis?.crossDocument;
  const faceMatch = result?.analysis?.faceMatch;

  return (
    <div className="space-y-4">

      {/* Overall result */}
      <SectionCard title="Overall Decision" icon="🎯">
        <div className="flex items-center justify-between">
          <StatusPill value={decision} />
          <span className="text-xs text-gray-400">
            {decision === "AUTO_APPROVE" ? "Verified automatically"
              : decision === "HUMAN_REVIEW" ? "Awaiting human review"
              : "Verification failed"}
          </span>
        </div>
        <ScoreBar score={score} />
      </SectionCard>

      {/* ID Document */}
      {idDoc && (
        <SectionCard title="ID Document Analysis" icon="🪪"
          borderColor={idDoc.suspicionLevel === "HIGH" ? "border-red-200" : "border-gray-100"}>
          <DataRow label="Extracted Name"       value={idDoc.extractedName}        highlight />
          <DataRow label="Issuing LGU"          value={idDoc.issuingLgu}           highlight />
          <DataRow label="Disability Category"  value={idDoc.disabilityCategory}   highlight />
          <DataRow label="Forgery Signals"      value={idDoc.forgerySignalCount !== undefined ? `${idDoc.forgerySignalCount} detected` : null} />
          <DataRow label="Suspicion Level"      value={idDoc.suspicionLevel} />
          {idDoc.summary && (
            <p className="text-xs text-gray-500 leading-relaxed pt-1 border-t border-gray-50">
              {idDoc.summary}
            </p>
          )}
        </SectionCard>
      )}

      {/* Supporting Document */}
      {suppDoc && (
        <SectionCard title="Supporting Document" icon="📄">
          {suppDoc.summary && (
            <p className="text-xs text-gray-500 leading-relaxed">{suppDoc.summary}</p>
          )}
        </SectionCard>
      )}

      {/* Cross-document check */}
      {crossDoc && (
        <SectionCard title="Cross-Document Check" icon="🔗"
          borderColor={crossDoc.consistency === "INCONSISTENT" ? "border-red-200" : "border-gray-100"}>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Consistency:</span>
            <StatusPill value={crossDoc.consistency} />
          </div>
          {crossDoc.summary && (
            <p className="text-xs text-gray-500 leading-relaxed">{crossDoc.summary}</p>
          )}
        </SectionCard>
      )}

      {/* Face Match */}
      {faceMatch && (
        <SectionCard title="Face Match" icon="🤳">
          <DataRow
            label="Confidence"
            value={faceMatch.confidence !== undefined ? `${faceMatch.confidence}%` : null}
            highlight={faceMatch.confidence >= 80}
          />
          {faceMatch.summary && (
            <p className="text-xs text-gray-500 leading-relaxed">{faceMatch.summary}</p>
          )}
        </SectionCard>
      )}

      {/* Flags */}
      {flags.length > 0 && (
        <SectionCard title="Issues Found" icon="⚠️" borderColor="border-amber-200">
          <div className="space-y-2">
            {flags.map((flag, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-amber-500 shrink-0 mt-0.5">⚠️</span>
                {flag}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Raw JSON toggle — for debugging */}
      {showRaw && (
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <button
            onClick={() => setRawOpen(v => !v)}
            className="w-full px-4 py-3 text-xs font-semibold text-gray-400 text-left flex justify-between items-center hover:bg-gray-50"
          >
            <span>🔧 Raw API Response</span>
            <span>{rawOpen ? "▲ Hide" : "▼ Show"}</span>
          </button>
          {rawOpen && (
            <pre className="bg-gray-900 text-green-400 text-[10px] p-4 overflow-x-auto max-h-64 leading-relaxed">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function GeminiAnalysis({ result, compact = false, showRaw = false }) {
  if (!result) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2">⏳</div>
        <p className="text-sm text-gray-400">Waiting for AI analysis results…</p>
      </div>
    );
  }

  if (compact) return <CompactView result={result} />;
  return <FullView result={result} showRaw={showRaw} />;
}