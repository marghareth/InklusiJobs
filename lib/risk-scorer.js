/**
 * lib/risk-scorer.js
 *
 * Combines all verification layer results into a single risk score (0-100)
 * and a final decision: AUTO_APPROVE, HUMAN_REVIEW, or REJECT.
 *
 * Philosophy: No single layer determines the outcome.
 * A fraudster must beat ALL layers simultaneously — which makes the cost
 * of fraud exponentially higher than the benefit.
 */

// ─────────────────────────────────────────────
// DECISION THRESHOLDS
// ─────────────────────────────────────────────
const THRESHOLDS = {
  AUTO_APPROVE: 80,   // Score ≥ 80 → auto-approve, PWD Verified badge issued
  HUMAN_REVIEW: 50,   // Score 50–79 → human reviewer queue
  REJECT: 0,          // Score < 50 → reject, user notified with reason
};

// ─────────────────────────────────────────────
// SCORE WEIGHTS
// Each signal adds or deducts from a base score of 100.
// Hard fails (livenessPass=false) are severe deductions.
// Positive signals (DOH registry match) add confidence.
// ─────────────────────────────────────────────
const WEIGHTS = {
  // ── Hard Fails (route to REJECT territory immediately) ──
  LIVENESS_FAILED:              -45,  // Not a live person or spoof detected
  ID_NUMBER_FORMAT_INVALID:     -40,  // PSGC format completely wrong
  GEMINI_HIGH_SUSPICION:        -35,  // AI rates document as HIGH suspicion
  DISABILITY_CATEGORY_INVALID:  -25,  // Not an NCDA category (often a diagnosis)
  LGU_DESIGNATION_WRONG:        -20,  // Municipality vs City mismatch
  CROSS_DOC_INCONSISTENT:       -30,  // Names or disability categories don't match
  FACE_MATCH_VERY_LOW:          -30,  // Face match < 60% (likely different person)

  // ── Medium Signals (push toward HUMAN_REVIEW) ──
  GEMINI_MEDIUM_SUSPICION:      -20,
  FORGERY_SIGNALS_3_PLUS:       -20,  // 3+ visual forgery signals detected
  FORGERY_SIGNALS_1_TO_2:       -10,  // 1-2 visual forgery signals
  FACE_MATCH_LOW:               -20,  // Face match 60-74%
  CROSS_DOC_MINOR_ISSUES:       -10,
  SUPPORTING_DOC_SUSPICIOUS:    -15,
  DOC_VERY_RECENTLY_ISSUED:      -8,  // Doc obtained <7 days before submission
  ID_EXPIRED:                   -15,

  // ── Behavioral Flags (per flag) ──
  BEHAVIORAL_FLAG_EACH:          -8,

  // ── Positive Signals (increase confidence) ──
  DOH_REGISTRY_MATCH:           +15,  // Found in DOH PWD registry
  PRC_LICENSE_VALID:            +10,  // Doctor's PRC license confirmed valid
  FACE_MATCH_HIGH:               +5,  // Face match > 90%
  ALL_FIELDS_PRESENT:            +5,  // No missing required fields on ID
  CROSS_DOC_CONSISTENT:          +5,  // All cross-document checks pass
};

/**
 * Main risk scoring function.
 * Call this after all verification layers have completed.
 *
 * @param {Object} params
 * @param {Object} params.geminiIdResult       - Result from PWD_ID_FORENSICS_PROMPT
 * @param {Object} params.geminiSupportingResult - Result from SUPPORTING_DOC_PROMPT
 * @param {Object} params.crossDocResult       - Result from CROSS_DOCUMENT_CONSISTENCY_PROMPT
 * @param {Object} params.faceMatchResult      - Result from FACE_MATCH_PROMPT
 * @param {Object} params.psgcValidation       - Result from validatePWDIdFormat()
 * @param {Object} params.lguValidation        - Result from validateLGUDesignation()
 * @param {Object} params.disabilityValidation - Result from validateDisabilityCategory()
 * @param {boolean} params.dohRegistryFound    - True if ID found in DOH PRPWD registry
 * @param {boolean} params.prcLicenseValid     - True if doctor's PRC license verified
 * @param {boolean} params.isDuplicate         - True if ID number already in database
 * @param {string[]} params.behavioralFlags    - Array of behavioral red flag strings
 *
 * @returns {{ score: number, decision: string, flags: string[], breakdown: Object }}
 */
