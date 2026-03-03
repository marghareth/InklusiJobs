"use client";

import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

/* ─── THEME ──────────────────────────────────────────────────────────────── */
const T = {
  teal:       "#0A66C2",   // LinkedIn blue
  tealMid:    "#0073b1",
  tealLight:  "#EEF3F8",
  navy:       "#0a0a0a",
  navyLight:  "#1a1a1a",
  bodyText:   "#1E3A45",
  muted:      "#666666",
  border:     "#E0E0E0",
  bg:         "#F3F2EF",   // LinkedIn background
  white:      "#FFFFFF",
  success:    "#057642",
  successBg:  "#ECFDF5",
  warning:    "#B24020",
  warningBg:  "#FFF3EC",
  danger:     "#CC1016",
  accent:     "#0A66C2",
};

/* ─── MOCK DATA ──────────────────────────────────────────────────────────── */
const ALL_CANDIDATES = [
  { id:1,  name:"Maria Santos",    initials:"MS", role:"Software Developer",    match:97, skills:["JavaScript","React","Accessibility"], disability:"Visual Impairment",    exp:"3 yrs",  status:"New",         budget:"₱80k–₱150k" },
  { id:2,  name:"Juan dela Cruz",  initials:"JD", role:"Data Analyst",          match:93, skills:["Python","SQL","Excel"],              disability:"Hearing Impairment",   exp:"2 yrs",  status:"Reviewed",    budget:"₱40k–₱80k"  },
  { id:3,  name:"Ana Reyes",       initials:"AR", role:"Content Writer",        match:89, skills:["Content Writing","SEO","Canva"],     disability:"Mobility Disability",  exp:"4 yrs",  status:"New",         budget:"₱20k–₱40k"  },
  { id:4,  name:"Pedro Lim",       initials:"PL", role:"Customer Support",      match:85, skills:["Customer Service","Communication"],  disability:"Speech Impairment",    exp:"1 yr",   status:"Shortlisted", budget:"₱20k–₱40k"  },
  { id:5,  name:"Rosa Gomez",      initials:"RG", role:"HR Manager",            match:83, skills:["HR Management","Project Management"],disability:"Chronic Illness",      exp:"5 yrs",  status:"New",         budget:"₱80k–₱150k" },
  { id:6,  name:"Carlo Mendoza",   initials:"CM", role:"Designer",              match:80, skills:["Figma","Canva","Social Media"],      disability:"Autism Spectrum",      exp:"2 yrs",  status:"Reviewed",    budget:"₱40k–₱80k"  },
  { id:7,  name:"Liza Castillo",   initials:"LC", role:"DevOps Engineer",       match:76, skills:["AWS","Node.js","TypeScript"],        disability:"ADHD",                 exp:"3 yrs",  status:"New",         budget:"₱80k–₱150k" },
  { id:8,  name:"Ben Torres",      initials:"BT", role:"Product Manager",       match:74, skills:["Project Management","Communication"],disability:"Physical Disability",   exp:"6 yrs",  status:"Shortlisted", budget:"₱150k+"     },
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
  <div onClick={onClick} style={{ background:T.white, borderRadius:8, border:`1px solid ${T.border}`, padding:"16px", boxShadow:"0 0 0 1px rgba(0,0,0,.04)", ...style }}>
    {children}
  </div>
);

const Badge = ({ children, color=T.teal, style={} }) => (
  <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 10px", borderRadius:99, background:`${color}18`, color, fontSize:12, fontWeight:700, border:`1px solid ${color}30`, ...style }}>
    {children}
  </span>
);

const Avatar = ({ initials, size=44, color=T.teal, src }) => (
  src
    ? <img src={src} alt="" style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
    : <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg, ${color}, #1d9ed9)`, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.34, fontWeight:800, flexShrink:0, letterSpacing:"-0.5px" }}>
        {initials}
      </div>
);

const SectionHead = ({ children, action }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
    <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:T.navy }}>{children}</h3>
    {action && <button onClick={action.fn} style={{ fontSize:13, color:T.teal, fontWeight:700, background:"none", border:"none", cursor:"pointer", padding:0 }}>{action.label}</button>}
  </div>
);

