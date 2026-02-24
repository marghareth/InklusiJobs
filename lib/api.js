// lib/ai-prompts.js
// Prompt templates for InklusiJobs AI analysis

/**
 * Maps raw assessment answer values to human-readable labels for AI context
 */
export function mapAnswersToAIPayload(answers) {
  const experienceMap = {
    beginner: "beginner", explored: "beginner",
    courses: "intermediate", projects: "intermediate", advanced: "advanced",
  };

  const hoursMap = { 3: 3, 7: 7, 15: 15, 25: 25 };

  return {
    careerMode:             answers[1]  || "exploratory",
    careerGoal:             answers[2]  || "open",
    experienceLevel:        experienceMap[answers[3]] || "beginner",
    availableHoursPerWeek:  hoursMap[answers[4]] || 7,
    availability:           answers[5]  || [],
    workPreference:         answers[6]  || "any",
    currentSkills:          answers[7]  || [],
    languagePreference:     answers[8]  || "english",
    portfolioStartingPoint: answers[9]  || "none",
    disabilityAccommodations: answers[11] || [],
    preferredLearningStyle: answers[10] || "mixed",
    disclosurePreference:   answers[12] || "private",
    urgencyLevel:           answers[13] || "medium_term",
    jobValuePreferences:    answers[14] || [],
    additionalContext:      answers[15] || "",
  };
}

/**
 * Skill Gap Analysis Prompt
 * Called first — identifies what the user needs to learn
 */
export function buildSkillGapPrompt(payload) {
  const {
    careerGoal, experienceLevel, currentSkills, portfolioStartingPoint,
    languagePreference, disabilityAccommodations, additionalContext,
  } = payload;

  const skillsList = Array.isArray(currentSkills) && currentSkills.length > 0
    ? currentSkills.join(", ")
    : "none listed";

  const contextLine = additionalContext
    ? `\nAdditional context from the user: "${additionalContext}"`
    : "";

  const accessibilityLine = Array.isArray(disabilityAccommodations) && disabilityAccommodations.length > 0
    ? `\nAccessibility needs: ${disabilityAccommodations.join(", ")}. Only recommend resources that are accessible for these needs.`
    : "";

  const languageLine = languagePreference === "filipino" || languagePreference === "basic"
    ? "\nIMPORTANT: Prioritize Filipino/Tagalog learning resources where available. Use simple English if Filipino resources are not available."
    : "";

  return `You are an inclusive career coach for InklusiJobs — a job platform for persons with disabilities (PWDs) in the Philippines.

Analyze this user's skill profile and identify their learning gaps for the career track they chose.

USER PROFILE:
- Career track: ${careerGoal}
- Experience level: ${experienceLevel}
- Tools/skills already known: ${skillsList}
- Portfolio status: ${portfolioStartingPoint}${contextLine}${accessibilityLine}${languageLine}

INSTRUCTIONS:
1. Identify 3–5 critical skill gaps they need to fill to become employable in "${careerGoal}"
2. Identify 2–3 current strengths they already have (even if informal)
3. Suggest 2–4 quick wins — skills they are close to having or can learn fast
4. Be encouraging and specific. Never make the user feel behind or inadequate.
5. Do NOT assume any prior work experience unless the experience level says "advanced".

Respond ONLY in this exact JSON format:
{
  "analysis": {
    "careerTrack": "${careerGoal}",
    "experienceLevel": "${experienceLevel}",
    "criticalGaps": [
      { "skill": "skill name", "reason": "why this matters for the role", "priority": "high|medium|low" }
    ],
    "currentStrengths": [
      { "skill": "skill or trait", "note": "how this helps them" }
    ],
    "quickWins": [
      { "skill": "skill name", "timeEstimate": "e.g. 3 days", "why": "why this is a quick win" }
    ],
    "encouragementMessage": "A warm, specific, 1-2 sentence message for this user based on their profile"
  }
}`;
}

/**
 * Roadmap Generation Prompt
 * Called after skill gap — builds the full personalized roadmap
 */
