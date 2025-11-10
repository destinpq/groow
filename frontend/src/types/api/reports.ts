import { 
  ApiResponse, 
  BaseEntity, 
  PaginatedResponse 
} from './common';

// ================================
// REPORT ENTITY TYPES  
// ================================

export enum ReportType {
  SALES = 'sales',
  PRODUCTS = 'products',
  CUSTOMERS = 'customers',
  VENDORS = 'vendors',
  RFQ = 'rfq',
  SUBSCRIPTIONS = 'subscriptions',
  CATEGORIES = 'categories',
  FINANCE = 'finance',
  INVENTORY = 'inventory',
  CUSTOM = 'custom'
}

export enum ReportFormat {
  JSON = 'json',
  CSV = 'csv',
  PDF = 'pdf',
  EXCEL = 'excel'
}

export enum ReportFrequency {
  REAL_TIME = 'real_time',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export interface Report extends BaseEntity {
  id: string;
  name: string;
  type: ReportType;
  description?: string;
  parameters: Record<string, any>;
  filters: Record<string, any>;
  data: any;
  format: ReportFormat;
  frequency?: ReportFrequency;
  isScheduled: boolean;
  generatedAt: Date;
  generatedBy: string;
  downloadUrl?: string;
  expiresAt?: Date;
  size: number;
  status: 'generating' | 'completed' | 'failed';
  error?: string;
  metadata?: {
    rowCount?: number;
    columns?: string[];
    aggregations?: Record<string, any>;
  };
}

export interface SalesReport {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  growth: {
    revenueGrowth: number;
    orderGrowth: number;
    aovGrowth: number;
  };
  breakdown: {
    daily: { date: string; revenue: number; orders: number }[];
    byCategory: { category: string; revenue: number; orders: number; percentage: number }[];
    byPaymentMethod: { method: string; revenue: number; orders: number }[];
    byRegion: { region: string; revenue: number; orders: number }[];
  };
  topProducts: {
    id: string;
    name: string;
    revenue: number;
    quantity: number;
    orders: number;
  }[];
  metrics: {
    conversionRate: number;
    refundRate: number;
    repeatCustomerRate: number;
    customerLifetimeValue: number;
  };
}

export interface ProductReport {
  period: string;
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  topPerforming: {
    id: string;
    name: string;
    revenue: number;
    quantity: number;
    views: number;
    conversionRate: number;
    rating: number;
  }[];
  underPerforming: {
    id: string;
    name: string;
    revenue: number;
    views: number;
    conversionRate: number;
    daysOnSite: number;
  }[];
  categoryPerformance: {
    categoryId: string;
    categoryName: string;
    products: number;
    revenue: number;
    growth: number;
  }[];
  inventoryHealth: {
    totalValue: number;
    turnoverRate: number;
    averageAge: number;
    deadStock: number;
  };
  priceAnalysis: {
    averagePrice: number;
    priceRange: { min: number; max: number };
    discountImpact: number;
  };
}

export interface CustomerReport {
  period: string;
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerGrowth: number;
  segments: {
    segment: string;
    count: number;
    revenue: number;
    percentage: number;
  }[];
  cohortAnalysis: {
    cohort: string;
    period0: number;
    period1: number;
    period2: number;
    period3: number;
    period6: number;
    period12: number;
  }[];
  demographics: {
    ageGroups: { range: string; count: number; revenue: number }[];
    genders: { gender: string; count: number; revenue: number }[];
    locations: { city: string; count: number; revenue: number }[];
  };
  behavior: {
    averageOrderValue: number;
    orderFrequency: number;
    sessionDuration: number;
    bounceRate: number;
    conversionRate: number;
  };
  retention: {
    churnRate: number;
    retentionRate: number;
    lifetimeValue: number;
    paybackPeriod: number;
  };
}

export interface VendorReport {
  period: string;
  totalVendors: number;
  activeVendors: number;
  topPerformers: {
    vendorId: string;
    vendorName: string;
    revenue: number;
    orders: number;
    products: number;
    rating: number;
    growth: number;
  }[];
  performance: {
    vendorId: string;
    vendorName: string;
    revenue: number;
    commission: number;
    orders: number;
    fulfillmentRate: number;
    responseTime: number;
    customerRating: number;
  }[];
  payouts: {
    totalPaid: number;
    pending: number;
    averagePayoutTime: number;
  };
  productDistribution: {
    vendorId: string;
    vendorName: string;
    products: number;
    categories: string[];
    averagePrice: number;
  }[];
  compliance: {
    documentsSubmitted: number;
    verificationStatus: { status: string; count: number }[];
    issuesReported: number;
  };
}

export interface RfqReport {
  period: string;
  totalRfqs: number;
  activeRfqs: number;
  quotedRfqs: number;
  acceptedRfqs: number;
  rejectedRfqs: number;
  averageResponseTime: number;
  conversionRate: number;
  breakdown: {
    byCategory: { category: string; count: number; conversionRate: number }[];
    byValue: { range: string; count: number; averageQuotes: number }[];
    byRegion: { region: string; count: number; avgValue: number }[];
  };
  vendors: {
    vendorId: string;
    vendorName: string;
    quotations: number;
    acceptanceRate: number;
    averageResponseTime: number;
    averageQuoteValue: number;
  }[];
  trends: {
    date: string;
    created: number;
    quoted: number;
    accepted: number;
  }[];
}

export interface SubscriptionReport {
  period: string;
  totalSubscriptions: number;
  activeSubscriptions: number;
  newSubscriptions: number;
  cancelledSubscriptions: number;
  revenue: {
    total: number;
    recurring: number;
    growth: number;
  };
  churn: {
    rate: number;
    reasons: { reason: string; count: number }[];
  };
  plans: {
    planId: string;
    planName: string;
    subscribers: number;
    revenue: number;
    churnRate: number;
  }[];
  cohortAnalysis: {
    cohort: string;
    month0: number;
    month1: number;
    month3: number;
    month6: number;
    month12: number;
  }[];
}

export interface CategoryReport {
  period: string;
  categories: {
    categoryId: string;
    categoryName: string;
    products: number;
    revenue: number;
    orders: number;
    growth: number;
    marketShare: number;
  }[];
  topCategories: {
    categoryId: string;
    categoryName: string;
    revenue: number;
    growth: number;
  }[];
  performance: {
    totalCategories: number;
    averageProductsPerCategory: number;
    mostProfitable: string;
    fastestGrowing: string;
  };
  trends: {
    date: string;
    categoryData: { categoryId: string; revenue: number; orders: number }[];
  }[];
}

export interface DashboardAnalytics {
  period: string;
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    growth: {
      revenue: number;
      orders: number;
      customers: number;
    };
  };
  recentMetrics: {
    todayRevenue: number;
    todayOrders: number;
    newCustomers: number;
    pendingOrders: number;
    lowStock: number;
    activeDeals: number;
  };
  charts: {
    dailyRevenue: { date: string; revenue: number }[];
    orderStatus: { status: string; count: number }[];
    topCategories: { category: string; revenue: number }[];
    customerAcquisition: { date: string; customers: number }[];
  };
  alerts: {
    type: 'info' | 'warning' | 'error';
    title: string;
    message: string;
    count?: number;
    actionUrl?: string;
  }[];
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  uptime: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
  services: {
    name: string;
    status: 'up' | 'down' | 'degraded';
    responseTime: number;
    lastCheck: Date;
  }[];
  resources: {
    cpu: { usage: number; cores: number };
    memory: { used: number; total: number; percentage: number };
    disk: { used: number; total: number; percentage: number };
    network: { inbound: number; outbound: number };
  };
  database: {
    connections: { active: number; max: number };
    queries: { slow: number; total: number };
    size: number;
  };
}

