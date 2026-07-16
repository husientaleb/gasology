// Contact-form messages from the Contact page, stored in Redis and
// forwarded by email via Resend (when RESEND_API_KEY + CONTACT_EMAIL are set).
const REST_URL   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const esc = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Email the site owner about a new message. Failures are swallowed — the
// message is already safe in Redis, so email is best-effort.
async function notifyByEmail({ name, email, topic, message, date }) {
  const key = process.env.RESEND_API_KEY;
  const to  = process.env.CONTACT_EMAIL;
  if (!key || !to) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Gasology Contact <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `📬 Gasology contact: ${topic || "General"} — ${name || email}`,
        html: `<div style="font-family:sans-serif;max-width:600px">
          <h2 style="margin:0 0 12px">New contact message</h2>
          <p style="margin:4px 0"><b>From:</b> ${esc(name || "(no name)")} &lt;${esc(email)}&gt;</p>
          <p style="margin:4px 0"><b>Topic:</b> ${esc(topic || "—")}</p>
          <p style="margin:4px 0"><b>Date:</b> ${esc(date)}</p>
          <hr style="border:none;border-top:1px solid #ddd;margin:14px 0">
          <p style="white-space:pre-wrap;line-height:1.6">${esc(message)}</p>
        </div>`,
      }),
    });
  } catch { /* best-effort */ }
}

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

  // Export for the site owner: GET /api/contact?token=... with ADMIN_TOKEN set
  // in Vercel env vars. Otherwise browse the Upstash console (key: contact_messages).
  if (req.method === "GET") {
    if (!process.env.ADMIN_TOKEN || req.query?.token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: "unauthorized" });
    }
    const [g] = await redis([["LRANGE", "contact_messages", 0, -1]]);
    const messages = (g.result || []).map(m => { try { return JSON.parse(m); } catch { return m; } });
    return res.status(200).json({ count: messages.length, messages });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const name    = String(req.body?.name    || "").trim().slice(0, 120);
  const email   = String(req.body?.email   || "").trim().toLowerCase();
  const topic   = String(req.body?.topic   || "").trim().slice(0, 60);
  const message = String(req.body?.message || "").trim().slice(0, 4000);

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ error: "bad_email" });
  }
  if (!message) return res.status(400).json({ error: "empty_message" });

  try {
    const entry = { name, email, topic, message, date: new Date().toISOString() };
    await redis([
      ["LPUSH", "contact_messages", JSON.stringify(entry)],
      ["LTRIM", "contact_messages", 0, 999],
    ]);
    await notifyByEmail(entry);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
