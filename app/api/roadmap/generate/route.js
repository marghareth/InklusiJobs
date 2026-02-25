// app/api/roadmap/generate/route.js
import { NextResponse } from "next/server";
import { callAI } from "@/lib/api";

export async function POST(request) {
  try {
    const body = await request.json();
    const { scoring, job } = body;

    if (!scoring || !job) {
      return NextResponse.json(
        { error: "Missing scoring or job data. Visit /results first." },
        { status: 400 }
      );
    }

    const prompt = buildRoadmapFromScoringPrompt(scoring, job);
    const result = await callAI(prompt);

    if (!result?.roadmap) {
      throw new Error("AI response missing 'roadmap' field");
    }

    return NextResponse.json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error("[roadmap/generate] Error:", error);
    return NextResponse.json(
      { error: "Roadmap generation failed", detail: error.message },
      { status: 500 }
    );
  }
}

// ─── Prompt ───────────────────────────────────────────────────────────────────
function buildRoadmapFromScoringPrompt(scoring, job) {
  const weakSkills = scoring.skillScores
    ?.filter(s => s.score < scoring.passingThreshold)
    .map(s => `"${s.skill}" (scored ${s.score}% — ${s.feedback})`)
    .join("\n  ") || "None identified";

  const strongSkills = scoring.skillScores
    ?.filter(s => s.score >= 70)
    .map(s => `"${s.skill}" (scored ${s.score}%)`)
    .join(", ") || "None yet";

  const urgency = scoring.overallScore >= 60 ? "short_term" : "medium_term";

  const urgencyMap = {
    short_term:  "FOCUSED: 3-phase roadmap targeting job-readiness in 6–10 weeks.",
    medium_term: "COMPREHENSIVE: 4-phase roadmap targeting job-readiness in 10–16 weeks.",
  };

  return `You are an inclusive career coach for InklusiJobs — a job platform for Persons with Disabilities (PWDs) in the Philippines.

A user just completed a skills assessment for the role of "${job.title}" and did NOT meet the passing threshold.
Build them a personalised learning roadmap to close their skill gaps and become job-ready.

TARGET JOB: ${job.title} (${job.company || "Remote"})

THEIR ASSESSMENT RESULTS:
- Overall score: ${scoring.overallScore}%
- Passing threshold: ${scoring.passingThreshold}%
- Qualification level: ${scoring.qualificationLevel}

SKILLS BELOW THRESHOLD (priority areas for roadmap):
  ${weakSkills}

EXISTING STRENGTHS (build on these, don't repeat):
  ${strongSkills}

OVERALL FEEDBACK: ${scoring.overallFeedback}

ROADMAP INSTRUCTIONS:
1. ${urgencyMap[urgency]}
2. Address the weakest skills first — prioritise by gap size
3. Build on existing strengths — don't start from zero where not needed
4. Every resource must be FREE or low-cost (max ₱500/month) — platform serves PWDs in the Philippines
5. Include at least one Filipino-language or Philippines-context resource per phase where available
6. Each phase ends with a PORTFOLIO MILESTONE — a concrete, employer-facing work output
7. Use SCAFFOLDED ASSESSMENT MODEL: Phase 1 = guided tasks, Phase 2 = independent, Phase 3+ = open-ended
8. Reference TESDA units where skills align with national qualifications (NC II, NC III)
9. Use warm, encouraging language — never imply the user is behind or failed
10. Prioritise: YouTube, Google Digital Garage, Coursera (audit), Canva tutorials, freeCodeCamp, TESDA Online Program

RESOURCE RULES:
- Each resource must include accessibility notes (captions? screen reader friendly? keyboard navigable?)
- Flag Filipino/bilingual resources clearly
- No paywalled resources without a free alternative

Return ONLY this exact JSON — no markdown, no extra text:
{
  "roadmap": {
    "title": "Your Path to ${job.title}",
    "recommendedCareerTrack": "the relevant track",
    "totalWeeks": 10,
    "estimatedJobReadyDate": "e.g. April 2026",
    "summary": "2-3 warm sentences written directly to the user explaining what this roadmap will achieve",
    "encouragementMessage": "Warm, specific 1-2 sentence message for this user",
    "phases": [
      {
        "phaseNumber": 1,
        "title": "Phase title",
        "durationWeeks": 3,
        "focus": "What skill gaps this phase closes",
        "scaffoldLevel": "beginner|intermediate|advanced",
        "resources": [
          {
            "title": "Resource name",
            "type": "video|article|course|tool|community",
            "url": "https://...",
            "platform": "e.g. YouTube, TESDA Online",
            "isFree": true,
            "language": "English|Filipino|Bilingual",
            "accessibilityNotes": "e.g. Has captions, keyboard navigable",
            "estimatedHours": 2
          }
        ],
        "challenges": [
          {
            "title": "Challenge name",
            "description": "Real job-like task — written as if from an employer",
            "scaffoldLevel": "guided|independent|open_ended",
            "estimatedHours": 3,
            "portfolioWorthy": true,
            "tesda_alignment": "TESDA unit this aligns with"
          }
        ],
        "milestone": "Specific, concrete portfolio item the user will have after this phase"
      }
    ],
    "nextStep": "The single most important action this user should take TODAY"
  }
}`;
}