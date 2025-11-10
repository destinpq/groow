// Backend Deal Entities - Marketing Module

import { BaseEntity, PaginationResponse } from './pagination';
import { CustomerEntity } from './customer';
import { ProductEntity } from './product';
import { OrderEntity } from './order';

// Core Deal Entity
export interface DealEntity extends BaseEntity {
  id: string;
  title: string;
  description: string;
  dealType: DealType;
  priority: number;
  
  // Discount Configuration
  discountRules: DealDiscountRules;
  conditions: DealConditions;
  
  // Scheduling
  startDate: Date;
  endDate: Date;
  timezone: string;
  
  // Status & Usage
  isActive: boolean;
  isFeatured: boolean;
  isAutoApply: boolean;
  isStackable: boolean;
  usageCount: number;
  usageLimit?: number;
  maxUsagePerCustomer?: number;
  
  // Branding & Marketing
  banner?: DealBanner;
  metadata: DealMetadata;
  
  // Targeting & Personalization
  targeting: DealTargeting;
  
  // Analytics & Performance
  analytics: DealAnalytics;
  
  // Relations
  creator: CustomerEntity;
  createdById: string;
  usages: DealUsageEntity[];
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  version: number;
}

// Deal Usage Entity
export interface DealUsageEntity extends BaseEntity {
  id: string;
  deal: DealEntity;
  dealId: string;
  customer: CustomerEntity;
  customerId: string;
  order?: OrderEntity;
  orderId?: string;
  
  // Usage Details
  discountAmount: number;
  originalPrice: number;
  finalPrice: number;
  currency: string;
  
  // Context
  usedAt: Date;
  ipAddress: string;
  userAgent: string;
  channel: string; // web, mobile_app, api
  
  // Status
  status: DealUsageStatus;
  refundedAt?: Date;
  refundAmount?: number;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
}

// Deal Template Entity
export interface DealTemplateEntity extends BaseEntity {
  id: string;
  name: string;
  description: string;
  category: string;
  
  // Template Configuration
  template: {
    title: string;
    description: string;
    dealType: DealType;
    discountRules: Partial<DealDiscountRules>;
    conditions: Partial<DealConditions>;
    targeting: Partial<DealTargeting>;
    metadata: Partial<DealMetadata>;
  };
  
  // Usage & Stats
  isPublic: boolean;
  usageCount: number;
  tags: string[];
  
  // Relations
  creator: CustomerEntity;
  createdById: string;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
}

// Deal Campaign Entity
export interface DealCampaignEntity extends BaseEntity {
  id: string;
  name: string;
  description: string;
  
  // Campaign Configuration
  deals: DealEntity[];
  dealIds: string[];
  
  // Scheduling
  startDate: Date;
  endDate: Date;
  timezone: string;
  
  // Targeting
  targeting: DealTargeting;
  budget?: number;
  budgetSpent: number;
  
  // Analytics
  analytics: DealCampaignAnalytics;
  
  // Status
  status: DealCampaignStatus;
  isActive: boolean;
  
  // Relations
  creator: CustomerEntity;
  createdById: string;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
}

// Deal A/B Test Entity
export interface DealABTestEntity extends BaseEntity {
  id: string;
  name: string;
  description: string;
  
  // Test Configuration
  variants: DealABVariant[];
  trafficSplit: { [variantId: string]: number };
  
  // Test Control
  startDate: Date;
  endDate?: Date;
  status: ABTestStatus;
  
  // Results
  results: DealABTestResults;
  winner?: string; // variantId
  confidenceLevel?: number;
  
  // Relations
  creator: CustomerEntity;
  createdById: string;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
}

// Supporting Interfaces

export enum DealType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  BUY_X_GET_Y = 'buy_x_get_y',
  FREE_SHIPPING = 'free_shipping',
  BUNDLE = 'bundle',
  FLASH_SALE = 'flash_sale',
  SEASONAL = 'seasonal',
  LOYALTY_POINTS = 'loyalty_points',
  EARLY_BIRD = 'early_bird',
  CLEARANCE = 'clearance'
}

