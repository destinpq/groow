import api from './client';

// ========================================
// Inventory Alerts Types
// ========================================

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImage?: string;
  alertType: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiration' | 'reorder_point' | 'custom';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  currentStock: number;
  threshold: number;
  recommendedAction: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  metadata?: Record<string, any>;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  alertType: InventoryAlert['alertType'];
  conditions: AlertCondition[];
  actions: AlertAction[];
  scope: 'all_products' | 'category' | 'specific_products';
  categoryIds?: string[];
  productIds?: string[];
  priority: number;
  cooldownPeriod: number; // in minutes
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastTriggered?: string;
  triggerCount: number;
}

export interface AlertCondition {
  id: string;
  field: 'stock_quantity' | 'days_until_expiry' | 'turnover_rate' | 'stock_value' | 'custom';
  operator: 'less_than' | 'greater_than' | 'equal_to' | 'between' | 'percentage_below';
  value: number;
  secondValue?: number; // for between operator
  unit?: 'units' | 'days' | 'percentage' | 'currency';
}

export interface AlertAction {
  id: string;
  type: 'email' | 'sms' | 'push_notification' | 'webhook' | 'create_purchase_order' | 'update_status';
  config: AlertActionConfig;
  isEnabled: boolean;
}

export interface AlertActionConfig {
  // Email action
  recipients?: string[];
  subject?: string;
  template?: string;
  
  // SMS action
  phoneNumbers?: string[];
  messageTemplate?: string;
  
  // Webhook action
  url?: string;
  method?: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  payload?: Record<string, any>;
  
  // Purchase order action
  supplierId?: string;
  quantity?: number;
  priorityLevel?: 'normal' | 'urgent';
  
  // Status update action
  newStatus?: string;
  addTags?: string[];
}

export interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'slack' | 'webhook' | 'push';
  config: NotificationChannelConfig;
  isActive: boolean;
  isDefault: boolean;
  testStatus: 'pending' | 'success' | 'failed';
  lastUsed?: string;
  usageCount: number;
}

export interface NotificationChannelConfig {
  // Email
  smtpHost?: string;
  smtpPort?: number;
  username?: string;
  password?: string;
  fromEmail?: string;
  
  // SMS
  provider?: 'twilio' | 'nexmo' | 'aws_sns';
  apiKey?: string;
  apiSecret?: string;
  fromNumber?: string;
  
  // Slack
  webhookUrl?: string;
  channel?: string;
  
  // Webhook
  endpoint?: string;
  method?: string;
  headers?: Record<string, string>;
  
  // Push notifications
  fcmServerKey?: string;
  apnsCertificate?: string;
}

