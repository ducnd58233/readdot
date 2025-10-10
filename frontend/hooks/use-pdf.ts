import { useCallback, useState } from 'react';
import { PDFFile } from '@/types';

export function usePDF() {
  const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadPDF = useCallback((file: PDFFile) => {
    setIsLoading(true);
    setPdfFile(file);
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  const resetPDF = useCallback(() => {
    setPdfFile(null);
    setIsLoading(false);
  }, []);

  return {
    pdfFile,
    isLoading,
    loadPDF,
    resetPDF,
  };
}