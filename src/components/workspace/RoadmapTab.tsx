import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ChevronRight,
  BookOpen,
  Filter,
  Check,
  Layers,
  ArrowRight
} from 'lucide-react';
import { RoadmapPhase, RoadmapStep } from '../../types';
import { StepDetailModal } from './StepDetailModal';

interface Props {
  phases: RoadmapPhase[];
  progressMap: Record<string, { completed: boolean; completedAt: string | null }>;
  onToggleComplete: (stepId: string, newState: boolean) => Promise<void>;
  onAskMentor: (question: string) => void;
  isTogglingId?: string | null;
}

export const RoadmapTab: React.FC<Props> = ({
  phases,
  progressMap,
  onToggleComplete,
  onAskMentor,
  isTogglingId,
}) => {
  const [selectedStep, setSelectedStep] = useState<{ step: RoadmapStep; phaseName: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'incomplete' | 'completed'>('all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#8B6F47] font-semibold block mb-1">
            Guided Implementation
          </span>
          <h2 className="text-xl font-bold text-[#3E3028]">Project Implementation Roadmap</h2>
          <p className="text-xs text-[#75675C] mt-1">
            Follow structured phases designed to take you from foundational setup to production-grade deployment.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FCF9F5] rounded-lg border border-[#DCC9B6] text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              filter === 'all' ? 'bg-[#5C4033] text-white shadow-sm' : 'text-[#75675C] hover:text-[#3E3028]'
            }`}
          >
            All Steps
          </button>
          <button
            onClick={() => setFilter('incomplete')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              filter === 'incomplete' ? 'bg-[#E8DCCB] text-[#5C4033] font-semibold' : 'text-[#75675C] hover:text-[#3E3028]'
            }`}
          >
            To Build
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              filter === 'completed' ? 'bg-[#E7EFE6] text-[#43603F] font-semibold' : 'text-[#75675C] hover:text-[#3E3028]'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Phases and Steps */}
      <div className="space-y-8">
        {phases.map((phase, pIdx) => {
          const phaseSteps = phase.steps || [];
          const filteredSteps = phaseSteps.filter((step) => {
            const isCompleted = progressMap[step.id]?.completed || false;
            if (filter === 'completed') return isCompleted;
            if (filter === 'incomplete') return !isCompleted;
            return true;
          });

          if (filteredSteps.length === 0 && filter !== 'all') {
            return null;
          }

          const completedInPhase = phaseSteps.filter((s) => progressMap[s.id]?.completed).length;
          const isPhaseDone = phaseSteps.length > 0 && completedInPhase === phaseSteps.length;

          return (
            <div
              key={pIdx}
              className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] transition-all shadow-sm"
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#E8DCCB]">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                      isPhaseDone
                        ? 'bg-[#E7EFE6] text-[#43603F] border border-[#CDE0CD]'
                        : 'bg-[#E8DCCB] text-[#5C4033] border border-[#DCC9B6]'
                    }`}
                  >
                    {pIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#3E3028]">{phase.name}</h3>
                    <p className="text-xs text-[#75675C]">{phase.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#75675C]">
                    {completedInPhase} of {phaseSteps.length} completed
                  </span>
                  {isPhaseDone && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E7EFE6] text-[#43603F] border border-[#CDE0CD] flex items-center gap-1 font-semibold">
                      <Check className="w-3 h-3" />
                      <span>Phase Complete</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Step Cards List */}
              <div className="space-y-3">
                {filteredSteps.map((step) => {
                  const isCompleted = progressMap[step.id]?.completed || false;
                  const isToggling = isTogglingId === step.id;

                  return (
                    <div
                      key={step.id}
                      onClick={() => setSelectedStep({ step, phaseName: phase.name })}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                        isCompleted
                          ? 'bg-[#FCF9F5]/70 border-[#E8DCCB] hover:border-[#DCC9B6]'
                          : 'bg-[#FCF9F5] border-[#E8DCCB] hover:border-[#8B6F47] shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(step.id, !isCompleted);
                          }}
                          disabled={isToggling}
                          className="mt-0.5 text-[#75675C] hover:text-[#43603F] transition-colors shrink-0"
                          title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-[#43603F] fill-[#E7EFE6]" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#DCC9B6] hover:text-[#5C4033]" />
                          )}
                        </button>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4
                              className={`text-sm font-semibold transition-colors ${
                                isCompleted
                                  ? 'text-[#75675C] line-through'
                                  : 'text-[#3E3028] group-hover:text-[#5C4033]'
                              }`}
                            >
                              {step.title}
                            </h4>
                            <span className="text-[10px] font-mono text-[#75675C] flex items-center gap-1 bg-[#E8DCCB] px-1.5 py-0.5 rounded border border-[#DCC9B6]">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{step.estimatedTime || '45 mins'}</span>
                            </span>
                          </div>

                          <p className="text-xs text-[#75675C] line-clamp-1">
                            {step.description}
                          </p>

                          {step.whyNeeded && (
                            <p className="text-[11px] text-[#8B6F47] font-mono mt-1 line-clamp-1">
                              Why: {step.whyNeeded}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right action area */}
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        {step.concepts && step.concepts.length > 0 && (
                          <div className="hidden lg:flex items-center gap-1.5">
                            {step.concepts.slice(0, 2).map((c, cIdx) => (
                              <span
                                key={cIdx}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E8DCCB] text-[#5C4033] border border-[#DCC9B6]"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}

                        <span className="text-xs font-semibold text-[#5C4033] group-hover:text-[#8B6F47] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Open Step</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Detail Modal */}
      {selectedStep && (
        <StepDetailModal
          step={selectedStep.step}
          phaseName={selectedStep.phaseName}
          isCompleted={progressMap[selectedStep.step.id]?.completed || false}
          onClose={() => setSelectedStep(null)}
          onToggleComplete={async (stepId, newState) => {
            await onToggleComplete(stepId, newState);
          }}
          onAskMentor={onAskMentor}
          isToggling={isTogglingId === selectedStep.step.id}
        />
      )}
    </div>
  );
};
