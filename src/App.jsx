import { useState, useRef, useEffect } from "react";

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const NAVY="#0B1F3A",NAVY2="#142952",NAVY3="#1e3a6e",TEAL="#00C9B1",TEAL2="#009E8C",
      SLATE="#8BA3C4",SLATE2="#C4D4E8",WHITE="#F4F8FF",OFF="#EBF1F9",
      GOLD="#F5C842",RED="#E05C5C",GREEN="#2ECC7F";

const TOPICS=["Airway","Regional","Cardiac","Neuro","OB","Pediatric","Pharmacology","Critical Care","Pain","TIVA"];

const DRUG_REF = [
  {name:"Propofol",class:"IV Anesthetic",dose:"1-2.5 mg/kg IV induction; 50-150 mcg/kg/min infusion",onset:"30-60 sec",duration:"5-10 min",notes:"Cardiorespiratory depression; pain on injection; lipid emulsion; antiemetic properties at sub-hypnotic doses"},
  {name:"Ketamine",class:"Dissociative Anesthetic",dose:"1-2 mg/kg IV; 4-6 mg/kg IM",onset:"30-60 sec IV",duration:"10-20 min",notes:"Bronchodilator; preserves airway reflexes; sympathomimetic; emergence phenomena; NMDA antagonist"},
  {name:"Succinylcholine",class:"Depolarizing NMB",dose:"1-1.5 mg/kg IV",onset:"60 sec",duration:"8-12 min",notes:"RSI drug of choice; contraindicated in burns >24h, crush injury, UMN/LMN disease, malignant hyperthermia susceptibility"},
  {name:"Rocuronium",class:"Non-depolarizing NMB",dose:"0.6 mg/kg intubation; 1.2 mg/kg RSI",onset:"60-90 sec (1.2 mg/kg: 60 sec)",duration:"30-60 min",notes:"Reversed by sugammadex; high-dose RSI alternative to succinylcholine"},
  {name:"Sugammadex",class:"NMB Reversal",dose:"2 mg/kg (TOF≥2); 4 mg/kg (PTC 1-2); 16 mg/kg (immediate)",onset:"3 min",duration:"N/A",notes:"Selective reversal of rocuronium/vecuronium; bradycardia risk; not for benzylisoquinolines"},
  {name:"Neostigmine",class:"Cholinesterase Inhibitor",dose:"0.04-0.07 mg/kg IV (max 5 mg)",onset:"7-10 min",duration:"30-60 min",notes:"Must give with anticholinergic (glycopyrrolate 0.2mg per 1mg neostigmine); not for deep block"},
  {name:"Fentanyl",class:"Opioid",dose:"1-3 mcg/kg bolus; 0.5-2 mcg/kg/hr infusion",onset:"1-2 min",duration:"30-60 min",notes:"100x morphine potency; chest wall rigidity at high doses; minimal histamine release"},
  {name:"Midazolam",class:"Benzodiazepine",dose:"0.02-0.04 mg/kg IV premedication",onset:"2-3 min",duration:"15-30 min",notes:"Anterograde amnesia; anticonvulsant; reversible with flumazenil; accumulates with prolonged infusion"},
  {name:"Epinephrine",class:"Vasopressor/Inotrope",dose:"10-100 mcg bolus; 0.01-0.5 mcg/kg/min infusion",onset:"Immediate",duration:"5-10 min",notes:"Alpha+Beta agonist; cardiac arrest: 1mg q3-5min; anaphylaxis: 0.3mg IM; added to LA prolongs block"},
  {name:"Vasopressin",class:"Vasopressor",dose:"0.03-0.04 units/min infusion; 40 units arrest",onset:"Immediate",duration:"10-20 min",notes:"V1 receptor agonist; nonadrenergic; useful in refractory vasodilatory shock; preserves splanchnic flow"},
  {name:"Dexmedetomidine",class:"Alpha-2 Agonist",dose:"0.2-0.7 mcg/kg/hr; 1 mcg/kg load over 10 min",onset:"15-30 min",duration:"Variable",notes:"Sedation without respiratory depression; analgesic sparing; bradycardia/hypotension; awake fiberoptic adjunct"},
  {name:"Sevoflurane",class:"Volatile Agent",dose:"MAC 2.05% (decreases with age/N2O)",onset:"Rapid",duration:"Variable",notes:"Non-pungent; good for inhalation induction; compound A nephrotoxicity concern; low blood:gas = rapid"},
];

const BOARD_CASES = [
  {title:"Cardiac — Severe AS",stem:"A 72yo male with severe aortic stenosis (AVA 0.6cm², mean gradient 52mmHg), EF 35%, presenting for urgent hip ORIF after a fall. He is on metoprolol and furosemide.",focus:"cardiac"},
  {title:"Airway — Anticipated Difficult",stem:"A 45yo female with morbid obesity (BMI 52), OSA, Mallampati IV, thyromental distance 3cm, limited mouth opening, and a history of prior failed intubation, presenting for laparoscopic sleeve gastrectomy.",focus:"airway"},
  {title:"OB — Urgent C-Section",stem:"A 29yo G2P1 at 38 weeks with preeclampsia with severe features (BP 168/110, platelets 82,000, creatinine 1.4) requiring urgent cesarean delivery. She has received magnesium sulfate.",focus:"ob"},
  {title:"Pediatric — Tonsillectomy",stem:"A 4yo male, 16kg, with obstructive sleep apnea and recurrent tonsillitis presenting for tonsillectomy and adenoidectomy. Parents report he frequently desaturates at night. No IV access.",focus:"pediatric"},
  {title:"Neuro — Craniotomy",stem:"A 58yo female with a right frontal meningioma causing elevated ICP (headaches, papilledema) presenting for elective craniotomy. She is on dexamethasone and levetiracetam.",focus:"neuro"},
  {title:"Regional — Interscalene Block",stem:"A 55yo male presenting for right shoulder rotator cuff repair. He has mild COPD (FEV1 68%) and is anticoagulated with apixaban, last dose 18 hours ago.",focus:"regional"},
  {title:"Critical Care — ARDS",stem:"A 40yo female with severe ARDS (P/F ratio 88) on mechanical ventilation. Current settings: FiO2 80%, PEEP 14, TV 420mL. She is now developing hemodynamic instability with BP 80/50.",focus:"critical care"},
  {title:"Trauma — Hemorrhagic Shock",stem:"A 32yo male arrives after an MVC with suspected splenic laceration. BP 70/40, HR 138, GCS 12. He is combative, has vomited, and has no IV access.",focus:"trauma"},
];

