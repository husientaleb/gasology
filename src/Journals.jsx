import { useState } from "react";

const NAVY  = "#08172e";
const NAVY2 = "#0f2240";
const NAVY3 = "#162d52";
const TEAL  = "#00c9b1";
const TEAL2 = "#00a896";
const SLATE = "#6e90b8";
const SLATE2= "#a8c0d8";
const WHITE = "#f0f6ff";
const GOLD  = "#f0bc3a";
const GREEN = "#2ed47a";
const PURPLE= "#a78bfa";
const ORANGE= "#fb923c";
const RED   = "#e05555";

const JOURNALS = [
  {
    id: "anesthesiology",
    name: "Anesthesiology",
    abbrev: "ASA",
    publisher: "American Society of Anesthesiologists",
    impact: "8.5",
    color: TEAL,
    emoji: "🫁",
    url: "https://pubs.asahq.org/anesthesiology",
    rssHint: "pubs.asahq.org",
    description: "The flagship journal of anesthesiology. Publishes landmark clinical trials, guidelines, and practice-changing science across all subspecialties.",
    topics: ["General","Cardiac","Neuroanesthesia","Pharmacology","Perioperative Medicine","Pain"],
  },
  {
    id: "aa",
    name: "Anesthesia & Analgesia",
    abbrev: "A&A",
    publisher: "International Anesthesia Research Society",
    impact: "4.5",
    color: GOLD,
    emoji: "💉",
    url: "https://journals.lww.com/anesthesia-analgesia",
    rssHint: "journals.lww.com/anesthesia-analgesia",
    description: "The official journal of IARS. Covers translational research, regional anesthesia, obstetric anesthesia, and perioperative outcomes.",
    topics: ["Regional","OB","Pediatric","Critical Care","TIVA","Simulation"],
  },
  {
    id: "bja",
    name: "British Journal of Anaesthesia",
    abbrev: "BJA",
    publisher: "Royal College of Anaesthetists",
    impact: "9.1",
    color: PURPLE,
    emoji: "🇬🇧",
    url: "https://www.bjanaesthesia.org",
    rssHint: "bjanaesthesia.org",
    description: "One of the highest-impact anaesthesia journals globally. Renowned for airway management, enhanced recovery, and critical care research.",
    topics: ["Airway","ERAS","Critical Care","Pharmacology","Cardiac","OB"],
  },
  {
    id: "rapm",
    name: "Regional Anesthesia & Pain Medicine",
    abbrev: "RAPM",
    publisher: "ASRA Pain Medicine",
    impact: "5.8",
    color: ORANGE,
    emoji: "🎯",
    url: "https://rapm.bmj.com",
    rssHint: "rapm.bmj.com",
    description: "The definitive journal for regional anesthesia and pain medicine. Ultrasound-guided blocks, LAST management, ASRA guidelines, and acute pain science.",
    topics: ["Regional","Pain","LAST","Ultrasound","Nerve Blocks","Spinal/Epidural"],
  },
];

const TOPIC_FILTERS = ["All","Airway","Cardiac","OB","Regional","Pediatric","Pain","Critical Care","Pharmacology","ERAS","Neuro"];

const SYSTEM_PROMPT = `You are a senior anesthesiologist and journal editor. Generate a curated list of 6 high-yield, landmark, or recently impactful articles from the journal: {JOURNAL}.

Focus on articles that are:
- Clinically practice-changing or board-relevant
- Published in the last 3 years when possible, but landmark older papers are fine
- Relevant to anesthesia residents and fellows preparing for ABA oral boards

Return ONLY a JSON array (no markdown, no preamble) with exactly 6 items in this format:
[
  {
    "title": "Full article title",
    "authors": "First Author et al.",
    "year": "2023",
    "topic": "one of: Airway/Cardiac/OB/Regional/Pediatric/Pain/Critical Care/Pharmacology/ERAS/Neuro/General",
    "summary": "2-sentence clinical summary of what this paper found and why it matters for practice or boards",
    "boardRelevance": "one sentence on why an ABA board candidate should know this",
    "searchUrl": "https://pubmed.ncbi.nlm.nih.gov/?term={SEARCH_TERM}"
  }
]

Make the searchUrl a real PubMed search using key words from the title. Replace spaces with +.`;

