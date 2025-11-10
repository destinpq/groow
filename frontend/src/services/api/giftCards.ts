/**
 * Comprehensive B2B Gift Cards API Service
 * 
 * Handles enterprise gift card programs, corporate distributions, bulk purchasing,
 * and comprehensive gift card lifecycle management for B2B marketplace
 */

import api from './client';

// Backend Entity Types for Gift Card Management
type ServiceGiftCardEntity = {
  // Basic Information
  id: string;
  code: string;
  internalCode: string;
  batchId?: string;
  
  // Financial Information
  originalAmount: number;
  currentBalance: number;
  currency: string;
  exchangeRate?: number;
  
  // Status & Lifecycle
  status: 'active' | 'redeemed' | 'expired' | 'pending' | 'cancelled' | 'suspended' | 'transferred';
  activationDate?: Date;
  firstRedemptionDate?: Date;
  lastRedemptionDate?: Date;
  expiryDate: Date;
  autoExtendExpiry: boolean;
  
  // Purchase Information
  purchaseOrderId?: string;
  purchasedBy: string;
  purchasedByType: 'individual' | 'corporate' | 'admin';
  purchaseDate: Date;
  purchasePrice: number;
  
  // Recipient Information
  recipientId?: string;
  recipientEmail: string;
  recipientName?: string;
  recipientPhone?: string;
  recipientCompany?: string;
  recipientDepartment?: string;
  
  // Corporate/B2B Features
  corporateAccountId?: string;
  corporateProgramId?: string;
  employeeId?: string;
  projectCode?: string;
  costCenter?: string;
  budgetCode?: string;
  approverId?: string;
  approvalDate?: Date;
  
  // Design & Customization
  templateId?: string;
  customDesign?: {
    logoUrl?: string;
    backgroundImage?: string;
    backgroundColor?: string;
    textColor?: string;
    companyBranding?: boolean;
    customMessage?: string;
    terms?: string;
  };
  
  // Delivery & Communication
  deliveryMethod: 'email' | 'sms' | 'physical' | 'api' | 'portal' | 'bulk_download';
  deliveryStatus: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  deliveryDate?: Date;
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  scheduledDelivery?: Date;
  deliveryAttempts: number;
  lastDeliveryAttempt?: Date;
  
  // Personal Messages
  personalMessage?: string;
  corporateMessage?: string;
  termsAndConditions?: string;
  specialInstructions?: string;
  
  // Usage Restrictions
  restrictions: {
    serviceCategories?: string[];
    vendorIds?: string[];
    minimumOrder?: number;
    maximumRedemption?: number;
    usageLimit?: number;
    validDays?: string[];
    validHours?: { start: string; end: string };
    locationRestrictions?: string[];
    customerTiers?: string[];
  };
  
  // Analytics & Tracking
  viewCount: number;
  shareCount: number;
  redemptionAttempts: number;
  fraudFlags: string[];
  riskScore: number;
  
  // Integration & API
  externalId?: string;
  sourceSystem?: string;
  syncStatus: 'synced' | 'pending' | 'failed';
  lastSyncDate?: Date;
  
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
  version: number;
  
  // Relationships
  redemptions?: GiftCardRedemptionEntity[];
  activities?: GiftCardActivityEntity[];
  transfers?: GiftCardTransferEntity[];
  template?: GiftCardTemplateEntity;
  batch?: GiftCardBatchEntity;
  corporateProgram?: CorporateGiftProgramEntity;
};

type GiftCardTemplateEntity = {
  id: string;
  name: string;
  description: string;
  category: 'birthday' | 'holiday' | 'wedding' | 'graduation' | 'corporate' | 'employee_recognition' | 'client_appreciation' | 'promotional' | 'seasonal' | 'custom';
  
  design: {
    thumbnailUrl: string;
    previewUrl: string;
    highResUrl: string;
    backgroundImage?: string;
    overlayImage?: string;
    logoPlacement: 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right';
    textAreas: Array<{
      id: string;
      type: 'title' | 'amount' | 'message' | 'code' | 'terms';
      position: { x: number; y: number };
      size: { width: number; height: number };
      font: string;
      fontSize: number;
      color: string;
      alignment: 'left' | 'center' | 'right';
    }>;
    colorScheme: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
    };
  };
  
  isActive: boolean;
  isCustomizable: boolean;
  requiresApproval: boolean;
  
  allowedAmounts?: number[];
  minAmount?: number;
  maxAmount?: number;
  defaultAmount?: number;
  amountIncrement: number;
  
  isCorporateTemplate: boolean;
  corporateAccountIds?: string[];
  departmentRestrictions?: string[];
  approvalWorkflow?: {
    required: boolean;
    approverRoles: string[];
    escalationRules: Array<{
      condition: string;
      escalateTo: string;
      timeoutMinutes: number;
    }>;
  };
  
  allowCustomLogo: boolean;
  allowCustomMessage: boolean;
  allowCustomColors: boolean;
  brandingGuidelines?: string;
  complianceNotes?: string;
  
  usageCount: number;
  popularityScore: number;
  lastUsedDate?: Date;
  averageRating: number;
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
  version: number;
  
  giftCards?: ServiceGiftCardEntity[];
};

