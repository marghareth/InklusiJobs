// app/api/roadmap/generate/route.js
// DEMO VERSION — No Supabase needed here, this was already clean.
// Added: fallback mock roadmap when AI is slow or unavailable.

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

    // ── Try AI roadmap generation ────────────────────────────────────────────
    try {
      const prompt = buildRoadmapFromScoringPrompt(scoring, job);
      const result = await callAI(prompt);

      if (!result?.roadmap) {
        throw new Error("AI response missing 'roadmap' field");
      }

      return NextResponse.json({
        success: true,
        source: "ai",
        ...result,
      });

    } catch (aiError) {
      console.warn("[roadmap/generate] AI failed, using fallback:", aiError.message);

      // ── Fallback: return mock roadmap based on jobId ─────────────────────
      const fallback = buildFallbackRoadmap(scoring, job);
      return NextResponse.json({
        success: true,
        source: "fallback",
        roadmap: fallback,
      });
    }

  } catch (error) {
    console.error("[roadmap/generate] Error:", error);
    return NextResponse.json(
      { error: "Roadmap generation failed", detail: error.message },
      { status: 500 }
    );
  }
}

// ─── AI PROMPT ────────────────────────────────────────────────────────────────

function buildRoadmapFromScoringPrompt(scoring, job) {
  const weakSkills = scoring.skillScores
    ?.filter((s) => s.score < scoring.passingThreshold)
    .map((s) => `"${s.skill}" (scored ${s.score}% — ${s.feedback})`)
    .join("\n  ") || "None identified";

  const strongSkills = scoring.skillScores
    ?.filter((s) => s.score >= 70)
    .map((s) => `"${s.skill}" (scored ${s.score}%)`)
    .join(", ") || "None yet";

  const urgency = scoring.overallScore >= 60 ? "short_term" : "medium_term";

  const urgencyMap = {
    short_term: "FOCUSED: 3-phase roadmap targeting job-readiness in 6–10 weeks.",
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
4. Every resource must be FREE or low-cost (max ₱500/month)
5. Include at least one Filipino-language or Philippines-context resource per phase where available
6. Each phase ends with a PORTFOLIO MILESTONE
7. Use warm, encouraging language — never imply the user is behind or failed
8. Reference TESDA units where skills align with national qualifications

Return ONLY this exact JSON — no markdown, no extra text:
{
  "roadmap": {
    "title": "Your Path to ${job.title}",
    "recommendedCareerTrack": "the relevant track",
    "totalWeeks": 10,
    "estimatedJobReadyDate": "e.g. April 2026",
    "summary": "2-3 warm sentences written directly to the user",
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
            "type": "video|article|course|tool",
            "url": "https://...",
            "platform": "e.g. YouTube",
            "isFree": true,
            "language": "English|Filipino|Bilingual",
            "accessibilityNotes": "e.g. Has captions",
            "estimatedHours": 2
          }
        ],
        "challenges": [
          {
            "title": "Challenge name",
            "description": "Real job-like task",
            "estimatedHours": 3,
            "portfolioWorthy": true,
            "tesda_alignment": "TESDA unit"
          }
        ],
        "milestone": "Specific portfolio item after this phase"
      }
    ],
    "nextStep": "The single most important action this user should take TODAY"
  }
}`;
}

// ─── FALLBACK ROADMAP (when AI is slow or unavailable) ───────────────────────

function buildFallbackRoadmap(scoring, job) {
  const jobId = job?.id || "va_general";
  const jobTitle = job?.title || "Remote Professional";

  const fallbacksByJob = {
    smm_manager: {
      title: `Your Path to ${jobTitle}`,
      recommendedCareerTrack: "social_media",
      totalWeeks: 8,
      estimatedJobReadyDate: "April 2026",
      summary: `You're closer than you think! This roadmap will take you from where you are now to job-ready in 8 weeks. We'll start with content strategy, then build your analytics skills, and finish with full platform mastery.`,
      encouragementMessage: "Your creativity and instincts for social media are real strengths — this roadmap just gives them structure. Let's go! 💪",
      phases: [
        {
          phaseNumber: 1,
          title: "Content Foundations",
          durationWeeks: 3,
          focus: "Content strategy and caption writing",
          scaffoldLevel: "beginner",
          resources: [
            { title: "Social Media Marketing Full Course", type: "video", url: "https://www.youtube.com/watch?v=uy5JkHFbCJk", platform: "YouTube", isFree: true, language: "English", accessibilityNotes: "Auto-captions available", estimatedHours: 2 },
            { title: "How to Write Captions That Convert", type: "video", url: "https://www.youtube.com/watch?v=yPMWMzNFtbs", platform: "YouTube", isFree: true, language: "English", accessibilityNotes: "Auto-captions available", estimatedHours: 1 },
          ],
          challenges: [{ title: "Build a 1-Week Content Calendar", description: "Create a 7-day Instagram content calendar for a local Filipino brand.", estimatedHours: 3, portfolioWorthy: true, tesda_alignment: "Digital Marketing NC III" }],
          milestone: "A complete 7-day Instagram content calendar you can show employers",
        },
        {
          phaseNumber: 2,
          title: "Analytics & Design",
          durationWeeks: 3,
          focus: "Reading data and creating on-brand graphics",
          scaffoldLevel: "intermediate",
          resources: [
            { title: "Instagram Analytics for Beginners", type: "video", url: "https://www.youtube.com/watch?v=7dCHBvuJNjY", platform: "YouTube", isFree: true, language: "English", accessibilityNotes: "Auto-captions available", estimatedHours: 1 },
            { title: "Canva for Social Media — Full Tutorial", type: "video", url: "https://www.youtube.com/watch?v=4_-PeT9VGBY", platform: "YouTube", isFree: true, language: "English", accessibilityNotes: "Official Canva tutorial, keyboard navigable", estimatedHours: 1.5 },
          ],
          challenges: [{ title: "Respond to a Social Media Crisis", description: "Handle a viral negative comment and write a brand response strategy.", estimatedHours: 2, portfolioWorthy: true, tesda_alignment: "Digital Marketing NC III" }],
          milestone: "A crisis response case study and 3 branded Canva templates",
        },
        {
          phaseNumber: 3,
          title: "Platform Mastery",
          durationWeeks: 2,
          focus: "Meta Business Suite and multi-account management",
          scaffoldLevel: "advanced",
          resources: [
            { title: "Meta Business Suite Complete Tutorial", type: "video", url: "https://www.youtube.com/watch?v=n7vkMF6PNWE", platform: "YouTube", isFree: true, language: "English", accessibilityNotes: "Auto-captions available", estimatedHours: 1.5 },
          ],
          challenges: [{ title: "Analyse Performance & Pitch Strategy", description: "Read mock analytics data and pitch a data-driven content strategy.", estimatedHours: 2, portfolioWorthy: true, tesda_alignment: "Digital Marketing NC III" }],
          milestone: "A full analytics report and strategic pitch deck",
        },
      ],
      nextStep: "Watch the Social Media Marketing Full Course today — it's only 2 hours and will change how you think about content.",
    },

    va_general: {
      title: `Your Path to ${jobTitle}`,
      recommendedCareerTrack: "customer_service",
      totalWeeks: 6,
      estimatedJobReadyDate: "March 2026",
      summary: "Your organisational instincts are already a huge advantage. This 6-week roadmap will formalise your skills, build your confidence with digital tools, and give you a portfolio that proves your capabilities to employers.",
      encouragementMessage: "You already think like a VA — now let's give you the credentials to prove it. 6 weeks from now, you'll be job-ready! 🌟",
      phases: [
        {
          phaseNumber: 1,
          title: "Digital Tools & Communication",
          durationWeeks: 2,
          focus: "Google Workspace and professional email writing",
          scaffoldLevel: "beginner",
          resources: [
            { title: "Google Workspace for Beginners", type: "video", url: "https://www.youtube.com/watch?v=pBBHBY0Rcmk", platform: "YouTube", isFree: true, language: "English", accessibilityNotes: "Auto-captions, slow-paced tutorial", estimatedHours: 1.5 },
            { title: "Professional Email Writing", type: "article", url: "https://www.grammarly.com/blog/professional-email-writing/", platform: "Grammarly Blog", isFree: true, language: "English", accessibilityNotes: "Screen reader compatible", estimatedHours: 0.5 },
          ],
          challenges: [{ title: "Organise a Client's Inbox & Schedule", description: "Sort a messy inbox scenario and set up a weekly schedule for a busy client.", estimatedHours: 2, portfolioWorthy: true, tesda_alignment: "Business Communication NC II" }],
          milestone: "A complete inbox management system and weekly calendar template",
        },
        {
          phaseNumber: 2,
          title: "Client Management",
          durationWeeks: 2,
          focus: "Handling client situations professionally",
          scaffoldLevel: "intermediate",
          resources: [],
          challenges: [{ title: "Handle a Difficult Client Situation", description: "Write professional responses to a frustrated client scenario.", estimatedHours: 1, portfolioWorthy: true, tesda_alignment: "Business Communication NC II" }],
          milestone: "A professional client communication case study",
        },
        {
          phaseNumber: 3,
          title: "Systems & Reliability",
          durationWeeks: 2,
          focus: "Building repeatable systems",
          scaffoldLevel: "advanced",
          resources: [],
          challenges: [],
          milestone: "A full client onboarding checklist and SOP document",
        },
      ],
      nextStep: "Start with the Google Workspace tutorial today — even if you've used Gmail before, this covers the professional features most VAs miss.",
    },
  };

  // Return job-specific fallback or a generic one
  return fallbacksByJob[jobId] || fallbacksByJob["va_general"];
}