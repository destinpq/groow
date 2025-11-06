import request from '@/utils/request';

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  brand: string;
  category: string;
  subcategory?: string;
  description: string;
  images: string[];
  specifications: Array<{ label: string; value: string }>;
  variants: Array<{
    id: number;
    name: string;
    stock: number;
    available: boolean;
    price?: number;
  }>;
  vendor: {
    id: number;
    name: string;
    logo: string;
    rating: number;
    productCount: number;
    verified: boolean;
  };
  tags?: string[];
  weight?: number;
  dimensions?: string;
  warranty?: string;
  returnPolicy?: string;
  shippingInfo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  reported: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: number;
  level: number;
  productCount: number;
  isActive: boolean;
  children?: ProductCategory[];
}

export interface ProductBrand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  productCount: number;
  isActive: boolean;
}

export interface ProductSearchFilters {
  keyword?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  vendorId?: number;
  tags?: string[];
  sortBy?: 'name' | 'price' | 'rating' | 'newest' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: {
    categories: ProductCategory[];
    brands: ProductBrand[];
    priceRange: { min: number; max: number };
    ratings: number[];
  };
}

export interface ProductRatingBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
  averageRating: number;
  totalReviews: number;
}

export interface RelatedProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  discount?: number;
  inStock: boolean;
}

export interface ProductComparison {
  id: number;
  name: string;
  price: number;
  rating: number;
  specifications: Array<{ label: string; value: string }>;
  image: string;
  brand: string;
  inStock: boolean;
}

// Product Management APIs
export const productAPI = {
  // Get product by ID or slug
  getProduct: async (idOrSlug: string | number): Promise<Product> => {
    return request.get(`/api/products/${idOrSlug}`);
  },

  // Search and filter products
  searchProducts: async (filters: ProductSearchFilters): Promise<ProductListResponse> => {
    return request.get('/api/products/search', { params: filters });
  },

  // Get all products with pagination
  getProducts: async (page = 1, limit = 20): Promise<ProductListResponse> => {
    return request.get('/api/products', { params: { page, limit } });
  },

  // Get products by category
  getProductsByCategory: async (categoryId: number, page = 1, limit = 20): Promise<ProductListResponse> => {
    return request.get(`/api/products/category/${categoryId}`, { params: { page, limit } });
  },

  // Get products by brand
  getProductsByBrand: async (brandId: number, page = 1, limit = 20): Promise<ProductListResponse> => {
    return request.get(`/api/products/brand/${brandId}`, { params: { page, limit } });
  },

  // Get products by vendor
  getProductsByVendor: async (vendorId: number, page = 1, limit = 20): Promise<ProductListResponse> => {
    return request.get(`/api/products/vendor/${vendorId}`, { params: { page, limit } });
  },

  // Get featured/trending products
  getFeaturedProducts: async (limit = 10): Promise<Product[]> => {
    return request.get('/api/products/featured', { params: { limit } });
  },

  // Get new arrivals
  getNewArrivals: async (limit = 10): Promise<Product[]> => {
    return request.get('/api/products/new-arrivals', { params: { limit } });
  },

  // Get best sellers
  getBestSellers: async (limit = 10): Promise<Product[]> => {
    return request.get('/api/products/best-sellers', { params: { limit } });
  },

  // Get related products
  getRelatedProducts: async (productId: number, limit = 8): Promise<RelatedProduct[]> => {
    return request.get(`/api/products/${productId}/related`, { params: { limit } });
  },

  // Get products for comparison
  getProductsForComparison: async (productIds: number[]): Promise<ProductComparison[]> => {
    return request.post('/api/products/compare', { productIds });
  },

  // Product availability check
  checkAvailability: async (productId: number, variantId?: number): Promise<{
    available: boolean;
    stock: number;
    estimatedDelivery?: string;
  }> => {
    return request.get(`/api/products/${productId}/availability`, { 
      params: variantId ? { variantId } : {} 
    });
  },

  // Product quick view
  getProductQuickView: async (productId: number): Promise<{
    id: number;
    name: string;
    price: number;
    rating: number;
    images: string[];
    variants: Product['variants'];
    inStock: boolean;
  }> => {
    return request.get(`/api/products/${productId}/quick-view`);
  },

  // Get product suggestions (for autocomplete)
  getProductSuggestions: async (query: string, limit = 10): Promise<Array<{
    id: number;
    name: string;
    image: string;
    price: number;
    category: string;
  }>> => {
    return request.get('/api/products/suggestions', { params: { q: query, limit } });
  },
};