export interface InventoryThreshold {
  id: string;
  productId: string;
  productName: string;
  lowStockThreshold: number;
  reorderPoint: number;
  maxStockLevel: number;
  optimalStockLevel: number;
  leadTime: number; // in days
  averageDailySales: number;
  safetyStock: number;
  isAutoReorderEnabled: boolean;
  supplierId?: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface AlertStats {
  totalAlerts: number;
  activeAlerts: number;
  acknowledgedAlerts: number;
  resolvedAlerts: number;
  criticalAlerts: number;
  highAlerts: number;
  mediumAlerts: number;
  lowAlerts: number;
  alertsByType: Record<string, number>;
  alertTrends: AlertTrendData[];
  responseTime: {
    average: number;
    median: number;
  };
  resolutionRate: number;
}

export interface AlertTrendData {
  date: string;
  totalAlerts: number;
  resolvedAlerts: number;
  averageResponseTime: number;
}

export interface AlertFilters {
  alertType?: InventoryAlert['alertType'];
  severity?: InventoryAlert['severity'];
  status?: InventoryAlert['status'];
  productId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  acknowledgedBy?: string;
  sortBy?: 'createdAt' | 'severity' | 'productName' | 'currentStock';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface BulkAlertAction {
  alertIds: string[];
  action: 'acknowledge' | 'resolve' | 'dismiss' | 'change_severity';
  reason?: string;
  newSeverity?: InventoryAlert['severity'];
}

// ========================================
// Inventory Alerts API Service
// ========================================

export const inventoryAlertsAPI = {
  // ========================================
  // Alerts CRUD Operations
  // ========================================
  
  getAlerts: async (filters?: AlertFilters): Promise<{
    alerts: InventoryAlert[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await api.get('/inventory/alerts', {
      params: filters,
    });
    return response.data;
  },

  getAlert: async (id: string): Promise<InventoryAlert> => {
    const response = await api.get(`/inventory/alerts/${id}`);
    return response.data;
  },

  acknowledgeAlert: async (id: string, reason?: string): Promise<InventoryAlert> => {
    const response = await api.post(`/inventory/alerts/${id}/acknowledge`, { reason });
    return response.data;
  },

  resolveAlert: async (id: string, resolution: string): Promise<InventoryAlert> => {
    const response = await api.post(`/inventory/alerts/${id}/resolve`, { resolution });
    return response.data;
  },

  dismissAlert: async (id: string, reason: string): Promise<InventoryAlert> => {
    const response = await api.post(`/inventory/alerts/${id}/dismiss`, { reason });
    return response.data;
  },

  updateAlertSeverity: async (id: string, severity: InventoryAlert['severity']): Promise<InventoryAlert> => {
    const response = await api.put(`/inventory/alerts/${id}/severity`, { severity });
    return response.data;
  },

  // ========================================
  // Alert Rules Management
  // ========================================

  getRules: async (): Promise<AlertRule[]> => {
    const response = await api.get('/inventory/alert-rules');
    return response.data;
  },

  getRule: async (id: string): Promise<AlertRule> => {
    const response = await api.get(`/inventory/alert-rules/${id}`);
    return response.data;
  },

  createRule: async (ruleData: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt' | 'triggerCount' | 'createdBy'>): Promise<AlertRule> => {
    const response = await api.post('/inventory/alert-rules', ruleData);
    return response.data;
  },

  updateRule: async (id: string, updateData: Partial<AlertRule>): Promise<AlertRule> => {
    const response = await api.put(`/inventory/alert-rules/${id}`, updateData);
    return response.data;
  },

  deleteRule: async (id: string): Promise<void> => {
    await api.delete(`/inventory/alert-rules/${id}`);
  },

  toggleRule: async (id: string, isActive: boolean): Promise<AlertRule> => {
    const response = await api.post(`/inventory/alert-rules/${id}/toggle`, { isActive });
    return response.data;
  },

  testRule: async (id: string): Promise<{ matched: number; alerts: InventoryAlert[] }> => {
    const response = await api.post(`/inventory/alert-rules/${id}/test`);
    return response.data;
  },

  // ========================================
  // Thresholds Management
  // ========================================

  getThresholds: async (productIds?: string[]): Promise<InventoryThreshold[]> => {
    const response = await api.get('/inventory/thresholds', {
      params: { productIds: productIds?.join(',') },
    });
    return response.data;
  },

  getThreshold: async (productId: string): Promise<InventoryThreshold> => {
    const response = await api.get(`/inventory/thresholds/${productId}`);
    return response.data;
  },

  setThreshold: async (thresholdData: Omit<InventoryThreshold, 'id' | 'lastUpdated' | 'updatedBy'>): Promise<InventoryThreshold> => {
    const response = await api.post('/inventory/thresholds', thresholdData);
    return response.data;
  },

  updateThreshold: async (productId: string, updateData: Partial<InventoryThreshold>): Promise<InventoryThreshold> => {
    const response = await api.put(`/inventory/thresholds/${productId}`, updateData);
    return response.data;
  },

  deleteThreshold: async (productId: string): Promise<void> => {
    await api.delete(`/inventory/thresholds/${productId}`);
  },

  bulkUpdateThresholds: async (updates: { productId: string; thresholds: Partial<InventoryThreshold> }[]): Promise<{
    updated: number;
    failed: string[];
  }> => {
    const response = await api.post('/inventory/thresholds/bulk-update', { updates });
    return response.data;
  },

  // ========================================
  // Notification Channels
  // ========================================

  getChannels: async (): Promise<NotificationChannel[]> => {
    const response = await api.get('/inventory/notification-channels');
    return response.data;
  },

  createChannel: async (channelData: Omit<NotificationChannel, 'id' | 'lastUsed' | 'usageCount' | 'testStatus'>): Promise<NotificationChannel> => {
    const response = await api.post('/inventory/notification-channels', channelData);
    return response.data;
  },

  updateChannel: async (id: string, updateData: Partial<NotificationChannel>): Promise<NotificationChannel> => {
    const response = await api.put(`/inventory/notification-channels/${id}`, updateData);
    return response.data;
  },

  deleteChannel: async (id: string): Promise<void> => {
    await api.delete(`/inventory/notification-channels/${id}`);
  },

  testChannel: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/inventory/notification-channels/${id}/test`);
    return response.data;
  },

  setDefaultChannel: async (id: string): Promise<NotificationChannel> => {
    const response = await api.post(`/inventory/notification-channels/${id}/set-default`);
    return response.data;
  },

  // ========================================
  // Analytics and Statistics
  // ========================================

  getStats: async (dateRange?: { start: string; end: string }): Promise<AlertStats> => {
    const response = await api.get('/inventory/alerts/stats', {
      params: dateRange,
    });
    return response.data;
  },

  getAlertTrends: async (days: number = 30): Promise<AlertTrendData[]> => {
    const response = await api.get('/inventory/alerts/trends', {
      params: { days },
    });
    return response.data;
  },

  getTopAlertedProducts: async (limit: number = 10): Promise<{
    productId: string;
    productName: string;
    alertCount: number;
    lastAlert: string;
    severity: InventoryAlert['severity'];
  }[]> => {
    const response = await api.get('/inventory/alerts/top-products', {
      params: { limit },
    });
    return response.data;
  },

  // ========================================
  // Bulk Operations
  // ========================================

  bulkAction: async (action: BulkAlertAction): Promise<{
    processed: number;
    failed: string[];
    results: InventoryAlert[];
  }> => {
    const response = await api.post('/inventory/alerts/bulk-action', action);
    return response.data;
  },

  bulkAcknowledge: async (alertIds: string[], reason?: string): Promise<{
    acknowledged: number;
    failed: string[];
  }> => {
    const response = await api.post('/inventory/alerts/bulk-acknowledge', { alertIds, reason });
    return response.data;
  },

  bulkResolve: async (alertIds: string[], resolution: string): Promise<{
    resolved: number;
    failed: string[];
  }> => {
    const response = await api.post('/inventory/alerts/bulk-resolve', { alertIds, resolution });
    return response.data;
  },

  // ========================================
  // Real-time Operations
  // ========================================

  checkNow: async (productIds?: string[]): Promise<{
    checked: number;
    newAlerts: number;
    alerts: InventoryAlert[];
  }> => {
    const response = await api.post('/inventory/alerts/check-now', { productIds });
    return response.data;
  },

  getRealtimeUpdates: async (lastUpdate?: string): Promise<{
    alerts: InventoryAlert[];
    timestamp: string;
    hasMore: boolean;
  }> => {
    const response = await api.get('/inventory/alerts/realtime', {
      params: { lastUpdate },
    });
    return response.data;
  },

  // ========================================
  // Export and Reporting
  // ========================================

  exportAlerts: async (filters?: AlertFilters, format: 'csv' | 'xlsx' | 'json' = 'csv'): Promise<Blob> => {
    const response = await api.get('/inventory/alerts/export', {
      params: { ...filters, format },
      responseType: 'blob',
    });
    return response.data;
  },

  generateReport: async (options: {
    type: 'summary' | 'detailed' | 'trends' | 'performance';
    dateRange: { start: string; end: string };
    format: 'pdf' | 'excel' | 'csv';
    includeCharts?: boolean;
    filters?: AlertFilters;
  }): Promise<Blob> => {
    const response = await api.post('/inventory/alerts/reports', options, {
      responseType: 'blob',
    });
    return response.data;
  },

  // ========================================
  // Smart Suggestions
  // ========================================

  getThresholdSuggestions: async (productId: string): Promise<{
    suggestedLowStock: number;
    suggestedReorderPoint: number;
    suggestedMaxStock: number;
    rationale: string;
    confidence: number;
  }> => {
    const response = await api.get(`/inventory/alerts/threshold-suggestions/${productId}`);
    return response.data;
  },

  getOptimizationSuggestions: async (): Promise<{
    suggestions: {
      type: 'reduce_threshold' | 'increase_threshold' | 'enable_auto_reorder' | 'add_safety_stock';
      productId: string;
      productName: string;
      currentValue: number;
      suggestedValue: number;
      expectedImpact: string;
      confidence: number;
    }[];
    potentialSavings: number;
  }> => {
    const response = await api.get('/inventory/alerts/optimization-suggestions');
    return response.data;
  },

  // ========================================
  // Settings and Configuration
  // ========================================

  getSettings: async (): Promise<{
    globalLowStockPercentage: number;
    defaultReorderMultiplier: number;
    alertRetentionDays: number;
    enableAutoResolution: boolean;
    defaultNotificationChannels: string[];
    businessHours: {
      start: string;
      end: string;
      timezone: string;
      workdays: number[];
    };
  }> => {
    const response = await api.get('/inventory/alerts/settings');
    return response.data;
  },

  updateSettings: async (settings: any): Promise<void> => {
    await api.put('/inventory/alerts/settings', settings);
  },
};

export default inventoryAlertsAPI;