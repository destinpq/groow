import request from '@/utils/request';

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productImage?: string;
  planId: string;
  planName: string;
  planType: 'monthly' | 'quarterly' | 'yearly';
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  quantity: number;
  pricePerUnit: number;
  price: number;
  discount: number;
  status: 'active' | 'paused' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  nextDelivery: string;
  nextBillingDate?: string;
  endDate?: string;
  autoRenew: boolean;
  paymentMethod: string;
  billingCycle: number;
  totalBilled: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  productId: string;
  name: string;
  description: string;
  type: 'monthly' | 'quarterly' | 'yearly';
  price: number;
  originalPrice?: number;
  discount?: number;
  features: string[];
  benefits: string[];
  isPopular?: boolean;
  trialDays?: number;
}

export interface BillingHistory {
  id: string;
  subscriptionId: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  billingDate: string;
  invoiceUrl?: string;
  description: string;
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  pausedSubscriptions: number;
  active: number; // Alias for activeSubscriptions
  monthlyCost: number;
  monthlySpending: number;
  totalSpent: number;
  totalSavings: number;
  upcomingRenewals: number;
}

export interface CreateSubscriptionRequest {
  productId: string;
  planId: string;
  paymentMethodId: string;
  autoRenew?: boolean;
}

export interface UpdateSubscriptionRequest {
  autoRenew?: boolean;
  paymentMethodId?: string;
  status?: 'active' | 'paused' | 'cancelled';
  frequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  quantity?: number;
  nextDelivery?: string;
}

export interface SubscriptionFilters {
  status?: string;
  type?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Subscription API
export const subscriptionsAPI = {
  // Get all subscriptions for current user
  getSubscriptions: async (filters?: SubscriptionFilters): Promise<Subscription[]> => {
    return request('/api/subscriptions', {
      method: 'GET',
      params: filters,
    });
  },

  // Get subscription by ID
  getSubscription: async (id: string): Promise<Subscription> => {
    return request(`/api/subscriptions/${id}`, {
      method: 'GET',
    });
  },

  // Create new subscription
  createSubscription: async (data: CreateSubscriptionRequest): Promise<Subscription> => {
    return request('/api/subscriptions', {
      method: 'POST',
      data,
    });
  },

  // Update subscription
  updateSubscription: async (id: string, data: UpdateSubscriptionRequest): Promise<Subscription> => {
    return request(`/api/subscriptions/${id}`, {
      method: 'PUT',
      data,
    });
  },

  // Pause subscription
  pauseSubscription: async (id: string): Promise<Subscription> => {
    return request(`/api/subscriptions/${id}/pause`, {
      method: 'POST',
    });
  },

  // Resume subscription
  resumeSubscription: async (id: string): Promise<Subscription> => {
    return request(`/api/subscriptions/${id}/resume`, {
      method: 'POST',
    });
  },

  // Cancel subscription
  cancelSubscription: async (id: string, reason?: string): Promise<Subscription> => {
    return request(`/api/subscriptions/${id}/cancel`, {
      method: 'POST',
      data: { reason },
    });
  },

  // Get available plans for a product
  getProductPlans: async (productId: string): Promise<SubscriptionPlan[]> => {
    return request(`/api/products/${productId}/subscription-plans`, {
      method: 'GET',
    });
  },

  // Get billing history
  getBillingHistory: async (subscriptionId: string): Promise<BillingHistory[]> => {
    return request(`/api/subscriptions/${subscriptionId}/billing-history`, {
      method: 'GET',
    });
  },

  // Get subscription statistics
  getStats: async (): Promise<SubscriptionStats> => {
    return request('/api/subscriptions/stats', {
      method: 'GET',
    });
  },

  // Download invoice
  downloadInvoice: async (billingId: string): Promise<Blob> => {
    return request(`/api/billing/${billingId}/invoice`, {
      method: 'GET',
      responseType: 'blob',
    });
  },

  // Update payment method
  updatePaymentMethod: async (subscriptionId: string, paymentMethodId: string): Promise<Subscription> => {
    return request(`/api/subscriptions/${subscriptionId}/payment-method`, {
      method: 'PUT',
      data: { paymentMethodId },
    });
  },

  // Get upcoming renewals
  getUpcomingRenewals: async (): Promise<Subscription[]> => {
    return request('/api/subscriptions/upcoming-renewals', {
      method: 'GET',
    });
  },
};

export default subscriptionsAPI;
