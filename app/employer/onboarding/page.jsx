"use client";

import { useState } from "react";

const C = {
  navy: "#1A2744", accent: "#7286D3", bg: "#F9F8F6", card: "#FFFFFF",
  success: "#16A34A", successBg: "#DCFCE7", warning: "#D97706",
  error: "#DC2626", text: "#1A2744", muted: "#6B7280", border: "#E5E7EB", light: "#EEF1FF",
};

const STEPS = [
  { id: 1, label: "About You",    icon: "👤", desc: "Your role & hiring priorities" },
  { id: 2, label: "Your Company", icon: "🏢", desc: "Company details & culture"     },
  { id: 3, label: "The Role",     icon: "💼", desc: "Job specifics & requirements"  },
  { id: 4, label: "AI Setup",     icon: "⚡", desc: "Match criteria & challenges"   },
  { id: 5, label: "Personalize",  icon: "🎨", desc: "Dashboard & team settings"     },
];

const Label = ({ children, required }) => (
  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 6 }}>
    {children}{required && <span style={{ color: C.error, marginLeft: 3 }}>*</span>}
  </div>
);

const Input = ({ placeholder, value, onChange, type = "text" }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange}
    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", background: "#FAFAFA", outline: "none", boxSizing: "border-box", color: C.navy }}
    onFocus={e => e.target.style.borderColor = C.accent}
    onBlur={e => e.target.style.borderColor = C.border} />
);

const Textarea = ({ placeholder, rows = 3, value, onChange }) => (
  <textarea placeholder={placeholder} rows={rows} value={value} onChange={onChange}
    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", background: "#FAFAFA", outline: "none", resize: "none", boxSizing: "border-box", color: C.navy }}
    onFocus={e => e.target.style.borderColor = C.accent}
    onBlur={e => e.target.style.borderColor = C.border} />
);

const Select = ({ options, value, onChange }) => (
  <select value={value} onChange={onChange}
    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", background: "#FAFAFA", outline: "none", color: C.navy, cursor: "pointer", boxSizing: "border-box" }}>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const ChipSelect = ({ options, selected, onToggle, max }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
    {options.map(opt => {
      const active = selected.includes(opt);
      const disabled = !active && max && selected.length >= max;
      return (
        <button key={opt} onClick={() => !disabled && onToggle(opt)}
          style={{ padding: "7px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600, border: `1.5px solid ${active ? C.accent : C.border}`, background: active ? C.light : C.card, color: active ? C.navy : C.muted, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, transition: "all 0.15s" }}>
          {opt}
        </button>
      );
    })}
  </div>
);

const Field = ({ label, required, children }) => (
  <div style={{ marginBottom: 20 }}>
    <Label required={required}>{label}</Label>
    {children}
  </div>
);

const Row = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{children}</div>
);

// ── Steps ────────────────────────────────────────────────────────────────────

const Step1 = ({ data, set }) => {
  const priorities = ["Speed of hire","Candidate quality","Skill-based hiring","Cultural fit","PWD inclusion","Diverse pipeline"];
  const experience = ["First time hiring","1–2 years","3–5 years","5–10 years","10+ years"];
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 4 }}>Tell us about yourself</h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>We'll personalize InklusiJobs to match your hiring style.</p>
      <Row>
        <Field label="First Name" required><Input placeholder="Maria" value={data.firstName} onChange={e => set({ ...data, firstName: e.target.value })} /></Field>
        <Field label="Last Name" required><Input placeholder="Reyes" value={data.lastName} onChange={e => set({ ...data, lastName: e.target.value })} /></Field>
      </Row>
      <Field label="Work Email" required><Input type="email" placeholder="maria@company.com" value={data.email} onChange={e => set({ ...data, email: e.target.value })} /></Field>
      <Row>
        <Field label="Your Job Title" required><Input placeholder="HR Manager" value={data.title} onChange={e => set({ ...data, title: e.target.value })} /></Field>
        <Field label="Hiring Experience">
          <Select options={["Select experience",...experience]} value={data.experience} onChange={e => set({ ...data, experience: e.target.value })} />
        </Field>
      </Row>
      <Field label="Hiring Priorities (pick up to 3)">
        <ChipSelect options={priorities} selected={data.priorities||[]} max={3}
          onToggle={opt => { const c=data.priorities||[]; set({...data, priorities: c.includes(opt)?c.filter(p=>p!==opt):[...c,opt]}); }} />
      </Field>
      <Field label="What are you hoping InklusiJobs helps you achieve?">
        <Textarea placeholder="e.g. We want to build a more inclusive engineering team..." rows={3} value={data.goals} onChange={e => set({ ...data, goals: e.target.value })} />
      </Field>
    </div>
  );
};

