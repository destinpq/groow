import api from './client';
import {
  SupportTicket,
  CreateTicketRequest,
  AssignTicketRequest,
  UpdateTicketStatusRequest,
  EscalateTicketRequest,
  SendMessageRequest,
  SubmitFeedbackRequest,
  CreateKnowledgeBaseArticleRequest,
  InitiateLiveChatRequest,
  CreateResponseTemplateRequest,
  SupportTicketFilter,
  GetTicketsResponse,
  CreateTicketResponse,
  GetTicketResponse,
  AssignTicketResponse,
  UpdateTicketStatusResponse,
  EscalateTicketResponse,
  SendMessageResponse,
  GetMessagesResponse,
  SubmitFeedbackResponse,
  GetKnowledgeBaseArticlesResponse,
  CreateKnowledgeBaseArticleResponse,
  GetFAQResponse,
  InitiateLiveChatResponse,
  GetResponseTemplatesResponse,
  CreateResponseTemplateResponse,
  SupportAnalytics,
  SupportPerformance,
  SupportDashboardStats,
  SLAReport,
  type SupportAPI
} from '@/types/api/support';
import { ApiResponse } from '@/types/api/common';

// Support API Service Implementation
export const supportAPI: SupportAPI = {
  // Ticket Management
  getAllTickets: async (filter?: SupportTicketFilter): Promise<ApiResponse<GetTicketsResponse>> => {
    const response = await api.get<ApiResponse<GetTicketsResponse>>('/support/tickets', {
      params: filter,
    });
    return response.data;
  },

  getMyTickets: async (filter?: Partial<SupportTicketFilter>): Promise<ApiResponse<GetTicketsResponse>> => {
    const response = await api.get<ApiResponse<GetTicketsResponse>>('/support/tickets/my-tickets', {
      params: filter,
    });
    return response.data;
  },

  getAssignedTickets: async (filter?: Partial<SupportTicketFilter>): Promise<ApiResponse<GetTicketsResponse>> => {
    const response = await api.get<ApiResponse<GetTicketsResponse>>('/support/tickets/assigned', {
      params: filter,
    });
    return response.data;
  },

  createTicket: async (request: CreateTicketRequest, attachments?: File[]): Promise<ApiResponse<CreateTicketResponse>> => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(request));
    
    if (attachments) {
      attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }

    const response = await api.post<ApiResponse<CreateTicketResponse>>('/support/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getTicketById: async (id: string): Promise<ApiResponse<GetTicketResponse>> => {
    const response = await api.get<ApiResponse<GetTicketResponse>>(`/support/tickets/${id}`);
    return response.data;
  },

  assignTicket: async (ticketId: string, request: AssignTicketRequest): Promise<ApiResponse<AssignTicketResponse>> => {
    const response = await api.patch<ApiResponse<AssignTicketResponse>>(`/support/tickets/${ticketId}/assign`, request);
    return response.data;
  },

  updateTicketStatus: async (ticketId: string, request: UpdateTicketStatusRequest): Promise<ApiResponse<UpdateTicketStatusResponse>> => {
    const response = await api.patch<ApiResponse<UpdateTicketStatusResponse>>(`/support/tickets/${ticketId}/status`, request);
    return response.data;
  },

  escalateTicket: async (ticketId: string, request: EscalateTicketRequest): Promise<ApiResponse<EscalateTicketResponse>> => {
    const response = await api.patch<ApiResponse<EscalateTicketResponse>>(`/support/tickets/${ticketId}/escalate`, request);
    return response.data;
  },

  // Ticket Messages
  sendTicketMessage: async (ticketId: string, request: SendMessageRequest, attachments?: File[]): Promise<ApiResponse<SendMessageResponse>> => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(request));
    
    if (attachments) {
      attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }

    const response = await api.post<ApiResponse<SendMessageResponse>>(`/support/tickets/${ticketId}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getTicketMessages: async (ticketId: string): Promise<ApiResponse<GetMessagesResponse>> => {
    const response = await api.get<ApiResponse<GetMessagesResponse>>(`/support/tickets/${ticketId}/messages`);
    return response.data;
  },

  // Customer Feedback
  submitTicketFeedback: async (ticketId: string, request: SubmitFeedbackRequest): Promise<ApiResponse<SubmitFeedbackResponse>> => {
    const response = await api.post<ApiResponse<SubmitFeedbackResponse>>(`/support/tickets/${ticketId}/feedback`, request);
    return response.data;
  },

  // Knowledge Base
  getKnowledgeBaseArticles: async (category?: string, search?: string): Promise<ApiResponse<GetKnowledgeBaseArticlesResponse>> => {
    const response = await api.get<ApiResponse<GetKnowledgeBaseArticlesResponse>>('/support/knowledge-base', {
      params: { category, search },
    });
    return response.data;
  },

  createKnowledgeBaseArticle: async (request: CreateKnowledgeBaseArticleRequest): Promise<ApiResponse<CreateKnowledgeBaseArticleResponse>> => {
    const response = await api.post<ApiResponse<CreateKnowledgeBaseArticleResponse>>('/support/knowledge-base', request);
    return response.data;
  },

  // FAQ
  getFAQ: async (category?: string): Promise<ApiResponse<GetFAQResponse>> => {
    const response = await api.get<ApiResponse<GetFAQResponse>>('/support/faq', {
      params: { category },
    });
    return response.data;
  },

  // Live Chat
  initiateLiveChat: async (request: InitiateLiveChatRequest): Promise<ApiResponse<InitiateLiveChatResponse>> => {
    const response = await api.post<ApiResponse<InitiateLiveChatResponse>>('/support/live-chat', request);
    return response.data;
  },

  // Templates
  getResponseTemplates: async (): Promise<ApiResponse<GetResponseTemplatesResponse>> => {
    const response = await api.get<ApiResponse<GetResponseTemplatesResponse>>('/support/templates');
    return response.data;
  },

  createResponseTemplate: async (request: CreateResponseTemplateRequest): Promise<ApiResponse<CreateResponseTemplateResponse>> => {
    const response = await api.post<ApiResponse<CreateResponseTemplateResponse>>('/support/templates', request);
    return response.data;
  },

  // Analytics & Reports
  getSupportAnalytics: async (period?: string): Promise<ApiResponse<SupportAnalytics>> => {
    const response = await api.get<ApiResponse<SupportAnalytics>>('/support/analytics', {
      params: { period },
    });
    return response.data;
  },

  getSupportPerformance: async (period?: string, staffId?: string): Promise<ApiResponse<SupportPerformance>> => {
    const response = await api.get<ApiResponse<SupportPerformance>>('/support/performance', {
      params: { period, staffId },
    });
    return response.data;
  },

  getSupportDashboardStats: async (): Promise<ApiResponse<SupportDashboardStats>> => {
    const response = await api.get<ApiResponse<SupportDashboardStats>>('/support/dashboard-stats');
    return response.data;
  },

  getSLAReport: async (period?: string): Promise<ApiResponse<SLAReport>> => {
    const response = await api.get<ApiResponse<SLAReport>>('/support/sla-report', {
      params: { period },
    });
    return response.data;
  },

  // Admin Operations
  getSupportCategories: async (): Promise<ApiResponse<{ categories: string[] }>> => {
    const response = await api.get<ApiResponse<{ categories: string[] }>>('/support/categories');
    return response.data;
  },
};

// Only export the object-based implementation
export default supportAPI;

export interface CreateTicketDto {
  customerId: number;
  subject: string;
  description: string;
  category: SupportTicket['category'];
  priority: SupportTicket['priority'];
  sourceChannel: 'email' | 'chat' | 'phone' | 'web' | 'api';
  tags?: string[];
  attachments?: string[];
  relatedOrderId?: number;
}

export interface UpdateTicketDto {
  subject?: string;
  description?: string;
  category?: SupportTicket['category'];
  priority?: SupportTicket['priority'];
  status?: SupportTicket['status'];
  assignedToId?: number;
  tags?: string[];
  satisfactionRating?: number;
  internalNotes?: string;
}

export interface TicketMessage {
  id: number;
  ticketId: number;
  senderId: number;
  senderName: string;
  senderType: 'customer' | 'agent' | 'system';
  message: string;
  messageType: 'text' | 'file' | 'system' | 'note';
  attachments: string[];
  isInternal: boolean;
  sentAt: string;
  readAt?: string;
  isRead: boolean;
}

export interface CreateMessageDto {
  ticketId: number;
  message: string;
  messageType?: TicketMessage['messageType'];
  attachments?: string[];
  isInternal?: boolean;
}

export interface TicketFilters {
  status?: SupportTicket['status'][];
  category?: SupportTicket['category'][];
  priority?: SupportTicket['priority'][];
  assignedToId?: number[];
  customerId?: number;
  createdFrom?: string;
  createdTo?: string;
  tags?: string[];
  sourceChannel?: ('email' | 'chat' | 'phone' | 'web' | 'api')[];
  searchTerm?: string;
  isEscalated?: boolean;
  hasSatisfactionRating?: boolean;
}

export interface SupportStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  escalatedTickets: number;
  avgResolutionTime: number; // in hours
  avgResponseTime: number; // in hours
  resolutionRate: number; // percentage
  satisfactionScore: number; // average rating
  ticketsByCategory: Record<SupportTicket['category'], number>;
  ticketsByPriority: Record<SupportTicket['priority'], number>;
  agentPerformance: {
    agentId: number;
    agentName: string;
    assignedTickets: number;
    resolvedTickets: number;
    avgResolutionTime: number;
    satisfactionScore: number;
  }[];
  trendsData: {
    date: string;
    ticketsCreated: number;
    ticketsResolved: number;
    satisfactionScore: number;
  }[];
}

export interface KnowledgeBaseArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  helpfulCount: number;
  relatedArticles: number[];
}

export interface CreateArticleDto {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublic: boolean;
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface TicketAssignment {
  ticketId: number;
  agentId: number;
  agentName: string;
  assignedAt: string;
  assignedBy: number;
  assignmentReason?: string;
}

export interface EscalationRule {
  id: number;
  name: string;
  conditions: {
    priority?: SupportTicket['priority'][];
    category?: SupportTicket['category'][];
    timeThreshold?: number; // in hours
    unassignedTime?: number; // in hours
  };
  actions: {
    escalateTo?: number; // agent ID
    changePriority?: SupportTicket['priority'];
    addTags?: string[];
    sendNotification?: boolean;
  };
  isActive: boolean;
}

export interface ChatSession {
  id: number;
  customerId: number;
  agentId?: number;
  status: 'waiting' | 'active' | 'ended';
  startedAt: string;
  endedAt?: string;
  messages: ChatMessage[];
  satisfactionRating?: number;
  tags: string[];
}

export interface ChatMessage {
  id: number;
  sessionId: number;
  senderId: number;
  senderType: 'customer' | 'agent' | 'bot';
  message: string;
  messageType: 'text' | 'file' | 'system';
  sentAt: string;
  isRead: boolean;
}

class SupportAPIService {
  private baseUrl = process.env.REACT_APP_API_URL || 'https://groow-api.destinpq.com';

  // Ticket Management
  async getTickets(filters?: TicketFilters): Promise<{ tickets: SupportTicket[]; total: number }> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => queryParams.append(`${key}[]`, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const response = await fetch(`${this.baseUrl}/support/tickets?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  }

  async getTicketById(id: number): Promise<SupportTicket> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  }

  async createTicket(ticketData: CreateTicketDto): Promise<SupportTicket> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }

  async updateTicket(id: number, updates: UpdateTicketDto): Promise<SupportTicket> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  }

  async deleteTicket(id: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/support/tickets/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  }

  async assignTicket(ticketId: number, agentId: number, reason?: string): Promise<TicketAssignment> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, reason }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error assigning ticket:', error);
      throw error;
    }
  }

  async escalateTicket(ticketId: number, reason: string, escalateTo?: number): Promise<SupportTicket> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, escalateTo }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error escalating ticket:', error);
      throw error;
    }
  }

  async resolveTicket(ticketId: number, resolutionNotes: string): Promise<SupportTicket> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolutionNotes }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error resolving ticket:', error);
      throw error;
    }
  }

  async closeTicket(ticketId: number): Promise<SupportTicket> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/close`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.error('Error closing ticket:', error);
      throw error;
    }
  }

  async reopenTicket(ticketId: number, reason: string): Promise<SupportTicket> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/reopen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error reopening ticket:', error);
      throw error;
    }
  }

  // Message Management
  async getTicketMessages(ticketId: number): Promise<TicketMessage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/messages`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching ticket messages:', error);
      throw error;
    }
  }

  async addTicketMessage(messageData: CreateMessageDto): Promise<TicketMessage> {
    try {
      const response = await fetch(`${this.baseUrl}/support/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding ticket message:', error);
      throw error;
    }
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/support/messages/${messageId}/read`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  // Statistics and Analytics
  async getSupportStats(dateRange?: { from: string; to: string }): Promise<SupportStats> {
    try {
      const queryParams = new URLSearchParams();
      if (dateRange) {
        queryParams.append('from', dateRange.from);
        queryParams.append('to', dateRange.to);
      }

      const response = await fetch(`${this.baseUrl}/support/stats?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching support stats:', error);
      throw error;
    }
  }

  async getAgentWorkload(): Promise<{ agentId: number; agentName: string; activeTickets: number; todayTickets: number }[]> {
    try {
      const response = await fetch(`${this.baseUrl}/support/agents/workload`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching agent workload:', error);
      throw error;
    }
  }

  // Knowledge Base
  async getKnowledgeBaseArticles(category?: string, searchTerm?: string): Promise<KnowledgeBaseArticle[]> {
    try {
      const queryParams = new URLSearchParams();
      if (category) queryParams.append('category', category);
      if (searchTerm) queryParams.append('search', searchTerm);

      const response = await fetch(`${this.baseUrl}/support/knowledge-base?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching knowledge base articles:', error);
      throw error;
    }
  }

  async getKnowledgeBaseArticle(id: number): Promise<KnowledgeBaseArticle> {
    try {
      const response = await fetch(`${this.baseUrl}/support/knowledge-base/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching knowledge base article:', error);
      throw error;
    }
  }

  async createKnowledgeBaseArticle(articleData: CreateArticleDto): Promise<KnowledgeBaseArticle> {
    try {
      const response = await fetch(`${this.baseUrl}/support/knowledge-base`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating knowledge base article:', error);
      throw error;
    }
  }

  async updateKnowledgeBaseArticle(id: number, updates: UpdateArticleDto): Promise<KnowledgeBaseArticle> {
    try {
      const response = await fetch(`${this.baseUrl}/support/knowledge-base/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating knowledge base article:', error);
      throw error;
    }
  }

  async deleteKnowledgeBaseArticle(id: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/support/knowledge-base/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting knowledge base article:', error);
      throw error;
    }
  }

  // Live Chat Management
  async getChatSessions(status?: ChatSession['status']): Promise<ChatSession[]> {
    try {
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);

      const response = await fetch(`${this.baseUrl}/support/chat/sessions?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      throw error;
    }
  }

  async startChatSession(customerId: number): Promise<ChatSession> {
    try {
      const response = await fetch(`${this.baseUrl}/support/chat/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error starting chat session:', error);
      throw error;
    }
  }

  async joinChatSession(sessionId: number, agentId: number): Promise<ChatSession> {
    try {
      const response = await fetch(`${this.baseUrl}/support/chat/sessions/${sessionId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error joining chat session:', error);
      throw error;
    }
  }

  async endChatSession(sessionId: number): Promise<ChatSession> {
    try {
      const response = await fetch(`${this.baseUrl}/support/chat/sessions/${sessionId}/end`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.error('Error ending chat session:', error);
      throw error;
    }
  }

  async sendChatMessage(sessionId: number, message: string, senderId: number, senderType: ChatMessage['senderType']): Promise<ChatMessage> {
    try {
      const response = await fetch(`${this.baseUrl}/support/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message, senderId, senderType }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  // Bulk Operations
  async bulkUpdateTickets(ticketIds: number[], updates: Partial<UpdateTicketDto>): Promise<SupportTicket[]> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/bulk-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketIds, updates }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error bulk updating tickets:', error);
      throw error;
    }
  }

  async bulkAssignTickets(ticketIds: number[], agentId: number): Promise<TicketAssignment[]> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/bulk-assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketIds, agentId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error bulk assigning tickets:', error);
      throw error;
    }
  }

  async bulkDeleteTickets(ticketIds: number[]): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/support/tickets/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketIds }),
      });
    } catch (error) {
      console.error('Error bulk deleting tickets:', error);
      throw error;
    }
  }

  // Export and Reporting
  async exportTickets(filters?: TicketFilters, format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('format', format);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => queryParams.append(`${key}[]`, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const response = await fetch(`${this.baseUrl}/support/tickets/export?${queryParams}`);
      return await response.blob();
    } catch (error) {
      console.error('Error exporting tickets:', error);
      throw error;
    }
  }

  async generateSupportReport(type: 'performance' | 'satisfaction' | 'trends', dateRange: { from: string; to: string }): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/support/reports/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dateRange),
      });
      return await response.blob();
    } catch (error) {
      console.error('Error generating support report:', error);
      throw error;
    }
  }

  // Search and Suggestions
  async searchTickets(searchTerm: string, filters?: Partial<TicketFilters>): Promise<SupportTicket[]> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchTerm, filters }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error searching tickets:', error);
      throw error;
    }
  }

  async getSuggestedResponses(ticketId: number): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/suggestions`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching suggested responses:', error);
      throw error;
    }
  }

  async getSimilarTickets(ticketId: number): Promise<SupportTicket[]> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/similar`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching similar tickets:', error);
      throw error;
    }
  }
}

// Commented out to avoid conflict with the object-based implementation above
// export const supportAPI = new SupportAPIService();
// export default supportAPI;