import api from './client';

// Temporary front-end types until backend type package is available
// These mirror the backend entities and DTOs and will be replaced by true imports
interface Wallet { id: string; ownerId: string; ownerType: string; balance: number; currency: string; }
interface WalletTransaction { id: string; walletId: string; amount: number; currency: string; transactionType: string; status: string; description?: string; }
interface Payment { id: string; gateway: string; amount: number; currency: string; status: string; orderId?: string; }
interface PaymentMethodInfo { id: string; provider: string; isDefault: boolean; isActive: boolean; providerData?: any; }
interface PayoutRequest { id: string; vendorId: string; amount: number; currency: string; status: string; }
interface PaginatedResponse<T> { items: T[]; total: number; page: number; limit: number; hasNext: boolean; hasPrev: boolean; }

// API response wrappers
interface APIResponse<T> { success: boolean; data: T; message?: string; timestamp?: string; }

// Comprehensive Wallet & Payment API for enterprise payments
export const walletAPI = {
  // Get wallet balance for current authenticated owner
  getBalance: async (): Promise<Wallet> => {
    const res = await api.get<APIResponse<{ wallet: Wallet }>>('/payment/wallet/balance');
    return res.data.data.wallet;
  },

  // Get wallet transactions with filters
  getTransactions: async (filters?: { page?: number; limit?: number; type?: string; status?: string; dateFrom?: string; dateTo?: string }): Promise<PaginatedResponse<WalletTransaction>> => {
    const res = await api.get<APIResponse<PaginatedResponse<WalletTransaction>>>('/payment/wallet/transactions', {
      params: filters,
    });
    return res.data.data;
  },

  // Add funds via connected gateways or offline (corporate bank transfer)
  addFunds: async (data: { amount: number; currency?: string; paymentMethodId?: string; provider?: string; description?: string; referenceId?: string }): Promise<WalletTransaction> => {
    const res = await api.post<APIResponse<{ transaction: WalletTransaction }>>('/payment/wallet/add-funds', data);
    return res.data.data.transaction;
  },

  // Deduct funds (refunds, reversals)
  deductFunds: async (data: { amount: number; currency?: string; reason?: string; referenceId?: string }): Promise<WalletTransaction> => {
    const res = await api.post<APIResponse<{ transaction: WalletTransaction }>>('/payment/wallet/deduct', data);
    return res.data.data.transaction;
  },

  // Request vendor payout (supports batch and scheduled payouts)
  requestPayout: async (data: { vendorId: string; amount: number; currency?: string; paymentMethodId?: string; scheduleAt?: string; note?: string }): Promise<PayoutRequest> => {
    const res = await api.post<APIResponse<PayoutRequest>>('/payment/wallet/payout/request', data);
    return res.data.data;
  },

  // Get payout requests (vendor or admin)
  getPayoutRequests: async (filters?: { vendorId?: string; status?: string; page?: number; limit?: number }): Promise<PaginatedResponse<PayoutRequest>> => {
    const res = await api.get<APIResponse<PaginatedResponse<PayoutRequest>>>('/payment/wallet/payout/requests', { params: filters });
    return res.data.data;
  },

  // Cancel payout request
  cancelPayoutRequest: async (id: string): Promise<PayoutRequest> => {
    const res = await api.patch<APIResponse<PayoutRequest>>(`/payment/wallet/payout/requests/${id}/cancel`);
    return res.data.data;
  },

  // Get balance history
  getBalanceHistory: async (days: number = 30): Promise<Array<{ date: string; balance: number }>> => {
    const res = await api.get<APIResponse<Array<{ date: string; balance: number }>>>('/payment/wallet/balance-history', { params: { days } });
    return res.data.data;
  },
};

