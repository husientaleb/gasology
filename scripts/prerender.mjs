// Post-build prerendering for SEO. Runs after `vite build` (see package.json).
//
// The SPA serves an empty <div id="root"> to crawlers, so nothing gets
// indexed. This script clones dist/index.html into one static HTML file per
// route (dist/<route>/index.html), giving every page:
//   - a unique <title>, meta description, og:/twitter: tags, and canonical URL
//   - real content inside #root (h1, program listings, crawlable <a> links)
// React replaces the static content on hydration, so the app is unaffected.
// It also emits dist/sitemap.xml covering every route.
//
// Vercel serves these static files before the SPA rewrite in vercel.json, so
// crawlers and first visits get full HTML; client-side navigation stays SPA.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  RESIDENCY_PROGRAMS, FELLOWSHIPS, FELLOWSHIP_TYPES,
  residencySlug, fellowshipSlug,
} from "../src/data/programs.js";
import { ROUTE_META, SITE_URL, residencyMeta, fellowshipMeta } from "../src/data/seo.js";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));
const template = readFileSync(join(DIST, "index.html"), "utf8");
if (!template.includes('<div id="root"></div>')) {
  throw new Error("dist/index.html has no empty #root div — prerender injection point missing");
}

const esc = (s) => String(s)
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

