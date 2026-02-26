"use client";

import {
  useState, useEffect, useRef, useCallback, useReducer,
} from "react";

const STORAGE_KEY = "ij_a11y_v1";
const DYSLEXIA_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap";

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

const KEYBOARD_SHORTCUTS = [
  { keys: ["Alt", "A"],       desc: "Open / close accessibility panel" },
  { keys: ["Alt", "D"],       desc: "Toggle dyslexia-friendly font" },
  { keys: ["Alt", "+"],       desc: "Increase font size" },
  { keys: ["Alt", "−"],       desc: "Decrease font size" },
  { keys: ["Alt", "C"],       desc: "Toggle high contrast" },
  { keys: ["Alt", "R"],       desc: "Toggle reading mode" },
  { keys: ["Alt", "S"],       desc: "Start / stop text-to-speech" },
  { keys: ["Escape"],         desc: "Close panel / stop reading" },
];

const COLOR_FILTERS = [
  { value: "none",         label: "None",         color: "#64748B" },
  { value: "protanopia",   label: "Protanopia",   color: "#E55B4D" },
  { value: "deuteranopia", label: "Deuteranopia", color: "#4D8BE5" },
  { value: "tritanopia",   label: "Tritanopia",   color: "#4DE5B8" },
];

const SVG_FILTERS = `
  <svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
    <defs>
      <filter id="a11y-protanopia">
        <feColorMatrix type="matrix" values="
          0.567 0.433 0     0 0
          0.558 0.442 0     0 0
          0     0.242 0.758 0 0
          0     0     0     1 0"/>
      </filter>
      <filter id="a11y-deuteranopia">
        <feColorMatrix type="matrix" values="
          0.625 0.375 0   0 0
          0.7   0.3   0   0 0
          0     0.3   0.7 0 0
          0     0     0   1 0"/>
      </filter>
      <filter id="a11y-tritanopia">
        <feColorMatrix type="matrix" values="
          0.95 0.05  0     0 0
          0    0.433 0.567 0 0
          0    0.475 0.525 0 0
          0    0     0     1 0"/>
      </filter>
    </defs>
  </svg>
`;

function settingsReducer(state, action) {
  switch (action.type) {
    case "TOGGLE":   return { ...state, [action.key]: !state[action.key] };
    case "SET":      return { ...state, [action.key]: action.value };
    case "RESET":    return { ...DEFAULT_SETTINGS };
    case "LOAD":     return { ...DEFAULT_SETTINGS, ...action.payload };
    default:         return state;
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
        link.id   = "a11y-dyslexia-font";
        link.rel  = "stylesheet";
        link.href = DYSLEXIA_FONT_URL;
        document.head.appendChild(link);
      }
      root.style.setProperty("--a11y-font", "'Lexend', sans-serif");
    } else {
      root.style.removeProperty("--a11y-font");
    }

    root.style.setProperty("--a11y-font-size", `${settings.fontSize}%`);
    root.style.fontSize = `${settings.fontSize}%`;
    root.classList.toggle("a11y-high-contrast", settings.highContrast);
    root.classList.toggle("a11y-highlight-links", settings.highlightLinks);
    root.classList.toggle("a11y-large-cursor", settings.largeCursor);
    root.classList.toggle("a11y-reduce-motion", settings.reduceMotion);
    root.classList.toggle("a11y-reading-mode", settings.readingMode);

    const mainEl = document.getElementById("a11y-filter-target") || document.body;
    if (settings.colorFilter !== "none") {
      mainEl.style.filter = `url(#a11y-${settings.colorFilter})`;
    } else {
      mainEl.style.filter = "";
    }
  }, [settings]);
}

