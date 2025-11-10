/**
 * Comprehensive Gift Card Management Entities
 * B2B Service Marketplace - Corporate Gift Programs
 * 
 * Handles enterprise gift card programs, bulk purchasing, corporate distributions,
 * and comprehensive gift card lifecycle management for B2B marketplace
 */

// Core Gift Card Entities
export interface ServiceGiftCardEntity {
  // Basic Information
  id: string;
  code: string; // Unique redemption code
  internalCode: string; // Internal tracking code
  batchId?: string; // For bulk purchases
  
  // Financial Information
  originalAmount: number;
  currentBalance: number;
  currency: string;
  exchangeRate?: number; // For multi-currency support
  
  // Status & Lifecycle
  status: 'active' | 'redeemed' | 'expired' | 'pending' | 'cancelled' | 'suspended' | 'transferred';
  activationDate?: Date;
  firstRedemptionDate?: Date;
  lastRedemptionDate?: Date;
  expiryDate: Date;
  autoExtendExpiry: boolean;
  
  // Purchase Information
  purchaseOrderId?: string;
  purchasedBy: string; // Customer ID
  purchasedByType: 'individual' | 'corporate' | 'admin';
  purchaseDate: Date;
  purchasePrice: number; // May differ from face value for promotional cards
  
  // Recipient Information
  recipientId?: string; // If recipient has account
  recipientEmail: string;
  recipientName?: string;
  recipientPhone?: string;
  recipientCompany?: string; // For B2B gifts
  recipientDepartment?: string;
  
  // Corporate/B2B Features
  corporateAccountId?: string;
  corporateProgramId?: string;
  employeeId?: string; // If corporate employee gift
  projectCode?: string; // For project-based gifting
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
    serviceCategories?: string[]; // Can only be used for specific services
    vendorIds?: string[]; // Can only be used with specific vendors
    minimumOrder?: number;
    maximumRedemption?: number; // Max amount per redemption
    usageLimit?: number; // Max number of redemptions
    validDays?: string[]; // Days of week when valid
    validHours?: { start: string; end: string };
    locationRestrictions?: string[]; // Geographic restrictions
    customerTiers?: string[]; // Customer tier restrictions
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
}

// Gift Card Template Management
export interface GiftCardTemplateEntity {
  // Basic Information
  id: string;
  name: string;
  description: string;
  category: 'birthday' | 'holiday' | 'wedding' | 'graduation' | 'corporate' | 'employee_recognition' | 'client_appreciation' | 'promotional' | 'seasonal' | 'custom';
  
  // Design Elements
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
  
  // Template Configuration
  isActive: boolean;
  isCustomizable: boolean;
  requiresApproval: boolean; // For corporate templates
  
  // Amount Configuration
  allowedAmounts?: number[];
  minAmount?: number;
  maxAmount?: number;
  defaultAmount?: number;
  amountIncrement: number;
  
  // Corporate Features
  isCorporateTemplate: boolean;
  corporateAccountIds?: string[]; // Which corporate accounts can use this
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
  
  // Branding & Customization
  allowCustomLogo: boolean;
  allowCustomMessage: boolean;
  allowCustomColors: boolean;
  brandingGuidelines?: string;
  complianceNotes?: string;
  
  // Usage Analytics
  usageCount: number;
  popularityScore: number;
  lastUsedDate?: Date;
  averageRating: number;
  
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
  version: number;
  
  // Relationships
  giftCards?: ServiceGiftCardEntity[];
}

// Gift Card Redemption Tracking
export interface GiftCardRedemptionEntity {
  // Basic Information
  id: string;
  giftCardId: string;
  redemptionCode: string;
  
  // Transaction Information
  orderId?: string;
  invoiceId?: string;
  serviceId?: string;
  vendorId?: string;
  amount: number;
  remainingBalance: number;
  
