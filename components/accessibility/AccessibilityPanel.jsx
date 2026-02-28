"use client";

import { useState, useEffect, useRef, useCallback, useReducer } from "react";

const STORAGE_KEY = "ij_a11y_v1";
const DYSLEXIA_FONT_URL = "https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap";

const DEFAULT_SETTINGS = {
  dyslexiaFont:   false,
  fontSize:       100,
  highContrast:   false,
  highlightLinks: false,
  largeCursor:    false,
  reduceMotion:   false,
  readingMode:    false,
  colorFilter:    "none",
};

function settingsReducer(state, action) {
  switch (action.type) {
    case "TOGGLE": return { ...state, [action.key]: !state[action.key] };
    case "SET":    return { ...state, [action.key]: action.value };
    case "RESET":  return { ...DEFAULT_SETTINGS };
    case "LOAD":   return { ...DEFAULT_SETTINGS, ...action.payload };
    default:       return state;
  }
}

function usePersistedSettings() {
  const [settings, dispatch] = useReducer(settingsReducer, DEFAULT_SETTINGS);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "LOAD", payload: JSON.parse(saved) });
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch {}
  }, [settings]);
  return [settings, dispatch];
}

function useApplySettings(settings) {
  useEffect(() => {
    const root = document.documentElement;
    if (settings.dyslexiaFont) {
      if (!document.getElementById("a11y-dyslexia-font")) {
        const link = document.createElement("link");
        link.id = "a11y-dyslexia-font"; link.rel = "stylesheet"; link.href = DYSLEXIA_FONT_URL;
        document.head.appendChild(link);
      }
      root.classList.add("a11y-dyslexia");
    } else {
      root.classList.remove("a11y-dyslexia");
    }
    root.style.fontSize = `${settings.fontSize}%`;
    root.classList.toggle("a11y-high-contrast",   settings.highContrast);
    root.classList.toggle("a11y-highlight-links", settings.highlightLinks);
    root.classList.toggle("a11y-large-cursor",    settings.largeCursor);
    root.classList.toggle("a11y-reduce-motion",   settings.reduceMotion);
    root.classList.toggle("a11y-reading-mode",    settings.readingMode);
    document.documentElement.classList.remove("a11y-cf-protanopia", "a11y-cf-deuteranopia", "a11y-cf-tritanopia");
    if (settings.colorFilter !== "none") {
      document.documentElement.classList.add(`a11y-cf-${settings.colorFilter}`);
    } else {
      const wrap = document.getElementById("a11y-cf-wrap");
      if (wrap) wrap.style.filter = "";
    }
  }, [settings]);
}

