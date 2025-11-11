import apiClient from './client';
// Import backend Service POJOs and DTOs for complete type safety
// Note: These will be uncommented once backend service entities are properly integrated
// import type {
//   ServiceEntity,
//   ServiceVariantEntity,
//   ServiceAddonEntity,
//   ServiceCategoryEntity,
//   ServiceReviewEntity,
//   ServiceQuoteEntity,
//   ServiceAnalyticsEntity,
//   ServiceComplianceAuditEntity,
// } from '../../types/backend/service';
// import type { 
//   VendorEntity,
//   CustomerEntity,
//   UserEntity,
//   OrderEntity,
// } from '../../types/backend';

// Temporary type definitions until backend integration is complete
interface ServiceEntity {
  id: string;
  name: string;
  slug: string;
  description: string;
  detailedDescription?: string;
  technicalSpecifications?: string;
  status: 'draft' | 'pending_approval' | 'active' | 'inactive' | 'suspended' | 'archived';
  isActive: boolean;
  isFeatured: boolean;
  isPromoted: boolean;
  vendorId: string;
  category: string;
  subCategory?: string;
  tags?: string[];
  keywords?: string[];
  industryVertical?: string;
  targetMarkets?: string[];
  pricingModel: 'fixed' | 'hourly' | 'project_based' | 'subscription' | 'tiered' | 'custom';
  basePrice: number;
  currency: string;
  pricingTiers?: any[];
  customPricingRules?: any[];
  deliveryMethod: 'remote' | 'onsite' | 'hybrid' | 'cloud_based';
  estimatedDeliveryDays?: number;
  deliverySchedule?: any;
  supportedTimeZones?: string[];
  supportedLanguages?: string[];
  maxConcurrentOrders?: number;
  availableSlots?: number;
  usedSlots?: number;
  allowOverbooking: boolean;
  capacitySchedule?: any[];
  customerRequirements?: any;
  dependencies?: any;
  complianceLevel: 'basic' | 'enhanced' | 'enterprise' | 'government';
  complianceCertifications?: string[];
  securityLevel: 'standard' | 'enhanced' | 'high' | 'top_secret';
  securityCertifications?: string[];
  dataHandling?: any;
  averageRating?: number;
  totalReviews: number;
  qualityMetrics?: any;
  slaTerms?: any;
  images?: string[];
  documents?: string[];
  videos?: string[];
  caseStudies?: string[];
  portfolioItems?: string[];
  downloadableResources?: any[];
  integrations?: any;
  contractTerms?: any;
  licensing?: any;
  performanceMetrics?: any;
  marketingMetrics?: any;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  lastModifiedReason?: string;
  approvedAt?: Date;
  approvedBy?: string;
}

interface ServiceVariantEntity {
  id: string;
  serviceId: string;
  name: string;
  description?: string;
  sku: string;
  priceModifier: number;
  priceModifierType: 'fixed' | 'percentage';
  features?: any;
  specifications?: any[];
  deliveryOptions?: any;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
  maxConcurrentOrders?: number;
  customizations?: any[];
  createdAt: Date;
  updatedAt: Date;
}

