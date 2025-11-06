/**
 * Security API Service
 * 
 * Handles security monitoring, threat detection, and audit logging
 */

import api from './client';

// Security Types
export interface SecurityThreat {
  id: string;
  type: 'malware' | 'phishing' | 'ddos' | 'brute_force' | 'sql_injection' | 'xss' | 'unauthorized_access';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  target: string;
  status: 'active' | 'blocked' | 'resolved';
  description: string;
  detectedAt: string;
  resolvedAt?: string;
  actionTaken?: string;
  affectedUsers?: number;
  ipAddress: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'password_change' | 'failed_login' | 'suspicious_activity' | 'data_access' | 'permission_change';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  userId?: string;
  userName?: string;
  ipAddress: string;
  userAgent?: string;
  timestamp: string;
  description: string;
  details?: Record<string, any>;
  location?: {
    country: string;
    city: string;
    coordinates?: [number, number];
  };
}

export interface BlockedIP {
  id: string;
  ipAddress: string;
  reason: string;
  blockedBy: string;
  blockedAt: string;
  expiresAt?: string;
  permanent: boolean;
  status: 'active' | 'expired' | 'removed';
  attempts: number;
  lastAttempt?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  timestamp: string;
  success: boolean;
  details?: Record<string, any>;
  changes?: {
    before: Record<string, any>;
    after: Record<string, any>;
  };
}

export interface SecurityMetrics {
  totalThreats: number;
  activeThreatsByType: Record<string, number>;
  threatsTrend: Array<{ date: string; count: number; }>;
  blockedIPs: number;
  suspiciousActivities: number;
  securityScore: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  lastScan: string;
  systemStatus: 'secure' | 'warning' | 'critical';
}

export interface SecurityConfiguration {
  twoFactorRequired: boolean;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAge: number; // days
  };
  sessionTimeout: number; // minutes
  maxFailedLogins: number;
  ipWhitelist: string[];
  emailNotifications: boolean;
  smsNotifications: boolean;
  auditLogRetention: number; // days
  encryptionLevel: 'standard' | 'enhanced';
  backupEncryption: boolean;
}

export interface SecurityFilters {
  startDate?: string;
  endDate?: string;
  severity?: string[];
  type?: string[];
  status?: string[];
  ipAddress?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

// Security API Service
export const securityAPI = {
  // Security Overview
  async getSecurityMetrics(): Promise<SecurityMetrics> {
    const response = await api.get('/admin/security/metrics');
    return response.data;
  },

  async getSecurityConfiguration(): Promise<SecurityConfiguration> {
    const response = await api.get('/admin/security/configuration');
    return response.data;
  },

  async updateSecurityConfiguration(config: Partial<SecurityConfiguration>): Promise<SecurityConfiguration> {
    const response = await api.put('/admin/security/configuration', config);
    return response.data;
  },

  // Threat Management
  async getThreats(filters?: SecurityFilters): Promise<{
    data: SecurityThreat[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get('/admin/security/threats', { params: filters });
    return response.data;
  },

  async getThreatById(id: string): Promise<SecurityThreat> {
    const response = await api.get(`/admin/security/threats/${id}`);
    return response.data;
  },

  async resolveThreat(id: string, actionTaken: string): Promise<SecurityThreat> {
    const response = await api.patch(`/admin/security/threats/${id}/resolve`, { actionTaken });
    return response.data;
  },

  async blockThreat(id: string): Promise<SecurityThreat> {
    const response = await api.patch(`/admin/security/threats/${id}/block`);
    return response.data;
  },

  // Security Events
  async getSecurityEvents(filters?: SecurityFilters): Promise<{
    data: SecurityEvent[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get('/admin/security/events', { params: filters });
    return response.data;
  },

  async getEventById(id: string): Promise<SecurityEvent> {
    const response = await api.get(`/admin/security/events/${id}`);
    return response.data;
  },

  // IP Blocklist Management
  async getBlockedIPs(filters?: SecurityFilters): Promise<{
    data: BlockedIP[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get('/admin/security/blocked-ips', { params: filters });
    return response.data;
  },

  async blockIP(data: {
    ipAddress: string;
    reason: string;
    permanent?: boolean;
    expiresAt?: string;
  }): Promise<BlockedIP> {
    const response = await api.post('/admin/security/blocked-ips', data);
    return response.data;
  },

  async unblockIP(id: string): Promise<void> {
    await api.delete(`/admin/security/blocked-ips/${id}`);
  },

  async updateBlockedIP(id: string, data: Partial<BlockedIP>): Promise<BlockedIP> {
    const response = await api.patch(`/admin/security/blocked-ips/${id}`, data);
    return response.data;
  },

  // Activity Logs
  async getActivityLogs(filters?: SecurityFilters): Promise<{
    data: ActivityLog[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get('/admin/security/activity-logs', { params: filters });
    return response.data;
  },

  async getActivityLogById(id: string): Promise<ActivityLog> {
    const response = await api.get(`/admin/security/activity-logs/${id}`);
    return response.data;
  },

  // Security Scans
  async runSecurityScan(): Promise<{ jobId: string; message: string }> {
    const response = await api.post('/admin/security/scan');
    return response.data;
  },

  async getScanStatus(jobId: string): Promise<{
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    results?: any;
  }> {
    const response = await api.get(`/admin/security/scan/${jobId}`);
    return response.data;
  },

  // Exports
  async exportThreats(filters?: SecurityFilters): Promise<Blob> {
    const response = await api.get('/admin/security/threats/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  async exportEvents(filters?: SecurityFilters): Promise<Blob> {
    const response = await api.get('/admin/security/events/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  async exportActivityLogs(filters?: SecurityFilters): Promise<Blob> {
    const response = await api.get('/admin/security/activity-logs/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  // Real-time monitoring
  async getRealtimeMetrics(): Promise<{
    activeConnections: number;
    requestsPerMinute: number;
    failedLoginAttempts: number;
    blockedRequests: number;
    systemLoad: number;
    memoryUsage: number;
    diskUsage: number;
  }> {
    const response = await api.get('/admin/security/realtime-metrics');
    return response.data;
  },

  // System status
  async getSystemHealth(): Promise<{
    overall: 'healthy' | 'warning' | 'critical';
    services: Array<{
      name: string;
      status: 'up' | 'down' | 'degraded';
      responseTime: number;
      lastCheck: string;
    }>;
    uptime: number;
    version: string;
    environment: string;
  }> {
    const response = await api.get('/admin/security/system-health');
    return response.data;
  },
};

export default securityAPI;