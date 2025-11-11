import apiClient from './client';

// Backend POJO imports - Marketing Module  
interface PromotionDto {
  id: string;
  name: string;
  description: string;
  type: string; // banner, popup, email_campaign, sms_campaign, social_media, referral_program
  status: string; // draft, scheduled, active, paused, completed, cancelled
  campaign: {
    objective: string; // brand_awareness, traffic, conversions, retention
    budget?: number;
    targetAudience: string[]; // customer_segments
    channels: string[]; // email, sms, social, in-app, website
    frequency: string; // one_time, daily, weekly, monthly
  };
  content?: {
    title: string;
    message: string;
    imageUrl?: string;
    videoUrl?: string;
    ctaText?: string;
    ctaUrl?: string;
    emailTemplate?: string;
    smsTemplate?: string;
  };
  scheduling?: {
    startDate: string;
    endDate: string;
    timezone: string;
    sendTimes?: string[];
    frequency?: string;
    recurring?: boolean;
  };
  targeting?: {
    customerSegments: string[];
    demographics: {
      ageRange?: { min: number; max: number };
      gender?: string;
      location?: string[];
    };
    behavioral: {
      purchaseHistory?: string[];
      categoryInterests?: string[];
      lastActivityDays?: number;
      avgOrderValue?: { min: number; max: number };
    };
    customFilters?: Record<string, any>;
  };
  rules?: {
    displayRules?: {
      maxImpressionsPerUser?: number;
      cooldownPeriod?: number;
      deviceTypes?: string[];
      browserTypes?: string[];
    };
    eligibilityRules?: {
      minOrderValue?: number;
      excludedCustomers?: string[];
      requiredActions?: string[];
    };
  };
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    reach: number;
    engagement: number;
    ctr: number;
    conversionRate: number;
    costPerClick?: number;
    costPerConversion?: number;
    roi?: number;
  };
  performance: {
    emailsSent?: number;
    emailsOpened?: number;
    emailsClicked?: number;
    smsDelivered?: number;
    smsClicked?: number;
    socialShares?: number;
    socialLikes?: number;
    websiteVisits?: number;
    appInstalls?: number;
  };
  associatedDeals?: string[];
  associatedCoupons?: string[];
  budget?: number;
  spent: number;
  revenueGenerated: number;
  abTesting?: {
    enabled: boolean;
    variants?: {
      name: string;
      content: any;
      traffic: number;
      performance: any;
    }[];
    winner?: string;
  };
  createdById: string;
  tags?: string[];
  notes?: string;
  launchedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Response wrappers
