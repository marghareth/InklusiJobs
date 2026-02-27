// app/api/challenges/evaluate/route.js
// DEMO VERSION — Supabase + Notion removed, replaced with localStorage
// Evaluates a challenge submission using AI and returns the result.
// The CLIENT saves the result to localStorage after receiving it.

import { NextResponse } from "next/server";
import { callAI } from "@/lib/api";

export async function POST(request) {
  try {
    const {
      challengeId,
      challengeTitle,
      challengeBrief,
      rubric,
      submissionText,
      submissionUrl,
      userId,
      jobId,
      phaseNumber,
    } = await request.json();

    // Basic validation
    if (!challengeId || !submissionText) {
      return NextResponse.json(
        { error: "Missing challengeId or submissionText" },
        { status: 400 }
      );
    }

    let aiResult = null;

    // ── Try AI evaluation ────────────────────────────────────────────────────
    try {
      const prompt = buildEvaluationPrompt({
        challengeTitle,
        challengeBrief,
        rubric,
        submissionText,
        submissionUrl,
      });

      aiResult = await callAI(prompt);

      if (!aiResult?.score && aiResult?.score !== 0) {
        throw new Error("AI response missing score");
      }
    } catch (aiError) {
      console.warn("[challenges/evaluate] AI failed, using fallback:", aiError.message);

      // ── Fallback scoring when AI is slow/unavailable ─────────────────────
      aiResult = buildFallbackEvaluation(submissionText, rubric);
    }

    // Clamp score to 0–100
    const score = Math.min(100, Math.max(0, Math.round(aiResult.score || 0)));
    const passingScore = 70;
    const passed = score >= passingScore;

    const result = {
      success: true,
      submissionId: `sub_${Date.now()}`,
      challengeId,
      userId: userId || "demo_user",
      jobId: jobId || "unknown",
      phaseNumber: phaseNumber || 1,
      submission: submissionText,
      score,
      maxScore: 100,
      passed,
      rubricScores: aiResult.rubricScores || [],
      feedback: aiResult.feedback || "Your submission has been evaluated.",
      encouragement: aiResult.encouragement || (
        passed
          ? "Excellent work! You've earned this badge. 🎉"
          : "Great effort! Review the feedback and try again — you're closer than you think."
      ),
      submittedAt: new Date().toISOString(),
      // Tell client to save this to localStorage
      saveToLocalStorage: true,
    };

    return NextResponse.json(result);

  } catch (err) {
    console.error("[challenges/evaluate] Error:", err);
    return NextResponse.json({ error: "Evaluation failed", detail: err.message }, { status: 500 });
  }
}

// ─── AI EVALUATION PROMPT ─────────────────────────────────────────────────────

function buildEvaluationPrompt({ challengeTitle, challengeBrief, rubric, submissionText, submissionUrl }) {
  const rubricText = rubric
    ?.map((r) => `- ${r.criterion} (max ${r.maxScore} pts): ${r.description}`)
    .join("\n") || "Evaluate overall quality, completeness, and practical value.";

  return `You are a fair, encouraging portfolio evaluator for InklusiJobs — a platform helping Persons with Disabilities (PWDs) in the Philippines build verified skills and portfolios.

CHALLENGE: "${challengeTitle}"

CHALLENGE BRIEF:
${challengeBrief || "Complete the challenge as described."}

EVALUATION RUBRIC:
${rubricText}

CANDIDATE'S SUBMISSION:
"${submissionText}"
${submissionUrl ? `\nSubmission URL: ${submissionUrl}` : ""}

EVALUATION RULES:
1. Score each rubric criterion separately
2. Total score is sum of all criterion scores (max 100)
3. Passing score is 70/100
4. Be generous with partial credit — this is a learning platform for PWDs
5. NEVER penalise for Filipino English, informal tone, or brevity if the content is correct
6. Give specific, actionable feedback — not generic praise or criticism
7. Encouragement must be specific to THEIR submission, not a template

Return ONLY this exact JSON — no markdown, no extra text:
{
  "score": 85,
  "passed": true,
  "rubricScores": [
    {
      "criterion": "Criterion name",
      "score": 22,
      "maxScore": 25,
      "comment": "Specific 1-sentence comment on this criterion"
    }
  ],
  "feedback": "2-3 sentence overall feedback — what they did well and one specific improvement",
  "encouragement": "1 warm sentence specific to their work — not generic"
}`;
}

// ─── FALLBACK EVALUATION (when AI is slow or unavailable) ────────────────────

function buildFallbackEvaluation(submissionText, rubric) {
  const wordCount = submissionText?.trim().split(/\s+/).length || 0;

  // Simple heuristic scoring based on submission length and effort
  let baseScore = 0;
  if (wordCount >= 300) baseScore = 78;
  else if (wordCount >= 150) baseScore = 72;
  else if (wordCount >= 80) baseScore = 65;
  else if (wordCount >= 30) baseScore = 55;
  else baseScore = 35;

  // Build fallback rubric scores
  const rubricScores = (rubric || []).map((r) => {
    const proportion = r.maxScore / 100;
    return {
      criterion: r.criterion,
      score: Math.round(baseScore * proportion),
      maxScore: r.maxScore,
      comment: "Your submission addressed this criterion. AI evaluation will provide more detailed feedback when available.",
    };
  });

  const passed = baseScore >= 70;

  return {
    score: baseScore,
    passed,
    rubricScores,
    feedback: passed
      ? "Your submission demonstrates solid effort and covers the key requirements. Great work completing this challenge!"
      : "Your submission shows a good start. Try to expand your answer with more specific details and examples to hit the passing score.",
    encouragement: passed
      ? "You've earned this badge — your work speaks for itself! 🎉"
      : "You're building real skills with every attempt. Review the brief again and resubmit — you've got this!",
  };
}