"use client";
/* eslint-disable @next/next/no-page-custom-font */

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/* ─── FONT — Helvetica Neue / system ─────────────────────────────────────── */
const GlobalFont = () => (
  <style>{`
    * {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
      box-sizing: border-box; margin: 0; padding: 0;
    }
    input[type=range] { -webkit-appearance:none; appearance:none; height:6px; border-radius:99px; outline:none; cursor:pointer; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:18px; height:18px; border-radius:50%; background:#0A8778; cursor:pointer; border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,0.2); }
    input[type=range]::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:#0A8778; cursor:pointer; border:2px solid #fff; }
    ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-track { background:transparent; } ::-webkit-scrollbar-thumb { background:rgba(10,135,120,0.25); border-radius:99px; }
  `}</style>
);

/* ─── THEME ──────────────────────────────────────────────────────────────── */
const T = {
  navy:      "#0D1B2A",
  navyHover: "#162536",
  teal:      "#0A8778",
  tealLight: "#EAF4F4",
  tealPale:  "#D4ECEB",
  white:     "#FFFFFF",
  bodyText:  "#1A2E3B",
  muted:     "#6B8291",
  border:    "#D8E6E5",
  danger:    "#CC1016",
  warning:   "#B24020",
};

/* ─── SVG ICONS (line art) ───────────────────────────────────────────────── */
const Icon = ({ name, size = 20, color = "currentColor", strokeWidth = 1.5 }) => {
  const s = { width: size, height: size, display: "block", flexShrink: 0 };
  const p = { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "users":
      return <svg style={s} viewBox="0 0 24 24"><g {...p}><circle cx="9" cy="7" r="4"/><path d="M2 21v-1a7 7 0 0 1 14 0v1"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M22 21v-1a4 4 0 0 0-3-3.87"/></g></svg>;
    case "briefcase":
      return <svg style={s} viewBox="0 0 24 24"><g {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01"/></g></svg>;
    case "inbox":
      return <svg style={s} viewBox="0 0 24 24"><g {...p}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></g></svg>;
    case "eye":
      return <svg style={s} viewBox="0 0 24 24"><g {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></g></svg>;
    case "bell":
      return <svg style={s} viewBox="0 0 24 24"><g {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></g></svg>;
    case "logout":
      return <svg style={s} viewBox="0 0 24 24"><g {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></g></svg>;
    case "zap":
      return <svg style={s} viewBox="0 0 24 24"><g {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></g></svg>;
    case "trending-up":
      return <svg style={s} viewBox="0 0 24 24"><g {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></g></svg>;
    case "bar-chart":
      return <svg style={s} viewBox="0 0 24 24"><g {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></g></svg>;
    case "message":
      return <svg style={s} viewBox="0 0 24 24"><g {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></g></svg>;
    case "settings":
      return <svg style={s} viewBox="0 0 24 24"><g {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></g></svg>;
    case "activity":
      return <svg style={s} viewBox="0 0 24 24"><g {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></g></svg>;
    case "check-circle":
      return <svg style={s} viewBox="0 0 24 24"><g {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></g></svg>;
    case "user":
      return <svg style={s} viewBox="0 0 24 24"><g {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></g></svg>;
    case "file-text":
      return <svg style={s} viewBox="0 0 24 24"><g {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></g></svg>;
    case "grid":
      return <svg style={s} viewBox="0 0 24 24"><g {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></g></svg>;
    default:
      return null;
  }
};

/* ─── MOCK DATA ──────────────────────────────────────────────────────────── */
const ALL_CANDIDATES = [
  { id:1, name:"Maria Santos",   initials:"MS", role:"Software Developer",  match:97, skills:["JavaScript","React","Accessibility"],    disability:"Visual Impairment",   exp:"3 yrs", status:"New",         budget:"₱80k–₱150k", bio:"Passionate developer with expertise in building accessible web apps. Fluent in WCAG guidelines.", location:"Quezon City", email:"maria@example.com" },
  { id:2, name:"Juan dela Cruz", initials:"JD", role:"Data Analyst",        match:93, skills:["Python","SQL","Excel"],                  disability:"Hearing Impairment",  exp:"2 yrs", status:"Reviewed",    budget:"₱40k–₱80k",  bio:"Data-driven analyst with strong Python and SQL skills. Experienced in dashboard creation and reporting.", location:"Makati",      email:"juan@example.com"  },
  { id:3, name:"Ana Reyes",      initials:"AR", role:"Content Writer",      match:89, skills:["Content Writing","SEO","Canva"],         disability:"Mobility Disability", exp:"4 yrs", status:"New",         budget:"₱20k–₱40k",  bio:"Creative writer specializing in SEO-optimized content for tech and lifestyle brands.", location:"Cebu City",   email:"ana@example.com"   },
  { id:4, name:"Pedro Lim",      initials:"PL", role:"Customer Support",    match:85, skills:["Customer Service","Communication"],      disability:"Speech Impairment",   exp:"1 yr",  status:"Shortlisted", budget:"₱20k–₱40k",  bio:"Empathetic support specialist skilled in written communication and issue resolution.", location:"Davao",       email:"pedro@example.com" },
  { id:5, name:"Rosa Gomez",     initials:"RG", role:"HR Manager",          match:83, skills:["HR Management","Project Management"],   disability:"Chronic Illness",     exp:"5 yrs", status:"New",         budget:"₱80k–₱150k", bio:"Experienced HR professional with a track record of building inclusive workplace policies.", location:"Manila",      email:"rosa@example.com"  },
  { id:6, name:"Carlo Mendoza",  initials:"CM", role:"Designer",            match:80, skills:["Figma","Canva","Social Media"],         disability:"Autism Spectrum",     exp:"2 yrs", status:"Reviewed",    budget:"₱40k–₱80k",  bio:"Detail-oriented UI/UX designer who creates clean, user-centered interfaces.", location:"Pasig",       email:"carlo@example.com" },
  { id:7, name:"Liza Castillo",  initials:"LC", role:"DevOps Engineer",     match:76, skills:["AWS","Node.js","TypeScript"],           disability:"ADHD",                exp:"3 yrs", status:"New",         budget:"₱80k–₱150k", bio:"DevOps engineer experienced in CI/CD pipelines, cloud infrastructure, and automation.", location:"Taguig",      email:"liza@example.com"  },
  { id:8, name:"Ben Torres",     initials:"BT", role:"Product Manager",     match:74, skills:["Project Management","Communication"],   disability:"Physical Disability", exp:"6 yrs", status:"Shortlisted", budget:"₱150k+",      bio:"Strategic product manager who bridges business goals and engineering execution.", location:"Pasay",       email:"ben@example.com"   },
];

const MOCK_JOBS = [
  { id:1, title:"Senior React Developer",  type:"Full-time",  applicants:14, posted:"2 days ago", status:"Active", urgent:true  },
  { id:2, title:"Data Analyst",            type:"Part-time",  applicants:9,  posted:"5 days ago", status:"Active", urgent:false },
  { id:3, title:"Customer Support Agent",  type:"Contract",   applicants:22, posted:"1 day ago",  status:"Active", urgent:true  },
  { id:4, title:"UX/UI Designer",          type:"Freelance",  applicants:6,  posted:"1 week ago", status:"Draft",  urgent:false },
  { id:5, title:"HR Coordinator",          type:"Full-time",  applicants:11, posted:"3 days ago", status:"Active", urgent:false },
];

const JOB_TITLES = [
  "Account Executive","Accountant","Administrative Assistant","Analytics Engineer","Android Developer",
  "Backend Developer","Brand Manager","Business Analyst","Business Development Manager",
  "Content Creator","Content Strategist","Content Writer","Customer Success Manager","Customer Support Agent","Customer Support Specialist",
  "Data Analyst","Data Engineer","Data Scientist","Database Administrator","DevOps Engineer","Digital Marketing Specialist",
  "E-commerce Manager","Email Marketing Specialist",
  "Finance Manager","Financial Analyst","Front-end Developer","Full-stack Developer",
  "Graphic Designer","Growth Hacker",
  "HR Coordinator","HR Manager","HR Specialist",
  "iOS Developer","IT Support Specialist",
  "Java Developer","JavaScript Developer",
  "Junior Accountant","Junior Developer","Junior Designer",
  "Legal Assistant","Logistics Coordinator",
  "Marketing Analyst","Marketing Manager","Mobile Developer",
  "Network Engineer","NodeJS Developer",
  "Operations Manager","Operations Specialist",
  "PHP Developer","Product Designer","Product Manager","Project Manager","Python Developer",
  "QA Engineer","Quality Assurance Specialist",
  "React Developer","Recruitment Specialist","Risk Analyst",
  "Sales Executive","Sales Manager","Senior Data Analyst","Senior Developer","Senior React Developer","Senior UX Designer","SEO Specialist","Social Media Manager","Software Developer","Software Engineer","Solutions Architect",
  "Technical Writer","TypeScript Developer",
  "UI Designer","UI/UX Designer","UX Designer","UX Researcher",
  "Video Editor","Visual Designer",
  "Web Designer","Web Developer",
];

const JOB_TYPES = ["Full-time","Part-time","Contract","Freelance","Internship","Temporary","Casual","Project-based","Remote","Hybrid","On-site"];

/* ─── PRIMITIVES ─────────────────────────────────────────────────────────── */
const Card = ({ children, style={}, onClick }) => (
  <div onClick={onClick} style={{ background:T.white, borderRadius:12, border:`1px solid ${T.border}`, padding:"20px", ...style }}>
    {children}
  </div>
);

const Badge = ({ children, color=T.teal, style={} }) => (
  <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 10px", borderRadius:99, background:`${color}18`, color, fontSize:11, fontWeight:600, border:`1px solid ${color}25`, ...style }}>
    {children}
  </span>
);

const Avatar = ({ initials, size=36, src }) => (
  src
    ? <img src={src} alt="" style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
    : <div style={{ width:size, height:size, borderRadius:"50%", background:T.teal, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.32, fontWeight:700, flexShrink:0 }}>
        {initials}
      </div>
);

const ProgressBar = ({ value, max=100, color=T.teal, height=6 }) => (
  <div style={{ height, borderRadius:99, background:T.tealPale, overflow:"hidden" }}>
    <div style={{ height:"100%", width:`${(value/max)*100}%`, background:color, borderRadius:99, transition:"width 0.6s ease" }} />
  </div>
);

/* ─── INLINE COMPANY LOGO (tiny, for welcome heading) ───────────────────── */
const InlineCompanyLogo = ({ profile, fontSize = 30 }) => {
  const s1 = profile?.s1 || {};
  const company = s1.company || "E";
  const h = Math.round(fontSize * 1.1); // match cap-height roughly
  return s1.logoPreview
    ? <img src={s1.logoPreview} alt="" style={{ height: h, width: "auto", borderRadius: 4, objectFit: "contain", display: "inline-block", verticalAlign: "middle", marginLeft: 8 }} />
    : <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: h, width: h, borderRadius: 6, background: T.teal, color: "#fff", fontSize: Math.round(fontSize * 0.5), fontWeight: 800, verticalAlign: "middle", marginLeft: 8, flexShrink: 0 }}>{company[0]}</div>;
};

/* ─── CANDIDATE PROFILE MODAL ────────────────────────────────────────────── */
const CandidateModal = ({ candidate, onClose, onMessage }) => {
  if (!candidate) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(13,27,42,0.55)", display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={e => { if(e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:T.white, borderRadius:16, width:"min(680px, 95vw)", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ height:100, background:T.navy, borderRadius:"16px 16px 0 0", position:"relative" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 20% 50%, rgba(10,135,120,0.25) 0%, transparent 60%)", borderRadius:"16px 16px 0 0" }} />
          <button onClick={onClose} style={{ position:"absolute", top:14, right:14, width:32, height:32, borderRadius:"50%", border:"none", background:"rgba(255,255,255,0.15)", color:"#fff", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ padding:"0 28px 28px" }}>
          <div style={{ marginTop:-38, marginBottom:16, display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
            <div style={{ width:76, height:76, borderRadius:"50%", border:"4px solid #fff", background:T.teal, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, color:"#fff", fontWeight:800, flexShrink:0 }}>{candidate.initials}</div>
            <div style={{ display:"flex", gap:8, paddingBottom:6 }}>
              <button onClick={() => { onMessage(candidate); onClose(); }} style={{ padding:"8px 18px", borderRadius:8, border:`1.5px solid ${T.teal}`, background:T.white, color:T.teal, fontSize:13, fontWeight:700, cursor:"pointer" }}>Message</button>
              <button style={{ padding:"8px 18px", borderRadius:8, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Shortlist</button>
            </div>
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:T.bodyText, marginBottom:2 }}>{candidate.name}</div>
          <div style={{ fontSize:14, color:T.muted, marginBottom:12 }}>{candidate.role} · {candidate.exp} · {candidate.location}</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
            <Badge color={T.teal}>{candidate.disability}</Badge>
            <Badge color={candidate.status==="Shortlisted"?T.teal:T.muted}>{candidate.status}</Badge>
            <Badge color={T.teal}>{candidate.budget}</Badge>
          </div>
          <div style={{ background:T.tealLight, borderRadius:10, padding:"14px 16px", marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.bodyText }}>Match Score</span>
              <span style={{ fontSize:18, fontWeight:800, color:T.teal }}>{candidate.match}%</span>
            </div>
            <ProgressBar value={candidate.match} height={8} />
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>About</div>
            <p style={{ fontSize:14, color:T.bodyText, lineHeight:1.7 }}>{candidate.bio}</p>
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Skills</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {candidate.skills.map(s => <Badge key={s} color={T.teal}>{s}</Badge>)}
            </div>
          </div>
          <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:14 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Contact</div>
            <div style={{ fontSize:13, color:T.bodyText }}>{candidate.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── SIDEBAR ────────────────────────────────────────────────────────────── */
const Sidebar = ({ active, onTab, profile, onReset }) => {
  const s1 = profile?.s1 || {};
  const company = s1.company || "Your Company";
  const industry = s1.industry || "Employer";

  const NavBtn = ({ id, label, icon, badge }) => {
    const isActive = active === id;
    return (
      <button onClick={() => onTab(id)} style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        width:"100%", padding:"10px 14px", borderRadius:8, border:"none",
        background: isActive ? T.teal : "transparent",
        color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
        fontSize:14, fontWeight: isActive ? 700 : 400,
        cursor:"pointer", textAlign:"left", marginBottom:2,
        transition:"background 0.15s",
      }}
      onMouseEnter={e => { if(!isActive) e.currentTarget.style.background = T.navyHover; }}
      onMouseLeave={e => { if(!isActive) e.currentTarget.style.background = "transparent"; }}
      >
        <span style={{ display:"flex", alignItems:"center", gap:9 }}>
          {icon && <Icon name={icon} size={15} color={isActive ? "#fff" : "rgba(255,255,255,0.55)"} strokeWidth={1.8} />}
          {label}
        </span>
        {badge != null && (
          <span style={{ background: isActive ? "rgba(255,255,255,0.25)" : T.teal, color:"#fff", borderRadius:99, fontSize:11, fontWeight:700, padding:"2px 8px", minWidth:22, textAlign:"center" }}>{badge}</span>
        )}
      </button>
    );
  };

  return (
    <aside style={{ width:220, flexShrink:0, background:T.navy, display:"flex", flexDirection:"column", height:"100vh", position:"sticky", top:0, overflowY:"auto" }}>

      {/* InklusiJobs logo */}
      <div style={{ padding:"18px 16px 14px" }}>
        <div style={{ background:T.white, borderRadius:10, padding:"8px 10px", display:"inline-block" }}>
          <img src="/images/logo.png" alt="InklusiJobs" style={{ height:30, width:"auto", display:"block" }} />
        </div>
      </div>

      {/* Employer identity — text only, no logo image */}
      <div style={{ margin:"0 12px 18px", padding:"12px 14px", borderRadius:10, background:"rgba(255,255,255,0.07)", cursor:"pointer" }}
        onClick={() => onTab("profile")}>
        <div style={{ fontSize:15, fontWeight:800, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", lineHeight:1.2 }}>{company}</div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", marginTop:3 }}>{industry}</div>
      </div>

      {/* Main Menu */}
      <div style={{ padding:"0 10px" }}>
        <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.28)", textTransform:"uppercase", letterSpacing:"0.12em", padding:"0 4px", marginBottom:8 }}>Main Menu</div>
        <NavBtn id="overview"   label="Dashboard" icon="grid" />
        <NavBtn id="candidates" label="Candidates" icon="users" badge={ALL_CANDIDATES.filter(c=>c.status==="New").length} />
        <NavBtn id="jobs"       label="Jobs" icon="briefcase" />
        <NavBtn id="profile"    label="Profile" icon="user" />
        <NavBtn id="analytics"  label="Analytics" icon="bar-chart" />
        <NavBtn id="messages"   label="Messages" icon="message" badge={3} />
      </div>

      {/* Support */}
      <div style={{ padding:"0 10px", marginTop:24 }}>
        <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.28)", textTransform:"uppercase", letterSpacing:"0.12em", padding:"0 4px", marginBottom:8 }}>Support</div>
        <NavBtn id="settings" label="Settings" icon="settings" />
        <button style={{ display:"flex", alignItems:"center", gap:9, width:"100%", padding:"10px 14px", borderRadius:8, border:"none", background:"transparent", color:"rgba(255,255,255,0.5)", fontSize:14, cursor:"pointer", textAlign:"left", marginBottom:2 }}
          onMouseEnter={e => e.currentTarget.style.background = T.navyHover}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <Icon name="file-text" size={15} color="rgba(255,255,255,0.5)" strokeWidth={1.8} />
          Feedback
        </button>
      </div>

      <div style={{ flex:1 }} />

      {/* Bottom */}
      <div style={{ padding:"10px 10px 20px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <button style={{ display:"flex", alignItems:"center", gap:9, width:"100%", padding:"10px 14px", borderRadius:8, border:"none", background:"transparent", color:"rgba(255,255,255,0.5)", fontSize:14, cursor:"pointer", textAlign:"left", marginBottom:2 }}
          onMouseEnter={e => e.currentTarget.style.background = T.navyHover}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <Icon name="bell" size={15} color="rgba(255,255,255,0.5)" strokeWidth={1.8} />
          Notifications
        </button>
        <button onClick={onReset} style={{ display:"flex", alignItems:"center", gap:9, width:"100%", padding:"10px 14px", borderRadius:8, border:"none", background:"transparent", color:"rgba(255,255,255,0.5)", fontSize:14, cursor:"pointer", textAlign:"left" }}
          onMouseEnter={e => e.currentTarget.style.background = T.navyHover}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <Icon name="logout" size={15} color="rgba(255,255,255,0.5)" strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

/* ─── TOP BAR ────────────────────────────────────────────────────────────── */
const TopBar = ({ activeTab, profile }) => {
  const s1 = profile?.s1 || {};
  const today = new Date().toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" });
  const crumbs = { overview:"Dashboard", candidates:"Candidates", jobs:"Jobs", profile:"Profile", analytics:"Analytics", messages:"Messages", settings:"Settings" };
  return (
    <div style={{ height:52, background:T.white, borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", padding:"0 28px", gap:12, flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, flex:1 }}>
        <span style={{ fontSize:13, color:T.muted }}>InklusiJobs</span>
        <span style={{ color:T.border }}>/</span>
        <span style={{ fontSize:13, fontWeight:600, color:T.bodyText }}>{crumbs[activeTab] || "Dashboard"}</span>
      </div>
      <span style={{ fontSize:12, color:T.muted }}>{today}</span>
      <div style={{ width:32, height:32, borderRadius:"50%", background:T.navy, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
        {(s1.company||"E")[0]}
      </div>
    </div>
  );
};

/* ─── STAT CARD ──────────────────────────────────────────────────────────── */
const StatCard = ({ icon, value, label, onClick }) => (
  <div onClick={onClick} style={{ background:T.white, borderRadius:12, border:`1px solid ${T.border}`, padding:"18px 20px", flex:1, display:"flex", alignItems:"center", gap:16, cursor: onClick ? "pointer" : "default", transition:"box-shadow 0.15s" }}
    onMouseEnter={e => { if(onClick) e.currentTarget.style.boxShadow="0 4px 14px rgba(10,135,120,0.12)"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; }}>
    <div style={{ width:46, height:46, borderRadius:10, background:T.tealLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <Icon name={icon} size={22} color={T.teal} strokeWidth={1.6} />
    </div>
    <div>
      <div style={{ fontSize:28, fontWeight:800, color:T.bodyText, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:12, color:T.muted, marginTop:3 }}>{label}</div>
    </div>
  </div>
);

/* ─── OVERVIEW TAB ───────────────────────────────────────────────────────── */
const OverviewTab = ({ profile, onTab, onViewCandidate }) => {
  const s1 = profile?.s1 || {};
  const company = s1.company || "there";
  const topCandidates = ALL_CANDIDATES.slice(0, 4);

  return (
    <div style={{ padding:"28px", display:"flex", flexDirection:"column", gap:24 }}>
      {/* Welcome — inline logo next to company name */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <h1 style={{ fontSize:30, fontWeight:800, color:T.bodyText, marginBottom:4, display:"flex", alignItems:"center", lineHeight:1.2 }}>
            Welcome,&nbsp;{company}
            <InlineCompanyLogo profile={profile} fontSize={30} />
            !
          </h1>
          <p style={{ fontSize:14, color:T.muted }}>Your inclusive hiring dashboard.</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => onTab("profile")} style={{ padding:"9px 20px", borderRadius:8, border:`1.5px solid ${T.border}`, background:T.white, color:T.bodyText, fontSize:13, fontWeight:600, cursor:"pointer" }}>View Profile</button>
          <button onClick={() => onTab("candidates")} style={{ padding:"9px 20px", borderRadius:8, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Find Candidates →</button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display:"flex", gap:14 }}>
        <StatCard icon="users"     value={ALL_CANDIDATES.length} label="Candidate Matches"   onClick={() => onTab("candidates")} />
        <StatCard icon="briefcase" value={MOCK_JOBS.filter(j=>j.status==="Active").length}   label="Active Jobs"      onClick={() => onTab("jobs")} />
        <StatCard icon="inbox"     value={40}                    label="Applications"         onClick={() => onTab("candidates")} />
        <StatCard icon="eye"       value={128}                   label="Profile Views"        onClick={() => onTab("analytics")} />
      </div>

      {/* Content + right panel */}
      <div style={{ display:"flex", gap:20 }}>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:16 }}>

          {/* Top matches */}
          <Card>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h2 style={{ fontSize:16, fontWeight:700, color:T.bodyText }}>Top Candidate Matches</h2>
              <Badge color={T.teal}>Active</Badge>
            </div>
            {topCandidates.map((c, i) => (
              <div key={c.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom: i < topCandidates.length-1 ? `1px solid ${T.tealLight}` : "none" }}>
                <Avatar initials={c.initials} size={44} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:T.bodyText }}>{c.name}</div>
                  <div style={{ fontSize:12, color:T.muted }}>{c.role} · {c.exp}</div>
                  <div style={{ display:"flex", gap:4, marginTop:5, flexWrap:"wrap" }}>
                    {c.skills.slice(0,2).map(sk => <Badge key={sk} color={T.teal} style={{ fontSize:10 }}>{sk}</Badge>)}
                    <Badge color={T.teal} style={{ fontSize:10 }}>{c.disability}</Badge>
                  </div>
                  <div style={{ marginTop:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:11, color:T.muted }}>Match Score</span>
                      <span style={{ fontSize:11, fontWeight:700, color:T.teal }}>{c.match}%</span>
                    </div>
                    <ProgressBar value={c.match} />
                  </div>
                </div>
                <button onClick={() => onViewCandidate(c)} style={{ padding:"7px 16px", borderRadius:8, border:"none", background:T.teal, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0 }}>View →</button>
              </div>
            ))}
            <button onClick={() => onTab("candidates")} style={{ width:"100%", marginTop:14, padding:"11px", borderRadius:8, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              Browse All Candidates →
            </button>
          </Card>

          {/* Jobs overview */}
          <Card style={{ display:"flex", alignItems:"center", gap:20 }}>
            <div style={{ width:64, height:64, borderRadius:"50%", border:`3px solid ${T.teal}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:16, fontWeight:800, color:T.teal }}>{MOCK_JOBS.filter(j=>j.status==="Active").length}</div>
                <div style={{ fontSize:9, color:T.muted, lineHeight:1.2 }}>Active<br/>Jobs</div>
              </div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:700, color:T.bodyText, marginBottom:4 }}>Job Listings Overview</div>
              <div style={{ fontSize:13, color:T.muted }}>You have {MOCK_JOBS.filter(j=>j.status==="Active").length} active listings and {MOCK_JOBS.filter(j=>j.status==="Draft").length} drafts.</div>
            </div>
            <button onClick={() => onTab("jobs")} style={{ padding:"8px 18px", borderRadius:8, border:`1.5px solid ${T.teal}`, background:T.white, color:T.teal, fontSize:13, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
              Manage Jobs →
            </button>
          </Card>

          {/* Recent activity */}
          <Card>
            <h2 style={{ fontSize:15, fontWeight:700, color:T.bodyText, marginBottom:14 }}>Recent Activity</h2>
            {[
              { text:"Maria Santos applied for Senior React Developer",  time:"2h ago"    },
              { text:"Pedro Lim was shortlisted for Customer Support",   time:"5h ago"    },
              { text:"New match: Ana Reyes — 89% compatibility",         time:"Yesterday" },
              { text:"'Data Analyst' post received 3 new applications",  time:"Yesterday" },
            ].map((a, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 0", borderBottom: i < 3 ? `1px solid ${T.tealLight}` : "none" }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:T.tealLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name="activity" size={16} color={T.teal} strokeWidth={1.8} />
                </div>
                <div style={{ flex:1, fontSize:13, color:T.bodyText }}>{a.text}</div>
                <div style={{ fontSize:11, color:T.muted, flexShrink:0 }}>{a.time}</div>
              </div>
            ))}
          </Card>
        </div>

        {/* Right panel */}
        <div style={{ width:280, flexShrink:0, display:"flex", flexDirection:"column", gap:14 }}>
          <Card style={{ background:T.navy, border:"none" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>AI Insight</div>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.8)", lineHeight:1.65, margin:"0 0 14px" }}>
              Your profile is attracting <strong style={{color:"#fff"}}>34% more</strong> qualified PWD applicants this week.
            </p>
            <button onClick={() => onTab("analytics")} style={{ width:"100%", padding:"8px", borderRadius:8, border:`1px solid rgba(255,255,255,0.2)`, background:"transparent", color:"rgba(255,255,255,0.7)", fontSize:12, fontWeight:600, cursor:"pointer" }}>
              View Full Analytics →
            </button>
          </Card>

          <Card>
            <h3 style={{ fontSize:14, fontWeight:700, color:T.bodyText, marginBottom:14 }}>Hiring Pipeline</h3>
            {[
              { label:"New Applications", count:ALL_CANDIDATES.filter(c=>c.status==="New").length,         status:"active"  },
              { label:"Under Review",     count:ALL_CANDIDATES.filter(c=>c.status==="Reviewed").length,    status:"partial" },
              { label:"Shortlisted",      count:ALL_CANDIDATES.filter(c=>c.status==="Shortlisted").length, status:"locked"  },
            ].map((stage, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom: i < 2 ? `1px solid ${T.tealLight}` : "none", cursor:"pointer" }} onClick={() => onTab("candidates")}>
                <div style={{ width:28, height:28, borderRadius:"50%", background: stage.status==="active" ? T.teal : stage.status==="partial" ? T.tealLight : "#f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name={stage.status==="active"?"check-circle":stage.status==="partial"?"activity":"users"} size={13} color={stage.status==="active"?"#fff":T.muted} strokeWidth={1.8} />
                </div>
                <div style={{ flex:1, fontSize:13, fontWeight:600, color:T.bodyText }}>{stage.label}</div>
                <span style={{ fontSize:13, fontWeight:700, color: stage.status==="active" ? T.teal : T.muted }}>{stage.count}</span>
              </div>
            ))}
            <button onClick={() => onTab("candidates")} style={{ width:"100%", marginTop:12, padding:"8px", borderRadius:8, border:`1.5px solid ${T.border}`, background:T.white, color:T.muted, fontSize:12, fontWeight:600, cursor:"pointer" }}>
              View Full Pipeline →
            </button>
          </Card>

          <Card>
            <h3 style={{ fontSize:14, fontWeight:700, color:T.bodyText, marginBottom:12 }}>This Week</h3>
            {[
              { label:"Profile views",  value:"+23" },
              { label:"New applicants", value:"+8"  },
              { label:"Shortlisted",    value:"3"   },
              { label:"Messages",       value:"12"  },
            ].map((s, i) => (
              <div key={s.label} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom: i < 3 ? `1px solid ${T.tealLight}` : "none" }}>
                <span style={{ fontSize:12, color:T.muted }}>{s.label}</span>
                <span style={{ fontSize:13, fontWeight:700, color:T.teal }}>{s.value}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

/* ─── CANDIDATES TAB ─────────────────────────────────────────────────────── */
const CandidatesTab = ({ profile, onViewCandidate, onMessageCandidate }) => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const statuses = ["All","New","Reviewed","Shortlisted"];
  const filtered = ALL_CANDIDATES.filter(c => {
    if (statusFilter !== "All" && c.status !== statusFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.role.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ padding:"28px", display:"flex", gap:20 }}>
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:800, color:T.bodyText }}>Candidates</h1>
            <p style={{ fontSize:13, color:T.muted }}>{filtered.length} candidates found</p>
          </div>
        </div>

        <Card style={{ marginBottom:14, padding:"12px 16px" }}>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
            <input placeholder="Search by name or role..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{ flex:1, minWidth:200, padding:"9px 14px", borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, outline:"none", background:T.tealLight, color:T.bodyText }} />
            <div style={{ display:"flex", gap:6 }}>
              {statuses.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} style={{
                  padding:"7px 14px", borderRadius:8,
                  border:`1.5px solid ${statusFilter===s ? T.teal : T.border}`,
                  background: statusFilter===s ? T.teal : T.white,
                  color: statusFilter===s ? "#fff" : T.muted,
                  fontSize:12, fontWeight:600, cursor:"pointer",
                }}>{s}</button>
              ))}
            </div>
          </div>
        </Card>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {filtered.map(c => (
            <Card key={c.id} style={{ cursor:"default" }}>
              <div style={{ display:"flex", gap:12 }}>
                <Avatar initials={c.initials} size={48} />
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:T.bodyText }}>{c.name}</div>
                    <div style={{ fontSize:16, fontWeight:800, color:T.teal }}>{c.match}%</div>
                  </div>
                  <div style={{ fontSize:11, color:T.muted, marginBottom:6 }}>{c.role} · {c.exp}</div>
                  <ProgressBar value={c.match} height={4} />
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:8 }}>
                    {c.skills.slice(0,2).map(sk => <Badge key={sk} color={T.teal} style={{ fontSize:10 }}>{sk}</Badge>)}
                    <Badge color={T.teal} style={{ fontSize:10 }}>{c.disability}</Badge>
                  </div>
                  <div style={{ marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <Badge color={c.status==="Shortlisted"?T.teal:T.muted} style={{ fontSize:10 }}>{c.status}</Badge>
                    <span style={{ fontSize:11, color:T.muted }}>{c.budget}</span>
                  </div>
                  <div style={{ marginTop:10, display:"flex", gap:6 }}>
                    <button onClick={() => onViewCandidate(c)} style={{ flex:1, padding:"7px", borderRadius:8, border:"none", background:T.teal, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>View Profile</button>
                    <button onClick={() => onMessageCandidate(c)} style={{ flex:1, padding:"7px", borderRadius:8, border:`1.5px solid ${T.border}`, background:T.white, color:T.bodyText, fontSize:12, fontWeight:700, cursor:"pointer" }}>Message</button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div style={{ width:240, flexShrink:0 }}>
        <Card style={{ background:T.navy, border:"none", marginBottom:12 }}>
          <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:8 }}>AI Insight</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.8)", lineHeight:1.6 }}>
            Best matches are <strong style={{color:"#fff"}}>{profile?.s2?.expLevel||"Mid-Level"}</strong> · <strong style={{color:"#fff"}}>{profile?.s2?.workSetup||"Remote"}</strong>
          </div>
        </Card>
        <Card>
          <h3 style={{ fontSize:13, fontWeight:700, color:T.bodyText, marginBottom:12 }}>Match Breakdown</h3>
          {[
            { label:"95–100%", count:1, color:T.teal   },
            { label:"85–94%",  count:3, color:T.teal   },
            { label:"75–84%",  count:3, color:T.warning },
            { label:"<75%",    count:1, color:T.muted  },
          ].map(row => (
            <div key={row.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:row.color, display:"inline-block" }} />
                <span style={{ fontSize:12, color:T.muted }}>{row.label}</span>
              </div>
              <span style={{ fontSize:13, fontWeight:700, color:T.bodyText }}>{row.count}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

/* ─── JOB TITLE AUTOCOMPLETE ─────────────────────────────────────────────── */
const JobTitleInput = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleChange = (val) => {
    onChange(val);
    if (val.trim().length < 1) { setSuggestions([]); setOpen(false); return; }
    const filtered = JOB_TITLES.filter(t => t.toLowerCase().includes(val.toLowerCase())).sort((a,b)=>a.localeCompare(b)).slice(0, 8);
    setSuggestions(filtered);
    setOpen(filtered.length > 0);
  };

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <input value={value} onChange={e => handleChange(e.target.value)}
        onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
        placeholder="e.g. Senior React Developer"
        style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${open ? T.teal : T.border}`, fontSize:13, outline:"none", color:T.bodyText }} />
      {open && (
        <div style={{ position:"absolute", top:"100%", left:0, right:0, background:T.white, border:`1.5px solid ${T.teal}`, borderRadius:8, boxShadow:"0 8px 24px rgba(10,135,120,0.12)", zIndex:200, overflow:"hidden", marginTop:2 }}>
          {suggestions.map(s => (
            <div key={s} onClick={() => { onChange(s); setSuggestions([]); setOpen(false); }}
              style={{ padding:"9px 14px", fontSize:13, color:T.bodyText, cursor:"pointer", borderBottom:`1px solid ${T.tealLight}` }}
              onMouseEnter={e => e.currentTarget.style.background = T.tealLight}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── SALARY RANGE SLIDER ────────────────────────────────────────────────── */
const SalaryRangeInput = ({ value, onChange }) => {
  const [mode, setMode] = useState("slider");
  const [min, setMin] = useState(20);
  const [max, setMax] = useState(100);
  const fmt = v => v >= 200 ? "₱200k+" : `₱${v}k`;
  useEffect(() => { if (mode === "slider") onChange(`${fmt(min)} – ${fmt(max)}`); }, [min, max, mode]);
  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:8 }}>
        <button onClick={() => setMode("slider")} style={{ padding:"4px 12px", borderRadius:6, border:`1.5px solid ${mode==="slider"?T.teal:T.border}`, background:mode==="slider"?T.teal:T.white, color:mode==="slider"?"#fff":T.muted, fontSize:11, fontWeight:600, cursor:"pointer" }}>Slider</button>
        <button onClick={() => setMode("manual")} style={{ padding:"4px 12px", borderRadius:6, border:`1.5px solid ${mode==="manual"?T.teal:T.border}`, background:mode==="manual"?T.teal:T.white, color:mode==="manual"?"#fff":T.muted, fontSize:11, fontWeight:600, cursor:"pointer" }}>Manual</button>
      </div>
      {mode === "slider" ? (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:12, color:T.muted }}>Min: <strong style={{color:T.bodyText}}>{fmt(min)}</strong></span>
            <span style={{ fontSize:12, color:T.muted }}>Max: <strong style={{color:T.bodyText}}>{fmt(max)}</strong></span>
          </div>
          <div style={{ marginBottom:8 }}>
            <div style={{ fontSize:11, color:T.muted, marginBottom:4 }}>Minimum</div>
            <input type="range" min={10} max={200} step={5} value={min}
              onChange={e => { const v=Number(e.target.value); setMin(Math.min(v, max-5)); }}
              style={{ width:"100%", accentColor:T.teal, background:`linear-gradient(to right, ${T.teal} 0%, ${T.teal} ${((min-10)/190)*100}%, ${T.tealPale} ${((min-10)/190)*100}%, ${T.tealPale} 100%)` }} />
          </div>
          <div>
            <div style={{ fontSize:11, color:T.muted, marginBottom:4 }}>Maximum</div>
            <input type="range" min={10} max={200} step={5} value={max}
              onChange={e => { const v=Number(e.target.value); setMax(Math.max(v, min+5)); }}
              style={{ width:"100%", accentColor:T.teal, background:`linear-gradient(to right, ${T.teal} 0%, ${T.teal} ${((max-10)/190)*100}%, ${T.tealPale} ${((max-10)/190)*100}%, ${T.tealPale} 100%)` }} />
          </div>
          <div style={{ marginTop:8, padding:"8px 12px", background:T.tealLight, borderRadius:8, fontSize:13, fontWeight:600, color:T.teal, textAlign:"center" }}>
            {fmt(min)} – {fmt(max)}
          </div>
        </div>
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder="e.g. ₱40,000 – ₱80,000 / month"
          style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, outline:"none", color:T.bodyText }} />
      )}
    </div>
  );
};

/* ─── JOBS TAB ───────────────────────────────────────────────────────────── */
const JobsTab = ({ profile }) => {
  const s2 = profile?.s2 || {};
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({ title:"", type:"Full-time", salary:"", desc:"" });

  return (
    <div style={{ padding:"28px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:T.bodyText }}>Jobs</h1>
          <p style={{ fontSize:13, color:T.muted }}>{MOCK_JOBS.length} posts · {MOCK_JOBS.filter(j=>j.status==="Active").length} active</p>
        </div>
        <button onClick={() => setShowForm(s=>!s)} style={{ padding:"9px 20px", borderRadius:8, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
          {showForm ? "Cancel" : "+ Post New Job"}
        </button>
      </div>

      {showForm && (
        <Card style={{ border:`1.5px solid ${T.teal}`, marginBottom:16 }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:T.bodyText, marginBottom:16 }}>New Job Post</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:T.muted, display:"block", marginBottom:5 }}>Job Title *</label>
              <JobTitleInput value={newJob.title} onChange={v => setNewJob({...newJob, title:v})} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:T.muted, display:"block", marginBottom:5 }}>Employment Type</label>
              <select value={newJob.type} onChange={e => setNewJob({...newJob, type:e.target.value})}
                style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, outline:"none", background:T.white, color:T.bodyText }}>
                {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ fontSize:12, fontWeight:600, color:T.muted, display:"block", marginBottom:5 }}>Salary Range</label>
              <SalaryRangeInput value={newJob.salary} onChange={v => setNewJob({...newJob, salary:v})} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:T.muted, display:"block", marginBottom:5 }}>Work Setup</label>
              <input value={s2.workSetup||""} readOnly placeholder="From preferences"
                style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, background:T.tealLight, color:T.muted }} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:T.muted, display:"block", marginBottom:5 }}>Location</label>
              <input placeholder="e.g. Manila / Remote"
                style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, outline:"none", color:T.bodyText }} />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ fontSize:12, fontWeight:600, color:T.muted, display:"block", marginBottom:5 }}>Description</label>
              <textarea rows={4} value={newJob.desc} onChange={e=>setNewJob({...newJob,desc:e.target.value})} placeholder="Describe responsibilities, requirements, and accommodations..."
                style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, outline:"none", resize:"vertical", color:T.bodyText }} />
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button style={{ padding:"9px 22px", borderRadius:8, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Publish Job</button>
            <button style={{ padding:"9px 22px", borderRadius:8, border:`1.5px solid ${T.border}`, background:T.white, color:T.muted, fontSize:13, fontWeight:600, cursor:"pointer" }}>Save Draft</button>
          </div>
        </Card>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {MOCK_JOBS.map(j => (
          <Card key={j.id} style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:48, height:48, borderRadius:10, background:T.tealLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon name="briefcase" size={22} color={T.teal} strokeWidth={1.5} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:T.bodyText, display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                {j.title}
                {j.urgent && <Badge color={T.danger} style={{ fontSize:10 }}>Urgent</Badge>}
              </div>
              <div style={{ fontSize:12, color:T.muted }}>{j.type} · Posted {j.posted} · {s2.workSetup||"Remote"}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <Badge color={j.status==="Active"?T.teal:T.muted}>{j.status}</Badge>
              <div style={{ fontSize:18, fontWeight:800, color:T.bodyText, marginTop:6 }}>{j.applicants}</div>
              <div style={{ fontSize:10, color:T.muted }}>applicants</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* ─── EDIT PROFILE MODAL ─────────────────────────────────────────────────── */
const EditProfileModal = ({ profile, onClose, onSave }) => {
  const s1 = profile?.s1 || {};
  const s4 = profile?.s4 || {};
  const [company, setCompany] = useState(s1.company || "");
  const [industry, setIndustry] = useState(s1.industry || "");
  const [mission, setMission] = useState(s4.mission || "");

  const handleSave = () => {
    const updated = {
      ...profile,
      s1: { ...s1, company },
      s4: { ...s4, mission },
    };
    try { localStorage.setItem("inklusijobs_employer", JSON.stringify(updated)); } catch(e) {}
    onSave(updated);
    onClose();
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(13,27,42,0.55)", display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:T.white, borderRadius:16, width:"min(520px,95vw)", boxShadow:"0 20px 60px rgba(0,0,0,0.2)", overflow:"hidden" }}>
        <div style={{ padding:"22px 28px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:18, fontWeight:800, color:T.bodyText }}>Edit Profile</div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:"50%", border:"none", background:T.tealLight, color:T.muted, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ padding:"20px 28px 28px", display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:T.muted, display:"block", marginBottom:5 }}>Company Name</label>
            <input value={company} onChange={e=>setCompany(e.target.value)}
              style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, outline:"none", color:T.bodyText }} />
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:T.muted, display:"block", marginBottom:5 }}>Industry</label>
            <input value={industry} onChange={e=>setIndustry(e.target.value)}
              style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, outline:"none", color:T.bodyText }} />
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:T.muted, display:"block", marginBottom:5 }}>About / Mission Statement</label>
            <textarea rows={4} value={mission} onChange={e=>setMission(e.target.value)}
              placeholder="Describe your company's mission and commitment to inclusive hiring..."
              style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, outline:"none", resize:"vertical", color:T.bodyText, lineHeight:1.6 }} />
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <button onClick={onClose} style={{ padding:"9px 20px", borderRadius:8, border:`1.5px solid ${T.border}`, background:T.white, color:T.muted, fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
            <button onClick={handleSave} style={{ padding:"9px 22px", borderRadius:8, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── SHARE PROFILE MODAL ────────────────────────────────────────────────── */
const ShareProfileModal = ({ profile, onClose }) => {
  const company = profile?.s1?.company || "Your Company";
  const url = typeof window !== "undefined" ? `${window.location.origin}/employer/${company.toLowerCase().replace(/\s+/g,"-")}` : "https://inklusijobs.com/employer/profile";
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(13,27,42,0.55)", display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:T.white, borderRadius:16, width:"min(460px,95vw)", boxShadow:"0 20px 60px rgba(0,0,0,0.2)", overflow:"hidden" }}>
        <div style={{ padding:"22px 28px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:18, fontWeight:800, color:T.bodyText }}>Share Profile</div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:"50%", border:"none", background:T.tealLight, color:T.muted, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ padding:"20px 28px 28px" }}>
          <p style={{ fontSize:13, color:T.muted, marginBottom:16, lineHeight:1.6 }}>Share your employer profile link with candidates or on social media.</p>
          <div style={{ display:"flex", gap:8, alignItems:"center", padding:"10px 14px", background:T.tealLight, borderRadius:10, marginBottom:20 }}>
            <span style={{ flex:1, fontSize:12, color:T.bodyText, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{url}</span>
            <button onClick={copy} style={{ padding:"6px 14px", borderRadius:7, border:"none", background: copied ? T.teal : T.navy, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0, transition:"background 0.2s" }}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {[
              { label:"LinkedIn", bg:"#0A66C2" },
              { label:"Facebook", bg:"#1877F2" },
              { label:"Twitter/X", bg:"#000" },
            ].map(s => (
              <button key={s.label} style={{ flex:1, padding:"8px", borderRadius:8, border:"none", background:s.bg, color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>{s.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── PROFILE TAB ────────────────────────────────────────────────────────── */
const ProfileTab = ({ profile: initialProfile }) => {
  const [profile, setProfile] = useState(initialProfile);
  const [showEdit, setShowEdit] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const s1 = profile?.s1 || {};
  const s2 = profile?.s2 || {};
  const s3 = profile?.s3 || {};
  const s4 = profile?.s4 || {};

  // Logo overlaps cover by half: logo height=120, so cover needs paddingBottom for logo
  const LOGO_SIZE = 120;
  const LOGO_OVERLAP = LOGO_SIZE / 2; // how much it sticks below cover

  return (
    <div style={{ minHeight:"100%" }}>
      {/* Cover banner */}
      <div style={{ height:180, background:T.navy, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 15% 50%, rgba(10,135,120,0.3) 0%, transparent 55%), radial-gradient(circle at 80% 30%, rgba(10,135,120,0.15) 0%, transparent 50%)" }} />
        {/* Badges — top right */}
        <div style={{ position:"absolute", top:18, right:28, display:"flex", gap:8 }}>
          <Badge color={T.teal} style={{ background:"rgba(10,135,120,0.28)", border:"1px solid rgba(10,135,120,0.55)", color:"#fff", fontSize:12 }}>Inclusive Employer</Badge>
          {s4?.visible!==false && <Badge color={T.teal} style={{ background:"rgba(10,135,120,0.28)", border:"1px solid rgba(10,135,120,0.55)", color:"#fff", fontSize:12 }}>Visible</Badge>}
        </div>
      </div>

      <div style={{ padding:"0 36px 36px" }}>
        {/* Action buttons row — right aligned, below cover */}
        <div style={{ display:"flex", justifyContent:"flex-end", gap:10, paddingTop:16, marginBottom:20 }}>
          <button onClick={() => setShowEdit(true)} style={{ padding:"10px 22px", borderRadius:9, border:`1.5px solid ${T.border}`, background:T.white, color:T.bodyText, fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>Edit Profile</button>
          <button onClick={() => setShowShare(true)} style={{ padding:"10px 22px", borderRadius:9, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>Share Profile</button>
        </div>

        {/* Identity row: logo + name/meta + bio */}
        <div style={{ display:"flex", gap:24, alignItems:"flex-start", marginBottom:28 }}>
          {/* Logo */}
          <div style={{
            width: LOGO_SIZE, height: LOGO_SIZE,
            borderRadius:14, border:`1px solid ${T.border}`,
            background:T.white, overflow:"hidden",
            boxShadow:"0 4px 14px rgba(0,0,0,0.08)", flexShrink:0,
          }}>
            {s1.logoPreview
              ? <img src={s1.logoPreview} alt="" style={{ width:"100%", height:"100%", objectFit:"contain", padding:8 }} />
              : <div style={{ width:"100%", height:"100%", background:T.teal, display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, color:"#fff", fontWeight:800 }}>{(s1.company||"C")[0]}</div>
            }
          </div>

          {/* Name + meta stacked */}
          <div style={{ paddingTop:4, minWidth:0 }}>
            <h1 style={{ fontSize:34, fontWeight:800, color:T.bodyText, marginBottom:5, lineHeight:1.15 }}>{s1.company||"Your Company"}</h1>
            <p style={{ fontSize:14, color:T.muted }}>{s1.industry||"Industry"} · {s1.sizeCustom||s1.size||"—"} employees · Philippines</p>
          </div>

          {/* Bio / mission — fills remaining space */}
          {s4?.mission ? (
            <div style={{ flex:1, padding:"14px 18px", background:T.tealLight, borderRadius:12, borderLeft:`3px solid ${T.teal}`, alignSelf:"stretch", display:"flex", flexDirection:"column", justifyContent:"center" }}>
              <div style={{ fontSize:10, fontWeight:700, color:T.teal, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>About</div>
              <p style={{ fontSize:13, color:T.bodyText, lineHeight:1.75, margin:0 }}>{s4.mission}</p>
            </div>
          ) : (
            <div style={{ flex:1, padding:"14px 18px", background:T.tealLight, borderRadius:12, borderLeft:`3px solid ${T.tealPale}`, cursor:"pointer", alignSelf:"stretch", display:"flex", alignItems:"center" }} onClick={() => setShowEdit(true)}>
              <span style={{ fontSize:12, color:T.muted, fontStyle:"italic" }}>No company bio yet. Click Edit Profile to add one.</span>
            </div>
          )}
        </div>

        {/* 3-col info cards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:16 }}>
          <Card>
            <h3 style={{ fontSize:14, fontWeight:700, color:T.bodyText, marginBottom:14 }}>Company Details</h3>
            {[["Company",s1.company],["Industry",s1.industry],["Size",s1.sizeCustom||s1.size],["Work Setup",s2.workSetup],["Budget",s2.budget],["Exp. Level",s2.expLevel]].filter(r=>r[1]).map(([l,v],i,a)=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:i<a.length-1?`1px solid ${T.tealLight}`:"none" }}>
                <span style={{ fontSize:12, color:T.muted }}>{l}</span>
                <span style={{ fontSize:12, fontWeight:600, color:T.bodyText }}>{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <h3 style={{ fontSize:14, fontWeight:700, color:T.bodyText, marginBottom:14 }}>Roles Hiring</h3>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {(s2.roles||[]).length>0 ? s2.roles.map(r=><Badge key={r} color={T.teal}>{r}</Badge>) : <span style={{fontSize:12,color:T.muted}}>Not specified</span>}
            </div>
            <h3 style={{ fontSize:14, fontWeight:700, color:T.bodyText, margin:"18px 0 10px" }}>Required Skills</h3>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {(s2.skills||[]).length>0 ? s2.skills.map(s=><Badge key={s} color={T.teal}>{s}</Badge>) : <span style={{fontSize:12,color:T.muted}}>Not specified</span>}
            </div>
          </Card>
          <Card>
            <h3 style={{ fontSize:14, fontWeight:700, color:T.bodyText, marginBottom:14 }}>Accommodations</h3>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {(s3.accommodations||[]).length>0 ? s3.accommodations.map(a=><Badge key={a} color={T.teal}>{a}</Badge>) : <span style={{fontSize:12,color:T.muted}}>None listed</span>}
            </div>
            <h3 style={{ fontSize:14, fontWeight:700, color:T.bodyText, margin:"18px 0 10px" }}>Disability Types Welcomed</h3>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {["Visual","Hearing","Mobility","Speech","Cognitive","Chronic Illness"].map(d => <Badge key={d} color={T.teal} style={{ fontSize:10 }}>{d}</Badge>)}
            </div>
          </Card>
        </div>

        {/* Stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
          {[
            { label:"Total Matches",  value:ALL_CANDIDATES.length },
            { label:"Active Jobs",    value:MOCK_JOBS.filter(j=>j.status==="Active").length },
            { label:"Applications",   value:40 },
            { label:"Profile Views",  value:128 },
          ].map(s => (
            <Card key={s.label} style={{ textAlign:"center", padding:"16px" }}>
              <div style={{ fontSize:26, fontWeight:800, color:T.bodyText }}>{s.value}</div>
              <div style={{ fontSize:12, color:T.muted, marginTop:3 }}>{s.label}</div>
            </Card>
          ))}
        </div>
      </div>

      {showEdit && <EditProfileModal profile={profile} onClose={() => setShowEdit(false)} onSave={setProfile} />}
      {showShare && <ShareProfileModal profile={profile} onClose={() => setShowShare(false)} />}
    </div>
  );
};

/* ─── ANALYTICS TAB ──────────────────────────────────────────────────────── */
const AnalyticsTab = ({ profile }) => {
  const s1 = profile?.s1 || {};
  return (
    <div style={{ padding:"28px" }}>
      <h1 style={{ fontSize:22, fontWeight:800, color:T.bodyText, marginBottom:20 }}>Analytics</h1>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:16 }}>
        {[
          { label:"Profile Views",      value:"128", sub:"↑ 23% this week",   icon:"eye"         },
          { label:"Total Applications", value:"40",  sub:"↑ 8 this week",     icon:"inbox"       },
          { label:"Acceptance Rate",    value:"42%", sub:"Industry avg: 35%", icon:"trending-up" },
        ].map(stat => (
          <Card key={stat.label}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
              <div style={{ width:38, height:38, borderRadius:8, background:T.tealLight, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name={stat.icon} size={18} color={T.teal} strokeWidth={1.6} />
              </div>
              <div style={{ fontSize:28, fontWeight:800, color:T.bodyText }}>{stat.value}</div>
            </div>
            <div style={{ fontSize:13, fontWeight:600, color:T.bodyText }}>{stat.label}</div>
            <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{stat.sub}</div>
          </Card>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        <Card>
          <h3 style={{ fontSize:14, fontWeight:700, color:T.bodyText, marginBottom:14 }}>Application Funnel</h3>
          {[
            { label:"Profile Views", value:128, pct:100 },
            { label:"Applications",  value:40,  pct:31  },
            { label:"Reviewed",      value:22,  pct:17  },
            { label:"Shortlisted",   value:10,  pct:8   },
            { label:"Hired",         value:3,   pct:2   },
          ].map(row => (
            <div key={row.label} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:T.muted }}>{row.label}</span>
                <span style={{ fontSize:12, fontWeight:700, color:T.bodyText }}>{row.value}</span>
              </div>
              <ProgressBar value={row.pct} />
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{ fontSize:14, fontWeight:700, color:T.bodyText, marginBottom:14 }}>Diversity Metrics</h3>
          {[
            { label:"Visual Impairment",   pct:33, color:T.teal    },
            { label:"Hearing Impairment",  pct:25, color:"#0D8EA0" },
            { label:"Mobility Disability", pct:22, color:"#3AAFA9" },
            { label:"Other",               pct:20, color:T.muted   },
          ].map(row => (
            <div key={row.label} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:T.muted }}>{row.label}</span>
                <span style={{ fontSize:12, fontWeight:700, color:T.bodyText }}>{row.pct}%</span>
              </div>
              <ProgressBar value={row.pct} color={row.color} />
            </div>
          ))}
        </Card>
      </div>
      {s1.industry && (
        <Card style={{ background:T.navy, border:"none" }}>
          <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:8 }}>AI Insight — {s1.industry}</div>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.8)", lineHeight:1.6, margin:0 }}>
            Inclusive employers in <strong style={{color:"#fff"}}>{s1.industry}</strong> report <strong style={{color:"#fff"}}>34% higher retention</strong> among PWD hires.
          </p>
        </Card>
      )}
    </div>
  );
};

/* ─── MESSAGES TAB ───────────────────────────────────────────────────────── */
const MessagesTab = ({ initialCandidate }) => {
  const convos = ALL_CANDIDATES.map((c,i) => ({
    ...c,
    lastMsg:["Hi! Very interested in the role.","Thank you for reviewing my application.","Looking forward to hearing from you.","I have relevant accessibility experience.","When can we schedule an interview?","Portfolio attached for your review.","Happy to provide references.","Available for a call anytime."][i]||"Hello!",
    time:`${i+1}h ago`, unread:i<3,
  }));
  const initIdx = initialCandidate ? convos.findIndex(c => c.id === initialCandidate.id) : 0;
  const [selected, setSelected] = useState(initIdx >= 0 ? initIdx : 0);
  const [msg, setMsg] = useState("");

  return (
    <div style={{ padding:"28px", display:"flex", flexDirection:"column", height:"calc(100vh - 52px)" }}>
      <h1 style={{ fontSize:22, fontWeight:800, color:T.bodyText, marginBottom:16, flexShrink:0 }}>Messages</h1>
      <div style={{ display:"flex", background:T.white, borderRadius:12, border:`1px solid ${T.border}`, overflow:"hidden", flex:1, minHeight:0 }}>
        <div style={{ width:280, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, fontSize:14, fontWeight:700, color:T.bodyText }}>Conversations</div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {convos.map((c,i) => (
              <div key={c.id} onClick={() => setSelected(i)}
                style={{ display:"flex", gap:10, padding:"11px 14px", cursor:"pointer", background:selected===i?T.tealLight:"transparent", borderBottom:`1px solid ${T.tealLight}` }}>
                <Avatar initials={c.initials} size={38} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:13, fontWeight:600, color:T.bodyText }}>{c.name}</span>
                    <span style={{ fontSize:10, color:T.muted }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize:11, color:T.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.lastMsg}</div>
                </div>
                {c.unread && <div style={{ width:7, height:7, borderRadius:"50%", background:T.teal, flexShrink:0, marginTop:5 }} />}
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
          <div style={{ padding:"12px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:10 }}>
            <Avatar initials={convos[selected]?.initials} size={34} />
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.bodyText }}>{convos[selected]?.name}</div>
              <div style={{ fontSize:11, color:T.teal }}>Online</div>
            </div>
            <Badge color={T.teal} style={{ marginLeft:"auto" }}>{convos[selected]?.disability}</Badge>
          </div>
          <div style={{ flex:1, padding:"16px", display:"flex", flexDirection:"column", justifyContent:"flex-end", gap:10, overflowY:"auto" }}>
            <div style={{ alignSelf:"flex-start", maxWidth:"65%", padding:"10px 14px", borderRadius:"12px 12px 12px 3px", background:T.tealLight, fontSize:13, color:T.bodyText, lineHeight:1.5 }}>{convos[selected]?.lastMsg}</div>
            <div style={{ alignSelf:"flex-end", maxWidth:"65%", padding:"10px 14px", borderRadius:"12px 12px 3px 12px", background:T.teal, fontSize:13, color:"#fff", lineHeight:1.5 }}>Thanks for reaching out! We'll review your application shortly.</div>
          </div>
          <div style={{ padding:"10px 14px", borderTop:`1px solid ${T.border}`, display:"flex", gap:8 }}>
            <input placeholder="Write a message..." value={msg} onChange={e=>setMsg(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&msg.trim()) setMsg(""); }}
              style={{ flex:1, padding:"9px 12px", borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, outline:"none", background:T.tealLight, color:T.bodyText }} />
            <button onClick={()=>setMsg("")} style={{ padding:"9px 18px", borderRadius:8, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Send</button>
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
      style={{ width:48, height:26, borderRadius:999, border:"none", cursor:"pointer", background:checked?T.teal:"#C4CDD6", position:"relative", transition:"background 0.2s", flexShrink:0, padding:0, outline:"none" }}>
      <span style={{ position:"absolute", top:3, left:checked?25:3, width:20, height:20, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 3px rgba(0,0,0,0.15)", transition:"left 0.2s", display:"block" }} />
    </button>
  );
  return (
    <div style={{ padding:"28px" }}>
      <h1 style={{ fontSize:22, fontWeight:800, color:T.bodyText, marginBottom:20 }}>Settings</h1>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, maxWidth:900 }}>
        <Card>
          <h3 style={{ fontSize:14, fontWeight:700, color:T.bodyText, marginBottom:14 }}>Account</h3>
          {["Email Address","Phone Number","New Password"].map(f => (
            <div key={f} style={{ marginBottom:12 }}>
              <label style={{ fontSize:12, fontWeight:600, color:T.muted, display:"block", marginBottom:5 }}>{f}</label>
              <input type={f.includes("Password")?"password":"text"} placeholder={f.includes("Password")?"••••••••":`Enter ${f.toLowerCase()}`}
                style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, outline:"none", color:T.bodyText }} />
            </div>
          ))}
          <button style={{ padding:"8px 20px", borderRadius:8, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Save Changes</button>
        </Card>
        <Card>
          <h3 style={{ fontSize:14, fontWeight:700, color:T.bodyText, marginBottom:14 }}>Notifications</h3>
          {[
            { key:"matches", label:"New candidate matches",  sub:"Get notified when new matches are found" },
            { key:"ai",      label:"AI recommendations",     sub:"Daily AI-powered suggestions" },
            { key:"apps",    label:"Application updates",    sub:"Status updates from candidates" },
          ].map(item => (
            <div key={item.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${T.tealLight}` }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:T.bodyText }}>{item.label}</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{item.sub}</div>
              </div>
              <Toggle checked={notifs[item.key]} onChange={v=>setNotifs({...notifs,[item.key]:v})} />
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{ fontSize:14, fontWeight:700, color:T.bodyText, marginBottom:14 }}>Preferences</h3>
          {["Language","Timezone","Currency"].map(f => (
            <div key={f} style={{ marginBottom:12 }}>
              <label style={{ fontSize:12, fontWeight:600, color:T.muted, display:"block", marginBottom:5 }}>{f}</label>
              <select style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, outline:"none", background:T.white, color:T.bodyText }}>
                {f==="Language" && <><option>English</option><option>Filipino</option></>}
                {f==="Timezone" && <><option>Asia/Manila (UTC+8)</option><option>UTC</option></>}
                {f==="Currency" && <><option>Philippine Peso (₱)</option><option>USD ($)</option></>}
              </select>
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{ fontSize:14, fontWeight:700, color:T.bodyText, marginBottom:10 }}>Danger Zone</h3>
          <p style={{ fontSize:13, color:T.muted, marginBottom:12, lineHeight:1.5 }}>Reset to restart the onboarding flow from scratch.</p>
          <div style={{ padding:"12px 14px", background:"#FFF3EC", borderRadius:8, marginBottom:14 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.warning, marginBottom:3 }}>Warning</div>
            <div style={{ fontSize:12, color:T.bodyText }}>This will clear all onboarding data from local storage.</div>
          </div>
          <button onClick={onReset} style={{ padding:"8px 20px", borderRadius:8, border:`1.5px solid ${T.danger}`, background:"#FEF2F2", color:T.danger, fontSize:13, fontWeight:700, cursor:"pointer" }}>
            Reset &amp; Redo Onboarding
          </button>
        </Card>
      </div>
    </div>
  );
};

/* ─── MAIN ───────────────────────────────────────────────────────────────── */
export default function EmployerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const [messagingCandidate, setMessagingCandidate] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("inklusijobs_employer");
      if (raw) setProfile(JSON.parse(raw));
    } catch (err) { console.error(err); }
    setMounted(true);
  }, []);

  const handleReset = () => {
    localStorage.removeItem("inklusijobs_employer");
    router.replace("/employer/onboarding");
  };

  const handleMessage = (candidate) => {
    setMessagingCandidate(candidate);
    setActiveTab("messages");
  };

  if (!mounted) return null;

  return (
    <>
      <GlobalFont />
      <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:T.tealLight }}>
        <Sidebar active={activeTab} onTab={t => { setActiveTab(t); setMessagingCandidate(null); }} profile={profile} onReset={handleReset} />
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <TopBar activeTab={activeTab} profile={profile} />
          <main style={{ flex:1, overflowY:"auto" }}>
            {activeTab === "overview"   && <OverviewTab   profile={profile} onTab={t => { setActiveTab(t); }} onViewCandidate={setViewingCandidate} />}
            {activeTab === "candidates" && <CandidatesTab profile={profile} onViewCandidate={setViewingCandidate} onMessageCandidate={handleMessage} />}
            {activeTab === "jobs"       && <JobsTab       profile={profile} />}
            {activeTab === "profile"    && <ProfileTab    profile={profile} />}
            {activeTab === "analytics"  && <AnalyticsTab  profile={profile} />}
            {activeTab === "messages"   && <MessagesTab   initialCandidate={messagingCandidate} />}
            {activeTab === "settings"   && <SettingsTab   profile={profile} onReset={handleReset} />}
          </main>
        </div>
      </div>
      {viewingCandidate && (
        <CandidateModal
          candidate={viewingCandidate}
          onClose={() => setViewingCandidate(null)}
          onMessage={handleMessage}
        />
      )}
    </>
  );
}