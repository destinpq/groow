/**
 * IoT Analytics API Services
 * Real-time analytics, insights, and business intelligence for IoT data
 */
import { api } from './client';

export interface AnalyticsMetric {
  id: string;
  name: string;
  description: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary' | 'rate' | 'trend';
  category: 'performance' | 'efficiency' | 'usage' | 'health' | 'security' | 'environmental' | 'business' | 'custom';
  unit: string;
  formula?: string;
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'percentile' | 'stddev' | 'custom';
  dimensions: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date';
    cardinality: 'low' | 'medium' | 'high';
  }>;
  dataSource: {
    type: 'sensor' | 'device' | 'event' | 'api' | 'computed';
    configuration: {
      deviceIds?: string[];
      sensorTypes?: string[];
      eventTypes?: string[];
      apiEndpoints?: string[];
      computationScript?: string;
    };
    refreshInterval: number; // seconds
  };
  thresholds: Array<{
    condition: 'gt' | 'lt' | 'eq' | 'between';
    value: number | { min: number; max: number };
    severity: 'info' | 'warning' | 'critical';
    action: 'alert' | 'notification' | 'automation' | 'none';
  }>;
  visualization: {
    chartType: 'line' | 'bar' | 'pie' | 'gauge' | 'heatmap' | 'scatter' | 'area' | 'table';
    colorScheme?: string;
    displayOptions?: Record<string, any>;
  };
  retention: {
    rawData: number; // days
    aggregatedData: number; // days
    archivePolicy?: string;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    favorite: boolean;
  };
}

export interface AnalyticsDashboard {
  id: string;
  name: string;
  description: string;
  category: 'operational' | 'executive' | 'technical' | 'security' | 'energy' | 'maintenance' | 'custom';
  widgets: Array<{
    id: string;
    type: 'metric' | 'chart' | 'table' | 'alert_list' | 'kpi' | 'map' | 'iframe' | 'text';
    title: string;
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    configuration: {
      metricId?: string;
      timeRange?: {
        type: 'relative' | 'absolute';
        value: string | { start: string; end: string };
      };
      aggregation?: string;
      filters?: Record<string, any>;
      chartOptions?: Record<string, any>;
      refreshInterval?: number;
      customQuery?: string;
    };
    styling: {
      backgroundColor?: string;
      textColor?: string;
      borderColor?: string;
      fontSize?: string;
      padding?: string;
    };
  }>;
  layout: {
    gridSize: number;
    responsive: boolean;
    autoRefresh: boolean;
    refreshInterval: number; // seconds
  };
  filters: Array<{
    name: string;
    type: 'dropdown' | 'date_range' | 'text' | 'multi_select';
    options?: string[];
    defaultValue?: any;
    appliesToWidgets: string[];
  }>;
  permissions: {
    view: string[];
    edit: string[];
    share: string[];
  };
  sharing: {
    public: boolean;
    publicUrl?: string;
    embeddable: boolean;
    embedCode?: string;
    expiresAt?: string;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    lastViewed?: string;
    viewCount: number;
    tags: string[];
    favorite: boolean;
  };
}

export interface AnalyticsReport {
  id: string;
  name: string;
  description: string;
  type: 'scheduled' | 'on_demand' | 'triggered' | 'real_time';
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'html';
  template: {
    sections: Array<{
      id: string;
      title: string;
      type: 'summary' | 'chart' | 'table' | 'text' | 'metrics' | 'analysis';
      content: {
        metricIds?: string[];
        dashboardId?: string;
        customQuery?: string;
        textContent?: string;
        chartConfiguration?: Record<string, any>;
      };
      styling?: Record<string, any>;
    }>;
    header?: {
      title: string;
      subtitle?: string;
      logo?: string;
      timestamp: boolean;
    };
    footer?: {
      content: string;
      pageNumbers: boolean;
    };
  };
  schedule?: {
    enabled: boolean;
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
    time?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    timezone?: string;
  };
  triggers?: Array<{
    type: 'threshold' | 'anomaly' | 'event' | 'api';
    configuration: Record<string, any>;
  }>;
  distribution: {
    recipients: Array<{
      type: 'email' | 'webhook' | 'sftp' | 'storage';
      address: string;
      format?: string;
    }>;
    retentionDays: number;
    archiveLocation?: string;
  };
  lastGenerated?: string;
  nextScheduled?: string;
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
  };
}

