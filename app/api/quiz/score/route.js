// app/api/quiz/score/route.js
import { NextResponse } from "next/server";
import { callAI } from "@/lib/api";
import { saveQuizAttempt } from "@/lib/supabase-progress";

export async function POST(request) {
  try {
    const body = await request.json();
    const { resourceId, jobId, questions, answers, userId } = body;

    if (!questions || !answers) {
      return NextResponse.json({ error: "Missing questions or answers" }, { status: 400 });
    }

    const questionFeedback = [];
    let totalScore = 0;
    let textQuestions = [];

    // ── Score MC questions immediately (rule-based) ─────────────────────────
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const userAnswer = answers[i];

      if (q.type === "single") {
        const correct = userAnswer === q.correct;
        const score   = correct ? 20 : 0; // 20 points each (5 questions = 100)
        totalScore   += score;
        questionFeedback.push({
          questionIndex: i,
          type:          "single",
          correct,
          score,
          maxScore:      20,
          explanation:   q.explanation || "",
          feedback:      correct ? "Correct! Great thinking." : `The correct answer was: "${q.options?.find(o => o.value === q.correct)?.label}"`,
        });
      } else if (q.type === "text") {
        textQuestions.push({ index: i, question: q, answer: userAnswer });
      }
    }

    // ── Score text questions with AI ────────────────────────────────────────
    if (textQuestions.length > 0) {
      for (const tq of textQuestions) {
        const prompt = buildTextScoringPrompt(tq.question, tq.answer);
        let aiResult;
        try {
          aiResult = await callAI(prompt);
        } catch {
          // Fallback: give partial credit for attempt
          aiResult = {
            score: tq.answer?.trim().length > 50 ? 14 : 8,
            feedback: "Your answer shows effort. Keep practising this skill.",
            encouragement: "Well done for attempting the open-ended question!",
          };
        }

        const score = Math.min(aiResult.score || 0, 20);
        totalScore += score;
        questionFeedback.push({
          questionIndex: tq.index,
          type:          "text",
          correct:       score >= 14,
          score,
          maxScore:      20,
          feedback:      aiResult.feedback || "",
          encouragement: aiResult.encouragement || "",
        });
      }
    }

    // Sort feedback back into question order
    questionFeedback.sort((a, b) => a.questionIndex - b.questionIndex);

    const finalScore  = Math.round(totalScore);
    const passed      = finalScore >= 60; // 60% passing for quizzes
    const encouragement = passed
      ? "Great job! You've shown a solid understanding of this topic."
      : "Keep going — review the resource and try again. You're building real skills.";

    const result = {
      score:            finalScore,
      maxScore:         100,
      passed,
      questionFeedback,
      encouragement,
      answers,
    };

    // Save to Supabase if userId provided
    if (userId && jobId && resourceId) {
      try {
        const phaseNumber = questions[0]?.phaseNumber || 1;
        await saveQuizAttempt(userId, jobId, resourceId, phaseNumber, {
          ...result,
          feedback: questionFeedback,
        });
      } catch (e) {
        console.error("[quiz/score] Supabase save error:", e);
      }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("[quiz/score] Error:", error);
    return NextResponse.json({ error: "Scoring failed", detail: error.message }, { status: 500 });
  }
}

function buildTextScoringPrompt(question, answer) {
  return `You are a fair, encouraging skills evaluator for InklusiJobs — a job platform for PWDs in the Philippines.

Score this open-ended quiz answer out of 20 points.

QUESTION: ${question.question}

SCORING RUBRIC: ${question.rubric || "Evaluate quality of thinking, practical knowledge, and communication clarity."}

STUDENT'S ANSWER:
"${answer || "(no answer provided)"}"

SCORING GUIDE:
- 18–20: Exceptional — shows deep understanding, specific and practical, well-structured
- 14–17: Good — correct approach, mostly complete, minor gaps
- 10–13: Developing — shows some understanding but missing key elements
- 6–9:   Beginning — attempt made but significant gaps in knowledge
- 0–5:   Insufficient — no answer or completely off-topic

ANTI-BIAS: Do NOT penalise for informal language, Filipino English, or brevity if the answer is correct.
Give credit for correct thinking even if imperfectly expressed.

Return ONLY this JSON:
{
  "score": 16,
  "feedback": "Specific, constructive 1-2 sentence feedback on what they did well and what to improve",
  "encouragement": "Warm 1 sentence — specific to their answer, not generic"
}`;
}