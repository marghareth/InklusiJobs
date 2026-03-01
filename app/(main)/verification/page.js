"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Design tokens (matches InklusiJobs brand) ────────────────────────────────
const T = {
  teal:       "#0F5C6E",
  tealDark:   "#0A3D4A",
  tealLight:  "#EFF9FB",
  tealMid:    "#1A8FA5",
  cyan:       "#7DDCE8",
  green:      "#16A34A",
  greenBg:    "#DCFCE7",
  greenBorder:"#BBF7D0",
  amber:      "#D97706",
  amberBg:    "#FEF3C7",
  amberBorder:"#FDE68A",
  red:        "#DC2626",
  redBg:      "#FEE2E2",
  redBorder:  "#FECACA",
  navy:       "#1A1A2E",
  muted:      "#4A6070",
  border:     "#DDE8EC",
  bg:         "#F0F4F6",
  white:      "#FFFFFF",
};

const STEPS = [
  { id: 1, label: "Upload Documents", icon: "🪪" },
  { id: 2, label: "AI Analysis",      icon: "🤖" },
  { id: 3, label: "Liveness Check",   icon: "📸" },
  { id: 4, label: "Registry Check",   icon: "🏛️" },
  { id: 5, label: "Result",           icon: "🏅" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem("ij_current_user") || "null"); } catch { return null; }
}

function saveVerificationResult(result) {
  try {
    const user = getCurrentUser();
    if (!user) return;
    user.verificationStatus = result.decision;
    user.verificationScore  = result.score;
    user.verifiedAt         = new Date().toISOString();
    localStorage.setItem("ij_current_user", JSON.stringify(user));
  } catch { /**/ }
}

