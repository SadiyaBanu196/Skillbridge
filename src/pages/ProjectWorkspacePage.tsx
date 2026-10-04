import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Layers,
  Cpu,
  Boxes,
  Map,
  Bot,
  Bug,
  BarChart3,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Menu,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { Project } from '../types';
import { OverviewTab } from '../components/workspace/OverviewTab';
import { TechStackTab } from '../components/workspace/TechStackTab';
import { ComponentsTab } from '../components/workspace/ComponentsTab';
import { RoadmapTab } from '../components/workspace/RoadmapTab';
import { MentorTab } from '../components/workspace/MentorTab';
import { DebugTab } from '../components/workspace/DebugTab';
import { ProgressTab } from '../components/workspace/ProgressTab';

export const ProjectWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'techStack' | 'components' | 'roadmap' | 'mentor' | 'debug' | 'progress'
  >('overview');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [togglingStepId, setTogglingStepId] = useState<string | null>(null);
  const [mentorInitialQuestion, setMentorInitialQuestion] = useState<string | undefined>(undefined);

  const fetchProjectData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.getProject(id);
      setProject(res.project);
    } catch (err: any) {
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleToggleStep = async (stepId: string, newState: boolean) => {
    if (!id || !project) return;
    try {
      setTogglingStepId(stepId);
      const res = await api.toggleStep(id, stepId, newState);

      // Update state locally
      setProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          progressMap: {
            ...prev.progressMap,
            [stepId]: {
              completed: res.completed,
              completedAt: res.completedAt,
            },
          },
          stats: res.stats,
        };
      });
    } catch (err: any) {
      alert(err.message || 'Could not update step completion');
    } finally {
      setTogglingStepId(null);
    }
  };

  const handleAskMentor = (question: string) => {
    setMentorInitialQuestion(question);
    setActiveTab('mentor');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Layers, desc: 'Problem, solution & architecture' },
    { id: 'techStack', label: 'Tech Stack', icon: Cpu, desc: 'Recommended tools & rationale' },
    { id: 'components', label: 'Components', icon: Boxes, desc: 'System modules & data contracts' },
    { id: 'roadmap', label: 'Implementation Plan', icon: Map, desc: 'Phases & actionable steps' },
    { id: 'mentor', label: 'AI Mentor', icon: Bot, desc: 'Contextual code & conceptual help' },
    { id: 'debug', label: 'Debug Assistant', icon: Bug, desc: 'Analyze errors & root causes' },
    { id: 'progress', label: 'Progress', icon: BarChart3, desc: 'Milestones & viva preparation' },
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#FCF9F5] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-[#5C4033] animate-spin mb-3" />
        <p className="text-xs font-mono text-[#75675C]">Loading project workspace from SQLite...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] text-center shadow-md">
        <AlertCircle className="w-10 h-10 text-[#8E3E3E] mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[#3E3028] mb-2">Project Not Found</h2>
        <p className="text-xs text-[#75675C] mb-6">{error || 'This project could not be found or you do not have permission to view it.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#5C4033] hover:bg-[#4A3227] text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const currentStepId = project.stats?.currentStep?.id;
  const progressPct = project.stats?.percentage || 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FCF9F5] flex flex-col">
      {/* Top Project Sub-Header Bar */}
      <div className="bg-[#FCF9F5]/90 border-b border-[#E8DCCB] px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-16 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-1.5 rounded-lg text-[#75675C] hover:text-[#3E3028] hover:bg-[#F5EFE6] transition-colors"
            title="Back to Dashboard"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-[#3E3028] tracking-tight line-clamp-1">
                {project.name}
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[#F5EFE6] text-[#8B6F47] border border-[#DCC9B6]">
                Workspace
              </span>
            </div>
          </div>
        </div>

        {/* Progress Pill & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#F5EFE6] px-3 py-1.5 rounded-lg border border-[#E8DCCB]">
            <span className="text-xs font-mono text-[#75675C] hidden sm:inline">Progress:</span>
            <span className="text-xs font-bold text-[#5C4033] font-mono">{progressPct}%</span>
            <div className="w-16 h-1.5 rounded-full bg-[#E8DCCB] overflow-hidden hidden sm:block">
              <div
                className="h-full bg-[#5C4033] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#75675C] hover:text-[#3E3028] rounded-lg bg-[#F5EFE6] border border-[#DCC9B6]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Workspace Layout with Left Sidebar */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-8">
        {/* Left Sidebar Navigation */}
        <aside
          className={`lg:w-64 shrink-0 fixed inset-y-0 left-0 z-50 bg-[#F5EFE6] lg:bg-transparent lg:static lg:block p-4 lg:p-0 transition-transform duration-200 border-r border-[#E8DCCB] lg:border-r-0 ${
            mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {mobileMenuOpen && (
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8DCCB] lg:hidden">
              <span className="text-sm font-bold text-[#3E3028]">Workspace Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-[#75675C] hover:text-[#3E3028]">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="sticky top-28 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#75675C] px-3 pb-2 block">
              Workspace Modules
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between group transition-all ${
                    isActive
                      ? 'bg-[#5C4033] text-white shadow-sm shadow-[#5C4033]/20'
                      : 'text-[#75675C] hover:bg-[#E8DCCB]/60 hover:text-[#3E3028]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-[#8B6F47] group-hover:text-[#5C4033]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.id === 'roadmap' && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-[#4A3227] text-white' : 'bg-[#E8DCCB] text-[#5C4033]'
                      }`}
                    >
                      {project.stats?.completedSteps || 0}/{project.stats?.totalSteps || 0}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Context Card */}
            <div className="mt-6 p-3.5 rounded-xl bg-[#F5EFE6] border border-[#E8DCCB] text-xs text-[#75675C]">
              <div className="flex items-center gap-1.5 text-[#5C4033] font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#8B6F47]" />
                <span>AI Guidance Active</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Stuck on any step? The AI Mentor is pre-loaded with this project's code structure.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <OverviewTab project={project} onNavigateTab={(tab) => setActiveTab(tab as any)} />
          )}

          {activeTab === 'techStack' && (
            <TechStackTab techStack={project.plan.techStack || []} onAskMentor={handleAskMentor} />
          )}

          {activeTab === 'components' && (
            <ComponentsTab components={project.plan.components || []} onAskMentor={handleAskMentor} />
          )}

          {activeTab === 'roadmap' && (
            <RoadmapTab
              phases={project.plan.phases || []}
              progressMap={project.progressMap || {}}
              onToggleComplete={handleToggleStep}
              onAskMentor={handleAskMentor}
              isTogglingId={togglingStepId}
            />
          )}

          {activeTab === 'mentor' && (
            <MentorTab
              project={project}
              currentStepId={currentStepId}
              initialQuestion={mentorInitialQuestion}
              onClearInitialQuestion={() => setMentorInitialQuestion(undefined)}
            />
          )}

          {activeTab === 'debug' && (
            <DebugTab
              project={project}
              currentStepTitle={project.stats?.currentStep?.title}
              onAskMentor={handleAskMentor}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressTab project={project} onNavigateTab={(tab) => setActiveTab(tab as any)} />
          )}
        </main>
      </div>
    </div>
  );
};
