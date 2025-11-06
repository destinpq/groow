import client from './client';

export interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  module: string;
  userId?: string;
  userEmail?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  endpoint?: string;
  statusCode?: number;
  responseTime?: number;
  stackTrace?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  createdAt: string;
}

export interface LogStats {
  total: number;
  errors: number;
  warnings: number;
  info: number;
  debug: number;
  last24Hours: number;
}

export interface LogFilters {
  page?: number;
  limit?: number;
  level?: string;
  source?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface ExportParams extends LogFilters {
  format: 'csv' | 'json' | 'xlsx';
}

export const systemLogsAPI = {
  // Get all system logs with filters
  async getAll(filters: LogFilters = {}): Promise<{ data: SystemLog[]; total: number; page: number; limit: number }> {
    const response = await client.get('/system-logs', { params: filters });
    return response.data;
  },

  // Get log statistics
  async getStats(): Promise<{ data: LogStats }> {
    const response = await client.get('/system-logs/stats');
    return response.data;
  },

  // Get log by ID
  async getById(id: string): Promise<{ data: SystemLog }> {
    const response = await client.get(`/system-logs/${id}`);
    return response.data;
  },

  // Export logs
  async export(params: ExportParams): Promise<{ data: Blob }> {
    const response = await client.get('/system-logs/export', {
      params,
      responseType: 'blob',
    });
    return response;
  },

  // Clear all logs
  async clear(): Promise<void> {
    await client.delete('/system-logs');
  },

  // Clear logs by level
  async clearByLevel(level: string): Promise<void> {
    await client.delete(`/system-logs/level/${level}`);
  },

  // Clear logs older than specified days
  async clearOld(days: number): Promise<void> {
    await client.delete(`/system-logs/older-than/${days}`);
  },

  // Get logs by level
  async getByLevel(level: string, filters: LogFilters = {}): Promise<{ data: SystemLog[]; total: number }> {
    const response = await client.get(`/system-logs/level/${level}`, { params: filters });
    return response.data;
  },

  // Get logs by source
  async getBySource(source: string, filters: LogFilters = {}): Promise<{ data: SystemLog[]; total: number }> {
    const response = await client.get(`/system-logs/source/${source}`, { params: filters });
    return response.data;
  },

  // Get recent logs (last N entries)
  async getRecent(limit: number = 100): Promise<{ data: SystemLog[] }> {
    const response = await client.get(`/system-logs/recent/${limit}`);
    return response.data;
  },

  // Search logs
  async search(query: string, filters: LogFilters = {}): Promise<{ data: SystemLog[]; total: number }> {
    const response = await client.get('/system-logs/search', {
      params: { q: query, ...filters }
    });
    return response.data;
  },

  // Get log sources (unique sources)
  async getSources(): Promise<{ data: string[] }> {
    const response = await client.get('/system-logs/sources');
    return response.data;
  },

  // Get log modules (unique modules)
  async getModules(): Promise<{ data: string[] }> {
    const response = await client.get('/system-logs/modules');
    return response.data;
  },
};