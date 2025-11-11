/**
 * Auth API Types and POJOs
 * 
 * All authentication-related request/response types
 */

import { ApiResponse, BaseEntity, UserRole, UserStatus } from './common';

// =================== AUTH ENTITIES ===================

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLogin?: string;
  avatar?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface AuthResult {
  user: User;
  tokens: AuthTokens;
}

// =================== AUTH REQUEST TYPES ===================

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

// =================== AUTH RESPONSE TYPES ===================

export interface RegisterResponse extends ApiResponse<AuthResult> {}

export interface LoginResponse extends ApiResponse<AuthResult> {}

export interface ForgotPasswordResponse extends ApiResponse<{
  message: string;
  resetTokenSent: boolean;
}> {}

export interface ResetPasswordResponse extends ApiResponse<{
  passwordReset: boolean;
}> {}

export interface ChangePasswordResponse extends ApiResponse<{
  passwordChanged: boolean;
}> {}

export interface VerifyEmailResponse extends ApiResponse<{
  emailVerified: boolean;
  user: User;
}> {}

export interface RefreshTokenResponse extends ApiResponse<AuthTokens> {}

export interface ResendVerificationResponse extends ApiResponse<{
  verificationSent: boolean;
}> {}

export interface GetProfileResponse extends ApiResponse<User> {}

export interface LogoutResponse extends ApiResponse<{
  loggedOut: boolean;
}> {}

// =================== AUTH API INTERFACE ===================

export interface AuthAPI {
  // POST //auth/register
  register(request: RegisterRequest): Promise<RegisterResponse>;
  
  // POST //auth/login
  login(request: LoginRequest): Promise<LoginResponse>;
  
  // POST //auth/forgot-password
  forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse>;
  
  // POST //auth/reset-password
  resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse>;
  
  // POST //auth/verify-email
  verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse>;
  
  // POST //auth/refresh
  refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse>;
  
  // GET //auth/profile
  getProfile(): Promise<GetProfileResponse>;
  
  // POST //auth/logout
  logout(): Promise<LogoutResponse>;
  
  // POST /auth/change-password (legacy endpoint)
  changePassword(request: ChangePasswordRequest): Promise<ChangePasswordResponse>;
  
  // POST /auth/resend-verification (legacy endpoint)
  resendVerification(request: ResendVerificationRequest): Promise<ResendVerificationResponse>;
}