/**
 * Admin Order Management API Services
 * Comprehensive order management functionality for administrators
 */
import { api } from './client';

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  vendor?: {
    id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  fulfillmentStatus: 'unfulfilled' | 'partially_fulfilled' | 'fulfilled';
  items: OrderItem[];
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  };
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: {
    type: string;
    last4?: string;
    brand?: string;
  };
  tracking?: {
    carrier: string;
    trackingNumber: string;
    url?: string;
  };
  notes?: string;
  internalNotes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  sku: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  total: number;
  fulfillmentStatus: 'unfulfilled' | 'fulfilled';
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface OrderFilter {
  status?: string[];
  paymentStatus?: string[];
  fulfillmentStatus?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  customerId?: string;
  vendorId?: string;
  search?: string;
  minTotal?: number;
  maxTotal?: number;
  tags?: string[];
}

export interface OrderListResponse {
  orders: AdminOrder[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    statusCounts: Record<string, number>;
  };
}

export interface OrderStatusUpdate {
  status: AdminOrder['status'];
  notes?: string;
  notifyCustomer?: boolean;
  tracking?: {
    carrier: string;
    trackingNumber: string;
  };
}

export interface BulkOrderAction {
  orderIds: string[];
  action: 'update_status' | 'add_tags' | 'remove_tags' | 'export' | 'cancel' | 'fulfill';
  data?: any;
}

export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: Array<{
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  ordersByStatus: Record<string, number>;
  ordersByDate: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
  fulfillmentMetrics: {
    averageProcessingTime: number;
    averageShippingTime: number;
    fulfillmentRate: number;
  };
}

export const adminOrderManagementAPI = {
  /**
   * Get orders with filtering and pagination
   */
  getOrders: async (
    page: number = 1,
    limit: number = 20,
    filters: OrderFilter = {}
  ): Promise<OrderListResponse> => {
    const { data } = await api.get('/admin/orders', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Get order by ID
   */
  getOrder: async (orderId: string): Promise<AdminOrder> => {
    const { data } = await api.get(`/admin/orders/${orderId}`);
    return data;
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (orderId: string, update: OrderStatusUpdate): Promise<AdminOrder> => {
    const { data } = await api.put(`/admin/orders/${orderId}/status`, update);
    return data;
  },

  /**
   * Add fulfillment to order
   */
  fulfillOrder: async (
    orderId: string,
    fulfillment: {
      items: Array<{ itemId: string; quantity: number }>;
      tracking?: { carrier: string; trackingNumber: string };
      notifyCustomer?: boolean;
    }
  ): Promise<AdminOrder> => {
    const { data } = await api.post(`/admin/orders/${orderId}/fulfill`, fulfillment);
    return data;
  },

  /**
   * Cancel order
   */
  cancelOrder: async (orderId: string, reason: string, refund?: boolean): Promise<AdminOrder> => {
    const { data } = await api.post(`/admin/orders/${orderId}/cancel`, {
      reason,
      refund,
    });
    return data;
  },

  /**
   * Refund order
   */
  refundOrder: async (
    orderId: string,
    refund: {
      amount?: number;
      reason: string;
      items?: Array<{ itemId: string; quantity: number }>;
      restockItems?: boolean;
    }
  ) => {
    const { data } = await api.post(`/admin/orders/${orderId}/refund`, refund);
    return data;
  },

  /**
   * Add order notes
   */
  addOrderNotes: async (orderId: string, notes: string, isInternal: boolean = false) => {
    const { data } = await api.post(`/admin/orders/${orderId}/notes`, {
      notes,
      isInternal,
    });
    return data;
  },

  /**
   * Add tags to order
   */
  addOrderTags: async (orderId: string, tags: string[]): Promise<AdminOrder> => {
    const { data } = await api.post(`/admin/orders/${orderId}/tags`, { tags });
    return data;
  },

  /**
   * Remove tags from order
   */
  removeOrderTags: async (orderId: string, tags: string[]): Promise<AdminOrder> => {
    const { data } = await api.delete(`/admin/orders/${orderId}/tags`, {
      data: { tags },
    });
    return data;
  },

  /**
   * Bulk order actions
   */
  bulkOrderAction: async (action: BulkOrderAction) => {
    const { data } = await api.post('/admin/orders/bulk', action);
    return data;
  },

  /**
   * Get order analytics
   */
  getOrderAnalytics: async (
    period: 'today' | 'week' | 'month' | 'quarter' | 'year' = 'month',
    filters: Partial<OrderFilter> = {}
  ): Promise<OrderAnalytics> => {
    const { data } = await api.get('/admin/orders/analytics', {
      params: { period, ...filters },
    });
    return data;
  },

  /**
   * Export orders
   */
  exportOrders: async (
    format: 'csv' | 'xlsx',
    filters: OrderFilter = {},
    fields?: string[]
  ) => {
    const { data } = await api.get('/admin/orders/export', {
      params: { format, fields: fields?.join(','), ...filters },
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Get order timeline
   */
  getOrderTimeline: async (orderId: string) => {
    const { data } = await api.get(`/admin/orders/${orderId}/timeline`);
    return data;
  },

  /**
   * Resend order confirmation
   */
  resendConfirmation: async (orderId: string) => {
    const { data } = await api.post(`/admin/orders/${orderId}/resend-confirmation`);
    return data;
  },

  /**
   * Create manual order
   */
  createManualOrder: async (orderData: {
    customerId?: string;
    guestInfo?: {
      email: string;
      firstName: string;
      lastName: string;
    };
    items: Array<{
      productId: string;
      variantId?: string;
      quantity: number;
      price?: number;
    }>;
    shippingAddress: Address;
    billingAddress?: Address;
    notes?: string;
    tags?: string[];
  }): Promise<AdminOrder> => {
    const { data } = await api.post('/admin/orders/manual', orderData);
    return data;
  },

  /**
   * Search orders
   */
  searchOrders: async (query: string, limit: number = 10): Promise<AdminOrder[]> => {
    const { data } = await api.get('/admin/orders/search', {
      params: { query, limit },
    });
    return data;
  },

  /**
   * Get orders requiring attention
   */
  getOrdersRequiringAttention: async () => {
    const { data } = await api.get('/admin/orders/attention-required');
    return data;
  },

  /**
   * Update order shipping address
   */
  updateShippingAddress: async (orderId: string, address: Address): Promise<AdminOrder> => {
    const { data } = await api.put(`/admin/orders/${orderId}/shipping-address`, address);
    return data;
  },

  /**
   * Calculate order taxes
   */
  recalculateOrderTaxes: async (orderId: string) => {
    const { data } = await api.post(`/admin/orders/${orderId}/recalculate-taxes`);
    return data;
  },

  /**
   * Get fraud analysis for order
   */
  getFraudAnalysis: async (orderId: string) => {
    const { data } = await api.get(`/admin/orders/${orderId}/fraud-analysis`);
    return data;
  },
};

export default adminOrderManagementAPI;