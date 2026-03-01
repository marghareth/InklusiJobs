"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const ET = {
  teal:      "#0F5C6E",
  tealLight: "#E6F4F6",
  tealMid:   "#1A8FA5",
  navy:      "#0A2A35",
  bodyText:  "#1E3A45",
  muted:     "#6B8A95",
  border:    "#D0E4E8",
  bg:        "#F4F9FA",
  white:     "#FFFFFF",
  success:   "#059669",
  successBg: "#ECFDF5",
  accent:    "#7286D3",
};

const EIcon = ({ d, size = 22, color = ET.teal, strokeWidth = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

// ── FIX 1: Removed stray `s` that was after the closing `};` ─────────────────
const EICONS = {
  monitor:       "M9 17H5a2 2 0 0 0-2 2h14a2 2 0 0 0-2-2h-4M3 7h18a1 1 0 0 1 1 1v8H2V8a1 1 0 0 1 1-1Z",
  heart:         "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  barChart:      ["M12 20V10", "M18 20V4", "M6 20v-4"],
  factory:       ["M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7-7-5 5-4-3-4 3z"],
  graduationCap: ["M22 10v6M2 10l10-5 10 5-10 5z", "M6 12v5c3 3 9 3 12 0v-5"],
  retail:        ["M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17M17 13v0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-10 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"],
  media:         ["M15 10l4.55-2.5A1 1 0 0 1 21 8.5v7a1 1 0 0 1-1.45.9L15 14", "M1 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8z"],
  landmark:      ["M3 22h18M6 18V11M10 18V11M14 18V11M18 18V11M2 11l10-7 10 7"],
  nonprofit:     "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  tool:          "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  users:         ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  home:          ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  hybrid:        ["M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"],
  building:      ["M6 22V4a2 2 0 0 1 2-2h8a2 2 0 1 2 2v18Z", "M6 12H4a2 2 0 0 0-2 2v8h4", "M18 9h2a2 2 0 0 1 2 2v11h-4", "M10 6h4M10 10h4M10 14h4M10 18h4"],
  star:          "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  sparkles:      ["M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"],
  briefcase:     ["M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", "M2 9h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9z"],
  search:        ["M21 21l-4.35-4.35M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z"],
  trending:      "M22 7l-8.5 8.5-5-5L2 17",
  check:         "M20 6 9 17l-5-5",
  checkCircle:   ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4 12 14.01l-3-3"],
  gripVertical:  ["M9 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z","M15 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z","M9 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z","M15 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z","M9 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2z","M15 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"],
  heartHandshake:["M19 12c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-6z","M12 17v-3","M9 14h6"],
  target:        ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z","M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  grid:          ["M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"],
  analytics:     ["M18 20V10","M12 20V4","M6 20v-6"],
  zap:           "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
};
// ── END FIX 1 ─────────────────────────────────────────────────────────────────

const RANK_ITEMS_DEFAULT = ["Verified Skills","Portfolio Quality","Communication","Speed","Cultural Fit","Cost"];
const SKILLS_LIST = ["JavaScript","React","Python","SQL","Figma","Node.js","TypeScript","AWS","Java","PHP","Excel","Canva","Customer Service","Data Entry","Content Writing","SEO","Social Media","Bookkeeping","HR Management","Project Management"];

/* ─── Primitives ─────────────────────────────────────────────────────────── */
const Toggle = ({ checked, onChange }) => (
  <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
    style={{ width: 58, height: 32, borderRadius: 999, border: "none", cursor: "pointer", background: checked ? ET.teal : "#C4CDD6", position: "relative", transition: "background 0.25s ease", flexShrink: 0, padding: 0, outline: "none" }}>
    <span style={{
      position: "absolute", top: 3, left: checked ? 29 : 3, width: 26, height: 26,
      borderRadius: "50%", background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.22)",
      transition: "left 0.22s cubic-bezier(0.4,0,0.2,1)", display: "block"
    }} />
  </button>
);

const ToggleRow = ({ label, sublabel, checked, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", border: `2px solid ${checked ? ET.teal : ET.border}`, borderRadius: 14, background: checked ? ET.tealLight : ET.white, transition: "all 0.18s" }}>
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, color: ET.navy }}>{label}</div>
      {sublabel && <div style={{ fontSize: 13, color: ET.muted, marginTop: 3 }}>{sublabel}</div>}
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

const EChip = ({ label, selected, onToggle }) => (
  <button onClick={onToggle} aria-pressed={selected}
    style={{ padding: "10px 18px", borderRadius: 99, fontSize: 14, fontWeight: selected ? 700 : 500,
      border: `2px solid ${selected ? ET.teal : ET.border}`,
      background: selected ? ET.tealLight : ET.white,
      color: selected ? ET.teal : ET.bodyText, cursor: "pointer", transition: "all 0.15s" }}>
    {label}
  </button>
);

const EIconCard = ({ icon, label, selected, onSelect, size = "md" }) => {
  const pad = size === "sm" ? "18px 12px" : "22px 18px";
  return (
    <button onClick={onSelect} aria-pressed={selected}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 12, padding: pad, borderRadius: 16,
        border: `2px solid ${selected ? ET.teal : ET.border}`,
        background: selected ? ET.tealLight : ET.white,
        cursor: "pointer", transition: "all 0.18s",
        boxShadow: selected ? `0 0 0 4px ${ET.tealLight}` : "none" }}>
      <EIcon d={EICONS[icon]} color={selected ? ET.teal : ET.muted} size={24} />
      <span style={{ fontSize: 14, fontWeight: selected ? 700 : 600, color: selected ? ET.teal : ET.bodyText }}>{label}</span>
    </button>
  );
};

