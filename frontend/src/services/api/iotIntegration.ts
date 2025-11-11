/**
 * IoT Integration API Services
 * Third-party integrations, protocols, and platform connectivity
 */
import { api } from './client';

export interface IoTIntegration {
  id: string;
  name: string;
  type: 'protocol' | 'platform' | 'cloud' | 'edge' | 'api' | 'webhook' | 'mqtt' | 'custom';
  provider: 'aws_iot' | 'azure_iot' | 'google_cloud_iot' | 'thingworx' | 'predix' | 'watson_iot' | 'custom';
  status: 'active' | 'inactive' | 'error' | 'configuring' | 'testing' | 'deprecated';
  description: string;
  configuration: {
    endpoint: string;
    protocol: 'mqtt' | 'http' | 'https' | 'coap' | 'websocket' | 'amqp' | 'tcp' | 'udp';
    authentication: {
      type: 'none' | 'basic' | 'bearer' | 'api_key' | 'oauth2' | 'certificate' | 'custom';
      credentials?: {
        username?: string;
        password?: string;
        apiKey?: string;
        token?: string;
        clientId?: string;
        clientSecret?: string;
        certificate?: string;
        privateKey?: string;
      };
      refreshToken?: string;
      expiresAt?: string;
    };
    connection: {
      timeout: number; // seconds
      keepAlive: number; // seconds
      retryAttempts: number;
      retryDelay: number; // seconds
      compression?: boolean;
      encryption?: boolean;
      qos?: 0 | 1 | 2; // MQTT Quality of Service
    };
    dataMapping: {
      inbound: Array<{
        source: string;
        target: string;
        transformation?: string;
        validation?: string;
      }>;
      outbound: Array<{
        source: string;
        target: string;
        transformation?: string;
        format?: 'json' | 'xml' | 'csv' | 'binary';
      }>;
    };
    filters: Array<{
      field: string;
      condition: 'equals' | 'contains' | 'starts_with' | 'regex' | 'range';
      value: any;
      action: 'include' | 'exclude' | 'transform';
    }>;
  };
  devices: Array<{
    deviceId: string;
    externalId: string;
    mapping: Record<string, string>;
    lastSync?: string;
    syncStatus: 'synced' | 'pending' | 'error';
  }>;
  dataFlow: {
    direction: 'inbound' | 'outbound' | 'bidirectional';
    format: 'json' | 'xml' | 'csv' | 'binary' | 'protobuf';
    compression?: string;
    encryption?: string;
    batchSize?: number;
    interval?: number; // seconds
  };
  monitoring: {
    enabled: boolean;
    metrics: Array<{
      name: string;
      type: 'counter' | 'gauge' | 'histogram';
      value: number;
      lastUpdated: string;
    }>;
    healthcheck: {
      endpoint?: string;
      interval: number; // seconds
      timeout: number; // seconds
      expectedResponse?: any;
    };
    alerts: Array<{
      condition: string;
      threshold: number;
      action: 'email' | 'webhook' | 'automation';
      recipients: string[];
    }>;
  };
  statistics: {
    messagesIn: number;
    messagesOut: number;
    bytesIn: number;
    bytesOut: number;
    errors: number;
    lastActivity?: string;
    uptime: number; // percentage
    averageLatency: number; // milliseconds
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: string;
    tags: string[];
  };
}

export interface IntegrationTemplate {
  id: string;
  name: string;
  description: string;
  provider: IoTIntegration['provider'];
  type: IoTIntegration['type'];
  category: 'cloud_platform' | 'edge_gateway' | 'protocol_bridge' | 'data_export' | 'notification' | 'analytics';
  configuration: {
    template: Record<string, any>;
    parameters: Array<{
      name: string;
      type: 'string' | 'number' | 'boolean' | 'password' | 'file' | 'select';
      required: boolean;
      default?: any;
      description: string;
      options?: string[];
      validation?: {
        pattern?: string;
        min?: number;
        max?: number;
      };
    }>;
  };
  features: string[];
  requirements: {
    protocols: string[];
    authentication: string[];
    permissions: string[];
  };
  documentation: {
    setupGuide: string;
    examples: Array<{
      name: string;
      description: string;
      configuration: Record<string, any>;
    }>;
    troubleshooting: Array<{
      issue: string;
      solution: string;
    }>;
  };
  metadata: {
    author: string;
    version: string;
    createdAt: string;
    updatedAt: string;
    downloads: number;
    rating: number;
    tags: string[];
  };
}

