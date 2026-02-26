"use client";

/**
 * components/verification/PWDVerifiedBadge.jsx
 *
 * The PWD Verified badge shown on worker profiles.
 * Three variants:
 *   - "full"    → large badge with label, date, tooltip — for profile headers
 *   - "compact" → small inline pill — for job listings and search results
 *   - "icon"    → just the shield icon — for tight spaces like table rows
 *
 * Usage:
 *   import PWDVerifiedBadge from "@/components/verification/PWDVerifiedBadge";
 *
 *   <PWDVerifiedBadge variant="full"    verifiedAt="2025-01-15T10:30:00Z" />
 *   <PWDVerifiedBadge variant="compact" verifiedAt="2025-01-15T10:30:00Z" />
 *   <PWDVerifiedBadge variant="icon" />
 *
 * Props:
 *   variant    "full" | "compact" | "icon"  (default: "compact")
 *   verifiedAt  ISO date string — when the badge was issued
 *   showTooltip boolean — show hover tooltip (default: true)
 */

import { useState } from "react";

export default function PWDVerifiedBadge({
  variant = "compact",
  verifiedAt,
  showTooltip = true,
}) {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const formattedDate = verifiedAt
    ? new Date(verifiedAt).toLocaleDateString("en-PH", {
        year: "numeric", month: "long", day: "numeric",
        timeZone: "Asia/Manila",
      })
    : null;

  // ── FULL variant — for profile headers ──
  if (variant === "full") {
    return (
      <div
        className="relative inline-flex items-center gap-3 bg-linear-to-r from-[#1a6b5c] to-[#22876c] text-white rounded-2xl px-5 py-3 shadow-lg shadow-[#1a6b5c]/20"
        onMouseEnter={() => showTooltip && setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        {/* Shield icon */}
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-linear-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z"
              fill="currentColor" opacity="0.3"
            />
            <path
              d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z"
              stroke="currentColor" strokeWidth="1.5" fill="none"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <div className="text-xs font-semibold text-white/70 uppercase tracking-wider leading-none mb-0.5">
            InklusiJobs
          </div>
          <div className="text-base font-extrabold leading-none">PWD Verified</div>
          {formattedDate && (
            <div className="text-xs text-white/60 mt-1">Since {formattedDate}</div>
          )}
        </div>

        {/* Gold star accent */}
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#f4a728] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
          ✓
        </div>

        {/* Tooltip */}
        {tooltipVisible && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl z-50 leading-relaxed">
            <div className="font-bold mb-1">🛡️ Multi-Layer Verified</div>
            This badge confirms identity was verified through AI document analysis,
            liveness detection, PSGC validation, and human review — per NCDA standards.
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        )}
      </div>
    );
  }

  // ── COMPACT variant — for job listings, search results, cards ──
  if (variant === "compact") {
    return (
      <div
        className="relative inline-flex items-center gap-1.5 bg-[#1a6b5c]/10 border border-[#1a6b5c]/25 text-[#1a6b5c] rounded-full px-2.5 py-1 cursor-default"
        onMouseEnter={() => showTooltip && setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        {/* Mini shield */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z"
            fill="#1a6b5c"
          />
          <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-xs font-bold">PWD Verified</span>

        {/* Tooltip */}
        {tooltipVisible && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl z-50 leading-relaxed whitespace-normal">
            Identity verified through AI document analysis + liveness check + human review.
            {formattedDate && <div className="text-gray-400 mt-1">Verified {formattedDate}</div>}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        )}
      </div>
    );
  }

  // ── ICON variant — for table rows, tight spaces ──
  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => showTooltip && setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
    >
      <div className="w-6 h-6 bg-[#1a6b5c] rounded-full flex items-center justify-center cursor-default">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" fill="white" opacity="0.4" />
          <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {tooltipVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-xl p-2.5 shadow-xl z-50 leading-relaxed whitespace-normal">
          PWD Verified by InklusiJobs
          {formattedDate && <div className="text-gray-400 mt-0.5">{formattedDate}</div>}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}