// Payment operations (charges, authorizations, capture, refund, split settlements, escrow)
export const paymentAPI = {
  // Create a payment intent / charge
  createPayment: async (data: {
    amount: number;
    currency: string;
    orderId?: string;
    paymentMethodId?: string;
    customerId?: string;
    vendorId?: string;
    capture?: boolean;
    metadata?: any;
    splitAllocations?: Array<{ accountId: string; amount: number; currency?: string }>;
    useEscrow?: boolean;
  }): Promise<{ payment: Payment; gatewayData?: any }> => {
    const res = await api.post<APIResponse<{ payment: Payment; gatewayData?: any }>>('/payment/create', data);
    return res.data.data;
  },

  // Verify webhook or async confirmation
  verifyPayment: async (data: { paymentId?: string; provider?: string; payload?: any }): Promise<{ payment: Payment; verified: boolean }> => {
    const res = await api.post<APIResponse<{ payment: Payment; verified: boolean }>>('/payment/verify', data);
    return res.data.data;
  },

  // Capture an authorized payment
  capture: async (paymentId: string, amount?: number): Promise<Payment> => {
    const res = await api.post<APIResponse<Payment>>(`/payment/${paymentId}/capture`, { amount });
    return res.data.data;
  },

  // Refund a payment (full or partial)
  refund: async (paymentId: string, amount?: number, reason?: string): Promise<{ refundId: string; status: string }> => {
    const res = await api.post<APIResponse<{ refundId: string; status: string }>>(`/payment/${paymentId}/refund`, { amount, reason });
    return res.data.data;
  },

  // Get payment by id
  getPayment: async (id: string): Promise<Payment> => {
    const res = await api.get<APIResponse<Payment>>(`/payment/${id}`);
    return res.data.data;
  },

  // List payments with filters
  listPayments: async (filters?: { status?: string; fromDate?: string; toDate?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Payment>> => {
    const res = await api.get<APIResponse<PaginatedResponse<Payment>>>('/payment/history', { params: filters });
    return res.data.data;
  },

  // Initiate split settlement / payout from escrow
  releaseEscrow: async (escrowId: string, allocations?: any[]): Promise<{ success: boolean }> => {
    const res = await api.post<APIResponse<{ success: boolean }>>(`/payment/escrow/${escrowId}/release`, { allocations });
    return res.data.data;
  },
};

// Payment method management (vaulted methods, bank accounts, cards)
export const paymentMethodAPI = {
  list: async (ownerId?: string): Promise<PaymentMethodInfo[]> => {
    const res = await api.get<APIResponse<PaymentMethodInfo[]>>('/payment-methods', { params: { ownerId } });
    return res.data.data;
  },

  add: async (data: { ownerId: string; ownerType: 'customer' | 'vendor'; provider: string; providerData: any; makeDefault?: boolean }): Promise<PaymentMethodInfo> => {
    const res = await api.post<APIResponse<PaymentMethodInfo>>('/payment-methods', data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<{ providerData: any; isActive?: boolean; isDefault?: boolean }>): Promise<PaymentMethodInfo> => {
    const res = await api.patch<APIResponse<PaymentMethodInfo>>(`/payment-methods/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const res = await api.delete<APIResponse<{ success: boolean }>>(`/payment-methods/${id}`);
    return res.data.data;
  },

  verify: async (id: string): Promise<PaymentMethodInfo> => {
    const res = await api.post<APIResponse<PaymentMethodInfo>>(`/payment-methods/${id}/verify`);
    return res.data.data;
  },
};

// Billing & Invoicing (corporate billing, credit terms)
export const billingAPI = {
  createInvoice: async (data: { customerId: string; items: any[]; currency?: string; dueDate?: string; metadata?: any }): Promise<APIResponse<{ invoiceId: string }>> => {
    const res = await api.post<APIResponse<{ invoiceId: string }>>('/billing/invoices', data);
    return res.data;
  },

  getInvoice: async (invoiceId: string): Promise<APIResponse<any>> => {
    const res = await api.get<APIResponse<any>>(`/billing/invoices/${invoiceId}`);
    return res.data;
  },

  payInvoice: async (invoiceId: string, data: { paymentMethodId?: string; amount?: number; useWallet?: boolean }): Promise<APIResponse<{ paymentId?: string }>> => {
    const res = await api.post<APIResponse<{ paymentId?: string }>>(`/billing/invoices/${invoiceId}/pay`, data);
    return res.data;
  },
};

export default { walletAPI, paymentAPI, paymentMethodAPI, billingAPI };
