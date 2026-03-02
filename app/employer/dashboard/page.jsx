"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* ─── THEME ──────────────────────────────────────────────────────────────── */
const T = {
  teal:       "#0F5C6E",
  tealMid:    "#1A8FA5",
  tealLight:  "#E6F4F6",
  tealGlow:   "rgba(15,92,110,0.12)",
  navy:       "#0A2A35",
  navyLight:  "#122F3D",
  bodyText:   "#1E3A45",
  muted:      "#6B8A95",
  border:     "#D0E4E8",
  bg:         "#F0F6F8",
  white:      "#FFFFFF",
  success:    "#059669",
  successBg:  "#ECFDF5",
  warning:    "#D97706",
  warningBg:  "#FFFBEB",
  danger:     "#DC2626",
  accent:     "#2D6A8F",
};

/* ─── MOCK DATA (filtered by onboarding answers) ─────────────────────────── */
const ALL_CANDIDATES = [
  { id:1,  name:"Maria Santos",    initials:"MS", role:"Software Developer",    match:97, skills:["JavaScript","React","Accessibility"], disability:"Visual Impairment",    exp:"3 yrs",  status:"New",         budget:"₱80k–₱150k" },
  { id:2,  name:"Juan dela Cruz",  initials:"JD", role:"Data Analyst",          match:93, skills:["Python","SQL","Excel"],              disability:"Hearing Impairment",   exp:"2 yrs",  status:"Reviewed",    budget:"₱40k–₱80k"  },
  { id:3,  name:"Ana Reyes",       initials:"AR", role:"Content Writer",        match:89, skills:["Content Writing","SEO","Canva"],     disability:"Mobility Disability",  exp:"4 yrs",  status:"New",         budget:"₱20k–₱40k"  },
  { id:4,  name:"Pedro Lim",       initials:"PL", role:"Customer Support",      match:85, skills:["Customer Service","Communication"],  disability:"Speech Impairment",    exp:"1 yr",   status:"Shortlisted", budget:"₱20k–₱40k"  },
  { id:5,  name:"Rosa Gomez",      initials:"RG", role:"HR Manager",            match:83, skills:["HR Management","Project Management"],disability:"Chronic Illness",      exp:"5 yrs",  status:"New",         budget:"₱80k–₱150k" },
  { id:6,  name:"Carlo Mendoza",   initials:"CM", role:"Designer",              match:80, skills:["Figma","Canva","Social Media"],      disability:"Autism Spectrum",      exp:"2 yrs",  status:"Reviewed",    budget:"₱40k–₱80k"  },
  { id:7,  name:"Liza Castillo",   initials:"LC", role:"DevOps Engineer",       match:76, skills:["AWS","Node.js","TypeScript"],        disability:"ADHD",                 exp:"3 yrs",  status:"New",         budget:"₱80k–₱150k" },
  { id:8,  name:"Ben Torres",      initials:"BT", role:"Product Manager",       match:74, skills:["Project Management","Communication"],"disability":"Physical Disability", exp:"6 yrs",  status:"Shortlisted", budget:"₱150k+"     },
];

const MOCK_JOBS = [
  { id:1, title:"Senior React Developer",  type:"Full-time",   applicants:14, posted:"2 days ago",  status:"Active",  urgent:true  },
  { id:2, title:"Data Analyst",            type:"Part-time",   applicants:9,  posted:"5 days ago",  status:"Active",  urgent:false },
  { id:3, title:"Customer Support Agent",  type:"Contract",    applicants:22, posted:"1 day ago",   status:"Active",  urgent:true  },
  { id:4, title:"UX/UI Designer",          type:"Freelance",   applicants:6,  posted:"1 week ago",  status:"Draft",   urgent:false },
  { id:5, title:"HR Coordinator",          type:"Full-time",   applicants:11, posted:"3 days ago",  status:"Active",  urgent:false },
];

/* ─── PRIMITIVES ─────────────────────────────────────────────────────────── */
const Card = ({ children, style={}, onClick }) => (
  <div onClick={onClick} style={{ background:T.white, borderRadius:16, border:`1px solid ${T.border}`, padding:"24px", boxShadow:"0 2px 12px rgba(10,42,53,0.06)", ...style }}>
    {children}
  </div>
);

const Badge = ({ children, color=T.teal, style={} }) => (
  <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 10px", borderRadius:99, background:`${color}18`, color, fontSize:12, fontWeight:700, border:`1px solid ${color}30`, ...style }}>
    {children}
  </span>
);

