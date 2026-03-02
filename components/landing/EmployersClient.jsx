"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuthModalContext } from "@/components/landing/AuthModalContext";

const stats = [
  { value: 120, suffix: "+", label: "Inclusive employers" },
  { value: 500, suffix: "+", label: "Verified PWD candidates" },
  { value: 94,  suffix: "%", label: "Average match accuracy" },
  { value: 18,  suffix: " days", label: "Average time-to-hire" },
];

const features = [
  { icon: "🔍", title: "Browse Verified Talent", desc: "Search our pool of PWD professionals with AI-verified, portfolio-backed skill scores — not just resumes.", color: "#0F5C6E", accent: "#34D399" },
  { icon: "🤖", title: "AI-Powered Matching", desc: "Our AI surfaces the best candidates for your role based on verified skills, not keywords or credentials.", color: "#1A3A5C", accent: "#7DDCE8" },
  { icon: "📊", title: "Review Real Portfolios", desc: "See actual project submissions and challenge scores. Compare candidates side-by-side with confidence.", color: "#0A3D4A", accent: "#A7F3D0" },
  { icon: "🏢", title: "Inclusive Employer Badge", desc: "Declare your commitment to inclusive hiring and earn a badge displayed on your profile and all job listings.", color: "#6D28D9", accent: "#C4B5FD" },
  { icon: "💬", title: "Direct Messaging", desc: "Communicate with candidates through our platform — keeping their personal contact details private.", color: "#059669", accent: "#6EE7B7" },
  { icon: "📈", title: "Hiring Analytics", desc: "Track your pipeline, conversion rates, and AI match accuracy with a dedicated employer dashboard.", color: "#C2410C", accent: "#FED7AA" },
];

const steps = [
  { num: "01", icon: "🏢", title: "Register Your Company", desc: "Create your employer account and showcase your inclusive workplace culture. Takes under 5 minutes.", color: "#0F5C6E" },
  { num: "02", icon: "📋", title: "Post a Job", desc: "Describe the skills you need — not credentials. Our AI automatically suggests which challenges signal readiness.", color: "#1A8FA5" },
  { num: "03", icon: "🔍", title: "Browse Verified Candidates", desc: "Filter by skills, availability, and location. Every candidate has a verified portfolio to review.", color: "#6D28D9" },
  { num: "04", icon: "✅", title: "Hire with Confidence", desc: "Review portfolios, message candidates, make offers — all in one place. No middlemen.", color: "#059669" },
];

const testimonials = [
  { name: "TechInclusive PH", role: "Software Company · Makati", quote: "We hired 3 verified frontend developers through InklusiJobs. Their portfolio scores predicted performance better than any interview we'd done.", rating: 5 },
  { name: "Accessible Apps Co.", role: "Startup · BGC", quote: "The AI matching saved us weeks of screening. Every candidate we reviewed was genuinely qualified — not just keyword-matched.", rating: 5 },
  { name: "IncluWork Solutions", role: "BPO · Cebu", quote: "Our team now has 12 PWD professionals. InklusiJobs made it easy to find the right people and gave us the tools to support them.", rating: 5 },
];

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

function TiltCard({ children, style }) {
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
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transition: "transform 0.15s ease-out", ...style }}>{children}</div>;
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

