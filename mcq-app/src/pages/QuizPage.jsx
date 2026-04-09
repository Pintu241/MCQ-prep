import { useState, useEffect, useCallback } from "react";
import { useQuestions } from "../hooks/useQuestions";

const LETTERS = ["A", "B", "C", "D"];

export default function QuizPage({ subject: initialSubject, chapter, onBack }) {
  const { subjects, loadSubjectQuestions } = useQuestions();
  const subject = subjects.find((s) => s.id === initialSubject.id) || initialSubject;
  const allQuestions = subject.questions;

  // Filter by chapter if provided
  const questions = allQuestions
    ? (chapter ? allQuestions.filter((q) => q.topic === chapter) : allQuestions)
    : null;

  const [loading, setLoading] = useState(!allQuestions);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const q = questions ? questions[idx] : null;

  useEffect(() => {
    if (!allQuestions) {
      loadSubjectQuestions(subject.id).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [allQuestions, subject.id, loadSubjectQuestions]);

  useEffect(() => {
    if (loading || answered || done) return;
    setTimeLeft(30);
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setAnswered(true);
          setSelected(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [idx, answered, done, loading]);

  const handleSelect = useCallback((i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.correct) setScore((s) => s + 1);
  }, [answered, q]);

  const handleNext = () => {
    if (idx + 1 >= questions.length) { setDone(true); return; }
    setIdx((i) => i + 1);
    setSelected(null);
    setAnswered(false);
  };

  const pct = questions ? Math.round((score / questions.length) * 100) : 0;
  const timerColor = timeLeft > 15 ? "#10b981" : timeLeft > 7 ? "#f59e0b" : "#ef4444";

  if (loading) {
    return <div style={{ minHeight: "100vh", background: "#07090f", color: "#eef0f8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif" }}>Loading quiz questions...</div>;
  }

  if (!questions || questions.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#07090f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ textAlign: "center", color: "#9ca3af" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#eef0f8", marginBottom: 8 }}>No questions for {chapter || "this subject"}</div>
          <div style={{ marginBottom: 24 }}>Add questions via the Admin Panel first.</div>
          <button onClick={onBack} style={btnStyle("#3b82f6")}>← Back</button>
        </div>
      </div>
    );
  }

  if (done) {
    const emoji = pct >= 90 ? "🏆" : pct >= 70 ? "🌟" : pct >= 50 ? "👍" : "📚";
    const title = pct >= 90 ? "Outstanding!" : pct >= 70 ? "Great Job!" : pct >= 50 ? "Good Effort!" : "Keep Practicing!";
    const circumference = 251.2;
    const offset = circumference - (pct / 100) * circumference;

    return (
      <div style={{ minHeight: "100vh", background: "#07090f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: 400, padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{emoji}</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: "#eef0f8" }}>{title}</div>
          <div style={{ color: "#9ca3af", marginBottom: 4 }}>{subject.name}</div>
          {chapter && <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 24, fontFamily: "'Fira Code',monospace" }}>{chapter}</div>}

          <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 32px" }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
              <circle cx="80" cy="80" r="60" fill="none" stroke="url(#g)" strokeWidth="12" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 1s ease" }} />
              <defs>
                <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 800, fontFamily: "'Fira Code', monospace", color: "#eef0f8" }}>{pct}%</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Score</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
            {[
              { val: score, label: "Correct", color: "#10b981" },
              { val: questions.length - score, label: "Wrong", color: "#ef4444" },
              { val: questions.length, label: "Total", color: "#3b82f6" },
            ].map((s) => (
              <div key={s.label} style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 8px" }}>
                <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Fira Code', monospace", color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <button onClick={() => { setIdx(0); setScore(0); setSelected(null); setAnswered(false); setDone(false); }} style={{ ...btnStyle("#3b82f6"), width: "100%", marginBottom: 10 }}>🔄 Retry</button>
          <button onClick={onBack} style={{ ...btnStyle("transparent"), width: "100%", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#07090f", fontFamily: "'Outfit', sans-serif" }}>
      {/* HEADER */}
      <div style={{
        background: "#0d1117", borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "16px 32px", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 14, fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>← Back</button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#eef0f8", textAlign: "center" }}>{subject.name}</div>
            {chapter && <div style={{ fontSize: 11, color: "#6b7280", textAlign: "center", fontFamily: "'Fira Code',monospace" }}>{chapter}</div>}
          </div>
          <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 13, color: "#10b981" }}>{score}/{idx}</div>
        </div>
        {/* Progress */}
        <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", background: `linear-gradient(90deg, ${subject.color}, #06b6d4)`, borderRadius: 4, width: `${((idx) / questions.length) * 100}%`, transition: "width 0.4s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#6b7280", fontFamily: "'Fira Code', monospace" }}>
          <span>Question {idx + 1} of {questions.length}</span>
          <span style={{ color: timerColor }}>⏱ {timeLeft}s</span>
        </div>
      </div>

      {/* QUESTION */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: subject.color, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Fira Code', monospace" }}>
            Question {String(idx + 1).padStart(2, "0")}
          </div>
          {q.topic && (
            <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, background: "rgba(255,255,255,0.06)", color: "#9ca3af", fontFamily: "'Fira Code', monospace" }}>
              {q.topic}
            </span>
          )}
          {q.difficulty && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 5,
              background: q.difficulty === "Easy" ? "rgba(16,185,129,0.15)" : q.difficulty === "Hard" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
              color: q.difficulty === "Easy" ? "#34d399" : q.difficulty === "Hard" ? "#f87171" : "#fbbf24",
            }}>
              {q.difficulty}
            </span>
          )}
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.5, marginBottom: 32, color: "#eef0f8" }}>{q.question}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt, i) => {
            let borderColor = "rgba(255,255,255,0.07)";
            let bg = "#111827";
            let letterBg = "#1f2937";
            let letterColor = "#9ca3af";
            if (answered) {
              if (i === q.correct) { borderColor = "#10b981"; bg = "rgba(16,185,129,0.08)"; letterBg = "#10b981"; letterColor = "#fff"; }
              else if (i === selected && i !== q.correct) { borderColor = "#ef4444"; bg = "rgba(239,68,68,0.08)"; letterBg = "#ef4444"; letterColor = "#fff"; }
              else { bg = "#0d1117"; }
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} disabled={answered} style={{
                background: bg, border: `1.5px solid ${borderColor}`,
                borderRadius: 12, padding: "16px 18px", textAlign: "left", cursor: answered ? "default" : "pointer",
                fontFamily: "'Outfit', sans-serif", fontSize: 15, color: answered && i !== q.correct && i !== selected ? "#4b5563" : "#eef0f8",
                transition: "all 0.18s", display: "flex", alignItems: "center", gap: 14,
              }}>
                <span style={{ width: 30, height: 30, borderRadius: "50%", background: letterBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, fontFamily: "'Fira Code', monospace", color: letterColor, flexShrink: 0, transition: "all 0.18s" }}>{LETTERS[i]}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {answered && q.explanation && (
          <div style={{ marginTop: 20, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'Fira Code', monospace", marginBottom: 8 }}>Explanation</div>
            <div style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.7 }}>{q.explanation}</div>
          </div>
        )}

        {answered && (
          <button onClick={handleNext} style={{ ...btnStyle(subject.color), width: "100%", marginTop: 20, fontSize: 16 }}>
            {idx + 1 >= questions.length ? "View Results →" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}

function btnStyle(bg) {
  return {
    padding: "14px 24px", borderRadius: 12, background: bg, color: "white",
    border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif",
    fontSize: 15, fontWeight: 600,
  };
}
