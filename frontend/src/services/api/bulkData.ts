import api from './client';

// ========================================
// Bulk Import/Export Types
// ========================================

export interface ImportJob {
  id: string;
  title: string;
  type: 'products' | 'orders' | 'customers' | 'categories' | 'inventory' | 'coupons';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errors: ImportError[];
  warnings: ImportWarning[];
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  startedAt?: string;
  completedAt?: string;
  createdBy: string;
  settings: ImportSettings;
  preview?: ImportPreview;
  downloadUrls?: {
    errorReport?: string;
    successReport?: string;
    skippedReport?: string;
  };
}

export interface ExportJob {
  id: string;
  title: string;
  type: 'products' | 'orders' | 'customers' | 'categories' | 'inventory' | 'analytics';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  format: 'csv' | 'xlsx' | 'json' | 'xml';
  filters: Record<string, any>;
  columns: string[];
  fileName: string;
  fileSize?: number;
  downloadUrl?: string;
  expiresAt?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  createdBy: string;
  settings: ExportSettings;
}

export interface ImportSettings {
  hasHeader: boolean;
  delimiter: string;
  encoding: 'utf-8' | 'latin1' | 'ascii';
  skipEmptyRows: boolean;
  updateExisting: boolean;
  createMissing: boolean;
  skipDuplicates: boolean;
  batchSize: number;
  mapping: FieldMapping[];
  validation: ValidationRules;
  defaultValues: Record<string, any>;
}

export interface ExportSettings {
  includeHeaders: boolean;
  delimiter: string;
  encoding: 'utf-8' | 'latin1' | 'ascii';
  dateFormat: string;
  numberFormat: string;
  compression: 'none' | 'zip' | 'gzip';
  maxRecords?: number;
  chunkSize?: number;
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: string;
  required: boolean;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  validation?: string[];
}

export interface ValidationRules {
  required: string[];
  unique: string[];
  format: Record<string, string>;
  range: Record<string, { min?: number; max?: number }>;
  enum: Record<string, string[]>;
  custom: Record<string, string>;
}

export interface ImportError {
  row: number;
  column?: string;
  field?: string;
  value?: any;
  error: string;
  type: 'validation' | 'format' | 'constraint' | 'system';
  severity: 'error' | 'warning';
}

export interface ImportWarning {
  row: number;
  column?: string;
  field?: string;
  value?: any;
  message: string;
  type: 'data_modified' | 'skipped' | 'default_used';
}

export interface ImportPreview {
  headers: string[];
  sampleData: any[][];
  detectedMapping: FieldMapping[];
  statistics: {
    totalRows: number;
    emptyRows: number;
    duplicateRows: number;
    validRows: number;
    invalidRows: number;
  };
  issues: ImportError[];
}

export interface BulkOperation {
  id: string;
  type: 'update' | 'delete' | 'activate' | 'deactivate' | 'categorize' | 'price_update';
  entityType: 'products' | 'orders' | 'customers' | 'categories';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  totalItems: number;
  processedItems: number;
  successfulItems: number;
  failedItems: number;
  criteria: Record<string, any>;
  changes: Record<string, any>;
  errors: BulkOperationError[];
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  createdBy: string;
}

export interface BulkOperationError {
  itemId: string;
  error: string;
  type: 'validation' | 'constraint' | 'system';
}

export interface ImportTemplate {
  id: string;
  name: string;
  description: string;
  type: ImportJob['type'];
  settings: ImportSettings;
  sampleFile?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  usageCount: number;
}

export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  type: ExportJob['type'];
  columns: string[];
  filters: Record<string, any>;
  settings: ExportSettings;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  usageCount: number;
}

export interface DataQualityReport {
  entityType: string;
  totalRecords: number;
  issues: {
    missingRequired: number;
    invalidFormat: number;
    duplicates: number;
    orphanedRecords: number;
    inconsistentData: number;
  };
  recommendations: string[];
  affectedFields: Record<string, number>;
  createdAt: string;
}

