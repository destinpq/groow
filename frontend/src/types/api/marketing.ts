import { 
  ApiResponse, 
  BaseEntity, 
  PaginatedResponse 
} from './common';

// ================================
// MARKETING ENTITY TYPES  
// ================================

export enum DealType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  BUY_X_GET_Y = 'buy_x_get_y',
  FREE_SHIPPING = 'free_shipping',
  BUNDLE = 'bundle'
}

export enum DealStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  EXPIRED = 'expired',
  SCHEDULED = 'scheduled'
}

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping'
}

export enum PromotionType {
  FLASH_SALE = 'flash_sale',
  SEASONAL = 'seasonal',
  CLEARANCE = 'clearance',
  NEW_CUSTOMER = 'new_customer',
  LOYALTY = 'loyalty'
}

export interface Deal extends BaseEntity {
  id: string;
  title: string;
  description: string;
  type: DealType;
  value: number; // percentage or amount
  status: DealStatus;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  bannerImage?: string;
  conditions?: {
    minOrderValue?: number;
    maxUsageCount?: number;
    maxUsagePerUser?: number;
    applicableProducts?: string[];
    applicableCategories?: string[];
    excludedProducts?: string[];
    newCustomersOnly?: boolean;
  };
  usage: {
    totalUsage: number;
    totalRevenue: number;
    uniqueUsers: number;
  };
  createdBy: string;
  priority: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface Coupon extends BaseEntity {
  id: string;
  code: string;
  title: string;
  description?: string;
  type: CouponType;
  value: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  usageCount: number;
  userLimit?: number;
  minOrderValue?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  excludedProducts?: string[];
  isPublic: boolean;
  createdBy: string;
}

export interface Promotion extends BaseEntity {
  id: string;
  name: string;
  description: string;
  type: PromotionType;
  bannerImage?: string;
  landingPageUrl?: string;
  status: DealStatus;
  startDate: Date;
  endDate: Date;
  targetAudience?: {
    customerSegments?: string[];
    newCustomersOnly?: boolean;
    minPurchaseHistory?: number;
  };
  rules: {
    deals: string[];
    coupons: string[];
    products: string[];
    categories: string[];
  };
  metrics: {
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  createdBy: string;
}

export interface Campaign extends BaseEntity {
  id: string;
  name: string;
  description?: string;
  type: 'email' | 'sms' | 'push' | 'banner';
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate?: Date;
  endDate?: Date;
  targetAudience: {
    segments: string[];
    filters: Record<string, any>;
  };
  content: {
    subject?: string;
    template: string;
    variables: Record<string, any>;
  };
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  budget?: number;
  actualCost?: number;
  createdBy: string;
}

export interface MarketingAnalytics {
  totalDeals: number;
  activeDeals: number;
  totalCoupons: number;
  activeCoupons: number;
  totalPromotions: number;
  totalRevenue: number;
  totalSavings: number;
  conversionRate: number;
  topPerformingDeals: {
    dealId: string;
    title: string;
    usage: number;
    revenue: number;
  }[];
  dealsByType: {
    type: DealType;
    count: number;
    revenue: number;
  }[];
  dailyMetrics: {
    date: string;
    dealUsage: number;
    couponUsage: number;
    revenue: number;
    savings: number;
  }[];
}

// ================================
// REQUEST/RESPONSE TYPES
// ================================

export interface CreateDealRequest {
  title: string;
  description: string;
  type: DealType;
  value: number;
  startDate: Date;
  endDate: Date;
  conditions?: {
    minOrderValue?: number;
    maxUsageCount?: number;
    maxUsagePerUser?: number;
    applicableProducts?: string[];
    applicableCategories?: string[];
    excludedProducts?: string[];
    newCustomersOnly?: boolean;
  };
  priority?: number;
  tags?: string[];
}

export interface CreateDealResponse {
  deal: Deal;
  message: string;
}

export interface GetDealsResponse {
  deals: PaginatedResponse<Deal>;
}

export interface GetDealResponse {
  deal: Deal;
}

export interface GetActiveDealsResponse {
  deals: Deal[];
  total: number;
}

export interface CreateCouponRequest {
  code: string;
  title: string;
  description?: string;
  type: CouponType;
  value: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  userLimit?: number;
  minOrderValue?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  excludedProducts?: string[];
  isPublic?: boolean;
}

export interface CreateCouponResponse {
  coupon: Coupon;
  message: string;
}

export interface CreatePromotionRequest {
  name: string;
  description: string;
  type: PromotionType;
  startDate: Date;
  endDate: Date;
  targetAudience?: {
    customerSegments?: string[];
    newCustomersOnly?: boolean;
    minPurchaseHistory?: number;
  };
  rules: {
    deals: string[];
    coupons: string[];
    products: string[];
    categories: string[];
  };
}

export interface CreatePromotionResponse {
  promotion: Promotion;
  message: string;
}

export interface ApplyDealRequest {
  cartId?: string;
  productIds?: string[];
  customerId: string;
}

export interface ApplyDealResponse {
  applied: boolean;
  discount: {
    type: DealType;
    amount: number;
    originalTotal: number;
    finalTotal: number;
    savings: number;
  };
  deal: Deal;
  message: string;
}

export interface ValidateCouponRequest {
  code: string;
  customerId: string;
  cartTotal: number;
  productIds?: string[];
}

export interface ValidateCouponResponse {
  valid: boolean;
  coupon?: Coupon;
  discount?: {
    amount: number;
    percentage?: number;
  };
  reason?: string;
}

export interface DealAnalytics {
  dealId: string;
  period: string;
  usage: {
    totalUsage: number;
    uniqueUsers: number;
    repeatUsers: number;
  };
  revenue: {
    totalRevenue: number;
    averageOrderValue: number;
    totalSavings: number;
  };
  conversion: {
    views: number;
    clicks: number;
    conversions: number;
    conversionRate: number;
  };
  demographics: {
    ageGroups: { range: string; count: number }[];
    locations: { city: string; count: number }[];
    customerTypes: { type: string; count: number }[];
  };
  dailyStats: {
    date: string;
    usage: number;
    revenue: number;
    conversions: number;
  }[];
}

export interface MarketingDashboard {
  overview: {
    activeDeals: number;
    activeCoupons: number;
    activePromotions: number;
    totalRevenue: number;
    totalSavings: number;
  };
  performance: {
    topDeals: { id: string; title: string; usage: number; revenue: number }[];
    topCoupons: { id: string; code: string; usage: number; revenue: number }[];
    conversionRates: { channel: string; rate: number }[];
  };
  trends: {
    dealUsage: { date: string; count: number }[];
    revenue: { date: string; amount: number }[];
    savings: { date: string; amount: number }[];
  };
}

// ================================
// FILTER TYPES
// ================================

export interface DealFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: DealStatus | DealStatus[];
  type?: DealType | DealType[];
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  createdBy?: string;
  search?: string;
  tags?: string[];
  minValue?: number;
  maxValue?: number;
}

export interface CouponFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  type?: CouponType;
  isActive?: boolean;
  isPublic?: boolean;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  createdBy?: string;
}

