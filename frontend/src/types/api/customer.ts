import { 
  ApiResponse, 
  BaseEntity, 
  PaginatedResponse 
} from './common';

// ================================
// CUSTOMER ENTITY TYPES  
// ================================

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification'
}

export enum CustomerSegment {
  NEW = 'new',
  REGULAR = 'regular',
  VIP = 'vip',
  PREMIUM = 'premium',
  INACTIVE = 'inactive'
}

export enum AddressType {
  HOME = 'home',
  WORK = 'work',
  BILLING = 'billing',
  SHIPPING = 'shipping',
  OTHER = 'other'
}

export interface Customer extends BaseEntity {
  id: string;
  customerId: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  status: CustomerStatus;
  segment: CustomerSegment;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  avatar?: string;
  preferences: {
    language: string;
    currency: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    newsletter: boolean;
    marketing: boolean;
  };
  metadata: {
    source: string;
    referredBy?: string;
    utmCampaign?: string;
    firstOrderDate?: Date;
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
    loyaltyPoints: number;
    creditBalance: number;
  };
  addresses?: Address[];
  lastLoginAt?: Date;
  registrationDate: Date;
}

export interface Address extends BaseEntity {
  id: string;
  customerId: string;
  type: AddressType;
  isDefault: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  instructions?: string;
}

export interface CustomerWishlist extends BaseEntity {
  id: string;
  customerId: string;
  name: string;
  isPublic: boolean;
  items: WishlistItem[];
  totalItems: number;
  shareCode?: string;
}

export interface WishlistItem extends BaseEntity {
  id: string;
  wishlistId: string;
  productId: string;
  variantId?: string;
  addedAt: Date;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  product?: {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    discountedPrice?: number;
    inStock: boolean;
    rating: number;
  };
}

export interface CustomerReview extends BaseEntity {
  id: string;
  customerId: string;
  productId: string;
  orderId?: string;
  rating: number;
  title?: string;
  review?: string;
  pros?: string[];
  cons?: string[];
  isVerifiedPurchase: boolean;
  isPublic: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  status: 'pending' | 'approved' | 'rejected';
  moderatedBy?: string;
  moderatedAt?: Date;
  images?: string[];
  customer?: {
    id: string;
    name: string;
    avatar?: string;
  };
  product?: {
    id: string;
    name: string;
    image: string;
  };
}

export interface LoyaltyProgram extends BaseEntity {
  id: string;
  customerId: string;
  tierId: string;
  points: number;
  lifetimePoints: number;
  nextTierPoints: number;
  tier: {
    id: string;
    name: string;
    minimumPoints: number;
    benefits: string[];
    multiplier: number;
  };
  transactions: LoyaltyTransaction[];
  expiringPoints: {
    points: number;
    expiryDate: Date;
  }[];
}

export interface LoyaltyTransaction extends BaseEntity {
  id: string;
  customerId: string;
  type: 'earned' | 'redeemed' | 'expired' | 'adjusted';
  points: number;
  description: string;
  referenceId?: string;
  referenceType?: string;
  expiryDate?: Date;
}

export interface CustomerSupport extends BaseEntity {
  id: string;
  customerId: string;
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  averageResolutionTime: number;
  satisfactionScore: number;
  preferredContactMethod: 'email' | 'phone' | 'chat';
  notes: string[];
  tags: string[];
}

// ================================
// REQUEST/RESPONSE TYPES
// ================================

export interface CreateCustomerRequest {
  email: string;
  password: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  preferences?: {
    language?: string;
    currency?: string;
    timezone?: string;
    newsletter?: boolean;
    marketing?: boolean;
  };
  source?: string;
  referredBy?: string;
  utmCampaign?: string;
}

export interface CreateCustomerResponse {
  customer: Customer;
  message: string;
}

export interface GetCustomersResponse {
  customers: PaginatedResponse<Customer>;
  segments: {
    segment: CustomerSegment;
    count: number;
  }[];
}

export interface GetCustomerResponse {
  customer: Customer;
  orderSummary?: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
  };
  recentActivity?: {
    orders: any[];
    reviews: any[];
    support: any[];
  };
}