export interface ImportStats {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  totalRecordsImported: number;
  totalRecordsFailed: number;
  averageProcessingTime: number;
  popularTypes: { type: string; count: number }[];
  recentActivity: ImportJob[];
}

export interface ExportStats {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  totalRecordsExported: number;
  totalFileSize: number;
  averageProcessingTime: number;
  popularFormats: { format: string; count: number }[];
  recentActivity: ExportJob[];
}

// ========================================
// Bulk Import/Export API Service
// ========================================

export const bulkDataAPI = {
  // ========================================
  // Import Operations
  // ========================================

  // Import Jobs Management
  getImportJobs: async (
    filters?: {
      status?: ImportJob['status'];
      type?: ImportJob['type'];
      startDate?: string;
      endDate?: string;
      createdBy?: string;
    },
    pagination?: { page: number; limit: number }
  ): Promise<{
    jobs: ImportJob[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await api.get('/bulk/import/jobs', {
      params: { ...filters, ...pagination },
    });
    return response.data;
  },

  getImportJob: async (jobId: string): Promise<ImportJob> => {
    const response = await api.get(`/bulk/import/jobs/${jobId}`);
    return response.data;
  },

  createImportJob: async (data: {
    title: string;
    type: ImportJob['type'];
    file: File;
    settings: ImportSettings;
  }): Promise<ImportJob> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('file', data.file);
    formData.append('settings', JSON.stringify(data.settings));

    const response = await api.post('/bulk/import/jobs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  previewImport: async (
    file: File,
    settings: Partial<ImportSettings>
  ): Promise<ImportPreview> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('settings', JSON.stringify(settings));

    const response = await api.post('/bulk/import/preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  startImport: async (jobId: string): Promise<ImportJob> => {
    const response = await api.post(`/bulk/import/jobs/${jobId}/start`);
    return response.data;
  },

  pauseImport: async (jobId: string): Promise<ImportJob> => {
    const response = await api.post(`/bulk/import/jobs/${jobId}/pause`);
    return response.data;
  },

  resumeImport: async (jobId: string): Promise<ImportJob> => {
    const response = await api.post(`/bulk/import/jobs/${jobId}/resume`);
    return response.data;
  },

  cancelImport: async (jobId: string): Promise<ImportJob> => {
    const response = await api.post(`/bulk/import/jobs/${jobId}/cancel`);
    return response.data;
  },

  deleteImportJob: async (jobId: string): Promise<void> => {
    await api.delete(`/bulk/import/jobs/${jobId}`);
  },

  // ========================================
  // Export Operations
  // ========================================

  // Export Jobs Management
  getExportJobs: async (
    filters?: {
      status?: ExportJob['status'];
      type?: ExportJob['type'];
      format?: ExportJob['format'];
      startDate?: string;
      endDate?: string;
      createdBy?: string;
    },
    pagination?: { page: number; limit: number }
  ): Promise<{
    jobs: ExportJob[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await api.get('/bulk/export/jobs', {
      params: { ...filters, ...pagination },
    });
    return response.data;
  },

  getExportJob: async (jobId: string): Promise<ExportJob> => {
    const response = await api.get(`/bulk/export/jobs/${jobId}`);
    return response.data;
  },

  createExportJob: async (data: {
    title: string;
    type: ExportJob['type'];
    format: ExportJob['format'];
    columns: string[];
    filters: Record<string, any>;
    settings: ExportSettings;
  }): Promise<ExportJob> => {
    const response = await api.post('/bulk/export/jobs', data);
    return response.data;
  },

  startExport: async (jobId: string): Promise<ExportJob> => {
    const response = await api.post(`/bulk/export/jobs/${jobId}/start`);
    return response.data;
  },

  cancelExport: async (jobId: string): Promise<ExportJob> => {
    const response = await api.post(`/bulk/export/jobs/${jobId}/cancel`);
    return response.data;
  },

  downloadExport: async (jobId: string): Promise<Blob> => {
    const response = await api.get(`/bulk/export/jobs/${jobId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  deleteExportJob: async (jobId: string): Promise<void> => {
    await api.delete(`/bulk/export/jobs/${jobId}`);
  },

  // ========================================
  // Bulk Operations
  // ========================================

  getBulkOperations: async (
    filters?: {
      status?: BulkOperation['status'];
      type?: BulkOperation['type'];
      entityType?: BulkOperation['entityType'];
      startDate?: string;
      endDate?: string;
    },
    pagination?: { page: number; limit: number }
  ): Promise<{
    operations: BulkOperation[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await api.get('/bulk/operations', {
      params: { ...filters, ...pagination },
    });
    return response.data;
  },

  getBulkOperation: async (operationId: string): Promise<BulkOperation> => {
    const response = await api.get(`/bulk/operations/${operationId}`);
    return response.data;
  },

  createBulkOperation: async (data: {
    type: BulkOperation['type'];
    entityType: BulkOperation['entityType'];
    criteria: Record<string, any>;
    changes: Record<string, any>;
  }): Promise<BulkOperation> => {
    const response = await api.post('/bulk/operations', data);
    return response.data;
  },

  startBulkOperation: async (operationId: string): Promise<BulkOperation> => {
    const response = await api.post(`/bulk/operations/${operationId}/start`);
    return response.data;
  },

  cancelBulkOperation: async (operationId: string): Promise<BulkOperation> => {
    const response = await api.post(`/bulk/operations/${operationId}/cancel`);
    return response.data;
  },

  deleteBulkOperation: async (operationId: string): Promise<void> => {
    await api.delete(`/bulk/operations/${operationId}`);
  },

  // ========================================
  // Templates Management
  // ========================================

  // Import Templates
  getImportTemplates: async (type?: ImportJob['type']): Promise<ImportTemplate[]> => {
    const response = await api.get('/bulk/import/templates', {
      params: { type },
    });
    return response.data;
  },

  getImportTemplate: async (templateId: string): Promise<ImportTemplate> => {
    const response = await api.get(`/bulk/import/templates/${templateId}`);
    return response.data;
  },

  createImportTemplate: async (data: Omit<ImportTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<ImportTemplate> => {
    const response = await api.post('/bulk/import/templates', data);
    return response.data;
  },

  updateImportTemplate: async (templateId: string, data: Partial<ImportTemplate>): Promise<ImportTemplate> => {
    const response = await api.put(`/bulk/import/templates/${templateId}`, data);
    return response.data;
  },

  deleteImportTemplate: async (templateId: string): Promise<void> => {
    await api.delete(`/bulk/import/templates/${templateId}`);
  },

  downloadImportTemplate: async (templateId: string): Promise<Blob> => {
    const response = await api.get(`/bulk/import/templates/${templateId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Export Templates
  getExportTemplates: async (type?: ExportJob['type']): Promise<ExportTemplate[]> => {
    const response = await api.get('/bulk/export/templates', {
      params: { type },
    });
    return response.data;
  },

  getExportTemplate: async (templateId: string): Promise<ExportTemplate> => {
    const response = await api.get(`/bulk/export/templates/${templateId}`);
    return response.data;
  },

  createExportTemplate: async (data: Omit<ExportTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<ExportTemplate> => {
    const response = await api.post('/bulk/export/templates', data);
    return response.data;
  },

  updateExportTemplate: async (templateId: string, data: Partial<ExportTemplate>): Promise<ExportTemplate> => {
    const response = await api.put(`/bulk/export/templates/${templateId}`, data);
    return response.data;
  },

  deleteExportTemplate: async (templateId: string): Promise<void> => {
    await api.delete(`/bulk/export/templates/${templateId}`);
  },

  // ========================================
  // Data Quality & Validation
  // ========================================

  validateData: async (
    type: ImportJob['type'],
    data: any[],
    rules: ValidationRules
  ): Promise<{
    valid: boolean;
    errors: ImportError[];
    warnings: ImportWarning[];
    statistics: {
      totalRecords: number;
      validRecords: number;
      invalidRecords: number;
      warningRecords: number;
    };
  }> => {
    const response = await api.post('/bulk/validate', {
      type,
      data,
      rules,
    });
    return response.data;
  },

  generateDataQualityReport: async (entityType: string): Promise<DataQualityReport> => {
    const response = await api.get(`/bulk/data-quality/${entityType}`);
    return response.data;
  },

  fixDataQualityIssues: async (
    entityType: string,
    issues: string[],
    options: {
      autoFix?: boolean;
      backupFirst?: boolean;
      notifyUsers?: boolean;
    }
  ): Promise<{
    fixed: number;
    failed: number;
    errors: any[];
  }> => {
    const response = await api.post(`/bulk/data-quality/${entityType}/fix`, {
      issues,
      options,
    });
    return response.data;
  },

  // ========================================
  // Field Mapping & Schema
  // ========================================

  getAvailableFields: async (type: ImportJob['type']): Promise<{
    fields: {
      name: string;
      label: string;
      type: string;
      required: boolean;
      description: string;
      validation?: string[];
      example?: any;
    }[];
    relationships: {
      field: string;
      relatedEntity: string;
      relatedField: string;
    }[];
  }> => {
    const response = await api.get(`/bulk/schema/${type}`);
    return response.data;
  },

  detectFieldMapping: async (
    type: ImportJob['type'],
    headers: string[]
  ): Promise<FieldMapping[]> => {
    const response = await api.post(`/bulk/mapping/detect`, {
      type,
      headers,
    });
    return response.data;
  },

  validateFieldMapping: async (
    type: ImportJob['type'],
    mapping: FieldMapping[]
  ): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: FieldMapping[];
  }> => {
    const response = await api.post(`/bulk/mapping/validate`, {
      type,
      mapping,
    });
    return response.data;
  },

  // ========================================
  // Statistics and Monitoring
  // ========================================

  getImportStats: async (dateRange?: { start: string; end: string }): Promise<ImportStats> => {
    const response = await api.get('/bulk/import/stats', {
      params: dateRange,
    });
    return response.data;
  },

  getExportStats: async (dateRange?: { start: string; end: string }): Promise<ExportStats> => {
    const response = await api.get('/bulk/export/stats', {
      params: dateRange,
    });
    return response.data;
  },

  getJobProgress: async (jobId: string, type: 'import' | 'export'): Promise<{
    progress: number;
    status: string;
    currentStep: string;
    estimatedTimeRemaining: number;
    recordsPerSecond: number;
    errors: number;
    warnings: number;
  }> => {
    const response = await api.get(`/bulk/${type}/jobs/${jobId}/progress`);
    return response.data;
  },

  // ========================================
  // Utilities
  // ========================================

  convertFile: async (
    file: File,
    fromFormat: 'csv' | 'xlsx' | 'json' | 'xml',
    toFormat: 'csv' | 'xlsx' | 'json' | 'xml',
    options?: {
      hasHeader?: boolean;
      delimiter?: string;
      encoding?: string;
    }
  ): Promise<Blob> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fromFormat', fromFormat);
    formData.append('toFormat', toFormat);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    const response = await api.post('/bulk/convert', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob',
    });
    return response.data;
  },

  generateSampleFile: async (
    type: ImportJob['type'],
    format: 'csv' | 'xlsx',
    options?: {
      includeExamples?: boolean;
      recordCount?: number;
    }
  ): Promise<Blob> => {
    const response = await api.get(`/bulk/sample/${type}`, {
      params: { format, ...options },
      responseType: 'blob',
    });
    return response.data;
  },

  cleanupFiles: async (olderThan: number = 30): Promise<{
    deletedFiles: number;
    freedSpace: number;
  }> => {
    const response = await api.post('/bulk/cleanup', { olderThan });
    return response.data;
  },
};

export default bulkDataAPI;