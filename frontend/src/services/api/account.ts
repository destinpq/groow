import api from './client';
import { PaginatedResponse } from '../../types/api/common';

// Define the types locally since imports are missing
export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  id: string;
  type: 'billing' | 'shipping' | 'both';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface CustomerWishlist {
  id: string;
  customerId: string;
  productId: string;
  addedAt: string;
}

export interface CustomerReview {
  id: string;
  customerId: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  points: number;
  tier: string;
}

export interface LoyaltyTransaction {
  id: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  createdAt: string;
}

export interface AccountPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showActivity: boolean;
    allowRecommendations: boolean;
  };
  shopping: {
    defaultCurrency: string;
    preferredLanguage: string;
    autoSaveItems: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    density: 'compact' | 'normal' | 'comfortable';
  };
}

// Response type definitions
export interface GetCustomerResponse {
  customer: Customer;
}

export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface UpdateCustomerResponse {
  customer: Customer;
}

export interface CreateAddressRequest {
  type: 'billing' | 'shipping' | 'both';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface CreateAddressResponse {
  address: Address;
}

export interface GetAddressesResponse {
  addresses: Address[];
}

// Export type aliases for compatibility
export type CustomerProfile = Customer;
export type Address = CustomerAddress;
export type WishlistItem = CustomerWishlist;

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

// Note: WishlistItem is defined as type alias above (line 24)
export interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
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
  updateProfile: async (requestData: UpdateCustomerRequest): Promise<CustomerProfile> => {
    const response = await api.put<UpdateCustomerResponse>('/customer/profile', requestData);
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
    const { data } = await api.post('/customer/profile/verify-phone', { code });
    return data;
  },

  // Send phone verification
  sendPhoneVerification: async (phone: string) => {
    const { data } = await api.post('/customer/profile/send-phone-verification', { phone });
    return data;
  },

  // Change password
  changePassword: async (requestData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const { data: response } = await api.post('/customer/profile/change-password', requestData);
    return response;
  },

  // Get account stats
  getAccountStats: async () => {
    const { data } = await api.get('/customer/profile/stats');
    return data;
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
  createAddress: async (requestData: CreateAddressRequest): Promise<Address> => {
    const response = await api.post<CreateAddressResponse>('/customer/addresses', requestData);
    return response.data.address;
  },

  // Update address
  updateAddress: async (id: string, requestData: Partial<CreateAddressRequest>): Promise<Address> => {
    const response = await api.put<CreateAddressResponse>(`/customer/addresses/${id}`, requestData);
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
    const { data } = await api.get('/customer/payment-methods');
    return data;
  },

  // Get single payment method
  getPaymentMethod: async (id: string) => {
    const { data } = await api.get(`/customer/payment-methods/${id}`);
    return data;
  },

  // Add payment method
  addPaymentMethod: async (requestData: {
    type: string;
    token: string; // from payment processor
    billingAddressId?: string;
    setAsDefault?: boolean;
  }) => {
    const { data: response } = await api.post('/customer/payment-methods', requestData);
    return response;
  },

  // Update payment method
  updatePaymentMethod: async (id: string, requestData: {
    title?: string;
    billingAddressId?: string;
    expiryMonth?: number;
    expiryYear?: number;
  }) => {
    const { data: response } = await api.put(`/customer/payment-methods/${id}`, requestData);
    return response;
  },

  // Delete payment method
  deletePaymentMethod: async (id: string) => {
    const { data } = await api.delete(`/customer/payment-methods/${id}`);
    return data;
  },

  // Set default payment method
  setDefaultPaymentMethod: async (id: string) => {
    const { data } = await api.post(`/customer/payment-methods/${id}/set-default`);
    return data;
  },

  // Verify payment method
  verifyPaymentMethod: async (id: string, verificationData: any) => {
    const { data } = await api.post(`/customer/payment-methods/${id}/verify`, verificationData);
    return data;
  },
};

// Preferences API
export const preferencesAPI = {
  // Get preferences
  getPreferences: async () => {
    const { data } = await api.get('/customer/preferences');
    return data;
  },

  // Update preferences
  updatePreferences: async (requestData: Partial<AccountPreferences>) => {
    const { data: response } = await api.put('/customer/preferences', requestData);
    return response;
  },

  // Update notification preferences
  updateNotificationPreferences: async (requestData: AccountPreferences['notifications']) => {
    const { data: response } = await api.put('/customer/preferences/notifications', requestData);
    return response;
  },

  // Update privacy preferences
  updatePrivacyPreferences: async (requestData: AccountPreferences['privacy']) => {
    const { data: response } = await api.put('/customer/preferences/privacy', requestData);
    return response;
  },

  // Update shopping preferences
  updateShoppingPreferences: async (requestData: AccountPreferences['shopping']) => {
    const { data: response } = await api.put('/customer/preferences/shopping', requestData);
    return response;
  },

  // Update display preferences
  updateDisplayPreferences: async (requestData: AccountPreferences['display']) => {
    const { data: response } = await api.put('/customer/preferences/display', requestData);
    return response;
  },
};

// Security API
export const securityAPI = {
  // Get security settings
  getSecuritySettings: async () => {
    const { data } = await api.get('/customer/security');
    return data;
  },

  // Enable/disable two-factor authentication
  updateTwoFactor: async (requestData: {
    enabled: boolean;
    method?: 'sms' | 'email' | 'app';
    verificationCode?: string;
  }) => {
    const { data: response } = await api.post('/customer/security/two-factor', requestData);
    return response;
  },

  // Update security preferences
  updateSecurityPreferences: async (requestData: {
    loginAlerts?: boolean;
    sessionTimeout?: number;
  }) => {
    const { data: response } = await api.put('/customer/security/preferences', requestData);
    return response;
  },

  // Get login history
  getLoginHistory: async (params: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  } = {}) => {
    const { data } = await api.get('/customer/security/login-history', { params });
    return data;
  },

