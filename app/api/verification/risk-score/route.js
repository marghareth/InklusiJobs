/**
 * app/api/verification/risk-score/route.js
 *
 * POST /api/verification/risk-score
 *
 * Computes a final verification risk score (0–100) from all the
 * analysis results collected during the verification flow.
 *
 * No database required — purely stateless computation.
 * Call this AFTER you have results from:
 *   - /api/verification/analyze-document  (Gemini ID + supporting doc analysis)
 *   - /api/verification/liveness          (face match + liveness)
 *
 * Request body:
 *   {
 *     geminiIdResult:         object,   // from analyze-document
 *     geminiSupportingResult: object,   // from analyze-document
 *     crossDocResult:         object,   // from analyze-document
 *     livenessResult:         object,   // from /liveness
 *     psgcValidation:         object,   // { valid, normalized, flags }
 *     lguValidation:          object,   // { correct, flag }
 *     disabilityValidation:   object,   // { valid, flag }
 *     dohRegistryFound:       boolean,
 *     prcLicenseValid:        boolean,
 *     submissionDurationSecs: number,   // optional — for behavioral analysis
 *   }
 *
 * Response:
 *   {
 *     success:  true,
 *     score:    number (0–100),
 *     decision: "AUTO_APPROVE" | "HUMAN_REVIEW" | "REJECT",
 *     flags:    string[],
 *     breakdown: {
 *       documentAuthenticity: number,
 *       crossDocConsistency:  number,
 *       faceMatchConfidence:  number,
 *       registryMatch:        number,
 *       formatValidity:       number,
 *     },
 *     reasoning: string,
 *   }
 */

import { NextResponse } from "next/server";

// ─── Scoring weights (must sum to 100) ───────────────────────────────────────
const WEIGHTS = {
  documentAuthenticity: 35,  // Gemini forgery analysis of the ID
  crossDocConsistency:  20,  // Names/details match across documents
  faceMatchConfidence:  20,  // Liveness + face match
  formatValidity:       15,  // PSGC format, LGU designation, disability category
  registryMatch:        10,  // DOH + PRC registry hits (bonus — not penalized if missing)
};

// ─── Decision thresholds ──────────────────────────────────────────────────────
const THRESHOLDS = {
  AUTO_APPROVE: 78,   // >= 78 → auto approve
  HUMAN_REVIEW: 45,   // >= 45 → human review
                      // <  45 → reject
};

// ─── Hard-reject conditions (score immediately → 0 regardless of weights) ────
function checkHardRejects(inputs) {
  const rejects = [];

  const { geminiIdResult, livenessResult, disabilityValidation } = inputs;

  // Hard reject: Gemini says the ID is clearly forged
  if (geminiIdResult?.overall_suspicion_level === "HIGH") {
    rejects.push("AI analysis flagged ID as high suspicion of forgery");
  }

  // Hard reject: Liveness spoof detected
  if (livenessResult && !livenessResult.liveness?.appearsLive && livenessResult.liveness?.spoofType) {
    rejects.push(`Liveness spoof detected: ${livenessResult.liveness.spoofType.replace(/_/g, " ")}`);
  }

  // Hard reject: Invalid disability category (medical diagnosis instead of NCDA category)
  if (disabilityValidation?.valid === false && disabilityValidation?.flag?.includes("medical diagnosis")) {
    rejects.push(disabilityValidation.flag);
  }

  // Hard reject: Face clearly doesn't match
  if (livenessResult?.faceMatch?.matchLevel === "NO_MATCH" &&
      livenessResult?.faceMatch?.facesDetectedSelfie &&
      livenessResult?.faceMatch?.facesDetectedId) {
    rejects.push("Selfie face does not match face on PWD ID card");
  }

  return rejects;
}

// ─── Score: Document Authenticity (0–100) ────────────────────────────────────
function scoreDocumentAuthenticity(geminiIdResult) {
  if (!geminiIdResult) return 40; // Inconclusive — not a zero

  const suspicion = geminiIdResult.overall_suspicion_level || "MEDIUM";
  const forgeryCount = geminiIdResult.forgery_signal_count ?? 3;

  let base = {
    NONE:   95,
    LOW:    80,
    MEDIUM: 55,
    HIGH:   10,
  }[suspicion] ?? 50;

  // Deduct for each forgery signal found (up to -25 total)
  const deduction = Math.min(forgeryCount * 8, 25);
  return Math.max(0, base - deduction);
}

// ─── Score: Cross-Document Consistency (0–100) ───────────────────────────────
function scoreCrossDocConsistency(crossDocResult) {
  if (!crossDocResult) return 50; // Inconclusive

  const consistency = crossDocResult.overall_consistency || "MINOR_ISSUES";

  return {
    CONSISTENT:   95,
    MINOR_ISSUES: 60,
    INCONSISTENT: 15,
  }[consistency] ?? 50;
}

// ─── Score: Face Match + Liveness (0–100) ────────────────────────────────────
function scoreFaceMatch(livenessResult) {
  if (!livenessResult) return 50; // Liveness was skipped — neutral

  const { liveness, faceMatch, score } = livenessResult;

  // If Gemini returned an overall score, trust it directly
  if (typeof score === "number") return score;

  // Otherwise compute manually
  let faceScore = 50;

  if (!liveness?.appearsLive) faceScore -= 40;
  else faceScore += 20;

  const matchLevel = faceMatch?.matchLevel || "LOW";
  faceScore += { HIGH: 30, MEDIUM: 15, LOW: 0, NO_MATCH: -40 }[matchLevel] ?? 0;

  return Math.max(0, Math.min(100, faceScore));
}

