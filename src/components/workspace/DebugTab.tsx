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
      <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Bug className="w-4 h-4 text-[#8E3E3E]" />
          <span className="text-xs font-mono uppercase tracking-wider text-[#8E3E3E] font-semibold">
            Intelligent Root-Cause Diagnostics
          </span>
        </div>
        <h2 className="text-xl font-bold text-[#3E3028] mb-2">Debugging Assistant</h2>
        <p className="text-xs text-[#75675C] leading-relaxed max-w-3xl">
          SkillBridge doesn't just hand you mysterious code snippets. It breaks down <em>what happened</em>, <em>why it happened</em>, and <em>how to fix it</em> so you understand the underlying runtime behavior.
        </p>
      </div>

      {/* Quick Sample Error Chips */}
      <div className="p-4 rounded-xl bg-[#F5EFE6] border border-[#E8DCCB]">
        <span className="text-[11px] font-semibold text-[#8B6F47] uppercase tracking-wider block mb-2 font-mono">
          Try a common student error scenario:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {sampleErrors.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplySample(sample)}
              className="text-left p-2.5 rounded-lg bg-[#FCF9F5] hover:bg-[#E8DCCB] border border-[#DCC9B6] hover:border-[#8B6F47] text-xs transition-colors"
            >
              <div className="font-semibold text-[#3E3028]">{sample.label}</div>
              <div className="text-[10px] font-mono text-[#75675C] truncate mt-0.5">{sample.err}</div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#FAECEC] border border-[#E2B6B6] text-[#8E3E3E] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Form & Diagnosis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleDiagnose} className="bg-[#F5EFE6] border border-[#E8DCCB] rounded-2xl p-6 shadow-md space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#3E3028] uppercase tracking-wider mb-2">
                Error Message or Stack Trace <span className="text-[#8E3E3E]">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                placeholder="Paste the browser console error or terminal stack trace..."
                className="w-full px-3.5 py-2.5 bg-[#FCF9F5] border border-[#DCC9B6] rounded-lg text-xs font-mono text-[#3E3028] placeholder-[#75675C] focus:outline-none focus:border-[#5C4033] transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3E3028] uppercase tracking-wider mb-2">
                Offending Code / Problem Description (Optional)
              </label>
              <textarea
                rows={5}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste the function or JSX block causing the issue..."
                className="w-full px-3.5 py-2.5 bg-[#FCF9F5] border border-[#DCC9B6] rounded-lg text-xs font-mono text-[#3E3028] placeholder-[#75675C] focus:outline-none focus:border-[#5C4033] transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3E3028] uppercase tracking-wider mb-2">
                Current Step Context
              </label>
              <input
                type="text"
                value={stepContext}
                onChange={(e) => setStepContext(e.target.value)}
                placeholder="e.g. Step 4: REST API handler"
                className="w-full px-3.5 py-2 bg-[#FCF9F5] border border-[#DCC9B6] rounded-lg text-xs text-[#3E3028] placeholder-[#75675C] focus:outline-none focus:border-[#5C4033] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#5C4033] hover:bg-[#4A3227] disabled:opacity-50 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm shadow-[#5C4033]/20"
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
            <div className="h-full min-h-[380px] rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] p-8 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-[#5C4033] animate-spin mb-4" />
              <h3 className="text-base font-bold text-[#3E3028] mb-2">Analyzing Execution Failure</h3>
              <p className="text-xs text-[#75675C] max-w-sm leading-relaxed">
                Inspecting runtime stack traces, identifying missing assertions, and drafting educational fix steps...
              </p>
            </div>
          ) : diagnosis ? (
            <div className="space-y-4">
              {/* Diagnosis Container */}
              <div className="bg-[#F5EFE6] border border-[#E8DCCB] rounded-2xl p-6 shadow-md space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCB]">
                  <span className="text-xs font-bold text-[#3E3028] uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#43603F]" />
                    <span>Error Diagnosis Complete</span>
                  </span>
                  {isDemoMode && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E8DCCB] text-[#5C4033] border border-[#DCC9B6] font-medium">
                      Demo Diagnostic
                    </span>
                  )}
                </div>

                {/* 1. What happened? */}
                <div>
                  <h4 className="text-xs font-semibold text-[#8E3E3E] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>What happened?</span>
                  </h4>
                  <p className="text-xs text-[#3E3028] leading-relaxed bg-[#FCF9F5] p-3 rounded-lg border border-[#E8DCCB]">
                    {diagnosis.problem}
                  </p>
                </div>

                {/* 2. Why did it happen? */}
                <div>
                  <h4 className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Why did it happen? (Root Cause)</span>
                  </h4>
                  <p className="text-xs text-[#75675C] leading-relaxed bg-[#FCF9F5] border border-[#E8DCCB] p-3 rounded-lg">
                    {diagnosis.cause}
                  </p>
                </div>

                {/* 3. How can I fix it? */}
                <div>
                  <h4 className="text-xs font-semibold text-[#43603F] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>How can I fix it?</span>
                  </h4>
                  <div className="text-xs text-[#3E3028] leading-relaxed bg-[#FCF9F5] p-3 rounded-lg border border-[#E8DCCB] font-mono whitespace-pre-wrap">
                    {diagnosis.solution}
                  </div>
                </div>

                {/* 4. What should I do next? */}
                <div>
                  <h4 className="text-xs font-semibold text-[#5C4033] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>What should I do next?</span>
                  </h4>
                  <p className="text-xs text-[#3E3028] leading-relaxed bg-[#E8DCCB]/40 border border-[#DCC9B6] p-3 rounded-lg">
                    {diagnosis.nextAction}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8DCCB] flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      onAskMentor(
                        `I encountered this error: "${diagnosis.problem}". Can you explain the root cause "${diagnosis.cause}" in more depth?`
                      )
                    }
                    className="text-xs text-[#5C4033] hover:text-[#8B6F47] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Sparkles className="w-3 h-3 text-[#8B6F47]" />
                    <span>Discuss this error with AI Mentor →</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] rounded-2xl bg-[#F5EFE6]/60 border border-[#DCC9B6] border-dashed p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#E8DCCB] flex items-center justify-center text-[#5C4033] mb-3">
                <Bug className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-[#3E3028] mb-1">Awaiting Error Input</h3>
              <p className="text-xs text-[#75675C] max-w-xs leading-relaxed">
                Paste an error message or choose one of the sample scenarios above to inspect the diagnosis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
