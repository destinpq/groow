import { 
  ApiResponse, 
  BaseEntity, 
  PaginatedResponse 
} from './common';

// ================================
// PAYMENT ENTITY TYPES  
// ================================

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  NET_BANKING = 'net_banking',
  UPI = 'upi',
  WALLET = 'wallet',
  COD = 'cod',
  BANK_TRANSFER = 'bank_transfer',
  EMI = 'emi'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
}

export enum PaymentGateway {
  RAZORPAY = 'razorpay',
  STRIPE = 'stripe',
  PAYTM = 'paytm',
  PAYPAL = 'paypal',
  PHONEPE = 'phonepe'
}

export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  CREDIT = 'credit',
  DEBIT = 'debit',
  COMMISSION = 'commission',
  WITHDRAWAL = 'withdrawal'
}

export interface Payment extends BaseEntity {
  id: string;
  paymentNumber: string;
  orderId: string;
  customerId: string;
  vendorId?: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentGateway?: PaymentGateway;
  gatewayTransactionId?: string;
  status: PaymentStatus;
  paidAt?: Date;
  failureReason?: string;
  gatewayResponse?: Record<string, any>;
  refundAmount?: number;
  refundedAt?: Date;
  refundTransactionId?: string;
  commissionAmount?: number;
  netAmount?: number;
  order?: {
    id: string;
    orderNumber: string;
    totalAmount: number;
  };
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  vendor?: {
    id: string;
    name: string;
    company: string;
  };
}

export interface Wallet extends BaseEntity {
  id: string;
  vendorId?: string;
  customerId?: string;
  balance: number;
  lockedAmount: number;
  availableBalance: number;
  currency: string;
  lastTransactionAt?: Date;
  owner?: {
    id: string;
    name: string;
    email: string;
    type: 'vendor' | 'customer';
  };
}

export interface WalletTransaction extends BaseEntity {
  id: string;
  walletId: string;
  transactionId: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  referenceId?: string;
  referenceType?: string;
  metadata?: Record<string, any>;
}

export interface PaymentGatewayConfig {
  gateway: PaymentGateway;
  isActive: boolean;
  config: {
    keyId?: string;
    keySecret?: string;
    webhookSecret?: string;
    merchantId?: string;
    environment?: 'test' | 'production';
  };
  supportedMethods: PaymentMethod[];
  supportedCurrencies: string[];
  processingFee?: {
    percentage?: number;
    fixed?: number;
  };
}

// ================================
// REQUEST/RESPONSE TYPES
// ================================

export interface InitiatePaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  returnUrl?: string;
  currency?: string;
}

export interface InitiatePaymentResponse {
  payment: Payment;
  gatewayData?: {
    paymentId?: string;
    clientSecret?: string;
    redirectUrl?: string;
    qrCode?: string;
    upiLink?: string;
  };
  message: string;
}

export interface VerifyPaymentRequest {
  gatewayTransactionId: string;
  signature: string;
  additionalData?: Record<string, any>;
}

export interface VerifyPaymentResponse {
  payment: Payment;
  order?: {
    id: string;
    orderNumber: string;
    status: string;
  };
  message: string;
}

export interface ProcessRefundRequest {
  paymentId: string;
  amount?: number; // partial refund
  reason: string;
}

export interface ProcessRefundResponse {
  refund: {
    id: string;
    paymentId: string;
    amount: number;
    status: PaymentStatus;
    gatewayRefundId?: string;
  };
  payment: Payment;
  message: string;
}

export interface GetPaymentHistoryResponse {
  payments: PaginatedResponse<Payment>;
  summary?: {
    totalAmount: number;
    successfulPayments: number;
    failedPayments: number;
    refundedAmount: number;
  };
}

export interface GetWalletBalanceResponse {
  wallet: Wallet;
  recentTransactions?: WalletTransaction[];
}

export interface GetWalletTransactionsResponse {
  transactions: PaginatedResponse<WalletTransaction>;
  wallet?: {
    id: string;
    balance: number;
    availableBalance: number;
  };
}

export interface AddWalletCreditRequest {
  userId: string;
  role: 'vendor' | 'customer';
  amount: number;
  description: string;
  referenceId?: string;
}

export interface AddWalletCreditResponse {
  transaction: WalletTransaction;
  wallet: Wallet;
  message: string;
}

