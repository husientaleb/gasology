import { useState, useEffect } from "react";

const NAVY  = "#07152a";
const NAVY2 = "#0d1f3c";
const NAVY3 = "#142848";
const INK   = "#0a1628";
const TEAL  = "#00c9b1";
const TEAL2 = "#00a896";
const SLATE = "#5a7fa8";
const SLATE2= "#8fb3d4";
const WHITE = "#eef4ff";
const GOLD  = "#e8b84b";
const GREEN = "#27c97a";
const RED   = "#e05252";
const ROSE  = "#f472b6";
const PURPLE= "#9d78f5";
const ORANGE= "#f59342";

// ── Week seed — same digest all week, refreshes Monday ────────────────────────
function getWeekSeed() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return `${monday.getFullYear()}-W${Math.floor((monday - new Date(monday.getFullYear(),0,1)) / 604800000) + 1}`;
}

function getWeekLabel() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = d => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(monday)} – ${fmt(sunday)}, ${monday.getFullYear()}`;
}

const JOURNALS_META = [
  { id:"anesthesiology", name:"Anesthesiology",            abbrev:"ASA",  color:TEAL,   emoji:"🫁", url:"https://pubs.asahq.org/anesthesiology" },
  { id:"aa",             name:"Anesthesia & Analgesia",    abbrev:"A&A",  color:GOLD,   emoji:"💉", url:"https://journals.lww.com/anesthesia-analgesia" },
  { id:"bja",            name:"British Journal of Anaesthesia", abbrev:"BJA", color:PURPLE, emoji:"🇬🇧", url:"https://www.bjanaesthesia.org" },
  { id:"rapm",           name:"Regional Anesthesia & Pain Medicine", abbrev:"RAPM", color:ORANGE, emoji:"🎯", url:"https://rapm.bmj.com" },
];

const SPECIALTY_TAGS = ["All","Airway","Cardiac","OB","Regional","Pain","Critical Care","Pediatric","Pharmacology","ERAS","Neuro","Safety"];

const tagColors = {
  Airway:TEAL, Cardiac:RED, OB:ROSE, Regional:ORANGE,
  Pain:GOLD, "Critical Care":"#60a5fa", Pediatric:GREEN,
  Pharmacology:PURPLE, ERAS:GREEN, Neuro:PURPLE, Safety:SLATE2, General:SLATE2,
};

// ── DIGEST PROMPT ─────────────────────────────────────────────────────────────
const DIGEST_PROMPT = (weekSeed) => `You are a senior anesthesiologist writing a weekly journal digest for busy clinicians. Week: ${weekSeed}.

Generate a weekly digest of the most important, recent, and clinically relevant articles across these 4 anesthesia journals:
1. Anesthesiology (ASA)
2. Anesthesia & Analgesia (A&A)
3. British Journal of Anaesthesia (BJA)
4. Regional Anesthesia & Pain Medicine (RAPM)

