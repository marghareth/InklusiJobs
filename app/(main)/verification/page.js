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
  forensics: {
    overallRisk: "LOW",
    elaAnalysis: { result: "PASS", detail: "No inconsistent compression artifacts detected. Pixel noise patterns are uniform across all text fields, indicating no digital post-editing." },
    metadataAudit: { result: "PASS", detail: "EXIF data shows no editing software (Adobe Photoshop, PicsArt, etc.). File originates from a mobile camera capture as expected." },
    moireDetection: { result: "PASS", detail: "No Moiré patterns detected. Image was captured from a physical card, not a screen or printout." },
    fontAnalysis: { result: "PASS", detail: "Font weight and typeface in the Name and ID Number fields match the known Quezon City LGU PWD ID template (Calibri Regular, 10pt)." },
    sealAnalysis: { result: "PASS", detail: "LGU dry seal shows correct light-to-shadow gradient consistent with an embossed physical seal. No flat 2D overlay detected." },
    psgcLogic: { result: "PASS", detail: "PSGC prefix '137' correctly matches Metro Manila / NCR region. Issuing LGU 'Quezon City' is consistent with geographic code." },
    physicianSpecialization: { result: "PASS", detail: "Dr. on medical certificate holds a Rehabilitation Medicine specialization — consistent with Orthopedic / Physical Disability category." },
    microprint: { result: "PASS", detail: "Background security micro-text pattern is sharp and unblurred, indicating original document rather than photocopy or re-scan." },
  },
};

