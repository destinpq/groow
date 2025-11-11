/**
 * Affiliate & Referral API Service for B2B Service Marketplace
 * 
 * Handles affiliate marketing, referral programs, and commission tracking
 * for service-based vendor marketplace
 */

import api from './client';

// Backend Entity Integration (Type-only imports for frontend compatibility)
interface AffiliateProgramEntityBase {
  id: string;
  name: string;
  description: string;
  commissionType: 'percentage' | 'fixed' | 'tiered' | 'hybrid';
  commissionRate: number;
  commissionTiers: Array<{
    minSales: number;
    rate: number;
    description?: string;
  }>;
  cookieDuration: number;
  minPayoutAmount: number;
  status: 'active' | 'inactive' | 'suspended' | 'archived';
  terms: string;
  serviceCategories: string[];
  restrictions: {
    countries?: string[];
    excludedCountries?: string[];
    minServiceValue?: number;
    maxServiceValue?: number;
    allowedPromotionMethods?: string[];
  };
  requirements: {
    minMonthlyTraffic?: number;
    requiredWebsite?: boolean;
    industryExperience?: boolean;
    socialMediaFollowing?: number;
  };
  launchDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AffiliateAccountEntityBase {
  id: string;
  userId: string;
  affiliateCode: string;
  programId: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'terminated';
  joinDate: Date;
  approvalDate: Date;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  totalReferrals: number;
  successfulReferrals: number;
  conversionRate: number;
  lastActivity: Date;
  paymentMethod: {
    type: 'bank' | 'paypal' | 'crypto' | 'wallet';
    details: Record<string, any>;
  };
  applicationData: {
    website?: string;
    socialMedia?: Record<string, string>;
    expectedMonthlyReferrals?: number;
    promotionMethods?: string[];
    industryExperience?: string;
    notes?: string;
  };
  rejectionReason: string;
  suspensionReason: string;
  performanceMetrics: {
    avgOrderValue: number;
    topServiceCategories: string[];
    bestPerformingLinks: string[];
    monthlyStats: Array<{
      month: string;
      referrals: number;
      earnings: number;
      conversionRate: number;
    }>;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ReferralLinkEntityBase {
  id: string;
  affiliateId: string;
  originalUrl: string;
  referralUrl: string;
  shortCode: string;
  title: string;
  description: string;
  clicks: number;
  conversions: number;
  conversionRate: number;
  totalEarnings: number;
  utmParameters: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  targetAudience: {
    demographics?: string[];
    interests?: string[];
    location?: string[];
  };
  isActive: boolean;
  lastClickAt: Date;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ReferralActivityEntityBase {
  id: string;
  affiliateId: string;
  linkId: string;
  type: 'click' | 'view' | 'signup' | 'service_inquiry' | 'service_purchase' | 'commission_earned' | 'commission_paid';
  customerEmail: string;
  orderId: string;
  serviceId: string;
  serviceValue: number;
  commissionAmount: number;
  ipAddress: string;
  userAgent: string;
  referrer: string;
  sessionData: {
    sessionId?: string;
    deviceType?: string;
    browser?: string;
    os?: string;
    location?: {
      country?: string;
      city?: string;
      region?: string;
    };
  };
  metadata: Record<string, any>;
  timestamp: Date;
  createdAt: Date;
}

interface CommissionEntityBase {
  id: string;
  affiliateId: string;
  programId: string;
  orderId: string;
  serviceId: string;
  customerEmail: string;
  orderValue: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled' | 'disputed';
  type: 'service_sale' | 'recurring_service' | 'service_upgrade' | 'referral_bonus' | 'milestone_bonus';
  processedAt: Date;
  paidAt: Date;
  disputedAt: Date;
  notes: string;
  cancellationReason: string;
  disputeInfo: {
    reason?: string;
    evidence?: string[];
    resolution?: string;
    resolvedAt?: Date;
  };
  holdUntil: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PayoutRequestEntityBase {
  id: string;
  affiliateId: string;
  amount: number;
  method: 'bank' | 'paypal' | 'crypto' | 'wallet' | 'check';
  paymentDetails: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  requestedAt: Date;
  processedAt: Date;
  completedAt: Date;
  transactionId: string;
  notes: string;
  failureReason: string;
  processingFee: number;
  netAmount: number;
  commissionIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Standardized Response Types
export interface AffiliateAPIResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: Date;
  errors?: string[];
  metadata?: Record<string, any>;
}

export interface PaginatedAffiliateResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: Record<string, any>;
  sorting?: {
    field: string;
    order: 'asc' | 'desc';
  };
  message: string;
  timestamp: Date;
}

// Enhanced Service Marketplace Affiliate Types
export interface AffiliateProgram extends Omit<AffiliateProgramEntityBase, 'affiliates' | 'commissions'> {
  totalAffiliates?: number;
  activeAffiliates?: number;
  totalCommissionsPaid?: number;
  avgConversionRate?: number;
  topPerformingCategories?: Array<{
    category: string;
    sales: number;
    commissions: number;
  }>;
  marketingMaterials?: {
    banners: number;
    emailTemplates: number;
    socialAssets: number;
  };
}

export interface AffiliateAccount extends Omit<AffiliateAccountEntityBase, 'user' | 'program' | 'links' | 'commissions' | 'payouts' | 'activities'> {
  userName?: string;
  email?: string;
  programName?: string;
  programInfo?: {
    id: string;
    name: string;
    commissionRate: number;
    serviceCategories: string[];
  };
  recentActivity?: Array<{
    type: string;
    description: string;
    timestamp: Date;
    amount?: number;
  }>;
  tierInfo?: {
    current: string;
    next?: string;
    progressToNext?: number;
  };
}

export interface ReferralLink extends Omit<ReferralLinkEntityBase, 'affiliate' | 'activities'> {
  serviceInfo?: {
    id: string;
    title: string;
    category: string;
    vendor: string;
  };
  performanceMetrics?: {
    ctr: number;
    avgSessionDuration: number;
    bounceRate: number;
    revenuePerClick: number;
  };
  audienceInsights?: {
    topCountries: Array<{ country: string; percentage: number }>;
    deviceBreakdown: Record<string, number>;
    trafficSources: Record<string, number>;
  };
}

export interface ReferralActivity extends Omit<ReferralActivityEntityBase, 'affiliate' | 'link' | 'order' | 'service'> {
  affiliateInfo?: {
    id: string;
    code: string;
    name: string;
  };
  linkInfo?: {
    id: string;
    title: string;
    shortCode: string;
  };
  serviceInfo?: {
    id: string;
    title: string;
    category: string;
    vendor: string;
  };
  orderInfo?: {
    id: string;
    orderNumber: string;
    totalValue: number;
  };
  geoLocation?: {
    country: string;
    city: string;
    region: string;
    timezone: string;
  };
}

export interface Commission extends Omit<CommissionEntityBase, 'affiliate' | 'program' | 'order' | 'service'> {
  affiliateInfo?: {
    id: string;
    code: string;
    name: string;
    email: string;
  };
  programInfo?: {
    id: string;
    name: string;
    type: string;
  };
  serviceInfo?: {
    id: string;
    title: string;
    category: string;
    vendor: string;
    recurring: boolean;
  };
  orderInfo?: {
    id: string;
    orderNumber: string;
    customerName: string;
    orderDate: Date;
  };
  payoutInfo?: {
    payoutId?: string;
    payoutDate?: Date;
    payoutMethod?: string;
  };
}

export interface PayoutRequest extends Omit<PayoutRequestEntityBase, 'affiliate'> {
  affiliateInfo?: {
    id: string;
    code: string;
    name: string;
    email: string;
  };
  commissionSummary?: {
    totalCommissions: number;
    serviceSales: number;
    recurringServices: number;
    bonuses: number;
  };
  processingInfo?: {
    estimatedCompletionDate?: Date;
    processingStage?: string;
    verificationRequired?: boolean;
  };
}

export interface AffiliateStats {
  overview: {
    totalAffiliates: number;
    activeAffiliates: number;
    pendingApplications: number;
    totalCommissionsPaid: number;
    pendingCommissions: number;
    totalServiceReferrals: number;
    avgConversionRate: number;
    topServiceCategories: Array<{
      category: string;
      sales: number;
      commissions: number;
    }>;
  };
  performance: {
    topPerformers: Array<{
      affiliateId: string;
      userName: string;
      earnings: number;
      serviceReferrals: number;
      conversionRate: number;
      topCategories: string[];
    }>;
    recentActivity: ReferralActivity[];
    growthMetrics: {
      monthlyGrowth: number;
      quarterlyGrowth: number;
      yearlyGrowth: number;
    };
  };
  financial: {
    monthlyStats: Array<{
      month: string;
      affiliates: number;
      commissions: number;
      payouts: number;
      servicesSold: number;
    }>;
    commissionTrends: Array<{
      category: string;
      trend: 'up' | 'down' | 'stable';
      change: number;
    }>;
  };
}

export interface AffiliateFilters {
  programId?: string;
  status?: string[];
  serviceCategories?: string[];
  minEarnings?: number;
  maxEarnings?: number;
  minConversionRate?: number;
  tierLevel?: string[];
  joinedAfter?: string;
  joinedBefore?: string;
  lastActivityAfter?: string;
  lastActivityBefore?: string;
  hasWebsite?: boolean;
  hasServiceExperience?: boolean;
  country?: string[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateAffiliateApplicationData {
  programId: string;
  applicationData: {
    website?: string;
    socialMedia?: Record<string, string>;
    expectedMonthlyReferrals?: number;
    promotionMethods?: string[];
    industryExperience?: string;
    serviceCategories?: string[];
    targetAudience?: string[];
    marketingPlan?: string;
    notes?: string;
  };
  paymentMethod?: {
    type: 'bank' | 'paypal' | 'crypto' | 'wallet';
    details: Record<string, any>;
  };
  agreeToTerms: boolean;
}

export interface CreateReferralLinkData {
  originalUrl: string;
  title?: string;
  description?: string;
  customCode?: string;
  serviceId?: string;
  targetAudience?: {
    demographics?: string[];
    interests?: string[];
    location?: string[];
  };
  utmParameters?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  expiryDate?: string;
}

export interface CreatePayoutRequestData {
  amount: number;
  method: 'bank' | 'paypal' | 'crypto' | 'wallet' | 'check';
  paymentDetails: Record<string, any>;
  commissionIds?: string[];
  notes?: string;
}

// Comprehensive Affiliate API Service for B2B Service Marketplace
export const affiliateAPI = {
  // Affiliate Programs - Service Marketplace Focused
  programs: {
    // Get all available affiliate programs
    getAll: async (): Promise<AffiliateAPIResponse<AffiliateProgram[]>> => {
      const response = await api.get<AffiliateAPIResponse<AffiliateProgram[]>>('/affiliate/programs');
      return response.data;
    },

    // Get program by ID with detailed metrics
    getById: async (id: string): Promise<AffiliateAPIResponse<AffiliateProgram>> => {
      const response = await api.get<AffiliateAPIResponse<AffiliateProgram>>(`/affiliate/programs/${id}`);
      return response.data;
    },

    // Get program performance analytics
    getAnalytics: async (programId: string, filters?: {
      dateFrom?: string;
      dateTo?: string;
      category?: string;
    }): Promise<AffiliateAPIResponse<{
      overview: {
        totalAffiliates: number;
        totalCommissions: number;
        conversionRate: number;
        avgOrderValue: number;
      };
      trends: {
        affiliateGrowth: Array<{ month: string; count: number }>;
        commissionTrends: Array<{ month: string; amount: number }>;
        categoryPerformance: Array<{ category: string; sales: number; commissions: number }>;
      };
      topPerformers: Array<{
        affiliateId: string;
        name: string;
        earnings: number;
        conversionRate: number;
      }>;
    }>> => {
      const response = await api.get<AffiliateAPIResponse<any>>(`/affiliate/programs/${programId}/analytics`, {
        params: filters,
      });
      return response.data;
    },

    // Get service categories for program
    getServiceCategories: async (programId: string): Promise<AffiliateAPIResponse<Array<{
      category: string;
      serviceCount: number;
      avgCommission: number;
      conversionRate: number;
    }>>> => {
      const response = await api.get<AffiliateAPIResponse<any>>(`/affiliate/programs/${programId}/categories`);
      return response.data;
    },
  },

  // Affiliate Account Management
  account: {
    // Get my affiliate account details
    getMy: async (): Promise<AffiliateAPIResponse<AffiliateAccount>> => {
      const response = await api.get<AffiliateAPIResponse<AffiliateAccount>>('/affiliate/my-account');
      return response.data;
    },

    // Apply for affiliate program
    apply: async (data: CreateAffiliateApplicationData): Promise<AffiliateAPIResponse<AffiliateAccount>> => {
      const response = await api.post<AffiliateAPIResponse<AffiliateAccount>>('/affiliate/apply', data);
      return response.data;
    },

    // Update affiliate profile
    updateProfile: async (data: Partial<AffiliateAccount>): Promise<AffiliateAPIResponse<AffiliateAccount>> => {
      const response = await api.put<AffiliateAPIResponse<AffiliateAccount>>('/affiliate/profile', data);
      return response.data;
    },

    // Update payment method
    updatePaymentMethod: async (paymentMethod: {
      type: 'bank' | 'paypal' | 'crypto' | 'wallet';
      details: Record<string, any>;
    }): Promise<AffiliateAPIResponse<AffiliateAccount>> => {
      const response = await api.put<AffiliateAPIResponse<AffiliateAccount>>('/affiliate/payment-method', {
        paymentMethod,
      });
      return response.data;
    },

    // Get application status
    getApplicationStatus: async (): Promise<AffiliateAPIResponse<{
      status: string;
      submittedAt: Date;
      reviewedAt?: Date;
      feedback?: string;
      nextSteps?: string[];
    }>> => {
      const response = await api.get<AffiliateAPIResponse<any>>('/affiliate/application-status');
      return response.data;
    },

    // Get performance dashboard
    getDashboard: async (): Promise<AffiliateAPIResponse<{
      overview: {
        totalEarnings: number;
        pendingEarnings: number;
        totalServiceReferrals: number;
        conversionRate: number;
        monthlyGrowth: number;
      };
      recentActivity: ReferralActivity[];
      topPerformingLinks: ReferralLink[];
      earningsChart: Array<{ date: string; amount: number; type: string }>;
      serviceCategories: Array<{ category: string; sales: number; earnings: number }>;
      upcomingPayouts: Array<{ amount: number; date: Date; method: string }>;
    }>> => {
      const response = await api.get<AffiliateAPIResponse<any>>('/affiliate/dashboard');
      return response.data;
    },
  },

  // Referral Links Management
  links: {
    // Get all referral links
    getAll: async (filters?: {
      isActive?: boolean;
      serviceId?: string;
      page?: number;
      limit?: number;
    }): Promise<PaginatedAffiliateResponse<ReferralLink>> => {
      const response = await api.get<PaginatedAffiliateResponse<ReferralLink>>('/affiliate/links', {
        params: filters,
      });
      return response.data;
    },

    // Create new referral link
    create: async (data: CreateReferralLinkData): Promise<AffiliateAPIResponse<ReferralLink>> => {
      const response = await api.post<AffiliateAPIResponse<ReferralLink>>('/affiliate/links', data);
      return response.data;
    },

    // Update referral link
    update: async (id: string, data: Partial<CreateReferralLinkData>): Promise<AffiliateAPIResponse<ReferralLink>> => {
      const response = await api.put<AffiliateAPIResponse<ReferralLink>>(`/affiliate/links/${id}`, data);
      return response.data;
    },

    // Delete referral link
    delete: async (id: string): Promise<AffiliateAPIResponse<{ success: boolean }>> => {
      const response = await api.delete<AffiliateAPIResponse<{ success: boolean }>>(`/affiliate/links/${id}`);
      return response.data;
    },

    // Get link performance statistics
    getStats: async (id: string, filters?: {
      dateFrom?: string;
      dateTo?: string;
      groupBy?: 'day' | 'week' | 'month';
    }): Promise<AffiliateAPIResponse<{
      overview: {
        totalClicks: number;
        uniqueClicks: number;
        conversions: number;
        conversionRate: number;
        earnings: number;
        avgOrderValue: number;
      };
      trends: {
        clickHistory: Array<{ date: string; clicks: number; uniqueClicks: number }>;
        conversionHistory: Array<{ date: string; conversions: number; earnings: number }>;
      };
      audience: {
        topCountries: Array<{ country: string; clicks: number; conversions: number }>;
        deviceBreakdown: Record<string, number>;
        trafficSources: Record<string, number>;
        demographics: Record<string, number>;
      };
      performance: {
        topServices: Array<{ serviceId: string; serviceName: string; conversions: number; earnings: number }>;
        peakTimes: Array<{ hour: number; clicks: number }>;
        seasonalTrends: Array<{ period: string; performance: number }>;
      };
    }>> => {
      const response = await api.get<AffiliateAPIResponse<any>>(`/affiliate/links/${id}/stats`, {
        params: filters,
      });
      return response.data;
    },

    // Get link QR code
    getQRCode: async (id: string, options?: {
      size?: number;
      format?: 'png' | 'svg';
      includeMargin?: boolean;
    }): Promise<AffiliateAPIResponse<{
      qrCodeUrl: string;
      downloadUrl: string;
    }>> => {
      const response = await api.get<AffiliateAPIResponse<any>>(`/affiliate/links/${id}/qr-code`, {
        params: options,
      });
      return response.data;
    },

    // Bulk create links for service categories
    bulkCreate: async (data: {
      serviceCategories: string[];
      linkTemplate: Partial<CreateReferralLinkData>;
    }): Promise<AffiliateAPIResponse<{
      created: ReferralLink[];
      failed: Array<{ category: string; error: string }>;
    }>> => {
      const response = await api.post<AffiliateAPIResponse<any>>('/affiliate/links/bulk-create', data);
      return response.data;
    },
  },

  // Commission & Earnings Management
  commissions: {
    // Get all commissions with advanced filtering
    getAll: async (filters?: AffiliateFilters): Promise<PaginatedAffiliateResponse<Commission>> => {
      const response = await api.get<PaginatedAffiliateResponse<Commission>>('/affiliate/commissions', {
        params: filters,
      });
      return response.data;
    },

    // Get commission by ID
    getById: async (id: string): Promise<AffiliateAPIResponse<Commission>> => {
      const response = await api.get<AffiliateAPIResponse<Commission>>(`/affiliate/commissions/${id}`);
      return response.data;
    },

    // Get earnings summary and statistics
    getEarningsStats: async (filters?: {
      dateFrom?: string;
      dateTo?: string;
      serviceCategory?: string;
      groupBy?: 'day' | 'week' | 'month' | 'quarter';
    }): Promise<AffiliateAPIResponse<{
      summary: {
        totalEarnings: number;
        pendingEarnings: number;
        paidEarnings: number;
        thisMonth: number;
        lastMonth: number;
        growthRate: number;
        avgCommissionValue: number;
      };
      breakdown: {
        byServiceCategory: Array<{ category: string; amount: number; percentage: number }>;
        byCommissionType: Array<{ type: string; amount: number; count: number }>;
        byRecurringVsOneTime: { recurring: number; oneTime: number };
      };
      trends: {
        earningsHistory: Array<{ period: string; earnings: number; commissions: number }>;
        projectedEarnings: Array<{ month: string; projected: number; confidence: number }>;
      };
      performance: {
        topServices: Array<{ serviceId: string; serviceName: string; earnings: number }>;
        topCustomers: Array<{ customerEmail: string; totalSpent: number; commissions: number }>;
      };
    }>> => {
      const response = await api.get<AffiliateAPIResponse<any>>('/affiliate/commissions/stats', {
        params: filters,
      });
      return response.data;
    },

    // Dispute a commission
    dispute: async (id: string, data: {
      reason: string;
      evidence: string[];
      description: string;
    }): Promise<AffiliateAPIResponse<Commission>> => {
      const response = await api.post<AffiliateAPIResponse<Commission>>(`/affiliate/commissions/${id}/dispute`, data);
      return response.data;
    },

    // Get commission disputes
    getDisputes: async (): Promise<AffiliateAPIResponse<Array<Commission & {
      disputeInfo: {
        status: string;
        submittedAt: Date;
        evidence: string[];
        adminResponse?: string;
        resolvedAt?: Date;
      };
    }>>> => {
      const response = await api.get<AffiliateAPIResponse<any>>('/affiliate/commissions/disputes');
      return response.data;
    },
  },

  // Payout Management
  payouts: {
    // Get all payout requests
    getAll: async (filters?: {
      status?: string;
      method?: string;
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
    }): Promise<PaginatedAffiliateResponse<PayoutRequest>> => {
      const response = await api.get<PaginatedAffiliateResponse<PayoutRequest>>('/affiliate/payouts', {
        params: filters,
      });
      return response.data;
    },

    // Request a payout
    request: async (data: CreatePayoutRequestData): Promise<AffiliateAPIResponse<PayoutRequest>> => {
      const response = await api.post<AffiliateAPIResponse<PayoutRequest>>('/affiliate/payouts/request', data);
      return response.data;
    },

    // Cancel payout request (if still pending)
    cancel: async (id: string, reason?: string): Promise<AffiliateAPIResponse<PayoutRequest>> => {
      const response = await api.delete<AffiliateAPIResponse<PayoutRequest>>(`/affiliate/payouts/${id}`, {
        data: { reason },
      });
      return response.data;
    },

    // Get payout eligibility info
    getEligibility: async (): Promise<AffiliateAPIResponse<{
      isEligible: boolean;
      availableAmount: number;
      minimumAmount: number;
      nextPayoutDate?: Date;
      pendingCommissions: number;
      holdPeriod: number;
      restrictions?: string[];
    }>> => {
      const response = await api.get<AffiliateAPIResponse<any>>('/affiliate/payouts/eligibility');
      return response.data;
    },

    // Get payout methods and fees
    getPayoutMethods: async (): Promise<AffiliateAPIResponse<Array<{
      method: string;
      name: string;
      processingTime: string;
      fees: {
        fixed?: number;
        percentage?: number;
        minimum?: number;
        maximum?: number;
      };
      requirements: string[];
      isAvailable: boolean;
    }>>> => {
      const response = await api.get<AffiliateAPIResponse<any>>('/affiliate/payouts/methods');
      return response.data;
    },

    // Estimate payout fees
    estimateFees: async (data: {
      amount: number;
      method: string;
    }): Promise<AffiliateAPIResponse<{
      grossAmount: number;
      processingFee: number;
      netAmount: number;
      estimatedProcessingTime: string;
    }>> => {
      const response = await api.post<AffiliateAPIResponse<any>>('/affiliate/payouts/estimate-fees', data);
      return response.data;
    },
  },

  // Activity & Analytics
  activity: {
    // Get referral activity history
    getHistory: async (filters?: AffiliateFilters): Promise<PaginatedAffiliateResponse<ReferralActivity>> => {
      const response = await api.get<PaginatedAffiliateResponse<ReferralActivity>>('/affiliate/activity', {
        params: filters,
      });
      return response.data;
    },

    // Get real-time activity feed
    getRealTime: async (): Promise<AffiliateAPIResponse<ReferralActivity[]>> => {
      const response = await api.get<AffiliateAPIResponse<ReferralActivity[]>>('/affiliate/activity/real-time');
      return response.data;
    },

    // Get activity analytics
    getAnalytics: async (filters?: {
      dateFrom?: string;
      dateTo?: string;
      activityType?: string[];
      groupBy?: 'hour' | 'day' | 'week' | 'month';
    }): Promise<AffiliateAPIResponse<{
      overview: {
        totalActivities: number;
        uniqueVisitors: number;
        conversionEvents: number;
        revenueEvents: number;
      };
      trends: {
        activityByType: Array<{ type: string; count: number; trend: number }>;
        hourlyPattern: Array<{ hour: number; activities: number }>;
        weeklyPattern: Array<{ day: string; activities: number }>;
      };
      performance: {
        topReferralSources: Array<{ source: string; activities: number; conversions: number }>;
        deviceBreakdown: Record<string, number>;
        geographicDistribution: Array<{ country: string; activities: number }>;
      };
    }>> => {
      const response = await api.get<AffiliateAPIResponse<any>>('/affiliate/activity/analytics', {
        params: filters,
      });
      return response.data;
    },
  },

  // Service Referrals Management
  referrals: {
    // Get service referrals with detailed info
    getAll: async (filters?: AffiliateFilters): Promise<PaginatedAffiliateResponse<{
      id: string;
      customerEmail: string;
      serviceId: string;
      serviceName: string;
      serviceCategory: string;
      vendorName: string;
      orderValue: number;
      commissionAmount: number;
      status: string;
      referredAt: Date;
      purchasedAt?: Date;
      commissionPaidAt?: Date;
    }>> => {
      const response = await api.get<PaginatedAffiliateResponse<any>>('/affiliate/referrals', {
        params: filters,
      });
      return response.data;
    },

    // Get referral conversion funnel
    getConversionFunnel: async (filters?: {
      serviceCategory?: string;
      dateFrom?: string;
      dateTo?: string;
    }): Promise<AffiliateAPIResponse<{
      funnel: Array<{
        stage: 'click' | 'view' | 'inquiry' | 'quote_request' | 'purchase';
        count: number;
        conversionRate: number;
        dropoffRate: number;
      }>;
      insights: {
        majorDropoffStage: string;
        improvementSuggestions: string[];
        benchmarkComparison: {
          yourRate: number;
          industryAverage: number;
          topPerformers: number;
        };
      };
    }>> => {
      const response = await api.get<AffiliateAPIResponse<any>>('/affiliate/referrals/conversion-funnel', {
        params: filters,
      });
      return response.data;
    },

    // Get customer journey analytics
    getCustomerJourney: async (customerEmail: string): Promise<AffiliateAPIResponse<{
      customer: {
        email: string;
        firstReferral: Date;
        totalOrders: number;
        totalValue: number;
        lifetimeCommissions: number;
      };
      journey: Array<{
        timestamp: Date;
        event: string;
        serviceId?: string;
        serviceName?: string;
        value?: number;
        commission?: number;
      }>;
      services: Array<{
        serviceId: string;
        serviceName: string;
        category: string;
        purchaseDate: Date;
        value: number;
        commission: number;
        isRecurring: boolean;
      }>;
    }>> => {
      const response = await api.get<AffiliateAPIResponse<any>>(`/affiliate/referrals/customer-journey/${encodeURIComponent(customerEmail)}`);
      return response.data;
    },
  },

  // Marketing Materials & Tools
  marketing: {
    // Get available marketing materials
    getMaterials: async (): Promise<AffiliateAPIResponse<{
      banners: Array<{
        id: string;
        title: string;
        size: string;
        format: string;
        url: string;
        downloadUrl: string;
        previewUrl: string;
        htmlCode: string;
        serviceCategory?: string;
      }>;
      textAds: Array<{
        id: string;
        title: string;
        content: string;
        cta: string;
        serviceCategory?: string;
        variables: string[];
      }>;
      emailTemplates: Array<{
        id: string;
        subject: string;
        content: string;
        previewUrl: string;
        variables: string[];
        serviceCategory?: string;
      }>;
      socialMedia: Array<{
        id: string;
        platform: string;
        content: string;
        imageUrl?: string;
        hashtags: string[];
        serviceCategory?: string;
      }>;
      landingPages: Array<{
        id: string;
        title: string;
        description: string;
        url: string;
        conversionRate: number;
        serviceCategory?: string;
      }>;
    }>> => {
      const response = await api.get<AffiliateAPIResponse<any>>('/affiliate/marketing-materials');
      return response.data;
    },

    // Generate custom marketing content
    generateContent: async (data: {
      type: 'banner' | 'text_ad' | 'email' | 'social_post';
      serviceId?: string;
      serviceCategory?: string;
      targetAudience?: string;
      tone?: 'professional' | 'casual' | 'persuasive';
      callToAction?: string;
      customization?: Record<string, any>;
    }): Promise<AffiliateAPIResponse<{
      content: string;
      suggestions: string[];
      previewUrl?: string;
      editUrl?: string;
    }>> => {
      const response = await api.post<AffiliateAPIResponse<any>>('/affiliate/marketing-materials/generate', data);
      return response.data;
    },

    // Get marketing performance insights
    getPerformanceInsights: async (materialId: string): Promise<AffiliateAPIResponse<{
      material: {
        id: string;
        type: string;
        title: string;
      };
      usage: {
        totalDownloads: number;
        activeUsage: number;
        clicks: number;
        conversions: number;
        conversionRate: number;
      };
      performance: {
        topPerformingAffiliates: Array<{ affiliateId: string; name: string; conversions: number }>;
        bestServiceCategories: Array<{ category: string; conversions: number }>;
        optimalUsagePatterns: string[];
      };
      recommendations: string[];
    }>> => {
      const response = await api.get<AffiliateAPIResponse<any>>(`/affiliate/marketing-materials/${materialId}/performance`);
      return response.data;
    },
  },

  // Reports & Analytics
  reports: {
    // Generate comprehensive affiliate report
    generate: async (data: {
      type: 'performance' | 'commission' | 'activity' | 'payout';
      format: 'pdf' | 'excel' | 'csv';
      dateFrom: string;
      dateTo: string;
      includeCharts?: boolean;
      filters?: AffiliateFilters;
    }): Promise<AffiliateAPIResponse<{
      reportUrl: string;
      downloadUrl: string;
      expiresAt: Date;
    }>> => {
      const response = await api.post<AffiliateAPIResponse<any>>('/affiliate/reports/generate', data);
      return response.data;
    },

    // Export commission data
    exportCommissions: async (filters?: AffiliateFilters): Promise<Blob> => {
      const response = await api.get('/affiliate/commissions/export', {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    },

    // Export activity data
    exportActivity: async (filters?: AffiliateFilters): Promise<Blob> => {
      const response = await api.get('/affiliate/activity/export', {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    },

    // Get benchmark comparisons
    getBenchmarks: async (): Promise<AffiliateAPIResponse<{
      industry: {
        avgConversionRate: number;
        avgCommissionRate: number;
        avgOrderValue: number;
      };
      platform: {
        topPerformerThresholds: {
          conversionRate: number;
          monthlyEarnings: number;
          referralCount: number;
        };
        yourRanking: {
          conversionRate: number;
          earnings: number;
          referrals: number;
        };
      };
      improvements: Array<{
        metric: string;
        currentValue: number;
        targetValue: number;
        suggestions: string[];
      }>;
    }>> => {
      const response = await api.get<AffiliateAPIResponse<any>>('/affiliate/reports/benchmarks');
      return response.data;
    },
  },
};

// Admin-level affiliate management for B2B Service Marketplace
export const affiliateAdminAPI = {
  // Admin: Affiliate Program Management
  programs: {
    // Get all affiliate programs with admin data
    getAll: async (): Promise<AffiliateAPIResponse<Array<AffiliateProgram & {
      adminMetrics: {
        totalAffiliates: number;
        totalCommissionsPaid: number;
        avgConversionRate: number;
        revenue: number;
        profitMargin: number;
      };
    }>>> => {
      const response = await api.get<AffiliateAPIResponse<any>>('/admin/affiliates/programs');
      return response.data;
    },

    // Create new affiliate program
    create: async (data: Omit<AffiliateProgram, 'id' | 'createdAt' | 'updatedAt'>): Promise<AffiliateAPIResponse<AffiliateProgram>> => {
      const response = await api.post<AffiliateAPIResponse<AffiliateProgram>>('/admin/affiliates/programs', data);
      return response.data;
    },

    // Update affiliate program
    update: async (id: string, data: Partial<AffiliateProgram>): Promise<AffiliateAPIResponse<AffiliateProgram>> => {
      const response = await api.put<AffiliateAPIResponse<AffiliateProgram>>(`/admin/affiliates/programs/${id}`, data);
      return response.data;
    },

    // Archive affiliate program
    archive: async (id: string): Promise<AffiliateAPIResponse<AffiliateProgram>> => {
      const response = await api.patch<AffiliateAPIResponse<AffiliateProgram>>(`/admin/affiliates/programs/${id}/archive`);
      return response.data;
    },
  },

  // Admin: Affiliate Account Management
  affiliates: {
    // Get all affiliates with advanced filtering and admin data
    getAll: async (filters?: AffiliateFilters): Promise<PaginatedAffiliateResponse<AffiliateAccount & {
      userInfo: {
        name: string;
        email: string;
        phone?: string;
        registrationDate: Date;
      };
      riskScore: number;
      flags: string[];
      adminNotes: string;
    }>> => {
      const response = await api.get<PaginatedAffiliateResponse<any>>('/admin/affiliates', {
        params: filters,
      });
      return response.data;
    },

    // Get pending affiliate applications
    getPendingApplications: async (): Promise<AffiliateAPIResponse<Array<AffiliateAccount & {
      applicationDetails: {
        submittedAt: Date;
        reviewPriority: 'low' | 'medium' | 'high';
        riskAssessment: {
          score: number;
          factors: Array<{ factor: string; impact: 'positive' | 'negative'; weight: number }>;
          recommendation: 'approve' | 'reject' | 'investigate';
        };
        verificationStatus: {
          website: boolean;
          socialMedia: boolean;
          identity: boolean;
          businessLicense: boolean;
        };
      };
    }>>> => {
      const response = await api.get<AffiliateAPIResponse<any>>('/admin/affiliates/pending');
      return response.data;
    },

    // Approve affiliate application
    approve: async (id: string, data: {
      notes?: string;
      customCommissionRate?: number;
      assignedManager?: string;
    }): Promise<AffiliateAPIResponse<AffiliateAccount>> => {
      const response = await api.patch<AffiliateAPIResponse<AffiliateAccount>>(`/admin/affiliates/${id}/approve`, data);
      return response.data;
    },

    // Reject affiliate application
    reject: async (id: string, data: {
      reason: string;
      feedback?: string;
      canReapply?: boolean;
    }): Promise<AffiliateAPIResponse<AffiliateAccount>> => {
      const response = await api.patch<AffiliateAPIResponse<AffiliateAccount>>(`/admin/affiliates/${id}/reject`, data);
      return response.data;
    },

    // Suspend affiliate account
    suspend: async (id: string, data: {
      reason: string;
      duration?: number; // days
      restrictions?: string[];
    }): Promise<AffiliateAPIResponse<AffiliateAccount>> => {
      const response = await api.patch<AffiliateAPIResponse<AffiliateAccount>>(`/admin/affiliates/${id}/suspend`, data);
      return response.data;
    },

    // Terminate affiliate account
    terminate: async (id: string, data: {
      reason: string;
      penaltyAmount?: number;
      forfeitPendingCommissions?: boolean;
    }): Promise<AffiliateAPIResponse<AffiliateAccount>> => {
      const response = await api.patch<AffiliateAPIResponse<AffiliateAccount>>(`/admin/affiliates/${id}/terminate`, data);
      return response.data;
    },

    // Update affiliate tier/status
    updateTier: async (id: string, data: {
      tierLevel: string;
      customCommissionRate?: number;
      benefits?: string[];
      effectiveDate?: Date;
    }): Promise<AffiliateAPIResponse<AffiliateAccount>> => {
      const response = await api.patch<AffiliateAPIResponse<AffiliateAccount>>(`/admin/affiliates/${id}/tier`, data);
      return response.data;
    },

    // Add admin notes
    addNotes: async (id: string, notes: string): Promise<AffiliateAPIResponse<{ success: boolean }>> => {
      const response = await api.post<AffiliateAPIResponse<{ success: boolean }>>(`/admin/affiliates/${id}/notes`, {
        notes,
      });
      return response.data;
    },
  },

  // Admin: Commission Management
  commissions: {
    // Get all commissions with admin controls
    getAll: async (filters?: AffiliateFilters): Promise<PaginatedAffiliateResponse<Commission & {
      adminInfo: {
        reviewStatus: 'pending_review' | 'approved' | 'flagged';
        reviewer?: string;
        reviewDate?: Date;
        flags?: string[];
        adjustments?: Array<{
          amount: number;
          reason: string;
          adjustedBy: string;
          adjustedAt: Date;
        }>;
      };
    }>> => {
      const response = await api.get<PaginatedAffiliateResponse<any>>('/admin/affiliates/commissions', {
        params: filters,
      });
      return response.data;
    },

    // Approve commission
    approve: async (id: string, notes?: string): Promise<AffiliateAPIResponse<Commission>> => {
      const response = await api.patch<AffiliateAPIResponse<Commission>>(`/admin/affiliates/commissions/${id}/approve`, {
        notes,
      });
      return response.data;
    },

    // Approve multiple commissions
    batchApprove: async (commissionIds: string[]): Promise<AffiliateAPIResponse<{
      approved: number;
      failed: number;
      errors: Array<{ id: string; error: string }>;
    }>> => {
      const response = await api.post<AffiliateAPIResponse<any>>('/admin/affiliates/commissions/batch-approve', {
        commissionIds,
      });
      return response.data;
    },

    // Cancel/reject commission
    cancel: async (id: string, data: {
      reason: string;
      refundCustomer?: boolean;
      penalizeAffiliate?: boolean;
    }): Promise<AffiliateAPIResponse<Commission>> => {
      const response = await api.patch<AffiliateAPIResponse<Commission>>(`/admin/affiliates/commissions/${id}/cancel`, data);
      return response.data;
    },

    // Adjust commission amount
    adjust: async (id: string, data: {
      newAmount: number;
      reason: string;
      notifyAffiliate?: boolean;
    }): Promise<AffiliateAPIResponse<Commission>> => {
      const response = await api.patch<AffiliateAPIResponse<Commission>>(`/admin/affiliates/commissions/${id}/adjust`, data);
      return response.data;
    },

    // Handle commission disputes
    resolveDispute: async (id: string, data: {
      resolution: 'approve' | 'deny' | 'adjust';
      amount?: number;
      reason: string;
      compensation?: number;
    }): Promise<AffiliateAPIResponse<Commission>> => {
      const response = await api.patch<AffiliateAPIResponse<Commission>>(`/admin/affiliates/commissions/${id}/resolve-dispute`, data);
      return response.data;
    },
  },

  // Admin: Payout Management
  payouts: {
    // Get all payout requests
    getAll: async (filters?: AffiliateFilters): Promise<PaginatedAffiliateResponse<PayoutRequest & {
      adminInfo: {
        verificationStatus: 'pending' | 'verified' | 'flagged';
        riskScore: number;
        reviewer?: string;
        processingNotes?: string;
      };
      affiliateInfo: {
        id: string;
        name: string;
        email: string;
        riskLevel: 'low' | 'medium' | 'high';
        paymentHistory: {
          totalPayouts: number;
          successfulPayouts: number;
          failedPayouts: number;
        };
      };
    }>> => {
      const response = await api.get<PaginatedAffiliateResponse<any>>('/admin/affiliates/payouts', {
        params: filters,
      });
      return response.data;
    },

    // Process payout requests
    process: async (payoutIds: string[], data?: {
      priority?: 'normal' | 'high';
      notes?: string;
    }): Promise<AffiliateAPIResponse<{
      processed: number;
      failed: number;
      errors: Array<{ id: string; error: string; retry: boolean }>;
      estimatedCompletionTime: Date;
    }>> => {
      const response = await api.post<AffiliateAPIResponse<any>>('/admin/affiliates/payouts/process', {
        payoutIds,
        ...data,
      });
      return response.data;
    },

    // Approve payout for processing
    approve: async (id: string, notes?: string): Promise<AffiliateAPIResponse<PayoutRequest>> => {
      const response = await api.patch<AffiliateAPIResponse<PayoutRequest>>(`/admin/affiliates/payouts/${id}/approve`, {
        notes,
      });
      return response.data;
    },

    // Reject payout request
    reject: async (id: string, data: {
      reason: string;
      returnCommissions?: boolean;
    }): Promise<AffiliateAPIResponse<PayoutRequest>> => {
      const response = await api.patch<AffiliateAPIResponse<PayoutRequest>>(`/admin/affiliates/payouts/${id}/reject`, data);
      return response.data;
    },

    // Mark payout as completed
    markCompleted: async (id: string, data: {
      transactionId: string;
      completedAt?: Date;
      actualAmount?: number;
      notes?: string;
    }): Promise<AffiliateAPIResponse<PayoutRequest>> => {
      const response = await api.patch<AffiliateAPIResponse<PayoutRequest>>(`/admin/affiliates/payouts/${id}/complete`, data);
      return response.data;
    },

    // Handle failed payouts
    handleFailure: async (id: string, data: {
      failureReason: string;
      retryable?: boolean;
      alternativeMethod?: string;
    }): Promise<AffiliateAPIResponse<PayoutRequest>> => {
      const response = await api.patch<AffiliateAPIResponse<PayoutRequest>>(`/admin/affiliates/payouts/${id}/fail`, data);
      return response.data;
    },
  },

  // Admin: Analytics & Reporting
  analytics: {
    // Get comprehensive affiliate system stats
    getOverview: async (filters?: {
      dateFrom?: string;
      dateTo?: string;
      programId?: string;
    }): Promise<AffiliateAPIResponse<AffiliateStats>> => {
      const response = await api.get<AffiliateAPIResponse<AffiliateStats>>('/admin/affiliates/analytics/overview', {
        params: filters,
      });
      return response.data;
    },

    // Get fraud detection insights
    getFraudInsights: async (): Promise<AffiliateAPIResponse<{
      flaggedAffiliates: Array<{
        affiliateId: string;
        name: string;
        riskScore: number;
        flags: string[];
        suspiciousActivity: Array<{
          type: string;
          description: string;
          severity: 'low' | 'medium' | 'high';
          detectedAt: Date;
        }>;
      }>;
      patterns: Array<{
        pattern: string;
        occurrences: number;
        riskLevel: 'low' | 'medium' | 'high';
        recommendation: string;
      }>;
      preventionMeasures: string[];
    }>> => {
      const response = await api.get<AffiliateAPIResponse<any>>('/admin/affiliates/analytics/fraud');
      return response.data;
    },

    // Get performance benchmarks
    getBenchmarks: async (): Promise<AffiliateAPIResponse<{
      industry: {
        avgConversionRate: number;
        avgCommissionRate: number;
        avgOrderValue: number;
        topPerformingCategories: string[];
      };
      platform: {
        totalRevenue: number;
        affiliateContribution: number;
        profitMargin: number;
        growthRate: number;
        churnRate: number;
      };
      optimization: Array<{
        metric: string;
        currentValue: number;
        benchmarkValue: number;
        improvement: number;
        suggestions: string[];
      }>;
    }>> => {
      const response = await api.get<AffiliateAPIResponse<any>>('/admin/affiliates/analytics/benchmarks');
      return response.data;
    },

    // Generate admin reports
    generateReport: async (data: {
      type: 'affiliate_performance' | 'commission_summary' | 'payout_report' | 'fraud_analysis';
      dateFrom: string;
      dateTo: string;
      format: 'pdf' | 'excel' | 'csv';
      includeGraphs?: boolean;
      filters?: AffiliateFilters;
    }): Promise<AffiliateAPIResponse<{
      reportUrl: string;
      downloadUrl: string;
      expiresAt: Date;
      reportSize: number;
    }>> => {
      const response = await api.post<AffiliateAPIResponse<any>>('/admin/affiliates/reports/generate', data);
      return response.data;
    },
  },

  // Admin: System Configuration
  configuration: {
    // Get system settings
    getSettings: async (): Promise<AffiliateAPIResponse<{
      commissionSettings: {
        defaultRate: number;
        maxRate: number;
        holdPeriod: number;
        minPayoutAmount: number;
        payoutSchedule: string;
      };
      approvalSettings: {
        autoApprovalEnabled: boolean;
        autoApprovalThreshold: number;
        requiredDocuments: string[];
        reviewTimeframe: number;
      };
      fraudDetection: {
        enabled: boolean;
        riskThreshold: number;
        autoSuspendEnabled: boolean;
        monitoringRules: string[];
      };
      notifications: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        webhookUrl?: string;
      };
    }>> => {
      const response = await api.get<AffiliateAPIResponse<any>>('/admin/affiliates/settings');
      return response.data;
    },

    // Update system settings
    updateSettings: async (settings: Record<string, any>): Promise<AffiliateAPIResponse<{ success: boolean }>> => {
      const response = await api.put<AffiliateAPIResponse<{ success: boolean }>>('/admin/affiliates/settings', settings);
      return response.data;
    },
  },
};

export default affiliateAPI;