export default function JournalsPage({ onBack }) {
  const [articles,    setArticles]    = useState({});   // journalId -> array
  const [loading,     setLoading]     = useState({});   // journalId -> bool
  const [errors,      setErrors]      = useState({});
  const [activeJournal, setActiveJournal] = useState(null);
  const [topicFilter, setTopicFilter] = useState("All");
  const [askArticle,  setAskArticle]  = useState(null); // {article, journal}
  const [askQ,        setAskQ]        = useState("");
  const [askAnswer,   setAskAnswer]   = useState("");
  const [askLoading,  setAskLoading]  = useState(false);

  const loadArticles = async (journal) => {
    if (articles[journal.id]) { setActiveJournal(journal.id); return; }
    setLoading(l => ({ ...l, [journal.id]: true }));
    setErrors(e => ({ ...e, [journal.id]: null }));
    setActiveJournal(journal.id);
    try {
      const prompt = SYSTEM_PROMPT
        .replace("{JOURNAL}", `${journal.name} (${journal.abbrev})`)
        .replace("{SEARCH_TERM}", journal.name.replace(/ /g, "+"));

      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: "You are a senior anesthesiologist and journal editor. Return ONLY a valid JSON array. No markdown code fences. No text before or after the JSON array. Start your response with [ and end with ].",
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API error ${res.status}: ${errText.slice(0, 200)}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || JSON.stringify(data.error));
      }

      const raw = data.content?.map(b => b.text || "").join("") || "";
      if (!raw) throw new Error("Empty response from API");

      // Extract JSON array — find first [ and last ]
      const start = raw.indexOf("[");
      const end = raw.lastIndexOf("]");
      if (start === -1 || end === -1) throw new Error("No JSON array found in response");

      const jsonStr = raw.slice(start, end + 1);
      const parsed = JSON.parse(jsonStr);

      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Invalid article array");

      setArticles(a => ({ ...a, [journal.id]: parsed }));
    } catch (e) {
      console.error("Journals load error:", e);
      setErrors(err => ({ ...err, [journal.id]: `Failed to load: ${e.message}. Check your API proxy and try again.` }));
    }
    setLoading(l => ({ ...l, [journal.id]: false }));
  };

  const askAbout = async (article, journal) => {
    setAskArticle({ article, journal });
    setAskAnswer("");
    setAskQ("");
  };

  const submitAsk = async (question) => {
    setAskLoading(true); setAskAnswer("");
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 700,
          system: "You are an expert anesthesiologist and educator. Answer questions about anesthesia research papers concisely, with clinical relevance and board exam perspective. Use bullet points when helpful.",
          messages: [{ role: "user", content: `Article: "${askArticle.article.title}" (${askArticle.journal.name}, ${askArticle.article.year})\n\nSummary: ${askArticle.article.summary}\n\nQuestion: ${question}` }]
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message || "API error");
      setAskAnswer(data.content?.map(b => b.text || "").join("") || "No response.");
    } catch (e) { setAskAnswer(`Error: ${e.message}. Please try again.`); }
    setAskLoading(false);
  };

  const activeArticles = activeJournal && articles[activeJournal]
    ? articles[activeJournal].filter(a => topicFilter === "All" || a.topic === topicFilter)
    : [];

  const activeJ = JOURNALS.find(j => j.id === activeJournal);

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:NAVY, fontFamily:"Georgia,serif", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:#2d4a6b; border-radius:4px; }
        .art-card { transition: all 0.22s ease; }
        .art-card:hover { transform: translateY(-3px) !important; box-shadow: 0 16px 48px rgba(0,0,0,0.35) !important; }
        .j-card { transition: all 0.25s ease; }
        .j-card:hover { transform: translateY(-4px) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Ask Modal */}
      {askArticle && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:NAVY2, border:`1px solid ${askArticle.journal.color}50`, borderRadius:20, padding:"28px 32px", maxWidth:640, width:"100%", maxHeight:"85vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, gap:12 }}>
              <div>
                <div style={{ fontSize:11, color:askArticle.journal.color, fontFamily:"monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>🤖 Ask AI About This Paper</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:WHITE, lineHeight:1.35 }}>{askArticle.article.title}</div>
                <div style={{ fontSize:12, color:SLATE, marginTop:4 }}>{askArticle.article.authors} · {askArticle.article.year} · {askArticle.journal.name}</div>
              </div>
              <button onClick={() => setAskArticle(null)} style={{ background:"transparent", border:"none", color:SLATE, cursor:"pointer", fontSize:22, flexShrink:0 }}>✕</button>
            </div>

            <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:13, color:SLATE2, lineHeight:1.65, borderLeft:`3px solid ${askArticle.journal.color}` }}>
              {askArticle.article.summary}
            </div>

            {/* Quick questions */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, color:SLATE, fontFamily:"monospace", marginBottom:8 }}>Quick questions:</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {[
                  "What are the key takeaways for clinical practice?",
                  "How is this relevant for ABA oral boards?",
                  "What were the study limitations?",
                  "How does this change current guidelines?",
                ].map(q => (
                  <button key={q} onClick={() => { setAskQ(q); submitAsk(q); }}
                    style={{ background:`${askArticle.journal.color}12`, border:`1px solid ${askArticle.journal.color}30`, color:askArticle.journal.color, borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:12, fontFamily:"monospace", textAlign:"left", lineHeight:1.4 }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom question */}
            <div style={{ display:"flex", gap:10, marginBottom:16 }}>
              <input value={askQ} onChange={e => setAskQ(e.target.value)}
                onKeyDown={e => e.key === "Enter" && askQ.trim() && submitAsk(askQ)}
                placeholder="Ask anything about this paper..."
                style={{ flex:1, padding:"10px 14px", background:"rgba(255,255,255,0.06)", border:`1px solid rgba(255,255,255,0.12)`, borderRadius:9, color:WHITE, fontSize:13, fontFamily:"monospace", outline:"none" }} />
              <button onClick={() => askQ.trim() && submitAsk(askQ)}
                style={{ padding:"10px 18px", background:`linear-gradient(135deg,${askArticle.journal.color},${askArticle.journal.color}cc)`, border:"none", color:NAVY, borderRadius:9, cursor:"pointer", fontSize:13, fontFamily:"monospace", fontWeight:700 }}>
                Ask →
              </button>
            </div>

            {askLoading && (
              <div style={{ color:SLATE, fontSize:13, fontFamily:"monospace", padding:"8px 0", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ display:"inline-block", width:14, height:14, border:`2px solid ${askArticle.journal.color}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
                Generating response...
              </div>
            )}
            {askAnswer && (
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"16px 18px", fontSize:14, color:SLATE2, lineHeight:1.75, borderLeft:`3px solid ${askArticle.journal.color}`, animation:"fadeIn 0.3s ease both" }}
                dangerouslySetInnerHTML={{ __html: askAnswer.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/^- (.+)$/gm,'<div style="margin:4px 0;padding-left:12px;border-left:2px solid rgba(255,255,255,0.1)">$1</div>').replace(/\n/g,"<br/>") }} />
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background:NAVY2, borderBottom:`1px solid rgba(255,255,255,0.08)`, padding:"14px 24px", display:"flex", alignItems:"center", gap:14, flexShrink:0 }}>
        <button onClick={onBack} style={{ background:"transparent", border:`1px solid rgba(255,255,255,0.18)`, color:SLATE, borderRadius:8, padding:"7px 14px", cursor:"pointer", fontSize:12, fontFamily:"monospace" }}>← Back</button>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:800, color:WHITE }}>📰 Anesthesia Journals</div>
          <div style={{ fontSize:12, color:SLATE, fontFamily:"monospace", marginTop:2 }}>4 top journals · AI-curated high-yield articles · Board-relevant summaries</div>
        </div>
        <div style={{ background:`${TEAL}18`, border:`1px solid ${TEAL}40`, borderRadius:8, padding:"6px 14px", fontSize:11, color:TEAL, fontFamily:"monospace" }}>
          🤖 AI-Powered
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"24px" }}>
        <div style={{ maxWidth:1040, margin:"0 auto" }}>

          {/* Journal Cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:16, marginBottom:32 }}>
            {JOURNALS.map(j => (
              <div key={j.id} className="j-card"
                onClick={() => loadArticles(j)}
                style={{
                  background: activeJournal === j.id ? `linear-gradient(135deg, ${j.color}18, ${j.color}08)` : "rgba(255,255,255,0.03)",
                  border: `2px solid ${activeJournal === j.id ? j.color : "rgba(255,255,255,0.08)"}`,
                  borderRadius:18, padding:"22px 24px", cursor:"pointer",
                  boxShadow: activeJournal === j.id ? `0 0 32px ${j.color}25` : "none"
                }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <span style={{ fontSize:32 }}>{j.emoji}</span>
                  <span style={{ background:`${j.color}18`, border:`1px solid ${j.color}40`, color:j.color, fontSize:11, fontFamily:"monospace", padding:"3px 9px", borderRadius:6, fontWeight:700 }}>IF {j.impact}</span>
                </div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:800, color:WHITE, marginBottom:4, lineHeight:1.25 }}>{j.name}</div>
                <div style={{ fontSize:11, color:SLATE, fontFamily:"monospace", marginBottom:10 }}>{j.abbrev} · {j.publisher}</div>
                <div style={{ fontSize:13, color:SLATE2, lineHeight:1.6, marginBottom:14 }}>{j.description}</div>

                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
                  {j.topics.slice(0,4).map(t => (
                    <span key={t} style={{ background:`${j.color}12`, color:j.color, fontSize:10, fontFamily:"monospace", padding:"2px 8px", borderRadius:12 }}>{t}</span>
                  ))}
                </div>

                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <button
                    onClick={e => { e.stopPropagation(); loadArticles(j); }}
                    style={{
                      flex:1, padding:"8px", background: loading[j.id] ? "rgba(255,255,255,0.05)" : `${j.color}18`,
                      border:`1px solid ${j.color}40`, color:j.color, borderRadius:8, cursor:"pointer",
                      fontSize:12, fontFamily:"monospace", fontWeight:700,
                      display:"flex", alignItems:"center", justifyContent:"center", gap:6
                    }}>
                    {loading[j.id]
                      ? <><span style={{ width:12, height:12, border:`2px solid ${j.color}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }}/> Loading...</>
                      : articles[j.id] ? "✓ View Articles" : "🤖 Load Articles"}
                  </button>
                  <a href={j.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                    style={{ padding:"8px 12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:SLATE, borderRadius:8, fontSize:12, fontFamily:"monospace", textDecoration:"none" }}>
                    🔗
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Articles panel */}
          {activeJournal && (
            <div style={{ animation:"fadeIn 0.3s ease both" }}>

              {/* Panel header */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:12 }}>
                <div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:800, color:WHITE }}>
                    {activeJ?.emoji} High-Yield Articles — {activeJ?.name}
                  </div>
                  <div style={{ fontSize:12, color:SLATE, fontFamily:"monospace", marginTop:2 }}>AI-curated · Click any article to ask questions</div>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <a href={activeJ?.url} target="_blank" rel="noreferrer"
                    style={{ padding:"7px 14px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:SLATE2, borderRadius:8, fontSize:12, fontFamily:"monospace", textDecoration:"none" }}>
                    Visit Journal →
                  </a>
                  <button onClick={() => { setArticles(a => ({ ...a, [activeJournal]: undefined })); loadArticles(activeJ); }}
                    style={{ padding:"7px 14px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:SLATE, borderRadius:8, cursor:"pointer", fontSize:12, fontFamily:"monospace" }}>
                    ↺ Refresh
                  </button>
                </div>
              </div>

              {/* Topic filter */}
              <div style={{ display:"flex", gap:7, overflowX:"auto", marginBottom:20, paddingBottom:4 }}>
                {TOPIC_FILTERS.map(t => (
                  <button key={t} onClick={() => setTopicFilter(t)}
                    style={{ background: topicFilter===t ? (activeJ?.color||TEAL) : "rgba(255,255,255,0.04)", color: topicFilter===t ? NAVY : SLATE, border:`1px solid ${topicFilter===t ? (activeJ?.color||TEAL) : "rgba(255,255,255,0.1)"}`, borderRadius:20, padding:"5px 14px", cursor:"pointer", fontSize:12, fontFamily:"monospace", whiteSpace:"nowrap", fontWeight:topicFilter===t?700:400 }}>
                    {t}
                  </button>
                ))}
              </div>

              {/* Loading state */}
              {loading[activeJournal] && (
                <div style={{ textAlign:"center", padding:"60px 20px" }}>
                  <div style={{ width:40, height:40, border:`3px solid ${activeJ?.color}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }}/>
                  <div style={{ color:SLATE, fontFamily:"monospace", fontSize:14 }}>AI is curating high-yield articles...</div>
                </div>
              )}

              {/* Error state */}
              {errors[activeJournal] && (
                <div style={{ textAlign:"center", padding:"40px", color:RED, fontFamily:"monospace" }}>
                  ⚠️ {errors[activeJournal]}
                  <button onClick={() => { setErrors(e=>({...e,[activeJournal]:null})); loadArticles(activeJ); }}
                    style={{ display:"block", margin:"12px auto 0", padding:"8px 18px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:SLATE, borderRadius:8, cursor:"pointer", fontFamily:"monospace", fontSize:13 }}>
                    Try Again
                  </button>
                </div>
              )}

              {/* Articles grid */}
              {!loading[activeJournal] && activeArticles.length > 0 && (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:14 }}>
                  {activeArticles.map((article, i) => (
                    <ArticleCard key={i} article={article} journal={activeJ} onAsk={() => askAbout(article, activeJ)} />
                  ))}
                </div>
              )}

              {/* Empty filter state */}
              {!loading[activeJournal] && articles[activeJournal] && activeArticles.length === 0 && (
                <div style={{ textAlign:"center", padding:"48px", color:SLATE }}>
                  <div style={{ fontSize:36, marginBottom:12 }}>🔍</div>
                  <div style={{ fontFamily:"monospace", fontSize:14 }}>No articles match this topic filter</div>
                  <button onClick={() => setTopicFilter("All")} style={{ marginTop:12, padding:"8px 18px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:SLATE2, borderRadius:8, cursor:"pointer", fontFamily:"monospace", fontSize:13 }}>Show All</button>
                </div>
              )}

              {/* Prompt to load */}
              {!loading[activeJournal] && !articles[activeJournal] && !errors[activeJournal] && (
                <div style={{ textAlign:"center", padding:"60px 20px" }}>
                  <div style={{ fontSize:48, marginBottom:16 }}>📰</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:WHITE, marginBottom:8 }}>Ready to load articles</div>
                  <div style={{ color:SLATE, fontFamily:"monospace", fontSize:13, marginBottom:24 }}>AI will curate 6 high-yield papers from {activeJ?.name}</div>
                  <button onClick={() => loadArticles(activeJ)}
                    style={{ padding:"12px 28px", background:`linear-gradient(135deg,${activeJ?.color},${activeJ?.color}cc)`, border:"none", color:NAVY, borderRadius:10, cursor:"pointer", fontSize:14, fontFamily:"monospace", fontWeight:700 }}>
                    🤖 Load High-Yield Articles →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* No journal selected yet */}
          {!activeJournal && (
            <div style={{ textAlign:"center", padding:"48px 20px" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>☝️</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:WHITE, marginBottom:8 }}>Select a journal above</div>
              <div style={{ color:SLATE, fontFamily:"monospace", fontSize:13 }}>Click any journal card to load AI-curated high-yield articles</div>
            </div>
          )}

          <div style={{ marginTop:32, padding:"14px 18px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, fontSize:11, color:SLATE, fontFamily:"monospace", textAlign:"center" }}>
            📌 Articles are AI-curated for educational purposes · Always verify with original sources · Access may require institutional subscription
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ article, journal, onAsk }) {
  const topicColorMap = {
    Airway:TEAL, Cardiac:RED, OB:"#f472b6", Regional:ORANGE,
    Pediatric:GREEN, Pain:GOLD, "Critical Care":"#60a5fa",
    Pharmacology:PURPLE, ERAS:GREEN, Neuro:PURPLE, General:SLATE2
  };
  const topicColor = topicColorMap[article.topic] || journal.color;

  return (
    <div className="art-card" style={{
      background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
      borderRadius:16, padding:"20px 22px", display:"flex", flexDirection:"column", gap:10
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <span style={{ background:`${topicColor}18`, border:`1px solid ${topicColor}35`, color:topicColor, fontSize:10, fontFamily:"monospace", padding:"3px 9px", borderRadius:6, fontWeight:700, flexShrink:0 }}>
          {article.topic}
        </span>
        <span style={{ fontSize:11, color:SLATE, fontFamily:"monospace", flexShrink:0 }}>{article.year}</span>
      </div>

      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:WHITE, lineHeight:1.4 }}>
        {article.title}
      </div>

      <div style={{ fontSize:12, color:SLATE, fontFamily:"monospace" }}>
        {article.authors}
      </div>

      <div style={{ fontSize:13, color:SLATE2, lineHeight:1.65 }}>
        {article.summary}
      </div>

      <div style={{ background:`${GOLD}10`, border:`1px solid ${GOLD}25`, borderRadius:8, padding:"8px 12px" }}>
        <span style={{ fontSize:10, color:GOLD, fontFamily:"monospace", fontWeight:700 }}>★ BOARD RELEVANCE  </span>
        <span style={{ fontSize:12, color:SLATE2 }}>{article.boardRelevance}</span>
      </div>

      <div style={{ display:"flex", gap:8, marginTop:2 }}>
        <button onClick={onAsk}
          style={{ flex:1, padding:"8px", background:`${journal.color}14`, border:`1px solid ${journal.color}35`, color:journal.color, borderRadius:8, cursor:"pointer", fontSize:12, fontFamily:"monospace", fontWeight:700 }}>
          🤖 Ask AI
        </button>
        <a href={article.searchUrl} target="_blank" rel="noreferrer"
          style={{ padding:"8px 14px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:SLATE, borderRadius:8, fontSize:12, fontFamily:"monospace", textDecoration:"none", display:"flex", alignItems:"center" }}>
          PubMed →
        </a>
      </div>
    </div>
  );
}
