/**
 * Guest Checkout API Services
 * Handles checkout functionality for non-registered users
 */
import { api } from './client';

export interface GuestUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface GuestShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface GuestBillingAddress extends GuestShippingAddress {
  sameAsShipping?: boolean;
}

export interface GuestCheckoutData {
  guest: GuestUser;
  shippingAddress: GuestShippingAddress;
  billingAddress: GuestBillingAddress;
  paymentMethod: {
    type: 'credit_card' | 'paypal' | 'stripe' | 'bank_transfer';
    details: any;
  };
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
  }>;
  shipping?: {
    method: string;
    cost: number;
  };
  orderNotes?: string;
  marketingOptIn?: boolean;
}

export interface GuestOrderResponse {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  guest: GuestUser;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface GuestOrderTracking {
  orderNumber: string;
  email: string;
}

export const guestCheckoutAPI = {
  /**
   * Initialize guest checkout session
   */
  initializeSession: async () => {
    const { data } = await api.post('/guest/checkout/initialize');
    return data;
  },

  /**
   * Submit guest checkout order
   */
  submitOrder: async (checkoutData: GuestCheckoutData): Promise<GuestOrderResponse> => {
    const { data } = await api.post('/guest/checkout/submit', checkoutData);
    return data;
  },

  /**
   * Validate guest checkout data
   */
  validateCheckoutData: async (checkoutData: Partial<GuestCheckoutData>) => {
    const { data } = await api.post('/guest/checkout/validate', checkoutData);
    return data;
  },

  /**
   * Calculate order totals for guest
   */
  calculateTotals: async (items: GuestCheckoutData['items'], shippingMethod?: string) => {
    const { data } = await api.post('/guest/checkout/calculate', {
      items,
      shippingMethod,
    });
    return data;
  },

  /**
   * Track guest order
   */
  trackOrder: async (tracking: GuestOrderTracking) => {
    const { data } = await api.post('/guest/orders/track', tracking);
    return data;
  },

  /**
   * Get available shipping methods for guest
   */
  getShippingMethods: async (address: GuestShippingAddress) => {
    const { data } = await api.post('/guest/shipping/methods', { address });
    return data;
  },

  /**
   * Apply promo code for guest checkout
   */
  applyPromoCode: async (code: string, total: number) => {
    const { data } = await api.post('/guest/promo/apply', { code, total });
    return data;
  },

  /**
   * Send order confirmation email to guest
   */
  sendConfirmation: async (orderNumber: string, email: string) => {
    const { data } = await api.post('/guest/orders/send-confirmation', {
      orderNumber,
      email,
    });
    return data;
  },

  /**
   * Create guest account after order (optional conversion)
   */
  createAccountFromOrder: async (orderNumber: string, password: string) => {
    const { data } = await api.post('/guest/convert-to-account', {
      orderNumber,
      password,
    });
    return data;
  },
};

export default guestCheckoutAPI;