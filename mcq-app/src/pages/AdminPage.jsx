import { useState, useRef, useEffect } from "react";
import { useQuestions } from "../hooks/useQuestions";
import { parseQuestionsFromText, SAMPLE_TEXT_FORMAT } from "../utils/parseQuestions";

const TABS = ["📤 Upload Questions", "✏️ Edit Questions", "📋 Format Guide"];

export default function AdminPage({ onBack }) {
  const { subjects, addQuestionsToSubject, updateQuestion, deleteQuestion, resetToDefault, loadSubjectQuestions } = useQuestions();
  const [tab, setTab] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || "");
  const [uploadText, setUploadText] = useState("");
  const [parseResult, setParseResult] = useState(null);
  const [editingQ, setEditingQ] = useState(null);
  const [toast, setToast] = useState(null);
  const fileRef = useRef();

  const [loadingSubject, setLoadingSubject] = useState(false);

  useEffect(() => {
    if (selectedSubject) {
      const s = subjects.find(sub => sub.id === selectedSubject);
      if (s && !s.questions) {
        setLoadingSubject(true);
        loadSubjectQuestions(selectedSubject).finally(() => setLoadingSubject(false));
      }
    }
  }, [selectedSubject, subjects, loadSubjectQuestions]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── FILE UPLOAD ── */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadText(ev.target.result);
      setParseResult(null);
    };
    reader.readAsText(file);
  };

  const handleParse = () => {
    if (!uploadText.trim()) { showToast("Paste or upload question text first", "error"); return; }
    const result = parseQuestionsFromText(uploadText);
    setParseResult(result);
  };

  const handleImport = async () => {
    if (!parseResult?.questions?.length) return;
    try {
      await addQuestionsToSubject(selectedSubject, parseResult.questions);
      showToast(`✅ ${parseResult.questions.length} questions added successfully!`);
      setUploadText("");
      setParseResult(null);
    } catch(err) {
      showToast("Error adding questions: " + err.message, "error");
    }
  };

  /* ── EDIT QUESTION ── */
  const handleSaveEdit = async () => {
    if (!editingQ) return;
    try {
      await updateQuestion(editingQ.subjectId, editingQ.id, {
        question: editingQ.question,
        options: editingQ.options,
        correct: Number(editingQ.correct),
        explanation: editingQ.explanation,
        topic: editingQ.topic || "General",
        difficulty: editingQ.difficulty || "Medium",
      });
      setEditingQ(null);
      showToast("✅ Question updated!");
    } catch (err) {
      showToast("Error updating: " + err.message, "error");
    }
  };

  const handleDelete = async (subjectId, questionId, questionText) => {
    if (!window.confirm(`Delete: "${questionText.slice(0, 60)}..."?`)) return;
    try {
      await deleteQuestion(subjectId, questionId);
      showToast("🗑️ Question deleted.");
    } catch (err) {
      showToast("Error deleting: " + err.message, "error");
    }
  };

  const currentSubject = subjects.find((s) => s.id === selectedSubject);

  return (
    <div style={{ minHeight: "100vh", background: "#07090f", fontFamily: "'Outfit', sans-serif", color: "#eef0f8" }}>
      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 999,
          background: toast.type === "error" ? "rgba(239,68,68,0.9)" : "rgba(16,185,129,0.9)",
          color: "white", padding: "12px 20px", borderRadius: 10,
          fontSize: 14, fontWeight: 600, backdropFilter: "blur(8px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        }}>{toast.msg}</div>
      )}

      {/* EDIT MODAL */}
      {editingQ && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }}>
          <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 600, maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: "#eef0f8" }}>✏️ Edit Question</div>

            <Label>Question Text</Label>
            <textarea value={editingQ.question} onChange={(e) => setEditingQ({ ...editingQ, question: e.target.value })}
              rows={3} style={textareaStyle} />

            {editingQ.options.map((opt, i) => (
              <div key={i}>
                <Label>Option {["A", "B", "C", "D"][i]}</Label>
                <input value={opt} onChange={(e) => {
                  const opts = [...editingQ.options]; opts[i] = e.target.value;
                  setEditingQ({ ...editingQ, options: opts });
                }} style={inputStyle} />
              </div>
            ))}

            <Label>Correct Answer</Label>
            <select value={editingQ.correct} onChange={(e) => setEditingQ({ ...editingQ, correct: e.target.value })} style={inputStyle}>
              {editingQ.options.map((_, i) => (
                <option key={i} value={i}>Option {["A", "B", "C", "D"][i]}: {editingQ.options[i].slice(0, 40)}</option>
              ))}
            </select>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <Label>Topic</Label>
                <input value={editingQ.topic || ""} onChange={(e) => setEditingQ({ ...editingQ, topic: e.target.value })} placeholder="e.g. Sorting" style={inputStyle} />
              </div>
              <div>
                <Label>Difficulty</Label>
                <select value={editingQ.difficulty || "Medium"} onChange={(e) => setEditingQ({ ...editingQ, difficulty: e.target.value })} style={inputStyle}>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>

            <Label>Explanation (optional)</Label>
            <textarea value={editingQ.explanation} onChange={(e) => setEditingQ({ ...editingQ, explanation: e.target.value })}
              rows={2} style={textareaStyle} />

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={handleSaveEdit} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "#3b82f6", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "'Outfit',sans-serif", fontSize: 15 }}>Save Changes</button>
              <button onClick={() => setEditingQ(null)} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "rgba(255,255,255,0.06)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontWeight: 600, fontFamily: "'Outfit',sans-serif", fontSize: 15 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 64, borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(7,9,15,0.95)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 14, fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 6 }}>← Back to Subjects</button>
        <div style={{ fontWeight: 700, fontSize: 16 }}>🔐 Admin <span style={{ color: "#ef4444" }}>Panel</span></div>
        <button onClick={() => { if (window.confirm("Reset ALL questions to default?")) { resetToDefault(); showToast("Reset to defaults!"); } }}
          style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600 }}>
          Reset to Default
        </button>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 32px" }}>
        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 36 }}>
          {[
            { label: "Total Subjects", val: subjects.length, color: "#3b82f6" },
            { label: "Total Questions", val: subjects.reduce((a, s) => a + (s.questionCount || 0), 0), color: "#10b981" },
            { label: "Avg per Subject", val: subjects.length ? Math.round(subjects.reduce((a, s) => a + (s.questionCount || 0), 0) / subjects.length) : 0, color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 16px" }}>
              <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6, fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Fira Code',monospace", color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 4, marginBottom: 32, background: "#0d1117", borderRadius: 12, padding: 4, border: "1px solid rgba(255,255,255,0.07)" }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              flex: 1, padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "'Outfit',sans-serif",
              background: tab === i ? "#1e293b" : "transparent",
              color: tab === i ? "#eef0f8" : "#6b7280", border: "none",
              transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>

        {/* ── TAB 0: UPLOAD ── */}
        {tab === 0 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <Label>Select Subject to Add Questions To</Label>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} style={inputStyle}>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.icon} {s.name} ({s.questions.length} questions)</option>
                ))}
              </select>
            </div>

            {/* FILE UPLOAD ZONE */}
            <div
              onClick={() => fileRef.current.click()}
              style={{
                border: "2px dashed rgba(59,130,246,0.3)", borderRadius: 16,
                padding: 40, textAlign: "center", cursor: "pointer",
                background: "rgba(59,130,246,0.04)", marginBottom: 16,
                transition: "all 0.2s",
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { const r = new FileReader(); r.onload = (ev) => { setUploadText(ev.target.result); setParseResult(null); }; r.readAsText(f); } }}
            >
              <input ref={fileRef} type="file" accept=".txt,.text" onChange={handleFile} style={{ display: "none" }} />
              <div style={{ fontSize: 36, marginBottom: 12 }}>📄</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: "#eef0f8" }}>Drop .txt file here or click to browse</div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>Supports plain text files in the MCQPrep format</div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Or Paste Question Text Directly</Label>
              <textarea
                value={uploadText}
                onChange={(e) => { setUploadText(e.target.value); setParseResult(null); }}
                placeholder={`Q: What is the time complexity of binary search?\nA) O(n)\nB) O(log n)\nC) O(n log n)\nD) O(1)\nANSWER: B\nEXPLANATION: Binary search halves the search space each step.\n\nQ: Next question...`}
                rows={12}
                style={{ ...textareaStyle, fontFamily: "'Fira Code', monospace", fontSize: 13 }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <button onClick={handleParse} style={{ ...btn("#3b82f6"), flex: 1 }}>🔍 Parse & Preview Questions</button>
              <button onClick={() => { setUploadText(""); setParseResult(null); }} style={{ ...btn("transparent"), border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>Clear</button>
            </div>

            {/* PARSE RESULT */}
            {parseResult && (
              <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600, color: "#eef0f8" }}>Preview: {parseResult.questions.length} question(s) found</span>
                  {parseResult.questions.length > 0 && (
                    <button onClick={handleImport} style={btn("#10b981")}>✅ Import All →</button>
                  )}
                </div>

                {parseResult.errors.length > 0 && (
                  <div style={{ padding: 16, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: 12, color: "#f87171", fontWeight: 600, marginBottom: 8 }}>⚠️ Parse Warnings</div>
                    {parseResult.errors.map((e, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#f87171", marginBottom: 4, fontFamily: "'Fira Code', monospace" }}>• {e}</div>
                    ))}
                  </div>
                )}

                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, maxHeight: 400, overflowY: "auto" }}>
                  {parseResult.questions.map((q, i) => (
                    <div key={i} style={{ background: "#1a2236", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: "#eef0f8" }}>Q{i + 1}. {q.question}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        {q.options.map((o, j) => (
                          <div key={j} style={{ fontSize: 12, padding: "6px 10px", borderRadius: 8, background: j === q.correct ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)", color: j === q.correct ? "#34d399" : "#9ca3af", border: j === q.correct ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.04)" }}>
                            {["A", "B", "C", "D"][j]}) {o}
                          </div>
                        ))}
                      </div>
                      {q.explanation && <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280", fontStyle: "italic" }}>💡 {q.explanation}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 1: EDIT ── */}
        {tab === 1 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <Label>Select Subject</Label>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} style={inputStyle}>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.icon} {s.name} ({s.questionCount || 0} questions)</option>
                ))}
              </select>
            </div>

            {loadingSubject ? (
              <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>Loading questions...</div>
            ) : (!currentSubject?.questions || currentSubject.questions.length === 0) ? (
              <div style={{ textAlign: "center", padding: 60, color: "#6b7280", background: "#111827", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                <div style={{ color: "#eef0f8", fontWeight: 600, marginBottom: 4 }}>No questions yet</div>
                <div style={{ fontSize: 13 }}>Upload questions using the Upload tab.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {currentSubject?.questions.map((q, i) => (
                  <div key={q.id} style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: currentSubject.color, fontWeight: 700, fontFamily: "'Fira Code',monospace", marginBottom: 8 }}>Q{i + 1}</div>
                        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12, lineHeight: 1.5 }}>{q.question}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                          {q.options.map((o, j) => (
                            <div key={j} style={{ fontSize: 12, padding: "6px 10px", borderRadius: 8, background: j === q.correct ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)", color: j === q.correct ? "#34d399" : "#9ca3af", border: j === q.correct ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(255,255,255,0.04)" }}>
                              {["A", "B", "C", "D"][j]}) {o}
                            </div>
                          ))}
                        </div>
                        {q.explanation && <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>💡 {q.explanation}</div>}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                        <button onClick={() => setEditingQ({ ...q, subjectId: currentSubject.id })}
                          style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600 }}>Edit</button>
                        <button onClick={() => handleDelete(currentSubject.id, q.id, q.question)}
                          style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600 }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: FORMAT GUIDE ── */}
        {tab === 2 && (
          <div>
            <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>📋 Question File Format</div>
                <div style={{ fontSize: 14, color: "#9ca3af" }}>Follow this format to upload questions via .txt file</div>
              </div>
              <div style={{ padding: 24 }}>
                {[
                  { icon: "1️⃣", title: "Start each question with Q:", desc: "The question text comes right after Q: on the same line." },
                  { icon: "2️⃣", title: "List options as A) B) C) D)", desc: "Each option on a new line. You can use A) or A. format." },
                  { icon: "3️⃣", title: "ANSWER: specifies correct option", desc: "Write ANSWER: B (the letter of the correct option)." },
                  { icon: "4️⃣", title: "EXPLANATION: is optional", desc: "Adds a learning note shown after the answer is revealed." },
                  { icon: "5️⃣", title: "Blank lines between questions", desc: "Separate each question with one or more blank lines." },
                ].map((r) => (
                  <div key={r.icon} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{r.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{r.title}</div>
                      <div style={{ fontSize: 13, color: "#9ca3af" }}>{r.desc}</div>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#3b82f6", marginBottom: 12, letterSpacing: "1px", fontFamily: "'Fira Code',monospace" }}>EXAMPLE FILE CONTENT:</div>
                  <pre style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20, fontSize: 13, color: "#9ca3af", fontFamily: "'Fira Code',monospace", lineHeight: 1.8, overflowX: "auto", whiteSpace: "pre-wrap" }}>{SAMPLE_TEXT_FORMAT}</pre>
                </div>

                <button onClick={() => {
                  const blob = new Blob([SAMPLE_TEXT_FORMAT], { type: "text/plain" });
                  const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
                  a.download = "sample_questions.txt"; a.click();
                }} style={{ ...btn("#3b82f6"), marginTop: 16 }}>⬇️ Download Sample .txt File</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── HELPERS ── */
function Label({ children }) {
  return <div style={{ fontSize: 13, fontWeight: 600, color: "#9ca3af", marginBottom: 8, letterSpacing: "0.3px" }}>{children}</div>;
}

const inputStyle = {
  width: "100%", background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10, padding: "11px 14px", color: "#eef0f8",
  fontFamily: "'Outfit', sans-serif", fontSize: 14, outline: "none",
  marginBottom: 16,
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical", lineHeight: 1.7,
};

function btn(bg) {
  return {
    padding: "10px 20px", borderRadius: 10, background: bg, color: "white",
    border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif",
    fontSize: 14, fontWeight: 600,
  };
}
