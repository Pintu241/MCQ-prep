import User from "../models/User.js";
import { generateToken } from "../utils/token.js";

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required." });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ success: false, message: "Email already registered." });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me  (protected)
export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: { _id: req.user._id, name: req.user.name, email: req.user.email, scores: req.user.scores },
  });
};

// POST /api/auth/save-score  (protected)
export const saveScore = async (req, res) => {
  try {
    const { subjectId, subjectName, chapter, score, total } = req.body;
    const pct = Math.round((score / total) * 100);

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        scores: {
          $each: [{ subjectId, subjectName, chapter: chapter || "Full Test", score, total, pct }],
          $position: 0,
          $slice: 50, // keep last 50 results
        },
      },
    });

    res.json({ success: true, message: "Score saved." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
