'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Library,
  BookOpen,
  FileText,
  Search,
  Download,
  Trash2,
  Sparkles,
  ArrowLeft,
  GraduationCap,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { BookSummary } from '@/types/book';
import { fetchBooks, deleteBook, getPdfUrl } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { SettingsModal } from '@/components/SettingsModal';

export default function LibraryPage() {
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoading(true);
    const data = await fetchBooks();
    setBooks(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Delete this generated book from local storage?')) {
      await deleteBook(id);
      loadBooks();
    }
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.discipline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        bookCount={books.length}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Library className="h-4 w-4" />
              <span>Academic Monograph Repository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-['Outfit'] mt-1">
              Your Published Bookshelf
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore, read, and export books compiled by the autonomous publishing engine.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, authors..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-500 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
              />
            </div>

            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-yellow-400 transition-all shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Book</span>
            </Link>
          </div>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading published monograph repository...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400 w-fit mx-auto border border-amber-500/20">
              <BookOpen className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-200">No books found</h3>
              <p className="text-xs text-slate-400">
                {searchQuery ? 'No monographs match your search term.' : 'Generate your first publication-grade monograph!'}
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Open Prompt Studio</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-amber-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
              >
                {/* Book Cover Banner */}
                <div className="p-5 bg-gradient-to-b from-amber-500/10 via-slate-900/40 to-slate-900/80 border-b border-slate-800/80 relative">
                  <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold tracking-wider uppercase mb-2">
                    <span>{book.series}</span>
                    <span className="font-mono text-slate-500">{book.created_at?.split(' ')[0]}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 font-['Outfit'] group-hover:text-amber-300 transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-400 italic mt-1 line-clamp-1">{book.subtitle}</p>

                  <div className="mt-3 text-xs text-slate-300 font-medium">
                    {book.author}
                  </div>
                </div>

                {/* Metadata & Actions */}
                <div className="p-5 pt-3 space-y-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>{book.chapter_count} Chapters</span>
                    <span>•</span>
                    <span>{book.page_count} Pages</span>
                    <span>•</span>
                    <span className="font-mono text-emerald-400">
                      {(book.pdf_size_bytes / 1024).toFixed(0)} KB
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <a
                      href={getPdfUrl(book.id)}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-[11px] font-semibold text-slate-300 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>PDF</span>
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDelete(book.id, e)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-950 transition-colors"
                        title="Delete Book"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <span className="text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        <span>Read</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
