/**
 * API Metrics and Performance Monitoring
 * Real-time API performance tracking, rate limiting, and analytics
 */
import { api } from './client';

export interface APIMetrics {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  responseTime: number;
  statusCode: number;
  requestSize: number;
  responseSize: number;
  timestamp: string;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  success: boolean;
  error?: string;
  cacheHit: boolean;
  region: string;
}

export interface APIPerformance {
  endpoint: string;
  method: string;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  throughput: number;
  errorRate: number;
  successRate: number;
  totalRequests: number;
  period: {
    start: string;
    end: string;
  };
}

export interface RateLimit {
  id: string;
  name: string;
  endpoint: string;
  method: string;
  limit: number;
  window: number; // seconds
  current: number;
  remaining: number;
  resetTime: string;
  type: 'per_user' | 'per_ip' | 'global';
  strategy: 'fixed_window' | 'sliding_window' | 'token_bucket';
}

export interface APIAlert {
  id: string;
  name: string;
  type: 'latency' | 'error_rate' | 'throughput' | 'availability';
  threshold: number;
  currentValue: number;
  status: 'ok' | 'warning' | 'critical';
  triggered: boolean;
  triggeredAt?: string;
  endpoint?: string;
  description: string;
}

export interface APIHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
  dependencies: Array<{
    name: string;
    status: 'up' | 'down' | 'degraded';
    responseTime?: number;
    lastCheck: string;
  }>;
  lastUpdated: string;
}

export const apiMetricsAPI = {
  /**
   * Get API metrics
   */
  getMetrics: async (
    filters?: {
      endpoint?: string;
      method?: string;
      from?: string;
      to?: string;
      limit?: number;
    }
  ): Promise<APIMetrics[]> => {
    const { data } = await api.get('/api-metrics', { params: filters });
    return data;
  },

  /**
   * Get API performance statistics
   */
  getPerformance: async (
    filters?: {
      endpoint?: string;
      method?: string;
      timeRange?: 'hour' | 'day' | 'week' | 'month';
      from?: string;
      to?: string;
    }
  ): Promise<APIPerformance[]> => {
    const { data } = await api.get('/api-metrics/performance', { params: filters });
    return data;
  },

  /**
   * Get rate limit status
   */
  getRateLimits: async (
    filters?: {
      endpoint?: string;
      userId?: string;
      ipAddress?: string;
    }
  ): Promise<RateLimit[]> => {
    const { data } = await api.get('/api-metrics/rate-limits', { params: filters });
    return data;
  },

  /**
   * Get API alerts
   */
  getAlerts: async (
    filters?: {
      status?: 'ok' | 'warning' | 'critical';
      triggered?: boolean;
    }
  ): Promise<APIAlert[]> => {
    const { data } = await api.get('/api-metrics/alerts', { params: filters });
    return data;
  },

  /**
   * Get API health status
   */
  getHealth: async (): Promise<APIHealth> => {
    const { data } = await api.get('/api-metrics/health');
    return data;
  },

  /**
   * Create custom alert
   */
  createAlert: async (
    alertData: Omit<APIAlert, 'id' | 'currentValue' | 'triggered' | 'triggeredAt'>
  ): Promise<APIAlert> => {
    const { data } = await api.post('/api-metrics/alerts', alertData);
    return data;
  },

  /**
   * Get real-time metrics stream
   */
  getMetricsStream: async (endpoint?: string): Promise<EventSource> => {
    const params = endpoint ? `?endpoint=${encodeURIComponent(endpoint)}` : '';
    return new EventSource(`/api/api-metrics/stream${params}`);
  },

  /**
   * Export metrics data
   */
  exportMetrics: async (
    request: {
      format: 'csv' | 'json' | 'excel';
      from: string;
      to: string;
      endpoints?: string[];
    }
  ): Promise<Blob> => {
    const { data } = await api.post('/api-metrics/export', request, {
      responseType: 'blob',
    });
    return data;
  },
};

export default apiMetricsAPI;