type GiftCardRedemptionEntity = {
  id: string;
  giftCardId: string;
  redemptionCode: string;
  
  orderId?: string;
  invoiceId?: string;
  serviceId?: string;
  vendorId?: string;
  amount: number;
  remainingBalance: number;
  
  description: string;
  notes?: string;
  redemptionMethod: 'web' | 'mobile' | 'api' | 'pos' | 'phone' | 'email';
  
  ipAddress?: string;
  userAgent?: string;
  location?: {
    country: string;
    region: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  deviceInfo?: {
    type: 'desktop' | 'mobile' | 'tablet' | 'api';
    platform: string;
    browser?: string;
  };
  
  verificationMethod: 'email' | 'sms' | 'none' | 'two_factor' | 'biometric';
  fraudScore: number;
  fraudFlags: string[];
  isVerified: boolean;
  verifiedAt?: Date;
  
  status: 'pending' | 'completed' | 'failed' | 'reversed' | 'disputed';
  processingTime: number;
  failureReason?: string;
  reversalReason?: string;
  
  employeeId?: string;
  departmentCode?: string;
  projectCode?: string;
  costCenter?: string;
  approvedBy?: string;
  approvalDate?: Date;
  
  redeemedAt: Date;
  redeemedBy: string;
  processedAt?: Date;
  processedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  
  giftCard?: ServiceGiftCardEntity;
  order?: any;
  service?: any;
  vendor?: any;
  activities?: GiftCardActivityEntity[];
};

type GiftCardActivityEntity = {
  id: string;
  giftCardId: string;
  redemptionId?: string;
  
  activityType: 'created' | 'activated' | 'redeemed' | 'transferred' | 'cancelled' | 'expired' | 'extended' | 'suspended' | 'reactivated' | 'resent' | 'viewed' | 'shared';
  description: string;
  details?: Record<string, any>;
  
  actorType: 'customer' | 'admin' | 'system' | 'vendor' | 'api';
  actorId?: string;
  actorName?: string;
  actorRole?: string;
  
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
  
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  changeReason?: string;
  
  systemSource: 'web' | 'mobile' | 'admin' | 'api' | 'batch' | 'scheduler';
  apiVersion?: string;
  
  timestamp: Date;
  createdAt: Date;
  
  giftCard?: ServiceGiftCardEntity;
  redemption?: GiftCardRedemptionEntity;
};

type GiftCardTransferEntity = {
  id: string;
  giftCardId: string;
  transferCode: string;
  
  fromUserId: string;
  fromUserEmail: string;
  fromUserName: string;
  toUserId?: string;
  toUserEmail: string;
  toUserName?: string;
  
  transferType: 'full' | 'partial';
  transferAmount?: number;
  remainingAmount?: number;
  
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'expired';
  initiatedAt: Date;
  completedAt?: Date;
  expiresAt: Date;
  
  transferMessage?: string;
  notificationsSent: string[];
  confirmationRequired: boolean;
  confirmationCode?: string;
  confirmedAt?: Date;
  
  verificationMethod: 'email' | 'sms' | 'none';
  isVerified: boolean;
  verifiedAt?: Date;
  securityQuestions?: Array<{
    question: string;
    answer: string;
  }>;
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  processedBy?: string;
  
  giftCard?: ServiceGiftCardEntity;
  activities?: GiftCardActivityEntity[];
};

type GiftCardBatchEntity = {
  id: string;
  batchNumber: string;
  name: string;
  description?: string;
  
  templateId: string;
  totalQuantity: number;
  generatedQuantity: number;
  failedQuantity: number;
  
  amounts: number[];
  totalValue: number;
  averageAmount: number;
  
  purchasedBy: string;
  corporateAccountId?: string;
  purchaseOrderNumber?: string;
  costCenter?: string;
  budgetCode?: string;
  
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  processingProgress: number;
  startedAt?: Date;
  completedAt?: Date;
  errorSummary?: string;
  
  deliveryMethod: 'email' | 'bulk_download' | 'api' | 'scheduled';
  deliveryStatus: 'pending' | 'sent' | 'completed' | 'failed';
  deliveryDate?: Date;
  scheduledDelivery?: Date;
  
  recipientList?: Array<{
    email: string;
    name?: string;
    amount?: number;
    customMessage?: string;
    employeeId?: string;
    department?: string;
    metadata?: Record<string, any>;
  }>;
  
  recipientFileUrl?: string;
  outputFileUrl?: string;
  downloadLinks: Array<{
    type: 'csv' | 'excel' | 'pdf' | 'zip';
    url: string;
    expiresAt: Date;
  }>;
  
  redemptionRate: number;
  totalRedemptionValue: number;
  averageRedemptionTime: number;
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  processedBy?: string;
  version: number;
  
  giftCards?: ServiceGiftCardEntity[];
  template?: GiftCardTemplateEntity;
  corporateProgram?: CorporateGiftProgramEntity;
};

type CorporateGiftProgramEntity = {
  id: string;
  name: string;
  description: string;
  programCode: string;
  
  corporateAccountId: string;
  corporateAccountName: string;
  departmentIds?: string[];
  contactPersonId: string;
  
  programType: 'employee_recognition' | 'client_appreciation' | 'seasonal_gifts' | 'milestone_rewards' | 'performance_bonus' | 'custom';
  isActive: boolean;
  autoApproval: boolean;
  requiresBudgetApproval: boolean;
  
  totalBudget?: number;
  usedBudget: number;
  remainingBudget?: number;
  monthlyBudget?: number;
  quarterlyBudget?: number;
  
  maxAmountPerGift: number;
  maxAmountPerEmployee: number;
  maxAmountPerMonth: number;
  maxQuantityPerOrder: number;
  
  allowedTemplates: string[];
  restrictedTemplates?: string[];
  customTemplatesAllowed: boolean;
  brandingRequired: boolean;
  
  approvalWorkflow: {
    enabled: boolean;
    rules: Array<{
      condition: string;
      requiredApprovers: string[];
      approvalLevel: number;
      timeoutHours: number;
      escalationRules?: Array<{
        condition: string;
        escalateTo: string;
        afterHours: number;
      }>;
    }>;
  };
  
  defaultDeliveryMethod: 'email' | 'portal' | 'bulk_download';
  deliverySchedule?: {
    frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
    time?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
  };
  
  reportingFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  reportRecipients: string[];
  includeUsageAnalytics: boolean;
  includeROIMetrics: boolean;
  
  totalGiftsIssued: number;
  totalValueIssued: number;
  redemptionRate: number;
  employeeParticipationRate: number;
  averageGiftValue: number;
  costPerParticipant: number;
  
  complianceNotes?: string;
  dataRetentionPeriod: number;
  auditRequired: boolean;
  lastAuditDate?: Date;
  nextAuditDate?: Date;
  
  startDate: Date;
  endDate?: Date;
  lastActivityDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
  version: number;
  
  giftCards?: ServiceGiftCardEntity[];
  batches?: GiftCardBatchEntity[];
  approvals?: GiftCardApprovalEntity[];
};

type GiftCardApprovalEntity = {
  id: string;
  giftCardId?: string;
  batchId?: string;
  corporateProgramId?: string;
  
  requestType: 'single_gift_card' | 'batch_purchase' | 'program_creation' | 'budget_increase';
  requestedBy: string;
  requestedByName: string;
  requestedByRole: string;
  requestDate: Date;
  
  requestDetails: {
    amount?: number;
    quantity?: number;
    recipients?: number;
    templateId?: string;
    justification: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    businessReason: string;
  };
  
  status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'cancelled' | 'expired';
  currentApprovalLevel: number;
  requiredApprovalLevel: number;
  
  approvers: Array<{
    approverId: string;
    approverName: string;
    approverRole: string;
    level: number;
    status: 'pending' | 'approved' | 'rejected';
    approvedAt?: Date;
    comments?: string;
    signature?: string;
  }>;
  
  requestedCompletionDate?: Date;
  expectedApprovalDate?: Date;
  slaBreachAt?: Date;
  actualCompletionDate?: Date;
  
  notificationsSent: Array<{
    type: 'request' | 'approval' | 'rejection' | 'escalation' | 'reminder';
    sentTo: string[];
    sentAt: Date;
    template: string;
  }>;
  
  escalationHistory: Array<{
    level: number;
    escalatedAt: Date;
    escalatedTo: string;
    reason: string;
    escalatedBy: 'system' | 'user';
  }>;
  
  comments: Array<{
    commentId: string;
    userId: string;
    userName: string;
    comment: string;
    isInternal: boolean;
    timestamp: Date;
  }>;
  
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
  processedBy?: string;
  
  giftCard?: ServiceGiftCardEntity;
  batch?: GiftCardBatchEntity;
  corporateProgram?: CorporateGiftProgramEntity;
};

type GiftCardAnalyticsEntity = {
  id: string;
  reportType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom';
  reportDate: Date;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  
  salesMetrics: {
    totalGiftCardsSold: number;
    totalRevenue: number;
    averageGiftCardValue: number;
    topSellingAmounts: Array<{
      amount: number;
      quantity: number;
      revenue: number;
    }>;
    salesByChannel: Record<string, {
      quantity: number;
      revenue: number;
    }>;
    corporateVsIndividual: {
      corporate: { quantity: number; revenue: number; };
      individual: { quantity: number; revenue: number; };
    };
  };
  
  redemptionMetrics: {
    totalRedemptions: number;
    totalRedemptionValue: number;
    averageRedemptionValue: number;
    redemptionRate: number;
    timeToFirstRedemption: number;
    fullyRedeemedCards: number;
    partiallyRedeemedCards: number;
    redemptionsByService: Array<{
      serviceId: string;
      serviceName: string;
      redemptions: number;
      value: number;
    }>;
  };
  
  balanceMetrics: {
    totalOutstandingBalance: number;
    totalActiveCards: number;
    averageRemainingBalance: number;
    balanceDistribution: Array<{
      range: string;
      count: number;
      totalBalance: number;
    }>;
    expiringWithinMonth: {
      count: number;
      totalBalance: number;
    };
  };
  
  templateMetrics: Array<{
    templateId: string;
    templateName: string;
    sales: number;
    revenue: number;
    redemptionRate: number;
    averageRating: number;
    popularityScore: number;
  }>;
  
  corporateMetrics?: {
    totalPrograms: number;
    activePrograms: number;
    totalCorporateRevenue: number;
    averageProgramSize: number;
    topPrograms: Array<{
      programId: string;
      programName: string;
      revenue: number;
      giftsIssued: number;
      redemptionRate: number;
    }>;
  };
  
  customerMetrics: {
    totalCustomers: number;
    newCustomers: number;
    repeatCustomers: number;
    averageCustomerValue: number;
    customerLifetimeValue: number;
    topCustomers: Array<{
      customerId: string;
      customerName: string;
      totalPurchased: number;
      totalGifts: number;
      lastPurchaseDate: Date;
    }>;
  };
  
  geographicMetrics: {
    salesByRegion: Record<string, {
      quantity: number;
      revenue: number;
    }>;
    redemptionsByRegion: Record<string, {
      redemptions: number;
      value: number;
    }>;
  };
  
  trendAnalysis: {
    dailyTrends: Array<{
      date: Date;
      sales: number;
      redemptions: number;
      balance: number;
    }>;
    seasonalPatterns: Record<string, {
      sales: number;
      redemptions: number;
      averageValue: number;
    }>;
    growthMetrics: {
      salesGrowth: number;
      customerGrowth: number;
      redemptionGrowth: number;
    };
  };
  
  generatedAt: Date;
  generatedBy: string;
  lastUpdated: Date;
  version: number;
  
  reportFiles: Array<{
    type: 'pdf' | 'excel' | 'csv';
    url: string;
    size: number;
    generatedAt: Date;
    expiresAt: Date;
  }>;
};

// API Response Types
interface GiftCardAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: Date;
  requestId: string;
  version: string;
  meta?: {
    totalCount?: number;
    processedCount?: number;
    failedCount?: number;
    warnings?: string[];
  };
}

