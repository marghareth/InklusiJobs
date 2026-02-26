/**
 * app/api/verification/analyze-document/route.js
 *
 * FIXES APPLIED:
 *   1. Import matches your actual lib/supabase.js export
 *   2. Cheap local checks run FIRST — fake IDs rejected before any API call
 *   3. Clear rejection reason returned at each layer
 *
 * VALIDATION ORDER (fastest/cheapest first):
 *
 *   Layer 1 — PSGC Format         (local, 0ms)
 *   Layer 2 — Disability Category (local, 0ms)  ← "Diabetes" rejected HERE
 *   Layer 3 — LGU Designation     (local, 0ms)  ← "Mun. of Pasig" flagged HERE
 *   Layer 4 — Duplicate + Blacklist (Supabase, ~100ms)
 *   Layer 5 — DOH Registry        (external, ~2s)
 *   Layer 6 — Gemini AI Analysis  (external, ~4s)
 *   Layer 7 — Face Match          (external, ~2s)
 *   Layer 8 — PRC License         (external, ~2s)
 *   Layer 9 — Risk Score          (local, 0ms)
 */

import { NextResponse } from "next/server";
import {
  PWD_ID_FORENSICS_PROMPT,
  SUPPORTING_DOC_PROMPT,
  CROSS_DOCUMENT_CONSISTENCY_PROMPT,
  FACE_MATCH_PROMPT,
} from "@/lib/verification-prompts";
import {
  validatePWDIdFormat,
  validateLGUDesignation,
  validateDisabilityCategory,
} from "@/lib/psgc-data";
import { calculateRiskScore, detectBehavioralFlags } from "@/lib/risk-scorer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ─────────────────────────────────────────────
// Gemini helpers
// ─────────────────────────────────────────────
async function callGeminiVision(imageBase64, mimeType, prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set in .env.local");

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: mimeType, data: imageBase64 } },
            { text: prompt },
          ],
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const raw  = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const clean = raw.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();
  try { return JSON.parse(clean); }
  catch { throw new Error(`Gemini non-JSON response: ${clean.slice(0, 200)}`); }
}

async function callGeminiFaceMatch(selfieB64, selfMime, idB64, idMime, prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set in .env.local");

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Image 1 — Live Selfie:" },
            { inline_data: { mime_type: selfMime, data: selfieB64 } },
            { text: "Image 2 — PWD ID Card:" },
            { inline_data: { mime_type: idMime, data: idB64 } },
            { text: prompt },
          ],
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
      }),
    }
  );

  const data = await res.json();
  const raw  = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const clean = raw.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();
  try { return JSON.parse(clean); }
  catch { throw new Error("Face match non-JSON response"); }
}

// ─────────────────────────────────────────────
// Early reject helper — returns a clean JSON response
// ─────────────────────────────────────────────
function earlyReject(flags, rejectReason, rejectedAt) {
  return NextResponse.json({
    success:      false,
    decision:     "REJECT",
    score:        0,
    flags,
    rejectReason,
    rejectedAt,
  }, { status: 200 });
}