export interface AnalyticsQuery {
  id: string;
  name: string;
  description: string;
  query: {
    type: 'sql' | 'nosql' | 'timeseries' | 'graph';
    statement: string;
    parameters?: Record<string, any>;
    timeRange?: {
      start: string;
      end: string;
    };
    aggregation?: {
      interval: string;
      function: string;
      groupBy?: string[];
    };
    filters?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
    limit?: number;
    orderBy?: Array<{
      field: string;
      direction: 'asc' | 'desc';
    }>;
  };
  dataSource: {
    type: 'real_time' | 'historical' | 'archive' | 'external';
    connection: string;
    tables?: string[];
    indices?: string[];
  };
  optimization: {
    cached: boolean;
    cacheTimeout?: number;
    indexHints?: string[];
    partitionPruning?: boolean;
  };
  results: {
    columns: Array<{
      name: string;
      type: string;
      format?: string;
    }>;
    rows?: any[][];
    rowCount?: number;
    executionTime?: number;
    dataSize?: number;
  };
  schedule?: {
    enabled: boolean;
    frequency: string;
    retentionDays: number;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    lastExecuted?: string;
    executionCount: number;
    tags: string[];
  };
}

export interface AnalyticsAlert {
  id: string;
  name: string;
  description: string;
  type: 'threshold' | 'anomaly' | 'trend' | 'pattern' | 'comparison' | 'custom';
  status: 'active' | 'paused' | 'resolved' | 'muted';
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  condition: {
    metricId?: string;
    query?: string;
    operator: 'gt' | 'lt' | 'eq' | 'ne' | 'increase' | 'decrease' | 'anomaly';
    threshold?: number;
    comparison?: {
      period: 'previous_hour' | 'previous_day' | 'previous_week' | 'same_day_last_week';
      changePercent?: number;
    };
    timeWindow: number; // minutes
    evaluationInterval: number; // minutes
  };
  actions: Array<{
    type: 'email' | 'sms' | 'webhook' | 'slack' | 'teams' | 'automation';
    configuration: {
      recipients?: string[];
      webhookUrl?: string;
      message?: string;
      automationRuleId?: string;
    };
    delay?: number; // minutes
    throttling?: {
      enabled: boolean;
      interval: number; // minutes
      maxNotifications: number;
    };
  }>;
  escalation?: {
    enabled: boolean;
    levels: Array<{
      level: number;
      delay: number; // minutes
      actions: Array<any>;
    }>;
  };
  suppressionRules?: Array<{
    condition: string;
    duration: number; // minutes
  }>;
  history: Array<{
    id: string;
    timestamp: string;
    status: 'triggered' | 'resolved' | 'escalated';
    value: number;
    message: string;
    actionsTaken: string[];
  }>;
  statistics: {
    totalTriggers: number;
    lastTriggered?: string;
    averageResolutionTime: number;
    falsePositives: number;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
  };
}

export interface AnalyticsInsight {
  id: string;
  type: 'correlation' | 'prediction' | 'anomaly' | 'optimization' | 'pattern' | 'recommendation';
  category: 'performance' | 'cost' | 'efficiency' | 'maintenance' | 'security' | 'usage';
  title: string;
  description: string;
  confidence: number; // 0-1
  severity: 'low' | 'medium' | 'high' | 'critical';
  data: {
    metrics: string[];
    timeRange: { start: string; end: string };
    values: Record<string, any>;
    correlations?: Array<{
      metric1: string;
      metric2: string;
      correlation: number;
      significance: number;
    }>;
    predictions?: Array<{
      metric: string;
      predicted: number;
      actual?: number;
      accuracy?: number;
      horizon: string;
    }>;
    anomalies?: Array<{
      metric: string;
      timestamp: string;
      value: number;
      expected: number;
      deviation: number;
    }>;
    recommendations?: Array<{
      action: string;
      impact: string;
      confidence: number;
      priority: number;
    }>;
  };
  actions: Array<{
    type: 'investigate' | 'optimize' | 'alert' | 'automate' | 'ignore';
    description: string;
    estimatedImpact: string;
  }>;
  status: 'new' | 'investigating' | 'acting' | 'resolved' | 'ignored';
  assignee?: string;
  notes?: Array<{
    author: string;
    timestamp: string;
    content: string;
  }>;
  metadata: {
    generatedBy: 'ml_model' | 'rule_engine' | 'user' | 'api';
    generatedAt: string;
    model?: {
      name: string;
      version: string;
      accuracy: number;
    };
    tags: string[];
  };
}

