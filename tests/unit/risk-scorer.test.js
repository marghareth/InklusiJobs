/**
 * tests/unit/risk-scorer.test.js
 * Run: npx jest tests/unit/risk-scorer.test.js --verbose
 *
 * Tests every scoring path with mock data:
 *   - Perfect submission → AUTO_APPROVE
 *   - Suspicious doc     → HUMAN_REVIEW
 *   - Hard fails         → REJECT
 *   - Duplicate ID       → immediate REJECT
 *   - Behavioral flags   → score deduction
 */

import { calculateRiskScore, detectBehavioralFlags } from "../../lib/risk-scorer.js";

// ─────────────────────────────────────────────
// Mock data factories
// ─────────────────────────────────────────────
const perfectGeminiResult = {
  overall_suspicion_level: "LOW",
  forgery_signal_count: 0,
  missing_fields: [],
  expiry_validation: { is_expired: false },
  lgu_validation: { lgu_name: "City of Pasig", designation_correct: true, flag: null },
  disability_validation: { is_valid_ncda_category: true, flag: null },
  summary: "All checks passed.",
};

const perfectSupportingDoc = {
  overall_suspicion_level: "LOW",
  authenticity_signals: { document_very_recently_issued: false, suspicious_editing_detected: false },
  summary: "Document appears authentic.",
};

const perfectCrossDoc = {
  overall_consistency: "CONSISTENT",
  name_match: { consistent: true, flag: null },
  disability_consistency: { consistent: true, flag: null },
  location_consistency: { consistent: true, flag: null },
  date_logic: { consistent: true, flag: null },
  summary: "All cross-document checks passed.",
};

const perfectFaceMatch = {
  match_confidence: 92,
  match_level: "HIGH",
  liveness: {
    appears_live: true,
    photo_of_photo_suspected: false,
    id_card_visible_in_selfie: true,
  },
  summary: "High confidence face match.",
};

const perfectPsgc   = { valid: true, normalized: "13-1360-004-0001234", flags: [] };
const perfectLgu    = { correct: true, flag: null };
const perfectDisab  = { valid: true, matched: "Visual Disability", flag: null };

// ─────────────────────────────────────────────
// AUTO_APPROVE path
// ─────────────────────────────────────────────
describe("AUTO_APPROVE", () => {
  test("perfect submission with DOH registry match scores ≥ 80", () => {
    const result = calculateRiskScore({
      geminiIdResult:        perfectGeminiResult,
      geminiSupportingResult: perfectSupportingDoc,
      crossDocResult:        perfectCrossDoc,
      faceMatchResult:       perfectFaceMatch,
      psgcValidation:        perfectPsgc,
      lguValidation:         perfectLgu,
      disabilityValidation:  perfectDisab,
      dohRegistryFound:      true,
      prcLicenseValid:       true,
      isDuplicate:           false,
      behavioralFlags:       [],
    });
    expect(result.decision).toBe("AUTO_APPROVE");
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.flags).toHaveLength(0);
  });

  test("perfect submission without DOH match still approves", () => {
    const result = calculateRiskScore({
      geminiIdResult: perfectGeminiResult,
      geminiSupportingResult: perfectSupportingDoc,
      crossDocResult: perfectCrossDoc,
      faceMatchResult: perfectFaceMatch,
      psgcValidation: perfectPsgc,
      lguValidation: perfectLgu,
      disabilityValidation: perfectDisab,
      dohRegistryFound: false,  // Not found is INCONCLUSIVE — should not block approval
      prcLicenseValid: false,
      isDuplicate: false,
      behavioralFlags: [],
    });
    expect(result.decision).toBe("AUTO_APPROVE");
  });
});

