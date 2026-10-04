# SkillBridge — AI-Powered Project Learning and Development Platform

> **Tagline:** *From Project Idea to Working Project — While Understanding What You Build.*  
> **Prototype Context:** EDVC Venture Prototype & Full Stack Development (FSD) Lab Project.

---

## 1. Project Overview
**SkillBridge** is an AI-powered project learning and development platform engineered to help students and software learners build real-world applications while deeply understanding the concepts, architectural decisions, and code behind them.

Rather than merely generating boilerplate code or copying tutorials, SkillBridge acts as a full-stack engineering mentor that breaks down high-level project ideas into structured system designs, recommends appropriate technology stacks with pedagogical rationale, maps out sequential roadmaps, and provides contextual mentoring and root-cause debugging throughout the build process.

---

## 2. Problem Statement
Students frequently have creative software project ideas but struggle with critical engineering hurdles:
- **Technology Selection Paralysis:** Confusion over which libraries or frameworks to select and why.
- **Decomposition Difficulty:** Inability to break a complex idea into atomic, testable components.
- **Dependency Misunderstanding:** Lack of clarity on how components interface (e.g., REST controllers talking to relational databases).
- **Sequencing Roadblocks:** Not knowing which layers should be implemented first (schema before API before UI).
- **Blind Copy-Pasting:** Copying tutorials without understanding the underlying concepts, leading to failure in technical viva examinations.
- **Debugging Frustration:** Struggling to decipher stack traces, runtime errors, and asynchronous promises.

---

## 3. Proposed Solution
SkillBridge moves students from:  
`"I copied this project from a tutorial or AI."`  
to:  
`"I understand what I built and I can build it myself."`

It provides:
1. **Automated Architectural Planning:** Converts raw ideas into structured specifications (Problem, Solution, Objective, System Components, and Roadmaps).
2. **Contextual AI Mentoring:** Formulates answers using the strict three-part educational structure: *1. Explanation*, *2. Why it matters*, and *3. Concrete next action*.
3. **Root-Cause Debugging Assistant:** Analyzes error messages and code snippets to teach students *what happened*, *why it happened*, and *how to fix it*.
4. **Milestone Progress Tracking:** Measures real completion using atomic task milestones saved in a local relational database.

---

## 4. Key Features
- **Project Concept Ingestion:** Accepts project name, problem description, preferred programming languages, and difficulty.
- **AI Architectural Plan Generation:** Produces structured JSON blueprints with system components, technology rationales, and phase-by-phase steps.
- **System Architecture Visualizer:** Dynamically generates visual component interaction diagrams reflecting the project's actual plan.
- **Interactive Implementation Roadmap:** Breaks projects into manageable phases with estimated time, concepts to learn, and practical tasks.
- **Step Learning Experience:** Explains *What are you building?*, *Why is this needed?*, *What should you learn?*, and *Expected deliverable*.
- **One-Click Step Completion:** Dynamically calculates progress percentages and identifies the immediate next task.
- **Context-Aware AI Mentor:** Chat assistant retaining awareness of the student's active step, tech stack, and conversation history.
- **Educational Debugging Assistant:** Diagnoses errors with root-cause analysis and actionable fixes.
- **Full Offline Demo AI Mode:** Functions 100% reliably with intelligent fallback generators even when no Gemini API key is configured.
- **Built-in Sample Project:** One-click seeding of the *"AI Research Assistant"* project for demonstration.

---

## 5. User Flow
```text
Landing Page (/)
       ↓
Register / Login (/register, /login)
       ↓
Student Dashboard (/dashboard)
       ↓
Create Project Blueprint (/projects/new)
       ↓
AI Generates Architecture & Roadmap
       ↓
Project Development Workspace (/projects/:id)
   ├── Overview & Dynamic System Architecture Diagram
   ├── Tech Stack & Architectural Rationales
   ├── Component Decomposition & Data Contracts
   ├── Implementation Roadmap (Step-by-Step)
   ├── Step Learning Experience (Why, What, Concepts)
   ├── AI Mentor (Explanation → Why It Matters → Next Action)
   ├── Debug Assistant (What happened → Root Cause → Fix)
   └── Progress Analytics (Completed / Remaining / Phase Status)
       ↓
Student Completes Milestones & Prepares for Technical Viva
```

