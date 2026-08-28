'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Sparkles, Settings, Library, Terminal, FileText, Cpu } from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  bookCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings, bookCount = 0 }) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="h-full w-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-100 font-['Outfit']">
                  NISSE
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  SPRINGER AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 tracking-wide">
                Autonomous Academic Monograph Publisher
              </p>
            </div>
          </Link>
        </div>

        {/* Center Nav links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              pathname === '/'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Prompt Studio
          </Link>

          <Link
            href="/library"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              pathname === '/library'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Library className="h-3.5 w-3.5 text-amber-400" />
            Book Shelf
            {bookCount > 0 && (
              <span className="ml-1 text-[10px] bg-slate-800 text-amber-400 px-1.5 py-0.2 rounded-full border border-slate-700">
                {bookCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Right action buttons */}
        <div className="flex items-center gap-2.5">
          {/* Engine status indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
            <Cpu className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span>Typst 0.15</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400/90">Gemini 2.5</span>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="API & Model Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
