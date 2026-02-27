//SkillsSection.jsx
"use client";

import { useAuthModalContext } from "@/components/landing/AuthModalContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .skills-section {
    background: #FAF8F5;
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

  .skills-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #0F5C6E;
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

  .skills-grid {
    display: grid;
    grid-template-columns: 50% 50%;
    align-items: center;
    gap: 32px;
  }

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
    color: #0F5C6E;
    margin: 0;
  }

  .skills-headline {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(52px, 6vw, 80px);
    line-height: 1.05;
    color: #1A1A2E;
    letter-spacing: -1px;
    margin: 0;
  }
  .skills-headline .speaks {
    display: block;
    font-weight: 300;
    font-style: normal;
    text-decoration: underline;
    text-decoration-color: #0F5C6E;
    text-decoration-thickness: 3px;
    text-underline-offset: 7px;
  }
  .skills-headline .louder {
    display: block;
    font-style: normal;
    font-weight: 800;
    font-size: clamp(58px, 7vw, 90px);
    background: linear-gradient(100deg, #0F5C6E 0%, #1A8FA5 40%, #34D399 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .skills-headline .italic-cred {
    display: block;
    font-style: italic;
    font-weight: 400;
    color: #1A3A5C;
    -webkit-text-fill-color: #1A3A5C;
  }

  .skills-subtext {
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    color: #4A6070;
    line-height: 1.75;
    max-width: 480px;
    font-weight: 400;
    margin: 0;
  }

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
    background: #0F5C6E;
    color: #ffffff;
    padding: 13px 28px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(15,92,110,0.28);
    transition: background 0.2s, transform 0.15s;
    text-decoration: none;
    display: inline-block;
  }
  .btn-primary:hover { background: #0A4A5A; transform: translateY(-1px); }

  .btn-secondary {
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    background: #ffffff;
    color: #1A3A5C;
    padding: 13px 28px;
    border-radius: 12px;
    border: 1.5px solid #C8D8E0;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    text-decoration: none;
    display: inline-block;
  }
  .btn-secondary:hover { background: #F0F7F9; transform: translateY(-1px); }

  .skills-right {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .profile-card {
    background: #ffffff;
    border-radius: 24px;
    padding: 36px;
    width: 100%;
    max-width: 100%;
    box-shadow: 0 8px 48px rgba(15,92,110,0.14);
    border: 1px solid #DDE8EC;
    display: flex;
    flex-direction: column;
    gap: 24px;
    animation: skills-float 4s ease-in-out infinite;
  }

  @keyframes skills-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .card-avatar {
    width: 54px;
    height: 54px;
    background: #0F5C6E;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-weight: 700;
    font-size: 20px;
    font-family: 'DM Sans', sans-serif;
    flex-shrink: 0;
  }
  .card-name {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 16px;
    color: #1A1A2E;
    margin: 0;
  }
  .card-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #7A9AAA;
    margin: 3px 0 0;
  }
  .verified-badge {
    margin-left: auto;
    padding: 6px 14px;
    border: 1px solid #BBF7D0;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #15803D;
    background: #F0FDF4;
    white-space: nowrap;
  }

  .skills-bars {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .skill-row { display: flex; flex-direction: column; gap: 8px; }
  .skill-label-row {
    display: flex;
    justify-content: space-between;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #1A1A2E;
  }
  .skill-pct {
    font-weight: 400;
    color: #7A9AAA;
  }
  .skill-bar-bg {
    height: 10px;
    background: #E8F2F5;
    border-radius: 99px;
    overflow: hidden;
  }
  .skill-bar-fill {
    height: 100%;
    border-radius: 99px;
  }

  .card-divider {
    border: none;
    border-top: 1px solid #EEF4F6;
    margin: 0;
  }

  .card-milestones {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .milestone-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .milestone-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 4px;
  }
  .milestone-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #4A6070;
    line-height: 1.5;
  }

  .card-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .badge {
    font-family: 'DM Sans', sans-serif;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 700;
    border: 1px solid;
  }

  .trust-bar {
    margin-top: 52px;
    padding-top: 24px;
    border-top: 1px solid #DDE8EC;
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
    color: #7A9AAA;
  }
`;

const skills = [
  { label: "Figma & Prototyping", pct: 90, from: "#0F5C6E", to: "#34D399" },
  { label: "Accessibility Design",  pct: 75, from: "#0F5C6E", to: "#6EE7B7" },
  { label: "User Research",         pct: 60, from: "#0F5C6E", to: "#A7F3D0" },
];

const milestones = [
  { dot: "#10B981", text: `Completed: "Design an Accessible Dashboard" challenge` },
  { dot: "#F59E0B", text: "Milestone: Intermediate UI/UX unlocked 🎉" },
];

const badges = [
  { label: "✓ Portfolio Live",     bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
  { label: "⚡ 3 Challenges Done", bg: "#EFF9FB", color: "#0F5C6E", border: "#B8E4ED" },
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
      <div className="card-header">
        <div className="card-avatar" aria-hidden="true">M</div>
        <div>
          <p className="card-name">Maria Santos</p>
          <p className="card-title">UI/UX Designer · Quezon City</p>
        </div>
        <span className="verified-badge">✓ Verified</span>
      </div>

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
                style={{ width: `${skill.pct}%`, background: `linear-gradient(90deg, ${skill.from}, ${skill.to})` }}
              />
            </div>
          </div>
        ))}
      </div>

      <hr className="card-divider" />

      <div className="card-milestones" role="log" aria-label="Recent activity">
        {milestones.map((item, i) => (
          <div key={i} className="milestone-item">
            <span className="milestone-dot" style={{ background: item.dot }} aria-hidden="true" />
            <span className="milestone-text">{item.text}</span>
          </div>
        ))}
      </div>

      <div className="card-badges" role="list" aria-label="Earned badges">
        {badges.map((b) => (
          <span key={b.label} role="listitem" className="badge" style={{ background: b.bg, color: b.color, borderColor: b.border }}>
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
          <div className="skills-pill" aria-hidden="true">♿ Accessibility First Platform</div>

          <div className="skills-grid">
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
                <button onClick={openAsWorker} className="btn-primary">Start Your Journey</button>
                <button onClick={openAsEmployer} className="btn-secondary">I&apos;m an Employer</button>
              </div>
            </div>

            <div className="skills-right">
              <ProfileCard />
            </div>
          </div>

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