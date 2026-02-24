// app/api/roadmap/generate/route.js
import { NextResponse } from "next/server";
import { callAI } from "@/lib/api";
import { buildRoadmapPrompt } from "@/lib/ai-prompts";

export async function POST(request) {
  try {
    const body = await request.json();
    const { payload, analysis } = body;

    if (!payload || !analysis) {
      return NextResponse.json(
        { error: "Missing payload or analysis. Call /api/skill-gap-analysis first." },
        { status: 400 }
      );
    }

    const prompt = buildRoadmapPrompt(payload, analysis);
    const result = await callAI(prompt);

    if (!result?.roadmap) {
      throw new Error("AI response missing 'roadmap' field");
    }

    return NextResponse.json({
      success: true,
      ...result, // { roadmap: { phases, totalWeeks, ... } }
    });

  } catch (error) {
    console.error("[roadmap/generate] Error:", error);
    return NextResponse.json(
      { error: "Roadmap generation failed", detail: error.message },
      { status: 500 }
    );
  }
}