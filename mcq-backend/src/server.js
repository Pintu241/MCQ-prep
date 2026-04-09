import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./db/connect.js";
import subjectRoutes from "./routes/subjects.js";
import authRoutes from "./routes/auth.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: "*" })); // change origin in production
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ success: true, message: "MCQ App API is running 🚀" });
});

// ── Routes ────────────────────────────────────────────────────
app.use("/api/subjects", subjectRoutes);
app.use("/api/auth", authRoutes);

// ── Error handlers ────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📡 API base: http://localhost:${PORT}/api`);
  });
});
