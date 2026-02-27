//app/employer/dashboard/page.jsx
"use client";

import { useState, useEffect } from "react";

// ── Theme definitions (matches onboarding Step 5 picker) ─────────────────────
const THEMES = {
  navy:  { sidebar: "#1A2744", sidebarEnd: "#1E2F55", accent: "#7286D3", accentLight: "#EEF1FF" },
  slate: { sidebar: "#334155", sidebarEnd: "#1E293B", accent: "#94A3B8", accentLight: "#F1F5F9" },
  teal:  { sidebar: "#0F4C4C", sidebarEnd: "#063232", accent: "#2DD4BF", accentLight: "#F0FDFA" },
  rose:  { sidebar: "#881337", sidebarEnd: "#500724", accent: "#FB7185", accentLight: "#FFF1F2" },
};

const BASE = {
  bg: "#F9F8F6", card: "#FFFFFF",
  success: "#16A34A", successBg: "#DCFCE7",
  warning: "#D97706", warningBg: "#FEF3C7",
  error: "#DC2626", errorBg: "#FEE2E2",
  navy: "#1A2744", muted: "#6B7280", border: "#E5E7EB",
};

// ── Load employer profile from localStorage ──────────────────────────────────
const loadProfile = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("inklusijobs_employer");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

// ── Icons ────────────────────────────────────────────────────────────────────
const PATHS = {
  overview:  <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  jobs:      <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>,
  candidates:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  portfolio: <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>,
  messages:  <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
  analytics: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  feedback:  <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
  profile:   <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  bell:      <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  chevLeft:  <><polyline points="15 18 9 12 15 6"/></>,
  chevRight: <><polyline points="9 18 15 12 9 6"/></>,
  chevDown:  <><polyline points="6 9 12 15 18 9"/></>,
  plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  filter:    <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
  star:      <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
  check:     <><polyline points="20 6 9 17 4 12"/></>,
  clock:     <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  send:      <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
  eye:       <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  trending:  <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
  award:     <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
  arrowUp:   <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
};

const Icon = ({ name, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {PATHS[name]}
  </svg>
);

const NAV = [
  { id: "overview",   label: "Overview",         icon: "overview"   },
  { id: "jobs",       label: "Job Listings",      icon: "jobs"       },
  { id: "candidates", label: "Candidate Matches", icon: "candidates" },
  { id: "portfolio",  label: "Portfolio Reviews", icon: "portfolio"  },
  { id: "messages",   label: "Messages",          icon: "messages"   },
  { id: "analytics",  label: "Analytics",         icon: "analytics"  },
  { id: "feedback",   label: "Feedback",          icon: "feedback"   },
  { id: "profile",    label: "Company Profile",   icon: "profile"    },
  { id: "settings",   label: "Settings",          icon: "settings"   },
];

// ── Shared components ────────────────────────────────────────────────────────
const Badge = ({ label, type = "default", accent, accentLight }) => {
  const map = {
    default: { bg: accentLight || "#EFF6FF", color: accent || BASE.navy, border: "#BFDBFE" },
    success: { bg: BASE.successBg, color: BASE.success, border: "#86EFAC" },
    warning: { bg: BASE.warningBg, color: BASE.warning, border: "#FCD34D" },
    error:   { bg: BASE.errorBg,   color: BASE.error,   border: "#FCA5A5" },
    navy:    { bg: accentLight || "#EEF1FF", color: BASE.navy, border: accent || "#7286D3" },
  };
  const s = map[type] || map.default;
  return (
    <span style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}`, borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700, letterSpacing:"0.03em", display:"inline-flex", alignItems:"center" }}>
      {label}
    </span>
  );
};

const Avatar = ({ name, size = 38, accent }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg, ${accent||"#7286D3"}, ${BASE.navy})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:size*0.38, flexShrink:0 }}>
    {(name||"?")[0].toUpperCase()}
  </div>
);

const FunnelBar = ({ label, count, max, color }) => {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW((count/max)*100), 200); return () => clearTimeout(t); }, [count, max]);
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span style={{ fontSize:13, fontWeight:600, color:BASE.navy }}>{label}</span>
        <span style={{ fontSize:13, fontWeight:700, color:BASE.navy }}>{count}</span>
      </div>
      <div style={{ height:7, borderRadius:99, background:"#EEF1FF", overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${w}%`, borderRadius:99, background:color, transition:"width 0.9s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
    </div>
  );
};

const MatchRing = ({ pct, size = 52, accent }) => {
  const r = (size-8)/2, circ = 2*Math.PI*r;
  const [offset, setOffset] = useState(circ);
  useEffect(() => { const t = setTimeout(() => setOffset(circ-(pct/100)*circ), 300); return () => clearTimeout(t); }, [pct, circ]);
  const color = pct >= 85 ? BASE.success : pct >= 70 ? (accent||"#7286D3") : BASE.warning;
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#EEF1FF" strokeWidth={5} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition:"stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <span style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:BASE.navy }}>{pct}%</span>
    </div>
  );
};

const Bar = ({ val, maxVal, label, delay, accent }) => {
  const [h, setH] = useState(0);
  useEffect(() => { const t = setTimeout(() => setH((val/maxVal)*100), delay); return () => clearTimeout(t); }, [val, maxVal, delay]);
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
      <span style={{ fontSize:11, fontWeight:700, color:BASE.navy }}>{val}</span>
      <div style={{ width:"100%", height:`${h}%`, minHeight:4, borderRadius:"4px 4px 0 0", background:`linear-gradient(180deg, ${accent||"#7286D3"}, ${BASE.navy})`, transition:"height 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
      <span style={{ fontSize:11, color:BASE.muted, fontWeight:600 }}>{label}</span>
    </div>
  );
};
const BarChart = ({ data, maxVal, accent }) => (
  <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120 }}>
    {data.map((d,i) => <Bar key={i} val={d.val} maxVal={maxVal} label={d.label} delay={i*80} accent={accent} />)}
  </div>
);

// ── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, delta, icon, color }) => (
  <div style={{ background:BASE.card, borderRadius:16, padding:24, border:`1px solid ${BASE.border}`, boxShadow:"0 1px 4px rgba(26,39,68,0.06)", transition:"box-shadow 0.2s, transform 0.2s" }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 24px rgba(26,39,68,0.12)"; e.currentTarget.style.transform="translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow="0 1px 4px rgba(26,39,68,0.06)"; e.currentTarget.style.transform="translateY(0)"; }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
      <span style={{ fontSize:12, fontWeight:600, color:BASE.muted, letterSpacing:"0.05em" }}>{label}</span>
      <span style={{ width:36, height:36, borderRadius:10, background:color+"18", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon name={icon} size={18} color={color} />
      </span>
    </div>
    <div style={{ fontSize:30, fontWeight:800, color:BASE.navy, lineHeight:1, marginBottom:8 }}>{value}</div>
    {delta && <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:BASE.success, fontWeight:600 }}><Icon name="arrowUp" size={12} color={BASE.success} /> {delta}</div>}
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
//  PAGES — each receives `profile` and `T` (theme colors)
// ════════════════════════════════════════════════════════════════════════════

