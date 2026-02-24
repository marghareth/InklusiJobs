// app/api/score/route.js
// Scores user assessment answers against job requirements using AI
// Returns per-skill scores, overall score, pass/fail, and feedback

import { NextResponse } from "next/server";
import { callAI } from "@/lib/api";
import { buildScoringPrompt } from "@/lib/ai-prompts";
import { getJob } from "@/lib/jobs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { answers, jobSelection } = body;

    if (!answers || !jobSelection?.trackId || !jobSelection?.jobId) {
      return NextResponse.json(
        { error: "Missing answers or job selection" },
        { status: 400 }
      );
    }

    const job = getJob(jobSelection.trackId, jobSelection.jobId);
    if (!job) {
      return NextResponse.json(
        { error: "Invalid job selection" },
        { status: 400 }
      );
    }

    const prompt = buildScoringPrompt(answers, job, jobSelection);
    const result = await callAI(prompt);

    if (!result?.scoring) {
      throw new Error("AI response missing 'scoring' field");
    }

    return NextResponse.json({
      success: true,
      jobSelection,
      job: {
        id: job.id,
        title: job.title,
        company: job.company,
        salaryRange: job.salaryRange,
        pwdAccommodations: job.pwdAccommodations,
      },
      ...result, // { scoring: { overallScore, qualified, skillScores, ... } }
    });

  } catch (error) {
    console.error("[score] Error:", error);
    return NextResponse.json(
      { error: "Scoring failed", detail: error.message },
      { status: 500 }
    );
  }
}