export interface IntegrationEvent {
  id: string;
  integrationId: string;
  type: 'data_received' | 'data_sent' | 'connection_established' | 'connection_lost' | 'error' | 'authentication_failed' | 'sync_completed';
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  data?: {
    payload?: any;
    size?: number;
    latency?: number;
    error?: {
      code: string;
      message: string;
      stack?: string;
    };
    device?: {
      id: string;
      type: string;
    };
    endpoint?: string;
  };
  context: {
    sessionId?: string;
    requestId?: string;
    userId?: string;
    source: 'device' | 'platform' | 'user' | 'system';
  };
}

export interface IntegrationSync {
  id: string;
  integrationId: string;
  type: 'full' | 'incremental' | 'device_specific';
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  direction: 'inbound' | 'outbound' | 'bidirectional';
  scope: {
    deviceIds?: string[];
    dataTypes?: string[];
    timeRange?: { start: string; end: string };
  };
  progress: {
    totalItems: number;
    processedItems: number;
    failedItems: number;
    percentage: number;
    currentItem?: string;
  };
  results: {
    itemsCreated: number;
    itemsUpdated: number;
    itemsDeleted: number;
    itemsSkipped: number;
    errors: Array<{
      item: string;
      error: string;
      code?: string;
    }>;
  };
  performance: {
    startedAt: string;
    completedAt?: string;
    duration?: number; // seconds
    throughput?: number; // items per second
    dataTransferred: number; // bytes
  };
  metadata: {
    triggeredBy: 'schedule' | 'manual' | 'webhook' | 'event';
    userId?: string;
    configuration: Record<string, any>;
  };
}

export interface IntegrationFlow {
  id: string;
  name: string;
  description: string;
  type: 'data_pipeline' | 'event_stream' | 'batch_sync' | 'real_time_sync' | 'transformation';
  status: 'active' | 'paused' | 'error' | 'configuring';
  source: {
    integrationId: string;
    configuration: {
      filters?: Record<string, any>;
      mapping?: Record<string, string>;
      transformation?: string;
    };
  };
  destination: {
    integrationId: string;
    configuration: {
      mapping?: Record<string, string>;
      transformation?: string;
      validation?: string;
    };
  };
  processing: {
    batchSize?: number;
    interval?: number; // seconds
    parallelism?: number;
    errorHandling: 'skip' | 'retry' | 'stop' | 'deadletter';
    retryPolicy?: {
      maxAttempts: number;
      backoff: 'linear' | 'exponential';
      delay: number; // seconds
    };
  };
  transformations: Array<{
    id: string;
    name: string;
    type: 'map' | 'filter' | 'aggregate' | 'split' | 'join' | 'custom';
    configuration: Record<string, any>;
    order: number;
  }>;
  monitoring: {
    enabled: boolean;
    metrics: string[];
    alerts: Array<{
      condition: string;
      threshold: number;
      action: string;
    }>;
  };
  statistics: {
    itemsProcessed: number;
    lastRun?: string;
    averageLatency: number;
    errorRate: number;
    throughput: number; // items per second
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
  };
}

