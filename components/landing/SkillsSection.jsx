"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuthModalContext } from "@/components/landing/AuthModalContext";

// ── Personas ─────────────────────────────────────────────────────────────────
const personas = [
  {
    initial: "M", name: "Maria Santos", title: "UI/UX Designer · Quezon City",
    avatarColor: "#0F5C6E",
    skills: [
      { label: "Figma & Prototyping", pct: 90, from: "#0F5C6E", to: "#34D399" },
      { label: "Accessibility Design",  pct: 75, from: "#0F5C6E", to: "#6EE7B7" },
      { label: "User Research",         pct: 60, from: "#0F5C6E", to: "#A7F3D0" },
    ],
    milestones: [
      { dot: "#10B981", text: `Completed: "Design an Accessible Dashboard" challenge` },
      { dot: "#F59E0B", text: "Milestone: Intermediate UI/UX unlocked 🎉" },
    ],
    badges: [
      { label: "✓ Portfolio Live",     bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
      { label: "⚡ 3 Challenges Done", bg: "#EFF9FB", color: "#0F5C6E", border: "#B8E4ED" },
      { label: "🏅 Rising Talent",     bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
    ],
  },
  {
    initial: "C", name: "Carlos Reyes", title: "Frontend Developer · Cebu City",
    avatarColor: "#1A3A5C",
    skills: [
      { label: "React & TypeScript",  pct: 85, from: "#1A3A5C", to: "#34D399" },
      { label: "Accessible HTML/CSS", pct: 78, from: "#1A3A5C", to: "#6EE7B7" },
      { label: "Node.js Basics",      pct: 50, from: "#1A3A5C", to: "#A7F3D0" },
    ],
    milestones: [
      { dot: "#10B981", text: `Completed: "Build a Screen-Reader Ready App" challenge` },
      { dot: "#6366F1", text: "Milestone: Full-Stack Foundations badge earned 🚀" },
    ],
    badges: [
      { label: "✓ Portfolio Live",       bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
      { label: "⚡ 5 Challenges Done",   bg: "#EFF9FB", color: "#0F5C6E", border: "#B8E4ED" },
      { label: "🔥 On a Streak",         bg: "#FFF1F2", color: "#BE123C", border: "#FECDD3" },
    ],
  },
  {
    initial: "A", name: "Ana Villanueva", title: "Data Analyst · Manila",
    avatarColor: "#6D28D9",
    skills: [
      { label: "Python & Pandas",    pct: 88, from: "#6D28D9", to: "#34D399" },
      { label: "Data Visualization", pct: 70, from: "#6D28D9", to: "#A78BFA" },
      { label: "SQL & Databases",    pct: 65, from: "#6D28D9", to: "#C4B5FD" },
    ],
    milestones: [
      { dot: "#10B981", text: `Completed: "Clean & Visualize PWD Employment Data" challenge` },
      { dot: "#F59E0B", text: "Milestone: Data Pro Level 1 unlocked 📊" },
    ],
    badges: [
      { label: "✓ Portfolio Live",     bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
      { label: "📊 4 Challenges Done", bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE" },
      { label: "⭐ Top Performer",     bg: "#FFFBEB", color: "#B45309", border: "#FDE68A" },
    ],
  },
];

const MORPH_WORDS = ["louder", "stronger", "brighter", "clearer"];

const trustItems = [
  { icon: "✅", label: "WCAG 2.1 AA Compliant" },
  { icon: "🇵🇭", label: "RA 7277 Aligned" },
  { icon: "🤖", label: "AI-Powered Verification" },
  { icon: "🔒", label: "PWD Identity Protected" },
  { icon: "📋", label: "NCDA Partnership Roadmap" },
];

// ── Typewriter Hook ───────────────────────────────────────────────────────────
function useTypewriter(text, speed = 55, startDelay = 300) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

// ── Word Morph Hook ───────────────────────────────────────────────────────────
function useWordMorph(words, interval = 2200) {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % words.length);
        setAnimating(false);
      }, 350);
    }, interval);
    return () => clearInterval(t);
  }, [words, interval]);
  return { word: words[idx], animating };
}

// ── Animated Skill Bar ────────────────────────────────────────────────────────
function AnimatedBar({ pct, from, to, delay = 0, visible }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setWidth(pct), delay);
    return () => clearTimeout(t);
  }, [visible, pct, delay]);
  return (
    <div style={{ height: 10, background: "#E8F2F5", borderRadius: 99, overflow: "hidden" }}>
      <div style={{
        height: "100%", borderRadius: 99,
        background: `linear-gradient(90deg, ${from}, ${to})`,
        width: `${width}%`,
        transition: "width 1.1s cubic-bezier(0.22,1,0.36,1)",
      }} />
    </div>
  );
}