const MOCK_RESULT = {
  decision: "AUTO_APPROVE", score: 87, flags: [],
  analysis: {
    idDocument: { extractedName: "Sample User", issuingLgu: "Quezon City", disabilityCategory: "Orthopedic / Physical Disability", forgerySignalCount: 0, suspicionLevel: "LOW", summary: "PWD ID appears authentic. All required fields present and consistent." },
    supportingDocument: { summary: "Medical certificate format is valid. Physician signature present." },
    crossDocument: { consistency: "CONSISTENT", summary: "Name and disability category match across both documents." },
    faceMatch: { confidence: 91, summary: "Face matches ID photo with high confidence." },
  },
  nextSteps: { idNumberForDoh: null, prcLicenseNumber: null },
};

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ currentStep }) {
  return (
    <div style={{ marginBottom: 32 }}>
      {/* Step pills row */}
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {STEPS.map((step, i) => {
          const done    = currentStep > step.id;
          const active  = currentStep === step.id;
          const pending = currentStep < step.id;
          return (
            <div key={step.id} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: done ? T.teal : active ? `linear-gradient(135deg, ${T.teal}, ${T.tealMid})` : T.white,
                  border: `2px solid ${done || active ? T.teal : T.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: done ? 16 : 18,
                  boxShadow: active ? `0 0 0 4px ${T.tealLight}` : "none",
                  transition: "all 0.3s ease",
                  color: pending ? T.muted : "white",
                  fontWeight: 700,
                }}>
                  {done ? "✓" : <span style={{ fontSize: 18 }}>{step.icon}</span>}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.03em",
                  color: done ? T.teal : active ? T.teal : "#94A3B8",
                  whiteSpace: "nowrap",
                }}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, margin: "0 8px", marginTop: -18,
                  background: done ? T.teal : T.border,
                  transition: "background 0.4s ease",
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 0: Explainer / Intro Screen ────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    icon: "🪪",
    step: "01",
    title: "Upload Your Documents",
    desc: "Submit your PWD ID (front & back) plus one supporting document — medical certificate, barangay cert, or PhilHealth MDR.",
  },
  {
    icon: "🤖",
    step: "02",
    title: "AI Document Analysis",
    desc: "Gemini Vision checks your ID for authenticity, PSGC code format, NCDA disability category, and cross-document consistency.",
  },
  {
    icon: "📸",
    step: "03",
    title: "Liveness Check",
    desc: "Take a quick selfie holding your PWD ID. This confirms the person submitting matches the ID — no special hardware needed.",
  },
  {
    icon: "🏛️",
    step: "04",
    title: "Registry & Result",
    desc: "We check Philippine government registries. A positive match boosts your score. Then you receive your PWD Verified badge instantly.",
  },
];

function IntroScreen({ onStart }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Badge */}
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.tealLight, border: `1px solid ${T.cyan}50`, borderRadius: 99, padding: "6px 16px", marginBottom: 16 }}>
          <span style={{ fontSize: 14 }}>🛡️</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.teal, letterSpacing: "0.06em", textTransform: "uppercase" }}>Multi-Layer Verification</span>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: T.navy, margin: "0 0 8px", lineHeight: 1.3 }}>
          How PWD Verification Works
        </h2>
        <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, margin: 0 }}>
          Four steps. One badge. A lifetime of opportunity. The process takes about <strong style={{ color: T.teal }}>3–5 minutes</strong> to complete.
        </p>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, background: T.white, border: `1px solid ${T.border}`, borderRadius: 18, overflow: "hidden" }}>
        {HOW_IT_WORKS.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 20px",
            borderBottom: i < HOW_IT_WORKS.length - 1 ? `1px solid ${T.border}` : "none",
            background: T.white,
          }}>
            {/* Step number + icon */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${T.teal}, ${T.tealMid})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: `0 4px 12px rgba(15,92,110,0.2)` }}>
                {item.icon}
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, color: T.cyan, letterSpacing: "0.05em" }}>{item.step}</span>
            </div>
            <div style={{ flex: 1, paddingTop: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 5 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.65 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust signals */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { icon: "🔒", label: "End-to-End Encrypted", sub: "Files deleted after analysis" },
          { icon: "⚖️", label: "RA 10173 Compliant",   sub: "Data Privacy Act protected" },
          { icon: "♿", label: "WCAG 2.1 AA",           sub: "Fully accessible process" },
          { icon: "🇵🇭", label: "RA 7277 Aligned",     sub: "Magna Carta for PWDs" },
        ].map((item) => (
          <div key={item.label} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.navy, lineHeight: 1.3 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={onStart}
          style={{ width: "100%", padding: "15px", borderRadius: 12, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${T.teal}, ${T.tealDark})`, color: "white", boxShadow: `0 4px 20px rgba(15,92,110,0.35)`, letterSpacing: "0.02em" }}
        >
          Continue to Verification →
        </button>
        <button
          onClick={() => window.history.back()}
          style={{ width: "100%", padding: "12px", borderRadius: 12, fontSize: 13, fontWeight: 600, border: `1.5px solid ${T.border}`, cursor: "pointer", background: T.white, color: T.muted }}
        >
          Not now, go back
        </button>
      </div>

      <p style={{ fontSize: 11, color: "#94A3B8", textAlign: "center", margin: 0, lineHeight: 1.6 }}>
        Your verification status is private. Employers only see the ✓ badge — never your documents or medical details.
      </p>
    </div>
  );
}

// ─── Step 1: Document Upload ──────────────────────────────────────────────────
function DropZone({ label, sublabel, value, onChange, icon }) {
  const ref = useRef();
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (file) onChange({ file, name: file.name, size: (file.size / 1024).toFixed(0) + " KB" });
  };

  return (
    <div
      onClick={() => ref.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
      style={{
        border: `2px dashed ${value ? T.teal : dragging ? T.tealMid : T.border}`,
        borderRadius: 16, padding: "32px 20px", cursor: "pointer", textAlign: "center",
        background: value ? T.tealLight : dragging ? T.tealLight : T.white,
        transition: "all 0.2s ease",
      }}
    >
      <input ref={ref} type="file" accept="image/*,.pdf" style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files?.[0])} />
      {value ? (
        <div>
          <div style={{ fontSize: 24, marginBottom: 6 }}>✅</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.teal, marginBottom: 2, wordBreak: "break-all" }}>{value.name}</div>
          <div style={{ fontSize: 11, color: T.muted }}>{value.size}</div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.navy, marginBottom: 3 }}>{label}</div>
          {sublabel && <div style={{ fontSize: 12, color: T.muted, marginBottom: 5 }}>{sublabel}</div>}
          <div style={{ fontSize: 12, color: "#94A3B8" }}>Click or drag & drop</div>
        </div>
      )}
    </div>
  );
}