const ProgressBar = ({ value, max=100, color=T.teal, height=6 }) => (
  <div style={{ height, borderRadius:99, background:"#E8E8E8", overflow:"hidden" }}>
    <div style={{ height:"100%", width:`${(value/max)*100}%`, background:color, borderRadius:99, transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
  </div>
);

/* ─── TOP NAV (Facebook/LinkedIn style) ──────────────────────────────────── */
const TABS = [
  { id:"overview",    label:"Home"       },
  { id:"candidates",  label:"Candidates" },
  { id:"jobs",        label:"Jobs"       },
  { id:"profile",     label:"Profile"    },
  { id:"analytics",   label:"Analytics"  },
  { id:"messages",    label:"Messages"   },
  { id:"settings",    label:"Settings"   },
];

const TopNav = ({ active, onTab, profile, onReset }) => {
  const s1 = profile?.s1 || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header style={{
      position:"sticky", top:0, zIndex:100,
      background:T.white,
      borderBottom:`1px solid ${T.border}`,
      boxShadow:"0 0 0 1px rgba(0,0,0,.08)",
    }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", height:56, gap:0 }}>

        {/* Logo */}
        <div style={{ marginRight:20, flexShrink:0 }}>
          <div style={{ background:T.teal, borderRadius:8, padding:"5px 10px", display:"flex", alignItems:"center" }}>
            <span style={{ color:"#fff", fontSize:13, fontWeight:900, letterSpacing:"0.04em" }}>InklusiJobs</span>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ position:"relative", flex:"0 0 260px", marginRight:16 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:T.muted }}>&#x1F50D;</span>
          <input placeholder="Search candidates, jobs..." style={{
            width:"100%", boxSizing:"border-box",
            padding:"8px 14px 8px 34px",
            borderRadius:22,
            border:`1px solid ${T.border}`,
            background:"#EEF3F8",
            fontSize:13,
            fontFamily:"inherit",
            outline:"none",
            color:T.navy
          }} />
        </div>

        {/* Nav tabs */}
        <nav style={{ display:"flex", flex:1, justifyContent:"center", alignItems:"stretch", height:"100%" }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => onTab(tab.id)}
              style={{
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                gap:2, padding:"0 20px", border:"none", background:"none",
                borderBottom:`2px solid ${active===tab.id ? T.teal : "transparent"}`,
                color: active===tab.id ? T.teal : T.muted,
                fontSize:11, fontWeight: active===tab.id ? 700 : 500,
                cursor:"pointer", fontFamily:"inherit", minWidth:64,
                transition:"all 0.15s"
              }}>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:8 }}>
          <button style={{ width:38, height:38, borderRadius:"50%", border:`1px solid ${T.border}`, background:T.bg, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, position:"relative" }}>
            Alerts
            <span style={{ position:"absolute", top:6, right:6, width:7, height:7, borderRadius:"50%", background:"#E25C14", border:"2px solid #fff" }} />
          </button>

          <div ref={menuRef} style={{ position:"relative" }}>
            <button onClick={() => setMenuOpen(m => !m)}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:1, background:"none", border:"none", cursor:"pointer", padding:"0 8px" }}>
              {s1.logoPreview
                ? <img src={s1.logoPreview} alt="" style={{ width:30, height:30, borderRadius:"50%", objectFit:"cover", border:`2px solid ${T.border}` }} />
                : <div style={{ width:30, height:30, borderRadius:"50%", background:T.teal, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:900 }}>{(s1.company||"E")[0]}</div>
              }
              <span style={{ fontSize:10, color:T.muted }}>Me ▾</span>
            </button>
            {menuOpen && (
              <div style={{ position:"absolute", right:0, top:"110%", background:T.white, border:`1px solid ${T.border}`, borderRadius:8, boxShadow:"0 8px 24px rgba(0,0,0,0.14)", zIndex:200, minWidth:220, overflow:"hidden" }}>
                <div style={{ padding:"16px", borderBottom:`1px solid ${T.border}`, display:"flex", gap:12, alignItems:"center" }}>
                  {s1.logoPreview
                    ? <img src={s1.logoPreview} alt="" style={{ width:44, height:44, borderRadius:"50%", objectFit:"cover" }} />
                    : <div style={{ width:44, height:44, borderRadius:"50%", background:T.teal, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:18, fontWeight:900 }}>{(s1.company||"E")[0]}</div>
                  }
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:T.navy }}>{s1.company||"Your Company"}</div>
                    <div style={{ fontSize:12, color:T.muted }}>{s1.industry||""}</div>
                  </div>
                </div>
                <div style={{ padding:"8px 0" }}>
                  <button onClick={() => { onTab("profile"); setMenuOpen(false); }}
                    style={{ display:"block", width:"100%", textAlign:"left", padding:"10px 16px", border:"none", background:"none", fontSize:13, color:T.bodyText, cursor:"pointer", fontFamily:"inherit" }}>View Company Profile</button>
                  <button onClick={onReset}
                    style={{ display:"block", width:"100%", textAlign:"left", padding:"10px 16px", border:"none", background:"none", fontSize:13, color:T.danger, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Redo Onboarding</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

/* ─── PROFILE HERO (LinkedIn-style cover + big logo) ─────────────────────── */
const ProfileHero = ({ profile, onTab }) => {
  const s1 = profile?.s1 || {};
  const s2 = profile?.s2 || {};
  const s3 = profile?.s3 || {};

  return (
    <Card style={{ padding:0, overflow:"hidden", marginBottom:0 }}>
      {/* Cover photo */}
      <div style={{
        height:160,
        background:`linear-gradient(135deg, #0a2240 0%, #0A66C2 50%, #1d9ed9 100%)`,
        position:"relative",
        overflow:"hidden"
      }}>
        {/* Subtle pattern overlay */}
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:"radial-gradient(circle at 20% 50%, rgba(255,255,255,0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.07) 0%, transparent 40%)"
        }}/>
        <div style={{ position:"absolute", right:24, bottom:24, display:"flex", gap:8 }}>
          <span style={{ background:"rgba(255,255,255,0.18)", backdropFilter:"blur(4px)", padding:"5px 12px", borderRadius:99, fontSize:11, fontWeight:700, color:"#fff", border:"1px solid rgba(255,255,255,0.25)" }}>Inclusive Employer</span>
          {s3.aiSuggest !== false && <span style={{ background:"rgba(255,255,255,0.18)", backdropFilter:"blur(4px)", padding:"5px 12px", borderRadius:99, fontSize:11, fontWeight:700, color:"#fff", border:"1px solid rgba(255,255,255,0.25)" }}>AI Matching On</span>}
        </div>
      </div>

      {/* Profile section below cover */}
      <div style={{ padding:"0 24px 20px", position:"relative" }}>
        {/* Logo - overlapping cover (LinkedIn style) */}
        <div style={{ marginTop:-48, marginBottom:12, display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
          <div style={{
            width:96, height:96,
            borderRadius:8,
            border:"3px solid #fff",
            background:T.white,
            display:"flex", alignItems:"center", justifyContent:"center",
            overflow:"hidden",
            boxShadow:"0 2px 12px rgba(0,0,0,0.15)",
            flexShrink:0
          }}>
            {s1.logoPreview
              ? <img src={s1.logoPreview} alt="" style={{ width:"100%", height:"100%", objectFit:"contain", padding:6 }} />
              : <div style={{ width:"100%", height:"100%", background:T.teal, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, color:"#fff", fontWeight:900 }}>Co</div>
            }
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center", paddingBottom:4 }}>
            <button onClick={() => onTab("jobs")}
              style={{ padding:"7px 18px", borderRadius:20, border:`1.5px solid ${T.teal}`, background:T.white, color:T.teal, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
              + Post a Job
            </button>
            <button onClick={() => onTab("profile")}
              style={{ padding:"7px 18px", borderRadius:20, border:`1.5px solid #666`, background:T.white, color:"#333", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Company name — BIG, LinkedIn-style */}
        <h1 style={{ fontSize:28, fontWeight:800, color:T.navy, margin:"0 0 4px", letterSpacing:"-0.5px", fontFamily:"inherit" }}>
          {s1.company || "Your Company"}
        </h1>
        <p style={{ fontSize:15, color:T.bodyText, margin:"0 0 8px", lineHeight:1.5 }}>
          Inclusive employer · {s1.industry || "Industry"} · {s1.size || "—"} employees
        </p>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
          <span style={{ fontSize:13, color:T.teal, fontWeight:600 }}>Philippines</span>
          <span style={{ color:T.border }}>·</span>
          <span style={{ fontSize:13, color:T.muted }}>{s2.workSetup || "Remote"}</span>
          <span style={{ color:T.border }}>·</span>
          <span style={{ fontSize:13, color:T.muted }}>{s2.budget || "Competitive salary"}</span>
        </div>

        {/* Stats row (LinkedIn style) */}
        <div style={{ display:"flex", gap:0, marginTop:14, borderTop:`1px solid ${T.border}`, paddingTop:14 }}>
          {[
            { label:"Candidate matches", value:ALL_CANDIDATES.length, color:T.teal },
            { label:"Active jobs", value:MOCK_JOBS.filter(j=>j.status==="Active").length, color:T.teal },
            { label:"Applications", value:40, color:T.teal },
            { label:"Profile views this week", value:128, color:T.teal },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              flex:1, textAlign:"center",
              borderRight: i < 3 ? `1px solid ${T.border}` : "none",
              padding:"4px 8px"
            }}>
              <div style={{ fontSize:22, fontWeight:800, color:T.navy }}>{stat.value}</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:1 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

/* ─── LEFT SIDEBAR WIDGET ────────────────────────────────────────────────── */
const LeftPanel = ({ profile }) => {
  const s2 = profile?.s2 || {};
  const s3 = profile?.s3 || {};
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Card>
        <SectionHead>Hiring Preferences</SectionHead>
        {[
          { label:"Work Setup",  value: s2.workSetup || "—" },
          { label:"Budget",      value: s2.budget    || "—" },
          { label:"Experience",  value: s2.expLevel  || "—" },
          { label:"Urgency",     value: s2.urgency   || "—" },
        ].map(row => (
          <div key={row.label} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid #f0f0f0` }}>
            <span style={{ fontSize:12, color:T.muted }}>{row.label}</span>
            <span style={{ fontSize:12, fontWeight:700, color:T.navy }}>{row.value}</span>
          </div>
        ))}
      </Card>

      <Card>
        <SectionHead>Accommodations</SectionHead>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {(s3.accommodations||[]).length > 0
            ? (s3.accommodations).map(a => <Badge key={a} color={T.success}>{a}</Badge>)
            : <span style={{ fontSize:12, color:T.muted }}>None listed yet</span>}
        </div>
      </Card>

      <Card>
        <SectionHead>Skills Wanted</SectionHead>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {(s2.skills||[]).length > 0
            ? (s2.skills).map(s => <Badge key={s} color={T.teal}>{s}</Badge>)
            : <span style={{ fontSize:12, color:T.muted }}>No skills specified</span>}
        </div>
      </Card>
    </div>
  );
};

/* ─── FEED / MAIN CONTENT ────────────────────────────────────────────────── */
const FeedPanel = ({ profile, onTab }) => {
  const topCandidates = ALL_CANDIDATES.slice(0, 4);
  const activeJobs    = MOCK_JOBS.filter(j => j.status === "Active").slice(0, 3);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

      {/* Quick actions — Facebook-style post box */}
      <Card>
        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12 }}>
          <div style={{ width:38, height:38, borderRadius:"50%", background:T.teal, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16, fontWeight:900, flexShrink:0 }}>Co</div>
          <button onClick={() => onTab("jobs")}
            style={{ flex:1, padding:"10px 14px", borderRadius:22, border:`1px solid ${T.border}`, background:T.bg, color:T.muted, fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
            Post a new job opening...
          </button>
        </div>
        <div style={{ display:"flex", gap:0, borderTop:`1px solid ${T.border}`, paddingTop:10 }}>
          {[
            { label:"Post Job",     fn:() => onTab("jobs") },
            { label:"Find Talent",  fn:() => onTab("candidates") },
            { label:"Analytics",    fn:() => onTab("analytics") },
            { label:"Messages",     fn:() => onTab("messages") },
          ].map(a => (
            <button key={a.label} onClick={a.fn}
              style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"8px", border:"none", background:"none", color:T.muted, fontSize:13, fontWeight:600, cursor:"pointer", borderRadius:6, fontFamily:"inherit", transition:"background 0.1s" }}
              onMouseEnter={e=>e.currentTarget.style.background=T.bg}
              onMouseLeave={e=>e.currentTarget.style.background="none"}>
              {a.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Top matches */}
      <Card>
        <SectionHead action={{ label:"See all →", fn:() => onTab("candidates") }}>Top Candidate Matches</SectionHead>
        <div style={{ display:"flex", flexDirection:"column" }}>
          {topCandidates.map((c, i) => (
            <div key={c.id} style={{
              display:"flex", alignItems:"center", gap:12,
              padding:"12px 0",
              borderBottom: i < topCandidates.length - 1 ? `1px solid #f0f0f0` : "none"
            }}>
              <Avatar initials={c.initials} size={48} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.navy }}>{c.name}</div>
                <div style={{ fontSize:12, color:T.muted }}>{c.role} · {c.exp}</div>
                <div style={{ display:"flex", gap:4, marginTop:4, flexWrap:"wrap" }}>
                  {c.skills.slice(0,2).map(sk => <Badge key={sk} color={T.teal} style={{ fontSize:11, padding:"2px 7px" }}>{sk}</Badge>)}
                  <Badge color={T.success} style={{ fontSize:11, padding:"2px 7px" }}>{c.disability}</Badge>
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:20, fontWeight:800, color:T.teal }}>{c.match}%</div>
                <div style={{ fontSize:10, color:T.muted, marginBottom:6 }}>match</div>
                <button style={{ padding:"5px 14px", borderRadius:20, border:`1.5px solid ${T.teal}`, background:"none", color:T.teal, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>View</button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Active jobs */}
      <Card>
        <SectionHead action={{ label:"Manage all →", fn:() => onTab("jobs") }}>Active Job Listings</SectionHead>
        <div style={{ display:"flex", flexDirection:"column" }}>
          {activeJobs.map((j, i) => (
            <div key={j.id} style={{
              display:"flex", alignItems:"center", gap:14,
              padding:"12px 0",
              borderBottom: i < activeJobs.length - 1 ? `1px solid #f0f0f0` : "none"
            }}>
              <div style={{ width:44, height:44, borderRadius:8, background:T.tealLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>Job</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.navy, display:"flex", alignItems:"center", gap:6 }}>
                  {j.title}
                  {j.urgent && <Badge color={T.danger} style={{ fontSize:10 }}>Urgent</Badge>}
                </div>
                <div style={{ fontSize:12, color:T.muted }}>{j.type} · Posted {j.posted}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:18, fontWeight:800, color:T.navy }}>{j.applicants}</div>
                <div style={{ fontSize:10, color:T.muted }}>applicants</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

/* ─── RIGHT SIDEBAR ──────────────────────────────────────────────────────── */
const RightPanel = ({ profile }) => {
  const s1 = profile?.s1 || {};
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {/* AI Insight */}
      <Card style={{ background:`linear-gradient(135deg, #0a2240, #0A66C2)`, border:"none" }}>
        <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.55)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>AI Insight</div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.65, margin:0 }}>
          Your profile is attracting <strong style={{color:"#fff"}}>34% more</strong> qualified PWD applicants this week. Consider adding <strong style={{color:"#fff"}}>assistive technology</strong> to your accommodations.
        </p>
      </Card>

      {/* Quick stats */}
      <Card>
        <div style={{ fontSize:13, fontWeight:700, color:T.navy, marginBottom:12 }}>This Week</div>
        {[
          { label:"Profile views",   value:"+23" },
          { label:"New applicants",   value:"+8"  },
          { label:"Shortlisted",      value:"3"   },
          { label:"Messages sent",    value:"12"  },
        ].map(s => (
          <div key={s.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`1px solid #f0f0f0` }}>
            <span style={{ fontSize:13, color:T.bodyText }}>{s.label}</span>
            <span style={{ fontSize:14, fontWeight:800, color:T.teal }}>{s.value}</span>
          </div>
        ))}
      </Card>

      {/* Upcoming */}
      <Card>
        <div style={{ fontSize:13, fontWeight:700, color:T.navy, marginBottom:12 }}>Upcoming Interviews</div>
        {[
          { name:"Maria Santos",  date:"Mar 5, 10:00 AM" },
          { name:"Ben Torres",    date:"Mar 6, 2:00 PM"  },
          { name:"Pedro Lim",     date:"Mar 7, 9:30 AM"  },
        ].map((iv, i) => (
          <div key={i} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom:`1px solid #f0f0f0`, alignItems:"center" }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:T.tealLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0, color:T.teal, fontWeight:700 }}>IV</div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.navy }}>{iv.name}</div>
              <div style={{ fontSize:11, color:T.muted }}>{iv.date}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ─── OVERVIEW TAB ───────────────────────────────────────────────────────── */
const OverviewTab = ({ profile, onTab }) => (
  <div style={{ maxWidth:1200, margin:"0 auto", padding:"20px 16px" }}>
    <ProfileHero profile={profile} onTab={onTab} />
    <div style={{ display:"grid", gridTemplateColumns:"280px 1fr 280px", gap:16, marginTop:16 }}>
      <LeftPanel profile={profile} />
      <FeedPanel profile={profile} onTab={onTab} />
      <RightPanel profile={profile} />
    </div>
  </div>
);

/* ─── CANDIDATES TAB ─────────────────────────────────────────────────────── */
const CandidatesTab = ({ profile }) => {
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
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"20px 16px", display:"flex", gap:16 }}>
      <div style={{ flex:1 }}>
        <Card style={{ marginBottom:12, padding:"12px 16px" }}>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
            <div style={{ position:"relative", flex:1, minWidth:200 }}>
              <input placeholder="Search by name or role..." value={search} onChange={e=>setSearch(e.target.value)}
                style={{ width:"100%", boxSizing:"border-box", padding:"9px 14px", borderRadius:22, border:`1px solid ${T.border}`, fontSize:13, fontFamily:"inherit", outline:"none", background:T.bg }} />
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {statuses.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  style={{ padding:"7px 16px", borderRadius:20, border:`1.5px solid ${statusFilter===s ? T.teal : T.border}`, background:statusFilter===s ? "#EEF3F8" : T.white, color:statusFilter===s ? T.teal : T.bodyText, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                  {s}
                </button>
              ))}
            </div>
            <span style={{ fontSize:12, color:T.muted }}>{filtered.length} results</span>
          </div>
        </Card>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {filtered.map(c => (
            <Card key={c.id} onClick={() => setSelected(c.id===selected?null:c.id)}
              style={{ cursor:"pointer", border:`1.5px solid ${selected===c.id?T.teal:T.border}`, transition:"all 0.15s" }}>
              <div style={{ display:"flex", gap:12 }}>
                <Avatar initials={c.initials} size={52} />
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, color:T.navy }}>{c.name}</div>
                      <div style={{ fontSize:12, color:T.muted }}>{c.role} · {c.exp}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:20, fontWeight:800, color:T.teal }}>{c.match}%</div>
                      <div style={{ fontSize:10, color:T.muted }}>match</div>
                    </div>
                  </div>
                  <ProgressBar value={c.match} color={c.match>=90?T.success:c.match>=80?T.teal:"#B46E04"} height={5} />
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:8 }}>
                    {c.skills.map(sk => <Badge key={sk} color={T.teal} style={{ fontSize:11, padding:"2px 7px" }}>{sk}</Badge>)}
                  </div>
                  <div style={{ marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <Badge color={T.success} style={{ fontSize:11 }}>{c.disability}</Badge>
                    <Badge color={c.status==="New"?T.teal:c.status==="Shortlisted"?T.success:T.muted} style={{ fontSize:11 }}>{c.status}</Badge>
                  </div>
                  {selected===c.id && (
                    <div style={{ marginTop:10, display:"flex", gap:8 }}>
                      <button style={{ flex:1, padding:"8px", borderRadius:20, border:"none", background:T.teal, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>View Profile</button>
                      <button style={{ flex:1, padding:"8px", borderRadius:20, border:`1.5px solid ${T.border}`, background:T.white, color:T.bodyText, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Message</button>
                      <button style={{ padding:"8px 12px", borderRadius:20, border:`1.5px solid ${T.success}`, background:"#f0faf5", color:T.success, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Save</button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {profile?.s3?.aiSuggest !== false && (
        <div style={{ width:260, flexShrink:0 }}>
          <Card style={{ background:`linear-gradient(135deg,#0a2240,#0A66C2)`, border:"none", marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", marginBottom:8 }}>AI Insight</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.6 }}>
              Based on your preference for <strong style={{color:"#fff"}}>{profile?.s2?.expLevel||"Mid-Level"}</strong> candidates with <strong style={{color:"#fff"}}>{profile?.s2?.workSetup||"Remote"}</strong> work.
            </div>
          </Card>
          <Card>
            <SectionHead>Match Breakdown</SectionHead>
            {[
              { label:"95–100%", count:1, color:T.success },
              { label:"85–94%",  count:3, color:T.teal   },
              { label:"75–84%",  count:3, color:"#B46E04" },
              { label:"<75%",    count:1, color:T.muted  },
            ].map(row => (
              <div key={row.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:9, height:9, borderRadius:"50%", background:row.color, display:"inline-block" }} />
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
  const types = (s1.posTypes||[]).length>0 ? s1.posTypes : ["Full-time","Part-time","Contract","Freelance"];

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"20px 16px", display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:14, color:T.muted }}>
          <strong style={{color:T.navy}}>{MOCK_JOBS.length} job posts</strong> · {MOCK_JOBS.filter(j=>j.status==="Active").length} active
        </div>
        <button onClick={() => setShowForm(s=>!s)}
          style={{ padding:"9px 20px", borderRadius:20, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          {showForm ? "Cancel" : "+ Post New Job"}
        </button>
      </div>

      {showForm && (
        <Card style={{ border:`1.5px solid ${T.teal}` }}>
          <SectionHead>New Job Post</SectionHead>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:T.bodyText, display:"block", marginBottom:5 }}>Job Title *</label>
              <input value={newJob.title} onChange={e=>setNewJob({...newJob,title:e.target.value})} placeholder="e.g. Senior React Developer"
                style={{ width:"100%", boxSizing:"border-box", padding:"10px 13px", borderRadius:6, border:`1px solid ${T.border}`, fontSize:13, fontFamily:"inherit", outline:"none" }} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:T.bodyText, display:"block", marginBottom:5 }}>Type</label>
              <select value={newJob.type} onChange={e=>setNewJob({...newJob,type:e.target.value})}
                style={{ width:"100%", padding:"10px 13px", borderRadius:6, border:`1px solid ${T.border}`, fontSize:13, fontFamily:"inherit", outline:"none", background:T.white }}>
                {types.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:T.bodyText, display:"block", marginBottom:5 }}>Salary Range</label>
              <input value={newJob.salary} onChange={e=>setNewJob({...newJob,salary:e.target.value})} placeholder={s2.budget||"e.g. ₱40k–₱80k"}
                style={{ width:"100%", boxSizing:"border-box", padding:"10px 13px", borderRadius:6, border:`1px solid ${T.border}`, fontSize:13, fontFamily:"inherit", outline:"none" }} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:T.bodyText, display:"block", marginBottom:5 }}>Work Setup</label>
              <input value={s2.workSetup||""} readOnly placeholder="From preferences"
                style={{ width:"100%", boxSizing:"border-box", padding:"10px 13px", borderRadius:6, border:`1px solid ${T.border}`, fontSize:13, fontFamily:"inherit", background:T.bg, color:T.muted }} />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ fontSize:12, fontWeight:700, color:T.bodyText, display:"block", marginBottom:5 }}>Description</label>
              <textarea rows={4} value={newJob.desc} onChange={e=>setNewJob({...newJob,desc:e.target.value})} placeholder="Describe responsibilities, requirements, and accommodations..."
                style={{ width:"100%", boxSizing:"border-box", padding:"10px 13px", borderRadius:6, border:`1px solid ${T.border}`, fontSize:13, fontFamily:"inherit", outline:"none", resize:"vertical" }} />
            </div>
          </div>
          <div style={{ marginTop:14, display:"flex", gap:8 }}>
            <button style={{ padding:"9px 22px", borderRadius:20, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Publish Job</button>
            <button style={{ padding:"9px 22px", borderRadius:20, border:`1px solid ${T.border}`, background:T.white, color:T.muted, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Save Draft</button>
          </div>
        </Card>
      )}

      {MOCK_JOBS.map(j => (
        <Card key={j.id} style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ width:48, height:48, borderRadius:8, background:j.status==="Active"?"#EEF3F8":T.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:T.teal, flexShrink:0 }}>Job</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:700, color:T.navy, display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
              {j.title}
              {j.urgent && <Badge color={T.danger} style={{ fontSize:11 }}>Urgent</Badge>}
            </div>
            <div style={{ fontSize:12, color:T.muted }}>{j.type} · Posted {j.posted} · {s2.workSetup||"Remote"}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <Badge color={j.status==="Active"?T.success:T.muted}>{j.status}</Badge>
            <div style={{ fontSize:20, fontWeight:800, color:T.navy, marginTop:6 }}>{j.applicants}</div>
            <div style={{ fontSize:11, color:T.muted }}>applicants</div>
          </div>
        </Card>
      ))}
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
    <div style={{ maxWidth:860, margin:"0 auto", padding:"20px 16px", display:"flex", flexDirection:"column", gap:12 }}>
      {/* Header card */}
      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ height:120, background:`linear-gradient(135deg, #0a2240, #0A66C2)` }} />
        <div style={{ padding:"0 24px 20px", position:"relative" }}>
          <div style={{ marginTop:-44, marginBottom:12, display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
            <div style={{ width:88, height:88, borderRadius:8, border:"3px solid #fff", background:T.white, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.1)" }}>
              {s1.logoPreview ? <img src={s1.logoPreview} alt="" style={{ width:"100%", height:"100%", objectFit:"contain", padding:4 }} />
                : <div style={{ width:"100%", height:"100%", background:T.teal, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, color:"#fff", fontWeight:900 }}>Co</div>}
            </div>
            <div style={{ display:"flex", gap:8, paddingBottom:4 }}>
              <Badge color={T.success}>Inclusive Employer</Badge>
              {s4.visible!==false && <Badge color={T.teal}>Visible</Badge>}
            </div>
          </div>
          <h2 style={{ fontSize:24, fontWeight:800, color:T.navy, margin:"0 0 4px" }}>{s1.company||"Your Company"}</h2>
          <p style={{ fontSize:14, color:T.muted, margin:"0 0 8px" }}>{s1.industry||"Industry"} · {s1.size||"—"} employees</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {s1.industry    && <Badge color={T.teal}>{s1.industry}</Badge>}
            {(s1.sizeCustom||s1.size) && <Badge color={T.muted}>{s1.sizeCustom||s1.size} employees</Badge>}
          </div>
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card>
          <SectionHead>Company Details</SectionHead>
          {[["Company",s1.company],["Industry",s1.industry],["Size",s1.sizeCustom||s1.size],["Work Setup",s2.workSetup],["Budget",s2.budget],["Exp. Level",s2.expLevel],["Urgency",s2.urgency]].filter(r=>r[1]).map(([l,v],i,a)=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:i<a.length-1?`1px solid #f0f0f0`:"none" }}>
              <span style={{ fontSize:12, color:T.muted }}>{l}</span>
              <span style={{ fontSize:13, fontWeight:700, color:T.navy }}>{v}</span>
            </div>
          ))}
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Card>
            <SectionHead>Roles Hiring</SectionHead>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {(s2.roles||[]).length>0?(s2.roles).map(r=><Badge key={r} color={T.teal}>{r}</Badge>):<span style={{fontSize:12,color:T.muted}}>Not specified</span>}
            </div>
          </Card>
          <Card>
            <SectionHead>Required Skills</SectionHead>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {(s2.skills||[]).length>0?(s2.skills).map(s=><Badge key={s} color={T.teal}>{s}</Badge>):<span style={{fontSize:12,color:T.muted}}>Not specified</span>}
            </div>
          </Card>
          <Card>
            <SectionHead>Accommodations</SectionHead>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {(s3.accommodations||[]).length>0?(s3.accommodations).map(a=><Badge key={a} color={T.success}>{a}</Badge>):<span style={{fontSize:12,color:T.muted}}>None listed</span>}
            </div>
          </Card>
        </div>
      </div>

      {s4.mission && (
        <Card style={{ borderLeft:`4px solid ${T.teal}` }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.teal, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Mission Statement</div>
          <p style={{ fontSize:15, color:T.bodyText, lineHeight:1.8, margin:0, fontStyle:"italic" }}>"{s4.mission}"</p>
        </Card>
      )}
    </div>
  );
};

/* ─── ANALYTICS TAB ──────────────────────────────────────────────────────── */
const AnalyticsTab = ({ profile }) => {
  const s1 = profile?.s1 || {};
  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"20px 16px", display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {[
          { label:"Profile Views",       value:"128", sub:"↑ 23% this week",   color:T.teal   },
          { label:"Total Applications",  value:"40",  sub:"↑ 8 this week",     color:"#8B5CF6" },
          { label:"Acceptance Rate",     value:"42%", sub:"Industry avg: 35%", color:T.success },
        ].map(stat => (
          <Card key={stat.label} style={{ display:"flex", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:8, background:`${stat.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }} />
            <div>
              <div style={{ fontSize:26, fontWeight:800, color:T.navy, lineHeight:1 }}>{stat.value}</div>
              <div style={{ fontSize:13, fontWeight:700, color:T.bodyText, marginTop:3 }}>{stat.label}</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{stat.sub}</div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card>
          <SectionHead>Application Funnel</SectionHead>
          {[
            { label:"Profile Views",value:128,pct:100 },
            { label:"Applications", value:40, pct:31  },
            { label:"Reviewed",     value:22, pct:17  },
            { label:"Shortlisted",  value:10, pct:8   },
            { label:"Hired",        value:3,  pct:2   },
          ].map(row => (
            <div key={row.label} style={{ marginBottom:13 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:13, color:T.bodyText }}>{row.label}</span>
                <span style={{ fontSize:13, fontWeight:800, color:T.navy }}>{row.value}</span>
              </div>
              <ProgressBar value={row.pct} />
            </div>
          ))}
        </Card>
        <Card>
          <SectionHead>Diversity Metrics</SectionHead>
          {[
            { label:"Visual Impairment",   pct:33, color:T.teal    },
            { label:"Hearing Impairment",  pct:25, color:"#8B5CF6" },
            { label:"Mobility Disability", pct:22, color:T.accent  },
            { label:"Other Disabilities",  pct:20, color:T.muted   },
          ].map(row => (
            <div key={row.label} style={{ marginBottom:13 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:13, color:T.bodyText }}>{row.label}</span>
                <span style={{ fontSize:13, fontWeight:800, color:T.navy }}>{row.pct}%</span>
              </div>
              <ProgressBar value={row.pct} color={row.color} />
            </div>
          ))}
        </Card>
      </div>
      {s1.industry && (
        <Card style={{ background:`linear-gradient(135deg,#0a2240,#0A66C2)`, border:"none" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", marginBottom:8 }}>AI Industry Insight — {s1.industry}</div>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.7, margin:0 }}>
            In the <strong style={{color:"#fff"}}>{s1.industry}</strong> sector, inclusive employers report <strong style={{color:"#fff"}}>34% higher retention rates</strong> among PWD hires. Adding <strong style={{color:"#fff"}}>Assistive Technology</strong> support could increase match quality by an estimated 18%.
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
  const convos = ALL_CANDIDATES.map((c,i) => ({
    ...c,
    lastMsg:["Hi! I'm very interested in the role.","Thank you for reviewing my application.","Looking forward to hearing from you.","I have relevant experience in accessibility tools.","When can we schedule an interview?","I attached my portfolio for your review.","Happy to provide more references.","Available for a call anytime this week."][i]||"Hello!",
    time:`${i+1}h ago`, unread:i<3,
  }));
  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"20px 16px" }}>
      <div style={{ display:"flex", background:T.white, borderRadius:8, border:`1px solid ${T.border}`, overflow:"hidden", height:600 }}>
        <div style={{ width:280, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, fontSize:15, fontWeight:800, color:T.navy }}>Messages</div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {convos.map((c,i) => (
              <div key={c.id} onClick={() => setSelected(i)}
                style={{ display:"flex", gap:10, padding:"11px 14px", cursor:"pointer", background:selected===i?"#EEF3F8":"transparent", borderBottom:`1px solid #f0f0f0`, transition:"background 0.1s" }}>
                <Avatar initials={c.initials} size={40} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:13, fontWeight:700, color:T.navy }}>{c.name}</span>
                    <span style={{ fontSize:11, color:T.muted }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize:12, color:T.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:1 }}>{c.lastMsg}</div>
                </div>
                {c.unread && <div style={{ width:8, height:8, borderRadius:"50%", background:T.teal, flexShrink:0, marginTop:4 }} />}
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"12px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:10 }}>
            <Avatar initials={convos[selected]?.initials} size={36} />
            <div>
              <div style={{ fontSize:14, fontWeight:800, color:T.navy }}>{convos[selected]?.name}</div>
              <div style={{ fontSize:12, color:T.success }}>Online</div>
            </div>
            <Badge color={T.success} style={{ marginLeft:"auto" }}>{convos[selected]?.disability}</Badge>
          </div>
          <div style={{ flex:1, padding:"16px", display:"flex", flexDirection:"column", justifyContent:"flex-end", gap:10, overflowY:"auto" }}>
            <div style={{ alignSelf:"flex-start", maxWidth:"65%", padding:"11px 14px", borderRadius:"14px 14px 14px 4px", background:T.bg, border:`1px solid ${T.border}`, fontSize:13, color:T.bodyText, lineHeight:1.6 }}>{convos[selected]?.lastMsg}</div>
            <div style={{ alignSelf:"flex-end", maxWidth:"65%", padding:"11px 14px", borderRadius:"14px 14px 4px 14px", background:T.teal, fontSize:13, color:"#fff", lineHeight:1.6 }}>Thanks for reaching out! We'll review your application shortly.</div>
          </div>
          <div style={{ padding:"10px 14px", borderTop:`1px solid ${T.border}`, display:"flex", gap:8 }}>
            <input placeholder="Write a message..." value={msg} onChange={e=>setMsg(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&msg.trim()) setMsg(""); }}
              style={{ flex:1, padding:"9px 13px", borderRadius:22, border:`1px solid ${T.border}`, fontSize:13, fontFamily:"inherit", outline:"none", background:T.bg }} />
            <button onClick={()=>setMsg("")}
              style={{ padding:"9px 18px", borderRadius:20, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── SETTINGS TAB ───────────────────────────────────────────────────────── */
const SettingsTab = ({ profile, onReset }) => {
  const s3 = profile?.s3 || {};
  const [notifs, setNotifs] = useState({ matches:s3.notifications!==false, ai:s3.aiSuggest!==false, apps:true });
  const Toggle = ({ checked, onChange }) => (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      style={{ width:52, height:28, borderRadius:999, border:"none", cursor:"pointer", background:checked?T.teal:"#C4CDD6", position:"relative", transition:"background 0.2s", flexShrink:0, padding:0, outline:"none" }}>
      <span style={{ position:"absolute", top:3, left:checked?27:3, width:22, height:22, borderRadius:"50%", background:"#fff", boxShadow:"0 2px 4px rgba(0,0,0,0.2)", transition:"left 0.2s", display:"block" }} />
    </button>
  );
  return (
    <div style={{ maxWidth:640, margin:"0 auto", padding:"20px 16px", display:"flex", flexDirection:"column", gap:12 }}>
      <Card>
        <SectionHead>Account Settings</SectionHead>
        {["Email Address","Phone Number","New Password"].map(f => (
          <div key={f} style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontWeight:700, color:T.bodyText, display:"block", marginBottom:5 }}>{f}</label>
            <input type={f.includes("Password")?"password":"text"} placeholder={f.includes("Password")?"••••••••":`Enter ${f.toLowerCase()}`}
              style={{ width:"100%", boxSizing:"border-box", padding:"10px 13px", borderRadius:6, border:`1px solid ${T.border}`, fontSize:13, fontFamily:"inherit", outline:"none" }} />
          </div>
        ))}
        <button style={{ padding:"9px 22px", borderRadius:20, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Save Changes</button>
      </Card>
      <Card>
        <SectionHead>Notifications</SectionHead>
        {[
          { key:"matches", label:"New candidate matches",  sub:"Get notified when new matches are found" },
          { key:"ai",      label:"AI recommendations",     sub:"Daily AI-powered suggestions" },
          { key:"apps",    label:"Application updates",    sub:"Status updates from candidates" },
        ].map(item => (
          <div key={item.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid #f0f0f0` }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:T.navy }}>{item.label}</div>
              <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{item.sub}</div>
            </div>
            <Toggle checked={notifs[item.key]} onChange={v=>setNotifs({...notifs,[item.key]:v})} />
          </div>
        ))}
      </Card>
      <Card>
        <SectionHead>Onboarding Data</SectionHead>
        <p style={{ fontSize:13, color:T.muted, margin:"0 0 14px", lineHeight:1.6 }}>Reset to update your company profile, preferences, and accommodations from scratch.</p>
        <div style={{ padding:"12px 14px", background:"#FFF3EC", borderRadius:8, border:`1px solid #E8A87C44`, marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.warning, marginBottom:3 }}>Warning</div>
          <div style={{ fontSize:12, color:T.bodyText }}>This will clear all onboarding data from local storage.</div>
        </div>
        <button onClick={onReset}
          style={{ padding:"9px 20px", borderRadius:20, border:`1.5px solid ${T.danger}`, background:"#FEF2F2", color:T.danger, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          Reset &amp; Redo Onboarding
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("inklusijobs_employer");
      if (raw) {
        setProfile(JSON.parse(raw));
      }
    } catch (err) {
      console.error("Failed to load profile from localStorage:", err);
    }
    setMounted(true);
  }, []);

  const handleReset = () => {
    localStorage.removeItem("inklusijobs_employer");
    router.replace("/employer/onboarding");
  };

  // Don't render until client has mounted — avoids hydration mismatch
  if (!mounted) return null;

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" }}>
      <TopNav active={activeTab} onTab={setActiveTab} profile={profile} onReset={handleReset} />
      {activeTab === "overview"   && <OverviewTab   profile={profile} onTab={setActiveTab} />}
      {activeTab === "candidates" && <CandidatesTab profile={profile} />}
      {activeTab === "jobs"       && <JobsTab       profile={profile} />}
      {activeTab === "profile"    && <ProfileTab    profile={profile} />}
      {activeTab === "analytics"  && <AnalyticsTab  profile={profile} />}
      {activeTab === "messages"   && <MessagesTab />}
      {activeTab === "settings"   && <SettingsTab   profile={profile} onReset={handleReset} />}
    </div>
  );
}