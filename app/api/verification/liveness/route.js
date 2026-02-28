/**
 * app/api/verification/liveness/route.js
 *
 * POST /api/verification/liveness
 *
 * Takes a live selfie + the PWD ID front image and asks Gemini to:
 *   1. Check if the selfie appears to be a real live person (liveness)
 *   2. Compare the face on the selfie to the face on the ID card
 *
 * Returns a structured JSON result used by LivenessCheck.jsx and
 * fed into the risk scorer.
 *
 * No database required — purely stateless AI analysis.
 *
 * Request body:
 *   selfieBase64      string  — base64 encoded selfie image
 *   selfieMime        string  — "image/jpeg" | "image/png" (default: image/jpeg)
 *   pwdIdFrontBase64  string  — base64 encoded PWD ID front image
 *   pwdIdFrontMime    string  — mime type of ID image
 *
 * Response:
 *   {
 *     success: true,
 *     liveness: {
 *       appearsLive:     boolean,
 *       confidence:      number (0–100),
 *       flags:           string[],
 *       summary:         string,
 *     },
 *     faceMatch: {
 *       isMatch:         boolean,
 *       confidence:      number (0–100),
 *       matchLevel:      "HIGH" | "MEDIUM" | "LOW" | "NO_MATCH",
 *       flags:           string[],
 *       summary:         string,
 *     },
 *     overallPass:       boolean,
 *     score:             number (0–100),
 *     flags:             string[],
 *   }
 */

import { NextResponse } from "next/server";

// ─── Gemini prompt for combined liveness + face match ─────────────────────────
const LIVENESS_FACE_MATCH_PROMPT = `
You are a KYC (Know Your Customer) liveness and face-matching AI for a Philippine PWD verification system.

You are given TWO images:
- Image 1: A live selfie taken by the applicant
- Image 2: The front of a Philippine PWD (Person with Disability) ID card

Perform the following analysis and respond ONLY with valid JSON — no explanation, no markdown, no extra text.

=== TASK 1: LIVENESS CHECK ===
Analyze Image 1 (the selfie) to determine if it is a real live person or an attempt to spoof:

Check for:
- Is this a photo of a photo (printed image held up)?
- Is this a screen showing a photo (phone/tablet/monitor)?
- Is the face clearly visible and well-lit?
- Is the face oriented naturally toward the camera?
- Are there any deepfake or AI-generated artifacts?
- Does the image look like a real webcam/phone camera shot?

=== TASK 2: FACE MATCH ===
Compare the face in Image 1 (selfie) to the face on the ID card in Image 2:

Check for:
- Are both faces clearly visible?
- Do they appear to be the same person? Look at: facial structure, eye spacing, nose shape, chin shape, overall proportions.
- Note: Allow for reasonable differences due to age, lighting, photo quality, glasses, hairstyle.
- Be strict about fundamental facial structure — if the faces clearly belong to different people, say so.

=== RESPONSE FORMAT ===
Return exactly this JSON structure:

{
  "liveness": {
    "appears_live": true or false,
    "confidence": 0-100,
    "spoof_type": null or one of: "photo_of_photo", "screen_spoof", "deepfake", "unclear_image", "face_not_visible",
    "face_visible": true or false,
    "face_centered": true or false,
    "flags": [],
    "summary": "one sentence description of liveness result"
  },
  "face_match": {
    "faces_detected_selfie": true or false,
    "faces_detected_id": true or false,
    "is_match": true or false,
    "confidence": 0-100,
    "match_level": "HIGH" or "MEDIUM" or "LOW" or "NO_MATCH",
    "notable_differences": [],
    "flags": [],
    "summary": "one sentence description of face match result"
  },
  "overall_pass": true or false,
  "overall_score": 0-100,
  "summary": "one overall sentence about liveness + face match combined"
}

Scoring guide:
- overall_score 80–100: Both liveness confirmed AND face is a strong match
- overall_score 50–79: One or both have minor concerns
- overall_score 0–49:  Liveness failed OR faces clearly don't match

Be accurate and strict. This is an anti-fraud system.
`;

