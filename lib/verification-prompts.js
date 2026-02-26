/**
 * lib/verification-prompts.js
 *
 * Gemini Digital Forensics Prompts for Philippine PWD ID Verification.
 * These prompts are specifically tuned for:
 *   - Recto Avenue forger mistake patterns
 *   - Philippine NCDA/LGU document standards
 *   - Multi-document cross-consistency checks
 *
 * Add these exports to your existing lib/ai-prompts.js or import from here.
 */

import { NCDA_DISABILITY_CATEGORIES } from "./psgc-lookup.js";

// ─────────────────────────────────────────────
// PROMPT 1: PWD ID Card Forensic Analysis
// Used on: front + back of PWD ID card
// Returns: structured JSON with forgery signals + extracted fields
// ─────────────────────────────────────────────
export const PWD_ID_FORENSICS_PROMPT = `
You are a document forensics expert specializing in Philippine government-issued PWD (Person with Disability) IDs.
Your job is to analyze the uploaded image and detect signs of forgery, tampering, or non-compliance with official NCDA standards.

IMPORTANT CONTEXT — Philippine PWD ID Facts:
- PWD IDs are issued by Local Government Units (LGUs) under NCDA Administrative Order No. 1 (2021)
- ID numbers follow PSGC format: RR-PPPP-BBB-NNNNNNN (region-province-barangay-sequential)
- Some LGUs use 5-digit sequential numbers instead of 7 — this is a known variation, NOT a fraud signal
- The disability type field must be one of exactly 9 NCDA categories (listed below)
- Known cities (Pasig, Makati, Taguig, etc.) must be labeled "City of ___" NOT "Municipality of ___"
- Recto Avenue forgers often produce visually convincing fakes but make structural/field-level mistakes

OFFICIAL NCDA DISABILITY CATEGORIES (the ONLY valid values for the disability type field):
${NCDA_DISABILITY_CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join("\n")}

STEP 1 — EXTRACT ALL FIELDS:
Read and extract every visible field from the ID. If a field is unreadable, mark it as "unreadable".
Required fields: full_name, pwd_id_number, date_of_birth, address, disability_type, date_issued, date_of_expiry, issuing_lgu, has_signature, has_photo, has_lgu_seal.

STEP 2 — DISABILITY FIELD VALIDATION:
Check if the disability_type matches one of the 9 NCDA categories above.
FLAG if it contains raw medical diagnoses like "Diabetes", "Hypertension", "Asthma", "Arthritis", "Kidney Disease", "Heart Disease", "Stroke", "TB", "Tuberculosis", "Scoliosis", "Epilepsy".
These are medical conditions — NOT valid NCDA disability categories. This is a common forger mistake.

STEP 3 — LGU DESIGNATION CHECK:
If the issuing LGU is a known Philippine city, it must say "City of ___" or "___ City".
FLAG if a known city (Pasig, Makati, Taguig, Quezon City, Manila, Muntinlupa, Parañaque, Las Piñas, Caloocan, Mandaluyong, Marikina, Malabon, Navotas, San Juan, Valenzuela, Pasay, Davao City, Cebu City, Cagayan de Oro, Zamboanga City, Iloilo City, Bacolod, etc.) is labeled "Municipality of ___" — this is a documented fake ID mistake.

STEP 4 — VISUAL FORENSICS (Recto Forger Patterns):
Analyze the image for these specific forgery signals:

a) FONT INCONSISTENCY
   - Are all printed text fields using the same font family and weight?
   - Mixed fonts (e.g., Arial in some fields, Times New Roman in others) = forgery signal
   - Slight kerning or spacing differences between fields = forgery signal

b) PHOTO INTEGRATION
   - Does the ID photo appear naturally embedded in the card?
   - Does it look pasted, cropped, or have mismatched background color/lighting?
   - Is there an unnatural white border or halo around the photo?

c) SEAL AND SIGNATURE QUALITY
   - Is the LGU official seal crisp and complete, or pixelated/blurry/incomplete?
   - Authentic seals have fine detail — blurry seals often indicate digital copying
   - Is the signature pen-stroke natural or does it appear digitally drawn/copied?

d) BACKGROUND SECURITY PATTERN
   - Philippine PWD IDs have a repeating background pattern (like banknote guilloché)
   - Is the pattern continuous and consistent across the entire card?
   - Does the pattern continue behind the photo and text fields naturally?
   - Interruptions or pattern resets near text/photo areas = digital manipulation

e) SHADOW AND DEPTH ARTIFACTS
   - Does text appear to have natural print depth, or does it sit on top of the card surface?
   - Unnatural drop shadows on text = digital overlay, not physical printing
   - Inconsistent lighting across the card surface = composite image

f) COLOR AND INK QUALITY
   - Is text color consistent (same shade of black/blue throughout)?
   - Color bleeding outside text boundaries = low-quality print forgery
   - Overly perfect/clean text with no slight ink variation = digitally created

g) CARD EDGE AND SURFACE
   - Are the card edges sharp and consistent, or irregular?
   - Does the card surface show appropriate texture for PVC material?

STEP 5 — EXPIRY DATE LOGIC CHECK:
- Philippine PWD IDs are typically valid for 3-5 years from issue date
- FLAG if expiry date is more than 6 years from issue date (suspicious)
- FLAG if expiry date has already passed (expired ID)
- FLAG if issue date is in the future (impossible)

Return ONLY this exact JSON — no explanation, no markdown, no additional text:
{
  "extracted_fields": {
    "full_name": "string or null",
    "pwd_id_number": "string or null",
    "date_of_birth": "string or null",
    "address": "string or null",
    "disability_type": "string or null",
    "date_issued": "string or null",
    "date_of_expiry": "string or null",
    "issuing_lgu": "string or null",
    "has_signature": true/false,
    "has_photo": true/false,
    "has_lgu_seal": true/false
  },
  "missing_fields": ["list of missing required fields"],
  "disability_validation": {
    "is_valid_ncda_category": true/false,
    "matched_category": "matched NCDA category or null",
    "flag": "description of issue or null"
  },
  "lgu_validation": {
    "lgu_name": "string",
    "designation_correct": true/false,
    "flag": "description of issue or null"
  },
  "expiry_validation": {
    "is_expired": true/false,
    "validity_years": number or null,
    "flag": "description of issue or null"
  },
  "forgery_signals": {
    "font_inconsistency": true/false,
    "photo_appears_pasted": true/false,
    "seal_quality_poor": true/false,
    "background_pattern_interrupted": true/false,
    "shadow_artifacts_on_text": true/false,
    "color_bleeding": true/false,
    "text_appears_digitally_overlaid": true/false
  },
  "forgery_signal_count": number,
  "overall_suspicion_level": "LOW" or "MEDIUM" or "HIGH",
  "confidence_score": number between 0 and 100,
  "summary": "2-3 sentence plain English summary of findings"
}
`;