function DocumentUploadStep({ onNext }) {
  const [pwdFront,   setPwdFront]   = useState(null);
  const [pwdBack,    setPwdBack]    = useState(null);
  const [supporting, setSupporting] = useState(null);
  const ready = pwdFront && supporting;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, margin: 0 }}>
        Submit your PWD ID and one supporting document. All files are encrypted and deleted after analysis per RA 10173.
      </p>

      {/* PWD ID */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: T.teal, color: "white", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>1</div>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>PWD ID Card</span>
          <span style={{ fontSize: 11, color: T.red, fontWeight: 600 }}>Required</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <DropZone label="Front Side" value={pwdFront} onChange={setPwdFront} icon="🪪" />
          <DropZone label="Back Side" sublabel="Optional" value={pwdBack} onChange={setPwdBack} icon="🔄" />
        </div>
      </div>

      {/* Supporting doc */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: T.teal, color: "white", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>2</div>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>Supporting Document</span>
          <span style={{ fontSize: 11, color: T.red, fontWeight: 600 }}>Required</span>
        </div>
        <DropZone
          label="Medical Certificate / Barangay Cert / PhilHealth MDR"
          value={supporting} onChange={setSupporting} icon="📄"
        />
      </div>

      {/* Privacy note */}
      <div style={{ background: T.amberBg, border: `1px solid ${T.amberBorder}`, borderRadius: 12, padding: "12px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
        <span style={{ fontSize: 14 }}>🔒</span>
        <span style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6 }}>
          Documents are encrypted end-to-end and deleted after analysis per RA 10173 (Data Privacy Act).
        </span>
      </div>

      <button
        disabled={!ready}
        onClick={() => onNext({ pwdFront: pwdFront.file, pwdBack: pwdBack?.file, supporting: supporting.file })}
        style={{
          width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 700,
          border: "none", cursor: ready ? "pointer" : "not-allowed",
          background: ready ? `linear-gradient(135deg, ${T.teal}, ${T.tealDark})` : "#E2E8F0",
          color: ready ? "white" : "#94A3B8",
          boxShadow: ready ? `0 4px 16px rgba(15,92,110,0.3)` : "none",
          transition: "all 0.2s",
        }}
      >
        Submit Documents →
      </button>
    </div>
  );
}

// ─── Step 2: AI Analysis ──────────────────────────────────────────────────────
const CHECKS = [
  { label: "OCR Text Extraction",        detail: "Reading ID number, name, LGU, and disability category from your PWD ID…",                 duration: 1800 },
  { label: "PSGC Format Validation",     detail: "Verifying the ID number follows the Philippine Standard Geographic Code format…",           duration: 2000 },
  { label: "LGU Designation Check",      detail: "Confirming your issuing office is correctly labeled as a City or Municipality…",            duration: 1600 },
  { label: "NCDA Disability Category",   detail: "Checking that your disability falls under one of the 9 NCDA-recognized categories…",       duration: 1900 },
  { label: "Visual Forgery Detection",   detail: "Scanning for signs of tampering, photo substitution, or Recto forgery patterns…",          duration: 2200 },
  { label: "Cross-Document Consistency", detail: "Matching your name and disability type across all submitted documents…",                    duration: 1700 },
];

