/**
 * Comprehensive Flash Sales Management Entities
 * B2B Service Marketplace - Enterprise Flash Sale Campaigns
 * 
 * Handles enterprise flash sale campaigns, time-limited offers, inventory allocation,
 * and comprehensive flash sale lifecycle management for B2B marketplace
 */

// Core Flash Sale Entities
export interface ServiceFlashSaleEntity {
  // Basic Information
  id: string;
  campaignCode: string; // Unique campaign identifier
  title: string;
  description: string;
  campaignType: 'flash_sale' | 'daily_deal' | 'limited_time_offer' | 'clearance' | 'seasonal' | 'promotional' | 'enterprise_exclusive';
  
  // Timeline Configuration
  startTime: Date;
  endTime: Date;
  plannedStartTime?: Date; // For rescheduled campaigns
  plannedEndTime?: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  timeZone: string;
  
  // Status & Lifecycle
  status: 'draft' | 'scheduled' | 'queued' | 'active' | 'paused' | 'ended' | 'cancelled' | 'expired';
  autoStart: boolean;
  autoEnd: boolean;
  gracePeriodMinutes: number; // Extra time after official end
  
  // Discount Configuration
  discountType: 'percentage' | 'fixed_amount' | 'tiered' | 'buy_x_get_y' | 'bundle' | 'volume_based' | 'spend_threshold';
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderValue?: number;
  maxOrderValue?: number;
  
  // Tiered Discount Configuration
  tieredDiscounts?: Array<{
    threshold: number;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
    maxDiscount?: number;
  }>;
  
  // Buy X Get Y Configuration
  buyXGetY?: {
    buyQuantity: number;
    getQuantity: number;
    getDiscountPercentage: number;
    maxApplications?: number;
    applicableProducts?: string[]; // product IDs for 'get' items
  };
  
  // Volume Based Discounts
  volumeDiscounts?: Array<{
    minQuantity: number;
    maxQuantity?: number;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
  }>;
  
  // Inventory & Allocation Management
  totalInventory: number;
  allocatedInventory: number;
  soldQuantity: number;
  reservedQuantity: number;
  remainingQuantity: number;
  allowOverselling: boolean;
  stockBuffer: number; // Safety stock percentage
  
  // Enterprise Features
  corporateAccountIds?: string[]; // Exclusive access for specific accounts
  customerTiers?: string[]; // Premium, VIP, etc.
  geographicRestrictions?: {
    allowedCountries?: string[];
    allowedRegions?: string[];
    excludedCountries?: string[];
    excludedRegions?: string[];
  };
  
  // B2B Configuration
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  bulkPricingTiers?: Array<{
    minQuantity: number;
    discountPercentage: number;
  }>;
  requiresApproval: boolean;
  approverId?: string;
  approvalDate?: Date;
  budgetCode?: string;
  costCenter?: string;
  
  // Participation Limits
  customerLimits: {
    maxOrdersPerCustomer: number;
    maxQuantityPerCustomer: number;
    maxAmountPerCustomer: number;
    allowRepeatPurchases: boolean;
    cooldownPeriodHours?: number;
  };
  
  // Visibility & Access
  visibility: 'public' | 'private' | 'corporate_only' | 'tier_restricted' | 'invitation_only';
  accessCode?: string; // For private sales
  invitationList?: string[]; // Customer IDs with access
  previewStartTime?: Date; // Early access for VIPs
  
  // Marketing & Promotion
  bannerImage?: string;
  heroImage?: string;
  galleryImages: string[];
  marketingCopy?: {
    headline: string;
    subheadline?: string;
    callToAction: string;
    urgencyMessage?: string;
    benefitPoints: string[];
    terms?: string;
  };
  
  // SEO & Discovery
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  metaTags?: Record<string, string>;
  
  // Priority & Display
  priority: number; // Higher number = higher priority
  displayOrder: number;
  isFeatured: boolean;
  featuredUntil?: Date;
  showCountdown: boolean;
  showRemainingStock: boolean;
  showSavingsAmount: boolean;
  
  // Performance Thresholds
  performanceThresholds: {
    lowStockAlert: number; // Percentage
    highDemandAlert: number; // Orders per hour
    lowPerformanceAlert: number; // Conversion rate threshold
    successTarget?: number; // Revenue target
  };
  
