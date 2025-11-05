import api from './client';

// ========================================
// Flash Sales Types
// ========================================

export interface FlashSale {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'active' | 'ended' | 'cancelled';
  discountType: 'percentage' | 'fixed' | 'buy_one_get_one';
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  totalInventory: number;
  soldQuantity: number;
  remainingQuantity: number;
  products: FlashSaleProduct[];
  bannerImage?: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  analytics: FlashSaleAnalytics;
}

export interface FlashSaleProduct {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  inventory: number;
  soldQuantity: number;
  remainingQuantity: number;
  isActive: boolean;
  category: string;
  sku: string;
}

export interface FlashSaleAnalytics {
  totalRevenue: number;
  totalOrders: number;
  conversionRate: number;
  averageOrderValue: number;
  viewCount: number;
  clickCount: number;
  addToCartCount: number;
  participantCount: number;
  returnCustomers: number;
}

export interface DailyDeal {
  id: string;
  title: string;
  description: string;
  date: string;
  product: FlashSaleProduct;
  featuredImage: string;
  status: 'scheduled' | 'active' | 'ended';
  viewCount: number;
  soldCount: number;
  revenue: number;
  isRecurring: boolean;
  recurringDays?: string[];
  notificationsSent: number;
}

export interface FlashSaleTemplate {
  id: string;
  name: string;
  description: string;
  discountType: FlashSale['discountType'];
  discountValue: number;
  duration: number; // in hours
  productSelection: 'manual' | 'category' | 'trending' | 'clearance';
  categoryId?: string;
  minOrderValue?: number;
  maxDiscount?: number;
  bannerTemplate: string;
  isActive: boolean;
}

export interface FlashSaleStats {
  totalSales: number;
  activeSales: number;
  scheduledSales: number;
  endedSales: number;
  totalRevenue: number;
  totalOrders: number;
  averageConversionRate: number;
  topPerformingSale: FlashSale;
  recentActivity: FlashSaleActivity[];
}

