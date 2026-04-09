# 🧠 MCQPrep — CS Fundamentals

A full-featured MCQ preparation website built with **React + Vite**.
Inspired by Sanfoundry, with an AI-powered quiz engine and a built-in Admin Panel.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

---

## 📁 Project Structure

```
mcq-app/
├── src/
│   ├── data/
│   │   └── questions.js          ← Default questions for all subjects
│   ├── hooks/
│   │   └── useQuestions.jsx      ← Global state (Context API + localStorage)
│   ├── pages/
│   │   ├── HomePage.jsx          ← Subject listing, search, filter
│   │   ├── QuizPage.jsx          ← Quiz with timer, options, explanation
│   │   └── AdminPage.jsx         ← Upload, edit, delete questions
│   ├── utils/
│   │   └── parseQuestions.js     ← Text file parser
│   ├── App.jsx                   ← Page router
│   └── main.jsx                  ← Entry point
├── sample_questions.txt          ← Sample upload file
├── index.html
├── package.json
└── vite.config.js
```

---

## 🔐 Admin Panel Guide

Click **"Admin Panel"** button (top-right on homepage) to access.

### ─── Tab 1: Upload Questions ───

**Method A — Upload .txt File:**
1. Click the file drop zone (or drag & drop a .txt file)
2. Select your question file
3. Click **"Parse & Preview Questions"**
4. Review parsed questions
5. Click **"Import All"** to add to the selected subject

**Method B — Paste Text Directly:**
1. Paste questions in the text area
2. Same steps as above

---

### ─── Question File Format ───

Create a `.txt` file with this exact format:

```
Q: What is the time complexity of binary search?
A) O(n)
B) O(log n)
C) O(n log n)
D) O(1)
ANSWER: B
EXPLANATION: Binary search halves the search space each step.

Q: Next question here?
A) Option 1
B) Option 2
C) Option 3
D) Option 4
ANSWER: A
EXPLANATION: Optional explanation text.
```

**Rules:**
| Field | Required | Format |
|-------|----------|--------|
| `Q:` | ✅ Yes | Question text on same line |
| `A) B) C) D)` | ✅ Yes | One option per line (2–4 options) |
| `ANSWER:` | ✅ Yes | Letter of correct option (A/B/C/D) |
| `EXPLANATION:` | ❌ Optional | One-line explanation |

---

### ─── Tab 2: Edit Questions ───

- Select a subject from the dropdown
- All questions are listed with their options
- Click **Edit** to open an edit modal — modify question, options, correct answer, explanation
- Click **Delete** to remove a question (with confirmation)

---

## 💾 Data Persistence

All questions are saved in **localStorage** automatically.
- Changes survive page refresh
- Click **"Reset to Default"** in Admin Panel to restore original questions
- To permanently change defaults, edit `src/data/questions.js`

---

## ➕ Adding a New Subject

Edit `src/data/questions.js` and add a new object to the `initialSubjects` array:

```js
{
  id: "ml",                          // unique ID (no spaces)
  name: "Machine Learning",          // display name
  icon: "🤖",                        // emoji icon
  color: "#10b981",                  // accent color (hex)
  colorBg: "rgba(16,185,129,0.12)", // light bg version
  category: "core",                  // core | programming | systems | theory
  badge: "NEW",                      // HOT | NEW | TOP | "" (empty for none)
  description: "Supervised learning, neural networks, and model evaluation.",
  tags: ["Regression", "Neural Nets", "SVM", "Clustering"],
  questions: [
    {
      id: 1,
      question: "Which algorithm is used for classification and regression?",
      options: ["K-Means", "Decision Tree", "PCA", "DBSCAN"],
      correct: 1,          // 0-based index
      explanation: "Decision Trees can handle both classification and regression tasks.",
    },
  ],
}
```

---

## 🏗️ Build for Production

```bash
npm run build
# Output in: dist/
```

Deploy `dist/` to any static host: **Netlify**, **Vercel**, **GitHub Pages**, or your own server.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI components |
| Vite | Dev server & bundler |
| Context API | Global state management |
| localStorage | Data persistence |
| Google Fonts | Outfit + Fira Code |
| Native CSS | Styling (no UI library) |