function useGlobalStyles() {
  useEffect(() => {
    if (document.getElementById("a11y-global-styles")) return;

    const style = document.createElement("style");
    style.id = "a11y-global-styles";
    style.textContent = `
      .a11y-dyslexia body,
      html[style*="--a11y-font"] body,
      html[style*="--a11y-font"] * {
        font-family: var(--a11y-font, inherit) !important;
      }
      .a11y-high-contrast body {
        background: #000 !important;
        color: #fff !important;
      }
      .a11y-high-contrast *:not([class*="a11y-panel"]):not([class*="a11y-btn"]) {
        background-color: #000 !important;
        color: #fff !important;
        border-color: #fff !important;
      }
      .a11y-high-contrast a { color: #ffff00 !important; }
      .a11y-high-contrast button, .a11y-high-contrast input, .a11y-high-contrast select, .a11y-high-contrast textarea {
        background: #111 !important;
        color: #fff !important;
        border: 2px solid #fff !important;
      }
      .a11y-highlight-links a {
        background: #ffff0088 !important;
        outline: 2px solid #f59e0b !important;
        outline-offset: 2px !important;
        border-radius: 3px !important;
        text-decoration: underline !important;
        text-underline-offset: 3px !important;
      }
      .a11y-large-cursor,
      .a11y-large-cursor * {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M8 4 L8 32 L14 26 L19 36 L22 35 L17 25 L26 25 Z' fill='black' stroke='white' stroke-width='2'/%3E%3C/svg%3E") 8 4, auto !important;
      }
      .a11y-reduce-motion *,
      .a11y-reduce-motion *::before,
      .a11y-reduce-motion *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
        scroll-behavior: auto !important;
      }
      .a11y-reading-mode body > *:not(#a11y-reading-overlay):not([class*="a11y-"]) {
        filter: blur(2px) !important;
        opacity: 0.15 !important;
        pointer-events: none !important;
        user-select: none !important;
      }
      #a11y-reading-overlay {
        position: fixed; inset: 0; z-index: 9990;
        display: flex; align-items: flex-start; justify-content: center;
        padding: 60px 20px;
        background: rgba(0,0,0,0.7);
        overflow-y: auto;
      }
      #a11y-reading-content {
        max-width: 680px; width: 100%;
        background: #fafaf9; border-radius: 16px;
        padding: 48px 52px;
        font-family: 'Lexend', Georgia, serif;
        font-size: 1.1rem; line-height: 1.9; color: #1a1a1a;
        box-shadow: 0 32px 80px rgba(0,0,0,0.5);
      }
      .a11y-tts-highlight {
        background: #fef08a !important;
        color: #1a1a1a !important;
        border-radius: 3px;
      }
    `;
    document.head.appendChild(style);

    const svgWrap = document.createElement("div");
    svgWrap.innerHTML = SVG_FILTERS;
    document.body.prepend(svgWrap.firstElementChild);

    return () => {
      document.getElementById("a11y-global-styles")?.remove();
    };
  }, []);
}

// ── FIXED: useDrag now starts with safe static values, then updates after mount
function useDrag(initialPos = { x: 24, y: 24 }) {
  const [pos, setPos] = useState(initialPos);
  const dragging      = useRef(false);
  const startOffset   = useRef({ x: 0, y: 0 });
  const btnRef        = useRef(null);

  // Set real window-based position after mount to avoid hydration mismatch
  useEffect(() => {
    setPos({
      x: window.innerWidth - 72,
      y: window.innerHeight - 72,
    });
  }, []);

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    dragging.current = true;
    const rect = btnRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    startOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
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
      const x = Math.max(0, Math.min(window.innerWidth  - 56, clientX - startOffset.current.x));
      const y = Math.max(0, Math.min(window.innerHeight - 56, clientY - startOffset.current.y));
      setPos({ x, y });
    };
    const onMouseMove = (e) => move(e.clientX, e.clientY);
    const onTouchMove = (e) => { const t = e.touches[0]; move(t.clientX, t.clientY); };
    const stop = () => { dragging.current = false; };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   stop);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend",  stop);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   stop);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend",  stop);
    };
  }, []);

  return { pos, btnRef, onMouseDown, onTouchStart };
}

