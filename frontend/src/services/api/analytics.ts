import api from './client';

// Types
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
}

export interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  uniqueVisitors: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  bounceRate: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  views: number;
  conversionRate: number;
}

export interface TopCategory {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  products: number;
}

export interface CustomerMetrics {
  newCustomers: number;
  returningCustomers: number;
  customerRetentionRate: number;
  averageLifetimeValue: number;
  churnRate: number;
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
}

// Analytics API Service
export const analyticsAPI = {
  // Overview & Summary
  getOverview: async (filters?: AnalyticsFilters): Promise<AnalyticsOverview> => {
    const response = await api.get<AnalyticsOverview>('/analytics/overview', {
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

  // Customer Analytics
  getCustomerMetrics: async (filters?: AnalyticsFilters): Promise<CustomerMetrics> => {
    const response = await api.get<CustomerMetrics>('/analytics/customer-metrics', {
      params: filters,
    });
    return response.data;
  },

  // Conversion Analytics
  getConversionFunnel: async (filters?: AnalyticsFilters): Promise<ConversionFunnel[]> => {
    const response = await api.get<ConversionFunnel[]>('/analytics/conversion-funnel', {
      params: filters,
    });
    return response.data;
  },

  // Event Tracking
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

  // Geographic Analytics
  getGeographicData: async (filters?: AnalyticsFilters): Promise<GeographicData[]> => {
    const response = await api.get<GeographicData[]>('/analytics/geographic', {
      params: filters,
    });
    return response.data;
  },

  // Device Analytics
  getDeviceStats: async (filters?: AnalyticsFilters): Promise<DeviceStats[]> => {
    const response = await api.get<DeviceStats[]>('/analytics/devices', {
      params: filters,
    });
    return response.data;
  },

  // Export Reports
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
