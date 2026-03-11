import { useState } from "react";
import { ResidencyDirectory, FellowshipDirectory } from "./Directory.jsx";
import ConferencesPage from "./Conferences.jsx";
import App from "./App.jsx";

const NAVY  = "#08172e";
const NAVY2 = "#0f2240";
const TEAL  = "#00c9b1";
const TEAL2 = "#00a896";
const SLATE = "#6e90b8";
const SLATE2= "#a8c0d8";
const WHITE = "#f0f6ff";
const GOLD  = "#f0bc3a";
const GREEN = "#2ed47a";
const PURPLE= "#a78bfa";
const ORANGE= "#fb923c";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #08172e; color: #f0f6ff; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
  @keyframes glow     { 0%,100%{box-shadow:0 4px 18px rgba(0,201,177,0.35)} 50%{box-shadow:0 4px 32px rgba(0,201,177,0.65)} }
  .res-card { transition: all 0.28s ease; cursor: pointer; }
  .res-card:hover { transform: translateY(-6px) !important; box-shadow: 0 24px 64px rgba(0,0,0,0.35) !important; }
  .nav-btn { transition: all 0.18s; }
  .nav-btn:hover { opacity: 1 !important; background: rgba(255,255,255,0.08) !important; }
  .feat-card { transition: all 0.22s; }
  .feat-card:hover { border-color: rgba(0,201,177,0.35) !important; transform: translateY(-3px); }
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#2d4a6b;border-radius:4px}
`;

export default function Root() {
  const [showApp,         setShowApp]         = useState(false);
  const [showResidency,   setShowResidency]   = useState(false);
  const [showFellowship,  setShowFellowship]  = useState(false);
  const [showConferences, setShowConferences] = useState(false);
  const [email,           setEmail]           = useState("");
  const [submitted,       setSubmitted]       = useState(false);

  if (showApp)         return <App />;
  if (showResidency)   return <ResidencyDirectory   onBack={() => setShowResidency(false)} />;
  if (showFellowship)  return <FellowshipDirectory  onBack={() => setShowFellowship(false)} />;
  if (showConferences) return <ConferencesPage      onBack={() => setShowConferences(false)} />;

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setShowApp(true), 1200);
  };

  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:"rgba(8,23,46,0.94)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"0 32px",height:"66px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:36,height:36,borderRadius:9,background:"linear-gradient(135deg,#00c9b1,#00a896)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💨</div>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:WHITE,letterSpacing:"-0.3px"}}>Gasology</span>
        </div>

        {/* Nav items */}
        <div style={{display:"flex",alignItems:"center",gap:6,flex:1,justifyContent:"center",flexWrap:"wrap"}}>
          <button className="nav-btn" onClick={()=>document.getElementById("features")?.scrollIntoView({behavior:"smooth"})}
            style={{background:"transparent",border:"none",color:SLATE2,fontSize:14,fontWeight:500,cursor:"pointer",padding:"7px 14px",borderRadius:8,fontFamily:"'DM Sans',sans-serif"}}>Board Prep</button>

          <button className="nav-btn" onClick={()=>setShowResidency(true)}
            style={{background:"rgba(0,201,177,0.12)",border:"1px solid rgba(0,201,177,0.35)",color:TEAL,fontSize:14,fontWeight:700,cursor:"pointer",padding:"7px 18px",borderRadius:9,fontFamily:"'DM Sans',sans-serif",letterSpacing:"-0.1px"}}>
            🏥 Residency Programs
          </button>

          <button className="nav-btn" onClick={()=>setShowFellowship(true)}
            style={{background:"rgba(240,188,58,0.12)",border:"1px solid rgba(240,188,58,0.35)",color:GOLD,fontSize:14,fontWeight:700,cursor:"pointer",padding:"7px 18px",borderRadius:9,fontFamily:"'DM Sans',sans-serif",letterSpacing:"-0.1px"}}>
            🎓 Fellowships
          </button>

          <button className="nav-btn" onClick={()=>setShowConferences(true)}
            style={{background:"rgba(167,139,250,0.12)",border:"1px solid rgba(167,139,250,0.35)",color:PURPLE,fontSize:14,fontWeight:700,cursor:"pointer",padding:"7px 18px",borderRadius:9,fontFamily:"'DM Sans',sans-serif",letterSpacing:"-0.1px"}}>
            🗓️ Conferences 2026
          </button>

          <button className="nav-btn" onClick={()=>document.getElementById("pricing")?.scrollIntoView({behavior:"smooth"})}
            style={{background:"transparent",border:"none",color:SLATE2,fontSize:14,fontWeight:500,cursor:"pointer",padding:"7px 14px",borderRadius:8,fontFamily:"'DM Sans',sans-serif"}}>Pricing</button>
        </div>

        <button onClick={() => setShowApp(true)}
          style={{background:"linear-gradient(135deg,#00c9b1,#00a896)",color:NAVY,padding:"10px 24px",borderRadius:9,border:"none",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0,animation:"glow 3s ease infinite"}}>
          Try Free →
        </button>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"140px 24px 80px",position:"relative",overflow:"hidden",background:"radial-gradient(ellipse 80% 60% at 50% 35%, rgba(0,201,177,0.09) 0%, transparent 70%)"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(0,201,177,0.04) 1px, transparent 1px),linear-gradient(90deg,rgba(0,201,177,0.04) 1px,transparent 1px)",backgroundSize:"64px 64px",maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 75%)"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:860,width:"100%",textAlign:"center"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(0,201,177,0.12)",border:"1px solid rgba(0,201,177,0.35)",borderRadius:30,padding:"7px 20px",fontFamily:"'DM Mono',monospace",fontSize:12,color:TEAL,letterSpacing:1,textTransform:"uppercase",marginBottom:32,animation:"fadeUp 0.5s ease both"}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:TEAL,animation:"pulse 2s infinite"}}/>
            Free · Built for Anesthesia Residents
          </div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(48px,8vw,90px)",fontWeight:800,lineHeight:1.05,letterSpacing:"-2px",color:WHITE,marginBottom:28,animation:"fadeUp 0.5s 0.1s ease both"}}>
            Master Your Boards.<br/>
            <span style={{fontStyle:"italic",background:"linear-gradient(135deg,#00c9b1,#7fffd4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Before the Real Thing.</span>
          </h1>
          <p style={{fontSize:"clamp(17px,2.5vw,21px)",color:SLATE2,lineHeight:1.7,maxWidth:580,margin:"0 auto 48px",fontWeight:300,animation:"fadeUp 0.5s 0.2s ease both"}}>
            The first AI anesthesia educator that thinks, talks, and examines like a real ABA oral board examiner. Built for CA-1s through Fellows.
          </p>
          {!submitted ? (
            <form onSubmit={handleSubmit} style={{display:"flex",gap:12,maxWidth:490,margin:"0 auto 18px",animation:"fadeUp 0.5s 0.3s ease both"}}>
              <input type="email" required placeholder="Enter your email address" value={email} onChange={e=>setEmail(e.target.value)}
                style={{flex:1,padding:"14px 18px",borderRadius:10,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.07)",color:WHITE,fontSize:15,fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
              <button type="submit"
                style={{padding:"14px 24px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#00c9b1,#00a896)",color:NAVY,fontWeight:700,fontSize:15,cursor:"pointer",whiteSpace:"nowrap",boxShadow:"0 4px 18px rgba(0,201,177,0.4)"}}>
                Get Access →
              </button>
            </form>
          ) : (
            <div style={{animation:"fadeUp 0.4s ease both",marginBottom:18,fontSize:17,color:GREEN,fontFamily:"'DM Mono',monospace"}}>✓ Launching Gasology...</div>
          )}
          <button onClick={() => setShowApp(true)}
            style={{background:"transparent",border:"none",color:SLATE2,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textDecoration:"underline"}}>
            Try Free Now — No Signup →
          </button>
        </div>
      </section>

      {/* RESOURCE HUB */}
      <section style={{padding:"20px 24px 80px"}}>
        <div style={{maxWidth:"1080px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"52px"}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:TEAL,letterSpacing:"2px",textTransform:"uppercase",marginBottom:14}}>Resource Hub</div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(36px,5.5vw,64px)",fontWeight:800,letterSpacing:"-1.5px",color:WHITE,lineHeight:1.08}}>
              Everything Anesthesia.<br/>
              <span style={{fontStyle:"italic",color:TEAL}}>In One Place.</span>
            </h2>
            <p style={{fontSize:19,color:SLATE2,marginTop:18,fontWeight:300,maxWidth:540,margin:"18px auto 0",lineHeight:1.65}}>
              Board prep, residency search, fellowship planning, and conference calendar — all free, all in one place.
            </p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"22px"}}>

            {/* AI Board Prep card */}
            <div className="res-card" onClick={() => setShowApp(true)}
              style={{background:"linear-gradient(135deg,rgba(0,201,177,0.13),rgba(0,201,177,0.04))",border:"2px solid rgba(0,201,177,0.4)",borderRadius:26,padding:"38px 32px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-24,right:-16,fontSize:110,opacity:0.06,pointerEvents:"none",lineHeight:1}}>🤖</div>
              <div style={{fontSize:48,marginBottom:20}}>🤖</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:800,color:WHITE,marginBottom:12,lineHeight:1.15}}>AI Board Exam</div>
              <div style={{fontSize:15,color:SLATE2,lineHeight:1.72,marginBottom:24}}>Practice ABA oral boards with an AI examiner that challenges you, scores you, and teaches you. Voice mode. Real-time feedback.</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:26}}>
                {["Oral Boards","Teaching","Quiz","Drug Ref","Quick Review"].map(t=>(
                  <span key={t} style={{background:"rgba(0,201,177,0.15)",border:"1px solid rgba(0,201,177,0.3)",color:TEAL,fontSize:11,fontFamily:"monospace",padding:"4px 11px",borderRadius:20,fontWeight:600}}>{t}</span>
                ))}
              </div>
              <div style={{color:TEAL,fontSize:16,fontFamily:"'DM Mono',monospace",fontWeight:700}}>Launch App Free →</div>
            </div>

            {/* Residency card */}
            <div className="res-card" onClick={() => setShowResidency(true)}
              style={{background:"rgba(255,255,255,0.03)",border:"2px solid rgba(255,255,255,0.1)",borderRadius:26,padding:"38px 32px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-24,right:-16,fontSize:110,opacity:0.05,pointerEvents:"none",lineHeight:1}}>🏥</div>
              <div style={{fontSize:48,marginBottom:20}}>🏥</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:800,color:WHITE,marginBottom:12,lineHeight:1.15}}>Residency Directory</div>
              <div style={{fontSize:15,color:SLATE2,lineHeight:1.72,marginBottom:24}}>Every ACGME-accredited anesthesia residency in the US. Program directors, contact emails, and one-click pitch email.</div>
              <div style={{display:"flex",gap:"20px",marginBottom:26}}>
                {[["80+","Programs"],["50","States"],["PD","Contacts"]].map(([n,l])=>(
                  <div key={l}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:800,color:TEAL}}>{n}</div>
                    <div style={{fontSize:11,color:SLATE,fontFamily:"monospace",marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{color:TEAL,fontSize:16,fontFamily:"'DM Mono',monospace",fontWeight:700}}>Browse Programs →</div>
            </div>

            {/* Fellowship card */}
            <div className="res-card" onClick={() => setShowFellowship(true)}
              style={{background:"rgba(255,255,255,0.03)",border:"2px solid rgba(255,255,255,0.1)",borderRadius:26,padding:"38px 32px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-24,right:-16,fontSize:110,opacity:0.05,pointerEvents:"none",lineHeight:1}}>🎓</div>
              <div style={{fontSize:48,marginBottom:20}}>🎓</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:800,color:WHITE,marginBottom:12,lineHeight:1.15}}>Fellowship Directory</div>
              <div style={{fontSize:15,color:SLATE2,lineHeight:1.72,marginBottom:24}}>40+ fellowships across 8 subspecialties — Regional, Cardiac, Pain, Neuro, Pediatric, Critical Care, OB, and Research.</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:26}}>
                {["Regional","Cardiac","Pain","Neuro","Peds","Critical Care","OB"].map(t=>(
                  <span key={t} style={{background:"rgba(240,188,58,0.12)",border:"1px solid rgba(240,188,58,0.28)",color:GOLD,fontSize:11,fontFamily:"monospace",padding:"4px 11px",borderRadius:20,fontWeight:600}}>{t}</span>
                ))}
              </div>
              <div style={{color:GOLD,fontSize:16,fontFamily:"'DM Mono',monospace",fontWeight:700}}>Browse Fellowships →</div>
            </div>

            {/* Conferences card */}
            <div className="res-card" onClick={() => setShowConferences(true)}
              style={{background:"linear-gradient(135deg,rgba(167,139,250,0.1),rgba(167,139,250,0.03))",border:"2px solid rgba(167,139,250,0.38)",borderRadius:26,padding:"38px 32px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-24,right:-16,fontSize:110,opacity:0.07,pointerEvents:"none",lineHeight:1}}>🗓️</div>
              <div style={{fontSize:48,marginBottom:20}}>🗓️</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:800,color:WHITE,marginBottom:12,lineHeight:1.15}}>Conferences 2026</div>
              <div style={{fontSize:15,color:SLATE2,lineHeight:1.72,marginBottom:24}}>Every major anesthesia conference this year — ASA, ASRA, SOAP, IARS, SPA, and more. Dates, locations, CME info, and links.</div>
              <div style={{display:"flex",gap:"20px",marginBottom:26}}>
                {[["20+","Conferences"],["8","Specialties"],["CME","Eligible"]].map(([n,l])=>(
                  <div key={l}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:800,color:PURPLE}}>{n}</div>
                    <div style={{fontSize:11,color:SLATE,fontFamily:"monospace",marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{color:PURPLE,fontSize:16,fontFamily:"'DM Mono',monospace",fontWeight:700}}>View Calendar →</div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{padding:"80px 24px",background:"radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,201,177,0.05) 0%, transparent 70%)"}}>
        <div style={{maxWidth:960,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:TEAL,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>App Features</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(34px,5vw,56px)",fontWeight:800,letterSpacing:"-1px",marginBottom:16,lineHeight:1.1}}>Study Smarter.<br/><span style={{fontStyle:"italic",color:TEAL}}>Pass Faster.</span></h2>
          <p style={{fontSize:18,color:SLATE2,marginBottom:52,fontWeight:300}}>Every tool you need. Nothing you don't.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20}}>
            {[
              {emoji:"🎙️",title:"Voice Oral Boards",desc:"Speak your answers. AI responds like a real ABA examiner. Mid-scenario complications. Scoring after every case.",color:TEAL},
              {emoji:"📚",title:"Quick Review",desc:"High-yield summaries from M&M, Miller's, and Barash — by system. Tap keywords for instant AI deep-dives.",color:PURPLE},
              {emoji:"💊",title:"Drug Reference",desc:"12 essential drugs with doses, onset, duration, and clinical pearls. Instantly searchable.",color:GREEN},
              {emoji:"🧪",title:"Quiz Mode",desc:"Board-style MCQs with detailed explanations. Pharmacology, physiology, and clinical scenarios.",color:ORANGE},
              {emoji:"🎓",title:"Teaching Mode",desc:"Socratic, evidence-based tutoring. ASA/AHA/ERAS guidelines. Tailored to your training level.",color:TEAL},
              {emoji:"📊",title:"Performance Scoring",desc:"After every board case: score out of 10, strengths, critical gaps, and one key teaching pearl.",color:GOLD},
            ].map(f => (
              <div key={f.title} className="feat-card"
                style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"28px 24px",textAlign:"left"}}>
                <div style={{fontSize:38,marginBottom:14}}>{f.emoji}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:WHITE,marginBottom:9}}>{f.title}</div>
                <div style={{fontSize:14,color:SLATE2,lineHeight:1.68}}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{padding:"80px 24px",textAlign:"center"}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:TEAL,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Pricing</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(34px,5vw,56px)",fontWeight:800,letterSpacing:"-1px",marginBottom:16}}>Start free.<br/><span style={{fontStyle:"italic",color:TEAL}}>Upgrade when ready.</span></h2>
        <p style={{fontSize:18,color:SLATE2,marginBottom:52,fontWeight:300}}>No pressure. No credit card. Get hooked on the free tier first.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24,maxWidth:720,margin:"0 auto"}}>
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:22,padding:"36px 32px",textAlign:"left"}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:SLATE,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Free</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:52,fontWeight:800,color:WHITE,lineHeight:1,marginBottom:6}}>$0<span style={{fontSize:18,color:SLATE}}>/mo</span></div>
            <p style={{fontSize:14,color:SLATE2,marginBottom:28}}>Everything you need to start.</p>
            <ul style={{listStyle:"none",marginBottom:32,display:"flex",flexDirection:"column",gap:10}}>
              {["5 board cases/month","Quiz mode","Drug reference","Teaching mode"].map(f=>(
                <li key={f} style={{fontSize:14,color:SLATE2,display:"flex",alignItems:"center",gap:10}}><span style={{color:TEAL,fontWeight:700}}>✓</span>{f}</li>
              ))}
              {["Voice exam mode","Performance scoring","Unlimited cases"].map(f=>(
                <li key={f} style={{fontSize:14,color:SLATE,display:"flex",alignItems:"center",gap:10}}><span>—</span>{f}</li>
              ))}
            </ul>
            <button onClick={() => setShowApp(true)} style={{width:"100%",padding:14,borderRadius:10,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.07)",color:WHITE,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              Get Started Free
            </button>
          </div>
          <div style={{background:"linear-gradient(135deg,rgba(0,201,177,0.12),rgba(0,168,150,0.04))",border:"1px solid rgba(0,201,177,0.45)",borderRadius:22,padding:"36px 32px",textAlign:"left",boxShadow:"0 8px 48px rgba(0,201,177,0.18)"}}>
            <div style={{display:"inline-block",background:TEAL,color:NAVY,fontSize:11,fontWeight:700,fontFamily:"monospace",padding:"3px 10px",borderRadius:4,letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>Most Popular</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:SLATE,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Pro</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:52,fontWeight:800,color:WHITE,lineHeight:1,marginBottom:6}}>$19<span style={{fontSize:18,color:SLATE}}>/mo</span></div>
            <p style={{fontSize:14,color:SLATE2,marginBottom:28}}>The full board exam experience.</p>
            <ul style={{listStyle:"none",marginBottom:32,display:"flex",flexDirection:"column",gap:10}}>
              {["Unlimited board cases","Full quiz bank","Drug reference","Teaching mode","🎙 Voice exam mode","AI performance scoring","Progress tracking"].map(f=>(
                <li key={f} style={{fontSize:14,color:SLATE2,display:"flex",alignItems:"center",gap:10}}><span style={{color:TEAL,fontWeight:700}}>✓</span>{f}</li>
              ))}
            </ul>
            <button onClick={() => setShowApp(true)} style={{width:"100%",padding:14,borderRadius:10,border:"none",background:"linear-gradient(135deg,#00c9b1,#00a896)",color:NAVY,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 4px 18px rgba(0,201,177,0.35)"}}>
              Start Free Trial →
            </button>
          </div>
        </div>
        <p style={{marginTop:24,fontSize:13,color:SLATE,fontFamily:"monospace"}}>Residency program licensing available · Contact for institutional pricing</p>
      </section>

      {/* FINAL CTA */}
      <div style={{textAlign:"center",padding:"80px 24px",background:"radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,201,177,0.07) 0%, transparent 70%)"}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,5vw,56px)",fontWeight:800,marginBottom:16,letterSpacing:"-1px"}}>Ready to ace your boards?</h2>
        <p style={{fontSize:18,color:SLATE2,marginBottom:44,fontWeight:300}}>Start practicing with your AI examiner right now. Free.</p>
        <button onClick={() => setShowApp(true)}
          style={{padding:"18px 56px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#00c9b1,#00a896)",color:NAVY,fontWeight:700,fontSize:19,cursor:"pointer",boxShadow:"0 8px 40px rgba(0,201,177,0.45)",fontFamily:"'DM Sans',sans-serif"}}>
          Launch Gasology Free →
        </button>
        <p style={{marginTop:16,fontSize:12,color:SLATE,fontFamily:"monospace"}}>No signup required · Works on mobile · Start in 10 seconds</p>
      </div>

      {/* FOOTER */}
      <footer style={{background:NAVY2,borderTop:"1px solid rgba(255,255,255,0.06)",padding:"36px 48px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#00c9b1,#00a896)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>💨</div>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:WHITE}}>Gasology</span>
        </div>
        <div style={{display:"flex",gap:24,flexWrap:"wrap",justifyContent:"center"}}>
          <button onClick={() => setShowResidency(true)}   style={{background:"none",border:"none",color:SLATE,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>Residency Programs</button>
          <button onClick={() => setShowFellowship(true)}  style={{background:"none",border:"none",color:SLATE,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>Fellowships</button>
          <button onClick={() => setShowConferences(true)} style={{background:"none",border:"none",color:SLATE,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>Conferences 2026</button>
        </div>
        <div style={{fontSize:12,color:SLATE,fontFamily:"monospace"}}>© 2026 Gasology · Educational use only</div>
      </footer>
    </>
  );
}