export interface AnalyticsModel {
  id: string;
  name: string;
  description: string;
  type: 'regression' | 'classification' | 'clustering' | 'anomaly_detection' | 'forecasting' | 'optimization';
  algorithm: 'linear_regression' | 'random_forest' | 'neural_network' | 'svm' | 'kmeans' | 'isolation_forest' | 'arima' | 'lstm';
  status: 'training' | 'trained' | 'deployed' | 'evaluating' | 'failed' | 'deprecated';
  configuration: {
    features: Array<{
      name: string;
      type: 'numerical' | 'categorical' | 'text' | 'datetime';
      preprocessing?: string[];
      importance?: number;
    }>;
    target?: {
      name: string;
      type: string;
    };
    hyperparameters: Record<string, any>;
    validation: {
      method: 'train_test_split' | 'cross_validation' | 'time_series_split';
      testSize: number;
      folds?: number;
    };
  };
  training: {
    dataSource: string;
    dataRange: { start: string; end: string };
    trainedAt?: string;
    trainingTime?: number; // seconds
    sampleSize: number;
    iterations?: number;
  };
  performance: {
    metrics: Record<string, number>;
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    mse?: number;
    rmse?: number;
    mae?: number;
    r2Score?: number;
    confusionMatrix?: number[][];
    featureImportance?: Array<{
      feature: string;
      importance: number;
    }>;
  };
  deployment: {
    endpoint?: string;
    version: string;
    deployedAt?: string;
    scalingConfig?: {
      minInstances: number;
      maxInstances: number;
      targetUtilization: number;
    };
    monitoring: {
      drift: boolean;
      performance: boolean;
      latency: boolean;
    };
  };
  usage: {
    predictions: number;
    lastUsed?: string;
    averageLatency: number;
    errorRate: number;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    tags: string[];
  };
}

