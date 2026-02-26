/**
 * lib/psgc-lookup.js
 * Philippine Standard Geographic Code (PSGC) validation
 * Source: PSA psa.gov.ph/classification/psgc
 *
 * Validates the geographic portion of PWD ID numbers.
 * Standard format: RR-PPPP-BBB-NNNNNNN
 * LGU variant:     RR-PPPP-BBB-NNNNN  (5-digit sequential — must be tolerated)
 */

export const REGION_CODES = {
  "01": "Ilocos Region",
  "02": "Cagayan Valley",
  "03": "Central Luzon",
  "04": "CALABARZON",
  "05": "Bicol Region",
  "06": "Western Visayas",
  "07": "Central Visayas",
  "08": "Eastern Visayas",
  "09": "Zamboanga Peninsula",
  "10": "Northern Mindanao",
  "11": "Davao Region",
  "12": "SOCCSKSARGEN",
  "13": "NCR",
  "14": "CAR",
  "15": "BARMM",
  "16": "Caraga",
  "17": "MIMAROPA",
};

// Known Philippine cities — must NOT appear as "Municipality of ___"
// Mislabeling a city as a municipality is a documented Recto forger mistake
export const KNOWN_CITIES = [
  "Manila", "Quezon City", "Caloocan", "Las Piñas", "Makati",
  "Malabon", "Mandaluyong", "Marikina", "Muntinlupa", "Navotas",
  "Parañaque", "Pasay", "Pasig", "San Juan", "Taguig", "Valenzuela",
  "Antipolo", "Bacoor", "Dasmariñas", "Imus", "General Trias",
  "Cavite City", "Tagaytay", "Trece Martires", "Calamba", "San Pablo",
  "Santa Rosa", "Biñan", "Batangas City", "Lipa", "Tanauan", "Lucena",
  "Cabanatuan", "Gapan", "Muñoz", "Palayan", "San Jose del Monte",
  "Malolos", "Meycauayan", "Angeles", "San Fernando", "Olongapo",
  "Baguio", "Dagupan", "San Carlos", "Urdaneta", "Laoag", "Vigan",
  "Tuguegarao", "Iligan", "Cagayan de Oro", "Butuan", "Davao City",
  "Digos", "Mati", "Panabo", "Tagum", "Koronadal", "Cotabato City",
  "Kidapawan", "Tacurong", "General Santos", "Zamboanga City",
  "Dapitan", "Dipolog", "Pagadian", "Cebu City", "Danao",
  "Lapu-Lapu", "Mandaue", "Naga", "Toledo", "Bacolod", "Bago",
  "Cadiz", "Himamaylan", "Kabankalan", "La Carlota", "Sagay",
  "Silay", "Sipalay", "Talisay", "Victorias", "Iloilo City", "Passi",
  "Puerto Princesa", "Tacloban", "Baybay", "Ormoc", "Calbayog",
  "Catbalogan", "Maasin", "Borongan", "Surigao City", "Bislig",
  "Bayugan", "Tandag", "Marawi City",
];

// The 9 official NCDA disability categories — the ONLY valid values
// for the disability type field on a Philippine PWD ID
export const NCDA_DISABILITY_CATEGORIES = [
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

// Raw medical diagnoses that fraudsters commonly write in the disability field
// These are medical conditions, NOT NCDA disability categories
export const INVALID_MEDICAL_DIAGNOSES = [
  "diabetes", "hypertension", "asthma", "arthritis", "tuberculosis",
  "tb", "hepatitis", "kidney disease", "heart disease", "stroke",
  "epilepsy", "migraine", "scoliosis", "osteoporosis", "lupus",
  "rheumatoid", "parkinsons", "alzheimer", "dementia", "obesity",
  "gout", "pneumonia", "anemia", "thyroid", "glaucoma",
];

/**
 * Validates a PWD ID number against PSGC format rules.
 * Tolerates 5-digit vs 7-digit sequential number LGU variation.
 */
export function validatePWDIdFormat(idNumber) {
  const flags = [];

  if (!idNumber || typeof idNumber !== "string") {
    return { valid: false, regionCode: null, regionName: null, flags: ["ID number is missing or unreadable"] };
  }

  const normalized = idNumber.trim().replace(/\s+/g, "").replace(/[–—]/g, "-");
  const pattern = /^(\d{2})-(\d{4})-(\d{3})-(\d{5,7})$/;
  const match = normalized.match(pattern);

  if (!match) {
    flags.push(`ID number "${normalized}" does not match PSGC format (RR-PPPP-BBB-NNNNNNN)`);
    return { valid: false, regionCode: null, regionName: null, flags };
  }

  const [, regionCode, provinceCode, barangayCode, sequential] = match;

  if (!REGION_CODES[regionCode]) {
    flags.push(`Region code "${regionCode}" does not correspond to any Philippine region`);
    return { valid: false, regionCode, regionName: null, flags };
  }

  if (/^0+$/.test(sequential)) {
    flags.push("Sequential number is all zeros — possible test or fraudulent entry");
  }

  return {
    valid: flags.length === 0,
    regionCode,
    regionName: REGION_CODES[regionCode],
    provinceCode,
    barangayCode,
    sequential,
    normalized,
    flags,
  };
}

/**
 * Checks if an LGU name uses the correct City vs Municipality designation.
 * A known city labeled "Municipality of ___" is a documented Recto forger mistake.
 */
export function validateLGUDesignation(lguName) {
  if (!lguName) return { correct: false, flag: "LGU name is missing from ID" };

  const lower = lguName.toLowerCase();
  const isMunicipalityLabel =
    lower.includes("municipality of") ||
    lower.startsWith("mun. of") ||
    lower.startsWith("munisipyo ng");

  for (const city of KNOWN_CITIES) {
    if (lower.includes(city.toLowerCase())) {
      if (isMunicipalityLabel) {
        return {
          correct: false,
          flag: `"${city}" is a City — labeling it as a Municipality is a known fraud signal`,
        };
      }
      return { correct: true, flag: null };
    }
  }

  // LGU not in known cities list — not necessarily wrong, just unverifiable locally
  return { correct: true, flag: null };
}

/**
 * Validates the disability category field against the official NCDA list.
 * Flags raw medical diagnoses that forgers commonly write instead.
 */
export function validateDisabilityCategory(disabilityField) {
  if (!disabilityField) {
    return { valid: false, matched: null, flag: "Disability category field is empty" };
  }

  const lower = disabilityField.toLowerCase().trim();

  for (const category of NCDA_DISABILITY_CATEGORIES) {
    if (lower === category.toLowerCase() || lower.includes(category.toLowerCase())) {
      return { valid: true, matched: category, flag: null };
    }
  }

  for (const diagnosis of INVALID_MEDICAL_DIAGNOSES) {
    if (lower.includes(diagnosis)) {
      return {
        valid: false,
        matched: null,
        flag: `"${disabilityField}" is a medical diagnosis, not an NCDA disability category`,
      };
    }
  }

  return {
    valid: false,
    matched: null,
    flag: `"${disabilityField}" is not one of the 9 official NCDA disability categories`,
  };
}