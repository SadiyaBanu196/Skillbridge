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
        ? 'bg-[#EBF2EB] text-[#2F4F2F] border-[#CDE0CD]'
        : 'bg-[#F7EFE3] text-[#7A5420] border-[#EBD6BC]'
    }`}>
      <div className="flex items-center gap-2 mx-auto sm:mx-0">
        {status.geminiConnected ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#3D633D] shrink-0" />
            <span className="font-semibold">Live Gemini AI Active:</span>
            <span className="text-[#3E5C3E]">Real-time intelligent reasoning and plan generation connected.</span>
          </>
        ) : (
          <>
            <Info className="w-3.5 h-3.5 text-[#8B6F47] shrink-0" />
            <span className="font-semibold">Demo AI mode</span>
            <span className="text-[#75675C] hidden sm:inline">— connect Gemini API for live AI responses. All features, roadmaps, and mentors are fully functional.</span>
          </>
        )}
      </div>
      <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#75675C]">
        <Sparkles className="w-3 h-3 text-[#8B6F47]" />
        <span>FSD Viva Ready</span>
      </div>
    </div>
  );
};
