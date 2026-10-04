import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export function isGeminiConnected(): boolean {
  return !!aiClient;
}

export interface PlanGenerationInput {
  projectName: string;
  description: string;
  language?: string;
  difficulty?: string;
  requirements?: string;
}

export interface ProjectPlan {
  overview: {
    problem: string;
    solution: string;
    objective: string;
  };
  techStack: Array<{
    technology: string;
    purpose: string;
    explanation?: string;
    whyAppropriate?: string;
  }>;
  components: Array<{
    name: string;
    description: string;
    purpose?: string;
    responsibilities?: string[];
    relationships?: string;
  }>;
  phases: Array<{
    name: string;
    description: string;
    steps: Array<{
      id: string;
      title: string;
      description: string;
      whyNeeded?: string;
      concepts: string[];
      instructions?: string[];
      deliverable: string;
      estimatedTime: string;
    }>;
  }>;
}

export interface DebugResponse {
  problem: string;
  cause: string;
  solution: string;
  nextAction: string;
}

// Fallback project plan generator for demo mode or API failures
export function getFallbackProjectPlan(input: PlanGenerationInput): ProjectPlan {
  const name = input.projectName || 'Full-Stack Web Application';
  const lang = input.language || 'TypeScript / JavaScript';
  const diff = input.difficulty || 'Intermediate';
  const desc = input.description || 'A modern web application built with clean architecture.';

  // Build a realistic customized plan
  return {
    overview: {
      problem: `Students and teams building "${name}" frequently face challenges organizing system components, understanding how ${lang} services talk to databases, and structuring the build order logically without hitting architectural roadblocks.`,
      solution: `SkillBridge creates an end-to-end engineered blueprint for "${name}" using ${lang}, dividing the project into modular layers: authentication, persistent data models, RESTful endpoints, and an intuitive reactive frontend interface.`,
      objective: `To design, implement, test, and deploy a robust working prototype of "${name}" while mastering core architectural principles, error debugging, and software development lifecycle practices.`
    },
    techStack: [
      {
        technology: lang.includes('Python') ? 'FastAPI / Python' : 'Node.js & Express',
        purpose: 'Backend API Server',
        explanation: 'Handles incoming HTTP requests, orchestrates business logic, and exposes RESTful endpoints.',
        whyAppropriate: 'Provides lightweight asynchronous I/O, rapid prototyping capabilities, and extensive library support for student projects.'
      },
      {
        technology: 'React & TypeScript',
        purpose: 'Frontend Client',
        explanation: 'Provides component-based declarative UI with compile-time type safety.',
        whyAppropriate: 'Ensures predictable state management, rapid re-rendering, and eliminates common runtime null-pointer bugs.'
      },
      {
        technology: 'SQLite / Better-SQLite3',
        purpose: 'Relational Database',
        explanation: 'Serverless zero-configuration embedded SQL engine providing relational consistency and ACID transactions.',
        whyAppropriate: 'Ideal for local development and academic lab submissions because it requires no separate database daemon or cloud credentials.'
      },
      {
        technology: 'Tailwind CSS',
        purpose: 'UI Styling System',
        explanation: 'Utility-first CSS framework enabling rapid styling directly in markup.',
        whyAppropriate: 'Enforces consistent design tokens (colors, spacing, typography) without messy external stylesheets.'
      },
      {
        technology: 'Google Gemini AI',
        purpose: 'Intelligence Layer',
        explanation: 'LLM integration for contextual query processing, content synthesis, or recommendations.',
        whyAppropriate: 'Offers state-of-the-art developer SDKs, structured JSON output mode, and high response velocities.'
      }
    ],
    components: [
      {
        name: 'Authentication & Session Module',
        description: 'Manages user registration, credential verification, and secure token issuance.',
        purpose: 'Protects user data and ensures authenticated requests carry valid credentials.',
        responsibilities: [
          'Hash user passwords using bcrypt before saving to the database',
          'Issue signed JWT tokens upon verified login',
          'Validate authorization Bearer headers on protected API routes'
        ],
        relationships: 'Interacts with the User Database table and acts as an authentication guard for all protected project endpoints.'
      },
      {
        name: 'Core Domain Controller & Services',
        description: `Coordinates the core business logic of "${name}", handling data transformation and validation.`,
        purpose: 'Separates routing concerns from pure business logic rules.',
        responsibilities: [
          'Sanitize and validate incoming payload requests',
          'Execute relational queries against the database layer',
          'Format and serialize structured JSON responses'
        ],
        relationships: 'Invoked by Express route handlers; coordinates with both the Database layer and external AI services.'
      },
      {
        name: 'Data Access & Persistence Layer',
        description: 'Defines schema migrations, foreign keys, and typed query execution helpers.',
        purpose: 'Provides reliable storage for entities, user activities, and state transitions.',
        responsibilities: [
          'Maintain referential integrity with cascading deletes',
          'Execute parameterized prepared statements to prevent SQL injection',
          'Seed initial mock data for immediate testing'
        ],
        relationships: 'Underpins all service modules; directly reads and writes to the local SQLite database file.'
      },
      {
        name: 'Responsive Client Application',
        description: 'Interactive React single-page application communicating with the backend over REST.',
        purpose: 'Allows students to interact with the project features intuitively across desktop and mobile.',
        responsibilities: [
          'Maintain global client state (authenticated user, active views, notifications)',
          'Provide clear loading spinners, empty states, and validation banners',
          'Communicate asynchronously with the backend via fetch APIs'
        ],
        relationships: 'Consumes backend REST APIs and renders domain data to the end user.'
      }
    ],
    phases: [
      {
        name: 'Phase 1 — Project Foundation & Architecture',
        description: 'Set up the development environment, tooling, database schema, and project scaffold.',
        steps: [
          {
            id: 'step-1',
            title: 'Set up Environment and Project Repository',
            description: 'Scaffold the full-stack repository structure with both client and server directories, configuration files, and scripts.',
            whyNeeded: 'A well-structured repository prevents file clutter, guarantees reproducible builds, and makes the project easy to explain in a technical viva.',
            concepts: ['Monorepo vs multi-folder structure', 'Package management & lockfiles', 'Environment variables (.env) isolation'],
            instructions: [
              'Initialize package.json with dependencies (express, sqlite, react, typescript, tailwindcss)',
              'Configure tsconfig.json and vite.config.ts for path aliases and bundler rules',
              'Create .env.example with placeholders for port and secret keys'
            ],
            deliverable: 'A clean, runnable boilerplate with development scripts configured.',
            estimatedTime: '45 mins'
          },
          {
            id: 'step-2',
            title: 'Design and Initialize SQLite Database Schema',
            description: 'Draft the relational schema with primary keys, foreign keys, indexes, and connection wrappers.',
            whyNeeded: 'Solidifying your database tables first gives clarity on entity attributes and prevents painful data model refactors later.',
            concepts: ['Entity Relationship (ER) modeling', 'SQL Data types & Constraints', 'Prepared Statements for SQL injection prevention'],
            instructions: [
              'Write SQL DDL statements for users, core items, and activity logs',
              'Implement a reusable database client with connection pooling or synchronous handle',
              'Create a migration script that executes automatically on server startup'
            ],
            deliverable: 'A working database file initialized with normalized tables and foreign keys.',
            estimatedTime: '1 hour'
          },
          {
            id: 'step-3',
            title: 'Implement User Authentication & JWT Middleware',
            description: 'Build registration, login, password hashing, and token verification middleware.',
            whyNeeded: 'Security should be established early so subsequent domain endpoints can be tested with real user ownership.',
            concepts: ['Cryptographic salting & hashing (bcrypt)', 'Stateless JWT tokens', 'Express middleware pipeline'],
            instructions: [
              'Write POST /api/auth/register with input validation and duplicate email checks',
              'Write POST /api/auth/login to verify hashed credentials and return a signed JWT',
              'Build an authMiddleware function that verifies Authorization Bearer headers'
            ],
            deliverable: 'Working auth endpoints returning JWT tokens and protecting private routes.',
            estimatedTime: '1.5 hours'
          }
        ]
      },
      {
        name: 'Phase 2 — Backend Core & Domain Services',
        description: 'Implement the REST API endpoints, business logic validations, and AI service integrations.',
        steps: [
          {
            id: 'step-4',
            title: 'Build Core CRUD REST API Endpoints',
            description: 'Implement REST routes for creating, reading, updating, and deleting project entities.',
            whyNeeded: 'REST conventions provide a standardized, predictable protocol for your frontend to interact with backend resources.',
            concepts: ['HTTP methods (GET, POST, PUT, DELETE)', 'Status codes (200, 201, 400, 404, 500)', 'Input sanitization'],
            instructions: [
              'Create router files separating auth, resources, and utility endpoints',
              'Validate request bodies and return clear, descriptive error payloads',
              'Query the database using parameterized queries and return formatted JSON'
            ],
            deliverable: 'Tested REST endpoints verified with sample JSON payloads.',
            estimatedTime: '2 hours'
          },
          {
            id: 'step-5',
            title: 'Integrate External Services & AI Model Pipeline',
            description: 'Connect server-side Gemini SDK or external APIs with defensive fallback handling.',
            whyNeeded: 'Real-world software must gracefully handle API rate limits, timeouts, and missing credentials without crashing.',
            concepts: ['Server-side SDK integration', 'Graceful degradation / fallback pattern', 'Streaming and JSON structured responses'],
            instructions: [
              'Initialize the AI SDK on the server using environment secrets',
              'Add prompt templates with system instructions and JSON schemas',
              'Wrap AI calls in try/catch blocks with sensible fallback mock responses'
            ],
            deliverable: 'A resilient AI service returning structured data with 100% uptime in demo mode.',
            estimatedTime: '1.5 hours'
          }
        ]
      },
      {
        name: 'Phase 3 — Frontend UI & Reactive State',
        description: 'Construct the user interface, routing, forms, responsive layouts, and API service layer.',
        steps: [
          {
            id: 'step-6',
            title: 'Construct App Layout & Routing Architecture',
            description: 'Implement client-side navigation, responsive headers, sidebar layouts, and protected route wrappers.',
            whyNeeded: 'A clean modular layout provides a consistent navigation shell and prevents unauthenticated users from accessing private views.',
            concepts: ['Single Page Application (SPA) routing', 'Component composition', 'Protected route guards in React'],
            instructions: [
              'Configure React Router with Landing, Auth, Dashboard, and Workspace views',
              'Build reusable layout components (Navbar, Sidebar, Footer, Breadcrumbs)',
              'Create an AuthContext to preserve user session and token in local storage'
            ],
            deliverable: 'A navigable client application with smooth route transitions and auth guards.',
            estimatedTime: '1.5 hours'
          },
          {
            id: 'step-7',
            title: 'Build Interactive Workspace & Feature Views',
            description: 'Develop rich component views allowing users to inspect roadmaps, execute actions, and see live progress.',
            whyNeeded: 'The workspace is the heart of your project where users spend 90% of their time interacting with the product.',
            concepts: ['Optimistic UI updates', 'State lifting and custom hooks', 'Asynchronous data fetching & error boundaries'],
            instructions: [
              'Create view tabs for Overview, Architecture, Tech Stack, Roadmap, and Assistant',
              'Implement step completion toggles that calculate progress dynamically',
              'Add visual progress bars and status badges'
            ],
            deliverable: 'A rich responsive workspace with real-time progress indicators.',
            estimatedTime: '2 hours'
          }
        ]
      },
      {
        name: 'Phase 4 — Testing, Debugging & Viva Preparation',
        description: 'Perform end-to-end integration tests, polish error states, and prepare architectural defense questions.',
        steps: [
          {
            id: 'step-8',
            title: 'End-to-End Integration & Edge-Case Testing',
            description: 'Test all critical user journeys from registration to project completion under normal and failure conditions.',
            whyNeeded: 'Verifying edge cases (empty states, invalid inputs, network drops) guarantees your submission will not break during live viva evaluations.',
            concepts: ['Defensive programming', 'HTTP error handling patterns', 'User experience state matrix (Loading, Error, Empty, Success)'],
            instructions: [
              'Test registration with duplicate email and weak passwords',
              'Verify that marking steps updates overall progress percentage accurately',
              'Ensure all forms display clean validation messages rather than unhandled promise rejections'
            ],
            deliverable: 'A bug-free, fully responsive application ready for demonstration.',
            estimatedTime: '1 hour'
          }
        ]
      }
    ]
  };
}

