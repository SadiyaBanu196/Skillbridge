import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { debugCode } from '../services/aiService.js';

const router = Router();

// POST /api/debug
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { errorMessage, code, currentStep, projectContext } = req.body;

    if (!errorMessage || !errorMessage.trim()) {
      res.status(400).json({ error: 'Please provide an error message or description to diagnose.' });
      return;
    }

    const diagnosis = await debugCode({
      errorMessage: errorMessage.trim(),
      code: code ? code.trim() : undefined,
      currentStep: currentStep?.trim(),
      projectContext: projectContext?.trim(),
    });

    res.json({
      diagnosis,
      isDemoMode: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY',
    });
  } catch (err: any) {
    console.error('Error debugging issue:', err);
    res.status(500).json({ error: 'Failed to diagnose the issue. Please check your inputs.' });
  }
});

export default router;
