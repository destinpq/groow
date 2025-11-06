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
export { emailTemplatesAPI } from './emailTemplates';
export type {
  EmailTemplate,
  CreateEmailTemplateDto,
  UpdateEmailTemplateDto,
} from './emailTemplates';

// System Logs
export { systemLogsAPI } from './systemLogs';
export type {
  SystemLog,
  LogStats,
  LogFilters,
  ExportParams,
} from './systemLogs';

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

// Flash Sales
export { flashSalesAPI } from './flashSales';
export type {
  FlashSale,
  FlashSaleProduct,
  FlashSaleAnalytics,
  DailyDeal,
  FlashSaleTemplate,
  FlashSaleStats,
  FlashSaleActivity,
  FlashSaleFilters,
  FlashSaleCreateRequest,
  FlashSaleUpdateRequest,
} from './flashSales';

// Bulk Operations (alias to bulkData)
export { bulkDataAPI } from './bulkData';

// Currency
export { currencyAPI } from './currency';
export type {
  Currency,
  ExchangeRate,
  CurrencyConversion,
  PriceLocalization,
  CurrencySettings,
  CurrencyStats,
  GeoLocationCurrency,
  CurrencyValidation,
  BulkPriceUpdate,
  CurrencyFilters,
} from './currency';

// Inventory Alerts
export { inventoryAlertsAPI } from './inventoryAlerts';
export type {
  InventoryAlert,
  AlertRule,
  AlertCondition,
  AlertAction,
  NotificationChannel,
  InventoryThreshold,
  AlertStats,
  AlertFilters,
  BulkAlertAction,
} from './inventoryAlerts';

// Advanced Orders
export { advancedOrderAPI } from './advancedOrders';
export type {
  AdvancedOrder,
  AdvancedOrderItem,
  AdvancedShippingDetails,
  AdvancedBillingDetails,
  AdvancedPaymentDetails,
  AdvancedOrderTotals,
  OrderWorkflow,
  AdvancedOrderTracking,
  AdvancedTrackingEvent,
  OrderMetadata,
  OrderEvent,
  OrderNote,
  OrderSplit,
  FulfillmentDetails,
  AdvancedOrderFilters,
  OrderStats,
  WorkflowTemplate,
  WorkflowStage,
  AutomationRule,
  OrderBatch,
} from './advancedOrders';

// Loyalty Programs
export { loyaltyAPI } from './loyalty';
export type {
  LoyaltyProgram,
  LoyaltyTier,
  TierThreshold,
  LoyaltyReward,
  CustomerLoyalty,
  PointsTransaction,
  LoyaltyAnalytics,
  LoyaltyRule,
  LoyaltyEngagement,
  LoyaltyCampaign,
} from './loyalty';

// Security
export { securityAPI } from './security';
export type {
  SecurityThreat,
  SecurityEvent,
  BlockedIP,
  ActivityLog,
  SecurityMetrics,
  SecurityConfiguration,
  SecurityFilters,
} from './security';

// Affiliate & Referral
export { affiliateAPI, affiliateAdminAPI } from './affiliate';
export type {
  AffiliateProgram,
  AffiliateAccount,
  ReferralLink,
  ReferralActivity,
  Commission,
  PayoutRequest as AffiliatePayoutRequest,
  AffiliateStats,
  AffiliateFilters,
  CreateAffiliateData,
  CreateReferralLinkData,
} from './affiliate';

