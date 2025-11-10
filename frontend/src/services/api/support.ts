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
    const response = await api.get<ApiResponse<GetTicketsResponse>>('/api/v1/support/tickets', {
      params: filter,
    });
    return response.data;
  },

  getMyTickets: async (filter?: Partial<SupportTicketFilter>): Promise<ApiResponse<GetTicketsResponse>> => {
    const response = await api.get<ApiResponse<GetTicketsResponse>>('/api/v1/support/tickets/my-tickets', {
      params: filter,
    });
    return response.data;
  },

  getAssignedTickets: async (filter?: Partial<SupportTicketFilter>): Promise<ApiResponse<GetTicketsResponse>> => {
    const response = await api.get<ApiResponse<GetTicketsResponse>>('/api/v1/support/tickets/assigned', {
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

    const response = await api.post<ApiResponse<CreateTicketResponse>>('/api/v1/support/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getTicketById: async (id: string): Promise<ApiResponse<GetTicketResponse>> => {
    const response = await api.get<ApiResponse<GetTicketResponse>>(`/api/v1/support/tickets/${id}`);
    return response.data;
  },

  assignTicket: async (ticketId: string, request: AssignTicketRequest): Promise<ApiResponse<AssignTicketResponse>> => {
    const response = await api.patch<ApiResponse<AssignTicketResponse>>(`/api/v1/support/tickets/${ticketId}/assign`, request);
    return response.data;
  },

  updateTicketStatus: async (ticketId: string, request: UpdateTicketStatusRequest): Promise<ApiResponse<UpdateTicketStatusResponse>> => {
    const response = await api.patch<ApiResponse<UpdateTicketStatusResponse>>(`/api/v1/support/tickets/${ticketId}/status`, request);
    return response.data;
  },

  escalateTicket: async (ticketId: string, request: EscalateTicketRequest): Promise<ApiResponse<EscalateTicketResponse>> => {
    const response = await api.patch<ApiResponse<EscalateTicketResponse>>(`/api/v1/support/tickets/${ticketId}/escalate`, request);
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

    const response = await api.post<ApiResponse<SendMessageResponse>>(`/api/v1/support/tickets/${ticketId}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getTicketMessages: async (ticketId: string): Promise<ApiResponse<GetMessagesResponse>> => {
    const response = await api.get<ApiResponse<GetMessagesResponse>>(`/api/v1/support/tickets/${ticketId}/messages`);
    return response.data;
  },

  // Customer Feedback
  submitTicketFeedback: async (ticketId: string, request: SubmitFeedbackRequest): Promise<ApiResponse<SubmitFeedbackResponse>> => {
    const response = await api.post<ApiResponse<SubmitFeedbackResponse>>(`/api/v1/support/tickets/${ticketId}/feedback`, request);
    return response.data;
  },

  // Knowledge Base
  getKnowledgeBaseArticles: async (category?: string, search?: string): Promise<ApiResponse<GetKnowledgeBaseArticlesResponse>> => {
    const response = await api.get<ApiResponse<GetKnowledgeBaseArticlesResponse>>('/api/v1/support/knowledge-base', {
      params: { category, search },
    });
    return response.data;
  },

  createKnowledgeBaseArticle: async (request: CreateKnowledgeBaseArticleRequest): Promise<ApiResponse<CreateKnowledgeBaseArticleResponse>> => {
    const response = await api.post<ApiResponse<CreateKnowledgeBaseArticleResponse>>('/api/v1/support/knowledge-base', request);
    return response.data;
  },

  // FAQ
  getFAQ: async (category?: string): Promise<ApiResponse<GetFAQResponse>> => {
    const response = await api.get<ApiResponse<GetFAQResponse>>('/api/v1/support/faq', {
      params: { category },
    });
    return response.data;
  },

  // Live Chat
  initiateLiveChat: async (request: InitiateLiveChatRequest): Promise<ApiResponse<InitiateLiveChatResponse>> => {
    const response = await api.post<ApiResponse<InitiateLiveChatResponse>>('/api/v1/support/live-chat', request);
    return response.data;
  },

  // Templates
  getResponseTemplates: async (): Promise<ApiResponse<GetResponseTemplatesResponse>> => {
    const response = await api.get<ApiResponse<GetResponseTemplatesResponse>>('/api/v1/support/templates');
    return response.data;
  },

  createResponseTemplate: async (request: CreateResponseTemplateRequest): Promise<ApiResponse<CreateResponseTemplateResponse>> => {
    const response = await api.post<ApiResponse<CreateResponseTemplateResponse>>('/api/v1/support/templates', request);
    return response.data;
  },

  // Analytics & Reports
  getSupportAnalytics: async (period?: string): Promise<ApiResponse<SupportAnalytics>> => {
    const response = await api.get<ApiResponse<SupportAnalytics>>('/api/v1/support/analytics', {
      params: { period },
    });
    return response.data;
  },

  getSupportPerformance: async (period?: string, staffId?: string): Promise<ApiResponse<SupportPerformance>> => {
    const response = await api.get<ApiResponse<SupportPerformance>>('/api/v1/support/performance', {
      params: { period, staffId },
    });
    return response.data;
  },

  getSupportDashboardStats: async (): Promise<ApiResponse<SupportDashboardStats>> => {
    const response = await api.get<ApiResponse<SupportDashboardStats>>('/api/v1/support/dashboard-stats');
    return response.data;
  },

  getSLAReport: async (period?: string): Promise<ApiResponse<SLAReport>> => {
    const response = await api.get<ApiResponse<SLAReport>>('/api/v1/support/sla-report', {
      params: { period },
    });
    return response.data;
  },

  // Admin Operations
  getSupportCategories: async (): Promise<ApiResponse<{ categories: string[] }>> => {
    const response = await api.get<ApiResponse<{ categories: string[] }>>('/api/v1/support/categories');
    return response.data;
  },
};

export default supportAPI;