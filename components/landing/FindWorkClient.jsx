"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────
const stats = [
  { value: 500, suffix: "+", label: "PWD job seekers" },
  { value: 120, suffix: "+", label: "Inclusive employers" },
  { value: "WCAG 2.1 AA", label: "Accessibility standard", noCount: true },
  { value: "RA 7277",     label: "Legally aligned",        noCount: true },
];

const painPoints = [
  { icon: "🔄", title: "Breaking the Cycle", desc: "Can't get hired without experience. Can't get experience without being hired. We break that cycle with verified proof of skill — no work history required.", color: "#0F5C6E", accent: "#34D399" },
  { icon: "🔒", title: "Your Privacy, Protected", desc: "Disability disclosure is completely optional. We keep your identity confidential and focus on what you can actually do.", color: "#1A3A5C", accent: "#7DDCE8" },
  { icon: "🤖", title: "AI That Works for You", desc: "Our AI doesn't just match keywords — it verifies your practical skills through real challenges and surfaces you to employers who need exactly what you can do.", color: "#0A3D4A", accent: "#A7F3D0" },
];

const steps = [
  { num: "01", title: "Sign Up & Assess", desc: "Create your account via email or Google. Complete an interactive skill assessment covering your technical abilities, soft skills, career goals, and time availability.", icon: "👤", color: "#0F5C6E" },
  { num: "02", title: "Get Your AI Roadmap", desc: "Gemini AI generates your personalized visual roadmap — Beginner to Advanced — with specific skills, free resources, and realistic timeframes built around you.", icon: "🗺️", color: "#1A8FA5" },
  { num: "03", title: "Complete Portfolio Challenges", desc: "Unlock real-world tasks like 'Design an accessible dashboard' or 'Debug this code'. AI evaluates your work against strict rubrics and gives you detailed feedback.", icon: "⚡", color: "#6D28D9" },
  { num: "04", title: "Get Matched & Hired", desc: "Employers browse your verified portfolio by skill. See your match percentage for each role and apply in one click — no traditional resume needed.", icon: "🎯", color: "#059669" },
];

const categories = [
  { icon: "🎨", label: "UI/UX Design",        color: "#FFF0F6", border: "#FBCFE8", text: "#9D174D" },
  { icon: "💻", label: "Web Development",      color: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8" },
  { icon: "📊", label: "Data Entry & Admin",   color: "#F0FDF4", border: "#BBF7D0", text: "#15803D" },
  { icon: "✍️", label: "Content Writing",      color: "#FFFBEB", border: "#FDE68A", text: "#B45309" },
  { icon: "📣", label: "Digital Marketing",    color: "#FFF7ED", border: "#FED7AA", text: "#C2410C" },
  { icon: "🎧", label: "Customer Support",     color: "#F0FDFA", border: "#99F6E4", text: "#0F766E" },
  { icon: "📈", label: "Data Analysis",        color: "#EFF9FB", border: "#B8E4ED", text: "#0F5C6E" },
  { icon: "🎬", label: "Video Editing",        color: "#F5F3FF", border: "#DDD6FE", text: "#6D28D9" },
];

const guideSeeker = [
  { step: 1, title: "Create Your Account", desc: "Sign up with email or Google in under 2 minutes. No resume needed.", icon: "📝" },
  { step: 2, title: "Complete Skill Assessment", desc: "Our AI-powered assessment maps your current skills, interests, and availability.", icon: "🧠" },
  { step: 3, title: "Get Your Roadmap", desc: "Receive a personalized learning path from Beginner to Job-Ready.", icon: "🗺️" },
  { step: 4, title: "Complete Challenges", desc: "Work through real-world tasks that verify your skills with proof.", icon: "⚡" },
  { step: 5, title: "Build Your Portfolio", desc: "Every completed challenge is added to your verified portfolio automatically.", icon: "💼" },
  { step: 6, title: "Get Hired", desc: "Employers find you by skill. Apply in one click — your portfolio does the talking.", icon: "🎯" },
];

const guideEmployer = [
  { step: 1, title: "Register as Employer", desc: "Create your company profile and showcase your inclusive workplace culture.", icon: "🏢" },
  { step: 2, title: "Post Job Requirements", desc: "Describe the skills you need — not the credentials. We match based on ability.", icon: "📋" },
  { step: 3, title: "Browse Verified Talent", desc: "Search our pool of PWD professionals with verified, portfolio-backed skills.", icon: "🔍" },
  { step: 4, title: "Review Portfolios", desc: "See real work samples and AI-verified skill scores — not just resumes.", icon: "📊" },
  { step: 5, title: "Hire with Confidence", desc: "Connect directly with matched candidates and make offers on the platform.", icon: "🤝" },
];

const guideFeatures = [
  { title: "AI Skill Verification", desc: "Real-world challenges evaluated by AI against strict rubrics.", icon: "🤖", color: "#0F5C6E" },
  { title: "Adaptive Accessibility", desc: "High contrast, dyslexia fonts, large cursor — built for every need.", icon: "♿", color: "#6D28D9" },
  { title: "Portfolio Builder", desc: "Auto-generated portfolio from completed challenges, shareable instantly.", icon: "💼", color: "#059669" },
  { title: "Smart Job Matching", desc: "AI matches you to roles based on verified skills, not keywords.", icon: "🎯", color: "#C2410C" },
  { title: "Learning Roadmaps", desc: "Personalized paths from beginner to job-ready with free resources.", icon: "🗺️", color: "#B45309" },
  { title: "Privacy Controls", desc: "Full control over what employers see. Disability disclosure optional.", icon: "🔒", color: "#1A3A5C" },
];

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCounter(target, visible, duration = 1200, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [visible, target, duration, delay]);
  return val;
}

