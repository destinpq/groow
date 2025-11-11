import { 
  ApiResponse, 
  BaseEntity, 
  PaginatedResponse 
} from './common';

// ================================
// VENDOR ENTITY TYPES  
// ================================

export enum VendorStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  REJECTED = 'rejected'
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum VendorType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
  MANUFACTURER = 'manufacturer',
  DISTRIBUTOR = 'distributor',
  RESELLER = 'reseller'
}

export interface Vendor extends BaseEntity {
  id: string;
  vendorId: string;
  userId: string;
  email: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  type: VendorType;
  status: VendorStatus;
  isVerified: boolean;
  logo?: string;
  description?: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  businessInfo: {
    registrationNumber?: string;
    taxId?: string;
    establishedYear?: number;
    employeeCount?: string;
    annualRevenue?: string;
  };
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountHolderName: string;
    branchAddress?: string;
  };
  documents: VendorDocument[];
  settings: {
    commissionRate: number;
    payoutThreshold: number;
    payoutSchedule: 'weekly' | 'biweekly' | 'monthly';
    autoApproveProducts: boolean;
    allowBulkUploads: boolean;
    maxProducts: number;
    categories: string[];
  };
  metrics: {
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    totalRevenue: number;
    rating: number;
    reviewCount: number;
    fulfillmentRate: number;
    averageResponseTime: number; // in hours
    lastActiveAt?: Date;
  };
  compliance: {
    documentsSubmitted: boolean;
    backgroundCheckPassed: boolean;
    termsAccepted: boolean;
    privacyPolicyAccepted: boolean;
    lastComplianceCheck?: Date;
  };
  onboarding: {
    step: number;
    isCompleted: boolean;
    completedSteps: string[];
    nextStep?: string;
  };
}

export interface VendorDocument extends BaseEntity {
  id: string;
  vendorId: string;
  type: 'business_license' | 'tax_certificate' | 'identity_proof' | 'address_proof' | 'bank_statement' | 'other';
  name: string;
  url: string;
  status: DocumentStatus;
  uploadedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  rejectionReason?: string;
  expiryDate?: Date;
  notes?: string;
}

export interface VendorProduct extends BaseEntity {
  id: string;
  vendorId: string;
  productId: string;
  sku: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'inactive';
  inventory: {
    quantity: number;
    reserved: number;
    available: number;
    lowStockThreshold: number;
  };
  pricing: {
    cost: number;
    sellingPrice: number;
    comparePrice?: number;
    margin: number;
    marginPercentage: number;
  };
  fulfillment: {
    processingTime: number; // in days
    shippingFrom: string;
    weightKg: number;
    dimensionsCm: {
      length: number;
      width: number;
      height: number;
    };
  };
  performance: {
    views: number;
    orders: number;
    revenue: number;
    rating: number;
    reviewCount: number;
    conversionRate: number;
  };
  lastUpdated: Date;
}

export interface VendorOrder extends BaseEntity {
  id: string;
  orderId: string;
  vendorId: string;
  customerId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }[];
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    commission: number;
    total: number;
    vendorEarning: number;
  };
  shipping: {
    method: string;
    cost: number;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
  };
  timeline: {
    placedAt: Date;
    confirmedAt?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
    cancelledAt?: Date;
  };
  customer: {
    id: string;
    name: string;
    email: string;
    address: string;
  };
}

export interface VendorPayout extends BaseEntity {
  id: string;
  vendorId: string;
  payoutId: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  amounts: {
    grossSales: number;
    commission: number;
    adjustments: number;
    netAmount: number;
  };
  orders: string[]; // order IDs included in this payout
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: 'bank_transfer' | 'paypal' | 'stripe' | 'check';
  transactionId?: string;
  processedAt?: Date;
  failureReason?: string;
  documents?: string[];
  notes?: string;
}

export interface VendorAnalytics {
  vendorId: string;
  period: string;
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    averageOrderValue: number;
    conversionRate: number;
    rating: number;
  };
  growth: {
    revenueGrowth: number;
    orderGrowth: number;
    productGrowth: number;
  };
  topProducts: {
    productId: string;
    name: string;
    revenue: number;
    orders: number;
    views: number;
  }[];
  orderTrends: {
    date: string;
    orders: number;
    revenue: number;
  }[];
  customerInsights: {
    totalCustomers: number;
    repeatCustomers: number;
    averageLifetimeValue: number;
    topCustomers: {
      customerId: string;
      name: string;
      orders: number;
      revenue: number;
    }[];
  };
  inventory: {
    totalProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    totalValue: number;
    turnoverRate: number;
  };
}

export interface VendorCommission extends BaseEntity {
  id: string;
  vendorId: string;
  orderId: string;
  productId: string;
  commissionRate: number;
  grossAmount: number;
  commissionAmount: number;
  netAmount: number;
  status: 'pending' | 'approved' | 'paid';
  calculatedAt: Date;
  paidAt?: Date;
  payoutId?: string;
  adjustments?: {
    type: 'fee' | 'bonus' | 'penalty';
    amount: number;
    reason: string;
  }[];
}

