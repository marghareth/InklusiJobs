"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AccessibilityPanel from "@/components/accessibility/AccessibilityPanel";
import SkipLink from "@/components/accessibility/SkipLink";
import { useAuthModalContext } from "@/components/landing/AuthModalContext";

const stats = [
  { value: 120, suffix: "+", label: "Inclusive employers" },
  { value: 500, suffix: "+", label: "Verified PWD candidates" },
  { value: 94,  suffix: "%", label: "Average match accuracy" },
  { value: 18,  suffix: " days", label: "Average time-to-hire" },
];

const benefits = [
  { icon: "✅", title: "Skills-Verified Candidates", desc: "Every candidate has completed practical challenges evaluated by AI against strict rubrics. You get evidence-based proof of ability — not just a list of certifications.", color: "#0F5C6E", accent: "#34D399" },
  { icon: "💰", title: "RA 7277 Tax Benefits", desc: "Hiring PWD employees qualifies your business for tax deductions under the Magna Carta for Persons with Disabilities. We help you document and maximize your benefits.", color: "#1A3A5C", accent: "#7DDCE8" },
  { icon: "🏅", title: "Inclusive Employer Badge", desc: "Earn a public badge displayed on your company profile and all job listings — a powerful signal of your commitment to inclusion and a boost to your employer brand.", color: "#0A3D4A", accent: "#A7F3D0" },
  { icon: "🎯", title: "AI-Powered Matching", desc: "Our AI surfaces candidates whose verified portfolio scores directly align with your job requirements. Less guesswork, faster hiring, better fit.", color: "#6D28D9", accent: "#C4B5FD" },
  { icon: "📊", title: "Side-by-Side Comparison", desc: "Compare multiple candidates simultaneously — portfolio work, AI scores, skill levels, and availability — all in a single employer dashboard view.", color: "#059669", accent: "#6EE7B7" },
  { icon: "🌐", title: "Verification-as-a-Service", desc: "Our PWD verification infrastructure is also licensable to hospitals, retailers, airlines, and any business that offers PWD discounts or must comply with RA 7277.", color: "#C2410C", accent: "#FED7AA" },
];

const steps = [
  { num: "01", icon: "🏢", title: "Register Your Company", desc: "Create your employer account, enter company details, and optionally declare your commitment to inclusive hiring to start earning your Inclusive Employer badge.", color: "#0F5C6E" },
  { num: "02", icon: "📋", title: "Post a Job", desc: "List required skills, work arrangement, compensation, and whether accommodations are available. AI automatically suggests which portfolio challenges align with your role.", color: "#1A8FA5" },
  { num: "03", icon: "🔍", title: "Browse Verified Talent", desc: "Platform surfaces candidates whose verified challenge scores match your job requirements — ranked by AI verification score and portfolio quality.", color: "#6D28D9" },
  { num: "04", icon: "📊", title: "Review, Compare & Hire", desc: "View AI verification scores and portfolio work side-by-side. Contact candidates through the platform, conduct interviews, and mark positions as filled.", color: "#059669" },
  { num: "05", icon: "⭐", title: "Post-Hire Feedback", desc: "Rate the hire quality after onboarding. Your feedback refines future matches and provides social proof on your hired worker's public profile.", color: "#C2410C" },
];

const comparisonRows = [
  { feature: "Skill Verification", inklusi: "✅ AI-verified challenges", others: "❌ Self-reported only" },
  { feature: "PWD-Specific Support", inklusi: "✅ Built-in, WCAG 2.1 AA", others: "❌ Generic platform" },
  { feature: "Portfolio Evidence", inklusi: "✅ Real project submissions", others: "❌ Resume / credentials" },
  { feature: "RA 7277 Guidance", inklusi: "✅ Integrated", others: "❌ Not available" },
  { feature: "Inclusive Employer Badge", inklusi: "✅ Earned through platform", others: "❌ Not applicable" },
];

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.2) {
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
        setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [visible, target, duration, delay]);
  return val;
}