export interface IntegrationEndpoint {
  id: string;
  name: string;
  type: 'webhook' | 'api' | 'mqtt_topic' | 'message_queue' | 'file_transfer' | 'database';
  direction: 'inbound' | 'outbound' | 'bidirectional';
  status: 'active' | 'inactive' | 'error';
  configuration: {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    authentication?: {
      type: 'none' | 'basic' | 'bearer' | 'api_key';
      credentials?: Record<string, string>;
    };
    payload?: {
      format: 'json' | 'xml' | 'form' | 'binary';
      template?: string;
      compression?: boolean;
    };
    response?: {
      expectedStatus: number[];
      timeout: number; // seconds
      retries: number;
    };
  };
  security: {
    encryption: boolean;
    signing: boolean;
    ipWhitelist?: string[];
    rateLimiting?: {
      requests: number;
      window: number; // seconds
    };
  };
  dataMapping: {
    incoming: Record<string, string>;
    outgoing: Record<string, string>;
  };
  events: Array<{
    trigger: 'data_received' | 'schedule' | 'threshold' | 'device_event';
    configuration: Record<string, any>;
    enabled: boolean;
  }>;
  statistics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    lastUsed?: string;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
  };
}

export interface IntegrationProtocol {
  id: string;
  name: string;
  version: string;
  type: 'mqtt' | 'http' | 'coap' | 'websocket' | 'amqp' | 'modbus' | 'opcua' | 'bacnet' | 'zigbee' | 'zwave' | 'lora' | 'custom';
  status: 'supported' | 'experimental' | 'deprecated';
  capabilities: {
    communication: 'publish_subscribe' | 'request_response' | 'broadcast' | 'multicast';
    reliability: 'best_effort' | 'at_least_once' | 'exactly_once';
    security: string[];
    qos: boolean;
    compression: boolean;
  };
  configuration: {
    defaultPort: number;
    timeouts: {
      connection: number;
      read: number;
      write: number;
    };
    limits: {
      messageSize: number;
      connectionCount: number;
      throughput: number;
    };
    security: {
      encryption: string[];
      authentication: string[];
      authorization: string[];
    };
  };
  messageFormats: Array<{
    name: string;
    contentType: string;
    schema?: string;
    validation?: string;
  }>;
  endpoints: Array<{
    name: string;
    pattern: string;
    description: string;
    parameters: Array<{
      name: string;
      type: string;
      required: boolean;
    }>;
  }>;
  examples: Array<{
    name: string;
    description: string;
    configuration: Record<string, any>;
    code: string;
  }>;
  documentation: {
    specification: string;
    implementation: string;
    bestPractices: string[];
  };
}

