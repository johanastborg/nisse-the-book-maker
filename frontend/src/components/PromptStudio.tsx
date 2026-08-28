'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Atom,
  Binary,
  Layers,
  ArrowRight,
  GraduationCap,
  Wand2,
} from 'lucide-react';
import { GenerateBookRequest, PresetTopic } from '@/types/book';

interface PromptStudioProps {
  onStartGeneration: (req: GenerateBookRequest) => void;
  presets: PresetTopic[];
  isGenerating: boolean;
  onOpenSettings?: () => void;
  hasApiKey?: boolean;
}

export const PromptStudio: React.FC<PromptStudioProps> = ({
  onStartGeneration,
  presets,
  isGenerating,
  onOpenSettings,
  hasApiKey = false,
}) => {
  const [topic, setTopic] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced publishing parameters
  const [author, setAuthor] = useState('Prof. Nisse Neumann');
  const [affiliation, setAffiliation] = useState('Institute for Advanced Study, Princeton');
  const [series, setSeries] = useState('Graduate Texts in Contemporary Physics');
  const [discipline, setDiscipline] = useState('Theoretical Physics');
  const [audience, setAudience] = useState('Graduate / PhD Level');
  const [chapterCount, setChapterCount] = useState(4);
  const [rigorLevel, setRigorLevel] = useState('Rigorous Proofs & Derivations');
  const [notationConvention, setNotationConvention] = useState('Metric (-,+,+,+), Einstein Summation');

  const handleSelectPreset = (preset: PresetTopic) => {
    setTopic(preset.topic);
    setSeries(preset.series);
    setDiscipline(preset.discipline);
    setAuthor(preset.author);
    setChapterCount(preset.chapter_count);
    setRigorLevel(preset.rigor_level);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isGenerating) return;

    onStartGeneration({
      topic: topic.trim(),
      author: author.trim(),
      affiliation: affiliation.trim(),
      series,
      discipline,
      audience,
      chapter_count: chapterCount,
      rigor_level: rigorLevel,
      notation_convention: notationConvention,
    });
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-8 sm:py-14">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Header */}
      <div className="text-center space-y-4 mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold tracking-wide shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Autonomous Multi-Agent Academic Publishing Pipeline</span>
          </div>

          <button
            type="button"
            onClick={onOpenSettings}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              hasApiKey
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-amber-500/40 hover:text-amber-300'
            }`}
          >
            <div className={`h-2 w-2 rounded-full ${hasApiKey ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            <span>{hasApiKey ? 'Gemini 2.5 Live Agents Connected' : 'Engine: Dynamic Monograph Synthesizer (Click to add API Key)'}</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight font-['Outfit']">
          Lovable for{' '}
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            Springer Books
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 font-light leading-relaxed">
          From natural language prompt to a publication-grade mathematical textbook in seconds.
          Architected by Gemini agents, typeset deterministically by Typst.
        </p>
      </div>

      {/* Main Prompt Card */}
      <div className="glass-panel-glow rounded-3xl p-4 sm:p-7 shadow-2xl relative overflow-hidden border border-slate-700/80">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Natural Language Prompt Input */}
          <div className="space-y-2">
            <div className="relative">
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Describe the academic textbook or monograph you want to generate (e.g., 'Space-Time Physics & Differential Geometry covering Lorentzian manifolds, Christoffel symbols, Einstein field equations, and black hole singularity theorems')..."
                rows={4}
                className="w-full px-5 py-4 rounded-2xl bg-slate-950/80 border border-slate-700/90 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-100 placeholder-slate-500 text-sm sm:text-base outline-none resize-none transition-all shadow-inner leading-relaxed"
                disabled={isGenerating}
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Toggle Advanced Config Drawer */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-amber-400" />
              <span>Publishing Specifications</span>
              {showAdvanced ? (
                <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={!topic.trim() || isGenerating}
              className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all group hover:scale-[1.02] active:scale-[0.98]"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Publishing in Progress...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  <span>Generate Publication Book</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Advanced Publishing Parameters Drawer */}
          {showAdvanced && (
            <div className="pt-5 border-t border-slate-800/80 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Series Preset */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Publisher Series Template</label>
                  <select
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-amber-500 outline-none"
                  >
                    <option value="Graduate Texts in Contemporary Physics">Springer Graduate Texts in Physics</option>
                    <option value="Graduate Texts in Mathematics">Springer Graduate Texts in Mathematics (GTM)</option>
                    <option value="Lecture Notes in Computer Science (LNCS)">Lecture Notes in Computer Science (LNCS)</option>
                    <option value="Springer Monographs in Quantum Science">Springer Monographs in Quantum Science</option>
                    <option value="Frontiers in Theoretical Sciences">Frontiers in Theoretical Sciences</option>
                  </select>
                </div>

                {/* Target Audience */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Target Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-amber-500 outline-none"
                  >
                    <option value="Graduate / PhD Level">Graduate Students & PhD Researchers</option>
                    <option value="Advanced Undergraduate">Advanced Undergraduate</option>
                    <option value="Postdoctoral & Faculty">Postdoctoral Specialists & Faculty</option>
                    <option value="Industry Research Specialists">Applied & Industry Researchers</option>
                  </select>
                </div>

                {/* Rigor Level */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Mathematical Rigor</label>
                  <select
                    value={rigorLevel}
                    onChange={(e) => setRigorLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-amber-500 outline-none"
                  >
                    <option value="Rigorous Proofs & Derivations">Axiomatic Proofs & Complete Derivations</option>
                    <option value="Formal & Algorithmic">Formal Definitions & Algorithmic Focus</option>
                    <option value="Pedagogical & Intuitive">Pedagogical, Examples & Intuition</option>
                  </select>
                </div>

                {/* Chapter Count Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>Chapter Count</span>
                    <span className="text-amber-400">{chapterCount} Chapters</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={6}
                    step={1}
                    value={chapterCount}
                    onChange={(e) => setChapterCount(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>2 (Brief Monograph)</span>
                    <span>4 (Standard)</span>
                    <span>6 (Comprehensive)</span>
                  </div>
                </div>

                {/* Author Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Author Name(s)</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-amber-500 outline-none"
                  />
                </div>

                {/* Affiliation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Institution / Affiliation</label>
                  <input
                    type="text"
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Preset Inspiration Chips */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <GraduationCap className="h-4 w-4 text-amber-400" />
          <span>Curated Academic Monograph Inspiration:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-900 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  {p.discipline}
                </div>
                <div className="text-xs font-bold text-slate-200 mt-1 line-clamp-2 group-hover:text-amber-300 transition-colors">
                  {p.topic}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {p.description}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>{p.chapter_count} Chapters</span>
                <span className="text-amber-400 group-hover:translate-x-1 transition-transform">
                  Load Preset →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
