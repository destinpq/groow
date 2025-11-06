import request from '../../utils/request';

// Help & Support API Types
export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  categoryId: string;
  author: string;
  authorId: string;
  tags: string[];
  views: number;
  helpfulVotes: number;
  totalVotes: number;
  isPublished: boolean;
  isFeatured: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number; // in minutes
  lastUpdated: Date;
  createdAt: Date;
  relatedArticles: string[];
  attachments: HelpAttachment[];
  metadata: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
  };
}

export interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  parentId?: string;
  children?: HelpCategory[];
  articleCount: number;
  order: number;
  isActive: boolean;
  metadata: {
    slug: string;
    seoTitle?: string;
    seoDescription?: string;
  };
}

export interface HelpAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedAt: Date;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'waiting-for-customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  customerId: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  assignedAgent?: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  messages: TicketMessage[];
  attachments: HelpAttachment[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  satisfaction?: {
    rating: number;
    feedback: string;
  };
}

export interface TicketMessage {
  id: string;
  content: string;
  sender: 'customer' | 'agent' | 'system';
  senderInfo: {
    id: string;
    name: string;
    avatar?: string;
  };
  attachments: HelpAttachment[];
  isInternal: boolean;
  timestamp: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  categoryId: string;
  order: number;
  views: number;
  helpfulVotes: number;
  totalVotes: number;
  isPublished: boolean;
  isFeatured: boolean;
  tags: string[];
  relatedFAQs: string[];
  lastUpdated: Date;
  createdAt: Date;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  attachments?: File[];
}

export interface ReturnRequest {
  id: string;
  orderNumber: string;
  customerId: string;
  productDetails: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  reason: string;
  reasonCode: 'defective' | 'wrong-item' | 'not-as-described' | 'changed-mind' | 'damaged' | 'other';
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-transit' | 'received' | 'refunded';
  returnMethod: 'pickup' | 'drop-off' | 'mail';
  returnAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  refundAmount: number;
  refundMethod: 'original-payment' | 'store-credit' | 'bank-transfer';
  images: string[];
  notes: string;
  timeline: ReturnTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReturnTimeline {
  status: string;
  timestamp: Date;
  note?: string;
  updatedBy: string;
}

export interface HelpSearchResult {
  articles: HelpArticle[];
  faqs: FAQ[];
  categories: HelpCategory[];
  totalResults: number;
  searchTime: number;
  suggestions: string[];
}

export interface HelpAnalytics {
  popularArticles: {
    article: HelpArticle;
    views: number;
    helpfulPercentage: number;
  }[];
  searchQueries: {
    query: string;
    count: number;
    resultsFound: boolean;
  }[];
  categoryStats: {
    category: HelpCategory;
    views: number;
    articlesCount: number;
    averageRating: number;
  }[];
  ticketStats: {
    total: number;
    open: number;
    resolved: number;
    averageResolutionTime: number;
    satisfactionScore: number;
  };
}

// Help Articles API
export const helpAPI = {
  // Get all articles with pagination and filters
  getArticles: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    tags?: string[];
    difficulty?: string;
    sort?: 'newest' | 'oldest' | 'popular' | 'helpful';
  } = {}) => {
    return request.get('/help/articles', { params });
  },

  // Get single article by ID
  getArticle: async (id: string) => {
    return request.get(`/help/articles/${id}`);
  },

  // Get article by slug
  getArticleBySlug: async (slug: string) => {
    return request.get(`/help/articles/slug/${slug}`);
  },

  // Search articles
  searchArticles: async (query: string, filters?: {
    category?: string;
    tags?: string[];
    difficulty?: string;
  }) => {
    return request.post('/help/articles/search', { query, filters });
  },

  // Vote on article helpfulness
  voteArticle: async (id: string, helpful: boolean) => {
    return request.post(`/help/articles/${id}/vote`, { helpful });
  },

  // Track article view
  trackView: async (id: string) => {
    return request.post(`/help/articles/${id}/view`);
  },

  // Get related articles
  getRelatedArticles: async (id: string, limit: number = 5) => {
    return request.get(`/help/articles/${id}/related`, { params: { limit } });
  },
};

// FAQ API
export const faqAPI = {
  // Get all FAQs
  getFAQs: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    featured?: boolean;
    sort?: 'newest' | 'popular' | 'helpful';
  } = {}) => {
    return request.get('/help/faqs', { params });
  },

  // Get single FAQ
  getFAQ: async (id: string) => {
    return request.get(`/help/faqs/${id}`);
  },

  // Search FAQs
  searchFAQs: async (query: string) => {
    return request.post('/help/faqs/search', { query });
  },

  // Vote on FAQ helpfulness
  voteFAQ: async (id: string, helpful: boolean) => {
    return request.post(`/help/faqs/${id}/vote`, { helpful });
  },

  // Get related FAQs
  getRelatedFAQs: async (id: string, limit: number = 5) => {
    return request.get(`/help/faqs/${id}/related`, { params: { limit } });
  },
};