const Avatar = ({ initials, size=44, color=T.teal }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg, ${color}, ${T.tealMid})`, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.32, fontWeight:800, flexShrink:0 }}>
    {initials}
  </div>
);

const SectionHead = ({ children, action }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
    <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:T.navy }}>{children}</h3>
    {action && <button onClick={action.fn} style={{ fontSize:13, color:T.teal, fontWeight:700, background:"none", border:"none", cursor:"pointer", padding:0 }}>{action.label}</button>}
  </div>
);

const ProgressBar = ({ value, max=100, color=T.teal, height=8 }) => (
  <div style={{ height, borderRadius:99, background:T.border, overflow:"hidden" }}>
    <div style={{ height:"100%", width:`${(value/max)*100}%`, background:`linear-gradient(90deg,${color},${T.tealMid})`, borderRadius:99, transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
  </div>
);

/* ─── SIDEBAR ────────────────────────────────────────────────────────────── */
const TABS = [
  { id:"overview",    label:"Overview",          icon:"⬡",  emoji:"🏠" },
  { id:"candidates",  label:"Candidate Matches", icon:"◎",  emoji:"👥" },
  { id:"jobs",        label:"Job Listings",      icon:"▣",  emoji:"💼" },
  { id:"profile",     label:"Company Profile",   icon:"◈",  emoji:"🏢" },
  { id:"analytics",   label:"Analytics",         icon:"◉",  emoji:"📊" },
  { id:"messages",    label:"Messages",          icon:"◻",  emoji:"💬" },
  { id:"settings",    label:"Settings",          icon:"✦",  emoji:"⚙️" },
];

const Sidebar = ({ active, onTab, profile, open, onToggle }) => {
  const s1 = profile?.s1 || {};
  return (
    <aside style={{ width:open?256:68, background:T.navy, display:"flex", flexDirection:"column", transition:"width 0.28s cubic-bezier(0.4,0,0.2,1)", flexShrink:0, overflow:"hidden", position:"relative" }}>
      {/* Logo */}
      <div style={{ padding:"22px 16px 18px", borderBottom:`1px solid rgba(255,255,255,0.07)`, display:"flex", alignItems:"center", justifyContent: open ? "flex-start" : "center" }}>
        {open ? (
          <div style={{ background:"#fff", borderRadius:10, padding:"7px 14px" }}>
            <Image src="/images/logo.png" alt="InklusiJobs" width={110} height={30} style={{ objectFit:"contain", display:"block" }} />
          </div>
        ) : (
          <div style={{ width:36, height:36, borderRadius:10, background:T.teal, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>♿</div>
        )}
      </div>

      {/* Company mini card */}
      {open && (
        <div style={{ padding:"14px 16px", borderBottom:`1px solid rgba(255,255,255,0.07)` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {s1.logoPreview
              ? <img src={s1.logoPreview} alt="" style={{ width:38, height:38, borderRadius:9, objectFit:"contain", background:"#fff", padding:4, flexShrink:0 }} />
              : <div style={{ width:38, height:38, borderRadius:9, background:T.teal, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🏢</div>
            }
            <div style={{ overflow:"hidden" }}>
              <div style={{ color:"#fff", fontWeight:800, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s1.company || "Your Company"}</div>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11, marginTop:1 }}>{s1.industry || "Company"}</div>
            </div>
          </div>
          <div style={{ marginTop:10, display:"inline-flex", alignItems:"center", gap:5, background:"rgba(5,150,105,0.18)", padding:"3px 10px", borderRadius:99 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#34D399", display:"inline-block" }} />
            <span style={{ color:"#6EE7B7", fontSize:11, fontWeight:700 }}>Active</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex:1, padding:"10px 0", overflowY:"auto" }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => onTab(tab.id)} title={!open ? tab.label : undefined}
            style={{ display:"flex", alignItems:"center", gap:12, width:"100%", padding: open ? "12px 18px" : "12px", justifyContent: open ? "flex-start" : "center", background: active===tab.id ? "rgba(15,92,110,0.4)" : "transparent", border:"none", borderLeft:`3px solid ${active===tab.id ? T.tealMid : "transparent"}`, cursor:"pointer", color: active===tab.id ? "#fff" : "rgba(255,255,255,0.48)", fontSize:14, fontWeight: active===tab.id ? 700 : 500, fontFamily:"Arial, sans-serif", transition:"all 0.15s", whiteSpace:"nowrap" }}>
            <span style={{ fontSize:18, flexShrink:0 }}>{tab.emoji}</span>
            {open && tab.label}
          </button>
        ))}
      </nav>

      {/* Collapse btn */}
      <button onClick={onToggle}
        style={{ background:"rgba(255,255,255,0.05)", border:"none", borderTop:`1px solid rgba(255,255,255,0.07)`, color:"rgba(255,255,255,0.38)", padding:"13px", cursor:"pointer", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent: open ? "flex-end" : "center", gap:6, fontFamily:"Arial, sans-serif" }}>
        {open ? <>Collapse ◀</> : "▶"}
      </button>
    </aside>
  );
};

/* ─── TOPBAR ─────────────────────────────────────────────────────────────── */
const Topbar = ({ profile, activeTab, onReset }) => {
  const s1 = profile?.s1 || {};
  const tabInfo = TABS.find(t => t.id === activeTab);
  const initials = (s1.company || "E")[0].toUpperCase();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header style={{ background:T.white, borderBottom:`1px solid ${T.border}`, padding:"14px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, zIndex:10 }}>
      <div>
        <h1 style={{ margin:0, fontSize:21, fontWeight:900, color:T.navy, fontFamily:"Arial, sans-serif" }}>
          {tabInfo?.emoji} {tabInfo?.label}
        </h1>
        <div style={{ fontSize:13, color:T.muted, marginTop:2 }}>{new Date().toLocaleDateString("en-PH",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        {/* Notifications bell */}
        <button style={{ width:38, height:38, borderRadius:10, border:`1px solid ${T.border}`, background:T.white, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, position:"relative" }}>
          🔔
          <span style={{ position:"absolute", top:6, right:6, width:8, height:8, borderRadius:"50%", background:"#EF4444", border:"2px solid #fff" }} />
        </button>
        {/* Avatar menu */}
        <div style={{ position:"relative" }} ref={menuRef}>
          <button onClick={() => setMenuOpen(m => !m)}
            style={{ display:"flex", alignItems:"center", gap:10, background:T.bg, border:`1px solid ${T.border}`, borderRadius:12, padding:"6px 12px 6px 6px", cursor:"pointer" }}>
            {s1.logoPreview
              ? <img src={s1.logoPreview} alt="" style={{ width:30, height:30, borderRadius:8, objectFit:"contain", background:T.white, padding:2 }} />
              : <div style={{ width:30, height:30, borderRadius:8, background:T.teal, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:900 }}>{initials}</div>
            }
            <span style={{ fontSize:13, fontWeight:700, color:T.navy }}>{s1.company || "Employer"}</span>
            <span style={{ fontSize:11, color:T.muted }}>▾</span>
          </button>
          {menuOpen && (
            <div style={{ position:"absolute", right:0, top:"110%", background:T.white, border:`1px solid ${T.border}`, borderRadius:12, boxShadow:"0 8px 24px rgba(0,0,0,0.1)", zIndex:100, minWidth:180, overflow:"hidden" }}>
              <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.navy }}>{s1.company || "Your Company"}</div>
                <div style={{ fontSize:12, color:T.muted }}>{s1.industry || ""}</div>
              </div>
              <button onClick={onReset}
                style={{ display:"block", width:"100%", textAlign:"left", padding:"11px 16px", border:"none", background:"none", fontSize:13, color:T.danger, fontWeight:700, cursor:"pointer", fontFamily:"Arial, sans-serif" }}>
                🔄 Redo Onboarding
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

/* ─── OVERVIEW TAB ───────────────────────────────────────────────────────── */
const OverviewTab = ({ profile, onTab }) => {
  const s1 = profile?.s1 || {};
  const s2 = profile?.s2 || {};
  const s3 = profile?.s3 || {};
  const s4 = profile?.s4 || {};

  const topCandidates = ALL_CANDIDATES.slice(0, 4);
  const activeJobs    = MOCK_JOBS.filter(j => j.status === "Active");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>

      {/* Welcome hero */}
      <div style={{ background:`linear-gradient(130deg, ${T.navy} 0%, ${T.teal} 100%)`, borderRadius:20, padding:"32px 36px", color:"#fff", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, overflow:"hidden", position:"relative" }}>
        <div style={{ position:"absolute", right:-40, top:-40, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />
        <div style={{ position:"absolute", right:60, bottom:-60, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />
        <div style={{ position:"relative" }}>
          <div style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.55)", marginBottom:8, letterSpacing:"0.06em", textTransform:"uppercase" }}>Welcome back</div>
          <h2 style={{ fontSize:30, fontWeight:900, margin:"0 0 8px", fontFamily:"Arial, sans-serif", letterSpacing:"-0.5px" }}>
            {s1.company || "Your Company"}
          </h2>
          <div style={{ fontSize:14, color:"rgba(255,255,255,0.65)", marginBottom:16 }}>
            {[s1.industry, s1.size && `${s1.size} employees`, s2.workSetup].filter(Boolean).join("  ·  ")}
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <span style={{ background:"rgba(255,255,255,0.14)", backdropFilter:"blur(4px)", padding:"6px 14px", borderRadius:99, fontSize:12, fontWeight:700, border:"1px solid rgba(255,255,255,0.2)" }}>♿ Inclusive Employer</span>
            {s3.aiSuggest !== false && <span style={{ background:"rgba(255,255,255,0.14)", backdropFilter:"blur(4px)", padding:"6px 14px", borderRadius:99, fontSize:12, fontWeight:700, border:"1px solid rgba(255,255,255,0.2)" }}>✨ AI Matching Active</span>}
            {s3.inclusiveGuidance !== false && <span style={{ background:"rgba(255,255,255,0.14)", backdropFilter:"blur(4px)", padding:"6px 14px", borderRadius:99, fontSize:12, fontWeight:700, border:"1px solid rgba(255,255,255,0.2)" }}>🎯 Inclusive Guidance On</span>}
          </div>
        </div>
        <div style={{ position:"relative", flexShrink:0 }}>
          {s1.logoPreview
            ? <img src={s1.logoPreview} alt="" style={{ width:90, height:90, objectFit:"contain", borderRadius:16, background:"rgba(255,255,255,0.9)", padding:10 }} />
            : <div style={{ width:90, height:90, borderRadius:16, background:"rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, border:"1px solid rgba(255,255,255,0.2)" }}>🏢</div>
          }
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
        {[
          { icon:"👥", label:"Candidate Matches", value:ALL_CANDIDATES.length, sub:`${ALL_CANDIDATES.filter(c=>c.status==="New").length} new this week`, color:T.teal },
          { icon:"💼", label:"Active Job Posts",  value:activeJobs.length, sub:"2 expiring soon", color:T.accent },
          { icon:"📨", label:"Total Applications",value:40, sub:"12 unreviewed", color:T.warning },
          { icon:"✅", label:"Hires This Month",  value:3,  sub:"↑ 1 from last month", color:T.success },
        ].map(stat => (
          <Card key={stat.label} style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"20px" }}>
            <div style={{ width:46, height:46, borderRadius:12, background:`${stat.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize:28, fontWeight:900, color:T.navy, lineHeight:1 }}>{stat.value}</div>
              <div style={{ fontSize:13, fontWeight:700, color:T.bodyText, marginTop:4 }}>{stat.label}</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{stat.sub}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Two column */}
      <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:20 }}>

        {/* Top matches */}
        <Card>
          <SectionHead action={{ label:"View all →", fn:() => onTab("candidates") }}>🌟 Top Candidate Matches</SectionHead>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {topCandidates.map(c => (
              <div key={c.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:12, background:T.bg, border:`1px solid ${T.border}` }}>
                <Avatar initials={c.initials} size={40} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:T.navy }}>{c.name}</div>
                  <div style={{ fontSize:12, color:T.muted }}>{c.role} · {c.exp}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:18, fontWeight:900, color:T.teal }}>{c.match}%</div>
                  <div style={{ fontSize:10, color:T.muted }}>match</div>
                </div>
                <Badge color={c.status==="New" ? T.teal : c.status==="Shortlisted" ? T.success : T.muted}>{c.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Right column */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {/* Job posts */}
          <Card>
            <SectionHead action={{ label:"View all →", fn:() => onTab("jobs") }}>💼 Active Jobs</SectionHead>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {activeJobs.slice(0,3).map(j => (
                <div key={j.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px", borderRadius:10, background:T.bg, border:`1px solid ${T.border}` }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:T.navy }}>{j.title}</div>
                    <div style={{ fontSize:11, color:T.muted }}>{j.type}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:16, fontWeight:800, color:T.navy }}>{j.applicants}</div>
                    <div style={{ fontSize:10, color:T.muted }}>applicants</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Preferences quick glance */}
          <Card>
            <SectionHead>📋 Preferences</SectionHead>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { label:"Work Setup",  value: s2.workSetup || "Not set"  },
                { label:"Budget",      value: s2.budget    || "Not set"  },
                { label:"Experience",  value: s2.expLevel  || "Not set"  },
                { label:"Urgency",     value: s2.urgency   || "Not set"  },
                { label:"Frequency",   value: s2.frequency || "Not set"  },
              ].map(row => (
                <div key={row.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:12, color:T.muted, fontWeight:600 }}>{row.label}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:T.navy }}>{row.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Accommodations & skills */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <Card>
          <SectionHead>♿ Workplace Accommodations</SectionHead>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {(s3.accommodations||[]).length > 0
              ? (s3.accommodations).map(a => <Badge key={a} color={T.success}>{a}</Badge>)
              : <span style={{ fontSize:13, color:T.muted }}>No accommodations listed yet</span>}
          </div>
        </Card>
        <Card>
          <SectionHead>🛠 Required Skills</SectionHead>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {(s2.skills||[]).length > 0
              ? (s2.skills).map(s => <Badge key={s} color={T.accent}>{s}</Badge>)
              : <span style={{ fontSize:13, color:T.muted }}>No skills specified yet</span>}
          </div>
        </Card>
      </div>

      {/* Mission statement */}
      {s4.mission && (
        <Card style={{ borderLeft:`4px solid ${T.teal}` }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.teal, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Company Mission</div>
          <p style={{ fontSize:15, color:T.bodyText, lineHeight:1.75, margin:0, fontStyle:"italic" }}>"{s4.mission}"</p>
        </Card>
      )}
    </div>
  );
};

