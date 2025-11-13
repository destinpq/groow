import apiClient from './client';

// Backend POJO imports - Email Module
import {
  EmailTemplateEntity,
  EmailCampaignEntity,
  EmailRecipientEntity,
  EmailListEntity,
  EmailSubscriberEntity,
  EmailSegmentEntity,
  EmailAnalyticsEntity,
  EmailProviderEntity,
  CreateEmailTemplateRequest,
  CreateEmailCampaignRequest,
  SendTestEmailRequest,
  BulkImportSubscribersRequest
} from '../../types/backend/email';

// API Response wrappers
interface EmailAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedEmailResponse<T> {
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

// Request types
export interface UpdateTemplateRequest extends Partial<CreateEmailTemplateRequest> {
  status?: string;
}

export interface UpdateCampaignRequest extends Partial<CreateEmailCampaignRequest> {
  status?: string;
}

export interface CreateListRequest {
  name: string;
  description?: string;
  type: string;
  visibility?: string;
  customFields?: {
    name: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
  }[];
  settings?: {
    doubleOptIn?: boolean;
    welcomeEmail?: string;
    unsubscribeRedirect?: string;
    confirmationEmail?: string;
  };
}

export interface UpdateListRequest extends Partial<CreateListRequest> {
  status?: string;
}

export interface CreateSubscriberRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  customFields?: Record<string, any>;
  lists?: string[];
  tags?: string[];
  preferences?: {
    emailFormat?: string;
    frequency?: string;
    categories?: string[];
  };
}

export interface UpdateSubscriberRequest extends Partial<CreateSubscriberRequest> {
  status?: string;
}

