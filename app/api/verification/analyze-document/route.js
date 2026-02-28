/**
 * app/api/verification/analyze-document/route.js
 *
 * POST /api/verification/analyze-document
 *
 * Analyzes a Philippine PWD ID + supporting document using Gemini Vision.
 * No database required — purely stateless AI analysis.
 *
 * VALIDATION ORDER (fastest/cheapest first):
 *   Layer 1 — Input format validation    (local, 0ms)
 *   Layer 2 — Disability category check  (local, 0ms)
 *   Layer 3 — Gemini: PWD ID forensics   (AI, ~3s)
 *   Layer 4 — Gemini: Supporting doc     (AI, ~3s)
 *   Layer 5 — Gemini: Cross-doc check    (AI, ~2s)
 *   Layer 6 — Local risk pre-score       (local, 0ms)
 *
 * Request body:
 *   pwdIdFrontBase64     string  (required)
 *   pwdIdFrontMime       string  default: "image/jpeg"
 *   pwdIdBackBase64      string  (optional)
 *   pwdIdBackMime        string  default: "image/jpeg"
 *   supportingDocBase64  string  (required)
 *   supportingDocMime    string  default: "image/jpeg"
 *
 * Response shape matches what GeminiAnalysis.jsx and RiskScoreCard.jsx expect.
 */

import { NextResponse } from "next/server";

// ─── Valid NCDA disability categories ────────────────────────────────────────
const VALID_NCDA_CATEGORIES = [
  "Psychosocial Disability",
  "Chronic Illness",
  "Learning Disability",
  "Mental Disability",
  "Visual Disability",
  "Orthopedic/Physical Disability",
  "Speech and Language Impairment",
  "Deaf or Hard of Hearing",
  "Cancer and Rare Diseases",
];

// Common medical diagnoses people mistakenly enter (not NCDA categories)
const MEDICAL_DIAGNOSES_NOT_CATEGORIES = [
  "diabetes", "hypertension", "asthma", "cancer", "epilepsy",
  "autism", "adhd", "depression", "schizophrenia", "cerebral palsy",
  "down syndrome", "alzheimer", "parkinson", "lupus", "arthritis",
  "stroke", "heart disease", "kidney disease", "hiv", "aids",
];

function validateDisabilityCategory(category) {
  if (!category) return { valid: false, flag: null };

  const lower = category.toLowerCase().trim();

  // Check if it matches a valid NCDA category (case-insensitive)
  const isValidCategory = VALID_NCDA_CATEGORIES.some(
    (c) => c.toLowerCase() === lower || lower.includes(c.toLowerCase())
  );
  if (isValidCategory) return { valid: true, flag: null };

  // Check if it's a medical diagnosis (hard reject)
  const isMedicalDiagnosis = MEDICAL_DIAGNOSES_NOT_CATEGORIES.some((d) =>
    lower.includes(d)
  );
  if (isMedicalDiagnosis) {
    return {
      valid: false,
      flag: `"${category}" is a medical diagnosis, not a valid NCDA disability category. Valid categories: ${VALID_NCDA_CATEGORIES.join(", ")}`,
      isMedicalDiagnosis: true,
    };
  }

  return {
    valid: false,
    flag: `"${category}" is not a recognized NCDA disability category`,
    isMedicalDiagnosis: false,
  };
}

