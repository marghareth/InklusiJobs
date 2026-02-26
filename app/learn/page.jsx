"use client";

import { useState } from "react";

const C = {
  navy: "#1A2744",
  navyEnd: "#1E2F55",
  accent: "#7286D3",
  accentLight: "#EEF1FF",
  bg: "#F9F8F6",
  card: "#FFFFFF",
  success: "#16A34A",
  successBg: "#DCFCE7",
  warning: "#D97706",
  warningBg: "#FEF3C7",
  muted: "#6B7280",
  border: "#E5E7EB",
};

const TRACKS = [
  {
    id: "tech",
    label: "Technology",
    icon: "💻",
    roles: ["Frontend Developer", "Data Analyst", "QA Engineer", "UI/UX Designer"],
  },
  {
    id: "creative",
    label: "Creative",
    icon: "🎨",
    roles: ["Content Writer", "Graphic Designer", "Video Editor", "Social Media Manager"],
  },
  {
    id: "business",
    label: "Business",
    icon: "📊",
    roles: ["Virtual Assistant", "Customer Support", "Project Coordinator", "HR Assistant"],
  },
];

const ROADMAP_STEPS = [
  {
    step: "01",
    title: "Skill Assessment",
    subtitle: "Know where you stand",
    desc: "Complete a short AI-powered assessment that maps your current abilities to real job requirements. No grades — just honest, actionable insights.",
    tags: ["15–20 minutes", "No prior experience needed", "Adaptive questions"],
    color: C.accent,
  },
  {
    step: "02",
    title: "AI Skill Roadmap",
    subtitle: "Your personalized learning path",
    desc: "Based on your assessment, our AI generates a step-by-step roadmap of skills to build — prioritized by what employers are actually hiring for right now.",
    tags: ["Personalized to you", "Updated monthly", "Role-specific"],
    color: "#0D9488",
  },
  {
    step: "03",
    title: "Portfolio Challenges",
    subtitle: "Prove your skills, not just claim them",
    desc: "Complete real-world project challenges designed by industry experts. Each challenge is scored by our AI and reviewed by hiring managers.",
    tags: ["Real projects", "AI-scored", "Employer-reviewed"],
    color: C.warning,
  },
  {
    step: "04",
    title: "Get Verified",
    subtitle: "Earn your verified badge",
    desc: "Pass your portfolio challenges and receive a verified skill badge visible to all employers on InklusiJobs. This is what gets you interviews.",
    tags: ["Shareable badge", "Skill-specific", "Employer-trusted"],
    color: C.success,
  },
  {
    step: "05",
    title: "Get Hired",
    subtitle: "Jobs matched to your verified skills",
    desc: "Your profile is automatically matched to open roles. Employers see your verified scores, portfolio, and accessibility needs — and reach out directly.",
    tags: ["AI job matching", "Direct employer contact", "Inclusive employers only"],
    color: "#8B5CF6",
  },
];

const FAQS = [
  {
    q: "Do I need work experience to start?",
    a: "No. InklusiJobs is built to help you build and verify skills from scratch. Our roadmaps start from zero and progress at your own pace.",
  },
  {
    q: "How long does it take to get verified?",
    a: "Most learners complete their first verification in 2–4 weeks, depending on the skill and how much time they dedicate each day.",
  },
  {
    q: "Are the portfolio challenges accessible?",
    a: "Yes. All challenges are designed with PWD users in mind — screen reader compatible, adjustable time limits, and multiple input formats supported.",
  },
  {
    q: "Is this free?",
    a: "Yes. The skill assessment, roadmap, and first portfolio challenge are completely free. Premium tracks unlock advanced challenges and priority job matching.",
  },
  {
    q: "What if I need accommodations during challenges?",
    a: "You can request extended time, alternative formats, or assistive tech support at any point. Just update your profile and our team will accommodate.",
  },
];

