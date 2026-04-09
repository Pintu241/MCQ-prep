import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as api from "../utils/api";

const QuestionsContext = createContext(null);

export function QuestionsProvider({ children }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSubjects = useCallback(async () => {
    try {
      const data = await api.fetchSubjects();
      setSubjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const loadSubjectQuestions = useCallback(async (id) => {
    const data = await api.fetchSubjectQuestions(id);
    setSubjects((prev) => prev.map((s) => (s.id === id ? data : s)));
    return data;
  }, []);

  const addQuestionsToSubject = async (subjectId, newQuestions) => {
    await api.createQuestions(subjectId, newQuestions);
    await loadSubjectQuestions(subjectId);
    await loadSubjects();
  };

  const updateQuestion = async (subjectId, questionId, updated) => {
    await api.editQuestion(subjectId, questionId, updated);
    await loadSubjectQuestions(subjectId);
  };

  const deleteQuestion = async (subjectId, questionId) => {
    await api.removeQuestion(subjectId, questionId);
    await loadSubjectQuestions(subjectId);
    await loadSubjects();
  };

  const resetToDefault = () => {
    console.warn("Reset to default is handled by backend seeding directly, unsupported via frontend currently.");
  };

  return (
    <QuestionsContext.Provider
      value={{
        subjects,
        loading,
        loadSubjects,
        loadSubjectQuestions,
        addQuestionsToSubject,
        updateQuestion,
        deleteQuestion,
        resetToDefault,
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
}

export function useQuestions() {
  return useContext(QuestionsContext);
}
