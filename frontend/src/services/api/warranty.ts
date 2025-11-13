import api from './client';

// Backend POJO imports - Warranty Module
import {
  WarrantyEntity,
  WarrantyPlanEntity,
  WarrantyClaimEntity,
  WarrantyProviderEntity,
  WarrantyRegistrationEntity,
  CreateWarrantyRequest,
  CreateWarrantyClaimRequest,
  UpdateClaimRequest,
  RegisterWarrantyRequest
} from '../../types/backend/warranty';

// API Response wrappers
interface WarrantyAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedWarrantyResponse<T> {
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

// Request types
export interface PurchaseWarrantyRequest {
  orderId: string;
  planId: string;
  customerId?: string;
  registrationData?: {
    marketingConsent: boolean;
    promotionalEmails: boolean;
    surveyParticipation: boolean;
  };
}

export interface ExtendWarrantyRequest {
  warrantyId: string;
  planId: string;
  extensionMonths: number;
}

// Response types
export interface GetWarrantiesResponse {
  warranties: WarrantyEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetPlansResponse {
  plans: WarrantyPlanEntity[];
  recommendations: {
    planId: string;
    reason: string;
    savings: number;
  }[];
}

export interface GetClaimsResponse {
  claims: WarrantyClaimEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface WarrantyValidationResponse {
  valid: boolean;
  warrantyId?: string;
  status?: string;
  expirationDate?: Date;
  coverageDetails?: {
    accidentalDamage: boolean;
    theft: boolean;
    manufacturing: boolean;
    wearAndTear: boolean;
  };
  nextSteps?: string[];
}

export interface ClaimEstimateResponse {
  eligible: boolean;
  estimatedCost: number;
  deductible: number;
  approvalProbability: number;
  recommendedAction: string;
  alternatives: {
    type: string;
    cost: number;
    description: string;
  }[];
}

// Legacy interfaces for backward compatibility
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

// Warranty Management API with backend POJOs integration
export const warrantyAPI = {
  // ========================================
  // Warranty Management with typed POJOs
  // ========================================
  getAll: async (filters?: {
    customerId?: string;
    productId?: string;
    status?: string;
    type?: string;
    expiringWithin?: number; // days
    page?: number;
    limit?: number;
  }): Promise<GetWarrantiesResponse> => {
    const response = await api.get<PaginatedWarrantyResponse<WarrantyEntity>>('/warranties', { 
      params: filters 
    });
    return {
      warranties: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  getById: async (id: string): Promise<WarrantyEntity> => {
    const response = await api.get<WarrantyAPIResponse<WarrantyEntity>>(`/warranties/${id}`);
    return response?.data?.data || response?.data;
  },

  getByProduct: async (productId: string): Promise<WarrantyEntity[]> => {
    const response = await api.get<WarrantyAPIResponse<WarrantyEntity[]>>(`/warranties/product/${productId}`);
    return response?.data?.data || response?.data;
  },

  validateWarranty: async (serialNumber: string, productId?: string): Promise<WarrantyValidationResponse> => {
    const response = await api.post<WarrantyAPIResponse<WarrantyValidationResponse>>('/warranties/validate', {
      serialNumber,
      productId
    });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Warranty Plans with typed POJOs
  // ========================================
  getPlans: async (productId: string, filters?: {
    category?: string;
    providerId?: string;
    maxPrice?: number;
    minCoverage?: number;
  }): Promise<GetPlansResponse> => {
    const response = await api.get<WarrantyAPIResponse<GetPlansResponse>>('/warranties/plans', { 
      params: { productId, ...filters } 
    });
    return response?.data?.data || response?.data;
  },

  getPlanById: async (id: string): Promise<WarrantyPlanEntity> => {
    const response = await api.get<WarrantyAPIResponse<WarrantyPlanEntity>>(`/warranties/plans/${id}`);
    return response?.data?.data || response?.data;
  },

  comparePlans: async (planIds: string[]): Promise<{
    plans: WarrantyPlanEntity[];
    comparison: {
      feature: string;
      plans: { [planId: string]: boolean | string | number };
    }[];
    recommendations: string[];
  }> => {
    const response = await api.post<WarrantyAPIResponse<any>>('/warranties/plans/compare', { planIds });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Warranty Purchase & Registration
  // ========================================
  purchase: async (data: PurchaseWarrantyRequest): Promise<WarrantyEntity> => {
    const response = await api.post<WarrantyAPIResponse<WarrantyEntity>>('/warranties/purchase', data);
    return response?.data?.data || response?.data;
  },

  register: async (data: RegisterWarrantyRequest): Promise<WarrantyRegistrationEntity> => {
    const response = await api.post<WarrantyAPIResponse<WarrantyRegistrationEntity>>('/warranties/register', data);
    return response?.data?.data || response?.data;
  },

  extend: async (data: ExtendWarrantyRequest): Promise<WarrantyEntity> => {
    const response = await api.post<WarrantyAPIResponse<WarrantyEntity>>('/warranties/extend', data);
    return response?.data?.data || response?.data;
  },

  transfer: async (warrantyId: string, newOwnerId: string, transferReason?: string): Promise<WarrantyEntity> => {
    const response = await api.post<WarrantyAPIResponse<WarrantyEntity>>(`/warranties/${warrantyId}/transfer`, {
      newOwnerId,
      transferReason
    });
    return response?.data?.data || response?.data;
  },

  cancel: async (warrantyId: string, reason: string): Promise<WarrantyEntity> => {
    const response = await api.post<WarrantyAPIResponse<WarrantyEntity>>(`/warranties/${warrantyId}/cancel`, {
      reason
    });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Claims Management with typed POJOs
  // ========================================
  getClaims: async (filters?: {
    warrantyId?: string;
    customerId?: string;
    status?: string;
    issueType?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<GetClaimsResponse> => {
    const response = await api.get<PaginatedWarrantyResponse<WarrantyClaimEntity>>('/warranties/claims', { 
      params: filters 
    });
    return {
      claims: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  getClaimById: async (id: string): Promise<WarrantyClaimEntity> => {
    const response = await api.get<WarrantyAPIResponse<WarrantyClaimEntity>>(`/warranties/claims/${id}`);
    return response?.data?.data || response?.data;
  },

  createClaim: async (data: CreateWarrantyClaimRequest, evidence?: File[]): Promise<WarrantyClaimEntity> => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    
    if (evidence) {
      evidence.forEach((file, index) => {
        formData.append(`evidence[${index}]`, file);
      });
    }

    const response = await api.post<WarrantyAPIResponse<WarrantyClaimEntity>>('/warranties/claims', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response?.data?.data || response?.data;
  },

  updateClaim: async (id: string, data: UpdateClaimRequest): Promise<WarrantyClaimEntity> => {
    const response = await api.put<WarrantyAPIResponse<WarrantyClaimEntity>>(`/warranties/claims/${id}`, data);
    return response?.data?.data || response?.data;
  },

  cancelClaim: async (id: string, reason?: string): Promise<WarrantyClaimEntity> => {
    const response = await api.post<WarrantyAPIResponse<WarrantyClaimEntity>>(`/warranties/claims/${id}/cancel`, {
      reason
    });
    return response?.data?.data || response?.data;
  },

  addClaimEvidence: async (claimId: string, evidence: File[], descriptions?: string[]): Promise<WarrantyClaimEntity> => {
    const formData = new FormData();
    evidence.forEach((file, index) => {
      formData.append(`evidence[${index}]`, file);
      if (descriptions && descriptions[index]) {
        formData.append(`descriptions[${index}]`, descriptions[index]);
      }
    });

    const response = await api.post<WarrantyAPIResponse<WarrantyClaimEntity>>(
      `/warranties/claims/${claimId}/evidence`, 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response?.data?.data || response?.data;
  },

  getClaimEstimate: async (warrantyId: string, issueData: {
    issueType: string;
    description: string;
    symptoms: string[];
  }): Promise<ClaimEstimateResponse> => {
    const response = await api.post<WarrantyAPIResponse<ClaimEstimateResponse>>(
      `/warranties/${warrantyId}/estimate`, 
      issueData
    );
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Providers Management
  // ========================================
  getProviders: async (): Promise<WarrantyProviderEntity[]> => {
    const response = await api.get<WarrantyAPIResponse<WarrantyProviderEntity[]>>('/warranties/providers');
    return response?.data?.data || response?.data;
  },

  getProviderById: async (id: string): Promise<WarrantyProviderEntity> => {
    const response = await api.get<WarrantyAPIResponse<WarrantyProviderEntity>>(`/warranties/providers/${id}`);
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Analytics & Reports
  // ========================================
  getWarrantyAnalytics: async (customerId?: string, dateRange?: { start: Date; end: Date }): Promise<{
    overview: {
      totalWarranties: number;
      activeWarranties: number;
      expiredWarranties: number;
      totalClaims: number;
      approvedClaims: number;
      totalPayout: number;
    };
    expirationWarnings: {
      expiringSoon: number;
      expiredRecently: number;
      renewalEligible: number;
    };
    claimsAnalytics: {
      byType: { type: string; count: number }[];
      byStatus: { status: string; count: number }[];
      avgProcessingTime: number;
      satisfactionRating: number;
    };
    trends: {
      date: string;
      newWarranties: number;
      newClaims: number;
    }[];
  }> => {
    const response = await api.get<WarrantyAPIResponse<any>>('/warranties/analytics', {
      params: { customerId, ...dateRange }
    });
    return response?.data?.data || response?.data;
  },

  getClaimReport: async (claimId: string): Promise<{
    claim: WarrantyClaimEntity;
    timeline: {
      date: Date;
      event: string;
      description: string;
      actor: string;
    }[];
    costs: {
      assessment: number;
      repair: number;
      parts: number;
      shipping: number;
      total: number;
    };
    satisfaction?: {
      rating: number;
      feedback: string;
      surveyDate: Date;
    };
  }> => {
    const response = await api.get<WarrantyAPIResponse<any>>(`/warranties/claims/${claimId}/report`);
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Document Management
  // ========================================
  downloadCertificate: async (warrantyId: string): Promise<Blob> => {
    const response = await api.get(`/warranties/${warrantyId}/certificate`, {
      responseType: 'blob'
    });
    return response.data;
  },

  downloadClaimReport: async (claimId: string, format: 'pdf' | 'doc' = 'pdf'): Promise<Blob> => {
    const response = await api.get(`/warranties/claims/${claimId}/download`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  },

  // ========================================
  // Notifications & Reminders
  // ========================================
  getNotifications: async (customerId?: string): Promise<{
    expirationReminders: {
      warrantyId: string;
      productName: string;
      expirationDate: Date;
      daysRemaining: number;
      renewalAvailable: boolean;
    }[];
    claimUpdates: {
      claimId: string;
      status: string;
      lastUpdate: Date;
      nextSteps?: string[];
    }[];
    renewalOffers: {
      warrantyId: string;
      offerPrice: number;
      discount: number;
      validUntil: Date;
    }[];
  }> => {
    const response = await api.get<WarrantyAPIResponse<any>>('/warranties/notifications', {
      params: { customerId }
    });
    return response?.data?.data || response?.data;
  },

  updateNotificationPreferences: async (customerId: string, preferences: {
    expirationReminders: boolean;
    claimUpdates: boolean;
    renewalOffers: boolean;
    marketingEmails: boolean;
  }): Promise<void> => {
    await api.put(`/warranties/customers/${customerId}/preferences`, preferences);
  },

  // ========================================
  // Bulk Operations
  // ========================================
  bulkRegister: async (registrations: RegisterWarrantyRequest[]): Promise<{
    successful: WarrantyRegistrationEntity[];
    failed: { registration: RegisterWarrantyRequest; error: string }[];
  }> => {
    const response = await api.post<WarrantyAPIResponse<any>>('/warranties/bulk-register', {
      registrations
    });
    return response?.data?.data || response?.data;
  },

  bulkExtend: async (extensions: ExtendWarrantyRequest[]): Promise<{
    successful: WarrantyEntity[];
    failed: { extension: ExtendWarrantyRequest; error: string }[];
  }> => {
    const response = await api.post<WarrantyAPIResponse<any>>('/warranties/bulk-extend', {
      extensions
    });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Legacy Compatibility Methods
  // ========================================
  getAllLegacy: async (): Promise<Warranty[]> => {
    const response = await warrantyAPI.getAll();
    return response.warranties.map(warranty => ({
      id: warranty.id,
      orderId: warranty.orderId,
      productId: warranty.productId,
      productName: warranty.product.name,
      type: warranty.type as any,
      coverageYears: Math.floor(warranty.coverage.durationMonths / 12),
      purchaseDate: warranty.purchase.purchaseDate.toISOString(),
      expirationDate: warranty.coverage.endDate.toISOString(),
      status: warranty.status as any,
      certificateUrl: warranty.terms.termsUrl,
      terms: warranty.terms.exclusions,
    }));
  },

  getByIdLegacy: async (id: string): Promise<Warranty> => {
    const warranty = await warrantyAPI.getById(id);
    return {
      id: warranty.id,
      orderId: warranty.orderId,
      productId: warranty.productId,
      productName: warranty.product.name,
      type: warranty.type as any,
      coverageYears: Math.floor(warranty.coverage.durationMonths / 12),
      purchaseDate: warranty.purchase.purchaseDate.toISOString(),
      expirationDate: warranty.coverage.endDate.toISOString(),
      status: warranty.status as any,
      certificateUrl: warranty.terms.termsUrl,
      terms: warranty.terms.exclusions,
    };
  },

  createClaimLegacy: async (data: CreateClaimData): Promise<WarrantyClaim> => {
    const requestData: CreateWarrantyClaimRequest = {
      warrantyId: data.warrantyId,
      issueType: data.issueType,
      issueCategory: 'general',
      description: data.description,
      occurredAt: new Date(),
      symptoms: [],
    };

    const claim = await warrantyAPI.createClaim(requestData, data.evidence);
    return {
      id: claim.id,
      warrantyId: claim.warrantyId,
      issueType: claim.issue.type as any,
      description: claim.issue.description,
      status: claim.status as any,
      evidence: claim.evidence.map(e => ({
        id: e.id,
        type: e.type as any,
        url: e.url,
      })),
      resolution: claim.resolution ? {
        type: claim.resolution.type as any,
        details: claim.resolution.description,
        completedAt: claim.resolution.actualCompletion?.toISOString() || '',
      } : undefined,
      createdAt: claim.createdAt.toISOString(),
      updatedAt: claim.updatedAt.toISOString(),
    };
  },
};

export default warrantyAPI;
