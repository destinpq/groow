/**
 * Service Subscriptions API for B2B Marketplace
 * 
 * Handles recurring service subscriptions, billing, usage tracking,
 * and subscription lifecycle management for business services
 */

import api from './client';

// Backend Entity Integration (Type-only imports for frontend compatibility)
interface ServiceSubscriptionEntityBase {
  id: string;
  subscriptionNumber: string;
  customerId: string;
  serviceId: string;
  vendorId: string;
  planId: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired' | 'pending' | 'suspended' | 'trial';
  billingCycle: 'monthly' | 'quarterly' | 'semi_annually' | 'annually' | 'bi_annually';
  monthlyPrice: number;
  totalPrice: number;
  setupFee: number;
  discount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  nextBillingDate: Date;
  nextRenewalDate: Date;
  trialEndDate: Date;
  trialDays: number;
  autoRenew: boolean;
  paymentMethodId: string;
  billingCycleCount: number;
  totalBilled: number;
  totalPaid: number;
  serviceParameters: {
    userLimit?: number;
    storageLimit?: number;
    apiCallLimit?: number;
    features?: string[];
    customizations?: Record<string, any>;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  cancellationReason: string;
  cancelledAt: Date;
  cancelledBy: string;
  notes: string;
  metadata: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SubscriptionPlanEntityBase {
  id: string;
  serviceId: string;
  vendorId: string;
  name: string;
  description: string;
  planType: 'basic' | 'professional' | 'enterprise' | 'custom';
  billingCycle: 'monthly' | 'quarterly' | 'semi_annually' | 'annually' | 'bi_annually';
  price: number;
  originalPrice: number;
  setupFee: number;
  currency: string;
  trialDays: number;
  features: string[];
  limitations: {
    userLimit?: number;
    storageLimit?: number;
    apiCallLimit?: number;
    dataTransferLimit?: number;
    supportLevel?: 'basic' | 'priority' | 'dedicated';
    customIntegrations?: boolean;
  };
  benefits: string[];
  isPopular: boolean;
  isActive: boolean;
  availableFrom: Date;
  availableUntil: Date;
  sortOrder: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface BillingHistoryEntityBase {
  id: string;
  subscriptionId: string;
  customerId: string;
  vendorId: string;
  invoiceNumber: string;
  amount: number;
  taxes: number;
  fees: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'partially_refunded' | 'disputed';
  paymentMethod: string;
  billingDate: Date;
  paidAt: Date;
  dueDate: Date;
  transactionId: string;
  invoiceUrl: string;
  description: string;
  failureReason: string;
  paymentDetails: {
    gateway?: string;
    method?: string;
    last4?: string;
    brand?: string;
  };
  refundInfo: {
    amount?: number;
    reason?: string;
    refundedAt?: Date;
    refundId?: string;
  };
  nextRetryAt: Date;
  retryCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SubscriptionUsageEntityBase {
  id: string;
  subscriptionId: string;
  serviceId: string;
  customerId: string;
  usageMonth: string;
  activeUsers: number;
  storageUsedGB: number;
  apiCallsCount: number;
  dataTransferGB: number;
  supportTickets: number;
  featureUsage: Array<{
    feature: string;
    usageCount: number;
    usageHours?: number;
  }>;
  customMetrics: Record<string, number>;
  utilizationRate: number;
  overage: {
    users?: number;
    storage?: number;
    apiCalls?: number;
    dataTransfer?: number;
  };
  overageCharges: number;
  calculatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface SubscriptionChangeEntityBase {
  id: string;
  subscriptionId: string;
  changeType: 'plan_upgrade' | 'plan_downgrade' | 'billing_cycle_change' | 'pause' | 'resume' | 'cancel' | 'payment_update' | 'parameter_change';
  previousValues: Record<string, any>;
  newValues: Record<string, any>;
  proratedAmount: number;
  changeDate: Date;
  effectiveDate: Date;
  changedBy: string;
  changedByType: 'customer' | 'vendor' | 'admin' | 'system';
  reason: string;
  notes: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

// Standardized Response Types
export interface SubscriptionAPIResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: Date;
  errors?: string[];
  metadata?: Record<string, any>;
}

export interface PaginatedSubscriptionResponse<T> {
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
// Enhanced B2B Service Subscription Types
export interface ServiceSubscription extends Omit<ServiceSubscriptionEntityBase, 'customer' | 'service' | 'vendor' | 'plan' | 'paymentMethod' | 'billingHistory' | 'usageHistory' | 'changeHistory' | 'invoices'> {
  serviceName?: string;
  serviceCategory?: string;
  vendorName?: string;
  vendorLogo?: string;
  planName?: string;
  planType?: string;
  customerInfo?: {
    id: string;
    companyName: string;
    email: string;
    contactPerson: string;
  };
  serviceInfo?: {
    id: string;
    title: string;
    category: string;
    description: string;
    icon?: string;
  };
  vendorInfo?: {
    id: string;
    companyName: string;
    email: string;
    supportEmail?: string;
    supportPhone?: string;
  };
  planInfo?: {
    id: string;
    name: string;
    type: string;
    features: string[];
    limitations: Record<string, any>;
  };
  currentUsage?: {
    users: number;
    storage: number;
    apiCalls: number;
    utilizationRate: number;
  };
  billingInfo?: {
    nextAmount: number;
    currency: string;
    paymentMethod: string;
    daysUntilBilling: number;
  };
}

export interface SubscriptionPlan extends Omit<SubscriptionPlanEntityBase, 'service' | 'vendor' | 'subscriptions'> {
  serviceName?: string;
  serviceCategory?: string;
  vendorName?: string;
  serviceInfo?: {
    id: string;
    title: string;
    category: string;
    rating: number;
    reviewCount: number;
  };
  vendorInfo?: {
    id: string;
    companyName: string;
    rating: number;
    isVerified: boolean;
  };
  planComparison?: {
    savings: number;
    savingsPercentage: number;
    recommendedFor: string[];
  };
  analytics?: {
    subscriptionCount: number;
    avgRating: number;
    renewalRate: number;
    upgradeRate: number;
  };
}

export interface BillingHistory extends Omit<BillingHistoryEntityBase, 'subscription' | 'customer' | 'vendor'> {
  subscriptionInfo?: {
    id: string;
    subscriptionNumber: string;
    serviceName: string;
    planName: string;
  };
  customerInfo?: {
    id: string;
    companyName: string;
    email: string;
  };
  vendorInfo?: {
    id: string;
    companyName: string;
    supportEmail: string;
  };
  paymentInfo?: {
    method: string;
    last4?: string;
    brand?: string;
    gateway: string;
  };
  breakdown?: {
    subtotal: number;
    taxes: number;
    fees: number;
    discounts: number;
    total: number;
  };
}

export interface SubscriptionUsage extends Omit<SubscriptionUsageEntityBase, 'subscription' | 'service' | 'customer'> {
  subscriptionInfo?: {
    id: string;
    serviceName: string;
    planName: string;
    planLimits: Record<string, number>;
  };
  usageAnalytics?: {
    growthRate: number;
    projectedUsage: Record<string, number>;
    recommendations: string[];
    alerts: Array<{
      type: 'warning' | 'critical';
      metric: string;
      threshold: number;
      current: number;
    }>;
  };
  costAnalysis?: {
    currentCost: number;
    projectedCost: number;
    overageCost: number;
    optimizationSuggestions: string[];
  };
}

export interface SubscriptionChange extends Omit<SubscriptionChangeEntityBase, 'subscription' | 'user'> {
  subscriptionInfo?: {
    id: string;
    subscriptionNumber: string;
    serviceName: string;
  };
  changeDetails?: {
    summary: string;
    impact: string[];
    costImpact: number;
  };
  userInfo?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface SubscriptionStats {
  overview: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    trialSubscriptions: number;
    pausedSubscriptions: number;
    monthlyRecurringRevenue: number;
    annualRecurringRevenue: number;
    averageRevenuePerUser: number;
    customerLifetimeValue: number;
  };
  financial: {
    thisMonth: {
      revenue: number;
      newSubscriptions: number;
      cancellations: number;
      upgrades: number;
      downgrades: number;
    };
    projections: {
      nextMonthRevenue: number;
      quarterRevenue: number;
      annualRevenue: number;
      churnRate: number;
    };
    breakdown: {
      byServiceCategory: Array<{ category: string; revenue: number; count: number }>;
      byPlanType: Array<{ planType: string; revenue: number; count: number }>;
      byBillingCycle: Array<{ cycle: string; revenue: number; count: number }>;
    };
  };
  usage: {
    totalUsers: number;
    totalStorageGB: number;
    totalApiCalls: number;
    avgUtilizationRate: number;
    overageCharges: number;
  };
  trends: {
    subscriptionGrowth: Array<{ month: string; count: number; revenue: number }>;
    churnAnalysis: Array<{ month: string; churnRate: number; reason: string }>;
    planPopularity: Array<{ planName: string; popularity: number; trend: 'up' | 'down' | 'stable' }>;
  };
}

// Request/Response DTOs
export interface CreateServiceSubscriptionData {
  serviceId: string;
  planId: string;
  billingCycle?: 'monthly' | 'quarterly' | 'semi_annually' | 'annually' | 'bi_annually';
  paymentMethodId: string;
  serviceParameters?: {
    userLimit?: number;
    features?: string[];
    customizations?: Record<string, any>;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  startDate?: string;
  autoRenew?: boolean;
  promoCode?: string;
}

export interface UpdateServiceSubscriptionData {
  planId?: string;
  billingCycle?: 'monthly' | 'quarterly' | 'semi_annually' | 'annually' | 'bi_annually';
  serviceParameters?: {
    userLimit?: number;
    features?: string[];
    customizations?: Record<string, any>;
  };
  autoRenew?: boolean;
  paymentMethodId?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface SubscriptionFilters {
  status?: string[];
  serviceCategory?: string[];
  vendorId?: string[];
  planType?: string[];
  billingCycle?: string[];
  priceMin?: number;
  priceMax?: number;
  startDateFrom?: string;
  startDateTo?: string;
  nextBillingFrom?: string;
  nextBillingTo?: string;
  hasTrialAccess?: boolean;
  autoRenew?: boolean;
  utilizationMin?: number;
  utilizationMax?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UsageFilters {
  subscriptionId?: string;
  serviceId?: string;
  monthFrom?: string;
  monthTo?: string;
  utilizationMin?: number;
  utilizationMax?: number;
  hasOverage?: boolean;
}

export interface BillingFilters {
  subscriptionId?: string;
  status?: string[];
  paymentMethod?: string[];
  amountMin?: number;
  amountMax?: number;
  billingDateFrom?: string;
  billingDateTo?: string;
  vendorId?: string;
  page?: number;
  limit?: number;
}

// Comprehensive Service Subscriptions API for B2B Marketplace
export const serviceSubscriptionsAPI = {
  // Core Subscription Management
  subscriptions: {
    // Get all service subscriptions with advanced filtering
    getAll: async (filters?: SubscriptionFilters): Promise<PaginatedSubscriptionResponse<ServiceSubscription>> => {
      const response = await api.get<PaginatedSubscriptionResponse<ServiceSubscription>>('/subscriptions/services', {
        params: filters,
      });
      return response.data;
    },

    // Get subscription by ID with full details
    getById: async (id: string, includeDetails?: {
      includeUsage?: boolean;
      includeBilling?: boolean;
      includeChanges?: boolean;
      includeAnalytics?: boolean;
    }): Promise<SubscriptionAPIResponse<ServiceSubscription>> => {
      const response = await api.get<SubscriptionAPIResponse<ServiceSubscription>>(`/subscriptions/services/${id}`, {
        params: includeDetails,
      });
      return response.data;
    },

    // Create new service subscription
    create: async (data: CreateServiceSubscriptionData): Promise<SubscriptionAPIResponse<ServiceSubscription>> => {
      const response = await api.post<SubscriptionAPIResponse<ServiceSubscription>>('/subscriptions/services', data);
      return response.data;
    },

    // Update subscription
    update: async (id: string, data: UpdateServiceSubscriptionData): Promise<SubscriptionAPIResponse<ServiceSubscription>> => {
      const response = await api.put<SubscriptionAPIResponse<ServiceSubscription>>(`/subscriptions/services/${id}`, data);
      return response.data;
    },

    // Pause subscription
    pause: async (id: string, data: {
      reason?: string;
      pauseUntil?: string;
      notifyVendor?: boolean;
    }): Promise<SubscriptionAPIResponse<ServiceSubscription>> => {
      const response = await api.post<SubscriptionAPIResponse<ServiceSubscription>>(`/subscriptions/services/${id}/pause`, data);
      return response.data;
    },

    // Resume subscription
    resume: async (id: string): Promise<SubscriptionAPIResponse<ServiceSubscription>> => {
      const response = await api.post<SubscriptionAPIResponse<ServiceSubscription>>(`/subscriptions/services/${id}/resume`);
      return response.data;
    },

    // Cancel subscription
    cancel: async (id: string, data: {
      reason: string;
      effectiveDate?: string;
      refundRequested?: boolean;
      feedback?: string;
    }): Promise<SubscriptionAPIResponse<ServiceSubscription>> => {
      const response = await api.post<SubscriptionAPIResponse<ServiceSubscription>>(`/subscriptions/services/${id}/cancel`, data);
      return response.data;
    },

    // Upgrade/downgrade plan
    changePlan: async (id: string, data: {
      newPlanId: string;
      effectiveDate?: string;
      prorateBilling?: boolean;
    }): Promise<SubscriptionAPIResponse<{
      subscription: ServiceSubscription;
      prorationDetails: {
        creditAmount: number;
        chargeAmount: number;
        netAmount: number;
        effectiveDate: Date;
      };
    }>> => {
      const response = await api.post<SubscriptionAPIResponse<any>>(`/subscriptions/services/${id}/change-plan`, data);
      return response.data;
    },

    // Change billing cycle
    changeBillingCycle: async (id: string, data: {
      newBillingCycle: 'monthly' | 'quarterly' | 'semi_annually' | 'annually' | 'bi_annually';
      effectiveDate?: string;
    }): Promise<SubscriptionAPIResponse<ServiceSubscription>> => {
      const response = await api.post<SubscriptionAPIResponse<ServiceSubscription>>(`/subscriptions/services/${id}/change-billing-cycle`, data);
      return response.data;
    },

    // Update service parameters
    updateParameters: async (id: string, data: {
      userLimit?: number;
      features?: string[];
      customizations?: Record<string, any>;
    }): Promise<SubscriptionAPIResponse<ServiceSubscription>> => {
      const response = await api.put<SubscriptionAPIResponse<ServiceSubscription>>(`/subscriptions/services/${id}/parameters`, data);
      return response.data;
    },

    // Get subscription analytics
    getAnalytics: async (id: string, filters?: {
      dateFrom?: string;
      dateTo?: string;
      metrics?: string[];
    }): Promise<SubscriptionAPIResponse<{
      usage: {
        current: Record<string, number>;
        historical: Array<{ date: string; metrics: Record<string, number> }>;
        trends: Record<string, 'up' | 'down' | 'stable'>;
        projections: Record<string, number>;
      };
      financial: {
        totalCost: number;
        monthlyCost: number;
        costPerUser: number;
        savingsVsOneTime: number;
        roiMetrics: Record<string, number>;
      };
      performance: {
        uptimePercentage: number;
        responseTime: number;
        supportTickets: number;
        userSatisfaction: number;
      };
      recommendations: Array<{
        type: 'optimization' | 'upgrade' | 'downgrade' | 'feature';
        title: string;
        description: string;
        impact: string;
        potentialSavings?: number;
      }>;
    }>> => {
      const response = await api.get<SubscriptionAPIResponse<any>>(`/subscriptions/services/${id}/analytics`, {
        params: filters,
      });
      return response.data;
    },
  },

  // Subscription Plans Management
  plans: {
    // Get available plans for a service
    getByService: async (serviceId: string, filters?: {
      planType?: string[];
      billingCycle?: string[];
      priceMin?: number;
      priceMax?: number;
    }): Promise<SubscriptionAPIResponse<SubscriptionPlan[]>> => {
      const response = await api.get<SubscriptionAPIResponse<SubscriptionPlan[]>>(`/services/${serviceId}/subscription-plans`, {
        params: filters,
      });
      return response.data;
    },

    // Get plan by ID with detailed info
    getById: async (planId: string): Promise<SubscriptionAPIResponse<SubscriptionPlan>> => {
      const response = await api.get<SubscriptionAPIResponse<SubscriptionPlan>>(`/subscription-plans/${planId}`);
      return response.data;
    },

    // Compare multiple plans
    compare: async (planIds: string[]): Promise<SubscriptionAPIResponse<{
      plans: Array<SubscriptionPlan & {
        comparisonMetrics: {
          valueScore: number;
          featureCount: number;
          pricePerFeature: number;
          popularityRank: number;
        };
      }>;
      comparison: {
        featureMatrix: Record<string, Record<string, boolean>>;
        priceComparison: Record<string, number>;
        recommendations: Array<{
          planId: string;
          reason: string;
          bestFor: string[];
        }>;
      };
    }>> => {
      const response = await api.post<SubscriptionAPIResponse<any>>('/subscription-plans/compare', {
        planIds,
      });
      return response.data;
    },

    // Get plan recommendations
    getRecommendations: async (data: {
      serviceId: string;
      currentUsage?: Record<string, number>;
      budget?: number;
      requirements?: string[];
      companySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
    }): Promise<SubscriptionAPIResponse<Array<{
      plan: SubscriptionPlan;
      matchScore: number;
      reasons: string[];
      estimatedSavings?: number;
      roi: number;
    }>>> => {
      const response = await api.post<SubscriptionAPIResponse<any>>('/subscription-plans/recommendations', data);
      return response.data;
    },
  },

  // Billing & Invoicing
  billing: {
    // Get billing history
    getHistory: async (filters?: BillingFilters): Promise<PaginatedSubscriptionResponse<BillingHistory>> => {
      const response = await api.get<PaginatedSubscriptionResponse<BillingHistory>>('/subscriptions/billing/history', {
        params: filters,
      });
      return response.data;
    },

    // Get upcoming bills
    getUpcoming: async (filters?: {
      subscriptionId?: string;
      daysAhead?: number;
    }): Promise<SubscriptionAPIResponse<Array<{
      subscriptionId: string;
      subscriptionNumber: string;
      serviceName: string;
      amount: number;
      dueDate: Date;
      paymentMethod: string;
      isAutoRenew: boolean;
    }>>> => {
      const response = await api.get<SubscriptionAPIResponse<any>>('/subscriptions/billing/upcoming', {
        params: filters,
      });
      return response.data;
    },

    // Download invoice
    downloadInvoice: async (invoiceId: string): Promise<Blob> => {
      const response = await api.get(`/subscriptions/billing/invoices/${invoiceId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    },

    // Get billing summary
    getSummary: async (filters?: {
      dateFrom?: string;
      dateTo?: string;
      groupBy?: 'month' | 'quarter' | 'year';
    }): Promise<SubscriptionAPIResponse<{
      summary: {
        totalAmount: number;
        paidAmount: number;
        pendingAmount: number;
        overdueAmount: number;
        refundedAmount: number;
      };
      breakdown: {
        byService: Array<{ serviceName: string; amount: number; count: number }>;
        byVendor: Array<{ vendorName: string; amount: number; count: number }>;
        byStatus: Array<{ status: string; amount: number; count: number }>;
      };
      trends: Array<{ period: string; amount: number; count: number }>;
    }>> => {
      const response = await api.get<SubscriptionAPIResponse<any>>('/subscriptions/billing/summary', {
        params: filters,
      });
      return response.data;
    },

    // Update payment method for subscription
    updatePaymentMethod: async (subscriptionId: string, paymentMethodId: string): Promise<SubscriptionAPIResponse<ServiceSubscription>> => {
      const response = await api.put<SubscriptionAPIResponse<ServiceSubscription>>(`/subscriptions/services/${subscriptionId}/payment-method`, {
        paymentMethodId,
      });
      return response.data;
    },

    // Retry failed payment
    retryPayment: async (billingId: string): Promise<SubscriptionAPIResponse<BillingHistory>> => {
      const response = await api.post<SubscriptionAPIResponse<BillingHistory>>(`/subscriptions/billing/${billingId}/retry`);
      return response.data;
    },

    // Request refund
    requestRefund: async (billingId: string, data: {
      reason: string;
      amount?: number;
      description?: string;
    }): Promise<SubscriptionAPIResponse<{
      refundRequest: {
        id: string;
        status: 'pending' | 'approved' | 'rejected';
        amount: number;
        reason: string;
        submittedAt: Date;
      };
    }>> => {
      const response = await api.post<SubscriptionAPIResponse<any>>(`/subscriptions/billing/${billingId}/refund`, data);
      return response.data;
    },
  },

  // Usage Monitoring
  usage: {
    // Get current usage for subscription
    getCurrent: async (subscriptionId: string): Promise<SubscriptionAPIResponse<SubscriptionUsage>> => {
      const response = await api.get<SubscriptionAPIResponse<SubscriptionUsage>>(`/subscriptions/services/${subscriptionId}/usage/current`);
      return response.data;
    },

    // Get usage history
    getHistory: async (filters?: UsageFilters): Promise<PaginatedSubscriptionResponse<SubscriptionUsage>> => {
      const response = await api.get<PaginatedSubscriptionResponse<SubscriptionUsage>>('/subscriptions/usage/history', {
        params: filters,
      });
      return response.data;
    },

    // Get usage analytics
    getAnalytics: async (subscriptionId: string, filters?: {
      period?: 'week' | 'month' | 'quarter' | 'year';
      metrics?: string[];
    }): Promise<SubscriptionAPIResponse<{
      overview: {
        currentUtilization: number;
        avgUtilization: number;
        peakUtilization: number;
        growthRate: number;
      };
      trends: Array<{ date: string; utilization: number; cost: number }>;
      forecasting: {
        predictedUsage: Record<string, number>;
        recommendedPlan?: string;
        costOptimization: Array<{
          suggestion: string;
          potentialSavings: number;
          impact: 'low' | 'medium' | 'high';
        }>;
      };
      alerts: Array<{
        type: 'approaching_limit' | 'exceeded_limit' | 'anomaly';
        metric: string;
        threshold: number;
        current: number;
        severity: 'low' | 'medium' | 'high';
        recommendation: string;
      }>;
    }>> => {
      const response = await api.get<SubscriptionAPIResponse<any>>(`/subscriptions/services/${subscriptionId}/usage/analytics`, {
        params: filters,
      });
      return response.data;
    },

    // Set usage alerts
    setAlerts: async (subscriptionId: string, alerts: Array<{
      metric: string;
      threshold: number;
      type: 'warning' | 'critical';
      notificationMethod: 'email' | 'sms' | 'webhook';
    }>): Promise<SubscriptionAPIResponse<{ success: boolean; alertsCreated: number }>> => {
      const response = await api.post<SubscriptionAPIResponse<any>>(`/subscriptions/services/${subscriptionId}/usage/alerts`, {
        alerts,
      });
      return response.data;
    },
  },

  // Dashboard & Statistics
  dashboard: {
    // Get subscription dashboard overview
    getOverview: async (): Promise<SubscriptionAPIResponse<{
      summary: {
        totalSubscriptions: number;
        activeSubscriptions: number;
        trialSubscriptions: number;
        monthlySpend: number;
        annualSpend: number;
        potentialSavings: number;
      };
      recentActivity: Array<{
        type: 'created' | 'upgraded' | 'downgraded' | 'cancelled' | 'renewed';
        subscriptionId: string;
        serviceName: string;
        timestamp: Date;
        amount?: number;
      }>;
      upcomingRenewals: Array<{
        subscriptionId: string;
        serviceName: string;
        renewalDate: Date;
        amount: number;
        autoRenew: boolean;
      }>;
      alerts: Array<{
        type: 'payment_failed' | 'usage_limit' | 'trial_expiring' | 'renewal_due';
        subscriptionId: string;
        serviceName: string;
        message: string;
        severity: 'low' | 'medium' | 'high';
        actionRequired: boolean;
      }>;
    }>> => {
      const response = await api.get<SubscriptionAPIResponse<any>>('/subscriptions/dashboard/overview');
      return response.data;
    },

    // Get detailed statistics
    getStats: async (filters?: {
      dateFrom?: string;
      dateTo?: string;
      groupBy?: 'service' | 'vendor' | 'plan';
    }): Promise<SubscriptionAPIResponse<SubscriptionStats>> => {
      const response = await api.get<SubscriptionAPIResponse<SubscriptionStats>>('/subscriptions/dashboard/stats', {
        params: filters,
      });
      return response.data;
    },

    // Get cost optimization insights
    getCostOptimization: async (): Promise<SubscriptionAPIResponse<{
      insights: Array<{
        type: 'underutilized' | 'overprovisioned' | 'duplicate' | 'upgrade_opportunity';
        subscriptionId: string;
        serviceName: string;
        description: string;
        potentialSavings: number;
        confidence: number;
        actionItems: string[];
      }>;
      summary: {
        totalPotentialSavings: number;
        quickWins: number;
        longTermSavings: number;
        optimizationScore: number;
      };
      recommendations: Array<{
        priority: 'high' | 'medium' | 'low';
        action: string;
        impact: number;
        effort: 'low' | 'medium' | 'high';
      }>;
    }>> => {
      const response = await api.get<SubscriptionAPIResponse<any>>('/subscriptions/dashboard/optimization');
      return response.data;
    },
  },

  // Reports & Analytics
  reports: {
    // Generate comprehensive subscription report
    generate: async (data: {
      type: 'usage' | 'billing' | 'performance' | 'cost_analysis';
      format: 'pdf' | 'excel' | 'csv';
      dateFrom: string;
      dateTo: string;
      subscriptions?: string[];
      includeCharts?: boolean;
      filters?: SubscriptionFilters;
    }): Promise<SubscriptionAPIResponse<{
      reportUrl: string;
      downloadUrl: string;
      expiresAt: Date;
      reportSize: number;
    }>> => {
      const response = await api.post<SubscriptionAPIResponse<any>>('/subscriptions/reports/generate', data);
      return response.data;
    },

    // Export subscription data
    exportSubscriptions: async (filters?: SubscriptionFilters): Promise<Blob> => {
      const response = await api.get('/subscriptions/export', {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    },

    // Export usage data
    exportUsage: async (filters?: UsageFilters): Promise<Blob> => {
      const response = await api.get('/subscriptions/usage/export', {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    },

    // Export billing data
    exportBilling: async (filters?: BillingFilters): Promise<Blob> => {
      const response = await api.get('/subscriptions/billing/export', {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    },
  },

  // Trial Management
  trials: {
    // Get trial subscriptions
    getAll: async (): Promise<SubscriptionAPIResponse<Array<ServiceSubscription & {
      trialInfo: {
        daysRemaining: number;
        usagePercentage: number;
        conversionProbability: number;
      };
    }>>> => {
      const response = await api.get<SubscriptionAPIResponse<any>>('/subscriptions/trials');
      return response.data;
    },

    // Convert trial to paid subscription
    convert: async (subscriptionId: string, data: {
      planId: string;
      paymentMethodId: string;
      billingCycle?: string;
    }): Promise<SubscriptionAPIResponse<ServiceSubscription>> => {
      const response = await api.post<SubscriptionAPIResponse<ServiceSubscription>>(`/subscriptions/trials/${subscriptionId}/convert`, data);
      return response.data;
    },

    // Extend trial period
    extend: async (subscriptionId: string, additionalDays: number): Promise<SubscriptionAPIResponse<ServiceSubscription>> => {
      const response = await api.post<SubscriptionAPIResponse<ServiceSubscription>>(`/subscriptions/trials/${subscriptionId}/extend`, {
        additionalDays,
      });
      return response.data;
    },
  },
};

// Legacy API for backward compatibility
export const subscriptionsAPI = serviceSubscriptionsAPI.subscriptions;

export default serviceSubscriptionsAPI;
