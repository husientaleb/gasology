import { useState } from "react";
import { ResidencyDirectory, FellowshipDirectory } from "./Directory.jsx";
import ConferencesPage from "./Conferences.jsx";
import JournalsPage from "./Journals.jsx";
import CaseOfTheDay from "./CaseOfTheDay.jsx";
import WeeklyDigest from "./WeeklyDigest.jsx";
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
.rcard:hover{transform:translateY(-6px)!important;box-shadow:0 24px 64px rgba(0,0,0,0.35)!important}
.nbtn{transition:all 0.18s}
.nbtn:hover{opacity:1!important}
.fcrd{transition:all 0.22s}
.fcrd:hover{border-color:rgba(0,201,177,0.35)!important;transform:translateY(-3px)}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2d4a6b;border-radius:4px}
@media(max-width:768px){
  .dnav{display:none!important}
  .mnav-btn{display:flex!important}
  .hero-row{flex-direction:column!important}
  .rgrid{grid-template-columns:1fr!important}
  .fgrid{grid-template-columns:1fr!important}
  .pgrid{grid-template-columns:1fr!important}
  .footer-row{flex-direction:column!important;align-items:center!important;text-align:center!important}
}
@media(min-width:769px){
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

  if(page==="app")         return <App/>;
  if(page==="residency")   return <ResidencyDirectory   onBack={()=>setPage("home")}/>;
  if(page==="fellowship")  return <FellowshipDirectory  onBack={()=>setPage("home")}/>;
  if(page==="conferences") return <ConferencesPage      onBack={()=>setPage("home")}/>;
  if(page==="journals")    return <JournalsPage         onBack={()=>setPage("home")}/>;
  if(page==="case")        return <CaseOfTheDay         onBack={()=>setPage("home")}/>;
  if(page==="digest")      return <WeeklyDigest         onBack={()=>setPage("home")}/>;

  const go=(p)=>{setPage(p);setMobileOpen(false);};

  const NAV_ITEMS=[
    {label:"🤖 Board Prep",   page:"app",          color:TEAL},
    {label:"🏥 Residency",    page:"residency",    color:TEAL},
    {label:"🎓 Fellowships",  page:"fellowship",   color:GOLD},
    {label:"🗓️ Conferences",  page:"conferences",  color:PURPLE},
    {label:"📰 Journals",     page:"journals",     color:GREEN},
    {label:"🏆 Case of Day",  page:"case",         color:RED},
    {label:"📡 Weekly Digest",page:"digest",       color:SLATE2},
  ];

  const RESOURCE_CARDS=[
    {
      page:"app", emoji:"🤖", title:"AI Board Exam",
      color:TEAL, border:"rgba(0,201,177,0.4)",
      bg:"linear-gradient(135deg,rgba(0,201,177,0.13),rgba(0,201,177,0.04))",
      desc:"Practice ABA oral boards with an AI examiner that challenges, scores, and teaches you. Voice mode included.",
      tags:["Oral Boards","Teaching","Quiz","Drug Ref","Quick Review"],
      tagColor:TEAL, cta:"Launch App Free →"
    },
    {
      page:"residency", emoji:"🏥", title:"Residency Directory",
      color:TEAL, border:"rgba(255,255,255,0.12)",
      bg:"rgba(255,255,255,0.03)",
      desc:"Every ACGME-accredited anesthesia residency in the US. Program directors, emails, and one-click pitch tool.",
      stats:[["80+","Programs"],["50","States"],["PD","Contacts"]],
      statColor:TEAL, cta:"Browse Programs →"
    },
    {
      page:"fellowship", emoji:"🎓", title:"Fellowship Directory",
      color:GOLD, border:"rgba(255,255,255,0.12)",
      bg:"rgba(255,255,255,0.03)",
      desc:"40+ fellowships across 8 subspecialties — Regional, Cardiac, Pain, Neuro, Pediatric, Critical Care, OB, Research.",
      tags:["Regional","Cardiac","Pain","Neuro","Peds","Critical Care","OB"],
      tagColor:GOLD, cta:"Browse Fellowships →"
    },
    {
      page:"conferences", emoji:"🗓️", title:"Conferences 2026",
      color:PURPLE, border:"rgba(167,139,250,0.38)",
      bg:"linear-gradient(135deg,rgba(167,139,250,0.1),rgba(167,139,250,0.03))",
      desc:"Every major anesthesia conference this year — ASA, ASRA, SOAP, IARS, SPA and more. Dates, locations, CME info.",
      stats:[["20+","Conferences"],["8","Specialties"],["CME","Eligible"]],
      statColor:PURPLE, cta:"View Calendar →"
    },
    {
      page:"journals", emoji:"📰", title:"Journals & Articles",
      color:GREEN, border:"rgba(46,212,122,0.35)",
      bg:"linear-gradient(135deg,rgba(46,212,122,0.1),rgba(46,212,122,0.03))",
      desc:"AI-curated high-yield articles from Anesthesiology, A&A, BJA, and RAPM. Board summaries and Ask AI.",
      tags:["Anesthesiology","A&A","BJA","RAPM"],
      tagColor:GREEN, cta:"Browse Journals →"
    },
    {
      page:"digest", emoji:"📡", title:"Weekly Digest",
      color:SLATE2, border:"rgba(143,179,212,0.3)",
      bg:"linear-gradient(135deg,rgba(143,179,212,0.1),rgba(143,179,212,0.03))",
      desc:"Weekly AI digest of the top articles across all journals — TL;DR summaries for busy physicians. Refreshes every Monday.",
      stats:[["4","Journals"],["8+","Articles"],["Weekly","Refresh"]],
      statColor:SLATE2, cta:"Read This Week →"
    },
    {
      page:"case", emoji:"🏆", title:"Case of the Day",
      color:RED, border:"rgba(224,85,85,0.38)",
      bg:"linear-gradient(135deg,rgba(224,85,85,0.1),rgba(224,85,85,0.03))",
      desc:"A new gamified clinical case every day — 5 timed questions, streak bonuses, scoring, and clinical pearls.",
      stats:[["5","Questions"],["⏱️","Timed"],["🔥","Streaks"]],
      statColor:RED, cta:"Play Today's Case →"
    },
  ];

  return(
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:"rgba(8,23,46,0.96)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"0 20px",height:66,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#00c9b1,#00a896)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>💨</div>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,color:WHITE}}>Gasology</span>
        </div>

        {/* Desktop nav */}
        <div className="dnav" style={{display:"flex",alignItems:"center",gap:5,flex:1,justifyContent:"center",flexWrap:"wrap"}}>
          {NAV_ITEMS.map(item=>(
            <button key={item.page} className="nbtn" onClick={()=>go(item.page)}
              style={{background:`${item.color}14`,border:`1px solid ${item.color}40`,color:item.color,fontSize:12,fontWeight:700,cursor:"pointer",padding:"6px 13px",borderRadius:9,fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>
              {item.label}
            </button>
          ))}
        </div>

        <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
          {/* Mobile hamburger */}
          <button className="mnav-btn nbtn" onClick={()=>setMobileOpen(o=>!o)}
            style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:WHITE,borderRadius:8,padding:"8px 11px",cursor:"pointer",fontSize:17,lineHeight:1}}>
            {mobileOpen?"✕":"☰"}
          </button>
          <button onClick={()=>go("app")}
            style={{background:"linear-gradient(135deg,#00c9b1,#00a896)",color:NAVY,padding:"9px 18px",borderRadius:9,border:"none",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",animation:"glow 3s ease infinite",whiteSpace:"nowrap"}}>
            Try Free →
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mnav-menu${mobileOpen?" open":""}`}>
        {NAV_ITEMS.map(item=>(
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
            Free · Built for Anesthesia Residents
          </div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(42px,8vw,88px)",fontWeight:800,lineHeight:1.05,letterSpacing:"-2px",color:WHITE,marginBottom:28,animation:"fadeUp 0.5s 0.1s ease both"}}>
            Master Your Boards.<br/>
            <span style={{fontStyle:"italic",background:"linear-gradient(135deg,#00c9b1,#7fffd4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Before the Real Thing.</span>
          </h1>
          <p style={{fontSize:"clamp(16px,2.5vw,20px)",color:SLATE2,lineHeight:1.7,maxWidth:580,margin:"0 auto 48px",fontWeight:300,animation:"fadeUp 0.5s 0.2s ease both"}}>
            The first AI anesthesia educator built for CA-1s through Fellows. Board prep, journal digest, and a complete anesthesia resource hub.
          </p>

          {!submitted?(
            <div className="hero-row" style={{display:"flex",gap:12,maxWidth:490,margin:"0 auto 18px",animation:"fadeUp 0.5s 0.3s ease both"}}>
              <input type="email" placeholder="Enter your email address" value={email} onChange={e=>setEmail(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&email&&(setSubmitted(true),setTimeout(()=>go("app"),1200))}
                style={{flex:1,padding:"14px 18px",borderRadius:10,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.07)",color:WHITE,fontSize:15,fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
              <button onClick={()=>email&&(setSubmitted(true),setTimeout(()=>go("app"),1200))}
                style={{padding:"14px 24px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#00c9b1,#00a896)",color:NAVY,fontWeight:700,fontSize:15,cursor:"pointer",whiteSpace:"nowrap",boxShadow:"0 4px 18px rgba(0,201,177,0.4)"}}>
                Get Access →
              </button>
            </div>
          ):(
            <div style={{fontSize:17,color:GREEN,fontFamily:"'DM Mono',monospace",marginBottom:18}}>✓ Launching Gasology...</div>
          )}
          <button onClick={()=>go("app")} style={{background:"transparent",border:"none",color:SLATE2,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textDecoration:"underline"}}>
            Try Free Now — No Signup →
          </button>
        </div>
      </section>

      {/* RESOURCE HUB */}
      <section style={{padding:"0 24px 80px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:52}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:TEAL,letterSpacing:"2px",textTransform:"uppercase",marginBottom:14}}>Resource Hub</div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(34px,5.5vw,64px)",fontWeight:800,letterSpacing:"-1.5px",color:WHITE,lineHeight:1.08}}>
              Everything Anesthesia.<br/>
              <span style={{fontStyle:"italic",color:TEAL}}>In One Place.</span>
            </h2>
            <p style={{fontSize:18,color:SLATE2,marginTop:18,fontWeight:300,maxWidth:540,margin:"18px auto 0",lineHeight:1.65}}>
              Board prep, directory search, fellowship planning, conference calendar, journal digest — all free.
            </p>
          </div>

          <div className="rgrid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
            {RESOURCE_CARDS.map(card=>(
              <div key={card.page} className="rcard" onClick={()=>go(card.page)}
                style={{background:card.bg,border:`2px solid ${card.border}`,borderRadius:26,padding:"36px 30px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:-20,right:-12,fontSize:100,opacity:0.06,pointerEvents:"none",lineHeight:1}}>{card.emoji}</div>
                <div style={{fontSize:44,marginBottom:18}}>{card.emoji}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:800,color:WHITE,marginBottom:10,lineHeight:1.15}}>{card.title}</div>
                <div style={{fontSize:14,color:SLATE2,lineHeight:1.72,marginBottom:20}}>{card.desc}</div>

                {card.tags&&(
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>
                    {card.tags.map(t=>(
                      <span key={t} style={{background:`${card.tagColor}15`,border:`1px solid ${card.tagColor}30`,color:card.tagColor,fontSize:11,fontFamily:"monospace",padding:"3px 10px",borderRadius:20,fontWeight:600}}>{t}</span>
                    ))}
                  </div>
                )}
                {card.stats&&(
                  <div style={{display:"flex",gap:20,marginBottom:20}}>
                    {card.stats.map(([n,l])=>(
                      <div key={l}>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:800,color:card.statColor}}>{n}</div>
                        <div style={{fontSize:11,color:SLATE,fontFamily:"monospace",marginTop:2}}>{l}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{color:card.color,fontSize:15,fontFamily:"'DM Mono',monospace",fontWeight:700}}>{card.cta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{padding:"80px 24px",background:"radial-gradient(ellipse 60% 50% at 50% 50%,rgba(0,201,177,0.05) 0%,transparent 70%)"}}>
        <div style={{maxWidth:1000,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:TEAL,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>App Features</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,5vw,54px)",fontWeight:800,letterSpacing:"-1px",marginBottom:16,lineHeight:1.1}}>Study Smarter.<br/><span style={{fontStyle:"italic",color:TEAL}}>Pass Faster.</span></h2>
          <p style={{fontSize:17,color:SLATE2,marginBottom:52,fontWeight:300}}>Every tool you need. Nothing you don't.</p>
          <div className="fgrid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:18}}>
            {[
              {e:"🎙️",t:"Voice Oral Boards",d:"Speak your answers. AI responds like a real ABA examiner with mid-case complications and scoring."},
              {e:"📚",t:"Quick Review",d:"High-yield summaries from M&M, Miller's, and Barash by system. Tap keywords for instant AI deep-dives."},
              {e:"💊",t:"Drug Reference",d:"12 essential drugs with doses, onset, duration, and clinical pearls. Instantly searchable."},
              {e:"🧪",t:"Quiz Mode",d:"Board-style MCQs with detailed explanations covering pharmacology, physiology, and clinical scenarios."},
              {e:"📡",t:"Weekly Digest",d:"AI scans all 4 major journals weekly. TL;DR summaries, practice implications, bottom lines for busy physicians."},
              {e:"🏆",t:"Case of the Day",d:"Daily gamified clinical case with 5 timed questions, streak bonuses, and clinical pearls after each answer."},
            ].map(f=>(
              <div key={f.t} className="fcrd"
                style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"26px 22px",textAlign:"left"}}>
                <div style={{fontSize:36,marginBottom:12}}>{f.e}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:WHITE,marginBottom:8}}>{f.t}</div>
                <div style={{fontSize:14,color:SLATE2,lineHeight:1.68}}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{padding:"80px 24px",textAlign:"center"}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:TEAL,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Pricing</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,5vw,54px)",fontWeight:800,letterSpacing:"-1px",marginBottom:16}}>Start free.<br/><span style={{fontStyle:"italic",color:TEAL}}>Upgrade when ready.</span></h2>
        <p style={{fontSize:17,color:SLATE2,marginBottom:52,fontWeight:300}}>No pressure. No credit card. Get hooked on the free tier first.</p>
        <div className="pgrid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24,maxWidth:720,margin:"0 auto"}}>
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:22,padding:"36px 32px",textAlign:"left"}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:SLATE,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Free</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:52,fontWeight:800,color:WHITE,lineHeight:1,marginBottom:6}}>$0<span style={{fontSize:18,color:SLATE}}>/mo</span></div>
            <p style={{fontSize:14,color:SLATE2,marginBottom:28}}>Everything you need to start.</p>
            <ul style={{listStyle:"none",marginBottom:32,display:"flex",flexDirection:"column",gap:10}}>
              {["5 board cases/month","Quiz mode","Drug reference","Teaching mode","Case of the Day","Weekly Digest"].map(f=>(
                <li key={f} style={{fontSize:14,color:SLATE2,display:"flex",alignItems:"center",gap:10}}><span style={{color:TEAL,fontWeight:700}}>✓</span>{f}</li>
              ))}
              {["Voice exam mode","Performance scoring","Unlimited cases"].map(f=>(
                <li key={f} style={{fontSize:14,color:SLATE,display:"flex",alignItems:"center",gap:10}}><span>—</span>{f}</li>
              ))}
            </ul>
            <button onClick={()=>go("app")} style={{width:"100%",padding:14,borderRadius:10,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.07)",color:WHITE,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              Get Started Free
            </button>
          </div>
          <div style={{background:"linear-gradient(135deg,rgba(0,201,177,0.12),rgba(0,168,150,0.04))",border:"1px solid rgba(0,201,177,0.45)",borderRadius:22,padding:"36px 32px",textAlign:"left",boxShadow:"0 8px 48px rgba(0,201,177,0.18)"}}>
            <div style={{display:"inline-block",background:TEAL,color:NAVY,fontSize:11,fontWeight:700,fontFamily:"monospace",padding:"3px 10px",borderRadius:4,letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>Most Popular</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:SLATE,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Pro</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:52,fontWeight:800,color:WHITE,lineHeight:1,marginBottom:6}}>$19<span style={{fontSize:18,color:SLATE}}>/mo</span></div>
            <p style={{fontSize:14,color:SLATE2,marginBottom:28}}>The full board exam experience.</p>
            <ul style={{listStyle:"none",marginBottom:32,display:"flex",flexDirection:"column",gap:10}}>
              {["Unlimited board cases","Full quiz bank","Drug reference","Teaching mode","🎙 Voice exam mode","AI performance scoring","Progress tracking","Priority support"].map(f=>(
                <li key={f} style={{fontSize:14,color:SLATE2,display:"flex",alignItems:"center",gap:10}}><span style={{color:TEAL,fontWeight:700}}>✓</span>{f}</li>
              ))}
            </ul>
            <button onClick={()=>go("app")} style={{width:"100%",padding:14,borderRadius:10,border:"none",background:"linear-gradient(135deg,#00c9b1,#00a896)",color:NAVY,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 4px 18px rgba(0,201,177,0.35)"}}>
              Start Free Trial →
            </button>
          </div>
        </div>
        <p style={{marginTop:24,fontSize:13,color:SLATE,fontFamily:"monospace"}}>Residency program licensing available · Contact for institutional pricing</p>
      </section>

      {/* CTA */}
      <div style={{textAlign:"center",padding:"80px 24px",background:"radial-gradient(ellipse 80% 60% at 50% 50%,rgba(0,201,177,0.07) 0%,transparent 70%)"}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(30px,5vw,54px)",fontWeight:800,marginBottom:16,letterSpacing:"-1px"}}>Ready to ace your boards?</h2>
        <p style={{fontSize:17,color:SLATE2,marginBottom:44,fontWeight:300}}>Start practicing with your AI examiner right now. Free.</p>
        <button onClick={()=>go("app")} style={{padding:"18px 56px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#00c9b1,#00a896)",color:NAVY,fontWeight:700,fontSize:18,cursor:"pointer",boxShadow:"0 8px 40px rgba(0,201,177,0.45)",fontFamily:"'DM Sans',sans-serif"}}>
          Launch Gasology Free →
        </button>
        <p style={{marginTop:16,fontSize:12,color:SLATE,fontFamily:"monospace"}}>No signup required · Works on mobile · Start in 10 seconds</p>
      </div>

      {/* FOOTER */}
      <footer style={{background:NAVY2,borderTop:"1px solid rgba(255,255,255,0.06)",padding:"36px 24px"}}>
        <div className="footer-row" style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16,maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#00c9b1,#00a896)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>💨</div>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:WHITE}}>Gasology</span>
          </div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center"}}>
            {NAV_ITEMS.map(item=>(
              <button key={item.page} onClick={()=>go(item.page)}
                style={{background:"none",border:"none",color:SLATE,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>
                {item.label}
              </button>
            ))}
          </div>
          <div style={{fontSize:12,color:SLATE,fontFamily:"monospace"}}>© 2026 Gasology · Educational use only</div>
        </div>
      </footer>
    </>
  );
}
