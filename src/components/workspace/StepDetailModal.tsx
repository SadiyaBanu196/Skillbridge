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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/50">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-900/40">
                {phaseName}
              </span>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{step.estimatedTime || '45 mins'}</span>
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">{step.title}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Section 1: What are you building? */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>What are you building?</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              {step.description}
            </p>
          </div>

          {/* Section 2: Why is this needed? */}
          <div>
            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Why is this needed? (Conceptual Insight)</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-amber-950/20 border border-amber-900/30 p-3.5 rounded-xl">
              {step.whyNeeded ||
                'Completing this milestone establishes the foundation for subsequent features and eliminates architectural ambiguity.'}
            </p>
          </div>

          {/* Section 3: What should you learn? */}
          {step.concepts && step.concepts.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>What should you learn?</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {step.concepts.map((concept, cIdx) => (
                  <span
                    key={cIdx}
                    className="text-xs px-2.5 py-1 rounded-md bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 font-mono"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: What should you do? (Instructions) */}
          <div>
            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>What should you do? (Practical Tasks)</span>
            </h4>
            {step.instructions && step.instructions.length > 0 ? (
              <ol className="space-y-2.5">
                {step.instructions.map((inst, iIdx) => (
                  <li
                    key={iIdx}
                    className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60"
                  >
                    <span className="font-mono text-xs font-bold text-indigo-400 shrink-0 w-5 h-5 rounded bg-slate-800 flex items-center justify-center">
                      {iIdx + 1}
                    </span>
                    <span className="leading-snug">{inst}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-slate-400">Implement the code logic according to the specification and test execution.</p>
            )}
          </div>

          {/* Section 5: Expected Result / Deliverable */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Expected Result</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-emerald-300 font-mono">
              {step.deliverable || 'Verified functional component passing local assertions.'}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onAskMentor(`I'm working on the step: "${step.title}". Can you explain the concepts (${(step.concepts || []).join(', ')}) and give me a clear code example of how to implement it?`);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Need Help? Ask AI Mentor</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onToggleComplete(step.id, !isCompleted)}
              disabled={isToggling}
              className={`w-full sm:w-auto px-5 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                isCompleted
                  ? 'bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950'
              }`}
            >
              {isToggling ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : isCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
