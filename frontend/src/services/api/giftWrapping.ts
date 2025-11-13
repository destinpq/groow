import api from './client';

// API Response wrapper types
export interface GiftWrappingAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedGiftWrappingResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

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
    const response = await api.get<PaginatedGiftWrappingResponse<GiftWrap>>('/gift-wrapping/wraps', { params });
    return {
      data: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      limit: params?.limit || 10,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  // Get gift wrap by ID
  getWrapById: async (id: string): Promise<GiftWrap> => {
    const response = await api.get<GiftWrappingAPIResponse<GiftWrap>>(`/gift-wrapping/wraps/${id}`);
    return response?.data?.data || response?.data;
  },

  // Add gift wrap to order
  addToOrder: async (data: CreateGiftWrapOrderData): Promise<GiftWrapOrder> => {
    const response = await api.post<GiftWrappingAPIResponse<GiftWrapOrder>>('/gift-wrapping/orders', data);
    return response?.data?.data || response?.data;
  },

  // Get my gift wrap orders
  getMyOrders: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<GiftWrapOrder>> => {
    const response = await api.get<PaginatedGiftWrappingResponse<GiftWrapOrder>>('/gift-wrapping/my-orders', { params });
    return {
      data: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      limit: params?.limit || 10,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  // Remove gift wrap from order
  removeFromOrder: async (orderId: string): Promise<void> => {
    await api.delete(`/gift-wrapping/orders/${orderId}`);
  },
};

export default giftWrappingAPI;