interface PaginatedGiftCardResponse<T> extends GiftCardAPIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  aggregations?: {
    totalValue: number;
    averageValue: number;
    statusBreakdown: Record<string, number>;
    balanceBreakdown: {
      totalBalance: number;
      fullyRedeemed: number;
      partiallyRedeemed: number;
      unredeemed: number;
    };
  };
}

// Enhanced Gift Card Types for API Integration (replacing legacy types)
export interface ServiceGiftCard extends ServiceGiftCardEntity {}
export interface GiftCardTemplate extends GiftCardTemplateEntity {}
export interface GiftCardRedemption extends GiftCardRedemptionEntity {}
export interface GiftCardActivity extends GiftCardActivityEntity {}
export interface GiftCardTransfer extends GiftCardTransferEntity {}
export interface GiftCardBatch extends GiftCardBatchEntity {}
export interface CorporateGiftProgram extends CorporateGiftProgramEntity {}
export interface GiftCardApproval extends GiftCardApprovalEntity {}
export interface GiftCardAnalytics extends GiftCardAnalyticsEntity {}

// Legacy compatibility aliases
export interface GiftCard extends ServiceGiftCard {}
export interface Bid extends GiftCardRedemption {} // Legacy naming

// Request/Response Data Types
export interface CreateGiftCardData {
  templateId?: string;
  amount: number;
  quantity?: number;
  recipientEmail: string;
  recipientName?: string;
  recipientPhone?: string;
  senderName: string;
  personalMessage?: string;
  corporateMessage?: string;
  deliveryMethod: 'email' | 'sms' | 'physical' | 'api' | 'portal';
  scheduledDelivery?: Date;
  customDesign?: ServiceGiftCard['customDesign'];
  restrictions?: ServiceGiftCard['restrictions'];
  corporateAccountId?: string;
  corporateProgramId?: string;
  employeeId?: string;
  projectCode?: string;
  costCenter?: string;
  budgetCode?: string;
}

export interface CreateBulkGiftCardData {
  templateId: string;
  corporateAccountId?: string;
  corporateProgramId?: string;
  batchName: string;
  deliveryMethod: 'email' | 'bulk_download' | 'api' | 'portal';
  scheduledDelivery?: Date;
  recipients: Array<{
    email: string;
    name?: string;
    phone?: string;
    amount: number;
    personalMessage?: string;
    employeeId?: string;
    department?: string;
    projectCode?: string;
    costCenter?: string;
    metadata?: Record<string, any>;
  }>;
  corporateMessage?: string;
  customDesign?: ServiceGiftCard['customDesign'];
  restrictions?: ServiceGiftCard['restrictions'];
  approvalRequired?: boolean;
  purchaseOrderNumber?: string;
}

export interface RedeemGiftCardData {
  code: string;
  amount: number;
  orderId?: string;
  serviceId?: string;
  vendorId?: string;
  description: string;
  notes?: string;
  verificationData?: {
    method: 'email' | 'sms' | 'two_factor';
    code: string;
  };
}

export interface TransferGiftCardData {
  giftCardId: string;
  toUserEmail: string;
  toUserName?: string;
  transferType: 'full' | 'partial';
  transferAmount?: number;
  transferMessage?: string;
  verificationMethod: 'email' | 'sms' | 'none';
  confirmationRequired: boolean;
}

export interface GiftCardFilters {
  // Basic Filters
  status?: string[];
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
  
  // Date Filters
  purchaseDateFrom?: string;
  purchaseDateTo?: string;
  expiryDateFrom?: string;
  expiryDateTo?: string;
  redemptionDateFrom?: string;
  redemptionDateTo?: string;
  
