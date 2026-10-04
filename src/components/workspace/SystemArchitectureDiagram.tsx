import React from 'react';
import { Layers, ArrowDown, Database, Cpu, Globe, Server, ShieldCheck, Terminal } from 'lucide-react';
import { ComponentItem, TechItem } from '../../types';

interface Props {
  components: ComponentItem[];
  techStack: TechItem[];
}

export const SystemArchitectureDiagram: React.FC<Props> = ({ components, techStack }) => {
  // Map common icons based on name/purpose
  const getIcon = (name: string, purpose?: string) => {
    const text = (name + ' ' + (purpose || '')).toLowerCase();
    if (text.includes('auth') || text.includes('security')) return ShieldCheck;
    if (text.includes('database') || text.includes('data') || text.includes('persist')) return Database;
    if (text.includes('ai') || text.includes('gemini') || text.includes('model')) return Cpu;
    if (text.includes('ui') || text.includes('frontend') || text.includes('client')) return Globe;
    if (text.includes('api') || text.includes('server') || text.includes('backend')) return Server;
    return Layers;
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider block">Architecture Map</span>
          <h4 className="text-base font-bold text-white">System Component Interactions</h4>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
          Generated from Project Plan
        </span>
      </div>

      {/* Vertical Data Flow Layout */}
      <div className="space-y-4 max-w-2xl mx-auto">
        {/* User Ingress */}
        <div className="flex items-center justify-center">
          <div className="px-4 py-2 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs font-mono flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" />
            <span>End-User / Web Browser</span>
          </div>
        </div>

        <div className="flex justify-center text-slate-600">
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>

        {/* Dynamic Project Components */}
        {components.map((comp, idx) => {
          const Icon = getIcon(comp.name, comp.purpose);
          return (
            <React.Fragment key={comp.name}>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-slate-400">Layer {idx + 1}</div>
                      <h5 className="text-sm font-bold text-white">{comp.name}</h5>
                    </div>
                  </div>
                  {comp.purpose && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {comp.purpose}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {comp.description}
                </p>

                {comp.relationships && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <span className="text-indigo-400 font-semibold">Interaction:</span>
                    <span>{comp.relationships}</span>
                  </div>
                )}
              </div>

              {idx < components.length - 1 && (
                <div className="flex justify-center text-slate-600">
                  <ArrowDown className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
