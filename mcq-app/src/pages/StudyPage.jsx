import { useState, useEffect } from "react";
import { useQuestions } from "../hooks/useQuestions";

const LETTERS = ["A", "B", "C", "D"];

export default function StudyPage({ subject: initialSubject, chapter, onBack }) {
  const { subjects, loadSubjectQuestions } = useQuestions();
  const subject = subjects.find((s) => s.id === initialSubject.id) || initialSubject;
  const allQuestions = subject.questions;

  const questions = allQuestions
    ? (chapter ? allQuestions.filter((q) => q.topic === chapter) : allQuestions)
    : null;

  const [loading, setLoading] = useState(!allQuestions);
  const [revealed, setRevealed] = useState({}); // { [idx]: true }

  useEffect(() => {
    if (!allQuestions) {
      loadSubjectQuestions(subject.id).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [allQuestions, subject.id, loadSubjectQuestions]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#07090f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", color: "#9ca3af" }}>
        Loading questions...
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#07090f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ textAlign: "center", color: "#9ca3af" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#eef0f8", marginBottom: 6 }}>No questions for {chapter || "this subject"}</div>
          <button onClick={onBack} style={btnStyle()}>← Back</button>
        </div>
      </div>
    );
  }

  const revealAll = () => {
    const all = {};
    questions.forEach((_, i) => { all[i] = true; });
    setRevealed(all);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07090f", fontFamily: "'Outfit', sans-serif", color: "#eef0f8" }}>
      {/* NAV */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 60,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(7,9,15,0.97)", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 14, fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
          ← Back
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{subject.name}</div>
          {chapter && <div style={{ fontSize: 11, color: "#6b7280", fontFamily: "'Fira Code',monospace" }}>{chapter}</div>}
        </div>
        <button onClick={revealAll} style={{
          padding: "7px 14px", borderRadius: 8, background: "rgba(59,130,246,0.1)",
          color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)",
          cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600,
        }}>
          Show All Answers
        </button>
      </nav>

      {/* HEADER */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, color: subject.color, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Fira Code',monospace", marginBottom: 4 }}>
              Study Mode
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>{chapter || subject.name}</h1>
          </div>
          <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 18px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Fira Code',monospace", color: subject.color }}>{questions.length}</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Questions</div>
          </div>
        </div>

        {/* QUESTIONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 60 }}>
          {questions.map((q, idx) => (
            <QuestionCard
              key={idx}
              q={q}
              idx={idx}
              revealed={!!revealed[idx]}
              onReveal={() => setRevealed((r) => ({ ...r, [idx]: true }))}
              subjectColor={subject.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ q, idx, revealed, onReveal, subjectColor }) {
  const [selected, setSelected] = useState(null); // index of clicked option

  const handleSelect = (i) => {
    if (selected !== null) return; // already answered
    setSelected(i);
    // auto-reveal explanation
    if (!revealed) onReveal();
  };

  const isAnswered = selected !== null;

  return (
    <div style={{
      background: "#0f1724",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, overflow: "hidden",
    }}>
      {/* Question header */}
      <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, fontFamily: "'Fira Code',monospace",
            color: subjectColor, background: `${subjectColor}15`,
            padding: "2px 8px", borderRadius: 5, border: `1px solid ${subjectColor}25`,
          }}>
            Q{String(idx + 1).padStart(2, "0")}
          </span>
          {q.topic && (
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: "rgba(255,255,255,0.05)", color: "#9ca3af", fontFamily: "'Fira Code',monospace" }}>
              {q.topic}
            </span>
          )}
          {q.difficulty && (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 5,
              background: q.difficulty === "Easy" ? "rgba(16,185,129,0.12)" : q.difficulty === "Hard" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
              color: q.difficulty === "Easy" ? "#34d399" : q.difficulty === "Hard" ? "#f87171" : "#fbbf24",
            }}>
              {q.difficulty}
            </span>
          )}
          {isAnswered && (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 5,
              background: selected === q.correct ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
              color: selected === q.correct ? "#34d399" : "#f87171",
              marginLeft: "auto",
            }}>
              {selected === q.correct ? "✓ Correct!" : "✗ Wrong"}
            </span>
          )}
        </div>
        <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.6, color: "#eef0f8", margin: 0 }}>
          {q.question}
        </p>
      </div>

      {/* Options */}
      <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct;
          const isSelected = i === selected;

          let bg = "rgba(255,255,255,0.03)";
          let border = "rgba(255,255,255,0.05)";
          let letterBg = "#1f2937";
          let letterColor = "#9ca3af";
          let textColor = "#9ca3af";

          if (isAnswered) {
            if (isCorrect) {
              bg = "rgba(16,185,129,0.1)"; border = "rgba(16,185,129,0.3)";
              letterBg = "#10b981"; letterColor = "white"; textColor = "#d1fae5";
            } else if (isSelected && !isCorrect) {
              bg = "rgba(239,68,68,0.1)"; border = "rgba(239,68,68,0.3)";
              letterBg = "#ef4444"; letterColor = "white"; textColor = "#fecaca";
            }
          }

          return (
            <div
              key={i}
              onClick={() => handleSelect(i)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 10,
                background: bg, border: `1px solid ${border}`,
                cursor: isAnswered ? "default" : "pointer",
                transition: "all 0.18s",
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                if (!isAnswered) e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={(e) => {
                if (!isAnswered) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, fontFamily: "'Fira Code',monospace",
                background: letterBg, color: letterColor, transition: "all 0.18s",
              }}>
                {LETTERS[i]}
              </span>
              <span style={{ fontSize: 14, color: textColor, fontWeight: isAnswered && isCorrect ? 600 : 400, flex: 1 }}>
                {opt}
              </span>
              {isAnswered && isCorrect && <span style={{ color: "#10b981", fontSize: 16 }}>✓</span>}
              {isAnswered && isSelected && !isCorrect && <span style={{ color: "#ef4444", fontSize: 16 }}>✗</span>}
            </div>
          );
        })}
      </div>

      {/* Explanation — shown after answering */}
      <div style={{ padding: "0 20px 18px" }}>
        {!isAnswered ? (
          /* Show Answer without clicking an option */
          !revealed && (
            <button onClick={() => { setSelected(-1); onReveal(); }} style={{
              padding: "8px 18px", borderRadius: 9,
              background: "rgba(255,255,255,0.05)", color: "#9ca3af",
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600,
            }}>
              Show Answer
            </button>
          )
        ) : q.explanation ? (
          <div style={{
            background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: 10, padding: "12px 14px", marginTop: 2,
          }}>
            <div style={{ fontSize: 10, color: "#3b82f6", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'Fira Code',monospace", marginBottom: 6 }}>
              Explanation
            </div>
            <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.7 }}>{q.explanation}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}


function btnStyle() {
  return {
    padding: "10px 20px", borderRadius: 10, background: "#3b82f6",
    color: "white", border: "none", cursor: "pointer",
    fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, marginTop: 16,
  };
}
