import React from 'react';
import { Layers, ArrowRightLeft, Check, Sparkles } from 'lucide-react';
import { ComponentItem } from '../../types';

interface Props {
  components: ComponentItem[];
  onAskMentor: (question: string) => void;
}

export const ComponentsTab: React.FC<Props> = ({ components, onAskMentor }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] shadow-sm">
        <span className="text-xs font-mono uppercase tracking-wider text-[#8B6F47] font-semibold block mb-1">
          System Decomposition
        </span>
        <h2 className="text-xl font-bold text-[#3E3028] mb-2">Core System Components</h2>
        <p className="text-xs text-[#75675C] leading-relaxed max-w-3xl">
          High quality software separates concerns into autonomous modules. Review the purpose, assigned responsibilities, and data contracts connecting each component.
        </p>
      </div>

      {/* Components List */}
      <div className="space-y-6">
        {components.map((comp, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] hover:border-[#8B6F47] transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DCCB]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E8DCCB] border border-[#DCC9B6] text-[#5C4033] flex items-center justify-center font-mono font-bold text-sm">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#3E3028]">{comp.name}</h3>
                  <p className="text-xs text-[#75675C] mt-0.5">{comp.description}</p>
                </div>
              </div>

              {comp.purpose && (
                <span className="self-start sm:self-auto text-xs font-mono text-[#5C4033] bg-[#E8DCCB] px-2.5 py-1 rounded-md border border-[#DCC9B6] font-medium">
                  {comp.purpose}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
              {/* Responsibilities */}
              <div>
                <h4 className="text-xs font-semibold text-[#3E3028] uppercase tracking-wider mb-3">
                  Key Responsibilities
                </h4>
                {comp.responsibilities && comp.responsibilities.length > 0 ? (
                  <ul className="space-y-2">
                    {comp.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="text-xs text-[#3E3028] flex items-start gap-2">
                        <span className="mt-0.5 p-0.5 rounded-full bg-[#5C4033]/15 text-[#5C4033] shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#75675C]">Maintains domain state and executes module-specific business logic.</p>
                )}
              </div>

              {/* Relationships */}
              <div>
                <h4 className="text-xs font-semibold text-[#3E3028] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-[#8B6F47]" />
                  <span>Interactions & Relationships</span>
                </h4>
                <div className="p-3.5 rounded-xl bg-[#FCF9F5] border border-[#E8DCCB] text-xs text-[#3E3028] leading-relaxed font-mono">
                  {comp.relationships || 'Receives API requests from the client controller, queries the relational database, and returns normalized JSON.'}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => onAskMentor(`Explain how the "${comp.name}" component should be coded and how it interacts with the rest of the application.`)}
                    className="text-xs text-[#5C4033] hover:text-[#8B6F47] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Sparkles className="w-3 h-3 text-[#8B6F47]" />
                    <span>Ask AI Mentor to explain this module</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