// ─────────────────────────────────────────────
// HUMAN_REVIEW path
// ─────────────────────────────────────────────
describe("HUMAN_REVIEW", () => {
  test("medium AI suspicion routes to human review", () => {
    const result = calculateRiskScore({
      geminiIdResult: { ...perfectGeminiResult, overall_suspicion_level: "MEDIUM", forgery_signal_count: 1 },
      geminiSupportingResult: perfectSupportingDoc,
      crossDocResult: perfectCrossDoc,
      faceMatchResult: perfectFaceMatch,
      psgcValidation: perfectPsgc,
      lguValidation: perfectLgu,
      disabilityValidation: perfectDisab,
      dohRegistryFound: false,
      prcLicenseValid: false,
      isDuplicate: false,
      behavioralFlags: [],
    });
    expect(result.decision).toBe("HUMAN_REVIEW");
    expect(result.score).toBeGreaterThanOrEqual(50);
    expect(result.score).toBeLessThan(80);
  });

  test("low face match confidence (70%) routes to review", () => {
    const result = calculateRiskScore({
      geminiIdResult: perfectGeminiResult,
      geminiSupportingResult: perfectSupportingDoc,
      crossDocResult: perfectCrossDoc,
      faceMatchResult: { ...perfectFaceMatch, match_confidence: 70, match_level: "LOW" },
      psgcValidation: perfectPsgc,
      lguValidation: perfectLgu,
      disabilityValidation: perfectDisab,
      dohRegistryFound: false,
      prcLicenseValid: false,
      isDuplicate: false,
      behavioralFlags: [],
    });
    expect(result.decision).toBe("HUMAN_REVIEW");
  });

  test("cross-doc minor issues routes to review", () => {
    const result = calculateRiskScore({
      geminiIdResult: perfectGeminiResult,
      geminiSupportingResult: perfectSupportingDoc,
      crossDocResult: { ...perfectCrossDoc, overall_consistency: "MINOR_ISSUES" },
      faceMatchResult: perfectFaceMatch,
      psgcValidation: perfectPsgc,
      lguValidation: perfectLgu,
      disabilityValidation: perfectDisab,
      dohRegistryFound: false,
      prcLicenseValid: false,
      isDuplicate: false,
      behavioralFlags: [],
    });
    expect(result.decision).toBe("HUMAN_REVIEW");
  });

  test("2 behavioral flags routes to review", () => {
    const result = calculateRiskScore({
      geminiIdResult: perfectGeminiResult,
      geminiSupportingResult: perfectSupportingDoc,
      crossDocResult: perfectCrossDoc,
      faceMatchResult: perfectFaceMatch,
      psgcValidation: perfectPsgc,
      lguValidation: perfectLgu,
      disabilityValidation: perfectDisab,
      dohRegistryFound: false,
      prcLicenseValid: false,
      isDuplicate: false,
      behavioralFlags: [
        "Documents submitted in under 30 seconds",
        "Submission made from a VPN or proxy IP",
      ],
    });
    expect(result.decision).toBe("HUMAN_REVIEW");
  });
});

// ─────────────────────────────────────────────
// REJECT path
// ─────────────────────────────────────────────
describe("REJECT", () => {
  test("duplicate ID is immediately rejected regardless of other signals", () => {
    const result = calculateRiskScore({
      geminiIdResult: perfectGeminiResult,
      geminiSupportingResult: perfectSupportingDoc,
      crossDocResult: perfectCrossDoc,
      faceMatchResult: perfectFaceMatch,
      psgcValidation: perfectPsgc,
      lguValidation: perfectLgu,
      disabilityValidation: perfectDisab,
      dohRegistryFound: true,
      prcLicenseValid: true,
      isDuplicate: true,  // ← hard reject
      behavioralFlags: [],
    });
    expect(result.decision).toBe("REJECT");
    expect(result.score).toBe(0);
    expect(result.flags[0]).toMatch(/duplicate/i);
  });

  test("liveness failure + high suspicion = REJECT", () => {
    const result = calculateRiskScore({
      geminiIdResult: { ...perfectGeminiResult, overall_suspicion_level: "HIGH", forgery_signal_count: 4 },
      geminiSupportingResult: perfectSupportingDoc,
      crossDocResult: perfectCrossDoc,
      faceMatchResult: {
        ...perfectFaceMatch,
        liveness: { appears_live: false, photo_of_photo_suspected: true, id_card_visible_in_selfie: false },
      },
      psgcValidation: perfectPsgc,
      lguValidation: perfectLgu,
      disabilityValidation: perfectDisab,
      dohRegistryFound: false,
      prcLicenseValid: false,
      isDuplicate: false,
      behavioralFlags: [],
    });
    expect(result.decision).toBe("REJECT");
    expect(result.score).toBeLessThan(50);
  });

  test("invalid PSGC + invalid disability + wrong LGU = REJECT", () => {
    const result = calculateRiskScore({
      geminiIdResult: { ...perfectGeminiResult, forgery_signal_count: 3 },
      geminiSupportingResult: perfectSupportingDoc,
      crossDocResult: { ...perfectCrossDoc, overall_consistency: "INCONSISTENT" },
      faceMatchResult: { ...perfectFaceMatch, match_confidence: 40, match_level: "LOW" },
      psgcValidation: { valid: false, flags: ["Region code 99 does not exist"], normalized: null },
      lguValidation: { correct: false, flag: "Pasig is a city, not a municipality" },
      disabilityValidation: { valid: false, flag: '"Diabetes" is a medical diagnosis not an NCDA category' },
      dohRegistryFound: false,
      prcLicenseValid: false,
      isDuplicate: false,
      behavioralFlags: [],
    });
    expect(result.decision).toBe("REJECT");
  });
});

