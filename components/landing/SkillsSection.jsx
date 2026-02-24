"use client";

import { useAuthModalContext } from "@/components/landing/AuthModalContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .skills-section {
    background: #F7F6F4;
    padding: 80px 0;
    font-family: 'DM Sans', sans-serif;
  }

  .skills-container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 60px;
    box-sizing: border-box;
  }

  /* PILL */
  .skills-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #1E293B;
    color: #ffffff;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 8px 16px;
    border-radius: 100px;
    width: fit-content;
    margin-bottom: 36px;
  }
  .skills-pill::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #34D399;
    border-radius: 50%;
  }

  /* TWO-COLUMN GRID */
  .skills-grid {
    display: grid;
    grid-template-columns: 55% 45%;
    align-items: center;
    gap: 48px;
  }

  /* LEFT */
  .skills-left {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .skills-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #2563EB;
    margin: 0;
  }

  .skills-headline {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(52px, 6vw, 80px);
    line-height: 1.05;
    color: #0F1C1B;
    letter-spacing: -1px;
    margin: 0;
  }
  .skills-headline .speaks {
    display: block;
    font-weight: 300;
    font-style: normal;
    text-decoration: underline;
    text-decoration-color: #2563EB;
    text-decoration-thickness: 3px;
    text-underline-offset: 7px;
  }
  .skills-headline .louder {
    display: block;
    font-style: normal;
    font-weight: 800;
    font-size: clamp(58px, 7vw, 90px);
    background: linear-gradient(100deg, #1E40AF 0%, #2563EB 35%, #0EA5E9 70%, #01322C 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .skills-headline .italic-cred {
    display: block;
    font-style: italic;
    font-weight: 400;
    color: #1E293B;
    -webkit-text-fill-color: #1E293B;
  }

  .skills-subtext {
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    color: #64748B;
    line-height: 1.75;
    max-width: 480px;
    font-weight: 400;
    margin: 0;
  }

  /* CTAs */
  .skills-cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }
  .btn-primary {
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    background: #1E40AF;
    color: #ffffff;
    padding: 13px 28px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(30,64,175,0.28);
    transition: background 0.2s, transform 0.15s;
    text-decoration: none;
    display: inline-block;
  }
  .btn-primary:hover { background: #1e3a8a; transform: translateY(-1px); }

  .btn-secondary {
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    background: #ffffff;
    color: #1E293B;
    padding: 13px 28px;
    border-radius: 12px;
    border: 1.5px solid #CBD5E1;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    text-decoration: none;
    display: inline-block;
  }
  .btn-secondary:hover { background: #f8fafc; transform: translateY(-1px); }

  /* RIGHT / CARD */
  .skills-right {
    display: flex;
    justify-content: center;
  }

  .profile-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 28px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 2px 24px rgba(30,41,59,0.10);
    border: 1px solid #E8EDF3;
    display: flex;
    flex-direction: column;
    gap: 20px;
    animation: skills-float 4s ease-in-out infinite;
  }

  @keyframes skills-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .card-avatar {
    width: 44px;
    height: 44px;
    background: #1E293B;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-weight: 700;
    font-size: 16px;
    font-family: 'DM Sans', sans-serif;
    flex-shrink: 0;
  }
  .card-name {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: #1E293B;
    margin: 0;
  }
  .card-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: #94A3B8;
    margin: 2px 0 0;
  }
  .verified-badge {
    margin-left: auto;
    padding: 5px 12px;
    border: 1px solid #BBF7D0;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    color: #15803D;
    background: #F0FDF4;
    white-space: nowrap;
  }

  /* SKILLS BARS */
  .skills-bars {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .skill-row { display: flex; flex-direction: column; gap: 6px; }
  .skill-label-row {
    display: flex;
    justify-content: space-between;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #1E293B;
  }
  .skill-pct {
    font-weight: 400;
    color: #94A3B8;
  }
  .skill-bar-bg {
    height: 8px;
    background: #F1F5F9;
    border-radius: 99px;
    overflow: hidden;
  }
  .skill-bar-fill {
    height: 100%;
    border-radius: 99px;
  }

  /* CARD DIVIDER */
  .card-divider {
    border: none;
    border-top: 1px solid #F1F5F9;
    margin: 0;
  }

  /* MILESTONES */
  .card-milestones {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .milestone-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .milestone-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 4px;
  }
  .milestone-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: #64748B;
    line-height: 1.5;
  }

  /* BADGES */
  .card-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .badge {
    font-family: 'DM Sans', sans-serif;
    padding: 5px 12px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
    border: 1px solid;
  }

  /* TRUST BAR */
  .trust-bar {
    margin-top: 52px;
    padding-top: 24px;
    border-top: 1px solid #E2E8F0;
  }
  .trust-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 36px;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .trust-item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #94A3B8;
  }
