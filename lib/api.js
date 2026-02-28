// lib/api.js
// Gemini AI integration for InklusiJobs — Assessment, Roadmap, Challenges
// Uses a SEPARATE key from verification (GEMINI_ASSESSMENT_API_KEY)
// Used by: /api/skill-gap-analysis, /api/roadmap/generate,
//          /api/score, /api/quiz/score, /api/challenges/evaluate

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";


/**
 * Calls Gemini directly and returns a parsed JS object.
 * Your prompts instruct the AI to respond in JSON — this handles stripping
 * any markdown fences the model sometimes wraps around the JSON.
 *
 * @param {string} prompt  - The full prompt string from ai-prompts.js
 * @returns {Object}       - Parsed JSON object from the AI response
 * @throws                 - Throws if the API call fails or JSON can't be parsed
 */
export async function callAI(prompt) {
  const apiKey = process.env.GEMINI_ASSESSMENT_API_KEY;
  const model  = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    throw new Error("GEMINI_ASSESSMENT_API_KEY is not set in .env.local");
  }

  const response = await fetch(
    `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature:     0.7,   // Balanced creativity vs consistency
          maxOutputTokens: 8192,  // Increased — scoring + roadmap responses can be large
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();

  // Extract text from Gemini's response structure
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("Gemini returned an empty response.");
  }

  // Strip markdown fences if Gemini wraps the JSON in ```json ... ```
  const cleaned = rawText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error("[callAI] Failed to parse Gemini response as JSON:", cleaned);
    throw new Error("AI response was not valid JSON. Raw response logged above.");
  }
}