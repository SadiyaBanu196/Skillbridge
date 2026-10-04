import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Circle,
  Layers,
  ArrowRight,
  Sparkles,
  Trophy
} from 'lucide-react';
import { Project } from '../../types';

interface Props {
  project: Project;
  onNavigateTab: (tab: string) => void;
}

export const ProgressTab: React.FC<Props> = ({ project, onNavigateTab }) => {
  const { plan, progressMap = {} } = project;
  const phases = plan.phases || [];

  // Calculate statistics
  let totalSteps = 0;
  let completedSteps = 0;
  let completedPhases = 0;
  let currentPhaseName = 'Phase 1';
  let currentStepTitle = 'Start Phase 1';
  let foundIncomplete = false;

  const phaseStats = phases.map((phase) => {
    const steps = phase.steps || [];
    const compInPhase = steps.filter((s) => progressMap[s.id]?.completed).length;
    const isDone = steps.length > 0 && compInPhase === steps.length;

    totalSteps += steps.length;
    completedSteps += compInPhase;
    if (isDone) completedPhases++;

    if (!foundIncomplete) {
      const firstInc = steps.find((s) => !progressMap[s.id]?.completed);
      if (firstInc) {
        currentPhaseName = phase.name;
        currentStepTitle = firstInc.title;
        foundIncomplete = true;
      }
    }

    return {
      phase,
      totalSteps: steps.length,
      completedSteps: compInPhase,
      isDone,
      percentage: steps.length > 0 ? Math.round((compInPhase / steps.length) * 100) : 0,
    };
  });

  const overallPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const remainingSteps = totalSteps - completedSteps;
  const isAllComplete = totalSteps > 0 && completedSteps === totalSteps;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 block mb-1">
          Milestone Analytics
        </span>
        <h2 className="text-xl font-bold text-white mb-2">Project Completion Progress</h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          SkillBridge uses transparent, atomic progress tracking: Progress % = (Completed Steps / Total Steps) × 100.
        </p>
      </div>

      {/* Hero Stats Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-xs font-mono text-slate-400">Total Completion</span>
            <div className="text-3xl font-extrabold text-white mt-0.5">
              {overallPercentage}%{' '}
              <span className="text-xs font-normal text-slate-400">
                ({completedSteps} of {totalSteps} steps completed)
              </span>
            </div>
          </div>

          {isAllComplete ? (
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Project Completed! Ready for Viva</span>
            </div>
          ) : (
            <div className="text-right">
              <span className="text-xs font-mono text-indigo-400 block">Current Focus</span>
              <span className="text-sm font-semibold text-slate-200">{currentStepTitle}</span>
            </div>
          )}
        </div>

        {/* Big Progress Bar */}
        <div className="w-full h-3.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isAllComplete
                ? 'bg-emerald-500'
                : overallPercentage > 50
                ? 'bg-indigo-500'
                : 'bg-indigo-600'
            }`}
            style={{ width: `${overallPercentage}%` }}
          />
        </div>

        {/* 4 Summary Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Completed Steps</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">{completedSteps}</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Remaining Steps</span>
            <div className="text-xl font-bold text-slate-300 mt-0.5">{remainingSteps}</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Completed Phases</span>
            <div className="text-xl font-bold text-sky-400 mt-0.5">
              {completedPhases} / {phases.length}
            </div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Active Phase</span>
            <div className="text-sm font-bold text-indigo-300 truncate mt-1">
              {isAllComplete ? 'All Phases Done' : currentPhaseName}
            </div>
          </div>
        </div>
      </div>

      {/* Phase by Phase Status List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Phase-by-Phase Breakdown
        </h3>

        {phaseStats.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-indigo-400">Phase {idx + 1}</span>
                <span className="text-slate-600">•</span>
                <h4 className="text-sm font-bold text-white">{item.phase.name}</h4>
              </div>
              <p className="text-xs text-slate-400">{item.phase.description}</p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="w-32 hidden sm:block">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>{item.percentage}%</span>
                  <span>
                    {item.completedSteps}/{item.totalSteps}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>

              {item.isDone ? (
                <span className="text-xs font-mono px-3 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Done</span>
                </span>
              ) : (
                <button
                  onClick={() => onNavigateTab('roadmap')}
                  className="text-xs font-semibold px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
