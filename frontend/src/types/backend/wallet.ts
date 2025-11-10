// Backend wallet and payment types - synchronized with backend entities and DTOs

import { Customer } from './customer';
import { Vendor, User } from './auth';
import { Order } from './order';

// Wallet Transaction Entity
export interface WalletTransaction {
  id: string;
  transactionId: string;
  vendorId?: string;
  vendor?: Vendor;
  customerId?: string;
  customer?: Customer;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  referenceId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Payment Entity
export interface Payment {
  id: string;
  transactionId: string;
  orderId?: string;
  order?: Order;
  userId: string;
  user: User;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  gatewayTransactionId?: string;
  gatewayResponse?: string;
  metadata?: Record<string, any>;
  paidAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Enums
export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum PaymentMethod {
  COD = 'cod',
  ONLINE = 'online',
  WALLET = 'wallet',
  CARD = 'card',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  NET_BANKING = 'net_banking',
  UPI = 'upi',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// Wallet representation (not an entity but a computed value)
export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

// DTOs
export interface CreatePaymentDto {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  returnUrl?: string;
}

export interface VerifyPaymentDto {
  gatewayTransactionId: string;
  signature: string;
}

export interface CreateWalletTransactionDto {
  amount: number;
  description: string;
  referenceId?: string;
}

export interface PaymentFilterDto {
  userId?: string;
  orderId?: string;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface WalletTransactionFilterDto {
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  referenceId?: string;
  page?: number;
  limit?: number;
}

// API Response Types
export interface WalletAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Response DTOs for specific operations
export interface GetWalletBalanceResponse {
  wallet: Wallet;
}

export interface GetWalletTransactionsResponse {
  transactions: WalletTransaction[];
  balance: Wallet;
}

export interface CreatePaymentResponse {
  payment: Payment;
  gatewayData?: {
    orderId: string;
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    prefill?: {
      email?: string;
      contact?: string;
    };
  };
}

export interface VerifyPaymentResponse {
  payment: Payment;
  isVerified: boolean;
}

export interface AddWalletFundsResponse {
  transaction: WalletTransaction;
  newBalance: number;
}

export interface PayoutRequest {
  id: string;
  vendorId: string;
  amount: number;
  method: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
  };
  upiId?: string;
  requestedAt: string;
  processedAt?: string;
  transactionReference?: string;
}

export interface CreatePayoutRequestDto {
  amount: number;
  method: 'bank_transfer' | 'upi';
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
  };
  upiId?: string;
}

// Payment Method Management
export interface PaymentMethodInfo {
  id: string;
  type: 'card' | 'bank' | 'upi' | 'wallet';
  name: string;
  details: {
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    bankName?: string;
    upiId?: string;
  };
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface CreatePaymentMethodDto {
  type: 'card' | 'bank' | 'upi';
  details: {
    cardNumber?: string;
    expiryMonth?: number;
    expiryYear?: number;
    cvv?: string;
    nameOnCard?: string;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    upiId?: string;
  };
}

// Re-export for convenience
export * from './pagination';