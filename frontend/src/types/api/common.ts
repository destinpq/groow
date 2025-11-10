/**
 * Common API Types and Base Interfaces
 * 
 * This file contains shared types used across all API endpoints
 */

// Base API Response Structure
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Common Filter Types
export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface BaseFilter extends PaginationParams {
  search?: string;
  status?: string;
  dateRange?: DateRangeFilter;
}

// File Upload Types
export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  entityType?: string;
  entityId?: string;
  uploadedAt: string;
  uploadedBy: string;
}

// Common Entity Fields
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserEntity extends BaseEntity {
  email: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
}

// Enums
export enum UserRole {
  ADMIN = 'admin',
  VENDOR = 'vendor',
  CUSTOMER = 'customer',
  STAFF = 'staff'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// Generic API Error
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}