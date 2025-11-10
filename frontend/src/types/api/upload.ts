import { 
  ApiResponse, 
  BaseEntity, 
  PaginatedResponse 
} from './common';

// ================================
// UPLOAD ENTITY TYPES  
// ================================

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  ARCHIVE = 'archive',
  OTHER = 'other'
}

export enum UploadStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PROCESSING = 'processing',
  DELETED = 'deleted'
}

export enum StorageProvider {
  LOCAL = 'local',
  AWS_S3 = 's3',
  CLOUDINARY = 'cloudinary',
  GOOGLE_CLOUD = 'gcs',
  AZURE_BLOB = 'azure'
}

export interface Upload extends BaseEntity {
  id: string;
  originalName: string;
  filename: string;
  mimeType: string;
  fileType: FileType;
  size: number;
  path: string;
  url: string;
  thumbnailUrl?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    format?: string;
    colorSpace?: string;
    quality?: number;
  };
  entityType?: string;
  entityId?: string;
  uploadedBy: string;
  status: UploadStatus;
  storageProvider: StorageProvider;
  checksum?: string;
  description?: string;
  tags?: string[];
  isPublic: boolean;
  downloadCount: number;
  lastDownloadAt?: Date;
  expiresAt?: Date;
  uploader?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface MediaGallery {
  id: string;
  name: string;
  description?: string;
  type: 'product' | 'category' | 'banner' | 'general';
  uploads: Upload[];
  coverImage?: string;
  isPublic: boolean;
  createdBy: string;
  itemCount: number;
}

export interface UploadQuota {
  userId: string;
  totalQuota: number; // in bytes
  usedQuota: number;
  availableQuota: number;
  fileCount: number;
  lastResetAt: Date;
  quotaType: 'monthly' | 'daily' | 'unlimited';
}

export interface ProcessingJob extends BaseEntity {
  id: string;
  uploadId: string;
  jobType: 'thumbnail' | 'compress' | 'convert' | 'optimize';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: {
    outputUrl?: string;
    thumbnailUrl?: string;
    metadata?: Record<string, any>;
  };
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

// ================================
// REQUEST/RESPONSE TYPES
// ================================

export interface UploadFileRequest {
  entityType?: string;
  entityId?: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  generateThumbnail?: boolean;
  compress?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface UploadFileResponse {
  upload: Upload;
  message: string;
}

export interface UploadMultipleFilesResponse {
  uploads: Upload[];
  succeeded: number;
  failed: number;
  errors?: {
    filename: string;
    error: string;
  }[];
  message: string;
}

export interface GetUploadsResponse {
  uploads: PaginatedResponse<Upload>;
}

export interface GetUploadsByEntityResponse {
  uploads: Upload[];
  entityType: string;
  entityId: string;
}

export interface GetUserUploadsResponse {
  uploads: PaginatedResponse<Upload>;
  quota?: UploadQuota;
}

export interface DeleteUploadResponse {
  message: string;
  deleted: boolean;
}

export interface CreateGalleryRequest {
  name: string;
  description?: string;
  type: 'product' | 'category' | 'banner' | 'general';
  uploadIds?: string[];
  isPublic?: boolean;
}

export interface CreateGalleryResponse {
  gallery: MediaGallery;
  message: string;
}

export interface GetGalleriesResponse {
  galleries: PaginatedResponse<MediaGallery>;
}

export interface ProcessUploadRequest {
  uploadId: string;
  jobType: 'thumbnail' | 'compress' | 'convert' | 'optimize';
  options?: {
    format?: string;
    quality?: number;
    width?: number;
    height?: number;
    maintainAspectRatio?: boolean;
  };
}

export interface ProcessUploadResponse {
  job: ProcessingJob;
  message: string;
}

export interface GetProcessingJobsResponse {
  jobs: ProcessingJob[];
}

export interface UploadAnalytics {
  totalUploads: number;
  totalSize: number;
  totalDownloads: number;
  uploadsByType: {
    type: FileType;
    count: number;
    size: number;
  }[];
  uploadsByStatus: {
    status: UploadStatus;
    count: number;
  }[];
  topUploaders: {
    userId: string;
    userName: string;
    uploads: number;
    totalSize: number;
  }[];
  storageUsage: {
    provider: StorageProvider;
    usage: number;
    cost?: number;
  }[];
  dailyUploads: {
    date: string;
    uploads: number;
    size: number;
    downloads: number;
  }[];
}

export interface MediaOptimizationSettings {
  autoCompress: boolean;
  autoThumbnail: boolean;
  defaultQuality: number;
  maxFileSize: number;
  allowedFileTypes: string[];
  thumbnailSizes: {
    name: string;
    width: number;
    height: number;
  }[];
  compressionSettings: {
    jpeg: { quality: number; progressive: boolean };
    png: { compressionLevel: number };
    webp: { quality: number; lossless: boolean };
  };
}

// ================================
// FILTER TYPES
// ================================

export interface UploadFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  fileType?: FileType | FileType[];
  status?: UploadStatus;
  entityType?: string;
  entityId?: string;
  uploadedBy?: string;
  mimeType?: string;
  sizeFrom?: number;
  sizeTo?: number;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface GalleryFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  type?: 'product' | 'category' | 'banner' | 'general';
  isPublic?: boolean;
  createdBy?: string;
  search?: string;
}

// ================================
// UPLOAD API INTERFACE
// ================================

export interface UploadAPI {
  // File Upload Operations
  uploadSingle(file: File, options?: UploadFileRequest): Promise<ApiResponse<UploadFileResponse>>;
  uploadMultiple(files: File[], options?: UploadFileRequest): Promise<ApiResponse<UploadMultipleFilesResponse>>;
  uploadFromUrl(url: string, options?: UploadFileRequest): Promise<ApiResponse<UploadFileResponse>>;
  