function TiltCard({ children, style, onMouseEnter, onMouseLeave }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.03)`;
  }, []);
  const onLeave = useCallback((e) => {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
    onMouseLeave && onMouseLeave(e);
  }, [onMouseLeave]);
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} onMouseEnter={onMouseEnter}
      style={{ transition: "transform 0.15s ease-out", ...style }}>
      {children}
    </div>
  );
}

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

function Sparkles({ count = 8 }) {
  return <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: `${10 + (i * 11) % 80}%`, top: `${20 + (i * 17) % 60}%`, width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2, borderRadius: "50%", background: i % 3 === 0 ? "#34D399" : i % 3 === 1 ? "#7DDCE8" : "#FDE68A", opacity: 0.6, animation: `sparkFloat ${3 + (i % 3)}s ease-in-out ${i * 0.4}s infinite`, pointerEvents: "none" }} />
    ))}
  </>;
}

export default function ForEmployersPage() {
  const { openRoleSelector } = useAuthModalContext();
  const [heroRef, heroVisible] = useInView(0.2);
  const [benefitsRef, benefitsVisible] = useInView(0.2);
  const [stepsRef, stepsVisible] = useInView(0.2);
  const [hoveredBenefit, setHoveredBenefit] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
        @keyframes blobMorph { 0%,100%{border-radius:60% 40% 55% 45%/45% 55% 40% 60%;transform:translate(0,0) scale(1)}33%{border-radius:40% 60% 45% 55%/55% 45% 60% 40%;transform:translate(20px,-15px) scale(1.05)}66%{border-radius:50% 50% 60% 40%/40% 60% 50% 50%;transform:translate(-10px,10px) scale(0.97)} }
        @keyframes sparkFloat { 0%,100%{transform:translateY(0) scale(1);opacity:0.6}50%{transform:translateY(-18px) scale(1.3);opacity:1} }
        @keyframes shimmer { 0%{background-position:-200% center}100%{background-position:200% center} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)} }
        @keyframes badgeBounce { 0%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}60%{transform:translateY(-4px)} }
        @keyframes glowBorder { 0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,0.3),0 4px 20px rgba(15,92,110,0.1)}50%{box-shadow:0 0 0 4px rgba(52,211,153,0.15),0 8px 32px rgba(15,92,110,0.2)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,0.4)}50%{box-shadow:0 0 0 12px rgba(52,211,153,0)} }
      `}</style>

      <SkipLink />
      <Navbar />
      <main id="main-content" style={{ background: "#FAF8F5", minHeight: "100vh" }}>

        {/* HERO */}
        <div ref={heroRef} style={{ position: "relative", background: "linear-gradient(135deg, #0F5C6E 0%, #0A3D4A 100%)", paddingTop: 120, paddingBottom: 72, paddingLeft: 32, paddingRight: 32, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-10%", right: "5%", width: 420, height: 420, background: "radial-gradient(circle, rgba(125,220,232,0.12) 0%, transparent 70%)", animation: "blobMorph 10s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: 340, height: 340, background: "radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 70%)", animation: "blobMorph 13s ease-in-out 2s infinite", pointerEvents: "none" }} />
          <Sparkles count={10} />

          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
            {/* Badge pills */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
              {["🏢 For Employers", "✅ WCAG 2.1 AA", "🇵🇭 Philippines"].map((badge, i) => (
                <span key={badge} style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: "6px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#E0F8FA", animation: `sparkFloat ${4 + i}s ease-in-out ${i * 0.6}s infinite` }}>{badge}</span>
              ))}
            </div>

            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#7DDCE8", display: "block", marginBottom: 16 }}>For Employers</span>

            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 400, color: "#fff", lineHeight: 1.1, marginBottom: 24, maxWidth: 680 }}>
              Hire Verified PWD Talent —{" "}
              <span style={{ fontStyle: "italic", background: "linear-gradient(100deg, #7DDCE8, #34D399, #7DDCE8)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 3s linear infinite" }}>Skills First.</span>
            </h1>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(224,248,250,0.82)", lineHeight: 1.8, maxWidth: 560, marginBottom: 40 }}>
              Access a pool of AI-verified, portfolio-backed PWD professionals. No more credential guessing — see exactly what each candidate can do before you hire.
            </p>

            {/* Animated stats */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 48, marginBottom: 36 }}>
              {stats.map((s, i) => <StatItem key={s.label} stat={s} visible={heroVisible} index={i} />)}
            </div>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button onClick={openRoleSelector} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, background: "#34D399", color: "#0A3D2E", padding: "14px 32px", borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(52,211,153,0.4)", animation: "pulse 3s ease-in-out infinite", transition: "transform 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                Post a Job — It&apos;s Free →
              </button>
              <a href="#how-it-works" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, background: "rgba(255,255,255,0.12)", color: "#fff", padding: "14px 32px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.3)", textDecoration: "none", backdropFilter: "blur(8px)", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}>
                See How It Works
              </a>
            </div>
          </div>

          {/* Wave */}
          <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, lineHeight: 0 }}>
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
              <path d="M0,40 C360,70 1080,10 1440,40 L1440,60 L0,60 Z" fill="#FAF8F5" />
            </svg>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>

          {/* WHY HIRE HERE */}
          <div style={{ marginBottom: 96 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", marginBottom: 12 }}>Why Us</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 12, lineHeight: 1.15 }}>
              Why hire through <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>InklusiJobs?</span>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#4A6070", lineHeight: 1.85, maxWidth: 760, marginBottom: 0 }}>
              Despite RA 7277, many capable PWDs remain unemployed — not because they lack skill, but because traditional hiring relies on credentials and work history they haven&apos;t had the chance to build yet. InklusiJobs solves this by giving employers <strong style={{ color: "#0F5C6E" }}>evidence-based portfolios</strong>, <strong style={{ color: "#0F5C6E" }}>AI challenge verification scores</strong>, and <strong style={{ color: "#0F5C6E" }}>practical project submissions</strong> — so you can hire with full confidence.
            </p>
          </div>

          {/* BENEFITS GRID */}
          <div ref={benefitsRef} style={{ marginBottom: 96 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", marginBottom: 12 }}>What You Get</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 44, lineHeight: 1.15 }}>
              Everything you need to hire <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>inclusively.</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {benefits.map((b, i) => (
                <TiltCard key={b.title}
                  onMouseEnter={() => setHoveredBenefit(b.title)}
                  onMouseLeave={() => setHoveredBenefit(null)}
                  style={{ background: hoveredBenefit === b.title ? b.color : "#fff", border: `1.5px solid ${hoveredBenefit === b.title ? "transparent" : "#DDE8EC"}`, borderRadius: 20, padding: "32px 28px", boxShadow: hoveredBenefit === b.title ? `0 16px 40px ${b.color}44` : "0 2px 12px rgba(15,92,110,0.06)", cursor: "default", transition: "all 0.25s", animation: benefitsVisible ? `slideUp 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms both` : "none", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${b.accent}22 0%, transparent 70%)`, pointerEvents: "none" }} />
                  <div style={{ fontSize: 36, marginBottom: 16 }}>{b.icon}</div>
                  <div style={{ height: 2, width: 36, background: hoveredBenefit === b.title ? b.accent : "#0F5C6E", borderRadius: 99, marginBottom: 16, transition: "background 0.25s" }} />
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 17, color: hoveredBenefit === b.title ? "#fff" : "#1A1A2E", marginBottom: 10, transition: "color 0.25s" }}>{b.title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: hoveredBenefit === b.title ? "rgba(255,255,255,0.82)" : "#4A6070", lineHeight: 1.75, margin: 0, transition: "color 0.25s" }}>{b.desc}</p>
                </TiltCard>
              ))}
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div id="how-it-works" ref={stepsRef} style={{ marginBottom: 96 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", marginBottom: 12 }}>The Process</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 12, lineHeight: 1.15 }}>
              From signup to your first <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>inclusive hire.</span>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 56, lineHeight: 1.7 }}>
              From account setup to your first inclusive hire — simple and transparent.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
              {steps.map((step, i) => (
                <div key={step.num} style={{ background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 20, padding: "28px 24px", boxShadow: "0 2px 16px rgba(15,92,110,0.06)", animation: stepsVisible ? `slideUp 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 140}ms both` : "none" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: step.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 15, marginBottom: 20, animation: stepsVisible ? `badgeBounce 2s ease-in-out ${i * 300}ms infinite` : "none", boxShadow: `0 4px 16px ${step.color}44` }}>{step.num}</div>
                  <div style={{ fontSize: 28, marginBottom: 14, display: "inline-block", transition: "transform 0.3s" }} onMouseEnter={e => e.currentTarget.style.transform = "rotate(20deg) scale(1.2)"} onMouseLeave={e => e.currentTarget.style.transform = "rotate(0deg) scale(1)"}>{step.icon}</div>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A1A2E", marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#4A6070", lineHeight: 1.75, margin: 0 }}>{step.desc}</p>
                  <div style={{ marginTop: 20, height: 3, background: "#EEF4F6", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: stepsVisible ? `${(i + 1) * 20}%` : "0%", background: `linear-gradient(90deg, ${step.color}, #34D399)`, borderRadius: 99, transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${400 + i * 200}ms` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMPARISON TABLE */}
          <div style={{ marginBottom: 96 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", marginBottom: 12 }}>The Difference</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 44, lineHeight: 1.15 }}>
              InklusiJobs vs. <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>other platforms.</span>
            </h2>
            <div style={{ background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(15,92,110,0.06)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "#0F5C6E", padding: "16px 28px" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: "#fff" }}>Feature</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: "#7DDCE8" }}>InklusiJobs</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: "rgba(224,248,250,0.6)" }}>Other Platforms</span>
              </div>
              {comparisonRows.map((row, i) => (
                <div key={row.feature} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "16px 28px", borderTop: "1px solid #EEF4F6", background: i % 2 === 0 ? "#FDFCFA" : "#fff" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "#1A1A2E" }}>{row.feature}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#0F5C6E", fontWeight: 600 }}>{row.inklusi}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#94A3B8" }}>{row.others}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ position: "relative", background: "linear-gradient(135deg, #0F5C6E 0%, #0A3D4A 100%)", borderRadius: 28, padding: "72px 48px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", overflow: "hidden" }}>
            <Sparkles count={12} />
            <div style={{ position: "absolute", top: "-20%", right: "-5%", width: 300, height: 300, background: "radial-gradient(circle, rgba(125,220,232,0.15) 0%, transparent 70%)", animation: "blobMorph 8s ease-in-out infinite", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-20%", left: "-5%", width: 260, height: 260, background: "radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)", animation: "blobMorph 11s ease-in-out 1.5s infinite", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 400, color: "#fff", marginBottom: 16, lineHeight: 1.2 }}>
                Ready to hire <span style={{ fontStyle: "italic", color: "#7DDCE8" }}>verified talent?</span>
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(224,248,250,0.75)", maxWidth: 480, lineHeight: 1.8, marginBottom: 44 }}>
                Join 120+ inclusive employers already using InklusiJobs to find and hire skilled PWD professionals — free to get started.
              </p>
              <button onClick={openRoleSelector} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, background: "#34D399", color: "#0A3D2E", padding: "16px 44px", borderRadius: 14, border: "none", cursor: "pointer", boxShadow: "0 4px 24px rgba(52,211,153,0.4)", animation: "pulse 3s ease-in-out infinite", transition: "transform 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                Create Employer Account — Free →
              </button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
      <AccessibilityPanel />
    </>
  );
}