  // Corporate Filters
  corporateAccountId?: string;
  corporateProgramId?: string;
  employeeId?: string;
  departmentIds?: string[];
  costCenter?: string;
  projectCode?: string;
  
  // Recipient Filters
  recipientEmail?: string;
  recipientName?: string;
  recipientCompany?: string;
  
  // Template & Design Filters
  templateIds?: string[];
  templateCategory?: string;
  hasCustomDesign?: boolean;
  
  // Delivery Filters
  deliveryMethod?: string[];
  deliveryStatus?: string[];
  
  // Amount & Balance Filters
  hasBalance?: boolean;
  minBalance?: number;
  maxBalance?: number;
  redemptionRate?: { min?: number; max?: number };
  
  // Activity Filters
  lastActivityFrom?: string;
  lastActivityTo?: string;
  activityTypes?: string[];
  
  // Risk & Fraud Filters
  fraudFlags?: string[];
  riskScoreMin?: number;
  riskScoreMax?: number;
  
  // Search & Sorting
  search?: string;
  searchFields?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  
  // Pagination
  page?: number;
  limit?: number;
  offset?: number;
  
  // Analytics Filters
  includeAnalytics?: boolean;
  includeRedemptionHistory?: boolean;
  includeActivityHistory?: boolean;
  includeTransferHistory?: boolean;
}

export interface CreateCorporateProgramData {
  name: string;
  description: string;
  programCode?: string;
  corporateAccountId: string;
  contactPersonId: string;
  programType: CorporateGiftProgram['programType'];
  
  // Budget Configuration
  totalBudget?: number;
  monthlyBudget?: number;
  quarterlyBudget?: number;
  
  // Limits
  maxAmountPerGift: number;
  maxAmountPerEmployee: number;
  maxAmountPerMonth: number;
  maxQuantityPerOrder: number;
  
  // Templates
  allowedTemplates: string[];
  restrictedTemplates?: string[];
  customTemplatesAllowed: boolean;
  brandingRequired: boolean;
  
  // Approval Workflow
  autoApproval: boolean;
  requiresBudgetApproval: boolean;
  approvalWorkflow?: CorporateGiftProgram['approvalWorkflow'];
  
  // Delivery
  defaultDeliveryMethod: CorporateGiftProgram['defaultDeliveryMethod'];
  deliverySchedule?: CorporateGiftProgram['deliverySchedule'];
  
  // Reporting
  reportingFrequency: CorporateGiftProgram['reportingFrequency'];
  reportRecipients: string[];
  includeUsageAnalytics: boolean;
  includeROIMetrics: boolean;
  
  // Compliance
  complianceNotes?: string;
  dataRetentionPeriod: number;
  auditRequired: boolean;
  
  // Program Lifecycle
  startDate: Date;
  endDate?: Date;
}

