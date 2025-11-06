import api from './client';

// Types
export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  query: string;
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    minRating?: number;
    inStock?: boolean;
  };
  alertEnabled: boolean;
  alertFrequency: 'instant' | 'daily' | 'weekly';
  alertChannels: ('email' | 'sms' | 'push')[];
  newMatches: number;
  totalMatches: number;
  createdAt: string;
  updatedAt: string;
  lastChecked?: string;
}

export interface CreateSavedSearchData {
  name: string;
  query: string;
  filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    minRating?: number;
    inStock?: boolean;
  };
  alertEnabled?: boolean;
  alertFrequency?: 'instant' | 'daily' | 'weekly';
  alertChannels?: ('email' | 'sms' | 'push')[];
}

export interface UpdateSavedSearchData {
  name?: string;
  query?: string;
  filters?: object;
  alertEnabled?: boolean;
  alertFrequency?: 'instant' | 'daily' | 'weekly';
  alertChannels?: ('email' | 'sms' | 'push')[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Saved Searches API
export const savedSearchesAPI = {
  // Get all saved searches
  getAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<SavedSearch>> => {
    const response = await api.get<PaginatedResponse<SavedSearch>>('/saved-searches', { params });
    return response.data;
  },

  // Get single saved search
  getById: async (id: string): Promise<SavedSearch> => {
    const response = await api.get<SavedSearch>(`/saved-searches/${id}`);
    return response.data;
  },

  // Create saved search
  create: async (data: CreateSavedSearchData): Promise<SavedSearch> => {
    const response = await api.post<SavedSearch>('/saved-searches', data);
    return response.data;
  },

  // Update saved search
  update: async (id: string, data: UpdateSavedSearchData): Promise<SavedSearch> => {
    const response = await api.put<SavedSearch>(`/saved-searches/${id}`, data);
    return response.data;
  },

  // Delete saved search
  delete: async (id: string): Promise<void> => {
    const response = await api.delete<void>(`/saved-searches/${id}`);
    return response.data;
  },

  // Execute search (get new matches)
  execute: async (id: string): Promise<{
    matches: any[];
    totalMatches: number;
    newMatches: number;
  }> => {
    const response = await api.post<{
      matches: any[];
      totalMatches: number;
      newMatches: number;
    }>(`/saved-searches/${id}/execute`);
    return response.data;
  },

  // Toggle alert
  toggleAlert: async (id: string, enabled: boolean): Promise<SavedSearch> => {
    const response = await api.patch<SavedSearch>(`/saved-searches/${id}/alert`, { enabled });
    return response.data;
  },
};

export default savedSearchesAPI;
