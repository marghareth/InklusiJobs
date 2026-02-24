// app/api/skill-gap-analysis/route.js
import { NextResponse } from "next/server";
import { callAI } from "@/lib/api";
import { buildSkillGapPrompt, mapAnswersToAIPayload } from "@/lib/ai-prompts";

export async function POST(request) {
  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers) {
      return NextResponse.json(
        { error: "Missing answers payload" },
        { status: 400 }
      );
    }

    // Map raw assessment answers to structured AI payload
    const payload = mapAnswersToAIPayload(answers);

    // Build and send the skill gap prompt
    const prompt = buildSkillGapPrompt(payload);
    const result = await callAI(prompt);

    if (!result?.analysis) {
      throw new Error("AI response missing 'analysis' field");
    }

    return NextResponse.json({
      success: true,
      payload,           // echo back so roadmap route can use it
      ...result,         // { analysis: { criticalGaps, currentStrengths, quickWins, ... } }
    });

  } catch (error) {
    console.error("[skill-gap-analysis] Error:", error);
    return NextResponse.json(
      { error: "Skill gap analysis failed", detail: error.message },
      { status: 500 }
    );
  }
}