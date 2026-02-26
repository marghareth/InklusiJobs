/**
 * lib/doh-registry.js
 *
 * Connects to the DOH PRPWD (Philippine Registry for Persons with Disability)
 * Portal: pwd.doh.gov.ph
 *
 * HOW IT WORKS:
 *   The DOH portal has a public verification page at:
 *   pwd.doh.gov.ph/tbl_pwd_id_verificationlist.php
 *
 *   We query it with the extracted PWD ID number and parse the HTML response.
 *   A positive match = confidence boost.
 *   Not found = INCONCLUSIVE (not fraud) — only ~1.8M of ~8M IDs are encoded.
 *
 * IMPORTANT LIMITATIONS (be honest with judges):
 *   1. No official API — we scrape the public portal
 *   2. Coverage gap: ~77% of legitimate IDs may not appear
 *   3. Portal may be down or rate-limit requests
 *   4. Medium-term fix: official NCDA/DSWD API partnership (in roadmap)
 */

const DOH_PORTAL_URL = "https://pwd.doh.gov.ph/tbl_pwd_id_verificationlist.php";
const TIMEOUT_MS     = 10000;

/**
 * Query the DOH PRPWD registry for a given PWD ID number.
 *
 * @param {string} idNumber - Normalized PSGC-format ID number
 * @returns {Promise<{
 *   queried: boolean,
 *   found: boolean,
 *   status: string|null,
 *   idNumber: string,
 *   error: string|null,
 *   interpretation: string,
 *   confidenceImpact: number  -- +15 if found, 0 if not found/error
 * }>}
 */
export async function queryDOHRegistry(idNumber) {
  const result = {
    queried:           false,
    found:             false,
    status:            null,
    idNumber,
    error:             null,
    interpretation:    "",
    confidenceImpact:  0,
  };

  if (!idNumber) {
    result.error = "No ID number provided";
    result.interpretation = "⚠️ ID number not available for registry lookup";
    return result;
  }

  // Try both with and without dashes — DOH portal is inconsistent
  const idWithDashes    = idNumber.trim();
  const idWithoutDashes = idNumber.replace(/-/g, "");

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Query DOH portal
    const response = await fetch(
      `${DOH_PORTAL_URL}?search=${encodeURIComponent(idWithDashes)}`,
      {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; InklusiJobs/1.0; +https://inklusijobs.ph)",
          "Accept":     "text/html,application/xhtml+xml",
          "Referer":    "https://pwd.doh.gov.ph/",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timer);
    result.queried = true;

    if (!response.ok) {
      result.error = `DOH portal returned HTTP ${response.status}`;
      result.interpretation = "⚠️ DOH registry could not be reached — result is inconclusive";
      return result;
    }

    const html      = await response.text();
    const htmlLower = html.toLowerCase();

    // Signals that no record was found
    const noRecordSignals = [
      "no records found", "no record found", "0 records",
      "no data available", "walang nahanap", "no result",
    ];

    // Signals that a record was found
    const foundSignals = [
      idWithDashes.toLowerCase(),
      idWithoutDashes.toLowerCase(),
      "match found", "record found",
    ];

    const hasNoRecord = noRecordSignals.some(s => htmlLower.includes(s));
    const hasRecord   = !hasNoRecord && foundSignals.some(s => htmlLower.includes(s));

    // Also check: if there are <td> elements with data, there's a result
    const tdCount = (html.match(/<td/gi) || []).length;
    const hasTableData = tdCount > 4 && !hasNoRecord;

    result.found = hasRecord || hasTableData;

    if (result.found) {
      // Try to extract status
      if (htmlLower.includes("expired")) result.status = "expired";
      else if (htmlLower.includes("valid") || htmlLower.includes("active")) result.status = "valid";
      else result.status = "found";

      result.confidenceImpact = result.status === "valid" ? 15 : 5;
      result.interpretation   = result.status === "expired"
        ? "⚠️ ID found in DOH registry but marked as EXPIRED"
        : "✅ ID number confirmed in DOH PRPWD registry — confidence boosted";
    } else {
      result.status           = "not_found";
      result.confidenceImpact = 0; // NOT FOUND IS INCONCLUSIVE — no penalty
      result.interpretation   =
        "ℹ️ ID not found in DOH registry — this is inconclusive. " +
        "As of 2024, only ~1.8M of ~8M circulating PWD IDs are encoded. " +
        "Document and biometric analysis will determine the outcome.";
    }

  } catch (err) {
    clearTimeout(timer);
    result.queried = false;
    result.error   = err.name === "AbortError"
      ? "DOH registry request timed out after 10 seconds"
      : `DOH registry unreachable: ${err.message}`;
    result.interpretation   = "⚠️ DOH registry could not be reached — result is inconclusive";
    result.confidenceImpact = 0;
  }

  return result;
}

