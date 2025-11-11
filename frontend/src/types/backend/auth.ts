// Backend auth types - synchronized with backend entities
import type { UserRole, UserStatus, VendorVerificationStatus } from './enums';

// User entity structure (from backend/src/modules/auth/entities/user.entity.ts)
export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  profileImage?: string;
  lastLoginAt?: string;
  emailVerified: boolean;
}

// Vendor entity structure (from backend/src/modules/auth/entities/vendor.entity.ts)
export interface Vendor {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User; // Populated when needed
  businessName: string;
  businessRegistrationNumber?: string;
  gstNumber?: string;
  panNumber?: string;
  businessAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  verificationStatus: VendorVerificationStatus;
  kycDocuments?: Array<{
    type: string;
    url: string;
    status: string;
  }>;
  isStoreActive: boolean;
  subscriptionPlanId?: string;
  subscriptionExpiresAt?: string;
  walletBalance: number;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
  };
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

export interface VerifyEmailDto {
  token: string;
}

// Auth response types
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

// Vendor-specific DTOs (inferred from typical patterns)
export interface CreateVendorDto {
  businessName: string;
  businessRegistrationNumber?: string;
  gstNumber?: string;
  panNumber?: string;
  businessAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

export interface UpdateVendorDto {
  businessName?: string;
  businessRegistrationNumber?: string;
  gstNumber?: string;
  panNumber?: string;
  businessAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
  };
}