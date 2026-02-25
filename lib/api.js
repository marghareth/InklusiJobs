
// lib/api.js
// OpenRouter + DeepSeek AI integration for InklusiJobs
// Used by: /api/skill-gap-analysis and /api/roadmap/generate

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-chat-v3.1"; // Latest DeepSeek model as of June 2024

/**
 * Calls DeepSeek via OpenRouter and returns a parsed JS object.
 * Your prompts instruct the AI to respond in JSON — this handles stripping
 * any markdown fences the model sometimes wraps around the JSON.
 *
 * @param {string} prompt  - The full prompt string from ai-prompts.js
 * @returns {Object}       - Parsed JSON object from the AI response
 * @throws                 - Throws if the API call fails or JSON can't be parsed
 */
export async function callAI(prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables.");
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://inklusijobs.com", // Shown in OpenRouter dashboard
      "X-Title": "InklusiJobs",                  // Shown in OpenRouter dashboard
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,       // Balanced creativity vs consistency
      max_tokens: 4096,       // Enough for full roadmap JSON
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();

  // Extract the text content from OpenRouter's response structure
  const rawText = data?.choices?.[0]?.message?.content;

  if (!rawText) {
    throw new Error("OpenRouter returned an empty response.");
  }

  // Strip markdown fences if the model wraps the JSON in ```json ... ```
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
