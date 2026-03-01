// lib/api.js
// Gemini AI integration for InklusiJobs — Assessment, Roadmap, Challenges
// Uses a SEPARATE key from verification (GEMINI_ASSESSMENT_API_KEY)
// Used by: /api/skill-gap-analysis, /api/roadmap/generate,
//          /api/score, /api/quiz/score, /api/challenges/evaluate
//
// Fallback chain:
//   1. Gemini (GEMINI_ASSESSMENT_API_KEY)
//   2. OpenRouter (OPENROUTER_API_KEY)  ← backup if Gemini fails
//   3. Throws error (caller handles mock data)

const GEMINI_API_URL    = "https://generativelanguage.googleapis.com/v1beta/models";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// ── Gemini ────────────────────────────────────────────────────────────────────
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_ASSESSMENT_API_KEY;
  const model  = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey) throw new Error("GEMINI_ASSESSMENT_API_KEY is not set in .env.local");

  const response = await fetch(
    `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature:     0.7,
          maxOutputTokens: 8192,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
  }

  const data    = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error("Gemini returned an empty response.");

  return rawText;
}

// ── OpenRouter ────────────────────────────────────────────────────────────────
async function callOpenRouter(prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  // You can change this model to any OpenRouter model you prefer:
  // e.g. "google/gemini-2.5-flash", "anthropic/claude-3-haiku", "mistralai/mistral-7b-instruct"
  const model  = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat-v3-0324";

  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set in .env.local");

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${apiKey}`,
      // OpenRouter recommends these headers to identify your app
      "HTTP-Referer":  "https://inklusijobs.com",
      "X-Title":       "InklusiJobs",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature:      0.7,
      max_tokens:       8192,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${errorBody}`);
  }

  const data    = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;
  if (!rawText) throw new Error("OpenRouter returned an empty response.");

  return rawText;
}

// ── JSON cleaner (works for both Gemini and OpenRouter responses) ──────────────
function parseAIResponse(rawText) {
  const cleaned = rawText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error("[callAI] Failed to parse AI response as JSON:", cleaned);
    throw new Error("AI response was not valid JSON. Raw response logged above.");
  }
}

// ── Main export — tries Gemini first, falls back to OpenRouter ────────────────
/**
 * Calls Gemini first. If Gemini fails for any reason (API error, quota,
 * network issue), automatically retries with OpenRouter.
 *
 * Your prompts instruct the AI to respond in JSON — this handles stripping
 * any markdown fences the model sometimes wraps around the JSON.
 *
 * @param {string} prompt  - The full prompt string from ai-prompts.js
 * @returns {Object}       - Parsed JSON object from the AI response
 * @throws                 - Throws only if BOTH Gemini and OpenRouter fail
 */
export async function callAI(prompt) {
  // ── Step 1: Try Gemini ──
  try {
    console.log("[callAI] Trying Gemini...");
    const rawText = await callGemini(prompt);
    console.log("[callAI] Gemini succeeded ✓");
    return parseAIResponse(rawText);
  } catch (geminiError) {
    // Log the Gemini error but don't throw — try OpenRouter next
    console.warn("[callAI] Gemini failed, trying OpenRouter as fallback...");
    console.warn("[callAI] Gemini error:", geminiError.message);
  }

  // ── Step 2: Try OpenRouter ──
  try {
    console.log("[callAI] Trying OpenRouter...");
    const rawText = await callOpenRouter(prompt);
    console.log("[callAI] OpenRouter succeeded ✓");
    return parseAIResponse(rawText);
  } catch (openRouterError) {
    console.error("[callAI] OpenRouter also failed:", openRouterError.message);
    // Both failed — throw so the caller can use mock data
    throw new Error(
      `Both Gemini and OpenRouter failed. Gemini: ${openRouterError.message}`
    );
  }
}