  // Analytics Configuration
  trackingPixels?: string[];
  utmParameters?: {
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
  };
  conversionGoals?: Array<{
    type: 'revenue' | 'quantity' | 'orders' | 'new_customers';
    target: number;
    currentValue: number;
    achieved: boolean;
  }>;
  
  // Integration & External Systems
  externalCampaignId?: string;
  sourceSystem?: string;
  syncStatus: 'synced' | 'pending' | 'failed';
  lastSyncDate?: Date;
  
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
  lastModifiedBy?: string;
  version: number;
  
  // Relationships
  services?: FlashSaleServiceEntity[];
  templates?: FlashSaleTemplateEntity[];
  activities?: FlashSaleActivityEntity[];
  analytics?: FlashSaleAnalyticsEntity[];
  notifications?: FlashSaleNotificationEntity[];
  participants?: FlashSaleParticipantEntity[];
}

// Service Items in Flash Sale
export interface FlashSaleServiceEntity {
  // Basic Information
  id: string;
  flashSaleId: string;
  serviceId: string;
  serviceName: string;
  serviceDescription?: string;
  serviceCategory: string;
  serviceSubcategory?: string;
  vendorId: string;
  vendorName: string;
  
  // Pricing Information
  originalPrice: number;
  salePrice: number;
  discountAmount: number;
  discountPercentage: number;
  finalPrice: number; // After all discounts and fees
  currency: string;
  
  // Service-Specific Pricing
  pricingModel: 'fixed' | 'hourly' | 'project_based' | 'subscription' | 'tiered';
  minimumServiceDuration?: number; // hours
  maximumServiceDuration?: number;
  
  // Inventory & Availability
  totalSlots: number; // Service capacity
  bookedSlots: number;
  reservedSlots: number;
  availableSlots: number;
  allowOverbooking: boolean;
  bufferSlots: number;
  
  // Service Delivery Timeframes
  earliestStartDate?: Date;
  latestStartDate?: Date;
  deliveryTimeframe: {
    estimatedDays: number;
    minimumDays: number;
    maximumDays: number;
  };
  
  // Flash Sale Specific Configuration
  isActive: boolean;
  isPromoted: boolean;
  promotionLevel: 'standard' | 'featured' | 'premium' | 'exclusive';
  displayOrder: number;
  
  // Service Restrictions
  serviceRestrictions: {
    geographicLimitations?: string[];
    customerRequirements?: string[];
    technicalRequirements?: string[];
    complianceRequirements?: string[];
    industryRestrictions?: string[];
  };
  
  // B2B Service Features
  enterpriseFeatures: {
    customTerms: boolean;
    dedicatedSupport: boolean;
    slaGuarantee: boolean;
    priorityDelivery: boolean;
    bulkDiscountAvailable: boolean;
  };
  
  // Quality & Ratings
  serviceRating: number;
  totalReviews: number;
  qualityScore: number;
  vendorRating: number;
  certifications: string[];
  
  // Performance Metrics
  conversionRate: number;
  clickCount: number;
  viewCount: number;
  addToCartCount: number;
  orderCount: number;
  revenue: number;
  
  // Service Packages/Tiers
  serviceTiers?: Array<{
    tierId: string;
    tierName: string;
    tierDescription: string;
    originalPrice: number;
    salePrice: number;
    features: string[];
    limitations?: string[];
    isPopular?: boolean;
  }>;
  
  // Add-ons and Upsells
  availableAddOns?: Array<{
    addOnId: string;
    name: string;
    description: string;
    price: number;
    discountedPrice?: number;
    isRecommended: boolean;
  }>;
  
  // Audit Fields
  addedAt: Date;
  addedBy: string;
  updatedAt: Date;
  updatedBy?: string;
  
  // Relationships
  flashSale?: ServiceFlashSaleEntity;
  orders?: any[]; // OrderEntity references
  analytics?: FlashSaleServiceAnalyticsEntity[];
}

// Flash Sale Service Analytics
export interface FlashSaleServiceAnalyticsEntity {
  id: string;
  flashSaleId: string;
  serviceId: string;
  
  // Performance Metrics
  impressions: number;
  uniqueViews: number;
  clicks: number;
  clickThroughRate: number;
  addToCartCount: number;
  addToCartRate: number;
  
