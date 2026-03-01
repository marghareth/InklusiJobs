"use client";

import { useState, useRef } from "react";
import Image from "next/image";

// ── Design tokens (matching employer onboarding) ──────────────────────────────
const T = {
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
  error:     "#DC2626",
};

// ── SVG Icon system (matching employer) ───────────────────────────────────────
const Icon = ({ d, size = 22, color = T.teal, strokeWidth = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  user:        ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  briefcase:   ["M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", "M2 9h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9z"],
  heart:       "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  accessibility:"M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM12 22v-8m0 0l-2-4m2 4l2-4m-6.5 0h9",
  palette:     ["M12 2a10 10 0 1 0 0 20","M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0"],
  home:        ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  building:    ["M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", "M10 6h4", "M10 10h4", "M10 14h4"],
  wifi:        ["M5 12.55a11 11 0 0 1 14.08 0", "M1.42 9a16 16 0 0 1 21.16 0", "M8.53 16.11a6 6 0 0 1 6.95 0", "M12 20h.01"],
  monitor:     "M9 17H5a2 2 0 0 0-2 2h14a2 2 0 0 0-2-2h-4M3 7h18a1 1 0 0 1 1 1v8H2V8a1 1 0 0 1 1-1Z",
  clock:       ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
  target:      ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  zap:         "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  star:        "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  sparkles:    ["M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"],
  check:       "M20 6 9 17l-5-5",
  checkCircle: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4 12 14.01l-3-3"],
  lock:        ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
  grid:        ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],
  trending:    "M22 7l-8.5 8.5-5-5L2 17",
  search:      ["M21 21l-4.35-4.35", "M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z"],
  eye:         ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0"],
  eyeOff:      ["M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24", "M1 1l22 22"],
  map:         ["M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z", "M8 2v16", "M16 6v16"],
  book:        ["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"],
  layout:      ["M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z", "M3 9h18", "M9 21V9"],
  bell:        ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  phone:       "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  mail:        ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"],
  analytics:   ["M18 20V10", "M12 20V4", "M6 20v-6"],
};

// ── Steps config ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Basic Info",      desc: "Your personal details"       },
  { id: 2, label: "Work Preference", desc: "Your ideal work setup"       },
  { id: 3, label: "Disability Info", desc: "Accommodations & support"    },
  { id: 4, label: "Dashboard",       desc: "Personalize your experience" },
];

// ── Shared primitives ─────────────────────────────────────────────────────────
const Chip = ({ label, selected, onToggle }) => (
  <button onClick={onToggle} aria-pressed={selected}
    style={{ padding: "10px 18px", borderRadius: 99, fontSize: 14, fontWeight: selected ? 700 : 500,
      border: `2px solid ${selected ? T.teal : T.border}`,
      background: selected ? T.tealLight : T.white,
      color: selected ? T.teal : T.bodyText, cursor: "pointer", transition: "all 0.15s" }}>
    {label}
  </button>
);

const IconCard = ({ icon, label, selected, onSelect }) => (
  <button onClick={onSelect} aria-pressed={selected}
    style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 12, padding: "22px 18px", borderRadius: 16,
      border: `2px solid ${selected ? T.teal : T.border}`,
      background: selected ? T.tealLight : T.white,
      cursor: "pointer", transition: "all 0.18s",
      boxShadow: selected ? `0 0 0 4px ${T.tealLight}` : "none" }}>
    <Icon d={ICONS[icon]} color={selected ? T.teal : T.muted} size={24} />
    <span style={{ fontSize: 14, fontWeight: selected ? 700 : 600, color: selected ? T.teal : T.bodyText }}>{label}</span>
  </button>
);

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 15, fontWeight: 800, color: T.navy, marginBottom: 14 }}>{children}</div>
);

const Divider = () => <div style={{ height: 1, background: T.border, margin: "32px 0" }} />;

