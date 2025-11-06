import api from './client';

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
    const response = await api.get<PaginatedResponse<Store>>('/stores', { params });
    return response.data;
  },

  // Get store by ID
  getById: async (id: string): Promise<Store> => {
    const response = await api.get<Store>(`/stores/${id}`);
    return response.data;
  },

  // Find nearby stores
  findNearby: async (params: {
    latitude: number;
    longitude: number;
    radius?: number; // in miles
    limit?: number;
  }): Promise<Store[]> => {
    const response = await api.get<Store[]>('/stores/nearby', { params });
    return response.data;
  },

  // Search stores
  search: async (query: string): Promise<Store[]> => {
    const response = await api.get<Store[]>('/stores/search', { params: { q: query } });
    return response.data;
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
    const response = await api.post<{
      distance: number;
      duration: number;
      steps: any[];
    }>(`/stores/${storeId}/directions`, { from });
    return response.data;
  },
};

export default storeLocatorAPI;
