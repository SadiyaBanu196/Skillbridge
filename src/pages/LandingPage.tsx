import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  BookOpen,
  Hammer,
  Bug,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Cpu,
  Layers,
  ChevronRight,
  Database,
  Code2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Compass,
      title: 'Plan',
      tagline: 'Turn an idea into a structured implementation plan.',
      description:
        'Specify what you want to build. SkillBridge analyzes your problem, maps out modular software components, and generates a concrete phase-by-phase implementation plan.',
      badge: 'Step 1'
    },
    {
      icon: BookOpen,
      title: 'Understand',
      tagline: 'Learn the concepts and technologies behind each step.',
      description:
        'Never write code blindly. Every milestone explains why each library was chosen, what underlying architectural patterns are used, and what concepts you must master.',
      badge: 'Step 2'
    },
    {
      icon: Hammer,
      title: 'Build',
      tagline: 'Follow a step-by-step implementation roadmap.',
      description:
        'Tackle manageable, isolated deliverables. Move systematically from project setup and database schema design to REST APIs, UI state, and integration tests.',
      badge: 'Step 3'
    },
    {
      icon: Bug,
      title: 'Debug',
      tagline: 'Get contextual AI guidance when something goes wrong.',
      description:
        'Hit a runtime exception or syntax error? The contextual debugging assistant analyzes the root cause, explains why it happened, and guides you to the fix.',
      badge: 'Step 4'
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Input Project Concept',
      desc: 'Describe your idea, domain requirements, and preferred stack in plain English.'
    },
    {
      step: '02',
      title: 'AI Architect Generates Plan',
      desc: 'Get a full system breakdown: architecture diagram, tech stack rationale, and phases.'
    },
    {
      step: '03',
      title: 'Work Through Atomic Steps',
      desc: 'Build step-by-step with conceptual guidance, deliverables, and estimated times.'
    },
    {
      step: '04',
      title: 'AI Mentoring & Debugging',
      desc: 'Ask questions, understand errors, and verify code behavior inside your dedicated workspace.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF9F5] text-[#3E3028]">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle grid pattern background in beige */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#E8DCCB_1px,transparent_1px),linear-gradient(to_bottom,#E8DCCB_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#3E3028] tracking-tight leading-[1.15] mb-6">
            From Project Idea to Working Project —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5C4033] via-[#8B6F47] to-[#A67B5B]">
              While Understanding What You Build.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-[#75675C] font-normal leading-relaxed mb-10">
            SkillBridge helps students and learners bridge the gap between copying tutorials and truly understanding software engineering. Input any project idea to get a structured roadmap, component breakdown, and an intelligent AI mentor that explains every line and fixes errors contextually.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-[#5C4033] hover:bg-[#4A3227] rounded-xl transition-all shadow-lg shadow-[#5C4033]/20 group"
            >
              <span>{user ? 'Go to Dashboard' : 'Start Building Now'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {!user && (
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-[#3E3028] bg-[#F5EFE6] hover:bg-[#E8DCCB] border border-[#DCC9B6] rounded-xl transition-all"
              >
                <span>Sign In to Existing Account</span>
              </Link>
            )}
          </div>

          {/* Quick proof bar */}
          <div className="mt-14 pt-8 border-t border-[#E8DCCB] grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F5EFE6] border border-[#E8DCCB]">
              <Code2 className="w-5 h-5 text-[#8B6F47] shrink-0" />
              <div>
                <div className="text-xs text-[#75675C]">Target Audience</div>
                <div className="text-sm font-semibold text-[#3E3028]">CS & Engineering Students</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F5EFE6] border border-[#E8DCCB]">
              <Layers className="w-5 h-5 text-[#5C4033] shrink-0" />
              <div>
                <div className="text-xs text-[#75675C]">Architecture</div>
                <div className="text-sm font-semibold text-[#3E3028]">Modular Full Stack</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F5EFE6] border border-[#E8DCCB]">
              <Database className="w-5 h-5 text-[#8B6F47] shrink-0" />
              <div>
                <div className="text-xs text-[#75675C]">Local Persistence</div>
                <div className="text-sm font-semibold text-[#3E3028]">SQLite + Node.js</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F5EFE6] border border-[#E8DCCB]">
              <Cpu className="w-5 h-5 text-[#A67B5B] shrink-0" />
              <div>
                <div className="text-xs text-[#75675C]">Intelligence</div>
                <div className="text-sm font-semibold text-[#3E3028]">Gemini AI + Fallbacks</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-[#F5EFE6]/70 border-y border-[#E8DCCB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#8B6F47] mb-2 font-semibold">Core Pillars</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#3E3028] tracking-tight">
              Designed Specifically for Learning While Building
            </h3>
            <p className="mt-3 text-[#75675C] text-sm sm:text-base">
              SkillBridge replaces mindless copy-pasting with deep conceptual clarity, step-by-step guidance, and real developer workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="relative p-6 rounded-2xl bg-[#FCF9F5] border border-[#E8DCCB] hover:border-[#8B6F47] transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#5C4033]/10 border border-[#5C4033]/20 flex items-center justify-center text-[#5C4033] group-hover:bg-[#5C4033] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono text-[#8B6F47] bg-[#F5EFE6] border border-[#DCC9B6] px-2 py-0.5 rounded">
                        {feat.badge}
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-[#3E3028] mb-1.5">{feat.title}</h4>
                    <p className="text-xs font-medium text-[#8B6F47] mb-3">{feat.tagline}</p>
                    <p className="text-xs text-[#75675C] leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How SkillBridge Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#8B6F47] mb-2 font-semibold">Execution Flow</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#3E3028] tracking-tight">
              How SkillBridge Works
            </h3>
            <p className="mt-3 text-[#75675C] text-sm">
              From an initial rough concept to an architected, functioning software application.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((wf, idx) => (
              <div key={wf.step} className="relative">
                <div className="text-4xl font-extrabold font-mono text-[#DCC9B6] mb-3">{wf.step}</div>
                <h4 className="text-base font-bold text-[#3E3028] mb-2 flex items-center gap-2">
                  <span>{wf.title}</span>
                </h4>
                <p className="text-xs text-[#75675C] leading-relaxed">{wf.desc}</p>
                {idx < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 -right-4 text-[#DCC9B6]">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Terminal / Code preview card */}
          <div className="mt-16 p-6 rounded-2xl bg-[#F5EFE6] border border-[#DCC9B6] shadow-xl max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCC9B6]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#A67B5B]" />
                <div className="w-3 h-3 rounded-full bg-[#8B6F47]" />
                <div className="w-3 h-3 rounded-full bg-[#5C4033]" />
                <span className="text-xs font-mono text-[#75675C] ml-2">skillbridge-mentor --context=Step-4-REST-API</span>
              </div>
              <span className="text-xs text-[#8B6F47] font-mono font-semibold">Live Session</span>
            </div>
            <div className="py-4 space-y-3 font-mono text-xs">
              <div className="text-[#3E3028]">
                <span className="text-[#5C4033] font-bold">Student:</span> "Why are we using prepared statements in SQLite instead of string interpolation?"
              </div>
              <div className="p-4 rounded-xl bg-[#FCF9F5] border border-[#E8DCCB] text-[#3E3028] shadow-sm">
                <div className="text-[#8B6F47] font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8B6F47]" />
                  <span>SkillBridge AI Mentor:</span>
                </div>
                <p className="mb-2 text-[#75675C]">
                  <strong className="text-[#3E3028]">1. Explanation:</strong> Prepared statements separate the query structure from untrusted user data. The database compiles the SQL syntax once before inserting values.
                </p>
                <p className="mb-2 text-[#75675C]">
                  <strong className="text-[#3E3028]">2. Why it matters:</strong> If you use string interpolation (e.g. <code>WHERE email = '${`email`}'</code>), an attacker can supply <code>' OR 1=1; --</code>, destroying or leaking your data (SQL Injection).
                </p>
                <p className="text-[#75675C]">
                  <strong className="text-[#3E3028]">3. Next Action:</strong> Always write: <code>db.prepare('SELECT * FROM users WHERE email = ?').get(email)</code>. Let us test this in your Step 4 API handler!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#F5EFE6] border-t border-[#E8DCCB]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3E3028] mb-4">
            Ready to Build Your FSD Project with Complete Confidence?
          </h2>
          <p className="text-[#75675C] text-sm max-w-2xl mx-auto mb-8">
            Stop worrying about how to divide components, what technology to choose, or how to explain your architecture during viva evaluations. SkillBridge guides you through every step.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#5C4033] hover:bg-[#4A3227] text-white font-semibold text-sm transition-all shadow-md shadow-[#5C4033]/20"
            >
              <Terminal className="w-4 h-4" />
              <span>Start Your Project Now</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-[#E8DCCB] bg-[#F5EFE6] text-[#75675C] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#5C4033]" />
            <span className="font-semibold text-[#3E3028]">SkillBridge</span>
            <span>— AI-Powered Project Learning Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