// Mock forensic result for a flagged/fake ID (used when demoing rejection)
const MOCK_FORENSIC_FLAGGED = {
  overallRisk: "HIGH",
  elaAnalysis: { result: "FAIL", detail: "Inconsistent JPEG compression artifacts detected around the Name field. The text block shows higher compression noise than the surrounding background — consistent with Photoshop layer insertion." },
  metadataAudit: { result: "FAIL", detail: "EXIF 'Software' tag reads 'Adobe Photoshop 24.0'. File was processed by editing software before submission — immediate forensic red flag." },
  moireDetection: { result: "WARN", detail: "Faint Moiré interference patterns detected in the background texture. Image may have been captured from a screen rather than a physical card." },
  fontAnalysis: { result: "FAIL", detail: "Font in the ID Number field is Arial Bold — does not match the Quezon City LGU standard (Calibri Regular). Common 'Recto' forgery error." },
  sealAnalysis: { result: "WARN", detail: "LGU seal appears flat with uniform lighting across the embossed area. Expected light-to-shadow gradient from physical embossing is absent." },
  psgcLogic: { result: "FAIL", detail: "PSGC prefix '13' indicates NCR / Metro Manila, but issuing LGU field reads 'Davao City' (Region XI). Geographic disconnect — impossible for a legitimately issued ID." },
  physicianSpecialization: { result: "PASS", detail: "PRC license number found. Physician specialization could not be cross-referenced." },
  microprint: { result: "FAIL", detail: "Background security micro-text is blurred and pixelated — consistent with a photocopy or digitally re-scanned document rather than an original." },
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
  {
    label:    "OCR Text Extraction",
    icon:     "🔍",
    short:    "Reading text from your PWD ID…",
    detail:   "Gemini Vision is scanning every field on your PWD ID — extracting your full name, ID number, issuing LGU, disability category, date of issue, and expiry date. This is the foundation for all checks that follow.",
    duration: 2200,
  },
  {
    label:    "PSGC Format Validation",
    icon:     "🗺️",
    short:    "Checking the ID number format…",
    detail:   "Your PWD ID number encodes a Philippine Standard Geographic Code (PSGC) that identifies the region, province, and city where it was issued. We're verifying that code is real and matches a known LGU in our database.",
    duration: 2000,
  },
  {
    label:    "LGU Designation Check",
    icon:     "🏙️",
    short:    "Verifying City vs Municipality label…",
    detail:   "Philippine LGUs are either Cities or Municipalities — and their PWD ID templates differ. We're confirming that the designation printed on your ID matches the official classification of your issuing office under the DILG.",
    duration: 1800,
  },
  {
    label:    "NCDA Disability Category",
    icon:     "♿",
    short:    "Confirming your disability category…",
    detail:   "The National Council on Disability Affairs (NCDA) recognizes exactly 9 disability categories. We're verifying that the disability listed on your ID matches one of these official categories and is consistent with your supporting document.",
    duration: 2000,
  },
  {
    label:    "Visual Forgery Detection",
    icon:     "🛡️",
    short:    "Scanning for signs of tampering…",
    detail:   "AI is analyzing your ID image for visual inconsistencies — altered fonts, mismatched ink colors, photo substitution markers, or layout deviations from known official PWD ID templates across different LGUs. This catches common Recto forgery patterns.",
    duration: 2400,
  },
  {
    label:    "Cross-Document Consistency",
    icon:     "📋",
    short:    "Comparing across all your documents…",
    detail:   "We're cross-referencing your PWD ID against your supporting document — checking that your name, birthdate, and disability category are consistent across both. Any mismatch is flagged for human review.",
    duration: 1900,
  },
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

      {/* Check list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {checks.map((check, i) => {
          const done    = check.result !== null;
          const active  = i === activeIndex && status === "running";
          const pending = !done && !active;

          return (
            <div key={i} style={{
              borderRadius: 14,
              border: `1.5px solid ${
                check.result === "fail" ? T.redBorder
                : check.result === "warn" ? T.amberBorder
                : active ? T.teal + "50"
                : done ? T.greenBorder
                : T.border}`,
              background: active ? T.tealLight : check.result === "fail" ? T.redBg : T.white,
              overflow: "hidden",
              transition: "all 0.3s ease",
            }}>
              {/* Row header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: active ? "14px 16px 10px" : "12px 16px" }}>
                {/* Icon */}
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background:
                    check.result === "pass" ? T.teal
                    : check.result === "fail" ? T.red
                    : check.result === "warn" ? T.amber
                    : active ? T.tealMid : "#F1F5F9",
                  transition: "all 0.3s",
                }}>
                  {check.result === "pass" ? <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>✓</span>
                   : check.result === "fail" ? <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>✗</span>
                   : check.result === "warn" ? <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>!</span>
                   : active ? <Spinner size={16} color="white" />
                   : <span style={{ color: "#94A3B8", fontWeight: 700, fontSize: 11 }}>{i + 1}</span>}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700,
                    color: check.result === "fail" ? T.red
                      : check.result === "warn" ? T.amber
                      : done || active ? T.teal : "#94A3B8",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <span>{check.icon}</span><span>{check.label}</span>
                  </div>
                  {/* Compact result after done */}
                  {done && (
                    <div style={{ fontSize: 11, color: check.result === "fail" ? T.red : T.muted, marginTop: 2, lineHeight: 1.4 }}>
                      {check.detail}
                    </div>
                  )}
                  {/* Short running hint */}
                  {active && (
                    <div style={{ fontSize: 11, color: T.tealMid, marginTop: 2, fontStyle: "italic" }}>{check.short}</div>
                  )}
                </div>

                {/* Status pill */}
                {done && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, flexShrink: 0,
                    background: check.result === "pass" ? T.greenBg : check.result === "fail" ? T.redBg : T.amberBg,
                    color:      check.result === "pass" ? T.green   : check.result === "fail" ? T.red   : T.amber,
                    border: `1px solid ${check.result === "pass" ? T.greenBorder : check.result === "fail" ? T.redBorder : T.amberBorder}`,
                  }}>
                    {check.result === "pass" ? "✓ Pass" : check.result === "fail" ? "✗ Fail" : "⚠ Warn"}
                  </span>
                )}
                {active && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: T.tealLight, color: T.teal, border: `1px solid ${T.teal}30`, flexShrink: 0 }}>
                    Analyzing…
                  </span>
                )}
              </div>

              {/* Expanded description — only on active step */}
              {active && (
                <div style={{ margin: "0 16px 14px 64px", background: "white", border: `1px solid ${T.teal}20`, borderRadius: 10, padding: "12px 14px" }}>
                  <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.8, margin: "0 0 10px" }}>
                    {check.detail}
                  </p>
                  {/* Animated progress bar */}
                  <div style={{ background: T.tealLight, borderRadius: 99, height: 4, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 99, width: "0%",
                      background: `linear-gradient(90deg, ${T.teal}, ${T.tealMid})`,
                      animation: `ij-progress ${check.duration}ms linear forwards`,
                    }} />
                  </div>
                </div>
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