function useTTS() {
  const [speaking,     setSpeaking]     = useState(false);
  const [waitingClick, setWaitingClick] = useState(false);
  const utterRef = useRef(null);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setWaitingClick(false);
    document.querySelectorAll(".a11y-tts-highlight").forEach(el => el.classList.remove("a11y-tts-highlight"));
    document.body.style.cursor = "";
  }, []);

  const startFromHere = useCallback(() => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    stop();
    setWaitingClick(true);
    document.body.style.cursor = "crosshair";
  }, [stop]);

  const speakElement = useCallback((el) => {
    if (!el) return;
    const text = el.innerText || el.textContent;
    if (!text?.trim()) return;

    el.classList.add("a11y-tts-highlight");
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate  = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend   = () => { el.classList.remove("a11y-tts-highlight"); setSpeaking(false); };
    utterance.onerror = () => { el.classList.remove("a11y-tts-highlight"); setSpeaking(false); };
    utterRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    if (!waitingClick) return;
    const onClick = (e) => {
      const target = e.target.closest("p, h1, h2, h3, h4, h5, h6, li, td, th, blockquote, article, section") || e.target;
      setWaitingClick(false);
      document.body.style.cursor = "";
      speakElement(target);
    };
    document.addEventListener("click", onClick, { once: true });
    return () => document.removeEventListener("click", onClick);
  }, [waitingClick, speakElement]);

  return { speaking, waitingClick, startFromHere, stop };
}

