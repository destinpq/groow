import api from './client';

// Types
export interface PreOrderProduct {
  id: string;
  productId: string;
  product?: {
    id: string;
    name: string;
    description: string;
    images: string[];
    price: number;
  };
  estimatedShipDate: string;
  releaseDate: string;
  preOrderEndDate: string;
  totalStock: number;
  preOrderedStock: number;
  depositAmount: number;
  depositPercentage: number;
  status: 'available' | 'soldout' | 'coming-soon';
  createdAt: string;
  updatedAt: string;
}

export interface MyPreOrder {
  id: string;
  productId: string;
  product?: {
    id: string;
    name: string;
    images: string[];
  };
  quantity: number;
  totalPrice: number;
  depositPaid: number;
  remainingAmount: number;
  orderDate: string;
  estimatedShipDate: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'deposit-paid' | 'full-paid' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePreOrderData {
  productId: string;
  quantity: number;
}

export interface UpdatePreOrderData {
  quantity?: number;
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Pre-Order API
export const preOrdersAPI = {
  // Get all available pre-order products
  getAvailableProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<PaginatedResponse<PreOrderProduct>> => {
    const response = await api.get<PaginatedResponse<PreOrderProduct>>('/pre-orders/products', { params });
    return response.data;
  },

  // Get single pre-order product
  getProduct: async (id: string): Promise<PreOrderProduct> => {
    const response = await api.get<PreOrderProduct>(`/pre-orders/products/${id}`);
    return response.data;
  },

  // Get my pre-orders
  getMyPreOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<MyPreOrder>> => {
    const response = await api.get<PaginatedResponse<MyPreOrder>>('/pre-orders/my-orders', { params });
    return response.data;
  },

  // Get single pre-order
  getPreOrder: async (id: string): Promise<MyPreOrder> => {
    const response = await api.get<MyPreOrder>(`/pre-orders/my-orders/${id}`);
    return response.data;
  },

  // Create pre-order
  createPreOrder: async (data: CreatePreOrderData): Promise<MyPreOrder> => {
    const response = await api.post<MyPreOrder>('/pre-orders', data);
    return response.data;
  },

  // Update pre-order
  updatePreOrder: async (id: string, data: UpdatePreOrderData): Promise<MyPreOrder> => {
    const response = await api.put<MyPreOrder>(`/pre-orders/${id}`, data);
    return response.data;
  },

  // Cancel pre-order
  cancelPreOrder: async (id: string): Promise<MyPreOrder> => {
    const response = await api.put<MyPreOrder>(`/pre-orders/${id}/cancel`);
    return response.data;
  },

  // Complete payment (pay remaining amount)
  completePayment: async (id: string): Promise<MyPreOrder> => {
    const response = await api.post<MyPreOrder>(`/pre-orders/${id}/complete-payment`);
    return response.data;
  },

  // Get pre-order statistics
  getStats: async (): Promise<{
    totalPreOrders: number;
    activePreOrders: number;
    completedPreOrders: number;
    totalSpent: number;
    depositsPaid: number;
    remainingPayments: number;
  }> => {
    const response = await api.get<{
      totalPreOrders: number;
      activePreOrders: number;
      completedPreOrders: number;
      totalSpent: number;
      depositsPaid: number;
      remainingPayments: number;
    }>('/pre-orders/stats');
    return response.data;
  },
};

export default preOrdersAPI;
