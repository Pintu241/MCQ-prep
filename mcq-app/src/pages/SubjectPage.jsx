import { useState, useEffect } from "react";
import { useQuestions } from "../hooks/useQuestions";

// GATE metadata per subject
const GATE_META = {
  dsa: { marks: "8–12", weightage: "~18%", chapters: [
    { name: "Arrays & Strings", tag: "Most Asked" },
    { name: "Linked Lists", tag: "Important" },
    { name: "Stack & Queue", tag: "Most Asked" },
    { name: "Trees & BST", tag: "Most Asked" },
    { name: "Graphs", tag: "Most Asked" },
    { name: "Sorting & Searching", tag: "Most Asked" },
    { name: "Hashing", tag: "Important" },
    { name: "Dynamic Programming", tag: "Most Asked" },
    { name: "Greedy Algorithms", tag: "Moderate" },
    { name: "Recursion & Backtracking", tag: "Moderate" },
  ]},
  os: { marks: "6–10", weightage: "~12%", chapters: [
    { name: "Process Management", tag: "Most Asked" },
    { name: "CPU Scheduling", tag: "Most Asked" },
    { name: "Process Synchronization", tag: "Most Asked" },
    { name: "Deadlocks", tag: "Important" },
    { name: "Memory Management", tag: "Most Asked" },
    { name: "File Systems", tag: "Moderate" },
    { name: "Disk Scheduling", tag: "Important" },
    { name: "I/O Systems & Protection", tag: "Moderate" },
  ]},
  dbms: { marks: "6–8", weightage: "~10%", chapters: [
    { name: "Relational Model & SQL", tag: "Most Asked" },
    { name: "Normalization", tag: "Most Asked" },
    { name: "Transactions & ACID", tag: "Most Asked" },
    { name: "Indexing & Hashing", tag: "Important" },
    { name: "ER Model", tag: "Important" },
    { name: "Query Optimization", tag: "Moderate" },
    { name: "Concurrency Control", tag: "Important" },
    { name: "Relational Algebra", tag: "Moderate" },
  ]},
  networks: { marks: "5–8", weightage: "~10%", chapters: [
    { name: "OSI Model & Layers", tag: "Most Asked" },
    { name: "TCP/IP & UDP", tag: "Most Asked" },
    { name: "IP Addressing & Subnetting", tag: "Most Asked" },
    { name: "Routing Algorithms", tag: "Important" },
    { name: "Data Link Layer", tag: "Important" },
    { name: "DNS & DHCP", tag: "Moderate" },
    { name: "Application Layer Protocols", tag: "Moderate" },
    { name: "Network Security", tag: "Moderate" },
  ]},
  coa: { marks: "7–10", weightage: "~12%", chapters: [
    { name: "Number Systems & Codes", tag: "Important" },
    { name: "Boolean Algebra & Gates", tag: "Most Asked" },
    { name: "Combinational Circuits", tag: "Important" },
    { name: "Sequential Circuits", tag: "Important" },
    { name: "CPU Organization", tag: "Most Asked" },
    { name: "Pipelining", tag: "Most Asked" },
    { name: "Memory Hierarchy & Cache", tag: "Most Asked" },
    { name: "I/O Organization", tag: "Moderate" },
  ]},
  toc: { marks: "6–9", weightage: "~11%", chapters: [
    { name: "Finite Automata (DFA/NFA)", tag: "Most Asked" },
    { name: "Regular Languages & Grammars", tag: "Most Asked" },
    { name: "Context-Free Languages", tag: "Most Asked" },
    { name: "Pushdown Automata", tag: "Important" },
    { name: "Turing Machines", tag: "Important" },
    { name: "Decidability", tag: "Important" },
    { name: "Complexity Theory (P/NP)", tag: "Moderate" },
  ]},
  compiler: { marks: "4–6", weightage: "~7%", chapters: [
    { name: "Lexical Analysis", tag: "Most Asked" },
    { name: "Syntax Analysis (Parsing)", tag: "Most Asked" },
    { name: "LL & LR Parsers", tag: "Most Asked" },
    { name: "Syntax-Directed Translation", tag: "Important" },
    { name: "Semantic Analysis", tag: "Important" },
    { name: "Intermediate Code Generation", tag: "Moderate" },
    { name: "Code Optimization", tag: "Moderate" },
    { name: "Code Generation", tag: "Moderate" },
  ]},
  "discrete-math": { marks: "8–11", weightage: "~13%", chapters: [
    { name: "Mathematical Logic", tag: "Most Asked" },
    { name: "Set Theory", tag: "Most Asked" },
    { name: "Relations & Functions", tag: "Most Asked" },
    { name: "Graph Theory", tag: "Most Asked" },
    { name: "Combinatorics & Counting", tag: "Important" },
    { name: "Probability", tag: "Important" },
    { name: "Linear Algebra", tag: "Moderate" },
    { name: "Calculus", tag: "Moderate" },
  ]},
  oop: { marks: "4–6", weightage: "~6%", chapters: [
    { name: "OOP Fundamentals", tag: "Most Asked" },
    { name: "Classes & Objects", tag: "Most Asked" },
    { name: "Inheritance", tag: "Most Asked" },
    { name: "Polymorphism", tag: "Important" },
    { name: "Encapsulation & Abstraction", tag: "Important" },
    { name: "Design Patterns", tag: "Moderate" },
    { name: "SOLID Principles", tag: "Moderate" },
  ]},
  "software-eng": { marks: "3–5", weightage: "~5%", chapters: [
    { name: "SDLC Models", tag: "Most Asked" },
    { name: "Agile & Scrum", tag: "Most Asked" },
    { name: "Software Testing", tag: "Most Asked" },
    { name: "Software Design", tag: "Important" },
    { name: "Project Management", tag: "Moderate" },
    { name: "Version Control & DevOps", tag: "Moderate" },
  ]},
  devops: { marks: "3–5", weightage: "~5%", chapters: [
    { name: "CI/CD Pipelines", tag: "Most Asked" },
    { name: "Containers & Docker", tag: "Most Asked" },
    { name: "Infrastructure as Code", tag: "Important" },
    { name: "Kubernetes & Orchestration", tag: "Important" },
    { name: "Monitoring & Logging", tag: "Moderate" },
    { name: "Cloud Platforms", tag: "Moderate" },
    { name: "Security & Compliance", tag: "Moderate" },
    { name: "Automation & SRE", tag: "Moderate" },
  ]},
  "c-programming": { marks: "4–6", weightage: "~7%", chapters: [
    { name: "Basics & Data Types", tag: "Most Asked" },
    { name: "Control Flow", tag: "Most Asked" },
    { name: "Functions & Recursion", tag: "Most Asked" },
    { name: "Pointers", tag: "Most Asked" },
    { name: "Arrays & Strings", tag: "Important" },
    { name: "Structs & Unions", tag: "Important" },
    { name: "Memory Management", tag: "Important" },
    { name: "File I/O", tag: "Moderate" },
  ]},
  ai: { marks: "4–6", weightage: "~7%", chapters: [
    { name: "Search Algorithms", tag: "Most Asked" },
    { name: "A* & Heuristics", tag: "Most Asked" },
    { name: "Knowledge Representation", tag: "Important" },
    { name: "Machine Learning Basics", tag: "Most Asked" },
    { name: "Neural Networks", tag: "Important" },
    { name: "Supervised Learning", tag: "Most Asked" },
    { name: "Unsupervised Learning", tag: "Moderate" },
    { name: "Reinforcement Learning", tag: "Moderate" },
  ]},
};

