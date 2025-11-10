import apiClient from './client';

// Temporary frontend types until backend integration is complete
interface Vendor {
  id: string;
  vendorNumber: string;
  businessName: string;
  legalName?: string;
  tradeName?: string;
  businessEmail: string;
  businessPhone?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  businessType: 'individual' | 'sole_proprietorship' | 'partnership' | 'corporation' | 'llc' | 'non_profit';
  businessCategories?: string[];
  serviceCategories?: string[];
  industryVerticals?: string[];
  businessRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  vatNumber?: string;
  incorporationDate?: Date;
  countryOfIncorporation?: string;
  businessAddress?: any;
  billingAddress?: any;
  shippingAddress?: any;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'suspended' | 'inactive';
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'failed' | 'expired';
  verificationData?: any;
  verificationDate?: Date;
  verifiedByUserId?: string;
  verificationNotes?: string;
  isOnboardingComplete: boolean;
  onboardingSteps?: any;
  approvalProcess: 'auto' | 'manual' | 'interview' | 'references';
  approvedByUserId?: string;
  approvalDate?: Date;
  approvalNotes?: string;
  rejectionReason?: string;
  capabilities?: any;
  certifications?: any;
  complianceStandards?: any;
  geographicCoverage?: string[];
  operatingHours?: any;
  languages?: string[];
  primaryCurrency: string;
  acceptedCurrencies?: string[];
  annualRevenue?: number;
  companySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  employeeCount?: number;
  creditLimit?: number;
  defaultPaymentTerms: 'net_15' | 'net_30' | 'net_45' | 'net_60' | 'immediate' | 'custom';
  performanceRating: number;
  totalOrders: number;
  totalRevenue: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  customerSatisfactionScore: number;
  positiveReviews: number;
  negativeReviews: number;
  disputeCount: number;
  hasPreferredVendorStatus: boolean;
  hasVolumeDiscounts: boolean;
  contractTerms?: any;
  pricingStructure?: any;
  commissionRate?: number;
  allowsNegotiation: boolean;
  insuranceInfo?: any;
  guarantees?: any;
  bondingInfo?: any;
  contactPersons?: any;
  supportChannels?: any;
  supportLevel: 'basic' | 'standard' | 'premium' | 'enterprise';
  responseTimeSLA?: string;
  integrationSettings?: any;
  apiEnabled: boolean;
  connectedSystems?: string[];
  automationRules?: any;
  isPubliclyVisible: boolean;
  isFeatured: boolean;
  searchRanking: number;
  keywords?: string[];
  marketingMaterials?: any;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors?: any;
  lastRiskAssessment?: Date;
  riskAssessedByUserId?: string;
  lastLoginAt?: Date;
  lastActivityAt?: Date;
  loginCount: number;
  isActive: boolean;
  registrationDate: Date;
  suspensionDate?: Date;
  suspensionReason?: string;
  tags?: string[];
  internalNotes?: string;
  customData?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface VendorDocument {
  id: string;
  vendorId: string;
  documentType: 'business_license' | 'tax_certificate' | 'insurance_certificate' | 'bank_statement' | 'financial_statement' | 'audit_report' | 'incorporation_document' | 'directors_list' | 'shareholders_agreement' | 'professional_license' | 'certification' | 'compliance_document' | 'identity_proof' | 'address_proof' | 'signature_card' | 'other';
  documentName: string;
  description?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: 'uploaded' | 'under_review' | 'approved' | 'rejected' | 'expired';
  reviewedByUserId?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  issueDate?: Date;
  expirationDate?: Date;
  issueingAuthority?: string;
  documentNumber?: string;
  isRequired: boolean;
  isVerified: boolean;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface VendorContact {
  id: string;
  vendorId: string;
  contactType: 'primary' | 'billing' | 'technical' | 'sales' | 'support' | 'legal' | 'compliance';
  firstName: string;
  lastName: string;
  title?: string;
  department?: string;
  email: string;
  phone?: string;
  mobile?: string;
  isPrimary: boolean;
  isActive: boolean;
  responsibilities?: string[];
  availabilitySchedule?: any;
  preferredContactMethods?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface VendorPerformance {
  id: string;
  vendorId: string;
  metricDate: Date;
  metricPeriod: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'ad_hoc';
  ordersReceived: number;
  ordersCompleted: number;
  ordersOnTime: number;
  ordersCancelled: number;
  revenueGenerated: number;
  averageOrderValue: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  customerSatisfactionScore: number;
  qualityIssues: number;
  customerComplaints: number;
  returnsProcessed: number;
  disputesRaised: number;
  disputesResolved: number;
  averageResponseTimeHours: number;
  averageResolutionTimeHours: number;
  slaComplianceRate: number;
  costSavings: number;
  priceCompetitiveness: number;
  paymentTermsCompliance: number;
  customMetrics?: any;
  notes?: string;
  reviewedByUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface VendorContract {
  id: string;
  vendorId: string;
  contractNumber: string;
  contractType: 'master_service_agreement' | 'statement_of_work' | 'purchase_order' | 'nda' | 'service_level_agreement' | 'other';
  title: string;
  description?: string;
  status: 'draft' | 'pending_approval' | 'active' | 'suspended' | 'expired' | 'terminated';
  startDate: Date;
  endDate?: Date;
  isAutoRenew: boolean;
  autoRenewPeriodMonths?: number;
  terms?: any;
  pricing?: any;
  slaTerms?: any;
  paymentTerms?: any;
  contractValue?: number;
  contractCurrency?: string;
  milestones?: any;
  penalties?: any;
  incentives?: any;
  documentPath?: string;
  createdByUserId?: string;
  approvedByUserId?: string;
  approvalDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface VendorReview {
  id: string;
  vendorId: string;
  customerId: string;
  orderId?: string;
  rating: number;
  title: string;
  comment: string;
  criteriaRatings?: any;
  isVerified: boolean;
  isPublic: boolean;
  moderatedByUserId?: string;
  moderatedAt?: Date;
  moderationNotes?: string;
  vendorResponse?: string;
  vendorResponseAt?: Date;
  helpfulVotes: number;
  unhelpfulVotes: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginatedResponse<T> { items: T[]; total: number; page: number; limit: number; hasNext: boolean; hasPrev: boolean; }
interface APIResponse<T> { success: boolean; data: T; message?: string; timestamp?: string; }

// Comprehensive B2B Enterprise Vendor Management API
export const vendorAPI = {
  // ========================================
  // Vendor Registration & Onboarding
  // ========================================

  // Register new vendor
  register: async (data: {
    businessName: string;
    businessEmail: string;
    businessPhone?: string;
    businessType: Vendor['businessType'];
    businessCategories?: string[];
    contactPerson: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      title?: string;
    };
    businessAddress?: any;
    website?: string;
    description?: string;
  }): Promise<APIResponse<Vendor>> => {
    const response = await apiClient.post<APIResponse<Vendor>>('/api/v1/vendors/register', data);
    return response.data;
  },

  // Get current vendor profile
  getProfile: async (): Promise<APIResponse<Vendor>> => {
    const response = await apiClient.get<APIResponse<Vendor>>('/api/v1/vendors/profile');
    return response.data;
  },

  // Update vendor profile
  updateProfile: async (data: {
    businessName?: string;
    legalName?: string;
    tradeName?: string;
    businessPhone?: string;
    website?: string;
    description?: string;
    businessCategories?: string[];
    serviceCategories?: string[];
    industryVerticals?: string[];
    businessAddress?: any;
    billingAddress?: any;
    shippingAddress?: any;
    operatingHours?: any;
    languages?: string[];
    acceptedCurrencies?: string[];
    capabilities?: any;
    certifications?: any;
    complianceStandards?: any;
    geographicCoverage?: string[];
    supportChannels?: any;
    tags?: string[];
  }): Promise<APIResponse<Vendor>> => {
    const response = await apiClient.patch<APIResponse<Vendor>>('/api/v1/vendors/profile', data);
    return response.data;
  },

  // Complete onboarding step
  completeOnboardingStep: async (step: string, data?: any): Promise<APIResponse<Vendor>> => {
    const response = await apiClient.post<APIResponse<Vendor>>(`/api/v1/vendors/onboarding/${step}`, data);
    return response.data;
  },

  // Submit vendor for approval
  submitForApproval: async (): Promise<APIResponse<Vendor>> => {
    const response = await apiClient.post<APIResponse<Vendor>>('/api/v1/vendors/submit-approval');
    return response.data;
  },

  // ========================================
  // Document Management
  // ========================================

  documents: {
    // List vendor documents
    list: async (filters?: {
      documentType?: string[];
      status?: string[];
      isRequired?: boolean;
      isExpiring?: boolean;
    }): Promise<APIResponse<VendorDocument[]>> => {
      const response = await apiClient.get<APIResponse<VendorDocument[]>>('/api/v1/vendors/documents', {
        params: filters,
      });
      return response.data;
    },

    // Upload document
    upload: async (data: {
      file: File;
      documentType: VendorDocument['documentType'];
      documentName: string;
      description?: string;
      issueDate?: Date;
      expirationDate?: Date;
      issueingAuthority?: string;
      documentNumber?: string;
    }): Promise<APIResponse<VendorDocument>> => {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('documentType', data.documentType);
      formData.append('documentName', data.documentName);
      if (data.description) formData.append('description', data.description);
      if (data.issueDate) formData.append('issueDate', data.issueDate.toISOString());
      if (data.expirationDate) formData.append('expirationDate', data.expirationDate.toISOString());
      if (data.issueingAuthority) formData.append('issueingAuthority', data.issueingAuthority);
      if (data.documentNumber) formData.append('documentNumber', data.documentNumber);

      const response = await apiClient.post<APIResponse<VendorDocument>>('/api/v1/vendors/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // Update document
    update: async (documentId: string, data: {
      documentName?: string;
      description?: string;
      issueDate?: Date;
      expirationDate?: Date;
      issueingAuthority?: string;
      documentNumber?: string;
    }): Promise<APIResponse<VendorDocument>> => {
      const response = await apiClient.patch<APIResponse<VendorDocument>>(`/api/v1/vendors/documents/${documentId}`, {
        ...data,
        issueDate: data.issueDate?.toISOString(),
        expirationDate: data.expirationDate?.toISOString(),
      });
      return response.data;
    },

    // Download document
    download: async (documentId: string): Promise<Blob> => {
      const response = await apiClient.get(`/api/v1/vendors/documents/${documentId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    },

    // Delete document
    delete: async (documentId: string): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.delete<APIResponse<{ success: boolean }>>(`/api/v1/vendors/documents/${documentId}`);
      return response.data;
    },

    // Get expiring documents
    getExpiring: async (days: number = 30): Promise<APIResponse<VendorDocument[]>> => {
      const response = await apiClient.get<APIResponse<VendorDocument[]>>(`/api/v1/vendors/documents/expiring`, {
        params: { days },
      });
      return response.data;
    },
  },

  // ========================================
  // Contact Management
  // ========================================

  contacts: {
    // List contacts
    list: async (): Promise<APIResponse<VendorContact[]>> => {
      const response = await apiClient.get<APIResponse<VendorContact[]>>('/api/v1/vendors/contacts');
      return response.data;
    },

    // Add contact
    add: async (data: {
      contactType: VendorContact['contactType'];
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      mobile?: string;
      title?: string;
      department?: string;
      isPrimary?: boolean;
      responsibilities?: string[];
      availabilitySchedule?: any;
      preferredContactMethods?: string[];
      notes?: string;
    }): Promise<APIResponse<VendorContact>> => {
      const response = await apiClient.post<APIResponse<VendorContact>>('/api/v1/vendors/contacts', data);
      return response.data;
    },

    // Update contact
    update: async (contactId: string, data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      mobile?: string;
      title?: string;
      department?: string;
      isPrimary?: boolean;
      isActive?: boolean;
      responsibilities?: string[];
      availabilitySchedule?: any;
      preferredContactMethods?: string[];
      notes?: string;
    }): Promise<APIResponse<VendorContact>> => {
      const response = await apiClient.patch<APIResponse<VendorContact>>(`/api/v1/vendors/contacts/${contactId}`, data);
      return response.data;
    },

    // Delete contact
    delete: async (contactId: string): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.delete<APIResponse<{ success: boolean }>>(`/api/v1/vendors/contacts/${contactId}`);
      return response.data;
    },

    // Set primary contact
    setPrimary: async (contactId: string, contactType: VendorContact['contactType']): Promise<APIResponse<VendorContact>> => {
      const response = await apiClient.patch<APIResponse<VendorContact>>(`/api/v1/vendors/contacts/${contactId}/set-primary`, {
        contactType,
      });
      return response.data;
    },
  },

  // ========================================
  // Performance & Analytics
  // ========================================

  performance: {
    // Get performance summary
    getSummary: async (period?: {
      dateFrom?: Date;
      dateTo?: Date;
      metricPeriod?: VendorPerformance['metricPeriod'];
    }): Promise<APIResponse<{
      overall: {
        performanceRating: number;
        totalOrders: number;
        totalRevenue: number;
        onTimeDeliveryRate: number;
        qualityScore: number;
        customerSatisfactionScore: number;
        disputeCount: number;
      };
      trends: {
        period: string;
        ordersCompleted: number;
        revenue: number;
        onTimeRate: number;
        qualityScore: number;
      }[];
      benchmarks: {
        industryAverage: number;
        topPerformers: number;
        ranking: number;
      };
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('/api/v1/vendors/performance/summary', {
        params: {
          ...period,
          dateFrom: period?.dateFrom?.toISOString(),
          dateTo: period?.dateTo?.toISOString(),
        },
      });
      return response.data;
    },

    // Get detailed performance metrics
    getMetrics: async (filters?: {
      dateFrom?: Date;
      dateTo?: Date;
      metricPeriod?: VendorPerformance['metricPeriod'];
    }): Promise<PaginatedResponse<VendorPerformance>> => {
      const response = await apiClient.get<APIResponse<PaginatedResponse<VendorPerformance>>>('/api/v1/vendors/performance/metrics', {
        params: {
          ...filters,
          dateFrom: filters?.dateFrom?.toISOString(),
          dateTo: filters?.dateTo?.toISOString(),
        },
      });
      return response.data.data;
    },

    // Get performance dashboard
    getDashboard: async (): Promise<APIResponse<{
      kpis: {
        label: string;
        value: number;
        unit: string;
        trend: 'up' | 'down' | 'stable';
        trendPercentage: number;
      }[];
      charts: {
        orderTrends: any[];
        revenueTrends: any[];
        qualityMetrics: any[];
        customerSatisfaction: any[];
      };
      alerts: Array<{
        type: 'warning' | 'danger' | 'info';
        message: string;
        action?: string;
      }>;
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('/api/v1/vendors/performance/dashboard');
      return response.data;
    },

    // Export performance report
    exportReport: async (format: 'pdf' | 'excel' | 'csv', filters?: {
      dateFrom?: Date;
      dateTo?: Date;
      includeCharts?: boolean;
    }): Promise<Blob> => {
      const response = await apiClient.post('/api/v1/vendors/performance/export', {
        format,
        ...filters,
        dateFrom: filters?.dateFrom?.toISOString(),
        dateTo: filters?.dateTo?.toISOString(),
      }, {
        responseType: 'blob',
      });
      return response.data;
    },
  },

  // ========================================
  // Contract Management
  // ========================================

  contracts: {
    // List contracts
    list: async (filters?: {
      contractType?: string[];
      status?: string[];
      isExpiring?: boolean;
    }): Promise<APIResponse<VendorContract[]>> => {
      const response = await apiClient.get<APIResponse<VendorContract[]>>('/api/v1/vendors/contracts', {
        params: filters,
      });
      return response.data;
    },

    // Get contract by ID
    getById: async (contractId: string): Promise<APIResponse<VendorContract>> => {
      const response = await apiClient.get<APIResponse<VendorContract>>(`/api/v1/vendors/contracts/${contractId}`);
      return response.data;
    },

    // Update contract
    update: async (contractId: string, data: {
      title?: string;
      description?: string;
      terms?: any;
      pricing?: any;
      slaTerms?: any;
      paymentTerms?: any;
      notes?: string;
    }): Promise<APIResponse<VendorContract>> => {
      const response = await apiClient.patch<APIResponse<VendorContract>>(`/api/v1/vendors/contracts/${contractId}`, data);
      return response.data;
    },

    // Download contract document
    download: async (contractId: string): Promise<Blob> => {
      const response = await apiClient.get(`/api/v1/vendors/contracts/${contractId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    },

    // Get expiring contracts
    getExpiring: async (days: number = 30): Promise<APIResponse<VendorContract[]>> => {
      const response = await apiClient.get<APIResponse<VendorContract[]>>('/api/v1/vendors/contracts/expiring', {
        params: { days },
      });
      return response.data;
    },
  },

  // ========================================
  // Reviews & Ratings
  // ========================================

  reviews: {
    // Get vendor reviews
    list: async (filters?: {
      rating?: number[];
      isVerified?: boolean;
      isPublic?: boolean;
      dateFrom?: Date;
      dateTo?: Date;
      page?: number;
      limit?: number;
    }): Promise<PaginatedResponse<VendorReview>> => {
      const response = await apiClient.get<APIResponse<PaginatedResponse<VendorReview>>>('/api/v1/vendors/reviews', {
        params: {
          ...filters,
          dateFrom: filters?.dateFrom?.toISOString(),
          dateTo: filters?.dateTo?.toISOString(),
        },
      });
      return response.data.data;
    },

    // Respond to review
    respond: async (reviewId: string, response: string): Promise<APIResponse<VendorReview>> => {
      const responseData = await apiClient.patch<APIResponse<VendorReview>>(`/api/v1/vendors/reviews/${reviewId}/respond`, {
        response,
      });
      return responseData.data;
    },

    // Get review statistics
    getStats: async (): Promise<APIResponse<{
      averageRating: number;
      totalReviews: number;
      ratingDistribution: Record<number, number>;
      recentTrends: Array<{
        period: string;
        averageRating: number;
        reviewCount: number;
      }>;
      criteriaBreakdown: Record<string, number>;
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('/api/v1/vendors/reviews/stats');
      return response.data;
    },
  },

  // ========================================
  // Financial & Business Operations
  // ========================================

  financials: {
    // Get financial summary
    getSummary: async (period?: {
      dateFrom?: Date;
      dateTo?: Date;
    }): Promise<APIResponse<{
      revenue: {
        total: number;
        growth: number;
        recurring: number;
        oneTime: number;
      };
      commissions: {
        total: number;
        pending: number;
        paid: number;
      };
      payouts: {
        scheduled: number;
        completed: number;
        pending: number;
      };
      metrics: {
        averageOrderValue: number;
        conversionRate: number;
        customerLifetimeValue: number;
      };
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('/api/v1/vendors/financials/summary', {
        params: {
          ...period,
          dateFrom: period?.dateFrom?.toISOString(),
          dateTo: period?.dateTo?.toISOString(),
        },
      });
      return response.data;
    },

    // Update financial information
    updateInfo: async (data: {
      annualRevenue?: number;
      companySize?: Vendor['companySize'];
      employeeCount?: number;
      creditLimit?: number;
      defaultPaymentTerms?: Vendor['defaultPaymentTerms'];
      bankAccountDetails?: any;
      taxInformation?: any;
    }): Promise<APIResponse<Vendor>> => {
      const response = await apiClient.patch<APIResponse<Vendor>>('/api/v1/vendors/financials', data);
      return response.data;
    },

    // Request credit limit increase
    requestCreditIncrease: async (data: {
      requestedLimit: number;
      justification: string;
      supportingDocuments?: string[];
    }): Promise<APIResponse<{
      requestId: string;
      status: 'pending' | 'approved' | 'rejected';
    }>> => {
      const response = await apiClient.post<APIResponse<any>>('/api/v1/vendors/financials/credit-increase', data);
      return response.data;
    },
  },

  // ========================================
  // Integration & Automation
  // ========================================

  integrations: {
    // Get integration settings
    getSettings: async (): Promise<APIResponse<{
      apiEnabled: boolean;
      webhookUrl?: string;
      connectedSystems: string[];
      automationRules: any;
      apiKeys: Array<{
        keyId: string;
        name: string;
        permissions: string[];
        lastUsed?: Date;
        isActive: boolean;
      }>;
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('/api/v1/vendors/integrations/settings');
      return response.data;
    },

    // Update integration settings
    updateSettings: async (data: {
      webhookUrl?: string;
      automationRules?: any;
    }): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.patch<APIResponse<{ success: boolean }>>('/api/v1/vendors/integrations/settings', data);
      return response.data;
    },

    // Generate API key
    generateApiKey: async (data: {
      name: string;
      permissions: string[];
      expiresAt?: Date;
    }): Promise<APIResponse<{
      keyId: string;
      apiKey: string;
      permissions: string[];
    }>> => {
      const response = await apiClient.post<APIResponse<any>>('/api/v1/vendors/integrations/api-keys', {
        ...data,
        expiresAt: data.expiresAt?.toISOString(),
      });
      return response.data;
    },

    // Revoke API key
    revokeApiKey: async (keyId: string): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.delete<APIResponse<{ success: boolean }>>(`/api/v1/vendors/integrations/api-keys/${keyId}`);
      return response.data;
    },

    // Test webhook
    testWebhook: async (): Promise<APIResponse<{
      success: boolean;
      responseTime: number;
      statusCode?: number;
      error?: string;
    }>> => {
      const response = await apiClient.post<APIResponse<any>>('/api/v1/vendors/integrations/test-webhook');
      return response.data;
    },
  },

  // ========================================
  // Compliance & Risk Management
  // ========================================

  compliance: {
    // Get compliance status
    getStatus: async (): Promise<APIResponse<{
      overallScore: number;
      requirements: Array<{
        category: string;
        status: 'compliant' | 'non_compliant' | 'pending';
        lastChecked: Date;
        expirationDate?: Date;
        documents: string[];
      }>;
      riskLevel: Vendor['riskLevel'];
      riskFactors: any;
      lastAssessment: Date;
      nextAssessment: Date;
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('/api/v1/vendors/compliance/status');
      return response.data;
    },

    // Submit compliance declaration
    submitDeclaration: async (data: {
      category: string;
      declaration: any;
      supportingDocuments?: string[];
    }): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.post<APIResponse<{ success: boolean }>>('/api/v1/vendors/compliance/declarations', data);
      return response.data;
    },

    // Request compliance review
    requestReview: async (reason?: string): Promise<APIResponse<{
      reviewId: string;
      estimatedCompletionDate: Date;
    }>> => {
      const response = await apiClient.post<APIResponse<any>>('/api/v1/vendors/compliance/request-review', {
        reason,
      });
      return response.data;
    },
  },

  // ========================================
  // Public Vendor Directory
  // ========================================

  directory: {
    // Search vendors (public)
    search: async (filters: {
      searchTerm?: string;
      businessCategories?: string[];
      serviceCategories?: string[];
      industryVerticals?: string[];
      geographicCoverage?: string[];
      minRating?: number;
      hasPreferredStatus?: boolean;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }): Promise<PaginatedResponse<Vendor>> => {
      const response = await apiClient.get<APIResponse<PaginatedResponse<Vendor>>>('/api/v1/vendors/directory/search', {
        params: filters,
      });
      return response.data.data;
    },

    // Get vendor details (public)
    getDetails: async (vendorId: string): Promise<APIResponse<Vendor & {
      publicProfile: any;
      services: any[];
      products: any[];
      reviews: VendorReview[];
    }>> => {
      const response = await apiClient.get<APIResponse<any>>(`/api/v1/vendors/directory/${vendorId}`);
      return response.data;
    },

    // Get featured vendors
    getFeatured: async (): Promise<APIResponse<Vendor[]>> => {
      const response = await apiClient.get<APIResponse<Vendor[]>>('/api/v1/vendors/directory/featured');
      return response.data;
    },

    // Get vendor categories
    getCategories: async (): Promise<APIResponse<{
      businessCategories: Array<{ name: string; count: number }>;
      serviceCategories: Array<{ name: string; count: number }>;
      industryVerticals: Array<{ name: string; count: number }>;
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('/api/v1/vendors/directory/categories');
      return response.data;
    },
  },

  // ========================================
  // Utility Functions
  // ========================================

  // Upload logo
  uploadLogo: async (file: File): Promise<APIResponse<{ logoUrl: string }>> => {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await apiClient.post<APIResponse<any>>('/api/v1/vendors/upload/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Upload banner
  uploadBanner: async (file: File): Promise<APIResponse<{ bannerUrl: string }>> => {
    const formData = new FormData();
    formData.append('banner', file);

    const response = await apiClient.post<APIResponse<any>>('/api/v1/vendors/upload/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Toggle vendor status (admin only)
  toggleStatus: async (vendorId: string, status: Vendor['status']): Promise<APIResponse<Vendor>> => {
    const response = await apiClient.patch<APIResponse<Vendor>>(`/api/v1/admin/vendors/${vendorId}/status`, {
      status,
    });
    return response.data;
  },

  // Verify vendor (admin only)
  verify: async (vendorId: string, data: {
    verificationNotes?: string;
    conditionalApproval?: boolean;
    conditions?: string[];
  }): Promise<APIResponse<Vendor>> => {
    const response = await apiClient.post<APIResponse<Vendor>>(`/api/v1/admin/vendors/${vendorId}/verify`, data);
    return response.data;
  },

  // Reject vendor (admin only)
  reject: async (vendorId: string, data: {
    rejectionReason: string;
    blocklist?: boolean;
  }): Promise<APIResponse<Vendor>> => {
    const response = await apiClient.post<APIResponse<Vendor>>(`/api/v1/admin/vendors/${vendorId}/reject`, data);
    return response.data;
  },
};

export default vendorAPI;
