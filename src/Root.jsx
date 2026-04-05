import { useState } from "react";
import { ResidencyDirectory, FellowshipDirectory } from "./Directory.jsx";
import ConferencesPage from "./Conferences.jsx";
import JournalsPage from "./Journals.jsx";
import CaseOfTheDay from "./CaseOfTheDay.jsx";
import WeeklyDigest from "./WeeklyDigest.jsx";
import JobsBoard from "./JobsBoard.jsx";
import App from "./App.jsx";

const NAVY="#08172e",NAVY2="#0f2240",TEAL="#00c9b1",TEAL2="#00a896";
const SLATE="#6e90b8",SLATE2="#a8c0d8",WHITE="#f0f6ff";
const GOLD="#f0bc3a",GREEN="#2ed47a",RED="#e05555",PURPLE="#a78bfa";

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#08172e;color:#f0f6ff;font-family:'DM Sans',sans-serif;overflow-x:hidden}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.4)}}
@keyframes glow{0%,100%{box-shadow:0 4px 18px rgba(0,201,177,0.35)}50%{box-shadow:0 4px 36px rgba(0,201,177,0.7)}}
.rcard{transition:all 0.28s ease;cursor:pointer}
.rcard:hover{transform:translateY(-5px)!important;box-shadow:0 20px 56px rgba(0,0,0,0.35)!important}
.nbtn{transition:all 0.18s}
.nbtn:hover{opacity:1!important;background:rgba(255,255,255,0.1)!important}
.fcrd{transition:all 0.22s}
.fcrd:hover{border-color:rgba(0,201,177,0.35)!important;transform:translateY(-3px)}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2d4a6b;border-radius:4px}
@media(max-width:900px){
  .dnav{display:none!important}
  .mnav-btn{display:flex!important}
  .hero-row{flex-direction:column!important}
  .rgrid{grid-template-columns:1fr!important}
  .fgrid{grid-template-columns:1fr!important}
  .pgrid{grid-template-columns:1fr!important}
  .footer-row{flex-direction:column!important;align-items:center!important;text-align:center!important;gap:20px!important}
}
@media(min-width:901px){
  .mnav-btn{display:none!important}
  .mnav-menu{display:none!important}
}
.mnav-menu.open{display:flex!important;flex-direction:column;position:fixed;top:66px;left:0;right:0;background:rgba(8,23,46,0.98);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.1);padding:16px;gap:10px;z-index:199}
`;

export default function Root(){
  const [page,setPage]=useState("home");
  const [mobileOpen,setMobileOpen]=useState(false);
  const [email,setEmail]=useState("");
  const [submitted,setSubmitted]=useState(false);

  const go=(p)=>{setPage(p);setMobileOpen(false);window.scrollTo(0,0);};

  if(page==="app")         return <App/>;
  if(page==="residency")   return <ResidencyDirectory   onBack={()=>go("home")}/>;
  if(page==="fellowship")  return <FellowshipDirectory  onBack={()=>go("home")}/>;
  if(page==="conferences") return <ConferencesPage      onBack={()=>go("home")}/>;
  if(page==="journals")    return <JournalsPage         onBack={()=>go("home")}/>;
  if(page==="case")        return <CaseOfTheDay         onBack={()=>go("home")}/>;
  if(page==="digest")      return <WeeklyDigest         onBack={()=>go("home")}/>;
  if(page==="jobs")        return <JobsBoard            onBack={()=>go("home")}/>;

  const NAV=[
    {label:"🤖 Board Prep",   page:"app",          color:TEAL},
    {label:"🏥 Residency",    page:"residency",    color:TEAL},
    {label:"🎓 Fellowships",  page:"fellowship",   color:GOLD},
    {label:"🗓️ Conferences",  page:"conferences",  color:PURPLE},
    {label:"📰 Journals",     page:"journals",     color:GREEN},
    {label:"📡 Weekly Digest",page:"digest",       color:SLATE2},
    {label:"🏆 Case of Day",  page:"case",         color:RED},
    {label:"💼 Jobs",         page:"jobs",         color:"#fb923c"},
  ];

  const CARDS=[
    {page:"app",   emoji:"🤖",title:"AI Board Exam",     color:TEAL,   border:"rgba(0,201,177,0.4)",    bg:"linear-gradient(135deg,rgba(0,201,177,0.13),rgba(0,201,177,0.04))",   desc:"Practice ABA oral boards with an AI examiner. Voice mode, scoring, and teaching across all topics.",tags:["Oral Boards","Teaching","Quiz","Drug Ref","Quick Review"],tagColor:TEAL,  cta:"Launch App Free →"},
    {page:"jobs",  emoji:"💼",title:"Jobs Board",         color:"#fb923c",border:"rgba(251,147,54,0.4)", bg:"linear-gradient(135deg,rgba(251,147,54,0.12),rgba(251,147,54,0.03))", desc:"The first anesthesia-specific job board. AI-curated weekly openings across the US — academic, private, locum, and subspecialty.",stats:[["50+","Positions"],["Weekly","Updated"],["All","Specialties"]],statColor:"#fb923c",cta:"Browse Jobs →"},
    {page:"residency",emoji:"🏥",title:"Residency Directory",color:TEAL,border:"rgba(255,255,255,0.12)",bg:"rgba(255,255,255,0.03)",desc:"Every ACGME-accredited anesthesia residency in the US. Program directors, contact info, and one-click outreach.",stats:[["80+","Programs"],["50","States"],["PD","Contacts"]],statColor:TEAL,cta:"Browse Programs →"},
    {page:"fellowship",emoji:"🎓",title:"Fellowship Directory",color:GOLD,border:"rgba(255,255,255,0.12)",bg:"rgba(255,255,255,0.03)",desc:"40+ fellowships across 8 subspecialties — Regional, Cardiac, Pain, Neuro, Pediatric, Critical Care, OB, and Research.",tags:["Regional","Cardiac","Pain","Neuro","Peds","Critical Care","OB"],tagColor:GOLD,cta:"Browse Fellowships →"},
    {page:"conferences",emoji:"🗓️",title:"Conferences 2026",color:PURPLE,border:"rgba(167,139,250,0.38)",bg:"linear-gradient(135deg,rgba(167,139,250,0.1),rgba(167,139,250,0.03))",desc:"Every major anesthesia conference — ASA, ASRA, SOAP, IARS, SPA. Dates, locations, CME credits, and links.",stats:[["20+","Conferences"],["8","Specialties"],["CME","Credits"]],statColor:PURPLE,cta:"View Calendar →"},
    {page:"journals",emoji:"📰",title:"Journals & Articles",color:GREEN,border:"rgba(46,212,122,0.35)",bg:"linear-gradient(135deg,rgba(46,212,122,0.1),rgba(46,212,122,0.03))",desc:"AI-curated high-yield articles from Anesthesiology, A&A, BJA, and RAPM. Board summaries and Ask AI about any paper.",tags:["Anesthesiology","A&A","BJA","RAPM"],tagColor:GREEN,cta:"Browse Journals →"},
    {page:"digest",emoji:"📡",title:"Weekly Digest",color:SLATE2,border:"rgba(143,179,212,0.3)",bg:"linear-gradient(135deg,rgba(143,179,212,0.1),rgba(143,179,212,0.03))",desc:"AI scans all 4 journals weekly and delivers TL;DR summaries for busy physicians. Refreshes every Monday.",stats:[["4","Journals"],["8+","Articles"],["Weekly","Refresh"]],statColor:SLATE2,cta:"Read This Week →"},
    {page:"case",  emoji:"🏆",title:"Case of the Day",    color:RED,    border:"rgba(224,85,85,0.38)",   bg:"linear-gradient(135deg,rgba(224,85,85,0.1),rgba(224,85,85,0.03))",   desc:"Daily gamified clinical case — 5 timed questions, streak bonuses, scoring, and clinical pearls after each answer.",stats:[["5","Questions"],["⏱️","Timed"],["🔥","Streaks"]],statColor:RED,cta:"Play Today's Case →"},
  ];

  return(
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:"rgba(8,23,46,0.96)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"0 20px",height:66,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#00c9b1,#00a896)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>💨</div>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,color:WHITE}}>Gasology</span>
        </div>

        {/* Desktop nav */}
        <div className="dnav" style={{display:"flex",alignItems:"center",gap:4,flex:1,justifyContent:"center",flexWrap:"wrap"}}>
          {NAV.map(item=>(
            <button key={item.page} className="nbtn" onClick={()=>go(item.page)}
              style={{background:`${item.color}14`,border:`1px solid ${item.color}40`,color:item.color,fontSize:12,fontWeight:700,cursor:"pointer",padding:"6px 12px",borderRadius:9,fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>
              {item.label}
            </button>
          ))}
        </div>

        <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
          <button className="mnav-btn nbtn" onClick={()=>setMobileOpen(o=>!o)}
            style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:WHITE,borderRadius:8,padding:"8px 11px",cursor:"pointer",fontSize:17,lineHeight:1}}>
            {mobileOpen?"✕":"☰"}
          </button>
          <button onClick={()=>go("app")} style={{background:"linear-gradient(135deg,#00c9b1,#00a896)",color:NAVY,padding:"9px 18px",borderRadius:9,border:"none",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",animation:"glow 3s ease infinite",whiteSpace:"nowrap"}}>
            Try Free →
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mnav-menu${mobileOpen?" open":""}`}>
        {NAV.map(item=>(
          <button key={item.page} onClick={()=>go(item.page)}
            style={{background:`${item.color}12`,border:`1px solid ${item.color}35`,color:item.color,padding:"12px 16px",borderRadius:10,cursor:"pointer",fontSize:15,fontWeight:700,fontFamily:"'DM Sans',sans-serif",textAlign:"left",width:"100%"}}>
            {item.label}
          </button>
        ))}
      </div>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"140px 24px 80px",position:"relative",overflow:"hidden",background:"radial-gradient(ellipse 80% 60% at 50% 35%,rgba(0,201,177,0.09) 0%,transparent 70%)"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(0,201,177,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,201,177,0.04) 1px,transparent 1px)",backgroundSize:"64px 64px",maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black 20%,transparent 75%)"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:860,width:"100%",textAlign:"center"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(0,201,177,0.12)",border:"1px solid rgba(0,201,177,0.35)",borderRadius:30,padding:"7px 20px",fontFamily:"'DM Mono',monospace",fontSize:12,color:TEAL,letterSpacing:1,textTransform:"uppercase",marginBottom:32,animation:"fadeUp 0.5s ease both"}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:TEAL,animation:"pulse 2s infinite"}}/>
            Free · Built for Anesthesiologists
          </div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(40px,8vw,86px)",fontWeight:800,lineHeight:1.05,letterSpacing:"-2px",color:WHITE,marginBottom:28,animation:"fadeUp 0.5s 0.1s ease both"}}>
            The Complete<br/>
            <span style={{fontStyle:"italic",background:"linear-gradient(135deg,#00c9b1,#7fffd4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Anesthesia Hub.</span>
          </h1>
          <p style={{fontSize:"clamp(16px,2.5vw,20px)",color:SLATE2,lineHeight:1.7,maxWidth:600,margin:"0 auto 48px",fontWeight:300,animation:"fadeUp 0.5s 0.2s ease both"}}>
            Board prep, job search, journal digest, residency directory, fellowship guide, and conference calendar — all in one place, all free.
          </p>
          <div className="hero-row" style={{display:"flex",gap:12,maxWidth:490,margin:"0 auto 18px",animation:"fadeUp 0.5s 0.3s ease both"}}>
            <input type="email" placeholder="Enter your email address" value={email} onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&email&&(setSubmitted(true),setTimeout(()=>go("app"),1200))}
              style={{flex:1,padding:"14px 18px",borderRadius:10,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.07)",color:WHITE,fontSize:15,fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
            <button onClick={()=>email&&(setSubmitted(true),setTimeout(()=>go("app"),1200))}
              style={{padding:"14px 22px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#00c9b1,#00a896)",color:NAVY,fontWeight:700,fontSize:15,cursor:"pointer",whiteSpace:"nowrap",boxShadow:"0 4px 18px rgba(0,201,177,0.4)"}}>
              {submitted?"Launching...":"Get Access →"}
            </button>
          </div>
          <button onClick={()=>go("app")} style={{background:"transparent",border:"none",color:SLATE2,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textDecoration:"underline"}}>
            Try Free — No Signup →
          </button>
        </div>
      </section>

      {/* RESOURCE HUB */}
      <section style={{padding:"0 24px 80px"}}>
        <div style={{maxWidth:1120,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:52}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:TEAL,letterSpacing:"2px",textTransform:"uppercase",marginBottom:14}}>Everything You Need</div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,5.5vw,62px)",fontWeight:800,letterSpacing:"-1.5px",color:WHITE,lineHeight:1.08}}>
              Built for Anesthesiologists.<br/>
              <span style={{fontStyle:"italic",color:TEAL}}>By One of Your Own.</span>
            </h2>
            <p style={{fontSize:18,color:SLATE2,marginTop:18,fontWeight:300,maxWidth:560,margin:"18px auto 0",lineHeight:1.65}}>
              Every resource an anesthesiologist needs — in training, in practice, or in transition.
            </p>
          </div>

          <div className="rgrid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
            {CARDS.map(card=>(
              <div key={card.page} className="rcard" onClick={()=>go(card.page)}
                style={{background:card.bg,border:`2px solid ${card.border}`,borderRadius:24,padding:"34px 28px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:-20,right:-12,fontSize:96,opacity:0.06,pointerEvents:"none",lineHeight:1}}>{card.emoji}</div>
                <div style={{fontSize:42,marginBottom:16}}>{card.emoji}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:800,color:WHITE,marginBottom:10,lineHeight:1.15}}>{card.title}</div>
                <div style={{fontSize:14,color:SLATE2,lineHeight:1.72,marginBottom:18}}>{card.desc}</div>
                {card.tags&&(
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
                    {card.tags.map(t=>(
                      <span key={t} style={{background:`${card.tagColor}15`,border:`1px solid ${card.tagColor}30`,color:card.tagColor,fontSize:11,fontFamily:"monospace",padding:"3px 10px",borderRadius:20,fontWeight:600}}>{t}</span>
                    ))}
                  </div>
                )}
                {card.stats&&(
                  <div style={{display:"flex",gap:18,marginBottom:18}}>
                    {card.stats.map(([n,l])=>(
                      <div key={l}>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:800,color:card.statColor}}>{n}</div>
                        <div style={{fontSize:11,color:SLATE,fontFamily:"monospace",marginTop:2}}>{l}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{color:card.color,fontSize:14,fontFamily:"'DM Mono',monospace",fontWeight:700}}>{card.cta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{padding:"80px 24px",background:"radial-gradient(ellipse 60% 50% at 50% 50%,rgba(0,201,177,0.05) 0%,transparent 70%)"}}>
        <div style={{maxWidth:1000,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:TEAL,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Board Prep Features</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(30px,5vw,52px)",fontWeight:800,letterSpacing:"-1px",marginBottom:16,lineHeight:1.1}}>Study Smarter.<br/><span style={{fontStyle:"italic",color:TEAL}}>Pass Faster.</span></h2>
          <p style={{fontSize:17,color:SLATE2,marginBottom:48,fontWeight:300}}>Everything inside the free app.</p>
          <div className="fgrid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
            {[
              {e:"🎙️",t:"Voice Oral Boards",d:"Speak your answers. AI responds like a real ABA examiner with mid-case complications and scoring."},
              {e:"📚",t:"Quick Review",d:"High-yield summaries from M&M, Miller's, and Barash by system. AI keyword deep-dives."},
              {e:"💊",t:"Drug Reference",d:"12 essential drugs with doses, onset, duration, and clinical pearls. Instantly searchable."},
              {e:"🧪",t:"Quiz Mode",d:"Board-style MCQs with detailed explanations across pharmacology, physiology, and clinical scenarios."},
              {e:"📡",t:"Weekly Digest",d:"AI scans all 4 major journals weekly. TL;DR summaries and practice implications for busy physicians."},
              {e:"🏆",t:"Case of the Day",d:"Daily gamified clinical case — 5 timed questions, streak bonuses, and clinical pearls."},
            ].map(f=>(
              <div key={f.t} className="fcrd" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"24px 20px",textAlign:"left"}}>
                <div style={{fontSize:34,marginBottom:12}}>{f.e}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:WHITE,marginBottom:8}}>{f.t}</div>
                <div style={{fontSize:13,color:SLATE2,lineHeight:1.65}}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{padding:"80px 24px",textAlign:"center"}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:TEAL,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Pricing</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(30px,5vw,52px)",fontWeight:800,letterSpacing:"-1px",marginBottom:16}}>Start free.<br/><span style={{fontStyle:"italic",color:TEAL}}>Upgrade when ready.</span></h2>
        <p style={{fontSize:17,color:SLATE2,marginBottom:48,fontWeight:300}}>No credit card. No pressure.</p>
        <div className="pgrid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24,maxWidth:720,margin:"0 auto"}}>
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:22,padding:"36px 32px",textAlign:"left"}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:SLATE,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Free</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:52,fontWeight:800,color:WHITE,lineHeight:1,marginBottom:6}}>$0<span style={{fontSize:18,color:SLATE}}>/mo</span></div>
            <p style={{fontSize:14,color:SLATE2,marginBottom:24}}>Everything you need to start.</p>
            <ul style={{listStyle:"none",marginBottom:28,display:"flex",flexDirection:"column",gap:9}}>
              {["5 board cases/month","Quiz mode","Drug reference","Teaching mode","Case of the Day","Weekly Digest","Jobs board","All directories"].map(f=>(
                <li key={f} style={{fontSize:14,color:SLATE2,display:"flex",alignItems:"center",gap:10}}><span style={{color:TEAL,fontWeight:700}}>✓</span>{f}</li>
              ))}
            </ul>
            <button onClick={()=>go("app")} style={{width:"100%",padding:13,borderRadius:10,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.07)",color:WHITE,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Get Started Free</button>
          </div>
          <div style={{background:"linear-gradient(135deg,rgba(0,201,177,0.12),rgba(0,168,150,0.04))",border:"1px solid rgba(0,201,177,0.45)",borderRadius:22,padding:"36px 32px",textAlign:"left",boxShadow:"0 8px 48px rgba(0,201,177,0.18)"}}>
            <div style={{display:"inline-block",background:TEAL,color:NAVY,fontSize:11,fontWeight:700,fontFamily:"monospace",padding:"3px 10px",borderRadius:4,letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>Most Popular</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:SLATE,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Pro</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:52,fontWeight:800,color:WHITE,lineHeight:1,marginBottom:6}}>$19<span style={{fontSize:18,color:SLATE}}>/mo</span></div>
            <p style={{fontSize:14,color:SLATE2,marginBottom:24}}>The full board exam experience.</p>
            <ul style={{listStyle:"none",marginBottom:28,display:"flex",flexDirection:"column",gap:9}}>
              {["Unlimited board cases","Full quiz bank","🎙 Voice exam mode","AI performance scoring","Progress tracking","Priority support","All free features included"].map(f=>(
                <li key={f} style={{fontSize:14,color:SLATE2,display:"flex",alignItems:"center",gap:10}}><span style={{color:TEAL,fontWeight:700}}>✓</span>{f}</li>
              ))}
            </ul>
            <button onClick={()=>go("app")} style={{width:"100%",padding:13,borderRadius:10,border:"none",background:"linear-gradient(135deg,#00c9b1,#00a896)",color:NAVY,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 4px 18px rgba(0,201,177,0.35)"}}>Start Free Trial →</button>
          </div>
        </div>
        <p style={{marginTop:20,fontSize:13,color:SLATE,fontFamily:"monospace"}}>Residency program & institutional licensing available</p>
      </section>

      {/* CTA */}
      <div style={{textAlign:"center",padding:"80px 24px",background:"radial-gradient(ellipse 80% 60% at 50% 50%,rgba(0,201,177,0.07) 0%,transparent 70%)"}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,52px)",fontWeight:800,marginBottom:16,letterSpacing:"-1px"}}>The complete anesthesia hub awaits.</h2>
        <p style={{fontSize:17,color:SLATE2,marginBottom:40,fontWeight:300}}>Board prep, jobs, journals, directories — all free.</p>
        <button onClick={()=>go("app")} style={{padding:"17px 52px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#00c9b1,#00a896)",color:NAVY,fontWeight:700,fontSize:18,cursor:"pointer",boxShadow:"0 8px 40px rgba(0,201,177,0.45)",fontFamily:"'DM Sans',sans-serif"}}>
          Launch Gasology Free →
        </button>
        <p style={{marginTop:14,fontSize:12,color:SLATE,fontFamily:"monospace"}}>No signup required · Works on mobile · Start in 10 seconds</p>
      </div>

      {/* FOOTER */}
      <footer style={{background:NAVY2,borderTop:"1px solid rgba(255,255,255,0.06)",padding:"32px 24px"}}>
        <div className="footer-row" style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16,maxWidth:1120,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#00c9b1,#00a896)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>💨</div>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:WHITE}}>Gasology</span>
          </div>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center"}}>
            {NAV.map(item=>(
              <button key={item.page} onClick={()=>go(item.page)} style={{background:"none",border:"none",color:SLATE,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>{item.label}</button>
            ))}
          </div>
          <div style={{fontSize:12,color:SLATE,fontFamily:"monospace"}}>© 2026 Gasology · Educational use only</div>
        </div>
      </footer>
    </>
  );
}
