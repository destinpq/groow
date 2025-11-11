import { 
  ApiResponse, 
  BaseEntity, 
  PaginatedResponse 
} from './common';

// ================================
// FINANCE ENTITY TYPES  
// ================================

export enum TransactionType {
  SALE = 'sale',
  REFUND = 'refund',
  PAYOUT = 'payout',
  COMMISSION = 'commission',
  ADJUSTMENT = 'adjustment',
  SETTLEMENT = 'settlement',
  WITHDRAWAL = 'withdrawal'
}

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum PayoutStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  FAILED = 'failed'
}

export enum RefundStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  FAILED = 'failed'
}

export enum RefundMethod {
  ORIGINAL_PAYMENT = 'original_payment',
  WALLET = 'wallet',
  BANK_TRANSFER = 'bank_transfer',
  STORE_CREDIT = 'store_credit'
}

export enum SettlementStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface FinanceTransaction extends BaseEntity {
  id: string;
  transactionId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  referenceId?: string;
  referenceType?: string;
  description: string;
  metadata?: Record<string, any>;
  processedAt?: Date;
  processedBy?: string;
  failureReason?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export interface VendorPayout extends BaseEntity {
  id: string;
  payoutNumber: string;
  vendorId: string;
  amount: number;
  commission: number;
  netAmount: number;
  currency: string;
  status: PayoutStatus;
  paymentMethod?: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  processedAt?: Date;
  processedBy?: string;
  notes?: string;
  vendor?: {
    id: string;
    name: string;
    company: string;
    email: string;
  };
  orders?: {
    orderId: string;
    orderNumber: string;
    amount: number;
    commission: number;
  }[];
}

export interface RefundRequest extends BaseEntity {
  id: string;
  refundNumber: string;
  orderId: string;
  customerId: string;
  requestedAmount: number;
  approvedAmount?: number;
  refundMethod: RefundMethod;
  reason: string;
  status: RefundStatus;
  requestedAt: Date;
  approvedAt?: Date;
  processedAt?: Date;
  completedAt?: Date;
  processedBy?: string;
  notes?: string;
  gatewayRefundId?: string;
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
}

export interface Settlement extends BaseEntity {
  id: string;
  settlementNumber: string;
  settlementDate: Date;
  totalAmount: number;
  vendorCount: number;
  status: SettlementStatus;
  notes?: string;
  createdBy: string;
  processedAt?: Date;
  completedAt?: Date;
  vendors?: {
    vendorId: string;
    vendorName: string;
    amount: number;
    commission: number;
    netAmount: number;
  }[];
}

export interface VendorEarnings {
  vendorId: string;
  vendorName: string;
  period: string;
  totalSales: number;
  totalOrders: number;
  totalCommission: number;
  netEarnings: number;
  pendingAmount: number;
  paidAmount: number;
  averageOrderValue: number;
  commissionRate: number;
  topProducts?: {
    productId: string;
    productName: string;
    sales: number;
    orders: number;
  }[];
  dailyStats?: {
    date: string;
    sales: number;
    orders: number;
    commission: number;
  }[];
}

export interface FinanceDashboard {
  totalRevenue: number;
  totalCommission: number;
  netRevenue: number;
  totalRefunds: number;
  pendingPayouts: number;
  processedPayouts: number;
  transactionCount: number;
  averageTransactionValue: number;
  revenueByCategory: {
    category: string;
    revenue: number;
    commission: number;
  }[];
  dailyRevenue: {
    date: string;
    revenue: number;
    commission: number;
    refunds: number;
    payouts: number;
  }[];
  topVendors: {
    vendorId: string;
    vendorName: string;
    revenue: number;
    commission: number;
    orders: number;
  }[];
}

export interface ReconciliationData {
  date: string;
  totalSales: number;
  totalCommissions: number;
  totalRefunds: number;
  totalPayouts: number;
  netRevenue: number;
  paymentGatewayFees: number;
  transactions: {
    type: TransactionType;
    count: number;
    amount: number;
  }[];
  discrepancies?: {
    type: string;
    description: string;
    amount: number;
  }[];
}

// ================================
// REQUEST/RESPONSE TYPES
// ================================

export interface GetTransactionsResponse {
  transactions: PaginatedResponse<FinanceTransaction>;
  summary?: {
    totalAmount: number;
    completedAmount: number;
    pendingAmount: number;
    failedAmount: number;
  };
}

export interface GetTransactionStatsResponse {
  period: string;
  totalTransactions: number;
  totalAmount: number;
  averageTransactionValue: number;
  successRate: number;
  transactionsByType: {
    type: TransactionType;
    count: number;
    amount: number;
  }[];
  dailyStats: {
    date: string;
    transactions: number;
    amount: number;
  }[];
}

export interface GetPayoutsResponse {
  payouts: PaginatedResponse<VendorPayout>;
  summary?: {
    totalPending: number;
    totalProcessing: number;
    totalCompleted: number;
  };
}

export interface ProcessVendorPayoutRequest {
  amount: number;
  notes?: string;
}

export interface ProcessVendorPayoutResponse {
  payout: VendorPayout;
  message: string;
}

export interface GetPendingPayoutsResponse {
  payouts: VendorPayout[];
  totalAmount: number;
  vendorCount: number;
}

export interface GetVendorEarningsResponse {
  earnings: VendorEarnings;
}

export interface GetRefundsResponse {
  refunds: PaginatedResponse<RefundRequest>;
  summary?: {
    totalRequested: number;
    totalApproved: number;
    totalProcessing: number;
    totalCompleted: number;
  };
}

export interface ProcessRefundRequest {
  amount: number;
  reason: string;
  refundMethod: RefundMethod;
  notes?: string;
}

export interface ProcessRefundResponse {
  refund: RefundRequest;
  message: string;
}

export interface GetPendingRefundsResponse {
  refunds: RefundRequest[];
  totalAmount: number;
}

export interface GetFinanceDashboardResponse {
  dashboard: FinanceDashboard;
}

export interface GetReconciliationResponse {
  reconciliation: ReconciliationData;
}

export interface CreateSettlementRequest {
  vendorIds: string[];
  settlementDate: string;
  notes?: string;
}

export interface CreateSettlementResponse {
  settlement: Settlement;
  message: string;
}

// ================================
// FILTER TYPES
// ================================

export interface TransactionFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  type?: TransactionType | TransactionType[];
  status?: TransactionStatus | TransactionStatus[];
  startDate?: string;
  endDate?: string;
  amountFrom?: number;
  amountTo?: number;
  referenceId?: string;
  search?: string;
}

