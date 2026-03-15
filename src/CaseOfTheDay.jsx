import { useState, useEffect } from "react";

const NAVY="#08172e", NAVY2="#0f2240", NAVY3="#162d52";
const TEAL="#00c9b1", TEAL2="#00a896";
const SLATE="#6e90b8", SLATE2="#a8c0d8";
const WHITE="#f0f6ff", GOLD="#f0bc3a", GREEN="#2ed47a", RED="#e05555", PURPLE="#a78bfa";

// Deterministic seed based on today's date — same case all day, changes at midnight
function getDaySeed() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

const CASE_TOPICS = [
  "Difficult Airway Management",
  "Cardiac Anesthesia — Severe Aortic Stenosis",
  "Obstetric Emergency — Preeclampsia with Severe Features",
  "Pediatric Anesthesia — RSI in a toddler",
  "Malignant Hyperthermia Crisis",
  "Local Anesthetic Systemic Toxicity (LAST)",
  "Trauma — Hemorrhagic Shock & Damage Control",
  "Neuroanesthesia — Elevated ICP Management",
  "One-Lung Ventilation — Thoracic Surgery",
  "ARDS — Lung Protective Ventilation",
  "Spinal Anesthesia for C-Section",
  "Interscalene Block & Complications",
  "Awake Fiberoptic Intubation",
  "Rapid Sequence Induction — Full Stomach",
  "Post-op Respiratory Failure in PACU",
  "Pheochromocytoma Resection",
  "Jehovah's Witness — Bloodless Surgery",
  "End-Stage Renal Disease — Drug Dosing",
  "Morbid Obesity — Airway & Ventilation",
  "Pediatric MH Susceptibility",
  "Epidural Hematoma — Anticoagulation",
  "Burns Anesthesia",
  "Cardiac Tamponade",
  "Failed Spinal — Convert to GA",
  "Anaphylaxis on Induction",
  "Robotic Surgery — Steep Trendelenburg",
  "Thyroid Storm Perioperatively",
  "Suxamethonium Apnoea",
  "Post-Dural Puncture Headache",
  "Pain Crisis — Opioid Tolerant Patient",
];

const LEVELS = [
  { num: 1, label: "Intern",     emoji: "🩺", color: GREEN,  points: 10 },
  { num: 2, label: "CA-1",       emoji: "📖", color: TEAL,   points: 20 },
  { num: 3, label: "CA-2",       emoji: "🎓", color: GOLD,   points: 30 },
  { num: 4, label: "CA-3",       emoji: "🏆", color: PURPLE, points: 40 },
  { num: 5, label: "Attending",  emoji: "⭐", color: RED,    points: 50 },
];

const CASE_PROMPT = (topic, level, seed) => `You are an ABA oral board examiner. Today's seed: ${seed}.

Generate a clinical anesthesia case about: "${topic}"
Difficulty level: ${level.label}

Return ONLY valid JSON (no markdown, no preamble):
{
  "stem": "2-3 sentence clinical scenario with patient demographics, presentation, and key vitals/labs",
  "questions": [
    {
      "id": 1,
      "text": "Question text (clinical, specific, board-style)",
      "options": ["A. Option text", "B. Option text", "C. Option text", "D. Option text"],
      "correct": 0,
      "explanation": "2-3 sentence explanation of why this is correct and why others are wrong. Include a clinical pearl.",
      "pearl": "One memorable high-yield teaching point in one sentence"
    },
    { "id": 2, ... },
    { "id": 3, ... },
    { "id": 4, ... },
    { "id": 5, ... }
  ]
}

Make questions progressively harder (Q1 easiest, Q5 hardest). Each question must be clinically distinct — cover different aspects: pharmacology, physiology, management, complications, guidelines. Options must be plausible. One clearly correct answer per question.`;

