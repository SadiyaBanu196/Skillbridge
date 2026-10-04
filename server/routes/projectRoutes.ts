import { Router, Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../database/db.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { generateProjectPlan, ProjectPlan } from '../services/aiService.js';

const router = Router();

// Helper to calculate progress for a project
function calculateProjectProgress(planJson: string, completedStepIds: Set<string>) {
  try {
    const plan: ProjectPlan = JSON.parse(planJson);
    let totalSteps = 0;
    let completedSteps = 0;
    let firstIncompleteStep = null;

    if (plan.phases && Array.isArray(plan.phases)) {
      for (const phase of plan.phases) {
        if (phase.steps && Array.isArray(phase.steps)) {
          for (const step of phase.steps) {
            totalSteps++;
            if (completedStepIds.has(step.id)) {
              completedSteps++;
            } else if (!firstIncompleteStep) {
              firstIncompleteStep = {
                id: step.id,
                title: step.title,
                phaseName: phase.name,
              };
            }
          }
        }
      }
    }

    const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    return {
      totalSteps,
      completedSteps,
      percentage,
      isCompleted: totalSteps > 0 && completedSteps === totalSteps,
      currentStep: firstIncompleteStep || (totalSteps > 0 ? { id: 'done', title: 'All Steps Completed!', phaseName: 'Finished' } : null)
    };
  } catch (err) {
    return { totalSteps: 0, completedSteps: 0, percentage: 0, isCompleted: false, currentStep: null };
  }
}

// POST /api/projects/generate-plan
// Generates structured project plan using Gemini or Fallback
router.post('/generate-plan', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectName, description, language, difficulty, requirements } = req.body;

    if (!projectName || !description) {
      res.status(400).json({ error: 'Project name and description are required to generate a plan.' });
      return;
    }

    const plan = await generateProjectPlan({
      projectName: projectName.trim(),
      description: description.trim(),
      language: language?.trim(),
      difficulty: difficulty?.trim(),
      requirements: requirements?.trim(),
    });

    res.json({
      plan,
      isDemoMode: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY',
    });
  } catch (err: any) {
    console.error('Error generating project plan:', err);
    res.status(500).json({ error: 'Failed to generate project plan. Please try again.' });
  }
});

// GET /api/projects - list user's projects
router.get('/', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    const projects = db.prepare(`
      SELECT id, user_id, name, description, difficulty, language, plan_json, created_at, updated_at
      FROM projects
      WHERE user_id = ?
      ORDER BY updated_at DESC
    `).all(userId) as Array<{
      id: string;
      user_id: string;
      name: string;
      description: string;
      difficulty: string;
      language: string;
      plan_json: string;
      created_at: string;
      updated_at: string;
    }>;

    const enriched = projects.map(p => {
      // Get completed steps
      const completedRows = db.prepare(`
        SELECT step_id FROM step_progress WHERE project_id = ? AND completed = 1
      `).all(p.id) as Array<{ step_id: string }>;

      const completedSet = new Set(completedRows.map(r => r.step_id));
      const stats = calculateProjectProgress(p.plan_json, completedSet);

      let parsedPlan: ProjectPlan | null = null;
      try {
        parsedPlan = JSON.parse(p.plan_json);
      } catch (e) {
        // ignore
      }

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        difficulty: p.difficulty,
        language: p.language,
        techStack: parsedPlan?.techStack || [],
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        stats,
      };
    });

    res.json({ projects: enriched });
  } catch (err: any) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

