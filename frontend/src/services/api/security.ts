import apiClient from './client';import { api } from '../../lib/api-client';import { api } from '../../lib/api-client';/**



// Backend POJO imports - Security Moduleimport { 

import {

  SecurityEventEntity,  SecurityEventEntity, import {  * Security API Service

  SecurityThreatEntity,

  SecurityAuditLogEntity,  SecurityThreatEntity, 

  SecurityAlertEntity,

  SecurityConfigurationEntity,  SecurityAuditLogEntity,   SecurityEventEntity,  * 

  SecurityAccessControlEntity,

  SecurityAPIResponse,  SecurityAlertEntity, 

  PaginatedSecurityResponse,

  CreateSecurityEventRequest,  SecurityConfigurationEntity,   SecurityThreatEntity,  * Handles security monitoring, threat detection, and audit logging with backend POJOs

  CreateSecurityThreatRequest,

  UpdateSecurityConfigurationRequest,  SecurityAccessControlEntity,

  SecurityScanRequest,

  GetSecurityEventsResponse,  SecuritySeverity,  SecurityAuditLogEntity,  */

  GetSecurityThreatsResponse,

  GetSecurityAlertsResponse,  SecurityEventType,

  GetAuditLogsResponse,

  SecurityStatsResponse,  ThreatType,  SecurityAlertEntity, 

  SecurityScanResponse,

  SecurityThreatAnalysisResponse,  ThreatStatus,

  SecuritySeverity,

  SecurityEventType,  SecurityEventStatus,  SecurityConfigurationEntity, import api from './client';

  ThreatType,

  ThreatStatus,  SecurityCategory,

  SecurityEventStatus,

  SecurityCategory,  SecurityAlertType  SecurityAccessControlEntity,

  SecurityAlertType

} from '../../types/backend/security';} from '../../types/backend/security';



// Legacy interfaces for backward compatibility  SecuritySeverity,// Backend POJO imports - Security Module

export interface SecurityThreat {

  id: string;// Response wrapper types

  type: 'malware' | 'phishing' | 'ddos' | 'brute_force' | 'sql_injection' | 'xss' | 'unauthorized_access';

  severity: 'critical' | 'high' | 'medium' | 'low';interface APIResponse<T> {  SecurityEventType,import {

  source: string;

  target: string;  data: T;

  status: 'active' | 'blocked' | 'resolved';

  description: string;  success: boolean;  ThreatType,  SecurityEventEntity,

  detectedAt: string;

  resolvedAt?: string;  message?: string;

  actionTaken?: string;

  affectedUsers?: number;}  ThreatStatus,  SecurityThreatEntity,

  ipAddress: string;

  userAgent?: string;

  metadata?: Record<string, any>;

}interface PaginatedResponse<T> {  SecurityEventStatus,  SecurityAuditLogEntity,



export interface SecurityEvent {  data: T[];

  id: string;

  type: 'login' | 'logout' | 'password_change' | 'failed_login' | 'suspicious_activity' | 'data_access' | 'permission_change';  total: number;  SecurityCategory,  SecurityAlertEntity,

  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';

  userId?: string;  page: number;

  userName?: string;

  ipAddress: string;  totalPages: number;  SecurityAlertType  SecurityConfigurationEntity,

  userAgent?: string;

  timestamp: string;  limit: number;

  description: string;

  details?: Record<string, any>;}} from '../../types/backend/security';  SecurityAccessControlEntity,