export interface UpdateCustomerRequest {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  preferences?: Partial<Customer['preferences']>;
  status?: CustomerStatus;
  segment?: CustomerSegment;
}

export interface UpdateCustomerResponse {
  customer: Customer;
  message: string;
}

export interface CreateAddressRequest {
  type: AddressType;
  isDefault?: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  instructions?: string;
}

export interface CreateAddressResponse {
  address: Address;
  message: string;
}

export interface GetAddressesResponse {
  addresses: Address[];
}

export interface CreateWishlistRequest {
  name: string;
  isPublic?: boolean;
}

export interface CreateWishlistResponse {
  wishlist: CustomerWishlist;
  message: string;
}

export interface GetWishlistsResponse {
  wishlists: CustomerWishlist[];
}

export interface AddToWishlistRequest {
  wishlistId?: string; // if not provided, adds to default wishlist
  productId: string;
  variantId?: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface AddToWishlistResponse {
  item: WishlistItem;
  wishlist: CustomerWishlist;
  message: string;
}

export interface CreateReviewRequest {
  productId: string;
  orderId?: string;
  rating: number;
  title?: string;
  review?: string;
  pros?: string[];
  cons?: string[];
  isPublic?: boolean;
}

export interface CreateReviewResponse {
  review: CustomerReview;
  message: string;
}

export interface GetReviewsResponse {
  reviews: PaginatedResponse<CustomerReview>;
}

export interface GetLoyaltyProgramResponse {
  loyalty: LoyaltyProgram;
  availableRewards: {
    id: string;
    name: string;
    pointsCost: number;
    description: string;
    type: 'discount' | 'freeShipping' | 'product' | 'experience';
  }[];
}

export interface RedeemPointsRequest {
  rewardId: string;
  points: number;
}

export interface RedeemPointsResponse {
  transaction: LoyaltyTransaction;
  loyalty: LoyaltyProgram;
  reward: {
    id: string;
    code?: string;
    expiryDate?: Date;
  };
  message: string;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  customerGrowth: number;
  segmentDistribution: {
    segment: CustomerSegment;
    count: number;
    percentage: number;
  }[];
  demographics: {
    ageGroups: { range: string; count: number }[];
    genders: { gender: string; count: number }[];
    locations: { city: string; count: number }[];
  };
  behavior: {
    averageOrderValue: number;
    orderFrequency: number;
    retentionRate: number;
    churnRate: number;
    lifetimeValue: number;
  };
  acquisition: {
    sources: { source: string; count: number; cost?: number }[];
    campaigns: { campaign: string; conversions: number; cost?: number }[];
  };
}

// ================================
// FILTER TYPES
// ================================

export interface CustomerFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: CustomerStatus | CustomerStatus[];
  segment?: CustomerSegment | CustomerSegment[];
  search?: string;
  city?: string;
  state?: string;
  country?: string;
  registrationDateFrom?: Date;
  registrationDateTo?: Date;
  lastLoginFrom?: Date;
  lastLoginTo?: Date;
  totalSpentFrom?: number;
  totalSpentTo?: number;
  hasOrders?: boolean;
  isVerified?: boolean;
}

export interface ReviewFilter {
  page?: number;
  limit?: number;
  productId?: string;
  customerId?: string;
  rating?: number[];
  status?: ('pending' | 'approved' | 'rejected')[];
  isVerifiedPurchase?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

// ================================
// CUSTOMER API INTERFACE
// ================================

export interface CustomerAPI {
  // Customer Management
  createCustomer(request: CreateCustomerRequest): Promise<ApiResponse<CreateCustomerResponse>>;
  getAllCustomers(filter?: CustomerFilter): Promise<ApiResponse<GetCustomersResponse>>;
  getCustomerById(id: string): Promise<ApiResponse<GetCustomerResponse>>;
  updateCustomer(id: string, request: UpdateCustomerRequest): Promise<ApiResponse<UpdateCustomerResponse>>;
  deleteCustomer(id: string): Promise<ApiResponse<{ message: string }>>;
  suspendCustomer(id: string, reason: string): Promise<ApiResponse<{ customer: Customer }>>;
  activateCustomer(id: string): Promise<ApiResponse<{ customer: Customer }>>;
  