// ================================
// REQUEST/RESPONSE TYPES
// ================================

export interface VendorRegistrationRequest {
  email: string;
  password: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  type: VendorType;
  website?: string;
  description?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  businessInfo?: {
    registrationNumber?: string;
    taxId?: string;
    establishedYear?: number;
    employeeCount?: string;
    annualRevenue?: string;
  };
}

export interface VendorRegistrationResponse {
  vendor: Vendor;
  message: string;
  nextSteps: string[];
}

export interface GetVendorsResponse {
  vendors: PaginatedResponse<Vendor>;
  summary: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
  };
}

export interface GetVendorResponse {
  vendor: Vendor;
  analytics?: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    rating: number;
  };
}

export interface UpdateVendorRequest {
  companyName?: string;
  contactPerson?: string;
  phone?: string;
  website?: string;
  description?: string;
  logo?: string;
  address?: Partial<Vendor['address']>;
  businessInfo?: Partial<Vendor['businessInfo']>;
  bankDetails?: Partial<Vendor['bankDetails']>;
}

export interface UpdateVendorResponse {
  vendor: Vendor;
  message: string;
}

export interface UploadDocumentRequest {
  type: 'business_license' | 'tax_certificate' | 'identity_proof' | 'address_proof' | 'bank_statement' | 'other';
  name: string;
  expiryDate?: Date;
  notes?: string;
}

export interface UploadDocumentResponse {
  document: VendorDocument;
  message: string;
}

export interface GetDocumentsResponse {
  documents: VendorDocument[];
  requiredDocuments: string[];
  completionPercentage: number;
}

export interface GetVendorProductsResponse {
  products: PaginatedResponse<VendorProduct>;
  summary: {
    total: number;
    active: number;
    draft: number;
    outOfStock: number;
    totalValue: number;
  };
}

export interface GetVendorOrdersResponse {
  orders: PaginatedResponse<VendorOrder>;
  summary: {
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    totalRevenue: number;
  };
}

export interface UpdateOrderStatusRequest {
  status: 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
}

export interface UpdateOrderStatusResponse {
  order: VendorOrder;
  message: string;
}

export interface GetPayoutsResponse {
  payouts: PaginatedResponse<VendorPayout>;
  summary: {
    totalEarnings: number;
    pendingAmount: number;
    paidAmount: number;
    nextPayoutDate?: Date;
  };
}

export interface RequestPayoutRequest {
  amount?: number; // if not specified, pays all available
  notes?: string;
}

export interface RequestPayoutResponse {
  payout: VendorPayout;
  message: string;
}

export interface GetVendorAnalyticsResponse {
  analytics: VendorAnalytics;
}

export interface GetCommissionsResponse {
  commissions: PaginatedResponse<VendorCommission>;
  summary: {
    totalCommissions: number;
    pendingCommissions: number;
    paidCommissions: number;
    averageRate: number;
  };
}

// ================================
// FILTER TYPES
// ================================

export interface VendorFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: VendorStatus | VendorStatus[];
  type?: VendorType | VendorType[];
  isVerified?: boolean;
  city?: string;
  state?: string;
  country?: string;
  registrationDateFrom?: Date;
  registrationDateTo?: Date;
  revenueFrom?: number;
  revenueTo?: Date;
  search?: string;
}

export interface VendorOrderFilter {
  page?: number;
  limit?: number;
  status?: ('pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled')[];
  dateFrom?: Date;
  dateTo?: Date;
  customerId?: string;
  search?: string;
}

export interface VendorProductFilter {
  page?: number;
  limit?: number;
  status?: ('draft' | 'pending' | 'approved' | 'rejected' | 'inactive')[];
  categoryId?: string;
  inStock?: boolean;
  search?: string;
  priceFrom?: number;
  priceTo?: number;
}

// ================================
// VENDOR API INTERFACE
// ================================

export interface VendorAPI {
  // Vendor Registration & Management
  registerVendor(request: VendorRegistrationRequest): Promise<ApiResponse<VendorRegistrationResponse>>;
  getAllVendors(filter?: VendorFilter): Promise<ApiResponse<GetVendorsResponse>>;
  getVendorById(id: string): Promise<ApiResponse<GetVendorResponse>>;
  getMyVendorProfile(): Promise<ApiResponse<GetVendorResponse>>;
  updateVendor(id: string, request: UpdateVendorRequest): Promise<ApiResponse<UpdateVendorResponse>>;
  updateMyVendorProfile(request: UpdateVendorRequest): Promise<ApiResponse<UpdateVendorResponse>>;
  deleteVendor(id: string): Promise<ApiResponse<{ message: string }>>;
  