function useGlobalStyles() {
  useEffect(() => {
    if (document.getElementById("a11y-global-styles")) return;
    const style = document.createElement("style");
    style.id = "a11y-global-styles";
    style.textContent = `
      .a11y-dyslexia *, .a11y-dyslexia *::before, .a11y-dyslexia *::after {
        font-family: 'Lexend', sans-serif !important;
      }
      .a11y-high-contrast body { background: #000 !important; color: #fff !important; overflow: auto !important; }
      .a11y-high-contrast *:not([class*="a11y-panel"]):not(nav):not(nav *) {
        background-color: #000 !important; color: #fff !important; border-color: #fff !important;
      }
      .a11y-high-contrast a { color: #ffff00 !important; }
      .a11y-high-contrast button, .a11y-high-contrast input, .a11y-high-contrast select {
        background: #111 !important; color: #fff !important; border: 2px solid #fff !important;
      }
      .a11y-highlight-links a {
        text-decoration: underline !important; text-underline-offset: 4px !important;
        text-decoration-thickness: 2px !important; text-decoration-color: #0F5C6E !important;
      }
      .a11y-large-cursor, .a11y-large-cursor * {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M8 4 L8 32 L14 26 L19 36 L22 35 L17 25 L26 25 Z' fill='black' stroke='white' stroke-width='2'/%3E%3C/svg%3E") 8 4, auto !important;
      }
      .a11y-reduce-motion *, .a11y-reduce-motion *::before, .a11y-reduce-motion *::after {
        animation-duration: 0.001ms !important; transition-duration: 0.001ms !important;
      }
      .a11y-tts-highlight { background: #fef08a !important; color: #1a1a1a !important; border-radius: 3px; }
      @keyframes a11ySlideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      .a11y-cf-protanopia   #a11y-cf-wrap { filter: url(#a11y-p) !important; }
      .a11y-cf-deuteranopia #a11y-cf-wrap { filter: url(#a11y-d) !important; }
      .a11y-cf-tritanopia   #a11y-cf-wrap { filter: url(#a11y-t) !important; }
      #a11y-cf-wrap { min-height: 100%; }
    `;
    document.head.appendChild(style);
    if (!document.getElementById("a11y-svg-filters")) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.id = "a11y-svg-filters";
      svg.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none");
      svg.setAttribute("aria-hidden", "true");
      svg.innerHTML = `<defs>
        <filter id="a11y-p"><feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"/></filter>
        <filter id="a11y-d"><feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"/></filter>
        <filter id="a11y-t"><feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0"/></filter>
      </defs>`;
      document.body.appendChild(svg);
    }
    if (!document.getElementById("a11y-cf-wrap")) {
      const main = document.getElementById("main-content");
      if (main) { main.id = "a11y-cf-wrap"; }
    }
    return () => { document.getElementById("a11y-global-styles")?.remove(); };
  }, []);
}

function useDrag() {
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const dragging = useRef(false);
  const startOffset = useRef({ x: 0, y: 0 });
  const btnRef = useRef(null);

  useEffect(() => {
    setPos({ x: window.innerWidth - 72, y: window.innerHeight - 72 });
  }, []);

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    const rect = btnRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    startOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const onFirstMove = () => {
      dragging.current = true;
      window.removeEventListener("mousemove", onFirstMove);
    };
    const onCancel = () => {
      window.removeEventListener("mousemove", onFirstMove);
      window.removeEventListener("mouseup", onCancel);
    };
    window.addEventListener("mousemove", onFirstMove);
    window.addEventListener("mouseup", onCancel);
  }, []);

  const onTouchStart = useCallback((e) => {
    dragging.current = true;
    const t = e.touches[0];
    const rect = btnRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    startOffset.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
  }, []);

  useEffect(() => {
    const move = (clientX, clientY) => {
      if (!dragging.current) return;
      const x = Math.max(0, Math.min(window.innerWidth - 56, clientX - startOffset.current.x));
      const y = Math.max(0, Math.min(window.innerHeight - 56, clientY - startOffset.current.y));
      setPos({ x, y });
    };
    const onMouseMove = (e) => move(e.clientX, e.clientY);
    const onTouchMove = (e) => { const t = e.touches[0]; move(t.clientX, t.clientY); };
    const stop = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", stop);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stop);
    };
  }, []);

  return { pos, btnRef, onMouseDown, onTouchStart };
}