export interface WithdrawFromWalletRequest {
  amount: number;
  bankAccountId?: string;
  upiId?: string;
  withdrawalMethod: 'bank' | 'upi';
}

export interface WithdrawFromWalletResponse {
  withdrawal: {
    id: string;
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    expectedCompletionDate?: Date;
  };
  wallet: Wallet;
  message: string;
}

export interface PaymentAnalytics {
  totalPayments: number;
  totalAmount: number;
  successRate: number;
  averageTransactionValue: number;
  topPaymentMethods: {
    method: PaymentMethod;
    count: number;
    amount: number;
  }[];
  paymentsByGateway: {
    gateway: PaymentGateway;
    count: number;
    amount: number;
    successRate: number;
  }[];
  dailyStats: {
    date: string;
    payments: number;
    amount: number;
    successRate: number;
  }[];
  refundStats: {
    totalRefunds: number;
    refundAmount: number;
    refundRate: number;
  };
}

// ================================
// FILTER TYPES
// ================================

export interface PaymentFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  userId?: string;
  customerId?: string;
  vendorId?: string;
  orderId?: string;
  status?: PaymentStatus | PaymentStatus[];
  paymentMethod?: PaymentMethod | PaymentMethod[];
  gateway?: PaymentGateway | PaymentGateway[];
  amountFrom?: number;
  amountTo?: number;
  dateFrom?: Date;
  dateTo?: Date;
  currency?: string;
}

export interface WalletTransactionFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  type?: TransactionType | TransactionType[];
  amountFrom?: number;
  amountTo?: number;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

// ================================
// PAYMENT API INTERFACE
// ================================

export interface PaymentAPI {
  // Payment Processing
  initiatePayment(request: InitiatePaymentRequest): Promise<ApiResponse<InitiatePaymentResponse>>;
  verifyPayment(paymentId: string, request: VerifyPaymentRequest): Promise<ApiResponse<VerifyPaymentResponse>>;
  getPaymentById(paymentId: string): Promise<ApiResponse<{ payment: Payment }>>;
  
  // Payment History
  getPaymentHistory(filter?: PaymentFilter): Promise<ApiResponse<GetPaymentHistoryResponse>>;
  getMyPayments(filter?: Partial<PaymentFilter>): Promise<ApiResponse<GetPaymentHistoryResponse>>;
  
  // Refunds
  processRefund(request: ProcessRefundRequest): Promise<ApiResponse<ProcessRefundResponse>>;
  getRefunds(filter?: PaymentFilter): Promise<ApiResponse<{ refunds: PaginatedResponse<Payment> }>>;
  
  // Wallet Operations
  getWalletBalance(): Promise<ApiResponse<GetWalletBalanceResponse>>;
  getWalletTransactions(filter?: WalletTransactionFilter): Promise<ApiResponse<GetWalletTransactionsResponse>>;
  addWalletCredit(request: AddWalletCreditRequest): Promise<ApiResponse<AddWalletCreditResponse>>;
  withdrawFromWallet(request: WithdrawFromWalletRequest): Promise<ApiResponse<WithdrawFromWalletResponse>>;
  
  // Payment Methods
  getPaymentMethods(): Promise<ApiResponse<{
    methods: {
      method: PaymentMethod;
      isActive: boolean;
      displayName: string;
      icon?: string;
      description?: string;
    }[];
  }>>;
  
  // Gateway Management (Admin)
  getPaymentGateways(): Promise<ApiResponse<{ gateways: PaymentGatewayConfig[] }>>;
  updateGatewayConfig(gateway: PaymentGateway, config: Partial<PaymentGatewayConfig>): Promise<ApiResponse<{ gateway: PaymentGatewayConfig }>>;
  
  // Analytics & Reports
  getPaymentAnalytics(period?: string): Promise<ApiResponse<PaymentAnalytics>>;
  getSettlementReport(dateFrom: Date, dateTo: Date): Promise<ApiResponse<{
    settlements: {
      vendorId: string;
      vendorName: string;
      totalSales: number;
      commission: number;
      settlement: number;
      paymentCount: number;
    }[];
    summary: {
      totalSales: number;
      totalCommission: number;
      totalSettlement: number;
    };
  }>>;
  
  // Webhooks & Callbacks
  handleWebhook(gateway: PaymentGateway, payload: Record<string, any>, signature: string): Promise<ApiResponse<{ processed: boolean }>>;
}