const TextInput = ({ placeholder, value, onChange, type = "text", min, max }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange} min={min} max={max}
    style={{ width: "100%", boxSizing: "border-box", padding: "14px 18px", borderRadius: 12,
      border: `2px solid ${T.border}`, fontSize: 15, fontFamily: "inherit",
      background: T.white, color: T.navy, outline: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
    onFocus={e => { e.target.style.borderColor = T.teal; e.target.style.boxShadow = `0 0 0 4px ${T.tealLight}`; }}
    onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
  />
);

const SelectInput = ({ options, value, onChange }) => (
  <select value={value} onChange={onChange}
    style={{ width: "100%", boxSizing: "border-box", padding: "14px 18px", borderRadius: 12,
      border: `2px solid ${T.border}`, fontSize: 15, fontFamily: "inherit",
      background: T.white, color: value && !value.startsWith("Select") ? T.navy : T.muted,
      outline: "none", cursor: "pointer", transition: "border-color 0.2s, box-shadow 0.2s" }}
    onFocus={e => { e.target.style.borderColor = T.teal; e.target.style.boxShadow = `0 0 0 4px ${T.tealLight}`; }}
    onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const TextArea = ({ placeholder, value, onChange, rows = 4 }) => (
  <textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows}
    style={{ width: "100%", boxSizing: "border-box", padding: "14px 18px", borderRadius: 12,
      border: `2px solid ${T.border}`, fontSize: 15, fontFamily: "inherit",
      background: T.white, color: T.navy, outline: "none", resize: "none",
      transition: "border-color 0.2s, box-shadow 0.2s" }}
    onFocus={e => { e.target.style.borderColor = T.teal; e.target.style.boxShadow = `0 0 0 4px ${T.tealLight}`; }}
    onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
  />
);

// ── Sidebar (matching employer exactly) ───────────────────────────────────────
const Sidebar = ({ step }) => (
  <div style={{ width: 280, flexShrink: 0, background: T.navy, minHeight: "100vh",
    padding: "40px 28px", display: "flex", flexDirection: "column",
    position: "sticky", top: 0, height: "100vh" }}>

    {/* Logo pill — matches employer */}
    <div style={{ marginBottom: 48, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: "10px 18px",
        display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <Image src="/images/logo.png" alt="InklusiJobs" width={140} height={40}
          style={{ objectFit: "contain" }} priority />
      </div>
    </div>

    {/* Step items — full-width card style matching employer */}
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {STEPS.map((s) => {
        const done = step > s.id;
        const active = step === s.id;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "flex-start", gap: 14,
            padding: "14px 16px", borderRadius: 12,
            background: active ? "rgba(15,92,110,0.5)" : done ? "rgba(255,255,255,0.05)" : "transparent",
            border: `1px solid ${active ? T.tealMid : "transparent"}`,
            transition: "all 0.2s" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800,
              background: done ? T.tealMid : active ? T.teal : "rgba(255,255,255,0.1)",
              color: "#fff",
              border: `2px solid ${done || active ? T.tealMid : "rgba(255,255,255,0.2)"}` }}>
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

    {/* Bottom badge — matches employer */}
    <div style={{ marginTop: "auto", padding: "16px", background: "rgba(15,92,110,0.3)",
      borderRadius: 12, border: "1px solid rgba(15,92,110,0.5)" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.tealMid, marginBottom: 4 }}>
        ♿ WCAG 2.1 AA Compliant
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
        Built for accessibility. Inclusive by design.
      </div>
    </div>
  </div>
);

// ── STEP 1 — Basic Info ───────────────────────────────────────────────────────
const Step1 = ({ data, set }) => {
  const educationalOptions = [
    "Some Elementary","Elementary Graduate","Some High School","High School Graduate",
    "Some College","College Graduate","Some/Completed Master's Degree","Master's Graduate","Vocational/TVET",
  ];
  return (
    <div>
      <h2 style={{ fontSize: 42, fontWeight: 900, color: T.navy, margin: "0 0 8px", letterSpacing: "-1px" }}>
        Tell us about <strong style={{ color: T.teal }}>yourself</strong>
      </h2>
      <p style={{ fontSize: 15, color: T.muted, margin: "0 0 32px" }}>
        We'll personalize your <strong>InklusiJobs experience</strong> just for you.
      </p>

      <SectionLabel>Full Name</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 6 }}>
            First Name <span style={{ color: T.error }}>*</span>
          </div>
          <TextInput placeholder="Juan" value={data.firstName}
            onChange={e => set({ ...data, firstName: e.target.value })} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 6 }}>
            Last Name <span style={{ color: T.error }}>*</span>
          </div>
          <TextInput placeholder="Dela Cruz" value={data.lastName}
            onChange={e => set({ ...data, lastName: e.target.value })} />
        </div>
      </div>

      <Divider />

      <SectionLabel>How old <strong style={{ color: T.teal }}>are you?</strong></SectionLabel>
      <TextInput type="number" placeholder="25" min="1" max="120"
        value={data.age} onChange={e => set({ ...data, age: e.target.value })} />

      <Divider />

      <SectionLabel>Where are you <strong style={{ color: T.teal }}>located?</strong></SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 6 }}>
            Current Address <span style={{ color: T.error }}>*</span>
          </div>
          <TextInput placeholder="123 Mabini St, Quezon City, Metro Manila"
            value={data.currentAddress} onChange={e => set({ ...data, currentAddress: e.target.value })} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 6 }}>
            Permanent Address <span style={{ color: T.error }}>*</span>
          </div>
          <TextInput placeholder="456 Rizal Ave, Cebu City, Cebu"
            value={data.permanentAddress} onChange={e => set({ ...data, permanentAddress: e.target.value })} />
        </div>
      </div>

      <Divider />

      <SectionLabel>Contact <strong style={{ color: T.teal }}>details</strong></SectionLabel>
      <TextInput type="tel" placeholder="+63 912 345 6789"
        value={data.contactNumber} onChange={e => set({ ...data, contactNumber: e.target.value })} />

      <Divider />

      <SectionLabel>What is your <strong style={{ color: T.teal }}>educational attainment?</strong></SectionLabel>
      <SelectInput
        options={["Select Educational Attainment", ...educationalOptions]}
        value={data.educationalAttainment}
        onChange={e => set({ ...data, educationalAttainment: e.target.value })}
      />
    </div>
  );
};

