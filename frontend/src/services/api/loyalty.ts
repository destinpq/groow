import { apiClient } from './client';

// API Response wrapper types
export interface LoyaltyAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedLoyaltyResponse<T> {
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

// Loyalty Program Types
export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  pointsPerDollar: number;
  welcomeBonus: number;
  referralBonus: number;
  birthdayBonus: number;
  tierThresholds: TierThreshold[];
  expirationDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  threshold: number;
  multiplier: number;
  benefits: string[];
  color: string;
  icon: string;
  description: string;
  exclusiveOffers: boolean;
  freeShipping: boolean;
  earlyAccess: boolean;
  personalShopper: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TierThreshold {
  tierId: string;
  tierName: string;
  pointsRequired: number;
  multiplier: number;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  rewardType: 'discount' | 'product' | 'shipping' | 'experience' | 'cashback';
  discountAmount?: number;
  discountType?: 'percentage' | 'fixed';
  productId?: string;
  maxRedemptions: number;
  currentRedemptions: number;
  validFrom: string;
  validTo: string;
  tierRestrictions: string[];
  status: 'active' | 'inactive' | 'expired';
  image?: string;
  terms: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerLoyalty {
  id: string;
  customerId: string;
  programId: string;
  currentPoints: number;
  lifetimePoints: number;
  pointsSpent: number;
  currentTier: string;
  tierProgress: number;
  pointsToNextTier: number;
  joinedAt: string;
  lastActivity: string;
  referralCode: string;
  referralCount: number;
  birthdayRewardClaimed: boolean;
  status: 'active' | 'inactive' | 'suspended';
}

export interface PointsTransaction {
  id: string;
  customerId: string;
  type: 'earned' | 'redeemed' | 'expired' | 'adjusted' | 'bonus';
  points: number;
  reason: string;
  orderId?: string;
  rewardId?: string;
  referenceId?: string;
  description: string;
  createdAt: string;
  expiresAt?: string;
}

export interface LoyaltyAnalytics {
  totalMembers: number;
  activeMembers: number;
  pointsIssued: number;
  pointsRedeemed: number;
  redemptionRate: number;
  averagePointsPerCustomer: number;
  tierDistribution: Record<string, number>;
  monthlySignups: number;
  customerRetention: number;
  programROI: number;
  topRewards: Array<{
    rewardId: string;
    name: string;
    redemptions: number;
    pointsSpent: number;
  }>;
  recentActivity: PointsTransaction[];
}

export interface LoyaltyRule {
  id: string;
  name: string;
  description: string;
  triggerType: 'purchase' | 'signup' | 'referral' | 'birthday' | 'review' | 'social_share' | 'anniversary';
  conditions: Record<string, any>;
  pointsAwarded: number;
  multiplier?: number;
  maxPerDay?: number;
  maxPerMonth?: number;
  tierRestrictions?: string[];
  status: 'active' | 'inactive';
  validFrom: string;
  validTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyEngagement {
  id: string;
  customerId: string;
  campaignId: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  title: string;
  message: string;
  pointsOffered?: number;
  rewardOffered?: string;
  status: 'sent' | 'opened' | 'clicked' | 'redeemed';
  sentAt: string;
  openedAt?: string;
  clickedAt?: string;
  redeemedAt?: string;
}

export interface LoyaltyCampaign {
  id: string;
  name: string;
  description: string;
  type: 'points_bonus' | 'tier_challenge' | 'referral_boost' | 'birthday_special' | 'win_back';
  targetSegment: 'all' | 'tier_specific' | 'inactive' | 'high_value' | 'new_members';
  tierTargets?: string[];
  bonusMultiplier?: number;
  bonusPoints?: number;
  specialRewards?: string[];
  startDate: string;
  endDate: string;
  maxParticipants?: number;
  currentParticipants: number;
  budget: number;
  spent: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
  performance: {
    engagement: number;
    conversions: number;
    pointsAwarded: number;
    revenue: number;
    roi: number;
  };
  createdAt: string;
  updatedAt: string;
}

// API Service Class
class LoyaltyAPI {
  // Loyalty Programs
  async getPrograms(): Promise<LoyaltyProgram[]> {
    const response = await apiClient.get<LoyaltyAPIResponse<LoyaltyProgram[]>>('/loyalty/programs');
    return response?.data?.data || response?.data;
  }

  async getProgram(id: string): Promise<LoyaltyProgram> {
    const response = await apiClient.get<LoyaltyAPIResponse<LoyaltyProgram>>(`/loyalty/programs/${id}`);
    return response?.data?.data || response?.data;
  }

  async createProgram(program: Omit<LoyaltyProgram, 'id' | 'createdAt' | 'updatedAt'>): Promise<LoyaltyProgram> {
    const response = await apiClient.post<LoyaltyAPIResponse<LoyaltyProgram>>('/loyalty/programs', program);
    return response?.data?.data || response?.data;
  }

  async updateProgram(id: string, program: Partial<LoyaltyProgram>): Promise<LoyaltyProgram> {
    const response = await apiClient.put<LoyaltyAPIResponse<LoyaltyProgram>>(`/loyalty/programs/${id}`, program);
    return response?.data?.data || response?.data;
  }

  async deleteProgram(id: string): Promise<void> {
    await apiClient.delete(`/loyalty/programs/${id}`);
  }

  async activateProgram(id: string): Promise<LoyaltyProgram> {
    const response = await apiClient.post<LoyaltyAPIResponse<LoyaltyProgram>>(`/loyalty/programs/${id}/activate`);
    return response?.data?.data || response?.data;
  }

  async deactivateProgram(id: string): Promise<LoyaltyProgram> {
    const response = await apiClient.post<LoyaltyAPIResponse<LoyaltyProgram>>(`/loyalty/programs/${id}/deactivate`);
    return response?.data?.data || response?.data;
  }

  // Loyalty Tiers
  async getTiers(programId?: string): Promise<LoyaltyTier[]> {
    const response = await apiClient.get('/loyalty/tiers', {
      params: { programId }
    });
    return response.data;
  }

  async getTier(id: string): Promise<LoyaltyTier> {
    const response = await apiClient.get(`/loyalty/tiers/${id}`);
    return response.data;
  }

  async createTier(tier: Omit<LoyaltyTier, 'id' | 'createdAt' | 'updatedAt'>): Promise<LoyaltyTier> {
    const response = await apiClient.post('/loyalty/tiers', tier);
    return response.data;
  }

  async updateTier(id: string, tier: Partial<LoyaltyTier>): Promise<LoyaltyTier> {
    const response = await apiClient.put(`/loyalty/tiers/${id}`, tier);
    return response.data;
  }

  async deleteTier(id: string): Promise<void> {
    await apiClient.delete(`/loyalty/tiers/${id}`);
  }

  async reorderTiers(tierIds: string[]): Promise<LoyaltyTier[]> {
    const response = await apiClient.post('/loyalty/tiers/reorder', { tierIds });
    return response.data;
  }

  // Loyalty Rewards
  async getRewards(params?: {
    status?: string;
    type?: string;
    tierRestrictions?: string[];
    page?: number;
    limit?: number;
  }): Promise<{
    rewards: LoyaltyReward[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<PaginatedLoyaltyResponse<LoyaltyReward>>('/loyalty/rewards', { params });
    return {
      rewards: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  }

  async getReward(id: string): Promise<LoyaltyReward> {
    const response = await apiClient.get(`/loyalty/rewards/${id}`);
    return response.data;
  }

  async createReward(reward: Omit<LoyaltyReward, 'id' | 'currentRedemptions' | 'createdAt' | 'updatedAt'>): Promise<LoyaltyReward> {
    const response = await apiClient.post('/loyalty/rewards', reward);
    return response.data;
  }

  async updateReward(id: string, reward: Partial<LoyaltyReward>): Promise<LoyaltyReward> {
    const response = await apiClient.put(`/loyalty/rewards/${id}`, reward);
    return response.data;
  }

  async deleteReward(id: string): Promise<void> {
    await apiClient.delete(`/loyalty/rewards/${id}`);
  }

  async activateReward(id: string): Promise<LoyaltyReward> {
    const response = await apiClient.post(`/loyalty/rewards/${id}/activate`);
    return response.data;
  }

  async deactivateReward(id: string): Promise<LoyaltyReward> {
    const response = await apiClient.post(`/loyalty/rewards/${id}/deactivate`);
    return response.data;
  }

  // Customer Loyalty
  async getCustomerLoyalty(params?: {
    customerId?: string;
    programId?: string;
    tier?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    customers: CustomerLoyalty[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<PaginatedLoyaltyResponse<CustomerLoyalty>>('/loyalty/customers', { params });
    return {
      customers: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  }

  async getCustomerLoyaltyById(customerId: string): Promise<CustomerLoyalty> {
    const response = await apiClient.get(`/loyalty/customers/${customerId}`);
    return response.data;
  }

  async enrollCustomer(customerId: string, programId: string): Promise<CustomerLoyalty> {
    const response = await apiClient.post('/loyalty/customers/enroll', {
      customerId,
      programId
    });
    return response.data;
  }

  async adjustPoints(customerId: string, points: number, reason: string): Promise<PointsTransaction> {
    const response = await apiClient.post(`/loyalty/customers/${customerId}/adjust-points`, {
      points,
      reason
    });
    return response.data;
  }

  async transferPoints(fromCustomerId: string, toCustomerId: string, points: number, reason: string): Promise<{
    fromTransaction: PointsTransaction;
    toTransaction: PointsTransaction;
  }> {
    const response = await apiClient.post('/loyalty/customers/transfer-points', {
      fromCustomerId,
      toCustomerId,
      points,
      reason
    });
    return response.data;
  }

  async expirePoints(customerId: string, points: number): Promise<PointsTransaction> {
    const response = await apiClient.post(`/loyalty/customers/${customerId}/expire-points`, {
      points
    });
    return response.data;
  }

  async generateReferralCode(customerId: string): Promise<{ referralCode: string }> {
    const response = await apiClient.post(`/loyalty/customers/${customerId}/referral-code`);
    return response.data;
  }

  // Points Transactions
  async getPointsTransactions(params?: {
    customerId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    transactions: PointsTransaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/loyalty/transactions', { params });
    return response.data;
  }

  async getTransaction(id: string): Promise<PointsTransaction> {
    const response = await apiClient.get(`/loyalty/transactions/${id}`);
    return response.data;
  }

  async redeemReward(customerId: string, rewardId: string): Promise<{
    transaction: PointsTransaction;
    redemptionCode?: string;
  }> {
    const response = await apiClient.post('/loyalty/redeem', {
      customerId,
      rewardId
    });
    return response.data;
  }

  // Loyalty Rules
  async getRules(programId?: string): Promise<LoyaltyRule[]> {
    const response = await apiClient.get('/loyalty/rules', {
      params: { programId }
    });
    return response.data;
  }

  async getRule(id: string): Promise<LoyaltyRule> {
    const response = await apiClient.get(`/loyalty/rules/${id}`);
    return response.data;
  }

  async createRule(rule: Omit<LoyaltyRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<LoyaltyRule> {
    const response = await apiClient.post('/loyalty/rules', rule);
    return response.data;
  }

  async updateRule(id: string, rule: Partial<LoyaltyRule>): Promise<LoyaltyRule> {
    const response = await apiClient.put(`/loyalty/rules/${id}`, rule);
    return response.data;
  }

  async deleteRule(id: string): Promise<void> {
    await apiClient.delete(`/loyalty/rules/${id}`);
  }

  async testRule(rule: LoyaltyRule, testData: any): Promise<{
    triggered: boolean;
    pointsAwarded: number;
    explanation: string;
  }> {
    const response = await apiClient.post('/loyalty/rules/test', {
      rule,
      testData
    });
    return response.data;
  }

  // Loyalty Analytics
  async getAnalytics(params?: {
    programId?: string;
    startDate?: string;
    endDate?: string;
    granularity?: 'day' | 'week' | 'month';
  }): Promise<LoyaltyAnalytics> {
    const response = await apiClient.get<LoyaltyAPIResponse<LoyaltyAnalytics>>('/loyalty/analytics', { params });
    return response?.data?.data || response?.data;
  }

  async getTierAnalytics(tierId: string, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    memberCount: number;
    averagePoints: number;
    retentionRate: number;
    upgradeRate: number;
    pointsEarned: number;
    pointsRedeemed: number;
    topActivities: Array<{
      activity: string;
      count: number;
      points: number;
    }>;
  }> {
    const response = await apiClient.get(`/loyalty/analytics/tiers/${tierId}`, { params });
    return response.data;
  }

  async getRewardAnalytics(rewardId: string, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    redemptions: number;
    pointsSpent: number;
    revenue: number;
    conversionRate: number;
    averageOrderValue: number;
    customerSegments: Record<string, number>;
    timeSeriesData: Array<{
      date: string;
      redemptions: number;
      points: number;
    }>;
  }> {
    const response = await apiClient.get(`/loyalty/analytics/rewards/${rewardId}`, { params });
    return response.data;
  }

  // Loyalty Campaigns
  async getCampaigns(params?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    campaigns: LoyaltyCampaign[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/loyalty/campaigns', { params });
    return response.data;
  }

  async getCampaign(id: string): Promise<LoyaltyCampaign> {
    const response = await apiClient.get(`/loyalty/campaigns/${id}`);
    return response.data;
  }

  async createCampaign(campaign: Omit<LoyaltyCampaign, 'id' | 'currentParticipants' | 'spent' | 'performance' | 'createdAt' | 'updatedAt'>): Promise<LoyaltyCampaign> {
    const response = await apiClient.post('/loyalty/campaigns', campaign);
    return response.data;
  }

  async updateCampaign(id: string, campaign: Partial<LoyaltyCampaign>): Promise<LoyaltyCampaign> {
    const response = await apiClient.put(`/loyalty/campaigns/${id}`, campaign);
    return response.data;
  }

  async deleteCampaign(id: string): Promise<void> {
    await apiClient.delete(`/loyalty/campaigns/${id}`);
  }

  async startCampaign(id: string): Promise<LoyaltyCampaign> {
    const response = await apiClient.post(`/loyalty/campaigns/${id}/start`);
    return response.data;
  }

  async pauseCampaign(id: string): Promise<LoyaltyCampaign> {
    const response = await apiClient.post(`/loyalty/campaigns/${id}/pause`);
    return response.data;
  }

  async completeCampaign(id: string): Promise<LoyaltyCampaign> {
    const response = await apiClient.post(`/loyalty/campaigns/${id}/complete`);
    return response.data;
  }

  // Engagement
  async getEngagements(params?: {
    customerId?: string;
    campaignId?: string;
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    engagements: LoyaltyEngagement[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/loyalty/engagements', { params });
    return response.data;
  }

  async sendEngagement(engagement: Omit<LoyaltyEngagement, 'id' | 'status' | 'sentAt' | 'openedAt' | 'clickedAt' | 'redeemedAt'>): Promise<LoyaltyEngagement> {
    const response = await apiClient.post('/loyalty/engagements', engagement);
    return response.data;
  }

  async markEngagementOpened(id: string): Promise<LoyaltyEngagement> {
    const response = await apiClient.post(`/loyalty/engagements/${id}/opened`);
    return response.data;
  }

  async markEngagementClicked(id: string): Promise<LoyaltyEngagement> {
    const response = await apiClient.post(`/loyalty/engagements/${id}/clicked`);
    return response.data;
  }

  async markEngagementRedeemed(id: string): Promise<LoyaltyEngagement> {
    const response = await apiClient.post(`/loyalty/engagements/${id}/redeemed`);
    return response.data;
  }

  // Bulk Operations
  async bulkEnrollCustomers(customerIds: string[], programId: string): Promise<{
    successful: string[];
    failed: Array<{ customerId: string; error: string }>;
  }> {
    const response = await apiClient.post('/loyalty/bulk/enroll', {
      customerIds,
      programId
    });
    return response.data;
  }

  async bulkAdjustPoints(adjustments: Array<{
    customerId: string;
    points: number;
    reason: string;
  }>): Promise<{
    successful: PointsTransaction[];
    failed: Array<{ customerId: string; error: string }>;
  }> {
    const response = await apiClient.post('/loyalty/bulk/adjust-points', {
      adjustments
    });
    return response.data;
  }

  async bulkExpirePoints(expirations: Array<{
    customerId: string;
    points: number;
  }>): Promise<{
    successful: PointsTransaction[];
    failed: Array<{ customerId: string; error: string }>;
  }> {
    const response = await apiClient.post('/loyalty/bulk/expire-points', {
      expirations
    });
    return response.data;
  }

  // Export Data
  async exportCustomers(params?: {
    programId?: string;
    tier?: string;
    status?: string;
    format?: 'csv' | 'xlsx';
  }): Promise<Blob> {
    const response = await apiClient.get('/loyalty/export/customers', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }

  async exportTransactions(params?: {
    customerId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    format?: 'csv' | 'xlsx';
  }): Promise<Blob> {
    const response = await apiClient.get('/loyalty/export/transactions', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }

  async exportRewards(params?: {
    status?: string;
    type?: string;
    format?: 'csv' | 'xlsx';
  }): Promise<Blob> {
    const response = await apiClient.get('/loyalty/export/rewards', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }
}

export const loyaltyAPI = new LoyaltyAPI();