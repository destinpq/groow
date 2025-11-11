import { apiClient } from './client';

// Enhanced Product Interfaces
export interface EnhancedProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  discount?: number;
  sku: string;
  stock: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  images: ProductImage[];
  videos?: ProductVideo[];
  category: ProductCategory;
  subcategory?: ProductSubcategory;
  brand: ProductBrand;
  vendor: ProductVendor;
  tags: string[];
  features: ProductFeature[];
  specifications: ProductSpecification[];
  variants: ProductVariant[];
  dimensions?: ProductDimensions;
  weight?: number;
  materials?: string[];
  colors?: string[];
  sizes?: string[];
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  requiresShipping: boolean;
  shippingClass?: string;
  rating: ProductRating;
  reviews: ProductReviewSummary;
  inventory: ProductInventory;
  seo: ProductSEO;
  analytics: ProductAnalytics;
  recommendations: RelatedProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
  isMain: boolean;
  variants?: string[];
}

export interface ProductVideo {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  duration?: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
  level: number;
  parent?: ProductCategory;
  children?: ProductCategory[];
}

export interface ProductSubcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

export interface ProductBrand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  isVerified: boolean;
}

export interface ProductVendor {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  rating: number;
  totalProducts: number;
  totalSales: number;
  isVerified: boolean;
}

export interface ProductFeature {
  id: string;
  name: string;
  value: string;
  group?: string;
  icon?: string;
}

export interface ProductSpecification {
  id: string;
  name: string;
  value: string;
  unit?: string;
  group: string;
  isSearchable: boolean;
  isFilterable: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  attributes: ProductVariantAttribute[];
  images?: string[];
  isActive: boolean;
}

export interface ProductVariantAttribute {
  name: string;
  value: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface ProductRating {
  average: number;
  count: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ProductReviewSummary {
  total: number;
  average: number;
  recent: ProductReview[];
  verified: number;
  withImages: number;
}

export interface ProductReview {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  isVerified: boolean;
  isHelpful: number;
  createdAt: string;
}

export interface ProductInventory {
  inStock: boolean;
  lowStock: boolean;
  stockLevel: number;
  reservedStock: number;
  availableStock: number;
  restockDate?: string;
  trackInventory: boolean;
}

export interface ProductSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  schema?: any;
}

export interface ProductAnalytics {
  views: number;
  clicks: number;
  purchases: number;
  conversationRate: number;
  popularityScore: number;
  trendingScore: number;
  wishlistCount: number;
  shareCount: number;
}

export interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  relationshipType: 'similar' | 'complementary' | 'frequently_bought_together' | 'recently_viewed';
  score: number;
}

// Advanced Search and Filter Interfaces
export interface AdvancedSearchFilters {
  // Basic Filters
  query?: string;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  vendorId?: string;
  
  // Price Filters
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  priceRange?: string; // 'under-25' | '25-50' | '50-100' | '100-200' | 'over-200'
  
  // Rating Filters
  minRating?: number;
  minReviews?: number;
  
  // Availability Filters
  inStock?: boolean;
  lowStock?: boolean;
  freeShipping?: boolean;
  fastDelivery?: boolean;
  
  // Product Attributes
  colors?: string[];
  sizes?: string[];
  materials?: string[];
  features?: string[];
  tags?: string[];
  
  // Specifications (dynamic)
  specifications?: { [key: string]: string | string[] };
  
  // Advanced Filters
  isDigital?: boolean;
  isFeatured?: boolean;
  isVerifiedVendor?: boolean;
  hasVideos?: boolean;
  hasVariants?: boolean;
  
  // Date Filters
  createdAfter?: string;
  createdBefore?: string;
  
  // Social Proof
  minWishlistCount?: number;
  trending?: boolean;
  
  // Location/Shipping
  shippingClass?: string;
  vendorLocation?: string;
  
  // Pagination and Sorting
  page?: number;
  limit?: number;
  sortBy?: ProductSortOption;
  sortOrder?: 'asc' | 'desc';
}

export type ProductSortOption =
  | 'relevance'
  | 'popularity'
  | 'newest'
  | 'oldest'
  | 'price-low'
  | 'price-high'
  | 'rating'
  | 'reviews'
  | 'name-az'
  | 'name-za'
  | 'trending'
  | 'bestsellers'
  | 'featured'
  | 'discount';

export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand' | 'keyword';
  text: string;
  count?: number;
  image?: string;
  url?: string;
}

