/**
 * Admin Finance Management API Services
 * Financial management and accounting functionality for administrators
 */
import { api } from './client';

export interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'payout' | 'fee' | 'adjustment' | 'commission';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  description: string;
  reference?: string;
  orderId?: string;
  customerId?: string;
  vendorId?: string;
  paymentMethod?: {
    type: string;
    last4?: string;
    brand?: string;
  };
  gateway: string;
  gatewayTransactionId?: string;
  fees: {
    platform: number;
    gateway: number;
    total: number;
  };
  metadata?: Record<string, any>;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payout {
  id: string;
  vendorId: string;
  vendor: {
    id: string;
    name: string;
    email: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  method: 'bank_transfer' | 'paypal' | 'stripe' | 'check';
  accountDetails?: {
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    paypalEmail?: string;
  };
  period: {
    from: string;
    to: string;
  };
  transactions: string[];
  commission: {
    total: number;
    platformFee: number;
    net: number;
  };
  notes?: string;
  scheduledAt?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Refund {
  id: string;
  orderId: string;
  transactionId: string;
  amount: number;
  currency: string;
  reason: string;
  type: 'full' | 'partial';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'original' | 'store_credit' | 'bank_transfer';
  items?: Array<{
    itemId: string;
    quantity: number;
    amount: number;
  }>;
  restockItems: boolean;
  gatewayRefundId?: string;
  processedBy: {
    id: string;
    name: string;
  };
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSummary {
  period: {
    from: string;
    to: string;
  };
  revenue: {
    gross: number;
    net: number;
    refunds: number;
    growth: number;
  };
  transactions: {
    total: number;
    successful: number;
    failed: number;
    volume: number;
  };
  fees: {
    platform: number;
    gateway: number;
    total: number;
  };
  payouts: {
    total: number;
    pending: number;
    completed: number;
  };
  refunds: {
    count: number;
    amount: number;
    rate: number;
  };
}

export interface FinancialReport {
  summary: FinancialSummary;
  dailyBreakdown: Array<{
    date: string;
    revenue: number;
    transactions: number;
    fees: number;
    refunds: number;
  }>;
  topCategories: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;
  paymentMethods: Array<{
    method: string;
    volume: number;
    percentage: number;
    avgAmount: number;
  }>;
}

export interface TaxReport {
  period: {
    from: string;
    to: string;
  };
  summary: {
    totalSales: number;
    taxableAmount: number;
    taxCollected: number;
    exemptAmount: number;
  };
  byRegion: Array<{
    region: string;
    sales: number;
    taxRate: number;
    taxCollected: number;
  }>;
  byCategory: Array<{
    category: string;
    sales: number;
    taxCollected: number;
  }>;
}

export interface CommissionReport {
  period: {
    from: string;
    to: string;
  };
  summary: {
    totalCommission: number;
    paidCommission: number;
    pendingCommission: number;
    vendorCount: number;
  };
  byVendor: Array<{
    vendorId: string;
    vendorName: string;
    sales: number;
    commission: number;
    rate: number;
    status: 'pending' | 'paid';
  }>;
}

export const adminFinanceAPI = {
  // Transactions
  /**
   * Get transactions with filtering
   */
  getTransactions: async (
    page: number = 1,
    limit: number = 20,
    filters: {
      type?: Transaction['type'];
      status?: Transaction['status'];
      dateRange?: { from: string; to: string };
      customerId?: string;
      vendorId?: string;
      orderId?: string;
      minAmount?: number;
      maxAmount?: number;
    } = {}
  ) => {
    const { data } = await api.get('/admin/finance/transactions', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Get transaction by ID
   */
  getTransaction: async (transactionId: string): Promise<Transaction> => {
    const { data } = await api.get(`/admin/finance/transactions/${transactionId}`);
    return data;
  },

  /**
   * Create manual transaction
   */
  createTransaction: async (transactionData: {
    type: Transaction['type'];
    amount: number;
    currency: string;
    description: string;
    customerId?: string;
    vendorId?: string;
    orderId?: string;
    reference?: string;
    metadata?: Record<string, any>;
  }): Promise<Transaction> => {
    const { data } = await api.post('/admin/finance/transactions', transactionData);
    return data;
  },

  /**
   * Cancel transaction
   */
  cancelTransaction: async (transactionId: string, reason: string): Promise<Transaction> => {
    const { data } = await api.post(`/admin/finance/transactions/${transactionId}/cancel`, {
      reason,
    });
    return data;
  },

  // Payouts
  /**
   * Get payouts
   */
  getPayouts: async (
    page: number = 1,
    limit: number = 20,
    filters: {
      status?: Payout['status'];
      vendorId?: string;
      dateRange?: { from: string; to: string };
    } = {}
  ) => {
    const { data } = await api.get('/admin/finance/payouts', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Get payout by ID
   */
  getPayout: async (payoutId: string): Promise<Payout> => {
    const { data } = await api.get(`/admin/finance/payouts/${payoutId}`);
    return data;
  },

  /**
   * Create payout
   */
  createPayout: async (payoutData: {
    vendorId: string;
    amount: number;
    currency: string;
    method: Payout['method'];
    period: Payout['period'];
    accountDetails?: Payout['accountDetails'];
    notes?: string;
    scheduledAt?: string;
  }): Promise<Payout> => {
    const { data } = await api.post('/admin/finance/payouts', payoutData);
    return data;
  },

  /**
   * Process payout
   */
  processPayout: async (payoutId: string): Promise<Payout> => {
    const { data } = await api.post(`/admin/finance/payouts/${payoutId}/process`);
    return data;
  },

  /**
   * Cancel payout
   */
  cancelPayout: async (payoutId: string, reason: string): Promise<Payout> => {
    const { data } = await api.post(`/admin/finance/payouts/${payoutId}/cancel`, {
      reason,
    });
    return data;
  },

  /**
   * Get pending payouts
   */
  getPendingPayouts: async (): Promise<Payout[]> => {
    const { data } = await api.get('/admin/finance/payouts/pending');
    return data;
  },

  /**
   * Calculate vendor payout
   */
  calculateVendorPayout: async (
    vendorId: string,
    period: { from: string; to: string }
  ) => {
    const { data } = await api.post('/admin/finance/payouts/calculate', {
      vendorId,
      period,
    });
    return data;
  },

  // Refunds
  /**
   * Get refunds
   */
  getRefunds: async (
    page: number = 1,
    limit: number = 20,
    filters: {
      status?: Refund['status'];
      type?: Refund['type'];
      dateRange?: { from: string; to: string };
      orderId?: string;
    } = {}
  ) => {
    const { data } = await api.get('/admin/finance/refunds', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Create refund
   */
  createRefund: async (refundData: {
    orderId: string;
    amount: number;
    reason: string;
    type: Refund['type'];
    method: Refund['method'];
    items?: Refund['items'];
    restockItems?: boolean;
  }): Promise<Refund> => {
    const { data } = await api.post('/admin/finance/refunds', refundData);
    return data;
  },

  /**
   * Process refund
   */
  processRefund: async (refundId: string): Promise<Refund> => {
    const { data } = await api.post(`/admin/finance/refunds/${refundId}/process`);
    return data;
  },

  /**
   * Cancel refund
   */
  cancelRefund: async (refundId: string, reason: string): Promise<Refund> => {
    const { data } = await api.post(`/admin/finance/refunds/${refundId}/cancel`, {
      reason,
    });
    return data;
  },

  // Financial Reports
  /**
   * Get financial summary
   */
  getFinancialSummary: async (
    period: { from: string; to: string }
  ): Promise<FinancialSummary> => {
    const { data } = await api.post('/admin/finance/summary', { period });
    return data;
  },

  /**
   * Get financial report
   */
  getFinancialReport: async (
    period: { from: string; to: string }
  ): Promise<FinancialReport> => {
    const { data } = await api.post('/admin/finance/reports/financial', { period });
    return data;
  },

  /**
   * Get tax report
   */
  getTaxReport: async (
    period: { from: string; to: string }
  ): Promise<TaxReport> => {
    const { data } = await api.post('/admin/finance/reports/tax', { period });
    return data;
  },

  /**
   * Get commission report
   */
  getCommissionReport: async (
    period: { from: string; to: string }
  ): Promise<CommissionReport> => {
    const { data } = await api.post('/admin/finance/reports/commission', { period });
    return data;
  },

  /**
   * Export financial data
   */
  exportFinancialData: async (
    type: 'transactions' | 'payouts' | 'refunds' | 'summary',
    period: { from: string; to: string },
    format: 'csv' | 'xlsx'
  ) => {
    const { data } = await api.post('/admin/finance/export', {
      type,
      period,
      format,
    }, {
      responseType: 'blob',
    });
    return data;
  },

  // Settings and Configuration
  /**
   * Get finance settings
   */
  getFinanceSettings: async () => {
    const { data } = await api.get('/admin/finance/settings');
    return data;
  },

  /**
   * Update finance settings
   */
  updateFinanceSettings: async (settings: {
    defaultCurrency?: string;
    payoutSchedule?: 'weekly' | 'biweekly' | 'monthly';
    minimumPayoutAmount?: number;
    platformCommission?: number;
    autoProcessRefunds?: boolean;
    taxConfiguration?: any;
  }) => {
    const { data } = await api.put('/admin/finance/settings', settings);
    return data;
  },

  /**
   * Get payment gateway settings
   */
  getPaymentGateways: async () => {
    const { data } = await api.get('/admin/finance/gateways');
    return data;
  },

  /**
   * Update payment gateway settings
   */
  updatePaymentGateway: async (gatewayId: string, settings: Record<string, any>) => {
    const { data } = await api.put(`/admin/finance/gateways/${gatewayId}`, settings);
    return data;
  },

  /**
   * Test payment gateway connection
   */
  testPaymentGateway: async (gatewayId: string) => {
    const { data } = await api.post(`/admin/finance/gateways/${gatewayId}/test`);
    return data;
  },

  /**
   * Get financial analytics
   */
  getFinancialAnalytics: async (
    period: 'week' | 'month' | 'quarter' | 'year'
  ) => {
    const { data } = await api.get('/admin/finance/analytics', {
      params: { period },
    });
    return data;
  },

  /**
   * Get revenue forecasting
   */
  getRevenueForecast: async (
    months: number = 3,
    method: 'linear' | 'seasonal' = 'seasonal'
  ) => {
    const { data } = await api.get('/admin/finance/forecast', {
      params: { months, method },
    });
    return data;
  },
};

export default adminFinanceAPI;