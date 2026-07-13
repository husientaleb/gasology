// Daily poll vote store backed by Upstash Redis (Vercel Marketplace).
// Works with either env var naming: KV_REST_API_* (Vercel KV integration)
// or UPSTASH_REDIS_REST_* (Upstash integration).
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

// HGETALL returns a flat [field, value, ...] array over REST.
function toCounts(flat) {
  const counts = [0, 0, 0, 0];
  if (Array.isArray(flat)) {
    for (let i = 0; i < flat.length; i += 2) {
      const idx = Number(flat[i]);
      if (idx >= 0 && idx < 4) counts[idx] = Number(flat[i + 1]) || 0;
    }
  }
  return counts;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!REST_URL || !REST_TOKEN) {
    return res.status(503).json({ error: "storage_not_configured" });
  }

  const day = req.method === "GET" ? req.query?.day : req.body?.day;
  if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(day || "")) {
    return res.status(400).json({ error: "bad_day" });
  }
  const key = `poll:${day}`;

  try {
    if (req.method === "GET") {
      const [g] = await redis([["HGETALL", key]]);
      const counts = toCounts(g.result);
      return res.status(200).json({ counts, total: counts.reduce((a, b) => a + b, 0) });
    }

    if (req.method === "POST") {
      const choice = Number(req.body?.choice);
      if (!Number.isInteger(choice) || choice < 0 || choice > 3) {
        return res.status(400).json({ error: "bad_choice" });
      }
      const [, g] = await redis([
        ["HINCRBY", key, String(choice), 1],
        ["HGETALL", key],
        ["EXPIRE", key, String(60 * 60 * 24 * 14)],
      ]);
      const counts = toCounts(g.result);
      return res.status(200).json({ counts, total: counts.reduce((a, b) => a + b, 0) });
    }

    return res.status(405).json({ error: "method_not_allowed" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
