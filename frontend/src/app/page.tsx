'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  BookOpen,
  FileCode2,
  FileText,
  ArrowLeft,
  Share2,
  Download,
  RotateCcw,
  CheckCircle2,
  Flame,
  Zap,
} from 'lucide-react';

import {
  BookBlueprint,
  BookDetail,
  GenerateBookRequest,
  PresetTopic,
  AgentLogEntry,
  UserSettings,
} from '@/types/book';
import {
  fetchPresets,
  fetchBooks,
  fetchBookDetail,
  streamGenerateBook,
  getPdfUrl,
} from '@/lib/api';
import { getStoredSettings } from '@/lib/settings';

import { Navbar } from '@/components/Navbar';
import { SettingsModal } from '@/components/SettingsModal';
import { PromptStudio } from '@/components/PromptStudio';
import { AgentPipelineVisualizer } from '@/components/AgentPipelineVisualizer';
import { LiveAgentTerminal } from '@/components/LiveAgentTerminal';
import { PdfViewer } from '@/components/PdfViewer';
import { TypstEditor } from '@/components/TypstEditor';
import { ChapterReader } from '@/components/ChapterReader';
import { ExportModal } from '@/components/ExportModal';

export default function HomePage() {
  const [presets, setPresets] = useState<PresetTopic[]>([]);
  const [bookCount, setBookCount] = useState<number>(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // App View State: 'prompt' | 'generating' | 'studio'
  const [viewState, setViewState] = useState<'prompt' | 'generating' | 'studio'>('prompt');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [activeBlueprint, setActiveBlueprint] = useState<BookBlueprint | null>(null);
  const [chapterProgress, setChapterProgress] = useState<{
    [key: number]: { status: 'pending' | 'drafting' | 'completed'; preview?: string };
  }>({});
  const [agentLogs, setAgentLogs] = useState<AgentLogEntry[]>([]);
  const [reviewScore, setReviewScore] = useState<number | undefined>(undefined);
  const [compileMs, setCompileMs] = useState<number | undefined>(undefined);

  // Completed / Active Book in Studio
  const [activeBook, setActiveBook] = useState<BookDetail | null>(null);
  const [activeStudioTab, setActiveStudioTab] = useState<'pdf' | 'typst' | 'reader'>('pdf');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const [p, books] = await Promise.all([fetchPresets(), fetchBooks()]);
    setPresets(p);
    setBookCount(books.length);
  };

  const addLog = (
    agent: string,
    message: string,
    level: 'info' | 'success' | 'warning' | 'thought' = 'info'
  ) => {
    const now = new Date().toLocaleTimeString();
    setAgentLogs((prev) => [
      ...prev,
      {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        timestamp: now,
        agent,
        message,
        level,
      },
    ]);
  };

  const handleStartGeneration = async (req: GenerateBookRequest) => {
    const userSettings = getStoredSettings();
    const finalReq: GenerateBookRequest = {
      ...req,
      api_key: userSettings.geminiApiKey || undefined,
      model_choice: userSettings.selectedModel || 'gemini-2.5-pro',
      use_simulation: !!userSettings.useSimulation,
    };

    setIsGenerating(true);
    setViewState('generating');
    setCurrentStage(1);
    setActiveBlueprint(null);
    setChapterProgress({});
    setAgentLogs([]);
    setReviewScore(undefined);
    setCompileMs(undefined);

    addLog('System', `Initiating autonomous publishing pipeline for topic: "${req.topic}"`, 'thought');

    try {
      await streamGenerateBook(finalReq, {
        onPipelineStart: (data) => {
          addLog('Orchestrator', `Pipeline activated with engine: ${data.engine}`, 'info');
        },
        onAgentStatus: (data) => {
          setCurrentStage(data.stage);
          addLog(data.agent, data.message, 'thought');
        },
        onAgentLog: (data) => {
          if (data.chapter_index !== undefined) {
            setChapterProgress((prev) => ({
              ...prev,
              [data.chapter_index]: { status: 'drafting' },
            }));
          }
          addLog(data.agent, data.message, 'info');
        },
        onBlueprintReady: (data) => {
          setActiveBlueprint(data.blueprint);
          const initialProg: Record<number, { status: 'pending' }> = {};
          data.blueprint.chapters.forEach((_: any, idx: number) => {
            initialProg[idx] = { status: 'pending' };
          });
          setChapterProgress(initialProg);
          addLog('Architect Agent', data.log, 'success');
        },
        onChapterComplete: (data) => {
          setChapterProgress((prev) => ({
            ...prev,
            [data.chapter_index]: {
              status: 'completed',
              preview: data.draft_preview,
            },
          }));
          addLog(
            `Writer ${data.chapter_number}`,
            `Finished authoring Chapter ${data.chapter_number}: "${data.title}"`,
            'success'
          );
        },
        onReviewReady: (data) => {
          setReviewScore(data.coherence_score);
          addLog('Reviewer Agent', data.log, 'success');
        },
        onBookCompleted: async (data) => {
          setCurrentStage(4);
          setCompileMs(data.compile_duration_ms);
          addLog('Typst Engine', data.log, 'success');
          
          // Trigger celebration confetti
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#f59e0b', '#fbbf24', '#10b981', '#38bdf8'],
            });
          } catch (e) {}

          // Load completed book details
          const detail = await fetchBookDetail(data.book_id);
          if (detail) {
            setActiveBook(detail);
            setViewState('studio');
          }
          setIsGenerating(false);
          loadInitialData();
        },
        onError: (err) => {
          addLog('Error', `Generation error: ${err?.message || err}`, 'warning');
          setIsGenerating(false);
        },
      });
    } catch (err: any) {
      console.error('Error during book generation:', err);
      addLog('Error', `Pipeline encountered an error: ${err.message}`, 'warning');
      setIsGenerating(false);
    }
  };

  const handleRecompiled = (newSource: string, newCompileMs: number) => {
    setCompileMs(newCompileMs);
    if (activeBook) {
      setActiveBook({
        ...activeBook,
        master_typst: newSource,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        bookCount={bookCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: PROMPT STUDIO */}
        {viewState === 'prompt' && (
          <PromptStudio
            onStartGeneration={handleStartGeneration}
            presets={presets}
            isGenerating={isGenerating}
            onOpenSettings={() => setIsSettingsOpen(true)}
            hasApiKey={typeof window !== 'undefined' && !!getStoredSettings().geminiApiKey}
          />
        )}

        {/* VIEW 2: LIVE GENERATION STREAM */}
        {viewState === 'generating' && (
          <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
            {/* Header / Back button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setViewState('prompt')}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Prompt Studio</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/30">
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span>Multi-Agent Publishing Pipeline Active</span>
              </div>
            </div>

            {/* Visualizer */}
            <AgentPipelineVisualizer
              currentStage={currentStage}
              blueprint={activeBlueprint}
              chapterProgress={chapterProgress}
              reviewScore={reviewScore}
              compileMs={compileMs}
            />

            {/* Live Terminal */}
            <LiveAgentTerminal logs={agentLogs} />
          </div>
        )}

        {/* VIEW 3: COMPLETED BOOK STUDIO & WORKSPACE */}
        {viewState === 'studio' && activeBook && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 animate-in fade-in duration-300">
            {/* Book Workspace Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewState('prompt')}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Create another book"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      {activeBook.blueprint.series}
                    </span>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.2 rounded-full border border-emerald-500/30">
                      Typeset & Verified
                    </span>
                  </div>
                  <h1 className="text-lg font-bold text-slate-100 font-['Outfit']">
                    {activeBook.blueprint.title}
                  </h1>
                </div>
              </div>

              {/* Center Tab Switcher */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveStudioTab('pdf')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                    activeStudioTab === 'pdf'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Publication PDF
                </button>

                <button
                  onClick={() => setActiveStudioTab('typst')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                    activeStudioTab === 'typst'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCode2 className="h-3.5 w-3.5" />
                  Typst Source Editor
                </button>

                <button
                  onClick={() => setActiveStudioTab('reader')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                    activeStudioTab === 'reader'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Academic Reader
                </button>
              </div>

              {/* Right Export / Share button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-xs font-semibold text-slate-200 hover:text-amber-300 transition-all flex items-center gap-1.5"
                >
                  <Share2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Export & Cite</span>
                </button>
              </div>
            </div>

            {/* Active Tab View */}
            {activeStudioTab === 'pdf' && (
              <PdfViewer
                pdfUrl={getPdfUrl(activeBook.id)}
                title={activeBook.blueprint.title}
                pageCount={activeBook.page_count}
                pdfSizeBytes={activeBook.pdf_size_bytes}
              />
            )}

            {activeStudioTab === 'typst' && (
              <TypstEditor
                bookId={activeBook.id}
                initialSource={activeBook.master_typst}
                onRecompiled={handleRecompiled}
              />
            )}

            {activeStudioTab === 'reader' && (
              <ChapterReader
                blueprint={activeBook.blueprint}
                chapterDrafts={activeBook.chapter_drafts}
              />
            )}
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Export Modal */}
      {activeBook && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          book={activeBook}
        />
      )}
    </div>
  );
}