export interface FlashSaleActivity {
  id: string;
  type: 'sale_started' | 'sale_ended' | 'product_sold_out' | 'milestone_reached';
  flashSaleId: string;
  flashSaleTitle: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface FlashSaleFilters {
  status?: FlashSale['status'];
  startDate?: string;
  endDate?: string;
  discountType?: FlashSale['discountType'];
  category?: string;
  minRevenue?: number;
  maxRevenue?: number;
  sortBy?: 'startTime' | 'endTime' | 'revenue' | 'soldQuantity' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface FlashSaleCreateRequest {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  discountType: FlashSale['discountType'];
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  productIds: string[];
  bannerImage?: string;
  priority?: number;
  sendNotifications?: boolean;
  notificationChannels?: ('email' | 'sms' | 'push')[];
}

export interface FlashSaleUpdateRequest {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  discountValue?: number;
  maxDiscount?: number;
  minOrderValue?: number;
  bannerImage?: string;
  priority?: number;
  status?: FlashSale['status'];
}

// ========================================
// Flash Sales API Service
// ========================================

export const flashSalesAPI = {
  // ========================================
  // Flash Sales CRUD Operations
  // ========================================
  
  getAll: async (filters?: FlashSaleFilters): Promise<{
    flashSales: FlashSale[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await api.get('/flash-sales', {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string): Promise<FlashSale> => {
    const response = await api.get(`/flash-sales/${id}`);
    return response.data;
  },

  create: async (saleData: FlashSaleCreateRequest): Promise<FlashSale> => {
    const response = await api.post('/flash-sales', saleData);
    return response.data;
  },

  update: async (id: string, updateData: FlashSaleUpdateRequest): Promise<FlashSale> => {
    const response = await api.put(`/flash-sales/${id}`, updateData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/flash-sales/${id}`);
  },

  // ========================================
  // Flash Sale Management
  // ========================================

  start: async (id: string): Promise<FlashSale> => {
    const response = await api.post(`/flash-sales/${id}/start`);
    return response.data;
  },

  end: async (id: string): Promise<FlashSale> => {
    const response = await api.post(`/flash-sales/${id}/end`);
    return response.data;
  },

  cancel: async (id: string, reason?: string): Promise<FlashSale> => {
    const response = await api.post(`/flash-sales/${id}/cancel`, { reason });
    return response.data;
  },

  extend: async (id: string, newEndTime: string): Promise<FlashSale> => {
    const response = await api.post(`/flash-sales/${id}/extend`, { newEndTime });
    return response.data;
  },

  duplicate: async (id: string, modifications?: Partial<FlashSaleCreateRequest>): Promise<FlashSale> => {
    const response = await api.post(`/flash-sales/${id}/duplicate`, modifications);
    return response.data;
  },

  // ========================================
  // Product Management in Flash Sales
  // ========================================

  addProducts: async (saleId: string, productIds: string[]): Promise<FlashSale> => {
    const response = await api.post(`/flash-sales/${saleId}/products`, { productIds });
    return response.data;
  },

  removeProduct: async (saleId: string, productId: string): Promise<FlashSale> => {
    const response = await api.delete(`/flash-sales/${saleId}/products/${productId}`);
    return response.data;
  },

  updateProductPrice: async (
    saleId: string, 
    productId: string, 
    salePrice: number
  ): Promise<FlashSaleProduct> => {
    const response = await api.put(`/flash-sales/${saleId}/products/${productId}/price`, {
      salePrice,
    });
    return response.data;
  },

  updateProductInventory: async (
    saleId: string, 
    productId: string, 
    inventory: number
  ): Promise<FlashSaleProduct> => {
    const response = await api.put(`/flash-sales/${saleId}/products/${productId}/inventory`, {
      inventory,
    });
    return response.data;
  },

  // ========================================
  // Daily Deals
  // ========================================

  getDailyDeals: async (date?: string): Promise<DailyDeal[]> => {
    const response = await api.get('/daily-deals', {
      params: { date },
    });
    return response.data;
  },

  createDailyDeal: async (dealData: {
    title: string;
    description: string;
    date: string;
    productId: string;
    salePrice: number;
    featuredImage?: string;
    isRecurring?: boolean;
    recurringDays?: string[];
  }): Promise<DailyDeal> => {
    const response = await api.post('/daily-deals', dealData);
    return response.data;
  },

  updateDailyDeal: async (id: string, updateData: Partial<DailyDeal>): Promise<DailyDeal> => {
    const response = await api.put(`/daily-deals/${id}`, updateData);
    return response.data;
  },

  deleteDailyDeal: async (id: string): Promise<void> => {
    await api.delete(`/daily-deals/${id}`);
  },

  // ========================================
  // Templates Management
  // ========================================

  getTemplates: async (): Promise<FlashSaleTemplate[]> => {
    const response = await api.get('/flash-sales/templates');
    return response.data;
  },

  createTemplate: async (templateData: Omit<FlashSaleTemplate, 'id'>): Promise<FlashSaleTemplate> => {
    const response = await api.post('/flash-sales/templates', templateData);
    return response.data;
  },

  updateTemplate: async (id: string, updateData: Partial<FlashSaleTemplate>): Promise<FlashSaleTemplate> => {
    const response = await api.put(`/flash-sales/templates/${id}`, updateData);
    return response.data;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await api.delete(`/flash-sales/templates/${id}`);
  },

  applyTemplate: async (templateId: string, modifications: FlashSaleCreateRequest): Promise<FlashSale> => {
    const response = await api.post(`/flash-sales/templates/${templateId}/apply`, modifications);
    return response.data;
  },

  // ========================================
  // Analytics and Statistics
  // ========================================

  getStats: async (dateRange?: { start: string; end: string }): Promise<FlashSaleStats> => {
    const response = await api.get('/flash-sales/stats', {
      params: dateRange,
    });
    return response.data;
  },

  getAnalytics: async (saleId: string): Promise<FlashSaleAnalytics> => {
    const response = await api.get(`/flash-sales/${saleId}/analytics`);
    return response.data;
  },

  getPerformanceReport: async (saleId: string): Promise<{
    analytics: FlashSaleAnalytics;
    hourlyBreakdown: { hour: string; sales: number; revenue: number }[];
    topProducts: FlashSaleProduct[];
    customerSegments: { segment: string; count: number; revenue: number }[];
    comparisonData: any;
  }> => {
    const response = await api.get(`/flash-sales/${saleId}/performance`);
    return response.data;
  },

  getActivity: async (limit: number = 20): Promise<FlashSaleActivity[]> => {
    const response = await api.get('/flash-sales/activity', {
      params: { limit },
    });
    return response.data;
  },

  // ========================================
  // Notifications and Marketing
  // ========================================

  sendNotification: async (saleId: string, options: {
    channels: ('email' | 'sms' | 'push')[];
    message?: string;
    segments?: string[];
    scheduleTime?: string;
  }): Promise<{ sent: number; failed: number; scheduleId?: string }> => {
    const response = await api.post(`/flash-sales/${saleId}/notify`, options);
    return response.data;
  },

  getSubscribers: async (saleId: string): Promise<{
    total: number;
    byChannel: Record<string, number>;
    subscribers: any[];
  }> => {
    const response = await api.get(`/flash-sales/${saleId}/subscribers`);
    return response.data;
  },

  // ========================================
  // Bulk Operations
  // ========================================

  bulkStart: async (saleIds: string[]): Promise<{ started: number; failed: string[] }> => {
    const response = await api.post('/flash-sales/bulk/start', { saleIds });
    return response.data;
  },

  bulkEnd: async (saleIds: string[]): Promise<{ ended: number; failed: string[] }> => {
    const response = await api.post('/flash-sales/bulk/end', { saleIds });
    return response.data;
  },

  bulkCancel: async (saleIds: string[], reason?: string): Promise<{ cancelled: number; failed: string[] }> => {
    const response = await api.post('/flash-sales/bulk/cancel', { saleIds, reason });
    return response.data;
  },

  bulkDelete: async (saleIds: string[]): Promise<{ deleted: number; failed: string[] }> => {
    const response = await api.post('/flash-sales/bulk/delete', { saleIds });
    return response.data;
  },

  // ========================================
  // Search and Discovery
  // ========================================

  search: async (query: string, filters?: FlashSaleFilters): Promise<FlashSale[]> => {
    const response = await api.get('/flash-sales/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  getSuggestions: async (partial: string): Promise<string[]> => {
    const response = await api.get('/flash-sales/suggestions', {
      params: { partial },
    });
    return response.data;
  },

  // ========================================
  // Export and Import
  // ========================================

  export: async (filters?: FlashSaleFilters, format: 'csv' | 'xlsx' | 'json' = 'csv'): Promise<Blob> => {
    const response = await api.get('/flash-sales/export', {
      params: { ...filters, format },
      responseType: 'blob',
    });
    return response.data;
  },

  import: async (
    file: File,
    options?: { skipValidation?: boolean; updateExisting?: boolean }
  ): Promise<{ imported: number; errors: any[]; skipped: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    const response = await api.post('/flash-sales/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ========================================
  // Real-time Features
  // ========================================

  getCurrentLive: async (): Promise<FlashSale[]> => {
    const response = await api.get('/flash-sales/live');
    return response.data;
  },

  getUpcoming: async (hours: number = 24): Promise<FlashSale[]> => {
    const response = await api.get('/flash-sales/upcoming', {
      params: { hours },
    });
    return response.data;
  },

  getCountdown: async (saleId: string): Promise<{
    timeRemaining: number;
    endTime: string;
    status: 'active' | 'ended' | 'not_started';
    formattedTime: {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    };
  }> => {
    const response = await api.get(`/flash-sales/${saleId}/countdown`);
    return response.data;
  },
};

export default flashSalesAPI;