export interface PayoutFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: PayoutStatus | PayoutStatus[];
  vendorId?: string;
  amountFrom?: number;
  amountTo?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface RefundFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: RefundStatus | RefundStatus[];
  customerId?: string;
  orderId?: string;
  refundMethod?: RefundMethod;
  dateFrom?: Date;
  dateTo?: Date;
}

// ================================
// FINANCE API INTERFACE
// ================================

export interface FinanceAPI {
  // Transaction Management
  getTransactions(filter?: TransactionFilter): Promise<ApiResponse<GetTransactionsResponse>>;
  getTransactionStats(period?: string): Promise<ApiResponse<GetTransactionStatsResponse>>;
  getTransactionById(id: string): Promise<ApiResponse<{ transaction: FinanceTransaction }>>;
  
  // Vendor Payouts
  getPayouts(filter?: PayoutFilter): Promise<ApiResponse<GetPayoutsResponse>>;
  processVendorPayout(vendorId: string, request: ProcessVendorPayoutRequest): Promise<ApiResponse<ProcessVendorPayoutResponse>>;
  getPendingPayouts(): Promise<ApiResponse<GetPendingPayoutsResponse>>;
  getVendorEarnings(vendorId: string, period?: string): Promise<ApiResponse<GetVendorEarningsResponse>>;
  
  // Refund Processing
  getRefunds(filter?: RefundFilter): Promise<ApiResponse<GetRefundsResponse>>;
  processRefund(orderId: string, request: ProcessRefundRequest): Promise<ApiResponse<ProcessRefundResponse>>;
  getPendingRefunds(): Promise<ApiResponse<GetPendingRefundsResponse>>;
  approveRefund(refundId: string, amount?: number): Promise<ApiResponse<{ refund: RefundRequest }>>;
  rejectRefund(refundId: string, reason: string): Promise<ApiResponse<{ refund: RefundRequest }>>;
  
  // Dashboard & Analytics
  getFinanceDashboard(period?: string): Promise<ApiResponse<GetFinanceDashboardResponse>>;
  
  // Reconciliation
  getReconciliation(date?: string): Promise<ApiResponse<GetReconciliationResponse>>;
  
  // Settlement Management
  createSettlement(request: CreateSettlementRequest): Promise<ApiResponse<CreateSettlementResponse>>;
  getSettlements(filter?: {
    page?: number;
    limit?: number;
    status?: SettlementStatus;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<ApiResponse<{ settlements: PaginatedResponse<Settlement> }>>;
  
  // Reports
  getRevenueReport(period: string, groupBy?: 'day' | 'week' | 'month'): Promise<ApiResponse<{
    period: string;
    totalRevenue: number;
    totalCommission: number;
    data: {
      period: string;
      revenue: number;
      commission: number;
      orders: number;
    }[];
  }>>;
  
  getVendorPerformanceReport(period: string): Promise<ApiResponse<{
    vendors: {
      vendorId: string;
      vendorName: string;
      revenue: number;
      commission: number;
      orders: number;
      averageOrderValue: number;
      growth: number;
    }[];
  }>>;
  
  // Tax & Compliance
  getTaxReport(period: string): Promise<ApiResponse<{
    period: string;
    totalTaxableAmount: number;
    totalTax: number;
    taxByRate: {
      rate: number;
      taxableAmount: number;
      tax: number;
    }[];
  }>>;
}