import apiClient from './client';

export interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed' | 'free-shipping' | 'buy-x-get-y';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  description: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  perUserLimit: number;
  userUsageCount: number;
  status: 'active' | 'expired' | 'upcoming' | 'used-up';
  categories?: string[];
  excludedProducts?: number[];
  stackable: boolean;
  autoApply: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCouponDto {
  code: string;
  type: 'percentage' | 'fixed' | 'free-shipping' | 'buy-x-get-y';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  description: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  perUserLimit: number;
  categories?: string[];
  excludedProducts?: number[];
  stackable: boolean;
  autoApply: boolean;
}

export interface UpdateCouponDto extends Partial<CreateCouponDto> {
  status?: 'active' | 'expired' | 'upcoming' | 'used-up';
}

export interface CouponFilters {
  status?: 'active' | 'expired' | 'upcoming' | 'used-up';
  type?: 'percentage' | 'fixed' | 'free-shipping' | 'buy-x-get-y';
  search?: string;
  page?: number;
  limit?: number;
}

export interface CouponStats {
  total: number;
  active: number;
  expired: number;
  upcoming: number;
  usedUp: number;
  totalUsage: number;
  totalDiscountGiven: number;
  avgUsagePerCoupon: number;
}

export interface CouponUsage {
  id: number;
  couponId: number;
  couponCode: string;
  userId: number;
  userName: string;
  orderId: number;
  discountAmount: number;
  usedAt: string;
}

export interface ValidateCouponDto {
  code: string;
  userId?: number;
  cartTotal: number;
  items?: Array<{
    productId: number;
    categoryId: number;
    quantity: number;
    price: number;
  }>;
}

export interface CouponValidation {
  valid: boolean;
  coupon?: Coupon;
  discountAmount?: number;
  message?: string;
  errors?: string[];
}

export const couponsAPI = {
  // Get all coupons with filters
  getAll: async (filters?: CouponFilters) => {
    const response = await apiClient.get('/coupons', { params: filters });
    return response.data;
  },

  // Get coupon by ID
  getById: async (id: number) => {
    const response = await apiClient.get(`/coupons/${id}`);
    return response.data;
  },

  // Get coupon by code
  getByCode: async (code: string) => {
    const response = await apiClient.get(`/coupons/code/${code}`);
    return response.data;
  },

  // Create new coupon
  create: async (data: CreateCouponDto) => {
    const response = await apiClient.post('/coupons', data);
    return response.data;
  },

  // Update coupon
  update: async (id: number, data: UpdateCouponDto) => {
    const response = await apiClient.put(`/coupons/${id}`, data);
    return response.data;
  },

  // Delete coupon
  delete: async (id: number) => {
    const response = await apiClient.delete(`/coupons/${id}`);
    return response.data;
  },

  // Get coupon statistics
  getStats: async () => {
    const response = await apiClient.get<CouponStats>('/coupons/stats');
    return response.data;
  },

  // Get coupon usage history
  getUsageHistory: async (couponId: number, page = 1, limit = 10) => {
    const response = await apiClient.get(`/coupons/${couponId}/usage`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Validate coupon
  validate: async (data: ValidateCouponDto) => {
    const response = await apiClient.post<CouponValidation>('/coupons/validate', data);
    return response.data;
  },

  // Apply coupon to cart
  apply: async (code: string, userId: number, cartTotal: number) => {
    const response = await apiClient.post('/coupons/apply', {
      code,
      userId,
      cartTotal,
    });
    return response.data;
  },

  // Deactivate coupon
  deactivate: async (id: number) => {
    const response = await apiClient.patch(`/coupons/${id}/deactivate`);
    return response.data;
  },

  // Activate coupon
  activate: async (id: number) => {
    const response = await apiClient.patch(`/coupons/${id}/activate`);
    return response.data;
  },

  // Duplicate coupon
  duplicate: async (id: number) => {
    const response = await apiClient.post(`/coupons/${id}/duplicate`);
    return response.data;
  },

  // Get auto-apply coupons
  getAutoApply: async (cartTotal: number, items?: any[]) => {
    const response = await apiClient.post('/coupons/auto-apply', {
      cartTotal,
      items,
    });
    return response.data;
  },

  // Bulk delete coupons
  bulkDelete: async (ids: number[]) => {
    const response = await apiClient.post('/coupons/bulk-delete', { ids });
    return response.data;
  },

  // Bulk update status
  bulkUpdateStatus: async (ids: number[], status: 'active' | 'expired' | 'upcoming' | 'used-up') => {
    const response = await apiClient.post('/coupons/bulk-update-status', {
      ids,
      status,
    });
    return response.data;
  },
};
