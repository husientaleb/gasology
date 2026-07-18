// Per-route SEO metadata, shared by the build-time prerender script
// (scripts/prerender.mjs) and the SPA router (Root.jsx), which keeps
// document.title / meta description in sync during client-side navigation.
// Per-program pages build their metadata from program data instead.

export const SITE_URL = "https://www.gasology.co";

export const ROUTE_META = {
  "/": {
    title: "Gasology — The Complete Anesthesia Hub | Board Prep, Jobs & Directories",
    description: "Free anesthesia hub for residents and physicians: AI oral board prep, a national jobs board, residency and fellowship directories, journal digests, and conference calendars.",
  },
  "/app": {
    title: "AI Anesthesia Board Prep — Oral Board Examiner, Quizzes & Drug Reference | Gasology",
    description: "Practice ABA oral boards with an AI examiner. Voice mode, scoring, board-style MCQs, quick review summaries, and an anesthesia drug reference — all free.",
  },
  "/residency": {
    title: "Anesthesiology Residency Directory — 80+ ACGME Programs by State | Gasology",
    description: "Browse every ACGME-accredited anesthesiology residency program in the US. Program directors, contact emails, websites, and one-click outreach, filterable by state.",
  },
  "/fellowship": {
    title: "Anesthesiology Fellowship Directory — Programs by Subspecialty & State | Gasology",
    description: "40+ anesthesiology fellowships across Regional, Cardiac, Pain, Neuro, Pediatric, Critical Care, OB, Global Health, and Research — with directors, contacts, and websites.",
  },
  "/conferences": {
    title: "Anesthesia Conferences 2026 — Dates, Locations & CME Credits | Gasology",
    description: "Every major anesthesiology conference in 2026 — ASA, ASRA, SOAP, IARS, SPA and more, with dates, locations, CME credits, and registration links.",
  },
  "/journals": {
    title: "Anesthesia Journals & High-Yield Articles | Gasology",
    description: "AI-curated high-yield articles from Anesthesiology, Anesthesia & Analgesia, BJA, and RAPM, with board-relevant summaries for busy physicians.",
  },
  "/digest": {
    title: "Weekly Anesthesia Journal Digest — TL;DR Summaries | Gasology",
    description: "AI scans the four major anesthesiology journals every week and delivers TL;DR summaries and practice implications. Refreshes every Monday.",
  },
  "/case": {
    title: "Anesthesia Case of the Day — Daily Clinical Case Quiz | Gasology",
    description: "A daily gamified anesthesiology clinical case: five timed board-style questions with streak bonuses, scoring, and clinical pearls after each answer.",
  },
  "/jobs": {
    title: "Anesthesiologist Jobs Board — Weekly Openings Across the US | Gasology",
    description: "The first anesthesia-specific job board. Weekly-updated anesthesiologist openings across the US — academic, private practice, locums, and subspecialty positions.",
  },
  "/contact": {
    title: "Contact Us | Gasology",
    description: "Questions, feedback, or partnership ideas? Get in touch with the Gasology team.",
  },
};

export const residencyMeta = (p) => ({
  title: `${p.program} — Anesthesiology Residency in ${p.city}, ${p.state} | Gasology`,
  description: `${p.institution} anesthesiology residency program in ${p.city}, ${p.state} (${p.size}). Program director, contact information, website, and application outreach tools.`,
});

export const fellowshipMeta = (f) => ({
  title: `${f.type} Fellowship at ${f.institution} — ${f.city}, ${f.state} | Gasology`,
  description: `${f.type} fellowship at ${f.institution} in ${f.city}, ${f.state} (${f.duration}). Program director, contact information, and application outreach tools.`,
});
