import { api } from './client';

// Product Detail API for individual product pages
export interface ProductDetailData {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  variants: ProductVariant[];
  specifications: any;
  reviews: ProductReview[];
  related: Product[];
  stock: number;
  category: string;
  brand: string;
  sku: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  attributes: any;
}

export interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export const productDetailAPI = {
  // Get product by ID
  getProductById: async (productId: string) => {
    const response = await api.get(`/products/${productId}/detail`);
    return response.data;
  },

  // Get product variants
  getProductVariants: async (productId: string) => {
    const response = await api.get(`/products/${productId}/variants`);
    return response.data;
  },

  // Get product reviews
  getProductReviews: async (productId: string, page = 1, limit = 10) => {
    const response = await api.get(`/products/${productId}/reviews`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (productId: string, limit = 8) => {
    const response = await api.get(`/products/${productId}/related`, {
      params: { limit }
    });
    return response.data;
  },

  // Add product review
  addReview: async (productId: string, review: {
    rating: number;
    comment: string;
    title?: string;
  }) => {
    const response = await api.post(`/products/${productId}/reviews`, review);
    return response.data;
  },

  // Check stock availability
  checkStock: async (productId: string, variantId?: string, quantity = 1) => {
    const response = await api.get(`/products/${productId}/stock`, {
      params: { variantId, quantity }
    });
    return response.data;
  },

  // Get price history
  getPriceHistory: async (productId: string, days = 30) => {
    const response = await api.get(`/products/${productId}/price-history`, {
      params: { days }
    });
    return response.data;
  },

  // Track product view
  trackView: async (productId: string) => {
    const response = await api.post(`/products/${productId}/view`);
    return response.data;
  },

  // Get product SEO data
  getSEOData: async (productId: string) => {
    const response = await api.get(`/products/${productId}/seo`);
    return response.data;
  },

  // Get product analytics
  getAnalytics: async (productId: string) => {
    const response = await api.get(`/products/${productId}/analytics`);
    return response.data;
  },

  // Update product view count
  updateViewCount: async (productId: string) => {
    const response = await api.put(`/products/${productId}/view-count`);
    return response.data;
  },

  // Check wishlist status
  checkWishlistStatus: async (productId: string) => {
    const response = await api.get(`/products/${productId}/wishlist-status`);
    return response.data;
  }
};

export default productDetailAPI;