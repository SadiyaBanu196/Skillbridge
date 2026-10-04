import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  ArrowRight,
  FolderGit2,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  Loader2,
  AlertCircle,
  Trash2,
  Terminal,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ProjectListItem } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seedingDemo, setSeedingDemo] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProjects();
      setProjects(data.projects);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSeedDemo = async () => {
    try {
      setSeedingDemo(true);
      const res = await api.seedDemoProject();
      navigate(`/projects/${res.projectId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to load sample project.');
      setSeedingDemo(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm('Are you sure you want to delete this project? All progress and mentor chat logs will be removed.')) {
      return;
    }

    try {
      setDeletingId(id);
      await api.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete project.');
    } finally {
      setDeletingId(null);
    }
  };

  // Compute statistics
  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.stats?.isCompleted).length;
  const activeProjects = totalProjects - completedProjects;

  const totalStepsAll = projects.reduce((acc, p) => acc + (p.stats?.totalSteps || 0), 0);
  const completedStepsAll = projects.reduce((acc, p) => acc + (p.stats?.completedSteps || 0), 0);
  const overallProgressPercentage = totalStepsAll > 0 ? Math.round((completedStepsAll / totalStepsAll) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-[#E8DCCB]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E3028] tracking-tight">
            Welcome back, {user?.name || 'Student'}. What are you building today?
          </h1>
          <p className="text-sm text-[#75675C] mt-1">
            Track your milestones, get unblocked with your AI Mentor, and understand every layer of your application.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedDemo}
            disabled={seedingDemo}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#F5EFE6] hover:bg-[#E8DCCB] border border-[#DCC9B6] text-xs font-semibold text-[#5C4033] transition-colors shadow-sm"
          >
            {seedingDemo ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5C4033]" /> : <Sparkles className="w-3.5 h-3.5 text-[#8B6F47]" />}
            <span>Load Sample: AI Research Assistant</span>
          </button>

          <Link
            to="/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5C4033] hover:bg-[#4A3227] text-white text-xs font-semibold shadow-sm shadow-[#5C4033]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        <div className="p-4 rounded-xl bg-[#F5EFE6] border border-[#E8DCCB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-[#75675C] font-medium">Total Projects</p>
            <p className="text-2xl font-bold text-[#3E3028] mt-1">{totalProjects}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#E8DCCB] border border-[#DCC9B6] flex items-center justify-center text-[#5C4033]">
            <FolderGit2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F5EFE6] border border-[#E8DCCB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-[#75675C] font-medium">Active Projects</p>
            <p className="text-2xl font-bold text-[#5C4033] mt-1">{activeProjects}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#5C4033]/10 border border-[#5C4033]/20 flex items-center justify-center text-[#5C4033]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F5EFE6] border border-[#E8DCCB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-[#75675C] font-medium">Completed Projects</p>
            <p className="text-2xl font-bold text-[#43603F] mt-1">{completedProjects}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#E7EFE6] border border-[#CDE0CD] flex items-center justify-center text-[#43603F]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F5EFE6] border border-[#E8DCCB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-[#75675C] font-medium">Overall Progress</p>
            <p className="text-2xl font-bold text-[#8B6F47] mt-1">{overallProgressPercentage}%</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#8B6F47]/10 border border-[#8B6F47]/20 flex items-center justify-center text-[#8B6F47]">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-[#FAECEC] border border-[#E2B6B6] text-[#8E3E3E] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#8E3E3E]" />
            <span>{error}</span>
          </div>
          <button onClick={fetchProjects} className="underline hover:text-[#5C4033] font-semibold">
            Retry
          </button>
        </div>
      )}

      {/* Projects List Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#3E3028]">Your Development Projects</h2>
        <span className="text-xs text-[#75675C] font-mono">
          {projects.length} {projects.length === 1 ? 'project' : 'projects'} saved
        </span>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-20 text-center rounded-2xl bg-[#F5EFE6]/50 border border-[#E8DCCB]">
          <Loader2 className="w-8 h-8 text-[#5C4033] animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#75675C] font-mono">Loading your project workspaces from SQLite database...</p>
        </div>
      ) : projects.length === 0 ? (
        /* Empty State */
        <div className="py-16 px-6 text-center rounded-2xl bg-[#F5EFE6] border border-[#DCC9B6] border-dashed max-w-2xl mx-auto my-6">
          <div className="w-12 h-12 rounded-xl bg-[#5C4033]/10 border border-[#5C4033]/20 text-[#5C4033] mx-auto flex items-center justify-center mb-4">
            <Terminal className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#3E3028] mb-2">No projects created yet</h3>
          <p className="text-xs text-[#75675C] max-w-md mx-auto mb-6 leading-relaxed">
            SkillBridge helps you build projects with structured AI planning and contextual mentoring. Give it a project idea or load the sample project to begin.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/projects/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#5C4033] hover:bg-[#4A3227] text-white text-xs font-semibold transition-all shadow-sm shadow-[#5C4033]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Project</span>
            </Link>
            <button
              onClick={handleSeedDemo}
              disabled={seedingDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#E8DCCB] hover:bg-[#DCC9B6] text-[#3E3028] text-xs font-semibold border border-[#DCC9B6] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5C4033]" />
              <span>Load AI Research Assistant Sample</span>
            </button>
          </div>
        </div>
      ) : (
        /* Projects Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => {
            const currentStepTitle = proj.stats?.currentStep?.title || 'Phase in progress';
            const pct = proj.stats?.percentage || 0;

            return (
              <div
                key={proj.id}
                onClick={() => navigate(`/projects/${proj.id}`)}
                className="group relative p-6 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] hover:border-[#8B6F47] transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold text-[#3E3028] group-hover:text-[#5C4033] transition-colors line-clamp-1">
                      {proj.name}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E8DCCB] border border-[#DCC9B6] text-[#5C4033] font-semibold">
                        {proj.difficulty || 'Intermediate'}
                      </span>
                      <button
                        onClick={(e) => handleDelete(proj.id, e)}
                        disabled={deletingId === proj.id}
                        title="Delete project"
                        className="p-1 text-[#75675C] hover:text-[#8E3E3E] hover:bg-[#FAECEC] rounded transition-colors"
                      >
                        {deletingId === proj.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8E3E3E]" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#75675C] line-clamp-2 mb-4 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Technology Tags */}
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {proj.techStack.slice(0, 4).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E8DCCB] text-[#5C4033] border border-[#DCC9B6]"
                        >
                          {t.technology}
                        </span>
                      ))}
                      {proj.techStack.length > 4 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 text-[#75675C]">
                          +{proj.techStack.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#75675C] font-medium">Roadmap Progress</span>
                      <span className="font-mono font-semibold text-[#3E3028]">{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E8DCCB] overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          pct === 100
                            ? 'bg-[#43603F]'
                            : pct > 50
                            ? 'bg-[#5C4033]'
                            : 'bg-[#8B6F47]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Current Step indicator & Continue button */}
                  <div className="pt-3 border-t border-[#E8DCCB] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#75675C] truncate max-w-[240px]">
                      <Layers className="w-3.5 h-3.5 text-[#8B6F47] shrink-0" />
                      <span className="truncate">
                        Current:{' '}
                        <strong className="text-[#3E3028] font-medium">
                          {currentStepTitle}
                        </strong>
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#5C4033] group-hover:text-[#8B6F47] group-hover:translate-x-0.5 transition-all shrink-0">
                      <span>Continue Workspace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
