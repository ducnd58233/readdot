import { UploadResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6000";

export const api = {
  uploadPDF: async (file: File): Promise<UploadResponse> => {
    // const formData = new FormData();
    // formData.append("file", file);

    // const response = await fetch(`${API_BASE_URL}/api/upload`, {
    //   method: "POST",
    //   body: formData,
    // });

    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.detail || "Failed to upload file");
    // }

    // return response.json();
    await new Promise(resolve => setTimeout(resolve, 500));

    const fileURL = URL.createObjectURL(file);

    return {
      message: 'File uploaded successfully (mock)',
      data: {
        filename: `${Date.now()}-${file.name}`,
        original_filename: file.name,
        url: fileURL,
        size: file.size,
      },
    };
  },
  getFileUrl: (path: string): string => {
    if (path.startsWith('blob:')) {
      return path;
    }
    
    return `${API_BASE_URL}${path}`;
  },
};
