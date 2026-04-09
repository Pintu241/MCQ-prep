import Subject from "../models/Subject.js";

// ─── GET all subjects (no questions, just metadata) ───────────────────────────
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().select("-questions").lean();
    const withCount = subjects.map((s) => ({
      ...s,
      questionCount: 0, // questions not loaded here
    }));
    // Need count — use aggregate
    const counts = await Subject.aggregate([
      { $project: { id: 1, questionCount: { $size: "$questions" } } },
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.questionCount]));
    const result = subjects.map((s) => ({
      ...s,
      questionCount: countMap[String(s._id)] ?? 0,
    }));
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET one subject WITH all questions ───────────────────────────────────────
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findOne({ id: req.params.id });
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found" });
    res.json({ success: true, data: subject });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CREATE a new subject ─────────────────────────────────────────────────────
export const createSubject = async (req, res) => {
  try {
    const exists = await Subject.findOne({ id: req.body.id });
    if (exists) return res.status(400).json({ success: false, message: "Subject ID already exists" });
    const subject = await Subject.create(req.body);
    res.status(201).json({ success: true, data: subject });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── UPDATE subject metadata ──────────────────────────────────────────────────
export const updateSubject = async (req, res) => {
  try {
    const { questions, ...meta } = req.body; // don't allow questions update here
    const subject = await Subject.findOneAndUpdate(
      { id: req.params.id },
      { $set: meta },
      { new: true, runValidators: true }
    );
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found" });
    res.json({ success: true, data: subject });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── DELETE a subject ─────────────────────────────────────────────────────────
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({ id: req.params.id });
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found" });
    res.json({ success: true, message: "Subject deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET questions for a subject ─────────────────────────────────────────────
export const getQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const subject = await Subject.findOne({ id: req.params.id });
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found" });

    const total = subject.questions.length;
    const start = (page - 1) * limit;
    const paginated = subject.questions.slice(start, start + Number(limit));

    res.json({
      success: true,
      data: paginated,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ADD questions to a subject ──────────────────────────────────────────────
export const addQuestions = async (req, res) => {
  try {
    const newQuestions = Array.isArray(req.body) ? req.body : [req.body];
    const subject = await Subject.findOneAndUpdate(
      { id: req.params.id },
      { $push: { questions: { $each: newQuestions } } },
      { new: true, runValidators: true }
    );
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found" });
    res.status(201).json({
      success: true,
      message: `${newQuestions.length} question(s) added`,
      data: subject.questions.slice(-newQuestions.length),
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── UPDATE a single question ─────────────────────────────────────────────────
export const updateQuestion = async (req, res) => {
  try {
    const subject = await Subject.findOne({ id: req.params.id });
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found" });

    const question = subject.questions.id(req.params.qid);
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });

    Object.assign(question, req.body);
    await subject.save();
    res.json({ success: true, data: question });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── DELETE a single question ─────────────────────────────────────────────────
export const deleteQuestion = async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { id: req.params.id },
      { $pull: { questions: { _id: req.params.qid } } },
      { new: true }
    );
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found" });
    res.json({ success: true, message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── SEARCH questions across all subjects ────────────────────────────────────
export const searchQuestions = async (req, res) => {
  try {
    const { q, subject: subjectId } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Query param 'q' required" });

    const filter = subjectId ? { id: subjectId } : {};
    const subjects = await Subject.find(filter);

    const regex = new RegExp(q, "i");
    const results = [];
    subjects.forEach((s) => {
      s.questions.forEach((question) => {
        if (regex.test(question.question) || question.options.some((o) => regex.test(o))) {
          results.push({ subjectId: s.id, subjectName: s.name, ...question.toObject() });
        }
      });
    });

    res.json({ success: true, total: results.length, data: results.slice(0, 50) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
