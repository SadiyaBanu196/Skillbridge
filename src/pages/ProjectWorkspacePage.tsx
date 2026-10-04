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
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
        <p className="text-xs font-mono text-slate-400">Loading project workspace from SQLite...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white mb-2">Project Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">{error || 'This project could not be found or you do not have permission to view it.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors"
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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Top Project Sub-Header Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-16 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Dashboard"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight line-clamp-1">
                {project.name}
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-900/40">
                Workspace
              </span>
            </div>
          </div>
        </div>

        {/* Progress Pill & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">Progress:</span>
            <span className="text-xs font-bold text-indigo-400 font-mono">{progressPct}%</span>
            <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Workspace Layout with Left Sidebar */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-8">
        {/* Left Sidebar Navigation */}
        <aside
          className={`lg:w-64 shrink-0 fixed inset-y-0 left-0 z-50 bg-slate-900 lg:bg-transparent lg:static lg:block p-4 lg:p-0 transition-transform duration-200 ${
            mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {mobileMenuOpen && (
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 lg:hidden">
              <span className="text-sm font-bold text-white">Workspace Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="sticky top-28 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 px-3 pb-2 block">
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
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-950'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.id === 'roadmap' && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {project.stats?.completedSteps || 0}/{project.stats?.totalSteps || 0}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Context Card */}
            <div className="mt-6 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-indigo-300 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
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