// ── STEP 2 — Work Preference ──────────────────────────────────────────────────
const Step2 = ({ data, set }) => {
  const workSetups = [
    { icon: "home",     label: "Remote"  },
    { icon: "wifi",     label: "Hybrid"  },
    { icon: "building", label: "On-site" },
  ];
  const contractTypes = ["Full-time","Part-time","Contract","Freelance","Internship"];
  const industries = [
    { icon: "monitor",   label: "Technology"     },
    { icon: "heart",     label: "Healthcare"     },
    { icon: "analytics", label: "Finance"        },
    { icon: "book",      label: "Education"      },
    { icon: "star",      label: "Retail"         },
    { icon: "zap",       label: "BPO/Call Center"},
    { icon: "sparkles",  label: "Creative/Arts"  },
    { icon: "grid",      label: "Other"          },
  ];
  const skillOptions = ["Communication","Data Entry","Customer Service","Graphic Design",
    "Web Development","Administrative","Accounting","Teaching/Tutoring",
    "Caregiving","Writing/Editing","Research","Sales","IT Support","Transcription","Social Media"];
  const availabilities = ["Immediately","Within 2 weeks","Within a month","Open to discuss"];
  const salaryRanges = ["< ₱15k","₱15k–₱25k","₱25k–₱40k","₱40k–₱70k","₱70k+","Negotiable"];

  return (
    <div>
      <h2 style={{ fontSize: 42, fontWeight: 900, color: T.navy, margin: "0 0 8px", letterSpacing: "-1px" }}>
        Your work <strong style={{ color: T.teal }}>preferences</strong>
      </h2>
      <p style={{ fontSize: 15, color: T.muted, margin: "0 0 32px" }}>
        Help us <strong>match you</strong> to jobs that fit your lifestyle and goals.
      </p>

      <SectionLabel>What <strong style={{ color: T.teal }}>work setup</strong> do you prefer?</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {workSetups.map(w => (
          <IconCard key={w.label} icon={w.icon} label={w.label}
            selected={data.workType === w.label}
            onSelect={() => set({ ...data, workType: w.label })} />
        ))}
      </div>

      <Divider />

      <SectionLabel>What <strong style={{ color: T.teal }}>industry</strong> are you interested in?</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {industries.map(ind => (
          <IconCard key={ind.label} icon={ind.icon} label={ind.label}
            selected={data.industry === ind.label}
            onSelect={() => set({ ...data, industry: ind.label })} />
        ))}
      </div>

      <Divider />

      <SectionLabel>Preferred <strong style={{ color: T.teal }}>contract type</strong></SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {contractTypes.map(t => (
          <Chip key={t} label={t} selected={data.contractType === t}
            onToggle={() => set({ ...data, contractType: t })} />
        ))}
      </div>

      <Divider />

      <SectionLabel>💰 Expected monthly <strong style={{ color: T.teal }}>salary</strong></SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {salaryRanges.map(r => (
          <Chip key={r} label={r} selected={data.salaryRange === r}
            onToggle={() => set({ ...data, salaryRange: r })} />
        ))}
      </div>

      <Divider />

      <SectionLabel>Your <strong style={{ color: T.teal }}>skills</strong> <span style={{ fontWeight: 500, color: T.muted, fontSize: 13 }}>(select all that apply)</span></SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        {skillOptions.map(s => (
          <Chip key={s} label={s}
            selected={(data.skills || []).includes(s)}
            onToggle={() => {
              const c = data.skills || [];
              set({ ...data, skills: c.includes(s) ? c.filter(x => x !== s) : [...c, s] });
            }} />
        ))}
      </div>

      <Divider />

      <SectionLabel>📅 When can you <strong style={{ color: T.teal }}>start?</strong></SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
        {availabilities.map(a => (
          <Chip key={a} label={a} selected={data.availability === a}
            onToggle={() => set({ ...data, availability: a })} />
        ))}
      </div>

      <Divider />

      <SectionLabel>Tell us about your <strong style={{ color: T.teal }}>career goals</strong></SectionLabel>
      <TextArea
        placeholder="e.g. I'm looking for a remote role where I can use my design skills and grow in UX..."
        value={data.goals || ""}
        onChange={e => set({ ...data, goals: e.target.value })} />
    </div>
  );
};

