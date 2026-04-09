import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    options: { type: [String], required: true, validate: (v) => v.length >= 2 },
    correct: { type: Number, required: true, min: 0 },
    explanation: { type: String, default: "" },
    topic: { type: String, default: "General" },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
  },
  { timestamps: true }
);

const subjectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: "📚" },
    color: { type: String, default: "#6366f1" },
    colorBg: { type: String, default: "rgba(99,102,241,0.12)" },
    category: {
      type: String,
      enum: ["core", "programming", "systems", "theory", "math", "web"],
      default: "core",
    },
    badge: { type: String, default: "" },
    description: { type: String, default: "" },
    tags: { type: [String], default: [] },
    questions: [questionSchema],
  },
  { timestamps: true }
);

// Virtual: question count
subjectSchema.virtual("questionCount").get(function () {
  return this.questions.length;
});

subjectSchema.set("toJSON", { virtuals: true });

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
