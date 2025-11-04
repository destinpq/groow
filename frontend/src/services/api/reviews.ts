import api from './client';
import { PaginatedResponse } from './products';

// Types
export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  notHelpful: number;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  productId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// Reviews API Service
export const reviewsAPI = {
  // Create review
  create: async (data: CreateReviewData): Promise<Review> => {
    const response = await api.post<Review>('/reviews', data);
    return response.data;
  },

  // Get product reviews
  getProductReviews: async (
    productId: string,
    filters?: {
      rating?: number;
      verified?: boolean;
      page?: number;
      limit?: number;
    }
  ): Promise<PaginatedResponse<Review>> => {
    const response = await api.get<PaginatedResponse<Review>>(`/products/${productId}/reviews`, {
      params: filters,
    });
    return response.data;
  },

  // Get customer reviews
  getCustomerReviews: async (filters?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Review>> => {
    const response = await api.get<PaginatedResponse<Review>>('/reviews/customer', {
      params: filters,
    });
    return response.data;
  },

  // Update review
  update: async (id: string, data: Partial<CreateReviewData>): Promise<Review> => {
    const response = await api.put<Review>(`/reviews/${id}`, data);
    return response.data;
  },

  // Delete review
  delete: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },

  // Mark review as helpful
  markHelpful: async (id: string): Promise<Review> => {
    const response = await api.post<Review>(`/reviews/${id}/helpful`);
    return response.data;
  },

  // Mark review as not helpful
  markNotHelpful: async (id: string): Promise<Review> => {
    const response = await api.post<Review>(`/reviews/${id}/not-helpful`);
    return response.data;
  },

  // Upload review images
  uploadImages: async (files: File[]): Promise<{ urls: string[] }> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    
    const response = await api.post<{ urls: string[] }>('/reviews/upload-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Get product review stats
  getProductStats: async (productId: string): Promise<ReviewStats> => {
    const response = await api.get<ReviewStats>(`/products/${productId}/reviews/stats`);
    return response.data;
  },

  // Approve review (admin)
  approve: async (id: string): Promise<Review> => {
    const response = await api.post<Review>(`/reviews/${id}/approve`);
    return response.data;
  },

  // Reject review (admin)
  reject: async (id: string, reason?: string): Promise<Review> => {
    const response = await api.post<Review>(`/reviews/${id}/reject`, { reason });
    return response.data;
  },

  // Get all reviews (admin)
  getAll: async (filters?: {
    status?: string;
    rating?: number;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Review>> => {
    const response = await api.get<PaginatedResponse<Review>>('/reviews', {
      params: filters,
    });
    return response.data;
  },
};

export default reviewsAPI;