// ── Counter ───────────────────────────────────────────────────────────────────
function Counter({ target, visible, delay = 0 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      const start = Date.now();
      const dur = 1100;
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / dur, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setVal(Math.round(ease * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [visible, target, delay]);
  return <>{val}</>;
}

// ── 3D Tilt Card ─────────────────────────────────────────────────────────────
function TiltCard({ children, style }) {
  const ref = useRef(null);
  const handleMouseMove = useCallback((e) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)";
  }, []);
  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.15s ease-out", transformStyle: "preserve-3d", ...style }}>
      {children}
    </div>
  );
}

// ── Cursor Sparkle ────────────────────────────────────────────────────────────
function CursorSparkle({ containerRef }) {
  const [sparks, setSparks] = useState([]);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let id = 0;
    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const sparkId = id++;
      setSparks(s => [...s.slice(-18), { id: sparkId, x, y }]);
      setTimeout(() => setSparks(s => s.filter(sp => sp.id !== sparkId)), 800);
    };
    container.addEventListener("mousemove", onMove);
    return () => container.removeEventListener("mousemove", onMove);
  }, [containerRef]);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 5 }}>
      {sparks.map(sp => (
        <div key={sp.id} style={{
          position: "absolute", left: sp.x, top: sp.y,
          width: 6, height: 6, borderRadius: "50%",
          background: `hsl(${Math.random() * 60 + 160}, 80%, 60%)`,
          transform: "translate(-50%,-50%)",
          animation: "sparkPop 0.8s ease-out forwards",
          pointerEvents: "none",
        }} />
      ))}
    </div>
  );
}

// ── Magnetic Button ───────────────────────────────────────────────────────────
function MagneticButton({ children, style, onClick, className }) {
  const ref = useRef(null);
  const handleMouseMove = useCallback((e) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }, []);
  return (
    <button ref={ref} onClick={onClick} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1)", ...style }}
      className={className}>
      {children}
    </button>
  );
}