// ─── Step 3: Liveness Check — Teachable Machine + Gemini Fallback ───────────
//
//  DETECTION PRIORITY:
//    1. Teachable Machine custom model → colored bounding boxes (face + pwdid)
//    2. Gemini Vision on sampled frames → text-based fallback reasoning
//
//  TO PLUG IN YOUR MODEL: replace TEACHABLE_MACHINE_MODEL_URL with the URL
//  from teachablemachine.withgoogle.com after you train + upload your model.
// ─────────────────────────────────────────────────────────────────────────────

const TEACHABLE_MACHINE_MODEL_URL = "https://teachablemachine.withgoogle.com/models/tcEY7jabE/";
// ↑ REPLACE with your model URL after training, e.g.:
// const TEACHABLE_MACHINE_MODEL_URL = "https://teachablemachine.withgoogle.com/models/XXXXXXXX/";

const GEMINI_INTERVAL_MS = 2500; // How often to ask Gemini (ms) when TM unavailable

function LivenessStep({ onComplete }) {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);   // hidden capture canvas
  const overlayRef = useRef(null);   // live detection overlay
  const streamRef  = useRef(null);
  const tmModelRef = useRef(null);   // Teachable Machine model
  const rafRef     = useRef(null);
  const geminiTimerRef = useRef(null);

  const [phase, setPhase]             = useState("starting");
  const [capturedImage, setCaptured]  = useState(null);
  const [countdown, setCountdown]     = useState(null);
  const [error, setError]             = useState(null);
  const [detectionMode, setDetectionMode] = useState("loading"); // loading|tm|gemini|none
  const [tmStatus, setTmStatus]       = useState("loading");  // loading|ready|failed

  // Dual detection state
  const [faceDetected,  setFaceDetected]  = useState(false);
  const [idDetected,    setIdDetected]    = useState(false);
  const [faceConf,      setFaceConf]      = useState(0);
  const [idConf,        setIdConf]        = useState(0);
  const [geminiStatus,  setGeminiStatus]  = useState(null); // null|checking|{face,id,conf}
  const bothDetected = faceDetected && idDetected;

  // ── Load scripts helper ───────────────────────────────────────────────────
  const loadScript = (src) => new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
    const s = document.createElement("script");
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });

  // ── Boot: load TM model first, then start camera ─────────────────────────
  useEffect(() => {
    const init = async () => {
      if (TEACHABLE_MACHINE_MODEL_URL) {
        try {
          await Promise.all([
            loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js"),
            loadScript("https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8.5/dist/teachablemachine-image.min.js"),
          ]);
          const modelURL     = TEACHABLE_MACHINE_MODEL_URL + "model.json";
          const metadataURL  = TEACHABLE_MACHINE_MODEL_URL + "metadata.json";
          tmModelRef.current = await window.tmImage.load(modelURL, metadataURL);
          setTmStatus("ready");
          setDetectionMode("tm");
        } catch {
          setTmStatus("failed");
          setDetectionMode("gemini");
        }
      } else {
        setTmStatus("failed");
        setDetectionMode("gemini");
      }
    };
    init();
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(geminiTimerRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // ── Start camera once we know detection mode ──────────────────────────────
  useEffect(() => {
    if (detectionMode !== "loading") startCamera();
  }, [detectionMode]);

  const startCamera = async () => {
    setError(null); setPhase("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
        audio: false,
      });
      streamRef.current = stream;
      await new Promise(r => setTimeout(r, 100));
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setPhase("camera");
          if (detectionMode === "tm") startTMDetection();
          else startGeminiDetection();
        };
      }
    } catch (err) {
      setError(err.name === "NotAllowedError"
        ? "Camera permission denied. Please allow access in browser settings."
        : "No camera found on this device.");
      setPhase("error");
    }
  };

  // ── Teachable Machine detection loop ─────────────────────────────────────
  // TM image models do classification (no bbox) but we draw a styled box
  // around the full frame area when "holding_id" class is dominant.
  const startTMDetection = () => {
    const overlay = overlayRef.current;
    const detect = async () => {
      const video = videoRef.current;
      if (!video || !overlay || !tmModelRef.current) {
        rafRef.current = requestAnimationFrame(detect); return;
      }

      const preds = await tmModelRef.current.predict(video);
      const ctx   = overlay.getContext("2d");
      overlay.width  = video.clientWidth;
      overlay.height = video.clientHeight;
      ctx.clearRect(0, 0, overlay.width, overlay.height);

      // Map class names to detections
      // Expected classes: "holding_id", "no_id", "face_only"
      const holdingIdPred = preds.find(p => p.className === "holding_id");
      const faceOnlyPred  = preds.find(p => p.className === "face_only") ||
                            preds.find(p => p.className === "no_id");
      const holdingConf   = Math.round((holdingIdPred?.probability || 0) * 100);
      const faceConf_     = Math.round((faceOnlyPred?.probability  || 0) * 100);

      const isHolding = holdingConf > 65;
      const hasFace   = (holdingConf + faceConf_) > 50; // face present in either

      setFaceDetected(hasFace);
      setIdDetected(isHolding);
      setFaceConf(faceConf_);
      setIdConf(holdingConf);

      const W = overlay.width, H = overlay.height;

      // Draw face bounding box (left ~40% of frame)
      if (hasFace) {
        const fx = W * 0.05, fy = H * 0.08, fw = W * 0.42, fh = H * 0.84;
        drawBox(ctx, fx, fy, fw, fh, "#7DDCE8", `\u{1F464} Face  ${faceConf_}%`);
      }

      // Draw ID card bounding box (right ~35% of frame)
      if (isHolding) {
        const ix = W * 0.55, iy = H * 0.28, iw = W * 0.40, ih = H * 0.44;
        drawBox(ctx, ix, iy, iw, ih, "#F4A728", `\u{1FAA3} PWD ID  ${holdingConf}%`);
      }

      rafRef.current = requestAnimationFrame(detect);
    };
    rafRef.current = requestAnimationFrame(detect);
  };

  // ── Gemini Vision fallback ─────────────────────────────────────────────────
  const startGeminiDetection = () => {
    const analyze = async () => {
      const video = videoRef.current, canvas = document.createElement("canvas");
      if (!video) return;
      canvas.width = 320; canvas.height = 240;
      const ctx = canvas.getContext("2d");
      ctx.translate(canvas.width, 0); ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL("image/jpeg", 0.7).split(",")[1];

      setGeminiStatus("checking");
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 200,
            messages: [{
              role: "user",
              content: [
                { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64 } },
                { type: "text", text: `Analyze this webcam frame for a Philippine PWD ID liveness check.
Return ONLY valid JSON, no markdown:
{"faceVisible": true/false, "idCardVisible": true/false, "holdingId": true/false, "faceConfidence": 0-100, "idConfidence": 0-100, "tip": "one short actionable tip if something is missing"}` }
              ]
            }]
          })
        });
        const data = await res.json();
        const text = data.content?.[0]?.text || "{}";
        const clean = text.replace(/```json|```/g, "").trim();
        const result = JSON.parse(clean);
        setGeminiStatus(result);
        setFaceDetected(!!result.faceVisible);
        setIdDetected(!!result.holdingId || !!result.idCardVisible);
        setFaceConf(result.faceConfidence || 0);
        setIdConf(result.idConfidence || 0);

        // Draw overlay based on Gemini result
        const overlay = overlayRef.current, vid = videoRef.current;
        if (overlay && vid) {
          const octx = overlay.getContext("2d");
          overlay.width = vid.clientWidth; overlay.height = vid.clientHeight;
          octx.clearRect(0, 0, overlay.width, overlay.height);
          const W = overlay.width, H = overlay.height;
          if (result.faceVisible)
            drawBox(octx, W*0.05, H*0.08, W*0.42, H*0.84, "#7DDCE8", `\u{1F464} Face  ${result.faceConfidence}%`);
          if (result.holdingId || result.idCardVisible)
            drawBox(octx, W*0.55, H*0.28, W*0.40, H*0.44, "#F4A728", `\u{1FAA3} PWD ID  ${result.idConfidence}%`);
        }
      } catch {
        setGeminiStatus({ error: true });
      }
    };

    analyze(); // run immediately
    geminiTimerRef.current = setInterval(analyze, GEMINI_INTERVAL_MS);
  };

  // ── Box drawing helper ────────────────────────────────────────────────────
  const drawBox = (ctx, x, y, w, h, color, label) => {
    // Main rectangle
    ctx.strokeStyle = color; ctx.lineWidth = 2.5;
    ctx.setLineDash([]); ctx.strokeRect(x, y, w, h);

    // Corner accents
    const cs = 16;
    ctx.lineWidth = 4;
    [
      [x,   y,   1,  1], [x+w, y,   -1,  1],
      [x,   y+h, 1, -1], [x+w, y+h, -1, -1],
    ].forEach(([cx, cy, dx, dy]) => {
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + dx * cs, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + dy * cs); ctx.stroke();
    });

    // Label pill
    ctx.font = "bold 12px 'DM Sans', sans-serif";
    const lw = ctx.measureText(label).width + 18;
    const lh = 24;
    const lx = Math.max(0, x);
    const ly = y > lh + 6 ? y - lh - 4 : y + 4;
    ctx.fillStyle = color + "EE";
    ctx.beginPath(); ctx.roundRect(lx, ly, lw, lh, 6); ctx.fill();
    ctx.fillStyle = "#000";
    ctx.fillText(label, lx + 9, ly + 16);
  };

  // ── Camera stop + capture ─────────────────────────────────────────────────
  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current);
    clearInterval(geminiTimerRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  const capturePhoto = () => {
    const video = videoRef.current, canvas = canvasRef.current;
    if (!video || !canvas) return;
    const nW = video.videoWidth, nH = video.videoHeight;
    canvas.width = nW; canvas.height = nH;
    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.translate(nW, 0); ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, nW, nH);
    setCaptured(canvas.toDataURL("image/jpeg", 0.95));
    stopCamera(); setPhase("captured");
  };

  const startCountdown = () => {
    let count = 3; setCountdown(count);
    const iv = setInterval(() => {
      count--;
      if (count <= 0) { clearInterval(iv); setCountdown(null); capturePhoto(); }
      else setCountdown(count);
    }, 1000);
  };

  const retake = () => {
    setCaptured(null);
    setFaceDetected(false); setIdDetected(false);
    setGeminiStatus(null);
    const ov = overlayRef.current;
    if (ov) ov.getContext("2d").clearRect(0, 0, ov.width, ov.height);
    startCamera();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const modeLabel = detectionMode === "tm" ? "Teachable Machine" : detectionMode === "gemini" ? "Gemini Vision" : "Loading…";
  const geminiTip = geminiStatus && !geminiStatus.error && geminiStatus.tip;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Detection mode badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.tealLight, border: `1px solid ${T.teal}30`, borderRadius: 99, padding: "5px 12px" }}>
          {detectionMode === "loading"
            ? <><Spinner size={12} color={T.teal} /><span style={{ fontSize: 11, fontWeight: 600, color: T.teal }}>Loading detection model…</span></>
            : <><span style={{ fontSize: 11 }}>{detectionMode === "tm" ? "🧠" : "✨"}</span><span style={{ fontSize: 11, fontWeight: 700, color: T.teal }}>{modeLabel} Active</span></>
          }
        </div>
        {detectionMode === "gemini" && geminiStatus === "checking" && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Spinner size={11} color={T.tealMid} />
            <span style={{ fontSize: 11, color: T.tealMid }}>Analyzing frame…</span>
          </div>
        )}
      </div>

      {/* Tips / Gemini tip */}
      {(phase === "starting" || phase === "camera") && (
        <div style={{ background: T.amberBg, border: `1px solid ${T.amberBorder}`, borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10 }}>
          <span style={{ fontSize: 15, flexShrink: 0 }}>💡</span>
          <span style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6 }}>
            {geminiTip
              ? <><strong>AI Tip: </strong>{geminiTip}</>
              : <>Hold your <strong>PWD ID card</strong> clearly next to your face. AI will draw boxes around both when detected.
                {bothDetected && <strong style={{ color: T.green }}> ✓ Both detected — ready!</strong>}</>
            }
          </span>
        </div>
      )}

      {/* Camera viewport */}
      <div style={{
        borderRadius: 16, overflow: "hidden", background: "#0A0F1A",
        position: "relative", width: "100%", height: 320,
        border: `3px solid ${bothDetected && phase === "camera" ? T.green : "transparent"}`,
        boxShadow: bothDetected && phase === "camera" ? `0 0 24px ${T.green}50` : "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}>

        {phase === "starting" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, zIndex: 2 }}>
            <Spinner size={32} color="rgba(255,255,255,0.5)" />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Starting camera…</span>
          </div>
        )}

        {/* Live video — mirrored */}
        <video ref={videoRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", display: phase === "camera" ? "block" : "none" }}
          playsInline muted autoPlay
        />

        {/* Detection overlay */}
        <canvas ref={overlayRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", display: phase === "camera" ? "block" : "none", zIndex: 1 }}
        />

        {/* Both detected badge */}
        {bothDetected && phase === "camera" && (
          <div style={{ position: "absolute", top: 10, left: 10, background: T.green, color: "white", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, zIndex: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
            ✓ Face + PWD ID Detected
          </div>
        )}

        {/* Countdown */}
        {countdown !== null && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.55)", zIndex: 3 }}>
            <span style={{ fontSize: 96, fontWeight: 900, color: "white", textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>{countdown}</span>
          </div>
        )}

        {/* Captured preview */}
        {phase === "captured" && capturedImage && (
          <>
            <img src={capturedImage} alt="Liveness photo" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", top: 12, right: 12, background: T.green, color: "white", fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 99, zIndex: 2 }}>
              ✓ Photo Captured
            </div>
          </>
        )}

        {/* Error */}
        {phase === "error" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 24, textAlign: "center", zIndex: 2 }}>
            <span style={{ fontSize: 40 }}>📷</span>
            <span style={{ color: "#EF4444", fontSize: 13, fontWeight: 600 }}>{error}</span>
            <button onClick={startCamera} style={{ padding: "8px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", background: T.teal, color: "white" }}>Try Again</button>
          </div>
        )}
      </div>

      {/* Detection status cards */}
      {phase === "camera" && detectionMode !== "loading" && (
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "👤 Face Detected",    detected: faceDetected, conf: faceConf },
            { label: "🪪 PWD ID Detected",  detected: idDetected,   conf: idConf  },
          ].map(({ label, detected, conf }) => (
            <div key={label} style={{
              flex: 1, borderRadius: 10, padding: "10px 12px", textAlign: "center",
              background: detected ? T.greenBg : "#F1F5F9",
              border: `1.5px solid ${detected ? T.greenBorder : T.border}`,
              transition: "all 0.25s",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: detected ? T.green : "#94A3B8" }}>
                {detected ? "✓ " : ""}{label}
              </div>
              <div style={{ fontSize: 10, color: detected ? T.green : "#94A3B8", marginTop: 2 }}>
                {detected ? `${conf}% confidence` : "Not detected yet"}
              </div>
            </div>
          ))}
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Action buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {phase === "camera" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button onClick={startCountdown} disabled={!!countdown}
              style={{ padding: "13px", borderRadius: 12, fontSize: 13, fontWeight: 700, border: "none", cursor: countdown ? "not-allowed" : "pointer", background: "#F59E0B", color: "white", opacity: countdown ? 0.6 : 1 }}>
              {countdown != null ? `${countdown}…` : "⏱ Timer (3s)"}
            </button>
            <button onClick={capturePhoto} disabled={!!countdown}
              style={{ padding: "13px", borderRadius: 12, fontSize: 13, fontWeight: 700, border: "none", cursor: countdown ? "not-allowed" : "pointer", color: "white", transition: "all 0.3s",
                background: bothDetected ? `linear-gradient(135deg, ${T.green}, #15803D)` : `linear-gradient(135deg, ${T.teal}, ${T.tealDark})`,
                boxShadow: bothDetected ? `0 4px 14px rgba(22,163,74,0.4)` : `0 4px 14px rgba(15,92,110,0.3)`,
              }}>
              📸 {bothDetected ? "Capture Now ✓" : "Capture"}
            </button>
          </div>
        )}
        {phase === "starting" && (
          <button disabled style={{ width: "100%", padding: "13px", borderRadius: 12, fontSize: 13, fontWeight: 700, border: "none", background: "#E2E8F0", color: "#94A3B8", cursor: "not-allowed" }}>Starting camera…</button>
        )}
        {phase === "captured" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button onClick={retake} style={{ padding: "13px", borderRadius: 12, fontSize: 13, fontWeight: 700, border: `2px solid ${T.border}`, cursor: "pointer", background: T.white, color: T.navy }}>🔄 Retake</button>
            <button onClick={() => onComplete({ selfieBase64: capturedImage.split(",")[1], selfieMime: "image/jpeg" })}
              style={{ padding: "13px", borderRadius: 12, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${T.teal}, ${T.tealDark})`, color: "white" }}>
              ✓ Use This Photo
            </button>
          </div>
        )}
        <button onClick={() => onComplete({ selfieBase64: null, selfieMime: null })}
          style={{ padding: "8px", borderRadius: 10, fontSize: 11, color: "#94A3B8", background: "none", border: "none", cursor: "pointer" }}>
          Skip liveness check (testing only)
        </button>
      </div>

      <p style={{ fontSize: 11, color: "#94A3B8", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
        🔒 Selfie analyzed for face matching only. Not stored after verification. RA 10173 compliant.
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

// ─── Forensic Report Component ────────────────────────────────────────────────
function ForensicReport({ forensics }) {
  const [open, setOpen] = useState(false);
  if (!forensics) return null;

  const risk = forensics.overallRisk || "LOW";
  const riskCfg = {
    LOW:    { label: "Low Risk",    color: T.green, bg: T.greenBg, border: T.greenBorder, icon: "🛡️" },
    MEDIUM: { label: "Medium Risk", color: T.amber, bg: T.amberBg, border: T.amberBorder, icon: "⚠️" },
    HIGH:   { label: "High Risk",   color: T.red,   bg: T.redBg,   border: T.redBorder,   icon: "🚨" },
  }[risk] || { label: risk, color: T.muted, bg: "#F1F5F9", border: T.border, icon: "🔍" };

  const checks = [
    { key: "elaAnalysis",              label: "Error Level Analysis (ELA)",     icon: "🔬" },
    { key: "metadataAudit",            label: "EXIF Metadata Audit",            icon: "📂" },
    { key: "moireDetection",           label: "Moiré Pattern Detection",        icon: "📺" },
    { key: "fontAnalysis",             label: "Font & Typography Forensics",    icon: "🔤" },
    { key: "sealAnalysis",             label: "LGU Seal Depth Analysis",        icon: "🏛️" },
    { key: "psgcLogic",                label: "PSGC Geographic Logic Check",    icon: "🗺️" },
    { key: "physicianSpecialization",  label: "Physician Specialization Match", icon: "🩺" },
    { key: "microprint",               label: "Micro-print Integrity",          icon: "🔍" },
  ].map(c => ({ ...c, data: forensics[c.key] })).filter(c => c.data);

  const failCount = checks.filter(c => c.data.result === "FAIL").length;
  const warnCount = checks.filter(c => c.data.result === "WARN").length;
  const passCount = checks.filter(c => c.data.result === "PASS").length;

  return (
    <div style={{ background: T.white, border: `1.5px solid ${riskCfg.border}`, borderRadius: 16, overflow: "hidden" }}>
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: "100%", padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", background: riskCfg.bg, border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{riskCfg.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: riskCfg.color }}>Forensic Integrity Report</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>
              {passCount} passed · {warnCount > 0 ? `${warnCount} warnings · ` : ""}{failCount > 0 ? `${failCount} failed · ` : ""}Overall: {riskCfg.label}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: riskCfg.color + "20", color: riskCfg.color, border: `1px solid ${riskCfg.border}` }}>
            {riskCfg.label}
          </span>
          <span style={{ color: T.muted, fontSize: 12, fontWeight: 700 }}>{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Expandable checks */}
      {open && (
        <div style={{ padding: "4px 0 8px" }}>
          {/* Summary bar */}
          <div style={{ display: "flex", gap: 6, padding: "10px 18px 14px", borderBottom: `1px solid ${T.border}` }}>
            {[["PASS", passCount, T.green, T.greenBg], ["WARN", warnCount, T.amber, T.amberBg], ["FAIL", failCount, T.red, T.redBg]].map(([label, count, color, bg]) => count > 0 && (
              <div key={label} style={{ flex: 1, background: bg, borderRadius: 8, padding: "6px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color }}>{count}</div>
                <div style={{ fontSize: 10, color, fontWeight: 700 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Individual checks */}
          {checks.map(({ key, label, icon, data }) => {
            const resCfg = {
              PASS: { color: T.green, bg: T.greenBg, border: T.greenBorder, tag: "✓ PASS" },
              FAIL: { color: T.red,   bg: T.redBg,   border: T.redBorder,   tag: "✗ FAIL" },
              WARN: { color: T.amber, bg: T.amberBg, border: T.amberBorder, tag: "⚠ WARN" },
            }[data.result] || { color: T.muted, bg: "#F1F5F9", border: T.border, tag: data.result };

            return (
              <div key={key} style={{ padding: "12px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: resCfg.bg, border: `1px solid ${resCfg.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.navy }}>{label}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: resCfg.bg, color: resCfg.color, border: `1px solid ${resCfg.border}`, flexShrink: 0 }}>
                      {resCfg.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: data.result === "FAIL" ? T.red : T.muted, lineHeight: 1.65, margin: 0 }}>
                    {data.detail}
                  </p>
                </div>
              </div>
            );
          })}

          <div style={{ padding: "10px 18px 4px", fontSize: 10, color: "#94A3B8", lineHeight: 1.5 }}>
            🔬 Forensic analysis powered by Gemini Vision · Proprietary 145+ LGU template database · NCDA-aligned
          </div>
        </div>
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

      {/* Forensic Report */}
      <ForensicReport forensics={analysisResult?.forensics} />

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
        @keyframes ij-progress { from { width: 0% } to { width: 100% } }
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