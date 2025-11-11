import apiClient from './client';

// Temporary frontend types until backend integration is complete
interface Customer {
  id: string;
  customerNumber: string;
  companyName: string;
  legalName?: string;
  tradeName?: string;
  primaryEmail: string;
  primaryPhone?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  industry?: string;
  subIndustry?: string;
  accountType: 'enterprise' | 'mid_market' | 'small_business' | 'startup' | 'individual';
  customerTier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  lifecycleStage: 'prospect' | 'lead' | 'opportunity' | 'customer' | 'champion' | 'inactive' | 'churned';
  businessRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  vatNumber?: string;
  incorporationDate?: Date;
  countryOfIncorporation?: string;
  status: 'active' | 'pending_approval' | 'suspended' | 'inactive' | 'blocked' | 'churned';
  verificationStatus: 'unverified' | 'email_verified' | 'phone_verified' | 'document_verified' | 'fully_verified';
  verificationData?: any;
  verificationDate?: Date;
  verifiedByUserId?: string;
  preferredCurrency: string;
  annualRevenue?: number;
  companySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  employeeCount?: number;
  creditLimit: number;
  currentBalance: number;
  availableCredit: number;
  paymentTerms: 'net_15' | 'net_30' | 'net_45' | 'net_60' | 'immediate' | 'custom';
  creditScore: number;
  parentCustomerId?: string;
  hasSubsidiaries: boolean;
  primaryAccountManagerId?: string;
  salesRepId?: string;
  supportRepId?: string;
  purchasingPreferences?: any;
  preferredVendors?: string[];
  approvalWorkflow?: any;
  autoApprovalLimit?: number;
  requiresPurchaseOrders: boolean;
  budgetLimits?: any;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  orderFrequency: number;
  lastOrderDate?: Date;
  lastLoginDate?: Date;
  loginCount: number;
  satisfactionScore: number;
  loyaltyPoints: number;
  lifetimeValue: number;
  churnProbability?: number;
  churnRiskAssessmentDate?: Date;
  referralCount: number;
  referralValue: number;
  communicationPreferences?: any;
  preferredContactMethods?: string[];
  timezone?: string;
  languages?: string[];
  supportTier: 'basic' | 'standard' | 'premium' | 'enterprise' | 'white_glove';
  hasDedicatedAccountManager: boolean;
  contractTerms?: any;
  complianceRequirements?: string[];
  dataPrivacySettings?: any;
  requiresDataResidency: boolean;
  allowedDataRegions?: string[];
  allowsMarketing: boolean;
  marketingSegments?: string[];
  campaignHistory?: any;
  leadSources?: string[];
  acquisitionDate?: Date;
  acquisitionCost?: number;
  hasAPIAccess: boolean;
  integrationSettings?: any;
  connectedSystems?: string[];
  customFields?: any;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors?: any;
  isHighValue: boolean;
  requiresBackgroundCheck: boolean;
  lastRiskAssessment?: Date;
  lastActivityAt?: Date;
  registrationDate: Date;
  suspensionDate?: Date;
  suspensionReason?: string;
  deactivationDate?: Date;
  deactivationReason?: string;
  tags?: string[];
  internalNotes?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerAddress {
  id: string;
  customerId: string;
  addressType: 'billing' | 'shipping' | 'office' | 'warehouse' | 'other';
  label: string;
  streetAddress: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  fax?: string;
  isDefault: boolean;
  isActive: boolean;
  coordinates?: any;
  deliveryInstructions?: string;
  businessHours?: any;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerContact {
  id: string;
  customerId: string;
  contactType: 'primary' | 'billing' | 'purchasing' | 'technical' | 'legal' | 'executive' | 'procurement';
  firstName: string;
  lastName: string;
  title?: string;
  department?: string;
  email: string;
  phone?: string;
  mobile?: string;
  isPrimary: boolean;
  isActive: boolean;
  hasSigningAuthority: boolean;
  approvalLimit?: number;
  responsibilities?: string[];
  availabilitySchedule?: any;
  preferredContactMethods?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerDocument {
  id: string;
  customerId: string;
  documentType: 'business_license' | 'tax_certificate' | 'insurance_certificate' | 'credit_application' | 'financial_statement' | 'purchase_order' | 'contract' | 'nda' | 'compliance_certificate' | 'other';
  documentName: string;
  description?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: 'uploaded' | 'under_review' | 'approved' | 'rejected' | 'expired';
  uploadedByUserId?: string;
  reviewedByUserId?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  expirationDate?: Date;
  isConfidential: boolean;
  accessPermissions?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerInteraction {
  id: string;
  customerId: string;
  userId: string;
  interactionType: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'negotiation' | 'complaint' | 'support' | 'follow_up' | 'other';
  direction: 'inbound' | 'outbound';
  subject: string;
  description: string;
  sentiment: 'cold' | 'warm' | 'hot' | 'positive' | 'negative' | 'neutral';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  interactionDate: Date;
  durationMinutes?: number;
  outcomes?: any;
  followUpTasks?: any;
  tags?: string[];
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerContract {
  id: string;
  customerId: string;
  contractNumber: string;
  contractType: 'master_agreement' | 'purchase_agreement' | 'service_agreement' | 'nda' | 'sla' | 'other';
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
  contractValue?: number;
  contractCurrency?: string;
  documentPath?: string;
  createdByUserId?: string;
  signedByContactId?: string;
  signedDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginatedResponse<T> { items: T[]; total: number; page: number; limit: number; hasNext: boolean; hasPrev: boolean; }
interface APIResponse<T> { success: boolean; data: T; message?: string; timestamp?: string; }

// Comprehensive B2B Enterprise Customer Management API
export const customerAPI = {
  // ========================================
  // Customer Profile Management
  // ========================================

  // Get current customer profile
  getProfile: async (includes?: {
    includeAddresses?: boolean;
    includeContacts?: boolean;
    includeContracts?: boolean;
    includeInteractions?: boolean;
  }): Promise<APIResponse<Customer & {
    addresses?: CustomerAddress[];
    contacts?: CustomerContact[];
    contracts?: CustomerContract[];
    recentInteractions?: CustomerInteraction[];
  }>> => {
    const response = await apiClient.get<APIResponse<any>>('//customers/profile', {
      params: includes,
    });
    return response.data;
  },

  // Update customer profile
  updateProfile: async (data: {
    companyName?: string;
    legalName?: string;
    tradeName?: string;
    primaryPhone?: string;
    website?: string;
    description?: string;
    industry?: string;
    subIndustry?: string;
    businessRegistrationNumber?: string;
    taxIdentificationNumber?: string;
    vatNumber?: string;
    incorporationDate?: Date;
    countryOfIncorporation?: string;
    annualRevenue?: number;
    companySize?: Customer['companySize'];
    employeeCount?: number;
    communicationPreferences?: any;
    preferredContactMethods?: string[];
    timezone?: string;
    languages?: string[];
    customFields?: any;
    tags?: string[];
  }): Promise<APIResponse<Customer>> => {
    const response = await apiClient.patch<APIResponse<Customer>>('//customers/profile', {
      ...data,
      incorporationDate: data.incorporationDate?.toISOString(),
    });
    return response.data;
  },

  // Upload company logo
  uploadLogo: async (file: File): Promise<APIResponse<{ logoUrl: string }>> => {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await apiClient.post<APIResponse<any>>('//customers/upload/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Get customer dashboard data
  getDashboard: async (): Promise<APIResponse<{
    summary: {
      totalSpent: number;
      totalOrders: number;
      averageOrderValue: number;
      loyaltyPoints: number;
      availableCredit: number;
      currentTier: string;
    };
    recentOrders: any[];
    upcomingRenewals: any[];
    openTickets: any[];
    notifications: any[];
    performanceMetrics: {
      spendingTrend: number;
      orderFrequency: number;
      satisfactionScore: number;
    };
  }>> => {
    const response = await apiClient.get<APIResponse<any>>('//customers/dashboard');
    return response.data;
  },

  // ========================================
  // Address Management
  // ========================================

  addresses: {
    // List addresses
    list: async (): Promise<APIResponse<CustomerAddress[]>> => {
      const response = await apiClient.get<APIResponse<CustomerAddress[]>>('//customers/addresses');
      return response.data;
    },

    // Add new address
    add: async (data: {
      addressType: CustomerAddress['addressType'];
      label: string;
      streetAddress: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone?: string;
      fax?: string;
      isDefault?: boolean;
      deliveryInstructions?: string;
      businessHours?: any;
      notes?: string;
    }): Promise<APIResponse<CustomerAddress>> => {
      const response = await apiClient.post<APIResponse<CustomerAddress>>('//customers/addresses', data);
      return response.data;
    },

    // Update address
    update: async (addressId: string, data: {
      label?: string;
      streetAddress?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
      phone?: string;
      fax?: string;
      deliveryInstructions?: string;
      businessHours?: any;
      notes?: string;
    }): Promise<APIResponse<CustomerAddress>> => {
      const response = await apiClient.patch<APIResponse<CustomerAddress>>(`//customers/addresses/${addressId}`, data);
      return response.data;
    },

    // Set default address
    setDefault: async (addressId: string, addressType: CustomerAddress['addressType']): Promise<APIResponse<CustomerAddress>> => {
      const response = await apiClient.patch<APIResponse<CustomerAddress>>(`//customers/addresses/${addressId}/set-default`, {
        addressType,
      });
      return response.data;
    },

    // Delete address
    delete: async (addressId: string): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.delete<APIResponse<{ success: boolean }>>(`//customers/addresses/${addressId}`);
      return response.data;
    },

    // Validate address
    validate: async (address: {
      streetAddress: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    }): Promise<APIResponse<{
      isValid: boolean;
      suggestedAddress?: any;
      validationMessages?: string[];
    }>> => {
      const response = await apiClient.post<APIResponse<any>>('//customers/addresses/validate', address);
      return response.data;
    },
  },

  // ========================================
  // Contact Management
  // ========================================

  contacts: {
    // List contacts
    list: async (): Promise<APIResponse<CustomerContact[]>> => {
      const response = await apiClient.get<APIResponse<CustomerContact[]>>('//customers/contacts');
      return response.data;
    },

    // Add new contact
    add: async (data: {
      contactType: CustomerContact['contactType'];
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      mobile?: string;
      title?: string;
      department?: string;
      isPrimary?: boolean;
      hasSigningAuthority?: boolean;
      approvalLimit?: number;
      responsibilities?: string[];
      availabilitySchedule?: any;
      preferredContactMethods?: string[];
      notes?: string;
    }): Promise<APIResponse<CustomerContact>> => {
      const response = await apiClient.post<APIResponse<CustomerContact>>('//customers/contacts', data);
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
      hasSigningAuthority?: boolean;
      approvalLimit?: number;
      responsibilities?: string[];
      availabilitySchedule?: any;
      preferredContactMethods?: string[];
      notes?: string;
    }): Promise<APIResponse<CustomerContact>> => {
      const response = await apiClient.patch<APIResponse<CustomerContact>>(`//customers/contacts/${contactId}`, data);
      return response.data;
    },

    // Set primary contact
    setPrimary: async (contactId: string, contactType: CustomerContact['contactType']): Promise<APIResponse<CustomerContact>> => {
      const response = await apiClient.patch<APIResponse<CustomerContact>>(`//customers/contacts/${contactId}/set-primary`, {
        contactType,
      });
      return response.data;
    },

    // Delete contact
    delete: async (contactId: string): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.delete<APIResponse<{ success: boolean }>>(`//customers/contacts/${contactId}`);
      return response.data;
    },
  },

  // ========================================
  // Document Management
  // ========================================

  documents: {
    // List documents
    list: async (filters?: {
      documentType?: string[];
      status?: string[];
      isExpiring?: boolean;
    }): Promise<APIResponse<CustomerDocument[]>> => {
      const response = await apiClient.get<APIResponse<CustomerDocument[]>>('//customers/documents', {
        params: filters,
      });
      return response.data;
    },

    // Upload document
    upload: async (data: {
      file: File;
      documentType: CustomerDocument['documentType'];
      documentName: string;
      description?: string;
      expirationDate?: Date;
      isConfidential?: boolean;
    }): Promise<APIResponse<CustomerDocument>> => {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('documentType', data.documentType);
      formData.append('documentName', data.documentName);
      if (data.description) formData.append('description', data.description);
      if (data.expirationDate) formData.append('expirationDate', data.expirationDate.toISOString());
      if (data.isConfidential) formData.append('isConfidential', String(data.isConfidential));

      const response = await apiClient.post<APIResponse<CustomerDocument>>('//customers/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // Download document
    download: async (documentId: string): Promise<Blob> => {
      const response = await apiClient.get(`//customers/documents/${documentId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    },

    // Update document
    update: async (documentId: string, data: {
      documentName?: string;
      description?: string;
      expirationDate?: Date;
      isConfidential?: boolean;
    }): Promise<APIResponse<CustomerDocument>> => {
      const response = await apiClient.patch<APIResponse<CustomerDocument>>(`//customers/documents/${documentId}`, {
        ...data,
        expirationDate: data.expirationDate?.toISOString(),
      });
      return response.data;
    },

    // Delete document
    delete: async (documentId: string): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.delete<APIResponse<{ success: boolean }>>(`//customers/documents/${documentId}`);
      return response.data;
    },

    // Get expiring documents
    getExpiring: async (days: number = 30): Promise<APIResponse<CustomerDocument[]>> => {
      const response = await apiClient.get<APIResponse<CustomerDocument[]>>('//customers/documents/expiring', {
        params: { days },
      });
      return response.data;
    },
  },

  // ========================================
  // Interaction & CRM
  // ========================================

  interactions: {
    // List interactions
    list: async (filters?: {
      interactionType?: string[];
      dateFrom?: Date;
      dateTo?: Date;
      userId?: string;
      tags?: string[];
      page?: number;
      limit?: number;
    }): Promise<PaginatedResponse<CustomerInteraction>> => {
      const response = await apiClient.get<APIResponse<PaginatedResponse<CustomerInteraction>>>('//customers/interactions', {
        params: {
          ...filters,
          dateFrom: filters?.dateFrom?.toISOString(),
          dateTo: filters?.dateTo?.toISOString(),
        },
      });
      return response.data.data;
    },

    // Log new interaction
    log: async (data: {
      interactionType: CustomerInteraction['interactionType'];
      direction: CustomerInteraction['direction'];
      subject: string;
      description: string;
      sentiment?: CustomerInteraction['sentiment'];
      interactionDate?: Date;
      durationMinutes?: number;
      outcomes?: any;
      followUpTasks?: any;
      tags?: string[];
      internalNotes?: string;
    }): Promise<APIResponse<CustomerInteraction>> => {
      const response = await apiClient.post<APIResponse<CustomerInteraction>>('//customers/interactions', {
        ...data,
        interactionDate: data.interactionDate?.toISOString() || new Date().toISOString(),
      });
      return response.data;
    },

    // Update interaction
    update: async (interactionId: string, data: {
      subject?: string;
      description?: string;
      sentiment?: CustomerInteraction['sentiment'];
      status?: CustomerInteraction['status'];
      durationMinutes?: number;
      outcomes?: any;
      followUpTasks?: any;
      tags?: string[];
      internalNotes?: string;
    }): Promise<APIResponse<CustomerInteraction>> => {
      const response = await apiClient.patch<APIResponse<CustomerInteraction>>(`//customers/interactions/${interactionId}`, data);
      return response.data;
    },

    // Get interaction analytics
    getAnalytics: async (period?: {
      dateFrom?: Date;
      dateTo?: Date;
    }): Promise<APIResponse<{
      totalInteractions: number;
      interactionsByType: Record<string, number>;
      sentimentBreakdown: Record<string, number>;
      averageResponseTime: number;
      followUpCompletion: number;
      trends: Array<{
        date: string;
        count: number;
        sentiment: number;
      }>;
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('//customers/interactions/analytics', {
        params: {
          dateFrom: period?.dateFrom?.toISOString(),
          dateTo: period?.dateTo?.toISOString(),
        },
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
    }): Promise<APIResponse<CustomerContract[]>> => {
      const response = await apiClient.get<APIResponse<CustomerContract[]>>('//customers/contracts', {
        params: filters,
      });
      return response.data;
    },

    // Get contract by ID
    getById: async (contractId: string): Promise<APIResponse<CustomerContract>> => {
      const response = await apiClient.get<APIResponse<CustomerContract>>(`//customers/contracts/${contractId}`);
      return response.data;
    },

    // Download contract document
    download: async (contractId: string): Promise<Blob> => {
      const response = await apiClient.get(`//customers/contracts/${contractId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    },

    // Request contract amendment
    requestAmendment: async (contractId: string, data: {
      amendmentType: string;
      description: string;
      requestedChanges: any;
      businessJustification: string;
    }): Promise<APIResponse<{
      requestId: string;
      status: 'pending' | 'approved' | 'rejected';
    }>> => {
      const response = await apiClient.post<APIResponse<any>>(`//customers/contracts/${contractId}/amendment-request`, data);
      return response.data;
    },

    // Get expiring contracts
    getExpiring: async (days: number = 30): Promise<APIResponse<CustomerContract[]>> => {
      const response = await apiClient.get<APIResponse<CustomerContract[]>>('//customers/contracts/expiring', {
        params: { days },
      });
      return response.data;
    },
  },

  // ========================================
  // Financial & Credit Management
  // ========================================

  financials: {
    // Get financial summary
    getSummary: async (): Promise<APIResponse<{
      creditLimit: number;
      currentBalance: number;
      availableCredit: number;
      creditScore: number;
      paymentTerms: string;
      outstandingInvoices: {
        total: number;
        overdue: number;
        upcoming: number;
      };
      spendingTrends: Array<{
        period: string;
        amount: number;
      }>;
      creditUtilization: number;
      paymentHistory: {
        onTimePercentage: number;
        averageDaysOverdue: number;
      };
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('//customers/financials/summary');
      return response.data;
    },

    // Request credit limit increase
    requestCreditIncrease: async (data: {
      requestedLimit: number;
      businessJustification: string;
      supportingDocuments?: string[];
      urgency?: 'normal' | 'urgent';
    }): Promise<APIResponse<{
      requestId: string;
      status: 'pending' | 'approved' | 'rejected';
      estimatedProcessingDays: number;
    }>> => {
      const response = await apiClient.post<APIResponse<any>>('//customers/financials/credit-increase', data);
      return response.data;
    },

    // Update payment preferences
    updatePaymentPreferences: async (data: {
      preferredCurrency?: string;
      paymentTerms?: Customer['paymentTerms'];
      autoPayEnabled?: boolean;
      invoiceDeliveryMethod?: 'email' | 'portal' | 'api';
      paymentMethodId?: string;
    }): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.patch<APIResponse<{ success: boolean }>>('//customers/financials/payment-preferences', data);
      return response.data;
    },

    // Get credit report
    getCreditReport: async (): Promise<APIResponse<{
      creditScore: number;
      creditHistory: any[];
      paymentBehavior: any;
      riskFactors: string[];
      recommendations: string[];
      lastUpdated: Date;
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('//customers/financials/credit-report');
      return response.data;
    },
  },

  // ========================================
  // Account Hierarchy & Relationships
  // ========================================

  hierarchy: {
    // Get account hierarchy
    getHierarchy: async (): Promise<APIResponse<{
      parentCustomer?: Customer;
      subsidiaries: Customer[];
      totalLocations: number;
      totalUsers: number;
      consolidatedSpending: number;
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('//customers/hierarchy');
      return response.data;
    },

    // Add subsidiary
    addSubsidiary: async (data: {
      companyName: string;
      primaryEmail: string;
      businessAddress: any;
      relationshipType: string;
      ownershipPercentage?: number;
    }): Promise<APIResponse<Customer>> => {
      const response = await apiClient.post<APIResponse<Customer>>('//customers/hierarchy/subsidiaries', data);
      return response.data;
    },

    // Update subsidiary relationship
    updateSubsidiary: async (subsidiaryId: string, data: {
      relationshipType?: string;
      ownershipPercentage?: number;
      isActive?: boolean;
    }): Promise<APIResponse<Customer>> => {
      const response = await apiClient.patch<APIResponse<Customer>>(`//customers/hierarchy/subsidiaries/${subsidiaryId}`, data);
      return response.data;
    },

    // Remove subsidiary
    removeSubsidiary: async (subsidiaryId: string): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.delete<APIResponse<{ success: boolean }>>(`//customers/hierarchy/subsidiaries/${subsidiaryId}`);
      return response.data;
    },
  },

  // ========================================
  // Loyalty & Engagement
  // ========================================

  loyalty: {
    // Get loyalty summary
    getSummary: async (): Promise<APIResponse<{
      currentPoints: number;
      currentTier: string;
      nextTier: string;
      pointsToNextTier: number;
      tierBenefits: any;
      pointsHistory: Array<{
        date: Date;
        points: number;
        reason: string;
        orderId?: string;
      }>;
      availableRewards: any[];
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('//customers/loyalty/summary');
      return response.data;
    },

    // Redeem points
    redeemPoints: async (data: {
      rewardId: string;
      pointsToRedeem: number;
      redemptionMethod?: 'discount' | 'credit' | 'gift';
    }): Promise<APIResponse<{
      redemptionId: string;
      pointsRedeemed: number;
      valueRedeemed: number;
      remainingPoints: number;
    }>> => {
      const response = await apiClient.post<APIResponse<any>>('//customers/loyalty/redeem', data);
      return response.data;
    },

    // Get referral information
    getReferrals: async (): Promise<APIResponse<{
      referralCode: string;
      referralLink: string;
      totalReferrals: number;
      successfulReferrals: number;
      referralRewards: number;
      pendingReferrals: any[];
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('//customers/loyalty/referrals');
      return response.data;
    },
  },

  // ========================================
  // Customer Analytics & Insights
  // ========================================

  analytics: {
    // Get customer insights
    getInsights: async (period?: {
      dateFrom?: Date;
      dateTo?: Date;
    }): Promise<APIResponse<{
      spendingAnalysis: {
        totalSpent: number;
        averageOrderValue: number;
        topCategories: Array<{ category: string; amount: number }>;
        seasonalTrends: any[];
      };
      behaviorAnalysis: {
        orderFrequency: number;
        averageTimeBetweenOrders: number;
        preferredVendors: Array<{ vendorId: string; orderCount: number }>;
        paymentPatterns: any;
      };
      healthScore: {
        overall: number;
        factors: Record<string, number>;
        riskIndicators: string[];
      };
      recommendations: Array<{
        type: string;
        priority: 'low' | 'medium' | 'high';
        description: string;
        action: string;
      }>;
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('//customers/analytics/insights', {
        params: {
          dateFrom: period?.dateFrom?.toISOString(),
          dateTo: period?.dateTo?.toISOString(),
        },
      });
      return response.data;
    },

    // Export customer data
    exportData: async (options: {
      format: 'csv' | 'excel' | 'pdf';
      includeOrders?: boolean;
      includeInteractions?: boolean;
      includeFinancials?: boolean;
      dateRange?: { from: Date; to: Date };
    }): Promise<Blob> => {
      const response = await apiClient.post('//customers/analytics/export', {
        ...options,
        dateRange: options.dateRange ? {
          from: options.dateRange.from.toISOString(),
          to: options.dateRange.to.toISOString(),
        } : undefined,
      }, {
        responseType: 'blob',
      });
      return response.data;
    },
  },

  // ========================================
  // Customer Directory (Admin Functions)
  // ========================================

  directory: {
    // Search customers (admin)
    search: async (filters: {
      searchTerm?: string;
      accountType?: string[];
      customerTier?: string[];
      status?: string[];
      industry?: string[];
      accountManagerId?: string;
      salesRepId?: string;
      minSpending?: number;
      maxSpending?: number;
      riskLevel?: string[];
      tags?: string[];
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }): Promise<PaginatedResponse<Customer>> => {
      const response = await apiClient.get<APIResponse<PaginatedResponse<Customer>>>('//admin/customers/search', {
        params: filters,
      });
      return response.data.data;
    },

    // Get customer details (admin)
    getDetails: async (customerId: string): Promise<APIResponse<Customer & {
      addresses: CustomerAddress[];
      contacts: CustomerContact[];
      recentOrders: any[];
      interactions: CustomerInteraction[];
      contracts: CustomerContract[];
      documents: CustomerDocument[];
    }>> => {
      const response = await apiClient.get<APIResponse<any>>(`//admin/customers/${customerId}`);
      return response.data;
    },

    // Update customer status (admin)
    updateStatus: async (customerId: string, data: {
      status: Customer['status'];
      reason?: string;
      notifyCustomer?: boolean;
    }): Promise<APIResponse<Customer>> => {
      const response = await apiClient.patch<APIResponse<Customer>>(`//admin/customers/${customerId}/status`, data);
      return response.data;
    },

    // Assign account manager (admin)
    assignAccountManager: async (customerId: string, accountManagerId: string): Promise<APIResponse<Customer>> => {
      const response = await apiClient.patch<APIResponse<Customer>>(`//admin/customers/${customerId}/assign-manager`, {
        accountManagerId,
      });
      return response.data;
    },

    // Update customer tier (admin)
    updateTier: async (customerId: string, data: {
      customerTier: Customer['customerTier'];
      reason: string;
      effectiveDate?: Date;
    }): Promise<APIResponse<Customer>> => {
      const response = await apiClient.patch<APIResponse<Customer>>(`//admin/customers/${customerId}/tier`, {
        ...data,
        effectiveDate: data.effectiveDate?.toISOString(),
      });
      return response.data;
    },
  },

  // ========================================
  // Compliance & Security
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
      dataPrivacyCompliance: {
        gdprCompliant: boolean;
        ccpaCompliant: boolean;
        dataRetentionPolicy: any;
      };
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('//customers/compliance/status');
      return response.data;
    },

    // Update privacy settings
    updatePrivacySettings: async (data: {
      allowsMarketing?: boolean;
      dataRetentionPreference?: string;
      cookiePreferences?: any;
      communicationPreferences?: any;
    }): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.patch<APIResponse<{ success: boolean }>>('//customers/compliance/privacy-settings', data);
      return response.data;
    },

    // Request data export (GDPR)
    requestDataExport: async (): Promise<APIResponse<{
      requestId: string;
      estimatedCompletionDate: Date;
      downloadUrl?: string;
    }>> => {
      const response = await apiClient.post<APIResponse<any>>('//customers/compliance/data-export');
      return response.data;
    },

    // Request account deletion (GDPR)
    requestAccountDeletion: async (reason: string): Promise<APIResponse<{
      requestId: string;
      scheduledDeletionDate: Date;
      cancellationDeadline: Date;
    }>> => {
      const response = await apiClient.post<APIResponse<any>>('//customers/compliance/account-deletion', {
        reason,
      });
      return response.data;
    },
  },
};

export default customerAPI;

// Export types for index.ts compatibility
export type { Customer };
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
export type UpdateProfileData = Partial<Customer>;