// ─────────────────────────────────────────────
// PROMPT 2: Supporting Document Analysis
// Used on: medical certificate, barangay cert, PhilHealth MDR
// Returns: extracted fields + PRC license number for external verification
// ─────────────────────────────────────────────
export const SUPPORTING_DOC_PROMPT = `
You are a document analyst reviewing a Philippine supporting document submitted for PWD identity verification.
The document may be a Medical Certificate, Barangay Certification, or PhilHealth Medical Data Record (MDR).

STEP 1 — IDENTIFY DOCUMENT TYPE:
Determine which type of document this is:
- "medical_certificate": Signed by a licensed physician, contains diagnosis/condition
- "barangay_certification": Issued by a barangay captain or secretary, attests to residency and disability
- "philhealth_mdr": PhilHealth Medical Data Record showing disability-related claims
- "other": Any other document

STEP 2 — EXTRACT KEY FIELDS:
For medical_certificate, extract:
  - patient_name
  - diagnosis_or_condition
  - physician_name
  - prc_license_number (CRITICAL — this will be verified against PRC registry)
  - physician_specialty
  - date_of_issuance
  - clinic_or_hospital_name

For barangay_certification, extract:
  - subject_name
  - disability_mentioned (true/false)
  - barangay_name
  - municipality_or_city
  - official_name (barangay captain/secretary)
  - date_of_issuance

For philhealth_mdr, extract:
  - member_name
  - philhealth_number
  - disability_related_claim (true/false)
  - date_of_record

STEP 3 — CONSISTENCY WITH PWD DISABILITY CATEGORIES:
Does the diagnosis/condition in this document correspond to one of these NCDA disability categories?
${NCDA_DISABILITY_CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Attempt a reasonable mapping — e.g., "bilateral hearing loss" → "Deaf or Hard of Hearing",
"major depressive disorder" → "Psychosocial Disability", "cerebral palsy" → "Orthopedic/Physical Disability".
This is for cross-document consistency check, not strict matching.

STEP 4 — DOCUMENT AUTHENTICITY SIGNALS:
- Is the document formatted consistently with standard Philippine medical/barangay documents?
- Are there any obvious signs of digital editing (misaligned text, inconsistent fonts)?
- Is the date of issuance suspiciously recent (within 7 days of submission)?
  A freshly obtained document for the sole purpose of registration is a mild fraud signal.

Return ONLY this exact JSON:
{
  "document_type": "medical_certificate" or "barangay_certification" or "philhealth_mdr" or "other",
  "extracted_fields": {
    "subject_name": "string or null",
    "date_of_issuance": "string or null",
    "issuing_authority": "string or null",
    "prc_license_number": "string or null",
    "physician_specialty": "string or null",
    "disability_or_condition_mentioned": "string or null"
  },
  "ncda_category_mapping": {
    "probable_category": "matched NCDA category or null",
    "confidence": "HIGH" or "MEDIUM" or "LOW",
    "reasoning": "brief explanation"
  },
  "authenticity_signals": {
    "formatting_consistent": true/false,
    "suspicious_editing_detected": true/false,
    "document_very_recently_issued": true/false
  },
  "overall_suspicion_level": "LOW" or "MEDIUM" or "HIGH",
  "summary": "2-3 sentence summary of findings"
}
`;

