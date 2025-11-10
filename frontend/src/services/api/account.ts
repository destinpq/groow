import api from './client';
import { PaginatedResponse } from '../../types/api/common';
import {
  Customer,
  Address as CustomerAddress,
  CustomerWishlist,
  CustomerReview,
  LoyaltyProgram,
  LoyaltyTransaction,
  CustomerStatus,
  CustomerSegment,
  AddressType,
  GetCustomerResponse,
  UpdateCustomerRequest,
  UpdateCustomerResponse,
  CreateAddressRequest,
  CreateAddressResponse,
  GetAddressesResponse
} from '../../types/api/customer';

// Re-export and compatibility types with unique names
export type CustomerProfile = Customer;
export type Address = CustomerAddress;
export type WishlistItem = CustomerWishlist;
export type ReviewData = CustomerReview;

// Keep existing interfaces for backward compatibility (but rename to avoid conflicts)
export interface PaymentMethod {
  id: string;
  customerId: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_account' | 'digital_wallet';
  provider: string; // visa, mastercard, paypal, etc.
  title: string;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  holderName: string;
  billingAddressId?: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountPreferencesLegacy {
  customerId: string;
  notifications: {
    email: {
      orderUpdates: boolean;
      promotions: boolean;
      newsletter: boolean;
      security: boolean;
    };
    sms: {
      orderUpdates: boolean;
      promotions: boolean;
      security: boolean;
    };
    push: {
      orderUpdates: boolean;
      promotions: boolean;
      inApp: boolean;
    };
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showWishlist: boolean;
    showReviews: boolean;
    allowDataCollection: boolean;
  };
  shopping: {
    defaultShippingAddressId?: string;
    defaultBillingAddressId?: string;
    defaultPaymentMethodId?: string;
    savePaymentMethods: boolean;
    autoApplyCoupons: boolean;
    quickCheckout: boolean;
  };
  display: {
    language: string;
    currency: string;
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
    itemsPerPage: number;
  };
}

export interface SecuritySettings {
  customerId: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'sms' | 'email' | 'app';
  loginAlerts: boolean;
  sessionTimeout: number; // in minutes
  trustedDevices: TrustedDevice[];
  loginHistory: LoginHistory[];
  securityQuestions: SecurityQuestion[];
}

export interface TrustedDevice {
  id: string;
  deviceName: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  ipAddress: string;
  location: string;
  lastUsed: Date;
  createdAt: Date;
}

export interface LoginHistory {
  id: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  success: boolean;
  timestamp: Date;
}

export interface SecurityQuestion {
  id: string;
  question: string;
  answer: string; // hashed
}

export interface AccountStats {
  totalOrders: number;
  totalSpent: number;
  totalSaved: number;
  wishlistItems: number;
  reviewsWritten: number;
  loyaltyPoints: number;
  memberSince: Date;
  lastOrderDate?: Date;
  averageOrderValue: number;
  favoriteCategory: string;
}

export interface WishlistItem {
  id: string;
  customerId: string;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  productSku: string;
  vendorId: string;
  vendorName: string;
  isAvailable: boolean;
  priceHistory: {
    price: number;
    date: Date;
  }[];
  addedAt: Date;
  notes?: string;
}

export interface ReviewData {
  id: string;
  customerId: string;
  productId: string;
  orderId: string;
  rating: number;
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  images: string[];
  isRecommended: boolean;
  isVerifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  helpfulVotes: number;
  totalVotes: number;
  vendorResponse?: {
    message: string;
    respondedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Profile API with typed POJOs
export const profileAPI = {
  // Get customer profile
  getProfile: async (): Promise<CustomerProfile> => {
    const response = await api.get<GetCustomerResponse>('/customer/profile');
    return response.data.customer;
  },

  // Update customer profile
  updateProfile: async (data: UpdateCustomerRequest): Promise<CustomerProfile> => {
    const response = await api.put<UpdateCustomerResponse>('/customer/profile', data);
    return response.data.customer;
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post<{ url: string }>('/customer/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    await api.post('/customer/profile/verify-email', { token });
  },

  // Resend email verification
  resendEmailVerification: async (): Promise<void> => {
    await api.post('/customer/profile/resend-email-verification');
  },

  // Verify phone
  verifyPhone: async (code: string) => {
    return request.post('/customer/profile/verify-phone', { code });
  },

  // Send phone verification
  sendPhoneVerification: async (phone: string) => {
    return request.post('/customer/profile/send-phone-verification', { phone });
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    return request.post('/customer/profile/change-password', data);
  },

  // Get account stats
  getAccountStats: async () => {
    return request.get('/customer/profile/stats');
  },
};

// Address API with typed POJOs
export const addressAPI = {
  // Get all addresses
  getAddresses: async (): Promise<Address[]> => {
    const response = await api.get<GetAddressesResponse>('/customer/addresses');
    return response.data.addresses;
  },

  // Get single address
  getAddress: async (id: string): Promise<Address> => {
    const response = await api.get<{ address: Address }>(`/customer/addresses/${id}`);
    return response.data.address;
  },

  // Create address
  createAddress: async (data: CreateAddressRequest): Promise<Address> => {
    const response = await api.post<CreateAddressResponse>('/customer/addresses', data);
    return response.data.address;
  },

  // Update address
  updateAddress: async (id: string, data: Partial<CreateAddressRequest>): Promise<Address> => {
    const response = await api.put<CreateAddressResponse>(`/customer/addresses/${id}`, data);
    return response.data.address;
  },

  // Delete address
  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(`/customer/addresses/${id}`);
  },

  // Set default address
  setDefaultAddress: async (id: string, type: 'shipping' | 'billing'): Promise<void> => {
    await api.post(`/customer/addresses/${id}/set-default`, { type });
  },

  // Validate address
  validateAddress: async (address: Partial<Address>): Promise<any> => {
    const response = await api.post('/customer/addresses/validate', address);
    return response.data;
  },

  // Get address suggestions
  getAddressSuggestions: async (query: string): Promise<any> => {
    const response = await api.get('/customer/addresses/suggestions', { params: { query } });
    return response.data;
  },
};

// Payment Methods API
export const paymentMethodsAPI = {
  // Get all payment methods
  getPaymentMethods: async () => {
    return request.get('/customer/payment-methods');
  },

  // Get single payment method
  getPaymentMethod: async (id: string) => {
    return request.get(`/customer/payment-methods/${id}`);
  },

  // Add payment method
  addPaymentMethod: async (data: {
    type: string;
    token: string; // from payment processor
    billingAddressId?: string;
    setAsDefault?: boolean;
  }) => {
    return request.post('/customer/payment-methods', data);
  },

  // Update payment method
  updatePaymentMethod: async (id: string, data: {
    title?: string;
    billingAddressId?: string;
    expiryMonth?: number;
    expiryYear?: number;
  }) => {
    return request.put(`/customer/payment-methods/${id}`, data);
  },

  // Delete payment method
  deletePaymentMethod: async (id: string) => {
    return request.delete(`/customer/payment-methods/${id}`);
  },

  // Set default payment method
  setDefaultPaymentMethod: async (id: string) => {
    return request.post(`/customer/payment-methods/${id}/set-default`);
  },

  // Verify payment method
  verifyPaymentMethod: async (id: string, verificationData: any) => {
    return request.post(`/customer/payment-methods/${id}/verify`, verificationData);
  },
};

// Preferences API
export const preferencesAPI = {
  // Get preferences
  getPreferences: async () => {
    return request.get('/customer/preferences');
  },

  // Update preferences
  updatePreferences: async (data: Partial<AccountPreferences>) => {
    return request.put('/customer/preferences', data);
  },

  // Update notification preferences
  updateNotificationPreferences: async (data: AccountPreferences['notifications']) => {
    return request.put('/customer/preferences/notifications', data);
  },

  // Update privacy preferences
  updatePrivacyPreferences: async (data: AccountPreferences['privacy']) => {
    return request.put('/customer/preferences/privacy', data);
  },

  // Update shopping preferences
  updateShoppingPreferences: async (data: AccountPreferences['shopping']) => {
    return request.put('/customer/preferences/shopping', data);
  },

  // Update display preferences
  updateDisplayPreferences: async (data: AccountPreferences['display']) => {
    return request.put('/customer/preferences/display', data);
  },
};

// Security API
export const securityAPI = {
  // Get security settings
  getSecuritySettings: async () => {
    return request.get('/customer/security');
  },

  // Enable/disable two-factor authentication
  updateTwoFactor: async (data: {
    enabled: boolean;
    method?: 'sms' | 'email' | 'app';
    verificationCode?: string;
  }) => {
    return request.post('/customer/security/two-factor', data);
  },

  // Update security preferences
  updateSecurityPreferences: async (data: {
    loginAlerts?: boolean;
    sessionTimeout?: number;
  }) => {
    return request.put('/customer/security/preferences', data);
  },

  // Get login history
  getLoginHistory: async (params: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  } = {}) => {
    return request.get('/customer/security/login-history', { params });
  },

  // Get trusted devices
  getTrustedDevices: async () => {
    return request.get('/customer/security/trusted-devices');
  },

  // Remove trusted device
  removeTrustedDevice: async (deviceId: string) => {
    return request.delete(`/customer/security/trusted-devices/${deviceId}`);
  },

  // Update security questions
  updateSecurityQuestions: async (questions: Omit<SecurityQuestion, 'id'>[]) => {
    return request.post('/customer/security/questions', { questions });
  },

  // Terminate all sessions
  terminateAllSessions: async () => {
    return request.post('/customer/security/terminate-sessions');
  },
};

// Wishlist API
export const wishlistAPI = {
  // Get wishlist
  getWishlist: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    sort?: 'newest' | 'oldest' | 'price_low' | 'price_high';
  } = {}) => {
    return request.get('/customer/wishlist', { params });
  },

