import { useState } from "react";

const NAVY="#08172e", NAVY2="#0f2240", NAVY3="#1a3460";
const TEAL="#00c9b1", SLATE="#6e90b8", SLATE2="#a8c0d8";
const WHITE="#f0f6ff", GOLD="#f0bc3a", GREEN="#2ed47a", RED="#e05555";
const PURPLE="#a78bfa", ORANGE="#fb923c", PINK="#f472b6";

const CONFERENCES_2026 = [
  // JAN
  {id:1,name:"ASA Advance 2026",org:"American Society of Anesthesiologists",dates:"Jan 23–25, 2026",location:"Las Vegas, NV",type:"General",emoji:"🎰",url:"https://www.asahq.org",description:"ASA's premier winter education conference. Clinical updates, workshops, and networking across all anesthesia subspecialties.",cme:true,upcoming:true},
  {id:2,name:"STA Annual Meeting",org:"Society for Technology in Anesthesia",dates:"Jan 15–18, 2026",location:"Florida, USA",type:"Technology",emoji:"🤖",url:"https://www.staprofessionals.org",description:"Focused on innovation and technology in anesthesia. AI, monitoring, simulation, and perioperative informatics.",cme:true,upcoming:true},
  {id:3,name:"ASRA Ultrasound Cadaver Workshop",org:"ASRA Pain Medicine",dates:"Jan 31–Feb 1, 2026",location:"Chapel Hill, NC",type:"Regional",emoji:"💉",url:"https://asra.com",description:"Hands-on ultrasound-guided regional anesthesia training on cadavers. Small groups. Covers upper limb, lower limb, trunk, and advanced blocks.",cme:true,upcoming:true},
  {id:4,name:"Snow & Sedation Conference",org:"American Society of Anesthesiologists",dates:"Feb 14–21, 2026",location:"Park City, UT",type:"General",emoji:"⛷️",url:"https://www.asahq.org",description:"Multidisciplinary conference on sedation and ambulatory anesthesia. Combines CME with skiing in Park City.",cme:true,upcoming:true},
  // FEB
  {id:5,name:"SOAP PEAK Lecture",org:"Society for Obstetric Anesthesia & Perinatology",dates:"Feb 5, 2026",location:"Virtual",type:"OB",emoji:"🤰",url:"https://www.soap.org",description:"SOAP's PEAK (Perioperative Education for Anesthesia Knowledge) virtual lecture series. OB anesthesia updates.",cme:true,upcoming:true},
  // MAR
  {id:6,name:"SPA-AAP Pediatric Anesthesiology",org:"Society for Pediatric Anesthesia",dates:"Mar 12–14, 2026",location:"Denver, CO",type:"Pediatric",emoji:"👶",url:"https://pedsanesthesia.org",description:"Premier pediatric anesthesia conference. Covers neonatal, congenital cardiac, airway, and regional anesthesia in children.",cme:true,upcoming:true},
  {id:7,name:"CCAS Annual Meeting",org:"Congenital Cardiac Anesthesia Society",dates:"Mar 12, 2026",location:"Denver, CO",type:"Cardiac",emoji:"❤️",url:"https://www.ccasociety.org",description:"Dedicated to anesthesia management for patients with congenital heart disease. Cutting-edge congenital cardiac anesthesia.",cme:true,upcoming:true},
  {id:8,name:"SPPM 13th Annual Meeting",org:"Society for Pediatric Pain Medicine",dates:"Mar 12, 2026",location:"Denver, CO",type:"Pediatric",emoji:"⚡",url:"https://www.sppmnet.org",description:"Pediatric pain management — acute, chronic, and perioperative pain in children. Co-located with SPA-AAP.",cme:true,upcoming:true},
  // APR
  {id:9,name:"ASRA 51st Annual RA & Acute Pain Meeting",org:"ASRA Pain Medicine",dates:"Apr 16–18, 2026",location:"Phoenix, AZ",type:"Regional",emoji:"💉",url:"https://asra.com/events-education/ra-acute-meeting",description:"The world's leading regional anesthesia conference. Theme: 'Redefining the Role and Value of Regional Anesthesia.' 21.75 CME credits. International faculty.",cme:true,upcoming:true,featured:true},
  {id:10,name:"SOAP 58th Annual Meeting",org:"Society for Obstetric Anesthesia & Perinatology",dates:"Apr 29–May 3, 2026",location:"Montreal, Quebec, Canada",type:"OB",emoji:"🤰",url:"https://www.soap.org",description:"Premier obstetric anesthesia conference. Labor analgesia, high-risk obstetrics, postpartum hemorrhage, and maternal safety.",cme:true,upcoming:true,featured:true},
  // MAY
  {id:11,name:"IARS & SOCCA Annual Meeting",org:"International Anesthesia Research Society",dates:"May 1–3, 2026",location:"Montreal, Quebec, Canada",type:"Research",emoji:"🔬",url:"https://meetings.iars.org",description:"The flagship research conference for anesthesiology. Clinical, translational, and basic science across all subspecialties. Co-located with SOAP.",cme:true,upcoming:true,featured:true},
  {id:12,name:"ASRA Pain Medicine Annual Meeting",org:"ASRA Pain Medicine",dates:"Nov 5, 2026",location:"Tampa, FL",type:"Pain",emoji:"⚡",url:"https://asra.com",description:"ASRA's annual pain medicine conference. Interventional pain, neuromodulation, and comprehensive pain management.",cme:true,upcoming:true},
  {id:13,name:"ASA Legislative Conference",org:"American Society of Anesthesiologists",dates:"May 18–20, 2026",location:"Washington, DC",type:"Advocacy",emoji:"🏛️",url:"https://www.asahq.org",description:"Advocacy and policy conference. Meet with Congress members on anesthesia workforce, scope of practice, and patient safety issues.",cme:false,upcoming:true},
  {id:14,name:"Western Anesthesia Residents' Conference",org:"WARC",dates:"May 15–16, 2026",location:"California, USA",type:"Residents",emoji:"🎓",url:"",description:"Annual conference by and for anesthesia residents. Research presentations, career panels, and networking. Perfect for CA-1 through CA-3.",cme:true,upcoming:true},
  // JUN
  {id:15,name:"FSA Annual Meeting",org:"Florida Society of Anesthesiologists",dates:"Jun 12–14, 2026",location:"West Palm Beach, FL",type:"General",emoji:"🌴",url:"https://www.fsahq.org",description:"Florida's premier anesthesia conference at The Breakers. Frailty in ICU, PEEP management, cryoneurolysis, and structural heart procedures.",cme:true,upcoming:true},
  // OCT
  {id:16,name:"ANESTHESIOLOGY 2026 — ASA Annual Meeting",org:"American Society of Anesthesiologists",dates:"Oct 2026",location:"San Diego, CA",type:"General",emoji:"🌊",url:"https://www.asahq.org/annualmeeting",description:"The world's largest and most influential anesthesia conference. 14,000+ attendees, 11 clinical tracks, 32 hands-on workshops, 400+ abstracts. Don't miss it.",cme:true,upcoming:true,featured:true},
  {id:17,name:"SPA 40th Annual Meeting",org:"Society for Pediatric Anesthesia",dates:"Oct 16, 2026",location:"San Diego, CA",type:"Pediatric",emoji:"👶",url:"https://pedsanesthesia.org",description:"SPA's 40th anniversary meeting. Co-located with ASA 2026. Pediatric airway, regional, cardiac, and critical care anesthesia.",cme:true,upcoming:true},
  // WORKSHOPS / ONGOING
  {id:18,name:"Anesthesiology and Care of Surgical Patients",org:"CME Conference",dates:"Jan 25–30, 2026",location:"Colorado, USA",type:"General",emoji:"🏔️",url:"",description:"Comprehensive review of perioperative medicine and surgical anesthesia. Popular with residents and early-career attendings.",cme:true,upcoming:true},
  {id:19,name:"Aspen Anesthesia 2026",org:"CME Conference",dates:"Jan 31–Feb 7, 2026",location:"Aspen, CO",type:"General",emoji:"⛷️",url:"",description:"Small-group intensive anesthesia education in Aspen. Clinical updates, case discussions, and skiing. Limited enrollment.",cme:true,upcoming:true},
  {id:20,name:"ASRA POCUS Course",org:"ASRA Pain Medicine",dates:"Mar 21, 2026",location:"Chapel Hill, NC",type:"Regional",emoji:"📡",url:"https://asra.com",description:"Introduction to perioperative point-of-care ultrasound (POCUS). Hands-on training for gastric scanning, cardiac, and lung ultrasound.",cme:true,upcoming:true},
];

