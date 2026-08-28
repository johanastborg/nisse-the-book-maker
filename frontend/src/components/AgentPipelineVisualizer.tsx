'use client';

import React from 'react';
import {
  Compass,
  PenTool,
  CheckCircle2,
  FileCode2,
  Check,
  Cpu,
  Clock,
  Sparkles,
  BookMarked,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { BookBlueprint } from '@/types/book';

interface AgentPipelineVisualizerProps {
  currentStage: number; // 1 to 4
  blueprint: BookBlueprint | null;
  chapterProgress: {
    [key: number]: {
      status: 'pending' | 'drafting' | 'completed';
      preview?: string;
    };
  };
  reviewScore?: number;
  compileMs?: number;
  pdfSizeBytes?: number;
}

export const AgentPipelineVisualizer: React.FC<AgentPipelineVisualizerProps> = ({
  currentStage,
  blueprint,
  chapterProgress,
  reviewScore,
  compileMs,
  pdfSizeBytes,
}) => {
  const stages = [
    {
      id: 1,
      name: 'Architect Agent',
      icon: Compass,
      model: 'Gemini 2.5 Flash',
      desc: 'Synthesizing Book Blueprint & Chapter Taxonomy',
    },
    {
      id: 2,
      name: 'Writer Agents',
      icon: PenTool,
      model: 'Gemini 2.5 Flash (Parallel)',
      desc: 'Concurrent Mathematical Derivations & LaTeX Markup',
    },
    {
      id: 3,
      name: 'Reviewer Agent',
      icon: CheckCircle2,
      model: 'Gemini 2.5 Flash',
      desc: 'Notation Unification & Springer LaTeX Bibliography',
    },
    {
      id: 4,
      name: 'LaTeX Engine',
      icon: FileCode2,
      model: 'LuaLaTeX / Tectonic',
      desc: 'Deterministic Springer Monograph PDF Typesetting',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4-Stage Horizontal Pipeline Graph */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isDone = currentStage > stage.id;
          const isCurrent = currentStage === stage.id;
          const isPending = currentStage < stage.id;

          return (
            <div
              key={stage.id}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                isCurrent
                  ? 'bg-amber-500/10 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                  : isDone
                  ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                  : 'bg-slate-950/40 border-slate-900 opacity-60 text-slate-500'
              }`}
            >
              {/* Active top line */}
              {isCurrent && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 animate-pulse" />
              )}

              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-xl border ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : isDone
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="text-[10px] font-mono font-semibold">
                  {isDone ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Check className="h-3 w-3" /> Completed
                    </span>
                  ) : isCurrent ? (
                    <span className="flex items-center gap-1 text-amber-400 animate-pulse">
                      <Zap className="h-3 w-3" /> Active
                    </span>
                  ) : (
                    <span className="text-slate-600">Pending</span>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs font-bold text-slate-200">{stage.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-light leading-tight">
                  {stage.desc}
                </div>
              </div>

              <div className="mt-2 text-[10px] font-mono text-amber-400/80">
                {stage.model}
              </div>
            </div>
          );
        })}
      </div>

      {/* Blueprint & Chapters Progress Status */}
      {blueprint && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                {blueprint.series}
              </span>
              <h3 className="text-base font-bold text-slate-100 font-['Outfit']">
                {blueprint.title}
              </h3>
              <p className="text-xs text-slate-400 italic">{blueprint.subtitle}</p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              {reviewScore !== undefined && (
                <div className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700">
                  Peer Review Score: {reviewScore}/100
                </div>
              )}
              {compileMs !== undefined && (
                <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  LaTeX: {compileMs}ms
                </div>
              )}
            </div>
          </div>

          {/* Chapter Parallel Writing Cards */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <BookMarked className="h-3.5 w-3.5 text-amber-400" />
              <span>Chapter Authoring Status ({blueprint.chapters.length} Chapters)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {blueprint.chapters.map((ch, idx) => {
                const prog = chapterProgress[idx] || { status: 'pending' };
                const isWriting = prog.status === 'drafting';
                const isDone = prog.status === 'completed';

                return (
                  <div
                    key={ch.number}
                    className={`p-3 rounded-xl border transition-all ${
                      isWriting
                        ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30'
                        : isDone
                        ? 'bg-slate-950/60 border-slate-800'
                        : 'bg-slate-950/30 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-400 font-mono">
                        Chapter {ch.number}
                      </span>
                      <span className="text-[10px] font-mono">
                        {isDone ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                            <Check className="h-3 w-3" /> Drafted
                          </span>
                        ) : isWriting ? (
                          <span className="text-amber-400 animate-pulse flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                            Writing LaTeX Math...
                          </span>
                        ) : (
                          <span className="text-slate-600">Queued</span>
                        )}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-200 mt-1 line-clamp-1">
                      {ch.title}
                    </div>

                    <div className="text-[10px] text-slate-500 mt-1">
                      {ch.sections.length} Sections ({ch.sections.map((s) => s.title).slice(0, 2).join(', ')}...)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