// Response types
export interface GetTemplatesResponse {
  templates: EmailTemplateEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetCampaignsResponse {
  campaigns: EmailCampaignEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetListsResponse {
  lists: EmailListEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetSubscribersResponse {
  subscribers: EmailSubscriberEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface EmailPreviewResponse {
  html: string;
  text: string;
  subject: string;
  previewText?: string;
}

export interface CampaignStatsResponse {
  metrics: EmailCampaignEntity['metrics'];
  analytics: EmailAnalyticsEntity[];
  topLinks: { url: string; clicks: number }[];
  deviceStats: { device: string; count: number }[];
  locationStats: { country: string; opens: number; clicks: number }[];
}

// Legacy interfaces for backward compatibility
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'onboarding' | 'transactional' | 'marketing' | 'newsletter' | 'notification';
  status: 'active' | 'draft';
  variables: string[];
  previewText?: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailTemplateDto {
  name: string;
  subject: string;
  body: string;
  category: EmailTemplate['category'];
  status?: EmailTemplate['status'];
  variables?: string[];
  previewText?: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
}

export interface UpdateEmailTemplateDto extends Partial<CreateEmailTemplateDto> {}

export interface CreateEmailCampaignDto {
  name: string;
  templateId: string;
  subject: string;
  recipientType: 'all' | 'customers' | 'subscribers' | 'segment';
  segmentId?: string;
  scheduledAt?: string;
}

export interface UpdateEmailCampaignDto extends Partial<CreateEmailCampaignDto> {
  status?: string;
}

export interface EmailPreview {
  html: string;
  text: string;
  subject: string;
}

export interface TestEmailDto {
  templateId: string;
  recipientEmail: string;
  variables?: Record<string, any>;
}

// Email API Service with backend POJOs integration
export const emailAPI = {
  // ========================================
  // Template Management with typed POJOs
  // ========================================
  getTemplates: async (filters?: {
    category?: string;
    type?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetTemplatesResponse> => {
    const response = await apiClient.get<PaginatedEmailResponse<EmailTemplateEntity>>('/email/templates', { 
      params: filters 
    });
    return {
      templates: response.data.data.items,
      total: response.data.data.total,
      page: response.data.data.page,
      totalPages: response.data.data.totalPages
    };
  },

  getTemplateById: async (id: string): Promise<EmailTemplateEntity> => {
    const response = await apiClient.get<EmailAPIResponse<EmailTemplateEntity>>(`/email/templates/${id}`);
    return response?.data?.data || response?.data;
  },

  createTemplate: async (data: CreateEmailTemplateRequest): Promise<EmailTemplateEntity> => {
    const response = await apiClient.post<EmailAPIResponse<EmailTemplateEntity>>('/email/templates', data);
    return response?.data?.data || response?.data;
  },

  updateTemplate: async (id: string, data: UpdateTemplateRequest): Promise<EmailTemplateEntity> => {
    const response = await apiClient.patch<EmailAPIResponse<EmailTemplateEntity>>(`/email/templates/${id}`, data);
    return response?.data?.data || response?.data;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await apiClient.delete(`/email/templates/${id}`);
  },

  duplicateTemplate: async (id: string, name: string): Promise<EmailTemplateEntity> => {
    const response = await apiClient.post<EmailAPIResponse<EmailTemplateEntity>>(`/email/templates/${id}/duplicate`, { name });
    return response?.data?.data || response?.data;
  },

  activateTemplate: async (id: string): Promise<EmailTemplateEntity> => {
    const response = await apiClient.patch<EmailAPIResponse<EmailTemplateEntity>>(`/email/templates/${id}/activate`);
    return response?.data?.data || response?.data;
  },

  archiveTemplate: async (id: string): Promise<EmailTemplateEntity> => {
    const response = await apiClient.patch<EmailAPIResponse<EmailTemplateEntity>>(`/email/templates/${id}/archive`);
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Template Preview & Testing
  // ========================================
  previewTemplate: async (
    id: string,
    variables?: Record<string, any>
  ): Promise<EmailPreviewResponse> => {
    const response = await apiClient.post<EmailAPIResponse<EmailPreviewResponse>>(`/email/templates/${id}/preview`, { variables });
    return response?.data?.data || response?.data;
  },

  sendTestEmail: async (data: SendTestEmailRequest): Promise<void> => {
    await apiClient.post('/email/test', data);
  },

  validateTemplate: async (id: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> => {
    const response = await apiClient.post<EmailAPIResponse<{
      valid: boolean;
      errors: string[];
      warnings: string[];
    }>>(`/email/templates/${id}/validate`);
    return response?.data?.data || response?.data;
  },

  getAvailableVariables: async (type?: string): Promise<Record<string, {
    type: string;
    description: string;
    example: any;
  }>> => {
    const response = await apiClient.get<EmailAPIResponse<Record<string, {
      type: string;
      description: string;
      example: any;
    }>>>('/email/variables', { params: { type } });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Campaign Management with typed POJOs
  // ========================================
  getCampaigns: async (filters?: {
    status?: string;
    type?: string;
    templateId?: string;
    search?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<GetCampaignsResponse> => {
    const response = await apiClient.get<PaginatedEmailResponse<EmailCampaignEntity>>('/email/campaigns', { 
      params: filters 
    });
    return {
      campaigns: response.data.data.items,
      total: response.data.data.total,
      page: response.data.data.page,
      totalPages: response.data.data.totalPages
    };
  },

  getCampaignById: async (id: string): Promise<EmailCampaignEntity> => {
    const response = await apiClient.get<EmailAPIResponse<EmailCampaignEntity>>(`/email/campaigns/${id}`);
    return response?.data?.data || response?.data;
  },

  createCampaign: async (data: CreateEmailCampaignRequest): Promise<EmailCampaignEntity> => {
    const response = await apiClient.post<EmailAPIResponse<EmailCampaignEntity>>('/email/campaigns', data);
    return response?.data?.data || response?.data;
  },

  updateCampaign: async (id: string, data: UpdateCampaignRequest): Promise<EmailCampaignEntity> => {
    const response = await apiClient.patch<EmailAPIResponse<EmailCampaignEntity>>(`/email/campaigns/${id}`, data);
    return response?.data?.data || response?.data;
  },

  deleteCampaign: async (id: string): Promise<void> => {
    await apiClient.delete(`/email/campaigns/${id}`);
  },

  duplicateCampaign: async (id: string, name?: string): Promise<EmailCampaignEntity> => {
    const response = await apiClient.post<EmailAPIResponse<EmailCampaignEntity>>(`/email/campaigns/${id}/duplicate`, { name });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Campaign Actions
  // ========================================
  sendCampaign: async (id: string): Promise<EmailCampaignEntity> => {
    const response = await apiClient.post<EmailAPIResponse<EmailCampaignEntity>>(`/email/campaigns/${id}/send`);
    return response?.data?.data || response?.data;
  },

  scheduleCampaign: async (id: string, scheduledAt: Date): Promise<EmailCampaignEntity> => {
    const response = await apiClient.post<EmailAPIResponse<EmailCampaignEntity>>(`/email/campaigns/${id}/schedule`, { scheduledAt });
    return response?.data?.data || response?.data;
  },

  pauseCampaign: async (id: string): Promise<EmailCampaignEntity> => {
    const response = await apiClient.post<EmailAPIResponse<EmailCampaignEntity>>(`/email/campaigns/${id}/pause`);
    return response?.data?.data || response?.data;
  },

  resumeCampaign: async (id: string): Promise<EmailCampaignEntity> => {
    const response = await apiClient.post<EmailAPIResponse<EmailCampaignEntity>>(`/email/campaigns/${id}/resume`);
    return response?.data?.data || response?.data;
  },

  cancelCampaign: async (id: string, reason?: string): Promise<EmailCampaignEntity> => {
    const response = await apiClient.post<EmailAPIResponse<EmailCampaignEntity>>(`/email/campaigns/${id}/cancel`, { reason });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // List Management with typed POJOs
  // ========================================
  getLists: async (filters?: {
    type?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetListsResponse> => {
    const response = await apiClient.get<PaginatedEmailResponse<EmailListEntity>>('/email/lists', { 
      params: filters 
    });
    return {
      lists: response.data.data.items,
      total: response.data.data.total,
      page: response.data.data.page,
      totalPages: response.data.data.totalPages
    };
  },

  getListById: async (id: string): Promise<EmailListEntity> => {
    const response = await apiClient.get<EmailAPIResponse<EmailListEntity>>(`/email/lists/${id}`);
    return response?.data?.data || response?.data;
  },

  createList: async (data: CreateListRequest): Promise<EmailListEntity> => {
    const response = await apiClient.post<EmailAPIResponse<EmailListEntity>>('/email/lists', data);
    return response?.data?.data || response?.data;
  },

  updateList: async (id: string, data: UpdateListRequest): Promise<EmailListEntity> => {
    const response = await apiClient.patch<EmailAPIResponse<EmailListEntity>>(`/email/lists/${id}`, data);
    return response?.data?.data || response?.data;
  },

  deleteList: async (id: string): Promise<void> => {
    await apiClient.delete(`/email/lists/${id}`);
  },

  // ========================================
  // Subscriber Management with typed POJOs
  // ========================================
  getSubscribers: async (filters?: {
    listId?: string;
    status?: string;
    search?: string;
    tags?: string[];
    page?: number;
    limit?: number;
  }): Promise<GetSubscribersResponse> => {
    const response = await apiClient.get<PaginatedEmailResponse<EmailSubscriberEntity>>('/email/subscribers', { 
      params: filters 
    });
    return {
      subscribers: response.data.data.items,
      total: response.data.data.total,
      page: response.data.data.page,
      totalPages: response.data.data.totalPages
    };
  },

  getSubscriberById: async (id: string): Promise<EmailSubscriberEntity> => {
    const response = await apiClient.get<EmailAPIResponse<EmailSubscriberEntity>>(`/email/subscribers/${id}`);
    return response?.data?.data || response?.data;
  },

  createSubscriber: async (data: CreateSubscriberRequest): Promise<EmailSubscriberEntity> => {
    const response = await apiClient.post<EmailAPIResponse<EmailSubscriberEntity>>('/email/subscribers', data);
    return response?.data?.data || response?.data;
  },

  updateSubscriber: async (id: string, data: UpdateSubscriberRequest): Promise<EmailSubscriberEntity> => {
    const response = await apiClient.patch<EmailAPIResponse<EmailSubscriberEntity>>(`/email/subscribers/${id}`, data);
    return response?.data?.data || response?.data;
  },

  deleteSubscriber: async (id: string): Promise<void> => {
    await apiClient.delete(`/email/subscribers/${id}`);
  },

  unsubscribeSubscriber: async (id: string, reason?: string): Promise<EmailSubscriberEntity> => {
    const response = await apiClient.post<EmailAPIResponse<EmailSubscriberEntity>>(`/email/subscribers/${id}/unsubscribe`, { reason });
    return response?.data?.data || response?.data;
  },

  bulkImportSubscribers: async (data: BulkImportSubscribersRequest): Promise<{
    imported: number;
    updated: number;
    errors: { email: string; error: string }[];
  }> => {
    const response = await apiClient.post<EmailAPIResponse<{
      imported: number;
      updated: number;
      errors: { email: string; error: string }[];
    }>>('/email/subscribers/bulk-import', data);
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Analytics & Statistics with typed POJOs
  // ========================================
  getCampaignStats: async (id: string): Promise<CampaignStatsResponse> => {
    const response = await apiClient.get<EmailAPIResponse<CampaignStatsResponse>>(`/email/campaigns/${id}/stats`);
    return response?.data?.data || response?.data;
  },

  getTemplateStats: async (id: string): Promise<{
    usageCount: number;
    avgOpenRate: number;
    avgClickRate: number;
    campaigns: {
      id: string;
      name: string;
      sent: number;
      openRate: number;
      clickRate: number;
    }[];
  }> => {
    const response = await apiClient.get<EmailAPIResponse<any>>(`/email/templates/${id}/stats`);
    return response?.data?.data || response?.data;
  },

  getEmailAnalytics: async (filters?: {
    startDate?: Date;
    endDate?: Date;
    entityType?: string;
    entityId?: string;
  }): Promise<EmailAnalyticsEntity[]> => {
    const response = await apiClient.get<EmailAPIResponse<EmailAnalyticsEntity[]>>('/email/analytics', { 
      params: filters 
    });
    return response?.data?.data || response?.data;
  },

  getOverallStats: async (period?: string): Promise<{
    totalCampaigns: number;
    totalTemplates: number;
    totalSubscribers: number;
    totalSent: number;
    avgOpenRate: number;
    avgClickRate: number;
    avgBounceRate: number;
    revenueGenerated?: number;
  }> => {
    const response = await apiClient.get<EmailAPIResponse<any>>('/email/stats', { params: { period } });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Segments with typed POJOs
  // ========================================
  getSegments: async (): Promise<EmailSegmentEntity[]> => {
    const response = await apiClient.get<EmailAPIResponse<EmailSegmentEntity[]>>('/email/segments');
    return response?.data?.data || response?.data;
  },

  createSegment: async (data: {
    name: string;
    description?: string;
    conditions: {
      field: string;
      operator: string;
      value: any;
      logic?: 'and' | 'or';
    }[];
    autoUpdate?: boolean;
  }): Promise<EmailSegmentEntity> => {
    const response = await apiClient.post<EmailAPIResponse<EmailSegmentEntity>>('/email/segments', data);
    return response?.data?.data || response?.data;
  },

  updateSegment: async (id: string, data: any): Promise<EmailSegmentEntity> => {
    const response = await apiClient.patch<EmailAPIResponse<EmailSegmentEntity>>(`/email/segments/${id}`, data);
    return response?.data?.data || response?.data;
  },

  deleteSegment: async (id: string): Promise<void> => {
    await apiClient.delete(`/email/segments/${id}`);
  },

  // ========================================
  // Provider Management
  // ========================================
  getProviders: async (): Promise<EmailProviderEntity[]> => {
    const response = await apiClient.get<EmailAPIResponse<EmailProviderEntity[]>>('/email/providers');
    return response?.data?.data || response?.data;
  },

  updateProvider: async (id: string, data: Partial<EmailProviderEntity>): Promise<EmailProviderEntity> => {
    const response = await apiClient.patch<EmailAPIResponse<EmailProviderEntity>>(`/email/providers/${id}`, data);
    return response?.data?.data || response?.data;
  },

  testProvider: async (id: string): Promise<{ success: boolean; error?: string }> => {
    const response = await apiClient.post<EmailAPIResponse<{ success: boolean; error?: string }>>(`/email/providers/${id}/test`);
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Bulk Operations
  // ========================================
  bulkDeleteTemplates: async (ids: string[]): Promise<{ deleted: number; errors: string[] }> => {
    const response = await apiClient.post<EmailAPIResponse<{ deleted: number; errors: string[] }>>('/email/templates/bulk-delete', { ids });
    return response?.data?.data || response?.data;
  },

  bulkUpdateTemplates: async (ids: string[], data: UpdateTemplateRequest): Promise<{ updated: number; errors: string[] }> => {
    const response = await apiClient.post<EmailAPIResponse<{ updated: number; errors: string[] }>>('/email/templates/bulk-update', { ids, ...data });
    return response?.data?.data || response?.data;
  },

  bulkDeleteCampaigns: async (ids: string[]): Promise<{ deleted: number; errors: string[] }> => {
    const response = await apiClient.post<EmailAPIResponse<{ deleted: number; errors: string[] }>>('/email/campaigns/bulk-delete', { ids });
    return response?.data?.data || response?.data;
  },

  bulkUpdateSubscriberStatus: async (ids: string[], status: string): Promise<{ updated: number; errors: string[] }> => {
    const response = await apiClient.post<EmailAPIResponse<{ updated: number; errors: string[] }>>('/email/subscribers/bulk-update-status', { ids, status });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Legacy Compatibility Methods
  // ========================================
  // Legacy template methods
  getTemplatesLegacy: async (filters?: {
    category?: string;
    status?: string;
    search?: string;
  }): Promise<EmailTemplate[]> => {
    const response = await emailAPI.getTemplates(filters);
    // Transform to legacy format
    return response.templates.map(template => ({
      id: template.id,
      name: template.name,
      subject: template.subject,
      body: template.htmlContent,
      category: template.category as any,
      status: template.status as any,
      variables: template.variables.map(v => v.name),
      previewText: template.previewText,
      fromName: template.sender.fromName,
      fromEmail: template.sender.fromEmail,
      replyTo: template.sender.replyTo,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    }));
  },

  createTemplateLegacy: async (data: CreateEmailTemplateDto): Promise<EmailTemplate> => {
    const requestData: CreateEmailTemplateRequest = {
      name: data.name,
      subject: data.subject,
      htmlContent: data.body,
      category: data.category,
      variables: data.variables?.map(name => ({
        name,
        type: 'text',
        required: false,
      })),
      sender: {
        fromName: data.fromName || '',
        fromEmail: data.fromEmail || '',
        replyTo: data.replyTo,
      },
    };

    const response = await emailAPI.createTemplate(requestData);
    return emailAPI.transformToLegacyTemplate(response);
  },

  // Transform helper
  transformToLegacyTemplate: (template: EmailTemplateEntity): EmailTemplate => ({
    id: template.id,
    name: template.name,
    subject: template.subject,
    body: template.htmlContent,
    category: template.category as any,
    status: template.status as any,
    variables: template.variables.map(v => v.name),
    previewText: template.previewText,
    fromName: template.sender.fromName,
    fromEmail: template.sender.fromEmail,
    replyTo: template.sender.replyTo,
    createdAt: template.createdAt.toISOString(),
    updatedAt: template.updatedAt.toISOString(),
  }),
};

export default emailAPI;
