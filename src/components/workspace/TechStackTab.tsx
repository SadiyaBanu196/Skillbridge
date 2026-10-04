import React from 'react';
import { Layers, CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';
import { TechItem } from '../../types';

interface Props {
  techStack: TechItem[];
  onAskMentor: (question: string) => void;
}

export const TechStackTab: React.FC<Props> = ({ techStack, onAskMentor }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 block mb-1">
          Stack Architecture & Rationale
        </span>
        <h2 className="text-xl font-bold text-white mb-2">Recommended Technology Stack</h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          SkillBridge does not just list technologies; it explains the purpose and pedagogical rationale behind each tool. Understanding <em>why</em> a framework or library was chosen is fundamental to thinking like a software architect.
        </p>
      </div>

      {/* Tech Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {techStack.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-900/50">
                    {item.purpose}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{item.technology}</h3>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 font-mono text-xs">
                  0{idx + 1}
                </div>
              </div>

              {item.explanation && (
                <div className="mb-4">
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    What It Does
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                    {item.explanation}
                  </p>
                </div>
              )}

              {item.whyAppropriate && (
                <div>
                  <h4 className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Why Appropriate for this Project</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-lg">
                    {item.whyAppropriate}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">Module {idx + 1}</span>
              <button
                onClick={() => onAskMentor(`Why are we using ${item.technology} for ${item.purpose} in this project? Give me an architectural comparison.`)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                <span>Ask AI Mentor why</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
