import { useState, useEffect } from "react";

// ── THEME ────────────────────────────────────────────────────────────────────
const NAVY   = "#07152a";
const NAVY2  = "#0d1f3c";
const NAVY3  = "#132848";
const TEAL   = "#00c9b1";
const TEAL2  = "#00a896";
const SLATE  = "#5a7fa8";
const SLATE2 = "#8fb3d4";
const WHITE  = "#eef4ff";
const GOLD   = "#e8b84b";
const GREEN  = "#27c97a";
const RED    = "#e05252";
const PURPLE = "#9d78f5";
const ORANGE = "#f59342";

// ── WEEK SEED ────────────────────────────────────────────────────────────────
function getWeekSeed() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0,0,0,0);
  return `${monday.getFullYear()}-W${String(Math.ceil((monday - new Date(monday.getFullYear(),0,1)) / 604800000 + 1)).padStart(2,"0")}`;
}
function getWeekLabel() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay()+6)%7));
  const sunday = new Date(monday); sunday.setDate(monday.getDate()+6);
  const f = d => d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
  return `${f(monday)} – ${f(sunday)}, ${monday.getFullYear()}`;
}

// ── FILTERS ──────────────────────────────────────────────────────────────────
const POSITION_TYPES = ["All","Academic","Private Practice","Locum Tenens","Hospital Employed","Military/VA","Critical Care","Pain Medicine","Pediatric","Cardiac","Regional"];
const US_REGIONS     = ["All","Northeast","Southeast","Midwest","Southwest","West","Remote/Locum"];
const SALARY_RANGES  = ["All","< $300k","$300k–$400k","$400k–$500k","> $500k","Not disclosed"];

// ── AI PROMPT ────────────────────────────────────────────────────────────────
const JOBS_PROMPT = (seed) => `You are a medical recruiting expert. Week: ${seed}.

Generate a realistic weekly job board of 12 open anesthesiologist positions across the United States. Include a diverse mix of practice settings, locations, and specialties. Base these on real types of positions that are commonly advertised on Doximity, Healthcareers, and academic medical center career pages.

Return ONLY valid JSON — no markdown, no preamble. Start with { :

{
  "weekOf": "${getWeekLabel()}",
  "totalJobs": 12,
  "jobs": [
    {
      "id": "job-001",
      "title": "Position title (e.g. Staff Anesthesiologist — Cardiac Focus)",
      "institution": "Hospital or practice name (realistic, not famous)",
      "city": "City",
      "state": "TX",
      "region": "one of: Northeast/Southeast/Midwest/Southwest/West/Remote/Locum",
      "type": "one of: Academic/Private Practice/Locum Tenens/Hospital Employed/Military/VA/Critical Care/Pain Medicine/Pediatric/Cardiac/Regional",
      "salary": "e.g. $380,000–$420,000 or Competitive/Not disclosed",
      "salaryRange": "one of: < $300k / $300k–$400k / $400k–$500k / > $500k / Not disclosed",
      "schedule": "e.g. 4×10 shifts, no overnight call / 1:4 call / Monday–Friday",
      "subspecialty": "main focus e.g. General, Cardiac, Pediatric, Regional, Pain, Neuro, OB, Critical Care",
      "highlights": ["benefit 1", "benefit 2", "benefit 3"],
      "requirements": "Brief: e.g. BC/BE required, fellowship preferred, 2+ yrs experience",
      "applyUrl": "https://www.doximity.com/jobs",
      "postedDays": 3,
      "featured": false,
      "urgent": false,
      "description": "2-3 sentence compelling description of the role, practice environment, and what makes it attractive."
    }
  ],
  "stats": {
    "avgSalary": "$385,000",
    "topState": "TX",
    "topType": "Private Practice",
    "newThisWeek": 12
  }
}

Make 2 jobs "featured: true" and 1 "urgent: true". Vary locations across all US regions. Include a mix of academic, private, locum, and subspecialty roles. Make salaries realistic for 2025-2026. Make the positions feel real and compelling.`;

