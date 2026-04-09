// ─── Drop this file into mcq-app/src/hooks/useQuestions.jsx ──────────────────
// Replaces the localStorage version — now uses the MongoDB backend API

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";

const QuestionsContext = createContext(null);

export function QuestionsProvider({ children }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all subjects on mount
  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getSubjects();
      setSubjects(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

  // Load full subject with questions when user picks one
  const loadSubjectWithQuestions = async (id) => {
    const res = await api.getSubject(id);
    return res.data;
  };

  // Add questions to a subject (accepts array)
  const addQuestionsToSubject = async (subjectId, newQuestions) => {
    await api.addQuestions(subjectId, newQuestions);
    await fetchSubjects(); // refresh counts
  };

  // Update one question
  const updateQuestion = async (subjectId, questionId, updated) => {
    await api.updateQuestion(subjectId, questionId, updated);
  };

  // Delete one question
  const deleteQuestion = async (subjectId, questionId) => {
    await api.deleteQuestion(subjectId, questionId);
  };

  // Reset to default — re-seed from backend (just reload)
  const resetToDefault = async () => {
    await fetchSubjects();
  };

  return (
    <QuestionsContext.Provider
      value={{
        subjects,
        loading,
        error,
        loadSubjectWithQuestions,
        addQuestionsToSubject,
        updateQuestion,
        deleteQuestion,
        resetToDefault,
        refetch: fetchSubjects,
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
}

export function useQuestions() {
  return useContext(QuestionsContext);
}