export function calculateRiskScore({
  geminiIdResult,
  geminiSupportingResult,
  crossDocResult,
  faceMatchResult,
  psgcValidation,
  lguValidation,
  disabilityValidation,
  dohRegistryFound = false,
  prcLicenseValid = false,
  isDuplicate = false,
  behavioralFlags = [],
}) {
  let score = 100;
  const flags = [];
  const breakdown = {};

  // ── IMMEDIATE HARD REJECT CONDITIONS ──
  // These are so definitive that they bypass the scoring system entirely
  if (isDuplicate) {
    return {
      score: 0,
      decision: "REJECT",
      flags: ["This PWD ID number is already registered to another account — duplicate submission detected"],
      breakdown: { isDuplicate: true },
    };
  }

  // ── LIVENESS CHECK ──
  if (faceMatchResult) {
    if (!faceMatchResult.liveness?.appears_live || faceMatchResult.liveness?.photo_of_photo_suspected) {
      score += WEIGHTS.LIVENESS_FAILED;
      flags.push("Liveness check failed — possible photo or video spoof detected");
      breakdown.liveness = "FAILED";
    } else {
      breakdown.liveness = "PASSED";
    }

    if (!faceMatchResult.liveness?.id_card_visible_in_selfie) {
      score -= 15;
      flags.push("PWD ID card was not visible in the selfie as required");
    }

    // Face match scoring
    const matchConf = faceMatchResult.match_confidence || 0;
    if (matchConf < 60) {
      score += WEIGHTS.FACE_MATCH_VERY_LOW;
      flags.push(`Face match confidence is very low (${matchConf}%) — likely different person`);
      breakdown.faceMatch = "VERY_LOW";
    } else if (matchConf < 75) {
      score += WEIGHTS.FACE_MATCH_LOW;
      flags.push(`Face match confidence is low (${matchConf}%) — needs human review`);
      breakdown.faceMatch = "LOW";
    } else if (matchConf > 90) {
      score += WEIGHTS.FACE_MATCH_HIGH;
      breakdown.faceMatch = "HIGH";
    } else {
      breakdown.faceMatch = "MEDIUM";
    }
  }

  // ── PSGC / ID FORMAT VALIDATION ──
  if (psgcValidation) {
    if (!psgcValidation.valid) {
      score += WEIGHTS.ID_NUMBER_FORMAT_INVALID;
      flags.push(...psgcValidation.flags);
      breakdown.idFormat = "INVALID";
    } else {
      breakdown.idFormat = "VALID";
    }
  }

  // ── LGU DESIGNATION ──
  if (lguValidation && !lguValidation.correct) {
    score += WEIGHTS.LGU_DESIGNATION_WRONG;
    flags.push(lguValidation.flag);
    breakdown.lguDesignation = "INVALID";
  } else {
    breakdown.lguDesignation = "VALID";
  }

  // ── DISABILITY CATEGORY ──
  if (disabilityValidation) {
    if (!disabilityValidation.valid) {
      score += WEIGHTS.DISABILITY_CATEGORY_INVALID;
      flags.push(disabilityValidation.flag);
      breakdown.disabilityCategory = "INVALID";
    } else {
      breakdown.disabilityCategory = "VALID";
    }
  }

  // ── GEMINI AI ANALYSIS ──
  if (geminiIdResult) {
    const suspicion = geminiIdResult.overall_suspicion_level;

    if (suspicion === "HIGH") {
      score += WEIGHTS.GEMINI_HIGH_SUSPICION;
      flags.push(`Gemini AI rated document suspicion as HIGH: ${geminiIdResult.summary}`);
      breakdown.geminiSuspicion = "HIGH";
    } else if (suspicion === "MEDIUM") {
      score += WEIGHTS.GEMINI_MEDIUM_SUSPICION;
      flags.push(`Gemini AI flagged medium suspicion: ${geminiIdResult.summary}`);
      breakdown.geminiSuspicion = "MEDIUM";
    } else {
      breakdown.geminiSuspicion = "LOW";
    }

    // Forgery signals
    const forgeryCount = geminiIdResult.forgery_signal_count || 0;
    if (forgeryCount >= 3) {
      score += WEIGHTS.FORGERY_SIGNALS_3_PLUS;
      flags.push(`${forgeryCount} visual forgery signals detected (font inconsistency, photo pasting, seal quality, etc.)`);
      breakdown.forgerySignals = forgeryCount;
    } else if (forgeryCount >= 1) {
      score += WEIGHTS.FORGERY_SIGNALS_1_TO_2;
      flags.push(`${forgeryCount} visual forgery signal(s) detected — flagged for review`);
      breakdown.forgerySignals = forgeryCount;
    } else {
      breakdown.forgerySignals = 0;
    }

    // Missing fields
    if (geminiIdResult.missing_fields?.length === 0) {
      score += WEIGHTS.ALL_FIELDS_PRESENT;
      breakdown.allFieldsPresent = true;
    } else if (geminiIdResult.missing_fields?.length > 0) {
      score -= geminiIdResult.missing_fields.length * 5;
      flags.push(`Missing required fields: ${geminiIdResult.missing_fields.join(", ")}`);
      breakdown.allFieldsPresent = false;
    }

    // Expiry check
    if (geminiIdResult.expiry_validation?.is_expired) {
      score += WEIGHTS.ID_EXPIRED;
      flags.push("PWD ID has expired — a current, valid ID is required");
      breakdown.idExpired = true;
    }
  }

  // ── CROSS-DOCUMENT CONSISTENCY ──
  if (crossDocResult) {
    if (crossDocResult.overall_consistency === "INCONSISTENT") {
      score += WEIGHTS.CROSS_DOC_INCONSISTENT;
      const crossFlags = [
        crossDocResult.name_match?.flag,
        crossDocResult.disability_consistency?.flag,
        crossDocResult.location_consistency?.flag,
        crossDocResult.date_logic?.flag,
      ].filter(Boolean);
      flags.push(...crossFlags);
      breakdown.crossDoc = "INCONSISTENT";
    } else if (crossDocResult.overall_consistency === "MINOR_ISSUES") {
      score += WEIGHTS.CROSS_DOC_MINOR_ISSUES;
      breakdown.crossDoc = "MINOR_ISSUES";
    } else {
      score += WEIGHTS.CROSS_DOC_CONSISTENT;
      breakdown.crossDoc = "CONSISTENT";
    }
  }

  // ── SUPPORTING DOCUMENT ──
  if (geminiSupportingResult) {
    if (geminiSupportingResult.overall_suspicion_level === "HIGH") {
      score += WEIGHTS.SUPPORTING_DOC_SUSPICIOUS;
      flags.push(`Supporting document flagged as suspicious: ${geminiSupportingResult.summary}`);
    }
    if (geminiSupportingResult.authenticity_signals?.document_very_recently_issued) {
      score += WEIGHTS.DOC_VERY_RECENTLY_ISSUED;
      flags.push("Supporting document was issued very recently — possible document obtained solely for registration");
    }
  }

  // ── DATABASE LOOKUPS (Positive Signals) ──
  if (dohRegistryFound) {
    score += WEIGHTS.DOH_REGISTRY_MATCH;
    breakdown.dohRegistry = "FOUND";
  } else {
    // NOT FOUND in DOH registry is INCONCLUSIVE — not a negative signal
    // Many legitimate IDs are not in the registry due to LGU encoding delays
    breakdown.dohRegistry = "NOT_FOUND_INCONCLUSIVE";
  }

  if (prcLicenseValid) {
    score += WEIGHTS.PRC_LICENSE_VALID;
    breakdown.prcLicense = "VALID";
  }

  // ── BEHAVIORAL FLAGS ──
  if (behavioralFlags.length > 0) {
    score += behavioralFlags.length * WEIGHTS.BEHAVIORAL_FLAG_EACH;
    flags.push(...behavioralFlags);
    breakdown.behavioralFlags = behavioralFlags;
  }

  // ── CLAMP SCORE TO 0-100 ──
  score = Math.max(0, Math.min(100, Math.round(score)));

  // ── FINAL DECISION ──
  let decision;
  if (score >= THRESHOLDS.AUTO_APPROVE) {
    decision = "AUTO_APPROVE";
  } else if (score >= THRESHOLDS.HUMAN_REVIEW) {
    decision = "HUMAN_REVIEW";
  } else {
    decision = "REJECT";
  }

  return { score, decision, flags, breakdown };
}