  // Context Information
  description: string;
  notes?: string;
  redemptionMethod: 'web' | 'mobile' | 'api' | 'pos' | 'phone' | 'email';
  
  // Location & Device
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
  
  // Verification & Security
  verificationMethod: 'email' | 'sms' | 'none' | 'two_factor' | 'biometric';
  fraudScore: number;
  fraudFlags: string[];
  isVerified: boolean;
  verifiedAt?: Date;
  
  // Status & Processing
  status: 'pending' | 'completed' | 'failed' | 'reversed' | 'disputed';
  processingTime: number; // milliseconds
  failureReason?: string;
  reversalReason?: string;
  
  // Corporate Features
  employeeId?: string;
  departmentCode?: string;
  projectCode?: string;
  costCenter?: string;
  approvedBy?: string;
  approvalDate?: Date;
  
  // Audit Fields
  redeemedAt: Date;
  redeemedBy: string; // User ID who redeemed
  processedAt?: Date;
  processedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  giftCard?: ServiceGiftCardEntity;
  order?: any; // OrderEntity
  service?: any; // ServiceEntity
  vendor?: any; // VendorEntity
  activities?: GiftCardActivityEntity[];
}

// Activity and Audit Trail
export interface GiftCardActivityEntity {
  // Basic Information
  id: string;
  giftCardId: string;
  redemptionId?: string;
  
  // Activity Details
  activityType: 'created' | 'activated' | 'redeemed' | 'transferred' | 'cancelled' | 'expired' | 'extended' | 'suspended' | 'reactivated' | 'resent' | 'viewed' | 'shared';
  description: string;
  details?: Record<string, any>;
  
  // Actor Information
  actorType: 'customer' | 'admin' | 'system' | 'vendor' | 'api';
  actorId?: string;
  actorName?: string;
  actorRole?: string;
  
  // Context Information
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
  
  // Change Tracking
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  changeReason?: string;
  
  // System Information
  systemSource: 'web' | 'mobile' | 'admin' | 'api' | 'batch' | 'scheduler';
  apiVersion?: string;
  
  // Audit Fields
  timestamp: Date;
  createdAt: Date;
  
  // Relationships
  giftCard?: ServiceGiftCardEntity;
  redemption?: GiftCardRedemptionEntity;
}

// Gift Card Transfer Management
export interface GiftCardTransferEntity {
  // Basic Information
  id: string;
  giftCardId: string;
  transferCode: string;
  
  // Transfer Details
  fromUserId: string;
  fromUserEmail: string;
  fromUserName: string;
  toUserId?: string; // If recipient has account
  toUserEmail: string;
  toUserName?: string;
  
  // Transfer Configuration
  transferType: 'full' | 'partial';
  transferAmount?: number; // For partial transfers
  remainingAmount?: number;
  
  // Status & Processing
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'expired';
  initiatedAt: Date;
  completedAt?: Date;
  expiresAt: Date;
  
  // Communication
  transferMessage?: string;
  notificationsSent: string[]; // email, sms, etc.
  confirmationRequired: boolean;
  confirmationCode?: string;
  confirmedAt?: Date;
  
  // Security & Verification
  verificationMethod: 'email' | 'sms' | 'none';
  isVerified: boolean;
  verifiedAt?: Date;
  securityQuestions?: Array<{
    question: string;
    answer: string; // hashed
  }>;
  
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  processedBy?: string;
  
  // Relationships
  giftCard?: ServiceGiftCardEntity;
  activities?: GiftCardActivityEntity[];
}

// Batch Purchase Management
export interface GiftCardBatchEntity {
  // Basic Information
  id: string;
  batchNumber: string;
  name: string;
  description?: string;
  
  // Batch Configuration
  templateId: string;
  totalQuantity: number;
  generatedQuantity: number;
  failedQuantity: number;
  
  // Amount Configuration
  amounts: number[]; // Different amounts in batch
  totalValue: number;
  averageAmount: number;
  
