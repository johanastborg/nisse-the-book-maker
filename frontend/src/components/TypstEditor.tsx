'use client';

import React, { useState } from 'react';
import {
  FileCode2,
  Play,
  Download,
  Copy,
  Check,
  RotateCcw,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { recompileBook, getTypstUrl } from '@/lib/api';

interface TypstEditorProps {
  bookId: string;
  initialSource: string;
  onRecompiled?: (newSource: string, compileMs: number) => void;
}

export const TypstEditor: React.FC<TypstEditorProps> = ({
  bookId,
  initialSource,
  onRecompiled,
}) => {
  const [source, setSource] = useState(initialSource);
  const [isCompiling, setIsCompiling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastCompileMs, setLastCompileMs] = useState<number | null>(null);

  const handleRecompile = async () => {
    setIsCompiling(true);
    setErrorMsg(null);
    const t0 = performance.now();
    try {
      const updated = await recompileBook(bookId, source);
      const compileTime = Math.round(performance.now() - t0);
      setLastCompileMs(compileTime);
      onRecompiled?.(source, compileTime);
    } catch (err: any) {
      setErrorMsg(err.message || 'LaTeX compilation failed');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleReset = () => {
    if (confirm('Reset LaTeX source code to initial generated version?')) {
      setSource(initialSource);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col h-[750px] overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800 text-xs gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <FileCode2 className="h-4 w-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-200">master.tex</span>
            <span className="text-[10px] text-slate-500 ml-2 font-mono">
              Springer LaTeX Preamble & Equations
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {lastCompileMs !== null && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 px-2 py-1 rounded bg-slate-900 border border-slate-800">
              <Zap className="h-3 w-3" />
              Compiled in {lastCompileMs}ms
            </span>
          )}

          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Copy Source"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

          <a
            href={getTypstUrl(bookId)}
            download={`${bookId}_master.tex`}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Download .tex source"
          >
            <Download className="h-3.5 w-3.5" />
          </a>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset to Initial"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* Recompile Button */}
          <button
            onClick={handleRecompile}
            disabled={isCompiling}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
          >
            {isCompiling ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Compiling...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-slate-950" />
                <span>Recompile PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Compilation Error Banner */}
      {errorMsg && (
        <div className="px-4 py-2 bg-rose-950/80 border-b border-rose-800 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span className="font-mono text-[11px]">{errorMsg}</span>
        </div>
      )}

      {/* Editor Text Area */}
      <div className="flex-1 bg-slate-950 relative font-mono text-xs">
        <textarea
          value={source}
          onChange={(e) => setSource(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-4 bg-transparent text-slate-200 font-mono text-xs leading-relaxed outline-none resize-none selection:bg-amber-500/30 focus:ring-0 border-0"
        />
      </div>
    </div>
  );
};