  // Add to wishlist
  addToWishlist: async (data: {
    productId: string;
    notes?: string;
  }) => {
    return request.post('/customer/wishlist', data);
  },

  // Remove from wishlist
  removeFromWishlist: async (itemId: string) => {
    return request.delete(`/customer/wishlist/${itemId}`);
  },

  // Update wishlist item
  updateWishlistItem: async (itemId: string, data: {
    notes?: string;
  }) => {
    return request.put(`/customer/wishlist/${itemId}`, data);
  },

  // Move to cart
  moveToCart: async (itemId: string, quantity: number = 1) => {
    return request.post(`/customer/wishlist/${itemId}/move-to-cart`, { quantity });
  },

  // Share wishlist
  shareWishlist: async (data: {
    email?: string;
    shareType: 'email' | 'link';
    message?: string;
  }) => {
    return request.post('/customer/wishlist/share', data);
  },

  // Get price alerts
  getPriceAlerts: async () => {
    return request.get('/customer/wishlist/price-alerts');
  },

  // Set price alert
  setPriceAlert: async (itemId: string, targetPrice: number) => {
    return request.post(`/customer/wishlist/${itemId}/price-alert`, { targetPrice });
  },
};

// Reviews API
export const reviewsAPI = {
  // Get customer reviews
  getReviews: async (params: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'approved' | 'rejected';
    productId?: string;
  } = {}) => {
    return request.get('/customer/reviews', { params });
  },

  // Get single review
  getReview: async (reviewId: string) => {
    return request.get(`/customer/reviews/${reviewId}`);
  },

  // Create review
  createReview: async (data: {
    productId: string;
    orderId: string;
    rating: number;
    title: string;
    comment: string;
    pros?: string[];
    cons?: string[];
    isRecommended: boolean;
    images?: File[];
  }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach(file => formData.append('images', file));
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    return request.post('/customer/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update review
  updateReview: async (reviewId: string, data: Partial<ReviewData>) => {
    return request.put(`/customer/reviews/${reviewId}`, data);
  },

  // Delete review
  deleteReview: async (reviewId: string) => {
    return request.delete(`/customer/reviews/${reviewId}`);
  },

  // Vote on review helpfulness
  voteReview: async (reviewId: string, helpful: boolean) => {
    return request.post(`/customer/reviews/${reviewId}/vote`, { helpful });
  },

  // Get pending reviews (products to review)
  getPendingReviews: async () => {
    return request.get('/customer/reviews/pending');
  },
};

// Account deletion API
export const accountDeletionAPI = {
  // Request account deletion
  requestDeletion: async (data: {
    reason: string;
    password: string;
    feedback?: string;
  }) => {
    return request.post('/customer/account/delete', data);
  },

  // Cancel account deletion
  cancelDeletion: async () => {
    return request.post('/customer/account/cancel-deletion');
  },

  // Get deletion status
  getDeletionStatus: async () => {
    return request.get('/customer/account/deletion-status');
  },

  // Download account data
  downloadAccountData: async () => {
    return request.get('/customer/account/download-data', {
      responseType: 'blob',
    });
  },
};

// Export all APIs
export default {
  profileAPI,
  addressAPI,
  paymentMethodsAPI,
  preferencesAPI,
  securityAPI,
  wishlistAPI,
  reviewsAPI,
  accountDeletionAPI,
};