export async function generateProjectPlan(input: PlanGenerationInput): Promise<ProjectPlan> {
  if (!aiClient) {
    return getFallbackProjectPlan(input);
  }

  const prompt = `You are the lead architect and curriculum engineer of SkillBridge, an educational engineering platform.
A student wants to build the following project:
Project Name: ${input.projectName}
Description: ${input.description}
Preferred Language/Tech: ${input.language || 'Any standard stack'}
Difficulty: ${input.difficulty || 'Intermediate'}
Special Requirements: ${input.requirements || 'None'}

Generate a comprehensive, highly educational, structured project plan designed to guide the student from start to finish.
The response must be valid JSON matching this schema:
{
  "overview": {
    "problem": "Explain the specific problem this project solves in 2-3 clear sentences.",
    "solution": "Explain how the proposed application solves the problem in 2-3 sentences.",
    "objective": "Summarize the tangible end-goal and learning outcomes."
  },
  "techStack": [
    {
      "technology": "Name of library or tool",
      "purpose": "Role (e.g. Frontend, Backend, Database, Auth)",
      "explanation": "Clear 1-2 sentence explanation of what it is",
      "whyAppropriate": "Why it is appropriate specifically for this project"
    }
  ],
  "components": [
    {
      "name": "Component or Module Name",
      "description": "High level description",
      "purpose": "Why this module exists",
      "responsibilities": ["List 2-4 concrete responsibilities"],
      "relationships": "How it talks to other components (e.g. 'Receives requests from UI, queries DB')"
    }
  ],
  "phases": [
    {
      "name": "Phase Name (e.g. Phase 1 — Project Foundation)",
      "description": "Short phase summary",
      "steps": [
        {
          "id": "step-1",
          "title": "Clear actionable step title",
          "description": "What are you building in this step?",
          "whyNeeded": "Why is this step conceptually needed before proceeding?",
          "concepts": ["Concept 1", "Concept 2", "Concept 3"],
          "instructions": ["Step by step task 1", "Task 2", "Task 3"],
          "deliverable": "Expected result when completed",
          "estimatedTime": "e.g. 45 mins"
        }
      ]
    }
  ]
}

Ensure the steps are ordered logically in 3-4 phases (Foundations, Backend/Data, Frontend/UI, Integration/Testing).
Make the explanations conceptually rich and beginner-friendly. Respond with pure JSON only.`;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    const cleanJson = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleanJson);

    // Ensure step IDs are guaranteed
    let stepCount = 1;
    if (parsed.phases && Array.isArray(parsed.phases)) {
      for (const phase of parsed.phases) {
        if (phase.steps && Array.isArray(phase.steps)) {
          for (const step of phase.steps) {
            if (!step.id) {
              step.id = `step-${stepCount}`;
            }
            stepCount++;
          }
        }
      }
    }

    return parsed as ProjectPlan;
  } catch (err) {
    console.warn('Gemini generatePlan failed, using fallback:', err);
    return getFallbackProjectPlan(input);
  }
}

