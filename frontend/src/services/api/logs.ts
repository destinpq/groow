import apiClient from './client';

// ============================================================================
// Interfaces
// ============================================================================

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: 'admin' | 'vendor' | 'customer';
  action: string;
  resource: string;
  resourceId?: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
  duration: number; // milliseconds
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ErrorLog {
  id: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  stack?: string;
  code?: string;
  userId?: string;
  userName?: string;
  ipAddress: string;
  url: string;
  method: string;
  statusCode?: number;
  metadata?: Record<string, any>;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface SecurityLog {
  id: string;
  type: 'login_attempt' | 'password_change' | 'suspicious_activity' | 'blocked_ip' | 'api_abuse' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userId?: string;
  userName?: string;
  ipAddress: string;
  userAgent?: string;
  status: 'resolved' | 'pending' | 'investigating';
  resolvedBy?: string;
  resolvedAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface SystemLog {
  id: string;
  type: 'system' | 'database' | 'cache' | 'storage' | 'queue' | 'email';
  level: 'info' | 'warn' | 'error' | 'critical';
  message: string;
  service: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface LogStats {
  totalLogs: number;
  activityLogs: number;
  errorLogs: number;
  securityLogs: number;
  systemLogs: number;
  todayLogs: number;
  unresolvedErrors: number;
  criticalAlerts: number;
  averageResponseTime: number; // milliseconds
}

export interface LogFilters {
  type?: 'activity' | 'error' | 'security' | 'system';
  level?: 'info' | 'warn' | 'error' | 'critical' | 'debug';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  userRole?: 'admin' | 'vendor' | 'customer';
  ipAddress?: string;
  status?: 'success' | 'failed' | 'resolved' | 'pending' | 'investigating';
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface LogExportOptions {
  type?: 'activity' | 'error' | 'security' | 'system';
  format: 'csv' | 'json' | 'xlsx';
  startDate?: string;
  endDate?: string;
  filters?: LogFilters;
}

// ============================================================================
// Logs API
// ============================================================================

export const logsAPI = {
  // Activity Logs
  getActivityLogs: (filters?: LogFilters) => {
    return apiClient.get<{
      logs: ActivityLog[];
      total: number;
      page: number;
      limit: number;
    }>('/logs/activity', { params: filters });
  },

  getActivityLogById: (id: string) => {
    return apiClient.get<ActivityLog>(`/logs/activity/${id}`);
  },

  deleteActivityLogs: (ids: string[]) => {
    return apiClient.delete('/logs/activity', { data: { ids } });
  },

  // Error Logs
  getErrorLogs: (filters?: LogFilters) => {
    return apiClient.get<{
      logs: ErrorLog[];
      total: number;
      page: number;
      limit: number;
    }>('/logs/errors', { params: filters });
  },

  getErrorLogById: (id: string) => {
    return apiClient.get<ErrorLog>(`/logs/errors/${id}`);
  },

  resolveErrorLog: (id: string, resolvedBy: string) => {
    return apiClient.patch<ErrorLog>(`/logs/errors/${id}/resolve`, { resolvedBy });
  },

  deleteErrorLogs: (ids: string[]) => {
    return apiClient.delete('/logs/errors', { data: { ids } });
  },

  // Security Logs
  getSecurityLogs: (filters?: LogFilters) => {
    return apiClient.get<{
      logs: SecurityLog[];
      total: number;
      page: number;
      limit: number;
    }>('/logs/security', { params: filters });
  },

  getSecurityLogById: (id: string) => {
    return apiClient.get<SecurityLog>(`/logs/security/${id}`);
  },

  updateSecurityLogStatus: (id: string, status: SecurityLog['status'], resolvedBy?: string) => {
    return apiClient.patch<SecurityLog>(`/logs/security/${id}/status`, { status, resolvedBy });
  },

  deleteSecurityLogs: (ids: string[]) => {
    return apiClient.delete('/logs/security', { data: { ids } });
  },

  // System Logs
  getSystemLogs: (filters?: LogFilters) => {
    return apiClient.get<{
      logs: SystemLog[];
      total: number;
      page: number;
      limit: number;
    }>('/logs/system', { params: filters });
  },

  getSystemLogById: (id: string) => {
    return apiClient.get<SystemLog>(`/logs/system/${id}`);
  },

  deleteSystemLogs: (ids: string[]) => {
    return apiClient.delete('/logs/system', { data: { ids } });
  },

  // Statistics
  getLogStats: () => {
    return apiClient.get<LogStats>('/logs/stats');
  },

  // Export
  exportLogs: (options: LogExportOptions) => {
    return apiClient.post('/logs/export', options, {
      responseType: 'blob',
    });
  },

  // Bulk Operations
  bulkDeleteLogs: (type: 'activity' | 'error' | 'security' | 'system', ids: string[]) => {
    return apiClient.delete(`/logs/${type}/bulk`, { data: { ids } });
  },

  clearOldLogs: (type: 'activity' | 'error' | 'security' | 'system', days: number) => {
    return apiClient.delete(`/logs/${type}/clear`, { params: { days } });
  },

  // Search
  searchLogs: (query: string, type?: 'activity' | 'error' | 'security' | 'system') => {
    return apiClient.get<{
      logs: (ActivityLog | ErrorLog | SecurityLog | SystemLog)[];
      total: number;
    }>('/logs/search', { params: { query, type } });
  },
};
