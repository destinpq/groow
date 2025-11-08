import api from './client';

// Types
export interface UploadedFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Upload API Service
export const uploadAPI = {
  // Upload single file
  uploadFile: async (
    file: File,
    folder?: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await api.post<UploadedFile>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          };
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  // Upload multiple files
  uploadMultiple: async (
    files: File[],
    folder?: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadedFile[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await api.post<UploadedFile[]>('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          };
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  // Upload image with optimization
  uploadImage: async (
    file: File,
    options?: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    },
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    const response = await api.post<UploadedFile>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          };
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  // Delete file
  deleteFile: async (fileId: string): Promise<void> => {
    await api.delete(`/upload/${fileId}`);
  },

  // Get file URL
  getFileUrl: (path: string): string => {
    return `${process.env.API_URL || 'https://nz-api.destinpq.com'}/uploads/${path}`;
  },
};

export default uploadAPI;