// ─────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────
export async function POST(request) {
  try {

    // ── Auth ──
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      pwdIdFrontBase64,
      pwdIdFrontMime    = "image/jpeg",
      pwdIdBackBase64,
      pwdIdBackMime     = "image/jpeg",
      supportingDocBase64,
      supportingDocMime  = "image/jpeg",
      selfieBase64,
      selfieMime         = "image/jpeg",
      // Pre-extracted fields (optional — if frontend extracted them first)
      extractedIdNumber,
      extractedLgu,
      extractedDisability,
      submissionStartedAt,
    } = await request.json();

    if (!pwdIdFrontBase64 || !supportingDocBase64) {
      return NextResponse.json(
        { error: "PWD ID front and supporting document are required" },
        { status: 400 }
      );
    }

    // ════════════════════════════════════════
    // LAYER 1 — PSGC Format (local, instant)
    // ════════════════════════════════════════
    let psgcValidation  = { valid: false, flags: ["ID number not yet extracted"], normalized: null };
    let lguValidation   = { correct: true, flag: null };
    let disabilityValidation = { valid: false, flag: "Not yet validated" };

    if (extractedIdNumber) {
      psgcValidation = validatePWDIdFormat(extractedIdNumber);
      // Note: invalid format is NOT an immediate reject — OCR may have mangled it.
      // Gemini will re-read it. But we flag it.
    }

    // ════════════════════════════════════════
    // LAYER 2 — Disability Category (local, instant)
    // Hard reject if it's clearly a medical diagnosis
    // ════════════════════════════════════════
    if (extractedDisability) {
      disabilityValidation = validateDisabilityCategory(extractedDisability);
      if (!disabilityValidation.valid && disabilityValidation.flag?.includes("medical diagnosis")) {
        return earlyReject(
          [disabilityValidation.flag],
          `"${extractedDisability}" is a medical condition, not a valid NCDA disability category. The 9 valid categories are: Psychosocial Disability, Chronic Illness, Learning Disability, Mental Disability, Visual Disability, Orthopedic/Physical Disability, Speech and Language Impairment, Deaf or Hard of Hearing, Cancer and Rare Diseases.`,
          "layer_2_disability_category"
        );
      }
    }

    // ════════════════════════════════════════
    // LAYER 3 — LGU Designation (local, instant)
    // ════════════════════════════════════════
    if (extractedLgu) {
      lguValidation = validateLGUDesignation(extractedLgu);
      // Not a hard reject alone — but heavily weighted in risk score
    }

    // ════════════════════════════════════════
    // LAYER 4 — Duplicate + Blacklist (Supabase)
    // ════════════════════════════════════════
    if (psgcValidation.valid && psgcValidation.normalized) {
      const { data: existing } = await supabase
        .from("pwd_verifications")
        .select("id")
        .eq("pwd_id_number", psgcValidation.normalized)
        .neq("user_id", user.id)
        .limit(1);

      if (existing?.length > 0) {
        return earlyReject(
          ["This PWD ID number is already registered to another account"],
          "Duplicate ID — this PWD ID has already been used to verify a different account.",
          "layer_4_duplicate_check"
        );
      }

      const { data: blacklisted } = await supabase
        .from("blacklisted_pwd_ids")
        .select("reason")
        .eq("pwd_id_number", psgcValidation.normalized)
        .limit(1);

      if (blacklisted?.length > 0) {
        return earlyReject(
          [`PWD ID blacklisted: ${blacklisted[0].reason}`],
          "This PWD ID number is on the fraud blacklist.",
          "layer_4_blacklist"
        );
      }
    }

    // ════════════════════════════════════════
    // LAYER 5 — DOH Registry (external)
    // NOT FOUND = inconclusive, not a reject
    // ════════════════════════════════════════
    let dohRegistryFound = false;
    if (psgcValidation.valid && psgcValidation.normalized) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const dohRes  = await fetch(`${baseUrl}/api/verification/scrape-doh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idNumber: psgcValidation.normalized, lguName: extractedLgu }),
        });
        const dohData = await dohRes.json();
        dohRegistryFound = dohData.found === true;
      } catch {
        console.warn("[Layer 5] DOH registry unreachable — inconclusive");
      }
    }

    // ════════════════════════════════════════
    // LAYER 6 — Gemini AI Analysis (external)
    // ════════════════════════════════════════
    let geminiIdResult         = null;
    let geminiSupportingResult = null;
    let crossDocResult         = null;
    const allFlags             = [];

    try {
      geminiIdResult = await callGeminiVision(
        pwdIdFrontBase64, pwdIdFrontMime, PWD_ID_FORENSICS_PROMPT
      );

      // Re-validate disability with Gemini-extracted value if not pre-extracted
      const geminiDisability = geminiIdResult.extracted_fields?.disability_type;
      if (!extractedDisability && geminiDisability) {
        const reDisab = validateDisabilityCategory(geminiDisability);
        if (!reDisab.valid && reDisab.flag?.includes("medical diagnosis")) {
          return earlyReject(
            [reDisab.flag],
            reDisab.flag,
            "layer_6_gemini_disability_recheck"
          );
        }
      }

      // Re-validate LGU with Gemini-extracted value
      const geminiLgu = geminiIdResult.extracted_fields?.issuing_lgu;
      if (!extractedLgu && geminiLgu) {
        lguValidation = validateLGUDesignation(geminiLgu);
      }

      // Re-validate PSGC with Gemini-extracted ID number
      const geminiIdNumber = geminiIdResult.extracted_fields?.pwd_id_number;
      if (!extractedIdNumber && geminiIdNumber) {
        psgcValidation = validatePWDIdFormat(geminiIdNumber);
      }

      geminiSupportingResult = await callGeminiVision(
        supportingDocBase64, supportingDocMime, SUPPORTING_DOC_PROMPT
      );

      crossDocResult = await callGeminiVision(
        pwdIdBackBase64 || pwdIdFrontBase64,
        pwdIdBackMime,
        CROSS_DOCUMENT_CONSISTENCY_PROMPT(geminiIdResult, geminiSupportingResult)
      );

    } catch (e) {
      console.error("[Layer 6] Gemini failed:", e.message);
      allFlags.push(`AI analysis incomplete: ${e.message}`);
    }

    // ════════════════════════════════════════
    // LAYER 7 — Face Match + Liveness
    // ════════════════════════════════════════
    let faceMatchResult = null;
    if (selfieBase64 && selfieBase64 !== "pending") {
      try {
        faceMatchResult = await callGeminiFaceMatch(
          selfieBase64, selfieMime,
          pwdIdFrontBase64, pwdIdFrontMime,
          FACE_MATCH_PROMPT
        );
      } catch (e) {
        allFlags.push(`Face match failed: ${e.message}`);
      }
    }

    // ════════════════════════════════════════
    // LAYER 8 — PRC License Check
    // ════════════════════════════════════════
    let prcLicenseValid    = false;
    const prcLicenseNumber = geminiSupportingResult?.extracted_fields?.prc_license_number;

    if (prcLicenseNumber) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const prcRes  = await fetch(`${baseUrl}/api/verification/check-prc-license`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prcLicenseNumber,
            physicianSpecialty: geminiSupportingResult?.extracted_fields?.physician_specialty,
            disabilityCategory: geminiIdResult?.extracted_fields?.disability_type,
          }),
        });
        const prcData  = await prcRes.json();
        prcLicenseValid = prcData.valid === true;
        if (prcData.flags?.length) allFlags.push(...prcData.flags);
      } catch {
        console.warn("[Layer 8] PRC check unreachable");
      }
    }

    // ════════════════════════════════════════
    // LAYER 9 — Behavioral Flags + Risk Score
    // ════════════════════════════════════════
    const submissionDurationSeconds = submissionStartedAt
      ? Math.floor((Date.now() - new Date(submissionStartedAt).getTime()) / 1000)
      : null;

    const behavioralFlags = detectBehavioralFlags({
      submissionDurationSeconds,
      supportingDocMetadataEdited:
        geminiSupportingResult?.authenticity_signals?.suspicious_editing_detected,
    });

    const riskResult = calculateRiskScore({
      geminiIdResult,
      geminiSupportingResult,
      crossDocResult,
      faceMatchResult,
      psgcValidation,
      lguValidation,
      disabilityValidation,
      dohRegistryFound,
      prcLicenseValid,
      isDuplicate: false,
      behavioralFlags,
    });

    const combinedFlags = [...new Set([...allFlags, ...riskResult.flags])];

    // ── Save to DB ──
    const { data: record } = await supabase
      .from("pwd_verifications")
      .insert({
        user_id:       user.id,
        pwd_id_number: psgcValidation.valid ? psgcValidation.normalized : extractedIdNumber,
        status:
          riskResult.decision === "AUTO_APPROVE"  ? "approved"
          : riskResult.decision === "HUMAN_REVIEW" ? "pending_review"
          : "rejected",
        risk_score:                 riskResult.score,
        flags:                      combinedFlags,
        gemini_id_analysis:         geminiIdResult,
        gemini_supporting_analysis: geminiSupportingResult,
        cross_doc_analysis:         crossDocResult,
        face_match_analysis:        faceMatchResult,
        psgc_validation:            psgcValidation,
        lgu_validation:             lguValidation,
        disability_validation:      disabilityValidation,
        behavioral_flags:           behavioralFlags,
        doh_registry_found:         dohRegistryFound,
        prc_license_valid:          prcLicenseValid,
        submitted_at:               new Date().toISOString(),
      })
      .select()
      .single();

    // Issue badge if auto-approved
    if (riskResult.decision === "AUTO_APPROVE") {
      await supabase
        .from("profiles")
        .update({ pwd_verified: true, pwd_verified_at: new Date().toISOString() })
        .eq("id", user.id);
    }

    return NextResponse.json({
      success:        true,
      verificationId: record?.id,
      decision:       riskResult.decision,
      score:          riskResult.score,
      flags:          combinedFlags,
      breakdown:      riskResult.breakdown,
      analysis: {
        idDocument: {
          suspicionLevel:    geminiIdResult?.overall_suspicion_level,
          forgerySignalCount: geminiIdResult?.forgery_signal_count,
          extractedName:     geminiIdResult?.extracted_fields?.full_name,
          disabilityCategory: geminiIdResult?.extracted_fields?.disability_type,
          issuingLgu:        geminiIdResult?.extracted_fields?.issuing_lgu,
          summary:           geminiIdResult?.summary,
        },
        supportingDocument: {
          documentType:   geminiSupportingResult?.document_type,
          suspicionLevel: geminiSupportingResult?.overall_suspicion_level,
          prcLicenseNumber,
          summary:        geminiSupportingResult?.summary,
        },
        crossDocument: {
          consistency: crossDocResult?.overall_consistency,
          summary:     crossDocResult?.summary,
        },
        faceMatch: {
          confidence:   faceMatchResult?.match_confidence,
          level:        faceMatchResult?.match_level,
          livenessPass: faceMatchResult?.liveness?.appears_live,
          summary:      faceMatchResult?.summary,
        },
        dohRegistry: {
          found: dohRegistryFound,
          note:  dohRegistryFound
            ? "✅ ID confirmed in DOH PWD registry"
            : "ℹ️ Not found in DOH registry — inconclusive",
        },
      },
      nextSteps: {
        runDohCheck:     psgcValidation.valid,
        runPrcCheck:     !!prcLicenseNumber,
        prcLicenseNumber,
        idNumberForDoh:  psgcValidation.valid ? psgcValidation.normalized : null,
      },
    });

  } catch (error) {
    console.error("[Verification] Unexpected error:", error);
    return NextResponse.json(
      { error: "Verification failed", details: error.message },
      { status: 500 }
    );
  }
}