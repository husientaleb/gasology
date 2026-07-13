import { useState, useEffect } from "react";

const SLATE="#6e90b8", SLATE2="#a8c0d8", WHITE="#f0f6ff";
const PURPLE="#a78bfa", GREEN="#2ed47a", RED="#e05555";

// Challenging board-style questions. One per day, rotating by day-of-year.
// q: question · o: options · c: correct index · why: explanation shown after voting
const POLLS = [
  { q:"Initial IV dantrolene dose for a malignant hyperthermia crisis?", o:["1 mg/kg","2.5 mg/kg","5 mg/kg","10 mg/kg"], c:1, why:"2.5 mg/kg rapid IV push, repeated every 5–10 minutes to effect — cumulative doses up to 10 mg/kg may be needed." },
  { q:"Maximum dose of lidocaine WITH epinephrine?", o:["3 mg/kg","4.5 mg/kg","7 mg/kg","10 mg/kg"], c:2, why:"Epinephrine slows vascular absorption, raising the maximum from 4.5 to 7 mg/kg." },
  { q:"Fastest-onset epidural top-up for an emergency cesarean?", o:["2-Chloroprocaine 3%","Bupivacaine 0.5%","Ropivacaine 0.75%","Lidocaine 2% plain"], c:0, why:"Despite its high pKa, 3% chloroprocaine's sheer concentration gives the fastest onset — and plasma esterases clear it in under a minute." },
  { q:"Which muscle relaxant is cleared by Hofmann elimination?", o:["Rocuronium","Vecuronium","Pancuronium","Cisatracurium"], c:3, why:"Spontaneous temperature- and pH-dependent breakdown, independent of liver and kidney — ideal in organ failure." },
  { q:"Sugammadex dose for deep block (1–2 post-tetanic counts)?", o:["2 mg/kg","4 mg/kg","8 mg/kg","16 mg/kg"], c:1, why:"2 mg/kg for moderate block (TOF ≥2), 4 mg/kg for deep block, 16 mg/kg for immediate rescue after RSI-dose rocuronium." },
  { q:"Longest context-sensitive half-time after an 8-hour infusion?", o:["Remifentanil","Sufentanil","Fentanyl","Alfentanil"], c:2, why:"Fentanyl's lipophilic tissue reservoir keeps refilling plasma. Remifentanil stays ~3 minutes no matter how long the infusion runs." },
  { q:"Lowest blood:gas partition coefficient?", o:["Desflurane","Nitrous oxide","Sevoflurane","Isoflurane"], c:0, why:"Desflurane at 0.42 edges out nitrous oxide at 0.47 — the fastest on/off kinetics of any potent volatile." },
  { q:"Afferent limb of the oculocardiac reflex?", o:["Vagus nerve","Glossopharyngeal nerve","Facial nerve","Trigeminal nerve (V1)"], c:3, why:"The 'five-and-dime' reflex: afferent CN V, efferent CN X. First move — ask the surgeon to release traction." },
  { q:"First-line drug for LAST with cardiovascular instability?", o:["Amiodarone","20% lipid emulsion","Vasopressin","Esmolol"], c:1, why:"1.5 mL/kg bolus then infusion. Reduce epinephrine to ≤1 mcg/kg boluses; avoid vasopressin, calcium channel and beta blockers." },
  { q:"Expected serum K⁺ rise after succinylcholine in a normal patient?", o:["0.1 mEq/L","0.5 mEq/L","1.5 mEq/L","3.0 mEq/L"], c:1, why:"~0.5 mEq/L. Exaggerated, potentially lethal release occurs with burns, denervation, and immobility — from upregulated extrajunctional receptors." },
  { q:"Incidence of ipsilateral phrenic nerve palsy with a traditional interscalene block?", o:["10%","30%","60%","~100%"], c:3, why:"Essentially universal with conventional volumes. Avoid in patients who can't tolerate a ~25% drop in pulmonary function." },
  { q:"Most sensitive monitor for venous air embolism?", o:["Transesophageal echo","Precordial Doppler","End-tidal CO₂ drop","CVP rise"], c:0, why:"TEE detects as little as 0.02 mL/kg of air; precordial Doppler is the most sensitive non-invasive option." },
  { q:"Sensory block level required for cesarean delivery?", o:["T10","T8","T4","T2"], c:2, why:"Peritoneal traction demands T4. A T10 level covers the uterus itself but not the exteriorization and traction." },
  { q:"Compound A nephrotoxicity (rodent data) is a concern with which agent?", o:["Desflurane","Sevoflurane","Isoflurane","Halothane"], c:1, why:"Sevoflurane degradation by strong-base CO₂ absorbents at low fresh gas flows — the origin of the old ≥1–2 L/min FGF labeling." },
  { q:"Greatest carbon monoxide production with a desiccated CO₂ absorbent?", o:["Desflurane","Sevoflurane","Halothane","Nitrous oxide"], c:0, why:"Desflurane > enflurane > isoflurane. The classic setup: Monday-morning first case after fresh gas ran all weekend and dried the absorbent." },
  { q:"Treatment for benzocaine-induced methemoglobinemia?", o:["Hyperbaric oxygen","N-acetylcysteine","Methylene blue 1–2 mg/kg","Exchange transfusion first-line"], c:2, why:"Methylene blue reduces Fe³⁺ back to Fe²⁺ via the NADPH pathway. Caution in G6PD deficiency. Clue: SpO₂ stuck near 85%." },
  { q:"MAC of sevoflurane in a 40-year-old?", o:["1.2%","2.0%","2.6%","6.0%"], c:1, why:"Sevo ~2.0, iso 1.2, des 6.0, halothane 0.75. MAC falls roughly 6% per decade of age." },
  { q:"MAC is highest at what age?", o:["Term neonate","Infant 1–6 months","Adolescent","Young adult"], c:1, why:"MAC peaks in infants 1–6 months old — higher than neonates and steadily declining thereafter with age." },
  { q:"MAC in term pregnancy decreases by about?", o:["10%","30%","50%","70%"], c:1, why:"~30%, largely progesterone-mediated. Neuraxial local anesthetic requirements drop as well." },
  { q:"Remifentanil is metabolized by?", o:["Hepatic CYP3A4","Plasma pseudocholinesterase","Nonspecific tissue & plasma esterases","Renal excretion unchanged"], c:2, why:"Nonspecific esterases — NOT pseudocholinesterase, the classic exam trap. Kinetics are unchanged in cholinesterase deficiency." },
  { q:"Endotracheal tube cuff pressure should stay below?", o:["15 cmH₂O","30 cmH₂O","45 cmH₂O","60 cmH₂O"], c:1, why:"Tracheal mucosal capillary perfusion pressure is ~30 cmH₂O; target 20–30 to prevent ischemia while still sealing against aspiration." },
  { q:"Sudden bradycardia and hypotension after spinal anesthesia — the classic reflex?", o:["Bezold–Jarisch","Bainbridge","Cushing","Baroreceptor"], c:0, why:"The 'empty ventricle' mechanoreceptor reflex: sympathectomy drops preload, vigorous contraction around an empty chamber triggers vagal bradycardia. Treat early and aggressively." },
  { q:"Which is NOT part of the Apfel PONV score?", o:["Female sex","Nonsmoking status","Postoperative opioids","Age under 50"], c:3, why:"The four Apfel factors: female sex, nonsmoker, history of PONV or motion sickness, and postoperative opioids. Age isn't one." },
  { q:"Most feared complication of neurolytic celiac plexus block?", o:["Diarrhea","Orthostatic hypotension","Paraplegia","Pneumothorax"], c:2, why:"Injury or spasm of the artery of Adamkiewicz can cause anterior spinal artery syndrome. Diarrhea and orthostasis are common but benign." },
  { q:"Which induction agent suppresses 11β-hydroxylase?", o:["Ketamine","Etomidate","Propofol","Methohexital"], c:1, why:"Adrenocortical suppression occurs even after a single induction dose — the reason etomidate infusions fell out of favor in the ICU." },
  { q:"After a major burn, succinylcholine hyperkalemia risk begins at about?", o:["Immediately","24–48 hours","2 weeks","6 months"], c:1, why:"Extrajunctional receptor upregulation takes a day or two. Sux is safe in the first hours after a burn — dangerous afterward, for up to a year or more." },
  { q:"Which opioid risks serotonin syndrome with MAOIs?", o:["Morphine","Hydromorphone","Meperidine","Remifentanil"], c:2, why:"Meperidine (plus tramadol and methadone) inhibits serotonin reuptake — the classic, historically fatal interaction." },
  { q:"A full E-cylinder of oxygen (~625 L) reads what pressure?", o:["500 psi","1000 psi","2000 psi","3000 psi"], c:2, why:"~1900–2000 psi. For oxygen, pressure tracks contents linearly — unlike N₂O, which stays at 745 psi until the liquid runs out." },
  { q:"Wait time after prophylactic LMWH before a neuraxial block?", o:["4 hours","12 hours","24 hours","72 hours"], c:1, why:"ASRA: 12 hours after prophylactic dosing, 24 hours after therapeutic dosing." },
  { q:"Gold standard for confirming double-lumen tube position?", o:["Fiberoptic bronchoscopy","Auscultation","Chest x-ray","Capnography"], c:0, why:"Auscultation misjudges position in over a third of cases. Scope it — and re-scope after every patient reposition." },
];

