// Backend settings types - represents system configuration entities

// Core Settings Interfaces (following frontend interface structure)
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

// Comprehensive settings container
export interface Settings {
  general: GeneralSettings;
  seo: SEOSettings;
  payment: PaymentSettings;
  email: EmailSettings;
}

// Settings DTOs
export interface UpdateGeneralSettingsDto extends Partial<GeneralSettings> {}
export interface UpdateSEOSettingsDto extends Partial<SEOSettings> {}
export interface UpdatePaymentSettingsDto extends Partial<PaymentSettings> {}
export interface UpdateEmailSettingsDto extends Partial<EmailSettings> {}

// API Response Types
export interface SettingsAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Re-export for convenience
export * from './pagination';