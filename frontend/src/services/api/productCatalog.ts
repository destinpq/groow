/**
 * Product Catalog API Services
 * Advanced product browsing, filtering, and catalog management
 */
import { api } from './client';

export interface CatalogFilter {
  categories?: string[];
  brands?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
  attributes?: Record<string, any>;
  tags?: string[];
}

export interface CatalogSort {
  field: 'price' | 'name' | 'rating' | 'created_at' | 'popularity' | 'sales';
  direction: 'asc' | 'desc';
}

export interface CatalogSearchParams {
  query?: string;
  filters?: CatalogFilter;
  sort?: CatalogSort;
  page?: number;
  limit?: number;
  view?: 'grid' | 'list';
}

export interface ProductCatalogItem {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity?: number;
  brand?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  featured: boolean;
  isNew: boolean;
  onSale: boolean;
  variations?: Array<{
    id: string;
    name: string;
    value: string;
    price?: number;
  }>;
}

export interface CatalogResponse {
  products: ProductCatalogItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: {
    categories: Array<{ id: string; name: string; count: number }>;
    brands: Array<{ id: string; name: string; count: number }>;
    priceRange: { min: number; max: number };
    attributes: Array<{
      name: string;
      values: Array<{ value: string; count: number }>;
    }>;
  };
}

export interface CategoryHierarchy {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  level: number;
  children?: CategoryHierarchy[];
  productCount: number;
  image?: string;
  description?: string;
}

export interface SearchSuggestions {
  queries: string[];
  categories: Array<{ id: string; name: string; slug: string }>;
  brands: Array<{ id: string; name: string; slug: string }>;
  products: Array<{ id: string; name: string; slug: string; image: string }>;
}

export const productCatalogAPI = {
  /**
   * Get products with advanced filtering and pagination
   */
  getProducts: async (params: CatalogSearchParams = {}): Promise<CatalogResponse> => {
    const { data } = await api.get('/catalog/products', { params });
    return data;
  },

  /**
   * Search products with autocomplete
   */
  searchProducts: async (query: string, limit: number = 10): Promise<CatalogResponse> => {
    const { data } = await api.get('/catalog/search', {
      params: { query, limit },
    });
    return data;
  },

  /**
   * Get search suggestions for autocomplete
   */
  getSearchSuggestions: async (query: string): Promise<SearchSuggestions> => {
    const { data } = await api.get('/catalog/suggestions', {
      params: { query },
    });
    return data;
  },

  /**
   * Get category hierarchy
   */
  getCategoryHierarchy: async (): Promise<CategoryHierarchy[]> => {
    const { data } = await api.get('/catalog/categories/hierarchy');
    return data;
  },

  /**
   * Get products by category
   */
  getProductsByCategory: async (
    categoryId: string,
    params: Omit<CatalogSearchParams, 'filters'> = {}
  ): Promise<CatalogResponse> => {
    const { data } = await api.get(`/catalog/categories/${categoryId}/products`, {
      params,
    });
    return data;
  },

  /**
   * Get products by brand
   */
  getProductsByBrand: async (
    brandId: string,
    params: Omit<CatalogSearchParams, 'filters'> = {}
  ): Promise<CatalogResponse> => {
    const { data } = await api.get(`/catalog/brands/${brandId}/products`, {
      params,
    });
    return data;
  },

  /**
   * Get featured products
   */
  getFeaturedProducts: async (limit: number = 12): Promise<ProductCatalogItem[]> => {
    const { data } = await api.get('/catalog/featured', { params: { limit } });
    return data;
  },

  /**
   * Get new arrivals
   */
  getNewArrivals: async (limit: number = 12): Promise<ProductCatalogItem[]> => {
    const { data } = await api.get('/catalog/new-arrivals', { params: { limit } });
    return data;
  },

  /**
   * Get products on sale
   */
  getSaleProducts: async (params: CatalogSearchParams = {}): Promise<CatalogResponse> => {
    const { data } = await api.get('/catalog/sale', { params });
    return data;
  },

  /**
   * Get recommended products based on viewing history
   */
  getRecommendedProducts: async (
    productId?: string,
    limit: number = 12
  ): Promise<ProductCatalogItem[]> => {
    const { data } = await api.get('/catalog/recommended', {
      params: { productId, limit },
    });
    return data;
  },

  /**
   * Get related products
   */
  getRelatedProducts: async (productId: string, limit: number = 8): Promise<ProductCatalogItem[]> => {
    const { data } = await api.get(`/catalog/products/${productId}/related`, {
      params: { limit },
    });
    return data;
  },

  /**
   * Get recently viewed products
   */
  getRecentlyViewed: async (limit: number = 8): Promise<ProductCatalogItem[]> => {
    const { data } = await api.get('/catalog/recently-viewed', { params: { limit } });
    return data;
  },

  /**
   * Track product view
   */
  trackProductView: async (productId: string) => {
    const { data } = await api.post('/catalog/track-view', { productId });
    return data;
  },

  /**
   * Get filter options for current search/category
   */
  getFilterOptions: async (params: CatalogSearchParams = {}) => {
    const { data } = await api.get('/catalog/filters', { params });
    return data;
  },

  /**
   * Save search query for trending analysis
   */
  saveSearchQuery: async (query: string, resultsCount: number) => {
    const { data } = await api.post('/catalog/search-analytics', {
      query,
      resultsCount,
    });
    return data;
  },
};

export default productCatalogAPI;