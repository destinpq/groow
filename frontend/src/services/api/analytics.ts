import featureFlags, { logMockUsage } from '@/config/featureFlags';
import api from './client';
import { PaginatedResponse } from '../../types/api/common';
import {
  Report,
  SalesReport as ReportSalesReport,
  ProductReport,
  CustomerReport,
  VendorReport,
  DashboardAnalytics,
  SystemHealth,
  ReportType,
  ReportFormat,
  ReportFrequency,
  GetSalesReportRequest,
  GetSalesReportResponse,
  GetProductReportRequest,
  GetProductReportResponse,
  GetCustomerReportRequest,
  GetCustomerReportResponse
} from '../../types/api/reports';

// ============================================
// B2B Enterprise Analytics Types (temporary for backend integration)
// ============================================

// Advanced B2B Analytics Dashboard Types
interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'gauge' | 'heatmap' | 'funnel' | 'cohort';
  title: string;
  position: { x: number; y: number; width: number; height: number };
  dataSource: string;
  visualization: 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'scatter' | 'bubble';
  config: {
    metrics: string[];
    dimensions: string[];
    filters: Record<string, any>;
    aggregation: 'sum' | 'avg' | 'count' | 'max' | 'min';
    timeGranularity: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
    compareWith?: 'previous_period' | 'same_period_last_year';
    drillDown?: string[];
    formatting?: {
      currency?: string;
      decimals?: number;
      unit?: string;
      prefix?: string;
      suffix?: string;
    };
    thresholds?: Array<{
      value: number;
      color: string;
      condition: 'above' | 'below' | 'equal';
    }>;
  };
  permissions: {
    view: string[];
    edit: string[];
    export: string[];
  };
}

interface AnalyticsDashboardConfig {
  id: string;
  name: string;
  description?: string;
  type: 'executive' | 'operational' | 'sales' | 'marketing' | 'finance' | 'procurement' | 'custom';
  widgets: DashboardWidget[];
  layout: {
    grid: { rows: number; cols: number };
    responsive: boolean;
    autoLayout: boolean;
  };
  filters: {
    global: Record<string, any>;
    timeRange: { start: string; end: string; preset?: string };
    segments: string[];
    customFilters: Array<{
      field: string;
      operator: string;
      value: any;
      label: string;
    }>;
  };
  sharing: {
    visibility: 'private' | 'team' | 'organization' | 'public';
    permissions: string[];
    embedCode?: string;
    publicUrl?: string;
  };
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    recipients: string[];
    format: 'pdf' | 'excel' | 'image';
  };
}

// Advanced Analytics Report Types
interface AnalyticsReportConfig {
  id: string;
  title: string;
  description?: string;
  type: 'performance' | 'compliance' | 'financial' | 'operational' | 'strategic' | 'ad_hoc';
  template: {
    sections: Array<{
      id: string;
      title: string;
      type: 'summary' | 'chart' | 'table' | 'text' | 'metrics' | 'insights';
      config: Record<string, any>;
    }>;
    branding: {
      logo?: string;
      colors: Record<string, string>;
      fonts: Record<string, string>;
      footer?: string;
    };
  };
  dataSource: {
    metrics: string[];
    dimensions: string[];
    filters: Record<string, any>;
    timeRange: { start: string; end: string };
    granularity: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
  };
  automation: {
    schedule?: {
      frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
      time: string;
      timezone: string;
      recipients: string[];
    };
    triggers?: Array<{
      condition: string;
      threshold: number;
      action: 'generate' | 'alert' | 'email';
    }>;
  };
  distribution: {
    formats: ('pdf' | 'excel' | 'csv' | 'json')[];
    channels: ('email' | 'slack' | 'webhook' | 'dashboard')[];
    recipients: Array<{
      type: 'user' | 'role' | 'email';
      value: string;
      permissions: string[];
    }>;
  };
}

// Business Intelligence & Analytics Types
interface BusinessIntelligence {
  insights: Array<{
    type: 'trend' | 'anomaly' | 'prediction' | 'recommendation' | 'alert';
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number; // 0-100
    metrics: Record<string, number>;
    timeframe: string;
    actionable: boolean;
    recommendations: string[];
    impact: {
      revenue?: number;
      cost?: number;
      efficiency?: number;
    };
    relatedEntities: Array<{
      type: 'product' | 'vendor' | 'customer' | 'category';
      id: string;
      name: string;
    }>;
  }>;
  predictions: Array<{
    metric: string;
    timeframe: string;
    predicted_value: number;
    confidence_interval: { lower: number; upper: number };
    factors: Array<{
      name: string;
      impact: number;
      description: string;
    }>;
  }>;
  benchmarks: Array<{
    metric: string;
    current_value: number;
    industry_benchmark: number;
    top_quartile: number;
    percentile: number;
    trend: 'improving' | 'declining' | 'stable';
  }>;
}

// Customer Segmentation & Cohort Analysis
interface AdvancedSegmentation {
  segments: Array<{
    id: string;
    name: string;
    type: 'behavioral' | 'demographic' | 'firmographic' | 'value_based' | 'lifecycle';
    criteria: Record<string, any>;
    size: number;
    growth_rate: number;
    characteristics: {
      average_order_value: number;
      purchase_frequency: number;
      lifetime_value: number;
      churn_risk: 'low' | 'medium' | 'high';
      profitability: number;
      engagement_score: number;
    };
    recommendations: string[];
  }>;
  cohortAnalysis: {
    retention_matrix: number[][];
    timeframes: string[];
    segments: string[];
    insights: Array<{
      period: string;
      retention_rate: number;
      revenue_impact: number;
      key_factors: string[];
    }>;
  };
  clv_analysis: {
    overall_clv: number;
    by_segment: Record<string, number>;
    predictive_clv: Array<{
      customer_id: string;
      predicted_clv: number;
      risk_factors: string[];
      opportunities: string[];
    }>;
  };
}

// Market & Competitive Intelligence
interface MarketIntelligence {
  marketAnalysis: {
    market_size: number;
    growth_rate: number;
    our_share: number;
    addressable_market: number;
    trends: Array<{
      trend: string;
      impact: 'positive' | 'negative' | 'neutral';
      timeline: string;
      probability: number;
    }>;
  };
  competitiveAnalysis: {
    competitors: Array<{
      name: string;
      market_share: number;
      strengths: string[];
      weaknesses: string[];
      pricing_position: 'premium' | 'competitive' | 'value';
      differentiation: string[];
    }>;
    positioning: {
      our_position: string;
      gaps: string[];
      opportunities: string[];
      threats: string[];
    };
  };
  priceAnalysis: {
    pricing_intelligence: Array<{
      product_category: string;
      our_avg_price: number;
      market_avg_price: number;
      competitor_range: { min: number; max: number };
      price_elasticity: number;
      recommendations: string[];
    }>;
  };
}