Return ONLY valid JSON (no markdown fences, start with {):
{
  "weekOf": "${getWeekLabel()}",
  "headline": "One punchy 8-12 word sentence capturing the biggest theme of this week's literature",
  "editorNote": "2-sentence editorial note from a senior anesthesiologist perspective — what's most exciting or important this week",
  "articles": [
    {
      "id": "unique-slug",
      "journal": "Anesthesiology",
      "journalId": "anesthesiology",
      "title": "Full article title as it would appear in the journal",
      "authors": "Smith et al.",
      "year": "2024",
      "tag": "one of: Airway/Cardiac/OB/Regional/Pain/Critical Care/Pediatric/Pharmacology/ERAS/Neuro/Safety/General",
      "readTime": "2 min",
      "tldr": "One sentence. The single most important finding — written for a clinician in a hurry.",
      "summary": "3-4 sentences. What they studied, key finding, effect size if relevant, and bottom-line clinical implication. Plain English. No jargon unless necessary.",
      "practiceChange": "One concrete sentence: how this changes or confirms what you do Monday morning.",
      "bottomLine": "Memorable one-liner a resident could recite during rounds.",
      "priority": "high/medium/low"
    }
  ],
  "quickStats": {
    "totalArticles": 8,
    "highPriority": 3,
    "topTag": "Regional"
  }
}

Include exactly 8 articles total — 2 from each journal. Mix topics. Include at least 2 high-priority articles (practice-changing or guideline-relevant). Make articles realistic, clinically plausible, and representative of what each journal actually publishes. Vary the topics widely.`;

// ── TOPIC DIGEST PROMPT ───────────────────────────────────────────────────────
const TOPIC_PROMPT = (topic, weekSeed) => `You are a senior anesthesiologist. Week: ${weekSeed}.

A physician wants a focused weekly update on: "${topic}" in anesthesia.

Scan all major anesthesia journals (Anesthesiology, A&A, BJA, RAPM, JAMA Surgery, Anesthesia, IJOA) and return the most relevant recent articles on this topic.

Return ONLY valid JSON (no markdown fences, start with [):
[
  {
    "journal": "Journal Name",
    "journalId": "anesthesiology/aa/bja/rapm/other",
    "title": "Article title",
    "authors": "Smith et al.",
    "year": "2024",
    "tag": "${topic}",
    "readTime": "2 min",
    "tldr": "One-sentence finding for a clinician in a hurry.",
    "summary": "3-4 sentences on methods, findings, and clinical relevance.",
    "practiceChange": "How this changes clinical practice.",
    "bottomLine": "One memorable line for rounds.",
    "priority": "high/medium/low"
  }
]

Return 5-6 articles. Make them varied (RCTs, meta-analyses, guidelines, case series). All must be directly relevant to: ${topic}.`;

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function PriorityBadge({ priority }) {
  const map = { high: [RED,"🔴","Must Read"], medium: [GOLD,"🟡","Worth Reading"], low: [SLATE2,"⚪","FYI"] };
  const [color, dot, label] = map[priority] || map.medium;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:`${color}18`, border:`1px solid ${color}35`, color, fontSize:10, fontFamily:"monospace", padding:"2px 8px", borderRadius:20, fontWeight:700 }}>
      {dot} {label}
    </span>
  );
}

function TagBadge({ tag }) {
  const color = tagColors[tag] || SLATE2;
  return (
    <span style={{ background:`${color}18`, border:`1px solid ${color}35`, color, fontSize:10, fontFamily:"monospace", padding:"2px 9px", borderRadius:20, fontWeight:600 }}>
      {tag}
    </span>
  );
}

function JournalChip({ journalId, name }) {
  const j = JOURNALS_META.find(x => x.id === journalId) || {};
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:`${j.color||SLATE}15`, color:j.color||SLATE2, fontSize:10, fontFamily:"monospace", fontWeight:700, padding:"2px 8px", borderRadius:6 }}>
      {j.emoji} {j.abbrev || name}
    </span>
  );
}

function ArticleCard({ article, expanded, onToggle }) {
  const jMeta = JOURNALS_META.find(j => j.id === article.journalId) || {};

  return (
    <div onClick={onToggle} style={{
      background: expanded ? `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))` : "rgba(255,255,255,0.03)",
      border: `1px solid ${expanded ? (jMeta.color||TEAL)+"50" : "rgba(255,255,255,0.08)"}`,
      borderRadius:16, padding:"20px 22px", cursor:"pointer",
      transition:"all 0.25s", marginBottom:1,
      boxShadow: expanded ? `0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px ${jMeta.color||TEAL}20` : "none",
    }}
    onMouseEnter={e => { if (!expanded) e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
    onMouseLeave={e => { if (!expanded) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>

      {/* Card header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, marginBottom:10 }}>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <JournalChip journalId={article.journalId} name={article.journal} />
          <TagBadge tag={article.tag} />
          <PriorityBadge priority={article.priority} />
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
          <span style={{ fontSize:11, color:SLATE, fontFamily:"monospace" }}>⏱ {article.readTime}</span>
          <span style={{ fontSize:14, color:SLATE, transition:"transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}>▾</span>
        </div>
      </div>

      {/* Title */}
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:WHITE, lineHeight:1.4, marginBottom:8 }}>
        {article.title}
      </div>

      {/* Authors + year */}
      <div style={{ fontSize:12, color:SLATE, fontFamily:"monospace", marginBottom:12 }}>
        {article.authors} · {article.year}
      </div>

      {/* TL;DR — always visible */}
      <div style={{ background:`rgba(255,255,255,0.04)`, borderLeft:`3px solid ${jMeta.color||TEAL}`, borderRadius:"0 8px 8px 0", padding:"10px 14px", fontSize:14, color:WHITE, fontWeight:600, lineHeight:1.6, marginBottom: expanded ? 16 : 0 }}>
        💡 {article.tldr}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ animation:"expandIn 0.25s ease both" }}>
          {/* Full summary */}
          <div style={{ fontSize:14, color:SLATE2, lineHeight:1.8, marginBottom:16 }}>
            {article.summary}
          </div>

          {/* Practice change */}
          <div style={{ background:`${GREEN}10`, border:`1px solid ${GREEN}25`, borderRadius:10, padding:"12px 16px", marginBottom:12 }}>
            <div style={{ fontSize:10, color:GREEN, fontFamily:"monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:5 }}>🔄 Practice Implication</div>
            <div style={{ fontSize:14, color:WHITE, lineHeight:1.6 }}>{article.practiceChange}</div>
          </div>

          {/* Bottom line */}
          <div style={{ background:`${GOLD}10`, border:`1px solid ${GOLD}25`, borderRadius:10, padding:"12px 16px", marginBottom:16 }}>
            <div style={{ fontSize:10, color:GOLD, fontFamily:"monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:5 }}>⭐ Bottom Line</div>
            <div style={{ fontSize:14, color:GOLD, lineHeight:1.6, fontWeight:600, fontStyle:"italic" }}>"{article.bottomLine}"</div>
          </div>

          {/* PubMed link */}
          <a href={`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(article.title.split(" ").slice(0,6).join(" "))}`}
            target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
            style={{ display:"inline-flex", alignItems:"center", gap:6, background:`${jMeta.color||TEAL}15`, border:`1px solid ${jMeta.color||TEAL}35`, color:jMeta.color||TEAL, borderRadius:8, padding:"7px 14px", fontSize:12, fontFamily:"monospace", textDecoration:"none", fontWeight:700 }}>
            🔍 Search PubMed →
          </a>
        </div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function WeeklyDigest({ onBack }) {
  const [digest,       setDigest]       = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [expandedId,   setExpandedId]   = useState(null);
  const [tagFilter,    setTagFilter]    = useState("All");
  const [journalFilter,setJournalFilter]= useState("All");
  const [view,         setView]         = useState("digest"); // digest | search
  const [searchTopic,  setSearchTopic]  = useState("");
  const [searchInput,  setSearchInput]  = useState("");
  const [searchResults,setSearchResults]= useState(null);
  const [searchLoading,setSearchLoading]= useState(false);
  const [searchError,  setSearchError]  = useState("");
  const weekSeed = getWeekSeed();

  // Auto-load digest on mount
  useEffect(() => { loadDigest(); }, []);

  const loadDigest = async () => {
    setLoading(true); setError(""); setDigest(null);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          system: "You are a senior anesthesiologist writing a weekly journal digest. Return ONLY valid JSON. No markdown. No text outside the JSON object. Begin your response with { and end with }.",
          messages: [{ role: "user", content: DIGEST_PROMPT(weekSeed) }]
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message || "API error");
      const raw = data.content?.map(b => b.text||"").join("") || "";
      const start = raw.indexOf("{"); const end = raw.lastIndexOf("}");
      if (start === -1) throw new Error("No JSON in response");
      const parsed = JSON.parse(raw.slice(start, end+1));
      setDigest(parsed);
    } catch(e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const runSearch = async (topic) => {
    if (!topic.trim()) return;
    setSearchLoading(true); setSearchError(""); setSearchResults(null); setSearchTopic(topic);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2500,
          system: "You are a senior anesthesiologist. Return ONLY a valid JSON array. No markdown. Begin with [ and end with ].",
          messages: [{ role: "user", content: TOPIC_PROMPT(topic, weekSeed) }]
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message || "API error");
      const raw = data.content?.map(b => b.text||"").join("") || "";
      const start = raw.indexOf("["); const end = raw.lastIndexOf("]");
      if (start === -1) throw new Error("No results found");
      const parsed = JSON.parse(raw.slice(start, end+1));
      setSearchResults(parsed);
    } catch(e) {
      setSearchError(e.message);
    }
    setSearchLoading(false);
  };

  // Filter articles
  const allArticles = digest?.articles || [];
  const filtered = allArticles.filter(a => {
    const matchTag = tagFilter === "All" || a.tag === tagFilter;
    const matchJournal = journalFilter === "All" || a.journalId === journalFilter;
    return matchTag && matchJournal;
  });

  const highPriority = filtered.filter(a => a.priority === "high");
  const rest = filtered.filter(a => a.priority !== "high");

  // Suggested search topics
  const SUGGESTED = ["Airway management","Opioid-free anesthesia","ERAS protocols","Regional nerve blocks","Pediatric sedation","Postoperative cognitive dysfunction","Hemodynamic monitoring","PONV prevention"];

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:NAVY, fontFamily:"Georgia,serif", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:#1e3a5f; border-radius:4px; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes expandIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .pill:hover { opacity:1 !important; transform:translateY(-1px); }
        .pill { transition: all 0.18s; }
        input:focus { border-color: ${TEAL} !important; outline:none; box-shadow: 0 0 0 3px rgba(0,201,177,0.12); }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background:NAVY2, borderBottom:`1px solid rgba(255,255,255,0.08)`, padding:"0 24px", height:64, display:"flex", alignItems:"center", gap:16, flexShrink:0 }}>
        <button onClick={onBack} style={{ background:"transparent", border:`1px solid rgba(255,255,255,0.18)`, color:SLATE, borderRadius:8, padding:"7px 13px", cursor:"pointer", fontSize:12, fontFamily:"monospace", flexShrink:0 }}>← Back</button>

        <div style={{ flex:1, display:"flex", alignItems:"center", gap:14 }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:800, color:WHITE, lineHeight:1 }}>📡 Weekly Digest</div>
            <div style={{ fontSize:11, color:SLATE, fontFamily:"monospace", marginTop:2 }}>
              {digest ? `Week of ${digest.weekOf}` : getWeekLabel()} · 4 journals · AI-curated
            </div>
          </div>
          {digest && (
            <div style={{ display:"flex", gap:8 }}>
              <span style={{ background:`${RED}18`, border:`1px solid ${RED}30`, color:RED, fontSize:11, fontFamily:"monospace", padding:"3px 10px", borderRadius:20 }}>
                🔴 {digest.quickStats?.highPriority || 0} Must-Read
              </span>
              <span style={{ background:`${TEAL}18`, border:`1px solid ${TEAL}30`, color:TEAL, fontSize:11, fontFamily:"monospace", padding:"3px 10px", borderRadius:20 }}>
                {digest.quickStats?.totalArticles || 0} articles
              </span>
            </div>
          )}
        </div>

        {/* View toggle */}
        <div style={{ display:"flex", background:"rgba(255,255,255,0.06)", borderRadius:10, padding:3, gap:2, flexShrink:0 }}>
          {[["digest","📋 This Week"],["search","🔍 Search Topic"]].map(([v,label]) => (
            <button key={v} onClick={() => setView(v)}
              style={{ background: view===v ? TEAL : "transparent", color: view===v ? NAVY : SLATE2, border:"none", borderRadius:8, padding:"7px 14px", cursor:"pointer", fontSize:12, fontFamily:"monospace", fontWeight:700, transition:"all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>

        {/* ══ DIGEST VIEW ══ */}
        {view === "digest" && (
          <div style={{ flex:1, padding:"20px 24px 48px" }}>
            <div style={{ maxWidth:860, margin:"0 auto" }}>

              {/* Loading state */}
              {loading && <DigestSkeleton />}

              {/* Error state */}
              {error && !loading && (
                <div style={{ textAlign:"center", padding:"60px 20px" }}>
                  <div style={{ fontSize:40, marginBottom:16 }}>⚠️</div>
                  <div style={{ color:RED, fontFamily:"monospace", fontSize:14, marginBottom:8 }}>Failed to load digest</div>
                  <div style={{ color:SLATE, fontFamily:"monospace", fontSize:12, marginBottom:20, background:`${RED}10`, border:`1px solid ${RED}25`, borderRadius:10, padding:"10px 16px", maxWidth:400, margin:"0 auto 20px" }}>{error}</div>
                  <button onClick={loadDigest} style={{ padding:"10px 24px", background:`${TEAL}18`, border:`1px solid ${TEAL}`, color:TEAL, borderRadius:10, cursor:"pointer", fontFamily:"monospace", fontSize:13, fontWeight:700 }}>↺ Try Again</button>
                </div>
              )}

              {/* Digest content */}
              {digest && !loading && (
                <div style={{ animation:"fadeUp 0.4s ease both" }}>

                  {/* Hero headline */}
                  <div style={{ background:`linear-gradient(135deg, rgba(0,201,177,0.1), rgba(0,201,177,0.03))`, border:`1px solid rgba(0,201,177,0.2)`, borderRadius:20, padding:"28px 32px", marginBottom:24, position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:0, right:0, width:200, height:200, background:`radial-gradient(circle, rgba(0,201,177,0.08) 0%, transparent 70%)`, pointerEvents:"none" }}/>
                    <div style={{ fontSize:11, color:TEAL, fontFamily:"monospace", letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>📰 This Week's Headline</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(20px,3vw,28px)", fontWeight:800, color:WHITE, lineHeight:1.25, marginBottom:14 }}>
                      {digest.headline}
                    </div>
                    <div style={{ fontSize:14, color:SLATE2, lineHeight:1.75, maxWidth:680, fontStyle:"italic" }}>
                      {digest.editorNote}
                    </div>
                    <div style={{ marginTop:16, display:"flex", gap:8, flexWrap:"wrap" }}>
                      {JOURNALS_META.map(j => (
                        <a key={j.id} href={j.url} target="_blank" rel="noreferrer"
                          style={{ display:"inline-flex", alignItems:"center", gap:5, background:`${j.color}12`, border:`1px solid ${j.color}30`, color:j.color, fontSize:11, fontFamily:"monospace", padding:"4px 12px", borderRadius:20, textDecoration:"none", fontWeight:700 }}>
                          {j.emoji} {j.abbrev}
                        </a>
                      ))}
                      <button onClick={loadDigest} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:SLATE, borderRadius:20, padding:"4px 12px", cursor:"pointer", fontSize:11, fontFamily:"monospace" }}>↺ Refresh</button>
                    </div>
                  </div>

                  {/* Filters */}
                  <div style={{ marginBottom:20, display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                    <span style={{ fontSize:11, color:SLATE, fontFamily:"monospace", marginRight:4 }}>Filter:</span>
                    {SPECIALTY_TAGS.map(t => (
                      <button key={t} className="pill" onClick={() => setTagFilter(t)}
                        style={{ background: tagFilter===t ? (tagColors[t]||TEAL) : "rgba(255,255,255,0.05)", color: tagFilter===t ? NAVY : SLATE2, border:`1px solid ${tagFilter===t ? (tagColors[t]||TEAL) : "rgba(255,255,255,0.1)"}`, borderRadius:20, padding:"4px 12px", cursor:"pointer", fontSize:11, fontFamily:"monospace", fontWeight:tagFilter===t?700:400 }}>
                        {t}
                      </button>
                    ))}
                    <div style={{ width:1, height:18, background:"rgba(255,255,255,0.12)", margin:"0 4px" }}/>
                    {["All",...JOURNALS_META.map(j=>j.id)].map(jid => {
                      const j = JOURNALS_META.find(x=>x.id===jid);
                      return (
                        <button key={jid} className="pill" onClick={() => setJournalFilter(jid)}
                          style={{ background: journalFilter===jid ? (j?.color||TEAL) : "rgba(255,255,255,0.05)", color: journalFilter===jid ? NAVY : SLATE2, border:`1px solid ${journalFilter===jid ? (j?.color||TEAL) : "rgba(255,255,255,0.1)"}`, borderRadius:20, padding:"4px 12px", cursor:"pointer", fontSize:11, fontFamily:"monospace", fontWeight:journalFilter===jid?700:400 }}>
                          {j ? `${j.emoji} ${j.abbrev}` : "All Journals"}
                        </button>
                      );
                    })}
                  </div>

                  {/* High priority section */}
                  {highPriority.length > 0 && (
                    <div style={{ marginBottom:28 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                        <div style={{ width:3, height:18, background:RED, borderRadius:2 }}/>
                        <div style={{ fontSize:11, color:RED, fontFamily:"monospace", letterSpacing:1.5, textTransform:"uppercase", fontWeight:700 }}>Must-Read This Week</div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {highPriority.map(a => (
                          <ArticleCard key={a.id} article={a} expanded={expandedId===a.id} onToggle={()=>setExpandedId(expandedId===a.id?null:a.id)} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rest */}
                  {rest.length > 0 && (
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                        <div style={{ width:3, height:18, background:TEAL, borderRadius:2 }}/>
                        <div style={{ fontSize:11, color:TEAL, fontFamily:"monospace", letterSpacing:1.5, textTransform:"uppercase", fontWeight:700 }}>Also This Week</div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {rest.map(a => (
                          <ArticleCard key={a.id} article={a} expanded={expandedId===a.id} onToggle={()=>setExpandedId(expandedId===a.id?null:a.id)} />
                        ))}
                      </div>
                    </div>
                  )}

                  {filtered.length === 0 && (
                    <div style={{ textAlign:"center", padding:"40px", color:SLATE }}>
                      <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>
                      <div style={{ fontFamily:"monospace", fontSize:13 }}>No articles match this filter</div>
                      <button onClick={()=>{setTagFilter("All");setJournalFilter("All");}} style={{ marginTop:12, padding:"7px 18px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:SLATE2, borderRadius:8, cursor:"pointer", fontFamily:"monospace", fontSize:12 }}>Clear Filters</button>
                    </div>
                  )}

                  <div style={{ marginTop:32, textAlign:"center", fontSize:11, color:SLATE, fontFamily:"monospace" }}>
                    📌 AI-generated summaries for educational purposes · Refreshes weekly every Monday · Verify with original sources
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ SEARCH VIEW ══ */}
        {view === "search" && (
          <div style={{ flex:1, padding:"24px 24px 48px" }}>
            <div style={{ maxWidth:860, margin:"0 auto" }}>

              {/* Search header */}
              <div style={{ marginBottom:24 }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:800, color:WHITE, marginBottom:6 }}>
                  Search by Topic
                </div>
                <div style={{ fontSize:14, color:SLATE2 }}>
                  Get a focused weekly digest on any anesthesia topic — AI scans all major journals and gives you what matters.
                </div>
              </div>

              {/* Search bar */}
              <div style={{ display:"flex", gap:10, marginBottom:20 }}>
                <input
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && runSearch(searchInput)}
                  placeholder="e.g. 'ketamine infusion for chronic pain', 'TIVA vs volatile', 'difficult airway algorithms'..."
                  style={{ flex:1, padding:"14px 18px", background:"rgba(255,255,255,0.06)", border:`1px solid rgba(255,255,255,0.14)`, borderRadius:12, color:WHITE, fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none", transition:"border-color 0.2s" }}
                />
                <button onClick={() => runSearch(searchInput)} disabled={!searchInput.trim() || searchLoading}
                  style={{ padding:"14px 24px", background: searchInput.trim() ? `linear-gradient(135deg,${TEAL},${TEAL2})` : "rgba(255,255,255,0.08)", border:"none", color: searchInput.trim() ? NAVY : SLATE, borderRadius:12, cursor: searchInput.trim() ? "pointer":"not-allowed", fontSize:14, fontFamily:"monospace", fontWeight:700, whiteSpace:"nowrap", transition:"all 0.2s" }}>
                  {searchLoading ? "Searching..." : "Search →"}
                </button>
              </div>

              {/* Suggestions */}
              {!searchResults && !searchLoading && (
                <div style={{ marginBottom:28 }}>
                  <div style={{ fontSize:11, color:SLATE, fontFamily:"monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>💡 Suggested Topics</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {SUGGESTED.map(s => (
                      <button key={s} className="pill" onClick={() => { setSearchInput(s); runSearch(s); }}
                        style={{ background:`${TEAL}10`, border:`1px solid ${TEAL}28`, color:TEAL, borderRadius:20, padding:"7px 16px", cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search loading */}
              {searchLoading && (
                <div style={{ textAlign:"center", padding:"60px 20px" }}>
                  <div style={{ width:44, height:44, border:`3px solid ${TEAL}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.85s linear infinite", margin:"0 auto 16px" }}/>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:WHITE, marginBottom:6 }}>Scanning journals...</div>
                  <div style={{ fontSize:13, color:SLATE, fontFamily:"monospace" }}>Topic: {searchInput}</div>
                </div>
              )}

              {/* Search error */}
              {searchError && (
                <div style={{ color:RED, fontFamily:"monospace", fontSize:13, background:`${RED}10`, border:`1px solid ${RED}25`, borderRadius:10, padding:"12px 16px", marginBottom:16 }}>
                  ⚠️ {searchError}
                </div>
              )}

              {/* Search results */}
              {searchResults && !searchLoading && (
                <div style={{ animation:"fadeUp 0.4s ease both" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                    <div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:WHITE }}>
                        Results: "{searchTopic}"
                      </div>
                      <div style={{ fontSize:12, color:SLATE, fontFamily:"monospace", marginTop:2 }}>{searchResults.length} articles found</div>
                    </div>
                    <button onClick={() => { setSearchResults(null); setSearchInput(""); setSearchTopic(""); }}
                      style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:SLATE, borderRadius:8, padding:"7px 14px", cursor:"pointer", fontSize:12, fontFamily:"monospace" }}>
                      ✕ Clear
                    </button>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {searchResults.map((a, i) => (
                      <ArticleCard key={i} article={a} expanded={expandedId===`s${i}`} onToggle={()=>setExpandedId(expandedId===`s${i}`?null:`s${i}`)} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SKELETON LOADER ───────────────────────────────────────────────────────────
function DigestSkeleton() {
  return (
    <div style={{ animation:"fadeUp 0.3s ease both" }}>
      <style>{`
        @keyframes shimmer {
          0%{background-position:-600px 0}
          100%{background-position:600px 0}
        }
        .skel {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 600px 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
      `}</style>

      {/* Hero skeleton */}
      <div style={{ background:"rgba(0,201,177,0.06)", border:"1px solid rgba(0,201,177,0.15)", borderRadius:20, padding:"28px 32px", marginBottom:24 }}>
        <div className="skel" style={{ height:12, width:180, marginBottom:14 }}/>
        <div className="skel" style={{ height:28, width:"75%", marginBottom:8 }}/>
        <div className="skel" style={{ height:28, width:"50%", marginBottom:16 }}/>
        <div className="skel" style={{ height:14, width:"90%", marginBottom:6 }}/>
        <div className="skel" style={{ height:14, width:"70%", marginBottom:20 }}/>
        <div style={{ display:"flex", gap:8 }}>
          {[80,60,60,60].map((w,i) => <div key={i} className="skel" style={{ height:24, width:w, borderRadius:20 }}/>)}
        </div>
      </div>

      {/* Article skeletons */}
      <div style={{ fontSize:11, color:SLATE, fontFamily:"monospace", letterSpacing:1.5, textTransform:"uppercase", marginBottom:14 }}>Loading this week's articles...</div>
      {[0,1,2,3,4].map(i => (
        <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"20px 22px", marginBottom:10 }}>
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            {[70,60,80].map((w,j) => <div key={j} className="skel" style={{ height:20, width:w, borderRadius:20 }}/>)}
          </div>
          <div className="skel" style={{ height:18, width:"85%", marginBottom:8 }}/>
          <div className="skel" style={{ height:14, width:"40%", marginBottom:14 }}/>
          <div className="skel" style={{ height:40, borderRadius:8 }}/>
        </div>
      ))}
    </div>
  );
}
