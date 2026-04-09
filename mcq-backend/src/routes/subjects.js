import { Router } from "express";
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getQuestions,
  addQuestions,
  updateQuestion,
  deleteQuestion,
  searchQuestions,
} from "../controllers/subjectController.js";

const router = Router();

// ── Subject routes ────────────────────────────────────────────
// GET  /api/subjects              → all subjects (no questions)
// POST /api/subjects              → create subject
// GET  /api/subjects/:id          → one subject + all questions
// PUT  /api/subjects/:id          → update subject metadata
// DEL  /api/subjects/:id          → delete subject

router.get("/", getAllSubjects);
router.post("/", createSubject);
router.get("/:id", getSubjectById);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

// ── Question routes ───────────────────────────────────────────
// GET  /api/subjects/:id/questions            → paginated questions
// POST /api/subjects/:id/questions            → add question(s)
// PUT  /api/subjects/:id/questions/:qid       → update one question
// DEL  /api/subjects/:id/questions/:qid       → delete one question

router.get("/:id/questions", getQuestions);
router.post("/:id/questions", addQuestions);
router.put("/:id/questions/:qid", updateQuestion);
router.delete("/:id/questions/:qid", deleteQuestion);

// ── Search ────────────────────────────────────────────────────
// GET  /api/subjects/search?q=binary+search&subject=dsa
router.get("/search/questions", searchQuestions);

export default router;
