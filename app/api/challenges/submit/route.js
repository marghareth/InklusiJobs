// app/api/challenges/submit/route.js
// DEMO VERSION — Supabase + Notion removed, replaced with localStorage
// Saves challenge submission to localStorage and returns a submission ID.

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      challengeId,
      submissionText,
      submissionUrl,
      submissionType,
      userId,
      jobId,
      phaseNumber,
    } = await request.json();

    // Basic validation
    if (!challengeId || (!submissionText && !submissionUrl)) {
      return NextResponse.json(
        { error: "Missing challengeId or submission content" },
        { status: 400 }
      );
    }

    // Build the submission object
    const submissionId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const submission = {
      id: submissionId,
      challengeId,
      userId: userId || "demo_user",
      jobId: jobId || "unknown",
      phaseNumber: phaseNumber || 1,
      submissionText: submissionText || null,
      submissionUrl: submissionUrl || null,
      submissionType: submissionType || "text",
      status: "pending", // will be updated to "approved" or "rejected" after evaluation
      submittedAt: new Date().toISOString(),
    };

    // NOTE: We return the submission to the client.
    // The client (or the evaluate route) saves it to localStorage.
    // API routes run server-side and can't access localStorage directly —
    // that's why saving to localStorage is handled client-side or in evaluate/route.js.

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      submission,
    });

  } catch (err) {
    console.error("[challenges/submit] Error:", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}