// Comprehensive B2B Service Gift Cards API for Enterprise Marketplace
export const serviceGiftCardsAPI = {
  // Core Gift Card Management
  giftCards: {
    // Get all gift cards with advanced filtering
    getAll: async (filters?: GiftCardFilters): Promise<PaginatedGiftCardResponse<ServiceGiftCard>> => {
      const response = await api.get<PaginatedGiftCardResponse<ServiceGiftCard>>('/gift-cards/service-cards', {
        params: filters,
      });
      return response.data;
    },

    // Get gift card by ID with comprehensive details
    getById: async (id: string, includeDetails?: {
      includeRedemptions?: boolean;
      includeActivity?: boolean;
      includeTransfers?: boolean;
      includeAnalytics?: boolean;
    }): Promise<GiftCardAPIResponse<ServiceGiftCard>> => {
      const response = await api.get<GiftCardAPIResponse<ServiceGiftCard>>(`/gift-cards/service-cards/${id}`, {
        params: includeDetails,
      });
      return response.data;
    },

    // Create new gift card
    create: async (data: CreateGiftCardData): Promise<GiftCardAPIResponse<ServiceGiftCard>> => {
      const response = await api.post<GiftCardAPIResponse<ServiceGiftCard>>('/gift-cards/service-cards', data);
      return response.data;
    },

    // Create bulk gift cards
    createBulk: async (data: CreateBulkGiftCardData): Promise<GiftCardAPIResponse<{
      batch: GiftCardBatch;
      giftCards: ServiceGiftCard[];
      totalAmount: number;
      successCount: number;
      failedCount: number;
      errors?: string[];
    }>> => {
      const response = await api.post<GiftCardAPIResponse<any>>('/gift-cards/service-cards/bulk', data);
      return response.data;
    },

    // Get my gift cards
    getMy: async (filters?: GiftCardFilters): Promise<PaginatedGiftCardResponse<ServiceGiftCard>> => {
      const response = await api.get<PaginatedGiftCardResponse<ServiceGiftCard>>('/gift-cards/my-cards', {
        params: filters,
      });
      return response.data;
    },

    // Cancel gift card
    cancel: async (id: string, reason: string): Promise<GiftCardAPIResponse<ServiceGiftCard>> => {
      const response = await api.post<GiftCardAPIResponse<ServiceGiftCard>>(`/gift-cards/service-cards/${id}/cancel`, {
        reason,
      });
      return response.data;
    },

    // Extend expiry date
    extendExpiry: async (id: string, newExpiryDate: Date): Promise<GiftCardAPIResponse<ServiceGiftCard>> => {
      const response = await api.post<GiftCardAPIResponse<ServiceGiftCard>>(`/gift-cards/service-cards/${id}/extend`, {
        newExpiryDate: newExpiryDate.toISOString(),
      });
      return response.data;
    },

    // Resend gift card
    resend: async (id: string, method?: 'email' | 'sms' | 'portal'): Promise<GiftCardAPIResponse<{
      success: boolean;
      deliveryMethod: string;
      deliveryStatus: string;
      message: string;
    }>> => {
      const response = await api.post<GiftCardAPIResponse<any>>(`/gift-cards/service-cards/${id}/resend`, {
        method,
      });
      return response.data;
    },

    // Check balance
    checkBalance: async (code: string): Promise<GiftCardAPIResponse<{
      balance: number;
      originalAmount: number;
      status: string;
      expiryDate: Date;
      isExpired: boolean;
      canRedeem: boolean;
      restrictions: ServiceGiftCard['restrictions'];
      lastRedemption?: Date;
    }>> => {
      const response = await api.get<GiftCardAPIResponse<any>>(`/gift-cards/balance/${code}`);
      return response.data;
    },

    // Validate gift card
    validate: async (code: string, amount?: number): Promise<GiftCardAPIResponse<{
      valid: boolean;
      canRedeem: boolean;
      availableBalance: number;
      restrictions: ServiceGiftCard['restrictions'];
      validationErrors?: string[];
      warnings?: string[];
    }>> => {
      const response = await api.post<GiftCardAPIResponse<any>>('/gift-cards/validate', {
        code,
        amount,
      });
      return response.data;
    },

    // Get gift card analytics
    getAnalytics: async (id: string, filters?: {
      includeBenchmarks?: boolean;
      includeUsagePatterns?: boolean;
      includeROIAnalysis?: boolean;
    }): Promise<GiftCardAPIResponse<{
      overview: {
        totalRedemptions: number;
        redemptionValue: number;
        redemptionRate: number;
        averageRedemption: number;
        timeToFirstUse: number;
        remainingBalance: number;
      };
      usage: {
        redemptionPattern: Array<{
          date: Date;
          amount: number;
          service: string;
          vendor: string;
        }>;
        serviceCategories: Array<{
          category: string;
          redemptions: number;
          value: number;
          percentage: number;
        }>;
        vendorUsage: Array<{
          vendorId: string;
          vendorName: string;
          redemptions: number;
          value: number;
        }>;
      };
      engagement: {
        viewCount: number;
        shareCount: number;
        transferCount: number;
        lastActivity: Date;
        engagementScore: number;
      };
      benchmarks?: {
        industryAverage: number;
        companyAverage: number;
        similarCards: number;
        performanceRank: number;
      };
    }>> => {
      const response = await api.get<GiftCardAPIResponse<any>>(`/gift-cards/service-cards/${id}/analytics`, {
        params: filters,
      });
      return response.data;
    },
  },

  // Template Management
  templates: {
    // Get all templates
    getAll: async (filters?: {
      category?: string;
      isActive?: boolean;
      isCorporateTemplate?: boolean;
      corporateAccountId?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    }): Promise<PaginatedGiftCardResponse<GiftCardTemplate>> => {
      const response = await api.get<PaginatedGiftCardResponse<GiftCardTemplate>>('/gift-cards/templates', {
        params: filters,
      });
      return response.data;
    },

    // Get template by ID
    getById: async (id: string): Promise<GiftCardAPIResponse<GiftCardTemplate>> => {
      const response = await api.get<GiftCardAPIResponse<GiftCardTemplate>>(`/gift-cards/templates/${id}`);
      return response.data;
    },

    // Get corporate templates
    getCorporate: async (corporateAccountId: string): Promise<PaginatedGiftCardResponse<GiftCardTemplate>> => {
      const response = await api.get<PaginatedGiftCardResponse<GiftCardTemplate>>('/gift-cards/templates/corporate', {
        params: { corporateAccountId },
      });
      return response.data;
    },

    // Get popular templates
    getPopular: async (limit?: number): Promise<GiftCardAPIResponse<Array<GiftCardTemplate & {
      usageStats: {
        sales: number;
        revenue: number;
        redemptionRate: number;
        customerRating: number;
      };
    }>>> => {
      const response = await api.get<GiftCardAPIResponse<any>>('/gift-cards/templates/popular', {
        params: { limit },
      });
      return response.data;
    },

    // Get template recommendations
    getRecommendations: async (filters?: {
      category?: string;
      budget?: number;
      corporateAccountId?: string;
      programType?: string;
    }): Promise<GiftCardAPIResponse<Array<{
      template: GiftCardTemplate;
      matchScore: number;
      reasons: string[];
      estimatedPerformance: {
        expectedRedemptionRate: number;
        estimatedSavings: number;
        engagementScore: number;
      };
    }>>> => {
      const response = await api.get<GiftCardAPIResponse<any>>('/gift-cards/templates/recommendations', {
        params: filters,
      });
      return response.data;
    },
  },

  // Redemption Management
  redemptions: {
    // Redeem gift card
    redeem: async (data: RedeemGiftCardData): Promise<GiftCardAPIResponse<{
      redemption: GiftCardRedemption;
      giftCard: ServiceGiftCard;
      newBalance: number;
      order?: any;
      message: string;
    }>> => {
      const response = await api.post<GiftCardAPIResponse<any>>('/gift-cards/redeem', data);
      return response.data;
    },

    // Get redemption history
    getHistory: async (giftCardId: string, filters?: {
      dateFrom?: string;
      dateTo?: string;
      minAmount?: number;
      maxAmount?: string;
      status?: string[];
      page?: number;
      limit?: number;
    }): Promise<PaginatedGiftCardResponse<GiftCardRedemption>> => {
      const response = await api.get<PaginatedGiftCardResponse<GiftCardRedemption>>(`/gift-cards/service-cards/${giftCardId}/redemptions`, {
        params: filters,
      });
      return response.data;
    },

    // Get my redemptions
    getMy: async (filters?: {
      giftCardId?: string;
      dateFrom?: string;
      dateTo?: string;
      status?: string[];
      page?: number;
      limit?: number;
    }): Promise<PaginatedGiftCardResponse<GiftCardRedemption>> => {
      const response = await api.get<PaginatedGiftCardResponse<GiftCardRedemption>>('/gift-cards/redemptions/my-redemptions', {
        params: filters,
      });
      return response.data;
    },

    // Reverse redemption
    reverse: async (redemptionId: string, reason: string): Promise<GiftCardAPIResponse<{
      redemption: GiftCardRedemption;
      giftCard: ServiceGiftCard;
      reversalAmount: number;
      newBalance: number;
      refundProcessed: boolean;
    }>> => {
      const response = await api.post<GiftCardAPIResponse<any>>(`/gift-cards/redemptions/${redemptionId}/reverse`, {
        reason,
      });
      return response.data;
    },

    // Get redemption by ID
    getById: async (id: string): Promise<GiftCardAPIResponse<GiftCardRedemption>> => {
      const response = await api.get<GiftCardAPIResponse<GiftCardRedemption>>(`/gift-cards/redemptions/${id}`);
      return response.data;
    },

    // Verify redemption
    verify: async (redemptionId: string, verificationData: {
      method: 'email' | 'sms' | 'two_factor';
      code: string;
    }): Promise<GiftCardAPIResponse<GiftCardRedemption>> => {
      const response = await api.post<GiftCardAPIResponse<GiftCardRedemption>>(`/gift-cards/redemptions/${redemptionId}/verify`, verificationData);
      return response.data;
    },

    // Get redemption analytics
    getAnalytics: async (filters?: {
      giftCardIds?: string[];
      dateFrom?: string;
      dateTo?: string;
      groupBy?: 'day' | 'week' | 'month';
      includeComparisons?: boolean;
    }): Promise<GiftCardAPIResponse<{
      overview: {
        totalRedemptions: number;
        totalValue: number;
        averageRedemption: number;
        uniqueCards: number;
        redemptionRate: number;
      };
      trends: Array<{
        period: string;
        redemptions: number;
        value: number;
        uniqueCards: number;
      }>;
      breakdown: {
        byService: Array<{
          serviceId: string;
          serviceName: string;
          redemptions: number;
          value: number;
          percentage: number;
        }>;
        byVendor: Array<{
          vendorId: string;
          vendorName: string;
          redemptions: number;
          value: number;
        }>;
        byAmount: Array<{
          range: string;
          redemptions: number;
          value: number;
        }>;
      };
      insights: {
        peakTimes: Array<{ hour: number; activity: number }>;
        popularServices: string[];
        averageTimeToRedeem: number;
        seasonalPatterns: Record<string, number>;
      };
    }>> => {
      const response = await api.get<GiftCardAPIResponse<any>>('/gift-cards/redemptions/analytics', {
        params: filters,
      });
      return response.data;
    },
  },

  // Transfer Management
  transfers: {
    // Transfer gift card
    transfer: async (data: TransferGiftCardData): Promise<GiftCardAPIResponse<{
      transfer: GiftCardTransfer;
      originalCard?: ServiceGiftCard;
      newCard?: ServiceGiftCard;
      confirmationRequired: boolean;
      confirmationCode?: string;
    }>> => {
      const response = await api.post<GiftCardAPIResponse<any>>('/gift-cards/transfer', data);
      return response.data;
    },

    // Confirm transfer
    confirmTransfer: async (transferId: string, confirmationCode: string): Promise<GiftCardAPIResponse<{
      transfer: GiftCardTransfer;
      completed: boolean;
      newCard: ServiceGiftCard;
    }>> => {
      const response = await api.post<GiftCardAPIResponse<any>>(`/gift-cards/transfers/${transferId}/confirm`, {
        confirmationCode,
      });
      return response.data;
    },

    // Cancel transfer
    cancelTransfer: async (transferId: string, reason: string): Promise<GiftCardAPIResponse<GiftCardTransfer>> => {
      const response = await api.post<GiftCardAPIResponse<GiftCardTransfer>>(`/gift-cards/transfers/${transferId}/cancel`, {
        reason,
      });
      return response.data;
    },

    // Get transfer history
    getHistory: async (giftCardId: string): Promise<GiftCardAPIResponse<GiftCardTransfer[]>> => {
      const response = await api.get<GiftCardAPIResponse<GiftCardTransfer[]>>(`/gift-cards/service-cards/${giftCardId}/transfers`);
      return response.data;
    },

    // Get my transfers
    getMy: async (filters?: {
      type?: 'sent' | 'received';
      status?: string[];
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
    }): Promise<PaginatedGiftCardResponse<GiftCardTransfer & {
      giftCard: ServiceGiftCard;
    }>> => {
      const response = await api.get<PaginatedGiftCardResponse<any>>('/gift-cards/transfers/my-transfers', {
        params: filters,
      });
      return response.data;
    },

    // Get transfer by ID
    getById: async (id: string): Promise<GiftCardAPIResponse<GiftCardTransfer>> => {
      const response = await api.get<GiftCardAPIResponse<GiftCardTransfer>>(`/gift-cards/transfers/${id}`);
      return response.data;
    },
  },

  // Batch Management
  batches: {
    // Get all batches
    getAll: async (filters?: {
      corporateAccountId?: string;
      status?: string[];
      dateFrom?: string;
      dateTo?: string;
      minValue?: number;
      maxValue?: number;
      page?: number;
      limit?: number;
    }): Promise<PaginatedGiftCardResponse<GiftCardBatch>> => {
      const response = await api.get<PaginatedGiftCardResponse<GiftCardBatch>>('/gift-cards/batches', {
        params: filters,
      });
      return response.data;
    },

    // Get batch by ID
    getById: async (id: string): Promise<GiftCardAPIResponse<GiftCardBatch & {
      giftCards?: ServiceGiftCard[];
      processingLog?: Array<{
        step: string;
        status: 'pending' | 'completed' | 'failed';
        message?: string;
        timestamp: Date;
      }>;
    }>> => {
      const response = await api.get<GiftCardAPIResponse<any>>(`/gift-cards/batches/${id}`);
      return response.data;
    },

    // Get my batches
    getMy: async (filters?: {
      status?: string[];
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
    }): Promise<PaginatedGiftCardResponse<GiftCardBatch>> => {
      const response = await api.get<PaginatedGiftCardResponse<GiftCardBatch>>('/gift-cards/batches/my-batches', {
        params: filters,
      });
      return response.data;
    },

    // Cancel batch
    cancel: async (id: string, reason: string): Promise<GiftCardAPIResponse<GiftCardBatch>> => {
      const response = await api.post<GiftCardAPIResponse<GiftCardBatch>>(`/gift-cards/batches/${id}/cancel`, {
        reason,
      });
      return response.data;
    },

    // Retry failed batch
    retry: async (id: string): Promise<GiftCardAPIResponse<GiftCardBatch>> => {
      const response = await api.post<GiftCardAPIResponse<GiftCardBatch>>(`/gift-cards/batches/${id}/retry`);
      return response.data;
    },

    // Download batch files
    downloadFiles: async (id: string, fileType: 'csv' | 'excel' | 'pdf' | 'zip'): Promise<Blob> => {
      const response = await api.get(`/gift-cards/batches/${id}/download/${fileType}`, {
        responseType: 'blob',
      });
      return response.data;
    },

    // Get batch analytics
    getAnalytics: async (id: string): Promise<GiftCardAPIResponse<{
      overview: {
        totalCards: number;
        totalValue: number;
        deliveryRate: number;
        redemptionRate: number;
        averageTimeToRedeem: number;
      };
      delivery: {
        delivered: number;
        pending: number;
        failed: number;
        bounced: number;
        deliveryTimes: Array<{
          period: string;
          delivered: number;
          failed: number;
        }>;
      };
      usage: {
        redeemed: number;
        unredeemed: number;
        partiallyRedeemed: number;
        redemptionPattern: Array<{
          date: Date;
          redemptions: number;
          value: number;
        }>;
      };
      recipients: {
        totalRecipients: number;
        activeRecipients: number;
        engagementRate: number;
        topRecipients: Array<{
          email: string;
          redemptions: number;
          value: number;
        }>;
      };
    }>> => {
      const response = await api.get<GiftCardAPIResponse<any>>(`/gift-cards/batches/${id}/analytics`);
      return response.data;
    },
  },

  // Corporate Program Management
  corporatePrograms: {
    // Get all programs
    getAll: async (filters?: {
      corporateAccountId?: string;
      programType?: string;
      isActive?: boolean;
      search?: string;
      page?: number;
      limit?: number;
    }): Promise<PaginatedGiftCardResponse<CorporateGiftProgram>> => {
      const response = await api.get<PaginatedGiftCardResponse<CorporateGiftProgram>>('/gift-cards/corporate-programs', {
        params: filters,
      });
      return response.data;
    },

    // Create new program
    create: async (data: CreateCorporateProgramData): Promise<GiftCardAPIResponse<CorporateGiftProgram>> => {
      const response = await api.post<GiftCardAPIResponse<CorporateGiftProgram>>('/gift-cards/corporate-programs', data);
      return response.data;
    },

    // Get program by ID
    getById: async (id: string): Promise<GiftCardAPIResponse<CorporateGiftProgram & {
      budgetUsage: {
        used: number;
        remaining: number;
        percentage: number;
        monthlyUsage: Array<{
          month: string;
          used: number;
          budget: number;
        }>;
      };
      performance: {
        totalGiftsIssued: number;
        redemptionRate: number;
        employeeParticipation: number;
        costPerGift: number;
        costPerEmployee: number;
      };
    }>> => {
      const response = await api.get<GiftCardAPIResponse<any>>(`/gift-cards/corporate-programs/${id}`);
      return response.data;
    },

    // Update program
    update: async (id: string, data: Partial<CreateCorporateProgramData>): Promise<GiftCardAPIResponse<CorporateGiftProgram>> => {
      const response = await api.put<GiftCardAPIResponse<CorporateGiftProgram>>(`/gift-cards/corporate-programs/${id}`, data);
      return response.data;
    },

    // Deactivate program
    deactivate: async (id: string, reason: string): Promise<GiftCardAPIResponse<CorporateGiftProgram>> => {
      const response = await api.post<GiftCardAPIResponse<CorporateGiftProgram>>(`/gift-cards/corporate-programs/${id}/deactivate`, {
        reason,
      });
      return response.data;
    },

    // Get program analytics
    getAnalytics: async (id: string, filters?: {
      dateFrom?: string;
      dateTo?: string;
      includeROI?: boolean;
      includeBenchmarks?: boolean;
    }): Promise<GiftCardAPIResponse<{
      overview: {
        totalGifts: number;
        totalValue: number;
        redemptionRate: number;
        participationRate: number;
        averageGiftValue: number;
        costPerParticipant: number;
      };
      budget: {
        allocated: number;
        used: number;
        remaining: number;
        utilization: number;
        projectedUsage: number;
        savingsAchieved: number;
      };
      engagement: {
        totalParticipants: number;
        activeParticipants: number;
        engagementRate: number;
        repeatParticipants: number;
        averageGiftsPerEmployee: number;
      };
      performance: {
        byDepartment: Array<{
          department: string;
          participants: number;
          gifts: number;
          value: number;
          redemptionRate: number;
        }>;
        byGiftValue: Array<{
          range: string;
          gifts: number;
          redemptionRate: number;
        }>;
        seasonalTrends: Array<{
          period: string;
          gifts: number;
          value: number;
          participation: number;
        }>;
      };
      roi?: {
        totalInvestment: number;
        measurableReturns: number;
        roiPercentage: number;
        employeeSatisfaction: number;
        retentionImpact: number;
        productivityImpact: number;
      };
    }>> => {
      const response = await api.get<GiftCardAPIResponse<any>>(`/gift-cards/corporate-programs/${id}/analytics`, {
        params: filters,
      });
      return response.data;
    },

    // Get program reports
    generateReport: async (id: string, reportType: 'usage' | 'budget' | 'engagement' | 'roi' | 'compliance', format: 'pdf' | 'excel' | 'csv'): Promise<GiftCardAPIResponse<{
      reportUrl: string;
      downloadUrl: string;
      expiresAt: Date;
      reportSize: number;
    }>> => {
      const response = await api.post<GiftCardAPIResponse<any>>(`/gift-cards/corporate-programs/${id}/reports`, {
        reportType,
        format,
      });
      return response.data;
    },
  },

  // Activity & Audit Trail
  activities: {
    // Get gift card activity
    getByGiftCard: async (giftCardId: string, filters?: {
      activityTypes?: string[];
      dateFrom?: string;
      dateTo?: string;
      actorTypes?: string[];
      page?: number;
      limit?: number;
    }): Promise<PaginatedGiftCardResponse<GiftCardActivity>> => {
      const response = await api.get<PaginatedGiftCardResponse<GiftCardActivity>>(`/gift-cards/service-cards/${giftCardId}/activities`, {
        params: filters,
      });
      return response.data;
    },

    // Get my activities
    getMy: async (filters?: {
      giftCardIds?: string[];
      activityTypes?: string[];
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
    }): Promise<PaginatedGiftCardResponse<GiftCardActivity>> => {
      const response = await api.get<PaginatedGiftCardResponse<GiftCardActivity>>('/gift-cards/activities/my-activities', {
        params: filters,
      });
      return response.data;
    },

    // Get real-time activities
    getRealTime: async (giftCardIds: string[]): Promise<GiftCardAPIResponse<GiftCardActivity[]>> => {
      const response = await api.post<GiftCardAPIResponse<GiftCardActivity[]>>('/gift-cards/activities/real-time', {
        giftCardIds,
      });
      return response.data;
    },

    // Get activity summary
    getSummary: async (filters?: {
      giftCardIds?: string[];
      dateFrom?: string;
      dateTo?: string;
      groupBy?: 'day' | 'week' | 'month';
    }): Promise<GiftCardAPIResponse<{
      totalActivities: number;
      activityBreakdown: Record<string, number>;
      timeline: Array<{
        period: string;
        activities: number;
        types: Record<string, number>;
      }>;
      topActors: Array<{
        actorId: string;
        actorName: string;
        actorType: string;
        activities: number;
      }>;
    }>> => {
      const response = await api.get<GiftCardAPIResponse<any>>('/gift-cards/activities/summary', {
        params: filters,
      });
      return response.data;
    },
  },

  // Analytics & Reporting
  analytics: {
    // Get dashboard overview
    getDashboard: async (): Promise<GiftCardAPIResponse<{
      summary: {
        totalGiftCards: number;
        totalValue: number;
        activeCards: number;
        redemptionRate: number;
        averageValue: number;
        totalRedemptions: number;
      };
      recentActivity: Array<{
        type: string;
        giftCardId: string;
        description: string;
        timestamp: Date;
        amount?: number;
      }>;
      myCards: {
        purchased: number;
        received: number;
        activeBalance: number;
        totalSpent: number;
        expiringCards: number;
      };
      insights: {
        popularTemplates: Array<{
          templateId: string;
          templateName: string;
          usage: number;
        }>;
        redemptionTrends: Array<{
          period: string;
          redemptions: number;
          value: number;
        }>;
        upcomingExpiries: Array<{
          giftCardId: string;
          code: string;
          balance: number;
          expiryDate: Date;
          daysRemaining: number;
        }>;
      };
    }>> => {
      const response = await api.get<GiftCardAPIResponse<any>>('/gift-cards/analytics/dashboard');
      return response.data;
    },

    // Get comprehensive analytics
    getComprehensive: async (filters?: {
      dateFrom?: string;
      dateTo?: string;
      corporateAccountIds?: string[];
      templateIds?: string[];
      includeForecasting?: boolean;
      includeBenchmarks?: boolean;
    }): Promise<GiftCardAPIResponse<GiftCardAnalytics>> => {
      const response = await api.get<GiftCardAPIResponse<GiftCardAnalytics>>('/gift-cards/analytics/comprehensive', {
        params: filters,
      });
      return response.data;
    },

    // Get performance metrics
    getPerformanceMetrics: async (filters?: {
      dateFrom?: string;
      dateTo?: string;
      groupBy?: 'day' | 'week' | 'month';
      metrics?: string[];
    }): Promise<GiftCardAPIResponse<{
      metrics: {
        salesGrowth: number;
        redemptionGrowth: number;
        customerRetention: number;
        averageOrderValue: number;
        conversionRate: number;
        customerLifetimeValue: number;
      };
      trends: Array<{
        period: string;
        sales: number;
        redemptions: number;
        newCustomers: number;
        revenue: number;
      }>;
      comparisons: {
        previousPeriod: {
          salesChange: number;
          redemptionChange: number;
          revenueChange: number;
        };
        yearOverYear: {
          salesChange: number;
          redemptionChange: number;
          revenueChange: number;
        };
      };
      forecasting?: {
        nextMonth: {
          expectedSales: number;
          expectedRevenue: number;
          confidence: number;
        };
        nextQuarter: {
          expectedSales: number;
          expectedRevenue: number;
          confidence: number;
        };
      };
    }>> => {
      const response = await api.get<GiftCardAPIResponse<any>>('/gift-cards/analytics/performance', {
        params: filters,
      });
      return response.data;
    },

    // Export analytics data
    export: async (filters?: {
      type: 'sales' | 'redemptions' | 'balance' | 'activities' | 'comprehensive';
      format: 'csv' | 'excel' | 'pdf';
      dateFrom?: string;
      dateTo?: string;
      giftCardIds?: string[];
    }): Promise<Blob> => {
      const response = await api.post('/gift-cards/analytics/export', filters, {
        responseType: 'blob',
      });
      return response.data;
    },
  },

  // Quick Actions & Utilities
  quickActions: {
    // Quick purchase
    quickPurchase: async (data: {
      templateId?: string;
      amount: number;
      recipientEmail: string;
      senderName: string;
      message?: string;
      deliveryMethod?: 'email' | 'sms';
    }): Promise<GiftCardAPIResponse<ServiceGiftCard>> => {
      const response = await api.post<GiftCardAPIResponse<ServiceGiftCard>>('/gift-cards/quick-purchase', data);
      return response.data;
    },

    // Quick balance check
    quickBalanceCheck: async (code: string): Promise<GiftCardAPIResponse<{
      balance: number;
      status: string;
      expiryDays: number;
      canRedeem: boolean;
    }>> => {
      const response = await api.get<GiftCardAPIResponse<any>>(`/gift-cards/quick-balance/${code}`);
      return response.data;
    },

    // Get purchase suggestions
    getPurchaseSuggestions: async (filters?: {
      budget?: number;
      occasion?: string;
      recipientType?: 'individual' | 'group' | 'corporate';
    }): Promise<GiftCardAPIResponse<Array<{
      template: GiftCardTemplate;
      suggestedAmount: number;
      reasons: string[];
      popularity: number;
      redemptionRate: number;
    }>>> => {
      const response = await api.get<GiftCardAPIResponse<any>>('/gift-cards/purchase-suggestions', {
        params: filters,
      });
      return response.data;
    },

    // Get expiry notifications
    getExpiryNotifications: async (): Promise<GiftCardAPIResponse<Array<{
      giftCardId: string;
      code: string;
      balance: number;
      expiryDate: Date;
      daysRemaining: number;
      urgency: 'critical' | 'warning' | 'info';
    }>>> => {
      const response = await api.get<GiftCardAPIResponse<any>>('/gift-cards/expiry-notifications');
      return response.data;
    },

    // Auto-extend expiry
    autoExtendExpiry: async (giftCardIds: string[], extensionDays: number): Promise<GiftCardAPIResponse<{
      extended: number;
      failed: number;
      results: Array<{
        giftCardId: string;
        success: boolean;
        newExpiryDate?: Date;
        error?: string;
      }>;
    }>> => {
      const response = await api.post<GiftCardAPIResponse<any>>('/gift-cards/auto-extend-expiry', {
        giftCardIds,
        extensionDays,
      });
      return response.data;
    },
  },
};