// Supply Chain & Vendor Analytics
interface SupplyChainAnalytics {
  vendorPerformance: Array<{
    vendor_id: string;
    vendor_name: string;
    performance_score: number;
    metrics: {
      on_time_delivery: number;
      quality_score: number;
      cost_efficiency: number;
      responsiveness: number;
      compliance_score: number;
    };
    trends: Array<{
      metric: string;
      direction: 'improving' | 'declining' | 'stable';
      change_rate: number;
    }>;
    risk_assessment: {
      overall_risk: 'low' | 'medium' | 'high';
      risk_factors: string[];
      mitigation_strategies: string[];
    };
  }>;
  procurement_analytics: {
    spend_analysis: Array<{
      category: string;
      total_spend: number;
      vendor_count: number;
      avg_order_value: number;
      cost_trends: number[];
    }>;
    sourcing_opportunities: Array<{
      category: string;
      potential_savings: number;
      effort_required: 'low' | 'medium' | 'high';
      timeline: string;
      recommendations: string[];
    }>;
  };
}

// Re-export types for convenience and maintain existing interface names
export type AnalyticsOverview = DashboardAnalytics;
export type AnalyticsConfig = SystemHealth; // Use as config placeholder

// Keep existing comprehensive interfaces for backward compatibility

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
  segments?: {
    b2b: {
      revenue: number;
      orders: number;
      aov: number;
      margin: number;
    };
    b2c: {
      revenue: number;
      orders: number;
      aov: number;
      margin: number;
    };
  };
  channels?: Array<{
    channel: string;
    revenue: number;
    orders: number;
    growth: number;
  }>;
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
  competitivePosition?: {
    market_rank: number;
    price_vs_competitors: number;
    feature_score: number;
  };
  lifecycle?: {
    stage: 'introduction' | 'growth' | 'maturity' | 'decline';
    days_in_stage: number;
    next_action: string;
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
    churnRisk?: 'low' | 'medium' | 'high';
    profitability?: 'low' | 'medium' | 'high';
  }[];
  satisfaction?: {
    nps_score: number;
    satisfaction_rating: number;
    support_ticket_volume: number;
    resolution_time: number;
  };
  engagement?: {
    email_open_rate: number;
    click_through_rate: number;
    app_usage: number;
    feature_adoption: Record<string, number>;
  };
}

export interface SalesReport {
  id: string;
  title: string;
  description: string;
  type: ReportType;
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
  format: ReportFormat;
  insights?: {
    key_findings: string[];
    recommendations: string[];
    risks: string[];
    opportunities: string[];
  };
  benchmarks?: {
    industry_avg: Record<string, number>;
    top_quartile: Record<string, number>;
    our_performance: Record<string, number>;
  };
}

export interface CompetitorAnalysis {
  competitor: string;
  marketShare: number;
  priceComparison: number;
  performanceGap: number;
  opportunities: string[];
  strengths: string[];
  weaknesses: string[];
  market_position: 'leader' | 'challenger' | 'follower' | 'niche';
}

export interface ForecastData {
  date: string;
  predictedRevenue: number;
  predictedOrders: number;
  confidence: number;
  seasonalFactor: number;
  trendFactor: number;
  external_factors?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  scenarios?: {
    optimistic: { revenue: number; orders: number };
    realistic: { revenue: number; orders: number };
    pessimistic: { revenue: number; orders: number };
  };
}

export interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  uniqueVisitors: number;
  sessionsPerUser: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversion_funnel?: {
    visitors: number;
    product_views: number;
    add_to_cart: number;
    checkout_started: number;
    orders: number;
  };
  user_journey?: Array<{
    step: string;
    users: number;
    dropout_rate: number;
    avg_time: number;
  }>;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  refunds: number;
  netRevenue: number;
  profit: number;
  costs: number;
  margin?: number;
  tax?: number;
  shipping?: number;
  discounts?: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  bounceRate: number;
  conversionRate: number;
  revenue: number;
  customerAcquisitionCost: number;
  attribution?: {
    first_click: number;
    last_click: number;
    linear: number;
    time_decay: number;
  };
  quality_score?: number;
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
  vendor?: {
    id: string;
    name: string;
    performance_score: number;
  };
  growth_metrics?: {
    sales_growth: number;
    revenue_growth: number;
    market_share_growth: number;
  };
}

export interface TopCategory {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  products: number;
  growth: number;
  profitMargin: number;
  market_trends?: {
    demand_trend: 'increasing' | 'stable' | 'decreasing';
    seasonal_pattern: string;
    competition_level: 'low' | 'medium' | 'high';
  };
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
  satisfaction_metrics?: {
    nps: number;
    csat: number;
    ces: number;
    support_satisfaction: number;
  };
  engagement_metrics?: {
    login_frequency: number;
    feature_usage: Record<string, number>;
    content_engagement: number;
  };
}

export interface PageView {
  page: string;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number; // in seconds
  bounceRate: number;
  exit_rate?: number;
  page_value?: number;
  conversion_rate?: number;
}

export interface ConversionFunnel {
  step: string;
  stepNumber: number;
  users: number;
  dropoffRate: number;
  conversionRate: number;
  avg_time_to_convert?: number;
  revenue_impact?: number;
  optimization_opportunities?: string[];
}

export interface AnalyticsEvent {
  id: string;
  event: string;
  category: string;
  count: number;
  value: number;
  change: number;
  timestamp: string;
  user_segments?: Record<string, number>;
  device_breakdown?: Record<string, number>;
  geographic_breakdown?: Record<string, number>;
}

export interface GeographicData {
  country: string;
  countryCode: string;
  visitors: number;
  revenue: number;
  orders: number;
  avg_order_value?: number;
  conversion_rate?: number;
  market_potential?: {
    addressable_market: number;
    penetration_rate: number;
    growth_opportunity: 'low' | 'medium' | 'high';
  };
}

