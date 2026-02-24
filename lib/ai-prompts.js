// lib/ai-prompts.js
// AI Prompt Templates for InklusiJobs
// Frameworks: TESDA PTQF, O*NET, Universal Design for Assessment (UDA),
// CBA principles, RA 7277

// ─── MAP RAW ANSWERS TO AI PAYLOAD ───────────────────────────────────────────
export function mapAnswersToAIPayload(answers) {
  const supportMap = {
    gives_up:    "high",
    seeks_help:  "moderate",
    tries_again: "low",
    researches:  "minimal",
  };
  const hoursMap = { 8: 8, 15: 15, 25: 25, 35: 35, 0: 10 };
  const urgencyMap = {
    employment:  "immediate",
    freelance:   "short_term",
    career_up:   "medium_term",
    upskilling:  "medium_term",
    exploratory: "long_term",
  };

  return {
    digitalLiteracyLevel:     answers[1]  || "everyday_tools",
    priorExperience:          answers[2]  || [],
    problemSolvingStyle:      answers[3]  || "seeks_help",
    confidenceAreas:          answers[4]  || [],
    aspirationalSkill:        answers[5]  || "",
    supportIntensity:         supportMap[answers[3]] || "moderate",
    workPreference:           answers[6]  || "any",
    availableHoursPerWeek:    hoursMap[answers[7]] || 15,
    careerMode:               answers[8]  || "exploratory",
    preferredLearningStyle:   answers[9]  || [],
    productivityWindow:       answers[10] || "varies",
    urgencyLevel:             urgencyMap[answers[8]] || "medium_term",
    disabilityAccommodations: answers[11] || [],
    accommodationRequest:     answers[12] || "",
    pwdDocumentationStatus:   answers[13] || "prefer_not",
    acquisitionChannel:       answers[14] || "",
    additionalContext:        answers[15] || "",
  };
}

// ─── SKILL SCORING PROMPT ─────────────────────────────────────────────────────
// Called after assessment. Scores the user's answers against a specific job's
// required skills using a research-based rubric.
// Rubric methodology: O*NET importance ratings + TESDA competency standards
// Passing threshold: AI-determined per job (not fixed) — based on minimum
// viable competency level for entry-level employment in that role.

export function buildScoringPrompt(answers, job, jobSelection) {
  // Format answers for the prompt
  const answersFormatted = Object.entries(answers)
    .map(([key, val]) => {
      const value = Array.isArray(val) ? val.join(", ") : val;
      return `- Question ID "${key}": ${value || "(skipped)"}`;
    })
    .join("\n");

  // Format required skills with weights
  const skillsFormatted = job.requiredSkills
    .map(s => `  - "${s.skill}" (importance weight: ${s.weight}, TESDA: ${s.tesda_reference || s.tesda})`)
    .join("\n");

  return `You are a fair, inclusive skill assessor for InklusiJobs — a job platform for Persons with Disabilities (PWDs) in the Philippines.

Your task is to evaluate a job applicant's answers and determine how ready they are for a specific role.

JOB BEING APPLIED FOR:
- Title: ${job.title}
- Company: ${job.company}
- Work Setup: ${job.setup}
- Required Skills (with importance weights):
${skillsFormatted}

APPLICANT'S ANSWERS:
${answersFormatted}

SCORING METHODOLOGY:
You must score each required skill from 0 to 100 based on evidence in the answers.
Use this research-based rubric per skill:

SCORE RANGE → MEANING:
- 85–100: Strong evidence of competency — answer shows clear experience, correct knowledge, or strong work sample
- 70–84:  Moderate evidence — answer shows partial experience or mostly correct understanding  
- 50–69:  Emerging competency — answer shows awareness but limited practical ability
- 25–49:  Minimal evidence — answer shows little relevant knowledge or experience
- 0–24:   No evidence — answer is incorrect, irrelevant, or question was skipped

WEIGHTED OVERALL SCORE:
- Skills with weight 2 count DOUBLE in the final average
- Skills with weight 1 count normally
- Formula: sum(score × weight) / sum(weights)

PASSING THRESHOLD:
- Determine the minimum viable score for this specific job
- Consider: Is this an entry-level role? What is the absolute minimum competency needed to start?
- Be realistic but fair — a score of 65–70 is typically sufficient for entry-level roles
- A score of 75+ typically indicates readiness without a roadmap
- State your threshold clearly and justify it

ANTI-BIAS RULES — STRICTLY FOLLOW:
- Do NOT penalise users for disclosing a disability
- Do NOT assume lower capability based on accommodation needs
- DO give credit for informal, volunteer, or personal experience
- DO treat honest self-assessment of limitations as a positive sign of self-awareness
- For text/writing answers: evaluate quality of thinking and communication, not grammar perfection
- For scenario questions: prioritise correct reasoning over vocabulary

IMPORTANT: Text/writing samples (email, caption, script, outline) must be evaluated carefully:
- Even a simple but correct response should score 60+ if it shows the right approach
- A thoughtful, well-structured response should score 80+
- Penalise only for clearly wrong approach, not for brevity or informal style

Return ONLY this exact JSON — no markdown, no extra text:
{
  "scoring": {
    "jobTitle": "${job.title}",
    "overallScore": 72,
    "passingThreshold": 65,
    "qualified": true,
    "qualificationLevel": "ready | nearly_ready | needs_development",
    "skillScores": [
      {
        "skill": "skill name from requiredSkills",
        "score": 75,
        "weight": 2,
        "evidence": "specific answer or behaviour that supports this score",
        "feedback": "one warm, specific sentence of feedback for this skill"
      }
    ],
    "overallFeedback": "2–3 sentences written warmly and directly to the applicant summarising their results",
    "strengths": ["specific strength 1", "specific strength 2"],
    "areasToGrow": ["specific area 1", "specific area 2"],
    "encouragementMessage": "A warm, specific 1–2 sentence message for this applicant based on their unique profile",
    "nextStep": "The single most important action this person should take next — whether they qualified or not"
  }
}`;
}

