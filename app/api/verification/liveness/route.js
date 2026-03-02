// app/api/verification/liveness/route.js
// Analyzes a webcam frame to detect face + PWD ID card being held.
// Uses same fetch() + GEMINI_API_KEY pattern as analyze-document/route.js

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { frameBase64 } = await request.json();

    if (!frameBase64) {
      return NextResponse.json({ error: "No frame provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not set in .env.local");

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

    const prompt = `You are analyzing a webcam frame for a Philippine PWD (Person with Disability) ID liveness check.

Look carefully at this image and determine:
1. Is a human face clearly visible in the frame?
2. Is the person holding or showing any rectangular card near their face or upper body?
   - Count ANY card-shaped object being held — ID card, PWD card, credit card, any card.
   - Do NOT require it to say "PWD" on it. Just detect a card is present and being held.
   - Even a partially visible card counts.

Be generous — if there is any card-shaped object visible and being held, set idCardVisible to true.

Return ONLY valid JSON. No markdown, no explanation, no extra text:
{
  "faceVisible": true or false,
  "idCardVisible": true or false,
  "holdingId": true or false,
  "faceConfidence": number 0-100,
  "idConfidence": number 0-100,
  "tip": "one short actionable tip if face or ID is missing, empty string if both are detected"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: "image/jpeg", data: frameBase64 } },
              { text: prompt },
            ],
          }],
          generationConfig: {
            temperature:     0.1,
            maxOutputTokens: 256,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini ${response.status}: ${errorText.slice(0, 200)}`);
    }

    const data  = await response.json();
    const raw   = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const clean = raw.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();

    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);

  } catch (err) {
    console.error("[liveness] Error:", err.message);
    return NextResponse.json({
      faceVisible:    false,
      idCardVisible:  false,
      holdingId:      false,
      faceConfidence: 0,
      idConfidence:   0,
      tip: "Detection unavailable — you can still capture manually.",
      error: true,
    });
  }
}