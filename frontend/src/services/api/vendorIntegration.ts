/**
 * Vendor Integration API Services
 * Third-party integrations, API management, and external service connections
 */
import { api } from './client';

export interface Integration {
  id: string;
  vendorId: string;
  name: string;
  slug: string;
  description: string;
  provider: string;
  category: 'shipping' | 'payment' | 'inventory' | 'accounting' | 'marketing' | 'analytics' | 'erp' | 'crm' | 'other';
  type: 'webhook' | 'api' | 'file_sync' | 'database' | 'real_time';
  status: 'active' | 'inactive' | 'error' | 'pending' | 'testing';
  config: {
    apiUrl?: string;
    apiKey?: string;
    secretKey?: string;
    username?: string;
    password?: string;
    webhookUrl?: string;
    customFields?: Record<string, any>;
  };
  settings: {
    syncFrequency?: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'manual';
    dataMapping?: Record<string, string>;
    filters?: Record<string, any>;
    retryAttempts?: number;
    timeout?: number;
    batchSize?: number;
    enableLogging?: boolean;
  };
  features: string[];
  permissions: string[];
  lastSync?: {
    timestamp: string;
    status: 'success' | 'error' | 'partial';
    recordsProcessed: number;
    errors?: string[];
  };
  metrics: {
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    uptime: number;
    averageResponseTime: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEndpoint {
  id: string;
  vendorId: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  secret?: string;
  headers?: Record<string, string>;
  retryPolicy: {
    maxRetries: number;
    retryInterval: number;
    backoffMultiplier: number;
  };
  filters?: Record<string, any>;
  lastDelivery?: {
    timestamp: string;
    status: 'success' | 'failed';
    responseCode?: number;
    responseTime?: number;
    error?: string;
  };
  metrics: {
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    averageResponseTime: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface APIKey {
  id: string;
  vendorId: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  scopes: string[];
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  ipWhitelist?: string[];
  expiresAt?: string;
  lastUsed?: {
    timestamp: string;
    ip: string;
    endpoint: string;
  };
  status: 'active' | 'expired' | 'revoked';
  usage: {
    totalRequests: number;
    requestsToday: number;
    requestsThisMonth: number;
  };
  createdAt: string;
}

export interface DataSync {
  id: string;
  integrationId: string;
  type: 'import' | 'export' | 'bidirectional';
  entity: 'products' | 'orders' | 'customers' | 'inventory' | 'prices' | 'categories';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: {
    totalRecords: number;
    processedRecords: number;
    successfulRecords: number;
    failedRecords: number;
    percentage: number;
  };
  settings: {
    batchSize: number;
    deleteUnmatched: boolean;
    updateExisting: boolean;
    skipValidation: boolean;
  };
  mapping: Record<string, string>;
  schedule?: {
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    time?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
  };
  errors: Array<{
    record: any;
    error: string;
    timestamp: string;
  }>;
  log: Array<{
    level: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
    metadata?: any;
  }>;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface MarketplaceConnection {
  id: string;
  vendorId: string;
  marketplace: 'amazon' | 'ebay' | 'etsy' | 'walmart' | 'shopify' | 'woocommerce' | 'magento' | 'other';
  storeName: string;
  storeUrl?: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending_approval';
  credentials: {
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
    refreshToken?: string;
    sellerId?: string;
    storeHash?: string;
  };
  syncSettings: {
    products: {
      enabled: boolean;
      direction: 'import' | 'export' | 'bidirectional';
      autoUpdate: boolean;
      mapping: Record<string, string>;
    };
    inventory: {
      enabled: boolean;
      direction: 'import' | 'export' | 'bidirectional';
      threshold: number;
    };
    orders: {
      enabled: boolean;
      autoImport: boolean;
      statusMapping: Record<string, string>;
    };
    prices: {
      enabled: boolean;
      margin: number;
      roundingRule: 'up' | 'down' | 'nearest';
    };
  };
  lastSync: {
    timestamp: string;
    status: 'success' | 'error';
    recordsProcessed: number;
  };
  metrics: {
    productsListed: number;
    ordersSynced: number;
    revenue: number;
    conversionRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ThirdPartyApp {
  id: string;
  name: string;
  developer: string;
  category: string;
  description: string;
  features: string[];
  pricing: {
    type: 'free' | 'paid' | 'freemium';
    plans: Array<{
      name: string;
      price: number;
      features: string[];
    }>;
  };
  rating: {
    average: number;
    count: number;
  };
  screenshots: string[];
  documentationUrl?: string;
  supportUrl?: string;
  permissions: string[];
  installed: boolean;
  installUrl?: string;
}

export const vendorIntegrationAPI = {
  /**
   * Get all integrations
   */
  getIntegrations: async (
    category?: Integration['category'],
    status?: Integration['status']
  ) => {
    const { data } = await api.get('/vendor/integrations', {
      params: { category, status },
    });
    return data;
  },

  /**
   * Get integration details
   */
  getIntegration: async (integrationId: string): Promise<Integration> => {
    const { data } = await api.get(`/vendor/integrations/${integrationId}`);
    return data;
  },

  /**
   * Create new integration
   */
  createIntegration: async (integration: {
    name: string;
    provider: string;
    category: Integration['category'];
    type: Integration['type'];
    config: Integration['config'];
    settings: Integration['settings'];
  }): Promise<Integration> => {
    const { data } = await api.post('/vendor/integrations', integration);
    return data;
  },

  /**
   * Update integration
   */
  updateIntegration: async (
    integrationId: string,
    updates: Partial<Integration>
  ): Promise<Integration> => {
    const { data } = await api.put(`/vendor/integrations/${integrationId}`, updates);
    return data;
  },

  /**
   * Test integration connection
   */
  testIntegration: async (integrationId: string) => {
    const { data } = await api.post(`/vendor/integrations/${integrationId}/test`);
    return data;
  },

  /**
   * Enable/Disable integration
   */
  toggleIntegration: async (integrationId: string, enabled: boolean): Promise<void> => {
    await api.put(`/vendor/integrations/${integrationId}/toggle`, { enabled });
  },

  /**
   * Delete integration
   */
  deleteIntegration: async (integrationId: string): Promise<void> => {
    await api.delete(`/vendor/integrations/${integrationId}`);
  },

  /**
   * Trigger manual sync
   */
  triggerSync: async (integrationId: string, entity?: string) => {
    const { data } = await api.post(`/vendor/integrations/${integrationId}/sync`, { entity });
    return data;
  },

  /**
   * Get integration logs
   */
  getIntegrationLogs: async (
    integrationId: string,
    page: number = 1,
    limit: number = 50,
    level?: 'info' | 'warning' | 'error'
  ) => {
    const { data } = await api.get(`/vendor/integrations/${integrationId}/logs`, {
      params: { page, limit, level },
    });
    return data;
  },

  /**
   * Get webhook endpoints
   */
  getWebhookEndpoints: async (): Promise<WebhookEndpoint[]> => {
    const { data } = await api.get('/vendor/integrations/webhooks');
    return data;
  },

  /**
   * Create webhook endpoint
   */
  createWebhookEndpoint: async (webhook: {
    name: string;
    url: string;
    events: string[];
    secret?: string;
    headers?: Record<string, string>;
    retryPolicy?: WebhookEndpoint['retryPolicy'];
  }): Promise<WebhookEndpoint> => {
    const { data } = await api.post('/vendor/integrations/webhooks', webhook);
    return data;
  },

  /**
   * Update webhook endpoint
   */
  updateWebhookEndpoint: async (
    webhookId: string,
    updates: Partial<WebhookEndpoint>
  ): Promise<WebhookEndpoint> => {
    const { data } = await api.put(`/vendor/integrations/webhooks/${webhookId}`, updates);
    return data;
  },

  /**
   * Delete webhook endpoint
   */
  deleteWebhookEndpoint: async (webhookId: string): Promise<void> => {
    await api.delete(`/vendor/integrations/webhooks/${webhookId}`);
  },

  /**
   * Test webhook endpoint
   */
  testWebhookEndpoint: async (webhookId: string, event?: string) => {
    const { data } = await api.post(`/vendor/integrations/webhooks/${webhookId}/test`, { event });
    return data;
  },

  /**
   * Get webhook delivery logs
   */
  getWebhookLogs: async (
    webhookId: string,
    page: number = 1,
    limit: number = 50
  ) => {
    const { data } = await api.get(`/vendor/integrations/webhooks/${webhookId}/logs`, {
      params: { page, limit },
    });
    return data;
  },

  /**
   * Get API keys
   */
  getAPIKeys: async (): Promise<APIKey[]> => {
    const { data } = await api.get('/vendor/integrations/api-keys');
    return data;
  },

  /**
   * Create API key
   */
  createAPIKey: async (keyData: {
    name: string;
    permissions: string[];
    scopes: string[];
    rateLimit?: APIKey['rateLimit'];
    ipWhitelist?: string[];
    expiresAt?: string;
  }): Promise<{ apiKey: APIKey; secret: string }> => {
    const { data } = await api.post('/vendor/integrations/api-keys', keyData);
    return data;
  },

  /**
   * Update API key
   */
  updateAPIKey: async (keyId: string, updates: Partial<APIKey>): Promise<APIKey> => {
    const { data } = await api.put(`/vendor/integrations/api-keys/${keyId}`, updates);
    return data;
  },

  /**
   * Revoke API key
   */
  revokeAPIKey: async (keyId: string): Promise<void> => {
    await api.put(`/vendor/integrations/api-keys/${keyId}/revoke`);
  },

  /**
   * Regenerate API key
   */
  regenerateAPIKey: async (keyId: string): Promise<{ secret: string }> => {
    const { data } = await api.post(`/vendor/integrations/api-keys/${keyId}/regenerate`);
    return data;
  },

  /**
   * Get API key usage stats
   */
  getAPIKeyUsage: async (keyId: string, timeRange?: { from: string; to: string }) => {
    const { data } = await api.get(`/vendor/integrations/api-keys/${keyId}/usage`, {
      params: timeRange,
    });
    return data;
  },

  /**
   * Get data sync jobs
   */
  getDataSyncs: async (
    integrationId?: string,
    status?: DataSync['status'],
    entity?: DataSync['entity']
  ) => {
    const { data } = await api.get('/vendor/integrations/data-syncs', {
      params: { integrationId, status, entity },
    });
    return data;
  },

  /**
   * Get data sync details
   */
  getDataSync: async (syncId: string): Promise<DataSync> => {
    const { data } = await api.get(`/vendor/integrations/data-syncs/${syncId}`);
    return data;
  },

  /**
   * Create data sync job
   */
  createDataSync: async (syncData: {
    integrationId: string;
    type: DataSync['type'];
    entity: DataSync['entity'];
    settings: DataSync['settings'];
    mapping: DataSync['mapping'];
    schedule?: DataSync['schedule'];
  }): Promise<DataSync> => {
    const { data } = await api.post('/vendor/integrations/data-syncs', syncData);
    return data;
  },

  /**
   * Start data sync
   */
  startDataSync: async (syncId: string): Promise<void> => {
    await api.post(`/vendor/integrations/data-syncs/${syncId}/start`);
  },

  /**
   * Cancel data sync
   */
  cancelDataSync: async (syncId: string): Promise<void> => {
    await api.post(`/vendor/integrations/data-syncs/${syncId}/cancel`);
  },

  /**
   * Retry failed sync records
   */
  retryFailedRecords: async (syncId: string) => {
    const { data } = await api.post(`/vendor/integrations/data-syncs/${syncId}/retry`);
    return data;
  },

  /**
   * Get marketplace connections
   */
  getMarketplaceConnections: async (): Promise<MarketplaceConnection[]> => {
    const { data } = await api.get('/vendor/integrations/marketplaces');
    return data;
  },

  /**
   * Connect to marketplace
   */
  connectMarketplace: async (connection: {
    marketplace: MarketplaceConnection['marketplace'];
    storeName: string;
    storeUrl?: string;
    credentials: MarketplaceConnection['credentials'];
    syncSettings: MarketplaceConnection['syncSettings'];
  }): Promise<MarketplaceConnection> => {
    const { data } = await api.post('/vendor/integrations/marketplaces', connection);
    return data;
  },

  /**
   * Update marketplace connection
   */
  updateMarketplaceConnection: async (
    connectionId: string,
    updates: Partial<MarketplaceConnection>
  ): Promise<MarketplaceConnection> => {
    const { data } = await api.put(`/vendor/integrations/marketplaces/${connectionId}`, updates);
    return data;
  },

  /**
   * Disconnect marketplace
   */
  disconnectMarketplace: async (connectionId: string): Promise<void> => {
    await api.delete(`/vendor/integrations/marketplaces/${connectionId}`);
  },

  /**
   * Sync marketplace data
   */
  syncMarketplaceData: async (connectionId: string, entity: string) => {
    const { data } = await api.post(`/vendor/integrations/marketplaces/${connectionId}/sync`, {
      entity,
    });
    return data;
  },

  /**
   * Get available third-party apps
   */
  getThirdPartyApps: async (
    category?: string,
    search?: string,
    page: number = 1,
    limit: number = 20
  ) => {
    const { data } = await api.get('/vendor/integrations/apps', {
      params: { category, search, page, limit },
    });
    return data;
  },

  /**
   * Get third-party app details
   */
  getThirdPartyApp: async (appId: string): Promise<ThirdPartyApp> => {
    const { data } = await api.get(`/vendor/integrations/apps/${appId}`);
    return data;
  },

  /**
   * Install third-party app
   */
  installThirdPartyApp: async (appId: string, config?: Record<string, any>) => {
    const { data } = await api.post(`/vendor/integrations/apps/${appId}/install`, { config });
    return data;
  },

  /**
   * Uninstall third-party app
   */
  uninstallThirdPartyApp: async (appId: string): Promise<void> => {
    await api.delete(`/vendor/integrations/apps/${appId}/install`);
  },

  /**
   * Get installed apps
   */
  getInstalledApps: async () => {
    const { data } = await api.get('/vendor/integrations/apps/installed');
    return data;
  },

  /**
   * Get integration metrics
   */
  getIntegrationMetrics: async (timeRange?: { from: string; to: string }) => {
    const { data } = await api.get('/vendor/integrations/metrics', {
      params: timeRange,
    });
    return data;
  },

  /**
   * Get available integration templates
   */
  getIntegrationTemplates: async (category?: string) => {
    const { data } = await api.get('/vendor/integrations/templates', {
      params: { category },
    });
    return data;
  },

  /**
   * Create integration from template
   */
  createFromTemplate: async (
    templateId: string,
    config: Record<string, any>
  ): Promise<Integration> => {
    const { data } = await api.post(`/vendor/integrations/templates/${templateId}/create`, config);
    return data;
  },

  /**
   * Validate integration configuration
   */
  validateConfiguration: async (
    provider: string,
    config: Record<string, any>
  ) => {
    const { data } = await api.post('/vendor/integrations/validate', {
      provider,
      config,
    });
    return data;
  },

  /**
   * Get integration health status
   */
  getIntegrationHealth: async () => {
    const { data } = await api.get('/vendor/integrations/health');
    return data;
  },

  /**
   * Export integration data
   */
  exportIntegrationData: async (
    integrationId: string,
    entity: string,
    format: 'csv' | 'xlsx' | 'json',
    filters?: Record<string, any>
  ) => {
    const { data } = await api.get(`/vendor/integrations/${integrationId}/export`, {
      params: { entity, format, ...filters },
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Import data via integration
   */
  importData: async (
    integrationId: string,
    entity: string,
    file: File,
    options?: {
      updateExisting?: boolean;
      validateOnly?: boolean;
      batchSize?: number;
    }
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entity', entity);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    const { data } = await api.post(`/vendor/integrations/${integrationId}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Get integration documentation
   */
  getIntegrationDocs: async (provider: string) => {
    const { data } = await api.get(`/vendor/integrations/docs/${provider}`);
    return data;
  },

  /**
   * Get webhook event types
   */
  getWebhookEvents: async () => {
    const { data } = await api.get('/vendor/integrations/webhook-events');
    return data;
  },

  /**
   * Get integration quotas and limits
   */
  getIntegrationLimits: async () => {
    const { data } = await api.get('/vendor/integrations/limits');
    return data;
  },
};

export default vendorIntegrationAPI;