const Step2 = ({ data, set }) => {
  const sizes = ["1–10","11–50","51–200","201–500","500–1000","1000+"];
  const industries = ["Technology","Healthcare","Finance","Education","Retail","Manufacturing","Media","Government","Non-profit","Other"];
  const benefits = ["Health insurance","Remote work","Flexible hours","Learning budget","Mental health support","Accessible workplace","Transportation","Stock options","Parental leave","Gym stipend"];
  const accommodations = ["Screen reader support","Sign language interpreters","Flexible scheduling","Physical accessibility","Assistive technology","Quiet workspace","Remote options","Custom workstation"];
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 4 }}>Your company</h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>Help candidates understand where they'd be working.</p>
      <Field label="Company Name" required><Input placeholder="Acme Corporation" value={data.company} onChange={e => set({ ...data, company: e.target.value })} /></Field>
      <Row>
        <Field label="Industry" required>
          <Select options={["Select industry",...industries]} value={data.industry} onChange={e => set({ ...data, industry: e.target.value })} />
        </Field>
        <Field label="Company Size">
          <Select options={["Select size",...sizes]} value={data.size} onChange={e => set({ ...data, size: e.target.value })} />
        </Field>
      </Row>
      <Field label="Company Website"><Input placeholder="https://acme.com" value={data.website} onChange={e => set({ ...data, website: e.target.value })} /></Field>
      <Field label="Company Mission / Culture">
        <Textarea placeholder="Describe your culture, values, and what makes your company a great place to work..." rows={3} value={data.culture} onChange={e => set({ ...data, culture: e.target.value })} />
      </Field>
      <Field label="Benefits & Perks offered">
        <ChipSelect options={benefits} selected={data.benefits||[]}
          onToggle={opt => { const c=data.benefits||[]; set({...data, benefits: c.includes(opt)?c.filter(b=>b!==opt):[...c,opt]}); }} />
      </Field>
      <Field label="Disability Accommodations available">
        <ChipSelect options={accommodations} selected={data.accommodations||[]}
          onToggle={opt => { const c=data.accommodations||[]; set({...data, accommodations: c.includes(opt)?c.filter(a=>a!==opt):[...c,opt]}); }} />
      </Field>
      <Field label="Company Logo">
        <div style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: "28px", textAlign: "center", background: "#FAFAFA", cursor: "pointer" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🖼️</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>Drop your logo here or click to upload</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>PNG or SVG, max 2MB</div>
        </div>
      </Field>
    </div>
  );
};