// POST /api/projects - create new project with plan
router.post('/', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    const { name, description, difficulty, language, plan } = req.body;

    if (!name || !description || !plan) {
      res.status(400).json({ error: 'Project name, description, and generated plan are required.' });
      return;
    }

    const projectId = crypto.randomUUID();
    const planJson = typeof plan === 'string' ? plan : JSON.stringify(plan);

    db.prepare(`
      INSERT INTO projects (id, user_id, name, description, difficulty, language, plan_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      projectId,
      userId,
      name.trim(),
      description.trim(),
      difficulty || 'Intermediate',
      language || 'JavaScript / TypeScript',
      planJson
    );

    res.status(201).json({
      message: 'Project created successfully!',
      projectId,
    });
  } catch (err: any) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Failed to create project.' });
  }
});

// GET /api/projects/:id - single project details
router.get('/:id', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const project = db.prepare(`
      SELECT id, user_id, name, description, difficulty, language, plan_json, created_at, updated_at
      FROM projects
      WHERE id = ? AND user_id = ?
    `).get(id, userId) as {
      id: string;
      user_id: string;
      name: string;
      description: string;
      difficulty: string;
      language: string;
      plan_json: string;
      created_at: string;
      updated_at: string;
    } | undefined;

    if (!project) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    // Get all step progress entries
    const progressRows = db.prepare(`
      SELECT step_id, completed, completed_at FROM step_progress WHERE project_id = ?
    `).all(project.id) as Array<{ step_id: string; completed: number; completed_at: string }>;

    const progressMap: Record<string, { completed: boolean; completedAt: string | null }> = {};
    const completedSet = new Set<string>();

    for (const row of progressRows) {
      const isComp = Boolean(row.completed);
      progressMap[row.step_id] = {
        completed: isComp,
        completedAt: row.completed_at,
      };
      if (isComp) {
        completedSet.add(row.step_id);
      }
    }

    const plan: ProjectPlan = JSON.parse(project.plan_json);
    const stats = calculateProjectProgress(project.plan_json, completedSet);

    res.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        difficulty: project.difficulty,
        language: project.language,
        plan,
        progressMap,
        stats,
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      }
    });
  } catch (err: any) {
    console.error('Error fetching project details:', err);
    res.status(500).json({ error: 'Failed to retrieve project details.' });
  }
});

// PUT /api/projects/:id - update project
router.put('/:id', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { name, description, difficulty, language, plan } = req.body;

    const existing = db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?').get(id, userId);
    if (!existing) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    let planJsonUpdate = undefined;
    if (plan) {
      planJsonUpdate = typeof plan === 'string' ? plan : JSON.stringify(plan);
    }

    if (planJsonUpdate) {
      db.prepare(`
        UPDATE projects
        SET name = COALESCE(?, name),
            description = COALESCE(?, description),
            difficulty = COALESCE(?, difficulty),
            language = COALESCE(?, language),
            plan_json = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `).run(name, description, difficulty, language, planJsonUpdate, id, userId);
    } else {
      db.prepare(`
        UPDATE projects
        SET name = COALESCE(?, name),
            description = COALESCE(?, description),
            difficulty = COALESCE(?, difficulty),
            language = COALESCE(?, language),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `).run(name, description, difficulty, language, id, userId);
    }

    res.json({ message: 'Project updated successfully.' });
  } catch (err: any) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

// DELETE /api/projects/:id - delete project
router.delete('/:id', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const existing = db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?').get(id, userId);
    if (!existing) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    db.prepare('DELETE FROM projects WHERE id = ?').run(id);

    res.json({ message: 'Project deleted successfully.' });
  } catch (err: any) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

// PUT /api/projects/:id/steps/:stepId - mark step completed/uncompleted
router.put('/:id/steps/:stepId', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    const { id, stepId } = req.params;
    const { completed } = req.body;

    const project = db.prepare('SELECT id, plan_json FROM projects WHERE id = ? AND user_id = ?').get(id, userId) as {
      id: string;
      plan_json: string;
    } | undefined;

    if (!project) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    const isCompleted = completed !== undefined ? (completed ? 1 : 0) : 1;
    const completedAt = isCompleted ? new Date().toISOString() : null;

    // Upsert into step_progress
    const existing = db.prepare('SELECT id FROM step_progress WHERE project_id = ? AND step_id = ?').get(id, stepId) as { id: string } | undefined;

    if (existing) {
      db.prepare(`
        UPDATE step_progress
        SET completed = ?, completed_at = ?
        WHERE project_id = ? AND step_id = ?
      `).run(isCompleted, completedAt, id, stepId);
    } else {
      const progId = crypto.randomUUID();
      db.prepare(`
        INSERT INTO step_progress (id, project_id, step_id, completed, completed_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(progId, id, stepId, isCompleted, completedAt);
    }

    // Touch project updated_at
    db.prepare('UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);

    // Get recalculated stats
    const completedRows = db.prepare(`
      SELECT step_id FROM step_progress WHERE project_id = ? AND completed = 1
    `).all(id) as Array<{ step_id: string }>;
    const completedSet = new Set(completedRows.map(r => r.step_id));
    const stats = calculateProjectProgress(project.plan_json, completedSet);

    res.json({
      message: isCompleted ? 'Step marked as complete!' : 'Step marked as incomplete.',
      stepId,
      completed: Boolean(isCompleted),
      completedAt,
      stats,
    });
  } catch (err: any) {
    console.error('Error toggling step completion:', err);
    res.status(500).json({ error: 'Failed to update step progress.' });
  }
});

