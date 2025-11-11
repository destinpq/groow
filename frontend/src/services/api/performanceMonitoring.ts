/**
 * Performance Monitoring API Services
 * System performance, resource usage, and optimization recommendations
 */
import { api } from './client';

export interface SystemMetrics {
  id: string;
  timestamp: string;
  cpu: {
    usage: number;
    cores: number;
    frequency: number;
    load: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    cached: number;
    buffers: number;
    swapTotal: number;
    swapUsed: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    readOps: number;
    writeOps: number;
    readBytes: number;
    writeBytes: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
    errors: number;
    dropped: number;
  };
}

export interface ApplicationMetrics {
  id: string;
  service: string;
  instance: string;
  timestamp: string;
  responseTime: number;
  throughput: number;
  errorRate: number;
  activeConnections: number;
  queueSize: number;
  memoryUsage: number;
  cpuUsage: number;
  uptime: number;
}

export interface DatabaseMetrics {
  id: string;
  database: string;
  timestamp: string;
  connections: {
    active: number;
    idle: number;
    max: number;
  };
  queries: {
    totalQueries: number;
    slowQueries: number;
    averageExecutionTime: number;
    queriesPerSecond: number;
  };
  storage: {
    size: number;
    tableSize: number;
    indexSize: number;
    logSize: number;
  };
  performance: {
    cacheHitRatio: number;
    bufferHitRatio: number;
    lockWaits: number;
    deadlocks: number;
  };
}

export interface PerformanceAlert {
  id: string;
  type: 'system' | 'application' | 'database' | 'network';
  metric: string;
  threshold: number;
  currentValue: number;
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  status: 'active' | 'resolved';
  triggeredAt: string;
  resolvedAt?: string;
  description: string;
  recommendations: string[];
}

export interface OptimizationRecommendation {
  id: string;
  category: 'performance' | 'security' | 'cost' | 'scalability' | 'reliability';
  type: 'configuration' | 'architecture' | 'infrastructure' | 'code';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  priority: number;
  estimatedImprovement: string;
  implementation: {
    steps: string[];
    estimatedTime: string;
    resources: string[];
    risks: string[];
  };
  metrics: Array<{
    name: string;
    current: number;
    expected: number;
    unit: string;
  }>;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceReport {
  id: string;
  title: string;
  period: {
    start: string;
    end: string;
  };
  summary: {
    overallScore: number;
    availability: number;
    averageResponseTime: number;
    throughput: number;
    errorRate: number;
  };
  sections: Array<{
    title: string;
    type: 'chart' | 'table' | 'metrics' | 'text';
    data: any;
    insights: string[];
  }>;
  recommendations: OptimizationRecommendation[];
  generatedAt: string;
}

export const performanceMonitoringAPI = {
  /**
   * Get system metrics
   */
  getSystemMetrics: async (
    filters?: {
      from?: string;
      to?: string;
      interval?: string;
      instances?: string[];
    }
  ): Promise<SystemMetrics[]> => {
    const { data } = await api.get('/performance/system-metrics', { params: filters });
    return data;
  },

  /**
   * Get application metrics
   */
  getApplicationMetrics: async (
    filters?: {
      service?: string;
      instance?: string;
      from?: string;
      to?: string;
      interval?: string;
    }
  ): Promise<ApplicationMetrics[]> => {
    const { data } = await api.get('/performance/application-metrics', { params: filters });
    return data;
  },

  /**
   * Get database metrics
   */
  getDatabaseMetrics: async (
    filters?: {
      database?: string;
      from?: string;
      to?: string;
      interval?: string;
    }
  ): Promise<DatabaseMetrics[]> => {
    const { data } = await api.get('/performance/database-metrics', { params: filters });
    return data;
  },

  /**
   * Get performance alerts
   */
  getAlerts: async (
    filters?: {
      type?: string;
      severity?: string;
      status?: string;
      from?: string;
      to?: string;
    }
  ): Promise<PerformanceAlert[]> => {
    const { data } = await api.get('/performance/alerts', { params: filters });
    return data;
  },

  /**
   * Get optimization recommendations
   */
  getRecommendations: async (
    filters?: {
      category?: string;
      type?: string;
      status?: string;
      impact?: string;
      effort?: string;
    }
  ): Promise<OptimizationRecommendation[]> => {
    const { data } = await api.get('/performance/recommendations', { params: filters });
    return data;
  },

  /**
   * Update recommendation status
   */
  updateRecommendationStatus: async (
    recommendationId: string,
    status: OptimizationRecommendation['status'],
    note?: string
  ): Promise<OptimizationRecommendation> => {
    const { data } = await api.put(`/performance/recommendations/${recommendationId}/status`, {
      status,
      note,
    });
    return data;
  },

  /**
   * Generate performance report
   */
  generateReport: async (
    request: {
      title: string;
      period: { start: string; end: string };
      sections: string[];
      includeRecommendations: boolean;
    }
  ): Promise<PerformanceReport> => {
    const { data } = await api.post('/performance/reports', request);
    return data;
  },

  /**
   * Get performance overview
   */
  getOverview: async (
    timeRange?: { start: string; end: string }
  ): Promise<{
    systemHealth: {
      cpu: number;
      memory: number;
      disk: number;
      network: number;
    };
    applicationHealth: {
      responseTime: number;
      throughput: number;
      errorRate: number;
      availability: number;
    };
    databaseHealth: {
      connections: number;
      performance: number;
      storage: number;
      queries: number;
    };
    alerts: {
      critical: number;
      warning: number;
      info: number;
    };
    trends: Array<{
      metric: string;
      current: number;
      previous: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    }>;
  }> => {
    const { data } = await api.get('/performance/overview', {
      params: timeRange,
    });
    return data;
  },

  /**
   * Start performance test
   */
  startPerformanceTest: async (
    config: {
      type: 'load' | 'stress' | 'endurance' | 'spike';
      target: string;
      duration: number;
      concurrency: number;
      rampUp: number;
      scenarios: Array<{
        name: string;
        weight: number;
        requests: Array<{
          method: string;
          url: string;
          headers?: Record<string, string>;
          body?: any;
        }>;
      }>;
    }
  ): Promise<{
    testId: string;
    status: 'queued' | 'running' | 'completed' | 'failed';
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post('/performance/tests', config);
    return data;
  },

  /**
   * Get performance test results
   */
  getTestResults: async (
    testId: string
  ): Promise<{
    testId: string;
    status: string;
    startTime: string;
    endTime?: string;
    results: {
      totalRequests: number;
      successfulRequests: number;
      failedRequests: number;
      averageResponseTime: number;
      p95ResponseTime: number;
      p99ResponseTime: number;
      throughput: number;
      errorRate: number;
    };
    timeline: Array<{
      timestamp: string;
      requests: number;
      responseTime: number;
      errors: number;
    }>;
  }> => {
    const { data } = await api.get(`/performance/tests/${testId}/results`);
    return data;
  },

  /**
   * Get real-time metrics stream
   */
  getMetricsStream: async (
    type: 'system' | 'application' | 'database'
  ): Promise<EventSource> => {
    return new EventSource(`/api/performance/stream/${type}`);
  },
};

export default performanceMonitoringAPI;