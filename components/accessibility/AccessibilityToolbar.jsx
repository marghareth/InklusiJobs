"use client";

import { useState, useEffect } from "react";

export default function AccessibilityToolbar() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(0); // 0=normal, 1=large, 2=xl
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Apply font size to root html element
  useEffect(() => {
    const sizes = ["text-base-root", "text-large-root", "text-xl-root"];
    document.documentElement.classList.remove(...sizes);
    if (fontSize === 1) document.documentElement.classList.add("text-large-root");
    if (fontSize === 2) document.documentElement.classList.add("text-xl-root");
  }, [fontSize]);

  // Apply high contrast
  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  // Apply reduce motion
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);
  }, [reduceMotion]);

  const cycleFontSize = () => setFontSize((prev) => (prev + 1) % 3);

  const fontLabels = ["Normal Text", "Large Text ✓", "Extra Large ✓"];

  return (
    <>
      {/* Floating trigger button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Panel */}
        {open && (
          <div
            className="bg-white border-2 border-slate-200 rounded-2xl shadow-2xl p-5 w-64"
            role="dialog"
            aria-label="Accessibility settings"
            aria-modal="false"
          >
            <h2 className="text-[#1E293B] text-sm font-bold font-['Lexend'] uppercase tracking-widest mb-4">
              ♿ Accessibility
            </h2>

            <div className="flex flex-col gap-2">
              {/* Font size */}
              <button
                onClick={cycleFontSize}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-semibold font-['Lexend'] text-left w-full transition-all min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0023FF] ${
                  fontSize > 0
                    ? "border-[#0023FF] bg-blue-50 text-[#0023FF]"
                    : "border-slate-200 text-slate-700 hover:border-[#0023FF] hover:text-[#0023FF]"
                }`}
                aria-pressed={fontSize > 0}
              >
                <span aria-hidden="true">🔤</span>
                {fontLabels[fontSize]}
              </button>

              {/* High contrast */}
              <button
                onClick={() => setHighContrast((v) => !v)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-semibold font-['Lexend'] text-left w-full transition-all min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0023FF] ${
                  highContrast
                    ? "border-[#0023FF] bg-blue-50 text-[#0023FF]"
                    : "border-slate-200 text-slate-700 hover:border-[#0023FF] hover:text-[#0023FF]"
                }`}
                aria-pressed={highContrast}
              >
                <span aria-hidden="true">🌓</span>
                {highContrast ? "High Contrast ✓" : "High Contrast"}
              </button>

              {/* Reduce motion */}
              <button
                onClick={() => setReduceMotion((v) => !v)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-semibold font-['Lexend'] text-left w-full transition-all min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0023FF] ${
                  reduceMotion
                    ? "border-[#0023FF] bg-blue-50 text-[#0023FF]"
                    : "border-slate-200 text-slate-700 hover:border-[#0023FF] hover:text-[#0023FF]"
                }`}
                aria-pressed={reduceMotion}
              >
                <span aria-hidden="true">⏸</span>
                {reduceMotion ? "Motion Reduced ✓" : "Reduce Motion"}
              </button>
            </div>
          </div>
        )}

        {/* FAB button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-14 h-14 bg-[#01322C] text-white rounded-full shadow-xl flex items-center justify-center text-2xl hover:bg-[#01322C]/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01322C] focus-visible:ring-offset-2"
          aria-label={open ? "Close accessibility settings" : "Open accessibility settings"}
          aria-expanded={open}
        >
          ♿
        </button>
      </div>
    </>
  );
}