const QUIZ_QUESTIONS = [
  {q:"What is the MAC of sevoflurane in a 40-year-old patient?",a:"2.05%",options:["1.15%","2.05%","3.5%","0.75%"],exp:"MAC of sevoflurane is 2.05% at age 40. MAC decreases ~6% per decade after age 40. N2O reduces MAC additively."},
  {q:"What reversal agent is used for rocuronium-induced neuromuscular blockade?",a:"Sugammadex",options:["Neostigmine","Flumazenil","Sugammadex","Naloxone"],exp:"Sugammadex is a modified gamma-cyclodextrin that encapsulates rocuronium (and vecuronium). Dose: 2mg/kg for moderate block, 4mg/kg for deep block, 16mg/kg for immediate reversal."},
  {q:"Which of the following is a contraindication to succinylcholine?",a:"Denervation injury >24 hours",options:["Renal failure","Denervation injury >24 hours","Hepatic failure","Hypertension"],exp:"Succinylcholine causes life-threatening hyperkalemia in denervation injuries, burns >24h, crush injuries, and UMN/LMN lesions due to upregulation of extrajunctional acetylcholine receptors."},
  {q:"What is the mechanism of action of dexmedetomidine?",a:"Alpha-2 adrenergic agonist",options:["GABA-A agonist","NMDA antagonist","Alpha-2 adrenergic agonist","Opioid receptor agonist"],exp:"Dexmedetomidine acts on alpha-2 receptors in the locus coeruleus (sedation) and spinal cord (analgesia). Unlike other sedatives, it does not cause significant respiratory depression."},
  {q:"What is the Mallampati classification based on?",a:"Visibility of oropharyngeal structures with mouth open",options:["Thyromental distance","Neck circumference","Visibility of oropharyngeal structures with mouth open","Jaw protrusion ability"],exp:"Mallampati I: soft palate, uvula, fauces, pillars visible. II: soft palate, uvula, fauces. III: soft palate, base of uvula. IV: soft palate not visible. Class III/IV predict difficult laryngoscopy."},
  {q:"Which volatile anesthetic has the lowest blood:gas partition coefficient?",a:"Desflurane",options:["Halothane","Isoflurane","Sevoflurane","Desflurane"],exp:"Desflurane (0.45) < Sevoflurane (0.65) < Isoflurane (1.4) < Halothane (2.5). Lower coefficient = faster induction and emergence. Desflurane requires heated vaporizer due to high vapor pressure."},
  {q:"In obstetric anesthesia, what is the significance of aortocaval compression?",a:"Supine position compresses IVC/aorta reducing cardiac output",options:["It causes fetal bradycardia only","Supine position compresses IVC/aorta reducing cardiac output","It only affects women in labor","It is prevented by epidural analgesia"],exp:"After ~20 weeks gestation, the gravid uterus compresses the IVC and aorta in supine position. This reduces venous return and CO by up to 30%. Prevention: left uterine displacement."},
  {q:"What is the first-line treatment for local anesthetic systemic toxicity (LAST)?",a:"20% Lipid emulsion (Intralipid)",options:["Epinephrine 1mg IV","20% Lipid emulsion (Intralipid)","Sodium bicarbonate","Calcium gluconate"],exp:"Lipid emulsion 1.5mL/kg bolus followed by 0.25mL/kg/min infusion. Mechanism: 'lipid sink' sequesters lipophilic LA. Also: stop injection, airway management, benzodiazepines for seizures, avoid vasopressin/Ca-channel blockers."},
];

const TUTOR_SYS=`You are Gasology, an expert anesthesiologist-educator. Teach residents, fellows, and students with clinical rigor, Socratic questioning, and evidence-based medicine. Reference ASA/AHA/ERAS guidelines. Use mnemonics and clinical pearls. End with a follow-up question. Be authoritative and concise.`;
const BOARDS_SYS=`You are a stern ABA oral board examiner. Present ABA-format clinical scenarios. Challenge vague answers ("Tell me more", "What specifically?"). Add mid-scenario complications. Do NOT give answers. Score responses and give brief feedback after each case. In voice mode keep replies to 2-3 sentences.`;
const SCORE_SYS=`You are an ABA oral board examiner scoring a candidate's performance. After their final response to a case, provide: 1) Overall score (1-10), 2) What they did well (2-3 points), 3) Critical gaps or errors (2-3 points), 4) One key learning point. Format as JSON: {"score":X,"strong":["..."],"gaps":["..."],"pearl":"..."}`;

function strip(t){return t.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#{1,3} /g,"").replace(/\n+/g," ").trim();}
function fmt(t){return t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/^- (.+)$/gm,'<div class="li">$1</div>').replace(/\n\n/g,"<br/><br/>").replace(/\n/g,"<br/>");}

// ── SCORE BADGE ──
function ScoreBadge({score}){
  const color=score>=8?GREEN:score>=6?GOLD:RED;
  return <div style={{display:"inline-flex",alignItems:"center",gap:"6px",background:`${color}22`,border:`1px solid ${color}`,borderRadius:"8px",padding:"4px 12px",fontSize:"13px",fontWeight:700,color,fontFamily:"monospace"}}>
    Score: {score}/10 {score>=8?"🏆":score>=6?"✅":"📚"}
  </div>;
}

