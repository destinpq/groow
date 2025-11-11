/**
 * Vendor Order Processing API Services
 * Complete order management and fulfillment for vendors
 */
import { api } from './client';

export interface VendorOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  customerId: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  items: Array<{
    id: string;
    productId: string;
    variantId?: string;
    sku: string;
    name: string;
    image?: string;
    quantity: number;
    price: number;
    totalPrice: number;
    vendorPrice: number;
    commission: number;
    attributes?: Record<string, string>;
    customizations?: Record<string, any>;
  }>;
  pricing: {
    subtotal: number;
    taxAmount: number;
    shippingCost: number;
    discountAmount: number;
    totalAmount: number;
    vendorAmount: number;
    commissionAmount: number;
    currency: string;
  };
  shipping: {
    address: {
      name: string;
      company?: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      phone?: string;
    };
    method: {
      id: string;
      name: string;
      carrier: string;
      service: string;
      estimatedDays: number;
      trackingRequired: boolean;
    };
    tracking?: {
      number: string;
      carrier: string;
      url?: string;
      status: string;
      updates: Array<{
        status: string;
        description: string;
        location?: string;
        timestamp: string;
      }>;
    };
    instructions?: string;
  };
  billing: {
    address: {
      name: string;
      company?: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    method: {
      type: 'card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
      last4?: string;
      brand?: string;
    };
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'returned';
  fulfillmentStatus: 'pending' | 'processing' | 'partially_fulfilled' | 'fulfilled' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  flags: string[];
  notes: Array<{
    id: string;
    author: string;
    content: string;
    type: 'internal' | 'customer' | 'system';
    createdAt: string;
  }>;
  timeline: Array<{
    id: string;
    event: string;
    description: string;
    actor: string;
    timestamp: string;
    metadata?: any;
  }>;
  tags: string[];
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface OrderFilter {
  status?: VendorOrder['status'];
  fulfillmentStatus?: VendorOrder['fulfillmentStatus'];
  paymentStatus?: VendorOrder['paymentStatus'];
  priority?: VendorOrder['priority'];
  dateRange?: { from: string; to: string };
  search?: string;
  customerId?: string;
  minAmount?: number;
  maxAmount?: number;
  shippingMethod?: string;
  tags?: string[];
  sortBy?: 'created_at' | 'updated_at' | 'total_amount' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderUpdateRequest {
  status?: VendorOrder['status'];
  fulfillmentStatus?: VendorOrder['fulfillmentStatus'];
  priority?: VendorOrder['priority'];
  tags?: string[];
  notes?: string;
  tracking?: {
    number: string;
    carrier: string;
    url?: string;
  };
  estimatedDelivery?: string;
}

export interface FulfillmentRequest {
  orderId: string;
  items: Array<{
    id: string;
    quantity: number;
  }>;
  tracking?: {
    number: string;
    carrier: string;
    url?: string;
  };
  shippingMethod?: string;
  notes?: string;
  notifyCustomer?: boolean;
}

export interface RefundRequest {
  orderId: string;
  reason: string;
  amount?: number;
  items?: Array<{
    id: string;
    quantity: number;
    amount: number;
  }>;
  refundShipping?: boolean;
  restockItems?: boolean;
  notifyCustomer?: boolean;
  notes?: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  customerId: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    reason: string;
    condition: 'new' | 'used' | 'damaged';
  }>;
  reason: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  returnMethod: 'mail' | 'drop_off' | 'pickup';
  refundAmount: number;
  restockFee?: number;
  shippingLabel?: {
    url: string;
    trackingNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ShippingLabel {
  id: string;
  orderId: string;
  carrier: string;
  service: string;
  trackingNumber: string;
  labelUrl: string;
  rate: {
    amount: number;
    currency: string;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  from: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  to: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

export const vendorOrderProcessingAPI = {
  /**
   * Get vendor orders with filtering and pagination
   */
  getOrders: async (
    page: number = 1,
    limit: number = 20,
    filters: OrderFilter = {}
  ) => {
    const { data } = await api.get('/vendor/orders', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Get single order details
   */
  getOrder: async (orderId: string): Promise<VendorOrder> => {
    const { data } = await api.get(`/vendor/orders/${orderId}`);
    return data;
  },

  /**
   * Update order
   */
  updateOrder: async (
    orderId: string,
    updates: OrderUpdateRequest
  ): Promise<VendorOrder> => {
    const { data } = await api.put(`/vendor/orders/${orderId}`, updates);
    return data;
  },

  /**
   * Confirm order
   */
  confirmOrder: async (orderId: string, estimatedDelivery?: string): Promise<VendorOrder> => {
    const { data } = await api.post(`/vendor/orders/${orderId}/confirm`, {
      estimatedDelivery,
    });
    return data;
  },

  /**
   * Cancel order
   */
  cancelOrder: async (
    orderId: string,
    reason: string,
    refund: boolean = true
  ): Promise<VendorOrder> => {
    const { data } = await api.post(`/vendor/orders/${orderId}/cancel`, {
      reason,
      refund,
    });
    return data;
  },

  /**
   * Fulfill order (full or partial)
   */
  fulfillOrder: async (fulfillmentData: FulfillmentRequest) => {
    const { data } = await api.post('/vendor/orders/fulfill', fulfillmentData);
    return data;
  },

  /**
   * Add tracking information
   */
  addTracking: async (
    orderId: string,
    tracking: {
      number: string;
      carrier: string;
      url?: string;
    },
    notifyCustomer: boolean = true
  ) => {
    const { data } = await api.post(`/vendor/orders/${orderId}/tracking`, {
      ...tracking,
      notifyCustomer,
    });
    return data;
  },

  /**
   * Update tracking information
   */
  updateTracking: async (
    orderId: string,
    trackingId: string,
    updates: {
      status?: string;
      description?: string;
      location?: string;
    }
  ) => {
    const { data } = await api.put(`/vendor/orders/${orderId}/tracking/${trackingId}`, updates);
    return data;
  },

  /**
   * Get tracking information
   */
  getTracking: async (orderId: string) => {
    const { data } = await api.get(`/vendor/orders/${orderId}/tracking`);
    return data;
  },

  /**
   * Refresh tracking status
   */
  refreshTracking: async (orderId: string) => {
    const { data } = await api.post(`/vendor/orders/${orderId}/tracking/refresh`);
    return data;
  },

  /**
   * Add order note
   */
  addNote: async (
    orderId: string,
    content: string,
    type: 'internal' | 'customer' = 'internal'
  ) => {
    const { data } = await api.post(`/vendor/orders/${orderId}/notes`, {
      content,
      type,
    });
    return data;
  },

  /**
   * Update order note
   */
  updateNote: async (orderId: string, noteId: string, content: string) => {
    const { data } = await api.put(`/vendor/orders/${orderId}/notes/${noteId}`, {
      content,
    });
    return data;
  },

  /**
   * Delete order note
   */
  deleteNote: async (orderId: string, noteId: string): Promise<void> => {
    await api.delete(`/vendor/orders/${orderId}/notes/${noteId}`);
  },

  /**
   * Process refund
   */
  processRefund: async (refundData: RefundRequest) => {
    const { data } = await api.post('/vendor/orders/refund', refundData);
    return data;
  },

  /**
   * Get refund details
   */
  getRefund: async (refundId: string) => {
    const { data } = await api.get(`/vendor/orders/refunds/${refundId}`);
    return data;
  },

  /**
   * Get order refunds
   */
  getOrderRefunds: async (orderId: string) => {
    const { data } = await api.get(`/vendor/orders/${orderId}/refunds`);
    return data;
  },

  /**
   * Get return requests
   */
  getReturnRequests: async (
    page: number = 1,
    limit: number = 20,
    status?: ReturnRequest['status']
  ) => {
    const { data } = await api.get('/vendor/orders/returns', {
      params: { page, limit, status },
    });
    return data;
  },

  /**
   * Get return request details
   */
  getReturnRequest: async (returnId: string): Promise<ReturnRequest> => {
    const { data } = await api.get(`/vendor/orders/returns/${returnId}`);
    return data;
  },

  /**
   * Approve return request
   */
  approveReturn: async (
    returnId: string,
    approvalData: {
      refundAmount?: number;
      restockFee?: number;
      generateShippingLabel?: boolean;
      notes?: string;
    }
  ) => {
    const { data } = await api.post(`/vendor/orders/returns/${returnId}/approve`, approvalData);
    return data;
  },

  /**
   * Reject return request
   */
  rejectReturn: async (returnId: string, reason: string) => {
    const { data } = await api.post(`/vendor/orders/returns/${returnId}/reject`, {
      reason,
    });
    return data;
  },

  /**
   * Process returned items
   */
  processReturn: async (
    returnId: string,
    processData: {
      items: Array<{
        id: string;
        condition: 'new' | 'used' | 'damaged';
        restock: boolean;
        refundAmount: number;
      }>;
      notes?: string;
    }
  ) => {
    const { data } = await api.post(`/vendor/orders/returns/${returnId}/process`, processData);
    return data;
  },

  /**
   * Get shipping rates
   */
  getShippingRates: async (
    orderId: string,
    address: {
      address1: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    }
  ) => {
    const { data } = await api.post(`/vendor/orders/${orderId}/shipping-rates`, {
      address,
    });
    return data;
  },

  /**
   * Create shipping label
   */
  createShippingLabel: async (
    orderId: string,
    shippingData: {
      carrier: string;
      service: string;
      packageType: string;
      dimensions: {
        length: number;
        width: number;
        height: number;
        weight: number;
      };
      insurance?: {
        amount: number;
        provider: string;
      };
    }
  ): Promise<ShippingLabel> => {
    const { data } = await api.post(`/vendor/orders/${orderId}/shipping-label`, shippingData);
    return data;
  },

  /**
   * Get shipping label
   */
  getShippingLabel: async (orderId: string): Promise<ShippingLabel> => {
    const { data } = await api.get(`/vendor/orders/${orderId}/shipping-label`);
    return data;
  },

  /**
   * Void shipping label
   */
  voidShippingLabel: async (orderId: string, labelId: string) => {
    const { data } = await api.post(`/vendor/orders/${orderId}/shipping-label/${labelId}/void`);
    return data;
  },

  /**
   * Get order statistics
   */
  getOrderStats: async (
    timeRange?: { from: string; to: string }
  ) => {
    const { data } = await api.get('/vendor/orders/stats', {
      params: timeRange,
    });
    return data;
  },

  /**
   * Bulk update orders
   */
  bulkUpdateOrders: async (
    orderIds: string[],
    updates: {
      status?: VendorOrder['status'];
      priority?: VendorOrder['priority'];
      tags?: string[];
      addTags?: string[];
      removeTags?: string[];
    }
  ) => {
    const { data } = await api.put('/vendor/orders/bulk', {
      orderIds,
      updates,
    });
    return data;
  },

  /**
   * Export orders
   */
  exportOrders: async (
    format: 'csv' | 'xlsx' | 'pdf',
    filters: OrderFilter = {},
    fields?: string[]
  ) => {
    const { data } = await api.get('/vendor/orders/export', {
      params: { format, ...filters, fields: fields?.join(',') },
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Get order templates (for recurring orders)
   */
  getOrderTemplates: async () => {
    const { data } = await api.get('/vendor/orders/templates');
    return data;
  },

  /**
   * Create order template
   */
  createOrderTemplate: async (templateData: {
    name: string;
    items: Array<{
      productId: string;
      variantId?: string;
      quantity: number;
    }>;
    shipping?: any;
    notes?: string;
  }) => {
    const { data } = await api.post('/vendor/orders/templates', templateData);
    return data;
  },

  /**
   * Create order from template
   */
  createFromTemplate: async (
    templateId: string,
    customerId: string,
    overrides?: Record<string, any>
  ) => {
    const { data } = await api.post(`/vendor/orders/templates/${templateId}/create`, {
      customerId,
      overrides,
    });
    return data;
  },

  /**
   * Get fulfillment centers
   */
  getFulfillmentCenters: async () => {
    const { data } = await api.get('/vendor/orders/fulfillment-centers');
    return data;
  },

  /**
   * Assign fulfillment center
   */
  assignFulfillmentCenter: async (orderId: string, centerId: string) => {
    const { data } = await api.put(`/vendor/orders/${orderId}/fulfillment-center`, {
      centerId,
    });
    return data;
  },

  /**
   * Get automated rules
   */
  getAutomationRules: async () => {
    const { data } = await api.get('/vendor/orders/automation-rules');
    return data;
  },

  /**
   * Create automation rule
   */
  createAutomationRule: async (rule: {
    name: string;
    trigger: {
      event: string;
      conditions: Record<string, any>;
    };
    actions: Array<{
      type: string;
      parameters: Record<string, any>;
    }>;
    active: boolean;
  }) => {
    const { data } = await api.post('/vendor/orders/automation-rules', rule);
    return data;
  },

  /**
   * Update automation rule
   */
  updateAutomationRule: async (ruleId: string, updates: Record<string, any>) => {
    const { data } = await api.put(`/vendor/orders/automation-rules/${ruleId}`, updates);
    return data;
  },

  /**
   * Delete automation rule
   */
  deleteAutomationRule: async (ruleId: string): Promise<void> => {
    await api.delete(`/vendor/orders/automation-rules/${ruleId}`);
  },

  /**
   * Test automation rule
   */
  testAutomationRule: async (ruleId: string, orderId: string) => {
    const { data } = await api.post(`/vendor/orders/automation-rules/${ruleId}/test`, {
      orderId,
    });
    return data;
  },

  /**
   * Get order insights
   */
  getOrderInsights: async (timeRange?: { from: string; to: string }) => {
    const { data } = await api.get('/vendor/orders/insights', {
      params: timeRange,
    });
    return data;
  },

  /**
   * Get customer order history
   */
  getCustomerOrderHistory: async (customerId: string, limit: number = 10) => {
    const { data } = await api.get(`/vendor/orders/customer/${customerId}/history`, {
      params: { limit },
    });
    return data;
  },

  /**
   * Flag order for review
   */
  flagOrder: async (orderId: string, flag: string, reason?: string) => {
    const { data } = await api.post(`/vendor/orders/${orderId}/flag`, {
      flag,
      reason,
    });
    return data;
  },

  /**
   * Remove order flag
   */
  removeFlagOrder: async (orderId: string, flag: string) => {
    const { data } = await api.delete(`/vendor/orders/${orderId}/flag/${flag}`);
    return data;
  },
};

export default vendorOrderProcessingAPI;