const Step3 = ({ data, set }) => {
  const skillOptions = ["React","TypeScript","Python","SQL","Figma","Node.js","Java","AWS","Docker","UX Research","Data Analysis","Product Management","Accessibility","Machine Learning","iOS","Android"];
  const toolOptions = ["Jira","Notion","Slack","GitHub","Figma","Linear","Confluence","Asana","Trello","GSuite"];
  const workTypes = ["Remote","Hybrid","On-site"];
  const contractTypes = ["Full-time","Part-time","Contract","Internship"];
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 4 }}>The role you're hiring for</h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>The more specific you are, the better your AI matches will be.</p>
      <Field label="Job Title" required><Input placeholder="Senior Frontend Developer" value={data.jobTitle} onChange={e => set({ ...data, jobTitle: e.target.value })} /></Field>
      <Row>
        <Field label="Department"><Input placeholder="Engineering" value={data.dept} onChange={e => set({ ...data, dept: e.target.value })} /></Field>
        <Field label="Location"><Input placeholder="Manila, PH" value={data.location} onChange={e => set({ ...data, location: e.target.value })} /></Field>
      </Row>
      <Row>
        <Field label="Work Setup">
          <div style={{ display: "flex", gap: 8 }}>
            {workTypes.map(t => (
              <button key={t} onClick={() => set({ ...data, workType: t })}
                style={{ flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13, fontWeight: 600, border: `1.5px solid ${data.workType===t?C.accent:C.border}`, background: data.workType===t?C.light:C.card, color: data.workType===t?C.navy:C.muted, cursor: "pointer" }}>
                {t}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Contract Type">
          <Select options={["Select type",...contractTypes]} value={data.contractType} onChange={e => set({ ...data, contractType: e.target.value })} />
        </Field>
      </Row>
      <Row>
        <Field label="Salary Range (min)"><Input placeholder="₱40,000" value={data.salaryMin} onChange={e => set({ ...data, salaryMin: e.target.value })} /></Field>
        <Field label="Salary Range (max)"><Input placeholder="₱80,000" value={data.salaryMax} onChange={e => set({ ...data, salaryMax: e.target.value })} /></Field>
      </Row>
      <Field label="Required Skills (pick all that apply)">
        <ChipSelect options={skillOptions} selected={data.skills||[]}
          onToggle={opt => { const c=data.skills||[]; set({...data, skills: c.includes(opt)?c.filter(s=>s!==opt):[...c,opt]}); }} />
      </Field>
      <Field label="Tools & Stack">
        <ChipSelect options={toolOptions} selected={data.tools||[]}
          onToggle={opt => { const c=data.tools||[]; set({...data, tools: c.includes(opt)?c.filter(t=>t!==opt):[...c,opt]}); }} />
      </Field>
      <Field label="Job Description">
        <Textarea placeholder="Describe the day-to-day responsibilities, team structure, and what success looks like in this role..." rows={4} value={data.jobDesc} onChange={e => set({ ...data, jobDesc: e.target.value })} />
      </Field>
    </div>
  );
};

const Step4 = ({ data }) => {
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleGenerate = () => { setLoading(true); setTimeout(() => { setLoading(false); setGenerated(true); }, 1800); };
  const matchCriteria = [
    { label: "Accessibility expertise",   weight: 95, tag: "Critical" },
    { label: "React / TypeScript skills",  weight: 88, tag: "High"     },
    { label: "Portfolio quality",          weight: 82, tag: "High"     },
    { label: "Communication ability",      weight: 75, tag: "Medium"   },
    { label: "Async work experience",      weight: 68, tag: "Medium"   },
  ];
  const challenges = [
    { title: "Accessible Component Audit",  time: "2–3 hrs", difficulty: "Intermediate", desc: "Review and improve WCAG compliance of a provided React component library." },
    { title: "Responsive Dashboard Build",  time: "3–4 hrs", difficulty: "Advanced",     desc: "Build a responsive data dashboard from a Figma spec with accessibility baked in." },
    { title: "UX Critique & Proposal",      time: "1–2 hrs", difficulty: "Beginner",     desc: "Review a provided app screen and write a structured UX improvement proposal." },
  ];
  const clusters = ["Frontend Accessibility","Component Architecture","Design Systems","User Research","Performance Optimization"];
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 4 }}>AI Setup</h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>We'll generate your match criteria, portfolio challenges, and skill clusters based on the role you defined.</p>
      {!generated ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⚡</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 8 }}>Ready to generate your AI setup</h3>
          <p style={{ color: C.muted, fontSize: 14, maxWidth: 380, margin: "0 auto 28px" }}>Based on your role details, our AI will create custom match weights, portfolio challenges, and skill clusters — all tuned for PWD-inclusive hiring.</p>
          <button onClick={handleGenerate} disabled={loading}
            style={{ padding: "14px 36px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${C.navy}, #2A3F6F)`, color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading?"wait":"pointer", boxShadow: "0 4px 16px rgba(26,39,68,0.3)", display: "inline-flex", alignItems: "center", gap: 10 }}>
            {loading ? (<><span style={{ display:"inline-block",width:16,height:16,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",animation:"spin 0.8s linear infinite" }} />Generating…</>) : "⚡ Generate AI Setup"}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div>
          <div style={{ background: C.card, borderRadius: 14, padding: 24, border: `1px solid ${C.border}`, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}><span style={{ fontSize: 18 }}>🎯</span><h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: 0 }}>Match Criteria Weights</h3></div>
            {matchCriteria.map((m, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{m.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: m.tag==="Critical"?"#FEE2E2":m.tag==="High"?C.light:"#F3F4F6", color: m.tag==="Critical"?C.error:m.tag==="High"?C.accent:C.muted }}>{m.tag}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{m.weight}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: "#EEF1FF" }}>
                  <div style={{ height: "100%", width: `${m.weight}%`, borderRadius: 99, background: `linear-gradient(90deg, ${C.accent}, ${C.navy})` }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: C.card, borderRadius: 14, padding: 24, border: `1px solid ${C.border}`, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}><span style={{ fontSize: 18 }}>📋</span><h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: 0 }}>Portfolio Challenges</h3></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {challenges.map((ch, i) => (
                <div key={i} style={{ padding: 16, borderRadius: 12, border: `1.5px solid ${C.border}`, background: "#FAFAFA", display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <input type="checkbox" defaultChecked={i<2} style={{ marginTop: 3, accentColor: C.accent, width: 16, height: 16, cursor: "pointer" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{ch.title}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: C.light, color: C.accent }}>{ch.difficulty}</span>
                    </div>
                    <p style={{ fontSize: 12, color: C.muted, margin: "0 0 4px" }}>{ch.desc}</p>
                    <span style={{ fontSize: 11, color: C.muted }}>⏱ {ch.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: C.card, borderRadius: 14, padding: 24, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><span style={{ fontSize: 18 }}>🧩</span><h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: 0 }}>Skill Clusters</h3></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {clusters.map(c => <span key={c} style={{ padding: "7px 14px", borderRadius: 99, background: C.light, color: C.navy, fontSize: 13, fontWeight: 600, border: `1.5px solid ${C.accent}` }}>{c}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Step5 = ({ data, set }) => {
  const themes = [
    { id: "navy",  label: "Navy Pro",   bg: "#1A2744", accent: "#7286D3" },
    { id: "slate", label: "Slate",      bg: "#334155", accent: "#94A3B8" },
    { id: "teal",  label: "Teal Focus", bg: "#0F4C4C", accent: "#2DD4BF" },
    { id: "rose",  label: "Rose",       bg: "#881337", accent: "#FB7185" },
  ];
  const layouts = ["Compact","Comfortable","Spacious"];
  const widgets = ["Hiring Funnel","AI Match Preview","Recent Applications","Team Activity","Analytics Summary","Quick Actions"];
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 4 }}>Personalize your dashboard</h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>Set your branding, layout, and team preferences.</p>
      <Field label="Dashboard Theme">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {themes.map(t => (
            <button key={t.id} onClick={() => set({ ...data, theme: t.id })}
              style={{ padding: "14px 10px", borderRadius: 12, border: `2px solid ${data.theme===t.id?C.accent:C.border}`, cursor: "pointer", background: C.card, transition: "all 0.15s" }}>
              <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: t.bg }} />
                <div style={{ width: 20, height: 20, borderRadius: 6, background: t.accent }} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{t.label}</div>
            </button>
          ))}
        </div>
      </Field>
      <Field label="Layout Density">
        <div style={{ display: "flex", gap: 8 }}>
          {layouts.map(l => (
            <button key={l} onClick={() => set({ ...data, layout: l })}
              style={{ flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13, fontWeight: 600, border: `1.5px solid ${data.layout===l?C.accent:C.border}`, background: data.layout===l?C.light:C.card, color: data.layout===l?C.navy:C.muted, cursor: "pointer" }}>
              {l}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Default Dashboard Widgets (pick up to 4)">
        <ChipSelect options={widgets} selected={data.widgets||[]} max={4}
          onToggle={opt => { const c=data.widgets||[]; set({...data, widgets: c.includes(opt)?c.filter(w=>w!==opt):[...c,opt]}); }} />
      </Field>
      <Field label="Invite Team Members">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(data.teammates||[""]).map((tm, i) => (
            <div key={i} style={{ display: "flex", gap: 8 }}>
              <Input placeholder="colleague@company.com" value={tm}
                onChange={e => { const arr=[...(data.teammates||[""])]; arr[i]=e.target.value; set({...data,teammates:arr}); }} />
              {i===(data.teammates||[""]).length-1 && (
                <button onClick={() => set({...data,teammates:[...(data.teammates||[""]),""]})}
                  style={{ padding:"10px 14px",borderRadius:10,border:`1.5px solid ${C.border}`,background:C.card,fontSize:20,color:C.accent,cursor:"pointer",fontWeight:700,lineHeight:1,flexShrink:0 }}>+</button>
              )}
            </div>
          ))}
        </div>
      </Field>
      <Field label="Email Notifications">
        {[
          { key:"newApplicants",   label:"New applicant alerts"       },
          { key:"aiMatches",       label:"AI match recommendations"   },
          { key:"interviewRemind", label:"Interview reminders"        },
          { key:"weeklyDigest",    label:"Weekly hiring digest"       },
        ].map(({ key, label }) => (
          <label key={key} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12,cursor:"pointer" }}>
            <input type="checkbox" defaultChecked style={{ width:16,height:16,accentColor:C.accent,cursor:"pointer" }} />
            <span style={{ fontSize:14,color:C.navy,fontWeight:500 }}>{label}</span>
          </label>
        ))}
      </Field>
    </div>
  );
};

// ── Main wizard ───────────────────────────────────────────────────────────────
export default function EmployerOnboarding() {
  const [step, setStep]       = useState(1);
  const [complete, setComplete] = useState(false);

  const [s1, setS1] = useState({ firstName:"", lastName:"", email:"", title:"", experience:"", priorities:[], goals:"" });
  const [s2, setS2] = useState({ company:"", industry:"", size:"", website:"", culture:"", benefits:[], accommodations:[] });
  const [s3, setS3] = useState({ jobTitle:"", dept:"", location:"", workType:"Remote", contractType:"", salaryMin:"", salaryMax:"", skills:[], tools:[], jobDesc:"" });
  const [s4, setS4] = useState({});
  const [s5, setS5] = useState({ theme:"navy", layout:"Comfortable", widgets:["Hiring Funnel","AI Match Preview"], teammates:[""] });

  const canNext = () => {
    if (step === 1) return s1.firstName && s1.email && s1.title;
    if (step === 2) return s2.company && s2.industry;
    if (step === 3) return s3.jobTitle;
    return true;
  };

  // ── KEY: save everything to localStorage then redirect ──────────────────
  const handleLaunch = () => {
    const profile = { s1, s2, s3, s4, s5 };
    localStorage.setItem("inklusijobs_employer", JSON.stringify(profile));
    setComplete(true);
  };

  const stepContent = () => {
    switch (step) {
      case 1: return <Step1 data={s1} set={setS1} />;
      case 2: return <Step2 data={s2} set={setS2} />;
      case 3: return <Step3 data={s3} set={setS3} />;
      case 4: return <Step4 data={s4} set={setS4} />;
      case 5: return <Step5 data={s5} set={setS5} />;
    }
  };

  if (complete) {
    return (
      <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Lexend','DM Sans',sans-serif" }}>
        <div style={{ textAlign:"center", maxWidth:480, padding:40 }}>
          <div style={{ fontSize:72, marginBottom:20 }}>🎉</div>
          <h1 style={{ fontSize:28, fontWeight:800, color:C.navy, marginBottom:12 }}>You're all set, {s1.firstName || "there"}!</h1>
          <p style={{ color:C.muted, fontSize:15, marginBottom:8, lineHeight:1.6 }}>
            <strong style={{ color:C.navy }}>{s2.company || "Your company"}</strong>'s employer profile is live.
          </p>
          <p style={{ color:C.muted, fontSize:14, marginBottom:32, lineHeight:1.6 }}>
            InklusiJobs will now surface AI-matched PWD candidates for your <strong style={{ color:C.navy }}>{s3.jobTitle || "open role"}</strong>.
          </p>
          <a href="/employer/dashboard" style={{ display:"inline-block", padding:"14px 36px", borderRadius:12, background:`linear-gradient(135deg, ${C.navy}, #2A3F6F)`, color:"#fff", fontSize:15, fontWeight:700, textDecoration:"none", boxShadow:"0 4px 16px rgba(26,39,68,0.3)" }}>
            Go to Dashboard →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Lexend','DM Sans',sans-serif", display:"flex" }}>

      {/* Left panel */}
      <div style={{ width:280, minWidth:280, background:`linear-gradient(180deg, ${C.navy} 0%, #1E2F55 100%)`, padding:"40px 28px", display:"flex", flexDirection:"column" }}>
        <div style={{ marginBottom:48 }}>
          <div style={{ fontSize:20, fontWeight:900, color:"#fff", letterSpacing:"-0.02em" }}>InklusiJobs</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", fontWeight:500 }}>Employer Setup</div>
        </div>
        <div style={{ flex:1 }}>
          {STEPS.map((s, i) => {
            const done = step > s.id, current = step === s.id;
            return (
              <div key={s.id} style={{ display:"flex", gap:14, marginBottom:28, alignItems:"flex-start" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", flexShrink:0, background:done?C.success:current?C.accent:"rgba(255,255,255,0.1)", border:`2px solid ${done?C.success:current?C.accent:"rgba(255,255,255,0.2)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:done?16:14, fontWeight:800, color:"#fff", transition:"all 0.25s" }}>
                    {done ? "✓" : s.icon}
                  </div>
                  {i < STEPS.length-1 && <div style={{ width:2, height:20, background:done?C.success:"rgba(255,255,255,0.1)", marginTop:4, transition:"background 0.25s" }} />}
                </div>
                <div style={{ paddingTop:4 }}>
                  <div style={{ fontSize:13, fontWeight:current?700:600, color:current?"#fff":done?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.4)" }}>{s.label}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop:"auto" }}>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:8 }}>Step {step} of {STEPS.length}</div>
          <div style={{ height:4, borderRadius:99, background:"rgba(255,255,255,0.1)" }}>
            <div style={{ height:"100%", width:`${((step-1)/(STEPS.length-1))*100}%`, borderRadius:99, background:C.accent, transition:"width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
        <div style={{ flex:1, maxWidth:680, width:"100%", margin:"0 auto", padding:"48px 40px" }}>
          {stepContent()}
        </div>
        <div style={{ borderTop:`1px solid ${C.border}`, padding:"20px 40px", display:"flex", justifyContent:"space-between", alignItems:"center", background:C.card }}>
          <button onClick={() => setStep(s => s-1)} disabled={step===1}
            style={{ padding:"10px 24px", borderRadius:10, border:`1.5px solid ${C.border}`, background:C.card, color:step===1?C.muted:C.navy, fontSize:14, fontWeight:600, cursor:step===1?"not-allowed":"pointer", opacity:step===1?0.5:1 }}>
            ← Back
          </button>
          <div style={{ display:"flex", gap:6 }}>
            {STEPS.map(s => <div key={s.id} style={{ width:step===s.id?20:6, height:6, borderRadius:99, background:step>=s.id?C.accent:C.border, transition:"all 0.25s" }} />)}
          </div>
          {step < 5 ? (
            <button onClick={() => canNext() && setStep(s => s+1)}
              style={{ padding:"10px 28px", borderRadius:10, border:"none", background:canNext()?`linear-gradient(135deg, ${C.navy}, #2A3F6F)`:C.border, color:canNext()?"#fff":C.muted, fontSize:14, fontWeight:700, cursor:canNext()?"pointer":"not-allowed", boxShadow:canNext()?"0 4px 14px rgba(26,39,68,0.25)":"none", transition:"all 0.2s" }}>
              Continue →
            </button>
          ) : (
            <button onClick={handleLaunch}
              style={{ padding:"10px 28px", borderRadius:10, border:"none", background:`linear-gradient(135deg, ${C.success}, #15803D)`, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 14px rgba(22,163,74,0.3)" }}>
              Launch Dashboard 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
}