"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuthModalContext } from "@/components/landing/AuthModalContext";

const painPoints = [
  { icon: "🔄", title: "The Experience Trap", desc: "Employers require prior experience for entry-level roles. PWDs can't get experience because they aren't hired. They aren't hired because they lack experience. It's a cycle that traps capable people — and we're breaking it.", color: "#0F5C6E", accent: "#34D399" },
  { icon: "📄", title: "Certificates ≠ Competence", desc: "Online courses and certifications are widely available — but a certificate doesn't prove someone can actually do the job. Without real work history or a credible portfolio, PWDs have no way to show what they're truly capable of.", color: "#1A3A5C", accent: "#7DDCE8" },
  { icon: "🧩", title: "Platforms Built for the Majority", desc: "Job platforms like LinkedIn, Jobstreet, and OnlineJobsPh weren't designed with PWDs in mind. They rely on traditional credentials, offer no accessibility adaptations, and leave an entire community of skilled workers invisible.", color: "#1A8FA5", accent: "#A7F3D0" },
  { icon: "🏢", title: "Employers Without Tools", desc: "Even employers who want to hire inclusively struggle — there's no reliable way to verify if a PWD applicant can actually perform the role. Good intentions don't overcome the trust gap without evidence.", color: "#6D28D9", accent: "#C4B5FD" },
];

const pillars = [
  { icon: "🎯", title: "Skills Over Credentials", desc: "We believe your ability to do the job matters infinitely more than where you went to school or who you worked for. Our platform verifies what you can actually do — through real challenges, evaluated by AI.", color: "#0F5C6E", accent: "#34D399" },
  { icon: "♿", title: "Accessibility by Design", desc: "Accessibility isn't a feature we added later — it's built into the foundation. WCAG 2.1 AA compliance, adaptive interfaces, and full confidentiality are non-negotiable defaults.", color: "#1A3A5C", accent: "#7DDCE8" },
  { icon: "🔒", title: "Dignity in Every Interaction", desc: "Your disability is never your defining trait on this platform. We keep your disability profile private from employers unless you choose to share it. You are a skilled professional first.", color: "#059669", accent: "#6EE7B7" },
  { icon: "🤝", title: "Trust Through Verification", desc: "The trust gap between PWDs and employers is real. We close it with evidence — AI-verified portfolio challenges, detailed rubric scores, and public portfolios that let your work do the talking.", color: "#6D28D9", accent: "#C4B5FD" },
  { icon: "🌏", title: "Systemic, Not Sympathy-Based", desc: "We're not a charity. We're building infrastructure — a skills verification layer that creates genuine economic value for both workers and employers. Inclusion that makes business sense is inclusion that lasts.", color: "#C2410C", accent: "#FED7AA" },
  { icon: "📈", title: "Economic Participation", desc: "Every PWD who enters the workforce unlocks economic potential — for themselves, their families, and the Philippine economy. Inclusive employment isn't a social nicety; it's an economic imperative.", color: "#B45309", accent: "#FDE68A" },
];

const sdgCards = [
  { tag: "SDG 8", title: "Decent Work & Economic Growth", desc: "InklusiJobs directly targets SDG 8 by reducing unemployment among PWDs — a chronically underrepresented segment of the Philippine labor force — through verified skills and inclusive hiring infrastructure.", color: "#0F5C6E" },
  { tag: "SDG 10", title: "Reduced Inequalities", desc: "By removing credential-based barriers and providing accessible tools, we level the playing field for Persons with Disabilities in a job market that has historically excluded them.", color: "#1A3A5C" },
  { tag: "RA 7277", title: "Magna Carta for PWDs", desc: "Every feature is built in alignment with the Magna Carta for PWDs — from confidential disability profiles to employer tax benefit documentation and verification infrastructure.", color: "#1A8FA5" },
];

const differentiators = [
  { icon: "🔗", title: "End-to-End Solution", desc: "AI roadmap generation → skill building → portfolio challenges → verification → job matching → hiring. No other platform in the Philippines connects all of these into one inclusive ecosystem.", color: "#0F5C6E" },
  { icon: "📋", title: "Evidence-Based Portfolios", desc: "Challenge-based verification creates real, demonstrable proof of skill. Users without work history can prove capability through completed projects — building employer confidence from the ground up.", color: "#6D28D9" },
  { icon: "🤖", title: "AI That Adapts to You", desc: "Our Gemini-powered roadmaps adapt to your current skill level, time availability, disability accommodations, and career goals. Personalization that reflects reality — not a generic course list.", color: "#059669" },
  { icon: "🔐", title: "Confidentiality at the Core", desc: "Unlike most platforms, disability status is never visible to employers unless you disclose it. The focus is entirely on verified skills and portfolio quality.", color: "#C2410C" },
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

function TiltCard({ children, style }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.03)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
  }, []);
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transition: "transform 0.15s ease-out", ...style }}>{children}</div>;
}