// ── STEP 3 — Disability Info ──────────────────────────────────────────────────
const Step3 = ({ data, set }) => {
  const disabilityTypes = [
    { icon: "eye",           label: "Visual Impairment"    },
    { icon: "bell",          label: "Hearing Impairment"   },
    { icon: "accessibility", label: "Physical/Mobility"    },
    { icon: "heart",         label: "Psychosocial"         },
    { icon: "book",          label: "Intellectual"         },
    { icon: "zap",           label: "Learning Disability"  },
    { icon: "phone",         label: "Speech/Language"      },
    { icon: "clock",         label: "Chronic Illness"      },
    { icon: "sparkles",      label: "Autism Spectrum"      },
    { icon: "grid",          label: "Multiple Disabilities"},
    { icon: "eyeOff",        label: "Prefer not to say"    },
  ];
  const accommodations = [
    "Screen reader support","Sign language interpreter","Flexible scheduling",
    "Physical accessibility","Assistive technology","Quiet workspace",
    "Remote work option","Custom workstation","Extended deadlines",
    "Written communication preference","Frequent breaks",
  ];
  const severities = ["Mild","Moderate","Severe","Prefer not to say"];

  return (
    <div>
      <h2 style={{ fontSize: 42, fontWeight: 900, color: T.navy, margin: "0 0 8px", letterSpacing: "-1px" }}>
        Disability <strong style={{ color: T.teal }}>information</strong>
      </h2>
      <p style={{ fontSize: 15, color: T.muted, margin: "0 0 16px" }}>
        This helps us match you with <strong>inclusive employers</strong> and suitable accommodations.
      </p>

      {/* Privacy notice matching employer style */}
      <div style={{ padding: "16px 20px", background: T.tealLight,
        border: `2px solid ${T.teal}33`, borderRadius: 14, marginBottom: 32,
        display: "flex", alignItems: "center", gap: 12 }}>
        <Icon d={ICONS.lock} size={20} color={T.teal} />
        <span style={{ fontSize: 14, color: T.teal, fontWeight: 600, lineHeight: 1.5 }}>
          This information is kept <strong>confidential</strong> and only shared with employers you apply to.
        </span>
      </div>

      <SectionLabel>What <strong style={{ color: T.teal }}>type of disability</strong> do you have?</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 8 }}>
        {disabilityTypes.map(d => (
          <IconCard key={d.label} icon={d.icon} label={d.label}
            selected={(data.disabilityTypes || []).includes(d.label)}
            onSelect={() => {
              const c = data.disabilityTypes || [];
              set({ ...data, disabilityTypes: c.includes(d.label) ? c.filter(x => x !== d.label) : [...c, d.label] });
            }} />
        ))}
      </div>

      <Divider />

      <SectionLabel>Severity <strong style={{ color: T.teal }}>level</strong></SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {severities.map(s => (
          <button key={s} onClick={() => set({ ...data, severity: s })}
            style={{ padding: "14px 10px", borderRadius: 12,
              border: `2px solid ${data.severity === s ? T.teal : T.border}`,
              background: data.severity === s ? T.tealLight : T.white,
              color: data.severity === s ? T.teal : T.bodyText,
              fontSize: 14, fontWeight: data.severity === s ? 800 : 600, cursor: "pointer", transition: "all 0.15s" }}>
            {s}
          </button>
        ))}
      </div>

      <Divider />

      <SectionLabel>PWD ID Number <span style={{ fontWeight: 500, color: T.muted, fontSize: 13 }}>(Optional)</span></SectionLabel>
      <TextInput placeholder="e.g. 2024-QC-12345"
        value={data.pwdId || ""} onChange={e => set({ ...data, pwdId: e.target.value })} />

      <Divider />

      <SectionLabel>What <strong style={{ color: T.teal }}>workplace accommodations</strong> do you need?</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
        {accommodations.map(a => (
          <Chip key={a} label={a}
            selected={(data.accommodations || []).includes(a)}
            onToggle={() => {
              const c = data.accommodations || [];
              set({ ...data, accommodations: c.includes(a) ? c.filter(x => x !== a) : [...c, a] });
            }} />
        ))}
      </div>

      <Divider />

      <SectionLabel>Additional notes about your <strong style={{ color: T.teal }}>needs</strong></SectionLabel>
      <TextArea
        placeholder="e.g. I need an ergonomic chair and occasional breaks every 2 hours due to my condition..."
        value={data.disabilityNotes || ""}
        onChange={e => set({ ...data, disabilityNotes: e.target.value })} />

      <div style={{ marginTop: 20, display: "flex", alignItems: "flex-start", gap: 12,
        padding: "18px 20px", background: T.tealLight, borderRadius: 14,
        border: `2px solid ${data.consentSharing ? T.teal : T.border}`, cursor: "pointer",
        transition: "all 0.18s" }}
        onClick={() => set({ ...data, consentSharing: !data.consentSharing })}>
        <input type="checkbox" checked={data.consentSharing || false}
          onChange={e => set({ ...data, consentSharing: e.target.checked })}
          style={{ width: 18, height: 18, accentColor: T.teal, cursor: "pointer", marginTop: 2, flexShrink: 0 }}
          onClick={e => e.stopPropagation()} />
        <span style={{ fontSize: 14, color: T.bodyText, lineHeight: 1.6 }}>
          I consent to sharing my disability information with employers I apply to through InklusiJobs
          for the purpose of requesting appropriate accommodations.
        </span>
      </div>
    </div>
  );
};

