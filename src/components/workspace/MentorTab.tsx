import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  RefreshCw,
  Terminal,
  HelpCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { Project, MentorMessage } from '../../types';
import { api } from '../../services/api';

interface Props {
  project: Project;
  currentStepId?: string;
  initialQuestion?: string;
  onClearInitialQuestion?: () => void;
}

export const MentorTab: React.FC<Props> = ({
  project,
  currentStepId,
  initialQuestion,
  onClearInitialQuestion,
}) => {
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat history from SQLite database
  useEffect(() => {
    let mounted = true;
    api.getMentorMessages(project.id)
      .then((res) => {
        if (mounted) {
          setMessages(res.messages || []);
        }
      })
      .catch((err) => console.warn('Could not load chat history:', err))
      .finally(() => {
        if (mounted) setFetchingHistory(false);
      });

    return () => {
      mounted = false;
    };
  }, [project.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle pre-filled question passed from another tab
  useEffect(() => {
    if (initialQuestion && !loading) {
      handleSendMessage(initialQuestion);
      if (onClearInitialQuestion) {
        onClearInitialQuestion();
      }
    }
  }, [initialQuestion]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    if (!textToSend) {
      setInput('');
    }

    // Optimistically add user message
    const tempUserMsg: MentorMessage = {
      id: 'temp-' + Date.now(),
      project_id: project.id,
      role: 'user',
      message: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      setLoading(true);

      // Identify active step name
      let stepName = 'General Development';
      if (currentStepId) {
        for (const phase of project.plan.phases || []) {
          for (const s of phase.steps || []) {
            if (s.id === currentStepId) {
              stepName = `${phase.name} -> ${s.title}`;
              break;
            }
          }
        }
      }

      const res = await api.sendMentorMessage({
        projectId: project.id,
        message: text,
        currentStep: stepName,
        projectContext: `Project: ${project.name}. Tech Stack: ${(project.plan.techStack || []).map(t => t.technology).join(', ')}. Objective: ${project.plan.overview.objective}`,
      });

      const assistantMsg: MentorMessage = {
        id: 'reply-' + Date.now(),
        project_id: project.id,
        role: 'assistant',
        message: res.reply,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: MentorMessage = {
        id: 'err-' + Date.now(),
        project_id: project.id,
        role: 'assistant',
        message: `### 1. Explanation\nI ran into a temporary issue connecting to the inference engine: ${err.message}.\n\n### 2. Why it matters\nNetwork or server state errors must be caught gracefully.\n\n### 3. What to do next\nPlease try resending your question or verify the backend server console.`,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'Explain the next implementation step simply.',
    'Why is SQLite with Node.js ideal for an FSD viva?',
    'What does a JWT token payload contain?',
    'How do I handle async errors in Express routes?',
    'What are the key viva questions for this project?'
  ];

  return (
    <div className="flex flex-col h-[750px] bg-[#F5EFE6] border border-[#E8DCCB] rounded-2xl overflow-hidden shadow-md">
      {/* Mentor Header */}
      <div className="p-4 bg-[#FCF9F5] border-b border-[#E8DCCB] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#5C4033]/10 border border-[#5C4033]/20 flex items-center justify-center text-[#5C4033]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#3E3028]">SkillBridge AI Mentor</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E8DCCB] text-[#5C4033] border border-[#DCC9B6] font-medium">
                Context-Aware
              </span>
            </div>
            <p className="text-xs text-[#75675C]">
              Guidance tailored to: <span className="text-[#3E3028] font-semibold">{project.name}</span>
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[11px] font-mono text-[#75675C]">
            Rule: 1. Explanation • 2. Why it matters • 3. Next action
          </span>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-[#FCF9F5]">
        {fetchingHistory ? (
          <div className="h-full flex flex-col items-center justify-center text-[#75675C]">
            <Loader2 className="w-6 h-6 animate-spin text-[#5C4033] mb-2" />
            <span className="text-xs font-mono">Loading project mentor history...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto p-4">
            <div className="w-12 h-12 rounded-2xl bg-[#5C4033]/10 border border-[#5C4033]/20 text-[#5C4033] flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#3E3028] mb-1">Hello! I am your SkillBridge Mentor.</h4>
            <p className="text-xs text-[#75675C] mb-6 leading-relaxed">
              I understand your project architecture, tech stack, and step-by-step roadmap. Ask me to clarify concepts, review code, or recommend what to do next.
            </p>

            <div className="w-full text-left space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8B6F47] block font-semibold">
                Suggested questions:
              </span>
              {quickQuestions.slice(0, 3).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="w-full text-left p-2.5 rounded-lg bg-[#F5EFE6] hover:bg-[#E8DCCB] border border-[#DCC9B6] text-xs text-[#3E3028] hover:text-[#5C4033] transition-colors flex items-center justify-between"
                >
                  <span className="line-clamp-1">{q}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8B6F47] shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-[#5C4033]/10 border border-[#5C4033]/20 flex items-center justify-center text-[#5C4033] shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#5C4033] text-white rounded-br-sm shadow-md'
                      : 'bg-[#F5EFE6] border border-[#E8DCCB] text-[#3E3028] rounded-bl-sm shadow-sm'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{m.message}</p>
                  ) : (
                    <div className="prose prose-xs max-w-none space-y-2">
                      {m.message.split('\n\n').map((paragraph, pIdx) => {
                        if (paragraph.startsWith('### ')) {
                          return (
                            <h4
                              key={pIdx}
                              className="font-bold text-[#5C4033] text-xs uppercase tracking-wider mt-2 mb-1"
                            >
                              {paragraph.replace('### ', '')}
                            </h4>
                          );
                        }
                        return (
                          <p key={pIdx} className="text-[#3E3028] whitespace-pre-wrap leading-relaxed">
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-[#E8DCCB] border border-[#DCC9B6] flex items-center justify-center text-[#5C4033] shrink-0 mt-1 font-semibold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-[#5C4033]/10 border border-[#5C4033]/20 flex items-center justify-center text-[#5C4033] shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-[#F5EFE6] border border-[#E8DCCB] text-xs text-[#75675C] flex items-center gap-2 shadow-sm">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5C4033]" />
              <span>SkillBridge Mentor is formulating guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-[#F5EFE6] border-t border-[#E8DCCB] overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[10px] font-mono text-[#75675C] shrink-0 font-medium">Prompt chips:</span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={loading}
            className="text-[11px] px-2.5 py-1 rounded-md bg-[#FCF9F5] hover:bg-[#E8DCCB] text-[#3E3028] border border-[#DCC9B6] hover:border-[#8B6F47] whitespace-nowrap shrink-0 transition-colors font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 bg-[#FCF9F5] border-t border-[#E8DCCB]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your mentor (e.g. 'Explain this step', 'Why are we using SQLite?', 'Show code example')..."
            className="flex-1 px-4 py-2.5 bg-[#F5EFE6] border border-[#DCC9B6] rounded-xl text-xs sm:text-sm text-[#3E3028] placeholder-[#75675C] focus:outline-none focus:border-[#5C4033] transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 bg-[#5C4033] hover:bg-[#4A3227] disabled:opacity-50 text-white rounded-xl transition-all shrink-0 shadow-sm shadow-[#5C4033]/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
