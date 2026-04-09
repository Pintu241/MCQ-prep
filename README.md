# CS MCQ Prep Platform 🧠

A comprehensive **GATE-aligned MCQ practice platform** for Computer Science students, inspired by [Sanfoundry](https://www.sanfoundry.com/). Built with React, Node.js, Express, and MongoDB.

---

## 🚀 Features

- 📚 **12 Core CS Subjects** — DSA, OS, DBMS, Networks, COA, TOC, Compiler Design, Discrete Math, OOP, Software Engineering, C Programming, AI
- 🗂️ **GATE Syllabus Chapters** — Each subject is organized by official GATE chapters with importance tags (Most Asked / Important / Moderate)
- 📖 **Study Mode** — Scrollable question cards with clickable options, instant correct/wrong feedback, and explanations
- ⏱️ **Test Mode** — Timed quiz mode with one question at a time and result summary
- 🔐 **User Authentication** — JWT-based login & signup with password hashing (bcrypt)
- 💾 **Score Tracking** — Quiz scores saved per user to MongoDB
- 🔒 **Protected Practice** — Home page is public; login required to start practicing

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, Vanilla CSS       |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB (Mongoose ODM)            |
| Auth      | JWT (jsonwebtoken) + bcryptjs     |
| Fonts     | Outfit, Fira Code (Google Fonts)  |

---

## 📁 Project Structure

```
CS Quize/
├── mcq-app/          # React frontend (Vite)
│   └── src/
│       ├── pages/    # HomePage, SubjectPage, StudyPage, QuizPage, AuthPage, AdminPage
│       ├── hooks/    # useAuth, useQuestions
│       └── App.jsx
│
└── mcq-backend/      # Node.js + Express backend
    └── src/
        ├── models/       # User.js, Subject.js
        ├── controllers/  # auth.js, subjects.js
        ├── routes/       # auth.js, subjects.js
        ├── middleware/   # auth.js (JWT), errorHandler.js
        ├── utils/        # seed.js, token.js
        ├── scripts/      # import scripts
        └── server.js
```

---

## ⚙️ Setup & Running

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd "CS Quize"
```

### 2. Backend setup
```bash
cd mcq-backend
npm install
```

Create a `.env` file in `mcq-backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mcqapp
JWT_SECRET=your_secret_key_here
```

```bash
npm run dev
# Server runs at http://localhost:5000
```

### 3. Frontend setup
```bash
cd mcq-app
npm install
npm run dev
# App runs at http://localhost:5173
```

---

## 🌐 API Endpoints

| Method | Endpoint                  | Auth     | Description         |
|--------|---------------------------|----------|---------------------|
| GET    | `/api/subjects`           | Public   | Get all subjects    |
| GET    | `/api/subjects/:id`       | Public   | Get subject details |
| POST   | `/api/auth/register`      | Public   | Sign up             |
| POST   | `/api/auth/login`         | Public   | Sign in             |
| GET    | `/api/auth/me`            | Bearer   | Get current user    |
| POST   | `/api/auth/save-score`    | Bearer   | Save quiz score     |

---

## 📊 Subjects Covered

| Subject              | Chapters | GATE Marks | Questions |
|----------------------|----------|------------|-----------|
| Data Structures & Algorithms | 10 | 8–12 | 50+ |
| Operating Systems    | 8        | 6–10       | 112+      |
| DBMS                 | 8        | 6–8        | 30+       |
| Computer Networks    | 8        | 5–8        | 30+       |
| Computer Organization| 8        | 7–10       | 30+       |
| Theory of Computation| 7        | 6–9        | 30+       |
| Compiler Design      | 8        | 4–6        | 10+       |
| Discrete Mathematics | 8        | 8–11       | 10+       |
| OOP                  | 7        | 4–6        | 10+       |
| Software Engineering | 6        | 3–5        | 10+       |
| C Programming        | 8        | 4–6        | 10+       |
| Artificial Intelligence | 8    | 4–6        | 10+       |

---

## 📝 License

MIT — free to use and modify.
