'use client';

import React, { useState, useEffect } from 'react';
import katex from 'katex';
import { BookBlueprint } from '@/types/book';
import {
  BookOpen,
  ChevronRight,
  ListTree,
  Type,
  Bookmark,
  Share2,
} from 'lucide-react';

interface ChapterReaderProps {
  blueprint: BookBlueprint;
  chapterDrafts: string[];
}

export const ChapterReader: React.FC<ChapterReaderProps> = ({
  blueprint,
  chapterDrafts,
}) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  const currentDraft = chapterDrafts[activeChapter] || '';
  const currentChapter = blueprint.chapters[activeChapter];

  // Helper to render KaTeX math safely
  const renderMathContent = (rawText: string) => {
    // Process block math ($ ... $ on own line or between text)
    // Replace Typst environments #definition, #theorem, #proof with HTML
    let processed = rawText;

    // Clean up Typst headings for display
    processed = processed.replace(/^=\s+(.*)$/gm, '<h1 class="text-2xl font-bold text-slate-100 font-[\'Outfit\'] border-b border-amber-500/40 pb-2 mb-4 mt-6">$1</h1>');
    processed = processed.replace(/^==\s+(.*)$/gm, '<h2 class="text-xl font-bold text-amber-300 font-[\'Outfit\'] mt-6 mb-3">$1</h2>');
    processed = processed.replace(/^===\s+(.*)$/gm, '<h3 class="text-base font-semibold text-slate-200 mt-4 mb-2">$1</h3>');

    // Chapter abstract block
    processed = processed.replace(
      /#chapter-abstract\[([\s\S]*?)\]/g,
      '<div class="p-4 rounded-xl bg-slate-900 border-l-4 border-blue-500 my-4 text-xs text-slate-300 italic">$1</div>'
    );

    // Callout blocks: #theorem, #definition, #lemma, #proof, #example, #remark
    processed = processed.replace(
      /#definition\(title:\s*"([^"]+)"\)\[([\s\S]*?)\]/g,
      '<div class="p-4 rounded-r-xl bg-emerald-950/30 border-l-4 border-emerald-500 my-4 text-xs text-emerald-100"><div class="font-bold text-emerald-400 mb-1">$1</div><div>$2</div></div>'
    );

    processed = processed.replace(
      /#theorem\(title:\s*"([^"]+)"\)\[([\s\S]*?)\]/g,
      '<div class="p-4 rounded-r-xl bg-amber-950/30 border-l-4 border-amber-500 my-4 text-xs text-amber-100"><div class="font-bold text-amber-400 mb-1">$1</div><div class="italic">$2</div></div>'
    );

    processed = processed.replace(
      /#lemma\(title:\s*"([^"]+)"\)\[([\s\S]*?)\]/g,
      '<div class="p-4 rounded-r-xl bg-slate-900 border-l-4 border-slate-400 my-4 text-xs text-slate-200"><div class="font-bold text-slate-300 mb-1">$1</div><div class="italic">$2</div></div>'
    );

    processed = processed.replace(
      /#proof\[([\s\S]*?)\]/g,
      '<div class="p-4 rounded-xl border-l-2 border-slate-600 bg-slate-950/50 my-4 text-xs text-slate-300"><div class="font-bold italic text-slate-400 mb-1">Proof.</div><div>$1</div><div class="text-right text-slate-500 font-mono">∎</div></div>'
    );

    processed = processed.replace(
      /#example\(title:\s*"([^"]+)"\)\[([\s\S]*?)\]/g,
      '<div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 my-4 text-xs text-slate-300"><div class="font-bold text-slate-200 mb-1">$1</div><div>$2</div></div>'
    );

    processed = processed.replace(
      /#remark\(title:\s*"([^"]+)"\)\[([\s\S]*?)\]/g,
      '<div class="py-2 text-xs text-slate-400 italic my-2"><span class="font-bold not-italic text-slate-300">$1: </span>$2</div>'
    );

    // KaTeX equation rendering for $ ... $
    const parts = processed.split(/(\$[^\$]+\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const mathExpr = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(mathExpr, {
            throwOnError: false,
            displayMode: mathExpr.includes('\n') || mathExpr.length > 35,
          });
          return (
            <span
              key={index}
              dangerouslySetInnerHTML={{ __html: html }}
              className="inline-block px-0.5"
            />
          );
        } catch (e) {
          return <code key={index} className="text-amber-400 font-mono text-xs">{part}</code>;
        }
      }
      return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  const getFontSizeClass = () => {
    if (fontSize === 'large') return 'text-base leading-relaxed';
    if (fontSize === 'xlarge') return 'text-lg leading-loose';
    return 'text-sm leading-relaxed';
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row h-[750px] overflow-hidden">
      {/* Chapter Navigation Sidebar */}
      <div className="w-full md:w-72 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <ListTree className="h-4 w-4 text-amber-400" />
            <span>Table of Contents</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {blueprint.chapters.length} Chapters
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {blueprint.chapters.map((ch, idx) => (
            <button
              key={ch.number}
              onClick={() => setActiveChapter(idx)}
              className={`w-full p-3 rounded-xl text-left text-xs transition-all flex items-start justify-between group ${
                activeChapter === idx
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <div>
                <div className="text-[10px] font-mono text-amber-400/90 font-bold uppercase">
                  Chapter {ch.number}
                </div>
                <div className="line-clamp-2 mt-0.5">{ch.title}</div>
              </div>
              <ChevronRight
                className={`h-4 w-4 shrink-0 transition-transform ${
                  activeChapter === idx ? 'text-amber-400 translate-x-0.5' : 'text-slate-600'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main Chapter Content Area */}
      <div className="flex-1 flex flex-col bg-slate-950/60 overflow-hidden">
        {/* Top Reading Controls Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900/90 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-amber-400" />
            <span className="font-semibold text-slate-200 font-['Outfit']">
              {currentChapter ? `Chapter ${currentChapter.number}: ${currentChapter.title}` : 'Reading'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Size Adjuster */}
            <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
              {(['normal', 'large', 'xlarge'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                    fontSize === sz ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sz === 'normal' ? 'A' : sz === 'large' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chapter Prose Reader */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 font-serif text-slate-200">
          <div className={`max-w-3xl mx-auto space-y-4 font-['EB_Garamond',serif] ${getFontSizeClass()}`}>
            {currentDraft ? (
              renderMathContent(currentDraft)
            ) : (
              <div className="text-slate-500 italic py-10 text-center">
                Drafting chapter mathematical text...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
