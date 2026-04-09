import { useState } from "react";
import { QuestionsProvider } from "./hooks/useQuestions";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import SubjectPage from "./pages/SubjectPage";
import StudyPage from "./pages/StudyPage";
import QuizPage from "./pages/QuizPage";
import AdminPage from "./pages/AdminPage";

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [page, setPage] = useState("home");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [pendingSubject, setPendingSubject] = useState(null);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#07090f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", color: "#9ca3af" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🧠</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (page === "auth") {
    return <AuthPage onBack={() => setPage("home")} />;
  }

  const goHome = () => { setPage("home"); setSelectedSubject(null); setSelectedChapter(null); };
  const goSubject = () => { setPage("subject"); setSelectedChapter(null); };

  const handleSelectSubject = (subject) => {
    if (!user) {
      setPendingSubject(subject);
      setPage("auth");
      return;
    }
    setSelectedSubject(subject);
    setPage("subject");
  };

  // After login — redirect to pending subject
  if (user && pendingSubject) {
    setSelectedSubject(pendingSubject);
    setPendingSubject(null);
    setPage("subject");
  }

  return (
    <QuestionsProvider>
      {page === "home" && (
        <HomePage
          user={user}
          onLogout={logout}
          onSelectSubject={handleSelectSubject}
          onAdminClick={() => setPage("admin")}
          onLoginClick={() => setPage("auth")}
        />
      )}
      {page === "subject" && selectedSubject && (
        <SubjectPage
          subject={selectedSubject}
          onBack={goHome}
          onStartChapter={(subject, chapter) => {
            setSelectedSubject(subject);
            setSelectedChapter(chapter);
            setPage("study"); // → study page (scrollable cards)
          }}
          onStartAll={() => {
            setSelectedChapter(null);
            setPage("study"); // → all questions in study mode
          }}
          onStartTest={(subject, chapter) => {
            setSelectedSubject(subject);
            setSelectedChapter(chapter || null);
            setPage("quiz"); // → timed quiz mode
          }}
        />
      )}
      {page === "study" && selectedSubject && (
        <StudyPage
          subject={selectedSubject}
          chapter={selectedChapter}
          onBack={goSubject}
        />
      )}
      {page === "quiz" && selectedSubject && (
        <QuizPage
          subject={selectedSubject}
          chapter={selectedChapter}
          onBack={goSubject}
        />
      )}
      {page === "admin" && (
        <AdminPage onBack={goHome} />
      )}
    </QuestionsProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        select option { background: #111827; color: #eef0f8; }
        input::placeholder { color: #6b7280; }
        input:focus { border-color: rgba(59,130,246,0.5) !important; outline: none; }
        textarea::placeholder { color: #6b7280; }
      `}</style>
      <AppContent />
    </AuthProvider>
  );
}