// ── HEAD REWRITING ───────────────────────────────────────────────────────────
function withHead(html, { title, description, path }) {
  const url = SITE_URL + (path === "/" ? "/" : path);
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${esc(url)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace("</head>", `  <link rel="canonical" href="${esc(url)}" />\n  </head>`);
}

// ── STATIC BODY CONTENT ──────────────────────────────────────────────────────
// Simple inline-styled HTML matching the site's dark theme, visible only
// until React hydrates (and to crawlers). Every page carries the site-wide
// nav so crawlers can reach every section from any entry point.
const NAV_LINKS = Object.entries({
  "/": "Home", "/app": "AI Board Prep", "/residency": "Residency Directory",
  "/fellowship": "Fellowship Directory", "/jobs": "Jobs Board",
  "/conferences": "Conferences", "/journals": "Journals",
  "/digest": "Weekly Digest", "/case": "Case of the Day", "/contact": "Contact",
});

const A = (href, text) => `<a href="${esc(href)}" style="color:#00c9b1">${esc(text)}</a>`;

function shell(inner) {
  const nav = NAV_LINKS.map(([href, label]) => A(href, label)).join(" · ");
  return `<div style="background:#08172e;color:#f0f6ff;min-height:100vh;padding:32px 24px;font-family:Georgia,serif;line-height:1.6">
    <nav style="font-size:14px;margin-bottom:28px">${nav}</nav>
    <main style="max-width:860px">${inner}</main>
  </div>`;
}

const residencyLi = (p) =>
  `<li>${A(`/residency/${residencySlug(p)}`, `${p.program} — ${p.institution}`)} (${esc(p.city)}, ${esc(p.state)} · ${esc(p.size)})</li>`;
const fellowshipLi = (f) =>
  `<li>${A(`/fellowship/${fellowshipSlug(f)}`, `${f.type} — ${f.institution}`)} (${esc(f.city)}, ${esc(f.state)} · ${esc(f.duration)})</li>`;

function residencyDirectoryBody() {
  return shell(`
    <h1>Anesthesiology Residency Directory — ${RESIDENCY_PROGRAMS.length} ACGME-Accredited US Programs</h1>
    <p>Every ACGME-accredited anesthesiology residency program in the United States, with program directors, contact emails, websites, and one-click outreach. Filter by state or search by institution in the interactive directory.</p>
    <ul>${RESIDENCY_PROGRAMS.map(residencyLi).join("\n")}</ul>`);
}

function fellowshipDirectoryBody() {
  const byType = FELLOWSHIP_TYPES.map((t) => `
    <h2>${esc(t)} Fellowships</h2>
    <ul>${FELLOWSHIPS.filter((f) => f.type === t).map(fellowshipLi).join("\n")}</ul>`).join("\n");
  return shell(`
    <h1>Anesthesiology Fellowship Directory — ${FELLOWSHIPS.length} Programs Across ${FELLOWSHIP_TYPES.length} Subspecialties</h1>
    <p>Anesthesiology fellowship programs across the United States — Regional, Cardiac, Pain, Neuro, Pediatric, Critical Care, Obstetric, Global Health, and Research — with directors, contact information, and websites.</p>
    ${byType}`);
}

function programBody(kind, p) {
  const isRes = kind === "residency";
  const h1 = isRes
    ? `${p.program} — Anesthesiology Residency in ${p.city}, ${p.state}`
    : `${p.type} Fellowship at ${p.institution} — ${p.city}, ${p.state}`;
  const facts = isRes
    ? [["Institution", p.institution], ["Location", `${p.city}, ${p.state}`], ["Program type", p.size], ["Program director", p.director], ["Accreditation", "ACGME"]]
    : [["Institution", p.institution], ["Location", `${p.city}, ${p.state}`], ["Subspecialty", p.type], ["Duration", p.duration], ["Program director", p.director]];
  return shell(`
    <h1>${esc(h1)}</h1>
    <p>${esc(isRes
      ? `${p.institution} offers an ACGME-accredited anesthesiology residency program in ${p.city}, ${p.state}.`
      : `${p.institution} offers a ${p.duration} ${p.type} fellowship in ${p.city}, ${p.state}.`)}
      Contact details and application outreach tools below.</p>
    <dl>${facts.map(([k, v]) => `<dt style="color:#6e90b8">${esc(k)}</dt><dd>${esc(v)}</dd>`).join("\n")}
    ${p.email ? `<dt style="color:#6e90b8">Email</dt><dd><a href="mailto:${esc(p.email)}" style="color:#00c9b1">${esc(p.email)}</a></dd>` : ""}
    ${p.website ? `<dt style="color:#6e90b8">Website</dt><dd>${A(p.website, p.website)}</dd>` : ""}</dl>
    <p>${A(isRes ? "/residency" : "/fellowship", isRes ? "View all anesthesiology residency programs →" : "View all anesthesiology fellowships →")}</p>`);
}

function genericBody(path) {
  const m = ROUTE_META[path];
  const h1 = {
    "/": "Gasology — The Complete Anesthesia Hub",
    "/app": "AI Anesthesia Board Prep — Oral Board Examiner, Quizzes & Drug Reference",
    "/conferences": "Anesthesia Conferences 2026 — Dates, Locations & CME Credits",
    "/journals": "Anesthesia Journals & High-Yield Articles",
    "/digest": "Weekly Anesthesia Journal Digest",
    "/case": "Anesthesia Case of the Day — Daily Clinical Case Quiz",
    "/jobs": "Anesthesiologist Jobs Board — Weekly Openings Across the US",
    "/contact": "Contact Gasology",
  }[path];
  const extra = path === "/"
    ? `<ul>
        <li>${A("/residency", "Anesthesiology residency directory")} — ${RESIDENCY_PROGRAMS.length}+ ACGME-accredited US programs</li>
        <li>${A("/fellowship", "Anesthesiology fellowship directory")} — ${FELLOWSHIPS.length}+ programs across ${FELLOWSHIP_TYPES.length} subspecialties</li>
        <li>${A("/jobs", "Anesthesiologist jobs board")} — weekly-updated openings across the US</li>
        <li>${A("/app", "AI oral board prep")} · ${A("/journals", "journal summaries")} · ${A("/digest", "weekly digest")} · ${A("/conferences", "2026 conference calendar")} · ${A("/case", "daily clinical case")}</li>
      </ul>`
    : path === "/jobs"
    ? `<p>Openings refresh weekly and span academic, private practice, hospital-employed, locum tenens, and subspecialty positions (cardiac, pediatric, pain, regional, critical care) nationwide. Open the interactive board to browse and filter this week's positions.</p>`
    : "";
  return shell(`<h1>${esc(h1)}</h1><p>${esc(m.description)}</p>${extra}`);
}

// ── EMIT PAGES ───────────────────────────────────────────────────────────────
function emit(path, meta, body) {
  const html = withHead(template, { ...meta, path })
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  const outDir = path === "/" ? DIST : join(DIST, ...path.slice(1).split("/"));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
}

const pages = [];
for (const [path, meta] of Object.entries(ROUTE_META)) {
  const body = path === "/residency" ? residencyDirectoryBody()
    : path === "/fellowship" ? fellowshipDirectoryBody()
    : genericBody(path);
  pages.push(path);
  emit(path, meta, body);
}

const seen = new Set();
for (const p of RESIDENCY_PROGRAMS) {
  const path = `/residency/${residencySlug(p)}`;
  if (seen.has(path)) throw new Error(`Duplicate slug: ${path}`);
  seen.add(path);
  pages.push(path);
  emit(path, residencyMeta(p), programBody("residency", p));
}
for (const f of FELLOWSHIPS) {
  const path = `/fellowship/${fellowshipSlug(f)}`;
  if (seen.has(path)) throw new Error(`Duplicate slug: ${path}`);
  seen.add(path);
  pages.push(path);
  emit(path, fellowshipMeta(f), programBody("fellowship", f));
}

// ── SITEMAP ──────────────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${esc(SITE_URL + (p === "/" ? "/" : p))}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
writeFileSync(join(DIST, "sitemap.xml"), sitemap);

console.log(`Prerendered ${pages.length} pages + sitemap.xml into dist/`);
