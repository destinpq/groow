import api from './client';
import type { 
  Settings,
  GeneralSettings,
  SEOSettings,
  PaymentSettings,
  EmailSettings,
  UpdateGeneralSettingsDto,
  UpdateSEOSettingsDto,
  UpdatePaymentSettingsDto,
  UpdateEmailSettingsDto,
  SettingsAPIResponse
} from '@/types/backend/settings';

// Settings API Service with backend POJO integration
export const settingsAPI = {
  // Get all settings with proper typing
  getAll: async (): Promise<Settings> => {
    const response = await api.get<SettingsAPIResponse<Settings>>('/settings');
    return response?.data?.data || response?.data;
  },

  // Get specific settings by type with typed responses
  getByType: async (type: 'general' | 'seo' | 'payment' | 'email'): Promise<GeneralSettings | SEOSettings | PaymentSettings | EmailSettings> => {
    const response = await api.get<SettingsAPIResponse<GeneralSettings | SEOSettings | PaymentSettings | EmailSettings>>(`/settings/${type}`);
    return response?.data?.data || response?.data;
  },

  // Update general settings with backend DTO
  updateGeneral: async (data: UpdateGeneralSettingsDto): Promise<GeneralSettings> => {
    const response = await api.put<SettingsAPIResponse<GeneralSettings>>('/settings/general', data);
    return response?.data?.data || response?.data;
  },

  // Update SEO settings with backend DTO
  updateSEO: async (data: UpdateSEOSettingsDto): Promise<SEOSettings> => {
    const response = await api.put<SettingsAPIResponse<SEOSettings>>('/settings/seo', data);
    return response?.data?.data || response?.data;
  },

  // Update payment settings with backend DTO
  updatePayment: async (data: UpdatePaymentSettingsDto): Promise<PaymentSettings> => {
    const response = await api.put<SettingsAPIResponse<PaymentSettings>>('/settings/payment', data);
    return response?.data?.data || response?.data;
  },

  // Update email settings with backend DTO
  updateEmail: async (data: UpdateEmailSettingsDto): Promise<EmailSettings> => {
    const response = await api.put<SettingsAPIResponse<EmailSettings>>('/settings/email', data);
    return response?.data?.data || response?.data;
  },

  // Get timezone list
  getTimezones: async (): Promise<string[]> => {
    const response = await api.get<SettingsAPIResponse<string[]>>('/settings/timezones');
    return response?.data?.data || response?.data;
  },

  // Get currency list
  getCurrencies: async (): Promise<Array<{ code: string; name: string; symbol: string }>> => {
    const response = await api.get<SettingsAPIResponse<Array<{ code: string; name: string; symbol: string }>>>('/settings/currencies');
    return response?.data?.data || response?.data;
  },

  // Test email configuration
  testEmail: async (testData: { to: string; subject: string; message: string }): Promise<boolean> => {
    const response = await api.post<SettingsAPIResponse<{ success: boolean }>>('/settings/email/test', testData);
    return (response?.data?.data || response?.data)?.success;
  },

  // Reset settings to defaults
  resetToDefaults: async (type: 'general' | 'seo' | 'payment' | 'email'): Promise<GeneralSettings | SEOSettings | PaymentSettings | EmailSettings> => {
    const response = await api.post<SettingsAPIResponse<GeneralSettings | SEOSettings | PaymentSettings | EmailSettings>>(`/settings/${type}/reset`);
    return response?.data?.data || response?.data;
  },

  // Backup settings
  backup: async (): Promise<Settings> => {
    const response = await api.get<SettingsAPIResponse<Settings>>('/settings/backup');
    return response?.data?.data || response?.data;
  },

  // Restore settings from backup
  restore: async (backupData: Settings): Promise<Settings> => {
    const response = await api.post<SettingsAPIResponse<Settings>>('/settings/restore', backupData);
    return response?.data?.data || response?.data;
  },
};

export default settingsAPI;

// Re-export backend types for convenience
export type {
  Settings,
  GeneralSettings,
  SEOSettings,
  PaymentSettings,
  EmailSettings,
  UpdateGeneralSettingsDto,
  UpdateSEOSettingsDto,
  UpdatePaymentSettingsDto,
  UpdateEmailSettingsDto,
} from '@/types/backend/settings';