function Sparkles({ count = 8 }) {
  return <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: `${10 + (i * 11) % 80}%`, top: `${20 + (i * 17) % 60}%`, width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2, borderRadius: "50%", background: i % 3 === 0 ? "#34D399" : i % 3 === 1 ? "#7DDCE8" : "#FDE68A", opacity: 0.6, animation: `sparkFloat ${3 + (i % 3)}s ease-in-out ${i * 0.4}s infinite`, pointerEvents: "none" }} />
    ))}
  </>;
}

export default function AboutClient() {
  const { openRoleSelector } = useAuthModalContext();
  const [problemRef, problemVisible] = useInView(0.15);
  const [pillarRef,  pillarVisible]  = useInView(0.15);
  const [sdgRef,     sdgVisible]     = useInView(0.15);
  const [diffRef,    diffVisible]    = useInView(0.15);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
        @keyframes blobMorph { 0%,100%{border-radius:60% 40% 55% 45%/45% 55% 40% 60%;transform:translate(0,0) scale(1)}33%{border-radius:40% 60% 45% 55%/55% 45% 60% 40%;transform:translate(20px,-15px) scale(1.05)}66%{border-radius:50% 50% 60% 40%/40% 60% 50% 50%;transform:translate(-10px,10px) scale(0.97)} }
        @keyframes sparkFloat { 0%,100%{transform:translateY(0) scale(1);opacity:0.6}50%{transform:translateY(-18px) scale(1.3);opacity:1} }
        @keyframes shimmer { 0%{background-position:-200% center}100%{background-position:200% center} }
        @keyframes slideUp { from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:translateX(0)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,0.4)}50%{box-shadow:0 0 0 12px rgba(52,211,153,0)} }
        @keyframes glowBorder { 0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,0.25),0 4px 20px rgba(15,92,110,0.08)}50%{box-shadow:0 0 0 4px rgba(52,211,153,0.12),0 8px 28px rgba(15,92,110,0.15)} }
      `}</style>

      {/* HERO */}
      <div style={{ position: "relative", background: "linear-gradient(135deg, #0A3D4A 0%, #0F5C6E 100%)", paddingTop: 140, paddingBottom: 100, paddingLeft: 32, paddingRight: 32, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", right: "5%", width: 420, height: 420, background: "radial-gradient(circle, rgba(125,220,232,0.12) 0%, transparent 70%)", animation: "blobMorph 10s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: 340, height: 340, background: "radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 70%)", animation: "blobMorph 13s ease-in-out 2s infinite", pointerEvents: "none" }} />
        <Sparkles count={10} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
            {["🌏 Our Mission", "🇵🇭 Philippines", "♿ WCAG 2.1 AA"].map((badge, i) => (
              <span key={badge} style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: "6px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#E0F8FA", animation: `sparkFloat ${4 + i}s ease-in-out ${i * 0.6}s infinite` }}>{badge}</span>
            ))}
          </div>

          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#7DDCE8", display: "block", marginBottom: 16 }}>Our Philosophy</span>

          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 400, color: "#fff", lineHeight: 1.1, marginBottom: 24, maxWidth: 760 }}>
            Why InklusiJobs Exists —{" "}
            <span style={{ fontStyle: "italic", background: "linear-gradient(100deg, #7DDCE8, #34D399, #7DDCE8)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 3s linear infinite" }}>and Why It Matters</span>
          </h1>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(224,248,250,0.82)", lineHeight: 1.85, maxWidth: 640, marginBottom: 0 }}>
            Despite RA 7277, hundreds of thousands of Persons with Disabilities in the Philippines remain unemployed — not because they lack ability, but because the systems around them were never built to see it. We&apos;re changing that.
          </p>
        </div>

        <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
            <path d="M0,40 C360,70 1080,10 1440,40 L1440,60 L0,60 Z" fill="#FAF8F5" />
          </svg>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>

        {/* THE PROBLEM */}
        <div ref={problemRef} style={{ marginBottom: 96 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", marginBottom: 12 }}>Root Causes</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 12, lineHeight: 1.15 }}>
            The problem we&apos;re <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>solving</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 44, lineHeight: 1.75, maxWidth: 640 }}>
            The unemployment of PWDs in the Philippines isn&apos;t a capability problem. It&apos;s a systems problem — and it shows up in four interconnected ways.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {painPoints.map((p, i) => (
              <TiltCard key={p.title} style={{ background: p.color, borderRadius: 20, padding: "32px 28px", animation: problemVisible ? `slideUp 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms both` : "none", position: "relative", overflow: "hidden", cursor: "default" }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: `radial-gradient(circle, ${p.accent}22 0%, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ fontSize: 36, marginBottom: 16 }}>{p.icon}</div>
                <div style={{ height: 2, width: 36, background: p.accent, borderRadius: 99, marginBottom: 16 }} />
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(224,248,250,0.82)", lineHeight: 1.75, margin: 0 }}>{p.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* MISSION STATEMENT */}
        <div style={{ background: "linear-gradient(135deg, #0F5C6E 0%, #0A3D4A 100%)", borderRadius: 24, padding: "52px 48px", marginBottom: 96, position: "relative", overflow: "hidden" }}>
          <Sparkles count={8} />
          <div style={{ position: "absolute", top: "-20%", right: "-5%", width: 280, height: 280, background: "radial-gradient(circle, rgba(125,220,232,0.15) 0%, transparent 70%)", animation: "blobMorph 8s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#7DDCE8", display: "block", marginBottom: 20 }}>Our Mission</span>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontStyle: "italic", fontSize: "clamp(1.3rem, 2.5vw, 1.85rem)", color: "#fff", lineHeight: 1.6, maxWidth: 800, margin: 0 }}>
              &ldquo;To empower Persons with Disabilities by providing a verified, accessible, and skills-first pathway to meaningful employment — so that capability, not circumstance, determines opportunity.&rdquo;
            </p>
          </div>
        </div>

        {/* OUR PILLARS */}
        <div ref={pillarRef} style={{ marginBottom: 96 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", marginBottom: 12 }}>Our Values</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 12, lineHeight: 1.15 }}>
            What we <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>stand for</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 44, lineHeight: 1.75 }}>Six principles that guide every decision we make.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {pillars.map((p, i) => (
              <TiltCard key={p.title} style={{ background: p.color, borderRadius: 20, padding: "32px 28px", animation: pillarVisible ? `slideUp 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms both` : "none", position: "relative", overflow: "hidden", cursor: "default" }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${p.accent}22 0%, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ fontSize: 34, marginBottom: 16 }}>{p.icon}</div>
                <div style={{ height: 2, width: 32, background: p.accent, borderRadius: 99, marginBottom: 16 }} />
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(224,248,250,0.82)", lineHeight: 1.75, margin: 0 }}>{p.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* SDG ALIGNMENT */}
        <div ref={sdgRef} style={{ marginBottom: 96 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", marginBottom: 12 }}>Legal & Global</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 12, lineHeight: 1.15 }}>
            Aligned with global &amp; local <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>standards</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 44, lineHeight: 1.75 }}>InklusiJobs is built in alignment with Philippine law and UN Sustainable Development Goals.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {sdgCards.map((s, i) => (
              <TiltCard key={s.tag} style={{ background: s.color, borderRadius: 20, padding: "32px 28px", animation: sdgVisible ? `slideUp 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 140}ms both` : "none", cursor: "default" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(224,248,250,0.6)", display: "block", marginBottom: 10 }}>{s.tag}</span>
                <div style={{ height: 2, width: 32, background: "#34D399", borderRadius: 99, marginBottom: 16 }} />
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(224,248,250,0.80)", lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* DIFFERENTIATORS */}
        <div ref={diffRef} style={{ marginBottom: 96 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", marginBottom: 12 }}>Why Us</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 12, lineHeight: 1.15 }}>
            What makes InklusiJobs <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>different</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 44, lineHeight: 1.75, maxWidth: 600 }}>
            Platforms like LinkedIn, Jobstreet, and OnlineJobsPh weren&apos;t built for this. Here&apos;s what sets us apart.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {differentiators.map((d, i) => (
              <div key={d.title} style={{ background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 18, padding: "26px 28px", display: "flex", gap: 22, alignItems: "flex-start", boxShadow: "0 2px 12px rgba(15,92,110,0.05)", animation: diffVisible ? `slideRight 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms both` : "none", transition: "box-shadow 0.2s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(15,92,110,0.12)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(15,92,110,0.05)"; e.currentTarget.style.transform = "translateX(0)"; }}>
                <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 14, background: d.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: `0 4px 14px ${d.color}44` }}>{d.icon}</div>
                <div>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A1A2E", marginBottom: 8 }}>{d.title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#4A6070", lineHeight: 1.8, margin: 0 }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VISION CTA */}
        <div style={{ position: "relative", background: "#F0EDE8", border: "1.5px solid #C8D8E0", borderRadius: 28, padding: "72px 48px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-20%", right: "-5%", width: 260, height: 260, background: "radial-gradient(circle, rgba(15,92,110,0.07) 0%, transparent 70%)", animation: "blobMorph 9s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-20%", left: "-5%", width: 220, height: 220, background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)", animation: "blobMorph 12s ease-in-out 1.5s infinite", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 52, marginBottom: 20 }}>🌏</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 16, lineHeight: 1.2 }}>
              Our <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>Vision</span>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#4A6070", maxWidth: 620, lineHeight: 1.85, marginBottom: 44 }}>
              A Philippines where disability is never a barrier to economic participation — where every Person with a Disability has access to the tools, verification, and opportunities they deserve to build a career that reflects their true capability.
            </p>
            <button onClick={openRoleSelector} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, background: "#0F5C6E", color: "#fff", padding: "16px 44px", borderRadius: 14, border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(15,92,110,0.3)", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(15,92,110,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(15,92,110,0.3)"; }}>
              Join InklusiJobs →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}