// ─── Gemini prompt: PWD ID forensics ─────────────────────────────────────────
const PWD_ID_FORENSICS_PROMPT = `
You are a Philippine government document forensics expert specializing in PWD (Person with Disability) ID verification.

Analyze this Philippine LGU-issued PWD ID card image and return ONLY valid JSON — no markdown, no explanation.

=== WHAT TO LOOK FOR ===

AUTHENTICITY SIGNALS (signs the ID is REAL):
- Consistent font throughout (usually Arial or similar sans-serif)
- Clear LGU/municipality seal or logo present
- "REPUBLIC OF THE PHILIPPINES" header
- NCDA logo or reference
- Uniform background color and print quality
- Sequential or structured ID number format
- Readable expiry date (usually 3-5 years from issue)
- Disability category is one of the 9 NCDA categories (NOT a medical diagnosis)
- Photo is embedded in the card (not glued/taped)
- Signature present

FORGERY SIGNALS (red flags):
- Inconsistent fonts (mix of font families, sizes, weights)
- Missing or blurry government seal
- Disability listed as a medical diagnosis (e.g., "Diabetes", "Hypertension") instead of NCDA category
- ID number format that doesn't match PSGC (Province-City-Barangay) structure
- "Municipality of" used for cities (should be "City of") or vice versa
- Photo appears cut-and-pasted (different lighting, resolution, or border)
- Text misalignment or irregular spacing
- Generic/stock template appearance
- Missing required fields (name, ID number, disability, LGU, expiry)
- Watermarks or seals appear digitally added

=== PHILIPPINE PWD ID FORMAT ===
PWD ID numbers typically follow: XX-XXXXXXXXXX-X or similar LGU-specific formats
The 9 valid NCDA disability categories are:
1. Psychosocial Disability
2. Chronic Illness
3. Learning Disability
4. Mental Disability
5. Visual Disability
6. Orthopedic/Physical Disability
7. Speech and Language Impairment
8. Deaf or Hard of Hearing
9. Cancer and Rare Diseases

=== RESPONSE FORMAT ===
Return exactly this JSON:

{
  "extracted_fields": {
    "full_name": "extracted full name or null",
    "pwd_id_number": "extracted ID number or null",
    "disability_type": "extracted disability category or null",
    "issuing_lgu": "extracted LGU name or null",
    "issue_date": "YYYY-MM-DD or null",
    "expiry_date": "YYYY-MM-DD or null",
    "date_of_birth": "YYYY-MM-DD or null",
    "address": "extracted address or null"
  },
  "authenticity_signals": {
    "has_government_seal": true or false,
    "font_consistent": true or false,
    "photo_appears_genuine": true or false,
    "all_required_fields_present": true or false,
    "id_number_format_plausible": true or false,
    "disability_category_valid": true or false,
    "expiry_date_reasonable": true or false,
    "print_quality_consistent": true or false
  },
  "forgery_signals": [
    "describe each forgery signal found, or empty array if none"
  ],
  "forgery_signal_count": 0,
  "overall_suspicion_level": "NONE" or "LOW" or "MEDIUM" or "HIGH",
  "confidence_in_analysis": 0-100,
  "summary": "one sentence summary of the ID document analysis"
}

Be thorough but fair. Many legitimate IDs have poor print quality due to low-budget LGU printers.
`;

// ─── Gemini prompt: Supporting document ──────────────────────────────────────
const SUPPORTING_DOC_PROMPT = `
You are a Philippine medical and government document verification expert.

Analyze this supporting document submitted as part of a PWD (Person with Disability) ID verification.
Acceptable supporting documents include:
- Medical Certificate (from a licensed Philippine physician)
- Barangay Certification of Disability
- PhilHealth MDR (Member Data Record) showing disability
- Hospital records indicating disability
- Psychological or psychiatric evaluation report

Return ONLY valid JSON — no markdown, no explanation.

=== WHAT TO LOOK FOR ===

For Medical Certificates:
- Doctor's full name and PRC license number (7 digits)
- Doctor's specialty (should match the disability type)
- Clinic/hospital name and address
- Patient's full name (should match PWD ID)
- Date of examination
- Clear statement of disability
- Official letterhead or clinic stamp
- Doctor's signature

For Barangay Certifications:
- Official barangay letterhead
- Barangay Captain's name and signature
- Barangay seal
- Specific disability mentioned

Red flags:
- Missing PRC license number on medical cert
- Handwritten certificate with no official letterhead
- Generic template with blanks not filled in
- Mismatch between patient name and PWD ID name
- Specialty inconsistent with disability (e.g., cardiologist certifying psychosocial disability)
- Document appears digitally edited

=== RESPONSE FORMAT ===
Return exactly this JSON:

{
  "document_type": "medical_certificate" or "barangay_certification" or "philhealth_mdr" or "hospital_records" or "psych_evaluation" or "unknown",
  "extracted_fields": {
    "patient_name": "extracted or null",
    "disability_stated": "what disability is mentioned or null",
    "document_date": "YYYY-MM-DD or null",
    "issuing_entity": "doctor name / barangay / hospital or null",
    "prc_license_number": "7-digit PRC number or null",
    "physician_specialty": "specialty or null",
    "physician_name": "doctor full name or null"
  },
  "authenticity_signals": {
    "has_official_letterhead": true or false,
    "has_signature": true or false,
    "has_official_seal_or_stamp": true or false,
    "prc_number_present": true or false,
    "all_required_fields_filled": true or false,
    "suspicious_editing_detected": true or false
  },
  "red_flags": [
    "describe each red flag found, or empty array if none"
  ],
  "overall_suspicion_level": "NONE" or "LOW" or "MEDIUM" or "HIGH",
  "summary": "one sentence summary of the supporting document"
}
`;