// ================================
// MARKETING API INTERFACE
// ================================

export interface MarketingAPI {
  // Deal Management
  createDeal(request: CreateDealRequest): Promise<ApiResponse<CreateDealResponse>>;
  getAllDeals(filter?: DealFilter): Promise<ApiResponse<GetDealsResponse>>;
  getActiveDeals(filter?: Partial<DealFilter>): Promise<ApiResponse<GetActiveDealsResponse>>;
  getDealById(id: string): Promise<ApiResponse<GetDealResponse>>;
  updateDeal(id: string, updates: Partial<CreateDealRequest>): Promise<ApiResponse<CreateDealResponse>>;
  deleteDeal(id: string): Promise<ApiResponse<{ message: string }>>;
  toggleDealStatus(id: string): Promise<ApiResponse<{ deal: Deal }>>;
  duplicateDeal(id: string): Promise<ApiResponse<CreateDealResponse>>;
  
  // Deal Operations
  applyDeal(dealId: string, request: ApplyDealRequest): Promise<ApiResponse<ApplyDealResponse>>;
  checkDealEligibility(dealId: string, request: Partial<ApplyDealRequest>): Promise<ApiResponse<{
    eligible: boolean;
    reason?: string;
    requirements?: string[];
  }>>;
  
  // Coupon Management
  createCoupon(request: CreateCouponRequest): Promise<ApiResponse<CreateCouponResponse>>;
  getAllCoupons(filter?: CouponFilter): Promise<ApiResponse<{ coupons: PaginatedResponse<Coupon> }>>;
  getCouponByCode(code: string): Promise<ApiResponse<{ coupon: Coupon }>>;
  validateCoupon(request: ValidateCouponRequest): Promise<ApiResponse<ValidateCouponResponse>>;
  updateCoupon(id: string, updates: Partial<CreateCouponRequest>): Promise<ApiResponse<CreateCouponResponse>>;
  deleteCoupon(id: string): Promise<ApiResponse<{ message: string }>>;
  
  // Promotion Management
  createPromotion(request: CreatePromotionRequest): Promise<ApiResponse<CreatePromotionResponse>>;
  getAllPromotions(): Promise<ApiResponse<{ promotions: Promotion[] }>>;
  getPromotionById(id: string): Promise<ApiResponse<{ promotion: Promotion }>>;
  updatePromotion(id: string, updates: Partial<CreatePromotionRequest>): Promise<ApiResponse<CreatePromotionResponse>>;
  deletePromotion(id: string): Promise<ApiResponse<{ message: string }>>;
  
  // Analytics & Reports
  getDealAnalytics(dealId: string, period?: string): Promise<ApiResponse<DealAnalytics>>;
  getMarketingAnalytics(period?: string): Promise<ApiResponse<MarketingAnalytics>>;
  getMarketingDashboard(): Promise<ApiResponse<MarketingDashboard>>;
  getDealsStats(): Promise<ApiResponse<{
    totalDeals: number;
    activeDeals: number;
    totalUsage: number;
    totalRevenue: number;
    avgConversionRate: number;
  }>>;
  
  // Bulk Operations
  bulkDeleteDeals(dealIds: string[]): Promise<ApiResponse<{ deleted: number }>>;
  bulkUpdateDealStatus(dealIds: string[], status: boolean): Promise<ApiResponse<{ updated: number }>>;
  
  // Trending & Recommendations
  getTrendingDeals(): Promise<ApiResponse<{ deals: Deal[] }>>;
  getBestDealsForUser(userId: string): Promise<ApiResponse<{ deals: Deal[] }>>;
  getPersonalizedOffers(userId: string): Promise<ApiResponse<{
    deals: Deal[];
    coupons: Coupon[];
    promotions: Promotion[];
  }>>;
  
  // Campaign Management
  createCampaign(request: Partial<Campaign>): Promise<ApiResponse<{ campaign: Campaign }>>;
  getAllCampaigns(): Promise<ApiResponse<{ campaigns: Campaign[] }>>;
  updateCampaign(id: string, updates: Partial<Campaign>): Promise<ApiResponse<{ campaign: Campaign }>>;
  sendCampaign(id: string): Promise<ApiResponse<{ sent: boolean; recipients: number }>>;
  getCampaignMetrics(id: string): Promise<ApiResponse<{ metrics: Campaign['metrics'] }>>;
}