// Backend customer types - synchronized with backend entities
import type { UserRole, UserStatus } from './enums';
import type { User } from './auth';

// Customer entity structure (from backend/src/modules/auth/entities/customer.entity.ts)
export interface Customer {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User; // Populated when needed
  companyName?: string;
  shippingAddresses?: Array<{
    id: string;
    label: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    phone: string;
    isDefault: boolean;
  }>;
  walletBalance: number;
  cashbackBalance: number;
  preferences?: {
    newsletter: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
  };
  gstNumber?: string;
  isSubscribed: boolean;
  subscriptionExpiresAt?: string;
}

// Auth DTOs (from backend/src/modules/auth/dto/auth.dto.ts)
export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// Customer-specific DTOs (inferred from typical backend patterns)
export interface UpdateCustomerDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName?: string;
  gstNumber?: string;
  preferences?: {
    newsletter: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
  };
}

export interface CreateAddressDto {
  label: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto {
  label?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  phone?: string;
  isDefault?: boolean;
}

export interface CustomerFilterDto {
  search?: string;
  status?: UserStatus;
  role?: UserRole;
  emailVerified?: boolean;
  page?: number;
  limit?: number;
}

// Re-export User for convenience
export type { User } from './auth';