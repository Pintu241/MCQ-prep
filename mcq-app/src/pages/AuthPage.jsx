import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function AuthPage({ onBack }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, register } = useAuth();
  const isLogin = mode === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) await login(email, password);
      else await register(name, email, password);
      // On success, user state updates → App.jsx re-renders automatically
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#07090f",
      fontFamily: "'Outfit', sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative", overflow: "hidden",
    }}>
      {/* Glow */}
      <div style={{ position: "absolute", width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", top: "20%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />

      {/* Back button */}
      {onBack && (
        <button onClick={onBack} style={{
          position: "absolute", top: 20, left: 24,
          background: "none", border: "none", color: "#9ca3af",
          cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 14,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          ← Back to Home
        </button>
      )}

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(59,130,246,0.3)" }}>
            🧠
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#eef0f8", marginBottom: 6 }}>
            {isLogin ? "Sign in to practice" : "Create free account"}
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            {isLogin ? "Continue your learning journey" : "Join and start practicing MCQs"}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: "#0f1724", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32, boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: "#07090f", borderRadius: 10, padding: 4, marginBottom: 28 }}>
            {["login", "signup"].map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                style={{
                  flex: 1, padding: "8px", borderRadius: 7, border: "none", cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600,
                  background: mode === m ? "#1e3a5f" : "transparent",
                  color: mode === m ? "#60a5fa" : "#6b7280",
                  transition: "all 0.2s",
                }}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && <Field label="Full Name" type="text" value={name} onChange={setName} placeholder="e.g. Arjun Sharma" />}
            <Field label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters" required
                  style={{ ...inputStyle, paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass((p) => !p)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 16 }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "12px 14px", marginBottom: 18, color: "#f87171", fontSize: 13 }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "#374151" : "linear-gradient(135deg, #3b82f6, #06b6d4)",
              color: "white", fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700,
              opacity: loading ? 0.7 : 1, boxShadow: loading ? "none" : "0 6px 20px rgba(59,130,246,0.3)",
            }}>
              {loading ? "Please wait..." : isLogin ? "Sign In →" : "Create Account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 20, color: "#6b7280", fontSize: 13 }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setMode(isLogin ? "signup" : "login"); setError(""); }}
              style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600 }}>
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required style={inputStyle} />
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#9ca3af", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" };
const inputStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 10,
  background: "#07090f", border: "1px solid rgba(255,255,255,0.1)",
  color: "#eef0f8", fontFamily: "'Outfit', sans-serif", fontSize: 14,
  outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
};