export default function EmployersClient() {
  const { openRoleSelector } = useAuthModalContext();
  const [heroRef, heroVisible] = useInView(0.2);
  const [featRef, featVisible] = useInView(0.2);
  const [howRef,  howVisible]  = useInView(0.2);
  const [hoveredFeat, setHoveredFeat] = useState(null);

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

      {/* HERO — matches Find Work page style */}
      <div ref={heroRef} style={{ position: "relative", background: "linear-gradient(135deg, #0F5C6E 0%, #0A3D4A 100%)", paddingTop: 140, paddingBottom: 100, paddingLeft: 32, paddingRight: 32, overflow: "hidden" }}>
        {/* Animated blobs */}
        <div style={{ position: "absolute", top: "-10%", right: "5%", width: 420, height: 420, background: "radial-gradient(circle, rgba(125,220,232,0.12) 0%, transparent 70%)", animation: "blobMorph 10s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: 340, height: 340, background: "radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 70%)", animation: "blobMorph 13s ease-in-out 2s infinite", pointerEvents: "none" }} />
        <Sparkles count={10} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Floating badge pills — same style as Find Work */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
            {["🏢 For Employers", "✅ WCAG 2.1 AA", "🇵🇭 Philippines"].map((badge, i) => (
              <span key={badge} style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: "6px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#E0F8FA", animation: `sparkFloat ${4 + i}s ease-in-out ${i * 0.6}s infinite` }}>{badge}</span>
            ))}
          </div>

          {/* Eyebrow label */}
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#7DDCE8", display: "block", marginBottom: 16 }}>For Employers</span>

          {/* Headline — DM Serif Display like Find Work */}
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 400, color: "#fff", lineHeight: 1.1, marginBottom: 24, maxWidth: 680 }}>
            Hire Verified PWD Talent —{" "}
            <span style={{ fontStyle: "italic", background: "linear-gradient(100deg, #7DDCE8, #34D399, #7DDCE8)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 3s linear infinite" }}>Skills First.</span>
          </h1>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(224,248,250,0.82)", lineHeight: 1.8, maxWidth: 560, marginBottom: 56 }}>
            Access a pool of AI-verified, portfolio-backed PWD professionals. No more credential guessing — see exactly what each candidate can do before you hire.
          </p>

          {/* Animated stats — same layout as Find Work */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 48, marginBottom: 48 }}>
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

        {/* Wave bottom — same as Find Work */}
        <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
            <path d="M0,40 C360,70 1080,10 1440,40 L1440,60 L0,60 Z" fill="#FAF8F5" />
          </svg>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>

        {/* FEATURES */}
        <div ref={featRef} style={{ marginBottom: 96 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", marginBottom: 12 }}>What You Get</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 44, lineHeight: 1.15 }}>
            Everything you need to hire <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>inclusively.</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {features.map((f, i) => (
              <TiltCard key={f.title} style={{ background: hoveredFeat === f.title ? f.color : "#fff", border: `1.5px solid ${hoveredFeat === f.title ? "transparent" : "#DDE8EC"}`, borderRadius: 20, padding: "32px 28px", boxShadow: hoveredFeat === f.title ? `0 16px 40px ${f.color}44` : "0 2px 12px rgba(15,92,110,0.06)", cursor: "default", transition: "all 0.25s", animation: featVisible ? `slideUp 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms both` : "none", position: "relative", overflow: "hidden" }}
                onMouseEnter={() => setHoveredFeat(f.title)} onMouseLeave={() => setHoveredFeat(null)}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${f.accent}22 0%, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ height: 2, width: 36, background: hoveredFeat === f.title ? f.accent : "#0F5C6E", borderRadius: 99, marginBottom: 16, transition: "background 0.25s" }} />
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 17, color: hoveredFeat === f.title ? "#fff" : "#1A1A2E", marginBottom: 10, transition: "color 0.25s" }}>{f.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: hoveredFeat === f.title ? "rgba(255,255,255,0.82)" : "#4A6070", lineHeight: 1.75, margin: 0, transition: "color 0.25s" }}>{f.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div id="how-it-works" ref={howRef} style={{ marginBottom: 96 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", marginBottom: 12 }}>The Process</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 12, lineHeight: 1.15 }}>
            From signup to your first <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>inclusive hire.</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 56, lineHeight: 1.7 }}>
            Four steps from registration to your first PWD hire — no complicated onboarding.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{ background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 20, padding: "28px 24px", boxShadow: "0 2px 16px rgba(15,92,110,0.06)", animation: howVisible ? `slideUp 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 140}ms both` : "none" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: step.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 15, marginBottom: 20, animation: howVisible ? `badgeBounce 2s ease-in-out ${i * 300}ms infinite` : "none", boxShadow: `0 4px 16px ${step.color}44` }}>{step.num}</div>
                <div style={{ fontSize: 28, marginBottom: 14, display: "inline-block", transition: "transform 0.3s" }} onMouseEnter={e => e.currentTarget.style.transform = "rotate(20deg) scale(1.2)"} onMouseLeave={e => e.currentTarget.style.transform = "rotate(0deg) scale(1)"}>{step.icon}</div>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A1A2E", marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#4A6070", lineHeight: 1.75, margin: 0 }}>{step.desc}</p>
                <div style={{ marginTop: 20, height: 3, background: "#EEF4F6", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: howVisible ? `${(i + 1) * 25}%` : "0%", background: `linear-gradient(90deg, ${step.color}, #34D399)`, borderRadius: 99, transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${400 + i * 200}ms` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div style={{ marginBottom: 96 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", marginBottom: 12 }}>Employer Stories</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 44, lineHeight: 1.15 }}>
            What employers <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>say.</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={t.name} style={{ background: i === 1 ? "#0F5C6E" : "#fff", border: `1.5px solid ${i === 1 ? "transparent" : "#DDE8EC"}`, borderRadius: 20, padding: "32px 28px", boxShadow: "0 2px 12px rgba(15,92,110,0.06)", animation: `glowBorder 3s ease-in-out ${i * 500}ms infinite` }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                  {Array.from({ length: t.rating }).map((_, j) => <span key={j} style={{ color: "#F59E0B", fontSize: 16 }}>★</span>)}
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: i === 1 ? "rgba(255,255,255,0.85)" : "#4A6070", lineHeight: 1.8, marginBottom: 24, fontStyle: "italic" }}>&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: i === 1 ? "#fff" : "#1A1A2E" }}>{t.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: i === 1 ? "rgba(255,255,255,0.55)" : "#7A9AAA", marginTop: 3 }}>{t.role}</div>
                </div>
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
              Join 120+ inclusive employers already using InklusiJobs to find and hire skilled PWD professionals.
            </p>
            <button onClick={openRoleSelector} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, background: "#34D399", color: "#0A3D2E", padding: "16px 44px", borderRadius: 14, border: "none", cursor: "pointer", boxShadow: "0 4px 24px rgba(52,211,153,0.4)", animation: "pulse 3s ease-in-out infinite", transition: "transform 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              Create Employer Account — Free →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}