// ── 3D Tilt ───────────────────────────────────────────────────────────────────
function TiltCard({ children, style, className }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.03)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
  }, []);
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transition: "transform 0.15s ease-out", ...style }} className={className}>
      {children}
    </div>
  );
}

// ── Stat Counter ──────────────────────────────────────────────────────────────
function StatItem({ stat, visible, index }) {
  const val = useCounter(typeof stat.value === "number" ? stat.value : 0, visible, 1200, index * 150);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 32, color: "#7DDCE8", lineHeight: 1 }}>
        {stat.noCount ? stat.value : `${val}${stat.suffix || ""}`}
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(224,248,250,0.60)", marginTop: 6 }}>{stat.label}</div>
    </div>
  );
}

// ── Sparkle ───────────────────────────────────────────────────────────────────
function Sparkles({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${10 + (i * 11) % 80}%`,
          top: `${20 + (i * 17) % 60}%`,
          width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2,
          borderRadius: "50%",
          background: i % 3 === 0 ? "#34D399" : i % 3 === 1 ? "#7DDCE8" : "#FDE68A",
          opacity: 0.6,
          animation: `sparkFloat ${3 + (i % 3)}s ease-in-out ${i * 0.4}s infinite`,
          pointerEvents: "none",
        }} />
      ))}
    </>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function FindWorkClient() {
  const [heroRef, heroVisible] = useInView(0.2);
  const [whyRef, whyVisible] = useInView(0.2);
  const [howRef, howVisible] = useInView(0.2);
  const [catRef, catVisible] = useInView(0.2);
  const [ctaRef, ctaVisible] = useInView(0.3);
  const [guideTab, setGuideTab] = useState("seeker");
  const [hoveredCat, setHoveredCat] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

        @keyframes blobMorph {
          0%,100% { border-radius: 60% 40% 55% 45%/45% 55% 40% 60%; transform: translate(0,0) scale(1); }
          33%      { border-radius: 40% 60% 45% 55%/55% 45% 60% 40%; transform: translate(20px,-15px) scale(1.05); }
          66%      { border-radius: 50% 50% 60% 40%/40% 60% 50% 50%; transform: translate(-10px,10px) scale(0.97); }
        }
        @keyframes sparkFloat {
          0%,100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50%      { transform: translateY(-18px) scale(1.3); opacity: 1; }
        }
        @keyframes rocketFloat {
          0%,100% { transform: translateY(0) rotate(-5deg); }
          50%      { transform: translateY(-14px) rotate(5deg); }
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.4); }
          50%      { box-shadow: 0 0 0 12px rgba(52,211,153,0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes connectorGrow {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes badgeBounce {
          0%,100% { transform: translateY(0); }
          40%     { transform: translateY(-8px); }
          60%     { transform: translateY(-4px); }
        }
        @keyframes glowBorder {
          0%,100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.3), 0 4px 20px rgba(15,92,110,0.1); }
          50%      { box-shadow: 0 0 0 4px rgba(52,211,153,0.15), 0 8px 32px rgba(15,92,110,0.2); }
        }
        @keyframes trailPulse {
          0%,100% { opacity: 0.3; transform: scaleX(1); }
          50%      { opacity: 0.7; transform: scaleX(1.05); }
        }
        .tab-btn { transition: all 0.2s; }
        .tab-btn:hover { background: rgba(15,92,110,0.08) !important; }
        .cat-card { transition: all 0.25s cubic-bezier(0.22,1,0.36,1); }
        .cat-card:hover { transform: translateY(-4px) scale(1.02); }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div ref={heroRef} style={{ position: "relative", background: "linear-gradient(135deg, #0F5C6E 0%, #0A3D4A 100%)", paddingTop: 140, paddingBottom: 100, paddingLeft: 32, paddingRight: 32, overflow: "hidden" }}>
        {/* Animated blobs */}
        <div style={{ position: "absolute", top: "-10%", right: "5%", width: 420, height: 420, background: "radial-gradient(circle, rgba(125,220,232,0.12) 0%, transparent 70%)", animation: "blobMorph 10s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: 340, height: 340, background: "radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 70%)", animation: "blobMorph 13s ease-in-out 2s infinite", pointerEvents: "none" }} />

        <Sparkles count={10} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Floating icon badges */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
            {["🎯 Skills-First", "✅ WCAG 2.1 AA", "🇵🇭 Philippines"].map((badge, i) => (
              <span key={badge} style={{
                background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100,
                padding: "6px 16px", fontFamily: "'DM Sans', sans-serif",
                fontSize: 12, fontWeight: 700, color: "#E0F8FA",
                animation: `sparkFloat ${4 + i}s ease-in-out ${i * 0.6}s infinite`,
              }}>{badge}</span>
            ))}
          </div>

          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#7DDCE8", display: "block", marginBottom: 16 }}>Job Board</span>

          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 400, color: "#fff", lineHeight: 1.1, marginBottom: 24, maxWidth: 680 }}>
            Find Work That Works{" "}
            <span style={{ fontStyle: "italic", background: "linear-gradient(100deg, #7DDCE8, #34D399, #7DDCE8)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 3s linear infinite" }}>For You</span>
          </h1>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(224,248,250,0.82)", lineHeight: 1.8, maxWidth: 560, marginBottom: 56 }}>
            Skills-first. Verified. Inclusive. Browse opportunities from employers committed to hiring Persons with Disabilities — matched to what you can actually do, not just what&apos;s on paper.
          </p>

          {/* Animated stats */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 48 }}>
            {stats.map((s, i) => <StatItem key={s.label} stat={s} visible={heroVisible} index={i} />)}
          </div>
        </div>

        {/* Wave bottom */}
        <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
            <path d="M0,40 C360,70 1080,10 1440,40 L1440,60 L0,60 Z" fill="#FAF8F5" />
          </svg>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>

        {/* ── WHY DIFFERENT ──────────────────────────────────────────────── */}
        <div ref={whyRef} style={{ marginBottom: 96 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", marginBottom: 12 }}>Why We're Different</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 12, lineHeight: 1.15 }}>
            Why InklusiJobs is <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>different</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 44, lineHeight: 1.7, maxWidth: 600 }}>
            Unlike LinkedIn, Jobstreet, or OnlineJobsPh — we don&apos;t rely on credentials or work history. We verify what you can actually do.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {painPoints.map((p, i) => (
              <TiltCard key={p.title} style={{
                background: p.color, borderRadius: 20, padding: "32px 28px",
                animation: whyVisible ? `slideUp 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms both` : "none",
                animationPlayState: whyVisible ? "running" : "paused",
                position: "relative", overflow: "hidden",
                cursor: "default",
              }}>
                {/* Glow accent */}
                <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${p.accent}22 0%, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ fontSize: 38, marginBottom: 16 }}>{p.icon}</div>
                <div style={{ height: 2, width: 36, background: p.accent, borderRadius: 99, marginBottom: 16 }} />
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(224,248,250,0.82)", lineHeight: 1.75, margin: 0 }}>{p.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
        <div ref={howRef} style={{ marginBottom: 96 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", marginBottom: 12 }}>The Process</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 12, lineHeight: 1.15 }}>
            How it <span style={{ fontStyle: "italic", color: "#0F5C6E", borderBottom: "3px solid #34D399", paddingBottom: 2 }}>works</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 56, lineHeight: 1.7 }}>
            Four steps from sign-up to employment — no traditional resume needed.
          </p>

          {/* Steps with connectors */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 0, position: "relative" }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{ position: "relative", padding: "0 16px 0 0" }}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div style={{ position: "absolute", top: 28, right: -4, left: "calc(50% + 28px)", height: 2, background: `linear-gradient(90deg, ${step.color}, ${steps[i+1].color})`, opacity: howVisible ? 1 : 0, transition: `opacity 0.5s ${400 + i * 150}ms`, zIndex: 0, display: "none" }} />
                )}
                <div style={{
                  background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 20,
                  padding: "28px 24px", boxShadow: "0 2px 16px rgba(15,92,110,0.06)",
                  animation: howVisible ? `slideUp 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 140}ms both` : "none",
                  position: "relative", zIndex: 1,
                  animationPlayState: howVisible ? "running" : "paused",
                }}>
                  {/* Bouncing number badge */}
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: step.color, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 15,
                    marginBottom: 20,
                    animation: howVisible ? `badgeBounce 2s ease-in-out ${i * 300}ms infinite` : "none",
                    boxShadow: `0 4px 16px ${step.color}44`,
                  }}>{step.num}</div>

                  {/* Icon rotates on hover */}
                  <div style={{ fontSize: 28, marginBottom: 14, display: "inline-block", transition: "transform 0.3s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "rotate(20deg) scale(1.2)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "rotate(0deg) scale(1)"}
                  >{step.icon}</div>

                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A1A2E", marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#4A6070", lineHeight: 1.75, margin: 0 }}>{step.desc}</p>

                  {/* Progress bar */}
                  <div style={{ marginTop: 20, height: 3, background: "#EEF4F6", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: howVisible ? `${(i + 1) * 25}%` : "0%", background: `linear-gradient(90deg, ${step.color}, #34D399)`, borderRadius: 99, transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${400 + i * 200}ms` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── JOB CATEGORIES ─────────────────────────────────────────────── */}
        <div ref={catRef} style={{ marginBottom: 96 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", marginBottom: 12 }}>Opportunities</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 12, lineHeight: 1.15 }}>
            Job <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>categories</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 44 }}>Remote-friendly, skills-based opportunities across fields where PWDs excel.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))", gap: 14 }}>
            {categories.map((cat, i) => (
              <div key={cat.label} className="cat-card"
                onMouseEnter={() => setHoveredCat(cat.label)}
                onMouseLeave={() => setHoveredCat(null)}
                style={{
                  background: hoveredCat === cat.label ? cat.color : "#fff",
                  border: `1.5px solid ${hoveredCat === cat.label ? cat.border : "#DDE8EC"}`,
                  borderRadius: 14, padding: "18px 20px",
                  display: "flex", alignItems: "center", gap: 14,
                  boxShadow: hoveredCat === cat.label ? `0 8px 24px ${cat.border}88` : "0 2px 12px rgba(15,92,110,0.05)",
                  cursor: "default",
                  animation: catVisible ? `slideUp 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms both` : "none",
                  animationPlayState: catVisible ? "running" : "paused",
                  position: "relative", overflow: "hidden",
                }}>
                {/* Corner accent */}
                <div style={{ position: "absolute", top: -10, right: -10, width: 40, height: 40, borderRadius: "50%", background: cat.color, opacity: 0.5, transition: "all 0.3s", transform: hoveredCat === cat.label ? "scale(3)" : "scale(1)" }} />

                <span style={{ fontSize: hoveredCat === cat.label ? 30 : 26, transition: "font-size 0.2s", position: "relative", zIndex: 1 }}>{cat.icon}</span>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: hoveredCat === cat.label ? cat.text : "#1A3A5C", transition: "color 0.2s" }}>{cat.label}</span>
                  {hoveredCat === cat.label && (
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: cat.text, marginTop: 2, opacity: 0.8 }}>→ View jobs</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW TO USE GUIDE ───────────────────────────────────────────── */}
        <div style={{ marginBottom: 96 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", marginBottom: 12 }}>Complete Guide</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 36, lineHeight: 1.15 }}>
            How to use <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>InklusiJobs</span>
          </h2>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
            {[
              { id: "seeker",   label: "👤 Job Seekers" },
              { id: "employer", label: "🏢 Employers" },
              { id: "features", label: "⚡ Platform Features" },
            ].map(tab => (
              <button key={tab.id} className="tab-btn" onClick={() => setGuideTab(tab.id)} style={{
                padding: "10px 22px", borderRadius: 100,
                border: guideTab === tab.id ? "none" : "1.5px solid #DDE8EC",
                background: guideTab === tab.id ? "#0F5C6E" : "#fff",
                color: guideTab === tab.id ? "#fff" : "#4A6070",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700,
                cursor: "pointer",
              }}>{tab.label}</button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ animation: "slideUp 0.35s cubic-bezier(0.22,1,0.36,1) both" }} key={guideTab}>
            {guideTab === "features" ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                {guideFeatures.map((f, i) => (
                  <div key={f.title} style={{ background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 16, padding: "24px 22px", boxShadow: "0 2px 12px rgba(15,92,110,0.05)", animation: `glowBorder 3s ease-in-out ${i * 400}ms infinite` }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: f.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
                    <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A2E", marginBottom: 8 }}>{f.title}</h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#4A6070", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {(guideTab === "seeker" ? guideSeeker : guideEmployer).map((item, i) => (
                  <div key={item.step} style={{ display: "flex", gap: 20, alignItems: "flex-start", background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 16, padding: "22px 24px", boxShadow: "0 2px 12px rgba(15,92,110,0.05)" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: `hsl(${180 + i * 20}, 60%, ${guideTab === "seeker" ? 30 : 25}%)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 16, color: "#fff" }}>{item.step}</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 20 }}>{item.icon}</span>
                        <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A2E", margin: 0 }}>{item.title}</h3>
                      </div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#4A6070", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── JOB LISTINGS CTA ───────────────────────────────────────────── */}
        <div ref={ctaRef} style={{ position: "relative", background: "linear-gradient(135deg, #0F5C6E 0%, #0A3D4A 100%)", borderRadius: 28, padding: "72px 48px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", overflow: "hidden" }}>
          <Sparkles count={14} />

          {/* Blob backgrounds */}
          <div style={{ position: "absolute", top: "-20%", right: "-5%", width: 300, height: 300, background: "radial-gradient(circle, rgba(125,220,232,0.15) 0%, transparent 70%)", animation: "blobMorph 8s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-20%", left: "-5%", width: 260, height: 260, background: "radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)", animation: "blobMorph 11s ease-in-out 1.5s infinite", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Animated rocket */}
            <div style={{ fontSize: 64, marginBottom: 24, animation: "rocketFloat 3s ease-in-out infinite", display: "inline-block" }}>🚀</div>
            {/* Rocket trail */}
            <div style={{ width: 60, height: 4, background: "linear-gradient(90deg, transparent, #34D399)", borderRadius: 99, margin: "-12px auto 28px", animation: "trailPulse 2s ease-in-out infinite" }} />

            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 20 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34D399", animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#34D399", letterSpacing: "1.5px", textTransform: "uppercase" }}>Coming Soon</span>
            </div>

            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 400, color: "#fff", marginBottom: 16, lineHeight: 1.2 }}>
              Live job listings <span style={{ fontStyle: "italic", color: "#7DDCE8" }}>coming soon</span>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(224,248,250,0.75)", maxWidth: 500, lineHeight: 1.8, marginBottom: 44 }}>
              We&apos;re onboarding inclusive employers right now. Sign up to be first in line when jobs go live — and start building your verified portfolio today so you&apos;re ready.
            </p>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 40 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ width: i <= 3 ? 24 : 8, height: 8, borderRadius: 99, background: i <= 3 ? "#34D399" : "rgba(255,255,255,0.2)", transition: "all 0.3s" }} />
              ))}
            </div>

            <a href="/" style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14,
              background: "#34D399", color: "#0A3D2E",
              padding: "16px 40px", borderRadius: 14, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 24px rgba(52,211,153,0.4)",
              animation: "pulse 3s ease-in-out infinite",
              transition: "transform 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              Start Building Your Portfolio →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}