import client from './client';

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
  async getAll(): Promise<{ data: EmailTemplate[] }> {
    const response = await client.get('/email-templates');
    return response.data;
  },

  // Get email template by ID
  async getById(id: string): Promise<{ data: EmailTemplate }> {
    const response = await client.get(`/email-templates/${id}`);
    return response.data;
  },

  // Create new email template
  async create(data: CreateEmailTemplateDto): Promise<{ data: EmailTemplate }> {
    const response = await client.post('/email-templates', data);
    return response.data;
  },

  // Update email template
  async update(id: string, data: UpdateEmailTemplateDto): Promise<{ data: EmailTemplate }> {
    const response = await client.put(`/email-templates/${id}`, data);
    return response.data;
  },

  // Delete email template
  async delete(id: string): Promise<void> {
    await client.delete(`/email-templates/${id}`);
  },

  // Toggle template status
  async toggleStatus(id: string, isActive: boolean): Promise<{ data: EmailTemplate }> {
    const response = await client.patch(`/email-templates/${id}/status`, { isActive });
    return response.data;
  },

  // Get template by type
  async getByType(type: string): Promise<{ data: EmailTemplate[] }> {
    const response = await client.get(`/email-templates/type/${type}`);
    return response.data;
  },

  // Send test email
  async sendTest(id: string, email: string): Promise<void> {
    await client.post(`/email-templates/${id}/test`, { email });
  },

  // Get template variables
  async getVariables(): Promise<{ data: string[] }> {
    const response = await client.get('/email-templates/variables');
    return response.data;
  },

  // Preview template with sample data
  async preview(id: string, sampleData?: Record<string, any>): Promise<{ data: { subject: string; content: string } }> {
    const response = await client.post(`/email-templates/${id}/preview`, { sampleData });
    return response.data;
  },
};