function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef(null);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    document.querySelectorAll(".a11y-tts-highlight").forEach(el => el.classList.remove("a11y-tts-highlight"));
  }, []);

  const startReading = useCallback(() => {
    if (!window.speechSynthesis) { alert("Text-to-speech is not supported in this browser."); return; }
    stop();
    const elements = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,td,th,blockquote")).filter(el => {
      const text = el.innerText?.trim();
      return text && !el.closest("#a11y-panel") && !el.closest("[data-a11y-panel]");
    });
    if (!elements.length) return;
    let index = 0;
    setSpeaking(true);
    const speakNext = () => {
      if (index >= elements.length) { setSpeaking(false); return; }
      document.querySelectorAll(".a11y-tts-highlight").forEach(el => el.classList.remove("a11y-tts-highlight"));
      const el = elements[index];
      el.classList.add("a11y-tts-highlight");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const utt = new SpeechSynthesisUtterance(el.innerText || el.textContent);
      utt.rate = 0.95;
      utt.onend = () => { el.classList.remove("a11y-tts-highlight"); index++; speakNext(); };
      utt.onerror = () => { el.classList.remove("a11y-tts-highlight"); setSpeaking(false); };
      utterRef.current = utt;
      window.speechSynthesis.speak(utt);
    };
    speakNext();
  }, [stop]);

  return { speaking, startReading, stop };
}

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, id, label }) {
  return (
    <button
      id={id} role="switch" aria-checked={checked} aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        width: 52, height: 28, borderRadius: 14, border: "none", padding: 0,
        background: checked ? "#0F5C6E" : "#CBD5E1",
        cursor: "pointer", position: "relative", flexShrink: 0,
        transition: "background 0.2s",
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: checked ? 27 : 3,
        width: 22, height: 22, borderRadius: "50%",
        background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        transition: "left 0.2s cubic-bezier(0.4,0,0.2,1)",
        display: "block",
      }} />
    </button>
  );
}

// ── Feature Row ───────────────────────────────────────────────────────────────
function FeatureRow({ icon, label, desc, shortcut, checked, onChange, id }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12, padding: "14px 0",
      borderBottom: "1px solid #F1F5F9",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
        <span style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: "#F8FAFC", border: "1px solid #E2E8F0",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>{icon}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", fontFamily: "'DM Sans', system-ui, sans-serif" }}>{label}</span>
            {shortcut && (
              <span style={{
                fontSize: 10, fontWeight: 700, fontFamily: "monospace",
                background: "#F1F5F9", color: "#64748B",
                border: "1px solid #E2E8F0", borderRadius: 4,
                padding: "2px 6px", letterSpacing: "0.3px",
              }}>{shortcut}</span>
            )}
          </div>
          {desc && <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2, fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.4 }}>{desc}</div>}
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} id={id} label={label} />
    </div>
  );
}