// ── FIX 2: Renamed EmpInput (was `Input`) to avoid clash with worker's TextInput ─
const EmpInput = ({ placeholder, value, onChange, multiline, rows = 4 }) => {
  const base = { width: "100%", boxSizing: "border-box", padding: "14px 18px", borderRadius: 12,
    border: `2px solid ${ET.border}`, fontSize: 15, fontFamily: "Arial, sans-serif",
    background: ET.white, color: ET.navy, outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s", resize: "none" };
  const handlers = {
    onFocus: e => { e.target.style.borderColor = ET.teal; e.target.style.boxShadow = `0 0 0 4px ${ET.tealLight}`; },
    onBlur:  e => { e.target.style.borderColor = ET.border; e.target.style.boxShadow = "none"; },
  };
  return multiline
    ? <textarea rows={rows} placeholder={placeholder} value={value} onChange={onChange} style={base} {...handlers} />
    : <input type="text" placeholder={placeholder} value={value} onChange={onChange} style={base} {...handlers} />;
};

const EmpSectionLabel = ({ children }) => (
  <div style={{ fontSize: 15, fontWeight: 800, color: ET.navy, marginBottom: 14, letterSpacing: "-0.1px" }}>{children}</div>
);

const EmpDivider = () => <div style={{ height: 1, background: ET.border, margin: "32px 0" }} />;

/* ─── LEFT SIDEBAR ───────────────────────────────────────────────────────── */
const EMP_STEPS = [
  { id: 1, label: "Company Basics",   desc: "Tell us about your company"     },
  { id: 2, label: "Hiring Needs",     desc: "What talent you're seeking"     },
  { id: 3, label: "Inclusive Hiring", desc: "Build your inclusive workplace"  },
  { id: 4, label: "Dashboard Setup",  desc: "Customize your experience"      },
];

const EmpSidebar = ({ step }) => (
  <div style={{ width: 280, flexShrink: 0, background: ET.navy, minHeight: "100vh",
    padding: "40px 28px", display: "flex", flexDirection: "column",
    position: "sticky", top: 0, height: "100vh" }}>
    <div style={{ marginBottom: 48, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: "10px 18px",
        display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <Image src="/images/logo.png" alt="InklusiJobs" width={140} height={40}
          style={{ objectFit: "contain" }} priority />
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {EMP_STEPS.map((s) => {
        const done = step > s.id;
        const active = step === s.id;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "flex-start", gap: 14,
            padding: "14px 16px", borderRadius: 12,
            background: active ? "rgba(15,92,110,0.5)" : done ? "rgba(255,255,255,0.05)" : "transparent",
            border: `1px solid ${active ? ET.tealMid : "transparent"}`, transition: "all 0.2s" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800,
              background: done ? ET.tealMid : active ? ET.teal : "rgba(255,255,255,0.1)",
              color: "#fff", border: `2px solid ${done || active ? ET.tealMid : "rgba(255,255,255,0.2)"}` }}>
              {done ? "✓" : s.id}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700,
                color: active ? "#fff" : done ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)" }}>
                {s.label}
              </div>
              <div style={{ fontSize: 12, marginTop: 2,
                color: active ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)" }}>
                {s.desc}
              </div>
            </div>
          </div>
        );
      })}
    </div>
    <div style={{ marginTop: "auto", padding: "16px", background: "rgba(15,92,110,0.3)",
      borderRadius: 12, border: "1px solid rgba(15,92,110,0.5)" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: ET.tealMid, marginBottom: 4 }}>♿ WCAG 2.1 AA Compliant</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>Built for accessibility. Inclusive by design.</div>
    </div>
  </div>
);