`;

const skills = [
  { label: "Figma & Prototyping", pct: 90, from: "#1E40AF", to: "#34D399" },
  { label: "Accessibility Design",  pct: 75, from: "#1E40AF", to: "#6EE7B7" },
  { label: "User Research",         pct: 60, from: "#1E40AF", to: "#A7F3D0" },
];

const milestones = [
  { dot: "#10B981", text: `Completed: "Design an Accessible Dashboard" challenge` },
  { dot: "#F59E0B", text: "Milestone: Intermediate UI/UX unlocked 🎉" },
];

const badges = [
  { label: "✓ Portfolio Live",     bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
  { label: "⚡ 3 Challenges Done", bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  { label: "🏅 Rising Talent",     bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
];

const trustItems = [
  { icon: "✅", label: "WCAG 2.1 AA Compliant" },
  { icon: "🇵🇭", label: "RA 7277 Aligned" },
  { icon: "🤖", label: "AI-Powered Verification" },
  { icon: "🔒", label: "PWD Identity Protected" },
  { icon: "📋", label: "NCDA Partnership Roadmap" },
];

function ProfileCard() {
  return (
    <div className="profile-card">
      {/* Header */}
      <div className="card-header">
        <div className="card-avatar" aria-hidden="true">M</div>
        <div>
          <p className="card-name">Maria Santos</p>
          <p className="card-title">UI/UX Designer · Quezon City</p>
        </div>
        <span className="verified-badge">✓ Verified</span>
      </div>

      {/* Skill Bars */}
      <div className="skills-bars">
        {skills.map((skill) => (
          <div key={skill.label} className="skill-row">
            <div className="skill-label-row">
              <span>{skill.label}</span>
              <span className="skill-pct">{skill.pct}%</span>
            </div>
            <div
              className="skill-bar-bg"
              role="progressbar"
              aria-valuenow={skill.pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${skill.label}: ${skill.pct}%`}
            >
              <div
                className="skill-bar-fill"
                style={{
                  width: `${skill.pct}%`,
                  background: `linear-gradient(90deg, ${skill.from}, ${skill.to})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <hr className="card-divider" />

      {/* Milestones */}
      <div className="card-milestones" role="log" aria-label="Recent activity">
        {milestones.map((item, i) => (
          <div key={i} className="milestone-item">
            <span
              className="milestone-dot"
              style={{ background: item.dot }}
              aria-hidden="true"
            />
            <span className="milestone-text">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="card-badges" role="list" aria-label="Earned badges">
        {badges.map((b) => (
          <span
            key={b.label}
            role="listitem"
            className="badge"
            style={{ background: b.bg, color: b.color, borderColor: b.border }}
          >
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const { openAsWorker, openAsEmployer } = useAuthModalContext();

  return (
    <>
      <style>{styles}</style>
      <section className="skills-section" aria-labelledby="skills-heading">
        <div className="skills-container">

          {/* Pill */}
          <div className="skills-pill" aria-hidden="true">
            ♿ Accessibility First Platform
          </div>

          {/* Two-column grid */}
          <div className="skills-grid">

            {/* LEFT */}
            <div className="skills-left">
              <p className="skills-eyebrow">Built for PWDs. Powered by AI.</p>

              <h2 id="skills-heading" className="skills-headline">
                <span style={{ display: "block", fontWeight: 300 }}>Skills that</span>
                <span className="speaks">speaks</span>
                <span className="louder" aria-label="louder">louder</span>
                <span style={{ display: "block", fontWeight: 300 }}>than</span>
                <span className="italic-cred">credentials</span>
              </h2>

              <p className="skills-subtext">
                InklusiJobs helps Persons with Disabilities become verified,
                job-ready professionals — through personalized learning paths,
                portfolio challenges, and AI-driven skill verification.
              </p>

              <div className="skills-cta-row">
                <button
                  onClick={openAsWorker}
                  className="btn-primary"
                >
                  Start Your Journey
                </button>
                <button
                  onClick={openAsEmployer}
                  className="btn-secondary"
                >
                  I&apos;m an Employer
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="skills-right">
              <ProfileCard />
            </div>
          </div>

          {/* Trust Bar */}
          <div className="trust-bar">
            <ul className="trust-list" aria-label="Platform trust indicators">
              {trustItems.map((item) => (
                <li key={item.label} className="trust-item">
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>
    </>
  );
}