  // Conversion Metrics
  ordersPlaced: number;
  orderConversionRate: number;
  revenue: number;
  averageOrderValue: number;
  totalQuantitySold: number;
  
  // Time-based Analytics
  peakHour: number; // 0-23
  peakDay: string; // day of week
  hourlyBreakdown: Record<number, {
    views: number;
    clicks: number;
    orders: number;
    revenue: number;
  }>;
  
  // Customer Analytics
  newCustomerOrders: number;
  returningCustomerOrders: number;
  customerRetentionRate: number;
  averageCustomerValue: number;
  
  // Competitive Metrics
  marketShareWithinSale: number; // Percentage of total flash sale revenue
  rankWithinSale: number;
  comparisonToPrevious: {
    revenueChange: number;
    orderChange: number;
    conversionChange: number;
  };
  
  // Geographic Performance
  topRegions: Array<{
    region: string;
    orders: number;
    revenue: number;
    conversionRate: number;
  }>;
  
  // Device and Channel Analytics
  deviceBreakdown: Record<'desktop' | 'mobile' | 'tablet', {
    views: number;
    orders: number;
    conversionRate: number;
  }>;
  
  channelBreakdown: Record<string, {
    views: number;
    orders: number;
    revenue: number;
  }>;
  
  // Engagement Metrics
  averageTimeOnPage: number; // seconds
  bounceRate: number;
  pagesPerSession: number;
  sessionDuration: number;
  
  // Generated timestamp
  generatedAt: Date;
  
  // Relationships
  flashSale?: ServiceFlashSaleEntity;
  service?: FlashSaleServiceEntity;
}

// Flash Sale Template Management
export interface FlashSaleTemplateEntity {
  // Basic Information
  id: string;
  name: string;
  description: string;
  templateCode: string;
  category: 'seasonal' | 'clearance' | 'promotional' | 'enterprise' | 'product_launch' | 'end_of_quarter' | 'custom';
  
  // Template Configuration
  defaultDuration: number; // hours
  defaultDiscountType: ServiceFlashSaleEntity['discountType'];
  defaultDiscountValue: number;
  defaultMaxDiscount?: number;
  defaultMinOrderValue?: number;
  
  // Visual Design Template
  designTemplate: {
    bannerTemplate: string; // HTML/CSS template
    colorScheme: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
    };
    fonts: {
      heading: string;
      body: string;
      cta: string;
    };
    layout: 'grid' | 'carousel' | 'list' | 'masonry';
    animations: boolean;
  };
  
  // Content Templates
  contentTemplates: {
    headline: string;
    subheadline?: string;
    callToAction: string;
    urgencyMessage: string;
    emailSubject: string;
    emailBody: string;
    smsMessage: string;
    pushNotificationTitle: string;
    pushNotificationBody: string;
  };
  
  // Business Rules Template
  defaultBusinessRules: {
    customerLimits: ServiceFlashSaleEntity['customerLimits'];
    geographicRestrictions?: ServiceFlashSaleEntity['geographicRestrictions'];
    customerTiers?: string[];
    requiresApproval: boolean;
    visibility: ServiceFlashSaleEntity['visibility'];
  };
  
  // Service Selection Rules
  serviceSelectionRules: {
    selectionMethod: 'manual' | 'category' | 'trending' | 'clearance' | 'new_services' | 'vendor_specific' | 'ai_recommended';
    categoryIds?: string[];
    vendorIds?: string[];
    serviceAttributes?: Record<string, any>;
    excludeAttributes?: Record<string, any>;
    minimumRating?: number;
    maximumAge?: number; // days since service creation
  };
  
  // Notification Templates
  notificationSettings: {
    enablePreLaunch: boolean;
    preLaunchHours: number;
    enableStartNotification: boolean;
    enableEndingSoon: boolean;
    endingSoonHours: number;
    enableEndNotification: boolean;
    customSchedule?: Array<{
      hoursBeforeEnd: number;
      message: string;
      channels: string[];
    }>;
  };
  
  // Performance Targets
  performanceTargets: {
    revenueTarget?: number;
    orderTarget?: number;
    conversionTarget?: number;
    participationTarget?: number;
    newCustomerTarget?: number;
  };
  
  // Template Metadata
  isActive: boolean;
  isPublic: boolean; // Can be used by other accounts
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  usageCount: number;
  successRate: number;
  averagePerformance: {
    conversionRate: number;
    averageRevenue: number;
    customerSatisfaction: number;
  };
  
  // Customization Options
  customizationOptions: {
    allowDiscountModification: boolean;
    allowDurationModification: boolean;
    allowContentModification: boolean;
    allowDesignModification: boolean;
    allowBusinessRuleModification: boolean;
    requiredApprovals: string[]; // approval types needed for modifications
  };
  
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
  lastModifiedBy?: string;
  version: number;
  
  // Relationships
  flashSales?: ServiceFlashSaleEntity[];
}