  // Address Management
  createAddress(request: CreateAddressRequest): Promise<ApiResponse<CreateAddressResponse>>;
  getAddresses(): Promise<ApiResponse<GetAddressesResponse>>;
  getCustomerAddresses(customerId: string): Promise<ApiResponse<GetAddressesResponse>>;
  updateAddress(id: string, request: Partial<CreateAddressRequest>): Promise<ApiResponse<CreateAddressResponse>>;
  deleteAddress(id: string): Promise<ApiResponse<{ message: string }>>;
  setDefaultAddress(id: string): Promise<ApiResponse<{ address: Address }>>;
  
  // Wishlist Management
  createWishlist(request: CreateWishlistRequest): Promise<ApiResponse<CreateWishlistResponse>>;
  getWishlists(): Promise<ApiResponse<GetWishlistsResponse>>;
  getCustomerWishlists(customerId: string): Promise<ApiResponse<GetWishlistsResponse>>;
  addToWishlist(request: AddToWishlistRequest): Promise<ApiResponse<AddToWishlistResponse>>;
  removeFromWishlist(wishlistId: string, itemId: string): Promise<ApiResponse<{ message: string }>>;
  moveWishlistItem(itemId: string, targetWishlistId: string): Promise<ApiResponse<{ item: WishlistItem }>>;
  shareWishlist(wishlistId: string): Promise<ApiResponse<{ shareCode: string; shareUrl: string }>>;
  
  // Review Management
  createReview(request: CreateReviewRequest): Promise<ApiResponse<CreateReviewResponse>>;
  getReviews(filter?: ReviewFilter): Promise<ApiResponse<GetReviewsResponse>>;
  getCustomerReviews(customerId: string): Promise<ApiResponse<GetReviewsResponse>>;
  updateReview(id: string, request: Partial<CreateReviewRequest>): Promise<ApiResponse<CreateReviewResponse>>;
  deleteReview(id: string): Promise<ApiResponse<{ message: string }>>;
  moderateReview(id: string, action: 'approve' | 'reject', reason?: string): Promise<ApiResponse<{ review: CustomerReview }>>;
  voteReviewHelpful(id: string, helpful: boolean): Promise<ApiResponse<{ review: CustomerReview }>>;
  
  // Loyalty Program
  getLoyaltyProgram(): Promise<ApiResponse<GetLoyaltyProgramResponse>>;
  getCustomerLoyalty(customerId: string): Promise<ApiResponse<GetLoyaltyProgramResponse>>;
  redeemPoints(request: RedeemPointsRequest): Promise<ApiResponse<RedeemPointsResponse>>;
  getLoyaltyHistory(customerId?: string): Promise<ApiResponse<{ transactions: PaginatedResponse<LoyaltyTransaction> }>>;
  
  // Customer Support Integration
  getCustomerSupport(customerId: string): Promise<ApiResponse<{ support: CustomerSupport }>>;
  updateCustomerNotes(customerId: string, notes: string[]): Promise<ApiResponse<{ customer: Customer }>>;
  addCustomerTag(customerId: string, tag: string): Promise<ApiResponse<{ customer: Customer }>>;
  removeCustomerTag(customerId: string, tag: string): Promise<ApiResponse<{ customer: Customer }>>;
  
  // Analytics & Segmentation
  getCustomerAnalytics(period?: string): Promise<ApiResponse<CustomerAnalytics>>;
  getCustomerSegments(): Promise<ApiResponse<{
    segments: {
      name: string;
      criteria: Record<string, any>;
      count: number;
    }[];
  }>>;
  updateCustomerSegment(customerId: string, segment: CustomerSegment): Promise<ApiResponse<{ customer: Customer }>>;
  
  // Data Export & Import
  exportCustomers(filter?: CustomerFilter): Promise<Blob>;
  importCustomers(file: File): Promise<ApiResponse<{ imported: number; failed: number; errors?: string[] }>>;
  
  // Customer Communication
  sendWelcomeEmail(customerId: string): Promise<ApiResponse<{ sent: boolean }>>;
  sendCustomEmail(customerId: string, template: string, variables?: Record<string, any>): Promise<ApiResponse<{ sent: boolean }>>;
}