// Product Review APIs
export const productReviewAPI = {
  // Get product reviews
  getProductReviews: async (productId: number, page = 1, limit = 10): Promise<{
    reviews: ProductReview[];
    total: number;
    page: number;
    limit: number;
    ratingBreakdown: ProductRatingBreakdown;
  }> => {
    return request.get(`/api/products/${productId}/reviews`, { params: { page, limit } });
  },

  // Add product review
  addReview: async (productId: number, review: {
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
  }): Promise<ProductReview> => {
    return request.post(`/api/products/${productId}/reviews`, review);
  },

  // Update review
  updateReview: async (reviewId: number, review: {
    rating?: number;
    title?: string;
    comment?: string;
    images?: string[];
  }): Promise<ProductReview> => {
    return request.put(`/api/reviews/${reviewId}`, review);
  },

  // Delete review
  deleteReview: async (reviewId: number): Promise<void> => {
    return request.delete(`/api/reviews/${reviewId}`);
  },

  // Mark review as helpful
  markReviewHelpful: async (reviewId: number): Promise<void> => {
    return request.post(`/api/reviews/${reviewId}/helpful`);
  },

  // Report review
  reportReview: async (reviewId: number, reason: string): Promise<void> => {
    return request.post(`/api/reviews/${reviewId}/report`, { reason });
  },

  // Get user's reviews
  getUserReviews: async (page = 1, limit = 10): Promise<{
    reviews: ProductReview[];
    total: number;
    page: number;
    limit: number;
  }> => {
    return request.get('/api/reviews/my-reviews', { params: { page, limit } });
  },
};

// Category Management APIs
export const categoryAPI = {
  // Get all categories (tree structure)
  getCategories: async (): Promise<ProductCategory[]> => {
    return request.get('/api/categories');
  },

  // Get category by ID
  getCategory: async (categoryId: number): Promise<ProductCategory> => {
    return request.get(`/api/categories/${categoryId}`);
  },

  // Get subcategories
  getSubcategories: async (parentId: number): Promise<ProductCategory[]> => {
    return request.get(`/api/categories/${parentId}/subcategories`);
  },

  // Get category hierarchy/breadcrumb
  getCategoryPath: async (categoryId: number): Promise<ProductCategory[]> => {
    return request.get(`/api/categories/${categoryId}/path`);
  },

  // Get popular categories
  getPopularCategories: async (limit = 10): Promise<ProductCategory[]> => {
    return request.get('/api/categories/popular', { params: { limit } });
  },
};

// Brand Management APIs
export const brandAPI = {
  // Get all brands
  getBrands: async (page = 1, limit = 50): Promise<{
    brands: ProductBrand[];
    total: number;
    page: number;
    limit: number;
  }> => {
    return request.get('/api/brands', { params: { page, limit } });
  },

  // Get brand by ID
  getBrand: async (brandId: number): Promise<ProductBrand> => {
    return request.get(`/api/brands/${brandId}`);
  },

  // Get popular brands
  getPopularBrands: async (limit = 20): Promise<ProductBrand[]> => {
    return request.get('/api/brands/popular', { params: { limit } });
  },

  // Search brands
  searchBrands: async (query: string): Promise<ProductBrand[]> => {
    return request.get('/api/brands/search', { params: { q: query } });
  },
};

// Wishlist APIs
export const wishlistAPI = {
  // Get user's wishlist
  getWishlist: async (page = 1, limit = 20): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> => {
    return request.get('/api/wishlist', { params: { page, limit } });
  },

  // Add to wishlist
  addToWishlist: async (productId: number): Promise<void> => {
    return request.post('/api/wishlist', { productId });
  },

  // Remove from wishlist
  removeFromWishlist: async (productId: number): Promise<void> => {
    return request.delete(`/api/wishlist/${productId}`);
  },

  // Check if product is in wishlist
  isInWishlist: async (productId: number): Promise<{ inWishlist: boolean }> => {
    return request.get(`/api/wishlist/check/${productId}`);
  },

  // Clear wishlist
  clearWishlist: async (): Promise<void> => {
    return request.delete('/api/wishlist');
  },

  // Move wishlist items to cart
  moveToCart: async (productIds: number[]): Promise<void> => {
    return request.post('/api/wishlist/move-to-cart', { productIds });
  },
};

// Product Analytics APIs (for admin/vendor)
export const productAnalyticsAPI = {
  // Get product performance metrics
  getProductMetrics: async (productId: number, period = '7d'): Promise<{
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
    rating: number;
    inventory: number;
    trends: Array<{ date: string; views: number; sales: number }>;
  }> => {
    return request.get(`/api/products/${productId}/metrics`, { params: { period } });
  },

  // Get popular search terms
  getPopularSearchTerms: async (limit = 20): Promise<Array<{
    term: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }>> => {
    return request.get('/api/products/popular-searches', { params: { limit } });
  },

  // Get category performance
  getCategoryPerformance: async (period = '30d'): Promise<Array<{
    categoryId: number;
    categoryName: string;
    views: number;
    sales: number;
    revenue: number;
    conversion: number;
  }>> => {
    return request.get('/api/categories/performance', { params: { period } });
  },
};

export default productAPI;