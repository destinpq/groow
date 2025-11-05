import api from './client';

// ========================================
// Enhanced Analytics Types
// ========================================

export interface AnalyticsOverview {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  averageOrderValue: number;
  aovChange: number;
  conversionRate: number;
  conversionChange: number;
  grossProfit: number;
  profitMargin: number;
  returnRate: number;
  customerAcquisitionCost: number;
}

export interface SalesMetrics {
  id: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  period: string;
  date: string;
  growth: {
    revenue: number;
    orders: number;
    aov: number;
    conversion: number;
  };
  profitMargins: {
    gross: number;
    net: number;
    operating: number;
  };
}

export interface ProductAnalytics {
  id: string;
  name: string;
  category: string;
  totalSold: number;
  revenue: number;
  averageRating: number;
  views: number;
  conversionRate: number;
  profit: number;
  marginPercentage: number;
  inventory: number;
  stockTurnover: number;
  seasonality?: {
    peak: string;
    low: string;
    variance: number;
  };
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerLifetimeValue: number;
  churnRate: number;
  acquisitionCost: number;
  retentionRate: number;
  avgOrdersPerCustomer: number;
  segments: {
    segment: string;
    count: number;
    revenue: number;
    avgOrderValue: number;
    retentionRate: number;
  }[];
}

export interface SalesReport {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  dateRange: {
    start: string;
    end: string;
  };
  metrics: SalesMetrics;
  data: RevenueData[];
  createdAt: string;
  generatedBy: string;
  status: 'generating' | 'completed' | 'failed';
  fileUrl?: string;
  format: 'json' | 'pdf' | 'csv' | 'xlsx';
}

export interface CompetitorAnalysis {
  competitor: string;
  marketShare: number;
  priceComparison: number;
  performanceGap: number;
  opportunities: string[];
}

export interface ForecastData {
  date: string;
  predictedRevenue: number;
  predictedOrders: number;
  confidence: number;
  seasonalFactor: number;
  trendFactor: number;
}

export interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  uniqueVisitors: number;
  sessionsPerUser: number;
  avgSessionDuration: number;
  bounceRate: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  refunds: number;
  netRevenue: number;
  profit: number;
  costs: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  bounceRate: number;
  conversionRate: number;
  revenue: number;
  customerAcquisitionCost: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  views: number;
  conversionRate: number;
  profit: number;
  marginPercentage: number;
  category: string;
  stockLevel: number;
  trending: boolean;
}

export interface TopCategory {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  products: number;
  growth: number;
  profitMargin: number;
}

export interface CustomerMetrics {
  newCustomers: number;
  returningCustomers: number;
  customerRetentionRate: number;
  averageLifetimeValue: number;
  churnRate: number;
  acquisitionCost: number;
  avgOrderValue: number;
  purchaseFrequency: number;
  segmentDistribution: {
    vip: number;
    loyal: number;
    new: number;
    inactive: number;
  };
}

export interface PageView {
  page: string;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number; // in seconds
  bounceRate: number;
}

export interface ConversionFunnel {
  step: string;
  stepNumber: number;
  users: number;
  dropoffRate: number;
  conversionRate: number;
}

export interface AnalyticsEvent {
  id: string;
  event: string;
  category: string;
  count: number;
  value: number;
  change: number;
  timestamp: string;
}

export interface GeographicData {
  country: string;
  countryCode: string;
  visitors: number;
  revenue: number;
  orders: number;
}

export interface DeviceStats {
  device: 'desktop' | 'mobile' | 'tablet';
  visitors: number;
  percentage: number;
  bounceRate: number;
  conversionRate: number;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  granularity?: 'hour' | 'day' | 'week' | 'month';
  compareWith?: 'previous-period' | 'previous-year';
  category?: string;
  productId?: string;
  customerId?: string;
  channel?: string;
  region?: string;
  segment?: string;
}

// ========================================
// Enhanced Analytics API Service
// ========================================

