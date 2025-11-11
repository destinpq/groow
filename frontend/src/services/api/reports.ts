// ========================================
// Reports API - Advanced Business Intelligence Platform
// POJO Integration: backend/src/modules/report/** -> frontend TypeScript API client
// ========================================

import { api } from './client';

// ========================================
// Core Report POJOs - Full backend integration
// ========================================

export interface ReportEntity {
  id: string;
  name: string;
  description?: string;
  type: ReportType;
  category: ReportCategory;
  template?: ReportTemplate;
  parameters: ReportParameter[];
  dataSource: DataSource;
  visualization: Visualization;
  schedule?: ReportSchedule;
  permissions: ReportPermissions;
  format: ReportFormat;
  size?: number;
  duration?: number;
  status: ReportStatus;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  lastGenerated?: Date;
  nextRun?: Date;
  metadata: ReportMetadata;
  tags: string[];
  isPublic: boolean;
  isFavorite: boolean;
  version: number;
  parentId?: string; // For report versions/clones
  settings: ReportSettings;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  category: ReportCategory;
  structure: TemplateStructure;
  defaultParameters: ReportParameter[];
  layout: LayoutConfiguration;
  styling: StyleConfiguration;
  isPublic: boolean;
  isSystem: boolean;
  createdBy: string;
  createdAt: Date;
  usageCount: number;
  rating: number;
  reviews: TemplateReview[];
}

export interface ReportParameter {
  name: string;
  label: string;
  type: ParameterType;
  dataType: DataType;
  required: boolean;
  defaultValue?: any;
  possibleValues?: ParameterValue[];
  validation: ValidationRule[];
  dependencies: ParameterDependency[];
  description?: string;
  format?: string;
  min?: number;
  max?: number;
  multiSelect?: boolean;
  cascade?: boolean;
}

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  connection: ConnectionConfig;
  schema?: SchemaDefinition;
  tables: TableConfiguration[];
  relationships: DataRelationship[];
  query?: QueryDefinition;
  cache: CacheConfiguration;
  security: SecurityConfiguration;
  lastSync?: Date;
  isActive: boolean;
  performance: PerformanceMetrics;
}

export interface Visualization {
  id: string;
  type: VisualizationType;
  config: VisualizationConfig;
  data: VisualizationData;
  layout: LayoutSettings;
  styling: VisualizationStyling;
  interactions: InteractionSettings;
  animations: AnimationSettings;
  responsive: ResponsiveSettings;
  accessibility: AccessibilitySettings;
}

export interface ReportSchedule {
  id: string;
  frequency: ScheduleFrequency;
  interval: number;
  timeZone: string;
  startDate: Date;
  endDate?: Date;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  time: string; // HH:MM format
  isActive: boolean;
  nextRun: Date;
  lastRun?: Date;
  runHistory: ScheduleRun[];
  notifications: NotificationSettings[];
  conditions: ScheduleCondition[];
}

export interface ReportPermissions {
  owner: string;
  viewers: string[];
  editors: string[];
  groups: GroupPermission[];
  public: boolean;
  inherit: boolean;
  roles: RolePermission[];
  restrictions: PermissionRestriction[];
}

export interface ReportMetadata {
  size: number;
  rowCount: number;
  columnCount: number;
  executionTime: number;
  cacheHit: boolean;
  dataFreshness: Date;
  quality: DataQuality;
  lineage: DataLineage[];
  dependencies: ReportDependency[];
  impact: ImpactAnalysis;
}

export interface ReportSettings {
  autoRefresh: boolean;
  refreshInterval: number;
  cacheEnabled: boolean;
  cacheExpiration: number;
  compression: boolean;
  encryption: boolean;
  watermark: boolean;
  exportEnabled: boolean;
  printEnabled: boolean;
  shareEnabled: boolean;
  downloadEnabled: boolean;
  embeddingEnabled: boolean;
  maxRows: number;
  timeout: number;
  retryAttempts: number;
}

// ========================================
// Supporting Interface POJOs
// ========================================

