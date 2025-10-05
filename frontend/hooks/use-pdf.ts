import { PDFFile } from "@/types";
import { useCallback, useState } from "react";

export function usePDF() {
  const [pdfFile, setPDFFile] = useState<PDFFile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadPDF = useCallback((file: PDFFile) => {
    setIsLoading(true);
    setPDFFile(file);
    setTimeout(() => setIsLoading(false), 3000);
  }, []);

  const resetPDF = useCallback(() => {
    setPDFFile(null);
    setIsLoading(false);
  }, []);

  return {
    pdfFile,
    isLoading,
    loadPDF,
    resetPDF,
  };
}