export const iotAnalyticsAPI = {
  /**
   * Create analytics metric
   */
  createMetric: async (
    metricData: Omit<AnalyticsMetric, 'id' | 'metadata'>
  ): Promise<AnalyticsMetric> => {
    const { data } = await api.post('/iot/analytics/metrics', metricData);
    return data;
  },

  /**
   * Get analytics metrics
   */
  getMetrics: async (
    filters?: {
      category?: AnalyticsMetric['category'];
      type?: AnalyticsMetric['type'];
      tags?: string[];
      dataSourceType?: string;
    }
  ): Promise<AnalyticsMetric[]> => {
    const { data } = await api.get('/iot/analytics/metrics', { params: filters });
    return data;
  },

  /**
   * Get metric details
   */
  getMetric: async (metricId: string): Promise<AnalyticsMetric> => {
    const { data } = await api.get(`/iot/analytics/metrics/${metricId}`);
    return data;
  },

  /**
   * Update metric
   */
  updateMetric: async (
    metricId: string,
    updates: Partial<AnalyticsMetric>
  ): Promise<AnalyticsMetric> => {
    const { data } = await api.put(`/iot/analytics/metrics/${metricId}`, updates);
    return data;
  },

  /**
   * Delete metric
   */
  deleteMetric: async (metricId: string): Promise<void> => {
    await api.delete(`/iot/analytics/metrics/${metricId}`);
  },

  /**
   * Get metric data
   */
  getMetricData: async (
    metricId: string,
    timeRange: { start: string; end: string },
    aggregation?: {
      interval: string;
      function?: string;
      groupBy?: string[];
    }
  ): Promise<{
    metric: AnalyticsMetric;
    data: Array<{
      timestamp: string;
      value: number;
      dimensions?: Record<string, any>;
    }>;
    statistics: {
      min: number;
      max: number;
      avg: number;
      sum: number;
      count: number;
    };
  }> => {
    const { data } = await api.get(`/iot/analytics/metrics/${metricId}/data`, {
      params: { ...timeRange, aggregation },
    });
    return data;
  },

  /**
   * Create dashboard
   */
  createDashboard: async (
    dashboardData: Omit<AnalyticsDashboard, 'id' | 'metadata'>
  ): Promise<AnalyticsDashboard> => {
    const { data } = await api.post('/iot/analytics/dashboards', dashboardData);
    return data;
  },

  /**
   * Get dashboards
   */
  getDashboards: async (
    filters?: {
      category?: AnalyticsDashboard['category'];
      tags?: string[];
      createdBy?: string;
    }
  ): Promise<AnalyticsDashboard[]> => {
    const { data } = await api.get('/iot/analytics/dashboards', { params: filters });
    return data;
  },

  /**
   * Get dashboard details
   */
  getDashboard: async (dashboardId: string): Promise<AnalyticsDashboard> => {
    const { data } = await api.get(`/iot/analytics/dashboards/${dashboardId}`);
    return data;
  },

  /**
   * Update dashboard
   */
  updateDashboard: async (
    dashboardId: string,
    updates: Partial<AnalyticsDashboard>
  ): Promise<AnalyticsDashboard> => {
    const { data } = await api.put(`/iot/analytics/dashboards/${dashboardId}`, updates);
    return data;
  },

  /**
   * Delete dashboard
   */
  deleteDashboard: async (dashboardId: string): Promise<void> => {
    await api.delete(`/iot/analytics/dashboards/${dashboardId}`);
  },

  /**
   * Get dashboard data
   */
  getDashboardData: async (
    dashboardId: string,
    filters?: Record<string, any>
  ): Promise<{
    dashboard: AnalyticsDashboard;
    widgetData: Record<string, any>;
    lastUpdated: string;
  }> => {
    const { data } = await api.get(`/iot/analytics/dashboards/${dashboardId}/data`, {
      params: filters,
    });
    return data;
  },

  /**
   * Share dashboard
   */
  shareDashboard: async (
    dashboardId: string,
    settings: {
      public?: boolean;
      embeddable?: boolean;
      expiresAt?: string;
      permissions?: string[];
    }
  ): Promise<{
    publicUrl?: string;
    embedCode?: string;
    shareId: string;
  }> => {
    const { data } = await api.post(`/iot/analytics/dashboards/${dashboardId}/share`, settings);
    return data;
  },

  /**
   * Create report
   */
  createReport: async (
    reportData: Omit<AnalyticsReport, 'id' | 'lastGenerated' | 'nextScheduled' | 'metadata'>
  ): Promise<AnalyticsReport> => {
    const { data } = await api.post('/iot/analytics/reports', reportData);
    return data;
  },

  /**
   * Get reports
   */
  getReports: async (
    filters?: {
      type?: AnalyticsReport['type'];
      format?: AnalyticsReport['format'];
      tags?: string[];
    }
  ): Promise<AnalyticsReport[]> => {
    const { data } = await api.get('/iot/analytics/reports', { params: filters });
    return data;
  },

  /**
   * Get report details
   */
  getReport: async (reportId: string): Promise<AnalyticsReport> => {
    const { data } = await api.get(`/iot/analytics/reports/${reportId}`);
    return data;
  },

  /**
   * Generate report
   */
  generateReport: async (
    reportId: string,
    options?: {
      timeRange?: { start: string; end: string };
      filters?: Record<string, any>;
      format?: string;
    }
  ): Promise<{
    reportId: string;
    jobId: string;
    status: 'queued' | 'generating' | 'completed' | 'failed';
    downloadUrl?: string;
  }> => {
    const { data } = await api.post(`/iot/analytics/reports/${reportId}/generate`, options);
    return data;
  },

  /**
   * Download report
   */
  downloadReport: async (
    reportId: string,
    jobId: string
  ): Promise<Blob> => {
    const { data } = await api.get(`/iot/analytics/reports/${reportId}/download/${jobId}`, {
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Execute analytics query
   */
  executeQuery: async (
    query: Omit<AnalyticsQuery, 'id' | 'results' | 'metadata'>
  ): Promise<AnalyticsQuery> => {
    const { data } = await api.post('/iot/analytics/queries/execute', query);
    return data;
  },

  /**
   * Save query
   */
  saveQuery: async (
    queryData: Omit<AnalyticsQuery, 'id' | 'metadata'>
  ): Promise<AnalyticsQuery> => {
    const { data } = await api.post('/iot/analytics/queries', queryData);
    return data;
  },

  /**
   * Get saved queries
   */
  getQueries: async (
    filters?: {
      type?: string;
      tags?: string[];
      createdBy?: string;
    }
  ): Promise<AnalyticsQuery[]> => {
    const { data } = await api.get('/iot/analytics/queries', { params: filters });
    return data;
  },

  /**
   * Get query details
   */
  getQuery: async (queryId: string): Promise<AnalyticsQuery> => {
    const { data } = await api.get(`/iot/analytics/queries/${queryId}`);
    return data;
  },

  /**
   * Create alert
   */
  createAlert: async (
    alertData: Omit<AnalyticsAlert, 'id' | 'history' | 'statistics' | 'metadata'>
  ): Promise<AnalyticsAlert> => {
    const { data } = await api.post('/iot/analytics/alerts', alertData);
    return data;
  },

  /**
   * Get alerts
   */
  getAlerts: async (
    filters?: {
      status?: AnalyticsAlert['status'];
      severity?: AnalyticsAlert['severity'];
      type?: AnalyticsAlert['type'];
    }
  ): Promise<AnalyticsAlert[]> => {
    const { data } = await api.get('/iot/analytics/alerts', { params: filters });
    return data;
  },

  /**
   * Get alert details
   */
  getAlert: async (alertId: string): Promise<AnalyticsAlert> => {
    const { data } = await api.get(`/iot/analytics/alerts/${alertId}`);
    return data;
  },

  /**
   * Update alert
   */
  updateAlert: async (
    alertId: string,
    updates: Partial<AnalyticsAlert>
  ): Promise<AnalyticsAlert> => {
    const { data } = await api.put(`/iot/analytics/alerts/${alertId}`, updates);
    return data;
  },

  /**
   * Acknowledge alert
   */
  acknowledgeAlert: async (
    alertId: string,
    note?: string
  ): Promise<AnalyticsAlert> => {
    const { data } = await api.post(`/iot/analytics/alerts/${alertId}/acknowledge`, { note });
    return data;
  },

  /**
   * Resolve alert
   */
  resolveAlert: async (
    alertId: string,
    resolution: string
  ): Promise<AnalyticsAlert> => {
    const { data } = await api.post(`/iot/analytics/alerts/${alertId}/resolve`, { resolution });
    return data;
  },

  /**
   * Get insights
   */
  getInsights: async (
    filters?: {
      type?: AnalyticsInsight['type'];
      category?: AnalyticsInsight['category'];
      severity?: AnalyticsInsight['severity'];
      status?: AnalyticsInsight['status'];
      from?: string;
      to?: string;
    }
  ): Promise<AnalyticsInsight[]> => {
    const { data } = await api.get('/iot/analytics/insights', { params: filters });
    return data;
  },

  /**
   * Get insight details
   */
  getInsight: async (insightId: string): Promise<AnalyticsInsight> => {
    const { data } = await api.get(`/iot/analytics/insights/${insightId}`);
    return data;
  },

  /**
   * Update insight status
   */
  updateInsightStatus: async (
    insightId: string,
    status: AnalyticsInsight['status'],
    note?: string
  ): Promise<AnalyticsInsight> => {
    const { data } = await api.put(`/iot/analytics/insights/${insightId}/status`, {
      status,
      note,
    });
    return data;
  },

  /**
   * Generate insights
   */
  generateInsights: async (
    configuration: {
      timeRange: { start: string; end: string };
      metrics?: string[];
      categories?: string[];
      types?: string[];
      minConfidence?: number;
    }
  ): Promise<{
    jobId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post('/iot/analytics/insights/generate', configuration);
    return data;
  },

  /**
   * Create ML model
   */
  createModel: async (
    modelData: Omit<AnalyticsModel, 'id' | 'status' | 'training' | 'performance' | 'deployment' | 'usage' | 'metadata'>
  ): Promise<AnalyticsModel> => {
    const { data } = await api.post('/iot/analytics/models', modelData);
    return data;
  },

  /**
   * Get ML models
   */
  getModels: async (
    filters?: {
      type?: AnalyticsModel['type'];
      algorithm?: AnalyticsModel['algorithm'];
      status?: AnalyticsModel['status'];
    }
  ): Promise<AnalyticsModel[]> => {
    const { data } = await api.get('/iot/analytics/models', { params: filters });
    return data;
  },

  /**
   * Get model details
   */
  getModel: async (modelId: string): Promise<AnalyticsModel> => {
    const { data } = await api.get(`/iot/analytics/models/${modelId}`);
    return data;
  },

  /**
   * Train model
   */
  trainModel: async (
    modelId: string,
    trainingConfig?: {
      dataRange?: { start: string; end: string };
      hyperparameters?: Record<string, any>;
      validationSplit?: number;
    }
  ): Promise<{
    jobId: string;
    status: 'queued' | 'training' | 'completed' | 'failed';
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post(`/iot/analytics/models/${modelId}/train`, trainingConfig);
    return data;
  },

  /**
   * Deploy model
   */
  deployModel: async (
    modelId: string,
    deploymentConfig?: {
      environment?: 'staging' | 'production';
      scalingConfig?: Record<string, any>;
      monitoring?: Record<string, boolean>;
    }
  ): Promise<AnalyticsModel> => {
    const { data } = await api.post(`/iot/analytics/models/${modelId}/deploy`, deploymentConfig);
    return data;
  },

  /**
   * Make prediction
   */
  predict: async (
    modelId: string,
    features: Record<string, any>
  ): Promise<{
    prediction: any;
    confidence?: number;
    probability?: number[];
    explanation?: Array<{
      feature: string;
      contribution: number;
    }>;
  }> => {
    const { data } = await api.post(`/iot/analytics/models/${modelId}/predict`, { features });
    return data;
  },

  /**
   * Get analytics overview
   */
  getOverview: async (
    timeRange?: { start: string; end: string }
  ): Promise<{
    summary: {
      totalMetrics: number;
      activeDashboards: number;
      scheduledReports: number;
      activeAlerts: number;
      recentInsights: number;
      deployedModels: number;
    };
    recentActivity: Array<{
      type: string;
      description: string;
      timestamp: string;
      severity?: string;
    }>;
    systemHealth: {
      dataIngestion: { status: string; rate: number };
      queryPerformance: { avgLatency: number; errorRate: number };
      storage: { usage: number; capacity: number };
      compute: { utilization: number; capacity: number };
    };
    topMetrics: Array<{
      metric: AnalyticsMetric;
      currentValue: number;
      trend: 'up' | 'down' | 'stable';
      change: number;
    }>;
  }> => {
    const { data } = await api.get('/iot/analytics/overview', {
      params: timeRange,
    });
    return data;
  },

  /**
   * Export analytics data
   */
  exportData: async (
    request: {
      type: 'metrics' | 'dashboard' | 'report' | 'query_results';
      ids: string[];
      format: 'csv' | 'json' | 'excel' | 'parquet';
      timeRange?: { start: string; end: string };
      filters?: Record<string, any>;
    }
  ): Promise<Blob> => {
    const { data } = await api.post('/iot/analytics/export', request, {
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Get data catalog
   */
  getDataCatalog: async (): Promise<{
    tables: Array<{
      name: string;
      description: string;
      schema: Array<{
        column: string;
        type: string;
        description: string;
      }>;
      rowCount: number;
      lastUpdated: string;
    }>;
    views: Array<{
      name: string;
      description: string;
      definition: string;
    }>;
    functions: Array<{
      name: string;
      description: string;
      parameters: string[];
      returnType: string;
    }>;
  }> => {
    const { data } = await api.get('/iot/analytics/catalog');
    return data;
  },
};

export default iotAnalyticsAPI;