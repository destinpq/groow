import api from './client';

// API Response wrapper types
export interface StoreLocatorAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedStoreLocatorResponse<T> {
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

// Types
export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  hours: {
    [key: string]: {
      open: string;
      close: string;
      isClosed: boolean;
    };
  };
  services: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Store Locator API
export const storeLocatorAPI = {
  // Get all stores
  getAll: async (params?: {
    city?: string;
    state?: string;
    country?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Store>> => {
    const response = await api.get<PaginatedStoreLocatorResponse<Store>>('/stores', { params });
    return {
      data: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      limit: params?.limit || 10,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  // Get store by ID
  getById: async (id: string): Promise<Store> => {
    const response = await api.get<StoreLocatorAPIResponse<Store>>(`/stores/${id}`);
    return response?.data?.data || response?.data;
  },

  // Find nearby stores
  findNearby: async (params: {
    latitude: number;
    longitude: number;
    radius?: number; // in miles
    limit?: number;
  }): Promise<Store[]> => {
    const response = await api.get<StoreLocatorAPIResponse<Store[]>>('/stores/nearby', { params });
    return response?.data?.data || response?.data;
  },

  // Search stores
  search: async (query: string): Promise<Store[]> => {
    const response = await api.get<StoreLocatorAPIResponse<Store[]>>('/stores/search', { params: { q: query } });
    return response?.data?.data || response?.data;
  },

  // Get directions
  getDirections: async (storeId: string, from: {
    latitude: number;
    longitude: number;
  }): Promise<{
    distance: number;
    duration: number;
    steps: any[];
  }> => {
    const response = await api.post<StoreLocatorAPIResponse<{
      distance: number;
      duration: number;
      steps: any[];
    }>>(`/stores/${storeId}/directions`, { from });
    return response?.data?.data || response?.data;
  },
};

export default storeLocatorAPI;