export interface RecentActivity {
  id: string;
  type: 'order' | 'customer' | 'product' | 'vendor' | 'system';
  action: string;
  description: string;
  userId?: string;
  userName?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// ================================
// REQUEST/RESPONSE TYPES
// ================================

export interface GetSalesReportRequest {
  period?: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  vendorId?: string;
  groupBy?: 'day' | 'week' | 'month';
}

export interface GetSalesReportResponse {
  report: SalesReport;
}

export interface GetProductReportRequest {
  period?: string;
  categoryId?: string;
  vendorId?: string;
  status?: 'active' | 'inactive' | 'all';
  sortBy?: 'revenue' | 'quantity' | 'views' | 'rating';
}

export interface GetProductReportResponse {
  report: ProductReport;
}

export interface GetCustomerReportRequest {
  period?: string;
  segment?: string;
  location?: string;
  ageRange?: string;
  includeChurn?: boolean;
}

export interface GetCustomerReportResponse {
  report: CustomerReport;
}

export interface GetVendorReportRequest {
  period?: string;
  status?: 'active' | 'inactive' | 'pending';
  categoryId?: string;
  minimumRevenue?: number;
}

export interface GetVendorReportResponse {
  report: VendorReport;
}

export interface GetRfqReportRequest {
  period?: string;
  status?: 'open' | 'quoted' | 'accepted' | 'closed';
  categoryId?: string;
  minValue?: number;
  maxValue?: number;
}

export interface GetRfqReportResponse {
  report: RfqReport;
}

export interface GenerateCustomReportRequest {
  name: string;
  type: ReportType;
  parameters: Record<string, any>;
  filters: Record<string, any>;
  format?: ReportFormat;
  schedule?: {
    frequency: ReportFrequency;
    recipients: string[];
    timezone?: string;
  };
}

export interface GenerateCustomReportResponse {
  report: Report;
  message: string;
}

export interface GetReportsResponse {
  reports: PaginatedResponse<Report>;
}

export interface GetDashboardAnalyticsResponse {
  analytics: DashboardAnalytics;
}

export interface GetSystemHealthResponse {
  health: SystemHealth;
}

export interface GetRecentActivitiesResponse {
  activities: RecentActivity[];
  total: number;
}

// ================================
// FILTER TYPES
// ================================

export interface ReportFilter {
  page?: number;
  limit?: number;
  type?: ReportType;
  format?: ReportFormat;
  generatedBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: ('generating' | 'completed' | 'failed')[];
  search?: string;
}

// ================================
// REPORT API INTERFACE
// ================================

export interface ReportAPI {
  // Standard Reports
  getSalesReport(request?: GetSalesReportRequest): Promise<ApiResponse<GetSalesReportResponse>>;
  getProductReport(request?: GetProductReportRequest): Promise<ApiResponse<GetProductReportResponse>>;
  getCustomerReport(request?: GetCustomerReportRequest): Promise<ApiResponse<GetCustomerReportResponse>>;
  getVendorReport(request?: GetVendorReportRequest): Promise<ApiResponse<GetVendorReportResponse>>;
  getRfqReport(request?: GetRfqReportRequest): Promise<ApiResponse<GetRfqReportResponse>>;
  getSubscriptionReport(period?: string): Promise<ApiResponse<{ report: SubscriptionReport }>>;
  getCategoryReport(period?: string): Promise<ApiResponse<{ report: CategoryReport }>>;
  