  // Vendor Status Management
  approveVendor(id: string): Promise<ApiResponse<{ vendor: Vendor }>>;
  rejectVendor(id: string, reason: string): Promise<ApiResponse<{ vendor: Vendor }>>;
  suspendVendor(id: string, reason: string): Promise<ApiResponse<{ vendor: Vendor }>>;
  activateVendor(id: string): Promise<ApiResponse<{ vendor: Vendor }>>;
  
  // Document Management
  uploadDocument(request: UploadDocumentRequest, file: File): Promise<ApiResponse<UploadDocumentResponse>>;
  getDocuments(): Promise<ApiResponse<GetDocumentsResponse>>;
  getVendorDocuments(vendorId: string): Promise<ApiResponse<GetDocumentsResponse>>;
  verifyDocument(documentId: string, approved: boolean, reason?: string): Promise<ApiResponse<{ document: VendorDocument }>>;
  deleteDocument(documentId: string): Promise<ApiResponse<{ message: string }>>;
  
  // Product Management
  getVendorProducts(vendorId?: string, filter?: VendorProductFilter): Promise<ApiResponse<GetVendorProductsResponse>>;
  getMyProducts(filter?: VendorProductFilter): Promise<ApiResponse<GetVendorProductsResponse>>;
  updateProductInventory(productId: string, quantity: number): Promise<ApiResponse<{ product: VendorProduct }>>;
  updateProductPricing(productId: string, pricing: Partial<VendorProduct['pricing']>): Promise<ApiResponse<{ product: VendorProduct }>>;
  bulkUpdateProducts(updates: { productId: string; updates: Partial<VendorProduct> }[]): Promise<ApiResponse<{ updated: number; failed: number }>>;
  
  // Order Management
  getVendorOrders(vendorId?: string, filter?: VendorOrderFilter): Promise<ApiResponse<GetVendorOrdersResponse>>;
  getMyOrders(filter?: VendorOrderFilter): Promise<ApiResponse<GetVendorOrdersResponse>>;
  getOrderById(orderId: string): Promise<ApiResponse<{ order: VendorOrder }>>;
  updateOrderStatus(orderId: string, request: UpdateOrderStatusRequest): Promise<ApiResponse<UpdateOrderStatusResponse>>;
  cancelOrder(orderId: string, reason: string): Promise<ApiResponse<{ order: VendorOrder }>>;
  
  // Payout Management
  getPayouts(vendorId?: string): Promise<ApiResponse<GetPayoutsResponse>>;
  getMyPayouts(): Promise<ApiResponse<GetPayoutsResponse>>;
  requestPayout(request?: RequestPayoutRequest): Promise<ApiResponse<RequestPayoutResponse>>;
  getPayoutDetails(payoutId: string): Promise<ApiResponse<{ payout: VendorPayout }>>;
  
  // Commission Management
  getCommissions(vendorId?: string): Promise<ApiResponse<GetCommissionsResponse>>;
  getMyCommissions(): Promise<ApiResponse<GetCommissionsResponse>>;
  getCommissionSettings(vendorId: string): Promise<ApiResponse<{ settings: Vendor['settings'] }>>;
  updateCommissionSettings(vendorId: string, settings: Partial<Vendor['settings']>): Promise<ApiResponse<{ settings: Vendor['settings'] }>>;
  
  // Analytics & Reporting
  getVendorAnalytics(vendorId?: string, period?: string): Promise<ApiResponse<GetVendorAnalyticsResponse>>;
  getMyAnalytics(period?: string): Promise<ApiResponse<GetVendorAnalyticsResponse>>;
  getVendorDashboard(vendorId?: string): Promise<ApiResponse<{
    dashboard: {
      todayOrders: number;
      pendingOrders: number;
      lowStockProducts: number;
      totalRevenue: number;
      recentOrders: VendorOrder[];
      notifications: any[];
    };
  }>>;
  
  // Onboarding
  getOnboardingStatus(): Promise<ApiResponse<{ onboarding: Vendor['onboarding'] }>>;
  completeOnboardingStep(step: string): Promise<ApiResponse<{ onboarding: Vendor['onboarding'] }>>;
  
  // Settings & Configuration
  getVendorSettings(): Promise<ApiResponse<{ settings: Vendor['settings'] }>>;
  updateVendorSettings(settings: Partial<Vendor['settings']>): Promise<ApiResponse<{ settings: Vendor['settings'] }>>;
  
  // Communication
  sendMessageToVendor(vendorId: string, subject: string, message: string): Promise<ApiResponse<{ sent: boolean }>>;
  getVendorNotifications(): Promise<ApiResponse<{ notifications: any[] }>>;
  markNotificationRead(notificationId: string): Promise<ApiResponse<{ marked: boolean }>>;
  
  // Public Vendor Information
  getPublicVendorProfile(vendorId: string): Promise<ApiResponse<{
    vendor: {
      id: string;
      companyName: string;
      description: string;
      logo: string;
      rating: number;
      reviewCount: number;
      establishedYear: number;
      totalProducts: number;
      responseTime: string;
    };
  }>>;
}