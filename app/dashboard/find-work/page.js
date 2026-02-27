"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem("ij_current_user") || "null"); } catch { return null; }
}

function getSavedJobs() {
  try { return JSON.parse(localStorage.getItem("ij_saved_jobs") || "[]"); } catch { return []; }
}

function toggleSaveJob(jobId) {
  const saved = getSavedJobs();
  const next = saved.includes(jobId) ? saved.filter(id => id !== jobId) : [...saved, jobId];
  localStorage.setItem("ij_saved_jobs", JSON.stringify(next));
  return next;
}

function getAppliedJobs() {
  try { return JSON.parse(localStorage.getItem("ij_applied_jobs") || "[]"); } catch { return []; }
}

function applyToJob(jobId) {
  const applied = getAppliedJobs();
  if (!applied.includes(jobId)) {
    applied.push(jobId);
    localStorage.setItem("ij_applied_jobs", JSON.stringify(applied));
  }
  return applied;
}

// ─── Match Ring ───────────────────────────────────────────────────────────────
function MatchRing({ pct }) {
  const size = 52, r = (size - 8) / 2, circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  useEffect(() => { const t = setTimeout(() => setOffset(circ - (pct / 100) * circ), 300); return () => clearTimeout(t); }, [pct, circ]);
  const color = pct >= 85 ? "#16A34A" : pct >= 70 ? "#0F5C6E" : "#D97706";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EFF9FB" strokeWidth={5} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#1A1A2E" }}>{pct}%</span>
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, saved, applied, onSave, onApply, onSelect, selected }) {
  return (
    <div
      onClick={() => onSelect(job)}
      style={{
        background: "#fff",
        border: `1.5px solid ${selected ? "#0F5C6E" : "#DDE8EC"}`,
        borderRadius: 16,
        padding: "20px 24px",
        cursor: "pointer",
        transition: "all 0.18s",
        boxShadow: selected ? "0 4px 20px rgba(15,92,110,0.12)" : "0 1px 4px rgba(15,92,110,0.05)",
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = "#0F5C6E"; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = "#DDE8EC"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <h3 style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A2E", margin: 0 }}>{job.title}</h3>
            {job.badge && (
              <span style={{ background: "#DCFCE7", color: "#16A34A", border: "1px solid #BBF7D0", borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "2px 8px" }}>
                ✓ {job.badge}
              </span>
            )}
          </div>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#4A6070" }}>{job.company} · {job.location}</div>
        </div>
        <MatchRing pct={job.match} />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <span style={{ background: "#F0F4F8", color: "#1A3A5C", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99 }}>{job.type}</span>
        {job.tags.map(t => (
          <span key={t} style={{ background: "#EFF9FB", color: "#0F5C6E", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99 }}>{t}</span>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 700, color: "#0F5C6E" }}>{job.salary}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#94A3B8" }}>{job.posted}</span>
          <button
            onClick={e => { e.stopPropagation(); onSave(job.id); }}
            style={{ background: saved ? "#EFF9FB" : "transparent", border: `1px solid ${saved ? "#0F5C6E" : "#DDE8EC"}`, borderRadius: 8, padding: "4px 10px", fontSize: 12, color: saved ? "#0F5C6E" : "#94A3B8", cursor: "pointer", fontWeight: 600 }}
          >
            {saved ? "★ Saved" : "☆ Save"}
          </button>
        </div>
      </div>

      {applied && (
        <div style={{ marginTop: 10, background: "#DCFCE7", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, color: "#16A34A" }}>
          ✓ Applied
        </div>
      )}
    </div>
  );
}

// ─── Job Detail Panel ─────────────────────────────────────────────────────────
function JobDetail({ job, applied, onApply, onClose }) {
  const [justApplied, setJustApplied] = useState(false);

  const handleApply = () => {
    onApply(job.id);
    setJustApplied(true);
  };

  return (
    <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #DDE8EC", padding: 32, position: "sticky", top: 24 }}>
      <button onClick={onClose} style={{ float: "right", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#94A3B8", marginBottom: 8 }}>✕</button>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 20, color: "#1A1A2E", margin: 0 }}>{job.title}</h2>
          {job.badge && (
            <span style={{ background: "#DCFCE7", color: "#16A34A", border: "1px solid #BBF7D0", borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "2px 8px" }}>
              ✓ {job.badge}
            </span>
          )}
        </div>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 14, color: "#4A6070", marginBottom: 4 }}>{job.company}</div>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#94A3B8" }}>{job.location} · {job.type} · {job.posted}</div>
      </div>

      <div style={{ background: "#EFF9FB", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, color: "#0F5C6E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Your Match Score</div>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 28, fontWeight: 800, color: "#0F5C6E" }}>{job.match}%</div>
        </div>
        <MatchRing pct={job.match} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>Salary</div>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 16, fontWeight: 700, color: "#0F5C6E" }}>{job.salary}</div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>About the Role</div>
        <p style={{ fontFamily: "Arial, sans-serif", fontSize: 14, color: "#4A6070", lineHeight: 1.75, margin: 0 }}>{job.description}</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>Required Skills</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {job.tags.map(t => (
            <span key={t} style={{ background: "#EFF9FB", color: "#0F5C6E", border: "1px solid #B8E4ED", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 99 }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>Disability Accommodations</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {job.accommodations.map(a => (
            <div key={a} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Arial, sans-serif", fontSize: 13, color: "#16A34A" }}>
              <span style={{ fontWeight: 700 }}>✓</span> {a}
            </div>
          ))}
        </div>
      </div>

      {applied || justApplied ? (
        <div style={{ background: "#DCFCE7", border: "1px solid #BBF7D0", borderRadius: 12, padding: "16px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>✅</div>
          <div style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 14, color: "#16A34A" }}>Application Submitted!</div>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 12, color: "#4A6070", marginTop: 4 }}>Your portfolio has been shared with {job.company}.</div>
        </div>
      ) : (
        <button
          onClick={handleApply}
          style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #0F5C6E, #0A3D4A)", color: "#fff", fontFamily: "Arial, sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(15,92,110,0.3)" }}
        >
          Apply Now — Share My Portfolio →
        </button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FindWorkDashboardPage() {
  const router = useRouter();
  const [user, setUser]           = useState(null);
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("All");
  const [selectedJob, setSelectedJob] = useState(MOCK_JOBS[0]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.replace("/"); return; }
    setUser(u);
    setSavedJobs(getSavedJobs());
    setAppliedJobs(getAppliedJobs());
  }, [router]);

  const handleSave = (jobId) => {
    setSavedJobs(toggleSaveJob(jobId));
  };

  const handleApply = (jobId) => {
    setAppliedJobs(applyToJob(jobId));
  };

  const filtered = MOCK_JOBS.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === "All" ? true
      : category === "Inclusive Employer" ? j.badge === "Inclusive Employer"
      : j.type === category || j.location.toLowerCase().includes(category.toLowerCase());
    return matchSearch && matchCat;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F5", fontFamily: "Arial, sans-serif" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0F5C6E 0%, #0A3D4A 100%)", padding: "32px 32px 28px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#7DDCE8", marginBottom: 6 }}>Job Board</div>
              <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: "#fff", margin: 0 }}>
                Find Work, {user?.firstName || "there"} 👋
              </h1>
              <p style={{ color: "rgba(224,248,250,0.75)", fontSize: 14, marginTop: 6 }}>
                {filtered.length} opportunities matched to your verified skills
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/worker")}
              style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 10, padding: "10px 18px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              ← Dashboard
            </button>
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search jobs, skills, or companies…"
              style={{ width: "100%", padding: "14px 16px 14px 46px", borderRadius: 12, border: "none", fontSize: 14, background: "rgba(255,255,255,0.95)", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div style={{ background: "#fff", borderBottom: "1px solid #DDE8EC", padding: "12px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{ padding: "7px 16px", borderRadius: 99, border: `1.5px solid ${category === cat ? "#0F5C6E" : "#DDE8EC"}`, background: category === cat ? "#0F5C6E" : "#fff", color: category === cat ? "#fff" : "#4A6070", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr 400px", gap: 24, alignItems: "start" }}>

        {/* Job list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: "48px 32px", textAlign: "center", border: "1.5px solid #DDE8EC" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>No jobs found</h3>
              <p style={{ color: "#4A6070", fontSize: 14 }}>Try a different search or filter.</p>
            </div>
          ) : (
            filtered.map(job => (
              <JobCard
                key={job.id}
                job={job}
                saved={savedJobs.includes(job.id)}
                applied={appliedJobs.includes(job.id)}
                onSave={handleSave}
                onApply={handleApply}
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
            applied={appliedJobs.includes(selectedJob.id)}
            onApply={handleApply}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </div>
    </div>
  );
}