import { 
  ApiResponse, 
  BaseEntity, 
  PaginatedResponse,
  UserRole 
} from './common';

// ================================
// ADMIN ENTITY TYPES  
// ================================

export enum SystemStatus {
  ONLINE = 'online',
  MAINTENANCE = 'maintenance',
  OFFLINE = 'offline'
}

export enum BackupStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface SystemConfig extends BaseEntity {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  description?: string;
  isPublic: boolean;
  isEditable: boolean;
  updatedBy?: string;
}

export interface AdminUser extends BaseEntity {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: Date;
  loginCount: number;
  permissions: string[];
  department?: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  createdBy?: string;
  profile?: {
    phone?: string;
    avatar?: string;
    bio?: string;
  };
}

export interface SystemLog extends BaseEntity {
  id: string;
  level: LogLevel;
  message: string;
  context?: string;
  module: string;
  action: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
}

export interface SystemBackup extends BaseEntity {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'database' | 'files';
  status: BackupStatus;
  size?: number;
  location: string;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  createdBy: string;
  expiresAt?: Date;
  isAutomatic: boolean;
}

export interface SystemHealth {
  status: SystemStatus;
  uptime: number;
  version: string;
  environment: 'development' | 'staging' | 'production';
  services: {
    database: { status: 'healthy' | 'degraded' | 'down'; responseTime: number };
    redis: { status: 'healthy' | 'degraded' | 'down'; responseTime: number };
    storage: { status: 'healthy' | 'degraded' | 'down'; usage: number };
    email: { status: 'healthy' | 'degraded' | 'down'; queueSize: number };
  };
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    activeConnections: number;
  };
  lastChecked: Date;
}

export interface UserActivity extends BaseEntity {
  id: string;
  userId: string;
  action: string;
  resource?: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export interface AdminDashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    newToday: number;
    byRole: { role: UserRole; count: number }[];
  };
  system: {
    status: SystemStatus;
    uptime: string;
    version: string;
    lastBackup?: Date;
    storageUsed: number;
    storageTotal: number;
  };
  business: {
    totalOrders: number;
    totalRevenue: number;
    activeDeals: number;
    pendingIssues: number;
  };
  performance: {
    avgResponseTime: number;
    errorRate: number;
    throughput: number;
  };
  recentActivity: UserActivity[];
}

export interface AdminReport {
  id: string;
  name: string;
  type: 'users' | 'orders' | 'revenue' | 'system' | 'custom';
  parameters: Record<string, any>;
  data: any;
  generatedAt: Date;
  generatedBy: string;
  format: 'json' | 'csv' | 'pdf';
  downloadUrl?: string;
  size: number;
}

// ================================
// REQUEST/RESPONSE TYPES
// ================================

export interface GetUsersRequest {
  role?: UserRole;
  status?: 'active' | 'inactive' | 'suspended';
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  department?: string;
  createdFrom?: Date;
  createdTo?: Date;
}

export interface GetUsersResponse {
  users: PaginatedResponse<AdminUser>;
  summary: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  };
}

export interface CreateUserRequest {
  email: string;
  name: string;
  role: UserRole;
  password: string;
  permissions?: string[];
  department?: string;
  profile?: {
    phone?: string;
    bio?: string;
  };
}

export interface CreateUserResponse {
  user: AdminUser;
  message: string;
}

export interface UpdateUserRequest {
  name?: string;
  role?: UserRole;
  status?: 'active' | 'inactive' | 'suspended';
  permissions?: string[];
  department?: string;
  profile?: {
    phone?: string;
    bio?: string;
  };
}

export interface UpdateUserResponse {
  user: AdminUser;
  message: string;
}

export interface GetSystemConfigResponse {
  configs: SystemConfig[];
  categories: string[];
}

export interface UpdateSystemConfigRequest {
  key: string;
  value: string;
  description?: string;
}

export interface UpdateSystemConfigResponse {
  config: SystemConfig;
  message: string;
}

