import { Router, Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../database/db.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { askMentor } from '../services/aiService.js';

const router = Router();

// GET /api/mentor/messages/:projectId - get chat history
router.get('/messages/:projectId', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    const { projectId } = req.params;

    // Verify user owns the project
    const project = db.prepare('SELECT id, name FROM projects WHERE id = ? AND user_id = ?').get(projectId, userId);
    if (!project) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    const messages = db.prepare(`
      SELECT id, project_id, role, message, created_at
      FROM mentor_messages
      WHERE project_id = ?
      ORDER BY created_at ASC
    `).all(projectId);

    res.json({ messages });
  } catch (err: any) {
    console.error('Error fetching mentor messages:', err);
    res.status(500).json({ error: 'Failed to fetch conversation.' });
  }
});

// POST /api/mentor/chat - chat with AI mentor
router.post('/chat', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { projectId, message, currentStep, projectContext } = req.body;

    if (!message || !message.trim()) {
      res.status(400).json({ error: 'Message cannot be empty.' });
      return;
    }

    let projectName = 'My Project';
    if (projectId) {
      const project = db.prepare('SELECT id, name, plan_json FROM projects WHERE id = ? AND user_id = ?').get(projectId, userId) as {
        id: string;
        name: string;
        plan_json: string;
      } | undefined;

      if (!project) {
        res.status(404).json({ error: 'Project not found.' });
        return;
      }
      projectName = project.name;

      // Save user message in database
      const userMsgId = crypto.randomUUID();
      db.prepare(`
        INSERT INTO mentor_messages (id, project_id, role, message)
        VALUES (?, ?, 'user', ?)
      `).run(userMsgId, projectId, message.trim());
    }

    // Call AI Mentor
    const reply = await askMentor({
      projectId,
      message: message.trim(),
      currentStep,
      projectContext,
      projectName,
    });

    if (projectId) {
      // Save assistant message in database
      const assistantMsgId = crypto.randomUUID();
      db.prepare(`
        INSERT INTO mentor_messages (id, project_id, role, message)
        VALUES (?, ?, 'assistant', ?)
      `).run(assistantMsgId, projectId, reply);
    }

    res.json({
      reply,
      isDemoMode: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY',
    });
  } catch (err: any) {
    console.error('Error in mentor chat:', err);
    res.status(500).json({ error: 'Failed to get mentor response.' });
  }
});

export default router;
