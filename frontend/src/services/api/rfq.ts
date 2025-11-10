import api from './client';

// Backend Entity Integration (Type-only imports for frontend compatibility)
interface RFQEntityBase {
  id: string;
  rfqNumber: string;
  customerId: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  budget: number;
  deadline: Date;
  attachments: string[];
  status: 'open' | 'quoted' | 'closed' | 'cancelled';
  quotationCount: number;
  notes: string;
  specifications: Record<string, any>;
  viewedAt: Date;
  respondedAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface QuotationEntityBase {
  id: string;
  rfqId: string;
  vendorId: string;
  price: number;
  quantity: number;
  moq: number;
  deliveryTime: string;
  validUntil: Date;
  notes: string;
  attachments: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  specifications: Record<string, any>;
  terms: Record<string, any>;
  viewedAt: Date;
  respondedAt: Date;
  rejectionReason: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface RFQMessageEntityBase {
  id: string;
  rfqId: string;
  senderId: string;
  senderType: 'customer' | 'vendor' | 'admin';
  message: string;
  attachments: string[];
  isRead: boolean;
  readAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface RFQViewEntityBase {
  id: string;
  rfqId: string;
  vendorId: string;
  viewedAt: Date;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

interface QuotationRevisionEntityBase {
  id: string;
  quotationId: string;
  version: number;
  price: number;
  quantity: number;
  moq: number;
  deliveryTime: string;
  validUntil: Date;
  notes: string;
  attachments: string[];
  specifications: Record<string, any>;
  changeReason: string;
  createdAt: Date;
}

interface RFQNegotiationEntityBase {
  id: string;
  rfqId: string;
  quotationId: string;
  customerId: string;
  vendorId: string;
  proposedPrice: number;
  proposedQuantity: number;
  proposedDeliveryTime: string;
  negotiationNotes: string;
  status: 'pending' | 'accepted' | 'rejected' | 'counter-offer';
  respondedBy: string;
  respondedAt: Date;
  response: string;
  createdAt: Date;
  updatedAt: Date;
}

// Standardized Response Types
export interface RFQAPIResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: Date;
  errors?: string[];
  metadata?: Record<string, any>;
}

export interface PaginatedRFQResponse<T> {
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

// Backend Entity Integration Types
export interface RFQ extends Omit<RFQEntityBase, 'customer' | 'quotations' | 'messages' | 'views'> {
  customerName?: string;
  customerInfo?: {
    id: string;
    companyName: string;
    email: string;
    phone: string;
  };
  quotationSummary?: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
  activitySummary?: {
    views: number;
    messages: number;
    lastActivity: Date;
  };
}

export interface Quotation extends Omit<QuotationEntityBase, 'rfq' | 'vendor' | 'revisions'> {
  vendorName?: string;
  vendorInfo?: {
    id: string;
    companyName: string;
    email: string;
    phone: string;
    logo?: string;
    rating?: number;
  };
  rfqInfo?: {
    id: string;
    title: string;
    rfqNumber: string;
  };
  revisionCount?: number;
  negotiationStatus?: string;
}

export interface RFQMessage extends Omit<RFQMessageEntityBase, 'rfq' | 'sender'> {
  senderName?: string;
  senderInfo?: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
}

export interface RFQView extends RFQViewEntityBase {
  vendorInfo?: {
    id: string;
    companyName: string;
    email: string;
  };
}

export interface QuotationRevision extends QuotationRevisionEntityBase {
  quotationInfo?: {
    id: string;
    vendorName: string;
  };
}

export interface RFQNegotiation extends Omit<RFQNegotiationEntityBase, 'rfq' | 'quotation' | 'customer' | 'vendor'> {
  rfqInfo?: {
    id: string;
    title: string;
    rfqNumber: string;
  };
  quotationInfo?: {
    id: string;
    vendorName: string;
    originalPrice: number;
  };
  customerInfo?: {
    id: string;
    companyName: string;
  };
  vendorInfo?: {
    id: string;
    companyName: string;
  };
}

// Request/Response DTOs
export interface CreateRFQData {
  title: string;
  description: string;
  category: string;
  quantity: number;
  budget?: number;
  deadline?: string;
  attachments?: string[];
  specifications?: Record<string, any>;
  notes?: string;
}

export interface UpdateRFQData extends Partial<CreateRFQData> {
  status?: 'open' | 'quoted' | 'closed' | 'cancelled';
}

export interface CreateQuotationData {
  rfqId: string;
  price: number;
  quantity: number;
  moq: number;
  deliveryTime: string;
  validUntil: string;
  notes?: string;
  attachments?: string[];
  specifications?: Record<string, any>;
  terms?: Record<string, any>;
}

export interface UpdateQuotationData extends Partial<Omit<CreateQuotationData, 'rfqId'>> {
  status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  rejectionReason?: string;
}

export interface CreateRFQMessageData {
  rfqId: string;
  message: string;
  attachments?: string[];
}

export interface CreateNegotiationData {
  rfqId: string;
  quotationId: string;
  proposedPrice: number;
  proposedQuantity: number;
  proposedDeliveryTime: string;
  negotiationNotes?: string;
}

export interface RFQFilters {
  status?: string[];
  category?: string[];
  customerId?: string;
  vendorId?: string;
  budgetMin?: number;
  budgetMax?: number;
  createdAfter?: string;
  createdBefore?: string;
  deadlineAfter?: string;
  deadlineBefore?: string;
  hasQuotations?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export interface QuotationFilters {
  rfqId?: string;
  vendorId?: string;
  status?: string[];
  priceMin?: number;
  priceMax?: number;
  validUntilAfter?: string;
  validUntilBefore?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// RFQ API Service with comprehensive backend integration
export const rfqAPI = {
  // Create RFQ (customer)
  create: async (data: CreateRFQData): Promise<RFQAPIResponse<RFQ>> => {
    const response = await api.post<RFQAPIResponse<RFQ>>('/rfq', data);
    return response.data;
  },

  // Get all RFQs with advanced filtering
  getAll: async (filters?: RFQFilters): Promise<PaginatedRFQResponse<RFQ>> => {
    const response = await api.get<PaginatedRFQResponse<RFQ>>('/rfq', {
      params: filters,
    });
    return response.data;
  },

  // Get RFQ by ID with full details
  getById: async (id: string, includeDetails?: {
    includeQuotations?: boolean;
    includeMessages?: boolean;
    includeViews?: boolean;
    includeNegotiations?: boolean;
  }): Promise<RFQAPIResponse<RFQ>> => {
    const response = await api.get<RFQAPIResponse<RFQ>>(`/rfq/${id}`, {
      params: includeDetails,
    });
    return response.data;
  },

  // Update RFQ
  update: async (id: string, data: UpdateRFQData): Promise<RFQAPIResponse<RFQ>> => {
    const response = await api.put<RFQAPIResponse<RFQ>>(`/rfq/${id}`, data);
    return response.data;
  },

  // Cancel RFQ
  cancel: async (id: string, reason?: string): Promise<RFQAPIResponse<RFQ>> => {
    const response = await api.post<RFQAPIResponse<RFQ>>(`/rfq/${id}/cancel`, { reason });
    return response.data;
  },

  // Close RFQ
  close: async (id: string): Promise<RFQAPIResponse<RFQ>> => {
    const response = await api.post<RFQAPIResponse<RFQ>>(`/rfq/${id}/close`);
    return response.data;
  },

  // Extend RFQ deadline
  extendDeadline: async (id: string, newDeadline: string): Promise<RFQAPIResponse<RFQ>> => {
    const response = await api.post<RFQAPIResponse<RFQ>>(`/rfq/${id}/extend-deadline`, {
      newDeadline,
    });
    return response.data;
  },

  // Get RFQ analytics
  getAnalytics: async (id: string): Promise<RFQAPIResponse<{
    views: number;
    uniqueVendors: number;
    quotationCount: number;
    averagePrice: number;
    priceRange: { min: number; max: number };
    responseRate: number;
    timeToFirstQuote: number;
    competitiveAnalysis: Array<{
      vendorId: string;
      vendorName: string;
      price: number;
      deliveryTime: string;
      score: number;
    }>;
  }>> => {
    const response = await api.get<RFQAPIResponse<any>>(`/rfq/${id}/analytics`);
    return response.data;
  },

  // Quotation Management
  quotations: {
    // Get quotations for RFQ
    getByRFQ: async (rfqId: string, filters?: QuotationFilters): Promise<PaginatedRFQResponse<Quotation>> => {
      const response = await api.get<PaginatedRFQResponse<Quotation>>(`/rfq/${rfqId}/quotations`, {
        params: filters,
      });
      return response.data;
    },

    // Get quotation by ID
    getById: async (id: string): Promise<RFQAPIResponse<Quotation>> => {
      const response = await api.get<RFQAPIResponse<Quotation>>(`/rfq/quotations/${id}`);
      return response.data;
    },

    // Create quotation (vendor)
    create: async (data: CreateQuotationData): Promise<RFQAPIResponse<Quotation>> => {
      const response = await api.post<RFQAPIResponse<Quotation>>('/rfq/quotations', data);
      return response.data;
    },

    // Update quotation
    update: async (id: string, data: UpdateQuotationData): Promise<RFQAPIResponse<Quotation>> => {
      const response = await api.put<RFQAPIResponse<Quotation>>(`/rfq/quotations/${id}`, data);
      return response.data;
    },

    // Accept quotation (customer)
    accept: async (quotationId: string): Promise<RFQAPIResponse<Quotation>> => {
      const response = await api.post<RFQAPIResponse<Quotation>>(`/rfq/quotations/${quotationId}/accept`);
      return response.data;
    },

    // Reject quotation (customer)
    reject: async (quotationId: string, reason?: string): Promise<RFQAPIResponse<Quotation>> => {
      const response = await api.post<RFQAPIResponse<Quotation>>(`/rfq/quotations/${quotationId}/reject`, {
        reason,
      });
      return response.data;
    },

    // Withdraw quotation (vendor)
    withdraw: async (quotationId: string, reason?: string): Promise<RFQAPIResponse<Quotation>> => {
      const response = await api.post<RFQAPIResponse<Quotation>>(`/rfq/quotations/${quotationId}/withdraw`, {
        reason,
      });
      return response.data;
    },

    // Compare quotations
    compare: async (quotationIds: string[]): Promise<RFQAPIResponse<{
      quotations: Array<Quotation & {
        competitiveScore: number;
        priceRanking: number;
        deliveryRanking: number;
        vendorRating: number;
        totalScore: number;
      }>;
      analytics: {
        priceAnalysis: { min: number; max: number; average: number; median: number };
        deliveryAnalysis: { fastest: string; slowest: string; average: string };
        recommendedChoice: string;
      };
    }>> => {
      const response = await api.post<RFQAPIResponse<any>>('/rfq/quotations/compare', {
        quotationIds,
      });
      return response.data;
    },

    // Get quotation revisions
    getRevisions: async (quotationId: string): Promise<RFQAPIResponse<QuotationRevision[]>> => {
      const response = await api.get<RFQAPIResponse<QuotationRevision[]>>(`/rfq/quotations/${quotationId}/revisions`);
      return response.data;
    },
  },

  // Message Management
  messages: {
    // Get RFQ messages
    getByRFQ: async (rfqId: string, filters?: {
      senderType?: string;
      isRead?: boolean;
      page?: number;
      limit?: number;
    }): Promise<PaginatedRFQResponse<RFQMessage>> => {
      const response = await api.get<PaginatedRFQResponse<RFQMessage>>(`/rfq/${rfqId}/messages`, {
        params: filters,
      });
      return response.data;
    },

    // Send message
    send: async (data: CreateRFQMessageData): Promise<RFQAPIResponse<RFQMessage>> => {
      const response = await api.post<RFQAPIResponse<RFQMessage>>(`/rfq/${data.rfqId}/messages`, {
        message: data.message,
        attachments: data.attachments,
      });
      return response.data;
    },

    // Mark message as read
    markAsRead: async (messageId: string): Promise<RFQAPIResponse<RFQMessage>> => {
      const response = await api.post<RFQAPIResponse<RFQMessage>>(`/rfq/messages/${messageId}/read`);
      return response.data;
    },

    // Mark all messages as read for RFQ
    markAllAsRead: async (rfqId: string): Promise<RFQAPIResponse<{ count: number }>> => {
      const response = await api.post<RFQAPIResponse<{ count: number }>>(`/rfq/${rfqId}/messages/mark-all-read`);
      return response.data;
    },

    // Get unread message count
    getUnreadCount: async (rfqId: string): Promise<RFQAPIResponse<{ count: number }>> => {
      const response = await api.get<RFQAPIResponse<{ count: number }>>(`/rfq/${rfqId}/messages/unread-count`);
      return response.data;
    },
  },

  // Negotiation Management
  negotiations: {
    // Get negotiations for RFQ
    getByRFQ: async (rfqId: string): Promise<RFQAPIResponse<RFQNegotiation[]>> => {
      const response = await api.get<RFQAPIResponse<RFQNegotiation[]>>(`/rfq/${rfqId}/negotiations`);
      return response.data;
    },

    // Get negotiations for quotation
    getByQuotation: async (quotationId: string): Promise<RFQAPIResponse<RFQNegotiation[]>> => {
      const response = await api.get<RFQAPIResponse<RFQNegotiation[]>>(`/rfq/quotations/${quotationId}/negotiations`);
      return response.data;
    },

    // Create negotiation
    create: async (data: CreateNegotiationData): Promise<RFQAPIResponse<RFQNegotiation>> => {
      const response = await api.post<RFQAPIResponse<RFQNegotiation>>('/rfq/negotiations', data);
      return response.data;
    },

    // Accept negotiation
    accept: async (negotiationId: string): Promise<RFQAPIResponse<RFQNegotiation>> => {
      const response = await api.post<RFQAPIResponse<RFQNegotiation>>(`/rfq/negotiations/${negotiationId}/accept`);
      return response.data;
    },

    // Reject negotiation
    reject: async (negotiationId: string, response: string): Promise<RFQAPIResponse<RFQNegotiation>> => {
      const res = await api.post<RFQAPIResponse<RFQNegotiation>>(`/rfq/negotiations/${negotiationId}/reject`, {
        response,
      });
      return res.data;
    },

    // Counter offer
    counterOffer: async (negotiationId: string, data: CreateNegotiationData): Promise<RFQAPIResponse<RFQNegotiation>> => {
      const response = await api.post<RFQAPIResponse<RFQNegotiation>>(`/rfq/negotiations/${negotiationId}/counter`, data);
      return response.data;
    },
  },

  // View Tracking
  views: {
    // Track RFQ view
    trackView: async (rfqId: string): Promise<RFQAPIResponse<RFQView>> => {
      const response = await api.post<RFQAPIResponse<RFQView>>(`/rfq/${rfqId}/view`);
      return response.data;
    },

    // Get RFQ views
    getByRFQ: async (rfqId: string): Promise<RFQAPIResponse<RFQView[]>> => {
      const response = await api.get<RFQAPIResponse<RFQView[]>>(`/rfq/${rfqId}/views`);
      return response.data;
    },

    // Get view analytics
    getAnalytics: async (rfqId: string): Promise<RFQAPIResponse<{
      totalViews: number;
      uniqueVendors: number;
      viewsByDate: Array<{ date: string; count: number }>;
      topVendors: Array<{ vendorId: string; vendorName: string; viewCount: number }>;
    }>> => {
      const response = await api.get<RFQAPIResponse<any>>(`/rfq/${rfqId}/views/analytics`);
      return response.data;
    },
  },

  // File Management
  files: {
    // Upload attachment
    uploadAttachment: async (file: File, type: 'rfq' | 'quotation' | 'message' = 'rfq'): Promise<RFQAPIResponse<{
      url: string;
      filename: string;
      size: number;
      mimeType: string;
    }>> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const response = await api.post<RFQAPIResponse<any>>('/rfq/attachments/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },

    // Download attachment
    downloadAttachment: async (url: string): Promise<Blob> => {
      const response = await api.get(`/rfq/attachments/download`, {
        params: { url },
        responseType: 'blob',
      });
      return response.data;
    },

    // Delete attachment
    deleteAttachment: async (url: string): Promise<RFQAPIResponse<{ success: boolean }>> => {
      const response = await api.delete<RFQAPIResponse<{ success: boolean }>>('/rfq/attachments', {
        params: { url },
      });
      return response.data;
    },
  },

  // Search and Discovery
  search: {
    // Search RFQs
    searchRFQs: async (query: string, filters?: RFQFilters): Promise<PaginatedRFQResponse<RFQ>> => {
      const response = await api.get<PaginatedRFQResponse<RFQ>>('/rfq/search', {
        params: { query, ...filters },
      });
      return response.data;
    },

    // Get suggested RFQs for vendor
    getSuggested: async (vendorId: string, limit?: number): Promise<RFQAPIResponse<RFQ[]>> => {
      const response = await api.get<RFQAPIResponse<RFQ[]>>(`/rfq/suggested/${vendorId}`, {
        params: { limit },
      });
      return response.data;
    },

    // Get trending categories
    getTrendingCategories: async (): Promise<RFQAPIResponse<Array<{
      category: string;
      count: number;
      growth: number;
    }>>> => {
      const response = await api.get<RFQAPIResponse<any>>('/rfq/trending-categories');
      return response.data;
    },
  },

  // Statistics and Reporting
  stats: {
    // Get RFQ dashboard stats
    getDashboard: async (userId?: string, role?: 'customer' | 'vendor'): Promise<RFQAPIResponse<{
      totalRFQs: number;
      activeRFQs: number;
      totalQuotations: number;
      acceptanceRate: number;
      averageResponseTime: number;
      recentActivity: Array<{
        type: 'rfq_created' | 'quotation_received' | 'quotation_accepted';
        title: string;
        timestamp: Date;
      }>;
    }>> => {
      const response = await api.get<RFQAPIResponse<any>>('/rfq/stats/dashboard', {
        params: { userId, role },
      });
      return response.data;
    },

    // Get RFQ performance metrics
    getPerformanceMetrics: async (filters?: {
      dateFrom?: string;
      dateTo?: string;
      category?: string;
    }): Promise<RFQAPIResponse<{
      metrics: {
        totalRFQs: number;
        quotationRate: number;
        acceptanceRate: number;
        averageQuotations: number;
        averageResponseTime: number;
        completionRate: number;
      };
      trends: {
        rfqsByMonth: Array<{ month: string; count: number }>;
        quotationsByMonth: Array<{ month: string; count: number }>;
        acceptanceByMonth: Array<{ month: string; rate: number }>;
      };
    }>> => {
      const response = await api.get<RFQAPIResponse<any>>('/rfq/stats/performance', {
        params: filters,
      });
      return response.data;
    },
  },
};

export default rfqAPI;