const TYPES = ["All", "General", "Regional", "Cardiac", "OB", "Pediatric", "Pain", "Research", "Technology", "Residents", "Advocacy"];
const MONTHS = ["All", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const typeColors = {
  General: TEAL, Regional: "#60a5fa", Cardiac: RED,
  OB: PINK, Pediatric: GREEN, Pain: GOLD,
  Research: PURPLE, Technology: ORANGE, Residents: TEAL,
  Advocacy: SLATE2,
};

export default function ConferencesPage({ onBack }) {
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = CONFERENCES_2026.filter(c => {
    const matchType = typeFilter === "All" || c.type === typeFilter;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.org.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const featured = filtered.filter(c => c.featured);
  const regular = filtered.filter(c => !c.featured);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: NAVY, fontFamily: "Georgia, serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2d4a6b; border-radius: 4px; }
        .conf-card:hover { transform: translateY(-3px) !important; border-color: rgba(0,201,177,0.35) !important; box-shadow: 0 16px 48px rgba(0,0,0,0.3) !important; }
        .conf-card { transition: all 0.25s ease !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: NAVY2, borderBottom: `1px solid rgba(255,255,255,0.08)`, padding: "14px 24px", display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "transparent", border: `1px solid rgba(255,255,255,0.18)`, color: SLATE, borderRadius: "8px", padding: "7px 14px", cursor: "pointer", fontSize: "12px", fontFamily: "monospace" }}>← Back</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 800, color: WHITE }}>🗓️ Anesthesia Conferences 2026</div>
          <div style={{ fontSize: "12px", color: SLATE, fontFamily: "monospace", marginTop: "2px" }}>{filtered.length} conferences · CME · United States & International</div>
        </div>
        <div style={{ background: `${TEAL}18`, border: `1px solid ${TEAL}40`, borderRadius: "8px", padding: "6px 14px", fontSize: "11px", color: TEAL, fontFamily: "monospace" }}>
          Live 2026 Calendar
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: NAVY2, borderBottom: `1px solid rgba(255,255,255,0.06)`, padding: "10px 20px", display: "flex", gap: "8px", overflowX: "auto", flexShrink: 0, alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search conferences..."
          style={{ padding: "7px 14px", background: "rgba(255,255,255,0.06)", border: `1px solid rgba(255,255,255,0.12)`, borderRadius: "8px", color: WHITE, fontSize: "13px", fontFamily: "monospace", outline: "none", minWidth: "200px" }} />
        <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />
        {TYPES.map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            style={{ background: typeFilter === t ? (typeColors[t] || TEAL) : "rgba(255,255,255,0.04)", color: typeFilter === t ? NAVY : SLATE, border: `1px solid ${typeFilter === t ? (typeColors[t] || TEAL) : "rgba(255,255,255,0.1)"}`, borderRadius: "20px", padding: "5px 14px", cursor: "pointer", fontSize: "12px", fontFamily: "monospace", whiteSpace: "nowrap", fontWeight: typeFilter === t ? 700 : 400 }}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>

          {/* Featured */}
          {featured.length > 0 && (
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "11px", color: GOLD, fontFamily: "monospace", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "14px" }}>⭐ Must-Attend Conferences</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: "14px" }}>
                {featured.map(c => <ConferenceCard key={c.id} conf={c} featured />)}
              </div>
            </div>
          )}

          {/* All others */}
          {regular.length > 0 && (
            <div>
              <div style={{ fontSize: "11px", color: TEAL, fontFamily: "monospace", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "14px" }}>All Conferences</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "12px" }}>
                {regular.map(c => <ConferenceCard key={c.id} conf={c} />)}
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 20px", color: SLATE }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <div style={{ fontFamily: "monospace", fontSize: "15px" }}>No conferences match your search</div>
            </div>
          )}

          <div style={{ marginTop: "32px", padding: "16px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", fontSize: "12px", color: SLATE, fontFamily: "monospace", textAlign: "center" }}>
            📌 Dates are subject to change · Always verify with official conference website before booking · More conferences added regularly
          </div>
        </div>
      </div>
    </div>
  );
}

