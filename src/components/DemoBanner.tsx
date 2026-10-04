import React, { useEffect, useState } from 'react';
import { Sparkles, Info, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const DemoBanner: React.FC = () => {
  const [status, setStatus] = useState<{ geminiConnected: boolean; demoMode: boolean } | null>(null);

  useEffect(() => {
    api.getStatus()
      .then(res => setStatus({ geminiConnected: res.geminiConnected, demoMode: res.demoMode }))
      .catch(() => setStatus({ geminiConnected: false, demoMode: true }));
  }, []);

  if (!status) return null;

  return (
    <div className={`text-xs py-1.5 px-4 flex items-center justify-between border-b transition-colors ${
      status.geminiConnected
        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
        : 'bg-amber-950/40 text-amber-300 border-amber-800/40'
    }`}>
      <div className="flex items-center gap-2 mx-auto sm:mx-0">
        {status.geminiConnected ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-medium">Live Gemini AI Active:</span>
            <span className="text-emerald-400/80">Real-time intelligent reasoning and plan generation connected.</span>
          </>
        ) : (
          <>
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-medium">Demo AI mode</span>
            <span className="text-amber-400/80 hidden sm:inline">— connect Gemini API for live AI responses. All features, roadmaps, and mentors are fully functional.</span>
          </>
        )}
      </div>
      <div className="hidden sm:flex items-center gap-1.5 text-[11px] opacity-80">
        <Sparkles className="w-3 h-3 text-indigo-400" />
        <span>FSD Viva Ready</span>
      </div>
    </div>
  );
};