---

## 6. System Architecture
SkillBridge is built as a modular full-stack application:

```text
┌────────────────────────────────────────────────────────┐
│                   Web Browser Client                   │
│          React 19 + TypeScript + Tailwind CSS          │
│               React Router + Lucide Icons              │
└───────────────────────────▲────────────────────────────┘
                            │  JSON REST Requests / Bearer JWT
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Express API Server                   │
│                    (Node.js runtime)                   │
├────────────────────────────────────────────────────────┤
│  • Auth Middleware (JWT Verification & bcrypt hashing)  │
│  • Project Controllers (Plan generation & CRUD)        │
│  • Step Progress Manager (Atomic completion toggles)   │
│  • AI Orchestrator (@google/genai & Fallbacks)         │
└───────────────▲────────────────────────▲───────────────┘
                │                        │
                ▼                        ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│   SQLite Database Engine  │ │  Google Gemini 3.8 AI    │
│    (Persistent Local DB)  │ │   (Cloud LLM Service)    │
│  • users                  │ └──────────────────────────┘
│  • projects               │
│  • step_progress          │
│  • mentor_messages        │
└───────────────────────────┘
```

---

## 7. Technology Stack

### Frontend
- **React (v19):** Declarative, component-based user interface.
- **TypeScript:** Strict compile-time typing for state, props, and API payloads.
- **Vite:** High-performance bundler and dev server.
- **React Router (v7):** Client-side routing with protected route wrappers.
- **Tailwind CSS (v4):** Modern utility styling with custom design tokens.
- **Lucide React:** Consistent iconography for developer workspace elements.

### Backend
- **Node.js (v22):** Server runtime.
- **Express.js (v4):** Minimalist REST API routing and middleware pipeline.
- **jsonwebtoken (JWT):** Stateless bearer token authentication.
- **bcryptjs:** Cryptographic password hashing with salt rounds.

### Database
- **SQLite (node:sqlite / better-sqlite3):** Serverless, zero-configuration relational database with foreign keys and ACID compliance.

### Artificial Intelligence
- **Google Gemini API (`@google/genai` SDK):** Generates structured project plans, contextual mentor explanations, and error diagnoses using `gemini-3.8-flash`.
- **Intelligent Fallback Engine:** Resilient heuristic engine ensuring 100% uptime in demo mode.

---

## 8. Database Structure

### `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Unique user identifier |
| `name` | TEXT | NOT NULL | Student's full name |
| `email` | TEXT | UNIQUE, NOT NULL | Student login email |
| `password_hash` | TEXT | NOT NULL | Salted bcrypt hash |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Account creation time |

### `projects`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Unique project identifier |
| `user_id` | TEXT | NOT NULL, FK → users(id) | Project owner |
| `name` | TEXT | NOT NULL | Project title |
| `description` | TEXT | NOT NULL | Problem statement |
| `difficulty` | TEXT | | Beginner / Intermediate / Advanced |
| `language` | TEXT | | Programming language |
| `plan_json` | TEXT | NOT NULL | Full JSON blueprint |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last modified timestamp |

### `step_progress`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Progress entry ID |
| `project_id` | TEXT | NOT NULL, FK → projects(id) | Associated project |
| `step_id` | TEXT | NOT NULL | Milestone step ID |
| `completed` | INTEGER | DEFAULT 0 | 0 = Incomplete, 1 = Complete |
| `completed_at` | DATETIME | | Completion timestamp |