export default function CaseOfTheDay({ onBack }) {
  const [phase, setPhase]         = useState("intro");    // intro | loading | playing | results
  const [caseData, setCaseData]   = useState(null);
  const [level, setLevel]         = useState(LEVELS[1]);  // default CA-1
  const [qIndex, setQIndex]       = useState(0);
  const [selected, setSelected]   = useState(null);       // index of chosen option
  const [revealed, setRevealed]   = useState(false);
  const [answers, setAnswers]     = useState([]);          // {qId, selectedIdx, correct}
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);
  const [showPearl, setShowPearl] = useState(false);
  const [error, setError]         = useState("");
  const [topic, setTopic]         = useState("");
  const [timeLeft, setTimeLeft]   = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  const daySeed = getDaySeed();

  // Pick today's topic deterministically
  useEffect(() => {
    const idx = daySeed.split("-").reduce((a, b) => a + parseInt(b), 0) % CASE_TOPICS.length;
    setTopic(CASE_TOPICS[idx]);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || revealed) return;
    if (timeLeft <= 0) { handleReveal(); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, timeLeft, revealed]);

  const loadCase = async () => {
    setPhase("loading"); setError("");
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: "You are an ABA oral board examiner. Return ONLY valid JSON. No markdown fences. No extra text before or after the JSON.",
          messages: [{ role: "user", content: CASE_PROMPT(topic, level, daySeed) }]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setCaseData(parsed);
      setPhase("playing");
      setQIndex(0); setAnswers([]); setScore(0); setStreak(0);
      setTimeLeft(60); setTimerActive(true);
    } catch (e) {
      setError("Failed to load case. Check your connection and try again.");
      setPhase("intro");
    }
  };

  const handleSelect = (idx) => {
    if (revealed) return;
    setSelected(idx);
  };

  const handleReveal = () => {
    if (revealed) return;
    setTimerActive(false);
    setRevealed(true);
    const q = caseData.questions[qIndex];
    const isCorrect = selected === q.correct;
    const pts = isCorrect ? (level.points + (timeLeft > 30 ? 5 : 0)) : 0;
    setScore(s => s + pts);
    setStreak(s => isCorrect ? s + 1 : 0);
    setAnswers(a => [...a, { qId: q.id, selectedIdx: selected, correct: isCorrect, pts }]);
    setShowPearl(false);
  };

  const handleNext = () => {
    if (qIndex >= caseData.questions.length - 1) {
      setPhase("results");
    } else {
      setQIndex(i => i + 1);
      setSelected(null);
      setRevealed(false);
      setShowPearl(false);
      setTimeLeft(60);
      setTimerActive(true);
    }
  };

  const restart = () => {
    setPhase("intro"); setCaseData(null);
    setQIndex(0); setSelected(null); setRevealed(false);
    setAnswers([]); setScore(0); setStreak(0);
  };

  const maxScore = caseData ? caseData.questions.length * (level.points + 5) : 0;
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(150deg,${NAVY},${NAVY2})`, display:"flex", flexDirection:"column", fontFamily:"Georgia,serif", padding:"0 0 40px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.3)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(0,201,177,0.3)}50%{box-shadow:0 0 48px rgba(0,201,177,0.7)}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2d4a6b;border-radius:4px}
      `}</style>

      {/* Header */}
      <div style={{ background:NAVY2, borderBottom:`1px solid rgba(255,255,255,0.08)`, padding:"14px 20px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onBack} style={{ background:"transparent", border:`1px solid rgba(255,255,255,0.2)`, color:SLATE, borderRadius:8, padding:"7px 14px", cursor:"pointer", fontSize:12, fontFamily:"monospace" }}>← Back</button>
        <div style={{ flex:1, textAlign:"center" }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:800, color:WHITE }}>🏆 Case of the Day</span>
        </div>
        <div style={{ fontSize:11, color:SLATE, fontFamily:"monospace", background:"rgba(255,255,255,0.05)", padding:"4px 10px", borderRadius:6 }}>{new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
      </div>

      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 20px", gap:24 }}>

        {/* Today's case badge */}
        <div style={{ textAlign:"center", animation:"fadeUp 0.5s ease both" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${TEAL}15`, border:`1px solid ${TEAL}40`, borderRadius:30, padding:"7px 20px", fontSize:12, color:TEAL, fontFamily:"monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:20 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:TEAL, animation:"pulse 2s infinite" }}/>
            Today's Case
          </div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,5vw,48px)", fontWeight:800, color:WHITE, lineHeight:1.1, marginBottom:12 }}>
            {topic}
          </div>
          <div style={{ fontSize:15, color:SLATE2, marginBottom:8 }}>5 questions · Timed · Scored · New case every day</div>
          <div style={{ fontSize:12, color:SLATE, fontFamily:"monospace" }}>Resets at midnight · {daySeed}</div>
        </div>

        {/* Level selector */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"24px 28px", width:"100%", maxWidth:500, animation:"fadeUp 0.5s 0.1s ease both" }}>
          <div style={{ fontSize:12, color:TEAL, fontFamily:"monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:16, textAlign:"center" }}>Choose Your Level</div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
            {LEVELS.map(l => (
              <button key={l.num} onClick={() => setLevel(l)}
                style={{ background: level.num===l.num ? l.color : "rgba(255,255,255,0.05)", color: level.num===l.num ? NAVY : SLATE2, border:`2px solid ${level.num===l.num ? l.color : "rgba(255,255,255,0.1)"}`, borderRadius:12, padding:"10px 16px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13, transition:"all 0.2s", textAlign:"center", minWidth:80 }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{l.emoji}</div>
                <div>{l.label}</div>
                <div style={{ fontSize:10, opacity:0.8, fontFamily:"monospace" }}>{l.points}pts/Q</div>
              </button>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"20px 24px", width:"100%", maxWidth:500, animation:"fadeUp 0.5s 0.2s ease both" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              { emoji:"⏱️", label:"60 sec/question", desc:"Bonus pts if under 30s" },
              { emoji:"🎯", label:"5 questions", desc:"Progressive difficulty" },
              { emoji:"📈", label:"Streak bonus", desc:"Answer in a row" },
              { emoji:"💡", label:"Pearl after each Q", desc:"High-yield teaching" },
            ].map(r => (
              <div key={r.label} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:20 }}>{r.emoji}</span>
                <div>
                  <div style={{ fontSize:13, color:WHITE, fontWeight:600 }}>{r.label}</div>
                  <div style={{ fontSize:11, color:SLATE, fontFamily:"monospace" }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <div style={{ color:RED, fontFamily:"monospace", fontSize:13, background:`${RED}15`, border:`1px solid ${RED}30`, borderRadius:10, padding:"10px 16px" }}>⚠️ {error}</div>}

        {/* Start button */}
        <button onClick={loadCase}
          style={{ padding:"16px 56px", borderRadius:14, border:"none", background:`linear-gradient(135deg,${TEAL},${TEAL2})`, color:NAVY, fontWeight:800, fontSize:18, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", animation:"glow 3s ease infinite", letterSpacing:"-0.3px" }}>
          Start Case →
        </button>
      </div>
    </div>
  );

  // ── LOADING ─────────────────────────────────────────────────────────────────
  if (phase === "loading") return (
    <div style={{ height:"100vh", background:`linear-gradient(150deg,${NAVY},${NAVY2})`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20, fontFamily:"Georgia,serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ width:56, height:56, border:`3px solid ${TEAL}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.9s linear infinite" }}/>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:WHITE }}>Generating your case...</div>
      <div style={{ fontSize:13, color:SLATE, fontFamily:"monospace" }}>Topic: {topic}</div>
    </div>
  );

  // ── PLAYING ─────────────────────────────────────────────────────────────────
  if (phase === "playing" && caseData) {
    const q = caseData.questions[qIndex];
    const timerPct = (timeLeft / 60) * 100;
    const timerColor = timeLeft > 30 ? GREEN : timeLeft > 10 ? GOLD : RED;
    const currentStreak = streak;

    return (
      <div style={{ minHeight:"100vh", background:`linear-gradient(150deg,${NAVY},${NAVY2})`, display:"flex", flexDirection:"column", fontFamily:"Georgia,serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');
          *{box-sizing:border-box}
          @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
          @keyframes popIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
          @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
          @keyframes correct{0%{background:rgba(46,212,122,0.3)}100%{background:rgba(46,212,122,0.12)}}
          ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2d4a6b;border-radius:4px}
          .opt-btn{transition:all 0.2s;cursor:pointer;}
          .opt-btn:hover{transform:translateX(4px)!important;}
        `}</style>

        {/* Top bar */}
        <div style={{ background:NAVY2, borderBottom:`1px solid rgba(255,255,255,0.08)`, padding:"12px 20px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <button onClick={onBack} style={{ background:"transparent", border:`1px solid rgba(255,255,255,0.2)`, color:SLATE, borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:11, fontFamily:"monospace" }}>✕</button>
          
          {/* Progress dots */}
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, justifyContent:"center" }}>
            {caseData.questions.map((_, i) => (
              <div key={i} style={{
                width: i === qIndex ? 28 : 10, height:10, borderRadius:6,
                background: i < qIndex ? GREEN : i === qIndex ? TEAL : "rgba(255,255,255,0.15)",
                transition:"all 0.3s"
              }}/>
            ))}
          </div>

          {/* Score + streak */}
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            {currentStreak >= 2 && (
              <div style={{ background:`${GOLD}20`, border:`1px solid ${GOLD}40`, borderRadius:8, padding:"4px 10px", fontSize:12, color:GOLD, fontFamily:"monospace", fontWeight:700 }}>
                🔥 {currentStreak}x
              </div>
            )}
            <div style={{ background:`${TEAL}15`, border:`1px solid ${TEAL}30`, borderRadius:8, padding:"4px 12px", fontSize:13, color:TEAL, fontFamily:"monospace", fontWeight:700 }}>
              {score}pts
            </div>
          </div>
        </div>

        {/* Timer bar */}
        <div style={{ height:4, background:"rgba(255,255,255,0.08)", flexShrink:0 }}>
          <div style={{ height:"100%", width:`${timerPct}%`, background:timerColor, transition:"width 1s linear", borderRadius:"0 2px 2px 0" }}/>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 40px" }}>
          <div style={{ maxWidth:680, margin:"0 auto" }}>

            {/* Q number + timer */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:12, color:SLATE, fontFamily:"monospace", letterSpacing:1 }}>QUESTION {qIndex+1} OF 5 · {level.emoji} {level.label}</div>
              <div style={{ fontSize:18, fontFamily:"monospace", fontWeight:700, color:timerColor, transition:"color 0.3s" }}>⏱ {timeLeft}s</div>
            </div>

            {/* Case stem — show only on Q1 */}
            {qIndex === 0 && (
              <div style={{ background:`${TEAL}10`, border:`1px solid ${TEAL}25`, borderRadius:14, padding:"16px 20px", marginBottom:20, animation:"fadeUp 0.4s ease both" }}>
                <div style={{ fontSize:10, color:TEAL, fontFamily:"monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>📋 Clinical Scenario</div>
                <div style={{ fontSize:14, color:SLATE2, lineHeight:1.75 }}>{caseData.stem}</div>
              </div>
            )}

            {/* Question */}
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(17px,3vw,22px)", fontWeight:700, color:WHITE, lineHeight:1.4, marginBottom:24, animation:"fadeUp 0.4s ease both" }}>
              {q.text}
            </div>

            {/* Options */}
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = i === q.correct;
                let bg = "rgba(255,255,255,0.04)", border = "rgba(255,255,255,0.12)", color = SLATE2;

                if (revealed) {
                  if (isCorrect) { bg = "rgba(46,212,122,0.15)"; border = GREEN; color = GREEN; }
                  else if (isSelected && !isCorrect) { bg = "rgba(224,85,85,0.15)"; border = RED; color = RED; }
                } else if (isSelected) {
                  bg = `${TEAL}18`; border = TEAL; color = WHITE;
                }

                return (
                  <button key={i} className="opt-btn" onClick={() => handleSelect(i)}
                    style={{ background:bg, border:`2px solid ${border}`, borderRadius:14, padding:"14px 20px", textAlign:"left", color, fontSize:15, fontFamily:"'DM Sans',sans-serif", lineHeight:1.5, display:"flex", alignItems:"center", gap:14, animation:`fadeUp 0.4s ${i*0.07}s ease both` }}>
                    <span style={{ width:28, height:28, borderRadius:"50%", background:`${border}25`, border:`1px solid ${border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, flexShrink:0, fontFamily:"monospace" }}>
                      {revealed ? (isCorrect ? "✓" : isSelected ? "✗" : String.fromCharCode(65+i)) : String.fromCharCode(65+i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Submit / Next */}
            {!revealed ? (
              <button onClick={handleReveal} disabled={selected === null}
                style={{ width:"100%", padding:"14px", borderRadius:12, border:"none", background: selected !== null ? `linear-gradient(135deg,${TEAL},${TEAL2})` : "rgba(255,255,255,0.08)", color: selected !== null ? NAVY : SLATE, fontWeight:700, fontSize:16, cursor: selected !== null ? "pointer" : "not-allowed", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" }}>
                {selected !== null ? "Submit Answer →" : "Select an answer"}
              </button>
            ) : (
              <div style={{ animation:"popIn 0.4s ease both" }}>
                {/* Result banner */}
                <div style={{ background: answers[answers.length-1]?.correct ? `${GREEN}18` : `${RED}18`, border:`1px solid ${answers[answers.length-1]?.correct ? GREEN : RED}40`, borderRadius:14, padding:"16px 20px", marginBottom:16 }}>
                  <div style={{ fontSize:18, fontWeight:700, color: answers[answers.length-1]?.correct ? GREEN : RED, marginBottom:6, fontFamily:"'DM Sans',sans-serif" }}>
                    {answers[answers.length-1]?.correct ? `✓ Correct! +${answers[answers.length-1].pts} pts` : "✗ Incorrect — review below"}
                  </div>
                  <div style={{ fontSize:14, color:SLATE2, lineHeight:1.7 }}>{q.explanation}</div>
                </div>

                {/* Pearl toggle */}
                <button onClick={() => setShowPearl(p => !p)}
                  style={{ width:"100%", padding:"10px", background:`${GOLD}15`, border:`1px solid ${GOLD}35`, borderRadius:10, color:GOLD, fontSize:13, fontFamily:"monospace", fontWeight:700, cursor:"pointer", marginBottom:12 }}>
                  {showPearl ? "▲ Hide Pearl" : "★ Show Clinical Pearl"}
                </button>
                {showPearl && (
                  <div style={{ background:`${GOLD}10`, border:`1px solid ${GOLD}25`, borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:14, color:GOLD, lineHeight:1.65, animation:"fadeUp 0.3s ease both" }}>
                    ⭐ {q.pearl}
                  </div>
                )}

                <button onClick={handleNext}
                  style={{ width:"100%", padding:"14px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${TEAL},${TEAL2})`, color:NAVY, fontWeight:800, fontSize:16, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                  {qIndex < caseData.questions.length - 1 ? "Next Question →" : "See Results 🏆"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS ─────────────────────────────────────────────────────────────────
  if (phase === "results") {
    const correct = answers.filter(a => a.correct).length;
    const grade = pct >= 90 ? { label:"Outstanding", emoji:"🏆", color:GOLD } :
                  pct >= 70 ? { label:"Solid Pass",  emoji:"✅", color:GREEN } :
                  pct >= 50 ? { label:"Needs Review", emoji:"📚", color:TEAL } :
                              { label:"Keep Studying", emoji:"💪", color:RED };

    return (
      <div style={{ minHeight:"100vh", background:`linear-gradient(150deg,${NAVY},${NAVY2})`, display:"flex", flexDirection:"column", fontFamily:"Georgia,serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');
          *{box-sizing:border-box}
          @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
          @keyframes popIn{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
          ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2d4a6b;border-radius:4px}
        `}</style>

        <div style={{ background:NAVY2, borderBottom:`1px solid rgba(255,255,255,0.08)`, padding:"14px 20px", display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={onBack} style={{ background:"transparent", border:`1px solid rgba(255,255,255,0.2)`, color:SLATE, borderRadius:8, padding:"7px 14px", cursor:"pointer", fontSize:12, fontFamily:"monospace" }}>← Back</button>
          <div style={{ flex:1, textAlign:"center", fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:800, color:WHITE }}>Results</div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"28px 20px 60px" }}>
          <div style={{ maxWidth:560, margin:"0 auto" }}>

            {/* Score circle */}
            <div style={{ textAlign:"center", marginBottom:32, animation:"popIn 0.5s ease both" }}>
              <div style={{ width:130, height:130, borderRadius:"50%", background:`conic-gradient(${grade.color} ${pct*3.6}deg, rgba(255,255,255,0.08) 0deg)`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", boxShadow:`0 0 40px ${grade.color}30` }}>
                <div style={{ width:100, height:100, borderRadius:"50%", background:NAVY2, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ fontSize:32 }}>{grade.emoji}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:18, fontWeight:700, color:grade.color }}>{pct}%</div>
                </div>
              </div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:800, color:WHITE, marginBottom:6 }}>{grade.label}</div>
              <div style={{ fontSize:15, color:SLATE2 }}>{correct}/5 correct · {score} points · {level.emoji} {level.label}</div>
              <div style={{ fontSize:12, color:SLATE, fontFamily:"monospace", marginTop:6 }}>Topic: {topic}</div>
            </div>

            {/* Answer review */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:11, color:TEAL, fontFamily:"monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:14 }}>Question Review</div>
              {caseData.questions.map((q, i) => {
                const a = answers[i];
                return (
                  <div key={i} style={{ background: a?.correct ? `${GREEN}0a` : `${RED}0a`, border:`1px solid ${a?.correct ? GREEN : RED}25`, borderRadius:12, padding:"14px 16px", marginBottom:10, animation:`fadeUp 0.4s ${i*0.08}s ease both` }}>
                    <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:8 }}>
                      <span style={{ fontSize:18, flexShrink:0 }}>{a?.correct ? "✅" : "❌"}</span>
                      <div style={{ fontSize:14, color:WHITE, fontWeight:600, lineHeight:1.4 }}>Q{i+1}: {q.text}</div>
                    </div>
                    <div style={{ fontSize:13, color: a?.correct ? GREEN : RED, fontFamily:"monospace", marginBottom:4, paddingLeft:28 }}>
                      Your answer: {a?.selectedIdx !== null && a?.selectedIdx !== undefined ? q.options[a.selectedIdx] : "Timed out"}
                    </div>
                    {!a?.correct && (
                      <div style={{ fontSize:13, color:GREEN, fontFamily:"monospace", marginBottom:6, paddingLeft:28 }}>
                        Correct: {q.options[q.correct]}
                      </div>
                    )}
                    <div style={{ fontSize:12, color:SLATE2, paddingLeft:28, lineHeight:1.6 }}>{q.explanation}</div>
                    <div style={{ fontSize:12, color:GOLD, paddingLeft:28, marginTop:6 }}>⭐ {q.pearl}</div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <button onClick={restart}
                style={{ padding:"14px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${TEAL},${TEAL2})`, color:NAVY, fontWeight:800, fontSize:16, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                🔄 Try Again (New Level)
              </button>
              <div style={{ textAlign:"center", fontSize:12, color:SLATE, fontFamily:"monospace" }}>
                New case available tomorrow · Come back daily to keep your streak
              </div>
              <button onClick={onBack}
                style={{ padding:"12px", borderRadius:12, border:`1px solid rgba(255,255,255,0.15)`, background:"rgba(255,255,255,0.05)", color:SLATE2, fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                ← Back to Gasology
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
