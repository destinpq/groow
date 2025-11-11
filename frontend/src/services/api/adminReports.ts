/**
 * Admin Reports & Analytics API Services
 * Comprehensive reporting and analytics functionality for administrators
 */
import { api } from './client';

export interface ReportFilter {
  dateRange: {
    from: string;
    to: string;
  };
  categories?: string[];
  vendors?: string[];
  customers?: string[];
  products?: string[];
  status?: string[];
}

export interface SalesReport {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalRefunds: number;
    netRevenue: number;
    growthRate: number;
  };
  dailyBreakdown: Array<{
    date: string;
    revenue: number;
    orders: number;
    refunds: number;
    averageOrderValue: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sku: string;
    quantity: number;
    revenue: number;
    profit: number;
  }>;
  topCategories: Array<{
    id: string;
    name: string;
    revenue: number;
    orders: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
}

export interface CustomerReport {
  summary: {
    totalCustomers: number;
    newCustomers: number;
    activeCustomers: number;
    customerRetentionRate: number;
    averageLifetimeValue: number;
  };
  customerSegments: Array<{
    segment: string;
    count: number;
    percentage: number;
    averageOrderValue: number;
    totalRevenue: number;
  }>;
  topCustomers: Array<{
    id: string;
    name: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
    lifetimeValue: number;
    lastOrderDate: string;
  }>;
  customerAcquisition: Array<{
    date: string;
    newCustomers: number;
    source: string;
  }>;
  geographicDistribution: Array<{
    country: string;
    state?: string;
    customerCount: number;
    revenue: number;
  }>;
}

export interface VendorReport {
  summary: {
    totalVendors: number;
    activeVendors: number;
    totalCommission: number;
    averageCommissionRate: number;
  };
  topVendors: Array<{
    id: string;
    name: string;
    email: string;
    totalSales: number;
    commission: number;
    orderCount: number;
    rating: number;
  }>;
  vendorPerformance: Array<{
    vendorId: string;
    vendorName: string;
    sales: number;
    commission: number;
    orders: number;
    averageRating: number;
    fulfillmentRate: number;
  }>;
  commissionBreakdown: Array<{
    vendorId: string;
    vendorName: string;
    totalCommission: number;
    paidCommission: number;
    pendingCommission: number;
  }>;
}

export interface ProductReport {
  summary: {
    totalProducts: number;
    activeProducts: number;
    outOfStockProducts: number;
    lowStockProducts: number;
    totalInventoryValue: number;
  };
  bestSellers: Array<{
    id: string;
    name: string;
    sku: string;
    category: string;
    quantitySold: number;
    revenue: number;
    profit: number;
  }>;
  worstPerformers: Array<{
    id: string;
    name: string;
    sku: string;
    category: string;
    quantitySold: number;
    revenue: number;
    daysInStock: number;
  }>;
  categoryPerformance: Array<{
    categoryId: string;
    categoryName: string;
    productCount: number;
    revenue: number;
    profit: number;
    averageRating: number;
  }>;
  inventoryAnalysis: {
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    overStockItems: number;
    fastMovingItems: number;
    slowMovingItems: number;
  };
}

export interface CustomReport {
  id: string;
  name: string;
  type: 'sales' | 'customers' | 'vendors' | 'products' | 'inventory' | 'custom';
  filters: ReportFilter;
  columns: Array<{
    field: string;
    label: string;
    type: 'string' | 'number' | 'date' | 'currency';
    aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  }>;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    emails: string[];
    active: boolean;
  };
  createdAt: string;
  createdBy: string;
}

export interface ReportExportOptions {
  format: 'csv' | 'xlsx' | 'pdf';
  includeCharts?: boolean;
  includeSummary?: boolean;
  fileName?: string;
}

