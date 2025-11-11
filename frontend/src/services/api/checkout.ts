import { api } from './client';

// Checkout API for complete checkout flow
export interface CheckoutData {
  cartItems: any[];
  shippingAddress: any;
  billingAddress: any;
  paymentMethod: string;
  couponCode?: string;
  notes?: string;
}

export interface CheckoutResponse {
  orderId: string;
  paymentIntentId?: string;
  redirectUrl?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export const checkoutAPI = {
  // Initialize checkout session
  initiate: async (data: CheckoutData) => {
    const response = await api.post('/checkout/initiate', data);
    return response.data;
  },

  // Calculate totals and taxes
  calculateTotals: async (data: Partial<CheckoutData>) => {
    const response = await api.post('/checkout/calculate', data);
    return response.data;
  },

  // Apply coupon
  applyCoupon: async (couponCode: string, cartData: any) => {
    const response = await api.post('/checkout/coupon', { couponCode, cartData });
    return response.data;
  },

  // Validate checkout data
  validate: async (data: CheckoutData) => {
    const response = await api.post('/checkout/validate', data);
    return response.data;
  },

  // Complete checkout
  complete: async (checkoutSessionId: string, paymentData: any) => {
    const response = await api.post('/checkout/complete', { checkoutSessionId, paymentData });
    return response.data;
  },

  // Get checkout session
  getSession: async (sessionId: string) => {
    const response = await api.get(`/checkout/session/${sessionId}`);
    return response.data;
  },

  // Get shipping options
  getShippingOptions: async (address: any, cartItems: any[]) => {
    const response = await api.post('/checkout/shipping-options', { address, cartItems });
    return response.data;
  },

  // Guest checkout
  guestCheckout: async (data: CheckoutData & { guestInfo: any }) => {
    const response = await api.post('/checkout/guest', data);
    return response.data;
  }
};

export default checkoutAPI;