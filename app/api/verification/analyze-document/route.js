/**
 * app/api/verification/analyze-document/route.js
 *
 * POST /api/verification/analyze-document
 *
 * Accepts uploaded document images (PWD ID front/back + supporting doc),
 * runs them through Gemini Vision with the forensics prompts,
 * and returns structured analysis results.
 *
 * Called by: components/verification/GeminiAnalysis.jsx
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
} from "@/lib/psgc-lookup";
import { calculateRiskScore, detectBehavioralFlags } from "@/lib/risk-scorer";
import { createClient } from "@/lib/supabase";

// ─────────────────────────────────────────────
// Gemini Vision API helper
// Sends an image + prompt to Gemini and returns parsed JSON
// ─────────────────────────────────────────────
async function callGeminiVision(imageBase64, mimeType, prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) throw new Error("GEMINI_API_KEY is not set in environment variables");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: imageBase64,
                },
              },
              { text: prompt },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,      // Low temperature — we want deterministic analysis
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} — ${error}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) throw new Error("Gemini returned an empty response");

  // Strip markdown code fences if Gemini adds them (it sometimes does despite instructions)
  const cleaned = rawText
    .replace(/```json\n?/gi, "")
    .replace(/```\n?/gi, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`Gemini response was not valid JSON: ${cleaned.substring(0, 200)}`);
  }
}

// ─────────────────────────────────────────────
// Gemini multi-image call (for face match — needs 2 images)
// ─────────────────────────────────────────────
async function callGeminiFaceMatch(selfieBase64, selfieMime, idImageBase64, idImageMime, prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: "Image 1 — Live Selfie:" },
              { inline_data: { mime_type: selfieMime, data: selfieBase64 } },
              { text: "Image 2 — PWD ID Card:" },
              { inline_data: { mime_type: idImageMime, data: idImageBase64 } },
              { text: prompt },
            ],
          },
        ],
        generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
      }),
    }
  );

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const cleaned = rawText.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`Face match response was not valid JSON`);
  }
}

// ─────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────
export async function POST(request) {
  try {
    const supabase = createClient();

    // Authenticate the request
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      pwdIdFrontBase64,
      pwdIdFrontMime = "image/jpeg",
      pwdIdBackBase64,
      pwdIdBackMime = "image/jpeg",
      supportingDocBase64,
      supportingDocMime = "image/jpeg",
      selfieBase64,
      selfieMime = "image/jpeg",
      submissionStartedAt,       // ISO timestamp — for behavioral analysis
      ipIsVpnOrProxy = false,
    } = body;

    // Validate required inputs
    if (!pwdIdFrontBase64 || !supportingDocBase64 || !selfieBase64) {
      return NextResponse.json(
        { error: "Missing required documents: PWD ID front, supporting document, and selfie are all required" },
        { status: 400 }
      );
    }

    // ── Step 1: Run Gemini analysis on PWD ID front ──
    console.log("[Verification] Running Gemini forensics on PWD ID front...");
    const idFrontResult = await callGeminiVision(
      pwdIdFrontBase64,
      pwdIdFrontMime,
      PWD_ID_FORENSICS_PROMPT
    );

    // ── Step 2: Run Gemini analysis on supporting document ──
    console.log("[Verification] Running Gemini analysis on supporting document...");
    const supportingDocResult = await callGeminiVision(
      supportingDocBase64,
      supportingDocMime,
      SUPPORTING_DOC_PROMPT
    );

    // ── Step 3: Cross-document consistency check ──
    console.log("[Verification] Running cross-document consistency check...");
    const crossDocResult = await callGeminiVision(
      // Use a 1x1 pixel transparent PNG as placeholder — the prompt uses text, not image
      // In production, pass the ID back image or use a text-only Gemini call
      pwdIdBackBase64 || pwdIdFrontBase64,
      pwdIdBackMime,
      CROSS_DOCUMENT_CONSISTENCY_PROMPT(idFrontResult, supportingDocResult)
    );

    // ── Step 4: Face match (selfie vs ID card) ──
    console.log("[Verification] Running face match...");
    const faceMatchResult = await callGeminiFaceMatch(
      selfieBase64,
      selfieMime,
      pwdIdFrontBase64,
      pwdIdFrontMime,
      FACE_MATCH_PROMPT
    );

    // ── Step 5: Local PSGC and field validation ──
    const extractedIdNumber = idFrontResult.extracted_fields?.pwd_id_number;
    const extractedLgu = idFrontResult.extracted_fields?.issuing_lgu || idFrontResult.lgu_validation?.lgu_name;
    const extractedDisability = idFrontResult.extracted_fields?.disability_type;

    const psgcValidation = validatePWDIdFormat(extractedIdNumber);
    const lguValidation = validateLGUDesignation(extractedLgu);
    const disabilityValidation = validateDisabilityCategory(extractedDisability);

    // ── Step 6: Duplicate ID check ──
    let isDuplicate = false;
    if (psgcValidation.valid && extractedIdNumber) {
      const { data: existing } = await supabase
        .from("pwd_verifications")
        .select("id")
        .eq("pwd_id_number", psgcValidation.normalized)
        .neq("user_id", user.id)
        .limit(1);

      isDuplicate = existing && existing.length > 0;
    }

    // ── Step 7: Behavioral flags ──
    const submissionDurationSeconds = submissionStartedAt
      ? Math.floor((Date.now() - new Date(submissionStartedAt).getTime()) / 1000)
      : null;

    const { data: accountData } = await supabase
      .from("auth.users")
      .select("created_at")
      .eq("id", user.id)
      .single();

    const accountAgeSeconds = accountData?.created_at
      ? Math.floor((Date.now() - new Date(accountData.created_at).getTime()) / 1000)
      : null;

    const behavioralFlags = detectBehavioralFlags({
      submissionDurationSeconds,
      ipIsVpnOrProxy,
      accountAgeSeconds,
      supportingDocMetadataEdited: supportingDocResult.authenticity_signals?.suspicious_editing_detected,
    });

    // ── Step 8: Calculate final risk score ──
    const riskResult = calculateRiskScore({
      geminiIdResult: idFrontResult,
      geminiSupportingResult: supportingDocResult,
      crossDocResult,
      faceMatchResult,
      psgcValidation,
      lguValidation,
      disabilityValidation,
      dohRegistryFound: false,  // Will be populated by /api/verification/check-doh-registry
      prcLicenseValid: false,   // Will be populated by /api/verification/check-prc-license
      isDuplicate,
      behavioralFlags,
    });

    // ── Step 9: Save verification record to Supabase ──
    // Store analysis results but NOT the actual images (NPC Data Privacy compliance)
    const { data: verificationRecord, error: dbError } = await supabase
      .from("pwd_verifications")
      .insert({
        user_id: user.id,
        pwd_id_number: psgcValidation.valid ? psgcValidation.normalized : extractedIdNumber,
        status: riskResult.decision === "AUTO_APPROVE" ? "approved"
              : riskResult.decision === "HUMAN_REVIEW" ? "pending_review"
              : "rejected",
        risk_score: riskResult.score,
        flags: riskResult.flags,
        gemini_id_analysis: idFrontResult,
        gemini_supporting_analysis: supportingDocResult,
        cross_doc_analysis: crossDocResult,
        face_match_analysis: faceMatchResult,
        psgc_validation: psgcValidation,
        lgu_validation: lguValidation,
        disability_validation: disabilityValidation,
        behavioral_flags: behavioralFlags,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error("[Verification] Database error:", dbError);
      // Don't fail the request — return results even if DB save fails
    }

    // ── Step 10: If approved, issue PWD Verified badge ──
    if (riskResult.decision === "AUTO_APPROVE") {
      await supabase
        .from("profiles")
        .update({ pwd_verified: true, pwd_verified_at: new Date().toISOString() })
        .eq("id", user.id);
    }

    // Return results to the frontend (never return the actual image data)
    return NextResponse.json({
      success: true,
      verificationId: verificationRecord?.id,
      decision: riskResult.decision,
      score: riskResult.score,
      flags: riskResult.flags,
      breakdown: riskResult.breakdown,
      analysis: {
        idDocument: {
          suspicionLevel: idFrontResult.overall_suspicion_level,
          forgerySignalCount: idFrontResult.forgery_signal_count,
          extractedName: idFrontResult.extracted_fields?.full_name,
          disabilityCategory: idFrontResult.extracted_fields?.disability_type,
          issuingLgu: idFrontResult.extracted_fields?.issuing_lgu,
          summary: idFrontResult.summary,
        },
        supportingDocument: {
          documentType: supportingDocResult.document_type,
          suspicionLevel: supportingDocResult.overall_suspicion_level,
          prcLicenseNumber: supportingDocResult.extracted_fields?.prc_license_number,
          summary: supportingDocResult.summary,
        },
        crossDocument: {
          consistency: crossDocResult.overall_consistency,
          summary: crossDocResult.summary,
        },
        faceMatch: {
          confidence: faceMatchResult.match_confidence,
          level: faceMatchResult.match_level,
          livenessPass: faceMatchResult.liveness?.appears_live,
          summary: faceMatchResult.summary,
        },
      },
      // Tell the frontend which secondary checks to run next
      nextSteps: {
        runDohCheck: psgcValidation.valid && extractedIdNumber,
        runPrcCheck: !!supportingDocResult.extracted_fields?.prc_license_number,
        prcLicenseNumber: supportingDocResult.extracted_fields?.prc_license_number,
        idNumberForDoh: psgcValidation.valid ? psgcValidation.normalized : null,
      },
    });

  } catch (error) {
    console.error("[Verification] Unexpected error:", error);
    return NextResponse.json(
      { error: "Verification analysis failed. Please try again.", details: error.message },
      { status: 500 }
    );
  }
}