const SEARCH_PROMPT = (query, seed) => `You are a medical recruiting expert. Week: ${seed}.

An anesthesiologist is searching for jobs matching: "${query}"

Generate 6 relevant anesthesiologist job listings matching this search. Be specific and relevant to the query.

Return ONLY a valid JSON array — no markdown, start with [:
[
  {
    "id": "s-001",
    "title": "Position title",
    "institution": "Hospital or practice name",
    "city": "City",
    "state": "State abbreviation",
    "region": "Northeast/Southeast/Midwest/Southwest/West/Remote/Locum",
    "type": "Academic/Private Practice/Locum Tenens/Hospital Employed/Critical Care/Pain Medicine/Pediatric/Cardiac/Regional",
    "salary": "salary range or Competitive",
    "salaryRange": "< $300k / $300k–$400k / $400k–$500k / > $500k / Not disclosed",
    "schedule": "schedule description",
    "subspecialty": "focus area",
    "highlights": ["benefit 1", "benefit 2", "benefit 3"],
    "requirements": "requirements summary",
    "applyUrl": "https://www.doximity.com/jobs",
    "postedDays": 5,
    "featured": false,
    "urgent": false,
    "description": "2-3 sentence description."
  }
]`;

// ── TYPE COLORS ───────────────────────────────────────────────────────────────
const typeColor = {
  "Academic": PURPLE, "Private Practice": TEAL, "Locum Tenens": ORANGE,
  "Hospital Employed": "#60a5fa", "Military/VA": GREEN, "Critical Care": RED,
  "Pain Medicine": GOLD, "Pediatric": "#f472b6", "Cardiac": RED,
  "Regional": ORANGE, "Remote/Locum": ORANGE,
};

const regionEmoji = {
  "Northeast":"🗽","Southeast":"🌴","Midwest":"🌾","Southwest":"🌵","West":"🏔️","Remote/Locum":"✈️"
};

