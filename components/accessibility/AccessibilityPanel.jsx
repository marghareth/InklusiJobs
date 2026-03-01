"use client";

import { useState, useEffect, useRef, useCallback, useReducer } from "react";

const STORAGE_KEY = "ij_a11y_v2";

const DEFAULT_SETTINGS = {
  dyslexiaFont:   false,
  fontSize:       100,   // percentage: 80–150
  highContrast:   false,
  highlightLinks: false,
  largeCursor:    false,
  reduceMotion:   false,
  readingMode:    false,
  colorFilter:    "none",
};

// ── Persist settings across page navigations ──────────────────────────────────
function loadSettings() {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
}

function saveSettings(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

function settingsReducer(state, action) {
  let next = state;
  switch (action.type) {
    case "TOGGLE": next = { ...state, [action.key]: !state[action.key] }; break;
    case "SET":    next = { ...state, [action.key]: action.value }; break;
    case "RESET":  next = { ...DEFAULT_SETTINGS }; break;
    case "LOAD":   next = { ...DEFAULT_SETTINGS, ...action.payload }; break;
    default:       return state;
  }
  saveSettings(next);
  return next;
}

function usePersistedSettings() {
  const [settings, dispatch] = useReducer(settingsReducer, DEFAULT_SETTINGS);
  useEffect(() => {
    dispatch({ type: "LOAD", payload: loadSettings() });
  }, []);
  return [settings, dispatch];
}

// ── Apply all settings to the document ────────────────────────────────────────
function useApplySettings(settings) {
  useEffect(() => {
    const root = document.documentElement;

    // ── Dyslexia font ──
    if (settings.dyslexiaFont) {
      if (!document.getElementById("a11y-lexend-font")) {
        const link = document.createElement("link");
        link.id = "a11y-lexend-font";
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap";
        document.head.appendChild(link);
      }
    }
    root.classList.toggle("a11y-dyslexia", settings.dyslexiaFont);

    // ── Font size — apply to root so rem/% scales everything ──
    root.style.setProperty("--a11y-font-scale", `${settings.fontSize / 100}`);
    root.style.fontSize = `${settings.fontSize}%`;

    // ── Other classes ──
    root.classList.toggle("a11y-high-contrast",   settings.highContrast);
    root.classList.toggle("a11y-highlight-links", settings.highlightLinks);
    root.classList.toggle("a11y-large-cursor",    settings.largeCursor);
    root.classList.toggle("a11y-reduce-motion",   settings.reduceMotion);
    root.classList.toggle("a11y-reading-mode",    settings.readingMode);

    // ── Color filter ──
    root.classList.remove("a11y-cf-protanopia", "a11y-cf-deuteranopia", "a11y-cf-tritanopia");
    if (settings.colorFilter !== "none") {
      root.classList.add(`a11y-cf-${settings.colorFilter}`);
    }
  }, [settings]);
}

// ── Inject global CSS once ────────────────────────────────────────────────────
function useGlobalStyles() {
  useEffect(() => {
    if (document.getElementById("a11y-global-styles")) return;
    const style = document.createElement("style");
    style.id = "a11y-global-styles";
    style.textContent = `
      /* ── Dyslexia font — applies to ALL text on the page ── */
      html.a11y-dyslexia,
      html.a11y-dyslexia body,
      html.a11y-dyslexia *,
      html.a11y-dyslexia *::before,
      html.a11y-dyslexia *::after {
        font-family: 'Lexend', sans-serif !important;
        letter-spacing: 0.03em !important;
        word-spacing: 0.08em !important;
        line-height: 1.75 !important;
      }

      /* ── Font size — cascades to all text ── */
      html body,
      html body p,
      html body span,
      html body div,
      html body a,
      html body li,
      html body td,
      html body th,
      html body label,
      html body input,
      html body select,
      html body textarea,
      html body button:not([data-a11y-panel-btn]) {
        font-size: inherit;
      }

      /* ── High contrast — elegant dark mode, NOT ugly full black ── */
      html.a11y-high-contrast {
        --hc-bg: #0D1117;
        --hc-surface: #161B22;
        --hc-surface2: #21262D;
        --hc-border: #30363D;
        --hc-text: #E6EDF3;
        --hc-muted: #8B949E;
        --hc-link: #79C0FF;
        --hc-accent: #58A6FF;
        --hc-success: #3FB950;
        --hc-warning: #D29922;
      }
      html.a11y-high-contrast body {
        background-color: var(--hc-bg) !important;
        color: var(--hc-text) !important;
      }
      /* Main sections */
      html.a11y-high-contrast main,
      html.a11y-high-contrast section,
      html.a11y-high-contrast article {
        background-color: var(--hc-bg) !important;
        color: var(--hc-text) !important;
      }
      /* Cards and surfaces */
      html.a11y-high-contrast [class*="card"],
      html.a11y-high-contrast [class*="Card"],
      html.a11y-high-contrast [class*="panel"],
      html.a11y-high-contrast [class*="Panel"],
      html.a11y-high-contrast [class*="box"],
      html.a11y-high-contrast [class*="Box"] {
        background-color: var(--hc-surface) !important;
        border-color: var(--hc-border) !important;
        color: var(--hc-text) !important;
      }
      /* All divs get the dark surface */
      html.a11y-high-contrast div:not([id*="a11y"]):not([data-a11y-panel]):not([data-a11y-panel] *) {
        background-color: var(--hc-bg) !important;
        color: var(--hc-text) !important;
        border-color: var(--hc-border) !important;
      }
      html.a11y-high-contrast p,
      html.a11y-high-contrast span,
      html.a11y-high-contrast li,
      html.a11y-high-contrast td,
      html.a11y-high-contrast th,
      html.a11y-high-contrast label,
      html.a11y-high-contrast h1,
      html.a11y-high-contrast h2,
      html.a11y-high-contrast h3,
      html.a11y-high-contrast h4,
      html.a11y-high-contrast h5,
      html.a11y-high-contrast h6 {
        color: var(--hc-text) !important;
        background-color: transparent !important;
      }
      html.a11y-high-contrast a {
        color: var(--hc-link) !important;
        text-decoration: underline !important;
      }
      html.a11y-high-contrast img {
        filter: brightness(0.85) contrast(1.1) !important;
      }
      html.a11y-high-contrast nav,
      html.a11y-high-contrast header {
        background-color: var(--hc-surface) !important;
        border-bottom: 1px solid var(--hc-border) !important;
      }
      html.a11y-high-contrast footer {
        background-color: var(--hc-surface) !important;
        border-top: 1px solid var(--hc-border) !important;
      }
      html.a11y-high-contrast input,
      html.a11y-high-contrast select,
      html.a11y-high-contrast textarea {
        background-color: var(--hc-surface2) !important;
        color: var(--hc-text) !important;
        border: 1.5px solid var(--hc-border) !important;
      }
      html.a11y-high-contrast button:not([data-a11y-panel-btn]) {
        background-color: var(--hc-surface2) !important;
        color: var(--hc-text) !important;
        border: 1.5px solid var(--hc-border) !important;
      }
      html.a11y-high-contrast button:not([data-a11y-panel-btn]):hover {
        background-color: var(--hc-surface) !important;
        border-color: var(--hc-accent) !important;
      }
      /* Preserve gradient/accent buttons */
      html.a11y-high-contrast [style*="linear-gradient"]:not([data-a11y-panel]) {
        background: var(--hc-surface2) !important;
        border: 2px solid var(--hc-accent) !important;
        color: var(--hc-accent) !important;
      }
      /* ── IMPORTANT: Accessibility panel itself is EXEMPT from high contrast ── */
      [data-a11y-panel],
      [data-a11y-panel] *,
      [data-a11y-panel] div,
      [data-a11y-panel] button,
      [data-a11y-panel] span,
      [data-a11y-panel] p {
        background-color: unset !important;
        color: unset !important;
        border-color: unset !important;
        filter: none !important;
      }

      /* ── Highlight links — very noticeable ── */
      html.a11y-highlight-links a {
        background: #FEFCE8 !important;
        color: #0F4C4C !important;
        text-decoration: underline !important;
        text-decoration-thickness: 2.5px !important;
        text-underline-offset: 4px !important;
        text-decoration-color: #D97706 !important;
        outline: 2px dashed #D97706 !important;
        outline-offset: 2px !important;
        padding: 2px 5px !important;
        border-radius: 4px !important;
        font-weight: 700 !important;
      }
      html.a11y-highlight-links a:hover {
        background: #FEF3C7 !important;
        outline-style: solid !important;
      }

      /* ── Large cursor ── */
      html.a11y-large-cursor,
      html.a11y-large-cursor * {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M8 4 L8 32 L14 26 L19 36 L22 35 L17 25 L26 25 Z' fill='black' stroke='white' stroke-width='2'/%3E%3C/svg%3E") 8 4, auto !important;
      }

      /* ── Reduce motion ── */
      html.a11y-reduce-motion *,
      html.a11y-reduce-motion *::before,
      html.a11y-reduce-motion *::after {
        animation-duration: 0.001ms !important;
        transition-duration: 0.001ms !important;
        scroll-behavior: auto !important;
      }

      /* ── Reading mode — dims everything except main text ── */
      html.a11y-reading-mode header,
      html.a11y-reading-mode footer,
      html.a11y-reading-mode nav,
      html.a11y-reading-mode aside,
      html.a11y-reading-mode [class*="sidebar"],
      html.a11y-reading-mode [class*="Sidebar"],
      html.a11y-reading-mode [class*="banner"],
      html.a11y-reading-mode [class*="hero"] {
        opacity: 0.15 !important;
        pointer-events: none !important;
        user-select: none !important;
      }
      html.a11y-reading-mode main,
      html.a11y-reading-mode article,
      html.a11y-reading-mode [id="main-content"] {
        max-width: 720px !important;
        margin: 0 auto !important;
        padding: 32px 24px !important;
        font-size: 1.05em !important;
        line-height: 1.85 !important;
        background: #FAFAFA !important;
        border-radius: 12px !important;
        box-shadow: 0 0 0 9999px rgba(0,0,0,0.45) !important;
        position: relative !important;
        z-index: 10 !important;
      }

      /* ── Color vision ── */
      html.a11y-cf-protanopia body   { filter: url(#a11y-p) !important; }
      html.a11y-cf-deuteranopia body { filter: url(#a11y-d) !important; }
      html.a11y-cf-tritanopia body   { filter: url(#a11y-t) !important; }

      /* ── TTS highlight ── */
      .a11y-tts-highlight {
        background: #FEF08A !important;
        color: #1A1A1A !important;
        outline: 2px solid #D97706 !important;
        border-radius: 3px !important;
      }

      @keyframes a11ySlideIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    // SVG color filters
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

    return () => {};
  }, []);
}

// ── Drag hook ─────────────────────────────────────────────────────────────────
function useDrag() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const moved = useRef(false);
  const startOffset = useRef({ x: 0, y: 0 });
  const btnRef = useRef(null);

  useEffect(() => {
    setPos({ x: window.innerWidth - 76, y: window.innerHeight - 76 });
  }, []);

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    moved.current = false;
    const rect = btnRef.current?.getBoundingClientRect() || { left: pos.x, top: pos.y };
    startOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    dragging.current = true;
  }, [pos]);

  const onTouchStart = useCallback((e) => {
    moved.current = false;
    dragging.current = true;
    const t = e.touches[0];
    const rect = btnRef.current?.getBoundingClientRect() || { left: pos.x, top: pos.y };
    startOffset.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
  }, [pos]);

  useEffect(() => {
    const move = (clientX, clientY) => {
      if (!dragging.current) return;
      moved.current = true;
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

  return { pos, btnRef, onMouseDown, onTouchStart, wasMoved: () => moved.current };
}

// ── TTS hook ──────────────────────────────────────────────────────────────────
function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const activeRef = useRef(false);

  const stop = useCallback(() => {
    activeRef.current = false;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    document.querySelectorAll(".a11y-tts-highlight").forEach(el => el.classList.remove("a11y-tts-highlight"));
  }, []);

  const startReading = useCallback(() => {
    if (!window.speechSynthesis) { alert("Text-to-speech not supported in this browser."); return; }
    stop();
    const els = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,td,th,blockquote,figcaption"))
      .filter(el => {
        const t = el.innerText?.trim();
        return t && t.length > 1 && !el.closest("[data-a11y-panel]");
      });
    if (!els.length) return;
    activeRef.current = true;
    setSpeaking(true);
    let i = 0;
    const next = () => {
      if (!activeRef.current || i >= els.length) { stop(); return; }
      document.querySelectorAll(".a11y-tts-highlight").forEach(el => el.classList.remove("a11y-tts-highlight"));
      const el = els[i];
      el.classList.add("a11y-tts-highlight");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const utt = new SpeechSynthesisUtterance(el.innerText || el.textContent || "");
      utt.rate = 0.92;
      utt.onend = () => { el.classList.remove("a11y-tts-highlight"); i++; next(); };
      utt.onerror = () => { el.classList.remove("a11y-tts-highlight"); i++; next(); };
      window.speechSynthesis.speak(utt);
    };
    next();
  }, [stop]);

  return { speaking, startReading, stop };
}

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }) {
  return (
    <button
      data-a11y-panel-btn
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        width: 52, height: 28, borderRadius: 999, border: "none", padding: 0,
        background: checked ? "#0F5C6E" : "#CBD5E1",
        cursor: "pointer", position: "relative", flexShrink: 0,
        transition: "background 0.22s",
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: checked ? 27 : 3,
        width: 22, height: 22, borderRadius: "50%", background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.22)",
        transition: "left 0.2s cubic-bezier(0.4,0,0.2,1)",
        display: "block",
      }} />
    </button>
  );
}

// ── Feature Row ───────────────────────────────────────────────────────────────
function FeatureRow({ icon, label, desc, shortcut, checked, onChange }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12, padding: "11px 0", borderBottom: "1px solid #F1F5F9",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
        <span style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          background: checked ? "#E6F4F6" : "#F8FAFC",
          border: `1px solid ${checked ? "#1A8FA5" : "#E2E8F0"}`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
        }}>{icon}</span>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{label}</span>
            {shortcut && (
              <span style={{
                fontSize: 9, fontWeight: 700, fontFamily: "monospace",
                background: "#F1F5F9", color: "#64748B",
                border: "1px solid #E2E8F0", borderRadius: 4, padding: "1px 5px",
              }}>{shortcut}</span>
            )}
          </div>
          {desc && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1, lineHeight: 1.4 }}>{desc}</div>}
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

// ── Section Label ─────────────────────────────────────────────────────────────
function PanelSectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, color: "#94A3B8",
      letterSpacing: "0.12em", textTransform: "uppercase",
      marginTop: 14, marginBottom: 4,
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

  useEffect(() => { setMounted(true); }, []);

  const { pos, btnRef, onMouseDown, onTouchStart, wasMoved } = useDrag();
  const tts = useTTS();

  useApplySettings(settings);
  useGlobalStyles();

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") { setOpen(false); tts.stop(); return; }
      if (!e.altKey) return;
      switch (e.key.toLowerCase()) {
        case "a": e.preventDefault(); setOpen(o => !o); break;
        case "d": e.preventDefault(); dispatch({ type: "TOGGLE", key: "dyslexiaFont" }); break;
        case "c": e.preventDefault(); dispatch({ type: "TOGGLE", key: "highContrast" }); break;
        case "l": e.preventDefault(); dispatch({ type: "TOGGLE", key: "highlightLinks" }); break;
        case "u": e.preventDefault(); dispatch({ type: "TOGGLE", key: "largeCursor" }); break;
        case "r": e.preventDefault(); dispatch({ type: "TOGGLE", key: "readingMode" }); break;
        case "m": e.preventDefault(); dispatch({ type: "TOGGLE", key: "reduceMotion" }); break;
        case "s": e.preventDefault(); tts.speaking ? tts.stop() : tts.startReading(); break;
        case "+": case "=": e.preventDefault(); dispatch({ type: "SET", key: "fontSize", value: Math.min(150, settings.fontSize + 10) }); break;
        case "-": e.preventDefault(); dispatch({ type: "SET", key: "fontSize", value: Math.max(80, settings.fontSize - 10) }); break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [settings.fontSize, tts, dispatch]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!panelRef.current?.contains(e.target) && !btnRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!mounted) return null;

  const activeCount = Object.entries(settings).filter(([k, v]) =>
    k === "fontSize" ? v !== 100 : k === "colorFilter" ? v !== "none" : v === true
  ).length;

  // Panel positioning
  const panelW = 340;
  const openRight = pos.x + panelW + 16 > window.innerWidth;
  const openUp = pos.y + 64 + 600 > window.innerHeight;

  return (
    <>
      {/* Floating button */}
      <div
        ref={btnRef}
        data-a11y-panel
        suppressHydrationWarning
        style={{
          position: "fixed", zIndex: 10000,
          left: `${pos.x}px`, top: `${pos.y}px`,
          cursor: "grab", userSelect: "none",
          WebkitUserSelect: "none", touchAction: "none",
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <button
          data-a11y-panel-btn
          onClick={() => { if (!wasMoved()) setOpen(o => !o); }}
          aria-label={open ? "Close accessibility panel" : "Open accessibility panel (Alt+A)"}
          aria-expanded={open}
          style={{
            width: 52, height: 52, borderRadius: "50%", border: "3px solid #fff",
            background: open ? "#0A3D4A" : "#0F5C6E",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(15,92,110,0.5), 0 0 0 0 rgba(15,92,110,0)",
            transition: "transform 0.2s, background 0.2s",
            position: "relative",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="4" r="2"/>
            <path d="M12 6v4M8 10H5l2 8h2l1-4h4l1 4h2l2-8h-3"/>
          </svg>
          {activeCount > 0 && (
            <span style={{
              position: "absolute", top: -5, right: -5,
              width: 19, height: 19, borderRadius: "50%",
              background: "#F59E0B", color: "#1a1a1a",
              fontSize: 10, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid #fff",
            }}>{activeCount}</span>
          )}
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div
          data-a11y-panel
          ref={panelRef}
          role="dialog"
          aria-label="Accessibility Settings"
          style={{
            position: "fixed",
            zIndex: 9999,
            left:   openRight ? "auto" : `${pos.x}px`,
            right:  openRight ? `${window.innerWidth - pos.x - 52}px` : "auto",
            top:    openUp ? "auto" : `${pos.y + 62}px`,
            bottom: openUp ? `${window.innerHeight - pos.y + 8}px` : "auto",
            width: panelW,
            maxHeight: "80vh",
            background: "#FFFFFF",
            borderRadius: 20,
            boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
            border: "1.5px solid #E2E8F0",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
            animation: "a11ySlideIn 0.2s cubic-bezier(0.22,1,0.36,1)",
            // Ensure panel is ALWAYS white, never affected by HC mode
            colorScheme: "light",
          }}
        >
          {/* Panel Header */}
          <div style={{
            padding: "15px 18px 13px",
            borderBottom: "1px solid #F1F5F9",
            background: "linear-gradient(135deg, #F0FDFA, #E6F4F6)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#0F5C6E",
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="4" r="2"/>
                  <path d="M12 6v4M8 10H5l2 8h2l1-4h4l1 4h2l2-8h-3"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0A2A35" }}>Accessibility</div>
                <div style={{ fontSize: 11, color: "#6B8A95" }}>
                  {activeCount > 0 ? `${activeCount} feature${activeCount > 1 ? "s" : ""} active` : "All features off"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {activeCount > 0 && (
                <button
                  data-a11y-panel-btn
                  onClick={() => { dispatch({ type: "RESET" }); tts.stop(); }}
                  style={{
                    padding: "5px 10px", borderRadius: 8,
                    border: "1px solid #D0E4E8", background: "#fff",
                    color: "#6B8A95", fontSize: 11, fontWeight: 700, cursor: "pointer",
                  }}
                >Reset</button>
              )}
              <button
                data-a11y-panel-btn
                onClick={() => setOpen(false)}
                style={{
                  width: 28, height: 28, borderRadius: "50%", border: "none",
                  background: "#E6F4F6", color: "#0F5C6E", cursor: "pointer",
                  fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700,
                }}
                aria-label="Close"
              >✕</button>
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "4px 18px 16px",
            scrollbarWidth: "thin", scrollbarColor: "#D0E4E8 transparent",
            background: "#fff", color: "#1E293B",
          }}>

            {/* Font Size */}
            <PanelSectionLabel>Text Size</PanelSectionLabel>
            <div style={{ padding: "10px 0 12px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button data-a11y-panel-btn
                  onClick={() => dispatch({ type: "SET", key: "fontSize", value: Math.max(80, settings.fontSize - 10) })}
                  aria-label="Decrease font size"
                  style={{ width: 34, height: 34, borderRadius: 9, border: "1.5px solid #D0E4E8",
                    background: "#F8FAFC", color: "#475569", fontSize: 13, fontWeight: 800,
                    cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                >A−</button>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#64748B" }}>Font Size</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#0F5C6E", fontFamily: "monospace" }}>{settings.fontSize}%</span>
                  </div>
                  <input type="range" min={80} max={150} step={5} value={settings.fontSize}
                    onChange={e => dispatch({ type: "SET", key: "fontSize", value: Number(e.target.value) })}
                    aria-label="Font size slider"
                    style={{ width: "100%", accentColor: "#0F5C6E", cursor: "pointer", height: 4 }} />
                </div>
                <button data-a11y-panel-btn
                  onClick={() => dispatch({ type: "SET", key: "fontSize", value: Math.min(150, settings.fontSize + 10) })}
                  aria-label="Increase font size"
                  style={{ width: 34, height: 34, borderRadius: 9, border: "1.5px solid #D0E4E8",
                    background: "#F8FAFC", color: "#475569", fontSize: 13, fontWeight: 800,
                    cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                >A+</button>
              </div>
              {settings.fontSize !== 100 && (
                <button data-a11y-panel-btn
                  onClick={() => dispatch({ type: "SET", key: "fontSize", value: 100 })}
                  style={{ marginTop: 6, background: "none", border: "none", color: "#94A3B8",
                    fontSize: 10, cursor: "pointer", padding: 0, textDecoration: "underline" }}>
                  Reset to 100%
                </button>
              )}
            </div>

            {/* Text & Display */}
            <PanelSectionLabel>Text & Display</PanelSectionLabel>
            <FeatureRow icon="📖" label="Dyslexia-friendly font"
              desc="Switches entire page to Lexend" shortcut="Alt+D"
              checked={settings.dyslexiaFont}
              onChange={() => dispatch({ type: "TOGGLE", key: "dyslexiaFont" })} />
            <FeatureRow icon="◑" label="High contrast"
              desc="Dark theme with high readability" shortcut="Alt+C"
              checked={settings.highContrast}
              onChange={() => dispatch({ type: "TOGGLE", key: "highContrast" })} />
            <FeatureRow icon="🔗" label="Highlight links"
              desc="Makes all links very noticeable" shortcut="Alt+L"
              checked={settings.highlightLinks}
              onChange={() => dispatch({ type: "TOGGLE", key: "highlightLinks" })} />
            <FeatureRow icon="🖱️" label="Large cursor"
              desc="Bigger mouse pointer" shortcut="Alt+U"
              checked={settings.largeCursor}
              onChange={() => dispatch({ type: "TOGGLE", key: "largeCursor" })} />

            {/* Motion & Focus */}
            <PanelSectionLabel>Motion & Focus</PanelSectionLabel>
            <FeatureRow icon="⏸️" label="Reduce motion"
              desc="Disables animations & transitions" shortcut="Alt+M"
              checked={settings.reduceMotion}
              onChange={() => dispatch({ type: "TOGGLE", key: "reduceMotion" })} />
            <FeatureRow icon="🔍" label="Reading mode"
              desc="Focuses on main content, dims rest" shortcut="Alt+R"
              checked={settings.readingMode}
              onChange={() => dispatch({ type: "TOGGLE", key: "readingMode" })} />

            {/* Read Aloud */}
            <PanelSectionLabel>Read Aloud</PanelSectionLabel>
            <div style={{ padding: "10px 0 12px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                    background: tts.speaking ? "#FEF3C7" : "#F8FAFC",
                    border: `1px solid ${tts.speaking ? "#FCD34D" : "#E2E8F0"}`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔊</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", display: "flex", alignItems: "center", gap: 6 }}>
                      Read page aloud
                      <span style={{ fontSize: 9, fontWeight: 700, fontFamily: "monospace",
                        background: "#F1F5F9", color: "#64748B", border: "1px solid #E2E8F0",
                        borderRadius: 4, padding: "1px 5px" }}>Alt+S</span>
                    </div>
                    <div style={{ fontSize: 11, color: tts.speaking ? "#D97706" : "#94A3B8", marginTop: 1 }}>
                      {tts.speaking ? "Reading page aloud…" : "Reads full page top to bottom"}
                    </div>
                  </div>
                </div>
                <button data-a11y-panel-btn
                  onClick={() => tts.speaking ? tts.stop() : (setOpen(false), tts.startReading())}
                  style={{ padding: "7px 13px", borderRadius: 9, border: "none",
                    background: tts.speaking ? "#DC2626" : "#0F5C6E",
                    color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  {tts.speaking ? "■ Stop" : "▶ Read"}
                </button>
              </div>
            </div>

            {/* Color Vision */}
            <PanelSectionLabel>Color Vision</PanelSectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "8px 0 12px", borderBottom: "1px solid #F1F5F9" }}>
              {[
                { value: "none",         label: "None",         color: "#64748B" },
                { value: "protanopia",   label: "Protanopia",   color: "#E55B4D" },
                { value: "deuteranopia", label: "Deuteranopia", color: "#4D8BE5" },
                { value: "tritanopia",   label: "Tritanopia",   color: "#4DE5B8" },
              ].map(cf => (
                <button key={cf.value} data-a11y-panel-btn
                  role="radio" aria-checked={settings.colorFilter === cf.value}
                  onClick={() => dispatch({ type: "SET", key: "colorFilter", value: cf.value })}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 11px", borderRadius: 9,
                    border: `1.5px solid ${settings.colorFilter === cf.value ? "#0F5C6E" : "#E2E8F0"}`,
                    background: settings.colorFilter === cf.value ? "#E6F4F6" : "#fff",
                    cursor: "pointer", fontSize: 12, fontWeight: 600,
                    color: settings.colorFilter === cf.value ? "#0F5C6E" : "#475569",
                    transition: "all 0.15s" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: cf.color, flexShrink: 0 }} />
                  {cf.label}
                </button>
              ))}
            </div>

            {/* Keyboard Shortcuts */}
            <PanelSectionLabel>Keyboard Shortcuts</PanelSectionLabel>
            <button data-a11y-panel-btn
              onClick={() => setShowShortcuts(s => !s)}
              style={{ width: "100%", padding: "9px 12px", borderRadius: 9,
                border: "1.5px solid #E2E8F0", background: "#F8FAFC",
                color: "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
              <span>⌨️ {showShortcuts ? "Hide shortcuts" : "Show all shortcuts"}</span>
              <span>{showShortcuts ? "▲" : "▼"}</span>
            </button>
            {showShortcuts && (
              <div style={{ marginTop: 8 }}>
                {[
                  { keys: "Alt+A", desc: "Open / close panel" },
                  { keys: "Alt+D", desc: "Dyslexia font" },
                  { keys: "Alt+C", desc: "High contrast" },
                  { keys: "Alt+L", desc: "Highlight links" },
                  { keys: "Alt+U", desc: "Large cursor" },
                  { keys: "Alt+R", desc: "Reading mode" },
                  { keys: "Alt+M", desc: "Reduce motion" },
                  { keys: "Alt+S", desc: "Read aloud" },
                  { keys: "Alt++", desc: "Increase font size" },
                  { keys: "Alt+−", desc: "Decrease font size" },
                  { keys: "Esc",   desc: "Close panel" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "center", padding: "6px 0", borderBottom: "1px solid #F8FAFC" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "monospace",
                      background: "#1E293B", color: "#fff", padding: "2px 6px",
                      borderRadius: 5, border: "1px solid #334155", boxShadow: "0 2px 0 #0f172a" }}>{s.keys}</span>
                    <span style={{ fontSize: 11, color: "#64748B" }}>{s.desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: "8px 18px", borderTop: "1px solid #F1F5F9",
            background: "#FAFAFA", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 6 }}>
            <span style={{ fontSize: 10, color: "#CBD5E1" }}>♿ WCAG 2.1 AA</span>
            <span style={{ color: "#CBD5E1", fontSize: 10 }}>·</span>
            <span style={{ fontSize: 10, color: "#CBD5E1" }}>InklusiJobs</span>
          </div>
        </div>
      )}
    </>
  );
}