export async function askMentor(params: {
  projectId: string;
  message: string;
  currentStep?: string;
  projectContext?: string;
  projectName?: string;
  conversationHistory?: Array<{ role: string; message: string }>;
}): Promise<string> {
  const { message, currentStep, projectContext, projectName } = params;

  if (!aiClient) {
    return generateFallbackMentorResponse(message, currentStep, projectName);
  }

  const systemInstruction = `You are the SkillBridge AI Mentor.
Your mission is to help students learn by building real-world projects.
Key rules:
1. Explain concepts simply and clearly.
2. Structure your answers concisely with:
   - 1. Explanation
   - 2. Why it matters conceptually
   - 3. Concrete next action or code snippet
3. Avoid unnecessarily long answers. Focus on student comprehension, not tutorial copy-pasting.
4. Adapt to the student's project context and current step.`;

  const contextPrompt = `Project: ${projectName || 'Student Project'}
Current Step: ${currentStep || 'General Implementation'}
Context Details: ${projectContext || 'Building full-stack features'}

Student Question:
"${message}"`;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contextPrompt,
      config: {
        systemInstruction,
      },
    });

    return response.text?.trim() || generateFallbackMentorResponse(message, currentStep, projectName);
  } catch (err) {
    console.warn('Gemini mentor call failed, using fallback:', err);
    return generateFallbackMentorResponse(message, currentStep, projectName);
  }
}

