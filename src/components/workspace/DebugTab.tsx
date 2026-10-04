import React, { useState } from 'react';
import {
  Bug,
  AlertCircle,
  HelpCircle,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Sparkles,
  Terminal,
  Code2
} from 'lucide-react';
import { DebugDiagnosis, Project } from '../../types';
import { api } from '../../services/api';

interface Props {
  project: Project;
  currentStepTitle?: string;
  onAskMentor: (question: string) => void;
}

export const DebugTab: React.FC<Props> = ({ project, currentStepTitle, onAskMentor }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [code, setCode] = useState('');
  const [stepContext, setStepContext] = useState(currentStepTitle || 'Step 3: Database & API Setup');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DebugDiagnosis | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleErrors = [
    {
      label: 'Undefined Property Crash',
      err: "TypeError: Cannot read properties of undefined (reading 'map')",
      code: "const UserList = ({ users }) => {\n  return <div>{users.map(u => <span>{u.name}</span>)}</div>;\n};",
      step: 'Step 6: Frontend UI Components'
    },
    {
      label: 'CORS & Failed to Fetch',
      err: "TypeError: Failed to fetch / Access to fetch at 'http://localhost:3000/api/projects' from origin 'http://localhost:5173' has been blocked by CORS policy",
      code: "const res = await fetch('http://localhost:3000/api/projects');\nconst data = await res.json();",
      step: 'Step 4: Connecting Frontend to Backend'
    },
    {
      label: 'SQLite Constraint Violation',
      err: "SqliteError: UNIQUE constraint failed: users.email",
      code: "db.prepare('INSERT INTO users (id, name, email) VALUES (?, ?, ?)').run(id, name, email);",
      step: 'Step 2: Database Schema & Authentication'
    }
  ];

  const handleApplySample = (sample: typeof sampleErrors[0]) => {
    setErrorMessage(sample.err);
    setCode(sample.code);
    setStepContext(sample.step);
    setDiagnosis(null);
  };

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!errorMessage.trim()) {
      setError('Please provide an error message or description.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.diagnoseError({
        errorMessage: errorMessage.trim(),
        code: code.trim() || undefined,
        currentStep: stepContext,
        projectContext: `Project: ${project.name}, Tech: ${project.language}`,
      });

      setDiagnosis(res.diagnosis);
      setIsDemoMode(res.isDemoMode);
    } catch (err: any) {
      setError(err.message || 'Failed to diagnose the error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <Bug className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-rose-400">
            Intelligent Root-Cause Diagnostics
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Debugging Assistant</h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          SkillBridge doesn't just hand you mysterious code snippets. It breaks down <em>what happened</em>, <em>why it happened</em>, and <em>how to fix it</em> so you understand the underlying runtime behavior.
        </p>
      </div>

      {/* Quick Sample Error Chips */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Try a common student error scenario:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {sampleErrors.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplySample(sample)}
              className="text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 text-xs transition-colors"
            >
              <div className="font-semibold text-slate-200">{sample.label}</div>
              <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">{sample.err}</div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Form & Diagnosis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleDiagnose} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Error Message or Stack Trace <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                placeholder="Paste the browser console error or terminal stack trace..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Offending Code / Problem Description (Optional)
              </label>
              <textarea
                rows={5}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste the function or JSX block causing the issue..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Current Step Context
              </label>
              <input
                type="text"
                value={stepContext}
                onChange={(e) => setStepContext(e.target.value)}
                placeholder="e.g. Step 4: REST API handler"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-950"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Diagnosing Root Cause with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Error & Explain Root Cause</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Diagnosis Results Side */}
        <div className="lg:col-span-6">
          {loading ? (
            <div className="h-full min-h-[380px] rounded-2xl bg-slate-900 border border-slate-800 p-8 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-rose-500 animate-spin mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Analyzing Execution Failure</h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Inspecting runtime stack traces, identifying missing assertions, and drafting educational fix steps...
              </p>
            </div>
          ) : diagnosis ? (
            <div className="space-y-4">
              {/* Diagnosis Container */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Error Diagnosis Complete</span>
                  </span>
                  {isDemoMode && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
                      Demo Diagnostic
                    </span>
                  )}
                </div>

                {/* 1. What happened? */}
                <div>
                  <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>What happened?</span>
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {diagnosis.problem}
                  </p>
                </div>

                {/* 2. Why did it happen? */}
                <div>
                  <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Why did it happen? (Root Cause)</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-amber-950/20 border border-amber-900/30 p-3 rounded-lg">
                    {diagnosis.cause}
                  </p>
                </div>

                {/* 3. How can I fix it? */}
                <div>
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>How can I fix it?</span>
                  </h4>
                  <div className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono whitespace-pre-wrap">
                    {diagnosis.solution}
                  </div>
                </div>

                {/* 4. What should I do next? */}
                <div>
                  <h4 className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>What should I do next?</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-sky-950/20 border border-sky-900/30 p-3 rounded-lg">
                    {diagnosis.nextAction}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      onAskMentor(
                        `I encountered this error: "${diagnosis.problem}". Can you explain the root cause "${diagnosis.cause}" in more depth?`
                      )
                    }
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Discuss this error with AI Mentor →</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] rounded-2xl bg-slate-900/40 border border-slate-800 border-dashed p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                <Bug className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300 mb-1">Awaiting Error Input</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Paste an error message or choose one of the sample scenarios above to inspect the diagnosis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