// ── SCORE CARD ──
function ScoreCard({data,onClose}){
  const color=data.score>=8?GREEN:data.score>=6?GOLD:RED;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:"20px"}}>
      <div style={{background:WHITE,borderRadius:"20px",padding:"32px",maxWidth:"480px",width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{textAlign:"center",marginBottom:"24px"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:700,color:NAVY,marginBottom:"8px"}}>Case Performance</div>
          <div style={{fontSize:"48px",fontWeight:800,color,fontFamily:"monospace"}}>{data.score}<span style={{fontSize:"24px",color:SLATE}}>/10</span></div>
          <div style={{fontSize:"14px",color:SLATE,marginTop:"4px"}}>{data.score>=8?"Excellent":data.score>=6?"Satisfactory":"Needs Review"}</div>
        </div>
        <div style={{marginBottom:"16px"}}>
          <div style={{fontSize:"12px",fontWeight:700,color:GREEN,textTransform:"uppercase",letterSpacing:"1px",fontFamily:"monospace",marginBottom:"6px"}}>✓ Strengths</div>
          {data.strong.map((s,i)=><div key={i} style={{fontSize:"14px",color:"#1a2e4a",padding:"4px 0",borderBottom:"1px solid #EBF1F9"}}>• {s}</div>)}
        </div>
        <div style={{marginBottom:"16px"}}>
          <div style={{fontSize:"12px",fontWeight:700,color:RED,textTransform:"uppercase",letterSpacing:"1px",fontFamily:"monospace",marginBottom:"6px"}}>✗ Gaps to Address</div>
          {data.gaps.map((g,i)=><div key={i} style={{fontSize:"14px",color:"#1a2e4a",padding:"4px 0",borderBottom:"1px solid #EBF1F9"}}>• {g}</div>)}
        </div>
        <div style={{background:`${TEAL}15`,border:`1px solid ${TEAL}`,borderRadius:"10px",padding:"12px",marginBottom:"20px"}}>
          <div style={{fontSize:"11px",fontWeight:700,color:TEAL,fontFamily:"monospace",marginBottom:"4px"}}>💡 KEY PEARL</div>
          <div style={{fontSize:"14px",color:NAVY,lineHeight:1.6}}>{data.pearl}</div>
        </div>
        <button onClick={onClose} style={{width:"100%",padding:"12px",borderRadius:"10px",border:"none",background:`linear-gradient(135deg,${NAVY},${NAVY3})`,color:"white",fontSize:"15px",fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif"}}>Continue Exam</button>
      </div>
    </div>
  );
}

// ── QUIZ MODE ──
function QuizMode({level,onBack}){
  const [idx,setIdx]=useState(0);
  const [selected,setSelected]=useState(null);
  const [showExp,setShowExp]=useState(false);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const q=QUIZ_QUESTIONS[idx];
  const correct=selected===q.a;

  const pick=(opt)=>{
    if(selected) return;
    setSelected(opt);
    if(opt===q.a) setScore(s=>s+1);
    setShowExp(true);
  };
  const next=()=>{
    if(idx<QUIZ_QUESTIONS.length-1){setIdx(i=>i+1);setSelected(null);setShowExp(false);}
    else setDone(true);
  };

  if(done) return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:NAVY,fontFamily:"Georgia,serif",padding:"32px"}}>
      <div style={{fontSize:"48px",marginBottom:"16px"}}>🎓</div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:"28px",fontWeight:700,color:WHITE,marginBottom:"8px"}}>Quiz Complete!</div>
      <div style={{fontSize:"48px",fontWeight:800,color:score>=7?GREEN:score>=5?GOLD:RED,fontFamily:"monospace",margin:"12px 0"}}>{score}/{QUIZ_QUESTIONS.length}</div>
      <div style={{color:SLATE,fontSize:"16px",marginBottom:"32px"}}>{score>=7?"Excellent performance":"Keep studying — review the explanations"}</div>
      <button onClick={onBack} style={{padding:"12px 32px",borderRadius:"12px",border:"none",background:`linear-gradient(135deg,${TEAL},${TEAL2})`,color:NAVY,fontSize:"16px",fontWeight:800,cursor:"pointer"}}>Back to Gasology</button>
    </div>
  );

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:NAVY,fontFamily:"Georgia,serif"}}>
      <style>{globalCSS}</style>
      <div style={{background:NAVY2,padding:"14px 20px",display:"flex",alignItems:"center",gap:"12px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <button onClick={onBack} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.18)",color:SLATE,borderRadius:"7px",padding:"5px 11px",cursor:"pointer",fontSize:"12px",fontFamily:"monospace"}}>← Back</button>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:"16px",fontWeight:700,color:WHITE}}>Quiz Mode</div>
        <div style={{marginLeft:"auto",color:SLATE,fontSize:"13px",fontFamily:"monospace"}}>{idx+1} / {QUIZ_QUESTIONS.length}</div>
        <div style={{background:`${score>0?GREEN:SLATE}22`,border:`1px solid ${score>0?GREEN:SLATE}`,borderRadius:"6px",padding:"3px 10px",fontSize:"12px",fontFamily:"monospace",color:score>0?GREEN:SLATE}}>{score} correct</div>
      </div>
      {/* Progress bar */}
      <div style={{height:"3px",background:NAVY3}}><div style={{height:"100%",background:`linear-gradient(90deg,${TEAL},${TEAL2})`,width:`${((idx+1)/QUIZ_QUESTIONS.length)*100}%`,transition:"width 0.4s"}}/></div>
      <div style={{flex:1,overflowY:"auto",padding:"32px 20px",display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{maxWidth:"560px",width:"100%"}}>
          <div style={{background:NAVY2,borderRadius:"16px",padding:"28px",marginBottom:"20px",border:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{fontSize:"11px",color:TEAL,fontFamily:"monospace",letterSpacing:"1px",marginBottom:"10px"}}>QUESTION {idx+1}</div>
            <div style={{fontSize:"18px",color:WHITE,lineHeight:1.6,fontFamily:"'Playfair Display',serif"}}>{q.q}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"20px"}}>
            {q.options.map(opt=>{
              const isCorrect=opt===q.a,isPicked=opt===selected;
              let bg="rgba(255,255,255,0.04)",border="1px solid rgba(255,255,255,0.1)",color=WHITE;
              if(selected){
                if(isCorrect){bg=`${GREEN}22`;border=`1px solid ${GREEN}`;color=GREEN;}
                else if(isPicked){bg=`${RED}22`;border=`1px solid ${RED}`;color=RED;}
              }
              return <button key={opt} onClick={()=>pick(opt)} style={{padding:"14px 18px",borderRadius:"10px",border,background:bg,color,fontSize:"15px",textAlign:"left",cursor:selected?"default":"pointer",transition:"all 0.2s",fontFamily:"Georgia,serif"}}>
                {selected&&isCorrect?"✓ ":selected&&isPicked&&!isCorrect?"✗ ":""}{opt}
              </button>;
            })}
          </div>
          {showExp && (
            <div style={{background:`${TEAL}15`,border:`1px solid ${TEAL}40`,borderRadius:"12px",padding:"18px",marginBottom:"20px",animation:"fadeUp 0.3s ease"}}>
              <div style={{fontSize:"11px",color:TEAL,fontFamily:"monospace",marginBottom:"6px"}}>💡 EXPLANATION</div>
              <div style={{fontSize:"14px",color:WHITE,lineHeight:1.7}}>{q.exp}</div>
            </div>
          )}
          {selected && <button onClick={next} style={{width:"100%",padding:"13px",borderRadius:"10px",border:"none",background:`linear-gradient(135deg,${TEAL},${TEAL2})`,color:NAVY,fontSize:"15px",fontWeight:800,cursor:"pointer"}}>{idx<QUIZ_QUESTIONS.length-1?"Next Question →":"See Results"}</button>}
        </div>
      </div>
    </div>
  );
}