// ─── Gemini prompt: Cross-document consistency ───────────────────────────────
function buildCrossDocPrompt(idResult, suppResult) {
  const idName        = idResult?.extracted_fields?.full_name        || "unknown";
  const idDisability  = idResult?.extracted_fields?.disability_type  || "unknown";
  const suppName      = suppResult?.extracted_fields?.patient_name   || "unknown";
  const suppDisability = suppResult?.extracted_fields?.disability_stated || "unknown";

  return `
You are verifying that two Philippine PWD verification documents belong to the same person and are consistent.

Document 1 (PWD ID Card) extracted:
- Name: ${idName}
- Disability: ${idDisability}

Document 2 (Supporting Document) extracted:
- Name: ${suppName}
- Disability stated: ${suppDisability}

Analyze the image provided (ID card back OR front again) and cross-reference the extracted data above.

Return ONLY valid JSON:

{
  "name_match": true or false,
  "disability_match": true or false,
  "name_similarity_note": "explanation of any name differences (e.g., nickname vs formal name)",
  "disability_consistency_note": "explanation of how the disability on supporting doc relates to ID category",
  "overall_consistency": "CONSISTENT" or "MINOR_ISSUES" or "INCONSISTENT",
  "inconsistencies_found": [
    "describe each inconsistency, or empty array"
  ],
  "summary": "one sentence summary of cross-document consistency check"
}

Note: Minor name variations (e.g., middle name missing, nickname used) should be MINOR_ISSUES, not INCONSISTENT.
Only mark INCONSISTENT if names are clearly different people or disability types are completely unrelated.
`;
}

