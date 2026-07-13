const ALLOWED_ORIGINS = ["https://gasology.co", "https://www.gasology.co"];

// Per-IP rate limiting via Redis: generous enough for heavy human use of the
// app, tight enough to stop scripts from draining the Anthropic key.
// Fails open if Redis is unreachable — real users are never locked out.
const REST_URL   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const DAY_LIMIT = 300, MINUTE_LIMIT = 20;

async function rateLimited(ip) {
  if (!REST_URL || !REST_TOKEN) return false;
  try {
    const day = new Date().toISOString().slice(0, 10);
    const minute = Math.floor(Date.now() / 60000);
    const r = await fetch(`${REST_URL}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${REST_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", `rl:d:${ip}:${day}`],
        ["EXPIRE", `rl:d:${ip}:${day}`, "90000"],
        ["INCR", `rl:m:${ip}:${minute}`],
        ["EXPIRE", `rl:m:${ip}:${minute}`, "90"],
      ]),
    });
    if (!r.ok) return false;
    const [d, , m] = await r.json();
    return d.result > DAY_LIMIT || m.result > MINUTE_LIMIT;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: { type: "missing_api_key", message: "ANTHROPIC_API_KEY not set in Vercel environment variables." } });
  }

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
  if (await rateLimited(ip)) {
    return res.status(429).json({ error: { type: "rate_limit_error", message: "You've reached the free usage limit — please slow down or try again tomorrow." } });
  }
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify(req.body),
    });

    if (req.body?.stream) {
      res.status(response.status);
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      return res.end();
    }

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: { type: "proxy_error", message: err.message } });
  }
}