export const iotIntegrationAPI = {
  /**
   * Create integration
   */
  createIntegration: async (
    integrationData: Omit<IoTIntegration, 'id' | 'statistics' | 'metadata'>
  ): Promise<IoTIntegration> => {
    const { data } = await api.post('/iot/integrations', integrationData);
    return data;
  },

  /**
   * Get integrations
   */
  getIntegrations: async (
    filters?: {
      type?: IoTIntegration['type'];
      provider?: IoTIntegration['provider'];
      status?: IoTIntegration['status'];
      tags?: string[];
    }
  ): Promise<IoTIntegration[]> => {
    const { data } = await api.get('/iot/integrations', { params: filters });
    return data;
  },

  /**
   * Get integration details
   */
  getIntegration: async (integrationId: string): Promise<IoTIntegration> => {
    const { data } = await api.get(`/iot/integrations/${integrationId}`);
    return data;
  },

  /**
   * Update integration
   */
  updateIntegration: async (
    integrationId: string,
    updates: Partial<IoTIntegration>
  ): Promise<IoTIntegration> => {
    const { data } = await api.put(`/iot/integrations/${integrationId}`, updates);
    return data;
  },

  /**
   * Delete integration
   */
  deleteIntegration: async (integrationId: string): Promise<void> => {
    await api.delete(`/iot/integrations/${integrationId}`);
  },

  /**
   * Test integration connection
   */
  testIntegration: async (
    integrationId: string,
    testConfig?: {
      timeout?: number;
      sampleData?: any;
      validateCertificates?: boolean;
    }
  ): Promise<{
    success: boolean;
    connectionTime: number;
    response?: any;
    error?: string;
    warnings: string[];
    recommendations: string[];
  }> => {
    const { data } = await api.post(`/iot/integrations/${integrationId}/test`, testConfig);
    return data;
  },

  /**
   * Enable/disable integration
   */
  toggleIntegration: async (
    integrationId: string,
    enabled: boolean
  ): Promise<IoTIntegration> => {
    const { data } = await api.put(`/iot/integrations/${integrationId}/toggle`, { enabled });
    return data;
  },

  /**
   * Sync integration data
   */
  syncIntegration: async (
    integrationId: string,
    syncConfig?: {
      type?: IntegrationSync['type'];
      direction?: IntegrationSync['direction'];
      scope?: IntegrationSync['scope'];
      force?: boolean;
    }
  ): Promise<IntegrationSync> => {
    const { data } = await api.post(`/iot/integrations/${integrationId}/sync`, syncConfig);
    return data;
  },

  /**
   * Get integration templates
   */
  getTemplates: async (
    filters?: {
      provider?: string;
      type?: string;
      category?: string;
      tags?: string[];
    }
  ): Promise<IntegrationTemplate[]> => {
    const { data } = await api.get('/iot/integrations/templates', { params: filters });
    return data;
  },

  /**
   * Get template details
   */
  getTemplate: async (templateId: string): Promise<IntegrationTemplate> => {
    const { data } = await api.get(`/iot/integrations/templates/${templateId}`);
    return data;
  },

  /**
   * Create integration from template
   */
  createFromTemplate: async (
    templateId: string,
    parameters: Record<string, any>,
    customizations?: {
      name?: string;
      description?: string;
      configuration?: Record<string, any>;
    }
  ): Promise<IoTIntegration> => {
    const { data } = await api.post(`/iot/integrations/templates/${templateId}/create`, {
      parameters,
      customizations,
    });
    return data;
  },

  /**
   * Get integration events
   */
  getEvents: async (
    filters?: {
      integrationId?: string;
      type?: IntegrationEvent['type'];
      severity?: IntegrationEvent['severity'];
      from?: string;
      to?: string;
      limit?: number;
    }
  ): Promise<IntegrationEvent[]> => {
    const { data } = await api.get('/iot/integrations/events', { params: filters });
    return data;
  },

  /**
   * Get sync history
   */
  getSyncHistory: async (
    integrationId?: string,
    filters?: {
      status?: IntegrationSync['status'];
      type?: IntegrationSync['type'];
      from?: string;
      to?: string;
      limit?: number;
    }
  ): Promise<IntegrationSync[]> => {
    const { data } = await api.get('/iot/integrations/syncs', {
      params: { integrationId, ...filters },
    });
    return data;
  },

  /**
   * Get sync details
   */
  getSyncDetails: async (syncId: string): Promise<IntegrationSync> => {
    const { data } = await api.get(`/iot/integrations/syncs/${syncId}`);
    return data;
  },

  /**
   * Cancel sync
   */
  cancelSync: async (syncId: string): Promise<IntegrationSync> => {
    const { data } = await api.post(`/iot/integrations/syncs/${syncId}/cancel`);
    return data;
  },

  /**
   * Retry failed sync
   */
  retrySync: async (
    syncId: string,
    options?: {
      retryFailedOnly?: boolean;
      overrideConfiguration?: Record<string, any>;
    }
  ): Promise<IntegrationSync> => {
    const { data } = await api.post(`/iot/integrations/syncs/${syncId}/retry`, options);
    return data;
  },

  /**
   * Create integration flow
   */
  createFlow: async (
    flowData: Omit<IntegrationFlow, 'id' | 'statistics' | 'metadata'>
  ): Promise<IntegrationFlow> => {
    const { data } = await api.post('/iot/integrations/flows', flowData);
    return data;
  },

  /**
   * Get integration flows
   */
  getFlows: async (
    filters?: {
      type?: IntegrationFlow['type'];
      status?: IntegrationFlow['status'];
      sourceIntegrationId?: string;
      destinationIntegrationId?: string;
    }
  ): Promise<IntegrationFlow[]> => {
    const { data } = await api.get('/iot/integrations/flows', { params: filters });
    return data;
  },

  /**
   * Get flow details
   */
  getFlow: async (flowId: string): Promise<IntegrationFlow> => {
    const { data } = await api.get(`/iot/integrations/flows/${flowId}`);
    return data;
  },

  /**
   * Update flow
   */
  updateFlow: async (
    flowId: string,
    updates: Partial<IntegrationFlow>
  ): Promise<IntegrationFlow> => {
    const { data } = await api.put(`/iot/integrations/flows/${flowId}`, updates);
    return data;
  },

  /**
   * Execute flow
   */
  executeFlow: async (
    flowId: string,
    options?: {
      dryRun?: boolean;
      sampleData?: any;
    }
  ): Promise<{
    success: boolean;
    executionId: string;
    results?: any;
    errors: string[];
    performance: {
      duration: number;
      itemsProcessed: number;
      throughput: number;
    };
  }> => {
    const { data } = await api.post(`/iot/integrations/flows/${flowId}/execute`, options);
    return data;
  },

  /**
   * Pause/resume flow
   */
  toggleFlow: async (
    flowId: string,
    action: 'pause' | 'resume'
  ): Promise<IntegrationFlow> => {
    const { data } = await api.post(`/iot/integrations/flows/${flowId}/${action}`);
    return data;
  },

  /**
   * Create endpoint
   */
  createEndpoint: async (
    endpointData: Omit<IntegrationEndpoint, 'id' | 'statistics' | 'metadata'>
  ): Promise<IntegrationEndpoint> => {
    const { data } = await api.post('/iot/integrations/endpoints', endpointData);
    return data;
  },

  /**
   * Get endpoints
   */
  getEndpoints: async (
    filters?: {
      type?: IntegrationEndpoint['type'];
      direction?: IntegrationEndpoint['direction'];
      status?: IntegrationEndpoint['status'];
    }
  ): Promise<IntegrationEndpoint[]> => {
    const { data } = await api.get('/iot/integrations/endpoints', { params: filters });
    return data;
  },

  /**
   * Get endpoint details
   */
  getEndpoint: async (endpointId: string): Promise<IntegrationEndpoint> => {
    const { data } = await api.get(`/iot/integrations/endpoints/${endpointId}`);
    return data;
  },

  /**
   * Update endpoint
   */
  updateEndpoint: async (
    endpointId: string,
    updates: Partial<IntegrationEndpoint>
  ): Promise<IntegrationEndpoint> => {
    const { data } = await api.put(`/iot/integrations/endpoints/${endpointId}`, updates);
    return data;
  },

  /**
   * Delete endpoint
   */
  deleteEndpoint: async (endpointId: string): Promise<void> => {
    await api.delete(`/iot/integrations/endpoints/${endpointId}`);
  },

  /**
   * Test endpoint
   */
  testEndpoint: async (
    endpointId: string,
    testData?: any
  ): Promise<{
    success: boolean;
    response?: any;
    responseTime: number;
    error?: string;
  }> => {
    const { data } = await api.post(`/iot/integrations/endpoints/${endpointId}/test`, {
      testData,
    });
    return data;
  },

  /**
   * Trigger endpoint
   */
  triggerEndpoint: async (
    endpointId: string,
    payload: any,
    options?: {
      async?: boolean;
      timeout?: number;
    }
  ): Promise<{
    success: boolean;
    executionId?: string;
    response?: any;
    error?: string;
  }> => {
    const { data } = await api.post(`/iot/integrations/endpoints/${endpointId}/trigger`, {
      payload,
      options,
    });
    return data;
  },

  /**
   * Get supported protocols
   */
  getProtocols: async (
    filters?: {
      type?: string;
      status?: 'supported' | 'experimental' | 'deprecated';
    }
  ): Promise<IntegrationProtocol[]> => {
    const { data } = await api.get('/iot/integrations/protocols', { params: filters });
    return data;
  },

  /**
   * Get protocol details
   */
  getProtocol: async (protocolId: string): Promise<IntegrationProtocol> => {
    const { data } = await api.get(`/iot/integrations/protocols/${protocolId}`);
    return data;
  },

  /**
   * Validate integration configuration
   */
  validateConfiguration: async (
    type: string,
    configuration: Record<string, any>
  ): Promise<{
    valid: boolean;
    errors: Array<{
      field: string;
      message: string;
      severity: 'error' | 'warning';
    }>;
    warnings: string[];
    suggestions: string[];
  }> => {
    const { data } = await api.post('/iot/integrations/validate', {
      type,
      configuration,
    });
    return data;
  },

  /**
   * Get integration analytics
   */
  getAnalytics: async (
    timeRange: { start: string; end: string },
    filters?: {
      integrationIds?: string[];
      types?: string[];
      providers?: string[];
    }
  ): Promise<{
    overview: {
      totalIntegrations: number;
      activeIntegrations: number;
      totalDataTransfer: number;
      averageLatency: number;
      successRate: number;
    };
    performance: Array<{
      integrationId: string;
      name: string;
      type: string;
      messagesProcessed: number;
      errorRate: number;
      averageLatency: number;
      dataTransferred: number;
    }>;
    trends: Array<{
      date: string;
      messagesIn: number;
      messagesOut: number;
      errors: number;
      latency: number;
    }>;
    errors: Array<{
      integrationId: string;
      name: string;
      errorCount: number;
      commonErrors: Array<{
        error: string;
        count: number;
      }>;
    }>;
  }> => {
    const { data } = await api.get('/iot/integrations/analytics', {
      params: { ...timeRange, ...filters },
    });
    return data;
  },

  /**
   * Export integration configuration
   */
  exportConfiguration: async (
    integrationIds: string[],
    options?: {
      includeCredentials?: boolean;
      format?: 'json' | 'yaml';
      template?: boolean;
    }
  ): Promise<Blob> => {
    const { data } = await api.post('/iot/integrations/export', {
      integrationIds,
      options,
    }, {
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Import integration configuration
   */
  importConfiguration: async (
    file: File,
    options?: {
      overwriteExisting?: boolean;
      validateOnly?: boolean;
      updateCredentials?: boolean;
    }
  ): Promise<{
    success: boolean;
    imported: Array<{
      id: string;
      name: string;
      status: 'imported' | 'updated' | 'skipped' | 'error';
      message?: string;
    }>;
    errors: string[];
    warnings: string[];
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }

    const { data } = await api.post('/iot/integrations/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Get integration health
   */
  getHealth: async (integrationId?: string): Promise<{
    overall: {
      status: 'healthy' | 'warning' | 'critical';
      score: number; // 0-100
      issues: Array<{
        type: string;
        severity: string;
        message: string;
      }>;
    };
    integrations: Array<{
      id: string;
      name: string;
      status: 'healthy' | 'warning' | 'critical';
      uptime: number;
      lastActivity: string;
      issues: string[];
    }>;
    metrics: {
      responseTime: number;
      errorRate: number;
      throughput: number;
      resourceUsage: {
        cpu: number;
        memory: number;
        network: number;
      };
    };
  }> => {
    const { data } = await api.get('/iot/integrations/health', {
      params: { integrationId },
    });
    return data;
  },

  /**
   * Generate integration documentation
   */
  generateDocumentation: async (
    integrationId: string,
    format: 'markdown' | 'html' | 'pdf'
  ): Promise<Blob> => {
    const { data } = await api.get(`/iot/integrations/${integrationId}/documentation`, {
      params: { format },
      responseType: 'blob',
    });
    return data;
  },
};

export default iotIntegrationAPI;