'use client';

import React, { useState } from 'react';
import {
  Download,
  Printer,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ExternalLink,
  FileText,
} from 'lucide-react';

interface PdfViewerProps {
  pdfUrl: string;
  title: string;
  pageCount?: number;
  pdfSizeBytes?: number;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  pdfUrl,
  title,
  pageCount,
  pdfSizeBytes,
}) => {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div
      className={`rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 bg-slate-950' : 'h-[750px] w-full'
      }`}
    >
      {/* Viewer Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-200 font-semibold font-['Outfit']">
            <FileText className="h-4 w-4 text-amber-400" />
            <span className="line-clamp-1 max-w-xs">{title}.pdf</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-500 text-[11px]">
            {pageCount && <span>{pageCount} Pages</span>}
            {pdfSizeBytes && (
              <>
                <span>•</span>
                <span>{formatSize(pdfSizeBytes)}</span>
              </>
            )}
            <span>•</span>
            <span className="text-emerald-400 font-mono">Springer Monograph</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => window.open(pdfUrl, '_blank')}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </button>

          <a
            href={pdfUrl}
            download={`${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold hover:from-amber-400 hover:to-yellow-400 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </a>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Embedded PDF iframe */}
      <div className="flex-1 bg-slate-950 relative">
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          className="w-full h-full border-0"
          title={title}
        />
      </div>
    </div>
  );
};