  // Purchase Information
  purchasedBy: string;
  corporateAccountId?: string;
  purchaseOrderNumber?: string;
  costCenter?: string;
  budgetCode?: string;
  
  // Processing Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  processingProgress: number; // percentage
  startedAt?: Date;
  completedAt?: Date;
  errorSummary?: string;
  
  // Delivery Configuration
  deliveryMethod: 'email' | 'bulk_download' | 'api' | 'scheduled';
  deliveryStatus: 'pending' | 'sent' | 'completed' | 'failed';
  deliveryDate?: Date;
  scheduledDelivery?: Date;
  
  // Recipients Configuration
  recipientList?: Array<{
    email: string;
    name?: string;
    amount?: number;
    customMessage?: string;
    employeeId?: string;
    department?: string;
    metadata?: Record<string, any>;
  }>;
  
  // File Management
  recipientFileUrl?: string;
  outputFileUrl?: string;
  downloadLinks: Array<{
    type: 'csv' | 'excel' | 'pdf' | 'zip';
    url: string;
    expiresAt: Date;
  }>;
  
  // Analytics
  redemptionRate: number;
  totalRedemptionValue: number;
  averageRedemptionTime: number; // hours
  
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  processedBy?: string;
  version: number;
  
  // Relationships
  giftCards?: ServiceGiftCardEntity[];
  template?: GiftCardTemplateEntity;
  corporateProgram?: CorporateGiftProgramEntity;
}

// Corporate Gift Program Management
export interface CorporateGiftProgramEntity {
  // Basic Information
  id: string;
  name: string;
  description: string;
  programCode: string;
  
  // Corporate Account
  corporateAccountId: string;
  corporateAccountName: string;
  departmentIds?: string[];
  contactPersonId: string;
  
  // Program Configuration
  programType: 'employee_recognition' | 'client_appreciation' | 'seasonal_gifts' | 'milestone_rewards' | 'performance_bonus' | 'custom';
  isActive: boolean;
  autoApproval: boolean;
  requiresBudgetApproval: boolean;
  
  // Budget & Limits
  totalBudget?: number;
  usedBudget: number;
  remainingBudget?: number;
  monthlyBudget?: number;
  quarterlyBudget?: number;
  
  // Amount Limits
  maxAmountPerGift: number;
  maxAmountPerEmployee: number;
  maxAmountPerMonth: number;
  maxQuantityPerOrder: number;
  
  // Template Restrictions
  allowedTemplates: string[];
  restrictedTemplates?: string[];
  customTemplatesAllowed: boolean;
  brandingRequired: boolean;
  
