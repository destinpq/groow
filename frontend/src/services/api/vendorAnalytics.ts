/**
 * Vendor Analytics API Services
 * Advanced analytics and reporting for vendor performance tracking
 */
import { api } from './client';

export interface AnalyticsTimeRange {
  from: string;
  to: string;
}

export interface SalesAnalytics {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
    returnRate: number;
    refundRate: number;
    profitMargin: number;
  };
  trends: {
    period: string;
    revenue: number;
    orders: number;
    growth: number;
    forecast: number;
  }[];
  breakdown: {
    byProduct: Array<{
      productId: string;
      productName: string;
      revenue: number;
      orders: number;
      units: number;
      margin: number;
    }>;
    byCategory: Array<{
      categoryId: string;
      categoryName: string;
      revenue: number;
      percentage: number;
    }>;
    byRegion: Array<{
      region: string;
      revenue: number;
      orders: number;
      customers: number;
    }>;
    byChannel: Array<{
      channel: string;
      revenue: number;
      percentage: number;
    }>;
  };
  topPerformers: {
    products: Array<{
      id: string;
      name: string;
      revenue: number;
      units: number;
      growth: number;
    }>;
    categories: Array<{
      id: string;
      name: string;
      revenue: number;
      growth: number;
    }>;
  };
}

export interface CustomerAnalytics {
  overview: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    customerLifetimeValue: number;
    averageOrderFrequency: number;
    churnRate: number;
  };
  demographics: {
    ageGroups: Array<{
      ageGroup: string;
      count: number;
      percentage: number;
    }>;
    locations: Array<{
      location: string;
      count: number;
      revenue: number;
    }>;
    segments: Array<{
      segment: string;
      count: number;
      value: number;
    }>;
  };
  behavior: {
    purchasePatterns: Array<{
      pattern: string;
      frequency: number;
      value: number;
    }>;
    productPreferences: Array<{
      categoryId: string;
      categoryName: string;
      preference: number;
    }>;
    seasonalTrends: Array<{
      month: string;
      activity: number;
      spending: number;
    }>;
  };
  retention: {
    cohorts: Array<{
      cohort: string;
      period: string;
      retentionRate: number;
      revenue: number;
    }>;
    repeatPurchase: {
      rate: number;
      averageDays: number;
      revenueImpact: number;
    };
  };
}

export interface PerformanceAnalytics {
  efficiency: {
    orderProcessingTime: {
      average: number;
      median: number;
      trend: number[];
    };
    fulfillmentRate: {
      onTime: number;
      early: number;
      late: number;
      failed: number;
    };
    responseTime: {
      queries: number;
      complaints: number;
      returns: number;
    };
  };
  quality: {
    ratings: {
      overall: number;
      breakdown: Record<number, number>;
      trend: Array<{
        period: string;
        rating: number;
      }>;
    };
    reviews: {
      positive: number;
      neutral: number;
      negative: number;
      sentiment: number;
    };
    returns: {
      rate: number;
      reasons: Array<{
        reason: string;
        count: number;
        percentage: number;
      }>;
    };
  };
  competition: {
    marketShare: {
      current: number;
      trend: number;
      comparison: Array<{
        metric: string;
        yourValue: number;
        marketAverage: number;
        ranking: number;
      }>;
    };
    pricing: {
      competitiveness: number;
      pricePoints: Array<{
        category: string;
        yourPrice: number;
        marketPrice: number;
        advantage: number;
      }>;
    };
  };
}

export interface TrafficAnalytics {
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    sessionDuration: number;
    conversionRate: number;
  };
  sources: Array<{
    source: string;
    visits: number;
    conversions: number;
    revenue: number;
    percentage: number;
  }>;
  pages: Array<{
    page: string;
    views: number;
    uniqueViews: number;
    conversionRate: number;
  }>;
  devices: Array<{
    device: string;
    visits: number;
    conversions: number;
    percentage: number;
  }>;
  geography: Array<{
    country: string;
    city: string;
    visits: number;
    conversions: number;
    revenue: number;
  }>;
}

