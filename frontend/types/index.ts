export interface Highlight {
  id: string;
  text: string;
  color: string;
  pageNumber: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  timestamp: number;
}

export interface PDFFile {
  filename: string;
  original_filename: string;
  url: string;
  size: number;
}

export interface UploadResponse {
  message: string;
  data: PDFFile;
}

export interface TextSelection {
  text: string;
  pageNumber: number;
  rects: DOMRect[];
}

export type HighlightColor = '#FFEB3B' | '#4CAF50' | '#2196F3' | '#FF5722' | '#9C27B0';