// ─── Gemini API call ───────────────────────────────────────────────────────────
async function callGeminiLiveness(selfieB64, selfieMime, idB64, idMime) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured in .env.local");

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
              { text: "Image 1 — Live Selfie (taken right now by applicant):" },
              { inline_data: { mime_type: selfieMime, data: selfieB64 } },
              { text: "Image 2 — PWD ID Card (front side):" },
              { inline_data: { mime_type: idMime,     data: idB64 } },
              { text: LIVENESS_FACE_MATCH_PROMPT },
            ],
          },
        ],
        generationConfig: {
          temperature:     0.1,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorText.slice(0, 300)}`);
  }

  const data = await response.json();
  const raw  = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Strip markdown code fences if Gemini wraps in ```json
  const clean = raw
    .replace(/```json\n?/gi, "")
    .replace(/```\n?/gi, "")
    .trim();

  try {
    return JSON.parse(clean);
  } catch {
    throw new Error(`Gemini returned non-JSON response: ${clean.slice(0, 200)}`);
  }
}

// ─── Main handler ──────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const {
      selfieBase64,
      selfieMime       = "image/jpeg",
      pwdIdFrontBase64,
      pwdIdFrontMime   = "image/jpeg",
    } = await request.json();

    // ── Input validation ──
    if (!selfieBase64) {
      return NextResponse.json(
        { error: "selfieBase64 is required" },
        { status: 400 }
      );
    }

    if (!pwdIdFrontBase64) {
      return NextResponse.json(
        { error: "pwdIdFrontBase64 is required — needed for face matching" },
        { status: 400 }
      );
    }

    // ── Call Gemini ──
    let geminiResult;
    try {
      geminiResult = await callGeminiLiveness(
        selfieBase64,
        selfieMime,
        pwdIdFrontBase64,
        pwdIdFrontMime
      );
    } catch (geminiError) {
      console.error("[Liveness] Gemini call failed:", geminiError.message);
      return NextResponse.json(
        {
          success:     false,
          error:       "AI analysis failed",
          details:     geminiError.message,
          overallPass: false,
          score:       0,
          flags:       ["Liveness check could not be completed — AI service error"],
        },
        { status: 200 } // Return 200 so frontend can handle gracefully
      );
    }

    // ── Extract and normalize results ──
    const liveness  = geminiResult.liveness   || {};
    const faceMatch = geminiResult.face_match  || {};

    // Collect all flags from both checks
    const allFlags = [
      ...(liveness.flags   || []),
      ...(faceMatch.flags  || []),
    ];

    // Add interpretive flags for the frontend
    if (!liveness.appears_live) {
      allFlags.push(
        liveness.spoof_type
          ? `Liveness failed: ${liveness.spoof_type.replace(/_/g, " ")}`
          : "Liveness check failed — selfie does not appear to be a live person"
      );
    }

    if (!faceMatch.faces_detected_selfie) {
      allFlags.push("No face detected in selfie — please retake with your face clearly visible");
    }

    if (!faceMatch.faces_detected_id) {
      allFlags.push("No face detected on ID card — ensure ID front is uploaded clearly");
    }

    if (faceMatch.faces_detected_selfie && faceMatch.faces_detected_id && !faceMatch.is_match) {
      allFlags.push("Face on selfie does not match face on PWD ID card");
    }

    // ── Build final response ──
    return NextResponse.json({
      success: true,

      liveness: {
        appearsLive:  liveness.appears_live   ?? false,
        confidence:   liveness.confidence     ?? 0,
        spoofType:    liveness.spoof_type     ?? null,
        faceVisible:  liveness.face_visible   ?? false,
        faceCentered: liveness.face_centered  ?? false,
        flags:        liveness.flags          || [],
        summary:      liveness.summary        || "Liveness analysis complete",
      },

      faceMatch: {
        facesDetectedSelfie: faceMatch.faces_detected_selfie ?? false,
        facesDetectedId:     faceMatch.faces_detected_id     ?? false,
        isMatch:             faceMatch.is_match              ?? false,
        confidence:          faceMatch.confidence            ?? 0,
        matchLevel:          faceMatch.match_level           || "NO_MATCH",
        notableDifferences:  faceMatch.notable_differences   || [],
        flags:               faceMatch.flags                 || [],
        summary:             faceMatch.summary               || "Face match analysis complete",
      },

      overallPass:  geminiResult.overall_pass  ?? false,
      score:        geminiResult.overall_score ?? 0,
      flags:        [...new Set(allFlags)], // deduplicate
      summary:      geminiResult.summary || "Liveness and face match analysis complete",
    });

  } catch (error) {
    console.error("[Liveness] Unexpected error:", error);
    return NextResponse.json(
      { error: "Liveness check failed", details: error.message },
      { status: 500 }
    );
  }
}