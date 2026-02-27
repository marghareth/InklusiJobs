"use client";

/**
 * components/verification/RiskScoreCard.jsx
 *
 * Displays a verification risk score as a visual card with
 * a radial gauge, label, and breakdown of contributing factors.
 *
 * Usage:
 *   import RiskScoreCard from "@/components/verification/RiskScoreCard";
 *
 *   <RiskScoreCard score={87} decision="AUTO_APPROVE" flags={[]} breakdown={breakdown} />
 *
 * Props:
 *   score       number 0–100
 *   decision    "AUTO_APPROVE" | "HUMAN_REVIEW" | "REJECT"
 *   flags       string[] — list of warning/failure flags
 *   breakdown   object  — optional per-factor scores (see below)
 *   compact     boolean — small inline version (default: false)
 *
 * breakdown shape (all optional):
 *   {
 *     documentAuthenticity: number,   // 0–100
 *     crossDocConsistency:  number,
 *     faceMatchConfidence:  number,
 *     registryMatch:        number,
 *   }
 */

import { useEffect, useState } from "react";

// ─── Radial gauge ─────────────────────────────────────────────────────────────
function RadialGauge({ score, color, size = 120 }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 200);
    return () => clearTimeout(t);
  }, [score]);

  const radius      = (size - 16) / 2;
  const circumf     = 2 * Math.PI * radius;
  const dashOffset  = circumf - (animated / 100) * circumf;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#F0F0F0" strokeWidth={10}
        />
        {/* Animated score arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={circumf}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      {/* Center text */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: size * 0.22, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: size * 0.09, color: "#9CA3AF", fontWeight: 600, marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}

// ─── Factor bar ───────────────────────────────────────────────────────────────
function FactorBar({ label, score, delay = 0 }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  const color = score >= 80 ? "#1a6b5c" : score >= 50 ? "#f4a728" : "#dc2626";

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{score}</span>
      </div>
      <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            backgroundColor: color,
            transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Decision config ──────────────────────────────────────────────────────────
function getDecisionConfig(decision) {
  return {
    AUTO_APPROVE: {
      label:   "Verified",
      color:   "#1a6b5c",
      bg:      "#F0FDF4",
      border:  "#BBF7D0",
      icon:    "✅",
      tagline: "Identity verified — PWD badge active",
    },
    HUMAN_REVIEW: {
      label:   "Under Review",
      color:   "#f4a728",
      bg:      "#FFFBEB",
      border:  "#FDE68A",
      icon:    "⏳",
      tagline: "Awaiting human review (24–48 hrs)",
    },
    REJECT: {
      label:   "Not Verified",
      color:   "#dc2626",
      bg:      "#FEF2F2",
      border:  "#FECACA",
      icon:    "❌",
      tagline: "Could not verify — please resubmit",
    },
  }[decision] || {
    label:   "Pending",
    color:   "#9CA3AF",
    bg:      "#F9FAFB",
    border:  "#E5E7EB",
    icon:    "⏳",
    tagline: "Waiting for result…",
  };
}

// ─── Compact variant ──────────────────────────────────────────────────────────
function CompactCard({ score, decision }) {
  const config = getDecisionConfig(decision);
  return (
    <div
      className="inline-flex items-center gap-3 rounded-xl px-4 py-2.5 border"
      style={{ background: config.bg, borderColor: config.border }}
    >
      <span className="text-lg">{config.icon}</span>
      <div>
        <div className="text-xs font-bold" style={{ color: config.color }}>{config.label}</div>
        <div className="text-xs text-gray-400">Score: {score}/100</div>
      </div>
    </div>
  );
}

// ─── Full card ────────────────────────────────────────────────────────────────
function FullCard({ score, decision, flags, breakdown }) {
  const config = getDecisionConfig(decision);

  const factors = breakdown
    ? [
        breakdown.documentAuthenticity !== undefined && { label: "Document Authenticity", score: breakdown.documentAuthenticity },
        breakdown.crossDocConsistency  !== undefined && { label: "Cross-Doc Consistency",  score: breakdown.crossDocConsistency  },
        breakdown.faceMatchConfidence  !== undefined && { label: "Face Match",             score: breakdown.faceMatchConfidence  },
        breakdown.registryMatch        !== undefined && { label: "Registry Match",         score: breakdown.registryMatch        },
      ].filter(Boolean)
    : [];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">

      {/* Top band */}
      <div className="p-5 border-b border-gray-50" style={{ background: config.bg }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{config.icon}</span>
              <span className="text-base font-extrabold" style={{ color: config.color }}>
                {config.label}
              </span>
            </div>
            <p className="text-xs text-gray-500">{config.tagline}</p>
          </div>
          <RadialGauge score={score} color={config.color} size={88} />
        </div>
      </div>

      {/* Score thresholds legend */}
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex justify-between text-[10px] text-gray-400 font-medium">
        <span>0–49: Reject</span>
        <span>50–79: Review</span>
        <span>80–100: Approve</span>
      </div>

      {/* Factor breakdown */}
      {factors.length > 0 && (
        <div className="p-5 space-y-3">
          <div className="text-xs font-bold text-gray-600 mb-1">Score Breakdown</div>
          {factors.map((f, i) => (
            <FactorBar key={f.label} label={f.label} score={f.score} delay={i * 120} />
          ))}
        </div>
      )}

      {/* Flags */}
      {flags?.length > 0 && (
        <div className="px-5 pb-5 space-y-2 border-t border-gray-50 pt-4">
          <div className="text-xs font-bold text-gray-600">Issues</div>
          {flags.map((flag, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
              <span className="text-amber-400 shrink-0">⚠</span>
              {flag}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function RiskScoreCard({
  score    = 0,
  decision = "HUMAN_REVIEW",
  flags    = [],
  breakdown,
  compact  = false,
}) {
  if (compact) return <CompactCard score={score} decision={decision} />;
  return <FullCard score={score} decision={decision} flags={flags} breakdown={breakdown} />;
}