export enum DealUsageStatus {
  PENDING = 'pending',
  APPLIED = 'applied',
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

export enum DealCampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ABTestStatus {
  DRAFT = 'draft',
  RUNNING = 'running',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface DealDiscountRules {
  type: DealType;
  value: number;
  maxDiscount?: number;
  minQuantity?: number;
  maxQuantity?: number;
  minOrderValue?: number;
  currency: string;
  
  // Buy X Get Y specific
  buyQuantity?: number;
  getQuantity?: number;
  getFreeProducts?: string[];
  
  // Bundle specific
  bundleProducts?: string[];
  bundlePrice?: number;
  
  // Progressive discount
  tiers?: {
    minQuantity: number;
    discount: number;
  }[];
}

export interface DealConditions {
  // Product Conditions
  applicableProducts?: string[];
  applicableCategories?: string[];
  applicableVendors?: string[];
  excludedProducts?: string[];
  excludedCategories?: string[];
  
  // Customer Conditions
  customerSegments?: string[];
  newCustomersOnly?: boolean;
  membershipLevels?: string[];
  excludedCustomers?: string[];
  
  // Order Conditions
  minOrderValue?: number;
  maxOrderValue?: number;
  paymentMethods?: string[];
  shippingMethods?: string[];
  
  // Geographic Conditions
  countries?: string[];
  states?: string[];
  cities?: string[];
  excludedRegions?: string[];
  
  // Time Conditions
  daysOfWeek?: number[];
  hoursOfDay?: { start: string; end: string };
  
  // Usage Conditions
  maxUsagePerCustomer?: number;
  maxUsagePerDay?: number;
  minTimeBetweenUses?: number; // minutes
  
  // Combination Rules
  canStackWith?: string[]; // other deal IDs
  cannotStackWith?: string[];
  exclusiveWith?: string[];
}

export interface DealBanner {
  imageUrl: string;
  altText: string;
  clickAction: string;
  position: 'top' | 'center' | 'bottom';
  size: 'small' | 'medium' | 'large' | 'full';
  backgroundColor?: string;
  textColor?: string;
  animation?: 'none' | 'fade' | 'slide' | 'bounce';
}

export interface DealMetadata {
  title: string;
  description: string;
  tags: string[];
  category: string;
  priority: number;
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  
  // Display
  badgeText?: string;
  badgeColor?: string;
  displayOrder?: number;
  
  // Legal
  terms: string;
  disclaimer?: string;
  legalText?: string;
}

export interface DealTargeting {
  // Demographic Targeting
  demographics?: {
    ageRange?: { min: number; max: number };
    gender?: 'male' | 'female' | 'other' | 'any';
    income?: { min?: number; max?: number };
    education?: string[];
  };
  
  // Behavioral Targeting
  behavior?: {
    purchaseHistory?: {
      categories?: string[];
      brands?: string[];
      priceRange?: { min: number; max: number };
      frequency?: 'low' | 'medium' | 'high';
    };
    browsingHistory?: {
      categories?: string[];
      products?: string[];
      timeSpent?: number;
    };
    engagement?: {
      emailOpens?: boolean;
      clickThroughs?: boolean;
      socialShares?: boolean;
    };
  };
  
  // Geographic Targeting
  geographic?: {
    countries?: string[];
    regions?: string[];
    cities?: string[];
    radius?: { lat: number; lng: number; radius: number };
    timezone?: string[];
  };
  
  // Technology Targeting
  technology?: {
    devices?: ('desktop' | 'mobile' | 'tablet')[];
    browsers?: string[];
    operatingSystems?: string[];
    appVersions?: string[];
  };
  
  // Custom Segments
  customSegments?: string[];
  userGroups?: string[];
  loyaltyTiers?: string[];
}

export interface DealAnalytics {
  // Basic Metrics
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  
  // Calculated Metrics
  ctr: number; // click-through rate
  conversionRate: number;
  avgOrderValue: number;
  roas: number; // return on ad spend
  
  // Performance by Period
  dailyStats: {
    date: string;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }[];
  
  // Performance by Segment
  segmentStats: {
    segment: string;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }[];
  
