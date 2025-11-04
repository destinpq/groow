import api from './client';
import { PaginatedResponse } from './products';

// Types
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  totalEarned: number;
  totalSpent: number;
  pendingBalance: number;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal' | 'wallet';
  name: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: string;
}

export interface CreatePaymentMethodData {
  type: 'card' | 'bank' | 'paypal';
  cardNumber?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cvv?: string;
  nameOnCard?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  paypalEmail?: string;
}

export interface PayoutRequest {
  id: string;
  vendorId: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  requestedAt: string;
  processedAt?: string;
}

// Wallet API Service
export const walletAPI = {
  // Get wallet balance
  getBalance: async (): Promise<Wallet> => {
    const response = await api.get<Wallet>('/wallet');
    return response.data;
  },

  // Get transactions
  getTransactions: async (filters?: {
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<WalletTransaction>> => {
    const response = await api.get<PaginatedResponse<WalletTransaction>>('/wallet/transactions', {
      params: filters,
    });
    return response.data;
  },

  // Add funds
  addFunds: async (amount: number, paymentMethodId: string): Promise<WalletTransaction> => {
    const response = await api.post<WalletTransaction>('/wallet/add-funds', {
      amount,
      paymentMethodId,
    });
    return response.data;
  },

  // Request payout (vendor)
  requestPayout: async (amount: number, method: string): Promise<PayoutRequest> => {
    const response = await api.post<PayoutRequest>('/wallet/payout/request', {
      amount,
      method,
    });
    return response.data;
  },

  // Get payout requests
  getPayoutRequests: async (): Promise<PayoutRequest[]> => {
    const response = await api.get<PayoutRequest[]>('/wallet/payout/requests');
    return response.data;
  },
};

// Payment Methods API Service
export const paymentAPI = {
  // Get payment methods
  getAll: async (): Promise<PaymentMethod[]> => {
    const response = await api.get<PaymentMethod[]>('/payment-methods');
    return response.data;
  },

  // Add payment method
  add: async (data: CreatePaymentMethodData): Promise<PaymentMethod> => {
    const response = await api.post<PaymentMethod>('/payment-methods', data);
    return response.data;
  },

  // Update payment method
  update: async (id: string, data: Partial<CreatePaymentMethodData>): Promise<PaymentMethod> => {
    const response = await api.put<PaymentMethod>(`/payment-methods/${id}`, data);
    return response.data;
  },

  // Delete payment method
  delete: async (id: string): Promise<void> => {
    await api.delete(`/payment-methods/${id}`);
  },

  // Set default payment method
  setDefault: async (id: string): Promise<void> => {
    await api.patch(`/payment-methods/${id}/set-default`);
  },

  // Process payment
  processPayment: async (data: {
    orderId: string;
    paymentMethodId: string;
    amount: number;
  }): Promise<{ success: boolean; transactionId: string }> => {
    const response = await api.post('/payments/process', data);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (transactionId: string): Promise<{
    status: string;
    verified: boolean;
  }> => {
    const response = await api.get(`/payments/verify/${transactionId}`);
    return response.data;
  },
};

export default { walletAPI, paymentAPI };
