"use client";

import { useState } from "react";
import Link from "next/link";

// ── Color tokens matching InklusiJobs design system ──────────────────────────
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
  muted: "#6B7280",
  border: "#E5E7EB",
  error: "#DC2626",
};

const JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechBridge PH",
    type: "Full-time",
    level: "Mid-level",
    mode: "Remote",
    description: "Build accessible, responsive web interfaces using React and TypeScript. PWD-friendly workspace with full accommodations.",
    skills: ["React", "TypeScript", "Accessibility"],
    verified: true,
    inclusive: true,
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Insight Analytics Co.",
    type: "Part-time",
    level: "Entry-level",
    mode: "Remote",
    description: "Analyze datasets and generate insights for business decisions. Flexible hours and screen-reader compatible tools provided.",
    skills: ["SQL", "Python", "Power BI"],
    verified: true,
    inclusive: true,
    posted: "3 days ago",
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "DesignForAll Studio",
    type: "Full-time",
    level: "Senior",
    mode: "Hybrid",
    description: "Design inclusive digital products with a focus on WCAG compliance. Assistive tech support and ergonomic setup provided.",
    skills: ["Figma", "User Research", "WCAG"],
    verified: true,
    inclusive: true,
    posted: "1 week ago",
  },
  {
    id: 4,
    title: "Customer Support Specialist",
    company: "CareFront Solutions",
    type: "Full-time",
    level: "Entry-level",
    mode: "Onsite",
    description: "Assist customers via chat and email. Quiet workspace, adjustable desks, and sign language interpreter available.",
    skills: ["Communication", "CRM Tools", "Problem Solving"],
    verified: false,
    inclusive: true,
    posted: "5 days ago",
  },
  {
    id: 5,
    title: "Backend Developer",
    company: "CloudStack PH",
    type: "Full-time",
    level: "Mid-level",
    mode: "Remote",
    description: "Build and maintain scalable APIs. Fully remote with async-first culture — ideal for various disability accommodations.",
    skills: ["Node.js", "PostgreSQL", "Docker"],
    verified: true,
    inclusive: false,
    posted: "Today",
  },
  {
    id: 6,
    title: "Content Writer",
    company: "WordBridge Media",
    type: "Freelance",
    level: "Entry-level",
    mode: "Remote",
    description: "Write SEO-optimized articles and blog posts. Fully flexible schedule — work at your own pace and terms.",
    skills: ["SEO Writing", "Research", "Google Docs"],
    verified: false,
    inclusive: true,
    posted: "4 days ago",
  },
];

const WORK_TYPES  = ["All", "Full-time", "Part-time", "Freelance"];
const SKILL_LEVELS = ["All", "Entry-level", "Mid-level", "Senior"];
const MODES       = ["All", "Remote", "Hybrid", "Onsite"];

