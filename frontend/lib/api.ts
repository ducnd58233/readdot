import { UploadResponse, PDFFile } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  uploadPDF: async (file: File): Promise<UploadResponse> => {
    /*
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload file');
    }

    return response.json();
    */
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.type.includes('pdf')) {
        reject(new Error('Only PDF files are allowed'));
        return;
      }

      // Validate file size (10MB limit)
      const MAX_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        reject(new Error('File size exceeds 10MB limit'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = () => {
        const dataUrl = reader.result as string;
        
        if (!dataUrl || !dataUrl.startsWith('data:')) {
          reject(new Error('Failed to read file as data URL'));
          return;
        }
        
        const mockResponse: UploadResponse = {
          message: 'File uploaded successfully (MOCKED - frontend only)',
          data: {
            filename: `${Date.now()}-${file.name}`,
            original_filename: file.name,
            url: dataUrl,
            size: file.size,
          },
        };
        
        console.log('Mock upload successful:', {
          filename: mockResponse.data.filename,
          size: mockResponse.data.size,
          urlLength: dataUrl.length
        });
        
        setTimeout(() => {
          resolve(mockResponse);
        }, 500);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      // Read the file
      reader.readAsDataURL(file);
    });
  },

  getFileUrl: (path: string): string => {
    if (path.startsWith('data:')) {
      return path;
    }

    return `${API_BASE_URL}${path}`;
  },
};