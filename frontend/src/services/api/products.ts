import api from './client';
import { 
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilterRequest,
  ProductStatusUpdateRequest,
  ProductStockUpdateRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateBrandRequest,
  UpdateBrandRequest,
  ProductResponse,
  ProductsResponse,
  ProductListResponse,
  CategoryResponse,
  CategoryListResponse,
  CategoriesResponse,
  CategoryHierarchyResponse,
  BrandResponse,
  BrandListResponse,
  type ProductAPI
} from '@/types/api/products';
import { ApiResponse, BaseFilter } from '@/types/api/common';

// Product API Service Implementation
export const productAPI: ProductAPI = {
  // Product CRUD
  createProduct: async (request: CreateProductRequest): Promise<ProductResponse> => {
    const response = await api.post<ProductResponse>('//products', request);
    return response.data;
  },

  getProducts: async (filters?: ProductFilterRequest): Promise<ProductListResponse> => {
    const response = await api.get<ProductListResponse>('//products', {
      params: filters,
    });
    return response.data;
  },

  getFeaturedProducts: async (limit?: number): Promise<ProductsResponse> => {
    const response = await api.get<ProductsResponse>('//products/featured', {
      params: { limit },
    });
    return response.data;
  },

  getRecommendedProducts: async (limit?: number): Promise<ProductsResponse> => {
    const response = await api.get<ProductsResponse>('//products/recommended', {
      params: { limit },
    });
    return response.data;
  },

  getProductsByVendor: async (vendorId: string, filters?: ProductFilterRequest): Promise<ProductListResponse> => {
    const response = await api.get<ProductListResponse>(`//products/vendor/${vendorId}`, {
      params: filters,
    });
    return response.data;
  },

  getProductBySlug: async (slug: string): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>(`//products/slug/${slug}`);
    return response.data;
  },

  getProductById: async (id: string): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>(`//products/${id}`);
    return response.data;
  },

  updateProduct: async (id: string, request: UpdateProductRequest): Promise<ProductResponse> => {
    const response = await api.patch<ProductResponse>(`//products/${id}`, request);
    return response.data;
  },

  updateProductStatus: async (id: string, request: ProductStatusUpdateRequest): Promise<ProductResponse> => {
    const response = await api.patch<ProductResponse>(`//products/${id}/status`, request);
    return response.data;
  },

  updateProductStock: async (id: string, request: ProductStockUpdateRequest): Promise<ProductResponse> => {
    const response = await api.patch<ProductResponse>(`//products/${id}/stock`, request);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`//products/${id}`);
    return response.data;
  },

  // Category endpoints
  createCategory: async (request: CreateCategoryRequest): Promise<CategoryResponse> => {
    const response = await api.post<CategoryResponse>('//categories', request);
    return response.data;
  },

  getCategories: async (filters?: BaseFilter): Promise<CategoryListResponse> => {
    const response = await api.get<CategoryListResponse>('//categories', {
      params: filters,
    });
    return response.data;
  },

  getCategoryHierarchy: async (): Promise<CategoryHierarchyResponse> => {
    const response = await api.get<CategoryHierarchyResponse>('//categories/hierarchy');
    return response.data;
  },

  getSubcategories: async (id: string): Promise<CategoriesResponse> => {
    const response = await api.get<CategoriesResponse>(`//categories/${id}/subcategories`);
    return response.data;
  },

  getCategoryBySlug: async (slug: string): Promise<CategoryResponse> => {
    const response = await api.get<CategoryResponse>(`//categories/slug/${slug}`);
    return response.data;
  },

  getCategoryById: async (id: string): Promise<CategoryResponse> => {
    const response = await api.get<CategoryResponse>(`//categories/${id}`);
    return response.data;
  },

  updateCategory: async (id: string, request: UpdateCategoryRequest): Promise<CategoryResponse> => {
    const response = await api.patch<CategoryResponse>(`//categories/${id}`, request);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`//categories/${id}`);
    return response.data;
  },

  // Brand endpoints
  createBrand: async (request: CreateBrandRequest): Promise<BrandResponse> => {
    const response = await api.post<BrandResponse>('//brands', request);
    return response.data;
  },

  getBrands: async (filters?: BaseFilter): Promise<BrandListResponse> => {
    const response = await api.get<BrandListResponse>('//brands', {
      params: filters,
    });
    return response.data;
  },

  getBrandBySlug: async (slug: string): Promise<BrandResponse> => {
    const response = await api.get<BrandResponse>(`//brands/slug/${slug}`);
    return response.data;
  },

  getBrandById: async (id: string): Promise<BrandResponse> => {
    const response = await api.get<BrandResponse>(`//brands/${id}`);
    return response.data;
  },

  updateBrand: async (id: string, request: UpdateBrandRequest): Promise<BrandResponse> => {
    const response = await api.patch<BrandResponse>(`//brands/${id}`, request);
    return response.data;
  },

  deleteBrand: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`//brands/${id}`);
    return response.data;
  },
};

export default productAPI;

// Type exports for index.ts compatibility
export type ProductFilters = ProductFilterRequest;
export type CreateProductData = CreateProductRequest;
export type PaginatedResponse = ProductListResponse;
