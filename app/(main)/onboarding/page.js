"use client";

import { useState } from "react";

// ── Design tokens (original) ──────────────────────────────────────────────────
const C = {
  navy:      "#1A2744",
  navyLight: "#1E2F55",
  accent:    "#2DD4BF",
  accentDim: "#0F4C4C",
  bg:        "#F9F8F6",
  card:      "#FFFFFF",
  success:   "#16A34A",
  error:     "#DC2626",
  muted:     "#6B7280",
  border:    "#E5E7EB",
  light:     "#CCFBF1",
};

const STEPS = [
  { id: 1, label: "Basic Info",      icon: "👤", desc: "Your personal details"       },
  { id: 2, label: "Work Preference", icon: "💼", desc: "Your ideal work setup"       },
  { id: 3, label: "Disability Info", icon: "♿", desc: "Accommodations & support"    },
  { id: 4, label: "Dashboard",       icon: "🎨", desc: "Personalize your experience" },
];

// ── Shared UI ─────────────────────────────────────────────────────────────────
const Label = ({ children, required }) => (
  <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
    {children}{required && <span style={{ color: C.error, marginLeft: 3 }}>*</span>}
  </div>
);

const inputBase = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit",
  background: "#FAFAFA", outline: "none", boxSizing: "border-box", color: C.navy,
};

const Input = ({ placeholder, value, onChange, type = "text", min, max }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange} min={min} max={max}
    style={inputBase}
    onFocus={e => e.target.style.borderColor = C.accent}
    onBlur={e => e.target.style.borderColor = C.border} />
);

const Select = ({ options, value, onChange }) => (
  <select value={value} onChange={onChange} style={{ ...inputBase, cursor: "pointer" }}
    onFocus={e => e.target.style.borderColor = C.accent}
    onBlur={e => e.target.style.borderColor = C.border}>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const ChipSelect = ({ options, selected, onToggle, max }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
    {options.map(opt => {
      const active = selected.includes(opt);
      const disabled = !active && max && selected.length >= max;
      return (
        <button key={opt} onClick={() => !disabled && onToggle(opt)} style={{
          padding: "5px 11px", borderRadius: 99, fontSize: 12, fontWeight: 600,
          border: `1.5px solid ${active ? C.accent : C.border}`,
          background: active ? C.light : C.card,
          color: active ? C.navy : C.muted,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1, transition: "all 0.15s",
        }}>{opt}</button>
      );
    })}
  </div>
);

const Field = ({ label, required, children }) => (
  <div style={{ marginBottom: 16 }}>
    <Label required={required}>{label}</Label>
    {children}
  </div>
);

const Row = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{children}</div>
);

// ── Steps ─────────────────────────────────────────────────────────────────────
const Step1 = ({ data, set }) => {
  const edOptions = ["Some Elementary","Elementary Graduate","Some High School","High School Graduate","Some College","College Graduate","Some/Completed Master's Degree","Master's Graduate","Vocational/TVET"];
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 6 }}>Tell us about yourself</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>We'll personalize your InklusiJobs experience just for you.</p>
      <Row>
        <Field label="First Name" required><Input placeholder="Juan" value={data.firstName} onChange={e => set({ ...data, firstName: e.target.value })} /></Field>
        <Field label="Last Name" required><Input placeholder="Dela Cruz" value={data.lastName} onChange={e => set({ ...data, lastName: e.target.value })} /></Field>
      </Row>
      <Field label="Age" required><Input type="number" placeholder="25" min="1" max="120" value={data.age} onChange={e => set({ ...data, age: e.target.value })} /></Field>
      <Field label="Current Address" required><Input placeholder="123 Mabini St, Quezon City, Metro Manila" value={data.currentAddress} onChange={e => set({ ...data, currentAddress: e.target.value })} /></Field>
      <Field label="Permanent Address" required><Input placeholder="456 Rizal Ave, Cebu City, Cebu" value={data.permanentAddress} onChange={e => set({ ...data, permanentAddress: e.target.value })} /></Field>
      <Field label="Contact Number" required><Input type="tel" placeholder="+63 912 345 6789" value={data.contactNumber} onChange={e => set({ ...data, contactNumber: e.target.value })} /></Field>
      <Field label="Educational Attainment" required>
        <Select options={["Select Educational Attainment", ...edOptions]} value={data.educationalAttainment} onChange={e => set({ ...data, educationalAttainment: e.target.value })} />
      </Field>
    </div>
  );
};

