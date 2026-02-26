/**
 * app/api/verification/check-doh-registry/route.js
 *
 * POST /api/verification/check-doh-registry
 *
 * Queries the DOH PRPWD registry at pwd.doh.gov.ph
 * to check if a PWD ID number has an existing record.
 *
 * IMPORTANT: A "not found" result is INCONCLUSIVE — not proof of fraud.
 * As of 2024, only ~1.8M of ~8M circulating IDs are in the registry.
 * Only a POSITIVE match should increase trust score.
 */

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { idNumber, verificationId } = await request.json();

    if (!idNumber) {
      return NextResponse.json({ error: "ID number is required" }, { status: 400 });
    }

    // Clean the ID number for the query
    const cleanId = idNumber.trim().replace(/\s+/g, "");

    let found = false;
    let registryData = null;
    let queryError = null;

    try {
      /**
       * DOH PRPWD Registry Query
       *
       * The public registry is at: pwd.doh.gov.ph/tbl_pwd_id_verificationlist.php
       * This performs a direct lookup by PWD ID number.
       *
       * NOTE FOR HACKATHON: The DOH portal may block automated requests.
       * For demo purposes, this simulates the lookup with a timeout.
       * For production: coordinate with DOH/NCDA for official API access,
       * or use a server-side browser automation approach (Puppeteer/Playwright).
       */

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const response = await fetch(
        `https://pwd.doh.gov.ph/tbl_pwd_id_verificationlist.php?search=${encodeURIComponent(cleanId)}`,
        {
          method: "GET",
          headers: {
            "User-Agent": "InklusiJobs PWD Verification System",
            "Accept": "text/html,application/xhtml+xml",
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (response.ok) {
        const html = await response.text();

        // Parse the response to determine if a match was found
        // The DOH portal returns a table — check for actual data rows vs empty state
        const hasResult =
          html.includes("Match Found") ||
          html.includes(cleanId) ||
          // Check for non-empty table rows (adjust based on actual DOH portal HTML)
          (html.includes("<td>") && !html.includes("No records found") && !html.includes("no record"));

        found = hasResult;

        if (found) {
          // Attempt to extract validity status from the response
          const isValid = html.includes("Valid") || html.includes("VALID");
          const isExpired = html.includes("Expired") || html.includes("EXPIRED");

          registryData = {
            found: true,
            status: isExpired ? "expired" : isValid ? "valid" : "found",
            source: "DOH PRPWD Registry",
            note: "Match confirmed in DOH PWD registry",
          };
        }
      }
    } catch (fetchError) {
      // Network error, timeout, or DOH portal is down
      // This is expected — treat as inconclusive
      queryError = fetchError.name === "AbortError"
        ? "DOH registry query timed out"
        : `DOH registry unreachable: ${fetchError.message}`;

      console.warn("[DOH Check] Registry query failed:", queryError);
    }

    return NextResponse.json({
      success: true,
      idNumber: cleanId,
      found,
      registryData,
      queryError,
      // Critical note for frontend to display
      interpretation: found
        ? "✅ ID number confirmed in DOH PWD registry — this increases verification confidence"
        : queryError
          ? "⚠️ DOH registry could not be reached — result is inconclusive"
          : "ℹ️ ID number not found in DOH registry — this is INCONCLUSIVE, not proof of fraud. Many legitimate IDs are not yet encoded in the registry.",
    });

  } catch (error) {
    console.error("[DOH Check] Error:", error);
    return NextResponse.json(
      { error: "DOH registry check failed", details: error.message },
      { status: 500 }
    );
  }
}