  // Approval Workflow
  approvalWorkflow: {
    enabled: boolean;
    rules: Array<{
      condition: string; // amount > 100, quantity > 50, etc.
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
  
  // Delivery Preferences
  defaultDeliveryMethod: 'email' | 'portal' | 'bulk_download';
  deliverySchedule?: {
    frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
    time?: string; // HH:mm format
    dayOfWeek?: number; // 0-6
    dayOfMonth?: number; // 1-31
  };
  
  // Reporting & Analytics
  reportingFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  reportRecipients: string[]; // email addresses
  includeUsageAnalytics: boolean;
  includeROIMetrics: boolean;
  
  // Program Metrics
  totalGiftsIssued: number;
  totalValueIssued: number;
  redemptionRate: number;
  employeeParticipationRate: number;
  averageGiftValue: number;
  costPerParticipant: number;
  
  // Compliance & Security
  complianceNotes?: string;
  dataRetentionPeriod: number; // months
  auditRequired: boolean;
  lastAuditDate?: Date;
  nextAuditDate?: Date;
  
  // Program Lifecycle
  startDate: Date;
  endDate?: Date;
  lastActivityDate?: Date;
  
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
  version: number;
  
  // Relationships
  giftCards?: ServiceGiftCardEntity[];
  batches?: GiftCardBatchEntity[];
  approvals?: GiftCardApprovalEntity[];
}

// Gift Card Approval Workflow
export interface GiftCardApprovalEntity {
  // Basic Information
  id: string;
  giftCardId?: string;
  batchId?: string;
  corporateProgramId?: string;
  
  // Request Information
  requestType: 'single_gift_card' | 'batch_purchase' | 'program_creation' | 'budget_increase';
  requestedBy: string;
  requestedByName: string;
  requestedByRole: string;
  requestDate: Date;
  
  // Request Details
  requestDetails: {
    amount?: number;
    quantity?: number;
    recipients?: number;
    templateId?: string;
    justification: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    businessReason: string;
  };
  
  // Approval Status
  status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'cancelled' | 'expired';
  currentApprovalLevel: number;
  requiredApprovalLevel: number;
  
  // Approvers
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
  
  // Timeline & SLA
  requestedCompletionDate?: Date;
  expectedApprovalDate?: Date;
  slaBreachAt?: Date;
  actualCompletionDate?: Date;
  
  // Communication
  notificationsSent: Array<{
    type: 'request' | 'approval' | 'rejection' | 'escalation' | 'reminder';
    sentTo: string[];
    sentAt: Date;
    template: string;
  }>;
  
  // Escalation
  escalationHistory: Array<{
    level: number;
    escalatedAt: Date;
    escalatedTo: string;
    reason: string;
    escalatedBy: 'system' | 'user';
  }>;
  
  // Comments & Communication
  comments: Array<{
    commentId: string;
    userId: string;
    userName: string;
    comment: string;
    isInternal: boolean;
    timestamp: Date;
  }>;
  
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
  processedBy?: string;
  
  // Relationships
  giftCard?: ServiceGiftCardEntity;
  batch?: GiftCardBatchEntity;
  corporateProgram?: CorporateGiftProgramEntity;
}

// Gift Card Analytics & Reporting
export interface GiftCardAnalyticsEntity {
  // Basic Information
  id: string;
  reportType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom';
  reportDate: Date;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  
  // Sales Metrics
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
  
  // Redemption Metrics
  redemptionMetrics: {
    totalRedemptions: number;
    totalRedemptionValue: number;
    averageRedemptionValue: number;
    redemptionRate: number;
    timeToFirstRedemption: number; // average hours
    fullyRedeemedCards: number;
    partiallyRedeemedCards: number;
    redemptionsByService: Array<{
      serviceId: string;
      serviceName: string;
      redemptions: number;
      value: number;
    }>;
  };
  
  // Outstanding Balance Metrics
  balanceMetrics: {
    totalOutstandingBalance: number;
    totalActiveCards: number;
    averageRemainingBalance: number;
    balanceDistribution: Array<{
      range: string; // "0-25", "26-50", etc.
      count: number;
      totalBalance: number;
    }>;
    expiringWithinMonth: {
      count: number;
      totalBalance: number;
    };
  };
  
  // Template Performance
  templateMetrics: Array<{
    templateId: string;
    templateName: string;
    sales: number;
    revenue: number;
    redemptionRate: number;
    averageRating: number;
    popularityScore: number;
  }>;
  
  // Corporate Program Metrics
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
  
  // Customer Insights
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
  
  // Geographic Analytics
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
  
  // Seasonal & Trend Analysis
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
      salesGrowth: number; // percentage
      customerGrowth: number;
      redemptionGrowth: number;
    };
  };
  
  // Audit Fields
  generatedAt: Date;
  generatedBy: string;
  lastUpdated: Date;
  version: number;
  
  // File Links
  reportFiles: Array<{
    type: 'pdf' | 'excel' | 'csv';
    url: string;
    size: number;
    generatedAt: Date;
    expiresAt: Date;
  }>;
}

// API Response Types
export interface GiftCardAPIResponse<T> {
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

export interface PaginatedGiftCardResponse<T> extends GiftCardAPIResponse<T[]> {
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