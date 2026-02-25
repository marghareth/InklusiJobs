/**
 * AccessibilityPanel.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Production-ready floating accessibility panel for React applications.
 *
 * FEATURES:
 *   • Draggable floating trigger button (mouse + touch)
 *   • Compact popup panel — never fullscreen, never blocking
 *   • Tabbed interface: Text · Display · Color · Read · Shortcuts
 *   • Dyslexia-friendly font (OpenDyslexic via CDN, on-demand)
 *   • Font size slider 70–160% (scales root font → all em/rem units)
 *   • High contrast (CSS invert + hue-rotate, images counter-inverted)
 *   • Highlight links (vivid yellow outline on all <a> tags)
 *   • Large cursor (SVG data-URI cursor)
 *   • Reduce motion (collapses all animation/transition durations)
 *   • Reading mode (centres content, dims non-content elements)
 *   • Read-from-here (SpeechSynthesis API, click-to-start, word highlighting)
 *   • Color blindness filters (protanopia / deuteranopia / tritanopia / greyscale)
 *   • Keyboard shortcuts panel with full global shortcut support
 *   • All settings persisted in localStorage
 *   • Full ARIA — dialog, tablist, switch, radio, live regions
 *   • Focus trap inside open panel; focus returns to trigger on close
 *   • Tab/Arrow key navigation; Escape closes
 *   • WCAG 2.1 AA compliant
 *
 * USAGE:
 *   import AccessibilityPanel from './AccessibilityPanel';
 *   // Place once in your app root — renders everything via portal
 *   <AccessibilityPanel />
 *
 * NO EXTERNAL DEPENDENCIES beyond React itself.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  useState, useEffect, useRef, useCallback, useReducer, createContext, useContext,
} from 'react';
import { createPortal } from 'react-dom';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. CONSTANTS & DEFAULTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const LS_KEY = 'a11y_panel_v1';

const DEFAULT_SETTINGS = {
  dyslexiaFont:   false,
  fontSize:       100,        // % of root font-size
  highContrast:   false,
  highlightLinks: false,
  largeCursor:    false,
  reduceMotion:   false,
  readingMode:    false,
  colorFilter:    'none',     // none | protanopia | deuteranopia | tritanopia | greyscale
};

const COLOR_FILTERS = [
  { id: 'none',          label: 'None',                     desc: 'No filter applied' },
  { id: 'protanopia',    label: 'Protanopia',               desc: 'Red-blind (~1% of males)' },
  { id: 'deuteranopia',  label: 'Deuteranopia',             desc: 'Green-blind (~6% of males)' },
  { id: 'tritanopia',    label: 'Tritanopia',               desc: 'Blue-blind (very rare)' },
  { id: 'greyscale',     label: 'Greyscale',                desc: 'All colour removed' },
];

// SVG feColorMatrix values — LMS-space colour vision deficiency matrices
const CVD_MATRICES = {
  protanopia:   '0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0',
  deuteranopia: '0.625 0.375 0 0 0  0.700 0.300 0 0 0  0 0.300 0.700 0 0  0 0 0 1 0',
  tritanopia:   '0.950 0.050 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0',
};

const TABS = [
  { id: 'text',     label: 'Text',      icon: '𝐓'  },
  { id: 'display',  label: 'Display',   icon: '◑'  },
  { id: 'color',    label: 'Color',     icon: '◕'  },
  { id: 'read',     label: 'Read',      icon: '▶'  },
  { id: 'keys',     label: 'Keys',      icon: '⌨'  },
];

const SHORTCUTS = [
  { combo: ['Alt', 'A'],  action: 'Open / close accessibility panel'  },
  { combo: ['Alt', 'D'],  action: 'Toggle dyslexia-friendly font'      },
  { combo: ['Alt', '+'],  action: 'Increase font size'                 },
  { combo: ['Alt', '−'],  action: 'Decrease font size'                 },
  { combo: ['Alt', 'C'],  action: 'Toggle high contrast'               },
  { combo: ['Alt', 'R'],  action: 'Toggle reading mode'                },
  { combo: ['Alt', 'S'],  action: 'Start / stop text-to-speech'        },
  { combo: ['Esc'],       action: 'Close panel / stop speech'          },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. SETTINGS REDUCER + CONTEXT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function loadSettings() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch { return { ...DEFAULT_SETTINGS }; }
}

function settingsReducer(state, action) {
  switch (action.type) {
    case 'SET':   return { ...state, [action.key]: action.value };
    case 'RESET': return { ...DEFAULT_SETTINGS };
    default:      return state;
  }
}

const SettingsCtx = createContext(null);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. INJECT GLOBAL STYLES (called once)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function injectStyles() {
  if (document.getElementById('a11y-styles')) return;
  const style = document.createElement('style');
  style.id = 'a11y-styles';
  style.textContent = `
    /* ── High Contrast ─────────────────────────────────────────────────────── */
    html.a11y-high-contrast body {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    /* Counter-invert media so images/videos look natural */
    html.a11y-high-contrast img,
    html.a11y-high-contrast video,
    html.a11y-high-contrast canvas,
    html.a11y-high-contrast [data-a11y-exempt] {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* ── Highlight Links ───────────────────────────────────────────────────── */
    html.a11y-highlight-links a,
    html.a11y-highlight-links a:visited {
      background-color: #ffff00 !important;
      color: #000000 !important;
      text-decoration: underline !important;
      outline: 2.5px solid #cc6600 !important;
      outline-offset: 2px !important;
      border-radius: 2px !important;
      padding: 0 2px !important;
    }

    /* ── Large Cursor ──────────────────────────────────────────────────────── */
    html.a11y-large-cursor,
    html.a11y-large-cursor * {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M8 8 L8 38 L16 30 L22 44 L27 42 L21 28 L34 28 Z' fill='%23000' stroke='%23fff' stroke-width='2.5' stroke-linejoin='round'/%3E%3C/svg%3E") 8 8, auto !important;
    }

    /* ── Reduce Motion ─────────────────────────────────────────────────────── */
    html.a11y-reduce-motion *,
    html.a11y-reduce-motion *::before,
    html.a11y-reduce-motion *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      transition-delay: 0ms !important;
      scroll-behavior: auto !important;
    }

    /* ── Reading Mode ──────────────────────────────────────────────────────── */
    html.a11y-reading-mode body > *:not(main):not(article):not(#root):not(#__next):not([data-a11y-exempt]) {
      opacity: 0.07 !important;
      pointer-events: none !important;
      user-select: none !important;
    }
    html.a11y-reading-mode main,
    html.a11y-reading-mode article,
    html.a11y-reading-mode #root > *,
    html.a11y-reading-mode #__next > * {
      max-width: 700px !important;
      margin-left: auto !important;
      margin-right: auto !important;
      padding: 2rem !important;
      line-height: 1.9 !important;
    }

    /* ── TTS Word Highlight ────────────────────────────────────────────────── */
    .a11y-tts-word {
      background: #fde68a !important;
      color: #000 !important;
      border-radius: 3px !important;
      outline: 2px solid #f59e0b !important;
    }
  `;
  document.head.appendChild(style);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. INJECT SVG COLOR FILTER DEFS (hidden, referenced by CSS filter)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ColorFilterDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {Object.entries(CVD_MATRICES).map(([id, matrix]) => (
          <filter key={id} id={`a11y-filter-${id}`} colorInterpolationFilters="linearRGB">
            <feColorMatrix type="matrix" values={matrix} />
          </filter>
        ))}
        <filter id="a11y-filter-greyscale">
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
    </svg>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. HOOK: APPLY ALL SETTINGS TO DOM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function useApplySettings(settings) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // ── Font size (root → cascade) ──
    html.style.fontSize = `${settings.fontSize}%`;

    // ── Dyslexia font ──
    if (settings.dyslexiaFont) {
      if (!document.getElementById('a11y-od-font')) {
        const link = Object.assign(document.createElement('link'), {
          id: 'a11y-od-font', rel: 'stylesheet',
          href: 'https://fonts.cdnfonts.com/css/opendyslexic',
        });
        document.head.appendChild(link);
      }
      body.style.setProperty('font-family', '"OpenDyslexic", cursive', 'important');
      body.style.letterSpacing = '0.05em';
      body.style.lineHeight    = '1.85';
      body.style.wordSpacing   = '0.12em';
    } else {
      body.style.removeProperty('font-family');
      body.style.letterSpacing = '';
      body.style.lineHeight    = '';
      body.style.wordSpacing   = '';
    }

    // ── Class-based flags ──
    const flags = {
      'a11y-high-contrast':   settings.highContrast,
      'a11y-highlight-links': settings.highlightLinks,
      'a11y-large-cursor':    settings.largeCursor,
      'a11y-reduce-motion':   settings.reduceMotion,
      'a11y-reading-mode':    settings.readingMode,
    };
    for (const [cls, active] of Object.entries(flags)) {
      html.classList.toggle(cls, active);
    }

    // ── Color blindness filter ──
    body.style.filter = settings.colorFilter !== 'none'
      ? `url(#a11y-filter-${settings.colorFilter})`
      : '';
  }, [settings]);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. HOOK: DRAGGABLE BUTTON
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function useDraggable() {
  const btnSize = 56;
  const [pos, setPos] = useState(() => ({
    x: (typeof window !== 'undefined' ? window.innerWidth  : 800) - btnSize - 16,
    y: (typeof window !== 'undefined' ? window.innerHeight : 600) - btnSize - 16,
  }));

  const dragging = useRef(false);
  const hasDragged = useRef(false);
  const offset  = useRef({ x: 0, y: 0 });
  const ref     = useRef(null);

  const startDrag = useCallback((clientX, clientY) => {
    dragging.current  = true;
    hasDragged.current = false;
    offset.current = {
      x: clientX - pos.x,
      y: clientY - pos.y,
    };
  }, [pos]);

  useEffect(() => {
    const move = (clientX, clientY) => {
      if (!dragging.current) return;
      hasDragged.current = true;
      const el = ref.current;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const bw = el ? el.offsetWidth  : btnSize;
      const bh = el ? el.offsetHeight : btnSize;
      setPos({
        x: Math.max(0, Math.min(W - bw, clientX - offset.current.x)),
        y: Math.max(0, Math.min(H - bh, clientY - offset.current.y)),
      });
    };
    const onMouseMove  = (e) => move(e.clientX, e.clientY);
    const onTouchMove  = (e) => { const t = e.touches[0]; move(t.clientX, t.clientY); };
    const stopDrag     = () => { dragging.current = false; };

    window.addEventListener('mousemove',  onMouseMove);
    window.addEventListener('mouseup',    stopDrag);
    window.addEventListener('touchmove',  onTouchMove, { passive: true });
    window.addEventListener('touchend',   stopDrag);
    return () => {
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('mouseup',    stopDrag);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('touchend',   stopDrag);
    };
  }, []);

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  }, [startDrag]);

  const onTouchStart = useCallback((e) => {
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  }, [startDrag]);

  return { pos, ref, onMouseDown, onTouchStart, hasDragged };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. HOOK: SPEECH SYNTHESIS (TTS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function useTTS() {
  const [state, setState] = useState({ speaking: false, pickMode: false });
  const highlightedEls    = useRef([]);

  const clearHighlights = useCallback(() => {
    highlightedEls.current.forEach(el => el.classList.remove('a11y-tts-word'));
    highlightedEls.current = [];
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setState({ speaking: false, pickMode: false });
    clearHighlights();
    document.body.style.cursor = '';
  }, [clearHighlights]);

  // Read page content starting from a given DOM element
  const readFrom = useCallback((startEl) => {
    stop();
    if (!window.speechSynthesis) {
      alert('Sorry — your browser does not support the Web Speech API.\nTry Chrome, Edge, or Safari.');
      return;
    }

    // Collect all visible text nodes that appear at or after startEl
    const allNodes = [];
    let   found    = false;
    const walker   = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (node.parentElement?.closest('[data-a11y-exempt]')) return NodeFilter.FILTER_REJECT;
          const el = node.parentElement;
          if (!el || !el.offsetParent) return NodeFilter.FILTER_SKIP;
          if (node.textContent.trim() === '') return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      if (!found && (node.parentElement === startEl || startEl.contains(node.parentElement))) {
        found = true;
      }
      if (found) allNodes.push(node);
    }

    if (!allNodes.length) return;

    const fullText = allNodes.map(n => n.textContent).join(' ');
    const utt      = new SpeechSynthesisUtterance(fullText);
    utt.rate       = 0.92;
    utt.pitch      = 1.0;
    utt.lang       = document.documentElement.lang || navigator.language || 'en-US';

    let charOffset = 0;
    utt.onboundary = (e) => {
      if (e.name !== 'word') return;
      clearHighlights();
      let running = 0;
      for (const n of allNodes) {
        const len = n.textContent.length + 1;
        if (running + len > e.charIndex) {
          const el = n.parentElement;
          if (el) {
            el.classList.add('a11y-tts-word');
            highlightedEls.current.push(el);
            el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
          break;
        }
        running += len;
      }
    };

    utt.onend   = () => { setState(s => ({ ...s, speaking: false })); clearHighlights(); };
    utt.onerror = () => { setState(s => ({ ...s, speaking: false })); clearHighlights(); };

    window.speechSynthesis.speak(utt);
    setState({ speaking: true, pickMode: false });
  }, [stop, clearHighlights]);

  // Activate "click anywhere to start reading" mode
  const activatePickMode = useCallback(() => {
    if (state.speaking) { stop(); return; }
    setState(s => ({ ...s, pickMode: true }));
    document.body.style.cursor = 'crosshair';
  }, [state.speaking, stop]);

  // Listen for element click while in pick mode
  useEffect(() => {
    if (!state.pickMode) return;
    const onClick = (e) => {
      const target = e.target.closest(
        'p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, section, article, main'
      );
      if (!target || target.closest('[data-a11y-exempt]')) return;
      e.preventDefault();
      e.stopPropagation();
      document.body.style.cursor = '';
      readFrom(target);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [state.pickMode, readFrom]);

  // Escape cancels pick mode
  useEffect(() => {
    if (!state.speaking && !state.pickMode) return;
    const onKey = (e) => { if (e.key === 'Escape') stop(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.speaking, state.pickMode, stop]);

  return { ...state, activatePickMode, stop };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. DESIGN TOKENS — clean, high-contrast panel UI
//    (Not affected by page-level contrast/filter because it's data-a11y-exempt)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const T = {
  // Surfaces
  bg:          '#ffffff',
  bgSubtle:    '#f7f7f6',
  bgHover:     '#f0f0ef',
  // Borders
  border:      '#e2e1df',
  borderFocus: '#0070f3',
  // Text
  textPrimary: '#1a1918',
  textSecondary:'#6b6868',
  textMuted:   '#9b9997',
  // Accent (blue — accessible on white: contrast 4.7:1)
  accent:      '#0070f3',
  accentDim:   '#e8f0fe',
  // Success green for "on" toggles
  toggleOn:    '#16a34a',
  // Font
  fontUI:      '"DM Sans", "Segoe UI", system-ui, sans-serif',
  fontMono:    '"DM Mono", "Fira Code", monospace',
  // Shadows
  shadow:      '0 4px 6px -1px rgba(0,0,0,.07), 0 10px 30px -5px rgba(0,0,0,.12)',
  shadowSm:    '0 1px 3px rgba(0,0,0,.08)',
  // Radius
  radius:      12,
  radiusSm:    7,
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 9. PRIMITIVE COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Accessible on/off toggle switch */
function Toggle({ id, checked, onChange, label, description }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, padding: '9px 0',
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <label
          htmlFor={id}
          style={{
            display: 'block', fontSize: 13.5, fontWeight: 550,
            color: T.textPrimary, cursor: 'pointer', lineHeight: 1.3,
          }}
        >
          {label}
        </label>
        {description && (
          <p style={{
            margin: '2px 0 0', fontSize: 11.5, color: T.textSecondary, lineHeight: 1.4,
          }}>
            {description}
          </p>
        )}
      </div>

      {/* The actual toggle — uses button role="switch" for correct ARIA semantics */}
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        style={{
          flexShrink: 0,
          width: 42, height: 24, borderRadius: 12,
          border: 'none',
          background: checked ? T.toggleOn : '#d1d1ce',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.22s ease',
          outline: 'none',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
        }}
        onFocus={e  => e.target.style.boxShadow = `0 0 0 3px ${T.accentDim}, inset 0 0 0 1px rgba(0,0,0,0.1)`}
        onBlur={e   => e.target.style.boxShadow = 'inset 0 0 0 1px rgba(0,0,0,0.1)'}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 3, left: checked ? 21 : 3,
            width: 18, height: 18, borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
            transition: 'left 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </button>
    </div>
  );
}

/** Section heading inside a tab panel */
function SectionHead({ children }) {
  return (
    <p style={{
      margin: '0 0 10px',
      fontSize: 10, fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      color: T.textMuted,
    }}>
      {children}
    </p>
  );
}

/** Keyboard key display */
function Key({ children }) {
  return (
    <kbd style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 28, padding: '2px 6px',
      borderRadius: 5,
      background: T.bgSubtle,
      border: `1px solid ${T.border}`,
      borderBottom: `2px solid ${T.border}`,
      fontSize: 11, fontFamily: T.fontMono, fontWeight: 700,
      color: T.textPrimary, whiteSpace: 'nowrap',
    }}>
      {children}
    </kbd>
  );
}

/** Small action button */
function ActionBtn({ onClick, children, variant = 'default', style: extraStyle = {} }) {
  const variants = {
    default: { bg: T.bgSubtle, border: T.border, color: T.textPrimary },
    primary: { bg: T.accent,   border: T.accent,  color: '#fff'        },
    danger:  { bg: '#fef2f2',  border: '#fca5a5', color: '#dc2626'     },
    warning: { bg: '#fffbeb',  border: '#fcd34d', color: '#b45309'     },
  };
  const v = variants[variant] || variants.default;

  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px', borderRadius: T.radiusSm,
        border: `1.5px solid ${v.border}`,
        background: v.bg, color: v.color,
        fontSize: 12.5, fontWeight: 600,
        fontFamily: T.fontUI, cursor: 'pointer',
        transition: 'opacity 0.15s',
        ...extraStyle,
      }}
      onMouseEnter={e => e.target.style.opacity = '0.8'}
      onMouseLeave={e => e.target.style.opacity = '1'}
      onFocus={e  => e.target.style.outline = `2.5px solid ${T.borderFocus}`}
      onBlur={e   => e.target.style.outline = 'none'}
    >
      {children}
    </button>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 10. TAB PANEL CONTENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function TextPanel() {
  const { settings, dispatch } = useContext(SettingsCtx);
  const set = (k, v) => dispatch({ type: 'SET', key: k, value: v });

  return (
    <div>
      <SectionHead>Typography</SectionHead>

      <Toggle
        id="a11y-toggle-dyslexia"
        label="Dyslexia-friendly font"
        description="Switches to OpenDyslexic — proven to help some readers with dyslexia"
        checked={settings.dyslexiaFont}
        onChange={v => set('dyslexiaFont', v)}
      />

      {/* Font Size Slider */}
      <div style={{ padding: '14px 0', borderBottom: `1px solid ${T.border}` }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 10,
        }}>
          <span style={{ fontSize: 13.5, fontWeight: 550, color: T.textPrimary }}>
            Font size
          </span>
          <span style={{
            fontSize: 12, fontWeight: 700,
            color: T.accent,
            background: T.accentDim,
            padding: '2px 8px', borderRadius: 20,
          }}>
            {settings.fontSize}%
          </span>
        </div>

        {/* A− ────[slider]──── A+ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            aria-label="Decrease font size by 5%"
            onClick={() => set('fontSize', Math.max(70, settings.fontSize - 5))}
            style={{
              width: 34, height: 28, borderRadius: T.radiusSm,
              border: `1px solid ${T.border}`,
              background: T.bgSubtle,
              fontSize: 12, fontWeight: 800, cursor: 'pointer',
              color: T.textPrimary,
            }}
          >
            A−
          </button>

          <input
            type="range"
            min={70} max={160} step={5}
            value={settings.fontSize}
            onChange={e => set('fontSize', Number(e.target.value))}
            aria-label={`Font size: ${settings.fontSize}%`}
            aria-valuemin={70} aria-valuemax={160}
            aria-valuenow={settings.fontSize}
            aria-valuetext={`${settings.fontSize}% of normal size`}
            style={{
              flex: 1, cursor: 'pointer',
              accentColor: T.accent, height: 4,
            }}
          />

          <button
            aria-label="Increase font size by 5%"
            onClick={() => set('fontSize', Math.min(160, settings.fontSize + 5))}
            style={{
              width: 34, height: 28, borderRadius: T.radiusSm,
              border: `1px solid ${T.border}`,
              background: T.bgSubtle,
              fontSize: 14, fontWeight: 800, cursor: 'pointer',
              color: T.textPrimary,
            }}
          >
            A+
          </button>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 10, color: T.textMuted, marginTop: 5,
        }}>
          <span>70% (small)</span>
          <span>100% (normal)</span>
          <span>160% (large)</span>
        </div>
      </div>

      <div style={{ paddingTop: 14, textAlign: 'right' }}>
        <ActionBtn
          onClick={() => {
            set('dyslexiaFont', false);
            set('fontSize', 100);
          }}
          variant="default"
        >
          Reset text
        </ActionBtn>
      </div>
    </div>
  );
}

function DisplayPanel() {
  const { settings, dispatch } = useContext(SettingsCtx);
  const set = (k, v) => dispatch({ type: 'SET', key: k, value: v });

  const toggles = [
    {
      id: 'a11y-toggle-contrast',
      key: 'highContrast',
      label: 'High contrast',
      description: 'Inverts page colours for maximum contrast between text and background',
    },
    {
      id: 'a11y-toggle-links',
      key: 'highlightLinks',
      label: 'Highlight links',
      description: 'Applies a vivid yellow outline to every hyperlink on the page',
    },
    {
      id: 'a11y-toggle-cursor',
      key: 'largeCursor',
      label: 'Large cursor',
      description: 'Replaces the system mouse cursor with a larger, easier-to-track arrow',
    },
    {
      id: 'a11y-toggle-motion',
      key: 'reduceMotion',
      label: 'Reduce motion',
      description: 'Disables all CSS animations and transitions across the entire page',
    },
    {
      id: 'a11y-toggle-reading',
      key: 'readingMode',
      label: 'Reading mode',
      description: 'Dims non-content elements and centres the main text column',
    },
  ];

  return (
    <div>
      <SectionHead>Visual Display</SectionHead>
      {toggles.map(({ id, key, label, description }) => (
        <Toggle
          key={id}
          id={id}
          label={label}
          description={description}
          checked={settings[key]}
          onChange={v => set(key, v)}
        />
      ))}
    </div>
  );
}

function ColorPanel() {
  const { settings, dispatch } = useContext(SettingsCtx);
  const set = (k, v) => dispatch({ type: 'SET', key: k, value: v });

  return (
    <div>
      <SectionHead>Color Vision Filter</SectionHead>
      <p style={{ fontSize: 12, color: T.textSecondary, marginBottom: 14, lineHeight: 1.55 }}>
        Applies a page-wide SVG matrix filter to simulate or compensate for colour vision differences.
      </p>

      <div
        role="radiogroup"
        aria-label="Color blindness filter"
        style={{ display: 'flex', flexDirection: 'column', gap: 5 }}
      >
        {COLOR_FILTERS.map(({ id, label, desc }) => {
          const active = settings.colorFilter === id;
          return (
            <button
              key={id}
              role="radio"
              aria-checked={active}
              onClick={() => set('colorFilter', id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: T.radiusSm,
                border: `1.5px solid ${active ? T.accent : T.border}`,
                background: active ? T.accentDim : T.bg,
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s',
                outline: 'none',
              }}
              onFocus={e  => !active && (e.target.style.borderColor = T.borderFocus)}
              onBlur={e   => !active && (e.target.style.borderColor = T.border)}
            >
              {/* Radio dot */}
              <span style={{
                width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${active ? T.accent : '#c0bfbd'}`,
                background: active ? T.accent : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {active && (
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#fff',
                  }} />
                )}
              </span>
              <div>
                <span style={{
                  display: 'block',
                  fontSize: 13, fontWeight: active ? 650 : 500,
                  color: active ? T.accent : T.textPrimary,
                }}>
                  {label}
                </span>
                <span style={{ fontSize: 11, color: T.textSecondary }}>{desc}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReadPanel({ tts }) {
  const supported = typeof window !== 'undefined' && !!window.speechSynthesis;

  return (
    <div>
      <SectionHead>Text to Speech</SectionHead>

      {!supported ? (
        <div style={{
          padding: 14, borderRadius: T.radiusSm,
          background: '#fef2f2', border: `1px solid #fca5a5`,
          fontSize: 13, color: '#dc2626', lineHeight: 1.55,
        }}>
          ⚠ The Web Speech API is not available in your browser.
          Try Chrome, Edge, or Safari for TTS support.
        </div>
      ) : (
        <>
          {/* Status message — live region so screen readers announce state changes */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            style={{
              fontSize: 12.5, color: T.textSecondary,
              lineHeight: 1.6, marginBottom: 14,
              padding: '10px 12px',
              background: T.bgSubtle,
              borderRadius: T.radiusSm,
              border: `1px solid ${T.border}`,
            }}
          >
            {tts.pickMode
              ? '👆 Click any paragraph, heading or list item on the page to start reading from there. Press Esc to cancel.'
              : tts.speaking
              ? '🔊 Reading aloud — words are highlighted as they are spoken. Press Esc or click Stop to end.'
              : '▶ Click "Read from here", then click any text element on the page to begin reading from that point.'}
          </div>

          {tts.speaking ? (
            <ActionBtn
              onClick={tts.stop}
              variant="danger"
              style={{ width: '100%', padding: '10px 0', fontSize: 13 }}
            >
              ⏹ Stop reading
            </ActionBtn>
          ) : (
            <ActionBtn
              onClick={tts.activatePickMode}
              variant={tts.pickMode ? 'warning' : 'primary'}
              style={{ width: '100%', padding: '10px 0', fontSize: 13 }}
            >
              {tts.pickMode ? '✕ Cancel — waiting for click' : '▶ Read from here'}
            </ActionBtn>
          )}

          <div style={{
            marginTop: 16, padding: '12px 14px',
            borderRadius: T.radiusSm,
            background: T.accentDim,
            border: `1px solid #c7d7f8`,
            fontSize: 12, color: T.textSecondary, lineHeight: 1.7,
          }}>
            <strong style={{ color: T.accent, display: 'block', marginBottom: 4 }}>
              How "Read from here" works
            </strong>
            <ol style={{ margin: 0, paddingLeft: 16 }}>
              <li>Click the button above</li>
              <li>Your cursor changes to a crosshair</li>
              <li>Click any text block on the page</li>
              <li>Speech starts there; each word is highlighted in yellow as it is read</li>
              <li>Press <strong>Esc</strong> to stop at any time</li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
}

function KeysPanel() {
  return (
    <div>
      <SectionHead>Global keyboard shortcuts</SectionHead>
      <p style={{ fontSize: 12, color: T.textSecondary, marginBottom: 12, lineHeight: 1.55 }}>
        These work from anywhere on the page — no need to open the panel first.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {SHORTCUTS.map(({ combo, action }) => (
          <div
            key={action}
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: 8,
              padding: '8px 0',
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <span style={{ fontSize: 12.5, color: T.textPrimary, flex: 1, lineHeight: 1.4 }}>
              {action}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
              {combo.map((k, i) => (
                <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Key>{k}</Key>
                  {i < combo.length - 1 && (
                    <span style={{ fontSize: 10, color: T.textMuted }}>+</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 11. PANEL POPUP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function Panel({ triggerPos, onClose, tts }) {
  const [activeTab, setActiveTab] = useState('text');
  const { settings, dispatch } = useContext(SettingsCtx);
  const panelRef   = useRef(null);
  const firstFocus = useRef(null);

  // Count active features for the badge
  const activeCount = [
    settings.dyslexiaFont,
    settings.fontSize !== 100,
    settings.highContrast,
    settings.highlightLinks,
    settings.largeCursor,
    settings.reduceMotion,
    settings.readingMode,
    settings.colorFilter !== 'none',
  ].filter(Boolean).length;

  // Smart placement: keep panel on screen
  const panelW = 320;
  const panelH = 520;
  const margin = 12;
  const left = Math.min(
    triggerPos.x + 64,
    window.innerWidth - panelW - margin
  );
  const top = Math.min(
    Math.max(triggerPos.y - 80, margin),
    window.innerHeight - panelH - margin
  );

  // Autofocus + focus trap
  useEffect(() => {
    firstFocus.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;

      const focusable = [...panelRef.current.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex="0"], [role="switch"], [role="radio"], [role="tab"]'
      )].filter(el => el.offsetParent !== null);

      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const PANEL_CONTENTS = {
    text:    <TextPanel />,
    display: <DisplayPanel />,
    color:   <ColorPanel />,
    read:    <ReadPanel tts={tts} />,
    keys:    <KeysPanel />,
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Accessibility settings"
      aria-modal="true"
      data-a11y-exempt=""
      style={{
        position: 'fixed',
        left, top,
        width: panelW,
        maxHeight: panelH,
        zIndex: 2147483647,
        display: 'flex', flexDirection: 'column',
        borderRadius: T.radius,
        background: T.bg,
        boxShadow: T.shadow,
        border: `1px solid ${T.border}`,
        fontFamily: T.fontUI,
        overflow: 'hidden',
        // Subtle slide-in
        animation: 'a11y-panel-in 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;550;600;700&family=DM+Mono:wght@500;700&display=swap');
        @keyframes a11y-panel-in {
          from { opacity: 0; transform: translateY(6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 16px 11px',
        borderBottom: `1px solid ${T.border}`,
        background: T.bgSubtle, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }} aria-hidden="true">♿</span>
          <span style={{
            fontSize: 14, fontWeight: 700,
            color: T.textPrimary, letterSpacing: '-0.015em',
          }}>
            Accessibility
          </span>
          {activeCount > 0 && (
            <span
              aria-label={`${activeCount} feature${activeCount > 1 ? 's' : ''} active`}
              style={{
                fontSize: 10, fontWeight: 700,
                color: T.accent, background: T.accentDim,
                padding: '2px 7px', borderRadius: 20,
                border: `1px solid #c7d7f8`,
              }}
            >
              {activeCount} on
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            title="Reset all settings to defaults"
            aria-label="Reset all accessibility settings"
            ref={firstFocus}
            style={{
              padding: '4px 10px', borderRadius: T.radiusSm,
              border: `1px solid ${T.border}`,
              background: T.bg, color: T.textSecondary,
              fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Reset all
          </button>
          <button
            onClick={onClose}
            aria-label="Close accessibility panel (Escape)"
            title="Close (Esc)"
            style={{
              width: 28, height: 28, borderRadius: '50%',
              border: `1px solid ${T.border}`,
              background: T.bg, color: T.textSecondary,
              cursor: 'pointer', fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div
        role="tablist"
        aria-label="Accessibility feature categories"
        style={{
          display: 'flex',
          borderBottom: `1px solid ${T.border}`,
          background: T.bgSubtle, flexShrink: 0,
          overflowX: 'auto',
        }}
      >
        {TABS.map((tab, i) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active}
              aria-controls={`a11y-tabpanel-${tab.id}`}
              id={`a11y-tab-${tab.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => {
                // Arrow key navigation between tabs (ARIA tablist pattern)
                const order = TABS.map(t => t.id);
                const idx   = order.indexOf(activeTab);
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  setActiveTab(order[(idx + 1) % order.length]);
                  document.getElementById(`a11y-tab-${order[(idx + 1) % order.length]}`)?.focus();
                }
                if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  const prev = (idx - 1 + order.length) % order.length;
                  setActiveTab(order[prev]);
                  document.getElementById(`a11y-tab-${order[prev]}`)?.focus();
                }
              }}
              style={{
                flex: 1, padding: '9px 4px',
                border: 'none',
                borderBottom: `2px solid ${active ? T.accent : 'transparent'}`,
                background: active ? T.bg : 'transparent',
                color: active ? T.accent : T.textSecondary,
                fontSize: 11.5, fontWeight: active ? 700 : 500,
                cursor: 'pointer',
                transition: 'color 0.15s, border-color 0.15s, background 0.15s',
                whiteSpace: 'nowrap',
                outline: 'none',
              }}
              onFocus={e  => !active && (e.target.style.outline = `2px solid ${T.accent} inset`)}
              onBlur={e   => e.target.style.outline = 'none'}
            >
              <span aria-hidden="true" style={{ marginRight: 3 }}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Panel ── */}
      <div
        id={`a11y-tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`a11y-tab-${activeTab}`}
        tabIndex={0}
        style={{
          flex: 1, overflowY: 'auto', padding: '16px',
          scrollbarWidth: 'thin',
          scrollbarColor: `${T.border} transparent`,
        }}
      >
        {PANEL_CONTENTS[activeTab]}
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: '8px 16px',
        borderTop: `1px solid ${T.border}`,
        background: T.bgSubtle, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 10.5, color: T.textMuted }}>
          Settings auto-saved
        </span>
        <span style={{ fontSize: 10.5, color: T.textMuted, display: 'flex', gap: 3, alignItems: 'center' }}>
          <Key>Alt</Key>+<Key>A</Key>&nbsp;to toggle
        </span>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 12. ROOT COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function AccessibilityPanel() {
  // Settings state
  const [settings, dispatch] = useReducer(settingsReducer, null, loadSettings);

  // Persist to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(settings)); } catch {}
  }, [settings]);

  // Apply settings to DOM
  useApplySettings(settings);

  // Panel open/close
  const [open, setOpen] = useState(false);
  const triggerRef      = useRef(null);

  // Draggable button
  const { pos, ref: dragRef, onMouseDown, onTouchStart, hasDragged } = useDraggable();

  // TTS
  const tts = useTTS();

  // Inject global styles once
  useEffect(() => { injectStyles(); }, []);

  // ── Global keyboard shortcuts ──
  useEffect(() => {
    const onKey = (e) => {
      if (!e.altKey) return;
      switch (e.key.toLowerCase()) {
        case 'a': e.preventDefault(); setOpen(o => !o);                                                           break;
        case 'd': e.preventDefault(); dispatch({ type:'SET', key:'dyslexiaFont',  value: !settings.dyslexiaFont });  break;
        case '+':
        case '=': e.preventDefault(); dispatch({ type:'SET', key:'fontSize', value: Math.min(160, settings.fontSize+10) }); break;
        case '-': e.preventDefault(); dispatch({ type:'SET', key:'fontSize', value: Math.max(70,  settings.fontSize-10) }); break;
        case 'c': e.preventDefault(); dispatch({ type:'SET', key:'highContrast',  value: !settings.highContrast });    break;
        case 'r': e.preventDefault(); dispatch({ type:'SET', key:'readingMode',   value: !settings.readingMode });     break;
        case 's':
          e.preventDefault();
          if (tts.speaking) { tts.stop(); }
          else { setOpen(true); setTimeout(() => tts.activatePickMode(), 120); }
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [settings, tts, dispatch]);

  // ── Close panel on outside click ──
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (
        !e.target.closest('[data-a11y-exempt]') &&
        !e.target.closest('[data-a11y-trigger]')
      ) setOpen(false);
    };
    const timer = setTimeout(() => document.addEventListener('click', onClick), 80);
    return () => { clearTimeout(timer); document.removeEventListener('click', onClick); };
  }, [open]);

  // Active feature count for trigger badge
  const activeCount = [
    settings.dyslexiaFont, settings.fontSize !== 100,
    settings.highContrast, settings.highlightLinks, settings.largeCursor,
    settings.reduceMotion, settings.readingMode, settings.colorFilter !== 'none',
  ].filter(Boolean).length;

  // ── Portal target (creates once) ──
  const [portalEl] = useState(() => {
    if (typeof document === 'undefined') return null;
    const el = document.createElement('div');
    el.setAttribute('data-a11y-exempt', '');
    el.setAttribute('id', 'a11y-portal');
    document.body.appendChild(el);
    return el;
  });

  if (!portalEl) return null;

  const handleTriggerClick = (e) => {
    e.stopPropagation();
    // Don't toggle open if the mouseup was at the end of a drag
    if (hasDragged.current) { hasDragged.current = false; return; }
    setOpen(o => !o);
  };

  return createPortal(
    <SettingsCtx.Provider value={{ settings, dispatch }}>
      {/* Hidden SVG color filter defs */}
      <ColorFilterDefs />

      {/* ── Floating Trigger Button ── */}
      <div
        ref={dragRef}
        data-a11y-trigger=""
        data-a11y-exempt=""
        style={{
          position: 'fixed',
          left: pos.x, top: pos.y,
          zIndex: 2147483646,
          touchAction: 'none',
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <button
          ref={triggerRef}
          aria-label={`Accessibility options${activeCount > 0 ? ` — ${activeCount} feature${activeCount > 1 ? 's' : ''} active` : ''}`}
          aria-expanded={open}
          aria-controls="a11y-dialog"
          aria-haspopup="dialog"
          title="Accessibility options (Alt + A)"
          onClick={handleTriggerClick}
          style={{
            width: 54, height: 54, borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.95)',
            background: open
              ? 'linear-gradient(135deg, #004ab0 0%, #0062e6 100%)'
              : 'linear-gradient(135deg, #0062e6 0%, #3389f7 100%)',
            boxShadow: open
              ? '0 0 0 4px rgba(0,98,230,0.25), 0 6px 24px rgba(0,0,0,0.22)'
              : '0 4px 18px rgba(0,98,230,0.45), 0 2px 6px rgba(0,0,0,0.15)',
            cursor: 'grab',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 24,
            position: 'relative',
            transition: 'background 0.2s, box-shadow 0.2s, transform 0.12s',
            outline: 'none',
            fontFamily: 'system-ui',
          }}
          onFocus={e  => e.target.style.boxShadow = `0 0 0 4px ${T.accentDim}, 0 4px 18px rgba(0,98,230,0.45)`}
          onBlur={e   => e.target.style.boxShadow = '0 4px 18px rgba(0,98,230,0.45), 0 2px 6px rgba(0,0,0,0.15)'}
          onMouseDown={e => { e.currentTarget.style.cursor = 'grabbing'; }}
          onMouseUp={e   => { e.currentTarget.style.cursor = 'grab'; }}
        >
          ♿
          {/* Active badge */}
          {activeCount > 0 && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute', top: -3, right: -3,
                minWidth: 18, height: 18, borderRadius: 9,
                background: '#f59e0b',
                border: '2px solid #fff',
                fontSize: 10, fontWeight: 800, color: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 3px',
              }}
            >
              {activeCount}
            </span>
          )}
          {/* Pulse ring when TTS active */}
          {tts.speaking && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute', inset: -6,
                borderRadius: '50%',
                border: '2.5px solid #22c55e',
                animation: 'a11y-pulse 1.5s ease-in-out infinite',
              }}
            />
          )}
        </button>
        <style>{`
          @keyframes a11y-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50%       { opacity: 0.4; transform: scale(1.15); }
          }
        `}</style>
      </div>

      {/* ── Panel Popup ── */}
      {open && (
        <div id="a11y-dialog">
          <Panel
            triggerPos={pos}
            onClose={() => { setOpen(false); triggerRef.current?.focus(); }}
            tts={tts}
          />
        </div>
      )}
    </SettingsCtx.Provider>,
    portalEl
  );
}