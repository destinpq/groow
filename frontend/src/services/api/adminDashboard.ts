/**
 * Admin Dashboard API Services
 * Main dashboard analytics and overview functionality
 */
import { api } from './client';

export interface DashboardStats {
  revenue: {
    today: number;
    yesterday: number;
    thisMonth: number;
    lastMonth: number;
    changePercent: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    todayCount: number;
    changePercent: number;
  };
  customers: {
    total: number;
    active: number;
    newToday: number;
    newThisMonth: number;
    changePercent: number;
  };
  products: {
    total: number;
    published: number;
    outOfStock: number;
    lowStock: number;
  };
  inventory: {
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    reorderRequired: number;
  };
}

export interface RevenueChart {
  labels: string[];
  data: number[];
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  totalSales: number;
  revenue: number;
  unitsold: number;
  changePercent: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  total: number;
  status: string;
  createdAt: string;
  items: number;
}

export interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  actionRequired: boolean;
  createdAt: string;
  acknowledged: boolean;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string;
  permission?: string;
}

export const adminDashboardAPI = {
  /**
   * Get main dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get('/admin/dashboard/stats');
    return data;
  },

  /**
   * Get revenue chart data
   */
  getRevenueChart: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily'): Promise<RevenueChart> => {
    const { data } = await api.get('/admin/dashboard/revenue-chart', {
      params: { period },
    });
    return data;
  },

  /**
   * Get top selling products
   */
  getTopProducts: async (limit: number = 10): Promise<TopProduct[]> => {
    const { data } = await api.get('/admin/dashboard/top-products', {
      params: { limit },
    });
    return data;
  },

  /**
   * Get top customers
   */
  getTopCustomers: async (limit: number = 10): Promise<TopCustomer[]> => {
    const { data } = await api.get('/admin/dashboard/top-customers', {
      params: { limit },
    });
    return data;
  },

  /**
   * Get recent orders
   */
  getRecentOrders: async (limit: number = 10): Promise<RecentOrder[]> => {
    const { data } = await api.get('/admin/dashboard/recent-orders', {
      params: { limit },
    });
    return data;
  },

  /**
   * Get system alerts
   */
  getSystemAlerts: async (): Promise<SystemAlert[]> => {
    const { data } = await api.get('/admin/dashboard/alerts');
    return data;
  },

  /**
   * Acknowledge system alert
   */
  acknowledgeAlert: async (alertId: string): Promise<void> => {
    await api.put(`/admin/dashboard/alerts/${alertId}/acknowledge`);
  },

  /**
   * Dismiss system alert
   */
  dismissAlert: async (alertId: string): Promise<void> => {
    await api.delete(`/admin/dashboard/alerts/${alertId}`);
  },

  /**
   * Get quick actions
   */
  getQuickActions: async (): Promise<QuickAction[]> => {
    const { data } = await api.get('/admin/dashboard/quick-actions');
    return data;
  },

  /**
   * Get sales comparison (this period vs last period)
   */
  getSalesComparison: async (period: 'week' | 'month' | 'quarter' | 'year') => {
    const { data } = await api.get('/admin/dashboard/sales-comparison', {
      params: { period },
    });
    return data;
  },

  /**
   * Get traffic analytics
   */
  getTrafficAnalytics: async () => {
    const { data } = await api.get('/admin/dashboard/traffic');
    return data;
  },

  /**
   * Get conversion metrics
   */
  getConversionMetrics: async () => {
    const { data } = await api.get('/admin/dashboard/conversion');
    return data;
  },

  /**
   * Export dashboard data
   */
  exportDashboardData: async (format: 'csv' | 'xlsx' | 'pdf') => {
    const { data } = await api.get('/admin/dashboard/export', {
      params: { format },
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Get low stock alerts
   */
  getLowStockAlerts: async () => {
    const { data } = await api.get('/admin/dashboard/low-stock');
    return data;
  },

  /**
   * Get pending tasks/actions
   */
  getPendingTasks: async () => {
    const { data } = await api.get('/admin/dashboard/pending-tasks');
    return data;
  },

  /**
   * Update dashboard preferences
   */
  updatePreferences: async (preferences: Record<string, any>) => {
    const { data } = await api.put('/admin/dashboard/preferences', preferences);
    return data;
  },

  /**
   * Get dashboard preferences
   */
  getPreferences: async () => {
    const { data } = await api.get('/admin/dashboard/preferences');
    return data;
  },
};

export default adminDashboardAPI;