// Legacy API for backward compatibility
export const giftCardsAPI = {
  getTemplates: serviceGiftCardsAPI.templates.getAll,
  getTemplate: serviceGiftCardsAPI.templates.getById,
  purchaseGiftCards: serviceGiftCardsAPI.giftCards.create,
  getCustomerGiftCards: serviceGiftCardsAPI.giftCards.getMy,
  getGiftCardById: serviceGiftCardsAPI.giftCards.getById,
  checkBalance: serviceGiftCardsAPI.giftCards.checkBalance,
  redeemGiftCard: serviceGiftCardsAPI.redemptions.redeem,
  getRedemptionHistory: serviceGiftCardsAPI.redemptions.getHistory,
  resendGiftCard: serviceGiftCardsAPI.giftCards.resend,
  cancelGiftCard: serviceGiftCardsAPI.giftCards.cancel,
  transferGiftCard: serviceGiftCardsAPI.transfers.transfer,
  validateGiftCard: serviceGiftCardsAPI.giftCards.validate,
  getCustomerStats: serviceGiftCardsAPI.analytics.getDashboard,
  shareGiftCard: (giftCardId: string, method: string, data: any) => 
    Promise.resolve({ success: true, shareUrl: `https://example.com/gift-card/${giftCardId}` }),
  purchaseBulkGiftCards: serviceGiftCardsAPI.giftCards.createBulk,
  exportGiftCards: serviceGiftCardsAPI.analytics.export,
  exportRedemptions: (giftCardId: string) => 
    serviceGiftCardsAPI.analytics.export({ type: 'redemptions', format: 'csv', giftCardIds: [giftCardId] }),
};

