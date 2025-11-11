/**
 * Vendor Marketing Tools API Services
 * Promotion management, discount creation, and marketing campaign APIs
 */
import { api } from './client';

export interface MarketingCampaign {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  type: 'email' | 'social' | 'display' | 'search' | 'affiliate' | 'influencer' | 'multi_channel';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  objective: 'awareness' | 'engagement' | 'conversion' | 'retention' | 'acquisition';
  budget: {
    total: number;
    spent: number;
    remaining: number;
    currency: string;
  };
  targeting: {
    demographics: {
      ageGroups: string[];
      genders: string[];
      locations: string[];
      languages: string[];
    };
    interests: string[];
    behaviors: string[];
    customAudiences: string[];
    lookalikeSources: string[];
  };
  schedule: {
    startDate: string;
    endDate?: string;
    timezone: string;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number[];
    timeOfDay?: string;
  };
  content: {
    assets: Array<{
      id: string;
      type: 'image' | 'video' | 'text' | 'carousel' | 'interactive';
      url: string;
      title?: string;
      description?: string;
      callToAction?: string;
    }>;
    copy: {
      headline: string;
      description: string;
      callToAction: string;
    };
    landingPage?: string;
  };
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number; // Click-through rate
    cpm: number; // Cost per mille
    cpc: number; // Cost per click
    roas: number; // Return on ad spend
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
  launchedAt?: string;
  completedAt?: string;
}

