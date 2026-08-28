'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Copy, Check, ChevronDown } from 'lucide-react';
import { AgentLogEntry } from '@/types/book';

interface LiveAgentTerminalProps {
  logs: AgentLogEntry[];
}

export const LiveAgentTerminal: React.FC<LiveAgentTerminalProps> = ({ logs }) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleCopy = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.agent}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-400 font-semibold ml-2 flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-amber-400" />
            Live Agent Thoughts & Execution Stream
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
              autoScroll
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Auto-Scroll: {autoScroll ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={handleCopy}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Copy Terminal Logs"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className="p-4 max-h-64 overflow-y-auto space-y-2 text-slate-300 font-mono text-[11px] leading-relaxed">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic py-4 text-center">
            Agent stream initialized. Waiting for pipeline execution events...
          </div>
        ) : (
          logs.map((log) => {
            const isSuccess = log.level === 'success';
            const isThought = log.level === 'thought';
            const isWarning = log.level === 'warning';

            return (
              <div key={log.id} className="flex items-start gap-2.5 hover:bg-slate-900/50 p-1 rounded">
                <span className="text-slate-500 shrink-0 text-[10px]">{log.timestamp}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase shrink-0 ${
                    log.agent.includes('Architect')
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      : log.agent.includes('Writer')
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : log.agent.includes('Reviewer')
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {log.agent}
                </span>
                <span
                  className={
                    isSuccess
                      ? 'text-emerald-300 font-medium'
                      : isThought
                      ? 'text-amber-200/90 italic'
                      : isWarning
                      ? 'text-rose-400'
                      : 'text-slate-300'
                  }
                >
                  {log.message}
                </span>
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