/* ─── STEP 1 ─────────────────────────────────────────────────────────────── */
const EmpStep1 = ({ data, set }) => {
  const [showOtherIndustry, setShowOtherIndustry] = useState(false);
  const [showCustomSize, setShowCustomSize] = useState(false);
  const [showPosSpec, setShowPosSpec] = useState(false);
  const [logoPreview, setLogoPreview] = useState(data.logoPreview || null);
  const logoInputRef = useRef(null);

  const industries = [
    { icon: "monitor",       label: "Technology"        },
    { icon: "heart",         label: "Healthcare"        },
    { icon: "barChart",      label: "Finance"           },
    { icon: "retail",        label: "Retail"            },
    { icon: "factory",       label: "Manufacturing"     },
    { icon: "graduationCap", label: "Education"         },
    { icon: "media",         label: "Media & Creative"  },
    { icon: "landmark",      label: "Government"        },
    { icon: "nonprofit",     label: "Non-profit"        },
    { icon: "tool",          label: "Construction"      },
    { icon: "zap",           label: "Energy & Utilities"},
    { icon: "trending",      label: "Logistics"         },
    { icon: "users",         label: "Human Resources"   },
    { icon: "briefcase",     label: "Legal"             },
    { icon: "home",          label: "Real Estate"       },
    { icon: "sparkles",      label: "Tourism & Hotels"  },
    { icon: "star",          label: "Food & Beverage"   },
    { icon: "grid",          label: "Other"             },
  ];

  const sizes = ["1–10","11–50","51–200","201–500","501–1000","1001–5000","5000+"];
  const posTypes = ["Full-time","Part-time","Contract","Freelance","Internship","Apprenticeship","Seasonal","Project-based","Volunteer","Commission-based","Remote-only","Hybrid","On-call","Job Share","Temporary"];

  const togglePos = (t) => {
    const c = data.posTypes || [];
    set({ ...data, posTypes: c.includes(t) ? c.filter(x => x !== t) : [...c, t] });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("File too large. Please upload an image under 2MB."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const preview = ev.target.result;
      setLogoPreview(preview);
      set({ ...data, logoPreview: preview, logoFile: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleLogoDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleLogoUpload({ target: { files: [file] } });
  };

  return (
    <div>
      <h2 style={{ fontSize: 42, fontWeight: 900, color: ET.navy, margin: "0 0 8px", letterSpacing: "-1px" }}>Build your <strong style={{ color: ET.teal }}>hiring profile</strong></h2>
      <p style={{ fontSize: 15, color: ET.muted, margin: "0 0 32px" }}>Let's start with your <strong>company basics</strong></p>

      <EmpSectionLabel>Company Name</EmpSectionLabel>
      <EmpInput placeholder="e.g., InklusiJobs" value={data.company} onChange={e => set({ ...data, company: e.target.value })} />

      <EmpDivider />

      <EmpSectionLabel>What <strong style={{ color: ET.teal }}>industry</strong> are you in?</EmpSectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 8 }}>
        {industries.map(ind => (
          <EIconCard key={ind.label} icon={ind.icon} label={ind.label}
            selected={data.industry === ind.label}
            onSelect={() => {
              if (ind.label === "Other") { setShowOtherIndustry(true); set({ ...data, industry: "Other" }); }
              else { setShowOtherIndustry(false); set({ ...data, industry: ind.label, industryOther: "" }); }
            }} />
        ))}
      </div>
      {(showOtherIndustry || data.industry === "Other") && (
        <input autoFocus placeholder="Please specify your industry..."
          value={data.industryOther || ""}
          onChange={e => set({ ...data, industry: "Other", industryOther: e.target.value })}
          style={{ width: "100%", boxSizing: "border-box", padding: "13px 16px", borderRadius: 12,
            border: `2px solid ${ET.teal}`, fontSize: 15, fontFamily: "Arial, sans-serif",
            background: ET.tealLight, color: ET.navy, outline: "none", marginTop: 8 }}
        />
      )}

      <EmpDivider />

      <EmpSectionLabel>Company <strong style={{ color: ET.teal }}>size</strong></EmpSectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 12 }}>
        {sizes.map(s => (
          <button key={s} onClick={() => { setShowCustomSize(false); set({ ...data, size: s }); }}
            style={{ padding: "14px 10px", borderRadius: 12,
              border: `2px solid ${data.size === s ? ET.teal : ET.border}`,
              background: data.size === s ? ET.tealLight : ET.white,
              color: data.size === s ? ET.teal : ET.bodyText,
              fontSize: 13, fontWeight: data.size === s ? 800 : 600, cursor: "pointer", transition: "all 0.15s" }}>
            {s}
          </button>
        ))}
      </div>
      <button onClick={() => { setShowCustomSize(v => !v); if (!showCustomSize) set({ ...data, size: "Custom" }); }}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 18px", borderRadius: 10,
          border: `2px solid ${showCustomSize ? ET.teal : ET.border}`,
          background: showCustomSize ? ET.tealLight : ET.white,
          color: showCustomSize ? ET.teal : ET.muted, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
        ✏️ Specify exact size
      </button>
      {showCustomSize && (
        <input autoFocus
          placeholder="e.g., Exactly 350 employees, or a specific department size..."
          value={data.sizeCustom || ""}
          onChange={e => set({ ...data, size: "Custom", sizeCustom: e.target.value })}
          style={{ width: "100%", boxSizing: "border-box", padding: "13px 16px", borderRadius: 12,
            border: `2px solid ${ET.teal}`, fontSize: 15, fontFamily: "Arial, sans-serif",
            background: ET.tealLight, color: ET.navy, outline: "none", marginTop: 10 }}
        />
      )}

      <EmpDivider />

      <EmpSectionLabel>What types of <strong style={{ color: ET.teal }}>positions</strong> do you hire for? <span style={{ fontWeight: 500, color: ET.muted, fontSize: 13 }}>(Select all that apply)</span></EmpSectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        {posTypes.map(t => <EChip key={t} label={t} selected={(data.posTypes || []).includes(t)} onToggle={() => togglePos(t)} />)}
      </div>
      <button onClick={() => setShowPosSpec(v => !v)}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 18px", borderRadius: 10,
          border: `2px solid ${showPosSpec ? ET.teal : ET.border}`,
          background: showPosSpec ? ET.tealLight : ET.white,
          color: showPosSpec ? ET.teal : ET.muted, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
        📋 Add specific position details
      </button>
      {showPosSpec && (
        <textarea autoFocus rows={4}
          placeholder="Describe specific position requirements, e.g.: 'We need 3 senior React developers and 2 UX designers for a fintech project starting Q2...'"
          value={data.posSpec || ""}
          onChange={e => set({ ...data, posSpec: e.target.value })}
          style={{ width: "100%", boxSizing: "border-box", padding: "13px 16px", borderRadius: 12,
            border: `2px solid ${ET.teal}`, fontSize: 15, fontFamily: "Arial, sans-serif",
            background: ET.tealLight, color: ET.navy, outline: "none", resize: "vertical", marginTop: 10 }}
        />
      )}

      <EmpDivider />

      <EmpSectionLabel>Company Logo <span style={{ fontWeight: 500, color: ET.muted, fontSize: 13 }}>(Optional)</span></EmpSectionLabel>
      <input ref={logoInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml"
        style={{ display: "none" }} onChange={handleLogoUpload} />
      {logoPreview ? (
        <div style={{ border: `2px solid ${ET.teal}`, borderRadius: 14, padding: "24px", textAlign: "center", background: ET.tealLight }}>
          <img src={logoPreview} alt="Company logo preview"
            style={{ maxHeight: 100, maxWidth: "100%", objectFit: "contain", borderRadius: 8 }} />
          <div style={{ marginTop: 12, fontSize: 13, color: ET.teal, fontWeight: 700 }}>✓ Logo uploaded successfully</div>
          <button onClick={() => { setLogoPreview(null); set({ ...data, logoPreview: null, logoFile: null }); }}
            style={{ marginTop: 8, background: "none", border: `1.5px solid ${ET.teal}`, borderRadius: 8,
              color: ET.teal, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "6px 14px" }}>
            Remove &amp; re-upload
          </button>
        </div>
      ) : (
        <div onClick={() => logoInputRef.current?.click()} onDrop={handleLogoDrop}
          onDragOver={e => e.preventDefault()}
          style={{ border: `2px dashed ${ET.border}`, borderRadius: 14, padding: "36px 24px",
            textAlign: "center", background: ET.bg, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = ET.teal; e.currentTarget.style.background = ET.tealLight; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = ET.border; e.currentTarget.style.background = ET.bg; }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={ET.muted}
            strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: 12 }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          <div>
            <span style={{ color: ET.teal, fontWeight: 700, fontSize: 15 }}>Click to upload logo</span>
            <span style={{ color: ET.muted, fontSize: 15 }}> or drag and drop</span>
          </div>
          <div style={{ fontSize: 13, color: ET.muted, marginTop: 6 }}>PNG, JPG, SVG up to 2MB</div>
        </div>
      )}
    </div>
  );
};

