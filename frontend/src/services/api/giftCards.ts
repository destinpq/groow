/**
 * Gift Cards API Service
 * 
 * Handles gift card management, purchases, redemptions, and balance tracking
 */

import api from './client';

// Gift Card Types
export interface GiftCard {
  id: string;
  code: string;
  balance: number;
  originalAmount: number;
  status: 'active' | 'redeemed' | 'expired' | 'pending' | 'cancelled';
  purchaseDate: string;
  expiryDate: string;
  purchasedBy: string;
  purchasedByEmail: string;
  recipientEmail?: string;
  recipientName?: string;
  personalMessage?: string;
  deliveryMethod: 'email' | 'sms' | 'print' | 'instant';
  scheduledDelivery?: string;
  isRedeemable: boolean;
  redemptions: GiftCardRedemption[];
  design?: {
    template: string;
    customImage?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GiftCardTemplate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  previewUrl: string;
  isActive: boolean;
  category: 'birthday' | 'holiday' | 'wedding' | 'graduation' | 'corporate' | 'general';
  customizable: boolean;
  allowedAmounts?: number[];
  minAmount?: number;
  maxAmount?: number;
  createdAt: string;
}

export interface GiftCardRedemption {
  id: string;
  giftCardId: string;
  orderId?: string;
  amount: number;
  redeemedBy: string;
  redeemedAt: string;
  description: string;
  remainingBalance: number;
}

export interface GiftCardPurchase {
  quantity: number;
  amount: number;
  templateId?: string;
  customDesign?: {
    customImage?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  recipientEmail?: string;
  recipientName?: string;
  senderName: string;
  personalMessage?: string;
  deliveryMethod: 'email' | 'sms' | 'print' | 'instant';
  scheduledDelivery?: string;
  recipientPhone?: string;
}

export interface GiftCardBalance {
  code: string;
  balance: number;
  originalAmount: number;
  status: string;
  expiryDate: string;
  isExpired: boolean;
  canRedeem: boolean;
  lastUsed?: string;
}

export interface GiftCardStats {
  totalSold: number;
  totalValue: number;
  totalRedeemed: number;
  totalOutstanding: number;
  activeCards: number;
  expiredCards: number;
  averageCardValue: number;
  redemptionRate: number;
  monthlyStats: Array<{
    month: string;
    sold: number;
    value: number;
    redeemed: number;
  }>;
  topTemplates: Array<{
    templateId: string;
    templateName: string;
    sales: number;
    revenue: number;
  }>;
}

export interface GiftCardFilters {
  status?: string[];
  minAmount?: number;
  maxAmount?: number;
  purchaseDateFrom?: string;
  purchaseDateTo?: string;
  expiryDateFrom?: string;
  expiryDateTo?: string;
  recipientEmail?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Gift Cards API Service
export const giftCardsAPI = {
  // Gift Card Templates
  async getTemplates(category?: string): Promise<GiftCardTemplate[]> {
    const response = await api.get('/gift-cards/templates', {
      params: { category }
    });
    return response.data;
  },

  async getTemplate(id: string): Promise<GiftCardTemplate> {
    const response = await api.get(`/gift-cards/templates/${id}`);
    return response.data;
  },

  // Gift Card Purchases
  async purchaseGiftCards(purchaseData: GiftCardPurchase): Promise<{
    giftCards: GiftCard[];
    orderId: string;
    totalAmount: number;
    paymentRequired: boolean;
    paymentUrl?: string;
  }> {
    const response = await api.post('/gift-cards/purchase', purchaseData);
    return response.data;
  },

  async getCustomerGiftCards(filters?: GiftCardFilters): Promise<{
    data: GiftCard[];
    total: number;
    page: number;
    limit: number;
    totalValue: number;
    activeCards: number;
  }> {
    const response = await api.get('/gift-cards/my-cards', { params: filters });
    return response.data;
  },

  async getGiftCardById(id: string): Promise<GiftCard> {
    const response = await api.get(`/gift-cards/${id}`);
    return response.data;
  },

  // Gift Card Balance & Redemption
  async checkBalance(code: string): Promise<GiftCardBalance> {
    const response = await api.get(`/gift-cards/balance/${code}`);
    return response.data;
  },

  async redeemGiftCard(data: {
    code: string;
    amount: number;
    orderId?: string;
    description?: string;
  }): Promise<{
    redemption: GiftCardRedemption;
    newBalance: number;
    success: boolean;
  }> {
    const response = await api.post('/gift-cards/redeem', data);
    return response.data;
  },

  async getRedemptionHistory(giftCardId: string): Promise<GiftCardRedemption[]> {
    const response = await api.get(`/gift-cards/${giftCardId}/redemptions`);
    return response.data;
  },

  // Gift Card Management
  async resendGiftCard(giftCardId: string, method?: 'email' | 'sms'): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.post(`/gift-cards/${giftCardId}/resend`, { method });
    return response.data;
  },

  async cancelGiftCard(giftCardId: string, reason: string): Promise<GiftCard> {
    const response = await api.patch(`/gift-cards/${giftCardId}/cancel`, { reason });
    return response.data;
  },

  async transferGiftCard(giftCardId: string, data: {
    newRecipientEmail: string;
    newRecipientName?: string;
    message?: string;
  }): Promise<GiftCard> {
    const response = await api.patch(`/gift-cards/${giftCardId}/transfer`, data);
    return response.data;
  },