// ─────────────────────────────────────────────
// Score is always 0–100
// ─────────────────────────────────────────────
describe("score boundaries", () => {
  test("score never exceeds 100", () => {
    const result = calculateRiskScore({
      geminiIdResult: perfectGeminiResult,
      geminiSupportingResult: perfectSupportingDoc,
      crossDocResult: perfectCrossDoc,
      faceMatchResult: { ...perfectFaceMatch, match_confidence: 99 },
      psgcValidation: perfectPsgc,
      lguValidation: perfectLgu,
      disabilityValidation: perfectDisab,
      dohRegistryFound: true,
      prcLicenseValid: true,
      isDuplicate: false,
      behavioralFlags: [],
    });
    expect(result.score).toBeLessThanOrEqual(100);
  });

  test("score never goes below 0", () => {
    const result = calculateRiskScore({
      geminiIdResult: { ...perfectGeminiResult, overall_suspicion_level: "HIGH", forgery_signal_count: 10, missing_fields: ["name", "id_number", "photo", "seal", "signature"] },
      geminiSupportingResult: { ...perfectSupportingDoc, overall_suspicion_level: "HIGH" },
      crossDocResult: { ...perfectCrossDoc, overall_consistency: "INCONSISTENT" },
      faceMatchResult: { ...perfectFaceMatch, match_confidence: 20, liveness: { appears_live: false, photo_of_photo_suspected: true, id_card_visible_in_selfie: false } },
      psgcValidation: { valid: false, flags: ["Invalid format"] },
      lguValidation: { correct: false, flag: "City labeled as municipality" },
      disabilityValidation: { valid: false, flag: "Medical diagnosis used" },
      dohRegistryFound: false,
      prcLicenseValid: false,
      isDuplicate: false,
      behavioralFlags: ["VPN detected", "Submitted in 10 seconds", "Device previously rejected"],
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
  });
});

// ─────────────────────────────────────────────
// detectBehavioralFlags
// ─────────────────────────────────────────────
describe("detectBehavioralFlags", () => {
  test("submission under 30 seconds is flagged", () => {
    const flags = detectBehavioralFlags({ submissionDurationSeconds: 15 });
    expect(flags.some(f => f.match(/30 seconds/i))).toBe(true);
  });

  test("VPN/proxy is flagged", () => {
    const flags = detectBehavioralFlags({ ipIsVpnOrProxy: true });
    expect(flags.some(f => f.match(/VPN/i))).toBe(true);
  });

  test("previously rejected device is flagged", () => {
    const flags = detectBehavioralFlags({ deviceFingerprintPreviouslyRejected: true });
    expect(flags.some(f => f.match(/rejected/i))).toBe(true);
  });

  test("account under 5 minutes old is flagged", () => {
    const flags = detectBehavioralFlags({ accountAgeSeconds: 200 });
    expect(flags.some(f => f.match(/5 minutes/i))).toBe(true);
  });

  test("edited document metadata is flagged", () => {
    const flags = detectBehavioralFlags({ supportingDocMetadataEdited: true });
    expect(flags.some(f => f.match(/editing/i))).toBe(true);
  });

  test("clean submission has no flags", () => {
    const flags = detectBehavioralFlags({
      submissionDurationSeconds: 120,
      ipIsVpnOrProxy: false,
      deviceFingerprintPreviouslyRejected: false,
      accountAgeSeconds: 86400,
      supportingDocMetadataEdited: false,
    });
    expect(flags).toHaveLength(0);
  });
});