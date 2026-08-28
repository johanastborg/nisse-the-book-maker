'use client';

import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  FileCode2,
  BookOpen,
  Copy,
  Check,
  Package,
} from 'lucide-react';
import { BookDetail } from '@/types/book';
import { getPdfUrl, getTypstUrl } from '@/lib/api';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: BookDetail;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  book,
}) => {
  const [copiedBibtex, setCopiedBibtex] = useState(false);

  if (!isOpen) return null;

  const bibtex = `@book{${book.id},
  title     = {${book.blueprint.title}: ${book.blueprint.subtitle}},
  author    = {${book.blueprint.author}},
  series    = {${book.blueprint.series}},
  publisher = {Springer AI Publishing Pipeline},
  year      = {2026},
  note      = {Typeset via Typst Compiler}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-['Outfit']">
                Export & Publishing Suite
              </h2>
              <p className="text-xs text-slate-400">
                Download publication artifacts and citations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Options */}
        <div className="py-5 space-y-4">
          {/* 1. Publication PDF */}
          <a
            href={getPdfUrl(book.id)}
            download={`${book.blueprint.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`}
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                  Publication-Quality PDF (.pdf)
                </div>
                <div className="text-[11px] text-slate-500">
                  {book.page_count} Pages • {(book.pdf_size_bytes / 1024).toFixed(1)} KB • Springer Yellow Layout
                </div>
              </div>
            </div>
            <Download className="h-4 w-4 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
          </a>

          {/* 2. LaTeX Master Source */}
          <a
            href={getTypstUrl(book.id)}
            download={`${book.id}_master.tex`}
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <FileCode2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                  LaTeX Master Project Source (.tex)
                </div>
                <div className="text-[11px] text-slate-500">
                  Compiles directly with `lualatex`, `xelatex`, or `tectonic`
                </div>
              </div>
            </div>
            <Download className="h-4 w-4 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
          </a>

          {/* 3. BibTeX Citation */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">BibTeX Academic Citation</span>
              <button
                onClick={handleCopyBibtex}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                {copiedBibtex ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                {copiedBibtex ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-slate-900 text-[10px] font-mono text-slate-400 overflow-x-auto">
              {bibtex}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
