export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  VENDOR = 'vendor',
  CUSTOMER = 'customer',
  STAFF = 'staff',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum OrderStatus {
  NEW = 'new',
  CONFIRMED = 'confirmed',
  IN_PROCESS = 'in_process',
  MANIFESTED = 'manifested',
  DELIVERED = 'delivered',
  DISPUTED = 'disputed',
  CANCELLED = 'cancelled',
  HOLD = 'hold',
  RETURN_REQUESTED = 'return_requested',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  NET_BANKING = 'net_banking',
  UPI = 'upi',
  WALLET = 'wallet',
  COD = 'cod',
}

export enum ProductStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum RfqStatus {
  OPEN = 'open',
  IN_REVIEW = 'in_review',
  QUOTED = 'quoted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CLOSED = 'closed',
}

export enum VendorVerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum NotificationType {
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
  IN_APP = 'in_app',
}

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}
