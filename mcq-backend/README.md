# MCQ App — Backend (Node.js + Express + MongoDB)

## 📁 Project Structure

```
mcq-backend/
├── src/
│   ├── server.js                  ← Entry point
│   ├── db/
│   │   └── connect.js             ← MongoDB connection
│   ├── models/
│   │   └── Subject.js             ← Mongoose schema (subjects + questions)
│   ├── controllers/
│   │   └── subjectController.js   ← All business logic
│   ├── routes/
│   │   └── subjects.js            ← REST API routes
│   ├── middleware/
│   │   └── errorHandler.js        ← 404 + error middleware
│   └── utils/
│       └── seed.js                ← Seed MongoDB with initial data
├── frontend-api-helper/
│   ├── api.js                     ← Drop into mcq-app/src/utils/
│   └── useQuestions.jsx           ← Drop into mcq-app/src/hooks/
├── .env
└── package.json
```

---

## 🚀 Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Configure .env
MONGO_URI=mongodb://localhost:27017/mcqapp
PORT=5000

# 3. Seed the database (first time only)
npm run seed

# 4. Start the server
npm run dev        # development (auto-reload)
npm start          # production
```

---

## 🔗 Connect Frontend

**Step 1** — Copy helper files into your React app:
```bash
cp frontend-api-helper/api.js         mcq-app/src/utils/api.js
cp frontend-api-helper/useQuestions.jsx  mcq-app/src/hooks/useQuestions.jsx
```

**Step 2** — Add `.env` to your React app (`mcq-app/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

### Subjects
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/subjects` | All subjects (no questions) |
| POST | `/api/subjects` | Create subject |
| GET | `/api/subjects/:id` | Subject + all questions |
| PUT | `/api/subjects/:id` | Update subject metadata |
| DELETE | `/api/subjects/:id` | Delete subject |

### Questions
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/subjects/:id/questions?page=1&limit=20` | Paginated questions |
| POST | `/api/subjects/:id/questions` | Add question(s) — send array |
| PUT | `/api/subjects/:id/questions/:qid` | Update one question |
| DELETE | `/api/subjects/:id/questions/:qid` | Delete one question |

### Search
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/subjects/search/questions?q=binary&subject=dsa` | Search questions |

---

## 📦 Example Requests

### Add questions (bulk)
```json
POST /api/subjects/os/questions
[
  {
    "question": "What is a semaphore?",
    "options": ["A CPU register", "A synchronization tool", "A file type", "A memory block"],
    "correct": 1,
    "explanation": "Semaphores are used to control access to shared resources."
  }
]
```

### Create a new subject
```json
POST /api/subjects
{
  "id": "cn",
  "name": "Computer Networks",
  "icon": "🌐",
  "color": "#3b82f6",
  "colorBg": "rgba(59,130,246,0.12)",
  "category": "systems",
  "badge": "NEW",
  "description": "OSI model, TCP/IP, routing, DNS, and HTTP.",
  "tags": ["OSI", "TCP/IP", "DNS", "HTTP"]
}
```
