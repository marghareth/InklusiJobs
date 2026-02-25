// app/api/challenge/score/route.js
import { NextResponse } from "next/server";
import { callAI } from "@/lib/api";
import { saveChallengeAttempt } from "@/lib/supabase-progress";

export async function POST(request) {
  try {
    const body = await request.json();
    const { challengeId, jobId, challenge, submission, userId } = body;

    if (!challenge || !submission) {
      return NextResponse.json({ error: "Missing challenge or submission" }, { status: 400 });
    }

    const prompt = buildChallengePrompt(challenge, submission);
    let result;

    try {
      result = await callAI(prompt);
    } catch (e) {
      // Fallback scoring if AI fails
      result = fallbackScore(challenge, submission);
    }

    if (!result?.score) throw new Error("AI response missing score");

    const finalResult = {
      score:         result.score,
      maxScore:      100,
      passed:        result.score >= (challenge.passingScore || 70),
      rubricScores:  result.rubricScores || [],
      overallFeedback: result.overallFeedback || "",
      encouragement: result.encouragement || "",
      nextStep:      result.nextStep || "",
      submission,
    };

    // Save to Supabase
    if (userId && jobId && challengeId) {
      try {
        await saveChallengeAttempt(userId, jobId, challengeId, challenge.phaseNumber, {
          ...finalResult,
          feedback: finalResult.overallFeedback,
        });
      } catch (e) {
        console.error("[challenge/score] Supabase save error:", e);
      }
    }

    return NextResponse.json(finalResult);

  } catch (error) {
    console.error("[challenge/score] Error:", error);
    return NextResponse.json({ error: "Scoring failed", detail: error.message }, { status: 500 });
  }
}

function buildChallengePrompt(challenge, submission) {
  const rubricText = challenge.rubric
    ?.map(r => `- "${r.criterion}" (${r.maxScore} points): ${r.description}`)
    .join("\n") || "Score based on overall quality, completeness, and practical value.";

  return `You are a fair, encouraging professional evaluator for InklusiJobs — a job platform for PWDs in the Philippines.

Evaluate this practical challenge submission as if you were a hiring manager reviewing real work.

CHALLENGE: ${challenge.title}
BRIEF SUMMARY: ${challenge.briefSummary}
SKILLS BEING ASSESSED: ${challenge.skills?.join(", ")}
PASSING SCORE: ${challenge.passingScore || 70}%

RUBRIC (Total 100 points):
${rubricText}

SUBMISSION:
"""
${submission}
"""

EVALUATION RULES:
1. Be fair but honest — this person is trying to get their first job
2. Give credit for correct thinking even if imperfectly expressed
3. Filipino English and informal tone are acceptable — don't penalise for language style
4. A submission that shows genuine effort and understanding should pass even if not perfect
5. Be specific in your feedback — vague feedback helps no one
6. Frame all feedback constructively — what to keep, what to improve
7. The encouragement message must be specific to THIS submission, not generic

Return ONLY this exact JSON:
{
  "score": 74,
  "rubricScores": [
    {
      "criterion": "criterion name from rubric",
      "score": 18,
      "maxScore": 25,
      "feedback": "Specific 1-2 sentence feedback on this criterion"
    }
  ],
  "overallFeedback": "2-3 sentences of warm, specific overall feedback written directly to the applicant",
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["specific improvement 1", "specific improvement 2"],
  "encouragement": "Warm, specific 1-2 sentence message about something unique you noticed in their submission",
  "nextStep": "The single most important thing they should work on next"
}`;
}

function fallbackScore(challenge, submission) {
  const wordCount = submission.trim().split(/\s+/).length;
  const score = wordCount > 200 ? 72 : wordCount > 100 ? 60 : wordCount > 50 ? 48 : 30;

  return {
    score,
    rubricScores: challenge.rubric?.map(r => ({
      criterion: r.criterion,
      score:     Math.round(r.maxScore * (score / 100)),
      maxScore:  r.maxScore,
      feedback:  "AI evaluation unavailable — basic scoring applied.",
    })) || [],
    overallFeedback: "Your submission has been recorded. Detailed AI feedback will be available once the service is restored.",
    encouragement:   "Great job completing this challenge! The effort you put in will pay off.",
    nextStep:        "Review the challenge brief and compare your submission against each rubric criterion.",
  };
}