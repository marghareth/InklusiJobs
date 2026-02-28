// app/api/quiz/score/route.js
// DEMO VERSION — Supabase saveQuizAttempt replaced with localStorage instruction.
// The CLIENT saves the result to localStorage after receiving it from this route.
// AI scoring logic is unchanged — fallback added for when AI is slow.

import { NextResponse } from "next/server";
import { callAI } from "@/lib/api";

export async function POST(request) {
  try {
    const body = await request.json();
    const { resourceId, jobId, questions, answers, userId } = body;

    if (!questions || !answers) {
      return NextResponse.json(
        { error: "Missing questions or answers" },
        { status: 400 }
      );
    }

    const questionFeedback = [];
    let totalScore = 0;
    let textQuestions = [];

    // ── Score MC questions immediately (rule-based) ──────────────────────────
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const userAnswer = answers[i];

      if (q.type === "single") {
        const correct = userAnswer === q.correct;
        const score = correct ? 20 : 0; // 20 points each (5 questions = 100)
        totalScore += score;
        questionFeedback.push({
          questionIndex: i,
          type: "single",
          correct,
          score,
          maxScore: 20,
          explanation: q.explanation || "",
          feedback: correct
            ? "Correct! Great thinking."
            : `The correct answer was: "${q.options?.find((o) => o.value === q.correct)?.label}"`,
        });
      } else if (q.type === "text") {
        textQuestions.push({ index: i, question: q, answer: userAnswer });
      }
    }

    // ── Score text questions with AI (with fallback) ─────────────────────────
    if (textQuestions.length > 0) {
      for (const tq of textQuestions) {
        let aiResult;
        try {
          const prompt = buildTextScoringPrompt(tq.question, tq.answer);
          aiResult = await callAI(prompt);

          if (!aiResult?.score && aiResult?.score !== 0) {
            throw new Error("Invalid AI response");
          }
        } catch {
          // Fallback: give reasonable partial credit based on answer length
          const wordCount = tq.answer?.trim().split(/\s+/).length || 0;
          aiResult = {
            score: wordCount >= 80 ? 15 : wordCount >= 40 ? 12 : wordCount >= 15 ? 9 : 5,
            feedback: "Your answer shows genuine effort. Keep building on this skill!",
            encouragement: "Well done for attempting the open-ended question — that takes courage!",
          };
        }

        const score = Math.min(aiResult.score || 0, 20);
        totalScore += score;
        questionFeedback.push({
          questionIndex: tq.index,
          type: "text",
          correct: score >= 14,
          score,
          maxScore: 20,
          feedback: aiResult.feedback || "",
          encouragement: aiResult.encouragement || "",
        });
      }
    }

    // Sort feedback back into question order
    questionFeedback.sort((a, b) => a.questionIndex - b.questionIndex);

    const finalScore = Math.round(totalScore);
    const passed = finalScore >= 60;
    const encouragement = passed
      ? "Great job! You've shown a solid understanding of this topic. 🎉"
      : "Keep going — review the resource and try again. You're building real skills!";

    const result = {
      score: finalScore,
      maxScore: 100,
      passed,
      questionFeedback,
      encouragement,
      answers,
      resourceId,
      jobId,
      userId,
      // Tell the client to save this to localStorage
      saveToLocalStorage: true,
      localStorageKey: `inklusi_quiz_attempts_${userId}_${jobId}`,
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error("[quiz/score] Error:", error);
    return NextResponse.json(
      { error: "Scoring failed", detail: error.message },
      { status: 500 }
    );
  }
}

// ─── TEXT SCORING PROMPT ──────────────────────────────────────────────────────

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

ANTI-BIAS RULE: Do NOT penalise for informal language, Filipino English, or brevity if the answer is correct.
Give credit for correct thinking even if imperfectly expressed.

Return ONLY this JSON — no markdown, no extra text:
{
  "score": 16,
  "feedback": "Specific, constructive 1-2 sentence feedback on what they did well and what to improve",
  "encouragement": "Warm 1 sentence — specific to their answer, not generic"
}`;
}