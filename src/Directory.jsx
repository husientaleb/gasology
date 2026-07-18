import { useState, useEffect } from "react";
import {
  RESIDENCY_PROGRAMS, FELLOWSHIPS, FELLOWSHIP_TYPES, US_STATES,
  residencySlug, fellowshipSlug, findResidency, findFellowship,
} from "./data/programs.js";
import { residencyMeta, fellowshipMeta } from "./data/seo.js";

const NAVY="#08172e", NAVY2="#0f2240", NAVY3="#1a3460";
const TEAL="#00c9b1", SLATE="#6e90b8", SLATE2="#a8c0d8";
const WHITE="#f0f6ff", GOLD="#f0bc3a", GREEN="#2ed47a", RED="#e05555";


const typeColors = {
  "Regional Anesthesia & Acute Pain": TEAL,
  "Adult Cardiothoracic Anesthesia": "#e05555",
  "Pain Medicine": GOLD,
  "Neuroanesthesia": "#a78bfa",
  "Pediatric Anesthesia": "#34d399",
  "Critical Care Medicine": "#60a5fa",
  "Obstetric Anesthesia": "#f472b6",
  "Global Health Anesthesia": "#fb923c",
  "Research / Academic Fellowship": SLATE2,
};

// ── PROGRAM INQUIRY EMAIL GENERATOR ─────────────────────────────────────────
function PitchModal({program, onClose}){
  // Works for both directories: fellowships have a `type`, residencies don't.
  const programName = program.type
    ? `${program.type} Fellowship`
    : "Anesthesiology Residency Program";
  const subject = `Inquiry — ${programName} at ${program.institution}`;
  const body = `Dear ${program.director || "Program Director"},

My name is [Your Name], and I am [a medical student at Your Institution / an anesthesia resident at Your Institution] interested in the ${programName} at ${program.institution}.

I am reaching out to learn more about your program. In particular, I would appreciate any information regarding:
• The application timeline and requirements
• [Rotations, research opportunities, or areas of focus you're curious about]
• Opportunities to visit or connect with current trainees

I have attached my CV for your reference and would welcome the chance to speak with you or a member of your team.

Thank you very much for your time and consideration.

Best regards,
[Your Name]
[Your Institution]
[Your Email / Phone]`;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{background:NAVY2,border:`1px solid rgba(0,201,177,0.3)`,borderRadius:"16px",padding:"28px",maxWidth:"640px",width:"100%",maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:"18px",fontWeight:700,color:WHITE}}>📧 Contact Program</div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:SLATE,cursor:"pointer",fontSize:"20px"}}>✕</button>
        </div>
        <div style={{marginBottom:"12px"}}>
          <div style={{fontSize:"11px",color:SLATE,fontFamily:"monospace",marginBottom:"4px"}}>TO</div>
          <div style={{fontSize:"14px",color:WHITE}}>{program.email || `program.director@${program.institution.toLowerCase().replace(/\s/g,"")}..edu`}</div>
        </div>
        <div style={{marginBottom:"16px"}}>
          <div style={{fontSize:"11px",color:SLATE,fontFamily:"monospace",marginBottom:"4px"}}>SUBJECT</div>
          <div style={{fontSize:"14px",color:TEAL,fontFamily:"monospace"}}>{subject}</div>
        </div>
        <div style={{background:"rgba(255,255,255,0.04)",borderRadius:"10px",padding:"16px",fontSize:"13px",color:SLATE2,lineHeight:1.8,whiteSpace:"pre-wrap",fontFamily:"monospace",marginBottom:"16px"}}>{body}</div>
        <div style={{display:"flex",gap:"10px"}}>
          <button onClick={()=>{navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);}}
            style={{flex:1,padding:"10px",background:`${TEAL}18`,border:`1px solid ${TEAL}`,color:TEAL,borderRadius:"8px",cursor:"pointer",fontSize:"13px",fontFamily:"monospace",fontWeight:700}}>
            📋 Copy Email
          </button>
          {program.email&&(
            <a href={`mailto:${program.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
              style={{flex:1,padding:"10px",background:`linear-gradient(135deg,${TEAL},#00a896)`,color:NAVY,borderRadius:"8px",cursor:"pointer",fontSize:"13px",fontFamily:"monospace",fontWeight:700,textDecoration:"none",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>
              📤 Open in Mail
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Real <a> hrefs so crawlers can discover program pages from the prerendered
// HTML; onNav keeps in-app clicks on the SPA fast path (no full reload).
const spaLink = (path, onNav) => ({
  href: path,
  onClick: (e) => { if (onNav) { e.preventDefault(); onNav(path.replace(/^\//, "")); } },
});

// ── RESIDENCY DIRECTORY ──────────────────────────────────────────────────────
export function ResidencyDirectory({onBack, onNav}){
  const [search, setSearch]=useState("");
  const [stateFilter, setStateFilter]=useState("All");
  const [pitchTarget, setPitchTarget]=useState(null);

  const filtered = RESIDENCY_PROGRAMS.filter(p=>{
    const matchSearch = !search || p.institution.toLowerCase().includes(search.toLowerCase()) || p.program.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase());
    const matchState = stateFilter==="All" || p.state===stateFilter;
    return matchSearch && matchState;
  });

  return(
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:NAVY,fontFamily:"Georgia,serif",overflow:"hidden"}}>
      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2d4a6b;border-radius:4px}`}</style>

      {pitchTarget&&<PitchModal program={pitchTarget} onClose={()=>setPitchTarget(null)}/>}

      {/* Header */}
      <div style={{background:NAVY2,borderBottom:`1px solid rgba(255,255,255,0.08)`,padding:"14px 20px",display:"flex",alignItems:"center",gap:"12px",flexShrink:0}}>
        <button onClick={onBack} style={{background:"transparent",border:`1px solid rgba(255,255,255,0.18)`,color:SLATE,borderRadius:"7px",padding:"5px 11px",cursor:"pointer",fontSize:"12px",fontFamily:"monospace"}}>← Back</button>
        <div style={{flex:1}}>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"20px",fontWeight:700,color:WHITE,margin:0}}>🏥 Anesthesia Residency Programs</h1>
          <div style={{fontSize:"11px",color:SLATE,fontFamily:"monospace"}}>{filtered.length} programs · ACGME Accredited · United States</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{background:NAVY2,borderBottom:`1px solid rgba(255,255,255,0.06)`,padding:"12px 20px",display:"flex",gap:"10px",flexWrap:"wrap",flexShrink:0}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search institution, city..."
          style={{flex:1,minWidth:"200px",padding:"8px 14px",background:"rgba(255,255,255,0.06)",border:`1px solid rgba(255,255,255,0.12)`,borderRadius:"8px",color:WHITE,fontSize:"13px",fontFamily:"monospace",outline:"none"}}/>
        <select value={stateFilter} onChange={e=>setStateFilter(e.target.value)}
          style={{padding:"8px 14px",background:NAVY3,border:`1px solid rgba(255,255,255,0.12)`,borderRadius:"8px",color:WHITE,fontSize:"13px",fontFamily:"monospace",cursor:"pointer"}}>
          <option value="All">All States</option>
          {US_STATES.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
        <div style={{display:"grid",gap:"10px"}}>
          {filtered.map(p=>(
            <div key={p.id} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"12px",padding:"16px 20px",display:"grid",gridTemplateColumns:"1fr auto",gap:"12px",alignItems:"center",transition:"border-color 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,201,177,0.25)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"}}>
                  <a {...spaLink(`/residency/${residencySlug(p)}`, onNav)} style={{fontFamily:"'Playfair Display',serif",fontSize:"15px",fontWeight:700,color:WHITE,textDecoration:"none"}}>{p.institution}</a>
                  <span style={{background:"rgba(255,255,255,0.06)",color:SLATE,fontSize:"10px",fontFamily:"monospace",padding:"2px 7px",borderRadius:"4px"}}>{p.state}</span>
                  <span style={{background:`${TEAL}15`,color:TEAL,fontSize:"10px",fontFamily:"monospace",padding:"2px 7px",borderRadius:"4px"}}>{p.size}</span>
                </div>
                <div style={{fontSize:"13px",color:SLATE2,marginBottom:"6px"}}>{p.city}, {p.state} · {p.director}</div>
                <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                  {p.email&&<span style={{fontSize:"11px",color:SLATE,fontFamily:"monospace"}}>✉ {p.email}</span>}
                  {p.website&&<a href={p.website} target="_blank" rel="noreferrer" style={{fontSize:"11px",color:TEAL,fontFamily:"monospace",textDecoration:"none"}}>🔗 Website</a>}
                </div>
              </div>
              <div style={{display:"flex",gap:"8px",flexDirection:"column"}}>
                <button onClick={()=>setPitchTarget(p)}
                  style={{background:`${TEAL}15`,border:`1px solid ${TEAL}40`,color:TEAL,borderRadius:"7px",padding:"6px 14px",cursor:"pointer",fontSize:"11px",fontFamily:"monospace",fontWeight:700,whiteSpace:"nowrap"}}>
                  📧 Contact
                </button>
                {p.website&&<a href={p.website} target="_blank" rel="noreferrer"
                  style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:SLATE,borderRadius:"7px",padding:"6px 14px",cursor:"pointer",fontSize:"11px",fontFamily:"monospace",textDecoration:"none",textAlign:"center"}}>
                  Visit →
                </a>}
              </div>
            </div>
          ))}
        </div>
        {filtered.length===0&&(
          <div style={{textAlign:"center",padding:"60px 20px",color:SLATE}}>
            <div style={{fontSize:"40px",marginBottom:"12px"}}>🔍</div>
            <div style={{fontFamily:"monospace",fontSize:"14px"}}>No programs match your search</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FELLOWSHIP DIRECTORY ─────────────────────────────────────────────────────
export function FellowshipDirectory({onBack, onNav}){
  const [search, setSearch]=useState("");
  const [typeFilter, setTypeFilter]=useState("All");
  const [stateFilter, setStateFilter]=useState("All");
  const [pitchTarget, setPitchTarget]=useState(null);

  const filtered = FELLOWSHIPS.filter(f=>{
    const matchSearch = !search || f.institution.toLowerCase().includes(search.toLowerCase()) || f.type.toLowerCase().includes(search.toLowerCase()) || f.city.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter==="All" || f.type===typeFilter;
    const matchState = stateFilter==="All" || f.state===stateFilter;
    return matchSearch && matchType && matchState;
  });

  const fellowStates = [...new Set(FELLOWSHIPS.map(f=>f.state))].sort();

  return(
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:NAVY,fontFamily:"Georgia,serif",overflow:"hidden"}}>
      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2d4a6b;border-radius:4px}`}</style>

      {pitchTarget&&<PitchModal program={pitchTarget} onClose={()=>setPitchTarget(null)}/>}

      {/* Header */}
      <div style={{background:NAVY2,borderBottom:`1px solid rgba(255,255,255,0.08)`,padding:"14px 20px",display:"flex",alignItems:"center",gap:"12px",flexShrink:0}}>
        <button onClick={onBack} style={{background:"transparent",border:`1px solid rgba(255,255,255,0.18)`,color:SLATE,borderRadius:"7px",padding:"5px 11px",cursor:"pointer",fontSize:"12px",fontFamily:"monospace"}}>← Back</button>
        <div style={{flex:1}}>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"20px",fontWeight:700,color:WHITE,margin:0}}>🎓 Anesthesia Fellowship Programs</h1>
          <div style={{fontSize:"11px",color:SLATE,fontFamily:"monospace"}}>{filtered.length} fellowships · {FELLOWSHIP_TYPES.length} specialty types · United States</div>
        </div>
      </div>

      {/* Type filter pills */}
      <div style={{background:NAVY2,borderBottom:`1px solid rgba(255,255,255,0.06)`,padding:"10px 16px",display:"flex",gap:"6px",overflowX:"auto",flexShrink:0}}>
        {["All",...FELLOWSHIP_TYPES].map(t=>(
          <button key={t} onClick={()=>setTypeFilter(t)}
            style={{background:typeFilter===t?(typeColors[t]||TEAL):"rgba(255,255,255,0.04)",color:typeFilter===t?NAVY:SLATE,border:`1px solid ${typeFilter===t?(typeColors[t]||TEAL):"rgba(255,255,255,0.1)"}`,borderRadius:"20px",padding:"5px 12px",cursor:"pointer",fontSize:"11px",fontFamily:"monospace",whiteSpace:"nowrap",fontWeight:typeFilter===t?700:400}}>
            {t==="All"?"All Types":t}
          </button>
        ))}
      </div>

      {/* Search + state filter */}
      <div style={{background:NAVY2,borderBottom:`1px solid rgba(255,255,255,0.06)`,padding:"10px 16px",display:"flex",gap:"10px",flexShrink:0}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search institution, city..."
          style={{flex:1,padding:"8px 14px",background:"rgba(255,255,255,0.06)",border:`1px solid rgba(255,255,255,0.12)`,borderRadius:"8px",color:WHITE,fontSize:"13px",fontFamily:"monospace",outline:"none"}}/>
        <select value={stateFilter} onChange={e=>setStateFilter(e.target.value)}
          style={{padding:"8px 14px",background:NAVY3,border:`1px solid rgba(255,255,255,0.12)`,borderRadius:"8px",color:WHITE,fontSize:"13px",fontFamily:"monospace",cursor:"pointer"}}>
          <option value="All">All States</option>
          {fellowStates.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Cards */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:"12px"}}>
          {filtered.map(f=>{
            const color = typeColors[f.type]||TEAL;
            return(
              <div key={f.id} style={{background:"rgba(255,255,255,0.03)",border:`1px solid rgba(255,255,255,0.07)`,borderRadius:"14px",padding:"18px 20px",transition:"border-color 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=`${color}40`}
                onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"8px",marginBottom:"10px"}}>
                  <div>
                    <div style={{display:"inline-block",background:`${color}18`,border:`1px solid ${color}40`,color:color,fontSize:"10px",fontFamily:"monospace",padding:"2px 8px",borderRadius:"4px",marginBottom:"6px"}}>{f.type}</div>
                    <a {...spaLink(`/fellowship/${fellowshipSlug(f)}`, onNav)} style={{display:"block",fontFamily:"'Playfair Display',serif",fontSize:"15px",fontWeight:700,color:WHITE,lineHeight:1.3,textDecoration:"none"}}>{f.institution}</a>
                    <div style={{fontSize:"12px",color:SLATE2,marginTop:"3px"}}>{f.city}, {f.state} · {f.duration}</div>
                  </div>
                </div>
                <div style={{fontSize:"12px",color:SLATE,marginBottom:"12px",fontFamily:"monospace"}}>
                  {f.director&&<div>👤 {f.director}</div>}
                  {f.email&&<div style={{marginTop:"3px"}}>✉ {f.email}</div>}
                </div>
                <div style={{display:"flex",gap:"8px"}}>
                  <button onClick={()=>setPitchTarget(f)}
                    style={{flex:1,background:`${color}12`,border:`1px solid ${color}35`,color:color,borderRadius:"7px",padding:"7px",cursor:"pointer",fontSize:"11px",fontFamily:"monospace",fontWeight:700}}>
                    📧 Contact Program
                  </button>
                  {f.website&&<a href={f.website} target="_blank" rel="noreferrer"
                    style={{padding:"7px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:SLATE,borderRadius:"7px",cursor:"pointer",fontSize:"11px",fontFamily:"monospace",textDecoration:"none",display:"flex",alignItems:"center"}}>
                    →
                  </a>}
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length===0&&(
          <div style={{textAlign:"center",padding:"60px 20px",color:SLATE}}>
            <div style={{fontSize:"40px",marginBottom:"12px"}}>🔍</div>
            <div style={{fontFamily:"monospace",fontSize:"14px"}}>No fellowships match your search</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── PROGRAM DETAIL PAGE ──────────────────────────────────────────────────────
// One page per program at /residency/<slug> and /fellowship/<slug>. These
// routes are prerendered at build time (scripts/prerender.mjs) so crawlers
// get unique titles, descriptions, and h1s per program.
export function ProgramDetail({kind, slug, onBack, onNav}){
  const isResidency = kind==="residency";
  const program = isResidency ? findResidency(slug) : findFellowship(slug);
  const [pitchOpen, setPitchOpen] = useState(false);

  useEffect(()=>{
    if(!program) return;
    const meta = isResidency ? residencyMeta(program) : fellowshipMeta(program);
    document.title = meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if(desc) desc.setAttribute("content", meta.description);
  },[program, isResidency]);

  if(!program){
    return(
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"16px",background:NAVY,color:SLATE2,fontFamily:"Georgia,serif"}}>
        <div style={{fontSize:"40px"}}>🔍</div>
        <div style={{fontFamily:"monospace",fontSize:"14px"}}>Program not found</div>
        <a {...spaLink(isResidency?"/residency":"/fellowship", onNav)} style={{color:TEAL,fontFamily:"monospace",fontSize:"13px"}}>← Back to the {isResidency?"residency":"fellowship"} directory</a>
      </div>
    );
  }

  const color = isResidency ? TEAL : (typeColors[program.type]||TEAL);
  const heading = isResidency
    ? `${program.program} — Anesthesiology Residency in ${program.city}, ${program.state}`
    : `${program.type} Fellowship at ${program.institution} — ${program.city}, ${program.state}`;
  const facts = isResidency
    ? [["Institution",program.institution],["City",`${program.city}, ${program.state}`],["Program type",program.size],["Program director",program.director],["Accreditation","ACGME"]]
    : [["Institution",program.institution],["City",`${program.city}, ${program.state}`],["Subspecialty",program.type],["Duration",program.duration],["Program director",program.director]];

  return(
    <div style={{minHeight:"100vh",background:NAVY,fontFamily:"Georgia,serif",color:WHITE}}>
      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2d4a6b;border-radius:4px}`}</style>
      {pitchOpen&&<PitchModal program={program} onClose={()=>setPitchOpen(false)}/>}

      <div style={{background:NAVY2,borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"14px 20px",display:"flex",alignItems:"center",gap:"12px"}}>
        <button onClick={onBack} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.18)",color:SLATE,borderRadius:"7px",padding:"5px 11px",cursor:"pointer",fontSize:"12px",fontFamily:"monospace"}}>← Back</button>
        <a {...spaLink(isResidency?"/residency":"/fellowship", onNav)} style={{color:SLATE,fontSize:"12px",fontFamily:"monospace",textDecoration:"none"}}>
          {isResidency?"🏥 Residency Directory":"🎓 Fellowship Directory"} / <span style={{color:SLATE2}}>{program.institution}</span>
        </a>
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"40px 24px 80px"}}>
        <div style={{display:"inline-block",background:`${color}18`,border:`1px solid ${color}40`,color,fontSize:"11px",fontFamily:"monospace",padding:"3px 10px",borderRadius:"5px",marginBottom:"14px"}}>
          {isResidency ? "ANESTHESIOLOGY RESIDENCY" : program.type.toUpperCase()}
        </div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,4vw,34px)",fontWeight:800,lineHeight:1.2,margin:"0 0 10px"}}>{heading}</h1>
        <p style={{fontSize:"15px",color:SLATE2,lineHeight:1.7,margin:"0 0 28px"}}>
          {isResidency
            ? `${program.institution} offers an ACGME-accredited anesthesiology residency program in ${program.city}, ${program.state}. Contact the program below or visit its website for application details.`
            : `${program.institution} offers a ${program.duration} ${program.type} fellowship in ${program.city}, ${program.state}. Contact the program below or visit its website for application details.`}
        </p>

        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"20px 24px",marginBottom:"24px"}}>
          {facts.map(([k,v])=>(
            <div key={k} style={{display:"flex",gap:"12px",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",fontSize:"13px"}}>
              <span style={{width:140,flexShrink:0,color:SLATE,fontFamily:"monospace"}}>{k}</span>
              <span style={{color:SLATE2}}>{v}</span>
            </div>
          ))}
          {program.email&&(
            <div style={{display:"flex",gap:"12px",padding:"7px 0",fontSize:"13px"}}>
              <span style={{width:140,flexShrink:0,color:SLATE,fontFamily:"monospace"}}>Email</span>
              <a href={`mailto:${program.email}`} style={{color:TEAL,textDecoration:"none"}}>{program.email}</a>
            </div>
          )}
        </div>

        <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
          <button onClick={()=>setPitchOpen(true)}
            style={{background:`${color}15`,border:`1px solid ${color}50`,color,borderRadius:"9px",padding:"11px 20px",cursor:"pointer",fontSize:"13px",fontFamily:"monospace",fontWeight:700}}>
            📧 Contact Program
          </button>
          {program.website&&(
            <a href={program.website} target="_blank" rel="noreferrer"
              style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",color:SLATE2,borderRadius:"9px",padding:"11px 20px",fontSize:"13px",fontFamily:"monospace",textDecoration:"none"}}>
              🔗 Program Website →
            </a>
          )}
          <a {...spaLink(isResidency?"/residency":"/fellowship", onNav)}
            style={{background:"transparent",border:"1px solid rgba(255,255,255,0.12)",color:SLATE,borderRadius:"9px",padding:"11px 20px",fontSize:"13px",fontFamily:"monospace",textDecoration:"none"}}>
            View all {isResidency?"residency programs":"fellowships"} →
          </a>
        </div>
      </div>
    </div>
  );
}
