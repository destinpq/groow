import api from './client';
import type {
  ProductReview,
  CreateReviewDto,
  UpdateReviewDto,
  ReviewFilterDto,
  ReviewStatsDto,
  ReviewModerationDto,
  GetReviewsResponse,
  CreateReviewResponse,
  UpdateReviewResponse,
  DeleteReviewResponse,
  ReviewHelpfulResponse,
  ReviewImageUploadResponse,
  ReviewWithExtras,
  ReviewAPIResponse
} from '@/types/backend/review';
import type { PaginatedResponse } from '@/types/backend/pagination';

// Reviews API Service with backend POJO integration
export const reviewsAPI = {
  // Create review with backend DTO
  create: async (data: CreateReviewDto): Promise<ProductReview> => {
    const response = await api.post<ReviewAPIResponse<CreateReviewResponse>>('/reviews', data);
    return (response?.data?.data || response?.data)?.review;
  },

  // Get product reviews with typed response
  getProductReviews: async (
    productId: string,
    filters?: ReviewFilterDto
  ): Promise<PaginatedResponse<ProductReview>> => {
    const response = await api.get<ReviewAPIResponse<PaginatedResponse<ProductReview>>>(`/products/${productId}/reviews`, {
      params: filters,
    });
    return response?.data?.data || response?.data;
  },

  // Get customer reviews with typed response
  getCustomerReviews: async (filters?: ReviewFilterDto): Promise<PaginatedResponse<ProductReview>> => {
    const response = await api.get<ReviewAPIResponse<PaginatedResponse<ProductReview>>>('/reviews/customer', {
      params: filters,
    });
    return response?.data?.data || response?.data;
  },

  // Update review with backend DTO
  update: async (id: string, data: UpdateReviewDto): Promise<ProductReview> => {
    const response = await api.put<ReviewAPIResponse<UpdateReviewResponse>>(`/reviews/${id}`, data);
    return (response?.data?.data || response?.data)?.review;
  },

  // Delete review
  delete: async (id: string): Promise<void> => {
    await api.delete<ReviewAPIResponse<DeleteReviewResponse>>(`/reviews/${id}`);
  },

  // Mark review as helpful
  markHelpful: async (id: string): Promise<{ review: ProductReview; isHelpful: boolean }> => {
    const response = await api.post<ReviewAPIResponse<ReviewHelpfulResponse>>(`/reviews/${id}/helpful`);
    return {
      review: response.data.data.review,
      isHelpful: response.data.data.isHelpful,
    };
  },

  // Mark review as not helpful
  markNotHelpful: async (id: string): Promise<{ review: ProductReview; isHelpful: boolean }> => {
    const response = await api.post<ReviewAPIResponse<ReviewHelpfulResponse>>(`/reviews/${id}/not-helpful`);
    return {
      review: response.data.data.review,
      isHelpful: response.data.data.isHelpful,
    };
  },

  // Upload review images
  uploadImages: async (files: File[]): Promise<ReviewImageUploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    
    const response = await api.post<ReviewAPIResponse<ReviewImageUploadResponse>>('/reviews/upload-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response?.data?.data || response?.data;
  },

  // Get product review statistics
  getProductStats: async (productId: string): Promise<ReviewStatsDto> => {
    const response = await api.get<ReviewAPIResponse<ReviewStatsDto>>(`/products/${productId}/reviews/stats`);
    return response?.data?.data || response?.data;
  },

  // Get review by ID
  getById: async (id: string): Promise<ProductReview> => {
    const response = await api.get<ReviewAPIResponse<CreateReviewResponse>>(`/reviews/${id}`);
    return (response?.data?.data || response?.data)?.review;
  },

  // Get reviews with enhanced data (includes customer and product info)
  getEnhancedReviews: async (filters?: ReviewFilterDto): Promise<PaginatedResponse<ReviewWithExtras>> => {
    const response = await api.get<ReviewAPIResponse<PaginatedResponse<ReviewWithExtras>>>('/reviews/enhanced', {
      params: filters,
    });
    return response?.data?.data || response?.data;
  },

  // Check if customer can review product
  canReview: async (productId: string): Promise<boolean> => {
    const response = await api.get<ReviewAPIResponse<{ canReview: boolean }>>(`/products/${productId}/can-review`);
    return (response?.data?.data || response?.data)?.canReview;
  },

  // Admin operations
  admin: {
    // Approve review (admin)
    approve: async (id: string): Promise<ProductReview> => {
      const response = await api.post<ReviewAPIResponse<CreateReviewResponse>>(`/admin/reviews/${id}/approve`);
      return (response?.data?.data || response?.data)?.review;
    },

    // Reject review (admin)
    reject: async (id: string, reason?: string): Promise<ProductReview> => {
      const response = await api.post<ReviewAPIResponse<CreateReviewResponse>>(`/admin/reviews/${id}/reject`, { reason });
      return (response?.data?.data || response?.data)?.review;
    },

    // Get all reviews (admin)
    getAll: async (filters?: ReviewFilterDto): Promise<PaginatedResponse<ProductReview>> => {
      const response = await api.get<ReviewAPIResponse<PaginatedResponse<ProductReview>>>('/admin/reviews', {
        params: filters,
      });
      return response?.data?.data || response?.data;
    },

    // Moderate review (admin)
    moderate: async (id: string, data: ReviewModerationDto): Promise<ProductReview> => {
      const response = await api.patch<ReviewAPIResponse<CreateReviewResponse>>(`/admin/reviews/${id}/moderate`, data);
      return (response?.data?.data || response?.data)?.review;
    },

    // Get review moderation queue (admin)
    getModerationQueue: async (filters?: ReviewFilterDto): Promise<PaginatedResponse<ProductReview>> => {
      const response = await api.get<ReviewAPIResponse<PaginatedResponse<ProductReview>>>('/admin/reviews/moderation-queue', {
        params: filters,
      });
      return response?.data?.data || response?.data;
    },

    // Get review statistics (admin)
    getStats: async (): Promise<{
      total: number;
      pending: number;
      approved: number;
      rejected: number;
      averageRating: number;
    }> => {
      const response = await api.get<ReviewAPIResponse<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        averageRating: number;
      }>>('/admin/reviews/stats');
      return response?.data?.data || response?.data;
    },
  },
};

export default reviewsAPI;

// Re-export backend types for convenience
export type {
  ProductReview,
  CreateReviewDto,
  UpdateReviewDto,
  ReviewFilterDto,
  ReviewStatsDto,
  ReviewWithExtras,
} from '@/types/backend/review';
