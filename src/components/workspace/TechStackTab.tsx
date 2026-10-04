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
      <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] shadow-sm">
        <span className="text-xs font-mono uppercase tracking-wider text-[#8B6F47] font-semibold block mb-1">
          Stack Architecture & Rationale
        </span>
        <h2 className="text-xl font-bold text-[#3E3028] mb-2">Recommended Technology Stack</h2>
        <p className="text-xs text-[#75675C] leading-relaxed max-w-3xl">
          SkillBridge does not just list technologies; it explains the purpose and pedagogical rationale behind each tool. Understanding <em>why</em> a framework or library was chosen is fundamental to thinking like a software architect.
        </p>
      </div>

      {/* Tech Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {techStack.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] hover:border-[#8B6F47] transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[11px] font-mono text-[#5C4033] bg-[#E8DCCB] px-2 py-0.5 rounded border border-[#DCC9B6] font-medium">
                    {item.purpose}
                  </span>
                  <h3 className="text-lg font-bold text-[#3E3028] mt-2">{item.technology}</h3>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#E8DCCB] border border-[#DCC9B6] flex items-center justify-center text-[#5C4033] font-mono text-xs font-semibold">
                  0{idx + 1}
                </div>
              </div>

              {item.explanation && (
                <div className="mb-4">
                  <h4 className="text-[11px] font-semibold text-[#75675C] uppercase tracking-wider mb-1">
                    What It Does
                  </h4>
                  <p className="text-xs text-[#3E3028] leading-relaxed bg-[#FCF9F5] p-3 rounded-lg border border-[#E8DCCB]">
                    {item.explanation}
                  </p>
                </div>
              )}

              {item.whyAppropriate && (
                <div>
                  <h4 className="text-[11px] font-semibold text-[#43603F] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#43603F]" />
                    <span>Why Appropriate for this Project</span>
                  </h4>
                  <p className="text-xs text-[#3E3028] leading-relaxed bg-[#E7EFE6] border border-[#CDE0CD] p-3 rounded-lg">
                    {item.whyAppropriate}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-[#E8DCCB] flex items-center justify-between">
              <span className="text-[11px] text-[#75675C] font-mono">Module {idx + 1}</span>
              <button
                onClick={() => onAskMentor(`Why are we using ${item.technology} for ${item.purpose} in this project? Give me an architectural comparison.`)}
                className="text-[11px] text-[#5C4033] hover:text-[#8B6F47] font-semibold flex items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3 h-3 text-[#8B6F47]" />
                <span>Ask AI Mentor why</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
