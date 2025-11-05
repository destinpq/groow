/**
/**
 * Centralized API Services
 * 
 * This file exports all API services for easy imports throughout the application.
 * 
 * Usage:
 * import { authAPI, productAPI, ordersAPI } from '@/services/api';
 * 
 * const user = await authAPI.login({ email, password });
 * const products = await productAPI.getAll();
 */

// Core API Client
export { default as api } from './client';

// Authentication
export { authAPI } from './auth';
export type { LoginCredentials, RegisterData, AuthResponse, User } from './auth';

// Products
export { productAPI } from './products';
export type { 
  Product, 
  ProductFilters, 
  CreateProductData,
  PaginatedResponse,
} from './products';

// Orders
export { ordersAPI } from './orders';
export type { 
  Order, 
  OrderItem, 
  Address, 
  CreateOrderData,
  OrderFilters,
} from './orders';

// Cart & Wishlist
export { cartAPI, wishlistAPI } from './cart';
export type { Cart, CartItem, AddToCartData, Wishlist, WishlistItem } from './cart';

// Catalog (Categories & Brands)
export { categoriesAPI, brandsAPI } from './catalog';
export type { Category, CreateCategoryData, Brand, CreateBrandData } from './catalog';

// Customers
export { customerAPI } from './customers';
export type { Customer, Address as CustomerAddress, UpdateProfileData } from './customers';

// Vendors
export { vendorAPI } from './vendors';
export type { Vendor, UpdateVendorProfileData, KYCDocument, VendorStats } from './vendors';

// RFQ
export { rfqAPI } from './rfq';
export type { RFQ, Quotation, CreateRFQData, CreateQuotationData, RFQMessage } from './rfq';

// Reviews
export { reviewsAPI } from './reviews';
export type { Review, CreateReviewData, ReviewStats } from './reviews';

// Notifications
export { notificationsAPI } from './notifications';
export type { Notification, NotificationPreferences } from './notifications';

// Wallet & Payments
export { walletAPI, paymentAPI } from './wallet';
export type { 
  Wallet, 
  WalletTransaction, 
  PaymentMethod, 
  CreatePaymentMethodData,
  PayoutRequest,
} from './wallet';

// Upload
export { uploadAPI } from './upload';
export type { UploadedFile, UploadProgress } from './upload';

// Settings
export { settingsAPI } from './settings';
export type { 
  Settings,
  GeneralSettings,
  SEOSettings,
  PaymentSettings,
  EmailSettings,
} from './settings';

// Chat
export { chatAPI } from './chat';
export type { 
  Conversation,
  Message,
  SendMessageData,
  CreateConversationData,
} from './chat';

// Shipping
export { shippingAPI } from './shipping';
export type { 
  ShippingCarrier,
  ShippingMethod,
  ShippingZone,
  ShippingRate,
  TrackingInfo,
  TrackingEvent,
  CalculateRateData,
  CreateCarrierData,
  CreateMethodData,
} from './shipping';

// Analytics
export { analyticsAPI } from './analytics';
export type { 
  AnalyticsOverview,
  TrafficData,
  RevenueData,
  TrafficSource,
  TopProduct,
  TopCategory,
  CustomerMetrics,
  PageView,
  ConversionFunnel,
  AnalyticsEvent,
  GeographicData,
  DeviceStats,
  AnalyticsFilters,
} from './analytics';

// Coupons
export { couponsAPI } from './coupons';
export type {
  Coupon,
  CreateCouponDto,
  UpdateCouponDto,
  CouponFilters,
  CouponStats,
  CouponUsage,
  ValidateCouponDto,
  CouponValidation,
} from './coupons';

// Tax
export { taxAPI } from './tax';
export type {
  TaxRate,
  TaxJurisdiction,
  TaxCalculation,
  CreateTaxRateDto,
  UpdateTaxRateDto,
  TaxCalculationRequest,
  TaxStats,
  TaxExemption,
} from './tax';

// Email Templates
export { emailAPI } from './email';
export type {
  EmailTemplate,
  CreateEmailTemplateDto,
  UpdateEmailTemplateDto,
  EmailCampaign,
  CreateEmailCampaignDto,
  UpdateEmailCampaignDto,
  EmailStats,
  EmailPreview,
  TestEmailDto,
} from './email';

// Logs
export { logsAPI } from './logs';
export type {
  ActivityLog,
  ErrorLog,
  SecurityLog,
  SystemLog,
  LogStats,
  LogFilters,
  LogExportOptions,
} from './logs';

// Returns
export { returnsAPI } from './returns';
export type {
  ReturnRequest,
  CreateReturnRequestDto,
  UpdateReturnRequestDto,
  ReturnFilters,
  ReturnStats,
  ReturnTimeline,
  RefundDto,
  InspectionDto,
} from './returns';

// Support
export { supportAPI } from './support';
export type {
  SupportTicket,
  CreateTicketDto,
  UpdateTicketDto,
  TicketMessage,
  CreateMessageDto,
  TicketFilters,
  SupportStats,
  KnowledgeBaseArticle,
  CreateArticleDto,
  UpdateArticleDto,
  TicketAssignment,
  EscalationRule,
  ChatSession,
  ChatMessage,
} from './support';

// Re-export all services as a single object for convenience
import { authAPI } from './auth';
import { productAPI } from './products';
import { ordersAPI } from './orders';
import { cartAPI, wishlistAPI } from './cart';
import { categoriesAPI, brandsAPI } from './catalog';
import { customerAPI } from './customers';
import { vendorAPI } from './vendors';
import { rfqAPI } from './rfq';
import { reviewsAPI } from './reviews';
import { notificationsAPI } from './notifications';
import { walletAPI, paymentAPI } from './wallet';
import { uploadAPI } from './upload';
import { settingsAPI } from './settings';
import { chatAPI } from './chat';
import { shippingAPI } from './shipping';
import { analyticsAPI } from './analytics';
import { couponsAPI } from './coupons';
import { taxAPI } from './tax';
import { emailAPI } from './email';
import { logsAPI } from './logs';
import { returnsAPI } from './returns';
import { supportAPI } from './support';

export const API = {
  auth: authAPI,
  products: productAPI,
  orders: ordersAPI,
  cart: cartAPI,
  wishlist: wishlistAPI,
  categories: categoriesAPI,
  brands: brandsAPI,
  customers: customerAPI,
  vendors: vendorAPI,
  rfq: rfqAPI,
  reviews: reviewsAPI,
  notifications: notificationsAPI,
  wallet: walletAPI,
  payment: paymentAPI,
  upload: uploadAPI,
  settings: settingsAPI,
  chat: chatAPI,
  shipping: shippingAPI,
  analytics: analyticsAPI,
  coupons: couponsAPI,
  tax: taxAPI,
  email: emailAPI,
  logs: logsAPI,
  returns: returnsAPI,
  support: supportAPI,
};

export default API;
