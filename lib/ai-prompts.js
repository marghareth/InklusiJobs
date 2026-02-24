// lib/ai-prompts.js
// AI Prompt Templates for InklusiJobs
// Aligned to research-based 15-question assessment structure
// AI signal mapping follows Section 9.2 of the research report

// ─── MAP RAW ANSWERS TO AI PAYLOAD ───────────────────────────────────────────
// Translates raw answer values into structured, labeled data for AI prompts

export function mapAnswersToAIPayload(answers) {
  // Q3 → support intensity
  const supportMap = {
    gives_up:    "high",      // needs more scaffolding and encouragement
    seeks_help:  "moderate",  // needs guided resources
    tries_again: "low",       // self-directed learner
    researches:  "minimal",   // highly independent
  };

  // Q7 → hours per week (numeric)
  const hoursMap = { 8: 8, 15: 15, 25: 25, 35: 35, 0: 10 }; // 0 = flexible → default 10

  // Q8 → urgency level
  const urgencyMap = {
    employment:  "immediate",
    freelance:   "short_term",
    career_up:   "medium_term",
    upskilling:  "medium_term",
    exploratory: "long_term",
  };

  return {
    // Section A — Skills
    digitalLiteracyLevel:   answers[1]  || "everyday_tools",
    priorExperience:        answers[2]  || [],
    problemSolvingStyle:    answers[3]  || "seeks_help",
    confidenceAreas:        answers[4]  || [],
    aspirationalSkill:      answers[5]  || "",
    supportIntensity:       supportMap[answers[3]] || "moderate",

    // Section B — Goals
    workPreference:         answers[6]  || "any",
    availableHoursPerWeek:  hoursMap[answers[7]] || 15,
    careerMode:             answers[8]  || "exploratory",
    preferredLearningStyle: answers[9]  || [],
    productivityWindow:     answers[10] || "varies",
    urgencyLevel:           urgencyMap[answers[8]] || "medium_term",

    // Section C — Needs
    disabilityAccommodations: answers[11] || [],
    accommodationRequest:   answers[12] || "",
    pwdDocumentationStatus: answers[13] || "prefer_not",
    acquisitionChannel:     answers[14] || "",
    additionalContext:      answers[15] || "",
  };
}

// ─── SKILL GAP ANALYSIS PROMPT ────────────────────────────────────────────────
// Called FIRST. Identifies what the user needs to learn.
// Primary inputs: Q1, Q2, Q4 (Section A signals)
// Additional context: Q5, Q15