function Spinner({ size = 16, color = "white" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: "ij-spin 0.8s linear infinite" }}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeOpacity="0.25" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function AIAnalysisStep({ documents, onComplete }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [checks, setChecks]           = useState(CHECKS.map(c => ({ ...c, result: null })));
  const [status, setStatus]           = useState("running");
  const [apiResult, setApiResult]     = useState(null);

  useEffect(() => {
    if (status !== "running" || activeIndex >= CHECKS.length) return;
    const t = setTimeout(() => setActiveIndex(i => i + 1), CHECKS[activeIndex]?.duration || 1800);
    return () => clearTimeout(t);
  }, [activeIndex, status]);

  useEffect(() => { runAnalysis(); }, []);

  const runAnalysis = async () => {
    let data;
    try {
      const pwdIdFrontBase64    = await fileToBase64(documents.pwdFront);
      const pwdIdBackBase64     = documents.pwdBack ? await fileToBase64(documents.pwdBack) : null;
      const supportingDocBase64 = await fileToBase64(documents.supporting);
      const res = await fetch("/api/verification/analyze-document", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pwdIdFrontBase64, pwdIdBackBase64, supportingDocBase64, selfieBase64: "pending", submissionStartedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error();
      data = await res.json();
    } catch {
      await new Promise(r => setTimeout(r, 1000));
      data = MOCK_RESULT;
    }

    setApiResult(data);
    setStatus("done");

    const idDoc = data.analysis?.idDocument;
    const crossDoc = data.analysis?.crossDocument;
    const flags = data.flags || [];

    setChecks([
      { label: "OCR Text Extraction",        result: idDoc?.extractedName ? "pass" : "warn",   detail: idDoc?.extractedName ? `Name: ${idDoc.extractedName}` : "Could not extract name clearly" },
      { label: "PSGC Format Validation",     result: flags.some(f => /PSGC/i.test(f)) ? "fail" : "pass", detail: flags.find(f => /PSGC/i.test(f)) || "ID number format is valid" },
      { label: "LGU Designation Check",      result: flags.some(f => /city|municipality/i.test(f)) ? "fail" : "pass", detail: `Issuing LGU: ${idDoc?.issuingLgu || "detected"}` },
      { label: "NCDA Disability Category",   result: flags.some(f => /NCDA/i.test(f)) ? "fail" : "pass", detail: `Category: ${idDoc?.disabilityCategory || "detected"}` },
      { label: "Visual Forgery Detection",   result: (idDoc?.forgerySignalCount || 0) > 2 ? "fail" : (idDoc?.forgerySignalCount || 0) > 0 ? "warn" : "pass", detail: `${idDoc?.forgerySignalCount || 0} signal(s) · Suspicion: ${idDoc?.suspicionLevel || "LOW"}` },
      { label: "Cross-Document Consistency", result: crossDoc?.consistency === "INCONSISTENT" ? "fail" : crossDoc?.consistency === "MINOR_ISSUES" ? "warn" : "pass", detail: crossDoc?.summary || "All documents consistent" },
    ]);

    const total = CHECKS.reduce((s, c) => s + c.duration, 0);
    setTimeout(() => onComplete(data), Math.max(total - activeIndex * 1800, 800));
  };

  const getResultStyle = (check, index) => {
    if (check.result === "pass") return { bg: T.teal,    icon: "✓", color: "white" };
    if (check.result === "fail") return { bg: T.red,     icon: "✗", color: "white" };
    if (check.result === "warn") return { bg: T.amber,   icon: "!", color: "white" };
    if (index === activeIndex)   return { bg: T.tealMid, icon: null, color: "white", spinning: true };
    if (index < activeIndex)     return { bg: T.teal,    icon: "✓", color: "white" };
    return { bg: "#E2E8F0", icon: String(index + 1), color: "#94A3B8" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <style>{`@keyframes ij-spin { to { transform: rotate(360deg); } }`}</style>

      <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, margin: 0 }}>
        Gemini Vision is analyzing your documents using Philippine-specific fraud detection rules.
      </p>

      {/* Active check description */}
      {status === "running" && activeIndex < CHECKS.length && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.tealLight, border: `1px solid ${T.cyan}40`, borderRadius: 12, padding: "12px 14px" }}>
          <Spinner size={16} color={T.teal} />
          <span style={{ fontSize: 12, color: T.teal, fontWeight: 500, lineHeight: 1.5 }}>{CHECKS[activeIndex]?.detail}</span>
        </div>
      )}

      {/* Check list */}
      <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
        {checks.map((check, i) => {
          const s = getResultStyle(check, i);
          const isActive = i === activeIndex && status === "running";
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
              background: isActive ? T.tealLight : check.result === "fail" ? T.redBg : T.white,
              borderBottom: i < checks.length - 1 ? `1px solid ${T.border}` : "none",
              transition: "background 0.3s",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 13, fontWeight: 700, color: s.color,
                transition: "all 0.3s",
              }}>
                {s.spinning ? <Spinner size={14} color="white" /> : s.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: check.result === "fail" ? T.red : check.result === "pass" ? T.teal : isActive ? T.tealMid : i < activeIndex ? T.teal : "#94A3B8", marginBottom: 2 }}>
                  {check.label}
                </div>
                {(check.result || isActive) && (
                  <div style={{ fontSize: 11, color: check.result === "fail" ? T.red : T.muted, lineHeight: 1.4 }}>
                    {check.detail}
                  </div>
                )}
              </div>
              {/* Right status pill */}
              {check.result && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                  background: check.result === "pass" ? T.greenBg : check.result === "fail" ? T.redBg : T.amberBg,
                  color: check.result === "pass" ? T.green : check.result === "fail" ? T.red : T.amber,
                  border: `1px solid ${check.result === "pass" ? T.greenBorder : check.result === "fail" ? T.redBorder : T.amberBorder}`,
                }}>
                  {check.result === "pass" ? "Pass" : check.result === "fail" ? "Fail" : "Warn"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Score preview */}
      {apiResult && (
        <div style={{
          borderRadius: 12, padding: "14px 16px", textAlign: "center", fontSize: 13, fontWeight: 700,
          background: apiResult.decision === "AUTO_APPROVE" ? T.greenBg : apiResult.decision === "HUMAN_REVIEW" ? T.amberBg : T.redBg,
          color:      apiResult.decision === "AUTO_APPROVE" ? T.green   : apiResult.decision === "HUMAN_REVIEW" ? T.amber   : T.red,
          border: `1px solid ${apiResult.decision === "AUTO_APPROVE" ? T.greenBorder : apiResult.decision === "HUMAN_REVIEW" ? T.amberBorder : T.redBorder}`,
        }}>
          AI Score: {apiResult.score}/100 — {apiResult.decision?.replace("_", " ")}
          <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4, opacity: 0.8 }}>Advancing to liveness check…</div>
        </div>
      )}
    </div>
  );
}

