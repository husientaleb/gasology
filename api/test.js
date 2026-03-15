export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const keyPresent = !!process.env.ANTHROPIC_API_KEY;
  const keyPreview = keyPresent
    ? `${process.env.ANTHROPIC_API_KEY.slice(0, 7)}...${process.env.ANTHROPIC_API_KEY.slice(-4)}`
    : "NOT SET";

  // Try a minimal real API call
  let apiResult = null;
  let apiError = null;

  if (keyPresent) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 20,
          messages: [{ role: "user", content: "Say OK" }],
        }),
      });
      const data = await response.json();
      apiResult = { status: response.status, content: data.content?.[0]?.text || null, error: data.error || null };
    } catch (e) {
      apiError = e.message;
    }
  }

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    env: process.env.VERCEL_ENV || "unknown",
    apiKeyPresent: keyPresent,
    apiKeyPreview: keyPreview,
    apiCallResult: apiResult,
    apiCallError: apiError,
    message: keyPresent
      ? (apiResult?.status === 200 ? "✅ Everything working!" : `⚠️ Key present but API returned ${apiResult?.status}`)
      : "❌ ANTHROPIC_API_KEY not set in Vercel environment variables",
  });
}