// ── Profile Card ──────────────────────────────────────────────────────────────
function ProfileCard({ persona, visible, personaIdx, total, onPrev, onNext }) {
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const [badgesVisible, setBadgesVisible] = useState(false);

  useEffect(() => {
    setBadgesVisible(false);
    const t = setTimeout(() => setBadgesVisible(true), 600);
    return () => clearTimeout(t);
  }, [personaIdx]);

  const badgeTooltips = {
    "✓ Portfolio Live": "Your work is live & visible to employers",
    "⚡ 3 Challenges Done": "Completed 3 real-world challenges",
    "🏅 Rising Talent": "Top 20% of new platform members",
    "⚡ 5 Challenges Done": "Completed 5 real-world challenges",
    "🔥 On a Streak": "7-day learning streak!",
    "📊 4 Challenges Done": "Completed 4 real-world challenges",
    "⭐ Top Performer": "Top 10% this month",
  };

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 24, padding: 32,
      boxShadow: "0 8px 48px rgba(15,92,110,0.16)",
      border: "1px solid #DDE8EC",
      display: "flex", flexDirection: "column", gap: 22,
      width: "100%", position: "relative",
    }}>
      {/* Glassmorphism top accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: `linear-gradient(90deg, ${persona.avatarColor}, #34D399)`,
        borderRadius: "24px 24px 0 0",
      }} />

      {/* Header with persona nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: persona.avatarColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 700, fontSize: 20,
          fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
          boxShadow: `0 4px 16px ${persona.avatarColor}55`,
          transition: "all 0.3s",
        }}>{persona.initial}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A1A2E" }}>{persona.name}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#7A9AAA", marginTop: 2 }}>{persona.title}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            padding: "5px 12px", borderRadius: 100,
            background: "#F0FDF4", border: "1px solid #BBF7D0",
            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#15803D",
            animation: "verifiedPulse 2.5s ease-in-out infinite",
          }}>✓ Verified</span>
        </div>
      </div>

      {/* Skill bars with counters */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {persona.skills.map((skill, i) => (
          <div key={skill.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7,
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#1A1A2E" }}>
              <span>{skill.label}</span>
              <span style={{ color: "#7A9AAA", fontWeight: 400 }}>
                <Counter target={skill.pct} visible={visible} delay={i * 200} />%
              </span>
            </div>
            <AnimatedBar pct={skill.pct} from={skill.from} to={skill.to} delay={i * 180} visible={visible} />
          </div>
        ))}
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #EEF4F6", margin: 0 }} />

      {/* Milestones */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {persona.milestones.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.dot, flexShrink: 0, marginTop: 5 }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#4A6070", lineHeight: 1.5 }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Badges with tooltips + stagger */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, position: "relative" }}>
        {persona.badges.map((b, i) => (
          <div key={b.label} style={{ position: "relative" }}
            onMouseEnter={() => setHoveredBadge(b.label)}
            onMouseLeave={() => setHoveredBadge(null)}>
            <span style={{
              display: "inline-block",
              padding: "7px 14px", borderRadius: 100,
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
              background: b.bg, color: b.color, border: `1px solid ${b.border}`,
              cursor: "default",
              opacity: badgesVisible ? 1 : 0,
              transform: badgesVisible ? "scale(1) translateY(0)" : "scale(0.7) translateY(8px)",
              transition: `opacity 0.4s ${i * 120}ms, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 120}ms`,
            }}>{b.label}</span>
            {hoveredBadge === b.label && badgeTooltips[b.label] && (
              <div style={{
                position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
                transform: "translateX(-50%)",
                background: "#1A1A2E", color: "#fff",
                fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
                padding: "6px 12px", borderRadius: 8, whiteSpace: "nowrap",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 20,
                pointerEvents: "none",
              }}>
                {badgeTooltips[b.label]}
                <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, background: "#1A1A2E", clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Persona carousel nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {personas.map((_, i) => (
            <div key={i} style={{
              width: i === personaIdx ? 20 : 6, height: 6, borderRadius: 99,
              background: i === personaIdx ? persona.avatarColor : "#E2E8F0",
              transition: "all 0.3s",
            }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["←", onPrev], ["→", onNext]].map(([arrow, fn]) => (
            <button key={arrow} onClick={fn} style={{
              width: 34, height: 34, borderRadius: "50%",
              border: "1.5px solid #E2E8F0", background: "#fff",
              color: "#0F5C6E", fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#0F5C6E"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0F5C6E"; }}
            >{arrow}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SkillsSection() {
  const { openAsWorker, openAsEmployer } = useAuthModalContext();
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [personaIdx, setPersonaIdx] = useState(0);
  const [cardVisible, setCardVisible] = useState(true);

  const { word: morphWord, animating: morphAnimating } = useWordMorph(MORPH_WORDS, 2400);
  const { displayed: typedSkills, done: typeSkillsDone } = useTypewriter("Skills that", 60, 400);
  const { displayed: typedSpeaks } = useTypewriter("speaks", 80, typeSkillsDone ? 0 : 99999);

  // Intersection observer for bar animations
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const switchPersona = useCallback((dir) => {
    setCardVisible(false);
    setTimeout(() => {
      setPersonaIdx(i => (i + dir + personas.length) % personas.length);
      setCardVisible(true);
    }, 280);
  }, []);

  const persona = personas[personaIdx];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes sparkPop {
          0%   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(2.5) translateY(-20px); }
        }
        @keyframes verifiedPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
          50%       { box-shadow: 0 0 0 6px rgba(16,185,129,0.18); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes wordSlideIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wordSlideOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-14px); }
        }
        @keyframes revealLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes revealRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes cardFadeIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .skills-left-anim  { animation: revealLeft  0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .skills-right-anim { animation: revealRight 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
        .card-swap-in  { animation: cardFadeIn 0.3s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <section
        ref={sectionRef}
        style={{ background: "#FAF8F5", padding: "80px 0", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}
        aria-labelledby="skills-heading"
      >
        {/* Animated blob backgrounds */}
        <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 500, height: 500, borderRadius: "60% 40% 55% 45% / 45% 55% 40% 60%", background: "radial-gradient(circle, rgba(15,92,110,0.07) 0%, transparent 70%)", animation: "floatBadge 8s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: 400, height: 400, borderRadius: "40% 60% 45% 55% / 55% 45% 60% 40%", background: "radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)", animation: "floatBadge 10s ease-in-out 1s infinite", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 60px", boxSizing: "border-box" }}>

          {/* Pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0F5C6E", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", padding: "8px 16px", borderRadius: 100, marginBottom: 36 }}>
            <span style={{ width: 6, height: 6, background: "#34D399", borderRadius: "50%" }} />
            ♿ Accessibility First Platform
          </div>

          {/* Two-column grid */}
          <div style={{ display: "grid", gridTemplateColumns: "50% 50%", alignItems: "center", gap: 48 }}>

            {/* LEFT — text */}
            <div className="skills-left-anim" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", margin: 0 }}>
                Built for PWDs. Powered by AI.
              </p>

              {/* Headline with typewriter + morph */}
              <h2 id="skills-heading" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(52px, 6vw, 80px)", lineHeight: 1.05, color: "#1A1A2E", letterSpacing: "-1px", margin: 0 }}>
                {/* Typewriter: "Skills that" */}
                <span style={{ display: "block", fontWeight: 300 }}>
                  {typedSkills}
                  <span style={{ opacity: typeSkillsDone ? 0 : 1, animation: typeSkillsDone ? "none" : "verifiedPulse 0.8s infinite" }}>|</span>
                </span>

                {/* Typewriter: "speaks" with underline */}
                <span style={{ display: "block", fontWeight: 300, textDecoration: "underline", textDecorationColor: "#0F5C6E", textDecorationThickness: 3, textUnderlineOffset: 7 }}>
                  {typedSpeaks}
                </span>

                {/* Morph word: louder → stronger → brighter → clearer */}
                <span
                  aria-label={morphWord}
                  style={{
                    display: "block", fontStyle: "normal", fontWeight: 800,
                    fontSize: "clamp(58px, 7vw, 90px)",
                    background: "linear-gradient(100deg, #0F5C6E 0%, #1A8FA5 30%, #34D399 60%, #0F5C6E 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    animation: "shimmer 3s linear infinite",
                    opacity: morphAnimating ? 0 : 1,
                    transform: morphAnimating ? "translateY(-10px)" : "translateY(0)",
                    transition: "opacity 0.35s ease, transform 0.35s ease",
                  }}
                >{morphWord}</span>

                <span style={{ display: "block", fontWeight: 300 }}>than</span>
                <span style={{ display: "block", fontStyle: "italic", fontWeight: 400, color: "#1A3A5C", WebkitTextFillColor: "#1A3A5C" }}>credentials</span>
              </h2>

              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#4A6070", lineHeight: 1.75, maxWidth: 480, fontWeight: 400, margin: 0 }}>
                InklusiJobs helps Persons with Disabilities become verified,
                job-ready professionals — through personalized learning paths,
                portfolio challenges, and AI-driven skill verification.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                <button onClick={openAsWorker} style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12,
                  letterSpacing: "1.5px", textTransform: "uppercase",
                  background: "#0F5C6E", color: "#fff",
                  padding: "13px 28px", borderRadius: 12, border: "none",
                  cursor: "pointer", boxShadow: "0 4px 14px rgba(15,92,110,0.28)",
                  transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0A4A5A"}
                  onMouseLeave={e => e.currentTarget.style.background = "#0F5C6E"}
                >Start Your Journey</button>
                <button onClick={openAsEmployer} style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12,
                  letterSpacing: "1.5px", textTransform: "uppercase",
                  background: "#fff", color: "#1A3A5C",
                  padding: "13px 28px", borderRadius: 12,
                  border: "1.5px solid #C8D8E0", cursor: "pointer",
                  transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F0F7F9"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >I&apos;m an Employer</button>
              </div>
            </div>

            {/* RIGHT — card with sparkle + tilt + floating badges */}
            <div className="skills-right-anim" style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
              <CursorSparkle containerRef={sectionRef} />
              <TiltCard style={{ width: "100%", maxWidth: 420 }}>
                <div className={cardVisible ? "card-swap-in" : ""} style={{ opacity: cardVisible ? 1 : 0 }}>
                  <ProfileCard
                    persona={persona}
                    visible={visible}
                    personaIdx={personaIdx}
                    total={personas.length}
                    onPrev={() => switchPersona(-1)}
                    onNext={() => switchPersona(1)}
                  />
                </div>
              </TiltCard>
            </div>

          </div>

          {/* Trust bar */}
          <div style={{ marginTop: 52, paddingTop: 24, borderTop: "1px solid #DDE8EC" }}>
            <ul style={{ display: "flex", flexWrap: "wrap", gap: "10px 36px", alignItems: "center", listStyle: "none", padding: 0, margin: 0 }}>
              {trustItems.map((item) => (
                <li key={item.label} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#7A9AAA" }}>
                  <span>{item.icon}</span>{item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}