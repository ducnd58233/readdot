"use client";

import dynamic from "next/dynamic";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/features/file-upload";
import { useHighlights } from "@/hooks/use-highlights";
import { usePDF } from "@/hooks/use-pdf";
import { api } from "@/lib/api";
import { HighlightSidebar } from "@/components/features/highlight-sidebar";

// Dynamically import PDFViewer with SSR disabled
const PDFViewer = dynamic(
  () =>
    import("@/components/features/pdf-viewer").then((mod) => ({
      default: mod.PDFViewer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading PDF viewer...</p>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const { pdfFile, loadPDF, resetPDF } = usePDF();
  const {
    highlights,
    selectedColor,
    addHighlight,
    removeHighlight,
    clearHighlights,
    changeColor,
  } = useHighlights();

  const handleFileUploaded = (file: typeof pdfFile) => {
    if (!file) return;

    console.log("File uploaded:", {
      filename: file.original_filename,
      hasUrl: !!file.url,
      urlType: typeof file.url,
      urlLength: file.url?.length || 0,
      urlPreview: file.url?.substring(0, 50) + "...",
    });

    // Validate file has URL
    if (!file.url) {
      console.error("File URL is missing!");
      return;
    }

    loadPDF(file);
    clearHighlights();
  };

  const handleReset = () => {
    resetPDF();
    clearHighlights();
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <FileUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PDF Highlighter</h1>
              <p className="text-xs text-muted-foreground">
                Upload, read, and highlight your documents
              </p>
            </div>
          </div>

          {pdfFile && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">
                  {pdfFile.original_filename}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(pdfFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <Button variant="destructive" size="sm" onClick={handleReset}>
                Upload New File
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {!pdfFile ? (
          <div className="h-full flex items-center justify-center p-8">
            <FileUpload onFileUploaded={handleFileUploaded} />
          </div>
        ) : (
          <div className="h-full flex">
            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden">
              <PDFViewer
                fileUrl={api.getFileUrl(pdfFile.url)}
                highlights={highlights}
                onAddHighlight={addHighlight}
                selectedColor={selectedColor}
              />
            </div>

            {/* Sidebar */}
            <HighlightSidebar
              highlights={highlights}
              onDeleteHighlight={removeHighlight}
              selectedColor={selectedColor}
              onColorChange={changeColor}
            />
          </div>
        )}
      </div>
    </div>
  );
}
