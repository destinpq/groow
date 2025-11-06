import api from './client';

// Types
export interface GiftWrap {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: 'birthday' | 'wedding' | 'holiday' | 'general';
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GiftWrapOrder {
  id: string;
  orderId: string;
  giftWrapId: string;
  giftWrap?: GiftWrap;
  recipientName: string;
  giftMessage: string;
  price: number;
  createdAt: string;
}

export interface CreateGiftWrapOrderData {
  orderId: string;
  giftWrapId: string;
  recipientName: string;
  giftMessage: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Gift Wrapping API
export const giftWrappingAPI = {
  // Get all available gift wraps
  getAvailableWraps: async (params?: {
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<GiftWrap>> => {
    const response = await api.get<PaginatedResponse<GiftWrap>>('/gift-wrapping/wraps', { params });
    return response.data;
  },

  // Get gift wrap by ID
  getWrapById: async (id: string): Promise<GiftWrap> => {
    const response = await api.get<GiftWrap>(`/gift-wrapping/wraps/${id}`);
    return response.data;
  },

  // Add gift wrap to order
  addToOrder: async (data: CreateGiftWrapOrderData): Promise<GiftWrapOrder> => {
    const response = await api.post<GiftWrapOrder>('/gift-wrapping/orders', data);
    return response.data;
  },

  // Get my gift wrap orders
  getMyOrders: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<GiftWrapOrder>> => {
    const response = await api.get<PaginatedResponse<GiftWrapOrder>>('/gift-wrapping/my-orders', { params });
    return response.data;
  },

  // Remove gift wrap from order
  removeFromOrder: async (orderId: string): Promise<void> => {
    const response = await api.delete<void>(`/gift-wrapping/orders/${orderId}`);
    return response.data;
  },
};

export default giftWrappingAPI;