/* ─── STEP 2 ─────────────────────────────────────────────────────────────── */
const EmpStep2 = ({ data, set }) => {
  const roles = ["Software Developer","Designer","Product Manager","Data Analyst","Marketing Specialist","Customer Support","Sales Representative","HR Manager","Content Writer","DevOps Engineer"];
  const workSetup = [
    { icon: "home",     label: "Remote"  },
    { icon: "hybrid",   label: "Hybrid"  },
    { icon: "building", label: "On-site" },
  ];
  const budgets = ["< ₱20k","₱20k–₱40k","₱40k–₱80k","₱80k–₱150k","₱150k+","Negotiable"];
  const frequencies = ["Occasional","Regular","Frequent","Ongoing"];
  const urgencies = ["Low","Medium","High","Urgent"];
  const expLevels = ["Entry","Junior","Mid-Level","Senior","Lead/Manager"];

  const [skillSearch, setSkillSearch] = useState("");
  const [aiSkills, setAiSkills] = useState(false);
  const [showCustomRole, setShowCustomRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState("");

  const filtered = skillSearch.length === 0 ? [] : (() => {
    const q = skillSearch.toLowerCase();
    const notAdded = SKILLS_LIST.filter(s => !(data.skills || []).includes(s));
    const startsWith = notAdded.filter(s => s.toLowerCase().startsWith(q));
    const contains   = notAdded.filter(s => !s.toLowerCase().startsWith(q) && s.toLowerCase().includes(q));
    return [...startsWith, ...contains].slice(0, 8);
  })();

  const toggleRole = (r) => { const c = data.roles || []; set({ ...data, roles: c.includes(r) ? c.filter(x => x !== r) : [...c, r] }); };
  const addSkill   = (s) => { if (!(data.skills || []).includes(s)) { set({ ...data, skills: [...(data.skills || []), s] }); setSkillSearch(""); } };
  const removeSkill = (s) => set({ ...data, skills: (data.skills || []).filter(x => x !== s) });
  const expIdx = expLevels.indexOf(data.expLevel || "Mid-Level");

  const addCustomRole = () => {
    const r = customRoleInput.trim();
    if (!r) return;
    const c = data.roles || [];
    if (!c.includes(r)) set({ ...data, roles: [...c, r] });
    setCustomRoleInput("");
    setShowCustomRole(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: 30, fontWeight: 900, color: ET.navy, margin: "0 0 6px", letterSpacing: "-0.5px" }}>What are you <strong style={{ color: ET.teal }}>looking for?</strong></h2>
      <p style={{ fontSize: 15, color: ET.muted, margin: "0 0 32px" }}>Help us <strong>match you</strong> with the right talent</p>

      <EmpSectionLabel>What <strong style={{ color: ET.teal }}>roles</strong> do you typically hire for?</EmpSectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        {roles.map(r => <EChip key={r} label={r} selected={(data.roles || []).includes(r)} onToggle={() => toggleRole(r)} />)}
        {(data.roles || []).filter(r => !roles.includes(r)).map(r => (
          <span key={r} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px",
            borderRadius: 99, fontSize: 14, fontWeight: 700,
            border: `2px solid ${ET.teal}`, background: ET.tealLight, color: ET.teal }}>
            {r}
            <button onClick={() => toggleRole(r)} style={{ background: "none", border: "none", cursor: "pointer", color: ET.teal, fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
          </span>
        ))}
      </div>
      {showCustomRole ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
          <input autoFocus
            placeholder="Type a custom role, e.g. Accessibility Consultant..."
            value={customRoleInput}
            onChange={e => setCustomRoleInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addCustomRole(); if (e.key === "Escape") { setShowCustomRole(false); setCustomRoleInput(""); } }}
            style={{ flex: 1, padding: "11px 16px", borderRadius: 12, border: `2px solid ${ET.teal}`,
              fontSize: 15, fontFamily: "Arial, sans-serif", background: ET.tealLight, color: ET.navy, outline: "none" }}
          />
          <button onClick={addCustomRole}
            style={{ padding: "11px 18px", borderRadius: 12, border: "none", background: ET.teal, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Add
          </button>
          <button onClick={() => { setShowCustomRole(false); setCustomRoleInput(""); }}
            style={{ padding: "11px 14px", borderRadius: 12, border: `2px solid ${ET.border}`, background: ET.white, color: ET.muted, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setShowCustomRole(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 18px", borderRadius: 10,
            border: `2px solid ${ET.border}`, background: ET.white, color: ET.muted, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          ＋ Add custom role
        </button>
      )}

      <EmpDivider />

      <EmpSectionLabel>Required <strong style={{ color: ET.teal }}>skills</strong></EmpSectionLabel>
      <div style={{ position: "relative", marginBottom: 12 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ET.muted} strokeWidth="2"
          style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input placeholder="Search for skills..." value={skillSearch} onChange={e => setSkillSearch(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", padding: "13px 16px 13px 44px", borderRadius: 12,
            border: `2px solid ${ET.border}`, fontSize: 15, fontFamily: "Arial, sans-serif", background: ET.white, outline: "none" }}
          onFocus={e => { e.target.style.borderColor = ET.teal; e.target.style.boxShadow = `0 0 0 4px ${ET.tealLight}`; }}
          onBlur={e => { setTimeout(() => setSkillSearch(""), 150); e.target.style.borderColor = ET.border; e.target.style.boxShadow = "none"; }} />
        {skillSearch && filtered.length > 0 && (
          <div style={{ position: "absolute", top: "110%", left: 0, right: 0, background: ET.white,
            border: `2px solid ${ET.border}`, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 10, overflow: "hidden" }}>
            {filtered.map((s, idx) => {
              const q = skillSearch.toLowerCase();
              const isStartMatch = s.toLowerCase().startsWith(q);
              return (
                <button key={s} onMouseDown={() => addSkill(s)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", textAlign: "left", padding: "11px 18px", background: "none", border: "none",
                    borderBottom: idx < filtered.length - 1 ? `1px solid ${ET.border}` : "none",
                    cursor: "pointer", fontSize: 14, color: ET.bodyText, fontFamily: "Arial, sans-serif" }}
                  onMouseEnter={e => e.currentTarget.style.background = ET.tealLight}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  <span>
                    <strong style={{ color: ET.teal }}>{s.slice(0, skillSearch.length)}</strong>{s.slice(skillSearch.length)}
                  </span>
                  {isStartMatch && <span style={{ fontSize: 11, color: ET.teal, fontWeight: 700, background: ET.tealLight, padding: "2px 7px", borderRadius: 99 }}>Best match</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {(data.skills || []).length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {(data.skills || []).map(s => (
            <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px",
              background: ET.tealLight, borderRadius: 99, fontSize: 13, fontWeight: 700,
              color: ET.teal, border: `1.5px solid ${ET.teal}55` }}>
              {s}
              <button onClick={() => removeSkill(s)} style={{ background: "none", border: "none", cursor: "pointer", color: ET.teal, fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
            </span>
          ))}
        </div>
      )}
      <button onClick={() => { setAiSkills(true); set({ ...data, skills: [...new Set([...(data.skills || []), "JavaScript", "Communication", "Problem Solving", "Accessibility", "Teamwork"])] }); }}
        style={{ width: "100%", padding: "13px 18px", borderRadius: 12, border: `2px solid ${ET.teal}`,
          background: ET.tealLight, color: ET.teal, fontSize: 15, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <EIcon d={EICONS.sparkles} size={18} color={ET.teal} />
        {aiSkills ? "✓ AI skills added" : "Add AI-suggested skills"}
      </button>

      <EmpDivider />

      <EmpSectionLabel>Experience expectation: <strong style={{ color: ET.teal }}>{data.expLevel || "Mid-Level"}</strong></EmpSectionLabel>
      <input type="range" min={0} max={4} step={1} value={expIdx < 0 ? 2 : expIdx}
        onChange={e => set({ ...data, expLevel: expLevels[e.target.value] })}
        style={{ width: "100%", accentColor: ET.teal, cursor: "pointer", height: 6 }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        {["Entry","Junior","Mid-Level","Senior","Lead/Manager"].map(l => (
          <span key={l} style={{ fontSize: 12, color: ET.muted, fontWeight: 600 }}>{l}</span>
        ))}
      </div>

      <EmpDivider />

      <EmpSectionLabel>Work <strong style={{ color: ET.teal }}>setup</strong></EmpSectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {workSetup.map(w => <EIconCard key={w.label} icon={w.icon} label={w.label} selected={data.workSetup === w.label} onSelect={() => set({ ...data, workSetup: w.label })} />)}
      </div>

      <EmpDivider />

      <EmpSectionLabel>💰 Budget range <strong style={{ color: ET.teal }}>(monthly)</strong></EmpSectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {budgets.map(b => <EChip key={b} label={b} selected={data.budget === b} onToggle={() => set({ ...data, budget: b })} />)}
      </div>

      <EmpDivider />

      <EmpSectionLabel>📅 Hiring <strong style={{ color: ET.teal }}>frequency</strong></EmpSectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {frequencies.map(f => <EChip key={f} label={f} selected={data.frequency === f} onToggle={() => set({ ...data, frequency: f })} />)}
      </div>

      <EmpDivider />

      <EmpSectionLabel>⚡ Urgency <strong style={{ color: ET.teal }}>level</strong></EmpSectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {urgencies.map(u => <EChip key={u} label={u} selected={data.urgency === u} onToggle={() => set({ ...data, urgency: u })} />)}
      </div>
    </div>
  );
};

/* ─── STEP 3 ─────────────────────────────────────────────────────────────── */
const EmpStep3 = ({ data, set }) => {
  const accommodations = ["Wheelchair Accessible","Flexible Hours","Remote Work Options","Assistive Technology","Sign Language Interpreter","Quiet Workspace","Screen Readers","Ergonomic Equipment","Braille Materials","Dedicated Parking","Modified Duties","Job Coaching"];
  const sortOptions = [
    { icon: "checkCircle", label: "Highest Verification Score" },
    { icon: "star",        label: "Best Skill Match %"         },
    { icon: "trending",    label: "Recently Active"            },
    { icon: "briefcase",   label: "Portfolio Strength"         },
  ];
  const [rankItems, setRankItems] = useState(data.rankItems || RANK_ITEMS_DEFAULT);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [showCustomAccom, setShowCustomAccom] = useState(false);
  const [customAccomInput, setCustomAccomInput] = useState("");

  const toggleAccom = (a) => { const c = data.accommodations || []; set({ ...data, accommodations: c.includes(a) ? c.filter(x => x !== a) : [...c, a] }); };

  const addCustomAccom = () => {
    const a = customAccomInput.trim();
    if (!a) return;
    const c = data.accommodations || [];
    if (!c.includes(a)) set({ ...data, accommodations: [...c, a] });
    setCustomAccomInput("");
    setShowCustomAccom(false);
  };

  const handleDragDrop = (i) => {
    if (dragging === null || dragging === i) { setDragging(null); setDragOver(null); return; }
    const newItems = [...rankItems];
    const [moved] = newItems.splice(dragging, 1);
    newItems.splice(i, 0, moved);
    setRankItems(newItems); set({ ...data, rankItems: newItems }); setDragging(null); setDragOver(null);
  };

  return (
    <div>
      <h2 style={{ fontSize: 30, fontWeight: 900, color: ET.navy, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Build an <strong style={{ color: ET.teal }}>inclusive workplace</strong></h2>
      <p style={{ fontSize: 15, color: ET.muted, margin: "0 0 32px" }}>Your <strong>hiring preferences</strong> and evaluation criteria</p>

      <EmpSectionLabel>What <strong style={{ color: ET.teal }}>workplace accommodations</strong> can you provide?</EmpSectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        {accommodations.map(a => <EChip key={a} label={a} selected={(data.accommodations || []).includes(a)} onToggle={() => toggleAccom(a)} />)}
        {(data.accommodations || []).filter(a => !accommodations.includes(a)).map(a => (
          <span key={a} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px",
            borderRadius: 99, fontSize: 14, fontWeight: 700,
            border: `2px solid ${ET.teal}`, background: ET.tealLight, color: ET.teal }}>
            {a}
            <button onClick={() => toggleAccom(a)} style={{ background: "none", border: "none", cursor: "pointer", color: ET.teal, fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
          </span>
        ))}
      </div>
      {showCustomAccom ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
          <input autoFocus
            placeholder="Describe a specific accommodation you can offer..."
            value={customAccomInput}
            onChange={e => setCustomAccomInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addCustomAccom(); if (e.key === "Escape") { setShowCustomAccom(false); setCustomAccomInput(""); } }}
            style={{ flex: 1, padding: "11px 16px", borderRadius: 12, border: `2px solid ${ET.teal}`,
              fontSize: 15, fontFamily: "Arial, sans-serif", background: ET.tealLight, color: ET.navy, outline: "none" }}
          />
          <button onClick={addCustomAccom}
            style={{ padding: "11px 18px", borderRadius: 12, border: "none", background: ET.teal, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Add
          </button>
          <button onClick={() => { setShowCustomAccom(false); setCustomAccomInput(""); }}
            style={{ padding: "11px 14px", borderRadius: 12, border: `2px solid ${ET.border}`, background: ET.white, color: ET.muted, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setShowCustomAccom(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 18px", borderRadius: 10,
            border: `2px solid ${ET.border}`, background: ET.white, color: ET.muted, fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>
          ＋ Add custom accommodation
        </button>
      )}

      <ToggleRow label="Get inclusive hiring guidance" sublabel="Receive tips and best practices for building diverse, inclusive teams" checked={data.inclusiveGuidance !== false} onChange={v => set({ ...data, inclusiveGuidance: v })} />

      <EmpDivider />

      <EmpSectionLabel>Rank what <strong style={{ color: ET.teal }}>matters most</strong> when hiring</EmpSectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
        {rankItems.map((item, i) => (
          <div key={item} draggable
            onDragStart={() => setDragging(i)}
            onDragOver={e => { e.preventDefault(); setDragOver(i); }}
            onDrop={() => handleDragDrop(i)}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
              background: dragOver === i ? ET.tealLight : ET.white,
              border: `2px solid ${dragOver === i ? ET.teal : ET.border}`,
              borderRadius: 14, cursor: "grab", transition: "all 0.15s", userSelect: "none" }}>
            <EIcon d={EICONS.gripVertical} size={18} color={ET.muted} />
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: ET.teal,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{i + 1}</div>
            <span style={{ fontSize: 15, fontWeight: 600, color: ET.bodyText }}>{item}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: ET.muted, textAlign: "center" }}>Drag and drop to rank what matters most</p>

      <EmpDivider />

      <EmpSectionLabel>How should we <strong style={{ color: ET.teal }}>sort candidates</strong> for you?</EmpSectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {sortOptions.map(s => (
          <EIconCard key={s.label} icon={s.icon} label={s.label}
            selected={(data.sortBy || []).includes(s.label)}
            onSelect={() => { const c = data.sortBy || []; set({ ...data, sortBy: c.includes(s.label) ? c.filter(x => x !== s.label) : [...c, s.label] }); }} />
        ))}
      </div>

      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
        <ToggleRow label="AI auto-suggested candidates" sublabel="Get daily candidate recommendations based on your preferences" checked={data.aiSuggest !== false} onChange={v => set({ ...data, aiSuggest: v })} />
        <ToggleRow label="Notification preferences" sublabel="Get notified when new matching candidates join" checked={data.notifications !== false} onChange={v => set({ ...data, notifications: v })} />
      </div>
    </div>
  );
};

/* ─── STEP 4 ─────────────────────────────────────────────────────────────── */
const EmpStep4 = ({ data, set }) => {
  const dashboardFirst = [
    { icon: "sparkles",  label: "Candidate Recommendations" },
    { icon: "briefcase", label: "Job Posts"                 },
    { icon: "search",    label: "Talent Search"             },
    { icon: "analytics", label: "Analytics"                 },
  ];
  const toggleFirst = (label) => { const c = data.dashFirst || []; set({ ...data, dashFirst: c.includes(label) ? c.filter(x => x !== label) : [...c, label] }); };

  return (
    <div>
      <h2 style={{ fontSize: 30, fontWeight: 900, color: ET.navy, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Customize your <strong style={{ color: ET.teal }}>dashboard</strong></h2>
      <p style={{ fontSize: 15, color: ET.muted, margin: "0 0 32px" }}>Set up your preferred <strong>hiring workflow</strong></p>

      <EmpSectionLabel>What would you like to see <strong style={{ color: ET.teal }}>first</strong> on your dashboard?</EmpSectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {dashboardFirst.map(d => (
          <EIconCard key={d.label} icon={d.icon} label={d.label}
            selected={(data.dashFirst || []).includes(d.label)}
            onSelect={() => toggleFirst(d.label)} size="sm" />
        ))}
      </div>

      <EmpDivider />

      <EmpSectionLabel>Company <strong style={{ color: ET.teal }}>mission statement</strong> <span style={{ fontWeight: 500, color: ET.muted, fontSize: 13 }}>(Optional)</span></EmpSectionLabel>
      <EmpInput multiline rows={5}
        placeholder="Share your company's values and what makes your workplace special..."
        value={data.mission || ""} onChange={e => set({ ...data, mission: e.target.value })} />
      <p style={{ fontSize: 13, color: ET.muted, marginTop: 8 }}>This will be shown to candidates viewing your profile</p>

      <EmpDivider />

      <ToggleRow label="Profile visibility" sublabel="Your company profile is visible to all candidates" checked={data.visible !== false} onChange={v => set({ ...data, visible: v })} />

      <div style={{ marginTop: 24, padding: "22px 24px", background: ET.tealLight, borderRadius: 16, border: `2px solid ${ET.teal}33` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <EIcon d={EICONS.grid} size={20} color={ET.teal} />
          <span style={{ fontSize: 16, fontWeight: 800, color: ET.navy }}>Your dashboard will include:</span>
        </div>
        {["AI-powered candidate matching based on your preferences","Inclusive Employer badge on your profile","Custom job templates tailored to your industry","Analytics on your hiring diversity metrics"].map(item => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ color: ET.teal, fontSize: 16 }}>✓</span>
            <span style={{ fontSize: 14, color: ET.teal, fontWeight: 600 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── COMPLETE SCREEN ────────────────────────────────────────────────────── */
const EmpCompleteScreen = () => (
  <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
    <EmpSidebar step={5} />
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: ET.bg, padding: "40px" }}>
      <div style={{ width: "100%", maxWidth: 600, background: ET.white, borderRadius: 24,
        padding: "56px 48px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", textAlign: "center" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%",
          background: `linear-gradient(135deg, ${ET.teal}, ${ET.tealMid})`,
          margin: "0 auto 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <EIcon d={EICONS.check} size={40} color="#fff" strokeWidth={2.5} />
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: ET.navy, margin: "0 0 14px", letterSpacing: "-0.5px" }}>
          Your <strong style={{ color: ET.teal }}>Inclusive Hiring Dashboard</strong> is Ready! 🎉
        </h2>
        <p style={{ fontSize: 16, color: ET.muted, margin: "0 0 36px", lineHeight: 1.7 }}>
          You're all set to discover amazing talent and <strong>build a more inclusive team.</strong>
        </p>
        <a href="/employer/dashboard"
          style={{ display: "inline-block", padding: "16px 44px", borderRadius: 14,
            background: `linear-gradient(135deg, ${ET.teal}, ${ET.tealMid})`,
            color: "#fff", fontSize: 16, fontWeight: 800, textDecoration: "none",
            boxShadow: `0 8px 24px ${ET.teal}55`, letterSpacing: "-0.2px" }}>
          Go to Dashboard →
        </a>
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <EIcon d={EICONS.checkCircle} size={18} color={ET.success} />
          <span style={{ fontSize: 14, color: ET.success, fontWeight: 700 }}>Inclusive Employer Badge earned!</span>
        </div>
      </div>
    </div>
  </div>
);

/* ─── MAIN WIZARD ────────────────────────────────────────────────────────── */
export default function EmployerOnboarding() {
  const [step, setStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const contentRef = useRef(null);

  const [s1, setS1] = useState({ company: "", industry: "", size: "", posTypes: [] });
  const [s2, setS2] = useState({ roles: [], skills: [], expLevel: "Mid-Level", workSetup: "Remote", budget: "", frequency: "", urgency: "" });
  const [s3, setS3] = useState({ pwdOpenness: "Actively Looking", accommodations: [], inclusiveGuidance: true, rankItems: RANK_ITEMS_DEFAULT, sortBy: [], aiSuggest: true, notifications: true });
  const [s4, setS4] = useState({ dashFirst: ["Candidate Recommendations","Job Posts"], mission: "", visible: true });

  const canNext = () => {
    if (step === 1) return s1.company.trim().length > 0 && s1.industry;
    return true;
  };

  const handleStep = (dir) => {
    if (dir > 0 && !canNext()) return;
    setStep(s => s + dir);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleComplete = () => {
    let authUser = {};
    try { authUser = JSON.parse(localStorage.getItem("ij_current_user") || "{}"); } catch {}
    const profile = {
      s1: { ...s1, firstName: authUser.firstName || "", lastName: authUser.lastName || "", email: authUser.email || "" },
      s2, s3, s4,
      s5: { theme: "navy", layout: "Comfortable", widgets: s4.dashFirst || [], teammates: [] },
      completedAt: Date.now()
    };
    localStorage.setItem("inklusijobs_employer", JSON.stringify(profile));
    setComplete(true);
  };

  if (complete) return <EmpCompleteScreen />;

  const pct = (step / EMP_STEPS.length) * 100;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <EmpSidebar step={step} />

      <div ref={contentRef} style={{ flex: 1, overflowY: "auto", background: ET.bg, display: "flex", flexDirection: "column" }}>
        {/* Top progress bar */}
        <div style={{ height: 5, background: ET.border, flexShrink: 0 }}>
          <div style={{ height: "100%", width: `${pct}%`,
            background: `linear-gradient(90deg, ${ET.teal}, ${ET.tealMid})`,
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>

        {/* Step header */}
        <div style={{ padding: "32px 56px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: ET.muted }}>
            Step {step} of {EMP_STEPS.length} — <strong style={{ color: ET.teal }}>{Math.round(pct)}% complete</strong>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {EMP_STEPS.map(s => (
              <div key={s.id} style={{ width: step >= s.id ? 28 : 8, height: 8, borderRadius: 99,
                background: step >= s.id ? ET.teal : ET.border, transition: "all 0.3s" }} />
            ))}
          </div>
        </div>

        {/* Form content */}
        <div style={{ flex: 1, padding: "32px 56px 0" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            {step === 1 && <EmpStep1 data={s1} set={setS1} />}
            {step === 2 && <EmpStep2 data={s2} set={setS2} />}
            {step === 3 && <EmpStep3 data={s3} set={setS3} />}
            {step === 4 && <EmpStep4 data={s4} set={setS4} />}
          </div>
        </div>

        {/* Footer nav */}
        <div style={{ position: "sticky", bottom: 0, background: ET.white,
          borderTop: `1px solid ${ET.border}`, padding: "20px 56px",
          display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
          <button onClick={() => handleStep(-1)} disabled={step === 1}
            style={{ padding: "12px 24px", borderRadius: 12, border: `2px solid ${ET.border}`,
              background: ET.white, color: step === 1 ? ET.muted : ET.bodyText,
              fontSize: 15, fontWeight: 700, cursor: step === 1 ? "not-allowed" : "pointer",
              opacity: step === 1 ? 0.4 : 1, fontFamily: "Arial, sans-serif" }}>
            ‹ Back
          </button>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {step === 2 && (
              <button onClick={() => handleStep(1)}
                style={{ padding: "12px 24px", borderRadius: 12, border: `2px solid ${ET.border}`,
                  background: ET.white, color: ET.muted, fontSize: 15, fontWeight: 700,
                  cursor: "pointer", fontFamily: "Arial, sans-serif" }}>
                Skip ⏭
              </button>
            )}
            {step < 4 ? (
              <button onClick={() => handleStep(1)}
                style={{ padding: "12px 28px", borderRadius: 12, border: "none",
                  background: canNext() ? `linear-gradient(135deg, ${ET.teal}, ${ET.tealMid})` : ET.border,
                  color: canNext() ? "#fff" : ET.muted,
                  fontSize: 15, fontWeight: 800, cursor: canNext() ? "pointer" : "not-allowed",
                  boxShadow: canNext() ? `0 6px 18px ${ET.teal}44` : "none",
                  transition: "all 0.2s", fontFamily: "Arial, sans-serif" }}>
                Continue ›
              </button>
            ) : (
              <button onClick={handleComplete}
                style={{ padding: "12px 28px", borderRadius: 12, border: "none",
                  background: `linear-gradient(135deg, ${ET.teal}, ${ET.tealMid})`,
                  color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer",
                  boxShadow: `0 6px 18px ${ET.teal}44`, fontFamily: "Arial, sans-serif" }}>
                Complete Setup ›
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}