export interface ProductSearchResponse {
  products: EnhancedProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  facets: SearchFacets;
  suggestions: SearchSuggestion[];
  appliedFilters: AdvancedSearchFilters;
  searchMeta: SearchMetadata;
}

export interface SearchFacets {
  categories: FacetItem[];
  brands: FacetItem[];
  vendors: FacetItem[];
  priceRanges: PriceFacet[];
  ratings: RatingFacet[];
  colors: FacetItem[];
  sizes: FacetItem[];
  materials: FacetItem[];
  features: FacetItem[];
  availability: AvailabilityFacet[];
  specifications: SpecificationFacet[];
}

export interface FacetItem {
  value: string;
  label: string;
  count: number;
  isSelected?: boolean;
}

export interface PriceFacet {
  min: number;
  max: number;
  count: number;
  label: string;
  isSelected?: boolean;
}

export interface RatingFacet {
  rating: number;
  count: number;
  isSelected?: boolean;
}

export interface AvailabilityFacet {
  type: 'in_stock' | 'low_stock' | 'out_of_stock' | 'free_shipping' | 'fast_delivery';
  label: string;
  count: number;
  isSelected?: boolean;
}

export interface SpecificationFacet {
  name: string;
  values: FacetItem[];
}

export interface SearchMetadata {
  searchTime: number;
  didYouMean?: string;
  correctedQuery?: string;
  popularSearches?: string[];
  relatedCategories?: FacetItem[];
  trendingProducts?: RelatedProduct[];
}

// Product Comparison Interface
export interface ProductComparison {
  products: EnhancedProduct[];
  comparisonAttributes: ComparisonAttribute[];
  similarities: string[];
  differences: ProductDifference[];
}

export interface ComparisonAttribute {
  name: string;
  group: string;
  values: { productId: string; value: string; isHighlight?: boolean }[];
  importance: 'high' | 'medium' | 'low';
}

export interface ProductDifference {
  attribute: string;
  productId: string;
  advantage: string;
}

// Wishlist Interface
export interface WishlistItem {
  id: string;
  productId: string;
  product: EnhancedProduct;
  addedAt: string;
  priceAlert?: PriceAlert;
}

export interface PriceAlert {
  targetPrice: number;
  isActive: boolean;
  createdAt: string;
}

// Recommendation Interfaces
export interface RecommendationRequest {
  userId?: string;
  productId?: string;
  categoryId?: string;
  searchQuery?: string;
  behaviorContext?: BehaviorContext;
  limit?: number;
}

export interface BehaviorContext {
  recentlyViewed?: string[];
  recentPurchases?: string[];
  cartItems?: string[];
  searchHistory?: string[];
  categoryPreferences?: string[];
}

export interface RecommendationResponse {
  recommendations: ProductRecommendation[];
  strategy: RecommendationStrategy;
  confidence: number;
  metadata: RecommendationMetadata;
}

export interface ProductRecommendation {
  product: EnhancedProduct;
  score: number;
  reason: string;
  type: RecommendationType;
}

export type RecommendationType =
  | 'similar_products'
  | 'frequently_bought_together'
  | 'recently_viewed'
  | 'trending'
  | 'personalized'
  | 'category_bestsellers'
  | 'price_similar'
  | 'brand_similar'
  | 'complementary';

export interface RecommendationStrategy {
  primary: string;
  fallback: string[];
  weights: { [key: string]: number };
}

export interface RecommendationMetadata {
  timestamp: string;
  version: string;
  ab_test_group?: string;
  performance_metrics?: {
    click_rate?: number;
    conversion_rate?: number;
  };
}

