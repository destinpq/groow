import apiClient from './client';

// Backend POJO imports - Tax Management Module
import {
  TaxRateEntity,
  TaxCalculationEntity,
  TaxExemptionEntity,
  TaxReportEntity,
  TaxConfigurationEntity,
  TaxAPIResponse,
  PaginatedTaxResponse,
  CreateTaxRateRequest,
  UpdateTaxRateRequest,
  TaxCalculationRequest,
  CreateTaxExemptionRequest,
  UpdateTaxExemptionRequest,
  TaxReportRequest,
  GetTaxRatesResponse,
  GetTaxCalculationsResponse,
  GetTaxExemptionsResponse,
  TaxStatsResponse,
  TaxValidationResponse,
  TaxRateType,
  TaxCategory,
  TaxExemptionType,
  TaxExemptionStatus,
  TaxCalculationStatus,
  TaxReportType,
  TaxJurisdiction,
  TaxLocation
} from '../../types/backend/tax';

//Legacy interfaces for backward compatibility
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

export interface TaxJurisdictionLegacy {
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
  jurisdictions: TaxJurisdictionLegacy[];
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

export interface TaxCalculationRequestLegacy {
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

// Tax Management API with backend POJOs integration
export const taxAPI = {
  // ========================================
  // Tax Rate Management with typed POJOs
  // ========================================
  getRates: async (filters?: {
    jurisdiction?: Partial<TaxJurisdiction>;
    type?: TaxRateType;
    category?: TaxCategory;
    isActive?: boolean;
    effectiveDate?: Date;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetTaxRatesResponse> => {
    const response = await apiClient.get<PaginatedTaxResponse<TaxRateEntity>>('/tax/rates', { 
      params: filters 
    });
    return {
      rates: response.data.data.items,
      total: response.data.data.total,
      page: response.data.data.page,
      totalPages: response.data.data.totalPages
    };
  },

  getRateById: async (id: string): Promise<TaxRateEntity> => {
    const response = await apiClient.get<TaxAPIResponse<TaxRateEntity>>(`/tax/rates/${id}`);
    return response.data.data;
  },

  getRatesByLocation: async (location: TaxLocation): Promise<TaxRateEntity[]> => {
    const response = await apiClient.post<TaxAPIResponse<TaxRateEntity[]>>('/tax/rates/by-location', location);
    return response.data.data;
  },

  createRate: async (data: CreateTaxRateRequest): Promise<TaxRateEntity> => {
    const response = await apiClient.post<TaxAPIResponse<TaxRateEntity>>('/tax/rates', data);
    return response.data.data;
  },

  updateRate: async (id: string, data: UpdateTaxRateRequest): Promise<TaxRateEntity> => {
    const response = await apiClient.put<TaxAPIResponse<TaxRateEntity>>(`/tax/rates/${id}`, data);
    return response.data.data;
  },

  deleteRate: async (id: string): Promise<void> => {
    await apiClient.delete(`/tax/rates/${id}`);
  },

  toggleRateStatus: async (id: string, isActive: boolean): Promise<TaxRateEntity> => {
    const response = await apiClient.patch<TaxAPIResponse<TaxRateEntity>>(`/tax/rates/${id}/status`, {
      isActive
    });
    return response.data.data;
  },

  // ========================================
  // Tax Calculation with typed POJOs
  // ========================================
  calculate: async (request: TaxCalculationRequest): Promise<TaxCalculationEntity> => {
    const response = await apiClient.post<TaxAPIResponse<TaxCalculationEntity>>('/tax/calculate', request);
    return response.data.data;
  },

  recalculate: async (calculationId: string, changes?: Partial<TaxCalculationRequest>): Promise<TaxCalculationEntity> => {
    const response = await apiClient.post<TaxAPIResponse<TaxCalculationEntity>>(
      `/tax/calculations/${calculationId}/recalculate`, 
      changes
    );
    return response.data.data;
  },

  getCalculations: async (filters?: {
    customerId?: string;
    orderId?: string;
    status?: TaxCalculationStatus;
    dateFrom?: Date;
    dateTo?: Date;
    jurisdiction?: Partial<TaxJurisdiction>;
    page?: number;
    limit?: number;
  }): Promise<GetTaxCalculationsResponse> => {
    const response = await apiClient.get<PaginatedTaxResponse<TaxCalculationEntity>>('/tax/calculations', {
      params: filters
    });
    return {
      calculations: response.data.data.items,
      total: response.data.data.total,
      page: response.data.data.page,
      totalPages: response.data.data.totalPages
    };
  },

  getCalculationById: async (id: string): Promise<TaxCalculationEntity> => {
    const response = await apiClient.get<TaxAPIResponse<TaxCalculationEntity>>(`/tax/calculations/${id}`);
    return response.data.data;
  },

  validateCalculation: async (calculationId: string): Promise<TaxValidationResponse> => {
    const response = await apiClient.post<TaxAPIResponse<TaxValidationResponse>>(
      `/tax/calculations/${calculationId}/validate`
    );
    return response.data.data;
  },

  finalizeCalculation: async (calculationId: string): Promise<TaxCalculationEntity> => {
    const response = await apiClient.patch<TaxAPIResponse<TaxCalculationEntity>>(
      `/tax/calculations/${calculationId}/finalize`
    );
    return response.data.data;
  },

  voidCalculation: async (calculationId: string, reason?: string): Promise<TaxCalculationEntity> => {
    const response = await apiClient.patch<TaxAPIResponse<TaxCalculationEntity>>(
      `/tax/calculations/${calculationId}/void`, 
      { reason }
    );
    return response.data.data;
  },

  // ========================================
  // Tax Exemption Management
  // ========================================
  getExemptions: async (filters?: {
    customerId?: string;
    type?: TaxExemptionType;
    status?: TaxExemptionStatus;
    expiringWithin?: number; // days
    jurisdiction?: Partial<TaxJurisdiction>;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetTaxExemptionsResponse> => {
    const response = await apiClient.get<PaginatedTaxResponse<TaxExemptionEntity>>('/tax/exemptions', {
      params: filters
    });
    return {
      exemptions: response.data.data.items,
      total: response.data.data.total,
      page: response.data.data.page,
      totalPages: response.data.data.totalPages
    };
  },

  getExemptionById: async (id: string): Promise<TaxExemptionEntity> => {
    const response = await apiClient.get<TaxAPIResponse<TaxExemptionEntity>>(`/tax/exemptions/${id}`);
    return response.data.data;
  },

  getCustomerExemptions: async (customerId: string): Promise<TaxExemptionEntity[]> => {
    const response = await apiClient.get<TaxAPIResponse<TaxExemptionEntity[]>>(
      `/tax/exemptions/customer/${customerId}`
    );
    return response.data.data;
  },

  createExemption: async (data: CreateTaxExemptionRequest, certificate?: File): Promise<TaxExemptionEntity> => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (certificate) {
      formData.append('certificate', certificate);
    }

    const response = await apiClient.post<TaxAPIResponse<TaxExemptionEntity>>('/tax/exemptions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  updateExemption: async (id: string, data: UpdateTaxExemptionRequest): Promise<TaxExemptionEntity> => {
    const response = await apiClient.put<TaxAPIResponse<TaxExemptionEntity>>(`/tax/exemptions/${id}`, data);
    return response.data.data;
  },

  verifyExemption: async (id: string, verificationData?: {
    method: 'manual' | 'automated' | 'third_party';
    notes?: string;
  }): Promise<TaxExemptionEntity> => {
    const response = await apiClient.post<TaxAPIResponse<TaxExemptionEntity>>(
      `/tax/exemptions/${id}/verify`, 
      verificationData
    );
    return response.data.data;
  },

  approveExemption: async (id: string, notes?: string): Promise<TaxExemptionEntity> => {
    const response = await apiClient.patch<TaxAPIResponse<TaxExemptionEntity>>(`/tax/exemptions/${id}/approve`, {
      notes
    });
    return response.data.data;
  },

  rejectExemption: async (id: string, reason: string): Promise<TaxExemptionEntity> => {
    const response = await apiClient.patch<TaxAPIResponse<TaxExemptionEntity>>(`/tax/exemptions/${id}/reject`, {
      reason
    });
    return response.data.data;
  },

  renewExemption: async (id: string, newExpiryDate: Date): Promise<TaxExemptionEntity> => {
    const response = await apiClient.post<TaxAPIResponse<TaxExemptionEntity>>(`/tax/exemptions/${id}/renew`, {
      expiryDate: newExpiryDate
    });
    return response.data.data;
  },

  suspendExemption: async (id: string, reason: string): Promise<TaxExemptionEntity> => {
    const response = await apiClient.patch<TaxAPIResponse<TaxExemptionEntity>>(`/tax/exemptions/${id}/suspend`, {
      reason
    });
    return response.data.data;
  },

  // ========================================
  // Location & Jurisdiction Management
  // ========================================
  validateLocation: async (location: Partial<TaxLocation>): Promise<TaxValidationResponse> => {
    const response = await apiClient.post<TaxAPIResponse<TaxValidationResponse>>('/tax/locations/validate', location);
    return response.data.data;
  },

  getJurisdictions: async (filters?: {
    country?: string;
    state?: string;
    level?: string;
    search?: string;
  }): Promise<TaxJurisdiction[]> => {
    const response = await apiClient.get<TaxAPIResponse<TaxJurisdiction[]>>('/tax/jurisdictions', {
      params: filters
    });
    return response.data.data;
  },

  getCountries: async (): Promise<{ code: string; name: string }[]> => {
    const response = await apiClient.get<TaxAPIResponse<any[]>>('/tax/countries');
    return response.data.data;
  },

  getStates: async (countryCode: string): Promise<{ code: string; name: string }[]> => {
    const response = await apiClient.get<TaxAPIResponse<any[]>>(`/tax/countries/${countryCode}/states`);
    return response.data.data;
  },

  getCities: async (countryCode: string, stateCode: string): Promise<string[]> => {
    const response = await apiClient.get<TaxAPIResponse<string[]>>(
      `/tax/countries/${countryCode}/states/${stateCode}/cities`
    );
    return response.data.data;
  },

  // ========================================
  // Tax Reports & Analytics
  // ========================================
  getStats: async (filters?: {
    dateRange?: { start: Date; end: Date };
    jurisdiction?: Partial<TaxJurisdiction>;
    includeProjections?: boolean;
  }): Promise<TaxStatsResponse> => {
    const response = await apiClient.get<TaxAPIResponse<TaxStatsResponse>>('/tax/stats', {
      params: filters
    });
    return response.data.data;
  },

  generateReport: async (request: TaxReportRequest): Promise<TaxReportEntity> => {
    const response = await apiClient.post<TaxAPIResponse<TaxReportEntity>>('/tax/reports', request);
    return response.data.data;
  },

  getReports: async (filters?: {
    reportType?: TaxReportType;
    jurisdiction?: Partial<TaxJurisdiction>;
    dateFrom?: Date;
    dateTo?: Date;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    reports: TaxReportEntity[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await apiClient.get<PaginatedTaxResponse<TaxReportEntity>>('/tax/reports', {
      params: filters
    });
    return {
      reports: response.data.data.items,
      total: response.data.data.total,
      page: response.data.data.page,
      totalPages: response.data.data.totalPages
    };
  },

  getReportById: async (id: string): Promise<TaxReportEntity> => {
    const response = await apiClient.get<TaxAPIResponse<TaxReportEntity>>(`/tax/reports/${id}`);
    return response.data.data;
  },

  downloadReport: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`/tax/reports/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  submitReport: async (id: string): Promise<TaxReportEntity> => {
    const response = await apiClient.post<TaxAPIResponse<TaxReportEntity>>(`/tax/reports/${id}/submit`);
    return response.data.data;
  },

  // ========================================
  // Configuration Management
  // ========================================
  getConfiguration: async (): Promise<TaxConfigurationEntity> => {
    const response = await apiClient.get<TaxAPIResponse<TaxConfigurationEntity>>('/tax/configuration');
    return response.data.data;
  },

  updateConfiguration: async (data: Partial<TaxConfigurationEntity>): Promise<TaxConfigurationEntity> => {
    const response = await apiClient.put<TaxAPIResponse<TaxConfigurationEntity>>('/tax/configuration', data);
    return response.data.data;
  },

  // ========================================
  // Bulk Operations
  // ========================================
  bulkUpdateRates: async (data: {
    rateIds: string[];
    updates: UpdateTaxRateRequest;
  }): Promise<{
    successful: TaxRateEntity[];
    failed: { rateId: string; error: string }[];
  }> => {
    const response = await apiClient.post<TaxAPIResponse<any>>('/tax/rates/bulk-update', data);
    return response.data.data;
  },

  bulkDeleteRates: async (rateIds: string[]): Promise<{
    successful: string[];
    failed: { rateId: string; error: string }[];
  }> => {
    const response = await apiClient.post<TaxAPIResponse<any>>('/tax/rates/bulk-delete', { rateIds });
    return response.data.data;
  },

  bulkApproveExemptions: async (exemptionIds: string[]): Promise<{
    successful: TaxExemptionEntity[];
    failed: { exemptionId: string; error: string }[];
  }> => {
    const response = await apiClient.post<TaxAPIResponse<any>>('/tax/exemptions/bulk-approve', { exemptionIds });
    return response.data.data;
  },

  // ========================================
  // Import/Export Operations
  // ========================================
  importRates: async (file: File, options?: {
    skipDuplicates?: boolean;
    updateExisting?: boolean;
    validateOnly?: boolean;
  }): Promise<{
    imported: number;
    updated: number;
    errors: { row: number; error: string }[];
    warnings: string[];
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    const response = await apiClient.post<TaxAPIResponse<any>>('/tax/rates/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  exportRates: async (filters?: {
    jurisdiction?: Partial<TaxJurisdiction>;
    type?: TaxRateType;
    format?: 'csv' | 'xlsx' | 'json';
  }): Promise<Blob> => {
    const response = await apiClient.post('/tax/rates/export', filters, {
      responseType: 'blob'
    });
    return response.data;
  },

  exportCalculations: async (filters?: {
    dateRange?: { start: Date; end: Date };
    jurisdiction?: Partial<TaxJurisdiction>;
    format?: 'csv' | 'xlsx' | 'json';
  }): Promise<Blob> => {
    const response = await apiClient.post('/tax/calculations/export', filters, {
      responseType: 'blob'
    });
    return response.data;
  },

  // ========================================
  // Compliance & Audit
  // ========================================
  getComplianceStatus: async (jurisdiction?: TaxJurisdiction): Promise<{
    jurisdiction: TaxJurisdiction;
    registrationRequired: boolean;
    registrationStatus: string;
    nextFilingDate?: Date;
    filingFrequency: string;
    outstandingReturns: number;
    complianceScore: number;
    recommendations: string[];
  }[]> => {
    const response = await apiClient.get<TaxAPIResponse<any[]>>('/tax/compliance/status', {
      params: { jurisdiction }
    });
    return response.data.data;
  },

  getAuditTrail: async (filters?: {
    entityType?: 'rate' | 'calculation' | 'exemption' | 'report';
    entityId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    entries: {
      id: string;
      entityType: string;
      entityId: string;
      action: string;
      changes: any;
      userId: string;
      userEmail: string;
      timestamp: Date;
      ipAddress: string;
    }[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await apiClient.get<PaginatedTaxResponse<any>>('/tax/audit-trail', {
      params: filters
    });
    return {
      entries: response.data.data.items,
      total: response.data.data.total,
      page: response.data.data.page,
      totalPages: response.data.data.totalPages
    };
  },

  // ========================================
  // Legacy Compatibility Methods
  // ========================================
  getAll: async (filters?: { 
    country?: string; 
    state?: string; 
    enabled?: boolean 
  }): Promise<TaxRate[]> => {
    const response = await taxAPI.getRates({
      jurisdiction: {
        country: filters?.country,
        state: filters?.state,
      },
      isActive: filters?.enabled,
    });
    
    return response.rates.map(rate => ({
      id: parseInt(rate.id),
      country: rate.jurisdiction.country,
      countryCode: rate.jurisdiction.countryCode,
      state: rate.jurisdiction.state || '',
      stateCode: rate.jurisdiction.stateCode || '',
      city: rate.jurisdiction.city,
      zipCode: rate.jurisdiction.zipCode,
      rate: rate.rate,
      type: rate.type.includes('state') ? 'state' : 'local' as any,
      enabled: rate.isActive,
      priority: rate.priority,
      createdAt: rate.createdAt.toISOString(),
      updatedAt: rate.updatedAt.toISOString(),
    }));
  },

  getById: async (id: number): Promise<TaxRate> => {
    const rate = await taxAPI.getRateById(id.toString());
    return {
      id: parseInt(rate.id),
      country: rate.jurisdiction.country,
      countryCode: rate.jurisdiction.countryCode,
      state: rate.jurisdiction.state || '',
      stateCode: rate.jurisdiction.stateCode || '',
      city: rate.jurisdiction.city,
      zipCode: rate.jurisdiction.zipCode,
      rate: rate.rate,
      type: rate.type.includes('state') ? 'state' : 'local' as any,
      enabled: rate.isActive,
      priority: rate.priority,
      createdAt: rate.createdAt.toISOString(),
      updatedAt: rate.updatedAt.toISOString(),
    };
  },

  getByLocation: async (country: string, state: string, city?: string, zipCode?: string): Promise<TaxRate> => {
    const rates = await taxAPI.getRatesByLocation({
      line1: '',
      city: city || '',
      state,
      zipCode: zipCode || '',
      country,
      countryCode: '',
      isValidated: false,
    });
    
    const rate = rates[0];
    return {
      id: parseInt(rate.id),
      country: rate.jurisdiction.country,
      countryCode: rate.jurisdiction.countryCode,
      state: rate.jurisdiction.state || '',
      stateCode: rate.jurisdiction.stateCode || '',
      city: rate.jurisdiction.city,
      zipCode: rate.jurisdiction.zipCode,
      rate: rate.rate,
      type: rate.type.includes('state') ? 'state' : 'local' as any,
      enabled: rate.isActive,
      priority: rate.priority,
      createdAt: rate.createdAt.toISOString(),
      updatedAt: rate.updatedAt.toISOString(),
    };
  },

  create: async (data: CreateTaxRateDto): Promise<TaxRate> => {
    const requestData: CreateTaxRateRequest = {
      name: `${data.state} ${data.type} Tax`,
      jurisdiction: {
        country: data.country,
        countryCode: data.countryCode,
        state: data.state,
        stateCode: data.stateCode,
        city: data.city,
        zipCode: data.zipCode,
        level: 'state'
      },
      rate: data.rate,
      type: TaxRateType.SALES_TAX,
      category: TaxCategory.STANDARD,
      priority: data.priority || 1,
    };

    const rate = await taxAPI.createRate(requestData);
    return await taxAPI.getById(parseInt(rate.id));
  },

  update: async (id: number, data: UpdateTaxRateDto): Promise<TaxRate> => {
    const updateData: UpdateTaxRateRequest = {
      name: data.state ? `${data.state} ${data.type} Tax` : undefined,
      jurisdiction: {
        country: data.country,
        countryCode: data.countryCode,
        state: data.state,
        stateCode: data.stateCode,
        city: data.city,
        zipCode: data.zipCode,
        level: 'state'
      },
      rate: data.rate,
      priority: data.priority,
      isActive: data.enabled,
    };

    const rate = await taxAPI.updateRate(id.toString(), updateData);
    return await taxAPI.getById(parseInt(rate.id));
  },

  delete: async (id: number): Promise<void> => {
    await taxAPI.deleteRate(id.toString());
  },

  // Legacy method naming - calculate tax for an order  
  calculateLegacy: async (data: TaxCalculationRequestLegacy): Promise<TaxCalculation> => {
    const requestData: TaxCalculationRequest = {
      billingLocation: {
        line1: '',
        city: data.city || '',
        state: data.state,
        zipCode: data.zipCode || '',
        country: data.country,
        countryCode: '',
        isValidated: false,
      },
      customerId: data.customerId?.toString(),
      items: data.items?.map(item => ({
        sku: item.productId.toString(),
        name: `Product ${item.productId}`,
        quantity: item.quantity,
        unitPrice: item.price,
        category: item.taxCategory || 'general',
      })) || [],
      subtotal: data.subtotal,
      shippingAmount: data.shippingAmount,
    };

    const calculation = await taxAPI.calculate(requestData);
    return {
      subtotal: calculation.results.subtotal,
      taxableAmount: calculation.results.taxableAmount,
      taxExemptAmount: calculation.results.exemptAmount,
      taxRate: calculation.results.breakdown[0]?.rate || 0,
      taxAmount: calculation.results.totalTaxAmount,
      total: calculation.results.total,
      jurisdictions: calculation.results.jurisdictionSummary.map((j: any, index: number) => ({
        id: index,
        name: j.jurisdiction.state || j.jurisdiction.country,
        code: j.jurisdiction.stateCode || j.jurisdiction.countryCode,
        rate: j.rate,
        type: 'state',
        taxRateId: index,
      })),
      breakdown: {
        state: calculation.results.typeSummary.find((t: any) => t.type === TaxRateType.SALES_TAX)?.taxAmount,
        local: calculation.results.typeSummary.find((t: any) => t.type === TaxRateType.SALES_TAX)?.taxAmount,
      },
    };
  },

  // Legacy method naming - get tax statistics
  getStatsLegacy: async (): Promise<TaxStats> => {
    const stats = await taxAPI.getStats();
    return {
      totalRates: stats.overview.totalRates,
      enabledRates: stats.overview.activeRates,
      averageRate: stats.overview.avgTaxRate,
      highestRate: Math.max(...stats.byJurisdiction.map(j => j.avgRate)),
      lowestRate: Math.min(...stats.byJurisdiction.map(j => j.avgRate)),
      countriesCount: new Set(stats.byJurisdiction.map(j => j.jurisdiction.country)).size,
      statesCount: new Set(stats.byJurisdiction.map(j => j.jurisdiction.state)).size,
    };
  },

  // Legacy method naming - get countries
  getCountriesLegacy: async (): Promise<string[]> => {
    const countries = await taxAPI.getCountries();
    return countries.map(c => c.name);
  },

  // Legacy method naming - get states/provinces for a country
  getStatesLegacy: async (country: string): Promise<string[]> => {
    const countryCode = country === 'United States' ? 'US' : 'CA';
    const states = await taxAPI.getStates(countryCode);
    return states.map(s => s.name);
  },

  toggleStatus: async (id: number, enabled: boolean) => {
    const rate = await taxAPI.toggleRateStatus(id.toString(), enabled);
    return { success: true, data: rate };
  },

  bulkUpdate: async (ids: number[], data: UpdateTaxRateDto) => {
    const updateData: UpdateTaxRateRequest = {
      rate: data.rate,
      priority: data.priority,
      isActive: data.enabled,
    };
    
    const result = await taxAPI.bulkUpdateRates({
      rateIds: ids.map(id => id.toString()),
      updates: updateData
    });
    return { success: true, data: result };
  },

  bulkDelete: async (ids: number[]) => {
    const result = await taxAPI.bulkDeleteRates(ids.map(id => id.toString()));
    return { success: true, data: result };
  },

  // Legacy method naming - import rates
  importRatesLegacy: async (file: File) => {
    const result = await taxAPI.importRates(file);
    return { success: true, data: result };
  },

  // Legacy method naming - export rates  
  exportRatesLegacy: async (filters?: { country?: string; state?: string }) => {
    return await taxAPI.exportRates({
      jurisdiction: {
        country: filters?.country,
        state: filters?.state,
      },
      format: 'csv'
    });
  },

  // Legacy exemption methods
  exemptions: {
    getAll: async (filters?: { status?: string; type?: string }) => {
      const response = await taxAPI.getExemptions({
        status: filters?.status as TaxExemptionStatus,
        type: filters?.type as TaxExemptionType,
      });
      return { success: true, data: response.exemptions };
    },

    getById: async (id: number) => {
      const exemption = await taxAPI.getExemptionById(id.toString());
      return { success: true, data: exemption };
    },

    create: async (data: Omit<TaxExemption, 'id' | 'createdAt'>) => {
      const requestData: CreateTaxExemptionRequest = {
        customerId: data.customerId.toString(),
        type: data.exemptionType as TaxExemptionType,
        category: TaxExemptionType.RESALE as any,
        certificate: {
          number: data.certificateNumber,
          type: data.exemptionType,
          issuingAuthority: data.issuedBy,
          issuedDate: new Date(),
        },
        scope: {
          validFrom: new Date(),
        },
        issuedDate: new Date(),
        effectiveDate: new Date(),
        expiryDate: new Date(data.expiryDate),
      };

      const exemption = await taxAPI.createExemption(requestData);
      return { success: true, data: exemption };
    },

    update: async (id: number, data: Partial<TaxExemption>) => {
      const exemption = await taxAPI.updateExemption(id.toString(), {});
      return { success: true, data: exemption };
    },

    delete: async (id: number) => {
      await taxAPI.deleteRate(id.toString());
      return { success: true };
    },

    approve: async (id: number) => {
      const exemption = await taxAPI.approveExemption(id.toString());
      return { success: true, data: exemption };
    },

    reject: async (id: number, reason: string) => {
      const exemption = await taxAPI.rejectExemption(id.toString(), reason);
      return { success: true, data: exemption };
    },
  },
};

export default taxAPI;
