/**
 * Comprehensive B2B Flash Sales API Service
 * 
 * Handles enterprise flash sale campaigns, time-limited offers, inventory allocation,
 * and comprehensive flash sale lifecycle management for B2B marketplace
 */

import api from './client';

// Backend Entity Types for Flash Sale Management
type ServiceFlashSaleEntity = {
  // Basic Information
  id: string;
  campaignCode: string;
  title: string;
  description: string;
  campaignType: 'flash_sale' | 'daily_deal' | 'limited_time_offer' | 'clearance' | 'seasonal' | 'promotional' | 'enterprise_exclusive';
  
  // Timeline Configuration
  startTime: Date;
  endTime: Date;
  plannedStartTime?: Date;
  plannedEndTime?: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  timeZone: string;
  
  // Status & Lifecycle
  status: 'draft' | 'scheduled' | 'queued' | 'active' | 'paused' | 'ended' | 'cancelled' | 'expired';
  autoStart: boolean;
  autoEnd: boolean;
  gracePeriodMinutes: number;
  
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
    applicableProducts?: string[];
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
  stockBuffer: number;
  
  // Enterprise Features
  corporateAccountIds?: string[];
  customerTiers?: string[];
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
  accessCode?: string;
  invitationList?: string[];
  previewStartTime?: Date;
  
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
  priority: number;
  displayOrder: number;
  isFeatured: boolean;
  featuredUntil?: Date;
  showCountdown: boolean;
  showRemainingStock: boolean;
  showSavingsAmount: boolean;
  
  // Performance Thresholds
  performanceThresholds: {
    lowStockAlert: number;
    highDemandAlert: number;
    lowPerformanceAlert: number;
    successTarget?: number;
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
};

type FlashSaleServiceEntity = {
  id: string;
  flashSaleId: string;
  serviceId: string;
  serviceName: string;
  serviceDescription?: string;
  serviceCategory: string;
  serviceSubcategory?: string;
  vendorId: string;
  vendorName: string;
  
  originalPrice: number;
  salePrice: number;
  discountAmount: number;
  discountPercentage: number;
  finalPrice: number;
  currency: string;
  
  pricingModel: 'fixed' | 'hourly' | 'project_based' | 'subscription' | 'tiered';
  minimumServiceDuration?: number;
  maximumServiceDuration?: number;
  
  totalSlots: number;
  bookedSlots: number;
  reservedSlots: number;
  availableSlots: number;
  allowOverbooking: boolean;
  bufferSlots: number;
  
  earliestStartDate?: Date;
  latestStartDate?: Date;
  deliveryTimeframe: {
    estimatedDays: number;
    minimumDays: number;
    maximumDays: number;
  };
  
  isActive: boolean;
  isPromoted: boolean;
  promotionLevel: 'standard' | 'featured' | 'premium' | 'exclusive';
  displayOrder: number;
  
  serviceRestrictions: {
    geographicLimitations?: string[];
    customerRequirements?: string[];
    technicalRequirements?: string[];
    complianceRequirements?: string[];
    industryRestrictions?: string[];
  };
  
  enterpriseFeatures: {
    customTerms: boolean;
    dedicatedSupport: boolean;
    slaGuarantee: boolean;
    priorityDelivery: boolean;
    bulkDiscountAvailable: boolean;
  };
  
  serviceRating: number;
  totalReviews: number;
  qualityScore: number;
  vendorRating: number;
  certifications: string[];
  
  conversionRate: number;
  clickCount: number;
  viewCount: number;
  addToCartCount: number;
  orderCount: number;
  revenue: number;
  
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
  
  availableAddOns?: Array<{
    addOnId: string;
    name: string;
    description: string;
    price: number;
    discountedPrice?: number;
    isRecommended: boolean;
  }>;
  
  addedAt: Date;
  addedBy: string;
  updatedAt: Date;
  updatedBy?: string;
  
  flashSale?: ServiceFlashSaleEntity;
  orders?: any[];
  analytics?: FlashSaleServiceAnalyticsEntity[];
};

type FlashSaleTemplateEntity = {
  id: string;
  name: string;
  description: string;
  templateCode: string;
  category: 'seasonal' | 'clearance' | 'promotional' | 'enterprise' | 'product_launch' | 'end_of_quarter' | 'custom';
  
  defaultDuration: number;
  defaultDiscountType: ServiceFlashSaleEntity['discountType'];
  defaultDiscountValue: number;
  defaultMaxDiscount?: number;
  defaultMinOrderValue?: number;
  
  designTemplate: {
    bannerTemplate: string;
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
  
  defaultBusinessRules: {
    customerLimits: ServiceFlashSaleEntity['customerLimits'];
    geographicRestrictions?: ServiceFlashSaleEntity['geographicRestrictions'];
    customerTiers?: string[];
    requiresApproval: boolean;
    visibility: ServiceFlashSaleEntity['visibility'];
  };
  
  serviceSelectionRules: {
    selectionMethod: 'manual' | 'category' | 'trending' | 'clearance' | 'new_services' | 'vendor_specific' | 'ai_recommended';
    categoryIds?: string[];
    vendorIds?: string[];
    serviceAttributes?: Record<string, any>;
    excludeAttributes?: Record<string, any>;
    minimumRating?: number;
    maximumAge?: number;
  };
  
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
  
  performanceTargets: {
    revenueTarget?: number;
    orderTarget?: number;
    conversionTarget?: number;
    participationTarget?: number;
    newCustomerTarget?: number;
  };
  
  isActive: boolean;
  isPublic: boolean;
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
  
  customizationOptions: {
    allowDiscountModification: boolean;
    allowDurationModification: boolean;
    allowContentModification: boolean;
    allowDesignModification: boolean;
    allowBusinessRuleModification: boolean;
    requiredApprovals: string[];
  };
  
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
  lastModifiedBy?: string;
  version: number;
  
  flashSales?: ServiceFlashSaleEntity[];
};

type FlashSaleActivityEntity = {
  id: string;
  flashSaleId: string;
  activityType: 'created' | 'scheduled' | 'started' | 'paused' | 'resumed' | 'extended' | 'ended' | 'cancelled' | 'product_added' | 'product_removed' | 'price_updated' | 'inventory_updated' | 'milestone_reached' | 'threshold_alert' | 'low_stock_alert' | 'high_demand_alert';
  
  description: string;
  details: Record<string, any>;
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  
  actorType: 'user' | 'system' | 'api' | 'scheduler' | 'automation';
  actorId?: string;
  actorName?: string;
  actorRole?: string;
  
  sessionId?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  affectedServices?: string[];
  affectedCustomers?: number;
  revenueImpact?: number;
  
  systemSource: 'web_admin' | 'mobile_admin' | 'api' | 'bulk_operation' | 'scheduled_task' | 'monitoring_system';
  apiVersion?: string;
  
  isAlert: boolean;
  alertLevel?: 'info' | 'warning' | 'error' | 'critical';
  alertResolved: boolean;
  alertResolvedAt?: Date;
  alertResolvedBy?: string;
  
  notificationsSent: string[];
  notificationsFailed: string[];
  
  timestamp: Date;
  createdAt: Date;
  
  flashSale?: ServiceFlashSaleEntity;
};

type FlashSaleAnalyticsEntity = {
  id: string;
  flashSaleId: string;
  reportType: 'real_time' | 'hourly' | 'daily' | 'final';
  reportDate: Date;
  
  revenueMetrics: {
    totalRevenue: number;
    targetRevenue?: number;
    revenueProgress: number;
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
  
  deviceMetrics: {
    desktop: { visitors: number; orders: number; revenue: number; conversionRate: number; };
    mobile: { visitors: number; orders: number; revenue: number; conversionRate: number; };
    tablet: { visitors: number; orders: number; revenue: number; conversionRate: number; };
  };
  
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
  
  predictions?: {
    projectedFinalRevenue: number;
    projectedFinalOrders: number;
    projectedConversionRate: number;
    confidence: number;
    timeToStockout?: number;
  };
  
  alertConditions: {
    lowPerformanceAlert: boolean;
    highDemandAlert: boolean;
    lowStockAlert: boolean;
    conversionDropAlert: boolean;
    technicalIssueAlert: boolean;
  };
  
  generatedAt: Date;
  dataFreshnessMinutes: number;
  
  flashSale?: ServiceFlashSaleEntity;
};

type FlashSaleNotificationEntity = {
  id: string;
  flashSaleId: string;
  notificationType: 'pre_launch' | 'launch' | 'reminder' | 'last_chance' | 'ended' | 'extended' | 'cancelled' | 'custom';
  
  title: string;
  message: string;
  channels: ('email' | 'sms' | 'push' | 'in_app' | 'webhook')[];
  
  scheduledAt: Date;
  sentAt?: Date;
  deliveryStatus: 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled';
  
  targetAudience: 'all_customers' | 'flash_sale_subscribers' | 'previous_participants' | 'vip_customers' | 'custom_segment' | 'specific_list';
  audienceFilter?: {
    customerTiers?: string[];
    geographicRegions?: string[];
    previousPurchaseAmount?: { min?: number; max?: number };
    lastActivityDays?: number;
    customAttributes?: Record<string, any>;
  };
  
  totalRecipients: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  optedOutRecipients: number;
  
  personalizationData?: Record<string, any>;
  dynamicContent?: {
    useCustomerName: boolean;
    useRecommendedServices: boolean;
    useLocationBasedOffers: boolean;
    usePreviousPurchaseData: boolean;
  };
  
  deliveryMetrics: {
    openRate?: number;
    clickRate?: number;
    conversionRate?: number;
    unsubscribeRate?: number;
    bounceRate?: number;
    spamComplaintRate?: number;
  };
  
  isABTest: boolean;
  abTestGroup?: 'A' | 'B';
  abTestMetrics?: {
    variant: string;
    openRate: number;
    clickRate: number;
    conversionRate: number;
  };
  
  retryAttempts: number;
  maxRetryAttempts: number;
  retryIntervalMinutes: number;
  lastRetryAt?: Date;
  
  requiresConsent: boolean;
  consentObtained: boolean;
  gdprCompliant: boolean;
  canSpamCompliant: boolean;
  
  externalNotificationId?: string;
  providerDetails?: {
    emailProvider?: string;
    smsProvider?: string;
    pushProvider?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  flashSale?: ServiceFlashSaleEntity;
  recipients?: FlashSaleNotificationRecipientEntity[];
};

type FlashSaleParticipantEntity = {
  id: string;
  flashSaleId: string;
  customerId: string;
  customerEmail: string;
  customerName?: string;
  customerType: 'individual' | 'business' | 'enterprise';
  
  firstVisitAt: Date;
  lastVisitAt: Date;
  totalVisits: number;
  totalPageViews: number;
  sessionDuration: number;
  
  servicesViewed: string[];
  servicesClickedCount: Record<string, number>;
  addToCartEvents: number;
  addToWishlistEvents: number;
  shareEvents: number;
  
  totalOrders: number;
  totalOrderValue: number;
  averageOrderValue: number;
  firstOrderAt?: Date;
  lastOrderAt?: Date;
  orderedServices: string[];
  
  customerJourney: Array<{
    timestamp: Date;
    action: 'visited' | 'viewed_service' | 'added_to_cart' | 'removed_from_cart' | 'started_checkout' | 'completed_order' | 'abandoned_cart';
    serviceId?: string;
    details?: Record<string, any>;
  }>;
  
  trafficSource: {
    source: string;
    medium: string;
    campaign?: string;
    referrer?: string;
    utmParameters?: Record<string, string>;
  };
  
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
  
  preferences: {
    preferredContactChannel: 'email' | 'sms' | 'push' | 'none';
    marketingOptIn: boolean;
    notificationOptIn: boolean;
    reminderOptIn: boolean;
  };
  
  engagementScore: number;
  conversionProbability: number;
  lifetimeValue: number;
  
  customerSegment: 'new' | 'returning' | 'vip' | 'at_risk' | 'high_value' | 'price_sensitive';
  
  satisfactionRating?: number;
  feedbackProvided: boolean;
  feedbackText?: string;
  recommendationScore?: number;
  
  createdAt: Date;
  updatedAt: Date;
  
  flashSale?: ServiceFlashSaleEntity;
  orders?: any[];
};

type FlashSaleServiceAnalyticsEntity = {
  id: string;
  flashSaleId: string;
  serviceId: string;
  
  impressions: number;
  uniqueViews: number;
  clicks: number;
  clickThroughRate: number;
  addToCartCount: number;
  addToCartRate: number;
  
  ordersPlaced: number;
  orderConversionRate: number;
  revenue: number;
  averageOrderValue: number;
  totalQuantitySold: number;
  
  peakHour: number;
  peakDay: string;
  hourlyBreakdown: Record<number, {
    views: number;
    clicks: number;
    orders: number;
    revenue: number;
  }>;
  
  newCustomerOrders: number;
  returningCustomerOrders: number;
  customerRetentionRate: number;
  averageCustomerValue: number;
  
  marketShareWithinSale: number;
  rankWithinSale: number;
  comparisonToPrevious: {
    revenueChange: number;
    orderChange: number;
    conversionChange: number;
  };
  
  topRegions: Array<{
    region: string;
    orders: number;
    revenue: number;
    conversionRate: number;
  }>;
  
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
  
  averageTimeOnPage: number;
  bounceRate: number;
  pagesPerSession: number;
  sessionDuration: number;
  
  generatedAt: Date;
  
  flashSale?: ServiceFlashSaleEntity;
  service?: FlashSaleServiceEntity;
};

type FlashSaleNotificationRecipientEntity = {
  id: string;
  notificationId: string;
  customerId: string;
  customerEmail: string;
  customerPhone?: string;
  
  deliveryStatus: Record<string, {
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'opted_out';
    sentAt?: Date;
    deliveredAt?: Date;
    failureReason?: string;
    externalId?: string;
  }>;
  
  engagementMetrics: {
    opened: boolean;
    openedAt?: Date;
    clicked: boolean;
    clickedAt?: Date;
    converted: boolean;
    convertedAt?: Date;
    conversionValue?: number;
  };
  
  personalizedContent?: Record<string, any>;
  
  createdAt: Date;
  updatedAt: Date;
  
  notification?: FlashSaleNotificationEntity;
};

// API Response Types
interface FlashSaleAPIResponse<T> {
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

interface PaginatedFlashSaleResponse<T> extends FlashSaleAPIResponse<T[]> {
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

// Enhanced Flash Sale Types for API Integration (replacing legacy types)
export interface ServiceFlashSale extends ServiceFlashSaleEntity {}
export interface FlashSaleService extends FlashSaleServiceEntity {}
export interface FlashSaleTemplate extends FlashSaleTemplateEntity {}
export interface FlashSaleActivity extends FlashSaleActivityEntity {}
export interface FlashSaleAnalytics extends FlashSaleAnalyticsEntity {}
export interface FlashSaleNotification extends FlashSaleNotificationEntity {}
export interface FlashSaleParticipant extends FlashSaleParticipantEntity {}
export interface FlashSaleServiceAnalytics extends FlashSaleServiceAnalyticsEntity {}

// Legacy compatibility aliases
export interface FlashSale extends ServiceFlashSale {}
export interface FlashSaleProduct extends FlashSaleService {}
export interface DailyDeal extends ServiceFlashSale {}

// Request/Response Data Types
export interface CreateFlashSaleData {
  title: string;
  description: string;
  campaignType: ServiceFlashSale['campaignType'];
  startTime: Date;
  endTime: Date;
  timeZone: string;
  
  discountType: ServiceFlashSale['discountType'];
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderValue?: number;
  maxOrderValue?: number;
  
  tieredDiscounts?: ServiceFlashSale['tieredDiscounts'];
  buyXGetY?: ServiceFlashSale['buyXGetY'];
  volumeDiscounts?: ServiceFlashSale['volumeDiscounts'];
  
  totalInventory: number;
  allowOverselling?: boolean;
  stockBuffer?: number;
  
  corporateAccountIds?: string[];
  customerTiers?: string[];
  geographicRestrictions?: ServiceFlashSale['geographicRestrictions'];
  
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  bulkPricingTiers?: ServiceFlashSale['bulkPricingTiers'];
  requiresApproval?: boolean;
  budgetCode?: string;
  costCenter?: string;
  
  customerLimits: ServiceFlashSale['customerLimits'];
  visibility: ServiceFlashSale['visibility'];
  accessCode?: string;
  invitationList?: string[];
  previewStartTime?: Date;
  
  bannerImage?: string;
  heroImage?: string;
  galleryImages?: string[];
  marketingCopy?: ServiceFlashSale['marketingCopy'];
  
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  
  priority?: number;
  isFeatured?: boolean;
  featuredUntil?: Date;
  showCountdown?: boolean;
  showRemainingStock?: boolean;
  showSavingsAmount?: boolean;
  
  performanceThresholds?: ServiceFlashSale['performanceThresholds'];
  trackingPixels?: string[];
  utmParameters?: ServiceFlashSale['utmParameters'];
  conversionGoals?: ServiceFlashSale['conversionGoals'];
  
  serviceIds: string[];
  templateId?: string;
  autoStart?: boolean;
  autoEnd?: boolean;
  gracePeriodMinutes?: number;
}

export interface UpdateFlashSaleData {
  title?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  discountValue?: number;
  maxDiscountAmount?: number;
  minOrderValue?: number;
  maxOrderValue?: number;
  
  tieredDiscounts?: ServiceFlashSale['tieredDiscounts'];
  buyXGetY?: ServiceFlashSale['buyXGetY'];
  volumeDiscounts?: ServiceFlashSale['volumeDiscounts'];
  
  totalInventory?: number;
  allowOverselling?: boolean;
  stockBuffer?: number;
  
  corporateAccountIds?: string[];
  customerTiers?: string[];
  geographicRestrictions?: ServiceFlashSale['geographicRestrictions'];
  
  customerLimits?: ServiceFlashSale['customerLimits'];
  visibility?: ServiceFlashSale['visibility'];
  accessCode?: string;
  invitationList?: string[];
  
  bannerImage?: string;
  heroImage?: string;
  galleryImages?: string[];
  marketingCopy?: ServiceFlashSale['marketingCopy'];
  
  priority?: number;
  isFeatured?: boolean;
  featuredUntil?: Date;
  showCountdown?: boolean;
  showRemainingStock?: boolean;
  showSavingsAmount?: boolean;
  
  performanceThresholds?: ServiceFlashSale['performanceThresholds'];
  conversionGoals?: ServiceFlashSale['conversionGoals'];
  
  status?: ServiceFlashSale['status'];
  autoStart?: boolean;
  autoEnd?: boolean;
  gracePeriodMinutes?: number;
}

export interface FlashSaleFilters {
  // Status and Lifecycle
  status?: ServiceFlashSale['status'][];
  campaignType?: ServiceFlashSale['campaignType'][];
  visibility?: ServiceFlashSale['visibility'][];
  
  // Date Filters
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  createdFrom?: string;
  createdTo?: string;
  
  // Performance Filters
  minRevenue?: number;
  maxRevenue?: number;
  minOrders?: number;
  maxOrders?: number;
  minConversionRate?: number;
  maxConversionRate?: number;
  
  // Discount Filters
  discountType?: ServiceFlashSale['discountType'][];
  minDiscountValue?: number;
  maxDiscountValue?: number;
  
  // Corporate & B2B Filters
  corporateAccountIds?: string[];
  customerTiers?: string[];
  requiresApproval?: boolean;
  budgetCodes?: string[];
  costCenters?: string[];
  
  // Service & Inventory Filters
  serviceIds?: string[];
  serviceCategories?: string[];
  vendorIds?: string[];
  minInventory?: number;
  maxInventory?: number;
  hasAvailableSlots?: boolean;
  
  // Feature Filters
  isFeatured?: boolean;
  hasCountdown?: boolean;
  showRemainingStock?: boolean;
  allowOverselling?: boolean;
  
  // Creator Filters
  createdBy?: string[];
  updatedBy?: string[];
  templateIds?: string[];
  
  // Geographic Filters
  allowedCountries?: string[];
  allowedRegions?: string[];
  
  // Search and Text
  search?: string;
  searchFields?: ('title' | 'description' | 'campaignCode' | 'serviceNames')[];
  
  // Sorting
  sortBy?: 'startTime' | 'endTime' | 'createdAt' | 'revenue' | 'orders' | 'conversionRate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
  
  // Pagination
  page?: number;
  limit?: number;
  offset?: number;
  
  // Analytics and Reporting
  includeAnalytics?: boolean;
  includeServices?: boolean;
  includeParticipants?: boolean;
  includeNotifications?: boolean;
  includeActivities?: boolean;
}

export interface AddServicesToFlashSaleData {
  serviceIds: string[];
  pricingOverrides?: Record<string, {
    salePrice?: number;
    discountPercentage?: number;
    totalSlots?: number;
    promotionLevel?: FlashSaleService['promotionLevel'];
    isPromoted?: boolean;
  }>;
  applyGlobalDiscount?: boolean;
}

export interface FlashSaleNotificationData {
  notificationType: FlashSaleNotification['notificationType'];
  title: string;
  message: string;
  channels: FlashSaleNotification['channels'];
  scheduledAt?: Date;
  
  targetAudience: FlashSaleNotification['targetAudience'];
  audienceFilter?: FlashSaleNotification['audienceFilter'];
  
  personalizationData?: Record<string, any>;
  dynamicContent?: FlashSaleNotification['dynamicContent'];
  
  isABTest?: boolean;
  abTestGroup?: 'A' | 'B';
  
  requiresConsent?: boolean;
  gdprCompliant?: boolean;
  canSpamCompliant?: boolean;
}

// Comprehensive B2B Service Flash Sales API for Enterprise Marketplace
export const serviceFlashSalesAPI = {
  // Core Flash Sale Management
  flashSales: {
    // Get all flash sales with advanced filtering
    getAll: async (filters?: FlashSaleFilters): Promise<PaginatedFlashSaleResponse<ServiceFlashSale>> => {
      const response = await api.get<PaginatedFlashSaleResponse<ServiceFlashSale>>('/flash-sales/service-campaigns', {
        params: filters,
      });
      return response.data;
    },

    // Get flash sale by ID with comprehensive details
    getById: async (id: string, includeDetails?: {
      includeServices?: boolean;
      includeAnalytics?: boolean;
      includeParticipants?: boolean;
      includeNotifications?: boolean;
      includeActivities?: boolean;
    }): Promise<FlashSaleAPIResponse<ServiceFlashSale>> => {
      const response = await api.get<FlashSaleAPIResponse<ServiceFlashSale>>(`/flash-sales/service-campaigns/${id}`, {
        params: includeDetails,
      });
      return response.data;
    },

    // Create new flash sale campaign
    create: async (data: CreateFlashSaleData): Promise<FlashSaleAPIResponse<ServiceFlashSale>> => {
      const response = await api.post<FlashSaleAPIResponse<ServiceFlashSale>>('/flash-sales/service-campaigns', data);
      return response.data;
    },

    // Update existing flash sale
    update: async (id: string, data: UpdateFlashSaleData): Promise<FlashSaleAPIResponse<ServiceFlashSale>> => {
      const response = await api.put<FlashSaleAPIResponse<ServiceFlashSale>>(`/flash-sales/service-campaigns/${id}`, data);
      return response.data;
    },

    // Delete flash sale
    delete: async (id: string, reason?: string): Promise<FlashSaleAPIResponse<{ success: boolean }>> => {
      const response = await api.delete<FlashSaleAPIResponse<{ success: boolean }>>(`/flash-sales/service-campaigns/${id}`, {
        data: { reason },
      });
      return response.data;
    },

    // Start flash sale
    start: async (id: string, options?: {
      sendNotifications?: boolean;
      notifyChannels?: string[];
    }): Promise<FlashSaleAPIResponse<ServiceFlashSale>> => {
      const response = await api.post<FlashSaleAPIResponse<ServiceFlashSale>>(`/flash-sales/service-campaigns/${id}/start`, options);
      return response.data;
    },

    // Pause flash sale
    pause: async (id: string, reason?: string): Promise<FlashSaleAPIResponse<ServiceFlashSale>> => {
      const response = await api.post<FlashSaleAPIResponse<ServiceFlashSale>>(`/flash-sales/service-campaigns/${id}/pause`, {
        reason,
      });
      return response.data;
    },

    // Resume flash sale
    resume: async (id: string): Promise<FlashSaleAPIResponse<ServiceFlashSale>> => {
      const response = await api.post<FlashSaleAPIResponse<ServiceFlashSale>>(`/flash-sales/service-campaigns/${id}/resume`);
      return response.data;
    },

    // End flash sale
    end: async (id: string, options?: {
      sendNotifications?: boolean;
      reason?: string;
    }): Promise<FlashSaleAPIResponse<ServiceFlashSale>> => {
      const response = await api.post<FlashSaleAPIResponse<ServiceFlashSale>>(`/flash-sales/service-campaigns/${id}/end`, options);
      return response.data;
    },

    // Cancel flash sale
    cancel: async (id: string, data: {
      reason: string;
      notifyParticipants?: boolean;
      refundOrders?: boolean;
    }): Promise<FlashSaleAPIResponse<ServiceFlashSale>> => {
      const response = await api.post<FlashSaleAPIResponse<ServiceFlashSale>>(`/flash-sales/service-campaigns/${id}/cancel`, data);
      return response.data;
    },

    // Extend flash sale duration
    extend: async (id: string, data: {
      newEndTime: Date;
      reason: string;
      notifyParticipants?: boolean;
    }): Promise<FlashSaleAPIResponse<ServiceFlashSale>> => {
      const response = await api.post<FlashSaleAPIResponse<ServiceFlashSale>>(`/flash-sales/service-campaigns/${id}/extend`, {
        ...data,
        newEndTime: data.newEndTime.toISOString(),
      });
      return response.data;
    },

    // Duplicate flash sale
    duplicate: async (id: string, modifications?: Partial<CreateFlashSaleData>): Promise<FlashSaleAPIResponse<ServiceFlashSale>> => {
      const response = await api.post<FlashSaleAPIResponse<ServiceFlashSale>>(`/flash-sales/service-campaigns/${id}/duplicate`, modifications);
      return response.data;
    },

    // Get active flash sales
    getActive: async (): Promise<FlashSaleAPIResponse<ServiceFlashSale[]>> => {
      const response = await api.get<FlashSaleAPIResponse<ServiceFlashSale[]>>('/flash-sales/service-campaigns/active');
      return response.data;
    },

    // Get upcoming flash sales
    getUpcoming: async (hours?: number): Promise<FlashSaleAPIResponse<ServiceFlashSale[]>> => {
      const response = await api.get<FlashSaleAPIResponse<ServiceFlashSale[]>>('/flash-sales/service-campaigns/upcoming', {
        params: { hours },
      });
      return response.data;
    },

    // Get flash sale countdown
    getCountdown: async (id: string): Promise<FlashSaleAPIResponse<{
      timeRemaining: number;
      endTime: Date;
      status: 'active' | 'ended' | 'not_started' | 'paused';
      formattedTime: {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
      };
      urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    }>> => {
      const response = await api.get<FlashSaleAPIResponse<any>>(`/flash-sales/service-campaigns/${id}/countdown`);
      return response.data;
    },

    // Search flash sales
    search: async (query: string, filters?: FlashSaleFilters): Promise<FlashSaleAPIResponse<ServiceFlashSale[]>> => {
      const response = await api.get<FlashSaleAPIResponse<ServiceFlashSale[]>>('/flash-sales/service-campaigns/search', {
        params: { q: query, ...filters },
      });
      return response.data;
    },
  },

  // Service Management in Flash Sales
  services: {
    // Add services to flash sale
    add: async (flashSaleId: string, data: AddServicesToFlashSaleData): Promise<FlashSaleAPIResponse<ServiceFlashSale>> => {
      const response = await api.post<FlashSaleAPIResponse<ServiceFlashSale>>(`/flash-sales/service-campaigns/${flashSaleId}/services`, data);
      return response.data;
    },

    // Remove service from flash sale
    remove: async (flashSaleId: string, serviceId: string): Promise<FlashSaleAPIResponse<ServiceFlashSale>> => {
      const response = await api.delete<FlashSaleAPIResponse<ServiceFlashSale>>(`/flash-sales/service-campaigns/${flashSaleId}/services/${serviceId}`);
      return response.data;
    },

    // Update service pricing in flash sale
    updatePricing: async (flashSaleId: string, serviceId: string, data: {
      salePrice?: number;
      discountPercentage?: number;
      maxDiscountAmount?: number;
    }): Promise<FlashSaleAPIResponse<FlashSaleService>> => {
      const response = await api.put<FlashSaleAPIResponse<FlashSaleService>>(`/flash-sales/service-campaigns/${flashSaleId}/services/${serviceId}/pricing`, data);
      return response.data;
    },

    // Update service inventory
    updateInventory: async (flashSaleId: string, serviceId: string, data: {
      totalSlots: number;
      allowOverbooking?: boolean;
      bufferSlots?: number;
    }): Promise<FlashSaleAPIResponse<FlashSaleService>> => {
      const response = await api.put<FlashSaleAPIResponse<FlashSaleService>>(`/flash-sales/service-campaigns/${flashSaleId}/services/${serviceId}/inventory`, data);
      return response.data;
    },

    // Get services in flash sale
    getByFlashSale: async (flashSaleId: string, filters?: {
      category?: string;
      vendorId?: string;
      isActive?: boolean;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }): Promise<FlashSaleAPIResponse<FlashSaleService[]>> => {
      const response = await api.get<FlashSaleAPIResponse<FlashSaleService[]>>(`/flash-sales/service-campaigns/${flashSaleId}/services`, {
        params: filters,
      });
      return response.data;
    },

    // Get service performance in flash sale
    getPerformance: async (flashSaleId: string, serviceId: string): Promise<FlashSaleAPIResponse<FlashSaleServiceAnalytics>> => {
      const response = await api.get<FlashSaleAPIResponse<FlashSaleServiceAnalytics>>(`/flash-sales/service-campaigns/${flashSaleId}/services/${serviceId}/performance`);
      return response.data;
    },

    // Promote/demote service
    updatePromotion: async (flashSaleId: string, serviceId: string, data: {
      isPromoted: boolean;
      promotionLevel: FlashSaleService['promotionLevel'];
    }): Promise<FlashSaleAPIResponse<FlashSaleService>> => {
      const response = await api.put<FlashSaleAPIResponse<FlashSaleService>>(`/flash-sales/service-campaigns/${flashSaleId}/services/${serviceId}/promotion`, data);
      return response.data;
    },
  },

  // Template Management
  templates: {
    // Get all templates
    getAll: async (filters?: {
      category?: string;
      isActive?: boolean;
      isPublic?: boolean;
      createdBy?: string;
    }): Promise<FlashSaleAPIResponse<FlashSaleTemplate[]>> => {
      const response = await api.get<FlashSaleAPIResponse<FlashSaleTemplate[]>>('/flash-sales/templates', {
        params: filters,
      });
      return response.data;
    },

    // Get template by ID
    getById: async (id: string): Promise<FlashSaleAPIResponse<FlashSaleTemplate>> => {
      const response = await api.get<FlashSaleAPIResponse<FlashSaleTemplate>>(`/flash-sales/templates/${id}`);
      return response.data;
    },

    // Create template
    create: async (data: Omit<FlashSaleTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'successRate' | 'averagePerformance'>): Promise<FlashSaleAPIResponse<FlashSaleTemplate>> => {
      const response = await api.post<FlashSaleAPIResponse<FlashSaleTemplate>>('/flash-sales/templates', data);
      return response.data;
    },

    // Update template
    update: async (id: string, data: Partial<FlashSaleTemplate>): Promise<FlashSaleAPIResponse<FlashSaleTemplate>> => {
      const response = await api.put<FlashSaleAPIResponse<FlashSaleTemplate>>(`/flash-sales/templates/${id}`, data);
      return response.data;
    },

    // Delete template
    delete: async (id: string): Promise<FlashSaleAPIResponse<{ success: boolean }>> => {
      const response = await api.delete<FlashSaleAPIResponse<{ success: boolean }>>(`/flash-sales/templates/${id}`);
      return response.data;
    },

    // Apply template to create flash sale
    apply: async (templateId: string, modifications: CreateFlashSaleData): Promise<FlashSaleAPIResponse<ServiceFlashSale>> => {
      const response = await api.post<FlashSaleAPIResponse<ServiceFlashSale>>(`/flash-sales/templates/${templateId}/apply`, modifications);
      return response.data;
    },

    // Get template performance
    getPerformance: async (id: string): Promise<FlashSaleAPIResponse<{
      usageCount: number;
      successRate: number;
      averagePerformance: FlashSaleTemplate['averagePerformance'];
      recentCampaigns: Array<{
        campaignId: string;
        campaignName: string;
        revenue: number;
        conversionRate: number;
        startDate: Date;
      }>;
    }>> => {
      const response = await api.get<FlashSaleAPIResponse<any>>(`/flash-sales/templates/${id}/performance`);
      return response.data;
    },
  },

  // Notification Management
  notifications: {
    // Send notification
    send: async (flashSaleId: string, data: FlashSaleNotificationData): Promise<FlashSaleAPIResponse<FlashSaleNotification>> => {
      const response = await api.post<FlashSaleAPIResponse<FlashSaleNotification>>(`/flash-sales/service-campaigns/${flashSaleId}/notifications`, data);
      return response.data;
    },

    // Get notifications for flash sale
    getByFlashSale: async (flashSaleId: string, filters?: {
      notificationType?: string[];
      deliveryStatus?: string[];
      channels?: string[];
    }): Promise<FlashSaleAPIResponse<FlashSaleNotification[]>> => {
      const response = await api.get<FlashSaleAPIResponse<FlashSaleNotification[]>>(`/flash-sales/service-campaigns/${flashSaleId}/notifications`, {
        params: filters,
      });
      return response.data;
    },

    // Cancel scheduled notification
    cancel: async (notificationId: string): Promise<FlashSaleAPIResponse<FlashSaleNotification>> => {
      const response = await api.post<FlashSaleAPIResponse<FlashSaleNotification>>(`/flash-sales/notifications/${notificationId}/cancel`);
      return response.data;
    },

    // Retry failed notification
    retry: async (notificationId: string): Promise<FlashSaleAPIResponse<FlashSaleNotification>> => {
      const response = await api.post<FlashSaleAPIResponse<FlashSaleNotification>>(`/flash-sales/notifications/${notificationId}/retry`);
      return response.data;
    },

    // Get notification performance
    getPerformance: async (notificationId: string): Promise<FlashSaleAPIResponse<{
      deliveryMetrics: FlashSaleNotification['deliveryMetrics'];
      recipientBreakdown: {
        total: number;
        delivered: number;
        failed: number;
        opened: number;
        clicked: number;
        converted: number;
      };
      topPerformingVariant?: {
        variant: string;
        performance: any;
      };
    }>> => {
      const response = await api.get<FlashSaleAPIResponse<any>>(`/flash-sales/notifications/${notificationId}/performance`);
      return response.data;
    },

    // Schedule automatic notifications
    scheduleAutomatic: async (flashSaleId: string, data: {
      enablePreLaunch?: boolean;
      preLaunchHours?: number;
      enableStartNotification?: boolean;
      enableEndingSoon?: boolean;
      endingSoonHours?: number;
      enableEndNotification?: boolean;
      customSchedule?: Array<{
        hoursBeforeEnd: number;
        notificationData: FlashSaleNotificationData;
      }>;
    }): Promise<FlashSaleAPIResponse<FlashSaleNotification[]>> => {
      const response = await api.post<FlashSaleAPIResponse<FlashSaleNotification[]>>(`/flash-sales/service-campaigns/${flashSaleId}/notifications/schedule-automatic`, data);
      return response.data;
    },
  },

  // Analytics & Reporting
  analytics: {
    // Get comprehensive analytics
    getComprehensive: async (flashSaleId: string, filters?: {
      includeHourlyBreakdown?: boolean;
      includeServiceBreakdown?: boolean;
      includeCustomerSegmentation?: boolean;
      includeGeographic?: boolean;
      includePredictions?: boolean;
    }): Promise<FlashSaleAPIResponse<FlashSaleAnalytics>> => {
      const response = await api.get<FlashSaleAPIResponse<FlashSaleAnalytics>>(`/flash-sales/service-campaigns/${flashSaleId}/analytics/comprehensive`, {
        params: filters,
      });
      return response.data;
    },

    // Get real-time analytics
    getRealTime: async (flashSaleId: string): Promise<FlashSaleAPIResponse<{
      currentMetrics: {
        currentRevenue: number;
        currentOrders: number;
        currentParticipants: number;
        conversionRate: number;
        timeRemaining: number;
      };
      recentActivity: Array<{
        timestamp: Date;
        type: string;
        description: string;
        impact: string;
      }>;
      alerts: Array<{
        type: string;
        severity: 'info' | 'warning' | 'error' | 'critical';
        message: string;
        timestamp: Date;
      }>;
    }>> => {
      const response = await api.get<FlashSaleAPIResponse<any>>(`/flash-sales/service-campaigns/${flashSaleId}/analytics/real-time`);
      return response.data;
    },

    // Get performance comparison
    getComparison: async (flashSaleId: string, compareTo?: {
      campaignIds?: string[];
      timeframe?: 'previous_campaign' | 'same_period_last_year' | 'industry_average';
    }): Promise<FlashSaleAPIResponse<{
      currentCampaign: FlashSaleAnalytics;
      comparison: Array<{
        label: string;
        analytics: FlashSaleAnalytics;
        comparison: {
          revenueChange: number;
          orderChange: number;
          conversionChange: number;
          participantChange: number;
        };
      }>;
    }>> => {
      const response = await api.get<FlashSaleAPIResponse<any>>(`/flash-sales/service-campaigns/${flashSaleId}/analytics/comparison`, {
        params: compareTo,
      });
      return response.data;
    },

    // Get dashboard overview
    getDashboard: async (): Promise<FlashSaleAPIResponse<{
      summary: {
        activeCampaigns: number;
        scheduledCampaigns: number;
        totalRevenue: number;
        totalOrders: number;
        averageConversionRate: number;
      };
      recentActivity: FlashSaleActivity[];
      topPerforming: Array<{
        campaignId: string;
        campaignName: string;
        revenue: number;
        conversionRate: number;
        status: string;
      }>;
      upcomingMilestones: Array<{
        campaignId: string;
        campaignName: string;
        milestone: string;
        timeToMilestone: number;
      }>;
      alerts: Array<{
        type: string;
        severity: string;
        message: string;
        campaignId?: string;
        timestamp: Date;
      }>;
    }>> => {
      const response = await api.get<FlashSaleAPIResponse<any>>('/flash-sales/analytics/dashboard');
      return response.data;
    },

    // Get service performance analytics
    getServicePerformance: async (filters?: {
      flashSaleIds?: string[];
      serviceIds?: string[];
      dateFrom?: string;
      dateTo?: string;
      groupBy?: 'service' | 'vendor' | 'category';
    }): Promise<FlashSaleAPIResponse<{
      services: Array<{
        serviceId: string;
        serviceName: string;
        totalRevenue: number;
        totalOrders: number;
        averageConversionRate: number;
        campaignCount: number;
        bestPerformingCampaign: {
          campaignId: string;
          campaignName: string;
          revenue: number;
          conversionRate: number;
        };
      }>;
      benchmarks: {
        averageRevenue: number;
        averageConversionRate: number;
        topPerformingRevenue: number;
        topPerformingConversionRate: number;
      };
    }>> => {
      const response = await api.get<FlashSaleAPIResponse<any>>('/flash-sales/analytics/service-performance', {
        params: filters,
      });
      return response.data;
    },

    // Export analytics data
    export: async (flashSaleId: string, options: {
      format: 'csv' | 'excel' | 'pdf';
      includeHourlyData?: boolean;
      includeServiceData?: boolean;
      includeCustomerData?: boolean;
      dateFrom?: string;
      dateTo?: string;
    }): Promise<Blob> => {
      const response = await api.post(`/flash-sales/service-campaigns/${flashSaleId}/analytics/export`, options, {
        responseType: 'blob',
      });
      return response.data;
    },

    // Generate report
    generateReport: async (options: {
      campaignIds?: string[];
      reportType: 'performance' | 'comparison' | 'roi' | 'customer_insights';
      format: 'pdf' | 'excel';
      dateFrom?: string;
      dateTo?: string;
      includeBenchmarks?: boolean;
    }): Promise<FlashSaleAPIResponse<{
      reportUrl: string;
      downloadUrl: string;
      expiresAt: Date;
      reportSize: number;
    }>> => {
      const response = await api.post<FlashSaleAPIResponse<any>>('/flash-sales/analytics/generate-report', options);
      return response.data;
    },
  },

  // Participant Management
  participants: {
    // Get participants for flash sale
    getByFlashSale: async (flashSaleId: string, filters?: {
      customerSegment?: string[];
      hasOrdered?: boolean;
      minSpent?: number;
      maxSpent?: number;
      trafficSource?: string[];
      deviceType?: string[];
      page?: number;
      limit?: number;
    }): Promise<PaginatedFlashSaleResponse<FlashSaleParticipant>> => {
      const response = await api.get<PaginatedFlashSaleResponse<FlashSaleParticipant>>(`/flash-sales/service-campaigns/${flashSaleId}/participants`, {
        params: filters,
      });
      return response.data;
    },

    // Get participant details
    getById: async (participantId: string): Promise<FlashSaleAPIResponse<FlashSaleParticipant & {
      detailedJourney: Array<{
        timestamp: Date;
        page: string;
        action: string;
        duration: number;
        details: Record<string, any>;
      }>;
    }>> => {
      const response = await api.get<FlashSaleAPIResponse<any>>(`/flash-sales/participants/${participantId}`);
      return response.data;
    },

    // Get participant analytics
    getAnalytics: async (flashSaleId: string): Promise<FlashSaleAPIResponse<{
      totalParticipants: number;
      segmentBreakdown: Record<string, number>;
      engagementMetrics: {
        averageSessionDuration: number;
        averagePageViews: number;
        bounceRate: number;
        conversionRate: number;
      };
      trafficSources: Record<string, {
        participants: number;
        conversionRate: number;
        averageValue: number;
      }>;
      deviceBreakdown: Record<string, {
        participants: number;
        conversionRate: number;
      }>;
      geographicDistribution: Array<{
        country: string;
        participants: number;
        revenue: number;
      }>;
      customerJourneyInsights: {
        commonPaths: Array<{
          path: string[];
          frequency: number;
          conversionRate: number;
        }>;
        dropOffPoints: Array<{
          step: string;
          dropOffRate: number;
        }>;
      };
    }>> => {
      const response = await api.get<FlashSaleAPIResponse<any>>(`/flash-sales/service-campaigns/${flashSaleId}/participants/analytics`);
      return response.data;
    },
  },

  // Activity & Audit Trail
  activities: {
    // Get activities for flash sale
    getByFlashSale: async (flashSaleId: string, filters?: {
      activityType?: string[];
      actorType?: string[];
      impactLevel?: string[];
      isAlert?: boolean;
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
    }): Promise<PaginatedFlashSaleResponse<FlashSaleActivity>> => {
      const response = await api.get<PaginatedFlashSaleResponse<FlashSaleActivity>>(`/flash-sales/service-campaigns/${flashSaleId}/activities`, {
        params: filters,
      });
      return response.data;
    },

    // Get all activities
    getAll: async (filters?: {
      flashSaleIds?: string[];
      activityType?: string[];
      actorType?: string[];
      impactLevel?: string[];
      isAlert?: boolean;
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
    }): Promise<PaginatedFlashSaleResponse<FlashSaleActivity>> => {
      const response = await api.get<PaginatedFlashSaleResponse<FlashSaleActivity>>('/flash-sales/activities', {
        params: filters,
      });
      return response.data;
    },

    // Resolve alert
    resolveAlert: async (activityId: string, resolution: {
      resolution: string;
      notes?: string;
    }): Promise<FlashSaleAPIResponse<FlashSaleActivity>> => {
      const response = await api.post<FlashSaleAPIResponse<FlashSaleActivity>>(`/flash-sales/activities/${activityId}/resolve`, resolution);
      return response.data;
    },

    // Get activity summary
    getSummary: async (flashSaleId?: string, timeframe?: 'hour' | 'day' | 'week'): Promise<FlashSaleAPIResponse<{
      totalActivities: number;
      activityBreakdown: Record<string, number>;
      alertBreakdown: Record<string, number>;
      impactSummary: Record<string, {
        count: number;
        averageImpact: number;
      }>;
      timeline: Array<{
        period: string;
        activities: number;
        alerts: number;
        majorEvents: string[];
      }>;
    }>> => {
      const response = await api.get<FlashSaleAPIResponse<any>>('/flash-sales/activities/summary', {
        params: { flashSaleId, timeframe },
      });
      return response.data;
    },
  },

  // Quick Actions & Utilities
  quickActions: {
    // Quick start campaign
    quickStart: async (data: {
      title: string;
      templateId?: string;
      serviceIds: string[];
      discountPercentage: number;
      durationHours: number;
      startTime?: Date;
    }): Promise<FlashSaleAPIResponse<ServiceFlashSale>> => {
      const response = await api.post<FlashSaleAPIResponse<ServiceFlashSale>>('/flash-sales/quick-start', data);
      return response.data;
    },

    // Get recommendations
    getRecommendations: async (filters?: {
      budget?: number;
      targetAudience?: string;
      campaignGoal?: 'revenue' | 'new_customers' | 'engagement' | 'inventory_clearance';
      industry?: string;
    }): Promise<FlashSaleAPIResponse<{
      templateRecommendations: Array<{
        template: FlashSaleTemplate;
        matchScore: number;
        reasons: string[];
        expectedPerformance: {
          estimatedRevenue: number;
          estimatedOrders: number;
          estimatedConversionRate: number;
        };
      }>;
      serviceRecommendations: Array<{
        serviceId: string;
        serviceName: string;
        recommendationScore: number;
        reasons: string[];
        suggestedDiscount: number;
      }>;
      timingRecommendations: Array<{
        startTime: Date;
        reasoning: string;
        expectedPerformance: number;
      }>;
    }>> => {
      const response = await api.get<FlashSaleAPIResponse<any>>('/flash-sales/recommendations', {
        params: filters,
      });
      return response.data;
    },

    // Clone successful campaign
    cloneSuccessful: async (campaignId: string, modifications?: {
      newStartTime?: Date;
      newEndTime?: Date;
      newTitle?: string;
      serviceIds?: string[];
    }): Promise<FlashSaleAPIResponse<ServiceFlashSale>> => {
      const response = await api.post<FlashSaleAPIResponse<ServiceFlashSale>>(`/flash-sales/clone-successful/${campaignId}`, modifications);
      return response.data;
    },

    // Test campaign configuration
    testConfiguration: async (data: CreateFlashSaleData): Promise<FlashSaleAPIResponse<{
      configurationScore: number;
      warnings: Array<{
        severity: 'low' | 'medium' | 'high';
        message: string;
        suggestion: string;
      }>;
      estimatedPerformance: {
        projectedRevenue: number;
        projectedOrders: number;
        projectedConversionRate: number;
        confidence: number;
      };
      optimizationSuggestions: Array<{
        area: string;
        suggestion: string;
        impact: 'low' | 'medium' | 'high';
      }>;
    }>> => {
      const response = await api.post<FlashSaleAPIResponse<any>>('/flash-sales/test-configuration', data);
      return response.data;
    },

    // Get performance alerts
    getPerformanceAlerts: async (flashSaleId: string): Promise<FlashSaleAPIResponse<Array<{
      alertType: 'low_performance' | 'high_demand' | 'low_stock' | 'conversion_drop' | 'technical_issue';
      severity: 'info' | 'warning' | 'error' | 'critical';
      message: string;
      recommendation: string;
      timestamp: Date;
      isAcknowledged: boolean;
    }>>> => {
      const response = await api.get<FlashSaleAPIResponse<any>>(`/flash-sales/service-campaigns/${flashSaleId}/performance-alerts`);
      return response.data;
    },

    // Acknowledge alert
    acknowledgeAlert: async (flashSaleId: string, alertType: string): Promise<FlashSaleAPIResponse<{ success: boolean }>> => {
      const response = await api.post<FlashSaleAPIResponse<{ success: boolean }>>(`/flash-sales/service-campaigns/${flashSaleId}/acknowledge-alert`, {
        alertType,
      });
      return response.data;
    },
  },

  // Bulk Operations
  bulkOperations: {
    // Bulk start campaigns
    start: async (campaignIds: string[], options?: {
      sendNotifications?: boolean;
      staggerStartMinutes?: number;
    }): Promise<FlashSaleAPIResponse<{
      started: number;
      failed: number;
      errors: Array<{ campaignId: string; error: string }>;
    }>> => {
      const response = await api.post<FlashSaleAPIResponse<any>>('/flash-sales/bulk/start', {
        campaignIds,
        ...options,
      });
      return response.data;
    },

    // Bulk end campaigns
    end: async (campaignIds: string[], options?: {
      sendNotifications?: boolean;
      reason?: string;
    }): Promise<FlashSaleAPIResponse<{
      ended: number;
      failed: number;
      errors: Array<{ campaignId: string; error: string }>;
    }>> => {
      const response = await api.post<FlashSaleAPIResponse<any>>('/flash-sales/bulk/end', {
        campaignIds,
        ...options,
      });
      return response.data;
    },

    // Bulk cancel campaigns
    cancel: async (campaignIds: string[], data: {
      reason: string;
      notifyParticipants?: boolean;
    }): Promise<FlashSaleAPIResponse<{
      cancelled: number;
      failed: number;
      errors: Array<{ campaignId: string; error: string }>;
    }>> => {
      const response = await api.post<FlashSaleAPIResponse<any>>('/flash-sales/bulk/cancel', {
        campaignIds,
        ...data,
      });
      return response.data;
    },

    // Bulk update settings
    updateSettings: async (campaignIds: string[], updates: Partial<UpdateFlashSaleData>): Promise<FlashSaleAPIResponse<{
      updated: number;
      failed: number;
      errors: Array<{ campaignId: string; error: string }>;
    }>> => {
      const response = await api.post<FlashSaleAPIResponse<any>>('/flash-sales/bulk/update-settings', {
        campaignIds,
        updates,
      });
      return response.data;
    },

    // Export multiple campaigns
    export: async (campaignIds: string[], format: 'csv' | 'excel'): Promise<Blob> => {
      const response = await api.post('/flash-sales/bulk/export', {
        campaignIds,
        format,
      }, {
        responseType: 'blob',
      });
      return response.data;
    },
  },
};

// Legacy API for backward compatibility
export const flashSalesAPI = {
  getAll: serviceFlashSalesAPI.flashSales.getAll,
  getById: serviceFlashSalesAPI.flashSales.getById,
  create: serviceFlashSalesAPI.flashSales.create,
  update: serviceFlashSalesAPI.flashSales.update,
  delete: serviceFlashSalesAPI.flashSales.delete,
  start: serviceFlashSalesAPI.flashSales.start,
  end: serviceFlashSalesAPI.flashSales.end,
  cancel: serviceFlashSalesAPI.flashSales.cancel,
  extend: serviceFlashSalesAPI.flashSales.extend,
  duplicate: serviceFlashSalesAPI.flashSales.duplicate,
  addProducts: serviceFlashSalesAPI.services.add,
  removeProduct: serviceFlashSalesAPI.services.remove,
  updateProductPrice: serviceFlashSalesAPI.services.updatePricing,
  updateProductInventory: serviceFlashSalesAPI.services.updateInventory,
  getDailyDeals: () => serviceFlashSalesAPI.flashSales.getActive(),
  createDailyDeal: serviceFlashSalesAPI.flashSales.create,
  updateDailyDeal: serviceFlashSalesAPI.flashSales.update,
  deleteDailyDeal: serviceFlashSalesAPI.flashSales.delete,
  getTemplates: serviceFlashSalesAPI.templates.getAll,
  createTemplate: serviceFlashSalesAPI.templates.create,
  updateTemplate: serviceFlashSalesAPI.templates.update,
  deleteTemplate: serviceFlashSalesAPI.templates.delete,
  applyTemplate: serviceFlashSalesAPI.templates.apply,
  getStats: serviceFlashSalesAPI.analytics.getDashboard,
  getAnalytics: serviceFlashSalesAPI.analytics.getComprehensive,
  getPerformanceReport: serviceFlashSalesAPI.analytics.getComparison,
  getActivity: serviceFlashSalesAPI.activities.getAll,
  sendNotification: serviceFlashSalesAPI.notifications.send,
  getSubscribers: serviceFlashSalesAPI.participants.getByFlashSale,
  bulkStart: serviceFlashSalesAPI.bulkOperations.start,
  bulkEnd: serviceFlashSalesAPI.bulkOperations.end,
  bulkCancel: serviceFlashSalesAPI.bulkOperations.cancel,
  bulkDelete: (saleIds: string[]) => 
    serviceFlashSalesAPI.bulkOperations.cancel(saleIds, { reason: 'Bulk deletion' }),
  search: serviceFlashSalesAPI.flashSales.search,
  getSuggestions: (partial: string) => 
    serviceFlashSalesAPI.quickActions.getRecommendations({ budget: 1000 }).then(result => [partial]),
  export: serviceFlashSalesAPI.bulkOperations.export,
  import: (file: File, options?: any) => 
    Promise.resolve({ imported: 0, errors: [], skipped: 0 }),
  getCurrentLive: serviceFlashSalesAPI.flashSales.getActive,
  getUpcoming: serviceFlashSalesAPI.flashSales.getUpcoming,
  getCountdown: serviceFlashSalesAPI.flashSales.getCountdown,
};

export default serviceFlashSalesAPI;