// ─── Gemini API helper ────────────────────────────────────────────────────────
async function callGemini(imageBase64, mimeType, prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set in .env.local");

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inline_data: { mime_type: mimeType, data: imageBase64 } },
              { text: prompt },
            ],
          },
        ],
        generationConfig: {
          temperature:     0.1,  // Low temp = more deterministic, less hallucination
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini ${response.status}: ${errorText.slice(0, 300)}`);
  }

  const data = await response.json();
  const raw  = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const clean = raw.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();

  try {
    return JSON.parse(clean);
  } catch {
    throw new Error(`Gemini returned non-JSON: ${clean.slice(0, 200)}`);
  }
}

// ─── Early reject response helper ────────────────────────────────────────────
function earlyReject(flags, reason) {
  return NextResponse.json({
    success:      false,
    decision:     "REJECT",
    score:        0,
    flags,
    rejectReason: reason,
    analysis:     null,
  });
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const {
      pwdIdFrontBase64,
      pwdIdFrontMime       = "image/jpeg",
      pwdIdBackBase64,
      pwdIdBackMime        = "image/jpeg",
      supportingDocBase64,
      supportingDocMime    = "image/jpeg",
    } = await request.json();

    // ── Layer 1: Input validation ──
    if (!pwdIdFrontBase64) {
      return NextResponse.json(
        { error: "pwdIdFrontBase64 is required" },
        { status: 400 }
      );
    }
    if (!supportingDocBase64) {
      return NextResponse.json(
        { error: "supportingDocBase64 is required" },
        { status: 400 }
      );
    }

    const allFlags = [];

    // ── Layer 3: Gemini — PWD ID forensics ──
    let geminiIdResult = null;
    try {
      geminiIdResult = await callGemini(
        pwdIdFrontBase64,
        pwdIdFrontMime,
        PWD_ID_FORENSICS_PROMPT
      );
    } catch (err) {
      console.error("[analyze-document] ID analysis failed:", err.message);
      allFlags.push(`ID document analysis failed: ${err.message}`);
    }

    // ── Layer 2: Disability category check (runs after Gemini extracts it) ──
    const extractedDisability = geminiIdResult?.extracted_fields?.disability_type;
    if (extractedDisability) {
      const disabilityCheck = validateDisabilityCategory(extractedDisability);
      if (!disabilityCheck.valid && disabilityCheck.isMedicalDiagnosis) {
        return earlyReject(
          [disabilityCheck.flag],
          disabilityCheck.flag
        );
      }
      if (!disabilityCheck.valid) {
        allFlags.push(disabilityCheck.flag);
      }
    }

    // Hard reject: Gemini says HIGH suspicion
    if (geminiIdResult?.overall_suspicion_level === "HIGH") {
      const forgerySignals = geminiIdResult.forgery_signals || [];
      return earlyReject(
        ["AI analysis flagged this ID as highly suspicious of forgery", ...forgerySignals],
        "PWD ID document failed AI forensics check — multiple forgery signals detected"
      );
    }

    // ── Layer 4: Gemini — Supporting document ──
    let geminiSupportingResult = null;
    try {
      geminiSupportingResult = await callGemini(
        supportingDocBase64,
        supportingDocMime,
        SUPPORTING_DOC_PROMPT
      );
    } catch (err) {
      console.error("[analyze-document] Supporting doc analysis failed:", err.message);
      allFlags.push(`Supporting document analysis failed: ${err.message}`);
    }

    // ── Layer 5: Gemini — Cross-document consistency ──
    let crossDocResult = null;
    if (geminiIdResult && geminiSupportingResult) {
      try {
        crossDocResult = await callGemini(
          pwdIdBackBase64 || pwdIdFrontBase64,
          pwdIdBackMime,
          buildCrossDocPrompt(geminiIdResult, geminiSupportingResult)
        );
      } catch (err) {
        console.error("[analyze-document] Cross-doc check failed:", err.message);
        allFlags.push("Cross-document consistency check could not be completed");
      }
    }

    // ── Layer 6: Quick local pre-score ──
    // (Full scoring done by /api/verification/risk-score)
    const suspicionLevels = [
      geminiIdResult?.overall_suspicion_level,
      geminiSupportingResult?.overall_suspicion_level,
    ];
    const highSuspicions = suspicionLevels.filter((l) => l === "HIGH").length;
    const medSuspicions  = suspicionLevels.filter((l) => l === "MEDIUM").length;

    let quickScore = 70; // Baseline
    quickScore -= highSuspicions * 30;
    quickScore -= medSuspicions  * 15;
    quickScore -= (geminiIdResult?.forgery_signal_count || 0) * 5;

    if (crossDocResult?.overall_consistency === "INCONSISTENT") quickScore -= 25;
    if (crossDocResult?.overall_consistency === "MINOR_ISSUES") quickScore -= 10;

    quickScore = Math.max(0, Math.min(100, quickScore));

    const quickDecision =
      quickScore >= 78 ? "AUTO_APPROVE" :
      quickScore >= 45 ? "HUMAN_REVIEW" :
      "REJECT";

    // ── Collect all flags from analysis ──
    const geminiFlags = [
      ...(geminiIdResult?.forgery_signals                      || []),
      ...(geminiSupportingResult?.red_flags                    || []),
      ...(crossDocResult?.inconsistencies_found                || []),
    ];

    const combinedFlags = [...new Set([...allFlags, ...geminiFlags])];

    // ── Return structured response ──
    return NextResponse.json({
      success:  true,
      decision: quickDecision,
      score:    quickScore,
      flags:    combinedFlags,

      // Raw Gemini results — pass these to /api/verification/risk-score
      geminiIdResult,
      geminiSupportingResult,
      crossDocResult,

      // Structured display data for GeminiAnalysis.jsx
      analysis: {
        idDocument: {
          extractedName:      geminiIdResult?.extracted_fields?.full_name,
          idNumber:           geminiIdResult?.extracted_fields?.pwd_id_number,
          disabilityCategory: geminiIdResult?.extracted_fields?.disability_type,
          issuingLgu:         geminiIdResult?.extracted_fields?.issuing_lgu,
          expiryDate:         geminiIdResult?.extracted_fields?.expiry_date,
          suspicionLevel:     geminiIdResult?.overall_suspicion_level,
          forgerySignalCount: geminiIdResult?.forgery_signal_count,
          summary:            geminiIdResult?.summary,
        },
        supportingDocument: {
          documentType:     geminiSupportingResult?.document_type,
          patientName:      geminiSupportingResult?.extracted_fields?.patient_name,
          disabilityStated: geminiSupportingResult?.extracted_fields?.disability_stated,
          prcLicenseNumber: geminiSupportingResult?.extracted_fields?.prc_license_number,
          physicianName:    geminiSupportingResult?.extracted_fields?.physician_name,
          physicianSpecialty: geminiSupportingResult?.extracted_fields?.physician_specialty,
          suspicionLevel:   geminiSupportingResult?.overall_suspicion_level,
          summary:          geminiSupportingResult?.summary,
        },
        crossDocument: {
          consistency:   crossDocResult?.overall_consistency,
          nameMatch:     crossDocResult?.name_match,
          disabilityMatch: crossDocResult?.disability_match,
          summary:       crossDocResult?.summary,
        },
      },

      // Tells frontend what optional checks to run next
      nextSteps: {
        runDohCheck:     !!geminiIdResult?.extracted_fields?.pwd_id_number,
        runPrcCheck:     !!geminiSupportingResult?.extracted_fields?.prc_license_number,
        runLiveness:     true,
        prcLicenseNumber: geminiSupportingResult?.extracted_fields?.prc_license_number,
        idNumberForDoh:  geminiIdResult?.extracted_fields?.pwd_id_number,
        extractedName:   geminiIdResult?.extracted_fields?.full_name,
      },
    });

  } catch (error) {
    console.error("[analyze-document] Unexpected error:", error);
    return NextResponse.json(
      { error: "Document analysis failed", details: error.message },
      { status: 500 }
    );
  }
}