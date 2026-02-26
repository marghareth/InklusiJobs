/**
 * tests/unit/psgc-lookup.test.js
 * Run: npx jest tests/unit/psgc-lookup.test.js --verbose
 */

import {
  validatePWDIdFormat,
  validateLGUDesignation,
  validateDisabilityCategory,
  NCDA_DISABILITY_CATEGORIES,
  REGION_CODES,
} from "../../lib/psgc-lookup.js";

describe("validatePWDIdFormat", () => {
  describe("✅ valid formats", () => {
    test("standard 7-digit NCR/Pasig ID", () => {
      const r = validatePWDIdFormat("13-1360-004-0001234");
      expect(r.valid).toBe(true);
      expect(r.regionCode).toBe("13");
      expect(r.regionName).toBe("NCR");
      expect(r.flags).toHaveLength(0);
    });
    test("5-digit sequential — LGU variant must be ACCEPTED", () => {
      const r = validatePWDIdFormat("03-5402-013-00123");
      expect(r.valid).toBe(true);
    });
    test("Davao Region (11)", () => {
      const r = validatePWDIdFormat("11-1120-001-0000456");
      expect(r.valid).toBe(true);
      expect(r.regionName).toBe("Davao Region");
    });
    test("BARMM (15)", () => {
      expect(validatePWDIdFormat("15-1504-001-0000001").valid).toBe(true);
    });
    test("strips whitespace from OCR", () => {
      expect(validatePWDIdFormat("  13-1360-004-0001234  ").valid).toBe(true);
    });
    test("handles em-dash separators from OCR", () => {
      expect(validatePWDIdFormat("13–1360–004–0001234").valid).toBe(true);
    });
  });

  describe("❌ invalid formats", () => {
    test("region code 00 does not exist", () => {
      const r = validatePWDIdFormat("00-1360-004-0001234");
      expect(r.valid).toBe(false);
      expect(r.flags[0]).toMatch(/region code/i);
    });
    test("region code 99 does not exist", () => {
      expect(validatePWDIdFormat("99-0000-000-0000001").valid).toBe(false);
    });
    test("no dashes — completely wrong format", () => {
      expect(validatePWDIdFormat("1313600040001234").valid).toBe(false);
    });
    test("only 2 segments", () => {
      expect(validatePWDIdFormat("13-1360").valid).toBe(false);
    });
    test("null returns invalid gracefully", () => {
      const r = validatePWDIdFormat(null);
      expect(r.valid).toBe(false);
      expect(r.flags).toHaveLength(1);
    });
    test("empty string", () => {
      expect(validatePWDIdFormat("").valid).toBe(false);
    });
  });

  describe("⚠️ suspicious but valid", () => {
    test("all-zero sequential is flagged", () => {
      const r = validatePWDIdFormat("13-1360-004-0000000");
      expect(r.flags.some(f => f.match(/zero/i))).toBe(true);
    });
  });
});

describe("validateLGUDesignation", () => {
  describe("🚩 fraud signals — cities labeled as municipalities", () => {
    const fraudCases = [
      "Municipality of Pasig",
      "Municipality of Makati",
      "Municipality of Taguig",
      "Municipality of Quezon City",
      "Municipality of Manila",
      "Municipality of Muntinlupa",
      "Mun. of Pasig",
    ];
    test.each(fraudCases)('FRAUD: "%s"', (lgu) => {
      const r = validateLGUDesignation(lgu);
      expect(r.correct).toBe(false);
      expect(r.flag).toBeTruthy();
    });
  });

  describe("✅ valid city designations", () => {
    test("City of Pasig", ()   => expect(validateLGUDesignation("City of Pasig").correct).toBe(true));
    test("Quezon City", ()     => expect(validateLGUDesignation("Quezon City").correct).toBe(true));
    test("Makati City", ()     => expect(validateLGUDesignation("Makati City").correct).toBe(true));
    test("City Gov of Taguig", () => expect(validateLGUDesignation("City Government of Taguig").correct).toBe(true));
  });

  describe("✅ real municipalities — must NOT be flagged", () => {
    test("Municipality of Apalit (IS a municipality)", () => {
      expect(validateLGUDesignation("Municipality of Apalit").correct).toBe(true);
    });
    test("Municipality of Minalin", () => {
      expect(validateLGUDesignation("Municipality of Minalin").correct).toBe(true);
    });
  });

  describe("edge cases", () => {
    test("null returns a flag", () => {
      const r = validateLGUDesignation(null);
      expect(r.correct).toBe(false);
      expect(r.flag).toMatch(/missing/i);
    });
    test("unknown LGU passes — cannot disprove", () => {
      expect(validateLGUDesignation("Municipality of Unknownville").correct).toBe(true);
    });
  });
});

describe("validateDisabilityCategory", () => {
  describe("✅ all 9 valid NCDA categories", () => {
    test.each(NCDA_DISABILITY_CATEGORIES)("valid: %s", (cat) => {
      const r = validateDisabilityCategory(cat);
      expect(r.valid).toBe(true);
      expect(r.matched).toBe(cat);
      expect(r.flag).toBeNull();
    });
  });

  describe("✅ case and format tolerance", () => {
    test("lowercase", ()       => expect(validateDisabilityCategory("visual disability").valid).toBe(true));
    test("ALL CAPS", ()        => expect(validateDisabilityCategory("DEAF OR HARD OF HEARING").valid).toBe(true));
    test("with extra text", () => expect(validateDisabilityCategory("Orthopedic/Physical Disability (Left Arm)").valid).toBe(true));
  });

  describe("🚩 forger mistakes — raw medical diagnoses", () => {
    const diagnoses = [
      "Diabetes", "Hypertension", "Asthma",
      "Diabetes and Hypertension", "Pulmonary TB",
      "Chronic Kidney Disease Stage 3", "Rheumatoid Arthritis", "Epilepsy",
    ];
    test.each(diagnoses)('FRAUD: "%s" is a diagnosis not a category', (diag) => {
      const r = validateDisabilityCategory(diag);
      expect(r.valid).toBe(false);
      expect(r.flag).toMatch(/medical diagnosis/i);
    });
  });

  describe("❌ unrecognized values", () => {
    test("random text",  () => expect(validateDisabilityCategory("Locomotor").valid).toBe(false));
    test("empty string", () => expect(validateDisabilityCategory("").valid).toBe(false));
    test("null",         () => expect(validateDisabilityCategory(null).valid).toBe(false));
  });
});

describe("constant data integrity", () => {
  test("exactly 17 region codes", () => expect(Object.keys(REGION_CODES)).toHaveLength(17));
  test("exactly 9 NCDA categories", () => expect(NCDA_DISABILITY_CATEGORIES).toHaveLength(9));
  test("no duplicate region codes", () => {
    const codes = Object.keys(REGION_CODES);
    expect(new Set(codes).size).toBe(codes.length);
  });
  test("no duplicate NCDA categories", () => {
    expect(new Set(NCDA_DISABILITY_CATEGORIES).size).toBe(NCDA_DISABILITY_CATEGORIES.length);
  });
});