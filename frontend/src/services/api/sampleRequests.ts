import api from './client';

// Types
export interface SampleRequest {
  id: string;
  userId: string;
  productId: string;
  product?: any;
  quantity: number;
  reason: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'shipped' | 'delivered';
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSampleRequestData {
  productId: string;
  quantity: number;
  reason: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Sample Requests API
export const sampleRequestsAPI = {
  // Get all my sample requests
  getMyRequests: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<SampleRequest>> => {
    const response = await api.get<PaginatedResponse<SampleRequest>>('/sample-requests/my-requests', { params });
    return response.data;
  },

  // Get sample request by ID
  getById: async (id: string): Promise<SampleRequest> => {
    const response = await api.get<SampleRequest>(`/sample-requests/${id}`);
    return response.data;
  },

  // Create sample request
  create: async (data: CreateSampleRequestData): Promise<SampleRequest> => {
    const response = await api.post<SampleRequest>('/sample-requests', data);
    return response.data;
  },

  // Cancel sample request
  cancel: async (id: string): Promise<SampleRequest> => {
    const response = await api.put<SampleRequest>(`/sample-requests/${id}/cancel`);
    return response.data;
  },

  // Check if product is eligible for sample
  checkEligibility: async (productId: string): Promise<{
    eligible: boolean;
    reason?: string;
    maxQuantity?: number;
  }> => {
    const response = await api.get<{
      eligible: boolean;
      reason?: string;
      maxQuantity?: number;
    }>(`/sample-requests/check-eligibility/${productId}`);
    return response.data;
  },
};

export default sampleRequestsAPI;
