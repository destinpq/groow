import apiClient from './client';

// Backend POJO imports - Deal Management Module
import {
  DealEntity,
  DealUsageEntity,
  DealTemplateEntity,
  DealCampaignEntity,
  DealABTestEntity,
  DealAPIResponse,
  PaginatedDealResponse,
  CreateDealRequest,
  UpdateDealRequest,
  CreateDealTemplateRequest,
  CreateDealCampaignRequest,
  CreateDealABTestRequest,
  GetDealsResponse,
  GetDealUsageResponse,
  GetDealTemplatesResponse,
  DealStatsResponse,
  DealEligibilityResponse,
  DealApplicationResponse,
  DealType,
  DealUsageStatus,
  DealCampaignStatus
} from '../../types/backend/deal';
import { APIResponse, PaginatedResponse } from '../../types/backend/pagination';

// Request/Response Types for compatibility
export interface CreateDealRequestLegacy {
  title: string;
  description: string;
  dealType: string;
  discountRules: {
    type: string;
    value: number;
    minQuantity?: number;
    maxQuantity?: number;
    minOrderValue?: number;
    freeItems?: number;
  };
  conditions?: {
    applicableProducts?: string[];
    applicableCategories?: string[];
    applicableVendors?: string[];
    newCustomersOnly?: boolean;
    minOrderValue?: number;
    maxUsagePerCustomer?: number;
    excludedProducts?: string[];
    paymentMethods?: string[];
  };
  startDate: string;
  endDate: string;
  usageLimit?: number;
  banner?: {
    imageUrl: string;
    altText: string;
    clickAction: string;
  };
  targeting?: {
    userSegments: string[];
    geoLocations: string[];
    demographics: {
      ageRange?: { min: number; max: number };
      gender?: string;
    };
  };
  terms?: string;
  tags?: string[];
}