// Flash Sale Activity Tracking
export interface FlashSaleActivityEntity {
  // Basic Information
  id: string;
  flashSaleId: string;
  activityType: 'created' | 'scheduled' | 'started' | 'paused' | 'resumed' | 'extended' | 'ended' | 'cancelled' | 'product_added' | 'product_removed' | 'price_updated' | 'inventory_updated' | 'milestone_reached' | 'threshold_alert' | 'low_stock_alert' | 'high_demand_alert';
  
  // Activity Details
  description: string;
  details: Record<string, any>;
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  
  // Actor Information
  actorType: 'user' | 'system' | 'api' | 'scheduler' | 'automation';
  actorId?: string;
  actorName?: string;
  actorRole?: string;
  
  // Context Information
  sessionId?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  
  // Impact Assessment
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  affectedServices?: string[];
  affectedCustomers?: number;
  revenueImpact?: number;
  
  // System Information
  systemSource: 'web_admin' | 'mobile_admin' | 'api' | 'bulk_operation' | 'scheduled_task' | 'monitoring_system';
  apiVersion?: string;
  
  // Alert Information
  isAlert: boolean;
  alertLevel?: 'info' | 'warning' | 'error' | 'critical';
  alertResolved: boolean;
  alertResolvedAt?: Date;
  alertResolvedBy?: string;
  
  // Notification Status
  notificationsSent: string[]; // List of notification types sent
  notificationsFailed: string[];
  
  // Audit Fields
  timestamp: Date;
  createdAt: Date;
  
  // Relationships
  flashSale?: ServiceFlashSaleEntity;
}

// Flash Sale Notification Management
export interface FlashSaleNotificationEntity {
  // Basic Information
  id: string;
  flashSaleId: string;
  notificationType: 'pre_launch' | 'launch' | 'reminder' | 'last_chance' | 'ended' | 'extended' | 'cancelled' | 'custom';
  
  // Notification Configuration
  title: string;
  message: string;
  channels: ('email' | 'sms' | 'push' | 'in_app' | 'webhook')[];
  
  // Scheduling
  scheduledAt: Date;
  sentAt?: Date;
  deliveryStatus: 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled';
  
  // Targeting
  targetAudience: 'all_customers' | 'flash_sale_subscribers' | 'previous_participants' | 'vip_customers' | 'custom_segment' | 'specific_list';
  audienceFilter?: {
    customerTiers?: string[];
    geographicRegions?: string[];
    previousPurchaseAmount?: { min?: number; max?: number };
    lastActivityDays?: number;
    customAttributes?: Record<string, any>;
  };
  
  // Recipient Management
  totalRecipients: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  optedOutRecipients: number;
  
  // Content Personalization
  personalizationData?: Record<string, any>;
  dynamicContent?: {
    useCustomerName: boolean;
    useRecommendedServices: boolean;
    useLocationBasedOffers: boolean;
    usePreviousPurchaseData: boolean;
  };
  
  // Performance Tracking
  deliveryMetrics: {
    openRate?: number; // for email
    clickRate?: number;
    conversionRate?: number;
    unsubscribeRate?: number;
    bounceRate?: number;
    spamComplaintRate?: number;
  };
  
  // A/B Testing
  isABTest: boolean;
  abTestGroup?: 'A' | 'B';
  abTestMetrics?: {
    variant: string;
    openRate: number;
    clickRate: number;
    conversionRate: number;
  };
  
  // Retry Logic
  retryAttempts: number;
  maxRetryAttempts: number;
  retryIntervalMinutes: number;
  lastRetryAt?: Date;
  
