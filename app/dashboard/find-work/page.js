"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/hooks/useAppData";
import { storage } from "@/lib/storage";

// ─── Mock job data ─────────────────────────────────────────────────────────────
const MOCK_JOBS = [
  {
    id: "job_001",
    title: "UI/UX Designer",
    company: "TechBridge PH",
    location: "Remote · Philippines",
    type: "Full-time",
    salary: "₱35,000 – ₱55,000/mo",
    match: 94,
    tags: ["Figma", "Accessibility", "Prototyping"],
    badge: "Inclusive Employer",
    posted: "2 days ago",
    description: "Design accessible, user-centered interfaces for our PWD-focused platform. You'll work directly with our product team to create inclusive digital experiences.",
    accommodations: ["Screen reader support", "Flexible hours", "Remote-first"],
  },
  {
    id: "job_002",
    title: "Frontend Developer",
    company: "Accessible Digital Inc.",
    location: "Quezon City (Hybrid)",
    type: "Full-time",
    salary: "₱45,000 – ₱70,000/mo",
    match: 88,
    tags: ["React", "TypeScript", "WCAG"],
    badge: "Inclusive Employer",
    posted: "4 days ago",
    description: "Build accessible web applications using React and TypeScript. Strong focus on WCAG compliance and inclusive design patterns.",
    accommodations: ["Ergonomic workstation", "Flexible hours", "Hybrid setup"],
  },
  {
    id: "job_003",
    title: "Data Entry Specialist",
    company: "DataFlow Solutions",
    location: "Remote · Philippines",
    type: "Part-time",
    salary: "₱15,000 – ₱22,000/mo",
    match: 81,
    tags: ["Excel", "Data Entry", "Attention to Detail"],
    badge: null,
    posted: "1 week ago",
    description: "Manage and organize data entry tasks with high accuracy. Flexible schedule ideal for PWDs seeking part-time remote work.",
    accommodations: ["Flexible schedule", "Remote work", "Self-paced tasks"],
  },
  {
    id: "job_004",
    title: "Content Writer",
    company: "Inkwell Media PH",
    location: "Remote · Philippines",
    type: "Freelance",
    salary: "₱500 – ₱800/article",
    match: 76,
    tags: ["Writing", "SEO", "Research"],
    badge: "Inclusive Employer",
    posted: "3 days ago",
    description: "Create compelling articles and blog posts on technology, accessibility, and inclusive employment. Flexible deadlines and remote-only work.",
    accommodations: ["Flexible deadlines", "Remote-only", "Asynchronous communication"],
  },
  {
    id: "job_005",
    title: "Customer Support Associate",
    company: "HelpDesk Connect",
    location: "Remote · Philippines",
    type: "Full-time",
    salary: "₱20,000 – ₱28,000/mo",
    match: 72,
    tags: ["Communication", "Problem Solving", "CRM"],
    badge: null,
    posted: "5 days ago",
    description: "Provide excellent customer service via chat and email. No phone required. Fully accessible tools and async-first communication.",
    accommodations: ["Chat/email only", "No phone required", "Flexible schedule"],
  },
  {
    id: "job_006",
    title: "Digital Marketing Assistant",
    company: "GrowthLab PH",
    location: "Remote · Philippines",
    type: "Full-time",
    salary: "₱22,000 – ₱32,000/mo",
    match: 69,
    tags: ["Social Media", "Canva", "Analytics"],
    badge: "Inclusive Employer",
    posted: "1 week ago",
    description: "Support our marketing team with social media management, content scheduling, and performance reporting. Fully remote with flexible hours.",
    accommodations: ["Remote-first", "Flexible hours", "Async tools"],
  },
];

const CATEGORIES = ["All", "Remote", "Full-time", "Part-time", "Freelance", "Inclusive Employer"];

// ─── Saved / Applied helpers — backed by storage.js ──────────────────────────
function getSavedJobs() {
  const state = storage.get();
  return state.savedJobs || [];
}

function toggleSaveJob(jobId) {
  const saved = getSavedJobs();
  const next = saved.includes(jobId)
    ? saved.filter((id) => id !== jobId)
    : [...saved, jobId];
  storage.update({ savedJobs: next });
  return next;
}

function getAppliedJobs() {
  const state = storage.get();
  return (state.tracker?.applications || []).map((a) => a.jobId);
}

function applyToJob(jobId, job) {
  storage.upsertApplication({
    id: `app_${jobId}_${Date.now()}`,
    jobId,
    jobTitle: job.title,
    company: job.company,
    appliedAt: new Date().toISOString(),
    status: "applied",
  });
}

