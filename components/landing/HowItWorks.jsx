"use client";

import { useState, useEffect } from "react";

const steps = [
  {
    number: "01",
    tag: "Get Started",
    title: "Build your profile & get your roadmap",
    description:
      "Tell us your skills, goals, and the kind of work you're looking for. Our AI creates a personalized learning roadmap designed around you — at your own pace, in a format that works for you.",
    visual: "roadmap",
  },
  {
    number: "02",
    tag: "Prove It",
    title: "Complete Challenges & Build Your Portfolio",
    description:
      "Work through real, practical challenges that reflect actual job tasks. Every challenge you complete becomes verified proof of your skills — automatically added to your public portfolio.",
    visual: "portfolio",
  },
  {
    number: "03",
    tag: "Get Hired",
    title: "Get Matched & Get Hired",
    description:
      "Employers browse verified talent by skill, not credentials. When there's a match, they come to you. Apply in one click — your portfolio speaks for itself.",
    visual: "match",
  },
];

function RoadmapMock() {
  const items = [
    { label: "HTML & CSS Basics", pct: 100, done: true },
    { label: "JavaScript Fundamentals", pct: 72, done: false },
    { label: "React Components", pct: 0, done: false },
    { label: "Accessibility Patterns", pct: 0, done: false },
  ];
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 4px 24px rgba(15,92,110,0.10)", border: "1px solid #DDE8EC", width: "100%", maxWidth: 340 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0F5C6E", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>🤖</div>
        <div>
          <div style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 13, color: "#1A1A2E" }}>Your AI Roadmap</div>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#7A9AAA" }}>Frontend Developer Path</div>
        </div>
        <div style={{ marginLeft: "auto", padding: "3px 10px", borderRadius: 99, background: "#F0FDF4", border: "1px solid #BBF7D0", fontFamily: "Arial, sans-serif", fontSize: 10, fontWeight: 700, color: "#15803D" }}>Active</div>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: 12, fontWeight: 600, color: item.done ? "#0F5C6E" : "#1A1A2E", display: "flex", alignItems: "center", gap: 6 }}>
              {item.done && <span style={{ color: "#10B981" }}>✓</span>}{item.label}
            </span>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#7A9AAA" }}>{item.pct}%</span>
          </div>
          <div style={{ height: 6, background: "#E8F2F5", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${item.pct}%`, background: item.done ? "linear-gradient(90deg,#0F5C6E,#34D399)" : "linear-gradient(90deg,#0F5C6E,#1A8FA5)", borderRadius: 99 }} />
          </div>
        </div>
      ))}
      <div style={{ marginTop: 16, padding: "10px 14px", background: "#F0FDFA", borderRadius: 10, border: "1px solid #CCFBF1" }}>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#0F5C6E", fontWeight: 700 }}>⚡ Next up: JavaScript Fundamentals</div>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 10, color: "#4A6070", marginTop: 2 }}>Estimated 3 hrs · 5 challenges</div>
      </div>
    </div>
  );
}

function PortfolioMock() {
  const challenges = [
    { title: "Design an Accessible Form", tag: "UI/UX", status: "Verified", color: "#10B981" },
    { title: "Build a Responsive Layout", tag: "Frontend", status: "Verified", color: "#10B981" },
    { title: "API Integration Challenge", tag: "Backend", status: "In Review", color: "#F59E0B" },
  ];
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 4px 24px rgba(15,92,110,0.10)", border: "1px solid #DDE8EC", width: "100%", maxWidth: 340 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 13, color: "#1A1A2E" }}>My Portfolio</div>
        <div style={{ padding: "3px 10px", borderRadius: 99, background: "#EFF9FB", border: "1px solid #B8E4ED", fontFamily: "Arial, sans-serif", fontSize: 10, fontWeight: 700, color: "#0F5C6E" }}>3 Verified Skills</div>
      </div>
      {challenges.map((c, i) => (
        <div key={i} style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #EEF4F6", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#F0FDFA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>✦</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 12, fontWeight: 600, color: "#1A1A2E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 10, color: "#7A9AAA", marginTop: 2 }}>{c.tag}</div>
          </div>
          <div style={{ flexShrink: 0, fontFamily: "Arial, sans-serif", fontSize: 10, fontWeight: 700, color: c.color }}>● {c.status}</div>
        </div>
      ))}
      <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
        <div style={{ flex: 1, padding: "8px 0", textAlign: "center", borderRadius: 8, background: "#0F5C6E", color: "#fff", fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700 }}>Share Portfolio</div>
        <div style={{ flex: 1, padding: "8px 0", textAlign: "center", borderRadius: 8, background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#1A3A5C", fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700 }}>View Public</div>
      </div>
    </div>
  );
}

function MatchMock() {
  const jobs = [
    { role: "UI/UX Designer", company: "TechInclusive PH", match: 94, location: "Remote" },
    { role: "Frontend Developer", company: "Accessible Apps Co.", match: 88, location: "Quezon City" },
    { role: "Accessibility Auditor", company: "IncluWork", match: 81, location: "Remote" },
  ];
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 4px 24px rgba(15,92,110,0.10)", border: "1px solid #DDE8EC", width: "100%", maxWidth: 340 }}>
      <div style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 13, color: "#1A1A2E", marginBottom: 4 }}>Your Job Matches</div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#7A9AAA", marginBottom: 18 }}>Based on your verified skills</div>
      {jobs.map((j, i) => (
        <div key={i} style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #EEF4F6", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#0F5C6E,#1A8FA5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
            {j.role[0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 12, fontWeight: 700, color: "#1A1A2E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{j.role}</div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 10, color: "#7A9AAA", marginTop: 1 }}>{j.company} · {j.location}</div>
          </div>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 800, color: "#0F5C6E" }}>{j.match}%</div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 9, color: "#7A9AAA" }}>match</div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 10, padding: "10px 14px", background: "#FFF7ED", borderRadius: 10, border: "1px solid #FED7AA", fontFamily: "Arial, sans-serif", fontSize: 11, color: "#C2410C", fontWeight: 600 }}>
        🔔 2 employers viewed your profile today
      </div>
    </div>
  );
}

const visuals = { roadmap: RoadmapMock, portfolio: PortfolioMock, match: MatchMock };

export default function HowItWorksSection() {
  const [arrowPos, setArrowPos] = useState(0);

  useEffect(() => {
    let frame;
    let start;
    const animate = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      setArrowPos(Math.sin(t * Math.PI * 2 / 1.1) * 5 + 5);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section id="how-it-works" style={{ background: "#F0EDE8", padding: "100px 0" }} aria-labelledby="how-it-works-heading">

      {/* Section header */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 60px", marginBottom: 80 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "inline-block", background: "#0F5C6E", borderRadius: 12, padding: "6px 16px", marginBottom: 16 }}>
              <span style={{ fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#fff" }}>How It Works</span>
            </div>
            <h2 id="how-it-works-heading" style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: "#1A1A2E", margin: 0, lineHeight: 1.2 }}>
              From skilled to employed —{" "}
              <span style={{ fontWeight: 800, color: "#0F5C6E" }}>three steps.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Steps */}
      {steps.map((step, i) => {
        const Visual = visuals[step.visual];
        const isEven = i % 2 === 1;
        return (
          <div
            key={step.number}
            style={{
              maxWidth: 1280,
              margin: "0 auto 0",
              padding: "60px 60px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
              borderTop: i === 0 ? "1px solid #C8D8E0" : "none",
            }}
          >
            {/* Text side */}
            <div style={{ order: isEven ? 2 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <span style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 72, fontWeight: 900, color: "rgba(15,92,110,0.10)", lineHeight: 1 }}>{step.number}</span>
                <span style={{ padding: "4px 12px", borderRadius: 99, background: "#0F5C6E", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#fff" }}>{step.tag}</span>
              </div>
              <h3 style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 700, color: "#1A1A2E", margin: "0 0 20px", lineHeight: 1.25 }}>{step.title}</h3>
              <p style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 16, color: "#4A6070", lineHeight: 1.8, margin: 0 }}>{step.description}</p>

              {/* Divider line */}
              <div style={{ marginTop: 36, height: 2, width: 48, background: "linear-gradient(90deg, #0F5C6E, #34D399)", borderRadius: 99 }} />
            </div>

            {/* Visual side */}
            <div style={{ order: isEven ? 1 : 2, display: "flex", justifyContent: "center" }}>
              <div style={{ animation: "hiw-float 5s ease-in-out infinite", animationDelay: `${i * 0.5}s` }}>
                <Visual />
              </div>
            </div>
          </div>
        );
      })}

      {/* Bottom CTA banner */}
      <div style={{ maxWidth: 1280, margin: "60px auto 0", padding: "0 60px" }}>
        <div style={{ background: "#0F5C6E", borderRadius: 24, padding: "48px 52px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "clamp(24px,3vw,40px)", fontWeight: 800, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>
              Verified. Skilled. Employed.
            </p>
            <p style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 15, color: "rgba(255,255,255,0.7)", margin: 0 }}>
              Join 500+ PWD professionals already on the platform.
            </p>
          </div>
          <button
            style={{
              padding: "14px 32px", borderRadius: 14, background: "#34D399", border: "none",
              color: "#0A3D2E", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 15,
              fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap",
              boxShadow: "0 4px 20px rgba(52,211,153,0.35)",
              display: "inline-flex", alignItems: "center", gap: 10,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(52,211,153,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(52,211,153,0.35)"; }}
          >
            Start Your Journey
            <span aria-hidden="true" style={{ display: "inline-block", fontSize: 18, transform: `translateX(${arrowPos}px)` }}>→</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes hiw-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}