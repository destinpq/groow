import api from './client';

export interface GeneralSettings {
  siteName: string;
  logo?: string;
  favicon?: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  timezone: string;
  currency: string;
  maintenance: boolean;
}

export interface SEOSettings {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  googleAnalytics?: string;
  googleConsole?: string;
  facebookPixel?: string;
}

export interface PaymentSettings {
  stripePublishable?: string;
  stripeSecret?: string;
  stripeEnabled: boolean;
  paypalClientId?: string;
  paypalSecret?: string;
  paypalMode: 'sandbox' | 'live';
  paypalEnabled: boolean;
  codEnabled: boolean;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUsername?: string;
  smtpPassword?: string;
  fromEmail?: string;
  fromName: string;
  emailEnabled: boolean;
}

export interface Settings {
  general: GeneralSettings;
  seo: SEOSettings;
  payment: PaymentSettings;
  email: EmailSettings;
}

// Settings API Service
export const settingsAPI = {
  // Get all settings
  getAll: async (): Promise<Settings> => {
    const response = await api.get<Settings>('/settings');
    return response.data;
  },

  // Get specific settings by type
  getByType: async (type: 'general' | 'seo' | 'payment' | 'email'): Promise<any> => {
    const response = await api.get(`/settings/${type}`);
    return response.data;
  },

  // Update general settings
  updateGeneral: async (data: Partial<GeneralSettings>): Promise<GeneralSettings> => {
    const response = await api.put<GeneralSettings>('/settings/general', data);
    return response.data;
  },

  // Update SEO settings
  updateSEO: async (data: Partial<SEOSettings>): Promise<SEOSettings> => {
    const response = await api.put<SEOSettings>('/settings/seo', data);
    return response.data;
  },

  // Update payment settings
  updatePayment: async (data: Partial<PaymentSettings>): Promise<PaymentSettings> => {
    const response = await api.put<PaymentSettings>('/settings/payment', data);
    return response.data;
  },

  // Update email settings
  updateEmail: async (data: Partial<EmailSettings>): Promise<EmailSettings> => {
    const response = await api.put<EmailSettings>('/settings/email', data);
    return response.data;
  },
};

export default settingsAPI;