export interface ReportExecution {
  id: string;
  reportId: string;
  parameters: Record<string, any>;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: ExecutionStatus;
  progress: number;
  message?: string;
  error?: string;
  result?: ExecutionResult;
  logs: ExecutionLog[];
  performance: ExecutionMetrics;
  user: string;
  sessionId: string;
  cacheUsed: boolean;
  format: ReportFormat;
}

export interface ReportShare {
  id: string;
  reportId: string;
  shareType: ShareType;
  shareToken?: string;
  password?: string;
  expiresAt?: Date;
  accessCount: number;
  maxAccess?: number;
  permissions: SharePermissions;
  createdBy: string;
  createdAt: Date;
  lastAccessed?: Date;
  isActive: boolean;
  restrictions: ShareRestriction[];
}

export interface ReportComment {
  id: string;
  reportId: string;
  parentId?: string; // For threaded comments
  content: string;
  author: string;
  authorName: string;
  createdAt: Date;
  updatedAt?: Date;
  isResolved: boolean;
  mentions: string[];
  attachments: CommentAttachment[];
  reactions: CommentReaction[];
  isPrivate: boolean;
}

export interface ReportBookmark {
  id: string;
  reportId: string;
  userId: string;
  name?: string;
  parameters?: Record<string, any>;
  filters?: Record<string, any>;
  view?: ViewState;
  createdAt: Date;
  isDefault: boolean;
  isShared: boolean;
  tags: string[];
}

export interface ReportSnapshot {
  id: string;
  reportId: string;
  name: string;
  description?: string;
  data: SnapshotData;
  parameters: Record<string, any>;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
  size: number;
  format: ReportFormat;
  isBaseline: boolean;
  comparisonMetrics: ComparisonMetric[];
}

export interface ReportAnalytics {
  reportId: string;
  period: AnalyticsPeriod;
  views: ViewAnalytics;
  performance: PerformanceAnalytics;
  usage: UsageAnalytics;
  errors: ErrorAnalytics;
  users: UserAnalytics;
  exports: ExportAnalytics;
  trends: TrendAnalytics[];
  insights: AnalyticsInsight[];
}

// ========================================
// Enum Types
// ========================================

export enum ReportType {
  TABULAR = 'tabular',
  SUMMARY = 'summary',
  DASHBOARD = 'dashboard',
  CHART = 'chart',
  CROSSTAB = 'crosstab',
  MATRIX = 'matrix',
  SUBREPORT = 'subreport',
  DRILLDOWN = 'drilldown',
  PARAMETRIC = 'parametric',
  ADHOC = 'adhoc',
  OPERATIONAL = 'operational',
  ANALYTICAL = 'analytical',
  EXECUTIVE = 'executive'
}

export enum ReportCategory {
  FINANCIAL = 'financial',
  OPERATIONAL = 'operational',
  SALES = 'sales',
  MARKETING = 'marketing',
  INVENTORY = 'inventory',
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  HR = 'hr',
  COMPLIANCE = 'compliance',
  ANALYTICS = 'analytics',
  SYSTEM = 'system',
  CUSTOM = 'custom'
}

export enum ReportStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SCHEDULED = 'scheduled',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
  XML = 'xml',
  HTML = 'html',
  WORD = 'word',
  POWERPOINT = 'powerpoint',
  IMAGE = 'image',
  INTERACTIVE = 'interactive'
}

export enum VisualizationType {
  TABLE = 'table',
  BAR_CHART = 'bar_chart',
  LINE_CHART = 'line_chart',
  PIE_CHART = 'pie_chart',
  SCATTER_PLOT = 'scatter_plot',
  AREA_CHART = 'area_chart',
  HISTOGRAM = 'histogram',
  HEATMAP = 'heatmap',
  TREEMAP = 'treemap',
  GAUGE = 'gauge',
  KPI = 'kpi',
  MAP = 'map',
  FUNNEL = 'funnel',
  WATERFALL = 'waterfall',
  BOX_PLOT = 'box_plot',
  RADAR = 'radar'
}

