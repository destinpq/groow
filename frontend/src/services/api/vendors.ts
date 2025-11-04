import api from './client';
import { PaginatedResponse } from './products';

// Types
export interface Vendor {
  id: string;
  userId: string;
  email: string;
  businessName: string;
  businessType: 'manufacturer' | 'distributor' | 'retailer' | 'wholesaler';
  description?: string;
  logo?: string;
  banner?: string;
  phone?: string;
  website?: string;
  address?: string;
  taxId?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDocuments?: string[];
  rating: number;
  reviewCount: number;
  productCount: number;
  orderCount: number;
  isActive: boolean;
  storeEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateVendorProfileData {
  businessName?: string;
  businessType?: string;
  description?: string;
  logo?: string;
  banner?: string;
  phone?: string;
  website?: string;
  address?: string;
}

export interface KYCDocument {
  id: string;
  type: 'business_license' | 'tax_certificate' | 'id_proof' | 'address_proof';
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
}

export interface VendorStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
}

// Vendor API Service
export const vendorAPI = {
  // Get current vendor profile
  getProfile: async (): Promise<Vendor> => {
    const response = await api.get<Vendor>('/vendors/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: UpdateVendorProfileData): Promise<Vendor> => {
    const response = await api.put<Vendor>('/vendors/profile', data);
    return response.data;
  },

  // Upload logo
  uploadLogo: async (file: File): Promise<{ url: string }> => {
    const response = await api.upload<{ url: string }>('/vendors/logo', file);
    return response.data;
  },

  // Upload banner
  uploadBanner: async (file: File): Promise<{ url: string }> => {
    const response = await api.upload<{ url: string }>('/vendors/banner', file);
    return response.data;
  },

  // Get KYC documents
  getKYCDocuments: async (): Promise<KYCDocument[]> => {
    const response = await api.get<KYCDocument[]>('/vendors/kyc/documents');
    return response.data;
  },

  // Upload KYC document
  uploadKYCDocument: async (type: KYCDocument['type'], file: File): Promise<KYCDocument> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await api.post<KYCDocument>('/vendors/kyc/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Submit KYC for verification
  submitKYC: async (): Promise<void> => {
    await api.post('/vendors/kyc/submit');
  },

  // Get vendor stats
  getStats: async (): Promise<VendorStats> => {
    const response = await api.get<VendorStats>('/vendors/stats');
    return response.data;
  },

  // Toggle store enabled
  toggleStore: async (): Promise<Vendor> => {
    const response = await api.patch<Vendor>('/vendors/toggle-store');
    return response.data;
  },

  // Get all vendors (admin/public)
  getAll: async (filters?: {
    search?: string;
    verificationStatus?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Vendor>> => {
    const response = await api.get<PaginatedResponse<Vendor>>('/vendors', {
      params: filters,
    });
    return response.data;
  },

  // Get vendor by ID (public)
  getById: async (id: string): Promise<Vendor> => {
    const response = await api.get<Vendor>(`/vendors/${id}`);
    return response.data;
  },

  // Verify vendor (admin only)
  verify: async (id: string): Promise<Vendor> => {
    const response = await api.post<Vendor>(`/vendors/${id}/verify`);
    return response.data;
  },

  // Reject vendor (admin only)
  reject: async (id: string, reason: string): Promise<Vendor> => {
    const response = await api.post<Vendor>(`/vendors/${id}/reject`, { reason });
    return response.data;
  },

  // Toggle vendor active status (admin only)
  toggleActive: async (id: string): Promise<Vendor> => {
    const response = await api.patch<Vendor>(`/vendors/${id}/toggle-active`);
    return response.data;
  },
};

export default vendorAPI;