export interface UpdateDealRequestLegacy extends Partial<CreateDealRequestLegacy> {
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface GetDealsResponseLegacy {
  deals: DealEntity[];
  total: number;
  page: number;
  totalPages: number;
}

// Legacy interfaces for backward compatibility
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

// Deal Management API with backend POJOs integration
export const dealsAPI = {
  // ========================================
  // Deal Management with typed POJOs  
  // ========================================
  getAll: async (filters?: {
    dealType?: DealType;
    isActive?: boolean;
    isFeatured?: boolean;
    category?: string;
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
    customerId?: string;
    minRevenue?: number;
    search?: string;
    sortBy?: 'title' | 'startDate' | 'endDate' | 'priority' | 'usageCount' | 'revenue';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<GetDealsResponse> => {
    const response = await apiClient.get<PaginatedDealResponse<DealEntity>>('/deals', { 
      params: filters 
    });
    return {
      deals: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  getById: async (id: string): Promise<DealEntity> => {
    const response = await apiClient.get<DealAPIResponse<DealEntity>>(`/deals/${id}`);
    return response?.data?.data || response?.data;
  },

  create: async (data: CreateDealRequest): Promise<DealEntity> => {
    const response = await apiClient.post<DealAPIResponse<DealEntity>>('/deals', data);
    return response?.data?.data || response?.data;
  },

  update: async (id: string, data: UpdateDealRequest): Promise<DealEntity> => {
    const response = await apiClient.put<DealAPIResponse<DealEntity>>(`/deals/${id}`, data);
    return response?.data?.data || response?.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/deals/${id}`);
  },

  // ========================================
  // Deal Analytics & Statistics
  // ========================================
  getStats: async (filters?: {
    dateFrom?: Date;
    dateTo?: Date;
    dealTypes?: DealType[];
    categories?: string[];
  }): Promise<DealStatsResponse> => {
    const response = await apiClient.get<DealAPIResponse<DealStatsResponse>>('/deals/stats', {
      params: filters
    });
    // Backend returns: {success: true, data: {...stats...}}
    // NOT nested like products, so use response.data NOT response.data.data
    return response.data as any;
  },

  getAnalytics: async (id: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    granularity?: 'hour' | 'day' | 'week' | 'month';
    includeSegments?: boolean;
    includeProducts?: boolean;
  }): Promise<DealEntity['analytics']> => {
    const response = await apiClient.get<DealAPIResponse<DealEntity['analytics']>>(
      `/deals/${id}/analytics`, 
      { params: filters }
    );
    return response?.data?.data || response?.data;
  },

  getPerformanceReport: async (filters?: {
    startDate?: Date;
    endDate?: Date;
    dealIds?: string[];
    format?: 'summary' | 'detailed' | 'export';
  }): Promise<{
    summary: {
      totalDeals: number;
      totalRevenue: number;
      totalConversions: number;
      avgConversionRate: number;
    };
    deals: {
      id: string;
      title: string;
      revenue: number;
      conversions: number;
      conversionRate: number;
      roi: number;
      ranking: number;
    }[];
    trends: {
      date: string;
      revenue: number;
      conversions: number;
      activeDeals: number;
    }[];
    insights: {
      topPerformingType: DealType;
      bestTimeSlots: string[];
      recommendedActions: string[];
    };
  }> => {
    const response = await apiClient.get<DealAPIResponse<any>>('/deals/performance-report', {
      params: filters
    });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Deal Usage & History
  // ========================================
  getUsageHistory: async (dealId: string, filters?: {
    customerId?: string;
    status?: DealUsageStatus;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<GetDealUsageResponse> => {
    const response = await apiClient.get<PaginatedDealResponse<DealUsageEntity>>(
      `/deals/${dealId}/usage`, 
      { params: filters }
    );
    return {
      usages: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  getCustomerUsage: async (customerId: string, filters?: {
    dealId?: string;
    status?: DealUsageStatus;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<GetDealUsageResponse> => {
    const response = await apiClient.get<PaginatedDealResponse<DealUsageEntity>>(
      `/deals/customer/${customerId}/usage`, 
      { params: filters }
    );
    return {
      usages: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  // ========================================
  // Deal Eligibility & Application
  // ========================================
  checkEligibility: async (dealId: string, data: {
    customerId?: string;
    cartItems?: {
      productId: string;
      quantity: number;
      price: number;
    }[];
    orderValue?: number;
    location?: {
      country: string;
      state?: string;
      city?: string;
    };
  }): Promise<DealEligibilityResponse> => {
    const response = await apiClient.post<DealAPIResponse<DealEligibilityResponse>>(
      `/deals/${dealId}/check-eligibility`, 
      data
    );
    return response?.data?.data || response?.data;
  },

  apply: async (dealId: string, data: {
    customerId: string;
    cartItems: {
      productId: string;
      quantity: number;
      price: number;
    }[];
    orderValue: number;
    currency?: string;
  }): Promise<DealApplicationResponse> => {
    const response = await apiClient.post<DealAPIResponse<DealApplicationResponse>>(
      `/deals/${dealId}/apply`, 
      data
    );
    return response?.data?.data || response?.data;
  },

  validateCode: async (code: string, customerId?: string): Promise<{
    isValid: boolean;
    deal?: DealEntity;
    error?: string;
    eligibility?: DealEligibilityResponse;
  }> => {
    const response = await apiClient.post<DealAPIResponse<any>>('/deals/validate-code', {
      code,
      customerId
    });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Deal Discovery & Recommendations
  // ========================================
  getActiveDeals: async (filters?: {
    customerId?: string;
    categoryId?: string;
    productId?: string;
    location?: { country: string; state?: string };
    limit?: number;
    sortBy?: 'priority' | 'discount' | 'expiration' | 'popularity';
  }): Promise<DealEntity[]> => {
    const response = await apiClient.get<DealAPIResponse<DealEntity[]>>('/deals/active', {
      params: filters
    });
    return response?.data?.data || response?.data;
  },

  getFeaturedDeals: async (limit = 6): Promise<DealEntity[]> => {
    const response = await apiClient.get<DealAPIResponse<DealEntity[]>>('/deals/featured', {
      params: { limit }
    });
    return response?.data?.data || response?.data;
  },

  getTrendingDeals: async (filters?: {
    period?: 'day' | 'week' | 'month';
    limit?: number;
    category?: string;
  }): Promise<DealEntity[]> => {
    const response = await apiClient.get<DealAPIResponse<DealEntity[]>>('/deals/trending', {
      params: filters
    });
    return response?.data?.data || response?.data;
  },

  getPersonalizedDeals: async (customerId: string, filters?: {
    limit?: number;
    categories?: string[];
    excludeUsed?: boolean;
  }): Promise<{
    recommended: DealEntity[];
    similar: DealEntity[];
    expiringSoon: DealEntity[];
    newDeals: DealEntity[];
  }> => {
    const response = await apiClient.get<DealAPIResponse<any>>(`/deals/personalized/${customerId}`, {
      params: filters
    });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Deal Templates
  // ========================================
  getTemplates: async (filters?: {
    category?: string;
    isPublic?: boolean;
    search?: string;
    createdById?: string;
    page?: number;
    limit?: number;
  }): Promise<GetDealTemplatesResponse> => {
    const response = await apiClient.get<PaginatedDealResponse<DealTemplateEntity>>('/deals/templates', {
      params: filters
    });
    return {
      templates: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  getTemplateById: async (id: string): Promise<DealTemplateEntity> => {
    const response = await apiClient.get<DealAPIResponse<DealTemplateEntity>>(`/deals/templates/${id}`);
    return response?.data?.data || response?.data;
  },

  createTemplate: async (data: CreateDealTemplateRequest): Promise<DealTemplateEntity> => {
    const response = await apiClient.post<DealAPIResponse<DealTemplateEntity>>('/deals/templates', data);
    return response?.data?.data || response?.data;
  },

  createFromTemplate: async (templateId: string, data: Partial<CreateDealRequest>): Promise<DealEntity> => {
    const response = await apiClient.post<DealAPIResponse<DealEntity>>(
      `/deals/templates/${templateId}/create`, 
      data
    );
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Deal Campaigns
  // ========================================
  getCampaigns: async (filters?: {
    status?: DealCampaignStatus;
    createdById?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<{
    campaigns: DealCampaignEntity[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await apiClient.get<PaginatedDealResponse<DealCampaignEntity>>('/deals/campaigns', {
      params: filters
    });
    return {
      campaigns: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  getCampaignById: async (id: string): Promise<DealCampaignEntity> => {
    const response = await apiClient.get<DealAPIResponse<DealCampaignEntity>>(`/deals/campaigns/${id}`);
    return response?.data?.data || response?.data;
  },

  createCampaign: async (data: CreateDealCampaignRequest): Promise<DealCampaignEntity> => {
    const response = await apiClient.post<DealAPIResponse<DealCampaignEntity>>('/deals/campaigns', data);
    return response?.data?.data || response?.data;
  },

  updateCampaignStatus: async (id: string, status: DealCampaignStatus): Promise<DealCampaignEntity> => {
    const response = await apiClient.patch<DealAPIResponse<DealCampaignEntity>>(
      `/deals/campaigns/${id}/status`, 
      { status }
    );
    return response?.data?.data || response?.data;
  },

  // ========================================
  // A/B Testing
  // ========================================
  getABTests: async (filters?: {
    status?: string;
    createdById?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    tests: DealABTestEntity[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await apiClient.get<PaginatedDealResponse<DealABTestEntity>>('/deals/ab-tests', {
      params: filters
    });
    return {
      tests: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  createABTest: async (data: CreateDealABTestRequest): Promise<DealABTestEntity> => {
    const response = await apiClient.post<DealAPIResponse<DealABTestEntity>>('/deals/ab-tests', data);
    return response?.data?.data || response?.data;
  },

  getABTestResults: async (testId: string): Promise<DealABTestEntity['results']> => {
    const response = await apiClient.get<DealAPIResponse<DealABTestEntity['results']>>(
      `/deals/ab-tests/${testId}/results`
    );
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Deal Operations
  // ========================================
  toggleStatus: async (id: string): Promise<DealEntity> => {
    const response = await apiClient.patch<DealAPIResponse<DealEntity>>(`/deals/${id}/toggle-status`);
    return response?.data?.data || response?.data;
  },

  duplicate: async (id: string, modifications?: Partial<CreateDealRequest>): Promise<DealEntity> => {
    const response = await apiClient.post<DealAPIResponse<DealEntity>>(`/deals/${id}/duplicate`, modifications);
    return response?.data?.data || response?.data;
  },

  extend: async (id: string, newEndDate: Date): Promise<DealEntity> => {
    const response = await apiClient.patch<DealAPIResponse<DealEntity>>(`/deals/${id}/extend`, {
      endDate: newEndDate
    });
    return response?.data?.data || response?.data;
  },

  trackClick: async (dealId: string, data?: {
    customerId?: string;
    source?: string;
    campaign?: string;
    medium?: string;
  }): Promise<void> => {
    await apiClient.post(`/deals/${dealId}/track-click`, data);
  },

  trackImpression: async (dealId: string, data?: {
    customerId?: string;
    location?: string;
    context?: string;
  }): Promise<void> => {
    await apiClient.post(`/deals/${dealId}/track-impression`, data);
  },

  // ========================================
  // Bulk Operations
  // ========================================
  bulkDelete: async (ids: string[]): Promise<{
    successful: string[];
    failed: { id: string; error: string }[];
  }> => {
    const response = await apiClient.post<DealAPIResponse<any>>('/deals/bulk-delete', { ids });
    return response?.data?.data || response?.data;
  },

  bulkUpdateStatus: async (ids: string[], isActive: boolean): Promise<{
    successful: DealEntity[];
    failed: { id: string; error: string }[];
  }> => {
    const response = await apiClient.post<DealAPIResponse<any>>('/deals/bulk-update-status', {
      ids,
      isActive
    });
    return response?.data?.data || response?.data;
  },

  bulkApplyTags: async (ids: string[], tags: string[]): Promise<{
    successful: DealEntity[];
    failed: { id: string; error: string }[];
  }> => {
    const response = await apiClient.post<DealAPIResponse<any>>('/deals/bulk-apply-tags', {
      ids,
      tags
    });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Media & Assets
  // ========================================
  uploadBanner: async (dealId: string, file: File, metadata?: {
    altText?: string;
    position?: 'top' | 'center' | 'bottom';
    size?: 'small' | 'medium' | 'large' | 'full';
  }): Promise<DealEntity> => {
    const formData = new FormData();
    formData.append('banner', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await apiClient.post<DealAPIResponse<DealEntity>>(
      `/deals/${dealId}/upload-banner`, 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response?.data?.data || response?.data;
  },

  deleteBanner: async (dealId: string): Promise<DealEntity> => {
    const response = await apiClient.delete<DealAPIResponse<DealEntity>>(`/deals/${dealId}/banner`);
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Export & Reporting
  // ========================================
  exportDeals: async (filters?: {
    format?: 'csv' | 'xlsx' | 'json';
    dealIds?: string[];
    dateRange?: { start: Date; end: Date };
    includeAnalytics?: boolean;
  }): Promise<Blob> => {
    const response = await apiClient.post('/deals/export', filters, {
      responseType: 'blob'
    });
    return response.data;
  },

  generateReport: async (type: 'performance' | 'usage' | 'conversion' | 'revenue', filters?: {
    dateRange?: { start: Date; end: Date };
    dealIds?: string[];
    format?: 'pdf' | 'html' | 'json';
  }): Promise<Blob> => {
    const response = await apiClient.post(`/deals/reports/${type}`, filters, {
      responseType: 'blob'
    });
    return response.data;
  },

  // ========================================
  // Legacy Compatibility Methods
  // ========================================
  getAllLegacy: async (filters?: DealFilters): Promise<Deal[]> => {
    const response = await dealsAPI.getAll({
      dealType: filters?.type as DealType,
      isActive: filters?.isActive,
      search: filters?.search,
      page: filters?.page,
      limit: filters?.limit,
    });
    
    return response.deals.map(deal => ({
      id: parseInt(deal.id),
      title: deal.title,
      description: deal.description,
      type: deal.dealType as any,
      value: deal.discountRules.value,
      minPurchase: deal.conditions?.minOrderValue || 0,
      maxDiscount: deal.discountRules.maxDiscount,
      targetType: deal.conditions?.newCustomersOnly ? 'new-customers' : 'all',
      targetValue: deal.conditions?.applicableCategories?.[0],
      startDate: deal.startDate.toISOString(),
      endDate: deal.endDate.toISOString(),
      usageLimit: deal.usageLimit || 0,
      usageCount: deal.usageCount,
      isActive: deal.isActive,
      priority: deal.priority,
      bannerImage: deal.banner?.imageUrl,
      bannerText: deal.banner?.altText,
      termsAndConditions: deal.metadata.terms,
      stackable: deal.isStackable,
      autoApply: deal.isAutoApply,
      requiredQuantity: deal.discountRules.minQuantity,
      freeQuantity: deal.discountRules.getQuantity,
      categories: deal.conditions?.applicableCategories,
      products: deal.conditions?.applicableProducts?.map(id => parseInt(id)),
      excludedProducts: deal.conditions?.excludedProducts?.map(id => parseInt(id)),
      tags: deal.metadata.tags,
      revenueGenerated: deal.analytics.revenue,
      clickCount: deal.analytics.clicks,
      conversionRate: deal.analytics.conversionRate,
      createdBy: parseInt(deal.createdById),
      createdAt: deal.createdAt.toISOString(),
      updatedAt: deal.updatedAt.toISOString(),
    }));
  },

  getByIdLegacy: async (id: number): Promise<Deal> => {
    const deal = await dealsAPI.getById(id.toString());
    return {
      id: parseInt(deal.id),
      title: deal.title,
      description: deal.description,
      type: deal.dealType as any,
      value: deal.discountRules.value,
      minPurchase: deal.conditions?.minOrderValue || 0,
      maxDiscount: deal.discountRules.maxDiscount,
      targetType: deal.conditions?.newCustomersOnly ? 'new-customers' : 'all',
      targetValue: deal.conditions?.applicableCategories?.[0],
      startDate: deal.startDate.toISOString(),
      endDate: deal.endDate.toISOString(),
      usageLimit: deal.usageLimit || 0,
      usageCount: deal.usageCount,
      isActive: deal.isActive,
      priority: deal.priority,
      bannerImage: deal.banner?.imageUrl,
      bannerText: deal.banner?.altText,
      termsAndConditions: deal.metadata.terms,
      stackable: deal.isStackable,
      autoApply: deal.isAutoApply,
      requiredQuantity: deal.discountRules.minQuantity,
      freeQuantity: deal.discountRules.getQuantity,
      categories: deal.conditions?.applicableCategories,
      products: deal.conditions?.applicableProducts?.map(id => parseInt(id)),
      excludedProducts: deal.conditions?.excludedProducts?.map(id => parseInt(id)),
      tags: deal.metadata.tags,
      revenueGenerated: deal.analytics.revenue,
      clickCount: deal.analytics.clicks,
      conversionRate: deal.analytics.conversionRate,
      createdBy: parseInt(deal.createdById),
      createdAt: deal.createdAt.toISOString(),
      updatedAt: deal.updatedAt.toISOString(),
    };
  },

  createLegacy: async (data: CreateDealDto): Promise<Deal> => {
    const requestData: CreateDealRequest = {
      title: data.title,
      description: data.description,
      dealType: data.type as DealType,
      discountRules: {
        type: data.type as DealType,
        value: data.value,
        maxDiscount: data.maxDiscount,
        minQuantity: data.requiredQuantity,
        currency: 'USD'
      },
      conditions: {
        minOrderValue: data.minPurchase,
        newCustomersOnly: data.targetType === 'new-customers',
        applicableCategories: data.categories,
        applicableProducts: data.products?.map(id => id.toString()),
        excludedProducts: data.excludedProducts?.map(id => id.toString()),
      },
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      usageLimit: data.usageLimit,
      banner: data.bannerImage ? {
        imageUrl: data.bannerImage,
        altText: data.bannerText || '',
        clickAction: 'view_deal',
        position: 'center',
        size: 'medium'
      } : undefined,
      metadata: {
        title: data.title,
        description: data.description,
        tags: data.tags || [],
        category: 'general',
        priority: data.priority || 1,
        terms: data.termsAndConditions || ''
      }
    };

    const deal = await dealsAPI.create(requestData);
    return await dealsAPI.getByIdLegacy(parseInt(deal.id));
  },
};

export default dealsAPI;