"use client";

import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FileText, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Highlight, HighlightColor } from "@/types";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PDFViewerProps {
  fileUrl: string;
  highlights: Highlight[];
  onAddHighlight: (highlight: Omit<Highlight, "id" | "timestamp">) => void;
  selectedColor: HighlightColor;
}

export function PDFViewer({
  fileUrl,
  highlights,
  onAddHighlight,
  selectedColor,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Validate fileUrl
  if (!fileUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-destructive">
          <p className="text-lg font-semibold">Invalid PDF File</p>
          <p className="text-sm">File URL is missing or invalid</p>
        </div>
      </div>
    );
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF:", error);
  }

  const handleTextSelection = (pageNumber: number) => {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      return;
    }

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const pageContainer = pageRefs.current.get(pageNumber);
    if (!pageContainer) return;

    const pageRect = pageContainer.getBoundingClientRect();

    const position = {
      x: rect.left - pageRect.left,
      y: rect.top - pageRect.top,
      width: rect.width,
      height: rect.height,
    };

    onAddHighlight({
      text: selectedText,
      color: selectedColor,
      pageNumber,
      position,
    });

    selection.removeAllRanges();
  };

  const handlePageLoadSuccess = (pageNumber: number) => {
    setLoadedPages((prev) => new Set(prev).add(pageNumber));
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setShowScrollTop(scrollTop > 500);
  };

  const scrollToTop = () => {
    scrollAreaRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-full">
      {/* PDF Info Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-background">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">
            {numPages > 0 ? `${numPages} pages` : "Loading..."}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {loadedPages.size} / {numPages} loaded
          </Badge>
          <span className="text-xs text-muted-foreground">
            Scroll to view all
          </span>
        </div>
      </div>

      <Separator />

      {/* PDF Viewer - Infinite Scroll */}
      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto bg-muted/30 p-8"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading PDF...
                  </p>
                </div>
              </div>
            }
            error={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-2">
                  <p className="text-lg font-semibold text-destructive">
                    Failed to load PDF
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please try uploading the file again
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Make sure the file is a valid PDF
                  </p>
                </div>
              </div>
            }
          >
            {/* Render all pages */}
            {Array.from(new Array(numPages), (_, index) => {
              const pageNumber = index + 1;

              return (
                <div
                  key={pageNumber}
                  ref={(el) => {
                    if (el) pageRefs.current.set(pageNumber, el);
                  }}
                  className="relative mb-6 bg-background shadow-lg rounded-sm overflow-hidden"
                  onMouseUp={() => handleTextSelection(pageNumber)}
                >
                  {/* Page number indicator */}
                  <div className="absolute -top-8 left-0 right-0 text-center z-10">
                    <Badge variant="outline" className="bg-background">
                      Page {pageNumber} of {numPages}
                    </Badge>
                  </div>

                  {/* PDF Page */}
                  <Page
                    pageNumber={pageNumber}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    width={800}
                    loading={
                      <div className="flex items-center justify-center h-96 bg-muted">
                        <p className="text-sm text-muted-foreground">
                          Loading page {pageNumber}...
                        </p>
                      </div>
                    }
                    onLoadSuccess={() => handlePageLoadSuccess(pageNumber)}
                  />

                  {/* Render highlights for this page */}
                  {highlights
                    .filter((h) => h.pageNumber === pageNumber)
                    .map((highlight) => (
                      <div
                        key={highlight.id}
                        className="absolute pointer-events-none"
                        style={{
                          left: `${highlight.position.x}px`,
                          top: `${highlight.position.y}px`,
                          width: `${highlight.position.width}px`,
                          height: `${highlight.position.height}px`,
                          backgroundColor: highlight.color,
                          opacity: 0.4,
                          mixBlendMode: "multiply",
                        }}
                      />
                    ))}
                </div>
              );
            })}
          </Document>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-8 right-96 rounded-full shadow-lg"
        >
          <ChevronUp className="h-4 w-4" />
          <span className="sr-only">Scroll to top</span>
        </Button>
      )}
    </div>
  );
}