export default function FindWorkPage() {
  const [search,    setSearch]    = useState("");
  const [workType,  setWorkType]  = useState("All");
  const [level,     setLevel]     = useState("All");
  const [mode,      setMode]      = useState("All");
  const [inclusive, setInclusive] = useState(false);

  const filtered = JOBS.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                        j.company.toLowerCase().includes(search.toLowerCase()) ||
                        j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchType      = workType  === "All" || j.type === workType;
    const matchLevel     = level     === "All" || j.level === level;
    const matchMode      = mode      === "All" || j.mode === mode;
    const matchInclusive = !inclusive || j.inclusive;
    return matchSearch && matchType && matchLevel && matchMode && matchInclusive;
  });

  return (
    <main id="main-content" style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Lexend','DM Sans',sans-serif" }}>

      {/* ── Hero ── */}
      <section style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyEnd} 100%)`, padding: "80px 24px 64px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "rgba(114,134,211,0.2)", border: "1px solid rgba(114,134,211,0.4)", color: C.accent, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", padding: "6px 16px", borderRadius: 99, marginBottom: 20 }}>
            FOR JOB SEEKERS
          </span>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.15, marginBottom: 16 }}>
            Find Verified Opportunities
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: 36, maxWidth: 560, margin: "0 auto 36px" }}>
            Every job here is posted by employers committed to inclusive hiring. Your skills are verified by AI — no bias, no barriers.
          </p>

          {/* Search bar */}
          <div style={{ position: "relative", maxWidth: 580, margin: "0 auto" }}>
            <svg style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by job title, company, or skill…"
              aria-label="Search jobs"
              style={{ width: "100%", padding: "16px 20px 16px 50px", borderRadius: 14, border: "1.5px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.1)", color: "#FFFFFF", fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box", backdropFilter: "blur(8px)" }}
            />
          </div>
        </div>
      </section>

      {/* ── Filters + Grid ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* Sidebar filters */}
          <aside style={{ width: 220, flexShrink: 0, background: C.card, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(26,39,68,0.06)", position: "sticky", top: 100 }} aria-label="Job filters">
            <h2 style={{ fontSize: 13, fontWeight: 800, color: C.navy, letterSpacing: "0.08em", marginBottom: 20 }}>FILTERS</h2>

            <FilterGroup label="Work Type" options={WORK_TYPES} value={workType} onChange={setWorkType} />
            <FilterGroup label="Skill Level" options={SKILL_LEVELS} value={level} onChange={setLevel} />
            <FilterGroup label="Work Mode" options={MODES} value={mode} onChange={setMode} />

            {/* Inclusive employers toggle */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", marginBottom: 10 }}>INCLUSION</div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: C.navy, fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={inclusive}
                  onChange={e => setInclusive(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: C.accent }}
                  aria-label="Show only PWD-friendly employers"
                />
                PWD-Friendly Only
              </label>
            </div>

            {/* Reset */}
            <button
              onClick={() => { setSearch(""); setWorkType("All"); setLevel("All"); setMode("All"); setInclusive(false); }}
              style={{ marginTop: 24, width: "100%", padding: "10px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "none", color: C.muted, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
            >
              Reset Filters
            </button>
          </aside>

          {/* Job grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <p style={{ fontSize: 14, color: C.muted, fontWeight: 600 }}>
                <span style={{ color: C.navy, fontWeight: 800 }}>{filtered.length}</span> jobs found
              </p>
              <select style={{ padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.navy, fontWeight: 600, background: C.card, cursor: "pointer", fontFamily: "inherit" }} aria-label="Sort jobs">
                <option>Most Recent</option>
                <option>Best Match</option>
                <option>AI Verified First</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: C.muted }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <p style={{ fontSize: 16, fontWeight: 600 }}>No jobs match your filters.</p>
                <p style={{ fontSize: 14 }}>Try adjusting your search or clearing filters.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                {filtered.map(job => <JobCard key={job.id} job={job} />)}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

// ── Filter group component ────────────────────────────────────────────────────
function FilterGroup({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", marginBottom: 10 }}>{label.toUpperCase()}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{ padding: "7px 12px", borderRadius: 8, border: `1.5px solid ${value === opt ? C.accent : C.border}`, background: value === opt ? C.accentLight : "none", color: value === opt ? C.accent : C.muted, fontSize: 13, fontWeight: value === opt ? 700 : 500, cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s" }}
            aria-pressed={value === opt}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Job card component ────────────────────────────────────────────────────────
function JobCard({ job }) {
  return (
    <article
      style={{ background: C.card, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(26,39,68,0.06)", display: "flex", flexDirection: "column", gap: 14, transition: "box-shadow 0.2s, transform 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(26,39,68,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(26,39,68,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 3 }}>{job.title}</h3>
          <p style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>{job.company}</p>
        </div>
        {job.verified && (
          <span style={{ background: C.successBg, color: C.success, fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 99, whiteSpace: "nowrap", flexShrink: 0 }}>
            ✓ Verified
          </span>
        )}
      </div>

      {/* Badges */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {[job.type, job.level, job.mode].map(tag => (
          <span key={tag} style={{ background: C.accentLight, color: C.accent, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>{tag}</span>
        ))}
        {job.inclusive && (
          <span style={{ background: "#FEF3C7", color: "#D97706", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>♿ Inclusive</span>
        )}
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>{job.description}</p>

      {/* Skills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {job.skills.map(s => (
          <span key={s} style={{ background: "#F3F4F6", color: C.navy, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 8 }}>{s}</span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 11, color: C.muted }}>{job.posted}</span>
        <button
          style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.navy}, ${C.navyEnd})`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", minHeight: 44 }}
          aria-label={`Apply for ${job.title} at ${job.company}`}
        >
          Apply Now
        </button>
      </div>
    </article>
  );
}