  // Dashboard & Analytics
  getDashboardAnalytics(period?: string): Promise<ApiResponse<GetDashboardAnalyticsResponse>>;
  getRecentActivities(limit?: number, type?: string): Promise<ApiResponse<GetRecentActivitiesResponse>>;
  getSystemHealth(): Promise<ApiResponse<GetSystemHealthResponse>>;
  
  // Custom Reports
  generateCustomReport(request: GenerateCustomReportRequest): Promise<ApiResponse<GenerateCustomReportResponse>>;
  getAllReports(filter?: ReportFilter): Promise<ApiResponse<GetReportsResponse>>;
  getReportById(id: string): Promise<ApiResponse<{ report: Report }>>;
  deleteReport(id: string): Promise<ApiResponse<{ message: string }>>;
  downloadReport(id: string): Promise<Blob>;
  
  // Scheduled Reports
  scheduleReport(reportId: string, schedule: {
    frequency: ReportFrequency;
    recipients: string[];
    timezone?: string;
  }): Promise<ApiResponse<{ scheduled: boolean }>>;
  unscheduleReport(reportId: string): Promise<ApiResponse<{ unscheduled: boolean }>>;
  getScheduledReports(): Promise<ApiResponse<{ reports: Report[] }>>;
  
  // Export & Share
  exportReport(reportId: string, format: ReportFormat): Promise<Blob>;
  shareReport(reportId: string, recipients: string[], message?: string): Promise<ApiResponse<{ shared: boolean }>>;
  
  // Real-time Analytics
  getRealtimeMetrics(): Promise<ApiResponse<{
    onlineUsers: number;
    activeOrders: number;
    revenueToday: number;
    conversionRate: number;
  }>>;
  
  // Comparative Analysis
  compareReports(reportIds: string[]): Promise<ApiResponse<{
    comparison: {
      metrics: { metric: string; values: { reportId: string; value: number }[] }[];
      trends: { period: string; data: { reportId: string; value: number }[] }[];
    };
  }>>;
  
  // Data Export
  exportData(type: ReportType, filters: Record<string, any>, format: ReportFormat): Promise<Blob>;
  
  // Report Templates
  getReportTemplates(): Promise<ApiResponse<{
    templates: {
      id: string;
      name: string;
      type: ReportType;
      description: string;
      parameters: string[];
    }[];
  }>>;
  createReportFromTemplate(templateId: string, parameters: Record<string, any>): Promise<ApiResponse<GenerateCustomReportResponse>>;
}