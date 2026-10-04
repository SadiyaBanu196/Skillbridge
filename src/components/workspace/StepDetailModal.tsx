import React from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckSquare,
  BookOpen,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { RoadmapStep } from '../../types';

interface Props {
  step: RoadmapStep;
  phaseName: string;
  isCompleted: boolean;
  onClose: () => void;
  onToggleComplete: (stepId: string, newState: boolean) => Promise<void>;
  onAskMentor: (question: string) => void;
  isToggling?: boolean;
}

export const StepDetailModal: React.FC<Props> = ({
  step,
  phaseName,
  isCompleted,
  onClose,
  onToggleComplete,
  onAskMentor,
  isToggling = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E3028]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-[#F5EFE6] border border-[#DCC9B6] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E8DCCB] flex items-start justify-between gap-4 bg-[#FCF9F5]/70">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#5C4033] bg-[#E8DCCB] px-2 py-0.5 rounded border border-[#DCC9B6] font-medium">
                {phaseName}
              </span>
              <span className="text-[11px] font-mono text-[#75675C] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{step.estimatedTime || '45 mins'}</span>
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-[#3E3028] tracking-tight">{step.title}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#75675C] hover:text-[#3E3028] hover:bg-[#E8DCCB] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Section 1: What are you building? */}
          <div>
            <h4 className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#8B6F47]" />
              <span>What are you building?</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#3E3028] leading-relaxed bg-[#FCF9F5] p-3.5 rounded-xl border border-[#E8DCCB]">
              {step.description}
            </p>
          </div>

          {/* Section 2: Why is this needed? */}
          <div>
            <h4 className="text-xs font-semibold text-[#5C4033] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-[#5C4033]" />
              <span>Why is this needed? (Conceptual Insight)</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#3E3028] leading-relaxed bg-[#E8DCCB]/40 border border-[#DCC9B6] p-3.5 rounded-xl">
              {step.whyNeeded ||
                'Completing this milestone establishes the foundation for subsequent features and eliminates architectural ambiguity.'}
            </p>
          </div>

          {/* Section 3: What should you learn? */}
          {step.concepts && step.concepts.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#8B6F47]" />
                <span>What should you learn?</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {step.concepts.map((concept, cIdx) => (
                  <span
                    key={cIdx}
                    className="text-xs px-2.5 py-1 rounded-md bg-[#E8DCCB] border border-[#DCC9B6] text-[#5C4033] font-mono font-medium"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: What should you do? (Instructions) */}
          <div>
            <h4 className="text-xs font-semibold text-[#5C4033] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-[#5C4033]" />
              <span>What should you do? (Practical Tasks)</span>
            </h4>
            {step.instructions && step.instructions.length > 0 ? (
              <ol className="space-y-2.5">
                {step.instructions.map((inst, iIdx) => (
                  <li
                    key={iIdx}
                    className="text-xs sm:text-sm text-[#3E3028] flex items-start gap-2.5 bg-[#FCF9F5] p-2.5 rounded-lg border border-[#E8DCCB]"
                  >
                    <span className="font-mono text-xs font-bold text-[#5C4033] shrink-0 w-5 h-5 rounded bg-[#E8DCCB] border border-[#DCC9B6] flex items-center justify-center">
                      {iIdx + 1}
                    </span>
                    <span className="leading-snug">{inst}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-[#75675C]">Implement the code logic according to the specification and test execution.</p>
            )}
          </div>

          {/* Section 5: Expected Result / Deliverable */}
          <div>
            <h4 className="text-xs font-semibold text-[#75675C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#43603F]" />
              <span>Expected Result</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-[#E7EFE6] border border-[#CDE0CD] text-xs sm:text-sm text-[#2F4F2F] font-mono">
              {step.deliverable || 'Verified functional component passing local assertions.'}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E8DCCB] bg-[#FCF9F5]/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onAskMentor(`I'm working on the step: "${step.title}". Can you explain the concepts (${(step.concepts || []).join(', ')}) and give me a clear code example of how to implement it?`);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8DCCB] hover:bg-[#DCC9B6] text-[#5C4033] text-xs font-semibold border border-[#DCC9B6] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8B6F47]" />
            <span>Need Help? Ask AI Mentor</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onToggleComplete(step.id, !isCompleted)}
              disabled={isToggling}
              className={`w-full sm:w-auto px-5 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                isCompleted
                  ? 'bg-[#E8DCCB] hover:bg-[#FAECEC] text-[#3E3028] hover:text-[#8E3E3E] border border-[#DCC9B6]'
                  : 'bg-[#5C4033] hover:bg-[#4A3227] text-white shadow-sm shadow-[#5C4033]/20'
              }`}
            >
              {isToggling ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : isCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#43603F]" />
                  <span>Mark as Incomplete</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Step as Complete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
