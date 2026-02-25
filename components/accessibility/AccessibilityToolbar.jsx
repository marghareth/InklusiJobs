"use client";

/**
 * AccessibilityToolbar.jsx — Enhanced
 * WCAG 2.2 AA compliant accessibility settings panel
 *
 * NEW in this version:
 * - TTS reads from current viewport position, not from top
 * - TTS highlights the element currently being read
 * - Keyboard shortcuts for all features
 * - Shortcuts cheat sheet inside panel
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

const DEFAULTS = {
  fontSize: 0,
  highContrast: false,
  darkMode: false,
  dyslexiaFont: false,
  reduceMotion: false,
  readingMode: false,
  textToSpeech: false,
  highlightLinks: false,
  largeCursor: false,
};

const STORAGE_KEY = "inklusijobs_a11y_prefs";

function loadPrefs() {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch { return DEFAULTS; }
}

// ── Get readable elements from current viewport position ──────────────────────
function getReadableElementsFromViewport() {
  const selectors = [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "li", "td", "th", "blockquote",
    "figcaption", "label", "button", "a",
    "[role='heading']", "[role='listitem']",
  ];

  const all = Array.from(document.querySelectorAll(selectors.join(",")));

  const readable = all.filter(el => {
    const text = el.innerText?.trim();
    if (!text || text.length < 2) return false;
    if (el.closest("#a11y-toolbar")) return false;
    // Skip hidden elements
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    return true;
  });

  // Find first element at or below current scroll position
  const scrollY = window.scrollY || window.pageYOffset;

  let startIndex = 0;
  for (let i = 0; i < readable.length; i++) {
    const rect = readable[i].getBoundingClientRect();
    const absTop = rect.top + scrollY;
    if (absTop >= scrollY - 60) {
      startIndex = i;
      break;
    }
  }

  return { elements: readable, startIndex };
}

export default function AccessibilityToolbar() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULTS);
  const [announcement, setAnnouncement] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const ttsElementsRef = useRef([]);
  const highlightedElRef = useRef(null);
  const ttsActiveRef = useRef(false); // track if TTS is still active

  // Load prefs on mount
  useEffect(() => { setPrefs(loadPrefs()); }, []);

  // Apply prefs to <html>
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("a11y-text-large", "a11y-text-xl");
    if (prefs.fontSize === 1) html.classList.add("a11y-text-large");
    if (prefs.fontSize === 2) html.classList.add("a11y-text-xl");
    html.classList.toggle("a11y-high-contrast", prefs.highContrast);
    html.classList.toggle("a11y-dark-mode", prefs.darkMode);
    html.classList.toggle("a11y-dyslexia-font", prefs.dyslexiaFont);
    html.classList.toggle("a11y-reduce-motion", prefs.reduceMotion);
    html.classList.toggle("a11y-reading-mode", prefs.readingMode);
    html.classList.toggle("a11y-highlight-links", prefs.highlightLinks);
    html.classList.toggle("a11y-large-cursor", prefs.largeCursor);
  }, [prefs]);

  // ── Highlight element being read ──────────────────────────────────────────
  const clearHighlight = useCallback(() => {
    if (highlightedElRef.current) {
      highlightedElRef.current.style.removeProperty("outline");
      highlightedElRef.current.style.removeProperty("background-color");
      highlightedElRef.current = null;
    }
  }, []);

  const highlightElement = useCallback((el) => {
    clearHighlight();
    if (!el) return;
    el.style.outline = "3px solid #0023FF";
    el.style.backgroundColor = "rgba(0,35,255,0.05)";
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    highlightedElRef.current = el;
  }, [clearHighlight]);

  // ── Stop TTS ──────────────────────────────────────────────────────────────
  const stopTTS = useCallback(() => {
    ttsActiveRef.current = false;
    ttsElementsRef.current = [];
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    clearHighlight();
    setTtsPlaying(false);
  }, [clearHighlight]);

  // ── Speak elements one by one from viewport ───────────────────────────────
  const speakFromViewport = useCallback(() => {
    if (!window.speechSynthesis) {
      announce("Text to speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    ttsActiveRef.current = true;

    const { elements, startIndex } = getReadableElementsFromViewport();
    ttsElementsRef.current = elements;

    setTtsPlaying(true);
    announce("Reading aloud from current position.");

    const speakNext = (index) => {
      // Stop if TTS was cancelled or no more elements
      if (!ttsActiveRef.current) return;
      if (index >= elements.length) {
        clearHighlight();
        setTtsPlaying(false);
        ttsActiveRef.current = false;
        setPrefs(p => ({ ...p, textToSpeech: false }));
        announce("Finished reading page.");
        return;
      }

      const el = elements[index];
      const text = el.innerText?.trim();
      if (!text) { speakNext(index + 1); return; }

      highlightElement(el);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.pitch = 1;
      utterance.lang = "en-PH"; // Filipino English accent
      utterance.onend = () => {
        if (!ttsActiveRef.current) return;
        speakNext(index + 1);
      };
      utterance.onerror = (e) => {
        if (e.error === "interrupted") return; // expected on stop
        speakNext(index + 1);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext(startIndex);
  }, [clearHighlight, highlightElement]);

  const handleTTS = useCallback(() => {
    if (ttsPlaying) {
      stopTTS();
      announce("Text to speech stopped.");
    } else {
      setPrefs(p => ({ ...p, textToSpeech: true }));
      speakFromViewport();
    }
  }, [ttsPlaying, stopTTS, speakFromViewport]);

  // Cleanup TTS on unmount
  useEffect(() => () => stopTTS(), [stopTTS]);

  // ── Screen reader announcements ───────────────────────────────────────────
  const announce = useCallback((msg) => {
    setAnnouncement("");
    setTimeout(() => setAnnouncement(msg), 50);
  }, []);

  const toggle = useCallback((key, label) => {
    setPrefs(prev => {
      const next = !prev[key];
      announce(`${label} ${next ? "enabled" : "disabled"}`);
      return { ...prev, [key]: next };
    });
  }, [announce]);

  const cycleFontSize = useCallback(() => {
    setPrefs(prev => {
      const next = (prev.fontSize + 1) % 3;
      const labels = ["Normal text size", "Large text size", "Extra large text size"];
      announce(labels[next]);
      return { ...prev, fontSize: next };
    });
  }, [announce]);

  const resetPrefs = useCallback(() => {
    setPrefs(DEFAULTS);
    stopTTS();
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    announce("All accessibility preferences reset to defaults.");
  }, [stopTTS, announce]);

  // ── Keyboard shortcuts (Alt + key) ────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (!e.altKey) return;
      const tag = document.activeElement?.tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;

      const actions = {
        a: () => setOpen(v => !v),
        t: handleTTS,
        h: () => toggle("highContrast", "High contrast"),
        d: () => toggle("darkMode", "Dark mode"),
        f: cycleFontSize,
        r: () => toggle("reduceMotion", "Reduce motion"),
        m: () => toggle("readingMode", "Reading mode"),
        l: () => toggle("highlightLinks", "Highlight links"),
        y: () => toggle("dyslexiaFont", "Dyslexia font"),
        c: () => toggle("largeCursor", "Large cursor"),
        "0": resetPrefs,
      };

      if (actions[e.key.toLowerCase()]) {
        e.preventDefault();
        actions[e.key.toLowerCase()]();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleTTS, toggle, cycleFontSize, resetPrefs]);

  // ── Focus trap ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll('button,[href],input,[tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const trap = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus(); } }
        else { if (document.activeElement === last) { e.preventDefault(); first?.focus(); } }
      }
      if (e.key === "Escape") { setOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [open]);

  const savePrefs = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      setSaveStatus("saved");
      announce("Preferences saved to your browser.");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch { announce("Could not save preferences."); }
  };

  // ── UI helpers ────────────────────────────────────────────────────────────
  const btnStyle = (active) => ({
    display: "flex", alignItems: "center", gap: 10, width: "100%",
    padding: "10px 12px", borderRadius: 10, minHeight: 44,
    border: `2px solid ${active ? "#0023FF" : "#E5E7EB"}`,
    background: active ? "#EEF1FF" : "#FFFFFF",
    color: active ? "#0023FF" : "#374151",
    fontSize: 13, fontWeight: 600, fontFamily: "inherit",
    textAlign: "left", cursor: "pointer", transition: "all 0.15s",
  });

  const Kbd = ({ k }) => (
    <kbd style={{ fontSize: 9, fontWeight: 700, background: "#F3F4F6", border: "1px solid #D1D5DB", borderRadius: 4, padding: "2px 5px", color: "#6B7280", fontFamily: "monospace", whiteSpace: "nowrap" }}>{k}</kbd>
  );

  const SectionLabel = ({ children }) => (
    <p style={{ fontSize: 10, fontWeight: 800, color: "#9CA3AF", letterSpacing: "0.1em", margin: "14px 0 6px", textTransform: "uppercase" }}>{children}</p>
  );

  const OptionBtn = ({ label, active, onClick, icon, shortcut }) => (
    <button onClick={onClick} style={btnStyle(active)} aria-pressed={active}
      onFocus={e => { if (!active) e.currentTarget.style.borderColor = "#0023FF"; }}
      onBlur={e => { if (!active) e.currentTarget.style.borderColor = "#E5E7EB"; }}>
      <span aria-hidden="true" style={{ fontSize: 15, width: 20, textAlign: "center", flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}{active ? " ✓" : ""}</span>
      {shortcut && <Kbd k={shortcut} />}
    </button>
  );

  const fontLabels = ["Normal Text", "Large Text", "Extra Large"];
  const fontIcons = ["A", "A+", "A++"];

  const SHORTCUTS = [
    { keys: "Alt+A", desc: "Open/close panel" },
    { keys: "Alt+T", desc: "Read from here" },
    { keys: "Alt+H", desc: "High contrast" },
    { keys: "Alt+D", desc: "Dark mode" },
    { keys: "Alt+F", desc: "Cycle font size" },
    { keys: "Alt+R", desc: "Reduce motion" },
    { keys: "Alt+M", desc: "Reading mode" },
    { keys: "Alt+L", desc: "Highlight links" },
    { keys: "Alt+Y", desc: "Dyslexia font" },
    { keys: "Alt+C", desc: "Large cursor" },
    { keys: "Alt+0", desc: "Reset all" },
    { keys: "Esc", desc: "Close panel" },
  ];

  return (
    <>
      {/* Screen reader live region */}
      <div role="status" aria-live="polite" aria-atomic="true"
        style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
        {announcement}
      </div>

      {/* Global a11y CSS */}
      <style>{`
        .a11y-text-large { font-size: 112% !important; }
        .a11y-text-xl    { font-size: 125% !important; }
        .a11y-high-contrast,.a11y-high-contrast * { background-color:#000!important;color:#fff!important;border-color:#fff!important; }
        .a11y-high-contrast a { color:#FFFF00!important;text-decoration:underline!important; }
        .a11y-high-contrast button { outline:2px solid #fff!important; }
        .a11y-dark-mode { background-color:#0F172A!important;color:#F1F5F9!important; }
        .a11y-dark-mode main,.a11y-dark-mode section { background-color:#1E293B!important;color:#F1F5F9!important; }
        .a11y-dark-mode header,.a11y-dark-mode nav,.a11y-dark-mode footer { background-color:#0F172A!important;color:#F1F5F9!important; }
        .a11y-dyslexia-font,.a11y-dyslexia-font * { font-family:'Lexend',sans-serif!important;letter-spacing:0.05em!important;word-spacing:0.1em!important;line-height:1.8!important; }
        .a11y-reduce-motion *,.a11y-reduce-motion *::before,.a11y-reduce-motion *::after { animation-duration:0.001ms!important;transition-duration:0.001ms!important;scroll-behavior:auto!important; }
        .a11y-reading-mode header,.a11y-reading-mode footer,.a11y-reading-mode nav,.a11y-reading-mode aside { display:none!important; }
        .a11y-reading-mode #main-content { max-width:680px!important;margin:40px auto!important;font-size:1.1em!important;line-height:1.9!important;padding:0 24px!important; }
        .a11y-highlight-links a { background:#FEFCE8!important;color:#1A2744!important;text-decoration:underline!important;font-weight:700!important;outline:1px dashed #D97706!important;padding:1px 3px!important;border-radius:3px!important; }
        .a11y-large-cursor,.a11y-large-cursor * { cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Cpath d='M8 4l16 12-7 1 4 8-3 2-4-8-6 5z' fill='%23000' stroke='%23fff' stroke-width='1.5'/%3E%3C/svg%3E") 0 0,auto!important; }
        *:focus-visible { outline:3px solid #0023FF!important;outline-offset:3px!important;border-radius:4px!important; }
        @media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation-duration:0.001ms!important;transition-duration:0.001ms!important; } }
        @keyframes a11y-pulse { 0%,100%{opacity:1}50%{opacity:0.3} }
      `}</style>

      <div id="a11y-toolbar" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>

        {/* Panel */}
        {open && (
          <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Accessibility settings panel"
            style={{ background: "#fff", border: "2px solid #E5E7EB", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", padding: 20, width: 310, maxHeight: "82vh", overflowY: "auto" }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <h2 style={{ fontSize: 13, fontWeight: 900, color: "#1A2744", letterSpacing: "0.06em", margin: 0 }}>♿ ACCESSIBILITY</h2>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setShowShortcuts(v => !v)} aria-pressed={showShortcuts}
                  style={{ background: showShortcuts ? "#EEF1FF" : "none", border: "2px solid #E5E7EB", borderRadius: 8, padding: "4px 8px", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#6B7280", fontFamily: "inherit" }}
                  aria-label="Toggle keyboard shortcuts list">
                  ⌨ Shortcuts
                </button>
                <button onClick={() => { setOpen(false); triggerRef.current?.focus(); }} aria-label="Close accessibility settings"
                  style={{ background: "none", border: "2px solid #E5E7EB", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>
            </div>

            {/* Shortcuts list */}
            {showShortcuts && (
              <div style={{ background: "#F8F9FD", borderRadius: 12, padding: 14, marginTop: 10, marginBottom: 4 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: "#1A2744", margin: "0 0 10px" }}>KEYBOARD SHORTCUTS</p>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "7px 10px", alignItems: "center" }}>
                  {SHORTCUTS.map(s => (
                    <React.Fragment key={s.keys}>
                      <Kbd k={s.keys} />
                      <span style={{ fontSize: 11, color: "#6B7280" }}>{s.desc}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* TTS playing indicator */}
            {ttsPlaying && (
              <div style={{ background: "#EEF1FF", borderRadius: 10, padding: "8px 12px", marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0023FF", display: "inline-block", animation: "a11y-pulse 1.2s infinite" }} aria-hidden="true" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0023FF", flex: 1 }}>Reading aloud…</span>
                <button onClick={stopTTS} style={{ fontSize: 11, fontWeight: 700, background: "#0023FF", color: "#fff", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit", minHeight: 28 }}>
                  Stop
                </button>
              </div>
            )}

            {/* TEXT */}
            <SectionLabel>Text</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <OptionBtn label={fontLabels[prefs.fontSize]} active={prefs.fontSize > 0} onClick={cycleFontSize} icon={fontIcons[prefs.fontSize]} shortcut="Alt+F" />
              <OptionBtn label="Dyslexia Font" active={prefs.dyslexiaFont} onClick={() => toggle("dyslexiaFont", "Dyslexia font")} icon="Aa" shortcut="Alt+Y" />
            </div>

            {/* DISPLAY */}
            <SectionLabel>Display</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <OptionBtn label="High Contrast" active={prefs.highContrast} onClick={() => toggle("highContrast", "High contrast")} icon="🌓" shortcut="Alt+H" />
              <OptionBtn label="Dark Mode" active={prefs.darkMode} onClick={() => toggle("darkMode", "Dark mode")} icon="🌙" shortcut="Alt+D" />
              <OptionBtn label="Highlight Links" active={prefs.highlightLinks} onClick={() => toggle("highlightLinks", "Highlight links")} icon="🔗" shortcut="Alt+L" />
              <OptionBtn label="Large Cursor" active={prefs.largeCursor} onClick={() => toggle("largeCursor", "Large cursor")} icon="🖱️" shortcut="Alt+C" />
            </div>

            {/* MOTION */}
            <SectionLabel>Motion</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <OptionBtn label="Reduce Motion" active={prefs.reduceMotion} onClick={() => toggle("reduceMotion", "Reduce motion")} icon="⏸" shortcut="Alt+R" />
            </div>

            {/* READING */}
            <SectionLabel>Reading</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <OptionBtn label="Reading Mode" active={prefs.readingMode} onClick={() => toggle("readingMode", "Reading mode")} icon="📖" shortcut="Alt+M" />
              <OptionBtn
                label={ttsPlaying ? "Stop Reading" : "Read From Here"}
                active={ttsPlaying}
                onClick={handleTTS}
                icon="🔊"
                shortcut="Alt+T"
              />
            </div>

            {/* Save / Reset */}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button onClick={savePrefs}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: saveStatus === "saved" ? "#16A34A" : "#1A2744", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", minHeight: 44, transition: "background 0.2s" }}
                aria-label="Save accessibility preferences to browser">
                {saveStatus === "saved" ? "✓ Saved!" : "Save Prefs"}
              </button>
              <button onClick={resetPrefs}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: "2px solid #E5E7EB", background: "#fff", color: "#6B7280", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", minHeight: 44 }}
                aria-label="Reset all preferences to defaults">
                Reset All
              </button>
            </div>

            <p style={{ fontSize: 10, color: "#9CA3AF", marginTop: 10, textAlign: "center", lineHeight: 1.5 }}>
              Press <Kbd k="Alt+A" /> anytime to open this panel
            </p>
          </div>
        )}

        {/* FAB */}
        <button ref={triggerRef} onClick={() => setOpen(v => !v)}
          style={{ width: 56, height: 56, borderRadius: "50%", background: "#01322C", color: "#fff", border: "3px solid #fff", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.15s" }}
          aria-label={open ? "Close accessibility settings (Alt+A)" : "Open accessibility settings (Alt+A)"}
          aria-expanded={open}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
          ♿
        </button>
      </div>
    </>
  );
}