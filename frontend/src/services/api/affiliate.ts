/**
 * Affiliate & Referral API Service
 * 
 * Handles affiliate marketing, referral programs, and commission tracking
 */

import api from './client';

// Affiliate & Referral Types
export interface AffiliateProgram {
  id: string;
  name: string;
  description: string;
  commissionType: 'percentage' | 'fixed' | 'tiered';
  commissionRate: number;
  commissionTiers?: Array<{
    minSales: number;
    rate: number;
  }>;
  cookieDuration: number; // days
  minPayoutAmount: number;
  status: 'active' | 'inactive' | 'suspended';
  terms: string;
  createdAt: string;
  updatedAt: string;
}

export interface AffiliateAccount {
  id: string;
  userId: string;
  userName: string;
  email: string;
  affiliateCode: string;
  programId: string;
  programName: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  joinDate: string;
  approvalDate?: string;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  totalReferrals: number;
  successfulReferrals: number;
  conversionRate: number;
  lastActivity: string;
  paymentMethod?: {
    type: 'bank' | 'paypal' | 'crypto';
    details: Record<string, any>;
  };
}

export interface ReferralLink {
  id: string;
  affiliateId: string;
  originalUrl: string;
  referralUrl: string;
  shortCode: string;
  title?: string;
  description?: string;
  clicks: number;
  conversions: number;
  conversionRate: number;
  isActive: boolean;
  createdAt: string;
  lastClickAt?: string;
}

