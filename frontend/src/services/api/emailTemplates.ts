import client from './client';

// API Response wrapper types
export interface EmailTemplatesAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedEmailTemplatesResponse<T> {
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

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: 'order_confirmation' | 'welcome' | 'password_reset' | 'promotional' | 'notification';
  content: string;
  variables: string[];
  isActive: boolean;
  lastUsed?: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailTemplateDto {
  name: string;
  subject: string;
  type: string;
  content: string;
  isActive?: boolean;
}

export interface UpdateEmailTemplateDto extends Partial<CreateEmailTemplateDto> {}

export const emailTemplatesAPI = {
  // Get all email templates
  getAll: async (): Promise<EmailTemplate[]> => {
    const response = await client.get<EmailTemplatesAPIResponse<EmailTemplate[]>>('/email-templates');
    return response.data.data;
  },

  // Get email template by ID
  getById: async (id: string): Promise<EmailTemplate> => {
    const response = await client.get<EmailTemplatesAPIResponse<EmailTemplate>>(`/email-templates/${id}`);
    return response.data.data;
  },

  // Create new email template
  create: async (data: CreateEmailTemplateDto): Promise<EmailTemplate> => {
    const response = await client.post<EmailTemplatesAPIResponse<EmailTemplate>>('/email-templates', data);
    return response.data.data;
  },

  // Update email template
  update: async (id: string, data: UpdateEmailTemplateDto): Promise<EmailTemplate> => {
    const response = await client.put<EmailTemplatesAPIResponse<EmailTemplate>>(`/email-templates/${id}`, data);
    return response.data.data;
  },

  // Delete email template
  delete: async (id: string): Promise<void> => {
    await client.delete(`/email-templates/${id}`);
  },

  // Toggle template status
  toggleStatus: async (id: string, isActive: boolean): Promise<EmailTemplate> => {
    const response = await client.patch<EmailTemplatesAPIResponse<EmailTemplate>>(`/email-templates/${id}/status`, { isActive });
    return response.data.data;
  },

  // Get template by type
  getByType: async (type: string): Promise<EmailTemplate[]> => {
    const response = await client.get<EmailTemplatesAPIResponse<EmailTemplate[]>>(`/email-templates/type/${type}`);
    return response.data.data;
  },

  // Send test email
  sendTest: async (id: string, email: string): Promise<void> => {
    await client.post(`/email-templates/${id}/test`, { email });
  },

  // Get template variables
  getVariables: async (): Promise<string[]> => {
    const response = await client.get<EmailTemplatesAPIResponse<string[]>>('/email-templates/variables');
    return response.data.data;
  },

  // Preview template with sample data
  preview: async (id: string, sampleData?: Record<string, any>): Promise<{ subject: string; content: string }> => {
    const response = await client.post<EmailTemplatesAPIResponse<{ subject: string; content: string }>>(`/email-templates/${id}/preview`, { sampleData });
    return response.data.data;
  },
};