// Product Bundles
export { bundlesAPI } from './bundles';
export type {
  ProductBundle,
  BundleProduct,
  BundleInventory,
  BundleAnalytics,
  BundleTemplate,
  BundlePromotion,
  BundleStats,
  BundleActivity,
  BundleFilters,
  CreateBundleRequest,
  UpdateBundleRequest,
} from './bundles';

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
import { flashSalesAPI } from './flashSales';
import { bundlesAPI } from './bundles';
import { bulkDataAPI } from './bulkData';
import { currencyAPI } from './currency';
import { inventoryAlertsAPI } from './inventoryAlerts';
import { advancedOrderAPI } from './advancedOrders';
import { loyaltyAPI } from './loyalty';
import { securityAPI } from './security';
import { affiliateAPI, affiliateAdminAPI } from './affiliate';
import { digitalDownloadsAPI } from './digitalDownloadsAPI';
import { subscriptionsAPI } from './subscriptions';
import { cmsAPI } from './cmsAPI';
import { preOrdersAPI } from './preOrders';
import { savedSearchesAPI } from './savedSearches';
import { giftWrappingAPI } from './giftWrapping';
import { comparisonAPI } from './comparison';
import { auctionsAPI } from './auctions';
import { shoppingListsAPI } from './shoppingLists';
import { sampleRequestsAPI } from './sampleRequests';
import { storeLocatorAPI } from './storeLocator';
import { gamificationAPI } from './gamification';
import { voiceSearchAPI } from './voiceSearch';
import { taxExemptionAPI } from './taxExemption';
import { warrantyAPI } from './warranty';

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
  flashSales: flashSalesAPI,
  bundles: bundlesAPI,
  bulkData: bulkDataAPI,
  currency: currencyAPI,
  inventoryAlerts: inventoryAlertsAPI,
  advancedOrders: advancedOrderAPI,
  loyalty: loyaltyAPI,
  security: securityAPI,
  affiliate: affiliateAPI,
  affiliateAdmin: affiliateAdminAPI,
  digitalDownloads: digitalDownloadsAPI,
  subscriptions: subscriptionsAPI,
  cms: cmsAPI,
  preOrders: preOrdersAPI,
  savedSearches: savedSearchesAPI,
  giftWrapping: giftWrappingAPI,
  comparison: comparisonAPI,
  auctions: auctionsAPI,
  shoppingLists: shoppingListsAPI,
  sampleRequests: sampleRequestsAPI,
  storeLocator: storeLocatorAPI,
  gamification: gamificationAPI,
  voiceSearch: voiceSearchAPI,
  taxExemption: taxExemptionAPI,
  warranty: warrantyAPI,
};

export default API;

// Digital Downloads
export { digitalDownloadsAPI } from './digitalDownloadsAPI';
export type {
  DigitalProduct,
  DigitalProductType,
  DownloadStatus,
  LicenseStatus,
  DownloadHistory,
  LicenseActivation,
  DownloadStats,
  ProductUpdate,
  CreateDownloadRequest,
  VerifyLicenseRequest,
  ActivateLicenseRequest,
  DeactivateLicenseRequest,
} from './digitalDownloadsAPI';

// Subscriptions
export { subscriptionsAPI } from './subscriptions';
export type {
  Subscription,
  SubscriptionPlan,
  BillingHistory,
  SubscriptionStats,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  SubscriptionFilters,
} from './subscriptions';

// CMS (Content Management System)
export { cmsAPI } from './cmsAPI';
export type {
  CMSPage,
  CMSBanner,
  CMSFAQ,
  CMSMenu,
  CMSMenuItem,
  CMSMedia,
  CMSTestimonial,
  CMSSocialLink,
  CMSBlogPost,
  CMSNewsletter,
  CMSAnnouncement,
} from './cmsAPI';

// Pre-Orders
export { preOrdersAPI } from './preOrders';
export type {
  PreOrderProduct,
  MyPreOrder,
  CreatePreOrderData,
  UpdatePreOrderData,
} from './preOrders';

// Saved Searches
export { savedSearchesAPI } from './savedSearches';
export type {
  SavedSearch,
  CreateSavedSearchData,
  UpdateSavedSearchData,
} from './savedSearches';

// Gift Wrapping
export { giftWrappingAPI } from './giftWrapping';
export type {
  GiftWrap,
  GiftWrapOrder,
  CreateGiftWrapOrderData,
} from './giftWrapping';

// Product Comparison
export { comparisonAPI } from './comparison';
export type {
  ComparisonList,
  ProductComparison,
} from './comparison';

// Auctions
export { auctionsAPI } from './auctions';
export type {
  Auction,
  Bid,
  CreateBidData,
} from './auctions';

// Shopping Lists
export { shoppingListsAPI } from './shoppingLists';
export type {
  ShoppingList,
  ShoppingListItem,
  CreateShoppingListData,
  AddItemToListData,
} from './shoppingLists';

// Sample Requests
export { sampleRequestsAPI } from './sampleRequests';
export type {
  SampleRequest,
  CreateSampleRequestData,
} from './sampleRequests';

// Store Locator
export { storeLocatorAPI } from './storeLocator';
export type {
  Store,
} from './storeLocator';

// Gamification
export { gamificationAPI } from './gamification';
export type {
  UserProfile,
  Badge,
  Achievement,
  Leaderboard,
  Challenge,
} from './gamification';

// Voice Search
export { voiceSearchAPI } from './voiceSearch';
export type {
  VoiceSearchResult,
  VoiceCommand,
  VoiceSettings,
} from './voiceSearch';

// Tax Exemption
export { taxExemptionAPI } from './taxExemption';
export type {
  TaxExemption as CustomerTaxExemption,
  CreateTaxExemptionData,
  TaxExemptionOrder,
} from './taxExemption';

// Warranty Management
export { warrantyAPI } from './warranty';
export type {
  Warranty,
  WarrantyPlan,
  WarrantyClaim,
  CreateClaimData,
} from './warranty';