  // File Management
  getAllUploads(filter?: UploadFilter): Promise<ApiResponse<GetUploadsResponse>>;
  getUploadById(id: string): Promise<ApiResponse<{ upload: Upload }>>;
  getUploadsByEntity(entityType: string, entityId: string): Promise<ApiResponse<GetUploadsByEntityResponse>>;
  getMyUploads(filter?: Partial<UploadFilter>): Promise<ApiResponse<GetUserUploadsResponse>>;
  updateUpload(id: string, updates: {
    description?: string;
    tags?: string[];
    isPublic?: boolean;
    entityType?: string;
    entityId?: string;
  }): Promise<ApiResponse<{ upload: Upload }>>;
  deleteUpload(id: string): Promise<ApiResponse<DeleteUploadResponse>>;
  bulkDelete(uploadIds: string[]): Promise<ApiResponse<{
    deleted: number;
    failed: number;
    errors?: string[];
  }>>;
  
  // Media Gallery
  createGallery(request: CreateGalleryRequest): Promise<ApiResponse<CreateGalleryResponse>>;
  getAllGalleries(filter?: GalleryFilter): Promise<ApiResponse<GetGalleriesResponse>>;
  getGalleryById(id: string): Promise<ApiResponse<{ gallery: MediaGallery }>>;
  updateGallery(id: string, updates: Partial<CreateGalleryRequest>): Promise<ApiResponse<CreateGalleryResponse>>;
  deleteGallery(id: string): Promise<ApiResponse<{ message: string }>>;
  addToGallery(galleryId: string, uploadIds: string[]): Promise<ApiResponse<{ gallery: MediaGallery }>>;
  removeFromGallery(galleryId: string, uploadIds: string[]): Promise<ApiResponse<{ gallery: MediaGallery }>>;
  
  // File Processing
  processUpload(request: ProcessUploadRequest): Promise<ApiResponse<ProcessUploadResponse>>;
  getProcessingJobs(uploadId?: string): Promise<ApiResponse<GetProcessingJobsResponse>>;
  getProcessingJobStatus(jobId: string): Promise<ApiResponse<{ job: ProcessingJob }>>;
  cancelProcessingJob(jobId: string): Promise<ApiResponse<{ message: string }>>;
  
  // File Operations
  downloadUpload(id: string): Promise<Blob>;
  getUploadPreview(id: string, size?: 'small' | 'medium' | 'large'): Promise<ApiResponse<{ previewUrl: string }>>;
  generateThumbnail(id: string, width?: number, height?: number): Promise<ApiResponse<{ thumbnailUrl: string }>>;
  compressFile(id: string, quality?: number): Promise<ApiResponse<{ compressedUrl: string }>>;
  convertFormat(id: string, targetFormat: string): Promise<ApiResponse<{ convertedUrl: string }>>;
  
  // Quota & Usage
  getUploadQuota(): Promise<ApiResponse<{ quota: UploadQuota }>>;
  getUserUsage(userId?: string): Promise<ApiResponse<{
    totalFiles: number;
    totalSize: number;
    usageByType: { type: FileType; count: number; size: number }[];
  }>>;
  
  // Settings & Configuration
  getOptimizationSettings(): Promise<ApiResponse<{ settings: MediaOptimizationSettings }>>;
  updateOptimizationSettings(settings: Partial<MediaOptimizationSettings>): Promise<ApiResponse<{ settings: MediaOptimizationSettings }>>;
  getAllowedFileTypes(): Promise<ApiResponse<{ fileTypes: { extension: string; mimeType: string; maxSize: number }[] }>>;
  
  // Analytics & Reports
  getUploadAnalytics(period?: string): Promise<ApiResponse<UploadAnalytics>>;
  getStorageReport(): Promise<ApiResponse<{
    totalStorage: number;
    usedStorage: number;
    availableStorage: number;
    storageByProvider: { provider: StorageProvider; usage: number; cost?: number }[];
    storageByType: { type: FileType; usage: number; fileCount: number }[];
  }>>;
  
  // Admin Operations
  cleanupOrphanedFiles(): Promise<ApiResponse<{ cleaned: number; size: number }>>;
  generateStorageReport(dateFrom: Date, dateTo: Date): Promise<ApiResponse<{
    uploads: number;
    totalSize: number;
    byUser: { userId: string; userName: string; uploads: number; size: number }[];
    byType: { type: FileType; uploads: number; size: number }[];
  }>>;
  
  // Backup & Migration
  exportUploads(filter?: UploadFilter): Promise<ApiResponse<{ downloadUrl: string }>>;
  migrateToProvider(provider: StorageProvider, uploadIds?: string[]): Promise<ApiResponse<{
    jobId: string;
    status: 'started';
  }>>;
}