### `mentor_messages`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Message identifier |
| `project_id` | TEXT | NOT NULL, FK → projects(id) | Associated project |
| `role` | TEXT | NOT NULL | 'user' or 'assistant' |
| `message` | TEXT | NOT NULL | Chat message text |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Sent timestamp |

---

## 9. REST APIs

### Authentication
- `POST /api/auth/register` — Register a new student account.
- `POST /api/auth/login` — Authenticate and receive a JWT token.
- `GET /api/auth/me` — Retrieve the authenticated user profile.

### Projects
- `GET /api/projects` — List all projects owned by the user with progress statistics.
- `POST /api/projects` — Save a newly generated project plan to SQLite.
- `GET /api/projects/:id` — Retrieve a single project, plan JSON, and step progress.
- `PUT /api/projects/:id` — Update project metadata.
- `DELETE /api/projects/:id` — Delete project and cascade-delete child records.
- `POST /api/projects/generate-plan` — Generate an AI architecture plan.
- `PUT /api/projects/:id/steps/:stepId` — Toggle step completion status.
- `GET /api/projects/:id/progress` — Fetch detailed completion stats.
- `POST /api/projects/seed-demo` — Seed the "AI Research Assistant" sample project.

### AI Mentor & Debugging
- `GET /api/mentor/messages/:projectId` — Fetch conversation history.
- `POST /api/mentor/chat` — Chat with the context-aware mentor.
- `POST /api/debug` — Submit stack trace for root-cause diagnosis.
- `GET /api/status` — Inspect whether Gemini API is live or running in Demo Mode.

---

## 10. AI Integration & Prompt Engineering
SkillBridge interfaces with the official `@google/genai` TypeScript SDK:
1. **Structured Outputs:** Requests use `responseMimeType: "application/json"` with schema definitions to guarantee parseable output for plans and debugging.
2. **System Persona:** Mentors are instructed to deliver concise answers conforming to:  
   `1. Explanation` → `2. Why it matters` → `3. What to do next`.
3. **Security:** The Gemini API key is strictly accessed on the server via `process.env.GEMINI_API_KEY`. It is never bundled or sent to the browser.

---

## 11. Demo Mode
If `GEMINI_API_KEY` is not configured or an upstream network error occurs:
- Project plan generation uses a comprehensive, realistic architectural generator.
- AI Mentor answers using context-aware heuristics.
- Debugging Assistant provides educational root-cause analyses.
- The UI displays a non-blocking indicator:  
  *«Demo AI mode — connect Gemini API for live AI responses.»*
- The application will **never** crash or freeze due to missing API keys.

---

## 12. Installation & Running

### Prerequisites
- Node.js (version 20 or higher, version 22 recommended)
- npm or bun

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env
```
Edit `.env` (optional, for live AI mode):
```env
GEMINI_API_KEY="your-gemini-api-key-here"
JWT_SECRET="skillbridge_super_secret_jwt_key"
PORT=3000
```

### Step 3: Start the Application
Run in development mode:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### Step 4: Build for Production
```bash
npm run build
npm start
```

---

## 13. FSD Concepts Demonstrated
This project demonstrates key competencies evaluated in Full Stack Development (FSD) college curricula:
- **Frontend Architecture:** Component-based UI, client-side routing, protected auth wrappers, optimistic updates, and custom React hooks.
- **Backend Architecture:** RESTful API design, controller-service separation, middleware pipeline for authentication, and input sanitization.
- **Database Modeling:** Relational schema design, primary and foreign key constraints, cascading deletes, indexes, and parameterized prepared statements preventing SQL injection.
- **Security:** One-way password hashing using bcrypt with salt rounds, stateless JWT token issuance, and Bearer authorization headers.
- **AI Integration & Resilience:** Server-side LLM consumption with defensive programming and demo-mode fallbacks.

---

## 14. Future Enhancements
- Integration of an in-browser code editor (Monaco Editor) for live sandbox execution.
- GitHub repository export to automatically scaffold generated projects on GitHub.
- Mock viva examiner mode providing students with simulated oral defense questions.
