# MCQ-prep

A **GATE-aligned MCQ practice platform** for Computer Science students, built with **React**, **Node.js**, **Express**, and **MongoDB**.

This repository also includes **DevOps examples** for Docker, Kubernetes, Terraform, GitHub Actions, Jenkins, and Prometheus monitoring.

---

## 🚀 What’s Included

- 📚 Practice questions for core CS subjects
- 🧠 Study mode with instant feedback and explanations
- ⏱️ Quiz mode with score tracking
- 🔐 JWT auth with signup/login
- 💾 User score persistence in MongoDB
- 🗂️ Admin backend routes for managing subjects and questions
- 🐳 Docker + docker-compose local stack
- ☁️ AWS deployment examples via GitHub Actions and Jenkins
- 🧱 Infrastructure examples in `terraform/`
- ☸️ Kubernetes manifests in `kubernetes/`
- 📈 Monitoring skeleton in `monitoring/`

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite                    |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB (Mongoose)                |
| Auth      | JWT + bcryptjs                    |
| CI/CD     | GitHub Actions + Jenkins examples |
| Deployment| Docker, AWS, Terraform, Kubernetes|

---

## 📁 Repository Layout

- `.github/workflows/` — GitHub Actions deployment pipeline
- `docker/` — Dockerfiles and `docker-compose.yml`
- `jenkins/` — Jenkins pipeline example
- `kubernetes/` — Kubernetes manifests for frontend/backend
- `monitoring/` — Prometheus monitoring configuration
- `terraform/` — AWS infrastructure examples
- `mcq-app/` — React frontend
- `mcq-backend/` — Express backend
- `DEPLOYMENT_GUIDE.md` — deployment and DevOps instructions
- `.env.example` — environment variable examples

---

## ⚙️ Quick Start

### Prerequisites
- Node.js v18+
- npm
- MongoDB (local or Atlas)
- Docker (optional for local stack)

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd MCQ-prep
```

### 2. Start the backend

```bash
cd mcq-backend
npm install
```

Copy `.env.example` to `mcq-backend/.env` and update values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mcqapp
JWT_SECRET=your_secret_key_here
```

Start the backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Start the frontend

```bash
cd ../mcq-app
npm install
```

Set the API base URL and start Vite:

PowerShell:
```powershell
$env:VITE_API_BASE="http://localhost:5000/api"; npm run dev
```

Linux/macOS:
```bash
VITE_API_BASE="http://localhost:5000/api" npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 🐳 Run Locally with Docker

The repository includes a local Docker stack in `docker/docker-compose.yml`.

```bash
cd MCQ-prep
docker compose -f docker/docker-compose.yml up --build
```

Then visit `http://localhost:3000`.

> The root `.env` file is used by Docker Compose for backend secrets and ports.

---

## 📦 Deployment & DevOps

This repository includes deployment support and examples in:

- `DEPLOYMENT_GUIDE.md`
- `.github/workflows/deploy.yml`
- `jenkins/Jenkinsfile`
- `terraform/`
- `kubernetes/`
- `monitoring/`

Read `DEPLOYMENT_GUIDE.md` for details on AWS, Terraform, Docker, and CI/CD setup.

---

## 🌐 API Endpoints

| Method | Endpoint                            | Auth     | Description                         |
|--------|-------------------------------------|----------|-------------------------------------|
| GET    | `/api/subjects`                     | Public   | Get all subjects                    |
| GET    | `/api/subjects/:id`                 | Public   | Get subject details and questions   |
| GET    | `/api/subjects/:id/questions`       | Public   | Get paginated questions for a subject |
| GET    | `/api/subjects/search/questions?q=...` | Public | Search questions                    |
| POST   | `/api/subjects`                     | Admin    | Create a new subject                |
| PUT    | `/api/subjects/:id`                 | Admin    | Update subject metadata             |
| DELETE | `/api/subjects/:id`                 | Admin    | Delete a subject                    |
| POST   | `/api/subjects/:id/questions`       | Admin    | Add questions to a subject          |
| PUT    | `/api/subjects/:id/questions/:qid`  | Admin    | Update a question                   |
| DELETE | `/api/subjects/:id/questions/:qid`  | Admin    | Delete a question                   |
| POST   | `/api/auth/register`                | Public   | Sign up                             |
| POST   | `/api/auth/login`                   | Public   | Sign in                             |
| GET    | `/api/auth/me`                      | Bearer   | Get authenticated user profile      |
| POST   | `/api/auth/save-score`              | Bearer   | Save a quiz score                   |

---

## 📚 Subjects Covered

| Subject                | Topics Covered | Notes |
|------------------------|----------------|-------|
| Data Structures & Algorithms | Core algorithms, trees, graphs, sorting, hashing | GATE-style practice |
| Operating Systems      | Processes, threads, memory, file systems, scheduling | Exam-focused |
| DBMS                   | SQL, normalization, transactions, indexing | Practical practice |
| Computer Networks      | Protocols, TCP/IP, routing, LAN/WAN | Networking fundamentals |
| Computer Organization  | Architecture, CPU, memory, pipelining | Hardware concepts |
| Theory of Computation  | Automata, grammars, computability | Formal theory |
| Compiler Design        | Lexing, parsing, code generation | Compiler pipeline |
| Discrete Mathematics   | Logic, sets, relations, combinatorics | Reasoning skills |
| OOP                    | Classes, polymorphism, design | Object-oriented design |
| Software Engineering   | SDLC, testing, metrics | Software process basics |
| C Programming          | Pointers, arrays, memory, syntax | C fundamentals |
| Artificial Intelligence| Search, learning, reasoning | AI concepts |

---

## 🧩 How It Works

- The frontend lives in `mcq-app/` and is built with React + Vite.
- The backend lives in `mcq-backend/` and is built with Express.js and MongoDB.
- The frontend fetches data from backend API routes under `/api/`.
- User accounts, quiz scores, subjects, and questions are stored in MongoDB.
- You can run the backend and frontend separately for development, or use Docker Compose for a complete local stack.

---

## 📥 Download & Run

To download the repository:

```bash
git clone <your-repo-url>
cd MCQ-prep
```

Then follow these options:

1. Run locally without Docker:
   - `cd mcq-backend && npm install && npm run dev`
   - open a second terminal: `cd mcq-app && npm install && npm run dev`
   - set `VITE_API_BASE` to `http://localhost:5000/api` before starting the frontend.

2. Run with Docker Compose:
   - `docker compose -f docker/docker-compose.yml up --build`
   - visit `http://localhost:3000`

For deployment and more advanced setup, see `DEPLOYMENT_GUIDE.md`.

---