export enum DataSourceType {
  DATABASE = 'database',
  API = 'api',
  FILE = 'file',
  WAREHOUSE = 'warehouse',
  LAKE = 'lake',
  STREAM = 'stream',
  CACHE = 'cache',
  EXTERNAL = 'external',
  FEDERATION = 'federation',
  VIRTUAL = 'virtual'
}

export enum ParameterType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  DATETIME = 'datetime',
  BOOLEAN = 'boolean',
  LIST = 'list',
  MULTILIST = 'multilist',
  RANGE = 'range',
  QUERY = 'query',
  CALCULATED = 'calculated'
}

export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout'
}

export enum ShareType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  EMBED = 'embed',
  EMAIL = 'email',
  LINK = 'link',
  PORTAL = 'portal'
}

export enum ScheduleFrequency {
  ONCE = 'once',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

// ========================================
// Request/Response Types
// ========================================

export interface CreateReportRequest {
  name: string;
  description?: string;
  type: ReportType;
  category: ReportCategory;
  templateId?: string;
  dataSourceId: string;
  parameters?: Partial<ReportParameter>[];
  visualization?: Partial<Visualization>;
  schedule?: Partial<ReportSchedule>;
  permissions?: Partial<ReportPermissions>;
  settings?: Partial<ReportSettings>;
  tags?: string[];
}

export interface UpdateReportRequest {
  name?: string;
  description?: string;
  type?: ReportType;
  category?: ReportCategory;
  parameters?: Partial<ReportParameter>[];
  visualization?: Partial<Visualization>;
  schedule?: Partial<ReportSchedule>;
  permissions?: Partial<ReportPermissions>;
  settings?: Partial<ReportSettings>;
  tags?: string[];
  isPublic?: boolean;
}

export interface ExecuteReportRequest {
  reportId: string;
  parameters?: Record<string, any>;
  format?: ReportFormat;
  async?: boolean;
  cache?: boolean;
  timeout?: number;
  filters?: Record<string, any>;
  sorting?: SortingConfiguration[];
  pagination?: PaginationConfig;
  exportOptions?: ExportOptions;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  category: ReportCategory;
  structure: TemplateStructure;
  defaultParameters?: Partial<ReportParameter>[];
  layout?: LayoutConfiguration;
  styling?: StyleConfiguration;
  isPublic?: boolean;
}

export interface ShareReportRequest {
  reportId: string;
  shareType: ShareType;
  password?: string;
  expiresAt?: Date;
  maxAccess?: number;
  permissions: SharePermissions;
  restrictions?: ShareRestriction[];
  emailSettings?: EmailShareSettings;
}

// ========================================
// Response Types
// ========================================

export interface ReportsResponse {
  reports: ReportEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: FilterSummary;
  aggregations: ReportAggregations;
}

export interface ExecutionResponse {
  executionId: string;
  status: ExecutionStatus;
  progress: number;
  estimatedCompletion?: Date;
  downloadUrl?: string;
  previewUrl?: string;
  metadata: ExecutionMetadata;
}

export interface ReportData {
  headers: DataHeader[];
  rows: DataRow[];
  summary: DataSummary;
  aggregations: DataAggregation[];
  metadata: DataMetadata;
  pagination: PaginationInfo;
  filters: AppliedFilter[];
  sorting: AppliedSorting[];
}

export interface AnalyticsResponse {
  period: AnalyticsPeriod;
  summary: AnalyticsSummary;
  details: ReportAnalytics[];
  comparisons: AnalyticsComparison[];
  trends: TrendData[];
  insights: AnalyticsInsight[];
  recommendations: Recommendation[];
}

// ========================================
// Reports API Implementation
// ========================================

export const reportsAPI = {
  // ========================================
  // Report Management
  // ========================================
  getReports: async (filters?: {
    category?: ReportCategory;
    type?: ReportType;
    status?: ReportStatus;
    owner?: string;
    tag?: string;
    favorite?: boolean;
    recent?: boolean;
    search?: string;
    createdAfter?: Date;
    createdBefore?: Date;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ReportsResponse> => {
    const response = await api.get<ReportsResponse>('/reports', {
      params: filters
    });
    return response.data;
  },

  getReportById: async (id: string): Promise<ReportEntity> => {
    const response = await api.get<ReportEntity>(`/reports/${id}`);
    return response.data;
  },

  createReport: async (data: CreateReportRequest): Promise<ReportEntity> => {
    const response = await api.post<ReportEntity>('/reports', data);
    return response.data;
  },

  updateReport: async (id: string, data: UpdateReportRequest): Promise<ReportEntity> => {
    const response = await api.put<ReportEntity>(`/reports/${id}`, data);
    return response.data;
  },

  deleteReport: async (id: string): Promise<void> => {
    await api.delete(`/reports/${id}`);
  },

  cloneReport: async (id: string, name?: string): Promise<ReportEntity> => {
    const response = await api.post<ReportEntity>(`/reports/${id}/clone`, { name });
    return response.data;
  },

  favoriteReport: async (id: string, favorite: boolean): Promise<void> => {
    await api.patch(`/reports/${id}/favorite`, { favorite });
  },

  archiveReport: async (id: string): Promise<void> => {
    await api.patch(`/reports/${id}/archive`);
  },

  restoreReport: async (id: string): Promise<void> => {
    await api.patch(`/reports/${id}/restore`);
  },

  // ========================================
  // Report Execution
  // ========================================
  executeReport: async (request: ExecuteReportRequest): Promise<ExecutionResponse> => {
    const response = await api.post<ExecutionResponse>('/reports/execute', request);
    return response.data;
  },

  getExecutionStatus: async (executionId: string): Promise<ExecutionResponse> => {
    const response = await api.get<ExecutionResponse>(`/reports/executions/${executionId}`);
    return response.data;
  },

  cancelExecution: async (executionId: string): Promise<void> => {
    await api.post(`/reports/executions/${executionId}/cancel`);
  },

  getReportData: async (executionId: string, format?: ReportFormat): Promise<ReportData | Blob> => {
    if (format && format !== ReportFormat.INTERACTIVE) {
      const response = await api.get(`/reports/executions/${executionId}/download`, {
        responseType: 'blob',
        params: { format }
      });
      return response.data;
    } else {
      const response = await api.get<ReportData>(`/reports/executions/${executionId}/data`);
      return response.data;
    }
  },

  previewReport: async (id: string, parameters?: Record<string, any>): Promise<ReportData> => {
    const response = await api.post<ReportData>(`/reports/${id}/preview`, {
      parameters,
      limit: 100
    });
    return response.data;
  },

  // ========================================
  // Template Management
  // ========================================
  getTemplates: async (filters?: {
    category?: ReportCategory;
    public?: boolean;
    featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    templates: ReportTemplate[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await api.get('/reports/templates', { params: filters });
    return response.data;
  },

  getTemplateById: async (id: string): Promise<ReportTemplate> => {
    const response = await api.get<ReportTemplate>(`/reports/templates/${id}`);
    return response.data;
  },

  createTemplate: async (data: CreateTemplateRequest): Promise<ReportTemplate> => {
    const response = await api.post<ReportTemplate>('/reports/templates', data);
    return response.data;
  },

  updateTemplate: async (id: string, data: Partial<CreateTemplateRequest>): Promise<ReportTemplate> => {
    const response = await api.put<ReportTemplate>(`/reports/templates/${id}`, data);
    return response.data;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await api.delete(`/reports/templates/${id}`);
  },

  // ========================================
  // Data Sources
  // ========================================
  getDataSources: async (filters?: {
    type?: DataSourceType;
    active?: boolean;
    search?: string;
  }): Promise<DataSource[]> => {
    const response = await api.get<DataSource[]>('/reports/data-sources', {
      params: filters
    });
    return response.data;
  },

  getDataSourceById: async (id: string): Promise<DataSource> => {
    const response = await api.get<DataSource>(`/reports/data-sources/${id}`);
    return response.data;
  },

  testDataSource: async (id: string): Promise<{
    success: boolean;
    message: string;
    connectionTime: number;
    schemaInfo?: any;
  }> => {
    const response = await api.post(`/reports/data-sources/${id}/test`);
    return response.data;
  },

  getDataSourceSchema: async (id: string): Promise<{
    tables: Array<{
      name: string;
      columns: Array<{
        name: string;
        type: string;
        nullable: boolean;
        primaryKey: boolean;
      }>;
    }>;
    relationships: Array<{
      fromTable: string;
      fromColumn: string;
      toTable: string;
      toColumn: string;
    }>;
  }> => {
    const response = await api.get(`/reports/data-sources/${id}/schema`);
    return response.data;
  },

  // ========================================
  // Sharing & Collaboration
  // ========================================
  shareReport: async (request: ShareReportRequest): Promise<ReportShare> => {
    const response = await api.post<ReportShare>('/reports/shares', request);
    return response.data;
  },

  getReportShares: async (reportId: string): Promise<ReportShare[]> => {
    const response = await api.get<ReportShare[]>(`/reports/${reportId}/shares`);
    return response.data;
  },

  updateShare: async (shareId: string, data: Partial<ShareReportRequest>): Promise<ReportShare> => {
    const response = await api.put<ReportShare>(`/reports/shares/${shareId}`, data);
    return response.data;
  },

  deleteShare: async (shareId: string): Promise<void> => {
    await api.delete(`/reports/shares/${shareId}`);
  },

  accessSharedReport: async (shareToken: string, password?: string): Promise<{
    report: ReportEntity;
    permissions: SharePermissions;
    remaining?: number;
  }> => {
    const response = await api.post('/reports/shares/access', {
      shareToken,
      password
    });
    return response.data;
  },

  // ========================================
  // Comments & Collaboration
  // ========================================
  getReportComments: async (reportId: string): Promise<ReportComment[]> => {
    const response = await api.get<ReportComment[]>(`/reports/${reportId}/comments`);
    return response.data;
  },

  addComment: async (reportId: string, content: string, parentId?: string): Promise<ReportComment> => {
    const response = await api.post<ReportComment>(`/reports/${reportId}/comments`, {
      content,
      parentId
    });
    return response.data;
  },

  updateComment: async (commentId: string, content: string): Promise<ReportComment> => {
    const response = await api.put<ReportComment>(`/reports/comments/${commentId}`, {
      content
    });
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/reports/comments/${commentId}`);
  },

  resolveComment: async (commentId: string, resolved: boolean): Promise<void> => {
    await api.patch(`/reports/comments/${commentId}/resolve`, { resolved });
  },

  // ========================================
  // Bookmarks & Snapshots
  // ========================================
  getBookmarks: async (reportId?: string): Promise<ReportBookmark[]> => {
    const response = await api.get<ReportBookmark[]>('/reports/bookmarks', {
      params: { reportId }
    });
    return response.data;
  },

  createBookmark: async (data: {
    reportId: string;
    name?: string;
    parameters?: Record<string, any>;
    filters?: Record<string, any>;
    isDefault?: boolean;
  }): Promise<ReportBookmark> => {
    const response = await api.post<ReportBookmark>('/reports/bookmarks', data);
    return response.data;
  },

  deleteBookmark: async (bookmarkId: string): Promise<void> => {
    await api.delete(`/reports/bookmarks/${bookmarkId}`);
  },

  createSnapshot: async (reportId: string, name: string, description?: string): Promise<ReportSnapshot> => {
    const response = await api.post<ReportSnapshot>(`/reports/${reportId}/snapshots`, {
      name,
      description
    });
    return response.data;
  },

  getSnapshots: async (reportId: string): Promise<ReportSnapshot[]> => {
    const response = await api.get<ReportSnapshot[]>(`/reports/${reportId}/snapshots`);
    return response.data;
  },

  compareSnapshots: async (snapshot1Id: string, snapshot2Id: string): Promise<{
    differences: Array<{
      type: 'added' | 'removed' | 'modified';
      path: string;
      oldValue?: any;
      newValue?: any;
    }>;
    summary: {
      totalChanges: number;
      addedRows: number;
      removedRows: number;
      modifiedRows: number;
    };
  }> => {
    const response = await api.post('/reports/snapshots/compare', {
      snapshot1Id,
      snapshot2Id
    });
    return response.data;
  },

  // ========================================
  // Analytics & Monitoring
  // ========================================
  getReportAnalytics: async (reportId: string, period: AnalyticsPeriod): Promise<ReportAnalytics> => {
    const response = await api.get<ReportAnalytics>(`/reports/${reportId}/analytics`, {
      params: { period }
    });
    return response.data;
  },

  getSystemAnalytics: async (period: AnalyticsPeriod): Promise<AnalyticsResponse> => {
    const response = await api.get<AnalyticsResponse>('/reports/analytics', {
      params: { period }
    });
    return response.data;
  },

  getPopularReports: async (period: AnalyticsPeriod, limit?: number): Promise<Array<{
    report: ReportEntity;
    views: number;
    uniqueUsers: number;
    avgExecutionTime: number;
  }>> => {
    const response = await api.get('/reports/analytics/popular', {
      params: { period, limit }
    });
    return response.data;
  },

  getReportPerformance: async (reportId: string, period: AnalyticsPeriod): Promise<{
    avgExecutionTime: number;
    minExecutionTime: number;
    maxExecutionTime: number;
    errorRate: number;
    cacheHitRate: number;
    trends: Array<{
      date: Date;
      executionTime: number;
      cacheHits: number;
      errors: number;
    }>;
  }> => {
    const response = await api.get(`/reports/${reportId}/performance`, {
      params: { period }
    });
    return response.data;
  },

  // ========================================
  // Bulk Operations
  // ========================================
  bulkUpdateReports: async (reportIds: string[], updates: UpdateReportRequest): Promise<{
    successful: ReportEntity[];
    failed: Array<{
      reportId: string;
      error: string;
    }>;
  }> => {
    const response = await api.post('/reports/bulk-update', {
      reportIds,
      updates
    });
    return response.data;
  },

  bulkDeleteReports: async (reportIds: string[]): Promise<{
    successful: string[];
    failed: Array<{
      reportId: string;
      error: string;
    }>;
  }> => {
    const response = await api.post('/reports/bulk-delete', {
      reportIds
    });
    return response.data;
  },

  // ========================================
  // Import/Export
  // ========================================
  exportReport: async (id: string, format: ReportFormat, options?: ExportOptions): Promise<Blob> => {
    const response = await api.post(`/reports/${id}/export`, 
      { format, options },
      { responseType: 'blob' }
    );
    return response.data;
  },

  importReport: async (file: File, options?: {
    overwrite?: boolean;
    validateOnly?: boolean;
    updateDataSources?: boolean;
  }): Promise<{
    success: boolean;
    report?: ReportEntity;
    errors: string[];
    warnings: string[];
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    const response = await api.post('/reports/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // ========================================
  // System Management
  // ========================================
  refreshCache: async (reportIds?: string[]): Promise<{
    refreshed: string[];
    failed: Array<{
      reportId: string;
      error: string;
    }>;
  }> => {
    const response = await api.post('/reports/cache/refresh', { reportIds });
    return response.data;
  },

  clearCache: async (): Promise<{
    cleared: number;
    totalSize: number;
  }> => {
    const response = await api.post('/reports/cache/clear');
    return response.data;
  },

  getSystemHealth: async (): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    reports: {
      total: number;
      active: number;
      failed: number;
    };
    executions: {
      running: number;
      queued: number;
      avgTime: number;
    };
    resources: {
      cpu: number;
      memory: number;
      storage: number;
    };
    issues: Array<{
      severity: 'low' | 'medium' | 'high';
      message: string;
      recommendation?: string;
    }>;
  }> => {
    const response = await api.get('/reports/health');
    return response.data;
  }
};

export default reportsAPI;