export interface Promotion {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  type: 'discount' | 'bogo' | 'free_shipping' | 'bundle' | 'cashback' | 'points' | 'gift_with_purchase';
  discountType?: 'percentage' | 'fixed_amount' | 'tiered';
  discountValue: number;
  minimumPurchase?: number;
  maximumDiscount?: number;
  usageLimit?: {
    total?: number;
    perCustomer?: number;
    used: number;
  };
  conditions: {
    productIds?: string[];
    categoryIds?: string[];
    brandIds?: string[];
    customerSegments?: string[];
    newCustomersOnly?: boolean;
    firstPurchaseOnly?: boolean;
    minimumQuantity?: number;
  };
  schedule: {
    startDate: string;
    endDate?: string;
    timezone: string;
  };
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'expired' | 'cancelled';
  priority: number;
  stackable: boolean;
  publiclyVisible: boolean;
  requiresCouponCode: boolean;
  couponCode?: string;
  autoApply: boolean;
  metrics: {
    views: number;
    uses: number;
    revenue: number;
    savings: number;
    conversionRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InfluencerCampaign {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  status: 'planning' | 'recruiting' | 'active' | 'review' | 'completed' | 'cancelled';
  budget: {
    total: number;
    perInfluencer: number;
    spent: number;
    currency: string;
  };
  requirements: {
    followerCountMin?: number;
    followerCountMax?: number;
    engagementRateMin?: number;
    platforms: Array<'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'facebook' | 'linkedin' | 'twitch'>;
    contentTypes: Array<'post' | 'story' | 'reel' | 'video' | 'live' | 'blog'>;
    demographics?: {
      ageGroups: string[];
      genders: string[];
      locations: string[];
    };
    niches: string[];
  };
  deliverables: Array<{
    type: 'post' | 'story' | 'video' | 'review' | 'unboxing' | 'tutorial';
    quantity: number;
    requirements: string;
    timeline: string;
  }>;
  compensation: {
    type: 'monetary' | 'product' | 'commission' | 'hybrid';
    amount?: number;
    products?: string[];
    commissionRate?: number;
  };
  guidelines: {
    contentGuidelines: string;
    hashtagRequirements: string[];
    mentionRequirements: string[];
    disclosureRequirements: string;
  };
  applications: Array<{
    influencerId: string;
    influencerName: string;
    platform: string;
    followers: number;
    engagementRate: number;
    portfolio: string[];
    proposal: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    appliedAt: string;
  }>;
  metrics: {
    reach: number;
    impressions: number;
    engagement: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  createdAt: string;
  deadline: string;
}

export interface EmailCampaign {
  id: string;
  vendorId: string;
  name: string;
  subject: string;
  preheader?: string;
  content: {
    html: string;
    text: string;
    template?: string;
    personalization: Record<string, any>;
  };
  type: 'promotional' | 'transactional' | 'newsletter' | 'welcome' | 'abandoned_cart' | 'follow_up';
  audience: {
    segmentIds: string[];
    customerIds?: string[];
    totalRecipients: number;
  };
  schedule: {
    type: 'immediate' | 'scheduled' | 'triggered';
    sendAt?: string;
    trigger?: {
      event: string;
      delay: number;
      conditions: Record<string, any>;
    };
  };
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled';
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    complained: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    unsubscribeRate: number;
  };
  abTesting?: {
    enabled: boolean;
    variants: Array<{
      name: string;
      subject?: string;
      content?: string;
      percentage: number;
      metrics: any;
    }>;
    winnerCriteria: 'open_rate' | 'click_rate' | 'conversion_rate';
  };
  createdAt: string;
  sentAt?: string;
}

export interface LoyaltyProgram {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  type: 'points' | 'tiers' | 'cashback' | 'visits' | 'spending';
  status: 'active' | 'inactive' | 'draft';
  rules: {
    earningRules: Array<{
      action: 'purchase' | 'signup' | 'referral' | 'review' | 'birthday' | 'social_share';
      points: number;
      conditions?: Record<string, any>;
    }>;
    redemptionRules: Array<{
      reward: string;
      pointsCost: number;
      minimumPoints?: number;
      expirationDays?: number;
    }>;
    tierRules?: Array<{
      name: string;
      threshold: number;
      benefits: string[];
      multiplier: number;
    }>;
  };
  settings: {
    pointsExpiry?: number;
    maximumPointsPerOrder?: number;
    minimumRedemption?: number;
    allowPartialRedemption: boolean;
    autoEnrollment: boolean;
  };
  members: {
    total: number;
    active: number;
    byTier?: Record<string, number>;
  };
  metrics: {
    pointsIssued: number;
    pointsRedeemed: number;
    averagePointBalance: number;
    redemptionRate: number;
    memberRetentionRate: number;
    averageOrderValue: number;
    lifetimeValue: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MarketingAutomation {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  type: 'welcome_series' | 'abandoned_cart' | 'post_purchase' | 're_engagement' | 'birthday' | 'custom';
  status: 'active' | 'inactive' | 'draft';
  trigger: {
    event: string;
    conditions: Record<string, any>;
    delay?: number;
  };
  workflow: Array<{
    step: number;
    type: 'email' | 'sms' | 'push' | 'wait' | 'condition' | 'action';
    config: Record<string, any>;
    delay?: number;
  }>;
  targeting: {
    segmentIds: string[];
    excludeSegmentIds?: string[];
    conditions?: Record<string, any>;
  };
  metrics: {
    triggered: number;
    completed: number;
    dropped: number;
    conversions: number;
    revenue: number;
    completionRate: number;
    conversionRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReferralProgram {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  rewards: {
    referrer: {
      type: 'fixed' | 'percentage' | 'points' | 'product';
      value: number;
      conditions?: Record<string, any>;
    };
    referee: {
      type: 'fixed' | 'percentage' | 'points' | 'product';
      value: number;
      conditions?: Record<string, any>;
    };
  };
  settings: {
    minimumPurchase?: number;
    maximumRewards?: number;
    expirationDays?: number;
    allowSelfReferral: boolean;
    requireApproval: boolean;
  };
  metrics: {
    totalReferrals: number;
    successfulReferrals: number;
    rewardsPaid: number;
    revenue: number;
    conversionRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export const vendorMarketingToolsAPI = {
  /**
   * Get marketing campaigns
   */
  getCampaigns: async (
    page: number = 1,
    limit: number = 20,
    filters: {
      type?: MarketingCampaign['type'];
      status?: MarketingCampaign['status'];
      objective?: MarketingCampaign['objective'];
      dateRange?: { from: string; to: string };
    } = {}
  ) => {
    const { data } = await api.get('/vendor/marketing/campaigns', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Get campaign details
   */
  getCampaign: async (campaignId: string): Promise<MarketingCampaign> => {
    const { data } = await api.get(`/vendor/marketing/campaigns/${campaignId}`);
    return data;
  },

  /**
   * Create marketing campaign
   */
  createCampaign: async (campaign: {
    name: string;
    description: string;
    type: MarketingCampaign['type'];
    objective: MarketingCampaign['objective'];
    budget: { total: number; currency: string };
    targeting: MarketingCampaign['targeting'];
    schedule: MarketingCampaign['schedule'];
    content: MarketingCampaign['content'];
  }): Promise<MarketingCampaign> => {
    const { data } = await api.post('/vendor/marketing/campaigns', campaign);
    return data;
  },

  /**
   * Update marketing campaign
   */
  updateCampaign: async (
    campaignId: string,
    updates: Partial<MarketingCampaign>
  ): Promise<MarketingCampaign> => {
    const { data } = await api.put(`/vendor/marketing/campaigns/${campaignId}`, updates);
    return data;
  },

  /**
   * Launch campaign
   */
  launchCampaign: async (campaignId: string): Promise<void> => {
    await api.post(`/vendor/marketing/campaigns/${campaignId}/launch`);
  },

  /**
   * Pause/Resume campaign
   */
  toggleCampaign: async (campaignId: string, action: 'pause' | 'resume'): Promise<void> => {
    await api.post(`/vendor/marketing/campaigns/${campaignId}/${action}`);
  },

  /**
   * Delete campaign
   */
  deleteCampaign: async (campaignId: string): Promise<void> => {
    await api.delete(`/vendor/marketing/campaigns/${campaignId}`);
  },

  /**
   * Get promotions
   */
  getPromotions: async (
    page: number = 1,
    limit: number = 20,
    filters: {
      type?: Promotion['type'];
      status?: Promotion['status'];
      search?: string;
      dateRange?: { from: string; to: string };
    } = {}
  ) => {
    const { data } = await api.get('/vendor/marketing/promotions', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Get promotion details
   */
  getPromotion: async (promotionId: string): Promise<Promotion> => {
    const { data } = await api.get(`/vendor/marketing/promotions/${promotionId}`);
    return data;
  },

  /**
   * Create promotion
   */
  createPromotion: async (promotion: {
    name: string;
    description: string;
    type: Promotion['type'];
    discountType?: Promotion['discountType'];
    discountValue: number;
    minimumPurchase?: number;
    usageLimit?: Promotion['usageLimit'];
    conditions: Promotion['conditions'];
    schedule: Promotion['schedule'];
    requiresCouponCode?: boolean;
    couponCode?: string;
  }): Promise<Promotion> => {
    const { data } = await api.post('/vendor/marketing/promotions', promotion);
    return data;
  },

  /**
   * Update promotion
   */
  updatePromotion: async (
    promotionId: string,
    updates: Partial<Promotion>
  ): Promise<Promotion> => {
    const { data } = await api.put(`/vendor/marketing/promotions/${promotionId}`, updates);
    return data;
  },

  /**
   * Activate/Deactivate promotion
   */
  togglePromotion: async (promotionId: string, active: boolean): Promise<void> => {
    await api.post(`/vendor/marketing/promotions/${promotionId}/toggle`, { active });
  },

  /**
   * Delete promotion
   */
  deletePromotion: async (promotionId: string): Promise<void> => {
    await api.delete(`/vendor/marketing/promotions/${promotionId}`);
  },

  /**
   * Generate coupon codes
   */
  generateCouponCodes: async (
    promotionId: string,
    count: number,
    prefix?: string
  ) => {
    const { data } = await api.post(`/vendor/marketing/promotions/${promotionId}/coupons`, {
      count,
      prefix,
    });
    return data;
  },

  /**
   * Get email campaigns
   */
  getEmailCampaigns: async (
    page: number = 1,
    limit: number = 20,
    filters: {
      type?: EmailCampaign['type'];
      status?: EmailCampaign['status'];
      search?: string;
    } = {}
  ) => {
    const { data } = await api.get('/vendor/marketing/email-campaigns', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Create email campaign
   */
  createEmailCampaign: async (campaign: {
    name: string;
    subject: string;
    preheader?: string;
    content: EmailCampaign['content'];
    type: EmailCampaign['type'];
    audience: EmailCampaign['audience'];
    schedule: EmailCampaign['schedule'];
  }): Promise<EmailCampaign> => {
    const { data } = await api.post('/vendor/marketing/email-campaigns', campaign);
    return data;
  },

  /**
   * Send email campaign
   */
  sendEmailCampaign: async (campaignId: string): Promise<void> => {
    await api.post(`/vendor/marketing/email-campaigns/${campaignId}/send`);
  },

  /**
   * Get email templates
   */
  getEmailTemplates: async () => {
    const { data } = await api.get('/vendor/marketing/email-templates');
    return data;
  },

  /**
   * Get customer segments
   */
  getCustomerSegments: async () => {
    const { data } = await api.get('/vendor/marketing/customer-segments');
    return data;
  },

  /**
   * Create customer segment
   */
  createCustomerSegment: async (segment: {
    name: string;
    description: string;
    criteria: Record<string, any>;
  }) => {
    const { data } = await api.post('/vendor/marketing/customer-segments', segment);
    return data;
  },

  /**
   * Get influencer campaigns
   */
  getInfluencerCampaigns: async (
    page: number = 1,
    limit: number = 20,
    status?: InfluencerCampaign['status']
  ) => {
    const { data } = await api.get('/vendor/marketing/influencer-campaigns', {
      params: { page, limit, status },
    });
    return data;
  },

  /**
   * Create influencer campaign
   */
  createInfluencerCampaign: async (campaign: {
    name: string;
    description: string;
    budget: InfluencerCampaign['budget'];
    requirements: InfluencerCampaign['requirements'];
    deliverables: InfluencerCampaign['deliverables'];
    compensation: InfluencerCampaign['compensation'];
    deadline: string;
  }): Promise<InfluencerCampaign> => {
    const { data } = await api.post('/vendor/marketing/influencer-campaigns', campaign);
    return data;
  },

  /**
   * Approve/Reject influencer application
   */
  reviewInfluencerApplication: async (
    campaignId: string,
    influencerId: string,
    action: 'approve' | 'reject',
    feedback?: string
  ) => {
    const { data } = await api.post(
      `/vendor/marketing/influencer-campaigns/${campaignId}/applications/${influencerId}/review`,
      { action, feedback }
    );
    return data;
  },

  /**
   * Get loyalty program
   */
  getLoyaltyProgram: async (): Promise<LoyaltyProgram | null> => {
    const { data } = await api.get('/vendor/marketing/loyalty-program');
    return data;
  },

  /**
   * Create loyalty program
   */
  createLoyaltyProgram: async (program: {
    name: string;
    description: string;
    type: LoyaltyProgram['type'];
    rules: LoyaltyProgram['rules'];
    settings: LoyaltyProgram['settings'];
  }): Promise<LoyaltyProgram> => {
    const { data } = await api.post('/vendor/marketing/loyalty-program', program);
    return data;
  },

  /**
   * Update loyalty program
   */
  updateLoyaltyProgram: async (updates: Partial<LoyaltyProgram>): Promise<LoyaltyProgram> => {
    const { data } = await api.put('/vendor/marketing/loyalty-program', updates);
    return data;
  },

  /**
   * Get marketing automations
   */
  getMarketingAutomations: async () => {
    const { data } = await api.get('/vendor/marketing/automations');
    return data;
  },

  /**
   * Create marketing automation
   */
  createMarketingAutomation: async (automation: {
    name: string;
    description: string;
    type: MarketingAutomation['type'];
    trigger: MarketingAutomation['trigger'];
    workflow: MarketingAutomation['workflow'];
    targeting: MarketingAutomation['targeting'];
  }): Promise<MarketingAutomation> => {
    const { data } = await api.post('/vendor/marketing/automations', automation);
    return data;
  },

  /**
   * Get referral program
   */
  getReferralProgram: async (): Promise<ReferralProgram | null> => {
    const { data } = await api.get('/vendor/marketing/referral-program');
    return data;
  },

  /**
   * Create referral program
   */
  createReferralProgram: async (program: {
    name: string;
    description: string;
    rewards: ReferralProgram['rewards'];
    settings: ReferralProgram['settings'];
  }): Promise<ReferralProgram> => {
    const { data } = await api.post('/vendor/marketing/referral-program', program);
    return data;
  },

  /**
   * Get marketing analytics
   */
  getMarketingAnalytics: async (
    timeRange: { from: string; to: string },
    metrics: string[] = ['campaigns', 'promotions', 'email', 'social']
  ) => {
    const { data } = await api.get('/vendor/marketing/analytics', {
      params: { ...timeRange, metrics: metrics.join(',') },
    });
    return data;
  },

  /**
   * Get campaign performance
   */
  getCampaignPerformance: async (campaignId: string) => {
    const { data } = await api.get(`/vendor/marketing/campaigns/${campaignId}/performance`);
    return data;
  },

  /**
   * Get ROI analysis
   */
  getROIAnalysis: async (timeRange: { from: string; to: string }) => {
    const { data } = await api.get('/vendor/marketing/roi-analysis', {
      params: timeRange,
    });
    return data;
  },

  /**
   * Upload marketing assets
   */
  uploadMarketingAssets: async (files: File[], campaignId?: string) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`assets[${index}]`, file);
    });
    if (campaignId) {
      formData.append('campaignId', campaignId);
    }

    const { data } = await api.post('/vendor/marketing/assets/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Get marketing assets
   */
  getMarketingAssets: async (type?: string, campaignId?: string) => {
    const { data } = await api.get('/vendor/marketing/assets', {
      params: { type, campaignId },
    });
    return data;
  },

  /**
   * Test email campaign
   */
  testEmailCampaign: async (campaignId: string, emails: string[]) => {
    const { data } = await api.post(`/vendor/marketing/email-campaigns/${campaignId}/test`, {
      emails,
    });
    return data;
  },

  /**
   * Preview email campaign
   */
  previewEmailCampaign: async (campaignId: string) => {
    const { data } = await api.get(`/vendor/marketing/email-campaigns/${campaignId}/preview`);
    return data;
  },

  /**
   * Get marketing recommendations
   */
  getMarketingRecommendations: async () => {
    const { data } = await api.get('/vendor/marketing/recommendations');
    return data;
  },

  /**
   * Export marketing data
   */
  exportMarketingData: async (
    type: 'campaigns' | 'promotions' | 'email' | 'analytics',
    format: 'csv' | 'xlsx' | 'pdf',
    filters?: Record<string, any>
  ) => {
    const { data } = await api.get('/vendor/marketing/export', {
      params: { type, format, ...filters },
      responseType: 'blob',
    });
    return data;
  },
};

export default vendorMarketingToolsAPI;