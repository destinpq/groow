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
};

export default API;
