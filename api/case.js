// Case of the Day, generated once per day+level and served to everyone from
// Redis. First player of the day pays the ~10s generation; the rest get it
// instantly, and the Anthropic bill drops to at most 5 calls per day.
const REST_URL   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Must stay in sync with CASE_TOPICS in src/CaseOfTheDay.jsx — the client
// derives the same topic from the same seed for the intro screen.
const CASE_TOPICS = [
  "Difficult Airway Management",
  "Cardiac Anesthesia — Severe Aortic Stenosis",
  "Obstetric Emergency — Preeclampsia with Severe Features",
  "Pediatric Anesthesia — RSI in a toddler",
  "Malignant Hyperthermia Crisis",
  "Local Anesthetic Systemic Toxicity (LAST)",
  "Trauma — Hemorrhagic Shock & Damage Control",
  "Neuroanesthesia — Elevated ICP Management",
  "One-Lung Ventilation — Thoracic Surgery",
  "ARDS — Lung Protective Ventilation",
  "Spinal Anesthesia for C-Section",
  "Interscalene Block & Complications",
  "Awake Fiberoptic Intubation",
  "Rapid Sequence Induction — Full Stomach",
  "Post-op Respiratory Failure in PACU",
  "Pheochromocytoma Resection",
  "Jehovah's Witness — Bloodless Surgery",
  "End-Stage Renal Disease — Drug Dosing",
  "Morbid Obesity — Airway & Ventilation",
  "Pediatric MH Susceptibility",
  "Epidural Hematoma — Anticoagulation",
  "Burns Anesthesia",
  "Cardiac Tamponade",
  "Failed Spinal — Convert to GA",
  "Anaphylaxis on Induction",
  "Robotic Surgery — Steep Trendelenburg",
  "Thyroid Storm Perioperatively",
  "Suxamethonium Apnoea",
  "Post-Dural Puncture Headache",
  "Pain Crisis — Opioid Tolerant Patient",
];

const LEVELS = ["Intern", "CA-1", "CA-2", "CA-3", "Attending"];

const CASE_PROMPT = (topic, level, seed) => `You are an ABA oral board examiner. Today's seed: ${seed}.

Generate a clinical anesthesia case about: "${topic}"
Difficulty level: ${level}

Return ONLY valid JSON (no markdown, no preamble):
{
  "stem": "2-3 sentence clinical scenario with patient demographics, presentation, and key vitals/labs",
  "questions": [
    {
      "id": 1,
      "text": "Question text (clinical, specific, board-style)",
      "options": ["A. Option text", "B. Option text", "C. Option text", "D. Option text"],
      "correct": 0,
      "explanation": "2-3 sentence explanation of why this is correct and why others are wrong. Include a clinical pearl.",
      "pearl": "One memorable high-yield teaching point in one sentence"
    },
    { "id": 2, ... },
    { "id": 3, ... },
    { "id": 4, ... },
    { "id": 5, ... }
  ]
}

Make questions progressively harder (Q1 easiest, Q5 hardest). Each question must be clinically distinct — cover different aspects: pharmacology, physiology, management, complications, guidelines. Options must be plausible. One clearly correct answer per question.`;

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
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });

  const { day, level } = req.query || {};
  if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(day || "")) return res.status(400).json({ error: "bad_day" });
  if (!LEVELS.includes(level)) return res.status(400).json({ error: "bad_level" });

  // The client seed uses getMonth() (0-based). Reject implausible dates so
  // arbitrary keys can't be used to farm generations.
  const [y, m, d] = day.split("-").map(Number);
  const target = new Date(y, m, d);
  if (isNaN(target) || Math.abs(target.getTime() - Date.now()) > 3 * 86400000) {
    return res.status(400).json({ error: "bad_day" });
  }

  const key = `case:${day}:${level}`;
  const hasRedis = Boolean(REST_URL && REST_TOKEN);

  if (hasRedis) {
    try {
      const [g] = await redis([["GET", key]]);
      if (g.result) {
        res.setHeader("x-case-cache", "hit");
        return res.status(200).json(JSON.parse(g.result));
      }
    } catch {} // cache down — fall through to generation
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });
  }

  // Same topic derivation as the client: sum of seed parts mod topic count.
  const topic = CASE_TOPICS[day.split("-").reduce((a, b) => a + parseInt(b), 0) % CASE_TOPICS.length];

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 4000,
        thinking: { type: "disabled" },
        system: "You are an ABA oral board examiner. Return ONLY valid JSON. No markdown fences. No extra text before or after the JSON.",
        messages: [{ role: "user", content: CASE_PROMPT(topic, level, day) }],
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: data?.error?.message || "generation_failed" });

    const raw = (data.content || []).map(b => b.text || "").join("");
    const clean = raw.replace(/```json|```/g, "").trim();
    let parsed;
    try { parsed = JSON.parse(clean); } catch { return res.status(502).json({ error: "bad_generation" }); }
    if (!parsed.stem || !Array.isArray(parsed.questions) || parsed.questions.length < 5) {
      return res.status(502).json({ error: "bad_generation" });
    }

    if (hasRedis) {
      // NX: if a concurrent first player already cached it, keep theirs.
      try { await redis([["SET", key, JSON.stringify(parsed), "NX", "EX", String(60 * 60 * 48)]]); } catch {}
    }
    res.setHeader("x-case-cache", "miss");
    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