export const adminReportsAPI = {
  /**
   * Get sales report
   */
  getSalesReport: async (filters: ReportFilter): Promise<SalesReport> => {
    const { data } = await api.post('/admin/reports/sales', { filters });
    return data;
  },

  /**
   * Get customer report
   */
  getCustomerReport: async (filters: ReportFilter): Promise<CustomerReport> => {
    const { data } = await api.post('/admin/reports/customers', { filters });
    return data;
  },

  /**
   * Get vendor report
   */
  getVendorReport: async (filters: ReportFilter): Promise<VendorReport> => {
    const { data } = await api.post('/admin/reports/vendors', { filters });
    return data;
  },

  /**
   * Get product report
   */
  getProductReport: async (filters: ReportFilter): Promise<ProductReport> => {
    const { data } = await api.post('/admin/reports/products', { filters });
    return data;
  },

  /**
   * Get dashboard analytics overview
   */
  getDashboardAnalytics: async (period: 'today' | 'week' | 'month' | 'quarter' | 'year' = 'month') => {
    const { data } = await api.get('/admin/analytics/dashboard', {
      params: { period },
    });
    return data;
  },

  /**
   * Get revenue analytics
   */
  getRevenueAnalytics: async (
    period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    dateRange?: { from: string; to: string }
  ) => {
    const { data } = await api.get('/admin/analytics/revenue', {
      params: { period, ...dateRange },
    });
    return data;
  },

  /**
   * Get conversion analytics
   */
  getConversionAnalytics: async (filters: Partial<ReportFilter> = {}) => {
    const { data } = await api.post('/admin/analytics/conversion', { filters });
    return data;
  },

  /**
   * Get traffic analytics
   */
  getTrafficAnalytics: async (period: 'day' | 'week' | 'month') => {
    const { data } = await api.get('/admin/analytics/traffic', {
      params: { period },
    });
    return data;
  },

  /**
   * Create custom report
   */
  createCustomReport: async (report: Omit<CustomReport, 'id' | 'createdAt' | 'createdBy'>): Promise<CustomReport> => {
    const { data } = await api.post('/admin/reports/custom', report);
    return data;
  },

  /**
   * Get custom reports
   */
  getCustomReports: async (): Promise<CustomReport[]> => {
    const { data } = await api.get('/admin/reports/custom');
    return data;
  },

  /**
   * Run custom report
   */
  runCustomReport: async (reportId: string) => {
    const { data } = await api.post(`/admin/reports/custom/${reportId}/run`);
    return data;
  },

  /**
   * Update custom report
   */
  updateCustomReport: async (reportId: string, updates: Partial<CustomReport>): Promise<CustomReport> => {
    const { data } = await api.put(`/admin/reports/custom/${reportId}`, updates);
    return data;
  },

  /**
   * Delete custom report
   */
  deleteCustomReport: async (reportId: string): Promise<void> => {
    await api.delete(`/admin/reports/custom/${reportId}`);
  },

  /**
   * Export report
   */
  exportReport: async (
    reportType: 'sales' | 'customers' | 'vendors' | 'products' | 'custom',
    reportId: string | null,
    filters: ReportFilter,
    options: ReportExportOptions
  ) => {
    const { data } = await api.post('/admin/reports/export', {
      reportType,
      reportId,
      filters,
      options,
    }, {
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Get report templates
   */
  getReportTemplates: async () => {
    const { data } = await api.get('/admin/reports/templates');
    return data;
  },

  /**
   * Get financial summary
   */
  getFinancialSummary: async (period: 'month' | 'quarter' | 'year') => {
    const { data } = await api.get('/admin/analytics/financial', {
      params: { period },
    });
    return data;
  },

  /**
   * Get inventory analytics
   */
  getInventoryAnalytics: async () => {
    const { data } = await api.get('/admin/analytics/inventory');
    return data;
  },

  /**
   * Get customer behavior analytics
   */
  getCustomerBehaviorAnalytics: async (filters: Partial<ReportFilter> = {}) => {
    const { data } = await api.post('/admin/analytics/customer-behavior', { filters });
    return data;
  },

  /**
   * Get vendor performance analytics
   */
  getVendorPerformanceAnalytics: async (filters: Partial<ReportFilter> = {}) => {
    const { data } = await api.post('/admin/analytics/vendor-performance', { filters });
    return data;
  },

  /**
   * Schedule report
   */
  scheduleReport: async (
    reportType: string,
    reportId: string | null,
    schedule: {
      frequency: 'daily' | 'weekly' | 'monthly';
      emails: string[];
      filters: ReportFilter;
      format: 'csv' | 'xlsx' | 'pdf';
    }
  ) => {
    const { data } = await api.post('/admin/reports/schedule', {
      reportType,
      reportId,
      schedule,
    });
    return data;
  },

  /**
   * Get scheduled reports
   */
  getScheduledReports: async () => {
    const { data } = await api.get('/admin/reports/scheduled');
    return data;
  },

  /**
   * Update scheduled report
   */
  updateScheduledReport: async (scheduleId: string, updates: any) => {
    const { data } = await api.put(`/admin/reports/scheduled/${scheduleId}`, updates);
    return data;
  },

  /**
   * Delete scheduled report
   */
  deleteScheduledReport: async (scheduleId: string): Promise<void> => {
    await api.delete(`/admin/reports/scheduled/${scheduleId}`);
  },

  /**
   * Get comparative analytics
   */
  getComparativeAnalytics: async (
    metric: 'revenue' | 'orders' | 'customers',
    periods: Array<{ from: string; to: string; label: string }>
  ) => {
    const { data } = await api.post('/admin/analytics/comparative', {
      metric,
      periods,
    });
    return data;
  },
};

export default adminReportsAPI;