const Step2 = ({ data, set }) => {
  const workTypes     = ["Remote","Hybrid","On-site"];
  const contractTypes = ["Full-time","Part-time","Contract","Freelance","Internship"];
  const industries    = ["Technology","Healthcare","Finance","Education","Retail","Manufacturing","Media","BPO/Call Center","Government","Non-profit","Creative/Arts","Other"];
  const skillOptions  = ["Communication","Data Entry","Customer Service","Graphic Design","Web Development","Administrative","Accounting","Teaching/Tutoring","Caregiving","Writing/Editing","Research","Sales","IT Support","Transcription","Social Media"];
  const availabilities = ["Immediately","Within 2 weeks","Within a month","Open to discuss"];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 6 }}>Your work preferences</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>Help us match you to jobs that fit your lifestyle and goals.</p>
      <Field label="Preferred Work Setup" required>
        <div style={{ display: "flex", gap: 8 }}>
          {workTypes.map(t => (
            <button key={t} onClick={() => set({ ...data, workType: t })} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 600,
              border: `1.5px solid ${data.workType === t ? C.accent : C.border}`,
              background: data.workType === t ? C.light : C.card,
              color: data.workType === t ? C.navy : C.muted, cursor: "pointer", transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>
      </Field>
      <Field label="Preferred Contract Type" required>
        <Select options={["Select contract type", ...contractTypes]} value={data.contractType} onChange={e => set({ ...data, contractType: e.target.value })} />
      </Field>
      <Field label="Preferred Industry">
        <Select options={["Select preferred industry", ...industries]} value={data.industry} onChange={e => set({ ...data, industry: e.target.value })} />
      </Field>
      <Row>
        <Field label="Min Monthly Salary"><Input placeholder="₱15,000" value={data.salaryMin} onChange={e => set({ ...data, salaryMin: e.target.value })} /></Field>
        <Field label="Max Monthly Salary"><Input placeholder="₱30,000" value={data.salaryMax} onChange={e => set({ ...data, salaryMax: e.target.value })} /></Field>
      </Row>
      <Field label="Skills (select all that apply)">
        <ChipSelect options={skillOptions} selected={data.skills || []}
          onToggle={opt => { const c = data.skills || []; set({ ...data, skills: c.includes(opt) ? c.filter(s => s !== opt) : [...c, opt] }); }} />
      </Field>
      <Field label="Availability to Start">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {availabilities.map(a => (
            <button key={a} onClick={() => set({ ...data, availability: a })} style={{
              padding: "5px 13px", borderRadius: 99, fontSize: 12, fontWeight: 600,
              border: `1.5px solid ${data.availability === a ? C.accent : C.border}`,
              background: data.availability === a ? C.light : C.card,
              color: data.availability === a ? C.navy : C.muted, cursor: "pointer", transition: "all 0.15s",
            }}>{a}</button>
          ))}
        </div>
      </Field>
      <Field label="Career Goals">
        <textarea placeholder="e.g. I'm looking for a remote role where I can use my design skills..." rows={3}
          value={data.goals || ""} onChange={e => set({ ...data, goals: e.target.value })}
          style={{ ...inputBase, resize: "none", lineHeight: 1.5 }}
          onFocus={e => e.target.style.borderColor = C.accent}
          onBlur={e => e.target.style.borderColor = C.border} />
      </Field>
    </div>
  );
};

const Step3 = ({ data, set }) => {
  const disabilityTypes = ["Visual Impairment","Hearing Impairment","Physical/Mobility","Psychosocial","Intellectual","Learning Disability","Speech/Language","Chronic Illness","Autism Spectrum","Multiple Disabilities","Prefer not to say"];
  const accommodations  = ["Screen reader support","Sign language interpreter","Flexible scheduling","Physical accessibility","Assistive technology","Quiet workspace","Remote work option","Custom workstation","Extended deadlines","Written communication","Frequent breaks"];
  const severities      = ["Mild","Moderate","Severe","Prefer not to say"];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 6 }}>Disability information</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>Helps us match you with inclusive employers and suitable accommodations.</p>
      <div style={{ background: C.light, border: `1px solid ${C.accent}`, borderRadius: 8, padding: "9px 12px", marginBottom: 16, fontSize: 12, color: C.accentDim, fontWeight: 500 }}>
        🔒 This information is kept confidential and only shared with employers you apply to.
      </div>
      <Field label="Type of Disability">
        <ChipSelect options={disabilityTypes} selected={data.disabilityTypes || []}
          onToggle={opt => { const c = data.disabilityTypes || []; set({ ...data, disabilityTypes: c.includes(opt) ? c.filter(d => d !== opt) : [...c, opt] }); }} />
      </Field>
      <Field label="Severity Level">
        <div style={{ display: "flex", gap: 8 }}>
          {severities.map(s => (
            <button key={s} onClick={() => set({ ...data, severity: s })} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 600,
              border: `1.5px solid ${data.severity === s ? C.accent : C.border}`,
              background: data.severity === s ? C.light : C.card,
              color: data.severity === s ? C.navy : C.muted, cursor: "pointer", transition: "all 0.15s",
            }}>{s}</button>
          ))}
        </div>
      </Field>
      <Field label="PWD ID Number"><Input placeholder="e.g. 2024-QC-12345" value={data.pwdId || ""} onChange={e => set({ ...data, pwdId: e.target.value })} /></Field>
      <Field label="Workplace Accommodations Needed">
        <ChipSelect options={accommodations} selected={data.accommodations || []}
          onToggle={opt => { const c = data.accommodations || []; set({ ...data, accommodations: c.includes(opt) ? c.filter(a => a !== opt) : [...c, opt] }); }} />
      </Field>
      <Field label="Additional notes">
        <textarea placeholder="e.g. I need an ergonomic chair and occasional breaks every 2 hours..." rows={3}
          value={data.disabilityNotes || ""} onChange={e => set({ ...data, disabilityNotes: e.target.value })}
          style={{ ...inputBase, resize: "none", lineHeight: 1.5 }}
          onFocus={e => e.target.style.borderColor = C.accent}
          onBlur={e => e.target.style.borderColor = C.border} />
      </Field>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
        <input type="checkbox" checked={data.consentSharing || false} onChange={e => set({ ...data, consentSharing: e.target.checked })}
          style={{ width: 14, height: 14, accentColor: C.accent, cursor: "pointer", marginTop: 2, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          I consent to sharing my disability information with employers I apply to through InklusiJobs.
        </span>
      </label>
    </div>
  );
};