function generateFallbackMentorResponse(message: string, currentStep?: string, projectName?: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('step') || lower.includes('what should i do') || lower.includes('next')) {
    return `### 1. Explanation
For **${currentStep || 'the current implementation step'}**, the primary objective is to turn the conceptual requirement into a concrete, testable unit of code.

### 2. Why it matters
Breaking your project down into atomic milestones prevents debugging headaches. When each step has an isolated deliverable (such as a database schema or a single REST endpoint), you can verify it immediately before moving to dependent modules.

### 3. What to do next
1. Review the inputs and outputs needed for this step.
2. Write the minimal logic required to satisfy the deliverable.
3. Verify the result using a quick curl/fetch request or UI test.
4. Mark this step complete to update your overall roadmap progress!`;
  }

  if (lower.includes('why') || lower.includes('react') || lower.includes('node') || lower.includes('database')) {
    return `### 1. Explanation
In modern full-stack development, dividing responsibilities between a declarative UI (React) and a lightweight REST API (Node/Express with SQLite) decouples presentation from data persistence.

### 2. Why it matters
This separation of concerns means your database logic and security policies live protected on the server, while the client focuses purely on user experience, instant feedback, and responsiveness.

### 3. What to do next
Verify that your client never accesses database files directly. Instead, invoke a backend endpoint via standard HTTP fetch with JSON payloads.`;
  }

  if (lower.includes('error') || lower.includes('bug') || lower.includes('fail') || lower.includes('fix')) {
    return `### 1. Explanation
Errors during development usually stem from one of three areas: missing environmental variables, unhandled async promises, or mismatched JSON property names between client and server.

### 2. Why it matters
Understanding error stack traces is the single most valuable engineering skill. Look at the exact file and line number where the execution broke.

### 3. What to do next
Check the SkillBridge **Debug Assistant** tab on the left! Paste your error message and code snippet there to get an automated root-cause analysis and suggested fix.`;
  }

  return `### 1. Explanation
Great question regarding ${projectName ? `"${projectName}"` : 'your project'}! Building real software is an iterative cycle of planning, testing, and refining your mental model.

### 2. Why it matters
When you understand *why* a particular pattern or technology is selected, you are not just memorizing syntax—you are learning to think like a software architect.

### 3. What to do next
Take this one step at a time. Write down the expected input and output, implement the smallest working version, and let me know if you run into any specific stumbling blocks.`;
}