export function buildRoadmapPrompt(payload, gapAnalysis) {
  const {
    careerGoal, careerMode, experienceLevel, availableHoursPerWeek,
    preferredLearningStyle, urgencyLevel, workPreference, jobValuePreferences,
    languagePreference, disabilityAccommodations, additionalContext,
  } = payload;

  const { criticalGaps, currentStrengths, quickWins } = gapAnalysis;

  const urgencyInstructions = {
    immediate:   "Create a FAST-TRACK 2-phase roadmap. Focus only on the highest-impact skills. Target job-ready in 4–6 weeks.",
    short_term:  "Create a focused 3-phase roadmap. Target job-ready in 6–10 weeks.",
    medium_term: "Create a comprehensive 4-phase roadmap. Target job-ready in 10–16 weeks.",
    long_term:   "Create a thorough 4-phase roadmap with deep skill building. Target job-ready in 16–24 weeks.",
  };

  const learningStyleInstructions = {
    visual:   "Prioritize video tutorials and visual guides. Limit long reading assignments.",
    reading:  "Prioritize written guides, documentation, and articles. Include structured notes.",
    hands_on: "Prioritize hands-on challenges and projects. Unlock challenges early. Minimize theory.",
    mixed:    "Balance videos, reading, and hands-on practice evenly.",
  };

  const languageLine = languagePreference === "filipino" || languagePreference === "basic"
    ? "IMPORTANT: Include Filipino/Tagalog resources where available. Flag them with (Filipino)."
    : "";

  const accessibilityLine = Array.isArray(disabilityAccommodations) && disabilityAccommodations.length > 0
    ? `Accessibility requirements: ${disabilityAccommodations.join(", ")}. All recommended resources MUST be accessible for these needs. Avoid resources with known accessibility barriers.`
    : "";

  const contextLine = additionalContext ? `\nUser note: "${additionalContext}"` : "";

  const valuesLine = Array.isArray(jobValuePreferences) && jobValuePreferences.length > 0
    ? `User job values: ${jobValuePreferences.join(", ")} — tailor job-seeking advice to match these.`
    : "";

  return `You are an inclusive career coach for InklusiJobs — a job platform for persons with disabilities (PWDs) in the Philippines.

Build a personalized learning roadmap for this user based on their assessment results.

USER PROFILE:
- Career goal: ${careerGoal}
- Career mode: ${careerMode}
- Experience: ${experienceLevel}
- Available hours/week: ${availableHoursPerWeek}
- Work preference: ${workPreference}
- Urgency: ${urgencyLevel}
${valuesLine}${contextLine}

SKILL GAP ANALYSIS RESULTS:
- Critical gaps: ${JSON.stringify(criticalGaps)}
- Current strengths: ${JSON.stringify(currentStrengths)}
- Quick wins: ${JSON.stringify(quickWins)}

ROADMAP INSTRUCTIONS:
- ${urgencyInstructions[urgencyLevel] || urgencyInstructions.medium_term}
- Learning style: ${learningStyleInstructions[preferredLearningStyle] || learningStyleInstructions.mixed}
- ${languageLine}
- ${accessibilityLine}
- Each phase should have 2–4 resources and 1–2 challenges
- Resources must be FREE or low-cost (max ₱500/month) — this platform serves PWDs in the Philippines
- Every phase should end with a clear, achievable milestone the user can add to their portfolio
- Use warm, encouraging language throughout. Never use terms like "you should already know" or "basic"

Respond ONLY in this exact JSON format:
{
  "roadmap": {
    "title": "Your [careerGoal] Learning Roadmap",
    "totalWeeks": 12,
    "estimatedJobReadyDate": "e.g. April 2026",
    "summary": "2-3 sentence summary of this roadmap, written warmly and directly to the user",
    "phases": [
      {
        "phaseNumber": 1,
        "title": "Phase title",
        "durationWeeks": 3,
        "focus": "What this phase builds",
        "resources": [
          {
            "title": "Resource name",
            "type": "video|article|course|tool|community",
            "url": "https://...",
            "platform": "e.g. YouTube, Coursera",
            "isFree": true,
            "language": "English|Filipino|Bilingual",
            "accessibilityNotes": "e.g. Has captions, keyboard navigable"
          }
        ],
        "challenges": [
          {
            "title": "Challenge name",
            "description": "What the user will create or do",
            "estimatedHours": 3,
            "portfolioWorthy": true
          }
        ],
        "milestone": "Specific, concrete thing they can add to their portfolio after this phase"
      }
    ],
    "nextStep": "Specific first action they should take TODAY"
  }
}`;
}