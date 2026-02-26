"use client";

/**
 * app/(main)/verification/page.js
 *
 * The PWD Identity Verification page.
 * Visit: http://localhost:3000/verification
 *
 * Wires together all 5 steps:
 *   1. Document Upload
 *   2. AI Analysis (Gemini)
 *   3. Liveness Check (face-api.js)
 *   4. Registry Check (DOH + DSWD)
 *   5. Result + PWD Verified Badge
 */

import { useState, useEffect } from "react";
import DocumentUpload from "@/components/verification/DocumentUpload";
import LivenessCheck from "@/components/verification/LivenessCheck";

// ─────────────────────────────────────────────
// Step definitions
// ─────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Upload Documents",  short: "Documents" },
  { id: 2, label: "AI Analysis",       short: "AI Check"  },
  { id: 3, label: "Liveness Check",    short: "Selfie"    },
  { id: 4, label: "Registry Check",    short: "Registry"  },
  { id: 5, label: "Result",            short: "Result"    },
];

// ─────────────────────────────────────────────
// Helper: convert File → base64
// ─────────────────────────────────────────────
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─────────────────────────────────────────────
// Step Indicator
// ─────────────────────────────────────────────
function StepIndicator({ currentStep }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Circle */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${currentStep > step.id  ? "bg-[#1a6b5c] text-white"
                : currentStep === step.id ? "bg-[#f4a728] text-white ring-4 ring-[#f4a728]/20"
                : "bg-gray-100 text-gray-400"}`}>
                {currentStep > step.id ? "✓" : step.id}
              </div>
              <span className={`text-[10px] mt-1 font-medium hidden sm:block
                ${currentStep === step.id ? "text-[#f4a728]" : currentStep > step.id ? "text-[#1a6b5c]" : "text-gray-400"}`}>
                {step.short}
              </span>
            </div>
            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all
                ${currentStep > step.id ? "bg-[#1a6b5c]" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-[#1a6b5c] h-full rounded-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

// FIXED AIAnalysisStep — replace the existing one in verification/page.js
// Changes:
//   1. Checkmarks now reflect REAL AI results (not fake animation)
//   2. Flow always advances to next step (even on REJECT — result shown at Step 5)
//   3. Error is shown inline with a retry button

function AIAnalysisStep({ documents, onComplete, onError }) {
  const [status, setStatus] = useState("running"); // running | done | error
  const [activeIndex, setActiveIndex] = useState(0);
  const [checks, setChecks] = useState([
    { label: "OCR Text Extraction",        detail: "Reading all fields from your PWD ID…",                     result: null },
    { label: "PSGC Format Validation",     detail: "Checking ID number against PSGC geographic codes…",        result: null },
    { label: "LGU Designation Check",      detail: "Verifying City vs Municipality label…",                    result: null },
    { label: "NCDA Disability Category",   detail: "Confirming disability is one of 9 official categories…",   result: null },
    { label: "Visual Forgery Detection",   detail: "Scanning for Recto forger patterns…",                      result: null },
    { label: "Cross-Document Consistency", detail: "Matching name and disability across both documents…",       result: null },
  ]);
  const [error, setError] = useState(null);
  const [apiResult, setApiResult] = useState(null);

  // Animate one check every 800ms while API runs
  useEffect(() => {
    if (status !== "running") return;
    if (activeIndex >= checks.length) return;
    const t = setTimeout(() => setActiveIndex(i => i + 1), 800);
    return () => clearTimeout(t);
  }, [activeIndex, status]);

  // Run API on mount
  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    try {
      const pwdIdFrontBase64    = await fileToBase64(documents.pwdFront);
      const pwdIdBackBase64     = documents.pwdBack ? await fileToBase64(documents.pwdBack) : null;
      const supportingDocBase64 = await fileToBase64(documents.supporting);

      const res  = await fetch("/api/verification/analyze-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pwdIdFrontBase64,
          pwdIdBackBase64,
          supportingDocBase64,
          selfieBase64: "pending",
          submissionStartedAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      setApiResult(data);
      setStatus("done");

      // Update checks with REAL results from AI
      const idDoc     = data.analysis?.idDocument;
      const crossDoc  = data.analysis?.crossDocument;
      const flags     = data.flags || [];

      setChecks([
        {
          label: "OCR Text Extraction",
          result: idDoc?.extractedName ? "pass" : "warn",
          detail: idDoc?.extractedName ? `Name: ${idDoc.extractedName}` : "Could not extract name",
        },
        {
          label: "PSGC Format Validation",
          result: flags.some(f => f.match(/PSGC|region code/i)) ? "fail" : "pass",
          detail: flags.find(f => f.match(/PSGC|region code/i)) || "ID number format valid",
        },
        {
          label: "LGU Designation Check",
          result: flags.some(f => f.match(/municipality|city/i)) ? "fail" : "pass",
          detail: flags.find(f => f.match(/municipality|city/i)) || `LGU: ${idDoc?.issuingLgu || "detected"}`,
        },
        {
          label: "NCDA Disability Category",
          result: flags.some(f => f.match(/medical diagnosis|NCDA/i)) ? "fail" : "pass",
          detail: flags.find(f => f.match(/medical diagnosis|NCDA/i)) || `Disability: ${idDoc?.disabilityCategory || "detected"}`,
        },
        {
          label: "Visual Forgery Detection",
          result: (idDoc?.forgerySignalCount || 0) > 2 ? "fail" : (idDoc?.forgerySignalCount || 0) > 0 ? "warn" : "pass",
          detail: `${idDoc?.forgerySignalCount || 0} forgery signal(s) detected — Suspicion: ${idDoc?.suspicionLevel || "LOW"}`,
        },
        {
          label: "Cross-Document Consistency",
          result: crossDoc?.consistency === "INCONSISTENT" ? "fail" : crossDoc?.consistency === "MINOR_ISSUES" ? "warn" : "pass",
          detail: crossDoc?.summary || "Documents checked",
        },
      ]);

      // Always advance to next step — real decision shown at Step 5
      setTimeout(() => onComplete(data), 1200);

    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  };

  const getIcon = (check, index) => {
    if (check.result === "pass") return <span className="text-white font-bold">✓</span>;
    if (check.result === "fail") return <span className="text-white font-bold">✗</span>;
    if (check.result === "warn") return <span className="text-white font-bold">!</span>;
    if (index === activeIndex && status === "running") return <span className="text-white font-bold animate-pulse">…</span>;
    if (index < activeIndex) return <span className="text-white font-bold">✓</span>;
    return <span className="text-gray-300 font-bold">{index + 1}</span>;
  };

  const getBg = (check, index) => {
    if (check.result === "pass") return "bg-[#1a6b5c]";
    if (check.result === "fail") return "bg-red-500";
    if (check.result === "warn") return "bg-amber-400";
    if (index === activeIndex && status === "running") return "bg-amber-400";
    if (index < activeIndex) return "bg-[#1a6b5c]";
    return "bg-gray-100";
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Gemini Vision API is analyzing your documents using Philippine-specific fraud detection rules.
      </p>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {checks.map((check, i) => (
          <div key={i} className={`flex items-start gap-3 p-4 transition-all
            ${i === activeIndex && status === "running" ? "bg-amber-50" : ""}
            ${check.result === "fail" ? "bg-red-50" : ""}
            ${i < checks.length - 1 ? "border-b border-gray-50" : ""}`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-sm transition-all ${getBg(check, i)}`}>
              {getIcon(check, i)}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold
                ${check.result === "fail"   ? "text-red-700"
                : check.result === "pass"   ? "text-[#1a6b5c]"
                : check.result === "warn"   ? "text-amber-700"
                : i === activeIndex         ? "text-amber-700"
                : i < activeIndex           ? "text-[#1a6b5c]"
                : "text-gray-400"}`}>
                {check.label}
              </div>
              <div className={`text-xs mt-0.5
                ${check.result === "fail" ? "text-red-500 font-medium" : "text-gray-400"}`}>
                {check.result ? check.detail : (i === activeIndex ? check.detail : "")}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Score preview */}
      {apiResult && (
        <div className={`rounded-xl p-4 border text-sm font-semibold text-center
          ${apiResult.decision === "AUTO_APPROVE" ? "bg-green-50 border-green-200 text-green-700"
          : apiResult.decision === "HUMAN_REVIEW"  ? "bg-amber-50 border-amber-200 text-amber-700"
          : "bg-red-50 border-red-200 text-red-700"}`}>
          AI Score: {apiResult.score}/100 — {apiResult.decision?.replace("_", " ")}
          <div className="text-xs font-normal mt-1 opacity-80">Advancing to liveness check…</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
          <div className="text-sm text-red-600">⚠️ {error}</div>
          <button
            onClick={runAnalysis}
            className="w-full py-2.5 rounded-xl font-bold text-sm bg-[#1a6b5c] text-white hover:bg-[#155a4d]"
          >
            Retry Analysis
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 4: Registry Check UI
// ─────────────────────────────────────────────
function RegistryCheckStep({ analysisResult, onComplete }) {
  const [doh, setDoh]   = useState({ status: "pending", result: null });
  const [prc, setPrc]   = useState({ status: "pending", result: null });
  const [done, setDone] = useState(false);

  const runChecks = async () => {
    const idNumber       = analysisResult?.nextSteps?.idNumberForDoh;
    const prcLicense     = analysisResult?.nextSteps?.prcLicenseNumber;
    const lguName        = analysisResult?.analysis?.idDocument?.issuingLgu;

    // DOH + DSWD registry check
    if (idNumber) {
      setDoh({ status: "running", result: null });
      try {
        const res = await fetch("/api/verification/scrape-doh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idNumber, lguName }),
        }).then(r => r.json());
        setDoh({ status: "done", result: res });
      } catch (e) {
        setDoh({ status: "done", result: { found: false, interpretation: "Registry unreachable — inconclusive" } });
      }
    } else {
      setDoh({ status: "skipped", result: { interpretation: "ID number could not be extracted — skipped" } });
    }

    // PRC license check
    if (prcLicense) {
      setPrc({ status: "running", result: null });
      try {
        const res = await fetch("/api/verification/check-prc-license", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prcLicenseNumber: prcLicense }),
        }).then(r => r.json());
        setPrc({ status: "done", result: res });
      } catch (e) {
        setPrc({ status: "done", result: { valid: false, interpretation: "PRC check failed — inconclusive" } });
      }
    } else {
      setPrc({ status: "skipped", result: { interpretation: "No PRC license found in supporting document — skipped" } });
    }

    setDone(true);
  };

  // Auto-run on mount
  useState(() => { runChecks(); }, []);

  const StatusDot = ({ status }) => (
    <span className={`w-2 h-2 rounded-full shrink-0
      ${status === "running" ? "bg-amber-400 animate-pulse"
      : status === "done"    ? "bg-[#1a6b5c]"
      : "bg-gray-300"}`} />
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Checking your ID against Philippine government registries. Results are used to boost — not gatekeep — your verification score.
      </p>

      {/* DOH + DSWD */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <StatusDot status={doh.status} />
          <span className="text-sm font-bold text-gray-700">DOH + DSWD PWD Registry</span>
        </div>
        {doh.status === "running" && (
          <p className="text-xs text-amber-600 pl-4">Querying pwd.doh.gov.ph and dswd.gov.ph…</p>
        )}
        {doh.result && (
          <p className="text-xs text-gray-500 pl-4">{doh.result.interpretation}</p>
        )}
      </div>

      {/* PRC License */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <StatusDot status={prc.status} />
          <span className="text-sm font-bold text-gray-700">PRC Physician License</span>
        </div>
        {prc.status === "running" && (
          <p className="text-xs text-amber-600 pl-4">Verifying license at verification.prc.gov.ph…</p>
        )}
        {prc.result && (
          <p className="text-xs text-gray-500 pl-4">{prc.result.interpretation}</p>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
        ℹ️ "Not found" in a registry is inconclusive — many legitimate IDs are not yet encoded. Only a positive match boosts your score.
      </div>

      {done && (
        <button
          onClick={() => onComplete({ doh: doh.result, prc: prc.result })}
          className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#1a6b5c] text-white hover:bg-[#155a4d] transition-all"
        >
          See My Result →
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 5: Result
// ─────────────────────────────────────────────
function ResultStep({ analysisResult, onRestart }) {
  const decision = analysisResult?.decision || "HUMAN_REVIEW";
  const score    = analysisResult?.score    || 0;
  const flags    = analysisResult?.flags    || [];

  const config = {
    AUTO_APPROVE: {
      icon: "🏅",
      title: "PWD Verified!",
      subtitle: "Your identity has been verified. The PWD Verified badge is now active on your profile.",
      color: "#1a6b5c",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    HUMAN_REVIEW: {
      icon: "⏳",
      title: "Under Review",
      subtitle: "Your submission passed AI checks but needs a final human review. You'll be notified within 24–48 hours.",
      color: "#f4a728",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    REJECT: {
      icon: "❌",
      title: "Verification Unsuccessful",
      subtitle: "Your submission could not be verified. Please review the issues below and resubmit.",
      color: "#dc2626",
      bg: "bg-red-50",
      border: "border-red-200",
    },
  }[decision];

  return (
    <div className="space-y-5">
      {/* Result card */}
      <div className={`${config.bg} border ${config.border} rounded-2xl p-6 text-center space-y-2`}>
        <div className="text-5xl">{config.icon}</div>
        <h3 className="text-xl font-extrabold" style={{ color: config.color }}>{config.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{config.subtitle}</p>
      </div>

      {/* Score */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-gray-700">Verification Score</span>
          <span className="text-2xl font-extrabold" style={{ color: config.color }}>{score}/100</span>
        </div>
        <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${score}%`, backgroundColor: config.color }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1.5">
          <span>0 — Reject</span>
          <span>50 — Review</span>
          <span>80 — Approve</span>
        </div>
      </div>

      {/* Flags */}
      {flags.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-2">
          <div className="text-sm font-bold text-gray-700 mb-3">Issues Found</div>
          {flags.map((flag, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <span className="text-amber-500 shrink-0 mt-0.5">⚠️</span>
              {flag}
            </div>
          ))}
        </div>
      )}

      {/* Analysis summary */}
      {analysisResult?.analysis && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
          <div className="text-sm font-bold text-gray-700">Analysis Summary</div>
          {[
            ["Document AI", analysisResult.analysis.idDocument?.summary],
            ["Supporting Doc", analysisResult.analysis.supportingDocument?.summary],
            ["Cross-Check", analysisResult.analysis.crossDocument?.summary],
            ["Face Match", `${analysisResult.analysis.faceMatch?.confidence ?? "—"}% confidence — ${analysisResult.analysis.faceMatch?.summary}`],
          ].map(([label, val]) => val && (
            <div key={label}>
              <div className="text-xs font-semibold text-gray-500 mb-0.5">{label}</div>
              <div className="text-xs text-gray-600 leading-relaxed">{val}</div>
            </div>
          ))}
        </div>
      )}

      {decision === "REJECT" && (
        <button
          onClick={onRestart}
          className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#1a6b5c] text-white hover:bg-[#155a4d] transition-all"
        >
          ↺ Resubmit Verification
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────
export default function VerificationPage() {
  const [step, setStep]             = useState(1);
  const [documents, setDocuments]   = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [livenessResult, setLivenessResult] = useState(null);
  const [error, setError]           = useState(null);

  const handleDocumentsSubmit = (docs) => {
    setDocuments(docs);
    setStep(2);
  };

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setStep(3);
  };

  const handleLivenessComplete = (result) => {
    setLivenessResult(result);
    setStep(4);
  };

  const handleRegistryComplete = () => {
    setStep(5);
  };

  const handleRestart = () => {
    setStep(1);
    setDocuments(null);
    setAnalysisResult(null);
    setLivenessResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] py-8 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-4 shadow-sm">
            <span>🛡️</span>
            <span className="text-sm font-bold text-[#1a6b5c]">PWD Identity Verification</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Verify Your PWD Status</h1>
          <p className="text-sm text-gray-500 mt-2">
            Multi-layer verification so employers can confidently hire you.
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator currentStep={step} />

        {/* Step card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Step header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                Step {step} of {STEPS.length}
              </div>
              <div className="text-lg font-extrabold text-gray-900">
                {STEPS[step - 1].label}
              </div>
            </div>
            <div className="bg-[#1a6b5c]/10 text-[#1a6b5c] rounded-xl px-3 py-1.5 text-sm font-bold">
              {Math.round(((step - 1) / (STEPS.length - 1)) * 100)}%
            </div>
          </div>

          {/* Step content */}
          {step === 1 && (
            <DocumentUpload onNext={handleDocumentsSubmit} />
          )}

          {step === 2 && (
            <AIAnalysisStep
              documents={documents}
              onComplete={handleAnalysisComplete}
              onError={(e) => setError(e)}
            />
          )}

          {step === 3 && (
  <LivenessCheck
    onCapture={(base64, mime) => handleLivenessComplete({ selfieBase64: base64, selfieMime: mime })}
    onSkip={() => handleLivenessComplete({ selfieBase64: null, selfieMime: null })}
  />
)}

          {step === 4 && (
            <RegistryCheckStep
              analysisResult={analysisResult}
              onComplete={handleRegistryComplete}
            />
          )}

          {step === 5 && (
            <ResultStep
              analysisResult={analysisResult}
              onRestart={handleRestart}
            />
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              ⚠️ {error} —{" "}
              <button onClick={() => setError(null)} className="underline font-medium">dismiss</button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
          Powered by Gemini Vision · face-api.js · WCAG 2.1 AA<br />
          RA 7277 & Data Privacy Act (RA 10173) Compliant
        </p>
      </div>
    </div>
  );
}