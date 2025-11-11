import { api } from './client';

// Payment Integration API for payment processing
export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'stripe' | 'bank_transfer';
  provider: string;
  isDefault: boolean;
  metadata: any;
}

export interface PaymentIntentData {
  amount: number;
  currency: string;
  orderId: string;
  paymentMethod: string;
  metadata?: any;
}

export const paymentIntegrationAPI = {
  // Create payment intent
  createIntent: async (data: PaymentIntentData) => {
    const response = await api.post('/payment/create-intent', data);
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId: string, paymentMethodId: string) => {
    const response = await api.post('/payment/confirm', {
      paymentIntentId,
      paymentMethodId
    });
    return response.data;
  },

  // Process payment
  processPayment: async (data: {
    orderId: string;
    paymentMethod: string;
    amount: number;
    currency: string;
  }) => {
    const response = await api.post('/payment/process', data);
    return response.data;
  },

  // Get payment methods
  getPaymentMethods: async () => {
    const response = await api.get('/payment/methods');
    return response.data;
  },

  // Add payment method
  addPaymentMethod: async (data: {
    type: string;
    provider: string;
    token: string;
    metadata: any;
  }) => {
    const response = await api.post('/payment/methods', data);
    return response.data;
  },

  // Remove payment method
  removePaymentMethod: async (methodId: string) => {
    const response = await api.delete(`/payment/methods/${methodId}`);
    return response.data;
  },

  // Set default payment method
  setDefaultMethod: async (methodId: string) => {
    const response = await api.put(`/payment/methods/${methodId}/default`);
    return response.data;
  },

  // Refund payment
  refund: async (paymentId: string, amount?: number, reason?: string) => {
    const response = await api.post(`/payment/${paymentId}/refund`, {
      amount,
      reason
    });
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentId: string) => {
    const response = await api.get(`/payment/${paymentId}/status`);
    return response.data;
  },

  // Webhook handlers
  handleWebhook: async (provider: string, data: any) => {
    const response = await api.post(`/payment/webhook/${provider}`, data);
    return response.data;
  }
};

export default paymentIntegrationAPI;