// ── JOB CARD ─────────────────────────────────────────────────────────────────
function JobCard({ job, expanded, onToggle }) {
  const color = typeColor[job.type] || TEAL;
  const isNew = job.postedDays <= 3;

  return (
    <div onClick={onToggle}
      style={{
        background: expanded
          ? `linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))`
          : job.featured ? `linear-gradient(135deg,rgba(0,201,177,0.07),rgba(0,201,177,0.02))` : "rgba(255,255,255,0.03)",
        border: `1.5px solid ${expanded ? color+"60" : job.featured ? TEAL+"40" : "rgba(255,255,255,0.09)"}`,
        borderRadius: 18, padding: "22px 24px", cursor: "pointer",
        transition: "all 0.25s", marginBottom: 1,
        boxShadow: expanded ? `0 8px 40px rgba(0,0,0,0.3)` : job.featured ? `0 4px 20px rgba(0,201,177,0.08)` : "none",
      }}
      onMouseEnter={e => { if(!expanded) e.currentTarget.style.borderColor = `${color}40`; }}
      onMouseLeave={e => { if(!expanded) e.currentTarget.style.borderColor = job.featured ? `${TEAL}40` : "rgba(255,255,255,0.09)"; }}>

      {/* Badges row */}
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12,alignItems:"center"}}>
        {job.featured && (
          <span style={{background:`${TEAL}20`,border:`1px solid ${TEAL}50`,color:TEAL,fontSize:10,fontFamily:"monospace",padding:"2px 9px",borderRadius:20,fontWeight:700}}>⭐ FEATURED</span>
        )}
        {job.urgent && (
          <span style={{background:`${RED}20`,border:`1px solid ${RED}50`,color:RED,fontSize:10,fontFamily:"monospace",padding:"2px 9px",borderRadius:20,fontWeight:700}}>🔴 URGENT HIRE</span>
        )}
        {isNew && (
          <span style={{background:`${GREEN}20`,border:`1px solid ${GREEN}50`,color:GREEN,fontSize:10,fontFamily:"monospace",padding:"2px 9px",borderRadius:20,fontWeight:700}}>✨ NEW</span>
        )}
        <span style={{background:`${color}18`,border:`1px solid ${color}40`,color,fontSize:10,fontFamily:"monospace",padding:"2px 9px",borderRadius:20,fontWeight:700}}>{job.type}</span>
        <span style={{background:"rgba(255,255,255,0.06)",color:SLATE2,fontSize:10,fontFamily:"monospace",padding:"2px 9px",borderRadius:20}}>{job.subspecialty}</span>
        <span style={{marginLeft:"auto",fontSize:11,color:SLATE,fontFamily:"monospace"}}>{job.postedDays}d ago</span>
      </div>

      {/* Title + location */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:10}}>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:800,color:WHITE,lineHeight:1.3,marginBottom:4}}>
            {job.title}
          </div>
          <div style={{fontSize:14,color:SLATE2,fontWeight:500}}>
            {job.institution}
          </div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontSize:15,fontWeight:700,color:GOLD,fontFamily:"'DM Mono',monospace"}}>{job.salary}</div>
          <div style={{fontSize:12,color:SLATE,marginTop:2}}>
            {regionEmoji[job.region]} {job.city}, {job.state}
          </div>
        </div>
      </div>

      {/* Schedule pill */}
      <div style={{fontSize:12,color:SLATE2,fontFamily:"monospace",marginBottom: expanded ? 16 : 0}}>
        🕐 {job.schedule}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{marginTop:16,animation:"expandIn 0.25s ease both"}}>

          {/* Description */}
          <div style={{fontSize:14,color:SLATE2,lineHeight:1.75,marginBottom:16}}>
            {job.description}
          </div>

          {/* Highlights */}
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"14px 18px",marginBottom:14}}>
            <div style={{fontSize:10,color:TEAL,fontFamily:"monospace",letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>✅ Benefits & Highlights</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {job.highlights.map((h,i) => (
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{color:GREEN,flexShrink:0,fontSize:13}}>→</span>
                  <span style={{fontSize:13,color:SLATE2,lineHeight:1.5}}>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div style={{background:`${GOLD}08`,border:`1px solid ${GOLD}20`,borderRadius:10,padding:"12px 16px",marginBottom:16}}>
            <div style={{fontSize:10,color:GOLD,fontFamily:"monospace",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>📋 Requirements</div>
            <div style={{fontSize:13,color:SLATE2,lineHeight:1.6}}>{job.requirements}</div>
          </div>

          {/* Apply button */}
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <a href={job.applyUrl} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()}
              style={{flex:1,padding:"12px 20px",background:`linear-gradient(135deg,${TEAL},${TEAL2})`,color:NAVY,borderRadius:10,textDecoration:"none",fontWeight:800,fontSize:14,fontFamily:"'DM Sans',sans-serif",textAlign:"center",display:"block",minWidth:140}}>
              Apply Now →
            </a>
            <button onClick={e => { e.stopPropagation(); navigator.clipboard?.writeText(`${job.title} at ${job.institution}, ${job.city} ${job.state} — ${job.salary}`); }}
              style={{padding:"12px 18px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.14)",color:SLATE2,borderRadius:10,cursor:"pointer",fontSize:13,fontFamily:"monospace",fontWeight:600}}>
              📋 Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SKELETON ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div>
      <style>{`@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}.sk{background:linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%);background-size:600px 100%;animation:shimmer 1.4s infinite;border-radius:8px}`}</style>
      {[...Array(6)].map((_,i) => (
        <div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18,padding:"22px 24px",marginBottom:10}}>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {[70,60,50].map((w,j) => <div key={j} className="sk" style={{height:20,width:w,borderRadius:20}}/>)}
          </div>
          <div className="sk" style={{height:22,width:"65%",marginBottom:8}}/>
          <div className="sk" style={{height:16,width:"40%",marginBottom:12}}/>
          <div className="sk" style={{height:14,width:"50%"}}/>
        </div>
      ))}
    </div>
  );
}

// ── STATS BAR ─────────────────────────────────────────────────────────────────
function StatsBar({ stats, total }) {
  return (
    <div style={{display:"flex",gap:0,flexWrap:"wrap",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,overflow:"hidden",marginBottom:24}}>
      {[
        {label:"Open Positions",value:total||stats?.newThisWeek||0,color:TEAL},
        {label:"Avg Salary",value:stats?.avgSalary||"$385k",color:GOLD},
        {label:"Top State",value:stats?.topState||"—",color:GREEN},
        {label:"Top Type",value:stats?.topType||"—",color:PURPLE},
      ].map((s,i) => (
        <div key={i} style={{flex:1,minWidth:120,padding:"16px 20px",borderRight:i<3?"1px solid rgba(255,255,255,0.06)":"none",textAlign:"center"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:s.color}}>{s.value}</div>
          <div style={{fontSize:11,color:SLATE,fontFamily:"monospace",marginTop:2}}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function JobsBoard({ onBack }) {
  const [jobs,         setJobs]         = useState(null);
  const [stats,        setStats]        = useState(null);
  const [weekOf,       setWeekOf]       = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [expandedId,   setExpandedId]   = useState(null);
  const [typeFilter,   setTypeFilter]   = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [salaryFilter, setSalaryFilter] = useState("All");
  const [searchInput,  setSearchInput]  = useState("");
  const [searchMode,   setSearchMode]   = useState(false);
  const [searchResults,setSearchResults]= useState(null);
  const [searchLoading,setSearchLoading]= useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [view,         setView]         = useState("board"); // board | search | post
  const weekSeed = getWeekSeed();

  useEffect(() => { loadJobs(); }, []);

  const loadJobs = async () => {
    setLoading(true); setError(""); setJobs(null);
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:4000,
          system:"You are a medical recruiting expert. Return ONLY valid JSON. No markdown fences. Start your response with { and end with }.",
          messages:[{role:"user",content:JOBS_PROMPT(weekSeed)}]
        })
      });
      const data = await res.json();
      if(data.error) throw new Error(data.error.message||"API error");
      const raw = data.content?.map(b=>b.text||"").join("")||"";
      const s = raw.indexOf("{"), e = raw.lastIndexOf("}");
      if(s===-1) throw new Error("No data returned");
      const parsed = JSON.parse(raw.slice(s,e+1));
      setJobs(parsed.jobs||[]);
      setStats(parsed.stats||{});
      setWeekOf(parsed.weekOf||getWeekLabel());
    } catch(e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const runSearch = async (q) => {
    if(!q.trim()) return;
    setSearchLoading(true); setSearchResults(null); setSearchQuery(q);
    try {
      const res = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:3000,
          system:"You are a medical recruiting expert. Return ONLY a valid JSON array. No markdown. Start with [ and end with ].",
          messages:[{role:"user",content:SEARCH_PROMPT(q,weekSeed)}]
        })
      });
      const data = await res.json();
      if(data.error) throw new Error(data.error.message||"API error");
      const raw = data.content?.map(b=>b.text||"").join("")||"";
      const s=raw.indexOf("["),e=raw.lastIndexOf("]");
      if(s===-1) throw new Error("No results");
      const parsed = JSON.parse(raw.slice(s,e+1));
      setSearchResults(parsed);
    } catch(e) {
      setError(e.message);
    }
    setSearchLoading(false);
  };

  // Filter
  const filtered = (jobs||[]).filter(j => {
    const mt = typeFilter==="All" || j.type===typeFilter;
    const mr = regionFilter==="All" || j.region===regionFilter;
    const ms = salaryFilter==="All" || j.salaryRange===salaryFilter;
    return mt && mr && ms;
  });

  const featured = filtered.filter(j=>j.featured);
  const regular  = filtered.filter(j=>!j.featured);

  const SUGGESTED_SEARCHES = [
    "Cardiac anesthesia Texas","Pediatric anesthesia academic","Locum tenens flexible schedule",
    "Pain medicine fellowship trained","Private practice no call","West Coast hospital employed",
    "CRNA collaborative practice","Critical care intensivist"
  ];

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:NAVY,fontFamily:"Georgia,serif",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:4px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes expandIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .pill{transition:all 0.18s;cursor:pointer}
        .pill:hover{transform:translateY(-1px)!important}
        input:focus{border-color:${TEAL}!important;outline:none;box-shadow:0 0 0 3px rgba(0,201,177,0.12)}
        .job-tab:hover{background:rgba(255,255,255,0.08)!important}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{background:NAVY2,borderBottom:`1px solid rgba(255,255,255,0.08)`,padding:"0 24px",height:66,display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
        <button onClick={onBack} style={{background:"transparent",border:`1px solid rgba(255,255,255,0.18)`,color:SLATE,borderRadius:8,padding:"7px 13px",cursor:"pointer",fontSize:12,fontFamily:"monospace",flexShrink:0}}>← Back</button>

        <div style={{flex:1,display:"flex",alignItems:"center",gap:14}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,color:WHITE,lineHeight:1}}>
              💼 Anesthesiologist Jobs
            </div>
            <div style={{fontSize:11,color:SLATE,fontFamily:"monospace",marginTop:2}}>
              {weekOf ? `Week of ${weekOf}` : getWeekLabel()} · AI-curated · Updated weekly
            </div>
          </div>
          {jobs && (
            <div style={{display:"flex",gap:7}}>
              <span style={{background:`${GREEN}18`,border:`1px solid ${GREEN}30`,color:GREEN,fontSize:11,fontFamily:"monospace",padding:"3px 10px",borderRadius:20,fontWeight:700}}>
                {filtered.length} open positions
              </span>
              <span style={{background:`${TEAL}18`,border:`1px solid ${TEAL}30`,color:TEAL,fontSize:11,fontFamily:"monospace",padding:"3px 10px",borderRadius:20}}>
                🤖 AI Weekly Refresh
              </span>
            </div>
          )}
        </div>

        {/* View tabs */}
        <div style={{display:"flex",background:"rgba(255,255,255,0.06)",borderRadius:10,padding:3,gap:2,flexShrink:0}}>
          {[["board","📋 Job Board"],["search","🔍 Search"],["post","📨 Post a Job"]].map(([v,label])=>(
            <button key={v} onClick={()=>setView(v)}
              style={{background:view===v?TEAL:"transparent",color:view===v?NAVY:SLATE2,border:"none",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:11,fontFamily:"monospace",fontWeight:700,transition:"all 0.2s",whiteSpace:"nowrap"}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{flex:1,overflowY:"auto",padding:"20px 24px 48px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>

          {/* ══ JOB BOARD VIEW ══ */}
          {view==="board" && (
            <>
              {/* Stats */}
              {jobs && <StatsBar stats={stats} total={filtered.length}/>}

              {/* Filters */}
              {jobs && (
                <div style={{marginBottom:20}}>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10,alignItems:"center"}}>
                    <span style={{fontSize:11,color:SLATE,fontFamily:"monospace"}}>Type:</span>
                    {POSITION_TYPES.map(t=>(
                      <button key={t} className="pill" onClick={()=>setTypeFilter(t)}
                        style={{background:typeFilter===t?(typeColor[t]||TEAL):"rgba(255,255,255,0.05)",color:typeFilter===t?NAVY:SLATE2,border:`1px solid ${typeFilter===t?(typeColor[t]||TEAL):"rgba(255,255,255,0.1)"}`,borderRadius:20,padding:"4px 11px",fontSize:11,fontFamily:"monospace",fontWeight:typeFilter===t?700:400}}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10,alignItems:"center"}}>
                    <span style={{fontSize:11,color:SLATE,fontFamily:"monospace"}}>Region:</span>
                    {US_REGIONS.map(r=>(
                      <button key={r} className="pill" onClick={()=>setRegionFilter(r)}
                        style={{background:regionFilter===r?PURPLE:"rgba(255,255,255,0.05)",color:regionFilter===r?WHITE:SLATE2,border:`1px solid ${regionFilter===r?PURPLE:"rgba(255,255,255,0.1)"}`,borderRadius:20,padding:"4px 11px",fontSize:11,fontFamily:"monospace",fontWeight:regionFilter===r?700:400}}>
                        {regionEmoji[r]||""} {r}
                      </button>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                    <span style={{fontSize:11,color:SLATE,fontFamily:"monospace"}}>Salary:</span>
                    {SALARY_RANGES.map(s=>(
                      <button key={s} className="pill" onClick={()=>setSalaryFilter(s)}
                        style={{background:salaryFilter===s?GOLD:"rgba(255,255,255,0.05)",color:salaryFilter===s?NAVY:SLATE2,border:`1px solid ${salaryFilter===s?GOLD:"rgba(255,255,255,0.1)"}`,borderRadius:20,padding:"4px 11px",fontSize:11,fontFamily:"monospace",fontWeight:salaryFilter===s?700:400}}>
                        {s}
                      </button>
                    ))}
                    <button className="pill" onClick={()=>{setTypeFilter("All");setRegionFilter("All");setSalaryFilter("All");}}
                      style={{background:"rgba(255,255,255,0.05)",color:SLATE,border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"4px 11px",fontSize:11,fontFamily:"monospace",marginLeft:4}}>
                      ✕ Clear
                    </button>
                    <button className="pill" onClick={loadJobs}
                      style={{background:`${TEAL}15`,border:`1px solid ${TEAL}35`,color:TEAL,borderRadius:20,padding:"4px 14px",fontSize:11,fontFamily:"monospace",fontWeight:700,marginLeft:"auto"}}>
                      ↺ Refresh
                    </button>
                  </div>
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div>
                  <div style={{textAlign:"center",padding:"32px 0 20px"}}>
                    <div style={{width:40,height:40,border:`3px solid ${TEAL}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.85s linear infinite",margin:"0 auto 14px"}}/>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:WHITE,marginBottom:4}}>Searching for open positions...</div>
                    <div style={{fontSize:12,color:SLATE,fontFamily:"monospace"}}>AI scanning job boards across the US</div>
                  </div>
                  <Skeleton/>
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <div style={{textAlign:"center",padding:"60px 20px"}}>
                  <div style={{fontSize:40,marginBottom:16}}>⚠️</div>
                  <div style={{color:RED,fontFamily:"monospace",fontSize:13,marginBottom:8}}>Failed to load jobs</div>
                  <div style={{color:SLATE,fontFamily:"monospace",fontSize:12,background:`${RED}10`,border:`1px solid ${RED}20`,borderRadius:10,padding:"10px 16px",maxWidth:400,margin:"0 auto 20px"}}>{error}</div>
                  <button onClick={loadJobs} style={{padding:"10px 24px",background:`${TEAL}18`,border:`1px solid ${TEAL}`,color:TEAL,borderRadius:10,cursor:"pointer",fontFamily:"monospace",fontSize:13,fontWeight:700}}>↺ Try Again</button>
                </div>
              )}

              {/* Jobs */}
              {jobs && !loading && (
                <div style={{animation:"fadeUp 0.4s ease both"}}>
                  {featured.length>0 && (
                    <div style={{marginBottom:24}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                        <div style={{width:3,height:18,background:TEAL,borderRadius:2}}/>
                        <div style={{fontSize:11,color:TEAL,fontFamily:"monospace",letterSpacing:1.5,textTransform:"uppercase",fontWeight:700}}>⭐ Featured Positions</div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:10}}>
                        {featured.map(j=>(
                          <JobCard key={j.id} job={j} expanded={expandedId===j.id} onToggle={()=>setExpandedId(expandedId===j.id?null:j.id)}/>
                        ))}
                      </div>
                    </div>
                  )}
                  {regular.length>0 && (
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                        <div style={{width:3,height:18,background:SLATE,borderRadius:2}}/>
                        <div style={{fontSize:11,color:SLATE,fontFamily:"monospace",letterSpacing:1.5,textTransform:"uppercase",fontWeight:700}}>All Open Positions</div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:10}}>
                        {regular.map(j=>(
                          <JobCard key={j.id} job={j} expanded={expandedId===j.id} onToggle={()=>setExpandedId(expandedId===j.id?null:j.id)}/>
                        ))}
                      </div>
                    </div>
                  )}
                  {filtered.length===0 && (
                    <div style={{textAlign:"center",padding:"48px",color:SLATE}}>
                      <div style={{fontSize:36,marginBottom:12}}>🔍</div>
                      <div style={{fontFamily:"monospace",fontSize:13,marginBottom:12}}>No positions match your filters</div>
                      <button onClick={()=>{setTypeFilter("All");setRegionFilter("All");setSalaryFilter("All");}}
                        style={{padding:"8px 20px",background:`${TEAL}15`,border:`1px solid ${TEAL}`,color:TEAL,borderRadius:8,cursor:"pointer",fontFamily:"monospace",fontSize:12}}>
                        Clear all filters
                      </button>
                    </div>
                  )}
                  <div style={{marginTop:28,textAlign:"center",fontSize:11,color:SLATE,fontFamily:"monospace",lineHeight:1.8}}>
                    📌 Positions are AI-generated weekly for educational & career purposes · Verify with employer before applying<br/>
                    🔄 New positions every Monday · Want to post a real job? Use the "Post a Job" tab
                  </div>
                </div>
              )}
            </>
          )}

          {/* ══ SEARCH VIEW ══ */}
          {view==="search" && (
            <div>
              <div style={{marginBottom:24}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:800,color:WHITE,marginBottom:6}}>Search Positions</div>
                <div style={{fontSize:14,color:SLATE2}}>Search for specific roles, locations, or practice types — AI finds the best matches.</div>
              </div>

              <div style={{display:"flex",gap:10,marginBottom:20}}>
                <input value={searchInput} onChange={e=>setSearchInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&runSearch(searchInput)}
                  placeholder="e.g. 'Cardiac anesthesia Houston', 'pediatric fellowship trained', 'no overnight call Florida'..."
                  style={{flex:1,padding:"14px 18px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.14)",borderRadius:12,color:WHITE,fontSize:14,fontFamily:"'DM Sans',sans-serif",transition:"border-color 0.2s"}}/>
                <button onClick={()=>runSearch(searchInput)} disabled={!searchInput.trim()||searchLoading}
                  style={{padding:"14px 24px",background:searchInput.trim()?`linear-gradient(135deg,${TEAL},${TEAL2})`:"rgba(255,255,255,0.08)",border:"none",color:searchInput.trim()?NAVY:SLATE,borderRadius:12,cursor:searchInput.trim()?"pointer":"not-allowed",fontSize:14,fontFamily:"monospace",fontWeight:700,whiteSpace:"nowrap",transition:"all 0.2s"}}>
                  {searchLoading?"Searching...":"Search →"}
                </button>
              </div>

              {!searchResults && !searchLoading && (
                <div style={{marginBottom:24}}>
                  <div style={{fontSize:11,color:SLATE,fontFamily:"monospace",letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>💡 Try searching for</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {SUGGESTED_SEARCHES.map(s=>(
                      <button key={s} className="pill" onClick={()=>{setSearchInput(s);runSearch(s);}}
                        style={{background:`${TEAL}10`,border:`1px solid ${TEAL}28`,color:TEAL,borderRadius:20,padding:"8px 16px",fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchLoading && (
                <div style={{textAlign:"center",padding:"60px 20px"}}>
                  <div style={{width:44,height:44,border:`3px solid ${TEAL}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.85s linear infinite",margin:"0 auto 16px"}}/>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:WHITE,marginBottom:6}}>Finding matching positions...</div>
                  <div style={{fontSize:13,color:SLATE,fontFamily:"monospace"}}>Query: {searchInput}</div>
                </div>
              )}

              {searchResults && !searchLoading && (
                <div style={{animation:"fadeUp 0.4s ease both"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                    <div>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:WHITE}}>Results: "{searchQuery}"</div>
                      <div style={{fontSize:12,color:SLATE,fontFamily:"monospace",marginTop:2}}>{searchResults.length} positions found</div>
                    </div>
                    <button onClick={()=>{setSearchResults(null);setSearchInput("");}}
                      style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:SLATE,borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontFamily:"monospace"}}>
                      ✕ Clear
                    </button>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {searchResults.map((j,i)=>(
                      <JobCard key={i} job={j} expanded={expandedId===`s${i}`} onToggle={()=>setExpandedId(expandedId===`s${i}`?null:`s${i}`)}/>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ POST A JOB VIEW ══ */}
          {view==="post" && (
            <div style={{maxWidth:600,margin:"0 auto",animation:"fadeUp 0.4s ease both"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:800,color:WHITE,marginBottom:8}}>Post a Job</div>
              <div style={{fontSize:14,color:SLATE2,marginBottom:32,lineHeight:1.7}}>
                Reach thousands of anesthesiologists actively looking for their next position. Gasology is the first anesthesia-specific job board built for physicians.
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:32}}>
                {[
                  {e:"🎯",t:"Targeted Audience",d:"100% anesthesiologists — no noise, no irrelevant candidates"},
                  {e:"📡",t:"Weekly AI Refresh",d:"Your posting gets re-surfaced in the weekly digest"},
                  {e:"🏥",t:"Specialty Filters",d:"Candidates filter by type, region, salary, and subspecialty"},
                  {e:"📰",t:"Journal Digest",d:"Featured jobs appear in the Weekly Digest read by physicians"},
                ].map(item=>(
                  <div key={item.t} style={{display:"flex",gap:14,alignItems:"flex-start",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"16px 18px"}}>
                    <span style={{fontSize:28,flexShrink:0}}>{item.e}</span>
                    <div>
                      <div style={{fontWeight:700,color:WHITE,fontSize:15,marginBottom:4}}>{item.t}</div>
                      <div style={{color:SLATE2,fontSize:13}}>{item.d}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{background:`linear-gradient(135deg,rgba(0,201,177,0.1),rgba(0,201,177,0.03))`,border:`1px solid rgba(0,201,177,0.3)`,borderRadius:18,padding:"28px 32px",textAlign:"center"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:WHITE,marginBottom:8}}>Ready to post?</div>
                <div style={{fontSize:14,color:SLATE2,marginBottom:20}}>Contact us to feature your position on Gasology's job board.</div>
                <a href="mailto:jobs@gasology.co?subject=Post a Job on Gasology"
                  style={{display:"inline-block",padding:"13px 32px",background:`linear-gradient(135deg,${TEAL},${TEAL2})`,color:NAVY,borderRadius:10,textDecoration:"none",fontWeight:800,fontSize:15,fontFamily:"'DM Sans',sans-serif"}}>
                  📧 Contact Us to Post →
                </a>
                <div style={{fontSize:11,color:SLATE,fontFamily:"monospace",marginTop:12}}>jobs@gasology.co · We respond within 24 hours</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