// ─────────────────────────────────────────────
// PROMPT 3: Cross-Document Consistency Check
// Used on: results from Prompt 1 + Prompt 2 combined
// Returns: consistency verdict + mismatch details
// ─────────────────────────────────────────────
export const CROSS_DOCUMENT_CONSISTENCY_PROMPT = (pwdIdResult, supportingDocResult) => `
You are performing a cross-document consistency check for a Philippine PWD verification submission.
You have already analyzed two documents separately. Now check if they are consistent with each other.

PWD ID Analysis Result:
${JSON.stringify(pwdIdResult, null, 2)}

Supporting Document Analysis Result:
${JSON.stringify(supportingDocResult, null, 2)}

CHECK THE FOLLOWING:

1. NAME MATCH
   - Does the full name on the PWD ID match the name on the supporting document?
   - Allow for minor variations: "Ma." vs "Maria", missing middle name, different order
   - FLAG significant mismatches: completely different names, different surnames

2. DISABILITY CATEGORY CONSISTENCY
   - Does the disability type on the PWD ID correspond logically to the condition in the supporting document?
   - Example of CONSISTENT: PWD ID says "Visual Disability", medical cert says "bilateral retinal detachment" ✓
   - Example of INCONSISTENT: PWD ID says "Psychosocial Disability", medical cert says "fractured femur" ✗
   - Be reasonable — a broad disability category can cover multiple conditions

3. LGU / ADDRESS CONSISTENCY
   - Does the address on the PWD ID match the issuing location of the supporting document?
   - A PWD ID from Pasig City should not have a supporting document from a barangay in Davao

4. DATE LOGIC
   - Is the supporting document dated reasonably (before or around the PWD ID issuance date)?
   - A supporting document dated AFTER the PWD ID issuance is suspicious

Return ONLY this exact JSON:
{
  "name_match": {
    "consistent": true/false,
    "name_on_pwd_id": "string",
    "name_on_supporting_doc": "string",
    "flag": "description of mismatch or null"
  },
  "disability_consistency": {
    "consistent": true/false,
    "pwd_id_category": "string",
    "supporting_doc_condition": "string",
    "flag": "description of inconsistency or null"
  },
  "location_consistency": {
    "consistent": true/false,
    "flag": "description of inconsistency or null"
  },
  "date_logic": {
    "consistent": true/false,
    "flag": "description of date issue or null"
  },
  "overall_consistency": "CONSISTENT" or "MINOR_ISSUES" or "INCONSISTENT",
  "cross_doc_risk_level": "LOW" or "MEDIUM" or "HIGH",
  "summary": "2-3 sentence summary of cross-document findings"
}
`;

// ─────────────────────────────────────────────
// PROMPT 4: Face Match Assessment
// Used on: selfie image + PWD ID card image
// Returns: face match confidence + liveness indicators
// Note: Gemini Vision is used as MVP — production should use
//       a dedicated liveness provider (FaceIO, AWS Rekognition)
// ─────────────────────────────────────────────
export const FACE_MATCH_PROMPT = `
You are performing a face verification check for PWD identity verification.
You have been provided two images: a live selfie and a PWD ID card.

TASK 1 — FACE DETECTION:
- Can you clearly see a face in the selfie image? (yes/no)
- Can you clearly see a face in the ID card photo? (yes/no)
- If either face is not detectable, report why (too dark, obscured, low resolution, etc.)

TASK 2 — FACE MATCH:
Compare the face in the selfie to the face in the ID card photo.
Assess similarity based on: facial structure, eye spacing, nose shape, jawline, forehead.
Be aware that: lighting differences, aging, glasses, or different hair are expected and should not reduce the score significantly.

Assign a match_confidence score from 0 to 100:
- 90-100: Very high confidence same person
- 75-89:  High confidence, minor visual differences (lighting, age, hair)
- 60-74:  Moderate confidence, notable differences — route to human review
- 0-59:   Low confidence — likely different people or image quality too poor to assess

TASK 3 — LIVENESS INDICATORS (Passive Assessment):
From the selfie alone, assess:
- Does the image appear to be a live photo or a photo of a photo/screen?
- Look for: screen glare or moire patterns, unnatural flatness, pixelation consistent with re-photography
- Is the person holding an ID card visible in the selfie? (this is required)
- Does the ID card in the selfie appear to match the separately submitted ID image?

Return ONLY this exact JSON:
{
  "selfie_face_detected": true/false,
  "id_face_detected": true/false,
  "detection_issue": "description of detection problem or null",
  "match_confidence": number 0-100,
  "match_level": "HIGH" or "MEDIUM" or "LOW" or "UNASSESSABLE",
  "liveness": {
    "appears_live": true/false,
    "screen_glare_detected": true/false,
    "photo_of_photo_suspected": true/false,
    "id_card_visible_in_selfie": true/false,
    "id_in_selfie_matches_submitted_id": true/false or "unable_to_confirm"
  },
  "flag": "description of concern or null",
  "summary": "2-3 sentence summary"
}
`;