  // Gift Card Validation
  async validateGiftCard(code: string): Promise<{
    valid: boolean;
    card?: GiftCardBalance;
    error?: string;
  }> {
    const response = await api.get(`/gift-cards/validate/${code}`);
    return response.data;
  },

  // Gift Card Analytics (Customer view)
  async getCustomerStats(): Promise<{
    totalPurchased: number;
    totalSpent: number;
    activeBalance: number;
    cardsOwned: number;
    cardsGifted: number;
    cardsReceived: number;
    savingsFromGiftCards: number;
    purchaseHistory: Array<{
      date: string;
      amount: number;
      count: number;
    }>;
    redemptionHistory: Array<{
      date: string;
      amount: number;
      description: string;
    }>;
  }> {
    const response = await api.get('/gift-cards/my-stats');
    return response.data;
  },

  // Gift Card Sharing & Social Features
  async shareGiftCard(giftCardId: string, method: 'email' | 'sms' | 'social', data: {
    recipientEmail?: string;
    recipientPhone?: string;
    message?: string;
    platform?: string;
  }): Promise<{
    success: boolean;
    shareUrl?: string;
  }> {
    const response = await api.post(`/gift-cards/${giftCardId}/share`, { method, ...data });
    return response.data;
  },

  // Bulk Operations
  async purchaseBulkGiftCards(data: {
    template: string;
    amounts: number[];
    recipients: Array<{
      email: string;
      name?: string;
      amount?: number;
      message?: string;
    }>;
    senderName: string;
    deliveryMethod: 'email' | 'sms';
    scheduledDelivery?: string;
  }): Promise<{
    giftCards: GiftCard[];
    totalAmount: number;
    successCount: number;
    failedCount: number;
    errors?: string[];
  }> {
    const response = await api.post('/gift-cards/bulk-purchase', data);
    return response.data;
  },

  // Gift Card Exports
  async exportGiftCards(filters?: GiftCardFilters): Promise<Blob> {
    const response = await api.get('/gift-cards/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  async exportRedemptions(giftCardId: string): Promise<Blob> {
    const response = await api.get(`/gift-cards/${giftCardId}/redemptions/export`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// For admin-level gift card management
export const giftCardsAdminAPI = {
  // Admin: Gift Card Management
  async getAllGiftCards(filters?: GiftCardFilters): Promise<{
    data: GiftCard[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get('/admin/gift-cards', { params: filters });
    return response.data;
  },

  async getGiftCardStats(): Promise<GiftCardStats> {
    const response = await api.get('/admin/gift-cards/stats');
    return response.data;
  },

  async updateGiftCard(id: string, data: Partial<GiftCard>): Promise<GiftCard> {
    const response = await api.patch(`/admin/gift-cards/${id}`, data);
    return response.data;
  },

  async extendExpiry(id: string, newExpiryDate: string): Promise<GiftCard> {
    const response = await api.patch(`/admin/gift-cards/${id}/extend-expiry`, { 
      newExpiryDate 
    });
    return response.data;
  },

  async adjustBalance(id: string, amount: number, reason: string): Promise<GiftCard> {
    const response = await api.patch(`/admin/gift-cards/${id}/adjust-balance`, { 
      amount, 
      reason 
    });
    return response.data;
  },

  // Admin: Template Management
  async createTemplate(template: Omit<GiftCardTemplate, 'id' | 'createdAt'>): Promise<GiftCardTemplate> {
    const response = await api.post('/admin/gift-cards/templates', template);
    return response.data;
  },

  async updateTemplate(id: string, template: Partial<GiftCardTemplate>): Promise<GiftCardTemplate> {
    const response = await api.patch(`/admin/gift-cards/templates/${id}`, template);
    return response.data;
  },

  async deleteTemplate(id: string): Promise<void> {
    await api.delete(`/admin/gift-cards/templates/${id}`);
  },

  // Admin: Bulk Operations
  async bulkExpire(giftCardIds: string[]): Promise<{
    expired: number;
    failed: number;
    errors?: string[];
  }> {
    const response = await api.post('/admin/gift-cards/bulk-expire', { giftCardIds });
    return response.data;
  },

  async bulkCancel(giftCardIds: string[], reason: string): Promise<{
    cancelled: number;
    failed: number;
    errors?: string[];
  }> {
    const response = await api.post('/admin/gift-cards/bulk-cancel', { 
      giftCardIds, 
      reason 
    });
    return response.data;
  },

  // Admin: Reports & Analytics
  async getDetailedAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<{
    overview: GiftCardStats;
    trends: Array<{
      date: string;
      sales: number;
      redemptions: number;
      balance: number;
    }>;
    templates: Array<{
      template: GiftCardTemplate;
      stats: {
        sales: number;
        revenue: number;
        redemptions: number;
      };
    }>;
    customers: Array<{
      customerId: string;
      customerEmail: string;
      totalPurchased: number;
      totalSpent: number;
      activeCards: number;
    }>;
  }> {
    const response = await api.get('/admin/gift-cards/analytics', { params });
    return response.data;
  },

  async exportAllGiftCards(filters?: GiftCardFilters): Promise<Blob> {
    const response = await api.get('/admin/gift-cards/export-all', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  async generateGiftCardReport(params: {
    type: 'sales' | 'redemptions' | 'balance' | 'expiry';
    startDate: string;
    endDate: string;
    format: 'pdf' | 'excel' | 'csv';
  }): Promise<Blob> {
    const response = await api.post('/admin/gift-cards/reports', params, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default giftCardsAPI;