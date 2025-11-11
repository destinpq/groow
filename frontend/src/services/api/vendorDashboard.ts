/**
 * Vendor Dashboard API Services
 * Comprehensive dashboard functionality for vendor portal
 */
import { api } from './client';

export interface VendorDashboardStats {
  overview: {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    averageOrderValue: number;
    conversionRate: number;
    totalCustomers: number;
  };
  revenueMetrics: {
    thisMonth: number;
    lastMonth: number;
    growthRate: number;
    yearToDate: number;
    commission: {
      earned: number;
      pending: number;
      paid: number;
      rate: number;
    };
  };
  orderMetrics: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    returned: number;
    fulfillmentRate: number;
    averageProcessingTime: number;
  };
  productMetrics: {
    active: number;
    inactive: number;
    outOfStock: number;
    lowStock: number;
    topSellers: Array<{
      id: string;
      name: string;
      sales: number;
      revenue: number;
    }>;
  };
}

export interface VendorRecentActivity {
  id: string;
  type: 'order' | 'product' | 'review' | 'payment' | 'message';
  title: string;
  description: string;
  data?: any;
  priority: 'low' | 'medium' | 'high';
  actionRequired: boolean;
  createdAt: string;
}

export interface VendorNotification {
  id: string;
  type: 'order' | 'inventory' | 'review' | 'payment' | 'system' | 'promotion';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: any;
  createdAt: string;
}

export interface VendorAlert {
  id: string;
  type: 'low_stock' | 'order_issue' | 'payment_pending' | 'review_pending' | 'system';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  actionRequired: boolean;
  actionText?: string;
  actionUrl?: string;
  dismissed: boolean;
  createdAt: string;
}

