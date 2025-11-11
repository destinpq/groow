/**
 * Business Intelligence & Data Visualization API Services
 * Advanced analytics, KPIs, and business insights dashboard
 */
import { api } from './client';

export interface BusinessKPI {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'customer' | 'marketing' | 'sales' | 'inventory' | 'hr';
  value: number;
  target?: number;
  unit: string;
  formula: string;
  dataSource: string;
  frequency: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  trend: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    period: string;
  };
  status: 'on_track' | 'at_risk' | 'off_track' | 'achieved';
  owner: string;
  lastUpdated: string;
  history: Array<{
    date: string;
    value: number;
    target?: number;
  }>;
}

export interface DataVisualization {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'gauge' | 'funnel' | 'table' | 'map';
  description: string;
  dataSource: {
    type: 'api' | 'database' | 'file' | 'real_time';
    endpoint?: string;
    query?: string;
    refreshInterval?: number;
  };
  configuration: {
    xAxis?: {
      field: string;
      label: string;
      type: 'category' | 'time' | 'value';
    };
    yAxis?: {
      field: string;
      label: string;
      type: 'value' | 'percentage';
    };
    groupBy?: string;
    filters?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
    aggregation?: {
      function: 'sum' | 'avg' | 'count' | 'min' | 'max';
      field?: string;
    };
    colors?: string[];
    limits?: {
      maxItems: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    };
  };
  styling: {
    width: number;
    height: number;
    theme: string;
    showLegend: boolean;
    showLabels: boolean;
    showGrid: boolean;
  };
  permissions: {
    view: string[];
    edit: string[];
  };
  data?: any;
  lastUpdated?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessReport {
  id: string;
  title: string;
  description: string;
  category: 'executive' | 'operational' | 'financial' | 'sales' | 'marketing' | 'custom';
  type: 'automated' | 'ad_hoc' | 'scheduled';
  template: {
    sections: Array<{
      id: string;
      title: string;
      type: 'kpi' | 'chart' | 'table' | 'text' | 'image';
      content: {
        kpiIds?: string[];
        chartId?: string;
        query?: string;
        text?: string;
        imageUrl?: string;
      };
      styling?: {
        layout: 'full_width' | 'half_width' | 'third_width';
        backgroundColor?: string;
        textColor?: string;
      };
    }>;
    header?: {
      logo: string;
      title: string;
      subtitle: string;
      showDate: boolean;
    };
    footer?: {
      text: string;
      showPageNumbers: boolean;
    };
  };
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    time?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    timezone?: string;
  };
  distribution: {
    recipients: Array<{
      type: 'email' | 'slack' | 'webhook';
      address: string;
      format?: 'pdf' | 'html' | 'excel';
    }>;
  };
  lastGenerated?: string;
  nextScheduled?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface DataInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'correlation' | 'prediction' | 'opportunity' | 'risk';
  title: string;
  description: string;
  category: string;
  confidence: number; // 0-100
  impact: 'low' | 'medium' | 'high' | 'critical';
  data: {
    metrics: string[];
    values: Record<string, any>;
    timeRange: { start: string; end: string };
    correlations?: Array<{
      metric1: string;
      metric2: string;
      correlation: number;
    }>;
    predictions?: Array<{
      metric: string;
      predicted: number;
      confidence: number;
      timeFrame: string;
    }>;
  };
  recommendations: Array<{
    action: string;
    expectedOutcome: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  status: 'new' | 'reviewed' | 'acting' | 'implemented' | 'dismissed';
  assignee?: string;
  notes?: Array<{
    author: string;
    timestamp: string;
    content: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessForecast {
  id: string;
  name: string;
  metric: string;
  type: 'revenue' | 'sales' | 'customers' | 'inventory' | 'costs' | 'custom';
  timeHorizon: 'month' | 'quarter' | 'year';
  model: 'linear' | 'exponential' | 'seasonal' | 'arima' | 'prophet' | 'ml';
  predictions: Array<{
    period: string;
    predicted: number;
    confidence: {
      lower: number;
      upper: number;
    };
    factors: Array<{
      name: string;
      impact: number;
    }>;
  }>;
  accuracy: {
    mape: number; // Mean Absolute Percentage Error
    mae: number;  // Mean Absolute Error
    r2: number;   // R-squared
  };
  assumptions: string[];
  limitations: string[];
  lastTrained: string;
  createdAt: string;
  updatedAt: string;
}

export const businessIntelligenceAPI = {
  /**
   * Get business KPIs
   */
  getKPIs: async (
    filters?: {
      category?: string;
      owner?: string;
      status?: string;
      period?: string;
    }
  ): Promise<BusinessKPI[]> => {
    const { data } = await api.get('/bi/kpis', { params: filters });
    return data;
  },

  /**
   * Create KPI
   */
  createKPI: async (
    kpiData: Omit<BusinessKPI, 'id' | 'value' | 'trend' | 'status' | 'lastUpdated' | 'history'>
  ): Promise<BusinessKPI> => {
    const { data } = await api.post('/bi/kpis', kpiData);
    return data;
  },

  /**
   * Update KPI
   */
  updateKPI: async (
    kpiId: string,
    updates: Partial<BusinessKPI>
  ): Promise<BusinessKPI> => {
    const { data } = await api.put(`/bi/kpis/${kpiId}`, updates);
    return data;
  },

  /**
   * Get KPI details
   */
  getKPI: async (kpiId: string): Promise<BusinessKPI> => {
    const { data } = await api.get(`/bi/kpis/${kpiId}`);
    return data;
  },

  /**
   * Get visualizations
   */
  getVisualizations: async (
    filters?: {
      type?: string;
      category?: string;
      owner?: string;
    }
  ): Promise<DataVisualization[]> => {
    const { data } = await api.get('/bi/visualizations', { params: filters });
    return data;
  },

  /**
   * Create visualization
   */
  createVisualization: async (
    vizData: Omit<DataVisualization, 'id' | 'data' | 'lastUpdated' | 'createdAt' | 'updatedAt'>
  ): Promise<DataVisualization> => {
    const { data } = await api.post('/bi/visualizations', vizData);
    return data;
  },

  /**
   * Get visualization data
   */
  getVisualizationData: async (
    vizId: string,
    filters?: Record<string, any>
  ): Promise<{
    visualization: DataVisualization;
    data: any;
    metadata: {
      rowCount: number;
      lastUpdated: string;
      queryTime: number;
    };
  }> => {
    const { data } = await api.get(`/bi/visualizations/${vizId}/data`, {
      params: filters,
    });
    return data;
  },

  /**
   * Get business reports
   */
  getReports: async (
    filters?: {
      category?: string;
      type?: string;
      owner?: string;
    }
  ): Promise<BusinessReport[]> => {
    const { data } = await api.get('/bi/reports', { params: filters });
    return data;
  },

  /**
   * Generate report
   */
  generateReport: async (
    reportId: string,
    options?: {
      format?: 'pdf' | 'html' | 'excel';
      filters?: Record<string, any>;
      timeRange?: { start: string; end: string };
    }
  ): Promise<{
    reportId: string;
    jobId: string;
    status: 'queued' | 'generating' | 'completed' | 'failed';
    downloadUrl?: string;
  }> => {
    const { data } = await api.post(`/bi/reports/${reportId}/generate`, options);
    return data;
  },

  /**
   * Get data insights
   */
  getInsights: async (
    filters?: {
      type?: string;
      category?: string;
      impact?: string;
      status?: string;
      from?: string;
      to?: string;
    }
  ): Promise<DataInsight[]> => {
    const { data } = await api.get('/bi/insights', { params: filters });
    return data;
  },

  /**
   * Update insight status
   */
  updateInsightStatus: async (
    insightId: string,
    status: DataInsight['status'],
    note?: string
  ): Promise<DataInsight> => {
    const { data } = await api.put(`/bi/insights/${insightId}/status`, {
      status,
      note,
    });
    return data;
  },

  /**
   * Get business forecasts
   */
  getForecasts: async (
    filters?: {
      type?: string;
      metric?: string;
      timeHorizon?: string;
    }
  ): Promise<BusinessForecast[]> => {
    const { data } = await api.get('/bi/forecasts', { params: filters });
    return data;
  },

  /**
   * Create forecast
   */
  createForecast: async (
    forecastData: Omit<BusinessForecast, 'id' | 'predictions' | 'accuracy' | 'lastTrained' | 'createdAt' | 'updatedAt'>
  ): Promise<BusinessForecast> => {
    const { data } = await api.post('/bi/forecasts', forecastData);
    return data;
  },

  /**
   * Train forecast model
   */
  trainForecast: async (
    forecastId: string,
    config?: {
      historicalPeriod?: string;
      features?: string[];
      hyperparameters?: Record<string, any>;
    }
  ): Promise<{
    jobId: string;
    status: 'queued' | 'training' | 'completed' | 'failed';
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post(`/bi/forecasts/${forecastId}/train`, config);
    return data;
  },

  /**
   * Get BI dashboard
   */
  getDashboard: async (
    dashboardId: string,
    filters?: Record<string, any>
  ): Promise<{
    dashboard: {
      id: string;
      title: string;
      description: string;
      layout: Array<{
        id: string;
        type: 'kpi' | 'chart' | 'table' | 'insight';
        position: { x: number; y: number; width: number; height: number };
        config: any;
      }>;
    };
    data: Record<string, any>;
    lastUpdated: string;
  }> => {
    const { data } = await api.get(`/bi/dashboards/${dashboardId}`, {
      params: filters,
    });
    return data;
  },

  /**
   * Execute custom query
   */
  executeQuery: async (
    query: {
      type: 'sql' | 'aggregation' | 'time_series';
      statement: string;
      parameters?: Record<string, any>;
      limit?: number;
    }
  ): Promise<{
    columns: Array<{ name: string; type: string }>;
    rows: any[][];
    rowCount: number;
    executionTime: number;
  }> => {
    const { data } = await api.post('/bi/query', query);
    return data;
  },

  /**
   * Get BI overview
   */
  getOverview: async (): Promise<{
    summary: {
      totalKPIs: number;
      onTrackKPIs: number;
      atRiskKPIs: number;
      offTrackKPIs: number;
      totalVisualizations: number;
      activeReports: number;
      pendingInsights: number;
      activeForecast: number;
    };
    topKPIs: Array<{
      kpi: BusinessKPI;
      performance: 'excellent' | 'good' | 'poor';
    }>;
    recentInsights: DataInsight[];
    upcomingReports: BusinessReport[];
    systemHealth: {
      dataFreshness: number;
      queryPerformance: number;
      errorRate: number;
    };
  }> => {
    const { data } = await api.get('/bi/overview');
    return data;
  },
};

export default businessIntelligenceAPI;