  // Compliance & Legal
  requiresConsent: boolean;
  consentObtained: boolean;
  gdprCompliant: boolean;
  canSpamCompliant: boolean;
  
  // Integration Information
  externalNotificationId?: string;
  providerDetails?: {
    emailProvider?: string;
    smsProvider?: string;
    pushProvider?: string;
  };
  
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Relationships
  flashSale?: ServiceFlashSaleEntity;
  recipients?: FlashSaleNotificationRecipientEntity[];
}

// Notification Recipient Tracking
export interface FlashSaleNotificationRecipientEntity {
  id: string;
  notificationId: string;
  customerId: string;
  customerEmail: string;
  customerPhone?: string;
  
  // Delivery Status per Channel
  deliveryStatus: Record<string, {
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'opted_out';
    sentAt?: Date;
    deliveredAt?: Date;
    failureReason?: string;
    externalId?: string;
  }>;
  
  // Engagement Tracking
  engagementMetrics: {
    opened: boolean;
    openedAt?: Date;
    clicked: boolean;
    clickedAt?: Date;
    converted: boolean;
    convertedAt?: Date;
    conversionValue?: number;
  };
  
  // Personalization Data
  personalizedContent?: Record<string, any>;
  
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  notification?: FlashSaleNotificationEntity;
}

// Flash Sale Participant Tracking
export interface FlashSaleParticipantEntity {
  // Basic Information
  id: string;
  flashSaleId: string;
  customerId: string;
  customerEmail: string;
  customerName?: string;
  customerType: 'individual' | 'business' | 'enterprise';
  
  // Participation Details
  firstVisitAt: Date;
  lastVisitAt: Date;
  totalVisits: number;
  totalPageViews: number;
  sessionDuration: number; // total seconds
  
  // Engagement Metrics
  servicesViewed: string[];
  servicesClickedCount: Record<string, number>;
  addToCartEvents: number;
  addToWishlistEvents: number;
  shareEvents: number;
  
  // Purchase Behavior
  totalOrders: number;
  totalOrderValue: number;
  averageOrderValue: number;
  firstOrderAt?: Date;
  lastOrderAt?: Date;
  orderedServices: string[];
  
  // Customer Journey
  customerJourney: Array<{
    timestamp: Date;
    action: 'visited' | 'viewed_service' | 'added_to_cart' | 'removed_from_cart' | 'started_checkout' | 'completed_order' | 'abandoned_cart';
    serviceId?: string;
    details?: Record<string, any>;
  }>;
  
  // Traffic Source
  trafficSource: {
    source: string; // direct, email, social, organic, paid
    medium: string;
    campaign?: string;
    referrer?: string;
    utmParameters?: Record<string, string>;
  };
  
  // Device and Location
  deviceInfo: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
    screenResolution?: string;
  };
  
  locationInfo: {
    country: string;
    region: string;
    city?: string;
    timezone?: string;
    ipAddress?: string;
  };
  
  // Preferences and Behavior
  preferences: {
    preferredContactChannel: 'email' | 'sms' | 'push' | 'none';
    marketingOptIn: boolean;
    notificationOptIn: boolean;
    reminderOptIn: boolean;
  };
  
  // Performance Scores
  engagementScore: number; // 0-100
  conversionProbability: number; // 0-1
  lifetimeValue: number;
  
  // Segmentation
  customerSegment: 'new' | 'returning' | 'vip' | 'at_risk' | 'high_value' | 'price_sensitive';
  
  // Feedback and Satisfaction
  satisfactionRating?: number; // 1-5
  feedbackProvided: boolean;
  feedbackText?: string;
  recommendationScore?: number; // NPS style
  
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  flashSale?: ServiceFlashSaleEntity;
  orders?: any[]; // OrderEntity references
}

// Flash Sale Analytics Aggregation
export interface FlashSaleAnalyticsEntity {
  // Basic Information
  id: string;
  flashSaleId: string;
  reportType: 'real_time' | 'hourly' | 'daily' | 'final';
  reportDate: Date;
  
