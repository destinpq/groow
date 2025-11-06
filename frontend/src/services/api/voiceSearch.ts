import api from './client';

// Types
export interface VoiceSearchResult {
  query: string;
  products: {
    id: string;
    name: string;
    price: number;
    image: string;
    relevanceScore: number;
  }[];
  suggestions: string[];
  totalResults: number;
}

export interface VoiceCommand {
  id: string;
  command: string;
  action: 'search' | 'add-to-cart' | 'navigate' | 'filter';
  parameters: Record<string, any>;
  timestamp: string;
  successful: boolean;
}

export interface VoiceSettings {
  enabled: boolean;
  language: string;
  autoExecute: boolean;
  confirmationRequired: boolean;
}

// Voice Search API
export const voiceSearchAPI = {
  // Search by voice
  search: async (audioBlob: Blob): Promise<VoiceSearchResult> => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    const response = await api.post<VoiceSearchResult>('/voice/search', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Search by text (converted from voice)
  searchByText: async (query: string): Promise<VoiceSearchResult> => {
    const response = await api.post<VoiceSearchResult>('/voice/search/text', { query });
    return response.data;
  },

  // Get command history
  getHistory: async (): Promise<VoiceCommand[]> => {
    const response = await api.get<VoiceCommand[]>('/voice/history');
    return response.data;
  },

  // Get settings
  getSettings: async (): Promise<VoiceSettings> => {
    const response = await api.get<VoiceSettings>('/voice/settings');
    return response.data;
  },

  // Update settings
  updateSettings: async (settings: Partial<VoiceSettings>): Promise<VoiceSettings> => {
    const response = await api.put<VoiceSettings>('/voice/settings', settings);
    return response.data;
  },

  // Get supported languages
  getSupportedLanguages: async (): Promise<{ code: string; name: string }[]> => {
    const response = await api.get<{ code: string; name: string }[]>('/voice/languages');
    return response.data;
  },
};

export default voiceSearchAPI;