const PageOverview = ({ profile, T }) => {
  const s1 = profile?.s1 || {};
  const s2 = profile?.s2 || {};
  const s3 = profile?.s3 || {};
  const s5 = profile?.s5 || {};
  const activeWidgets = s5.widgets || ["Hiring Funnel","AI Match Preview","Recent Applications"];

  const displayName = s2.company || "Your Company";
  const userName    = s1.firstName ? `${s1.firstName} ${s1.lastName||""}`.trim() : null;
  const greeting    = userName ? `Welcome back, ${userName} 👋` : `Welcome back, ${displayName} 👋`;

  // Build a dynamic first job card from onboarding data
  const firstJob = s3.jobTitle ? {
    title: s3.jobTitle,
    dept: s3.dept || "—",
    workType: s3.workType || "Remote",
    skills: s3.skills?.slice(0,3) || [],
  } : null;

  return (
    <div>
      <h1 style={{ fontSize:26, fontWeight:800, color:BASE.navy, marginBottom:4 }}>{greeting}</h1>
      <p style={{ color:BASE.muted, fontSize:14, marginBottom:28 }}>
        Here's what's happening with your hiring pipeline today.
        {s3.jobTitle && <span style={{ color:T.accent, fontWeight:600 }}> Hiring for: {s3.jobTitle}{s3.location ? ` · ${s3.location}` : ""}</span>}
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        <StatCard label="ACTIVE JOBS"       value={firstJob?"1":"0"}   delta={firstJob?"+1 from onboarding":null} icon="jobs"       color={T.accent}       />
        <StatCard label="TOTAL CANDIDATES"  value="348"  delta="+24 this week"     icon="candidates" color={BASE.success}  />
        <StatCard label="INTERVIEWS SET"    value="19"   delta="+5 this week"      icon="clock"      color={BASE.warning}  />
        <StatCard label="HIRING RATE"       value="34%"  delta="+3% vs last month" icon="trending"   color={BASE.navy}     />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:20, marginBottom:20 }}>
        {/* Funnel — only if widget selected */}
        {activeWidgets.includes("Hiring Funnel") && (
          <div style={{ background:BASE.card, borderRadius:16, padding:24, border:`1px solid ${BASE.border}`, boxShadow:"0 1px 4px rgba(26,39,68,0.06)" }}>
            <h2 style={{ fontSize:15, fontWeight:700, color:BASE.navy, marginBottom:20 }}>Hiring Funnel</h2>
            <FunnelBar label="Applied"     count={348} max={348} color={T.accent}      />
            <FunnelBar label="Screened"    count={214} max={348} color={T.accent+"99"} />
            <FunnelBar label="Interviewed" count={89}  max={348} color={BASE.navy}     />
            <FunnelBar label="Offered"     count={31}  max={348} color={BASE.success}  />
            <FunnelBar label="Hired"       count={19}  max={348} color="#0D9488"       />
          </div>
        )}

        {/* Recent Applications */}
        {activeWidgets.includes("Recent Applications") && (
          <div style={{ background:BASE.card, borderRadius:16, padding:24, border:`1px solid ${BASE.border}`, boxShadow:"0 1px 4px rgba(26,39,68,0.06)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontSize:15, fontWeight:700, color:BASE.navy }}>Recent Applications</h2>
              <button style={{ fontSize:12, color:T.accent, fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>View all →</button>
            </div>
            {[
              { name:"Maria Santos",    role: s3.jobTitle||"UX Designer",    match:92, status:"New",       type:"success" },
              { name:"Juan dela Cruz",  role: s3.jobTitle||"React Developer", match:87, status:"Reviewing", type:"warning" },
              { name:"Ana Reyes",       role: s3.jobTitle||"Data Analyst",   match:78, status:"Interview", type:"navy"    },
              { name:"Carlos Bautista", role: s3.jobTitle||"QA Engineer",    match:85, status:"New",       type:"success" },
            ].map((a,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<3?`1px solid ${BASE.border}`:"none" }}>
                <Avatar name={a.name} size={36} accent={T.accent} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:BASE.navy }}>{a.name}</div>
                  <div style={{ fontSize:12, color:BASE.muted }}>{a.role}</div>
                </div>
                <MatchRing pct={a.match} size={44} accent={T.accent} />
                <Badge label={a.status} type={a.type} accent={T.accent} accentLight={T.accentLight} />
              </div>
            ))}
          </div>
        )}

        {/* If funnel not selected but recent apps is, show full width */}
        {!activeWidgets.includes("Hiring Funnel") && !activeWidgets.includes("Recent Applications") && (
          <div style={{ background:BASE.card, borderRadius:16, padding:24, border:`1px solid ${BASE.border}`, gridColumn:"1/-1", textAlign:"center", color:BASE.muted, fontSize:14 }}>
            No widgets selected — go to Settings to customize your dashboard.
          </div>
        )}
      </div>

      {/* AI Match Preview */}
      {activeWidgets.includes("AI Match Preview") && (
        <div style={{ background:`linear-gradient(135deg, ${T.sidebar} 0%, ${T.sidebarEnd} 100%)`, borderRadius:16, padding:24, color:"#fff" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div>
              <h2 style={{ fontSize:15, fontWeight:700, marginBottom:4 }}>⚡ AI Match Preview</h2>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.6)", margin:0 }}>
                Top verified candidates ready for {s3.jobTitle ? `your ${s3.jobTitle} role` : "your open roles"}
                {s3.skills?.length ? ` · Skills: ${s3.skills.slice(0,3).join(", ")}` : ""}
              </p>
            </div>
            <button style={{ background:T.accent, color:"#fff", border:"none", borderRadius:10, padding:"8px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>View All Matches</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {[
              { name:"Liza Flores",  role: s3.jobTitle||"Frontend Dev",   match:94, verified:true  },
              { name:"Paolo Mendez", role: s3.jobTitle||"Data Scientist",  match:88, verified:true  },
              { name:"Grace Tan",    role: s3.jobTitle||"UX Researcher",   match:82, verified:false },
            ].map((c,i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:16, border:"1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <div style={{ width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${T.accent},rgba(255,255,255,0.3))`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color:"#fff" }}>{c.name[0]}</div>
                  <div><div style={{ fontSize:13, fontWeight:700 }}>{c.name}</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.55)" }}>{c.role}</div></div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:22, fontWeight:800 }}>{c.match}%</span>
                  {c.verified && <span style={{ background:BASE.successBg, color:BASE.success, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:99 }}>✓ Verified</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions widget */}
      {activeWidgets.includes("Quick Actions") && (
        <div style={{ background:BASE.card, borderRadius:16, padding:24, border:`1px solid ${BASE.border}`, marginTop:20 }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:BASE.navy, marginBottom:16 }}>Quick Actions</h2>
          <div style={{ display:"flex", gap:12 }}>
            {[
              { label:"Post a Job", icon:"plus" },
              { label:"View Matches", icon:"candidates" },
              { label:"Schedule Interview", icon:"clock" },
              { label:"View Analytics", icon:"analytics" },
            ].map((a,i) => (
              <button key={i} style={{ flex:1, padding:"14px 10px", borderRadius:12, border:`1.5px solid ${BASE.border}`, background:"#F8F9FD", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                <Icon name={a.icon} size={20} color={T.accent} />
                <span style={{ fontSize:12, fontWeight:600, color:BASE.navy }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Job Listings — shows onboarding job first ────────────────────────────────
const PageJobs = ({ profile, T }) => {
  const [filter, setFilter] = useState("All Jobs");
  const s3 = profile?.s3 || {};

  const jobs = [
    // If onboarding data exists, make it the first "real" job
    ...(s3.jobTitle ? [{
      title: s3.jobTitle,
      dept: s3.dept || "General",
      applicants: 0,
      status: "Active",
      posted: "Just posted",
      skills: s3.skills?.slice(0,3) || [],
      remote: s3.workType === "Remote",
      salary: s3.salaryMin && s3.salaryMax ? `${s3.salaryMin}–${s3.salaryMax}` : null,
      fromOnboarding: true,
    }] : []),
    { title:"Senior Frontend Developer", dept:"Engineering", applicants:47, status:"Active",  posted:"3 days ago",  skills:["React","TypeScript","Accessibility"], remote:true  },
    { title:"UX/UI Designer",            dept:"Product",     applicants:62, status:"Active",  posted:"1 week ago",  skills:["Figma","User Research","Prototyping"], remote:false },
    { title:"Data Analyst",              dept:"Analytics",   applicants:31, status:"Paused",  posted:"2 weeks ago", skills:["Python","SQL","Tableau"],             remote:true  },
  ];

  const visible = filter === "All Jobs" ? jobs : jobs.filter(j => j.status === filter);

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, color:BASE.navy, marginBottom:4 }}>Job Listings</h1>
          <p style={{ color:BASE.muted, fontSize:14 }}>Manage your open positions and track applicants.</p>
        </div>
        <button style={{ background:`linear-gradient(135deg, ${T.sidebar}, ${T.sidebarEnd})`, color:"#fff", border:"none", borderRadius:12, padding:"12px 22px", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:`0 4px 14px ${T.accent}44` }}>
          <Icon name="plus" size={16} color="#fff" /> Post New Job
        </button>
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:24 }}>
        {["All Jobs","Active","Paused","Closed"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding:"8px 18px", borderRadius:99, border:`1.5px solid ${filter===f?T.sidebar:BASE.border}`, background:filter===f?T.sidebar:BASE.card, color:filter===f?"#fff":BASE.muted, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.15s" }}>{f}</button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {visible.map((j,i) => (
          <div key={i} style={{ background:BASE.card, borderRadius:16, padding:24, border:`1.5px solid ${j.fromOnboarding?T.accent:BASE.border}`, display:"flex", alignItems:"center", gap:20, boxShadow:j.fromOnboarding?`0 4px 16px ${T.accent}22`:"0 1px 4px rgba(26,39,68,0.06)", transition:"box-shadow 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow=`0 6px 20px ${T.accent}22`}
            onMouseLeave={e => e.currentTarget.style.boxShadow=j.fromOnboarding?`0 4px 16px ${T.accent}22`:"0 1px 4px rgba(26,39,68,0.06)"}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                <h3 style={{ fontSize:16, fontWeight:700, color:BASE.navy, margin:0 }}>{j.title}</h3>
                <Badge label={j.status} type={j.status==="Active"?"success":j.status==="Paused"?"warning":"default"} accent={T.accent} accentLight={T.accentLight} />
                {j.remote && <Badge label="Remote" type="navy" accent={T.accent} accentLight={T.accentLight} />}
                {j.fromOnboarding && <Badge label="From Setup" type="default" accent={T.accent} accentLight={T.accentLight} />}
              </div>
              <p style={{ fontSize:13, color:BASE.muted, margin:"0 0 12px" }}>
                {j.dept} · Posted {j.posted}
                {j.salary && <span style={{ color:T.accent, fontWeight:600 }}> · {j.salary}</span>}
              </p>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {j.skills.map(s => <span key={s} style={{ background:T.accentLight, color:T.accent, fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:99 }}>{s}</span>)}
              </div>
            </div>
            <div style={{ textAlign:"center", minWidth:72 }}>
              <div style={{ fontSize:28, fontWeight:800, color:BASE.navy }}>{j.applicants}</div>
              <div style={{ fontSize:11, color:BASE.muted, fontWeight:600 }}>Applicants</div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ padding:"8px 16px", borderRadius:10, border:`1.5px solid ${BASE.border}`, background:BASE.card, color:BASE.navy, fontSize:13, fontWeight:600, cursor:"pointer" }}>Edit</button>
              <button style={{ padding:"8px 16px", borderRadius:10, border:"none", background:T.sidebar, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Candidate Matches — skills from onboarding ───────────────────────────────
const PageCandidates = ({ profile, T }) => {
  const s3 = profile?.s3 || {};
  const roleSkills = s3.skills?.slice(0,3) || [];

  const candidates = [
    { name:"Maria Santos",    role:s3.jobTitle||"UX Designer",    match:94, skills:88, portfolio:91, tags:roleSkills.length?roleSkills:["Figma","Research","Accessibility"], verified:true  },
    { name:"Juan dela Cruz",  role:s3.jobTitle||"React Developer", match:87, skills:84, portfolio:80, tags:roleSkills.length?roleSkills:["React","TypeScript","Node.js"],    verified:true  },
    { name:"Ana Reyes",       role:s3.jobTitle||"Data Analyst",   match:82, skills:78, portfolio:85, tags:roleSkills.length?roleSkills:["Python","SQL","Power BI"],         verified:false },
    { name:"Carlos Bautista", role:s3.jobTitle||"QA Engineer",    match:79, skills:82, portfolio:70, tags:roleSkills.length?roleSkills:["Selenium","Jest","Agile"],         verified:true  },
    { name:"Liza Flores",     role:s3.jobTitle||"Frontend Dev",   match:91, skills:90, portfolio:87, tags:roleSkills.length?roleSkills:["Vue.js","CSS","A11y"],             verified:true  },
    { name:"Paolo Mendez",    role:s3.jobTitle||"Data Scientist",  match:76, skills:74, portfolio:79, tags:roleSkills.length?roleSkills:["ML","Python","TensorFlow"],       verified:false },
  ];

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, color:BASE.navy, marginBottom:4 }}>Candidate Matches</h1>
          <p style={{ color:BASE.muted, fontSize:14 }}>
            AI-verified PWD professionals matched to your roles.
            {s3.jobTitle && <span style={{ color:T.accent, fontWeight:600 }}> Showing matches for: {s3.jobTitle}</span>}
          </p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 16px", borderRadius:10, border:`1.5px solid ${BASE.border}`, background:BASE.card, color:BASE.navy, fontSize:13, fontWeight:600, cursor:"pointer" }}>
            <Icon name="filter" size={14} /> Filters
          </button>
          <select style={{ padding:"10px 14px", borderRadius:10, border:`1.5px solid ${BASE.border}`, fontSize:13, color:BASE.navy, fontWeight:600, background:BASE.card, cursor:"pointer" }}>
            <option>Sort by: Match %</option><option>Sort by: Skills Score</option><option>Sort by: Portfolio</option>
          </select>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {candidates.map((c,i) => (
          <div key={i} style={{ background:BASE.card, borderRadius:16, padding:24, border:`1px solid ${BASE.border}`, boxShadow:"0 1px 4px rgba(26,39,68,0.06)", transition:"box-shadow 0.2s, transform 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 8px 28px ${T.accent}22`; e.currentTarget.style.transform="translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow="0 1px 4px rgba(26,39,68,0.06)"; e.currentTarget.style.transform="translateY(0)"; }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <Avatar name={c.name} size={44} accent={T.accent} />
                <div><div style={{ fontSize:14, fontWeight:700, color:BASE.navy }}>{c.name}</div><div style={{ fontSize:12, color:BASE.muted }}>{c.role}</div></div>
              </div>
              <MatchRing pct={c.match} size={52} accent={T.accent} />
            </div>
            {c.verified && (
              <div style={{ display:"flex", alignItems:"center", gap:5, background:BASE.successBg, borderRadius:8, padding:"5px 10px", marginBottom:14, width:"fit-content" }}>
                <Icon name="check" size={12} color={BASE.success} /><span style={{ fontSize:11, fontWeight:700, color:BASE.success }}>AI-Verified PWD Professional</span>
              </div>
            )}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
              {[{label:"Skills Score",val:c.skills},{label:"Portfolio",val:c.portfolio}].map(m => (
                <div key={m.label} style={{ background:"#F8F9FD", borderRadius:10, padding:"10px 12px" }}>
                  <div style={{ fontSize:10, color:BASE.muted, fontWeight:600, marginBottom:4 }}>{m.label.toUpperCase()}</div>
                  <div style={{ fontSize:18, fontWeight:800, color:BASE.navy }}>{m.val}<span style={{ fontSize:11, color:BASE.muted }}>/100</span></div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:16 }}>
              {c.tags.map(t => <span key={t} style={{ background:T.accentLight, color:T.accent, fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:99 }}>{t}</span>)}
            </div>
            <button style={{ width:"100%", padding:"10px", borderRadius:10, border:"none", background:`linear-gradient(135deg, ${T.sidebar}, ${T.sidebarEnd})`, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <Icon name="eye" size={14} color="#fff" /> View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Portfolio, Analytics, Messages, Feedback — theme-aware ──────────────────
const PagePortfolio = ({ profile, T }) => {
  const s3 = profile?.s3 || {};
  const items = [
    { name:"Maria Santos",   challenge: s3.jobTitle ? `${s3.jobTitle} Challenge` : "E-commerce Accessibility Audit", ai:94, submitted:"2 days ago",  status:"Pending Review" },
    { name:"Juan dela Cruz", challenge:"React Component Library",        ai:88, submitted:"4 days ago",  status:"Reviewed"       },
    { name:"Ana Reyes",      challenge:"Sales Dashboard Design",         ai:81, submitted:"1 week ago",  status:"Pending Review" },
  ];
  return (
    <div>
      <h1 style={{ fontSize:26, fontWeight:800, color:BASE.navy, marginBottom:4 }}>Portfolio Reviews</h1>
      <p style={{ color:BASE.muted, fontSize:14, marginBottom:28 }}>Evaluate candidate project submissions with AI verification scores.</p>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {items.map((p,i) => (
          <div key={i} style={{ background:BASE.card, borderRadius:16, border:`1px solid ${BASE.border}`, overflow:"hidden", boxShadow:"0 1px 4px rgba(26,39,68,0.06)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px", borderBottom:`1px solid ${BASE.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <Avatar name={p.name} size={40} accent={T.accent} />
                <div><div style={{ fontSize:14, fontWeight:700, color:BASE.navy }}>{p.name}</div><div style={{ fontSize:12, color:BASE.muted }}>{p.challenge}</div></div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:10, color:BASE.muted, fontWeight:600, marginBottom:2 }}>AI SCORE</div>
                  <div style={{ fontSize:24, fontWeight:800, color:p.ai>=90?BASE.success:p.ai>=80?T.accent:BASE.warning }}>{p.ai}</div>
                </div>
                <Badge label={p.status} type={p.status==="Reviewed"?"success":"warning"} />
                <div style={{ display:"flex", gap:8 }}>
                  <button style={{ padding:"8px 16px", borderRadius:10, border:`1.5px solid ${BASE.border}`, background:BASE.card, color:BASE.navy, fontSize:13, fontWeight:600, cursor:"pointer" }}>Preview</button>
                  <button style={{ padding:"8px 16px", borderRadius:10, border:"none", background:T.sidebar, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>Compare</button>
                </div>
              </div>
            </div>
            <div style={{ padding:"14px 24px", background:"#F8F9FD", display:"flex", gap:24 }}>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}><Icon name="clock" size={13} color={BASE.muted}/><span style={{ fontSize:12, color:BASE.muted }}>Submitted {p.submitted}</span></div>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}><Icon name="award" size={13} color={T.accent}/><span style={{ fontSize:12, color:T.accent, fontWeight:600 }}>AI verification score available</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PageAnalytics = ({ profile, T }) => {
  const s3 = profile?.s3 || {};
  return (
    <div>
      <h1 style={{ fontSize:26, fontWeight:800, color:BASE.navy, marginBottom:4 }}>Analytics</h1>
      <p style={{ color:BASE.muted, fontSize:14, marginBottom:28 }}>Track hiring performance and AI match improvement insights.</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
        {[
          {label:"Conversion Rate",   value:"34%",     sub:"+3% vs last month",    color:BASE.success},
          {label:"Avg. Time-to-Hire", value:"18 days", sub:"−4 days vs last month", color:T.accent    },
          {label:"AI Match Accuracy", value:"91%",     sub:"Based on 120 hires",   color:BASE.navy   },
        ].map((s,i) => (
          <div key={i} style={{ background:BASE.card, borderRadius:16, padding:24, border:`1px solid ${BASE.border}`, boxShadow:"0 1px 4px rgba(26,39,68,0.06)" }}>
            <div style={{ fontSize:13, fontWeight:600, color:BASE.muted, marginBottom:8 }}>{s.label}</div>
            <div style={{ fontSize:32, fontWeight:800, color:s.color, marginBottom:6 }}>{s.value}</div>
            <div style={{ fontSize:12, color:BASE.muted }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        {[
          {title:"Monthly Applications", data:[{label:"Aug",val:42},{label:"Sep",val:67},{label:"Oct",val:58},{label:"Nov",val:89},{label:"Dec",val:71},{label:"Jan",val:94}], max:100},
          {title:"Hires by Department",  data:[{label:"Eng",val:8},{label:"Design",val:5},{label:"Data",val:4},{label:"QA",val:3},{label:"PM",val:2},{label:"Ops",val:1}], max:10},
        ].map((ch,i) => (
          <div key={i} style={{ background:BASE.card, borderRadius:16, padding:24, border:`1px solid ${BASE.border}`, boxShadow:"0 1px 4px rgba(26,39,68,0.06)" }}>
            <h2 style={{ fontSize:15, fontWeight:700, color:BASE.navy, marginBottom:20 }}>{ch.title}</h2>
            <BarChart data={ch.data} maxVal={ch.max} accent={T.accent} />
          </div>
        ))}
      </div>
      <div style={{ background:`linear-gradient(135deg, ${T.sidebar}, ${T.sidebarEnd})`, borderRadius:16, padding:24, color:"#fff" }}>
        <h2 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>💡 AI Match Improvement Insights</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {[
            {insight:`Candidates with ${s3.skills?.[0]||"key skill"} expertise matched ${s3.jobTitle||"your role"} at 96% accuracy.`, tag:s3.skills?.[0]||"Skills"},
            {insight:"Candidates with Portfolio scores ≥ 85 had a 2.4× higher offer acceptance rate.", tag:"Portfolio"},
            {insight:"Adding accessibility requirements to job posts increased qualified PWD applicants by 38%.", tag:"Inclusion"},
          ].map((ins,i) => (
            <div key={i} style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:16, border:"1px solid rgba(255,255,255,0.12)" }}>
              <span style={{ background:T.accent, color:"#fff", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:99, marginBottom:10, display:"inline-block" }}>{ins.tag}</span>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.8)", lineHeight:1.6, margin:0 }}>{ins.insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PageMessages = ({ T }) => {
  const [active, setActive] = useState(0);
  const [msg, setMsg] = useState("");
  const convos = [
    {name:"Maria Santos",   role:"UX Designer",    last:"Thank you for the opportunity!", time:"2m ago",  unread:2},
    {name:"Juan dela Cruz", role:"React Developer", last:"I'm available for an interview.", time:"1h ago",  unread:0},
    {name:"Ana Reyes",      role:"Data Analyst",   last:"Looking forward to hearing from you.", time:"3h ago", unread:1},
  ];
  const messages = [
    {from:"them", text:"Hello! I saw your job listing and I'm very interested.", time:"10:00 AM"},
    {from:"me",   text:"Hi! Thanks for reaching out. We reviewed your portfolio — it's impressive.", time:"10:15 AM"},
    {from:"them", text:"Thank you so much! I'm particularly proud of my accessibility audit project.", time:"10:18 AM"},
    {from:"me",   text:"That's exactly what we're looking for. Would you be available for an interview this week?", time:"10:22 AM"},
    {from:"them", text:"Thank you for the opportunity!", time:"10:25 AM"},
  ];
  return (
    <div>
      <h1 style={{ fontSize:26, fontWeight:800, color:BASE.navy, marginBottom:4 }}>Messages</h1>
      <p style={{ color:BASE.muted, fontSize:14, marginBottom:20 }}>Communicate directly with candidates.</p>
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:20, height:520 }}>
        <div style={{ background:BASE.card, borderRadius:16, border:`1px solid ${BASE.border}`, overflow:"hidden" }}>
          {convos.map((cv,i) => (
            <div key={i} onClick={() => setActive(i)} style={{ padding:"16px 20px", borderBottom:`1px solid ${BASE.border}`, cursor:"pointer", background:active===i?T.accentLight:"transparent", borderLeft:`3px solid ${active===i?T.accent:"transparent"}`, transition:"background 0.15s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <span style={{ fontSize:14, fontWeight:700, color:BASE.navy }}>{cv.name}</span>
                <span style={{ fontSize:11, color:BASE.muted }}>{cv.time}</span>
              </div>
              <div style={{ fontSize:12, color:BASE.muted, marginBottom:4 }}>{cv.role}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:BASE.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:150 }}>{cv.last}</span>
                {cv.unread>0 && <span style={{ background:T.accent, color:"#fff", borderRadius:99, fontSize:10, fontWeight:800, width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center" }}>{cv.unread}</span>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:BASE.card, borderRadius:16, border:`1px solid ${BASE.border}`, display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"16px 24px", borderBottom:`1px solid ${BASE.border}`, display:"flex", alignItems:"center", gap:12 }}>
            <Avatar name={convos[active].name} size={36} accent={T.accent} />
            <div><div style={{ fontSize:14, fontWeight:700, color:BASE.navy }}>{convos[active].name}</div><div style={{ fontSize:12, color:BASE.success, fontWeight:600 }}>● Online</div></div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:12 }}>
            {messages.map((m,i) => (
              <div key={i} style={{ display:"flex", justifyContent:m.from==="me"?"flex-end":"flex-start" }}>
                <div style={{ maxWidth:"70%", background:m.from==="me"?`linear-gradient(135deg, ${T.sidebar}, ${T.sidebarEnd})`:"#F0F2FA", borderRadius:m.from==="me"?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"10px 14px" }}>
                  <p style={{ margin:0, fontSize:13, color:m.from==="me"?"#fff":BASE.navy, lineHeight:1.5 }}>{m.text}</p>
                  <div style={{ fontSize:10, color:m.from==="me"?"rgba(255,255,255,0.5)":BASE.muted, marginTop:4, textAlign:"right" }}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:"16px 24px", borderTop:`1px solid ${BASE.border}`, display:"flex", gap:10 }}>
            <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type a message…"
              style={{ flex:1, padding:"10px 16px", borderRadius:10, border:`1.5px solid ${BASE.border}`, fontSize:13, outline:"none", fontFamily:"inherit" }} />
            <button onClick={() => setMsg("")} style={{ padding:"10px 18px", borderRadius:10, border:"none", background:`linear-gradient(135deg, ${T.sidebar}, ${T.sidebarEnd})`, color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:700 }}>
              <Icon name="send" size={14} color="#fff" /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StarRating = ({ label }) => {
  const [rating, setRating] = useState(0), [hover, setHover] = useState(0);
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:13, fontWeight:600, color:BASE.navy, marginBottom:8 }}>{label}</div>
      <div style={{ display:"flex", gap:4 }}>
        {[1,2,3,4,5].map(s => (
          <button key={s} onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
            style={{ background:"none", border:"none", cursor:"pointer", padding:2 }}>
            <Icon name="star" size={24} color={(hover||rating)>=s?"#D97706":BASE.border} />
          </button>
        ))}
      </div>
    </div>
  );
};

const PageFeedback = ({ T }) => (
  <div>
    <h1 style={{ fontSize:26, fontWeight:800, color:BASE.navy, marginBottom:4 }}>Feedback</h1>
    <p style={{ color:BASE.muted, fontSize:14, marginBottom:28 }}>Rate candidates and provide structured hiring feedback.</p>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
      <div style={{ background:BASE.card, borderRadius:16, padding:28, border:`1px solid ${BASE.border}`, boxShadow:"0 1px 4px rgba(26,39,68,0.06)" }}>
        <h2 style={{ fontSize:15, fontWeight:700, color:BASE.navy, marginBottom:20 }}>Rate a Candidate</h2>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24, padding:16, background:"#F8F9FD", borderRadius:12 }}>
          <Avatar name="Maria" size={44} accent={T.accent} />
          <div><div style={{ fontSize:14, fontWeight:700, color:BASE.navy }}>Maria Santos</div><div style={{ fontSize:12, color:BASE.muted }}>UX Designer · Applied for Senior UX Role</div></div>
        </div>
        <StarRating label="Technical Skills" /><StarRating label="Communication" /><StarRating label="Culture Fit" /><StarRating label="Portfolio Quality" />
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:600, color:BASE.navy, marginBottom:8 }}>Overall Recommendation</div>
          <div style={{ display:"flex", gap:8 }}>
            {["Strong Hire","Hire","No Hire"].map(opt => <button key={opt} style={{ padding:"8px 16px", borderRadius:10, border:`1.5px solid ${BASE.border}`, background:BASE.card, color:BASE.navy, fontSize:13, fontWeight:600, cursor:"pointer" }}>{opt}</button>)}
          </div>
        </div>
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:600, color:BASE.navy, marginBottom:8 }}>Notes</div>
          <textarea rows={3} placeholder="Add your hiring notes here…" style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${BASE.border}`, fontSize:13, fontFamily:"inherit", resize:"none", outline:"none", boxSizing:"border-box" }} />
        </div>
        <button style={{ width:"100%", padding:"12px", borderRadius:10, border:"none", background:`linear-gradient(135deg, ${T.sidebar}, ${T.sidebarEnd})`, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>Submit Feedback</button>
      </div>
      <div style={{ background:BASE.card, borderRadius:16, padding:28, border:`1px solid ${BASE.border}`, boxShadow:"0 1px 4px rgba(26,39,68,0.06)" }}>
        <h2 style={{ fontSize:15, fontWeight:700, color:BASE.navy, marginBottom:20 }}>Recent Feedback Submitted</h2>
        {[{name:"Juan dela Cruz",rec:"Strong Hire",score:4.8,date:"Yesterday"},{name:"Ana Reyes",rec:"Hire",score:4.2,date:"2 days ago"},{name:"Carlos Bautista",rec:"Hire",score:3.9,date:"3 days ago"}].map((f,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 0", borderBottom:i<2?`1px solid ${BASE.border}`:"none" }}>
            <Avatar name={f.name} size={40} accent={T.accent} />
            <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700, color:BASE.navy }}>{f.name}</div><div style={{ fontSize:12, color:BASE.muted }}>{f.date}</div></div>
            <div style={{ textAlign:"right" }}><Badge label={f.rec} type="success" /><div style={{ fontSize:12, color:BASE.muted, marginTop:4 }}>★ {f.score}</div></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Company Profile — populated from onboarding ──────────────────────────────
const PageProfile = ({ profile, T }) => {
  const s1 = profile?.s1 || {};
  const s2 = profile?.s2 || {};
  if (!s2.company) {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:400, textAlign:"center" }}>
        <div style={{ fontSize:56, marginBottom:16 }}>🏢</div>
        <h2 style={{ fontSize:22, fontWeight:800, color:BASE.navy, marginBottom:8 }}>Company Profile</h2>
        <p style={{ color:BASE.muted, maxWidth:340 }}>Complete onboarding to populate your company profile.</p>
        <a href="/employer/onboarding" style={{ marginTop:20, padding:"10px 24px", borderRadius:10, background:`linear-gradient(135deg, ${T.sidebar}, ${T.sidebarEnd})`, color:"#fff", fontSize:14, fontWeight:700, textDecoration:"none" }}>Go to Onboarding →</a>
      </div>
    );
  }
  return (
    <div>
      <h1 style={{ fontSize:26, fontWeight:800, color:BASE.navy, marginBottom:4 }}>Company Profile</h1>
      <p style={{ color:BASE.muted, fontSize:14, marginBottom:28 }}>Your public employer page on InklusiJobs.</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:24 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:BASE.card, borderRadius:16, padding:24, border:`1px solid ${BASE.border}`, textAlign:"center" }}>
            <div style={{ width:72, height:72, borderRadius:16, background:`linear-gradient(135deg, ${T.sidebar}, ${T.sidebarEnd})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:900, color:"#fff", margin:"0 auto 16px" }}>{(s2.company||"?")[0]}</div>
            <h2 style={{ fontSize:18, fontWeight:800, color:BASE.navy, marginBottom:4 }}>{s2.company}</h2>
            <p style={{ fontSize:13, color:BASE.muted, marginBottom:12 }}>{s2.industry}{s2.size ? ` · ${s2.size} employees` : ""}</p>
            {s2.website && <a href={s2.website} target="_blank" rel="noreferrer" style={{ fontSize:13, color:T.accent, fontWeight:600 }}>{s2.website}</a>}
          </div>
          <div style={{ background:BASE.card, borderRadius:16, padding:20, border:`1px solid ${BASE.border}` }}>
            <div style={{ fontSize:13, fontWeight:700, color:BASE.navy, marginBottom:12 }}>HR Contact</div>
            <div style={{ fontSize:13, color:BASE.muted }}>{s1.firstName} {s1.lastName}</div>
            <div style={{ fontSize:13, color:BASE.muted }}>{s1.title}</div>
            <div style={{ fontSize:13, color:T.accent, marginTop:4 }}>{s1.email}</div>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {s2.culture && (
            <div style={{ background:BASE.card, borderRadius:16, padding:24, border:`1px solid ${BASE.border}` }}>
              <div style={{ fontSize:13, fontWeight:700, color:BASE.navy, marginBottom:10 }}>Mission & Culture</div>
              <p style={{ fontSize:14, color:BASE.muted, lineHeight:1.7, margin:0 }}>{s2.culture}</p>
            </div>
          )}
          {s2.benefits?.length > 0 && (
            <div style={{ background:BASE.card, borderRadius:16, padding:24, border:`1px solid ${BASE.border}` }}>
              <div style={{ fontSize:13, fontWeight:700, color:BASE.navy, marginBottom:12 }}>Benefits & Perks</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {s2.benefits.map(b => <span key={b} style={{ background:T.accentLight, color:T.accent, fontSize:12, fontWeight:600, padding:"4px 12px", borderRadius:99 }}>{b}</span>)}
              </div>
            </div>
          )}
          {s2.accommodations?.length > 0 && (
            <div style={{ background:BASE.card, borderRadius:16, padding:24, border:`1px solid ${BASE.border}` }}>
              <div style={{ fontSize:13, fontWeight:700, color:BASE.navy, marginBottom:12 }}>Disability Accommodations</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {s2.accommodations.map(a => <span key={a} style={{ background:BASE.successBg, color:BASE.success, fontSize:12, fontWeight:600, padding:"4px 12px", borderRadius:99 }}>✓ {a}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PageSettings = ({ profile, T }) => {
  const s5 = profile?.s5 || {};
  const s1 = profile?.s1 || {};
  return (
    <div>
      <h1 style={{ fontSize:26, fontWeight:800, color:BASE.navy, marginBottom:4 }}>Settings</h1>
      <p style={{ color:BASE.muted, fontSize:14, marginBottom:28 }}>Your preferences from onboarding. Edit anytime.</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div style={{ background:BASE.card, borderRadius:16, padding:24, border:`1px solid ${BASE.border}` }}>
          <div style={{ fontSize:14, fontWeight:700, color:BASE.navy, marginBottom:16 }}>Dashboard Preferences</div>
          <div style={{ fontSize:13, color:BASE.muted, marginBottom:8 }}>Theme: <strong style={{ color:BASE.navy }}>{s5.theme||"navy"}</strong></div>
          <div style={{ fontSize:13, color:BASE.muted, marginBottom:8 }}>Layout: <strong style={{ color:BASE.navy }}>{s5.layout||"Comfortable"}</strong></div>
          <div style={{ fontSize:13, color:BASE.muted, marginBottom:16 }}>Active widgets: <strong style={{ color:BASE.navy }}>{(s5.widgets||[]).join(", ")||"None"}</strong></div>
          <a href="/employer/onboarding" style={{ display:"inline-block", padding:"10px 20px", borderRadius:10, background:`linear-gradient(135deg, ${T.sidebar}, ${T.sidebarEnd})`, color:"#fff", fontSize:13, fontWeight:700, textDecoration:"none" }}>Edit in Onboarding →</a>
        </div>
        <div style={{ background:BASE.card, borderRadius:16, padding:24, border:`1px solid ${BASE.border}` }}>
          <div style={{ fontSize:14, fontWeight:700, color:BASE.navy, marginBottom:16 }}>Team Members</div>
          {(s5.teammates||[]).filter(t => t.trim()).length > 0 ? (
            (s5.teammates||[]).filter(t => t.trim()).map((t,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:`1px solid ${BASE.border}` }}>
                <Avatar name={t} size={32} accent={T.accent} />
                <span style={{ fontSize:13, color:BASE.navy }}>{t}</span>
              </div>
            ))
          ) : <p style={{ fontSize:13, color:BASE.muted }}>No team members invited yet.</p>}
        </div>
      </div>
    </div>
  );
};

// ── Page router ──────────────────────────────────────────────────────────────
const renderPage = (id, profile, T) => {
  switch (id) {
    case "overview":   return <PageOverview   profile={profile} T={T} />;
    case "jobs":       return <PageJobs       profile={profile} T={T} />;
    case "candidates": return <PageCandidates profile={profile} T={T} />;
    case "portfolio":  return <PagePortfolio  profile={profile} T={T} />;
    case "messages":   return <PageMessages   T={T} />;
    case "analytics":  return <PageAnalytics  profile={profile} T={T} />;
    case "feedback":   return <PageFeedback   T={T} />;
    case "profile":    return <PageProfile    profile={profile} T={T} />;
    case "settings":   return <PageSettings   profile={profile} T={T} />;
    default:           return <PageOverview   profile={profile} T={T} />;
  }
};

// ════════════════════════════════════════════════════════════════════════════
//  MAIN DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
export default function EmployerDashboard() {
  const [active,      setActive]      = useState("overview");
  const [collapsed,   setCollapsed]   = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search,      setSearch]      = useState("");
  const [profile,     setProfile]     = useState(null);

  // Load from localStorage on mount — redirect to onboarding if no data yet
  useEffect(() => {
    const data = loadProfile();
    if (!data) {
      window.location.href = "/employer/onboarding";
    } else {
      setProfile(data);
    }
  }, []);

  // Pick theme from onboarding Step 5, fallback to navy
  const themeKey = profile?.s5?.theme || "navy";
  const T = THEMES[themeKey] || THEMES.navy;

  const s1 = profile?.s1 || {};
  const s2 = profile?.s2 || {};

  const companyName = s2.company  || "Your Company";
  const adminName   = s1.firstName ? `${s1.firstName} ${s1.lastName||""}`.trim() : "HR Admin";
  const adminInitial = (s1.firstName || "H")[0].toUpperCase();
  const companyInitial = companyName[0].toUpperCase();

  const SB_W = collapsed ? 68 : 252;

  return (
    <div style={{ display:"flex", height:"100vh", background:BASE.bg, fontFamily:"'Lexend','DM Sans',sans-serif", color:BASE.navy, overflow:"hidden" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width:SB_W, minWidth:SB_W, height:"100vh", background:`linear-gradient(180deg, ${T.sidebar} 0%, ${T.sidebarEnd} 100%)`, display:"flex", flexDirection:"column", transition:"width 0.25s cubic-bezier(0.4,0,0.2,1)", overflow:"hidden", boxShadow:"4px 0 24px rgba(26,39,68,0.18)", zIndex:20, flexShrink:0 }}>

        {/* Brand — shows real company name */}
        <div style={{ padding:collapsed?"22px 14px":"22px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:12, overflow:"hidden" }}>
          <div style={{ width:38, height:38, borderRadius:"50%", background:`linear-gradient(135deg, ${T.accent}, rgba(255,255,255,0.3))`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:15, color:"#fff", flexShrink:0 }}>{companyInitial}</div>
          {!collapsed && (
            <div style={{ overflow:"hidden" }}>
              <div style={{ fontSize:13, fontWeight:800, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{companyName}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>Employer Account</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"10px 0", overflowY:"auto" }}>
          {NAV.map(n => {
            const on = active === n.id;
            return (
              <button key={n.id} onClick={() => setActive(n.id)} aria-current={on?"page":undefined} title={collapsed?n.label:undefined}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:collapsed?"11px 0":"11px 20px", justifyContent:collapsed?"center":"flex-start", background:on?`linear-gradient(90deg, ${T.accent}33, ${T.accent}0A)`:"none", border:"none", borderLeft:`3px solid ${on?T.accent:"transparent"}`, color:on?"#fff":"rgba(255,255,255,0.5)", cursor:"pointer", transition:"all 0.15s" }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.color="rgba(255,255,255,0.85)"; }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.color="rgba(255,255,255,0.5)";  }}>
                <Icon name={n.icon} size={17} color="currentColor" />
                {!collapsed && <span style={{ fontSize:13, fontWeight:on?700:500, whiteSpace:"nowrap" }}>{n.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse */}
        <div style={{ padding:"14px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => setCollapsed(v => !v)} aria-label={collapsed?"Expand sidebar":"Collapse sidebar"}
            style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:collapsed?"center":"flex-start", gap:8, background:"rgba(255,255,255,0.06)", border:"none", borderRadius:10, padding:"9px", color:"rgba(255,255,255,0.55)", cursor:"pointer" }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.06)"}>
            <Icon name={collapsed?"chevRight":"chevLeft"} size={15} color="currentColor" />
            {!collapsed && <span style={{ fontSize:12, fontWeight:600 }}>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

        {/* Top bar */}
        <header style={{ height:62, background:BASE.card, borderBottom:`1px solid ${BASE.border}`, display:"flex", alignItems:"center", padding:"0 24px", gap:14, boxShadow:"0 1px 4px rgba(26,39,68,0.06)", zIndex:10, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:BASE.muted, flex:1 }}>
            <span style={{ color:T.accent, fontWeight:700 }}>InklusiJobs</span>
            <Icon name="chevRight" size={13} color={BASE.muted} />
            <span style={{ color:BASE.navy, fontWeight:700 }}>{NAV.find(n => n.id===active)?.label}</span>
          </div>

          <div style={{ position:"relative", maxWidth:260, width:"100%" }}>
            <div style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)" }}><Icon name="search" size={14} color={BASE.muted} /></div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search candidates, jobs…"
              style={{ width:"100%", padding:"8px 12px 8px 34px", borderRadius:10, border:`1.5px solid ${BASE.border}`, fontSize:13, background:"#F8F9FD", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
          </div>

          {/* Bell */}
          <div style={{ position:"relative" }}>
            <button onClick={() => { setNotifOpen(v=>!v); setProfileOpen(false); }}
              style={{ width:38, height:38, borderRadius:10, border:`1.5px solid ${BASE.border}`, background:BASE.card, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative" }}>
              <Icon name="bell" size={17} color={BASE.navy} />
              <span style={{ position:"absolute", top:7, right:7, width:7, height:7, borderRadius:"50%", background:BASE.error, border:"2px solid white" }} />
            </button>
            {notifOpen && (
              <div style={{ position:"absolute", top:46, right:0, width:300, background:BASE.card, borderRadius:14, border:`1px solid ${BASE.border}`, boxShadow:"0 12px 40px rgba(26,39,68,0.15)", zIndex:100, overflow:"hidden" }}>
                <div style={{ padding:"13px 18px", borderBottom:`1px solid ${BASE.border}`, fontSize:14, fontWeight:700, color:BASE.navy }}>Notifications</div>
                {[
                  {text:"New application from Maria Santos", time:"2 min ago",  dot:T.accent      },
                  {text:"Interview reminder: Juan at 3pm",   time:"1 hour ago", dot:BASE.warning  },
                  {text:"AI matched 5 new candidates",       time:"Today",      dot:BASE.success  },
                ].map((n,i) => (
                  <div key={i} style={{ padding:"11px 18px", borderBottom:i<2?`1px solid ${BASE.border}`:"none", display:"flex", gap:10, alignItems:"flex-start" }}>
                    <span style={{ width:7, height:7, borderRadius:"50%", background:n.dot, marginTop:5, flexShrink:0 }} />
                    <div><div style={{ fontSize:13, color:BASE.navy, fontWeight:600 }}>{n.text}</div><div style={{ fontSize:11, color:BASE.muted }}>{n.time}</div></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile — shows real name */}
          <div style={{ position:"relative" }}>
            <button onClick={() => { setProfileOpen(v=>!v); setNotifOpen(false); }}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 10px 5px 5px", borderRadius:10, border:`1.5px solid ${BASE.border}`, background:BASE.card, cursor:"pointer" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg, ${T.accent}, ${T.sidebar})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:12 }}>{adminInitial}</div>
              <span style={{ fontSize:13, fontWeight:700, color:BASE.navy }}>{adminName}</span>
              <Icon name="chevDown" size={13} color={BASE.muted} />
            </button>
            {profileOpen && (
              <div style={{ position:"absolute", top:46, right:0, width:200, background:BASE.card, borderRadius:14, border:`1px solid ${BASE.border}`, boxShadow:"0 12px 40px rgba(26,39,68,0.15)", zIndex:100 }}>
                {["Profile","Company Settings","Billing","Sign Out"].map((item,i) => (
                  <button key={i} style={{ width:"100%", padding:"11px 18px", background:"none", border:"none", fontSize:13, color:item==="Sign Out"?BASE.error:BASE.navy, fontWeight:item==="Sign Out"?700:500, textAlign:"left", cursor:"pointer", borderBottom:i<3?`1px solid ${BASE.border}`:"none", fontFamily:"inherit" }}
                    onMouseEnter={e => e.currentTarget.style.background="#F8F9FD"}
                    onMouseLeave={e => e.currentTarget.style.background="none"}>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex:1, overflowY:"auto", padding:28 }}
          onClick={() => { setNotifOpen(false); setProfileOpen(false); }}>
          {renderPage(active, profile, T)}
        </main>
      </div>
    </div>
  );
}