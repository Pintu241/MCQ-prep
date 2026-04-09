import express from "express";
import { register, login, getMe, saveScore } from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/save-score", protect, saveScore);

export default router;
