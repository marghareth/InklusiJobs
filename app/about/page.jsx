"use client";

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

const TEAM = [
  { name: "Dr. Ana Reyes", role: "Founder & CEO", bg: C.accent },
  { name: "Carlo Mendoza", role: "CTO & AI Lead", bg: "#0D9488" },
  { name: "Liza Santos", role: "Head of Inclusion", bg: "#8B5CF6" },
  { name: "Paolo Cruz", role: "Head of Employer Partnerships", bg: C.success },
];

const VALUES = [
  { icon: "🤝", title: "Dignity First", desc: "Every feature is built around the dignity and autonomy of PWD professionals. We don't simplify — we amplify." },
  { icon: "🔬", title: "Evidence-Based", desc: "Our AI models are trained on real hiring outcomes — not assumptions. Skills verification is grounded in actual employer data." },
  { icon: "🌏", title: "Filipino-Rooted", desc: "Built for the Philippine context. We understand the local labor market, disability law (RA 7277), and employer landscape." },
  { icon: "⚖️", title: "Radical Fairness", desc: "We remove credentials as a proxy for ability. The only thing that matters is what you can do — verified and proven." },
];

const SDG_GOALS = [
  { num: "8", label: "Decent Work & Economic Growth", desc: "Increasing employment rates among PWD professionals across the Philippines." },
  { num: "10", label: "Reduced Inequalities", desc: "Closing the income and opportunity gap between PWD and non-PWD workers." },
  { num: "17", label: "Partnerships for the Goals", desc: "Collaborating with employers, government, and NGOs toward systemic change." },
];

const MILESTONES = [
  { year: "2022", event: "InklusiJobs founded in Manila after research on PWD unemployment crisis in the Philippines." },
  { year: "2023", event: "Launched AI skill assessment engine and first 50 employer partnerships." },
  { year: "2024", event: "500+ PWD professionals hired. Expanded to Visayas and Mindanao regions." },
  { year: "2025", event: "Launched portfolio challenge platform and AI roadmap personalization." },
];

export default function AboutPage() {
  return (
    <main id="main-content" style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Lexend','DM Sans',sans-serif" }}>

      {/* ── Hero ── */}
      <section style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyEnd} 100%)`, padding: "80px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "rgba(114,134,211,0.2)", border: "1px solid rgba(114,134,211,0.4)", color: C.accent, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", padding: "6px 16px", borderRadius: 99, marginBottom: 20 }}>
            OUR STORY
          </span>
          <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 20 }}>
            Equal Opportunity<br />
            <span style={{ color: C.accent }}>Is Our Mission</span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
            InklusiJobs was built to solve one of the most persistent problems in the Philippine labor market — the systematic exclusion of persons with disabilities from meaningful employment.
          </p>
        </div>
      </section>

      {/* ── Problem statement ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <span style={{ display: "inline-block", background: "#FEE2E2", color: "#DC2626", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", padding: "5px 14px", borderRadius: 99, marginBottom: 20 }}>
              THE PROBLEM
            </span>
            <h2 style={{ fontSize: "clamp(20px,3vw,32px)", fontWeight: 900, color: C.navy, marginBottom: 20, lineHeight: 1.2 }}>
              1 in 10 Filipinos lives with a disability. Most are unemployed.
            </h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 16 }}>
              Despite Republic Act 7277 mandating that 1% of government and large private sector jobs be reserved for PWDs, the unemployment rate among PWD professionals in the Philippines remains over 70%.
            </p>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8 }}>
              The gap isn't about capability — it's about broken hiring systems that rely on credentials, physical interviews, and inaccessible application processes that exclude talented people before they get a chance to prove themselves.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { stat: "70%+", label: "PWD unemployment rate in the Philippines", color: "#DC2626" },
              { stat: "1 in 10", label: "Filipinos lives with a disability", color: C.warning },
              { stat: "< 5%", label: "Companies meet RA 7277 compliance", color: C.accent },
              { stat: "₱0", label: "Average formal income for unemployed PWDs", color: C.navy },
            ].map(s => (
              <div key={s.label} style={{ background: C.card, borderRadius: 14, padding: "20px 24px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: s.color, minWidth: 80 }}>{s.stat}</span>
                <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section style={{ background: C.card, padding: "80px 24px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <div>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 20 }}>🎯</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: C.navy, marginBottom: 14 }}>Our Mission</h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8 }}>
              To eliminate employment barriers for persons with disabilities in the Philippines by replacing credential-based hiring with verified, AI-scored skill portfolios — making talent the only criterion that matters.
            </p>
          </div>
          <div>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: C.successBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 20 }}>🌟</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: C.navy, marginBottom: 14 }}>Our Vision</h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8 }}>
              A Philippines where every person with a disability who wants to work, can work — in roles that match their verified skills, with employers who are equipped and committed to inclusion.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,32px)", fontWeight: 900, color: C.navy, marginBottom: 12 }}>What We Stand For</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20 }}>
          {VALUES.map((v, i) => (
            <div key={i} style={{ background: C.card, borderRadius: 20, padding: 28, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(26,39,68,0.06)" }}>
              <div style={{ fontSize: 36, marginBottom: 16 }} aria-hidden="true">{v.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: C.navy, marginBottom: 10 }}>{v.title}</h3>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SDG alignment ── */}
      <section style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navyEnd})`, padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ display: "inline-block", background: "rgba(114,134,211,0.25)", color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", padding: "5px 14px", borderRadius: 99, marginBottom: 16 }}>
              UN SUSTAINABLE DEVELOPMENT GOALS
            </span>
            <h2 style={{ fontSize: "clamp(20px,3vw,32px)", fontWeight: 900, color: "#FFFFFF", marginBottom: 12 }}>Our SDG Commitment</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
              InklusiJobs directly contributes to three UN Sustainable Development Goals.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
            {SDG_GOALS.map(g => (
              <div key={g.num} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: 28, border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: C.accent, marginBottom: 12 }}>SDG {g.num}</div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#FFFFFF", marginBottom: 10 }}>{g.label}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0 }}>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,32px)", fontWeight: 900, color: C.navy, marginBottom: 12 }}>Our Journey</h2>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 23, top: 8, bottom: 8, width: 2, background: `linear-gradient(180deg, ${C.accent}, ${C.success})` }} aria-hidden="true" />
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {MILESTONES.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, fontWeight: 900, fontSize: 12, flexShrink: 0, zIndex: 1 }}>
                  {m.year}
                </div>
                <div style={{ paddingTop: 10 }}>
                  <p style={{ fontSize: 15, color: C.navy, fontWeight: 600, lineHeight: 1.7, margin: 0 }}>{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section style={{ background: C.card, padding: "80px 24px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(20px,3vw,32px)", fontWeight: 900, color: C.navy, marginBottom: 12 }}>The Team</h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7 }}>Built by advocates, technologists, and people with lived experience.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 20 }}>
            {TEAM.map((t, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${t.bg}, ${C.navy})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 28, margin: "0 auto 16px" }}>
                  {t.name[0]}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 4 }}>{t.name}</h3>
                <p style={{ fontSize: 13, color: C.muted }}>{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}