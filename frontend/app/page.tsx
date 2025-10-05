"use client";

import { FileUpload } from "@/components/features/file-upload/file-upload";
import { Button } from "@/components/ui/button";
import { usePDF } from "@/hooks/use-pdf";
import { PDFFile } from "@/types";
import { Separator } from "@radix-ui/react-separator";

export default function Home() {
  const { pdfFile, loadPDF, resetPDF } = usePDF();

  const handleFileUploaded = (file: typeof pdfFile) => {
    if (file) {
      loadPDF(file);
    }
  };

  const handleReset = () => {
    resetPDF();
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header>
        {pdfFile && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{pdfFile.original_filename}</p>
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
      </header>

      <div className="flex-1 overflow-hidden">
        {!pdfFile ? (
          <div className="h-full flex items-center justify-center">
            <FileUpload onFileUploaded={handleFileUploaded} />
          </div>
        ) : (
          <div className="h-full flex">
            Hello, World
          </div>
        )}
      </div>
    </div>
  );
}