function SectionHeader({ icon, title }) {
  return (
    <div style={S.sectionHeader}>
      <span style={S.sectionIcon} aria-hidden="true">{icon}</span>
      <span style={S.sectionTitle}>{title}</span>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange, id }) {
  return (
    <label htmlFor={id} style={S.toggleRow}>
      <div style={S.toggleInfo}>
        <span style={S.toggleLabel}>{label}</span>
        {desc && <span style={S.toggleDesc}>{desc}</span>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        style={{ ...S.toggle, ...(checked ? S.toggleOn : {}) }}
      >
        <span style={{ ...S.toggleThumb, ...(checked ? S.toggleThumbOn : {}) }} />
      </button>
    </label>
  );
}

function ShortcutRow({ keys, desc }) {
  return (
    <div style={S.shortcutRow}>
      <div style={S.shortcutKeys}>
        {keys.map((k, i) => (
          <span key={i}>
            <kbd style={S.kbd}>{k}</kbd>
            {i < keys.length - 1 && <span style={S.kbdPlus}>+</span>}
          </span>
        ))}
      </div>
      <span style={S.shortcutDesc}>{desc}</span>
    </div>
  );
}

export default function AccessibilityPanel() {
  const [open,      setOpen]      = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [settings,  dispatch]     = usePersistedSettings();

  // ── FIXED: mounted guard to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  const panelRef   = useRef(null);
  const triggerRef = useRef(null);

  // ── FIXED: useDrag now uses safe static initial values
  const { pos, btnRef, onMouseDown, onTouchStart } = useDrag({ x: 24, y: 24 });

  const tts = useTTS();

  useApplySettings(settings);
  useGlobalStyles();

  // Set mounted after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.dyslexiaFont) {
      root.style.fontFamily = "'Lexend', sans-serif";
    } else {
      root.style.fontFamily = "";
    }
  }, [settings.dyslexiaFont]);

  useEffect(() => {
    const handler = (e) => {
      if (!e.altKey) return;
      switch (e.key.toLowerCase()) {
        case "a": e.preventDefault(); setOpen(o => !o); break;
        case "d": e.preventDefault(); dispatch({ type: "TOGGLE", key: "dyslexiaFont" }); break;
        case "+":
        case "=": e.preventDefault(); dispatch({ type: "SET", key: "fontSize", value: Math.min(150, settings.fontSize + 10) }); break;
        case "-": e.preventDefault(); dispatch({ type: "SET", key: "fontSize", value: Math.max(80,  settings.fontSize - 10) }); break;
        case "c": e.preventDefault(); dispatch({ type: "TOGGLE", key: "highContrast" }); break;
        case "r": e.preventDefault(); dispatch({ type: "TOGGLE", key: "readingMode" }); break;
        case "s": e.preventDefault(); tts.speaking ? tts.stop() : tts.startFromHere(); break;
      }
      if (e.key === "Escape") { setOpen(false); tts.stop(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [settings.fontSize, tts, dispatch]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    const trap = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener("keydown", trap);
    first?.focus();
    return () => document.removeEventListener("keydown", trap);
  }, [open, activeTab]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!panelRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const activeCount = Object.entries(settings).filter(([k, v]) =>
    k !== "fontSize" && k !== "colorFilter"
      ? v === true
      : k === "fontSize" ? v !== 100 : v !== "none"
  ).length;

  const tabs = [
    { id: "text",    icon: "Aa", label: "Text"    },
    { id: "display", icon: "◑",  label: "Display" },
    { id: "motion",  icon: "⟳",  label: "Motion"  },
    { id: "reading", icon: "📖", label: "Reading" },
    { id: "color",   icon: "◉",  label: "Color"   },
    { id: "keys",    icon: "⌨",  label: "Keys"    },
  ];

  // ── FIXED: don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) return null;

  // ── FIXED: all window references are now safe since we only render client-side
  const panelLeft  = pos.x > window.innerWidth / 2 ? "auto" : `${pos.x}px`;
  const panelRight = pos.x > window.innerWidth / 2 ? `${window.innerWidth - pos.x - 56}px` : "auto";

  return (
    <>
      {tts.waitingClick && (
        <div style={S.ttsBanner} role="alert" aria-live="assertive">
          🎯 Click any paragraph or heading to start reading from there
          <button style={S.ttsBannerClose} onClick={tts.stop} aria-label="Cancel">✕</button>
        </div>
      )}

      {/* Floating trigger */}
      <div
        ref={(el) => { btnRef.current = el; triggerRef.current = el; }}
        style={{
          ...S.floatWrap,
          left: `${pos.x}px`,
          top:  `${pos.y}px`,
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Close accessibility panel" : "Open accessibility panel"}
          aria-expanded={open}
          aria-controls="a11y-panel"
          style={{ ...S.trigger, ...(open ? S.triggerOpen : {}) }}
          title="Accessibility Options (Alt+A)"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="4" r="2"/>
            <path d="M12 6v4M8 10H5l2 8h2l1-4h4l1 4h2l2-8h-3"/>
          </svg>
          {activeCount > 0 && (
            <span style={S.badge} aria-label={`${activeCount} active`}>{activeCount}</span>
          )}
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div
          id="a11y-panel"
          ref={panelRef}
          role="dialog"
          aria-label="Accessibility Settings"
          aria-modal="false"
          style={{
            ...S.panel,
            left:   panelLeft,
            right:  panelRight,
            // ── FIXED: direct window references, safe since mounted
            top:    pos.y > window.innerHeight / 2 ? "auto" : `${pos.y + 64}px`,
            bottom: pos.y > window.innerHeight / 2 ? `${window.innerHeight - pos.y + 8}px` : "auto",
          }}
        >
          {/* Panel header */}
          <div style={S.panelHeader}>
            <div>
              <h2 style={S.panelTitle}>Accessibility</h2>
              <p style={S.panelSub}>Customize your experience</p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {activeCount > 0 && (
                <button
                  style={S.resetBtn}
                  onClick={() => dispatch({ type: "RESET" })}
                  aria-label="Reset all accessibility settings"
                >
                  Reset
                </button>
              )}
              <button
                style={S.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="Close accessibility panel"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div style={S.tabBar} role="tablist" aria-label="Accessibility categories">
            {tabs.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`a11y-tab-${tab.id}`}
                id={`a11y-tab-btn-${tab.id}`}
                style={{ ...S.tab, ...(activeTab === tab.id ? S.tabActive : {}) }}
                onClick={() => setActiveTab(tab.id)}
              >
                <span style={S.tabIcon} aria-hidden="true">{tab.icon}</span>
                <span style={S.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <div style={S.tabContent}>

            {activeTab === "text" && (
              <div id="a11y-tab-text" role="tabpanel" aria-labelledby="a11y-tab-btn-text">
                <SectionHeader icon="✦" title="Text Options" />
                <ToggleRow
                  id="toggle-dyslexia"
                  label="Dyslexia-friendly font"
                  desc="Switches to Lexend — optimised for readability"
                  checked={settings.dyslexiaFont}
                  onChange={() => dispatch({ type: "TOGGLE", key: "dyslexiaFont" })}
                />
                <div style={S.sliderSection}>
                  <div style={S.sliderHeader}>
                    <span style={S.toggleLabel}>Font Size</span>
                    <span style={S.sliderValue}>{settings.fontSize}%</span>
                  </div>
                  <div style={S.sliderTrackWrap}>
                    <button
                      style={S.sliderBtn}
                      aria-label="Decrease font size"
                      onClick={() => dispatch({ type: "SET", key: "fontSize", value: Math.max(80, settings.fontSize - 5) })}
                    >A−</button>
                    <div style={S.sliderWrap}>
                      <input
                        type="range"
                        min={80} max={150} step={5}
                        value={settings.fontSize}
                        onChange={e => dispatch({ type: "SET", key: "fontSize", value: Number(e.target.value) })}
                        aria-label="Font size percentage"
                        aria-valuemin={80}
                        aria-valuemax={150}
                        aria-valuenow={settings.fontSize}
                        aria-valuetext={`${settings.fontSize} percent`}
                        style={S.slider}
                      />
                      <div style={{ ...S.sliderFill, width: `${((settings.fontSize - 80) / 70) * 100}%` }} />
                    </div>
                    <button
                      style={S.sliderBtn}
                      aria-label="Increase font size"
                      onClick={() => dispatch({ type: "SET", key: "fontSize", value: Math.min(150, settings.fontSize + 5) })}
                    >A+</button>
                  </div>
                  {settings.fontSize !== 100 && (
                    <button
                      style={S.smallReset}
                      onClick={() => dispatch({ type: "SET", key: "fontSize", value: 100 })}
                    >
                      Reset to 100%
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === "display" && (
              <div id="a11y-tab-display" role="tabpanel" aria-labelledby="a11y-tab-btn-display">
                <SectionHeader icon="◑" title="Display Options" />
                <ToggleRow
                  id="toggle-contrast"
                  label="High contrast"
                  desc="Dark background, white text"
                  checked={settings.highContrast}
                  onChange={() => dispatch({ type: "TOGGLE", key: "highContrast" })}
                />
                <ToggleRow
                  id="toggle-links"
                  label="Highlight links"
                  desc="Yellow highlight on all links"
                  checked={settings.highlightLinks}
                  onChange={() => dispatch({ type: "TOGGLE", key: "highlightLinks" })}
                />
                <ToggleRow
                  id="toggle-cursor"
                  label="Large cursor"
                  desc="Bigger mouse pointer for visibility"
                  checked={settings.largeCursor}
                  onChange={() => dispatch({ type: "TOGGLE", key: "largeCursor" })}
                />
              </div>
            )}

            {activeTab === "motion" && (
              <div id="a11y-tab-motion" role="tabpanel" aria-labelledby="a11y-tab-btn-motion">
                <SectionHeader icon="⟳" title="Motion" />
                <ToggleRow
                  id="toggle-motion"
                  label="Reduce motion"
                  desc="Disables animations and transitions"
                  checked={settings.reduceMotion}
                  onChange={() => dispatch({ type: "TOGGLE", key: "reduceMotion" })}
                />
                <div style={S.infoBox} role="note">
                  <p style={S.infoText}>
                    Reduce motion respects the <code>prefers-reduced-motion</code> media query.
                    Useful for users with vestibular disorders or motion sensitivity.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "reading" && (
              <div id="a11y-tab-reading" role="tabpanel" aria-labelledby="a11y-tab-btn-reading">
                <SectionHeader icon="📖" title="Reading Features" />
                <ToggleRow
                  id="toggle-reading"
                  label="Reading mode"
                  desc="Dims background content for focus"
                  checked={settings.readingMode}
                  onChange={() => dispatch({ type: "TOGGLE", key: "readingMode" })}
                />
                <div style={S.divider} />
                <div style={S.ttsSection}>
                  <div style={S.toggleInfo}>
                    <span style={S.toggleLabel}>Read from here</span>
                    <span style={S.toggleDesc}>
                      {tts.waitingClick
                        ? "Click any text on the page to start reading"
                        : tts.speaking
                        ? "Reading aloud…"
                        : "Uses browser text-to-speech"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    {!tts.speaking && !tts.waitingClick && (
                      <button
                        style={S.ttsBtn}
                        onClick={() => { setOpen(false); tts.startFromHere(); }}
                        aria-label="Start reading from a selected element"
                      >
                        ▶ Start
                      </button>
                    )}
                    {(tts.speaking || tts.waitingClick) && (
                      <button
                        style={{ ...S.ttsBtn, ...S.ttsBtnStop }}
                        onClick={tts.stop}
                        aria-label="Stop reading"
                      >
                        ■ Stop
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "color" && (
              <div id="a11y-tab-color" role="tabpanel" aria-labelledby="a11y-tab-btn-color">
                <SectionHeader icon="◉" title="Colour Accessibility" />
                <p style={S.colorDesc}>
                  Apply colour filters for different types of colour vision deficiency.
                </p>
                <div style={S.colorGrid} role="radiogroup" aria-label="Colour blindness filter">
                  {COLOR_FILTERS.map(cf => (
                    <button
                      key={cf.value}
                      role="radio"
                      aria-checked={settings.colorFilter === cf.value}
                      style={{
                        ...S.colorChip,
                        ...(settings.colorFilter === cf.value ? S.colorChipActive : {}),
                      }}
                      onClick={() => dispatch({ type: "SET", key: "colorFilter", value: cf.value })}
                    >
                      <span style={{ ...S.colorDot, background: cf.color }} aria-hidden="true" />
                      {cf.label}
                    </button>
                  ))}
                </div>
                <div style={S.infoBox} role="note">
                  <p style={S.infoText}>
                    Filters use SVG colour matrices for accurate simulation. The filter applies to the entire page.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "keys" && (
              <div id="a11y-tab-keys" role="tabpanel" aria-labelledby="a11y-tab-btn-keys">
                <SectionHeader icon="⌨" title="Keyboard Shortcuts" />
                <div style={S.shortcutList} role="list">
                  {KEYBOARD_SHORTCUTS.map((s, i) => (
                    <div key={i} role="listitem">
                      <ShortcutRow keys={s.keys} desc={s.desc} />
                    </div>
                  ))}
                </div>
                <div style={S.infoBox} role="note">
                  <p style={S.infoText}>
                    All shortcuts use <kbd style={S.kbdInline}>Alt</kbd> as modifier to avoid browser conflicts.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Panel footer */}
          <div style={S.panelFooter}>
            <span style={S.footerText}>♿ WCAG 2.1 AA</span>
            <span style={S.footerDot} aria-hidden="true">·</span>
            <span style={S.footerText}>InklusiJobs</span>
          </div>
        </div>
      )}
    </>
  );
}

const S = {
  floatWrap: {
    position:  "fixed",
    zIndex:    10000,
    cursor:    "grab",
    userSelect: "none",
    WebkitUserSelect: "none",
    touchAction: "none",
  },
  trigger: {
    width:  52,
    height: 52,
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg, #1E40AF, #0e7490)",
    color:  "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(14,116,144,0.45), 0 1px 4px rgba(0,0,0,0.2)",
    transition: "transform 0.2s, box-shadow 0.2s",
    position: "relative",
    outline: "none",
  },
  triggerOpen: {
    background: "linear-gradient(135deg, #1E293B, #1E40AF)",
    boxShadow: "0 6px 28px rgba(30,64,175,0.5)",
    transform: "scale(1.06)",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "#f59e0b",
    color: "#1a1a1a",
    fontSize: 10,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #fff",
    fontFamily: "system-ui, sans-serif",
  },
  panel: {
    position:   "fixed",
    zIndex:     9999,
    width:      320,
    maxHeight:  "80vh",
    background: "#ffffff",
    borderRadius: 20,
    boxShadow:  "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.10)",
    border:     "1px solid rgba(30,64,175,0.10)",
    display:    "flex",
    flexDirection: "column",
    overflow:   "hidden",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    animation:  "a11ySlideIn 0.22s cubic-bezier(0.22,1,0.36,1)",
  },
  panelHeader: {
    display:    "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding:    "16px 18px 12px",
    borderBottom: "1px solid #f1f5f9",
    background: "linear-gradient(135deg, #EFF6FF, #F0FDFA)",
  },
  panelTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 700,
    color: "#1E293B",
    letterSpacing: "-0.2px",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  panelSub: {
    margin: "2px 0 0",
    fontSize: 11,
    color: "#64748B",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "none",
    background: "rgba(100,116,139,0.12)",
    color: "#64748B",
    cursor: "pointer",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s",
    fontFamily: "system-ui",
  },
  resetBtn: {
    padding: "4px 10px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#64748B",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    transition: "all 0.15s",
  },
  tabBar: {
    display: "flex",
    borderBottom: "1px solid #f1f5f9",
    overflowX: "auto",
    scrollbarWidth: "none",
    padding: "0 4px",
  },
  tab: {
    flex: "0 0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    padding: "8px 10px 7px",
    border: "none",
    background: "transparent",
    color: "#94A3B8",
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.3px",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    borderBottom: "2px solid transparent",
    transition: "color 0.15s, border-color 0.15s",
    minWidth: 44,
  },
  tabActive: {
    color: "#1E40AF",
    borderBottomColor: "#1E40AF",
  },
  tabIcon:  { fontSize: 14, lineHeight: 1 },
  tabLabel: { fontSize: 9, letterSpacing: "0.4px" },
  tabContent: {
    flex: 1,
    overflowY: "auto",
    padding: "14px 16px",
    scrollbarWidth: "thin",
    scrollbarColor: "#e2e8f0 transparent",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    marginBottom: 12,
  },
  sectionIcon:  { fontSize: 13, color: "#1E40AF" },
  sectionTitle: {
    fontSize: 11, fontWeight: 700, color: "#1E40AF",
    letterSpacing: "0.8px", textTransform: "uppercase",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 0",
    cursor: "pointer",
    borderBottom: "1px solid #f8fafc",
  },
  toggleInfo: { display: "flex", flexDirection: "column", gap: 2, flex: 1 },
  toggleLabel: {
    fontSize: 13, fontWeight: 600, color: "#1E293B",
    fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.3,
  },
  toggleDesc: {
    fontSize: 11, color: "#94A3B8",
    fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.4,
  },
  toggle: {
    width: 38, height: 22, borderRadius: 11, border: "none",
    background: "#e2e8f0", cursor: "pointer", position: "relative",
    flexShrink: 0, transition: "background 0.22s", padding: 0,
  },
  toggleOn:    { background: "linear-gradient(135deg, #1E40AF, #0e7490)" },
  toggleThumb: {
    position: "absolute", top: 3, left: 3,
    width: 16, height: 16, borderRadius: "50%",
    background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    transition: "left 0.22s cubic-bezier(0.4,0,0.2,1)", display: "block",
  },
  toggleThumbOn: { left: 19 },
  sliderSection: { padding: "12px 0 4px", borderBottom: "1px solid #f8fafc" },
  sliderHeader:  { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sliderValue:   { fontSize: 12, fontWeight: 700, color: "#1E40AF", fontFamily: "monospace" },
  sliderTrackWrap: { display: "flex", alignItems: "center", gap: 8 },
  sliderBtn: {
    width: 32, height: 28, borderRadius: 8,
    border: "1.5px solid #e2e8f0", background: "#fff",
    color: "#64748B", fontSize: 10, fontWeight: 700,
    cursor: "pointer", flexShrink: 0, fontFamily: "system-ui",
    transition: "border-color 0.15s",
  },
  sliderWrap: {
    flex: 1, position: "relative", height: 20,
    display: "flex", alignItems: "center",
  },
  slider: {
    width: "100%", appearance: "none", WebkitAppearance: "none",
    height: 4, borderRadius: 2, background: "#e2e8f0",
    outline: "none", cursor: "pointer", position: "relative", zIndex: 2,
  },
  sliderFill: {
    position: "absolute", left: 0, height: 4,
    background: "linear-gradient(90deg, #1E40AF, #0e7490)",
    borderRadius: 2, pointerEvents: "none", zIndex: 1, transition: "width 0.1s",
  },
  smallReset: {
    marginTop: 6, background: "none", border: "none",
    color: "#94A3B8", fontSize: 10, cursor: "pointer",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    padding: 0, textDecoration: "underline",
  },
  colorDesc: {
    fontSize: 12, color: "#64748B", marginBottom: 12,
    lineHeight: 1.5, fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  colorGrid:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 },
  colorChip: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 12px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", background: "#fff",
    cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#1E293B",
    fontFamily: "'DM Sans', system-ui, sans-serif", transition: "all 0.15s",
  },
  colorChipActive: { border: "1.5px solid #1E40AF", background: "#EFF6FF", color: "#1E40AF" },
  colorDot:        { width: 12, height: 12, borderRadius: "50%", flexShrink: 0 },
  ttsSection:      { padding: "10px 0" },
  ttsBtn: {
    padding: "8px 16px", borderRadius: 10, border: "none",
    background: "linear-gradient(135deg, #1E40AF, #0e7490)",
    color: "#fff", fontSize: 12, fontWeight: 700,
    cursor: "pointer", fontFamily: "'DM Sans', system-ui, sans-serif",
    transition: "opacity 0.15s",
  },
  ttsBtnStop: { background: "linear-gradient(135deg, #dc2626, #b91c1c)" },
  ttsBanner: {
    position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
    zIndex: 10001, background: "#1E293B", color: "#fff",
    padding: "10px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    display: "flex", alignItems: "center", gap: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)", whiteSpace: "nowrap",
  },
  ttsBannerClose: {
    background: "rgba(255,255,255,0.15)", border: "none",
    color: "#fff", cursor: "pointer", borderRadius: 6,
    width: 22, height: 22, fontSize: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  shortcutList:  { display: "flex", flexDirection: "column", gap: 2 },
  shortcutRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 8, padding: "8px 0", borderBottom: "1px solid #f8fafc",
  },
  shortcutKeys:  { display: "flex", alignItems: "center", gap: 4, flexShrink: 0 },
  kbd: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    padding: "2px 7px", borderRadius: 5, background: "#1E293B",
    color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "monospace",
    border: "1px solid #334155", boxShadow: "0 2px 0 #0f172a",
    minWidth: 24, lineHeight: 1.4,
  },
  kbdInline: {
    display: "inline-flex", alignItems: "center",
    padding: "1px 5px", borderRadius: 4, background: "#f1f5f9",
    color: "#1E293B", fontSize: 10, fontWeight: 700, fontFamily: "monospace",
    border: "1px solid #e2e8f0", boxShadow: "0 1px 0 #cbd5e1",
  },
  kbdPlus:      { fontSize: 10, color: "#94A3B8", margin: "0 2px", fontFamily: "system-ui" },
  shortcutDesc: {
    fontSize: 11, color: "#64748B", textAlign: "right",
    fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.4,
  },
  infoBox: {
    marginTop: 12, padding: "10px 12px",
    background: "#F8FAFC", borderRadius: 10, border: "1px solid #e2e8f0",
  },
  infoText: {
    margin: 0, fontSize: 11, color: "#64748B",
    lineHeight: 1.6, fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  divider: { height: 1, background: "#f1f5f9", margin: "8px 0" },
  panelFooter: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 6, padding: "8px 16px",
    borderTop: "1px solid #f1f5f9", background: "#fafafa",
  },
  footerText: { fontSize: 10, color: "#CBD5E1", fontFamily: "'DM Sans', system-ui, sans-serif" },
  footerDot:  { color: "#CBD5E1", fontSize: 10 },
};