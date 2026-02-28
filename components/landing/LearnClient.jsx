"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuthModalContext } from "@/components/landing/AuthModalContext";

const seekerSteps = [
  { icon: "📝", step: "Step 1", title: "Sign Up & Set Your Profile", desc: "Create your account via email or Google OAuth. Complete a guided multi-step skill assessment covering your technical abilities, soft skills, career goals, and time availability. Setting a disability profile is optional and confidential.", color: "#0F5C6E" },
  { icon: "🗺️", step: "Step 2", title: "Receive Your AI Roadmap", desc: "Based on your assessment, Gemini AI generates your personalized visual roadmap displayed as an interactive timeline — Beginner to Advanced. Each phase lists specific skills, free or affordable resources, and realistic estimated timeframes.", color: "#1A8FA5" },
  { icon: "📚", step: "Step 3", title: "Learn at Your Own Pace", desc: "Follow your roadmap using curated resources. Your dashboard tracks completed modules, upcoming milestones, and progress. If you struggle with a topic, the AI adapts and gives you alternative recommendations.", color: "#6D28D9" },
  { icon: "🏆", step: "Step 4", title: "Unlock & Complete Challenges", desc: "Completing roadmap sections unlocks real portfolio challenges. Submit via file upload or project link. AI evaluates against rubrics and gives pass/fail with detailed constructive feedback.", color: "#059669" },
  { icon: "🌐", step: "Step 5", title: "Build Your Public Portfolio", desc: "Every passed challenge is automatically added to your public portfolio page with the task description, your submission, AI verification score, and skills demonstrated.", color: "#C2410C" },
  { icon: "💼", step: "Step 6", title: "Browse Jobs & Apply", desc: "Browse job listings filtered by your verified skills. See your match percentage for each role. Apply in one click — your portfolio is automatically shared with the employer.", color: "#B45309" },
];

const employerSteps = [
  { icon: "🏢", step: "Step 1", title: "Register Your Company", desc: "Create an employer account and enter company details. Optionally declare your commitment to inclusive hiring to start earning your Inclusive Employer badge.", color: "#0F5C6E" },
  { icon: "📋", step: "Step 2", title: "Post a Job Listing", desc: "Specify required skills, work arrangement, compensation, and whether accommodations are available. The AI automatically suggests which portfolio challenges best signal readiness.", color: "#1A8FA5" },
  { icon: "🔍", step: "Step 3", title: "Browse Verified Candidates", desc: "The platform surfaces candidates whose verified challenge scores match your job requirements, ranked by AI score and portfolio quality.", color: "#6D28D9" },
  { icon: "📊", step: "Step 4", title: "Review & Compare", desc: "View AI verification scores and portfolio project work. Compare multiple candidates side-by-side. Contact shortlisted candidates through the platform's messaging system.", color: "#059669" },
  { icon: "✅", step: "Step 5", title: "Hire & Give Feedback", desc: "Conduct interviews and mark the position as filled once hired. Your feedback improves future matching and becomes social proof on the worker's profile.", color: "#C2410C" },
];