export default function LearnPage() {
  const [activeTrack, setActiveTrack] = useState("tech");
  const [openFaq, setOpenFaq] = useState(null);

  const track = TRACKS.find(t => t.id === activeTrack);

  return (
    <main id="main-content" style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Lexend','DM Sans',sans-serif" }}>

      {/* ── Hero ── */}
      <section style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyEnd} 100%)`, padding: "80px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "rgba(114,134,211,0.2)", border: "1px solid rgba(114,134,211,0.4)", color: C.accent, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", padding: "6px 16px", borderRadius: 99, marginBottom: 20 }}>
            SKILL DEVELOPMENT
          </span>
          <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 20 }}>
            From Skills to<br />
            <span style={{ color: C.accent }}>Employment</span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, maxWidth: 520, margin: "0 auto 36px" }}>
            Our AI-powered learning system doesn't just teach — it verifies. Build real skills, earn verified badges, and get matched to employers who are ready to hire you.
          </p>
          <button
            style={{ padding: "14px 32px", borderRadius: 12, border: "none", background: "#FFFFFF", color: C.navy, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", minHeight: 52 }}
          >
            Start Your Assessment →
          </button>
        </div>
      </section>

      {/* ── Career tracks ── */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,32px)", fontWeight: 900, color: C.navy, marginBottom: 12 }}>Choose Your Career Track</h2>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7 }}>Pick a track and we'll build a personalized roadmap for you.</p>
        </div>

        {/* Track tabs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 32, flexWrap: "wrap" }}>
          {TRACKS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTrack(t.id)}
              style={{ padding: "12px 24px", borderRadius: 12, border: `2px solid ${activeTrack === t.id ? C.navy : C.border}`, background: activeTrack === t.id ? C.navy : C.card, color: activeTrack === t.id ? "#fff" : C.muted, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s", minHeight: 44 }}
              aria-pressed={activeTrack === t.id}
            >
              <span aria-hidden="true">{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Track roles */}
        <div style={{ background: C.card, borderRadius: 20, padding: 32, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(26,39,68,0.06)" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", marginBottom: 16 }}>ROLES IN THIS TRACK</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {track.roles.map(r => (
              <span key={r} style={{ background: C.accentLight, color: C.accent, fontSize: 14, fontWeight: 700, padding: "10px 18px", borderRadius: 10 }}>{r}</span>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: "16px 20px", background: C.accentLight, borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 14, color: C.navy, fontWeight: 600 }}>Ready to start your {track.label} roadmap?</span>
            <button style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: C.navy, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", minHeight: 44 }}>
              Get My Roadmap
            </button>
          </div>
        </div>
      </section>

      {/* ── Roadmap steps ── */}
      <section style={{ background: C.card, padding: "80px 24px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: "clamp(20px,3vw,32px)", fontWeight: 900, color: C.navy, marginBottom: 12 }}>Your Path to Employment</h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7 }}>A structured 5-step journey from where you are to where you want to be.</p>
          </div>

          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div style={{ position: "absolute", left: 27, top: 28, bottom: 28, width: 2, background: `linear-gradient(180deg, ${C.accent}, ${C.success})`, borderRadius: 2 }} aria-hidden="true" />

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {ROADMAP_STEPS.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 24, paddingBottom: i < ROADMAP_STEPS.length - 1 ? 40 : 0, position: "relative" }}>
                  {/* Step circle */}
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14, flexShrink: 0, zIndex: 1, boxShadow: `0 4px 14px ${s.color}44` }}>
                    {s.step}
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1, paddingTop: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: s.color, letterSpacing: "0.08em", marginBottom: 4 }}>{s.subtitle.toUpperCase()}</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 10 }}>{s.title}</h3>
                    <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 14 }}>{s.desc}</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {s.tags.map(tag => (
                        <span key={tag} style={{ background: "#F3F4F6", color: C.navy, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,32px)", fontWeight: 900, color: C.navy, marginBottom: 12 }}>Frequently Asked Questions</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background: C.card, borderRadius: 14, border: `1px solid ${openFaq === i ? C.accent : C.border}`, overflow: "hidden", transition: "border-color 0.15s" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", padding: "18px 22px", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
                aria-expanded={openFaq === i}
              >
                <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{faq.q}</span>
                <span style={{ fontSize: 18, color: C.accent, transform: openFaq === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 22px 18px" }}>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, margin: 0 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navyEnd})`, padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 900, color: "#FFFFFF", marginBottom: 12 }}>Start Building Your Future Today</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 32 }}>
            Your skill assessment is free, takes 15 minutes, and gives you a personalized roadmap to your first verified job.
          </p>
          <button style={{ padding: "14px 32px", borderRadius: 12, border: "none", background: "#FFFFFF", color: C.navy, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", minHeight: 52 }}>
            Take the Free Assessment →
          </button>
        </div>
      </section>
    </main>
  );
}