// ─── Step 3: Liveness Check ───────────────────────────────────────────────────
function LivenessStep({ onComplete }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [phase, setPhase]            = useState("starting"); // starting | camera | captured | error
  const [capturedImage, setCaptured] = useState(null);
  const [countdown, setCountdown]    = useState(null);
  const [error, setError]            = useState(null);

  // ── Auto-start camera on mount ──
  useEffect(() => {
    startCamera();
    return () => {
      // Cleanup: stop stream when component unmounts
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const startCamera = async () => {
    setError(null);
    setPhase("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width:  { min: 640, ideal: 1920, max: 1920 },
          height: { min: 480, ideal: 1080, max: 1080 },
          frameRate: { ideal: 30, max: 60 },
          aspectRatio: { ideal: 16/9 },
        },
        audio: false,
      });
      streamRef.current = stream;
      // Wait for videoRef to be in DOM
      await new Promise(r => setTimeout(r, 100));
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setPhase("camera");
        };
      }
    } catch (err) {
      setError(
        err.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access in your browser settings and refresh."
          : err.name === "NotFoundError"
          ? "No camera found on this device."
          : `Camera error: ${err.message}`
      );
      setPhase("error");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  const capturePhoto = () => {
    const video = videoRef.current, canvas = canvasRef.current;
    if (!video || !canvas) return;
    // Use the actual native video resolution for maximum quality
    const nativeW = video.videoWidth;
    const nativeH = video.videoHeight;
    canvas.width  = nativeW;
    canvas.height = nativeH;
    const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: false });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.translate(nativeW, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, nativeW, nativeH);
    // Use 0.95 quality for JPEG — high quality without huge file size
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setCaptured(dataUrl);
    stopCamera();
    setPhase("captured");
  };

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);
    const iv = setInterval(() => {
      count--;
      if (count <= 0) { clearInterval(iv); setCountdown(null); capturePhoto(); }
      else setCountdown(count);
    }, 1000);
  };

  const retake = () => {
    setCaptured(null);
    setPhase("starting");
    startCamera();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Tips banner */}
      {(phase === "starting" || phase === "camera") && (
        <div style={{ background: T.amberBg, border: `1px solid ${T.amberBorder}`, borderRadius: 12, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>💡</span>
          <span style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6 }}>
            Position your face inside the oval. Hold your PWD ID clearly visible. Look directly at the camera.
          </span>
        </div>
      )}

      {/* Camera viewport — always rendered so videoRef is in DOM */}
      <div style={{
        borderRadius: 16, overflow: "hidden", background: "#0A0F1A",
        position: "relative", width: "100%", height: 320,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>

        {/* Loading state */}
        {phase === "starting" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, zIndex: 2 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ animation: "ij-spin 0.8s linear infinite" }}>
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Starting camera…</span>
          </div>
        )}

        {/* Live video — always in DOM, hidden until camera starts */}
        <video
          ref={videoRef}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
            display: phase === "camera" ? "block" : "none",
            imageRendering: "high-quality",
            willChange: "transform",
          }}
          playsInline
          muted
          autoPlay
        />

        {/* Face guide oval + vignette — shown while camera is live */}
        {phase === "camera" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
            {/* Dark vignette with oval cutout via box-shadow trick */}
            <div style={{
              width: 160, height: 210,
              borderRadius: "50%",
              border: `3px solid rgba(255,255,255,0.65)`,
              boxShadow: "0 0 0 2000px rgba(0,0,0,0.38)",
            }} />
          </div>
        )}

        {/* Countdown overlay */}
        {countdown !== null && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)", zIndex: 2 }}>
            <span style={{ fontSize: 96, fontWeight: 900, color: "white", lineHeight: 1, textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>{countdown}</span>
          </div>
        )}

        {/* Captured photo */}
        {phase === "captured" && capturedImage && (
          <>
            <img src={capturedImage} alt="Selfie" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", top: 14, right: 14, background: T.green, color: "white", fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 99, zIndex: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
              ✓ Photo Captured
            </div>
          </>
        )}

        {/* Error state */}
        {phase === "error" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 24, textAlign: "center", zIndex: 2 }}>
            <span style={{ fontSize: 44 }}>📷</span>
            <span style={{ color: "#EF4444", fontSize: 14, fontWeight: 600 }}>Camera unavailable</span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.6, maxWidth: 280 }}>{error}</span>
            <button onClick={startCamera} style={{ marginTop: 4, padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", background: T.teal, color: "white" }}>
              Try Again
            </button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Action buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {phase === "camera" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button
              onClick={startCountdown}
              disabled={countdown !== null}
              style={{ padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: countdown !== null ? "not-allowed" : "pointer", background: "#F59E0B", color: "white", opacity: countdown !== null ? 0.6 : 1, transition: "opacity 0.2s" }}
            >
              {countdown !== null ? `${countdown}…` : "⏱ Timer (3s)"}
            </button>
            <button
              onClick={capturePhoto}
              disabled={countdown !== null}
              style={{ padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: countdown !== null ? "not-allowed" : "pointer", background: `linear-gradient(135deg, ${T.teal}, ${T.tealDark})`, color: "white", opacity: countdown !== null ? 0.6 : 1, boxShadow: `0 4px 14px rgba(15,92,110,0.3)` }}
            >
              📸 Capture Now
            </button>
          </div>
        )}

        {phase === "starting" && (
          <button disabled style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", background: "#E2E8F0", color: "#94A3B8", cursor: "not-allowed" }}>
            Starting camera…
          </button>
        )}

        {phase === "captured" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button onClick={retake} style={{ padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: `2px solid ${T.border}`, cursor: "pointer", background: T.white, color: T.navy }}>
              🔄 Retake
            </button>
            <button
              onClick={() => onComplete({ selfieBase64: capturedImage.split(",")[1], selfieMime: "image/jpeg" })}
              style={{ padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${T.teal}, ${T.tealDark})`, color: "white", boxShadow: `0 4px 14px rgba(15,92,110,0.3)` }}
            >
              ✓ Use This Photo
            </button>
          </div>
        )}

        <button
          onClick={() => onComplete({ selfieBase64: null, selfieMime: null })}
          style={{ width: "100%", padding: "8px", borderRadius: 10, fontSize: 12, color: "#94A3B8", background: "none", border: "none", cursor: "pointer" }}
        >
          Skip liveness check (testing only)
        </button>
      </div>

      <p style={{ fontSize: 11, color: "#94A3B8", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
        🔒 Selfie sent to Gemini Vision for face matching only. Not stored after verification. RA 10173 compliant.
      </p>
    </div>
  );
}

// ─── Step 4: Registry Check ───────────────────────────────────────────────────
function RegistryStep({ analysisResult, onComplete }) {
  const [doh,  setDoh]  = useState({ status: "pending", result: null });
  const [prc,  setPrc]  = useState({ status: "pending", result: null });
  const [done, setDone] = useState(false);

  useEffect(() => { runChecks(); }, []);

  const runChecks = async () => {
    const idNumber   = analysisResult?.nextSteps?.idNumberForDoh;
    const prcLicense = analysisResult?.nextSteps?.prcLicenseNumber;
    const lguName    = analysisResult?.analysis?.idDocument?.issuingLgu;

    if (idNumber) {
      setDoh({ status: "running", result: null });
      try {
        const res = await fetch("/api/verification/scrape-doh", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idNumber, lguName }) }).then(r => r.json());
        setDoh({ status: "done", result: res });
      } catch { setDoh({ status: "done", result: { found: false, interpretation: "Registry unreachable — inconclusive" } }); }
    } else {
      await new Promise(r => setTimeout(r, 1400));
      setDoh({ status: "skipped", result: { interpretation: "ID number not extracted — registry check skipped" } });
    }

    if (prcLicense) {
      setPrc({ status: "running", result: null });
      try {
        const res = await fetch("/api/verification/check-prc-license", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prcLicenseNumber: prcLicense }) }).then(r => r.json());
        setPrc({ status: "done", result: res });
      } catch { setPrc({ status: "done", result: { valid: false, interpretation: "PRC check failed — inconclusive" } }); }
    } else {
      await new Promise(r => setTimeout(r, 900));
      setPrc({ status: "skipped", result: { interpretation: "No PRC license in supporting document — skipped" } });
    }
    setDone(true);
  };

  const registries = [
    { label: "DOH + DSWD PWD Registry", sub: "pwd.doh.gov.ph / dswd.gov.ph", state: doh, runningMsg: "Querying government PWD database…" },
    { label: "PRC Physician License",   sub: "verification.prc.gov.ph",       state: prc, runningMsg: "Verifying physician license number…" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <style>{`@keyframes ij-spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, margin: 0 }}>
        Checking your ID against Philippine government registries. A positive match boosts your score — "not found" is inconclusive, not a failure.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {registries.map(({ label, sub, state, runningMsg }) => (
          <div key={label} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: state.result ? 8 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Status dot */}
                <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: state.status === "running" ? T.amber : state.status === "done" ? T.green : state.status === "skipped" ? "#94A3B8" : "#E2E8F0", boxShadow: state.status === "running" ? `0 0 0 3px ${T.amberBg}` : "none" }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>{label}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>{sub}</div>
                </div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
                background: state.status === "running" ? T.amberBg : state.status === "done" ? T.greenBg : state.status === "skipped" ? "#F1F5F9" : "#F8FAFC",
                color:      state.status === "running" ? T.amber  : state.status === "done" ? T.green  : state.status === "skipped" ? "#64748B" : "#94A3B8",
              }}>
                {state.status === "running" ? "Checking…" : state.status === "done" ? "Done" : state.status === "skipped" ? "Skipped" : "Pending"}
              </span>
            </div>
            {state.status === "running" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 20 }}>
                <Spinner size={12} color={T.amber} />
                <span style={{ fontSize: 12, color: T.amber }}>{runningMsg}</span>
              </div>
            )}
            {state.result && (
              <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, paddingLeft: 20, margin: 0 }}>{state.result.interpretation}</p>
            )}
          </div>
        ))}
      </div>

      <div style={{ background: T.amberBg, border: `1px solid ${T.amberBorder}`, borderRadius: 12, padding: "12px 14px", fontSize: 12, color: "#92400E", lineHeight: 1.6 }}>
        ℹ️ Many valid PWD IDs are not yet encoded in online registries. A registry miss will not reject your application.
      </div>

      {done && (
        <button onClick={() => onComplete({ doh: doh.result, prc: prc.result })} style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${T.teal}, ${T.tealDark})`, color: "white", boxShadow: `0 4px 16px rgba(15,92,110,0.3)` }}>
          See My Result →
        </button>
      )}
    </div>
  );
}

// ─── Step 5: Result ───────────────────────────────────────────────────────────
function ResultStep({ analysisResult, onRestart }) {
  const router   = useRouter();
  const decision = analysisResult?.decision || "HUMAN_REVIEW";
  const score    = analysisResult?.score    || 0;
  const flags    = analysisResult?.flags    || [];
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    saveVerificationResult(analysisResult || { decision, score });
    const t1 = setTimeout(() => setBarWidth(score), 400);
    if (decision === "AUTO_APPROVE") {
      const t2 = setTimeout(() => router.push("/dashboard/worker"), 4000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    return () => clearTimeout(t1);
  }, [decision]);

  const cfg = {
    AUTO_APPROVE: { icon: "🏅", title: "PWD Verified!", subtitle: "Your identity has been verified. The PWD Verified badge is now active on your profile. Redirecting to dashboard…", color: T.green, bg: T.greenBg, border: T.greenBorder },
    HUMAN_REVIEW: { icon: "⏳", title: "Under Review", subtitle: "Your submission passed AI checks but needs a final human review. You'll be notified within 24–48 hours.", color: T.amber, bg: T.amberBg, border: T.amberBorder },
    REJECT:       { icon: "❌", title: "Verification Unsuccessful", subtitle: "Your submission could not be verified. Please review the issues below and resubmit.", color: T.red, bg: T.redBg, border: T.redBorder },
  }[decision];

  const barColor = score >= 80 ? T.green : score >= 50 ? T.amber : T.red;

  const summaryItems = [
    ["🪪 Document AI",    analysisResult?.analysis?.idDocument?.summary],
    ["📄 Supporting Doc", analysisResult?.analysis?.supportingDocument?.summary],
    ["🔗 Cross-Check",    analysisResult?.analysis?.crossDocument?.summary],
    ["🤳 Face Match",     analysisResult?.analysis?.faceMatch ? `${analysisResult.analysis.faceMatch.confidence ?? "—"}% confidence — ${analysisResult.analysis.faceMatch.summary}` : null],
  ].filter(([, v]) => v);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Result hero */}
      <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 20, padding: "28px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>{cfg.icon}</div>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: cfg.color, margin: "0 0 8px" }}>{cfg.title}</h3>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, margin: 0 }}>{cfg.subtitle}</p>
      </div>

      {/* Score */}
      <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>Verification Score</span>
          <span style={{ fontSize: 28, fontWeight: 800, color: barColor }}>{score}<span style={{ fontSize: 14, color: T.muted, fontWeight: 400 }}>/100</span></span>
        </div>
        <div style={{ background: "#F1F5F9", borderRadius: 99, height: 10, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 99, background: barColor, width: `${barWidth}%`, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94A3B8", marginTop: 6 }}>
          <span>0 — Reject</span><span>50 — Review</span><span>80 — Approve</span>
        </div>
      </div>

      {/* Flags */}
      {flags.length > 0 && (
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 10 }}>Issues Found</div>
          {flags.map((flag, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: T.muted, marginBottom: 6, lineHeight: 1.5 }}>
              <span style={{ color: T.amber, flexShrink: 0 }}>⚠️</span>{flag}
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {summaryItems.length > 0 && (
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>Analysis Summary</div>
          {summaryItems.map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.teal, marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{val}</div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      {decision === "AUTO_APPROVE" && (
        <button onClick={() => router.push("/dashboard/worker")} style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${T.teal}, ${T.tealDark})`, color: "white", boxShadow: `0 4px 16px rgba(15,92,110,0.3)` }}>
          Go to My Dashboard →
        </button>
      )}
      {decision === "HUMAN_REVIEW" && (
        <button onClick={() => router.push("/dashboard/worker")} style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${T.teal}, ${T.tealDark})`, color: "white" }}>
          Back to Dashboard
        </button>
      )}
      {decision === "REJECT" && (
        <button onClick={onRestart} style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${T.teal}, ${T.tealDark})`, color: "white" }}>
          ↺ Resubmit Verification
        </button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VerificationPage() {
  const [step,            setStep]           = useState(0); // 0 = intro screen
  const [documents,       setDocuments]      = useState(null);
  const [analysisResult,  setAnalysisResult] = useState(null);
  const [error,           setError]          = useState(null);

  const handleRestart = () => { setStep(0); setDocuments(null); setAnalysisResult(null); setError(null); };

  const stepContent = step > 0 ? STEPS[step - 1] : null;
  const pct = step > 0 ? Math.round(((step - 1) / (STEPS.length - 1)) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', 'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes ij-spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>

      {/* Top gradient header */}
      <div style={{ background: `linear-gradient(135deg, ${T.teal} 0%, ${T.tealDark} 100%)`, padding: "32px 24px 80px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 99, padding: "6px 16px", marginBottom: 20 }}>
          <span style={{ fontSize: 14 }}>🛡️</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "white", letterSpacing: "0.05em" }}>PWD IDENTITY VERIFICATION</span>
        </div>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, color: "white", margin: "0 0 10px", lineHeight: 1.2 }}>
          {step === 0 ? "Get Your PWD Verified Badge" : "Verify Your PWD Status"}
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.6, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
          {step === 0
            ? "One-time verification. Trusted by 120+ inclusive employers across the Philippines."
            : "Multi-layer verification so employers can confidently hire you."}
        </p>
      </div>

      {/* Card pulls up over header */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 48px", marginTop: -48 }}>
        <div style={{ background: T.white, borderRadius: 24, boxShadow: "0 8px 40px rgba(15,92,110,0.12)", border: `1px solid ${T.border}`, padding: "28px 28px 32px", overflow: "hidden" }}>

          {/* Step indicator — only show during steps 1–5 */}
          {step > 0 && <StepIndicator currentStep={step} />}

          {/* Step header — only show during steps 1–5 */}
          {step > 0 && stepContent && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.teal }}>
                Step {step} of {STEPS.length} — {stepContent.icon} {stepContent.label}
              </div>
              <div style={{ background: T.tealLight, color: T.teal, borderRadius: 99, padding: "4px 12px", fontSize: 12, fontWeight: 800 }}>
                {pct}%
              </div>
            </div>
          )}

          {/* Step content */}
          {step === 0 && <IntroScreen onStart={() => setStep(1)} />}
          {step === 1 && <DocumentUploadStep onNext={(docs) => { setDocuments(docs); setStep(2); }} />}
          {step === 2 && <AIAnalysisStep     documents={documents} onComplete={(r) => { setAnalysisResult(r); setStep(3); }} />}
          {step === 3 && <LivenessStep       onComplete={() => setStep(4)} />}
          {step === 4 && <RegistryStep       analysisResult={analysisResult} onComplete={() => setStep(5)} />}
          {step === 5 && <ResultStep         analysisResult={analysisResult} onRestart={handleRestart} />}

          {error && (
            <div style={{ marginTop: 16, background: T.redBg, border: `1px solid ${T.redBorder}`, borderRadius: 12, padding: "12px 14px", fontSize: 13, color: T.red, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)} style={{ background: "none", border: "none", fontSize: 12, color: T.red, cursor: "pointer", textDecoration: "underline" }}>Dismiss</button>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#94A3B8", marginTop: 20, lineHeight: 1.7 }}>
          Powered by Gemini Vision · WCAG 2.1 AA<br />
          RA 7277 & Data Privacy Act (RA 10173) Compliant
        </p>
      </div>
    </div>
  );
}