const platformFeatures = [
  { icon: "♿", title: "Adaptive Accessibility UI", desc: "WCAG 2.1 AA compliance, adaptive interfaces for visual, cognitive, and motor disabilities. High contrast, dyslexia-friendly typography, and distraction-free layouts.", color: "#0F5C6E" },
  { icon: "🤖", title: "AI Skill Gap Analysis", desc: "Before your roadmap is generated, the AI identifies your specific skill gaps with encouraging, actionable insights — so you know exactly where to focus.", color: "#6D28D9" },
  { icon: "🏅", title: "Badge & Milestone System", desc: "Earn visual badges as you hit milestones. Each badge is permanently displayed on your portfolio and signals verified competency to employers.", color: "#059669" },
  { icon: "🔔", title: "Work Request Notifications", desc: "Employers can send direct work requests through in-platform notifications — keeping communication streamlined and your personal contact details private.", color: "#C2410C" },
  { icon: "📂", title: "Dual Dashboards", desc: "Job seekers get a progress-tracking dashboard. Employers get a candidate management dashboard — job listings, applicant review, and hiring pipeline.", color: "#B45309" },
  { icon: "🔐", title: "Confidential Disability Profile", desc: "Your disability information is never shared with employers unless you choose to disclose it. The platform focuses entirely on verified skills and portfolio quality.", color: "#1A3A5C" },
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

export default function LearnClient() {
  const { openRoleSelector } = useAuthModalContext();
  const [activeTab, setActiveTab] = useState("seeker");
  const [seekRef, seekVisible] = useInView(0.15);
  const [empRef,  empVisible]  = useInView(0.15);
  const [featRef, featVisible] = useInView(0.15);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
        @keyframes blobMorph { 0%,100%{border-radius:60% 40% 55% 45%/45% 55% 40% 60%;transform:translate(0,0) scale(1)}33%{border-radius:40% 60% 45% 55%/55% 45% 60% 40%;transform:translate(20px,-15px) scale(1.05)}66%{border-radius:50% 50% 60% 40%/40% 60% 50% 50%;transform:translate(-10px,10px) scale(0.97)} }
        @keyframes sparkFloat { 0%,100%{transform:translateY(0) scale(1);opacity:0.6}50%{transform:translateY(-18px) scale(1.3);opacity:1} }
        @keyframes shimmer { 0%{background-position:-200% center}100%{background-position:200% center} }
        @keyframes slideUp { from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)} }
        @keyframes badgeBounce { 0%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}60%{transform:translateY(-4px)} }
        @keyframes glowBorder { 0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,0.25),0 4px 20px rgba(15,92,110,0.08)}50%{box-shadow:0 0 0 4px rgba(52,211,153,0.12),0 8px 28px rgba(15,92,110,0.15)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,0.4)}50%{box-shadow:0 0 0 12px rgba(52,211,153,0)} }
      `}</style>

      {/* HERO */}
      <div style={{ position: "relative", background: "linear-gradient(135deg, #0A3D4A 0%, #1A3A5C 100%)", paddingTop: 140, paddingBottom: 100, paddingLeft: 32, paddingRight: 32, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", right: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(125,220,232,0.12) 0%, transparent 70%)", animation: "blobMorph 10s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: 320, height: 320, background: "radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 70%)", animation: "blobMorph 13s ease-in-out 2s infinite", pointerEvents: "none" }} />
        <Sparkles count={10} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
            {["📖 Full Guide", "👤 Job Seekers", "🏢 Employers", "⚡ Features"].map((badge, i) => (
              <span key={badge} style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: "6px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#E0F8FA", animation: `sparkFloat ${4 + i}s ease-in-out ${i * 0.5}s infinite` }}>{badge}</span>
            ))}
          </div>

          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#7DDCE8", display: "block", marginBottom: 16 }}>Platform Guide</span>

          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 400, color: "#fff", lineHeight: 1.1, marginBottom: 24, maxWidth: 700 }}>
            How to Use{" "}
            <span style={{ fontStyle: "italic", background: "linear-gradient(100deg, #7DDCE8, #34D399, #7DDCE8)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 3s linear infinite" }}>InklusiJobs</span>
          </h1>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(224,248,250,0.82)", lineHeight: 1.8, maxWidth: 580, marginBottom: 48 }}>
            A complete walkthrough — whether you&apos;re a PWD job seeker building your verified portfolio, or an employer looking for skilled inclusive talent.
          </p>

          {/* Jump links */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "For Job Seekers", id: "seeker" },
              { label: "For Employers",   id: "employer" },
              { label: "Platform Features", id: "features" },
            ].map((link) => (
              <button key={link.id} onClick={() => { setActiveTab(link.id); document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" }); }}
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: "#E0F8FA", background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.25)", padding: "9px 20px", borderRadius: 100, cursor: "pointer", backdropFilter: "blur(8px)", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}>
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
            <path d="M0,40 C360,70 1080,10 1440,40 L1440,60 L0,60 Z" fill="#FAF8F5" />
          </svg>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>

        {/* JOB SEEKER STEPS */}
        <div id="seeker" ref={seekRef} style={{ marginBottom: 96 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0F5C6E", borderRadius: 99, padding: "6px 18px", marginBottom: 16 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#fff" }}>👤 For Job Seekers</span>
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 12, lineHeight: 1.15 }}>
            Your journey from <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>skilled to employed</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 44, lineHeight: 1.7, maxWidth: 580 }}>
            Six steps to build a verified portfolio and land an inclusive job — no work history required.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {seekerSteps.map((s, i) => (
              <div key={s.title} style={{ background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 18, padding: "26px 28px", display: "flex", gap: 22, alignItems: "flex-start", boxShadow: "0 2px 12px rgba(15,92,110,0.05)", animation: seekVisible ? `slideUp 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms both` : "none", transition: "box-shadow 0.2s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 28px rgba(15,92,110,0.12)`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(15,92,110,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                {/* Step badge */}
                <div style={{ flexShrink: 0, width: 50, height: 50, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: `0 4px 14px ${s.color}44`, animation: seekVisible ? `badgeBounce 2s ease-in-out ${i * 250}ms infinite` : "none" }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: s.color, background: s.color + "15", border: `1px solid ${s.color}33`, borderRadius: 99, padding: "3px 12px" }}>{s.step}</span>
                    <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A1A2E", margin: 0 }}>{s.title}</h3>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#4A6070", lineHeight: 1.8, margin: 0 }}>{s.desc}</p>
                  {/* Progress bar */}
                  <div style={{ marginTop: 14, height: 3, background: "#EEF4F6", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: seekVisible ? `${((i + 1) / seekerSteps.length) * 100}%` : "0%", background: `linear-gradient(90deg, ${s.color}, #34D399)`, borderRadius: 99, transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${300 + i * 150}ms` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EMPLOYER STEPS */}
        <div id="employer" ref={empRef} style={{ marginBottom: 96 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1A3A5C", borderRadius: 99, padding: "6px 18px", marginBottom: 16 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#fff" }}>🏢 For Employers</span>
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 12, lineHeight: 1.15 }}>
            Your <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>hiring journey</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 44, lineHeight: 1.7, maxWidth: 560 }}>
            From account setup to your first inclusive hire — five simple steps.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {employerSteps.map((s, i) => (
              <TiltCard key={s.title} style={{ background: "#0F5C6E", borderRadius: 18, padding: "28px 24px", animation: empVisible ? `slideUp 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms both` : "none", cursor: "default", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(125,220,232,0.12)", pointerEvents: "none" }} />
                <div style={{ fontSize: 32, marginBottom: 12, animation: empVisible ? `badgeBounce 2.2s ease-in-out ${i * 280}ms infinite` : "none", display: "inline-block" }}>{s.icon}</div>
                <div style={{ height: 2, width: 32, background: "#34D399", borderRadius: 99, marginBottom: 14 }} />
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(125,220,232,0.7)", marginBottom: 6, letterSpacing: "1px", textTransform: "uppercase" }}>{s.step}</div>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(224,248,250,0.78)", lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* PLATFORM FEATURES */}
        <div id="features" ref={featRef} style={{ marginBottom: 96 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", marginBottom: 12 }}>Built for Everyone</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1A1A2E", marginBottom: 12, lineHeight: 1.15 }}>
            Platform <span style={{ fontStyle: "italic", color: "#0F5C6E" }}>features</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 44 }}>Built with accessibility and inclusion at every layer.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {platformFeatures.map((f, i) => (
              <TiltCard key={f.title} style={{ background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 18, padding: "28px 24px", boxShadow: "0 2px 12px rgba(15,92,110,0.05)", animation: featVisible ? `slideUp 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms both` : "none", animationPlayState: featVisible ? "running" : "paused", cursor: "default" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: f.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16, boxShadow: `0 4px 14px ${f.color}44` }}>{f.icon}</div>
                <div style={{ height: 2, width: 32, background: f.color, borderRadius: 99, marginBottom: 14 }} />
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A1A2E", marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#4A6070", lineHeight: 1.75, margin: 0 }}>{f.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ position: "relative", background: "linear-gradient(135deg, #0F5C6E 0%, #0A3D4A 100%)", borderRadius: 28, padding: "72px 48px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", overflow: "hidden" }}>
          <Sparkles count={12} />
          <div style={{ position: "absolute", top: "-20%", right: "-5%", width: 300, height: 300, background: "radial-gradient(circle, rgba(125,220,232,0.15) 0%, transparent 70%)", animation: "blobMorph 8s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 400, color: "#fff", marginBottom: 16, lineHeight: 1.2 }}>
              Ready to get <span style={{ fontStyle: "italic", color: "#7DDCE8" }}>started?</span>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(224,248,250,0.75)", maxWidth: 440, lineHeight: 1.8, marginBottom: 44 }}>
              Join hundreds of PWDs and inclusive employers already using InklusiJobs.
            </p>
            <button onClick={openRoleSelector} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, background: "#34D399", color: "#0A3D2E", padding: "16px 44px", borderRadius: 14, border: "none", cursor: "pointer", boxShadow: "0 4px 24px rgba(52,211,153,0.4)", animation: "pulse 3s ease-in-out infinite", transition: "transform 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              Create Your Free Account →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}