// ── STEP 4 — Dashboard ────────────────────────────────────────────────────────
const Step4 = ({ data, set }) => {
  const themes = [
    { id: "teal",  label: "Teal Focus", bg: "#0F4C4C", accent: "#2DD4BF" },
    { id: "navy",  label: "Navy Pro",   bg: "#1A2744", accent: "#7286D3" },
    { id: "slate", label: "Slate",      bg: "#334155", accent: "#94A3B8" },
    { id: "rose",  label: "Rose",       bg: "#881337", accent: "#FB7185" },
  ];
  const layouts = ["Compact","Comfortable","Spacious"];
  const widgets = [
    { icon: "sparkles", label: "Job Matches"           },
    { icon: "briefcase",label: "Application Tracker"   },
    { icon: "star",     label: "Saved Jobs"            },
    { icon: "clock",    label: "Interview Schedule"    },
    { icon: "trending", label: "Skills Progress"       },
    { icon: "search",   label: "Recommended Employers" },
  ];
  const notifications = [
    { key: "newMatches",      label: "New job match alerts"       },
    { key: "appUpdates",      label: "Application status updates" },
    { key: "interviewRemind", label: "Interview reminders"        },
    { key: "weeklyDigest",    label: "Weekly job digest"          },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 42, fontWeight: 900, color: T.navy, margin: "0 0 8px", letterSpacing: "-1px" }}>
        Personalize your <strong style={{ color: T.teal }}>dashboard</strong>
      </h2>
      <p style={{ fontSize: 15, color: T.muted, margin: "0 0 32px" }}>
        Choose how your <strong>InklusiJobs workspace</strong> looks and feels.
      </p>

      <SectionLabel>Dashboard <strong style={{ color: T.teal }}>theme</strong></SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {themes.map(t => (
          <button key={t.id} onClick={() => set({ ...data, theme: t.id })}
            style={{ padding: "18px 12px", borderRadius: 14,
              border: `2px solid ${data.theme === t.id ? T.teal : T.border}`,
              background: data.theme === t.id ? T.tealLight : T.white,
              cursor: "pointer", transition: "all 0.15s",
              boxShadow: data.theme === t.id ? `0 0 0 4px ${T.tealLight}` : "none" }}>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: t.bg }} />
              <div style={{ width: 22, height: 22, borderRadius: 6, background: t.accent }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: data.theme === t.id ? T.teal : T.navy }}>{t.label}</div>
          </button>
        ))}
      </div>

      <Divider />

      <SectionLabel>Layout <strong style={{ color: T.teal }}>density</strong></SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {layouts.map(l => (
          <button key={l} onClick={() => set({ ...data, layout: l })}
            style={{ padding: "16px", borderRadius: 12,
              border: `2px solid ${data.layout === l ? T.teal : T.border}`,
              background: data.layout === l ? T.tealLight : T.white,
              color: data.layout === l ? T.teal : T.bodyText,
              fontSize: 15, fontWeight: data.layout === l ? 800 : 600,
              cursor: "pointer", transition: "all 0.15s" }}>
            {l}
          </button>
        ))}
      </div>

      <Divider />

      <SectionLabel>What would you like to see <strong style={{ color: T.teal }}>first?</strong> <span style={{ fontWeight: 500, color: T.muted, fontSize: 13 }}>(pick up to 4)</span></SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {widgets.map(w => (
          <IconCard key={w.label} icon={w.icon} label={w.label}
            selected={(data.widgets || []).includes(w.label)}
            onSelect={() => {
              const c = data.widgets || [];
              if (c.includes(w.label)) set({ ...data, widgets: c.filter(x => x !== w.label) });
              else if (c.length < 4) set({ ...data, widgets: [...c, w.label] });
            }} />
        ))}
      </div>

      <Divider />

      <SectionLabel>📧 Email <strong style={{ color: T.teal }}>notifications</strong></SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notifications.map(({ key, label }) => (
          <div key={key} onClick={() => set({ ...data, [key]: !data[key] })}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", borderRadius: 14, cursor: "pointer",
              border: `2px solid ${data[key] !== false ? T.teal : T.border}`,
              background: data[key] !== false ? T.tealLight : T.white, transition: "all 0.18s" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: T.navy }}>{label}</span>
            <input type="checkbox" defaultChecked={data[key] !== false}
              style={{ width: 18, height: 18, accentColor: T.teal, cursor: "pointer" }}
              onClick={e => e.stopPropagation()} />
          </div>
        ))}
      </div>

      <Divider />

      {/* Summary preview — matches employer */}
      <div style={{ padding: "22px 24px", background: T.tealLight, borderRadius: 16, border: `2px solid ${T.teal}33` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Icon d={ICONS.grid} size={20} color={T.teal} />
          <span style={{ fontSize: 16, fontWeight: 800, color: T.navy }}>Your dashboard will include:</span>
        </div>
        {["AI-powered job matching based on your verified skills",
          "Personalized learning roadmap from Beginner to Job-Ready",
          "Portfolio builder from completed challenges",
          "Privacy controls — disability disclosure fully optional"].map(item => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ color: T.teal, fontSize: 16 }}>✓</span>
            <span style={{ fontSize: 14, color: T.teal, fontWeight: 600 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Complete screen ───────────────────────────────────────────────────────────
const CompleteScreen = ({ firstName }) => (
  <div style={{ display: "flex", minHeight: "100vh", fontFamily: "inherit" }}>
    <Sidebar step={5} />
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      background: T.bg, padding: "40px" }}>
      <div style={{ width: "100%", maxWidth: 600, background: T.white, borderRadius: 24,
        padding: "56px 48px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", textAlign: "center" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%",
          background: `linear-gradient(135deg, ${T.teal}, ${T.tealMid})`,
          margin: "0 auto 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={ICONS.check} size={40} color="#fff" strokeWidth={2.5} />
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: T.navy, margin: "0 0 14px", letterSpacing: "-0.5px" }}>
          Your <strong style={{ color: T.teal }}>InklusiJobs profile</strong> is ready! 🎉
        </h2>
        <p style={{ fontSize: 16, color: T.muted, margin: "0 0 36px", lineHeight: 1.7 }}>
          Welcome{firstName ? `, ${firstName}` : ""}! We're already finding <strong>inclusive job matches</strong> for you.
        </p>
        <a href="/dashboard"
          style={{ display: "inline-block", padding: "16px 44px", borderRadius: 14,
            background: `linear-gradient(135deg, ${T.teal}, ${T.tealMid})`,
            color: "#fff", fontSize: 16, fontWeight: 800, textDecoration: "none",
            boxShadow: `0 8px 24px ${T.teal}55` }}>
          Go to Dashboard →
        </a>
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Icon d={ICONS.checkCircle} size={18} color={T.success} />
          <span style={{ fontSize: 14, color: T.success, fontWeight: 700 }}>Profile verified & ready for matching!</span>
        </div>
      </div>
    </div>
  </div>
);

// ── Main Wizard ───────────────────────────────────────────────────────────────
export default function BasicInformation({ onSubmit, initialData = {} }) {
  const [step, setStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const contentRef = useRef(null);

  const [s1, setS1] = useState({
    firstName: initialData.firstName || "", lastName: initialData.lastName || "",
    age: initialData.age || "", currentAddress: initialData.currentAddress || "",
    permanentAddress: initialData.permanentAddress || "",
    contactNumber: initialData.contactNumber || "", educationalAttainment: "",
  });
  const [s2, setS2] = useState({ workType: "", contractType: "", industry: "", salaryRange: "", skills: [], availability: "", goals: "" });
  const [s3, setS3] = useState({ disabilityTypes: [], severity: "", pwdId: "", accommodations: [], disabilityNotes: "", consentSharing: false });
  const [s4, setS4] = useState({ theme: "teal", layout: "Comfortable", widgets: ["Job Matches","Application Tracker"] });

  const canNext = () => {
    if (step === 1) return s1.firstName && s1.lastName && s1.age && s1.currentAddress && s1.permanentAddress && s1.contactNumber && s1.educationalAttainment;
    if (step === 2) return s2.workType && s2.contractType;
    return true;
  };

  const handleStep = (dir) => {
    if (dir > 0 && !canNext()) return;
    setStep(s => s + dir);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLaunch = () => {
    const allData = { ...s1, workPreference: s2, disability: s3, dashboard: s4 };
    onSubmit?.(allData);
    setComplete(true);
  };

  if (complete) return <CompleteScreen firstName={s1.firstName} />;

  const pct = (step / STEPS.length) * 100;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans','Arial',sans-serif", display: "flex" }}>
      <Sidebar step={step} />

      {/* Main content */}
      <div ref={contentRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* Top progress bar — matches employer */}
        <div style={{ height: 5, background: T.border, flexShrink: 0 }}>
          <div style={{ height: "100%", width: `${pct}%`,
            background: `linear-gradient(90deg, ${T.teal}, ${T.tealMid})`,
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>

        {/* Step header — matches employer */}
        <div style={{ padding: "32px 56px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.muted }}>
            Step {step} of {STEPS.length} — <strong style={{ color: T.teal }}>{Math.round(pct)}% complete</strong>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {STEPS.map(s => (
              <div key={s.id} style={{ width: step >= s.id ? 28 : 8, height: 8, borderRadius: 99,
                background: step >= s.id ? T.teal : T.border, transition: "all 0.3s" }} />
            ))}
          </div>
        </div>

        {/* Form content */}
        <div style={{ flex: 1, padding: "32px 56px 0" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            {step === 1 && <Step1 data={s1} set={setS1} />}
            {step === 2 && <Step2 data={s2} set={setS2} />}
            {step === 3 && <Step3 data={s3} set={setS3} />}
            {step === 4 && <Step4 data={s4} set={setS4} />}
          </div>
        </div>

        {/* Sticky footer nav — matches employer exactly */}
        <div style={{ position: "sticky", bottom: 0, background: T.white,
          borderTop: `1px solid ${T.border}`, padding: "20px 56px",
          display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
          <button onClick={() => handleStep(-1)} disabled={step === 1}
            style={{ padding: "12px 24px", borderRadius: 12, border: `2px solid ${T.border}`,
              background: T.white, color: step === 1 ? T.muted : T.bodyText,
              fontSize: 15, fontWeight: 700, cursor: step === 1 ? "not-allowed" : "pointer",
              opacity: step === 1 ? 0.4 : 1, fontFamily: "inherit" }}>
            ‹ Back
          </button>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {step === 3 && (
              <button onClick={() => handleStep(1)}
                style={{ padding: "12px 24px", borderRadius: 12, border: `2px solid ${T.border}`,
                  background: T.white, color: T.muted, fontSize: 15, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit" }}>
                Skip ⏭
              </button>
            )}
            {step < 4 ? (
              <button onClick={() => handleStep(1)}
                style={{ padding: "12px 28px", borderRadius: 12, border: "none",
                  background: canNext() ? `linear-gradient(135deg, ${T.teal}, ${T.tealMid})` : T.border,
                  color: canNext() ? "#fff" : T.muted,
                  fontSize: 15, fontWeight: 800, cursor: canNext() ? "pointer" : "not-allowed",
                  boxShadow: canNext() ? `0 6px 18px ${T.teal}44` : "none",
                  transition: "all 0.2s", fontFamily: "inherit" }}>
                Continue ›
              </button>
            ) : (
              <button onClick={handleLaunch}
                style={{ padding: "12px 28px", borderRadius: 12, border: "none",
                  background: `linear-gradient(135deg, ${T.teal}, ${T.tealMid})`,
                  color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer",
                  boxShadow: `0 6px 18px ${T.teal}44`, fontFamily: "inherit" }}>
                Launch Dashboard 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}