export const analyticsAPI = {
  // ========================================
  // Overview & Dashboard
  // ========================================
  getOverview: async (filters?: AnalyticsFilters): Promise<AnalyticsOverview> => {
    const response = await api.get<AnalyticsOverview>('/analytics/overview', {
      params: filters,
    });
    return response.data;
  },

  getDashboardData: async (filters?: AnalyticsFilters): Promise<{
    salesMetrics: SalesMetrics;
    revenueChart: RevenueData[];
    topProducts: ProductAnalytics[];
    customerInsights: CustomerAnalytics;
    trafficOverview: TrafficData[];
    recentActivity: any[];
    quickInsights: any[];
  }> => {
    const response = await api.get('/analytics/dashboard', {
      params: filters,
    });
    return response.data;
  },

  getRealTimeMetrics: async (): Promise<{
    currentVisitors: number;
    activeOrders: number;
    todayRevenue: number;
    conversionRate: number;
    recentOrders: any[];
    topPages: { page: string; visitors: number }[];
  }> => {
    const response = await api.get('/analytics/realtime');
    return response.data;
  },

  // ========================================
  // Sales Analytics
  // ========================================
  getSalesMetrics: async (filters?: AnalyticsFilters): Promise<SalesMetrics> => {
    const response = await api.get<SalesMetrics>('/analytics/sales/metrics', {
      params: filters,
    });
    return response.data;
  },

  getSalesComparison: async (
    currentPeriod: { start: string; end: string },
    previousPeriod: { start: string; end: string }
  ): Promise<{
    current: SalesMetrics;
    previous: SalesMetrics;
    comparison: any;
  }> => {
    const response = await api.post('/analytics/sales/comparison', {
      currentPeriod,
      previousPeriod,
    });
    return response.data;
  },

  getSalesForecast: async (
    period: number = 30,
    type: 'revenue' | 'orders' | 'customers' = 'revenue'
  ): Promise<ForecastData[]> => {
    const response = await api.get<ForecastData[]>('/analytics/sales/forecast', {
      params: { period, type },
    });
    return response.data;
  },

  // ========================================
  // Product Analytics
  // ========================================
  getProductAnalytics: async (filters?: AnalyticsFilters): Promise<ProductAnalytics[]> => {
    const response = await api.get<ProductAnalytics[]>('/analytics/products', {
      params: filters,
    });
    return response.data;
  },

  getProductPerformance: async (productId: string, filters?: AnalyticsFilters): Promise<{
    analytics: ProductAnalytics;
    salesHistory: RevenueData[];
    competitorComparison: CompetitorAnalysis[];
    recommendations: string[];
  }> => {
    const response = await api.get(`/analytics/products/${productId}/performance`, {
      params: filters,
    });
    return response.data;
  },

  getProductTrends: async (filters?: AnalyticsFilters): Promise<{
    trending: ProductAnalytics[];
    declining: ProductAnalytics[];
    seasonal: ProductAnalytics[];
    recommendations: any[];
  }> => {
    const response = await api.get('/analytics/products/trends', {
      params: filters,
    });
    return response.data;
  },

  // Traffic Analytics
  getTrafficData: async (filters?: AnalyticsFilters): Promise<TrafficData[]> => {
    const response = await api.get<TrafficData[]>('/analytics/traffic', {
      params: filters,
    });
    return response.data;
  },

  getTrafficSources: async (filters?: AnalyticsFilters): Promise<TrafficSource[]> => {
    const response = await api.get<TrafficSource[]>('/analytics/traffic-sources', {
      params: filters,
    });
    return response.data;
  },

  getPageViews: async (filters?: AnalyticsFilters): Promise<PageView[]> => {
    const response = await api.get<PageView[]>('/analytics/page-views', {
      params: filters,
    });
    return response.data;
  },

  // Revenue Analytics
  getRevenueData: async (filters?: AnalyticsFilters): Promise<RevenueData[]> => {
    const response = await api.get<RevenueData[]>('/analytics/revenue', {
      params: filters,
    });
    return response.data;
  },

  // Product Analytics
  getTopProducts: async (filters?: AnalyticsFilters & { limit?: number }): Promise<TopProduct[]> => {
    const response = await api.get<TopProduct[]>('/analytics/top-products', {
      params: filters,
    });
    return response.data;
  },

  getTopCategories: async (filters?: AnalyticsFilters & { limit?: number }): Promise<TopCategory[]> => {
    const response = await api.get<TopCategory[]>('/analytics/top-categories', {
      params: filters,
    });
    return response.data;
  },

  // ========================================
  // Customer Analytics
  // ========================================
  getCustomerAnalytics: async (filters?: AnalyticsFilters): Promise<CustomerAnalytics> => {
    const response = await api.get<CustomerAnalytics>('/analytics/customers', {
      params: filters,
    });
    return response.data;
  },

  getCustomerSegmentation: async (filters?: AnalyticsFilters): Promise<{
    segments: CustomerAnalytics['segments'];
    trends: any[];
    churnPrediction: any[];
  }> => {
    const response = await api.get('/analytics/customers/segmentation', {
      params: filters,
    });
    return response.data;
  },

  getCustomerLifetimeValue: async (filters?: AnalyticsFilters): Promise<{
    overall: number;
    bySegment: { segment: string; value: number }[];
    trends: { date: string; value: number }[];
    predictions: any[];
  }> => {
    const response = await api.get('/analytics/customers/lifetime-value', {
      params: filters,
    });
    return response.data;
  },

  getCustomerRetention: async (filters?: AnalyticsFilters): Promise<{
    retentionRate: number;
    churnRate: number;
    cohortAnalysis: any[];
    retentionDrivers: any[];
  }> => {
    const response = await api.get('/analytics/customers/retention', {
      params: filters,
    });
    return response.data;
  },

  // ========================================
  // Reports Generation
  // ========================================
  generateReport: async (
    type: SalesReport['type'],
    dateRange: { start: string; end: string },
    options?: {
      includeProducts?: boolean;
      includeCustomers?: boolean;
      includeTraffic?: boolean;
      includeForecasts?: boolean;
      format?: 'json' | 'pdf' | 'csv' | 'xlsx';
      template?: string;
    }
  ): Promise<SalesReport> => {
    const response = await api.post<SalesReport>('/analytics/reports/generate', {
      type,
      dateRange,
      options,
    });
    return response.data;
  },

  getReports: async (
    page: number = 1,
    limit: number = 10,
    filters?: {
      type?: SalesReport['type'];
      status?: SalesReport['status'];
      dateRange?: { start: string; end: string };
      generatedBy?: string;
    }
  ): Promise<{
    reports: SalesReport[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await api.get('/analytics/reports', {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  downloadReport: async (reportId: string, format?: 'pdf' | 'csv' | 'xlsx'): Promise<Blob> => {
    const response = await api.get(`/analytics/reports/${reportId}/download`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  deleteReport: async (reportId: string): Promise<void> => {
    await api.delete(`/analytics/reports/${reportId}`);
  },

  scheduleReport: async (
    reportConfig: {
      type: SalesReport['type'];
      frequency: 'daily' | 'weekly' | 'monthly';
      recipients: string[];
      format: 'pdf' | 'csv' | 'xlsx';
      options?: any;
    }
  ): Promise<{ scheduleId: string; nextRun: string }> => {
    const response = await api.post('/analytics/reports/schedule', reportConfig);
    return response.data;
  },

  // ========================================
  // Advanced Analytics & Insights
  // ========================================
  getMarketAnalysis: async (filters?: AnalyticsFilters): Promise<{
    marketSize: number;
    marketGrowth: number;
    competitorAnalysis: CompetitorAnalysis[];
    opportunities: any[];
    threats: any[];
  }> => {
    const response = await api.get('/analytics/market-analysis', {
      params: filters,
    });
    return response.data;
  },

  getABTestResults: async (testId?: string): Promise<{
    activeTests: any[];
    completedTests: any[];
    insights: any[];
    recommendations: any[];
  }> => {
    const response = await api.get('/analytics/ab-tests', {
      params: { testId },
    });
    return response.data;
  },

  getCohortAnalysis: async (filters?: AnalyticsFilters): Promise<{
    cohorts: any[];
    retentionMatrix: any[][];
    insights: any[];
  }> => {
    const response = await api.get('/analytics/cohort-analysis', {
      params: filters,
    });
    return response.data;
  },

  getAttributionAnalysis: async (filters?: AnalyticsFilters): Promise<{
    touchpoints: any[];
    attributionModel: any;
    conversionPaths: any[];
    channelEffectiveness: any[];
  }> => {
    const response = await api.get('/analytics/attribution', {
      params: filters,
    });
    return response.data;
  },

  // ========================================
  // Traffic Analytics
  // ========================================
  getTrafficData: async (filters?: AnalyticsFilters): Promise<TrafficData[]> => {
    const response = await api.get<TrafficData[]>('/analytics/traffic', {
      params: filters,
    });
    return response.data;
  },

  getTrafficSources: async (filters?: AnalyticsFilters): Promise<TrafficSource[]> => {
    const response = await api.get<TrafficSource[]>('/analytics/traffic-sources', {
      params: filters,
    });
    return response.data;
  },

  getPageViews: async (filters?: AnalyticsFilters): Promise<PageView[]> => {
    const response = await api.get<PageView[]>('/analytics/page-views', {
      params: filters,
    });
    return response.data;
  },

  // ========================================
  // Revenue Analytics  
  // ========================================
  getRevenueData: async (filters?: AnalyticsFilters): Promise<RevenueData[]> => {
    const response = await api.get<RevenueData[]>('/analytics/revenue', {
      params: filters,
    });
    return response.data;
  },

  // ========================================
  // Product Analytics
  // ========================================
  getTopProducts: async (filters?: AnalyticsFilters & { limit?: number }): Promise<TopProduct[]> => {
    const response = await api.get<TopProduct[]>('/analytics/top-products', {
      params: filters,
    });
    return response.data;
  },

  getTopCategories: async (filters?: AnalyticsFilters & { limit?: number }): Promise<TopCategory[]> => {
    const response = await api.get<TopCategory[]>('/analytics/top-categories', {
      params: filters,
    });
    return response.data;
  },

  // ========================================
  // Conversion & Event Analytics
  // ========================================
  getConversionFunnel: async (filters?: AnalyticsFilters): Promise<ConversionFunnel[]> => {
    const response = await api.get<ConversionFunnel[]>('/analytics/conversion-funnel', {
      params: filters,
    });
    return response.data;
  },

  getEvents: async (filters?: AnalyticsFilters & { category?: string }): Promise<AnalyticsEvent[]> => {
    const response = await api.get<AnalyticsEvent[]>('/analytics/events', {
      params: filters,
    });
    return response.data;
  },

  trackEvent: async (event: {
    event: string;
    category: string;
    value?: number;
    metadata?: Record<string, any>;
  }): Promise<void> => {
    await api.post('/analytics/events', event);
  },

  // ========================================
  // Geographic & Device Analytics
  // ========================================
  getGeographicData: async (filters?: AnalyticsFilters): Promise<GeographicData[]> => {
    const response = await api.get<GeographicData[]>('/analytics/geographic', {
      params: filters,
    });
    return response.data;
  },

  getDeviceStats: async (filters?: AnalyticsFilters): Promise<DeviceStats[]> => {
    const response = await api.get<DeviceStats[]>('/analytics/devices', {
      params: filters,
    });
    return response.data;
  },

  // ========================================
  // Data Export & Integration
  // ========================================
  exportData: async (
    dataType: 'sales' | 'products' | 'customers' | 'traffic' | 'all',
    format: 'csv' | 'json' | 'xlsx',
    filters?: AnalyticsFilters
  ): Promise<Blob> => {
    const response = await api.get(`/analytics/export/${dataType}`, {
      params: { ...filters, format },
      responseType: 'blob',
    });
    return response.data;
  },

  importData: async (
    file: File,
    dataType: string,
    mapping?: Record<string, string>
  ): Promise<{ success: boolean; imported: number; errors: any[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dataType', dataType);
    if (mapping) {
      formData.append('mapping', JSON.stringify(mapping));
    }

    const response = await api.post('/analytics/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ========================================
  // Configuration & Legacy Support
  // ========================================
  getAnalyticsConfig: async (): Promise<{
    trackingEnabled: boolean;
    dataRetentionDays: number;
    anonymization: boolean;
    goals: any[];
    segments: any[];
    customMetrics: any[];
  }> => {
    const response = await api.get('/analytics/config');
    return response.data;
  },

  updateAnalyticsConfig: async (config: any): Promise<void> => {
    await api.put('/analytics/config', config);
  },

  // Legacy Export (Kept for compatibility)
  exportReport: async (
    reportType: 'overview' | 'traffic' | 'revenue' | 'products' | 'customers',
    format: 'csv' | 'pdf' | 'excel',
    filters?: AnalyticsFilters
  ): Promise<Blob> => {
    const response = await api.get(`/analytics/export/${reportType}`, {
      params: { ...filters, format },
      responseType: 'blob',
    });
    return response.data;
  },
};

export default analyticsAPI;
