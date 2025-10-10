"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import FileUpload from "@/components/features/file-upload";
import HighlightSidebar from "@/components/features/highlight-sidebar";
import { PDFFile, Highlight, HighlightColor } from "@/types";
import { api } from "@/lib/api";

export interface PDFViewerRef {
  scrollToHighlight: (highlight: Highlight) => void;
}

// Dynamically import PDFViewer with SSR disabled
const PDFViewer = dynamic(
  () =>
    import("@/components/features/pdf-viewer").then((mod) => ({
      default: mod.default,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <div className="text-gray-500">Loading PDF viewer...</div>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedColor, setSelectedColor] = useState<HighlightColor>("#FFEB3B");
  const pdfViewerRef = useRef<PDFViewerRef>(null);

  const handleFileUploaded = (file: PDFFile) => {
    console.log("File uploaded:", file);
    console.log("File URL:", file.url);
    console.log("API getFileUrl result:", api.getFileUrl(file.url));
    setPdfFile(file);
    setHighlights([]);
  };

  const handleAddHighlight = (
    highlightData: Omit<Highlight, "id" | "timestamp">
  ) => {
    const newHighlight: Highlight = {
      ...highlightData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    setHighlights((prev) => [...prev, newHighlight]);
  };

  const handleDeleteHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  const handleHighlightClick = (highlight: Highlight) => {
    pdfViewerRef.current?.scrollToHighlight(highlight);
  };

  const handleUpdateNote = (id: string, note: string) => {
    setHighlights(prev => 
      prev.map(h => h.id === id ? { ...h, note: note || undefined } : h)
    );
  };

  const handleReset = () => {
    setPdfFile(null);
    setHighlights([]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              PDF Highlighter
            </h1>
            <p className="text-sm text-gray-500">
              Upload, read, and highlight your PDF documents
            </p>
          </div>

          {pdfFile && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {pdfFile.original_filename}
                </p>
                <p className="text-xs text-gray-500">
                  {(pdfFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
              >
                Upload New File
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {!pdfFile ? (
          <div className="h-full flex items-center justify-center">
            <FileUpload onFileUploaded={handleFileUploaded} />
          </div>
        ) : (
          <div className="h-full flex">
            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden">
              <PDFViewer
                ref={pdfViewerRef}
                fileUrl={api.getFileUrl(pdfFile.url)}
                highlights={highlights}
                onAddHighlight={handleAddHighlight}
                selectedColor={selectedColor}
              />
            </div>

            {/* Sidebar */}
            <HighlightSidebar
              highlights={highlights}
              onDeleteHighlight={handleDeleteHighlight}
              onUpdateNote={handleUpdateNote}
              onHighlightClick={handleHighlightClick}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
            />
          </div>
        )}
      </div>
    </div>
  );
}
