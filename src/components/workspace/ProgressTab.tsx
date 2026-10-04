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
      <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] shadow-sm">
        <span className="text-xs font-mono uppercase tracking-wider text-[#8B6F47] font-semibold block mb-1">
          Milestone Analytics
        </span>
        <h2 className="text-xl font-bold text-[#3E3028] mb-2">Project Completion Progress</h2>
        <p className="text-xs text-[#75675C] leading-relaxed max-w-3xl">
          SkillBridge uses transparent, atomic progress tracking: Progress % = (Completed Steps / Total Steps) × 100.
        </p>
      </div>

      {/* Hero Stats Card */}
      <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-xs font-mono text-[#75675C]">Total Completion</span>
            <div className="text-3xl font-extrabold text-[#3E3028] mt-0.5">
              {overallPercentage}%{' '}
              <span className="text-xs font-normal text-[#75675C]">
                ({completedSteps} of {totalSteps} steps completed)
              </span>
            </div>
          </div>

          {isAllComplete ? (
            <div className="px-3.5 py-1.5 rounded-xl bg-[#E7EFE6] border border-[#CDE0CD] text-[#43603F] text-xs font-bold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#43603F]" />
              <span>Project Completed! Ready for Viva</span>
            </div>
          ) : (
            <div className="text-right">
              <span className="text-xs font-mono text-[#8B6F47] block font-semibold">Current Focus</span>
              <span className="text-sm font-semibold text-[#3E3028]">{currentStepTitle}</span>
            </div>
          )}
        </div>

        {/* Big Progress Bar */}
        <div className="w-full h-3.5 rounded-full bg-[#E8DCCB] border border-[#DCC9B6] overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isAllComplete
                ? 'bg-[#43603F]'
                : overallPercentage > 50
                ? 'bg-[#5C4033]'
                : 'bg-[#8B6F47]'
            }`}
            style={{ width: `${overallPercentage}%` }}
          />
        </div>

        {/* 4 Summary Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E8DCCB] text-xs">
          <div>
            <span className="text-[#75675C] font-medium">Completed Steps</span>
            <div className="text-xl font-bold text-[#43603F] mt-0.5">{completedSteps}</div>
          </div>
          <div>
            <span className="text-[#75675C] font-medium">Remaining Steps</span>
            <div className="text-xl font-bold text-[#5C4033] mt-0.5">{remainingSteps}</div>
          </div>
          <div>
            <span className="text-[#75675C] font-medium">Completed Phases</span>
            <div className="text-xl font-bold text-[#8B6F47] mt-0.5">
              {completedPhases} / {phases.length}
            </div>
          </div>
          <div>
            <span className="text-[#75675C] font-medium">Active Phase</span>
            <div className="text-sm font-bold text-[#3E3028] truncate mt-1">
              {isAllComplete ? 'All Phases Done' : currentPhaseName}
            </div>
          </div>
        </div>
      </div>

      {/* Phase by Phase Status List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#3E3028] uppercase tracking-wider">
          Phase-by-Phase Breakdown
        </h3>

        {phaseStats.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-[#5C4033]">Phase {idx + 1}</span>
                <span className="text-[#DCC9B6]">•</span>
                <h4 className="text-sm font-bold text-[#3E3028]">{item.phase.name}</h4>
              </div>
              <p className="text-xs text-[#75675C]">{item.phase.description}</p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="w-32 hidden sm:block">
                <div className="flex justify-between text-[11px] font-mono text-[#75675C] mb-1">
                  <span>{item.percentage}%</span>
                  <span>
                    {item.completedSteps}/{item.totalSteps}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E8DCCB] overflow-hidden">
                  <div
                    className="h-full bg-[#5C4033] rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>

              {item.isDone ? (
                <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#E7EFE6] text-[#43603F] border border-[#CDE0CD] flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#43603F]" />
                  <span>Done</span>
                </span>
              ) : (
                <button
                  onClick={() => onNavigateTab('roadmap')}
                  className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#5C4033] hover:bg-[#4A3227] text-white transition-colors shadow-sm shadow-[#5C4033]/20"
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