// ─── SKILL GAP ANALYSIS PROMPT ────────────────────────────────────────────────
export function buildSkillGapPrompt(payload) {
  const {
    digitalLiteracyLevel, priorExperience, confidenceAreas,
    aspirationalSkill, supportIntensity, disabilityAccommodations,
    additionalContext, careerMode,
  } = payload;

  const experienceList = Array.isArray(priorExperience) && priorExperience.length > 0
    ? priorExperience.filter(e => e !== "none").join(", ") || "none listed"
    : "none listed";

  const strengthsList = Array.isArray(confidenceAreas) && confidenceAreas.length > 0
    ? confidenceAreas.join(", ") : "not specified";

  const accessibilityNote = Array.isArray(disabilityAccommodations) && disabilityAccommodations.length > 0
    ? `\nACCESSIBILITY: Only recommend resources accessible for: ${disabilityAccommodations.join(", ")}.` : "";

  const aspirationNote = aspirationalSkill
    ? `\nUSER ASPIRATION: "${aspirationalSkill}"` : "";

  const contextNote = additionalContext
    ? `\nADDITIONAL CONTEXT: "${additionalContext}"` : "";

  return `You are an inclusive career coach for InklusiJobs — a job platform for PWDs in the Philippines.

USER PROFILE:
- Digital literacy: ${digitalLiteracyLevel}
- Prior experience: ${experienceList}
- Confidence areas: ${strengthsList}
- Career goal: ${careerMode}
- Support intensity: ${supportIntensity}${aspirationNote}${accessibilityNote}${contextNote}

Identify skill gaps using TESDA PTQF competency standards.

Return ONLY this exact JSON:
{
  "analysis": {
    "recommendedCareerTrack": "design|writing|data_admin|technology|digital_marketing|customer_service|general",
    "careerTrackReason": "1-2 sentence explanation",
    "criticalGaps": [
      { "skill": "skill name", "reason": "why this matters", "priority": "high|medium|low", "tesda_reference": "TESDA unit" }
    ],
    "currentStrengths": [
      { "skill": "skill or trait", "evidence": "which answer revealed this", "note": "how this helps" }
    ],
    "quickWins": [
      { "skill": "skill name", "timeEstimate": "e.g. 3 days", "why": "why this is a quick win" }
    ],
    "supportLevel": "${supportIntensity}",
    "encouragementMessage": "Warm, specific 1-2 sentence message for this user"
  }
}`;
}

