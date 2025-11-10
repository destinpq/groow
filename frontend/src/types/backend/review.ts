// Backend review types - synchronized with backend ProductReview entity and DTOs

import { Product } from './product';
import { Customer } from './customer';

// Product Review Entity
export interface ProductReview {
  id: string;
  productId: string;
  product: Product;
  customerId: string;
  customer: Customer;
  rating: number;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Review DTOs
export interface CreateReviewDto {
  productId: string;
  rating: number;
  comment: string;
  images?: string[];
  title?: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
  images?: string[];
  title?: string;
}

// Review Filter/Query DTOs
export interface ReviewFilterDto {
  page?: number;
  limit?: number;
  rating?: number;
  verified?: boolean;
  approved?: boolean;
  customerId?: string;
  productId?: string;
  sortBy?: 'rating' | 'createdAt' | 'helpful';
  sortOrder?: 'ASC' | 'DESC';
}

// Review Statistics
export interface ReviewStatsDto {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedReviews: number;
  reviewsWithImages: number;
}

// Admin Review Operations
export interface ReviewModerationDto {
  approved: boolean;
  reason?: string;
  moderatorId?: string;
}

// API Response Types
export interface ReviewAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Response DTOs for specific operations
export interface GetReviewsResponse {
  reviews: ProductReview[];
  stats: ReviewStatsDto;
}

export interface CreateReviewResponse {
  review: ProductReview;
}

export interface UpdateReviewResponse {
  review: ProductReview;
}

export interface DeleteReviewResponse {
  message: string;
}

export interface ReviewHelpfulResponse {
  review: ProductReview;
  isHelpful: boolean;
}

// Upload response for review images
export interface ReviewImageUploadResponse {
  urls: string[];
  uploadedCount: number;
}

// Review helpfulness tracking
export interface ReviewHelpfulness {
  reviewId: string;
  customerId: string;
  isHelpful: boolean;
  createdAt: string;
}

// Extended review with additional fields for UI
export interface ReviewWithExtras extends ProductReview {
  customerName: string;
  customerAvatar?: string;
  productName: string;
  productImage?: string;
  title?: string;
  isHelpfulToCurrentUser?: boolean;
  vendorResponse?: {
    message: string;
    respondedAt: string;
  };
}

// Re-export for convenience
export * from './pagination';