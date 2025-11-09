import apiClient from './client';

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
  getAll: async (filters?: PromotionFilters) => {
    const response = await apiClient.get('/promotions', { params: filters });
    return response.data;
  },

  // Get promotion by ID
  getById: async (id: number) => {
    const response = await apiClient.get(`/promotions/${id}`);
    return response.data;
  },

  // Create new promotion
  create: async (data: CreatePromotionDto) => {
    const response = await apiClient.post('/promotions', data);
    return response.data;
  },

  // Update promotion
  update: async (id: number, data: UpdatePromotionDto) => {
    const response = await apiClient.put(`/promotions/${id}`, data);
    return response.data;
  },

  // Delete promotion
  delete: async (id: number) => {
    const response = await apiClient.delete(`/promotions/${id}`);
    return response.data;
  },

  // Get promotion statistics
  getStats: async () => {
    const response = await apiClient.get<PromotionStats>('/promotions/stats');
    return response.data;
  },

  // Get promotion analytics
  getAnalytics: async (id: number, startDate?: string, endDate?: string) => {
    const response = await apiClient.get<PromotionAnalytics>(`/promotions/${id}/analytics`, {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Launch promotion
  launch: async (id: number) => {
    const response = await apiClient.patch(`/promotions/${id}/launch`);
    return response.data;
  },

  // Pause promotion
  pause: async (id: number) => {
    const response = await apiClient.patch(`/promotions/${id}/pause`);
    return response.data;
  },

  // Resume promotion
  resume: async (id: number) => {
    const response = await apiClient.patch(`/promotions/${id}/resume`);
    return response.data;
  },

  // Cancel promotion
  cancel: async (id: number, reason?: string) => {
    const response = await apiClient.patch(`/promotions/${id}/cancel`, { reason });
    return response.data;
  },

  // Complete promotion
  complete: async (id: number) => {
    const response = await apiClient.patch(`/promotions/${id}/complete`);
    return response.data;
  },

  // Duplicate promotion
  duplicate: async (id: number, name?: string) => {
    const response = await apiClient.post(`/promotions/${id}/duplicate`, { name });
    return response.data;
  },

  // Preview promotion
  preview: async (id: number, variantId?: string) => {
    const response = await apiClient.get(`/promotions/${id}/preview`, {
      params: { variantId },
    });
    return response.data;
  },

  // Test promotion
  sendTest: async (id: number, testEmails: string[], variantId?: string) => {
    const response = await apiClient.post(`/promotions/${id}/test`, {
      testEmails,
      variantId,
    });
    return response.data;
  },

  // Get promotion templates
  getTemplates: async (type?: string, objective?: string) => {
    const response = await apiClient.get('/promotions/templates', {
      params: { type, objective },
    });
    return response.data;
  },

  // Create promotion from template
  createFromTemplate: async (templateId: number, customizations: any) => {
    const response = await apiClient.post(`/promotions/templates/${templateId}/create`, customizations);
    return response.data;
  },

  // Get campaign calendar
  getCalendar: async (month: string, year: number) => {
    const response = await apiClient.get<CampaignCalendar[]>('/promotions/calendar', {
      params: { month, year },
    });
    return response.data;
  },

  // Get audience segments
  getAudienceSegments: async () => {
    const response = await apiClient.get('/promotions/audience-segments');
    return response.data;
  },

  // Create audience segment
  createAudienceSegment: async (data: {
    name: string;
    description: string;
    criteria: any;
  }) => {
    const response = await apiClient.post('/promotions/audience-segments', data);
    return response.data;
  },

  // Get A/B test results
  getABTestResults: async (promotionId: number) => {
    const response = await apiClient.get(`/promotions/${promotionId}/ab-test-results`);
    return response.data;
  },

  // Declare A/B test winner
  declareABTestWinner: async (promotionId: number, variantId: string) => {
    const response = await apiClient.patch(`/promotions/${promotionId}/ab-test-winner`, {
      variantId,
    });
    return response.data;
  },

  // Upload promotion assets
  uploadAssets: async (promotionId: number, files: File[], type: 'images' | 'videos') => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`${type}[${index}]`, file);
    });
    const response = await apiClient.post(`/promotions/${promotionId}/upload-assets`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Get promotion performance report
  getPerformanceReport: async (startDate: string, endDate: string, filters?: any) => {
    const response = await apiClient.get('/promotions/performance-report', {
      params: { startDate, endDate, ...filters },
    });
    return response.data;
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
  bulkDelete: async (ids: number[]) => {
    const response = await apiClient.post('/promotions/bulk-delete', { ids });
    return response.data;
  },

  bulkUpdateStatus: async (ids: number[], status: string) => {
    const response = await apiClient.post('/promotions/bulk-update-status', {
      ids,
      status,
    });
    return response.data;
  },

  // Get promotion recommendations
  getRecommendations: async (type?: string, objective?: string) => {
    const response = await apiClient.get('/promotions/recommendations', {
      params: { type, objective },
    });
    return response.data;
  },

  // Get competitor analysis
  getCompetitorAnalysis: async (industry?: string, region?: string) => {
    const response = await apiClient.get('/promotions/competitor-analysis', {
      params: { industry, region },
    });
    return response.data;
  },
};