// ─── Match Ring ───────────────────────────────────────────────────────────────
function MatchRing({ pct }) {
  const size = 52, r = (size - 8) / 2, circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  useEffect(() => {
    const t = setTimeout(() => setOffset(circ - (pct / 100) * circ), 300);
    return () => clearTimeout(t);
  }, [pct, circ]);
  const color = pct >= 85 ? "#16a34a" : pct >= 70 ? "#0d9488" : "#d97706";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0fdfa" strokeWidth={5} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <span style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 800, color: "#0f172a",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {pct}%
      </span>
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, saved, applied, onSave, onSelect, selected }) {
  return (
    <div
      role="article"
      aria-label={`${job.title} at ${job.company}`}
      aria-pressed={selected}
      onClick={() => onSelect(job)}
      style={{
        background: "#fff",
        border: `1.5px solid ${selected ? "#0d9488" : "#e2e8f0"}`,
        borderRadius: 16,
        padding: "18px 20px",
        cursor: "pointer",
        transition: "all 0.15s",
        boxShadow: selected
          ? "0 4px 20px rgba(13,148,136,0.12)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = "#0d9488"; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = selected ? "#0d9488" : "#e2e8f0"; }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>{job.title}</h3>
            {job.badge && (
              <span style={{
                background: "#dcfce7", color: "#16a34a",
                border: "1px solid #bbf7d0", borderRadius: 99,
                fontSize: 10, fontWeight: 700, padding: "2px 8px",
              }}>
                ✓ {job.badge}
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: "#64748b" }}>{job.company} · {job.location}</div>
        </div>
        <MatchRing pct={job.match} />
      </div>

      {/* Tags */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        <span style={{ background: "#f1f5f9", color: "#334155", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99 }}>
          {job.type}
        </span>
        {job.tags.map(t => (
          <span key={t} style={{ background: "#f0fdfa", color: "#0d9488", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99 }}>
            {t}
          </span>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0d9488" }}>{job.salary}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>{job.posted}</span>
          <button
            aria-label={saved ? `Unsave ${job.title}` : `Save ${job.title}`}
            onClick={e => { e.stopPropagation(); onSave(job.id); }}
            style={{
              background: saved ? "#f0fdfa" : "transparent",
              border: `1px solid ${saved ? "#0d9488" : "#e2e8f0"}`,
              borderRadius: 8, padding: "4px 10px",
              fontSize: 12, color: saved ? "#0d9488" : "#94a3b8",
              cursor: "pointer", fontWeight: 600, transition: "all 0.15s",
            }}
          >
            {saved ? "★ Saved" : "☆ Save"}
          </button>
        </div>
      </div>

      {applied && (
        <div style={{
          marginTop: 10, background: "#dcfce7", borderRadius: 8,
          padding: "5px 12px", fontSize: 12, fontWeight: 700, color: "#16a34a",
        }}>
          ✓ Applied
        </div>
      )}
    </div>
  );
}

// ─── Job Detail Panel ─────────────────────────────────────────────────────────
function JobDetail({ job, applied, onApply, onClose }) {
  const [justApplied, setJustApplied] = useState(false);

  // Reset when job changes
  useEffect(() => setJustApplied(false), [job?.id]);

  const handleApply = () => {
    onApply(job.id, job);
    setJustApplied(true);
  };

  const isApplied = applied || justApplied;

  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      border: "1.5px solid #e2e8f0", padding: 28,
      position: "sticky", top: 24,
      fontFamily: "'DM Sans', sans-serif",
      maxHeight: "calc(100vh - 200px)",
      overflowY: "auto",
    }}>
      {/* Close */}
      <button
        aria-label="Close job detail"
        onClick={onClose}
        style={{
          float: "right", background: "#f1f5f9", border: "none",
          borderRadius: 8, width: 28, height: 28,
          cursor: "pointer", fontSize: 14, color: "#64748b",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >✕</button>

      {/* Title */}
      <div style={{ marginBottom: 18, paddingRight: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>{job.title}</h2>
          {job.badge && (
            <span style={{ background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "2px 8px" }}>
              ✓ {job.badge}
            </span>
          )}
        </div>
        <div style={{ fontSize: 13, color: "#334155", marginBottom: 3 }}>{job.company}</div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>{job.location} · {job.type} · {job.posted}</div>
      </div>

      {/* Match score card */}
      <div style={{
        background: "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
        border: "1.5px solid #99f6e4",
        borderRadius: 14, padding: "14px 18px", marginBottom: 18,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#0d9488", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
            Your Match Score
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#0d9488" }}>{job.match}%</div>
        </div>
        <MatchRing pct={job.match} />
      </div>

      {/* Salary */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Salary</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0d9488" }}>{job.salary}</div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>About the Role</div>
        <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.75, margin: 0 }}>{job.description}</p>
      </div>

      {/* Skills */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Required Skills</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {job.tags.map(t => (
            <span key={t} style={{ background: "#f0fdfa", color: "#0d9488", border: "1px solid #99f6e4", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 99 }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Accommodations */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
          ♿ Disability Accommodations
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {job.accommodations.map(a => (
            <div key={a} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#16a34a" }}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                background: "#dcfce7", border: "1px solid #bbf7d0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, flexShrink: 0,
              }}>✓</span>
              {a}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {isApplied ? (
        <div style={{
          background: "#dcfce7", border: "1px solid #bbf7d0",
          borderRadius: 14, padding: "16px 20px", textAlign: "center",
        }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>✅</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#16a34a" }}>Application Submitted!</div>
          <div style={{ fontSize: 12, color: "#4a6070", marginTop: 4 }}>
            Your portfolio has been shared with {job.company}.
          </div>
        </div>
      ) : (
        <button
          onClick={handleApply}
          aria-label={`Apply to ${job.title} at ${job.company}`}
          style={{
            width: "100%", padding: "13px",
            borderRadius: 12, border: "none",
            background: "linear-gradient(135deg, #0d9488, #0f766e)",
            color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(13,148,136,0.3)",
            transition: "opacity 0.15s",
            fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Apply Now — Share My Portfolio →
        </button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FindWorkPage() {
  const router = useRouter();

  // ✅ Real-time data from storage — re-renders on any storage write
  const { profile, scoring, tracker } = useAppData();

  // Derived saved/applied — also real-time via useAppData
  const appData = useAppData();
  const savedJobs = appData.savedJobs || [];
  const appliedJobIds = (appData.tracker?.applications || []).map(a => a.jobId);

  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("All");
  const [selectedJob, setSelectedJob] = useState(MOCK_JOBS[0]);

  // First name — real-time from profile
  const firstName = profile?.name
    ? profile.name.trim().split(" ")[0]
    : "there";

  const handleSave = (jobId) => toggleSaveJob(jobId); // storage fires event → useAppData re-renders
  const handleApply = (jobId, job) => applyToJob(jobId, job);

  const filtered = MOCK_JOBS.filter(j => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat =
      category === "All" ? true
      : category === "Inclusive Employer" ? j.badge === "Inclusive Employer"
      : j.type === category || j.location.toLowerCase().includes(category.toLowerCase());
    return matchSearch && matchCat;
  });

  return (
    // ✅ This div sits INSIDE your existing layout (sidebar is rendered by layout.jsx)
    // Remove the outer shell if your layout already provides padding/bg
    <div style={{
      minHeight: "100%",
      background: "#f8fafc",
      fontFamily: "'DM Sans', 'Inter', sans-serif",
    }}>

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
        padding: "28px 32px 24px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(204,251,241,0.8)", marginBottom: 6 }}>
                Job Board
              </div>
              {/* ✅ Real-time first name */}
              <h1 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 800, color: "#fff", margin: 0 }}>
                Find Work, {firstName} 👋
              </h1>
              <p style={{ color: "rgba(204,251,241,0.75)", fontSize: 13, marginTop: 5, margin: "6px 0 0" }}>
                {filtered.length} opportunities matched to your verified skills
                {scoring?.jobTitle && (
                  <span style={{ marginLeft: 8, background: "rgba(255,255,255,0.15)", borderRadius: 99, padding: "2px 10px", fontSize: 11 }}>
                    Based on: {scoring.jobTitle}
                  </span>
                )}
              </p>
            </div>

            {/* Right column — back button + stats */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>

              {/* ← Back to Dashboard */}
              <button
                onClick={() => router.push("/dashboard")}
                aria-label="Go back to Dashboard"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  borderRadius: 10, padding: "8px 16px",
                  color: "#fff", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  transition: "background 0.15s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Dashboard
              </button>

              {/* Stats chips — real-time */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { label: "Applied", value: appliedJobIds.length },
                  { label: "Saved", value: savedJobs.length },
                  { label: "Match Score", value: scoring?.overallScore ? `${scoring.overallScore}%` : "—" },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 12, padding: "8px 14px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{value}</div>
                    <div style={{ fontSize: 10, color: "rgba(204,251,241,0.8)", fontWeight: 600 }}>{label}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
              width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              aria-label="Search jobs, skills, or companies"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search jobs, skills, or companies…"
              style={{
                width: "100%", padding: "12px 16px 12px 42px",
                borderRadius: 12, border: "none", fontSize: 14,
                background: "rgba(255,255,255,0.97)",
                outline: "none", boxSizing: "border-box",
                color: "#0f172a", fontFamily: "'DM Sans', sans-serif",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Category filters ───────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "10px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              aria-pressed={category === cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: "6px 16px", borderRadius: 99,
                border: `1.5px solid ${category === cat ? "#0d9488" : "#e2e8f0"}`,
                background: category === cat ? "#0d9488" : "#fff",
                color: category === cat ? "#fff" : "#64748b",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "24px 32px",
        display: "grid",
        gridTemplateColumns: selectedJob ? "1fr 380px" : "1fr",
        gap: 20,
        alignItems: "start",
      }}>

        {/* Job list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.length === 0 ? (
            <div style={{
              background: "#fff", borderRadius: 16, padding: "48px 32px",
              textAlign: "center", border: "1.5px solid #e2e8f0",
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 6 }}>No jobs found</h3>
              <p style={{ color: "#64748b", fontSize: 13 }}>Try a different search or filter.</p>
            </div>
          ) : (
            filtered.map(job => (
              <JobCard
                key={job.id}
                job={job}
                saved={savedJobs.includes(job.id)}
                applied={appliedJobIds.includes(job.id)}
                onSave={handleSave}
                onSelect={setSelectedJob}
                selected={selectedJob?.id === job.id}
              />
            ))
          )}
        </div>

        {/* Detail panel */}
        {selectedJob && (
          <JobDetail
            job={selectedJob}
            applied={appliedJobIds.includes(selectedJob.id)}
            onApply={handleApply}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}