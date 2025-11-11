// API Base URL
export const API_CONFIG = {
  BASE_URL: (process.env.REACT_APP_API_URL || 'https://groow-api.destinpq.com') + '/api/v1',
  API_VERSION: '/api/v1',
  TIMEOUT: 30000,
};

export const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://groow-api.destinpq.com') + '/api/v1';

// Upload Settings
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  acceptedDocTypes: ['application/pdf', 'application/msword'],
  maxImages: 10,
};

// Pagination
export const PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100'];

// Order Status
export const ORDER_STATUS = {
  NEW: 'new',
  CONFIRMED: 'confirmed',
  IN_PROCESS: 'in_process',
  MANIFESTED: 'manifested',
  DELIVERED: 'delivered',
  DISPUTED: 'disputed',
  CANCELLED: 'cancelled',
  HOLD: 'hold',
  RETURN: 'return',
  REFUND: 'refund',
} as const;

// Order Status Colors
export const ORDER_STATUS_COLORS = {
  new: 'blue',
  confirmed: 'cyan',
  in_process: 'processing',
  manifested: 'purple',
  delivered: 'success',
  disputed: 'warning',
  cancelled: 'error',
  hold: 'default',
  return: 'orange',
  refund: 'magenta',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  VENDOR: 'vendor',
  CUSTOMER: 'customer',
  STAFF: 'staff',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  WALLET: 'wallet',
  UPI: 'upi',
  NET_BANKING: 'net_banking',
  COD: 'cod',
} as const;

// RFQ Status
export const RFQ_STATUS = {
  PENDING: 'pending',
  QUOTED: 'quoted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// Vendor Status
export const VENDOR_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
} as const;