// ─── Score: Format Validity (0–100) ──────────────────────────────────────────
function scoreFormatValidity(psgcValidation, lguValidation, disabilityValidation) {
  let score = 100;
  const flags = [];

  if (psgcValidation) {
    if (!psgcValidation.valid) {
      score -= 30;
      flags.push("PWD ID number format does not match PSGC standard");
    }
  }

  if (lguValidation) {
    if (!lguValidation.correct) {
      score -= 20;
      if (lguValidation.flag) flags.push(lguValidation.flag);
    }
  }

  if (disabilityValidation) {
    if (!disabilityValidation.valid) {
      score -= 30;
      if (disabilityValidation.flag) flags.push(disabilityValidation.flag);
    }
  }

  return { score: Math.max(0, score), flags };
}

// ─── Score: Registry Match (0–100) ───────────────────────────────────────────
// Note: NOT FOUND is not penalized — many valid IDs aren't in the registry yet.
// Only a POSITIVE match adds points.
function scoreRegistryMatch(dohRegistryFound, prcLicenseValid) {
  let score = 50; // Neutral baseline

  if (dohRegistryFound === true)  score += 40;
  if (prcLicenseValid  === true)  score += 10;

  return Math.min(100, score);
}

// ─── Behavioral flag detection ────────────────────────────────────────────────
function detectBehavioralFlags(submissionDurationSecs) {
  const flags = [];

  if (submissionDurationSecs !== null && submissionDurationSecs !== undefined) {
    if (submissionDurationSecs < 30) {
      flags.push("Unusually fast submission — completed in under 30 seconds");
    }
    if (submissionDurationSecs > 3600) {
      flags.push("Unusually long submission — took over 1 hour");
    }
  }

  return flags;
}

// ─── Main handler ──────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const {
      geminiIdResult,
      geminiSupportingResult,
      crossDocResult,
      livenessResult,
      psgcValidation,
      lguValidation,
      disabilityValidation,
      dohRegistryFound     = false,
      prcLicenseValid      = false,
      submissionDurationSecs = null,
    } = await request.json();

    // ── Hard reject check first ──
    const hardRejects = checkHardRejects({
      geminiIdResult,
      livenessResult,
      disabilityValidation,
    });

    if (hardRejects.length > 0) {
      return NextResponse.json({
        success:  true,
        score:    0,
        decision: "REJECT",
        flags:    hardRejects,
        breakdown: {
          documentAuthenticity: 0,
          crossDocConsistency:  0,
          faceMatchConfidence:  0,
          formatValidity:       0,
          registryMatch:        0,
        },
        reasoning: `Hard rejection: ${hardRejects[0]}`,
      });
    }

    // ── Compute individual component scores ──
    const docAuthScore     = scoreDocumentAuthenticity(geminiIdResult);
    const crossDocScore    = scoreCrossDocConsistency(crossDocResult);
    const faceScore        = scoreFaceMatch(livenessResult);
    const formatResult     = scoreFormatValidity(psgcValidation, lguValidation, disabilityValidation);
    const registryScore    = scoreRegistryMatch(dohRegistryFound, prcLicenseValid);
    const behavioralFlags  = detectBehavioralFlags(submissionDurationSecs);

    // ── Weighted final score ──
    const weightedScore =
      (docAuthScore    * WEIGHTS.documentAuthenticity / 100) +
      (crossDocScore   * WEIGHTS.crossDocConsistency  / 100) +
      (faceScore       * WEIGHTS.faceMatchConfidence  / 100) +
      (formatResult.score * WEIGHTS.formatValidity    / 100) +
      (registryScore   * WEIGHTS.registryMatch        / 100);

    const finalScore = Math.round(Math.min(100, Math.max(0, weightedScore)));

    // ── Decision ──
    const decision =
      finalScore >= THRESHOLDS.AUTO_APPROVE ? "AUTO_APPROVE" :
      finalScore >= THRESHOLDS.HUMAN_REVIEW ? "HUMAN_REVIEW" :
      "REJECT";

    // ── Collect all flags ──
    const allFlags = [
      ...formatResult.flags,
      ...behavioralFlags,
      ...(geminiIdResult?.flags          || []),
      ...(livenessResult?.flags          || []),
    ].filter(Boolean);

    // ── Human-readable reasoning ──
    const reasoning =
      decision === "AUTO_APPROVE"
        ? `All verification layers passed with a score of ${finalScore}/100. PWD badge can be issued automatically.`
        : decision === "HUMAN_REVIEW"
        ? `Score of ${finalScore}/100 requires human review. Key concerns: ${allFlags.slice(0, 2).join("; ") || "minor inconsistencies"}.`
        : `Score of ${finalScore}/100 is below the minimum threshold. Verification rejected: ${allFlags[0] || "multiple failures"}.`;

    return NextResponse.json({
      success:  true,
      score:    finalScore,
      decision,
      flags:    [...new Set(allFlags)],
      breakdown: {
        documentAuthenticity: Math.round(docAuthScore),
        crossDocConsistency:  Math.round(crossDocScore),
        faceMatchConfidence:  Math.round(faceScore),
        formatValidity:       Math.round(formatResult.score),
        registryMatch:        Math.round(registryScore),
      },
      reasoning,
      // Pass through for admin dashboard
      meta: {
        weights:    WEIGHTS,
        thresholds: THRESHOLDS,
        dohFound:   dohRegistryFound,
        prcValid:   prcLicenseValid,
      },
    });

  } catch (error) {
    console.error("[RiskScore] Unexpected error:", error);
    return NextResponse.json(
      { error: "Risk scoring failed", details: error.message },
      { status: 500 }
    );
  }
}