const Step4 = ({ data, set }) => {
  const themes  = [
    { id: "teal",  label: "Teal Focus", bg: "#0F4C4C", accent: "#2DD4BF" },
    { id: "navy",  label: "Navy Pro",   bg: "#1A2744", accent: "#7286D3" },
    { id: "slate", label: "Slate",      bg: "#334155", accent: "#94A3B8" },
    { id: "rose",  label: "Rose",       bg: "#881337", accent: "#FB7185" },
  ];
  const layouts = ["Compact","Comfortable","Spacious"];
  const widgets = ["Job Matches","Application Tracker","Saved Jobs","Interview Schedule","Skills Progress","Recommended Employers"];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 6 }}>Personalize your dashboard</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>Choose how your InklusiJobs workspace looks and feels.</p>
      <Field label="Dashboard Theme">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {themes.map(t => (
            <button key={t.id} onClick={() => set({ ...data, theme: t.id })} style={{
              padding: "12px 8px", borderRadius: 10,
              border: `2px solid ${data.theme === t.id ? C.accent : C.border}`,
              cursor: "pointer", background: C.card, transition: "all 0.15s",
            }}>
              <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 6 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: t.bg }} />
                <div style={{ width: 18, height: 18, borderRadius: 5, background: t.accent }} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.navy }}>{t.label}</div>
            </button>
          ))}
        </div>
      </Field>
      <Field label="Layout Density">
        <div style={{ display: "flex", gap: 8 }}>
          {layouts.map(l => (
            <button key={l} onClick={() => set({ ...data, layout: l })} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 600,
              border: `1.5px solid ${data.layout === l ? C.accent : C.border}`,
              background: data.layout === l ? C.light : C.card,
              color: data.layout === l ? C.navy : C.muted, cursor: "pointer", transition: "all 0.15s",
            }}>{l}</button>
          ))}
        </div>
      </Field>
      <Field label="Default Widgets (pick up to 4)">
        <ChipSelect options={widgets} selected={data.widgets || []} max={4}
          onToggle={opt => { const c = data.widgets || []; set({ ...data, widgets: c.includes(opt) ? c.filter(w => w !== opt) : [...c, opt] }); }} />
      </Field>
      <Field label="Email Notifications">
        {[
          { key: "newMatches",      label: "New job match alerts"        },
          { key: "appUpdates",      label: "Application status updates"  },
          { key: "interviewRemind", label: "Interview reminders"         },
          { key: "weeklyDigest",    label: "Weekly job digest"           },
        ].map(({ key, label }) => (
          <label key={key} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10, cursor: "pointer" }}>
            <input type="checkbox" defaultChecked style={{ width: 14, height: 14, accentColor: C.accent, cursor: "pointer" }} />
            <span style={{ fontSize: 13, color: C.navy, fontWeight: 500 }}>{label}</span>
          </label>
        ))}
      </Field>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BasicInformation({ onSubmit, initialData = {} }) {
  const [step, setStep]         = useState(1);
  const [complete, setComplete] = useState(false);

  const [s1, setS1] = useState({ firstName: initialData.firstName || "", lastName: "", age: "", currentAddress: "", permanentAddress: "", contactNumber: "", educationalAttainment: "" });
  const [s2, setS2] = useState({ workType: "Remote", contractType: "", industry: "", salaryMin: "", salaryMax: "", skills: [], availability: "", goals: "" });
  const [s3, setS3] = useState({ disabilityTypes: [], severity: "", pwdId: "", accommodations: [], disabilityNotes: "", consentSharing: false });
  const [s4, setS4] = useState({ theme: "teal", layout: "Comfortable", widgets: ["Job Matches","Application Tracker"] });

  const canNext = () => {
    if (step === 1) return s1.firstName && s1.lastName && s1.age && s1.currentAddress && s1.permanentAddress && s1.contactNumber && s1.educationalAttainment;
    if (step === 2) return s2.workType && s2.contractType;
    return true;
  };

  const handleLaunch = () => {
    onSubmit?.({ ...s1, workPreference: s2, disability: s3, dashboard: s4 });
    setComplete(true);
  };

  const stepContent = () => {
    switch (step) {
      case 1: return <Step1 data={s1} set={setS1} />;
      case 2: return <Step2 data={s2} set={setS2} />;
      case 3: return <Step3 data={s3} set={setS3} />;
      case 4: return <Step4 data={s4} set={setS4} />;
    }
  };

  if (complete) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lexend','DM Sans',sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: 400, padding: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>🎉</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.navy, marginBottom: 10 }}>You're all set, {s1.firstName || "there"}!</h1>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 24, lineHeight: 1.7 }}>Your profile is ready and we're already finding inclusive job matches for you.</p>
          <a href="/dashboard/worker" style={{ display: "inline-block", padding: "11px 28px", borderRadius: 10, background: `linear-gradient(135deg, ${C.accentDim}, #0D7377)`, color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(13,115,119,0.3)" }}>Go to Dashboard →</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Lexend','DM Sans',sans-serif", display: "flex" }}>

      {/* Sidebar */}
      <div style={{
        width: 220, minWidth: 220, flexShrink: 0,
        background: `linear-gradient(180deg, ${C.navy} 0%, #1E2F55 100%)`,
        padding: "32px 20px", display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>InklusiJobs</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Worker Setup</div>
        </div>

        <div style={{ flex: 1 }}>
          {STEPS.map((s, i) => {
            const done = step > s.id, current = step === s.id;
            return (
              <div key={s.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: done ? C.success : current ? C.accent : "rgba(255,255,255,0.1)",
                    border: `2px solid ${done ? C.success : current ? C.accent : "rgba(255,255,255,0.2)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, color: "#fff", transition: "all 0.25s",
                  }}>{done ? "✓" : s.icon}</div>
                  {i < STEPS.length - 1 && <div style={{ width: 2, height: 20, marginTop: 3, background: done ? C.success : "rgba(255,255,255,0.1)", transition: "background 0.25s" }} />}
                </div>
                <div style={{ paddingTop: 4, marginBottom: i < STEPS.length - 1 ? 16 : 0 }}>
                  <div style={{ fontSize: 12, fontWeight: current ? 700 : 600, color: current ? "#fff" : done ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)", lineHeight: 1.2 }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginTop: 2 }}>{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "auto", paddingTop: 20 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>Step {step} of {STEPS.length}</div>
          <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.1)" }}>
            <div style={{ height: "100%", borderRadius: 99, background: C.accent, width: `${((step - 1) / (STEPS.length - 1)) * 100}%`, transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: C.bg }}>
        <div style={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center", padding: "40px 32px" }}>
          <div style={{ width: "100%", maxWidth: 480, background: C.card, borderRadius: 16, padding: "36px 40px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", alignSelf: "flex-start" }}>
            {stepContent()}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", background: C.card, flexShrink: 0 }}>
          <button onClick={() => setStep(s => s - 1)} disabled={step === 1} style={{ padding: "9px 20px", borderRadius: 8, border: `1.5px solid ${C.border}`, background: C.card, color: step === 1 ? C.muted : C.navy, fontSize: 13, fontWeight: 600, cursor: step === 1 ? "not-allowed" : "pointer", opacity: step === 1 ? 0.5 : 1 }}>← Back</button>

          <div style={{ display: "flex", gap: 5 }}>
            {STEPS.map(s => (
              <div key={s.id} style={{ width: step === s.id ? 18 : 5, height: 5, borderRadius: 99, background: step >= s.id ? C.accent : C.border, transition: "all 0.25s" }} />
            ))}
          </div>

          {step < 4
            ? <button onClick={() => canNext() && setStep(s => s + 1)} style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: canNext() ? `linear-gradient(135deg, ${C.accentDim}, #0D7377)` : C.border, color: canNext() ? "#fff" : C.muted, fontSize: 13, fontWeight: 700, cursor: canNext() ? "pointer" : "not-allowed", boxShadow: canNext() ? "0 4px 12px rgba(13,115,119,0.25)" : "none", transition: "all 0.2s" }}>Continue →</button>
            : <button onClick={handleLaunch} style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${C.success}, #15803D)`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(22,163,74,0.25)" }}>Launch Dashboard 🚀</button>
          }
        </div>
      </div>
    </div>
  );
}