/**
 * app/api/verification/check-prc-license/route.js
 *
 * POST /api/verification/check-prc-license
 *
 * Verifies a physician's PRC license number against the PRC public registry.
 * This is a critical layer for catching the "corrupt doctor" fraud vector —
 * where fraudsters obtain a medical certificate from a doctor willing to
 * certify a non-PWD, or forge a certificate with a fabricated PRC number.
 *
 * PRC public verification: verification.prc.gov.ph
 */

import { NextResponse } from "next/server";

// Medical specialties that are consistent with each NCDA disability category
// Used to flag specialty-disability mismatches (e.g., cardiologist signing a psychosocial cert)
const VALID_SPECIALTIES_BY_CATEGORY = {
  "Psychosocial Disability": [
    "psychiatry", "psychology", "mental health", "neuropsychiatry",
    "clinical psychology", "behavioral health",
  ],
  "Chronic Illness": [
    "internal medicine", "general practice", "family medicine",
    "nephrology", "endocrinology", "cardiology", "pulmonology",
    "rheumatology", "gastroenterology", "hematology",
  ],
  "Learning Disability": [
    "developmental pediatrics", "pediatrics", "neurology",
    "child psychiatry", "clinical psychology",
  ],
  "Mental Disability": [
    "psychiatry", "neurology", "developmental pediatrics",
    "mental health", "neuropsychiatry",
  ],
  "Visual Disability": [
    "ophthalmology", "optometry", "eye", "visual",
  ],
  "Orthopedic/Physical Disability": [
    "orthopedics", "orthopedic surgery", "rehabilitation medicine",
    "physiatry", "physical medicine", "neurosurgery", "neurology",
    "rheumatology",
  ],
  "Speech and Language Impairment": [
    "otolaryngology", "ent", "ear nose throat", "speech pathology",
    "neurology", "developmental pediatrics",
  ],
  "Deaf or Hard of Hearing": [
    "otolaryngology", "ent", "ear nose throat", "audiology",
    "otology",
  ],
  "Cancer and Rare Diseases": [
    "oncology", "hematology", "internal medicine", "general surgery",
    "radiation oncology", "medical oncology",
  ],
};

export async function POST(request) {
  try {
    const { prcLicenseNumber, physicianName, physicianSpecialty, disabilityCategory } =
      await request.json();

    if (!prcLicenseNumber) {
      return NextResponse.json({ error: "PRC license number is required" }, { status: 400 });
    }

    // Clean and normalize license number
    const cleanLicense = prcLicenseNumber.trim().replace(/\s+/g, "").replace(/[^0-9]/g, "");

    // Basic format check — Philippine PRC license numbers are 7 digits
    if (cleanLicense.length < 5 || cleanLicense.length > 8) {
      return NextResponse.json({
        success: true,
        valid: false,
        flag: `PRC license number "${prcLicenseNumber}" has an invalid format — Philippine PRC numbers are 7 digits`,
        licenseNumber: cleanLicense,
      });
    }

    let licenseValid = false;
    let registryData = null;
    let queryError = null;
    let specialtyFlag = null;

    try {
      /**
       * PRC Registry Query
       * Public verification portal: verification.prc.gov.ph
       *
       * NOTE FOR HACKATHON: The PRC portal may require form submission or
       * have bot protection. For demo, this simulates the check.
       * For production: Use PRC's official API if available, or coordinate
       * directly with PRC for B2B API access under your VaaS product.
       */

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(
        `https://verification.prc.gov.ph/portal/Verification.aspx`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "InklusiJobs Verification System",
          },
          body: new URLSearchParams({
            "ctl00$MainContent$txtRegistrationNo": cleanLicense,
          }).toString(),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (response.ok) {
        const html = await response.text();

        // Check if the registry returned a valid professional record
        const hasRecord =
          html.includes("Registration No.") ||
          html.includes(cleanLicense) ||
          html.includes("Status: Active") ||
          html.includes("ACTIVE");

        const isRevoked =
          html.includes("REVOKED") ||
          html.includes("SUSPENDED") ||
          html.includes("CANCELLED");

        licenseValid = hasRecord && !isRevoked;

        if (hasRecord) {
          // Attempt to extract the registered name and profession
          const nameMatch = html.match(/Registered Name[:\s]+([A-Z\s,\.]+)/i);
          const professionMatch = html.match(/Profession[:\s]+([A-Z\s]+)/i);

          registryData = {
            found: true,
            status: isRevoked ? "revoked" : "active",
            registeredName: nameMatch?.[1]?.trim() || null,
            profession: professionMatch?.[1]?.trim() || null,
            source: "PRC Professional Regulation Commission",
          };

          // Name mismatch check (if we have the physician name from the document)
          if (physicianName && registryData.registeredName) {
            const docName = physicianName.toLowerCase().replace(/[^a-z\s]/g, "");
            const regName = registryData.registeredName.toLowerCase().replace(/[^a-z\s]/g, "");
            const nameWordsMatch = docName.split(" ").some(word =>
              word.length > 2 && regName.includes(word)
            );
            if (!nameWordsMatch) {
              registryData.nameFlag = `Name on document "${physicianName}" does not match PRC registered name "${registryData.registeredName}"`;
            }
          }
        }
      }
    } catch (fetchError) {
      queryError = fetchError.name === "AbortError"
        ? "PRC registry query timed out"
        : `PRC registry unreachable: ${fetchError.message}`;
      console.warn("[PRC Check] Registry query failed:", queryError);
    }

    // ── Specialty-Disability Consistency Check ──
    // Even if the license is valid, flag if the specialty is inconsistent
    // with the disability being certified (e.g., cardiologist certifying psychosocial disability)
    if (physicianSpecialty && disabilityCategory) {
      const validSpecialties = VALID_SPECIALTIES_BY_CATEGORY[disabilityCategory] || [];
      const specialtyLower = physicianSpecialty.toLowerCase();
      const specialtyConsistent = validSpecialties.some(s => specialtyLower.includes(s));

      if (!specialtyConsistent && validSpecialties.length > 0) {
        specialtyFlag = `Specialty "${physicianSpecialty}" may not be appropriate for certifying "${disabilityCategory}". Expected specialties include: ${validSpecialties.slice(0, 3).join(", ")}`;
      }
    }

    return NextResponse.json({
      success: true,
      licenseNumber: cleanLicense,
      valid: licenseValid,
      registryData,
      queryError,
      specialtyFlag,
      flags: [
        registryData?.nameFlag,
        specialtyFlag,
        queryError ? `PRC check inconclusive: ${queryError}` : null,
      ].filter(Boolean),
      interpretation: licenseValid
        ? "✅ PRC license confirmed active — physician is a registered professional"
        : queryError
          ? "⚠️ PRC registry could not be reached — result is inconclusive"
          : "❌ PRC license not found or revoked — supporting document may be fraudulent",
    });

  } catch (error) {
    console.error("[PRC Check] Error:", error);
    return NextResponse.json(
      { error: "PRC license check failed", details: error.message },
      { status: 500 }
    );
  }
}