function getDaySeed() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function pickToday() {
  const now = new Date();
  const doy = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  return (doy * 3 + now.getFullYear()) % POLLS.length;
}

export default function PollOfTheDay() {
  const daySeed = getDaySeed();
  const poll = POLLS[pickToday()];
  const storageKey = `gaso_poll_${daySeed}`;

  const [voted, setVoted]       = useState(null);   // chosen option index after voting
  const [results, setResults]   = useState(null);   // {counts:[..], total} from API
  const [tallyDown, setTallyDown] = useState(false);
  const [busy, setBusy]         = useState(false);

  // Returning visitor who already voted today: restore vote, fetch live tally.
  useEffect(() => {
    const prev = localStorage.getItem(storageKey);
    if (prev === null) return;
    setVoted(Number(prev));
    fetch(`/api/poll?day=${daySeed}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setResults)
      .catch(() => setTallyDown(true));
  }, []);

  const vote = async (idx) => {
    if (voted !== null || busy) return;
    setBusy(true);
    setVoted(idx);
    localStorage.setItem(storageKey, String(idx));
    try {
      const r = await fetch("/api/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day: daySeed, choice: idx }),
      });
      if (!r.ok) throw new Error();
      setResults(await r.json());
    } catch {
      setTallyDown(true);
    } finally {
      setBusy(false);
    }
  };

  const revealed = voted !== null;

  return (
    <section style={{ padding:"0 24px 80px" }}>
      <div style={{ maxWidth:760, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${PURPLE}12`, border:`1px solid ${PURPLE}40`, borderRadius:30, padding:"7px 20px", fontFamily:"'DM Mono',monospace", fontSize:12, color:PURPLE, letterSpacing:1, textTransform:"uppercase", marginBottom:16 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:PURPLE, animation:"pulse 2s infinite" }}/>
            Daily Challenge
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,5vw,44px)", fontWeight:800, letterSpacing:"-1px", color:WHITE, lineHeight:1.1 }}>
            🗳️ Poll of the <span style={{ fontStyle:"italic", color:PURPLE }}>Day</span>
          </h2>
        </div>

        <div style={{ background:`linear-gradient(135deg,${PURPLE}0d,${PURPLE}04)`, border:`2px solid ${PURPLE}35`, borderRadius:24, padding:"34px 30px", position:"relative", overflow:"hidden", animation:"fadeUp 0.45s ease both" }}>
          <div style={{ position:"absolute", top:-24, right:-14, fontSize:110, opacity:0.05, pointerEvents:"none", lineHeight:1 }}>🗳️</div>

          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(18px,3vw,23px)", fontWeight:800, color:WHITE, lineHeight:1.4, marginBottom:22 }}>
            {poll.q}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:18 }}>
            {poll.o.map((opt, i) => {
              const isCorrect = i === poll.c;
              const isMine = voted === i;
              const count = results?.counts?.[i] ?? 0;
              const pct = results && results.total > 0 ? Math.round((count / results.total) * 100) : 0;
              const accent = revealed ? (isCorrect ? GREEN : isMine ? RED : "rgba(255,255,255,0.18)") : `${PURPLE}50`;

              return (
                <button key={i} onClick={() => vote(i)} disabled={revealed}
                  style={{ position:"relative", overflow:"hidden", background:"rgba(255,255,255,0.04)", border:`2px solid ${accent}`, borderRadius:12, padding:"13px 18px", textAlign:"left", cursor: revealed ? "default" : "pointer", fontFamily:"'DM Sans',sans-serif", width:"100%", transition:"all 0.2s" }}>
                  {revealed && results && (
                    <div style={{ position:"absolute", inset:0, width:`${pct}%`, background: isCorrect ? `${GREEN}1c` : `${PURPLE}14`, transition:"width 0.6s ease", pointerEvents:"none" }}/>
                  )}
                  <div style={{ position:"relative", display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ width:26, height:26, borderRadius:"50%", background:`${accent}25`, border:`1px solid ${accent}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0, fontFamily:"monospace", color: revealed && isCorrect ? GREEN : revealed && isMine ? RED : SLATE2 }}>
                      {revealed ? (isCorrect ? "✓" : isMine ? "✗" : String.fromCharCode(65 + i)) : String.fromCharCode(65 + i)}
                    </span>
                    <span style={{ flex:1, fontSize:15, lineHeight:1.5, color: revealed && isCorrect ? GREEN : isMine && !isCorrect ? RED : SLATE2 }}>
                      {opt}{isMine && <span style={{ fontSize:11, fontFamily:"monospace", opacity:0.75 }}> · your pick</span>}
                    </span>
                    {revealed && results && (
                      <span style={{ fontSize:14, fontFamily:"'DM Mono',monospace", fontWeight:700, color: isCorrect ? GREEN : SLATE, flexShrink:0 }}>{pct}%</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {revealed && (
            <div style={{ background:`${GREEN}0d`, border:`1px solid ${GREEN}25`, borderRadius:12, padding:"13px 18px", fontSize:14, color:SLATE2, lineHeight:1.7, marginBottom:16, animation:"fadeUp 0.4s ease both" }}>
              <span style={{ color:GREEN, fontWeight:700 }}>{voted === poll.c ? "✓ Correct. " : "✗ Not quite. "}</span>
              {poll.why}
            </div>
          )}

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
            <span style={{ fontSize:12, color:SLATE, fontFamily:"monospace" }}>
              {!revealed ? "Tap an answer to vote & see how others answered"
                : tallyDown ? "Live tally unavailable right now"
                : results ? `${results.total} vote${results.total === 1 ? "" : "s"} today`
                : "Counting votes..."}
            </span>
            <span style={{ fontSize:12, color:SLATE, fontFamily:"monospace" }}>New question at midnight</span>
          </div>
        </div>
      </div>
    </section>
  );
}