export interface DeviceStats {
  device: 'desktop' | 'mobile' | 'tablet';
  visitors: number;
  percentage: number;
  bounceRate: number;
  conversionRate: number;
  revenue_share?: number;
  user_experience_score?: number;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  granularity?: 'hour' | 'day' | 'week' | 'month';
  compareWith?: 'previous-period' | 'previous-year';
  category?: string;
  productId?: string;
  customerId?: string;
  vendorId?: string;
  channel?: string;
  region?: string;
  segment?: string;
  userType?: 'b2b' | 'b2c' | 'all';
  orderSize?: 'small' | 'medium' | 'large' | 'enterprise';
  customerTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// ========================================
// Enhanced B2B Enterprise Analytics API Service
// ========================================

const isProductionEnvironment = process.env.NODE_ENV === 'production';
const shouldMockAnalytics = featureFlags.useMockAnalytics;

const formatDateLabel = (offset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  return date.toISOString().slice(0, 10);
};

const buildRevenueChartData = (): RevenueData[] =>
  Array.from({ length: 7 }, (_, index) => {
    const base = 18000 + index * 2500;
    return {
      date: formatDateLabel(6 - index),
      revenue: base,
      orders: Math.round(base / 240),
      refunds: Math.round(base * 0.02),
      netRevenue: Math.round(base * 0.95),
      profit: Math.round(base * 0.32),
      costs: Math.round(base * 0.58),
      margin: 32,
      tax: Math.round(base * 0.05),
      shipping: Math.round(base * 0.03),
      discounts: Math.round(base * 0.04),
    };
  });

const mockSalesMetrics = (): SalesMetrics => ({
  id: 'mock-sales-metrics',
  totalRevenue: 128000,
  totalOrders: 342,
  averageOrderValue: 374.2,
  conversionRate: 3.4,
  period: 'last_7_days',
  date: new Date().toISOString(),
  growth: {
    revenue: 8.2,
    orders: 5.4,
    aov: 2.1,
    conversion: 0.4,
  },
  profitMargins: {
    gross: 42,
    net: 18,
    operating: 12,
  },
  segments: {
    b2b: {
      revenue: 72000,
      orders: 142,
      aov: 507,
      margin: 28,
    },
    b2c: {
      revenue: 36000,
      orders: 150,
      aov: 240,
      margin: 22,
    },
  },
  channels: [
    { channel: 'Organic', revenue: 42000, orders: 112, growth: 6 },
    { channel: 'Paid', revenue: 36000, orders: 96, growth: 9 },
    { channel: 'Partner', revenue: 22000, orders: 54, growth: 4 },
  ],
});

const mockTopProducts = (): ProductAnalytics[] => [
  {
    id: 'prod-1',
    name: 'AI Support Suite',
    category: 'Software',
    totalSold: 182,
    revenue: 54000,
    averageRating: 4.8,
    views: 3800,
    conversionRate: 4.2,
    profit: 22000,
    marginPercentage: 41,
    inventory: 320,
    stockTurnover: 7,
    competitivePosition: {
      market_rank: 1,
      price_vs_competitors: 1.05,
      feature_score: 92,
    },
    lifecycle: {
      stage: 'growth',
      days_in_stage: 120,
      next_action: 'expand enterprise tier',
    },
  },
  {
    id: 'prod-2',
    name: 'Edge Security Appliance',
    category: 'Hardware',
    totalSold: 96,
    revenue: 31000,
    averageRating: 4.6,
    views: 2100,
    conversionRate: 3.1,
    profit: 12000,
    marginPercentage: 38,
    inventory: 140,
    stockTurnover: 5,
    competitivePosition: {
      market_rank: 2,
      price_vs_competitors: 0.98,
      feature_score: 88,
    },
    lifecycle: {
      stage: 'maturity',
      days_in_stage: 260,
      next_action: 'launch refresh campaign',
    },
  },
  {
    id: 'prod-3',
    name: 'Managed Cloud Migration',
    category: 'Services',
    totalSold: 48,
    revenue: 28000,
    averageRating: 4.9,
    views: 950,
    conversionRate: 5.6,
    profit: 14000,
    marginPercentage: 50,
    inventory: 999,
    stockTurnover: 10,
    competitivePosition: {
      market_rank: 1,
      price_vs_competitors: 1.1,
      feature_score: 95,
    },
    lifecycle: {
      stage: 'growth',
      days_in_stage: 90,
      next_action: 'scale delivery teams',
    },
  },
];

const mockCustomerInsights = (): CustomerAnalytics => ({
  totalCustomers: 1820,
  newCustomers: 148,
  returningCustomers: 540,
  customerLifetimeValue: 1840,
  churnRate: 3.1,
  acquisitionCost: 42,
  retentionRate: 86,
  avgOrdersPerCustomer: 2.8,
  segments: [
    { segment: 'Enterprise', count: 120, revenue: 62000, avgOrderValue: 520, retentionRate: 92, profitability: 'high' },
    { segment: 'SMB', count: 420, revenue: 38000, avgOrderValue: 180, retentionRate: 83, profitability: 'medium' },
    { segment: 'Consumer', count: 1280, revenue: 28000, avgOrderValue: 96, retentionRate: 68, profitability: 'medium' },
  ],
  satisfaction: {
    nps_score: 62,
    satisfaction_rating: 4.6,
    support_ticket_volume: 132,
    resolution_time: 3.2,
  },
  engagement: {
    email_open_rate: 34,
    click_through_rate: 5.2,
    app_usage: 68,
    feature_adoption: {
      analytics: 72,
      automation: 58,
      marketplace: 41,
    },
  },
});

const mockTrafficOverview = (): TrafficData[] =>
  Array.from({ length: 7 }, (_, index) => {
    const visitors = 4200 + index * 120;
    return {
      date: formatDateLabel(6 - index),
      visitors,
      pageViews: visitors * 2.4,
      uniqueVisitors: visitors * 0.82,
      sessionsPerUser: 1.6,
      avgSessionDuration: 185 + index * 3,
      bounceRate: 41 - index * 0.4,
      conversion_funnel: {
        visitors,
        product_views: Math.round(visitors * 0.62),
        add_to_cart: Math.round(visitors * 0.21),
        checkout_started: Math.round(visitors * 0.12),
        orders: Math.round(visitors * 0.034),
      },
      user_journey: [
        { step: 'Landing', users: visitors, dropout_rate: 0, avg_time: 35 },
        { step: 'Browse', users: Math.round(visitors * 0.72), dropout_rate: 28, avg_time: 58 },
        { step: 'Configure', users: Math.round(visitors * 0.38), dropout_rate: 47, avg_time: 110 },
        { step: 'Checkout', users: Math.round(visitors * 0.14), dropout_rate: 63, avg_time: 160 },
      ],
    };
  });

const mockDashboardData = () => ({
  salesMetrics: mockSalesMetrics(),
  revenueChart: buildRevenueChartData(),
  topProducts: mockTopProducts(),
  customerInsights: mockCustomerInsights(),
  trafficOverview: mockTrafficOverview(),
  recentActivity: [
    { title: 'Order #A1042 paid', description: '₹42,800 from Northwind Retail', timestamp: '5 min ago', status: 'success' },
    { title: 'High value lead', description: 'Enterprise lead from FinEdge', timestamp: '18 min ago', status: 'info' },
    { title: 'Inventory notice', description: 'Security appliance below threshold', timestamp: '1 hr ago', status: 'warning' },
  ],
  quickInsights: [
    { title: 'Top Region', value: 'Bengaluru', change: '+6.3%' },
    { title: 'Churn Risk', value: '3.1%', change: '-0.4%' },
    { title: 'Avg Fulfillment', value: '1.9 days', change: '-0.2d' },
  ],
  performanceIndicators: {
    revenue: { value: 128000, target: 150000, status: 'at_risk' },
    fulfillment: { value: 96, target: 95, status: 'on_track' },
    retention: { value: 86, target: 85, status: 'on_track' },
    nps: { value: 62, target: 65, status: 'at_risk' },
  },
});

const mockExecutiveDashboard = () => ({
  kpis: {
    revenue: { value: 128000, change: 8.2, trend: 'up' },
    profit: { value: 38400, change: 5.6, trend: 'up' },
    pipeline: { value: 48, change: -3.1, trend: 'down' },
  },
  revenue_breakdown: { b2b: 72000, b2c: 36000, enterprise: 20000 },
  customer_health: { nps: 62, churn_rate: 3.1, satisfaction: 4.6 },
  market_position: { market_share: 18, competitive_rank: 2 },
  operational_efficiency: { profit_margin: 18, cost_per_acquisition: 42 },
  growth_metrics: { revenue_growth: 8.2, customer_growth: 5.1, market_expansion: 2.3 },
  risk_indicators: [
    { type: 'supply_chain', level: 'medium', description: 'Lead time up 12% for hardware SKUs' },
    { type: 'currency', level: 'low', description: 'INR volatility within guardrails' },
  ],
  strategic_insights: [
    { category: 'enterprise', insight: 'Upsell demand for managed services', priority: 'high' },
    { category: 'marketing', insight: 'Organic pipeline exceeding paid for first time', priority: 'medium' },
  ],
});

const mockBusinessIntelligence = (): BusinessIntelligence => ({
  insights: [
    {
      type: 'trend',
      title: 'B2B revenue acceleration',
      description: 'Enterprise contracts grew 11% WoW.',
      severity: 'medium',
      confidence: 82,
      metrics: { revenue: 72000, orders: 18 },
      timeframe: 'last_7_days',
      actionable: true,
      recommendations: ['Increase account-based marketing budget', 'Prioritize enterprise onboarding squad'],
      impact: { revenue: 18000 },
      relatedEntities: [{ type: 'vendor', id: 'v-1', name: 'Northwind Tech' }],
    },
  ],
  predictions: [
    {
      metric: 'revenue',
      timeframe: 'next_30_days',
      predicted_value: 182000,
      confidence_interval: { lower: 168000, upper: 195000 },
      factors: [
        { name: 'seasonality', impact: 0.3, description: 'Holiday procurement cycle' },
        { name: 'pipeline', impact: 0.2, description: 'Enterprise deals in negotiation' },
      ],
    },
  ],
  benchmarks: [
    {
      metric: 'conversion_rate',
      current_value: 3.4,
      industry_benchmark: 2.8,
      top_quartile: 3.9,
      percentile: 78,
      trend: 'improving',
    },
  ],
});

const mockVendorPerformance = () => ({
  vendors: [
    {
      vendor_id: 'v-1',
      name: 'Northwind Tech',
      performance_score: 92,
      delivery_performance: 95,
      quality_score: 94,
      cost_efficiency: 86,
      risk_level: 'low',
      recommendations: ['Expand capacity for managed services'],
    },
    {
      vendor_id: 'v-2',
      name: 'Contoso Logistics',
      performance_score: 78,
      delivery_performance: 74,
      quality_score: 82,
      cost_efficiency: 80,
      risk_level: 'medium',
      recommendations: ['Improve on-time dispatch rate'],
    },
  ],
  benchmarks: {
    delivery_performance: { average: 88, top_quartile: 94, industry_standard: 85 },
    quality_score: { average: 86, top_quartile: 93, industry_standard: 84 },
    cost_efficiency: { average: 80, top_quartile: 86, industry_standard: 78 },
  },
  optimization_opportunities: [
    {
      vendor_id: 'v-2',
      opportunity: 'Streamline customs documentation',
      potential_savings: 12000,
      implementation_effort: 'medium',
    },
  ],
});

const mockRealTimeMetrics = () => ({
  currentVisitors: 148,
  activeOrders: 32,
  todayRevenue: 18420,
  conversionRate: 3.6,
  recentOrders: [
    { customer: 'Nexus Labs', amount: 4200, product: 'AI Support Suite', timestamp: new Date().toISOString() },
    { customer: 'BluePeak Retail', amount: 980, product: 'Managed Cloud Migration', timestamp: new Date().toISOString() },
  ],
  topPages: [
    { page: '/admin/analytics', visitors: 48 },
    { page: '/marketplace/services', visitors: 36 },
    { page: '/pricing', visitors: 24 },
  ],
  system_health: { status: 'healthy', uptime: 99.97 },
  live_transactions: [
    { amount: 1200, customer: 'Helios Ventures', product: 'Edge Security Appliance', timestamp: new Date().toISOString() },
    { amount: 640, customer: 'DigitalCraft', product: 'Cloud Optimization', timestamp: new Date().toISOString() },
  ],
});

const handleAnalyticsRequest = async <T>(
  label: string,
  request: () => Promise<T>,
  fallback: () => T,
): Promise<T> => {
  if (shouldMockAnalytics) {
    logMockUsage(`analytics.${label}`);
    return fallback();
  }

  try {
    return await request();
  } catch (error) {
    if (!isProductionEnvironment) {
      logMockUsage(`analytics.${label}`, error);
      return fallback();
    }
    throw error;
  }
};

export const analyticsAPI = {
  // ========================================
  // Executive Dashboard & Overview with Business Intelligence
  // ========================================
  getExecutiveDashboard: async (filters?: AnalyticsFilters): Promise<{
    kpis: Record<string, { value: number; change: number; trend: 'up' | 'down' | 'stable' }>;
    revenue_breakdown: { b2b: number; b2c: number; enterprise: number };
    customer_health: { nps: number; churn_rate: number; satisfaction: number };
    market_position: { market_share: number; competitive_rank: number };
    operational_efficiency: { profit_margin: number; cost_per_acquisition: number };
    growth_metrics: { revenue_growth: number; customer_growth: number; market_expansion: number };
    risk_indicators: Array<{ type: string; level: 'low' | 'medium' | 'high'; description: string }>;
    strategic_insights: Array<{ category: string; insight: string; priority: 'low' | 'medium' | 'high' }>;
  }> => {
    return handleAnalyticsRequest(
      'getExecutiveDashboard',
      async () => {
        const response = await api.get('/analytics/executive-dashboard', {
          params: filters,
        });
        return response.data;
      },
      mockExecutiveDashboard,
    );
  },

  getBusinessIntelligence: async (filters?: AnalyticsFilters): Promise<BusinessIntelligence> => {
    return handleAnalyticsRequest(
      'getBusinessIntelligence',
      async () => {
        const response = await api.get('/analytics/business-intelligence', {
          params: filters,
        });
        return response.data;
      },
      mockBusinessIntelligence,
    );
  },

  getOverview: async (filters?: AnalyticsFilters): Promise<AnalyticsOverview> => {
    const response = await api.get<DashboardAnalytics>('/analytics/overview', {
      params: filters,
    });
    return response.data;
  },

  getCustomDashboard: async (dashboardId: string, filters?: AnalyticsFilters): Promise<AnalyticsDashboardConfig> => {
    const response = await api.get(`/analytics/dashboards/${dashboardId}`, {
      params: filters,
    });
    return response.data;
  },

  createDashboard: async (config: Partial<AnalyticsDashboardConfig>): Promise<AnalyticsDashboardConfig> => {
    const response = await api.post('/analytics/dashboards', config);
    return response.data;
  },

  updateDashboard: async (dashboardId: string, config: Partial<AnalyticsDashboardConfig>): Promise<AnalyticsDashboardConfig> => {
    const response = await api.put(`/analytics/dashboards/${dashboardId}`, config);
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
    performanceIndicators: Record<string, { value: number; target: number; status: 'on_track' | 'at_risk' | 'behind' }>;
  }> => {
    return handleAnalyticsRequest(
      'getDashboardData',
      async () => {
        const response = await api.get('/analytics/dashboard', {
          params: filters,
        });
        return response.data?.data || response.data;
      },
      mockDashboardData,
    );
  },

  getRealTimeMetrics: async (): Promise<{
    currentVisitors: number;
    activeOrders: number;
    todayRevenue: number;
    conversionRate: number;
    recentOrders: any[];
    topPages: { page: string; visitors: number }[];
    system_health: { status: 'healthy' | 'warning' | 'critical'; uptime: number };
    live_transactions: Array<{ amount: number; customer: string; product: string; timestamp: string }>;
  }> => {
    return handleAnalyticsRequest(
      'getRealTimeMetrics',
      async () => {
        const response = await api.get('/analytics/realtime');
        return response.data?.data || response.data;
      },
      mockRealTimeMetrics,
    );
  },

  // ========================================
  // Advanced Sales Analytics & Forecasting
  // ========================================
  getSalesMetrics: async (filters?: AnalyticsFilters): Promise<SalesMetrics> => {
    return handleAnalyticsRequest(
      'getSalesMetrics',
      async () => {
        const response = await api.get<SalesMetrics>('/analytics/sales/metrics', {
          params: filters,
        });
        return response.data;
      },
      mockSalesMetrics,
    );
  },

  getSalesForecasting: async (
    timeframe: '30d' | '90d' | '180d' | '1y',
    scenarios: ('optimistic' | 'realistic' | 'pessimistic')[] = ['realistic']
  ): Promise<{
    forecasts: ForecastData[];
    scenarios: Record<string, ForecastData[]>;
    key_drivers: Array<{ factor: string; impact: number; description: string }>;
    confidence_intervals: Array<{ date: string; lower: number; upper: number }>;
    seasonality_analysis: {
      seasonal_patterns: Array<{ period: string; multiplier: number }>;
      holiday_impacts: Array<{ holiday: string; impact: number }>;
    };
  }> => {
    const response = await api.get('/analytics/sales/forecasting', {
      params: { timeframe, scenarios },
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
    variance_analysis: Array<{
      metric: string;
      current: number;
      previous: number;
      change: number;
      significance: 'significant' | 'moderate' | 'minimal';
    }>;
  }> => {
    const response = await api.post('/analytics/sales/comparison', {
      currentPeriod,
      previousPeriod,
    });
    return response.data;
  },

  getSalesTrends: async (filters?: AnalyticsFilters): Promise<{
    trends: Array<{
      metric: string;
      direction: 'increasing' | 'decreasing' | 'stable';
      strength: 'strong' | 'moderate' | 'weak';
      timeline: string;
      projected_impact: number;
    }>;
    anomalies: Array<{
      date: string;
      metric: string;
      expected: number;
      actual: number;
      deviation: number;
      possible_causes: string[];
    }>;
  }> => {
    const response = await api.get('/analytics/sales/trends', {
      params: filters,
    });
    return response.data;
  },

  // ========================================
  // Advanced Product Analytics & Intelligence
  // ========================================
  getProductAnalytics: async (filters?: AnalyticsFilters): Promise<ProductAnalytics[]> => {
    const requestData: GetProductReportRequest = {
      period: filters?.startDate ? 'custom' : 'month',
      categoryId: filters?.category,
      status: 'all',
      sortBy: 'revenue'
    };
    const response = await api.get<GetProductReportResponse>('/analytics/products', {
      params: requestData,
    });
    
    // Transform ProductReport to ProductAnalytics format with enhanced B2B features
    const reportData = response.data.report as any;
    const products = reportData?.products || reportData?.items || reportData || [];
    return Array.isArray(products) ? products.map((product: any) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      totalSold: product.quantitySold || product.sales || 0,
      revenue: product.revenue || 0,
      averageRating: product.averageRating || 0,
      views: product.views || 0,
      conversionRate: product.conversionRate || 0,
      profit: product.profit || product.revenue * 0.2,
      marginPercentage: product.marginPercentage || 20,
      inventory: product.stock || 0,
      stockTurnover: product.stockTurnover || 0,
      competitivePosition: {
        market_rank: product.market_rank || 0,
        price_vs_competitors: product.price_comparison || 0,
        feature_score: product.feature_score || 0,
      },
      lifecycle: {
        stage: product.lifecycle_stage || 'maturity',
        days_in_stage: product.days_in_stage || 0,
        next_action: product.next_action || 'monitor',
      },
    })) : [];
  },

  getProductIntelligence: async (productId: string, filters?: AnalyticsFilters): Promise<{
    performance: ProductAnalytics;
    competitive_analysis: Array<{
      competitor: string;
      price_difference: number;
      feature_comparison: Record<string, boolean>;
      market_position: string;
    }>;
    demand_forecasting: ForecastData[];
    optimization_opportunities: Array<{
      area: string;
      potential_impact: number;
      effort_required: 'low' | 'medium' | 'high';
      recommendation: string;
    }>;
    customer_feedback: {
      sentiment_score: number;
      key_themes: Array<{ theme: string; mentions: number; sentiment: 'positive' | 'negative' | 'neutral' }>;
      improvement_areas: string[];
    };
  }> => {
    const response = await api.get(`/analytics/products/${productId}/intelligence`, {
      params: filters,
    });
    return response.data;
  },

  getProductPerformance: async (productId: string, filters?: AnalyticsFilters): Promise<{
    analytics: ProductAnalytics;
    salesHistory: RevenueData[];
    competitorComparison: CompetitorAnalysis[];
    recommendations: string[];
    cross_sell_opportunities: Array<{ product_id: string; product_name: string; lift_potential: number }>;
    price_optimization: {
      current_price: number;
      optimal_price: number;
      elasticity: number;
      demand_impact: number;
    };
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
    market_opportunities: Array<{
      category: string;
      opportunity_size: number;
      competition_level: 'low' | 'medium' | 'high';
      entry_difficulty: 'easy' | 'moderate' | 'difficult';
    }>;
  }> => {
    const response = await api.get('/analytics/products/trends', {
      params: filters,
    });
    return response.data;
  },

  // ========================================
  // Advanced Customer Analytics & Segmentation
  // ========================================
  getCustomerAnalytics: async (filters?: AnalyticsFilters): Promise<CustomerAnalytics> => {
    const response = await api.get<CustomerAnalytics>('/analytics/customers', {
      params: filters,
    });
    return response.data;
  },

  getAdvancedSegmentation: async (filters?: AnalyticsFilters): Promise<AdvancedSegmentation> => {
    const response = await api.get('/analytics/customers/advanced-segmentation', {
      params: filters,
    });
    return response.data;
  },

  getCustomerSegmentation: async (filters?: AnalyticsFilters): Promise<{
    segments: CustomerAnalytics['segments'];
    trends: any[];
    churnPrediction: Array<{
      customer_id: string;
      customer_name: string;
      churn_probability: number;
      risk_factors: string[];
      recommended_actions: string[];
    }>;
    segment_migration: Array<{
      from_segment: string;
      to_segment: string;
      customer_count: number;
      revenue_impact: number;
    }>;
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
    predictions: Array<{
      customer_id: string;
      current_clv: number;
      predicted_clv: number;
      confidence: number;
      growth_drivers: string[];
    }>;
    optimization_strategies: Array<{
      segment: string;
      current_clv: number;
      potential_clv: number;
      strategies: string[];
    }>;
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
    retentionDrivers: Array<{
      factor: string;
      correlation: number;
      impact: 'high' | 'medium' | 'low';
    }>;
    winback_opportunities: Array<{
      customer_id: string;
      days_inactive: number;
      previous_clv: number;
      winback_probability: number;
      recommended_offer: string;
    }>;
  }> => {
    const response = await api.get('/analytics/customers/retention', {
      params: filters,
    });
    return response.data;
  },

  // ========================================
  // Market Intelligence & Competitive Analysis
  // ========================================
  getMarketIntelligence: async (filters?: AnalyticsFilters): Promise<MarketIntelligence> => {
    const response = await api.get('/analytics/market-intelligence', {
      params: filters,
    });
    return response.data;
  },

  getCompetitiveAnalysis: async (filters?: AnalyticsFilters): Promise<{
    competitor_landscape: Array<{
      competitor: string;
      market_share: number;
      strengths: string[];
      weaknesses: string[];
      pricing_strategy: string;
      target_segments: string[];
    }>;
    market_positioning: {
      our_position: { x: number; y: number; label: string };
      competitors: Array<{ name: string; x: number; y: number }>;
      opportunities: Array<{ description: string; position: { x: number; y: number } }>;
    };
    competitive_gaps: Array<{
      area: string;
      gap_size: number;
      opportunity_value: number;
      time_to_close: string;
    }>;
  }> => {
    const response = await api.get('/analytics/competitive-analysis', {
      params: filters,
    });
    return response.data;
  },

  // ========================================
  // Supply Chain & Vendor Analytics
  // ========================================
  getSupplyChainAnalytics: async (filters?: AnalyticsFilters): Promise<SupplyChainAnalytics> => {
    const response = await api.get('/analytics/supply-chain', {
      params: filters,
    });
    return response.data;
  },

  getVendorPerformance: async (filters?: AnalyticsFilters): Promise<{
    vendors: Array<{
      vendor_id: string;
      name: string;
      performance_score: number;
      delivery_performance: number;
      quality_score: number;
      cost_efficiency: number;
      risk_level: 'low' | 'medium' | 'high';
      recommendations: string[];
    }>;
    benchmarks: Record<string, { average: number; top_quartile: number; industry_standard: number }>;
    optimization_opportunities: Array<{
      vendor_id: string;
      opportunity: string;
      potential_savings: number;
      implementation_effort: 'low' | 'medium' | 'high';
    }>;
  }> => {
    return handleAnalyticsRequest(
      'getVendorPerformance',
      async () => {
        const response = await api.get('/analytics/vendors/performance', {
          params: filters,
        });
        return response.data;
      },
      mockVendorPerformance,
    );
  },

  // ========================================
  // Traffic & Conversion Analytics
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

  getAttributionAnalysis: async (filters?: AnalyticsFilters): Promise<{
    touchpoints: Array<{
      touchpoint: string;
      influence: number;
      conversions: number;
      revenue_attributed: number;
    }>;
    attributionModel: {
      first_click: Record<string, number>;
      last_click: Record<string, number>;
      linear: Record<string, number>;
      time_decay: Record<string, number>;
      position_based: Record<string, number>;
    };
    conversionPaths: Array<{
      path: string[];
      frequency: number;
      conversion_rate: number;
      average_value: number;
    }>;
    channelEffectiveness: Array<{
      channel: string;
      efficiency_score: number;
      roi: number;
      optimization_potential: number;
    }>;
  }> => {
    const response = await api.get('/analytics/attribution', {
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
  // Revenue & Financial Analytics
  // ========================================
  getRevenueData: async (filters?: AnalyticsFilters): Promise<RevenueData[]> => {
    const response = await api.get<RevenueData[]>('/analytics/revenue', {
      params: filters,
    });
    return response.data;
  },

  getFinancialAnalytics: async (filters?: AnalyticsFilters): Promise<{
    revenue_streams: Array<{
      stream: string;
      revenue: number;
      growth_rate: number;
      margin: number;
      forecast: number[];
    }>;
    cost_analysis: {
      total_costs: number;
      cost_breakdown: Record<string, number>;
      cost_trends: Array<{ period: string; amount: number; category: string }>;
      cost_optimization: Array<{
        category: string;
        current_cost: number;
        optimized_cost: number;
        saving_potential: number;
      }>;
    };
    profitability: {
      gross_margin: number;
      net_margin: number;
      ebitda: number;
      profit_by_segment: Record<string, number>;
      margin_trends: Array<{ period: string; margin: number }>;
    };
  }> => {
    const response = await api.get('/analytics/financial', {
      params: filters,
    });
    return response.data;
  },

  // Revenue Analytics
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
  // Advanced Reporting & Business Intelligence
  // ========================================
  generateReport: async (
    type: ReportType,
    dateRange: { start: string; end: string },
    options?: {
      includeProducts?: boolean;
      includeCustomers?: boolean;
      includeTraffic?: boolean;
      includeForecasts?: boolean;
      format?: ReportFormat;
      template?: string;
      businessContext?: {
        objective: string;
        stakeholders: string[];
        keyQuestions: string[];
      };
      advanced_analytics?: {
        includeML: boolean;
        includePredictions: boolean;
        includeRecommendations: boolean;
        includeScenarios: boolean;
      };
    }
  ): Promise<SalesReport> => {
    const requestData: GetSalesReportRequest = {
      startDate: dateRange.start,
      endDate: dateRange.end,
      groupBy: 'day'
    };
    const response = await api.post<GetSalesReportResponse>('/analytics/reports/generate', {
      type,
      ...requestData,
      options,
    });
    
    // Return enhanced report structure with business intelligence
    return {
      id: `report-${Date.now()}`,
      title: `${type} Report`,
      description: `Generated ${type} report for ${dateRange.start} to ${dateRange.end}`,
      type,
      dateRange,
      metrics: {
        totalRevenue: response.data.report.totalRevenue,
        totalOrders: response.data.report.totalOrders,
        averageOrderValue: response.data.report.averageOrderValue,
        conversionRate: response.data.report.metrics?.conversionRate || 0,
      } as any,
      data: (response.data.report.breakdown?.daily || []).map(item => ({
        date: item.date,
        revenue: item.revenue,
        orders: item.orders,
        refunds: 0,
        netRevenue: item.revenue,
        profit: item.revenue * 0.2,
        costs: item.revenue * 0.8
      })),
      createdAt: new Date().toISOString(),
      generatedBy: 'current-user',
      status: 'completed',
      format: options?.format || ReportFormat.JSON,
      insights: {
        key_findings: ['Sample finding 1', 'Sample finding 2'],
        recommendations: ['Sample recommendation 1', 'Sample recommendation 2'],
        risks: ['Sample risk 1'],
        opportunities: ['Sample opportunity 1'],
      },
      benchmarks: {
        industry_avg: { revenue: 100000, orders: 500 },
        top_quartile: { revenue: 150000, orders: 750 },
        our_performance: { revenue: response.data.report.totalRevenue, orders: response.data.report.totalOrders },
      },
    };
  },

  createAdvancedReport: async (config: AnalyticsReportConfig): Promise<SalesReport> => {
    const response = await api.post('/analytics/reports/advanced', config);
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
      category?: string;
      stakeholder?: string;
    }
  ): Promise<{
    reports: SalesReport[];
    total: number;
    page: number;
    limit: number;
    categories: string[];
    templates: Array<{ id: string; name: string; description: string }>;
  }> => {
    const response = await api.get('/analytics/reports', {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  downloadReport: async (reportId: string, format?: 'pdf' | 'csv' | 'xlsx' | 'pptx'): Promise<Blob> => {
    const response = await api.get(`/analytics/reports/${reportId}/download`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  shareReport: async (reportId: string, shareConfig: {
    recipients: string[];
    permissions: ('view' | 'comment' | 'edit')[];
    expiresAt?: string;
    message?: string;
  }): Promise<{ shareId: string; shareUrl: string }> => {
    const response = await api.post(`/analytics/reports/${reportId}/share`, shareConfig);
    return response.data;
  },

  deleteReport: async (reportId: string): Promise<void> => {
    await api.delete(`/analytics/reports/${reportId}`);
  },

  scheduleReport: async (
    reportConfig: {
      type: SalesReport['type'];
      frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
      recipients: string[];
      format: 'pdf' | 'csv' | 'xlsx' | 'pptx';
      options?: any;
      businessContext?: {
        purpose: string;
        stakeholders: string[];
        kpis: string[];
      };
    }
  ): Promise<{ scheduleId: string; nextRun: string }> => {
    const response = await api.post('/analytics/reports/schedule', reportConfig);
    return response.data;
  },

  // ========================================
  // Machine Learning & Predictive Analytics
  // ========================================
  getPredictiveAnalytics: async (
    analysisType: 'churn' | 'demand' | 'pricing' | 'inventory' | 'clv',
    config?: {
      timeframe?: string;
      confidence_level?: number;
      include_features?: boolean;
    }
  ): Promise<{
    predictions: Array<{
      entity_id: string;
      entity_type: string;
      predicted_value: number;
      confidence: number;
      factors: Array<{ feature: string; importance: number }>;
    }>;
    model_performance: {
      accuracy: number;
      precision: number;
      recall: number;
      f1_score: number;
    };
    business_impact: {
      potential_revenue_impact: number;
      risk_mitigation: number;
      optimization_opportunities: string[];
    };
  }> => {
    const response = await api.get(`/analytics/ml/predictions/${analysisType}`, {
      params: config,
    });
    return response.data;
  },

  getAnomalyDetection: async (
    metrics: string[],
    sensitivity: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<{
    anomalies: Array<{
      metric: string;
      timestamp: string;
      expected_value: number;
      actual_value: number;
      severity: 'low' | 'medium' | 'high';
      possible_causes: string[];
      recommended_actions: string[];
    }>;
    patterns: Array<{
      pattern_type: string;
      description: string;
      frequency: number;
      impact: number;
    }>;
  }> => {
    const response = await api.get('/analytics/ml/anomaly-detection', {
      params: { metrics, sensitivity },
    });
    return response.data;
  },

  // ========================================
  // A/B Testing & Experimentation Analytics
  // ========================================
  getABTestResults: async (testId?: string): Promise<{
    activeTests: Array<{
      test_id: string;
      test_name: string;
      start_date: string;
      expected_end_date: string;
      variants: Array<{
        variant_id: string;
        name: string;
        traffic_allocation: number;
        current_performance: Record<string, number>;
      }>;
      statistical_significance: number;
      confidence_level: number;
    }>;
    completedTests: Array<{
      test_id: string;
      test_name: string;
      winner: string;
      lift: number;
      significance: number;
      business_impact: number;
    }>;
    insights: Array<{
      insight_type: string;
      description: string;
      recommendation: string;
      potential_impact: number;
    }>;
    recommendations: Array<{
      test_opportunity: string;
      potential_lift: number;
      effort_required: 'low' | 'medium' | 'high';
      priority: 'low' | 'medium' | 'high';
    }>;
  }> => {
    const response = await api.get('/analytics/ab-tests', {
      params: { testId },
    });
    return response.data;
  },

  // ========================================
  // Advanced Funnel & Cohort Analysis
  // ========================================
  getCohortAnalysis: async (filters?: AnalyticsFilters): Promise<{
    cohorts: Array<{
      cohort_date: string;
      cohort_size: number;
      retention_rates: number[];
      revenue_per_cohort: number[];
    }>;
    retentionMatrix: number[][];
    insights: Array<{
      cohort: string;
      key_insight: string;
      retention_strength: 'strong' | 'moderate' | 'weak';
      revenue_impact: number;
    }>;
    retention_drivers: Array<{
      factor: string;
      correlation: number;
      actionable: boolean;
      recommendation: string;
    }>;
  }> => {
    const response = await api.get('/analytics/cohort-analysis', {
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

  getAdvancedFunnelAnalysis: async (
    funnelId: string,
    filters?: AnalyticsFilters
  ): Promise<{
    funnel_steps: ConversionFunnel[];
    segment_performance: Array<{
      segment: string;
      conversion_rates: number[];
      drop_off_reasons: Array<{ reason: string; percentage: number }>;
    }>;
    optimization_opportunities: Array<{
      step: string;
      current_conversion: number;
      potential_conversion: number;
      impact: number;
      recommendations: string[];
    }>;
    user_journey_analysis: Array<{
      path: string[];
      frequency: number;
      success_rate: number;
      average_time: number;
    }>;
  }> => {
    const response = await api.get(`/analytics/funnels/${funnelId}/advanced`, {
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
    user_context?: {
      segment?: string;
      customer_tier?: string;
      journey_stage?: string;
    };
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

  getGeoMarketAnalysis: async (filters?: AnalyticsFilters): Promise<{
    market_penetration: Array<{
      region: string;
      penetration_rate: number;
      market_potential: number;
      competition_level: 'low' | 'medium' | 'high';
      expansion_opportunity: number;
    }>;
    regional_performance: Array<{
      region: string;
      revenue: number;
      growth_rate: number;
      customer_acquisition_cost: number;
      customer_lifetime_value: number;
    }>;
    expansion_recommendations: Array<{
      target_market: string;
      opportunity_size: number;
      investment_required: number;
      expected_roi: number;
      timeline: string;
    }>;
  }> => {
    const response = await api.get('/analytics/geographic/market-analysis', {
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
    dataType: 'sales' | 'products' | 'customers' | 'traffic' | 'vendors' | 'all',
    format: 'csv' | 'json' | 'xlsx' | 'parquet',
    filters?: AnalyticsFilters & {
      includeMetadata?: boolean;
      includeCalculatedFields?: boolean;
      compression?: 'none' | 'gzip' | 'zip';
    }
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
    options: {
      mapping?: Record<string, string>;
      validation_rules?: Record<string, any>;
      transformation_rules?: Record<string, any>;
    }
  ): Promise<{
    success: boolean;
    imported: number;
    errors: Array<{ row: number; field: string; error: string }>;
    warnings: Array<{ row: number; field: string; warning: string }>;
    preview: Array<Record<string, any>>;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dataType', dataType);
    formData.append('options', JSON.stringify(options));

    const response = await api.post('/analytics/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ========================================
  // Configuration & Settings
  // ========================================
  getAnalyticsConfig: async (): Promise<{
    trackingEnabled: boolean;
    dataRetentionDays: number;
    anonymization: boolean;
    goals: Array<{
      id: string;
      name: string;
      target: number;
      current: number;
      timeframe: string;
    }>;
    segments: Array<{
      id: string;
      name: string;
      criteria: Record<string, any>;
      auto_update: boolean;
    }>;
    customMetrics: Array<{
      id: string;
      name: string;
      formula: string;
      unit: string;
      description: string;
    }>;
    integrations: Record<string, {
      enabled: boolean;
      config: Record<string, any>;
      last_sync: string;
    }>;
  }> => {
    const response = await api.get('/analytics/config');
    return response.data;
  },

  updateAnalyticsConfig: async (config: any): Promise<void> => {
    await api.put('/analytics/config', config);
  },

  // ========================================
  // Alerts & Monitoring
  // ========================================
  getAlerts: async (filters?: {
    status?: 'active' | 'triggered' | 'resolved';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    type?: 'threshold' | 'anomaly' | 'trend';
  }): Promise<{
    alerts: Array<{
      id: string;
      name: string;
      type: string;
      status: 'active' | 'triggered' | 'resolved';
      priority: 'low' | 'medium' | 'high' | 'critical';
      metric: string;
      threshold: number;
      current_value: number;
      triggered_at?: string;
      resolved_at?: string;
    }>;
    summary: {
      total: number;
      active: number;
      triggered: number;
      critical: number;
    };
  }> => {
    const response = await api.get('/analytics/alerts', {
      params: filters,
    });
    return response.data?.data || response.data;
  },

  createAlert: async (alertConfig: {
    name: string;
    metric: string;
    condition: 'above' | 'below' | 'equals' | 'change';
    threshold: number;
    timeframe: 'realtime' | '1h' | '24h' | '7d';
    priority: 'low' | 'medium' | 'high' | 'critical';
    notifications: Array<{
      type: 'email' | 'sms' | 'slack' | 'webhook';
      target: string;
    }>;
  }): Promise<{ id: string; status: string }> => {
    const response = await api.post('/analytics/alerts', alertConfig);
    return response.data;
  },

  // ========================================
  // Legacy Export (Kept for compatibility)
  // ========================================
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