export async function debugCode(params: {
  errorMessage: string;
  code?: string;
  currentStep?: string;
  projectContext?: string;
}): Promise<DebugResponse> {
  const { errorMessage, code, currentStep, projectContext } = params;

  if (!aiClient) {
    return generateFallbackDebug(errorMessage, code, currentStep);
  }

  const prompt = `You are the SkillBridge Debugging Assistant.
Analyze this error encountered by a student:
Current Step: ${currentStep || 'Not specified'}
Project Context: ${projectContext || 'Not specified'}

Error Message:
"""
${errorMessage}
"""

Code / Problem Description:
"""
${code || 'No code provided'}
"""

Identify:
1. What happened (clear description of the problem)
2. Why it happened (the conceptual and technical root cause)
3. How to fix it (concrete step-by-step solution and code fix)
4. What to do next (validation test to verify the fix)

Respond strictly with valid JSON matching this schema:
{
  "problem": "Clear 1-2 sentence description of what failed",
  "cause": "The root cause explaining why this error occurred",
  "solution": "Clear instructions and corrected code explaining how to fix it",
  "nextAction": "What the student should do next to verify the fix works"
}`;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    const cleanJson = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    return JSON.parse(cleanJson) as DebugResponse;
  } catch (err) {
    console.warn('Gemini debug call failed, using fallback:', err);
    return generateFallbackDebug(errorMessage, code, currentStep);
  }
}