export interface GetSystemLogsRequest {
  level?: LogLevel;
  module?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetSystemLogsResponse {
  logs: PaginatedResponse<SystemLog>;
  summary: {
    errorCount: number;
    warnCount: number;
    infoCount: number;
    debugCount: number;
  };
}

export interface CreateBackupRequest {
  name: string;
  type: 'full' | 'incremental' | 'database' | 'files';
  description?: string;
}

export interface CreateBackupResponse {
  backup: SystemBackup;
  message: string;
}

export interface GetBackupsResponse {
  backups: PaginatedResponse<SystemBackup>;
  totalSize: number;
}

export interface GetSystemHealthResponse {
  health: SystemHealth;
}

export interface GetUserActivityRequest {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface GetUserActivityResponse {
  activities: PaginatedResponse<UserActivity>;
}

export interface GetDashboardStatsResponse {
  stats: AdminDashboardStats;
}

export interface GenerateReportRequest {
  name: string;
  type: 'users' | 'orders' | 'revenue' | 'system' | 'custom';
  parameters: Record<string, any>;
  format?: 'json' | 'csv' | 'pdf';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
}

export interface GenerateReportResponse {
  report: AdminReport;
  message: string;
}

export interface GetReportsResponse {
  reports: PaginatedResponse<AdminReport>;
}

// ================================
// FILTER TYPES
// ================================

export interface AdminUserFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  role?: UserRole | UserRole[];
  status?: ('active' | 'inactive' | 'suspended')[];
  department?: string;
  search?: string;
  createdFrom?: Date;
  createdTo?: Date;
  lastLoginFrom?: Date;
  lastLoginTo?: Date;
}

export interface SystemLogFilter {
  page?: number;
  limit?: number;
  level?: LogLevel | LogLevel[];
  module?: string;
  action?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface BackupFilter {
  page?: number;
  limit?: number;
  type?: ('full' | 'incremental' | 'database' | 'files')[];
  status?: BackupStatus[];
  isAutomatic?: boolean;
  createdBy?: string;
  startDate?: Date;
  endDate?: Date;
}

// ================================
// ADMIN API INTERFACE
// ================================

export interface AdminAPI {
  // User Management
  getUsers(filter?: GetUsersRequest): Promise<ApiResponse<GetUsersResponse>>;
  getUserById(id: string): Promise<ApiResponse<{ user: AdminUser }>>;
  createUser(request: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>>;
  updateUser(id: string, request: UpdateUserRequest): Promise<ApiResponse<UpdateUserResponse>>;
  deleteUser(id: string): Promise<ApiResponse<{ message: string }>>;
  suspendUser(id: string, reason: string): Promise<ApiResponse<{ user: AdminUser }>>;
  activateUser(id: string): Promise<ApiResponse<{ user: AdminUser }>>;
  resetUserPassword(id: string): Promise<ApiResponse<{ tempPassword: string }>>;
  getUserStats(): Promise<ApiResponse<{
    total: number;
    byRole: { role: UserRole; count: number }[];
    byStatus: { status: string; count: number }[];
    growth: { period: string; count: number }[];
  }>>;
  
  // System Configuration
  getSystemConfig(): Promise<ApiResponse<GetSystemConfigResponse>>;
  updateSystemConfig(request: UpdateSystemConfigRequest): Promise<ApiResponse<UpdateSystemConfigResponse>>;
  getConfigByKey(key: string): Promise<ApiResponse<{ config: SystemConfig }>>;
  resetConfigToDefault(key: string): Promise<ApiResponse<{ config: SystemConfig }>>;
  
  // System Monitoring
  getSystemHealth(): Promise<ApiResponse<GetSystemHealthResponse>>;
  getSystemMetrics(period?: string): Promise<ApiResponse<{
    cpu: { timestamp: Date; value: number }[];
    memory: { timestamp: Date; value: number }[];
    disk: { timestamp: Date; value: number }[];
    connections: { timestamp: Date; value: number }[];
  }>>;
  
  // System Logs
  getSystemLogs(filter?: GetSystemLogsRequest): Promise<ApiResponse<GetSystemLogsResponse>>;
  clearLogs(olderThan?: Date): Promise<ApiResponse<{ deletedCount: number }>>;
  downloadLogs(filter?: SystemLogFilter): Promise<Blob>;
  
  // Backup Management
  createBackup(request: CreateBackupRequest): Promise<ApiResponse<CreateBackupResponse>>;
  getBackups(filter?: BackupFilter): Promise<ApiResponse<GetBackupsResponse>>;
  restoreBackup(backupId: string): Promise<ApiResponse<{ message: string }>>;
  deleteBackup(backupId: string): Promise<ApiResponse<{ message: string }>>;
  downloadBackup(backupId: string): Promise<Blob>;
  
  // User Activity Tracking
  getUserActivity(filter?: GetUserActivityRequest): Promise<ApiResponse<GetUserActivityResponse>>;
  logUserActivity(activity: Omit<UserActivity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ logged: boolean }>>;
  
  // Dashboard & Analytics
  getDashboardStats(): Promise<ApiResponse<GetDashboardStatsResponse>>;
  getAnalyticsSummary(period?: string): Promise<ApiResponse<{
    userGrowth: number;
    revenueGrowth: number;
    orderGrowth: number;
    systemUptime: number;
  }>>;
  
  // Reports
  generateReport(request: GenerateReportRequest): Promise<ApiResponse<GenerateReportResponse>>;
  getReports(): Promise<ApiResponse<GetReportsResponse>>;
  downloadReport(reportId: string): Promise<Blob>;
  deleteReport(reportId: string): Promise<ApiResponse<{ message: string }>>;
  
  // Maintenance
  setMaintenanceMode(enabled: boolean, message?: string): Promise<ApiResponse<{ enabled: boolean }>>;
  clearCache(cacheKeys?: string[]): Promise<ApiResponse<{ cleared: string[] }>>;
  optimizeDatabase(): Promise<ApiResponse<{ optimized: boolean; size: number }>>;
  
  // Security
  getSecurityLogs(): Promise<ApiResponse<{ logs: SystemLog[] }>>;
  getFailedLogins(): Promise<ApiResponse<{ attempts: { ip: string; count: number; lastAttempt: Date }[] }>>;
  blockIP(ip: string, reason: string): Promise<ApiResponse<{ blocked: boolean }>>;
  unblockIP(ip: string): Promise<ApiResponse<{ unblocked: boolean }>>;
  
  // System Updates
  checkForUpdates(): Promise<ApiResponse<{
    available: boolean;
    currentVersion: string;
    latestVersion?: string;
    releaseNotes?: string;
  }>>;
  performUpdate(version: string): Promise<ApiResponse<{ updateStarted: boolean }>>;
}