// ── Section Label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: "#94A3B8",
      letterSpacing: "0.12em", textTransform: "uppercase",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      marginTop: 18, marginBottom: 2,
    }}>{children}</div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AccessibilityPanel() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [settings, dispatch] = usePersistedSettings();
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  const { pos, btnRef, onMouseDown, onTouchStart } = useDrag();
  const tts = useTTS();

  useApplySettings(settings);
  useGlobalStyles();

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") { setOpen(false); tts.stop(); return; }
      if (!e.altKey) return;
      switch (e.key.toLowerCase()) {
        case "a": e.preventDefault(); setOpen(o => !o); break;
        case "d": e.preventDefault(); dispatch({ type: "TOGGLE", key: "dyslexiaFont" }); break;
        case "+":
        case "=": e.preventDefault(); dispatch({ type: "SET", key: "fontSize", value: Math.min(150, settings.fontSize + 10) }); break;
        case "-": e.preventDefault(); dispatch({ type: "SET", key: "fontSize", value: Math.max(80, settings.fontSize - 10) }); break;
        case "c": e.preventDefault(); dispatch({ type: "TOGGLE", key: "highContrast" }); break;
        case "l": e.preventDefault(); dispatch({ type: "TOGGLE", key: "highlightLinks" }); break;
        case "u": e.preventDefault(); dispatch({ type: "TOGGLE", key: "largeCursor" }); break;
        case "r": e.preventDefault(); dispatch({ type: "TOGGLE", key: "readingMode" }); break;
        case "s": e.preventDefault(); tts.speaking ? tts.stop() : tts.startReading(); break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [settings.fontSize, tts, dispatch]);

  useEffect(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    if (!open) return;
    const handler = (e) => {
      if (!panelRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  if (!mounted) return null;

  const activeCount = Object.entries(settings).filter(([k, v]) =>
    k !== "fontSize" && k !== "colorFilter" ? v === true : k === "fontSize" ? v !== 100 : v !== "none"
  ).length;

  const panelRight = `${window.innerWidth - pos.x - 56}px`;
  const panelBottom = `${window.innerHeight - pos.y + 12}px`;

  return (
    <>
      {/* Floating trigger button */}
      <div
        ref={(el) => { btnRef.current = el; triggerRef.current = el; }}
        suppressHydrationWarning
        style={{ position: "fixed", zIndex: 10000, left: `${pos.x}px`, top: `${pos.y}px`, cursor: "grab", userSelect: "none", WebkitUserSelect: "none", touchAction: "none" }}
        onMouseDown={onMouseDown} onTouchStart={onTouchStart}
      >
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Close accessibility panel" : "Open accessibility panel (Alt+A)"}
          aria-expanded={open}
          style={{
            width: 52, height: 52, borderRadius: "50%", border: "none",
            background: open ? "#0A3D4A" : "#0F5C6E",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 4px 20px rgba(15,92,110,0.45)",
            transition: "transform 0.2s, background 0.2s",
            position: "relative", outline: "none",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="4" r="2"/>
            <path d="M12 6v4M8 10H5l2 8h2l1-4h4l1 4h2l2-8h-3"/>
          </svg>
          {activeCount > 0 && (
            <span style={{
              position: "absolute", top: -4, right: -4, width: 18, height: 18,
              borderRadius: "50%", background: "#F59E0B", color: "#1a1a1a",
              fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center",
              justifyContent: "center", border: "2px solid #fff",
            }}>{activeCount}</span>
          )}
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div
          id="a11y-panel"
          data-a11y-panel
          ref={panelRef}
          role="dialog"
          aria-label="Accessibility Settings"
          style={{
            position: "fixed", zIndex: 9999,
            right: pos.x > window.innerWidth / 2 ? panelRight : "auto",
            left: pos.x > window.innerWidth / 2 ? "auto" : `${pos.x}px`,
            bottom: pos.y > window.innerHeight / 2 ? panelBottom : "auto",
            top: pos.y > window.innerHeight / 2 ? "auto" : `${pos.y + 64}px`,
            width: 380,
            maxHeight: "85vh",
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 24px 64px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08)",
            border: "1px solid #E2E8F0",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            animation: "a11ySlideIn 0.2s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "18px 20px 16px",
            borderBottom: "1px solid #F1F5F9",
            background: "linear-gradient(135deg, #0F5C6E08, #0F5C6E04)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: "#0F5C6E", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="4" r="2"/><path d="M12 6v4M8 10H5l2 8h2l1-4h4l1 4h2l2-8h-3"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Accessibility</div>
                <div style={{ fontSize: 13, color: "#94A3B8" }}>
                  {activeCount > 0 ? `${activeCount} feature${activeCount > 1 ? "s" : ""} active` : "All features off"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {activeCount > 0 && (
                <button
                  onClick={() => dispatch({ type: "RESET" })}
                  style={{
                    padding: "6px 12px", borderRadius: 8, border: "1px solid #E2E8F0",
                    background: "#fff", color: "#64748B", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}
                >Reset</button>
              )}
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: 32, height: 32, borderRadius: "50%", border: "none",
                  background: "#F1F5F9", color: "#64748B", cursor: "pointer",
                  fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                }}
                aria-label="Close"
              >✕</button>
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 18px", scrollbarWidth: "thin", scrollbarColor: "#E2E8F0 transparent" }}>

            {/* ── FONT SIZE ── */}
            <SectionLabel>Text Size</SectionLabel>
            <div style={{ padding: "12px 0 14px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => dispatch({ type: "SET", key: "fontSize", value: Math.max(80, settings.fontSize - 10) })}
                  aria-label="Decrease font size"
                  style={{ width: 42, height: 42, borderRadius: 10, border: "1.5px solid #E2E8F0", background: "#F8FAFC", color: "#475569", fontSize: 15, fontWeight: 700, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                >A−</button>
                <div style={{ flex: 1, position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: "#64748B", fontFamily: "'DM Sans', system-ui" }}>Font Size</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0F5C6E", fontFamily: "monospace" }}>{settings.fontSize}%</span>
                  </div>
                  <input
                    type="range" min={80} max={150} step={5} value={settings.fontSize}
                    onChange={e => dispatch({ type: "SET", key: "fontSize", value: Number(e.target.value) })}
                    aria-label="Font size"
                    style={{ width: "100%", accentColor: "#0F5C6E", cursor: "pointer", height: 4 }}
                  />
                </div>
                <button
                  onClick={() => dispatch({ type: "SET", key: "fontSize", value: Math.min(150, settings.fontSize + 10) })}
                  aria-label="Increase font size"
                  style={{ width: 42, height: 42, borderRadius: 10, border: "1.5px solid #E2E8F0", background: "#F8FAFC", color: "#475569", fontSize: 15, fontWeight: 700, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                >A+</button>
              </div>
              {settings.fontSize !== 100 && (
                <button onClick={() => dispatch({ type: "SET", key: "fontSize", value: 100 })}
                  style={{ marginTop: 8, background: "none", border: "none", color: "#94A3B8", fontSize: 12, cursor: "pointer", padding: 0, textDecoration: "underline", fontFamily: "'DM Sans', system-ui" }}>
                  Reset to 100%
                </button>
              )}
            </div>

            {/* ── TEXT ── */}
            <SectionLabel>Text & Display</SectionLabel>
            <FeatureRow icon="📖" label="Dyslexia-friendly font" desc="Switches to Lexend for readability" shortcut="Alt+D"
              checked={settings.dyslexiaFont} onChange={() => dispatch({ type: "TOGGLE", key: "dyslexiaFont" })} id="toggle-dyslexia" />
            <FeatureRow icon="◑" label="High contrast" desc="Dark background, white text" shortcut="Alt+C"
              checked={settings.highContrast} onChange={() => dispatch({ type: "TOGGLE", key: "highContrast" })} id="toggle-contrast" />
            <FeatureRow icon="🔗" label="Highlight links" desc="Underlines all links" shortcut="Alt+L"
              checked={settings.highlightLinks} onChange={() => dispatch({ type: "TOGGLE", key: "highlightLinks" })} id="toggle-links" />
            <FeatureRow icon="🖱️" label="Large cursor" desc="Bigger mouse pointer" shortcut="Alt+U"
              checked={settings.largeCursor} onChange={() => dispatch({ type: "TOGGLE", key: "largeCursor" })} id="toggle-cursor" />

            {/* ── MOTION & FOCUS ── */}
            <SectionLabel>Motion & Focus</SectionLabel>
            <FeatureRow icon="⏸️" label="Reduce motion" desc="Disables animations"
              checked={settings.reduceMotion} onChange={() => dispatch({ type: "TOGGLE", key: "reduceMotion" })} id="toggle-motion" />
            <FeatureRow icon="🔍" label="Reading mode" desc="Dims page for focused reading" shortcut="Alt+R"
              checked={settings.readingMode} onChange={() => dispatch({ type: "TOGGLE", key: "readingMode" })} id="toggle-reading" />

            {/* ── READ ALOUD ── */}
            <SectionLabel>Read Aloud</SectionLabel>
            <div style={{ padding: "14px 0 14px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 40, height: 40, borderRadius: 12, background: tts.speaking ? "#FEF3C7" : "#F8FAFC", border: `1px solid ${tts.speaking ? "#FCD34D" : "#E2E8F0"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🔊</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", display: "flex", alignItems: "center", gap: 7 }}>
                      Read page aloud
                      <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "monospace", background: "#F1F5F9", color: "#64748B", border: "1px solid #E2E8F0", borderRadius: 4, padding: "2px 6px" }}>Alt+S</span>
                    </div>
                    <div style={{ fontSize: 13, color: tts.speaking ? "#D97706" : "#94A3B8", marginTop: 2 }}>
                      {tts.speaking ? "Reading page aloud…" : "Reads full page top to bottom"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => tts.speaking ? tts.stop() : (setOpen(false), tts.startReading())}
                  style={{
                    padding: "10px 16px", borderRadius: 10, border: "none",
                    background: tts.speaking ? "#DC2626" : "#0F5C6E",
                    color: "#fff", fontSize: 14, fontWeight: 700,
                    cursor: "pointer", flexShrink: 0, fontFamily: "'DM Sans', system-ui",
                  }}
                >{tts.speaking ? "■ Stop" : "▶ Read"}</button>
              </div>
            </div>

            {/* ── COLOR FILTERS ── */}
            <SectionLabel>Color Vision</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "10px 0 14px", borderBottom: "1px solid #F1F5F9" }}>
              {[
                { value: "none",         label: "None",         color: "#64748B", icon: "👁️" },
                { value: "protanopia",   label: "Protanopia",   color: "#E55B4D", icon: "🔴" },
                { value: "deuteranopia", label: "Deuteranopia", color: "#4D8BE5", icon: "🔵" },
                { value: "tritanopia",   label: "Tritanopia",   color: "#4DE5B8", icon: "🟢" },
              ].map(cf => (
                <button key={cf.value}
                  role="radio" aria-checked={settings.colorFilter === cf.value}
                  onClick={() => dispatch({ type: "SET", key: "colorFilter", value: cf.value })}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "12px 14px", borderRadius: 10,
                    border: `1.5px solid ${settings.colorFilter === cf.value ? "#0F5C6E" : "#E2E8F0"}`,
                    background: settings.colorFilter === cf.value ? "#F0FDFA" : "#fff",
                    cursor: "pointer", fontSize: 13, fontWeight: 600,
                    color: settings.colorFilter === cf.value ? "#0F5C6E" : "#475569",
                    fontFamily: "'DM Sans', system-ui", transition: "all 0.15s",
                  }}
                >
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: cf.color, flexShrink: 0 }} />
                  {cf.label}
                </button>
              ))}
            </div>

            {/* ── SHORTCUTS ── */}
            <SectionLabel>Keyboard Shortcuts</SectionLabel>
            <button
              onClick={() => setShowShortcuts(s => !s)}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 10,
                border: "1.5px solid #E2E8F0", background: "#F8FAFC",
                color: "#475569", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans', system-ui",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginTop: 4,
              }}
            >
              <span>⌨️ {showShortcuts ? "Hide shortcuts" : "Show all shortcuts"}</span>
              <span>{showShortcuts ? "▲" : "▼"}</span>
            </button>
            {showShortcuts && (
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { keys: "Alt+A", desc: "Open / close panel" },
                  { keys: "Alt+D", desc: "Dyslexia font" },
                  { keys: "Alt+C", desc: "High contrast" },
                  { keys: "Alt+L", desc: "Highlight links" },
                  { keys: "Alt+U", desc: "Large cursor" },
                  { keys: "Alt+R", desc: "Reading mode" },
                  { keys: "Alt+S", desc: "Read aloud" },
                  { keys: "Alt++", desc: "Increase font size" },
                  { keys: "Alt+−", desc: "Decrease font size" },
                  { keys: "Escape", desc: "Close panel" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F8FAFC" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "monospace", background: "#1E293B", color: "#fff", padding: "3px 8px", borderRadius: 5, border: "1px solid #334155", boxShadow: "0 2px 0 #0f172a" }}>{s.keys}</span>
                    <span style={{ fontSize: 13, color: "#64748B", fontFamily: "'DM Sans', system-ui" }}>{s.desc}</span>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Footer */}
          <div style={{ padding: "10px 20px", borderTop: "1px solid #F1F5F9", background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#CBD5E1", fontFamily: "'DM Sans', system-ui" }}>♿ WCAG 2.1 AA</span>
            <span style={{ color: "#CBD5E1", fontSize: 12 }}>·</span>
            <span style={{ fontSize: 12, color: "#CBD5E1", fontFamily: "'DM Sans', system-ui" }}>InklusiJobs</span>
          </div>
        </div>
      )}
    </>
  );
}