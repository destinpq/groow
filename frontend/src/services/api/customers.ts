import api from './client';
import { PaginatedResponse } from './products';

// Types
export interface Customer {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
  addresses: Address[];
  orders: number;
  totalSpent: number;
  loyaltyPoints: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
}

export interface CreateAddressData {
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

// Customer API Service
export const customerAPI = {
  // Get current customer profile
  getProfile: async (): Promise<Customer> => {
    const response = await api.get<Customer>('/customers/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileData): Promise<Customer> => {
    const response = await api.put<Customer>('/customers/profile', data);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const response = await api.upload<{ url: string }>('/customers/avatar', file);
    return response.data;
  },

  // Get addresses
  getAddresses: async (): Promise<Address[]> => {
    const response = await api.get<Address[]>('/customers/addresses');
    return response.data;
  },

  // Add address
  addAddress: async (data: CreateAddressData): Promise<Address> => {
    const response = await api.post<Address>('/customers/addresses', data);
    return response.data;
  },

  // Update address
  updateAddress: async (id: string, data: Partial<CreateAddressData>): Promise<Address> => {
    const response = await api.put<Address>(`/customers/addresses/${id}`, data);
    return response.data;
  },

  // Delete address
  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(`/customers/addresses/${id}`);
  },

  // Set default address
  setDefaultAddress: async (id: string): Promise<void> => {
    await api.patch(`/customers/addresses/${id}/set-default`);
  },

  // Get loyalty points
  getLoyaltyPoints: async (): Promise<{
    points: number;
    tier: string;
    nextTier: string;
    pointsToNextTier: number;
  }> => {
    const response = await api.get('/customers/loyalty');
    return response.data;
  },

  // Get all customers (admin only)
  getAll: async (filters?: {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Customer>> => {
    const response = await api.get<PaginatedResponse<Customer>>('/customers', {
      params: filters,
    });
    return response.data;
  },

  // Get customer by ID (admin only)
  getById: async (id: string): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  // Toggle customer active status (admin only)
  toggleActive: async (id: string): Promise<Customer> => {
    const response = await api.patch<Customer>(`/customers/${id}/toggle-active`);
    return response.data;
  },
};

export default customerAPI;
