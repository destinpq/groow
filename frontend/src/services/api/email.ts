import apiClient from './client';

// Email Template Types
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

export interface EmailCampaign {
  id: string;
  name: string;
  templateId: string;
  subject: string;
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  scheduledAt?: string;
  sentAt?: string;
  recipientType: 'all' | 'customers' | 'subscribers' | 'segment';
  segmentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailCampaignDto {
  name: string;
  templateId: string;
  subject: string;
  recipientType: EmailCampaign['recipientType'];
  segmentId?: string;
  scheduledAt?: string;
}

export interface UpdateEmailCampaignDto extends Partial<CreateEmailCampaignDto> {
  status?: EmailCampaign['status'];
}

export interface EmailStats {
  totalTemplates: number;
  activeTemplates: number;
  totalCampaigns: number;
  sentCampaigns: number;
  averageOpenRate: number;
  averageClickRate: number;
  totalRecipients: number;
  totalSent: number;
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

// Email Templates API
export const emailAPI = {
  // Template CRUD operations
  async getTemplates(filters?: {
    category?: string;
    status?: string;
    search?: string;
  }): Promise<EmailTemplate[]> {
    const response = await apiClient.get('/email/templates', { params: filters });
    return response.data;
  },

  async getTemplateById(id: string): Promise<EmailTemplate> {
    const response = await apiClient.get(`/email/templates/${id}`);
    return response.data;
  },

  async createTemplate(data: CreateEmailTemplateDto): Promise<EmailTemplate> {
    const response = await apiClient.post('/email/templates', data);
    return response.data;
  },

  async updateTemplate(id: string, data: UpdateEmailTemplateDto): Promise<EmailTemplate> {
    const response = await apiClient.patch(`/email/templates/${id}`, data);
    return response.data;
  },

  async deleteTemplate(id: string): Promise<void> {
    await apiClient.delete(`/email/templates/${id}`);
  },

  async duplicateTemplate(id: string, name: string): Promise<EmailTemplate> {
    const response = await apiClient.post(`/email/templates/${id}/duplicate`, { name });
    return response.data;
  },

  // Template preview
  async previewTemplate(
    id: string,
    variables?: Record<string, any>
  ): Promise<EmailPreview> {
    const response = await apiClient.post(`/email/templates/${id}/preview`, { variables });
    return response.data;
  },

  // Send test email
  async sendTestEmail(data: TestEmailDto): Promise<void> {
    await apiClient.post('/email/test', data);
  },

  // Template variables
  async getAvailableVariables(): Promise<Record<string, string[]>> {
    const response = await apiClient.get('/email/variables');
    return response.data;
  },

  // Campaign CRUD operations
  async getCampaigns(filters?: {
    status?: string;
    search?: string;
  }): Promise<EmailCampaign[]> {
    const response = await apiClient.get('/email/campaigns', { params: filters });
    return response.data;
  },

  async getCampaignById(id: string): Promise<EmailCampaign> {
    const response = await apiClient.get(`/email/campaigns/${id}`);
    return response.data;
  },

  async createCampaign(data: CreateEmailCampaignDto): Promise<EmailCampaign> {
    const response = await apiClient.post('/email/campaigns', data);
    return response.data;
  },

  async updateCampaign(id: string, data: UpdateEmailCampaignDto): Promise<EmailCampaign> {
    const response = await apiClient.patch(`/email/campaigns/${id}`, data);
    return response.data;
  },

  async deleteCampaign(id: string): Promise<void> {
    await apiClient.delete(`/email/campaigns/${id}`);
  },

  // Campaign actions
  async sendCampaign(id: string): Promise<void> {
    await apiClient.post(`/email/campaigns/${id}/send`);
  },

  async pauseCampaign(id: string): Promise<void> {
    await apiClient.post(`/email/campaigns/${id}/pause`);
  },

  async cancelCampaign(id: string): Promise<void> {
    await apiClient.post(`/email/campaigns/${id}/cancel`);
  },

  // Statistics
  async getStats(): Promise<EmailStats> {
    const response = await apiClient.get('/email/stats');
    return response.data;
  },

  async getCampaignStats(id: string): Promise<{
    sent: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  }> {
    const response = await apiClient.get(`/email/campaigns/${id}/stats`);
    return response.data;
  },

  // Bulk operations
  async bulkDeleteTemplates(ids: string[]): Promise<void> {
    await apiClient.post('/email/templates/bulk-delete', { ids });
  },

  async bulkUpdateTemplates(ids: string[], data: UpdateEmailTemplateDto): Promise<void> {
    await apiClient.post('/email/templates/bulk-update', { ids, ...data });
  },
};