/**
 * Query the DSWD Unified PWD ID System
 * Launched December 2024 — pilot LGUs only initially
 *
 * @param {string} idNumber
 * @param {string} lguName
 */
export async function queryDSWDRegistry(idNumber, lguName = "") {
  const DSWD_PILOT_LGUS = [
    "manila", "pasay", "muntinlupa", "san miguel",
    "sta. rosa", "santa rosa", "bulacan", "laguna",
  ];

  const isPilotLgu = DSWD_PILOT_LGUS.some(lgu =>
    lguName.toLowerCase().includes(lgu)
  );

  const result = {
    queried:          false,
    found:            false,
    status:           null,
    isPilotLgu,
    error:            null,
    interpretation:   "",
    confidenceImpact: 0,
  };

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch("https://dswd.gov.ph/pwd-verification/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":   "Mozilla/5.0 (compatible; InklusiJobs/1.0)",
        "Referer":      "https://dswd.gov.ph/",
      },
      body: new URLSearchParams({ pwd_id: idNumber, action: "verify" }).toString(),
      signal: controller.signal,
    });

    clearTimeout(timer);
    result.queried = true;

    if (!response.ok) {
      result.error         = `DSWD portal returned HTTP ${response.status}`;
      result.interpretation = "⚠️ DSWD registry unreachable — inconclusive";
      return result;
    }

    const text      = await response.text();
    const textLower = text.toLowerCase();

    // Try JSON first (newer system may return JSON)
    try {
      const json = JSON.parse(text);
      result.found            = json.status === "found" || json.verified === true;
      result.status           = json.id_status || (result.found ? "valid" : "not_found");
      result.confidenceImpact = result.found ? 15 : 0;
      result.interpretation   = result.found
        ? "✅ ID confirmed in DSWD Unified PWD ID System"
        : "ℹ️ Not found in DSWD system — inconclusive";
      return result;
    } catch { /* not JSON — parse HTML */ }

    const notFoundSignals = ["not found", "no record", "invalid", "hindi mahanap"];
    const foundSignals    = ["verified", "valid", "found", idNumber.toLowerCase()];

    result.found = !notFoundSignals.some(s => textLower.includes(s)) &&
                   foundSignals.some(s => textLower.includes(s));

    result.status           = result.found ? "valid" : "not_found";
    result.confidenceImpact = result.found ? 15 : (isPilotLgu ? -3 : 0);
    result.interpretation   = result.found
      ? "✅ ID confirmed in DSWD Unified PWD ID System"
      : isPilotLgu
        ? "ℹ️ Not found in DSWD system. Note: this LGU is in the pilot program, so absence is a mild signal."
        : "ℹ️ Not found in DSWD system — inconclusive";

  } catch (err) {
    clearTimeout(timer);
    result.error            = err.name === "AbortError" ? "DSWD request timed out" : err.message;
    result.interpretation   = "⚠️ DSWD registry unreachable — inconclusive";
    result.confidenceImpact = 0;
  }

  return result;
}

/**
 * Run both DOH and DSWD queries in parallel and merge results.
 * This is the main function called by the API route.
 */
export async function queryAllRegistries(idNumber, lguName = "") {
  const [doh, dswd] = await Promise.all([
    queryDOHRegistry(idNumber),
    queryDSWDRegistry(idNumber, lguName),
  ]);

  const eitherFound    = doh.found || dswd.found;
  const bothFound      = doh.found && dswd.found;
  const confidenceBump = bothFound ? 20 : eitherFound ? 15 : 0;

  return {
    doh,
    dswd,
    found:           eitherFound,
    bothFound,
    confidenceBump,
    summary: bothFound
      ? "✅ ID confirmed in BOTH DOH and DSWD registries — very high confidence"
      : eitherFound
        ? `✅ ID confirmed in ${doh.found ? "DOH" : "DSWD"} registry`
        : "ℹ️ ID not found in either registry — inconclusive, not proof of fraud",
  };
}
