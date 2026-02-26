"use client";

import { useAuthModalContext } from "@/components/landing/AuthModalContext";

const C = {
  navy: "#1A2744",
  navyEnd: "#1E2F55",
  accent: "#7286D3",
  accentLight: "#EEF1FF",
  bg: "#F9F8F6",
  card: "#FFFFFF",
  success: "#16A34A",
  successBg: "#DCFCE7",
  muted: "#6B7280",
  border: "#E5E7EB",
};

const BENEFITS = [
  {
    icon: "🤖",
    title: "AI-Verified Skills",
    desc: "Every candidate completes real portfolio challenges scored by our AI engine — so you see actual ability, not just credentials on paper.",
  },
  {
    icon: "📉",
    title: "Reduced Hiring Risk",
    desc: "Our verification layer means you only interview candidates who've already proven they can do the work. Less time screening, more time hiring.",
  },
  {
    icon: "🎯",
    title: "Smart Talent Matching",
    desc: "Our AI matches candidates to your role based on verified skills, portfolio scores, and accessibility needs — not keyword-stuffed resumes.",
  },
  {
    icon: "♿",
    title: "Accessibility-First Platform",
    desc: "Built from the ground up for PWD professionals. We handle accommodation matching, verified status, and inclusive onboarding flows.",
  },
];

const STEPS = [
  { num: "01", title: "Post Your Role", desc: "Describe the role, required skills, and any accommodations you offer. Our AI helps structure your listing for maximum reach." },
  { num: "02", title: "Review AI-Matched Candidates", desc: "Browse verified profiles ranked by match score. See portfolio challenge results, skill scores, and accessibility fit at a glance." },
  { num: "03", title: "Interview & Hire", desc: "Connect directly with your top matches. We provide structured interview guides optimized for inclusive hiring." },
];

const STATS = [
  { value: "120+", label: "Inclusive Employers" },
  { value: "94%", label: "Match Accuracy" },
  { value: "18 days", label: "Avg. Time to Hire" },
  { value: "500+", label: "PWD Professionals Hired" },
];

export default function EmployersPage() {
  const { openAsEmployer } = useAuthModalContext();

  return (
    <main id="main-content" style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Lexend','DM Sans',sans-serif" }}>

      {/* ── Hero ── */}
      <section style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyEnd} 100%)`, padding: "80px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Background decoration */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(114,134,211,0.08)", pointerEvents: "none" }} aria-hidden="true" />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(114,134,211,0.06)", pointerEvents: "none" }} aria-hidden="true" />

        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <span style={{ display: "inline-block", background: "rgba(114,134,211,0.2)", border: "1px solid rgba(114,134,211,0.4)", color: C.accent, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", padding: "6px 16px", borderRadius: 99, marginBottom: 20 }}>
            FOR EMPLOYERS
          </span>
          <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 20 }}>
            Hire Verified,<br />
            <span style={{ color: C.accent }}>Job-Ready Talent</span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
            InklusiJobs connects you with AI-verified PWD professionals who have proven their skills through real portfolio challenges — not just resumes.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={openAsEmployer}
              style={{ padding: "14px 32px", borderRadius: 12, border: "none", background: "#FFFFFF", color: C.navy, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", minHeight: 52, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", transition: "transform 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              aria-label="Post a job and start hiring"
            >
              Post a Job →
            </button>
            <button
              style={{ padding: "14px 32px", borderRadius: 12, border: "2px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.08)", color: "#FFFFFF", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", minHeight: 52, backdropFilter: "blur(8px)", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
              aria-label="Book a demo of InklusiJobs"
            >
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "32px 24px" }} aria-label="Platform statistics">
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, textAlign: "center" }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 32, fontWeight: 900, color: C.navy, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Benefits ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 900, color: C.navy, marginBottom: 12 }}>Why Hire Through InklusiJobs?</h2>
          <p style={{ fontSize: 16, color: C.muted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            We don't just connect — we verify. Every candidate has proven their skills before you ever see their profile.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 20 }}>
          {BENEFITS.map((b, i) => (
            <article
              key={i}
              style={{ background: C.card, borderRadius: 20, padding: 28, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(26,39,68,0.06)", transition: "box-shadow 0.2s, transform 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 36px rgba(26,39,68,0.12)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(26,39,68,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }} aria-hidden="true">{b.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: C.navy, marginBottom: 10 }}>{b.title}</h3>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ background: C.card, padding: "80px 24px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 900, color: C.navy, marginBottom: 12 }}>How It Works</h2>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.7 }}>From posting to hiring in 3 simple steps.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 28, padding: "32px 0", borderBottom: i < STEPS.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "flex-start" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${C.navy}, ${C.navyEnd})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 15, flexShrink: 0 }}>
                  {s.num}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Verification explainer ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navyEnd})`, borderRadius: 24, padding: "56px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <span style={{ display: "inline-block", background: "rgba(114,134,211,0.25)", color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", padding: "5px 14px", borderRadius: 99, marginBottom: 20 }}>
              AI VERIFICATION
            </span>
            <h2 style={{ fontSize: "clamp(20px,2.5vw,32px)", fontWeight: 900, color: "#FFFFFF", marginBottom: 16, lineHeight: 1.2 }}>
              What Does "Verified" Actually Mean?
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: 24 }}>
              Every candidate on InklusiJobs completes real portfolio challenges — not multiple choice tests. Our AI engine scores their output based on correctness, creativity, and accessibility standards.
            </p>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
              You see a verified score out of 100 for each skill. No more guessing from resume keywords.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {["Portfolio Challenge Submission", "AI Scoring Engine", "Human Review (if flagged)", "Verified Badge Awarded", "Profile Visible to Employers"].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 18px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{ background: C.accentLight, padding: "64px 24px", textAlign: "center", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,32px)", fontWeight: 900, color: C.navy, marginBottom: 12 }}>Ready to Build an Inclusive Team?</h2>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 32 }}>
            Join 120+ employers across the Philippines who are hiring verified PWD professionals and building stronger, more innovative teams.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={openAsEmployer}
              style={{ padding: "14px 32px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${C.navy}, ${C.navyEnd})`, color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", minHeight: 52, boxShadow: "0 4px 14px rgba(26,39,68,0.25)", transition: "transform 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              Post a Job — It's Free
            </button>
            <button
              style={{ padding: "14px 32px", borderRadius: 12, border: `2px solid ${C.navy}`, background: "none", color: C.navy, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", minHeight: 52 }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(26,39,68,0.05)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              Book a Demo
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}