/**
 * Detects behavioral fraud signals from submission metadata.
 * Call this before calculateRiskScore and pass results in behavioralFlags.
 *
 * @param {Object} metadata - Submission metadata
 * @returns {string[]} Array of behavioral flag descriptions
 */
export function detectBehavioralFlags({
  submissionDurationSeconds,    // How long the user took to upload all docs
  ipIsVpnOrProxy = false,        // Detected via IP lookup
  deviceFingerprintPreviouslyRejected = false,
  supportingDocMetadataEdited = false,  // EXIF/PDF metadata suggests editing
  accountAgeSeconds,             // How old the account is
}) {
  const flags = [];

  if (submissionDurationSeconds < 30) {
    flags.push("Documents submitted in under 30 seconds — suspiciously fast, possible automation");
  }

  if (ipIsVpnOrProxy) {
    flags.push("Submission made from a VPN or proxy IP — location concealment detected");
  }

  if (deviceFingerprintPreviouslyRejected) {
    flags.push("This device was previously used in a rejected verification attempt");
  }

  if (supportingDocMetadataEdited) {
    flags.push("Supporting document file metadata indicates recent editing in image software");
  }

  if (accountAgeSeconds !== undefined && accountAgeSeconds < 300) {
    flags.push("Account is less than 5 minutes old — verification submitted immediately after signup");
  }

  return flags;
}

/**
 * Returns a human-readable summary of the risk score for the admin review queue.
 */
export function formatRiskSummary({ score, decision, flags, breakdown }) {
  const decisionLabels = {
    AUTO_APPROVE: "✅ Auto-Approved",
    HUMAN_REVIEW: "⏳ Needs Human Review",
    REJECT: "❌ Rejected",
  };

  return {
    label: decisionLabels[decision],
    score,
    flagCount: flags.length,
    topFlags: flags.slice(0, 3),
    breakdown,
  };
}