export interface ReferralActivity {
  id: string;
  affiliateId: string;
  linkId?: string;
  type: 'click' | 'signup' | 'purchase' | 'commission_earned' | 'commission_paid';
  customerEmail?: string;
  orderId?: string;
  orderValue?: number;
  commissionAmount?: number;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Commission {
  id: string;
  affiliateId: string;
  orderId: string;
  customerEmail: string;
  orderValue: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  type: 'sale' | 'lead' | 'subscription' | 'recurring';
  processedAt?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
}

export interface PayoutRequest {
  id: string;
  affiliateId: string;
  amount: number;
  method: 'bank' | 'paypal' | 'crypto';
  details: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
  transactionId?: string;
  notes?: string;
}

export interface AffiliateStats {
  totalAffiliates: number;
  activeAffiliates: number;
  pendingApplications: number;
  totalCommissionsPaid: number;
  pendingCommissions: number;
  totalReferrals: number;
  conversionRate: number;
  topPerformers: Array<{
    affiliateId: string;
    userName: string;
    earnings: number;
    referrals: number;
    conversionRate: number;
  }>;
  recentActivity: ReferralActivity[];
  monthlyStats: Array<{
    month: string;
    affiliates: number;
    commissions: number;
    payouts: number;
  }>;
}

export interface AffiliateFilters {
  programId?: string;
  status?: string[];
  minEarnings?: number;
  maxEarnings?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateAffiliateData {
  programId: string;
  terms?: boolean;
  promotionMethods?: string[];
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  expectedMonthlyReferrals?: number;
  notes?: string;
}

export interface CreateReferralLinkData {
  originalUrl: string;
  title?: string;
  description?: string;
  customCode?: string;
}

// Affiliate API Service
export const affiliateAPI = {
  // Affiliate Programs
  async getPrograms(): Promise<AffiliateProgram[]> {
    const response = await api.get('/affiliate/programs');
    return response.data;
  },

  async getProgramById(id: string): Promise<AffiliateProgram> {
    const response = await api.get(`/affiliate/programs/${id}`);
    return response.data;
  },

  // Affiliate Account Management
  async getMyAffiliateAccount(): Promise<AffiliateAccount> {
    const response = await api.get('/affiliate/my-account');
    return response.data;
  },

  async applyForProgram(data: CreateAffiliateData): Promise<AffiliateAccount> {
    const response = await api.post('/affiliate/apply', data);
    return response.data;
  },

  async updateAffiliateProfile(data: Partial<AffiliateAccount>): Promise<AffiliateAccount> {
    const response = await api.put('/affiliate/profile', data);
    return response.data;
  },

  // Referral Links
  async getReferralLinks(): Promise<ReferralLink[]> {
    const response = await api.get('/affiliate/links');
    return response.data;
  },

  async createReferralLink(data: CreateReferralLinkData): Promise<ReferralLink> {
    const response = await api.post('/affiliate/links', data);
    return response.data;
  },

  async updateReferralLink(id: string, data: Partial<ReferralLink>): Promise<ReferralLink> {
    const response = await api.put(`/affiliate/links/${id}`, data);
    return response.data;
  },

  async deleteReferralLink(id: string): Promise<void> {
    await api.delete(`/affiliate/links/${id}`);
  },

  async getLinkStats(id: string): Promise<{
    clicks: number;
    conversions: number;
    earnings: number;
    clickHistory: Array<{ date: string; count: number }>;
    conversionHistory: Array<{ date: string; count: number }>;
  }> {
    const response = await api.get(`/affiliate/links/${id}/stats`);
    return response.data;
  },

  // Commissions & Earnings
  async getCommissions(filters?: AffiliateFilters): Promise<{
    data: Commission[];
    total: number;
    totalEarnings: number;
    pendingEarnings: number;
    paidEarnings: number;
  }> {
    const response = await api.get('/affiliate/commissions', { params: filters });
    return response.data;
  },

  async getEarningsStats(): Promise<{
    totalEarnings: number;
    thisMonth: number;
    lastMonth: number;
    growthRate: number;
    earningsHistory: Array<{ date: string; amount: number }>;
    commissionBreakdown: Record<string, number>;
  }> {
    const response = await api.get('/affiliate/earnings/stats');
    return response.data;
  },

  // Payouts
  async getPayouts(): Promise<PayoutRequest[]> {
    const response = await api.get('/affiliate/payouts');
    return response.data;
  },

  async requestPayout(data: {
    amount: number;
    method: 'bank' | 'paypal' | 'crypto';
    details: Record<string, any>;
  }): Promise<PayoutRequest> {
    const response = await api.post('/affiliate/payouts/request', data);
    return response.data;
  },

  async cancelPayoutRequest(id: string): Promise<void> {
    await api.delete(`/affiliate/payouts/${id}`);
  },

  // Activity & Analytics
  async getActivity(filters?: AffiliateFilters): Promise<{
    data: ReferralActivity[];
    total: number;
    stats: {
      totalClicks: number;
      totalConversions: number;
      conversionRate: number;
      totalEarnings: number;
    };
  }> {
    const response = await api.get('/affiliate/activity', { params: filters });
    return response.data;
  },

  async getDashboardStats(): Promise<{
    overview: {
      totalEarnings: number;
      pendingEarnings: number;
      totalReferrals: number;
      conversionRate: number;
    };
    recentActivity: ReferralActivity[];
    topLinks: ReferralLink[];
    earningsChart: Array<{ date: string; amount: number }>;
    performanceMetrics: {
      clicks: number;
      conversions: number;
      avgOrderValue: number;
      commissionRate: number;
    };
  }> {
    const response = await api.get('/affiliate/dashboard');
    return response.data;
  },

  // Referrals Management
  async getReferrals(filters?: AffiliateFilters): Promise<{
    data: Array<{
      id: string;
      customerEmail: string;
      orderValue: number;
      commissionAmount: number;
      status: string;
      referredAt: string;
      purchasedAt?: string;
    }>;
    total: number;
    stats: {
      totalValue: number;
      totalCommissions: number;
      conversionRate: number;
    };
  }> {
    const response = await api.get('/affiliate/referrals', { params: filters });
    return response.data;
  },

  // Marketing Materials
  async getMarketingMaterials(): Promise<{
    banners: Array<{
      id: string;
      title: string;
      size: string;
      url: string;
      code: string;
    }>;
    textAds: Array<{
      id: string;
      title: string;
      content: string;
      cta: string;
    }>;
    emailTemplates: Array<{
      id: string;
      subject: string;
      content: string;
      variables: string[];
    }>;
    socialMedia: Array<{
      id: string;
      platform: string;
      content: string;
      hashtags: string[];
    }>;
  }> {
    const response = await api.get('/affiliate/marketing-materials');
    return response.data;
  },

  // Reports & Exports
  async exportCommissions(filters?: AffiliateFilters): Promise<Blob> {
    const response = await api.get('/affiliate/commissions/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  async exportActivity(filters?: AffiliateFilters): Promise<Blob> {
    const response = await api.get('/affiliate/activity/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },
};

// For admin-level affiliate management
export const affiliateAdminAPI = {
  // Admin: Affiliate Management
  async getAllAffiliates(filters?: AffiliateFilters): Promise<{
    data: AffiliateAccount[];
    total: number;
  }> {
    const response = await api.get('/admin/affiliates', { params: filters });
    return response.data;
  },

  async approveAffiliate(id: string, notes?: string): Promise<AffiliateAccount> {
    const response = await api.patch(`/admin/affiliates/${id}/approve`, { notes });
    return response.data;
  },

  async rejectAffiliate(id: string, reason: string): Promise<AffiliateAccount> {
    const response = await api.patch(`/admin/affiliates/${id}/reject`, { reason });
    return response.data;
  },

  async suspendAffiliate(id: string, reason: string): Promise<AffiliateAccount> {
    const response = await api.patch(`/admin/affiliates/${id}/suspend`, { reason });
    return response.data;
  },

  // Admin: Commission Management
  async getAllCommissions(filters?: AffiliateFilters): Promise<{
    data: Commission[];
    total: number;
    totalAmount: number;
  }> {
    const response = await api.get('/admin/affiliates/commissions', { params: filters });
    return response.data;
  },

  async approveCommission(id: string): Promise<Commission> {
    const response = await api.patch(`/admin/affiliates/commissions/${id}/approve`);
    return response.data;
  },

  async cancelCommission(id: string, reason: string): Promise<Commission> {
    const response = await api.patch(`/admin/affiliates/commissions/${id}/cancel`, { reason });
    return response.data;
  },

  // Admin: Payout Management
  async getAllPayouts(filters?: AffiliateFilters): Promise<{
    data: PayoutRequest[];
    total: number;
    totalAmount: number;
  }> {
    const response = await api.get('/admin/affiliates/payouts', { params: filters });
    return response.data;
  },

  async processPayouts(payoutIds: string[]): Promise<{ processed: number; failed: number }> {
    const response = await api.post('/admin/affiliates/payouts/process', { payoutIds });
    return response.data;
  },

  // Admin: Statistics
  async getAffiliateStats(): Promise<AffiliateStats> {
    const response = await api.get('/admin/affiliates/stats');
    return response.data;
  },

  // Admin: Program Management
  async createProgram(data: Omit<AffiliateProgram, 'id' | 'createdAt' | 'updatedAt'>): Promise<AffiliateProgram> {
    const response = await api.post('/admin/affiliates/programs', data);
    return response.data;
  },

  async updateProgram(id: string, data: Partial<AffiliateProgram>): Promise<AffiliateProgram> {
    const response = await api.put(`/admin/affiliates/programs/${id}`, data);
    return response.data;
  },

  async deleteProgram(id: string): Promise<void> {
    await api.delete(`/admin/affiliates/programs/${id}`);
  },
};

export default affiliateAPI;