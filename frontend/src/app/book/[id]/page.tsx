'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  FileCode2,
  BookOpen,
  Share2,
  Download,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { BookDetail } from '@/types/book';
import { fetchBookDetail, getPdfUrl, fetchBooks } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { SettingsModal } from '@/components/SettingsModal';
import { PdfViewer } from '@/components/PdfViewer';
import { TypstEditor } from '@/components/TypstEditor';
import { ChapterReader } from '@/components/ChapterReader';
import { ExportModal } from '@/components/ExportModal';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const [book, setBook] = useState<BookDetail | null>(null);
  const [bookCount, setBookCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pdf' | 'typst' | 'reader'>('pdf');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    if (bookId) {
      loadBook();
    }
  }, [bookId]);

  const loadBook = async () => {
    setIsLoading(true);
    const [detail, allBooks] = await Promise.all([
      fetchBookDetail(bookId),
      fetchBooks(),
    ]);
    setBook(detail);
    setBookCount(allBooks.length);
    setIsLoading(false);
  };

  const handleRecompiled = (newSource: string, newCompileMs: number) => {
    if (book) {
      setBook({
        ...book,
        master_typst: newSource,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading monograph workspace...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans text-slate-100">
        <div className="text-center space-y-4 max-w-md">
          <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400 w-fit mx-auto border border-amber-500/20">
            <BookOpen className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold font-['Outfit']">Monograph Not Found</h2>
          <p className="text-xs text-slate-400">
            The book ID `{bookId}` could not be retrieved from local storage.
          </p>
          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Bookshelf</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        bookCount={bookCount}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-5">
        {/* Top Header & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <Link
              href="/library"
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Back to Bookshelf"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  {book.blueprint.series}
                </span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.2 rounded-full border border-emerald-500/30">
                  {book.page_count} Pages
                </span>
              </div>
              <h1 className="text-lg font-bold text-slate-100 font-['Outfit']">
                {book.blueprint.title}
              </h1>
            </div>
          </div>

          {/* Center View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'pdf'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Publication PDF
            </button>

            <button
              onClick={() => setActiveTab('typst')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'typst'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode2 className="h-3.5 w-3.5" />
              Typst Source Editor
            </button>

            <button
              onClick={() => setActiveTab('reader')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'reader'
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

        {/* View Tabs */}
        {activeTab === 'pdf' && (
          <PdfViewer
            pdfUrl={getPdfUrl(book.id)}
            title={book.blueprint.title}
            pageCount={book.page_count}
            pdfSizeBytes={book.pdf_size_bytes}
          />
        )}

        {activeTab === 'typst' && (
          <TypstEditor
            bookId={book.id}
            initialSource={book.master_typst}
            onRecompiled={handleRecompiled}
          />
        )}

        {activeTab === 'reader' && (
          <ChapterReader
            blueprint={book.blueprint}
            chapterDrafts={book.chapter_drafts}
          />
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        book={book}
      />
    </div>
  );
}
