import api from './client';

// Backend POJO imports - Upload Module
interface UploadDto {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  uploadedBy: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// API Response wrappers
interface UploadAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Request types
export interface UploadFileRequest {
  folder?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
}

// Response types
export interface UploadFileResponse {
  upload: UploadDto;
}

export interface UploadMultipleResponse {
  uploads: UploadDto[];
  totalUploaded: number;
  failed: string[];
}

// Legacy interfaces for backward compatibility
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
    options?: UploadFileRequest,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadDto> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options?.folder) {
      formData.append('folder', options.folder);
    }
    if (options?.entityType) {
      formData.append('entityType', options.entityType);
    }
    if (options?.entityId) {
      formData.append('entityId', options.entityId);
    }
    if (options?.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata));
    }

    const response = await api.post<UploadAPIResponse<UploadDto>>('/upload', formData, {
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

    return response.data.data;
  },

  // Upload multiple files
  uploadMultiple: async (
    files: File[],
    options?: UploadFileRequest,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadDto[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (options?.folder) {
      formData.append('folder', options.folder);
    }
    if (options?.entityType) {
      formData.append('entityType', options.entityType);
    }
    if (options?.entityId) {
      formData.append('entityId', options.entityId);
    }
    if (options?.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata));
    }

    const response = await api.post<UploadAPIResponse<UploadDto[]>>('/upload/multiple', formData, {
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

    return response.data.data;
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

    const response = await api.post<UploadAPIResponse<UploadedFile>>('/upload/image', formData, {
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

    return response.data.data;
  },

  // Delete file
  deleteFile: async (fileId: string): Promise<void> => {
    await api.delete(`/upload/${fileId}`);
  },

  // Get file URL
  getFileUrl: (path: string): string => {
    return `${process.env.API_URL || 'https://groow-api.destinpq.com'}/uploads/${path}`;
  },
};

export default uploadAPI;