export function buildSkillGapPrompt(payload) {
  const {
    digitalLiteracyLevel,
    priorExperience,
    confidenceAreas,
    aspirationalSkill,
    supportIntensity,
    disabilityAccommodations,
    additionalContext,
    careerMode,
  } = payload;

  const experienceList = Array.isArray(priorExperience) && priorExperience.length > 0
    ? priorExperience.filter(e => e !== "none").join(", ") || "none listed"
    : "none listed";

  const strengthsList = Array.isArray(confidenceAreas) && confidenceAreas.length > 0
    ? confidenceAreas.join(", ")
    : "not specified";

  const accessibilityNote = Array.isArray(disabilityAccommodations) && disabilityAccommodations.length > 0
    ? `\nACCESSIBILITY: Only recommend resources accessible for: ${disabilityAccommodations.join(", ")}. Avoid resources with known barriers.`
    : "";

  const aspirationNote = aspirationalSkill
    ? `\nUSER ASPIRATION: "${aspirationalSkill}" — incorporate into recommendations where relevant.`
    : "";

  const contextNote = additionalContext
    ? `\nADDITIONAL USER CONTEXT: "${additionalContext}" — use this to personalize analysis.`
    : "";

  const supportNote = supportIntensity === "high"
    ? "\nSUPPORT NOTE: This user may need extra encouragement. Use warm, motivational language. Emphasize that small steps count."
    : supportIntensity === "minimal"
    ? "\nSUPPORT NOTE: This user is highly self-directed. Be concise and direct. Skip excessive encouragement."
    : "";

  return `You are an inclusive career coach for InklusiJobs — a job platform for persons with disabilities (PWDs) in the Philippines.

Your role is to analyze this user's profile and identify their skill gaps using Competency-Based Assessment (CBA) principles aligned with TESDA qualifications.

USER PROFILE:
- Digital literacy level: ${digitalLiteracyLevel}
- Prior experience areas: ${experienceList}
- Self-reported confidence areas: ${strengthsList}
- Career goal: ${careerMode}
- Support intensity needed: ${supportIntensity}${aspirationNote}${accessibilityNote}${contextNote}${supportNote}

ANALYSIS INSTRUCTIONS:
1. Based on their confidence areas and prior experience, determine their most likely career track (design, writing, data_admin, technology, digital_marketing, or customer_service)
2. Identify 3–5 critical skill gaps they need to fill to become employable in that track
3. Identify 2–3 current strengths from their prior experience and confidence areas
4. Suggest 2–3 quick wins — skills they can likely acquire within 1–2 weeks
5. Use the TESDA competency framework as your benchmark where applicable
6. Be warm, specific, and encouraging. Never make the user feel behind or inadequate.
7. Do NOT assume formal education or prior work experience unless explicitly indicated

CRITICAL ANTI-BIAS RULES:
- Do not use disability category as a proxy for skill expectation
- Focus on what the user CAN produce, not speed or format of delivery
- Treat all confidence levels as valid starting points
- If experience is "none", start from foundational competencies — never frame as deficit

Respond ONLY in this exact JSON format:
{
  "analysis": {
    "recommendedCareerTrack": "one of: design | writing | data_admin | technology | digital_marketing | customer_service | general",
    "careerTrackReason": "1-2 sentence explanation of why this track fits this user",
    "criticalGaps": [
      { "skill": "skill name", "reason": "why this matters for the role", "priority": "high|medium|low", "tesda_reference": "relevant TESDA unit if applicable" }
    ],
    "currentStrengths": [
      { "skill": "skill or trait", "evidence": "which question/answer revealed this", "note": "how this helps them" }
    ],
    "quickWins": [
      { "skill": "skill name", "timeEstimate": "e.g. 3 days", "why": "why this is a quick win for this user" }
    ],
    "supportLevel": "${supportIntensity}",
    "encouragementMessage": "A warm, specific, 1-2 sentence message written directly to this user based on their unique profile"
  }
}`;
}

// ─── ROADMAP GENERATION PROMPT ────────────────────────────────────────────────
// Called AFTER skill gap analysis. Builds the full personalized roadmap.
// Primary inputs: Q1, Q2, Q4, Q6, Q7, Q8, Q9, Q15 (per research report Section 9.2)
// Influence inputs: Q3, Q10 (support messaging + reminder timing)