interface PromotionsAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedPromotionsResponse<T> {
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

// Request types
export interface CreatePromotionRequest {
  name: string;
  description: string;
  type: string;
  campaign: {
    objective: string;
    budget?: number;
    targetAudience: string[];
    channels: string[];
    frequency: string;
  };
  content?: {
    title: string;
    message: string;
    imageUrl?: string;
    videoUrl?: string;
    ctaText?: string;
    ctaUrl?: string;
    emailTemplate?: string;
    smsTemplate?: string;
  };
  scheduling?: {
    startDate: string;
    endDate: string;
    timezone: string;
    sendTimes?: string[];
    frequency?: string;
    recurring?: boolean;
  };
  targeting?: {
    customerSegments: string[];
    demographics: {
      ageRange?: { min: number; max: number };
      gender?: string;
      location?: string[];
    };
    behavioral: {
      purchaseHistory?: string[];
      categoryInterests?: string[];
      lastActivityDays?: number;
      avgOrderValue?: { min: number; max: number };
    };
    customFilters?: Record<string, any>;
  };
  rules?: {
    displayRules?: {
      maxImpressionsPerUser?: number;
      cooldownPeriod?: number;
      deviceTypes?: string[];
      browserTypes?: string[];
    };
    eligibilityRules?: {
      minOrderValue?: number;
      excludedCustomers?: string[];
      requiredActions?: string[];
    };
  };
  associatedDeals?: string[];
  associatedCoupons?: string[];
  budget?: number;
  abTesting?: {
    enabled: boolean;
    variants?: {
      name: string;
      content: any;
      traffic: number;
    }[];
  };
  tags?: string[];
  notes?: string;
}

export interface UpdatePromotionRequest extends Partial<CreatePromotionRequest> {
  status?: string;
}

export interface GetPromotionsResponse {
  promotions: PromotionDto[];
  total: number;
  page: number;
  totalPages: number;
}

// Legacy interfaces for backward compatibility
export interface Promotion {
  id: number;
  name: string;
  description: string;
  type: 'email' | 'banner' | 'popup' | 'social' | 'sms' | 'push';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  objective: 'awareness' | 'conversion' | 'retention' | 'engagement' | 'acquisition';
  targetAudience: 'all' | 'new-customers' | 'returning' | 'vip' | 'segment';
  audienceSegment?: string;
  startDate: string;
  endDate: string;
  budget: number;
  spentBudget: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  roi: number;
  ctr: number; // Click-through rate
  conversionRate: number;
  cpc: number; // Cost per click
  cpa: number; // Cost per acquisition
  content: {
    title: string;
    subtitle?: string;
    bodyText: string;
    ctaText: string;
    ctaUrl: string;
    images?: string[];
    videos?: string[];
  };
  channels: string[];
  scheduling: {
    timezone: string;
    frequency: 'once' | 'daily' | 'weekly' | 'monthly';
    specificDates?: string[];
    weekdays?: number[];
    timeOfDay?: string;
  };
  abTesting: {
    enabled: boolean;
    variants?: Array<{
      id: string;
      name: string;
      traffic: number;
      content: any;
      metrics: {
        impressions: number;
        clicks: number;
        conversions: number;
        revenue: number;
      };
    }>;
    winnerVariant?: string;
  };
  tags: string[];
  associatedDeals?: number[];
  associatedCoupons?: number[];
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionDto {
  name: string;
  description: string;
  type: 'email' | 'banner' | 'popup' | 'social' | 'sms' | 'push';
  objective: 'awareness' | 'conversion' | 'retention' | 'engagement' | 'acquisition';
  targetAudience: 'all' | 'new-customers' | 'returning' | 'vip' | 'segment';
  audienceSegment?: string;
  startDate: string;
  endDate: string;
  budget: number;
  content: {
    title: string;
    subtitle?: string;
    bodyText: string;
    ctaText: string;
    ctaUrl: string;
    images?: string[];
    videos?: string[];
  };
  channels: string[];
  scheduling: {
    timezone: string;
    frequency: 'once' | 'daily' | 'weekly' | 'monthly';
    specificDates?: string[];
    weekdays?: number[];
    timeOfDay?: string;
  };
  abTesting?: {
    enabled: boolean;
    variants?: Array<{
      id: string;
      name: string;
      traffic: number;
      content: any;
    }>;
  };
  tags?: string[];
  associatedDeals?: number[];
  associatedCoupons?: number[];
}

export interface UpdatePromotionDto extends Partial<CreatePromotionDto> {
  status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
}

export interface PromotionFilters {
  type?: string;
  status?: string;
  objective?: string;
  targetAudience?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: 'name' | 'startDate' | 'endDate' | 'budget' | 'roi' | 'conversions';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PromotionStats {
  total: number;
  active: number;
  draft: number;
  paused: number;
  completed: number;
  cancelled: number;
  totalBudget: number;
  spentBudget: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  avgROI: number;
  avgCTR: number;
  avgConversionRate: number;
  topPerformingType: string;
  topPerformingObjective: string;
}

export interface PromotionAnalytics {
  promotionId: number;
  name: string;
  dailyMetrics: Array<{
    date: string;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    spend: number;
    ctr: number;
    conversionRate: number;
    roi: number;
  }>;
  channelPerformance: Array<{
    channel: string;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
    conversionRate: number;
  }>;
  audienceInsights: {
    demographics: Array<{
      segment: string;
      impressions: number;
      engagement: number;
      conversions: number;
    }>;
    topLocations: Array<{
      location: string;
      impressions: number;
      conversions: number;
    }>;
  };
  abTestResults?: {
    variants: Array<{
      id: string;
      name: string;
      traffic: number;
      impressions: number;
      clicks: number;
      conversions: number;
      revenue: number;
      ctr: number;
      conversionRate: number;
      roi: number;
      confidence: number;
    }>;
    winner?: string;
    recommendation: string;
  };
}

export interface PromotionTemplate {
  id: number;
  name: string;
  description: string;
  type: string;
  objective: string;
  content: any;
  previewImage?: string;
  usageCount: number;
  rating: number;
  tags: string[];
}

export interface CampaignCalendar {
  date: string;
  promotions: Array<{
    id: number;
    name: string;
    type: string;
    status: string;
    startTime: string;
    endTime: string;
    budget: number;
  }>;
}

export const promotionsAPI = {
  // Get all promotions with filters
  getAll: async (filters?: PromotionFilters): Promise<GetPromotionsResponse> => {
    const response = await apiClient.get<PaginatedPromotionsResponse<PromotionDto>>('/promotions', { params: filters });
    return {
      promotions: response.data.data.items,
      total: response.data.data.total,
      page: response.data.data.page,
      totalPages: response.data.data.totalPages
    };
  },

  // Get promotion by ID
  getById: async (id: number): Promise<PromotionDto> => {
    const response = await apiClient.get<PromotionsAPIResponse<PromotionDto>>(`/promotions/${id}`);
    return response.data.data;
  },

  // Create new promotion
  create: async (data: CreatePromotionRequest): Promise<PromotionDto> => {
    const response = await apiClient.post<PromotionsAPIResponse<PromotionDto>>('/promotions', data);
    return response.data.data;
  },

  // Update promotion
  update: async (id: number, data: UpdatePromotionRequest): Promise<PromotionDto> => {
    const response = await apiClient.put<PromotionsAPIResponse<PromotionDto>>(`/promotions/${id}`, data);
    return response.data.data;
  },

  // Delete promotion
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/promotions/${id}`);
  },

  // Get promotion statistics
  getStats: async (): Promise<PromotionStats> => {
    const response = await apiClient.get<PromotionsAPIResponse<PromotionStats>>('/promotions/stats');
    return response.data.data;
  },

  // Get promotion analytics
  getAnalytics: async (id: number, startDate?: string, endDate?: string): Promise<PromotionAnalytics> => {
    const response = await apiClient.get<PromotionsAPIResponse<PromotionAnalytics>>(`/promotions/${id}/analytics`, {
      params: { startDate, endDate },
    });
    return response.data.data;
  },

  // Launch promotion
  launch: async (id: number): Promise<PromotionDto> => {
    const response = await apiClient.patch<PromotionsAPIResponse<PromotionDto>>(`/promotions/${id}/launch`);
    return response.data.data;
  },

  // Pause promotion
  pause: async (id: number): Promise<PromotionDto> => {
    const response = await apiClient.patch<PromotionsAPIResponse<PromotionDto>>(`/promotions/${id}/pause`);
    return response.data.data;
  },

  // Resume promotion
  resume: async (id: number): Promise<PromotionDto> => {
    const response = await apiClient.patch<PromotionsAPIResponse<PromotionDto>>(`/promotions/${id}/resume`);
    return response.data.data;
  },

  // Cancel promotion
  cancel: async (id: number, reason?: string): Promise<PromotionDto> => {
    const response = await apiClient.patch<PromotionsAPIResponse<PromotionDto>>(`/promotions/${id}/cancel`, { reason });
    return response.data.data;
  },

  // Complete promotion
  complete: async (id: number): Promise<PromotionDto> => {
    const response = await apiClient.patch<PromotionsAPIResponse<PromotionDto>>(`/promotions/${id}/complete`);
    return response.data.data;
  },

  // Duplicate promotion
  duplicate: async (id: number, name?: string): Promise<PromotionDto> => {
    const response = await apiClient.post<PromotionsAPIResponse<PromotionDto>>(`/promotions/${id}/duplicate`, { name });
    return response.data.data;
  },

  // Preview promotion
  preview: async (id: number, variantId?: string): Promise<any> => {
    const response = await apiClient.get<PromotionsAPIResponse<any>>(`/promotions/${id}/preview`, {
      params: { variantId },
    });
    return response.data.data;
  },

  // Test promotion
  sendTest: async (id: number, testEmails: string[], variantId?: string): Promise<any> => {
    const response = await apiClient.post<PromotionsAPIResponse<any>>(`/promotions/${id}/test`, {
      testEmails,
      variantId,
    });
    return response.data.data;
  },

  // Get promotion templates
  getTemplates: async (type?: string, objective?: string): Promise<PromotionTemplate[]> => {
    const response = await apiClient.get<PromotionsAPIResponse<PromotionTemplate[]>>('/promotions/templates', {
      params: { type, objective },
    });
    return response.data.data;
  },

  // Create promotion from template
  createFromTemplate: async (templateId: number, customizations: any): Promise<PromotionDto> => {
    const response = await apiClient.post<PromotionsAPIResponse<PromotionDto>>(`/promotions/templates/${templateId}/create`, customizations);
    return response.data.data;
  },

  // Get campaign calendar
  getCalendar: async (month: string, year: number): Promise<CampaignCalendar[]> => {
    const response = await apiClient.get<PromotionsAPIResponse<CampaignCalendar[]>>('/promotions/calendar', {
      params: { month, year },
    });
    return response.data.data;
  },

  // Get audience segments
  getAudienceSegments: async (): Promise<any[]> => {
    const response = await apiClient.get<PromotionsAPIResponse<any[]>>('/promotions/audience-segments');
    return response.data.data;
  },

  // Create audience segment
  createAudienceSegment: async (data: {
    name: string;
    description: string;
    criteria: any;
  }): Promise<any> => {
    const response = await apiClient.post<PromotionsAPIResponse<any>>('/promotions/audience-segments', data);
    return response.data.data;
  },

  // Get A/B test results
  getABTestResults: async (promotionId: number): Promise<any> => {
    const response = await apiClient.get<PromotionsAPIResponse<any>>(`/promotions/${promotionId}/ab-test-results`);
    return response.data.data;
  },

  // Declare A/B test winner
  declareABTestWinner: async (promotionId: number, variantId: string): Promise<any> => {
    const response = await apiClient.patch<PromotionsAPIResponse<any>>(`/promotions/${promotionId}/ab-test-winner`, {
      variantId,
    });
    return response.data.data;
  },

  // Upload promotion assets
  uploadAssets: async (promotionId: number, files: File[], type: 'images' | 'videos'): Promise<any> => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`${type}[${index}]`, file);
    });
    const response = await apiClient.post<PromotionsAPIResponse<any>>(`/promotions/${promotionId}/upload-assets`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  // Get promotion performance report
  getPerformanceReport: async (startDate: string, endDate: string, filters?: any): Promise<any> => {
    const response = await apiClient.get<PromotionsAPIResponse<any>>('/promotions/performance-report', {
      params: { startDate, endDate, ...filters },
    });
    return response.data.data;
  },

  // Export promotion data
  exportData: async (promotionId: number, format: 'csv' | 'xlsx' | 'pdf') => {
    const response = await apiClient.get(`/promotions/${promotionId}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  // Bulk operations
  bulkDelete: async (ids: number[]): Promise<any> => {
    const response = await apiClient.post<PromotionsAPIResponse<any>>('/promotions/bulk-delete', { ids });
    return response.data.data;
  },

  bulkUpdateStatus: async (ids: number[], status: string): Promise<any> => {
    const response = await apiClient.post<PromotionsAPIResponse<any>>('/promotions/bulk-update-status', {
      ids,
      status,
    });
    return response.data.data;
  },

  // Get promotion recommendations
  getRecommendations: async (type?: string, objective?: string): Promise<any> => {
    const response = await apiClient.get<PromotionsAPIResponse<any>>('/promotions/recommendations', {
      params: { type, objective },
    });
    return response.data.data;
  },

  // Get competitor analysis
  getCompetitorAnalysis: async (industry?: string, region?: string): Promise<any> => {
    const response = await apiClient.get<PromotionsAPIResponse<any>>('/promotions/competitor-analysis', {
      params: { industry, region },
    });
    return response.data.data;
  },
};