import React from 'react';
import { Target, Lightbulb, HelpCircle, Layers, Cpu, Database, CheckCircle2 } from 'lucide-react';
import { Project } from '../../types';
import { SystemArchitectureDiagram } from './SystemArchitectureDiagram';

interface Props {
  project: Project;
  onNavigateTab: (tab: string) => void;
}

export const OverviewTab: React.FC<Props> = ({ project, onNavigateTab }) => {
  const { plan } = project;

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">
            Project Architecture Specification
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Difficulty: {project.difficulty || 'Intermediate'}
            </span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/60">
              {project.language || 'TypeScript'}
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-3">
          {project.name}
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {project.description}
        </p>
      </div>

      {/* 3 Pillars: Problem, Solution, Objective */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Problem Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">The Problem</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {plan.overview?.problem || 'Lack of structured guidance and conceptual understanding when building complex features.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
            Identifies technical challenge
          </div>
        </div>

        {/* Proposed Solution Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Proposed Solution</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {plan.overview?.solution || 'Builds an end-to-end engineered system with modular components, secure REST endpoints, and reactive UI.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
            Architectural approach
          </div>
        </div>

        {/* Objective Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Core Objective</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {plan.overview?.objective || 'Deliver a working prototype while mastering full-stack concepts, database transactions, and error debugging.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
            Learning deliverable
          </div>
        </div>
      </div>

      {/* System Overview Architecture Diagram */}
      <SystemArchitectureDiagram
        components={plan.components || []}
        techStack={plan.techStack || []}
      />

      {/* Quick Launch Banner to Roadmap */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-800/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white mb-1">Ready to start implementing?</h4>
          <p className="text-xs text-slate-300">
            Work through {plan.phases?.length || 0} phases and follow actionable instructions in the Implementation Roadmap.
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('roadmap')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors shrink-0"
        >
          View Implementation Roadmap →
        </button>
      </div>
    </div>
  );
};