  location?: {

    country: string;

    city: string;

    coordinates?: [number, number];// Security scan response structure  SecurityAPIResponse,

  };

}interface SecurityScanResponse {



export interface SecurityFilters {  scanId: string;// Response wrapper types  PaginatedSecurityResponse,

  startDate?: string;

  endDate?: string;  type: string;

  severity?: string[];

  type?: string[];  status: 'queued' | 'running' | 'completed' | 'failed';interface APIResponse<T> {  CreateSecurityEventRequest,

  status?: string[];

  ipAddress?: string;  progress: number;

  userId?: string;

  page?: number;  startedAt: Date;  data: T;  CreateSecurityThreatRequest,

  limit?: number;

}  completedAt?: Date;



// Security Management API with backend POJOs integration  results?: any;  success: boolean;  UpdateSecurityConfigurationRequest,

export const securityAPI = {

  // ========================================}

  // Security Overview & Metrics

  // ========================================  message?: string;  SecurityScanRequest,

  getStats: async (filters?: {

    dateRange?: { start: Date; end: Date };// Legacy compatibility types

    includeProjections?: boolean;

    includeTrends?: boolean;interface SecurityFilters {}  GetSecurityEventsResponse,

  }): Promise<SecurityStatsResponse> => {

    const response = await apiClient.get<SecurityAPIResponse<SecurityStatsResponse>>('/admin/security/stats', {  type?: string[];

      params: filters

    });  severity?: string[];  GetSecurityThreatsResponse,

    return response.data.data;

  },  status?: string[];



  getConfiguration: async (): Promise<SecurityConfigurationEntity> => {  startDate?: string;interface PaginatedResponse<T> {  GetSecurityAlertsResponse,

    const response = await apiClient.get<SecurityAPIResponse<SecurityConfigurationEntity>>('/admin/security/configuration');

    return response.data.data;  endDate?: string;

  },

  search?: string;  data: T[];  GetAuditLogsResponse,

  updateConfiguration: async (data: UpdateSecurityConfigurationRequest): Promise<SecurityConfigurationEntity> => {

    const response = await apiClient.put<SecurityAPIResponse<SecurityConfigurationEntity>>('/admin/security/configuration', data);  userId?: string;

    return response.data.data;

  },  ipAddress?: string;  total: number;  SecurityMetricsResponse,



  // ========================================  page?: number;

  // Security Events Management

  // ========================================  limit?: number;  page: number;  SecurityScanResponse,

  getEvents: async (filters?: {

    eventType?: SecurityEventType;}

    severity?: SecuritySeverity;

    category?: SecurityCategory;  totalPages: number;  SecurityEventType,

    userId?: string;

    ipAddress?: string;interface SecurityThreat {

    dateFrom?: Date;

    dateTo?: Date;  id: string;  limit: number;  SecuritySeverity,

    search?: string;

    page?: number;  type: string;

    limit?: number;

  }): Promise<GetSecurityEventsResponse> => {  severity: string;}  SecurityCategory,

    const response = await apiClient.get<PaginatedSecurityResponse<SecurityEventEntity>>('/admin/security/events', {

      params: filters  source: string;

    });

    return {  target: string;  ThreatType,

      events: response.data.data.items,

      total: response.data.data.total,  status: string;

      page: response.data.data.page,

      totalPages: response.data.data.totalPages  description: string;// Request/Response types for Security API  SecurityEventStatus,

    };

  },  detectedAt: string;



  getEventById: async (id: string): Promise<SecurityEventEntity> => {  resolvedAt?: string;interface GetSecurityEventsResponse {  ThreatStatus,

    const response = await apiClient.get<SecurityAPIResponse<SecurityEventEntity>>(`/admin/security/events/${id}`);

    return response.data.data;  actionTaken?: string;

  },

  affectedUsers: number;  events: SecurityEventEntity[];  AlertType,

  // ========================================

  // Threat Management  ipAddress: string;

  // ========================================

  getThreats: async (filters?: {  userAgent: string;  total: number;  AlertStatus,

    threatType?: ThreatType;

    severity?: SecuritySeverity;  metadata: Record<string, any>;

    status?: ThreatStatus;

    source?: string;}  page: number;  AuditEventType

    target?: string;

    dateFrom?: Date;

    dateTo?: Date;

    search?: string;interface SecurityEvent {  totalPages: number;} from '../../types/backend/security';

    page?: number;

    limit?: number;  id: string;

  }): Promise<GetSecurityThreatsResponse> => {

    const response = await apiClient.get<PaginatedSecurityResponse<SecurityThreatEntity>>('/admin/security/threats', {  type: string;}

      params: filters

    });  severity: string;

    return {

      threats: response.data.data.items,  userId?: string;// Legacy Security Types for backward compatibility

      total: response.data.data.total,

      page: response.data.data.page,  userName?: string;

      totalPages: response.data.data.totalPages

    };  ipAddress: string;interface GetSecurityThreatsResponse {export interface SecurityThreat {

  },

  userAgent?: string;

  getThreatById: async (id: string): Promise<SecurityThreatEntity> => {

    const response = await apiClient.get<SecurityAPIResponse<SecurityThreatEntity>>(`/admin/security/threats/${id}`);  timestamp: string;  threats: SecurityThreatEntity[];  id: string;

    return response.data.data;

  },  description: string;



  resolveThreat: async (id: string, actionTaken: string): Promise<SecurityThreatEntity> => {  metadata: Record<string, any>;  total: number;  type: 'malware' | 'phishing' | 'ddos' | 'brute_force' | 'sql_injection' | 'xss' | 'unauthorized_access';

    const response = await apiClient.patch<SecurityAPIResponse<SecurityThreatEntity>>(`/admin/security/threats/${id}/resolve`, { actionTaken });

    return response.data.data;}

  },

  page: number;  severity: 'critical' | 'high' | 'medium' | 'low';

  blockThreat: async (id: string): Promise<SecurityThreatEntity> => {

    const response = await apiClient.patch<SecurityAPIResponse<SecurityThreatEntity>>(`/admin/security/threats/${id}/block`);interface ActivityLog {

    return response.data.data;

  },  id: string;  totalPages: number;  source: string;



  // ========================================  userId: string;

  // IP Management

  // ========================================  userName: string;}  target: string;

  getBlockedIPs: async (filters?: SecurityFilters): Promise<{

    data: any[];  userRole: string;

    total: number;

    page: number;  action: string;  status: 'active' | 'blocked' | 'resolved';

    limit: number;

  }> => {  resource: string;

    const response = await apiClient.get('/admin/security/blocked-ips', { params: filters });

    return response.data;  resourceId: string;interface GetSecurityAlertsResponse {  description: string;

  },

  ipAddress: string;

  blockIP: async (data: {

    ipAddress: string;  timestamp: string;  alerts: SecurityAlertEntity[];  detectedAt: string;

    reason: string;

    permanent?: boolean;  success: boolean;

    expiresAt?: string;

  }): Promise<any> => {  details: Record<string, any>;  total: number;  resolvedAt?: string;

    const response = await apiClient.post('/admin/security/blocked-ips', data);

    return response.data;  changes: Record<string, any>;

  },

}  page: number;  actionTaken?: string;

  unblockIP: async (id: string): Promise<void> => {

    await apiClient.delete(`/admin/security/blocked-ips/${id}`);

  },

// Security Management API with backend POJOs integration  totalPages: number;  affectedUsers?: number;

  // ========================================

  // Activity Logsexport const securityAPI = {

  // ========================================

  getActivityLogs: async (filters?: SecurityFilters): Promise<{  // Security Events}  ipAddress: string;

    data: any[];

    total: number;  getSecurityEvents: async (filters?: {

    page: number;

    limit: number;    type?: SecurityEventType;  userAgent?: string;

  }> => {

    const response = await apiClient.get('/admin/security/activity-logs', { params: filters });    severity?: SecuritySeverity;

    return response.data;

  },    category?: SecurityCategory;interface GetAuditLogsResponse {  metadata?: Record<string, any>;



  getActivityLogById: async (id: string): Promise<any> => {    status?: SecurityEventStatus;

    const response = await apiClient.get(`/admin/security/activity-logs/${id}`);

    return response.data;    actorId?: string;  logs: SecurityAuditLogEntity[];}

  },

    targetId?: string;

  // ========================================

  // Security Scanning    dateFrom?: Date;  total: number;

  // ========================================

  runSecurityScan: async (): Promise<{ jobId: string; message: string }> => {    dateTo?: Date;

    const response = await apiClient.post('/admin/security/scan');

    return response.data;    search?: string;  page: number;export interface SecurityEvent {

  },

    page?: number;

  getScanStatus: async (jobId: string): Promise<{

    status: 'pending' | 'running' | 'completed' | 'failed';    limit?: number;  totalPages: number;  id: string;

    progress: number;

    results?: any;  }): Promise<{

  }> => {

    const response = await apiClient.get(`/admin/security/scan/${jobId}`);    events: SecurityEventEntity[];}  type: 'login' | 'logout' | 'password_change' | 'failed_login' | 'suspicious_activity' | 'data_access' | 'permission_change';

    return response.data;

  },    total: number;



  // ========================================    page: number;  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';

  // Export Functions

  // ========================================    totalPages: number;

  exportThreats: async (filters?: SecurityFilters): Promise<Blob> => {

    const response = await apiClient.get('/admin/security/threats/export', {  }> => {interface GetAccessControlsResponse {  userId?: string;

      params: filters,

      responseType: 'blob',    const response = await api.get<APIResponse<PaginatedResponse<SecurityEventEntity>>>('/admin/security/events', {

    });

    return response.data;      params: filters  controls: SecurityAccessControlEntity[];  userName?: string;

  },

    });

  exportEvents: async (filters?: SecurityFilters): Promise<Blob> => {

    const response = await apiClient.get('/admin/security/events/export', {    return {  total: number;  ipAddress: string;

      params: filters,

      responseType: 'blob',      events: response.data.data,

    });

    return response.data;      total: response.data.total,  page: number;  userAgent?: string;

  },

      page: response.data.page,

  exportActivityLogs: async (filters?: SecurityFilters): Promise<Blob> => {

    const response = await apiClient.get('/admin/security/activity-logs/export', {      totalPages: response.data.totalPages  totalPages: number;  timestamp: string;

      params: filters,

      responseType: 'blob',    };

    });

    return response.data;  },}  description: string;

  },



  // ========================================

  // Real-time monitoring  getSecurityEventById: async (id: string): Promise<SecurityEventEntity> => {  details?: Record<string, any>;

  // ========================================

  getRealtimeMetrics: async (): Promise<{    const response = await api.get<APIResponse<SecurityEventEntity>>(`/admin/security/events/${id}`);

    activeConnections: number;

    requestsPerMinute: number;    return response.data.data;interface GetSecurityScansResponse {  location?: {

    failedLoginAttempts: number;

    blockedRequests: number;  },

    systemLoad: number;

    memoryUsage: number;  scans: SecurityScanResponse[];    country: string;

    diskUsage: number;

  }> => {  // Security Threats

    const response = await apiClient.get('/admin/security/realtime-metrics');

    return response.data;  getSecurityThreats: async (filters?: {  total: number;    city: string;

  },

    type?: ThreatType;

  // ========================================

  // System status    severity?: SecuritySeverity;  page: number;    coordinates?: [number, number];

  // ========================================

  getSystemHealth: async (): Promise<{    status?: ThreatStatus;

    overall: 'healthy' | 'warning' | 'critical';

    services: Array<{    dateFrom?: Date;  totalPages: number;  };

      name: string;

      status: 'up' | 'down' | 'degraded';    dateTo?: Date;

      responseTime: number;

      lastCheck: string;    search?: string;}}

    }>;

    uptime: number;    page?: number;

    version: string;

    environment: string;    limit?: number;

  }> => {

    const response = await apiClient.get('/admin/security/system-health');  }): Promise<{

    return response.data;

  },    threats: SecurityThreatEntity[];// Security scan response structureexport interface BlockedIP {



  // ========================================    total: number;

  // Legacy Compatibility Methods

  // ========================================    page: number;interface SecurityScanResponse {  id: string;

  async getSecurityMetrics(): Promise<{

    totalThreats: number;    totalPages: number;

    activeThreatsByType: Record<string, number>;

    threatsTrend: Array<{ date: string; count: number; }>;  }> => {  scanId: string;  ipAddress: string;

    blockedIPs: number;

    suspiciousActivities: number;    const response = await api.get<APIResponse<PaginatedResponse<SecurityThreatEntity>>>('/admin/security/threats', {

    securityScore: number;

    vulnerabilities: {      params: filters  type: string;  reason: string;

      critical: number;

      high: number;    });

      medium: number;

      low: number;    return {  status: 'queued' | 'running' | 'completed' | 'failed';  blockedBy: string;

    };

    lastScan: string;      threats: response.data.data,

    systemStatus: 'secure' | 'warning' | 'critical';

  }> {      total: response.data.total,  progress: number;  blockedAt: string;

    const stats = await securityAPI.getStats();

    return {      page: response.data.page,

      totalThreats: stats.overview.totalThreats,

      activeThreatsByType: stats.threatsByType,      totalPages: response.data.totalPages  startedAt: Date;  expiresAt?: string;

      threatsTrend: stats.trends.map(t => ({ date: t.date, count: t.threats })),

      blockedIPs: stats.overview.blockedIPs,    };

      suspiciousActivities: stats.overview.suspiciousActivities,

      securityScore: stats.overview.securityScore,  },  completedAt?: Date;  permanent: boolean;

      vulnerabilities: stats.vulnerabilities,

      lastScan: stats.lastScanDate?.toISOString() || new Date().toISOString(),

      systemStatus: stats.overall.status === 'secure' ? 'secure' : 

                   stats.overall.status === 'warning' ? 'warning' : 'critical',  getSecurityThreatById: async (id: string): Promise<SecurityThreatEntity> => {  results?: any;  status: 'active' | 'expired' | 'removed';

    };

  },    const response = await api.get<APIResponse<SecurityThreatEntity>>(`/admin/security/threats/${id}`);



  async getSecurityConfiguration(): Promise<{    return response.data.data;}  attempts: number;

    twoFactorRequired: boolean;

    passwordPolicy: {  },

      minLength: number;

      requireUppercase: boolean;  lastAttempt?: string;

      requireLowercase: boolean;

      requireNumbers: boolean;  updateThreatStatus: async (id: string, status: ThreatStatus, notes?: string): Promise<SecurityThreatEntity> => {

      requireSpecialChars: boolean;

      maxAge: number;    const response = await api.put<APIResponse<SecurityThreatEntity>>(`/admin/security/threats/${id}/status`, {interface CreateSecurityEventRequest {}

    };

    sessionTimeout: number;      status,

    maxFailedLogins: number;

    ipWhitelist: string[];      notes  type: SecurityEventType;

    emailNotifications: boolean;

    smsNotifications: boolean;    });

    auditLogRetention: number;

    encryptionLevel: 'standard' | 'enhanced';    return response.data.data;  category: SecurityCategory;export interface ActivityLog {

    backupEncryption: boolean;

  }> {  },

    const config = await securityAPI.getConfiguration();

    return {  severity: SecuritySeverity;  id: string;

      twoFactorRequired: config.authentication.mfaRequired,

      passwordPolicy: {  // Security Alerts

        minLength: config.authentication.passwordPolicy.minLength,

        requireUppercase: config.authentication.passwordPolicy.requireUppercase,  getSecurityAlerts: async (filters?: {  description: string;  userId: string;

        requireLowercase: config.authentication.passwordPolicy.requireLowercase,

        requireNumbers: config.authentication.passwordPolicy.requireNumbers,    type?: SecurityAlertType;

        requireSpecialChars: config.authentication.passwordPolicy.requireSpecialChars,

        maxAge: config.authentication.passwordPolicy.maxAge,    severity?: SecuritySeverity;  actor: {  userName: string;

      },

      sessionTimeout: config.session.timeoutMinutes,    resolved?: boolean;

      maxFailedLogins: config.authentication.maxFailedLogins,

      ipWhitelist: config.network.allowedIPs,    dateFrom?: Date;    id: string;  userRole: string;

      emailNotifications: config.notifications.emailEnabled,

      smsNotifications: config.notifications.smsEnabled,    dateTo?: Date;

      auditLogRetention: config.audit.retentionDays,

      encryptionLevel: config.encryption.level as any,    page?: number;    type: string;  action: string;

      backupEncryption: config.backup.encryptionEnabled,

    };    limit?: number;

  },

  }): Promise<{    ipAddress: string;  resource: string;

  async updateSecurityConfiguration(config: any): Promise<any> {

    const updateRequest: UpdateSecurityConfigurationRequest = {    alerts: SecurityAlertEntity[];

      authentication: config.twoFactorRequired !== undefined ? {

        mfaRequired: config.twoFactorRequired,    total: number;    userAgent?: string;  resourceId?: string;

        maxFailedLogins: config.maxFailedLogins,

        passwordPolicy: config.passwordPolicy ? {    page: number;

          minLength: config.passwordPolicy.minLength,

          requireUppercase: config.passwordPolicy.requireUppercase,    totalPages: number;  };  ipAddress: string;

          requireLowercase: config.passwordPolicy.requireLowercase,

          requireNumbers: config.passwordPolicy.requireNumbers,  }> => {

          requireSpecialChars: config.passwordPolicy.requireSpecialChars,

          maxAge: config.passwordPolicy.maxAge,    const response = await api.get<APIResponse<PaginatedResponse<SecurityAlertEntity>>>('/admin/security/alerts', {  target?: {  timestamp: string;

        } : undefined,

      } : undefined,      params: filters

      session: config.sessionTimeout !== undefined ? {

        timeoutMinutes: config.sessionTimeout,    });    id: string;  success: boolean;

      } : undefined,

      network: config.ipWhitelist !== undefined ? {    return {

        allowedIPs: config.ipWhitelist,

      } : undefined,      alerts: response.data.data,    type: string;  details?: Record<string, any>;

      notifications: (config.emailNotifications !== undefined || config.smsNotifications !== undefined) ? {

        emailEnabled: config.emailNotifications,      total: response.data.total,

        smsEnabled: config.smsNotifications,

      } : undefined,      page: response.data.page,  };  changes?: {

      audit: config.auditLogRetention !== undefined ? {

        retentionDays: config.auditLogRetention,      totalPages: response.data.totalPages

      } : undefined,

    };    };  metadata?: Record<string, any>;    before: Record<string, any>;



    return await securityAPI.updateConfiguration(updateRequest);  },

  },

}    after: Record<string, any>;

  async getSecurityEvents(filters?: SecurityFilters): Promise<{

    data: SecurityEvent[];  // Audit Logs

    total: number;

    page: number;  getAuditLogs: async (filters?: {  };

    limit: number;

  }> {    actorId?: string;

    const response = await securityAPI.getEvents({

      eventType: filters?.type?.[0] as SecurityEventType,    action?: string;// Legacy compatibility types}

      severity: filters?.severity?.[0] as SecuritySeverity,

      userId: filters?.userId,    resourceType?: string;

      ipAddress: filters?.ipAddress,

      dateFrom: filters?.startDate ? new Date(filters.startDate) : undefined,    resourceId?: string;interface SecurityFilters {

      dateTo: filters?.endDate ? new Date(filters.endDate) : undefined,

      page: filters?.page,    result?: 'success' | 'failure';

      limit: filters?.limit,

    });    dateFrom?: Date;  type?: string[];export interface SecurityMetrics {



    return {    dateTo?: Date;

      data: response.events.map(event => ({

        id: event.id,    ipAddress?: string;  severity?: string[];  totalThreats: number;

        type: event.eventType as any,

        severity: event.severity as any,    page?: number;

        userId: event.userId,

        userName: event.user?.name,    limit?: number;  status?: string[];  activeThreatsByType: Record<string, number>;

        ipAddress: event.source.ipAddress,

        userAgent: event.source.userAgent,  }): Promise<{

        timestamp: event.createdAt.toISOString(),

        description: event.description,    logs: SecurityAuditLogEntity[];  startDate?: string;  threatsTrend: Array<{ date: string; count: number; }>;

        details: event.metadata,

        location: event.location ? {    total: number;

          country: event.location.country,

          city: event.location.city,    page: number;  endDate?: string;  blockedIPs: number;

          coordinates: event.location.coordinates as [number, number],

        } : undefined,    totalPages: number;

      })),

      total: response.total,  }> => {  search?: string;  suspiciousActivities: number;

      page: response.page,

      limit: 20,    const response = await api.get<APIResponse<PaginatedResponse<SecurityAuditLogEntity>>>('/admin/security/audit-logs', {

    };

  },      params: filters  userId?: string;  securityScore: number;



  updateBlockedIP: async (id: string, data: any): Promise<any> => {    });

    const response = await apiClient.patch(`/admin/security/blocked-ips/${id}`, data);

    return response.data;    return {  ipAddress?: string;  vulnerabilities: {

  },

};      logs: response.data.data,



export default securityAPI;      total: response.data.total,  page?: number;    critical: number;

      page: response.data.page,

      totalPages: response.data.totalPages  limit?: number;    high: number;

    };

  },}    medium: number;



  getAuditLogById: async (id: string): Promise<SecurityAuditLogEntity> => {    low: number;

    const response = await api.get<APIResponse<SecurityAuditLogEntity>>(`/admin/security/audit-logs/${id}`);

    return response.data.data;interface SecurityThreat {  };

  },

  id: string;  lastScan: string;

  exportAuditLogs: async (filters?: {

    dateFrom?: Date;  type: string;  systemStatus: 'secure' | 'warning' | 'critical';

    dateTo?: Date;

    format?: 'json' | 'csv' | 'pdf';  severity: string;}

  }): Promise<Blob> => {

    const response = await api.get('/admin/security/audit-logs/export', {  source: string;

      params: filters,

      responseType: 'blob'  target: string;export interface SecurityConfiguration {

    });

    return response.data;  status: string;  twoFactorRequired: boolean;

  },

  description: string;  passwordPolicy: {

  // Security Configuration

  getSecurityConfiguration: async (): Promise<SecurityConfigurationEntity> => {  detectedAt: string;    minLength: number;

    const response = await api.get<APIResponse<SecurityConfigurationEntity>>('/admin/security/configuration');

    return response.data.data;  resolvedAt?: string;    requireUppercase: boolean;

  },

  actionTaken?: string;    requireLowercase: boolean;

  updateSecurityConfiguration: async (data: Partial<SecurityConfigurationEntity>): Promise<SecurityConfigurationEntity> => {

    const response = await api.put<APIResponse<SecurityConfigurationEntity>>('/admin/security/configuration', data);  affectedUsers: number;    requireNumbers: boolean;

    return response.data.data;

  },  ipAddress: string;    requireSpecialChars: boolean;



  // Security Scanning  userAgent: string;    maxAge: number; // days

  startSecurityScan: async (data: {

    type: string;  metadata: Record<string, any>;  };

    scope: Record<string, any>;

  }): Promise<SecurityScanResponse> => {}  sessionTimeout: number; // minutes

    const response = await api.post<APIResponse<SecurityScanResponse>>('/admin/security/scans', data);

    return response.data.data;  maxFailedLogins: number;

  },

interface SecurityEvent {  ipWhitelist: string[];

  getSecurityScanStatus: async (scanId: string): Promise<SecurityScanResponse> => {

    const response = await api.get<APIResponse<SecurityScanResponse>>(`/admin/security/scans/${scanId}/status`);  id: string;  emailNotifications: boolean;

    return response.data.data;

  },  type: string;  smsNotifications: boolean;



  // Legacy compatibility methods  severity: string;  auditLogRetention: number; // days

  getThreats: async (filters?: SecurityFilters): Promise<{

    data: SecurityThreat[];  userId?: string;  encryptionLevel: 'standard' | 'enhanced';

    total: number;

    page: number;  userName?: string;  backupEncryption: boolean;

    limit: number;

  }> => {  ipAddress: string;}

    const response = await securityAPI.getSecurityThreats({

      severity: filters?.severity?.[0] as SecuritySeverity,  userAgent?: string;

      type: filters?.type?.[0] as ThreatType,

      dateFrom: filters?.startDate ? new Date(filters.startDate) : undefined,  timestamp: string;export interface SecurityFilters {

      dateTo: filters?.endDate ? new Date(filters.endDate) : undefined,

      page: filters?.page,  description: string;  startDate?: string;

      limit: filters?.limit,

    });  metadata: Record<string, any>;  endDate?: string;



    return {}  severity?: string[];

      data: response.threats.map(threat => ({

        id: threat.id,  type?: string[];

        type: threat.type as any,

        severity: threat.severity as any,interface ActivityLog {  status?: string[];

        source: threat.source.origin,

        target: threat.targets[0]?.name || '',  id: string;  ipAddress?: string;

        status: threat.status as any,

        description: threat.description,  userId: string;  userId?: string;

        detectedAt: threat.firstSeenAt.toISOString(),

        resolvedAt: threat.status === ThreatStatus.RESOLVED ? threat.lastSeenAt.toISOString() : undefined,  userName: string;  page?: number;

        actionTaken: threat.mitigation?.strategy,

        affectedUsers: threat.impact?.affectedUsers || 0,  userRole: string;  limit?: number;

        ipAddress: threat.indicators.find(i => i.type === 'ip')?.value || '',

        userAgent: '',  action: string;}

        metadata: {}

      })),  resource: string;

      total: response.total,

      page: response.page,  resourceId: string;// Security Management API with backend POJOs integration

      limit: 25

    };  ipAddress: string;export const securityAPI = {

  },

  timestamp: string;  // ========================================

  getThreatById: async (id: string): Promise<SecurityThreat> => {

    const threat = await securityAPI.getSecurityThreatById(id);  success: boolean;  // Security Events with typed POJOs

    return {

      id: threat.id,  details: Record<string, any>;  // ========================================

      type: threat.type as any,

      severity: threat.severity as any,  changes: Record<string, any>;  getSecurityEvents: async (filters?: {

      source: threat.source.origin,

      target: threat.targets[0]?.name || '',}    type?: SecurityEventType;

      status: threat.status as any,

      description: threat.description,    severity?: SecuritySeverity;

      detectedAt: threat.firstSeenAt.toISOString(),

      resolvedAt: threat.status === ThreatStatus.RESOLVED ? threat.lastSeenAt.toISOString() : undefined,interface SecurityConfiguration {    category?: SecurityCategory;

      actionTaken: threat.mitigation?.strategy,

      affectedUsers: threat.impact?.affectedUsers || 0,  id: string;    status?: SecurityEventStatus;

      ipAddress: threat.indicators.find(i => i.type === 'ip')?.value || '',

      userAgent: '',  name: string;    actorId?: string;

      metadata: {}

    };  type: string;    targetId?: string;

  },

  value: any;    dateFrom?: Date;

  resolveThreat: async (id: string, actionTaken: string): Promise<SecurityThreat> => {

    await securityAPI.updateThreatStatus(id, ThreatStatus.RESOLVED, actionTaken);  enabled: boolean;    dateTo?: Date;

    return await securityAPI.getThreatById(id);

  },  description?: string;    search?: string;



  blockThreat: async (id: string): Promise<SecurityThreat> => {  lastUpdatedBy?: string;    page?: number;

    await securityAPI.updateThreatStatus(id, ThreatStatus.CONTAINED);

    return await securityAPI.getThreatById(id);  lastUpdatedAt?: string;    limit?: number;

  },

}  }): Promise<GetSecurityEventsResponse> => {

  getSecurityEventsLegacy: async (filters?: SecurityFilters): Promise<{

    data: SecurityEvent[];    const response = await api.get<PaginatedSecurityResponse<SecurityEventEntity>>('/admin/security/events', {

    total: number;

    page: number;// Security Management API with backend POJOs integration      params: filters

    limit: number;

  }> => {export const securityAPI = {    });

    const response = await securityAPI.getSecurityEvents({

      severity: filters?.severity?.[0] as SecuritySeverity,  // ========================================    return {

      type: filters?.type?.[0] as SecurityEventType,

      dateFrom: filters?.startDate ? new Date(filters.startDate) : undefined,  // Security Events with typed POJOs      events: response.data.data.items,

      dateTo: filters?.endDate ? new Date(filters.endDate) : undefined,

      page: filters?.page,  // ========================================      total: response.data.data.total,

      limit: filters?.limit,

    });  getSecurityEvents: async (filters?: {      page: response.data.data.page,



    return {    type?: SecurityEventType;      totalPages: response.data.data.totalPages

      data: response.events.map(event => ({

        id: event.id,    severity?: SecuritySeverity;    };

        type: event.type as any,

        severity: event.severity as any,    category?: SecurityCategory;  },

        userId: event.actor?.id,

        userName: event.actor?.name,    status?: SecurityEventStatus;

        ipAddress: event.actor?.ipAddress || '',

        userAgent: event.actor?.userAgent,    actorId?: string;  getSecurityEventById: async (id: string): Promise<SecurityEventEntity> => {

        timestamp: event.occurredAt.toISOString(),

        description: event.description,    targetId?: string;    const response = await api.get<SecurityAPIResponse<SecurityEventEntity>>(`/admin/security/events/${id}`);

        metadata: event.metadata || {}

      })),    dateFrom?: Date;    return response.data.data;

      total: response.total,

      page: response.page,    dateTo?: Date;  },

      limit: 25

    };    search?: string;

  },

    page?: number;  createSecurityEvent: async (data: CreateSecurityEventRequest): Promise<SecurityEventEntity> => {

  getActivityLogs: async (filters?: SecurityFilters): Promise<{

    data: ActivityLog[];    limit?: number;    const response = await api.post<SecurityAPIResponse<SecurityEventEntity>>('/admin/security/events', data);

    total: number;

    page: number;  }): Promise<GetSecurityEventsResponse> => {    return response.data.data;

    limit: number;

  }> => {    const response = await api.get<APIResponse<PaginatedResponse<SecurityEventEntity>>>('/admin/security/events', {  },

    const response = await securityAPI.getAuditLogs({

      actorId: filters?.userId,      params: filters

      dateFrom: filters?.startDate ? new Date(filters.startDate) : undefined,

      dateTo: filters?.endDate ? new Date(filters.endDate) : undefined,    });  updateSecurityEvent: async (id: string, data: {

      page: filters?.page,

      limit: filters?.limit,    return {    status?: SecurityEventStatus;

    });

      events: response.data.data,    response?: {

    return {

      data: response.logs.map(log => ({      total: response.data.total,      action: string;

        id: log.id,

        userId: log.actor.id,      page: response.data.page,      description: string;

        userName: log.actor.name,

        userRole: log.actor.role || '',      totalPages: response.data.totalPages      automated: boolean;

        action: log.action,

        resource: log.resource.type,    };    };

        resourceId: log.resource.id,

        ipAddress: log.context.ipAddress,  },    notes?: string;

        timestamp: log.timestamp.toISOString(),

        success: log.result === 'success',  }): Promise<SecurityEventEntity> => {

        details: log.changes,

        changes: log.changes,  getSecurityEventById: async (id: string): Promise<SecurityEventEntity> => {    const response = await api.patch<SecurityAPIResponse<SecurityEventEntity>>(

      })),

      total: response.total,    const response = await api.get<APIResponse<SecurityEventEntity>>(`/admin/security/events/${id}`);      `/admin/security/events/${id}`,

      page: response.page,

      limit: 25    return response.data.data;      data

    };

  },  },    );



  getActivityLogById: async (id: string): Promise<ActivityLog> => {    return response.data.data;

    const log = await securityAPI.getAuditLogById(id);

    return {  createSecurityEvent: async (data: CreateSecurityEventRequest): Promise<SecurityEventEntity> => {  },

      id: log.id,

      userId: log.actor.id,    const response = await api.post<APIResponse<SecurityEventEntity>>('/admin/security/events', data);

      userName: log.actor.name,

      userRole: log.actor.role || '',    return response.data.data;  correlateEvents: async (eventIds: string[]): Promise<{

      action: log.action,

      resource: log.resource.type,  },    correlationId: string;

      resourceId: log.resource.id,

      ipAddress: log.context.ipAddress,    events: SecurityEventEntity[];

      timestamp: log.timestamp.toISOString(),

      success: log.result === 'success',  updateSecurityEvent: async (id: string, data: {    patterns: {

      details: log.changes,

      changes: log.changes,    status?: SecurityEventStatus;      type: string;

    };

  },    response?: {      confidence: number;



  runSecurityScan: async (): Promise<{ jobId: string; message: string }> => {      action: string;      description: string;

    const result = await securityAPI.startSecurityScan({

      type: 'full',      description: string;    }[];

      scope: {},

    });      automated: boolean;  }> => {

    return {

      jobId: result.scanId,    };    const response = await api.post<SecurityAPIResponse<any>>('/admin/security/events/correlate', {

      message: 'Security scan started successfully'

    };    metadata?: Record<string, any>;      eventIds

  },

  }): Promise<SecurityEventEntity> => {    });

  getScanStatus: async (jobId: string): Promise<{

    status: 'pending' | 'running' | 'completed' | 'failed';    const response = await api.put<APIResponse<SecurityEventEntity>>(`/admin/security/events/${id}`, data);    return response.data.data;

    progress: number;

    results?: any;    return response.data.data;  },

  }> => {

    const scan = await securityAPI.getSecurityScanStatus(jobId);  },

    return {

      status: scan.status === 'queued' ? 'pending' : scan.status,  // ========================================

      progress: scan.progress,

      results: scan.results  deleteSecurityEvent: async (id: string): Promise<void> => {  // Security Threats with typed POJOs

    };

  },    await api.delete(`/admin/security/events/${id}`);  // ========================================



  exportThreats: async (filters?: SecurityFilters): Promise<Blob> => {  },  getSecurityThreats: async (filters?: {

    return new Blob(['[]'], { type: 'application/json' });

  },    type?: ThreatType;



  exportEvents: async (filters?: SecurityFilters): Promise<Blob> => {  // ========================================    severity?: SecuritySeverity;

    return new Blob(['[]'], { type: 'application/json' });

  },  // Security Threats with typed POJOs    status?: ThreatStatus;



  exportActivityLogs: async (filters?: SecurityFilters): Promise<Blob> => {  // ========================================    confidence?: number;

    return await securityAPI.exportAuditLogs({

      dateFrom: filters?.startDate ? new Date(filters.startDate) : undefined,  getSecurityThreats: async (filters?: {    dateFrom?: Date;

      dateTo: filters?.endDate ? new Date(filters.endDate) : undefined,

      format: 'json'    type?: ThreatType;    dateTo?: Date;

    });

  }    severity?: SecuritySeverity;    search?: string;

};

    status?: ThreatStatus;    page?: number;

export default securityAPI;
    dateFrom?: Date;    limit?: number;

    dateTo?: Date;  }): Promise<GetSecurityThreatsResponse> => {

    search?: string;    const response = await api.get<PaginatedSecurityResponse<SecurityThreatEntity>>('/admin/security/threats', {

    page?: number;      params: filters

    limit?: number;    });

  }): Promise<GetSecurityThreatsResponse> => {    return {

    const response = await api.get<APIResponse<PaginatedResponse<SecurityThreatEntity>>>('/admin/security/threats', {      threats: response.data.data.items,

      params: filters      total: response.data.data.total,

    });      page: response.data.data.page,

    return {      totalPages: response.data.data.totalPages

      threats: response.data.data,    };

      total: response.data.total,  },

      page: response.data.page,

      totalPages: response.data.totalPages  getSecurityThreatById: async (id: string): Promise<SecurityThreatEntity> => {

    };    const response = await api.get<SecurityAPIResponse<SecurityThreatEntity>>(`/admin/security/threats/${id}`);

  },    return response.data.data;

  },

  getSecurityThreatById: async (id: string): Promise<SecurityThreatEntity> => {

    const response = await api.get<APIResponse<SecurityThreatEntity>>(`/admin/security/threats/${id}`);  createSecurityThreat: async (data: CreateSecurityThreatRequest): Promise<SecurityThreatEntity> => {

    return response.data.data;    const response = await api.post<SecurityAPIResponse<SecurityThreatEntity>>('/admin/security/threats', data);

  },    return response.data.data;

  },

  updateThreatStatus: async (id: string, status: ThreatStatus, notes?: string): Promise<SecurityThreatEntity> => {

    const response = await api.put<APIResponse<SecurityThreatEntity>>(`/admin/security/threats/${id}/status`, {  updateThreatStatus: async (id: string, status: ThreatStatus, notes?: string): Promise<SecurityThreatEntity> => {

      status,    const response = await api.patch<SecurityAPIResponse<SecurityThreatEntity>>(

      notes      `/admin/security/threats/${id}/status`,

    });      { status, notes }

    return response.data.data;    );

  },    return response.data.data;

  },

  // ========================================

  // Security Alerts with typed POJOs  mitigateThreat: async (id: string, mitigationData: {

  // ========================================    strategy: string;

  getSecurityAlerts: async (filters?: {    actions: {

    type?: SecurityAlertType;      type: string;

    severity?: SecuritySeverity;      description: string;

    resolved?: boolean;      priority: number;

    dateFrom?: Date;      assignedTo?: string;

    dateTo?: Date;      dueDate?: Date;

    page?: number;    }[];

    limit?: number;  }): Promise<SecurityThreatEntity> => {

  }): Promise<GetSecurityAlertsResponse> => {    const response = await api.post<SecurityAPIResponse<SecurityThreatEntity>>(

    const response = await api.get<APIResponse<PaginatedResponse<SecurityAlertEntity>>>('/admin/security/alerts', {      `/admin/security/threats/${id}/mitigate`,

      params: filters      mitigationData

    });    );

    return {    return response.data.data;

      alerts: response.data.data,  },

      total: response.data.total,

      page: response.data.page,  getThreatIntelligence: async (threatId?: string, indicators?: string[]): Promise<{

      totalPages: response.data.totalPages    threats: SecurityThreatEntity[];

    };    indicators: {

  },      type: string;

      value: string;

  getSecurityAlertById: async (id: string): Promise<SecurityAlertEntity> => {      confidence: number;

    const response = await api.get<APIResponse<SecurityAlertEntity>>(`/admin/security/alerts/${id}`);      sources: string[];

    return response.data.data;    }[];

  },    campaigns: {

      name: string;

  resolveSecurityAlert: async (id: string, resolution: string): Promise<SecurityAlertEntity> => {      threats: string[];

    const response = await api.put<APIResponse<SecurityAlertEntity>>(`/admin/security/alerts/${id}/resolve`, {      timeline: { start: Date; end?: Date };

      resolution    }[];

    });    actors: {

    return response.data.data;      name: string;

  },      type: string;

      motivation: string;

  // ========================================      capabilities: string[];

  // Audit Logs with typed POJOs    }[];

  // ========================================  }> => {

  getAuditLogs: async (filters?: {    const response = await api.get<SecurityAPIResponse<any>>('/admin/security/threat-intelligence', {

    actorId?: string;      params: { threatId, indicators }

    action?: string;    });

    resourceType?: string;    return response.data.data;

    resourceId?: string;  },

    result?: 'success' | 'failure';

    dateFrom?: Date;  // ========================================

    dateTo?: Date;  // Security Alerts with typed POJOs

    ipAddress?: string;  // ========================================

    page?: number;  getSecurityAlerts: async (filters?: {

    limit?: number;    type?: AlertType;

  }): Promise<GetAuditLogsResponse> => {    severity?: SecuritySeverity;

    const response = await api.get<APIResponse<PaginatedResponse<SecurityAuditLogEntity>>>('/admin/security/audit-logs', {    status?: AlertStatus;

      params: filters    assignedTo?: string;

    });    dateFrom?: Date;

    return {    dateTo?: Date;

      logs: response.data.data,    page?: number;

      total: response.data.total,    limit?: number;

      page: response.data.page,  }): Promise<GetSecurityAlertsResponse> => {

      totalPages: response.data.totalPages    const response = await api.get<PaginatedSecurityResponse<SecurityAlertEntity>>('/admin/security/alerts', {

    };      params: filters

  },    });

    return {

  getAuditLogById: async (id: string): Promise<SecurityAuditLogEntity> => {      alerts: response.data.data.items,

    const response = await api.get<APIResponse<SecurityAuditLogEntity>>(`/admin/security/audit-logs/${id}`);      total: response.data.data.total,

    return response.data.data;      page: response.data.data.page,

  },      totalPages: response.data.data.totalPages

    };

  exportAuditLogs: async (filters?: {  },

    dateFrom?: Date;

    dateTo?: Date;  getSecurityAlertById: async (id: string): Promise<SecurityAlertEntity> => {

    format?: 'json' | 'csv' | 'pdf';    const response = await api.get<SecurityAPIResponse<SecurityAlertEntity>>(`/admin/security/alerts/${id}`);

  }): Promise<Blob> => {    return response.data.data;

    const response = await api.get('/admin/security/audit-logs/export', {  },

      params: filters,

      responseType: 'blob'  acknowledgeAlert: async (id: string, notes?: string): Promise<SecurityAlertEntity> => {

    });    const response = await api.patch<SecurityAPIResponse<SecurityAlertEntity>>(

    return response.data;      `/admin/security/alerts/${id}/acknowledge`,

  },      { notes }

    );

  // ========================================    return response.data.data;

  // Access Controls with typed POJOs  },

  // ========================================

  getAccessControls: async (filters?: {  resolveAlert: async (id: string, resolution: {

    principalType?: string;    action: string;

    principalId?: string;    description: string;

    resourceType?: string;    preventive: boolean;

    resourceId?: string;  }): Promise<SecurityAlertEntity> => {

    permission?: string;    const response = await api.patch<SecurityAPIResponse<SecurityAlertEntity>>(

    enabled?: boolean;      `/admin/security/alerts/${id}/resolve`,

    page?: number;      { resolution }

    limit?: number;    );

  }): Promise<GetAccessControlsResponse> => {    return response.data.data;

    const response = await api.get<APIResponse<PaginatedResponse<SecurityAccessControlEntity>>>('/admin/security/access-controls', {  },

      params: filters

    });  escalateAlert: async (id: string, escalateTo: string, reason: string): Promise<SecurityAlertEntity> => {

    return {    const response = await api.post<SecurityAPIResponse<SecurityAlertEntity>>(

      controls: response.data.data,      `/admin/security/alerts/${id}/escalate`,

      total: response.data.total,      { escalateTo, reason }

      page: response.data.page,    );

      totalPages: response.data.totalPages    return response.data.data;

    };  },

  },

  // ========================================

  getAccessControlById: async (id: string): Promise<SecurityAccessControlEntity> => {  // Audit Logs with typed POJOs

    const response = await api.get<APIResponse<SecurityAccessControlEntity>>(`/admin/security/access-controls/${id}`);  // ========================================

    return response.data.data;  getAuditLogs: async (filters?: {

  },    eventType?: AuditEventType;

    actorId?: string;

  createAccessControl: async (data: {    resourceType?: string;

    principal: { type: string; id: string; };    resourceId?: string;

    resource: { type: string; id: string; };    result?: string;

    permissions: string[];    dateFrom?: Date;

    conditions?: Record<string, any>;    dateTo?: Date;

  }): Promise<SecurityAccessControlEntity> => {    search?: string;

    const response = await api.post<APIResponse<SecurityAccessControlEntity>>('/admin/security/access-controls', data);    page?: number;

    return response.data.data;    limit?: number;

  },  }): Promise<GetAuditLogsResponse> => {

    const response = await api.get<PaginatedSecurityResponse<SecurityAuditLogEntity>>('/admin/security/audit-logs', {

  updateAccessControl: async (id: string, data: {      params: filters

    permissions?: string[];    });

    enabled?: boolean;    return {

    conditions?: Record<string, any>;      logs: response.data.data.items,

  }): Promise<SecurityAccessControlEntity> => {      total: response.data.data.total,

    const response = await api.put<APIResponse<SecurityAccessControlEntity>>(`/admin/security/access-controls/${id}`, data);      page: response.data.data.page,

    return response.data.data;      totalPages: response.data.data.totalPages

  },    };

  },

  deleteAccessControl: async (id: string): Promise<void> => {

    await api.delete(`/admin/security/access-controls/${id}`);  getAuditLogById: async (id: string): Promise<SecurityAuditLogEntity> => {

  },    const response = await api.get<SecurityAPIResponse<SecurityAuditLogEntity>>(`/admin/security/audit-logs/${id}`);

    return response.data.data;

  // ========================================  },

  // Security Configuration with typed POJOs

  // ========================================  exportAuditLogs: async (filters?: {

  getSecurityConfiguration: async (): Promise<SecurityConfigurationEntity> => {    dateFrom?: Date;

    const response = await api.get<APIResponse<SecurityConfigurationEntity>>('/admin/security/configuration');    dateTo?: Date;

    return response.data.data;    format?: 'csv' | 'json' | 'xml';

  },    includeDetails?: boolean;

  }): Promise<Blob> => {

  updateSecurityConfiguration: async (data: Partial<SecurityConfigurationEntity>): Promise<SecurityConfigurationEntity> => {    const response = await api.post('/admin/security/audit-logs/export', filters, {

    const response = await api.put<APIResponse<SecurityConfigurationEntity>>('/admin/security/configuration', data);      responseType: 'blob'

    return response.data.data;    });

  },    return response.data;

  },

  // ========================================

  // Security Scanning with typed POJOs  // ========================================

  // ========================================  // Security Configuration with typed POJOs

  getSecurityScans: async (filters?: {  // ========================================

    type?: string;  getSecurityConfiguration: async (): Promise<SecurityConfigurationEntity> => {

    status?: string;    const response = await api.get<SecurityAPIResponse<SecurityConfigurationEntity>>('/admin/security/configuration');

    dateFrom?: Date;    return response.data.data;

    dateTo?: Date;  },

    page?: number;

    limit?: number;  updateSecurityConfiguration: async (data: UpdateSecurityConfigurationRequest): Promise<SecurityConfigurationEntity> => {

  }): Promise<GetSecurityScansResponse> => {    const response = await api.put<SecurityAPIResponse<SecurityConfigurationEntity>>(

    const response = await api.get<APIResponse<PaginatedResponse<SecurityScanResponse>>>('/admin/security/scans', {      '/admin/security/configuration',

      params: filters      data

    });    );

    return {    return response.data.data;

      scans: response.data.data,  },

      total: response.data.total,

      page: response.data.page,  validateConfiguration: async (config: Partial<SecurityConfigurationEntity>): Promise<{

      totalPages: response.data.totalPages    isValid: boolean;

    };    errors: string[];

  },    warnings: string[];

    recommendations: string[];

  getSecurityScanById: async (id: string): Promise<SecurityScanResponse> => {  }> => {

    const response = await api.get<APIResponse<SecurityScanResponse>>(`/admin/security/scans/${id}`);    const response = await api.post<SecurityAPIResponse<any>>('/admin/security/configuration/validate', config);

    return response.data.data;    return response.data.data;

  },  },



  startSecurityScan: async (data: {  // ========================================

    type: string;  // Access Control Management

    scope: Record<string, any>;  // ========================================

  }): Promise<SecurityScanResponse> => {  getAccessControls: async (filters?: {

    const response = await api.post<APIResponse<SecurityScanResponse>>('/admin/security/scans', data);    subjectId?: string;

    return response.data.data;    resourceType?: string;

  },    resourceId?: string;

    permission?: string;

  getSecurityScanStatus: async (scanId: string): Promise<SecurityScanResponse> => {    status?: string;

    const response = await api.get<APIResponse<SecurityScanResponse>>(`/admin/security/scans/${scanId}/status`);    page?: number;

    return response.data.data;    limit?: number;

  },  }): Promise<{

    controls: SecurityAccessControlEntity[];

  // ========================================    total: number;

  // Legacy compatibility methods    page: number;

  // ========================================    totalPages: number;

  getThreats: async (filters?: SecurityFilters): Promise<{  }> => {

    data: SecurityThreat[];    const response = await api.get<PaginatedSecurityResponse<SecurityAccessControlEntity>>(

    total: number;      '/admin/security/access-controls',

    page: number;      { params: filters }

    limit: number;    );

  }> => {    return {

    const response = await securityAPI.getSecurityThreats({      controls: response.data.data.items,

      severity: filters?.severity?.[0] as SecuritySeverity,      total: response.data.data.total,

      type: filters?.type?.[0] as ThreatType,      page: response.data.data.page,

      dateFrom: filters?.startDate ? new Date(filters.startDate) : undefined,      totalPages: response.data.data.totalPages

      dateTo: filters?.endDate ? new Date(filters.endDate) : undefined,    };

      page: filters?.page,  },

      limit: filters?.limit,

    });  validateAccess: async (request: {

    subjectId: string;

    return {    resourceType: string;

      data: response.threats.map(threat => ({    resourceId: string;

        id: threat.id,    action: string;

        type: threat.type as any,    context?: Record<string, any>;

        severity: threat.severity as any,  }): Promise<{

        source: threat.source.origin,    allowed: boolean;

        target: threat.targets[0]?.name || '',    reason: string;

        status: threat.status as any,    policies: string[];

        description: threat.description,    conditions: string[];

        detectedAt: threat.firstSeenAt.toISOString(),  }> => {

        resolvedAt: threat.status === ThreatStatus.RESOLVED ? threat.lastSeenAt.toISOString() : undefined,    const response = await api.post<SecurityAPIResponse<any>>('/admin/security/access-controls/validate', request);

        actionTaken: threat.mitigation?.strategy,    return response.data.data;

        affectedUsers: threat.impact?.affectedUsers || 0,  },

        ipAddress: threat.indicators.find(i => i.type === 'ip')?.value || '',

        userAgent: '',  // ========================================

        metadata: {}  // Security Metrics & Analytics

      })),  // ========================================

      total: response.total,  getSecurityMetrics: async (filters?: {

      page: response.page,    dateRange?: { start: Date; end: Date };

      limit: 25    includeForecasting?: boolean;

    };    granularity?: 'hour' | 'day' | 'week' | 'month';

  },  }): Promise<SecurityMetricsResponse> => {

    const response = await api.get<SecurityAPIResponse<SecurityMetricsResponse>>('/admin/security/metrics', {

  getThreatById: async (id: string): Promise<SecurityThreat> => {      params: filters

    const threat = await securityAPI.getSecurityThreatById(id);    });

    return {    return response.data.data;

      id: threat.id,  },

      type: threat.type as any,

      severity: threat.severity as any,  getSecurityPosture: async (): Promise<{

      source: threat.source.origin,    score: number;

      target: threat.targets[0]?.name || '',    level: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

      status: threat.status as any,    factors: {

      description: threat.description,      category: string;

      detectedAt: threat.firstSeenAt.toISOString(),      score: number;

      resolvedAt: threat.status === ThreatStatus.RESOLVED ? threat.lastSeenAt.toISOString() : undefined,      weight: number;

      actionTaken: threat.mitigation?.strategy,      issues: string[];

      affectedUsers: threat.impact?.affectedUsers || 0,      recommendations: string[];

      ipAddress: threat.indicators.find(i => i.type === 'ip')?.value || '',    }[];

      userAgent: '',    trends: {

      metadata: {}      date: string;

    };      score: number;

  },      events: number;

    }[];

  resolveThreat: async (id: string, actionTaken: string): Promise<SecurityThreat> => {    benchmarks: {

    await securityAPI.updateThreatStatus(id, ThreatStatus.RESOLVED, actionTaken);      industry: number;

    return await securityAPI.getThreatById(id);      similar: number;

  },      target: number;

    };

  blockThreat: async (id: string): Promise<SecurityThreat> => {  }> => {

    await securityAPI.updateThreatStatus(id, ThreatStatus.CONTAINED);    const response = await api.get<SecurityAPIResponse<any>>('/admin/security/posture');

    return await securityAPI.getThreatById(id);    return response.data.data;

  },  },



  getSecurityEventsLegacy: async (filters?: SecurityFilters): Promise<{  getRiskAssessment: async (scope?: {

    data: SecurityEvent[];    systems?: string[];

    total: number;    applications?: string[];

    page: number;    departments?: string[];

    limit: number;  }): Promise<{

  }> => {    overallRisk: number;

    const response = await securityAPI.getSecurityEvents({    riskLevel: 'low' | 'medium' | 'high' | 'critical';

      severity: filters?.severity?.[0] as SecuritySeverity,    risks: {

      type: filters?.type?.[0] as SecurityEventType,      id: string;

      dateFrom: filters?.startDate ? new Date(filters.startDate) : undefined,      category: string;

      dateTo: filters?.endDate ? new Date(filters.endDate) : undefined,      description: string;

      page: filters?.page,      likelihood: number;

      limit: filters?.limit,      impact: number;

    });      riskScore: number;

      mitigation: string[];

    return {    }[];

      data: response.events.map(event => ({    recommendations: {

        id: event.id,      priority: 'high' | 'medium' | 'low';

        type: event.type as any,      category: string;

        severity: event.severity as any,      action: string;

        userId: event.actor?.id,      impact: string;

        userName: event.actor?.name,      effort: 'low' | 'medium' | 'high';

        ipAddress: event.actor?.ipAddress || '',    }[];

        userAgent: event.actor?.userAgent,  }> => {

        timestamp: event.occurredAt.toISOString(),    const response = await api.post<SecurityAPIResponse<any>>('/admin/security/risk-assessment', { scope });

        description: event.description,    return response.data.data;

        metadata: event.metadata || {}  },

      })),

      total: response.total,  // ========================================

      page: response.page,  // Security Scanning

      limit: 25  // ========================================

    };  startSecurityScan: async (request: SecurityScanRequest): Promise<{

  },    scanId: string;

    status: 'queued' | 'running';

  getActivityLogs: async (filters?: SecurityFilters): Promise<{    estimatedDuration: number;

    data: ActivityLog[];  }> => {

    total: number;    const response = await api.post<SecurityAPIResponse<any>>('/admin/security/scans', request);

    page: number;    return response.data.data;

    limit: number;  },

  }> => {

    const response = await securityAPI.getAuditLogs({  getSecurityScanStatus: async (scanId: string): Promise<SecurityScanResponse> => {

      actorId: filters?.userId,    const response = await api.get<SecurityAPIResponse<SecurityScanResponse>>(`/admin/security/scans/${scanId}`);

      dateFrom: filters?.startDate ? new Date(filters.startDate) : undefined,    return response.data.data;

      dateTo: filters?.endDate ? new Date(filters.endDate) : undefined,  },

      page: filters?.page,

      limit: filters?.limit,  getSecurityScans: async (filters?: {

    });    type?: string;

    status?: string;

    return {    dateFrom?: Date;

      data: response.logs.map(log => ({    dateTo?: Date;

        id: log.id,    page?: number;

        userId: log.actor.id,    limit?: number;

        userName: log.actor.name,  }): Promise<{

        userRole: log.actor.role || '',    scans: SecurityScanResponse[];

        action: log.action,    total: number;

        resource: log.resource.type,    page: number;

        resourceId: log.resource.id,    totalPages: number;

        ipAddress: log.context.ipAddress,  }> => {

        timestamp: log.timestamp.toISOString(),    const response = await api.get<PaginatedSecurityResponse<SecurityScanResponse>>('/admin/security/scans', {

        success: log.result === 'success',      params: filters

        details: log.changes,    });

        changes: log.changes,    return {

      })),      scans: response.data.data.items,

      total: response.total,      total: response.data.data.total,

      page: response.page,      page: response.data.data.page,

      limit: 25      totalPages: response.data.data.totalPages

    };    };

  },  },



  getActivityLogById: async (id: string): Promise<ActivityLog> => {  downloadScanReport: async (scanId: string, format: 'pdf' | 'json' | 'xml' = 'pdf'): Promise<Blob> => {

    const log = await securityAPI.getAuditLogById(id);    const response = await api.get(`/admin/security/scans/${scanId}/report`, {

    return {      params: { format },

      id: log.id,      responseType: 'blob'

      userId: log.actor.id,    });

      userName: log.actor.name,    return response.data;

      userRole: log.actor.role || '',  },

      action: log.action,

      resource: log.resource.type,  // ========================================

      resourceId: log.resource.id,  // Incident Response

      ipAddress: log.context.ipAddress,  // ========================================

      timestamp: log.timestamp.toISOString(),  createIncident: async (data: {

      success: log.result === 'success',    title: string;

      details: log.changes,    description: string;

      changes: log.changes,    severity: SecuritySeverity;

    };    type: string;

  },    affectedSystems: string[];

    relatedEvents?: string[];

  getSecurityConfigurationLegacy: async (): Promise<SecurityConfiguration[]> => {    assignedTo?: string;

    const config = await securityAPI.getSecurityConfiguration();  }): Promise<{

    return [    id: string;

      {    status: 'new' | 'investigating' | 'contained' | 'resolved';

        id: config.id,    playbook?: string;

        name: 'Authentication',    timeline: { event: string; timestamp: Date }[];

        type: 'auth',  }> => {

        value: config.authentication,    const response = await api.post<SecurityAPIResponse<any>>('/admin/security/incidents', data);

        enabled: config.authentication.enabled,    return response.data.data;

        description: 'Authentication security settings'  },

      },

      {  updateIncidentStatus: async (incidentId: string, status: string, notes?: string): Promise<any> => {

        id: config.id + '_encryption',    const response = await api.patch<SecurityAPIResponse<any>>(`/admin/security/incidents/${incidentId}/status`, {

        name: 'Encryption',      status,

        type: 'encryption',      notes

        value: config.encryption,    });

        enabled: config.encryption.enabled,    return response.data.data;

        description: 'Data encryption settings'  },

      },

      {  // ========================================

        id: config.id + '_monitoring',  // Compliance Monitoring

        name: 'Monitoring',  // ========================================

        type: 'monitoring',  getComplianceStatus: async (frameworks?: string[]): Promise<{

        value: config.monitoring,    overall: number;

        enabled: config.monitoring.enabled,    frameworks: {

        description: 'Security monitoring settings'      name: string;

      }      score: number;

    ];      requirements: number;

  },      compliant: number;

      gaps: {

  updateSecurityConfigurationLegacy: async (configurations: SecurityConfiguration[]): Promise<SecurityConfiguration[]> => {        requirement: string;

    const updateData = configurations.reduce((acc, config) => {        status: 'compliant' | 'partial' | 'non_compliant';

      switch (config.type) {        evidence?: string[];

        case 'auth':        remediation: string[];

          acc.authentication = config.value;      }[];

          break;    }[];

        case 'encryption':    trends: {

          acc.encryption = config.value;      date: string;

          break;      score: number;

        case 'monitoring':    }[];

          acc.monitoring = config.value;  }> => {

          break;    const response = await api.get<SecurityAPIResponse<any>>('/admin/security/compliance', {

      }      params: { frameworks }

      return acc;    });

    }, {} as any);    return response.data.data;

  },

    await securityAPI.updateSecurityConfiguration(updateData);

    return await securityAPI.getSecurityConfigurationLegacy();  generateComplianceReport: async (framework: string, period: {

  },    start: Date;

    end: Date;

  runSecurityScan: async (): Promise<{ jobId: string; message: string }> => {  }): Promise<{

    const result = await securityAPI.startSecurityScan({    reportId: string;

      type: 'full',    url?: string;

      scope: {},    status: 'generating' | 'ready';

    });  }> => {

    return {    const response = await api.post<SecurityAPIResponse<any>>('/admin/security/compliance/reports', {

      jobId: result.scanId,      framework,

      message: 'Security scan started successfully'      period

    };    });

  },    return response.data.data;

  },

  getScanStatus: async (jobId: string): Promise<{

    status: 'pending' | 'running' | 'completed' | 'failed';  // ========================================

    progress: number;  // Real-time Monitoring

    results?: any;  // ========================================

  }> => {  getRealtimeMetrics: async (): Promise<{

    const scan = await securityAPI.getSecurityScanStatus(jobId);    activeConnections: number;

    return {    requestsPerMinute: number;

      status: scan.status === 'queued' ? 'pending' : scan.status,    failedLoginAttempts: number;

      progress: scan.progress,    blockedRequests: number;

      results: scan.results    systemLoad: number;

    };    memoryUsage: number;

  },    diskUsage: number;

    threatLevel: SecuritySeverity;

  exportThreats: async (filters?: SecurityFilters): Promise<Blob> => {    alerts: {

    // Placeholder implementation - would integrate with actual export endpoint      critical: number;

    return new Blob(['[]'], { type: 'application/json' });      high: number;

  },      medium: number;

      low: number;

  exportEvents: async (filters?: SecurityFilters): Promise<Blob> => {    };

    // Placeholder implementation - would integrate with actual export endpoint  }> => {

    return new Blob(['[]'], { type: 'application/json' });    const response = await api.get<SecurityAPIResponse<any>>('/admin/security/realtime-metrics');

  },    return response.data.data;

  },

  exportActivityLogs: async (filters?: SecurityFilters): Promise<Blob> => {

    return await securityAPI.exportAuditLogs({  getSystemHealth: async (): Promise<{

      dateFrom: filters?.startDate ? new Date(filters.startDate) : undefined,    overall: 'healthy' | 'warning' | 'critical';

      dateTo: filters?.endDate ? new Date(filters.endDate) : undefined,    services: Array<{

      format: 'json'      name: string;

    });      status: 'up' | 'down' | 'degraded';

  }      responseTime: number;

};      lastCheck: string;

      dependencies?: string[];

export default securityAPI;    }>;
    uptime: number;
    version: string;
    environment: string;
    security: {
      firewallStatus: 'active' | 'inactive';
      antivirusStatus: 'active' | 'inactive';
      encryptionStatus: 'active' | 'inactive';
      backupStatus: 'active' | 'inactive';
      lastSecurityScan: Date;
    };
  }> => {
    const response = await api.get<SecurityAPIResponse<any>>('/admin/security/system-health');
    return response.data.data;
  },

  // ========================================
  // IP Management
  // ========================================
  getBlockedIPs: async (filters?: {
    status?: 'active' | 'expired' | 'removed';
    reason?: string;
    permanent?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{
    blockedIPs: BlockedIP[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await api.get<SecurityAPIResponse<any>>('/admin/security/blocked-ips', {
      params: filters
    });
    return {
      blockedIPs: response.data.data.items,
      total: response.data.data.total,
      page: response.data.data.page,
      totalPages: response.data.data.totalPages
    };
  },

  blockIP: async (data: {
    ipAddress: string;
    reason: string;
    permanent?: boolean;
    expiresAt?: Date;
    notes?: string;
  }): Promise<BlockedIP> => {
    const response = await api.post<SecurityAPIResponse<BlockedIP>>('/admin/security/blocked-ips', data);
    return response.data.data;
  },

  unblockIP: async (id: string, reason?: string): Promise<void> => {
    await api.delete(`/admin/security/blocked-ips/${id}`, {
      data: { reason }
    });
  },

  // ========================================
  // Legacy Compatibility Methods
  // ========================================
  async getSecurityMetricsLegacy(): Promise<SecurityMetrics> {
    const metrics = await securityAPI.getSecurityMetrics();
    return {
      totalThreats: metrics.overview.totalThreats,
      activeThreatsByType: metrics.threatsByType.reduce((acc, t) => {
        acc[t.type] = t.count;
        return acc;
      }, {} as Record<string, number>),
      threatsTrend: metrics.trends.map(t => ({
        date: t.date,
        count: t.threats
      })),
      blockedIPs: 0, // Would need separate API call
      suspiciousActivities: metrics.overview.totalEvents,
      securityScore: metrics.overview.riskScore,
      vulnerabilities: {
        critical: metrics.topRisks.filter(r => r.impact === SecuritySeverity.CRITICAL).length,
        high: metrics.topRisks.filter(r => r.impact === SecuritySeverity.HIGH).length,
        medium: metrics.topRisks.filter(r => r.impact === SecuritySeverity.MEDIUM).length,
        low: metrics.topRisks.filter(r => r.impact === SecuritySeverity.LOW).length,
      },
      lastScan: new Date().toISOString(),
      systemStatus: metrics.overview.riskScore < 30 ? 'secure' : metrics.overview.riskScore < 70 ? 'warning' : 'critical'
    };
  },

  async getSecurityConfigurationLegacy(): Promise<SecurityConfiguration> {
    const config = await securityAPI.getSecurityConfiguration();
    return {
      twoFactorRequired: config.authentication.mfaRequired,
      passwordPolicy: {
        minLength: config.password.minLength,
        requireUppercase: config.password.requireUppercase,
        requireLowercase: config.password.requireLowercase,
        requireNumbers: config.password.requireNumbers,
        requireSpecialChars: config.password.requireSpecialChars,
        maxAge: config.password.maxAge,
      },
      sessionTimeout: config.session.timeout,
      maxFailedLogins: config.account.privilegedAccounts ? 3 : 5, // Default fallback
      ipWhitelist: config.network.ipWhitelist,
      emailNotifications: config.monitoring.alerting.enabled,
      smsNotifications: config.monitoring.alerting.enabled,
      auditLogRetention: config.monitoring.logging.retention,
      encryptionLevel: 'enhanced',
      backupEncryption: config.dataProtection.encryption.atRest,
    };
  },

  async updateSecurityConfigurationLegacy(config: Partial<SecurityConfiguration>): Promise<SecurityConfiguration> {
    const updateData: UpdateSecurityConfigurationRequest = {
      authentication: config.twoFactorRequired !== undefined ? {
        mfaRequired: config.twoFactorRequired
      } : undefined,
      password: config.passwordPolicy ? {
        minLength: config.passwordPolicy.minLength,
        requireUppercase: config.passwordPolicy.requireUppercase,
        requireLowercase: config.passwordPolicy.requireLowercase,
        requireNumbers: config.passwordPolicy.requireNumbers,
        requireSpecialChars: config.passwordPolicy.requireSpecialChars,
        maxAge: config.passwordPolicy.maxAge,
      } : undefined,
      network: {
        ipWhitelist: config.ipWhitelist,
      },
    };

    const updated = await securityAPI.updateSecurityConfiguration(updateData);
    return await securityAPI.getSecurityConfigurationLegacy();
  },

  // Legacy method mappings
  getThreats: async (filters?: SecurityFilters): Promise<{
    data: SecurityThreat[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await securityAPI.getSecurityThreats({
      severity: filters?.severity?.[0] as SecuritySeverity,
      type: filters?.type?.[0] as ThreatType,
      dateFrom: filters?.startDate ? new Date(filters.startDate) : undefined,
      dateTo: filters?.endDate ? new Date(filters.endDate) : undefined,
      page: filters?.page,
      limit: filters?.limit,
    });

    return {
      data: response.threats.map(threat => ({
        id: threat.id,
        type: threat.type as any,
        severity: threat.severity as any,
        source: threat.source.origin,
        target: threat.targets[0]?.name || '',
        status: threat.status as any,
        description: threat.description,
        detectedAt: threat.firstSeenAt.toISOString(),
        resolvedAt: threat.status === ThreatStatus.RESOLVED ? threat.lastSeenAt.toISOString() : undefined,
        actionTaken: threat.mitigation?.strategy,
        affectedUsers: threat.impact?.affectedUsers || 0,
        ipAddress: threat.indicators.find(i => i.type === 'ip')?.value || '',
        userAgent: '',
        metadata: {}
      })),
      total: response.total,
      page: response.page,
      limit: 25
    };
  },

  getThreatById: async (id: string): Promise<SecurityThreat> => {
    const threat = await securityAPI.getSecurityThreatById(id);
    return {
      id: threat.id,
      type: threat.type as any,
      severity: threat.severity as any,
      source: threat.source.origin,
      target: threat.targets[0]?.name || '',
      status: threat.status as any,
      description: threat.description,
      detectedAt: threat.firstSeenAt.toISOString(),
      resolvedAt: threat.status === ThreatStatus.RESOLVED ? threat.lastSeenAt.toISOString() : undefined,
      actionTaken: threat.mitigation?.strategy,
      affectedUsers: threat.impact?.affectedUsers || 0,
      ipAddress: threat.indicators.find(i => i.type === 'ip')?.value || '',
      userAgent: '',
      metadata: {}
    };
  },

  resolveThreat: async (id: string, actionTaken: string): Promise<SecurityThreat> => {
    const threat = await securityAPI.updateThreatStatus(id, ThreatStatus.RESOLVED, actionTaken);
    return await securityAPI.getThreatById(id);
  },

  blockThreat: async (id: string): Promise<SecurityThreat> => {
    const threat = await securityAPI.updateThreatStatus(id, ThreatStatus.CONTAINED);
    return await securityAPI.getThreatById(id);
  },

  getSecurityEvents: async (filters?: SecurityFilters): Promise<{
    data: SecurityEvent[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await securityAPI.getSecurityEvents({
      severity: filters?.severity?.[0] as SecuritySeverity,
      type: filters?.type?.[0] as SecurityEventType,
      dateFrom: filters?.startDate ? new Date(filters.startDate) : undefined,
      dateTo: filters?.endDate ? new Date(filters.endDate) : undefined,
      page: filters?.page,
      limit: filters?.limit,
    });

    return {
      data: response.events.map(event => ({
        id: event.id,
        type: event.type as any,
        severity: event.severity as any,
        userId: event.actor?.id,
        userName: event.actor?.name,
        ipAddress: event.actor?.ipAddress || '',
        userAgent: event.actor?.userAgent,
        timestamp: event.occurredAt.toISOString(),
        description: event.description,
        details: event.metadata.custom,
        location: event.context.geolocation ? {
          country: event.context.geolocation.country,
          city: event.context.geolocation.city || '',
        } : undefined,
      })),
      total: response.total,
      page: response.page,
      limit: 25
    };
  },

  async getEventById(id: string): Promise<SecurityEvent> {
    const event = await securityAPI.getSecurityEventById(id);
    return {
      id: event.id,
      type: event.type as any,
      severity: event.severity as any,
      userId: event.actor?.id,
      userName: event.actor?.name,
      ipAddress: event.actor?.ipAddress || '',
      userAgent: event.actor?.userAgent,
      timestamp: event.occurredAt.toISOString(),
      description: event.description,
      details: event.metadata.custom,
      location: event.context.geolocation ? {
        country: event.context.geolocation.country,
        city: event.context.geolocation.city || '',
      } : undefined,
    };
  },

  async getActivityLogs(filters?: SecurityFilters): Promise<{
    data: ActivityLog[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await securityAPI.getAuditLogs({
      actorId: filters?.userId,
      dateFrom: filters?.startDate ? new Date(filters.startDate) : undefined,
      dateTo: filters?.endDate ? new Date(filters.endDate) : undefined,
      page: filters?.page,
      limit: filters?.limit,
    });

    return {
      data: response.logs.map(log => ({
        id: log.id,
        userId: log.actor.id,
        userName: log.actor.name,
        userRole: log.actor.role || '',
        action: log.action,
        resource: log.resource.type,
        resourceId: log.resource.id,
        ipAddress: log.context.ipAddress,
        timestamp: log.timestamp.toISOString(),
        success: log.result === 'success',
        details: log.changes,
        changes: log.changes,
      })),
      total: response.total,
      page: response.page,
      limit: 25
    };
  },

  getActivityLogById: async (id: string): Promise<ActivityLog> => {
    const log = await securityAPI.getAuditLogById(id);
    return {
      id: log.id,
      userId: log.actor.id,
      userName: log.actor.name,
      userRole: log.actor.role || '',
      action: log.action,
      resource: log.resource.type,
      resourceId: log.resource.id,
      ipAddress: log.context.ipAddress,
      timestamp: log.timestamp.toISOString(),
      success: log.result === 'success',
      details: log.changes,
      changes: log.changes,
    };
  },

  runSecurityScan: async (): Promise<{ jobId: string; message: string }> => {
    const result = await securityAPI.startSecurityScan({
      type: 'full',
      scope: {},
    });
    return {
      jobId: result.scanId,
      message: 'Security scan started successfully'
    };
  },

  getScanStatus: async (jobId: string): Promise<{
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    results?: any;
  }> => {
    const scan = await securityAPI.getSecurityScanStatus(jobId);
    return {
      status: scan.status === 'queued' ? 'pending' : scan.status,
      progress: scan.progress,
      results: scan.results
    };
  },

  exportThreats: async (filters?: SecurityFilters): Promise<Blob> => {
    return new Blob(['[]'], { type: 'application/json' }); // Placeholder implementation
  },

  exportEvents: async (filters?: SecurityFilters): Promise<Blob> => {
    return new Blob(['[]'], { type: 'application/json' }); // Placeholder implementation
  },

  exportActivityLogs: async (filters?: SecurityFilters): Promise<Blob> => {
    return await securityAPI.exportAuditLogs({
      dateFrom: filters?.startDate ? new Date(filters.startDate) : undefined,
      dateTo: filters?.endDate ? new Date(filters.endDate) : undefined,
      format: 'json'
    });
};

export default securityAPI;