/* ─── CANDIDATES TAB ─────────────────────────────────────────────────────── */
const CandidatesTab = ({ profile }) => {
  const s2 = profile?.s2 || {};
  const s3 = profile?.s3 || {};
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const statuses = ["All","New","Reviewed","Shortlisted"];

  const filtered = ALL_CANDIDATES.filter(c => {
    if (statusFilter !== "All" && c.status !== statusFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.role.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display:"flex", gap:20, height:"100%" }}>
      {/* List */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:16 }}>
        {/* Filters */}
        <Card style={{ padding:"14px 18px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <div style={{ position:"relative", flex:1, minWidth:200 }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14 }}>🔍</span>
              <input placeholder="Search by name or role..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width:"100%", boxSizing:"border-box", padding:"9px 14px 9px 34px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Arial, sans-serif", outline:"none", background:T.bg }}
                onFocus={e => e.target.style.borderColor=T.teal}
                onBlur={e => e.target.style.borderColor=T.border} />
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {statuses.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  style={{ padding:"8px 16px", borderRadius:99, border:`2px solid ${statusFilter===s ? T.teal : T.border}`, background:statusFilter===s ? T.tealLight : T.white, color:statusFilter===s ? T.teal : T.bodyText, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"Arial, sans-serif" }}>
                  {s}
                </button>
              ))}
            </div>
            <span style={{ fontSize:13, color:T.muted, fontWeight:600 }}>{filtered.length} results</span>
          </div>
        </Card>

        {/* Candidate cards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {filtered.map(c => (
            <Card key={c.id} onClick={() => setSelected(c.id === selected ? null : c.id)}
              style={{ cursor:"pointer", border:`1.5px solid ${selected===c.id ? T.teal : T.border}`, background: selected===c.id ? T.tealLight : T.white, transition:"all 0.15s" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                <Avatar initials={c.initials} size={50} />
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <div style={{ fontSize:16, fontWeight:800, color:T.navy }}>{c.name}</div>
                      <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{c.role} · {c.exp}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:22, fontWeight:900, color:T.teal, lineHeight:1 }}>{c.match}%</div>
                      <div style={{ fontSize:10, color:T.muted }}>match</div>
                    </div>
                  </div>
                  <div style={{ marginTop:10 }}>
                    <ProgressBar value={c.match} color={c.match>=90 ? T.success : c.match>=80 ? T.teal : T.warning} />
                  </div>
                  <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:5 }}>
                    {c.skills.map(sk => <Badge key={sk} color={T.accent}>{sk}</Badge>)}
                  </div>
                  <div style={{ marginTop:10, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <Badge color={T.success}>♿ {c.disability}</Badge>
                    <Badge color={c.status==="New" ? T.teal : c.status==="Shortlisted" ? T.success : T.muted}>{c.status}</Badge>
                  </div>
                  {selected === c.id && (
                    <div style={{ marginTop:12, display:"flex", gap:8 }}>
                      <button style={{ flex:1, padding:"9px", borderRadius:9, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"Arial, sans-serif" }}>View Profile</button>
                      <button style={{ flex:1, padding:"9px", borderRadius:9, border:`1.5px solid ${T.border}`, background:T.white, color:T.bodyText, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"Arial, sans-serif" }}>Message</button>
                      <button style={{ padding:"9px 12px", borderRadius:9, border:`1.5px solid ${T.success}`, background:T.successBg, color:T.success, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"Arial, sans-serif" }}>⭐ Shortlist</button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* AI insight sidebar */}
      {profile?.s3?.aiSuggest !== false && (
        <div style={{ width:260, flexShrink:0, display:"flex", flexDirection:"column", gap:14 }}>
          <Card style={{ background:`linear-gradient(135deg,${T.navy},${T.teal})`, color:"#fff", border:"none" }}>
            <div style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(255,255,255,0.55)", marginBottom:8 }}>✨ AI Insight</div>
            <div style={{ fontSize:14, lineHeight:1.6, color:"rgba(255,255,255,0.85)" }}>
              Based on your preference for <strong style={{ color:"#fff" }}>{profile?.s2?.expLevel || "Mid-Level"}</strong> candidates with <strong style={{ color:"#fff" }}>{profile?.s2?.workSetup || "Remote"}</strong> work, top matches are in the <strong style={{ color:"#fff" }}>{profile?.s1?.industry || "tech"}</strong> sector.
            </div>
          </Card>
          <Card>
            <SectionHead>📊 Match Breakdown</SectionHead>
            {[
              { label:"95–100% match", count:1,  color:T.success },
              { label:"85–94% match",  count:3,  color:T.teal   },
              { label:"75–84% match",  count:3,  color:T.warning },
              { label:"Below 75%",     count:1,  color:T.muted  },
            ].map(row => (
              <div key={row.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:10, height:10, borderRadius:"50%", background:row.color, display:"inline-block" }} />
                  <span style={{ fontSize:12, color:T.bodyText }}>{row.label}</span>
                </div>
                <span style={{ fontSize:13, fontWeight:800, color:T.navy }}>{row.count}</span>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
};

/* ─── JOBS TAB ───────────────────────────────────────────────────────────── */
const JobsTab = ({ profile }) => {
  const s1 = profile?.s1 || {};
  const s2 = profile?.s2 || {};
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({ title:"", type:"Full-time", salary:"", desc:"" });

  const types = (s1.posTypes||[]).length > 0 ? s1.posTypes : ["Full-time","Part-time","Contract","Freelance"];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:14, color:T.muted }}>
          Managing <strong style={{ color:T.navy }}>{MOCK_JOBS.length} job posts</strong> · {MOCK_JOBS.filter(j=>j.status==="Active").length} active
        </div>
        <button onClick={() => setShowForm(s => !s)}
          style={{ padding:"11px 22px", borderRadius:11, border:"none", background:`linear-gradient(135deg,${T.teal},${T.tealMid})`, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Arial, sans-serif", boxShadow:`0 4px 14px ${T.teal}44` }}>
          {showForm ? "✕ Cancel" : "+ Post New Job"}
        </button>
      </div>

      {/* New job form */}
      {showForm && (
        <Card style={{ border:`2px solid ${T.teal}` }}>
          <SectionHead>📝 New Job Post</SectionHead>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:700, color:T.bodyText, display:"block", marginBottom:6 }}>Job Title *</label>
              <input value={newJob.title} onChange={e=>setNewJob({...newJob,title:e.target.value})} placeholder="e.g. Senior React Developer"
                style={{ width:"100%", boxSizing:"border-box", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Arial, sans-serif", outline:"none" }}
                onFocus={e=>e.target.style.borderColor=T.teal} onBlur={e=>e.target.style.borderColor=T.border} />
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:700, color:T.bodyText, display:"block", marginBottom:6 }}>Position Type</label>
              <select value={newJob.type} onChange={e=>setNewJob({...newJob,type:e.target.value})}
                style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Arial, sans-serif", outline:"none", background:T.white }}>
                {types.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:700, color:T.bodyText, display:"block", marginBottom:6 }}>Salary Range</label>
              <input value={newJob.salary} onChange={e=>setNewJob({...newJob,salary:e.target.value})} placeholder={s2.budget || "e.g. ₱40k–₱80k"}
                style={{ width:"100%", boxSizing:"border-box", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Arial, sans-serif", outline:"none" }}
                onFocus={e=>e.target.style.borderColor=T.teal} onBlur={e=>e.target.style.borderColor=T.border} />
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:700, color:T.bodyText, display:"block", marginBottom:6 }}>Work Setup</label>
              <input value={s2.workSetup || ""} readOnly placeholder="From your preferences"
                style={{ width:"100%", boxSizing:"border-box", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Arial, sans-serif", background:T.bg, color:T.muted }} />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ fontSize:13, fontWeight:700, color:T.bodyText, display:"block", marginBottom:6 }}>Job Description</label>
              <textarea rows={4} value={newJob.desc} onChange={e=>setNewJob({...newJob,desc:e.target.value})} placeholder="Describe responsibilities, requirements, and accommodations offered..."
                style={{ width:"100%", boxSizing:"border-box", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Arial, sans-serif", outline:"none", resize:"vertical" }}
                onFocus={e=>e.target.style.borderColor=T.teal} onBlur={e=>e.target.style.borderColor=T.border} />
            </div>
          </div>
          {/* Auto-populated skills from onboarding */}
          {(s2.skills||[]).length > 0 && (
            <div style={{ marginTop:14 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.bodyText, marginBottom:8 }}>Required skills (from your preferences):</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {(s2.skills).map(sk => <Badge key={sk} color={T.accent}>{sk}</Badge>)}
              </div>
            </div>
          )}
          {(profile?.s3?.accommodations||[]).length > 0 && (
            <div style={{ marginTop:14 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.bodyText, marginBottom:8 }}>Accommodations offered:</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {(profile?.s3?.accommodations||[]).map(a => <Badge key={a} color={T.success}>{a}</Badge>)}
              </div>
            </div>
          )}
          <div style={{ marginTop:16, display:"flex", gap:10 }}>
            <button style={{ padding:"11px 24px", borderRadius:10, border:"none", background:T.teal, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Arial, sans-serif" }}>Publish Job</button>
            <button style={{ padding:"11px 24px", borderRadius:10, border:`1.5px solid ${T.border}`, background:T.white, color:T.muted, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Arial, sans-serif" }}>Save as Draft</button>
          </div>
        </Card>
      )}

      {/* Existing jobs */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {MOCK_JOBS.map(j => (
          <Card key={j.id} style={{ display:"flex", alignItems:"center", gap:20 }}>
            <div style={{ width:50, height:50, borderRadius:12, background:j.status==="Active" ? T.tealLight : T.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>💼</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <span style={{ fontSize:16, fontWeight:800, color:T.navy }}>{j.title}</span>
                {j.urgent && <Badge color={T.danger}>🔥 Urgent</Badge>}
              </div>
              <div style={{ fontSize:13, color:T.muted }}>{j.type} · Posted {j.posted} · {s1.company || "Your Company"} · {s2.workSetup || "Remote"}</div>
              {(s2.skills||[]).length > 0 && (
                <div style={{ marginTop:6, display:"flex", gap:6, flexWrap:"wrap" }}>
                  {(s2.skills).slice(0,3).map(sk => <Badge key={sk} color={T.accent}>{sk}</Badge>)}
                </div>
              )}
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <Badge color={j.status==="Active" ? T.success : T.muted}>{j.status}</Badge>
              <div style={{ fontSize:22, fontWeight:900, color:T.navy, marginTop:8 }}>{j.applicants}</div>
              <div style={{ fontSize:11, color:T.muted }}>applicants</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* ─── PROFILE TAB ────────────────────────────────────────────────────────── */
const ProfileTab = ({ profile }) => {
  const s1 = profile?.s1 || {};
  const s2 = profile?.s2 || {};
  const s3 = profile?.s3 || {};
  const s4 = profile?.s4 || {};

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      {/* Header card */}
      <Card style={{ display:"flex", alignItems:"center", gap:24 }}>
        {s1.logoPreview
          ? <img src={s1.logoPreview} alt="" style={{ width:88, height:88, objectFit:"contain", borderRadius:16, border:`1px solid ${T.border}`, padding:8 }} />
          : <div style={{ width:88, height:88, borderRadius:16, background:T.tealLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:44 }}>🏢</div>
        }
        <div style={{ flex:1 }}>
          <h2 style={{ fontSize:26, fontWeight:900, color:T.navy, margin:"0 0 8px", fontFamily:"Arial, sans-serif" }}>{s1.company || "Your Company"}</h2>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {s1.industry    && <Badge color={T.teal}>{s1.industry}</Badge>}
            {(s1.sizeCustom||s1.size) && <Badge color={T.muted}>{s1.sizeCustom||s1.size} employees</Badge>}
            <Badge color={T.success}>♿ Inclusive Employer</Badge>
            {s4.visible !== false && <Badge color={T.accent}>👁 Profile Visible</Badge>}
          </div>
        </div>
        <div style={{ textAlign:"center", padding:"16px 24px", background:T.tealLight, borderRadius:14, border:`1px solid ${T.teal}33` }}>
          <div style={{ fontSize:32, fontWeight:900, color:T.teal }}>96%</div>
          <div style={{ fontSize:12, fontWeight:700, color:T.teal }}>Profile Complete</div>
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Company details */}
        <Card>
          <SectionHead>🏢 Company Details</SectionHead>
          {[
            ["Company Name",     s1.company],
            ["Industry",         s1.industry],
            ["Company Size",     s1.sizeCustom || s1.size],
            ["Position Types",   (s1.posTypes||[]).join(", ")],
            ["Work Setup",       s2.workSetup],
            ["Budget Range",     s2.budget],
            ["Hiring Frequency", s2.frequency],
            ["Urgency Level",    s2.urgency],
            ["Experience Level", s2.expLevel],
          ].filter((row) => row[1]).map(([label, value], i, arr) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"11px 0", borderBottom: i<arr.length-1 ? `1px solid ${T.border}` : "none" }}>
              <span style={{ fontSize:13, color:T.muted, fontWeight:600, flexShrink:0 }}>{label}</span>
              <span style={{ fontSize:13, color:T.navy, fontWeight:700, textAlign:"right", maxWidth:"58%" }}>{value}</span>
            </div>
          ))}
        </Card>

        {/* Roles, skills, accommodations */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <Card>
            <SectionHead>🎯 Roles Hiring For</SectionHead>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {(s2.roles||[]).length > 0 ? (s2.roles).map(r => <Badge key={r} color={T.teal}>{r}</Badge>) : <span style={{ fontSize:13, color:T.muted }}>Not specified</span>}
            </div>
          </Card>
          <Card>
            <SectionHead>🛠 Required Skills</SectionHead>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {(s2.skills||[]).length > 0 ? (s2.skills).map(s => <Badge key={s} color={T.accent}>{s}</Badge>) : <span style={{ fontSize:13, color:T.muted }}>Not specified</span>}
            </div>
          </Card>
          <Card>
            <SectionHead>♿ Accommodations Provided</SectionHead>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {(s3.accommodations||[]).length > 0 ? (s3.accommodations).map(a => <Badge key={a} color={T.success}>{a}</Badge>) : <span style={{ fontSize:13, color:T.muted }}>None listed</span>}
            </div>
          </Card>
        </div>
      </div>

      {/* Mission */}
      {s4.mission && (
        <Card style={{ borderLeft:`4px solid ${T.teal}` }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.teal, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Company Mission Statement</div>
          <p style={{ fontSize:15, color:T.bodyText, lineHeight:1.8, margin:0, fontStyle:"italic" }}>"{s4.mission}"</p>
        </Card>
      )}

      {/* Hiring priority ranking */}
      {(s3.rankItems||[]).length > 0 && (
        <Card>
          <SectionHead>📊 Hiring Priority Ranking</SectionHead>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {(s3.rankItems).map((item, i) => (
              <div key={item} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", borderRadius:11, border:`1.5px solid ${T.border}`, background:T.bg }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background: i===0 ? "#F59E0B" : i===1 ? T.muted : T.border, color: i<2 ? "#fff" : T.bodyText, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, flexShrink:0 }}>{i+1}</div>
                <span style={{ fontSize:13, fontWeight:700, color:T.bodyText }}>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

/* ─── ANALYTICS TAB ──────────────────────────────────────────────────────── */
const AnalyticsTab = ({ profile }) => {
  const s1 = profile?.s1 || {};
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {[
          { icon:"👁️", label:"Profile Views",       value:"128", sub:"↑ 23% this week",   color:T.teal   },
          { icon:"📨", label:"Total Applications",  value:"40",  sub:"↑ 8 this week",     color:T.accent },
          { icon:"✅", label:"Acceptance Rate",     value:"42%", sub:"Industry avg: 35%", color:T.success},
        ].map(stat => (
          <Card key={stat.label} style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
            <div style={{ width:46, height:46, borderRadius:12, background:`${stat.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize:28, fontWeight:900, color:T.navy, lineHeight:1 }}>{stat.value}</div>
              <div style={{ fontSize:13, fontWeight:700, color:T.bodyText, marginTop:4 }}>{stat.label}</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{stat.sub}</div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <Card>
          <SectionHead>📊 Application Funnel</SectionHead>
          {[
            { label:"Profile Views",    value:128, pct:100 },
            { label:"Applications",     value:40,  pct:31  },
            { label:"Reviewed",         value:22,  pct:17  },
            { label:"Shortlisted",      value:10,  pct:8   },
            { label:"Hired",            value:3,   pct:2   },
          ].map(row => (
            <div key={row.label} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:13, color:T.bodyText, fontWeight:600 }}>{row.label}</span>
                <span style={{ fontSize:13, fontWeight:800, color:T.navy }}>{row.value}</span>
              </div>
              <ProgressBar value={row.pct} />
            </div>
          ))}
        </Card>

        <Card>
          <SectionHead>♿ Diversity Metrics</SectionHead>
          {[
            { label:"Visual Impairment",    pct:33, color:T.teal    },
            { label:"Hearing Impairment",   pct:25, color:T.tealMid },
            { label:"Mobility Disability",  pct:22, color:T.accent  },
            { label:"Other Disabilities",   pct:20, color:T.muted   },
          ].map(row => (
            <div key={row.label} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:13, color:T.bodyText, fontWeight:600 }}>{row.label}</span>
                <span style={{ fontSize:13, fontWeight:800, color:T.navy }}>{row.pct}%</span>
              </div>
              <ProgressBar value={row.pct} color={row.color} />
            </div>
          ))}
        </Card>
      </div>

      {/* Industry-specific insight */}
      {s1.industry && (
        <Card style={{ background:`linear-gradient(130deg,${T.navy},${T.teal})`, border:"none" }}>
          <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>✨ AI Industry Insight — {s1.industry}</div>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.85)", lineHeight:1.7, margin:0 }}>
            In the <strong style={{ color:"#fff" }}>{s1.industry}</strong> sector, inclusive employers report <strong style={{ color:"#fff" }}>34% higher retention rates</strong> among PWD hires compared to the industry average. Your current accommodation offering is above average — consider adding <strong style={{ color:"#fff" }}>Assistive Technology</strong> support to increase match quality by an estimated 18%.
          </p>
        </Card>
      )}
    </div>
  );
};

/* ─── MESSAGES TAB ───────────────────────────────────────────────────────── */
const MessagesTab = () => {
  const [selected, setSelected] = useState(0);
  const [msg, setMsg] = useState("");
  const convos = ALL_CANDIDATES.map((c, i) => ({
    ...c,
    lastMsg: ["Hi! I'm very interested in the role.", "Thank you for reviewing my application.", "Looking forward to hearing from you.", "I have relevant experience in accessibility tools.", "When can we schedule an interview?", "I attached my portfolio for your review.", "Happy to provide more references.","Available for a call anytime this week."][i] || "Hello!",
    time: `${i+1}h ago`,
    unread: i < 3,
  }));

  return (
    <div style={{ display:"flex", gap:0, background:T.white, borderRadius:16, border:`1px solid ${T.border}`, overflow:"hidden", height:620 }}>
      {/* Convo list */}
      <div style={{ width:290, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"16px 18px", borderBottom:`1px solid ${T.border}`, fontSize:15, fontWeight:800, color:T.navy }}>Messages</div>
        <div style={{ flex:1, overflowY:"auto" }}>
          {convos.map((c, i) => (
            <div key={c.id} onClick={() => setSelected(i)}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", cursor:"pointer", background:selected===i ? T.tealLight : "transparent", borderBottom:`1px solid ${T.border}`, transition:"background 0.12s" }}>
              <Avatar initials={c.initials} size={40} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:13, fontWeight:700, color:T.navy }}>{c.name}</span>
                  <span style={{ fontSize:11, color:T.muted }}>{c.time}</span>
                </div>
                <div style={{ fontSize:12, color:T.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:2 }}>{c.lastMsg}</div>
              </div>
              {c.unread && <div style={{ width:9, height:9, borderRadius:"50%", background:T.teal, flexShrink:0 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Chat pane */}
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"14px 20px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12 }}>
          <Avatar initials={convos[selected]?.initials} size={36} />
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:T.navy }}>{convos[selected]?.name}</div>
            <div style={{ fontSize:12, color:T.success }}>● Online now</div>
          </div>
          <Badge color={T.success} style={{ marginLeft:"auto" }}>♿ {convos[selected]?.disability}</Badge>
        </div>
        <div style={{ flex:1, padding:"20px", display:"flex", flexDirection:"column", justifyContent:"flex-end", gap:12, overflowY:"auto" }}>
          <div style={{ alignSelf:"flex-start", maxWidth:"68%", padding:"12px 16px", borderRadius:"14px 14px 14px 4px", background:T.bg, border:`1px solid ${T.border}`, fontSize:14, color:T.bodyText, lineHeight:1.6 }}>{convos[selected]?.lastMsg}</div>
          <div style={{ alignSelf:"flex-end", maxWidth:"68%", padding:"12px 16px", borderRadius:"14px 14px 4px 14px", background:T.teal, fontSize:14, color:"#fff", lineHeight:1.6 }}>Thanks for reaching out! We'll review your application and get back to you shortly.</div>
        </div>
        <div style={{ padding:"12px 16px", borderTop:`1px solid ${T.border}`, display:"flex", gap:8 }}>
          <input placeholder="Type a message..." value={msg} onChange={e=>setMsg(e.target.value)}
            onKeyDown={e => { if(e.key==="Enter" && msg.trim()) setMsg(""); }}
            style={{ flex:1, padding:"10px 14px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Arial, sans-serif", outline:"none" }}
            onFocus={e=>e.target.style.borderColor=T.teal} onBlur={e=>e.target.style.borderColor=T.border} />
          <button onClick={() => setMsg("")}
            style={{ padding:"10px 18px", borderRadius:10, border:"none", background:T.teal, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Arial, sans-serif" }}>Send</button>
        </div>
      </div>
    </div>
  );
};

/* ─── SETTINGS TAB ───────────────────────────────────────────────────────── */
const SettingsTab = ({ profile, onReset }) => {
  const s3 = profile?.s3 || {};
  const s4 = profile?.s4 || {};
  const [notifs, setNotifs] = useState({
    matches: s3.notifications !== false,
    ai: s3.aiSuggest !== false,
    apps: true,
  });

  const Toggle = ({ checked, onChange }) => (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      style={{ width:62, height:34, borderRadius:999, border:"none", cursor:"pointer", background:checked ? T.teal : "#C4CDD6", position:"relative", transition:"background 0.25s ease", flexShrink:0, padding:0, outline:"none" }}>
      <span style={{ position:"absolute", top:3, left:checked ? 31 : 3, width:28, height:28, borderRadius:"50%", background:"#fff", boxShadow:"0 2px 6px rgba(0,0,0,0.22)", transition:"left 0.22s cubic-bezier(0.4,0,0.2,1)", display:"block" }} />
    </button>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20, maxWidth:680 }}>
      <Card>
        <SectionHead>⚙️ Account Settings</SectionHead>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {["Email Address","Phone Number","New Password"].map(f => (
            <div key={f}>
              <label style={{ fontSize:13, fontWeight:700, color:T.bodyText, display:"block", marginBottom:6 }}>{f}</label>
              <input type={f.includes("Password") ? "password" : "text"} placeholder={f.includes("Password") ? "••••••••" : `Enter ${f.toLowerCase()}...`}
                style={{ width:"100%", boxSizing:"border-box", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"Arial, sans-serif", outline:"none" }}
                onFocus={e=>e.target.style.borderColor=T.teal} onBlur={e=>e.target.style.borderColor=T.border} />
            </div>
          ))}
          <button style={{ alignSelf:"flex-start", padding:"11px 24px", borderRadius:10, border:"none", background:T.teal, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Arial, sans-serif" }}>Save Changes</button>
        </div>
      </Card>

      <Card>
        <SectionHead>🔔 Notification Preferences</SectionHead>
        {[
          { key:"matches", label:"New candidate matches",   sub:"Get notified when a new match is found" },
          { key:"ai",      label:"AI recommendations",      sub:"Daily AI-powered candidate suggestions" },
          { key:"apps",    label:"Application updates",     sub:"When candidates update their application status" },
        ].map(item => (
          <div key={item.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:`1px solid ${T.border}` }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:T.navy }}>{item.label}</div>
              <div style={{ fontSize:12, color:T.muted, marginTop:3 }}>{item.sub}</div>
            </div>
            <Toggle checked={notifs[item.key]} onChange={v => setNotifs({...notifs, [item.key]: v})} />
          </div>
        ))}
      </Card>

      <Card>
        <SectionHead>📋 Onboarding Data</SectionHead>
        <p style={{ fontSize:14, color:T.muted, margin:"0 0 16px", lineHeight:1.6 }}>
          Your dashboard reflects your onboarding answers. Reset to update your company profile, industry, preferences, and accommodations.
        </p>
        <div style={{ padding:"14px 16px", background:T.warningBg, borderRadius:11, border:`1px solid ${T.warning}33`, marginBottom:16 }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.warning, marginBottom:4 }}>⚠️ Warning</div>
          <div style={{ fontSize:13, color:T.bodyText }}>Resetting will clear all your onboarding data from local storage. Your dashboard will reload from scratch.</div>
        </div>
        <button onClick={onReset}
          style={{ padding:"11px 22px", borderRadius:10, border:`1.5px solid ${T.danger}`, background:"#FEF2F2", color:T.danger, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Arial, sans-serif" }}>
          🔄 Reset & Redo Onboarding
        </button>
      </Card>
    </div>
  );
};

/* ─── MAIN ───────────────────────────────────────────────────────────────── */
export default function EmployerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("inklusijobs_employer");
      if (!raw) { router.replace("/employer/onboarding"); return; }
      setProfile(JSON.parse(raw));
    } catch {
      router.replace("/employer/onboarding");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = () => {
    localStorage.removeItem("inklusijobs_employer");
    router.replace("/employer/onboarding");
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:T.bg, fontFamily:"Arial, sans-serif", color:T.navy, fontSize:16 }}>
      Loading your dashboard…
    </div>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:T.bg, fontFamily:"Arial, sans-serif" }}>
      <Sidebar active={activeTab} onTab={setActiveTab} profile={profile} open={sidebarOpen} onToggle={() => setSidebarOpen(s => !s)} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <Topbar profile={profile} activeTab={activeTab} onReset={handleReset} />
        <main style={{ flex:1, overflowY:"auto", padding:"28px 32px" }}>
          {activeTab === "overview"   && <OverviewTab   profile={profile} onTab={setActiveTab} />}
          {activeTab === "candidates" && <CandidatesTab profile={profile} />}
          {activeTab === "jobs"       && <JobsTab       profile={profile} />}
          {activeTab === "profile"    && <ProfileTab    profile={profile} />}
          {activeTab === "analytics"  && <AnalyticsTab  profile={profile} />}
          {activeTab === "messages"   && <MessagesTab />}
          {activeTab === "settings"   && <SettingsTab   profile={profile} onReset={handleReset} />}
        </main>
      </div>
    </div>
  );
}