interface ServiceAddonEntity {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  billingType: 'one_time' | 'recurring' | 'per_use';
  requirementLevel: 'optional' | 'recommended' | 'required';
  applicableVariants?: string[];
  dependencies?: string[];
  exclusions?: string[];
  isActive: boolean;
  sortOrder: number;
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ServiceCategoryEntity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  level: number;
  sortOrder: number;
  icon?: string;
  image?: string;
  color?: string;
  isActive: boolean;
  isFeatured: boolean;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface ServiceReviewEntity {
  id: string;
  serviceId: string;
  customerId: string;
  orderId?: string;
  rating: number;
  title?: string;
  comment: string;
  detailedRatings?: any;
  images?: string[];
  isVerified: boolean;
  isAnonymous: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  moderationNotes?: string;
  moderatedBy?: string;
  moderatedAt?: Date;
  helpfulVotes: number;
  totalVotes: number;
  vendorResponse?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface ServiceQuoteEntity {
  id: string;
  serviceId: string;
  customerId: string;
  quoteNumber: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'revised';
  requirements: any;
  quotedItems: any[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  validUntil: Date;
  terms?: string;
  notes?: string;
  attachments?: string[];
  sentAt?: Date;
  viewedAt?: Date;
  respondedAt?: Date;
  revisionHistory?: any[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

interface ServiceAnalyticsEntity {
  id: string;
  serviceId: string;
  dateRange: Date;
  metricType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  metrics: any;
  demographicBreakdown?: any;
  performanceIndicators?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface ServiceComplianceAuditEntity {
  id: string;
  serviceId: string;
  auditType: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'remediation_required';
  scheduledDate: Date;
  completedDate?: Date;
  auditorId?: string;
  findings?: any[];
  complianceScore?: number;
  certifications?: any[];
  nextAuditDate?: Date;
  reportDocuments?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface VendorEntity {
  id: string;
  companyName: string;
  logo?: string;
  rating?: number;
  verificationStatus: string;
  businessType: string;
}

interface CustomerEntity {
  id: string;
  companyName: string;
  contactPerson: string;
}

interface UserEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface OrderEntity {
  id: string;
}

// Enhanced B2B Service Types for Enterprise Marketplace
export interface ServiceMarketplace extends Omit<ServiceEntity, 'vendor' | 'creator' | 'updater' | 'approver'> {
  vendor?: Pick<VendorEntity, 'id' | 'companyName' | 'logo' | 'rating' | 'verificationStatus' | 'businessType'>;
  creator?: Pick<UserEntity, 'id' | 'firstName' | 'lastName' | 'email'>;
  updater?: Pick<UserEntity, 'id' | 'firstName' | 'lastName' | 'email'>;
  approver?: Pick<UserEntity, 'id' | 'firstName' | 'lastName' | 'email'>;
}

export interface ServiceWithRelations extends ServiceMarketplace {
  variants?: ServiceVariantEntity[];
  addons?: ServiceAddonEntity[];
  reviews?: ServiceReviewEntity[];
  quotes?: ServiceQuoteEntity[];
  analytics?: ServiceAnalyticsEntity[];
  favoritedBy?: Pick<CustomerEntity, 'id' | 'companyName' | 'contactPerson'>[];
  complianceAudits?: ServiceComplianceAuditEntity[];
  relatedServices?: ServiceMarketplace[];
  competitorAnalysis?: ServiceCompetitorData[];
}

export interface ServiceCategoryWithServices extends ServiceCategoryEntity {
  serviceCount?: number;
  children?: ServiceCategoryWithServices[];
  averagePrice?: number;
  topVendors?: Pick<VendorEntity, 'id' | 'companyName' | 'rating'>[];
}

export interface ServiceMarketplaceFilters {
  // Basic filters
  category?: string;
  subCategory?: string;
  vendorId?: string;
  vendorIds?: string[];
  status?: ServiceEntity['status'];
  isActive?: boolean;
  isFeatured?: boolean;
  
  // Pricing filters
  minPrice?: number;
  maxPrice?: number;
  pricingModel?: ServiceEntity['pricingModel'];
  currency?: string;
  
  // Delivery filters
  deliveryMethod?: ServiceEntity['deliveryMethod'];
  maxDeliveryDays?: number;
  supportedTimeZones?: string[];
  supportedLanguages?: string[];
  
  // Capacity filters
  requiresAvailability?: boolean;
  minAvailableSlots?: number;
  deliveryDateFrom?: Date;
  deliveryDateTo?: Date;
  
  // Compliance filters
  complianceLevel?: ServiceEntity['complianceLevel'];
  securityLevel?: ServiceEntity['securityLevel'];
  requiredCertifications?: string[];
  
  // Quality filters
  minRating?: number;
  minReviews?: number;
  vendorVerificationRequired?: boolean;
  
  // Business filters
  industryVerticals?: string[];
  targetMarkets?: string[];
  tags?: string[];
  
  // Pagination
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  
  // Advanced filters
  searchTerm?: string;
  hasIntegrations?: boolean;
  hasCustomPricing?: boolean;
  allowsCustomization?: boolean;
  hasSlATerms?: boolean;
}

export interface CreateServiceData {
  // Basic Information
  name: string;
  description: string;
  detailedDescription?: string;
  technicalSpecifications?: string;
  category: string;
  subCategory?: string;
  tags?: string[];
  keywords?: string[];
  industryVertical?: string;
  targetMarkets?: string[];
  
  // Pricing
  pricingModel: ServiceEntity['pricingModel'];
  basePrice: number;
  currency?: string;
  pricingTiers?: ServiceEntity['pricingTiers'];
  customPricingRules?: ServiceEntity['customPricingRules'];
  
  // Delivery
  deliveryMethod: ServiceEntity['deliveryMethod'];
  estimatedDeliveryDays?: number;
  deliverySchedule?: ServiceEntity['deliverySchedule'];
  supportedTimeZones?: string[];
  supportedLanguages?: string[];
  
  // Capacity
  maxConcurrentOrders?: number;
  availableSlots?: number;
  allowOverbooking?: boolean;
  capacitySchedule?: ServiceEntity['capacitySchedule'];
  
  // Requirements
  customerRequirements?: ServiceEntity['customerRequirements'];
  dependencies?: ServiceEntity['dependencies'];
  
  // Compliance
  complianceLevel: ServiceEntity['complianceLevel'];
  complianceCertifications?: string[];
  securityLevel: ServiceEntity['securityLevel'];
  securityCertifications?: string[];
  dataHandling?: ServiceEntity['dataHandling'];
  
  // Quality
  slaTerms?: ServiceEntity['slaTerms'];
  
  // Media
  images?: string[];
  documents?: string[];
  videos?: string[];
  caseStudies?: string[];
  portfolioItems?: string[];
  downloadableResources?: ServiceEntity['downloadableResources'];
  
  // Integration
  integrations?: ServiceEntity['integrations'];
  
  // Business Terms
  contractTerms?: ServiceEntity['contractTerms'];
  licensing?: ServiceEntity['licensing'];
  
  // Variants and Add-ons
  variants?: Omit<ServiceVariantEntity, 'id' | 'serviceId' | 'service' | 'createdAt' | 'updatedAt'>[];
  addons?: Omit<ServiceAddonEntity, 'id' | 'serviceId' | 'service' | 'createdAt' | 'updatedAt'>[];
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  status?: ServiceEntity['status'];
  lastModifiedReason?: string;
}

export interface ServiceQuoteRequest {
  serviceId: string;
  variantIds?: string[];
  addonIds?: string[];
  requirements: {
    description: string;
    specifications?: any;
    timeline?: string;
    budget?: number;
    deliveryPreferences?: string[];
    customizations?: any[];
  };
  additionalNotes?: string;
}

export interface ServiceCompetitorData {
  competitorVendorId: string;
  competitorServiceId: string;
  competitorName: string;
  competitorPrice: number;
  competitorRating: number;
  competitorDeliveryTime: number;
  keyDifferentiators: string[];
  lastUpdated: Date;
}

export interface ServicePerformanceMetrics {
  views: number;
  inquiries: number;
  quotes: number;
  orders: number;
  revenue: number;
  conversionRate: number;
  averageOrderValue: number;
  customerSatisfaction: number;
  repeatCustomers: number;
  marketShare: number;
  competitivePosition: number;
  trendingScore: number;
}

// API Response wrappers for B2B Service Marketplace
export interface ServiceAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
  metadata?: {
    requestId?: string;
    processingTime?: number;
    apiVersion?: string;
    rateLimit?: {
      remaining: number;
      resetTime: Date;
    };
  };
}

export interface PaginatedServiceResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
    totalPages: number;
    filters?: Record<string, any>;
  };
  message?: string;
  metadata?: {
    aggregations?: Record<string, any>;
    facets?: Record<string, any[]>;
    suggestions?: string[];
  };
}

// Additional analytics and stats types
export interface ServiceMarketplaceStats {
  totalServices: number;
  activeServices: number;
  pendingApprovalServices: number;
  categoriesCount: number;
  vendorsCount: number;
  averageRating: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  conversionRate: number;
  topCategories: {
    category: string;
    serviceCount: number;
    revenue: number;
  }[];
  topVendors: {
    vendorId: string;
    vendorName: string;
    serviceCount: number;
    rating: number;
    revenue: number;
  }[];
}

// Comprehensive B2B Service Marketplace API for Enterprise Procurement
export const serviceMarketplaceAPI = {
  // ========================================
  // Core Service Management
  // ========================================

  // Create new service offering
  services: {
    create: async (data: CreateServiceData): Promise<ServiceAPIResponse<ServiceMarketplace>> => {
      const response = await apiClient.post<ServiceAPIResponse<ServiceMarketplace>>('/api/v1/services', data);
      return response.data;
    },

    // Get all services with advanced filtering
    getAll: async (filters?: ServiceMarketplaceFilters): Promise<PaginatedServiceResponse<ServiceMarketplace>> => {
      const response = await apiClient.get<PaginatedServiceResponse<ServiceMarketplace>>('/api/v1/services', {
        params: {
          ...filters,
          deliveryDateFrom: filters?.deliveryDateFrom?.toISOString(),
          deliveryDateTo: filters?.deliveryDateTo?.toISOString(),
        },
      });
      return response.data;
    },

    // Get service by ID with comprehensive details
    getById: async (id: string, includeDetails?: {
      includeVariants?: boolean;
      includeAddons?: boolean;
      includeReviews?: boolean;
      includeAnalytics?: boolean;
      includeCompetitorData?: boolean;
      includeComplianceData?: boolean;
      includeVendorDetails?: boolean;
    }): Promise<ServiceAPIResponse<ServiceWithRelations>> => {
      const response = await apiClient.get<ServiceAPIResponse<ServiceWithRelations>>(`/api/v1/services/${id}`, {
        params: includeDetails,
      });
      return response.data;
    },

    // Get service by slug
    getBySlug: async (slug: string): Promise<ServiceAPIResponse<ServiceMarketplace>> => {
      const response = await apiClient.get<ServiceAPIResponse<ServiceMarketplace>>(`/api/v1/services/slug/${slug}`);
      return response.data;
    },

    // Update service
    update: async (id: string, data: UpdateServiceData): Promise<ServiceAPIResponse<ServiceMarketplace>> => {
      const response = await apiClient.patch<ServiceAPIResponse<ServiceMarketplace>>(`/api/v1/services/${id}`, data);
      return response.data;
    },

    // Update service status
    updateStatus: async (id: string, status: ServiceEntity['status'], reason?: string): Promise<ServiceAPIResponse<ServiceMarketplace>> => {
      const response = await apiClient.patch<ServiceAPIResponse<ServiceMarketplace>>(`/api/v1/services/${id}/status`, { 
        status,
        lastModifiedReason: reason,
      });
      return response.data;
    },

    // Update service capacity
    updateCapacity: async (id: string, data: {
      maxConcurrentOrders?: number;
      availableSlots?: number;
      allowOverbooking?: boolean;
      capacitySchedule?: ServiceEntity['capacitySchedule'];
    }): Promise<ServiceAPIResponse<ServiceMarketplace>> => {
      const response = await apiClient.patch<ServiceAPIResponse<ServiceMarketplace>>(`/api/v1/services/${id}/capacity`, data);
      return response.data;
    },

    // Delete service (soft delete)
    delete: async (id: string, reason?: string): Promise<ServiceAPIResponse<void>> => {
      const response = await apiClient.delete<ServiceAPIResponse<void>>(`/api/v1/services/${id}`, {
        data: { reason },
      });
      return response.data;
    },

    // Archive service
    archive: async (id: string, reason: string): Promise<ServiceAPIResponse<ServiceMarketplace>> => {
      const response = await apiClient.post<ServiceAPIResponse<ServiceMarketplace>>(`/api/v1/services/${id}/archive`, { reason });
      return response.data;
    },

    // Duplicate service
    duplicate: async (id: string, modifications?: Partial<CreateServiceData>): Promise<ServiceAPIResponse<ServiceMarketplace>> => {
      const response = await apiClient.post<ServiceAPIResponse<ServiceMarketplace>>(`/api/v1/services/${id}/duplicate`, modifications);
      return response.data;
    },

    // Get featured services
    getFeatured: async (category?: string, limit: number = 10): Promise<ServiceAPIResponse<ServiceMarketplace[]>> => {
      const response = await apiClient.get<ServiceAPIResponse<ServiceMarketplace[]>>('/api/v1/services/featured', {
        params: { category, limit },
      });
      return response.data;
    },

    // Get recommended services based on customer profile
    getRecommended: async (filters?: {
      customerId?: string;
      industry?: string;
      budget?: number;
      previousOrders?: boolean;
      similarCompanies?: boolean;
      limit?: number;
    }): Promise<ServiceAPIResponse<{
      services: ServiceMarketplace[];
      recommendations: Array<{
        service: ServiceMarketplace;
        score: number;
        reasons: string[];
        matchingCriteria: string[];
      }>;
    }>> => {
      const response = await apiClient.get<ServiceAPIResponse<any>>('/api/v1/services/recommended', {
        params: filters,
      });
      return response.data;
    },

    // Get trending services
    getTrending: async (timeframe: 'day' | 'week' | 'month' = 'week', limit: number = 10): Promise<ServiceAPIResponse<Array<{
      service: ServiceMarketplace;
      trendingScore: number;
      growthRate: number;
      popularityIncrease: number;
    }>>> => {
      const response = await apiClient.get<ServiceAPIResponse<any>>('/api/v1/services/trending', {
        params: { timeframe, limit },
      });
      return response.data;
    },

    // Get services by vendor
    getByVendor: async (vendorId: string, filters?: ServiceMarketplaceFilters): Promise<PaginatedServiceResponse<ServiceMarketplace>> => {
      const response = await apiClient.get<PaginatedServiceResponse<ServiceMarketplace>>(`/api/v1/services/vendor/${vendorId}`, {
        params: filters,
      });
      return response.data;
    },

    // Search services with advanced capabilities
    search: async (options: {
      query?: string;
      filters?: ServiceMarketplaceFilters;
      fuzzySearch?: boolean;
      includeRecommendations?: boolean;
      boostPopular?: boolean;
      personalizeResults?: boolean;
      customerId?: string;
    }): Promise<ServiceAPIResponse<{
      services: ServiceMarketplace[];
      facets: Record<string, any[]>;
      suggestions: string[];
      totalResults: number;
      searchTime: number;
      recommendations?: ServiceMarketplace[];
    }>> => {
      const response = await apiClient.post<ServiceAPIResponse<any>>('/api/v1/services/search', options);
      return response.data;
    },

    // Get service availability
    getAvailability: async (serviceId: string, options?: {
      startDate?: Date;
      endDate?: Date;
      timeZone?: string;
      duration?: number;
    }): Promise<ServiceAPIResponse<{
      availableSlots: Array<{
        date: Date;
        availableCapacity: number;
        bookedCapacity: number;
        isAvailable: boolean;
        estimatedWaitTime?: number;
      }>;
      nextAvailableDate?: Date;
      isCurrentlyBookable: boolean;
      overbookingAllowed: boolean;
    }>> => {
      const response = await apiClient.get<ServiceAPIResponse<any>>(`/api/v1/services/${serviceId}/availability`, {
        params: {
          ...options,
          startDate: options?.startDate?.toISOString(),
          endDate: options?.endDate?.toISOString(),
        },
      });
      return response.data;
    },

    // Bulk operations
    bulkUpdate: async (updates: Array<{
      serviceId: string;
      data: UpdateServiceData;
    }>): Promise<ServiceAPIResponse<{
      updated: number;
      failed: number;
      errors: Array<{ serviceId: string; error: string }>;
    }>> => {
      const response = await apiClient.post<ServiceAPIResponse<any>>('/api/v1/services/bulk/update', { updates });
      return response.data;
    },

    bulkStatusUpdate: async (serviceIds: string[], status: ServiceEntity['status'], reason?: string): Promise<ServiceAPIResponse<{
      updated: number;
      failed: number;
      errors: Array<{ serviceId: string; error: string }>;
    }>> => {
      const response = await apiClient.post<ServiceAPIResponse<any>>('/api/v1/services/bulk/status', {
        serviceIds,
        status,
        reason,
      });
      return response.data;
    },

    // Import/Export services
    export: async (filters?: ServiceMarketplaceFilters, format: 'csv' | 'excel' | 'json' = 'csv'): Promise<Blob> => {
      const response = await apiClient.post('/api/v1/services/export', {
        filters,
        format,
      }, {
        responseType: 'blob',
      });
      return response.data;
    },

    import: async (file: File, options?: {
      skipValidation?: boolean;
      updateExisting?: boolean;
      dryRun?: boolean;
    }): Promise<ServiceAPIResponse<{
      imported: number;
      updated: number;
      errors: Array<{ row: number; error: string; data: any }>;
      warnings: Array<{ row: number; warning: string; data: any }>;
    }>> => {
      const formData = new FormData();
      formData.append('file', file);
      if (options) {
        formData.append('options', JSON.stringify(options));
      }

      const response = await apiClient.post<ServiceAPIResponse<any>>('/api/v1/services/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
  },

  // ========================================
  // Service Categories Management
  // ========================================
  categories: {
    getAll: async (includeStats?: boolean): Promise<ServiceAPIResponse<ServiceCategoryWithServices[]>> => {
      const response = await apiClient.get<ServiceAPIResponse<ServiceCategoryWithServices[]>>('/api/v1/service-categories', {
        params: { includeStats },
      });
      return response.data;
    },

    getById: async (id: string): Promise<ServiceAPIResponse<ServiceCategoryWithServices>> => {
      const response = await apiClient.get<ServiceAPIResponse<ServiceCategoryWithServices>>(`/api/v1/service-categories/${id}`);
      return response.data;
    },

    getHierarchy: async (): Promise<ServiceAPIResponse<ServiceCategoryWithServices[]>> => {
      const response = await apiClient.get<ServiceAPIResponse<ServiceCategoryWithServices[]>>('/api/v1/service-categories/hierarchy');
      return response.data;
    },

    create: async (data: Omit<ServiceCategoryEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceAPIResponse<ServiceCategoryEntity>> => {
      const response = await apiClient.post<ServiceAPIResponse<ServiceCategoryEntity>>('/api/v1/service-categories', data);
      return response.data;
    },

    update: async (id: string, data: Partial<ServiceCategoryEntity>): Promise<ServiceAPIResponse<ServiceCategoryEntity>> => {
      const response = await apiClient.patch<ServiceAPIResponse<ServiceCategoryEntity>>(`/api/v1/service-categories/${id}`, data);
      return response.data;
    },

    delete: async (id: string): Promise<ServiceAPIResponse<void>> => {
      const response = await apiClient.delete<ServiceAPIResponse<void>>(`/api/v1/service-categories/${id}`);
      return response.data;
    },

    getServices: async (categoryId: string, filters?: ServiceMarketplaceFilters): Promise<PaginatedServiceResponse<ServiceMarketplace>> => {
      const response = await apiClient.get<PaginatedServiceResponse<ServiceMarketplace>>(`/api/v1/service-categories/${categoryId}/services`, {
        params: filters,
      });
      return response.data;
    },

    getPopularCategories: async (limit: number = 10): Promise<ServiceAPIResponse<Array<{
      category: ServiceCategoryWithServices;
      serviceCount: number;
      totalRevenue: number;
      averageRating: number;
      growthRate: number;
    }>>> => {
      const response = await apiClient.get<ServiceAPIResponse<any>>('/api/v1/service-categories/popular', {
        params: { limit },
      });
      return response.data;
    },
  },

  // ========================================
  // Service Variants Management
  // ========================================
  variants: {
    getByService: async (serviceId: string): Promise<ServiceAPIResponse<ServiceVariantEntity[]>> => {
      const response = await apiClient.get<ServiceAPIResponse<ServiceVariantEntity[]>>(`/api/v1/services/${serviceId}/variants`);
      return response.data;
    },

    create: async (serviceId: string, data: Omit<ServiceVariantEntity, 'id' | 'serviceId' | 'service' | 'createdAt' | 'updatedAt'>): Promise<ServiceAPIResponse<ServiceVariantEntity>> => {
      const response = await apiClient.post<ServiceAPIResponse<ServiceVariantEntity>>(`/api/v1/services/${serviceId}/variants`, data);
      return response.data;
    },

    update: async (variantId: string, data: Partial<ServiceVariantEntity>): Promise<ServiceAPIResponse<ServiceVariantEntity>> => {
      const response = await apiClient.patch<ServiceAPIResponse<ServiceVariantEntity>>(`/api/v1/service-variants/${variantId}`, data);
      return response.data;
    },

    delete: async (variantId: string): Promise<ServiceAPIResponse<void>> => {
      const response = await apiClient.delete<ServiceAPIResponse<void>>(`/api/v1/service-variants/${variantId}`);
      return response.data;
    },

    bulkUpdate: async (serviceId: string, variants: Array<Partial<ServiceVariantEntity> & { id?: string }>): Promise<ServiceAPIResponse<ServiceVariantEntity[]>> => {
      const response = await apiClient.post<ServiceAPIResponse<ServiceVariantEntity[]>>(`/api/v1/services/${serviceId}/variants/bulk`, { variants });
      return response.data;
    },
  },

  // ========================================
  // Service Add-ons Management
  // ========================================
  addons: {
    getByService: async (serviceId: string, activeOnly: boolean = true): Promise<ServiceAPIResponse<ServiceAddonEntity[]>> => {
      const response = await apiClient.get<ServiceAPIResponse<ServiceAddonEntity[]>>(`/api/v1/services/${serviceId}/addons`, {
        params: { activeOnly },
      });
      return response.data;
    },

    create: async (serviceId: string, data: Omit<ServiceAddonEntity, 'id' | 'serviceId' | 'service' | 'createdAt' | 'updatedAt'>): Promise<ServiceAPIResponse<ServiceAddonEntity>> => {
      const response = await apiClient.post<ServiceAPIResponse<ServiceAddonEntity>>(`/api/v1/services/${serviceId}/addons`, data);
      return response.data;
    },

    update: async (addonId: string, data: Partial<ServiceAddonEntity>): Promise<ServiceAPIResponse<ServiceAddonEntity>> => {
      const response = await apiClient.patch<ServiceAPIResponse<ServiceAddonEntity>>(`/api/v1/service-addons/${addonId}`, data);
      return response.data;
    },

    delete: async (addonId: string): Promise<ServiceAPIResponse<void>> => {
      const response = await apiClient.delete<ServiceAPIResponse<void>>(`/api/v1/service-addons/${addonId}`);
      return response.data;
    },

    getCompatibleAddons: async (serviceId: string, variantIds?: string[]): Promise<ServiceAPIResponse<Array<{
      addon: ServiceAddonEntity;
      isRecommended: boolean;
      compatibilityReason: string;
    }>>> => {
      const response = await apiClient.get<ServiceAPIResponse<any>>(`/api/v1/services/${serviceId}/addons/compatible`, {
        params: { variantIds },
      });
      return response.data;
    },
  },

  // ========================================
  // Service Reviews Management
  // ========================================
  reviews: {
    getByService: async (serviceId: string, filters?: {
      page?: number;
      limit?: number;
      minRating?: number;
      maxRating?: number;
      verified?: boolean;
      sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful';
    }): Promise<PaginatedServiceResponse<ServiceReviewEntity>> => {
      const response = await apiClient.get<PaginatedServiceResponse<ServiceReviewEntity>>(`/api/v1/services/${serviceId}/reviews`, {
        params: filters,
      });
      return response.data;
    },

    create: async (serviceId: string, data: {
      rating: number;
      title?: string;
      comment: string;
      detailedRatings?: ServiceReviewEntity['detailedRatings'];
      images?: string[];
      isAnonymous?: boolean;
      orderId?: string;
    }): Promise<ServiceAPIResponse<ServiceReviewEntity>> => {
      const response = await apiClient.post<ServiceAPIResponse<ServiceReviewEntity>>(`/api/v1/services/${serviceId}/reviews`, data);
      return response.data;
    },

    update: async (reviewId: string, data: {
      rating?: number;
      title?: string;
      comment?: string;
      detailedRatings?: ServiceReviewEntity['detailedRatings'];
      images?: string[];
    }): Promise<ServiceAPIResponse<ServiceReviewEntity>> => {
      const response = await apiClient.patch<ServiceAPIResponse<ServiceReviewEntity>>(`/api/v1/service-reviews/${reviewId}`, data);
      return response.data;
    },

    delete: async (reviewId: string): Promise<ServiceAPIResponse<void>> => {
      const response = await apiClient.delete<ServiceAPIResponse<void>>(`/api/v1/service-reviews/${reviewId}`);
      return response.data;
    },

    addVote: async (reviewId: string, isHelpful: boolean): Promise<ServiceAPIResponse<ServiceReviewEntity>> => {
      const response = await apiClient.post<ServiceAPIResponse<ServiceReviewEntity>>(`/api/v1/service-reviews/${reviewId}/vote`, {
        isHelpful,
      });
      return response.data;
    },

    addVendorResponse: async (reviewId: string, response: string): Promise<ServiceAPIResponse<ServiceReviewEntity>> => {
      const responseData = await apiClient.post<ServiceAPIResponse<ServiceReviewEntity>>(`/api/v1/service-reviews/${reviewId}/vendor-response`, {
        response,
      });
      return responseData.data;
    },

    getReviewStats: async (serviceId: string): Promise<ServiceAPIResponse<{
      averageRating: number;
      totalReviews: number;
      ratingDistribution: Record<number, number>;
      detailedAverages: {
        communication: number;
        quality: number;
        timeliness: number;
        professionalism: number;
        valueForMoney: number;
      };
      verifiedReviewsPercentage: number;
      recentTrend: 'improving' | 'declining' | 'stable';
    }>> => {
      const response = await apiClient.get<ServiceAPIResponse<any>>(`/api/v1/services/${serviceId}/reviews/stats`);
      return response.data;
    },
  },

  // ========================================
  // Service Quotes Management
  // ========================================
  quotes: {
    request: async (data: ServiceQuoteRequest): Promise<ServiceAPIResponse<ServiceQuoteEntity>> => {
      const response = await apiClient.post<ServiceAPIResponse<ServiceQuoteEntity>>('/api/v1/service-quotes/request', data);
      return response.data;
    },

    getByService: async (serviceId: string, filters?: {
      status?: ServiceQuoteEntity['status'];
      page?: number;
      limit?: number;
    }): Promise<PaginatedServiceResponse<ServiceQuoteEntity>> => {
      const response = await apiClient.get<PaginatedServiceResponse<ServiceQuoteEntity>>(`/api/v1/services/${serviceId}/quotes`, {
        params: filters,
      });
      return response.data;
    },

    getById: async (quoteId: string): Promise<ServiceAPIResponse<ServiceQuoteEntity>> => {
      const response = await apiClient.get<ServiceAPIResponse<ServiceQuoteEntity>>(`/api/v1/service-quotes/${quoteId}`);
      return response.data;
    },

    update: async (quoteId: string, data: Partial<ServiceQuoteEntity>): Promise<ServiceAPIResponse<ServiceQuoteEntity>> => {
      const response = await apiClient.patch<ServiceAPIResponse<ServiceQuoteEntity>>(`/api/v1/service-quotes/${quoteId}`, data);
      return response.data;
    },

    accept: async (quoteId: string): Promise<ServiceAPIResponse<ServiceQuoteEntity>> => {
      const response = await apiClient.post<ServiceAPIResponse<ServiceQuoteEntity>>(`/api/v1/service-quotes/${quoteId}/accept`);
      return response.data;
    },

    reject: async (quoteId: string, reason?: string): Promise<ServiceAPIResponse<ServiceQuoteEntity>> => {
      const response = await apiClient.post<ServiceAPIResponse<ServiceQuoteEntity>>(`/api/v1/service-quotes/${quoteId}/reject`, {
        reason,
      });
      return response.data;
    },

    revise: async (quoteId: string, data: {
      quotedItems: ServiceQuoteEntity['quotedItems'];
      notes?: string;
    }): Promise<ServiceAPIResponse<ServiceQuoteEntity>> => {
      const response = await apiClient.post<ServiceAPIResponse<ServiceQuoteEntity>>(`/api/v1/service-quotes/${quoteId}/revise`, data);
      return response.data;
    },

    generatePdf: async (quoteId: string): Promise<Blob> => {
      const response = await apiClient.get(`/api/v1/service-quotes/${quoteId}/pdf`, {
        responseType: 'blob',
      });
      return response.data;
    },
  },

  // ========================================
  // Analytics and Performance
  // ========================================
  analytics: {
    getDashboard: async (): Promise<ServiceAPIResponse<{
      overview: ServiceMarketplaceStats;
      recentActivity: Array<{
        type: string;
        description: string;
        timestamp: Date;
        metadata?: any;
      }>;
      topPerformingServices: Array<{
        service: ServiceMarketplace;
        metrics: ServicePerformanceMetrics;
      }>;
      marketTrends: {
        categoryGrowth: Record<string, number>;
        pricingTrends: Record<string, number>;
        demandForecasts: Record<string, number>;
      };
      alerts: Array<{
        type: 'info' | 'warning' | 'error';
        message: string;
        serviceId?: string;
        timestamp: Date;
      }>;
    }>> => {
      const response = await apiClient.get<ServiceAPIResponse<any>>('/api/v1/analytics/dashboard');
      return response.data;
    },

    getServicePerformance: async (serviceId: string, timeframe?: '7d' | '30d' | '90d' | '1y'): Promise<ServiceAPIResponse<{
      metrics: ServicePerformanceMetrics;
      trends: Array<{
        date: Date;
        views: number;
        inquiries: number;
        orders: number;
        revenue: number;
      }>;
      competitorComparison: ServiceCompetitorData[];
      recommendations: Array<{
        type: 'pricing' | 'marketing' | 'features' | 'delivery';
        priority: 'low' | 'medium' | 'high';
        description: string;
        expectedImpact: string;
      }>;
    }>> => {
      const response = await apiClient.get<ServiceAPIResponse<any>>(`/api/v1/services/${serviceId}/analytics`, {
        params: { timeframe },
      });
      return response.data;
    },

    getMarketInsights: async (category?: string, timeframe?: string): Promise<ServiceAPIResponse<{
      marketSize: number;
      growthRate: number;
      competitorCount: number;
      averagePricing: number;
      demandTrends: Array<{
        month: string;
        demand: number;
        supply: number;
      }>;
      topVendors: Array<{
        vendorId: string;
        marketShare: number;
        revenue: number;
      }>;
      emergingTrends: string[];
      opportunities: Array<{
        description: string;
        potentialImpact: 'low' | 'medium' | 'high';
        timeToRealize: string;
      }>;
    }>> => {
      const response = await apiClient.get<ServiceAPIResponse<any>>('/api/v1/analytics/market-insights', {
        params: { category, timeframe },
      });
      return response.data;
    },

    generateReport: async (options: {
      type: 'service_performance' | 'market_analysis' | 'vendor_comparison' | 'custom';
      serviceIds?: string[];
      categories?: string[];
      dateFrom?: Date;
      dateTo?: Date;
      format?: 'pdf' | 'excel' | 'csv';
      includeCharts?: boolean;
      customMetrics?: string[];
    }): Promise<ServiceAPIResponse<{
      reportId: string;
      downloadUrl: string;
      expiresAt: Date;
    }>> => {
      const response = await apiClient.post<ServiceAPIResponse<any>>('/api/v1/analytics/generate-report', {
        ...options,
        dateFrom: options.dateFrom?.toISOString(),
        dateTo: options.dateTo?.toISOString(),
      });
      return response.data;
    },
  },

  // ========================================
  // Compliance and Security
  // ========================================
  compliance: {
    getAudits: async (serviceId: string, auditType?: string): Promise<ServiceAPIResponse<ServiceComplianceAuditEntity[]>> => {
      const response = await apiClient.get<ServiceAPIResponse<ServiceComplianceAuditEntity[]>>(`/api/v1/services/${serviceId}/compliance/audits`, {
        params: { auditType },
      });
      return response.data;
    },

    scheduleAudit: async (serviceId: string, data: {
      auditType: string;
      scheduledDate: Date;
      auditorId?: string;
      notes?: string;
    }): Promise<ServiceAPIResponse<ServiceComplianceAuditEntity>> => {
      const response = await apiClient.post<ServiceAPIResponse<ServiceComplianceAuditEntity>>(`/api/v1/services/${serviceId}/compliance/audits`, {
        ...data,
        scheduledDate: data.scheduledDate.toISOString(),
      });
      return response.data;
    },

    updateAuditStatus: async (auditId: string, data: {
      status: ServiceComplianceAuditEntity['status'];
      findings?: ServiceComplianceAuditEntity['findings'];
      complianceScore?: number;
      notes?: string;
    }): Promise<ServiceAPIResponse<ServiceComplianceAuditEntity>> => {
      const response = await apiClient.patch<ServiceAPIResponse<ServiceComplianceAuditEntity>>(`/api/v1/compliance-audits/${auditId}`, data);
      return response.data;
    },

    getCertifications: async (serviceId: string): Promise<ServiceAPIResponse<Array<{
      certification: string;
      issuer: string;
      issuedDate: Date;
      expiryDate: Date;
      certificateNumber: string;
      status: 'valid' | 'expired' | 'suspended' | 'revoked';
      documentUrl?: string;
    }>>> => {
      const response = await apiClient.get<ServiceAPIResponse<any>>(`/api/v1/services/${serviceId}/compliance/certifications`);
      return response.data;
    },

    uploadCertification: async (serviceId: string, data: {
      certification: string;
      issuer: string;
      issuedDate: Date;
      expiryDate: Date;
      certificateNumber: string;
      document: File;
    }): Promise<ServiceAPIResponse<any>> => {
      const formData = new FormData();
      formData.append('certification', data.certification);
      formData.append('issuer', data.issuer);
      formData.append('issuedDate', data.issuedDate.toISOString());
      formData.append('expiryDate', data.expiryDate.toISOString());
      formData.append('certificateNumber', data.certificateNumber);
      formData.append('document', data.document);

      const response = await apiClient.post<ServiceAPIResponse<any>>(`/api/v1/services/${serviceId}/compliance/certifications`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    getComplianceOverview: async (): Promise<ServiceAPIResponse<{
      totalServices: number;
      compliantServices: number;
      nonCompliantServices: number;
      pendingAudits: number;
      expiringCertifications: Array<{
        serviceId: string;
        serviceName: string;
        certification: string;
        expiryDate: Date;
        daysUntilExpiry: number;
      }>;
      complianceByCategory: Record<string, {
        total: number;
        compliant: number;
        percentage: number;
      }>;
    }>> => {
      const response = await apiClient.get<ServiceAPIResponse<any>>('/api/v1/compliance/overview');
      return response.data;
    },
  },

  // ========================================
  // Quick Actions and Utilities
  // ========================================
  utils: {
    validateServiceData: async (data: CreateServiceData | UpdateServiceData): Promise<ServiceAPIResponse<{
      isValid: boolean;
      errors: Array<{
        field: string;
        message: string;
        severity: 'error' | 'warning';
      }>;
      warnings: Array<{
        field: string;
        message: string;
        suggestion?: string;
      }>;
      suggestions: Array<{
        field: string;
        currentValue: any;
        suggestedValue: any;
        reason: string;
      }>;
    }>> => {
      const response = await apiClient.post<ServiceAPIResponse<any>>('/api/v1/services/validate', data);
      return response.data;
    },

    generateSlug: async (name: string): Promise<ServiceAPIResponse<{
      slug: string;
      isAvailable: boolean;
      alternatives?: string[];
    }>> => {
      const response = await apiClient.post<ServiceAPIResponse<any>>('/api/v1/services/generate-slug', { name });
      return response.data;
    },

    getSuggestions: async (partial: string, type: 'service' | 'category' | 'tag'): Promise<ServiceAPIResponse<string[]>> => {
      const response = await apiClient.get<ServiceAPIResponse<string[]>>('/api/v1/services/suggestions', {
        params: { partial, type },
      });
      return response.data;
    },

    getServiceTemplates: async (category?: string): Promise<ServiceAPIResponse<Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      template: Partial<CreateServiceData>;
      usageCount: number;
      rating: number;
    }>>> => {
      const response = await apiClient.get<ServiceAPIResponse<any>>('/api/v1/services/templates', {
        params: { category },
      });
      return response.data;
    },

    applyTemplate: async (templateId: string, customizations?: Partial<CreateServiceData>): Promise<ServiceAPIResponse<CreateServiceData>> => {
      const response = await apiClient.post<ServiceAPIResponse<CreateServiceData>>(`/api/v1/services/templates/${templateId}/apply`, customizations);
      return response.data;
    },
  },
};

// Legacy API for backward compatibility
export const productAPI = {
  createProduct: serviceMarketplaceAPI.services.create,
  getProducts: serviceMarketplaceAPI.services.getAll,
  getProductById: serviceMarketplaceAPI.services.getById,
  getProductBySlug: serviceMarketplaceAPI.services.getBySlug,
  updateProduct: serviceMarketplaceAPI.services.update,
  updateProductStatus: serviceMarketplaceAPI.services.updateStatus,
  updateProductStock: serviceMarketplaceAPI.services.updateCapacity,
  deleteProduct: serviceMarketplaceAPI.services.delete,
  getFeaturedProducts: serviceMarketplaceAPI.services.getFeatured,
  getRecommendedProducts: serviceMarketplaceAPI.services.getRecommended,
  getVendorProducts: serviceMarketplaceAPI.services.getByVendor,
  
  getCategories: serviceMarketplaceAPI.categories.getAll,
  getCategoryById: serviceMarketplaceAPI.categories.getById,
  createCategory: serviceMarketplaceAPI.categories.create,
  updateCategory: serviceMarketplaceAPI.categories.update,
  deleteCategory: serviceMarketplaceAPI.categories.delete,
  getCategoryHierarchy: serviceMarketplaceAPI.categories.getHierarchy,
  
  getBrands: () => serviceMarketplaceAPI.categories.getAll(),
  getBrandById: serviceMarketplaceAPI.categories.getById,
  createBrand: serviceMarketplaceAPI.categories.create,
  updateBrand: serviceMarketplaceAPI.categories.update,
  deleteBrand: serviceMarketplaceAPI.categories.delete,
  
  getProductReviews: serviceMarketplaceAPI.reviews.getByService,
  addProductReview: serviceMarketplaceAPI.reviews.create,
  updateProductReview: serviceMarketplaceAPI.reviews.update,
  deleteProductReview: serviceMarketplaceAPI.reviews.delete,
  
  getProductStats: serviceMarketplaceAPI.analytics.getDashboard,
  getLowStockProducts: (threshold: number = 10) => 
    serviceMarketplaceAPI.services.getAll({ minAvailableSlots: threshold }),
  searchProducts: (query: string, filters?: any) => 
    serviceMarketplaceAPI.services.search({ query, filters }),
};

export default serviceMarketplaceAPI;

// Re-export backend types for convenience
// Note: These will be available once backend types are properly set up
// export type {
//   ServiceEntity,
//   ServiceVariantEntity,
//   ServiceAddonEntity,
//   ServiceCategoryEntity,
//   ServiceReviewEntity,
//   ServiceQuoteEntity,
//   ServiceAnalyticsEntity,
//   ServiceComplianceAuditEntity,
// };

// Service marketplace types are already defined above and exported
// No need to re-export to avoid conflicts

// Re-export related APIs for enterprise service marketplace when available
// export { default as serviceReviewAPI } from './reviews';
// export { default as serviceWishlistAPI } from './wishlist';

// Placeholder exports to fix import errors
export const productReviewAPI = {
  getAll: async () => ({ data: [] }),
  getById: (id: string) => ({ data: null }),
  create: (data: any) => ({ success: true }),
  update: (id: string, data: any) => ({ success: true }),
  delete: (id: string) => ({ success: true }),
};

export const wishlistAPI = {
  getAll: async () => ({ data: [] }),
  add: (productId: string) => ({ success: true }),
  remove: (productId: string) => ({ success: true }),
  clear: () => ({ success: true }),
};