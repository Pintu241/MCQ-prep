const API_BASE = "http://localhost:5000/api";

export async function fetchSubjects() {
  const res = await fetch(`${API_BASE}/subjects`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function fetchSubjectQuestions(id) {
  const res = await fetch(`${API_BASE}/subjects/${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function createQuestions(subjectId, questions) {
  const res = await fetch(`${API_BASE}/subjects/${subjectId}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(questions),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function editQuestion(subjectId, questionId, updated) {
  const res = await fetch(`${API_BASE}/subjects/${subjectId}/questions/${questionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function removeQuestion(subjectId, questionId) {
  const res = await fetch(`${API_BASE}/subjects/${subjectId}/questions/${questionId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}
