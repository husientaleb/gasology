import { useState } from "react";

const NAVY="#08172e", NAVY2="#0f2240";
const TEAL="#00c9b1", SLATE="#6e90b8", SLATE2="#a8c0d8", WHITE="#f0f6ff";

const TOPICS = ["General Question", "Feedback", "Bug Report", "Jobs Board", "Partnership", "Other"];

const inputStyle = {
  width: "100%", padding: "13px 16px", borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.06)",
  color: WHITE, fontSize: 15, fontFamily: "'DM Sans',sans-serif", outline: "none",
};

export default function ContactPage({ onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) && message.trim();

  const submit = async () => {
    if (!valid || status === "sending") return;
    setStatus("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });
      if (!r.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: NAVY, fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2d4a6b; border-radius: 4px; }
        .cfield:focus { border-color: rgba(0,201,177,0.5) !important; }
        select.cfield option { background: #0f2240; color: #f0f6ff; }
      `}</style>

      {/* Header */}
      <div style={{ background: NAVY2, borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onBack} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)", color: SLATE, borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" }}>← Back</button>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: WHITE }}>📬 Contact Us</div>
          <div style={{ fontSize: 12, color: SLATE, fontFamily: "monospace", marginTop: 2 }}>Questions, feedback, or partnership ideas — we read everything</div>
        </div>
      </div>

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "48px 24px 80px" }}>
        {status === "sent" ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(0,201,177,0.07)", border: "1px solid rgba(0,201,177,0.3)", borderRadius: 20 }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: WHITE, marginBottom: 10 }}>Message sent!</div>
            <div style={{ fontSize: 15, color: SLATE2, lineHeight: 1.7 }}>Thanks for reaching out — we'll get back to you at <span style={{ color: TEAL }}>{email.trim()}</span>.</div>
            <button onClick={onBack} style={{ marginTop: 28, padding: "12px 28px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#00c9b1,#00a896)", color: NAVY, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>← Back to Home</button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,5vw,44px)", fontWeight: 800, color: WHITE, letterSpacing: "-1px", marginBottom: 12 }}>
                Get in <span style={{ fontStyle: "italic", color: TEAL }}>Touch.</span>
              </h1>
              <p style={{ fontSize: 15, color: SLATE2, lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
                Found a bug? Have an idea? Want to list a job or partner with us?<br />Drop us a line below.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <input className="cfield" placeholder="Your name (optional)" value={name} onChange={e => setName(e.target.value)} style={{ ...inputStyle, flex: "1 1 220px" }} />
                <input className="cfield" type="email" placeholder="Your email address *" value={email} onChange={e => setEmail(e.target.value)} style={{ ...inputStyle, flex: "1 1 220px" }} />
              </div>
              <select className="cfield" value={topic} onChange={e => setTopic(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <textarea className="cfield" placeholder="Your message *" value={message} onChange={e => setMessage(e.target.value)} rows={7}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
              <button onClick={submit} disabled={!valid || status === "sending"}
                style={{ padding: "15px 22px", borderRadius: 10, border: "none", background: valid ? "linear-gradient(135deg,#00c9b1,#00a896)" : "rgba(255,255,255,0.08)", color: valid ? NAVY : SLATE, fontWeight: 700, fontSize: 15, cursor: valid ? "pointer" : "not-allowed", fontFamily: "'DM Sans',sans-serif", boxShadow: valid ? "0 4px 18px rgba(0,201,177,0.35)" : "none" }}>
                {status === "sending" ? "Sending..." : "Send Message →"}
              </button>
              {status === "error" && (
                <div style={{ textAlign: "center", fontSize: 13, color: "#e05555", fontFamily: "monospace" }}>
                  Something went wrong — please try again in a moment.
                </div>
              )}
              <div style={{ textAlign: "center", fontSize: 12, color: SLATE, fontFamily: "monospace", marginTop: 8 }}>
                We typically reply within 1–2 business days.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
