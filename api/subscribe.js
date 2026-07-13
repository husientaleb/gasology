// Email signups from the landing-page hero form, stored in Redis.
const REST_URL   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(commands) {
  const r = await fetch(`${REST_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REST_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
  });
  if (!r.ok) throw new Error(`redis_error_${r.status}`);
  return r.json();
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!REST_URL || !REST_TOKEN) return res.status(503).json({ error: "storage_not_configured" });

  // Optional export for the site owner: GET /api/subscribe?token=... with
  // ADMIN_TOKEN set in Vercel env vars. Otherwise browse the Upstash console.
  if (req.method === "GET") {
    if (!process.env.ADMIN_TOKEN || req.query?.token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: "unauthorized" });
    }
    const [g] = await redis([["SMEMBERS", "subscribers"]]);
    const emails = g.result || [];
    return res.status(200).json({ count: emails.length, emails });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const email = String(req.body?.email || "").trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ error: "bad_email" });
  }

  try {
    const [added] = await redis([
      ["SADD", "subscribers", email],
      ["HSET", "subscriber_dates", email, new Date().toISOString()],
    ]);
    return res.status(200).json({ ok: true, new: added.result === 1 });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
