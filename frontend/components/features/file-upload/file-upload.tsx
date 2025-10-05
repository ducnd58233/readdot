"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { PDFFile } from "@/types";
import { AlertCircle, FileCheck, Upload } from "lucide-react";
import { useCallback, useState } from "react";

interface FileUploadProps {
  onFileUploaded: (file: PDFFile) => void;
}

export function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFile = async (file: File) => {
    if (!file.type.includes("pdf")) {
      setError("Please upload a PDF file");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size exceeds 10MB limit');
      return;
    }
    
    setUploading(true);
    setError(null);

    try {
      const response = await api.uploadPDF(file);
      onFileUploaded(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <Card>
        <CardContent className="p-0">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-12 transition-all",
              isDragging && "border-primary bg-primary/5",
              !isDragging && "border-muted-foreground/25",
              uploading && "opacity-50 pointer-events-none"
            )}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="file-upload"
            />

            <div className="flex flex-col items-center justify-center gap-4 text-center">
              {uploading ? (
                <>
                  <FileCheck className="h-16 w-16 text-primary animate-pulse" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Uploading...</p>
                    <p className="text-sm text-muted-foreground">
                      Please wait while we process your PDF
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="h-16 w-16 text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      Drop your PDF here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF files up to 10MB
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Choose File
                    </label>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
