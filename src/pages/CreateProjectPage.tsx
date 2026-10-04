import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  Code2,
  Layers,
  CheckCircle2,
  Cpu,
  RefreshCw,
  FolderPlus
} from 'lucide-react';
import { api } from '../services/api';
import { ProjectPlan } from '../types';

export const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('TypeScript & Node.js');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [requirements, setRequirements] = useState('');

  const [generating, setGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<ProjectPlan | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick preset templates for students
  const presets = [
    {
      name: 'AI Research Assistant',
      desc: 'An AI-powered application that allows students to upload research documents (PDFs, Markdown) and ask questions about their contents with source citations.',
      lang: 'TypeScript & Node.js',
      diff: 'Intermediate',
      req: 'Document text extraction, SQLite metadata storage, and Gemini API Q&A integration.'
    },
    {
      name: 'Real-Time Collaborative Code Snippet Editor',
      desc: 'A full-stack web application where developers can share syntax-highlighted code snippets, leave line-by-line comments, and test basic execution snippets.',
      lang: 'React, Express & SQLite',
      diff: 'Intermediate',
      req: 'Syntax highlighting, REST API for snippets and comments, clean developer UI.'
    },
    {
      name: 'Student Task & Habit Development Tracker',
      desc: 'A goal-oriented productivity platform helping engineering students break semester goals into daily actionable habits with streak tracking and progress analytics.',
      lang: 'React, Node.js & SQLite',
      diff: 'Beginner',
      req: 'User authentication, daily streak calculation, habit completion history.'
    }
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setProjectName(preset.name);
    setDescription(preset.desc);
    setLanguage(preset.lang);
    setDifficulty(preset.diff);
    setRequirements(preset.req);
    setGeneratedPlan(null);
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !description.trim()) {
      setError('Please provide a project name and description.');
      return;
    }

    try {
      setGenerating(true);
      setError(null);
      const res = await api.generatePlan({
        projectName: projectName.trim(),
        description: description.trim(),
        language,
        difficulty,
        requirements,
      });

      setGeneratedPlan(res.plan);
      setIsDemoMode(res.isDemoMode);
    } catch (err: any) {
      setError(err.message || 'Failed to generate plan. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveAndLaunch = async () => {
    if (!generatedPlan) return;

    try {
      setSaving(true);
      setError(null);
      const res = await api.createProject({
        name: projectName.trim(),
        description: description.trim(),
        difficulty,
        language,
        plan: generatedPlan,
      });

      navigate(`/projects/${res.projectId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to save project.');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create New Project Blueprint
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          SkillBridge analyzes your project idea, recommends a structured tech stack, and drafts a step-by-step implementation roadmap.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Template Presets */}
      <div className="mb-8 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2.5">
          Need inspiration? Click a preset project idea:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-left p-3 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800/80 hover:border-indigo-500/40 transition-all text-xs group"
            >
              <div className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                {p.name}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                {p.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleGeneratePlan} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Project Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. AI Research Assistant"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Project Idea & Problem Statement <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you want to build, what problem it solves, and what you want the project to do..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Language / Preferred Stack
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="TypeScript & Node.js">TypeScript & Node.js</option>
                  <option value="JavaScript / React / Express">JavaScript / React / Express</option>
                  <option value="Python / FastAPI / React">Python / FastAPI / React</option>
                  <option value="Java / Spring Boot / React">Java / Spring Boot / React</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Additional Requirements (Optional)
              </label>
              <input
                type="text"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="e.g. SQLite database, JWT authentication, Gemini API"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-950"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Architecture & Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{generatedPlan ? 'Re-Generate Project Plan with AI' : 'Generate Project Plan with AI'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Plan Preview Side */}
        <div className="lg:col-span-6">
          {generating ? (
            <div className="h-full min-h-[420px] rounded-2xl bg-slate-900 border border-slate-800 p-8 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Drafting Architectural Blueprint</h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Analyzing system requirements, decomposing modules, recommending clean tech stack components, and designing step-by-step milestones...
              </p>
            </div>
          ) : generatedPlan ? (
            <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white">Project Blueprint Generated</span>
                  </div>
                  {isDemoMode && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
                      Demo AI Blueprint
                    </span>
                  )}
                </div>

                {/* Problem & Solution Preview */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Problem & Solution
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {generatedPlan.overview.solution}
                  </p>
                </div>

                {/* Tech Stack Preview */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Recommended Technologies ({generatedPlan.techStack.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedPlan.techStack.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-md bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 font-mono"
                      >
                        {t.technology} ({t.purpose})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Phases Preview */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Implementation Roadmap ({generatedPlan.phases.length} Phases)
                  </h4>
                  <div className="space-y-2">
                    {generatedPlan.phases.map((phase, pIdx) => (
                      <div key={pIdx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                        <div className="font-semibold text-slate-200">{phase.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {phase.steps.length} sequential learning steps ({phase.steps.map(s => s.title).slice(0, 2).join(', ')}...)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleSaveAndLaunch}
                  disabled={saving}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to SQLite Workspace...</span>
                    </>
                  ) : (
                    <>
                      <FolderPlus className="w-4 h-4" />
                      <span>Save & Launch Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[420px] rounded-2xl bg-slate-900/40 border border-slate-800 border-dashed p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300 mb-1">No Blueprint Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Fill in your project concept on the left and click "Generate Project Plan with AI" to inspect the architectural breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