export function buildRoadmapPrompt(payload, gapAnalysis) {
  const {
    digitalLiteracyLevel,
    availableHoursPerWeek,
    careerMode,
    preferredLearningStyle,
    urgencyLevel,
    workPreference,
    productivityWindow,
    disabilityAccommodations,
    aspirationalSkill,
    additionalContext,
    supportIntensity,
    pwdDocumentationStatus,
  } = payload;

  const { criticalGaps, currentStrengths, quickWins, recommendedCareerTrack, encouragementMessage } = gapAnalysis;

  // Roadmap depth based on urgency (research report Section 9.2)
  const urgencyInstructions = {
    immediate:   "FAST-TRACK: Build a 2-phase roadmap targeting job-readiness in 4–6 weeks. Focus ONLY on highest-impact skills. Skip foundational theory.",
    short_term:  "FOCUSED: Build a 3-phase roadmap targeting job-readiness in 6–10 weeks.",
    medium_term: "COMPREHENSIVE: Build a 4-phase roadmap targeting job-readiness in 10–16 weeks.",
    long_term:   "THOROUGH: Build a 4-phase roadmap with deep skill building targeting job-readiness in 16–24 weeks.",
  };

  // Learning style resource weighting (VARK model)
  const learningStyles = Array.isArray(preferredLearningStyle) ? preferredLearningStyle : [];
  const styleNote = learningStyles.length > 0
    ? `Learning style preferences: ${learningStyles.join(", ")}. Weight resources accordingly.`
    : "Mixed learning style — balance video, reading, and hands-on resources evenly.";

  const accessNote = Array.isArray(disabilityAccommodations) && disabilityAccommodations.length > 0
    ? `ACCESSIBILITY REQUIREMENTS: ${disabilityAccommodations.join(", ")}. ALL recommended resources MUST be accessible. Flag inaccessible resources and suggest alternatives.`
    : "";

  const contextNote = additionalContext
    ? `USER CONTEXT: "${additionalContext}" — incorporate into roadmap where relevant.`
    : "";

  const aspirationNote = aspirationalSkill
    ? `USER ASPIRATION: "${aspirationalSkill}" — include if it aligns with the career track.`
    : "";

  const pwdNote = pwdDocumentationStatus === "has_pwdid" || pwdDocumentationStatus === "has_docs"
    ? "This user has PWD documentation. Include information about TESDA scholarships and RA 7277 employer incentives where relevant."
    : "";

  const productivityNote = productivityWindow !== "varies"
    ? `User is most productive: ${productivityWindow}. Schedule challenge suggestions for this window.`
    : "";

  return `You are an inclusive career coach for InklusiJobs — a job platform for persons with disabilities (PWDs) in the Philippines.

Build a personalized, Competency-Based Assessment (CBA) learning roadmap aligned with TESDA qualifications and the Philippine job market.

USER PROFILE:
- Career track: ${recommendedCareerTrack}
- Career mode: ${careerMode}
- Digital literacy: ${digitalLiteracyLevel}
- Available hours/week: ${availableHoursPerWeek}
- Work preference: ${workPreference}
- Urgency: ${urgencyLevel}
- Support intensity needed: ${supportIntensity}
- ${styleNote}
- ${productivityNote}
- ${accessNote}
- ${contextNote}
- ${aspirationNote}
- ${pwdNote}

SKILL GAP ANALYSIS RESULTS:
- Critical gaps: ${JSON.stringify(criticalGaps)}
- Current strengths: ${JSON.stringify(currentStrengths)}
- Quick wins: ${JSON.stringify(quickWins)}

ROADMAP INSTRUCTIONS:
1. ${urgencyInstructions[urgencyLevel] || urgencyInstructions.medium_term}
2. Every resource must be FREE or low-cost (max ₱500/month) — platform serves PWDs in the Philippines
3. Start with quick wins to build momentum before tackling critical gaps
4. Each phase must end with a PORTFOLIO MILESTONE — a real, employer-facing work output
5. Challenges should follow the SCAFFOLDED ASSESSMENT MODEL: beginner = guided task, intermediate = objective only, advanced = open-ended
6. Include at least one Filipino-language or Philippines-context resource per phase where available
7. Use warm, encouraging language. Treat the user as capable. Never imply they are behind.
8. Reference TESDA units where the skill aligns with a national qualification

RESOURCE QUALITY RULES:
- Prioritize platforms: YouTube, Google Digital Garage, Coursera (audit), Canva tutorials, freeCodeCamp, TESDA Online Program (TOP)
- Each resource must have accessibility notes (captions available? keyboard navigable? screen reader friendly?)
- No paywalled resources without a free alternative listed

Respond ONLY in this exact JSON format:
{
  "roadmap": {
    "title": "Your [career track] Roadmap",
    "recommendedCareerTrack": "${recommendedCareerTrack}",
    "totalWeeks": 12,
    "estimatedJobReadyDate": "e.g. May 2026",
    "summary": "2-3 sentences written warmly and directly to the user explaining their roadmap",
    "encouragementMessage": "${encouragementMessage}",
    "phases": [
      {
        "phaseNumber": 1,
        "title": "Phase title",
        "durationWeeks": 3,
        "focus": "What this phase builds",
        "scaffoldLevel": "beginner|intermediate|advanced",
        "resources": [
          {
            "title": "Resource name",
            "type": "video|article|course|tool|community",
            "url": "https://...",
            "platform": "e.g. YouTube, Coursera, TESDA Online",
            "isFree": true,
            "language": "English|Filipino|Bilingual",
            "accessibilityNotes": "e.g. Has captions, keyboard navigable, screen reader friendly",
            "estimatedHours": 2
          }
        ],
        "challenges": [
          {
            "title": "Challenge name",
            "description": "What the user will create or do — written as a real job-like task",
            "scaffoldLevel": "guided|independent|open_ended",
            "estimatedHours": 3,
            "portfolioWorthy": true,
            "tesda_alignment": "TESDA unit this aligns with, if applicable"
          }
        ],
        "milestone": "Specific, concrete portfolio item the user will have after this phase"
      }
    ],
    "nextStep": "The single most important action this user should take TODAY to begin"
  }
}`;
}