// ── PHARMA MODE ──
function PharmaMode({onBack}){
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(null);
  const filtered=DRUG_REF.filter(d=>d.name.toLowerCase().includes(search.toLowerCase())||d.class.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:OFF,fontFamily:"Georgia,serif"}}>
      <style>{globalCSS}</style>
      <div style={{background:NAVY,padding:"14px 20px",display:"flex",alignItems:"center",gap:"12px",boxShadow:"0 2px 18px rgba(0,0,0,0.2)"}}>
        <button onClick={onBack} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.18)",color:SLATE,borderRadius:"7px",padding:"5px 11px",cursor:"pointer",fontSize:"12px",fontFamily:"monospace"}}>← Back</button>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:"16px",fontWeight:700,color:WHITE}}>💊 Pharmacology Reference</div>
        <div style={{marginLeft:"auto",fontSize:"12px",color:SLATE,fontFamily:"monospace"}}>{DRUG_REF.length} agents</div>
      </div>
      <div style={{padding:"14px 18px",background:NAVY2,borderBottom:`1px solid ${SLATE2}`}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search drug name or class…" style={{width:"100%",padding:"10px 14px",borderRadius:"9px",border:`1.5px solid ${SLATE2}`,background:OFF,fontFamily:"Georgia,serif",fontSize:"14px",color:"#1a2e4a",outline:"none"}}/>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 18px",display:"flex",flexDirection:"column",gap:"10px"}}>
        {filtered.map(d=>(
          <div key={d.name} onClick={()=>setSelected(selected?.name===d.name?null:d)} style={{background:"white",borderRadius:"12px",border:`1px solid ${selected?.name===d.name?TEAL:SLATE2}`,padding:"16px",cursor:"pointer",transition:"all 0.2s",boxShadow:selected?.name===d.name?`0 4px 16px ${TEAL}30`:"0 2px 8px rgba(0,0,0,0.05)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"17px",fontWeight:700,color:NAVY}}>{d.name}</div>
                <div style={{fontSize:"12px",color:TEAL,fontFamily:"monospace",marginTop:"2px"}}>{d.class}</div>
              </div>
              <div style={{fontSize:"20px"}}>{selected?.name===d.name?"▲":"▼"}</div>
            </div>
            {selected?.name===d.name && (
              <div style={{marginTop:"14px",borderTop:`1px solid ${SLATE2}`,paddingTop:"14px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",animation:"fadeUp 0.2s ease"}}>
                {[["💉 Dose",d.dose],["⚡ Onset",d.onset],["⏱ Duration",d.duration]].map(([label,val])=>(
                  <div key={label} style={{background:OFF,borderRadius:"8px",padding:"10px"}}>
                    <div style={{fontSize:"10px",color:SLATE,fontFamily:"monospace",marginBottom:"3px"}}>{label}</div>
                    <div style={{fontSize:"13px",color:NAVY,fontWeight:600}}>{val}</div>
                  </div>
                ))}
                <div style={{gridColumn:"1/-1",background:`${TEAL}12`,border:`1px solid ${TEAL}40`,borderRadius:"8px",padding:"10px"}}>
                  <div style={{fontSize:"10px",color:TEAL,fontFamily:"monospace",marginBottom:"3px"}}>📝 CLINICAL NOTES</div>
                  <div style={{fontSize:"13px",color:NAVY,lineHeight:1.6}}>{d.notes}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── GLOBAL CSS ──
const globalCSS=`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Serif+4:wght@400;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pop{from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
  @keyframes glow{0%,100%{box-shadow:0 0 16px rgba(0,201,177,0.3)}50%{box-shadow:0 0 36px rgba(0,201,177,0.7)}}
  @keyframes rec{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.4)}}
  @keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
  .dot{width:8px;height:8px;border-radius:50%;background:${SLATE};animation:blink 1.2s infinite;display:inline-block}
  .dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
  .recdot{width:10px;height:10px;border-radius:50%;background:#ff6b6b;display:inline-block;animation:rec .8s infinite}
  .tbtn:hover{background:rgba(0,201,177,0.15)!important;border-color:rgba(0,201,177,0.4)!important}
  .sbtn:hover{background:#e8f0ff!important}
  .nav-btn:hover{background:rgba(255,255,255,0.08)!important}
  .mode-card:hover{background:rgba(0,201,177,0.06)!important;border-color:rgba(0,201,177,0.45)!important;transform:translateY(-3px);box-shadow:0 14px 36px rgba(0,0,0,0.22)}
  .li{padding-left:14px;position:relative;margin:2px 0}.li::before{content:"–";position:absolute;left:0;color:${TEAL}}
  textarea:focus,input:focus{border-color:${TEAL}!important;box-shadow:0 0 0 3px rgba(0,201,177,0.12)!important;outline:none}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#C4D4E8;border-radius:4px}
`;

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function Gasology(){
  const [screen,setScreen]=useState("home"); // home | chat | quiz | pharma
  const [mode,setMode]=useState("tutor");
  const [level,setLevel]=useState("CA-2");
  const [topic,setTopic]=useState(null);
  const [msgs,setMsgs]=useState([]);
  const [input,setInput]=useState("");
  const [busy,setBusy]=useState(false);
  const [voiceOn,setVoiceOn]=useState(false);
  const [listening,setListening]=useState(false);
  const [speaking,setSpeaking]=useState(false);
  const [liveText,setLiveText]=useState("");
  const [scoreCard,setScoreCard]=useState(null);
  const [sessionScores,setSessionScores]=useState([]);
  const [msgCount,setMsgCount]=useState(0);
  const bottomRef=useRef(null);
  const recRef=useRef(null);
  const taRef=useRef(null);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,busy]);

  // Load ResponsiveVoice TTS — works reliably on Android Chrome
  useEffect(()=>{
    if(window.responsiveVoice)return;
    const script=document.createElement("script");
    script.src="https://code.responsivevoice.org/responsivevoice.js?key=FREE";
    script.async=true;
    document.head.appendChild(script);
  },[]);
  useEffect(()=>{
    if(!taRef.current)return;
    taRef.current.style.height="auto";
    taRef.current.style.height=Math.min(taRef.current.scrollHeight,120)+"px";
  },[input]);

  useEffect(()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR)return;
    const r=new SR();
    r.continuous=false;r.interimResults=true;r.lang="en-US";
    r.onresult=e=>{
      const t=Array.from(e.results).map(x=>x[0].transcript).join("");
      setLiveText(t);
      if(e.results[e.results.length-1].isFinal){setLiveText("");sendMsgDirect(t);}
    };
    r.onend=()=>setListening(false);
    r.onerror=()=>{setListening(false);setLiveText("");};
    recRef.current=r;
  },[]);

  const unlockRef=useRef(false);
  const unlockAudio=()=>{
    if(unlockRef.current)return;
    unlockRef.current=true;
    try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const b=ctx.createBuffer(1,1,22050);const s=ctx.createBufferSource();s.buffer=b;s.connect(ctx.destination);s.start(0);}catch(e){}
  };

  // ResponsiveVoice: reliable male voice on Android Chrome
  const speak=(text)=>{
    const clean=strip(text);if(!clean)return;
    setSpeaking(true);
    if(window.responsiveVoice){
      window.responsiveVoice.cancel();
      window.responsiveVoice.speak(clean,"US English Male",{
        pitch:0.7,rate:0.85,volume:1,
        onstart:()=>setSpeaking(true),
        onend:()=>setSpeaking(false),
        onerror:()=>setSpeaking(false)
      });
    } else {
      // Fallback to browser TTS
      const s=window.speechSynthesis;if(!s){setSpeaking(false);return;}
      s.cancel();
      const u=new SpeechSynthesisUtterance(clean);
      u.lang="en-US";u.rate=0.88;u.pitch=0.75;u.volume=1;
      const voices=s.getVoices();
      const pick=voices.find(x=>x.name.includes("Google US English Male")||x.name.includes("Alex")||x.name.includes("Fred"))
        ||voices.find(x=>x.lang==="en-US"&&!x.name.toLowerCase().includes("female")&&!x.name.includes("Samantha"))
        ||voices.find(x=>x.lang==="en-US")||voices[0];
      if(pick)u.voice=pick;
      u.onend=()=>setSpeaking(false);u.onerror=()=>setSpeaking(false);
      if(s.paused)s.resume();
      s.speak(u);
      setTimeout(()=>{if(s.paused)s.resume();},500);
    }
  };

  const stopSpeak=()=>{
    window.responsiveVoice?.cancel();
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };
  const startListen=()=>{
    unlockAudio();
    if(!recRef.current||listening||busy)return;
    stopSpeak();
    try{recRef.current.start();setListening(true);}catch(e){}
  };
  const stopListen=()=>{try{recRef.current?.stop();}catch(e){}};

  const enterMode=(m)=>{
    setMode(m);setVoiceOn(false);stopSpeak();setTopic(null);setMsgCount(0);
    const welcome=m==="tutor"
      ?`Welcome. I'm Gasology — your anesthesia educator. I'll tailor this to ${level} level.\n\nPick a topic above, use a quick-start below, or ask me anything.`
      :`Good morning. I am your oral board examiner.\n\nThis is an ABA-format oral board simulation. I will present a case and expect organized, clinically sound responses. Vague answers will be challenged.\n\nTell me your focus area or I will select a case. Are you ready?`;
    setMsgs([{role:"assistant",content:welcome}]);setScreen("chat");
  };

  const [voiceError,setVoiceError]=useState("");

  const testSpeak=()=>{
    unlockAudio();
    setVoiceError("🔊 Testing male examiner voice...");
    const doTest=()=>{
      if(window.responsiveVoice){
        window.responsiveVoice.speak("Hello. I am your oral board examiner. Can you hear me clearly?","US English Male",{
          pitch:0.7,rate:0.85,volume:1,
          onstart:()=>setVoiceError("🔊 Speaking! Turn up your MEDIA volume."),
          onend:()=>setVoiceError("✅ Done! If you heard a male voice, you are ready."),
          onerror:()=>setVoiceError("❌ Voice error — check media volume or use headphones")
        });
      } else {
        setVoiceError("⏳ Voice engine loading... tap Test again in 3 seconds");
      }
    };
    // Small delay to let RV initialize
    setTimeout(doTest,300);
  };

  const activateVoice=()=>{
    unlockAudio();
    setVoiceOn(true);
    const msg="Voice mode activated. I will speak each question aloud. Hold the microphone button to respond. Let us begin. What area would you like examined?";
    setMsgs(p=>[...p,{role:"assistant",content:msg}]);
    setTimeout(()=>speak(msg),500);
  };

  const requestScore=async(history)=>{
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,system:SCORE_SYS,
          messages:[{role:"user",content:"Score this oral board exchange:\n\n"+history.map(m=>`${m.role.toUpperCase()}: ${m.content}`).join("\n\n")}]})});
      const d=await res.json();
      const txt=d.content?.map(b=>b.text||"").join("")||"";
      const clean=txt.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      setSessionScores(s=>[...s,parsed.score]);
      setScoreCard(parsed);
    }catch(e){console.error("Score error",e);}
  };

  const sendMsgDirect=(text)=>{
    if(!text?.trim()||busy)return;
    const newMsgs=[...msgs,{role:"user",content:text}];
    setMsgs(newMsgs);setMsgCount(c=>c+1);
    callAPI(newMsgs,voiceOn&&mode==="boards");
    // Request scoring after every 4 user messages in boards mode
    if(mode==="boards"&&msgCount>0&&(msgCount+1)%4===0){
      setTimeout(()=>requestScore(newMsgs),3000);
    }
  };

  const sendMsg=()=>{
    const txt=input.trim();if(!txt||busy)return;
    setInput("");sendMsgDirect(txt);
  };

  const callAPI=async(history,isVoice)=>{
    setBusy(true);
    const sys=(mode==="tutor"?TUTOR_SYS:BOARDS_SYS)
      +(mode==="tutor"?`\n\nLearner level: ${level}`:"")
      +(topic?`\n\nFocus topic: ${topic}`:"")
      +(isVoice?"\n\nVOICE MODE: 2-3 sentences max, no markdown.":"");
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,system:sys,
          messages:history.map(m=>({role:m.role,content:m.content}))})});
      const d=await res.json();
      const reply=d.content?.map(b=>b.text||"").join("")||"Error — please try again.";
      setMsgs(p=>[...p,{role:"assistant",content:reply}]);
      if(isVoice)setTimeout(()=>speak(reply),200);
    }catch{setMsgs(p=>[...p,{role:"assistant",content:"Connection error. Try again."}]);}
    finally{setBusy(false);}
  };

  const handleKey=(e)=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg();}};

  const avgScore=sessionScores.length?Math.round(sessionScores.reduce((a,b)=>a+b,0)/sessionScores.length):null;

  // ── HOME ──
  if(screen==="home") return(
    <div style={{minHeight:"100vh",background:`linear-gradient(150deg,${NAVY},${NAVY2},#0d2644)`,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 20px",fontFamily:"Georgia,serif"}}>
      <style>{globalCSS}</style>
      <script src="https://code.responsivevoice.org/responsivevoice.js?key=FREE" async/>
      <div style={{maxWidth:"680px",width:"100%",textAlign:"center"}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"16px",marginBottom:"6px"}}>
          <div style={{width:"60px",height:"60px",borderRadius:"14px",background:`linear-gradient(135deg,${TEAL},${TEAL2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"30px",boxShadow:"0 8px 28px rgba(0,201,177,0.35)"}}>💨</div>
          <div style={{textAlign:"left"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"34px",fontWeight:700,color:WHITE,lineHeight:1}}>Gasology</div>
            <div style={{fontSize:"12px",color:SLATE,letterSpacing:"2px",textTransform:"uppercase",marginTop:"4px"}}>Anesthesia Ed & Board Prep</div>
          </div>
        </div>
        <div style={{color:SLATE,fontSize:"11px",fontFamily:"monospace",marginBottom:"24px"}}>v2.0 · Day 1 Update</div>
        <p style={{color:SLATE2,fontSize:"15px",lineHeight:1.7,marginBottom:"28px"}}>AI-powered anesthesia education and ABA oral board preparation for residents, fellows, and students.</p>
        {/* Level */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",flexWrap:"wrap",marginBottom:"28px"}}>
          <span style={{color:SLATE,fontSize:"12px",fontFamily:"monospace"}}>Level:</span>
          {["Medical Student","CA-1","CA-2","CA-3","Fellow"].map(l=>(
            <button key={l} onClick={()=>setLevel(l)} style={{padding:"5px 12px",borderRadius:"6px",border:`1px solid ${level===l?TEAL:NAVY3}`,background:level===l?TEAL:"transparent",color:level===l?NAVY:SLATE,fontSize:"12px",cursor:"pointer",fontFamily:"monospace",transition:"all 0.2s"}}>{l}</button>
          ))}
        </div>
        {/* Mode cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"14px",marginBottom:"14px"}}>
          {[
            {key:"tutor",icon:"🎓",label:"Teaching Mode",desc:"Socratic teaching, clinical pearls & mnemonics"},
            {key:"boards",icon:"📋",label:"Oral Boards",desc:"ABA-style exam + voice interaction + scoring",badge:"🎙 Voice + Scoring"},
          ].map(m=>(
            <button key={m.key} className="mode-card" onClick={()=>enterMode(m.key)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"16px",padding:"24px 20px",cursor:"pointer",textAlign:"left",transition:"all 0.25s",backdropFilter:"blur(10px)"}}>
              <div style={{fontSize:"32px",marginBottom:"10px"}}>{m.icon}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"18px",fontWeight:700,color:WHITE,marginBottom:"6px"}}>{m.label}</div>
              <div style={{color:SLATE,fontSize:"13px",lineHeight:1.5,marginBottom:"10px"}}>{m.desc}</div>
              {m.badge&&<div style={{display:"inline-block",background:`${TEAL}18`,border:`1px solid ${TEAL}40`,color:TEAL,fontSize:"11px",borderRadius:"5px",padding:"2px 8px",marginBottom:"10px",fontFamily:"monospace"}}>{m.badge}</div>}
              <div style={{color:TEAL,fontSize:"12px",fontFamily:"monospace"}}>Enter →</div>
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"14px",marginBottom:"28px"}}>
          {[
            {icon:"🧪",label:"Quiz Mode",desc:"Test your knowledge — 8 questions",action:()=>setScreen("quiz")},
            {icon:"💊",label:"Drug Reference",desc:"Quick pharmacology lookup",action:()=>setScreen("pharma")},
          ].map(m=>(
            <button key={m.label} className="mode-card" onClick={m.action} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"20px",cursor:"pointer",textAlign:"left",transition:"all 0.25s"}}>
              <div style={{fontSize:"28px",marginBottom:"8px"}}>{m.icon}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"16px",fontWeight:700,color:WHITE,marginBottom:"4px"}}>{m.label}</div>
              <div style={{color:SLATE,fontSize:"13px"}}>{m.desc}</div>
            </button>
          ))}
        </div>
        <div style={{color:"#3d5a6e",fontSize:"11px",fontFamily:"monospace"}}>For educational purposes only · Not a substitute for clinical supervision</div>
      </div>
    </div>
  );

  if(screen==="quiz") return <QuizMode level={level} onBack={()=>setScreen("home")}/>;
  if(screen==="pharma") return <PharmaMode onBack={()=>setScreen("home")}/>;

  // ── CHAT ──
  const isVoice=voiceOn&&mode==="boards";
  const statusColor=speaking?TEAL:listening?RED:busy?GOLD:SLATE;

  return(
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:OFF,fontFamily:"Georgia,serif"}}>
      <style>{globalCSS}</style>
      <script src="https://code.responsivevoice.org/responsivevoice.js?key=FREE" async/>
      {scoreCard&&<ScoreCard data={scoreCard} onClose={()=>setScoreCard(null)}/>}

      {/* Header */}
      <div style={{background:NAVY,padding:"11px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 2px 18px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"11px"}}>
          <button onClick={()=>{setScreen("home");stopSpeak();}} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.18)",color:SLATE,borderRadius:"7px",padding:"5px 11px",cursor:"pointer",fontSize:"12px",fontFamily:"monospace"}}>← Back</button>
          <div style={{width:"36px",height:"36px",borderRadius:"9px",background:`linear-gradient(135deg,${TEAL},${TEAL2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"17px"}}>{mode==="tutor"?"🎓":"📋"}</div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"15px",fontWeight:700,color:WHITE}}>Gasology — {mode==="tutor"?"Teaching Mode":"Oral Board Examiner"}</div>
            <div style={{fontSize:"11px",color:SLATE,fontFamily:"monospace"}}>{mode==="tutor"?`${level} · Anesthesia Ed`:voiceOn?"🎙 Live Voice Exam":"ABA Oral Board Simulation"}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
          {avgScore!==null&&<div style={{background:`${avgScore>=7?GREEN:avgScore>=5?GOLD:RED}22`,border:`1px solid ${avgScore>=7?GREEN:avgScore>=5?GOLD:RED}`,borderRadius:"6px",padding:"3px 10px",fontSize:"11px",fontFamily:"monospace",color:avgScore>=7?GREEN:avgScore>=5?GOLD:RED}}>Avg: {avgScore}/10</div>}
          {mode==="boards"&&!voiceOn&&<button onClick={testSpeak} style={{background:"rgba(245,200,66,0.15)",border:`1px solid ${GOLD}`,color:GOLD,borderRadius:"7px",padding:"5px 12px",cursor:"pointer",fontSize:"12px",fontFamily:"monospace"}}>🔊 Test</button>}
          {mode==="boards"&&!voiceOn&&(window.SpeechRecognition||window.webkitSpeechRecognition)&&<button onClick={activateVoice} style={{background:`${TEAL}18`,border:`1px solid ${TEAL}`,color:TEAL,borderRadius:"7px",padding:"5px 12px",cursor:"pointer",fontSize:"12px",fontFamily:"monospace"}}>🎙 Voice</button>}
          {voiceError!==" "&&voiceError&&<div style={{position:"fixed",bottom:"80px",left:"50%",transform:"translateX(-50%)",background:NAVY2,border:`1px solid ${GOLD}`,borderRadius:"10px",padding:"10px 16px",fontSize:"12px",color:GOLD,fontFamily:"monospace",zIndex:50,maxWidth:"90vw",textAlign:"center"}}>{voiceError}</div>}
          {mode==="boards"&&voiceOn&&<div style={{background:statusColor,borderRadius:"20px",padding:"4px 12px",fontSize:"11px",fontFamily:"monospace",fontWeight:700,color:NAVY,transition:"background 0.3s"}}>{speaking?"Speaking…":listening?"Listening…":busy?"Thinking…":"Ready"}</div>}
          <div style={{background:`linear-gradient(135deg,${TEAL},${TEAL2})`,color:NAVY,borderRadius:"6px",padding:"4px 11px",fontSize:"11px",fontWeight:800,fontFamily:"monospace"}}>{mode==="boards"?"EXAM":level}</div>
        </div>
      </div>

      {/* Topic bar */}
      {mode==="tutor"&&<div style={{background:NAVY2,padding:"8px 16px",display:"flex",gap:"7px",overflowX:"auto",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        {TOPICS.map(t=><button key={t} className="tbtn" onClick={()=>{setTopic(t);sendMsgDirect(`Let's review: ${t}`);}} style={{padding:"5px 12px",borderRadius:"6px",border:`1px solid ${topic===t?TEAL:"rgba(255,255,255,0.15)"}`,background:topic===t?TEAL:"transparent",color:topic===t?NAVY:SLATE2,fontSize:"12px",cursor:"pointer",whiteSpace:"nowrap",fontFamily:"monospace",transition:"all 0.2s"}}>{t}</button>)}
      </div>}

      {/* Board case selector */}
      {mode==="boards"&&!voiceOn&&msgs.length<=1&&(
        <div style={{background:NAVY2,padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{fontSize:"11px",color:SLATE,fontFamily:"monospace",marginBottom:"7px"}}>PRESET CASES:</div>
          <div style={{display:"flex",gap:"7px",overflowX:"auto"}}>
            {BOARD_CASES.map(c=><button key={c.title} className="tbtn" onClick={()=>sendMsgDirect(`Please present this case: ${c.stem}`)} style={{padding:"5px 12px",borderRadius:"6px",border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:SLATE2,fontSize:"12px",cursor:"pointer",whiteSpace:"nowrap",fontFamily:"monospace",transition:"all 0.2s"}}>{c.title}</button>)}
          </div>
        </div>
      )}

      {/* Voice panel */}
      {isVoice&&(
        <div style={{background:NAVY2,padding:"11px 18px",display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{width:"46px",height:"46px",borderRadius:"50%",background:`linear-gradient(135deg,${NAVY3},${NAVY})`,border:`2px solid ${TEAL}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",animation:speaking?"glow 1.5s infinite":"none"}}>👨‍⚕️</div>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"14px",fontWeight:700,color:WHITE}}>Board Examiner</div>
              <div style={{fontSize:"11px",fontFamily:"monospace",color:statusColor,transition:"color 0.3s"}}>{speaking?"Speaking…":listening?"Listening…":busy?"Formulating…":"Waiting"}</div>
            </div>
          </div>
          {(listening||liveText)&&<div style={{flex:1,background:"rgba(255,255,255,0.06)",borderRadius:"8px",padding:"7px 12px",fontSize:"13px",color:WHITE,minWidth:"100px",border:"1px solid rgba(255,255,255,0.1)"}}><span style={{color:SLATE,fontSize:"10px",fontFamily:"monospace"}}>YOU: </span>{liveText||<em style={{color:SLATE}}>Speak now…</em>}</div>}
          <div style={{display:"flex",gap:"8px",marginLeft:"auto"}}>
            {speaking&&<button onClick={stopSpeak} style={{padding:"6px 12px",borderRadius:"7px",border:"1px solid rgba(255,255,255,0.2)",background:"transparent",color:SLATE,fontSize:"12px",fontFamily:"monospace",cursor:"pointer"}}>⏹</button>}
            <button onMouseDown={startListen} onMouseUp={stopListen} onTouchStart={e=>{e.preventDefault();startListen();}} onTouchEnd={e=>{e.preventDefault();stopListen();}} disabled={busy}
              style={{padding:"8px 18px",borderRadius:"24px",border:"none",background:listening?RED:`linear-gradient(135deg,${TEAL},${TEAL2})`,color:listening?"white":NAVY,fontWeight:800,fontSize:"13px",fontFamily:"monospace",cursor:busy?"not-allowed":"pointer",transition:"all 0.15s",display:"flex",alignItems:"center",gap:"6px",userSelect:"none",opacity:busy?0.5:1}}>
              {listening?<><span className="recdot"/>Release</>:"🎙 Hold"}
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"18px 16px",display:"flex",flexDirection:"column",gap:"13px"}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:"8px",animation:m.role==="user"?"pop 0.2s":"fadeUp 0.3s"}}>
            {m.role==="assistant"&&<div style={{width:"32px",height:"32px",borderRadius:"8px",flexShrink:0,background:`linear-gradient(135deg,${TEAL},${TEAL2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px"}}>{mode==="tutor"?"🎓":"📋"}</div>}
            <div style={{maxWidth:"74%",padding:"12px 15px",borderRadius:m.role==="user"?"12px 4px 12px 12px":"4px 12px 12px 12px",background:m.role==="user"?`linear-gradient(135deg,${NAVY},${NAVY3})`:"white",color:m.role==="user"?WHITE:"#1a2e4a",fontSize:"14px",lineHeight:1.7,boxShadow:m.role==="user"?"0 3px 12px rgba(11,31,58,0.25)":"0 2px 8px rgba(0,0,0,0.07)",border:m.role==="assistant"?`1px solid ${SLATE2}`:"none",position:"relative"}}>
              {isVoice&&m.role==="assistant"&&i>0&&<button onClick={()=>speak(m.content)} style={{position:"absolute",top:"6px",right:"6px",background:"transparent",border:"none",cursor:"pointer",fontSize:"13px",opacity:0.4}}>🔊</button>}
              <div dangerouslySetInnerHTML={{__html:fmt(m.content)}}/>
            </div>
            {m.role==="user"&&<div style={{width:"32px",height:"32px",borderRadius:"8px",flexShrink:0,background:`linear-gradient(135deg,${GOLD},#e8a800)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:800,color:NAVY}}>{level[0]}</div>}
          </div>
        ))}
        {busy&&<div style={{display:"flex",gap:"8px",alignItems:"flex-end"}}>
          <div style={{width:"32px",height:"32px",borderRadius:"8px",background:`linear-gradient(135deg,${TEAL},${TEAL2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px"}}>{mode==="tutor"?"🎓":"📋"}</div>
          <div style={{padding:"12px 16px",borderRadius:"4px 12px 12px 12px",background:"white",border:`1px solid ${SLATE2}`}}><div style={{display:"flex",gap:"5px"}}><span className="dot"/><span className="dot"/><span className="dot"/></div></div>
        </div>}
        <div ref={bottomRef}/>
      </div>

      {/* Starters */}
      {msgs.length<=1&&<div style={{padding:"0 16px 10px",display:"flex",gap:"7px",flexWrap:"wrap"}}>
        {(mode==="tutor"
          ?["Explain sugammadex reversal","Severe AS considerations?","Neuraxial anatomy","MAC changes with age?"]
          :["Start a random case","Cardiac arrest intraop?","Failed airway algorithm","Malignant hyperthermia Rx"]
        ).map(s=><button key={s} className="sbtn" onClick={()=>sendMsgDirect(s)} style={{padding:"6px 13px",borderRadius:"8px",border:`1px solid ${SLATE2}`,background:"white",color:"#3d5a80",fontSize:"13px",cursor:"pointer",transition:"background 0.2s"}}>{s}</button>)}
      </div>}

      {/* Text input */}
      {!isVoice&&<div style={{padding:"10px 16px",background:"white",borderTop:`1px solid ${SLATE2}`,display:"flex",gap:"8px",alignItems:"flex-end"}}>
        <textarea ref={taRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} placeholder={mode==="boards"?"Respond to the examiner…":"Ask a clinical question…"} rows={1} style={{flex:1,padding:"10px 13px",borderRadius:"9px",border:`1.5px solid ${SLATE2}`,background:OFF,fontFamily:"Georgia,serif",fontSize:"14px",color:"#1a2e4a",outline:"none",resize:"none",lineHeight:1.6}}/>
        <button onClick={sendMsg} disabled={busy||!input.trim()} style={{width:"42px",height:"42px",borderRadius:"9px",border:"none",background:`linear-gradient(135deg,${NAVY},${NAVY3})`,color:"white",cursor:busy||!input.trim()?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,opacity:busy||!input.trim()?0.4:1}}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>}

      {/* Voice fallback */}
      {isVoice&&<div style={{padding:"8px 16px",background:"white",borderTop:`1px solid ${SLATE2}`,display:"flex",gap:"8px"}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")sendMsg();}} placeholder="Or type your response…" style={{flex:1,padding:"9px 13px",borderRadius:"9px",border:`1.5px solid ${SLATE2}`,background:OFF,fontFamily:"Georgia,serif",fontSize:"14px",color:"#1a2e4a",outline:"none"}}/>
        <button onClick={sendMsg} disabled={busy||!input.trim()} style={{width:"40px",height:"40px",borderRadius:"9px",border:"none",background:`linear-gradient(135deg,${NAVY},${NAVY3})`,color:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:busy||!input.trim()?0.4:1}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>}

      <div style={{textAlign:"center",padding:"4px",fontSize:"10px",color:"#9aafcc",background:"white",fontFamily:"monospace"}}>Gasology v2.0 · For educational use only · Not a substitute for clinical supervision</div>
    </div>
  );
}
