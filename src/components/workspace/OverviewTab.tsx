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
      <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#8B6F47] font-semibold">
            Project Architecture Specification
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#E8DCCB] text-[#5C4033] border border-[#DCC9B6] font-medium">
              Difficulty: {project.difficulty || 'Intermediate'}
            </span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#E8DCCB] text-[#5C4033] border border-[#DCC9B6] font-medium">
              {project.language || 'TypeScript'}
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-[#3E3028] tracking-tight mb-3">
          {project.name}
        </h2>
        <p className="text-sm text-[#75675C] leading-relaxed max-w-3xl">
          {project.description}
        </p>
      </div>

      {/* 3 Pillars: Problem, Solution, Objective */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Problem Card */}
        <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-lg bg-[#FAECEC] text-[#8E3E3E] border border-[#E2B6B6]">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#3E3028] uppercase tracking-wider">The Problem</h3>
            </div>
            <p className="text-xs text-[#75675C] leading-relaxed">
              {plan.overview?.problem || 'Lack of structured guidance and conceptual understanding when building complex features.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E8DCCB] text-[11px] text-[#75675C] font-mono">
            Identifies technical challenge
          </div>
        </div>

        {/* Proposed Solution Card */}
        <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-lg bg-[#E8DCCB] text-[#5C4033] border border-[#DCC9B6]">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#3E3028] uppercase tracking-wider">Proposed Solution</h3>
            </div>
            <p className="text-xs text-[#75675C] leading-relaxed">
              {plan.overview?.solution || 'Builds an end-to-end engineered system with modular components, secure REST endpoints, and reactive UI.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E8DCCB] text-[11px] text-[#75675C] font-mono">
            Architectural approach
          </div>
        </div>

        {/* Objective Card */}
        <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-lg bg-[#E7EFE6] text-[#43603F] border border-[#CDE0CD]">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#3E3028] uppercase tracking-wider">Core Objective</h3>
            </div>
            <p className="text-xs text-[#75675C] leading-relaxed">
              {plan.overview?.objective || 'Deliver a working prototype while mastering full-stack concepts, database transactions, and error debugging.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E8DCCB] text-[11px] text-[#75675C] font-mono">
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
      <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#DCC9B6] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
        <div>
          <h4 className="text-base font-bold text-[#3E3028] mb-1">Ready to start implementing?</h4>
          <p className="text-xs text-[#75675C]">
            Work through {plan.phases?.length || 0} phases and follow actionable instructions in the Implementation Roadmap.
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('roadmap')}
          className="px-4 py-2.5 bg-[#5C4033] hover:bg-[#4A3227] text-white font-semibold text-xs rounded-lg transition-colors shrink-0 shadow-sm shadow-[#5C4033]/20"
        >
          View Implementation Roadmap →
        </button>
      </div>
    </div>
  );
};