  // Revenue Metrics
  revenueMetrics: {
    totalRevenue: number;
    targetRevenue?: number;
    revenueProgress: number; // percentage
    averageOrderValue: number;
    revenueByHour: Array<{
      hour: number;
      revenue: number;
      orders: number;
    }>;
    revenueByService: Array<{
      serviceId: string;
      serviceName: string;
      revenue: number;
      percentage: number;
    }>;
  };
  
  // Order Metrics
  orderMetrics: {
    totalOrders: number;
    targetOrders?: number;
    orderProgress: number;
    successfulOrders: number;
    cancelledOrders: number;
    refundedOrders: number;
    ordersByHour: Array<{
      hour: number;
      orders: number;
      successRate: number;
    }>;
  };
  
  // Inventory Metrics
  inventoryMetrics: {
    totalInventory: number;
    soldQuantity: number;
    remainingQuantity: number;
    inventoryTurnover: number;
    stockoutEvents: number;
    oversoldQuantity: number;
    inventoryByService: Array<{
      serviceId: string;
      serviceName: string;
      totalSlots: number;
      bookedSlots: number;
      utilizationRate: number;
    }>;
  };
  
  // Customer Metrics
  customerMetrics: {
    totalParticipants: number;
    uniqueCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    customerRetentionRate: number;
    averageCustomerValue: number;
    customersWithMultipleOrders: number;
    customersBySegment: Record<string, number>;
  };
  
  // Conversion Metrics
  conversionMetrics: {
    overallConversionRate: number;
    targetConversionRate?: number;
    conversionProgress: number;
    viewToCartRate: number;
    cartToOrderRate: number;
    abandonmentRate: number;
    conversionByTrafficSource: Record<string, {
      visitors: number;
      conversions: number;
      conversionRate: number;
    }>;
  };
  
  // Traffic Metrics
  trafficMetrics: {
    totalViews: number;
    uniqueVisitors: number;
    totalSessions: number;
    averageSessionDuration: number;
    bounceRate: number;
    pagesPerSession: number;
    trafficSources: Record<string, {
      visitors: number;
      sessions: number;
      conversionRate: number;
    }>;
  };
  
  // Geographic Metrics
  geographicMetrics: {
    topCountries: Array<{
      country: string;
      visitors: number;
      orders: number;
      revenue: number;
      conversionRate: number;
    }>;
    topRegions: Array<{
      region: string;
      visitors: number;
      orders: number;
      revenue: number;
    }>;
  };
  
  // Device and Channel Analytics
  deviceMetrics: {
    desktop: { visitors: number; orders: number; revenue: number; conversionRate: number; };
    mobile: { visitors: number; orders: number; revenue: number; conversionRate: number; };
    tablet: { visitors: number; orders: number; revenue: number; conversionRate: number; };
  };
  
  // Performance Benchmarks
  benchmarkComparisons: {
    industryAverage?: {
      conversionRate: number;
      averageOrderValue: number;
      customerRetention: number;
    };
    previousCampaigns?: {
      bestPerforming: {
        campaignId: string;
        conversionRate: number;
        revenue: number;
      };
      averagePerformance: {
        conversionRate: number;
        revenue: number;
      };
    };
  };
  
  // Predictive Analytics
  predictions?: {
    projectedFinalRevenue: number;
    projectedFinalOrders: number;
    projectedConversionRate: number;
    confidence: number; // 0-1
    timeToStockout?: number; // hours
  };
  
  // Alert Conditions
  alertConditions: {
    lowPerformanceAlert: boolean;
    highDemandAlert: boolean;
    lowStockAlert: boolean;
    conversionDropAlert: boolean;
    technicalIssueAlert: boolean;
  };
  
  // Generated timestamp
  generatedAt: Date;
  dataFreshnessMinutes: number;
  
  // Relationships
  flashSale?: ServiceFlashSaleEntity;
}

// API Response Types
export interface FlashSaleAPIResponse<T> {
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
    performance?: {
      queryTime: number;
      cacheHit: boolean;
      dataSource: string;
    };
  };
}

export interface PaginatedFlashSaleResponse<T> extends FlashSaleAPIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  aggregations?: {
    totalRevenue: number;
    totalOrders: number;
    averageConversionRate: number;
    statusBreakdown: Record<string, number>;
    timeBreakdown: {
      active: number;
      scheduled: number;
      ended: number;
      cancelled: number;
    };
  };
}