function ConferenceCard({ conf, featured }) {
  const color = typeColors[conf.type] || TEAL;
  return (
    <div className="conf-card" style={{
      background: featured ? `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))` : "rgba(255,255,255,0.03)",
      border: `1px solid ${featured ? `${color}35` : "rgba(255,255,255,0.08)"}`,
      borderRadius: "16px", padding: "20px 22px",
      boxShadow: featured ? `0 4px 24px rgba(0,0,0,0.2)` : "none"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "28px", flexShrink: 0 }}>{conf.emoji}</span>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: featured ? "17px" : "15px", fontWeight: 700, color: WHITE, lineHeight: 1.3, marginBottom: "4px" }}>{conf.name}</div>
            <div style={{ fontSize: "12px", color: SLATE2 }}>{conf.org}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end", flexShrink: 0 }}>
          <span style={{ background: `${color}18`, border: `1px solid ${color}40`, color, fontSize: "10px", fontFamily: "monospace", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>{conf.type}</span>
          {conf.cme && <span style={{ background: `${GREEN}15`, border: `1px solid ${GREEN}30`, color: GREEN, fontSize: "10px", fontFamily: "monospace", padding: "2px 8px", borderRadius: "4px" }}>CME</span>}
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: GOLD, fontFamily: "monospace", fontWeight: 700 }}>
          📅 {conf.dates}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: SLATE2 }}>
          📍 {conf.location}
        </div>
      </div>

      <p style={{ fontSize: "13px", color: SLATE2, lineHeight: 1.6, marginBottom: "14px" }}>{conf.description}</p>

      {conf.url && (
        <a href={conf.url} target="_blank" rel="noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: `${color}15`, border: `1px solid ${color}35`, color, borderRadius: "8px", padding: "7px 14px", fontSize: "12px", fontFamily: "monospace", textDecoration: "none", fontWeight: 700, transition: "all 0.2s" }}>
          🔗 Official Website →
        </a>
      )}
    </div>
  );
}
