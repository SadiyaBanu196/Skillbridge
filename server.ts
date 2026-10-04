import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { initDatabase } from './server/database/db.js';
import authRoutes from './server/routes/authRoutes.js';
import projectRoutes from './server/routes/projectRoutes.js';
import mentorRoutes from './server/routes/mentorRoutes.js';
import debugRoutes from './server/routes/debugRoutes.js';
import { isGeminiConnected } from './server/services/aiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database tables
initDatabase();

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// AI Status endpoint for UI demo mode banner
app.get('/api/status', (_req, res) => {
  const connected = isGeminiConnected();
  res.json({
    geminiConnected: connected,
    demoMode: !connected,
    message: connected
      ? 'Connected to Google Gemini AI API.'
      : 'Demo AI mode — connect Gemini API for live AI responses.',
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/debug', debugRoutes);

// Global API error handler
app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

async function startServer() {
  if (!isProd) {
    // Development mode with Vite dev middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      console.warn('Production dist/ folder not found. Please run "npm run build".');
    }
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[SkillBridge] Server active on http://0.0.0.0:${PORT}`);
    console.log(`[SkillBridge] AI Mode: ${isGeminiConnected() ? 'Live Gemini AI' : 'Demo AI (Realistic Fallbacks)'}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