// ─── ROADMAP GENERATION PROMPT ────────────────────────────────────────────────
export function buildRoadmapPrompt(payload, gapAnalysis) {
  const {
    availableHoursPerWeek, careerMode, preferredLearningStyle, urgencyLevel,
    workPreference, disabilityAccommodations, aspirationalSkill,
    additionalContext, supportIntensity, pwdDocumentationStatus, productivityWindow,
  } = payload;

  const { criticalGaps, currentStrengths, quickWins, recommendedCareerTrack, encouragementMessage } = gapAnalysis;

  const urgencyInstructions = {
    immediate:   "FAST-TRACK: 2-phase roadmap, job-ready in 4–6 weeks. Highest-impact skills only.",
    short_term:  "FOCUSED: 3-phase roadmap, job-ready in 6–10 weeks.",
    medium_term: "COMPREHENSIVE: 4-phase roadmap, job-ready in 10–16 weeks.",
    long_term:   "THOROUGH: 4-phase roadmap with deep skill building, 16–24 weeks.",
  };

  const learningStyles = Array.isArray(preferredLearningStyle) ? preferredLearningStyle : [];
  const styleNote = learningStyles.length > 0
    ? `Learning style: ${learningStyles.join(", ")}. Weight resources accordingly.`
    : "Mixed learning style — balance video, reading, and hands-on resources.";

  const accessNote = Array.isArray(disabilityAccommodations) && disabilityAccommodations.length > 0
    ? `ACCESSIBILITY: ${disabilityAccommodations.join(", ")}. ALL resources MUST be accessible.` : "";

  const pwdNote = pwdDocumentationStatus === "has_pwdid" || pwdDocumentationStatus === "has_docs"
    ? "User has PWD documentation. Include TESDA scholarship and RA 7277 employer incentive info where relevant." : "";

  return `You are an inclusive career coach for InklusiJobs — a job platform for PWDs in the Philippines.

Build a personalised CBA learning roadmap aligned with TESDA qualifications.

USER PROFILE:
- Career track: ${recommendedCareerTrack}
- Career mode: ${careerMode}
- Hours/week: ${availableHoursPerWeek}
- Work preference: ${workPreference}
- Urgency: ${urgencyLevel}
- Support needed: ${supportIntensity}
- ${styleNote}
- ${accessNote}
- ${pwdNote}
${additionalContext ? `- User context: "${additionalContext}"` : ""}
${aspirationalSkill ? `- Aspiration: "${aspirationalSkill}"` : ""}
${productivityWindow !== "varies" ? `- Most productive: ${productivityWindow}` : ""}

SKILL GAP RESULTS:
- Gaps: ${JSON.stringify(criticalGaps)}
- Strengths: ${JSON.stringify(currentStrengths)}
- Quick wins: ${JSON.stringify(quickWins)}

RULES:
1. ${urgencyInstructions[urgencyLevel] || urgencyInstructions.medium_term}
2. FREE or low-cost resources only (max ₱500/month)
3. Start with quick wins to build momentum
4. Each phase ends with a portfolio milestone
5. Include at least one Filipino-language or PH-context resource per phase
6. Reference TESDA units where applicable

Return ONLY this exact JSON:
{
  "roadmap": {
    "title": "Your [track] Roadmap",
    "recommendedCareerTrack": "${recommendedCareerTrack}",
    "totalWeeks": 12,
    "estimatedJobReadyDate": "e.g. May 2026",
    "summary": "2-3 warm sentences directly to the user",
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
            "platform": "e.g. YouTube, TESDA Online",
            "isFree": true,
            "language": "English|Filipino|Bilingual",
            "accessibilityNotes": "e.g. Has captions",
            "estimatedHours": 2
          }
        ],
        "challenges": [
          {
            "title": "Challenge name",
            "description": "Real job-like task description",
            "scaffoldLevel": "guided|independent|open_ended",
            "estimatedHours": 3,
            "portfolioWorthy": true,
            "tesda_alignment": "TESDA unit if applicable"
          }
        ],
        "milestone": "Specific portfolio item after this phase"
      }
    ],
    "nextStep": "Single most important action to take TODAY"
  }
}`;
}