  // Get trusted devices
  getTrustedDevices: async () => {
    const { data } = await api.get('/customer/security/trusted-devices');
    return data;
  },

  // Remove trusted device
  removeTrustedDevice: async (deviceId: string) => {
    const { data } = await api.delete(`/customer/security/trusted-devices/${deviceId}`);
    return data;
  },

  // Update security questions
  updateSecurityQuestions: async (questions: any[]) => {
    const { data } = await api.post('/customer/security/questions', { questions });
    return data;
  },

  // Terminate all sessions
  terminateAllSessions: async () => {
    const { data } = await api.post('/customer/security/terminate-sessions');
    return data;
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
    const { data } = await api.get('/customer/wishlist', { params });
  },

  // Add to wishlist
  addToWishlist: async (requestData: {
    productId: string;
    variantId?: string;
    note?: string;
  }) => {
    const { data } = await api.post('/customer/wishlist', requestData);
    return data;
  },

  // Remove from wishlist
  removeFromWishlist: async (itemId: string) => {
    const { data } = await api.delete(`/customer/wishlist/${itemId}`);
  },

  // Update wishlist item
  updateWishlistItem: async (itemId: string, requestData: {
    notes?: string;
  }) => {
    const { data } = await api.put(`/customer/wishlist/${itemId}`, requestData);
  },

  // Move to cart
  moveToCart: async (itemId: string, quantity: number = 1) => {
    const { data } = await api.post(`/customer/wishlist/${itemId}/move-to-cart`, { quantity });
  },

  // Share wishlist
  shareWishlist: async (requestData: {
    email?: string;
    shareType: 'email' | 'link';
    message?: string;
  }) => {
    const { data } = await api.post('/customer/wishlist/share', requestData);
  },

  // Get price alerts
  getPriceAlerts: async () => {
    const { data } = await api.get('/customer/wishlist/price-alerts');
  },

  // Set price alert
  setPriceAlert: async (itemId: string, targetPrice: number) => {
    const { data } = await api.post(`/customer/wishlist/${itemId}/price-alert`, { targetPrice });
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
    const { data } = await api.get('/customer/reviews', { params });
  },

  // Get single review
  getReview: async (reviewId: string) => {
    const { data } = await api.get(`/customer/reviews/${reviewId}`);
  },

  // Create review
  createReview: async (requestData: {
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
    Object.entries(requestData).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach(file => formData.append('images', file));
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    const { data } = await api.post('/customer/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update review
  updateReview: async (reviewId: string, requestData: Partial<ReviewData>) => {
    const { data } = await api.put(`/customer/reviews/${reviewId}`, requestData);
  },

  // Delete review
  deleteReview: async (reviewId: string) => {
    const { data } = await api.delete(`/customer/reviews/${reviewId}`);
  },

  // Vote on review helpfulness
  voteReview: async (reviewId: string, helpful: boolean) => {
    const { data } = await api.post(`/customer/reviews/${reviewId}/vote`, { helpful });
  },

  // Get pending reviews (products to review)
  getPendingReviews: async () => {
    const { data } = await api.get('/customer/reviews/pending');
  },
};

// Account deletion API
export const accountDeletionAPI = {
  // Request account deletion
  requestDeletion: async (requestData: {
    reason: string;
    password: string;
    feedback?: string;
  }) => {
    const { data } = await api.post('/customer/account/delete', requestData);
  },

  // Cancel account deletion
  cancelDeletion: async () => {
    const { data } = await api.post('/customer/account/cancel-deletion');
  },

  // Get deletion status
  getDeletionStatus: async () => {
    const { data } = await api.get('/customer/account/deletion-status');
  },

  // Download account data
  downloadAccountData: async () => {
    const { data } = await api.get('/customer/account/download-data', {
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