// GET /api/projects/:id/progress - get project progress stats
router.get('/:id/progress', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const project = db.prepare('SELECT id, plan_json FROM projects WHERE id = ? AND user_id = ?').get(id, userId) as {
      id: string;
      plan_json: string;
    } | undefined;

    if (!project) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    const completedRows = db.prepare(`
      SELECT step_id, completed, completed_at FROM step_progress WHERE project_id = ?
    `).all(id) as Array<{ step_id: string; completed: number; completed_at: string }>;

    const completedSet = new Set(completedRows.filter(r => r.completed === 1).map(r => r.step_id));
    const stats = calculateProjectProgress(project.plan_json, completedSet);

    res.json({
      stats,
      steps: completedRows,
    });
  } catch (err: any) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ error: 'Failed to retrieve progress.' });
  }
});

// POST /api/projects/seed-demo - seed sample project "AI Research Assistant"
router.post('/seed-demo', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Check if demo project already exists for this user
    const existing = db.prepare('SELECT id FROM projects WHERE user_id = ? AND name = ?').get(
      userId,
      'AI Research Assistant'
    ) as { id: string } | undefined;

    if (existing) {
      res.json({
        message: 'Demo project already exists in your workspace.',
        projectId: existing.id,
      });
      return;
    }

    const demoPlan = generateProjectPlan({
      projectName: 'AI Research Assistant',
      description: 'An AI-powered application that allows students to upload research documents and ask questions about their contents.',
      language: 'TypeScript / React / Node.js',
      difficulty: 'Intermediate',
      requirements: 'Document parsing, vector similarity or search context, and Gemini Q&A answering.'
    });

    const plan = await demoPlan;
    const projectId = crypto.randomUUID();

    db.prepare(`
      INSERT INTO projects (id, user_id, name, description, difficulty, language, plan_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      projectId,
      userId,
      'AI Research Assistant',
      'An AI-powered application that allows students to upload research documents and ask questions about their contents.',
      'Intermediate',
      'TypeScript / React / Node.js',
      JSON.stringify(plan)
    );

    // Pre-mark Step 1 as completed for realistic look
    const firstStepId = plan.phases?.[0]?.steps?.[0]?.id || 'step-1';
    db.prepare(`
      INSERT INTO step_progress (id, project_id, step_id, completed, completed_at)
      VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
    `).run(crypto.randomUUID(), projectId, firstStepId);

    // Pre-seed an initial welcoming mentor message
    db.prepare(`
      INSERT INTO mentor_messages (id, project_id, role, message)
      VALUES (?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      projectId,
      'assistant',
      `Welcome to your **AI Research Assistant** project! I am your SkillBridge AI Mentor.

This project will teach you how to build a real document Q&A system. We'll set up file handling, extract text from documents, and query Google Gemini to answer questions with cited sources.

Feel free to ask me to explain any concept, write sample code, or debug errors as you build!`
    );

    res.status(201).json({
      message: 'Demo project created successfully!',
      projectId,
    });
  } catch (err: any) {
    console.error('Error seeding demo project:', err);
    res.status(500).json({ error: 'Failed to create demo project.' });
  }
});

export default router;