export interface VendorPerformanceMetrics {
  rating: {
    overall: number;
    totalReviews: number;
    breakdown: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  fulfillment: {
    onTimeDelivery: number;
    accuracy: number;
    responseTime: number;
    customerSatisfaction: number;
  };
  compliance: {
    policyAdherence: number;
    qualityScore: number;
    issuesResolved: number;
    responseTime: number;
  };
}

export interface VendorFinancialSummary {
  balance: {
    current: number;
    pending: number;
    total: number;
  };
  transactions: {
    recent: Array<{
      id: string;
      type: 'sale' | 'commission' | 'payout' | 'refund' | 'fee';
      amount: number;
      description: string;
      date: string;
      status: string;
    }>;
    summary: {
      thisMonth: number;
      lastMonth: number;
      yearToDate: number;
    };
  };
  payouts: {
    next: {
      amount: number;
      date: string;
      method: string;
    };
    recent: Array<{
      id: string;
      amount: number;
      date: string;
      status: string;
    }>;
  };
}

export interface VendorGoal {
  id: string;
  type: 'sales' | 'orders' | 'products' | 'rating' | 'custom';
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: 'on_track' | 'behind' | 'ahead' | 'completed';
  createdAt: string;
}

export const vendorDashboardAPI = {
  /**
   * Get vendor dashboard statistics
   */
  getDashboardStats: async (): Promise<VendorDashboardStats> => {
    const { data } = await api.get('/vendor/dashboard/stats');
    return data;
  },

  /**
   * Get dashboard stats for specific period
   */
  getStatsForPeriod: async (
    period: 'today' | 'week' | 'month' | 'quarter' | 'year',
    customRange?: { from: string; to: string }
  ): Promise<VendorDashboardStats> => {
    const { data } = await api.get('/vendor/dashboard/stats/period', {
      params: { period, ...customRange },
    });
    return data;
  },

  /**
   * Get recent vendor activities
   */
  getRecentActivities: async (limit: number = 10): Promise<VendorRecentActivity[]> => {
    const { data } = await api.get('/vendor/dashboard/activities', {
      params: { limit },
    });
    return data;
  },

  /**
   * Get vendor notifications
   */
  getNotifications: async (
    page: number = 1,
    limit: number = 20,
    type?: VendorNotification['type'],
    unreadOnly: boolean = false
  ) => {
    const { data } = await api.get('/vendor/dashboard/notifications', {
      params: { page, limit, type, unreadOnly },
    });
    return data;
  },

  /**
   * Mark notification as read
   */
  markNotificationRead: async (notificationId: string): Promise<void> => {
    await api.put(`/vendor/dashboard/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read
   */
  markAllNotificationsRead: async (): Promise<void> => {
    await api.put('/vendor/dashboard/notifications/read-all');
  },

  /**
   * Delete notification
   */
  deleteNotification: async (notificationId: string): Promise<void> => {
    await api.delete(`/vendor/dashboard/notifications/${notificationId}`);
  },

  /**
   * Get vendor alerts
   */
  getAlerts: async (
    severity?: VendorAlert['severity'],
    type?: VendorAlert['type'],
    activesOnly: boolean = true
  ): Promise<VendorAlert[]> => {
    const { data } = await api.get('/vendor/dashboard/alerts', {
      params: { severity, type, activesOnly },
    });
    return data;
  },

  /**
   * Dismiss alert
   */
  dismissAlert: async (alertId: string): Promise<void> => {
    await api.put(`/vendor/dashboard/alerts/${alertId}/dismiss`);
  },

  /**
   * Get performance metrics
   */
  getPerformanceMetrics: async (
    period: 'month' | 'quarter' | 'year' = 'month'
  ): Promise<VendorPerformanceMetrics> => {
    const { data } = await api.get('/vendor/dashboard/performance', {
      params: { period },
    });
    return data;
  },

  /**
   * Get financial summary
   */
  getFinancialSummary: async (): Promise<VendorFinancialSummary> => {
    const { data } = await api.get('/vendor/dashboard/financial');
    return data;
  },

  /**
   * Get vendor goals
   */
  getGoals: async (): Promise<VendorGoal[]> => {
    const { data } = await api.get('/vendor/dashboard/goals');
    return data;
  },

  /**
   * Create new goal
   */
  createGoal: async (goalData: {
    type: VendorGoal['type'];
    title: string;
    description: string;
    target: number;
    unit: string;
    deadline: string;
  }): Promise<VendorGoal> => {
    const { data } = await api.post('/vendor/dashboard/goals', goalData);
    return data;
  },

  /**
   * Update goal
   */
  updateGoal: async (goalId: string, updates: Partial<VendorGoal>): Promise<VendorGoal> => {
    const { data } = await api.put(`/vendor/dashboard/goals/${goalId}`, updates);
    return data;
  },

  /**
   * Delete goal
   */
  deleteGoal: async (goalId: string): Promise<void> => {
    await api.delete(`/vendor/dashboard/goals/${goalId}`);
  },

  /**
   * Get quick actions
   */
  getQuickActions: async () => {
    const { data } = await api.get('/vendor/dashboard/quick-actions');
    return data;
  },

  /**
   * Get sales chart data
   */
  getSalesChart: async (
    period: 'daily' | 'weekly' | 'monthly',
    range: { from: string; to: string }
  ) => {
    const { data } = await api.get('/vendor/dashboard/charts/sales', {
      params: { period, ...range },
    });
    return data;
  },

  /**
   * Get orders chart data
   */
  getOrdersChart: async (
    period: 'daily' | 'weekly' | 'monthly',
    range: { from: string; to: string }
  ) => {
    const { data } = await api.get('/vendor/dashboard/charts/orders', {
      params: { period, ...range },
    });
    return data;
  },

  /**
   * Get top products
   */
  getTopProducts: async (
    period: 'week' | 'month' | 'quarter',
    metric: 'sales' | 'revenue' | 'views',
    limit: number = 10
  ) => {
    const { data } = await api.get('/vendor/dashboard/top-products', {
      params: { period, metric, limit },
    });
    return data;
  },

  /**
   * Get customer insights
   */
  getCustomerInsights: async (period: 'month' | 'quarter' | 'year' = 'month') => {
    const { data } = await api.get('/vendor/dashboard/customer-insights', {
      params: { period },
    });
    return data;
  },

  /**
   * Update dashboard preferences
   */
  updateDashboardPreferences: async (preferences: {
    layout?: string;
    widgets?: string[];
    theme?: string;
    notifications?: Record<string, boolean>;
  }) => {
    const { data } = await api.put('/vendor/dashboard/preferences', preferences);
    return data;
  },

  /**
   * Get dashboard preferences
   */
  getDashboardPreferences: async () => {
    const { data } = await api.get('/vendor/dashboard/preferences');
    return data;
  },

  /**
   * Export dashboard data
   */
  exportDashboardData: async (
    type: 'stats' | 'activities' | 'performance' | 'financial',
    format: 'csv' | 'xlsx' | 'pdf',
    period?: { from: string; to: string }
  ) => {
    const { data } = await api.get('/vendor/dashboard/export', {
      params: { type, format, ...period },
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Get comparison with other vendors (anonymized)
   */
  getMarketComparison: async (metrics: string[] = ['sales', 'rating', 'fulfillment']) => {
    const { data } = await api.get('/vendor/dashboard/market-comparison', {
      params: { metrics: metrics.join(',') },
    });
    return data;
  },
};

export default vendorDashboardAPI;