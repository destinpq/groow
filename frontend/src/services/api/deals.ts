import apiClient from './client';

export interface Deal {
  id: number;
  title: string;
  description: string;
  type: 'percentage' | 'fixed' | 'buy-x-get-y' | 'bundle' | 'flash-sale';
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  targetType: 'all' | 'new-customers' | 'vip' | 'category' | 'product';
  targetValue?: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  priority: number;
  bannerImage?: string;
  bannerText?: string;
  termsAndConditions?: string;
  stackable: boolean;
  autoApply: boolean;
  requiredQuantity?: number;
  freeQuantity?: number;
  categories?: string[];
  products?: number[];
  excludedProducts?: number[];
  tags: string[];
  revenueGenerated: number;
  clickCount: number;
  conversionRate: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDealDto {
  title: string;
  description: string;
  type: 'percentage' | 'fixed' | 'buy-x-get-y' | 'bundle' | 'flash-sale';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  targetType: 'all' | 'new-customers' | 'vip' | 'category' | 'product';
  targetValue?: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  priority?: number;
  bannerImage?: string;
  bannerText?: string;
  termsAndConditions?: string;
  stackable?: boolean;
  autoApply?: boolean;
  requiredQuantity?: number;
  freeQuantity?: number;
  categories?: string[];
  products?: number[];
  excludedProducts?: number[];
  tags?: string[];
}

export interface UpdateDealDto extends Partial<CreateDealDto> {
  isActive?: boolean;
}

export interface DealFilters {
  type?: string;
  isActive?: boolean;
  targetType?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: 'title' | 'startDate' | 'endDate' | 'priority' | 'usageCount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DealStats {
  total: number;
  active: number;
  upcoming: number;
  expired: number;
  totalRevenue: number;
  totalClicks: number;
  avgConversionRate: number;
  mostPopularType: string;
  topPerformingDeal?: {
    id: number;
    title: string;
    revenue: number;
    conversions: number;
  };
}

export interface DealAnalytics {
  dealId: number;
  title: string;
  clicks: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  dailyStats: Array<{
    date: string;
    clicks: number;
    conversions: number;
    revenue: number;
  }>;
  topProducts?: Array<{
    productId: number;
    productName: string;
    sales: number;
    revenue: number;
  }>;
}

export interface DealUsage {
  id: number;
  dealId: number;
  dealTitle: string;
  userId: number;
  userName: string;
  orderId: number;
  discountAmount: number;
  orderValue: number;
  usedAt: string;
}

export const dealsAPI = {
  // Get all deals with filters
  getAll: async (filters?: DealFilters) => {
    const response = await apiClient.get('/deals', { params: filters });
    return response.data;
  },

  // Get deal by ID
  getById: async (id: number) => {
    const response = await apiClient.get(`/deals/${id}`);
    return response.data;
  },

  // Create new deal
  create: async (data: CreateDealDto) => {
    const response = await apiClient.post('/deals', data);
    return response.data;
  },

  // Update deal
  update: async (id: number, data: UpdateDealDto) => {
    const response = await apiClient.put(`/deals/${id}`, data);
    return response.data;
  },

  // Delete deal
  delete: async (id: number) => {
    const response = await apiClient.delete(`/deals/${id}`);
    return response.data;
  },

  // Get deal statistics
  getStats: async () => {
    const response = await apiClient.get<DealStats>('/deals/stats');
    return response.data;
  },

  // Get deal analytics
  getAnalytics: async (id: number, startDate?: string, endDate?: string) => {
    const response = await apiClient.get<DealAnalytics>(`/deals/${id}/analytics`, {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Get deal usage history
  getUsageHistory: async (dealId: number, page = 1, limit = 10) => {
    const response = await apiClient.get(`/deals/${dealId}/usage`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Toggle deal status (activate/deactivate)
  toggleStatus: async (id: number) => {
    const response = await apiClient.patch(`/deals/${id}/toggle-status`);
    return response.data;
  },

  // Duplicate deal
  duplicate: async (id: number) => {
    const response = await apiClient.post(`/deals/${id}/duplicate`);
    return response.data;
  },

  // Get active deals for customer
  getActiveDeals: async (userId?: number, categoryId?: number) => {
    const response = await apiClient.get('/deals/active', {
      params: { userId, categoryId },
    });
    return response.data;
  },

  // Check deal eligibility
  checkEligibility: async (dealId: number, userId: number, cartItems?: any[]) => {
    const response = await apiClient.post(`/deals/${dealId}/check-eligibility`, {
      userId,
      cartItems,
    });
    return response.data;
  },

  // Apply deal to cart
  apply: async (dealId: number, userId: number, cartItems: any[]) => {
    const response = await apiClient.post(`/deals/${dealId}/apply`, {
      userId,
      cartItems,
    });
    return response.data;
  },

  // Track deal click
  trackClick: async (dealId: number, userId?: number) => {
    const response = await apiClient.post(`/deals/${dealId}/track-click`, {
      userId,
    });
    return response.data;
  },

  // Get best deals for user
  getBestDeals: async (userId: number, limit = 5) => {
    const response = await apiClient.get(`/deals/best-for-user/${userId}`, {
      params: { limit },
    });
    return response.data;
  },

  // Bulk operations
  bulkDelete: async (ids: number[]) => {
    const response = await apiClient.post('/deals/bulk-delete', { ids });
    return response.data;
  },

  bulkUpdateStatus: async (ids: number[], isActive: boolean) => {
    const response = await apiClient.post('/deals/bulk-update-status', {
      ids,
      isActive,
    });
    return response.data;
  },

  // Upload banner image
  uploadBanner: async (dealId: number, file: File) => {
    const formData = new FormData();
    formData.append('banner', file);
    const response = await apiClient.post(`/deals/${dealId}/upload-banner`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Get deal performance report
  getPerformanceReport: async (startDate: string, endDate: string) => {
    const response = await apiClient.get('/deals/performance-report', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Get trending deals
  getTrendingDeals: async (limit = 10) => {
    const response = await apiClient.get('/deals/trending', {
      params: { limit },
    });
    return response.data;
  },
};