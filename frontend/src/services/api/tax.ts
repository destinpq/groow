import apiClient from './client';

export interface TaxRate {
  id: number;
  country: string;
  countryCode: string;
  state: string;
  stateCode: string;
  city?: string;
  zipCode?: string;
  rate: number;
  type: 'state' | 'local' | 'combined' | 'federal';
  enabled: boolean;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaxJurisdiction {
  id: number;
  name: string;
  code: string;
  rate: number;
  type: string;
  taxRateId: number;
}

export interface TaxCalculation {
  subtotal: number;
  taxableAmount: number;
  taxExemptAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  jurisdictions: TaxJurisdiction[];
  breakdown: {
    federal?: number;
    state?: number;
    local?: number;
    combined?: number;
  };
}

export interface CreateTaxRateDto {
  country: string;
  countryCode: string;
  state: string;
  stateCode: string;
  city?: string;
  zipCode?: string;
  rate: number;
  type: 'state' | 'local' | 'combined' | 'federal';
  enabled?: boolean;
  priority?: number;
}

export interface UpdateTaxRateDto extends Partial<CreateTaxRateDto> {}

export interface TaxCalculationRequest {
  country: string;
  state: string;
  city?: string;
  zipCode?: string;
  subtotal: number;
  shippingAmount?: number;
  items?: Array<{
    productId: number;
    price: number;
    quantity: number;
    taxExempt?: boolean;
    taxCategory?: string;
  }>;
  customerId?: number;
  taxExempt?: boolean;
}

export interface TaxStats {
  totalRates: number;
  enabledRates: number;
  averageRate: number;
  highestRate: number;
  lowestRate: number;
  countriesCount: number;
  statesCount: number;
}

export interface TaxExemption {
  id: number;
  customerId: number;
  customerName: string;
  exemptionType: 'government' | 'nonprofit' | 'reseller' | 'other';
  certificateNumber: string;
  expiryDate: string;
  issuedBy: string;
  status: 'active' | 'expired' | 'pending';
  createdAt: string;
}

export const taxAPI = {
  // Get all tax rates
  getAll: async (filters?: { country?: string; state?: string; enabled?: boolean }) => {
    const response = await apiClient.get('/tax/rates', { params: filters });
    return response.data;
  },

  // Get tax rate by ID
  getById: async (id: number) => {
    const response = await apiClient.get(`/tax/rates/${id}`);
    return response.data;
  },

  // Get tax rate by location
  getByLocation: async (country: string, state: string, city?: string, zipCode?: string) => {
    const response = await apiClient.get('/tax/rates/location', {
      params: { country, state, city, zipCode },
    });
    return response.data;
  },

  // Create new tax rate
  create: async (data: CreateTaxRateDto) => {
    const response = await apiClient.post('/tax/rates', data);
    return response.data;
  },

  // Update tax rate
  update: async (id: number, data: UpdateTaxRateDto) => {
    const response = await apiClient.put(`/tax/rates/${id}`, data);
    return response.data;
  },

  // Delete tax rate
  delete: async (id: number) => {
    const response = await apiClient.delete(`/tax/rates/${id}`);
    return response.data;
  },

  // Calculate tax for an order
  calculate: async (data: TaxCalculationRequest) => {
    const response = await apiClient.post<TaxCalculation>('/tax/calculate', data);
    return response.data;
  },

  // Get tax statistics
  getStats: async () => {
    const response = await apiClient.get<TaxStats>('/tax/stats');
    return response.data;
  },

  // Get list of countries with tax rates
  getCountries: async () => {
    const response = await apiClient.get<string[]>('/tax/countries');
    return response.data;
  },

  // Get states/provinces for a country
  getStates: async (country: string) => {
    const response = await apiClient.get<string[]>(`/tax/countries/${country}/states`);
    return response.data;
  },

  // Enable/disable tax rate
  toggleStatus: async (id: number, enabled: boolean) => {
    const response = await apiClient.patch(`/tax/rates/${id}/status`, { enabled });
    return response.data;
  },

  // Bulk update tax rates
  bulkUpdate: async (ids: number[], data: UpdateTaxRateDto) => {
    const response = await apiClient.post('/tax/rates/bulk-update', { ids, data });
    return response.data;
  },

  // Bulk delete tax rates
  bulkDelete: async (ids: number[]) => {
    const response = await apiClient.post('/tax/rates/bulk-delete', { ids });
    return response.data;
  },

  // Import tax rates from CSV
  importRates: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/tax/rates/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Export tax rates to CSV
  exportRates: async (filters?: { country?: string; state?: string }) => {
    const response = await apiClient.get('/tax/rates/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  // Tax exemptions
  exemptions: {
    getAll: async (filters?: { status?: string; type?: string }) => {
      const response = await apiClient.get('/tax/exemptions', { params: filters });
      return response.data;
    },

    getById: async (id: number) => {
      const response = await apiClient.get(`/tax/exemptions/${id}`);
      return response.data;
    },

    create: async (data: Omit<TaxExemption, 'id' | 'createdAt'>) => {
      const response = await apiClient.post('/tax/exemptions', data);
      return response.data;
    },

    update: async (id: number, data: Partial<TaxExemption>) => {
      const response = await apiClient.put(`/tax/exemptions/${id}`, data);
      return response.data;
    },

    delete: async (id: number) => {
      const response = await apiClient.delete(`/tax/exemptions/${id}`);
      return response.data;
    },

    approve: async (id: number) => {
      const response = await apiClient.patch(`/tax/exemptions/${id}/approve`);
      return response.data;
    },

    reject: async (id: number, reason: string) => {
      const response = await apiClient.patch(`/tax/exemptions/${id}/reject`, { reason });
      return response.data;
    },
  },
};