function generateFallbackDebug(errorMessage: string, code?: string, currentStep?: string): DebugResponse {
  const lowerErr = (errorMessage + ' ' + (code || '')).toLowerCase();

  if (lowerErr.includes('cannot read properties of undefined') || lowerErr.includes('null') || lowerErr.includes('undefined')) {
    return {
      problem: 'A runtime TypeError occurred because the code attempted to access a property on an object that evaluates to undefined or null.',
      cause: 'The state or API response has not finished loading when the component rendered, or an expected JSON field was omitted in the backend response.',
      solution: `1. Use optional chaining (e.g. \`data?.item?.name\` instead of \`data.item.name\`).
2. Add a loading guard: \`if (!data) return <LoadingSpinner />;\` before rendering children.
3. Provide default initial values for React state: \`useState<Item[]>([]);\` instead of \`useState();\`.`,
      nextAction: 'Check your network tab to verify the API response format, and add optional chaining (?.) on the offending line.'
    };
  }

  if (lowerErr.includes('cors') || lowerErr.includes('networkerror') || lowerErr.includes('failed to fetch')) {
    return {
      problem: 'The client fetch request failed because the server could not be reached or blocked Cross-Origin Resource Sharing.',
      cause: 'Either the backend server is not running on the expected port, or Express is missing CORS middleware headers.',
      solution: `1. Ensure your backend server is active and listening on the designated PORT.
2. In your Express setup, verify that appropriate CORS headers or reverse-proxy routing is enabled.
3. Use relative paths like \`/api/projects\` when using Vite dev proxy.`,
      nextAction: 'Verify the server console logs to ensure the Express process is running without unhandled errors.'
    };
  }

  if (lowerErr.includes('sql') || lowerErr.includes('sqlite') || lowerErr.includes('table') || lowerErr.includes('syntax')) {
    return {
      problem: 'Database operation failed due to a SQL execution error or schema constraint violation.',
      cause: 'The query referenced an invalid column name, violated a UNIQUE or NOT NULL constraint, or had a missing table.',
      solution: `1. Verify table creation statements in your database initialization file.
2. Ensure all parameterized values match the placeholder count: \`db.prepare("INSERT INTO table (a, b) VALUES (?, ?)").run(valA, valB)\`.
3. Check foreign key constraints to ensure the parent entity exists before inserting a child record.`,
      nextAction: 'Inspect the database initialization script and test the query directly using prepared statements.'
    };
  }

  return {
    problem: `Error detected during ${currentStep || 'execution'}: "${errorMessage.slice(0, 100)}..."`,
    cause: 'The runtime encountered an unhandled exception or assertion failure in the application logic.',
    solution: `1. Inspect the stack trace to locate the exact file and line number.
2. Wrap the suspect block in a try/catch handler or check preconditions before invoking functions.
3. Validate that all required parameters and environment variables are defined.`,
    nextAction: 'Apply the defensive checks, restart the development server, and re-test the action.'
  };
}
