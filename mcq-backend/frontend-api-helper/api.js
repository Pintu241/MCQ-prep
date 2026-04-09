// ─── api.js — drop this in mcq-app/src/utils/api.js ─────────────────────────
// Replace the localStorage-based useQuestions.jsx with this API-connected version

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API error");
  return data;
}

// ── Subjects ──────────────────────────────────────────────────
export const api = {
  // Get all subjects (no questions — just metadata + count)
  getSubjects: () => request("/subjects"),

  // Get one subject with all questions
  getSubject: (id) => request(`/subjects/${id}`),

  // Create a new subject
  createSubject: (body) => request("/subjects", { method: "POST", body: JSON.stringify(body) }),

  // Update subject metadata
  updateSubject: (id, body) => request(`/subjects/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  // Delete a subject
  deleteSubject: (id) => request(`/subjects/${id}`, { method: "DELETE" }),

  // Get paginated questions
  getQuestions: (id, page = 1, limit = 20) =>
    request(`/subjects/${id}/questions?page=${page}&limit=${limit}`),

  // Add one or many questions (pass array)
  addQuestions: (id, questions) =>
    request(`/subjects/${id}/questions`, { method: "POST", body: JSON.stringify(questions) }),

  // Update one question
  updateQuestion: (subjectId, questionId, body) =>
    request(`/subjects/${subjectId}/questions/${questionId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  // Delete one question
  deleteQuestion: (subjectId, questionId) =>
    request(`/subjects/${subjectId}/questions/${questionId}`, { method: "DELETE" }),

  // Search questions
  search: (q, subjectId = "") =>
    request(`/subjects/search/questions?q=${encodeURIComponent(q)}${subjectId ? `&subject=${subjectId}` : ""}`),
};
