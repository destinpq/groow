/**
 * Cloud Integration Services API
 * Multi-cloud platform integration and management
 */
import { api } from './client';

export interface CloudProvider {
  id: string;
  name: string;
  type: 'aws' | 'azure' | 'gcp' | 'alibaba' | 'digitalocean' | 'linode' | 'vultr';
  status: 'connected' | 'disconnected' | 'error';
  credentials: {
    encrypted: boolean;
    lastUpdated: string;
    expiresAt?: string;
  };
  regions: string[];
  services: string[];
  quotas: Array<{
    service: string;
    limit: number;
    used: number;
    unit: string;
  }>;
  costs: {
    currentMonth: number;
    lastMonth: number;
    currency: string;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface CloudResource {
  id: string;
  name: string;
  type: 'compute' | 'storage' | 'database' | 'network' | 'container' | 'serverless';
  provider: string;
  region: string;
  status: 'running' | 'stopped' | 'pending' | 'error' | 'terminated';
  configuration: Record<string, any>;
  tags: Record<string, string>;
  costs: {
    hourly: number;
    monthly: number;
    currency: string;
  };
  metrics: {
    cpu?: number;
    memory?: number;
    network?: number;
    storage?: number;
  };
  createdAt: string;
  lastModified: string;
}

export interface DeploymentPipeline {
  id: string;
  name: string;
  description: string;
  source: {
    type: 'git' | 'container' | 'artifact';
    repository: string;
    branch?: string;
    path?: string;
  };
  stages: Array<{
    id: string;
    name: string;
    type: 'build' | 'test' | 'deploy' | 'approval';
    environment: string;
    actions: Array<{
      type: string;
      configuration: Record<string, any>;
    }>;
    conditions: Array<{
      type: 'manual' | 'automatic' | 'scheduled';
      configuration: Record<string, any>;
    }>;
  }>;
  triggers: Array<{
    type: 'webhook' | 'schedule' | 'manual';
    configuration: Record<string, any>;
  }>;
  status: 'active' | 'paused' | 'disabled';
  lastRun?: {
    id: string;
    status: 'running' | 'success' | 'failed' | 'cancelled';
    startTime: string;
    endTime?: string;
  };
}

export interface CloudBackup {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  source: string;
  destination: {
    provider: string;
    bucket: string;
    path: string;
  };
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
  };
  retention: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  encryption: {
    enabled: boolean;
    algorithm?: string;
    keyId?: string;
  };
  status: 'active' | 'paused' | 'failed';
  lastBackup?: {
    timestamp: string;
    size: number;
    duration: number;
    status: 'success' | 'failed';
  };
  statistics: {
    totalBackups: number;
    totalSize: number;
    successRate: number;
  };
}

export const cloudIntegrationAPI = {
  /**
   * Get cloud providers
   */
  getProviders: async (): Promise<CloudProvider[]> => {
    const { data } = await api.get('/cloud/providers');
    return data;
  },

  /**
   * Connect cloud provider
   */
  connectProvider: async (
    providerData: {
      type: CloudProvider['type'];
      name: string;
      credentials: Record<string, any>;
      regions?: string[];
    }
  ): Promise<CloudProvider> => {
    const { data } = await api.post('/cloud/providers', providerData);
    return data;
  },

  /**
   * Update provider credentials
   */
  updateProvider: async (
    providerId: string,
    updates: {
      credentials?: Record<string, any>;
      regions?: string[];
    }
  ): Promise<CloudProvider> => {
    const { data } = await api.put(`/cloud/providers/${providerId}`, updates);
    return data;
  },

  /**
   * Test provider connection
   */
  testConnection: async (providerId: string): Promise<{
    success: boolean;
    latency?: number;
    availableServices: string[];
    errors?: string[];
  }> => {
    const { data } = await api.post(`/cloud/providers/${providerId}/test`);
    return data;
  },

  /**
   * Get cloud resources
   */
  getResources: async (
    filters?: {
      provider?: string;
      type?: string;
      region?: string;
      status?: string;
      tags?: Record<string, string>;
    }
  ): Promise<CloudResource[]> => {
    const { data } = await api.get('/cloud/resources', { params: filters });
    return data;
  },

  /**
   * Create cloud resource
   */
  createResource: async (
    resourceData: {
      name: string;
      type: CloudResource['type'];
      provider: string;
      region: string;
      configuration: Record<string, any>;
      tags?: Record<string, string>;
    }
  ): Promise<CloudResource> => {
    const { data } = await api.post('/cloud/resources', resourceData);
    return data;
  },

  /**
   * Update resource
   */
  updateResource: async (
    resourceId: string,
    updates: {
      configuration?: Record<string, any>;
      tags?: Record<string, string>;
    }
  ): Promise<CloudResource> => {
    const { data } = await api.put(`/cloud/resources/${resourceId}`, updates);
    return data;
  },

  /**
   * Start/Stop resource
   */
  controlResource: async (
    resourceId: string,
    action: 'start' | 'stop' | 'restart' | 'terminate'
  ): Promise<{
    success: boolean;
    taskId: string;
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post(`/cloud/resources/${resourceId}/control`, { action });
    return data;
  },

  /**
   * Get resource metrics
   */
  getResourceMetrics: async (
    resourceId: string,
    timeRange?: { start: string; end: string }
  ): Promise<{
    metrics: Array<{
      timestamp: string;
      cpu?: number;
      memory?: number;
      network?: { in: number; out: number };
      storage?: { used: number; available: number };
    }>;
    summary: {
      avgCpu: number;
      avgMemory: number;
      totalNetworkIn: number;
      totalNetworkOut: number;
      storageGrowth: number;
    };
  }> => {
    const { data } = await api.get(`/cloud/resources/${resourceId}/metrics`, {
      params: timeRange,
    });
    return data;
  },

  /**
   * Get deployment pipelines
   */
  getPipelines: async (
    filters?: {
      status?: string;
      environment?: string;
    }
  ): Promise<DeploymentPipeline[]> => {
    const { data } = await api.get('/cloud/pipelines', { params: filters });
    return data;
  },

  /**
   * Create deployment pipeline
   */
  createPipeline: async (
    pipelineData: Omit<DeploymentPipeline, 'id' | 'lastRun'>
  ): Promise<DeploymentPipeline> => {
    const { data } = await api.post('/cloud/pipelines', pipelineData);
    return data;
  },

  /**
   * Trigger pipeline
   */
  triggerPipeline: async (
    pipelineId: string,
    options?: {
      stage?: string;
      parameters?: Record<string, any>;
    }
  ): Promise<{
    runId: string;
    status: string;
    estimatedDuration?: number;
  }> => {
    const { data } = await api.post(`/cloud/pipelines/${pipelineId}/trigger`, options);
    return data;
  },

  /**
   * Get pipeline run details
   */
  getPipelineRun: async (
    pipelineId: string,
    runId: string
  ): Promise<{
    id: string;
    pipeline: string;
    status: string;
    startTime: string;
    endTime?: string;
    stages: Array<{
      name: string;
      status: string;
      startTime?: string;
      endTime?: string;
      logs?: string;
    }>;
  }> => {
    const { data } = await api.get(`/cloud/pipelines/${pipelineId}/runs/${runId}`);
    return data;
  },

  /**
   * Get backups
   */
  getBackups: async (
    filters?: {
      status?: string;
      type?: string;
    }
  ): Promise<CloudBackup[]> => {
    const { data } = await api.get('/cloud/backups', { params: filters });
    return data;
  },

  /**
   * Create backup
   */
  createBackup: async (
    backupData: Omit<CloudBackup, 'id' | 'lastBackup' | 'statistics'>
  ): Promise<CloudBackup> => {
    const { data } = await api.post('/cloud/backups', backupData);
    return data;
  },

  /**
   * Trigger backup
   */
  triggerBackup: async (
    backupId: string,
    type?: 'full' | 'incremental'
  ): Promise<{
    jobId: string;
    status: 'queued' | 'running' | 'completed' | 'failed';
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post(`/cloud/backups/${backupId}/trigger`, { type });
    return data;
  },

  /**
   * Restore from backup
   */
  restore: async (
    backupId: string,
    options: {
      destination: string;
      pointInTime?: string;
      partialRestore?: {
        paths: string[];
      };
    }
  ): Promise<{
    jobId: string;
    status: string;
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post(`/cloud/backups/${backupId}/restore`, options);
    return data;
  },

  /**
   * Get cost analysis
   */
  getCostAnalysis: async (
    timeRange?: { start: string; end: string }
  ): Promise<{
    total: number;
    currency: string;
    breakdown: Array<{
      provider: string;
      service: string;
      cost: number;
      percentage: number;
    }>;
    trends: Array<{
      date: string;
      cost: number;
    }>;
    predictions: Array<{
      date: string;
      predicted: number;
      confidence: number;
    }>;
    recommendations: Array<{
      type: 'cost_optimization' | 'right_sizing' | 'reserved_instances';
      description: string;
      potentialSavings: number;
    }>;
  }> => {
    const { data } = await api.get('/cloud/cost-analysis', {
      params: timeRange,
    });
    return data;
  },

  /**
   * Get cloud overview
   */
  getOverview: async (): Promise<{
    providers: {
      connected: number;
      total: number;
    };
    resources: {
      running: number;
      stopped: number;
      total: number;
    };
    costs: {
      currentMonth: number;
      lastMonth: number;
      currency: string;
      trend: string;
    };
    health: {
      uptime: number;
      availability: number;
      incidents: number;
    };
    recentActivity: Array<{
      type: string;
      description: string;
      timestamp: string;
    }>;
  }> => {
    const { data } = await api.get('/cloud/overview');
    return data;
  },
};

export default cloudIntegrationAPI;