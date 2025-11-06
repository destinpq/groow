import api from './client';

// Types
export interface TaxExemption {
  id: string;
  certificateNumber: string;
  type: 'resale' | 'nonprofit' | 'government' | 'agricultural' | 'other';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  issuingState: string;
  expirationDate: string;
  documents: {
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
  }[];
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface CreateTaxExemptionData {
  certificateNumber: string;
  type: 'resale' | 'nonprofit' | 'government' | 'agricultural' | 'other';
  issuingState: string;
  expirationDate: string;
  documents: File[];
}

export interface TaxExemptionOrder {
  orderId: string;
  exemptionId: string;
  totalTaxSaved: number;
  appliedAt: string;
}

// Tax Exemption API
export const taxExemptionAPI = {
  // Get all exemptions
  getAll: async (): Promise<TaxExemption[]> => {
    const response = await api.get<TaxExemption[]>('/tax-exemptions');
    return response.data;
  },

  // Get exemption by ID
  getById: async (id: string): Promise<TaxExemption> => {
    const response = await api.get<TaxExemption>(`/tax-exemptions/${id}`);
    return response.data;
  },

  // Create exemption
  create: async (data: CreateTaxExemptionData): Promise<TaxExemption> => {
    const formData = new FormData();
    formData.append('certificateNumber', data.certificateNumber);
    formData.append('type', data.type);
    formData.append('issuingState', data.issuingState);
    formData.append('expirationDate', data.expirationDate);
    data.documents.forEach((file) => {
      formData.append('documents', file);
    });
    const response = await api.post<TaxExemption>('/tax-exemptions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update exemption
  update: async (id: string, data: Partial<CreateTaxExemptionData>): Promise<TaxExemption> => {
    const formData = new FormData();
    if (data.certificateNumber) formData.append('certificateNumber', data.certificateNumber);
    if (data.type) formData.append('type', data.type);
    if (data.issuingState) formData.append('issuingState', data.issuingState);
    if (data.expirationDate) formData.append('expirationDate', data.expirationDate);
    if (data.documents) {
      data.documents.forEach((file) => {
        formData.append('documents', file);
      });
    }
    const response = await api.put<TaxExemption>(`/tax-exemptions/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete exemption
  delete: async (id: string): Promise<void> => {
    const response = await api.delete<void>(`/tax-exemptions/${id}`);
    return response.data;
  },

  // Apply to order
  applyToOrder: async (orderId: string, exemptionId: string): Promise<TaxExemptionOrder> => {
    const response = await api.post<TaxExemptionOrder>('/tax-exemptions/apply', {
      orderId,
      exemptionId,
    });
    return response.data;
  },

  // Get orders with exemptions
  getExemptedOrders: async (): Promise<TaxExemptionOrder[]> => {
    const response = await api.get<TaxExemptionOrder[]>('/tax-exemptions/orders');
    return response.data;
  },

  // Check eligibility
  checkEligibility: async (state: string): Promise<{
    eligible: boolean;
    types: string[];
    requirements: string[];
  }> => {
    const response = await api.get<{
      eligible: boolean;
      types: string[];
      requirements: string[];
    }>('/tax-exemptions/eligibility', { params: { state } });
    return response.data;
  },
};

export default taxExemptionAPI;
