import api from './client';

// Types
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  vendorId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface CreateOrderData {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  notes?: string;
}

export interface OrderFilters {
  status?: string;
  customerId?: string;
  vendorId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Orders API Service
export const ordersAPI = {
  // Get all orders
  getAll: async (filters?: OrderFilters): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>('/orders', {
      params: filters,
    });
    return response.data;
  },

  // Get order by ID
  getById: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // Get order by order number
  getByOrderNumber: async (orderNumber: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/number/${orderNumber}`);
    return response.data;
  },

  // Create order
  create: async (data: CreateOrderData): Promise<Order> => {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  // Update order status
  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Cancel order
  cancel: async (id: string, reason?: string): Promise<Order> => {
    const response = await api.post<Order>(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  // Update tracking number
  updateTracking: async (id: string, trackingNumber: string): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${id}/tracking`, { trackingNumber });
    return response.data;
  },

  // Get customer orders
  getCustomerOrders: async (customerId: string, filters?: OrderFilters): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>(`/customers/${customerId}/orders`, {
      params: filters,
    });
    return response.data;
  },

  // Get vendor orders
  getVendorOrders: async (vendorId: string, filters?: OrderFilters): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>(`/vendors/${vendorId}/orders`, {
      params: filters,
    });
    return response.data;
  },

  // Track order
  track: async (trackingNumber: string): Promise<{
    order: Order;
    timeline: {
      status: string;
      timestamp: string;
      location?: string;
      note?: string;
    }[];
  }> => {
    const response = await api.get(`/orders/track/${trackingNumber}`);
    return response.data;
  },

  // Initiate refund
  refund: async (id: string, amount: number, reason: string): Promise<Order> => {
    const response = await api.post<Order>(`/orders/${id}/refund`, { amount, reason });
    return response.data;
  },

  // Export orders
  export: async (filters?: OrderFilters): Promise<void> => {
    await api.download('/orders/export', 'orders.csv');
  },
};

export default ordersAPI;
