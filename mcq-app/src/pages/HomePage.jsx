import { useState } from "react";
import { useQuestions } from "../hooks/useQuestions";

const CATEGORIES = [
  { id: "all", label: "All Subjects" },
  { id: "core", label: "Core CS" },
  { id: "programming", label: "Programming" },
  { id: "systems", label: "Systems" },
  { id: "theory", label: "Theory" },
  { id: "devops", label: "DevOps" },
];

export default function HomePage({ onSelectSubject, onAdminClick, user, onLogout }) {
  const { subjects, loading } = useQuestions();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  if (loading) return <div style={{ minHeight: "100vh", background: "#07090f", color: "#eef0f8", textAlign: "center", padding: 100, fontFamily: "'Outfit', sans-serif" }}>Loading subjects...</div>;

  const filtered = subjects.filter((s) => {
    const matchCat = activeTab === "all" || s.category === activeTab;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div style={{ minHeight: "100vh", background: "#07090f", color: "#eef0f8", fontFamily: "'Outfit', sans-serif" }}>
      {/* NAV */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: 64, borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(7,9,15,0.95)", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Fira Code', monospace", fontWeight: 800, color: "white", fontSize: 14,
          }}>CS</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>MCQ<span style={{ color: "#3b82f6" }}>Prep</span></span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Subjects", "Practice", "Leaderboard"].map((l) => (
            <button key={l} style={{
              padding: "7px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500,
              color: l === "Subjects" ? "#3b82f6" : "#9ca3af",
              background: l === "Subjects" ? "rgba(59,130,246,0.1)" : "none",
              border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            }}>{l}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onAdminClick} style={{
            padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: "rgba(239,68,68,0.1)", color: "#f87171",
            border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
          }}>🔐 Admin</button>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: "white",
              }}>{user.name?.[0]?.toUpperCase()}</div>
              <span style={{ fontSize: 13, color: "#9ca3af", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</span>
              <button onClick={onLogout} style={{
                padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600,
                background: "rgba(255,255,255,0.05)", color: "#6b7280",
                border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
              }}>Sign Out</button>
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <div style={{ padding: "80px 40px 60px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 50% at 20% 0%, rgba(59,130,246,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 100%, rgba(139,92,246,0.06) 0%, transparent 60%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div style={{ position: "relative", maxWidth: 760 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
            borderRadius: 20, padding: "6px 14px", marginBottom: 28,
            fontSize: 12, fontWeight: 600, color: "#3b82f6", letterSpacing: "0.5px",
            fontFamily: "'Fira Code', monospace",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
            CS FUNDAMENTALS · AI POWERED
          </div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 20 }}>
            Master Computer Science<br />
            with <span style={{ background: "linear-gradient(90deg,#3b82f6,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI-Powered MCQs</span>
          </h1>
          <p style={{ fontSize: 17, color: "#9ca3af", lineHeight: 1.7, maxWidth: 540, marginBottom: 36 }}>
            Practice across all core CS subjects. Instant feedback, detailed explanations, and an admin panel to add your own questions.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{
              padding: "14px 28px", borderRadius: 10, background: "#3b82f6", color: "white",
              fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            }}>▶ Start Practicing</button>
            <button onClick={onAdminClick} style={{
              padding: "14px 28px", borderRadius: 10, background: "transparent", color: "#eef0f8",
              fontSize: 15, fontWeight: 600, border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            }}>🔐 Admin Panel →</button>
          </div>
          <div style={{ display: "flex", gap: 40, marginTop: 52, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { num: subjects.length, label: "Subjects", color: "#3b82f6" },
              { num: subjects.reduce((a, s) => a + (s.questionCount || 0), 0) + "+", label: "Questions", color: "#06b6d4" },
              { num: "AI", label: "Generated", color: "#10b981" },
              { num: "Free", label: "Always", color: "#f59e0b" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Fira Code', monospace", color: s.color }}>{s.num}</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ padding: "0 40px 28px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "#111827", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12, padding: "12px 18px",
        }}>
          <span style={{ fontSize: 18, color: "#6b7280" }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subjects, topics..."
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "#eef0f8",
            }}
          />
        </div>
      </div>

      {/* FILTER TABS */}
      <div style={{ padding: "0 40px 24px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => (
          <button key={cat.id} onClick={() => setActiveTab(cat.id)} style={{
            padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            border: activeTab === cat.id ? "1px solid rgba(59,130,246,0.5)" : "1px solid rgba(255,255,255,0.07)",
            color: activeTab === cat.id ? "#3b82f6" : "#9ca3af",
            background: activeTab === cat.id ? "rgba(59,130,246,0.08)" : "#0d1117",
          }}>{cat.label}</button>
        ))}
      </div>

      {/* SUBJECTS GRID */}
      <div style={{ padding: "0 40px 60px" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#3b82f6", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Fira Code', monospace", marginBottom: 8 }}>CS Fundamentals</div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>Choose Your Subject</div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "#6b7280" }}>No subjects match your search.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {/* FEATURED */}
            {featured && (
              <SubjectCard key={featured.id} subject={featured} featured onClick={() => onSelectSubject(featured)} />
            )}
            {rest.map((s) => (
              <SubjectCard key={s.id} subject={s} onClick={() => onSelectSubject(s)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SubjectCard({ subject, featured, onClick }) {
  const [hovered, setHovered] = useState(false);
  const { color, colorBg } = subject;

  if (featured) {
    return (
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          gridColumn: "1 / -1",
          background: "#111827",
          border: `1px solid ${hovered ? color + "60" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 20, padding: 32,
          display: "flex", alignItems: "center", gap: 32,
          position: "relative", overflow: "hidden", cursor: "pointer",
          transition: "all 0.2s",
          boxShadow: hovered ? "0 24px 48px rgba(0,0,0,0.35)" : "none",
          transform: hovered ? "translateY(-2px)" : "none",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: colorBg, border: `1px solid ${color}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, marginBottom: 18,
          }}>{subject.icon}</div>
          <div style={{ fontSize: 11, color, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Fira Code', monospace", marginBottom: 8 }}>⭐ Featured Subject</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 10 }}>{subject.name}</div>
          <div style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.7, maxWidth: 480 }}>{subject.description}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
            {subject.tags.map((t) => (
              <span key={t} style={{ fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 6, fontFamily: "'Fira Code', monospace", background: colorBg, color }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ textAlign: "center", padding: "16px 24px", background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Fira Code', monospace", color }}>{subject.questionCount || 0}</div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Questions</div>
          </div>
          <button style={{
            padding: "12px 24px", borderRadius: 10, background: color, color: "white",
            fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
            fontFamily: "'Outfit', sans-serif", width: "100%",
          }}>Start Now →</button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#111827",
        border: `1px solid ${hovered ? color + "50" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16, padding: 24,
        cursor: "pointer", transition: "all 0.2s",
        display: "flex", flexDirection: "column",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{
          width: 50, height: 50, borderRadius: 14,
          background: colorBg, border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
        }}>{subject.icon}</div>
        {subject.badge && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 6,
            letterSpacing: "0.5px", fontFamily: "'Fira Code', monospace",
            background: subject.badge === "HOT" ? "rgba(239,68,68,0.15)" : subject.badge === "NEW" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
            color: subject.badge === "HOT" ? "#f87171" : subject.badge === "NEW" ? "#34d399" : "#fbbf24",
          }}>{subject.badge}</span>
        )}
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.3px" }}>{subject.name}</div>
      <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6, marginBottom: 16, flex: 1 }}>{subject.description}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {subject.tags.slice(0, 3).map((t) => (
          <span key={t} style={{ fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 6, fontFamily: "'Fira Code', monospace", background: colorBg, color }}>{t}</span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: color }} />
          {subject.questionCount || 0} questions
        </div>
        <div style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${hovered ? color + "60" : "rgba(255,255,255,0.07)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: hovered ? color : "#6b7280", transition: "all 0.15s" }}>→</div>
      </div>
    </div>
  );
}
