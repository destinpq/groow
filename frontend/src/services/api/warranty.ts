import api from './client';

// Types
export interface Warranty {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  type: 'manufacturer' | 'extended' | 'lifetime';
  coverageYears: number;
  purchaseDate: string;
  expirationDate: string;
  status: 'active' | 'expired' | 'claimed';
  certificateUrl?: string;
  terms: string[];
}

export interface WarrantyPlan {
  id: string;
  name: string;
  description: string;
  coverageYears: number;
  price: number;
  coverage: {
    accidentalDamage: boolean;
    theft: boolean;
    wear: boolean;
    defects: boolean;
  };
  terms: string[];
}

export interface WarrantyClaim {
  id: string;
  warrantyId: string;
  issueType: 'defect' | 'damage' | 'malfunction' | 'other';
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  evidence: {
    id: string;
    type: 'image' | 'video' | 'document';
    url: string;
  }[];
  resolution?: {
    type: 'repair' | 'replacement' | 'refund';
    details: string;
    completedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateClaimData {
  warrantyId: string;
  issueType: 'defect' | 'damage' | 'malfunction' | 'other';
  description: string;
  evidence: File[];
}

// Warranty Management API
export const warrantyAPI = {
  // Get all warranties
  getAll: async (): Promise<Warranty[]> => {
    const response = await api.get<Warranty[]>('/warranties');
    return response.data;
  },

  // Get warranty by ID
  getById: async (id: string): Promise<Warranty> => {
    const response = await api.get<Warranty>(`/warranties/${id}`);
    return response.data;
  },

  // Get available plans for product
  getPlans: async (productId: string): Promise<WarrantyPlan[]> => {
    const response = await api.get<WarrantyPlan[]>(`/warranties/plans`, { params: { productId } });
    return response.data;
  },

  // Purchase warranty
  purchase: async (orderId: string, planId: string): Promise<Warranty> => {
    const response = await api.post<Warranty>('/warranties/purchase', {
      orderId,
      planId,
    });
    return response.data;
  },

  // Register existing warranty
  register: async (data: {
    orderId: string;
    productId: string;
    purchaseDate: string;
    serialNumber: string;
  }): Promise<Warranty> => {
    const response = await api.post<Warranty>('/warranties/register', data);
    return response.data;
  },

  // Get claims
  getClaims: async (): Promise<WarrantyClaim[]> => {
    const response = await api.get<WarrantyClaim[]>('/warranties/claims');
    return response.data;
  },

  // Create claim
  createClaim: async (data: CreateClaimData): Promise<WarrantyClaim> => {
    const formData = new FormData();
    formData.append('warrantyId', data.warrantyId);
    formData.append('issueType', data.issueType);
    formData.append('description', data.description);
    data.evidence.forEach((file) => {
      formData.append('evidence', file);
    });
    const response = await api.post<WarrantyClaim>('/warranties/claims', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Get claim by ID
  getClaimById: async (id: string): Promise<WarrantyClaim> => {
    const response = await api.get<WarrantyClaim>(`/warranties/claims/${id}`);
    return response.data;
  },

  // Cancel claim
  cancelClaim: async (id: string): Promise<void> => {
    const response = await api.post<void>(`/warranties/claims/${id}/cancel`);
    return response.data;
  },
};

export default warrantyAPI;