// Admin API compatibility
export const giftCardsAdminAPI = {
  getAllGiftCards: serviceGiftCardsAPI.giftCards.getAll,
  getGiftCardStats: serviceGiftCardsAPI.analytics.getDashboard,
  updateGiftCard: (id: string, data: any) => serviceGiftCardsAPI.giftCards.getById(id),
  extendExpiry: serviceGiftCardsAPI.giftCards.extendExpiry,
  adjustBalance: (id: string, amount: number, reason: string) =>
    Promise.resolve({ id, currentBalance: amount, adjustmentReason: reason }),
  createTemplate: (template: any) => Promise.resolve(template),
  updateTemplate: (id: string, template: any) => Promise.resolve(template),
  deleteTemplate: (id: string) => Promise.resolve(),
  bulkExpire: (giftCardIds: string[]) => 
    Promise.resolve({ expired: giftCardIds.length, failed: 0 }),
  bulkCancel: (giftCardIds: string[], reason: string) => 
    Promise.resolve({ cancelled: giftCardIds.length, failed: 0 }),
  getDetailedAnalytics: serviceGiftCardsAPI.analytics.getComprehensive,
  exportAllGiftCards: serviceGiftCardsAPI.analytics.export,
  generateGiftCardReport: (params: any) => serviceGiftCardsAPI.analytics.export(params),
};

export default serviceGiftCardsAPI;