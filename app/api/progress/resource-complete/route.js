// app/api/progress/resource-complete/route.js
import { NextResponse } from "next/server";
import { markResourceComplete, saveQuizAttempt } from "@/lib/supabase-progress";

export async function POST(request) {
  try {
    const { userId, jobId, resourceId, phaseNumber, quizResult } = await request.json();

    if (!userId || !jobId || !resourceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await markResourceComplete(userId, jobId, resourceId, phaseNumber);

    if (quizResult) {
      await saveQuizAttempt(userId, jobId, resourceId, phaseNumber, {
        score:    quizResult.score,
        maxScore: quizResult.maxScore || 100,
        passed:   quizResult.passed,
        answers:  quizResult.answers,
        feedback: quizResult.questionFeedback,
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[progress/resource-complete] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}