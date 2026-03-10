import { useState } from "react";
import { ResidencyDirectory, FellowshipDirectory } from "./Directory.jsx";
import App from "./App.jsx";

const NAVY="#08172e", NAVY2="#0f2240", NAVY3="#1a3460";
const TEAL="#00c9b1", TEAL2="#00a896";
const SLATE="#6e90b8", SLATE2="#a8c0d8";
const WHITE="#f0f6ff", GOLD="#f0bc3a", GREEN="#2ed47a";

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${NAVY}; color: ${WHITE}; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
  body::before {
    content: ''; position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 0; opacity: 0.4;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
  @keyframes scrollBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
  @keyframes examGlow {
    0%,100%{box-shadow: 0 0 0 20px rgba(0,201,177,0.06), 0 0 0 40px rgba(0,201,177,0.03)}
    50%{box-shadow: 0 0 0 28px rgba(0,201,177,0.1), 0 0 0 56px rgba(0,201,177,0.05)}
  }
  @keyframes wave { 0%,100%{transform:scaleY(0.5);opacity:0.4} 50%{transform:scaleY(1);opacity:1} }
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .mode-card-hover:hover { background: rgba(0,201,177,0.06) !important; border-color: rgba(0,201,177,0.45) !important; transform: translateY(-3px); box-shadow: 0 14px 36px rgba(0,0,0,0.22); }
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#C4D4E8;border-radius:4px}
`;

export default function Root() {
  const [showApp, setShowApp] = useState(false);
  const [showResidency, setShowResidency] = useState(false);
  const [showFellowship, setShowFellowship] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleTryFree = () => setShowApp(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setShowApp(true), 1200);
  };

  if (showApp) return <App />;
  if (showResidency) return <ResidencyDirectory onBack={()=>setShowResidency(false)}/>;
  if (showFellowship) return <FellowshipDirectory onBack={()=>setShowFellowship(false)}/>;

  return (
    <>
      <style>{globalCSS}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"18px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(8,23,46,0.85)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <div style={{width:38,height:38,borderRadius:10,background:`linear-gradient(135deg,${TEAL},${TEAL2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>💨</div>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:WHITE}}>Gasology</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:32}}>
          <a href="#features" style={{color:SLATE2,fontSize:14,textDecoration:"none",fontWeight:500}}>Features</a>
          <a onClick={()=>setShowResidency(true)} href="#" style={{color:SLATE2,fontSize:14,textDecoration:"none",fontWeight:500}}>Residency Programs</a>
          <a onClick={()=>setShowFellowship(true)} href="#" style={{color:SLATE2,fontSize:14,textDecoration:"none",fontWeight:500}}>Fellowships</a>
          <a href="#how" style={{color:SLATE2,fontSize:14,textDecoration:"none",fontWeight:500}}>How It Works</a>
          <a href="#pricing" style={{color:SLATE2,fontSize:14,textDecoration:"none",fontWeight:500}}>Pricing</a>
          <button onClick={handleTryFree} style={{background:`linear-gradient(135deg,${TEAL},${TEAL2})`,color:NAVY,padding:"9px 22px",borderRadius:8,border:"none",fontWeight:700,fontSize:14,cursor:"pointer"}}>Try Free →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 24px 80px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 70% 60% at 50% 40%, rgba(0,201,177,0.08) 0%, transparent 70%)`}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(0,201,177,0.04) 1px, transparent 1px),linear-gradient(90deg, rgba(0,201,177,0.04) 1px, transparent 1px)`,backgroundSize:"60px 60px",maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:820,width:"100%",textAlign:"center"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(0,201,177,0.1)",border:"1px solid rgba(0,201,177,0.3)",borderRadius:30,padding:"7px 18px",fontFamily:"'DM Mono',monospace",fontSize:12,color:TEAL,letterSpacing:1,textTransform:"uppercase",marginBottom:28,animation:"fadeUp 0.6s ease both"}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:TEAL,animation:"pulse 2s infinite"}}/>
            Now in Beta · Built for Anesthesiologists
          </div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(42px,7vw,80px)",fontWeight:800,lineHeight:1.08,letterSpacing:"-1.5px",color:WHITE,marginBottom:24,animation:"fadeUp 0.6s 0.1s ease both"}}>
            Master Your Boards.<br/>
            <span style={{fontStyle:"italic",background:`linear-gradient(135deg,${TEAL},#7fffd4)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Before the Real Thing.</span>
          </h1>
          <p style={{fontSize:"clamp(16px,2.5vw,20px)",color:SLATE2,lineHeight:1.7,maxWidth:560,margin:"0 auto 44px",fontWeight:300,animation:"fadeUp 0.6s 0.2s ease both"}}>
            The first AI-powered anesthesia educator that thinks, talks, and examines like a real ABA oral board examiner. Built for CA-1s through Fellows.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} style={{display:"flex",gap:12,maxWidth:480,margin:"0 auto 20px",animation:"fadeUp 0.6s 0.3s ease both"}}>
              <input
                type="email" required placeholder="Enter your email address"
                value={email} onChange={e=>setEmail(e.target.value)}
                style={{flex:1,padding:"14px 18px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,color:WHITE,fontFamily:"'DM Sans',sans-serif",fontSize:15,outline:"none"}}
              />
              <button type="submit" style={{padding:"14px 28px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${TEAL},${TEAL2})`,color:NAVY,fontWeight:700,fontSize:15,cursor:"pointer",whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,201,177,0.3)"}}>
                Get Early Access
              </button>
            </form>
          ) : (
            <div style={{padding:"16px 24px",background:"rgba(46,212,122,0.1)",border:`1px solid ${GREEN}`,borderRadius:12,color:GREEN,fontSize:15,marginBottom:20,animation:"fadeUp 0.4s ease both"}}>
              ✓ You're on the list! Opening the app now...
            </div>
          )}

          <p style={{fontSize:12,color:SLATE,fontFamily:"'DM Mono',monospace",marginBottom:32}}>Free forever tier · No credit card · Cancel anytime</p>

          <button onClick={handleTryFree} style={{background:"transparent",border:`2px solid rgba(0,201,177,0.4)`,color:TEAL,padding:"14px 36px",borderRadius:12,fontSize:16,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>
            Try Free Now — No Signup →
          </button>
        </div>
      </section>

      {/* STATS */}
      <div style={{background:NAVY2,borderTop:"1px solid rgba(255,255,255,0.06)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"28px 48px",display:"flex",justifyContent:"center",gap:64,flexWrap:"wrap"}}>
        {[["8+","Board Case Types"],["12","Drug References"],["ABA","Exam Format"],["1:1","Voice Interaction"],["AI","Powered Scoring"]].map(([num,label])=>(
          <div key={label} style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:700,color:TEAL,lineHeight:1}}>{num}</div>
            <div style={{fontSize:12,color:SLATE,marginTop:4,fontFamily:"'DM Mono',monospace"}}>{label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section id="features" style={{padding:"96px 24px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{marginBottom:56}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:TEAL,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>What's Inside</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,5vw,52px)",fontWeight:700,letterSpacing:"-0.8px",marginBottom:16}}>Everything you need<br/>to pass your boards.</h2>
          <p style={{fontSize:17,color:SLATE2,lineHeight:1.7,maxWidth:540,fontWeight:300}}>Gasology replaces expensive review courses with an always-available AI examiner that adapts to your level.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
          {[
            ["📋","ABA Oral Board Simulator","Realistic case stems across cardiac, airway, OB, neuro, pediatric, and critical care. The AI pushes back on vague answers just like a real examiner.","rgba(0,201,177,0.1)"],
            ["🎙","Voice Exam Mode","The examiner speaks aloud in a deep male voice. You respond by voice. Simulates the real oral board experience so nothing surprises you on exam day.","rgba(240,188,58,0.1)"],
            ["📊","Performance Scoring","After each case, receive an AI score out of 10, a breakdown of strengths and gaps, and a key clinical pearl to remember.","rgba(46,212,122,0.1)"],
            ["🎓","Teaching Mode","Socratic, evidence-based teaching across 10 topic areas. References ASA, AHA, and ERAS guidelines. Tailored to your training level.","rgba(0,201,177,0.1)"],
            ["🧪","Quiz Mode","High-yield MCQs on MAC values, NMB reversal, LAST treatment, Mallampati, and more — with detailed explanations after each answer.","rgba(224,85,85,0.1)"],
            ["💊","Drug Reference","Instant lookup for 12 key anesthesia drugs — dose, onset, duration, and clinical pearls for propofol, ketamine, rocuronium, fentanyl, and more.","rgba(110,144,184,0.1)"],
          ].map(([icon,title,desc,bg])=>(
            <div key={title} className="mode-card-hover" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"32px 28px",transition:"all 0.3s",cursor:"pointer"}} onClick={handleTryFree}>
              <div style={{width:52,height:52,borderRadius:14,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:18}}>{icon}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:WHITE,marginBottom:10}}>{title}</div>
              <div style={{fontSize:14,color:SLATE2,lineHeight:1.7}}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div id="how" style={{background:NAVY2,padding:"96px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:TEAL,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>How It Works</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,5vw,52px)",fontWeight:700,letterSpacing:"-0.8px",marginBottom:56}}>From zero to board-ready<br/>in three steps.</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:40}}>
            {[
              ["01","Choose Your Mode","Select Teaching Mode to build knowledge, or Oral Board Examiner to simulate the real thing. Set your training level and focus topic."],
              ["02","Engage the Examiner","Type or speak your answers. The AI presents realistic ABA cases, challenges incomplete responses, and throws in mid-scenario complications."],
              ["03","Review & Improve","Receive a detailed performance score after each case. Track your weak areas and revisit cases until your answers are board-ready."],
            ].map(([num,title,desc])=>(
              <div key={num}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:72,fontWeight:800,color:"rgba(0,201,177,0.12)",lineHeight:1,marginBottom:-16}}>{num}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,marginBottom:10}}>{title}</div>
                <div style={{fontSize:14,color:SLATE2,lineHeight:1.7}}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <section id="pricing" style={{padding:"96px 24px",textAlign:"center"}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:TEAL,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Pricing</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,5vw,52px)",fontWeight:700,letterSpacing:"-0.8px",marginBottom:16}}>Start free.<br/>Upgrade when ready.</h2>
        <p style={{fontSize:17,color:SLATE2,marginBottom:56,fontWeight:300}}>No pressure, no credit card. Get hooked on the free tier first.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24,maxWidth:720,margin:"0 auto"}}>
          {/* Free */}
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"36px 32px",textAlign:"left"}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:SLATE,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Free</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:48,fontWeight:800,color:WHITE,lineHeight:1,marginBottom:6}}>$0<span style={{fontSize:18,color:SLATE}}>/mo</span></div>
            <p style={{fontSize:13,color:SLATE2,marginBottom:28,lineHeight:1.6}}>Everything you need to get started.</p>
            <ul style={{listStyle:"none",marginBottom:32,display:"flex",flexDirection:"column",gap:10}}>
              {["5 board cases per month","Quiz mode","Drug reference","Teaching mode"].map(f=>(
                <li key={f} style={{fontSize:14,color:SLATE2,display:"flex",alignItems:"center",gap:10}}><span style={{color:TEAL,fontWeight:700}}>✓</span>{f}</li>
              ))}
              {["Voice exam mode","Performance scoring","Unlimited cases"].map(f=>(
                <li key={f} style={{fontSize:14,color:SLATE,display:"flex",alignItems:"center",gap:10}}><span style={{color:SLATE}}>—</span>{f}</li>
              ))}
            </ul>
            <button onClick={handleTryFree} style={{width:"100%",padding:13,borderRadius:10,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.07)",color:WHITE,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              Get Started Free
            </button>
          </div>
          {/* Pro */}
          <div style={{background:`linear-gradient(135deg,rgba(0,201,177,0.1),rgba(0,168,150,0.05))`,border:"1px solid rgba(0,201,177,0.4)",borderRadius:20,padding:"36px 32px",textAlign:"left",boxShadow:"0 8px 40px rgba(0,201,177,0.15)"}}>
            <div style={{display:"inline-block",background:TEAL,color:NAVY,fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",padding:"3px 10px",borderRadius:4,letterSpacing:1,textTransform:"uppercase",marginBottom:16}}>Most Popular</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:SLATE,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Pro</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:48,fontWeight:800,color:WHITE,lineHeight:1,marginBottom:6}}>$19<span style={{fontSize:18,color:SLATE}}>/mo</span></div>
            <p style={{fontSize:13,color:SLATE2,marginBottom:28,lineHeight:1.6}}>The full board exam experience.</p>
            <ul style={{listStyle:"none",marginBottom:32,display:"flex",flexDirection:"column",gap:10}}>
              {["Unlimited board cases","Quiz mode + expanded Qs","Full drug reference","Teaching mode","🎙 Voice exam mode","AI performance scoring","Progress tracking"].map(f=>(
                <li key={f} style={{fontSize:14,color:SLATE2,display:"flex",alignItems:"center",gap:10}}><span style={{color:TEAL,fontWeight:700}}>✓</span>{f}</li>
              ))}
            </ul>
            <button onClick={handleTryFree} style={{width:"100%",padding:13,borderRadius:10,border:"none",background:`linear-gradient(135deg,${TEAL},${TEAL2})`,color:NAVY,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 4px 16px rgba(0,201,177,0.3)"}}>
              Start Free Trial →
            </button>
          </div>
        </div>
        <p style={{marginTop:24,fontSize:13,color:SLATE,fontFamily:"'DM Mono',monospace"}}>Residency program pricing available · Contact for institutional licensing</p>
      </section>

      {/* DIRECTORY CARDS */}
      <section style={{padding:"0 24px 80px",maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24}}>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"32px",cursor:"pointer",transition:"all 0.3s"}}
          onClick={()=>setShowResidency(true)}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,201,177,0.4)";e.currentTarget.style.transform="translateY(-4px)"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.transform="translateY(0)"}}>
          <div style={{fontSize:40,marginBottom:16}}>🏥</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:WHITE,marginBottom:8}}>Residency Directory</div>
          <div style={{fontSize:14,color:SLATE2,lineHeight:1.7,marginBottom:20}}>Browse all {80}+ ACGME-accredited anesthesia residency programs. Filter by state, find program directors, and send a pitch email for Gasology in one click.</div>
          <div style={{color:TEAL,fontSize:13,fontFamily:"'DM Mono',monospace",fontWeight:700}}>Browse Programs →</div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"32px",cursor:"pointer",transition:"all 0.3s"}}
          onClick={()=>setShowFellowship(true)}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(240,188,58,0.4)";e.currentTarget.style.transform="translateY(-4px)"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.transform="translateY(0)"}}>
          <div style={{fontSize:40,marginBottom:16}}>🎓</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:WHITE,marginBottom:8}}>Fellowship Directory</div>
          <div style={{fontSize:14,color:SLATE2,lineHeight:1.7,marginBottom:20}}>Browse anesthesia fellowships across 8 specialties — Regional, Cardiac, Pain, Neuro, Pediatric, Critical Care, OB, and more. With contact info and direct pitch tool.</div>
          <div style={{color:GOLD,fontSize:13,fontFamily:"'DM Mono',monospace",fontWeight:700}}>Browse Fellowships →</div>
        </div>
      </section>

      {/* FINAL CTA */}
      <div style={{textAlign:"center",padding:"80px 24px",background:`radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,201,177,0.06) 0%, transparent 70%)`}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,5vw,52px)",fontWeight:700,marginBottom:16}}>Ready to ace your boards?</h2>
        <p style={{fontSize:17,color:SLATE2,marginBottom:44,fontWeight:300}}>Start practicing with your AI examiner right now. Free.</p>
        <button onClick={handleTryFree} style={{padding:"18px 48px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${TEAL},${TEAL2})`,color:NAVY,fontWeight:700,fontSize:18,cursor:"pointer",boxShadow:"0 8px 32px rgba(0,201,177,0.4)",fontFamily:"'DM Sans',sans-serif"}}>
          Launch Gasology Free →
        </button>
        <p style={{marginTop:16,fontSize:12,color:SLATE,fontFamily:"'DM Mono',monospace"}}>No signup required · Works on mobile · Start in 10 seconds</p>
      </div>

      {/* FOOTER */}
      <footer style={{background:NAVY2,borderTop:"1px solid rgba(255,255,255,0.06)",padding:"40px 48px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${TEAL},${TEAL2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>💨</div>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:WHITE}}>Gasology</span>
        </div>
        <div style={{fontSize:12,color:SLATE,fontFamily:"'DM Mono',monospace"}}>© 2025 Gasology · For educational use only · Not a substitute for clinical supervision</div>
        <div style={{display:"flex",gap:24}}>
          {["Privacy","Terms","Contact"].map(l=>(
            <a key={l} href="#" style={{fontSize:13,color:SLATE,textDecoration:"none"}}>{l}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