// Enhanced Product API Service
export const enhancedProductAPI = {
  // Advanced Search with filtering, sorting, and faceting
  searchProducts: async (filters: AdvancedSearchFilters): Promise<ProductSearchResponse> => {
    const response = await apiClient.post('/products/advanced-search', filters);
    return response.data;
  },

  // Get product by ID with all enhanced data
  getProduct: async (id: string, includeRecommendations = true): Promise<EnhancedProduct> => {
    const response = await apiClient.get(`/products/${id}`, {
      params: { include_recommendations: includeRecommendations }
    });
    return response.data;
  },

  // Get search suggestions as user types
  getSearchSuggestions: async (query: string, limit = 10): Promise<SearchSuggestion[]> => {
    const response = await apiClient.get('/products/search-suggestions', {
      params: { q: query, limit }
    });
    return response.data;
  },

  // Get available filter options for a category/search
  getFilterOptions: async (categoryId?: string, query?: string): Promise<SearchFacets> => {
    const response = await apiClient.get('/products/filter-options', {
      params: { category_id: categoryId, query }
    });
    return response.data;
  },

  // Product Comparison
  compareProducts: async (productIds: string[]): Promise<ProductComparison> => {
    const response = await apiClient.post('/products/compare', { product_ids: productIds });
    return response.data;
  },

  // Wishlist Management
  getWishlist: async (): Promise<WishlistItem[]> => {
    const response = await apiClient.get('/wishlist');
    return response.data;
  },

  addToWishlist: async (productId: string): Promise<WishlistItem> => {
    const response = await apiClient.post('/wishlist', { product_id: productId });
    return response.data;
  },

  removeFromWishlist: async (productId: string): Promise<void> => {
    await apiClient.delete(`/wishlist/${productId}`);
  },

  // Price Alerts
  createPriceAlert: async (productId: string, targetPrice: number): Promise<PriceAlert> => {
    const response = await apiClient.post('/price-alerts', {
      product_id: productId,
      target_price: targetPrice
    });
    return response.data;
  },

  // Product Recommendations
  getRecommendations: async (request: RecommendationRequest): Promise<RecommendationResponse> => {
    const response = await apiClient.post('/products/recommendations', request);
    return response.data;
  },

  // Similar Products
  getSimilarProducts: async (productId: string, limit = 12): Promise<EnhancedProduct[]> => {
    const response = await apiClient.get(`/products/${productId}/similar`, {
      params: { limit }
    });
    return response.data;
  },

  // Frequently Bought Together
  getFrequentlyBoughtTogether: async (productId: string): Promise<EnhancedProduct[]> => {
    const response = await apiClient.get(`/products/${productId}/frequently-bought-together`);
    return response.data;
  },

  // Recently Viewed Products
  getRecentlyViewed: async (limit = 10): Promise<EnhancedProduct[]> => {
    const response = await apiClient.get('/products/recently-viewed', {
      params: { limit }
    });
    return response.data;
  },

  // Track product view for recommendations
  trackProductView: async (productId: string): Promise<void> => {
    await apiClient.post(`/products/${productId}/track-view`);
  },

  // Get trending products
  getTrendingProducts: async (categoryId?: string, limit = 20): Promise<EnhancedProduct[]> => {
    const response = await apiClient.get('/products/trending', {
      params: { category_id: categoryId, limit }
    });
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (categoryId?: string, limit = 20): Promise<EnhancedProduct[]> => {
    const response = await apiClient.get('/products/featured', {
      params: { category_id: categoryId, limit }
    });
    return response.data;
  },

  // Get bestselling products
  getBestsellingProducts: async (categoryId?: string, period = '30d', limit = 20): Promise<EnhancedProduct[]> => {
    const response = await apiClient.get('/products/bestsellers', {
      params: { category_id: categoryId, period, limit }
    });
    return response.data;
  },

  // Advanced analytics
  getProductAnalytics: async (productId: string, period = '30d'): Promise<ProductAnalytics> => {
    const response = await apiClient.get(`/products/${productId}/analytics`, {
      params: { period }
    });
    return response.data;
  },

  // Bulk operations for admin
  bulkUpdateProducts: async (updates: { id: string; changes: Partial<EnhancedProduct> }[]): Promise<void> => {
    await apiClient.put('/products/bulk-update', { updates });
  },

  // Export product data
  exportProducts: async (filters: AdvancedSearchFilters, format: 'csv' | 'xlsx' = 'xlsx'): Promise<string> => {
    const response = await apiClient.post('/products/export', {
      filters,
      format
    });
    return response.data.downloadUrl;
  },

  // Advanced product creation/update (admin only)
  createProduct: async (product: Partial<EnhancedProduct>): Promise<EnhancedProduct> => {
    const response = await apiClient.post('/products', product);
    return response.data;
  },

  updateProduct: async (id: string, updates: Partial<EnhancedProduct>): Promise<EnhancedProduct> => {
    const response = await apiClient.put(`/products/${id}`, updates);
    return response.data;
  },

  // Product inventory management
  updateInventory: async (productId: string, inventory: Partial<ProductInventory>): Promise<ProductInventory> => {
    const response = await apiClient.put(`/products/${productId}/inventory`, inventory);
    return response.data;
  },

  // Product reviews management
  getProductReviews: async (
    productId: string,
    page = 1,
    limit = 10,
    sort = 'newest'
  ): Promise<{ reviews: ProductReview[]; total: number }> => {
    const response = await apiClient.get(`/products/${productId}/reviews`, {
      params: { page, limit, sort }
    });
    return response.data;
  },
};