export interface InventoryAnalytics {
  stockLevels: Array<{
    productId: string;
    productName: string;
    currentStock: number;
    reservedStock: number;
    availableStock: number;
    reorderLevel: number;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
  }>;
  turnover: Array<{
    productId: string;
    productName: string;
    turnoverRate: number;
    daysInStock: number;
    category: string;
  }>;
  forecasting: Array<{
    productId: string;
    productName: string;
    predictedDemand: number;
    recommendedStock: number;
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  movements: Array<{
    date: string;
    type: 'in' | 'out' | 'adjustment';
    productId: string;
    quantity: number;
    reason: string;
  }>;
}

export interface ReportConfig {
  name: string;
  type: 'sales' | 'customer' | 'performance' | 'inventory' | 'traffic';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  recipients: string[];
  filters?: Record<string, any>;
  active: boolean;
}

export const vendorAnalyticsAPI = {
  /**
   * Get sales analytics
   */
  getSalesAnalytics: async (
    timeRange: AnalyticsTimeRange,
    granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<SalesAnalytics> => {
    const { data } = await api.get('/vendor/analytics/sales', {
      params: { ...timeRange, granularity },
    });
    return data;
  },

  /**
   * Get customer analytics
   */
  getCustomerAnalytics: async (
    timeRange: AnalyticsTimeRange
  ): Promise<CustomerAnalytics> => {
    const { data } = await api.get('/vendor/analytics/customers', {
      params: timeRange,
    });
    return data;
  },

  /**
   * Get performance analytics
   */
  getPerformanceAnalytics: async (
    timeRange: AnalyticsTimeRange
  ): Promise<PerformanceAnalytics> => {
    const { data } = await api.get('/vendor/analytics/performance', {
      params: timeRange,
    });
    return data;
  },

  /**
   * Get traffic analytics
   */
  getTrafficAnalytics: async (
    timeRange: AnalyticsTimeRange
  ): Promise<TrafficAnalytics> => {
    const { data } = await api.get('/vendor/analytics/traffic', {
      params: timeRange,
    });
    return data;
  },

  /**
   * Get inventory analytics
   */
  getInventoryAnalytics: async (): Promise<InventoryAnalytics> => {
    const { data } = await api.get('/vendor/analytics/inventory');
    return data;
  },

  /**
   * Get real-time metrics
   */
  getRealTimeMetrics: async () => {
    const { data } = await api.get('/vendor/analytics/realtime');
    return data;
  },

  /**
   * Get conversion funnel analysis
   */
  getConversionFunnel: async (timeRange: AnalyticsTimeRange) => {
    const { data } = await api.get('/vendor/analytics/conversion-funnel', {
      params: timeRange,
    });
    return data;
  },

  /**
   * Get cohort analysis
   */
  getCohortAnalysis: async (
    type: 'revenue' | 'retention',
    period: 'weekly' | 'monthly'
  ) => {
    const { data } = await api.get('/vendor/analytics/cohort', {
      params: { type, period },
    });
    return data;
  },

  /**
   * Get product performance insights
   */
  getProductInsights: async (
    productId?: string,
    timeRange?: AnalyticsTimeRange
  ) => {
    const { data } = await api.get('/vendor/analytics/product-insights', {
      params: { productId, ...timeRange },
    });
    return data;
  },

  /**
   * Get market trends analysis
   */
  getMarketTrends: async (
    category?: string,
    timeRange?: AnalyticsTimeRange
  ) => {
    const { data } = await api.get('/vendor/analytics/market-trends', {
      params: { category, ...timeRange },
    });
    return data;
  },

  /**
   * Get A/B testing results
   */
  getABTestResults: async (testId?: string) => {
    const { data } = await api.get('/vendor/analytics/ab-tests', {
      params: { testId },
    });
    return data;
  },

  /**
   * Create custom report
   */
  createCustomReport: async (reportConfig: {
    name: string;
    metrics: string[];
    filters: Record<string, any>;
    timeRange: AnalyticsTimeRange;
    format: 'chart' | 'table' | 'combined';
  }) => {
    const { data } = await api.post('/vendor/analytics/custom-report', reportConfig);
    return data;
  },

  /**
   * Get scheduled reports
   */
  getScheduledReports: async (): Promise<ReportConfig[]> => {
    const { data } = await api.get('/vendor/analytics/scheduled-reports');
    return data;
  },

  /**
   * Create scheduled report
   */
  createScheduledReport: async (reportConfig: Omit<ReportConfig, 'active'>): Promise<ReportConfig> => {
    const { data } = await api.post('/vendor/analytics/scheduled-reports', reportConfig);
    return data;
  },

  /**
   * Update scheduled report
   */
  updateScheduledReport: async (reportId: string, updates: Partial<ReportConfig>): Promise<ReportConfig> => {
    const { data } = await api.put(`/vendor/analytics/scheduled-reports/${reportId}`, updates);
    return data;
  },

  /**
   * Delete scheduled report
   */
  deleteScheduledReport: async (reportId: string): Promise<void> => {
    await api.delete(`/vendor/analytics/scheduled-reports/${reportId}`);
  },

  /**
   * Export analytics data
   */
  exportAnalytics: async (
    type: 'sales' | 'customers' | 'performance' | 'inventory',
    format: 'csv' | 'xlsx' | 'pdf',
    timeRange: AnalyticsTimeRange,
    filters?: Record<string, any>
  ) => {
    const { data } = await api.get('/vendor/analytics/export', {
      params: { type, format, ...timeRange, ...filters },
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Get analytics insights and recommendations
   */
  getInsights: async (
    categories: string[] = ['sales', 'customers', 'performance']
  ) => {
    const { data } = await api.get('/vendor/analytics/insights', {
      params: { categories: categories.join(',') },
    });
    return data;
  },

  /**
   * Get forecasting data
   */
  getForecast: async (
    type: 'sales' | 'demand' | 'revenue',
    period: '1m' | '3m' | '6m' | '12m',
    productId?: string
  ) => {
    const { data } = await api.get('/vendor/analytics/forecast', {
      params: { type, period, productId },
    });
    return data;
  },

  /**
   * Get anomaly detection
   */
  getAnomalies: async (
    metric: string,
    timeRange: AnalyticsTimeRange,
    sensitivity: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    const { data } = await api.get('/vendor/analytics/anomalies', {
      params: { metric, sensitivity, ...timeRange },
    });
    return data;
  },

  /**
   * Get competitor analysis
   */
  getCompetitorAnalysis: async (
    metrics: string[] = ['pricing', 'reviews', 'market_share']
  ) => {
    const { data } = await api.get('/vendor/analytics/competitor-analysis', {
      params: { metrics: metrics.join(',') },
    });
    return data;
  },

  /**
   * Get customer segmentation
   */
  getCustomerSegmentation: async (
    criteria: 'value' | 'behavior' | 'demographics' | 'lifecycle'
  ) => {
    const { data } = await api.get('/vendor/analytics/customer-segmentation', {
      params: { criteria },
    });
    return data;
  },

  /**
   * Get attribution analysis
   */
  getAttributionAnalysis: async (
    model: 'first_touch' | 'last_touch' | 'linear' | 'time_decay',
    timeRange: AnalyticsTimeRange
  ) => {
    const { data } = await api.get('/vendor/analytics/attribution', {
      params: { model, ...timeRange },
    });
    return data;
  },

  /**
   * Set analytics goals
   */
  setAnalyticsGoals: async (goals: Array<{
    metric: string;
    target: number;
    timeframe: string;
    type: 'increase' | 'decrease' | 'maintain';
  }>) => {
    const { data } = await api.post('/vendor/analytics/goals', { goals });
    return data;
  },

  /**
   * Get analytics goals progress
   */
  getGoalsProgress: async () => {
    const { data } = await api.get('/vendor/analytics/goals/progress');
    return data;
  },
};

export default vendorAnalyticsAPI;