  // Product Performance
  productStats: {
    productId: string;
    productName: string;
    sales: number;
    revenue: number;
    discount: number;
  }[];
  
  // Customer Acquisition
  acquisition: {
    newCustomers: number;
    returningCustomers: number;
    customerLifetimeValue: number;
  };
  
  // Geographic Performance
  geoStats: {
    country: string;
    conversions: number;
    revenue: number;
  }[];
}

export interface DealCampaignAnalytics {
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalCost: number;
  
  // Campaign-level Metrics
  ctr: number;
  conversionRate: number;
  cpa: number; // cost per acquisition
  roas: number;
  roi: number; // return on investment
  
  // Deal Performance within Campaign
  dealPerformance: {
    dealId: string;
    dealTitle: string;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    contribution: number; // percentage of campaign revenue
  }[];
}

export interface DealABVariant {
  id: string;
  name: string;
  description: string;
  deal: Partial<DealEntity>;
  trafficAllocation: number; // percentage
  isControl: boolean;
}

export interface DealABTestResults {
  variants: {
    variantId: string;
    name: string;
    participants: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
    avgOrderValue: number;
    confidence: number;
  }[];
  
  significance: boolean;
  pValue: number;
  effect: number; // percentage improvement
  duration: number; // days
}

// API Response Types
export interface DealAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: Date;
}

export interface PaginatedDealResponse<T> {
  success: boolean;
  data: PaginationResponse<T>;
  message?: string;
  timestamp: Date;
}

// Request DTOs
export interface CreateDealRequest {
  title: string;
  description: string;
  dealType: DealType;
  discountRules: DealDiscountRules;
  conditions: Partial<DealConditions>;
  startDate: Date;
  endDate: Date;
  timezone?: string;
  usageLimit?: number;
  maxUsagePerCustomer?: number;
  isAutoApply?: boolean;
  isStackable?: boolean;
  banner?: DealBanner;
  metadata: DealMetadata;
  targeting?: Partial<DealTargeting>;
}

export interface UpdateDealRequest extends Partial<CreateDealRequest> {
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface CreateDealTemplateRequest {
  name: string;
  description: string;
  category: string;
  template: Partial<DealEntity>;
  isPublic?: boolean;
  tags?: string[];
}

export interface CreateDealCampaignRequest {
  name: string;
  description: string;
  dealIds: string[];
  startDate: Date;
  endDate: Date;
  timezone?: string;
  targeting: Partial<DealTargeting>;
  budget?: number;
}

export interface CreateDealABTestRequest {
  name: string;
  description: string;
  variants: DealABVariant[];
  trafficSplit: { [variantId: string]: number };
  startDate: Date;
  endDate?: Date;
}

// Response DTOs
export interface GetDealsResponse {
  deals: DealEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetDealUsageResponse {
  usages: DealUsageEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetDealTemplatesResponse {
  templates: DealTemplateEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DealStatsResponse {
  overview: {
    totalDeals: number;
    activeDeals: number;
    scheduledDeals: number;
    expiredDeals: number;
    totalRevenue: number;
    totalUsage: number;
    avgConversionRate: number;
  };
  
  performance: {
    topPerformingDeals: {
      id: string;
      title: string;
      revenue: number;
      conversions: number;
      conversionRate: number;
    }[];
    
    recentPerformance: {
      date: string;
      revenue: number;
      conversions: number;
      newDeals: number;
    }[];
  };
  
  insights: {
    bestPerformingType: DealType;
    peakUsageHours: number[];
    topCategories: string[];
    avgDealDuration: number;
  };
}

export interface DealEligibilityResponse {
  isEligible: boolean;
  reason?: string;
  requirements?: string[];
  alternativeDeals?: DealEntity[];
  estimatedDiscount?: number;
}

export interface DealApplicationResponse {
  success: boolean;
  discountApplied: number;
  originalTotal: number;
  finalTotal: number;
  currency: string;
  dealTitle: string;
  usageId?: string;
  breakdown?: {
    itemId: string;
    itemName: string;
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
  }[];
}