const TAG_STYLES = {
  "Most Asked": { bg: "rgba(239,68,68,0.12)", color: "#f87171", border: "rgba(239,68,68,0.25)" },
  "Important":  { bg: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "rgba(245,158,11,0.25)" },
  "Moderate":   { bg: "rgba(16,185,129,0.12)", color: "#34d399", border: "rgba(16,185,129,0.25)" },
};

export default function SubjectPage({ subject: initialSubject, onBack, onStartChapter, onStartAll, onStartTest }) {
  const { subjects, loadSubjectQuestions } = useQuestions();
  const subject = subjects.find((s) => s.id === initialSubject.id) || initialSubject;
  const [loading, setLoading] = useState(!subject.questions);

  useEffect(() => {
    if (!subject.questions) {
      loadSubjectQuestions(subject.id).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [subject.id, subject.questions, loadSubjectQuestions]);

  const meta = GATE_META[subject.id] || { marks: "—", weightage: "—", chapters: [] };
  const { color, colorBg } = subject;

  // Count questions per topic (mapped to chapter names as best effort by matching)
  const questionsArr = subject.questions || [];
  const chapterCounts = {};
  questionsArr.forEach((q) => {
    const t = q.topic || "General";
    chapterCounts[t] = (chapterCounts[t] || 0) + 1;
  });

  // For each GATE chapter, find matching question count (partial match)
  function getCount(chapterName) {
    let total = 0;
    for (const [topic, cnt] of Object.entries(chapterCounts)) {
      if (chapterName.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(chapterName.toLowerCase().split(" ")[0])) {
        total += cnt;
      }
    }
    return total;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#07090f", fontFamily: "'Outfit', sans-serif", color: "#eef0f8" }}>
      {/* NAV */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: 60,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(7,9,15,0.97)", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 14, fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
          ← All Subjects
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{subject.icon}</span>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{subject.name}</span>
        </div>
        <button onClick={onStartAll} style={{ padding: "7px 16px", borderRadius: 8, background: color, color: "white", border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600 }}>
          ▶ Full Test
        </button>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>

        {/* SUBJECT HEADER */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, color, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Fira Code', monospace", marginBottom: 8 }}>
            GATE CS Syllabus
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{subject.name}</h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>{subject.description}</p>
        </div>

        {/* GATE STATS BAR */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 1, background: "rgba(255,255,255,0.05)", borderRadius: 14,
          overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 32,
        }}>
          {[
            { val: meta.chapters.length, label: "Chapters" },
            { val: meta.marks, label: "Marks in GATE" },
            { val: meta.weightage, label: "Weightage" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "20px 16px", textAlign: "center", background: "#0d1117" }}>
              <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Fira Code', monospace", color: "#eef0f8" }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CHAPTER LIST */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>Loading...</div>
        ) : (
          <div>
            <div style={{ fontSize: 11, color: "#6b7280", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Fira Code', monospace", marginBottom: 14 }}>
              {meta.chapters.length} Chapters
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {meta.chapters.map((ch, i) => {
                const tagStyle = TAG_STYLES[ch.tag] || TAG_STYLES["Moderate"];
                const qCount = getCount(ch.name);

                return (
                  <ChapterRow
                    key={ch.name}
                    index={i + 1}
                    chapter={ch.name}
                    tag={ch.tag}
                    tagStyle={tagStyle}
                    qCount={qCount}
                    color={color}
                    colorBg={colorBg}
                    onStudy={() => onStartChapter(subject, ch.name)}
                    onTest={() => onStartTest && onStartTest(subject, ch.name)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <button onClick={onStartAll} style={{
            padding: "14px", borderRadius: 12,
            background: `linear-gradient(135deg, ${color}, #06b6d4)`,
            color: "white", border: "none", cursor: "pointer",
            fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700,
          }}>
            📖 Study All Questions
          </button>
          {onStartTest && (
            <button onClick={() => onStartTest(subject, null)} style={{
              padding: "14px", borderRadius: 12,
              background: "rgba(255,255,255,0.05)",
              color: "#eef0f8", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
              fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700,
            }}>
              ⏱ Timed Test Mode
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ChapterRow({ index, chapter, tag, tagStyle, qCount, color, colorBg, onStudy, onTest }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 18px", borderRadius: 12,
        background: hovered ? "#111827" : "transparent",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`,
        transition: "all 0.15s",
      }}
    >
      {/* Number */}
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: hovered ? colorBg : "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? color + "30" : "transparent"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700, fontFamily: "'Fira Code', monospace",
        color: hovered ? color : "#6b7280", transition: "all 0.15s",
      }}>
        {String(index).padStart(2, "0")}
      </div>

      {/* Name + count */}
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: hovered ? "#eef0f8" : "#d1d5db" }}>{chapter}</span>
        {qCount > 0 && (
          <span style={{ marginLeft: 8, fontSize: 11, color: "#4b5563", fontFamily: "'Fira Code',monospace" }}>
            {qCount}Q
          </span>
        )}
      </div>

      {/* GATE Tag */}
      <div style={{
        padding: "3px 10px", borderRadius: 20,
        background: tagStyle.bg, color: tagStyle.color,
        border: `1px solid ${tagStyle.border}`,
        fontSize: 11, fontWeight: 600, flexShrink: 0,
      }}>
        {tag}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button onClick={onStudy} style={{
          padding: "5px 11px", borderRadius: 7, fontSize: 12, fontWeight: 600,
          background: `${color}20`, color, border: `1px solid ${color}30`,
          cursor: "pointer", fontFamily: "'Outfit',sans-serif",
        }}>Study</button>
        {onTest && (
          <button onClick={onTest} style={{
            padding: "5px 11px", borderRadius: 7, fontSize: 12, fontWeight: 600,
            background: "rgba(255,255,255,0.05)", color: "#9ca3af",
            border: "1px solid rgba(255,255,255,0.1)",
            cursor: "pointer", fontFamily: "'Outfit',sans-serif",
          }}>Test</button>
        )}
      </div>
    </div>
  );
}