// Categories API
export const helpCategoriesAPI = {
  // Get all categories
  getCategories: async (params: {
    includeChildren?: boolean;
    activeOnly?: boolean;
    withStats?: boolean;
  } = {}) => {
    return request.get('/help/categories', { params });
  },

  // Get single category
  getCategory: async (id: string) => {
    return request.get(`/help/categories/${id}`);
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string) => {
    return request.get(`/help/categories/slug/${slug}`);
  },

  // Get category articles
  getCategoryArticles: async (id: string, params: {
    page?: number;
    limit?: number;
    sort?: string;
  } = {}) => {
    return request.get(`/help/categories/${id}/articles`, { params });
  },
};

// Support Tickets API
export const supportTicketsAPI = {
  // Create new ticket
  createTicket: async (data: {
    subject: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    attachments?: File[];
  }) => {
    const formData = new FormData();
    formData.append('subject', data.subject);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('priority', data.priority);
    
    if (data.attachments) {
      data.attachments.forEach((file, index) => {
        formData.append(`attachments`, file);
      });
    }

    return request.post('/support/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get customer tickets
  getTickets: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    category?: string;
    search?: string;
  } = {}) => {
    return request.get('/support/tickets', { params });
  },

  // Get single ticket
  getTicket: async (id: string) => {
    return request.get(`/support/tickets/${id}`);
  },

  // Add message to ticket
  addMessage: async (ticketId: string, data: {
    content: string;
    attachments?: File[];
  }) => {
    const formData = new FormData();
    formData.append('content', data.content);
    
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    return request.post(`/support/tickets/${ticketId}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Rate ticket resolution
  rateTicket: async (ticketId: string, data: {
    rating: number;
    feedback: string;
  }) => {
    return request.post(`/support/tickets/${ticketId}/rate`, data);
  },

  // Close ticket
  closeTicket: async (ticketId: string) => {
    return request.post(`/support/tickets/${ticketId}/close`);
  },
};

// Contact API
export const contactAPI = {
  // Submit contact form
  submitContactForm: async (data: ContactForm) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    formData.append('subject', data.subject);
    formData.append('message', data.message);
    formData.append('category', data.category);
    formData.append('priority', data.priority);
    
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    return request.post('/contact', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get contact info
  getContactInfo: async () => {
    return request.get('/contact/info');
  },
};

// Returns API
export const returnsAPI = {
  // Create return request
  createReturn: async (data: {
    orderNumber: string;
    productIds: string[];
    reason: string;
    reasonCode: string;
    description: string;
    returnMethod: 'pickup' | 'drop-off' | 'mail';
    images?: File[];
  }) => {
    const formData = new FormData();
    formData.append('orderNumber', data.orderNumber);
    formData.append('productIds', JSON.stringify(data.productIds));
    formData.append('reason', data.reason);
    formData.append('reasonCode', data.reasonCode);
    formData.append('description', data.description);
    formData.append('returnMethod', data.returnMethod);
    
    if (data.images) {
      data.images.forEach((file) => {
        formData.append('images', file);
      });
    }

    return request.post('/returns', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get customer returns
  getReturns: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    orderNumber?: string;
  } = {}) => {
    return request.get('/returns', { params });
  },

  // Get single return
  getReturn: async (id: string) => {
    return request.get(`/returns/${id}`);
  },

  // Track return
  trackReturn: async (id: string) => {
    return request.get(`/returns/${id}/track`);
  },

  // Cancel return
  cancelReturn: async (id: string, reason: string) => {
    return request.post(`/returns/${id}/cancel`, { reason });
  },

  // Get return policy
  getReturnPolicy: async () => {
    return request.get('/returns/policy');
  },
};

// Help Analytics API
export const helpAnalyticsAPI = {
  // Get help analytics
  getAnalytics: async (dateRange?: {
    startDate: string;
    endDate: string;
  }) => {
    return request.get('/help/analytics', { params: dateRange });
  },

  // Get search suggestions
  getSearchSuggestions: async (query: string) => {
    return request.get('/help/search/suggestions', { params: { query } });
  },

  // Track search query
  trackSearch: async (query: string, resultsCount: number) => {
    return request.post('/help/search/track', { query, resultsCount });
  },
};

// Export all APIs
export default {
  helpAPI,
  faqAPI,
  helpCategoriesAPI,
  supportTicketsAPI,
  contactAPI,
  returnsAPI,
  helpAnalyticsAPI,
};